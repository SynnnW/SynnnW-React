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

export { topics } from './topics.js';

export { readingExamples } from './reading-examples.js';
