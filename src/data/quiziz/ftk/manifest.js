// src/data/quiziz/ftk/manifest.js
// FTK BEDA dari 7 matkul lain: materinya dari buku ners (semua TM sudah
// tercakup di buku itu), jadi dibuka per JUDUL BAB, bukan per TM 1-16.
// Latsol-nya tetap nempel per bab (bukan per TM).
//
// Setiap entri di `chapters` = 1 bab yang sudah ada materi + soalnya.
// Format folder: data/quiziz/ftk/bab01/ berisi materi.js, soal-belajar.js,
// soal-latihan.js — sama persis pola TM matkul lain, cuma namanya "bab"
// bukan "tm".
//
// BELUM ADA BAB YANG DIISI — menunggu buku/PPT FTK diupload supaya
// materi.js & soal-*.js tiap bab bisa dibuat beneran, bukan placeholder.
export const chapters = [
  // { id: 'bab01', title: 'Falsafah Keperawatan: Pengertian & Ruang Lingkup' },
];
