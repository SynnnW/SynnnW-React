// DIHASILKAN oleh scripts/materi/build.py
const manifestPraktikum = [
  { category: "Modul praktikum", babs: [
    { id: "p-saraf", label: "Praktikum Sistem Saraf", badge: "Praktikum", load: () => import('./bab-p-saraf.js') },
    { id: "p-endokrin", label: "Praktikum Sistem Endokrin", badge: "Praktikum", load: () => import('./bab-p-endokrin.js') },
    { id: "p-rangka", label: "Praktikum Sistem Rangka", badge: "Praktikum", load: () => import('./bab-p-rangka.js') },
    { id: "p-otot", label: "Praktikum Sistem Otot", badge: "Praktikum", load: () => import('./bab-p-otot.js') },
  ] },
];
export default manifestPraktikum;
