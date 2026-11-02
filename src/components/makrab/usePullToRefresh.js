// Pull-to-refresh ringan untuk scroll dokumen. Listener pasif (tidak pernah preventDefault),
// jadi scroll native tidak terganggu. Hanya aktif di posisi paling atas dan tanpa overlay.
import { useEffect, useRef, useState } from 'react';
import { isScrollLocked } from '@/lib/scrollLock';

export const THRESHOLD = 72;
const MAX = 112;

export function usePullToRefresh(onRefresh, disabled) {
  const [view, setView] = useState({ pull: 0, phase: 'idle' });
  const cb = useRef({ onRefresh, disabled });
  useEffect(() => { cb.current = { onRefresh, disabled }; });

  useEffect(() => {
    const st = { active: false, busy: false, dir: null, x0: 0, y0: 0, pull: 0, timer: 0 };
    const reset = () => { st.active = false; st.pull = 0; setView({ pull: 0, phase: 'idle' }); };
    const start = (e) => {
      if (cb.current.disabled || st.busy || isScrollLocked() || window.scrollY > 0 || e.touches.length !== 1) return;
      if (e.target.closest?.('input,textarea,select,[data-no-ptr],.mk-deck,.mk-overlay')) return;
      st.active = true; st.dir = null; st.x0 = e.touches[0].clientX; st.y0 = e.touches[0].clientY;
    };
    const move = (e) => {
      if (!st.active) return;
      const t = e.touches[0]; const dy = t.clientY - st.y0; const dx = t.clientX - st.x0;
      if (!st.dir) {
        if (Math.abs(dy) < 8 && Math.abs(dx) < 8) return;
        st.dir = Math.abs(dy) > Math.abs(dx) && dy > 0 ? 'v' : 'x';
      }
      if (st.dir !== 'v' || window.scrollY > 0 || isScrollLocked()) { reset(); return; }
      st.pull = Math.min(MAX, dy * 0.6);
      setView({ pull: st.pull, phase: st.pull >= THRESHOLD ? 'ready' : 'pulling' });
    };
    const end = async () => {
      if (!st.active) return;
      st.active = false;
      if (st.pull < THRESHOLD) { reset(); return; }
      st.busy = true; setView({ pull: 56, phase: 'loading' });
      const ok = await Promise.resolve(cb.current.onRefresh()).catch(() => false);
      st.busy = false;
      if (ok) { setView({ pull: 56, phase: 'done' }); st.timer = setTimeout(reset, 900); } else reset();
    };
    window.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('touchend', end, { passive: true });
    window.addEventListener('touchcancel', reset, { passive: true });
    return () => {
      clearTimeout(st.timer);
      window.removeEventListener('touchstart', start); window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end); window.removeEventListener('touchcancel', reset);
    };
  }, []);
  return view;
}

