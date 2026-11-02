// Sheet/dialog blocking untuk Makrab. Satu komponen untuk semua overlay:
// scroll lock bersama (ref-count), Esc hanya untuk overlay paling atas, focus trap + restore,
// background inert, drag-close hanya dari grip, exit animation sebelum lock dilepas.
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useScrollLock } from '@/lib/useScrollLock';

const stack = []; // overlay aktif, yang paling atas di ujung
const EXIT_MS = 180;
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Props:
 * - onClose: dipanggil setelah exit animation selesai.
 * - dirty: true bila ada isian yang belum disimpan. Backdrop & drag tidak menutup; X/Esc minta konfirmasi.
 * - discardMessage: teks konfirmasi saat dirty.
 */
export default function MkSheet({ title, onClose, actions, children, dirty = false, discardMessage = 'Buang isian yang belum disimpan?' }) {
  const [closing, setClosing] = useState(false);
  const overlayRef = useRef(null);
  const sheetRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const dirtyRef = useRef({ dirty, discardMessage });
  const closingRef = useRef(false);
  const titleId = useId();

  useEffect(() => { onCloseRef.current = onClose; dirtyRef.current = { dirty, discardMessage }; });
  // Lock dipegang selama komponen terpasang (termasuk saat exit animation), bukan per-render.
  useScrollLock(true);

  const finish = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (reduced()) { onCloseRef.current(); return; }
    setClosing(true);
    setTimeout(() => onCloseRef.current(), EXIT_MS);
  }, []);

  // source: 'button' | 'esc' | 'backdrop' | 'drag'
  const requestClose = useCallback((source) => {
    const { dirty: isDirty, discardMessage: msg } = dirtyRef.current;
    if (isDirty) {
      if (source === 'backdrop' || source === 'drag') return false;
      if (!window.confirm(msg)) return false;
    }
    finish();
    return true;
  }, [finish]);

  // Stack + Esc (hanya yang paling atas) + inert + focus
  useEffect(() => {
    const entry = { id: Symbol('mk-sheet'), close: () => requestClose('esc') };
    stack.push(entry);
    const overlay = overlayRef.current;
    const opener = document.activeElement;

    const inerted = [];
    // Semua yang bukan leluhur overlay (di dalam .mk) dijadikan inert: sidebar, header, nav bawah, halaman, overlay di bawahnya.
    for (let node = overlay; node && node.parentElement && !node.parentElement.classList.contains('mk'); node = node.parentElement) {
      Array.from(node.parentElement.children).forEach((el) => {
        if (el === node || el.classList.contains('mk-toasts') || el.tagName === 'STYLE' || el.inert) return;
        el.inert = true; inerted.push(el);
      });
    }

    const first = sheetRef.current.querySelector('.mk-sheet-body input, .mk-sheet-body select, .mk-sheet-body textarea');
    (first && window.matchMedia('(hover: hover)').matches ? first : sheetRef.current).focus({ preventScroll: true });

    const onKey = (e) => {
      if (stack[stack.length - 1] !== entry) return;
      if (e.key === 'Escape') { e.preventDefault(); entry.close(); return; }
      if (e.key !== 'Tab') return;
      const items = Array.from(sheetRef.current.querySelectorAll(FOCUSABLE)).filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (!items.length) { e.preventDefault(); sheetRef.current.focus(); return; }
      const a = document.activeElement;
      if (e.shiftKey && (a === items[0] || a === sheetRef.current)) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && a === items[items.length - 1]) { e.preventDefault(); items[0].focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      const i = stack.indexOf(entry);
      if (i >= 0) stack.splice(i, 1);
      inerted.forEach((el) => { el.inert = false; });
      if (opener && opener.isConnected && typeof opener.focus === 'function') {
        try { opener.focus({ preventScroll: true }); } catch { /* abaikan */ }
      }
    };
  }, [requestClose]);

  /* Drag-close: hanya dari grip. Scroll isi sheet tidak pernah menjadi gesture dismiss. */
  const drag = useRef(null);
  const onGripDown = (e) => {
    if (reduced()) return;
    drag.current = { id: e.pointerId, y0: e.clientY, t0: e.timeStamp, dy: 0 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    sheetRef.current.style.transition = 'none';
  };
  const onGripMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    d.dy = Math.max(0, e.clientY - d.y0);
    sheetRef.current.style.transform = `translateY(${d.dy}px)`;
  };
  const onGripUp = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const v = d.dy / Math.max(1, e.timeStamp - d.t0); // px/ms
    const el = sheetRef.current;
    el.style.transition = '';
    if (d.dy > 100 || v > 0.6) {
      if (requestClose('drag')) return;
    }
    el.style.transform = '';
  };

  return (
    <div
      ref={overlayRef}
      className={`mk-overlay${closing ? ' is-closing' : ''}`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) requestClose('backdrop'); }}
    >
      <div ref={sheetRef} className="mk-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div className="mk-grip-area" onPointerDown={onGripDown} onPointerMove={onGripMove} onPointerUp={onGripUp} onPointerCancel={onGripUp}>
          <div className="mk-grip" aria-hidden="true" />
        </div>
        <div className="mk-sheet-h">
          <h2 id={titleId}>{title}</h2>
          {actions}
          <button type="button" className="mk-icon-btn" onClick={() => requestClose('button')} aria-label="Tutup">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
        <div className="mk-sheet-body" data-lenis-prevent>{children}</div>
      </div>
    </div>
  );
}
