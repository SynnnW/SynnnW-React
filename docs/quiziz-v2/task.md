# Quiziz v2 — task.md (pelacak fase)

Acuan: "Prompt Master v2 — Rombak Quiziz + Leo AI". Dikerjakan langsung di `main` atas permintaan owner (tanpa branch baru). Dokumen ini diperbarui setiap selesai satu langkah supaya posisi step selalu jelas.

## Posisi sekarang

**Fase 0 selesai ringkas, Fase 2 sebagian (chat Leo di depan beranda), Fase 5 sebagian (Leo di beranda).** Fase 1, 3, 4, dan 6 belum dikerjakan.

| Fase | Isi | Status |
| --- | --- | --- |
| 0 | Audit, task.md, peta rute | Selesai ringkas (dokumen ini). Screenshot "sebelum" dan `design-notes.md` belum dibuat. |
| 1 | Fondasi: token ter-scope, registry/adapter matkul, shell tunggal | Belum |
| 2 | Beranda, katalog, workspace matkul, command palette | Sebagian: chat Leo jadi blok paling atas `/quiziz`. Belum: katalog baris, "Lanjutkan", workspace matkul, command palette. |
| 3 | Reader semua materi, deep link, resume | Belum |
| 4 | Persiapan, pengerjaan, hasil/review, login/kuesioner/UAS/multiplayer | Belum |
| 5 | Leo: Pico, otak, navigasi, integrasi kuis | Sebagian: Pico 2D jadi wajah Leo di beranda, konteks katalog nyata, chip tautan dari katalog. Belum: identitas/system prompt baru, gaya Nyablak/Santai/Serius, registry aksi penuh, Leo di kuis dan review. |
| 6 | QA, aksesibilitas, performa, laporan akhir | Belum |

## Langkah ini: chat Leo di depan Quiziz

- `src/components/quiz/LeoHomeChat.jsx` (baru): chat inline di atas beranda, bisa langsung bertanya tanpa membuka tombol mengambang. Tiga pertanyaan pembuka, cooldown 5 detik, error jelas (pesan yang gagal kembali ke kotak tulis dan tidak ikut riwayat).
- `src/data/quiziz/leoHome.js` (baru): katalog matkul yang dibaca dari data nyata (registry materi + manifest latsol). Dipakai sebagai rujukan Leo dan sebagai sumber chip tautan.
- `src/styles/leoHome.css` (baru): prefix `.qz-leo-*`, hanya token tema.
- `src/pages/quiziz/Quiziz.jsx`: kartu judul diganti chat; kartu Materi dan Quiziz tetap di bawahnya, tampilan `?view=quiz` tidak berubah.
- `api/leo-chat.js`: `pageContext.halaman = 'beranda'` menambah konteks halaman di system prompt (jangan mengarang matkul/bab/soal). Perilaku lain tidak berubah.

Keputusan:

- Chat dipasang inline di atas atas permintaan owner. Prompt master awalnya menaruh Leo sebagai pendamping, bukan pusat halaman; penataan akhir beranda diputuskan di Fase 2 penuh.
- Chip tautan dibuat dari kata matkul di pesan pengguna sendiri + katalog. Tidak pernah dari teks balasan model, dan tidak ada chip untuk target yang belum tersedia.
- Pico memakai `force2D`, `decorative`, `trackPointer={false}`: chunk three.js tidak dimuat hanya karena Leo ada.
- Push langsung ke `main` atas izin eksplisit owner (default prompt master: branch kerja).

## Verifikasi

- `npm run build`: lolos. Chunk `Quiziz` 5,3 KB → 12,5 KB (gzip 1,6 → 4,4 KB); tidak ada referensi `Mascot3D` di chunk itu.
- `npm run lint`: 103 masalah sebelum dan sesudah (92 error + 11 warning lama); file baru/diubah bersih.
- Tes perilaku sementara (jsdom, `fetch` tiruan, tidak di-commit): 30 pemeriksaan lolos. Isinya: tampilan awal, payload ke `/api/leo-chat`, status thinking, cooldown, error 429, kirim ulang, dan chip tautan.
- **Belum teruji live**: butuh `GEMINI_API_KEY` dan sesi login Supabase di deploy. Belum ada screenshot desktop/mobile (tidak ada browser di lingkungan kerja).

## Fakta data (dibaca dari kode, HEAD `cd365c3`)

- Latsol tersedia: hanya Bahasa Inggris TM 1. IBD, KDK, Kesglob, Komdas, PAI, Pancasila belum; FTK belum punya latsol terpisah.
- Materi: Bahasa Inggris, Komdas, IBD, Kesglob, KDK, FTK. Praktikum: Komdas, IBD. PAI dan Pancasila belum punya materi.
- Quiziz UAS belum tersedia.
