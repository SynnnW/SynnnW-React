import { useEffect } from 'react';
import { lockScroll } from './scrollLock';

/** Kunci scroll halaman selama `active` true. Tidak bergantung pada identitas callback apa pun. */
export function useScrollLock(active = true) {
  useEffect(() => {
    if (!active) return undefined;
    return lockScroll();
  }, [active]);
}
