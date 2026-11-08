import { Reveal } from './BentoKit';

/* ══════════════════════════════════════════════════════
   DATA — CV (satu poin = satu baris)
══════════════════════════════════════════════════════ */
const CV = [
  {
    icon: 'fa-solid fa-people-group',
    titleEN: 'Organizations', titleID: 'Organisasi',
    span: 3,
    items: [
      { year: '2023–2025', en: 'OSIS — Journalism & Communication section', id: 'OSIS — Sekbid Jurnalistik dan Komunikasi' },
      { year: 'Wartamatura', en: 'Wartamatura — reporter / journalism division', id: 'Wartamatura — bidang wartawan' },
      { year: 'Sinematura', en: 'Sinematura — filmmaking division', id: 'Sinematura — bidang perfilman' },
    ],
  },
  {
    icon: 'fa-solid fa-trophy',
    titleEN: 'Achievement', titleID: 'Prestasi',
    span: 3,
    items: [
      { year: '#1', en: 'Best writing, #1 — Journalism Writing Workshop, UNHASA Genggong', id: 'Penulisan terbaik nomor 1 — Workshop Jurnalistik, UNHASA Genggong' },
    ],
  },
  {
    icon: 'fa-solid fa-people-roof',
    titleEN: 'Committees — PDD team', titleID: 'Kepanitiaan — Sie PDD',
    span: 6,
    wide: true,
    items: [
      { year: '2024 · 2025', en: 'PDD team — Genesis se-Tapal Kuda', id: 'Sie PDD — Genesis se-Tapal Kuda' },
      { year: '2025', en: 'Publication & Documentation — Youth East Java Basketball League (YEJBL), East Java-wide', id: 'Sie Publikasi & Dokumentasi — Youth East Java Basketball League (YEJBL) se-Jawa Timur' },
      { year: '2023', en: 'PDD team — Batik Pandalungan', id: 'Sie PDD — Batik Pandalungan' },
      { year: '2023/2024', en: 'PDD team — Kas', id: 'Sie PDD — Kas' },
      { year: 'Event', en: 'PDD team — Talent Show', id: 'Sie PDD — Talent Show' },
      { year: 'Event', en: 'PDD team — Theater event', id: 'Sie PDD — acara Teater' },
    ],
  },
  {
    icon: 'fa-solid fa-briefcase',
    titleEN: 'Work — my role in each project', titleID: 'Work — peranku di tiap karya',
    span: 6,
    items: [
      { year: '2023–2026', en: 'Editor — SARKA, Ruang Kepala, Rantai, Jalan Tengah, Jawa Pos SMA Awards, MPLS 2024 ALTERIO teaser, Duta Pelajar Putri, Suara Sumbang Angin Utara, Guru Kita Yang Jahat, Biology Practicum', id: 'Editor — SARKA, Ruang Kepala, Rantai, Jalan Tengah, Jawa Pos SMA Awards, teaser MPLS 2024 ALTERIO, Duta Pelajar Putri, Suara Sumbang Angin Utara, Guru Kita Yang Jahat, Praktikum Biologi' },
      { year: '2025', en: 'Editor & Cameraman — teacher profile videos (Uswatun Hasanah, Iwan Cahyadi), Parlemen Remaja campaign, Anti-Corruption creative video', id: 'Editor & Cameraman — video profil guru (Uswatun Hasanah, Iwan Cahyadi), kampanye Parlemen Remaja, video kreatif Anti-Korupsi' },
      { year: '2025', en: 'Editor, Audioman & Cameraman — Senam Anak Indonesia Hebat 2025', id: 'Editor, Audioman & Cameraman — Senam Anak Indonesia Hebat 2025' },
      { year: '2024', en: 'Editor, Writer & Cameraman — Luka Menjadi Lukisan (solo production)', id: 'Editor, Writer & Cameraman — Luka Menjadi Lukisan (produksi solo)' },
      { year: '2025', en: 'Cinematographer — Guru Kita Yang Jahat', id: 'Sinematografer — Guru Kita Yang Jahat' },
      { year: '2023', en: 'Assistant Cameraman — Pramu Rasa', id: 'Asst. Cameraman — Pramu Rasa' },
      { year: '2024', en: 'Stream Designer & Operator — PERBASI live stream', id: 'Stream Designer & Operator — live stream PERBASI' },
      { year: '2026', en: 'Designer — GENESIS lanyard, class lanyard, extracurricular lanyard, FOMO poster', id: 'Designer — lanyard GENESIS, lanyard kelas, lanyard ekstrakurikuler, poster FOMO' },
      { year: '2026', en: 'Author & Designer — MINDOVA poster · Researcher & Designer — Me Time poster', id: 'Author & Designer — poster MINDOVA · Researcher & Designer — poster Waktu Untuk Diri' },
      { year: '2025–2026', en: 'Developer & Designer — birthday gift website, digital wedding invitation', id: 'Developer & Designer — website kado ulang tahun, undangan pernikahan digital' },
      { year: '2026', en: 'Developer — Leo, Notch for Windows', id: 'Developer — Leo, Notch untuk Windows' },
    ],
  },
];

export default function AboutCV({ isID }) {
  const L = (en, id) => (isID ? id : en);
  return (
    <div className="bn-grid">
      {CV.map((blk, i) => (
        <Reveal key={blk.titleEN} className={`bn-card bn-cv bn-span-${blk.span}`} delay={(i % 2) * 0.06}>
          <div className="bn-skill-top">
            <span className="bn-ico"><i className={blk.icon} /></span>
            <span className="bn-num">{String(i + 1).padStart(2, '0')}</span>
          </div>
          <h3>{L(blk.titleEN, blk.titleID)}</h3>
          <ul className={`bn-cv-list${blk.wide ? ' bn-cv-list--wide' : ''}`}>
            {blk.items.map(it => (
              <li key={it.id}>
                <span className="bn-cv-year">{it.year}</span>
                <span className="bn-cv-text">{L(it.en, it.id)}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
