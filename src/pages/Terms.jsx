import { useState, useEffect, useRef } from 'react';

const CSS = `
/* ── Reset & Base ── */
.tos-page {
  min-height: 100vh;
  background: var(--bg, #070709);
  color: var(--text, #ffffff);
  font-family: 'Outfit', sans-serif;
  padding-top: 64px;
}

/* ── Layout wrapper ── */
.tos-layout {
  display: flex;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 32px 120px;
  gap: 0;
  align-items: flex-start;
  position: relative;
}

/* ══════════════════════════════════
   SIDEBAR TOC
══════════════════════════════════ */
.tos-sidebar {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(139,92,246,0.2) transparent;
  border-right: 1px solid rgba(255,255,255,0.07);
  padding: 32px 24px 32px 0;
}
.tos-sidebar::-webkit-scrollbar { width: 4px; }
.tos-sidebar::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.2); border-radius: 4px; }

.tos-toc-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text, #fff);
  letter-spacing: -0.01em;
  margin: 0 0 4px;
}
.tos-toc-logo span { color: #a78bfa; }
.tos-toc-sublabel {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(167,139,250,0.55);
  margin-bottom: 20px;
  display: block;
}
.tos-toc-divider {
  height: 1px;
  background: rgba(255,255,255,0.07);
  margin-bottom: 16px;
}
.tos-toc-label {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  margin-bottom: 12px;
  display: block;
}
.tos-toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tos-toc-item a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 500;
  color: rgba(148,163,184,0.75);
  text-decoration: none;
  transition: all 0.22s;
  border: 1px solid transparent;
  line-height: 1.3;
}
.tos-toc-item a:hover {
  color: #a78bfa;
  background: rgba(139,92,246,0.07);
}
.tos-toc-item.active a {
  color: #a78bfa;
  font-weight: 600;
  background: rgba(139,92,246,0.1);
  border-color: rgba(139,92,246,0.2);
}
.tos-toc-num {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(139,92,246,0.5);
  flex-shrink: 0;
  width: 18px;
}
.tos-toc-item.active .tos-toc-num { color: #a78bfa; }

/* ══════════════════════════════════
   MAIN CONTENT
══════════════════════════════════ */
.tos-main {
  flex: 1;
  padding: 40px 0 0 52px;
  min-width: 0;
}

/* ── Header ── */
.tos-header { margin-bottom: 40px; }
.tos-page-label {
  display: inline-block;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #a78bfa;
  margin-bottom: 14px;
}
.tos-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  font-weight: 300;
  line-height: 1.1;
  color: var(--text, #fff);
  margin: 0 0 12px;
  letter-spacing: -0.02em;
}
.tos-title em { font-style: italic; color: #a78bfa; }
.tos-header-sub {
  font-size: 0.9rem;
  color: rgba(148,163,184,0.8);
  margin: 0 0 18px;
  line-height: 1.6;
}
.tos-meta-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}
.tos-meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(148,163,184,0.75);
}
.tos-meta-pill i { color: #a78bfa; font-size: 0.65rem; }
.tos-header-actions { display: flex; gap: 10px; }
.tos-btn-dummy {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  cursor: default;
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(148,163,184,0.6);
  letter-spacing: 0.04em;
  opacity: 0.7;
}
.tos-btn-dummy i { font-size: 0.7rem; }
.tos-header-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(139,92,246,0.3), rgba(255,255,255,0.05), transparent);
  margin: 28px 0 0;
}

/* ── Sections ── */
.tos-sections { display: flex; flex-direction: column; gap: 0; }

.tos-section {
  padding: 44px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.tos-section:last-child { border-bottom: none; }

.tos-section-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.tos-section-num {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(139,92,246,0.5);
}
.tos-section-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(139,92,246,0.1);
  border: 1px solid rgba(139,92,246,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #a78bfa;
  flex-shrink: 0;
}
.tos-section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem;
  font-weight: 400;
  color: var(--text, #fff);
  margin: 0 0 16px;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

/* Body text */
.tos-section p {
  font-size: 0.95rem;
  color: rgba(203,213,225,0.85);
  line-height: 1.85;
  margin: 0 0 14px;
}
.tos-section p:last-child { margin-bottom: 0; }

/* Lists */
.tos-list {
  list-style: none;
  padding: 0;
  margin: 0 0 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tos-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.95rem;
  color: rgba(203,213,225,0.85);
  line-height: 1.7;
}
.tos-list li::before {
  content: '✦';
  color: #a78bfa;
  font-size: 0.6rem;
  flex-shrink: 0;
  margin-top: 5px;
}

/* Ordered list (steps) */
.tos-steps {
  list-style: none;
  padding: 0;
  margin: 0 0 14px;
  display: flex;
  flex-direction: column;
  gap: 0;
  counter-reset: step-counter;
}
.tos-steps li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 0.95rem;
  color: rgba(203,213,225,0.85);
  line-height: 1.7;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  counter-increment: step-counter;
}
.tos-steps li:last-child { border-bottom: none; }
.tos-step-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(139,92,246,0.12);
  border: 1px solid rgba(139,92,246,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: #a78bfa;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Highlight card */
.tos-highlight {
  padding: 16px 18px;
  background: rgba(139,92,246,0.06);
  border: 1px solid rgba(139,92,246,0.18);
  border-left: 3px solid #a78bfa;
  border-radius: 10px;
  font-size: 0.9rem;
  color: rgba(203,213,225,0.9);
  line-height: 1.7;
  margin: 14px 0;
}
.tos-highlight i { color: #a78bfa; margin-right: 6px; }

/* Warning card */
.tos-warning {
  padding: 14px 18px;
  background: rgba(251,191,36,0.06);
  border: 1px solid rgba(251,191,36,0.2);
  border-left: 3px solid rgba(251,191,36,0.7);
  border-radius: 10px;
  font-size: 0.88rem;
  color: rgba(251,191,36,0.85);
  line-height: 1.7;
  margin: 14px 0;
}
.tos-warning i { margin-right: 6px; }

/* Legal code ref */
.tos-legal-ref {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.82rem;
  background: rgba(139,92,246,0.08);
  border: 1px solid rgba(139,92,246,0.15);
  padding: 2px 7px;
  border-radius: 4px;
  color: #a78bfa;
}

/* Links */
.tos-link {
  color: #a78bfa;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 3px;
  transition: color 0.2s;
}
.tos-link:hover { color: #c4b5fd; text-decoration-style: solid; }

/* Definitions grid */
.tos-defs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 0 14px;
}
.tos-def-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  align-items: baseline;
}
.tos-def-row:last-child { border-bottom: none; }
.tos-def-term {
  font-size: 0.82rem;
  font-weight: 700;
  color: #a78bfa;
  font-family: 'Outfit', sans-serif;
}
.tos-def-desc {
  font-size: 0.92rem;
  color: rgba(203,213,225,0.85);
  line-height: 1.65;
}

/* ── Mobile TOC dropdown ── */
.tos-mobile-toc {
  display: none;
  margin-bottom: 24px;
}
.tos-mobile-toc-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(139,92,246,0.08);
  border: 1px solid rgba(139,92,246,0.2);
  border-radius: 12px;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #a78bfa;
}
.tos-mobile-toc-panel {
  margin-top: 8px;
  padding: 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  display: none;
}
.tos-mobile-toc-panel.open { display: block; }
.tos-mobile-toc-panel a {
  display: block;
  padding: 6px 10px;
  font-size: 0.8rem;
  color: rgba(148,163,184,0.8);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
}
.tos-mobile-toc-panel a:hover { color: #a78bfa; background: rgba(139,92,246,0.07); }

/* ── Responsive ── */
@media (max-width: 960px) {
  .tos-layout { padding: 0 24px 80px; gap: 0; }
  .tos-sidebar { width: 220px; }
  .tos-main { padding-left: 32px; }
}
@media (max-width: 768px) {
  .tos-layout { flex-direction: column; padding: 0 18px 80px; }
  .tos-sidebar { display: none; }
  .tos-main { padding: 24px 0 0; }
  .tos-mobile-toc { display: block; }
  .tos-def-row { grid-template-columns: 1fr; gap: 4px; }
}
@media (max-width: 480px) {
  .tos-title { font-size: 2rem; }
  .tos-section-title { font-size: 1.35rem; }
  .tos-header-actions { flex-direction: column; }
}
`;

/* ─────────────────────────────────────────────────────────────
   TOC DATA
───────────────────────────────────────────────────────────── */
const SECTIONS = [
  { id: 's01', num: '01', icon: 'fa-circle-info',     title: 'Pengantar' },
  { id: 's02', num: '02', icon: 'fa-book',            title: 'Definisi' },
  { id: 's03', num: '03', icon: 'fa-layer-group',     title: 'Layanan yang Disediakan' },
  { id: 's04', num: '04', icon: 'fa-cart-shopping',   title: 'Proses Pemesanan' },
  { id: 's05', num: '05', icon: 'fa-credit-card',     title: 'Ketentuan Pembayaran' },
  { id: 's06', num: '06', icon: 'fa-rotate',          title: 'Revisi' },
  { id: 's07', num: '07', icon: 'fa-shield-halved',   title: 'Hak Kekayaan Intelektual' },
  { id: 's08', num: '08', icon: 'fa-triangle-exclamation', title: 'Batasan Tanggung Jawab' },
  { id: 's09', num: '09', icon: 'fa-lock',            title: 'Privasi Data' },
  { id: 's10', num: '10', icon: 'fa-ban',             title: 'Pembatalan Layanan' },
  { id: 's11', num: '11', icon: 'fa-scale-balanced',  title: 'Penyelesaian Sengketa' },
  { id: 's12', num: '12', icon: 'fa-pen-to-square',   title: 'Perubahan Kebijakan' },
];

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function Terms() {
  const [activeId, setActiveId] = useState('s01');
  const [mobileOpen, setMobileOpen] = useState(false);
  const sectionRefs = useRef({});

  /* ── Scrollspy ── */
  useEffect(() => {
    const observers = [];
    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      const offset = 90;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const setRef = (id) => (el) => { sectionRefs.current[id] = el; };

  return (
    <>
      <style>{CSS}</style>
      <div className="tos-page">
        <div className="tos-layout">

          {/* ══════════════════════════════
              SIDEBAR TOC
          ══════════════════════════════ */}
          <aside className="tos-sidebar">
            <p className="tos-toc-logo">Synnn<span>W</span> Studio</p>
            <span className="tos-toc-sublabel">Legal Documents</span>
            <div className="tos-toc-divider" />
            <span className="tos-toc-label">Daftar Isi</span>
            <ul className="tos-toc-list">
              {SECTIONS.map(({ id, num, icon, title }) => (
                <li key={id} className={`tos-toc-item ${activeId === id ? 'active' : ''}`}>
                  <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>
                    <span className="tos-toc-num">{num}</span>
                    <span>{title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* ══════════════════════════════
              MAIN CONTENT
          ══════════════════════════════ */}
          <main className="tos-main">

            {/* Mobile TOC dropdown */}
            <div className="tos-mobile-toc">
              <button className="tos-mobile-toc-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                <span><i className="fa-solid fa-list" style={{ marginRight: 8 }} />Daftar Isi</span>
                <i className={`fa-solid fa-chevron-${mobileOpen ? 'up' : 'down'}`} />
              </button>
              <div className={`tos-mobile-toc-panel ${mobileOpen ? 'open' : ''}`}>
                {SECTIONS.map(({ id, num, title }) => (
                  <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>
                    {num}. {title}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Header ── */}
            <div className="tos-header">
              <span className="tos-page-label">Syarat &amp; Ketentuan</span>
              <h1 className="tos-title">
                Terms of <em>Service</em>
              </h1>
              <p className="tos-header-sub">
                Berlaku sejak 1 Januari 2025 · Dibaca oleh pengguna layanan SynnnW Studio
              </p>
              <div className="tos-meta-pills">
                <span className="tos-meta-pill"><i className="fa-solid fa-calendar" /> Terakhir diperbarui: 1 Juni 2026</span>
                <span className="tos-meta-pill"><i className="fa-solid fa-language" /> Bahasa: Indonesia</span>
                <span className="tos-meta-pill"><i className="fa-solid fa-location-dot" /> Berlaku di: Indonesia</span>
              </div>
              <div className="tos-header-actions">
                <button className="tos-btn-dummy" disabled>
                  <i className="fa-solid fa-file-pdf" /> Download PDF
                </button>
                <button className="tos-btn-dummy" disabled>
                  <i className="fa-solid fa-clock-rotate-left" /> Versi sebelumnya
                </button>
              </div>
              <div className="tos-header-divider" />
            </div>

            {/* ══════════════════════════════
                SECTIONS
            ══════════════════════════════ */}
            <div className="tos-sections">

              {/* ── 01 PENGANTAR ── */}
              <section id="s01" ref={setRef('s01')} className="tos-section">
                <div className="tos-section-meta">
                  <span className="tos-section-num">01</span>
                  <div className="tos-section-icon"><i className="fa-solid fa-circle-info" /></div>
                </div>
                <h2 className="tos-section-title">Pengantar</h2>
                <p>
                  Selamat datang di <strong>SynnnW Studio</strong> — studio kreatif freelance milik
                  Aldo Leo Saputra, berbasis di Jawa Timur, Indonesia. SynnnW Studio bergerak di bidang
                  desain grafis, editing video, live streaming, dan pengembangan website untuk pelajar,
                  mahasiswa, individu, maupun pelaku usaha.
                </p>
                <p>
                  Dengan mengakses atau menggunakan layanan SynnnW Studio melalui platform{' '}
                  <strong>synnnw.com</strong> maupun saluran komunikasi lainnya (WhatsApp, email, dll),
                  kamu dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan
                  yang tercantum di halaman ini.
                </p>
                <div className="tos-highlight">
                  <i className="fa-solid fa-circle-info" />
                  Syarat & Ketentuan ini bersifat mengikat secara moral dan praktis antara SynnnW Studio
                  dengan klien yang menggunakan layanan. Harap baca dengan seksama sebelum melakukan pemesanan.
                </div>
              </section>

              {/* ── 02 DEFINISI ── */}
              <section id="s02" ref={setRef('s02')} className="tos-section">
                <div className="tos-section-meta">
                  <span className="tos-section-num">02</span>
                  <div className="tos-section-icon"><i className="fa-solid fa-book" /></div>
                </div>
                <h2 className="tos-section-title">Definisi</h2>
                <p>Dalam dokumen ini, istilah-istilah berikut memiliki makna sebagai berikut:</p>
                <div className="tos-defs">
                  {[
                    { term: '"Studio"',       desc: 'Merujuk pada SynnnW Studio, studio kreatif freelance milik Aldo Leo Saputra.' },
                    { term: '"Klien" / "Pengguna"', desc: 'Setiap individu atau entitas yang memesan, menggunakan, atau berinteraksi dengan layanan SynnnW Studio.' },
                    { term: '"Proyek"',        desc: 'Pekerjaan kreatif atau teknis yang telah disepakati antara Studio dan Klien berdasarkan brief yang diberikan.' },
                    { term: '"Platform"',      desc: 'Website synnnw.com beserta seluruh aplikasi, dashboard, dan antarmuka digital yang dikelola oleh Studio.' },
                    { term: '"File Final"',    desc: 'Hasil akhir proyek dalam format yang telah disetujui oleh Klien, siap untuk digunakan sesuai keperluan yang disepakati.' },
                    { term: '"Brief"',         desc: 'Dokumen atau informasi dari Klien yang menjelaskan kebutuhan, tujuan, referensi, dan spesifikasi proyek.' },
                    { term: '"Revisi"',        desc: 'Permintaan perubahan pada hasil kerja yang sudah disampaikan, sesuai batas jumlah yang tercantum di paket layanan.' },
                  ].map(({ term, desc }) => (
                    <div key={term} className="tos-def-row">
                      <span className="tos-def-term">{term}</span>
                      <span className="tos-def-desc">{desc}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── 03 LAYANAN ── */}
              <section id="s03" ref={setRef('s03')} className="tos-section">
                <div className="tos-section-meta">
                  <span className="tos-section-num">03</span>
                  <div className="tos-section-icon"><i className="fa-solid fa-layer-group" /></div>
                </div>
                <h2 className="tos-section-title">Layanan yang Disediakan</h2>
                <p>SynnnW Studio menyediakan layanan kreatif dan teknis yang mencakup:</p>
                <ul className="tos-list">
                  <li><strong>Desain Grafis</strong> — poster lomba/kompetisi, poster tugas sekolah, banner & spanduk acara, desain lanyard & ID card, logo & brand identity, serta thumbnail YouTube dan poster film.</li>
                  <li><strong>Editing Video</strong> — film pendek tugas sekolah, video tugas individu, video tugas SMA kelompok, video kuliah individu maupun kelompok, serta custom editing untuk kebutuhan lainnya.</li>
                  <li><strong>Motion Graphic</strong> — animasi logo, intro video, bumper, dan grafis bergerak. Layanan ini segera hadir (<em>coming soon</em>).</li>
                  <li><strong>Live Streaming & WO</strong> — paket siaran langsung untuk event, lomba, dan kegiatan sekolah/kampus dengan operator dan overlay profesional.</li>
                  <li><strong>Pengembangan Website (Vibe Code)</strong> — landing page, website portofolio, website bisnis multi-page, dan aplikasi web custom berbasis React / Next.js.</li>
                  <li><strong>Domain</strong> — registrasi dan manajemen domain .com, .id, .co.id, .net, .org, .dev.</li>
                  <li><strong>Hosting</strong> — paket hosting basic dan pro dengan SSL, cPanel, dan dukungan teknis.</li>
                  <li><strong>Backend & Integrasi</strong> — Firebase setup, Telegram Bot notification, dan implementasi WebSocket real-time.</li>
                </ul>
                <p>
                  Daftar layanan beserta harga lengkap dapat dilihat di halaman Price List pada platform.
                  Studio berhak menambah, mengubah, atau menghentikan layanan tanpa pemberitahuan sebelumnya.
                </p>
              </section>

              {/* ── 04 PROSES PEMESANAN ── */}
              <section id="s04" ref={setRef('s04')} className="tos-section">
                <div className="tos-section-meta">
                  <span className="tos-section-num">04</span>
                  <div className="tos-section-icon"><i className="fa-solid fa-cart-shopping" /></div>
                </div>
                <h2 className="tos-section-title">Proses Pemesanan</h2>
                <p>Alur pemesanan layanan di SynnnW Studio adalah sebagai berikut:</p>
                <ol className="tos-steps">
                  {[
                    { n: '1', text: 'Pilih layanan di halaman Price List → tambahkan ke keranjang belanja.' },
                    { n: '2', text: 'Lakukan checkout → isi form detail proyek → kirimkan brief (referensi, spesifikasi, dll).' },
                    { n: '3', text: 'Admin mengkonfirmasi pesanan, memberikan estimasi waktu pengerjaan, dan detail pembayaran DP.' },
                    { n: '4', text: 'Klien melakukan pembayaran DP (Tahap Pemberkasan) via QRIS sesuai nominal yang ditetapkan.' },
                    { n: '5', text: 'Proses pengerjaan dimulai. Klien dapat mengajukan revisi sesuai batas paket yang dipilih.' },
                    { n: '6', text: 'Setelah hasil disetujui, Klien melakukan pelunasan. File Final dikirim setelah pembayaran lunas terkonfirmasi.' },
                  ].map(({ n, text }) => (
                    <li key={n}><span className="tos-step-num">{n}</span><span>{text}</span></li>
                  ))}
                </ol>
                <div className="tos-highlight">
                  <i className="fa-solid fa-whatsapp" style={{ color: 'rgba(37,211,102,0.9)' }} />
                  Untuk konsultasi sebelum pemesanan atau pertanyaan terkait brief, Klien dapat
                  menghubungi Studio melalui WhatsApp di <strong>081252790018</strong>.
                </div>
              </section>

              {/* ── 05 PEMBAYARAN ── */}
              <section id="s05" ref={setRef('s05')} className="tos-section">
                <div className="tos-section-meta">
                  <span className="tos-section-num">05</span>
                  <div className="tos-section-icon"><i className="fa-solid fa-credit-card" /></div>
                </div>
                <h2 className="tos-section-title">Ketentuan Pembayaran</h2>
                <ul className="tos-list">
                  <li>Seluruh pembayaran dilakukan melalui <strong>QRIS</strong> dengan memindai kode yang tersedia di dashboard Klien.</li>
                  <li>Pembayaran <strong>DP (Uang Muka) sebesar 50% dari total harga</strong> wajib dilakukan sebelum pengerjaan proyek dimulai.</li>
                  <li>Pelunasan (sisa 50%) dilakukan setelah Klien menyetujui hasil akhir dan sebelum File Final diserahkan.</li>
                  <li>Tidak ada refund setelah pengerjaan proyek dimulai, kecuali keterlambatan atau kelalaian sepenuhnya berasal dari pihak Studio.</li>
                  <li>Harga layanan yang tercantum di platform dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.</li>
                  <li>Konfirmasi pembayaran dilakukan melalui WhatsApp dengan menyertakan bukti transfer/tangkapan layar pembayaran QRIS.</li>
                </ul>
                <div className="tos-warning">
                  <i className="fa-solid fa-triangle-exclamation" />
                  Pengerjaan proyek <strong>tidak akan dimulai</strong> sebelum konfirmasi pembayaran DP diterima dan diverifikasi oleh admin.
                </div>
              </section>

              {/* ── 06 REVISI ── */}
              <section id="s06" ref={setRef('s06')} className="tos-section">
                <div className="tos-section-meta">
                  <span className="tos-section-num">06</span>
                  <div className="tos-section-icon"><i className="fa-solid fa-rotate" /></div>
                </div>
                <h2 className="tos-section-title">Revisi</h2>
                <ul className="tos-list">
                  <li>Jumlah revisi yang diperbolehkan sesuai dengan yang tercantum pada deskripsi masing-masing paket layanan.</li>
                  <li>Revisi di luar batas paket dikenakan biaya tambahan sebesar <strong>Rp 25.000 per revisi</strong>.</li>
                  <li>Revisi mayor — yaitu perubahan konsep, tema, atau arah desain secara keseluruhan — dianggap sebagai proyek baru dan dikenakan biaya penuh.</li>
                  <li>Revisi hanya dapat diajukan selama masa pengerjaan aktif, yaitu maksimal <strong>14 hari</strong> setelah file pertama dikirimkan kepada Klien.</li>
                  <li>Setelah melewati batas waktu tersebut, file dianggap final dan revisi tidak lagi tersedia kecuali dengan kesepakatan baru.</li>
                </ul>
                <div className="tos-highlight">
                  <i className="fa-solid fa-lightbulb" />
                  Untuk hasil revisi yang optimal, pastikan Klien memberikan umpan balik yang spesifik dan terstruktur agar perubahan dapat diproses dengan cepat dan tepat.
                </div>
              </section>

              {/* ── 07 HKI ── */}
              <section id="s07" ref={setRef('s07')} className="tos-section">
                <div className="tos-section-meta">
                  <span className="tos-section-num">07</span>
                  <div className="tos-section-icon"><i className="fa-solid fa-shield-halved" /></div>
                </div>
                <h2 className="tos-section-title">Hak Kekayaan Intelektual</h2>
                <ul className="tos-list">
                  <li>File yang diserahkan kepada Klien boleh digunakan untuk keperluan yang telah disepakati dalam brief proyek.</li>
                  <li>SynnnW Studio berhak menampilkan karya yang telah diselesaikan sebagai bagian dari portofolio, kecuali terdapat perjanjian kerahasiaan (NDA) yang disepakati secara tertulis.</li>
                  <li>Klien tidak diperbolehkan menjual ulang, mendistribusikan untuk kepentingan komersial pihak lain, atau mengklaim hasil karya Studio sebagai karya sendiri.</li>
                  <li>Aset pihak ketiga yang digunakan dalam proyek — termasuk font komersial, musik berlisensi, dan foto stock — menjadi tanggung jawab Klien untuk memastikan lisensi penggunaannya.</li>
                  <li>Hak cipta atas karya yang dibuat oleh Studio secara inheren melekat pada Studio hingga seluruh pembayaran diselesaikan.</li>
                </ul>
                <p>
                  Ketentuan ini mengacu pada{' '}
                  <a
                    className="tos-link"
                    href="https://jdih.kemenkumham.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    UU Hak Cipta No. 28 Tahun 2014
                  </a>{' '}
                  yang berlaku di Indonesia.
                </p>
              </section>

              {/* ── 08 BATASAN TANGGUNG JAWAB ── */}
              <section id="s08" ref={setRef('s08')} className="tos-section">
                <div className="tos-section-meta">
                  <span className="tos-section-num">08</span>
                  <div className="tos-section-icon"><i className="fa-solid fa-triangle-exclamation" /></div>
                </div>
                <h2 className="tos-section-title">Batasan Tanggung Jawab</h2>
                <ul className="tos-list">
                  <li>Studio tidak bertanggung jawab atas kerugian tidak langsung, kehilangan peluang bisnis, atau kerugian konsekuensial lainnya yang timbul akibat penggunaan layanan.</li>
                  <li>Estimasi waktu penyelesaian proyek bersifat perkiraan dan dapat berubah sesuai dengan kompleksitas brief atau kendala teknis yang tidak dapat diprediksi sebelumnya.</li>
                  <li>Studio tidak bertanggung jawab atas hasil yang tidak sesuai harapan apabila Klien memberikan brief yang tidak lengkap, tidak jelas, atau mengandung informasi yang salah.</li>
                  <li>Gangguan layanan pihak ketiga (hosting, domain, Firebase, dll) berada di luar kendali Studio dan tidak dapat dijadikan dasar klaim ganti rugi.</li>
                </ul>
                <div className="tos-warning">
                  <i className="fa-solid fa-triangle-exclamation" />
                  Brief yang baik menghasilkan karya yang baik. Pastikan kamu menyampaikan referensi, tujuan, dan detail proyek dengan jelas untuk menghindari miskomunikasi.
                </div>
              </section>

              {/* ── 09 PRIVASI DATA ── */}
              <section id="s09" ref={setRef('s09')} className="tos-section">
                <div className="tos-section-meta">
                  <span className="tos-section-num">09</span>
                  <div className="tos-section-icon"><i className="fa-solid fa-lock" /></div>
                </div>
                <h2 className="tos-section-title">Privasi Data</h2>
                <ul className="tos-list">
                  <li>Data pribadi Klien — termasuk nama lengkap, alamat email, dan nomor telepon — disimpan secara aman di <strong>Firebase Firestore</strong> milik Google.</li>
                  <li>Data yang dikumpulkan hanya digunakan untuk keperluan operasional layanan SynnnW Studio, seperti proses pemesanan, komunikasi proyek, dan konfirmasi pembayaran.</li>
                  <li>Studio tidak menjual, menyewakan, atau membagikan data pribadi Klien kepada pihak ketiga manapun untuk tujuan komersial.</li>
                  <li>Penyimpanan dan pemrosesan data mengacu pada kebijakan privasi Google Firebase yang dapat diakses di <a className="tos-link" href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">firebase.google.com</a>.</li>
                  <li>Klien berhak meminta penghapusan data pribadinya dengan menghubungi Studio melalui WhatsApp atau email.</li>
                </ul>
                <p>
                  Kebijakan privasi ini disusun berdasarkan{' '}
                  <a
                    className="tos-link"
                    href="https://jdih.kominfo.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="tos-legal-ref">UU No. 27 Tahun 2022</span> tentang Pelindungan Data Pribadi (UU PDP)
                  </a>{' '}
                  dan{' '}
                  <a
                    className="tos-link"
                    href="https://jdih.kominfo.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="tos-legal-ref">UU ITE No. 11 Tahun 2008 jo. No. 19 Tahun 2016</span>
                  </a>{' '}
                  yang berlaku di Indonesia.
                </p>
              </section>

              {/* ── 10 PEMBATALAN ── */}
              <section id="s10" ref={setRef('s10')} className="tos-section">
                <div className="tos-section-meta">
                  <span className="tos-section-num">10</span>
                  <div className="tos-section-icon"><i className="fa-solid fa-ban" /></div>
                </div>
                <h2 className="tos-section-title">Pembatalan Layanan</h2>
                <ul className="tos-list">
                  <li>Klien dapat membatalkan pesanan <strong>sebelum pengerjaan dimulai</strong> (sebelum DP dikonfirmasi oleh admin). Dalam hal ini, DP dikembalikan secara penuh.</li>
                  <li>Pembatalan pesanan setelah pengerjaan dimulai tidak mendapatkan pengembalian dana dalam bentuk apapun.</li>
                  <li>Studio berhak menolak atau membatalkan pesanan apabila Klien tidak merespons komunikasi lebih dari <strong>7 hari kerja</strong> tanpa pemberitahuan yang jelas.</li>
                  <li>Pesanan yang dibatalkan oleh Studio atas dasar kelalaian Studio sepenuhnya akan mendapatkan pengembalian dana penuh termasuk DP yang sudah dibayarkan.</li>
                </ul>
              </section>

              {/* ── 11 SENGKETA ── */}
              <section id="s11" ref={setRef('s11')} className="tos-section">
                <div className="tos-section-meta">
                  <span className="tos-section-num">11</span>
                  <div className="tos-section-icon"><i className="fa-solid fa-scale-balanced" /></div>
                </div>
                <h2 className="tos-section-title">Penyelesaian Sengketa</h2>
                <ul className="tos-list">
                  <li>Segala sengketa atau perselisihan yang timbul dari penggunaan layanan SynnnW Studio diselesaikan terlebih dahulu melalui <strong>musyawarah mufakat</strong> antara kedua belah pihak.</li>
                  <li>Apabila penyelesaian secara musyawarah tidak menghasilkan kesepakatan dalam waktu 14 hari kalender, penyelesaian mengacu pada ketentuan hukum yang berlaku di Indonesia.</li>
                  <li>Yurisdiksi dan domisili hukum untuk penyelesaian sengketa adalah <strong>Kabupaten Probolinggo, Jawa Timur</strong>.</li>
                </ul>
                <p>
                  Dokumen ini diatur berdasarkan hukum Indonesia, termasuk namun tidak terbatas pada{' '}
                  <a
                    className="tos-link"
                    href="https://jdih.kominfo.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="tos-legal-ref">UU ITE No. 11 Tahun 2008 jo. No. 19 Tahun 2016</span>
                  </a>{' '}
                  dan{' '}
                  <a
                    className="tos-link"
                    href="https://jdih.kemenkumham.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="tos-legal-ref">UU Hak Cipta No. 28 Tahun 2014</span>
                  </a>.
                </p>
              </section>

              {/* ── 12 PERUBAHAN KEBIJAKAN ── */}
              <section id="s12" ref={setRef('s12')} className="tos-section">
                <div className="tos-section-meta">
                  <span className="tos-section-num">12</span>
                  <div className="tos-section-icon"><i className="fa-solid fa-pen-to-square" /></div>
                </div>
                <h2 className="tos-section-title">Perubahan Kebijakan</h2>
                <ul className="tos-list">
                  <li>SynnnW Studio berhak memperbarui atau mengubah Syarat & Ketentuan ini kapan saja tanpa pemberitahuan terlebih dahulu.</li>
                  <li>Pengguna yang terdaftar akan diberitahu melalui notifikasi email atau notifikasi platform apabila terjadi perubahan yang signifikan.</li>
                  <li>Penggunaan layanan setelah pembaruan Terms diterbitkan dianggap sebagai persetujuan atas Terms yang baru berlaku.</li>
                  <li>Tanggal pembaruan terakhir selalu ditampilkan di bagian atas halaman ini untuk referensi Klien.</li>
                </ul>
                <div className="tos-highlight">
                  <i className="fa-solid fa-envelope" />
                  Jika ada pertanyaan terkait Syarat & Ketentuan ini, silakan hubungi SynnnW Studio
                  melalui WhatsApp <strong>081252790018</strong> atau melalui halaman kontak di platform.
                </div>
              </section>

            </div>{/* end .tos-sections */}
          </main>
        </div>
      </div>
    </>
  );
}
