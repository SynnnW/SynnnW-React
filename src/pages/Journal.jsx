import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Bilingual data (sumber: translations.js, tidak butuh t prop) ── */
const TX = {
  id: {
    pageLabel:   'JOURNAL',
    title:       'Journal',
    titleB:      '& Cerita.',
    sub:         'Cerita di balik karya.',
    stat1Label:  'Artikel',
    stat2Label:  'Sejak 2024',
    featuredTag: '✦ Artikel Unggulan',
    meta1:       'April 2026',
    meta2:       '5 menit baca',
    articleTitle:
      'Ketua Pelaksana FISS: Film School Screening se-Tapal Kuda di SMAN 1 Kraksaan',
    excerpt:
      'Sebuah catatan perjalanan tentang memimpin dan mengeksekusi event pemutaran film lintas sekolah se-wilayah Tapal Kuda — dari konsep, koordinasi tim, hingga momen layar menyala di hadapan ratusan penonton muda yang haus sinema.',
    readMore: 'Baca Selengkapnya',
    author:   'Aldo Leo Saputra',
  },
  en: {
    pageLabel:   'JOURNAL',
    title:       'Journal',
    titleB:      '& Stories.',
    sub:         'Stories behind the work.',
    stat1Label:  'Article',
    stat2Label:  'Since 2024',
    featuredTag: '✦ Featured Article',
    meta1:       'April 2026',
    meta2:       '5 min read',
    articleTitle:
      'Event Chair FISS: Film School Screening across Tapal Kuda Region at SMAN 1 Kraksaan',
    excerpt:
      'A journey of leading and executing a cross-school film screening event across the Tapal Kuda region — from concept, team coordination, to the moment the screen lit up before hundreds of young cinema-hungry viewers.',
    readMore: 'Read More',
    author:   'Aldo Leo Saputra',
  },
};

export default function Journal() {
  const navigate  = useNavigate();
  const revealEls = useRef([]);

  /* ── Lang dari localStorage (sinkron dengan Navbar toggle) ── */
  const [lang, setLang] = useState(() => localStorage.getItem('synw-lang') || 'id');
  useEffect(() => {
    const onStorage = () => setLang(localStorage.getItem('synw-lang') || 'id');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const t = TX[lang] || TX.id;

  const r = (el) => {
    if (el && !revealEls.current.includes(el)) revealEls.current.push(el);
  };

  /* ── Reveal Observer ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    const id = setTimeout(() => {
      revealEls.current.forEach((el) => { if (el) observer.observe(el); });
    }, 50);
    return () => { clearTimeout(id); observer.disconnect(); };
  }, []);

  const go = (path) => navigate(path);

  return (
    <>
      <style>{CSS}</style>

      <div className="journal-page">

        {/* ══════════════════════════════
            PAGE HEADER
        ══════════════════════════════ */}
        <div className="page-header">
          <div className="header-orb orb-1" />
          <div className="header-orb orb-2" />
          <div className="header-inner">
            <span ref={r} className="page-label reveal">{t.pageLabel}</span>
            <h1 ref={r} className="page-title reveal rv-d1">
              <em>{t.title}</em><br />
              <span>{t.titleB}</span>
            </h1>
            <p ref={r} className="page-sub reveal rv-d2">
              {t.sub}
            </p>
          </div>
          <div ref={r} className="header-stats reveal rv-d3">
            <div className="stat-item">
              <span className="stat-num">1</span>
              <span className="stat-label">{t.stat1Label}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">2024</span>
              <span className="stat-label">{t.stat2Label}</span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            JOURNAL CONTENT
        ══════════════════════════════ */}
        <div className="journal-content">

          {/* Featured */}
          <div ref={r} className="featured-wrap reveal">
            <span className="featured-tag">{t.featuredTag}</span>

            <article
              className="card-featured"
              onClick={() => go('/journal/karya1')}
            >
              {/* Gambar */}
              <div className="card-feat-img">
                <FeatImg />
                <div className="card-feat-overlay" />
                <div className="card-feat-badges">
                  <span className="jbadge">Leadership</span>
                  <span className="jbadge">Filmmaking</span>
                  <span className="jbadge">Event</span>
                </div>
              </div>

              {/* Body */}
              <div className="card-feat-body">
                <div className="card-feat-meta">
                  <span className="card-dot" />
                  <span className="card-date">{t.meta1}</span>
                  <span className="card-dot" />
                  <span className="card-read">{t.meta2}</span>
                </div>
                <h2 className="card-feat-title">
                  {t.articleTitle}
                </h2>
                <p className="card-feat-excerpt">
                  {t.excerpt}
                </p>
                <div className="card-feat-footer">
                  <div className="card-author">
                    <div className="author-avatar">
                      <AuthorAvatar />
                    </div>
                    <span className="author-name">{t.author}</span>
                  </div>
                  <button
                    className="btn-read"
                    onClick={(e) => { e.stopPropagation(); go('/journal/karya1'); }}
                  >
                    {t.readMore} <i className="fa-solid fa-arrow-up-right" />
                  </button>
                </div>
              </div>
            </article>
          </div>

        </div>
      </div>
      {/* ── Tidak ada local footer — global Footer dari App.jsx yang handle ── */}
    </>
  );
}

/* ─────────────────────────────────────────
   Sub-components: image error handling
───────────────────────────────────────── */
function FeatImg() {
  const [err, setErr] = useState(false);
  if (err) return (
    <div className="card-img-placeholder">
      <i className="fa-solid fa-film" />
      <span>journal-fiss.jpg</span>
    </div>
  );
  return (
    <img
      src="/assets/img/aldo.jpg"
      alt="FISS Film School Screening Tapal Kuda"
      onError={() => setErr(true)}
      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
    />
  );
}

function AuthorAvatar() {
  const [err, setErr] = useState(false);
  if (err) return <i className="fa-solid fa-user" />;
  return (
    <img
      src="/assets/img/favicon.png"
      alt="Aldo Leo Saputra"
      onError={() => setErr(true)}
    />
  );
}

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const CSS = `
/* Reveal */
.reveal { opacity:0; transform:translateY(38px); transition:opacity 0.82s ease, transform 0.82s ease; }
.reveal.visible { opacity:1; transform:translateY(0); }
.rv-d1 { transition-delay:0.12s; }
.rv-d2 { transition-delay:0.24s; }
.rv-d3 { transition-delay:0.36s; }

/* padding-top:0 — App.jsx main sudah handle 64px via isFullscreen logic */
.journal-page { padding-top: 0; }

/* Page Header */
.page-header {
  min-height: 54vh;
  padding: 60px 80px 60px;
  display: flex; flex-direction: column; justify-content: flex-end;
  position: relative; overflow: hidden;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%);
}
.header-orb {
  position: absolute; border-radius: 50%;
  pointer-events: none; filter: blur(90px);
}
.orb-1 {
  width: 550px; height: 550px; top: -150px; right: -60px;
  background: radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%);
}
.orb-2 {
  width: 380px; height: 380px; bottom: -100px; left: 3%;
  background: radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%);
}
.page-header::after {
  content: '';
  position: absolute; bottom: 0; left: 80px; right: 80px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent2), transparent);
  opacity: 0.2;
}
.header-inner { position: relative; z-index: 1; max-width: 680px; }
.page-label {
  display: block; font-size: 0.62rem; font-weight: 600;
  letter-spacing: 0.32em; text-transform: uppercase;
  color: var(--text-dim); margin-bottom: 14px;
}
.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.5rem, 9vw, 9rem);
  font-weight: 300; line-height: 0.88; margin-bottom: 22px;
}
.page-title em { font-style: italic; color: var(--text-dim); }
.page-sub { font-size: 0.9rem; color: var(--text-dim); max-width: 460px; line-height: 1.8; }

.header-stats {
  position: absolute; bottom: 40px; right: 80px; z-index: 1;
  display: flex; align-items: center; gap: 20px;
}
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem; font-weight: 700; color: var(--text); line-height: 1;
}
.stat-label { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim); }
.stat-divider { width: 1px; height: 36px; background: var(--border2); }

/* Journal Content */
.journal-content { padding: 70px 80px 100px; }

.featured-wrap { margin-bottom: 70px; }
.featured-tag {
  display: inline-block;
  font-size: 0.62rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--accent2); margin-bottom: 18px;
}

/* Featured Card */
.card-featured {
  display: grid; grid-template-columns: 1.1fr 1fr;
  border-radius: 26px; overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg2); cursor: pointer;
  transition: all 0.45s ease;
  position: relative;
}
.card-featured::before {
  content: '';
  position: absolute; inset: 0; border-radius: 26px;
  background: linear-gradient(135deg, rgba(139,92,246,0.06) 0%, transparent 55%);
  opacity: 0; transition: opacity 0.45s; pointer-events: none; z-index: 0;
}
.card-featured:hover {
  transform: translateY(-8px);
  border-color: rgba(139,92,246,0.35);
  box-shadow: 0 32px 80px var(--shadow), 0 0 0 1px rgba(139,92,246,0.1);
}
.card-featured:hover::before { opacity: 1; }

.card-feat-img {
  position: relative; overflow: hidden;
  min-height: 420px; background: var(--bg3);
}
.card-feat-img img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.65s ease;
  -webkit-user-drag: none;
}
.card-featured:hover .card-feat-img img { transform: scale(1.06); }
.card-img-placeholder {
  width: 100%; height: 100%; min-height: 420px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 14px;
  background: linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%);
  color: var(--text-dim); font-size: 0.68rem;
  letter-spacing: 0.18em; text-transform: uppercase;
}
.card-img-placeholder i { font-size: 3rem; opacity: 0.2; }
.card-feat-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to right, rgba(7,7,9,0.3) 0%, transparent 60%);
  transition: opacity 0.4s;
}
/* Light mode: soften overlay */
[data-theme="light"] .card-feat-overlay {
  background: linear-gradient(to right, rgba(250,248,245,0.15) 0%, transparent 60%);
}
.card-feat-badges {
  position: absolute; top: 18px; left: 18px;
  display: flex; gap: 8px; flex-wrap: wrap; z-index: 1;
}
.jbadge {
  background: var(--glass2);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--gborder2);
  border-radius: 99px; padding: 5px 13px;
  font-size: 0.6rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text);
}

.card-feat-body {
  padding: 44px 42px;
  display: flex; flex-direction: column; justify-content: center;
  position: relative; z-index: 1;
}
.card-feat-meta {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 16px; flex-wrap: wrap;
}
.card-dot {
  width: 3px; height: 3px; border-radius: 50%;
  background: var(--text-dim); flex-shrink: 0;
  display: inline-block;
}
.card-date { font-size: 0.65rem; color: var(--text-dim); }
.card-read { font-size: 0.65rem; color: var(--text-dim); }
.card-feat-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.5rem, 2.5vw, 2.1rem);
  font-weight: 600; line-height: 1.22; margin-bottom: 18px;
}
.card-feat-excerpt {
  font-size: 0.86rem; color: var(--text-dim);
  line-height: 1.82; margin-bottom: 32px; flex: 1;
}
.card-feat-footer {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.card-author { display: flex; align-items: center; gap: 10px; }
.author-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  overflow: hidden; border: 1px solid var(--border2);
  background: var(--glass2); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-dim); font-size: 0.8rem;
}
.author-avatar img { width: 100%; height: 100%; object-fit: cover; }
.author-name { font-size: 0.74rem; font-weight: 600; color: var(--text); }
.btn-read {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--accent); color: #fff;
  border: none; border-radius: 99px; padding: 11px 24px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  cursor: pointer; transition: all 0.3s; white-space: nowrap;
  box-shadow: 0 6px 24px rgba(139,92,246,0.32);
}
.btn-read:hover { background: var(--accent2); transform: scale(1.05); box-shadow: 0 10px 34px rgba(139,92,246,0.44); }

/* Responsive */
@media (max-width: 1100px) {
  .card-featured { grid-template-columns: 1fr; }
  .card-feat-img { min-height: 280px; aspect-ratio: 16/9; }
}
@media (max-width: 1024px) {
  .page-header { padding: 60px 40px 60px; }
  .journal-content { padding: 60px 40px 80px; }
  .header-stats { right: 40px; }
}
@media (max-width: 768px) {
  .page-header { padding: 50px 24px 52px; min-height: auto; }
  .page-header::after { left: 24px; right: 24px; }
  .header-stats { position: static; margin-top: 28px; justify-content: flex-start; }
  .journal-content { padding: 44px 24px 70px; }
  .card-feat-body { padding: 28px 24px; }
  .card-feat-footer { flex-direction: column; align-items: flex-start; gap: 14px; }
}
`;
