// DIHASILKAN oleh scripts/materi/build.py
const manifest = [
  { category: 'Buku Teori Keperawatan (acuan utama ujian)', segera: true, babs: [
    { id: "bab-01", label: "Pengenalan Jurnal Keperawatan sebagai Referensi", badge: "BAB 01", segera: true },
    { id: "bab-02", label: "Konsep Falsafah Keperawatan", badge: "BAB 02", segera: true },
    { id: "bab-03", label: "Konsep Paradigma Keperawatan", badge: "BAB 03", segera: true },
    { id: "bab-04", label: "Holistic Care: Holisme dan Humanisme", badge: "BAB 04", segera: true },
    { id: "bab-05", label: "Konsep Teori Keperawatan", badge: "BAB 05", segera: true },
    { id: "bab-06", label: "Teori Florence Nightingale", badge: "BAB 06", segera: true },
    { id: "bab-07", label: "Teori Virginia Henderson", badge: "BAB 07", segera: true },
    { id: "bab-08", label: "Teori Dorothea E. Orem", badge: "BAB 08", segera: true },
    { id: "bab-09", label: "Teori Sister Callista Roy", badge: "BAB 09", segera: true },
    { id: "bab-10", label: "Teori Betty Neuman", badge: "BAB 10", segera: true },
    { id: "bab-11", label: "Teori Katharine Kolcaba", badge: "BAB 11", segera: true },
    { id: "bab-12", label: "Teori Nola J. Pender", badge: "BAB 12", segera: true },
    { id: "bab-13", label: "Teori Hildegard E. Peplau", badge: "BAB 13", segera: true },
    { id: "bab-14", label: "Konsep Sistem dan Pendekatan Sistem", badge: "BAB 14", segera: true },
  ] },
  { category: "PPT dosen / sumber tambahan", babs: [
    { id: "orem", label: "Teori Dorothea Orem (ringkasan PPT)", badge: "PPT TM 9", load: () => import('./bab-orem.js') },
    { id: "kolcaba", label: "Teori Katharine Kolcaba (ringkasan PPT)", badge: "PPT TM 12", load: () => import('./bab-kolcaba.js') },
  ] },
];
export default manifest;
