// src/pages/quiziz/QuizBahasaInggris.jsx
// ─────────────────────────────────────────────────────────────
// Halaman matkul Bahasa Inggris: grid TM -> (materi opsional) -> QuizEngine.
// Pola di file ini adalah TEMPLATE ACUAN untuk 7 matkul lain — jangan diubah
// tata letaknya di matkul lain, cukup diganti data & nama matkulnya.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from '@/lib/authCompat';
import { getFirestore, doc, getDoc } from '@/lib/firestoreCompat';

import TMPicker from '../../components/quiz/TMPicker';
import QuizEngine from '../../components/quiz/QuizEngine';
import QuizShell from '../../components/quiz/QuizShell';
import { availableTM } from '../../data/quiziz/bahasaInggris/manifest';
import { soalBelajar } from '../../data/quiziz/bahasaInggris/tm01/soal-belajar';
import { soalLatihan } from '../../data/quiziz/bahasaInggris/tm01/soal-latihan';
import '../../styles/quizGlass.css';

/* ── Pemetaan TM 1–16 Bahasa Inggris. TM 1 = UAS (bukan TM 8 seperti
      konvensi lama/default TMPicker) — lihat CHANGELOG untuk alasan.
      `tmInfo` HANYA diisi untuk TM 1 karena cuma itu yang datanya
      benar-benar ada di project (materi.js + soal-belajar.js +
      soal-latihan.js); TM lain sengaja dibiarkan tanpa info supaya
      tidak mengarang materi yang belum dibuat. ── */
const BI_MILESTONES = { 1: 'UAS' };
const BI_TM_INFO = {
  1: {
    title: 'Grammar, Vocabulary & Reading',
    desc: 'Tenses, Modal Verbs, Subject-Verb Agreement, Conditional & Passive Voice, Vocabulary Campus/Tech/Environment, plus latihan Reading Comprehension — materi UAS.',
  },
};

/* ── Dulu instance Firebase 'quiz' kedua; sekarang cukup satu koneksi
      Supabase yang sama dipakai di mana-mana (lihat lib/authCompat.js
      dan lib/firestoreCompat.js). ── */
const quizAuth = getAuth();
const quizDb   = getFirestore();

/** Cek apakah user yang login sudah pernah submit skor ke tipe "100 soal"
 *  TM ini — dipakai untuk membuka gembok tipe "50 soal". */
function useHasCompleted100(lbKeyPrefix) {
  const [status, setStatus] = useState('checking'); // checking | loggedout | locked | unlocked
  useEffect(() => {
    const unsub = onAuthStateChanged(quizAuth, async (u) => {
      if (!u) { setStatus('loggedout'); return; }
      try {
        const snap = await getDoc(doc(quizDb, `lb_${lbKeyPrefix}_p100`, u.uid));
        setStatus(snap.exists() ? 'unlocked' : 'locked');
      } catch {
        setStatus('locked');
      }
    });
    return unsub;
  }, [lbKeyPrefix]);
  return status;
}

/* ══════════════════════════════════════════════════════════════
   DISCLAIMER AI (dipakai di semua halaman matkul)
══════════════════════════════════════════════════════════════ */
export function AiDisclaimer() {
  const [open, setOpen] = useState(false);
  return (
    <div className="qz-disclaimer">
      <span className="qz-dc-icon">🤖</span>
      <div>
        <h4 style={{ display: 'inline', marginRight: 4 }}>Disclaimer AI:</h4>
        <span>
          Semua soal, penjelasan, dan penyusunan materi di sini
          dibuat dengan bantuan AI, sesuai PPT Kelas D &amp; Jadwal Kelas D/Ns Leo.{' '}
        </span>
        <button onClick={() => setOpen(o => !o)}>
          {open ? 'Tutup ▲' : 'Baca selengkapnya ▼'}
        </button>
        {open && (
          <p style={{ margin: '0.5rem 0 0', lineHeight: 1.55 }}>
            Soal-soal ini merupakan bahan latihan mandiri, <em>bukan</em> soal resmi dari dosen.
            Validasi ulang dengan materi & catatan dosen pengampumu. Ada soal yang kurang tepat?
            Laporkan lewat fitur saran di halaman Quiziz.
          </p>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const mapQ = (q) => ({ ...q, correct: q.correctIndex });

/* ══════════════════════════════════════════════════════════════
   KONFIGURASI TM 1 — template buat TM lain nanti
══════════════════════════════════════════════════════════════ */
const LB_KEY_PREFIX = 'bahasaInggris_tm01'; // -> koleksi lb_bahasaInggris_tm01_p100 / _l50

const SUBJECTS_TM01 = [
  {
    key: LB_KEY_PREFIX,
    icon: '🇬🇧',
    name: 'Bahasa Inggris — TM 1 (UAS)',
    abbr: 'ENG · UAS',
    available: true,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)',
    desc: 'Grammar & Vocabulary (Bahan Belajar) + simulasi UAS (Latihan Serius)',
  },
];

const getQuestionsTM01 = (subject, type) => {
  try {
    if (type === '100') {
      return shuffle(soalBelajar.map(mapQ)).map((q, i) => ({ ...q, id: i + 1 }));
    }
    if (type === '50') {
      return shuffle(soalLatihan.map(mapQ)).map((q, i) => ({ ...q, id: i + 1 }));
    }
    return [];
  } catch {
    return [];
  }
};

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════════════════════ */
export default function QuizBahasaInggris() {
  const navigate = useNavigate();
  const [tm, setTm] = useState(null);
  const lockStatus = useHasCompleted100(LB_KEY_PREFIX);

  const quizTypes = [
    {
      key: '100', icon: '📖', label: 'Bahan Belajar', soalCount: 100,
      desc: 'Gabungan 100 soal Grammar & Vocabulary — kerjakan ini dulu untuk belajar materinya.',
      typeClass: 'qz-type-learn',
      badgeBg: 'rgba(94,234,212,0.10)', badgeBorder: 'rgba(94,234,212,0.35)', badgeColor: '#5eead4',
      badgeLabel: '📖 BELAJAR',
    },
    {
      key: '50', icon: '⏱️', label: 'Latihan Serius', soalCount: 50,
      desc: '50 soal simulasi UAS versi sulit. Target waktu 60 menit di Timed Mode.',
      typeClass: 'qz-type-practice',
      badgeBg: 'rgba(251,191,36,0.10)', badgeBorder: 'rgba(251,191,36,0.35)', badgeColor: '#fbbf24',
      badgeLabel: '⏱️ LATIHAN',
      locked: lockStatus !== 'unlocked',
      lockedMsg: lockStatus === 'loggedout'
        ? 'Login dulu, lalu selesaikan "Bahan Belajar" untuk membuka ini.'
        : 'Selesaikan "Bahan Belajar" (100 soal) dulu untuk membuka ini.',
    },
  ];

  if (tm === null) {
    return (
      <QuizShell>
        <AiDisclaimer />
        <TMPicker
          subjectName="Bahasa Inggris"
          subjectSlug="bahasaInggris"
          availableTM={availableTM}
          onSelectTM={setTm}
          milestones={BI_MILESTONES}
          tmInfo={BI_TM_INFO}
        />
      </QuizShell>
    );
  }

  // Untuk rombak ini cuma TM 1 yang punya isi; TM lain belum availableTM jadi tidak akan sampai sini.
  // Catatan: layar ini SENGAJA tidak dibungkus QuizShell/navbar — QuizEngine di bawah sudah
  // punya sticky header & ambient background sendiri yang sudah bagus, menumpuk navbar lagi
  // di atasnya berisiko bentrok/menutupi. Tombol di atas tetap dipercantik pakai token glass.
  return (
    <div className="qz-app" style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <button className="qz-btn qz-btn-ghost qz-btn-sm" onClick={() => setTm(null)}>
          ← Kembali ke daftar TM
        </button>
        <button className="qz-btn qz-btn-glass qz-btn-sm" onClick={() => navigate('/quiziz/bahasainggris/materi')}>
          📖 Pelajari Materi
        </button>
      </div>
      <AiDisclaimer />
      <QuizEngine
        subjects={SUBJECTS_TM01}
        quizTypes={quizTypes}
        storagePrefix="qz_bi_tm01"
        questionGetter={getQuestionsTM01}
      />
    </div>
  );
}
