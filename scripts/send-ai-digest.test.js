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
