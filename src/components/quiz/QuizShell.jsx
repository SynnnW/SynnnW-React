// src/components/quiz/QuizShell.jsx
// SATU chrome untuk area Quiziz (nama file dipertahankan supaya halaman pemakainya tidak perlu diubah):
//   variant="full"  (default)  top bar + navigasi Beranda · Materi · Latsol · UAS + cari (⌘K); di mobile tab bar bawah menggantikan hamburger.
//   variant="focus"            header ramping (logo + tema) tanpa navigasi dan tanpa cari: login, kuesioner, dan nanti engine/reader.
// Command palette dimuat malas (lazy) saat pertama dibuka; pemicunya: Ctrl/⌘+K, "/", tombol cari, atau event dari halaman.
// Isi halaman dibungkus error boundary: kegagalan satu halaman tidak menjatuhkan chrome-nya.
// Landmark <main> sudah ada di App.jsx (#main), jadi wadah konten di sini sengaja <div>, bukan <main> bersarang.
// QuizEngine dan reader materi masih punya header sendiri; keduanya pindah ke shell ini (variant focus) di Fase 3-4.
import { Component, Suspense, lazy, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import ErrorState from './ErrorState';
import { SEARCH_EVENT, shortcutLabel } from './paletteBus';
import { NAV_ITEMS, PATHS, activeNav } from '../../data/quiziz/routes';
import '../../styles/quizGlass.css';
import '../../styles/quizShell.css';

const CommandPalette = lazy(() => import('./CommandPalette'));

const isTyping = (el) => !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

function TopBar({ variant, active, onSearch }) {
  return (
    <header className="qz-top">
      <Link to={PATHS.beranda} className="qz-top-logo" aria-label="Quiziz, ke beranda">
        <i className="fa-solid fa-seedling qz-top-mark" aria-hidden="true" />
        <span className="qz-top-name">Synnn<span>W</span> · Quiziz</span>
      </Link>

      {variant === 'full' && (
        <nav className="qz-top-nav" aria-label="Navigasi Quiziz">
          {NAV_ITEMS.map((n) => (
            <Link key={n.id} to={n.to} className="qz-top-link" aria-current={active === n.id ? 'page' : undefined}>{n.label}</Link>
          ))}
        </nav>
      )}

      <div className="qz-top-actions">
        {variant === 'full' && (
          <button type="button" className="qz-top-search" onClick={onSearch} aria-label="Cari di Quiziz" aria-keyshortcuts="Control+K Meta+K">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <span className="qz-top-search-text">Cari</span>
            <kbd className="qz-top-kbd" aria-hidden="true">{shortcutLabel()}</kbd>
          </button>
        )}
        <a href="/" className="qz-top-main" aria-label="Ke website utama" title="Website utama">
          <i className="fa-solid fa-globe" aria-hidden="true" />
          <span>Website utama</span>
        </a>
        <ThemeToggle label={false} />
      </div>
    </header>
  );
}

function TabBar({ active }) {
  return (
    <nav className="qz-tabbar" aria-label="Navigasi bawah Quiziz">
      {NAV_ITEMS.map((n) => (
        <Link key={n.id} to={n.to} className="qz-tab" aria-current={active === n.id ? 'page' : undefined}>
          <span className="qz-tab-ico"><i className={`fa-solid ${n.icon}`} aria-hidden="true" /></span>
          <span>{n.label}</span>
        </Link>
      ))}
    </nav>
  );
}

class PageBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('[Quiziz] halaman gagal dirender', error, info?.componentStack); }
  render() {
    if (this.state.error) return <ErrorState onRetry={() => this.setState({ error: null })} />;
    return this.props.children;
  }
}

export default function QuizShell({ children, maxWidth = 720, variant = 'full' }) {
  const { pathname, search } = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const full = variant === 'full';
  const active = full ? activeNav(pathname, search) : null;

  useEffect(() => {
    if (!full) return undefined;
    const open = () => setSearchOpen(true);
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setSearchOpen((o) => !o);
      } else if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(e.target)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener(SEARCH_EVENT, open);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(SEARCH_EVENT, open);
      window.removeEventListener('keydown', onKey);
    };
  }, [full]);

  return (
    <div className="qz-app" data-area="quiziz" data-variant={variant}>
      <div className="qz-ambient" aria-hidden="true" />
      <TopBar variant={variant} active={active} onSearch={() => setSearchOpen(true)} />
      <div className="qz-shell-main">
        <div className="qz-shell-inner" style={{ maxWidth }}>
          <PageBoundary>{children}</PageBoundary>
        </div>
      </div>
      {full && <TabBar active={active} />}
      {full && searchOpen && (
        <Suspense fallback={null}>
          <CommandPalette onClose={() => setSearchOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
