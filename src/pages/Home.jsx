import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [heroPhoto,  setHeroPhoto]  = useState('/assets/img/aldo.jpg');

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
        {/* Grid lines decoration */}
        <div className="h-grid" aria-hidden="true">
          {[...Array(6)].map((_, i) => <div key={i} className="h-grid-line" />)}
        </div>

        {/* Floating accent dots */}
        <div className="h-dots-deco" aria-hidden="true">
          {[...Array(5)].map((_, i) => <div key={i} className={`h-dot-deco h-dot-deco--${i + 1}`} />)}
        </div>

        {/* Noise texture overlay */}
        <div className="h-noise" aria-hidden="true" />

        <div className="h-hero-inner">
          {/* Tag label */}
          <div className="h-tag-label">
            <span className="h-tag-dot" />
            Call me Aldosynnn
          </div>

          {/* Main heading */}
          <h1 className="h-heading">
            <span className="h-heading-line1">Architecting</span>
            <span className="h-heading-line2">
              digital <em>interfaces</em>
            </span>
          </h1>

          {/* Sub copy */}
          <p className="h-sub">Working on your project is mine.</p>

          {/* CTA row */}
          <div className="h-cta-row">
            <button className="h-btn-primary" onClick={() => go('/login')}>
              Start a Project
              <i className="fa-solid fa-arrow-up-right" />
            </button>
            <button className="h-btn-ghost" onClick={() => go('/works')}>
              View Works
              <i className="fa-solid fa-arrow-right" />
            </button>
          </div>

          {/* Location badge */}
          <div className="h-location">
            <span className="h-location-dot" />
            Indonesia &bull; East Java
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 02 — SELECTED WORK
      ══════════════════════════════════ */}
      <section id="sec-work" className="h-section h-section--work">
        <span ref={r} className="h-sec-label reveal">01 / Project</span>

        <h2 ref={r} className="h-sec-title reveal rv-d1">
          Selected{' '}
          <span className="h-grad-text">Work.</span>
        </h2>

        <div ref={r} className="h-work-grid reveal rv-d2">
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
      </section>

      {/* ══════════════════════════════════
          SECTION 03 — IDENTITY
      ══════════════════════════════════ */}
      <section id="sec-identity" className="h-section h-section--identity">
        <span ref={r} className="h-sec-label reveal">02 / Identity</span>

        <h2 ref={r} className="h-identity-heading reveal rv-d1">
          <span className="h-who">Who</span>{' '}
          <span className="h-am">Am</span>{' '}
          <span className="h-i">I?</span>
        </h2>

        <div className="h-identity-grid">
          {/* Photo with barrier */}
          <div ref={r} className="h-photo-wrap reveal rv-d2">
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
          </div>

          {/* Copy */}
          <div ref={r} className="h-identity-copy reveal rv-d3">
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
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 04 — ACCORDION SKILLS
      ══════════════════════════════════ */}
      <section id="sec-skills" className="h-section h-section--skills">
        <span ref={r} className="h-sec-label reveal">03 / Skills</span>

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
        <span ref={r} className="h-sec-label reveal">04 / Capabilities</span>

        <h2 ref={r} className="h-sec-title reveal rv-d1">
          Our{' '}
          <span className="h-grad-text">Services.</span>
        </h2>

        <div className="h-svc-grid">
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
        </div>

        {/* Extra tags strip */}
        <div ref={r} className="h-extra-tags reveal rv-d1">
          {EXTRA_TAGS.map(tag => (
            <span key={tag} className="h-tag h-tag--accent">{tag}</span>
          ))}
        </div>

        {/* TERTARIK / INTERESTED CTA Button */}
        <div ref={r} className="h-cta-center reveal rv-d2">
          <button
            className="cta-tertarik"
            onClick={() => go('/price-list')}
          >
            <span>{isID ? 'TERTARIK?' : 'INTERESTED?'}</span>
            <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.85rem' }} />
          </button>
        </div>
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
  display: flex; align-items: center;
  overflow: hidden;
  background: linear-gradient(145deg, #070709 0%, #0a0812 45%, #0d0d1a 100%);
}

/* Grid lines */
.h-grid {
  position: absolute; inset: 0; z-index: 0;
  display: flex; pointer-events: none;
}
.h-grid-line {
  flex: 1; border-right: 1px solid rgba(139,92,246,0.05);
}

/* Floating accent dots decoration */
.h-dots-deco { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.h-dot-deco {
  position: absolute; border-radius: 50%;
  background: radial-gradient(circle, rgba(139,92,246,0.5), transparent 70%);
  animation: dotFloat 6s ease-in-out infinite;
}
.h-dot-deco--1 { width: 300px; height: 300px; top: -80px; right: 12%; animation-delay: 0s; opacity: 0.18; }
.h-dot-deco--2 { width: 180px; height: 180px; bottom: 15%; left: 5%;  animation-delay: 1.2s; opacity: 0.12; }
.h-dot-deco--3 { width: 80px;  height: 80px;  top: 35%; right: 28%;  animation-delay: 2.4s; opacity: 0.22; }
.h-dot-deco--4 { width: 120px; height: 120px; bottom: 30%; right: 8%; animation-delay: 0.6s; opacity: 0.1; }
.h-dot-deco--5 { width: 50px;  height: 50px;  top: 20%; left: 35%;   animation-delay: 3s;   opacity: 0.28; }
@keyframes dotFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50%       { transform: translateY(-18px) scale(1.06); }
}

/* Noise texture */
.h-noise {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  opacity: 0.022;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* Hero content */
.h-hero-inner {
  position: relative; z-index: 2;
  padding: 130px 80px 80px; max-width: 900px;
}

/* Tag label */
.h-tag-label {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'Outfit', sans-serif; font-size: 0.68rem; font-weight: 600;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--accent3); opacity: 0.9; margin-bottom: 28px;
  animation: heroFadeUp 0.9s ease 0.2s both;
}
.h-tag-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent3);
  box-shadow: 0 0 8px var(--accent3);
  animation: pulse 2s ease infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.7); }
}

/* Heading */
.h-heading {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300; line-height: 0.9;
  letter-spacing: -2px; color: var(--text);
  margin: 0 0 24px;
}
.h-heading-line1 {
  display: block;
  font-size: clamp(4rem, 10vw, 9rem);
  animation: heroFadeUp 0.9s ease 0.4s both;
}
.h-heading-line2 {
  display: block;
  font-size: clamp(3.5rem, 9vw, 8rem);
  animation: heroFadeUp 0.9s ease 0.55s both;
}
.h-heading-line2 em {
  font-style: italic; color: var(--accent3);
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Sub copy */
.h-sub {
  font-family: 'Outfit', sans-serif; font-size: 1rem;
  color: var(--text-dim); font-style: italic;
  letter-spacing: 0.02em; margin-bottom: 38px;
  animation: heroFadeUp 0.9s ease 0.7s both;
}

/* CTA row */
.h-cta-row {
  display: flex; flex-wrap: wrap; gap: 14px; align-items: center;
  margin-bottom: 40px;
  animation: heroFadeUp 0.9s ease 0.85s both;
}
.h-btn-primary {
  display: inline-flex; align-items: center; gap: 10px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff; border: none; border-radius: 99px;
  padding: 14px 32px;
  font-family: 'Outfit', sans-serif; font-size: 0.74rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  box-shadow: 0 8px 32px rgba(139,92,246,0.35);
  transition: all 0.32s ease; cursor: pointer;
}
.h-btn-primary:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 16px 48px rgba(139,92,246,0.5);
}
.h-btn-ghost {
  display: inline-flex; align-items: center; gap: 9px;
  background: transparent; color: var(--text-dim);
  border: 1px solid var(--border2); border-radius: 99px;
  padding: 13px 28px;
  font-family: 'Outfit', sans-serif; font-size: 0.74rem; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  transition: all 0.32s ease; cursor: pointer;
}
.h-btn-ghost:hover {
  border-color: var(--accent3); color: var(--accent3);
  transform: translateX(4px);
}

/* Location */
.h-location {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'Outfit', sans-serif; font-size: 0.62rem; font-weight: 600;
  letter-spacing: 0.28em; text-transform: uppercase; color: var(--text-dim);
  animation: heroFadeUp 0.9s ease 1s both;
}
.h-location-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--accent2); flex-shrink: 0;
}

@keyframes heroFadeUp {
  from { opacity: 0; transform: translateY(28px); }
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
}
.h-work-placeholder {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
  background: linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%);
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
[data-theme="light"] .h-hero {
  background: linear-gradient(145deg, #FAF8F5 0%, #F0EBF8 50%, #EDE5F7 100%);
}
[data-theme="light"] .h-grid-line {
  border-color: rgba(124,58,237,0.04);
}
[data-theme="light"] .h-heading-line2 em {
  background: linear-gradient(135deg, #7C3AED, #8B5CF6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ══════════════════════════════
   RESPONSIVE
══════════════════════════════ */
@media (max-width: 1024px) {
  .h-hero-inner { padding: 120px 48px 80px; }
  .h-section    { padding: 88px 48px; }
  .h-svc-grid   { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .h-scroll-dots  { display: none; }
  .h-hero-inner   { padding: 110px 24px 70px; }
  .h-section      { padding: 72px 24px; }
  .h-work-grid    { grid-template-columns: 1fr; gap: 36px; }
  .h-identity-grid { grid-template-columns: 1fr; gap: 36px; }
  .h-photo-frame  { max-width: 100%; }
  .h-svc-grid     { grid-template-columns: 1fr; }
  .h-sec-title    { margin-bottom: 40px; }
  .h-identity-heading { margin-bottom: 36px; }
  .h-heading-line1 { font-size: clamp(3rem, 14vw, 5rem); }
  .h-heading-line2 { font-size: clamp(2.6rem, 12vw, 4.5rem); }
  .h-identity-stats { gap: 16px; }
  .cta-tertarik   { padding: 16px 36px; font-size: 0.9rem; }
}
`;
