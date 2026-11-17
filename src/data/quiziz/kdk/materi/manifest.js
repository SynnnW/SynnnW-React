// DIHASILKAN oleh scripts/materi/build.py
const manifest = [
  { category: "Sebelum UTS (TM 1–7)", babs: [
    { id: "caring", label: "Konsep dan Teori Caring", badge: "TM 2", load: () => import('./bab-caring.js') },
    { id: "paradigma", label: "Paradigma Keperawatan", badge: "TM 3", load: () => import('./bab-paradigma.js') },
    { id: "pelayanan", label: "Pelayanan Keperawatan dalam Sistem Kesehatan", badge: "TM 4", load: () => import('./bab-pelayanan.js') },
    { id: "profesi", label: "Keperawatan sebagai Profesi", badge: "TM 5", load: () => import('./bab-profesi.js') },
    { id: "standar", label: "Standar Praktik Keperawatan Profesional", badge: "TM 6", load: () => import('./bab-standar.js') },
    { id: "kode-etik", label: "Kode Etik Keperawatan Internasional (ICN)", badge: "TM 7", load: () => import('./bab-kode-etik.js') },
  ] },
  { category: "Setelah UTS", babs: [
    { id: "etika-moral", label: "Prinsip Moral, Etika, dan Kode Etik", badge: "TM 9", load: () => import('./bab-etika-moral.js') },
    { id: "advokasi", label: "Advokasi dalam Keperawatan", badge: "TM 11", load: () => import('./bab-advokasi.js') },
    { id: "studi-kasus-lkm", label: "Studi Kasus LKM 1–3", badge: "LKM", load: () => import('./bab-studi-kasus-lkm.js') },
  ] },
];
export default manifest;
