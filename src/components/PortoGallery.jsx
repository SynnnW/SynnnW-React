import { useRef, useState, useEffect, useCallback } from 'react';
import { Reveal } from './BentoKit';
import { lockScroll } from '../lib/scrollLock';

const TOTAL = 11;
const pad = n => String(n).padStart(2, '0');
const SLIDES = Array.from({ length: TOTAL }, (_, i) => `/assets/porto/porto-${pad(i + 1)}.webp`);
const HD = i => `/assets/porto/hd/synnnw-portofolio-${pad(i + 1)}.png`;

/* Galeri geser — scroll-snap native (swipe di HP, drag/roda di desktop), tanpa library tambahan */
export default function PortoGallery({ isID }) {
  const L = (en, id) => (isID ? id : en);
  const rail = useRef(null);
  const [idx, setIdx] = useState(0);
  const drag = useRef({ on: false, x: 0, left: 0, moved: false });
  const [open, setOpen] = useState(null);

  /* Lightbox: kunci scroll (body fixed + Lenis stop) selama terbuka */
  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return undefined;
    const unlock = lockScroll();
    return unlock;
  }, [isOpen]);

  /* Lightbox: Esc / panah */
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = e => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen(o => (o === null ? o : Math.min(TOTAL - 1, o + 1)));
      if (e.key === 'ArrowLeft') setOpen(o => (o === null ? o : Math.max(0, o - 1)));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const pick = i => {
    if (drag.current.moved) { drag.current.moved = false; return; }
    setOpen(i);
  };

  const go = useCallback(i => {
    const el = rail.current;
    if (!el) return;
    const n = Math.max(0, Math.min(TOTAL - 1, i));
    const kid = el.children[n];
    if (kid) el.scrollTo({ left: kid.offsetLeft - el.offsetLeft - (el.clientWidth - kid.clientWidth) / 2, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const c = el.scrollLeft + el.clientWidth / 2;
        let best = 0, d = Infinity;
        [...el.children].forEach((k, i) => {
          const dist = Math.abs(k.offsetLeft - el.offsetLeft + k.clientWidth / 2 - c);
          if (dist < d) { d = dist; best = i; }
        });
        setIdx(best);
      });
    };
    el.addEventListener('scroll', on, { passive: true });
    return () => { el.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);

  const down = e => {
    if (e.pointerType !== 'mouse') return;
    const el = rail.current;
    drag.current = { on: true, x: e.clientX, left: el.scrollLeft, moved: false };
    el.classList.add('is-drag');
  };
  const move = e => {
    const d = drag.current;
    if (!d.on) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    rail.current.scrollLeft = d.left - dx;
  };
  const up = () => { drag.current.on = false; rail.current?.classList.remove('is-drag'); };
  const key = e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
  };

  return (
    <Reveal className="bn-gal">
      <div
        className="bn-gal-rail" ref={rail} tabIndex={0} onKeyDown={key}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
        role="region" aria-roledescription="carousel" aria-label={L('Portfolio gallery', 'Galeri portofolio')}
      >
        {SLIDES.map((src, i) => (
          <figure className="bn-gal-slide" key={src} aria-label={`${i + 1} / ${TOTAL}`}>
            <button type="button" className="bn-gal-open" onClick={() => pick(i)} aria-label={L(`Open slide ${i + 1}`, `Buka slide ${i + 1}`)} />
            <img
              src={src} alt={L(`Portfolio slide ${i + 1}`, `Slide portofolio ${i + 1}`)}
              width="1600" height="900" draggable={false}
              loading={i < 2 ? 'eager' : 'lazy'} decoding="async"
              onContextMenu={e => e.preventDefault()}
            />
          </figure>
        ))}
      </div>

      <div className="bn-gal-bar">
        <span className="bn-gal-count"><b>{String(idx + 1).padStart(2, '0')}</b> / {String(TOTAL).padStart(2, '0')}</span>
        <div className="bn-gal-dots" aria-hidden="true">
          {SLIDES.map((s, i) => (
            <button key={s} type="button" tabIndex={-1} className={i === idx ? 'on' : ''} onClick={() => go(i)} />
          ))}
        </div>
        <div className="bn-gal-nav">
          <button type="button" onClick={() => go(idx - 1)} disabled={idx === 0} aria-label={L('Previous', 'Sebelumnya')}><i className="fa-solid fa-arrow-left" /></button>
          <button type="button" onClick={() => go(idx + 1)} disabled={idx === TOTAL - 1} aria-label={L('Next', 'Berikutnya')}><i className="fa-solid fa-arrow-right" /></button>
        </div>
      </div>

      {open !== null && (
        <div className="bn-modal bn-gal-modal" onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={L('Portfolio slide', 'Slide portofolio')}>
          <div className="bn-modal-box bn-gal-box" onClick={e => e.stopPropagation()}>
            <button className="bn-modal-x" onClick={() => setOpen(null)} aria-label={L('Close', 'Tutup')}><i className="fa-solid fa-xmark" /></button>
            <img src={SLIDES[open]} alt={L(`Portfolio slide ${open + 1}`, `Slide portofolio ${open + 1}`)} draggable={false} onContextMenu={e => e.preventDefault()} />
            <div className="bn-gal-modal-bar">
              <button type="button" className="bn-gal-arrow" onClick={() => setOpen(open - 1)} disabled={open === 0} aria-label={L('Previous', 'Sebelumnya')}><i className="fa-solid fa-arrow-left" /></button>
              <a className="bn-btn bn-btn--solid" href={HD(open)} download={`synnnw-portofolio-${pad(open + 1)}-HD.png`}>
                <i className="fa-solid fa-download" /> {L('Download HD (PNG)', 'Unduh HD (PNG)')}
              </a>
              <button type="button" className="bn-gal-arrow" onClick={() => setOpen(open + 1)} disabled={open === TOTAL - 1} aria-label={L('Next', 'Berikutnya')}><i className="fa-solid fa-arrow-right" /></button>
            </div>
            <p>{pad(open + 1)} / {pad(TOTAL)} · 1920×1080</p>
          </div>
        </div>
      )}
    </Reveal>
  );
}
