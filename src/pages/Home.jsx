import LineReveal from '../components/LineReveal';
import Magnetic from '../components/Magnetic';
import Counter from '../components/Counter';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  motion,
  MotionConfig,
  AnimatePresence,
  animate,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion';
import { SHOWCASE_FILM, SHOWCASE_DESIGN, SHOWCASE_COUNT } from '../data/showcase';
import '../styles/home.css';

/* ─────────────────────────────────────────
   KONSTANTA
───────────────────────────────────────── */
const WA_NUMBER = '6281252790018';
const IG_URL = 'https://www.instagram.com/aldosynnn';
const GAP = 20;

const DOTS = [
  { id: 'sec-home',     label: 'Home' },
  { id: 'sec-work',     label: 'Project' },
  { id: 'sec-services', label: 'Services' },
  { id: 'sec-design',   label: 'Design & Web' },
  { id: 'sec-contact',  label: 'Contact' },
];

const TOOLS = [
  { ab: 'Re', name: 'React' },
  { ab: 'Sb', name: 'Supabase' },
  { ab: 'Dv', name: 'DaVinci Resolve' },
  { ab: 'Pr', name: 'Premiere Pro' },
  { ab: 'Ae', name: 'After Effects' },
  { ab: 'Ps', name: 'Photoshop' },
  { ab: 'Ai', name: 'Illustrator' },
  { ab: 'Af', name: 'Affinity Designer' },
];

const TRUSTED = [
  'Film Festival Cendana', 'Jawa Pos SMA Awards', 'PERBASI Jawa Timur', 'MEDSPIN UNAIR',
  'UNEJ FKEP', 'SMAN 1 Kraksaan', 'GENESIS', 'Parlemen Remaja',
];

const SERVICES = [
  {
    num: '01', titleKey: 'svc1t', fallTitle: 'Portfolio Website', descKey: 'svc1d',
    fallDescEN: 'Creating premium digital identities for creatives, professionals, and executives who need a sophisticated online presence that reflects their unique brand.',
    fallDescID: 'Menciptakan identitas digital premium untuk para kreatif, profesional, dan eksekutif yang membutuhkan kehadiran online canggih yang mencerminkan merek unik mereka.',
    tools: ['React', 'Supabase', 'HTML/CSS/JS'],
    en: ['Custom design, no template', 'Responsive on phone & desktop', 'Smooth, interactive motion', 'Backend & login when needed', 'Ready to deploy'],
    id: ['Desain custom, bukan template', 'Responsif di HP & desktop', 'Animasi halus & interaktif', 'Backend & login kalau perlu', 'Siap deploy'],
  },
  {
    num: '02', titleKey: 'svc2t', fallTitle: 'Wedding Website', descKey: 'svc2d',
    fallDescEN: 'Designing elegant and personal digital invitations — capturing the most precious moments in your life with unforgettable visual beauty.',
    fallDescID: 'Merancang undangan digital yang elegan dan personal — mengabadikan momen paling berharga dalam hidup Anda dengan keindahan visual yang tak terlupakan.',
    tools: ['React', 'Supabase'],
    en: ['Personal, story-driven layout', 'RSVP & guest wishes', 'Music, gallery & countdown', 'Share by link or WhatsApp'],
    id: ['Layout personal, bercerita', 'RSVP & ucapan tamu', 'Musik, galeri & countdown', 'Dibagikan lewat link / WhatsApp'],
  },
  {
    num: '03', titleKey: 'svc3t', fallTitle: 'Video Editing & Motion', descKey: 'svc3d',
    fallDescEN: 'Transforming raw footage into a powerful visual narrative — from short films, vlogs, to promotional content with professional motion graphic touches.',
    fallDescID: 'Mengolah footage mentah menjadi narasi visual yang kuat — dari film pendek, vlog, hingga konten promosi dengan sentuhan motion graphic profesional.',
    tools: ['DaVinci Resolve', 'Premiere Pro', 'After Effects', 'CapCut'],
    en: ['Rhythm, pacing & color', 'Motion graphics & titles', 'Short films, vlogs, promo', 'Orientation & event videos'],
    id: ['Ritme, tempo & warna', 'Motion graphic & judul', 'Film pendek, vlog, promosi', 'Video ospek & event'],
  },
  {
    num: '04', titleKey: 'svc4t', fallTitle: 'Illustration & Poster Design', descKey: 'svc4d',
    fallDescEN: 'Turning your ideas into visual works that speak — educational posters, thumbnails, and creative graphics for digital and print platforms.',
    fallDescID: 'Mewujudkan ide Anda menjadi karya visual yang berbicara — poster edukatif, thumbnail, dan grafis kreatif untuk platform digital maupun cetak.',
    tools: ['Illustrator', 'Photoshop', 'Affinity Designer', 'Canva'],
    en: ['Posters for school & competitions', 'YouTube thumbnails', 'Logos, lanyards & jerseys', 'Raw files + documentation for contests'],
    id: ['Poster tugas akhir & lomba', 'Thumbnail YouTube', 'Logo, lanyard & jersey', 'File mentah + dokumentasi buat syarat lomba'],
  },
  {
    num: '05', titleKey: 'svc5t', fallTitle: 'Videographer & Photographer', descKey: 'svc5d',
    fallDescEN: 'Capturing every important moment with artistic precision — from professional portrait photography to high-quality cinematic video production.',
    fallDescID: 'Mengabadikan setiap momen penting dengan presisi artistik — dari foto portrait profesional hingga produksi video sinematik berkualitas tinggi.',
    tools: ['Sony', 'Canon', 'Lumix', 'DJI'],
    en: ['Portrait sessions', 'Cinematic video production', 'Event coverage & live stream', 'Camera operator, any gimbal'],
    id: ['Sesi foto portrait', 'Produksi video sinematik', 'Liputan event & live stream', 'Operator kamera, gimbal apa pun'],
  },
];

/* Penghargaan asli dari data karya */
const AWARDS = [...SHOWCASE_FILM, ...SHOWCASE_DESIGN]
  .filter(w => w.award)
  .map(w => {
    const [head, ...rest] = w.award.split(' — ');
    return { ...w, head, sub: rest.join(' — ') };
  })
  .sort((a, b) => (b.head.includes('Juara 1') ? 1 : 0) - (a.head.includes('Juara 1') ? 1 : 0));

/* ─────────────────────────────────────────
   IKON KECIL (inline, tanpa dependensi font)
───────────────────────────────────────── */
const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3.5 10.5l7-7M4.5 3.5h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Chevron = ({ dir = 1 }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ transform: dir < 0 ? 'scaleX(-1)' : 'none' }}>
    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Check = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2.5 7.4l2.7 2.7 6-6.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─────────────────────────────────────────
   REVEAL
───────────────────────────────────────── */
function Reveal({ children, className = '', delay = 0, y = 28 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   CAROUSEL — drag, tombol, snap, keyboard
───────────────────────────────────────── */
function Carousel({ items, isID, onOpen, label }) {
  const viewRef = useRef(null);
  const trackRef = useRef(null);
  const dragged = useRef(false);
  const x = useMotionValue(0);
  const [limit, setLimit] = useState(0);
  const [xv, setXv] = useState(0);
  const pos = { start: xv >= -2, end: limit === 0 || xv <= -limit + 2 };
  const progress = useTransform(x, v => (limit ? Math.min(1, Math.max(0, -v / limit)) : 0));

  useEffect(() => {
    const measure = () => {
      const v = viewRef.current;
      const t = trackRef.current;
      if (!v || !t) return;
      const l = Math.max(0, t.scrollWidth - v.clientWidth);
      setLimit(l);
      if (x.get() < -l) x.set(-l);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewRef.current);
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [items, x]);

  useMotionValueEvent(x, 'change', v => setXv(v));

  const cardW = () => {
    const c = trackRef.current?.firstElementChild;
    return (c ? c.getBoundingClientRect().width : 320) + GAP;
  };
  const snapTo = target => {
    const clamped = Math.max(-limit, Math.min(0, target));
    animate(x, clamped, { type: 'spring', stiffness: 240, damping: 34 });
  };
  const step = dir => snapTo(Math.round((x.get() - dir * cardW()) / cardW()) * cardW());

  return (
    <div className="hm-car">
      <div className="hm-car-ctrl">
        <button className="hm-round" onClick={() => step(-1)} disabled={pos.start} aria-label={isID ? 'Sebelumnya' : 'Previous'}>
          <Chevron dir={-1} />
        </button>
        <button className="hm-round" onClick={() => step(1)} disabled={pos.end} aria-label={isID ? 'Berikutnya' : 'Next'}>
          <Chevron />
        </button>
      </div>

      <div
        ref={viewRef}
        className="hm-car-view"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        onKeyDown={e => {
          if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
          if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); }
        }}
      >
        <motion.div
          ref={trackRef}
          className="hm-car-track"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -limit, right: 0 }}
          dragElastic={0.08}
          dragMomentum={false}
          onDragStart={() => { dragged.current = true; }}
          onDragEnd={(_, info) => {
            const w = cardW();
            const projected = x.get() + info.velocity.x * 0.22;
            snapTo(Math.round(projected / w) * w);
            setTimeout(() => { dragged.current = false; }, 60);
          }}
        >
          {items.map(w => (
            <a
              key={w.id}
              href={w.route}
              draggable={false}
              className="hm-card"
              onClick={e => {
                e.preventDefault();
                if (!dragged.current) onOpen(w.route);
              }}
            >
              <div className="hm-card-img">
                <img src={w.thumb} alt={isID ? w.titleID : w.titleEN} loading="lazy" draggable={false} />
                {w.award && <span className="hm-badge">{w.award.split(' — ')[0]}</span>}
                <span className="hm-card-go"><Arrow /></span>
              </div>
              <div className="hm-card-meta">
                <span className="hm-card-cat">{w.cat} · {w.year}</span>
                <h3 className="hm-card-title">{isID ? w.titleID : w.titleEN}</h3>
              </div>
            </a>
          ))}
        </motion.div>
      </div>

      <div className="hm-progress" aria-hidden="true">
        <motion.span style={{ scaleX: progress }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SLIDER PENGHARGAAN
───────────────────────────────────────── */
function AwardSlider({ isID, onOpen }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const go = d => { setDir(d); setI(v => (v + d + AWARDS.length) % AWARDS.length); };
  const a = AWARDS[i];
  if (!a) return null;

  return (
    <div className="hm-award">
      <button className="hm-round hm-award-prev" onClick={() => go(-1)} aria-label={isID ? 'Sebelumnya' : 'Previous'}>
        <Chevron dir={-1} />
      </button>
      <button className="hm-round hm-award-next" onClick={() => go(1)} aria-label={isID ? 'Berikutnya' : 'Next'}>
        <Chevron />
      </button>

      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.div
          key={a.id}
          className="hm-award-slide"
          custom={dir}
          variants={{
            enter:  d => ({ x: d * 70, opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit:   d => ({ x: d * -70, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1);
            else if (info.offset.x > 60) go(-1);
          }}
        >
          <p className="hm-award-head">{a.head}</p>
          <p className="hm-award-sub">{a.sub}</p>
          <p className="hm-award-desc">{isID ? a.descID : a.descEN}</p>
          <button className="hm-award-who" onClick={() => onOpen(a.route)}>
            <img src={a.thumb} alt="" draggable={false} />
            <span>
              <strong>{isID ? a.titleID : a.titleEN}</strong>
              <em>{a.cat} · {a.year}</em>
            </span>
            <Arrow />
          </button>
        </motion.div>
      </AnimatePresence>

      <div className="hm-award-dots">
        {AWARDS.map((w, n) => (
          <button
            key={w.id}
            className={n === i ? 'on' : ''}
            onClick={() => { setDir(n > i ? 1 : -1); setI(n); }}
            aria-label={`${n + 1} / ${AWARDS.length}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   HOME
───────────────────────────────────────── */
export default function Home({ t = {} }) {
  const navigate = useNavigate();
  const isID = t?.lang === 'id';
  const L = (en, id) => (isID ? id : en);
  const tr = (key, fallback) => (t && t[key] ? t[key] : fallback);
  const go = path => navigate(path);
  const wa = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    L('Hi Aldo, I would like to ask about a project.', 'Halo Aldo, aku mau tanya soal project.')
  )}`;

  const [activeDot, setActiveDot] = useState('sec-home');
  const [heroPhoto, setHeroPhoto] = useState('/assets/img/bg1.jpg');

  /* Foto profil bisa diganti admin (Supabase settings/hero) */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [{ db }, { doc, getDoc }] = await Promise.all([
          import('@/supabaseClient'),
          import('@/lib/firestoreCompat'),
        ]);
        const snap = await getDoc(doc(db, 'settings', 'hero'));
        if (alive && snap.exists() && snap.data()?.photoUrl) setHeroPhoto(snap.data().photoUrl);
      } catch {
        /* pakai foto default */
      }
    })();
    return () => { alive = false; };
  }, []);

  /* Dot navigasi */
  useEffect(() => {
    const obs = DOTS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveDot(id); },
        { threshold: 0.3 }
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach(o => o && o.disconnect());
  }, []);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <MotionConfig reducedMotion="user">
      <div className="hm">
        <nav className="hm-dots" aria-label="Section navigation">
          {DOTS.map(({ id, label }) => (
            <button
              key={id}
              className={activeDot === id ? 'on' : ''}
              title={label}
              onClick={() => scrollTo(id)}
              aria-label={`Go to ${label}`}
            />
          ))}
        </nav>

        {/* ═══════════ 01 · HERO ═══════════ */}
        <section id="sec-home" className="hm-hero">
          <div className="hm-hero-card">
            <img className="hm-hero-bg" src="/assets/img/Artboard 1.webp" alt="" />
            <div className="hm-hero-grain" aria-hidden="true" />

            <div className="hm-hero-left">
              <span className="hm-eyebrow"><i /> SynnnW Studio</span>
              <LineReveal as="h1" className="hm-h1" delay={0.2}
                text={isID ? 'Web, video & desain, dikerjain seolah punya sendiri.' : 'Web, video & design, built like it’s our own.'} />
              <span className="hm-hero-tags">WEB / VIDEO / ILUSTRASI / FOTO — JAWA TIMUR, ID</span>
              <p className="hm-hero-p">
                {L(
                  'A creative studio from East Java, run by Aldo Leo Saputra. Websites, short films, posters and event coverage — from first brief to final file.',
                  'Studio kreatif dari Jawa Timur, dijalankan Aldo Leo Saputra. Website, film pendek, poster, sampai liputan event — dari brief pertama sampai file final.'
                )}
              </p>
              <div className="hm-hero-btns">
                <Magnetic><button className="hm-btn hm-btn--solid" onClick={() => go('/login')}>
                  {L('Start a Project', 'Mulai Proyek')} <Arrow />
                </button></Magnetic>
                <button className="hm-btn hm-btn--ghost" onClick={() => scrollTo('sec-work')}>
                  {L('See the work', 'Lihat karya')}
                </button>
              </div>
              <span className="hm-hero-loc">Indonesia · {L('East Java', 'Jawa Timur')}</span>
            </div>

            <div className="hm-hero-right">
              <span className="hm-eyebrow hm-eyebrow--plain">
                {L('Need a partner for your project?', 'Butuh partner buat project-mu?')}
              </span>
              <p>
                {L(
                  'Tell us what you’re building — we’ll talk scope, timeline and price together.',
                  'Ceritakan ide yang lagi kamu bangun — kita bahas scope, waktu, dan harga bareng.'
                )}
              </p>
              <div className="hm-hero-stats">
                <div><b><Counter to={SHOWCASE_COUNT} /></b><span>{L('works in portfolio', 'karya di portofolio')}</span></div>
                <div><b><Counter to={4} /></b><span>{L('years active', 'tahun aktif')}</span></div>
              </div>
              <a className="hm-btn hm-btn--ghost" href={wa} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-whatsapp" /> {L('Chat on WhatsApp', 'Chat via WhatsApp')}
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════ 02 · TOOLS + INTRO ═══════════ */}
        <section className="hm-intro hm-wrap">
          <Reveal className="hm-tools">
            <p className="hm-kicker">{L('Tools we work with:', 'Tools yang dipakai:')}</p>
            <div className="hm-tools-grid">
              {TOOLS.map(tool => (
                <div key={tool.name} className="hm-tool" title={tool.name}>
                  <b>{tool.ab}</b>
                  <span>{tool.name}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="hm-about" delay={0.1}>
            <div className="hm-about-photo">
              <img src={heroPhoto} alt="Aldo Leo Saputra" draggable={false} />
              <div className="hm-about-barrier" onContextMenu={e => e.preventDefault()} />
            </div>
            <div className="hm-about-copy">
              <h2 className="hm-h2">
                {L('One studio, ', 'Satu studio, ')}
                <span className="hm-dim">{L('four crafts.', 'empat keahlian.')}</span>
              </h2>
              <p>
                {L(
                  'A multidisciplinary digital creator based in East Java. Not a generalist — a specialist in multiple crafts. Web, video, illustration, photography, all handled with the same level of obsession.',
                  'Kreator digital dari Jawa Timur yang nggak cuma bisa satu hal. Web, video, desain, foto — semua dikerjain serius, bukan setengah-setengah.'
                )}
              </p>
              <button className="hm-btn hm-btn--ghost" onClick={() => go('/about')}>
                {L('About me', 'Tentang saya')} <Arrow />
              </button>
            </div>
          </Reveal>
        </section>

        {/* ═══════════ 03 · PROJECT SHOWCASE ═══════════ */}
        <section id="sec-work" className="hm-sec hm-wrap">
          <Reveal className="hm-head">
            <div>
              <p className="hm-kicker">01 / {L('Film & Video', 'Film & Video')}</p>
              <h2 className="hm-h2">
                <span className="hm-dim">{L('Our ', '')}</span>
                {L('Project Showcase', 'Showcase Proyek')}
              </h2>
            </div>
            <p className="hm-head-note">
              {L('Short films, documentaries and event coverage. Drag, swipe or use the arrows.',
                 'Film pendek, dokumenter, dan liputan event. Geser, swipe, atau pakai tombol panah.')}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <Carousel items={SHOWCASE_FILM} isID={isID} onOpen={go} label={L('Project showcase', 'Showcase proyek')} />
          </Reveal>

          <Reveal className="hm-btn-row">
            <button className="hm-btn hm-btn--solid" onClick={() => go('/works')}>
              {L('View all works', 'Lihat semua karya')} <Arrow />
            </button>
            <a className="hm-btn hm-btn--ghost" href={wa} target="_blank" rel="noopener noreferrer">
              {L('Ask for a quote', 'Tanya harga')}
            </a>
          </Reveal>
        </section>

        {/* ═══════════ 04 · TRUSTED ═══════════ */}
        <section className="hm-trusted" aria-label={L('Worked on and featured at', 'Pernah dikerjakan dan tampil di')}>
          <p className="hm-kicker hm-center">
            {L('Worked on & featured at', 'Pernah dikerjakan & tampil di')}
          </p>
          <div className="hm-marquee">
            <div className="hm-marquee-track">
              {[...TRUSTED, ...TRUSTED].map((name, n) => (
                <span key={n} aria-hidden={n >= TRUSTED.length}>{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ 05 · SERVICES ═══════════ */}
        <section id="sec-services" className="hm-sec hm-wrap">
          <Reveal className="hm-head hm-head--center">
            <p className="hm-kicker">02 / {L('Capabilities', 'Layanan')}</p>
            <h2 className="hm-h2">
              {L('We provide the ', 'Layanan yang ')}
              <span className="hm-dim">{L('best services.', 'kami berikan.')}</span>
            </h2>
          </Reveal>

          <div className="hm-svc">
            {SERVICES.map((s, n) => (
              <Reveal key={s.num} className="hm-svc-row" delay={n * 0.04}>
                <div className="hm-svc-main">
                  <span className="hm-svc-num">{s.num}</span>
                  <h3>{tr(s.titleKey, s.fallTitle)}</h3>
                  <p>{isID ? tr(s.descKey + '_id', s.fallDescID) : tr(s.descKey, s.fallDescEN)}</p>
                  <div className="hm-chips">
                    {s.tools.map(x => <span key={x}>{x}</span>)}
                  </div>
                </div>
                <ul className="hm-svc-list">
                  {(isID ? s.id : s.en).map(item => (
                    <li key={item}><Check />{item}</li>
                  ))}
                </ul>
                <div className="hm-svc-cta">
                  <p>{L('Have a project in mind? Let’s talk!', 'Punya project? Yuk ngobrol!')}</p>
                  <button className="hm-btn hm-btn--ghost" onClick={() => go('/price-list')}>
                    {L('See price list', 'Lihat daftar harga')}
                  </button>
                  <a className="hm-btn hm-btn--ghost" href={wa} target="_blank" rel="noopener noreferrer">
                    {L('Request a quote', 'Minta penawaran')}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══════════ 06 · DESIGN & WEB SHOWCASE ═══════════ */}
        <section id="sec-design" className="hm-sec hm-wrap">
          <Reveal className="hm-head">
            <div>
              <p className="hm-kicker">03 / {L('Design & Web', 'Desain & Web')}</p>
              <h2 className="hm-h2">
                {L('Design & Web', 'Showcase Desain')}
                <span className="hm-dim"> {L('Showcase', '& Web')}</span>
              </h2>
            </div>
            <p className="hm-head-note">
              {L('Posters, lanyards and websites — drag to explore.',
                 'Poster, lanyard, dan website — geser buat lihat semuanya.')}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <Carousel items={SHOWCASE_DESIGN} isID={isID} onOpen={go} label={L('Design and web showcase', 'Showcase desain dan web')} />
          </Reveal>

          <Reveal className="hm-btn-row">
            <button className="hm-btn hm-btn--solid" onClick={() => go('/works')}>
              {L('View all works', 'Lihat semua karya')} <Arrow />
            </button>
            <button className="hm-btn hm-btn--ghost" onClick={() => go('/price-list')}>
              {L('See price list', 'Lihat daftar harga')}
            </button>
          </Reveal>
        </section>

        {/* ═══════════ 07 · PENGHARGAAN ═══════════ */}
        <section className="hm-sec hm-wrap">
          <Reveal className="hm-head hm-head--center">
            <p className="hm-kicker">04 / {L('Recognition', 'Penghargaan')}</p>
            <h2 className="hm-h2">
              {L('What the work ', 'Yang sudah ')}
              <span className="hm-dim">{L('has earned.', 'diraih.')}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <AwardSlider isID={isID} onOpen={go} />
          </Reveal>
        </section>

        {/* ═══════════ 08 · CONTACT ═══════════ */}
        <section id="sec-contact" className="hm-sec hm-wrap hm-contact">
          <Reveal className="hm-head hm-head--center">
            <p className="hm-kicker">05 / {L('Contact', 'Kontak')}</p>
            <h2 className="hm-h2">
              {L('Write us your ', 'Ceritakan ')}
              <span className="hm-dim">{L('project details.', 'project-mu.')}</span>
            </h2>
            <p className="hm-head-note">
              {L('Pick whichever channel is easiest for you.', 'Pilih jalur yang paling nyaman buat kamu.')}
            </p>
          </Reveal>

          <div className="hm-contact-grid">
            <Reveal delay={0}>
              <a className="hm-contact-card" href={wa} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-whatsapp" />
                <span>WhatsApp</span>
                <b>+62 812-5279-0018</b>
                <Arrow />
              </a>
            </Reveal>
            <Reveal delay={0.05}>
              <a className="hm-contact-card" href={IG_URL} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-instagram" />
                <span>Instagram</span>
                <b>@aldosynnn</b>
                <Arrow />
              </a>
            </Reveal>
            <Reveal delay={0.1}>
              <a className="hm-contact-card" href="/contact" onClick={e => { e.preventDefault(); go('/contact'); }}>
                <i className="fa-regular fa-pen-to-square" />
                <span>{L('Project brief form', 'Form brief project')}</span>
                <b>{L('Fill in the details', 'Isi detailnya')}</b>
                <Arrow />
              </a>
            </Reveal>
            <Reveal delay={0.15}>
              <a className="hm-contact-card" href="/price-list" onClick={e => { e.preventDefault(); go('/price-list'); }}>
                <i className="fa-solid fa-tags" />
                <span>{L('Price list', 'Daftar harga')}</span>
                <b>{L('See packages', 'Lihat paket')}</b>
                <Arrow />
              </a>
            </Reveal>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
