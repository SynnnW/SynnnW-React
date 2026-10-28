import { useCallback, useEffect, useRef, useState } from 'react';

export const STATES = ['idle', 'music', 'pomo', 'water', 'todo', 'shelf'];
const DESIGN_W = 720; // screen width (in design units) the notch sizes are authored for
const TICK_MS = 4000;

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * State + lifecycle for the notch demo.
 * - scale (--u) comes from a ResizeObserver, written straight to the DOM (no re-render)
 * - everything pauses when the demo is off-screen or the tab is hidden
 * - the auto tour stops as soon as the visitor picks a state
 */
export default function useNotchDemo() {
  const rootRef = useRef(null);
  const [state, setState] = useState('idle');
  const [active, setActive] = useState(false);
  const [auto, setAuto] = useState(true);
  const inViewRef = useRef(false);
  const hiddenRef = useRef(typeof document !== 'undefined' && document.hidden);
  const hoverRef = useRef(false);
  const introDone = useRef(false);
  const stateRef = useRef('idle');
  useEffect(() => { stateRef.current = state; }, [state]);

  const sync = useCallback(() => setActive(inViewRef.current && !hiddenRef.current), []);

  // scale from container width
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    let last = 0;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const u = Math.max(0.5, Math.min(w, 960) * 0.94 / DESIGN_W);
      if (Math.abs(u - last) > 0.005) {
        last = u;
        el.style.setProperty('--u', `${u.toFixed(3)}px`);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // visibility: viewport + tab
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => {
      inViewRef.current = e.isIntersecting;
      document.documentElement.classList.toggle('leo-demo-visible', e.isIntersecting);
      sync();
    }, { threshold: 0.25 });
    io.observe(el);
    const onVis = () => { hiddenRef.current = document.hidden; sync(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      document.documentElement.classList.remove('leo-demo-visible');
    };
  }, [sync]);

  // one-time intro: widen, then shrink back to idle
  useEffect(() => {
    if (!active || introDone.current) return undefined;
    introDone.current = true;
    if (prefersReduced()) return undefined;
    const open = setTimeout(() => setState('music'), 0);
    const close = setTimeout(() => { if (stateRef.current === 'music' && !hoverRef.current) setState('idle'); }, 1100);
    return () => { clearTimeout(open); clearTimeout(close); };
  }, [active]);

  // auto tour
  useEffect(() => {
    if (!active || !auto || prefersReduced()) return undefined;
    const id = setInterval(() => {
      if (hoverRef.current) return;
      setState(s => STATES[(STATES.indexOf(s) + 1) % STATES.length]);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [active, auto]);

  const select = useCallback((s) => { setAuto(false); setState(s); }, []);
  const onEnter = useCallback(() => {
    hoverRef.current = true;
    if (stateRef.current === 'idle') setState('music');
  }, []);
  const onLeave = useCallback(() => {
    hoverRef.current = false;
    if (stateRef.current === 'music' && auto === false) return;
    if (stateRef.current === 'music') setState('idle');
  }, [auto]);

  return { rootRef, state, active, select, onEnter, onLeave };
}
