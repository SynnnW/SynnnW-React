// src/components/quiz/useReader.js
// Hook bersama reader materi (MateriMatkul dan reader Bahasa Inggris): pemuat bab tahan-race, posisi baca, preferensi baca.
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FONT_STEPS, getLastRead, getReaderPrefs, setLastRead, setReaderPrefs } from '../../data/quiziz/reading';

/**
 * Memuat modul sebuah bab. Hasil disimpan BERSAMA id-nya dan hanya dianggap siap bila id cocok dengan bab aktif; hasil yang datang
 * terlambat dari bab sebelumnya dibuang (flag `alive` di cleanup). Jadi mustahil menampilkan isi bab A di bawah judul bab B.
 */
export function useBabLoader(entry) {
  const [loaded, setLoaded] = useState({ id: null, data: null, err: false });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!entry) return undefined;
    let alive = true;
    entry.load()
      .then((m) => { if (alive) setLoaded({ id: entry.id, data: m.default, err: false }); })
      .catch(() => { if (alive) setLoaded({ id: entry.id, data: null, err: true }); });
    return () => { alive = false; };
  }, [entry, attempt]);
  const ready = !!entry && loaded.id === entry.id;
  return {
    ready,
    bab: ready && !loaded.err ? loaded.data : null,
    loading: !!entry && !ready,
    error: ready && loaded.err,
    retry: () => { setLoaded({ id: null, data: null, err: false }); setAttempt((a) => a + 1); },
  };
}

/** Preferensi baca (ukuran teks + mode fokus), tersimpan lokal. */
export function useReaderPrefs() {
  const [prefs, setPrefs] = useState(getReaderPrefs);
  const at = FONT_STEPS.indexOf(prefs.font);
  const change = (next) => { setPrefs(next); setReaderPrefs(next); };
  return {
    prefs,
    canSmaller: at > 0,
    canBigger: at < FONT_STEPS.length - 1,
    smaller: () => at > 0 && change({ ...prefs, font: FONT_STEPS[at - 1] }),
    bigger: () => at < FONT_STEPS.length - 1 && change({ ...prefs, font: FONT_STEPS[at + 1] }),
    toggleFocus: () => change({ ...prefs, focus: !prefs.focus }),
  };
}

const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

/**
 * Posisi baca: saat bab siap -> gulir ke #anchor bila ada; bila kedatangan pertama (refresh/Lanjutkan/tautan) pada bab yang sama
 * dengan jejak tersimpan -> pulihkan posisi; selain itu ke atas. Lalu catat bab terakhir dan simpan posisi (di-throttle) saat menggulir.
 */
export function useReadPosition({ slug, mode, babId, ready }) {
  const { hash } = useLocation();
  const [startPos] = useState(() => {
    const last = getLastRead();
    return last && last.slug === slug && last.mode === mode && last.babId === babId ? last.pos : 0;
  });
  const first = useRef(true);

  useEffect(() => {
    if (!ready || !babId) return;
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) target.scrollIntoView({ block: 'start' });
    else if (first.current && startPos > 0.02) window.scrollTo(0, Math.round(startPos * maxScroll()));
    else window.scrollTo(0, 0);
    first.current = false;
    document.getElementById('bim-title')?.focus?.({ preventScroll: true });
  }, [ready, babId, hash, startPos]);

  useEffect(() => {
    if (!ready || !babId) return undefined;
    const prev = getLastRead();
    const same = prev && prev.slug === slug && prev.mode === mode && prev.babId === babId;
    setLastRead({ slug, mode, babId, pos: same ? prev.pos : 0 });
    let timer = null;
    const flush = () => {
      timer = null;
      const max = maxScroll();
      setLastRead({ slug, mode, babId, pos: max > 0 ? window.scrollY / max : 0 });
    };
    const onScroll = () => { if (timer === null) timer = setTimeout(flush, 800); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', flush);
      if (timer !== null) { clearTimeout(timer); flush(); }
    };
  }, [ready, babId, slug, mode]);
}
