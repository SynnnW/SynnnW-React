// src/data/quiziz/materi/registry.js
// Daftar matkul yang punya halaman Materi. Manifest tiap matkul DIHASILKAN oleh scripts/materi/build.py
// dan hanya berisi bab yang kontennya sudah ada (bab "segera" ditandai `segera: true`).
import kdk from '../kdk/materi/manifest';
import komdas from '../komdas/materi/manifest';
import komdasPraktikum from '../komdas/materi/manifest-praktikum';
import ibd from '../ibd/materi/manifest';
import ibdPraktikum from '../ibd/materi/manifest-praktikum';
import kesglob from '../kesglob/materi/manifest';
import ftk from '../ftk/materi/manifest';

export const MATERI = {
  komdas:  { slug: 'komdas',  title: 'Komunikasi Dasar Keperawatan',   sub: 'Komunikasi terapeutik, budaya & multidisiplin', icon: '💬', manifest: komdas,  praktikum: komdasPraktikum },
  ibd:     { slug: 'ibd',     title: 'Ilmu Biomedik Dasar',            sub: 'Anatomi & fisiologi 12 sistem tubuh',            icon: '🧬', manifest: ibd,     praktikum: ibdPraktikum },
  kesglob: { slug: 'kesglob', title: 'Kesehatan Global',               sub: 'Indikator, AMR, PHC/UHC, ketenagaan',            icon: '🌍', manifest: kesglob,
           note: 'Presentasi dan makalah kelompok adalah karya mahasiswa, bukan materi dosen, jadi isinya belum tentu seluruhnya akurat. Untuk acuan, utamakan grup "Materi dosen".' },
  kdk:     { slug: 'kdk',     title: 'Konsep Dasar Keperawatan',       sub: 'Caring, profesi, etika & advokasi',              icon: '📋', manifest: kdk },
  ftk:     { slug: 'ftk',     title: 'Falsafah dan Teori Keperawatan', sub: 'Acuan ujian: Buku Teori Keperawatan (dosen)',    icon: '🩺', manifest: ftk,
           note: 'Acuan ujian FTK adalah Buku Teori Keperawatan dari dosen (BAB 1–14, grup paling atas). Ringkasan dari PPT dosen di bagian bawah hanya sumber tambahan, dan kalau berbeda, ikuti buku. Soal latihan dan kuncinya diambil dari lampiran buku; beberapa soal tidak ditampilkan karena teksnya terpotong di file buku.' },
};

export const hasBabs = (manifest = []) => manifest.some((g) => g.babs.some((b) => !b.segera));
export const countBabs = (manifest = []) => manifest.reduce((n, g) => n + g.babs.filter((b) => !b.segera).length, 0);
