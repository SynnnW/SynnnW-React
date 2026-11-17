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
];
export default manifest;
