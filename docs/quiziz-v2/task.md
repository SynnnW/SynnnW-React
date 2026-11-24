# Quiziz v2 — task.md (pelacak fase)

Acuan: "Prompt Master v2 — Rombak Quiziz + Leo AI". Dikerjakan langsung di `main` atas permintaan owner (tanpa branch baru). Dokumen ini diperbarui setiap selesai satu langkah supaya posisi step selalu jelas. Atas permintaan owner, pengerjaan tidak lagi menyertakan screenshot: tampilan dicek owner sendiri (checklist di bagian Verifikasi).

## Posisi sekarang

**Fase 0, 1, 2, dan 3 selesai (Fase 2 dan 3 dengan catatan), Fase 5 sebagian.** Fase 4 dan 6 belum dikerjakan. Langkah berikutnya: Fase 4 (persiapan, pengerjaan, hasil/review latsol; login, kuesioner, UAS).

| Fase | Isi | Status |
| --- | --- | --- |
| 0 | Audit, task.md, peta rute | Selesai ringkas. Screenshot Fase 1 di `screenshots/` (tidak lagi mewakili beranda dan reader); `design-notes.md` belum dibuat. |
| 1 | Fondasi: token ter-scope, registry/adapter matkul, kompatibilitas rute, shell tunggal | Selesai. |
| 2 | Beranda, katalog, workspace matkul, command palette | Selesai dengan catatan: menu akun di top bar dan "terakhir dicari" di palette ditunda. |
| 3 | Reader semua materi, deep link, resume | **Selesai dengan catatan.** Perbaikan fungsi dan kenyamanan baca selesai untuk dua reader; perombakan visual `bim-*` dan strip workspace berikut tab di reader belum. |
| 4 | Persiapan, pengerjaan, hasil/review, login/kuesioner/UAS/multiplayer | Belum |
| 5 | Leo: Pico, otak, navigasi, integrasi kuis | Sebagian: Pico 2D di beranda, katalog nyata sebagai konteks, chip tautan, "Tanya Leo" dari palette, Leo di kedua reader dengan konteks bab yang konsisten. Belum: identitas/system prompt baru, gaya Nyablak/Santai/Serius, registry aksi penuh, Leo di kuis dan review. |
| 6 | QA, aksesibilitas, performa, laporan akhir | Belum |

## Langkah 1-3 (ringkas, lihat riwayat commit)

Chat Leo di depan beranda (`1c193be`); Fase 1 fondasi: registry matkul, peta rute, `npm run check:quiziz`, shell tunggal (`6497ba7`); Fase 2: katalog dengan status jujur, filter `?view=`, Lanjutkan, command palette, workspace latsol (`680031b`).

## Langkah 4: Fase 3 (reader)

**3a. Fondasi reader**
- **URL = sumber kebenaran bab.** Deep link kanonis `/quiziz/<slug>/materi/<babId>` dan `/quiziz/<slug>/praktikum/<babId>` (+ `#anchor` subbagian). Satu rute per reader dengan `:babId?` (dashboard dan bab di rute yang sama). Refresh, back/forward, dan tautan yang dibagikan membuka tempat yang benar. `?bab=` (jembatan Fase 2) tetap berlaku sebagai alias dan dialihkan ke bentuk path; bab tidak dikenal kembali ke dashboard.
- **Race diperbaiki di akarnya** (`useBabLoader`): hasil muat disimpan bersama id-nya dan hanya dianggap siap bila cocok dengan bab aktif; hasil terlambat dari bab sebelumnya dibuang. Penyebab lama: judul (state `activeId`) dan isi (state `bab`) diatur terpisah tanpa pembatalan, sehingga isi A bisa muncul di bawah judul B dan Leo menerima campuran keduanya. Leo kini hanya menerima judul dan isi dari bab yang sama.
- **Resume** (`useReadPosition`): bab terakhir dan posisi baca (fraksi tinggi dokumen) disimpan di `quiziz_last_read_v1` (di-throttle saat menggulir, dan saat keluar). Posisi dipulihkan hanya pada kedatangan pertama di bab yang sama (refresh, Lanjutkan, tautan); pindah bab lewat klik mulai dari atas. `#anchor` menang atas posisi tersimpan. Kunci progres lama dipertahankan.
- Registry kini memuat 19 topik Bahasa Inggris (`bahasaInggris/tm01/topics.js`, dipisah dari `materi.js` agar registry tidak ikut memuat `reading-examples.js`), jadi baris katalog menampilkan "Materi · 19 bab" dan palette/Lanjutkan/deep link bekerja untuk Bahasa Inggris.

**3b. Kenyamanan baca (dipakai kedua reader)**
- Toolbar: lokasi (Quiziz › matkul › kategori), **A−/A+** (5 langkah, memakai CSS `zoom`) dan **Fokus** (sembunyikan sidebar); keduanya tersimpan (`quiziz_reader_prefs_v1`).
- Meta bab: sumber dan **waktu baca dari jumlah kata nyata** (≈200 kata/menit). Daftar isi dan **anchor heading** dari heading nyata tingkat atas (muncul hanya bila ≥ 3 heading; id stabil dan unik). Lebar paragraf dibatasi ±72ch.
- Footer bab: **Tandai selesai dengan Batalkan** ("selesai dibaca", bukan "menguasai"), bab sebelumnya/berikutnya sebagai tautan URL kanonis, dan **CTA latsol hanya bila latsol memang ada** (sidebar IBD dst. kini menulis "Latsol mata kuliah ini belum tersedia", bukan tombol Mulai Kuis yang mengarah ke halaman Coming Soon).
- Fokus dipindah ke judul bab saat bab dibuka (pembaca layar), tombol kembali menuju filter Materi (bukan `navigate(-1)`), error muat bab punya "coba lagi".

**3c. Reader Bahasa Inggris** (`MateriBahasaInggris.jsx`, komponen utama ditulis ulang; isi topik tidak diubah)
- Topik digerakkan URL (sebelumnya state lokal tanpa URL). **Membuka topik tidak lagi otomatis menandainya selesai** (sebelumnya `selectTopic` langsung menandai); penanda hanya lewat tombol, bisa dibatalkan. Penanda lama (hasil perilaku lama) tidak bisa dibedakan dan dibiarkan.
- Leo terpasang seperti di reader lain. Isi topik berupa JSX (bukan data), jadi teksnya dibaca dari kartu topik yang sudah dirender (bukan seluruh halaman), dipotong 14.000 karakter, dan diikat ke id topik.

### Peta rute dan item aktif

| URL (semua lama tetap valid; yang baru hanya deep link) | Item aktif |
| --- | --- |
| `/quiziz` | Beranda |
| `/quiziz?view=quiz`, `/quiziz/<slug>` | Latsol |
| `/quiziz?view=materi`, `/quiziz?view=praktikum`, `/quiziz/materi` (alias, dialihkan) | Materi |
| `/quiziz/<slug>/materi`, `/quiziz/<slug>/praktikum` (dashboard reader) | Materi |
| **baru** `/quiziz/<slug>/materi/<babId>`, `/quiziz/<slug>/praktikum/<babId>` (+ `#anchor`); `?bab=<id>` = alias lama | Materi |
| `/quizizuas` | UAS |
| `/quiziz/masuk`, `/quiziz/kuesioner` | tidak ada (header focus, tanpa cari) |

## Keputusan

- Dashboard dan deep link satu rute (`:babId?`) agar reader tidak dipasang ulang saat berpindah bab dan state UI (pencarian, sorotan) bertahan.
- Pemuat bab menyimpan hasil per id (bukan sekadar membatalkan permintaan) karena `import()` tidak bisa dibatalkan; yang dijamin adalah tidak pernah menampilkan hasil bab lain.
- Posisi baca disimpan sebagai fraksi (bukan piksel) supaya tetap masuk akal saat ukuran teks atau lebar layar berubah; ini perkiraan, bukan jaminan posisi presisi.
- Teks Leo untuk reader Bahasa Inggris dibaca dari kartu topik yang sudah dirender, karena memindahkan 80 KB isi JSX ke data berisiko menghilangkan tabel/contoh/latihan. Migrasi ke data bisa dilakukan bertahap kemudian.
- Push langsung ke `main` atas izin eksplisit owner (default prompt master: branch kerja).

## Verifikasi

- `npm run build` lolos. Dibanding `680031b`: seluruh app JS +2,9 KB gzip, CSS +0,5 KB gzip (reader dan MateriKit kini di satu chunk bersama; `MateriMatkul` 9,1 -> 3,1 KB gzip).
- `npm run lint`: 103 masalah sebelum dan sesudah (92 error + 11 warning lama); semua file baru/diubah bersih.
- `npm run check:quiziz`: 23 path diperiksa terhadap 75 rute, semua valid; kini juga memeriksa bahwa setiap reader mendukung deep link `/:babId`, dan konsistensi item aktif untuk deep link.
- Tes perilaku sementara (jsdom; pemuat bab dan Leo dikendalikan/dimata-matai; tidak di-commit): 44 pemeriksaan lolos. Gerbang Fase 3 diuji dua arah: B selesai lalu A datang terlambat, dan A selesai saat B masih memuat; keduanya hanya menampilkan isi B, dan 6 render konteks Leo tidak pernah memasangkan judul dengan isi bab lain. Juga: deep link, alias `?bab=`, bab tidak dikenal, tombol kembali, pemulihan dan penyimpanan posisi, anchor dan daftar isi (termasuk id duplikat dan < 3 heading), waktu baca, tandai/batalkan, prev/next, CTA latsol jujur, A+/Fokus dan persistensinya, gagal muat + coba lagi, praktikum, seluruh reader Bahasa Inggris, registry 112 bab, Lanjutkan, dan palette ke deep link.
- **Tanpa screenshot** (permintaan owner). Yang perlu dicek mata: (1) toolbar reader di desktop dan mobile (baris lokasi + A−/A+/Fokus membungkus rapi?); (2) A+/A− memakai `zoom`: cek di Safari dan Firefox; (3) mode Fokus di mobile (bar mobile ikut tersembunyi; keluar lewat tombol Fokus); (4) daftar isi dan footer bab (tandai/batalkan, prev/next, CTA latsol); (5) sidebar: teks "Latsol ... belum tersedia" di IBD vs tombol di Bahasa Inggris; (6) tombol Leo tidak menutupi footer bab; (7) tema terang dan gelap.
- **Belum teruji live**: Leo (Gemini + login) termasuk di reader Bahasa Inggris, dan perangkat nyata.

## Catatan untuk Fase 4 dan seterusnya

- Perombakan visual reader (lebar sidebar, hierarki callout/tabel/kotak dalam `bim-*`) belum dilakukan; hanya penambahan di atas tampilan lama. Strip workspace dengan tab Materi · Latsol · Praktikum belum dipasang di reader (lokasi sudah ada di toolbar; reader masih full-bleed tanpa shell).
- Reader Bahasa Inggris belum punya daftar isi (isi topik JSX tanpa data heading) dan pencarian dalam materi seperti `MateriMatkul`.
- Status di katalog dibaca dari data di kode. Toggle admin (`quizToggles` di Firestore) yang menyembunyikan TM dari publik tidak dibaca di beranda.
- Halaman latsol masih mengimpor `AiDisclaimer` dari `QuizBahasaInggris` sehingga ikut membawa isi halaman itu; pindahkan ke komponen bersama (bagian Fase 4).
- Padding `safe-area-inset-bottom` di tab bar baru berefek kalau meta viewport memakai `viewport-fit=cover` (belum diubah; berdampak ke seluruh situs).

## Fakta data (dibaca dari kode)

- Latsol tersedia: hanya Bahasa Inggris TM 1. IBD, KDK, Kesglob, Komdas, PAI, Pancasila belum; FTK belum punya latsol terpisah.
- Materi: Bahasa Inggris (19 topik), Komdas (13 bab), IBD (14), Kesglob (16), KDK (9), FTK (17). Praktikum: Komdas (5 modul), IBD (19). PAI dan Pancasila belum punya materi. Total 112 bab terdaftar.
- Quiziz UAS belum tersedia.
