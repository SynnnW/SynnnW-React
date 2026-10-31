# DESIGN — Synnnw

Dua bahasa visual yang sengaja berbeda, satu sistem token.

| Area | Bahasa | Alasan |
|---|---|---|
| Halaman publik (Home, Works, About, Journal, Price, WorkDetail, Login, 404) | **Editorial Luxury + Soft Structuralism** | portofolio = karya dibaca seperti majalah |
| Dashboard (Admin, Client, Makrab) + kuis + hasil kuis | **Neumorphism subtle** | data & kontrol; bentuk raised/inset menjelaskan fungsi |

## Token (`src/styles/globals.css`)
Semua warna lewat token semantik; `[data-theme="dark"|"light"]` dapat dipasang di elemen mana pun (dipakai Makrab).
- **Dark = charcoal/slate**: `--bg #1B1E22`, `--bg2 #212529`, `--text #ECE9E0`. Bukan hitam pekat.
- **Light = krem hangat**: `--bg #F2EEE5`, `--text #17160F`.
- **Aksen lime `#D7FF3A`** hanya untuk blok/highlight/aksi utama. Untuk **teks** aksen pakai `--accent-text` (lime di dark, olive `#3E5200` di light). Teks di atas lime selalu `--on-accent`.
- Status `--ok --bad --warn --info` punya nilai berbeda per tema; selalu dipasangkan dengan ikon/teks.
- Neumorphism: `--nm-bg --nm-hi --nm-lo` → `--nm-raise`, `--nm-raise-sm`, `--nm-raise-lg`, `--nm-inset`, `--nm-inset-sm`.
- Skala z-index: `--z-base 1 · sticky 20 · nav 40 · float 60 · modal 200 · toast 300 · overlay 500 · cursor 600` (tidak ada angka 9999).
- Preferensi tema: `localStorage['synw-theme']`, jika kosong ikut OS; diterapkan sebelum paint (skrip di `index.html`); satu modul `src/lib/theme.js`, dipakai `useTheme`, `ThemeToggle`, dan Makrab.

## Tipografi (dipilih lewat UI/UX Pro Max `search.py --domain typography`)
- Display: **Playfair Display** (400–700 + italic) — judul halaman publik; italic dipakai untuk penekanan.
- Body/UI: **Inter**; judul dashboard & kuis juga Inter (angka dan data harus tegas).
- Meta/folio: **JetBrains Mono**, kapital kecil dengan tracking.
Satu permintaan Google Fonts menggantikan Bricolage/Geist.

## Bentuk
Struktur tegas, sudut lembut: garis 1 px sebagai pembagi (bukan kartu di mana-mana), radius `--r-s 6 · --r-m 14 · --r-l 28`,
dan **satu bentuk khas** — "notch" `--r-notch` (hanya sudut kanan-atas yang membulat) pada bingkai utama, tombol, dan kartu karya selang-seling.
Detail khas: `.hl`/`.hm-swipe` (stabilo lime), `.crop` (crop marks sudut), `.folio` (penomoran mono), tanda "+" registrasi pada baris layanan.

## Momen "wow" per halaman utama
- Home: foto hero terbuka (clip) + stabilo lime menyapu frasa kunci sekali.
- 404: angka serif raksasa bergaris stabilo + maskot Pico.
- Dashboard: hero metric (Total Revenue / Proyek Aktif) dalam bento asimetris.
- Kuis: opsi jawaban raised → inset saat dipilih; benar/salah punya ikon, bukan warna saja.

## Neumorphism — aturan keterbacaan
1. Bayangan = bentuk; kontras = fungsi. Setiap elemen interaktif punya tepi hairline, teks AA, dan focus ring sendiri.
2. Raised = bisa diklik/wadah; inset = sumur data, input, track, state tertekan.
3. Disabled: opacity + tepi putus-putus + tanpa bayangan (bukan hanya pudar).
4. Fokus: outline lime (dark) / tinta + halo lime (light), offset 3 px.

## Gerak
Umpan balik 150 ms · masuk 200–300 ms · rute 420 ms; hanya `transform`/`opacity`. Satu aturan `prefers-reduced-motion` global mematikan animasi;
maskot memakai pose statis. Hadiah (lompat/konfeti) hanya sekali per perubahan mood.

## Maskot Pico (`<Mascot mood size />`)
Karakter orisinal (bulat lime, tunas, stetoskop kecil). Mood: `idle · wave · thinking · happy · sad · celebrate`.
- 3D: React Three Fiber + `three`, **lazy-load** (chunk terpisah ±190 KB + three ±740 KB, tidak masuk bundle awal), baru dimuat saat maskot terlihat; DPR ≤ 1.5; render dijeda saat tab/viewport tidak aktif; pointer tracking hanya pada pointer halus.
- Fallback: sprite SVG 2D inline bila WebGL tidak ada/gagal/context hilang/hemat data.
- Ganti model: taruh `.glb` valid di `/public/mascot/mascot.glb` (kontrak klip di `public/mascot/README.md`). **File itu belum ada** — sekarang yang tampil karakter prosedural.
- Terhubung ke kejadian nyata: jawaban benar/salah, streak ≥3, waktu hampir habis, hasil akhir kuis (4 tingkat), login Google/anonim, error/sukses login, layar 404, sambutan onboarding klien.

## Kontras (dihitung, WCAG)
| Tema | Pasangan | Warna | Latar | Rasio | AA teks normal (4.5) |
|---|---|---|---|---|---|
| dark | teks / latar | `#ECE9E0` | `#1B1E22` | 13.78 | lulus |
| dark | teks redup / latar | `#A3A8AE` | `#1B1E22` | 6.99 | lulus |
| dark | teks samar / permukaan neumorphic | `#8B9199` | `#23272D` | 4.72 | lulus |
| dark | teks aksen / latar | `#D7FF3A` | `#1B1E22` | 14.54 | lulus |
| dark | teks di atas tombol aksen | `#16181B` | `#D7FF3A` | 15.46 | lulus |
| dark | ok / permukaan | `#5BD48B` | `#23272D` | 8.03 | lulus |
| dark | bad / permukaan | `#FF7A7A` | `#23272D` | 5.94 | lulus |
| dark | warn / permukaan | `#F2C14E` | `#23272D` | 8.94 | lulus |
| dark | info / permukaan | `#7CC4F2` | `#23272D` | 7.88 | lulus |
| light | teks / latar | `#17160F` | `#F2EEE5` | 15.66 | lulus |
| light | teks redup / latar | `#5B574B` | `#F2EEE5` | 6.23 | lulus |
| light | teks samar / permukaan neumorphic | `#655F52` | `#E7E2D6` | 4.91 | lulus |
| light | teks aksen / latar | `#3E5200` | `#F2EEE5` | 7.52 | lulus |
| light | teks di atas tombol aksen | `#17160F` | `#D7FF3A` | 15.76 | lulus |
| light | ok / permukaan | `#146C37` | `#E7E2D6` | 5.03 | lulus |
| light | bad / permukaan | `#B42323` | `#E7E2D6` | 5.07 | lulus |
| light | warn / permukaan | `#8A5A00` | `#E7E2D6` | 4.59 | lulus |
| light | info / permukaan | `#075E94` | `#E7E2D6` | 5.35 | lulus |

## Ikon
Satu sistem: Font Awesome 6. Data lama berisi emoji dirender lewat `<Ico e="…" />`; emoji tak dikenal tidak ditampilkan.
PERHATIAN: pilihan ikon pada `Ico.jsx` dan `tools` di Home adalah pemetaan saya — periksa kecocokan makna.
