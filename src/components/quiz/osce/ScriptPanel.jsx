// src/components/quiz/osce/ScriptPanel.jsx
// Catatan: komponen ini TIDAK mengatur sendiri kapan dibuka/ditutup — induknya
// (CaseSession) hanya me-render <ScriptPanel key={phase.key} .../> saat sedang
// terbuka, supaya setiap pembukaan fase baru otomatis dapat state segar tanpa
// butuh effect reset terpisah.
import { useEffect, useRef, useState } from 'react';

function FOCUSABLE_SEL() {
  return 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
}

export default function ScriptPanel({ onClose, phase, mode, myRole, lawanLabel, alreadyCounted, onFirstReveal }) {
  const [revealed, setRevealed] = useState(false);
  const [cursor, setCursor] = useState(1); // dipakai mode per-baris (solo)
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => closeBtnRef.current?.focus());
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll(FOCUSABLE_SEL())).filter((n) => !n.disabled);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sengaja hanya sekali per mount (reset difasilitasi lewat key={phase.key} di induk)
  }, []);

  const script = phase?.script || [];
  const roleLabel = { perawat: 'Perawat', lawan: lawanLabel || 'Lawan bicara' };

  const reveal = () => {
    setRevealed(true);
    if (!alreadyCounted) onFirstReveal?.();
  };

  const visible = mode === 'solo' ? script.slice(0, cursor) : script;
  const canAdvance = mode === 'solo' && cursor < script.length;

  return (
    <div className="osce-script-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        className="osce-script-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Bantuan skrip — ${phase?.title || ''}`}
        ref={panelRef}
      >
        <div className="osce-script-head">
          <b><i className="fa-solid fa-life-ring" aria-hidden="true" /> Bantuan skrip — {phase?.title}</b>
          <button type="button" ref={closeBtnRef} className="osce-script-close" onClick={onClose} aria-label="Tutup panel bantuan">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        {script.length === 0 ? (
          <p className="osce-mode-desc">Belum ada skrip untuk fase ini.</p>
        ) : !revealed ? (
          <div className="osce-script-blur-gate">
            <p className="osce-mode-desc">Contoh skrip percakapan akan ditampilkan. Pemakaian bantuan ini dihitung.</p>
            <button type="button" className="qz-btn qz-btn-primary" onClick={reveal}>Tampilkan</button>
          </div>
        ) : (
          <>
            <ul className="osce-script-lines" role="list">
              {visible.map((line, i) => (
                <li
                  key={i}
                  className={`osce-script-line osce-script-line--${line.role}${mode === 'multi' && line.role !== myRole ? ' is-dim' : ''}`}
                >
                  <span className="osce-script-line-role">{roleLabel[line.role]}</span>
                  <span className="osce-script-line-text">{line.text}</span>
                  {line.technique && <span className="osce-script-line-technique">{line.technique}</span>}
                </li>
              ))}
            </ul>
            {mode === 'solo' && (
              <div className="osce-script-actions">
                <button type="button" className="qz-btn qz-btn-primary" disabled={!canAdvance} onClick={() => setCursor((c) => c + 1)}>
                  Lanjut
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
