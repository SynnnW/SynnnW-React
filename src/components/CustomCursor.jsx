// src/components/CustomCursor.jsx — titik 10px mix-blend difference.
// Hover link/tombol: 56px. [data-cursor="view"] -> "VIEW", [data-cursor="drag"] -> "DRAG".
import { useEffect, useRef, useState } from 'react';
import { prefersReduced } from '../lib/motion';

export default function CustomCursor() {
  const ref = useRef(null);
  const [state, setState] = useState({ big: false, label: '' });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || prefersReduced() || window.innerWidth < 768) return;
    document.documentElement.classList.add('has-cursor');
    let tx = 0, ty = 0, x = 0, y = 0, id;
    const move = (e) => { tx = e.clientX; ty = e.clientY; };
    const over = (e) => {
      const lab = e.target.closest?.('[data-cursor]');
      const link = e.target.closest?.('a,button,[role="button"],input,textarea,select,label');
      if (lab) setState({ big: true, label: lab.dataset.cursor.toUpperCase() });
      else setState({ big: !!link, label: '' });
    };
    const loop = () => {
      x += (tx - x) * 0.25; y += (ty - y) * 0.25;
      if (ref.current) ref.current.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      id = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    id = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      cancelAnimationFrame(id);
    };
  }, []);

  const size = state.label ? 72 : state.big ? 56 : 10;
  return (
    <div ref={ref} aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, zIndex: 99999, pointerEvents: 'none', display: 'none' }} className="cc-wrap">
      <div style={{ width: size, height: size, borderRadius: '50%', background: '#fff', mixBlendMode: 'difference', transition: 'width .3s, height .3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {state.label && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#000', letterSpacing: '0.08em' }}>{state.label}</span>}
      </div>
    </div>
  );
}
