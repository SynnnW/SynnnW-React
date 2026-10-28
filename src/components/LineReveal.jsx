// Judul naik dari balik mask, per kata. Pengganti TextReveal char-by-char.
import { motion } from 'framer-motion';
import { EASE_OUT, prefersReduced } from '../lib/motion';

export default function LineReveal({ text, as: Tag = 'h2', className = '', delay = 0, stagger = 0.06, style }) {
  const words = String(text).split(' ');
  const reduced = prefersReduced();
  const MotionTag = motion[Tag] || motion.h2;
  return (
    <MotionTag
      className={className}
      style={style}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: reduced ? 0 : stagger, delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '.08em' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            variants={reduced
              ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
              : { hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.9, ease: EASE_OUT } } }}
          >
            {w}{i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
