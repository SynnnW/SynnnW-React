// src/pages/WorkDetail13.jsx
// Route: /works/guru-kita-yang-jahat-2025

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const DATA = {
  title:      'Guru Kita Yang Jahat',
  titleSub:   'Short Film',
  year:       '2025',
  production: 'SMAN 1 Kraksaan — Sinematura',
  pembina:    'Mohammad Adibillah, S.Psi., Gr.',
  editor:     'Hermawan Ibra Wicaksono, Den Bagus Putra, Aldo Leo Saputra',
  youtubeId:  'lhXj51BA4RU',
  badges:     ['Short Film', 'Video'],
  awards:     [],

  descEn: `School is more than a place to absorb knowledge — it's where students meet teachers ` +
          `who shape who they become. This film questions what happens when technology starts ` +
          `replacing the moral presence only a real teacher can provide. A relevant, timely piece.`,

  descId: `Sekolah bukan cuma tempat nyerap ilmu — di sana siswa ketemu guru yang ngebentuk ` +
          `karakter mereka. Film ini nanya: apa yang terjadi kalau teknologi mulai ngegantiin ` +
          `peran moral yang cuma bisa datang dari guru beneran?`,

  synopsis: null,

  crew: [
    { role: 'Sutradara',           name: 'Qomariya Agustin'                              },
    { role: 'Produser',            name: 'Fikriyyah Putri Salsabila'                    },
    { role: 'Penulis Naskah',      name: 'Qomariya Agustin'                             },
    { role: 'Sinematografer',      name: 'Aldo Leo Saputra, Raja Hasan Maroko, M. Aditya Shafi' },
    { role: 'Editor',              name: 'Hermawan Ibra Wicaksono, Den Bagus Putra, Aldo Leo Saputra' },
  ],

  cast: [
    { actor: 'Januar Rendi Afdilla',      char: 'Rendi'       },
    { actor: 'Keysa Najwa Aliandya',      char: 'Keke'        },
    { actor: 'Najla\'ayu Nesia',          char: 'Bu Nesia'    },
    { actor: 'Moh Bayu Firdaus H.',       char: 'Ketua Kelas' },
  ],

  sinematura: {
    handle: '@sine_matura',
    href:   'https://www.instagram.com/sine_matura?igsh=MWQ1MXptNHp6cm0xNw==',
  },
};

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const els = container.querySelectorAll('.wd-reveal');
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('wd-visible'); obs.unobserve(e.target); }
    }), { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    const timer = setTimeout(() => els.forEach((el) => obs.observe(el)), 80);
    return () => { clearTimeout(timer); obs.disconnect(); };
  }, []);
  return ref;
}

const CSS = `
.wd-reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.65s ease, transform 0.65s ease; }
.wd-reveal.wd-visible { opacity: 1; transform: translateY(0); }
.wd-d1 { transition-delay: 0.1s; } .wd-d2 { transition-delay: 0.2s; } .wd-d3 { transition-delay: 0.3s; }
.wd-page { background: var(--bg); min-height: 100vh; color: var(--text); font-family: 'Outfit', sans-serif; }
.wd-hero { min-height: 72vh; display: flex; flex-direction: column; justify-content: flex-end; padding: 140px 80px 72px; position: relative; overflow: hidden; border-bottom: 1px solid var(--border); }
.wd-hero-bg { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 55% 55% at 85% 15%, rgba(99,102,241,0.14) 0%, transparent 60%), radial-gradient(ellipse 35% 45% at 10% 85%, rgba(139,92,246,0.08) 0%, transparent 60%); }
.wd-hero-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 50%, var(--bg) 100%); }
@keyframes wdOrbPulse { from{opacity:0.6;transform:scale(0.95)} to{opacity:1;transform:scale(1.1)} }
.wd-hero-orb { position: absolute; top: -80px; right: -80px; width: 420px; height: 420px; border-radius: 50%; background: radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%); filter: blur(50px); pointer-events: none; animation: wdOrbPulse 7s ease-in-out infinite alternate; }
.wd-breadcrumb { font-size: 0.6rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 20px; position: relative; z-index: 1; }
.wd-breadcrumb span { color: var(--accent2); }
.wd-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; position: relative; z-index: 1; }
.wd-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 99px; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
.wd-badge-film { background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3); color: #818cf8; }
.wd-badge-video { background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25); color: #a78bfa; }
.wd-hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(4rem, 10vw, 10rem); font-weight: 300; line-height: 0.88; margin-bottom: 20px; position: relative; z-index: 1; letter-spacing: -0.02em; }
.wd-hero-title em { font-style: italic; color: var(--text-dim); }
.wd-hero-meta { display: flex; flex-wrap: wrap; gap: 28px; padding-top: 28px; border-top: 1px solid var(--border); position: relative; z-index: 1; }
.wd-meta-item { display: flex; flex-direction: column; gap: 4px; }
.wd-meta-label { font-size: 0.52rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--text-dim); }
.wd-meta-val { font-size: 0.8rem; font-weight: 500; color: var(--text); }
.wd-section { padding: 80px 80px; border-top: 1px solid var(--border); }
.wd-sec-label { display: block; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px; }
.wd-sec-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.4rem, 5vw, 4.8rem); font-weight: 300; line-height: 0.92; margin-bottom: 48px; }
.wd-sec-title em { font-style: italic; color: var(--text-dim); }
.wd-yt-wrap { border-radius: 22px; overflow: hidden; border: 1px solid var(--border); position: relative; box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
.wd-yt-wrap iframe { display: block; width: 100%; aspect-ratio: 16/9; border: none; }
.wd-yt-footer { display: flex; align-items: center; justify-content: space-between; padding: 16px 22px; background: rgba(255,255,255,0.02); border-top: 1px solid var(--border); flex-wrap: wrap; gap: 12px; }
.wd-yt-title-row { display: flex; flex-direction: column; gap: 2px; }
.wd-yt-film-name { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 500; }
.wd-yt-sub { font-size: 0.65rem; color: var(--text-dim); letter-spacing: 0.1em; }
.wd-yt-link { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,0,0,0.1); border: 1px solid rgba(255,60,60,0.25); border-radius: 99px; padding: 7px 16px; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #ff5555; text-decoration: none; transition: all 0.25s; }
.wd-yt-link:hover { background: rgba(255,0,0,0.18); color: #ff7777; }
.wd-lang-toggle { display: inline-flex; align-items: center; gap: 0; background: var(--glass); border: 1px solid var(--border); border-radius: 99px; overflow: hidden; margin-bottom: 24px; }
.wd-lang-btn { padding: 7px 18px; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: none; border: none; color: var(--text-dim); cursor: pointer; transition: all 0.2s; font-family: 'Outfit', sans-serif; }
.wd-lang-btn.active { background: var(--accent); color: #fff; border-radius: 99px; }
.wd-desc { font-size: 0.92rem; line-height: 1.9; color: var(--text-dim); margin-bottom: 28px; max-width: 680px; }
.wd-crew-table { width: 100%; border-collapse: collapse; }
.wd-crew-table th { text-align: left; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim); padding: 0 16px 14px; border-bottom: 1px solid var(--border); }
.wd-crew-table td { padding: 13px 16px; font-size: 0.84rem; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: top; }
.wd-crew-table tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
.wd-crew-table tr:last-child td { border-bottom: none; }
.wd-crew-role { color: var(--text-dim); font-size: 0.8rem; white-space: nowrap; }
.wd-crew-name { color: var(--text); font-weight: 500; }
.wd-cast-list { display: flex; flex-wrap: wrap; gap: 10px; }
.wd-cast-pill { background: var(--glass); border: 1px solid var(--border2); border-radius: 99px; padding: 7px 16px; font-size: 0.72rem; color: var(--text-dim); }
.wd-back-btn { display: inline-flex; align-items: center; gap: 10px; background: var(--glass2); border: 1px solid var(--border); border-radius: 99px; padding: 12px 24px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-dim); cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.25s; }
.wd-back-btn:hover { border-color: var(--text); color: var(--text); }
.wd-smt-badge { display: inline-flex; align-items: center; gap: 10px; background: rgba(225,48,108,0.08); border: 1px solid rgba(225,48,108,0.22); border-radius: 14px; padding: 12px 18px; text-decoration: none; transition: all 0.25s; color: #e1306c; }
.wd-smt-badge:hover { background: rgba(225,48,108,0.15); border-color: rgba(225,48,108,0.4); }
.wd-smt-badge i { font-size: 1.1rem; }
.wd-smt-badge span { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; }
@media (max-width: 1024px) { .wd-hero { padding: 130px 40px 60px; } .wd-section { padding: 65px 40px; } }
@media (max-width: 768px) { .wd-hero { padding: 110px 24px 56px; } .wd-section { padding: 52px 24px; } .wd-hero-title { font-size: clamp(3rem, 12vw, 5.5rem); } }
@media (max-width: 480px) { .wd-hero { padding: 100px 20px 48px; } .wd-section { padding: 44px 20px; } .wd-hero-meta { gap: 16px; } .wd-sec-title { font-size: clamp(2rem, 8vw, 3rem); } }
`;

export default function WorkDetail13() {
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
      <section className="wd-hero">
        <div className="wd-hero-bg" />
        <div className="wd-hero-orb" />
        <div className="wd-breadcrumb wd-reveal">Work <span>/ Short Film</span></div>
        <div className="wd-badges wd-reveal wd-d1">
          {d.badges.map((b, i) => (
            <span key={i} className={`wd-badge wd-badge-${b === 'Short Film' ? 'film' : 'video'}`}>
              {b === 'Short Film' && <i className="fa-solid fa-film" />}
              {b === 'Video' && <i className="fa-solid fa-video" />}
              {b}
            </span>
          ))}
        </div>
        <h1 className="wd-hero-title wd-reveal wd-d2">{d.title}<br /><em>{d.titleSub}</em></h1>
        <div className="wd-hero-meta wd-reveal wd-d3">
          <div className="wd-meta-item"><span className="wd-meta-label">Year</span><span className="wd-meta-val">{d.year}</span></div>
          <div className="wd-meta-item"><span className="wd-meta-label">Production</span><span className="wd-meta-val">{d.production}</span></div>
          <div className="wd-meta-item"><span className="wd-meta-label">Pembina</span><span className="wd-meta-val">{d.pembina}</span></div>
          <div className="wd-meta-item"><span className="wd-meta-label">Sutradara</span><span className="wd-meta-val">{DATA.crew[0].name}</span></div>
        </div>
      </section>

      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">01 / Film</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">Watch the <em>Film.</em></h2>
        <div className="wd-yt-wrap wd-reveal wd-d2">
          <iframe src={`https://www.youtube.com/embed/${d.youtubeId}`} title={`${d.title} — ${d.titleSub}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          <div className="wd-yt-footer">
            <div className="wd-yt-title-row"><span className="wd-yt-film-name">{d.title}</span><span className="wd-yt-sub">{d.production} · {d.year}</span></div>
            <a href={`https://youtu.be/${d.youtubeId}`} target="_blank" rel="noopener noreferrer" className="wd-yt-link"><i className="fa-brands fa-youtube" />YouTube</a>
          </div>
        </div>
      </section>

      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">02 / About</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">About This <em>Film.</em></h2>
        <div className="wd-reveal wd-d1"><div className="wd-lang-toggle">
          <button className={`wd-lang-btn ${lang === 'id' ? 'active' : ''}`} onClick={() => setLang('id')}>ID</button>
          <button className={`wd-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
        </div></div>
        <p className="wd-desc wd-reveal wd-d2">{isEn ? d.descEn : d.descId}</p>
        <div style={{ marginTop: 36 }} className="wd-reveal wd-d3">
          <a href={d.sinematura.href} target="_blank" rel="noopener noreferrer" className="wd-smt-badge">
            <i className="fa-brands fa-instagram" />
            <span>{d.sinematura.handle}</span>
          </a>
        </div>
      </section>

      {d.crew && d.crew.length > 0 && (
        <section className="wd-section">
          <span className="wd-sec-label wd-reveal">03 / Production</span>
          <h2 className="wd-sec-title wd-reveal wd-d1">Tim <em>Produksi.</em></h2>
          <div className="wd-reveal wd-d2" style={{ overflowX: 'auto' }}>
            <table className="wd-crew-table">
              <thead><tr><th>Role</th><th>Nama</th></tr></thead>
              <tbody>{d.crew.map((c, i) => <tr key={i}><td className="wd-crew-role">{c.role}</td><td className="wd-crew-name">{c.name}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      )}

      {d.cast && d.cast.length > 0 && (
        <section className="wd-section">
          <span className="wd-sec-label wd-reveal">04 / Cast</span>
          <h2 className="wd-sec-title wd-reveal wd-d1">Pemeran <em>Film.</em></h2>
          <div className="wd-cast-list wd-reveal wd-d2">
            {d.cast.map((c, i) => (
              <span key={i} className="wd-cast-pill">{c.actor} <span style={{ opacity: 0.5, margin: '0 4px' }}>—</span> <em>{c.char}</em></span>
            ))}
          </div>
        </section>
      )}

      <div className="wd-reveal" style={{ padding: '48px 80px 80px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <button className="wd-back-btn" onClick={() => navigate('/works')}><i className="fa-solid fa-arrow-left" />Back to Works</button>
        <a href={d.sinematura.href} target="_blank" rel="noopener noreferrer" className="wd-smt-badge">
          <i className="fa-brands fa-instagram" />
          <span>{d.sinematura.handle}</span>
        </a>
      </div>
    </div>
  );
}
