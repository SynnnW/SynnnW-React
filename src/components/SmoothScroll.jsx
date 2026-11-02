// src/components/SmoothScroll.jsx — Lenis satu RAF, mati di reduced-motion.
// Halaman privat (Makrab, <html class="mk-route">) memakai scroll native: Lenis DIHANCURKAN di sana.
// (lenis.stop() tidak cocok: saat stopped Lenis memanggil preventDefault pada wheel/touch sehingga halaman tidak bisa di-scroll.)
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { prefersReduced } from '../lib/motion';

export default function SmoothScroll({ children }) {
  const containerRef = useRef(null);
  useEffect(() => {
    if (prefersReduced()) return undefined;
    const root = document.documentElement;
    let lenis = null;
    let id = 0;
    const raf = (time) => { lenis?.raf(time); id = requestAnimationFrame(raf); };
    const create = () => {
      if (lenis) return;
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      window.__lenis = lenis;
      id = requestAnimationFrame(raf);
    };
    const destroy = () => {
      if (!lenis) return;
      cancelAnimationFrame(id);
      lenis.destroy();
      lenis = null;
      delete window.__lenis;
    };
    const sync = () => (root.classList.contains('mk-route') ? destroy() : create());
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => { mo.disconnect(); destroy(); };
  }, []);
  return <div ref={containerRef}>{children}</div>;
}
