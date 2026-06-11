import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/* ══════════════════════════════════════════════════════
   DATA — ACCORDION SKILLS (per Prompt 07 / same as Home)
══════════════════════════════════════════════════════ */
const ACCORDION_ITEMS = [
  {
    id: 'acc1',
    num: '01',
    icon: 'fa-solid fa-code',
    title: 'Web Developer',
    descEN: 'Building web experiences using vibe coding — fully integrated with the latest AI tools and Firebase backend. Visual-first by nature, but clean in architecture. Not just a site, it\'s a system.',
    descID: 'Bikin web pakai vibe coding yang udah nyatu sama AI terbaru dan Firebase. Fokusnya visual dulu, tapi strukturnya tetap rapi di belakang layar. Bukan cuma website biasa, ini ekosistem digital.',
    tools: ['React / Next.js', 'GSAP Animation', 'UX Architecture', 'HTML/CSS/JS', 'Firebase'],
    note: 'Android admin app available for clients',
  },
  {
    id: 'acc2',
    num: '02',
    icon: 'fa-solid fa-film',
    title: 'Video Editing / Motion Graphic',
    descEN: 'From school short films to professional production content. Rhythm, pacing, color — all dialed in. Juara 1 National Film Festival Cendana. Handles: school project finales, orientation videos, event coverage, creative competition entries.',
    descID: 'Dari film pendek sekolah sampe konten promosi profesional. Ritme, tempo, warna — semuanya dirasain. Pernah Juara 1 Film Cendana Nasional. Ngerjain: tugas akhir SMA, video ospek, event, dan lomba kreatif.',
    tools: ['DaVinci Resolve', 'Adobe Premiere', 'After Effects', 'CapCut', 'Alight Motion'],
  },
  {
    id: 'acc3',
    num: '03',
    icon: 'fa-solid fa-pen-nib',
    title: 'Illustration & Graphic Design',
    descEN: 'Posters for school finals, competition entries, org logos, YouTube thumbnails, lanyard design, jersey design, and more. Raw files + documentation sent for competition requirements.',
    descID: 'Poster tugas akhir, poster lomba, logo organisasi, thumbnail YouTube, desain lanyard, jersey, dan lain-lain. File mentah dan dokumentasi bisa dikirim buat syarat lomba.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Canva', 'Affinity Designer'],
  },
  {
    id: 'acc4',
    num: '04',
    icon: 'fa-solid fa-camera',
    title: 'Videographer / Photographer',
    descEN: 'Former DOP on short films, portrait sessions, camera operator for PERBASI East Java Youth League. Comfortable with any gimbal, any brand. Solid on exposure triangle.',
    descID: 'Pernah jadi DOP film pendek, potrait, dan operator kamera buat Perbasi Kabupaten Jawa Timur. Bisa pakai gimbal merek apapun. Exposure triangle udah hafal luar kepala.',
    tools: ['DJI', 'Sony', 'Canon', 'Lumix'],
  },
];

/* ══════════════════════════════════════════════════════
   DATA — SERVICES
══════════════════════════════════════════════════════ */
const SERVICES = [
  {
    num: '01', icon: 'fa-solid fa-globe',
    titleEN: 'Web Development', titleID: 'Web Development',
    descEN: 'Premium web builds — portfolio sites, wedding invitations, custom tools. Firebase-integrated, mobile-first, and built to last.',
    descID: 'Bikin web premium — portofolio, undangan digital, tools custom. Firebase-integrated, mobile-first, dan tahan lama.',
    tags: ['React', 'Firebase', 'HTML/CSS/JS'],
  },
  {
    num: '02', icon: 'fa-solid fa-clapperboard',
    titleEN: 'Video Editing & Motion', titleID: 'Editing Video & Motion',
    descEN: 'School finals, competition entries, event coverage, orientation videos. From raw footage to color-graded final cut.',
    descID: 'Tugas akhir sekolah/kuliah, lomba kreatif, video event, ospek. Dari footage mentah sampai final yang siap upload.',
    tags: ['DaVinci Resolve', 'Adobe Premiere', 'CapCut'],
  },
  {
    num: '03', icon: 'fa-solid fa-paintbrush',
    titleEN: 'Illustration & Design', titleID: 'Ilustrasi & Desain',
    descEN: 'Posters, logos, thumbnails, lanyards, jerseys. Raw files and documentation provided for competition requirements.',
    descID: 'Poster, logo, thumbnail, lanyard, jersey. File mentah dan dokumentasi tersedia untuk keperluan lomba.',
    tags: ['Illustrator', 'Photoshop', 'Affinity Designer'],
  },
  {
    num: '04', icon: 'fa-solid fa-camera-retro',
    titleEN: 'Videography / Photography', titleID: 'Videografi / Fotografi',
    descEN: 'On-site shooting — events, portraits, short films. Solid on exposure, composition, and post-processing.',
    descID: 'Shooting langsung di lokasi — event, portrait, film pendek. Paham exposure, komposisi, dan post-processing.',
    tags: ['Portrait', 'Sinematik', 'Color Grade'],
  },
  {
    num: '05', icon: 'fa-solid fa-tower-broadcast',
    titleEN: 'Live Streaming & Broadcast', titleID: 'Live Streaming & Siaran',
    descEN: 'Full broadcast production — OBS overlay, scene control via tablet web app. Experienced with sports events and school productions.',
    descID: 'Produksi siaran lengkap — overlay OBS custom, kontrol scene lewat web app tablet. Pengalaman event olahraga dan sekolah.',
    tags: ['OBS Studio', 'Overlay Design', 'Web Controller'],
  },
  {
    num: '06', icon: 'fa-solid fa-film',
    titleEN: 'Live Streaming & Broadcast Design', titleID: 'Desain Siaran',
    descEN: 'Custom broadcast graphics — lower thirds, score overlays, intro animations, and full visual identity for live productions.',
    descID: 'Grafis siaran custom — lower third, overlay skor, animasi intro, dan identitas visual lengkap untuk produksi live.',
    tags: ['Broadcast Design', 'Overlay', 'Animation'],
  },
];

/* ══════════════════════════════════════════════════════
   DATA — EQUIPMENT
══════════════════════════════════════════════════════ */
const TOOLS = [
  {
    catIcon: 'fa-solid fa-code',
    catLabel: 'Web Development',
    items: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Next.js', 'Firebase', 'Git'],
  },
  {
    catIcon: 'fa-solid fa-video',
    catLabel: 'Video & Motion',
    items: ['DaVinci Resolve', 'Adobe Premiere', 'After Effects', 'CapCut', 'Alight Motion'],
  },
  {
    catIcon: 'fa-solid fa-palette',
    catLabel: 'Design & Illustration',
    items: ['Adobe Illustrator', 'Adobe Photoshop', 'Canva', 'Affinity Designer', 'Figma'],
  },
  {
    catIcon: 'fa-solid fa-camera',
    catLabel: 'Gear / Camera',
    items: ['DJI Gimbal', 'Sony Camera', 'Canon Camera', 'Lumix Camera', 'OBS Studio'],
  },
];

/* ══════════════════════════════════════════════════════
   DATA — ACHIEVEMENTS / CERTIF
══════════════════════════════════════════════════════ */
const CERTIF_ITEMS = [
  {
    src: '/assets/img/film pendek nasional.jpg',
    filename: 'film_pendek_nasional.jpg',
    caption: 'Juara I Festival Film Cendana 2025',
    desc: 'Juara I Nasional — Festival Film Cendana 2025 · SMAS Cendana Mandau, Bengkalis, Riau',
    cls: 'ab-gal-half',
  },
  {
    src: '/assets/img/SERTTIF FLS2N.jpg',
    filename: 'SERTTIF_FLS2N.jpg',
    caption: 'Juara 2 Film Pendek FLS2N 2024',
    desc: 'Juara 2 Tingkat Kabupaten Probolinggo — FLS2N 2024 · SMAN 1 Kraksaan',
    cls: 'ab-gal-half',
  },
  {
    src: '/assets/img/NOT ORDINARY.jpg',
    filename: 'NOT_ORDINARY.jpg',
    caption: 'NOT AN ORDINARY TEENAGE 2025',
    desc: 'Peserta — Kegiatan NOT 2025, Universitas Jember · Tema: Strong Mind, Bright Future',
    cls: 'ab-gal-third',
  },
  {
    src: '/assets/img/SERTIF OSIS.jpg',
    filename: 'SERTIF_OSIS.jpg',
    caption: 'Anggota Sekbid Jurnalistik OSIS 2023–2024',
    desc: 'Sekbid Jurnalistik — OSIS & MPK SMAN 1 Kraksaan · Periode 2023–2024',
    cls: 'ab-gal-third',
  },
  {
    src: '/assets/img/MEDSPIN.jpg',
    filename: 'MEDSPIN.jpg',
    caption: 'Participant Public Poster MEDSPIN 2025',
    desc: 'Peserta Public Poster — MEDSPIN · Universitas Airlangga · Sep–Okt 2025',
    cls: 'ab-gal-third',
  },
];

/* ══════════════════════════════════════════════════════
   SUB-COMPONENT: ACCORDION ITEM
══════════════════════════════════════════════════════ */
function AccordionItem({ item, isOpen, onToggle, lang }) {
  const desc = lang === 'en' ? item.descEN : item.descID;
  return (
    <div className={`ab-acc-item${isOpen ? ' open' : ''}`}>
      <div
        className="ab-acc-hdr"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        <div className="ab-acc-left">
          <span className="ab-acc-num">{item.num}</span>
          <span className="ab-acc-icon"><i className={item.icon} /></span>
          <span className="ab-acc-title">{item.title}</span>
        </div>
        <span className="ab-acc-toggle"><i className="fa-solid fa-plus" /></span>
      </div>
      <div className="ab-acc-body">
        <div className="ab-acc-inner">
          <p className="ab-acc-desc">{desc}</p>
          <div className="ab-acc-tools">
            {item.tools.map((tool, i) => <span key={i} className="ab-tool-tag">{tool}</span>)}
          </div>
          {item.note && (
            <p className="ab-acc-note"><i className="fa-solid fa-circle-info" /> {item.note}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SUB-COMPONENT: CERTIF MODAL (BUG-FIXED)
   Fix: tidak pakai filter pada #root (menyebabkan freeze).
   Pakai simple backdrop opacity saja.
══════════════════════════════════════════════════════ */
function CertifModal({ src, filename, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    // FIX: lock scroll tanpa menyentuh layout/filter root
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = prev;
      // FIX: tidak ada filter cleanup yang perlu dilakukan
    };
  }, [onClose]);

  return (
    <div className="ab-modal-wrap" onClick={onClose}>
      <div className="ab-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="ab-modal-close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark" />
        </button>
        <img
          src={src}
          alt={filename}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          className="ab-modal-img"
          loading="lazy"
        />
        <p className="ab-modal-filename">{filename}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT: About
══════════════════════════════════════════════════════ */
export default function About() {
  const navigate = useNavigate();

  // Language detection from localStorage (matches useApp.js)
  const [lang, setLang] = useState(() => localStorage.getItem('synw-lang') || 'id');
  useEffect(() => {
    const onStorage = () => setLang(localStorage.getItem('synw-lang') || 'id');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // WIB Live Clock
  const [wibTime, setWibTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const wib = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
      const h = String(wib.getHours()).padStart(2, '0');
      const m = String(wib.getMinutes()).padStart(2, '0');
      const s = String(wib.getSeconds()).padStart(2, '0');
      setWibTime(`${h}:${m}:${s}`);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  // Accordion state
  const [openAcc, setOpenAcc] = useState('acc1');
  const handleAccToggle = useCallback((id) => {
    setOpenAcc((prev) => (prev === id ? null : id));
  }, []);

  // Certif modal — BUG FIX: use stable state, no re-render loop
  const [certModal, setCertModal] = useState(null);
  const [certErrors, setCertErrors] = useState({});
  const handleCertError = useCallback((i) => {
    setCertErrors((prev) => ({ ...prev, [i]: true }));
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.07, rootMargin: '0px 0px -20px 0px' }
    );
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }, 100);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, []);

  // CSS injection
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'about-page-styles';
    style.textContent = `
      /* ─── HERO ─── */
      .ab-hero {
        min-height: 55vh;
        display: flex;
        align-items: flex-end;
        padding: 130px 80px 70px;
        position: relative;
        overflow: hidden;
        border-bottom: 1px solid var(--border);
        background: linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%);
      }
      .ab-hero-bg {
        position: absolute; inset: 0; pointer-events: none;
        background:
          radial-gradient(ellipse 60% 70% at 90% 10%, rgba(139,92,246,0.12) 0%, transparent 65%),
          radial-gradient(ellipse 40% 50% at 5%  85%, rgba(139,92,246,0.07) 0%, transparent 60%);
      }
      .ab-hero-content { position: relative; z-index: 1; flex: 1; }
      .ab-hero-clock {
        position: absolute;
        top: 130px; right: 80px;
        font-family: 'Outfit', monospace;
        font-size: 0.72rem;
        letter-spacing: 0.18em;
        color: var(--text-dim);
        background: var(--glass);
        border: 1px solid var(--gborder);
        border-radius: 99px;
        padding: 7px 16px;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        z-index: 2;
      }
      .ab-hero-label {
        display: block;
        font-size: 0.6rem;
        font-weight: 600;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: var(--text-dim);
        margin-bottom: 14px;
      }
      .ab-hero-name {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(3.2rem, 8vw, 8.5rem);
        font-weight: 300;
        line-height: 0.88;
        margin-bottom: 18px;
      }
      .ab-hero-sub {
        font-family: 'Outfit', sans-serif;
        font-size: 0.88rem;
        color: var(--text-dim);
        letter-spacing: 0.06em;
        max-width: 400px;
        line-height: 1.7;
      }

      /* ─── SECTION BASE ─── */
      .ab-section {
        padding: 100px 80px;
        border-top: 1px solid var(--border);
      }
      .ab-sec-label {
        display: block;
        font-size: 0.6rem;
        font-weight: 700;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: var(--text-dim);
        margin-bottom: 14px;
      }
      .ab-sec-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(2.4rem, 5vw, 5rem);
        font-weight: 300;
        line-height: 0.92;
        margin-bottom: 56px;
      }
      .ab-sec-title em { font-style: italic; }

      /* ─── INTRO / SECTION 01 ─── */
      .ab-intro { background: linear-gradient(180deg, var(--bg2) 0%, var(--bg3) 100%); }
      .ab-intro-grid {
        display: grid;
        grid-template-columns: 380px 1fr;
        gap: 80px;
        align-items: start;
      }

      /* Photo with barrier */
      .ab-photo-col { position: relative; }
      .ab-photo-wrap {
        position: sticky;
        top: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }
      .ab-photo-glow {
        position: absolute; top: -40px; left: 50%;
        transform: translateX(-50%);
        width: 280px; height: 280px; border-radius: 50%;
        background: radial-gradient(ellipse, rgba(139,92,246,0.28) 0%, transparent 70%);
        filter: blur(30px);
        animation: abPhotoGlow 4s ease-in-out infinite alternate;
        pointer-events: none;
      }
      @keyframes abPhotoGlow {
        from { opacity: 0.6; transform: translateX(-50%) scale(0.9); }
        to   { opacity: 1;   transform: translateX(-50%) scale(1.1); }
      }
      .ab-photo-frame {
        width: 100%; aspect-ratio: 3/4; border-radius: 28px;
        overflow: hidden; position: relative; z-index: 1;
        background: var(--glass2);
        border: 1px solid var(--gborder2);
        box-shadow: 0 30px 80px var(--shadow), 0 0 0 1px rgba(139,92,246,0.12);
      }
      .ab-photo-img {
        width: 100%; height: 100%; object-fit: cover; display: block;
        pointer-events: none; user-select: none; -webkit-user-drag: none;
        transition: transform 0.6s ease;
      }
      .ab-photo-frame:hover .ab-photo-img { transform: scale(1.04); }
      .ab-photo-barrier {
        position: absolute; inset: 0; z-index: 2;
        background: transparent; cursor: default;
      }
      .ab-photo-badge {
        display: flex; align-items: center; gap: 9px;
        background: var(--glass2); border: 1px solid var(--gborder2);
        border-radius: 99px; padding: 10px 20px;
        font-size: 0.64rem; font-weight: 600;
        letter-spacing: 0.1em; text-transform: uppercase; color: var(--text);
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        position: relative; z-index: 1;
      }
      .ab-badge-dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: #22c55e; flex-shrink: 0;
        box-shadow: 0 0 8px rgba(34,197,94,0.7);
        animation: abPulse 2s ease-in-out infinite;
      }
      @keyframes abPulse {
        0%, 100% { box-shadow: 0 0 6px rgba(34,197,94,0.5); }
        50%       { box-shadow: 0 0 14px rgba(34,197,94,0.9); }
      }

      /* Intro text */
      .ab-intro-text { padding-top: 6px; }
      .ab-intro-lead {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.4rem; font-style: italic;
        color: var(--text); line-height: 1.5; margin-bottom: 20px;
      }
      .ab-intro-body {
        font-size: 0.88rem; line-height: 1.9;
        color: var(--text-dim); margin-bottom: 16px;
      }

      /* Stats row */
      .ab-stats-row {
        display: flex; gap: 0; margin: 30px 0 32px;
        border: 1px solid var(--gborder); border-radius: 18px; overflow: hidden;
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      }
      .ab-stat-item {
        flex: 1; padding: 20px 16px; text-align: center;
        border-right: 1px solid var(--gborder);
        background: var(--glass);
        transition: background 0.3s;
      }
      .ab-stat-item:last-child { border-right: none; }
      .ab-stat-item:hover { background: var(--glass2); }
      .ab-stat-val {
        font-family: 'Cormorant Garamond', serif;
        font-size: 2rem; font-weight: 300;
        color: var(--accent3); display: block; line-height: 1;
        margin-bottom: 6px;
      }
      .ab-stat-label {
        font-size: 0.58rem; font-weight: 700;
        letter-spacing: 0.18em; text-transform: uppercase;
        color: var(--text-dim); display: block;
      }

      .ab-btn-cta {
        display: inline-flex; align-items: center; gap: 10px;
        background: var(--text); color: var(--bg);
        border: none; border-radius: 99px;
        padding: 14px 32px; font-family: 'Outfit', sans-serif;
        font-size: 0.72rem; font-weight: 700;
        letter-spacing: 0.14em; text-transform: uppercase;
        cursor: pointer; transition: all 0.3s;
      }
      .ab-btn-cta:hover { background: var(--accent); color: #fff; transform: scale(1.04); }

      /* ─── ACCORDION / SECTION 02 ─── */
      .ab-skills { background: linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%); }
      .ab-acc-list {
        display: flex; flex-direction: column;
        border: 1px solid var(--border); border-radius: 22px; overflow: hidden;
      }
      .ab-acc-item {
        border-bottom: 1px solid var(--border);
        background: var(--glass); transition: background 0.3s;
      }
      .ab-acc-item:last-child { border-bottom: none; }
      .ab-acc-item.open { background: var(--glass2); }
      .ab-acc-hdr {
        display: flex; align-items: center; justify-content: space-between;
        padding: 26px 34px; cursor: pointer; user-select: none;
        transition: background 0.25s;
      }
      .ab-acc-hdr:hover { background: var(--glass2); }
      .ab-acc-left { display: flex; align-items: center; gap: 18px; }
      .ab-acc-num {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.1rem; font-weight: 300; color: var(--text-dim);
        min-width: 28px;
      }
      .ab-acc-icon {
        width: 38px; height: 38px; border-radius: 10px;
        background: var(--glass2); border: 1px solid var(--gborder);
        display: flex; align-items: center; justify-content: center;
        color: var(--accent3); font-size: 0.9rem;
      }
      .ab-acc-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.35rem; font-weight: 400; color: var(--text);
      }
      .ab-acc-toggle {
        color: var(--text-dim); font-size: 0.85rem;
        transition: transform 0.3s ease;
      }
      .ab-acc-item.open .ab-acc-toggle { transform: rotate(45deg); }
      .ab-acc-body {
        max-height: 0; overflow: hidden;
        transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1);
      }
      .ab-acc-item.open .ab-acc-body { max-height: 400px; }
      .ab-acc-inner { padding: 0 34px 28px; }
      .ab-acc-desc {
        font-size: 0.88rem; line-height: 1.88;
        color: var(--text-dim); margin-bottom: 18px;
      }
      .ab-acc-tools { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
      .ab-tool-tag {
        font-family: 'Outfit', sans-serif;
        font-size: 0.68rem; font-weight: 600; letter-spacing: 0.06em;
        background: var(--glass2); border: 1px solid var(--gborder2);
        border-radius: 99px; padding: 5px 12px; color: var(--text-dim);
      }
      .ab-acc-note {
        font-size: 0.72rem; color: var(--accent3);
        display: flex; align-items: center; gap: 6px;
        opacity: 0.8;
      }

      /* ─── SERVICES / SECTION 03 ─── */
      .ab-services { background: linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%); }
      .ab-svc-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
      .ab-svc-card {
        background: var(--glass); border: 1px solid var(--gborder);
        border-radius: 20px; padding: 28px;
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        transition: border-color 0.3s, transform 0.3s, background 0.3s;
      }
      .ab-svc-card:hover {
        border-color: rgba(139,92,246,0.35); transform: translateY(-4px);
        background: var(--glass2);
      }
      .ab-svc-hdr {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 16px;
      }
      .ab-svc-num {
        font-family: 'Cormorant Garamond', serif;
        font-size: 2.2rem; font-weight: 300; color: var(--text-dim); opacity: 0.4;
      }
      .ab-svc-icon {
        width: 42px; height: 42px; border-radius: 12px;
        background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2);
        display: flex; align-items: center; justify-content: center;
        color: var(--accent3); font-size: 1rem;
      }
      .ab-svc-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.2rem; font-weight: 500;
        color: var(--text); margin-bottom: 10px;
      }
      .ab-svc-desc {
        font-size: 0.82rem; line-height: 1.78;
        color: var(--text-dim); margin-bottom: 16px;
      }
      .ab-svc-tags { display: flex; flex-wrap: wrap; gap: 6px; }
      .ab-svc-tags span {
        font-size: 0.62rem; font-weight: 600; letter-spacing: 0.06em;
        background: var(--glass2); border: 1px solid var(--gborder);
        border-radius: 99px; padding: 4px 10px; color: var(--text-dim);
      }

      /* ─── EQUIPMENT / SECTION 04 ─── */
      .ab-equipment { background: linear-gradient(180deg, var(--bg2) 0%, var(--bg3) 100%); }
      .ab-tools-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
      .ab-tool-cat {
        background: var(--glass); border: 1px solid var(--gborder);
        border-radius: 20px; padding: 28px;
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      }
      .ab-tool-cat-hdr {
        display: flex; align-items: center; gap: 10px;
        margin-bottom: 20px;
        font-size: 0.64rem; font-weight: 700; letter-spacing: 0.18em;
        text-transform: uppercase; color: var(--accent3);
      }
      .ab-tool-items { display: flex; flex-wrap: wrap; gap: 8px; }
      .ab-tool-item {
        font-size: 0.76rem; font-weight: 500;
        background: var(--glass2); border: 1px solid var(--gborder2);
        border-radius: 99px; padding: 6px 14px; color: var(--text-dim);
        transition: border-color 0.25s, color 0.25s;
      }
      .ab-tool-item:hover { border-color: rgba(139,92,246,0.4); color: var(--accent3); }

      /* ─── ACHIEVEMENTS / SECTION 05 ─── */
      .ab-achievements { background: linear-gradient(135deg, var(--bg3) 0%, var(--bg) 100%); }
      .ab-gal-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-auto-rows: 220px;
        gap: 14px;
      }
      .ab-gal-half  { grid-column: span 3; }
      .ab-gal-third { grid-column: span 2; }
      .ab-gal-item {
        position: relative; border-radius: 16px; overflow: hidden;
        background: var(--glass2); border: 1px solid var(--gborder);
        cursor: pointer; transition: transform 0.3s, border-color 0.3s;
      }
      .ab-gal-item:hover { transform: scale(1.02); border-color: rgba(139,92,246,0.4); }
      .ab-gal-item img {
        width: 100%; height: 100%; object-fit: cover;
        pointer-events: none; user-select: none; -webkit-user-drag: none;
        display: block;
      }
      .ab-gal-label {
        position: absolute; bottom: 0; left: 0; right: 0;
        padding: 16px 14px 12px;
        background: linear-gradient(transparent, rgba(0,0,0,0.72));
        font-size: 0.7rem; font-weight: 600;
        color: rgba(255,255,255,0.9); letter-spacing: 0.04em;
      }
      .ab-gal-zoom {
        position: absolute; top: 12px; right: 12px;
        width: 32px; height: 32px; border-radius: 8px;
        background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        color: rgba(255,255,255,0.8); font-size: 0.75rem;
        opacity: 0; transition: opacity 0.3s;
      }
      .ab-gal-item:hover .ab-gal-zoom { opacity: 1; }
      .ab-gal-placeholder {
        width: 100%; height: 100%; display: flex;
        flex-direction: column; align-items: center; justify-content: center;
        gap: 8px; color: var(--text-dim);
        font-size: 0.72rem;
      }

      /* ─── CERTIF MODAL (BUG-FIXED: no root filter) ─── */
      .ab-modal-wrap {
        position: fixed; inset: 0; z-index: 9000;
        background: rgba(0,0,0,0.82); backdrop-filter: blur(6px);
        display: flex; align-items: center; justify-content: center;
        padding: 20px; animation: abModalIn 0.25s ease;
      }
      @keyframes abModalIn { from { opacity: 0; } to { opacity: 1; } }
      .ab-modal-content {
        position: relative; max-width: 88vw; max-height: 90vh;
        display: flex; flex-direction: column; align-items: center; gap: 12px;
      }
      .ab-modal-close {
        position: absolute; top: -14px; right: -14px;
        width: 44px; height: 44px; border-radius: 50%;
        background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
        color: #fff; font-size: 1.1rem; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.25s; z-index: 1;
      }
      .ab-modal-close:hover { background: rgba(139,92,246,0.7); }
      .ab-modal-img {
        max-width: 100%; max-height: 80vh; object-fit: contain;
        border-radius: 16px; box-shadow: 0 30px 80px rgba(0,0,0,0.8);
        user-select: none; -webkit-user-drag: none;
        animation: abImgIn 0.3s ease;
      }
      @keyframes abImgIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .ab-modal-filename {
        font-family: 'Outfit', sans-serif; font-size: 0.72rem;
        color: rgba(255,255,255,0.4); letter-spacing: 0.08em;
      }

      /* ─── BOTTOM CTA ─── */
      .ab-bottom-cta {
        padding: 60px 80px 80px;
        background: linear-gradient(180deg, var(--bg3) 0%, var(--bg) 100%);
        text-align: center; border-top: 1px solid var(--border);
      }
      .ab-btn-view {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 14px 36px; border: none; border-radius: 99px; cursor: pointer;
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        color: #fff; font-family: 'Outfit', sans-serif;
        font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em;
        text-transform: uppercase; transition: opacity 0.25s, transform 0.25s;
      }
      .ab-btn-view:hover { opacity: 0.88; transform: scale(1.04); }

      /* ─── RESPONSIVE ─── */
      @media (max-width: 1200px) {
        .ab-intro-grid { grid-template-columns: 300px 1fr; gap: 60px; }
        .ab-svc-grid   { grid-template-columns: repeat(2, 1fr); }
        .ab-tools-grid { grid-template-columns: repeat(2, 1fr); }
        .ab-gal-grid   { grid-template-columns: repeat(4, 1fr); }
        .ab-gal-half   { grid-column: span 2; }
        .ab-gal-third  { grid-column: span 2; }
      }
      @media (max-width: 1024px) {
        .ab-hero, .ab-section, .ab-bottom-cta { padding-left: 40px; padding-right: 40px; }
        .ab-hero-clock { right: 40px; }
      }
      @media (max-width: 768px) {
        .ab-hero, .ab-section, .ab-bottom-cta { padding-left: 24px; padding-right: 24px; }
        .ab-hero { min-height: auto; padding-top: 100px; padding-bottom: 50px; }
        .ab-hero-clock { top: 100px; right: 24px; font-size: 0.62rem; }
        .ab-intro-grid { grid-template-columns: 1fr; gap: 48px; }
        .ab-photo-wrap { position: static; }
        .ab-photo-frame { max-width: 280px; margin: 0 auto; }
        .ab-svc-grid   { grid-template-columns: 1fr; }
        .ab-tools-grid { grid-template-columns: 1fr; }
        .ab-gal-grid   { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 180px; }
        .ab-gal-half   { grid-column: span 2; }
        .ab-gal-third  { grid-column: span 1; }
        .ab-stats-row  { flex-direction: column; }
        .ab-stat-item  { border-right: none; border-bottom: 1px solid var(--gborder); }
        .ab-stat-item:last-child { border-bottom: none; }
        .ab-section { padding-top: 60px; padding-bottom: 60px; }
        .ab-acc-hdr { padding: 20px 22px; }
        .ab-acc-inner { padding: 0 22px 24px; }
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById('about-page-styles')?.remove();
  }, []);

  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ── HERO ── */}
      <div className="ab-hero">
        <div className="ab-hero-bg" />

        {/* WIB Clock */}
        <div className="ab-hero-clock">
          WIB {wibTime}
        </div>

        <div className="ab-hero-content">
          <span className="ab-hero-label reveal">About Me</span>
          <h1 className="ab-hero-name reveal">
            Aldo Leo Saputra
          </h1>
          <p className="ab-hero-sub reveal">
            Multidisciplinary Digital Creator
          </p>
        </div>
      </div>

      {/* ── SECTION 01 — INTRODUCTION ── */}
      <section className="ab-section ab-intro">
        <div className="ab-intro-grid">

          {/* Photo */}
          <div className="ab-photo-col reveal">
            <div className="ab-photo-wrap">
              <div className="ab-photo-glow" />
              <div className="ab-photo-frame">
                <img
                  src="/assets/img/bg1.jpg"
                  alt="Aldo Leo Saputra"
                  className="ab-photo-img"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
                {/* Barrier — prevents click, drag, save */}
                <div
                  className="ab-photo-barrier"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                />
              </div>
              <div className="ab-photo-badge">
                <span className="ab-badge-dot" />
                <span>Open for New Projects</span>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="ab-intro-text">
            <div className="reveal">
              <span className="ab-sec-label">01 / Introduction</span>
              <h2 className="ab-sec-title">
                Who{' '}
                <span className="grad-text-1">Am I?</span>
              </h2>
            </div>

            <div className="reveal">
              {lang === 'id' ? (
                <>
                  <p className="ab-intro-lead">
                    Kreator digital dari Jawa Timur yang nggak cuma bisa satu hal.
                  </p>
                  <p className="ab-intro-body">
                    Aldo Leo Saputra — kreator digital dari Jawa Timur. Sekarang masih
                    jadi mahasiswa (kabar kuliahnya nyusul), tapi terbuka buat kolaborasi
                    apapun. Ngurusin web, video, live streaming, ilustrasi, sampai foto.
                  </p>
                  <p className="ab-intro-body">
                    Filosofinya sederhana: proyekmu aku garap kayak punya sendiri.
                  </p>
                </>
              ) : (
                <>
                  <p className="ab-intro-lead">
                    A multidisciplinary digital creator — not a generalist,
                    a specialist in multiple crafts.
                  </p>
                  <p className="ab-intro-body">
                    I'm Aldo Leo Saputra — a digital creator based in East Java, Indonesia.
                    Currently a university student (status: awaiting announcement), open to
                    collaboration at any scale. My work spans premium web development, video
                    production, live streaming, illustration, and photography.
                  </p>
                  <p className="ab-intro-body">
                    Philosophy: your project gets treated like mine.
                  </p>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="ab-stats-row reveal">
              <div className="ab-stat-item">
                <span className="ab-stat-val">4+</span>
                <span className="ab-stat-label">
                  {lang === 'id' ? 'Tahun Aktif' : 'Years Active'}
                </span>
              </div>
              <div className="ab-stat-item">
                <span className="ab-stat-val">21+</span>
                <span className="ab-stat-label">
                  {lang === 'id' ? 'Proyek' : 'Projects'}
                </span>
              </div>
              <div className="ab-stat-item">
                <span className="ab-stat-val">5</span>
                <span className="ab-stat-label">
                  {lang === 'id' ? 'Multidisiplin' : 'Disciplines'}
                </span>
              </div>
            </div>

            <div className="reveal">
              <button className="ab-btn-cta" onClick={() => goTo('/login')}>
                <span>{lang === 'id' ? 'Hubungi Saya' : 'Get in Touch'}</span>
                <i className="fa-solid fa-arrow-up-right" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 02 — SKILLS ── */}
      <section className="ab-section ab-skills">
        <span className="ab-sec-label reveal">02 / Skills</span>
        <h2 className="ab-sec-title reveal">
          What I{' '}
          <span className="grad-text-2">Do</span>
        </h2>
        <div className="ab-acc-list reveal">
          {ACCORDION_ITEMS.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openAcc === item.id}
              onToggle={() => handleAccToggle(item.id)}
              lang={lang}
            />
          ))}
        </div>
      </section>

      {/* ── SECTION 03 — SERVICES ── */}
      <section className="ab-section ab-services">
        <span className="ab-sec-label reveal">03 / Services</span>
        <h2 className="ab-sec-title reveal">
          What I Can{' '}
          <span className="grad-text-3">Build</span>
        </h2>
        <div className="ab-svc-grid">
          {SERVICES.map((svc, i) => (
            <div
              key={svc.num}
              className={`ab-svc-card reveal${i % 3 === 1 ? ' rv-d1' : i % 3 === 2 ? ' rv-d2' : ''}`}
            >
              <div className="ab-svc-hdr">
                <span className="ab-svc-num">{svc.num}</span>
                <span className="ab-svc-icon"><i className={svc.icon} /></span>
              </div>
              <h3 className="ab-svc-title">
                {lang === 'id' ? svc.titleID : svc.titleEN}
              </h3>
              <p className="ab-svc-desc">
                {lang === 'id' ? svc.descID : svc.descEN}
              </p>
              <div className="ab-svc-tags">
                {svc.tags.map((tag, j) => <span key={j}>{tag}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 04 — EQUIPMENT ── */}
      <section className="ab-section ab-equipment">
        <span className="ab-sec-label reveal">04 / Equipment</span>
        <h2 className="ab-sec-title reveal">
          Tools &{' '}
          <span className="grad-text-4">Gear</span>
        </h2>
        <div className="ab-tools-grid reveal">
          {TOOLS.map((cat) => (
            <div key={cat.catLabel} className="ab-tool-cat">
              <div className="ab-tool-cat-hdr">
                <i className={cat.catIcon} />
                <span>{cat.catLabel}</span>
              </div>
              <div className="ab-tool-items">
                {cat.items.map((item, i) => (
                  <span key={i} className="ab-tool-item">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 05 — ACHIEVEMENTS ── */}
      <section className="ab-section ab-achievements">
        <span className="ab-sec-label reveal">05 / Achievements</span>
        <h2 className="ab-sec-title reveal">
          {lang === 'id' ? 'Sertifikat & ' : 'Certificates & '}
          <span className="grad-text-5">
            {lang === 'id' ? 'Penghargaan' : 'Awards'}
          </span>
        </h2>
        <div className="ab-gal-grid reveal">
          {CERTIF_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`ab-gal-item ${item.cls}`}
              onClick={() => !certErrors[i] && setCertModal({ src: item.src, filename: item.filename })}
              onContextMenu={(e) => e.preventDefault()}
            >
              {certErrors[i] ? (
                <div className="ab-gal-placeholder">
                  <i className="fa-solid fa-file" style={{ fontSize: '1.5rem', opacity: 0.4 }} />
                  <span>{item.filename}</span>
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onError={() => handleCertError(i)}
                />
              )}
              <div className="ab-gal-label">{item.caption}</div>
              {!certErrors[i] && (
                <div className="ab-gal-zoom">
                  <i className="fa-solid fa-magnifying-glass" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <div className="ab-bottom-cta">
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(1.6rem, 3vw, 2.6rem)',
          fontWeight: 300,
          color: 'var(--text)',
          marginBottom: 24,
          lineHeight: 1.2,
        }}>
          {lang === 'id'
            ? 'Mau liat proyeknya?'
            : 'Want to see the work?'}
        </p>
        <button className="ab-btn-view" onClick={() => goTo('/price-list')}>
          <span>{lang === 'id' ? 'Lihat Proyek' : 'View Projects'}</span>
          <i className="fa-solid fa-arrow-right" />
        </button>
      </div>

      {/* ── CERTIF MODAL ── */}
      {certModal && (
        <CertifModal
          src={certModal.src}
          filename={certModal.filename}
          onClose={() => setCertModal(null)}
        />
      )}
    </>
  );
}
