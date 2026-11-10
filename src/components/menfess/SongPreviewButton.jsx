// ─── SongPreviewButton — putar lagu via Audius (open source) ─────────────────
// Tidak menyentuh backend: cari lagu ke Audius saat tombol diklik,
// cache per sesi, hanya satu lagu yang bisa main sekaligus, semua error ditangkap.
import { useState, useEffect, useRef } from 'react';
import Icon from './ui/Icon';

const CACHE = new Map();   // judul|artis -> streamUrl | null
let active = null;         // { audio, reset } — lagu yang sedang main

function stopActive() {
  if (!active) return;
  try { active.audio.pause(); } catch { /* abaikan */ }
  active.reset();
  active = null;
}

// Sumber preview: iTunes dulu, lalu Audius (open source) sebagai cadangan.
// Kalau dua-duanya tidak punya lagunya, preview dinyatakan tidak tersedia.
const APP = '26Menfess';
const HOSTS = ['https://api.audius.co', 'https://discoveryprovider.audius.co'];

const norm = (t) => (t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\(.*?\)|\[.*?\]/g, ' ').replace(/\b(feat|ft|featuring)\b.*$/, ' ').replace(/[^a-z0-9]+/g, ' ').trim();

function pick(tracks, title, artist) {
  const wantT = norm(title), wantA = norm(artist);
  if (!wantT) return null;
  for (const t of tracks || []) {
    const gotT = norm(t.title), gotA = norm(t.user?.name);
    const titleOk = gotT === wantT || gotT.startsWith(`${wantT} `) || gotT.endsWith(` ${wantT}`) || (wantT.length > 5 && gotT.includes(wantT));
    if (!titleOk || t.is_streamable === false) continue;
    // artis harus cocok (nama pengunggah atau ada di judul); tanpa artis → judul harus persis sama
    const artistOk = wantA ? (gotA && (gotA.includes(wantA) || wantA.includes(gotA))) || gotT.includes(wantA) : gotT === wantT;
    if (artistOk) return t;
  }
  return null;
}

async function findItunes(title, artist) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const q = `${title} ${artist || ''}`.trim();
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=5&country=ID`, { signal: ctrl.signal });
    const data = await res.json();
    const wantT = norm(title);
    const hit = (data?.results || []).find(r => r.previewUrl && (norm(r.trackName) === wantT || norm(r.trackName).includes(wantT) || wantT.includes(norm(r.trackName))));
    return hit?.previewUrl || null;
  } catch { return null; }
  finally { clearTimeout(timer); }
}

// Urutan: preview tersimpan (iTunes) → cari di iTunes → Audius (open source) → tidak tersedia
async function findPreview({ title, artist, previewUrl }) {
  if (previewUrl) return previewUrl;
  const key = `${title}|${artist}`;
  if (CACHE.has(key)) return CACHE.get(key);
  const it = await findItunes(title, artist);
  if (it) { CACHE.set(key, it); return it; }
  const q = `${title} ${artist || ''}`.trim();
  for (const host of HOSTS) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 7000);
    try {
      const res = await fetch(`${host}/v1/tracks/search?query=${encodeURIComponent(q)}&limit=8&app_name=${APP}`, { signal: ctrl.signal });
      if (!res.ok) continue;
      const data = await res.json();
      const t = pick(data?.data, title, artist);
      const url = t ? `${host}/v1/tracks/${t.id}/stream?app_name=${APP}` : null;
      CACHE.set(key, url);
      return url;
    } catch { /* coba host berikutnya */ }
    finally { clearTimeout(timer); }
  }
  return null; // gagal jaringan: jangan di-cache supaya bisa dicoba lagi
}

/** @param {{ title: string, artist?: string, labeled?: boolean }} props */
export default function SongPreviewButton({ title, artist, previewUrl, labeled }) {
  const [state, setState] = useState('idle'); // idle | loading | playing | error
  const audioRef = useRef(null);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      if (active && active.audio === audioRef.current) stopActive();
    };
  }, []);

  const safeSet = (s) => { if (aliveRef.current) setState(s); };

  async function toggle() {
    if (state === 'loading') return;
    if (state === 'playing') { stopActive(); return; }
    if (!(title || '').trim()) return;

    stopActive();
    safeSet('loading');
    try {
      const url = await findPreview({ title, artist, previewUrl });
      if (!url) { safeSet('error'); return; }

      const audio = new Audio(url);
      audio.preload = 'auto';
      audioRef.current = audio;
      const reset = () => safeSet('idle');
      audio.addEventListener('ended', () => { if (active?.audio === audio) active = null; reset(); });
      audio.addEventListener('error', () => { if (active?.audio === audio) active = null; safeSet('error'); });

      active = { audio, reset };
      await audio.play();
      safeSet('playing');
    } catch {
      if (active?.audio === audioRef.current) active = null;
      safeSet('error');
    }
  }

  const label =
    state === 'playing' ? 'Jeda lagu'
    : state === 'error' ? 'Lagu ini belum tersedia untuk diputar'
    : 'Putar lagu';
  const icon = state === 'loading' ? <span className="mf-spin" aria-hidden="true" />
    : <Icon name={state === 'playing' ? 'pause2' : state === 'error' ? 'ban' : 'play'} size={18} />;

  if (labeled) {
    return (
      <div className="mf-stack" style={{ gap: 6 }}>
        <button type="button" className="mf-btn mf-btn-secondary mf-btn-block" onClick={toggle} disabled={state === 'loading' || state === 'error'} aria-label={label}>
          {icon}{state === 'loading' ? 'Mencari lagu…' : state === 'error' ? 'Tidak tersedia' : state === 'playing' ? 'Jeda' : 'Putar lagu'}
        </button>
        {state === 'error' && <span className="mf-xs mf-muted" role="status">Lagu ini belum tersedia untuk diputar. Tetap bisa dikirim kok.</span>}
        {state === 'playing' && <span className="mf-xs mf-muted">Preview 30 detik</span>}
      </div>
    );
  }
  return (
    <button type="button" className="mf-btn mf-btn-secondary mf-iconbtn" onClick={toggle}
      disabled={state === 'loading' || state === 'error'} aria-label={label} title={label}>{icon}</button>
  );
}
