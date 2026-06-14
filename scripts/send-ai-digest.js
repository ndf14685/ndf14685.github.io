// Sends the daily /novedades/ digest to Telegram.
// If there is no fresh relevant news, it resurfaces old notes (throwback)
// from the archive instead of staying silent — never repeating a note until
// every eligible one (up to THROWBACK_YEARS back) has been shown once.

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { loadJson, saveJson, selectThrowback } from './ai-archive.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  const { config } = await import('dotenv');
  config({ path: resolve(__dirname, '.env') });
} catch (_) {}

const INPUT_PATH = resolve(__dirname, process.env.AI_NEWS_JSON_PATH || '../assets/data/ai-novedades.json');
const ARCHIVE_PATH = resolve(__dirname, process.env.AI_NEWS_ARCHIVE_PATH || '../assets/data/ai-novedades-archive.json');
const SHOWN_PATH = resolve(__dirname, process.env.AI_NEWS_SHOWN_PATH || '../assets/data/ai-novedades-shown.json');
const SITE_URL = process.env.AI_NEWS_SITE_URL || 'https://www.nestorfleitas.ar/novedades/';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const TELEGRAM_TOPIC_ID = process.env.TELEGRAM_TOPIC_ID || '';
const MIN_SCORE = Number(process.env.AI_NEWS_TELEGRAM_MIN_SCORE || 65);
const THROWBACK_YEARS = Number(process.env.AI_NEWS_THROWBACK_YEARS || 3);
const THROWBACK_COUNT = Number(process.env.AI_NEWS_THROWBACK_COUNT || 3);

const ENGLISH_HINTS = /\b(the|with|for|and|from|into|beyond|building|accelerating|update|release|announces?|introduces?|launches?|security|gateway|agentic|multimodal|available|protect|enables?|powered|framework|server|client|tool|tools)\b/i;

function escapeTelegram(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cleanTitle(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .replace(/\s*[|–—-]\s*(OpenAI|Google|Google Developers Blog|The Decoder|VentureBeat|GitHub).*$/i, '')
    .trim();
}

function productName(item) {
  const title = cleanTitle(item.title);
  if (!title) return item.technology || 'IA';

  const repoMatch = String(item.source || '').match(/^GitHub:\s*([^/\s]+\/[^\s]+)$/i);
  if (repoMatch) return repoMatch[1];

  const versioned = title.match(/^([A-Za-z0-9_.@/-]+)\s+v?\d[\w.-]*$/);
  if (versioned) return title;

  const colon = title.match(/^([A-Za-z0-9_.@/-]{2,}):\s+/);
  if (colon) return colon[1];

  const quoted = title.match(/["'`](.+?)["'`]/);
  if (quoted && quoted[1].length <= 48) return quoted[1];

  const known = title.match(/\b(OpenAI|ChatGPT|Codex|Claude Code|Claude|Gemini CLI|Gemini|DeepSeek|MCP|Ollama|Google AI Edge|Arm|AWS|RAG)\b/i);
  if (known) return known[0];

  return item.technology || 'IA';
}

export function spanishDigestLine(item) {
  const title = cleanTitle(item.title);
  const text = `${title} ${item.summary || ''}`.toLowerCase();
  const product = productName(item);

  if (!title) return `Novedad de ${item.technology || 'IA'} para revisar.`;

  if (/^\d[\w.-]*(?:-alpha\.\d+|-beta\.\d+|-rc\.\d+)?$/i.test(title)) {
    return `Nueva version de ${product}: ${title}.`;
  }
  if (item.kind === 'github_release' || /\brelease|version|changelog|update\b/i.test(text)) {
    return `Actualizacion de ${product} para revisar cambios y compatibilidad.`;
  }
  if (/security|vulnerab|protect|guard|firewall|permission|sandbox|supply chain|secret/i.test(text)) {
    return `Tema de seguridad en ${product}, relevante para proteger agentes y herramientas.`;
  }
  if (/gateway|router|routing|provider|passthrough|proxy/i.test(text)) {
    return `Gateway o ruteo de IA en ${product}, util para coordinar proveedores y agentes.`;
  }
  if (/\bmcp\b|model context protocol|tool use|tools/i.test(text)) {
    return `Integracion MCP o herramientas en ${product}, con posible impacto en automatizaciones.`;
  }
  if (/embedding|rag|retrieval|memory|vector|semantic/i.test(text)) {
    return `Mejora de busqueda, memoria o RAG en ${product}.`;
  }
  if (/audio|voice|speech|realtime|latency/i.test(text)) {
    return `Avance de voz, audio o latencia en ${product}.`;
  }
  if (/multimodal|vision|image|video|on-device|edge/i.test(text)) {
    return `Avance multimodal o en dispositivo en ${product}.`;
  }
  if (ENGLISH_HINTS.test(title)) {
    return `Novedad de ${product} para evaluar en el stack.`;
  }

  return title;
}

function scoreLabel(score) {
  const value = Number(score || 0);
  if (value >= 90) return "muy alta";
  if (value >= 80) return "alta";
  if (value >= 70) return "media";
  return "baja";
}

function scoreLine(item) {
  const value = Number(item.score || 0);
  return `Calificacion: ${value}/100 (${scoreLabel(value)})`;
}

function simpleExplanation(item) {
  const title = cleanTitle(item.title);
  const text = `${title} ${item.summary || ""} ${item.why_it_matters || ""}`.toLowerCase();
  const product = productName(item);

  if (/security|vulnerab|protect|guard|firewall|permission|sandbox|supply chain|secret/i.test(text)) {
    return `En simple: esto importa porque ayuda a que ${product} sea mas dificil de romper o usar mal.`;
  }
  if (/gateway|router|routing|provider|passthrough|proxy/i.test(text)) {
    return "En simple: esto ayuda a elegir por donde pasan los pedidos de IA, como decidir que camino toma un mensaje.";
  }
  if (/\bmcp\b|model context protocol|tool use|tools/i.test(text)) {
    return "En simple: esto ayuda a que un agente use herramientas y datos sin confundirse tanto.";
  }
  if (/model|llm|reasoning|inference|benchmark|quant/i.test(text)) {
    return "En simple: puede hacer que la IA piense mejor, responda mas rapido o funcione en una maquina mas chica.";
  }
  if (/multimodal|vision|image|video|on-device|edge/i.test(text)) {
    return "En simple: la IA puede entender mas cosas, como imagenes, video o datos dentro del dispositivo.";
  }
  if (item.kind === "github_release" || /\brelease|version|changelog|update\b/i.test(text)) {
    return `En simple: salio una version nueva de ${product}; conviene mirar si arregla algo o cambia como se usa.`;
  }
  return `En simple: es una noticia para mirar porque puede cambiar como usamos ${product} en el stack.`;
}

export function buildTelegramMessage(data) {
  const items = (data.items || [])
    .filter((item) => item.score >= MIN_SCORE || item.relevant)
    .slice(0, 6);

  if (items.length === 0) return "";

  const generated = new Date(data.generated_at).toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    dateStyle: "short",
    timeStyle: "short",
  });

  const lines = [
    "<b>Novedades IA para tu stack</b>",
    `Actualizado: ${escapeTelegram(generated)} ART`,
    "",
  ];

  for (const item of items) {
    lines.push(`<b>${escapeTelegram(item.technology)}</b>`);
    lines.push(escapeTelegram(scoreLine(item)));
    lines.push(escapeTelegram(spanishDigestLine(item)));
    lines.push(escapeTelegram(simpleExplanation(item)));
    if (item.source_url) {
      lines.push(`<a href="${escapeTelegram(item.source_url)}">Link a la noticia verdadera</a>`);
    } else {
      lines.push("Link a la noticia verdadera: no vino en la fuente original.");
    }
    lines.push("");
  }

  lines.push(`<a href="${escapeTelegram(SITE_URL)}">Ver blog completo</a>`);
  return lines.join("\n").trim();
}

export function buildThrowbackMessage(picked, { cycleReset = false } = {}) {
  if (!picked || picked.length === 0) return "";

  const lines = [
    "<b>Sin novedades nuevas - repaso de notas</b>",
    cycleReset
      ? "Ya te mostre todas; arranco una nueva vuelta del archivo."
      : "Notas viejas que tocan el tema (hasta 3 anios atras):",
    "",
  ];

  for (const item of picked) {
    const when = item.published_at
      ? new Date(item.published_at).toLocaleDateString("es-AR", {
          timeZone: "America/Argentina/Buenos_Aires",
          dateStyle: "medium",
        })
      : "";
    lines.push(`<b>${escapeTelegram(item.technology)}</b>${when ? ` · ${escapeTelegram(when)}` : ""}`);
    if (item.score != null) lines.push(escapeTelegram(scoreLine(item)));
    lines.push(escapeTelegram(spanishDigestLine(item)));
    lines.push(escapeTelegram(simpleExplanation(item)));
    if (item.source_url) lines.push(`<a href="${escapeTelegram(item.source_url)}">Link a la noticia verdadera</a>`);
    lines.push("");
  }

  lines.push(`<a href="${escapeTelegram(SITE_URL)}">Ver blog completo</a>`);
  return lines.join("\n").trim();
}

async function sendTelegram(text) {
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };
  if (TELEGRAM_TOPIC_ID) payload.message_thread_id = TELEGRAM_TOPIC_ID;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(url, payload, { timeout: 12000 });
}

async function main() {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('[send-ai-digest] TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configurado; no se envia mensaje');
    return;
  }

  const data = JSON.parse(readFileSync(INPUT_PATH, 'utf8'));
  const text = buildTelegramMessage(data);

  if (text) {
    await sendTelegram(text);
    console.log('[send-ai-digest] Mensaje enviado (novedades frescas)');
    return;
  }

  // No fresh news: resurface old notes without repeating.
  const archive = loadJson(ARCHIVE_PATH, []);
  const shownState = loadJson(SHOWN_PATH, { shown: [], cycles: 0 });
  const { picked, shown, cycleReset } = selectThrowback(archive, shownState.shown, {
    now: Date.now(),
    maxYears: THROWBACK_YEARS,
    count: THROWBACK_COUNT,
  });

  if (picked.length === 0) {
    console.log('[send-ai-digest] Sin novedades y sin archivo para repasar');
    return;
  }

  const throwbackText = buildThrowbackMessage(picked, { cycleReset });
  await sendTelegram(throwbackText);

  saveJson(SHOWN_PATH, {
    shown,
    cycles: (shownState.cycles || 0) + (cycleReset ? 1 : 0),
    updated_at: new Date().toISOString(),
  });
  console.log(`[send-ai-digest] Repaso enviado: ${picked.length} nota(s)${cycleReset ? ' (nueva vuelta)' : ''}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('[send-ai-digest] error fatal:', err.response?.data || err.message);
    process.exit(1);
  });
}
