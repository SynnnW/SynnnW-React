// Preloader kurasi: 000→100 + nama studio, lalu dua panel membelah ke atas.
// Sekali per sesi, <= 2.2 dtk, bisa di-skip (klik / tombol), tidak memblokir bila reduced-motion.
import { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { EASE_IN_OUT, prefersReduced } from '../lib/motion';

const KEY = 'synnnw_preloaded';

export default function Preloader() {
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem(KEY) && !prefersReduced(); } catch { return false; }
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
  const panel = { position: 'fixed', left: 0, width: '100%', height: '50.2%', background: 'var(--bg)', zIndex: 9998 };
  const t = { duration: 0.9, ease: EASE_IN_OUT };
  return (
    <div onClick={finish} role="presentation" style={{ position: 'fixed', inset: 0, zIndex: 9997, cursor: 'pointer' }}>
      <motion.div style={{ ...panel, top: 0 }} animate={out ? { y: '-100%' } : { y: 0 }} transition={t} />
      <motion.div style={{ ...panel, bottom: 0 }} animate={out ? { y: '100%' } : { y: 0 }} transition={t} />
      <motion.div animate={{ opacity: out ? 0 : 1 }} transition={{ duration: 0.3 }}
        style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'var(--gutter)', color: 'var(--text)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-meta)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>SynnnW Studio — Klik untuk lewati</span>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-h2)', letterSpacing: '-0.04em' }}>SYNNNW</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-hero)', lineHeight: 0.8, fontVariantNumeric: 'tabular-nums' }}>{String(n).padStart(3, '0')}</span>
        </div>
      </motion.div>
    </div>
  );
}
