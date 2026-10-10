import{a as e,i as t,r as n,t as r}from"./index-ngWTQpDX.js";import{a as i,c as a,f as o,i as ee,l as s,n as c,r as l,t as u,u as d}from"./firebase-DcjwoJha.js";var f=e(t(),1),p=r(),m=[{value:`individu`,label:`Pribadi / Individu`,icon:`fa-user`},{value:`bisnis`,label:`Bisnis / Brand / UMKM`,icon:`fa-briefcase`},{value:`organisasi`,label:`Sekolah / Kampus / Komunitas`,icon:`fa-building-columns`},{value:`pasangan`,label:`Pasangan (Wedding)`,icon:`fa-heart`},{value:`kreator`,label:`Kreator Konten / Influencer`,icon:`fa-video`}],h=[{value:`web`,label:`Web Design & Development`,icon:`fa-globe`,desc:`Website, landing page, undangan digital`},{value:`video`,label:`Video Editing`,icon:`fa-film`,desc:`Editing, color grading, montase`},{value:`motion`,label:`Motion Graphic`,icon:`fa-wand-magic-sparkles`,desc:`Animasi, intro, overlay streaming`},{value:`desain`,label:`Ilustrasi & Desain Grafis`,icon:`fa-palette`,desc:`Poster, logo, thumbnail, cetak`},{value:`fotovideo`,label:`Fotografi & Videografi`,icon:`fa-camera`,desc:`Sesi foto/video, dokumentasi event`},{value:`livestream`,label:`Live Streaming & Broadcast`,icon:`fa-tower-broadcast`,desc:`Siaran langsung, overlay, scoreboard`}],g=[`Di bawah Rp 300.000`,`Rp 300.000 – Rp 750.000`,`Rp 750.000 – Rp 2.000.000`,`Rp 2.000.000 – Rp 5.000.000`,`Di atas Rp 5.000.000`,`Fleksibel / ingin diskusi dulu`],_=[`Sangat mendesak (< 3 hari)`,`1 minggu`,`2–4 minggu`,`Lebih dari sebulan / santai`],v=[`Instagram`,`Rekomendasi teman / kenalan`,`GitHub / website langsung`,`Lainnya`],te={web:{q1:{label:`Jenis website yang dibutuhkan`,options:[`Website portofolio personal`,`Undangan pernikahan digital`,`Landing page / profil bisnis`,`Lainnya`]},q2:{label:`Status domain & hosting`,options:[`Belum sama sekali — butuh saran`,`Sudah punya, tinggal pasang`,`Belum, tapi mau ngurusin sendiri`]},q3:{label:`Fitur khusus yang diinginkan`,multi:!0,options:[`Form RSVP / kontak tamu`,`Integrasi musik / audio`,`Animasi / interaktif`,`Galeri foto/video`,`Integrasi bot / notifikasi`,`Tidak tahu, serahkan ke kamu`]},q4:{label:`Referensi desain (link, screenshot, atau deskripsi)`,type:`textarea`}},video:{q1:{label:`Jenis konten video`,options:[`Film pendek / dokumenter`,`Video promosi / iklan`,`Konten media sosial (Reels, TikTok, YouTube)`,`Video event / dokumentasi acara`,`Company profile / profil lembaga`]},q2:{label:`Status footage/materi video`,options:[`Sudah ada, tinggal diedit`,`Belum — butuh shooting juga`,`Sebagian ada, sebagian perlu tambahan`]},q3:{label:`Target platform tayang`,multi:!0,options:[`YouTube`,`Instagram / TikTok`,`Presentasi / internal`,`Ditayangkan di event/layar`]},q4:{label:`Perkiraan durasi video akhir yang diinginkan`,type:`text`,placeholder:`Contoh: 2–3 menit`}},motion:{q1:{label:`Jenis motion graphic`,options:[`Intro / outro YouTube / video`,`Animasi teks / lower third`,`Infografis bergerak`,`Overlay live streaming`,`Animasi logo / bumper`]},q2:{label:`Format output yang dibutuhkan`,options:[`Dengan background (MP4)`,`Transparan / overlay (WebM / MOV alpha)`,`Keduanya`]},q3:{label:`Referensi gaya visual`,type:`textarea`,placeholder:`Minimalis, dinamis, elegan, futuristik...`}},desain:{q1:{label:`Jenis desain`,options:[`Poster (promosi, event, edukasi)`,`Thumbnail YouTube / konten sosmed`,`Logo & identitas brand`,`Infografis / presentasi visual`,`Desain cetak (spanduk, brosur, dll)`]},q2:{label:`Format output yang dibutuhkan`,options:[`Digital saja (PNG, JPG)`,`Siap cetak (resolusi tinggi / PDF)`,`Keduanya`]},q3:{label:`Referensi warna, gaya, atau brand guideline`,type:`textarea`,placeholder:`Ceritakan atau tempel link referensi...`}},fotovideo:{q1:{label:`Jenis sesi`,options:[`Foto portrait / personal branding`,`Dokumentasi event / acara`,`Video sinematik pernikahan / wisuda`,`Konten produk / komersial`]},q2:{label:`Lokasi pengambilan gambar`,type:`text`,placeholder:`Kota / kabupaten...`},q3:{label:`Post-processing / editing`,options:[`Ya, butuh editing juga`,`Tidak, hanya pengambilan gambar`,`Belum tahu, diskusikan dulu`]},q4:{label:`Tanggal yang sudah ditargetkan (opsional)`,type:`text`,placeholder:`Contoh: Agustus 2025`}},livestream:{q1:{label:`Jenis event`,options:[`Event olahraga (pertandingan, kompetisi)`,`Acara sekolah / kampus / wisuda`,`Seminar / webinar`,`Pernikahan / acara keluarga`,`Lainnya`]},q2:{label:`Lokasi event`,type:`text`,placeholder:`Kota / kabupaten...`},q3:{label:`Perkiraan durasi siaran`,type:`text`,placeholder:`Contoh: 4 jam`},q4:{label:`Butuh desain grafis siaran?`,options:[`Ya, butuh paket lengkap (overlay, lower third, dll)`,`Tidak, sudah ada desainnya`,`Belum tahu`]}}},y=5;function b({t:e={}}){let t=n(),r=(0,f.useRef)([]),b=(0,f.useRef)(null),[S,C]=(0,f.useState)(1),[w,T]=(0,f.useState)(`forward`),[E,D]=(0,f.useState)(!0),[O,k]=(0,f.useState)({name:``,email:``,whatsapp:``,clientType:``,service:``,branch:{},budget:``,deadline:``,story:``,referral:``}),[A,j]=(0,f.useState)({}),[M,N]=(0,f.useState)(`idle`),[P,F]=(0,f.useState)(``),[I,L]=(0,f.useState)(!1),[R,z]=(0,f.useState)({nama:``,hp:``,email:``,kebutuhan:``,hari:7}),[B,V]=(0,f.useState)({}),[H,U]=(0,f.useState)(!1),[W,G]=(0,f.useState)(``),[ne,K]=(0,f.useState)(null),q=(e,t)=>z(n=>({...n,[e]:t})),J=()=>{let e={};return R.nama.trim()||(e.nama=`Nama wajib diisi.`),R.hp.trim()||(e.hp=`Nomor HP wajib diisi.`),R.email.trim()?/\S+@\S+\.\S+/.test(R.email)||(e.email=`Format email tidak valid.`):e.email=`Email wajib diisi.`,R.kebutuhan.trim()||(e.kebutuhan=`Ceritakan kebutuhanmu singkat.`),e},Y=async()=>{let e=J();if(Object.keys(e).length){V(e);return}G(``),U(!0);try{K((await l(ee(c,`inquiries`),{nama:R.nama,hp:R.hp,email:R.email,kebutuhan:R.kebutuhan,hari:R.hari,status:`pre_inquiry`,createdAt:a()})).id),L(!0),setTimeout(()=>{b.current&&b.current.scrollIntoView({behavior:`smooth`,block:`start`})},100)}catch(e){console.error(e),G(`Gagal menyimpan data. Coba lagi.`)}finally{U(!1)}},X=e=>{e&&!r.current.includes(e)&&r.current.push(e)};(0,f.useEffect)(()=>{let e=new IntersectionObserver(e=>e.forEach(e=>{e.isIntersecting&&e.target.classList.add(`visible`)}),{threshold:.08,rootMargin:`0px 0px -30px 0px`}),t=setTimeout(()=>{r.current.forEach(t=>{t&&e.observe(t)})},50);return()=>{clearTimeout(t),e.disconnect()}},[]);let Z=(e,t=`forward`)=>{T(t),D(!1),setTimeout(()=>{C(e),j({}),D(!0),b.current&&b.current.scrollIntoView({behavior:`smooth`,block:`start`})},280)},Q=(e,t)=>k(n=>({...n,[e]:t})),$=(e,t)=>k(n=>({...n,branch:{...n.branch,[e]:t}})),re=(e,t)=>{k(n=>{let r=n.branch[e]||[],i=r.includes(t)?r.filter(e=>e!==t):[...r,t];return{...n,branch:{...n.branch,[e]:i}}})},ie=()=>{let e={};return S===1&&(O.name.trim()||(e.name=`Nama wajib diisi.`),O.email.trim()?/\S+@\S+\.\S+/.test(O.email)||(e.email=`Format email tidak valid.`):e.email=`Email wajib diisi.`,O.whatsapp.trim()||(e.whatsapp=`Nomor WhatsApp wajib diisi.`),O.clientType||(e.clientType=`Pilih salah satu.`)),S===2&&(O.service||(e.service=`Pilih layanan terlebih dahulu.`)),S===4&&(O.budget||(e.budget=`Pilih kisaran budget.`),O.deadline||(e.deadline=`Pilih target deadline.`)),e},ae=()=>{let e=ie();if(Object.keys(e).length){j(e);return}Z(S+1,`forward`)},oe=()=>Z(S-1,`back`),se=async()=>{N(`loading`),F(``);try{let e=(await o(u,new d)).user,n={uid:e.uid,displayName:e.displayName,email:e.email,photoURL:e.photoURL,contactName:O.name,contactEmail:O.email,whatsapp:O.whatsapp,clientType:O.clientType,service:O.service,branch:O.branch,budget:O.budget,deadline:O.deadline,story:O.story,referral:O.referral,status:`pending_review`,createdAt:a()};await s(i(c,`users`,e.uid),n,{merge:!0}),N(`success`),setTimeout(()=>t(`/dashboard`),800)}catch(e){console.error(e),F(e.message||`Terjadi kesalahan saat login. Coba lagi.`),N(`error`)}},ce=[`Perkenalan`,`Layanan`,`Detail`,`Anggaran`,`Cerita`],le=te[O.service]||{},ue=(e,t)=>{if(!t)return null;if(t.type===`textarea`)return(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsx)(`label`,{className:`cq-field-label`,children:t.label}),(0,p.jsx)(`textarea`,{className:`cq-field-input cq-field-textarea`,placeholder:t.placeholder||``,value:O.branch[e]||``,onChange:t=>$(e,t.target.value)})]},e);if(t.type===`text`)return(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsx)(`label`,{className:`cq-field-label`,children:t.label}),(0,p.jsx)(`input`,{type:`text`,className:`cq-field-input`,placeholder:t.placeholder||``,value:O.branch[e]||``,onChange:t=>$(e,t.target.value)})]},e);if(t.multi){let n=O.branch[e]||[];return(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsxs)(`label`,{className:`cq-field-label`,children:[t.label,` `,(0,p.jsx)(`span`,{className:`cq-multi-hint`,children:`(bisa pilih beberapa)`})]}),(0,p.jsx)(`div`,{className:`cq-pill-grid`,children:t.options.map(t=>(0,p.jsxs)(`button`,{type:`button`,className:`cq-pill ${n.includes(t)?`cq-pill-active`:``}`,onClick:()=>re(e,t),children:[n.includes(t)&&(0,p.jsx)(`i`,{className:`fa-solid fa-check`,style:{fontSize:`0.6rem`}}),t]},t))})]},e)}return(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsx)(`label`,{className:`cq-field-label`,children:t.label}),(0,p.jsx)(`div`,{className:`cq-pill-grid`,children:t.options.map(t=>(0,p.jsx)(`button`,{type:`button`,className:`cq-pill ${O.branch[e]===t?`cq-pill-active`:``}`,onClick:()=>$(e,t),children:t},t))})]},e)};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(`style`,{children:x}),(0,p.jsxs)(`div`,{className:`cq-page`,children:[(0,p.jsxs)(`div`,{className:`cq-hero`,children:[(0,p.jsx)(`div`,{className:`cq-hero-orb cq-orb-1`}),(0,p.jsx)(`div`,{className:`cq-hero-orb cq-orb-2`}),(0,p.jsx)(`div`,{className:`cq-hero-orb cq-orb-3`}),(0,p.jsxs)(`div`,{className:`cq-hero-inner`,children:[(0,p.jsx)(`span`,{ref:X,className:`cq-page-label reveal`,children:`MULAI PROYEK`}),(0,p.jsxs)(`h1`,{ref:X,className:`cq-hero-title reveal rv-d1`,children:[(0,p.jsx)(`span`,{children:`Ceritakan`}),(0,p.jsx)(`br`,{}),(0,p.jsx)(`em`,{children:`Proyekmu.`})]}),(0,p.jsx)(`p`,{ref:X,className:`cq-hero-sub reveal rv-d2`,children:`Jawab beberapa pertanyaan singkat, aku akan pahami kebutuhanmu dan siapkan solusi terbaik.`})]}),(0,p.jsxs)(`div`,{ref:X,className:`cq-scroll-hint reveal rv-d3`,children:[(0,p.jsx)(`span`,{children:`Mulai di sini`}),(0,p.jsx)(`i`,{className:`fa-solid fa-arrow-down`})]})]}),!I&&(0,p.jsx)(`div`,{className:`cq-pregate`,children:(0,p.jsxs)(`div`,{className:`cq-pregate-inner`,children:[(0,p.jsxs)(`div`,{className:`cq-pregate-head`,children:[(0,p.jsx)(`span`,{className:`cq-step-badge`,children:`SEBELUM LANJUT`}),(0,p.jsxs)(`h2`,{className:`cq-step-title`,children:[`Isi dulu `,(0,p.jsx)(`em`,{children:`info singkat kamu.`})]}),(0,p.jsx)(`p`,{className:`cq-step-desc`,children:`Biar aku bisa langsung tahu siapa kamu dan apa yang kamu butuhkan — tanpa perlu login dulu.`})]}),(0,p.jsxs)(`div`,{className:`cq-fields`,children:[(0,p.jsxs)(`div`,{className:`cq-field-row`,children:[(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsx)(`label`,{className:`cq-field-label`,children:`Nama *`}),(0,p.jsx)(`input`,{type:`text`,className:`cq-field-input ${B.nama?`cq-field-error`:``}`,placeholder:`Nama kamu`,value:R.nama,onChange:e=>q(`nama`,e.target.value)}),B.nama&&(0,p.jsx)(`span`,{className:`cq-err-msg`,children:B.nama})]}),(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsx)(`label`,{className:`cq-field-label`,children:`Nomor HP / WhatsApp *`}),(0,p.jsxs)(`div`,{className:`cq-input-prefix-wrap`,children:[(0,p.jsx)(`span`,{className:`cq-input-prefix`,children:`+62`}),(0,p.jsx)(`input`,{type:`tel`,className:`cq-field-input cq-field-prefixed ${B.hp?`cq-field-error`:``}`,placeholder:`812-3456-7890`,value:R.hp,onChange:e=>q(`hp`,e.target.value)})]}),B.hp&&(0,p.jsx)(`span`,{className:`cq-err-msg`,children:B.hp})]})]}),(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsx)(`label`,{className:`cq-field-label`,children:`Email *`}),(0,p.jsx)(`input`,{type:`email`,className:`cq-field-input ${B.email?`cq-field-error`:``}`,placeholder:`nama@email.com`,value:R.email,onChange:e=>q(`email`,e.target.value)}),B.email&&(0,p.jsx)(`span`,{className:`cq-err-msg`,children:B.email})]}),(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsxs)(`label`,{className:`cq-field-label`,children:[`Kebutuhan kamu apa? * `,(0,p.jsx)(`span`,{className:`cq-multi-hint`,children:`(singkat aja)`})]}),(0,p.jsx)(`textarea`,{className:`cq-field-input cq-field-textarea ${B.kebutuhan?`cq-field-error`:``}`,placeholder:`Contoh: mau bikin website portofolio, atau edit video tugas sekolah, atau desain poster lomba...`,value:R.kebutuhan,onChange:e=>q(`kebutuhan`,e.target.value)}),B.kebutuhan&&(0,p.jsx)(`span`,{className:`cq-err-msg`,children:B.kebutuhan})]}),(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsxs)(`label`,{className:`cq-field-label`,children:[`Butuh selesai dalam berapa hari?`,(0,p.jsxs)(`span`,{className:`cq-slider-val`,children:[R.hari,` hari`]})]}),(0,p.jsxs)(`div`,{className:`cq-slider-wrap`,children:[(0,p.jsx)(`span`,{className:`cq-slider-tick`,children:`1`}),(0,p.jsx)(`input`,{type:`range`,min:`1`,max:`60`,step:`1`,className:`cq-slider`,value:R.hari,onChange:e=>q(`hari`,Number(e.target.value))}),(0,p.jsx)(`span`,{className:`cq-slider-tick`,children:`60`})]}),(0,p.jsxs)(`div`,{className:`cq-slider-labels`,children:[(0,p.jsx)(`span`,{className:R.hari<=3?`cq-sl-active`:``,children:`🔥 Mendesak`}),(0,p.jsx)(`span`,{className:R.hari>3&&R.hari<=14?`cq-sl-active`:``,children:`⚡ Normal`}),(0,p.jsx)(`span`,{className:R.hari>14&&R.hari<=30?`cq-sl-active`:``,children:`🌿 Santai`}),(0,p.jsx)(`span`,{className:R.hari>30?`cq-sl-active`:``,children:`☁️ Fleksibel`})]})]}),W&&(0,p.jsxs)(`div`,{className:`cq-global-err`,style:{marginBottom:16},children:[(0,p.jsx)(`i`,{className:`fa-solid fa-triangle-exclamation`}),` `,W]}),(0,p.jsxs)(`button`,{type:`button`,className:`cq-btn-pregate`,onClick:Y,disabled:H,children:[H?(0,p.jsx)(`span`,{className:`cq-spinner`}):(0,p.jsx)(`i`,{className:`fa-solid fa-arrow-right`}),(0,p.jsx)(`span`,{children:H?`Menyimpan...`:`Lanjut ke proses pengerjaan`})]})]})]})}),I?(0,p.jsxs)(`div`,{className:`cq-body`,ref:b,children:[(0,p.jsxs)(`div`,{ref:X,className:`cq-left reveal`,children:[(0,p.jsx)(`div`,{className:`cq-steps-track`,children:ce.map((e,t)=>{let n=t+1,r=S>n;return(0,p.jsxs)(`div`,{className:`cq-step-item ${S===n?`cq-step-active`:``} ${r?`cq-step-done`:``}`,children:[(0,p.jsx)(`div`,{className:`cq-step-dot`,children:r?(0,p.jsx)(`i`,{className:`fa-solid fa-check`,style:{fontSize:`0.62rem`}}):(0,p.jsx)(`span`,{children:n})}),(0,p.jsxs)(`div`,{className:`cq-step-info`,children:[(0,p.jsxs)(`span`,{className:`cq-step-num`,children:[`Step `,n]}),(0,p.jsx)(`span`,{className:`cq-step-name`,children:e})]})]},n)})}),(0,p.jsxs)(`div`,{className:`cq-left-hint`,children:[(0,p.jsx)(`i`,{className:`fa-solid fa-lock`,style:{fontSize:`0.75rem`,color:`var(--accent3)`}}),(0,p.jsx)(`span`,{children:`Data kamu aman & hanya digunakan untuk memproses projekmu.`})]}),(0,p.jsxs)(`div`,{className:`cq-avail-badge`,children:[(0,p.jsx)(`span`,{className:`cq-avail-dot`}),(0,p.jsx)(`span`,{children:`Tersedia untuk proyek baru`})]})]}),(0,p.jsx)(`div`,{ref:X,className:`cq-right reveal rv-d1`,children:(0,p.jsxs)(`div`,{className:`cq-card`,children:[(0,p.jsx)(`div`,{className:`cq-card-glow`}),(0,p.jsx)(`div`,{className:`cq-card-line`}),(0,p.jsx)(`div`,{className:`cq-progress-bar-wrap`,children:(0,p.jsx)(`div`,{className:`cq-progress-bar`,style:{width:`${S/y*100}%`}})}),(0,p.jsxs)(`div`,{className:`cq-step-counter`,children:[(0,p.jsx)(`span`,{className:`cq-step-current`,children:S}),(0,p.jsx)(`span`,{className:`cq-step-sep`,children:` / `}),(0,p.jsx)(`span`,{className:`cq-step-total`,children:y})]}),(0,p.jsxs)(`div`,{className:`cq-step-body ${E?w===`forward`?`cq-enter-right`:`cq-enter-left`:`cq-exit`}`,children:[S===1&&(0,p.jsxs)(`div`,{className:`cq-step-content`,children:[(0,p.jsxs)(`div`,{className:`cq-step-head`,children:[(0,p.jsx)(`span`,{className:`cq-step-badge`,children:`01 — PERKENALAN`}),(0,p.jsxs)(`h2`,{className:`cq-step-title`,children:[`Siapa kamu `,(0,p.jsx)(`em`,{children:`dan dari mana?`})]}),(0,p.jsx)(`p`,{className:`cq-step-desc`,children:`Mari kita mulai dengan perkenalan singkat.`})]}),(0,p.jsxs)(`div`,{className:`cq-fields`,children:[(0,p.jsxs)(`div`,{className:`cq-field-row`,children:[(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsx)(`label`,{className:`cq-field-label`,children:`Nama Lengkap *`}),(0,p.jsx)(`input`,{type:`text`,className:`cq-field-input ${A.name?`cq-field-error`:``}`,placeholder:`Contoh: Budi Santoso`,value:O.name,onChange:e=>Q(`name`,e.target.value)}),A.name&&(0,p.jsx)(`span`,{className:`cq-err-msg`,children:A.name})]}),(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsx)(`label`,{className:`cq-field-label`,children:`Alamat Email Aktif *`}),(0,p.jsx)(`input`,{type:`email`,className:`cq-field-input ${A.email?`cq-field-error`:``}`,placeholder:`nama@email.com`,value:O.email,onChange:e=>Q(`email`,e.target.value)}),A.email&&(0,p.jsx)(`span`,{className:`cq-err-msg`,children:A.email})]})]}),(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsx)(`label`,{className:`cq-field-label`,children:`Nomor WhatsApp *`}),(0,p.jsxs)(`div`,{className:`cq-input-prefix-wrap`,children:[(0,p.jsx)(`span`,{className:`cq-input-prefix`,children:`+62`}),(0,p.jsx)(`input`,{type:`tel`,className:`cq-field-input cq-field-prefixed ${A.whatsapp?`cq-field-error`:``}`,placeholder:`812-3456-7890`,value:O.whatsapp,onChange:e=>Q(`whatsapp`,e.target.value)})]}),A.whatsapp&&(0,p.jsx)(`span`,{className:`cq-err-msg`,children:A.whatsapp})]}),(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsx)(`label`,{className:`cq-field-label`,children:`Kamu mewakili siapa? *`}),A.clientType&&(0,p.jsx)(`span`,{className:`cq-err-msg`,style:{marginBottom:6},children:A.clientType}),(0,p.jsx)(`div`,{className:`cq-type-grid`,children:m.map(e=>(0,p.jsxs)(`button`,{type:`button`,className:`cq-type-card ${O.clientType===e.value?`cq-type-active`:``}`,onClick:()=>Q(`clientType`,e.value),children:[(0,p.jsx)(`i`,{className:`fa-solid ${e.icon}`}),(0,p.jsx)(`span`,{children:e.label})]},e.value))})]})]})]}),S===2&&(0,p.jsxs)(`div`,{className:`cq-step-content`,children:[(0,p.jsxs)(`div`,{className:`cq-step-head`,children:[(0,p.jsx)(`span`,{className:`cq-step-badge`,children:`02 — LAYANAN`}),(0,p.jsxs)(`h2`,{className:`cq-step-title`,children:[`Apa yang paling `,(0,p.jsx)(`em`,{children:`kamu butuhkan?`})]}),(0,p.jsx)(`p`,{className:`cq-step-desc`,children:`Pilih satu layanan utama — pertanyaan selanjutnya akan menyesuaikan.`})]}),A.service&&(0,p.jsxs)(`div`,{className:`cq-global-err`,children:[(0,p.jsx)(`i`,{className:`fa-solid fa-triangle-exclamation`}),A.service]}),(0,p.jsx)(`div`,{className:`cq-service-grid`,children:h.map(e=>(0,p.jsxs)(`button`,{type:`button`,className:`cq-service-card ${O.service===e.value?`cq-service-active`:``}`,onClick:()=>{Q(`service`,e.value),Q(`branch`,{})},children:[(0,p.jsx)(`div`,{className:`cq-svc-icon-wrap`,children:(0,p.jsx)(`i`,{className:`fa-solid ${e.icon}`})}),(0,p.jsxs)(`div`,{className:`cq-svc-info`,children:[(0,p.jsx)(`span`,{className:`cq-svc-name`,children:e.label}),(0,p.jsx)(`span`,{className:`cq-svc-desc`,children:e.desc})]}),O.service===e.value&&(0,p.jsx)(`div`,{className:`cq-svc-check`,children:(0,p.jsx)(`i`,{className:`fa-solid fa-check`})})]},e.value))})]}),S===3&&(0,p.jsxs)(`div`,{className:`cq-step-content`,children:[(0,p.jsxs)(`div`,{className:`cq-step-head`,children:[(0,p.jsx)(`span`,{className:`cq-step-badge`,children:`03 — DETAIL`}),(0,p.jsxs)(`h2`,{className:`cq-step-title`,children:[`Ceritakan lebih `,(0,p.jsx)(`em`,{children:`spesifik.`})]}),(0,p.jsx)(`p`,{className:`cq-step-desc`,children:`Detail ini membantu aku mempersiapkan solusi yang tepat untuk proyekmu.`})]}),(0,p.jsxs)(`div`,{className:`cq-fields`,children:[Object.entries(le).map(([e,t])=>ue(e,t)),!O.service&&(0,p.jsxs)(`div`,{className:`cq-global-err`,children:[(0,p.jsx)(`i`,{className:`fa-solid fa-triangle-exclamation`}),`Kamu belum memilih layanan. Kembali ke Step 2.`]})]})]}),S===4&&(0,p.jsxs)(`div`,{className:`cq-step-content`,children:[(0,p.jsxs)(`div`,{className:`cq-step-head`,children:[(0,p.jsx)(`span`,{className:`cq-step-badge`,children:`04 — ANGGARAN`}),(0,p.jsxs)(`h2`,{className:`cq-step-title`,children:[`Budget & `,(0,p.jsx)(`em`,{children:`Timeline.`})]}),(0,p.jsx)(`p`,{className:`cq-step-desc`,children:`Biar aku bisa kasih solusi yang paling pas untukmu.`})]}),(0,p.jsxs)(`div`,{className:`cq-fields`,children:[(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsx)(`label`,{className:`cq-field-label`,children:`Perkiraan budget yang disiapkan *`}),A.budget&&(0,p.jsx)(`span`,{className:`cq-err-msg`,children:A.budget}),(0,p.jsx)(`div`,{className:`cq-budget-grid`,children:g.map(e=>(0,p.jsx)(`button`,{type:`button`,className:`cq-budget-card ${O.budget===e?`cq-budget-active`:``}`,onClick:()=>Q(`budget`,e),children:e},e))})]}),(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsx)(`label`,{className:`cq-field-label`,children:`Target deadline *`}),A.deadline&&(0,p.jsx)(`span`,{className:`cq-err-msg`,children:A.deadline}),(0,p.jsx)(`div`,{className:`cq-deadline-grid`,children:_.map(e=>(0,p.jsx)(`button`,{type:`button`,className:`cq-pill ${O.deadline===e?`cq-pill-active`:``}`,onClick:()=>Q(`deadline`,e),children:e},e))})]})]})]}),S===5&&(0,p.jsxs)(`div`,{className:`cq-step-content`,children:[(0,p.jsxs)(`div`,{className:`cq-step-head`,children:[(0,p.jsx)(`span`,{className:`cq-step-badge`,children:`05 — CERITA`}),(0,p.jsxs)(`h2`,{className:`cq-step-title`,children:[`Hampir selesai — `,(0,p.jsx)(`em`,{children:`ceritakan!`})]}),(0,p.jsx)(`p`,{className:`cq-step-desc`,children:`Bagian bebas. Makin detail, makin baik hasilnya.`})]}),(0,p.jsxs)(`div`,{className:`cq-fields`,children:[(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsx)(`label`,{className:`cq-field-label`,children:`Ceritakan proyekmu secara bebas`}),(0,p.jsx)(`textarea`,{className:`cq-field-input cq-field-textarea cq-field-textarea-lg`,placeholder:`Visi, konteks, hal unik yang perlu aku ketahui, referensi yang kamu suka, dll...`,value:O.story,onChange:e=>Q(`story`,e.target.value)})]}),(0,p.jsxs)(`div`,{className:`cq-field-group`,children:[(0,p.jsx)(`label`,{className:`cq-field-label`,children:`Dari mana kamu tahu tentang SynnnW?`}),(0,p.jsx)(`div`,{className:`cq-pill-grid`,children:v.map(e=>(0,p.jsx)(`button`,{type:`button`,className:`cq-pill ${O.referral===e?`cq-pill-active`:``}`,onClick:()=>Q(`referral`,e),children:e},e))})]}),(0,p.jsxs)(`div`,{className:`cq-submit-wrap`,children:[(0,p.jsxs)(`div`,{className:`cq-submit-note`,children:[(0,p.jsx)(`i`,{className:`fa-brands fa-google`}),(0,p.jsx)(`p`,{children:`Kamu akan login dengan Google untuk mengamankan data proyekmu dan memudahkan komunikasi selanjutnya.`})]}),P&&(0,p.jsxs)(`div`,{className:`cq-global-err`,children:[(0,p.jsx)(`i`,{className:`fa-solid fa-triangle-exclamation`}),P]}),(0,p.jsxs)(`button`,{type:`button`,className:`cq-btn-google`,onClick:se,disabled:M===`loading`||M===`success`,children:[M===`loading`&&(0,p.jsx)(`span`,{className:`cq-spinner`}),M===`success`&&(0,p.jsx)(`i`,{className:`fa-solid fa-check`}),M===`idle`||M===`error`?(0,p.jsx)(`i`,{className:`fa-brands fa-google`}):null,(0,p.jsx)(`span`,{children:M===`loading`?`Menyimpan...`:M===`success`?`Berhasil! Mengarahkan...`:`Selesai & Login dengan Google`})]})]})]})]})]}),(0,p.jsxs)(`div`,{className:`cq-nav`,children:[S>1&&(0,p.jsxs)(`button`,{type:`button`,className:`cq-btn-back`,onClick:oe,children:[(0,p.jsx)(`i`,{className:`fa-solid fa-arrow-left`}),`Kembali`]}),S<y&&(0,p.jsxs)(`button`,{type:`button`,className:`cq-btn-next`,onClick:ae,children:[`Lanjut`,(0,p.jsx)(`i`,{className:`fa-solid fa-arrow-right`})]})]})]})})]}):null]})]})}var x=`
/* ── Reveal ── */
.reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.65s ease, transform 0.65s ease; }
.reveal.visible { opacity: 1; transform: none; }
.rv-d1 { transition-delay: 0.1s; }
.rv-d2 { transition-delay: 0.2s; }
.rv-d3 { transition-delay: 0.3s; }

/* ── Page ── */
.cq-page {
  min-height: 100vh;
  background: var(--bg);
  padding-top: 64px;
}

/* ── Hero ── */
.cq-hero {
  position: relative;
  min-height: 56vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 80px 70px;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}
.cq-hero::after {
  content: '';
  position: absolute;
  bottom: 0; left: 80px; right: 80px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
  pointer-events: none;
}
.cq-hero-orb {
  position: absolute; border-radius: 50%;
  pointer-events: none; filter: blur(80px);
}
.cq-orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%);
  top: -120px; left: -100px;
}
.cq-orb-2 {
  width: 360px; height: 360px;
  background: radial-gradient(circle, rgba(167,139,250,0.09) 0%, transparent 65%);
  bottom: -80px; right: 10%;
}
.cq-orb-3 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%);
  top: 40%; left: 40%;
}
.cq-hero-inner { position: relative; z-index: 1; max-width: 640px; }
.cq-page-label {
  display: inline-block;
  font-size: 0.62rem; font-weight: 700; letter-spacing: 0.28em;
  text-transform: uppercase; color: var(--accent3);
  margin-bottom: 20px;
}
.cq-hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 300; line-height: 1.08;
  color: var(--text); margin: 0 0 20px;
  letter-spacing: -0.02em;
}
.cq-hero-title em { font-style: italic; color: var(--accent3); }
.cq-hero-sub {
  font-size: 1rem; color: var(--text-dim);
  line-height: 1.75; max-width: 480px; margin: 0;
}
.cq-scroll-hint {
  position: absolute; bottom: 28px; right: 80px;
  display: flex; align-items: center; gap: 10px;
  font-size: 0.66rem; font-weight: 600; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--text-dim);
}
.cq-scroll-hint i { animation: bounceDown 1.8s ease-in-out infinite; }
@keyframes bounceDown {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(5px); }
}

/* ── Body layout ── */
.cq-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: 100vh;
  border-bottom: 1px solid var(--border);
}

/* ── LEFT ── */
.cq-left {
  padding: 56px 36px;
  border-right: 1px solid var(--border);
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  overflow-y: auto;
  scrollbar-width: thin;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.cq-steps-track {
  display: flex; flex-direction: column; gap: 4px;
}
.cq-step-item {
  display: flex; align-items: center; gap: 14px;
  padding: 10px 14px; border-radius: 12px;
  transition: background 0.25s;
  opacity: 0.45;
}
.cq-step-item.cq-step-active,
.cq-step-item.cq-step-done { opacity: 1; }
.cq-step-item.cq-step-active { background: var(--glass); }

.cq-step-dot {
  width: 30px; height: 30px; flex-shrink: 0;
  border-radius: 50%; border: 1.5px solid var(--border2);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.66rem; font-weight: 700;
  color: var(--text-dim); background: var(--bg);
  transition: all 0.3s;
}
.cq-step-item.cq-step-active .cq-step-dot {
  border-color: var(--accent3);
  color: var(--accent3);
  background: rgba(139,92,246,0.08);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
}
.cq-step-item.cq-step-done .cq-step-dot {
  border-color: #4ade80;
  color: #4ade80;
  background: rgba(74,222,128,0.08);
}
.cq-step-info { display: flex; flex-direction: column; gap: 2px; }
.cq-step-num  { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-dim); }
.cq-step-name { font-size: 0.82rem; font-weight: 500; color: var(--text); }

.cq-left-hint {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 0.72rem; color: var(--text-dim); line-height: 1.6;
  padding: 14px; border: 1px solid var(--gborder);
  border-radius: 12px; background: var(--glass);
}
.cq-avail-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(74,222,128,0.06); border: 1px solid rgba(74,222,128,0.18);
  border-radius: 99px; padding: 8px 14px;
  width: fit-content;
  font-size: 0.72rem; font-weight: 600; color: rgba(74,222,128,0.9);
  letter-spacing: 0.05em;
}
[data-theme="light"] .cq-avail-badge {
  background: rgba(34,197,94,0.06); color: rgba(22,163,74,0.9);
  border-color: rgba(22,163,74,0.25);
}
.cq-avail-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #4ade80; flex-shrink: 0;
  animation: cqPulse 2s ease infinite;
}
@keyframes cqPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
  50%       { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
}

/* ── RIGHT ── */
.cq-right { padding: 56px 60px 80px; }

/* ── Card ── */
.cq-card {
  background: var(--glass);
  backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
  border: 1px solid var(--gborder);
  border-radius: 28px;
  padding: 0;
  position: relative; overflow: hidden;
  max-width: 680px; margin: 0 auto;
}
.cq-card-glow {
  position: absolute; top: -100px; right: -100px;
  width: 380px; height: 380px; border-radius: 50%;
  background: radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 65%);
  pointer-events: none;
}
.cq-card-line {
  position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(167,139,250,0.45), transparent);
}

/* ── Progress bar ── */
.cq-progress-bar-wrap {
  height: 3px;
  background: var(--glass2);
  border-radius: 99px 99px 0 0;
  overflow: hidden;
}
.cq-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent3));
  transition: width 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 99px;
}

/* ── Step counter ── */
.cq-step-counter {
  padding: 18px 36px 0;
  font-size: 0.62rem; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--text-dim);
}
.cq-step-current { color: var(--accent3); }

/* ── Step body animation ── */
.cq-step-body {
  padding: 28px 36px 0;
}
@keyframes enterRight {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes enterLeft {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes exitAnim {
  from { opacity: 1; }
  to   { opacity: 0; }
}
.cq-enter-right { animation: enterRight 0.3s ease forwards; }
.cq-enter-left  { animation: enterLeft  0.3s ease forwards; }
.cq-exit        { animation: exitAnim   0.25s ease forwards; }

/* ── Step head ── */
.cq-step-head { margin-bottom: 28px; }
.cq-step-badge {
  display: inline-block;
  font-size: 0.58rem; font-weight: 700; letter-spacing: 0.24em;
  text-transform: uppercase; color: var(--accent3);
  margin-bottom: 12px;
}
.cq-step-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 400; line-height: 1.15;
  color: var(--text); margin: 0 0 10px;
  letter-spacing: -0.01em;
}
.cq-step-title em { font-style: italic; color: var(--accent3); }
.cq-step-desc {
  font-size: 0.84rem; color: var(--text-dim);
  line-height: 1.7; margin: 0;
}

/* ── Fields ── */
.cq-fields { display: flex; flex-direction: column; gap: 22px; }
.cq-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.cq-field-group { display: flex; flex-direction: column; gap: 8px; }
.cq-field-label {
  font-size: 0.62rem; font-weight: 600; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--text-dim);
}
.cq-multi-hint { font-weight: 400; opacity: 0.7; text-transform: none; letter-spacing: 0; }
.cq-field-input {
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 12px; padding: 13px 16px;
  font-family: 'Outfit', sans-serif; font-size: 0.88rem;
  color: var(--text); outline: none;
  transition: border-color 0.28s, background 0.28s;
  backdrop-filter: blur(10px); width: 100%;
  box-sizing: border-box;
}
.cq-field-input::placeholder { color: var(--text-dim); opacity: 0.5; }
.cq-field-input:focus { border-color: var(--accent2); background: var(--glass3); }
.cq-field-error { border-color: rgba(239,68,68,0.6) !important; }
.cq-err-msg {
  font-size: 0.65rem; color: rgba(239,68,68,0.85);
  display: block; min-height: 16px;
}
.cq-field-textarea {
  resize: vertical; min-height: 110px; line-height: 1.65;
}
.cq-field-textarea-lg { min-height: 160px; }

/* Prefix input */
.cq-input-prefix-wrap { display: flex; position: relative; }
.cq-input-prefix {
  display: flex; align-items: center;
  padding: 0 14px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-right: none;
  border-radius: 12px 0 0 12px;
  font-size: 0.84rem; color: var(--text-dim);
  white-space: nowrap; flex-shrink: 0;
}
.cq-field-prefixed { border-radius: 0 12px 12px 0 !important; }

/* ── Client type grid ── */
.cq-type-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px;
}
.cq-type-card {
  display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
  padding: 14px 14px 12px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 14px; cursor: pointer; text-align: left;
  font-family: 'Outfit', sans-serif;
  font-size: 0.73rem; color: var(--text-dim);
  transition: all 0.25s; line-height: 1.4;
}
.cq-type-card i { font-size: 1.1rem; color: var(--text-dim); transition: color 0.25s; }
.cq-type-card:hover { border-color: var(--gborder2); color: var(--text); background: var(--glass3); }
.cq-type-active {
  background: rgba(139,92,246,0.1) !important;
  border-color: rgba(139,92,246,0.4) !important;
  color: var(--accent3) !important;
}
.cq-type-active i { color: var(--accent3) !important; }

/* ── Service grid ── */
.cq-service-grid {
  display: flex; flex-direction: column; gap: 10px;
}
.cq-service-card {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 18px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 16px; cursor: pointer; text-align: left;
  font-family: 'Outfit', sans-serif;
  transition: all 0.25s; position: relative;
}
.cq-service-card:hover { border-color: var(--gborder2); background: var(--glass3); }
.cq-service-active {
  background: rgba(139,92,246,0.1) !important;
  border-color: rgba(139,92,246,0.4) !important;
}
.cq-svc-icon-wrap {
  width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
  background: var(--glass); border: 1px solid var(--gborder);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; color: var(--text-dim);
  transition: all 0.25s;
}
.cq-service-active .cq-svc-icon-wrap {
  background: rgba(139,92,246,0.15);
  border-color: rgba(139,92,246,0.35);
  color: var(--accent3);
}
.cq-svc-info { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.cq-svc-name { font-size: 0.88rem; font-weight: 600; color: var(--text); }
.cq-svc-desc { font-size: 0.72rem; color: var(--text-dim); }
.cq-service-active .cq-svc-name { color: var(--accent3); }
.cq-svc-check {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.6rem; flex-shrink: 0;
}

/* ── Pills ── */
.cq-pill-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.cq-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 16px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem; color: var(--text-dim);
  transition: all 0.22s;
}
.cq-pill:hover { border-color: var(--gborder2); color: var(--text); }
.cq-pill-active {
  background: rgba(139,92,246,0.12) !important;
  border-color: rgba(139,92,246,0.4) !important;
  color: var(--accent3) !important;
}

/* ── Budget grid ── */
.cq-budget-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.cq-budget-card {
  padding: 12px 14px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 12px; cursor: pointer; text-align: left;
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem; color: var(--text-dim);
  transition: all 0.22s; line-height: 1.4;
}
.cq-budget-card:hover { border-color: var(--gborder2); color: var(--text); }
.cq-budget-active {
  background: rgba(139,92,246,0.12) !important;
  border-color: rgba(139,92,246,0.4) !important;
  color: var(--accent3) !important;
}
.cq-deadline-grid { display: flex; flex-wrap: wrap; gap: 8px; }

/* ── Global error ── */
.cq-global-err {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.78rem; color: rgba(239,68,68,0.85);
  background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2);
  border-radius: 12px; padding: 12px 16px;
  margin-bottom: 8px;
}

/* ── Submit ── */
.cq-submit-wrap { display: flex; flex-direction: column; gap: 14px; margin-top: 8px; }
.cq-submit-note {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 16px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 14px;
}
.cq-submit-note i { font-size: 1.1rem; color: var(--accent3); flex-shrink: 0; margin-top: 2px; }
.cq-submit-note p { font-size: 0.78rem; color: var(--text-dim); line-height: 1.65; margin: 0; }

.cq-btn-google {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%; padding: 17px;
  background: var(--accent); color: #fff;
  border: none; border-radius: 14px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  cursor: pointer; transition: all 0.35s;
  box-shadow: 0 8px 32px rgba(139,92,246,0.35);
}
.cq-btn-google:hover:not(:disabled) {
  background: var(--accent2); transform: translateY(-2px);
  box-shadow: 0 14px 44px rgba(139,92,246,0.48);
}
.cq-btn-google:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

/* Spinner */
.cq-spinner {
  display: inline-block;
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  animation: cqSpin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes cqSpin { to { transform: rotate(360deg); } }

/* ── Navigation ── */
.cq-nav {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 24px 36px 32px;
  margin-top: 8px;
  border-top: 1px solid var(--border);
}
.cq-btn-back {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 22px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-dim); transition: all 0.25s;
}
.cq-btn-back:hover { color: var(--text); border-color: var(--gborder2); }

.cq-btn-next {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 28px;
  background: var(--text); color: var(--bg);
  border: none; border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  transition: all 0.3s;
  margin-left: auto;
}
.cq-btn-next:hover {
  background: var(--accent); color: #fff;
  box-shadow: 0 8px 28px rgba(139,92,246,0.35);
  transform: translateY(-1px);
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .cq-hero { padding: 60px 40px 60px; }
  .cq-body { grid-template-columns: 1fr; }
  .cq-left {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding: 36px 40px;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 20px;
  }
  .cq-steps-track { flex-direction: row; flex-wrap: wrap; gap: 4px; }
  .cq-right { padding: 40px 40px 70px; }
}
@media (max-width: 768px) {
  .cq-hero { padding: 50px 24px 52px; min-height: auto; }
  .cq-scroll-hint { right: 24px; }
  .cq-left { padding: 28px 24px; }
  .cq-right { padding: 32px 18px 60px; }
  .cq-card { border-radius: 20px; }
  .cq-step-body { padding: 22px 22px 0; }
  .cq-nav { padding: 20px 22px 26px; }
  .cq-field-row { grid-template-columns: 1fr; }
  .cq-type-grid { grid-template-columns: 1fr 1fr; }
  .cq-budget-grid { grid-template-columns: 1fr; }
  .cq-step-counter { padding: 16px 22px 0; }
}
/* ── Pre-gate section ── */
.cq-pregate {
  display: flex;
  justify-content: center;
  padding: 72px 24px 100px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}
.cq-pregate-inner {
  width: 100%;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.cq-pregate-head { margin-bottom: 4px; }

.cq-btn-pregate {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  width: 100%; padding: 17px;
  background: var(--text); color: var(--bg);
  border: none; border-radius: 14px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.84rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  transition: all 0.35s; margin-top: 8px;
}
.cq-btn-pregate:hover:not(:disabled) {
  background: var(--accent); color: #fff;
  box-shadow: 0 8px 32px rgba(139,92,246,0.38);
  transform: translateY(-2px);
}
.cq-btn-pregate:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Slider ── */
.cq-slider-wrap {
  display: flex; align-items: center; gap: 12px;
  margin-top: 6px;
}
.cq-slider-tick {
  font-size: 0.66rem; color: var(--text-dim); font-weight: 600;
  flex-shrink: 0; width: 22px; text-align: center;
}
.cq-slider {
  -webkit-appearance: none; appearance: none;
  flex: 1; height: 4px; border-radius: 99px;
  background: var(--glass2); outline: none; cursor: pointer;
  border: 1px solid var(--gborder);
}
.cq-slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--accent); cursor: pointer;
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.25);
  transition: box-shadow 0.2s;
}
.cq-slider::-webkit-slider-thumb:hover { box-shadow: 0 0 0 5px rgba(139,92,246,0.3); }
.cq-slider::-moz-range-thumb {
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--accent); cursor: pointer;
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.25);
}
.cq-slider-val {
  margin-left: 10px;
  font-size: 0.78rem; font-weight: 700; color: var(--accent3);
  background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25);
  border-radius: 99px; padding: 2px 10px;
}
.cq-slider-labels {
  display: flex; justify-content: space-between;
  margin-top: 10px; padding: 0 2px;
}
.cq-slider-labels span {
  font-size: 0.65rem; color: var(--text-dim); font-weight: 500;
  transition: color 0.25s;
}
.cq-slider-labels .cq-sl-active { color: var(--accent3); font-weight: 700; }

@media (max-width: 768px) {
  .cq-pregate { padding: 48px 18px 80px; }
}
`;export{b as default};