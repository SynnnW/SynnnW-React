// Satu sumber kebenaran untuk tema (dark/light). Dipakai useTheme, ThemeToggle, dan Makrab.
// Preferensi disimpan di localStorage 'synw-theme'; jika belum ada, ikuti OS.
export const THEME_KEY = 'synw-theme';
export const THEME_EVENT = 'synw-theme-change';

export function getTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch { /* storage tidak tersedia */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function hasManualTheme() {
  try { const s = localStorage.getItem(THEME_KEY); return s === 'dark' || s === 'light'; } catch { return false; }
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#F2EEE5' : '#1B1E22');
}

/** Ganti tema, simpan sebagai pilihan manual, dan beri tahu semua pemakai hook. */
export function setTheme(theme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch { /* abaikan */ }
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
}
