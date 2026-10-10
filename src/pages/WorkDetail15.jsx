// src/pages/WorkDetail15.jsx
// Route: /works/video-profil-uswatun-2025

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const DATA = {
  title:      'Video Profil',
  titleSub:   'Uswatun Hasanah',
  year:       '2025',
  production: 'EJIES 2025 — SMAN 1 Kraksaan',
  youtubeId:  '8tVQRuOXEWY',
  badges:     ['Video Profile', 'Documentary'],

  descEn: 'A profile documentary on Uswatun Hasanah, an English teacher at SMAN 1 Kraksaan. The film captures her teaching approach — how she creates engaging, human-centered English learning experiences for her students.',
  descId: 'Dokumenter profil Uswatun Hasanah, guru Bahasa Inggris SMAN 1 Kraksaan. Merekam cara beliau mengajar — pendekatan yang personal, hangat, dan bikin murid nggak takut sama bahasa Inggris.',

  crew: [
    { role: 'Editor & Cameraman',  name: 'Aldo Leo Saputra' },
    { role: 'Cameraman',           name: 'Hermawan Ibra Wicaksono' },
  ],

  cast: null,

  // NO Sinematura for this one (EJIES project)
};

// ─────────────────────────────────────────────────────────────
// REVEAL HOOK
// ─────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const els = container.querySelectorAll('.wd-reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('wd-visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    const timer = setTimeout(() => els.forEach((el) => obs.observe(el)), 80);
    return () => { clearTimeout(timer); obs.disconnect(); };
  }, []);
  return ref;
}

// ─────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────
const CSS = `
/* ── Reveal ── */
.wd-reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.65s ease, transform 0.65s ease; }
.wd-reveal.wd-visible { opacity: 1; transform: translateY(0); }
.wd-d1 { transition-delay: 0.1s; }
.wd-d2 { transition-delay: 0.2s; }
.wd-d3 { transition-delay: 0.3s; }

/* ── Page ── */
.wd-page { background: var(--bg); min-height: 100vh; color: var(--text); font-family: 'Outfit', sans-serif; }

/* ── Hero ── */
.wd-hero {
  min-height: 72vh;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 140px 80px 72px;
  position: relative; overflow: hidden;
  border-bottom: 1px solid var(--border);
}
.wd-hero-bg {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 55% 55% at 85% 15%, rgba(99,102,241,0.14) 0%, transparent 60%),
    radial-gradient(ellipse 35% 45% at 10% 85%, rgba(139,92,246,0.08) 0%, transparent 60%);
}
.wd-hero-bg::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 50%, var(--bg) 100%);
}
@keyframes wdOrbPulse { from{opacity:0.6;transform:scale(0.95)} to{opacity:1;transform:scale(1.1)} }
.wd-hero-orb {
  position: absolute; top: -80px; right: -80px;
  width: 420px; height: 420px; border-radius: 50%;
  background: radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%);
  filter: blur(50px); pointer-events: none;
  animation: wdOrbPulse 7s ease-in-out infinite alternate;
}
.wd-breadcrumb {
  font-size: 0.6rem; letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--text-dim); margin-bottom: 20px; position: relative; z-index: 1;
}
.wd-breadcrumb span { color: var(--accent2); }
.wd-badges {
  display: flex; flex-wrap: wrap; gap: 8px;
  margin-bottom: 22px; position: relative; z-index: 1;
}
.wd-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 14px; border-radius: 99px;
  font-size: 0.58rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
}
.wd-badge-profile { background: rgba(34,211,170,0.1);  border: 1px solid rgba(34,211,170,0.3);  color: #2dd4bf; }
.wd-badge-documentary { background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25); color: #a78bfa; }
.wd-hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(4rem, 10vw, 10rem);
  font-weight: 300; line-height: 0.88;
  margin-bottom: 20px; position: relative; z-index: 1;
  letter-spacing: -0.02em;
}
.wd-hero-title em { font-style: italic; color: var(--text-dim); }
.wd-hero-meta {
  display: flex; flex-wrap: wrap; gap: 28px;
  padding-top: 28px; border-top: 1px solid var(--border);
  position: relative; z-index: 1;
}
.wd-meta-item  { display: flex; flex-direction: column; gap: 4px; }
.wd-meta-label { font-size: 0.52rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--text-dim); }
.wd-meta-val   { font-size: 0.8rem; font-weight: 500; color: var(--text); }

/* ── Section base ── */
.wd-section { padding: 80px 80px; border-top: 1px solid var(--border); }
.wd-sec-label { display: block; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px; }
.wd-sec-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.4rem, 5vw, 4.8rem); font-weight: 300; line-height: 0.92; margin-bottom: 48px; }
.wd-sec-title em { font-style: italic; color: var(--text-dim); }

/* ── YouTube embed ── */
.wd-yt-wrap {
  border-radius: 22px; overflow: hidden;
  border: 1px solid var(--border);
  position: relative;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5);
}
.wd-yt-wrap iframe { display: block; width: 100%; aspect-ratio: 16/9; border: none; }
.wd-yt-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 22px;
  background: rgba(255,255,255,0.02);
  border-top: 1px solid var(--border);
  flex-wrap: wrap; gap: 12px;
}
.wd-yt-title-row { display: flex; flex-direction: column; gap: 2px; }
.wd-yt-film-name { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 500; }
.wd-yt-sub  { font-size: 0.65rem; color: var(--text-dim); letter-spacing: 0.1em; }
.wd-yt-link {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(255,0,0,0.1); border: 1px solid rgba(255,60,60,0.25);
  border-radius: 99px; padding: 7px 16px;
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: #ff5555; text-decoration: none; transition: all 0.25s;
}
.wd-yt-link:hover { background: rgba(255,0,0,0.18); color: #ff7777; }

/* ── Lang toggle ── */
.wd-lang-toggle {
  display: inline-flex; align-items: center; gap: 0;
  background: var(--glass); border: 1px solid var(--border);
  border-radius: 99px; overflow: hidden; margin-bottom: 24px;
}
.wd-lang-btn {
  padding: 7px 18px; font-size: 0.65rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  background: none; border: none; color: var(--text-dim); cursor: pointer;
  transition: all 0.2s; font-family: 'Outfit', sans-serif;
}
.wd-lang-btn.active { background: var(--accent); color: #fff; border-radius: 99px; }

/* ── Description ── */
.wd-desc { font-size: 0.92rem; line-height: 1.9; color: var(--text-dim); margin-bottom: 28px; max-width: 680px; }

/* ── Crew simple display ── */
.wd-crew-simple { margin-top: 24px; }
.wd-crew-item {
  display: flex; flex-direction: column; gap: 3px; margin-bottom: 16px;
  padding-bottom: 12px; border-bottom: 1px solid var(--border);
}
.wd-crew-item:last-child { border-bottom: none; padding-bottom: 0; }
.wd-crew-role { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-dim); }
.wd-crew-name { font-size: 0.88rem; color: var(--text); font-weight: 500; }

/* ── Back btn ── */
.wd-back-btn {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--glass2); border: 1px solid var(--border);
  border-radius: 99px; padding: 12px 24px;
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-dim); cursor: pointer; font-family: 'Outfit', sans-serif;
  transition: all 0.25s;
}
.wd-back-btn:hover { border-color: var(--text); color: var(--text); }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .wd-hero    { padding: 130px 40px 60px; }
  .wd-section { padding: 65px 40px; }
}
@media (max-width: 768px) {
  .wd-hero    { padding: 110px 24px 56px; }
  .wd-section { padding: 52px 24px; }
  .wd-hero-title { font-size: clamp(3rem, 12vw, 5.5rem); }
}
@media (max-width: 480px) {
  .wd-hero    { padding: 100px 20px 48px; }
  .wd-section { padding: 44px 20px; }
  .wd-hero-meta { gap: 16px; }
  .wd-sec-title { font-size: clamp(2rem, 8vw, 3rem); }
}
`;

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function WorkDetail15() {
  const navigate = useNavigate();
  const pageRef  = useReveal();
  const [lang, setLang] = useState('id');

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    window.scrollTo(0, 0);
    return () => { try { document.head.removeChild(style); } catch (_) {} };
  }, []);

  const d    = DATA;
  const isEn = lang === 'en';

  return (
    <div className="wd-page" ref={pageRef}>

      {/* ══ HERO ══ */}
      <section className="wd-hero">
        <div className="wd-hero-bg" />
        <div className="wd-hero-orb" />

        <div className="wd-breadcrumb wd-reveal">
          Work <span>/ Documentary</span>
        </div>

        <div className="wd-badges wd-reveal wd-d1">
          {d.badges.map((b, i) => (
            <span
              key={i}
              className={`wd-badge wd-badge-${b === 'Video Profile' ? 'profile' : 'documentary'}`}
            >
              {b === 'Video Profile' && <i className="fa-solid fa-user" />}
              {b === 'Documentary' && <i className="fa-solid fa-camera" />}
              {b}
            </span>
          ))}
        </div>

        <h1 className="wd-hero-title wd-reveal wd-d2">
          {d.title}<br />
          <em>{d.titleSub}</em>
        </h1>

        <div className="wd-hero-meta wd-reveal wd-d3">
          <div className="wd-meta-item">
            <span className="wd-meta-label">Year</span>
            <span className="wd-meta-val">{d.year}</span>
          </div>
          <div className="wd-meta-item">
            <span className="wd-meta-label">Production</span>
            <span className="wd-meta-val">{d.production}</span>
          </div>
        </div>
      </section>

      {/* ══ VIDEO ══ */}
      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">01 / Video</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">
          Watch the <em>Video.</em>
        </h2>

        <div className="wd-yt-wrap wd-reveal wd-d2">
          <iframe
            src={`https://www.youtube.com/embed/${d.youtubeId}`}
            title={`${d.title} — ${d.titleSub}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="wd-yt-footer">
            <div className="wd-yt-title-row">
              <span className="wd-yt-film-name">{d.title} — {d.titleSub}</span>
              <span className="wd-yt-sub">{d.production} · {d.year}</span>
            </div>
            <a
              href={`https://youtu.be/${d.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wd-yt-link"
            >
              <i className="fa-brands fa-youtube" />
              YouTube
            </a>
          </div>
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">02 / About</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">
          About This <em>Video.</em>
        </h2>

        <div className="wd-reveal wd-d1">
          <div className="wd-lang-toggle">
            <button className={`wd-lang-btn ${lang === 'id' ? 'active' : ''}`} onClick={() => setLang('id')}>ID</button>
            <button className={`wd-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>

        <p className="wd-desc wd-reveal wd-d2">
          {isEn ? d.descEn : d.descId}
        </p>
      </section>

      {/* ══ CREW ══ */}
      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">03 / Crew</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">
          Production <em>Team.</em>
        </h2>

        <div className="wd-crew-simple wd-reveal wd-d2">
          {d.crew.map((c, i) => (
            <div key={i} className="wd-crew-item">
              <span className="wd-crew-role">{c.role}</span>
              <span className="wd-crew-name">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ BACK TO WORKS ══ */}
      <div
        className="wd-reveal"
        style={{
          padding: '48px 80px 80px',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
          flexWrap: 'wrap', gap: 16,
        }}
      >
        <button className="wd-back-btn" onClick={() => navigate('/works')}>
          <i className="fa-solid fa-arrow-left" />
          Back to Works
        </button>
      </div>

    </div>
  );
}
