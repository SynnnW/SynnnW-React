// src/components/quiz/readerText.js
// Helper teks reader: id anchor stabil untuk heading (dasar deep link #anchor dan daftar isi). Murni, tanpa React.
const stripMd = (s) => String(s ?? '').replace(/\*\*|`/g, '').replace(/(^|\s)\*(\S)/g, '$1$2').replace(/(\S)\*(\s|$)/g, '$1$2');

/** Peta blok -> id untuk heading TINGKAT ATAS saja (heading di dalam accordion tertutup tidak ada di DOM, jadi tidak dipakai). */
export function buildHeadingIds(blocks = []) {
  const map = new Map();
  const seen = {};
  blocks.forEach((b) => {
    if (b.t !== 'h') return;
    const base = stripMd(b.x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'bagian';
    seen[base] = (seen[base] || 0) + 1;
    map.set(b, seen[base] > 1 ? `${base}-${seen[base]}` : base);
  });
  return map;
}

/** Item daftar isi dari heading nyata: [{ id, text }]. */
export const headingItems = (ids) => [...ids.entries()].map(([b, id]) => ({ id, text: stripMd(b.x) }));
