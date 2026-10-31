// Tombol tema yang dipakai di halaman fullscreen (dashboard, kuis, login) yang tidak punya Navbar.
// Memakai satu sumber tema (src/lib/theme.js) sehingga selalu sinkron dengan Navbar.
import { useEffect, useState } from 'react';
import { getTheme, setTheme, THEME_EVENT } from '../lib/theme';

export default function ThemeToggle({ className = '', label = true, lang = 'id' }) {
  const [theme, setLocal] = useState(getTheme);

  useEffect(() => {
    const sync = () => setLocal(getTheme());
    window.addEventListener(THEME_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(THEME_EVENT, sync); window.removeEventListener('storage', sync); };
  }, []);

  const dark = theme === 'dark';
  const text = dark ? (lang === 'en' ? 'Light mode' : 'Mode terang') : (lang === 'en' ? 'Dark mode' : 'Mode gelap');
  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={text}
      aria-pressed={!dark}
      title={text}
    >
      <i className={dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} aria-hidden="true" />
      {label && <span>{text}</span>}
    </button>
  );
}
