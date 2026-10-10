import{a as e,i as t,r as n,t as r}from"./index-ngWTQpDX.js";import{a as i,d as a,l as o,n as s,s as c,t as l}from"./firebase-DcjwoJha.js";var u=e(t(),1),d=r();function f(){return`SYN-`+Math.floor(1e5+Math.random()*9e5)}function p(){let e=n(),[t]=(0,u.useState)(f),[r,p]=(0,u.useState)(`pending`),[h]=(0,u.useState)(`Rp 150.000`),[g,_]=(0,u.useState)(null),[v,y]=(0,u.useState)(!0),[b,x]=(0,u.useState)(!1),[S,C]=(0,u.useState)(900),w=(0,u.useRef)(null);(0,u.useEffect)(()=>{let n=a(l,n=>{if(!n){e(`/`);return}_(n),y(!1);let r=i(s,`transactions`,t);o(r,{orderId:t,uid:n.uid,email:n.email,status:`pending`,amount:h,createdAt:new Date().toISOString()});let a=c(r,t=>{if(!t.exists())return;let n=t.data();p(n.status),(n.status===`settlement`||n.status===`success`)&&(clearInterval(w.current),e(`/dashboard`))});return()=>a()});return()=>n()},[t,e,h]),(0,u.useEffect)(()=>{if(r===`pending`)return w.current=setInterval(()=>{C(e=>e>0?e-1:0)},1e3),()=>clearInterval(w.current)},[r]),(0,u.useEffect)(()=>{let e=`qris-styles`;if(document.getElementById(e))return;let t=document.createElement(`style`);return t.id=e,t.textContent=m,document.head.appendChild(t),()=>{let t=document.getElementById(e);t&&t.remove()}},[]);let T=async()=>{x(!0);try{await o(i(s,`transactions`,t),{status:`settlement`},{merge:!0})}catch{x(!1)}},E=String(Math.floor(S/60)).padStart(2,`0`),D=String(S%60).padStart(2,`0`);if(v)return(0,d.jsxs)(`div`,{className:`qr-loader`,children:[(0,d.jsx)(`div`,{className:`qr-spinner`}),(0,d.jsx)(`span`,{children:`Menyiapkan QRIS…`})]});let O=r===`pending`,k=r===`settlement`||r===`success`,A=S===0&&O;return(0,d.jsx)(`div`,{className:`qr-wrap`,children:(0,d.jsxs)(`div`,{className:`qr-card`,children:[(0,d.jsxs)(`div`,{className:`qr-header`,children:[(0,d.jsxs)(`button`,{className:`qr-btn-back`,onClick:()=>e(`/dashboard`),children:[(0,d.jsx)(`i`,{className:`fa-solid fa-arrow-left`}),` Kembali`]}),(0,d.jsxs)(`div`,{className:`qr-header-title`,children:[(0,d.jsx)(`i`,{className:`fa-solid fa-qrcode`}),`Pembayaran QRIS`]}),(0,d.jsx)(`div`,{style:{width:80}}),` `]}),(0,d.jsxs)(`div`,{className:`qr-body`,children:[(0,d.jsxs)(`div`,{className:`qr-info-strip`,children:[(0,d.jsxs)(`div`,{className:`qr-info-item`,children:[(0,d.jsx)(`span`,{className:`qr-info-label`,children:`Pembayar`}),(0,d.jsx)(`span`,{className:`qr-info-val`,children:g?.displayName||`Klien`})]}),(0,d.jsx)(`div`,{className:`qr-info-sep`}),(0,d.jsxs)(`div`,{className:`qr-info-item`,children:[(0,d.jsx)(`span`,{className:`qr-info-label`,children:`Total`}),(0,d.jsx)(`span`,{className:`qr-info-val qr-info-amount`,children:h})]}),(0,d.jsx)(`div`,{className:`qr-info-sep`}),(0,d.jsxs)(`div`,{className:`qr-info-item`,children:[(0,d.jsx)(`span`,{className:`qr-info-label`,children:`ID Transaksi`}),(0,d.jsx)(`code`,{className:`qr-info-code`,children:t})]})]}),(0,d.jsxs)(`div`,{className:`qr-box-wrap`,children:[k&&(0,d.jsxs)(`div`,{className:`qr-success-overlay`,children:[(0,d.jsx)(`i`,{className:`fa-solid fa-circle-check`}),(0,d.jsx)(`span`,{children:`Pembayaran Diterima!`})]}),A&&(0,d.jsxs)(`div`,{className:`qr-expired-overlay`,children:[(0,d.jsx)(`i`,{className:`fa-solid fa-clock`}),(0,d.jsx)(`span`,{children:`QR Kedaluwarsa`})]}),(0,d.jsxs)(`div`,{className:`qr-box`,children:[(0,d.jsxs)(`svg`,{viewBox:`0 0 200 200`,xmlns:`http://www.w3.org/2000/svg`,className:`qr-svg`,children:[(0,d.jsx)(`rect`,{x:`10`,y:`10`,width:`55`,height:`55`,rx:`6`,fill:`none`,stroke:`#1e1b4b`,strokeWidth:`5`}),(0,d.jsx)(`rect`,{x:`20`,y:`20`,width:`35`,height:`35`,rx:`3`,fill:`#1e1b4b`}),(0,d.jsx)(`rect`,{x:`135`,y:`10`,width:`55`,height:`55`,rx:`6`,fill:`none`,stroke:`#1e1b4b`,strokeWidth:`5`}),(0,d.jsx)(`rect`,{x:`145`,y:`20`,width:`35`,height:`35`,rx:`3`,fill:`#1e1b4b`}),(0,d.jsx)(`rect`,{x:`10`,y:`135`,width:`55`,height:`55`,rx:`6`,fill:`none`,stroke:`#1e1b4b`,strokeWidth:`5`}),(0,d.jsx)(`rect`,{x:`20`,y:`145`,width:`35`,height:`35`,rx:`3`,fill:`#1e1b4b`}),[75,85,95,105,115,125].map((e,t)=>[10,20,30,40,50,60,70,80,90].map((n,r)=>(t+r)%3==0?null:(0,d.jsx)(`rect`,{x:e,y:n,width:`8`,height:`8`,fill:`#1e1b4b`,rx:`1`},`${t}-${r}`))),[10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180].map((e,t)=>[75,85,95,105,115,125,135,145,155,165,175,185].map((n,r)=>(t*3+r*7)%5==0?null:(0,d.jsx)(`rect`,{x:e,y:n,width:`8`,height:`8`,fill:`#1e1b4b`,rx:`1`},`d-${t}-${r}`))),(0,d.jsx)(`rect`,{x:`82`,y:`82`,width:`36`,height:`36`,rx:`8`,fill:`#8b5cf6`}),(0,d.jsx)(`text`,{x:`100`,y:`105`,textAnchor:`middle`,fill:`#fff`,fontSize:`14`,fontWeight:`700`,children:`S`})]}),(0,d.jsx)(`p`,{className:`qr-scan-hint`,children:`Scan dengan aplikasi mobile banking / dompet digital`})]})]}),(0,d.jsxs)(`div`,{className:`qr-status-row`,children:[(0,d.jsxs)(`div`,{className:`qr-badge ${O?`qr-badge-pending`:`qr-badge-success`}`,children:[(0,d.jsx)(`span`,{className:`qr-badge-dot ${O?`qr-dot-pulse`:``}`}),O?`MENUNGGU PEMBAYARAN`:`LUNAS`]}),O&&!A&&(0,d.jsxs)(`div`,{className:`qr-countdown`,children:[(0,d.jsx)(`i`,{className:`fa-regular fa-clock`}),`Berlaku `,E,`:`,D]})]}),O&&(0,d.jsxs)(`div`,{className:`qr-sim-box`,children:[(0,d.jsxs)(`div`,{className:`qr-sim-header`,children:[(0,d.jsx)(`i`,{className:`fa-solid fa-flask`}),` Sandbox Simulator`]}),(0,d.jsx)(`p`,{className:`qr-sim-desc`,children:`Tekan tombol di bawah untuk mensimulasikan callback Midtrans Webhook. Status di Firestore akan diperbarui secara real-time.`}),(0,d.jsx)(`button`,{className:`qr-btn-sim`,onClick:T,disabled:b||A,children:b?(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(`span`,{className:`qr-spinner-sm`}),` Memproses…`]}):(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(`i`,{className:`fa-solid fa-bolt`}),` Simulasikan Bayar Sukses`]})})]}),(0,d.jsx)(`div`,{className:`qr-steps`,children:[[`fa-mobile-screen-button`,`Buka aplikasi`,`Mobile banking atau dompet digital (GoPay, OVO, Dana, dll.)`],[`fa-camera`,`Scan QR Code`,`Arahkan kamera ke kode QRIS di atas`],[`fa-check-double`,`Konfirmasi pembayaran`,`Periksa nominal ${h}, lalu konfirmasi`],[`fa-bell`,`Notifikasi otomatis`,`Halaman ini akan otomatis update setelah pembayaran diterima`]].map(([e,t,n],r)=>(0,d.jsxs)(`div`,{className:`qr-step-item`,children:[(0,d.jsx)(`div`,{className:`qr-step-num`,children:r+1}),(0,d.jsx)(`div`,{className:`qr-step-ico`,children:(0,d.jsx)(`i`,{className:`fa-solid ${e}`})}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`p`,{className:`qr-step-title`,children:t}),(0,d.jsx)(`p`,{className:`qr-step-desc`,children:n})]})]},r))})]})]})})}var m=`
.qr-loader {
  min-height: 60vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 16px; color: var(--text-dim);
  font-family: 'Outfit', sans-serif; font-size: 0.85rem; letter-spacing: 0.06em;
}
.qr-spinner {
  width: 36px; height: 36px; border-radius: 50%;
  border: 2.5px solid var(--gborder);
  border-top-color: var(--accent);
  animation: qrSpin 0.8s linear infinite;
}
.qr-spinner-sm {
  display: inline-block;
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  animation: qrSpin 0.7s linear infinite;
}
@keyframes qrSpin { to { transform: rotate(360deg); } }

.qr-wrap {
  min-height: 100vh;
  display: flex; align-items: flex-start; justify-content: center;
  padding: 40px 16px 80px;
  background: var(--bg);
  font-family: 'Outfit', sans-serif;
}

.qr-card {
  width: 100%; max-width: 520px;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 24px; overflow: hidden;
}

/* ── Header ── */
.qr-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid var(--border);
}
.qr-btn-back {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--text-dim);
  transition: all 0.25s;
}
.qr-btn-back:hover { color: var(--text); border-color: var(--gborder2); }
.qr-header-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.82rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text);
}
.qr-header-title i { color: var(--accent3); }

/* ── Body ── */
.qr-body {
  padding: 28px 24px;
  display: flex; flex-direction: column; gap: 22px;
}

/* ── Info strip ── */
.qr-info-strip {
  display: flex; align-items: center;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 14px; padding: 14px 20px;
  gap: 0;
}
.qr-info-item {
  flex: 1; display: flex; flex-direction: column; gap: 3px;
}
.qr-info-label {
  font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text-dim);
}
.qr-info-val { font-size: 0.82rem; color: var(--text); font-weight: 500; }
.qr-info-amount { color: var(--accent3); font-weight: 700; font-size: 0.92rem; }
.qr-info-code {
  font-size: 0.72rem; color: var(--accent3);
  background: rgba(139,92,246,0.1);
  padding: 2px 7px; border-radius: 5px;
  font-family: monospace;
}
.qr-info-sep {
  width: 1px; height: 36px; background: var(--border);
  margin: 0 16px; flex-shrink: 0;
}

/* ── QR Box ── */
.qr-box-wrap { position: relative; }
.qr-box {
  background: #fff;
  border-radius: 20px; padding: 24px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  border: 1px solid var(--gborder);
}
.qr-svg { width: 200px; height: 200px; }
.qr-scan-hint {
  font-size: 0.7rem; color: #64748b;
  text-align: center; margin: 0; line-height: 1.5;
}
.qr-success-overlay, .qr-expired-overlay {
  position: absolute; inset: 0; z-index: 5;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; border-radius: 20px;
  font-size: 0.9rem; font-weight: 700; letter-spacing: 0.06em;
}
.qr-success-overlay {
  background: rgba(16,185,129,0.92);
  color: #fff;
}
.qr-success-overlay i { font-size: 2.5rem; }
.qr-expired-overlay {
  background: rgba(15,23,42,0.85);
  color: var(--text-dim);
}
.qr-expired-overlay i { font-size: 2rem; color: #f59e0b; }

/* ── Status row ── */
.qr-status-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; flex-wrap: wrap;
}
.qr-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px; border-radius: 99px;
  font-size: 0.68rem; font-weight: 800; letter-spacing: 0.12em;
}
.qr-badge-pending {
  background: rgba(245,158,11,0.1); color: #f59e0b;
  border: 1px solid rgba(245,158,11,0.25);
}
.qr-badge-success {
  background: rgba(16,185,129,0.1); color: #10b981;
  border: 1px solid rgba(16,185,129,0.25);
}
.qr-badge-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
  background: currentColor;
}
.qr-dot-pulse { animation: qrPulse 1.4s ease-in-out infinite; }
@keyframes qrPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
}
.qr-countdown {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.78rem; color: var(--text-dim);
  font-variant-numeric: tabular-nums;
}

/* ── Simulator ── */
.qr-sim-box {
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 16px; padding: 18px 20px;
  display: flex; flex-direction: column; gap: 10px;
}
.qr-sim-header {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text-dim);
  display: flex; align-items: center; gap: 7px;
}
.qr-sim-header i { color: #f59e0b; }
.qr-sim-desc {
  font-size: 0.76rem; color: var(--text-dim);
  line-height: 1.65; margin: 0;
}
.qr-btn-sim {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 12px;
  background: #10b981; color: #fff;
  border: none; border-radius: 10px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em;
  transition: all 0.25s;
}
.qr-btn-sim:hover:not(:disabled) { background: #059669; transform: translateY(-1px); }
.qr-btn-sim:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Steps ── */
.qr-steps {
  display: flex; flex-direction: column; gap: 2px;
  border-top: 1px solid var(--border);
  padding-top: 20px;
}
.qr-step-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 10px 0;
}
.qr-step-num {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  background: var(--glass2); border: 1px solid var(--gborder);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem; font-weight: 800; color: var(--text-dim);
  margin-top: 2px;
}
.qr-step-ico {
  width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
  background: rgba(139,92,246,0.08);
  border: 1px solid rgba(139,92,246,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem; color: var(--accent3);
}
.qr-step-title {
  font-size: 0.8rem; font-weight: 700; color: var(--text);
  margin: 0 0 2px;
}
.qr-step-desc {
  font-size: 0.72rem; color: var(--text-dim);
  margin: 0; line-height: 1.55;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .qr-wrap { padding: 20px 12px 60px; }
  .qr-card { border-radius: 20px; }
  .qr-body { padding: 20px 16px; }
  .qr-info-strip { flex-direction: column; gap: 12px; }
  .qr-info-sep { width: 100%; height: 1px; margin: 0; }
}
`;export{p as default};