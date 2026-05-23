import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Porto({ t = {} }) {
  const navigate  = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const revealEls = useRef([]);

  const r = (el) => {
    if (el && !revealEls.current.includes(el)) revealEls.current.push(el);
  };

  const FILTERS = [
    { key: 'all',        label: t.filterAll       || 'All' },
    { key: 'web',        label: t.filterWeb        || 'Web Dev' },
    { key: 'video',      label: t.filterVideo      || 'Video' },
    { key: 'ilustrasi',  label: t.filterIlustrasi  || 'Illustration' },
    { key: 'foto',       label: t.filterFoto       || 'Photography' },
    { key: 'livestream', label: t.filterLive       || 'Live Stream' },
  ];

  const WORKS = [
    {
      id: 'karya1', filter: 'web',
      img: '/assets/img/image.png', imgAlt: t.karya1Title + ' ' + t.karya1Em,
      badge: 'Web Dev',
      cat: t.karya1Cat || 'Web Development & AI Integration', year: '2026',
      title: t.karya1Title || 'Interactive', titleEm: t.karya1Em || 'Birthday Gift',
      desc: t.karya1Desc || '',
      tags: [t.portoTagAI||'AI Integration', t.portoTagNFC||'NFC Technology', t.portoTagGame||'Interactive Game', 'HTML / CSS / JS'],
      route: '/porto/karya1',
      delay: '',
    },
    {
      id: 'karya2', filter: 'web',
      img: '/assets/img/bg.png', imgAlt: t.karya2Title + ' ' + t.karya2Em,
      badge: 'Web Dev',
      cat: t.karya2Cat || 'Web Development & Telegram Integration', year: '2026',
      title: t.karya2Title || 'Undangan', titleEm: t.karya2Em || 'Pernikahan Digital',
      desc: t.karya2Desc || '',
      tags: [t.portoTagTelegram||'Telegram Bot API', t.portoTagPersonal||'Personal Welcome', t.portoTagRSVP||'Real-time RSVP', 'HTML / CSS / JS'],
      route: '/porto/karya2',
      delay: 'rv-d1',
    },
    {
      id: 'karya3', filter: 'video',
      img: '/assets/img/projects.png', imgAlt: t.karya3Title + ' ' + t.karya3Em,
      badge: t.filterVideo || 'Video',
      cat: t.karya3Cat || 'Video Editing & Creative Production', year: '2023 – 2025',
      title: t.karya3Title || 'Video Editing', titleEm: t.karya3Em || 'Collection',
      desc: t.karya3Desc || '',
      tags: [t.filterVideo||'Video Editing', t.portoTagFLS||'FLS2N / FLS3N', t.portoTagEvent||'Event & Awards', t.portoTagCreative||'Creative Production'],
      route: '/porto/karya3',
      delay: '',
    },
    {
      id: 'karya4', filter: 'livestream',
      img: '/assets/img/livestream.png', imgAlt: t.karya4Title + ' ' + t.karya4Em,
      badge: t.filterLive || 'Live Stream',
      cat: t.karya4Cat || 'Live Stream Design & Broadcast Application', year: '2026',
      title: t.karya4Title || 'Live Stream Design', titleEm: t.karya4Em || 'OBS via Tablet',
      desc: t.karya4Desc || '',
      tags: [t.portoTagOBS||'OBS Studio', t.portoTagStream||'Live Streaming', t.portoTagPERBASI||'PERBASI YEJBL', t.portoTagTablet||'Tablet Controller'],
      route: '/porto/karya4',
      delay: 'rv-d1',
    },
  ];

  const visibleCount = activeFilter === 'all'
    ? WORKS.length + 1
    : WORKS.filter((w) => w.filter === activeFilter).length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    const id = setTimeout(() => {
      revealEls.current.forEach((el) => { if (el) observer.observe(el); });
    }, 50);
    return () => { clearTimeout(id); observer.disconnect(); };
  }, []);

  const go = (path) => navigate(path);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <style>{CSS}</style>

      {/* PAGE HEADER */}
      <header className="page-header">
        <div>
          <span ref={r} className="page-label reveal">{t.portoPageLabel || 'PORTFOLIO'}</span>
          <h1 ref={r} className="page-title reveal rv-d1">
            <em>{t.portoTitle || 'Selected '}</em>{t.portoEm || 'Works.'}
          </h1>
          <p ref={r} className="page-sub reveal rv-d2">
            {t.portoSub || ''}
          </p>
        </div>
      </header>

      {/* FILTER PILLS */}
      <div ref={r} className="filter-section reveal rv-d1">
        <div className="filter-pills">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              className={`pill${activeFilter === key ? ' active' : ''}`}
              onClick={() => setActiveFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="filter-count">{visibleCount} {t.portoCountLabel || 'Works'}</span>
      </div>

      {/* WORKS GRID */}
      <div className="works-grid">
        {WORKS.map((w) => {
          const hidden = activeFilter !== 'all' && activeFilter !== w.filter;
          return (
            <article
              key={w.id}
              ref={r}
              className={`work-card reveal${w.delay ? ` ${w.delay}` : ''}${hidden ? ' hidden' : ''}`}
              onClick={() => go(w.route)}
            >
              <WorkImg img={w.img} alt={w.imgAlt} badge={w.badge} overlayLabel={t.lihatDetail || 'View Detail'} />
              <div className="wcard-body">
                <div className="wcard-meta">
                  <span className="wcard-cat">{w.cat}</span>
                  <span className="wcard-year">{w.year}</span>
                </div>
                <h2 className="wcard-title">
                  {w.title}<br /><em>{w.titleEm}</em>
                </h2>
                <p className="wcard-desc">{w.desc}</p>
                <div className="wcard-tags">
                  {w.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
                </div>
              </div>
            </article>
          );
        })}

        {/* Coming Soon card */}
        <article
          ref={r}
          className={`work-card wcard-next reveal rv-d1${activeFilter !== 'all' ? ' hidden' : ''}`}
          onClick={() => go('/contact')}
        >
          <div className="wcard-img-wrap wcard-next-img">
            <div className="wcard-next-inner">
              <i className="fa-solid fa-plus wcard-next-icon" />
              <span className="wcard-next-label">{t.cardNextLabel || 'Next Work'}</span>
              <span className="wcard-next-sub">{t.cardNextSub || 'Have a project? Contact me.'}</span>
            </div>
            <span className="wcard-badge">{t.portoBadgeSoon || 'Coming Soon'}</span>
          </div>
          <div className="wcard-body">
            <div className="wcard-meta">
              <span className="wcard-cat">{t.portoCustomLabel || 'Custom Project'}</span>
              <span className="wcard-year">2026</span>
            </div>
            <h2 className="wcard-title">
              {t.cardNextTitle || 'Could Be'}<br /><em>{t.cardNextEm || 'Yours'}</em>
            </h2>
            <p className="wcard-desc">{t.cardNextDesc || ''}</p>
            <div className="wcard-tags">
              <span className="tag">{t.portoTag1 || 'Collaboration'}</span>
              <span className="tag">{t.portoTag2 || 'Web Dev'}</span>
              <span className="tag">{t.portoTag3 || 'Video Editing'}</span>
            </div>
            <button
              className="btn-next-contact"
              onClick={(e) => { e.stopPropagation(); go('/contact'); }}
            >
              {t.cardNextBtn || 'Start Discussion'} <i className="fa-solid fa-arrow-up-right" />
            </button>
          </div>
        </article>
      </div>

      {/* CTA SECTION */}
      <div ref={r} className="porto-cta-section reveal">
        <div className="porto-cta-glass">
          <p className="porto-cta-eyebrow">{t.portoCTAEyebrow || ''}</p>
          <h3 className="porto-cta-title">
            {t.portoCTATitle || "Let's bring"}<br /><em>{t.portoCTAEm || 'your idea to life.'}</em>
          </h3>
          <p className="porto-cta-desc">{t.portoCTADesc || ''}</p>
          <button className="btn-cta-main" onClick={() => go('/contact')}>
            {t.portoCTABtn || 'Start a Project Now'} <i className="fa-solid fa-arrow-up-right" />
          </button>
        </div>
      </div>

      {/* FOOTER MINI */}
      <footer className="site-footer">
        <div className="footer-bottom">
          <span className="footer-copy">{t.footerCopy || '© 2026 Aldo Leo Saputra'}</span>
          <div className="footer-socials">
            <a href="https://github.com/SynnnW" target="_blank" rel="noopener" className="f-soc-link" aria-label="GitHub">
              <i className="fa-brands fa-github" />
            </a>
            <a href="https://www.instagram.com/aldosynnn?igsh=MWNhYTdzaWQyOGkwaA==" target="_blank" rel="noopener" className="f-soc-link" aria-label="Instagram">
              <i className="fa-brands fa-instagram" />
            </a>
          </div>
          <button className="footer-top-btn" onClick={scrollTop}>
            <i className="fa-solid fa-arrow-up" /> {t.portoFooterTop || 'Back to top'}
          </button>
        </div>
      </footer>
    </>
  );
}

function WorkImg({ img, alt, badge, overlayLabel }) {
  const [err, setErr] = useState(false);
  return (
    <div className="wcard-img-wrap">
      {err ? (
        <div className="wcard-placeholder">
          <i className="fa-solid fa-film" />
          <span>Preview</span>
        </div>
      ) : (
        <img src={img} alt={alt} onError={() => setErr(true)} loading="lazy" />
      )}
      <div className="wcard-overlay">
        <span className="wcard-overlay-label">
          {overlayLabel} <i className="fa-solid fa-arrow-up-right" />
        </span>
      </div>
      <span className="wcard-badge">{badge}</span>
    </div>
  );
}

const CSS = `
.reveal { opacity:0; transform:translateY(38px); transition:opacity 0.82s ease, transform 0.82s ease; }
.reveal.visible { opacity:1; transform:translateY(0); }
.rv-d1 { transition-delay:0.12s; }
.rv-d2 { transition-delay:0.24s; }
.rv-d3 { transition-delay:0.36s; }

.page-header {
  min-height: 55vh;
  display: flex; align-items: flex-end;
  padding: 130px 80px 70px;
  position: relative; overflow: hidden;
  border-bottom: 1px solid var(--border);
}
.page-header::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 70% at 80% 20%, rgba(139,92,246,0.09) 0%, transparent 70%);
  pointer-events: none;
}
.page-header::after {
  content: '';
  position: absolute; bottom: 0; left: 80px; right: 80px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent2), transparent);
  opacity: 0.25;
}
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
.page-sub { font-size: 0.9rem; color: var(--text-dim); max-width: 460px; line-height: 1.78; }

.filter-section {
  padding: 36px 80px 0;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 14px;
}
.filter-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.pill {
  border: 1px solid var(--border2); border-radius: 99px;
  padding: 8px 20px; font-size: 0.64rem; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-dim); cursor: pointer; background: none;
  font-family: 'Outfit', sans-serif; transition: all 0.28s ease;
}
.pill:hover { color: var(--text); border-color: var(--text); }
.pill.active { background: var(--text); color: var(--bg); border-color: var(--text); }
.filter-count { font-size: 0.7rem; color: var(--text-dim); letter-spacing: 0.1em; }

.works-grid {
  padding: 40px 80px 80px;
  display: grid; grid-template-columns: repeat(2,1fr); gap: 24px;
}
.work-card {
  border-radius: 22px; overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg2); cursor: pointer;
  transition: all 0.42s ease; position: relative;
}
.work-card:hover {
  transform: translateY(-9px);
  border-color: rgba(139,92,246,0.38);
  box-shadow: 0 28px 70px var(--shadow), 0 0 0 1px rgba(139,92,246,0.1);
}
.work-card.hidden { display: none; }

.wcard-img-wrap {
  position: relative; aspect-ratio: 16/9;
  overflow: hidden; background: var(--bg3);
}
.wcard-img-wrap img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.65s ease;
  -webkit-user-drag: none;
}
.work-card:hover .wcard-img-wrap img { transform: scale(1.07); }

.wcard-placeholder {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
  background: linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%);
  color: var(--text-dim); font-size: 0.68rem;
  letter-spacing: 0.18em; text-transform: uppercase;
}
.wcard-placeholder i { font-size: 2.5rem; opacity: 0.2; }

.wcard-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(7,7,9,0.75) 0%, rgba(7,7,9,0.2) 50%, transparent 100%);
  opacity: 0; transition: opacity 0.4s ease;
  display: flex; align-items: flex-end; padding: 22px;
}
.work-card:hover .wcard-overlay { opacity: 1; }
.wcard-overlay-label {
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  color: #fff; display: flex; align-items: center; gap: 8px;
}

.wcard-badge {
  position: absolute; top: 14px; left: 14px;
  background: var(--glass2);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  border: 1px solid var(--gborder2);
  border-radius: 99px; padding: 5px 14px;
  font-size: 0.6rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text);
}

.wcard-body { padding: 24px 26px 26px; }
.wcard-meta {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
}
.wcard-cat {
  font-size: 0.6rem; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent2);
}
.wcard-year { font-size: 0.65rem; color: var(--text-dim); }
.wcard-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.55rem; font-weight: 600;
  line-height: 1.18; margin-bottom: 12px;
}
.wcard-title em { font-style: italic; color: var(--text-dim); }
.wcard-desc {
  font-size: 0.8rem; line-height: 1.76;
  color: var(--text-dim); margin-bottom: 18px;
}
.wcard-tags { display: flex; flex-wrap: wrap; gap: 7px; }
.tag {
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 99px; padding: 4px 12px;
  font-size: 0.6rem; font-weight: 600; color: var(--text-dim);
  backdrop-filter: blur(10px); transition: all 0.3s;
}
.tag:hover { border-color: var(--accent3); color: var(--accent3); }

.wcard-next-img {
  background: linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%);
  display: flex; align-items: center; justify-content: center;
  min-height: 220px; border-bottom: 1px solid var(--border);
}
.wcard-next-inner {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 10px; text-align: center; padding: 20px; z-index: 1;
}
.wcard-next-icon {
  font-size: 2.2rem; color: var(--accent2); opacity: 0.55;
  transition: all 0.4s ease;
}
.work-card:hover .wcard-next-icon { opacity: 1; transform: rotate(90deg) scale(1.1); }
.wcard-next-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.35rem; font-weight: 600;
  color: var(--text); letter-spacing: 0.02em;
}
.wcard-next-sub { font-size: 0.72rem; color: var(--text-dim); letter-spacing: 0.1em; }
.btn-next-contact {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 10px;
  background: var(--accent); color: #fff;
  border: none; border-radius: 99px;
  padding: 11px 26px;
  font-family: 'Outfit', sans-serif; font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.13em; text-transform: uppercase;
  transition: all 0.3s ease; cursor: pointer;
  box-shadow: 0 6px 24px rgba(139,92,246,0.32);
}
.btn-next-contact:hover {
  background: var(--accent2); transform: scale(1.04);
  box-shadow: 0 10px 32px rgba(139,92,246,0.44);
}

.porto-cta-section { padding: 0 80px 100px; }
.porto-cta-glass {
  background: var(--glass);
  backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
  border: 1px solid var(--gborder);
  border-radius: 28px; padding: 60px 70px;
  position: relative; overflow: hidden; text-align: center;
}
.porto-cta-glass::before {
  content: ''; position: absolute; inset: 0; border-radius: 28px;
  background: radial-gradient(ellipse 70% 80% at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 65%);
  pointer-events: none;
}
.porto-cta-glass::after {
  content: '';
  position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent);
}
.porto-cta-eyebrow {
  font-size: 0.65rem; font-weight: 600;
  letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--accent2); margin-bottom: 16px; position: relative; z-index: 1;
}
.porto-cta-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 300; line-height: 1.05; margin-bottom: 18px;
  position: relative; z-index: 1;
}
.porto-cta-title em { font-style: italic; color: var(--text-dim); }
.porto-cta-desc {
  font-size: 0.88rem; color: var(--text-dim);
  max-width: 420px; margin: 0 auto 36px; line-height: 1.78;
  position: relative; z-index: 1;
}
.btn-cta-main {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--accent); color: #fff;
  border: none; border-radius: 99px; padding: 15px 38px;
  font-family: 'Outfit', sans-serif; font-size: 0.74rem; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  transition: all 0.35s ease; cursor: pointer;
  box-shadow: 0 8px 32px rgba(139,92,246,0.38);
  position: relative; z-index: 1;
}
.btn-cta-main:hover {
  background: var(--accent2); transform: scale(1.06);
  box-shadow: 0 14px 44px rgba(139,92,246,0.48);
}

.site-footer { background: var(--bg2); padding: 28px 80px; border-top: 1px solid var(--border); }
.footer-bottom {
  display: flex; align-items: center;
  justify-content: space-between; flex-wrap: wrap; gap: 14px;
}
.footer-copy { font-size: 0.72rem; color: var(--text-dim); }
.footer-socials { display: flex; gap: 10px; }
.f-soc-link {
  width: 36px; height: 36px; border-radius: 50%;
  border: 1px solid var(--border); background: var(--glass);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-dim); font-size: 0.82rem; transition: all 0.3s;
  text-decoration: none;
}
.f-soc-link:hover { border-color: var(--accent2); color: var(--accent2); transform: translateY(-2px); }
.footer-top-btn {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.65rem; font-weight: 600;
  letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--text-dim); background: none; border: none;
  transition: color 0.3s; cursor: pointer; font-family: 'Outfit', sans-serif;
}
.footer-top-btn:hover { color: var(--text); }

@media (max-width: 1024px) {
  .page-header      { padding: 120px 40px 60px; }
  .filter-section   { padding: 32px 40px 0; }
  .works-grid       { padding: 36px 40px 70px; }
  .porto-cta-section{ padding: 0 40px 80px; }
  .site-footer      { padding: 24px 40px; }
}
@media (max-width: 768px) {
  .page-header       { padding: 110px 24px 55px; min-height: auto; }
  .filter-section    { padding: 28px 24px 0; }
  .works-grid        { padding: 28px 24px 60px; grid-template-columns: 1fr; }
  .porto-cta-section { padding: 0 24px 70px; }
  .porto-cta-glass   { padding: 40px 28px; }
  .site-footer       { padding: 22px 24px; }
  .footer-bottom     { flex-direction: column; align-items: flex-start; gap: 12px; }
}
`;