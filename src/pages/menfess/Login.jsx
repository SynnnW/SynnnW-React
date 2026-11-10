// Login /26menfess/masuk
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { MfAuthContext } from '@/lib/menfess/useMfAuth';
import { safeNext, isInAppBrowser } from '@/components/menfess/utils';
import InAppBrowserNotice from '@/components/menfess/InAppBrowserNotice';
import { PageHeader } from '@/components/menfess/ui/Shell';
import { Button, Callout, Icon, Logo } from '@/components/menfess/ui';

function friendly(e) {
  const m = (e?.message || '').toLowerCase();
  if (m.includes('anonymous')) return 'Login anonim sedang dinonaktifkan. Pakai Google ya.';
  if (m.includes('fetch') || m.includes('network')) return 'Koneksi bermasalah. Coba lagi.';
  if (m.includes('cancel') || m.includes('closed')) return 'Login dibatalkan.';
  return 'Login gagal. Coba lagi sebentar.';
}

export default function Login() {
  const { user, ready } = useContext(MfAuthContext);
  const nav = useNavigate();
  const loc = useLocation();
  const dest = safeNext(loc.search);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const inApp = isInAppBrowser();

  useEffect(() => { if (ready && user) nav(dest, { replace: true }); }, [ready, user, dest, nav]);

  async function google() {
    setError(''); setBusy('g');
    try {
      const { error: e } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}${dest}` } });
      if (e) throw e;
    } catch (e) { setError(friendly(e)); setBusy(''); }
  }
  async function anon() {
    setError(''); setBusy('a');
    try { const { error: e } = await supabase.auth.signInAnonymously(); if (e) throw e; }
    catch (e) { setError(friendly(e)); setBusy(''); }
  }

  return (
    <div className="mf-narrow mf-stack">
      <PageHeader title="Masuk" />
      <div className="mf-stack" style={{ alignItems: 'center', textAlign: 'center' }}>
        <Logo size={56} text={false} />
        <h2>Masuk ke 26Menfess</h2>
        <p className="mf-muted">Satu langkah lagi sebelum menulis menfess.</p>
      </div>
      {inApp && <InAppBrowserNotice />}
      <div className="mf-choice rec">
        <span className="mf-reco">Disarankan</span>
        <b>Masuk dengan Google</b>
        <span className="mf-small mf-muted">Riwayat aman dan bisa dibuka dari HP mana pun.</span>
        <Button onClick={google} loading={busy === 'g'} disabled={inApp || !!busy} block>Lanjut dengan Google</Button>
      </div>
      <div className="mf-choice">
        <b>Masuk anonim</b>
        <span className="mf-small mf-muted">Tanpa email. Riwayat hanya tersimpan di perangkat ini; kalau data browser dihapus, riwayat hilang.</span>
        <Button variant="secondary" icon="user" onClick={anon} loading={busy === 'a'} disabled={!!busy} block>Masuk anonim</Button>
      </div>
      {error && <Callout kind="bad" icon="alert">{error}</Callout>}
      <p className="mf-small mf-muted" style={{ textAlign: 'center' }}>
        Dengan masuk, kamu setuju pada <Link to="/26menfess/aturan" state={{ from: loc.pathname + loc.search }}><b>aturan 26Menfess</b></Link>.{' '}
        <Link to="/26menfess"><b>Tentang 26Menfess</b></Link>
      </p>
      <span className="mf-sr"><Icon name="lock" /></span>
    </div>
  );
}
