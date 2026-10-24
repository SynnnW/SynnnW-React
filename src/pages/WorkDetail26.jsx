import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const DATA = {
  title:      'GENESIS',
  titleSub:   'Generasi Sejuta Inspirasi',
  year:       '2026',
  production: 'SMAN 1 Kraksaan Competition',
  pembina:    'Probolinggo Regency',
  editor:     'Aldo Leo Saputra',
  youtubeId:  null,
  badges:     ['Lanyard Design', 'Event'],
  awards:     [],

  descEn: 'Official lanyard design for GENESIS (Generasi Sejuta Inspirasi) — a prestigious regional-scale competition and olympiad held annually by SMAN 1 Kraksaan, Probolinggo Regency. The event brings together outstanding students from SMP/MTs and SMA levels across the Tapal Kuda region to compete in MIPA, IPS, and various other academic competitions.',
  descId: 'Design lanyard resmi untuk GENESIS (Generasi Sejuta Inspirasi) — ajang kompetisi dan olimpiade bergengsi berskala regional yang diselenggarakan setiap tahun oleh SMAN 1 Kraksaan, Kabupaten Probolinggo. Acara ini mempertemukan siswa-siswi terbaik tingkat SMP/MTs dan SMA dari seluruh wilayah Tapal Kuda untuk berkompetisi di MIPA, IPS, dan berbagai perlombaan akademik lainnya.',

  crew: [
    { role: 'Designer', name: 'Aldo Leo Saputra' },
  ],
};

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

const CSS = `
.wd-reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.65s ease, transform 0.65s ease; }
.wd-reveal.wd-visible { opacity: 1; transform: translateY(0); }
.wd-d1 { transition-delay: 0.1s; }
.wd-d2 { transition-delay: 0.2s; }
.wd-d3 { transition-delay: 0.3s; }

.wd-page { background: var(--bg); min-height: 100vh; color: var(--text); font-family: 'Outfit', sans-serif; }

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
    radial-gradient(ellipse 55% 55% at 85% 15%, rgba(6,182,212,0.14) 0%, transparent 60%),
    radial-gradient(ellipse 35% 45% at 10% 85%, rgba(139,92,246,0.08) 0%, transparent 60%);
}
.wd-hero-bg::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 50%, var(--bg) 100%);
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
.wd-badge-lany { background: rgba(6,182,212,0.12); border: 1px solid rgba(6,182,212,0.3); color: #06b6d4; }
.wd-badge-event { background: rgba(6,182,212,0.12); border: 1px solid rgba(6,182,212,0.3); color: #06b6d4; }
.wd-hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(4rem, 10vw, 10rem);
  font-weight: 300; line-height: 0.88;
  margin-bottom: 20px; position: relative; z-index: 1;
}
.wd-hero-title em { font-style: italic; color: var(--text-dim); }
.wd-hero-meta {
  display: flex; flex-wrap: wrap; gap: 28px;
  padding-top: 28px; border-top: 1px solid var(--border);
  position: relative; z-index: 1;
}
.wd-meta-item { display: flex; flex-direction: column; gap: 4px; }
.wd-meta-label { font-size: 0.52rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--text-dim); }
.wd-meta-val { font-size: 0.8rem; font-weight: 500; color: var(--text); }

.wd-section { padding: 80px 80px; border-top: 1px solid var(--border); }
.wd-sec-label { display: block; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px; }
.wd-sec-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.4rem, 5vw, 4.8rem); font-weight: 300; line-height: 0.92; margin-bottom: 48px; }
.wd-sec-title em { font-style: italic; color: var(--text-dim); }

.wd-yt-wrap {
  border-radius: 22px; overflow: hidden;
  border: 1px solid var(--border);
  position: relative;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5);
}
.wd-yt-footer {
  padding: 16px 20px;
  background: var(--bg3);
  border-top: 1px solid var(--border2);
  display: flex; align-items: center; justify-content: space-between;
}
.wd-yt-title-row {
  display: flex; flex-direction: column; gap: 4px;
}
.wd-yt-film-name {
  font-size: 0.8rem; font-weight: 700; color: var(--text);
}
.wd-yt-sub {
  font-size: 0.7rem; color: var(--text-dim);
}

.wd-desc { font-size: 0.92rem; line-height: 1.9; color: var(--text-dim); margin-bottom: 28px; max-width: 680px; }

.wd-crew-table { width: 100%; border-collapse: collapse; }
.wd-crew-table th {
  text-align: left; font-size: 0.58rem; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim);
  padding: 0 16px 14px; border-bottom: 1px solid var(--border);
}
.wd-crew-table td {
  padding: 13px 16px; font-size: 0.84rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.wd-crew-table tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
.wd-crew-table tr:last-child td { border-bottom: none; }
.wd-crew-role { color: var(--text-dim); font-size: 0.8rem; white-space: nowrap; }
.wd-crew-name { color: var(--text); font-weight: 500; }

.wd-back-btn {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--glass2); border: 1px solid var(--border);
  border-radius: 99px; padding: 12px 24px;
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-dim); cursor: pointer; font-family: 'Outfit', sans-serif;
  transition: all 0.25s;
}
.wd-back-btn:hover { border-color: var(--text); color: var(--text); }

@media (max-width: 1024px) {
  .wd-hero { padding: 130px 40px 60px; }
  .wd-section { padding: 65px 40px; }
}
@media (max-width: 768px) {
  .wd-hero { padding: 110px 24px 56px; }
  .wd-section { padding: 52px 24px; }
  .wd-hero-title { font-size: clamp(3rem, 12vw, 5.5rem); }
}
`;

export default function WorkDetail26({ lang = 'id' }) {
  const navigate = useNavigate();
  const pageRef = useReveal();

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
      <section className="wd-hero">
        <div className="wd-hero-bg" />

        <div className="wd-breadcrumb wd-reveal">
          Work <span>/ Event Lanyard</span>
        </div>

        <div className="wd-badges wd-reveal wd-d1">
          {d.badges.map((b, i) => (
            <span key={i} className={`wd-badge wd-badge-${b === 'Event' ? 'event' : 'lany'}`}>
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
            <span className="wd-meta-label">Event</span>
            <span className="wd-meta-val">{d.production}</span>
          </div>
          <div className="wd-meta-item">
            <span className="wd-meta-label">Designer</span>
            <span className="wd-meta-val">{d.editor}</span>
          </div>
        </div>
      </section>

      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">01 / Design</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">
          View the <em>Lanyard.</em>
        </h2>

        <div className="wd-yt-wrap wd-reveal wd-d2">
          <iframe
            src="https://drive.google.com/file/d/1aaDWt6jLSPmyrwqqqqocihHvzAQigPTS/preview"
            title="Lanyard GENESIS"
            allow="autoplay; encrypted-media"
            style={{ width: '100%', aspectRatio: '3/4', border: 'none', display: 'block' }}
          />
          <div className="wd-yt-footer">
            <div className="wd-yt-title-row">
              <span className="wd-yt-film-name">GENESIS Lanyard</span>
              <span className="wd-yt-sub">Competition Design · SMAN 1 Kraksaan</span>
            </div>
          </div>
        </div>

        <p className="wd-desc wd-reveal wd-d3" style={{ marginTop: '28px' }}>
          {isEn ? d.descEn : d.descId}
        </p>
      </section>

      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">02 / Designer</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">The <em>Creator.</em></h2>
        <table className="wd-crew-table wd-reveal wd-d2">
          <thead>
            <tr>
              <th>{isEn ? 'Role' : 'Peran'}</th>
              <th>{isEn ? 'Name' : 'Nama'}</th>
            </tr>
          </thead>
          <tbody>
            {d.crew.map((c, i) => (
              <tr key={i}>
                <td><span className="wd-crew-role">{c.role}</span></td>
                <td><span className="wd-crew-name">{c.name}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="wd-section">
        <button className="wd-back-btn wd-reveal" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" />
          {isEn ? 'Back' : 'Kembali'}
        </button>
      </section>
    </div>
  );
}
