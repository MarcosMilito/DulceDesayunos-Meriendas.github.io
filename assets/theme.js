/* Dulces Desayunos y Meriendas — selector de apariencia compartido. */
(() => {
  'use strict';
  const KEY = 'dulces-theme';
  const html = document.documentElement;
  const media = window.matchMedia?.('(prefers-color-scheme: dark)');
  function savedTheme() {
    try { const v = localStorage.getItem(KEY); return v === 'dark' || v === 'light' ? v : null; }
    catch (_) { return null; }
  }
  let manual = savedTheme();
  let current = manual || (media?.matches ? 'dark' : 'light');
  function render(theme) {
    current = theme;
    html.dataset.theme = theme;
    html.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#201a20' : '#fff6f1';
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      const isDark = theme === 'dark';
      const label = isDark ? 'Activar modo claro' : 'Activar modo oscuro';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', String(isDark));
      const icon = button.querySelector('.theme-toggle-icon');
      const text = button.querySelector('.theme-toggle-text');
      if (icon) icon.textContent = isDark ? '☀' : '☾';
      if (text) text.textContent = isDark ? 'Claro' : 'Oscuro';
    });
  }
  // Se aplica en <head> para evitar parpadeos de colores al cargar.
  render(current);
  document.addEventListener('DOMContentLoaded', () => {
    render(current);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        manual = current === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(KEY, manual); } catch (_) {}
        render(manual);
      });
    });
  });
  window.addEventListener('storage', ev => {
    if (ev.key !== KEY) return;
    manual = savedTheme();
    render(manual || (media?.matches ? 'dark' : 'light'));
  });
  media?.addEventListener?.('change', ev => {
    if (!manual) render(ev.matches ? 'dark' : 'light');
  });
})();
