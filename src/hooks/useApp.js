import { useState, useEffect } from 'react';
import TRANSLATIONS from '../data/translations';

/* ══════════════════════════════════════════════════════
   useTheme
   — Auto-detect system preference (prefers-color-scheme)
   — Saves manual override to localStorage
   — Listens for system changes if no manual override
══════════════════════════════════════════════════════ */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // 1. User pernah milih manual → pakai itu
    const saved = localStorage.getItem('synw-theme');
    if (saved) return saved;
    // 2. Belum pernah → ikutin OS/browser
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Sinkronisasi ke <html data-theme="...">
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Dengarkan perubahan sistem — hanya aktif jika user BELUM override manual
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSysChange = (e) => {
      const manual = localStorage.getItem('synw-theme');
      if (!manual) {
        // Belum ada pilihan manual — ikutin sistem
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handleSysChange);
    return () => mq.removeEventListener('change', handleSysChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      // Simpan sebagai override manual
      localStorage.setItem('synw-theme', next);
      return next;
    });
  };

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

  const t = TRANSLATIONS[lang];

  return { lang, t, toggleLang };
}