// DIHASILKAN oleh scripts/materi/build.py
const manifest = [
  { category: "Sebelum UTS (TM 1–7)", babs: [
    { id: "konsep-dasar", label: "Konsep Dasar Komunikasi", badge: "TM 1", load: () => import('./bab-konsep-dasar.js') },
    { id: "jenis", label: "Jenis Komunikasi: Verbal & Non-Verbal", badge: "TM 2", load: () => import('./bab-jenis.js') },
    { id: "terapeutik", label: "Konsep Komunikasi Terapeutik", badge: "TM 3", load: () => import('./bab-terapeutik.js') },
    { id: "faktor", label: "Faktor yang Memengaruhi Komunikasi Efektif", badge: "TM 4", load: () => import('./bab-faktor.js') },
    { id: "sosial-budaya", label: "Komunikasi dalam Konteks Sosial & Budaya", badge: "TM 5", load: () => import('./bab-sosial-budaya.js') },
    { id: "agronursing", label: "Nilai, Norma & Komunikasi Budaya Agronursing", badge: "TM 6", load: () => import('./bab-agronursing.js') },
    { id: "multidisiplin", label: "Komunikasi dalam Pelayanan Multidisiplin", badge: "TM 7", load: () => import('./bab-multidisiplin.js') },
  ] },
  { category: "Setelah UTS", babs: [
    { id: "tren-isu", label: "Perspektif, Tren & Isu Komunikasi Pelayanan Kesehatan", badge: "TM 9", load: () => import('./bab-tren-isu.js') },
    { id: "tren-agronursing", label: "Tren & Isu Komunikasi Agronursing", badge: "TM 10", load: () => import('./bab-tren-agronursing.js') },
    { id: "klien", label: "Komunikasi Efektif dengan Klien", badge: "TM 11", load: () => import('./bab-klien.js') },
    { id: "keluarga", label: "Komunikasi dengan Keluarga (SOP Praktikum)", badge: "TM 12", load: () => import('./bab-keluarga.js') },
    { id: "kelompok", label: "Komunikasi Efektif dengan Kelompok", badge: "TM 13", load: () => import('./bab-kelompok.js') },
  ] },
];
export default manifest;
