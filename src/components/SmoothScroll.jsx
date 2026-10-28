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
    let id;
    const raf = (time) => { lenis.raf(time); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); delete window.__lenis; };
  }, []);
  return <div ref={containerRef}>{children}</div>;
}
