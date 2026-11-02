// src/components/SmoothScroll.jsx — Lenis satu RAF, mati di reduced-motion
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { prefersReduced } from '../lib/motion';

export default function SmoothScroll({ children }) {
  const containerRef = useRef(null);
  useEffect(() => {
    if (prefersReduced()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    window.__lenis = lenis;
    // Halaman privat (Makrab) memakai scroll native: Lenis berhenti selama <html> punya kelas mk-route.
    const root = document.documentElement;
    let stoppedByRoute = false;
    const syncRoute = () => {
      const priv = root.classList.contains('mk-route');
      if (priv && !lenis.isStopped) { lenis.stop(); stoppedByRoute = true; }
      else if (!priv && stoppedByRoute) { stoppedByRoute = false; lenis.start(); }
    };
    syncRoute();
    const mo = new MutationObserver(syncRoute);
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    let id;
    const raf = (time) => { lenis.raf(time); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { mo.disconnect(); cancelAnimationFrame(id); lenis.destroy(); delete window.__lenis; };
  }, []);
  return <div ref={containerRef}>{children}</div>;
}
