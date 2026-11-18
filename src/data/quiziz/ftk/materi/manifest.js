// DIHASILKAN oleh scripts/materi/build.py
const manifest = [
  { category: 'Buku Teori Keperawatan (acuan utama ujian)', babs: [
    { id: "buku-bab-01", label: "Pengenalan Jurnal Keperawatan sebagai Referensi Utama", badge: "BAB 1", load: () => import('./buku-bab-01.js') },
    { id: "buku-bab-02", label: "Konsep Falsafah Keperawatan", badge: "BAB 2", load: () => import('./buku-bab-02.js') },
    { id: "buku-bab-03", label: "Konsep Paradigma Keperawatan", badge: "BAB 3", load: () => import('./buku-bab-03.js') },
    { id: "buku-bab-04", label: "Konsep Holistic Care: Holisme dan Humanisme", badge: "BAB 4", load: () => import('./buku-bab-04.js') },
    { id: "buku-bab-05", label: "Konsep Teori Keperawatan", badge: "BAB 5", load: () => import('./buku-bab-05.js') },
    { id: "buku-bab-06", label: "Teori Florence Nightingale", badge: "BAB 6", load: () => import('./buku-bab-06.js') },
    { id: "buku-bab-07", label: "Teori Virginia Henderson", badge: "BAB 7", load: () => import('./buku-bab-07.js') },
    { id: "buku-bab-08", label: "Teori Dorothea E. Orem", badge: "BAB 8", load: () => import('./buku-bab-08.js') },
    { id: "buku-bab-09", label: "Teori Sister Callista Roy", badge: "BAB 9", load: () => import('./buku-bab-09.js') },
    { id: "buku-bab-10", label: "Teori Betty Neuman", badge: "BAB 10", load: () => import('./buku-bab-10.js') },
    { id: "buku-bab-11", label: "Teori Katharine Kolcaba", badge: "BAB 11", load: () => import('./buku-bab-11.js') },
    { id: "buku-bab-12", label: "Teori Nola J. Pender", badge: "BAB 12", load: () => import('./buku-bab-12.js') },
    { id: "buku-bab-13", label: "Teori Hildegard E. Peplau", badge: "BAB 13", load: () => import('./buku-bab-13.js') },
    { id: "buku-bab-14", label: "Konsep Sistem dan Pendekatan Sistem dalam Keperawatan", badge: "BAB 14", load: () => import('./buku-bab-14.js') },
  ] },
  { category: "PPT dosen / sumber tambahan", babs: [
    { id: "orem", label: "Teori Dorothea Orem (ringkasan PPT)", badge: "PPT TM 9", load: () => import('./bab-orem.js') },
    { id: "kolcaba", label: "Teori Katharine Kolcaba (ringkasan PPT)", badge: "PPT TM 12", load: () => import('./bab-kolcaba.js') },
  ] },
];
export default manifest;
