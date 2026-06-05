import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const DOTS = [
  { id: 'sec-home',  label: 'Home' },
  { id: 'sec-work',  label: 'Work' },
  { id: 'sec-about', label: 'Tentang' },
  { id: 'sec-cap',   label: 'Kemampuan' },
];

const ACCORDION = [
  {
    num: '01—', titleKey: 'acc1t', fallTitle: 'Web Developer',
    descKey: 'acc1p',
    fallDesc: 'Saya mengkhususkan diri dalam desain React kelas atas dan arsitektur responsif yang bersih untuk identitas digital premium. Dari portofolio hingga web pernikahan kustom, saya fokus pada perpaduan keunggulan visual dengan kejelasan fungsional.',
    tools: ['React / Next.js', 'Animasi GSAP', 'Arsitektur UX', 'HTML / CSS / JS'],
  },
  {
    num: '02—', titleKey: 'acc2t', fallTitle: 'Video Editing / Motion Graphic',
    descKey: 'acc2p',
    fallDesc: 'Dari film pendek sekolah hingga konten promosi profesional. Dengan pemahaman mendalam tentang narasi visual dan ritme editing, setiap karya dirancang menyampaikan pesan dengan kuat dan estetis.',
    tools: ['DaVinci Resolve', 'Adobe Premiere', 'After Effects', 'CapCut'],
  },
  {
    num: '03—', titleKey: 'acc3t', fallTitle: 'Ilustrator',
    descKey: 'acc3p',
    fallDesc: 'Solusi visual yang kuat untuk kebutuhan edukatif dan kreatif Anda — dari poster impactful, thumbnail YouTube yang memikat, hingga berbagai kebutuhan grafis lainnya.',
    tools: ['Adobe Illustrator', 'Canva', 'Adobe Photoshop'],
  },
  {
    num: '04—', titleKey: 'acc4t', fallTitle: 'Videografer / Fotografer',
    descKey: 'acc4p',
    fallDesc: 'Menggarap proyek visual dengan standar profesional — dari perencanaan konsep, teknik pengambilan gambar yang cermat, hingga hasil akhir yang memukau secara sinematik.',
    tools: ['Portrait Photography', 'Sinematografi', 'Color Grading'],
  },
];

const SERVICES = [
  {
    num: '01', wide: false,
    titleKey: 'svc1t', fallTitle: 'Situs Web Portofolio',
    descKey: 'svc1d', fallDesc: 'Menciptakan identitas digital premium untuk para kreatif, profesional, dan eksekutif yang membutuhkan kehadiran online canggih yang mencerminkan merek unik mereka.',
  },
  {
    num: '02', wide: false,
    titleKey: 'svc2t', fallTitle: 'Situs Web Pernikahan',
    descKey: 'svc2d', fallDesc: 'Merancang undangan digital yang elegan dan personal — mengabadikan momen paling berharga dalam hidup Anda dengan keindahan visual yang tak terlupakan.',
  },
  {
    num: '03', wide: false,
    titleKey: 'svc3t', fallTitle: 'Video Editing & Motion',
    descKey: 'svc3d', fallDesc: 'Mengolah footage mentah menjadi narasi visual yang kuat — dari film pendek, vlog, hingga konten promosi dengan sentuhan motion graphic profesional.',
  },
  {
    num: '04', wide: true,
    titleKey: 'svc4t', fallTitle: 'Ilustrasi & Desain Poster',
    descKey: 'svc4d', fallDesc: 'Mewujudkan ide Anda menjadi karya visual yang berbicara — poster edukatif, thumbnail, dan grafis kreatif untuk platform digital maupun cetak.',
  },
  {
    num: '05', wide: false,
    titleKey: 'svc5t', fallTitle: 'Videografer & Fotografer',
    descKey: 'svc5d', fallDesc: 'Mengabadikan setiap momen penting dengan presisi artistik — dari foto portrait profesional hingga produksi video sinematik berkualitas tinggi.',
  },
];

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
export default function Home({ t = {} }) {
  const navigate = useNavigate();
  const [activeDot, setActiveDot] = useState('sec-home');
  const [openAcc, setOpenAcc]     = useState(0);
  const [imgError, setImgError]   = useState(false);

  // Array ref — kumpul semua elemen .reveal
  const revealEls = useRef([]);

  const tr = (key, fallback) => (t && t[key]) ? t[key] : fallback;
  const go = (path) => navigate(path);

  // Helper: push el ke revealEls tanpa duplikat, TANPA mutasi className
  const r = (el) => {
    if (el && !revealEls.current.includes(el)) {
      revealEls.current.push(el);
    }
  };

  /* ── Reveal Observer ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    // Delay sedikit agar semua ref terisi saat mount
    const id = setTimeout(() => {
      revealEls.current.forEach((el) => {
        if (el) observer.observe(el);
      });
    }, 50);

    return () => {
      clearTimeout(id);
      observer.disconnect();
    };
  }, []);

  /* ── Dots Observer ── */
  useEffect(() => {
    const obs = DOTS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveDot(id); },
        { threshold: 0.4 }
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach((o) => o && o.disconnect());
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  /* ─────────────────────────────────────
     RENDER
  ───────────────────────────────────── */
  return (
    <>
      <style>{CSS}</style>

      {/* Scroll Dots */}
      <nav className="scroll-dots">
        {DOTS.map(({ id, label }) => (
          <button
            key={id}
            className={`s-dot${activeDot === id ? ' active' : ''}`}
            title={label}
            onClick={() => scrollTo(id)}
          />
        ))}
      </nav>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section id="sec-home" className="s-home">
        <div className="home-bg" />
        <div className="home-overlay" />
        <div className="home-content">
          <p className="home-callme">{tr('callMe', 'panggil aku')}</p>
          <h1 className="home-name">Aldosynnn</h1>
          <div className="home-subtitle">
            <span className="home-sub1">{tr('sub1', 'I like building')}</span>
            <span className="home-sub2">
              {tr('sub2', 'digital')} <em>{tr('sub2b', 'interfaces.')}</em>
            </span>
          </div>
          <p className="home-quote">
            {tr('quote', '"Mengerjakan proyekmu seolah itu milikku."')}
          </p>
          <div className="home-cta">
            <button className="btn-cta" onClick={() => go('/contact')}>
              {tr('bookNow', 'Mulai Proyek')}{' '}
              <i className="fa-solid fa-arrow-up-right" />
            </button>
          </div>
        </div>
        <div className="home-location">
          <span>{tr('loc1', 'Indonesia')}</span>
          <span>{tr('loc2', 'Jawa Timur')}</span>
          <div className="loc-line" />
        </div>
      </section>

      {/* ══════════════════════════════
          WORK
      ══════════════════════════════ */}
      <section id="sec-work" className="s-section">
        <span ref={r} className="sec-label reveal">
          {tr('label01', '01 / Proyek')}
        </span>
        <h2 ref={r} className="sec-title reveal">
          {tr('ttl01', 'Proyek Terbaru')} <em>{tr('ttl01b', 'Saya')}</em>
        </h2>

        <div className="project-showcase">
          <div className="proj-img-wrap">
            <img src="/images/portfolio-aldo.webp" alt="Portfolio Aldo" onError={() => setImgError(true)} />
            {imgError && (
              <div className="proj-placeholder">
                <i className="fa-solid fa-image" />
                <span>Klik untuk melihat</span>
              </div>
            )}
            <div className="proj-img-overlay" />
          </div>
          <div ref={r} className="proj-info reveal">
            <div className="proj-num">01</div>
            <h3 className="proj-name">{tr('proj1', 'Portfolio Digital Aldosynnn')}</h3>
            <p className="proj-cats">{tr('proj1c', 'Website Personal, React, Animasi')}</p>
            <div className="proj-tags">
              <span className="tag">React</span>
              <span className="tag">Tailwind</span>
              <span className="tag">GSAP</span>
              <span className="tag">Responsive</span>
            </div>
            <button className="proj-link" onClick={() => go('/work')}>
              {tr('viewProject', 'Lihat Proyek')} <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          ABOUT
      ══════════════════════════════ */}
      <section id="sec-about" className="s-section s-about">
        <span ref={r} className="sec-label reveal">
          {tr('label02', '02 / Tentang')}
        </span>
        <div className="identity-grid">
          <div className="identity-left">
            <h2 ref={r} className="sec-title reveal">
              {tr('ttl02', 'Identitas Saya')}
            </h2>
            <p ref={r} className="id-intro reveal">
              {tr('id_intro', 'Merancang solusi digital yang tidak hanya cantik, tapi juga fungsional.')}
            </p>
            <div ref={r} className="id-divider reveal" />
            <p ref={r} className="id-desc reveal">
              {tr('id_desc', 'Saya adalah creative developer yang passionate tentang menciptakan pengalaman digital yang meaningful. Dari konsep hingga execution, setiap detail diperhatikan dengan cermat.')}
            </p>
          </div>

          <div className="accordion-wrap">
            {ACCORDION.map((item, idx) => (
              <div
                key={idx}
                ref={r}
                className={`acc-item reveal${openAcc === idx ? ' open' : ''}`}
                onClick={() => setOpenAcc(openAcc === idx ? -1 : idx)}
              >
                <div className="acc-hdr">
                  <span className="acc-num">{item.num}</span>
                  <h3 className="acc-title">{tr(item.titleKey, item.fallTitle)}</h3>
                  <div className="acc-ico">
                    <i className="fa-solid fa-plus" />
                  </div>
                </div>
                <div className="acc-body">
                  <p>{tr(item.descKey, item.fallDesc)}</p>
                  <div className="acc-tools">
                    {item.tools.map((tool, i) => (
                      <span key={i}>{tool}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CAPABILITIES
      ══════════════════════════════ */}
      <section id="sec-cap" className="s-section s-cap">
        <span ref={r} className="sec-label reveal">
          {tr('label03', '03 / Kemampuan')}
        </span>
        <h2 ref={r} className="sec-title reveal">
          {tr('ttl03', 'Layanan')} <em>{tr('ttl03b', 'Saya')}</em>
        </h2>

        <div className="svc-grid">
          {SERVICES.map((svc, idx) => (
            <div
              key={idx}
              ref={r}
              className={`svc-card reveal${svc.wide ? ' svc-wide' : ''}`}
            >
              <div className="svc-num">{svc.num}</div>
              <h3 className="svc-title">{tr(svc.titleKey, svc.fallTitle)}</h3>
              <p className="svc-desc">{tr(svc.descKey, svc.fallDesc)}</p>
            </div>
          ))}
        </div>

        <div className="svc-cta">
          <button className="btn-porto" onClick={() => go('/contact')}>
            {tr('cta', 'Mulai Kolaborasi')} <i className="fa-solid fa-arrow-up-right" />
          </button>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────
   CSS
───────────────────────────────────── */
const CSS = `
:root {
  --bg: #0a0a0e;
  --bg2: #12131a;
  --bg3: #1a1b24;
  --text: #ffffff;
  --text-dim: #a0a0a0;
  --border: #2a2b35;
  --border2: #3a3b45;
  --accent: #8b5cf6;
  --accent2: #a78bfa;
  --accent3: #c4b5fd;
  --glass: rgba(139, 92, 246, 0.05);
  --glass2: rgba(139, 92, 246, 0.08);
  --gborder: rgba(139, 92, 246, 0.2);
  --gborder2: rgba(139, 92, 246, 0.12);
  --blur: blur(10px);
}

/* General */
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Outfit', sans-serif; color: var(--text); background: var(--bg); }
h1, h2, h3, h4, h5, h6 { margin: 0; }
p { margin: 0; }
button { cursor: pointer; border: none; font-family: inherit; }

/* Scroll Dots */
.scroll-dots {
  position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);
  z-index: 1000; display: flex; flex-direction: column; gap: 24px;
}
.s-dot {
  width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--border2);
  background: transparent; transition: all 0.3s; cursor: pointer;
}
.s-dot:hover { border-color: var(--text-dim); }
.s-dot.active { background: var(--accent); border-color: var(--accent); }

/* Hero */
.s-home {
  min-height: 100vh; position: relative; display: flex;
  align-items: center; justify-content: center; overflow: hidden;
}
.home-bg {
  position: absolute; inset: 0; z-index: 0;
  background: url('/assets/img/bg1.jpg') center/cover no-repeat;
  background-attachment: fixed;
}
.home-overlay {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(
    135deg, 
    rgba(10,10,14,0.65) 0%, 
    rgba(18,19,26,0.68) 50%,
    rgba(10,10,14,0.65) 100%
  );
}
.home-content {
  position: relative; z-index: 2; text-align: center; padding: 120px 80px 80px;
  max-width: 1000px;
}
.home-callme {
  font-size: 0.73rem; font-weight: 600; letter-spacing: 0.28em;
  text-transform: uppercase; color: var(--text-dim);
  animation: fadeUp 1s ease 0.2s both;
  margin-bottom: 10px;
}
.home-name {
  font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 8vw, 6.5rem);
  font-weight: 600; line-height: 1; color: var(--text);
  animation: fadeUp 1s ease 0.4s both;
  margin-bottom: 20px;
}
.home-subtitle {
  position: relative; margin-bottom: 40px;
  animation: fadeUp 1s ease 0.6s both;
  display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px;
}
.home-sub1 {
  display: inline-block; font-size: clamp(1.2rem, 3.5vw, 1.8rem);
  font-weight: 600; color: #fff;
  background: var(--accent);
  padding: 8px 16px;
  border-radius: 8px;
}
.home-sub2 {
  display: inline-block; font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.2rem, 6vw, 4.5rem); font-weight: 600;
  line-height: 1; color: #fff;
  background: var(--accent);
  padding: 8px 16px;
  border-radius: 8px;
}
.home-sub2 em {
  font-style: italic; color: var(--accent2);
}
.pencil-svg {
  position: absolute; width: 100%; height: 24px;
  top: 50%; left: 0; transform: translateY(-50%);
  opacity: 0.6;
}
.pencil-path {
  fill: none; stroke: var(--accent2); stroke-width: 2;
  stroke-linecap: round; stroke-dasharray: 420; stroke-dashoffset: 420;
  animation: drawPencil 2s ease 0.8s forwards;
}
@keyframes drawPencil {
  to { stroke-dashoffset: 0; }
}
.home-quote {
  font-size: clamp(1rem, 2vw, 1.2rem); font-weight: 300;
  color: var(--text-dim); margin-bottom: 40px; line-height: 1.6;
  animation: fadeUp 1s ease 1s both;
}
.home-cta {
  display: flex; justify-content: center;
  animation: fadeUp 1s ease 1.1s both;
}
.btn-cta {
  display: inline-flex; align-items: center; gap: 10px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
  color: #fff; border-radius: 99px; padding: 16px 40px;
  font-weight: 700; font-size: 0.75rem; letter-spacing: 0.1em;
  text-transform: uppercase; transition: all 0.4s;
}
.btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(139, 92, 246, 0.3);
}
.home-location {
  position: absolute; right: 80px; bottom: 60px; z-index: 2; text-align: right;
  animation: fadeUp 1s ease 1.3s both;
}
.home-location span {
  display: block; font-size: 0.67rem; font-weight: 600;
  letter-spacing: 0.28em; text-transform: uppercase; color: var(--text-dim);
}
.home-location span:first-child { color: var(--text); font-size: 0.78rem; margin-bottom: 3px; }
.loc-line { width: 52px; height: 1px; background: var(--border2); margin-left: auto; margin-top: 9px; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(26px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Sections */
.s-section { min-height: 100vh; padding: 100px 80px; }
.s-about   { background: var(--bg2); }
.s-cap     { background: var(--bg); }
.sec-label {
  display: block; font-size: 0.62rem; font-weight: 600;
  letter-spacing: 0.32em; text-transform: uppercase;
  color: var(--text-dim); margin-bottom: 14px;
}
.sec-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 7vw, 6.5rem);
  font-weight: 300; line-height: 0.92; margin-bottom: 60px;
}
.sec-title em { font-style: italic; color: var(--text-dim); }

/* Reveal Animation */
.reveal { opacity: 0; transform: translateY(30px); }
.reveal.visible { animation: revealShow 0.8s ease-out forwards; }
@keyframes revealShow {
  to { opacity: 1; transform: translateY(0); }
}

/* Work */
.project-showcase {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 60px; align-items: center;
}
.proj-img-wrap {
  position: relative; border-radius: 18px; overflow: hidden;
  aspect-ratio: 4/3; background: var(--bg3); border: 1px solid var(--border);
}
.proj-img-wrap img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.65s ease;
  -webkit-user-drag: none;
}
.proj-img-wrap:hover img { transform: scale(1.05); }
.proj-img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(7,7,9,0.6) 0%, transparent 55%);
  opacity: 0; transition: opacity 0.4s;
}
.proj-img-wrap:hover .proj-img-overlay { opacity: 1; }
.proj-placeholder {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
  background: linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%);
  color: var(--text-dim); font-size: 0.68rem;
  letter-spacing: 0.18em; text-transform: uppercase;
}
.proj-placeholder i { font-size: 2.4rem; opacity: 0.22; }
.proj-info { padding-left: 10px; }
.proj-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 4rem; font-weight: 300; color: var(--border2); line-height: 1; margin-bottom: 10px;
}
.proj-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.1rem; font-weight: 600; line-height: 1.15; margin-bottom: 14px;
}
.proj-cats { font-size: 0.78rem; color: var(--text-dim); margin-bottom: 22px; line-height: 1.7; }
.proj-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 26px; }
.tag {
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 99px; padding: 5px 13px;
  font-size: 0.62rem; font-weight: 600; color: var(--text-dim);
  backdrop-filter: blur(10px); transition: all 0.3s;
}
.tag:hover { border-color: var(--accent3); color: var(--accent3); }
.proj-link {
  display: inline-flex; align-items: center; gap: 8px;
  background: none; border: none; border-bottom: 1px solid var(--border2);
  color: var(--text); padding-bottom: 4px;
  font-family: 'Outfit', sans-serif; font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  transition: gap 0.3s, border-color 0.3s; cursor: pointer;
}
.proj-link:hover { gap: 14px; border-color: var(--accent2); }

/* About */
.identity-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 80px; align-items: start; margin-top: 40px;
}
.identity-left { position: sticky; top: 110px; }
.id-intro {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-style: italic; font-weight: 300;
  color: var(--text-dim); line-height: 1.25; margin-bottom: 22px;
}
.id-divider { width: 100%; height: 1px; background: var(--border); margin-bottom: 20px; }
.id-desc { font-size: 0.84rem; line-height: 1.88; color: var(--text-dim); }
.accordion-wrap { display: flex; flex-direction: column; }
.acc-item { border-top: 1px solid var(--border); }
.acc-item:last-child { border-bottom: 1px solid var(--border); }
.acc-hdr {
  display: flex; align-items: center;
  padding: 22px 0; cursor: pointer; gap: 0;
}
.acc-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.82rem; font-weight: 600; color: var(--text-dim);
  flex-shrink: 0; transition: color 0.3s;
}
.acc-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.38rem; font-weight: 600;
  flex: 1; padding-left: 18px; transition: color 0.3s;
}
.acc-hdr:hover .acc-num,
.acc-hdr:hover .acc-title { color: var(--accent2); }
.acc-ico {
  width: 26px; height: 26px; border-radius: 50%;
  border: 1px solid var(--border2); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.62rem; color: var(--text-dim); transition: all 0.35s;
}
.acc-item.open .acc-ico {
  background: var(--accent); color: #fff;
  border-color: var(--accent); transform: rotate(45deg);
}
.acc-body {
  max-height: 0; overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.4,0,0.2,1);
}
.acc-item.open .acc-body { max-height: 360px; }
.acc-body p { font-size: 0.83rem; line-height: 1.88; color: var(--text-dim); padding-bottom: 16px; }
.acc-tools { display: flex; flex-wrap: wrap; gap: 7px; padding-bottom: 26px; }
.acc-tools span {
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 7px; padding: 4px 12px;
  font-size: 0.62rem; font-weight: 600; color: var(--text-dim); backdrop-filter: blur(10px);
}

/* Capabilities */
.svc-grid {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 18px; margin-top: 48px;
}
.svc-card {
  background: var(--glass);
  backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
  border: 1px solid var(--gborder);
  border-radius: 20px; padding: 30px 26px;
  position: relative; overflow: hidden; transition: all 0.4s ease;
}
.svc-card::before {
  content: ''; position: absolute; inset: 0; border-radius: 20px;
  background: linear-gradient(135deg, rgba(139,92,246,0.06) 0%, transparent 58%);
  opacity: 0; transition: opacity 0.4s;
}
.svc-card:hover { transform: translateY(-7px); border-color: rgba(139,92,246,0.32); }
.svc-card:hover::before { opacity: 1; }
.svc-wide { grid-column: span 2; }
.svc-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.4rem; font-weight: 300; color: var(--border2); margin-bottom: 14px; line-height: 1;
}
.svc-title { font-family: 'Cormorant Garamond', serif; font-size: 1.32rem; font-weight: 600; margin-bottom: 12px; }
.svc-desc  { font-size: 0.8rem; line-height: 1.78; color: var(--text-dim); }
.svc-cta   { margin-top: 50px; display: flex; justify-content: center; }
.btn-porto {
  display: inline-flex; align-items: center; gap: 12px;
  background: var(--glass2); backdrop-filter: var(--blur);
  border: 1px solid var(--gborder2); color: var(--text); border-radius: 99px;
  padding: 17px 38px;
  font-family: 'Outfit', sans-serif; font-size: 0.72rem; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  transition: all 0.4s; cursor: pointer;
}
.btn-porto:hover { background: var(--accent); color: #fff; border-color: var(--accent); transform: scale(1.04); }

/* ═════════════════════════════════════════
   RESPONSIVE
═════════════════════════════════════════ */

@media (max-width: 1024px) {
  .s-section { padding: 80px 40px; }
  .svc-grid  { grid-template-columns: 1fr 1fr; }
  .svc-wide  { grid-column: span 1; }
  .scroll-dots { gap: 16px; }
  .home-location { right: 40px; bottom: 40px; }
}

@media (max-width: 768px) {
  .home-subtitle {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 7px;
  }
  .home-sub1 {
    font-size: clamp(1rem, 3vw, 1.4rem);
    padding: 6px 12px;
    text-align: center;
  }
  .home-sub2 {
    font-size: clamp(1.6rem, 5vw, 3rem);
    padding: 6px 12px;
    text-align: center;
  }
  .home-bg {
    background-attachment: scroll;
  }
  /* Hero fixes */
  .home-content {
    padding: 100px 24px 60px;
  }
  .home-name {
    margin-bottom: 16px;
  }
  .home-cta {
    padding: 0 12px;
  }
  .btn-cta {
    width: 100%;
    justify-content: center;
    padding: 14px 24px;
    font-size: 0.7rem;
    white-space: nowrap;
  }
  .home-location {
    right: 24px;
    bottom: 32px;
    font-size: 0.6rem;
  }
  .home-location span {
    font-size: 0.6rem;
  }
  .home-location span:first-child {
    font-size: 0.7rem;
  }
  .loc-line {
    width: 40px;
  }
  .scroll-dots {
    display: none;
  }
  
  /* Sections */
  .s-section {
    padding: 60px 24px;
  }
  .sec-title {
    font-size: clamp(1.8rem, 5vw, 3rem);
    margin-bottom: 40px;
  }
  
  /* Work */
  .project-showcase {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .proj-info {
    padding-left: 0;
  }
  .proj-num {
    font-size: 2.5rem;
  }
  
  /* About */
  .identity-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .identity-left {
    position: static;
  }
  .id-intro {
    font-size: clamp(1.2rem, 4vw, 1.8rem);
  }
  
  /* Capabilities */
  .svc-grid {
    grid-template-columns: 1fr;
    gap: 14px;
    margin-top: 28px;
  }
  .svc-card {
    padding: 22px 18px;
  }
  .svc-wide {
    grid-column: span 1;
  }
  .btn-porto {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
    font-size: 0.65rem;
  }
}

@media (max-width: 480px) {
  .home-content {
    padding: 70px 16px 40px;
  }
  .home-subtitle {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-bottom: 18px;
  }
  .home-sub1 {
    font-size: 0.9rem;
    padding: 5px 10px;
    text-align: center;
  }
  .home-sub2 {
    font-size: 1.6rem;
    padding: 5px 10px;
    text-align: center;
  }
  .home-name {
    font-size: 2rem;
    margin-bottom: 12px;
  }
  .home-quote {
    font-size: 0.9rem;
    margin-bottom: 24px;
  }
  .btn-cta {
    padding: 12px 20px;
    font-size: 0.65rem;
  }
  .s-section {
    padding: 50px 16px;
  }
  .sec-label {
    font-size: 0.55rem;
  }
  .sec-title {
    font-size: clamp(1.4rem, 6vw, 2rem);
  }
  .proj-name {
    font-size: 1.4rem;
  }
  .acc-title {
    font-size: 1rem;
    padding-left: 12px;
  }
  .svc-title {
    font-size: 1rem;
  }
  .svc-desc {
    font-size: 0.75rem;
  }
}
`;
