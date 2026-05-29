// Deep AI news fetcher for /novedades/
// Combines official RSS, GitHub releases and optional NewsAPI results, then scores
// each item against the tools and infrastructure Nestor actually uses.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import RSSParser from 'rss-parser';
import axios from 'axios';

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  const { config } = await import('dotenv');
  config({ path: resolve(__dirname, '.env') });
} catch (_) {}

const OUTPUT_PATH = resolve(__dirname, process.env.AI_NEWS_JSON_PATH || '../assets/data/ai-novedades.json');
const LOOKBACK_HOURS = Number(process.env.AI_NEWS_LOOKBACK_HOURS || 72);
const MAX_ITEMS = Number(process.env.AI_NEWS_MAX_ITEMS || 24);
const MAX_SUMMARY_CHARS = 340;
const NEWSAPI_KEY = process.env.NEWS_API_KEY || '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

const RSS_FEEDS = [
  { source: 'OpenAI News', technology: 'OpenAI / ChatGPT / Codex', url: 'https://openai.com/news/rss.xml' },
  { source: 'Google AI Blog', technology: 'Gemini / Google AI', url: 'https://blog.google/technology/ai/rss/' },
  { source: 'Google Developers Blog', technology: 'Gemini / Google AI', url: 'https://developers.googleblog.com/feeds/posts/default?alt=rss' },
  { source: 'The Decoder', technology: 'AI trends', url: 'https://the-decoder.com/feed/' },
  { source: 'VentureBeat AI', technology: 'AI trends', url: 'https://venturebeat.com/category/ai/feed/' },
];

const DEFAULT_GITHUB_REPOS = [
  'openai/codex',
  'google-gemini/gemini-cli',
  'deepseek-ai/DeepSeek-R1',
  'deepseek-ai/DeepSeek-V3',
];

const EXTRA_GITHUB_REPOS = (process.env.AI_RELEASE_REPOS || '')
  .split(',')
  .map((repo) => repo.trim())
  .filter(Boolean);

const GITHUB_REPOS = Array.from(new Set([...DEFAULT_GITHUB_REPOS, ...EXTRA_GITHUB_REPOS]));

const NEWSAPI_QUERY = [
  '"OpenAI"', '"ChatGPT"', '"Codex"', '"Claude"', '"Anthropic"', '"Gemini"',
  '"DeepSeek"', '"AI agent"', '"MCP"', '"agentic coding"', '"AI voice"',
  '"speech model"', '"LLM inference"', '"AI latency"',
].join(' OR ');

const STACK_RULES = [
  {
    label: 'OpenClaw',
    keywords: ['openclaw', 'agent runtime', 'agent routing', 'telegram bot', 'gateway', 'workflow automation', 'voice assistant'],
    benefit: 'Puede mejorar el router, las tareas recurrentes, la mensajeria Telegram o la experiencia de asistente local.',
  },
  {
    label: 'Claude',
    keywords: ['claude', 'anthropic', 'opus', 'sonnet', 'haiku', 'claude code'],
    benefit: 'Sirve para decidir cambios de modelo, delegacion de tareas complejas y mejores flujos de codigo/revision.',
  },
  {
    label: 'Codex',
    keywords: ['codex', 'openai codex', 'coding agent', 'skills', 'github integration', 'code review'],
    benefit: 'Puede potenciar automatizaciones de repos, skills, refactors y tareas de desarrollo sobre tu workspace.',
  },
  {
    label: 'ChatGPT / OpenAI',
    keywords: ['openai', 'chatgpt', 'gpt-', 'gpt ', 'realtime', 'responses api', 'assistants api', 'audio', 'voice'],
    benefit: 'Puede mejorar voz, latencia, reasoning, generacion multimodal o integraciones API del stack Jarvis/OpenClaw.',
  },
  {
    label: 'Gemini',
    keywords: ['gemini', 'google ai', 'google deepmind', 'gemini cli', 'vertex ai'],
    benefit: 'Util para contexto largo, segunda opinion, busqueda amplia y automatizaciones con herramientas Google.',
  },
  {
    label: 'DeepSeek',
    keywords: ['deepseek', 'deepseek-r1', 'deepseek-v3', 'reasoning model'],
    benefit: 'Puede abrir opciones costo/beneficio para razonamiento, fallback local/remoto o benchmarks contra modelos cerrados.',
  },
  {
    label: 'Infra AI',
    keywords: ['kubernetes', 'docker', 'terraform', 'ansible', 'observability', 'inference', 'ollama', 'gpu', 'latency', 'mcp'],
    benefit: 'Impacta directo en despliegue, performance, observabilidad, seguridad o costos de la infra de IA.',
  },
];

const HIGH_IMPACT_TERMS = [
  'release', 'launch', 'new model', 'model', 'api', 'cli', 'sdk', 'realtime',
  'audio', 'voice', 'latency', 'performance', 'faster', 'cost', 'pricing',
  'security', 'agent', 'mcp', 'tool use', 'function calling', 'benchmark',
  'open source', 'self-host', 'local', 'github', 'skills',
];

export function stripHtml(text) {
  return String(text || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncate(text, maxLen = MAX_SUMMARY_CHARS) {
  const clean = stripHtml(text);
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen).trimEnd() + '...';
}

function cutoffMs() {
  return Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000;
}

function parseDate(value) {
  const d = value ? new Date(value) : new Date();
  return isNaN(d.getTime()) ? new Date() : d;
}

function isRecent(item) {
  return parseDate(item.published_at).getTime() >= cutoffMs();
}

function urlKey(url) {
  return String(url || '').replace(/[?#].*$/, '').replace(/\/$/, '').toLowerCase();
}

function inferTechnology(rawText, fallback) {
  const text = rawText.toLowerCase();
  const matched = STACK_RULES.find((rule) => rule.keywords.some((kw) => text.includes(kw)));
  return matched ? matched.label : fallback || 'AI trends';
}

export function scoreItem(item) {
  const text = `${item.title} ${item.summary} ${item.source}`.toLowerCase();
  const matchedRules = STACK_RULES.filter((rule) => rule.keywords.some((kw) => text.includes(kw)));
  const matchedHighImpact = HIGH_IMPACT_TERMS.filter((kw) => text.includes(kw));

  let score = 10;
  score += matchedRules.length * 20;
  score += matchedHighImpact.length * 4;

  if (/openclaw|codex|claude code|gemini cli|mcp|realtime|audio|voice|latency|telegram|ollama/.test(text)) {
    score += 20;
  }
  if (/pricing|cost|security|vulnerability|breaking|deprecat|migration/.test(text)) {
    score += 10;
  }
  if (item.kind === 'github_release') {
    score += 12;
  }
  if (/sports|celebrity|movie|crypto price|stock market/.test(text)) {
    score -= 35;
  }

  const primaryRule = matchedRules[0];
  return {
    score: Math.max(0, Math.min(100, score)),
    tags: Array.from(new Set(matchedRules.map((rule) => rule.label))).slice(0, 4),
    why_it_matters: primaryRule ? primaryRule.benefit : 'Tendencia general de IA a monitorear para detectar oportunidades de adopcion.',
    relevant: score >= 55,
  };
}

function normalizeItem(raw) {
  const title = stripHtml(raw.title);
  const summary = truncate(raw.summary || raw.content || raw.contentSnippet || raw.description || raw.body || '');
  const sourceUrl = /^https?:\/\//i.test(raw.url || raw.link || '') ? String(raw.url || raw.link) : '#';
  const publishedAt = parseDate(raw.published_at || raw.pubDate || raw.isoDate || raw.updated_at || raw.publishedAt).toISOString();
  const tech = inferTechnology(`${title} ${summary} ${raw.technology || ''} ${raw.source || ''}`, raw.technology);
  const base = {
    id: '',
    kind: raw.kind || 'article',
    technology: tech,
    title,
    summary,
    source: String(raw.source || 'Unknown').trim(),
    source_url: sourceUrl,
    published_at: publishedAt,
  };
  const scored = scoreItem(base);
  return { ...base, ...scored };
}

async function fetchRss() {
  const parser = new RSSParser({ timeout: 12000 });
  const items = [];

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      for (const item of parsed.items || []) {
        items.push(normalizeItem({
          kind: 'rss',
          technology: feed.technology,
          source: feed.source,
          title: item.title,
          summary: item.contentSnippet || item.content || item.summary,
          link: item.link,
          pubDate: item.isoDate || item.pubDate,
        }));
      }
      console.log(`[RSS] ${feed.source}: ${(parsed.items || []).length} items`);
    } catch (err) {
      console.warn(`[RSS] ${feed.source}: ${err.message}`);
    }
  }

  return items.filter(isRecent);
}

async function fetchGithubReleases() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'nestorfleitas-ai-news-agent',
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

  const items = [];
  for (const repo of GITHUB_REPOS) {
    try {
      const res = await axios.get(`https://api.github.com/repos/${repo}/releases`, {
        headers,
        params: { per_page: 5 },
        timeout: 12000,
      });
      for (const release of res.data || []) {
        items.push(normalizeItem({
          kind: 'github_release',
          technology: repo,
          source: `GitHub: ${repo}`,
          title: release.name || release.tag_name,
          summary: release.body || '',
          link: release.html_url,
          published_at: release.published_at || release.created_at,
        }));
      }
      console.log(`[GitHub] ${repo}: ${(res.data || []).length} releases`);
    } catch (err) {
      console.warn(`[GitHub] ${repo}: ${err.response?.status || ''} ${err.message}`);
    }
  }
  return items.filter(isRecent);
}

async function fetchNewsApi() {
  if (!NEWSAPI_KEY) {
    console.warn('[NewsAPI] NEWS_API_KEY no configurado; usando solo RSS/GitHub');
    return [];
  }

  try {
    const from = new Date(cutoffMs()).toISOString().slice(0, 10);
    const res = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: NEWSAPI_QUERY,
        from,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 50,
        apiKey: NEWSAPI_KEY,
      },
      timeout: 12000,
    });

    const items = (res.data.articles || []).map((article) => normalizeItem({
      kind: 'newsapi',
      source: article.source?.name || 'NewsAPI',
      title: article.title,
      summary: article.description || article.content,
      link: article.url,
      published_at: article.publishedAt,
    }));
    console.log(`[NewsAPI] ${items.length} items`);
    return items.filter(isRecent);
  } catch (err) {
    console.warn(`[NewsAPI] ${err.message}`);
    return [];
  }
}

export function selectItems(items) {
  const seen = new Set();
  const deduped = [];

  for (const item of items) {
    if (!item.title || !item.source_url || item.source_url === '#') continue;
    const key = urlKey(item.source_url) || item.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return parseDate(b.published_at) - parseDate(a.published_at);
    })
    .slice(0, MAX_ITEMS)
    .map((item, idx) => ({ ...item, id: idx + 1 }));
}

function buildDigest(items) {
  const relevant = items.filter((item) => item.relevant || item.score >= 65).slice(0, 8);
  return {
    has_relevant_items: relevant.length > 0,
    relevant_count: relevant.length,
    telegram_summary: relevant.map((item) => ({
      technology: item.technology,
      title: item.title,
      benefit: item.why_it_matters,
      score: item.score,
      url: item.source_url,
    })),
  };
}

async function main() {
  console.log(`[fetch-ai-news] inicio ${new Date().toISOString()}`);
  const [rss, github, newsapi] = await Promise.all([
    fetchRss(),
    fetchGithubReleases(),
    fetchNewsApi(),
  ]);

  const selected = selectItems([...rss, ...github, ...newsapi]);
  const output = {
    generated_at: new Date().toISOString(),
    lookback_hours: LOOKBACK_HOURS,
    stack_focus: STACK_RULES.map((rule) => rule.label),
    source_counts: {
      rss: rss.length,
      github: github.length,
      newsapi: newsapi.length,
    },
    digest: buildDigest(selected),
    items: selected,
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log(`[fetch-ai-news] escrito ${OUTPUT_PATH}`);
  console.log(`[fetch-ai-news] items=${selected.length} relevantes=${output.digest.relevant_count}`);

  if (existsSync(OUTPUT_PATH)) {
    const parsed = JSON.parse(readFileSync(OUTPUT_PATH, 'utf8'));
    if (!Array.isArray(parsed.items)) throw new Error('output invalido');
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error('[fetch-ai-news] error fatal:', err);
    process.exit(1);
  });
}
