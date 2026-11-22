// src/data/quiziz/routes.js
// Peta rute Quiziz: SATU tempat untuk path, item navigasi, dan "item mana yang aktif".
// Sengaja murni (tanpa fitur Vite, tanpa impor data) supaya ringan dimuat shell di semua halaman Quiziz
// dan bisa diimpor skrip Node. URL lama TIDAK boleh berubah; yang baru hanya boleh ditambah.
// Kesesuaian dengan router di App.jsx dicek oleh `npm run check:quiziz`.

/** Urutan matkul tetap (sama dengan daftar di beranda). Matkul baru: tambah di sini dan di registry.js. */
export const SUBJECT_SLUGS = ['bahasainggris', 'pai', 'ftk', 'kdk', 'pancasila', 'kesglob', 'ibd', 'komdas'];

export const PATHS = {
  beranda: '/quiziz',
  latsolLama: '/quiziz?view=quiz', // alias lama: daftar matkul latsol di beranda (tetap valid)
  materiHub: '/quiziz/materi',
  uas: '/quizizuas',
  masuk: '/quiziz/masuk',
  kuesioner: '/quiziz/kuesioner',
};

export const latsolPath = (slug) => `/quiziz/${slug}`;
export const materiPath = (slug) => `/quiziz/${slug}/materi`;
export const praktikumPath = (slug) => `/quiziz/${slug}/praktikum`;

/** Navigasi utama: satu daftar untuk top bar (desktop/tablet) dan tab bar bawah (mobile). */
export const NAV_ITEMS = [
  { id: 'beranda', label: 'Beranda', to: PATHS.beranda, icon: 'fa-house' },
  { id: 'materi', label: 'Materi', to: PATHS.materiHub, icon: 'fa-book-open' },
  { id: 'latsol', label: 'Latsol', to: PATHS.latsolLama, icon: 'fa-list-check' },
  { id: 'uas', label: 'UAS', to: PATHS.uas, icon: 'fa-graduation-cap' },
];

/**
 * Item navigasi yang aktif untuk sebuah lokasi, atau null (mis. login, kuesioner, rute tak dikenal).
 * Materi: hub + semua halaman materi/praktikum. Latsol: beranda `?view=quiz` + halaman latihan per matkul.
 */
export function activeNav(pathname, search = '') {
  const path = String(pathname).replace(/\/+$/, '') || '/';
  if (path === PATHS.uas) return 'uas';
  if (path === PATHS.beranda) return new URLSearchParams(search).get('view') === 'quiz' ? 'latsol' : 'beranda';
  const [, root, slug, section] = path.split('/');
  if (root !== 'quiziz') return null;
  if (slug === 'materi' && !section) return 'materi';
  if (!SUBJECT_SLUGS.includes(slug)) return null;
  if (!section) return 'latsol';
  return section === 'materi' || section === 'praktikum' ? 'materi' : null;
}
