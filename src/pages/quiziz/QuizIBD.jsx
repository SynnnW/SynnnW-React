// src/pages/quiziz/QuizIBD.jsx — route: /quiziz/ibd
// Belum ada TM yang diisi untuk Ilmu Biomedik Dasar — halaman ini cuma grid TM
// kosong (semua "Coming Soon") sampai soal/materinya dibuat lewat
// data/quiziz/ibd/generate-soal.prompt.js. Pola & tata letaknya
// WAJIB mengikuti QuizBahasaInggris.jsx persis begitu TM pertama siap
// — jangan dibuat ulang dari nol atau ditata beda.
import { useState } from 'react';
import TMPicker from '../../components/quiz/TMPicker';
import QuizShell from '../../components/quiz/QuizShell';
import { AiDisclaimer } from './QuizBahasaInggris';
import { availableTM } from '../../data/quiziz/ibd/manifest';

export default function QuizIBD() {
  const [tm, setTm] = useState(null);

  return (
    <QuizShell>
      <AiDisclaimer />
      <TMPicker subjectName="Ilmu Biomedik Dasar" subjectSlug="ibd" availableTM={availableTM} onSelectTM={setTm} />
      {tm !== null && (
        <p style={{ textAlign: 'center', color: 'var(--qzg-text-dim)', fontSize: 13, marginTop: 16 }}>
          TM {tm} belum ada kontennya.
        </p>
      )}
    </QuizShell>
  );
}
