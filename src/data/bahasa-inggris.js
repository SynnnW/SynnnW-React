// src/data/bahasa-inggris.js
// ─────────────────────────────────────────────────────────────
// SOAL BAHASA INGGRIS — Agronursing/Keperawatan UNEJ 2026
// Kelas A · B · C · D | Semester 1 Angkatan 2026
//
// 🤖 Soal dan penjelasan dibuat dengan bantuan AI
//    (Claude.ai + ChatGPT) dan belum divalidasi secara resmi.
//    Jadikan sebagai bahan latihan, bukan acuan tunggal.
// ─────────────────────────────────────────────────────────────

export { grammarQuestions }    from './bi-grammar';
export { vocabularyQuestions } from './bi-vocabulary';
export { readingQuestions }    from './bi-reading';
export { utsQuestions }        from './bi-uts';

// Gabungan 150 soal latihan (Grammar + Vocabulary + Reading)
import { grammarQuestions }    from './bi-grammar';
import { vocabularyQuestions } from './bi-vocabulary';
import { readingQuestions }    from './bi-reading';

export const questions150 = [
  ...grammarQuestions.map((q, i) => ({ ...q, id: i + 1,   kategori: 'Grammar'    })),
  ...vocabularyQuestions.map((q, i) => ({ ...q, id: i + 51,  kategori: 'Vocabulary' })),
  ...readingQuestions.map((q, i) => ({ ...q, id: i + 101, kategori: 'Reading'     })),
];