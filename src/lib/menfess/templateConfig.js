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

// Area teks efektif dalam px untuk kanvas 1200×1500
export function safeAreaPx() {
  const { W, H, area, padX, padY } = CARD;
  const x  = area.left  * W  + padX * W;
  const y  = area.top   * H  + padY * H;
  const x2 = area.right * W  - padX * W;
  const y2 = area.bottom * H - padY * H;
  return { x, y, w: x2 - x, h: y2 - y };
}

/** Path SVG template. */
export const TEMPLATE_PATH = {
  pink:  '/26menfess/templates/pink.svg',
  green: '/26menfess/templates/green.svg',
};

/** Fallback gradient CSS kalau SVG gagal dimuat. */
export const FALLBACK_GRADIENT = {
  pink:  'linear-gradient(160deg, #D94C95 0%, #ECC8D7 55%, #F8E6EE 100%)',
  green: 'linear-gradient(160deg, #70B88E 0%, #CEDBA3 55%, #EFECB6 100%)',
};

/** Warna teks konstan (tidak terpengaruh dark/light mode HP). */
export const CARD_TEXT_COLOR = {
  dark:  '#1a1a2e',
  white: 'rgba(255,255,255,.92)',
};
