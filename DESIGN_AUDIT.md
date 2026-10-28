# DESIGN AUDIT (Phase 0)

Zona terlarang (tidak disentuh): Makrab.jsx, apa pun berbau makrab (referensi di Navbar.jsx, App.jsx, AuthLogin.jsx hanya dibaca), supabase/, api/, supabaseClient.js, logika auth/data.

## Temuan
- Warna ungu (8b5cf6/a78bfa/c4b5fd/7c3aed/6d28d9/139,92,246): ~55 file (CSS global, home, bento, quizGlass, komponen shell, WorkDetail1-27, dashboard, quiz, Auth, Checkout, dll). Juga 1 file data: src/data/quiziz/bahasaInggris/tm01/materi.js (cek manual, mungkin konten).
- Font lama (Cormorant/Outfit/Dancing): ~50 file + index.html + @import globals.css (dimuat 2x). PreviewLogo.jsx & banyak halaman memakai inline.
- .grad-text-*: hanya didefinisikan di globals.css (pemakaian lewat className perlu dicek per halaman).
- backdrop-filter: 22 file (Navbar, FloatingUtils, CookieConsent, quizGlass, dashboard, dll).
- user-select:none: globals.css:56 (body) -> dihapus; lainnya (Navbar, hm-card, modal img) boleh tetap.
- File kembar: ScrollReveal, CardStagger, ParallaxImage, TextReveal, LoadingScreen ada di components/ DAN pages/.
- Catatan: Makrab.jsx dan makrab.sql tidak diaudit/diubah.
