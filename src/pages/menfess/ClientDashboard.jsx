// ClientDashboard /26menfess/app?tab=kirim|riwayat|akun
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { MfAuthContext } from '@/lib/menfess/useMfAuth';
import { fetchMyPosts, fetchPublicSettings, withdrawPost } from '@/lib/menfess/api';
import { cacheGet, cacheSet, cacheInvalidate, TTL } from '@/lib/menfess/cache';
import { categoryLabel, renderCardBlob, cardFilename } from '@/lib/menfess/renderCard';
import { getMfTheme, setMfTheme, saveLastPath, countUnseen, getSeenStatuses, markStatusesSeen, saveDraft, formatRelative } from '@/components/menfess/utils';
import Composer from '@/components/menfess/Composer';
import { Sheet, ConfirmDialog } from '@/components/menfess/ui/Sheet';
import { Badge, Button, Callout, Chip, ChipGroup, EmptyState, ErrorState, Skeleton, StatusBadge, STATUS_LABEL, Tabs } from '@/components/menfess/ui';
import CardThumb from '@/components/menfess/ui/CardThumb';
import SongPill from '@/components/menfess/ui/SongPill';
import { useMfToast } from '@/components/menfess/ui/Toast';
import { TRAKTEER, IG } from '@/components/menfess/ui/Shell';
import PullHint from '@/components/menfess/ui/PullHint';
import { usePullToRefresh } from '@/components/makrab/usePullToRefresh';

const TABS = [{ id: 'kirim', label: 'Kirim', icon: 'send' }, { id: 'riwayat', label: 'Riwayat', icon: 'history' }, { id: 'akun', label: 'Akun', icon: 'user' }];
const FILTERS = ['all', 'pending', 'hold', 'approved', 'posted', 'rejected', 'withdrawn'];
const STEPS = ['Dikirim', 'Ditinjau', 'Siap tayang', 'Tayang'];
const stepOf = { pending: 1, hold: 1, approved: 3, posted: 4, rejected: 2, withdrawn: 1, removed: 4 };

function Timeline({ status }) {
  const n = stepOf[status] || 1;
  return (
    <div className="mf-timeline" aria-label={`Tahap: ${STATUS_LABEL[status] || status}`}>
      {STEPS.map((s, i) => <span key={s} className={`mf-tl${i < n ? ' done' : ''}${status === 'rejected' && i === 1 ? ' bad' : ''}`}>{s}</span>)}
    </div>
  );
}

export default function ClientDashboard() {
  const { user, isAnon } = useContext(MfAuthContext);
  const { openLogout } = useOutletContext() || {};
  const toast = useMfToast();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some(t => t.id === params.get('tab')) ? params.get('tab') : 'kirim';
  const setTab = useCallback((t) => setParams({ tab: t }, { replace: true }), [setParams]);

  const [posts, setPosts] = useState(() => cacheGet('history') || []);
  const [loading, setLoading] = useState(() => !cacheGet('history'));
  const [error, setError] = useState(false);
  const [settings, setSettings] = useState(null);
  const [filter, setFilter] = useState('all');
  const [openPost, setOpenPost] = useState(null);
  const [withdraw, setWithdraw] = useState(null);
  const [busy, setBusy] = useState(false);
  const [highlight, setHighlight] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [seen, setSeen] = useState(getSeenStatuses);
  const lastFetch = useRef(0);
  const [anonHidden, setAnonHidden] = useState(() => { try { return Date.now() - Number(localStorage.getItem('mf:anonbanner') || 0) < 86400000; } catch { return false; } });

  useEffect(() => { saveLastPath(`/26menfess/app?tab=${tab}`); }, [tab]);
  useEffect(() => { fetchPublicSettings().then(setSettings).catch(() => {}); }, []);

  const refresh = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetch.current < 60000) return;
    lastFetch.current = now;
    setError(false);
    if (!cacheGet('history')) setLoading(true);
    try {
      const data = await fetchMyPosts({ limit: 50 });
      setPosts(data); cacheSet('history', data, TTL.history); setUpdatedAt(new Date());
    } catch { setError(true); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (user) refresh(true); }, [user, refresh]);
  useEffect(() => {
    const onVis = () => { if (!document.hidden) refresh(); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [refresh]);

  const { pull, phase } = usePullToRefresh(async () => { await refresh(true); return true; }, tab !== 'riwayat');

  useEffect(() => {
    if (tab === 'riwayat' && posts.length) {
      const t = setTimeout(() => { markStatusesSeen(posts); setSeen(getSeenStatuses()); }, 1200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [tab, posts]);

  const counts = useMemo(() => {
    const c = { all: posts.length };
    posts.forEach(p => { c[p.status] = (c[p.status] || 0) + 1; });
    return c;
  }, [posts]);
  const changed = useMemo(() => new Set(posts.filter(p => seen[p.id] && seen[p.id] !== p.status).map(p => p.status)), [posts, seen]);
  const shown = filter === 'all' ? posts : posts.filter(p => p.status === filter);
  const unseenTotal = countUnseen(posts);

  function onSent(post) {
    cacheInvalidate('history');
    setPosts(p => [post, ...p]);
    setHighlight(post.id);
    refresh(true);
  }

  async function doWithdraw() {
    setBusy(true);
    try { await withdrawPost(withdraw.id); toast.show('Menfess ditarik.', 'ok'); cacheInvalidate('history'); setWithdraw(null); setOpenPost(null); refresh(true); }
    catch (e) { toast.show(e?.message || 'Gagal menarik menfess.', 'error'); }
    setBusy(false);
  }

  function resend(p) {
    saveDraft({
      to: p.to_label || '', from: p.from_alias || '', category: p.category, body: p.body, design: p.design,
      text_size: p.text_size || 'auto', text_color: p.text_color || 'auto', align: p.align || 'right', font: p.font || 'nunito', line_space: p.line_space || 'normal',
      song: p.song_title ? { song_title: p.song_title, song_artist: p.song_artist, song_artwork_url: p.song_artwork_url, song_preview_url: p.song_preview_url, song_url: p.song_url, song_source: p.song_source || 'manual' } : null,
    });
    setOpenPost(null); setTab('kirim'); toast.show('Draft diisi dari menfess yang ditolak.', 'ok');
  }

  async function download(p) {
    try {
      const blob = await renderCardBlob(p); const u = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = u; a.download = cardFilename(p.id, p.design); a.click(); setTimeout(() => URL.revokeObjectURL(u), 5000);
    } catch { toast.show('Gagal membuat PNG.', 'error'); }
  }

  return (
    <div className="mf-stack">
      <PullHint pull={pull} phase={phase} />
      <div className="mf-desk"><div style={{ width: '100%' }}><Tabs tabs={TABS.map(t => ({ ...t, count: t.id === 'riwayat' ? unseenTotal : 0 }))} value={tab} onChange={setTab} label="Menu dashboard" /></div></div>

      {isAnon && !anonHidden && tab !== 'akun' && (
        <Callout kind="warn" icon="lock">
          <div className="mf-row-wrap">
            <span className="mf-grow">Masuk anonim: riwayat bisa hilang kalau data browser terhapus.</span>
            <Link to="/26menfess/app?tab=akun" replace className="mf-small"><b>Amankan</b></Link>
            <button type="button" className="mf-btn mf-btn-ghost mf-btn-sm" onClick={() => { try { localStorage.setItem('mf:anonbanner', String(Date.now())); } catch { /* abaikan */ } setAnonHidden(true); }}>Tutup</button>
          </div>
        </Callout>
      )}

      {tab === 'kirim' && <div className="mf-narrow" style={{ width: '100%', maxWidth: 'none' }}><Composer settings={settings} onSent={onSent} goHistory={() => setTab('riwayat')} /></div>}

      {tab === 'riwayat' && (
        <section className="mf-stack" aria-labelledby="rw">
          <div className="mf-row">
            <h2 id="rw" className="mf-grow" style={{ margin: 0 }}>Riwayat</h2>
            {updatedAt && <span className="mf-xs mf-muted">Diperbarui {updatedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>}
            <Button variant="secondary" size="sm" icon="refresh" loading={loading && posts.length > 0} onClick={() => refresh(true)} aria-label="Segarkan">Segarkan</Button>
          </div>
          <ChipGroup scroll label="Filter status">
            {FILTERS.filter(f => f === 'all' || counts[f]).map(f => (
              <Chip key={f} selected={filter === f} count={counts[f] || 0} dot={f !== 'all' && changed.has(f)} onClick={() => setFilter(f)}>{f === 'all' ? 'Semua' : STATUS_LABEL[f]}</Chip>
            ))}
          </ChipGroup>
          {loading && !posts.length && <div className="mf-grid-cards">{[1, 2, 3, 4].map(i => <Skeleton key={i} ratio="4/5" />)}</div>}
          {error && !posts.length && <ErrorState onRetry={() => refresh(true)} />}
          {!loading && !error && !posts.length && <EmptyState icon="send" title="Belum ada menfess" action={<Button icon="send" onClick={() => setTab('kirim')}>Kirim menfess pertama</Button>}>Menfess yang kamu kirim akan muncul di sini.</EmptyState>}
          {shown.length > 0 && (
            <div className="mf-grid-cards">
              {shown.map(p => (
                <div key={p.id} className={`mf-stack${highlight === p.id ? ' mf-highlight' : ''}`} style={{ gap: 8 }}>
                  <CardThumb post={p} onClick={() => setOpenPost(p)} label={`Buka detail menfess ${categoryLabel(p.category)}`} />
                  <div className="mf-row-wrap"><StatusBadge status={p.status} /></div>
                  <div className="mf-xs mf-muted">{categoryLabel(p.category)} · {formatRelative(p.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'akun' && <Account user={user} isAnon={isAnon} openLogout={openLogout} />}

      <Sheet open={!!openPost} onClose={() => setOpenPost(null)} title="Detail menfess">
        {openPost && (() => {
          const p = openPost;
          const canWithdraw = ['pending', 'hold', 'approved'].includes(p.status);
          return (
            <div className="mf-stack">
              <div style={{ width: 'min(100%,300px)', margin: '0 auto' }}><CardThumb post={p} scale={0.4} eager className="static" /></div>
              <div className="mf-row-wrap"><StatusBadge status={p.status} /><Badge>{categoryLabel(p.category)}</Badge></div>
              <Timeline status={p.status} />
              {p.status === 'rejected' && <Callout kind="bad" icon="ban"><b>Ditolak:</b> {p.reject_reason || 'tidak disebutkan'}{p.public_note ? ` — ${p.public_note}` : ''}</Callout>}
              {p.status === 'hold' && <Callout kind="warn" icon="pause2"><b>Sedang ditahan admin.</b> {p.public_note}</Callout>}
              {p.status === 'approved' && <Callout kind="ok" icon="check">Disetujui, menunggu giliran upload ke Instagram.</Callout>}
              {p.status === 'posted' && <Callout kind="ok" icon="instagram">Sudah tayang{p.posted_at ? ` ${formatRelative(p.posted_at)}` : ''}.</Callout>}
              <SongPill song={p} />
              <div className="mf-stack" style={{ gap: 8 }}>
                <Button variant="secondary" icon="download" onClick={() => download(p)}>Unduh PNG</Button>
                {p.status === 'posted' && p.ig_url && <Button href={p.ig_url} target="_blank" rel="noopener noreferrer" icon="external" variant="secondary">Lihat di Instagram</Button>}
                {p.status === 'rejected' && <Button icon="edit" onClick={() => resend(p)}>Kirim ulang dengan perbaikan</Button>}
                {canWithdraw && <Button variant="danger" icon="undo" onClick={() => setWithdraw(p)}>Tarik menfess</Button>}
              </div>
            </div>
          );
        })()}
      </Sheet>
      <ConfirmDialog open={!!withdraw} title="Tarik menfess ini?" danger confirmLabel="Ya, tarik" loading={busy} onConfirm={doWithdraw} onCancel={() => setWithdraw(null)}>
        <p>Menfess tidak akan ditinjau/tayang lagi. Tindakan ini tidak bisa dibatalkan.</p>
      </ConfirmDialog>
    </div>
  );
}

function Account({ user, isAnon, openLogout }) {
  const { isAdmin } = useContext(MfAuthContext);
  const toast = useMfToast();
  const [theme, setTheme] = useState(getMfTheme);
  const [linking, setLinking] = useState(false);

  function pick(t) {
    setTheme(t); setMfTheme(t);
    supabase.auth.updateUser({ data: { mf_theme: t } }).catch(() => {});
  }
  async function link() {
    setLinking(true);
    try {
      const { error } = await supabase.auth.linkIdentity({ provider: 'google', options: { redirectTo: `${window.location.origin}/26menfess/app?tab=akun` } });
      if (error) throw error;
    } catch (e) { toast.show(e?.message?.toLowerCase().includes('manual') ? 'Fitur hubungkan Google belum diaktifkan.' : 'Gagal menghubungkan Google. Coba lagi.', 'error'); setLinking(false); }
  }
  return (
    <div className="mf-narrow mf-stack" style={{ width: '100%' }}>
      <div className="mf-card mf-row">
        <span className="mf-avatar">{isAnon ? 'A' : (user?.email?.[0] || 'U').toUpperCase()}</span>
        <div className="mf-grow"><b>{isAnon ? 'Akun anonim' : 'Masuk dengan Google'}</b><div className="mf-small mf-muted" style={{ overflowWrap: 'anywhere' }}>{isAnon ? 'Tanpa email' : user?.email}</div></div>
      </div>
      {isAnon && (
        <Callout kind="warn" icon="lock">
          <b>Amankan riwayatmu.</b> Riwayat anonim hanya ada di perangkat ini dan hilang kalau data browser terhapus atau kamu keluar.
          <div style={{ marginTop: 8 }}><Button size="sm" icon="lock" loading={linking} onClick={link}>Hubungkan Google</Button></div>
        </Callout>
      )}
      <div className="mf-card mf-stack">
        <h3>Tema</h3>
        <div className="mf-row">
          <Button variant={theme === 'pink' ? 'primary' : 'secondary'} icon="heart" onClick={() => pick('pink')} aria-pressed={theme === 'pink'}>Pink</Button>
          <Button variant={theme === 'green' ? 'primary' : 'secondary'} icon="leaf" onClick={() => pick('green')} aria-pressed={theme === 'green'}>Hijau</Button>
        </div>
      </div>
      <div className="mf-card mf-stack" style={{ gap: 4 }}>
        <Button to="/26menfess/aturan" state={{ from: '/26menfess/app?tab=akun' }} variant="ghost" icon="rules">Aturan 26Menfess</Button>
        <Button href={IG} target="_blank" rel="noopener noreferrer" variant="ghost" icon="instagram">Kontak admin di Instagram</Button>
        <Button href={TRAKTEER} target="_blank" rel="noopener noreferrer" variant="ghost" icon="cup">Traktir cendol</Button>
        <Button href="/" variant="ghost" icon="external">Situs SynnnW</Button>
        {isAdmin && <Button to="/26menfess/admin" variant="ghost" icon="shield">Panel admin</Button>}
      </div>
      <Button variant="danger" icon="logout" onClick={openLogout}>Keluar</Button>
    </div>
  );
}
