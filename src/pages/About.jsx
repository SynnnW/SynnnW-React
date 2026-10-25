import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThumbImg, Reveal, Arrow, ContactCard } from '../components/BentoKit';
import { useLang, waLink, IG_URL, evenSpans } from '../lib/bento';
import { SHOWCASE_COUNT } from '../data/showcase';

/* ══════════════════════════════════════════════════════
   DATA — skills, layanan, tools, sertifikat (isi tidak diubah,
   kecuali Firebase → Supabase karena sudah migrasi)
══════════════════════════════════════════════════════ */
const ACCORDION_ITEMS = [
  {
    id: 'acc1',
    num: '01',
    icon: 'fa-solid fa-code',
    title: 'Web Developer',
    descEN: 'Building web experiences using vibe coding — fully integrated with the latest AI tools and Supabase backend. Visual-first by nature, but clean in architecture. Not just a site, it\'s a system.',
    descID: 'Bikin web pakai vibe coding yang udah nyatu sama AI terbaru dan Supabase. Fokusnya visual dulu, tapi strukturnya tetap rapi di belakang layar. Bukan cuma website biasa, ini ekosistem digital.',
    tools: ['React / Next.js', 'GSAP Animation', 'UX Architecture', 'HTML/CSS/JS', 'Supabase'],
    note: 'Android admin app available for clients',
  },
  {
    id: 'acc2',
    num: '02',
    icon: 'fa-solid fa-film',
    title: 'Video Editing / Motion Graphic',
    descEN: 'From school short films to professional production content. Rhythm, pacing, color — all dialed in. Juara 1 National Film Festival Cendana. Handles: school project finales, orientation videos, event coverage, creative competition entries.',
    descID: 'Dari film pendek sekolah sampe konten promosi profesional. Ritme, tempo, warna — semuanya dirasain. Pernah Juara 1 Film Cendana Nasional. Ngerjain: tugas akhir SMA, video ospek, event, dan lomba kreatif.',
    tools: ['DaVinci Resolve', 'Adobe Premiere', 'After Effects', 'CapCut', 'Alight Motion'],
  },
  {
    id: 'acc3',
    num: '03',
    icon: 'fa-solid fa-pen-nib',
    title: 'Illustration & Graphic Design',
    descEN: 'Posters for school finals, competition entries, org logos, YouTube thumbnails, lanyard design, jersey design, and more. Raw files + documentation sent for competition requirements.',
    descID: 'Poster tugas akhir, poster lomba, logo organisasi, thumbnail YouTube, desain lanyard, jersey, dan lain-lain. File mentah dan dokumentasi bisa dikirim buat syarat lomba.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Canva', 'Affinity Designer'],
  },
  {
    id: 'acc4',
    num: '04',
    icon: 'fa-solid fa-camera',
    title: 'Videographer / Photographer',
    descEN: 'Former DOP on short films, portrait sessions, camera operator for PERBASI East Java Youth League. Comfortable with any gimbal, any brand. Solid on exposure triangle.',
    descID: 'Pernah jadi DOP film pendek, potrait, dan operator kamera buat Perbasi Kabupaten Jawa Timur. Bisa pakai gimbal merek apapun. Exposure triangle udah hafal luar kepala.',
    tools: ['DJI', 'Sony', 'Canon', 'Lumix'],
  },
];

/* ══════════════════════════════════════════════════════
   DATA — SERVICES
══════════════════════════════════════════════════════ */
const SERVICES = [
  {
    num: '01', icon: 'fa-solid fa-globe',
    titleEN: 'Web Development', titleID: 'Web Development',
    descEN: 'Premium web builds — portfolio sites, wedding invitations, custom tools. Supabase-integrated, mobile-first, and built to last.',
    descID: 'Bikin web premium — portofolio, undangan digital, tools custom. Supabase-integrated, mobile-first, dan tahan lama.',
    tags: ['React', 'Supabase', 'HTML/CSS/JS'],
  },
  {
    num: '02', icon: 'fa-solid fa-clapperboard',
    titleEN: 'Video Editing & Motion', titleID: 'Editing Video & Motion',
    descEN: 'School finals, competition entries, event coverage, orientation videos. From raw footage to color-graded final cut.',
    descID: 'Tugas akhir sekolah/kuliah, lomba kreatif, video event, ospek. Dari footage mentah sampai final yang siap upload.',
    tags: ['DaVinci Resolve', 'Adobe Premiere', 'CapCut'],
  },
  {
    num: '03', icon: 'fa-solid fa-paintbrush',
    titleEN: 'Illustration & Design', titleID: 'Ilustrasi & Desain',
    descEN: 'Posters, logos, thumbnails, lanyards, jerseys. Raw files and documentation provided for competition requirements.',
    descID: 'Poster, logo, thumbnail, lanyard, jersey. File mentah dan dokumentasi tersedia untuk keperluan lomba.',
    tags: ['Illustrator', 'Photoshop', 'Affinity Designer'],
  },
  {
    num: '04', icon: 'fa-solid fa-camera-retro',
    titleEN: 'Videography / Photography', titleID: 'Videografi / Fotografi',
    descEN: 'On-site shooting — events, portraits, short films. Solid on exposure, composition, and post-processing.',
    descID: 'Shooting langsung di lokasi — event, portrait, film pendek. Paham exposure, komposisi, dan post-processing.',
    tags: ['Portrait', 'Sinematik', 'Color Grade'],
  },
  {
    num: '05', icon: 'fa-solid fa-tower-broadcast',
    titleEN: 'Live Streaming & Broadcast', titleID: 'Live Streaming & Siaran',
    descEN: 'Full broadcast production — OBS overlay, scene control via tablet web app. Experienced with sports events and school productions.',
    descID: 'Produksi siaran lengkap — overlay OBS custom, kontrol scene lewat web app tablet. Pengalaman event olahraga dan sekolah.',
    tags: ['OBS Studio', 'Overlay Design', 'Web Controller'],
  },
  {
    num: '06', icon: 'fa-solid fa-film',
    titleEN: 'Live Streaming & Broadcast Design', titleID: 'Desain Siaran',
    descEN: 'Custom broadcast graphics — lower thirds, score overlays, intro animations, and full visual identity for live productions.',
    descID: 'Grafis siaran custom — lower third, overlay skor, animasi intro, dan identitas visual lengkap untuk produksi live.',
    tags: ['Broadcast Design', 'Overlay', 'Animation'],
  },
];

/* ══════════════════════════════════════════════════════
   DATA — EQUIPMENT
══════════════════════════════════════════════════════ */
const TOOLS = [
  {
    catIcon: 'fa-solid fa-code',
    catLabel: 'Web Development',
    items: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Next.js', 'Supabase', 'Git'],
  },
  {
    catIcon: 'fa-solid fa-video',
    catLabel: 'Video & Motion',
    items: ['DaVinci Resolve', 'Adobe Premiere', 'After Effects', 'CapCut', 'Alight Motion'],
  },
  {
    catIcon: 'fa-solid fa-palette',
    catLabel: 'Design & Illustration',
    items: ['Adobe Illustrator', 'Adobe Photoshop', 'Canva', 'Affinity Designer', 'Figma'],
  },
  {
    catIcon: 'fa-solid fa-camera',
    catLabel: 'Gear / Camera',
    items: ['DJI Gimbal', 'Sony Camera', 'Canon Camera', 'Lumix Camera', 'OBS Studio'],
  },
];

/* ══════════════════════════════════════════════════════
   DATA — ACHIEVEMENTS / CERTIF
══════════════════════════════════════════════════════ */
const CERTIF_ITEMS = [
  {
    src: '/assets/img/film pendek nasional.jpg',
    thumb: '/assets/thumbs/cert-1.webp',
    filename: 'film_pendek_nasional.jpg',
    caption: 'Juara I Festival Film Cendana 2025',
    desc: 'Juara I Nasional — Festival Film Cendana 2025 · SMAS Cendana Mandau, Bengkalis, Riau',
    cls: 'ab-gal-half',
  },
  {
    src: '/assets/img/SERTTIF FLS2N.jpg',
    thumb: '/assets/thumbs/cert-2.webp',
    filename: 'SERTTIF_FLS2N.jpg',
    caption: 'Juara 2 Film Pendek FLS2N 2024',
    desc: 'Juara 2 Tingkat Kabupaten Probolinggo — FLS2N 2024 · SMAN 1 Kraksaan',
    cls: 'ab-gal-half',
  },
  {
    src: '/assets/img/NOT ORDINARY.jpg',
    thumb: '/assets/thumbs/cert-3.webp',
    filename: 'NOT_ORDINARY.jpg',
    caption: 'NOT AN ORDINARY TEENAGE 2025',
    desc: 'Peserta — Kegiatan NOT 2025, Universitas Jember · Tema: Strong Mind, Bright Future',
    cls: 'ab-gal-third',
  },
  {
    src: '/assets/img/SERTIF OSIS.jpg',
    thumb: '/assets/thumbs/cert-4.webp',
    filename: 'SERTIF_OSIS.jpg',
    caption: 'Anggota Sekbid Jurnalistik OSIS 2023–2024',
    desc: 'Sekbid Jurnalistik — OSIS & MPK SMAN 1 Kraksaan · Periode 2023–2024',
    cls: 'ab-gal-third',
  },
  {
    src: '/assets/img/MEDSPIN.jpg',
    thumb: '/assets/thumbs/cert-5.webp',
    filename: 'MEDSPIN.jpg',
    caption: 'Participant Public Poster MEDSPIN 2025',
    desc: 'Peserta Public Poster — MEDSPIN · Universitas Airlangga · Sep–Okt 2025',
    cls: 'ab-gal-third',
  },
];

const CERT_SPANS = [3, 3, 2, 2, 2];

/* ══════════════════════════════════════════════════════
   MODAL SERTIFIKAT — tidak pakai filter pada #root (bikin freeze)
══════════════════════════════════════════════════════ */
function CertifModal({ src, filename, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="bn-modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bn-modal-box" onClick={e => e.stopPropagation()}>
        <button className="bn-modal-x" onClick={onClose} aria-label="Close"><i className="fa-solid fa-xmark" /></button>
        <img src={src} alt={filename} draggable={false} onContextMenu={e => e.preventDefault()} />
        <p>{filename}</p>
      </div>
    </div>
  );
}

function SecHead({ kicker, children }) {
  return (
    <Reveal className="bn-sec-head">
      <span className="bn-kicker">{kicker}</span>
      <h2>{children}</h2>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════════════
   ABOUT — tampilan bento
══════════════════════════════════════════════════════ */
export default function About({ lang: propLang }) {
  const navigate = useNavigate();
  const lang = useLang(propLang);
  const isID = lang === 'id';
  const L = (en, id) => (isID ? id : en);

  /* Jam WIB */
  const [wibTime, setWibTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const wib = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
      const p = n => String(n).padStart(2, '0');
      setWibTime(`${p(wib.getHours())}:${p(wib.getMinutes())}:${p(wib.getSeconds())}`);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const [certModal, setCertModal] = useState(null);
  const skillSpans = evenSpans(ACCORDION_ITEMS.length, 3);
  const svcSpans = evenSpans(SERVICES.length, 2);
  const toolSpans = evenSpans(TOOLS.length, 3);

  return (
    <main className="bn">
      <div className="bn-wrap">
        {/* ── Intro ── */}
        <div className="bn-grid">
          <Reveal className="bn-card bn-hello bn-span-4">
            <div className="bn-hello-top">
              <div className="bn-who">
                <span className="bn-avatar"><img src="/assets/img/favicon.png" alt="" /></span>
                <div>
                  <b>Aldo Leo Saputra</b>
                  <small>Multidisciplinary Digital Creator</small>
                </div>
              </div>
              <span className="bn-clock">WIB {wibTime}</span>
            </div>
            <div className="bn-social">
              <a href={IG_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
              <a href={waLink(L('Hi Aldo, I want to get in touch.', 'Halo Aldo, aku mau ngobrol.'))} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp" /></a>
            </div>
            <h1 className="bn-title">
              {L('Hi, I’m Aldo.', 'Halo, aku Aldo.')}{' '}
              <span>{L('Web, video & design.', 'Web, video & desain.')}</span>
            </h1>
            {isID ? (
              <>
                <p className="bn-lead">Kreator digital dari Jawa Timur yang nggak cuma bisa satu hal.</p>
                <p className="bn-lead">
                  Sekarang kuliah S1 di Fakultas Keperawatan Universitas Jember dan aktif di BEM FKEP, tapi tetap terbuka buat kolaborasi apapun.
                  Ngurusin web, video, live streaming, ilustrasi, sampai foto. Filosofinya sederhana: proyekmu aku garap kayak punya sendiri.
                </p>
              </>
            ) : (
              <>
                <p className="bn-lead">A multidisciplinary digital creator — not a generalist, a specialist in multiple crafts.</p>
                <p className="bn-lead">
                  Based in East Java, Indonesia. Currently an undergraduate student at the Faculty of Nursing, University of Jember, and an active member of BEM FKEP — still open to collaboration at any scale.
                  Web development, video production, live streaming, illustration and photography. Philosophy: your project gets treated like mine.
                </p>
              </>
            )}
            <span className="bn-open"><i /> {L('Open for new projects', 'Terbuka untuk project baru')}</span>
          </Reveal>

          <Reveal className="bn-card bn-photo bn-span-2 bn-row-2" delay={0.08}>
            <img src="/assets/img/bg1.jpg" alt="Aldo Leo Saputra" draggable={false} onContextMenu={e => e.preventDefault()} />
            <div className="bn-photo-barrier" onContextMenu={e => e.preventDefault()} />
          </Reveal>

          <Reveal className="bn-card bn-stats bn-span-4" delay={0.12}>
            <div><b>4+</b><span>{L('Years active', 'Tahun aktif')}</span></div>
            <div><b>{SHOWCASE_COUNT}</b><span>{L('Projects', 'Proyek')}</span></div>
            <div><b>5</b><span>{L('Disciplines', 'Multidisiplin')}</span></div>
          </Reveal>
        </div>

        {/* ── Skills ── */}
        <SecHead kicker="01 / Skills">{L('What I', 'Yang bisa')} <span className="bn-dim">{L('do.', 'aku kerjakan.')}</span></SecHead>
        <div className="bn-grid">
          {ACCORDION_ITEMS.map((it, i) => (
            <Reveal key={it.id} className={`bn-card bn-skill bn-span-${skillSpans[i]}`} delay={(i % 2) * 0.06}>
              <div className="bn-skill-top">
                <span className="bn-ico"><i className={it.icon} /></span>
                <span className="bn-num">{it.num}</span>
              </div>
              <h3>{it.title}</h3>
              <p>{isID ? it.descID : it.descEN}</p>
              {it.note && <p className="bn-note"><i className="fa-solid fa-circle-info" />{it.note}</p>}
              <div className="bn-tags">{it.tools.map(x => <span key={x}>{x}</span>)}</div>
            </Reveal>
          ))}
        </div>

        {/* ── Services ── */}
        <SecHead kicker="02 / Services">{L('What I can', 'Yang bisa')} <span className="bn-dim">{L('build.', 'kubuat.')}</span></SecHead>
        <div className="bn-grid">
          {SERVICES.map((svc, i) => (
            <Reveal key={svc.num} className={`bn-card bn-svc bn-span-${svcSpans[i]}`} delay={(i % 3) * 0.05}>
              <div className="bn-skill-top">
                <span className="bn-ico"><i className={svc.icon} /></span>
                <span className="bn-num">{svc.num}</span>
              </div>
              <h3>{isID ? svc.titleID : svc.titleEN}</h3>
              <p>{isID ? svc.descID : svc.descEN}</p>
              <div className="bn-tags">{svc.tags.map(x => <span key={x}>{x}</span>)}</div>
            </Reveal>
          ))}
        </div>

        {/* ── Tools ── */}
        <SecHead kicker="03 / Equipment">Tools & <span className="bn-dim">Gear.</span></SecHead>
        <div className="bn-grid">
          {TOOLS.map((cat, i) => (
            <Reveal key={cat.catLabel} className={`bn-card bn-tool bn-span-${toolSpans[i]}`} delay={(i % 2) * 0.06}>
              <h3><i className={cat.catIcon} />{cat.catLabel}</h3>
              <div className="bn-tags">{cat.items.map(x => <span key={x}>{x}</span>)}</div>
            </Reveal>
          ))}
        </div>

        {/* ── Achievements ── */}
        <SecHead kicker="04 / Achievements">
          {L('Certificates &', 'Sertifikat &')} <span className="bn-dim">{L('awards.', 'penghargaan.')}</span>
        </SecHead>
        <div className="bn-grid">
          {CERTIF_ITEMS.map((c, i) => (
            <motion.button
              key={c.filename}
              type="button"
              className={`bn-work bn-cert bn-span-${CERT_SPANS[i] || 2}`}
              onClick={() => setCertModal({ src: c.src, filename: c.filename })}
              onContextMenu={e => e.preventDefault()}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              aria-label={c.caption}
            >
              <span className="bn-work-glow" style={{ backgroundImage: `url(${c.thumb})` }} />
              <span className="bn-work-in">
                <ThumbImg src={c.src} thumb={c.thumb} alt={c.caption} />
                <span className="bn-work-shade" />
                <span className="bn-work-go"><i className="fa-solid fa-magnifying-glass" /></span>
                <span className="bn-work-txt">
                  <strong className="bn-work-title">{c.caption}</strong>
                  <span className="bn-work-desc">{c.desc}</span>
                </span>
              </span>
            </motion.button>
          ))}
        </div>

        {/* ── CTA ── */}
        <ContactCard
          className="bn-cta"
          title={L('Want to see the work?', 'Mau lihat proyeknya?')}
          text={L('Browse the portfolio, or tell me about yours.', 'Lihat portofolionya, atau ceritakan project-mu.')}
          primary={
            <button className="bn-btn bn-btn--solid" onClick={() => navigate('/works')}>
              {L('View Works', 'Lihat Karya')} <Arrow />
            </button>
          }
          secondary={
            <button className="bn-btn" onClick={() => navigate('/price-list')}>
              {L('Price list', 'Daftar harga')}
            </button>
          }
        />
      </div>

      {certModal && <CertifModal src={certModal.src} filename={certModal.filename} onClose={() => setCertModal(null)} />}
    </main>
  );
}
