export const EASE_OUT = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT = [0.76, 0, 0.24, 1];
export const DUR = { fast: 0.35, base: 0.7, slow: 1.1 };
export const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
