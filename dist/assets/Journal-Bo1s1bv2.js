import{a as e,i as t,r as n,t as r}from"./index-ngWTQpDX.js";var i=e(t(),1),a=r();function o({t:e={}}){let t=n(),r=(0,i.useRef)([]),o=e=>{e&&!r.current.includes(e)&&r.current.push(e)};(0,i.useEffect)(()=>{let e=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&e.target.classList.add(`visible`)})},{threshold:.1,rootMargin:`0px 0px -30px 0px`}),t=setTimeout(()=>{r.current.forEach(t=>{t&&e.observe(t)})},50);return()=>{clearTimeout(t),e.disconnect()}},[]);let u=e=>t(e);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`style`,{children:l}),(0,a.jsxs)(`div`,{className:`journal-page`,children:[(0,a.jsxs)(`div`,{className:`page-header`,children:[(0,a.jsx)(`div`,{className:`header-orb orb-1`}),(0,a.jsx)(`div`,{className:`header-orb orb-2`}),(0,a.jsxs)(`div`,{className:`header-inner`,children:[(0,a.jsx)(`span`,{ref:o,className:`page-label reveal`,children:`JOURNAL`}),(0,a.jsxs)(`h1`,{ref:o,className:`page-title reveal rv-d1`,children:[(0,a.jsx)(`em`,{children:`Catatan`}),(0,a.jsx)(`br`,{}),(0,a.jsx)(`span`,{children:`& Cerita.`})]}),(0,a.jsx)(`p`,{ref:o,className:`page-sub reveal rv-d2`,children:`Refleksi, proses kreatif, dan cerita di balik setiap karya dan pengalaman.`})]}),(0,a.jsxs)(`div`,{ref:o,className:`header-stats reveal rv-d3`,children:[(0,a.jsxs)(`div`,{className:`stat-item`,children:[(0,a.jsx)(`span`,{className:`stat-num`,children:`1`}),(0,a.jsx)(`span`,{className:`stat-label`,children:`Artikel`})]}),(0,a.jsx)(`div`,{className:`stat-divider`}),(0,a.jsxs)(`div`,{className:`stat-item`,children:[(0,a.jsx)(`span`,{className:`stat-num`,children:`2024`}),(0,a.jsx)(`span`,{className:`stat-label`,children:`Sejak`})]})]})]}),(0,a.jsx)(`div`,{className:`journal-content`,children:(0,a.jsxs)(`div`,{ref:o,className:`featured-wrap reveal`,children:[(0,a.jsx)(`span`,{className:`featured-tag`,children:`✦ Artikel Unggulan`}),(0,a.jsxs)(`article`,{className:`card-featured`,onClick:()=>u(`/journal/karya1`),children:[(0,a.jsxs)(`div`,{className:`card-feat-img`,children:[(0,a.jsx)(s,{}),(0,a.jsx)(`div`,{className:`card-feat-overlay`}),(0,a.jsxs)(`div`,{className:`card-feat-badges`,children:[(0,a.jsx)(`span`,{className:`jbadge`,children:`Leadership`}),(0,a.jsx)(`span`,{className:`jbadge`,children:`Filmmaking`}),(0,a.jsx)(`span`,{className:`jbadge`,children:`Event`})]})]}),(0,a.jsxs)(`div`,{className:`card-feat-body`,children:[(0,a.jsxs)(`div`,{className:`card-feat-meta`,children:[(0,a.jsx)(`span`,{className:`card-dot`}),(0,a.jsx)(`span`,{className:`card-date`,children:`April 2026`}),(0,a.jsx)(`span`,{className:`card-dot`}),(0,a.jsx)(`span`,{className:`card-read`,children:`5 menit baca`})]}),(0,a.jsx)(`h2`,{className:`card-feat-title`,children:`Ketua Pelaksana FISS: Film School Screening se-Tapal Kuda di SMAN 1 Kraksaan`}),(0,a.jsx)(`p`,{className:`card-feat-excerpt`,children:`Sebuah catatan perjalanan tentang memimpin dan mengeksekusi event pemutaran film lintas sekolah se-wilayah Tapal Kuda — dari konsep, koordinasi tim, hingga momen layar menyala di hadapan ratusan penonton muda yang haus sinema.`}),(0,a.jsxs)(`div`,{className:`card-feat-footer`,children:[(0,a.jsxs)(`div`,{className:`card-author`,children:[(0,a.jsx)(`div`,{className:`author-avatar`,children:(0,a.jsx)(c,{})}),(0,a.jsx)(`span`,{className:`author-name`,children:`Aldo Leo Saputra`})]}),(0,a.jsxs)(`button`,{className:`btn-read`,onClick:e=>{e.stopPropagation(),u(`/journal/karya1`)},children:[`Baca Selengkapnya `,(0,a.jsx)(`i`,{className:`fa-solid fa-arrow-up-right`})]})]})]})]})]})})]}),(0,a.jsx)(`footer`,{className:`site-footer`,children:(0,a.jsxs)(`div`,{className:`footer-bottom`,children:[(0,a.jsx)(`span`,{className:`footer-copy`,children:`© 2026 Aldo Leo Saputra`}),(0,a.jsxs)(`div`,{className:`footer-socials`,children:[(0,a.jsx)(`a`,{href:`https://github.com/SynnnW`,target:`_blank`,rel:`noopener`,className:`f-soc-link`,"aria-label":`GitHub`,children:(0,a.jsx)(`i`,{className:`fa-brands fa-github`})}),(0,a.jsx)(`a`,{href:`https://www.instagram.com/aldosynnn?igsh=MWNhYTdzaWQyOGkwaA==`,target:`_blank`,rel:`noopener`,className:`f-soc-link`,"aria-label":`Instagram`,children:(0,a.jsx)(`i`,{className:`fa-brands fa-instagram`})})]}),(0,a.jsxs)(`button`,{className:`footer-top-btn`,onClick:()=>window.scrollTo({top:0,behavior:`smooth`}),children:[(0,a.jsx)(`i`,{className:`fa-solid fa-arrow-up`}),` Ke atas`]})]})})]})}function s(){let[e,t]=(0,i.useState)(!1);return e?(0,a.jsxs)(`div`,{className:`card-img-placeholder`,children:[(0,a.jsx)(`i`,{className:`fa-solid fa-film`}),(0,a.jsx)(`span`,{children:`journal-fiss.jpg`})]}):(0,a.jsx)(`img`,{src:`/assets/img/aldo.jpg`,alt:`FISS Film School Screening Tapal Kuda`,onError:()=>t(!0)})}function c(){let[e,t]=(0,i.useState)(!1);return e?(0,a.jsx)(`i`,{className:`fa-solid fa-user`}):(0,a.jsx)(`img`,{src:`/assets/img/favicon.png`,alt:`Aldo Leo Saputra`,onError:()=>t(!0)})}var l=`
/* Reveal */
.reveal { opacity:0; transform:translateY(38px); transition:opacity 0.82s ease, transform 0.82s ease; }
.reveal.visible { opacity:1; transform:translateY(0); }
.rv-d1 { transition-delay:0.12s; }
.rv-d2 { transition-delay:0.24s; }
.rv-d3 { transition-delay:0.36s; }

.journal-page { padding-top: 76px; }

/* Page Header */
.page-header {
  min-height: 54vh;
  padding: 60px 80px 60px;
  display: flex; flex-direction: column; justify-content: flex-end;
  position: relative; overflow: hidden;
  border-bottom: 1px solid var(--border);
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

/* Footer */
.site-footer { background: var(--bg2); padding: 26px 80px; border-top: 1px solid var(--border); }
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

/* Responsive */
@media (max-width: 1100px) {
  .card-featured { grid-template-columns: 1fr; }
  .card-feat-img { min-height: 280px; aspect-ratio: 16/9; }
}
@media (max-width: 1024px) {
  .page-header { padding: 60px 40px 60px; }
  .journal-content { padding: 60px 40px 80px; }
  .header-stats { right: 40px; }
  .site-footer { padding: 22px 40px; }
}
@media (max-width: 768px) {
  .page-header { padding: 50px 24px 52px; min-height: auto; }
  .page-header::after { left: 24px; right: 24px; }
  .header-stats { position: static; margin-top: 28px; justify-content: flex-start; }
  .journal-content { padding: 44px 24px 70px; }
  .card-feat-body { padding: 28px 24px; }
  .card-feat-footer { flex-direction: column; align-items: flex-start; gap: 14px; }
  .site-footer { padding: 20px 24px; }
  .footer-bottom { flex-direction: column; align-items: flex-start; gap: 12px; }
}
`;export{o as default};