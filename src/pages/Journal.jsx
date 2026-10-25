import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThumbImg, Reveal, Arrow, ContactCard } from '../components/BentoKit';
import { useLang, waLink, IG_URL } from '../lib/bento';

/* ── Bilingual data (sumber: translations.js, tidak butuh t prop) ── */
const TX = {
  id: {
    pageLabel:   'JOURNAL',
    title:       'Journal',
    titleB:      '& Cerita.',
    sub:         'Cerita di balik karya.',
    stat1Label:  'Artikel',
    stat2Label:  'Sejak 2024',
    featuredTag: '✦ Artikel Unggulan',
    meta1:       'April 2026',
    meta2:       '5 menit baca',
    articleTitle:
      'Ketua Pelaksana FISS: Film School Screening se-Tapal Kuda di SMAN 1 Kraksaan',
    excerpt:
      'Sebuah catatan perjalanan tentang memimpin dan mengeksekusi event pemutaran film lintas sekolah se-wilayah Tapal Kuda — dari konsep, koordinasi tim, hingga momen layar menyala di hadapan ratusan penonton muda yang haus sinema.',
    readMore: 'Baca Selengkapnya',
    author:   'Aldo Leo Saputra',
  },
  en: {
    pageLabel:   'JOURNAL',
    title:       'Journal',
    titleB:      '& Stories.',
    sub:         'Stories behind the work.',
    stat1Label:  'Article',
    stat2Label:  'Since 2024',
    featuredTag: '✦ Featured Article',
    meta1:       'April 2026',
    meta2:       '5 min read',
    articleTitle:
      'Event Chair FISS: Film School Screening across Tapal Kuda Region at SMAN 1 Kraksaan',
    excerpt:
      'A journey of leading and executing a cross-school film screening event across the Tapal Kuda region — from concept, team coordination, to the moment the screen lit up before hundreds of young cinema-hungry viewers.',
    readMore: 'Read More',
    author:   'Aldo Leo Saputra',
  },
};

const FEAT_BADGES = ['Leadership', 'Filmmaking', 'Event'];

export default function Journal({ lang: propLang }) {
  const navigate = useNavigate();
  const lang = useLang(propLang);
  const t = TX[lang] || TX.id;
  const isID = lang === 'id';
  const L = (en, id) => (isID ? id : en);
  const open = () => navigate('/journal/karya1');

  return (
    <main className="bn">
      <div className="bn-wrap">
        {/* ── Intro ── */}
        <div className="bn-grid">
          <Reveal className="bn-card bn-hello bn-span-4">
            <div className="bn-who">
              <span className="bn-avatar"><img src="/assets/img/favicon.png" alt="" /></span>
              <div>
                <b>{t.author}</b>
                <small>{L('Writing about the work', 'Menulis soal proses di balik karya')}</small>
              </div>
            </div>
            <div className="bn-social">
              <a href={IG_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
              <a href={waLink(L('Hi Aldo, I read your journal.', 'Halo Aldo, aku baca journal-mu.'))} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp" /></a>
            </div>
            <h1 className="bn-title">{t.title} <span>{t.titleB}</span></h1>
            <p className="bn-lead">{t.sub}</p>
          </Reveal>

          <Reveal className="bn-card bn-hot bn-span-2" delay={0.08}>
            <span className="bn-kicker" style={{ color: 'rgba(255,255,255,.85)' }}>{t.pageLabel}</span>
            <div>
              <div className="bn-big">1</div>
              <small>{t.stat1Label} · {t.stat2Label}</small>
            </div>
          </Reveal>
        </div>

        {/* ── Artikel unggulan ── */}
        <div className="bn-grid bn-grid--rows">
          <motion.a
            href="/journal/karya1"
            className="bn-work bn-feat bn-span-4"
            onClick={e => { e.preventDefault(); open(); }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="bn-work-glow" style={{ backgroundImage: 'url(/assets/thumbs/journal-fiss.webp)' }} />
            <span className="bn-work-in">
              <ThumbImg src="/assets/img/aldo.jpg" thumb="/assets/thumbs/journal-fiss.webp" alt="FISS Film School Screening Tapal Kuda" />
              <span className="bn-work-shade" />
              <span className="bn-badges">
                <em className="bn-pill bn-pill--gold">{t.featuredTag.replace(/^[^\p{L}]+/u, '')}</em>
                {FEAT_BADGES.map(b => <em key={b} className="bn-pill">{b}</em>)}
              </span>
              <span className="bn-work-go"><Arrow /></span>
              <span className="bn-work-txt">
                <strong className="bn-feat-title">{t.articleTitle}</strong>
                <span className="bn-feat-excerpt">{t.excerpt}</span>
                <span className="bn-work-meta">{t.meta1} · {t.meta2}</span>
              </span>
            </span>
          </motion.a>

          <Reveal className="bn-card bn-side bn-span-2" delay={0.08}>
            <dl>
              <div><dt>{L('Published', 'Terbit')}</dt><dd>{t.meta1}</dd></div>
              <div><dt>{L('Reading time', 'Waktu baca')}</dt><dd>{t.meta2}</dd></div>
              <div><dt>{L('Author', 'Penulis')}</dt><dd>{t.author}</dd></div>
            </dl>
            <button className="bn-btn bn-btn--solid" onClick={open}>
              {t.readMore} <Arrow />
            </button>
          </Reveal>
        </div>

        {/* ── CTA ── */}
        <ContactCard
          title={L('Got a story or a project?', 'Punya cerita atau project?')}
          text={L('Let’s talk — I’m always up for a collaboration.', 'Yuk ngobrol — selalu terbuka buat kolaborasi.')}
          primary={
            <a className="bn-btn bn-btn--solid" href={waLink(L('Hi Aldo, I want to collaborate.', 'Halo Aldo, aku mau kolaborasi.'))} target="_blank" rel="noopener noreferrer">
              WhatsApp <Arrow />
            </a>
          }
          secondary={<button className="bn-btn" onClick={() => navigate('/works')}>{L('See the works', 'Lihat karya')}</button>}
        />
      </div>
    </main>
  );
}
