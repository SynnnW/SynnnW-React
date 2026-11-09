// ─── RulesGate — modal wajib baca aturan ────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { RULES, RULES_VERSION, PROCESS_NOTES } from '@/lib/menfess/rules';
import { getAcceptedRulesVersion, setAcceptedRulesVersion } from './utils';

/** Panggil onAccept kalau user sudah menyetujui aturan versi terbaru. */
export default function RulesGate({ children }) {
  const [needsGate, setNeedsGate] = useState(false);
  const [checked,   setChecked]   = useState(false);
  const checkRef = useRef(null);

  useEffect(() => {
    if (getAcceptedRulesVersion() < RULES_VERSION) setNeedsGate(true);
  }, []);

  function accept() {
    setAcceptedRulesVersion(RULES_VERSION);
    setNeedsGate(false);
  }

  if (!needsGate) return children;

  return (
    <>
      {/* Render children tapi diblur/disabled */}
      <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', opacity: .4 }} aria-hidden="true">
        {children}
      </div>

      <div className="mf-overlay" role="dialog" aria-modal="true" aria-labelledby="rules-title">
        <div className="mf-modal">
          <h2 id="rules-title" style={{ marginBottom: 16 }}>📋 Aturan 26Menfess</h2>
          <p style={{ marginBottom: 12, fontSize: '.9rem' }}>
            Sebelum bisa kirim menfess, kamu perlu membaca dan menyetujui aturan berikut.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {RULES.filter(r => !r.suggested).map(r => (
              <div key={r.id} className="mf-card" style={{ padding: '12px 16px' }}>
                <strong>{r.id}. {r.title}</strong>
                <p style={{ margin: '4px 0 0', fontSize: '.88rem' }}>{r.body}</p>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--mf-soft)', borderRadius: 'var(--mf-radius-sm)', padding: 12, marginBottom: 16, fontSize: '.82rem' }}>
            <strong>Ketentuan proses:</strong>
            <ul style={{ margin: '8px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {PROCESS_NOTES.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          </div>

          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16, cursor: 'pointer' }}>
            <input
              ref={checkRef}
              type="checkbox"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              style={{ marginTop: 3, width: 18, height: 18, flexShrink: 0 }}
            />
            <span style={{ fontSize: '.9rem' }}>
              Aku sudah membaca dan paham aturan di atas, serta bersedia mengikutinya.
            </span>
          </label>

          <button
            className="mf-btn mf-btn-primary"
            onClick={accept}
            disabled={!checked}
            aria-disabled={!checked}
            style={{ width: '100%' }}
          >
            Setuju & Lanjutkan
          </button>
        </div>
      </div>
    </>
  );
}
