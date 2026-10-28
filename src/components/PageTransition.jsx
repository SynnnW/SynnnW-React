// src/components/PageTransition.jsx — wipe panel dari bawah, lalu konten masuk
import { motion } from 'framer-motion';
import { EASE_IN_OUT, prefersReduced } from '../lib/motion';

export default function PageTransition({ children }) {
  const reduced = prefersReduced();
  if (reduced) {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ width: '100%' }}>{children}</motion.div>;
  }
  return (
    <motion.div style={{ width: '100%' }} exit={{ opacity: 1, transition: { duration: 0.6 } }}
      onAnimationStart={() => { window.__lenis?.scrollTo(0, { immediate: true }); }}>
      {children}
      <motion.div aria-hidden="true"
        style={{ position: 'fixed', inset: 0, background: 'var(--bg2)', zIndex: 9990, pointerEvents: 'none', originY: 0 }}
        initial={{ scaleY: 1 }} animate={{ scaleY: 0, transition: { duration: 0.6, ease: EASE_IN_OUT } }}
        exit={{ scaleY: 1, originY: 1, transition: { duration: 0.6, ease: EASE_IN_OUT } }} />
    </motion.div>
  );
}
