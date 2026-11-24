// src/data/quiziz/registry.js
// Registry matkul TUNGGAL untuk Quiziz: daftar, urutan, ikon, kata kunci, URL, dan status materi/praktikum/latsol.
// Ini adapter di atas data yang sudah ada (materi/registry.js + manifest latsol), BUKAN salinan: status dibaca
// dari kode sehingga ikut berubah saat konten ditambahkan. Dipakai beranda dan Leo; Fase 2 (katalog + command palette) menyusul.
// Menambah matkul: daftarkan slug di routes.js, buat rutenya di App.jsx, lalu isi META di bawah. `npm run check:quiziz` menjaga ketiganya selaras.
import { MATERI, countBabs } from './materi/registry';
import { availableTM as tmBing } from './bahasaInggris/manifest';
import { availableTM as tmPai } from './pai/manifest';
import { availableTM as tmKdk } from './kdk/manifest';
import { availableTM as tmPancasila } from './pancasila/manifest';
import { availableTM as tmKesglob } from './kesglob/manifest';
import { availableTM as tmIbd } from './ibd/manifest';
import { availableTM as tmKomdas } from './komdas/manifest';
import { topics as INGGRIS_TOPICS } from './bahasaInggris/tm01/topics';
import { NAV_ITEMS, PATHS, SUBJECT_SLUGS, babPath, latsolPath, materiPath, praktikumPath } from './routes';
import { doneIds, getLastRead, relativeTime } from './reading';

// FTK memakai skema lain: latsol per bab (folder ftk/<bab>/soal-latihan.js). Glob tanpa eager = hanya daftar nama file.
const FTK_LATSOL = Object.keys(import.meta.glob('./ftk/*/soal-latihan.js'));

// Hanya yang tidak ada di data materi: nama/ikon bawaan untuk matkul tanpa materi, nama pendek, kata kunci, dan daftar TM latsol.
const META = {
  bahasainggris: { name: 'Bahasa Inggris', short: 'Bahasa Inggris', icon: '🇬🇧', alias: ['bahasa inggris', 'inggris', 'english'], tm: tmBing },
  pai: { name: 'Pendidikan Agama Islam', short: 'PAI', icon: '🕌', alias: ['pai', 'agama islam', 'pendidikan agama'], tm: tmPai },
  ftk: { short: 'FTK', alias: ['ftk', 'falsafah', 'teori keperawatan'], tm: FTK_LATSOL },
  kdk: { short: 'KDK', alias: ['kdk', 'konsep dasar'], tm: tmKdk },
  pancasila: { name: 'Pendidikan Pancasila', short: 'Pancasila', icon: '🇮🇩', alias: ['pancasila'], tm: tmPancasila },
  kesglob: { short: 'Kesehatan Global', alias: ['kesglob', 'kesehatan global'], tm: tmKesglob },
  ibd: { short: 'IBD', alias: ['ibd', 'biomedik'], tm: tmIbd },
  komdas: { short: 'Komdas', alias: ['komdas', 'komunikasi dasar', 'komunikasi terapeutik'], tm: tmKomdas },
};

/**
 * Daftar matkul, urutan tetap. Bentuk:
 * { slug, name, short, icon, alias,
 *   materi:    { path, babs } | null      (babs = 0 bila jumlahnya tidak diketahui, mis. Bahasa Inggris)
 *   praktikum: { path, modul } | null
 *   latsol:    { path, label } | null     (null = belum ada latsol; halamannya tetap ada sebagai Coming Soon)
 *   paths:     { latsol }                 (rute halaman latsol selalu valid) }
 */
export const SUBJECTS = SUBJECT_SLUGS.map((slug) => {
  const meta = META[slug];
  const m = MATERI[slug];
  const babs = slug === 'bahasainggris' ? INGGRIS_TOPICS.reduce((n, c) => n + c.topics.length, 0) : m ? countBabs(m.manifest) : 0;
  const modul = m?.praktikum ? countBabs(m.praktikum) : 0;
  return {
    slug,
    name: m?.title || meta.name,
    short: meta.short,
    icon: m?.icon || meta.icon,
    alias: meta.alias,
    materi: slug === 'bahasainggris' || babs > 0 ? { path: materiPath(slug), babs } : null,
    praktikum: modul > 0 ? { path: praktikumPath(slug), modul } : null,
    latsol: meta.tm.length ? { path: latsolPath(slug), label: slug === 'ftk' ? `${meta.tm.length} bab` : `TM ${meta.tm.join(', ')}` } : null,
    paths: { latsol: latsolPath(slug) },
  };
});

export const getSubject = (slug) => SUBJECTS.find((s) => s.slug === slug) || null;

export { NAV_ITEMS, PATHS };

let babCache = null;
/** Daftar bab (tanpa isi) untuk pencarian dan "Lanjutkan". Bab bertanda `segera` tidak ikut. Bentuk: { slug, mode, id, label, category }. */
export function listBabs() {
  if (!babCache) {
    babCache = [];
    SUBJECTS.forEach((s) => {
      const m = s.slug === 'bahasainggris'
        ? { manifest: INGGRIS_TOPICS.map((n) => ({ category: n.category, babs: n.topics.map((t) => ({ id: t.id, label: t.label })) })) }
        : MATERI[s.slug];
      if (!m) return;
      [['materi', m.manifest], ['praktikum', m.praktikum]].forEach(([mode, groups]) => {
        (groups || []).forEach((g) => g.babs.forEach((b) => {
          if (!b.segera) babCache.push({ slug: s.slug, mode, id: b.id, label: b.label, category: g.category });
        }));
      });
    });
  }
  return babCache;
}
export const findBab = (slug, mode, id) => listBabs().find((b) => b.slug === slug && b.mode === mode && b.id === id) || null;

/** Jumlah bab yang ditandai selesai di reader (hanya id yang masih ada di manifest; kunci progres lama dipertahankan). */
export function doneCount(slug, mode = 'materi') {
  const live = new Set(listBabs().filter((b) => b.slug === slug && b.mode === mode).map((b) => b.id));
  return doneIds(slug, mode).filter((id) => live.has(id)).length;
}

/** Filter katalog beranda. Dihitung dari status registry, jadi ikut berubah saat konten bertambah. */
export const FILTERS = [
  { id: 'semua', label: 'Semua', test: () => true },
  { id: 'materi', label: 'Ada materi', test: (s) => !!s.materi },
  { id: 'latsol', label: 'Ada latsol', test: (s) => !!s.latsol },
  { id: 'praktikum', label: 'Praktikum', test: (s) => !!s.praktikum },
];

/** Bacaan terakhir yang benar-benar tersimpan dan masih valid terhadap registry; selain itu null (tidak ada kartu kosong). */
export function resolveLastRead() {
  const last = getLastRead();
  const subject = last && getSubject(last.slug);
  const bab = subject && findBab(last.slug, last.mode, last.babId);
  return bab ? { subject, bab, to: babPath(last.slug, last.mode, last.babId), ago: relativeTime(last.at) } : null;
}

/** Semua path internal (tanpa query) yang bisa dihasilkan registry dan navigasi: [label, path]. Dicek terhadap router. */
/** Pangkalan reader yang wajib mendukung deep link `/:babId` di router (App.jsx). */
export function deepLinkBases() {
  return SUBJECTS.flatMap((s) => [s.materi && s.materi.path, s.praktikum && s.praktikum.path].filter(Boolean));
}

export function allPaths() {
  const out = [
    ...NAV_ITEMS.map((n) => [`nav:${n.id}`, n.to.split('?')[0]]),
    ['alias:materiHub', PATHS.materiHub],
    ['masuk', PATHS.masuk],
    ['kuesioner', PATHS.kuesioner],
  ];
  SUBJECTS.forEach((s) => {
    out.push([`${s.slug}:latsol`, s.paths.latsol]);
    if (s.materi) out.push([`${s.slug}:materi`, s.materi.path]);
    if (s.praktikum) out.push([`${s.slug}:praktikum`, s.praktikum.path]);
  });
  return out;
}
