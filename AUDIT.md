# AUDIT — Synnnw React (rombak total)

Dibuat dari inventaris repo `SynnnW/SynnnW-React` (138 file di `src/`, 56 route). Basis: Vite 8, React 19, react-router 7,
framer-motion, lenis, Supabase. Ikon: Font Awesome 6 (CDN) — satu sistem, dipertahankan.

## Temuan utama (sebelum rombak)
| # | Temuan | Prioritas | Tindakan | Status |
|---|---|---|---|---|
| 1 | Admin & Client dashboard memaksa `data-theme="dark"` dan menimpa `:root` (token bocor ke seluruh app) | P0 | hapus blok `:root`, ikut tema global, tambah `ThemeToggle` | selesai |
| 2 | Kuis (`QuizEngine`, `QuizizRoom`, `quizGlass.css`): glassmorphism + violet + orb/grain, dark-only | P0 | neumorphism subtle, aksen lime, light/dark, orb dihapus | selesai (lihat catatan verifikasi) |
| 3 | Gradien biru-ungu pada gambar hero (aset `Artboard 1.webp`) | P1 | diganti foto dokumentasi acara asli (`hero-event.webp`, 83 KB dari `aldo.jpg` 5.9 MB) | selesai |
| 4 | Navbar memakai variabel tak terdefinisi (`--neu-raised`, `--accent-g`, `--blur-*`) + patch `!important` | P1 | CSS ditulis ulang bersih | selesai |
| 5 | z-index 9990–99999 di 19 file | P1 | skala token `--z-*` | selesai |
| 6 | Emoji sebagai ikon (±560 karakter di ±35 file) | P1 | diganti ikon Font Awesome / `<Ico>`; emoji di data tetap, dirender lewat `<Ico>` | selesai di file UI; bank pesan maskot tetap berisi emoji tapi dibuang saat tampil |
| 7 | Teks aksen lime di tema terang (tak terbaca) | P1 | `color: var(--accent)` → `var(--accent-text)` (54 tempat, 29 file) | selesai |
| 8 | Chip kategori multi-warna (indigo/teal/oranye) | P2 | token status / netral | selesai |
| 9 | Cloudee: avatar library, loop rAF `setState` tiap frame | P2 | diganti `<Mascot>` (Pico); logika pesan/streak/klik dipertahankan | selesai |
| 10 | Tidak ada skip-link / landmark `main` / `lang` dinamis | P2 | ditambah | selesai |
| 11 | Bug lama: tombol bahasa WorkDetail16/17 memanggil `setLang` yang tak ada | P2 | pakai `toggleLang` dari App | selesai |
| 12 | Bug lama: `ClientPricesTab` dipakai di AdminDashboard tapi tidak pernah didefinisikan | P1 | **tidak diubah** (komponennya tidak ada di repo; butuh keputusan fitur) | tertahan |
| 13 | Bug lama: `setDrivePreviewUrl` tak terdefinisi di WorkDetail19/20 (tertangkap try/catch, tidak crash) | P3 | tidak diubah | tertahan |

## Matriks route
Status: **A** = dirancang ulang tangan · **B** = sistem baru lewat token/CSS bersama (komposisi lama dipertahankan) · **C** = hanya sapuan warna/emoji.
Verifikasi: **V** = dilihat di browser headless (dark+light) · **v** = sebagian · **–** = tidak dilihat.

| Route | File | Status | Verifikasi | Catatan |
|---|---|---|---|---|
| `/` | `Home.jsx`, `home.css` | A | V (dark, light, mobile) | hero foto asli, stabilo sekali jalan, crop marks, angka serif |
| Navbar / Footer / Preloader / Loader / PageTransition | `components/*` | A | V | rute 420 ms; skip-link; folio |
| `*` (404) | `NotFound.jsx` | A | V (desktop, mobile) | maskot sedih |
| `/works`, `/about`, `/journal`, `/price-list`, `/terms` | `bento.css` + halaman | B | V (works, about, journal, price-list; terms mobile) | lapisan editorial menggantikan patch lama |
| `/contact`, `/checkout`, `/complete-profile` | | B/C | v (contact: layar keranjang kosong) | |
| `/login` | `AuthLogin.jsx` | A/B | V | token lokal gelap dibuang, maskot bereaksi error/sukses, toggle tema |
| `/Dashboard` (klien) | `ClientDashboard.jsx` | A | V (dark, light, mobile; data tiruan) | hero metric, bento, onboarding baru |
| `/admin-dashboard` | `AdminDashboard.jsx` | A | V (dark, light, mobile; data tiruan) | hero = Total Revenue |
| `/quiziz` (landing) | `Quiziz.jsx`, `quizGlass.css` | A | V (dark, light, mobile) | |
| `/quizizuas`, `/quiziz/*`, `/quiz-farmakologi` | `QuizEngine.jsx`, picker | A | **–** | layar soal & modal hasil **belum dilihat** (butuh data soal + sesi) |
| `/quiziz/bahasainggris/materi` | | C | – | |
| `/makrab` | `Makrab.jsx` | B | v (hanya layar "belum terdaftar") | mewarisi token dashboard; layar utama butuh data anggota |
| `/works/*` (28 halaman) | `WorkDetail1–28.jsx` | B/C | V (4 halaman) | serif, chip netral, teks aksen aman; **tidak dirombak satu per satu** |
| `/pengeluaran` | | C | – | |
| `/preview-logo` | | tidak diubah | – | halaman utilitas |
| `/porto*`, `/tentang` | | redirect | – | |

## Hasil pengujian nyata
- `vite build`: lolos.
- ESLint: baseline 140 error / 11 peringatan → sekarang **lihat laporan akhir** (angka dicatat di sana setelah run terakhir).
- Headless Chromium (sandbox): tanpa overflow horizontal pada 12 route mobile (390 px); WebGL (SwiftShader) jalan; fallback 2D saat WebGL dimatikan; pose statis saat reduced-motion.
- Belum diuji: perangkat nyata, VoiceOver/NVDA, performa FPS di HP, alur login/pembayaran sungguhan, Safari/Firefox.
