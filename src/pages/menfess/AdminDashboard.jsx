// ─── AdminDashboard — /26menfess/admin ───────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { useMfAuth } from '@/lib/menfess/useMfAuth';
import {
  fetchAdminCounts, fetchAdminPosts, adminSetStatus,
  fetchSettings, updateSettings, fetchAdminList, upsertAdmin, removeAdmin,
  checkIsOwner, shortCode,
} from '@/lib/menfess/api';
import { cacheGet, cacheSet, cacheInvalidate, TTL } from '@/lib/menfess/cache';
import { renderCardBlob, drawCard, cardFilename, categoryLabel } from '@/lib/menfess/renderCard';
import { REJECT_REASONS } from '@/lib/menfess/rules';
import StatusBadge from '@/components/menfess/StatusBadge';
import { formatRelative } from '@/components/menfess/utils';
import { PullIndicator } from '@/components/makrab/PullToRefresh';
import { usePullToRefresh } from '@/components/makrab/usePullToRefresh';
// usePullToRefresh(onRefresh, disabled) → { pull, phase }

const TABS = [
  { id: 'upload', label: '📤 Upload' },
  { id: 'queue',  label: '⏳ Antrean' },
  { id: 'hold',   label: '⏸️ Ditahan' },
  { id: 'posted', label: '📸 Tayang' },
  { id: 'studio', label: '🎨 Studio' },
  { id: 'owner',  label: '👑 Owner' },
];

export default function AdminDashboard() {
  const { user, isOwner } = useMfAuth();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'upload';

  const [counts,  setCounts]  = useState({});
  const [toast,   setToast]   = useState('');
  const lastFetchRef = useRef(0);

  function showToast(msg, isErr = false) {
    setToast({ msg, isErr });
    setTimeout(() => setToast(''), 3500);
  }

  const refreshCounts = useCallback(async () => {
    try {
      const c = await fetchAdminCounts();
      setCounts(c);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { refreshCounts(); }, []);

  // Refresh saat tab kembali aktif
  useEffect(() => {
    const onVis = () => {
      const now = Date.now();
      if (!document.hidden && now - lastFetchRef.current > 30000) {
        lastFetchRef.current = now;
        refreshCounts();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [refreshCounts]);

  const { pull, phase } = usePullToRefresh(refreshCounts);

  return (
    <div className="mf" style={{ colorScheme: 'light' }}>
      <PullIndicator pull={pull} phase={phase} />

      <header className="mf-topbar">
        <span style={{ fontFamily:'var(--mf-font-brand)',fontWeight:700,fontSize:'1rem' }}>
          🛡️ Admin 26Menfess
        </span>
        <div style={{ display:'flex',gap:6 }}>
          <a href="/26menfess/app" className="mf-btn mf-btn-ghost" style={{ fontSize:'.8rem',padding:'6px 10px' }}>
            ← Dashboard
          </a>
          <button className="mf-btn mf-btn-ghost" onClick={() => supabase.auth.signOut()} style={{ fontSize:'.8rem',padding:'6px 10px' }}>
            Keluar
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="mf-tabs" style={{ overflowX:'auto',scrollbarWidth:'none' }}>
        {TABS.filter(t => t.id !== 'owner' || isOwner).map(t => (
          <button key={t.id} className={`mf-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setParams({ tab: t.id })}>
            {t.label}
            {counts[t.id] > 0 && t.id !== 'studio' && t.id !== 'owner' && (
              <span style={{ background:'var(--mf-brick)',color:'#fff',borderRadius:999,padding:'1px 5px',fontSize:'.72rem',marginLeft:4 }}>
                {counts[t.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      <main className="mf-page" style={{ paddingTop:24 }}>
        {tab === 'upload' && <UploadMode onDone={refreshCounts} showToast={showToast} />}
        {tab === 'queue'  && <Queue status="pending" onDone={refreshCounts} showToast={showToast} />}
        {tab === 'hold'   && <Queue status="hold"    onDone={refreshCounts} showToast={showToast} />}
        {tab === 'posted' && <Queue status="posted"  onDone={refreshCounts} showToast={showToast} />}
        {tab === 'studio' && <Studio showToast={showToast} />}
        {tab === 'owner'  && isOwner && <OwnerPanel showToast={showToast} />}
      </main>

      {toast && (
        <div className="mf-toast-wrap" aria-live="polite">
          <div className={`mf-toast ${toast.isErr ? 'error' : ''}`}>{toast.msg}</div>
        </div>
      )}
    </div>
  );
}

// ─── Mode Upload ─────────────────────────────────────────────────────────────

function UploadMode({ onDone, showToast }) {
  const [queue,     setQueue]     = useState([]);
  const [idx,       setIdx]       = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [igUrl,     setIgUrl]     = useState('');
  const [acting,    setActing]    = useState(false);
  const [holdNote,  setHoldNote]  = useState('');
  const [showHold,  setShowHold]  = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showReject,   setShowReject]   = useState(false);
  const previewRef = useRef(null);

  const { settings } = useSettings();
  const defaultHashtags = settings?.default_hashtags || '#26menfess #FKEP2026';

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchAdminPosts({ status: 'approved', limit: 30 });
      // FIFO: terlama dulu
      setQueue([...data].reverse());
      setIdx(0);
    } catch { /* ignore */ }
    setLoading(false);
  }

  const post = queue[idx];

  // Render preview canvas saat post berubah
  useEffect(() => {
    if (!post || !previewRef.current) return;
    let alive = true;
    (async () => {
      await document.fonts.load('800 48px Nunito');
      if (!alive) return;
      await drawCard(previewRef.current, post, 0.25); // 300×375
    })();
    return () => { alive = false; };
  }, [post]);

  const caption = post ? buildCaption(post, defaultHashtags) : '';

  async function handlePosted() {
    if (!post) return;
    if (igUrl && !igUrl.startsWith('https://www.instagram.com/') && !igUrl.startsWith('https://instagram.com/')) {
      showToast('Link Instagram tidak valid.', true); return;
    }
    setActing(true);
    try {
      await adminSetStatus({ id: post.id, action: 'post',
        igUrl: igUrl || null });
      showToast('✅ Ditandai sudah diposting!');
      setIgUrl('');
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
      showToast('⏸️ Ditahan.');
      setHoldNote(''); setShowHold(false);
      setQueue(prev => prev.filter(p => p.id !== post.id));
      setIdx(0);
      onDone();
    } catch (e) { showToast(e.message || 'Gagal.', true); }
    setActing(false);
  }

  async function handleDownload() {
    if (!post) return;
    try {
      await document.fonts.load('800 48px Nunito');
      const blob = await renderCardBlob(post);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = cardFilename(post.id, post.design); a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) { showToast('Gagal unduh: ' + e.message, true); }
  }

  async function handleShare() {
    if (!post) return;
    try {
      await document.fonts.load('800 48px Nunito');
      const blob = await renderCardBlob(post);
      const file = new File([blob], cardFilename(post.id, post.design), { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: caption });
      } else {
        handleDownload();
      }
    } catch { handleDownload(); }
  }

  function skip() {
    setIdx(prev => (prev + 1) % Math.max(1, queue.length));
    setShowHold(false); setShowReject(false);
  }

  if (loading) return <div className="mf-skeleton" style={{ height:400 }} />;

  if (!post) {
    return (
      <div className="mf-empty">
        <span className="mf-empty-icon">🎉</span>
        <p><strong>Tidak ada menfess yang siap diupload saat ini.</strong></p>
        <button className="mf-btn mf-btn-secondary" onClick={load}>Segarkan</button>
      </div>
    );
  }

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:16,maxWidth:480,margin:'0 auto' }}>
      {/* Counter */}
      <p style={{ textAlign:'center',opacity:.6,fontSize:'.85rem' }}>
        Kartu {idx+1} / {queue.length} siap upload
      </p>

      {/* Preview canvas — WYSIWYG, selalu terang */}
      <div style={{ position:'relative',width:'100%',aspectRatio:'4/5',borderRadius:'var(--mf-radius)',overflow:'hidden',border:'2px solid var(--mf-ink)',boxShadow:'var(--mf-shadow)' }}>
        <canvas ref={previewRef} style={{ width:'100%',height:'100%',display:'block',colorScheme:'light' }} />
      </div>

      {/* Caption */}
      <div style={{ display:'flex',gap:8 }}>
        <textarea className="mf-textarea mf-allow" value={caption} readOnly
          style={{ flex:1,minHeight:96,fontSize:'.82rem',resize:'vertical' }} />
        <button className="mf-btn mf-btn-secondary" style={{ alignSelf:'flex-start' }}
          onClick={() => { navigator.clipboard.writeText(caption); showToast('Caption disalin!'); }}>
          📋 Salin
        </button>
      </div>

      {/* Tombol aksi */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
        <button className="mf-btn mf-btn-primary" onClick={handleDownload}>📥 Unduh PNG</button>
        <button className="mf-btn mf-btn-secondary" onClick={handleShare}>🔗 Bagikan</button>
        <a href="https://www.instagram.com/secretmenfess.26/" target="_blank" rel="noopener noreferrer"
          className="mf-btn mf-btn-secondary" style={{ textAlign:'center' }}>
          📸 Buka IG
        </a>
        <button className="mf-btn mf-btn-ghost" onClick={skip} disabled={acting}>Lewati →</button>
      </div>

      {/* Link IG opsional */}
      <input className="mf-input mf-allow" type="url" value={igUrl} onChange={e => setIgUrl(e.target.value)}
        placeholder="https://www.instagram.com/p/... (opsional)" />

      {/* Sudah diposting */}
      <button className="mf-btn mf-btn-primary" style={{ background:'var(--mf-teal)' }}
        onClick={handlePosted} disabled={acting}>
        {acting ? 'Memproses…' : '✔ Sudah Diposting'}
      </button>

      {/* Tahan */}
      {!showHold ? (
        <button className="mf-btn mf-btn-ghost" onClick={() => setShowHold(true)}>⏸️ Tahan dulu</button>
      ) : (
        <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
          <textarea className="mf-textarea mf-allow" value={holdNote} onChange={e => setHoldNote(e.target.value)}
            placeholder="Alasan tahan (wajib)…" rows={3} />
          <div style={{ display:'flex',gap:8 }}>
            <button className="mf-btn mf-btn-primary" style={{ flex:1 }} onClick={handleHold} disabled={acting}>Konfirmasi Tahan</button>
            <button className="mf-btn mf-btn-ghost" onClick={() => setShowHold(false)}>Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}

function buildCaption(post, hashtags) {
  const cat = categoryLabel(post.category);
  const to   = post.to_label   ? `untuk: ${post.to_label}` : '';
  const from = post.from_alias ? `\ndari: ${post.from_alias}` : '\ndari: Anonim';
  const song = post.song_title ? `\n♪ ${post.song_title}${post.song_artist ? ` — ${post.song_artist}` : ''}` : '';
  return `[${cat}] ${to}\n${post.body}${from}${song}\n${hashtags}`;
}

// ─── Queue tab (antrean / ditahan / tayang) ───────────────────────────────────

function Queue({ status, onDone, showToast }) {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => { load(); }, [status, debouncedSearch]);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchAdminPosts({ status: status === 'pending' ? 'pending' : status, search: debouncedSearch || null, limit: 20 });
      setPosts(status === 'pending' ? [...data].reverse() : data);
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function action(post, act, extra = {}) {
    try {
      await adminSetStatus({ id: post.id, action: act, ...extra });
      showToast('✅ Berhasil.');
      load(); onDone();
    } catch (e) { showToast(e.message || 'Gagal.', true); }
  }

  async function downloadPost(post) {
    try {
      await document.fonts.load('800 48px Nunito');
      const blob = await renderCardBlob(post);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = cardFilename(post.id, post.design); a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) { showToast('Gagal unduh.', true); }
  }

  if (loading) return <div style={{ display:'flex',flexDirection:'column',gap:12 }}>{[1,2,3].map(i => <div key={i} className="mf-skeleton" style={{ height:120 }} />)}</div>;

  return (
    <div>
      <div style={{ marginBottom:16,display:'flex',gap:10 }}>
        <input className="mf-input mf-allow" type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Cari isi…" style={{ flex:1 }} />
        <button className="mf-btn mf-btn-secondary" onClick={load} style={{ flexShrink:0 }}>🔄</button>
      </div>

      {posts.length === 0 && <div className="mf-empty"><span className="mf-empty-icon">📭</span><p>Kosong.</p></div>}

      <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
        {posts.map(post => (
          <AdminCard key={post.id} post={post} onAction={action} onDownload={downloadPost} showToast={showToast} />
        ))}
      </div>
    </div>
  );
}

function AdminCard({ post, onAction, onDownload, showToast }) {
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [igUrl, setIgUrl] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let alive = true;
    (async () => {
      await document.fonts.load('800 48px Nunito');
      if (!alive) return;
      await drawCard(canvasRef.current, post, 0.15); // mini 180×225
    })();
    return () => { alive = false; };
  }, [post]);

  return (
    <div className="mf-card mf-allow" style={{ display:'flex',gap:12 }}>
      <canvas ref={canvasRef} style={{ width:90,height:112,flexShrink:0,borderRadius:8,border:'1px solid var(--mf-ink)',colorScheme:'light' }} />

      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ display:'flex',gap:6,flexWrap:'wrap',marginBottom:6 }}>
          <StatusBadge status={post.status} />
          <span className="mf-badge" style={{ background:'var(--mf-soft)' }}>{categoryLabel(post.category)}</span>
          <span style={{ fontSize:'.75rem',opacity:.5 }}>#{shortCode(post.user_id)}</span>
        </div>

        {post.to_label && <p style={{ fontSize:'.8rem',opacity:.7,margin:'2px 0' }}>Untuk: {post.to_label}</p>}
        <p style={{ fontSize:'.9rem',marginBottom:4,wordBreak:'break-word',
          overflow:'hidden',display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical' }}>
          {post.body}
        </p>
        <p style={{ fontSize:'.75rem',opacity:.5 }}>{formatRelative(post.created_at)}</p>

        <div style={{ display:'flex',gap:6,flexWrap:'wrap',marginTop:8 }}>
          {post.status === 'pending' && <>
            <button className="mf-btn mf-btn-primary" style={{ fontSize:'.78rem',padding:'6px 10px' }}
              onClick={() => onAction(post, 'approve')}>✅ Setujui</button>
            <button className="mf-btn mf-btn-ghost" style={{ fontSize:'.78rem',padding:'6px 10px' }}
              onClick={() => setShowReject(!showReject)}>❌ Tolak</button>
          </>}
          {post.status === 'hold' && <>
            <button className="mf-btn mf-btn-primary" style={{ fontSize:'.78rem',padding:'6px 10px' }}
              onClick={() => onAction(post, 'approve')}>✅ Setujui</button>
            <button className="mf-btn mf-btn-ghost" style={{ fontSize:'.78rem',padding:'6px 10px' }}
              onClick={() => setShowReject(!showReject)}>❌ Tolak</button>
          </>}
          {post.status === 'approved' && <>
            <input className="mf-input mf-allow" type="url" value={igUrl} onChange={e => setIgUrl(e.target.value)}
              placeholder="https://instagram.com/p/…" style={{ fontSize:'.78rem',padding:'6px 8px' }} />
            <button className="mf-btn mf-btn-primary" style={{ fontSize:'.78rem',padding:'6px 10px' }}
              onClick={() => onAction(post, 'post', { igUrl: igUrl || null })}>📸 Tandai Diposting</button>
          </>}
          {post.status === 'posted' && <>
            <button className="mf-btn mf-btn-ghost" style={{ fontSize:'.78rem',padding:'6px 10px' }}
              onClick={() => onAction(post, 'takedown')}>🗑️ Turunkan</button>
          </>}
          <button className="mf-btn mf-btn-secondary" style={{ fontSize:'.78rem',padding:'6px 10px' }}
            onClick={() => onDownload(post)}>📥 PNG</button>
        </div>

        {showReject && (
          <div style={{ marginTop:8,display:'flex',flexDirection:'column',gap:6 }}>
            <select className="mf-select" value={rejectReason} onChange={e => setRejectReason(e.target.value)}>
              <option value="">— Pilih alasan —</option>
              {REJECT_REASONS.map(r => <option key={r}>{r}</option>)}
            </select>
            <button className="mf-btn mf-btn-danger" disabled={!rejectReason}
              onClick={() => { onAction(post, 'reject', { reason: rejectReason }); setShowReject(false); }}>
              Konfirmasi Tolak
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Studio ───────────────────────────────────────────────────────────────────

function Studio({ showToast }) {
  const DRAFT_KEY = 'mf:studio';
  const load = () => { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch { return null; } };
  const save = (d)  => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch { /* ignore */ } };

  const draft = load() || {};
  const [form, setForm] = useState({
    body: draft.body || '', title: draft.title || '', to_label: '', from_alias: '',
    design: draft.design || 'pink', text_size: draft.text_size || 'auto',
    text_color: draft.text_color || 'dark', align: draft.align || 'center',
    category: draft.category || 'info',
  });
  const canvasRef = useRef(null);

  function update(key, val) {
    const next = { ...form, [key]: val };
    setForm(next);
    save(next);
  }

  useEffect(() => {
    if (!canvasRef.current) return;
    let alive = true;
    (async () => {
      await document.fonts.load('800 48px Nunito');
      if (!alive) return;
      await drawCard(canvasRef.current, { ...form, body: form.body || '(preview)' }, 0.25);
    })();
    return () => { alive = false; };
  }, [form]);

  async function handleDownload() {
    try {
      await document.fonts.load('800 48px Nunito');
      const blob = await renderCardBlob(form);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = `26menfess-studio-${form.design}.png`; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) { showToast('Gagal: ' + e.message, true); }
  }

  async function handleSave(asPosted = false) {
    try {
      const { error } = await supabase.from('menfess_posts').insert({
        ...form, source: 'admin', status: asPosted ? 'posted' : 'approved',
        posted_at: asPosted ? new Date().toISOString() : null,
      });
      if (error) throw error;
      showToast(asPosted ? 'Disimpan & ditandai tayang!' : 'Disimpan ke daftar!');
    } catch (e) { showToast(e.message || 'Gagal.', true); }
  }

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:16,maxWidth:480,margin:'0 auto' }}>
      <h2 style={{ marginBottom:0 }}>🎨 Studio Kartu Admin</h2>

      {/* Preview */}
      <canvas ref={canvasRef} style={{ width:'100%',aspectRatio:'4/5',display:'block',borderRadius:'var(--mf-radius)',border:'2px solid var(--mf-ink)',colorScheme:'light' }} />

      {/* Form */}
      <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
        <input className="mf-input mf-allow" type="text" placeholder="Judul (opsional)" value={form.title} onChange={e => update('title', e.target.value)} />
        <textarea className="mf-textarea mf-allow" value={form.body} onChange={e => update('body', e.target.value)} placeholder="Isi kartu…" rows={5} />

        <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
          {['pink','green'].map(d => (
            <button key={d} className={`mf-btn ${form.design === d ? 'mf-btn-primary' : 'mf-btn-secondary'}`}
              onClick={() => update('design', d)}>
              {d === 'pink' ? '🌸 Pink' : '🌿 Hijau'}
            </button>
          ))}
        </div>

        <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
          {['auto','xs','sm','md','lg'].map(s => (
            <button key={s} className={`mf-btn ${form.text_size === s ? 'mf-btn-primary' : 'mf-btn-secondary'}`}
              style={{ flex:1 }} onClick={() => update('text_size', s)}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ display:'flex',gap:10 }}>
          <button className={`mf-btn ${form.text_color === 'dark' ? 'mf-btn-primary' : 'mf-btn-secondary'}`}
            style={{ flex:1 }} onClick={() => update('text_color', 'dark')}>⬛ Gelap</button>
          <button className={`mf-btn ${form.text_color === 'white' ? 'mf-btn-primary' : 'mf-btn-secondary'}`}
            style={{ flex:1 }} onClick={() => update('text_color', 'white')}>⬜ Terang</button>
        </div>

        <div style={{ display:'flex',gap:10 }}>
          <button className={`mf-btn ${form.align === 'center' ? 'mf-btn-primary' : 'mf-btn-secondary'}`}
            style={{ flex:1 }} onClick={() => update('align', 'center')}>≡ Tengah</button>
          <button className={`mf-btn ${form.align === 'left' ? 'mf-btn-primary' : 'mf-btn-secondary'}`}
            style={{ flex:1 }} onClick={() => update('align', 'left')}>≡ Kiri</button>
        </div>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
        <button className="mf-btn mf-btn-primary" onClick={handleDownload}>📥 Unduh PNG</button>
        <button className="mf-btn mf-btn-secondary" onClick={() => handleSave(false)}>💾 Simpan ke Daftar</button>
        <button className="mf-btn mf-btn-secondary" onClick={() => handleSave(true)} style={{ gridColumn:'1/-1' }}>
          📸 Simpan & Tandai Tayang
        </button>
      </div>
    </div>
  );
}

// ─── Owner Panel ──────────────────────────────────────────────────────────────

function OwnerPanel({ showToast }) {
  const [admins,   setAdmins]   = useState([]);
  const [settings, setSettings] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newRole,  setNewRole]  = useState('admin');

  useEffect(() => {
    fetchAdminList().then(setAdmins).catch(() => {});
    fetchSettings().then(setSettings).catch(() => {});
  }, []);

  async function add() {
    if (!newEmail.includes('@')) { showToast('Email tidak valid.', true); return; }
    try {
      await upsertAdmin(newEmail.trim().toLowerCase(), newRole);
      showToast('Admin ditambahkan!');
      setNewEmail('');
      fetchAdminList().then(setAdmins);
    } catch (e) { showToast(e.message || 'Gagal.', true); }
  }

  async function remove(email) {
    if (!confirm(`Hapus ${email}?`)) return;
    try {
      await removeAdmin(email);
      showToast('Dihapus.');
      fetchAdminList().then(setAdmins);
    } catch (e) { showToast(e.message || 'Gagal.', true); }
  }

  async function saveSettings(patch) {
    try {
      await updateSettings(patch);
      setSettings(s => ({ ...s, ...patch }));
      showToast('Pengaturan disimpan.');
    } catch (e) { showToast(e.message || 'Gagal.', true); }
  }

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:24 }}>
      {/* Admin list */}
      <section>
        <h2 style={{ marginBottom:12 }}>👥 Kelola Admin</h2>
        {admins.map(a => (
          <div key={a.email} className="mf-card" style={{ background:'white',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8 }}>
            <div>
              <strong>{a.email}</strong>
              <span className="mf-badge" style={{ background: a.role === 'owner' ? 'var(--mf-peach)' : 'var(--mf-soft)',marginLeft:8 }}>{a.role}</span>
            </div>
            <button className="mf-btn mf-btn-ghost" style={{ color:'var(--mf-brick)',fontSize:'.8rem' }} onClick={() => remove(a.email)}>Hapus</button>
          </div>
        ))}
        <div style={{ display:'flex',gap:8,marginTop:12,flexWrap:'wrap' }}>
          <input className="mf-input mf-allow" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="email@google.com" style={{ flex:1 }} />
          <select className="mf-select" value={newRole} onChange={e => setNewRole(e.target.value)} style={{ flex:'0 0 auto',width:100 }}>
            <option value="admin">admin</option>
            <option value="owner">owner</option>
          </select>
          <button className="mf-btn mf-btn-primary" onClick={add}>+ Tambah</button>
        </div>
      </section>

      {/* Settings */}
      {settings && (
        <section>
          <h2 style={{ marginBottom:12 }}>⚙️ Pengaturan</h2>
          <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
            <label style={{ display:'flex',gap:12,alignItems:'center' }}>
              <input type="checkbox" checked={!!settings.accepting} onChange={e => saveSettings({ accepting: e.target.checked })} style={{ width:18,height:18 }} />
              <span><strong>Terima menfess</strong> {settings.accepting ? '(aktif)' : '(ditutup)'}</span>
            </label>

            {!settings.accepting && (
              <div>
                <label className="mf-label">Pesan saat ditutup</label>
                <input className="mf-input mf-allow" type="text" defaultValue={settings.closed_message || ''}
                  onBlur={e => saveSettings({ closed_message: e.target.value })} />
              </div>
            )}

            <div>
              <label className="mf-label">Hashtag default caption</label>
              <input className="mf-input mf-allow" type="text" defaultValue={settings.default_hashtags || '#26menfess #FKEP2026'}
                onBlur={e => saveSettings({ default_hashtags: e.target.value })} />
            </div>

            <div>
              <label className="mf-label">Pengumuman di landing (opsional)</label>
              <input className="mf-input mf-allow" type="text" defaultValue={settings.announcement || ''}
                onBlur={e => saveSettings({ announcement: e.target.value || null })} />
            </div>

            <div style={{ display:'flex',gap:12 }}>
              <div style={{ flex:1 }}>
                <label className="mf-label">Batas harian</label>
                <input className="mf-input" type="number" defaultValue={settings.daily_limit || 5}
                  onBlur={e => saveSettings({ daily_limit: parseInt(e.target.value) || 5 })} />
              </div>
              <div style={{ flex:1 }}>
                <label className="mf-label">Jeda (detik)</label>
                <input className="mf-input" type="number" defaultValue={settings.cooldown_seconds || 30}
                  onBlur={e => saveSettings({ cooldown_seconds: parseInt(e.target.value) || 30 })} />
              </div>
            </div>
          </div>
        </section>
      )}
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
