// Preloader kurasi: 000→100 + nama studio, lalu dua panel membelah ke atas.
// Sekali per sesi, <= 2.2 dtk, bisa di-skip (klik / tombol), tidak memblokir bila reduced-motion.
import { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { EASE_IN_OUT, prefersReduced } from '../lib/motion';

const KEY = 'synnnw_preloaded';

export default function Preloader() {
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem(KEY) && !prefersReduced() && !window.location.pathname.startsWith('/makrab'); } catch { return false; }
  });
  const [n, setN] = useState(0);
  const [out, setOut] = useState(false);

  const finish = () => { try { sessionStorage.setItem(KEY, '1'); } catch { /* storage tidak tersedia */ } setOut(true); setTimeout(() => setShow(false), 950); };

  useEffect(() => {
    if (!show) return;
    const c = animate(0, 100, { duration: 1.2, ease: 'linear', onUpdate: (v) => setN(Math.round(v)), onComplete: () => setTimeout(finish, 150) });
    const safety = setTimeout(finish, 2200);
    return () => { c.stop(); clearTimeout(safety); };
  }, [show]);

  if (!show) return null;
  const panel = { position: 'fixed', left: 0, width: '100%', height: '50.2%', background: 'var(--bg)', zIndex: 'calc(var(--z-overlay) - 1)' };
  const t = { duration: 0.9, ease: EASE_IN_OUT };
  return (
    <div onClick={finish} role="dialog" aria-modal="true" aria-label="Memuat situs" style={{ position: 'fixed', inset: 0, zIndex: 'calc(var(--z-overlay) - 2)', cursor: 'pointer' }}>
      <motion.div style={{ ...panel, top: 0 }} animate={out ? { y: '-100%' } : { y: 0 }} transition={t} />
      <motion.div style={{ ...panel, bottom: 0 }} animate={out ? { y: '100%' } : { y: 0 }} transition={t} />
      <motion.div animate={{ opacity: out ? 0 : 1 }} transition={{ duration: 0.3 }}
        style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-overlay)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'var(--gutter)', color: 'var(--text)' }}>
        <button type="button" onClick={finish} style={{ alignSelf: 'flex-start', minHeight: 44, padding: 0, background: 'none', border: 0, cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-meta)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)' }}>SynnnW Studio — Lewati ↗</button>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 500, fontSize: 'var(--fs-h1)', letterSpacing: '-0.03em', lineHeight: 0.9 }}>Synnn<span style={{ color: 'var(--accent-text)' }}>W</span></span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-hero)', lineHeight: 0.8, fontVariantNumeric: 'tabular-nums' }}>{String(n).padStart(3, '0')}</span>
        </div>
      </motion.div>
    </div>
  );
}
