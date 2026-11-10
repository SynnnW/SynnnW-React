import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import { Button } from './index';
import { lockScroll } from '@/lib/scrollLock';

const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

/** Bottom sheet (HP) / dialog (desktop). Focus-trap, Esc, scroll-lock, aria-modal. */
export function Sheet({ open, onClose, title, children, footer, labelledBy }) {
  const ref = useRef(null);
  const lastFocus = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; });

  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    const unlock = lockScroll();
    const node = ref.current;
    const first = node?.querySelector(FOCUSABLE);
    (first || node)?.focus?.();
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); closeRef.current?.(); return; }
      if (e.key !== 'Tab' || !node) return;
      const els = [...node.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
      if (!els.length) return;
      const a = els[0], z = els[els.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      unlock();
      try { lastFocus.current?.focus?.(); } catch { /* abaikan */ }
    };
  }, [open]);

  if (!open) return null;
  const tid = labelledBy || 'mf-sheet-title';
  return createPortal(
    <div className="mf mf-overlay" data-mf-theme={document.querySelector('.mf[data-mf-theme]')?.dataset.mfTheme || 'pink'}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="mf-sheet mf-allow" role="dialog" aria-modal="true" aria-labelledby={tid} ref={ref} tabIndex={-1}>
        <div className="mf-sheet-head">
          <h2 id={tid}>{title}</h2>
          <button type="button" className="mf-btn mf-btn-ghost mf-iconbtn" onClick={onClose} aria-label="Tutup"><Icon name="close" /></button>
        </div>
        {children}
        {footer && <div className="mf-sheet-foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export function ConfirmDialog({ open, title, children, confirmLabel = 'Ya', cancelLabel = 'Batal', danger, loading, onConfirm, onCancel, extra }) {
  return (
    <Sheet open={open} onClose={onCancel} title={title}
      footer={<>
        <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
        <Button variant={danger ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
      </>}>
      <div className="mf-stack">{children}{extra}</div>
    </Sheet>
  );
}
