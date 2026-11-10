# 26Menfess — Redesign frontend (v3)

## Peta halaman
```
/26menfess                 Landing (semua orang, termasuk yang sudah login)
/26menfess/feed            Feed publik penuh (filter kategori, muat lebih banyak)
/26menfess/aturan          Aturan (tombol Kembali ke halaman asal via state.from)
/26menfess/masuk           Login (?next= dipakai juga untuk redirect Google)
/26menfess/app?tab=kirim|riwayat|akun
/26menfess/admin?tab=upload|queue|hold|posted|studio|owner
/26menfess/*               404 khusus
```
Shell tunggal `MfShell` (TopBar + BottomNav saat login di HP + Footer + ScrollManager). Semua link internal pakai `<Link>`; pindah tab pakai `replace` supaya tombol Back tidak berputar.

## Masalah yang diperbaiki (ringkas)
- N1–N3: landing tidak lagi auto-redirect; dashboard punya link ke Feed/Aturan/Akun/Situs SynnnW; Keluar selalu lewat dialog, peringatan keras untuk akun anonim (+ tombol Hubungkan Google).
- N4–N8: Kembali ke asal, `redirectTo` Google ikut `?next=`, RequireAdmin mengarahkan ke login lalu kembali, RulesGate jadi sheet dengan Kembali + link aturan, 404 khusus.
- N10: layar sukses setelah kirim. N11: tombol Trakteer fixed dihapus (footer, menu akun, layar sukses). N12: tidak ada `alert/confirm`.
- V1–V12: token CSS (spacing/tipografi/warna), hierarki sticker hanya L1 (CTA & kartu), ikon SVG (bukan emoji), kontras teks sekunder, input 16px, toast terpusat, state loading/empty/error seragam.
- Bug: ikon/favicon 404 (ikon PWA digenerate), `--mf-font-card` ke Nunito, resend menfess ditolak kini membawa lagu (objek) + ukuran/warna teks, `fetchMyPosts` memilih kolom baru, counter 3 tingkat.

## Tidak diubah
`renderCard.js`, `templateConfig.js`, template SVG, cache, storage, useMfAuth, rules, semua SQL, logika SongSearch/SongPreviewButton (hanya restyle + prop `previewUrl`), aksi admin `adminSetStatus`, polling 30 dtk.

## Keputusan yang butuh jawaban
- Aturan 4–6 (`suggested: true`) hanya tampil di halaman Aturan, belum di Landing/RulesGate.
- Feed: filter kategori masih client-side (dari data yang sudah dimuat).
- Ikon PWA saat ini placeholder hasil generate; ganti dengan aset asli kalau ada.
- Label "Untuk/Dari" tidak tergambar di kartu karena `drawCard` membaca `to/from` sementara data memakai `to_label/from_alias` (perilaku lama, tidak diubah).
