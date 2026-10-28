// Teks bergulir saat hover (dua salinan ditumpuk). Pakai <Link to> atau <a href>.
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EASE_OUT } from '../lib/motion';

export default function RollLink({ to, href, children, className = '', onClick, style }) {
  const inner = (
    <motion.span initial="rest" whileHover="hover" whileFocus="hover" animate="rest"
      style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', lineHeight: 1.15 }}>
      <motion.span style={{ display: 'block' }} variants={{ rest: { y: 0 }, hover: { y: '-100%' } }} transition={{ duration: 0.5, ease: EASE_OUT }}>{children}</motion.span>
      <motion.span aria-hidden="true" style={{ display: 'block', position: 'absolute', inset: 0 }} variants={{ rest: { y: '100%' }, hover: { y: 0 } }} transition={{ duration: 0.5, ease: EASE_OUT }}>{children}</motion.span>
    </motion.span>
  );
  if (to) return <Link to={to} className={className} onClick={onClick} style={style}>{inner}</Link>;
  return <a href={href} className={className} onClick={onClick} style={style} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noreferrer' : undefined}>{inner}</a>;
}
