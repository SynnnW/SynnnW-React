import { motion } from 'framer-motion';
import { thumbOf } from '../lib/bento';
import '../styles/bento.css';

/* <img> yang jatuh ke gambar asli kalau thumbnail belum ada */
export function ThumbImg({ src, thumb, alt = '', className = '' }) {
  return (
    <img
      className={className}
      src={thumb || thumbOf(src)}
      alt={alt}
      loading="lazy"
      draggable={false}
      onError={e => {
        if (!e.currentTarget.dataset.fallback && src) {
          e.currentTarget.dataset.fallback = '1';
          e.currentTarget.src = src;
        }
      }}
    />
  );
}

export function Reveal({ children, className = '', delay = 0, y = 26, ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export const Arrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3.5 10.5l7-7M4.5 3.5h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Kartu kontak berwarna (mirip kartu "Contact me" di Figma) */
export function ContactCard({ title, text, primary, secondary, className = '' }) {
  return (
    <Reveal className={`bn-card bn-contact ${className}`}>
      <div className="bn-contact-orb" aria-hidden="true" />
      <div className="bn-contact-copy">
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="bn-contact-btns">
        {primary}
        {secondary}
      </div>
    </Reveal>
  );
}
