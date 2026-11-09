// ─── DesignPicker — 2 kolom desain Pink/Hijau ───────────────────────────────

export default function DesignPicker({ value, onChange, preview = '' }) {
  const designs = [
    { id: 'pink',  label: '🌸 Pink',  bgClass: 'mf-preview-bg-pink'  },
    { id: 'green', label: '🌿 Hijau', bgClass: 'mf-preview-bg-green' },
  ];

  return (
    <div className="mf-design-picker" role="radiogroup" aria-label="Pilih desain kartu">
      {designs.map(d => (
        <button
          key={d.id}
          type="button"
          role="radio"
          aria-checked={value === d.id}
          className={`mf-design-card ${value === d.id ? 'selected' : ''}`}
          onClick={() => onChange(d.id)}
        >
          {/* Mini preview */}
          <div
            className={`mf-preview ${d.bgClass}`}
            style={{ aspectRatio: '4/5', border: 'none', boxShadow: 'none', borderRadius: 0, padding: '8%' }}
          >
            <div className="mf-preview-body" style={{ fontSize: 'clamp(.75rem, 2vw, 1rem)' }}>
              {preview || 'Isi menfessmu akan muncul di sini…'}
            </div>
            <p className="mf-preview-watermark">@secretmenfess.26</p>
          </div>

          {/* Label */}
          <div style={{
            padding: '8px',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '.88rem',
            borderTop: '2px solid var(--mf-ink)',
            background: value === d.id ? 'var(--mf-primary)' : 'white',
          }}>
            {d.label} {value === d.id && '✓'}
          </div>
        </button>
      ))}
    </div>
  );
}
