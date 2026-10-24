// src/pages/quiziz/Quiziz.jsx — route: /quiziz
// Landing "Quiziz Mingguan (Latsol)". Urutan elemen dipertahankan persis:
// judul -> pilih matkul -> subjudul -> disclaimer (cuma di sini) -> 8 kartu
// matkul (semua bisa dipencet) -> segera hadir (link ke UAS) -> komentar ->
// saran & masukan.
import { useNavigate } from 'react-router-dom';
import SubjectComments from '../../components/SubjectComments';
import SaranWebsite from '../../components/SaranWebsite';
import useQuizAuth from '../../components/quiz/useQuizAuth';
import QuizShell from '../../components/quiz/QuizShell';

const SUBJECTS = [
  { slug: 'bahasainggris', name: 'Bahasa Inggris', icon: '🇬🇧', color: '#38bdf8' },
  { slug: 'pai', name: 'Pendidikan Agama Islam', icon: '🕌', color: '#34d399' },
  { slug: 'ftk', name: 'Falsafah dan Teori Keperawatan', icon: '🩺', color: '#f472b6' },
  { slug: 'kdk', name: 'Konsep Dasar Keperawatan', icon: '📋', color: '#8b7bff' },
  { slug: 'pancasila', name: 'Pendidikan Pancasila', icon: '🇮🇩', color: '#fb7185' },
  { slug: 'kesglob', name: 'Kesehatan Global', icon: '🌍', color: '#5eead4' },
  { slug: 'ibd', name: 'Ilmu Biomedik Dasar', icon: '🧬', color: '#a78bfa' },
  { slug: 'komdas', name: 'Komunikasi Dasar Keperawatan', icon: '💬', color: '#22d3ee' },
];

export default function Quiziz() {
  const navigate = useNavigate();
  const user = useQuizAuth();

  return (
    <QuizShell>
      <div style={{ textAlign: 'center', padding: '4px 0 8px' }}>
        <h1 className="qz-heading">Quiz Keperawatan</h1>
        <span className="qz-eyebrow">Pilih Mata Pelajaran</span>
        <p className="qz-subtext">Latihan Soal HOTS Berbasis PPT Dosen/LKM Praktikum</p>
      </div>

      <div className="qz-disclaimer" style={{ marginTop: 22 }}>
        <span className="qz-dc-icon">🤖</span>
        <div>
          <h4>Disclaimer AI</h4>
          <p>Semua soal, penjelasan, dan penyusunan materi di halaman ini dibuat dengan bantuan AI.
          Gunakan sebagai bahan latihan mandiri, bukan pengganti materi resmi dari dosen pengampu.</p>
        </div>
      </div>

      <div className="qlz-grid">
        {SUBJECTS.map(s => (
          <button
            key={s.slug}
            className="qlz-card"
            style={{ '--qlz-accent': s.color }}
            onClick={() => navigate(`/quiziz/${s.slug}`)}
          >
            <span className="qlz-icon" style={{ '--qlz-accent': s.color }}>{s.icon}</span>
            <span className="qlz-name">{s.name}</span>
            <span className="qlz-arrow">→</span>
          </button>
        ))}
      </div>

      <button className="qlz-soon" onClick={() => navigate('/quizizuas')}>
        <span style={{ fontSize: '1.3rem' }}>🚧</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>Segera Hadir</div>
          <div style={{ color: 'var(--qzg-text-dim)', fontSize: '0.8rem' }}>Website QUIZIZ UAS LATSOL →</div>
        </div>
      </button>

      <div className="qz-section">
        <SubjectComments subjectKey="quizizLatsol" user={user} />
      </div>
      <div className="qz-section">
        <SaranWebsite user={user} />
      </div>
    </QuizShell>
  );
}
