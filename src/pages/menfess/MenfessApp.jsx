// ─── MenfessApp — shell & nested routes ──────────────────────────────────────
import { lazy, Suspense, useEffect, Component, useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MfAuthContext, useMfAuthState } from '@/lib/menfess/useMfAuth';
import '@/styles/menfess.css';
import MfShell from '@/components/menfess/ui/Shell';
import { ToastProvider } from '@/components/menfess/ui/Toast';
import { Button, EmptyState } from '@/components/menfess/ui';

const Landing         = lazy(() => import('./Landing'));
const Login           = lazy(() => import('./Login'));
const Rules           = lazy(() => import('./Rules'));
const Feed            = lazy(() => import('./Feed'));
const ClientDashboard = lazy(() => import('./ClientDashboard'));
const AdminDashboard  = lazy(() => import('./AdminDashboard'));

// ─── Font loader (Nunito menggantikan Kanit dari prompt utama) ────────────────
const FONT_ID = 'mf-fonts';
function injectFonts() {
  if (document.getElementById(FONT_ID)) return;
  [['https://fonts.googleapis.com',false],['https://fonts.gstatic.com',true]].forEach(([h,c]) => {
    if (document.querySelector(`link[rel='preconnect'][href='${h}']`)) return;
    const l = document.createElement('link'); l.rel='preconnect'; l.href=h; if (c) l.crossOrigin=''; l.dataset.mf='1'; document.head.appendChild(l);
  });
  const link = document.createElement('link');
  link.id   = FONT_ID;
  link.rel  = 'stylesheet';
  // Nunito 400–900 + Fredoka + Plus Jakarta Sans
  link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap&subset=latin';
  document.head.appendChild(link);
}
function removeFonts() { document.getElementById(FONT_ID)?.remove(); document.querySelectorAll('link[data-mf="1"]').forEach(n => n.remove()); }

// ─── Favicon / title swap ────────────────────────────────────────────────────
let origTitle = '', origFavicon = '', origApple = '', origManifest = '', origTheme = '';

function pushMfBranding() {
  origTitle    = document.title;
  origFavicon  = document.querySelector("link[rel='icon']")?.href || '';
  origApple    = document.querySelector("link[rel='apple-touch-icon']")?.href || '';
  origManifest = document.querySelector("link[rel='manifest']")?.href || '';
  origTheme    = document.querySelector("meta[name='theme-color']")?.content || '';
  document.title = '26Menfess — Menfess FKEP 2026';
  setLinkHref('icon',             '/26menfess/icons/favicon.ico');
  setLinkHref('apple-touch-icon', '/26menfess/icons/apple-touch-icon.png');
  setLinkHref('manifest',         '/26menfess/manifest.webmanifest');
  setMeta('theme-color', '#FEEEE6');
  setMeta('robots',      'noindex');
}
function popMfBranding() {
  document.title = origTitle;
  if (origFavicon)  setLinkHref('icon',             origFavicon);
  if (origApple)    setLinkHref('apple-touch-icon',  origApple);
  if (origManifest) setLinkHref('manifest',          origManifest);
  if (origTheme)    setMeta('theme-color', origTheme);
  removeMeta('robots');
}
function setLinkHref(rel, href) {
  let el = document.querySelector(`link[rel='${rel}']`);
  if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el); }
  el.href = href;
}
function setMeta(name, content) {
  let el = document.querySelector(`meta[name='${name}']`);
  if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
  el.content = content;
}
function removeMeta(name) { document.querySelector(`meta[name='${name}']`)?.remove(); }

// ─── Guards ───────────────────────────────────────────────────────────────────
function useMfCtx() {
  return useContext(MfAuthContext) ?? { user: null, ready: true, isAdmin: false, isOwner: false, isAnon: false };
}

function MfLoader() {
  return <div className="mf-state" role="status"><span className="mf-spin" aria-hidden="true" /><p>Memuat…</p></div>;
}

function RequireAuth({ children }) {
  const { user, ready } = useMfCtx();
  const location = useLocation();
  if (!ready) return <MfLoader />;
  if (!user) {
    const dest = location.pathname + location.search;
    return <Navigate to={`/26menfess/masuk?next=${encodeURIComponent(dest)}`} replace />;
  }
  return children;
}

function RequireAdmin({ children }) {
  const { user, isAdmin, ready } = useMfCtx();
  const location = useLocation();
  if (!ready) return <MfLoader />;
  if (!user) {
    const dest = location.pathname + location.search;
    return <Navigate to={`/26menfess/masuk?next=${encodeURIComponent(dest)}`} replace />;
  }
  if (!isAdmin) {
    return (
      <EmptyState icon="shield" title="Halaman ini khusus admin"
        action={<div className="mf-row-wrap"><Button to="/26menfess/app?tab=kirim" icon="send">Ke dashboard</Button><Button to="/26menfess" variant="secondary" icon="home">Ke beranda</Button></div>}>
        Akun yang kamu pakai belum terdaftar sebagai admin 26Menfess.
      </EmptyState>
    );
  }
  return children;
}

function NotFound() {
  return (
    <EmptyState icon="search" title="Halaman tidak ditemukan"
      action={<div className="mf-row-wrap"><Button to="/26menfess" icon="home">Beranda</Button><Button variant="secondary" onClick={() => window.history.back()} icon="back">Kembali</Button></div>}>
      Alamat yang kamu buka tidak ada di 26Menfess.
    </EmptyState>
  );
}

// ─── Error Boundary ───────────────────────────────────────────────────────────
class MfErrorBoundary extends Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(e) { return { err: e }; }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="mf mf-shell">
        <main className="mf-main">
          <EmptyState icon="alert" title="Ada yang error di 26Menfess"
            action={<div className="mf-row-wrap"><Button onClick={() => window.location.reload()} icon="refresh">Muat ulang</Button><Button href="/26menfess" variant="secondary" icon="home">Ke beranda</Button></div>}>
            Coba muat ulang halaman. Kalau masih terjadi, kabari admin.
          </EmptyState>
          <details className="mf-narrow mf-small mf-muted"><summary>Detail teknis</summary><pre className="mf-allow">{String(this.state.err?.message || this.state.err)}</pre></details>
        </main>
      </div>
    );
  }
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function MenfessApp() {
  const authState = useMfAuthState();

  useEffect(() => {
    document.documentElement.classList.add('mk-route'); // matikan Lenis (sama seperti Makrab)
    injectFonts();
    pushMfBranding();
    return () => {
      document.documentElement.classList.remove('mk-route');
      removeFonts();
      popMfBranding();
    };
  }, []);

  return (
    <MfAuthContext.Provider value={authState}>
      <MfErrorBoundary>
        <ToastProvider>
          <Suspense fallback={<div className="mf mf-shell"><MfLoader /></div>}>
            <Routes>
              <Route element={<MfShell />}>
                <Route path="/"       element={<Landing />} />
                <Route path="/feed"   element={<Feed />} />
                <Route path="/masuk"  element={<Login />} />
                <Route path="/aturan" element={<Rules />} />
                <Route path="/app"    element={<RequireAuth><ClientDashboard /></RequireAuth>} />
                <Route path="/admin"  element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
                <Route path="*"       element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </ToastProvider>
      </MfErrorBoundary>
    </MfAuthContext.Provider>
  );
}
