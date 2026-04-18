// fetch-news.js — Daily news fetcher: RSS (cybersec) + NewsAPI (devops)
// Uso: node fetch-news.js
// Cron: 0 11 * * * cd /path/to/scripts && node fetch-news.js >> /var/log/fetch-news.log 2>&1

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import RSSParser from 'rss-parser';
import axios from 'axios';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Cargar .env si existe
try {
  const { config } = await import('dotenv');
  config({ path: resolve(__dirname, '.env') });
} catch (_) {}

// --- Configuracion ---
const RSS_FEEDS = [
  { url: 'https://feeds.feedburner.com/TheHackersNews', source: 'The Hacker News' },
  { url: 'https://www.bleepingcomputer.com/feed/',     source: 'BleepingComputer' },
  { url: 'https://krebsonsecurity.com/feed/',          source: 'Krebs on Security' },
];

const NEWSAPI_URL   = 'https://newsapi.org/v2/everything';
const NEWSAPI_KEY   = process.env.NEWS_API_KEY || '';
const NEWSAPI_QUERY = 'devops OR kubernetes OR terraform OR "CI/CD" OR "gitlab" OR "jenkins"';
const MAX_CHARS     = 220;
const OUTPUT_PATH   = resolve(__dirname, process.env.NEWS_JSON_PATH || '../assets/data/news.json');

// --- Funciones puras (exportadas para tests) ---

export function filterLast48h(items) {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  return items.filter(function (item) {
    if (!item.pubDate) return false;
    const d = new Date(item.pubDate);
    return !isNaN(d.getTime()) && d.getTime() >= cutoff;
  });
}

export function truncateSummary(text, maxLen) {
  if (!text) return '';
  // Eliminar HTML tags
  const clean = String(text).replace(/<[^>]+>/g, '').trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen).trimEnd() + '...';
}

export function selectTop3(cybersecItems, devopsItems) {
  // Garantizar minimo 1 de cada categoria, el tercero el mas reciente
  const result = [];

  if (cybersecItems.length > 0) result.push(cybersecItems[0]);
  if (devopsItems.length > 0)   result.push(devopsItems[0]);

  // Tercer item: el mas reciente de cualquier categoria (que no este ya incluido)
  const remaining = [
    ...cybersecItems.slice(1),
    ...devopsItems.slice(1),
  ].sort(function (a, b) {
    return new Date(b.pubDate || 0) - new Date(a.pubDate || 0);
  });

  if (result.length < 3 && remaining.length > 0) {
    result.push(remaining[0]);
  }

  return result.slice(0, 3);
}

export function buildItem(raw, id) {
  const url = String(raw.link || '');
  const safeUrl = /^https?:\/\//i.test(url) ? url : '#';

  return {
    id:           id,
    category:     raw.category || 'cybersecurity',
    title:        String(raw.title || '').trim(),
    summary:      truncateSummary(raw.content || raw.contentSnippet || raw.description || '', MAX_CHARS),
    source:       String(raw.source || '').trim(),
    source_url:   safeUrl,
    published_at: raw.pubDate ? new Date(raw.pubDate).toISOString() : new Date().toISOString(),
  };
}

// --- Funciones de fetch (no exportadas, tienen side effects de red) ---

async function fetchRSSFeeds() {
  const parser = new RSSParser({ timeout: 10000 });
  const allItems = [];

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      const items = (parsed.items || []).map(function (item) {
        return Object.assign({}, item, {
          category: 'cybersecurity',
          source: feed.source,
        });
      });
      allItems.push(...items);
      console.log('[RSS] ' + feed.source + ': ' + items.length + ' items');
    } catch (err) {
      console.error('[RSS] Error fetching ' + feed.source + ':', err.message);
    }
  }

  return filterLast48h(allItems);
}

async function fetchNewsAPI() {
  if (!NEWSAPI_KEY) {
    console.warn('[NewsAPI] NEWS_API_KEY no configurado — saltando');
    return [];
  }

  try {
    const from = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const res = await axios.get(NEWSAPI_URL, {
      params: {
        q:        NEWSAPI_QUERY,
        from:     from,
        sortBy:   'publishedAt',
        language: 'en',
        pageSize: 10,
        apiKey:   NEWSAPI_KEY,
      },
      timeout: 10000,
    });

    const articles = (res.data.articles || []).map(function (a) {
      return {
        title:           a.title,
        content:         a.description,
        contentSnippet:  a.description,
        link:            a.url,
        pubDate:         a.publishedAt,
        category:        'devops',
        source:          (a.source && a.source.name) ? a.source.name : 'NewsAPI',
      };
    });

    console.log('[NewsAPI] ' + articles.length + ' articles');
    return filterLast48h(articles);
  } catch (err) {
    console.error('[NewsAPI] Error:', err.message);
    return [];
  }
}

// --- Main ---

async function main() {
  console.log('[fetch-news] Iniciando — ' + new Date().toISOString());

  const [cybersecItems, devopsItems] = await Promise.all([
    fetchRSSFeeds(),
    fetchNewsAPI(),
  ]);

  console.log('[fetch-news] Cybersec items last 48h: ' + cybersecItems.length);
  console.log('[fetch-news] DevOps items last 48h:   ' + devopsItems.length);

  const selected = selectTop3(cybersecItems, devopsItems);

  if (selected.length === 0) {
    console.warn('[fetch-news] Sin noticias disponibles — no se actualiza news.json');
    process.exit(0);
  }

  const output = {
    generated_at: new Date().toISOString(),
    items: selected.map(function (item, i) {
      return buildItem(item, i + 1);
    }),
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
  console.log('[fetch-news] Escrito: ' + OUTPUT_PATH);
  console.log('[fetch-news] Items: ' + output.items.map(function(i){ return i.category + ' — ' + i.title.slice(0,50); }).join(' | '));
}

// Ejecutar solo si es el entry point (no cuando se importa en tests)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(function (err) {
    console.error('[fetch-news] Error fatal:', err);
    process.exit(1);
  });
}
