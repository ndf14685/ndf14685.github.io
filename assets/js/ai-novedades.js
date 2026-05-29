(function () {
  'use strict';

  const DATA_URL = '../assets/data/ai-novedades.json';
  const MAX_STALE_HOURS = 84;

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    const value = String(str || '');
    if (!/^https?:\/\//i.test(value)) return '#';
    return value.replace(/"/g, '%22');
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' ART';
  }

  function isStale(generatedAt) {
    const diff = Date.now() - new Date(generatedAt).getTime();
    return diff > MAX_STALE_HOURS * 60 * 60 * 1000;
  }

  function renderItem(item, index) {
    const tags = (item.tags || []).map(function (tag) {
      return '<span class="ai-tag">' + escapeHtml(tag) + '</span>';
    }).join('');

    return (
      '<article class="ai-news-card">' +
        '<div class="ai-news-rank">' + String(index + 1).padStart(2, '0') + '</div>' +
        '<div class="ai-news-content">' +
          '<div class="ai-news-meta">' +
            '<span class="ai-tech">' + escapeHtml(item.technology) + '</span>' +
            '<span>score ' + escapeHtml(item.score) + '</span>' +
            '<span>' + escapeHtml(formatDate(item.published_at)) + '</span>' +
          '</div>' +
          '<h2><a href="' + escapeAttr(item.source_url) + '" target="_blank" rel="noopener">' + escapeHtml(item.title) + '</a></h2>' +
          '<p>' + escapeHtml(item.summary) + '</p>' +
          '<div class="ai-benefit"><strong>Te beneficia:</strong> ' + escapeHtml(item.why_it_matters) + '</div>' +
          '<div class="ai-tags">' + tags + '</div>' +
          '<div class="ai-source">Fuente: <a href="' + escapeAttr(item.source_url) + '" target="_blank" rel="noopener">' + escapeHtml(item.source) + '</a></div>' +
        '</div>' +
      '</article>'
    );
  }

  function render(data) {
    const list = document.getElementById('ai-news-list');
    const status = document.getElementById('ai-news-status');
    const generated = document.getElementById('ai-generated-at');
    const counts = document.getElementById('ai-source-counts');
    if (!list || !status) return;

    if (generated) generated.textContent = data.generated_at ? formatDate(data.generated_at) : 'sin fecha';
    if (counts && data.source_counts) {
      counts.textContent = 'RSS ' + data.source_counts.rss + ' · GitHub ' + data.source_counts.github + ' · NewsAPI ' + data.source_counts.newsapi;
    }

    if (!data.items || data.items.length === 0) {
      status.textContent = 'Sin novedades detectadas en la ventana configurada.';
      list.innerHTML = '';
      return;
    }

    status.textContent = isStale(data.generated_at)
      ? 'Feed desactualizado temporalmente; se muestra el ultimo snapshot disponible.'
      : data.digest && data.digest.has_relevant_items
        ? 'Hay novedades relevantes para tu stack.'
        : 'Sin alertas fuertes, pero con tendencias para revisar.';

    list.innerHTML = data.items.map(renderItem).join('');
  }

  function init() {
    const list = document.getElementById('ai-news-list');
    if (list) list.innerHTML = '<div class="ai-loading">Cargando novedades...</div>';

    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(render)
      .catch(function () {
        const status = document.getElementById('ai-news-status');
        if (status) status.textContent = 'No se pudo cargar el feed de novedades.';
        if (list) list.innerHTML = '';
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
