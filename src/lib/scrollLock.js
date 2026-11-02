// Scroll lock bersama untuk overlay blocking (sheet/modal).
// - Reference count: lock baru dilepas setelah overlay terakhir selesai.
// - Menyimpan style inline awal + posisi scroll, memulihkannya tanpa loncat.
// - Memakai body position:fixed supaya iOS Safari juga benar-benar terkunci (overflow:hidden saja tidak cukup).
// - Lenis dihentikan hanya bila sedang jalan, dan hanya dijalankan lagi bila kita yang menghentikannya.

let count = 0;
let saved = null;

const KEYS = ['position', 'top', 'left', 'right', 'width', 'overflow', 'paddingRight'];

function engage() {
  const html = document.documentElement;
  const body = document.body;
  const lenis = window.__lenis;
  let stoppedLenis = false;
  if (lenis && !lenis.isStopped) { try { lenis.stop(); stoppedLenis = true; } catch { /* abaikan */ } }
  const scrollY = window.scrollY || html.scrollTop || 0;
  const gap = Math.max(0, window.innerWidth - html.clientWidth); // lebar scrollbar (desktop)
  saved = {
    scrollY,
    stoppedLenis,
    body: Object.fromEntries(KEYS.map((k) => [k, body.style[k]])),
    htmlBehavior: html.style.scrollBehavior,
  };
  html.style.scrollBehavior = 'auto';
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
  body.style.overflow = 'hidden';
  if (gap) body.style.paddingRight = `${gap}px`;
}

function release() {
  if (!saved) return;
  const html = document.documentElement;
  const body = document.body;
  const { scrollY, stoppedLenis, body: prev, htmlBehavior } = saved;
  saved = null;
  KEYS.forEach((k) => { body.style[k] = prev[k]; });
  html.style.scrollBehavior = 'auto'; // paksa loncat instan, bukan animasi smooth
  window.scrollTo(0, scrollY);
  html.style.scrollBehavior = htmlBehavior;
  if (stoppedLenis) {
    try { window.__lenis?.start(); } catch { /* abaikan */ }
  }
}

/** Ambil lock. Mengembalikan fungsi unlock yang aman dipanggil berkali-kali. */
export function lockScroll() {
  if (typeof document === 'undefined') return () => {};
  if (count === 0) engage();
  count += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    count = Math.max(0, count - 1);
    if (count === 0) release();
  };
}

export const isScrollLocked = () => count > 0;
