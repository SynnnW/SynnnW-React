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
            <span className="home-sub1">{tr('sub1', 'Merancang')}</span>
            <span className="home-sub2">
              {tr('sub2', 'antarmuka')} <em>{tr('sub2b', 'digital.')}</em>
            </span>
            <svg
              className="pencil-svg"
              viewBox="0 0 420 18"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className="pencil-path"
                d="M4 13 C60 4, 140 17, 220 9 C300 2, 360 15, 416 11"
              />
            </svg>
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
        <h2 ref={r} className="sec-title reveal rv-d1">
          <span>{tr('workTitle', 'Karya ')}</span>
          <em>{tr('workEm', 'Pilihan.')}</em>
        </h2>

        <div ref={r} className="project-showcase reveal rv-d2">
          <div className="proj-img-wrap">
            {imgError ? (
              <div className="proj-placeholder">
                <i className="fa-regular fa-image" />
                <span>project-thumb.jpg</span>
              </div>
            ) : (
              <>
                <img
                  src="/assets/img/belajar.jpg"
                  alt="SynnnW Digital Studio Preview"
                  onError={() => setImgError(true)}
                />
                <div className="proj-img-overlay" />
              </>
            )}
          </div>

          <div className="proj-info">
            <div className="proj-num">01</div>
            <h3 className="proj-name">SynnnW<br /><em>Digital Studio</em></h3>
            <p className="proj-cats">
              {tr('projCats', 'Editing / Ilustrasi / Web Development\nVideografer / Fotografer')}
            </p>
            <div className="proj-tags">
              {['React 18','TypeScript','DaVinci Resolve','After Effects','Adobe Illustrator','CapCut'].map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <button className="proj-link" onClick={() => go('/porto')}>
              <span>{tr('viewAll', 'Lihat Semua Karya')}</span>{' '}
              <i className="fa-solid fa-arrow-up-right" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          ABOUT
      ══════════════════════════════ */}
      <section id="sec-about" className="s-section s-about">
        <span ref={r} className="sec-label reveal">
          {tr('label02', '02 / Identitas')}
        </span>
        <h2 ref={r} className="sec-title reveal rv-d1">
          <span>{tr('aboutTitle', 'Siapakah ')}</span>
          <em>{tr('aboutEm', 'Saya?')}</em>
        </h2>

        <div className="identity-grid">
          <div ref={r} className="identity-left reveal rv-d2">
            <p className="id-intro">
              {tr('idIntro', 'Kreator digital\ndari Jawa Timur.')}
            </p>
            <div className="id-divider" />
            <p className="id-desc">
              {tr('idDesc', 'Kreator digital multidisiplin — berfokus pada pengembangan web premium, produksi video, ilustrasi, dan fotografi. Setiap proyek dikerjakan dengan dedikasi penuh.')}
            </p>
          </div>

          <div ref={r} className="accordion-wrap reveal rv-d3">
            {ACCORDION.map((item, idx) => (
              <div
                key={idx}
                className={`acc-item${openAcc === idx ? ' open' : ''}`}
              >
                <div
                  className="acc-hdr"
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenAcc(openAcc === idx ? -1 : idx)}
                  onKeyDown={(e) => e.key === 'Enter' && setOpenAcc(openAcc === idx ? -1 : idx)}
                >
                  <span className="acc-num">{item.num}</span>
                  <span className="acc-title">{tr(item.titleKey, item.fallTitle)}</span>
                  <span className="acc-ico">
                    <i className="fa-solid fa-plus" />
                  </span>
                </div>
                <div className="acc-body">
                  <p>{tr(item.descKey, item.fallDesc)}</p>
                  <div className="acc-tools">
                    {item.tools.map((tool) => (
                      <span key={tool}>{tool}</span>
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
        <h2 ref={r} className="sec-title reveal rv-d1">
          <span>{tr('capTitle', 'Apa yang bisa ')}</span>
          <em>{tr('capEm', 'saya lakukan?')}</em>
        </h2>

        <div className="svc-grid">
          {SERVICES.map((svc, idx) => {
            const delay = idx % 3 === 1 ? ' rv-d1' : idx % 3 === 2 ? ' rv-d2' : '';
            return (
              <div
                key={svc.num}
                ref={r}
                className={`svc-card reveal${delay}${svc.wide ? ' svc-wide' : ''}`}
              >
                <div className="svc-num">{svc.num}</div>
                <h3 className="svc-title">{tr(svc.titleKey, svc.fallTitle)}</h3>
                <p className="svc-desc">{tr(svc.descKey, svc.fallDesc)}</p>
              </div>
            );
          })}
        </div>

        <div ref={r} className="svc-cta reveal rv-d2">
          <button className="btn-porto" onClick={() => go('/porto')}>
            <span>{tr('viewPorto', 'Lihat Contoh Karya Saya')}</span>{' '}
            <i className="fa-solid fa-arrow-up-right" />
          </button>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────
   CSS — disimpan di bawah agar JSX bersih
───────────────────────────────────────── */
const CSS = `
/* Reveal */
.reveal {
  opacity: 0;
  transform: translateY(38px);
  transition: opacity 0.82s ease, transform 0.82s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }
.rv-d1 { transition-delay: 0.12s; }
.rv-d2 { transition-delay: 0.24s; }
.rv-d3 { transition-delay: 0.36s; }

/* Scroll dots */
.scroll-dots {
  position: fixed; right: 22px; top: 50%;
  transform: translateY(-50%);
  z-index: 200;
  display: flex; flex-direction: column; gap: 10px;
}
.s-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--text-dim);
  border: none; padding: 0; cursor: pointer;
  transition: all 0.35s ease;
}
.s-dot.active { background: var(--accent2); transform: scale(1.8); }
.s-dot:hover  { background: var(--accent3); }

/* Hero */
.s-home {
  position: relative; min-height: 100vh;
  display: flex; align-items: center; overflow: hidden;
}
.home-bg {
  position: absolute; inset: 0;
  background-image: url('/assets/img/bg1.jpg');
  background-size: cover; background-position: center;
  opacity: 0.30; transition: opacity 0.5s;
}
[data-theme="light"] .home-bg { opacity: 0.18; }
.home-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(7,7,9,0.78) 0%, rgba(7,7,9,0.20) 50%, rgba(7,7,9,0.88) 100%);
}
[data-theme="light"] .home-overlay {
  background: linear-gradient(135deg, rgba(244,242,238,0.82) 0%, rgba(244,242,238,0.15) 50%, rgba(244,242,238,0.90) 100%);
}
.home-content {
  position: relative; z-index: 2;
  padding: 140px 80px 80px; max-width: 860px;
}
.home-callme {
  font-family: 'Dancing Script', cursive;
  font-size: 2.2rem; font-weight: 400;
  color: var(--text); opacity: 0.72; margin-bottom: -6px;
  animation: fadeUp 1s ease 0.3s both;
}
.home-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(4.5rem, 11vw, 9.5rem);
  font-weight: 700; line-height: 0.87; letter-spacing: -2px; color: var(--text);
  animation: fadeUp 1s ease 0.5s both;
}
.home-subtitle { margin-top: 22px; animation: fadeUp 1s ease 0.7s both; }
.home-sub1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 4vw, 3.4rem);
  font-weight: 600; color: var(--text); display: block;
}
.home-sub2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 4vw, 3.4rem);
  font-weight: 400; color: var(--text); display: block;
}
.home-sub2 em { font-style: italic; }
.pencil-svg {
  display: block; width: 100%; max-width: 420px;
  height: 18px; margin-top: -2px; overflow: visible;
}
.pencil-path {
  stroke: var(--accent2); stroke-width: 2.8; fill: none;
  stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 480; stroke-dashoffset: 480;
  animation: draw 1.4s ease 1.6s forwards;
}
@keyframes draw { to { stroke-dashoffset: 0; } }
.home-quote {
  margin-top: 22px; font-size: 0.94rem;
  color: var(--text-dim); font-style: italic; letter-spacing: 0.3px;
  animation: fadeUp 1s ease 0.9s both;
}
.home-cta { margin-top: 30px; animation: fadeUp 1s ease 1.1s both; }
.btn-cta {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--accent); color: #fff; border: none; border-radius: 99px;
  padding: 15px 34px;
  font-family: 'Outfit', sans-serif; font-size: 0.74rem; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  box-shadow: 0 8px 32px rgba(139,92,246,0.35);
  transition: all 0.35s ease; cursor: pointer;
}
.btn-cta:hover {
  background: var(--accent2); transform: scale(1.06);
  box-shadow: 0 14px 44px rgba(139,92,246,0.45);
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

/* Responsive */
@media (max-width: 1024px) {
  .s-section { padding: 80px 40px; }
  .svc-grid  { grid-template-columns: 1fr 1fr; }
  .svc-wide  { grid-column: span 1; }
}
@media (max-width: 768px) {
  .home-content     { padding: 120px 24px 80px; }
  .home-location    { right: 24px; bottom: 40px; }
  .scroll-dots      { display: none; }
  .s-section        { padding: 80px 24px; }
  .project-showcase { grid-template-columns: 1fr; gap: 32px; }
  .proj-info        { padding-left: 0; }
  .identity-grid    { grid-template-columns: 1fr; gap: 36px; }
  .identity-left    { position: static; }
  .svc-grid         { grid-template-columns: 1fr; }
  .svc-wide         { grid-column: span 1; }
}
`;