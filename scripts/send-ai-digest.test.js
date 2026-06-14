import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTelegramMessage, spanishDigestLine } from './send-ai-digest.js';

test('spanishDigestLine replaces long English article titles with Spanish digest copy', () => {
  const line = spanishDigestLine({
    technology: 'Gemini',
    title: 'Building with Gemini Embedding 2: Agentic multimodal RAG and beyond',
    summary: 'Google has announced a unified embedding model for agentic multimodal RAG.',
    source: 'Google Developers Blog',
  });

  assert.equal(line, 'Mejora de busqueda, memoria o RAG en Gemini.');
});

test('buildTelegramMessage does not expose raw English titles as the digest headline', () => {
  const message = buildTelegramMessage({
    generated_at: '2026-06-11T12:00:00.000Z',
    items: [
      {
        technology: 'Gemini',
        title: 'Accelerating on-device AI: A look at Arm and Google AI Edge optimization',
        summary: 'Integration of Arm SME2 and Google AI Edge enables on-device generative AI.',
        why_it_matters: 'Puede mejorar voz, latencia, reasoning o integraciones API del stack Jarvis/OpenClaw.',
        source_url: 'https://developers.googleblog.com/example/',
        score: 82,
        relevant: true,
      },
    ],
  });

  assert.match(message, /Avance multimodal o en dispositivo en Arm\./);
  assert.doesNotMatch(message, /Accelerating on-device AI/);
});

test("buildTelegramMessage explains items simply and labels the real source link", () => {
  const message = buildTelegramMessage({
    generated_at: "2026-06-14T09:00:00Z",
    items: [
      {
        technology: "OpenClaw",
        title: "OpenClaw fixes a security vulnerability in agent sandboxing",
        summary: "Security release with sandbox hardening",
        why_it_matters: "Security hardening for agents",
        source_url: "https://example.com/real-news",
        score: 82,
        relevant: true,
      },
    ],
  });

  assert.match(message, /Calificacion: 82\/100 \(alta\)/);
  assert.match(message, /En simple:/);
  assert.match(message, /Link a la noticia verdadera/);
  assert.match(message, /https:\/\/example\.com\/real-news/);
  assert.doesNotMatch(message, /score 82/);
  assert.doesNotMatch(message, />Fuente</);
});
