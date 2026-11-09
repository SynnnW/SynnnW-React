// ─── StatusBadge — ikon + teks, bukan hanya warna ───────────────────────────

const STATUS_MAP = {
  pending:   { icon: '⏳', label: 'Menunggu',       cls: 'mf-badge-pending'  },
  hold:      { icon: '⏸️',  label: 'Ditahan',        cls: 'mf-badge-hold'     },
  approved:  { icon: '✅', label: 'Siap tayang',    cls: 'mf-badge-approved' },
  posted:    { icon: '📸', label: 'Sudah diposting', cls: 'mf-badge-posted'  },
  rejected:  { icon: '❌', label: 'Ditolak',         cls: 'mf-badge-rejected' },
  withdrawn: { icon: '↩️', label: 'Ditarik',         cls: 'mf-badge-withdrawn'},
  removed:   { icon: '🗑️', label: 'Diturunkan',     cls: 'mf-badge-removed'  },
};

export default function StatusBadge({ status, style }) {
  const s = STATUS_MAP[status] ?? { icon: '?', label: status, cls: '' };
  return (
    <span className={`mf-badge ${s.cls}`} style={style} aria-label={s.label}>
      <span aria-hidden="true">{s.icon}</span> {s.label}
    </span>
  );
}
