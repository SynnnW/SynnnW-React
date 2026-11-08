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
    icon: 'fa-solid fa-briefcase',
    titleEN: 'Work — Publication, Design & Documentation (PDD)', titleID: 'Work — Publikasi, Desain & Dokumentasi (PDD)',
    span: 6,
    wide: true,
    items: [
      { year: '2024 · 2025', en: 'PDD team — Genesis se-Tapal Kuda', id: 'Sie PDD — Genesis se-Tapal Kuda' },
      { year: '2025', en: 'PDD team — Youth East Java Basketball League (YEJBL), East Java-wide', id: 'Sie Publikasi & Dokumentasi — Youth East Java Basketball League (YEJBL) se-Jawa Timur' },
      { year: '2023', en: 'PDD team — Batik Pandalungan', id: 'Sie PDD — Batik Pandalungan' },
      { year: '2023/2024', en: 'PDD team — Kas', id: 'Sie PDD — Kas' },
      { year: 'Event', en: 'PDD team — Talent Show', id: 'Sie PDD — Talent Show' },
      { year: 'Event', en: 'PDD team — Theater event', id: 'Sie PDD — acara Teater' },
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
