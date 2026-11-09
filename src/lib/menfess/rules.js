// ─── 26Menfess — Teks Aturan & Sambutan ─────────────────────────────────────
// Satu sumber kebenaran; dipakai di Landing, Login, RulesGate, dan halaman Aturan.
// Naikkan RULES_VERSION kalau isi aturan berubah → RulesGate akan muncul lagi.

export const RULES_VERSION = 1;

export const WELCOME_TITLE = 'Finally, Cakravala has its own manifest!';

export const WELCOME_TEXT = `Menfess ini bukan cuma untuk menyampaikan kritik, saran, atau aspirasi, tetapi juga jadi ruang bebas buat teman-teman mencurahkan isi hati, confess, sharing cerita, kirim songfess, request lagu, titip pesan, sampai sekadar having fun bareng.

Intinya, manifest ini milik kita bersama. Semuanya punya tempat di sini. Yuk, manfaatkan ruang ini dengan bijak, tetap saling menghargai, dan jangan lupa bawa vibes positif. Let's make this space as fun as our journey together! 🫶🏻`;

export const WHAT_IS_TEXT =
  'Secara sederhana, menfes atau mention confess di sini berfungsi sebagai media aspirasi dan ruang ekspresi bagi mahasiswa untuk saling berbagi pendapat, informasi, atau pesan secara terbuka melalui inisial. Ini adalah menfess untuk FKEP 2026.';

/** Aturan wajib (ditampilkan di modal RulesGate dan halaman Aturan). */
export const RULES = [
  {
    id: 1,
    title: 'No Cyberbullying & SARA',
    body: 'Dilarang keras melakukan penghinaan, ujaran kebencian, merendahkan fisik (body shaming), atau memicu konflik SARA.',
    suggested: false,
  },
  {
    id: 2,
    title: 'No Spreading Hate & Fitnah',
    body: 'Dilarang menjatuhkan nama baik seseorang atau menyebarkan rumor/berita palsu (hoax) yang belum tentu benar.',
    suggested: false,
  },
  {
    id: 3,
    title: 'No Doxxing',
    body: 'Dilarang menyebarkan data pribadi sensitif milik orang lain tanpa izin (seperti nomor HP, alamat rumah, akun pribadi untuk ujaran kebencian, dll).',
    suggested: false,
  },
  // suggested: true → mudah dihapus kalau tidak dipakai
  {
    id: 4,
    title: 'Tidak Ada Konten Dewasa',
    body: 'Tidak ada konten dewasa/vulgar/kekerasan.',
    suggested: true,
  },
  {
    id: 5,
    title: 'Tidak Ada Spam/Promosi',
    body: 'Tidak ada promosi, spam, atau jual-beli tanpa izin admin.',
    suggested: true,
  },
  {
    id: 6,
    title: 'Pakai Inisial',
    body: 'Sebut orang dengan inisial, bukan nama lengkap.',
    suggested: true,
  },
];

export const PROCESS_NOTES = [
  'Admin berhak menahan, menolak, atau menurunkan menfess tanpa pemberitahuan sebelumnya.',
  'Keputusan admin bersifat final.',
  'Menfess tayang berurutan dan tidak ada jaminan waktu tayang.',
  'Menfess yang sudah tayang tidak bisa ditarik oleh pengirim — hubungi admin jika ada keperluan mendesak.',
];

/** Label kategori (dipakai di composer, badge, filter). */
export const CATEGORIES = [
  { value: 'curhat',       label: 'Curhat/Confess' },
  { value: 'cerita',       label: 'Cerita' },
  { value: 'songfess',     label: 'Songfess' },
  { value: 'request_lagu', label: 'Request Lagu' },
  { value: 'titip_pesan',  label: 'Titip Pesan' },
  { value: 'kritik_saran', label: 'Kritik & Saran' },
  { value: 'tanya',        label: 'Tanya' },
  { value: 'info',         label: 'Info' },
  { value: 'fun',          label: 'Having Fun' },
  { value: 'lainnya',      label: 'Lainnya' },
];

export const SONG_CATEGORIES = new Set(['songfess', 'request_lagu']);

/** Alasan tolak baku untuk admin. */
export const REJECT_REASONS = [
  'Cyberbullying/SARA',
  'Hate/Fitnah',
  'Doxxing',
  'Konten dewasa',
  'Spam/promosi',
  'Duplikat',
  'Tidak jelas',
  'Lainnya',
];
