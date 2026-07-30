// lang.js — selector de idioma entre páginas estáticas: / (es), /en/, /pt/, /de/
// Las traducciones viven en scripts/i18n-dictionaries.mjs y se hornean en el
// build (node scripts/build-i18n.js); acá solo se navega y se recuerda la elección.
(function () {
  'use strict';

  const URLS = { es: '/', en: '/en/', pt: '/pt/', de: '/de/' };
  const current = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2);

  function go(lang) {
    if (!URLS[lang] || lang === current) return;
    try { localStorage.setItem('nf-lang', lang); } catch (e) {}
    window.location.href = URLS[lang];
  }

  document.addEventListener('DOMContentLoaded', function () {
    const sel = document.getElementById('lang-switch');
    if (sel) {
      sel.value = current;
      sel.addEventListener('change', function () { go(sel.value); });
    }

    // Si el usuario ya eligió un idioma antes, volver a esa versión.
    // Solo elección explícita previa: sin autodetección ni redirect para
    // visitantes nuevos (y por lo tanto tampoco para crawlers).
    let saved = null;
    try { saved = localStorage.getItem('nf-lang'); } catch (e) {}
    if (saved && URLS[saved] && saved !== current) {
      window.location.replace(URLS[saved]);
    }
  });
})();
