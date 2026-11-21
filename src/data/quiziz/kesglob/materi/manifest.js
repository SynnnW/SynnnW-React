// DIHASILKAN oleh scripts/materi/build.py
const manifest = [
  { category: "Materi dosen", babs: [
    { id: "konsep", label: "Konsep, Sejarah, Ruang Lingkup & Prinsip", badge: "Minggu 1", load: () => import('./bab-konsep.js') },
    { id: "indikator", label: "Indikator Kesehatan Global, GHO, DALY & UHC Index", badge: "Minggu 2", load: () => import('./bab-indikator.js') },
    { id: "amr-ipc", label: "Resistensi Antimikroba & IPC", badge: "Minggu 5", load: () => import('./bab-amr-ipc.js') },
    { id: "daur-hidup", label: "Daur Kehidupan & Kelompok Rentan", badge: "Minggu 6", load: () => import('./bab-daur-hidup.js') },
    { id: "phc-uhc", label: "Sistem Kesehatan, PHC & UHC", badge: "Minggu 7", load: () => import('./bab-phc-uhc.js') },
    { id: "ketenagaan", label: "Ketenagaan Kesehatan Global", badge: "Minggu 9", load: () => import('./bab-ketenagaan.js') },
  ] },
  { category: "Dokumen kuliah tambahan", babs: [
    { id: "emerging", label: "Emerging dan Re-emerging Diseases", badge: "Dokumen", load: () => import('./bab-emerging.js') },
    { id: "ptm", label: "Penyakit Tidak Menular", badge: "Dokumen", load: () => import('./bab-ptm.js') },
    { id: "panduan-ptm", label: "Panduan PTM dan Faktor Risiko", badge: "Panduan", load: () => import('./bab-panduan-ptm.js') },
    { id: "lkm", label: "LKM Kesehatan Global", badge: "LKM", load: () => import('./bab-lkm.js') },
  ] },
  { category: "Presentasi kelompok mahasiswa", babs: [
    { id: "klp1", label: "Penyakit Menular, Keamanan Kesehatan, Surveilans, dan Kesiapan Wabah", badge: "Kelompok 1", load: () => import('./bab-klp1.js') },
    { id: "klp2", label: "Keperawatan Migran pada Bencana, Konflik, dan Krisis Kemanusiaan", badge: "Kelompok 2", load: () => import('./bab-klp2.js') },
    { id: "klp3", label: "Perubahan Iklim, Kesehatan Lingkungan, dan Panas Ekstrem", badge: "Kelompok 3", load: () => import('./bab-klp3.js') },
    { id: "klp4", label: "Ketenagaan, Migrasi, dan Resistensi Antimikroba", badge: "Kelompok 4", load: () => import('./bab-klp4.js') },
  ] },
  { category: "Makalah kelompok mahasiswa", babs: [
    { id: "mk2", label: "Makalah Kelompok 2: Keperawatan Migran pada Bencana dan Konflik", badge: "Kelompok 2", load: () => import('./bab-mk2.js') },
    { id: "mk4", label: "Makalah Kelompok 4: Ketenagaan Keperawatan Global, Migrasi, dan AMR", badge: "Kelompok 4", load: () => import('./bab-mk4.js') },
  ] },
];
export default manifest;
