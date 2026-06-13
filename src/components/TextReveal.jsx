// src/components/TextReveal.jsx
import { motion } from 'framer-motion';

export default function TextReveal({ 
  text, 
  as: Component = 'div',
  className = '',
  delay = 0,
  wordMode = false, // false = character by character, true = word by word
  staggerDelay = 0.05,
}) {
  const units = wordMode 
    ? text.split(' ').map(word => ({ id: word, text: word + ' ' }))
    : Array.from(text).map((char, i) => ({ id: i, text: char }));

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: wordMode ? 10 : 0 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {units.map(unit => (
        <motion.span
          key={unit.id}
          variants={itemVariants}
          style={{ display: wordMode ? 'inline-block' : 'inline' }}
        >
          {unit.text}
        </motion.span>
      ))}
    </motion.div>
  );
}
