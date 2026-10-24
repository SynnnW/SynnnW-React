# Changelog Rombak Quiziz

Ringkasan apa yang beneran dikerjakan di zip ini. Baca ini dulu sebelum lanjut ke prompt per-matkul lainnya.

## ✅ Yang sudah jadi & jalan

**Bahasa Inggris — TM 1 (contoh acuan, lengkap)**
- `data/quiziz/bahasaInggris/manifest.js`, `tm01/{materi.js, soal-belajar.js (100), soal-latihan.js (50), reading-examples.js}`
- `pages/quiziz/QuizBahasaInggris.jsx` — grid TM → materi/quiz, kunci 50-soal sampai 100-soal selesai
- `pages/quiziz/MateriBahasaInggris.jsx` — materi + 50 contoh latihan reading dikelompokkan per teks
- Soal 100 = gabungan bank Grammar(50)+Vocabulary(50) lama. Soal 50 = bank UTS(50) lama. Reading(50) lama dipindah jadi contoh latihan di halaman materi, bukan quiz bernilai.

**7 matkul lain (PAI, KDK, Pancasila, Kesglob, IBD, Komdas)**
- Halaman kosong (`pages/quiziz/Quiz<Nama>.jsx`) — grid TM, semua "Coming Soon", siap diisi begitu TM pertama dibuat ikut pola Bahasa Inggris persis.

**FTK — beda sendiri, per BAB bukan per TM**
- `data/quiziz/ftk/manifest.js` → `chapters: []` (masih kosong — BELUM ADA buku/PPT FTK yang diupload)
- `components/quiz/ChapterPicker.jsx`, `components/NovelReader.jsx` (reader ala novel browser), `pages/quiziz/QuizFTK.jsx`
- Begitu buku/PPT FTK diupload: buat folder `data/quiziz/ftk/bab01/` dst (materi.js + soal-belajar.js + soal-latihan.js), tambah entrinya ke `chapters` di manifest.js — halamannya sudah otomatis jalan, nggak perlu ubah kode lain.

**Landing pages**
- `/quiziz` (Latsol Mingguan) dan `/quizizuas` (prototype UAS, placeholder) — sesuai urutan elemen yang diminta, disclaimer, komentar, saran→QRIS.

**QuizEngine.jsx (4+1 perubahan, generik buat semua matkul)**
- Timed mode: 100 menit utk 100 soal, 60 menit utk 50 soal (dulu selalu 100 menit)
- Checkpoint pengulangan: 90% (dulu 85%)
- Gerbang "Cara Penggunaan" wajib discroll sekali, diingat per perangkat
- Statistik pengulangan terpisah di layar hasil
- Dukungan kartu tipe soal "locked" (dipakai buat kunci 50-soal)

**SaranWebsite.jsx** — tombol pasca-submit sekarang buka QRIS (modal fullscreen), bukan link langsung ke trakteer.id.

**Prompt generator per matkul** — `data/quiziz/<slug>/generate-soal.prompt.js` (8 file), isinya prompt siap pakai yang kamu kasih (100 soal full-PPT studi kasus + pembahasan + jawaban diacak & seimbang, dan 50 soal gaya soal ujian asli).

**Admin on/off toggle** — login dengan `aldokraksaan@gmail.com` di halaman manapun yang pakai TMPicker/ChapterPicker, muncul mode admin buat nyala/matiin TM atau bab yang sudah ada kontennya langsung dari UI (Firestore `quizToggles/<slug>`, field `off`), tanpa minta AI edit kode.

## ⚠️ Perbaikan penting

`QuizizRoom.jsx` (multiplayer) dan default config `QuizEngine.jsx` ternyata masih butuh `100soal.js`, `bi-grammar.js`, `bi-vocabulary.js`, `bi-reading.js` yang lama — sempat kehapus, sudah **dikembalikan** supaya multiplayer tetap jalan seperti semula. `bi-uts.js` dan `bahasa-inggris.js` aman dihapus (sudah tidak dipakai di mana pun).

## 🧪 Validasi

Semua file baru/diedit sudah dicek sintaks + resolusi import-nya satu per satu pakai esbuild (termasuk bundling penuh `App.jsx`). Belum pernah dites jalan beneran di `npm run dev` / browser asli — sebelum dipakai, jalankan `npm install && npm run dev` dan cek alur di atas secara manual (terutama kunci 50-soal, gerbang cara penggunaan, dan toggle admin, karena ketiganya fitur baru).

## 📋 Belum dikerjakan

- Isi TM 2–7 & 9–16 Bahasa Inggris, dan semua TM 7 matkul lain → pakai `generate-soal.prompt.js` masing-masing + materi/PPT terkait
- Isi bab-bab FTK → butuh buku/PPT FTK diupload dulu
- UAS beneran (sekarang masih placeholder murni)
