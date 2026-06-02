// Shared helpers for the AI novedades historical archive and the
// "throwback" rotation used when there is no fresh news to send.
//
// State lives in committed JSON files because the workflow runs on
// ephemeral GitHub Actions runners; nothing on local disk survives.

import { existsSync, readFileSync, writeFileSync } from 'fs';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

export function loadJson(path, fallback) {
  try {
    if (!existsSync(path)) return fallback;
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (_) {
    return fallback;
  }
}

export function saveJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

export function itemKey(item) {
  const url = String(item.source_url || '').replace(/[?#].*$/, '').replace(/\/$/, '').toLowerCase();
  return url || String(item.title || '').trim().toLowerCase();
}

function withinYears(publishedAt, now, maxYears) {
  const t = new Date(publishedAt).getTime();
  if (Number.isNaN(t)) return false;
  return t >= now - maxYears * MS_PER_YEAR;
}

// Merge fresh items into the archive, dedupe by key, drop anything older
// than maxYears. Keeps the archive bounded so it never grows forever.
export function mergeArchive(archive, incoming, { now = Date.now(), maxYears = 3, cap = 600 } = {}) {
  const byKey = new Map();
  for (const it of archive || []) byKey.set(it.key || itemKey(it), it);

  for (const raw of incoming || []) {
    const key = itemKey(raw);
    if (!key || byKey.has(key)) continue;
    byKey.set(key, {
      key,
      technology: raw.technology || 'AI trends',
      title: raw.title || '',
      summary: raw.summary || '',
      source: raw.source || '',
      source_url: raw.source_url || '',
      published_at: raw.published_at || new Date(now).toISOString(),
      score: typeof raw.score === 'number' ? raw.score : 0,
      why_it_matters: raw.why_it_matters || '',
    });
  }

  return Array.from(byKey.values())
    .filter((it) => withinYears(it.published_at, now, maxYears))
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    .slice(0, cap);
}

// Pick the next batch of old notes to resurface. Never repeats an item until
// every eligible note has been shown once; then it starts a fresh cycle.
export function selectThrowback(archive, shownKeys, { now = Date.now(), maxYears = 3, count = 3 } = {}) {
  const pool = (archive || []).filter((it) => withinYears(it.published_at, now, maxYears));
  if (pool.length === 0) return { picked: [], shown: shownKeys || [], cycleReset: false };

  let shownSet = new Set(shownKeys || []);
  let candidates = pool.filter((it) => !shownSet.has(it.key));
  let cycleReset = false;

  if (candidates.length === 0) {
    // Everyone has been shown at least once — start the rotation over.
    cycleReset = true;
    shownSet = new Set();
    candidates = pool.slice();
  }

  // Oldest first: these are "notas viejas".
  candidates.sort((a, b) => new Date(a.published_at) - new Date(b.published_at));
  const picked = candidates.slice(0, count);
  for (const p of picked) shownSet.add(p.key);

  return { picked, shown: Array.from(shownSet), cycleReset };
}
