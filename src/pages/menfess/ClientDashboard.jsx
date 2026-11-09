// ─── ClientDashboard — /26menfess/app ────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { useMfAuth } from '@/lib/menfess/useMfAuth';
import { fetchMyPosts, fetchPublicSettings, withdrawPost } from '@/lib/menfess/api';
import { cacheGet, cacheSet, cacheInvalidate, TTL } from '@/lib/menfess/cache';
import { getMfTheme, setMfTheme, saveLastPath, countUnseen, markStatusesSeen, loadDraft } from '@/components/menfess/utils';
import Composer    from '@/components/menfess/Composer';
import MenfessCard from '@/components/menfess/MenfessCard';
import StatusBadge from '@/components/menfess/StatusBadge';
import { saveDraft } from '@/components/menfess/utils';
import { PullIndicator } from '@/components/makrab/PullToRefresh';
import { usePullToRefresh } from '@/components/makrab/usePullToRefresh';
// usePullToRefresh(onRefresh, disabled) → { pull, phase }

export default function ClientDashboard() {
  const { user, isAdmin, isAnon } = useMfAuth();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'kirim';

  const [theme,    setTheme]    = useState(getMfTheme);
  const [posts,    setPosts]    = useState(() => cacheGet('history') || []);
  const [loading,  setLoading]  = useState(!cacheGet('history'));
  const [settings, setSettings] = useState(null);
  const [unseen,   setUnseen]   = useState(0);
  const lastFetchRef = useRef(0);
  const [toast,    setToast]    = useState('');

  function showToast(msg, isErr = false) {
    setToast({ msg, isErr });
    setTimeout(() => setToast(''), 3000);
  }

  // Simpan last path
  useEffect(() => {
    saveLastPath(`/26menfess/app?tab=${tab}`);
  }, [tab]);

  // Load settings sekali
  useEffect(() => {
    fetchPublicSettings().then(s => setSettings(s)).catch(() => {});
  }, []);

  const refresh = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchRef.current < 60000) return;
    lastFetchRef.current = now;
    setLoading(true);
    try {
      const data = await fetchMyPosts({ limit: 50 });
      setPosts(data);
      cacheSet('history', data, TTL.history);
      setUnseen(countUnseen(data));
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  // Fetch awal
  useEffect(() => { if (user) refresh(true); }, [user]);

  // Refresh saat tab kembali aktif
  useEffect(() => {
    const onVis = () => { if (!document.hidden) refresh(); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [refresh]);

  // Pull-to-refresh
  const { pull, phase } = usePullToRefresh(() => refresh(true));

  function switchTheme(t) {
    setTheme(t);
    setMfTheme(t);
    supabase.auth.updateUser({ data: { mf_theme: t } }).catch(() => {});
  }

  function onSent() {
    cacheInvalidate('history');
    refresh(true);
    setParams({ tab: 'riwayat' });
    showToast('Menfess terkirim! 🎉');
  }

  async function handleWithdraw(post) {
    if (!confirm(`Tarik menfess ini? Tindakan tidak bisa dibatalkan.`)) return;
    try {
      await withdrawPost(post.id);
      cacheInvalidate('history');
      refresh(true);
      showToast('Menfess ditarik.');
    } catch (e) {
      showToast(e.message || 'Gagal menarik menfess.', true);
    }
  }

  function handleResend(post) {
    saveDraft({
      to:       post.to_label   || '',
      from:     post.from_alias || '',
      category: post.category,
      body:     post.body,
      design:   post.design,
      song:     post.song_title || post.song || '',
    });
    setParams({ tab: 'kirim' });
    showToast('Draft diisi dari menfess yang ditolak.');
  }

  const countByStatus = (s) => posts.filter(p => p.status === s).length;

  return (
    <div className="mf" data-mf-theme={theme}>
      <PullIndicator pull={pull} phase={phase} />

      {/* Topbar */}
      <header className="mf-topbar">
        <span style={{ fontFamily: 'var(--mf-font-brand)', fontWeight: 700, fontSize: '1rem' }}>
          📢 26Menfess
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Toggle tema */}
          <button
            className="mf-btn mf-btn-ghost"
            onClick={() => switchTheme(theme === 'pink' ? 'green' : 'pink')}
            title="Ganti tema"
            style={{ fontSize: '1.2rem', padding: '6px 8px', minHeight: 'auto' }}
          >
            {theme === 'pink' ? '🌿' : '🌸'}
          </button>
          {isAdmin && (
            <Link to="/26menfess/admin" className="mf-btn mf-btn-ghost" style={{ fontSize: '.8rem', padding: '6px 10px' }}>
              Admin
            </Link>
          )}
          {/* Keluar */}
          <button
            className="mf-btn mf-btn-ghost"
            onClick={() => supabase.auth.signOut()}
            style={{ fontSize: '.8rem', padding: '6px 10px' }}
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Ajakan hubungkan Google untuk anonim */}
      {isAnon && (
        <div style={{ background: 'var(--mf-peach)', borderBottom: '2px solid var(--mf-ink)', padding: '10px var(--mf-gap)', fontSize: '.85rem', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span>🔒 Amankan riwayatmu — hubungkan Google agar tidak hilang kalau ganti HP.</span>
          <button
            className="mf-btn mf-btn-secondary"
            style={{ fontSize: '.8rem', padding: '6px 12px', minHeight: 'auto' }}
            onClick={() => supabase.auth.linkIdentity({ provider: 'google' })}
          >
            Hubungkan Google
          </button>
        </div>
      )}

      {/* Tab */}
      <div className="mf-tabs">
        <button
          className={`mf-tab ${tab === 'kirim' ? 'active' : ''}`}
          onClick={() => setParams({ tab: 'kirim' })}
        >
          ✍️ Kirim
        </button>
        <button
          className={`mf-tab ${tab === 'riwayat' ? 'active' : ''}`}
          onClick={() => { setParams({ tab: 'riwayat' }); markStatusesSeen(posts); setUnseen(0); }}
        >
          📋 Riwayat {unseen > 0 && <span style={{ background: 'var(--mf-brick)', color: '#fff', borderRadius: 999, padding: '1px 6px', fontSize: '.72rem', marginLeft: 4 }}>{unseen}</span>}
        </button>
      </div>

      <main className="mf-page" style={{ paddingTop: 24 }}>
        {tab === 'kirim' && (
          <Composer settings={settings} onSent={onSent} />
        )}

        {tab === 'riwayat' && (
          <div>
            {/* Ringkasan */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {[['pending','Menunggu'],['hold','Ditahan'],['approved','Siap tayang'],['posted','Tayang'],['rejected','Ditolak']].map(([s, l]) => (
                <div key={s} className="mf-card" style={{ padding: '8px 14px', background: 'white', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{countByStatus(s)}</div>
                  <div style={{ fontSize: '.75rem', opacity: .7 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Tombol segarkan */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button className="mf-btn mf-btn-secondary" onClick={() => refresh(true)} disabled={loading} style={{ fontSize: '.85rem' }}>
                {loading ? 'Memuat…' : '🔄 Segarkan'}
              </button>
            </div>

            {loading && posts.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1,2,3].map(i => <div key={i} className="mf-skeleton" style={{ height: 120 }} />)}
              </div>
            )}

            {!loading && posts.length === 0 && (
              <div className="mf-empty">
                <span className="mf-empty-icon">📭</span>
                <p>Belum ada menfess yang kamu kirim.</p>
                <button className="mf-btn mf-btn-primary" onClick={() => setParams({ tab: 'kirim' })}>
                  Kirim menfess pertama
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {posts.map(p => (
                <MenfessCard
                  key={p.id}
                  post={p}
                  showStatus
                  showActions
                  onWithdraw={() => handleWithdraw(p)}
                  onResend={() => handleResend(p)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className="mf-toast-wrap" aria-live="polite">
          <div className={`mf-toast ${toast.isErr ? 'error' : ''}`}>{toast.msg}</div>
        </div>
      )}
    </div>
  );
}
