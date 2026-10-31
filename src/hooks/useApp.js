import { useState, useEffect } from 'react';
import TRANSLATIONS from '../data/translations';
import { getTheme, applyTheme, setTheme, hasManualTheme, THEME_EVENT } from '../lib/theme';

/* ══════════════════════════════════════════════════════
   useTheme
   — Auto-detect system preference (prefers-color-scheme)
   — Saves manual override to localStorage
   — Listens for system changes if no manual override
══════════════════════════════════════════════════════ */
export function useTheme() {
  const [theme, setThemeState] = useState(getTheme);

  // Sinkronisasi ke <html data-theme="..."> + <meta theme-color>
  useEffect(() => { applyTheme(theme); }, [theme]);

  // Ikuti perubahan dari tempat lain (ThemeToggle di dashboard, tab lain) dan dari OS
  // (OS hanya dipakai bila pengguna belum memilih manual).
  useEffect(() => {
    const onChange = () => setThemeState(getTheme());
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSys = () => { if (!hasManualTheme()) setThemeState(getTheme()); };
    window.addEventListener(THEME_EVENT, onChange);
    window.addEventListener('storage', onChange);
    mq.addEventListener('change', onSys);
    return () => {
      window.removeEventListener(THEME_EVENT, onChange);
      window.removeEventListener('storage', onChange);
      mq.removeEventListener('change', onSys);
    };
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return { theme, toggleTheme };
}

/* ══════════════════════════════════════════════════════
   useLang
   — Auto-detect bahasa dari browser (navigator.language)
   — Fallback ke 'id' untuk ID/Bahasa Indonesia
   — Saves manual toggle ke localStorage
══════════════════════════════════════════════════════ */
export function useLang() {
  const [lang, setLang] = useState(() => {
    // 1. User pernah pilih manual
    const saved = localStorage.getItem('synw-lang');
    if (saved) return saved;
    // 2. Auto-detect dari browser
    const browserLang = navigator.language || navigator.languages?.[0] || 'id';
    // Jika browser pakai bahasa Indonesia → 'id', sisanya → 'en'
    return browserLang.toLowerCase().startsWith('id') ? 'id' : 'en';
  });

  const toggleLang = () => {
    setLang(prev => {
      const next = prev === 'id' ? 'en' : 'id';
      localStorage.setItem('synw-lang', next);
      return next;
    });
  };

  useEffect(() => { document.documentElement.setAttribute('lang', lang); }, [lang]);

  const t = TRANSLATIONS[lang];

  return { lang, t, toggleLang };
}