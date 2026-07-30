// build-i18n.js — genera /en/, /pt/ y /de/ a partir de index.html (es)
// aplicando los diccionarios de i18n-dictionaries.mjs en build time.
//
// Uso:  node scripts/build-i18n.js
// Correr después de editar index.html o i18n-dictionaries.mjs, y commitear
// las páginas generadas junto con el cambio.

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { meta, translations } from './i18n-dictionaries.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://www.nestorfleitas.ar';

const LANGS = {
  en: { locale: 'en_US' },
  pt: { locale: 'pt_BR' },
  de: { locale: 'de_DE' },
};

// aria-labels fijos del layout (atributos, fuera del sistema data-lang)
const ARIA = {
  en: { 'Cambiar tema': 'Toggle theme', 'Volver arriba': 'Back to top' },
  pt: { 'Cambiar tema': 'Alternar tema', 'Volver arriba': 'Voltar ao topo' },
  de: { 'Cambiar tema': 'Design wechseln', 'Volver arriba': 'Nach oben' },
};
const ALL_LOCALES = { es: 'es_AR', en: 'en_US', pt: 'pt_BR', de: 'de_DE' };

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeAttr = (s) => escapeHtml(s).replace(/"/g, '&quot;');

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function transform(src, lang) {
  const dict = translations[lang];
  const m = meta[lang];
  const url = `${BASE}/${lang}/`;
  let html = src;

  // 1) Textos: reemplaza el contenido de cada elemento data-lang.
  //    Los elementos data-lang contienen solo texto (sin HTML anidado).
  for (const [key, value] of Object.entries(dict)) {
    const re = new RegExp(`(data-lang="${escapeRe(key)}"[^>]*>)[^<]*`, 'g');
    html = html.replace(re, `$1${escapeHtml(value)}`);
  }

  // 2) <html lang>
  html = html.replace('<html lang="es">', `<html lang="${lang}">`);

  // 3) Title y meta description
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(m.title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${escapeAttr(m.description)}">`
  );

  // 4) Canonical y og:url propios de la página
  html = html.replace(
    `<link rel="canonical" href="${BASE}/">`,
    `<link rel="canonical" href="${url}">`
  );
  html = html.replace(
    `<meta property="og:url" content="${BASE}/">`,
    `<meta property="og:url" content="${url}">`
  );

  // 5) OG/Twitter description por idioma (los title quedan iguales: marca)
  html = html.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${escapeAttr(m.description)}">`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${escapeAttr(m.description)}">`
  );

  // 6) og:locale: el de la página + las alternates restantes
  const alternates = Object.entries(ALL_LOCALES)
    .filter(([l]) => l !== lang)
    .map(([, loc]) => `  <meta property="og:locale:alternate" content="${loc}">`)
    .join('\n');
  html = html.replace(
    /<meta property="og:locale" content="[^"]*">(\n\s*<meta property="og:locale:alternate" content="[^"]*">)*/,
    `<meta property="og:locale" content="${ALL_LOCALES[lang]}">\n${alternates}`
  );

  // 7) Rutas de assets a raíz absoluta (la página vive en /<lang>/)
  html = html.replace(/href="assets\//g, 'href="/assets/');
  html = html.replace(/src="assets\//g, 'src="/assets/');

  // 8) Selector de idioma: opción activa
  html = html.replace(
    `<option value="${lang}">`,
    `<option value="${lang}" selected>`
  );

  // 9) aria-labels del layout
  for (const [from, to] of Object.entries(ARIA[lang])) {
    html = html.replaceAll(`aria-label="${from}"`, `aria-label="${to}"`);
  }

  // El cluster hreflang del index raíz se hereda tal cual: por spec debe ser
  // idéntico en todas las versiones de idioma.
  return html;
}

const src = readFileSync(path.join(ROOT, 'index.html'), 'utf8');
for (const lang of Object.keys(LANGS)) {
  const dir = path.join(ROOT, lang);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'index.html'), transform(src, lang));
  console.log(`✓ /${lang}/index.html`);
}
