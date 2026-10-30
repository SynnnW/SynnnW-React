import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { EASE_OUT, prefersReduced } from '@/lib/motion';

/** Bottom sheet: tarik ke bawah / tap backdrop / Esc untuk menutup. */
export function Sheet({ host, open, onClose, title, children, label }) {
  // Portal ke dalam .dash supaya token --d-* ikut.
  const root = host ? host.closest('.dash') || host : null;
  const controls = useDragControls();
  const reduced = prefersReduced();
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!root) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="pk-layer" key="layer">
          <motion.div className="pk-backdrop" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} />
          <motion.div className="pk-sheet" role="dialog" aria-modal="true" aria-label={label || title}
            initial={reduced ? { opacity: 0 } : { y: '100%' }} animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: '100%' }} transition={{ duration: reduced ? 0.15 : 0.32, ease: EASE_OUT }}
            drag={reduced ? false : 'y'} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
            dragListener={false} dragControls={controls}
            onDragEnd={(_, i) => { if (i.offset.y > 100 || i.velocity.y > 600) onClose(); }}
          >
            <SheetGrip onClose={onClose} controls={controls} />
            {title && <h3 className="pk-sheet-title">{title}</h3>}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    root,
  );
}

// Grip = satu-satunya area tarik (supaya scroll isi sheet tidak bentrok).
function SheetGrip({ onClose, controls }) {
  return (
    <div className="pk-grip" onPointerDown={(e) => controls.start(e)}>
      <button type="button" className="pk-grip-btn" aria-label="Tutup" onClick={onClose}><span /></button>
    </div>
  );
}

/** Toast bawah dengan aksi opsional (Undo). */
export function Toasts({ items, onDismiss }) {
  return (
    <div className="pk-toasts" role="status" aria-live="polite">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div key={t.id} className={`pk-toast ${t.kind || ''}`} layout
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: EASE_OUT }}>
            <span>{t.msg}</span>
            {t.action && <button type="button" onClick={() => { t.action.run(); onDismiss(t.id); }}>{t.action.label}</button>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
