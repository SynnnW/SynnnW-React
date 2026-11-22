// src/components/quiz/QuizShell.jsx
// SATU chrome untuk area Quiziz (nama file dipertahankan supaya halaman pemakainya tidak perlu diubah):
//   variant="full"  (default)  top bar + navigasi Beranda · Materi · Latsol · UAS; di mobile diganti tab bar bawah.
//   variant="focus"            header ramping (logo + tema) tanpa navigasi: login, kuesioner, dan nanti engine/reader.
// Isi halaman dibungkus error boundary: kegagalan satu halaman tidak menjatuhkan chrome-nya.
// Landmark <main> sudah ada di App.jsx (#main), jadi wadah konten di sini sengaja <div>, bukan <main> bersarang.
// QuizEngine dan reader materi masih punya header sendiri; keduanya pindah ke shell ini (variant focus) di Fase 3-4.
import { Component } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import ErrorState from './ErrorState';
import { NAV_ITEMS, PATHS, activeNav } from '../../data/quiziz/routes';
import '../../styles/quizGlass.css';
import '../../styles/quizShell.css';

function TopBar({ variant, active }) {
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
  const active = variant === 'full' ? activeNav(pathname, search) : null;
  return (
    <div className="qz-app" data-area="quiziz" data-variant={variant}>
      <div className="qz-ambient" aria-hidden="true" />
      <TopBar variant={variant} active={active} />
      <div className="qz-shell-main">
        <div className="qz-shell-inner" style={{ maxWidth }}>
          <PageBoundary>{children}</PageBoundary>
        </div>
      </div>
      {variant === 'full' && <TabBar active={active} />}
    </div>
  );
}
