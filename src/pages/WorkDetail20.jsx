// src/pages/WorkDetail20.jsx
// Route: /works/video-kreatif-antikorupsi-2025
// Special: Firebase load dari Firestore 'works-media' doc untuk Google Drive preview URL

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const DATA = {
  title:      'Video Kreatif Anti-Korupsi',
  titleSub:   'Non-AI Creative Video — Anti-Corruption Awareness',
  year:       '2025',
  production: 'Creative Video Competition 2025',
  pembina:    null,
  editor:     'Aldo Leo Saputra',
  youtubeId:  null,
  instagramLink: 'https://www.instagram.com/reel/DOOPBvqgGu5/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==',
  badges:     ['Creative Video', 'Competition'],
  awards:     [],

  descEn: `A non-AI creative video on corruption awareness. Bribery, gratification, nepotism ` +
          `— they hurt everyone. The video calls on people to start with themselves: be honest, ` +
          `have the courage to refuse, commit to integrity. Made for a competition — clean ` +
          `production, strong message.`,

  descId: `Video kreatif anti-korupsi yang nggak pake AI. Korupsi ngerugiin semua orang — ` +
          `dari suap, gratifikasi, sampe nepotisme. Pesannya mulai dari diri sendiri: jujur, ` +
          `berani nolak, dan komitmen buat bersih.`,

  nonAiHighlight: {
    en: 'Non-AI Production — the entire creative process (concept, visuals, narration) was made without AI assistance as per competition rules.',
    id: 'Non-AI Production — seluruh proses kreatif (konsep, visual, narasi) dibuat tanpa bantuan AI sesuai syarat kompetisi.'
  },

  crew: [
    { role: 'Editor & Cameraman', name: 'Aldo Leo Saputra'           },
    { role: 'Cameraman',          name: 'Hermawan Ibra Wicaksono'    },
  ],

  cast: null,
  sinematura: null,
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
.wd-badge-creative { background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3); color: #818cf8; }
.wd-badge-competition { background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25); color: #a78bfa; }
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
.wd-embed-wrap { border-radius: 22px; overflow: hidden; border: 1px solid var(--border); position: relative; box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
.wd-embed-wrap iframe { display: block; width: 100%; aspect-ratio: 16/9; border: none; }
.wd-embed-placeholder { width: 100%; aspect-ratio: 16/9; background: linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(225,48,108,0.06) 100%); border: 1px solid rgba(139,92,246,0.2); border-radius: 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; padding: 40px; text-align: center; }
.wd-embed-placeholder-icon { font-size: 4rem; color: #e1306c; opacity: 0.6; }
.wd-embed-placeholder-text { font-size: 0.9rem; color: var(--text-dim); max-width: 400px; line-height: 1.6; }
.wd-embed-placeholder-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: linear-gradient(135deg, #e1306c, #fd1d1d); color: #fff; border: none; border-radius: 99px; font-family: 'Outfit', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; text-decoration: none; }
.wd-embed-placeholder-btn:hover { opacity: 0.85; }
.wd-lang-toggle { display: inline-flex; align-items: center; gap: 0; background: var(--glass); border: 1px solid var(--border); border-radius: 99px; overflow: hidden; margin-bottom: 24px; }
.wd-lang-btn { padding: 7px 18px; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: none; border: none; color: var(--text-dim); cursor: pointer; transition: all 0.2s; font-family: 'Outfit', sans-serif; }
.wd-lang-btn.active { background: var(--accent); color: #fff; border-radius: 99px; }
.wd-desc { font-size: 0.92rem; line-height: 1.9; color: var(--text-dim); margin-bottom: 28px; max-width: 680px; }
.wd-highlight-box { background: rgba(225,48,108,0.07); border: 1px solid rgba(225,48,108,0.22); border-left: 3px solid #e1306c; border-radius: 14px; padding: 24px 28px; margin-bottom: 28px; }
.wd-highlight-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #e1306c; margin-bottom: 8px; }
.wd-highlight-text { font-size: 0.88rem; line-height: 1.85; color: var(--text-dim); margin: 0; }
.wd-crew-table { width: 100%; border-collapse: collapse; }
.wd-crew-table th { text-align: left; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim); padding: 0 16px 14px; border-bottom: 1px solid var(--border); }
.wd-crew-table td { padding: 13px 16px; font-size: 0.84rem; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: top; }
.wd-crew-table tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
.wd-crew-table tr:last-child td { border-bottom: none; }
.wd-crew-role { color: var(--text-dim); font-size: 0.8rem; white-space: nowrap; }
.wd-crew-name { color: var(--text); font-weight: 500; }
.wd-back-btn { display: inline-flex; align-items: center; gap: 10px; background: var(--glass2); border: 1px solid var(--border); border-radius: 99px; padding: 12px 24px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-dim); cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.25s; }
.wd-back-btn:hover { border-color: var(--text); color: var(--text); }
.wd-ig-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: linear-gradient(135deg, #e1306c, #fd1d1d); color: #fff; border: none; border-radius: 99px; font-family: 'Outfit', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; text-decoration: none; }
.wd-ig-btn:hover { opacity: 0.85; }
.wd-ig-btn i { font-size: 0.9rem; }
@media (max-width: 1024px) { .wd-hero { padding: 130px 40px 60px; } .wd-section { padding: 65px 40px; } }
@media (max-width: 768px) { .wd-hero { padding: 110px 24px 56px; } .wd-section { padding: 52px 24px; } .wd-hero-title { font-size: clamp(3rem, 12vw, 5.5rem); } }
@media (max-width: 480px) { .wd-hero { padding: 100px 20px 48px; } .wd-section { padding: 44px 20px; } .wd-hero-meta { gap: 16px; } .wd-sec-title { font-size: clamp(2rem, 8vw, 3rem); } }
`;

export default function WorkDetail20() {
  const navigate = useNavigate();
  const pageRef  = useReveal();
  const [lang, setLang] = useState('id');
  const [lang, setLang] = useState('id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    window.scrollTo(0, 0);
    return () => { try { document.head.removeChild(style); } catch (_) {} };
  }, []);

  // Load Google Drive preview URL from Firestore
  useEffect(() => {
    const loadPreviewUrl = async () => {
      try {
        const docRef = doc(db, 'works-media', 'workDetail20');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().drivePreviewUrl) {
          setDrivePreviewUrl(docSnap.data().drivePreviewUrl);
        }
      } catch (err) {
        console.error('Error loading preview URL:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPreviewUrl();
  }, []);

  const d    = DATA;
  const isEn = lang === 'en';

  return (
    <div className="wd-page" ref={pageRef}>
      <section className="wd-hero">
        <div className="wd-hero-bg" />
        <div className="wd-hero-orb" />
        <div className="wd-breadcrumb wd-reveal">Work <span>/ Creative Video</span></div>
        <div className="wd-badges wd-reveal wd-d1">
          {d.badges.map((b, i) => (
            <span key={i} className={`wd-badge wd-badge-${b === 'Creative Video' ? 'creative' : 'competition'}`}>
              {b === 'Creative Video' && <i className="fa-solid fa-video" />}
              {b === 'Competition' && <i className="fa-solid fa-trophy" />}
              {b}
            </span>
          ))}
        </div>
        <h1 className="wd-hero-title wd-reveal wd-d2">{d.title}<br /><em>{d.titleSub}</em></h1>
        <div className="wd-hero-meta wd-reveal wd-d3">
          <div className="wd-meta-item"><span className="wd-meta-label">Year</span><span className="wd-meta-val">{d.year}</span></div>
          <div className="wd-meta-item"><span className="wd-meta-label">Type</span><span className="wd-meta-val">Non-AI</span></div>
          <div className="wd-meta-item"><span className="wd-meta-label">Editor</span><span className="wd-meta-val">{d.editor}</span></div>
        </div>
      </section>

      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">01 / Video</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">Watch on <em>Instagram.</em></h2>
        
        <div className="wd-embed-wrap wd-reveal wd-d2">
          <iframe 
            src="https://drive.google.com/file/d/100vHbx6nJoV8zQ9gxxbifcWRhAzJxoXf/preview" 
            title={d.title} 
            allow="autoplay; encrypted-media" 
            style={{ display: 'block', width: '100%', aspectRatio: '16/9', border: 'none' }} 
          />
        </div>
      </section>

      <section className="wd-section">
        <span className="wd-sec-label wd-reveal">02 / About</span>
        <h2 className="wd-sec-title wd-reveal wd-d1">About This <em>Video.</em></h2>
        <div className="wd-reveal wd-d1"><div className="wd-lang-toggle">
          <button className={`wd-lang-btn ${lang === 'id' ? 'active' : ''}`} onClick={() => setLang('id')}>ID</button>
          <button className={`wd-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
        </div></div>
        <p className="wd-desc wd-reveal wd-d2">{isEn ? d.descEn : d.descId}</p>
        
        {/* Non-AI highlight */}
        <div className="wd-highlight-box wd-reveal wd-d3">
          <div className="wd-highlight-label">⚡ {isEn ? 'Non-AI Production' : 'Non-AI Production'}</div>
          <p className="wd-highlight-text">{isEn ? d.nonAiHighlight.en : d.nonAiHighlight.id}</p>
        </div>

        {/* Instagram CTA */}
        <div className="wd-reveal wd-d3">
          <a href={d.instagramLink} target="_blank" rel="noopener noreferrer" className="wd-ig-btn">
            <i className="fa-brands fa-instagram" />
            {isEn ? 'Watch on Instagram' : 'Tonton di Instagram'}
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

      <div className="wd-reveal" style={{ padding: '48px 80px 80px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <button className="wd-back-btn" onClick={() => navigate('/works')}><i className="fa-solid fa-arrow-left" />Back to Works</button>
      </div>
    </div>
  );
}
