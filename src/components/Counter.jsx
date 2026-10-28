// Angka naik saat masuk viewport, tabular-nums, 1.4s ease-out.
import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';
import { EASE_OUT, prefersReduced } from '../lib/motion';

export default function Counter({ to = 0, suffix = '', className = '', style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = prefersReduced() ? 0 : 1.4;
    const c = animate(0, to, { duration: dur, ease: EASE_OUT, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{n}{suffix}</span>;
}
