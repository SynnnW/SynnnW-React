# Changelog 26Menfess

## v2 (Prompt Tambahan #1)

### Breaking changes
- Font kartu: **Nunito 800** (menggantikan Kanit)
- Ukuran PNG output: **1200×1500** (menggantikan 1080×1350)
- Template: **SVG vektor** di `public/26menfess/templates/{pink,green}.svg`
  (diekstrak dari referensi HTML; encoding diperbaiki UTF-16 → UTF-8)

### Fitur baru
- **Preview canvas WYSIWYG** di Composer — identik piksel dengan PNG unduhan
- **Tombol Unduh PNG** di Composer (sebelum kirim) dan Riwayat
- **Mode Upload admin** — alur fokus satu kartu: unduh/bagikan → ✔ Sudah Diposting → kartu berikutnya
- **Studio admin** — buat kartu sendiri, unduh, simpan ke daftar (source='admin')
- **SongSearch** — pencarian lagu iTunes API (tanpa key) + mode manual; pil lagu di kartu
- Kolom baru: `text_size`, `text_color`, `align`, `title`, `source`, `song_title`, `song_artist`, dll
- `menfess26-v2.sql` — patch idempotent untuk semua kolom baru

### Perbaikan
- **Lock color-scheme: light** — preview dan PNG tidak terpengaruh dark mode HP
- Fix import `usePullToRefresh` sesuai signature makrab
- Fix `Routes key` agar tidak remount saat navigasi antar sub-halaman 26Menfess
- Hapus `require()` dinamis di ClientDashboard

---

## v1 (Prompt Utama)

### Fitur awal
- Routing `/26menfess/*` — Landing, Login, Aturan, ClientDashboard, AdminDashboard
- Login Google + Anonim, deteksi in-app browser
- RulesGate modal persetujuan aturan
- Composer dengan DesignPicker Pink/Hijau
- Riwayat client dengan badge status + tarik menfess
- Dashboard admin: Queue, Hold, Tolak, Setujui, Unduh PNG, Salin caption, Tandai Diposting
- Owner Panel: kelola admin + pengaturan
- Hybrid storage IndexedDB+localStorage untuk persistensi sesi
- SWR cache tanpa realtime/polling
- Database: `menfess26.sql` — tabel, RLS, fungsi, trigger, seed owner
- Branding: favicon/title swap, manifest.webmanifest
- Semua CSS di-scope ke `.mf`, lock `color-scheme: light`

## v3 — Redesign frontend
- Shell baru (TopBar, BottomNav, Footer), halaman Feed & Akun, 404, ScrollManager.
- Landing/Login/Aturan/Composer/Riwayat/Admin dirombak; kartu asli (CardThumb) di Feed & Riwayat.
- Pustaka `components/menfess/ui/` (Button, Sheet, Toast, Tabs, dll) + token CSS.
- Logika kartu, lagu, auth, SQL tidak berubah. Detail: `docs/26MENFESS_REDESIGN.md`.
