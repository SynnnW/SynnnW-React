// src/pages/quiziz/Quiziz.jsx — route: /quiziz
// Landing "Quiziz Mingguan (Latsol)" — desain bento (sama dengan Works/Price/Terms).
// Layar awal: chat Leo AI paling atas (bisa langsung bertanya), lalu pilihan Materi / Quiziz.
// Daftar latsol (?view=quiz): judul -> disclaimer -> 8 kartu matkul ->
// segera hadir (link ke UAS) -> komentar -> saran & masukan.
import { useNavigate, useSearchParams } from 'react-router-dom';
import SubjectComments from '../../components/SubjectComments';
import SaranWebsite from '../../components/SaranWebsite';
import useQuizAuth from '../../components/quiz/useQuizAuth';
import QuizShell from '../../components/quiz/QuizShell';
import LeoHomeChat from '../../components/quiz/LeoHomeChat';
import { Reveal, Arrow } from '../../components/BentoKit';
import Ico from '../../components/Ico';

const SUBJECTS = [
  { slug: 'bahasainggris', name: 'Bahasa Inggris', icon: '🇬🇧', color: 'var(--accent-text)' },
  { slug: 'pai', name: 'Pendidikan Agama Islam', icon: '🕌', color: 'var(--accent-text)' },
  { slug: 'ftk', name: 'Falsafah dan Teori Keperawatan', icon: '🩺', color: 'var(--text)' },
  { slug: 'kdk', name: 'Konsep Dasar Keperawatan', icon: '📋', color: 'var(--accent-text)' },
  { slug: 'pancasila', name: 'Pendidikan Pancasila', icon: '🇮🇩', color: 'var(--accent-text)' },
  { slug: 'kesglob', name: 'Kesehatan Global', icon: '🌍', color: 'var(--accent-text)' },
  { slug: 'ibd', name: 'Ilmu Biomedik Dasar', icon: '🧬', color: 'var(--accent-text)' },
  { slug: 'komdas', name: 'Komunikasi Dasar Keperawatan', icon: '💬', color: 'var(--accent-text)' },
];

export default function Quiziz() {
  const navigate = useNavigate();
  const user = useQuizAuth();
  const [params, setParams] = useSearchParams();

  // Layer pilihan: "Materi" atau "Quiziz". "Quiziz" menampilkan daftar matkul lama apa adanya (?view=quiz).
  if (params.get('view') !== 'quiz') {
    return (
      <QuizShell maxWidth={1180}>
        <div className="qz-landing">
          <LeoHomeChat />
          <div className="bn-grid">
            <Reveal className="bn-span-3">
              <button className="bn-card qz-subj" style={{ '--c': 'var(--accent-text)', width: '100%' }} onClick={() => navigate('/quiziz/materi')}>
                <span className="qz-subj-ico"><Ico e="📚" /></span>
                <span>
                  <span className="qz-subj-name">Materi</span>
                  <span className="qz-subj-go"><span>Baca materi per bab + Leo AI</span><Arrow /></span>
                </span>
              </button>
            </Reveal>
            <Reveal className="bn-span-3" delay={0.06}>
              <button className="bn-card qz-subj" style={{ '--c': 'var(--accent-text)', width: '100%' }} onClick={() => setParams({ view: 'quiz' })}>
                <span className="qz-subj-ico"><Ico e="📝" /></span>
                <span>
                  <span className="qz-subj-name">Quiziz</span>
                  <span className="qz-subj-go"><span>Latihan soal per mata kuliah</span><Arrow /></span>
                </span>
              </button>
            </Reveal>
          </div>
        </div>
      </QuizShell>
    );
  }

  return (
    <QuizShell maxWidth={1180}>
      <div className="qz-landing">
        <button className="bn-btn" style={{ alignSelf: 'flex-start' }} onClick={() => setParams({})}>
          <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Kembali
        </button>
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
          <span className="qz-note-ico"><i className="fa-solid fa-robot" aria-hidden="true" /></span>
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
                <span className="qz-subj-ico"><Ico e={s.icon} /></span>
                <span>
                  <span className="qz-subj-name">{s.name}</span>
                  <span className="qz-subj-go"><span>Mulai latihan</span><Arrow /></span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <button className="bn-card qz-link-card" onClick={() => navigate('/quizizuas')}>
          <span style={{ fontSize: '1.5rem' }}></span>
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
