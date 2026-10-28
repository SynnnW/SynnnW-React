// Elemen mengikuti kursor dalam radius ~80px. Nonaktif di touch / reduced-motion.
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { isTouch, prefersReduced } from '../lib/motion';

export default function Magnetic({ children, strength = 0.35, radius = 80 }) {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(useMotionValue(0), { stiffness: 150, damping: 15, mass: 0.1 });
  if (isTouch() || prefersReduced()) return children;

  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const clamp = (v) => Math.max(-radius, Math.min(radius, v));
    x.set(clamp(dx) * strength); y.set(clamp(dy) * strength);
  };
  const leave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={move} onMouseLeave={leave} style={{ x, y, display: 'inline-block' }}>
      {children}
    </motion.div>
  );
}
