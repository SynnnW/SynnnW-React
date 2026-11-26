// src/data/quiziz/routes.js
// Peta rute Quiziz: SATU tempat untuk path, item navigasi, filter beranda, dan "item mana yang aktif".
// Sengaja murni (tanpa fitur Vite, tanpa impor data) supaya ringan dimuat shell di semua halaman Quiziz
// dan bisa diimpor skrip Node. URL lama TIDAK boleh berubah; yang baru hanya boleh ditambah.
// Kesesuaian dengan router di App.jsx dicek oleh `npm run check:quiziz`.

/** Urutan matkul tetap (sama dengan daftar di beranda). Matkul baru: tambah di sini dan di registry.js. */
export const SUBJECT_SLUGS = ['bahasainggris', 'pai', 'ftk', 'kdk', 'pancasila', 'kesglob', 'ibd', 'komdas'];

export const PATHS = {
  beranda: '/quiziz',
  latsolLama: '/quiziz?view=quiz',            // alias lama (tetap valid): filter Latsol di beranda
  materiHub: '/quiziz/materi',                // alias lama (tetap valid): dialihkan ke filter Materi di beranda
  berandaMateri: '/quiziz?view=materi',
  berandaPraktikum: '/quiziz?view=praktikum',
  uas: '/quizizuas',
  masuk: '/quiziz/masuk',
  kuesioner: '/quiziz/kuesioner',
  osce: '/quizizuas/osce',
  osceSolo: '/quizizuas/osce/solo/:caseId',
  osceRoom: '/quizizuas/osce/room/:code',
};

export const osceHub = () => PATHS.osce;
export const osceSoloPath = (caseId) => `/quizizuas/osce/solo/${encodeURIComponent(caseId)}`;
export const osceRoomPath = (code) => `/quizizuas/osce/room/${encodeURIComponent(code)}`;

/** Filter katalog di beranda <-> nilai ?view= di URL. `quiz` dipertahankan sebagai nama lama untuk Latsol. */
export const FILTER_VIEW = { semua: '', latsol: 'quiz', materi: 'materi', praktikum: 'praktikum' };
export function filterFromView(view) {
  const hit = Object.entries(FILTER_VIEW).find(([, v]) => v && v === view);
  return hit ? hit[0] : 'semua';
}

export const latsolPath = (slug) => `/quiziz/${slug}`;
export const materiPath = (slug) => `/quiziz/${slug}/materi`;
export const praktikumPath = (slug) => `/quiziz/${slug}/praktikum`;
/** Deep link kanonis ke sebuah bab: /quiziz/:slug/(materi|praktikum)/:babId (+ #anchor subbagian). `?bab=` hanya alias lama. */
export const babPath = (slug, mode, babId) => `/quiziz/${slug}/${mode === 'praktikum' ? 'praktikum' : 'materi'}/${encodeURIComponent(babId)}`;
/** Halaman awal (dashboard) reader sebuah matkul. */
export const readerBase = (slug, mode) => (mode === 'praktikum' ? praktikumPath(slug) : materiPath(slug));

/** Navigasi utama: satu daftar untuk top bar (desktop/tablet) dan tab bar bawah (mobile). */
export const NAV_ITEMS = [
  { id: 'beranda', label: 'Beranda', to: PATHS.beranda, icon: 'fa-house' },
  { id: 'materi', label: 'Materi', to: PATHS.berandaMateri, icon: 'fa-book-open' },
  { id: 'latsol', label: 'Latsol', to: PATHS.latsolLama, icon: 'fa-list-check' },
  { id: 'uas', label: 'UAS', to: PATHS.uas, icon: 'fa-graduation-cap' },
];

/**
 * Item navigasi yang aktif untuk sebuah lokasi, atau null (mis. login, kuesioner, rute tak dikenal).
 * Materi: filter Materi/Praktikum di beranda + semua halaman materi/praktikum. Latsol: filter Latsol + halaman latihan per matkul.
 */
export function activeNav(pathname, search = '') {
  const path = String(pathname).replace(/\/+$/, '') || '/';
  if (path === PATHS.uas || path.startsWith(PATHS.uas + '/')) return 'uas';
  if (path === PATHS.beranda) {
    const f = filterFromView(new URLSearchParams(search).get('view'));
    return f === 'latsol' ? 'latsol' : f === 'materi' || f === 'praktikum' ? 'materi' : 'beranda';
  }
  const [, root, slug, section] = path.split('/');
  if (root !== 'quiziz') return null;
  if (slug === 'materi' && !section) return 'materi';
  if (!SUBJECT_SLUGS.includes(slug)) return null;
  if (!section) return 'latsol';
  return section === 'materi' || section === 'praktikum' ? 'materi' : null;
}
