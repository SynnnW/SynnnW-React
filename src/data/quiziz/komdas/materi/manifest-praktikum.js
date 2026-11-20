// DIHASILKAN oleh scripts/materi/build.py
const manifestPraktikum = [
  { category: "Praktikum Komdas", babs: [
    { id: "p-tm5", label: "Praktikum Komunikasi Sosial Budaya (TM 5)", badge: "TM 5", load: () => import('./bab-p-tm5.js') },
    { id: "p-sbar-tbak", label: "Ringkasan SBAR & TBAK", badge: "TM 7 ringkasan", load: () => import('./bab-p-sbar-tbak.js') },
    { id: "p-tm7a", label: "Praktikum Komunikasi Multidisiplin: Slide 1–7 (TM 7)", badge: "TM 7", load: () => import('./bab-p-tm7a.js') },
    { id: "p-tm7b", label: "Praktikum Komunikasi Multidisiplin: Slide 8–13 (TM 7)", badge: "TM 7", load: () => import('./bab-p-tm7b.js') },
    { id: "p-sop-keluarga", label: "SOP Praktikum: Komunikasi dengan Keluarga (TM 12)", badge: "TM 12", load: () => import('./bab-p-sop-keluarga.js') },
  ] },
];
export default manifestPraktikum;
