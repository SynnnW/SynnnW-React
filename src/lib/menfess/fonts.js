// ─── 26Menfess — Font kartu (self-host lewat @fontsource, dimuat lazy) ────────
export const FONTS = [
  { id: 'nunito',   label: 'Nunito',    family: "'Nunito'",           weight: 800, load: () => import('@fontsource/nunito/latin-800.css') },
  { id: 'poppins',  label: 'Poppins',   family: "'Poppins'",          weight: 700, load: () => import('@fontsource/poppins/latin-700.css') },
  { id: 'playfair', label: 'Playfair',  family: "'Playfair Display'", weight: 700, load: () => import('@fontsource/playfair-display/latin-700.css') },
  { id: 'lora',     label: 'Lora',      family: "'Lora'",             weight: 600, load: () => import('@fontsource/lora/latin-600.css') },
  { id: 'mono',     label: 'Space Mono', family: "'Space Mono'",      weight: 700, load: () => import('@fontsource/space-mono/latin-700.css') },
  { id: 'bebas',    label: 'Bebas',     family: "'Bebas Neue'",       weight: 400, load: () => import('@fontsource/bebas-neue/latin-400.css') },
  { id: 'pacifico', label: 'Pacifico',  family: "'Pacifico'",         weight: 400, load: () => import('@fontsource/pacifico/latin-400.css') },
  { id: 'patrick',  label: 'Patrick Hand', family: "'Patrick Hand'",  weight: 400, load: () => import('@fontsource/patrick-hand/latin-400.css') },
  { id: 'caveat',   label: 'Caveat (tulisan tangan)', family: "'Caveat'", weight: 700, load: () => import('@fontsource/caveat/latin-700.css') },
];
export const FONT_IDS = FONTS.map(f => f.id);
export const getFont = (id) => FONTS.find(f => f.id === id) || FONTS[0];

// Font tulisan tangan untuk teks di dalam tanda petik "…"
export const QUOTE_FONT = { family: "'Caveat'", weight: 700, scale: 1.18, load: () => import('@fontsource/caveat/latin-700.css') };

const done = new Map();
/** Muat satu font (CSS + berkas font) — aman dipanggil berulang. */
export function ensureFont(f, px = 48) {
  const key = f.id || 'quote';
  if (!done.has(key)) {
    done.set(key, (async () => {
      try { await f.load(); } catch { /* lanjut dengan fallback */ }
      try { await document.fonts.load(`${f.weight} ${px}px ${f.family}`); } catch { /* ignore */ }
    })());
  }
  return done.get(key);
}
/** Pastikan font kartu + font tanda petik siap sebelum menggambar. */
export async function ensureCardFonts(fontId) {
  await Promise.all([ensureFont(getFont(fontId)), ensureFont(QUOTE_FONT)]);
}
export async function ensureAllFonts() { await Promise.all(FONTS.map(f => ensureFont(f))); }
