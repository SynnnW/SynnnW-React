// ─── 26Menfess — Konfigurasi Template Kartu ──────────────────────────────────
// Semua nilai diambil dari referensi HTML "26menfess — Card Preview.html".
// Ubah di sini untuk kalibrasi — tidak perlu menyentuh renderCard.js.

export const CARD = {
  W: 1200,
  H: 1500,
  // Area teks efektif (persen 0–1 relatif W/H)
  area: { top: 0.15, bottom: 0.899, left: 0.103, right: 0.897 },
  // Padding dalam area (persen × W dan × H)
  padX: 0.06,
  padY: 0.04,
  lineHeight: 1.52,
  fontFamily: "'Nunito', sans-serif",
  fontWeight: '800',
  // Ukuran font di kanvas 1200px (px)
  sizes: { xs: 44, sm: 56, md: 68, lg: 84 },
  colors: {
    dark:  '#1a1a2e',
    white: 'rgba(255,255,255,.92)',
  },
};

// Area panel kaca per tema (pecahan W/H). Tema tanpa entri memakai CARD.area.
// picnic: panel kaca mulai di bawah logo/pil (±24%), stroberi di kanan masuk sedikit ke panel,
// jadi padding kanan/kiri dilebihkan lewat `pad` agar teks tidak menyentuh dekorasi.
export const DESIGN_AREA = {
  picnic: { area: { top: 0.245, bottom: 0.915, left: 0.092, right: 0.92 }, padX: 0.06, padY: 0.04 },
};

// Area teks (barrier) dalam px untuk kanvas 1200×1500, per tema
export function safeAreaPx(design) {
  const { W, H } = CARD;
  const cfg = DESIGN_AREA[design] || { area: CARD.area, padX: CARD.padX, padY: CARD.padY };
  const { area, padX, padY } = cfg;
  const x  = area.left  * W  + padX * W;
  const y  = area.top   * H  + padY * H;
  const x2 = area.right * W  - padX * W;
  const y2 = area.bottom * H - padY * H;
  return { x, y, w: x2 - x, h: y2 - y };
}

/** Daftar tema kartu untuk picker (id = nilai kolom `design`). */
export const DESIGNS = [
  { id: 'pink',   label: 'Pink' },
  { id: 'green',  label: 'Hijau' },
  { id: 'picnic', label: 'Piknik' },
];

/** Path SVG template. */
export const TEMPLATE_PATH = {
  pink:   '/26menfess/templates/pink.svg',
  green:  '/26menfess/templates/green.svg',
  picnic: '/26menfess/templates/picnic.webp', // hasil render ringan (aslinya SVG 396 MB)
};

/** Versi kecil (600×750) untuk preview/thumbnail; versi penuh hanya dimuat saat unduh. */
export const TEMPLATE_PATH_SMALL = {
  picnic: '/26menfess/templates/picnic-s.webp',
};

/** Pilih berkas template sesuai skala render (hemat bandwidth di HP). */
export function templateSrc(design, scale = 1) {
  if (scale <= 0.5 && TEMPLATE_PATH_SMALL[design]) return TEMPLATE_PATH_SMALL[design];
  return TEMPLATE_PATH[design] || TEMPLATE_PATH.pink;
}

/** Thumbnail kecil untuk picker (hemat bandwidth). */
export const TEMPLATE_THUMB = {
  picnic: '/26menfess/templates/picnic-thumb.webp',
};

/** Fallback gradient CSS kalau SVG gagal dimuat. */
export const FALLBACK_GRADIENT = {
  pink:  'linear-gradient(160deg, #D94C95 0%, #ECC8D7 55%, #F8E6EE 100%)',
  green: 'linear-gradient(160deg, #70B88E 0%, #CEDBA3 55%, #EFECB6 100%)',
  picnic: 'linear-gradient(160deg, #3F6B1E 0%, #7FA05A 55%, #C9D8A8 100%)',
};

/** Warna teks konstan (tidak terpengaruh dark/light mode HP). */
export const CARD_TEXT_COLOR = {
  dark:  '#1a1a2e',
  white: 'rgba(255,255,255,.92)',
};
