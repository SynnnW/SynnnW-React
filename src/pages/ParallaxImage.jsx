// src/components/ParallaxImage.jsx
import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export default function ParallaxImage({ 
  src, 
  alt = '',
  className = '',
  speed = 0.5, // 0-1, higher = more parallax
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);

  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden' }}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 90 }}
      />
    </div>
  );
}
