import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { prefersReduced } from '@/lib/motion';
import { rp } from './format';

/** Angka rupiah yang menghitung (tween 400ms) tiap nilai berubah. */
export default function AnimatedNumber({ value, className }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => rp(v));
  useEffect(() => {
    if (prefersReduced()) { mv.set(value); return undefined; }
    const c = animate(mv, value, { duration: 0.4, ease: 'easeOut' });
    return () => c.stop();
  }, [value, mv]);
  return <motion.span className={className}>{text}</motion.span>;
}
