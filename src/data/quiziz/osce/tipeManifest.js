// Enam jenis hubungan interpersonal yang dipakai simulasi OSCE Komdas.
// id harus sama persis dengan nama file di ./kasus/<id>.md
// icon = nama ikon Font Awesome 6 (dipakai lewat <Ico e="fa-solid fa-..." /> atau <i className="fa-solid ...">)
const TIPE_MANIFEST = [
  { id: 'klien', label: 'Klien (Individu)', icon: 'fa-user', ref: 'TM 11' },
  { id: 'keluarga', label: 'Keluarga', icon: 'fa-people-roof', ref: 'TM 12' },
  { id: 'kelompok', label: 'Kelompok', icon: 'fa-users', ref: 'TM 13' },
  { id: 'multidisiplin', label: 'Sejawat & Multidisiplin', icon: 'fa-user-doctor', ref: 'TM 7' },
  { id: 'agronursing', label: 'Budaya Agronursing', icon: 'fa-wheat-awn', ref: 'TM 6 & 10' },
  { id: 'krisis', label: 'Situasi Sulit & Krisis', icon: 'fa-heart-pulse', ref: 'TM 3' },
];

export default TIPE_MANIFEST;

export function getTipeMeta(id) {
  return TIPE_MANIFEST.find((t) => t.id === id) || null;
}
