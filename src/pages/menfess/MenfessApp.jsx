// ─── MenfessApp — shell & nested routes ──────────────────────────────────────
import { lazy, Suspense, useEffect, Component, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MfAuthContext, useMfAuthState } from '@/lib/menfess/useMfAuth';
import '@/styles/menfess.css';

const Landing         = lazy(() => import('./Landing'));
const Login           = lazy(() => import('./Login'));
const Rules           = lazy(() => import('./Rules'));
const ClientDashboard = lazy(() => import('./ClientDashboard'));
const AdminDashboard  = lazy(() => import('./AdminDashboard'));

// ─── Font loader (Nunito menggantikan Kanit dari prompt utama) ────────────────
const FONT_ID = 'mf-fonts';
function injectFonts() {
  if (document.getElementById(FONT_ID)) return;
  const link = document.createElement('link');
  link.id   = FONT_ID;
  link.rel  = 'stylesheet';
  // Nunito 400–900 + Fredoka + Plus Jakarta Sans
  link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap&subset=latin';
  document.head.appendChild(link);
}
function removeFonts() { document.getElementById(FONT_ID)?.remove(); }

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

function RequireAuth({ children }) {
  const { user, ready } = useMfCtx();
  if (!ready) return <MfLoader />;
  if (!user)  return <Navigate to="/26menfess/masuk" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user, isAdmin, ready } = useMfCtx();
  if (!ready) return <MfLoader />;
  if (!user || !isAdmin) {
    return (
      <div className="mf" style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'60vh',gap:16 }}>
        <p style={{ fontSize:'2rem' }}>🚫</p>
        <p><strong>Kamu bukan admin 26Menfess.</strong></p>
        <a href="/26menfess/app" className="mf-btn mf-btn-secondary">Kembali ke Dashboard</a>
      </div>
    );
  }
  return children;
}

function MfLoader() {
  return (
    <div className="mf" style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'50vh' }}>
      <p style={{ opacity:.6 }}>Memuat…</p>
    </div>
  );
}

// ─── Error Boundary ───────────────────────────────────────────────────────────
class MfErrorBoundary extends Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(e) { return { err: e }; }
  render() {
    if (this.state.err) {
      return (
        <div className="mf" style={{ padding:32,textAlign:'center' }}>
          <p style={{ fontSize:'2rem' }}>💥</p>
          <p><strong>Ada yang error di 26Menfess.</strong></p>
          <p style={{ opacity:.7,fontSize:'.9rem' }}>{this.state.err.message}</p>
          <button className="mf-btn mf-btn-secondary" onClick={() => window.location.reload()}>Muat ulang</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Shell ────────────────────────────────────────────────────────────────────
export default function MenfessApp() {
  const authState = useMfAuthState();

  useEffect(() => {
    // Aktifkan mk-route agar Lenis mati (sama seperti Makrab — commit a0ad6c7)
    document.documentElement.classList.add('mk-route');
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
        {/* colorScheme=light: kunci preview kartu selalu terang, tidak terpengaruh dark-mode HP */}
        <div className="mf" style={{ colorScheme: 'light' }}>
          <Suspense fallback={<MfLoader />}>
            <Routes>
              <Route path="/"       element={<Landing />} />
              <Route path="/masuk"  element={<Login />} />
              <Route path="/aturan" element={<Rules />} />
              <Route path="/app"    element={<RequireAuth><ClientDashboard /></RequireAuth>} />
              <Route path="/admin"  element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
              <Route path="*"       element={<Navigate to="/26menfess" replace />} />
            </Routes>
          </Suspense>
        </div>
      </MfErrorBoundary>
    </MfAuthContext.Provider>
  );
}
