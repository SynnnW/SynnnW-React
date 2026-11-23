# Quiziz v2 — task.md (pelacak fase)

Acuan: "Prompt Master v2 — Rombak Quiziz + Leo AI". Dikerjakan langsung di `main` atas permintaan owner (tanpa branch baru). Dokumen ini diperbarui setiap selesai satu langkah supaya posisi step selalu jelas. Atas permintaan owner, pengerjaan tidak lagi menyertakan screenshot: tampilan dicek owner sendiri (checklist di bagian Verifikasi).

## Posisi sekarang

**Fase 0 selesai ringkas, Fase 1 selesai, Fase 2 selesai (dengan catatan), Fase 5 sebagian (Leo di beranda dan palette).** Fase 3, 4, dan 6 belum dikerjakan. Langkah berikutnya: Fase 3 (reader materi).

| Fase | Isi | Status |
| --- | --- | --- |
| 0 | Audit, task.md, peta rute | Selesai ringkas. Screenshot Fase 1 ada di `screenshots/` (sudah tidak mewakili beranda Fase 2); `design-notes.md` belum dibuat. |
| 1 | Fondasi: token ter-scope, registry/adapter matkul, kompatibilitas rute, shell tunggal | Selesai. |
| 2 | Beranda, katalog, workspace matkul, command palette | **Selesai dengan catatan.** Ditunda: strip workspace di halaman reader (ikut Fase 3), menu akun di top bar, "terakhir dicari" di palette. |
| 3 | Reader semua materi, deep link, resume | Belum. Sudah ada jembatan sementara: `?bab=` dan jejak bab terakhir (lihat Fase 2). |
| 4 | Persiapan, pengerjaan, hasil/review, login/kuesioner/UAS/multiplayer | Belum |
| 5 | Leo: Pico, otak, navigasi, integrasi kuis | Sebagian: Pico 2D di beranda, katalog nyata sebagai konteks, chip tautan dari katalog, "Tanya Leo" dari palette. Belum: identitas/system prompt baru, gaya Nyablak/Santai/Serius, registry aksi penuh, Leo di kuis dan review. |
| 6 | QA, aksesibilitas, performa, laporan akhir | Belum |

## Langkah 1: chat Leo di depan Quiziz (`1c193be`) dan Langkah 2: Fase 1 fondasi (`6497ba7`)

Chat Leo inline di atas beranda; registry matkul tunggal (`data/quiziz/registry.js`), peta rute (`routes.js`), `npm run check:quiziz`, shell tunggal `QuizShell` (top bar + tab bar mobile, varian `focus`, error boundary), token `--qz-*` ter-scope ke `[data-area='quiziz']`. Rincian ada di riwayat commit.

## Langkah 3: Fase 2 (beranda, katalog, palette, workspace)

- **Beranda** (`pages/quiziz/Quiziz.jsx`): chat Leo tetap paling atas, lalu kartu **Lanjutkan** (hanya bila ada bacaan terakhir yang tersimpan dan masih valid), lalu **katalog** mata kuliah, baris UAS, komentar, dan saran. Kartu besar Materi/Quiziz dan hub Materi lama diganti satu katalog.
- **Katalog** (`components/quiz/Catalog.jsx`): satu baris per matkul dengan chip status dari registry (ikon + teks, bukan warna saja): Materi (jumlah bab), Praktikum (jumlah modul), Latsol (TM), dan "N bab selesai dibaca" dari progres reader yang sudah ada. Yang belum ada tampil dengan garis putus-putus dan teks jelas ("Materi belum ada", "Latsol belum tersedia"); matkul tanpa konten apa pun tidak punya tombol palsu, hanya "Segera hadir". Aksi utama mengikuti filter, aksi lain jadi tautan cepat. Label aksesibel memuat nama matkul.
- **Filter** (Semua, Ada materi, Ada latsol, Praktikum, dengan jumlah dari data): `?view=` di URL, jadi bisa dibagikan dan nav ikut menyala. Materi dan Latsol kini filter pada katalog yang sama.
- **Alias lama tetap valid**: `/quiziz?view=quiz` (filter Latsol), `/quiziz/materi` (dialihkan ke `/quiziz?view=materi`). Tidak ada rute baru. `MateriHub.jsx` dihapus.
- **Command palette** (`CommandPalette.jsx`, `data/quiziz/search.js`): Ctrl/⌘+K, tombol `/`, tombol cari di top bar, atau kolom cari di katalog. Mencari matkul, judul bab (93 bab dari manifest), aktivitas (Materi/Praktikum/Latsol), dan halaman; baris terakhir **Tanya Leo** mengirim pertanyaan ke chat beranda. Pola ARIA combobox + listbox, fokus terkunci di dialog, Escape menutup, fokus kembali ke pemicu, scroll dikunci. Hanya metadata yang diindeks (tidak ada isi bab); dimuat malas saat pertama dibuka.
- **Workspace matkul** (`CourseWorkspace.jsx`): strip identitas + tab Materi · Latsol · Praktikum di 8 halaman latsol. Tab hanyalah tautan antar URL lama; yang belum tersedia tampil nonaktif dengan alasan; Praktikum hanya muncul bila ada. Dipasang sebagai `nav` + `aria-current` (bukan `role="tablist"`) karena tiap tab berpindah URL, bukan panel di halaman yang sama.
- **Reader** (`MateriMatkul.jsx`, perubahan kecil dan aditif): mencatat bab terakhir yang dibuka (`quiziz_last_read_v1`), membuka bab dari `?bab=<id>`, dan tombol kembali menuju filter Materi. Reader Bahasa Inggris belum mencatat jejak.
- **Top bar**: tombol cari (kolom kecil + ⌘K di desktop, ikon bulat di ≤ 1100px); "Website utama" jadi ikon di ≤ 1100px.
- Teks sapaan chat dan "cara pakai" untuk Leo diperbarui (tidak lagi menyebut kartu Materi/Quiziz).

### Peta rute dan item aktif

| URL (semua lama, tidak berubah) | Item aktif |
| --- | --- |
| `/quiziz` | Beranda |
| `/quiziz?view=quiz`, `/quiziz/<slug>` | Latsol |
| `/quiziz?view=materi`, `/quiziz?view=praktikum`, `/quiziz/materi` (alias, dialihkan), `/quiziz/<slug>/materi`, `/quiziz/<slug>/praktikum` | Materi |
| `/quizizuas` | UAS |
| `/quiziz/masuk`, `/quiziz/kuesioner` | tidak ada (header focus, tanpa cari) |

## Keputusan

- Chat tetap di atas beranda (permintaan owner); katalog menggantikan dua kartu besar karena spesifikasi meminta Materi dan Latsol sebagai filter, bukan halaman terpisah.
- Filter hidup di `?view=` pada satu rute, bukan di rute berbeda: ganti filter tidak me-reset percakapan Leo dan tidak menambah riwayat (`replace`).
- `?bab=` adalah jembatan sementara pada rute reader lama. Di Fase 3 diganti `/quiziz/:slug/materi/:babId` dan `?bab=` dipertahankan sebagai alias.
- "Lanjutkan" hanya memakai data yang benar-benar tersimpan; pengguna baru tidak melihat kartu atau progres karangan.
- Menu akun di top bar ditunda: butuh keputusan UX akun (tombol mati lebih buruk daripada tidak ada tombol).
- Push langsung ke `main` atas izin eksplisit owner (default prompt master: branch kerja).

## Verifikasi

- `npm run build` lolos. Dibanding `6497ba7`: seluruh app JS +4,1 KB gzip, CSS +2,8 KB gzip; palette dimuat malas (2,5 KB JS + 1 KB CSS gzip, baru diunduh saat dibuka); shell +0,3 KB gzip.
- `npm run lint`: 103 masalah sebelum dan sesudah (92 error + 11 warning lama); semua file baru/diubah bersih.
- `npm run check:quiziz`: 23 path diperiksa terhadap 75 rute, semua valid (termasuk alias `/quiziz/materi`).
- Tes perilaku sementara (jsdom, `fetch` dan Supabase tiruan, tidak di-commit): 61 pemeriksaan lolos: katalog (urutan, chip status jujur, aksi, label), filter dan sinkron URL, alias lama, Lanjutkan (valid/tidak valid/pengguna baru), progres, palette (buka lewat 4 cara, ARIA, panah/Home/End, Tab terkunci, Escape, pengembalian fokus, tanpa hasil, "Tanya Leo" terkirim sekali), varian focus, workspace, reader (`?bab=`, jejak terakhir, tombol kembali), dan regresi shell.
- **Tanpa screenshot** (permintaan owner). Yang perlu dicek mata: (1) beranda desktop dan mobile: baris matkul, chip status, tombol aksi; (2) chip filter yang bisa digeser di mobile; (3) palette di mobile (posisi saat keyboard muncul); (4) strip workspace di `/quiziz/ibd` dan `/quiziz/pai`; (5) top bar di lebar 761-1100px (cari dan globe jadi ikon) dan tab bar mobile; (6) tema terang dan gelap.
- **Belum teruji live**: Leo dengan Gemini dan login Supabase sungguhan, perangkat nyata.

## Catatan untuk Fase 3 dan seterusnya

- Status di katalog dibaca dari data di kode. Toggle admin (`quizToggles` di Firestore) yang menyembunyikan TM dari publik tidak dibaca di beranda, jadi bisa ada selisih bila admin mematikan TM yang tercatat "tersedia".
- Reader (`MateriMatkul`, `MateriBahasaInggris`) belum memakai shell dan belum menampilkan strip workspace; `select()` di `MateriMatkul` masih punya race saat pindah bab cepat (muat async tanpa pembatalan).
- Halaman latsol masih mengimpor `AiDisclaimer` dari `QuizBahasaInggris` sehingga ikut membawa isi halaman itu; pindahkan ke komponen bersama.
- Padding `safe-area-inset-bottom` di tab bar baru berefek kalau meta viewport memakai `viewport-fit=cover` (belum diubah; berdampak ke seluruh situs).

## Fakta data (dibaca dari kode)

- Latsol tersedia: hanya Bahasa Inggris TM 1. IBD, KDK, Kesglob, Komdas, PAI, Pancasila belum; FTK belum punya latsol terpisah.
- Materi: Bahasa Inggris, Komdas (13 bab), IBD (14), Kesglob (16), KDK (9), FTK (17). Praktikum: Komdas (5 modul), IBD (19). PAI dan Pancasila belum punya materi.
- Quiziz UAS belum tersedia.
