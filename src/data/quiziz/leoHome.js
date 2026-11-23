// src/data/quiziz/leoHome.js
// Bahan Leo di beranda Quiziz: teks katalog (rujukan model) dan chip tautan. Semua data matkul datang dari
// registry tunggal (registry.js), jadi status materi/latsol selalu sama dengan yang dilihat pengguna di halaman.
// Tautan chip dibuat dari katalog ini, tidak pernah dari teks balasan model.
import { SUBJECTS } from './registry';

/** Teks grounding untuk Leo (dikirim sebagai rujukan; server menganggapnya data, bukan perintah). */
export const CATALOG_TEXT = [
  'DAFTAR MATA KULIAH DI QUIZIZ (data nyata dari website, urutan tetap):',
  ...SUBJECTS.map((s) => {
    const materi = s.materi ? `ada${s.materi.babs ? ` (${s.materi.babs} bab)` : ''}` : 'belum ada';
    const prak = s.praktikum ? ` · Praktikum: ada (${s.praktikum.modul} modul)` : '';
    const latsol = s.latsol ? `tersedia (${s.latsol.label})` : 'belum tersedia';
    return `- ${s.name}${s.short === s.name ? '' : ` (${s.short})`} — Materi: ${materi}${prak} · Latsol: ${latsol}`;
  }),
  'Beberapa bab materi memuat latihan soal di dalam halaman bab; itu terpisah dari Latsol.',
  'Quiziz UAS: belum tersedia (segera hadir).',
  'Cara pakai: beranda Quiziz berisi daftar mata kuliah dengan filter (Semua, Ada materi, Ada latsol, Praktikum). Pilih matkul, lalu baca materi per bab (halaman materi punya Leo AI sendiri) atau kerjakan Latsol per TM. Tombol cari (Ctrl atau ⌘ + K, atau tombol "/") mencari matkul dan bab. Matkul yang belum punya materi atau latsol ditandai "belum ada" atau "belum tersedia".',
].join('\n');

const norm = (s) => ` ${String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()} `;

/** Matkul yang disebut pengguna di pesannya sendiri (kata utuh, maks `max`). */
export function matchSubjects(text, max = 2) {
  const t = norm(text);
  return SUBJECTS.filter((s) => s.alias.some((a) => t.includes(` ${a} `))).slice(0, max);
}

/** Chip tautan: hanya untuk target yang benar-benar ada (tidak ada chip mati). */
export function linksFor(subjects) {
  const out = [];
  subjects.forEach((s) => {
    if (s.materi) out.push({ label: `Buka materi ${s.short}`, to: s.materi.path });
    if (s.praktikum) out.push({ label: `Praktikum ${s.short}`, to: s.praktikum.path });
    if (s.latsol) out.push({ label: `Latsol ${s.short}`, to: s.latsol.path });
  });
  return out.slice(0, 4);
}
