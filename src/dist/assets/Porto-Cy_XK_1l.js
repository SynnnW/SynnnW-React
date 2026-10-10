import{a as e,i as t,r as n,t as r}from"./index-ngWTQpDX.js";var i=e(t(),1),a=r();function o({t:e={}}){let t=n(),[r,o]=(0,i.useState)(`all`),l=(0,i.useRef)([]),u=e=>{e&&!l.current.includes(e)&&l.current.push(e)},d=[{key:`all`,label:e.filterAll||`All`},{key:`web`,label:e.filterWeb||`Web Dev`},{key:`video`,label:e.filterVideo||`Video`},{key:`ilustrasi`,label:e.filterIlustrasi||`Illustration`},{key:`foto`,label:e.filterFoto||`Photography`},{key:`livestream`,label:e.filterLive||`Live Stream`}],f=[{id:`karya1`,filter:`web`,img:`/assets/img/image.png`,imgAlt:e.karya1Title+` `+e.karya1Em,badge:`Web Dev`,cat:e.karya1Cat||`Web Development & AI Integration`,year:`2026`,title:e.karya1Title||`Interactive`,titleEm:e.karya1Em||`Birthday Gift`,desc:e.karya1Desc||``,tags:[e.portoTagAI||`AI Integration`,e.portoTagNFC||`NFC Technology`,e.portoTagGame||`Interactive Game`,`HTML / CSS / JS`],route:`/porto/karya1`,delay:``},{id:`karya2`,filter:`web`,img:`/assets/img/bg.png`,imgAlt:e.karya2Title+` `+e.karya2Em,badge:`Web Dev`,cat:e.karya2Cat||`Web Development & Telegram Integration`,year:`2026`,title:e.karya2Title||`Undangan`,titleEm:e.karya2Em||`Pernikahan Digital`,desc:e.karya2Desc||``,tags:[e.portoTagTelegram||`Telegram Bot API`,e.portoTagPersonal||`Personal Welcome`,e.portoTagRSVP||`Real-time RSVP`,`HTML / CSS / JS`],route:`/porto/karya2`,delay:`rv-d1`},{id:`karya3`,filter:`video`,img:`/assets/img/projects.png`,imgAlt:e.karya3Title+` `+e.karya3Em,badge:e.filterVideo||`Video`,cat:e.karya3Cat||`Video Editing & Creative Production`,year:`2023 – 2025`,title:e.karya3Title||`Video Editing`,titleEm:e.karya3Em||`Collection`,desc:e.karya3Desc||``,tags:[e.filterVideo||`Video Editing`,e.portoTagFLS||`FLS2N / FLS3N`,e.portoTagEvent||`Event & Awards`,e.portoTagCreative||`Creative Production`],route:`/porto/karya3`,delay:``},{id:`karya4`,filter:`livestream`,img:`/assets/img/livestream.png`,imgAlt:e.karya4Title+` `+e.karya4Em,badge:e.filterLive||`Live Stream`,cat:e.karya4Cat||`Live Stream Design & Broadcast Application`,year:`2026`,title:e.karya4Title||`Live Stream Design`,titleEm:e.karya4Em||`OBS via Tablet`,desc:e.karya4Desc||``,tags:[e.portoTagOBS||`OBS Studio`,e.portoTagStream||`Live Streaming`,e.portoTagPERBASI||`PERBASI YEJBL`,e.portoTagTablet||`Tablet Controller`],route:`/porto/karya4`,delay:`rv-d1`}],p=r===`all`?f.length+1:f.filter(e=>e.filter===r).length;(0,i.useEffect)(()=>{let e=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&e.target.classList.add(`visible`)})},{threshold:.1,rootMargin:`0px 0px -30px 0px`}),t=setTimeout(()=>{l.current.forEach(t=>{t&&e.observe(t)})},50);return()=>{clearTimeout(t),e.disconnect()}},[]);let m=e=>t(e);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`style`,{children:c}),(0,a.jsx)(`header`,{className:`page-header`,children:(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`span`,{ref:u,className:`page-label reveal`,children:e.portoPageLabel||`PORTFOLIO`}),(0,a.jsxs)(`h1`,{ref:u,className:`page-title reveal rv-d1`,children:[(0,a.jsx)(`em`,{children:e.portoTitle||`Selected `}),e.portoEm||`Works.`]}),(0,a.jsx)(`p`,{ref:u,className:`page-sub reveal rv-d2`,children:e.portoSub||``})]})}),(0,a.jsxs)(`div`,{ref:u,className:`filter-section reveal rv-d1`,children:[(0,a.jsx)(`div`,{className:`filter-pills`,children:d.map(({key:e,label:t})=>(0,a.jsx)(`button`,{className:`pill${r===e?` active`:``}`,onClick:()=>o(e),children:t},e))}),(0,a.jsxs)(`span`,{className:`filter-count`,children:[p,` `,e.portoCountLabel||`Works`]})]}),(0,a.jsxs)(`div`,{className:`works-grid`,children:[f.map(t=>{let n=r!==`all`&&r!==t.filter;return(0,a.jsxs)(`article`,{ref:u,className:`work-card reveal${t.delay?` ${t.delay}`:``}${n?` hidden`:``}`,onClick:()=>m(t.route),children:[(0,a.jsx)(s,{img:t.img,alt:t.imgAlt,badge:t.badge,overlayLabel:e.lihatDetail||`View Detail`}),(0,a.jsxs)(`div`,{className:`wcard-body`,children:[(0,a.jsxs)(`div`,{className:`wcard-meta`,children:[(0,a.jsx)(`span`,{className:`wcard-cat`,children:t.cat}),(0,a.jsx)(`span`,{className:`wcard-year`,children:t.year})]}),(0,a.jsxs)(`h2`,{className:`wcard-title`,children:[t.title,(0,a.jsx)(`br`,{}),(0,a.jsx)(`em`,{children:t.titleEm})]}),(0,a.jsx)(`p`,{className:`wcard-desc`,children:t.desc}),(0,a.jsx)(`div`,{className:`wcard-tags`,children:t.tags.map(e=>(0,a.jsx)(`span`,{className:`tag`,children:e},e))})]})]},t.id)}),(0,a.jsxs)(`article`,{ref:u,className:`work-card wcard-next reveal rv-d1${r===`all`?``:` hidden`}`,onClick:()=>m(`/contact`),children:[(0,a.jsxs)(`div`,{className:`wcard-img-wrap wcard-next-img`,children:[(0,a.jsxs)(`div`,{className:`wcard-next-inner`,children:[(0,a.jsx)(`i`,{className:`fa-solid fa-plus wcard-next-icon`}),(0,a.jsx)(`span`,{className:`wcard-next-label`,children:e.cardNextLabel||`Next Work`}),(0,a.jsx)(`span`,{className:`wcard-next-sub`,children:e.cardNextSub||`Have a project? Contact me.`})]}),(0,a.jsx)(`span`,{className:`wcard-badge`,children:e.portoBadgeSoon||`Coming Soon`})]}),(0,a.jsxs)(`div`,{className:`wcard-body`,children:[(0,a.jsxs)(`div`,{className:`wcard-meta`,children:[(0,a.jsx)(`span`,{className:`wcard-cat`,children:e.portoCustomLabel||`Custom Project`}),(0,a.jsx)(`span`,{className:`wcard-year`,children:`2026`})]}),(0,a.jsxs)(`h2`,{className:`wcard-title`,children:[e.cardNextTitle||`Could Be`,(0,a.jsx)(`br`,{}),(0,a.jsx)(`em`,{children:e.cardNextEm||`Yours`})]}),(0,a.jsx)(`p`,{className:`wcard-desc`,children:e.cardNextDesc||``}),(0,a.jsxs)(`div`,{className:`wcard-tags`,children:[(0,a.jsx)(`span`,{className:`tag`,children:e.portoTag1||`Collaboration`}),(0,a.jsx)(`span`,{className:`tag`,children:e.portoTag2||`Web Dev`}),(0,a.jsx)(`span`,{className:`tag`,children:e.portoTag3||`Video Editing`})]}),(0,a.jsxs)(`button`,{className:`btn-next-contact`,onClick:e=>{e.stopPropagation(),m(`/contact`)},children:[e.cardNextBtn||`Start Discussion`,` `,(0,a.jsx)(`i`,{className:`fa-solid fa-arrow-up-right`})]})]})]})]}),(0,a.jsx)(`div`,{ref:u,className:`porto-cta-section reveal`,children:(0,a.jsxs)(`div`,{className:`porto-cta-glass`,children:[(0,a.jsx)(`p`,{className:`porto-cta-eyebrow`,children:e.portoCTAEyebrow||``}),(0,a.jsxs)(`h3`,{className:`porto-cta-title`,children:[e.portoCTATitle||`Let's bring`,(0,a.jsx)(`br`,{}),(0,a.jsx)(`em`,{children:e.portoCTAEm||`your idea to life.`})]}),(0,a.jsx)(`p`,{className:`porto-cta-desc`,children:e.portoCTADesc||``}),(0,a.jsxs)(`button`,{className:`btn-cta-main`,onClick:()=>m(`/contact`),children:[e.portoCTABtn||`Start a Project Now`,` `,(0,a.jsx)(`i`,{className:`fa-solid fa-arrow-up-right`})]})]})}),(0,a.jsx)(`footer`,{className:`site-footer`,children:(0,a.jsxs)(`div`,{className:`footer-bottom`,children:[(0,a.jsx)(`span`,{className:`footer-copy`,children:e.footerCopy||`© 2026 Aldo Leo Saputra`}),(0,a.jsxs)(`div`,{className:`footer-socials`,children:[(0,a.jsx)(`a`,{href:`https://github.com/SynnnW`,target:`_blank`,rel:`noopener`,className:`f-soc-link`,"aria-label":`GitHub`,children:(0,a.jsx)(`i`,{className:`fa-brands fa-github`})}),(0,a.jsx)(`a`,{href:`https://www.instagram.com/aldosynnn?igsh=MWNhYTdzaWQyOGkwaA==`,target:`_blank`,rel:`noopener`,className:`f-soc-link`,"aria-label":`Instagram`,children:(0,a.jsx)(`i`,{className:`fa-brands fa-instagram`})})]}),(0,a.jsxs)(`button`,{className:`footer-top-btn`,onClick:()=>window.scrollTo({top:0,behavior:`smooth`}),children:[(0,a.jsx)(`i`,{className:`fa-solid fa-arrow-up`}),` `,e.portoFooterTop||`Back to top`]})]})})]})}function s({img:e,alt:t,badge:n,overlayLabel:r}){let[o,s]=(0,i.useState)(!1);return(0,a.jsxs)(`div`,{className:`wcard-img-wrap`,children:[o?(0,a.jsxs)(`div`,{className:`wcard-placeholder`,children:[(0,a.jsx)(`i`,{className:`fa-solid fa-film`}),(0,a.jsx)(`span`,{children:`Preview`})]}):(0,a.jsx)(`img`,{src:e,alt:t,onError:()=>s(!0),loading:`lazy`}),(0,a.jsx)(`div`,{className:`wcard-overlay`,children:(0,a.jsxs)(`span`,{className:`wcard-overlay-label`,children:[r,` `,(0,a.jsx)(`i`,{className:`fa-solid fa-arrow-up-right`})]})}),(0,a.jsx)(`span`,{className:`wcard-badge`,children:n})]})}var c=`
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
`;export{o as default};