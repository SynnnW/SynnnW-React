// Marquee teks raksasa yang ikut kecepatan scroll (dan membalik arah).
import { useRef } from 'react';
import { motion, useScroll, useVelocity, useSpring, useTransform, useMotionValue, useAnimationFrame } from 'framer-motion';
import { prefersReduced } from '../lib/motion';

const DEFAULT = 'SYNNNW STUDIO — WEB — VIDEO — ILUSTRASI — FOTO — ';

export default function Marquee({ text = DEFAULT, baseSpeed = 4, className = '' }) {
  const x = useMotionValue(0);
  const dir = useRef(1);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const reduced = prefersReduced();
  const wrapped = useTransform(x, (v) => `${(((v % 25) - 25) % 25)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const b = boost.get();
    if (b < 0) dir.current = -1; else if (b > 0) dir.current = 1;
    x.set(x.get() + dir.current * (baseSpeed + Math.abs(b)) * (delta / 1000));
  });

  const chunk = <span style={{ paddingRight: '0.4em' }}>{text}</span>;
  return (
    <div className={className} aria-hidden="true" style={{ overflow: 'hidden', whiteSpace: 'nowrap', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.2rem 0' }}>
      <motion.div style={{ x: wrapped, display: 'inline-block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-h1)', letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 1 }}>
        {chunk}{chunk}{chunk}{chunk}
      </motion.div>
    </div>
  );
}
