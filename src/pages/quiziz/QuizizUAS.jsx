// src/pages/quiziz/QuizizUAS.jsx — route: /quizizuas
// Landing prototype UAS — placeholder murni, belum ada logika quiz.
// Urutan dipertahankan persis: judul -> pilih matkul (acak, tidak bisa
// dipencet) + mode multiplayer (belum aktif) -> disclaimer -> link materi
// (ke Latsol) -> komentar -> saran & masukan.
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SubjectComments from '../../components/SubjectComments';
import SaranWebsite from '../../components/SaranWebsite';
import useQuizAuth from '../../components/quiz/useQuizAuth';
import QuizShell from '../../components/quiz/QuizShell';

const SUBJECTS = [
  { name: 'Bahasa Inggris', icon: '🇬🇧' },
  { name: 'Pendidikan Agama Islam', icon: '🕌' },
  { name: 'Falsafah dan Teori Keperawatan', icon: '🩺' },
  { name: 'Konsep Dasar Keperawatan', icon: '📋' },
  { name: 'Pendidikan Pancasila', icon: '🇮🇩' },
  { name: 'Kesehatan Global', icon: '🌍' },
  { name: 'Ilmu Biomedik Dasar', icon: '🧬' },
  { name: 'Komunikasi Dasar Keperawatan', icon: '💬' },
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function QuizizUAS() {
  const navigate = useNavigate();
  const user = useQuizAuth();
  const shuffled = useMemo(() => shuffle(SUBJECTS), []);

  return (
    <QuizShell>
      <div style={{ textAlign: 'center', padding: '4px 0 18px' }}>
        <h1 className="qz-heading">Quiziz</h1>
      </div>

      <span className="qz-eyebrow" style={{ display: 'block', marginBottom: 12 }}>Pilih Mata Pelajaran yang Diinginkan</span>
      <div className="qlz-grid" style={{ marginBottom: 10 }}>
        {shuffled.map(s => (
          <div key={s.name} className="qlz-card" style={{ cursor: 'default', opacity: 0.6 }}>
            <span className="qlz-icon">{s.icon}</span>
            <span className="qlz-name">{s.name}</span>
            <span className="qz-badge qz-badge-soon" style={{ marginLeft: 'auto' }}>Coming Soon</span>
          </div>
        ))}
      </div>

      <div className="qlz-card" style={{ cursor: 'default', borderStyle: 'dashed', margin: '14px 0 28px', opacity: 0.75 }}>
        <span style={{ fontSize: '1.3rem' }}>🎮</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Mode Multiplayer</div>
          <div style={{ color: 'var(--qzg-text-dim)', fontSize: '0.78rem' }}>Belum aktif — menunggu materi UAS tersedia</div>
        </div>
        <span className="qz-badge qz-badge-soon" style={{ marginLeft: 'auto' }}>Coming Soon</span>
      </div>

      <div className="qz-disclaimer">
        <span className="qz-dc-icon">🤖</span>
        <div>
          <h4>Disclaimer AI</h4>
          <p>Semua soal & penyusunan materi UAS nantinya dibuat dengan bantuan AI, sama seperti Latsol Mingguan.</p>
          <p style={{ marginTop: 6 }}>Materi UAS di atas memang belum tersedia (target Desember) — tapi kolom komentar &amp; saran di bawah
          sudah bisa dipakai duluan supaya masukanmu bisa ditampung dari sekarang.</p>
        </div>
      </div>

      <button
        className="qlz-card"
        style={{ '--qlz-accent': '#5eead4', marginTop: 20, marginBottom: 32, width: '100%' }}
        onClick={() => navigate('/quiziz')}
      >
        <span style={{ fontSize: '1.3rem' }}>📖</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Link Materi</div>
          <div style={{ color: 'var(--qzg-text-dim)', fontSize: '0.78rem' }}>Materi sungguhan untuk sekarang ada di Quiziz Mingguan (Latsol) →</div>
        </div>
        <span className="qlz-arrow">→</span>
      </button>

      <div className="qz-section">
        <SubjectComments subjectKey="quizizUas" user={user} />
      </div>
      <div className="qz-section">
        <SaranWebsite user={user} />
      </div>
    </QuizShell>
  );
}
