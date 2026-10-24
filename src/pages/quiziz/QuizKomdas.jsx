// src/pages/quiziz/QuizKomdas.jsx — route: /quiziz/komdas
// Belum ada TM yang diisi untuk Komunikasi Dasar Keperawatan — halaman ini cuma grid TM
// kosong (semua "Coming Soon") sampai soal/materinya dibuat lewat
// data/quiziz/komdas/generate-soal.prompt.js. Pola & tata letaknya
// WAJIB mengikuti QuizBahasaInggris.jsx persis begitu TM pertama siap
// — jangan dibuat ulang dari nol atau ditata beda.
import { useState } from 'react';
import TMPicker from '../../components/quiz/TMPicker';
import QuizShell from '../../components/quiz/QuizShell';
import { AiDisclaimer } from './QuizBahasaInggris';
import { availableTM } from '../../data/quiziz/komdas/manifest';

export default function QuizKomdas() {
  const [tm, setTm] = useState(null);

  return (
    <QuizShell>
      <AiDisclaimer />
      <TMPicker subjectName="Komunikasi Dasar Keperawatan" subjectSlug="komdas" availableTM={availableTM} onSelectTM={setTm} />
      {tm !== null && (
        <p style={{ textAlign: 'center', color: 'var(--qzg-text-dim)', fontSize: 13, marginTop: 16 }}>
          TM {tm} belum ada kontennya.
        </p>
      )}
    </QuizShell>
  );
}
