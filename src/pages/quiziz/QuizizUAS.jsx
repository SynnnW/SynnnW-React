// src/pages/quiziz/QuizizUAS.jsx — route: /quizizuas
// Landing prototype UAS — placeholder, belum ada logika quiz. Desain bento.
// Urutan: judul -> matkul (acak, belum bisa dipencet) + multiplayer ->
// disclaimer -> link materi (ke Latsol) -> komentar -> saran & masukan.
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SubjectComments from '../../components/SubjectComments';
import SaranWebsite from '../../components/SaranWebsite';
import useQuizAuth from '../../components/quiz/useQuizAuth';
import QuizShell from '../../components/quiz/QuizShell';
import { Reveal } from '../../components/BentoKit';

const SUBJECTS = [
  { name: 'Bahasa Inggris', icon: '🇬🇧', color: '#38bdf8' },
  { name: 'Pendidikan Agama Islam', icon: '🕌', color: '#34d399' },
  { name: 'Falsafah dan Teori Keperawatan', icon: '🩺', color: '#f472b6' },
  { name: 'Konsep Dasar Keperawatan', icon: '📋', color: '#8b7bff' },
  { name: 'Pendidikan Pancasila', icon: '🇮🇩', color: '#fb7185' },
  { name: 'Kesehatan Global', icon: '🌍', color: '#5eead4' },
  { name: 'Ilmu Biomedik Dasar', icon: '🧬', color: '#a78bfa' },
  { name: 'Komunikasi Dasar Keperawatan', icon: '💬', color: '#22d3ee' },
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
    <QuizShell maxWidth={1180}>
      <div className="qz-landing">
        <div className="bn-grid">
          <Reveal className="bn-card bn-hello bn-span-4">
            <span className="bn-kicker">Quiziz · UAS</span>
            <h1 className="bn-title">Quiziz <span>UAS</span></h1>
            <p className="bn-lead">Materi UAS belum tersedia (target Desember). Komentar dan saran sudah bisa dipakai dari sekarang.</p>
          </Reveal>
          <Reveal className="bn-card bn-hot bn-span-2" delay={0.08}>
            <span className="bn-kicker" style={{ color: 'rgba(255,255,255,.85)' }}>Status</span>
            <div>
              <div className="bn-big" style={{ fontSize: 'clamp(2.4rem,5vw,3.6rem)' }}>Soon</div>
              <small>target Desember</small>
            </div>
            <button className="bn-btn" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.55)', alignSelf: 'flex-start' }} onClick={() => navigate('/quiziz')}>
              Ke Latsol →
            </button>
          </Reveal>
        </div>

        <div className="bn-grid">
          {shuffled.map((s, i) => (
            <Reveal key={s.name} className="bn-span-2" delay={(i % 3) * 0.06}>
              <div className="bn-card qz-subj qz-subj--off" style={{ '--c': s.color }}>
                <span className="qz-subj-ico">{s.icon}</span>
                <span>
                  <span className="qz-subj-name">{s.name}</span>
                  <span className="qz-subj-go"><span>Coming soon</span></span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="bn-card qz-note" style={{ borderStyle: 'dashed' }}>
          <span className="qz-note-ico">🎮</span>
          <div>
            <b>Mode Multiplayer</b>
            <p>Belum aktif, menunggu materi UAS tersedia.</p>
          </div>
        </Reveal>

        <Reveal className="bn-card qz-note">
          <span className="qz-note-ico">🤖</span>
          <div>
            <b>Disclaimer AI</b>
            <p>Semua soal dan penyusunan materi UAS nantinya dibuat dengan bantuan AI, sama seperti Latsol Mingguan.</p>
          </div>
        </Reveal>

        <button className="bn-card qz-link-card" onClick={() => navigate('/quiziz')}>
          <span style={{ fontSize: '1.5rem' }}>📖</span>
          <span>
            <b style={{ fontWeight: 500 }}>Link Materi</b>
            <small>Materi sungguhan untuk sekarang ada di Quiziz Mingguan (Latsol)</small>
          </span>
          <span className="qz-go">→</span>
        </button>

        <div className="qz-section"><SubjectComments subjectKey="quizizUas" user={user} /></div>
        <div className="qz-section"><SaranWebsite user={user} /></div>
      </div>
    </QuizShell>
  );
}
