# 26Menfess — Dokumentasi Setup

## 1. Jalankan SQL di Supabase

Urutan eksekusi di Supabase SQL Editor:

1. `supabase/menfess26.sql` — skema penuh (tabel, RLS, fungsi, trigger, seed owner)
2. `supabase/menfess26-v2.sql` — patch kolom baru (text_size, song_title, dll)

Idempotent: aman dijalankan ulang.

## 2. Setting Supabase yang wajib dicek

| Setting | Lokasi | Nilai |
|---|---|---|
| Anonymous sign-ins | Auth → Providers | ✅ ON |
| Google OAuth | Auth → Providers | ✅ ON |
| Allow manual linking | Auth → Sign In | ✅ ON |
| Redirect URLs | Auth → URL Configuration | Tambahkan `https://DOMAIN/26menfess/**` dan `http://localhost:5173/**` |
| Time-box user sessions | Auth → Sessions | ❌ OFF (default) |
| Inactivity timeout | Auth → Sessions | ❌ OFF (default) |

## 3. Tambah admin baru

Jalankan di SQL Editor:
```sql
INSERT INTO menfess_admins (email, role, added_by)
VALUES ('email@gmail.com', 'admin', 'aldokraksaan@gmail.com')
ON CONFLICT (email) DO UPDATE SET role = 'admin';
```

Atau lewat UI Owner Panel di `/26menfess/admin?tab=owner`.

## 4. Ganti template kartu

Template SVG ada di `public/26menfess/templates/pink.svg` dan `green.svg`.
Koordinat area teks dikonfigurasi di `src/lib/menfess/templateConfig.js`:

```js
export const CARD = {
  W: 1200, H: 1500,
  area: { top: 0.15, bottom: 0.899, left: 0.103, right: 0.897 },
  ...
};
```

Kalau template baru punya area aman berbeda, ubah `area` di sana.

## 5. Ganti font kartu

Default: **Nunito 800**. Untuk ganti, ubah satu konstanta:
```js
// templateConfig.js
fontFamily: "'FontBaru', sans-serif",
fontWeight: '800',
```
Pastikan font dimuat di `MenfessApp.jsx` → `injectFonts()`.

## 6. Kunci warna preview

Semua preview kartu dan canvas dikunci `color-scheme: light` sehingga tampilan
dan hasil PNG tidak terpengaruh dark mode HP pengguna.
Ini diatur di `src/styles/menfess.css` dan `colorScheme: 'light'` inline di canvas.

## 7. Open Graph / SEO

SPA tidak mendukung meta OG dinamis. Preview link /26menfess di IG/WA akan
menampilkan OG situs SynnnW. Jika nanti perlu prerender, `og-26menfess.png`
sudah disiapkan di `public/26menfess/icons/og-26menfess.png`.

## 8. Keterbatasan yang diketahui

- **iOS Safari ITP**: localStorage bisa dihapus setelah ±7 hari tidak dipakai.
  Sudah diatasi dengan mirror ke IndexedDB (`src/lib/menfess/storage.js`).
- **PWA iOS**: login di "Tambah ke Layar Utama" penyimpanannya terpisah dari
  Safari, jadi login ulang sekali di PWA itu normal.
- **Google OAuth di in-app browser IG**: tidak bisa. Sudah ada `InAppBrowserNotice`
  dengan fallback login anonim dan tombol salin link.
- **Tidak ada auto-post Instagram**: by design. Admin unduh PNG → upload manual
  → klik "Sudah Diposting". Alur ini ada di Mode Upload admin.

## 9. Rencana opsional (di luar cakupan saat ini)

- Cloudflare Turnstile/CAPTCHA untuk anonim jika spam meningkat
- Notifikasi push/email saat menfess diposting
- Prerender SSR untuk OG
