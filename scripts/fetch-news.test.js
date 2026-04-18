// fetch-news.test.js — Tests con node:test (Node v18+, no requiere dependencias)
import { test } from 'node:test';
import assert from 'node:assert/strict';

// Importamos solo las funciones puras que vamos a testear
// (el modulo principal no debe tener side-effects al importar)
import {
  filterLast48h,
  selectTop3,
  truncateSummary,
  buildItem,
} from './fetch-news.js';

// --- filterLast48h ---

test('filterLast48h: incluye items de las ultimas 48h', function () {
  const now = new Date();
  const recent = new Date(now - 2 * 60 * 60 * 1000).toISOString(); // hace 2h
  const items = [{ pubDate: recent, title: 'Reciente' }];
  const result = filterLast48h(items);
  assert.equal(result.length, 1);
});

test('filterLast48h: excluye items de mas de 48h', function () {
  const old = new Date(Date.now() - 49 * 60 * 60 * 1000).toISOString(); // hace 49h
  const items = [{ pubDate: old, title: 'Viejo' }];
  const result = filterLast48h(items);
  assert.equal(result.length, 0);
});

test('filterLast48h: maneja items sin pubDate', function () {
  const items = [{ title: 'Sin fecha' }];
  const result = filterLast48h(items);
  assert.equal(result.length, 0);
});

// --- truncateSummary ---

test('truncateSummary: no trunca textos cortos', function () {
  const text = 'Texto corto.';
  assert.equal(truncateSummary(text, 200), 'Texto corto.');
});

test('truncateSummary: trunca en limite de caracteres y agrega ...', function () {
  const text = 'A'.repeat(250);
  const result = truncateSummary(text, 200);
  assert.ok(result.length <= 203); // 200 + '...'
  assert.ok(result.endsWith('...'));
});

test('truncateSummary: maneja null/undefined', function () {
  assert.equal(truncateSummary(null, 200), '');
  assert.equal(truncateSummary(undefined, 200), '');
});

// --- selectTop3 ---

test('selectTop3: retorna exactamente 3 items', function () {
  const cybersec = [
    { category: 'cybersecurity', title: 'C1', pubDate: new Date().toISOString() },
    { category: 'cybersecurity', title: 'C2', pubDate: new Date().toISOString() },
  ];
  const devops = [
    { category: 'devops', title: 'D1', pubDate: new Date().toISOString() },
    { category: 'devops', title: 'D2', pubDate: new Date().toISOString() },
  ];
  const result = selectTop3(cybersec, devops);
  assert.equal(result.length, 3);
});

test('selectTop3: incluye minimo 1 cybersecurity y 1 devops', function () {
  const cybersec = [
    { category: 'cybersecurity', title: 'C1', pubDate: new Date().toISOString() },
    { category: 'cybersecurity', title: 'C2', pubDate: new Date().toISOString() },
    { category: 'cybersecurity', title: 'C3', pubDate: new Date().toISOString() },
  ];
  const devops = [
    { category: 'devops', title: 'D1', pubDate: new Date().toISOString() },
  ];
  const result = selectTop3(cybersec, devops);
  const cats = result.map(function (i) { return i.category; });
  assert.ok(cats.includes('cybersecurity'), 'debe incluir cybersecurity');
  assert.ok(cats.includes('devops'), 'debe incluir devops');
});

test('selectTop3: funciona si hay menos de 3 items en total', function () {
  const cybersec = [{ category: 'cybersecurity', title: 'C1', pubDate: new Date().toISOString() }];
  const devops = [];
  const result = selectTop3(cybersec, devops);
  assert.ok(result.length <= 3);
  assert.ok(result.length >= 1);
});

// --- buildItem ---

test('buildItem: retorna estructura correcta', function () {
  const raw = {
    title: 'Test Title',
    content: 'Test content text here.',
    link: 'https://example.com/article',
    pubDate: '2026-04-14T10:00:00Z',
    category: 'cybersecurity',
    source: 'Test Source',
  };
  const item = buildItem(raw, 1);
  assert.equal(item.id, 1);
  assert.equal(item.category, 'cybersecurity');
  assert.equal(item.title, 'Test Title');
  assert.ok(typeof item.summary === 'string');
  assert.equal(item.source, 'Test Source');
  assert.equal(item.source_url, 'https://example.com/article');
  assert.ok(typeof item.published_at === 'string');
});

test('buildItem: rechaza URLs no http/https', function () {
  const raw = {
    title: 'Bad URL',
    content: 'content',
    link: 'javascript:alert(1)',
    pubDate: new Date().toISOString(),
    category: 'devops',
    source: 'Src',
  };
  const item = buildItem(raw, 1);
  assert.equal(item.source_url, '#');
});
