// src/pages/WorkDetail11.jsx
// Route: /works/sma-awards-sinematografi-2024

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const DATA = {
  title:      'Jawa Pos SMA Awards 2024',
  titleSub:   'Sinematografi',
  year:       '2024',
  production: 'SMAN 1 Kraksaan — Sinematura',
  pembina:    'Mohammad Adibillah, S.Psi., Gr.',
  editor:     'Aldo Leo Saputra',
  youtubeId:  'dMVt_0GQabw',
  badges:     ['Short Film', 'Video', 'Awards'],
  
  awards: [
    { icon: '🎬', event: 'Jawa Pos SMA Awards 2024', title: 'Sinematografi — SMAN 1 Kraksaan' },
  ],

  descEn: 'An exploration of how personal objects reveal personality — the things kids carry say more about who they are than any introduction. A quiet visual essay about individuality disguised as a school assignment.',
  descId: 'Eksplorasi tentang perbedaan yang sering nggak disadari — soal kepribadian anak-anak yang tergambar dari barang-barang yang mereka bawa. Esai visual yang diam-diam bilang banyak hal.',

  synopsis: null,

  crew: [
    { role: 'Pembina',    name: 'Mohammad Adibillah, S.Psi., Gr.' },
    { role: 'Produser',   name: 'Wadilah Callysta W. D.' },
    { role: 'Sutradara',  name: 'Hermawan Ibra W.' },
    { role: 'Editor',     name: 'Aldo Leo Saputra' },
  ],

  cast: null,

  sinematura: {
    handle: '@sine_matura',
    href:   'https://www.instagram.com/sine_matura?igsh=MWQ1MXptNHp6cm0xNw==',
  },
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
// CSS STRING
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
.wd-badge-film { background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3); color: #818cf8; }
.wd-badge-video { background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25); color: #a78bfa; }
.wd-badge-award { background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3); color: #fbbf24; }
.wd-badge-teaser { background: rgba(34,211,170,0.1); border: 1px solid rgba(34,211,170,0.3); color: #2dd4bf; }
.wd-badge-event  { background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.3); color: #fb923c; }
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
.wd-meta-item { display: flex; flex-direction: column; gap: 4px; }
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
  color: #ff5555; text-decoration: none;
  transition: all 0.25s;
}
.wd-yt-link:hover { background: rgba(255,0,0,0.18); color: #ff7777; }

/* ── Awards strip ── */
.wd-awards { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 48px; }
.wd-award-card {
  display: flex; align-items: center; gap: 14px;
  background: rgba(251,191,36,0.07); border: 1px solid rgba(251,191,36,0.22);
  border-radius: 16px; padding: 16px 22px;
  flex: 1; min-width: 220px;
}
.wd-award-icon { font-size: 1.8rem; flex-shrink: 0; }
.wd-award-info { display: flex; flex-direction: column; gap: 3px; }
.wd-award-event { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #fbbf24; }
.wd-award-title { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 600; }

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

/* ── Description + synopsis ── */
.wd-desc { font-size: 0.92rem; line-height: 1.9; color: var(--text-dim); margin-bottom: 28px; max-width: 680px; }
.wd-synopsis-box {
  background: rgba(139,92,246,0.05);
  border: 1px solid rgba(139,92,246,0.18); border-left: 3px solid var(--accent2);
  border-radius: 14px; padding: 24px 28px;
  margin-top: 28px;
}
.wd-synopsis-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent2); margin-bottom: 10px; }
.wd-synopsis-text  { font-size: 0.88rem; line-height: 1.85; color: var(--text-dim); }

/* ── Crew table ── */
.wd-crew-table { width: 100%; border-collapse: collapse; }
.wd-crew-table th {
  text-align: left; font-size: 0.58rem; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim);
  padding: 0 16px 14px; border-bottom: 1px solid var(--border);
}
.wd-crew-table td {
  padding: 13px 16px; font-size: 0.84rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  vertical-align: top;
}
.wd-crew-table tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
.wd-crew-table tr:last-child td { border-bottom: none; }
.wd-crew-role { color: var(--text-dim); font-size: 0.8rem; white-space: nowrap; }
.wd-crew-name { color: var(--text); font-weight: 500; }

/* ── Cast ── */
.wd-cast-list { display: flex; flex-wrap: wrap; gap: 10px; }
.wd-cast-pill {
  background: var(--glass); border: 1px solid var(--border2);
  border-radius: 99px; padding: 7px 16px;
  font-size: 0.72rem; color: var(--text-dim);
}

/* ── Sinematura badge ── */
.wd-smt-badge {
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(225,48,108,0.08); border: 1px solid rgba(225,48,108,0.22);
  border-radius: 14px; padding: 12px 18px;
  text-decoration: none; transition: all 0.25s;
  color: #e1306c;
}
.wd-smt-badge:hover { background: rgba(225,48,108,0.15); border-color: rgba(225,48,108,0.4); }
.wd-smt-badge i { font-size: 1.1rem; }
.wd-smt-badge span { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; }

/* ── Back / Nav ── */
.wd-back-btn {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--glass2); border: 1px solid var(--border);
  border-radius: 99px; padding: 12px 24px;
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-dim); cursor: pointer; font-family: 'Outfit', sans-serif;
  transition: all 0.25s;
}
.wd-back-btn:hover { border-color: var(--text); color: var(--text); }

/* ── Solo highlight ── */
.wd-solo-card {
  background: rgba(34,211,170,0.06);
  border: 1px solid rgba(34,211,170,0.22);
  border-radius: 16px; padding: 22px 26px; margin-bottom: 36px;
  display: flex; align-items: flex-start; gap: 14px;
}
.wd-solo-card i { color: #2dd4bf; font-size: 1.2rem; margin-top: 2px; flex-shrink: 0; }
.wd-solo-card p { font-size: 0.82rem; line-height: 1.75; color: var(--text-dim); margin: 0; }
.wd-solo-card strong { color: #2dd4bf; }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .wd-hero    { padding: 130px 40px 60px; }
  .wd-section { padding: 65px 40px; }
}
@media (max-width: 768px) {
  .wd-hero    { padding: 110px 24px 56px; }
  .wd-section { padding: 52px 24px; }
  .wd-hero-title { font-size: clamp(3rem, 12vw, 5.5rem); }
  .wd-awards { flex-direction: column; }
  .wd-award-card { min-width: 0; }
  .wd-crew-table { display: block; overflow-x: auto; }
}
@media (max-width: 480px) {
  .wd-hero    { padding: 100px 20px 48px; }
  .wd-section { padding: 44px 20px; }
  .wd-hero-meta { gap: 16px; }
  .wd-sec-title { font-size: clamp(2rem, 8vw, 3rem); }
}
`;

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function WorkDetail11() {
  const navigate = useNavigate();
  const pageRef  = useReveal();
  const [lang, setLang] = useState('id');

  // Inject CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    window.scrollTo(0, 0);
    return () => { try { document.head.removeChild(style); } catch (_) {} };
  }, []);

  const d = DATA;
  const isEn = lang === 'en';

  return (
    <div className="wd-page" ref={pageRef}>

      {/* ══ HERO ══ */}
      <section className="wd-hero">
        <div className="wd-hero-bg" />
        <div className="wd-hero-orb" />

        <div className="wd-breadcrumb wd-reveal">
          Work <span>/ Short Film</span>
        </div>

        <div className="wd-badges wd-reveal wd-d1">
          {d.badges.map((b, i) => (
            <span key={i} className={`wd-badge wd-badge-${b === 'Short Film' ? 'film' : b === 'Video' ? 'video' : b === 'Awards' ? 'award' : b === 'Teaser' ? 'teaser' : 'event'}`}>
              {b === 'Short Film' && <i className="fa-solid fa-film" />}
              {b === 'Video' && <i className="fa-solid fa-video" />}
              {b === 'Awards' && <i className="fa-solid fa-trophy" />}
              {b === 'Teaser' && <i className="fa-solid fa-clapperboard" />}
              {b === 'Event' && <i className="fa-solid fa-calendar-star" />}
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
          {d.pembina && (
            <div className="wd-meta-item">
              <span className="wd-meta-label">Pembina</span>
              <span className="wd-meta-val">{d.pembina}</span>
            </div>
          )}
          <div className="wd-meta-item">
            <span className="wd-meta-label">Editor</span>
            <span className="wd-meta-val">{d.editor}</span>
          </div>
        </div>
      </section>

      {/* ══ YOUTUBE ══ */}
      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">01 / Film</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">
          Watch the <em>Film.</em>
        </h2>

        {/* Awards — tampilkan sebelum video jika ada */}
        {d.awards && d.awards.length > 0 && (
          <div className="wd-awards wd-reveal wd-d1">
            {d.awards.map((a, i) => (
              <div key={i} className="wd-award-card">
                <span className="wd-award-icon">{a.icon}</span>
                <div className="wd-award-info">
                  <span className="wd-award-event">{a.event}</span>
                  <span className="wd-award-title">{a.title}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="wd-yt-wrap wd-reveal wd-d2">
          <iframe
            src={`https://www.youtube.com/embed/${d.youtubeId}`}
            title={`${d.title} — ${d.titleSub}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="wd-yt-footer">
            <div className="wd-yt-title-row">
              <span className="wd-yt-film-name">{d.title}</span>
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

      {/* ══ DESKRIPSI ══ */}
      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">02 / About</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">
          About This <em>Film.</em>
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

        {d.synopsis && (
          <div className="wd-synopsis-box wd-reveal wd-d3">
            <div className="wd-synopsis-label">Sinopsis</div>
            <p className="wd-synopsis-text">{d.synopsis}</p>
          </div>
        )}

        {/* Sinematura badge */}
        <div style={{ marginTop: 36 }} className="wd-reveal wd-d3">
          <a
            href={d.sinematura.href}
            target="_blank"
            rel="noopener noreferrer"
            className="wd-smt-badge"
          >
            <i className="fa-brands fa-instagram" />
            <span>{d.sinematura.handle}</span>
          </a>
        </div>
      </section>

      {/* ══ TIM PRODUKSI ══ */}
      {d.crew && d.crew.length > 0 && (
        <section className="wd-section">
          <span className="wd-sec-label wd-reveal">03 / Production</span>
          <h2 className="wd-sec-title wd-reveal wd-d1">
            Tim <em>Produksi.</em>
          </h2>

          <div className="wd-reveal wd-d2" style={{ overflowX: 'auto' }}>
            <table className="wd-crew-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Nama</th>
                </tr>
              </thead>
              <tbody>
                {d.crew.map((c, i) => (
                  <tr key={i}>
                    <td className="wd-crew-role">{c.role}</td>
                    <td className="wd-crew-name">{c.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ══ CAST (jika ada) ══ */}
      {d.cast && d.cast.length > 0 && (
        <section className="wd-section">
          <span className="wd-sec-label wd-reveal">04 / Cast</span>
          <h2 className="wd-sec-title wd-reveal wd-d1">
            Pemeran <em>Film.</em>
          </h2>
          <div className="wd-cast-list wd-reveal wd-d2">
            {d.cast.map((c, i) => (
              <span key={i} className="wd-cast-pill">{c}</span>
            ))}
          </div>
        </section>
      )}

      {/* ══ BACK TO WORKS ══ */}
      <div
        className="wd-reveal"
        style={{
          padding: '48px 80px 80px',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}
      >
        <button className="wd-back-btn" onClick={() => navigate('/works')}>
          <i className="fa-solid fa-arrow-left" />
          Back to Works
        </button>

        <a
          href={d.sinematura.href}
          target="_blank"
          rel="noopener noreferrer"
          className="wd-smt-badge"
        >
          <i className="fa-brands fa-instagram" />
          <span>{d.sinematura.handle}</span>
        </a>
      </div>

    </div>
  );
}
