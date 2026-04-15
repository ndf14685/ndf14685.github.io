// blog.js — Fetch news.json y renderiza el feed de noticias
(function () {
  'use strict';

  const NEWS_JSON_PATH = 'assets/data/news.json';
  const MAX_STALE_HOURS = 48;

  function relativeTime(isoString) {
    const published = new Date(isoString);
    const now = new Date();
    const diffMs = now - published;
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffM = Math.floor(diffMs / (1000 * 60));

    if (diffM < 60) return 'hace ' + diffM + 'm';
    if (diffH < 24) return 'hace ' + diffH + 'h';
    const diffD = Math.floor(diffH / 24);
    return 'hace ' + diffD + 'd';
  }

  function isStale(generatedAt) {
    const generated = new Date(generatedAt);
    const now = new Date();
    const diffH = (now - generated) / (1000 * 60 * 60);
    return diffH > MAX_STALE_HOURS;
  }

  function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires'
    }) + ' ART';
  }

  function renderFallback(container, message) {
    container.innerHTML =
      '<div class="blog-fallback">' +
        '<div class="fallback-icon">⚠</div>' +
        '<p>' + message + '</p>' +
      '</div>';
  }

  function renderNews(data, container) {
    if (!data.items || data.items.length === 0) {
      renderFallback(container, 'Sin noticias disponibles por el momento.');
      return;
    }

    const dateStr = data.generated_at ? formatDate(data.generated_at) : '—';

    // Actualizar fecha en el titlebar
    const dateEl = document.querySelector('.t-date');
    if (dateEl) dateEl.textContent = dateStr;

    const html = data.items.map(function (item, i) {
      const knownCategories = { cybersecurity: true, devops: true };
      const cat = knownCategories[item.category] ? item.category : 'devops';
      const catClass = 'cat-' + cat;
      const catLabel = cat.toUpperCase();
      const index = String(i + 1).padStart(2, '0');
      const time = item.published_at ? relativeTime(item.published_at) : '';

      return (
        '<div class="news-item">' +
          '<div class="news-index">' + index + '</div>' +
          '<div class="news-body">' +
            '<span class="news-cat ' + catClass + '">' + catLabel + '</span>' +
            '<div class="news-title">' + escapeHtml(item.title) + '</div>' +
            '<div class="news-summary">' + escapeHtml(item.summary) + '</div>' +
            '<div class="news-meta">' +
              'via <a href="' + escapeAttr(item.source_url) + '" target="_blank" rel="noopener">' +
                escapeHtml(item.source) +
              '</a>' +
              (time ? ' &nbsp;·&nbsp; ' + time : '') +
            '</div>' +
          '</div>' +
          '<a href="' + escapeAttr(item.source_url) + '" target="_blank" rel="noopener" class="news-read-link">→ leer</a>' +
        '</div>'
      );
    }).join('');

    container.innerHTML = html;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    // Solo permite http/https URLs
    const s = String(str || '');
    if (!/^https?:\/\//i.test(s)) return '#';
    return s.replace(/"/g, '%22');
  }

  function init() {
    const container = document.getElementById('news-feed');
    if (!container) return;

    container.innerHTML = '<div class="blog-fallback"><p>Cargando noticias...</p></div>';

    fetch(NEWS_JSON_PATH)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (isStale(data.generated_at)) {
          renderFallback(container, 'Feed no disponible temporalmente. Volvé pronto.');
          return;
        }
        renderNews(data, container);
      })
      .catch(function () {
        renderFallback(container, 'Feed no disponible temporalmente. Volvé pronto.');
      });
  }

  document.addEventListener('DOMContentLoaded', init);

})();
