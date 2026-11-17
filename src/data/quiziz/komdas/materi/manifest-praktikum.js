// DIHASILKAN oleh scripts/materi/build.py
const manifestPraktikum = [
  { category: "Praktikum Komdas", babs: [
    { id: "p-sbar-tbak", label: "Komunikasi SBAR & TBAK", badge: "Praktikum", load: () => import('./bab-p-sbar-tbak.js') },
    { id: "p-sop-keluarga", label: "SOP: Komunikasi dengan Keluarga", badge: "Praktikum", load: () => import('./bab-keluarga.js') },
  ] },
];
export default manifestPraktikum;
