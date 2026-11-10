// MfShell: TopBar + BottomNav (login) + Footer + ScrollManager. Navigasi internal pakai <Link>.
import { useEffect, useRef, useState, useContext } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { MfAuthContext } from '@/lib/menfess/useMfAuth';
import { supabase } from '@/supabaseClient';
import { Icon, Logo, Button, IconButton } from './index';
import { ConfirmDialog } from './Sheet';
import { useMfToast } from './Toast';
import { getMfTheme, setMfTheme, getSeenStatuses } from '../utils';
import { cacheGet } from '@/lib/menfess/cache';

export const TRAKTEER = 'https://trakteer.id/aldo_leo_saputra/tip';
export const IG = 'https://www.instagram.com/secretmenfess.26/';

/** Tombol Kembali: history internal bila ada, kalau tidak ke induk logis. */
export function useGoBack(fallback = '/26menfess') {
  const nav = useNavigate();
  const loc = useLocation();
  return () => {
    const from = loc.state?.from;
    if (from && typeof from === 'string' && from.startsWith('/26menfess')) { nav(from); return; }
    if (loc.key !== 'default') nav(-1); else nav(fallback);
  };
}

export function PageHeader({ title, fallback = '/26menfess', children }) {
  const back = useGoBack(fallback);
  return (
    <div className="mf-pageheader">
      <IconButton icon="back" label="Kembali" onClick={back} variant="secondary" />
      <h1 className="mf-grow">{title}</h1>
      {children}
    </div>
  );
}

/** Scroll ke atas saat ganti route/tab; restore posisi saat Back (POP). */
function ScrollManager() {
  const loc = useLocation();
  const saved = useRef(new Map());
  const prev = useRef(null);
  useEffect(() => {
    if (prev.current) saved.current.set(prev.current, window.scrollY);
    const k = loc.pathname + loc.search;
    const y = loc.key !== 'default' && window.history.state?.idx > 0 ? saved.current.get(k) : undefined;
    window.scrollTo(0, y || 0);
    prev.current = k;
  }, [loc.pathname, loc.search, loc.key]);
  return null;
}

function UserMenu({ onLogout }) {
  const { user, isAdmin, isAnon } = useContext(MfAuthContext);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const loc = useLocation();
  useEffect(() => { setOpen(false); }, [loc.pathname, loc.search]);
  useEffect(() => {
    if (!open) return undefined;
    const d = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', d); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', d); document.removeEventListener('keydown', k); };
  }, [open]);
  const initial = isAnon ? 'A' : (user?.email?.[0] || 'U').toUpperCase();
  return (
    <div className="mf-menu-wrap" ref={ref}>
      <button type="button" className="mf-avatar" aria-label="Menu akun" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>{initial}</button>
      {open && (
        <div className="mf-menu" role="menu">
          <Link to="/26menfess/app?tab=riwayat" role="menuitem"><Icon name="history" /> Riwayatku</Link>
          <Link to="/26menfess/app?tab=akun" role="menuitem"><Icon name="user" /> Akun & pengaturan</Link>
          {isAdmin && <Link to="/26menfess/admin" role="menuitem"><Icon name="shield" /> Panel admin</Link>}
          <hr />
          <a href={TRAKTEER} target="_blank" rel="noopener noreferrer" role="menuitem"><Icon name="cup" /> Traktir cendol</a>
          <a href="/" role="menuitem"><Icon name="external" /> Situs SynnnW</a>
          <hr />
          <button type="button" role="menuitem" onClick={onLogout}><Icon name="logout" /> Keluar</button>
        </div>
      )}
    </div>
  );
}

/** Dialog keluar: peringatan keras untuk akun anonim. Dipakai TopBar, Akun, Admin. */
export function LogoutDialog({ open, onClose }) {
  const { isAnon } = useContext(MfAuthContext);
  const toast = useMfToast();
  const [busy, setBusy] = useState(false);
  const [linking, setLinking] = useState(false);
  const nav = useNavigate();

  async function doLogout() {
    setBusy(true);
    try { await supabase.auth.signOut(); onClose(); nav('/26menfess', { replace: true }); }
    catch { toast.show('Gagal keluar. Coba lagi.', 'error'); }
    setBusy(false);
  }
  async function linkGoogle() {
    setLinking(true);
    try {
      const { error } = await supabase.auth.linkIdentity({ provider: 'google', options: { redirectTo: `${window.location.origin}/26menfess/app?tab=akun` } });
      if (error) throw error;
    } catch (e) { toast.show(e.message?.includes('manual') ? 'Fitur hubungkan Google belum diaktifkan admin.' : 'Gagal menghubungkan Google.', 'error'); setLinking(false); }
  }
  return (
    <ConfirmDialog open={open} title="Keluar dari 26Menfess?" danger confirmLabel={isAnon ? 'Tetap keluar' : 'Keluar'} cancelLabel="Batal"
      loading={busy} onConfirm={doLogout} onCancel={onClose}
      extra={isAnon && <Button variant="primary" icon="lock" loading={linking} onClick={linkGoogle} block>Hubungkan Google dulu</Button>}>
      {isAnon
        ? <div className="mf-callout bad"><Icon name="alert" /><div>Kamu masuk <b>anonim</b>. Kalau keluar, riwayat menfess ini <b>tidak bisa dibuka lagi</b>.</div></div>
        : <p>Kamu bisa masuk lagi kapan saja dengan akun Google yang sama.</p>}
    </ConfirmDialog>
  );
}

function TopBar({ onLogout }) {
  const { user, ready } = useContext(MfAuthContext);
  const loc = useLocation();
  const onApp = loc.pathname.startsWith('/26menfess/app');
  return (
    <header className="mf-topbar">
      <div className="mf-topbar-inner">
        <Logo to="/26menfess" />
        <nav className="mf-nav-links" aria-label="Navigasi utama">
          <NavLink end to="/26menfess" className="mf-nav-link">Beranda</NavLink>
          <NavLink to="/26menfess/feed" className="mf-nav-link">Feed</NavLink>
          <NavLink to="/26menfess/aturan" className="mf-nav-link">Aturan</NavLink>
        </nav>
        <div className="mf-grow" />
        {ready && !user && <Button to="/26menfess/masuk" size="sm" state={{ from: loc.pathname + loc.search }}>Masuk</Button>}
        {ready && user && !onApp && <Button to="/26menfess/app?tab=kirim" size="sm" icon="send"><span className="mf-hide-xs">Tulis menfess</span></Button>}
        {ready && user && <UserMenu onLogout={onLogout} />}
      </div>
    </header>
  );
}

function BottomNav() {
  const [params] = useSearchParams();
  const tab = params.get('tab') || 'kirim';
  const loc = useLocation();
  const [unseen, setUnseen] = useState(0);
  useEffect(() => {
    const h = cacheGet('history') || [];
    const seen = getSeenStatuses();
    setUnseen(h.filter(p => seen[p.id] && seen[p.id] !== p.status).length);
  }, [loc.pathname, loc.search]);
  const items = [
    { to: '/26menfess/app?tab=kirim', icon: 'send', label: 'Kirim', on: loc.pathname === '/26menfess/app' && tab === 'kirim' },
    { to: '/26menfess/app?tab=riwayat', icon: 'history', label: 'Riwayat', on: loc.pathname === '/26menfess/app' && tab === 'riwayat', badge: unseen },
    { to: '/26menfess/feed', icon: 'feed', label: 'Feed', on: loc.pathname === '/26menfess/feed' },
    { to: '/26menfess/app?tab=akun', icon: 'user', label: 'Akun', on: loc.pathname === '/26menfess/app' && tab === 'akun' },
  ];
  return (
    <nav className="mf-bottomnav" aria-label="Navigasi bawah">
      {items.map(i => (
        <Link key={i.label} to={i.to} replace={i.on} aria-current={i.on ? 'page' : undefined}>
          <span className="mf-bn-ic"><Icon name={i.icon} size={22} />{i.badge > 0 && <span className="mf-count mf-bn-badge">{i.badge}</span>}</span>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}

export function Footer({ padBottom }) {
  return (
    <footer className={`mf-footer${padBottom ? ' pad-bn' : ''}`}>
      <div className="mf-footer-inner">
        <span>Dibuat oleh <a href="/">SynnnW</a></span>
        <span className="mf-row-wrap">
          <a href={IG} target="_blank" rel="noopener noreferrer">@secretmenfess.26</a>
          <Link to="/26menfess/aturan">Aturan</Link>
          <Link to="/26menfess/feed">Feed</Link>
          <a href={TRAKTEER} target="_blank" rel="noopener noreferrer">Trakteer cendol</a>
          <a href="/">← Situs SynnnW</a>
        </span>
      </div>
    </footer>
  );
}

export default function MfShell() {
  const { user, ready } = useContext(MfAuthContext);
  const loc = useLocation();
  const [logout, setLogout] = useState(false);
  const [theme, setTheme] = useState(getMfTheme);
  useEffect(() => {
    const on = () => setTheme(getMfTheme());
    window.addEventListener('mf:theme', on);
    return () => window.removeEventListener('mf:theme', on);
  }, []);
  const showBottom = ready && !!user && (loc.pathname.startsWith('/26menfess/app') || loc.pathname === '/26menfess/feed');
  const isAdminRoute = loc.pathname.startsWith('/26menfess/admin');
  return (
    <div className="mf mf-shell" data-mf-theme={theme}>
      <a className="mf-sr" href="#mf-main">Lewati ke konten</a>
      <ScrollManager />
      <TopBar onLogout={() => setLogout(true)} />
      <div id="mf-main" tabIndex={-1} className={`mf-main${showBottom ? ' has-bottom-nav' : ''}`} style={isAdminRoute ? { maxWidth: 1240 } : undefined}>
        <Outlet context={{ openLogout: () => setLogout(true) }} />
      </div>
      <Footer padBottom={showBottom} />
      {showBottom && <BottomNav />}
      <LogoutDialog open={logout} onClose={() => setLogout(false)} />
    </div>
  );
}

export { setMfTheme };
