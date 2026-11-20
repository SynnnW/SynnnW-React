// DIHASILKAN oleh scripts/materi/build.py
const manifestPraktikum = [
  { category: "Modul praktikum", babs: [
    { id: "p-saraf", label: "Praktikum Sistem Saraf", badge: "Praktikum", load: () => import('./bab-p-saraf.js') },
    { id: "p-endokrin", label: "Praktikum Sistem Endokrin", badge: "Praktikum", load: () => import('./bab-p-endokrin.js') },
    { id: "p-rangka", label: "Praktikum Sistem Rangka", badge: "Praktikum", load: () => import('./bab-p-rangka.js') },
    { id: "p-otot", label: "Praktikum Sistem Otot", badge: "Praktikum", load: () => import('./bab-p-otot.js') },
    { id: "p-pencernaan", label: "Praktikum Sistem Pencernaan", badge: "Praktikum", load: () => import('./bab-p-pencernaan.js') },
    { id: "p-kardiovaskular", label: "Praktikum Sistem Kardiovaskular", badge: "Praktikum", load: () => import('./bab-p-kardiovaskular.js') },
    { id: "p-respirasi", label: "Praktikum Sistem Respirasi", badge: "Praktikum", load: () => import('./bab-p-respirasi.js') },
    { id: "p-perkemihan", label: "Praktikum Sistem Perkemihan", badge: "Praktikum", load: () => import('./bab-p-perkemihan.js') },
    { id: "p-penginderaan", label: "Praktikum Sistem Penginderaan", badge: "Praktikum", load: () => import('./bab-p-penginderaan.js') },
    { id: "p-reproduksi", label: "Praktikum Sistem Reproduksi", badge: "Praktikum", load: () => import('./bab-p-reproduksi.js') },
    { id: "p-integumen", label: "Praktikum Sistem Integumen", badge: "Praktikum", load: () => import('./bab-p-integumen.js') },
  ] },
  { category: "Panduan pengerjaan LKP", babs: [
    { id: "p-pandu-umum", label: "Panduan Pengerjaan Tugas LKP (umum)", badge: "Panduan", load: () => import('./bab-p-pandu-umum.js') },
    { id: "p-pandu-endokrin", label: "Panduan LKP Endokrin", badge: "Panduan", load: () => import('./bab-p-pandu-endokrin.js') },
    { id: "p-pandu-otot", label: "Panduan LKP Otot", badge: "Panduan", load: () => import('./bab-p-pandu-otot.js') },
    { id: "p-pandu-pencernaan", label: "Panduan LKP Pencernaan", badge: "Panduan", load: () => import('./bab-p-pandu-pencernaan.js') },
    { id: "p-pandu-kardiovaskular", label: "Panduan LKP Kardiovaskular", badge: "Panduan", load: () => import('./bab-p-pandu-kardiovaskular.js') },
    { id: "p-pandu-pernapasan", label: "Panduan LKP Pernapasan", badge: "Panduan", load: () => import('./bab-p-pandu-pernapasan.js') },
    { id: "p-pandu-perkemihan", label: "Panduan LKP Perkemihan", badge: "Panduan", load: () => import('./bab-p-pandu-perkemihan.js') },
    { id: "p-pandu-penginderaan", label: "Petunjuk LKP Penginderaan", badge: "Panduan", load: () => import('./bab-p-pandu-penginderaan.js') },
  ] },
];
export default manifestPraktikum;
