import { useState, useEffect } from 'react';
import TRANSLATIONS from '../data/translations';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('synw-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('synw-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
}

export function useLang() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('synw-lang') || 'id';
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