import{a as e,i as t,r as n,t as r}from"./index-ngWTQpDX.js";import{a as i,d as a,n as o,o as s,p as c,t as l}from"./firebase-DcjwoJha.js";var u=e(t(),1),d=r(),f={web:`fa-globe`,video:`fa-film`,motion:`fa-wand-magic-sparkles`,desain:`fa-palette`,fotovideo:`fa-camera`,livestream:`fa-tower-broadcast`},p={web:`Web Design & Development`,video:`Video Editing`,motion:`Motion Graphic`,desain:`Ilustrasi & Desain Grafis`,fotovideo:`Fotografi & Videografi`,livestream:`Live Streaming & Broadcast`};function m(){let e=n(),[t,r]=(0,u.useState)(null),[m,_]=(0,u.useState)(null),[v,y]=(0,u.useState)(!0),[b,x]=(0,u.useState)(!1);(0,u.useEffect)(()=>{let t=a(l,async t=>{if(!t){e(`/`);return}_(t);try{let e=await s(i(o,`users`,t.uid));e.exists()&&r(e.data())}catch{}y(!1)});return()=>t()},[e]);let S=async()=>{x(!0),await c(l),e(`/`)};if((0,u.useEffect)(()=>{let e=`dash-styles`;if(document.getElementById(e))return;let t=document.createElement(`style`);return t.id=e,t.textContent=g,document.head.appendChild(t),()=>{let t=document.getElementById(e);t&&t.remove()}},[]),v)return(0,d.jsxs)(`div`,{className:`dash-loader`,children:[(0,d.jsx)(`div`,{className:`dash-spinner`}),(0,d.jsx)(`span`,{children:`Memuat data projek…`})]});let C=t?.service||``,w=f[C]||`fa-star`,T=p[C]||C?.toUpperCase();return(0,d.jsxs)(`div`,{className:`dash-wrap`,children:[(0,d.jsxs)(`div`,{className:`dash-topbar`,children:[(0,d.jsxs)(`div`,{className:`dash-logo`,children:[(0,d.jsx)(`span`,{className:`dash-logo-dot`}),`SynnnW `,(0,d.jsx)(`span`,{className:`dash-logo-tag`,children:`Dashboard`})]}),(0,d.jsxs)(`button`,{className:`dash-btn-signout`,onClick:S,disabled:b,children:[b?(0,d.jsx)(`span`,{className:`dash-spinner-sm`}):(0,d.jsx)(`i`,{className:`fa-solid fa-right-from-bracket`}),b?`Keluar…`:`Sign Out`]})]}),(0,d.jsxs)(`div`,{className:`dash-main`,children:[(0,d.jsxs)(`div`,{className:`dash-hero`,children:[(0,d.jsx)(`div`,{className:`dash-avatar`,children:m?.photoURL?(0,d.jsx)(`img`,{src:m.photoURL,alt:`avatar`,className:`dash-avatar-img`}):(0,d.jsx)(`i`,{className:`fa-solid fa-user`})}),(0,d.jsxs)(`div`,{children:[(0,d.jsxs)(`h1`,{className:`dash-greeting`,children:[`Halo, `,t?.contactName||m?.displayName||`Klien`,`!`]}),(0,d.jsx)(`p`,{className:`dash-subgreet`,children:`Data kuis kamu berhasil direkam dengan aman.`})]})]}),(0,d.jsxs)(`div`,{className:`dash-status-bar`,children:[(0,d.jsx)(`i`,{className:`fa-solid fa-circle-dot dash-status-dot`}),(0,d.jsx)(`span`,{children:`Status Projek: `}),(0,d.jsx)(`span`,{className:`dash-badge-status`,children:t?.status||`Dalam Review`})]}),(0,d.jsxs)(`div`,{className:`dash-grid`,children:[(0,d.jsxs)(`div`,{className:`dash-card dash-card-accent`,children:[(0,d.jsx)(`div`,{className:`dash-card-icon`,children:(0,d.jsx)(`i`,{className:`fa-solid ${w}`})}),(0,d.jsx)(`p`,{className:`dash-card-label`,children:`Layanan Utama`}),(0,d.jsx)(`p`,{className:`dash-card-value`,children:T})]}),(0,d.jsxs)(`div`,{className:`dash-card`,children:[(0,d.jsx)(`div`,{className:`dash-card-icon dash-card-icon-alt`,children:(0,d.jsx)(`i`,{className:`fa-solid fa-coins`})}),(0,d.jsx)(`p`,{className:`dash-card-label`,children:`Kisaran Budget`}),(0,d.jsx)(`p`,{className:`dash-card-value dash-card-value-sm`,children:t?.budget||`—`})]}),(0,d.jsxs)(`div`,{className:`dash-card`,children:[(0,d.jsx)(`div`,{className:`dash-card-icon dash-card-icon-alt`,children:(0,d.jsx)(`i`,{className:`fa-solid fa-clock`})}),(0,d.jsx)(`p`,{className:`dash-card-label`,children:`Target Waktu`}),(0,d.jsx)(`p`,{className:`dash-card-value dash-card-value-sm`,children:t?.deadline||`—`})]}),(0,d.jsxs)(`div`,{className:`dash-card`,children:[(0,d.jsx)(`div`,{className:`dash-card-icon dash-card-icon-alt`,children:(0,d.jsx)(`i`,{className:`fa-solid fa-id-card`})}),(0,d.jsx)(`p`,{className:`dash-card-label`,children:`Tipe Klien`}),(0,d.jsx)(`p`,{className:`dash-card-value dash-card-value-sm`,style:{textTransform:`capitalize`},children:t?.clientType||`—`})]})]}),(0,d.jsxs)(`div`,{className:`dash-detail-card`,children:[(0,d.jsxs)(`div`,{className:`dash-detail-header`,children:[(0,d.jsx)(`i`,{className:`fa-solid fa-file-lines`}),(0,d.jsx)(`h3`,{children:`Ringkasan Lengkap Projek`})]}),(0,d.jsxs)(`div`,{className:`dash-detail-rows`,children:[(0,d.jsx)(h,{label:`Nama Klien`,value:t?.contactName}),(0,d.jsx)(h,{label:`Email`,value:t?.email}),(0,d.jsx)(h,{label:`WhatsApp`,value:t?.whatsapp?`+62 ${t.whatsapp}`:void 0}),(0,d.jsx)(h,{label:`Tipe Klien`,value:t?.clientType,cap:!0}),(0,d.jsx)(h,{label:`Layanan`,value:T}),(0,d.jsx)(h,{label:`Budget`,value:t?.budget}),(0,d.jsx)(h,{label:`Deadline`,value:t?.deadline}),(0,d.jsx)(h,{label:`Referral`,value:t?.referral}),t?.story&&(0,d.jsxs)(`div`,{className:`dash-row dash-row-full`,children:[(0,d.jsx)(`span`,{className:`dash-row-label`,children:`Cerita / Catatan`}),(0,d.jsx)(`p`,{className:`dash-row-story`,children:t.story})]})]})]}),(0,d.jsxs)(`button`,{className:`dash-btn-pay`,onClick:()=>e(`/checkout`),children:[(0,d.jsx)(`i`,{className:`fa-solid fa-qrcode`}),`Lanjutkan ke Invoice & Bayar QRIS`,(0,d.jsx)(`i`,{className:`fa-solid fa-arrow-right`})]}),(0,d.jsx)(`p`,{className:`dash-footnote`,children:`Butuh revisi data? Hubungi kami via WhatsApp atau email.`})]})]})}function h({label:e,value:t,cap:n}){return t?(0,d.jsxs)(`div`,{className:`dash-row`,children:[(0,d.jsx)(`span`,{className:`dash-row-label`,children:e}),(0,d.jsx)(`span`,{className:`dash-row-value`,style:n?{textTransform:`capitalize`}:{},children:t})]}):null}var g=`
/* ── Loader ── */
.dash-loader {
  min-height: 60vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 16px; color: var(--text-dim);
  font-family: 'Outfit', sans-serif; font-size: 0.85rem; letter-spacing: 0.06em;
}
.dash-spinner {
  width: 36px; height: 36px; border-radius: 50%;
  border: 2.5px solid var(--gborder);
  border-top-color: var(--accent);
  animation: dashSpin 0.8s linear infinite;
}
.dash-spinner-sm {
  display: inline-block;
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  animation: dashSpin 0.7s linear infinite;
}
@keyframes dashSpin { to { transform: rotate(360deg); } }

/* ── Layout ── */
.dash-wrap {
  min-height: 100vh;
  background: var(--bg);
  font-family: 'Outfit', sans-serif;
}

/* ── Topbar ── */
.dash-topbar {
  position: sticky; top: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 40px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px);
}
.dash-logo {
  display: flex; align-items: center; gap: 8px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.15rem; font-weight: 600; letter-spacing: 0.05em;
  color: var(--text);
}
.dash-logo-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent);
}
.dash-logo-tag {
  font-family: 'Outfit', sans-serif;
  font-size: 0.68rem; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text-dim);
  padding: 3px 8px; border-radius: 6px;
  background: var(--glass2); border: 1px solid var(--gborder);
}
.dash-btn-signout {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 18px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--text-dim);
  transition: all 0.25s;
}
.dash-btn-signout:hover:not(:disabled) {
  color: var(--text); border-color: var(--gborder2);
}
.dash-btn-signout:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Main content ── */
.dash-main {
  max-width: 720px; margin: 0 auto;
  padding: 48px 24px 80px;
  display: flex; flex-direction: column; gap: 24px;
}

/* ── Hero ── */
.dash-hero {
  display: flex; align-items: center; gap: 20px;
}
.dash-avatar {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--glass2); border: 1px solid var(--gborder);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; color: var(--text-dim);
  flex-shrink: 0; overflow: hidden;
}
.dash-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.dash-greeting {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem; font-weight: 600; color: var(--text);
  margin: 0 0 4px;
}
.dash-subgreet {
  font-size: 0.82rem; color: var(--text-dim); margin: 0;
}

/* ── Status bar ── */
.dash-status-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 18px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 12px;
  font-size: 0.8rem; color: var(--text-dim);
}
.dash-status-dot { color: #10b981; font-size: 0.6rem; }
.dash-badge-status {
  padding: 3px 10px; border-radius: 6px;
  background: rgba(251,191,36,0.1);
  color: #fbbf24;
  font-size: 0.72rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
}

/* ── Cards grid ── */
.dash-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}
.dash-card {
  padding: 20px 22px;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 18px;
  display: flex; flex-direction: column; gap: 10px;
}
.dash-card-accent {
  background: rgba(139,92,246,0.08);
  border-color: rgba(139,92,246,0.25);
}
.dash-card-icon {
  width: 40px; height: 40px; border-radius: 12px;
  background: rgba(139,92,246,0.15);
  border: 1px solid rgba(139,92,246,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; color: var(--accent3);
}
.dash-card-icon-alt {
  background: var(--glass2);
  border-color: var(--gborder);
  color: var(--text-dim);
}
.dash-card-label {
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text-dim);
  margin: 0;
}
.dash-card-value {
  font-size: 1rem; font-weight: 700; color: var(--accent3);
  margin: 0; line-height: 1.3;
}
.dash-card-value-sm { font-size: 0.84rem; color: var(--text); font-weight: 500; }

/* ── Detail card ── */
.dash-detail-card {
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 20px; overflow: hidden;
}
.dash-detail-header {
  display: flex; align-items: center; gap: 10px;
  padding: 18px 22px;
  border-bottom: 1px solid var(--border);
  font-size: 0.82rem; font-weight: 700;
  letter-spacing: 0.06em; color: var(--text);
}
.dash-detail-header i { color: var(--accent3); }
.dash-detail-rows {
  padding: 16px 22px;
  display: flex; flex-direction: column; gap: 2px;
}
.dash-row {
  display: flex; align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  gap: 12px;
}
.dash-row:last-child { border-bottom: none; }
.dash-row-label {
  flex: 0 0 140px;
  font-size: 0.73rem; font-weight: 600;
  letter-spacing: 0.05em; text-transform: uppercase;
  color: var(--text-dim);
  padding-top: 1px;
}
.dash-row-value {
  flex: 1;
  font-size: 0.84rem; color: var(--text);
  line-height: 1.55;
}
.dash-row-full { flex-direction: column; gap: 8px; padding: 12px 0; }
.dash-row-story {
  font-size: 0.82rem; color: var(--text);
  line-height: 1.7; margin: 0;
  padding: 12px 16px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 10px;
}

/* ── CTA button ── */
.dash-btn-pay {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  width: 100%; padding: 18px;
  background: var(--accent); color: #fff;
  border: none; border-radius: 16px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  cursor: pointer; transition: all 0.35s;
  box-shadow: 0 8px 32px rgba(139,92,246,0.35);
}
.dash-btn-pay:hover {
  background: var(--accent2);
  transform: translateY(-2px);
  box-shadow: 0 14px 44px rgba(139,92,246,0.48);
}

/* ── Footnote ── */
.dash-footnote {
  text-align: center;
  font-size: 0.74rem; color: var(--text-dim);
  margin: 0;
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .dash-topbar { padding: 14px 20px; }
  .dash-main { padding: 32px 16px 60px; }
  .dash-greeting { font-size: 1.5rem; }
  .dash-grid { grid-template-columns: 1fr; }
  .dash-row-label { flex: 0 0 110px; }
}
`;export{m as default};