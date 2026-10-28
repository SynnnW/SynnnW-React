import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LeoNotch = lazy(() => import('../leo/LeoNotch'));

function useWide() {
  const q = '(min-width: 900px)';
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setWide(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return wide;
}

const DATA = {
  title: 'Leo',
  titleSub: 'Notch for Windows',
  year: '2026',
  type: 'Software / App',
  developer: 'Aldo Leo Saputra',
  repo: 'https://github.com/SynnnW/Leo',
  badges: ['Software', 'Rust', 'Windows'],
  descEn: 'Leo is a lightweight Windows notch in the spirit of a Dynamic Island. It sits at the top edge of the screen, shows what matters, and gets out of the way. Built natively in Rust with Direct2D, so there is no web engine running behind it.',
  descId: 'Leo adalah notch Windows yang ringan, terinspirasi Dynamic Island. Ia menempel di tepi atas layar, menampilkan yang penting, lalu minggir. Dibuat native dengan Rust dan Direct2D, tanpa web engine di belakangnya.',
  features: [
    ['Music', 'Musik', 'Now playing with playback controls.', 'Sedang diputar dengan kontrol pemutar.'],
    ['Focus', 'Focus', 'Pomodoro timer.', 'Timer Pomodoro.'],
    ['Water', 'Water', 'Water intake reminders.', 'Pengingat minum air.'],
    ['To-do', 'To-do', 'Quick to-do list.', 'Daftar to-do cepat.'],
    ['Schedule', 'Jadwal', 'Class and event schedule.', 'Jadwal kuliah dan acara.'],
    ['Shelf', 'Shelf', 'Temporary file shelf.', 'Rak file sementara.'],
    ['Clipboard', 'Clipboard', 'Recent clipboard items.', 'Riwayat clipboard terbaru.'],
    ['Settings', 'Pengaturan', 'Options applied instantly.', 'Opsi langsung diterapkan.'],
    ['OSD & notifications', 'OSD & notifikasi', 'Volume, brightness and system alerts in the notch.', 'Volume, kecerahan, dan notifikasi sistem di notch.'],
    ['Privacy indicators', 'Indikator privasi', 'Dots while the mic or camera is in use.', 'Titik saat mikrofon atau kamera dipakai.'],
  ],
  stack: [
    ['Language', 'Bahasa', 'Rust'],
    ['Rendering', 'Rendering', 'Direct2D'],
    ['Sync', 'Sinkronisasi', 'Supabase'],
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

.wd-page { background: var(--bg); min-height: 100vh; color: var(--text); font-family: var(--font-body); }

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
    transparent,
    radial-gradient(ellipse 35% 45% at 10% 85%, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 60%);
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
  padding: 5px 14px; border-radius: 2px;
  font-size: 0.58rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
}
.wd-badge-lany { background: color-mix(in srgb, var(--text) 12%, transparent); border: 1px solid color-mix(in srgb, var(--text) 30%, transparent); color: var(--text); }
.wd-badge-act { background: color-mix(in srgb, var(--text) 12%, transparent); border: 1px solid color-mix(in srgb, var(--text) 30%, transparent); color: var(--text); }
.wd-hero-title {
  font-family: var(--font-display);
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
.wd-sec-title { font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 4.8rem); font-weight: 300; line-height: 0.92; margin-bottom: 48px; }
.wd-sec-title em { font-style: italic; color: var(--text-dim); }

.wd-yt-wrap {
  border-radius: 2px; overflow: hidden;
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
  border-radius: 2px; padding: 12px 24px;
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-dim); cursor: pointer; font-family: var(--font-body);
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

const EXTRA_CSS = `
.wd-link { display: inline-flex; align-items: center; gap: 10px; background: var(--accent); color: var(--on-accent); border: 1px solid var(--accent); border-radius: 2px; padding: 12px 24px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; }
.wd-link:focus-visible, .wd-back-btn:focus-visible { outline: 2px solid var(--text); outline-offset: 3px; }
.wd-leo-logo { width: 64px; height: 64px; margin-bottom: 20px; position: relative; z-index: 1; }
`;

export default function WorkDetail28({ lang = 'id' }) {
  const navigate = useNavigate();
  const pageRef = useReveal();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS + EXTRA_CSS;
    document.head.appendChild(style);
    window.scrollTo(0, 0);
    return () => { try { document.head.removeChild(style); } catch { /* ignore */ } };
  }, []);

  const wide = useWide();
  const d = DATA;
  const isEn = lang === 'en';

  return (
    <div className="wd-page" ref={pageRef}>
      <section className="wd-hero">
        <div className="wd-hero-bg" />

        <div className="wd-breadcrumb wd-reveal">
          Work <span>/ Software</span>
        </div>

        <img className="wd-leo-logo wd-reveal" src="/assets/leo/leo-64.webp" width="64" height="64" alt="Leo" decoding="async" />

        <div className="wd-badges wd-reveal wd-d1">
          {d.badges.map((b) => (
            <span key={b} className="wd-badge wd-badge-lany">{b}</span>
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
            <span className="wd-meta-label">Type</span>
            <span className="wd-meta-val">{d.type}</span>
          </div>
          <div className="wd-meta-item">
            <span className="wd-meta-label">{isEn ? 'Developer' : 'Pengembang'}</span>
            <span className="wd-meta-val">{d.developer}</span>
          </div>
        </div>
      </section>

      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">01 / Demo</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">{isEn ? 'Try the' : 'Coba'} <em>{isEn ? 'notch.' : 'notch-nya.'}</em></h2>
        {wide ? (
          <Suspense fallback={<div style={{ minHeight: 360 }} />}>
            <LeoNotch lang={lang} />
          </Suspense>
        ) : (
          <div className="wd-reveal wd-d2">
            <img src="/assets/thumbs/leo.webp" width="960" height="540" alt="Leo" loading="lazy" decoding="async" style={{ width: '100%', height: 'auto', border: '1px solid var(--border)' }} />
            <p className="wd-desc" style={{ marginTop: 16 }}>{isEn ? 'The interactive demo is available on laptop screens.' : 'Demo interaktif tersedia di layar laptop.'}</p>
          </div>
        )}
      </section>

      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">02 / {isEn ? 'About' : 'Tentang'}</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">
          {isEn ? 'A notch that' : 'Notch yang'} <em>{isEn ? 'gets out of the way.' : 'tahu diri.'}</em>
        </h2>
        <p className="wd-desc wd-reveal wd-d2">{isEn ? d.descEn : d.descId}</p>
        <a className="wd-link wd-reveal wd-d3" href={d.repo} target="_blank" rel="noopener noreferrer">
          <i className="fa-brands fa-github" aria-hidden="true" />
          {isEn ? 'View on GitHub' : 'Lihat di GitHub'}
        </a>
      </section>

      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">03 / {isEn ? 'Features' : 'Fitur'}</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">{isEn ? 'What it' : 'Apa yang'} <em>{isEn ? 'does.' : 'bisa.'}</em></h2>
        <table className="wd-crew-table wd-reveal wd-d2">
          <thead>
            <tr>
              <th>{isEn ? 'Module' : 'Modul'}</th>
              <th>{isEn ? 'Description' : 'Deskripsi'}</th>
            </tr>
          </thead>
          <tbody>
            {d.features.map((f) => (
              <tr key={f[0]}>
                <td><span className="wd-crew-role">{isEn ? f[0] : f[1]}</span></td>
                <td><span className="wd-crew-name">{isEn ? f[2] : f[3]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">04 / Stack</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">{isEn ? 'Built' : 'Dibuat'} <em>{isEn ? 'with.' : 'dengan.'}</em></h2>
        <table className="wd-crew-table wd-reveal wd-d2">
          <tbody>
            {d.stack.map((s) => (
              <tr key={s[0]}>
                <td><span className="wd-crew-role">{isEn ? s[0] : s[1]}</span></td>
                <td><span className="wd-crew-name">{s[2]}</span></td>
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
