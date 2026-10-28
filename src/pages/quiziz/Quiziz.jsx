// src/pages/quiziz/Quiziz.jsx — route: /quiziz
// Landing "Quiziz Mingguan (Latsol)" — desain bento (sama dengan Works/Price/Terms).
// Urutan konten dipertahankan: judul -> disclaimer -> 8 kartu matkul ->
// segera hadir (link ke UAS) -> komentar -> saran & masukan.
import { useNavigate } from 'react-router-dom';
import SubjectComments from '../../components/SubjectComments';
import SaranWebsite from '../../components/SaranWebsite';
import useQuizAuth from '../../components/quiz/useQuizAuth';
import QuizShell from '../../components/quiz/QuizShell';
import { Reveal, Arrow } from '../../components/BentoKit';

const SUBJECTS = [
  { slug: 'bahasainggris', name: 'Bahasa Inggris', icon: '🇬🇧', color: '#38bdf8' },
  { slug: 'pai', name: 'Pendidikan Agama Islam', icon: '🕌', color: '#34d399' },
  { slug: 'ftk', name: 'Falsafah dan Teori Keperawatan', icon: '🩺', color: '#f472b6' },
  { slug: 'kdk', name: 'Konsep Dasar Keperawatan', icon: '📋', color: '#8b7bff' },
  { slug: 'pancasila', name: 'Pendidikan Pancasila', icon: '🇮🇩', color: '#fb7185' },
  { slug: 'kesglob', name: 'Kesehatan Global', icon: '🌍', color: '#5eead4' },
  { slug: 'ibd', name: 'Ilmu Biomedik Dasar', icon: '🧬', color: 'var(--accent)' },
  { slug: 'komdas', name: 'Komunikasi Dasar Keperawatan', icon: '💬', color: '#22d3ee' },
];

export default function Quiziz() {
  const navigate = useNavigate();
  const user = useQuizAuth();

  return (
    <QuizShell maxWidth={1180}>
      <div className="qz-landing">
        <div className="bn-grid">
          <Reveal className="bn-card bn-hello bn-span-4">
            <span className="bn-kicker">Quiziz · Latsol Mingguan</span>
            <h1 className="bn-title">Quiz <span>Keperawatan</span></h1>
            <p className="bn-lead">Latihan soal HOTS berbasis PPT dosen / LKM praktikum. Pilih mata kuliah, langsung kerjakan.</p>
          </Reveal>
          <Reveal className="bn-card bn-hot bn-span-2" delay={0.08}>
            <span className="bn-kicker" style={{ color: 'rgba(255,255,255,.85)' }}>Mata kuliah</span>
            <div>
              <div className="bn-big">{SUBJECTS.length}</div>
              <small>siap dikerjakan</small>
            </div>
            <button className="bn-btn" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.55)', alignSelf: 'flex-start' }} onClick={() => navigate('/quizizuas')}>
              Quiziz UAS <Arrow />
            </button>
          </Reveal>
        </div>

        <Reveal className="bn-card qz-note">
          <span className="qz-note-ico">🤖</span>
          <div>
            <b>Disclaimer AI</b>
            <p>Semua soal, penjelasan, dan penyusunan materi di halaman ini dibuat dengan bantuan AI.
            Gunakan sebagai bahan latihan mandiri, bukan pengganti materi resmi dari dosen pengampu.</p>
          </div>
        </Reveal>

        <div className="bn-grid">
          {SUBJECTS.map((s, i) => (
            <Reveal key={s.slug} className="bn-span-2" delay={(i % 3) * 0.06}>
              <button className="bn-card qz-subj" style={{ '--c': s.color, width: '100%' }} onClick={() => navigate(`/quiziz/${s.slug}`)}>
                <span className="qz-subj-ico">{s.icon}</span>
                <span>
                  <span className="qz-subj-name">{s.name}</span>
                  <span className="qz-subj-go"><span>Mulai latihan</span><Arrow /></span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <button className="bn-card qz-link-card" onClick={() => navigate('/quizizuas')}>
          <span style={{ fontSize: '1.5rem' }}>🚧</span>
          <span>
            <b style={{ fontWeight: 500 }}>Segera Hadir</b>
            <small>Website QUIZIZ UAS LATSOL</small>
          </span>
          <span className="qz-go">→</span>
        </button>

        <div className="qz-section"><SubjectComments subjectKey="quizizLatsol" user={user} /></div>
        <div className="qz-section"><SaranWebsite user={user} /></div>
      </div>
    </QuizShell>
  );
}
