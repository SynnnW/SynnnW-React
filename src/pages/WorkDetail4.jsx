// src/pages/WorkDetail4.jsx
// RENAME dari PortoKarya4.jsx → WorkDetail4.jsx
// Route: /works/livestream-perbasi
//
// CHANGES (Prompt 12):
// 1. Export function: PortoKarya4 → WorkDetail4
// 2. navigate('/porto') → navigate('/works')
// 3. navigate('/porto/karya1') → navigate('/works/birthday-gift')
// 4. Updated description EN + ID (PERBASI Probolinggo Regency fix)
// 5. Updated hero.sub, hero.client, overview paragraphs

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/* ══════════════════════════════════════════════════════
   WORKDETAIL4 — Live Stream Design & OBS via Tablet
   PERBASI Youth East Java Basketball League
   Probolinggo Regency (Kabupaten 14, East Java)
══════════════════════════════════════════════════════ */

const DEFAULT_DATA = {
  hero: {
    badge: 'Live Stream & Broadcast',
    title: 'Live Stream Design &',
    titleEm: 'OBS via Tablet',
    // UPDATED description EN (Prompt 12 fix)
    sub: 'Live stream production system for PERBASI Youth East Java Basketball League — Probolinggo Regency. Built a custom OBS overlay system and controlled the entire broadcast from a tablet-based web application in real time.',
    year: '2024',
    role: 'Stream Designer & Operator',
    duration: 'Ongoing',
    // UPDATED client (Prompt 12)
    client: 'PERBASI Youth East Java Basketball League — Probolinggo Regency',
  },
  overview: {
    // UPDATED p1 (Probolinggo Regency = Kabupaten 14, Jawa Timur)
    p1: 'Proyek ini lahir dari kebutuhan nyata PERBASI Kabupaten Probolinggo (Kabupaten ke-14, Jawa Timur) untuk menghadirkan siaran live streaming pertandingan basket YEJBL dengan tampilan yang profesional, dinamis, dan menarik — setara kualitas siaran olahraga nasional, namun dioperasikan secara mandiri tanpa tim teknis besar.',
    p2: 'Tantangan utamanya adalah: bagaimana seorang operator bisa mengontrol seluruh siaran — scene switching, scoreboard, transisi, timer — tanpa harus duduk terus di depan komputer? Solusi yang dikembangkan adalah sistem OBS berbasis kontrol tablet via website custom. Operator cukup pegang tablet, sentuh panel, dan semua perubahan langsung terefleksi di layar siaran secara instan.',
    p3: 'Dari sisi desain, seluruh elemen visual overlay dirancang dari nol menggunakan Figma — mulai dari scoreboard, lower third nama pemain, bumper transisi, hingga template opening dan closing yang konsisten dengan identitas visual YEJBL. Hasilnya adalah paket siaran yang terasa utuh dan berkarakter.',
    p4: 'Sistem ini sudah berjalan aktif di beberapa seri turnamen YEJBL dan terus dikembangkan. Setiap pertandingan menjadi kesempatan untuk iterasi — menambah fitur baru, menyempurnakan layout, dan meningkatkan kualitas broadcast secara keseluruhan.',
  },
  stats: [
    { val: 'OBS', label: 'Streaming Engine' },
    { val: 'Tablet', label: 'Controller Device' },
    { val: 'YEJBL', label: 'Client Event' },
    { val: 'Live', label: 'Production Type' },
  ],
  features: [
    {
      icon: 'fa-solid fa-layer-group',
      title: 'Custom Overlay Design',
      desc: 'Seluruh elemen overlay dirancang dari nol di Figma — scoreboard dengan font yang bold dan terbaca jelas dari layar monitor maupun HP penonton, lower third nama pemain, animasi transisi scene, hingga template bumper dan sponsor. Identitas visual YEJBL dijaga konsisten di setiap frame siaran.',
    },
    {
      icon: 'fa-solid fa-tablet-screen-button',
      title: 'Tablet Web Controller',
      desc: 'Panel kontrol OBS berbasis website yang bisa diakses dari browser tablet mana pun. Tidak perlu install aplikasi khusus, tidak perlu keyboard, tidak perlu mouse. Operator cukup pegang tablet dan mengontrol seluruh siaran dari mana saja selama masih dalam jaringan yang sama — sangat fleksibel untuk lingkungan lapangan olahraga yang dinamis.',
    },
    {
      icon: 'fa-solid fa-repeat',
      title: 'Scene Transition',
      desc: 'Manajemen scene lengkap — dari opening countdown sebelum tipoff, live game view dengan scoreboard aktif, timeout screen dengan animasi, halftime break, hingga closing credit. Setiap transisi antar scene menggunakan efek yang smooth agar penonton tidak merasakan perpindahan yang kasar atau mendadak.',
    },
    {
      icon: 'fa-solid fa-ranking-star',
      title: 'Live Scoreboard',
      desc: 'Scoreboard real-time yang terintegrasi langsung ke OBS via WebSocket. Operator update skor, foul, ronde, dan waktu dari panel tablet — perubahan langsung muncul di overlay siaran dalam hitungan milidetik. Tidak ada delay, tidak ada copy-paste manual, tidak ada resiko salah angka karena human error.',
    },
    {
      icon: 'fa-solid fa-broadcast-tower',
      title: 'Multi-Platform Stream',
      desc: 'Output streaming langsung ke YouTube Live menggunakan stream key yang sudah dikonfigurasi di OBS. Dengan satu klik Record & Stream, siaran langsung terdistribusi ke channel resmi PERBASI Kabupaten Probolinggo — sekaligus tersimpan sebagai file rekaman lokal untuk keperluan highlight dan dokumentasi.',
    },
    {
      icon: 'fa-solid fa-palette',
      title: 'Broadcast Layout',
      desc: 'Layout siaran yang dirancang dengan prinsip keterbacaan tinggi dan estetika yang kuat. Setiap elemen ditempatkan agar tidak saling bertabrakan — skor di pojok, nama tim terbaca jelas, timer tidak menutupi aksi pemain. Sistem ini juga mendukung penambahan lower third dinamis untuk highlight pemain atau momen penting.',
    },
  ],
  techStack: [
    { icon: 'fa-solid fa-circle-dot', label: 'OBS Studio', desc: 'Engine utama streaming & recording' },
    { icon: 'fa-solid fa-tablet-screen-button', label: 'Web Controller', desc: 'Kontrol OBS via tablet browser' },
    { icon: 'fa-brands fa-figma', label: 'Figma', desc: 'Desain overlay & layout siaran' },
    { icon: 'fa-solid fa-sliders', label: 'vDeck / StreamDeck', desc: 'Hotkey & scene management' },
    { icon: 'fa-brands fa-youtube', label: 'YouTube Live', desc: 'Platform distribusi streaming' },
    { icon: 'fa-solid fa-fire', label: 'Firebase', desc: 'Real-time data & remote config' },
  ],
  tags: ['OBS Studio', 'Live Streaming', 'PERBASI', 'YEJBL', 'Probolinggo Regency', 'Tablet Controller', 'Overlay Design', 'Broadcast Layout', 'YouTube Live', 'Scene Transition', 'Lower Third', 'WebSocket', 'Figma', 'Scoreboard Real-time'],
  externalLink: 'https://basketyuk.id/klasemen/youth-east-java-basketball-league-2026-seri-4/389',
  demoLink: 'https://obss-livid.vercel.app/',
  youtubeVideoId: 'LJHbo9zjma0',
  youtubeChannel: 'https://www.youtube.com/@perbasikabupatenprobolingg6971/streams',
};

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
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', width: '44px', height: '44px', borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', transition: 'all 0.3s', zIndex: 2 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text)'; }}>
          <i className="fa-solid fa-xmark" />
        </button>
        <img
          src={src}
          alt="Preview"
          style={{ maxWidth: '90%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 25px 60px rgba(0,0,0,0.75)', animation: 'k4ImgIn 0.3s ease' }}
          loading="lazy"
        />
      </div>
    </div>
  );
}

// RENAMED: PortoKarya4 → WorkDetail4
export default function WorkDetail4({ t = {} }) {
  const navigate = useNavigate();
  const [data] = useState(DEFAULT_DATA);
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

        /* DEMO SECTION */
        .k4-demo-card {
          display: flex; align-items: center; gap: 40px;
          background: linear-gradient(135deg, rgba(34,197,94,0.05) 0%, rgba(139,92,246,0.05) 100%);
          border: 1px solid rgba(34,197,94,0.2); border-radius: 24px;
          padding: 48px 56px; position: relative; overflow: hidden;
        }
        .k4-demo-card::before {
          content: ''; position: absolute; top: -1px; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent);
        }
        .k4-demo-icon-wrap {
          width: 80px; height: 80px; border-radius: 20px; flex-shrink: 0;
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; color: #22c55e;
        }
        .k4-demo-text { flex: 1; }
        .k4-demo-text h3 {
          font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 600;
          margin-bottom: 10px; line-height: 1.1;
        }
        .k4-demo-text p {
          font-size: 0.83rem; line-height: 1.8; color: var(--text-dim); margin-bottom: 24px;
        }
        .k4-demo-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: #22c55e; color: #fff; border: none; border-radius: 99px;
          padding: 13px 32px; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none;
          transition: all 0.3s; cursor: pointer;
          box-shadow: 0 8px 28px rgba(34,197,94,0.3);
        }
        .k4-demo-btn:hover { background: #16a34a; transform: scale(1.05); }
        .k4-demo-url {
          display: inline-flex; align-items: center; gap: 8px;
          margin-left: 14px; font-size: 0.7rem; color: var(--text-dim);
          text-decoration: none; letter-spacing: 0.08em;
          transition: color 0.25s;
        }
        .k4-demo-url:hover { color: #22c55e; }

        /* YOUTUBE SECTION */
        .k4-yt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .k4-yt-embed-wrap {
          border-radius: 20px; overflow: hidden; position: relative;
          aspect-ratio: 16/9; border: 1px solid var(--border);
          background: #000;
        }
        .k4-yt-embed-wrap iframe {
          width: 100%; height: 100%; border: none; display: block;
        }
        .k4-yt-channel-card {
          display: flex; flex-direction: column; justify-content: space-between;
          background: linear-gradient(135deg, rgba(255,0,0,0.06) 0%, rgba(139,92,246,0.04) 100%);
          border: 1px solid rgba(255,60,60,0.18); border-radius: 20px;
          padding: 36px 36px; position: relative; overflow: hidden;
        }
        .k4-yt-channel-card::before {
          content: ''; position: absolute; top: -1px; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,60,60,0.4), transparent);
        }
        .k4-yt-channel-logo {
          width: 60px; height: 60px; border-radius: 50%;
          background: rgba(255,0,0,0.12); border: 1px solid rgba(255,60,60,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem; color: #ff4444; margin-bottom: 20px;
        }
        .k4-yt-channel-card h3 {
          font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; font-weight: 600;
          margin-bottom: 10px; line-height: 1.15;
        }
        .k4-yt-channel-card p {
          font-size: 0.78rem; line-height: 1.8; color: var(--text-dim); margin-bottom: 28px; flex: 1;
        }
        .k4-yt-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: #ff0000; color: #fff; border: none; border-radius: 99px;
          padding: 12px 28px; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none;
          transition: all 0.3s; width: fit-content;
          box-shadow: 0 6px 22px rgba(255,0,0,0.25);
        }
        .k4-yt-btn:hover { background: #cc0000; transform: scale(1.04); }
        .k4-yt-label {
          font-size: 0.58rem; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: #ff4444; margin-bottom: 8px;
          display: flex; align-items: center; gap: 6px;
        }
        .k4-yt-label-dot { width: 6px; height: 6px; border-radius: 50%; background: #ff4444;
          animation: k4Blink 1.5s infinite; }
        .k4-yt-note {
          font-size: 0.7rem; color: var(--text-dim); margin-top: 12px;
          line-height: 1.65; font-style: italic;
        }

        /* OVERVIEW EXTENDED */
        .k4-overview-extended {
          margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
        }
        .k4-overview-ext-card {
          background: var(--glass); border: 1px solid var(--border); border-radius: 18px;
          padding: 28px 26px;
        }
        .k4-overview-ext-card h4 {
          font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 600;
          margin-bottom: 10px; display: flex; align-items: center; gap: 10px;
        }
        .k4-overview-ext-card h4 i { font-size: 0.95rem; color: var(--accent2); }
        .k4-overview-ext-card p {
          font-size: 0.78rem; line-height: 1.82; color: var(--text-dim);
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

        /* REVEAL ANIMATION */
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .rv-d1 { transition-delay: 0.1s; }
        .rv-d2 { transition-delay: 0.2s; }
        .rv-d3 { transition-delay: 0.3s; }
        .rv-d4 { transition-delay: 0.4s; }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .k4-hero { padding: 130px 40px 70px; }
          .k4-section { padding: 70px 40px; }
          .k4-stats-bar { padding: 32px 40px; }
          .k4-cta { margin: 0 40px 70px; padding: 55px 50px; }
          .k4-nav { padding: 28px 40px; }
          .k4-overview-grid { grid-template-columns: 1fr; gap: 32px; }
          .k4-tech-grid { grid-template-columns: repeat(2, 1fr); }
          .k4-demo-card { flex-direction: column; gap: 24px; padding: 36px 36px; }
          .k4-yt-grid { grid-template-columns: 1fr; }
          .k4-overview-extended { grid-template-columns: 1fr; }
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
          .k4-demo-card { padding: 28px 24px; }
          .k4-yt-channel-card { padding: 28px 24px; }
        }
      `}</style>

      <div className="k4-page">

        {/* ══ HERO ══ */}
        <section className="k4-hero">
          <div className="k4-hero-bg" />
          <div className="k4-hero-orb" />

          {/* UPDATED breadcrumb: Works (bukan /porto) */}
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

          {/* UPDATED sub (shorter, cleaner — Prompt 12) */}
          <p ref={r} className="k4-hero-sub reveal rv-d3">{d.hero.sub}</p>

          <div ref={r} className="k4-hero-meta reveal rv-d4">
            <div className="k4-meta-item">
              <span className="k4-meta-label">Year</span>
              <span className="k4-meta-val">{d.hero.year}</span>
            </div>
            <div className="k4-meta-item">
              <span className="k4-meta-label">Role</span>
              <span className="k4-meta-val">{d.hero.role}</span>
            </div>
            <div className="k4-meta-item">
              <span className="k4-meta-label">Status</span>
              <span className="k4-meta-val">{d.hero.duration}</span>
            </div>
            <div className="k4-meta-item">
              <span className="k4-meta-label">Client</span>
              {/* UPDATED client: includes "Probolinggo Regency" */}
              <span className="k4-meta-val">{d.hero.client}</span>
            </div>
          </div>
        </section>

        {/* ══ OVERVIEW ══ */}
        <section className="k4-section">
          <span ref={r} className="k4-sec-label reveal">01 / Project Overview</span>
          <h2 ref={r} className="k4-sec-title reveal rv-d1">
            About This <em>Project.</em>
          </h2>
          <div className="k4-overview-grid">
            <div ref={r} className="k4-overview-text reveal">
              {/* UPDATED p1 — includes Kabupaten 14 Jawa Timur */}
              <p>{d.overview.p1}</p>
              <p>{d.overview.p2}</p>
              <p>{d.overview.p3}</p>
              <p>{d.overview.p4}</p>
            </div>
            <div>
              <div ref={r} className="k4-firebase-badge reveal rv-d1">
                <i className="fa-solid fa-fire" />
                <div>
                  <strong>Firebase Ready</strong><br />
                  Konten halaman ini dapat diedit langsung dari Firebase Console — tanpa perlu coding atau deploy ulang.
                </div>
              </div>
              <div ref={r} className="reveal rv-d2" style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px 22px', marginTop: '16px' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '14px' }}>Key Highlights</div>
                {[
                  { icon: 'fa-solid fa-wifi', text: 'Kontrol OBS dari tablet via jaringan lokal — tanpa kabel, tanpa software tambahan' },
                  { icon: 'fa-solid fa-bolt', text: 'Update scoreboard real-time via WebSocket — perubahan muncul instan di siaran' },
                  { icon: 'fa-solid fa-paint-brush', text: 'Seluruh desain overlay dibuat custom di Figma sesuai identitas YEJBL' },
                  { icon: 'fa-brands fa-youtube', text: 'Distribusi langsung ke YouTube Live dengan stream key terenkripsi' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: i < 3 ? '12px' : 0 }}>
                    <i className={item.icon} style={{ color: 'var(--accent2)', marginTop: '3px', flexShrink: 0, width: '14px', textAlign: 'center' }} />
                    <span style={{ fontSize: '0.78rem', lineHeight: 1.7, color: 'var(--text-dim)' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Extended cards */}
          <div ref={r} className="k4-overview-extended reveal rv-d2">
            {[
              { icon: 'fa-solid fa-lightbulb', title: 'Background', text: 'PERBASI Kabupaten Probolinggo (Kabupaten ke-14, Jawa Timur) menyelenggarakan YEJBL secara rutin setiap tahun. Sebelumnya siaran dilakukan dengan setup sederhana tanpa overlay dinamis. Proyek ini hadir untuk mengangkat kualitas broadcast agar lebih kompetitif dan membanggakan bagi atlet, orang tua, dan penonton.' },
              { icon: 'fa-solid fa-wrench', title: 'Technical Approach', text: 'OBS WebSocket digunakan sebagai jembatan antara website tablet controller dan software OBS di komputer. Setiap tombol di website mengirimkan perintah ke OBS secara real-time — scene switch, update text source scoreboard, toggle visibility overlay — tanpa latency yang terasa.' },
              { icon: 'fa-solid fa-chart-line', title: 'Impact & Results', text: 'Sejak sistem ini diterapkan, kualitas visual siaran YEJBL meningkat signifikan. Penonton live streaming bertambah, komentar positif mengalir di kolom chat YouTube, dan tim PERBASI merasa lebih percaya diri menghadirkan siaran yang terlihat profesional.' },
              { icon: 'fa-solid fa-arrows-rotate', title: 'Ongoing Development', text: 'Proyek ini masih aktif dikembangkan. Setiap seri turnamen membawa kebutuhan baru — layout baru, fitur tambahan, perbaikan UX panel tablet. Roadmap ke depan termasuk integrasi Firebase untuk remote config dan multi-operator support.' },
            ].map((card, i) => (
              <div key={i} className="k4-overview-ext-card">
                <h4><i className={card.icon} /> {card.title}</h4>
                <p>{card.text}</p>
              </div>
            ))}
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
              <div
                key={i}
                className={`k4-gal-item ${item.cls}`}
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

        {/* ══ LIVE DEMO ══ */}
        <section className="k4-section">
          <span ref={r} className="k4-sec-label reveal">03 / Live Demo</span>
          <h2 ref={r} className="k4-sec-title reveal rv-d1">
            Try It <em>Live.</em>
          </h2>
          <div ref={r} className="k4-demo-card reveal">
            <div className="k4-demo-icon-wrap">
              <i className="fa-solid fa-display" />
            </div>
            <div className="k4-demo-text">
              <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#22c55e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'k4Blink 1.5s infinite' }} />
                Live Demo Available
              </div>
              <h3>Try the OBS Web Controller</h3>
              <p>
                Website OBS controller ini bisa dicoba langsung dari browser kamu — tidak perlu install apa pun. Buka linknya, dan kamu bisa melihat sendiri bagaimana tampilan panel kontrol yang digunakan operator saat siaran berlangsung. Untuk penggunaan penuh, controller ini perlu terhubung ke OBS Studio via WebSocket di jaringan yang sama.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <a href={d.demoLink} target="_blank" rel="noopener noreferrer" className="k4-demo-btn">
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                  Open Web Controller
                </a>
                <a href={d.demoLink} target="_blank" rel="noopener noreferrer" className="k4-demo-url">
                  <i className="fa-solid fa-link" />
                  obss-livid.vercel.app
                </a>
              </div>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '14px', marginBottom: 0, fontStyle: 'italic', lineHeight: 1.65 }}>
                * Controller ini merupakan modifikasi custom dari OBS-web open source yang dikembangkan oleh Niek van der Maas, dengan tambahan fitur scoreboard basket khusus untuk kebutuhan YEJBL.
              </p>
            </div>
          </div>
        </section>

        {/* ══ YOUTUBE ══ */}
        <section className="k4-section">
          <span ref={r} className="k4-sec-label reveal">04 / Live on YouTube</span>
          <h2 ref={r} className="k4-sec-title reveal rv-d1">
            Watch the <em>Broadcast.</em>
          </h2>
          <p ref={r} className="reveal rv-d1" style={{ fontSize: '0.88rem', color: 'var(--text-dim)', maxWidth: '620px', lineHeight: 1.85, marginBottom: '40px' }}>
            Hasil nyata dari sistem ini bisa disaksikan langsung di channel YouTube resmi PERBASI Kabupaten Probolinggo. Setiap pertandingan YEJBL distreaming secara live menggunakan setup yang sama — OBS Studio dengan overlay kustom, dikontrol dari tablet via web controller ini.
          </p>
          <div ref={r} className="k4-yt-grid reveal rv-d2">

            {/* Video Embed */}
            <div>
              <div className="k4-yt-label" style={{ marginBottom: '12px' }}>
                <span className="k4-yt-label-dot" />
                YEJBL Broadcast Sample
              </div>
              <div className="k4-yt-embed-wrap">
                <iframe
                  src={`https://www.youtube.com/embed/${d.youtubeVideoId}`}
                  title="YEJBL Live Stream — PERBASI Kabupaten Probolinggo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="k4-yt-note">
                Siaran ini menggunakan sistem OBS web controller yang dikembangkan dalam proyek ini. Overlay scoreboard, timer, dan transisi scene semua dikendalikan secara real-time dari tablet oleh operator selama pertandingan berlangsung.
              </p>
            </div>

            {/* Channel Card */}
            <div className="k4-yt-channel-card">
              <div>
                <div className="k4-yt-channel-logo">
                  <i className="fa-brands fa-youtube" />
                </div>
                <h3>PERBASI Kab. Probolinggo — YouTube Channel</h3>
                <p>
                  Channel YouTube resmi PERBASI Kabupaten Probolinggo adalah rumah dari semua siaran pertandingan YEJBL dan event basket lainnya. Dari sini penonton bisa menyaksikan seluruh arsip pertandingan — mulai dari babak penyisihan, semifinal, hingga grand final.
                  <br /><br />
                  Setiap video yang ada di channel ini merupakan hasil kerja nyata dari sistem streaming yang dibangun dalam proyek ini: overlay yang terdesain rapi, scoreboard yang selalu akurat, dan transisi scene yang mulus.
                </p>
              </div>
              <div>
                <a href={d.youtubeChannel} target="_blank" rel="noopener noreferrer" className="k4-yt-btn">
                  <i className="fa-brands fa-youtube" />
                  View All Broadcasts
                </a>
                <p className="k4-yt-note" style={{ marginTop: '16px' }}>
                  Kunjungi tab <strong>Live</strong> dan <strong>Videos</strong> untuk melihat semua rekaman pertandingan YEJBL yang sudah disiarkan.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section className="k4-section">
          <span ref={r} className="k4-sec-label reveal">05 / Features</span>
          <h2 ref={r} className="k4-sec-title reveal rv-d1">
            Features & <em>Capabilities.</em>
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
          <span ref={r} className="k4-sec-label reveal">06 / Technology</span>
          <h2 ref={r} className="k4-sec-title reveal rv-d1">
            Tech <em>Stack.</em>
          </h2>
          <div ref={r} className="k4-tech-grid reveal rv-d1">
            {d.techStack.map((tech, i) => (
              <div key={i} className="k4-tech-item">
                <i className={`${tech.icon} k4-tech-icon`} />
                <div>
                  <div className="k4-tech-label">{tech.label}</div>
                  <div className="k4-tech-desc">{tech.desc}</div>
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
          <p className="k4-cta-eyebrow">Need a professional live streaming team?</p>
          <h3 className="k4-cta-title">
            Let's create a broadcast<br />
            <em>that makes an impact.</em>
          </h3>
          <div className="k4-cta-btns">
            {/* navigate('/contact') stays — Contact.jsx exists per Prompt 39 */}
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
        {/* UPDATED: navigate('/porto') → navigate('/works') */}
        {/* UPDATED: navigate('/porto/karya1') → navigate('/works/birthday-gift') */}
        <div className="k4-nav">
          <button className="k4-nav-btn" onClick={() => navigate('/works')}>
            <i className="fa-solid fa-arrow-left" /> Back to Works
          </button>
          <button className="k4-nav-btn" onClick={() => navigate('/works/birthday-gift')}>
            <i className="fa-solid fa-arrow-left" /> Interactive Birthday Gift
          </button>
        </div>

      </div>

      {modalSrc && <ImageModal src={modalSrc} onClose={closeModal} />}
    </>
  );
}
