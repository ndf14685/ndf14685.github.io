// theme.js — Dark/Light toggle con persistencia en localStorage
(function () {
  'use strict';

  const STORAGE_KEY = 'nf-theme';
  const DARK_CLASS = 'dark';
  const LIGHT_CLASS = 'light';

  function applyTheme(theme) {
    const body = document.body;
    if (theme === 'light') {
      body.classList.remove(DARK_CLASS);
      body.classList.add(LIGHT_CLASS);
    } else {
      body.classList.remove(LIGHT_CLASS);
      body.classList.add(DARK_CLASS);
    }
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = theme === 'dark' ? '○' : '◑';
  }

  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function saveTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  function getPreferredTheme() {
    const stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }

  function toggleTheme() {
    const current = document.body.classList.contains('dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    saveTheme(next);
    applyTheme(next);
  }

  // Aplicar tema antes de que se pinte el DOM (evita flash)
  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.addEventListener('click', toggleTheme);
  });
})();
