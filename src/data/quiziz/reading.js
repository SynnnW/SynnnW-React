// src/data/quiziz/reading.js
// Jejak baca ringan di localStorage. Hanya diisi reader saat sebuah bab benar-benar dibuka; tidak ada angka karangan.
// Kunci progres lama (`materi_progress_<slug>_<mode>`, nilai { [babId]: true }) dipertahankan apa adanya.
const LAST_KEY = 'quiziz_last_read_v1';
const PREFS_KEY = 'quiziz_reader_prefs_v1';

const clamp01 = (n) => Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));

/** Bab yang terakhir dibuka: { slug, mode, babId, at, pos } (pos = posisi baca 0..1) atau null. Validasi terhadap registry oleh pemanggil. */
export function getLastRead() {
  try {
    const v = JSON.parse(localStorage.getItem(LAST_KEY));
    return v && typeof v.slug === 'string' && typeof v.babId === 'string' && typeof v.at === 'number'
      ? { slug: v.slug, mode: v.mode === 'praktikum' ? 'praktikum' : 'materi', babId: v.babId, at: v.at, pos: clamp01(v.pos) }
      : null;
  } catch {
    return null;
  }
}

export function setLastRead({ slug, mode, babId, pos = 0 }) {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify({ slug, mode: mode === 'praktikum' ? 'praktikum' : 'materi', babId, at: Date.now(), pos: Math.round(clamp01(pos) * 1000) / 1000 }));
  } catch {
    /* penyimpanan penuh atau diblokir: abaikan */
  }
}

/** Id bab yang ditandai selesai (nilai truthy) di kunci progres reader. */
export function doneIds(slug, mode = 'materi') {
  try {
    const obj = JSON.parse(localStorage.getItem(`materi_progress_${slug}_${mode}`) || '{}');
    return Object.entries(obj || {}).filter(([, v]) => v).map(([k]) => k);
  } catch {
    return [];
  }
}

/** Preferensi baca: ukuran teks (salah satu FONT_STEPS) dan mode fokus. Tersimpan lokal. */
export const FONT_STEPS = [0.9, 1, 1.1, 1.2, 1.35];
export function getReaderPrefs() {
  try {
    const v = JSON.parse(localStorage.getItem(PREFS_KEY));
    return { font: FONT_STEPS.includes(v?.font) ? v.font : 1, focus: v?.focus === true };
  } catch {
    return { font: 1, focus: false };
  }
}
export function setReaderPrefs(p) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify({ font: FONT_STEPS.includes(p.font) ? p.font : 1, focus: p.focus === true })); } catch { /* abaikan */ }
}

/** Estimasi waktu baca dari jumlah kata nyata (≈200 kata/menit, minimal 1 menit). */
export const countWords = (text) => (String(text).match(/\S+/g) || []).length;
export const readingMinutes = (words) => Math.max(1, Math.round(words / 200));

/** Waktu relatif dalam bahasa Indonesia, mis. "2 hari lalu". */
export function relativeTime(ts, now = Date.now()) {
  const sec = Math.max(0, Math.round((now - ts) / 1000));
  if (sec < 60) return 'baru saja';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} menit lalu`;
  const jam = Math.round(min / 60);
  if (jam < 24) return `${jam} jam lalu`;
  const hari = Math.round(jam / 24);
  if (hari < 7) return `${hari} hari lalu`;
  if (hari < 30) return `${Math.round(hari / 7)} minggu lalu`;
  const bulan = Math.round(hari / 30);
  return bulan < 12 ? `${bulan} bulan lalu` : 'lebih dari setahun lalu';
}
