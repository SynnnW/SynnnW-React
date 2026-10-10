// src/pages/BahasaInggrisQuiz.jsx
// ─────────────────────────────────────────────────────────────
// Halaman Quiz Bahasa Inggris — Agronursing/Keperawatan UNEJ 2026
// Kelas A · B · C · D | Semester 1 Angkatan 2026
//
// Tipe soal:
//   • Grammar    — 50 soal (Soal 1–50 dari 150 soal latihan)
//   • Vocabulary — 50 soal (Soal 51–100 dari 150 soal latihan)
//   • Reading    — 50 soal (Soal 101–150 dari 150 soal latihan)
//   • Semua      — 150 soal gabungan
//   • Simulasi UTS — 50 soal versi sulit (kisi-kisi UTS)
//
// 🤖 Soal & penjelasan: Claude.ai + ChatGPT (AI-generated)
//    Digunakan sebagai bahan latihan mandiri.
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizEngine from '../components/quiz/QuizEngine';
import { grammarQuestions }    from '../data/bi-grammar';
import { vocabularyQuestions } from '../data/bi-vocabulary';
import { readingQuestions }    from '../data/bi-reading';
import { utsQuestions }        from '../data/bi-uts';

/* ══════════════════════════════════════════════════════════════
   DISCLAIMER BANNER COMPONENT
══════════════════════════════════════════════════════════════ */
function AiDisclaimer() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      margin: '0 auto 1rem',
      maxWidth: 680,
      padding: '0.6rem 1rem',
      borderRadius: 10,
      background: 'rgba(251,191,36,0.08)',
      border: '1px solid rgba(251,191,36,0.35)',
      fontSize: 13,
      color: '#92400e',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem',
    }}>
      <span style={{ fontSize: 16 }}>🤖</span>
      <div>
        <strong>Disclaimer AI:</strong> Soal dan penjelasan di sini dibuat dengan bantuan AI
        (Claude.ai + ChatGPT) berdasarkan materi TM 1–7 Semester 1 Angkatan 2026
        (Kelas A · B · C · D), sesuai dosen pengampu.{' '}
        <button
          onClick={() => setOpen(o => !o)}
          style={{ background: 'none', border: 'none', color: '#b45309', fontWeight: 700,
            cursor: 'pointer', textDecoration: 'underline', fontSize: 13 }}
        >
          {open ? 'Tutup ▲' : 'Baca selengkapnya ▼'}
        </button>
        {open && (
          <p style={{ margin: '0.4rem 0 0', lineHeight: 1.55 }}>
            Soal-soal ini merupakan bahan latihan mandiri, <em>bukan</em> soal UTS resmi.
            Penjelasan bersumber dari gabungan Claude.ai dan ChatGPT — validasi ulang
            dengan materi & catatan dari dosen pengampumu. Jika ada soal yang kurang tepat,
            laporkan melalui fitur saran website.
          </p>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   KONFIGURASI MATA PELAJARAN
══════════════════════════════════════════════════════════════ */
const SUBJECTS_ENG = [
  {
    key: 'eng',
    icon: '🇬🇧',
    name: 'Bahasa Inggris',
    abbr: 'ENG',
    available: true,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)',
    desc: 'Grammar · Vocabulary · Reading — Agronursing/Keperawatan UNEJ',
    materiLabel: '📖 Materi Belajar',
    materiUrl: '/materi-inggris',   // Link ke halaman BahasaInggrisMateri
  },
];

/* ══════════════════════════════════════════════════════════════
   KONFIGURASI TIPE SOAL
══════════════════════════════════════════════════════════════ */
const QUIZ_TYPES_ENG = [
  {
    key: 'grammar',
    icon: '✍️',
    label: 'Grammar',
    soalCount: 50,
    desc: '50 soal tata bahasa: Subject-Verb Agreement, Tenses, Modal Verbs, Conditional, Passive Voice, dan lainnya.',
    typeClass: 'qz-type-grammar',
    badgeBg: 'rgba(59,130,246,0.10)',
    badgeBorder: 'rgba(59,130,246,0.35)',
    badgeColor: '#60a5fa',
    badgeLabel: '✍️ GRAMMAR',
  },
  {
    key: 'vocabulary',
    icon: '📖',
    label: 'Vocabulary',
    soalCount: 50,
    desc: '50 soal kosakata: Campus Life, Technology, Environment, Nursing & Agronursing terminology.',
    typeClass: 'qz-type-vocab',
    badgeBg: 'rgba(16,185,129,0.10)',
    badgeBorder: 'rgba(16,185,129,0.35)',
    badgeColor: '#34d399',
    badgeLabel: '📖 VOCAB',
  },
  {
    key: 'reading',
    icon: '📚',
    label: 'Reading',
    soalCount: 50,
    desc: '50 soal pemahaman bacaan: short text, long text, main idea, detail, vocabulary in context, dan inference.',
    typeClass: 'qz-type-reading',
    badgeBg: 'rgba(139,92,246,0.10)',
    badgeBorder: 'rgba(139,92,246,0.35)',
    badgeColor: '#a78bfa',
    badgeLabel: '📚 READING',
  },
  {
    key: 'semua',
    icon: '🗂️',
    label: 'Semua Materi',
    soalCount: 150,
    desc: '150 soal lengkap: Grammar + Vocabulary + Reading. Cocok untuk latihan menyeluruh sebelum UTS.',
    typeClass: 'qz-type-learn',
    badgeBg: 'rgba(251,191,36,0.10)',
    badgeBorder: 'rgba(251,191,36,0.35)',
    badgeColor: '#fbbf24',
    badgeLabel: '🗂️ SEMUA',
  },
  {
    key: 'uts',
    icon: '✏️',
    label: 'Simulasi UTS',
    soalCount: 50,
    desc: '50 soal simulasi UTS versi sulit: Grammar lanjutan, Vocabulary kontekstual, dan Reading panjang. Target: 60 menit.',
    typeClass: 'qz-type-practice',
    badgeBg: 'rgba(239,68,68,0.10)',
    badgeBorder: 'rgba(239,68,68,0.35)',
    badgeColor: '#f87171',
    badgeLabel: '⏱️ SIMULASI UTS',
  },
];

/* ══════════════════════════════════════════════════════════════
   QUESTION GETTER — mapping soal per tipe
══════════════════════════════════════════════════════════════ */
const getEngQuestions = (subject, type) => {
  try {
    const mapQ = (q, offset = 0) => ({
      ...q,
      id: q.id + offset,
      correct: q.correctIndex,
    });

    switch (type) {
      case 'grammar':
        return grammarQuestions.map(q => mapQ(q));

      case 'vocabulary':
        // Re-number vocabulary 1–50 for display inside quiz
        return vocabularyQuestions.map((q, i) => ({ ...mapQ(q), id: i + 1 }));

      case 'reading':
        return readingQuestions.map((q, i) => ({ ...mapQ(q), id: i + 1 }));

      case 'semua': {
        const g = grammarQuestions.map((q, i) => ({ ...mapQ(q), id: i + 1,   tag: 'Grammar' }));
        const v = vocabularyQuestions.map((q, i) => ({ ...mapQ(q), id: i + 51,  tag: 'Vocabulary' }));
        const r = readingQuestions.map((q, i) => ({ ...mapQ(q), id: i + 101, tag: 'Reading' }));
        return [...g, ...v, ...r];
      }

      case 'uts':
        return utsQuestions.map(q => mapQ(q));

      default:
        return grammarQuestions.map(q => mapQ(q));
    }
  } catch {
    return [];
  }
};

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════════════════════ */
export default function BahasaInggrisQuiz() {
  return (
    <>
      <AiDisclaimer />
      <QuizEngine
        subjects={SUBJECTS_ENG}
        quizTypes={QUIZ_TYPES_ENG}
        storagePrefix="qeng"
        questionGetter={getEngQuestions}
      />
    </>
  );
}