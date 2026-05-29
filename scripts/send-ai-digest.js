// Sends the daily /novedades/ digest to Telegram when relevant items exist.

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  const { config } = await import('dotenv');
  config({ path: resolve(__dirname, '.env') });
} catch (_) {}

const INPUT_PATH = resolve(__dirname, process.env.AI_NEWS_JSON_PATH || '../assets/data/ai-novedades.json');
const SITE_URL = process.env.AI_NEWS_SITE_URL || 'https://www.nestorfleitas.ar/novedades/';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const TELEGRAM_TOPIC_ID = process.env.TELEGRAM_TOPIC_ID || '';
const MIN_SCORE = Number(process.env.AI_NEWS_TELEGRAM_MIN_SCORE || 65);

function escapeTelegram(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function buildTelegramMessage(data) {
  const items = (data.items || [])
    .filter((item) => item.score >= MIN_SCORE || item.relevant)
    .slice(0, 6);

  if (items.length === 0) return '';

  const generated = new Date(data.generated_at).toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const lines = [
    '<b>Novedades IA para tu stack</b>',
    `Actualizado: ${escapeTelegram(generated)} ART`,
    '',
  ];

  for (const item of items) {
    lines.push(`<b>${escapeTelegram(item.technology)}</b> · score ${item.score}`);
    lines.push(escapeTelegram(item.title));
    lines.push(`Te sirve: ${escapeTelegram(item.why_it_matters)}`);
    lines.push(`<a href="${escapeTelegram(item.source_url)}">Fuente</a>`);
    lines.push('');
  }

  lines.push(`<a href="${escapeTelegram(SITE_URL)}">Ver blog completo</a>`);
  return lines.join('\n').trim();
}

async function main() {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('[send-ai-digest] TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configurado; no se envia mensaje');
    return;
  }

  const data = JSON.parse(readFileSync(INPUT_PATH, 'utf8'));
  const text = buildTelegramMessage(data);
  if (!text) {
    console.log('[send-ai-digest] Sin novedades relevantes para Telegram');
    return;
  }

  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };

  if (TELEGRAM_TOPIC_ID) {
    payload.message_thread_id = TELEGRAM_TOPIC_ID;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(url, payload, { timeout: 12000 });
  console.log('[send-ai-digest] Mensaje enviado');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('[send-ai-digest] error fatal:', err.response?.data || err.message);
    process.exit(1);
  });
}
