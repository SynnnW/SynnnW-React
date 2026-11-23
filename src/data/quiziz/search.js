// src/data/quiziz/search.js
// Indeks pencarian command palette. Hanya METADATA (matkul, judul bab, aktivitas, halaman): isi bab tidak dimuat di sini,
// jadi tidak ada beban saat halaman dibuka. Semua entri datang dari registry, tidak ada daftar tulisan tangan selain halaman.
import { SUBJECTS, listBabs } from './registry';
import { PATHS, babPath } from './routes';

export const GROUPS = [['matkul', 'Mata kuliah'], ['bab', 'Bab'], ['aktivitas', 'Aktivitas'], ['halaman', 'Halaman']];
const LIMIT = { matkul: 8, bab: 6, aktivitas: 5, halaman: 5 };

export const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

let cache = null;
export function buildIndex() {
  if (cache) return cache;
  const items = [];
  const add = (group, title, where, to, extra = '', matchWhere = true) => items.push({ id: `${group}|${to}|${title}`, group, title, where, to, titleKey: norm(title), key: norm(`${title} ${matchWhere ? where : ''} ${extra}`) });

  SUBJECTS.forEach((s) => {
    const parts = [
      s.materi ? `Materi${s.materi.babs ? ` ${s.materi.babs} bab` : ''}` : 'Materi belum ada',
      ...(s.praktikum ? [`Praktikum ${s.praktikum.modul} modul`] : []),
      s.latsol ? `Latsol ${s.latsol.label}` : 'Latsol belum tersedia',
    ];
    // Matkul tanpa konten tetap bisa dicari: tujuannya halaman latsol lama yang memang menampilkan "Coming Soon" dengan jujur.
    add('matkul', s.name, parts.join(' · '), s.materi?.path || s.paths.latsol, [s.short, ...s.alias].join(' '), false); // teks status tidak ikut dicocokkan ("latsol" tidak boleh memunculkan semua matkul)
    if (s.materi) add('aktivitas', `Materi ${s.short}`, `${s.name} · baca per bab`, s.materi.path, s.alias.join(' '));
    if (s.praktikum) add('aktivitas', `Praktikum ${s.short}`, `${s.name} · ${s.praktikum.modul} modul`, s.praktikum.path, s.alias.join(' '));
    if (s.latsol) add('aktivitas', `Latsol ${s.short}`, `${s.name} · ${s.latsol.label}`, s.latsol.path, s.alias.join(' '));
  });
  listBabs().forEach((b) => {
    const s = SUBJECTS.find((x) => x.slug === b.slug);
    add('bab', b.label, `${s.short} · ${b.mode === 'praktikum' ? 'Praktikum · ' : ''}${b.category}`, babPath(b.slug, b.mode, b.id), s.alias.join(' '));
  });
  [
    ['Beranda Quiziz', 'Katalog mata kuliah dan Leo', PATHS.beranda],
    ['Materi', 'Mata kuliah yang punya materi', PATHS.berandaMateri],
    ['Latsol', 'Mata kuliah yang punya latihan soal', PATHS.latsolLama],
    ['Quiziz UAS', 'Belum tersedia', PATHS.uas],
    ['Website utama', 'Keluar dari Quiziz', '/'],
  ].forEach(([title, where, to]) => add('halaman', title, where, to));
  cache = items;
  return items;
}

/** Hasil pencarian terkelompok: [{ id, label, items }]. Query kosong = saran awal (matkul + halaman). */
export function search(query) {
  const idx = buildIndex();
  const q = norm(query);
  const tokens = q ? q.split(' ') : [];
  const scored = [];
  idx.forEach((it) => {
    if (!tokens.length) {
      if (it.group === 'matkul' || it.group === 'halaman') scored.push([0, it]);
      return;
    }
    let total = 0;
    for (const t of tokens) {
      if (it.titleKey.startsWith(t)) total += 0;
      else if (it.titleKey.includes(` ${t}`)) total += 1;
      else if (it.titleKey.includes(t)) total += 2;
      else if (it.key.includes(t)) total += 4;
      else return;
    }
    scored.push([total, it]);
  });
  return GROUPS.map(([id, label]) => ({
    id,
    label,
    items: scored.filter(([, it]) => it.group === id).sort((a, b) => a[0] - b[0]).slice(0, LIMIT[id]).map(([, it]) => it),
  })).filter((g) => g.items.length);
}
