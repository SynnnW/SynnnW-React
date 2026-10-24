// src/data/quiziz/bahasaInggris/tm01/materi.js
// Metadata topik materi TM 1 Bahasa Inggris — dipakai sidebar navigasi di
// halaman materi (lihat pages/quiziz/MateriBahasaInggris.jsx). Isi/penjelasan
// tiap topik masih dirender lewat komponen Topic*() di halaman materi itu
// sendiri (Accordion/ExampleBox/dll.) karena formatnya kaya JSX; di sini
// hanya daftar kategori + topik yang jadi acuan menu & urutan belajar.
//
// Field `tm` di tiap topik itu LABEL LAMA (riwayat dari rentang TM 1–7 versi
// sebelum sistem 16-TM ini ada) — bukan nomor TM baru, cuma dipertahankan
// apa adanya supaya sidebar materi tidak perlu diubah. Semua topik di bawah
// ini tetap satu kesatuan "TM 1" di sistem baru 16-TM.

export const topics = [
  {
    category: 'GRAMMAR', icon: '✍️', color: '#8b5cf6',
    topics: [
      { id: 'tenses',      label: 'Tenses',                    tm: 'TM 1' },
      { id: 'verbforms',   label: 'Verb Forms V1–V5',          tm: 'TM 1' },
      { id: 'modal',       label: 'Modal Verbs',               tm: 'TM 2' },
      { id: 'sva',         label: 'Subject-Verb Agreement',    tm: 'TM 2' },
      { id: 'conditional', label: 'Conditional Sentences',     tm: 'TM 3' },
      { id: 'passive',     label: 'Passive Voice',             tm: 'TM 3' },
      { id: 'gerund',      label: 'Gerund vs Infinitive',      tm: 'TM 4' },
      { id: 'relative',    label: 'Relative Pronouns',         tm: 'TM 4' },
      { id: 'subjunctive', label: 'Subjunctive Mood',          tm: 'TM 5' },
      { id: 'comparative', label: 'Comparative Structures',    tm: 'TM 5' },
      { id: 'preposition', label: 'Prepositions & Fixed Exp.', tm: 'TM 6' },
    ],
  },
  {
    category: 'VOCABULARY', icon: '📖', color: '#10b981',
    topics: [
      { id: 'vocab-campus',  label: 'Campus Life',                      tm: 'TM 1' },
      { id: 'vocab-tech',    label: 'Technology & Digital World',       tm: 'TM 2' },
      { id: 'vocab-env',     label: 'Environment & Sustainable Living', tm: 'TM 3' },
      { id: 'vocab-nursing', label: 'Nursing / Agronursing',            tm: 'TM 4–7' },
    ],
  },
  {
    category: 'READING', icon: '📚', color: '#a78bfa',
    topics: [
      { id: 'reading-short', label: 'Short Text Strategy',        tm: 'TM 6' },
      { id: 'reading-long',  label: 'Long Text Strategy',         tm: 'TM 7' },
      { id: 'reading-dina',  label: 'Contoh Long Text & Analisis',tm: 'TM 7' },
      { id: 'reading-practice', label: 'Latihan Membaca (50 Contoh Soal)', tm: 'TM 6–7' },
    ],
  },
];

export { readingExamples } from './reading-examples.js';
