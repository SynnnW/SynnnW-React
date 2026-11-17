// DIHASILKAN oleh scripts/materi/build.py
const manifest = [
  { category: "Cakupan UTS", babs: [
    { id: "konsep-dasar", label: "Konsep Dasar Ilmu Biomedik", badge: "UTS", load: () => import('./bab-konsep-dasar.js') },
    { id: "persarafan", label: "Sistem Persarafan", badge: "UTS", load: () => import('./bab-persarafan.js') },
    { id: "pencernaan", label: "Sistem Pencernaan, Biokimia & Gizi", badge: "UTS", load: () => import('./bab-pencernaan.js') },
    { id: "endokrin", label: "Sistem Endokrin", badge: "UTS", load: () => import('./bab-endokrin.js') },
    { id: "rangka", label: "Sistem Rangka", badge: "UTS", load: () => import('./bab-rangka.js') },
    { id: "otot", label: "Sistem Otot", badge: "UTS", load: () => import('./bab-otot.js') },
    { id: "kardiovaskular", label: "Sistem Kardiovaskular", badge: "UTS", load: () => import('./bab-kardiovaskular.js') },
  ] },
  { category: "Cakupan UAS", babs: [
    { id: "indera", label: "Sistem Indera", badge: "UAS", load: () => import('./bab-indera.js') },
    { id: "perkemihan", label: "Sistem Perkemihan", badge: "UAS", load: () => import('./bab-perkemihan.js') },
    { id: "pernapasan", label: "Sistem Pernapasan", badge: "UAS", load: () => import('./bab-pernapasan.js') },
    { id: "reproduksi", label: "Sistem Reproduksi", badge: "UAS", load: () => import('./bab-reproduksi.js') },
    { id: "hematologi", label: "Hematologi, Limfatik & Imunologi Dasar", badge: "UAS", load: () => import('./bab-hematologi.js') },
    { id: "integumen", label: "Sistem Integumen", badge: "UAS", load: () => import('./bab-integumen.js') },
    { id: "cairan", label: "Keseimbangan Cairan, Elektrolit & Asam-Basa", badge: "UAS", load: () => import('./bab-cairan.js') },
  ] },
];
export default manifest;
