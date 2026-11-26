// src/components/quiz/osce/CasePicker.jsx
import { useMemo, useState } from 'react';
import { Reveal } from '../../BentoKit';

const LEVEL_ICON = { dasar: 'fa-seedling', menengah: 'fa-arrow-up', sulit: 'fa-fire' };

export default function CasePicker({ cases, attemptedIds, onPick }) {
  const [q, setQ] = useState('');
  const showSearch = cases.length > 8;
  const filtered = useMemo(() => {
    if (!showSearch || !q.trim()) return cases;
    const needle = q.trim().toLowerCase();
    return cases.filter((c) => c.title.toLowerCase().includes(needle) || c.summary.toLowerCase().includes(needle));
  }, [cases, q, showSearch]);

  if (cases.length === 0) {
    return (
      <div className="qz-state" role="status">
        <span className="qz-state-ico"><i className="fa-solid fa-folder-open" aria-hidden="true" /></span>
        <h2 className="qz-state-title">Belum ada kasus untuk tipe ini</h2>
        <p className="qz-state-text">Coba pilih tipe hubungan interpersonal lain.</p>
      </div>
    );
  }

  return (
    <div className="osce-case-picker">
      {showSearch && (
        <div className="osce-case-search nm-inset">
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari kasus…"
            aria-label="Cari kasus"
          />
        </div>
      )}
      <div className="bn-grid">
        {filtered.map((c, i) => (
          <Reveal key={c.id} className="bn-span-3" delay={(i % 4) * 0.05}>
            <button type="button" className="qz-subj osce-case-card" onClick={() => onPick(c.id)}>
              <span>
                <span className="qz-subj-name">{c.title}</span>
                <p className="osce-mode-desc">{c.summary}</p>
                <span className="osce-case-chips">
                  {c.level && (
                    <span className="qz-chip"><i className={`fa-solid ${LEVEL_ICON[c.level] || 'fa-circle'}`} aria-hidden="true" /> {c.level}</span>
                  )}
                  {c.durationMin && (
                    <span className="qz-chip"><i className="fa-solid fa-clock" aria-hidden="true" /> {c.durationMin} mnt</span>
                  )}
                  {attemptedIds?.has(c.id) && (
                    <span className="qz-chip"><i className="fa-solid fa-circle-check" aria-hidden="true" /> Sudah dicoba</span>
                  )}
                </span>
              </span>
              <span className="qz-subj-go"><span>Pilih</span><span>→</span></span>
            </button>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
