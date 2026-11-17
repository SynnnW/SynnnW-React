// src/pages/quiziz/MateriHub.jsx — route: /quiziz/materi
// Daftar matkul yang punya materi. PAI & Pancasila tampil tapi nonaktif (ujiannya sistem proyek).
import { useNavigate } from 'react-router-dom';
import QuizShell from '../../components/quiz/QuizShell';
import { Reveal, Arrow } from '../../components/BentoKit';
import Ico from '../../components/Ico';
import { MATERI, countBabs } from '../../data/quiziz/materi/registry';

const DISABLED = [
  { name: 'Pendidikan Agama Islam', icon: '🕌' },
  { name: 'Pendidikan Pancasila', icon: '🇮🇩' },
];

export default function MateriHub() {
  const navigate = useNavigate();
  const items = Object.values(MATERI);
  return (
    <QuizShell maxWidth={1180}>
      <div className="qz-landing">
        <button className="bn-btn" style={{ alignSelf: 'flex-start' }} onClick={() => navigate('/quiziz')}>
          <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Kembali
        </button>

        <div className="bn-grid">
          <Reveal className="bn-card bn-hello bn-span-6">
            <span className="bn-kicker">Quiziz · Materi</span>
            <h1 className="bn-title">Materi <span>Kuliah</span></h1>
            <p className="bn-lead">Materi per mata kuliah, dibagi per bab, lengkap dengan pencarian, penanda progres, dan Leo AI untuk bantu menjelaskan.</p>
          </Reveal>
        </div>

        <div className="bn-grid">
          <Reveal className="bn-span-2">
            <button className="bn-card qz-subj" style={{ '--c': 'var(--accent-text)', width: '100%' }} onClick={() => navigate('/quiziz/bahasainggris/materi')}>
              <span className="qz-subj-ico"><Ico e="🇬🇧" /></span>
              <span>
                <span className="qz-subj-name">Bahasa Inggris</span>
                <span className="qz-subj-go"><span>Buka materi</span><Arrow /></span>
              </span>
            </button>
          </Reveal>
          {items.map((m, i) => {
            const n = countBabs(m.manifest);
            return (
              <Reveal key={m.slug} className="bn-span-2" delay={((i + 1) % 3) * 0.06}>
                <button className="bn-card qz-subj" style={{ '--c': 'var(--accent-text)', width: '100%' }} onClick={() => navigate(`/quiziz/${m.slug}/materi`)}>
                  <span className="qz-subj-ico"><Ico e={m.icon} /></span>
                  <span>
                    <span className="qz-subj-name">{m.title}</span>
                    <span className="qz-subj-go"><span>{n} bab tersedia</span><Arrow /></span>
                  </span>
                </button>
              </Reveal>
            );
          })}
          {DISABLED.map((d) => (
            <Reveal key={d.name} className="bn-span-2">
              <div className="bn-card qz-subj" aria-disabled="true" style={{ '--c': 'var(--text-faint)', width: '100%', opacity: 0.55, cursor: 'not-allowed' }}>
                <span className="qz-subj-ico"><Ico e={d.icon} /></span>
                <span>
                  <span className="qz-subj-name">{d.name}</span>
                  <span className="qz-subj-go" style={{ whiteSpace: 'normal', lineHeight: 1.5 }}>
                    UTS/UAS matkul ini sistem proyek kelompok, bukan materi tertulis — PPT-nya nggak bisa disebarluaskan jadi materi di sini.
                  </span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="bn-grid">
          {['komdas', 'ibd'].map((slug) => (
            <Reveal key={slug} className="bn-span-3">
              <button className="bn-card qz-link-card" onClick={() => navigate(`/quiziz/${slug}/praktikum`)} style={{ width: '100%' }}>
                <span style={{ fontSize: '1.5rem' }}><Ico e="📋" /></span>
                <span>
                  <b style={{ fontWeight: 500 }}>Materi Praktikum {MATERI[slug].title}</b>
                  <small>{slug === 'ibd' ? 'Modul lembar kerja praktikum per sistem tubuh' : 'SOP & materi praktikum komunikasi'}</small>
                </span>
                <span className="qz-go">→</span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </QuizShell>
  );
}
