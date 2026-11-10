// ─── AdminDashboard — /26menfess/admin ───────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { useMfAuth } from '@/lib/menfess/useMfAuth';
import {
  fetchAdminCounts, fetchAdminPosts, adminSetStatus,
  fetchSettings, updateSettings, fetchAdminList, upsertAdmin, removeAdmin, shortCode,
} from '@/lib/menfess/api';
import { renderCardBlob, cardFilename, categoryLabel } from '@/lib/menfess/renderCard';
import { REJECT_REASONS } from '@/lib/menfess/rules';
import { formatRelative } from '@/components/menfess/utils';
import PullHint from '@/components/menfess/ui/PullHint';
import { usePullToRefresh } from '@/components/makrab/usePullToRefresh';
import { Sheet, ConfirmDialog } from '@/components/menfess/ui/Sheet';
import { Badge, Button, EmptyState, ErrorState, Field, Icon, Segmented, Skeleton, StatusBadge, Tabs } from '@/components/menfess/ui';
import CardThumb from '@/components/menfess/ui/CardThumb';
import SongPill from '@/components/menfess/ui/SongPill';
import { PreviewCanvas } from '@/components/menfess/Composer';
import { useMfToast } from '@/components/menfess/ui/Toast';
import { IG } from '@/components/menfess/ui/Shell';

// ─── Notifikasi menfess baru ─────────────────────────────────────────────────
const POLL_MS = 30000;

function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    osc.onended = () => { try { ctx.close(); } catch { /* abaikan */ } };
  } catch { /* browser memblokir audio — abaikan */ }
}

function systemNotify(title, body) {
  try {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    new Notification(title, { body, tag: 'mf-new-post', icon: '/favicon.svg' });
  } catch { /* beberapa browser HP tidak mengizinkan — cukup toast/judul tab */ }
}

const TABS = [
  { id: 'upload', label: 'Upload',  icon: 'send',   count: 'approved' },
  { id: 'queue',  label: 'Antrean', icon: 'clock',  count: 'pending' },
  { id: 'hold',   label: 'Ditahan', icon: 'pause2', count: 'hold' },
  { id: 'posted', label: 'Tayang',  icon: 'instagram', count: 'posted' },
  { id: 'studio', label: 'Studio',  icon: 'edit' },
  { id: 'owner',  label: 'Owner',   icon: 'shield' },
];

export default function AdminDashboard() {
  const { isOwner } = useMfAuth();
  const { openLogout } = useOutletContext() || {};
  const toast = useToastBridge();
  const showToast = toast.show;
  const [params, setParams] = useSearchParams();
  const tab = TABS.some(t => t.id === params.get('tab')) ? params.get('tab') : 'upload';
  const setTab = (t) => setParams({ tab: t }, { replace: true });

  const [counts, setCounts] = useState({});
  const [lastCheck, setLastCheck] = useState(null);
  const lastFetchRef = useRef(0);
  const prevPendingRef = useRef(null);
  const showToastRef = useRef(showToast);
  const unreadRef = useRef(0);
  const baseTitleRef = useRef('');
  const [notifPerm, setNotifPerm] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported');

  useEffect(() => { showToastRef.current = showToast; });

  // Judul tab kembali normal saat admin balik ke halaman ini
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden && unreadRef.current) { unreadRef.current = 0; document.title = baseTitleRef.current; }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      if (unreadRef.current) document.title = baseTitleRef.current;
    };
  }, []);

  const notifyNew = useCallback((added, total) => {
    showToastRef.current?.(added === 1 ? '1 menfess baru masuk!' : `${added} menfess baru masuk!`);
    beep();
    try { navigator.vibrate?.([120, 60, 120]); } catch { /* abaikan */ }
    if (document.hidden) {
      if (!unreadRef.current) baseTitleRef.current = document.title;
      unreadRef.current += added;
      document.title = `(${unreadRef.current}) Menfess baru • ${baseTitleRef.current}`;
      systemNotify('26Menfess — menfess baru', `${added} menfess baru menunggu di antrean (total ${total}).`);
    }
  }, []);

  // silent=true: dipanggil setelah aksi admin sendiri → jangan bunyi
  const refreshCounts = useCallback(async (silent = false) => {
    try {
      const c = await fetchAdminCounts();
      setCounts(c || {});
      setLastCheck(new Date());
      const pending = Number(c?.pending ?? 0);
      const prev = prevPendingRef.current;
      prevPendingRef.current = pending;
      if (silent !== true && prev !== null && pending > prev) notifyNew(pending - prev, pending);
    } catch { /* ignore */ }
  }, [notifyNew]);

  const afterAction = useCallback(() => refreshCounts(true), [refreshCounts]);

  useEffect(() => { refreshCounts(); }, [refreshCounts]);
  // Cek menfess baru tiap 30 detik selama dashboard admin terbuka
  useEffect(() => {
    const id = setInterval(() => refreshCounts(), POLL_MS);
    return () => clearInterval(id);
  }, [refreshCounts]);

  async function enableNotif() {
    try {
      const p = await Notification.requestPermission();
      setNotifPerm(p);
      showToast(p === 'granted' ? 'Notifikasi aktif' : 'Notifikasi tidak diizinkan di browser', p !== 'granted');
    } catch { setNotifPerm('denied'); }
  }

  useEffect(() => {
    const onVis = () => {
      const now = Date.now();
      if (!document.hidden && now - lastFetchRef.current > 30000) { lastFetchRef.current = now; refreshCounts(); }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [refreshCounts]);

  const { pull, phase } = usePullToRefresh(async () => { await refreshCounts(true); return true; });
  const visible = TABS.filter(t => t.id !== 'owner' || isOwner);
  const withCounts = visible.map(t => ({ ...t, count: t.count ? Number(counts[t.count] || 0) : 0 }));

  return (
    <div className="mf-stack">
      <PullHint pull={pull} phase={phase} />
      <div className="mf-adminhead">
        <div className="mf-grow">
          <h1 style={{ margin: 0, fontSize: 'var(--mf-fs-6)' }}>Panel admin</h1>
          {lastCheck && <span className="mf-xs mf-muted">Terakhir cek {lastCheck.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>}
        </div>
        <div className="mf-row-wrap">
          {notifPerm === 'default' && <Button variant="secondary" size="sm" icon="bell" onClick={enableNotif}>Notifikasi</Button>}
          <Button to="/26menfess/app?tab=kirim" variant="secondary" size="sm" icon="back">Dashboard</Button>
          <Button variant="ghost" size="sm" icon="logout" onClick={openLogout}>Keluar</Button>
        </div>
      </div>

      <div className="mf-admin">
        <nav className="mf-side" aria-label="Menu admin">
          {withCounts.map(t => (
            <button key={t.id} type="button" aria-current={tab === t.id ? 'page' : undefined} onClick={() => setTab(t.id)}>
              <Icon name={t.icon} />{t.label}{t.count > 0 && <span className="mf-count">{t.count}</span>}
            </button>
          ))}
        </nav>
        <div style={{ minWidth: 0 }}>
          <Tabs tabs={withCounts} value={tab} onChange={setTab} label="Menu admin" />
          {tab === 'upload' && <UploadMode onDone={afterAction} showToast={showToast} />}
          {tab === 'queue'  && <Queue status="pending" onDone={afterAction} showToast={showToast} />}
          {tab === 'hold'   && <Queue status="hold"    onDone={afterAction} showToast={showToast} />}
          {tab === 'posted' && <Queue status="posted"  onDone={afterAction} showToast={showToast} />}
          {tab === 'studio' && <Studio showToast={showToast} />}
          {tab === 'owner'  && isOwner && <OwnerPanel showToast={showToast} />}
        </div>
      </div>
    </div>
  );
}

/** Jembatan: pertahankan signature showToast(msg, isErr) yang dipakai komponen anak. */
function useToastBridge() {
  const t = useMfToast();
  return { show: (msg, isErr = false) => t.show(msg, isErr ? 'error' : 'ok') };
}

async function downloadPng(post, showToast) {
  try {
    await document.fonts.load('800 48px Nunito');
    const blob = await renderCardBlob(post);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = cardFilename(post.id, post.design); a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (e) { showToast('Gagal unduh: ' + (e?.message || ''), true); }
}

// ─── Mode Upload (stepper fokus) ─────────────────────────────────────────────

function UploadMode({ onDone, showToast }) {
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [igUrl, setIgUrl] = useState('');
  const [acting, setActing] = useState(false);
  const [holdNote, setHoldNote] = useState('');
  const [sheet, setSheet] = useState('');   // '' | 'more' | 'hold'
  const [got, setGot] = useState(false);
  const [openedIg, setOpenedIg] = useState(false);

  const { settings } = useSettings();
  const defaultHashtags = settings?.default_hashtags || '#26menfess #FKEP2026';

  const load = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const data = await fetchAdminPosts({ status: 'approved', limit: 30 });
      setQueue([...data].reverse());   // FIFO: terlama dulu
      setIdx(0);
    } catch { setError(true); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const post = queue[idx];
  const caption = post ? buildCaption(post, defaultHashtags) : '';
  const step = openedIg || igUrl ? 3 : got ? 2 : 1;
  const resetStep = () => { setGot(false); setOpenedIg(false); setIgUrl(''); };

  async function handlePosted() {
    if (!post) return;
    if (igUrl && !igUrl.startsWith('https://www.instagram.com/') && !igUrl.startsWith('https://instagram.com/')) {
      showToast('Link Instagram tidak valid.', true); return;
    }
    setActing(true);
    try {
      await adminSetStatus({ id: post.id, action: 'post', igUrl: igUrl || null });
      showToast('Ditandai sudah diposting!');
      resetStep();
      setQueue(prev => prev.filter(p => p.id !== post.id));
      setIdx(0);
      onDone();
    } catch (e) { showToast(e.message || 'Gagal.', true); }
    setActing(false);
  }

  async function handleHold() {
    if (!post || !holdNote.trim()) { showToast('Isi alasan tahan dulu.', true); return; }
    setActing(true);
    try {
      await adminSetStatus({ id: post.id, action: 'hold', adminNote: holdNote });
      showToast('Ditahan.');
      setHoldNote(''); setSheet(''); resetStep();
      setQueue(prev => prev.filter(p => p.id !== post.id));
      setIdx(0);
      onDone();
    } catch (e) { showToast(e.message || 'Gagal.', true); }
    setActing(false);
  }

  async function handleDownload() { if (post) { await downloadPng(post, showToast); setGot(true); } }

  async function handleShare() {
    if (!post) return;
    try {
      await document.fonts.load('800 48px Nunito');
      const blob = await renderCardBlob(post);
      const file = new File([blob], cardFilename(post.id, post.design), { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], text: caption }); setGot(true); }
      else handleDownload();
    } catch { handleDownload(); }
  }

  function skip() { setIdx(prev => (prev + 1) % Math.max(1, queue.length)); setSheet(''); resetStep(); }

  async function copyCaption() {
    try { await navigator.clipboard.writeText(caption); showToast('Caption disalin!'); setGot(true); }
    catch { showToast('Gagal menyalin caption.', true); }
  }

  if (loading) return <Skeleton h={420} />;
  if (error) return <ErrorState onRetry={load} />;
  if (!post) {
    return <EmptyState icon="check" title="Semua sudah diupload" action={<Button variant="secondary" icon="refresh" onClick={load}>Segarkan</Button>}>Tidak ada menfess yang siap diupload saat ini.</EmptyState>;
  }

  return (
    <div className="mf-stack">
      <div className="mf-row">
        <b className="mf-grow">Kartu {idx + 1} dari {queue.length}</b>
        <Button variant="ghost" size="sm" icon="more" onClick={() => setSheet('more')} aria-label="Lainnya">Lainnya</Button>
      </div>
      <div className="mf-upload">
        <PreviewCanvas opts={post} scale={0.3} />
        <div className="mf-stack mf-allow">
          <div className="mf-steps-up" aria-hidden="true"><span className="on" /><span className={step >= 2 ? 'on' : ''} /><span className={step >= 3 ? 'on' : ''} /></div>

          <section className="mf-card mf-stack" aria-labelledby="s1">
            <h3 id="s1">1. Ambil kartu</h3>
            <div className="mf-row-wrap">
              <Button icon="download" onClick={handleDownload}>Unduh PNG</Button>
              <Button variant="secondary" icon="share" onClick={handleShare}>Bagikan</Button>
            </div>
            <textarea className="mf-textarea" style={{ minHeight: 120 }} value={caption} readOnly aria-label="Caption" />
            <div><Button variant="secondary" size="sm" icon="copy" onClick={copyCaption}>Salin caption</Button></div>
            {post.song_title && <SongPill song={post} />}
          </section>

          <section className="mf-card mf-stack" aria-labelledby="s2">
            <h3 id="s2">2. Posting di Instagram</h3>
            <div><Button variant="secondary" icon="instagram" href={IG} target="_blank" rel="noopener noreferrer" onClick={() => setOpenedIg(true)}>Buka @secretmenfess.26</Button></div>
            <Field label="Link post (opsional)" htmlFor="ig-url">
              {(id) => <input id={id} className="mf-input" type="url" value={igUrl} onChange={e => setIgUrl(e.target.value)} placeholder="https://www.instagram.com/p/…" />}
            </Field>
          </section>

          <Button block icon="check" loading={acting} onClick={handlePosted}>3. Sudah diposting</Button>
        </div>
      </div>

      <Sheet open={sheet === 'more'} onClose={() => setSheet('')} title="Lainnya">
        <div className="mf-stack">
          <Button variant="secondary" icon="pause2" onClick={() => setSheet('hold')}>Tahan dulu</Button>
          <Button variant="secondary" icon="back" onClick={skip}>Lewati ke kartu berikutnya</Button>
        </div>
      </Sheet>
      <Sheet open={sheet === 'hold'} onClose={() => setSheet('')} title="Tahan menfess"
        footer={<><Button variant="secondary" onClick={() => setSheet('')}>Batal</Button><Button loading={acting} onClick={handleHold}>Tahan</Button></>}>
        <Field label="Alasan tahan (wajib)" htmlFor="hold-note">
          {(id) => <textarea id={id} className="mf-textarea mf-allow" style={{ minHeight: 100 }} value={holdNote} onChange={e => setHoldNote(e.target.value)} />}
        </Field>
      </Sheet>
    </div>
  );
}

function buildCaption(post, hashtags) {
  const cat = categoryLabel(post.category);
  const to   = post.to_label   ? `untuk: ${post.to_label}` : '';
  const from = post.from_alias ? `\ndari: ${post.from_alias}` : '\ndari: Anonim';
  const song = post.song_title
    ? `\n♪ ${post.song_title}${post.song_artist ? ` — ${post.song_artist}` : ''}`
    : (post.song ? `\n♪ ${post.song}` : '');
  return `[${cat}] ${to}\n${post.body}${from}${song}\n${hashtags}`;
}

// ─── Queue (antrean / ditahan / tayang) ──────────────────────────────────────

function Queue({ status, onDone, showToast }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [menu, setMenu] = useState(null);       // post untuk sheet aksi
  const [reject, setReject] = useState(null);   // post untuk sheet tolak
  const [reason, setReason] = useState('');
  const [takedown, setTakedown] = useState(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const data = await fetchAdminPosts({ status, search: debouncedSearch || null, limit: 20 });
      setPosts(status === 'pending' ? [...data].reverse() : data);
    } catch { setError(true); }
    setLoading(false);
  }, [status, debouncedSearch]);
  useEffect(() => { load(); }, [load]);

  async function action(post, act, extra = {}) {
    setActing(true);
    try {
      await adminSetStatus({ id: post.id, action: act, ...extra });
      showToast('Berhasil.');
      setMenu(null); setReject(null); setTakedown(null); setReason('');
      load(); onDone();
    } catch (e) { showToast(e.message || 'Gagal.', true); }
    setActing(false);
  }

  return (
    <div className="mf-stack">
      <div className="mf-row">
        <input className="mf-input mf-allow" type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari isi menfess…" aria-label="Cari isi menfess" />
        <Button variant="secondary" className="mf-iconbtn" style={{ padding: 0 }} icon="refresh" onClick={load} aria-label="Segarkan" />
      </div>

      {loading && <div className="mf-stack">{[1, 2, 3].map(i => <Skeleton key={i} h={104} />)}</div>}
      {!loading && error && <ErrorState onRetry={load} />}
      {!loading && !error && posts.length === 0 && <EmptyState icon="inbox" title="Kosong">Tidak ada menfess di sini.</EmptyState>}
      {!loading && !error && posts.map(post => (
        <div key={post.id} className="mf-qrow">
          <CardThumb post={post} onClick={() => setMenu(post)} label="Buka aksi menfess" />
          <div className="mf-grow">
            <div className="mf-row-wrap" style={{ marginBottom: 4 }}>
              <StatusBadge status={post.status} /><Badge>{categoryLabel(post.category)}</Badge>
              <span className="mf-xs mf-muted">#{shortCode(post.user_id)} · {formatRelative(post.created_at)}</span>
            </div>
            <p className="mf-clamp2 mf-allow" style={{ margin: '0 0 8px' }}>{post.body}</p>
            <div className="mf-row-wrap">
              {(post.status === 'pending' || post.status === 'hold') && <Button size="sm" icon="check" onClick={() => action(post, 'approve')} disabled={acting}>Setujui</Button>}
              {post.status === 'approved' && <Button size="sm" icon="instagram" onClick={() => action(post, 'post', { igUrl: null })} disabled={acting}>Tandai diposting</Button>}
              {post.status === 'posted' && <Button size="sm" variant="secondary" icon="download" onClick={() => downloadPng(post, showToast)}>PNG</Button>}
              <Button size="sm" variant="ghost" icon="more" aria-label="Aksi lain" onClick={() => setMenu(post)} />
            </div>
          </div>
        </div>
      ))}

      <Sheet open={!!menu} onClose={() => setMenu(null)} title="Aksi menfess">
        {menu && (
          <div className="mf-stack">
            <div style={{ width: 'min(100%,240px)', margin: '0 auto' }}><CardThumb post={menu} scale={0.3} eager className="static" /></div>
            <p className="mf-allow">{menu.body}</p>
            <SongPill song={menu} />
            <Button variant="secondary" icon="download" onClick={() => downloadPng(menu, showToast)}>Unduh PNG</Button>
            {(menu.status === 'pending' || menu.status === 'hold') && <Button variant="danger" icon="ban" onClick={() => { setReject(menu); setMenu(null); }}>Tolak…</Button>}
            {menu.status === 'posted' && <Button variant="danger" icon="trash" onClick={() => { setTakedown(menu); setMenu(null); }}>Turunkan…</Button>}
          </div>
        )}
      </Sheet>

      <Sheet open={!!reject} onClose={() => { setReject(null); setReason(''); }} title="Tolak menfess"
        footer={<><Button variant="secondary" onClick={() => { setReject(null); setReason(''); }}>Batal</Button><Button variant="danger" disabled={!reason} loading={acting} onClick={() => action(reject, 'reject', { reason })}>Tolak</Button></>}>
        <Field label="Alasan (terlihat pengirim)" htmlFor="rj">
          {(id) => <select id={id} className="mf-select" value={reason} onChange={e => setReason(e.target.value)}><option value="">— Pilih alasan —</option>{REJECT_REASONS.map(r => <option key={r}>{r}</option>)}</select>}
        </Field>
      </Sheet>

      <ConfirmDialog open={!!takedown} title="Turunkan dari feed?" danger confirmLabel="Turunkan" loading={acting} onConfirm={() => action(takedown, 'takedown')} onCancel={() => setTakedown(null)}>
        <p>Menfess hilang dari feed publik. Post di Instagram perlu dihapus manual.</p>
      </ConfirmDialog>
    </div>
  );
}

// ─── Studio ───────────────────────────────────────────────────────────────────

function Studio({ showToast }) {
  const DRAFT_KEY = 'mf:studio';
  const load = () => { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch { return null; } };
  const save = (d) => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch { /* ignore */ } };

  const draft = load() || {};
  const [form, setForm] = useState({
    body: draft.body || '', title: draft.title || '', to_label: '', from_alias: '',
    design: draft.design || 'pink', text_size: draft.text_size || 'auto',
    text_color: draft.text_color || 'dark', align: draft.align || 'center',
    category: draft.category || 'info',
  });
  const [saving, setSaving] = useState('');

  function update(key, val) { const next = { ...form, [key]: val }; setForm(next); save(next); }

  async function handleSave(asPosted = false) {
    setSaving(asPosted ? 'posted' : 'approved');
    try {
      const { error } = await supabase.from('menfess_posts').insert({
        ...form, source: 'admin', status: asPosted ? 'posted' : 'approved',
        posted_at: asPosted ? new Date().toISOString() : null,
      });
      if (error) throw error;
      showToast(asPosted ? 'Disimpan & ditandai tayang!' : 'Disimpan ke daftar!');
    } catch (e) { showToast(e.message || 'Gagal.', true); }
    setSaving('');
  }

  return (
    <div className="mf-compose">
      <div className="mf-stack mf-allow">
        <Field label="Judul (opsional)" htmlFor="st-t">{(id) => <input id={id} className="mf-input" value={form.title} onChange={e => update('title', e.target.value)} />}</Field>
        <Field label="Isi kartu" htmlFor="st-b">{(id) => <textarea id={id} className="mf-textarea" value={form.body} onChange={e => update('body', e.target.value)} />}</Field>
        <div className="mf-field"><span className="mf-label">Desain</span><Segmented label="Desain" value={form.design} onChange={v => update('design', v)} options={[{ value: 'pink', label: 'Pink' }, { value: 'green', label: 'Hijau' }, { value: 'picnic', label: 'Piknik' }]} /></div>
        <div className="mf-field"><span className="mf-label">Ukuran teks</span><Segmented label="Ukuran teks" value={form.text_size} onChange={v => update('text_size', v)} options={['auto', 'xs', 'sm', 'md', 'lg'].map(v => ({ value: v, label: v === 'auto' ? 'Auto' : v.toUpperCase() }))} /></div>
        <div className="mf-field"><span className="mf-label">Warna teks</span><Segmented label="Warna teks" value={form.text_color} onChange={v => update('text_color', v)} options={[{ value: 'dark', label: 'Gelap' }, { value: 'white', label: 'Terang' }]} /></div>
        <div className="mf-field"><span className="mf-label">Rata teks</span><Segmented label="Rata teks" value={form.align} onChange={v => update('align', v)} options={[{ value: 'center', label: 'Tengah' }, { value: 'left', label: 'Kiri' }]} /></div>
      </div>
      <aside className="mf-compose-preview mf-stack">
        <PreviewCanvas opts={{ ...form, body: form.body || '(preview)' }} scale={0.3} />
        <Button icon="download" onClick={() => downloadPng({ ...form, id: 'studio' }, showToast)}>Unduh PNG</Button>
        <Button variant="secondary" icon="plus" loading={saving === 'approved'} onClick={() => handleSave(false)}>Simpan ke daftar</Button>
        <Button variant="secondary" icon="instagram" loading={saving === 'posted'} onClick={() => handleSave(true)}>Simpan & tandai tayang</Button>
      </aside>
    </div>
  );
}

// ─── Owner Panel ──────────────────────────────────────────────────────────────

function OwnerPanel({ showToast }) {
  const [admins, setAdmins] = useState([]);
  const [settings, setSettings] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('admin');
  const [removing, setRemoving] = useState(null);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState(false);

  const loadAll = useCallback(() => {
    setErr(false);
    fetchAdminList().then(setAdmins).catch(() => setErr(true));
    fetchSettings().then(setSettings).catch(() => setErr(true));
  }, []);
  useEffect(() => { loadAll(); }, [loadAll]);

  async function add() {
    if (!newEmail.includes('@')) { showToast('Email tidak valid.', true); return; }
    try { await upsertAdmin(newEmail.trim().toLowerCase(), newRole); showToast('Admin ditambahkan!'); setNewEmail(''); fetchAdminList().then(setAdmins); }
    catch (e) { showToast(e.message || 'Gagal.', true); }
  }
  async function doRemove() {
    try { await removeAdmin(removing); showToast('Dihapus.'); setRemoving(null); fetchAdminList().then(setAdmins); }
    catch (e) { showToast(e.message || 'Gagal.', true); setRemoving(null); }
  }
  async function saveSettings(patch) {
    try { await updateSettings(patch); setSettings(s => ({ ...s, ...patch })); setSaved(true); setTimeout(() => setSaved(false), 4000); }
    catch (e) { showToast(e.message || 'Gagal menyimpan.', true); }
  }

  if (err && !settings) return <ErrorState onRetry={loadAll} />;

  return (
    <div className="mf-stack-lg mf-allow">
      {saved && <span className="mf-saved" role="status">Tersimpan ✓</span>}
      {settings && (
        <>
          <section className="mf-card mf-stack"><h2>Penerimaan</h2>
            <label className="mf-switch"><input type="checkbox" checked={!!settings.accepting} onChange={e => saveSettings({ accepting: e.target.checked })} /><span><b>Terima menfess</b> — {settings.accepting ? 'aktif' : 'ditutup'}</span></label>
            {!settings.accepting && <Field label="Pesan saat ditutup" htmlFor="o-cm">{(id) => <input id={id} className="mf-input" defaultValue={settings.closed_message || ''} onBlur={e => saveSettings({ closed_message: e.target.value })} />}</Field>}
          </section>
          <section className="mf-card mf-stack"><h2>Pembatasan</h2>
            <div className="mf-row" style={{ alignItems: 'flex-start' }}>
              <div className="mf-grow"><Field label="Batas harian" htmlFor="o-dl">{(id) => <input id={id} className="mf-input" type="number" min="1" defaultValue={settings.daily_limit || 5} onBlur={e => saveSettings({ daily_limit: parseInt(e.target.value, 10) || 5 })} />}</Field></div>
              <div className="mf-grow"><Field label="Jeda (detik)" htmlFor="o-cd">{(id) => <input id={id} className="mf-input" type="number" min="0" defaultValue={settings.cooldown_seconds || 30} onBlur={e => saveSettings({ cooldown_seconds: parseInt(e.target.value, 10) || 30 })} />}</Field></div>
            </div>
          </section>
          <section className="mf-card mf-stack"><h2>Konten</h2>
            <Field label="Hashtag default caption" htmlFor="o-ht">{(id) => <input id={id} className="mf-input" defaultValue={settings.default_hashtags || '#26menfess #FKEP2026'} onBlur={e => saveSettings({ default_hashtags: e.target.value })} />}</Field>
            <Field label="Pengumuman di landing (opsional)" htmlFor="o-an">{(id) => <input id={id} className="mf-input" defaultValue={settings.announcement || ''} onBlur={e => saveSettings({ announcement: e.target.value || null })} />}</Field>
          </section>
        </>
      )}
      <section className="mf-card mf-stack"><h2>Kelola admin</h2>
        {admins.map(a => (
          <div key={a.email} className="mf-row">
            <div className="mf-grow" style={{ overflowWrap: 'anywhere' }}><b>{a.email}</b></div>
            <Badge>{a.role}</Badge>
            <Button variant="ghost" size="sm" icon="trash" aria-label={`Hapus ${a.email}`} onClick={() => setRemoving(a.email)} />
          </div>
        ))}
        <div className="mf-row-wrap">
          <input className="mf-input" style={{ flex: '1 1 200px' }} type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="email@gmail.com" aria-label="Email admin baru" />
          <select className="mf-select" style={{ width: 110 }} value={newRole} onChange={e => setNewRole(e.target.value)} aria-label="Peran"><option value="admin">admin</option><option value="owner">owner</option></select>
          <Button icon="plus" onClick={add}>Tambah</Button>
        </div>
      </section>
      <ConfirmDialog open={!!removing} title="Hapus admin?" danger confirmLabel="Hapus" onConfirm={doRemove} onCancel={() => setRemoving(null)}><p>{removing} tidak lagi bisa mengakses panel admin.</p></ConfirmDialog>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useSettings() {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {});
  }, []);
  return { settings };
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
