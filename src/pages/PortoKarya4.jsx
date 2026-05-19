import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/* ══════════════════════════════════════════════════════
   PORTOKARYA4 — Live Stream Design & OBS via Tablet
   PERBASI Youth East Java Basketball League (YEJBL)

   🔥 FIREBASE READY — Edit konten dari Firebase Console
   tanpa perlu deploy ulang!
   
   Setup Firebase:
   1. Buka https://console.firebase.google.com
   2. Buat project → Realtime Database / Firestore
   3. Ganti FIREBASE_CONFIG di bawah dengan config kamu
   4. Edit data dari Firebase Console → otomatis update di sini
══════════════════════════════════════════════════════ */

/* ── Firebase Config (isi setelah setup) ──
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const FIREBASE_CONFIG = {
  apiKey: "GANTI_INI",
  authDomain: "GANTI_INI.firebaseapp.com",
  databaseURL: "https://GANTI_INI-default-rtdb.firebaseio.com",
  projectId: "GANTI_INI",
  storageBucket: "GANTI_INI.appspot.com",
  messagingSenderId: "GANTI_INI",
  appId: "GANTI_INI"
};
const app = initializeApp(FIREBASE_CONFIG);
const db = getDatabase(app);
── */

/* ── DATA DEFAULT (diganti otomatis dari Firebase nanti) ── */
const DEFAULT_DATA = {
  hero: {
    badge: 'Live Stream & Broadcast',
    title: 'Live Stream Design &',
    titleEm: 'OBS via Tablet',
    sub: 'Merancang dan mengoperasikan sistem live streaming profesional untuk PERBASI Youth East Java Basketball League (YEJBL) — menggunakan OBS via website tablet sebagai controller dengan overlay desain kustom.',
    year: '2026',
    role: 'Stream Designer & Operator',
    duration: 'Ongoing',
    client: 'PERBASI Youth East Java Basketball League',
  },
  overview: {
    p1: 'Proyek ini lahir dari kebutuhan PERBASI untuk menghadirkan siaran live streaming pertandingan basket YEJBL dengan tampilan yang profesional dan menarik — setara siaran olahraga nasional, namun dioperasikan secara mandiri.',
    p2: 'Solusi yang dikembangkan adalah sistem OBS berbasis kontrol tablet via website, sehingga operator dapat mengganti scene, mengaktifkan overlay skor, dan mengelola transisi tanpa harus duduk di depan komputer — sangat fleksibel untuk environment lapangan olahraga.',
  },
  stats: [
    { val: 'OBS', label: 'Streaming Engine' },
    { val: 'Tablet', label: 'Controller Device' },
    { val: 'YEJBL', label: 'Client Event' },
    { val: 'Live', label: 'Production Type' },
  ],
  features: [
    { icon: 'fa-solid fa-layer-group', title: 'Custom Overlay Design', desc: 'Overlay skor, timer, nama tim, dan sponsor yang dirancang khusus sesuai identitas visual YEJBL.' },
    { icon: 'fa-solid fa-tablet-screen-button', title: 'Tablet Web Controller', desc: 'Kontrol OBS scene switching via website yang diakses dari tablet — tanpa perlu keyboard/mouse di lapangan.' },
    { icon: 'fa-solid fa-repeat', title: 'Scene Transition', desc: 'Transisi antar scene yang mulus — dari opening, live game, timeout, hingga closing.' },
    { icon: 'fa-solid fa-ranking-star', title: 'Live Scoreboard', desc: 'Scoreboard real-time yang dapat diupdate langsung selama pertandingan berlangsung.' },
    { icon: 'fa-solid fa-broadcast-tower', title: 'Multi-Platform Stream', desc: 'Streaming ke YouTube Live dan platform lain secara bersamaan dalam satu sesi.' },
    { icon: 'fa-solid fa-palette', title: 'Broadcast Layout', desc: 'Layout siaran profesional dengan lower third, bumper video, dan intro/outro yang konsisten.' },
  ],
  techStack: [
    { icon: 'fa-solid fa-circle-dot', label: 'OBS Studio', desc: 'Engine utama streaming & recording' },
    { icon: 'fa-solid fa-tablet-screen-button', label: 'Web Controller', desc: 'Kontrol OBS via tablet browser' },
    { icon: 'fa-brands fa-figma', label: 'Figma', desc: 'Desain overlay & layout siaran' },
    { icon: 'fa-solid fa-sliders', label: 'vDeck / StreamDeck', desc: 'Hotkey & scene management' },
    { icon: 'fa-brands fa-youtube', label: 'YouTube Live', desc: 'Platform distribusi streaming' },
    { icon: 'fa-solid fa-fire', label: 'Firebase', desc: 'Real-time data & remote config' },
  ],
  tags: ['OBS Studio', 'Live Streaming', 'PERBASI', 'YEJBL', 'Tablet Controller', 'Overlay Design', 'Broadcast Layout', 'YouTube Live', 'Scene Transition', 'Lower Third'],
  externalLink: 'https://basketyuk.id/klasemen/youth-east-java-basketball-league-2026-seri-4/389',
};

/* ── Gallery Items ── */
const GALLERY_ITEMS = [
  {
    src: '/assets/img/obs-controller-1.png',
    alt: 'OBS Web Controller — Tablet View',
    caption: 'OBS Web Controller',
    cls: 'k4-gal-wide',
    descId: 'Tampilan utama OBS web controller yang diakses dari tablet. Panel ini memungkinkan operator mengganti scene, mengaktifkan overlay skor, dan mengatur transisi langsung dari lapangan — tanpa menyentuh keyboard atau mouse di komputer.',
    descEn: 'Main view of the OBS web controller accessed from a tablet. This panel lets the operator switch scenes, activate score overlays, and manage transitions directly from the court — without touching the keyboard or mouse at the computer.',
  },
  {
    src: '/assets/img/obs-controller-2.png',
    alt: 'OBS Web Controller — Scoreboard Panel',
    caption: 'Scoreboard Control Panel',
    cls: 'k4-gal-wide',
    descId: 'Panel kontrol scoreboard basket yang terintegrasi langsung ke OBS via WebSocket. Operator dapat memperbarui skor tim kiri/kanan, foul, ronde, dan waktu secara real-time selama pertandingan berlangsung.',
    descEn: 'Basketball scoreboard control panel integrated directly into OBS via WebSocket. The operator can update left/right team scores, fouls, round, and match time in real-time throughout the game.',
  },
  {
    src: '/assets/img/scoreboard-design.png',
    alt: 'Scoreboard Overlay Design — YEJBL',
    caption: 'Scoreboard Overlay Design',
    cls: 'k4-gal-full',
    descId: 'Desain overlay scoreboard kustom untuk YEJBL yang tampil langsung di layar siaran. Menampilkan skor, nama tim, foul count, nomor ronde, dan countdown timer — semuanya diperbarui secara live dari panel tablet.',
    descEn: 'Custom scoreboard overlay design for YEJBL displayed live on the broadcast screen. Shows scores, team names, foul counts, round number, and a countdown timer — all updated live from the tablet panel.',
  },
];

/* ── Image Modal ── */
function ImageModal({ src, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'k4ModalIn 0.25s ease' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }} />
      <div style={{ position: 'relative', zIndex: 1, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        <button onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', width: '44px', height: '44px', borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', transition: 'all 0.3s', zIndex: 2 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text)'; }}>
          <i className="fa-solid fa-xmark" />
        </button>
        <img src={src} alt="Preview" style={{ maxWidth: '90%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 25px 60px rgba(0,0,0,0.75)', animation: 'k4ImgIn 0.3s ease' }} loading="lazy" />
      </div>
    </div>
  );
}

export default function PortoKarya4({ t = {} }) {
  const navigate = useNavigate();
  const [data, setData] = useState(DEFAULT_DATA);
  const [openProcess, setOpenProcess] = useState(null);
  const [modalSrc, setModalSrc] = useState(null);
  const revealEls = useRef([]);

  const openModal  = useCallback((src) => setModalSrc(src), []);
  const closeModal = useCallback(() => setModalSrc(null), []);

  const r = (el) => {
    if (el && !revealEls.current.includes(el)) revealEls.current.push(el);
  };

  /* ── Reveal Observer ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    const timer = setTimeout(() => {
      revealEls.current.forEach((el) => { if (el) observer.observe(el); });
    }, 80);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, []);

  /* ── Firebase listener (uncomment setelah setup) ──
  useEffect(() => {
    const dataRef = ref(db, 'karya4');
    const unsub = onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (val) setData({ ...DEFAULT_DATA, ...val });
    });
    return () => unsub();
  }, []);
  ── */

  const d = data;

  return (
    <>
      <style>{`
        .k4-page { background: var(--bg); min-height: 100vh; }

        /* HERO */
        .k4-hero {
          min-height: 80vh; display: flex; flex-direction: column;
          justify-content: flex-end; padding: 140px 80px 80px;
          position: relative; overflow: hidden;
          border-bottom: 1px solid var(--border);
        }
        .k4-hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(139,92,246,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(34,197,94,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        .k4-hero-orb {
          position: absolute; top: -100px; right: -100px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%);
          pointer-events: none; filter: blur(40px);
          animation: k4OrbPulse 6s ease-in-out infinite alternate;
        }
        @keyframes k4OrbPulse {
          from { transform: scale(0.9); opacity: 0.7; }
          to   { transform: scale(1.15); opacity: 1; }
        }
        @keyframes k4ModalIn { from{opacity:0} to{opacity:1} }
        @keyframes k4ImgIn   { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }

        /* GALLERY */
        .k4-gal-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .k4-gal-item {
          position: relative; border-radius: 20px; overflow: hidden;
          background: var(--glass); border: 1px solid var(--border);
          transition: transform 0.4s ease, border-color 0.4s ease;
          cursor: pointer;
        }
        .k4-gal-item:hover { transform: translateY(-6px); border-color: rgba(139,92,246,0.35); }
        .k4-gal-wide { grid-column: span 1; aspect-ratio: 16/9; }
        .k4-gal-full { grid-column: span 2; aspect-ratio: 21/9; }
        .k4-gal-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; display: block; }
        .k4-gal-item:hover img { transform: scale(1.05); }
        .k4-gal-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 14px 18px;
          background: linear-gradient(to top, rgba(7,7,9,0.72) 0%, transparent 100%);
          font-size: 0.62rem; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(255,255,255,0.8);
          pointer-events: none;
        }
        .k4-gal-ph {
          width: 100%; height: 100%; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px;
          background: linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%);
          color: var(--text-dim); font-size: 0.65rem; letter-spacing: 0.18em;
          text-transform: uppercase; min-height: 180px;
        }
        .k4-gal-ph i { font-size: 2rem; opacity: 0.18; }
        .k4-gal-desc {
          padding: 16px 18px; font-size: 0.75rem; line-height: 1.75;
          color: var(--text-dim); border-top: 1px solid var(--border);
        }
        .k4-breadcrumb {
          font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--text-dim); margin-bottom: 20px; position: relative; z-index: 1;
        }
        .k4-breadcrumb span { color: var(--accent2); }
        .k4-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3);
          border-radius: 99px; padding: 6px 16px; font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: #22c55e;
          margin-bottom: 24px; position: relative; z-index: 1; width: fit-content;
        }
        .k4-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e;
          animation: k4Blink 1.5s ease-in-out infinite; }
        @keyframes k4Blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .k4-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 7vw, 7rem);
          font-weight: 300; line-height: 0.9; margin-bottom: 28px;
          position: relative; z-index: 1;
        }
        .k4-hero-title em { font-style: italic; color: var(--text-dim); }
        .k4-hero-sub {
          font-size: 0.9rem; color: var(--text-dim); max-width: 580px;
          line-height: 1.8; margin-bottom: 40px; position: relative; z-index: 1;
        }
        .k4-hero-meta {
          display: flex; flex-wrap: wrap; gap: 20px;
          position: relative; z-index: 1;
          padding-top: 28px; border-top: 1px solid var(--border);
        }
        .k4-meta-item { display: flex; flex-direction: column; gap: 4px; }
        .k4-meta-label { font-size: 0.56rem; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--text-dim); }
        .k4-meta-val { font-size: 0.82rem; font-weight: 500; color: var(--text); }

        /* SECTION BASE */
        .k4-section { padding: 80px 80px; border-top: 1px solid var(--border); }
        .k4-sec-label { display: block; font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-dim);
          margin-bottom: 12px; }
        .k4-sec-title { font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 4.5vw, 4.5rem); font-weight: 300; line-height: 0.92;
          margin-bottom: 48px; }
        .k4-sec-title em { font-style: italic; color: var(--text-dim); }

        /* OVERVIEW */
        .k4-overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
        .k4-overview-text p { font-size: 0.9rem; line-height: 1.9; color: var(--text-dim); margin-bottom: 20px; }

        /* STATS BAR */
        .k4-stats-bar {
          display: flex; align-items: center; justify-content: space-around;
          padding: 40px 80px; border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: var(--glass);
        }
        .k4-stat { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .k4-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem;
          font-weight: 300; color: var(--text); }
        .k4-stat-label { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--text-dim); }
        .k4-stat-line { width: 1px; height: 44px; background: var(--border2); }

        /* FEATURES GRID */
        .k4-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .k4-feat-card {
          background: var(--glass); border: 1px solid var(--border); border-radius: 20px;
          padding: 28px 24px; transition: all 0.35s ease; position: relative; overflow: hidden;
        }
        .k4-feat-card::before {
          content: ''; position: absolute; inset: 0; border-radius: 20px;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%);
          opacity: 0; transition: opacity 0.3s;
        }
        .k4-feat-card:hover { border-color: rgba(139,92,246,0.3); transform: translateY(-5px);
          box-shadow: 0 20px 50px var(--shadow); }
        .k4-feat-card:hover::before { opacity: 1; }
        .k4-feat-icon {
          width: 44px; height: 44px; border-radius: 13px;
          background: var(--glass2); border: 1px solid var(--border2);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; color: var(--accent2); margin-bottom: 16px;
          transition: all 0.3s; position: relative; z-index: 1;
        }
        .k4-feat-card:hover .k4-feat-icon { background: var(--accent); border-color: var(--accent); color: #fff; }
        .k4-feat-title { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem;
          font-weight: 600; margin-bottom: 10px; position: relative; z-index: 1; }
        .k4-feat-desc { font-size: 0.78rem; line-height: 1.78; color: var(--text-dim);
          position: relative; z-index: 1; }

        /* TECH STACK */
        .k4-tech-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 32px; }
        .k4-tech-item {
          display: flex; align-items: center; gap: 14px;
          background: var(--glass); border: 1px solid var(--border);
          border-radius: 14px; padding: 16px 18px; transition: all 0.28s;
        }
        .k4-tech-item:hover { border-color: var(--border2); background: var(--glass2); transform: translateY(-3px); }
        .k4-tech-icon { font-size: 1.2rem; color: var(--accent2); width: 22px; text-align: center; flex-shrink: 0; }
        .k4-tech-label { font-size: 0.82rem; font-weight: 600; margin-bottom: 2px; }
        .k4-tech-desc { font-size: 0.68rem; color: var(--text-dim); }
        .k4-tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
        .k4-tag { background: var(--glass); border: 1px solid var(--border2); border-radius: 99px;
          padding: 5px 14px; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--text-dim); transition: all 0.25s; }
        .k4-tag:hover { border-color: var(--accent3); color: var(--accent3); }

        /* FIREBASE BADGE */
        .k4-firebase-badge {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(255,140,0,0.08); border: 1px solid rgba(255,140,0,0.25);
          border-radius: 14px; padding: 14px 20px; margin-bottom: 32px;
          font-size: 0.75rem; color: #ffaa33; line-height: 1.5;
        }
        .k4-firebase-badge i { font-size: 1.2rem; flex-shrink: 0; }

        /* CTA */
        .k4-cta {
          background: var(--glass); border: 1px solid var(--border); border-radius: 28px;
          padding: 70px 80px; text-align: center; position: relative; overflow: hidden;
          margin: 0 80px 80px;
        }
        .k4-cta-glow {
          position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
          width: 400px; height: 200px; pointer-events: none;
          background: radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%);
        }
        .k4-cta::after {
          content: ''; position: absolute; top: 0; left: 15%; right: 15%;
          height: 1px; background: linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent);
        }
        .k4-cta-eyebrow { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.28em;
          text-transform: uppercase; color: var(--accent2); margin-bottom: 14px;
          position: relative; z-index: 1; }
        .k4-cta-title { font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4.5vw, 4rem); font-weight: 300; line-height: 1.05;
          margin-bottom: 16px; position: relative; z-index: 1; }
        .k4-cta-title em { font-style: italic; color: var(--text-dim); }
        .k4-cta-btns { display: flex; align-items: center; justify-content: center;
          gap: 14px; flex-wrap: wrap; margin-top: 32px; position: relative; z-index: 1; }
        .k4-btn-main {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--accent); color: #fff; border: none; border-radius: 99px;
          padding: 14px 34px; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer;
          box-shadow: 0 8px 28px rgba(139,92,246,0.35); transition: all 0.3s;
        }
        .k4-btn-main:hover { background: var(--accent2); transform: scale(1.05); }
        .k4-btn-sec {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--glass2); color: var(--text); border: 1px solid var(--border2);
          border-radius: 99px; padding: 14px 28px; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer;
          text-decoration: none; transition: all 0.3s;
        }
        .k4-btn-sec:hover { border-color: var(--accent2); color: var(--accent2); }

        /* NAV */
        .k4-nav { display: flex; align-items: center; justify-content: space-between;
          padding: 32px 80px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 16px; }
        .k4-nav-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--glass2); border: 1px solid var(--border);
          border-radius: 99px; padding: 12px 24px; font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-dim);
          cursor: pointer; transition: all 0.28s;
        }
        .k4-nav-btn:hover { border-color: var(--text); color: var(--text); }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .k4-hero { padding: 130px 40px 70px; }
          .k4-section { padding: 70px 40px; }
          .k4-stats-bar { padding: 32px 40px; }
          .k4-cta { margin: 0 40px 70px; padding: 55px 50px; }
          .k4-nav { padding: 28px 40px; }
          .k4-overview-grid { grid-template-columns: 1fr; gap: 32px; }
          .k4-tech-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .k4-hero { padding: 110px 24px 60px; }
          .k4-section { padding: 55px 24px; }
          .k4-stats-bar { padding: 28px 24px; flex-wrap: wrap; gap: 20px; }
          .k4-stat-line { display: none; }
          .k4-features-grid { grid-template-columns: 1fr; }
          .k4-tech-grid { grid-template-columns: 1fr; }
          .k4-cta { margin: 0 24px 60px; padding: 40px 24px; }
          .k4-nav { padding: 24px 24px; }
          .k4-gal-grid { grid-template-columns: 1fr; }
          .k4-gal-wide, .k4-gal-full { grid-column: span 1; aspect-ratio: 16/9; }
        }
      `}</style>

      <div className="k4-page">

        {/* ══ HERO ══ */}
        <section className="k4-hero">
          <div className="k4-hero-bg" />
          <div className="k4-hero-orb" />

          <div ref={r} className="k4-breadcrumb reveal">
            Work <span>/ Live Stream</span>
          </div>

          <div ref={r} className="k4-badge reveal rv-d1">
            <span className="k4-badge-dot" />
            {d.hero.badge}
          </div>

          <h1 ref={r} className="k4-hero-title reveal rv-d2">
            {d.hero.title}<br />
            <em>{d.hero.titleEm}</em>
          </h1>

          <p ref={r} className="k4-hero-sub reveal rv-d3">{d.hero.sub}</p>

          <div ref={r} className="k4-hero-meta reveal rv-d4">
            <div className="k4-meta-item">
              <span className="k4-meta-label">Tahun</span>
              <span className="k4-meta-val">{d.hero.year}</span>
            </div>
            <div className="k4-meta-item">
              <span className="k4-meta-label">Peran</span>
              <span className="k4-meta-val">{d.hero.role}</span>
            </div>
            <div className="k4-meta-item">
              <span className="k4-meta-label">Status</span>
              <span className="k4-meta-val">{d.hero.duration}</span>
            </div>
            <div className="k4-meta-item">
              <span className="k4-meta-label">Client</span>
              <span className="k4-meta-val">{d.hero.client}</span>
            </div>
          </div>
        </section>

        {/* ══ OVERVIEW ══ */}
        <section className="k4-section">
          <span ref={r} className="k4-sec-label reveal">01 / Gambaran Proyek</span>
          <h2 ref={r} className="k4-sec-title reveal rv-d1">
            Tentang Proyek <em>Ini.</em>
          </h2>
          <div className="k4-overview-grid">
            <div ref={r} className="k4-overview-text reveal">
              <p>{d.overview.p1}</p>
              <p>{d.overview.p2}</p>
            </div>
            <div ref={r} className="k4-firebase-badge reveal rv-d1">
              <i className="fa-solid fa-fire" />
              <div>
                <strong>Firebase Ready</strong><br />
                Konten halaman ini dapat diedit langsung dari Firebase Console — tanpa perlu coding atau deploy ulang. Setup Firebase di bagian atas file untuk mengaktifkan fitur ini.
              </div>
            </div>
          </div>
        </section>

        {/* ══ STATS BAR ══ */}
        <div ref={r} className="k4-stats-bar reveal">
          {d.stats.map((s, i) => (
            <div key={i} style={{ display: 'contents' }}>
              {i > 0 && <div className="k4-stat-line" />}
              <div className="k4-stat">
                <span className="k4-stat-val">{s.val}</span>
                <span className="k4-stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ══ GALLERY ══ */}
        <section className="k4-section">
          <span ref={r} className="k4-sec-label reveal">02 / Gallery</span>
          <h2 ref={r} className="k4-sec-title reveal rv-d1">
            Visual <em>Showcase.</em>
          </h2>
          <div ref={r} className="k4-gal-grid reveal rv-d2">
            {GALLERY_ITEMS.map((item, i) => (
              <div key={i} className={`k4-gal-item ${item.cls}`}
                style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                onClick={() => openModal(item.src)}
              >
                <div style={{ position: 'relative', flex: '1 1 auto', overflow: 'hidden' }}>
                  <img
                    src={item.src}
                    alt={item.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', display: 'block' }}
                    onError={(e) => { e.currentTarget.parentElement.innerHTML = `<div class="k4-gal-ph"><i class="fa-solid fa-display" style="font-size:2rem;opacity:0.18"></i><span>${item.caption}</span></div>`; }}
                  />
                  <div className="k4-gal-caption">{item.caption}</div>
                </div>
                <div className="k4-gal-desc" onClick={(e) => e.stopPropagation()}>
                  {item.descId}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section className="k4-section">
          <span ref={r} className="k4-sec-label reveal">03 / Fitur</span>
          <h2 ref={r} className="k4-sec-title reveal rv-d1">
            Fitur & <em>Keunggulan.</em>
          </h2>
          <div className="k4-features-grid">
            {d.features.map((f, i) => (
              <div key={i} ref={r} className="k4-feat-card reveal">
                <div className="k4-feat-icon"><i className={f.icon} /></div>
                <h3 className="k4-feat-title">{f.title}</h3>
                <p className="k4-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ TECH STACK ══ */}
        <section className="k4-section">
          <span ref={r} className="k4-sec-label reveal">04 / Teknologi</span>
          <h2 ref={r} className="k4-sec-title reveal rv-d1">
            Tech <em>Stack.</em>
          </h2>
          <div ref={r} className="k4-tech-grid reveal rv-d1">
            {d.techStack.map((t, i) => (
              <div key={i} className="k4-tech-item">
                <i className={`${t.icon} k4-tech-icon`} />
                <div>
                  <div className="k4-tech-label">{t.label}</div>
                  <div className="k4-tech-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div ref={r} className="k4-tag-cloud reveal rv-d2">
            {d.tags.map((tag, i) => <span key={i} className="k4-tag">{tag}</span>)}
          </div>
        </section>

        {/* ══ CTA ══ */}
        <div ref={r} className="k4-cta reveal">
          <div className="k4-cta-glow" />
          <p className="k4-cta-eyebrow">Butuh tim live streaming profesional?</p>
          <h3 className="k4-cta-title">
            Mari wujudkan siaran<br />
            <em>yang berkesan.</em>
          </h3>
          <div className="k4-cta-btns">
            <button className="k4-btn-main" onClick={() => navigate('/contact')}>
              {t.k4CTABtn || 'Start a Project Now'}
              <i className="fa-solid fa-arrow-up-right" />
            </button>
            <a
              href={d.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="k4-btn-sec"
            >
              <i className="fa-solid fa-basketball" />
              {t.k4CTABtnLive || 'View YEJBL Schedule'}
            </a>
          </div>
        </div>

        {/* ══ NAVIGATION ══ */}
        <div className="k4-nav">
          <button className="k4-nav-btn" onClick={() => navigate('/porto')}>
            <i className="fa-solid fa-arrow-left" /> {t.karyaNavBackLabel || 'Back to Work'}
          </button>
          <button className="k4-nav-btn" onClick={() => navigate('/porto/karya1')}>
            <i className="fa-solid fa-arrow-left" /> {t.k4NavPrevTitle || 'Video Editing Collection'}
          </button>
        </div>

      </div>
      {modalSrc && <ImageModal src={modalSrc} onClose={closeModal} />}
    </>
  );
}
