// ─── Login — /26menfess/masuk ────────────────────────────────────────────────
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { MfAuthContext } from '@/lib/menfess/useMfAuth';
import { WELCOME_TITLE, WELCOME_TEXT } from '@/lib/menfess/rules';
import { safeNext, isInAppBrowser } from '@/components/menfess/utils';
import InAppBrowserNotice from '@/components/menfess/InAppBrowserNotice';

export default function Login() {
  const auth     = useContext(MfAuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dest     = safeNext(location.search);

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingAnon,   setLoadingAnon]   = useState(false);
  const [error,         setError]         = useState('');
  const [showFull,      setShowFull]      = useState(false);
  const inApp = isInAppBrowser();

  useEffect(() => {
    if (auth?.ready && auth?.user) navigate(dest, { replace: true });
  }, [auth?.ready, auth?.user]);

  async function loginGoogle() {
    setError('');
    setLoadingGoogle(true);
    try {
      const { error: e } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/26menfess/app`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (e) throw e;
      // Redirect akan terjadi otomatis
    } catch (e) {
      setError(e.message || 'Login Google gagal.');
      setLoadingGoogle(false);
    }
  }

  async function loginAnon() {
    setError('');
    setLoadingAnon(true);
    try {
      const { error: e } = await supabase.auth.signInAnonymously();
      if (e) throw e;
      // onAuthStateChange akan trigger; navigate dari useEffect di atas
    } catch (e) {
      setError(e.message || 'Login anonim gagal.');
      setLoadingAnon(false);
    }
  }

  const welcomeParas = WELCOME_TEXT.split('\n\n');

  return (
    <div className="mf" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--mf-gap)' }}>

      {/* Back link */}
      <div style={{ position: 'fixed', top: 16, left: 16 }}>
        <Link to="/26menfess" className="mf-btn mf-btn-ghost" style={{ fontSize: '.82rem' }}>← Kembali</Link>
      </div>

      <div style={{ maxWidth: 440, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <img
            src="/26menfess/logo-26menfess-web.png"
            alt="26Menfess"
            style={{ maxWidth: 160, width: '100%' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <h1 style={{ fontSize: '1.6rem', marginTop: 12 }}>26Menfess</h1>
        </div>

        {/* ── Sambutan (selalu terlihat sebelum tombol login) ── */}
        <div className="mf-card" style={{ background: 'white' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>
            <span style={{ background: 'var(--mf-peach)', padding: '2px 6px', borderRadius: 6 }}>
              {WELCOME_TITLE}
            </span>
          </h2>
          <p style={{ margin: 0 }}>{welcomeParas[0]}</p>

          {showFull ? (
            <>
              {welcomeParas.slice(1).map((p, i) => (
                <p key={i} style={{ marginTop: 12, marginBottom: 0 }}>{p}</p>
              ))}
              <button
                className="mf-btn mf-btn-ghost"
                onClick={() => setShowFull(false)}
                style={{ marginTop: 8, fontSize: '.82rem', padding: '4px 8px' }}
              >
                Sembunyikan ↑
              </button>
            </>
          ) : (
            <button
              className="mf-btn mf-btn-ghost"
              onClick={() => setShowFull(true)}
              style={{ marginTop: 8, fontSize: '.82rem', padding: '4px 8px' }}
            >
              Baca selengkapnya ↓
            </button>
          )}
        </div>

        {/* ── Tombol login ── */}
        <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 4, textAlign: 'center' }}>Masuk ke 26Menfess</h2>

          {/* In-app browser notice */}
          {inApp && <InAppBrowserNotice />}

          {/* Google */}
          <button
            className="mf-btn mf-btn-primary"
            onClick={loginGoogle}
            disabled={loadingGoogle || inApp}
            aria-disabled={loadingGoogle || inApp}
            style={{ width: '100%', gap: 10 }}
          >
            {loadingGoogle ? 'Mengarahkan…' : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Masuk dengan Google
              </>
            )}
          </button>

          <div style={{ textAlign: 'center', opacity: .5, fontSize: '.82rem' }}>— atau —</div>

          {/* Anonim */}
          <button
            className="mf-btn mf-btn-secondary"
            onClick={loginAnon}
            disabled={loadingAnon}
            aria-disabled={loadingAnon}
            style={{ width: '100%' }}
          >
            {loadingAnon ? 'Masuk…' : '👤 Masuk Anonim'}
          </button>

          {/* Penjelasan anonim */}
          <p style={{ fontSize: '.78rem', opacity: .65, margin: 0, lineHeight: 1.5 }}>
            <strong>Anonim</strong> = tanpa email. Riwayat hanya tersimpan di perangkat ini; kalau data browser dihapus atau ganti HP, riwayat hilang. Kamu bisa hubungkan Google kapan saja dari Pengaturan.
          </p>

          {/* Error */}
          {error && <p style={{ color: 'var(--mf-brick)', fontWeight: 700, margin: 0 }} role="alert">{error}</p>}
        </div>

        {/* Link aturan */}
        <p style={{ textAlign: 'center', fontSize: '.82rem', opacity: .65 }}>
          Dengan masuk kamu menyetujui <Link to="/26menfess/aturan" style={{ color: 'inherit', textDecoration: 'underline' }}>aturan 26Menfess</Link>.
        </p>

      </div>
    </div>
  );
}
