# Quiziz v2 — task.md (pelacak fase)

Acuan: "Prompt Master v2 — Rombak Quiziz + Leo AI". Dikerjakan langsung di `main` atas permintaan owner (tanpa branch baru). Dokumen ini diperbarui setiap selesai satu langkah supaya posisi step selalu jelas.

## Posisi sekarang

**Fase 0 selesai ringkas, Fase 1 selesai, Fase 2 sebagian (chat Leo di depan beranda), Fase 5 sebagian (Leo di beranda).** Fase 3, 4, dan 6 belum dikerjakan. Langkah berikutnya: Fase 2 penuh.

| Fase | Isi | Status |
| --- | --- | --- |
| 0 | Audit, task.md, peta rute | Selesai ringkas. Screenshot kondisi sebelum Fase 1 (commit `1c193be`, chat sudah ada di depan) ada di `screenshots/before/`; `design-notes.md` belum dibuat. |
| 1 | Fondasi: token ter-scope, registry/adapter matkul, kompatibilitas rute, shell tunggal | **Selesai** (rincian di bawah). |
| 2 | Beranda, katalog, workspace matkul, command palette | Sebagian: chat Leo jadi blok paling atas `/quiziz`. Belum: katalog baris dengan status jujur, "Lanjutkan", workspace matkul, command palette, tombol cari dan akun di top bar. |
| 3 | Reader semua materi, deep link, resume | Belum |
| 4 | Persiapan, pengerjaan, hasil/review, login/kuesioner/UAS/multiplayer | Belum |
| 5 | Leo: Pico, otak, navigasi, integrasi kuis | Sebagian: Pico 2D jadi wajah Leo di beranda, konteks katalog nyata, chip tautan dari katalog. Belum: identitas/system prompt baru, gaya Nyablak/Santai/Serius, registry aksi penuh, Leo di kuis dan review. |
| 6 | QA, aksesibilitas, performa, laporan akhir | Belum |

## Langkah 1: chat Leo di depan Quiziz (commit `1c193be`)

`LeoHomeChat` (chat inline di atas beranda, tiga pertanyaan pembuka, cooldown, error jelas), katalog untuk Leo, dan konteks `halaman: 'beranda'` di `api/leo-chat.js`. Chip tautan dibuat dari pesan pengguna + katalog, tidak dari teks model. Pico `force2D` supaya three.js tidak dimuat.

## Langkah 2: Fase 1, fondasi

- **Registry matkul tunggal** `src/data/quiziz/registry.js`: adapter di atas `materi/registry.js` + manifest latsol, status dibaca dari kode (bukan salinan). Urutan tetap. Dipakai beranda (`Quiziz.jsx`) dan Leo (`leoHome.js`). Nama dan ikon 8 matkul identik dengan daftar lama (diverifikasi).
- **Peta rute** `src/data/quiziz/routes.js` (murni, tanpa fitur Vite): path, `NAV_ITEMS`, dan `activeNav()`. Semua URL lama tetap valid; tidak ada rute baru.
- **Pengecek rute** `npm run check:quiziz` (`scripts/check-quiziz-routes.mjs`): setiap path registry/navigasi harus ada sebagai `<Route>` di `App.jsx`, dan item aktif harus konsisten. Diuji negatif (menghapus satu rute membuatnya gagal).
- **Shell tunggal** `QuizShell` (nama file dipertahankan, 13 halaman pemakainya tidak diubah): top bar (logo, Beranda · Materi · Latsol · UAS, website utama, tema) dan tab bar bawah di mobile (≤ 760px) yang menggantikan hamburger. `variant="focus"` = header ramping tanpa navigasi, sudah dipakai `QuizMasuk` dan `QuizKuesioner`.
- **Token ter-scope**: `src/styles/quizShell.css`, token `--qz-*` hanya di bawah `[data-area='quiziz']` (dipasang shell). Tombol tema distyling sendiri karena `dashboard.css` tidak dimuat di Quiziz.
- **Error boundary per halaman** + `ErrorState`: halaman yang gagal dirender tidak menjatuhkan top bar dan tab bar; ada tombol "Coba lagi".
- Dihapus: `QuizNavbar.jsx` dan CSS `.qzn-*` (tidak ada pemakai lain). Wadah konten shell kini `<div>`, bukan `<main>` bersarang (landmark `<main id="main">` ada di `App.jsx`).
- Perbaikan kecil: hitungan "siap dikerjakan" di `?view=quiz` kini dihitung dari data (sebelumnya selalu 8, padahal latsol baru ada di Bahasa Inggris TM 1). Chip pembuka Leo di mobile jadi satu baris yang bisa digeser.

### Peta rute dan item aktif

| URL (semua lama, tidak berubah) | Item aktif |
| --- | --- |
| `/quiziz` | Beranda |
| `/quiziz?view=quiz`, `/quiziz/<slug>` | Latsol |
| `/quiziz/materi`, `/quiziz/<slug>/materi`, `/quiziz/<slug>/praktikum` | Materi |
| `/quizizuas` | UAS |
| `/quiziz/masuk`, `/quiziz/kuesioner` | tidak ada (header focus) |

## Keputusan

- Chat dipasang inline di atas atas permintaan owner. Prompt master awalnya menaruh Leo sebagai pendamping; penataan akhir beranda diputuskan di Fase 2.
- Shell tetap dibungkus per halaman (bukan layout route) karena beberapa halaman berganti antara layar pemilihan (pakai shell) dan engine (chrome sendiri) di dalam satu rute.
- Search (⌘K) dan akun belum dipasang di top bar: keduanya bergantung pada command palette dan keputusan UX akun (Fase 2), dan tombol mati lebih buruk daripada tidak ada tombol.
- Push langsung ke `main` atas izin eksplisit owner (default prompt master: branch kerja).

## Verifikasi

- `npm run build` lolos. Seluruh app: JS +0,45 KB gzip, CSS +0,28 KB gzip (chunk `QuizShell` +1,1 KB JS dan +1,1 KB CSS raw; `Quiziz` -0,7 KB). Tidak ada referensi `Mascot3D` di chunk Quiziz.
- `npm run lint`: 103 masalah sebelum dan sesudah (92 error + 11 warning lama); semua file baru/diubah bersih.
- `npm run check:quiziz`: 22 path diperiksa terhadap 75 rute, semua valid.
- Tes perilaku sementara (jsdom, `fetch` dan Supabase tiruan, tidak di-commit): 24 pemeriksaan lolos: item aktif untuk 9 URL lama (top bar dan tab bar sepakat), urutan dan URL navigasi, landmark `nav` berlabel unik, tidak ada `<main>` bersarang, varian focus, error boundary + "Coba lagi", dan regresi Leo.
- Screenshot nyata (Chromium headless, `screenshots/before` dan `screenshots/after`): beranda, latsol, materi, TM, UAS, login, halaman galat, percakapan Leo, fokus keyboard; desktop 1440 dan mobile 390, tema gelap dan terang. Tidak ada galat halaman dan tidak ada overflow horizontal. Catatan: ini render lewat harness (Supabase ditiru; font dan ikon dari paket npm), bukan situs live.
- **Belum teruji live**: Leo dengan Gemini dan login Supabase sungguhan, serta perangkat nyata (iOS/Android).

## Catatan untuk Fase 2 dan seterusnya

- Kartu matkul di `?view=quiz` masih bertuliskan "Mulai latihan" untuk semua matkul padahal latsol baru ada di Bahasa Inggris TM 1; butuh status chip jujur (Tersedia, Sebagian, Segera hadir) dari registry.
- Beberapa halaman masih punya tombol "Kembali" sendiri yang menduplikasi navigasi shell; rapikan saat katalog dan workspace dibangun.
- `QuizEngine`, `MateriBahasaInggris`, dan reader materi masih memakai header sendiri; pindah ke shell (variant focus) di Fase 3-4.
- Padding `safe-area-inset-bottom` di tab bar baru berefek kalau meta viewport di `index.html` memakai `viewport-fit=cover`. Belum diubah karena berdampak ke seluruh situs; keputusan owner.
- Tombol "Website utama" di mobile hanya ikon globe (berlabel aksesibel dan `title`).

## Fakta data (dibaca dari kode)

- Latsol tersedia: hanya Bahasa Inggris TM 1. IBD, KDK, Kesglob, Komdas, PAI, Pancasila belum; FTK belum punya latsol terpisah.
- Materi: Bahasa Inggris, Komdas (13 bab), IBD (14), Kesglob (16), KDK (9), FTK (17). Praktikum: Komdas (5 modul), IBD (19). PAI dan Pancasila belum punya materi.
- Quiziz UAS belum tersedia.
