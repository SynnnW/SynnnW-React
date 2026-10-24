// src/pages/quiziz/QuizFTK.jsx — route: /quiziz/ftk
// FTK BEDA dari matkul lain: materi dari buku ners (sudah mencakup semua
// TM), jadi dibuka per BAB (ChapterPicker), materinya tampil ala novel
// browser (NovelReader), latsol-nya nempel per bab juga lewat QuizEngine.
//
// BELUM ADA BAB YANG DIISI — `chapters` di manifest.js masih kosong,
// menunggu buku/PPT FTK diupload. Alur di bawah sudah lengkap & siap
// pakai begitu bab pertama ditambahkan (lihat generate-soal.prompt.js
// di folder data/quiziz/ftk/ untuk prompt generate soalnya).
import { useState } from 'react';
import ChapterPicker from '../../components/quiz/ChapterPicker';
import NovelReader from '../../components/NovelReader';
import QuizEngine from '../../components/quiz/QuizEngine';
import QuizShell from '../../components/quiz/QuizShell';
import { AiDisclaimer } from './QuizBahasaInggris';
import { chapters } from '../../data/quiziz/ftk/manifest';
import '../../styles/quizGlass.css';

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const mapQ = (q) => ({ ...q, correct: q.correctIndex });

/* Vite tidak punya require() dinamis di browser — ini cara Vite-native untuk
   "import semua file yang cocok pola ini", dipakai karena jumlah bab FTK
   dinamis/belum tentu (tambah bab baru = taruh folder baru, glob ini otomatis
   ikut membaca tanpa perlu ubah kode). eager:true supaya langsung ter-resolve
   sebagai object biasa, bukan Promise, lebih gampang dipakai di bawah. */
const MATERI_MODULES  = import.meta.glob('../../data/quiziz/ftk/*/materi.js', { eager: true });
const BELAJAR_MODULES = import.meta.glob('../../data/quiziz/ftk/*/soal-belajar.js', { eager: true });
const LATIHAN_MODULES = import.meta.glob('../../data/quiziz/ftk/*/soal-latihan.js', { eager: true });

const findModule = (globObj, chapterId) => {
  const key = Object.keys(globObj).find(p => p.includes(`/ftk/${chapterId}/`));
  return key ? globObj[key] : null;
};

export default function QuizFTK() {
  const [chapterId, setChapterId] = useState(null);
  const [view, setView] = useState('materi'); // 'materi' | 'quiz'

  const chapter = chapters.find(c => c.id === chapterId) || null;
  const idx = chapters.findIndex(c => c.id === chapterId);

  if (!chapterId) {
    return (
      <QuizShell>
        <AiDisclaimer />
        <ChapterPicker
          subjectName="Falsafah dan Teori Keperawatan"
          subjectSlug="ftk"
          chapters={chapters}
          onSelectChapter={setChapterId}
        />
      </QuizShell>
    );
  }

  if (view === 'materi') {
    // data/quiziz/ftk/<chapterId>/materi.js diharapkan export { content } (string/array paragraf)
    const materiMod = findModule(MATERI_MODULES, chapterId);
    const materiContent = materiMod?.content || '';
    return (
      <div>
        <NovelReader
          title="Falsafah dan Teori Keperawatan"
          chapterTitle={chapter?.title || chapterId}
          content={materiContent}
          storageKey={`ftk_${chapterId}`}
          onBack={() => setChapterId(null)}
          onPrev={idx > 0 ? () => setChapterId(chapters[idx - 1].id) : undefined}
          onNext={idx < chapters.length - 1 ? () => setChapterId(chapters[idx + 1].id) : undefined}
          hasPrev={idx > 0}
          hasNext={idx < chapters.length - 1}
        />
        <div className="qz-app" style={{ background: 'none', maxWidth: 640, margin: '0 auto', padding: '0 18px 40px' }}>
          <button
            className="qz-btn qz-btn-primary"
            onClick={() => setView('quiz')}
            style={{ width: '100%' }}
          >
            ✏️ Lanjut ke Latihan Soal Bab Ini →
          </button>
        </div>
      </div>
    );
  }

  // view === 'quiz'
  const lbKeyPrefix = `ftk_${chapterId}`;
  const getQuestions = (subject, type) => {
    const mod = type === '100' ? findModule(BELAJAR_MODULES, chapterId) : findModule(LATIHAN_MODULES, chapterId);
    const list = type === '100' ? mod?.soalBelajar : mod?.soalLatihan;
    if (!list) return [];
    return shuffle(list.map(mapQ)).map((q, i) => ({ ...q, id: i + 1 }));
  };

  return (
    <div className="qz-app" style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
      <button
        className="qz-btn qz-btn-ghost qz-btn-sm"
        onClick={() => setView('materi')}
        style={{ marginBottom: 14 }}
      >
        ← Kembali ke Materi
      </button>
      <AiDisclaimer />
      <QuizEngine
        subjects={[{ key: lbKeyPrefix, icon: '🩺', name: `FTK — ${chapter?.title || chapterId}`, abbr: 'FTK', available: true, color: '#3b82f6', gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)', desc: 'Bahan Belajar & Latihan Serius bab ini' }]}
        quizTypes={[
          { key: '100', icon: '📖', label: 'Bahan Belajar', soalCount: 100, desc: '100 soal studi kasus mencakup seluruh materi bab ini.', typeClass: 'qz-type-learn', badgeBg: 'rgba(94,234,212,0.10)', badgeBorder: 'rgba(94,234,212,0.35)', badgeColor: '#5eead4', badgeLabel: '📖 BELAJAR' },
          { key: '50', icon: '⏱️', label: 'Latihan Serius', soalCount: 50, desc: '50 soal pola ujian sesungguhnya.', typeClass: 'qz-type-practice', badgeBg: 'rgba(251,191,36,0.10)', badgeBorder: 'rgba(251,191,36,0.35)', badgeColor: '#fbbf24', badgeLabel: '⏱️ LATIHAN' },
        ]}
        storagePrefix={`qz_${lbKeyPrefix}`}
        questionGetter={getQuestions}
      />
    </div>
  );
}
