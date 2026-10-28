# CHANGELOG DESIGN (redesign/anti-slop)

Aturan: Makrab, supabase/, api/, supabaseClient.js, logika auth/backend TIDAK diubah.

- Phase 0: DESIGN_AUDIT.md
- Phase 1: token warna (lime #D7FF3A, dark+light), font Bricolage/Geist/Geist Mono (dimuat sekali), src/lib/motion.js, user-select dihapus, .grad-text dihapus (-> .hl), file kembar pages/ dihapus.
- Phase 2: LineReveal, ImageReveal, Marquee, Magnetic, RollLink, Counter, Preloader; SmoothScroll, ParallaxImage, PageTransition, CustomCursor diperbarui.
- Sweep: warna ungu -> token aksen, font lama -> token font, di semua halaman selain Makrab.
- Phase 4: Works = hover list (desktop) / grid 2 kolom (mobile); bento.css redesign layer (sudut tajam, tanpa glow/orb); Home hero (LineReveal, Magnetic, Counter, Marquee).
- Phase 5: NotFound (404 raksasa + marquee + Magnetic); Footer (marquee + jam WIB).
- Glass: backdrop-filter dihapus di luar Navbar.

- Sweep 2: radius tajam, gradient dekoratif dibuang, neon shadow dibuang di semua halaman (Makrab, Navbar, backend tidak disentuh).

- Navbar: hide saat scroll turun, blur hanya saat scroll, gaya mono (baris Makrab tidak disentuh), Lenis stop saat drawer terbuka.
- PriceList: badge rekomendasi blok lime, harga mono, hover geser 8px.
- Warna dekoratif (pink/cyan/amber) dinetralkan di WorkDetail, Quiziz, Contact. Warna status (benar/salah, error/sukses) SENGAJA dipertahankan.

## Belum dikerjakan
- WorkDetailLayout bersama, horizontal-scroll gallery, About/PriceList/Contact/Journal layout ulang, Navbar (ada tombol Makrab), RollLink belum dipasang di Navbar/Footer, Lenis stop saat modal.
- Warna kategori/status (merah, hijau, pink, cyan) di beberapa halaman belum dinetralkan.
