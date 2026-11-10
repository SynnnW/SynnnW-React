// ─── SongPreviewButton — putar preview 30 detik lagu (iTunes) ────────────────
// Tidak menyentuh backend: cari preview ke iTunes saat tombol diklik,
// cache per sesi, hanya satu lagu yang bisa main sekaligus, semua error ditangkap.
import { useState, useEffect, useRef } from 'react';
import Icon from './ui/Icon';

const CACHE = new Map();   // query -> previewUrl | null
let active = null;         // { audio, reset } — lagu yang sedang main

function stopActive() {
  if (!active) return;
  try { active.audio.pause(); } catch { /* abaikan */ }
  active.reset();
  active = null;
}

async function findPreview(query) {
  if (CACHE.has(query)) return CACHE.get(query);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=1&country=ID`,
      { signal: ctrl.signal }
    );
    const data = await res.json();
    const url = data?.results?.[0]?.previewUrl || null;
    CACHE.set(query, url);
    return url;
  } finally {
    clearTimeout(timer);
  }
}

/** @param {{ query: string }} props — teks lagu, mis. "Judul — Artis" */
export default function SongPreviewButton({ query, previewUrl }) {
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
    const q = (query || '').trim();
    if (!q && !previewUrl) return;

    stopActive();
    safeSet('loading');
    try {
      // pakai preview tersimpan dulu; kalau tidak ada baru cari ke iTunes
      const url = previewUrl || await findPreview(q);
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
    state === 'playing' ? 'Jeda preview lagu'
    : state === 'error' ? 'Preview tidak tersedia'
    : 'Putar preview lagu';

  return (
    <button
      type="button"
      className="mf-btn mf-btn-secondary mf-iconbtn"
      onClick={toggle}
      disabled={state === 'loading' || state === 'error'}
      aria-label={label}
      title={label}
    >
      {state === 'loading' ? <span className="mf-spin" aria-hidden="true" />
        : <Icon name={state === 'playing' ? 'pause2' : state === 'error' ? 'ban' : 'play'} size={18} />}
    </button>
  );
}
