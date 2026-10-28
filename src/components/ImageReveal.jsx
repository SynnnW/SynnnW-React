// Gambar terbuka lewat clip-path, isi zoom 1.25 -> 1.
import { motion } from 'framer-motion';
import { EASE_IN_OUT, prefersReduced } from '../lib/motion';

export default function ImageReveal({ src, alt = '', className = '', width, height, priority = false, style }) {
  const reduced = prefersReduced();
  return (
    <motion.div
      className={className}
      style={{ overflow: 'hidden', ...style }}
      initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
      whileInView={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0.3 : 1.2, ease: EASE_IN_OUT }}
    >
      <motion.img
        src={src} alt={alt} width={width} height={height}
        loading={priority ? 'eager' : 'lazy'} fetchpriority={priority ? 'high' : undefined}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        initial={reduced ? false : { scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: EASE_IN_OUT }}
      />
    </motion.div>
  );
}
