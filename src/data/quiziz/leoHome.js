// src/data/quiziz/leoHome.js
// Katalog ringkas untuk Leo di beranda Quiziz. Status materi/praktikum/latsol DIBACA dari data nyata
// (registry materi + manifest latsol), bukan diketik ulang, jadi ikut berubah saat konten baru ditambahkan.
// Tautan chip dibuat dari katalog ini, tidak pernah dari teks balasan model.
import { MATERI, countBabs } from './materi/registry';
import { availableTM as tmBing } from './bahasaInggris/manifest';
import { availableTM as tmPai } from './pai/manifest';
import { availableTM as tmKdk } from './kdk/manifest';
import { availableTM as tmPancasila } from './pancasila/manifest';
import { availableTM as tmKesglob } from './kesglob/manifest';
import { availableTM as tmIbd } from './ibd/manifest';
import { availableTM as tmKomdas } from './komdas/manifest';

// FTK memakai skema lain: latsol per bab (folder ftk/<bab>/soal-latihan.js). Glob tanpa eager = hanya daftar nama file.
const FTK_LATSOL = Object.keys(import.meta.glob('./ftk/*/soal-latihan.js'));

// Urutan tetap, sama dengan daftar matkul di beranda.
const BASE = [
  { slug: 'bahasainggris', name: 'Bahasa Inggris', short: 'Bahasa Inggris', alias: ['bahasa inggris', 'inggris', 'english'], tm: tmBing, materiPath: '/quiziz/bahasainggris/materi' },
  { slug: 'pai', name: 'Pendidikan Agama Islam', short: 'PAI', alias: ['pai', 'agama islam', 'pendidikan agama'], tm: tmPai },
  { slug: 'ftk', short: 'FTK', alias: ['ftk', 'falsafah', 'teori keperawatan'], tm: FTK_LATSOL },
  { slug: 'kdk', short: 'KDK', alias: ['kdk', 'konsep dasar'], tm: tmKdk },
  { slug: 'pancasila', name: 'Pendidikan Pancasila', short: 'Pancasila', alias: ['pancasila'], tm: tmPancasila },
  { slug: 'kesglob', short: 'Kesehatan Global', alias: ['kesglob', 'kesehatan global'], tm: tmKesglob },
  { slug: 'ibd', short: 'IBD', alias: ['ibd', 'biomedik'], tm: tmIbd },
  { slug: 'komdas', short: 'Komdas', alias: ['komdas', 'komunikasi dasar', 'komunikasi terapeutik'], tm: tmKomdas },
];

export const HOME_SUBJECTS = BASE.map((b) => {
  const m = MATERI[b.slug];
  const babs = m ? countBabs(m.manifest) : 0;
  const modul = m?.praktikum ? countBabs(m.praktikum) : 0;
  return {
    slug: b.slug,
    name: b.name || m?.title || b.short,
    short: b.short,
    alias: b.alias,
    materi: b.materiPath || babs > 0 ? { path: b.materiPath || `/quiziz/${b.slug}/materi`, babs } : null,
    praktikum: modul > 0 ? { path: `/quiziz/${b.slug}/praktikum`, modul } : null,
    latsol: b.tm.length ? { path: `/quiziz/${b.slug}`, label: b.slug === 'ftk' ? `${b.tm.length} bab` : `TM ${b.tm.join(', ')}` } : null,
  };
});

/** Teks grounding untuk Leo (dikirim sebagai rujukan; server menganggapnya data, bukan perintah). */
export const CATALOG_TEXT = [
  'DAFTAR MATA KULIAH DI QUIZIZ (data nyata dari website, urutan tetap):',
  ...HOME_SUBJECTS.map((s) => {
    const materi = s.materi ? `ada${s.materi.babs ? ` (${s.materi.babs} bab)` : ''}` : 'belum ada';
    const prak = s.praktikum ? ` · Praktikum: ada (${s.praktikum.modul} modul)` : '';
    const latsol = s.latsol ? `tersedia (${s.latsol.label})` : 'belum tersedia';
    return `- ${s.name}${s.short === s.name ? '' : ` (${s.short})`} — Materi: ${materi}${prak} · Latsol: ${latsol}`;
  }),
  'Beberapa bab materi memuat latihan soal di dalam halaman bab; itu terpisah dari Latsol.',
  'Quiziz UAS: belum tersedia (segera hadir).',
  'Cara pakai: pilih "Materi" untuk membaca per bab (halaman materi punya Leo AI sendiri), atau pilih "Quiziz" untuk latihan soal (Latsol): pilih mata kuliah lalu TM. Mata kuliah yang latsol-nya belum tersedia tampil sebagai Coming Soon.',
].join('\n');

const norm = (s) => ` ${String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()} `;

/** Matkul yang disebut pengguna di pesannya sendiri (kata utuh, maks `max`). */
export function matchSubjects(text, max = 2) {
  const t = norm(text);
  return HOME_SUBJECTS.filter((s) => s.alias.some((a) => t.includes(` ${a} `))).slice(0, max);
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
