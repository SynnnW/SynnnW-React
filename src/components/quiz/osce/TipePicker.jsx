// src/components/quiz/osce/TipePicker.jsx
import { Reveal } from '../../BentoKit';

export default function TipePicker({ tipeList, onPick }) {
  if (!tipeList || tipeList.length === 0) {
    return (
      <div className="qz-state" role="status">
        <span className="qz-state-ico"><i className="fa-solid fa-folder-open" aria-hidden="true" /></span>
        <h2 className="qz-state-title">Belum ada studi kasus</h2>
        <p className="qz-state-text">Konten studi kasus OSCE belum tersedia untuk saat ini.</p>
      </div>
    );
  }
  return (
    <div className="bn-grid osce-tipe-grid">
      {tipeList.map((t, i) => (
        <Reveal key={t.id} className="bn-span-2" delay={(i % 3) * 0.06}>
          <button type="button" className="qz-subj" style={{ '--c': 'var(--accent-text)' }} onClick={() => onPick(t.id)}>
            <span className="qz-subj-ico"><i className={`fa-solid ${t.icon}`} aria-hidden="true" /></span>
            <span>
              <span className="qz-subj-name">{t.label}</span>
              <span className="qz-subj-go"><span>{t.count} kasus</span><span>→</span></span>
            </span>
          </button>
        </Reveal>
      ))}
    </div>
  );
}
