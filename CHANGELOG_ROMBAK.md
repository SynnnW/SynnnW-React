# Changelog Rombak Quiziz

Ringkasan apa yang beneran dikerjakan di zip ini. Baca ini dulu sebelum lanjut ke prompt per-matkul lainnya.

## 🆕 UPDATE TERBARU (baca ini dulu, bagian di bawahnya agak basi)

Zip ini = hasil AI lain (glassmorphism) yang sudah DIAUDIT & DIPERBAIKI:
1. **Lag di HP**: `.tmp-card`/`.cp-card`/`.qlz-card` (render 8-16 sekaligus) masing-masing pakai `backdrop-filter blur(22px)` + 2 pseudo-element — itu sumber lag-nya. Sudah dicabut blur per-kartunya (diganti `--qzg-glass-flat`, tanpa blur) + `contain: layout paint`. Blur tetap aman dipakai di elemen singular (navbar/modal/admin-bar/disclaimer).
2. **Regresi TM1→TM8**: zip referensi masih bawa label lama "TM 1 (UAS)" dari sebelum dikoreksi di sesi ini. Sudah dibenerin lagi: folder data, manifest, label, kunci leaderboard, storagePrefix — semua balik ke TM 8 (UTS).
3. Lint empty-catch yang kebawa balik → diperbaiki lagi.
4. Nambah paragraf pembuka + stat chip di `Quiziz.jsx` & `QuizizUAS.jsx`.

Divalidasi `npm install` + `npx vite build` (0 error) + `eslint` (bersih, kecuali pre-existing).

## 🆕 UPDATE TERBARU #2 — disclaimer dihapus, TM jadi angka, buku FTK nyata

1. **Disclaimer kuning dihapus total** — semua `<AiDisclaimer />` & blok `.qz-disclaimer` di landing, 7 halaman matkul, dan layar pemilihan matkul di `QuizEngine.jsx` (komponen `AiDisclaimer` juga dihapus karena sudah tidak dipakai).
2. **"TM" diganti angka polos di seluruh Quiziz** — `TMPicker.jsx` sekarang cuma nampilin nomor besar (01, 02, dst) + badge UTS/UAS kalau ada, tanpa kata "TM" sama sekali. Label internal materi Bahasa Inggris yang tadinya "TM 1–7" diganti "Pekan 1–7" biar nggak rancu sama nomor TM di sistem baru (ini sumber kebingungan yang kamu maksud).
3. **Buku FTK beneran, bukan placeholder lagi** — 6 bab dari docx yang diupload (isinya falsafah & teori keperawatan beneran, walau nama file docx-nya salah ketik "Konsep Dasar Keperawatan" — ikut isi aslinya, bukan nama filenya). Tiap bab: judul, sub-judul, paragraf, daftar capaian pembelajaran, ringkasan, dan latihan soal — diekstrak APA ADANYA dari buku (nggak ada yang ditambah/dikarang). `NovelReader.jsx` dirombak total: dukung heading/paragraf/list, ringkasan di akhir bab, dan latihan soal yang bisa diklik ABCDE.
   - ⚠️ **Buku sumbernya nggak punya kunci jawaban** (nggak ada bold/underline penanda, nggak ada bagian "Kunci Jawaban") — `correctIndex` di tiap soal sengaja `null`, bukan ditebak. Sekarang soal tetap bisa diklik tapi ditandai "belum ada kunci jawaban, latihan refleksi" bukan quiz bernilai. Begitu kuncinya ada, tinggal isi `correctIndex` (0=A..4=E) di `data/quiziz/ftk/bab0X/soal.js`.
   - FTK juga TIDAK lagi lewat QuizEngine 100/50 soal — bukunya memang nggak berbentuk begitu (±13 soal review/bab), jadi nggak dipaksain ke pola itu.

## 📖 Dibaca & dianalisis (belum dieksekusi — scope-nya gede, dikerjain bertahap)

Baca semua referensi yang dikirim: 5 `DESIGN.md` (Notion/Linear/AuthKit/Duolingo/Cards Against Humanity), 5 gambar (styleguide flat, navbar rail+drawer, materi WNI Simulator bergaya FAQ bernomor, screenshot quiz Kahoot-style di Android), link GSAP/Anime.js buat animasi. Kesimpulannya: arahnya PIVOT dari glass ke flat/bold/berwarna (kartu warna solid, border tegas, angka besar, bukan blur). Belum dieksekusi di zip ini. Rencana lanjutan: token desain flat+dual-tema (terang/gelap), navbar+toggle matiin efek, animasi, halaman profil (Google-only, nyimpen progres sekali), componentize login card, Cloudee di semua halaman Quiziz + dialog khusus pas pencet UAS.

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
