import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TextReveal from '../components/TextReveal';
import ScrollReveal from '../components/ScrollReveal';
import CardStagger from '../components/CardStagger';
import ParallaxImage from '../components/ParallaxImage';

/* ─────────────────────────────────────────
   SCROLL DOTS DATA
───────────────────────────────────────── */
const DOTS = [
  { id: 'sec-home',     label: 'Home' },
  { id: 'sec-work',     label: 'Work' },
  { id: 'sec-identity', label: 'Identity' },
  { id: 'sec-skills',   label: 'Skills' },
  { id: 'sec-services', label: 'Services' },
];

/* ─────────────────────────────────────────
   ACCORDION DATA
───────────────────────────────────────── */
const ACCORDION = [
  {
    num: '01',
    title: 'Web Developer',
    en: "Building web experiences using vibe coding — fully integrated with the latest AI tools and Firebase backend. Visual-first by nature, but clean in architecture. Not just a site, it's a system.",
    id: 'Bikin web pakai vibe coding yang udah nyatu sama AI terbaru dan Firebase. Fokusnya visual dulu, tapi strukturnya tetap rapi di belakang layar. Bukan cuma website biasa, ini ekosistem digital.',
    tools: ['React / Next.js', 'GSAP Animation', 'UX Architecture', 'HTML/CSS/JS', 'Firebase'],
    note: 'Android admin app available for clients',
  },
  {
    num: '02',
    title: 'Video Editing / Motion Graphic',
    en: 'From school short films to professional production content. Rhythm, pacing, color — all dialed in. Juara 1 National Film Festival Cendana. Handles: school project finales, orientation videos, event coverage, creative competition entries.',
    id: 'Dari film pendek sekolah sampe konten promosi profesional. Ritme, tempo, warna — semuanya dirasain. Pernah Juara 1 Film Cendana Nasional. Ngerjain: tugas akhir SMA, video ospek, event, dan lomba kreatif.',
    tools: ['DaVinci Resolve', 'Adobe Premiere', 'After Effects', 'CapCut', 'Alight Motion'],
  },
  {
    num: '03',
    title: 'Illustration & Graphic Design',
    en: 'Posters for school finals, competition entries, org logos, YouTube thumbnails, lanyard design, jersey design, and more. Raw files + documentation sent for competition requirements.',
    id: 'Poster tugas akhir, poster lomba, logo organisasi, thumbnail YouTube, desain lanyard, jersey, dan lain-lain. File mentah dan dokumentasi bisa dikirim buat syarat lomba.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Canva', 'Affinity Designer'],
  },
  {
    num: '04',
    title: 'Videographer / Photographer',
    en: 'Former DOP on short films, portrait sessions, camera operator for PERBASI East Java Youth League. Comfortable with any gimbal, any brand. Solid on exposure triangle.',
    id: 'Pernah jadi DOP film pendek, potrait, dan operator kamera buat Perbasi Kabupaten Jawa Timur. Bisa pakai gimbal merek apapun. Exposure triangle udah hafal luar kepala.',
    tools: ['DJI', 'Sony', 'Canon', 'Lumix'],
  },
];

/* ─────────────────────────────────────────
   SERVICES DATA
───────────────────────────────────────── */
const SERVICES = [
  {
    num: '01',
    titleKey: 'svc1t', fallTitle: 'Portfolio Website',
    descKey: 'svc1d',
    fallDescEN: 'Creating premium digital identities for creatives, professionals, and executives who need a sophisticated online presence that reflects their unique brand.',
    fallDescID: 'Menciptakan identitas digital premium untuk para kreatif, profesional, dan eksekutif yang membutuhkan kehadiran online canggih yang mencerminkan merek unik mereka.',
  },
  {
    num: '02',
    titleKey: 'svc2t', fallTitle: 'Wedding Website',
    descKey: 'svc2d',
    fallDescEN: 'Designing elegant and personal digital invitations — capturing the most precious moments in your life with unforgettable visual beauty.',
    fallDescID: 'Merancang undangan digital yang elegan dan personal — mengabadikan momen paling berharga dalam hidup Anda dengan keindahan visual yang tak terlupakan.',
  },
  {
    num: '03',
    titleKey: 'svc3t', fallTitle: 'Video Editing & Motion',
    descKey: 'svc3d',
    fallDescEN: 'Transforming raw footage into a powerful visual narrative — from short films, vlogs, to promotional content with professional motion graphic touches.',
    fallDescID: 'Mengolah footage mentah menjadi narasi visual yang kuat — dari film pendek, vlog, hingga konten promosi dengan sentuhan motion graphic profesional.',
  },
  {
    num: '04',
    titleKey: 'svc4t', fallTitle: 'Illustration & Poster Design',
    descKey: 'svc4d',
    fallDescEN: 'Turning your ideas into visual works that speak — educational posters, thumbnails, and creative graphics for digital and print platforms.',
    fallDescID: 'Mewujudkan ide Anda menjadi karya visual yang berbicara — poster edukatif, thumbnail, dan grafis kreatif untuk platform digital maupun cetak.',
  },
  {
    num: '05',
    titleKey: 'svc5t', fallTitle: 'Videographer & Photographer',
    descKey: 'svc5d',
    fallDescEN: 'Capturing every important moment with artistic precision — from professional portrait photography to high-quality cinematic video production.',
    fallDescID: 'Mengabadikan setiap momen penting dengan presisi artistik — dari foto portrait profesional hingga produksi video sinematik berkualitas tinggi.',
  },
];

const EXTRA_TAGS = ['Jersey Design', 'Lanyard Design', 'Ospek Video', 'Experimental Film', 'Live Stream', 'Event Coverage'];

/* ─────────────────────────────────────────
   TOOL ICONS (Section 02)
───────────────────────────────────────── */
const FA_TOOLS = [
  { icon: 'fa-brands fa-react',    label: 'React.js' },
  { icon: 'fa-brands fa-fire',     label: 'Firebase' },
];
const TEXT_TOOLS = [
  'DaVinci Resolve', 'Alight Motion', 'CapCut',
  'Adobe Illustrator', 'Adobe Premiere Pro', 'Adobe Photoshop', 'Affinity Designer',
];

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
export default function Home({ t = {} }) {
  const navigate  = useNavigate();
  const isID      = t?.lang === 'id';

  const [activeDot,  setActiveDot]  = useState('sec-home');
  const [openAcc,    setOpenAcc]    = useState(0);
  const [heroPhoto,  setHeroPhoto]  = useState('/assets/img/bg1.jpg');

  const revealEls = useRef([]);

  /* ── helpers ── */
  const tr = (key, fallback) => (t && t[key]) ? t[key] : fallback;
  const go = (path) => navigate(path);
  const r  = (el) => {
    if (el && !revealEls.current.includes(el)) revealEls.current.push(el);
  };

  /* ── Firebase: load hero photo ── */
  useEffect(() => {
    import('../firebase').then(({ db }) => {
      import('firebase/firestore').then(({ doc, getDoc }) => {
        getDoc(doc(db, 'settings', 'hero')).then(snap => {
          if (snap.exists() && snap.data()?.photoUrl) {
            setHeroPhoto(snap.data().photoUrl);
          }
        });
      });
    }).catch(() => {/* silently fall back to default */});
  }, []);

  /* ── Inject CSS ── */
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  /* ── Reveal observer ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    const id = setTimeout(() => {
      revealEls.current.forEach(el => { if (el) observer.observe(el); });
    }, 60);
    return () => { clearTimeout(id); observer.disconnect(); };
  }, []);

  /* ── Dots observer ── */
  useEffect(() => {
    const obs = DOTS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveDot(id); },
        { threshold: 0.35 }
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach(o => o && o.disconnect());
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  /* ─────────────────────────────────────
     RENDER
  ───────────────────────────────────── */
  return (
    <>
      {/* ── Scroll dots ── */}
      <nav className="h-scroll-dots" aria-label="Section navigation">
        {DOTS.map(({ id, label }) => (
          <button
            key={id}
            className={`h-dot${activeDot === id ? ' active' : ''}`}
            title={label}
            onClick={() => scrollTo(id)}
            aria-label={`Go to ${label}`}
          />
        ))}
      </nav>

      {/* ══════════════════════════════════
          SECTION 01 — HERO
      ══════════════════════════════════ */}
      <section id="sec-home" className="h-hero">
        {/* Parallax background image */}
        <div className="h-home-bg-wrapper" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <ParallaxImage 
            src="/assets/img/bg1.jpg" 
            alt="Hero background"
            className="h-home-bg"
            speed={0.3}
          />
        </div>
        {/* Gradient overlay — darkens only left & bottom, face stays visible on right */}
        <div className="h-home-overlay" />

        {/* Left-aligned content */}
        <ScrollReveal className="h-home-content" direction="left" delay={0}>
          <p className="h-home-callme">
            {isID ? 'panggil aku' : 'call me'}
          </p>
          <TextReveal 
            text="Aldosynnn" 
            className="h-home-name"
            delay={0.2}
            wordMode={false}
            staggerDelay={0.08}
          />
          <div className="h-home-subtitle">
            <TextReveal 
              text={isID ? 'Merancang' : 'Architecting'} 
              className="h-home-sub1"
              delay={0.5}
              wordMode={true}
              staggerDelay={0.1}
            />
            <TextReveal 
              text={isID ? 'antarmuka digital.' : 'digital interfaces.'} 
              className="h-home-sub2"
              delay={0.7}
              wordMode={true}
              staggerDelay={0.1}
            />
            {/* Animated pencil underline */}
            <svg
              className="h-pencil-svg"
              viewBox="0 0 420 18"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className="h-pencil-path"
                d="M4 13 C60 4, 140 17, 220 9 C300 2, 360 15, 416 11"
              />
            </svg>
          </div>
          <TextReveal 
            text={isID ? '"Mengerjakan proyekmu seolah itu milikku."' : '"Working on your project as if it were mine."'} 
            className="h-home-quote"
            delay={0.9}
            wordMode={true}
            staggerDelay={0.08}
          />
          <div className="h-home-cta">
            <button className="h-btn-cta" onClick={() => go('/login')}>
              {isID ? 'Mulai Proyek' : 'Start a Project'}{' '}
              <i className="fa-solid fa-arrow-up-right" />
            </button>
          </div>
        </ScrollReveal>

        {/* Location — fixed bottom-right like Salahuddin */}
        <div className="h-home-location">
          <span>Indonesia</span>
          <span>{isID ? 'Jawa Timur' : 'East Java'}</span>
          <div className="h-loc-line" />
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 02 — SELECTED WORK
      ══════════════════════════════════ */}
      <section id="sec-work" className="h-section h-section--work">
        <ScrollReveal className="h-sec-label" direction="up" delay={0}>
          <span ref={r} className="reveal">01 / Project</span>
        </ScrollReveal>

        <ScrollReveal className="h-sec-title" direction="up" delay={0.1}>
          <h2 ref={r} className="reveal rv-d1">
            Selected{' '}
            <span className="h-grad-text">Work.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal className="h-work-grid" direction="up" delay={0.2}>
          <div ref={r} className="reveal rv-d2">
          {/* Left: project visual */}
          <div className="h-work-visual">
            <div className="h-work-img-frame">
              <div className="h-work-img-inner">
                <div className="h-work-placeholder">
                  <i className="fa-solid fa-film" />
                  <span>SynnnW Studio</span>
                </div>
              </div>
              <div className="h-work-frame-accent" />
            </div>

            {/* Tool strip */}
            <div className="h-tool-strip">
              {FA_TOOLS.map(({ icon, label }) => (
                <div key={label} className="h-tool-chip h-tool-chip--icon" title={label}>
                  <i className={icon} />
                  <span>{label}</span>
                </div>
              ))}
              {TEXT_TOOLS.map((tool) => (
                <div key={tool} className="h-tool-chip" title={tool}>
                  <span>{tool}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: project info */}
          <div className="h-work-info">
            <div className="h-work-num">01</div>
            <h3 className="h-work-title">SynnnW Studio</h3>
            <p className="h-work-desc">
              {isID
                ? 'Studio kreatif yang ngerjain semua — dari web yang clean, video yang sinematik, desain yang kena, sampai foto yang bicara sendiri.'
                : 'A full-stack creative studio handling premium web builds, cinematic video production, graphic illustration, and photography. Every deliverable is treated like our own work.'}
            </p>
            <div className="h-work-tags">
              {['Web Dev', 'Video', 'Illustration', 'Photography', 'Live Stream'].map(tag => (
                <span key={tag} className="h-tag">{tag}</span>
              ))}
            </div>
            <button className="h-work-link" onClick={() => go('/works')}>
              <span>{tr('worksViewAll', 'View All Works')}</span>
              <i className="fa-solid fa-arrow-up-right" />
            </button>
          </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════
          SECTION 03 — IDENTITY
      ══════════════════════════════════ */}
      <section id="sec-identity" className="h-section h-section--identity">
        <ScrollReveal className="h-sec-label" direction="up" delay={0}>
          <span ref={r} className="reveal">02 / Identity</span>
        </ScrollReveal>

        <ScrollReveal className="h-identity-heading" direction="up" delay={0.1}>
          <h2 ref={r} className="reveal rv-d1">
            <span className="h-who">Who</span>{' '}
            <span className="h-am">Am</span>{' '}
            <span className="h-i">I?</span>
          </h2>
        </ScrollReveal>

        <div className="h-identity-grid">
          {/* Photo with barrier */}
          <ScrollReveal ref={r} className="h-photo-wrap" direction="left" delay={0.2}>
            <div className="h-photo-frame">
              <img
                src={heroPhoto}
                alt="Aldo Leo Saputra"
                draggable={false}
                className="h-photo-img"
              />
              {/* Barrier — prevents right-click, drag, save */}
              <div
                className="h-photo-barrier"
                onContextMenu={e => e.preventDefault()}
                draggable={false}
              />
            </div>
            <div className="h-photo-glow" aria-hidden="true" />
          </ScrollReveal>

          {/* Copy */}
          <ScrollReveal ref={r} className="h-identity-copy" direction="right" delay={0.2}>
            <p className="h-identity-en">
              A multidisciplinary digital creator, based in East Java. Not a generalist — a specialist in multiple crafts. Web, video, illustration, photography — all handled with the same level of obsession.
            </p>
            {isID && (
              <p className="h-identity-id">
                Kreator digital dari Jawa Timur yang nggak cuma bisa satu hal. Web, video, desain, foto — semua dikerjain serius, bukan setengah-setengah.
              </p>
            )}
            <div className="h-identity-stats">
              <div className="h-stat">
                <span className="h-stat-num">4</span>
                <span className="h-stat-label">{tr('statYearsActive', isID ? '4 Tahun Aktif' : '4 Years Active')}</span>
              </div>
              <div className="h-stat-divider" />
              <div className="h-stat">
                <span className="h-stat-num">21+</span>
                <span className="h-stat-label">{tr('statProjects', isID ? '21+ Proyek' : '21+ Projects')}</span>
              </div>
              <div className="h-stat-divider" />
              <div className="h-stat">
                <span className="h-stat-num">∞</span>
                <span className="h-stat-label">{tr('statDisciplines', isID ? 'Multidisiplin' : 'Multiple Disciplines')}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 04 — ACCORDION SKILLS
      ══════════════════════════════════ */}
      <section id="sec-skills" className="h-section h-section--skills">
        <ScrollReveal className="h-sec-label" direction="up" delay={0}>
          <span ref={r} className="reveal">03 / Skills</span>
        </ScrollReveal>

        <h2 ref={r} className="h-sec-title reveal rv-d1">
          What I{' '}
          <span className="h-grad-text">Do.</span>
        </h2>

        <div ref={r} className="h-acc-wrap reveal rv-d2">
          {ACCORDION.map((item, idx) => (
            <div
              key={idx}
              className={`h-acc-item${openAcc === idx ? ' open' : ''}`}
            >
              <div
                className="h-acc-hdr"
                role="button"
                tabIndex={0}
                onClick={() => setOpenAcc(openAcc === idx ? -1 : idx)}
                onKeyDown={e => e.key === 'Enter' && setOpenAcc(openAcc === idx ? -1 : idx)}
                aria-expanded={openAcc === idx}
              >
                <span className="h-acc-num">{item.num}</span>
                <span className="h-acc-title">{item.title}</span>
                <span className="h-acc-ico" aria-hidden="true">
                  <i className="fa-solid fa-plus" />
                </span>
              </div>

              <div className="h-acc-body" aria-hidden={openAcc !== idx}>
                <p className="h-acc-text">
                  {isID ? item.id : item.en}
                </p>
                {item.note && (
                  <p className="h-acc-note">
                    <i className="fa-solid fa-circle-info" />
                    {' '}{item.note}
                  </p>
                )}
                <div className="h-acc-tools">
                  {item.tools.map(tool => (
                    <span key={tool} className="h-acc-tool">{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 05 — CAPABILITIES
      ══════════════════════════════════ */}
      <section id="sec-services" className="h-section h-section--services">
        <ScrollReveal className="h-sec-label" direction="up" delay={0}>
          <span ref={r} className="reveal">04 / Capabilities</span>
        </ScrollReveal>

        <ScrollReveal className="h-sec-title" direction="up" delay={0.1}>
          <h2 ref={r} className="reveal rv-d1">
            Our{' '}
            <span className="h-grad-text">Services.</span>
          </h2>
        </ScrollReveal>

        <CardStagger className="h-svc-grid" staggerDelay={0.15} containerDelay={0.2}>
          {SERVICES.map((svc, idx) => {
            const delay = idx % 3 === 1 ? ' rv-d1' : idx % 3 === 2 ? ' rv-d2' : '';
            return (
              <div
                key={svc.num}
                ref={r}
                className={`h-svc-card reveal${delay}`}
              >
                <div className="h-svc-num">{svc.num}</div>
                <h3 className="h-svc-title">{tr(svc.titleKey, svc.fallTitle)}</h3>
                <p className="h-svc-desc">
                  {isID
                    ? tr(svc.descKey + '_id', svc.fallDescID)
                    : tr(svc.descKey, svc.fallDescEN)}
                </p>
              </div>
            );
          })}
        </CardStagger>

        {/* Extra tags strip */}
        <ScrollReveal ref={r} className="h-extra-tags" direction="up" delay={0.3}>
          <div ref={r} className="reveal rv-d1">
            {EXTRA_TAGS.map(tag => (
              <span key={tag} className="h-tag h-tag--accent">{tag}</span>
            ))}
          </div>
        </ScrollReveal>

        {/* TERTARIK / INTERESTED CTA Button */}
        <ScrollReveal ref={r} className="h-cta-center" direction="up" delay={0.4}>
          <div ref={r} className="reveal rv-d2">
            <button
              className="cta-tertarik"
              onClick={() => go('/price-list')}
            >
              <span>{isID ? 'TERTARIK?' : 'INTERESTED?'}</span>
              <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.85rem' }} />
            </button>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────
   INJECTED CSS
───────────────────────────────────────── */
const CSS = `
/* ── Reveal animations ── */
.reveal {
  opacity: 0;
  transform: translateY(34px);
  transition: opacity 0.78s ease, transform 0.78s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }
.rv-d1 { transition-delay: 0.13s; }
.rv-d2 { transition-delay: 0.26s; }
.rv-d3 { transition-delay: 0.39s; }

/* ── Scroll dots ── */
.h-scroll-dots {
  position: fixed; right: 20px; top: 50%; transform: translateY(-50%);
  z-index: 200; display: flex; flex-direction: column; gap: 10px;
  background: none; border: none;
}
.h-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--text-dim); border: none; padding: 0; cursor: pointer;
  transition: all 0.35s ease;
}
.h-dot.active { background: var(--accent); transform: scale(2); }
.h-dot:hover  { background: var(--accent3); }

/* ══════════════════════════════
   SECTION 01 — HERO
══════════════════════════════ */
.h-hero {
  position: relative; min-height: 100vh;
  display: flex; align-items: center; overflow: hidden;
}

/* Static background image */
.h-home-bg {
  position: absolute; inset: 0; z-index: 0;
  width: 100%; height: 100%;
  background-size: cover; background-position: center top;
  opacity: 0.32;
}
.h-home-bg img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center top;
}

/* Directional overlay — dark left side, face visible on right */
.h-home-overlay {
  position: absolute; inset: 0; z-index: 1;
  background:
    linear-gradient(to right, rgba(7,7,9,0.88) 0%, rgba(7,7,9,0.55) 42%, rgba(7,7,9,0.05) 72%),
    linear-gradient(to top,   rgba(7,7,9,0.75) 0%, rgba(7,7,9,0.00) 40%);
}

/* Left-aligned text block */
.h-home-content {
  position: relative; z-index: 2;
  padding: 140px 80px 80px; max-width: 860px;
}

/* "panggil aku" script */
.h-home-callme {
  font-family: 'Dancing Script', cursive;
  font-size: 2.2rem; font-weight: 400;
  color: var(--text); opacity: 0.75; margin-bottom: -6px;
  animation: fadeUp 1s ease 0.3s both;
}

/* Big name */
.h-home-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(4.5rem, 11vw, 9.5rem);
  font-weight: 700; line-height: 0.87;
  letter-spacing: -2px; color: var(--text);
  animation: fadeUp 1s ease 0.5s both;
}

/* Subtitle block */
.h-home-subtitle { margin-top: 22px; animation: fadeUp 1s ease 0.7s both; }
.h-home-sub1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 4vw, 3.4rem);
  font-weight: 600; color: var(--text); display: block;
}
.h-home-sub2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 4vw, 3.4rem);
  font-weight: 400; color: var(--text); display: block;
}
.h-home-sub2 em { font-style: italic; color: var(--accent3); }

/* Animated pencil underline */
.h-pencil-svg {
  display: block; width: 100%; max-width: 420px;
  height: 18px; margin-top: -2px; overflow: visible;
}
.h-pencil-path {
  stroke: var(--accent2); stroke-width: 2.8; fill: none;
  stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 480; stroke-dashoffset: 480;
  animation: pencilDraw 1.4s ease 1.6s forwards;
}
@keyframes pencilDraw { to { stroke-dashoffset: 0; } }

/* Quote */
.h-home-quote {
  margin-top: 22px; font-size: 0.94rem;
  color: var(--text-dim); font-style: italic; letter-spacing: 0.3px;
  animation: fadeUp 1s ease 0.9s both;
}

/* CTA */
.h-home-cta { margin-top: 30px; animation: fadeUp 1s ease 1.1s both; }
.h-btn-cta {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--accent); color: #fff; border: none; border-radius: 99px;
  padding: 15px 34px;
  font-family: 'Outfit', sans-serif; font-size: 0.74rem; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  box-shadow: 0 8px 32px rgba(139,92,246,0.35);
  transition: all 0.35s ease; cursor: pointer;
  white-space: nowrap;
}
.h-btn-cta:hover {
  background: var(--accent2); transform: scale(1.06);
  box-shadow: 0 14px 44px rgba(139,92,246,0.45);
}

/* Location — bottom right */
.h-home-location {
  position: absolute; right: 80px; bottom: 60px;
  z-index: 2; text-align: right;
  animation: fadeUp 1s ease 1.3s both;
}
.h-home-location span {
  display: block; font-size: 0.67rem; font-weight: 600;
  letter-spacing: 0.28em; text-transform: uppercase; color: var(--text-dim);
}
.h-home-location span:first-child {
  color: var(--text); font-size: 0.78rem; margin-bottom: 3px;
}
.h-loc-line {
  width: 52px; height: 1px;
  background: var(--border2); margin-left: auto; margin-top: 9px;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(26px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ══════════════════════════════
   SHARED SECTION STYLES
══════════════════════════════ */
.h-section {
  padding: 110px 80px;
  position: relative;
}
.h-section--work     { background: linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%); }
.h-section--identity { background: linear-gradient(180deg, var(--bg2) 0%, var(--bg3) 100%); }
.h-section--skills   { background: linear-gradient(180deg, var(--bg3) 0%, var(--bg) 100%); }
.h-section--services { background: linear-gradient(180deg, var(--bg2) 0%, var(--bg3) 100%); }

.h-sec-label {
  display: block; font-family: 'Outfit', sans-serif;
  font-size: 0.62rem; font-weight: 600;
  letter-spacing: 0.32em; text-transform: uppercase;
  color: var(--text-dim); margin-bottom: 16px;
}
.h-sec-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.8rem, 6.5vw, 6rem);
  font-weight: 300; line-height: 0.9; letter-spacing: -1px;
  color: var(--text); margin-bottom: 64px;
}
.h-grad-text {
  font-style: italic;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Tags */
.h-tag {
  display: inline-block;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 99px; padding: 5px 13px;
  font-family: 'Outfit', sans-serif; font-size: 0.62rem;
  font-weight: 600; color: var(--text-dim);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s;
}
.h-tag:hover { border-color: var(--accent3); color: var(--accent3); }
.h-tag--accent {
  background: rgba(139,92,246,0.07);
  border-color: rgba(139,92,246,0.2);
  color: var(--accent3);
}
.h-tag--accent:hover { background: rgba(139,92,246,0.15); border-color: var(--accent); }

/* ══════════════════════════════
   SECTION 02 — SELECTED WORK
══════════════════════════════ */
.h-work-grid {
  display: grid; grid-template-columns: 1.1fr 1fr;
  gap: 70px; align-items: start;
}

/* Visual left */
.h-work-visual { display: flex; flex-direction: column; gap: 24px; }
.h-work-img-frame {
  position: relative; border-radius: 20px; overflow: hidden;
  aspect-ratio: 4/3;
  background: var(--bg3); border: 1px solid var(--border);
}
.h-work-img-inner {
  width: 100%; height: 100%;
  background-image: url('/assets/img/belajar.jpg');
  background-size: cover;
  background-position: center;
}
.h-work-placeholder {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
  background: transparent;
  color: var(--text-dim);
}
.h-work-placeholder i { font-size: 3rem; opacity: 0.15; }
.h-work-placeholder span {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem; font-weight: 600; opacity: 0.3;
  letter-spacing: 0.05em;
}
.h-work-frame-accent {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(135deg, rgba(139,92,246,0.08) 0%, transparent 60%);
}

/* Tool strip */
.h-tool-strip {
  display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
}
.h-tool-chip {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 8px; padding: 5px 11px;
  font-family: 'Outfit', sans-serif; font-size: 0.6rem;
  font-weight: 600; color: var(--text-dim);
  transition: all 0.25s; cursor: default;
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
}
.h-tool-chip:hover { border-color: var(--accent3); color: var(--accent3); }
.h-tool-chip--icon i { font-size: 0.78rem; color: var(--accent3); }

/* Info right */
.h-work-info { padding-top: 10px; }
.h-work-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 5rem; font-weight: 300;
  color: var(--border2); line-height: 1; margin-bottom: 8px;
}
.h-work-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.4rem; font-weight: 600; line-height: 1.1; margin-bottom: 18px;
}
.h-work-desc {
  font-family: 'Outfit', sans-serif;
  font-size: 0.84rem; line-height: 1.9; color: var(--text-dim); margin-bottom: 24px;
}
.h-work-tags {
  display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 30px;
}
.h-work-link {
  display: inline-flex; align-items: center; gap: 9px;
  background: none; border: none; border-bottom: 1px solid var(--border2);
  color: var(--text); padding-bottom: 4px;
  font-family: 'Outfit', sans-serif; font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  transition: gap 0.3s, border-color 0.3s, color 0.3s; cursor: pointer;
}
.h-work-link:hover {
  gap: 16px; border-color: var(--accent2); color: var(--accent2);
}

/* ══════════════════════════════
   SECTION 03 — IDENTITY
══════════════════════════════ */
.h-identity-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 7vw, 6.5rem);
  font-weight: 300; line-height: 0.92; letter-spacing: -1px;
  margin-bottom: 60px;
}
.h-who { color: var(--text-dim); }
.h-am  { color: var(--accent2); font-style: italic; }
.h-i   { color: var(--text); }

.h-identity-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 72px; align-items: center;
}

/* Photo frame */
.h-photo-wrap { position: relative; }
.h-photo-frame {
  position: relative;
  width: 100%; max-width: 480px; aspect-ratio: 1;
  border-radius: 20px; overflow: hidden;
  border: 1px solid var(--border);
}
.h-photo-img {
  display: block; width: 100%; height: 100%;
  object-fit: cover; pointer-events: none;
  user-select: none; -webkit-user-drag: none;
}
/* Barrier layer */
.h-photo-barrier {
  position: absolute; inset: 0; z-index: 2;
  background: transparent; cursor: default;
  -webkit-user-drag: none;
}
.h-photo-glow {
  position: absolute; inset: -20%; z-index: -1; pointer-events: none;
  background: radial-gradient(circle at 50% 50%, rgba(139,92,246,0.12), transparent 70%);
}

/* Copy */
.h-identity-en {
  font-family: 'Outfit', sans-serif;
  font-size: 0.94rem; line-height: 1.9; color: var(--text); margin-bottom: 18px;
}
.h-identity-id {
  font-family: 'Outfit', sans-serif;
  font-size: 0.86rem; line-height: 1.85; color: var(--text-dim);
  border-left: 2px solid var(--accent3); padding-left: 16px; margin-bottom: 32px;
}

/* Stats row */
.h-identity-stats {
  display: flex; align-items: center; gap: 24px;
  margin-top: 32px;
}
.h-stat {
  display: flex; flex-direction: column; gap: 4px;
}
.h-stat-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.2rem; font-weight: 700; line-height: 1;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.h-stat-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.62rem; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text-dim);
}
.h-stat-divider {
  width: 1px; height: 36px; background: var(--border2);
}

/* ══════════════════════════════
   SECTION 04 — ACCORDION SKILLS
══════════════════════════════ */
.h-acc-wrap {
  max-width: 860px;
}
.h-acc-item {
  border-top: 1px solid var(--border);
}
.h-acc-item:last-child { border-bottom: 1px solid var(--border); }
.h-acc-hdr {
  display: flex; align-items: center; gap: 0;
  padding: 24px 0; cursor: pointer; outline: none;
  transition: opacity 0.2s;
}
.h-acc-hdr:hover .h-acc-num,
.h-acc-hdr:hover .h-acc-title { color: var(--accent2); }
.h-acc-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.82rem; font-weight: 700; color: var(--text-dim);
  flex-shrink: 0; transition: color 0.3s; width: 38px;
}
.h-acc-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem; font-weight: 600;
  flex: 1; padding-left: 12px; transition: color 0.3s;
}
.h-acc-ico {
  width: 28px; height: 28px; border-radius: 50%;
  border: 1px solid var(--border2); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.62rem; color: var(--text-dim);
  transition: all 0.35s ease;
}
.h-acc-item.open .h-acc-ico {
  background: var(--accent); color: #fff;
  border-color: var(--accent); transform: rotate(45deg);
}
.h-acc-body {
  max-height: 0; overflow: hidden;
  transition: max-height 0.52s cubic-bezier(0.4,0,0.2,1);
}
.h-acc-item.open .h-acc-body { max-height: 420px; }
.h-acc-text {
  font-family: 'Outfit', sans-serif;
  font-size: 0.84rem; line-height: 1.9; color: var(--text-dim);
  padding-bottom: 14px;
}
.h-acc-note {
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem; color: var(--accent3); margin-bottom: 12px;
  display: flex; align-items: center; gap: 6px;
}
.h-acc-tools {
  display: flex; flex-wrap: wrap; gap: 7px; padding-bottom: 28px;
}
.h-acc-tool {
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 7px; padding: 4px 12px;
  font-family: 'Outfit', sans-serif; font-size: 0.62rem;
  font-weight: 600; color: var(--text-dim);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
}

/* ══════════════════════════════
   SECTION 05 — CAPABILITIES
══════════════════════════════ */
.h-svc-grid {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 18px; margin-bottom: 30px;
}
.h-svc-card {
  background: var(--glass); border: 1px solid var(--gborder);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border-radius: 20px; padding: 32px 26px;
  position: relative; overflow: hidden; transition: all 0.4s ease;
}
.h-svc-card::before {
  content: ''; position: absolute; inset: 0; border-radius: 20px;
  background: linear-gradient(135deg, rgba(139,92,246,0.07) 0%, transparent 60%);
  opacity: 0; transition: opacity 0.4s;
}
.h-svc-card:hover { transform: translateY(-6px); border-color: rgba(139,92,246,0.28); }
.h-svc-card:hover::before { opacity: 1; }
.h-svc-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.6rem; font-weight: 300; color: var(--border2); line-height: 1; margin-bottom: 14px;
}
.h-svc-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem; font-weight: 600; margin-bottom: 12px;
}
.h-svc-desc {
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem; line-height: 1.78; color: var(--text-dim);
}

/* Extra tags strip */
.h-extra-tags {
  display: flex; flex-wrap: wrap; gap: 8px;
  margin-top: 22px; margin-bottom: 56px;
}

/* TERTARIK CTA */
.h-cta-center {
  display: flex; justify-content: center; padding-bottom: 10px;
}

/* ── TERTARIK animated button (PATCH 06-A) ── */
.cta-tertarik {
  position: relative;
  display: inline-flex; align-items: center; gap: 10px;
  padding: 18px 52px;
  font-family: 'Outfit', sans-serif; font-size: 1rem;
  font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase;
  border: none; border-radius: 99px; cursor: pointer; overflow: hidden;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #a78bfa 100%);
  background-size: 200% 200%; color: #fff;
  box-shadow: 0 0 0 0 rgba(139,92,246,0.5);
  animation: cta-gradient 3s ease infinite, cta-pulse 2s ease-in-out infinite;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.cta-tertarik:hover {
  transform: scale(1.06) translateY(-2px);
  box-shadow: 0 8px 40px rgba(139,92,246,0.5);
  animation-play-state: paused;
}
.cta-tertarik::before {
  content: '';
  position: absolute; top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
  transform: translateX(-100%) rotate(45deg);
  animation: cta-shimmer 2.5s ease-in-out infinite;
}
@keyframes cta-gradient {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}
@keyframes cta-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); }
  50%       { box-shadow: 0 0 0 16px rgba(139,92,246,0); }
}
@keyframes cta-shimmer {
  0%   { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(200%) rotate(45deg); }
}

/* ══════════════════════════════
   LIGHT MODE OVERRIDES
══════════════════════════════ */
[data-theme="light"] .h-home-bg {
  opacity: 0.60; filter: saturate(0.9) contrast(1.02);
}
[data-theme="light"] .h-home-overlay {
  background:
    linear-gradient(to right, rgba(242,239,233,0.92) 0%, rgba(242,239,233,0.58) 38%, rgba(242,239,233,0.00) 65%),
    linear-gradient(to top,   rgba(242,239,233,0.78) 0%, rgba(242,239,233,0.00) 35%);
}
[data-theme="light"] .h-home-callme,
[data-theme="light"] .h-home-name,
[data-theme="light"] .h-home-sub1,
[data-theme="light"] .h-home-sub2 { color: #1a1a2e; }

/* ══════════════════════════════
   RESPONSIVE
══════════════════════════════ */
@media (max-width: 1024px) {
  .h-home-content { padding: 120px 48px 80px; }
  .h-home-location { right: 48px; bottom: 50px; }
  .h-section      { padding: 88px 48px; }
  .h-svc-grid     { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  /* Hero — vertical / left-aligned on mobile */
  .h-home-content {
    padding: 120px 28px 100px;
    max-width: 100%;
  }
  .h-home-callme  { font-size: 1.8rem; }
  .h-home-name    { font-size: clamp(3rem, 15vw, 5rem); letter-spacing: -1px; }
  .h-home-subtitle { margin-top: 16px; }
  .h-pencil-svg   { margin: 0; }
  .h-home-cta     { display: flex; margin-top: 20px; }
  .h-home-location { right: 22px; bottom: 32px; }
  /* Sections below hero */
  .h-scroll-dots  { display: none; }
  .h-section      { padding: 72px 24px; }
  .h-sec-title    { margin-bottom: 40px; }
  .h-work-grid    { grid-template-columns: 1fr; gap: 36px; }
  .h-identity-grid { grid-template-columns: 1fr; gap: 36px; }
  .h-photo-frame  { max-width: 100%; }
  .h-svc-grid     { grid-template-columns: 1fr; }
  .h-identity-heading { margin-bottom: 36px; }
  .h-identity-stats { gap: 16px; }
  .cta-tertarik   { padding: 16px 36px; font-size: 0.9rem; }
}

/* ─────────────────────────────────────────────────────────────
   EXTRA MOBILE BREAKPOINT for tiny screens (< 480px)
───────────────────────────────────────────────────────────────── */
@media (max-width: 480px) {
  .h-home-content {
    padding: 100px 16px 80px;
    max-width: 100%;
  }
  .h-home-callme  { font-size: 1.5rem; }
  .h-home-name    { font-size: clamp(2.6rem, 15vw, 3.8rem); letter-spacing: -0.5px; }
  .h-home-subtitle { margin-top: 14px; }
  .h-home-sub1    { font-size: clamp(1.3rem, 3.2vw, 2rem); }
  .h-home-sub2    { font-size: clamp(1.3rem, 3.2vw, 2rem); }
  .h-pencil-svg   { margin: 0; max-width: 250px; width: 100%; }
  .h-home-quote   { font-size: 0.82rem; margin-top: 14px; line-height: 1.5; }
  .h-home-cta     { display: flex; margin-top: 18px; width: 100%; }
  .h-btn-cta      { padding: 12px 28px; font-size: 0.65rem; white-space: nowrap; }
  .h-home-location { right: 14px; bottom: 24px; font-size: 0.6rem; }
  
  .h-section      { padding: 60px 16px; }
  .h-sec-label    { font-size: 0.54rem; }
  .h-sec-title    { margin-bottom: 28px; font-size: clamp(1.9rem, 7.5vw, 2.8rem); }
  .h-work-grid    { gap: 20px; }
  .h-identity-grid { gap: 20px; }
  .h-svc-grid     { gap: 18px; }
  .cta-tertarik   { padding: 12px 26px; font-size: 0.75rem; }
}

/* Prevent horizontal scroll on all screen sizes */
html, body { overflow-x: hidden; }
`;
