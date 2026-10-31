// Adds `.visible` to `.reveal` elements once they enter the viewport.
// Uses getBoundingClientRect (a scroll check) instead of IntersectionObserver, because the
// .reveal hidden state is `clip-path: inset(0 0 100% 0)`, which can make an observer report a
// zero-area target and never fire, leaving the content permanently hidden.
export function revealOnScroll(getEls, bottomOffset = 30) {
  let raf = 0;
  const run = () => {
    raf = 0;
    const vh = window.innerHeight;
    getEls().forEach((el) => {
      if (!el || !el.isConnected || el.classList.contains('visible')) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh - bottomOffset && r.bottom > 0) el.classList.add('visible');
    });
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(run); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  const timers = [setTimeout(run, 60), setTimeout(run, 500), setTimeout(run, 1500)]; // late layout (images, fonts)
  return () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    timers.forEach(clearTimeout);
    if (raf) cancelAnimationFrame(raf);
  };
}
