// src/components/quiz/Catalog.jsx
// Katalog beranda Quiziz: baris matkul dengan status jujur (dibaca dari registry), filter, kartu "Lanjutkan", dan baris UAS.
// Status selalu ikon + teks (bukan hanya warna); yang belum ada tampil rapi (garis putus-putus), bukan seperti error.
import { Link } from 'react-router-dom';
import Ico from '../Ico';
import { FILTERS, SUBJECTS, doneCount } from '../../data/quiziz/registry';
import { PATHS } from '../../data/quiziz/routes';
import { openPalette, shortcutLabel } from './paletteBus';
import '../../styles/quizHome.css';

const PRIMARY_LABEL = { materi: 'Baca materi', latsol: 'Mulai latsol', praktikum: 'Buka praktikum' };
const QUICK_LABEL = { materi: 'Materi', latsol: 'Latsol', praktikum: 'Praktikum' };

export function StatusChip({ on, children }) {
  return (
    <span className="qz-chip" data-on={on ? 'true' : 'false'}>
      <i className={`fa-solid ${on ? 'fa-check' : 'fa-minus'}`} aria-hidden="true" />
      {children}
    </span>
  );
}

export function FilterChips({ value, onChange }) {
  return (
    <div className="qz-filters" role="group" aria-label="Filter mata kuliah">
      {FILTERS.map((f) => {
        const on = value === f.id;
        return (
          <button key={f.id} type="button" className="qz-fchip" aria-pressed={on} onClick={() => onChange(f.id)}>
            {on && <i className="fa-solid fa-check" aria-hidden="true" />}
            {f.label}
            <span className="qz-fchip-count">{SUBJECTS.filter(f.test).length}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SearchButton() {
  return (
    <button type="button" className="qz-catalog-search" onClick={openPalette}>
      <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
      <span>Cari matkul, bab, atau aktivitas</span>
      <kbd aria-hidden="true">{shortcutLabel()}</kbd>
    </button>
  );
}

function targetsOf(s) {
  return [
    s.materi && { kind: 'materi', to: s.materi.path },
    s.latsol && { kind: 'latsol', to: s.latsol.path },
    s.praktikum && { kind: 'praktikum', to: s.praktikum.path },
  ].filter(Boolean);
}

/** Satu baris matkul. Aksi utama mengikuti filter aktif; aksi lain yang tersedia jadi tautan cepat. */
export function CourseRow({ subject: s, filter }) {
  const all = targetsOf(s);
  const preferred = filter === 'latsol' ? 'latsol' : filter === 'praktikum' ? 'praktikum' : 'materi';
  const primary = all.find((t) => t.kind === preferred) || all[0] || null;
  const quick = all.filter((t) => t !== primary);
  const done = s.materi ? doneCount(s.slug, 'materi') : 0;
  return (
    <li className="qz-row" data-soon={primary ? undefined : 'true'}>
      <span className="qz-row-ico" aria-hidden="true"><Ico e={s.icon} /></span>
      <div className="qz-row-main">
        <h3 className="qz-row-name">{s.name}</h3>
        <ul className="qz-row-status" aria-label={`Ketersediaan ${s.name}`}>
          <li><StatusChip on={!!s.materi}>{s.materi ? `Materi${s.materi.babs ? ` · ${s.materi.babs} bab` : ''}` : 'Materi belum ada'}</StatusChip></li>
          {s.praktikum && <li><StatusChip on>{`Praktikum · ${s.praktikum.modul} modul`}</StatusChip></li>}
          <li><StatusChip on={!!s.latsol}>{s.latsol ? `Latsol · ${s.latsol.label}` : 'Latsol belum tersedia'}</StatusChip></li>
          {done > 0 && <li><StatusChip on>{`${done} bab selesai dibaca`}</StatusChip></li>}
        </ul>
      </div>
      <div className="qz-row-actions">
        {primary ? (
          <>
            <Link to={primary.to} className="qz-btn qz-btn-primary" aria-label={`${PRIMARY_LABEL[primary.kind]} ${s.name}`}>{PRIMARY_LABEL[primary.kind]}</Link>
            {quick.map((t) => (
              <Link key={t.kind} to={t.to} className="qz-row-link" aria-label={`${QUICK_LABEL[t.kind]} ${s.name}`}>{QUICK_LABEL[t.kind]}</Link>
            ))}
          </>
        ) : (
          <span className="qz-row-soon">Segera hadir</span>
        )}
      </div>
    </li>
  );
}

export function UasRow() {
  return (
    <li className="qz-row">
      <span className="qz-row-ico" aria-hidden="true"><i className="fa-solid fa-graduation-cap" /></span>
      <div className="qz-row-main">
        <h3 className="qz-row-name">Quiziz UAS</h3>
        <ul className="qz-row-status" aria-label="Ketersediaan Quiziz UAS">
          <li><StatusChip on={false}>Belum tersedia</StatusChip></li>
        </ul>
      </div>
      <div className="qz-row-actions">
        <Link to={PATHS.uas} className="qz-row-link" aria-label="Lihat status Quiziz UAS">Lihat status</Link>
      </div>
    </li>
  );
}

export function ContinueCard({ item }) {
  return (
    <section className="qz-continue" aria-labelledby="qz-continue-title">
      <div>
        <h2 id="qz-continue-title" className="qz-continue-kicker">Lanjutkan</h2>
        <p className="qz-continue-title">{item.subject.short} · {item.bab.label}</p>
        <p className="qz-continue-sub">{item.bab.mode === 'praktikum' ? 'Praktikum · ' : ''}{item.bab.category} · dibuka {item.ago}</p>
      </div>
      <Link to={item.to} className="qz-btn qz-btn-primary">Lanjut baca</Link>
    </section>
  );
}
