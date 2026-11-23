// src/data/quiziz/reading.js
// Jejak baca ringan di localStorage. Hanya diisi reader saat sebuah bab benar-benar dibuka; tidak ada angka karangan.
// Kunci progres lama (`materi_progress_<slug>_<mode>`, nilai { [babId]: true }) dipertahankan apa adanya.
const LAST_KEY = 'quiziz_last_read_v1';

/** Bab yang terakhir dibuka: { slug, mode, babId, at } atau null. Validasi terhadap registry dilakukan pemanggil. */
export function getLastRead() {
  try {
    const v = JSON.parse(localStorage.getItem(LAST_KEY));
    return v && typeof v.slug === 'string' && typeof v.babId === 'string' && typeof v.at === 'number' ? v : null;
  } catch {
    return null;
  }
}

export function setLastRead({ slug, mode, babId }) {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify({ slug, mode: mode === 'praktikum' ? 'praktikum' : 'materi', babId, at: Date.now() }));
  } catch {
    /* penyimpanan penuh atau diblokir: abaikan */
  }
}

/** Id bab yang ditandai selesai (nilai truthy) di kunci progres reader MateriMatkul. */
export function doneIds(slug, mode = 'materi') {
  try {
    const obj = JSON.parse(localStorage.getItem(`materi_progress_${slug}_${mode}`) || '{}');
    return Object.entries(obj || {}).filter(([, v]) => v).map(([k]) => k);
  } catch {
    return [];
  }
}

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
