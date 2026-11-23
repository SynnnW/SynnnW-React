// src/components/quiz/CourseWorkspace.jsx
// Strip identitas matkul + tab Materi · Latsol · Praktikum di atas halaman matkul. Tab hanyalah tautan antar URL kanonis yang
// sudah ada (tidak ada rute baru). Tab yang belum tersedia tampil dengan alasan, bukan klik palsu; Praktikum hanya muncul bila ada.
// Dipakai halaman latsol sekarang; reader materi menyusul di Fase 3. Nama matkul tidak diulang di sini karena halaman memegang judulnya.
import { Link } from 'react-router-dom';
import Ico from '../Ico';
import { getSubject } from '../../data/quiziz/registry';
import '../../styles/quizHome.css';

export default function CourseWorkspace({ slug, active, children }) {
  const s = getSubject(slug);
  if (!s) return children;
  const tabs = [
    { id: 'materi', label: 'Materi', to: s.materi?.path, off: 'belum ada' },
    { id: 'latsol', label: 'Latsol', to: s.latsol?.path, off: 'belum tersedia' },
    ...(s.praktikum ? [{ id: 'praktikum', label: 'Praktikum', to: s.praktikum.path, off: 'belum ada' }] : []),
  ];
  const summary = [
    s.materi ? `Materi${s.materi.babs ? ` ${s.materi.babs} bab` : ''}` : 'Materi belum ada',
    ...(s.praktikum ? [`Praktikum ${s.praktikum.modul} modul`] : []),
    s.latsol ? `Latsol ${s.latsol.label}` : 'Latsol belum tersedia',
  ].join(' · ');
  return (
    <>
      <div className="qz-ws">
        <div className="qz-ws-id">
          <span className="qz-ws-ico" aria-hidden="true"><Ico e={s.icon} /></span>
          <p className="qz-ws-sum"><strong>{s.short}</strong> · {summary}</p>
        </div>
        <nav className="qz-ws-tabs" aria-label={`Bagian ${s.name}`}>
          {tabs.map((t) => {
            const isActive = t.id === active;
            if (isActive) {
              return <span key={t.id} className="qz-wtab" aria-current="page">{t.label}{!t.to && <small>{t.off}</small>}</span>;
            }
            if (!t.to) {
              return <span key={t.id} className="qz-wtab" data-off="true" aria-disabled="true">{t.label}<small>{t.off}</small></span>;
            }
            return <Link key={t.id} to={t.to} className="qz-wtab">{t.label}</Link>;
          })}
        </nav>
      </div>
      {children}
    </>
  );
}
