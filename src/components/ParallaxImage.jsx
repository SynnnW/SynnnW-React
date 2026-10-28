// src/components/ParallaxImage.jsx — parallax halus ±8%, scale 1.1 tetap
import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import { prefersReduced } from '../lib/motion';

export default function ParallaxImage({ src, alt = '', className = '', width, height }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden' }}>
      <motion.img src={src} alt={alt} width={width} height={height} loading="lazy"
        style={{ y: prefersReduced() ? 0 : y, scale: 1.1, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
}
