import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────
   SECTIONS DATA
───────────────────────────────────────────────────────────── */
const SECTIONS = [
  { id: 'pengantar',    num: '01', label: 'Pengantar' },
  { id: 'definisi',    num: '02', label: 'Definisi' },
  { id: 'layanan',     num: '03', label: 'Layanan' },
  { id: 'how-to',      num: '04', label: 'How to Order' },
  { id: 'pembayaran',  num: '05', label: 'Pembayaran' },
  { id: 'revisi',      num: '06', label: 'Revisi' },
  { id: 'hki',         num: '07', label: 'Hak Kekayaan Intelektual' },
  { id: 'batasan',     num: '08', label: 'Batasan Tanggung Jawab' },
  { id: 'privasi',     num: '09', label: 'Privasi Data' },
  { id: 'international', num: '10', label: 'Klien Internasional' },
  { id: 'pembatalan',  num: '11', label: 'Pembatalan Layanan' },
  { id: 'sengketa',    num: '12', label: 'Penyelesaian Sengketa' },
];

/* ─────────────────────────────────────────────────────────────
   CSS
───────────────────────────────────────────────────────────── */
const CSS = `
/* ── Page ── */
.tos-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Outfit', sans-serif;
  padding-top: 64px;
}

/* ── Page header ── */
.tos-header {
  padding: 60px 80px 40px;
  border-bottom: 1px solid var(--border);
  max-width: 1180px;
  margin: 0 auto;
}
.tos-header-label {
  display: inline-block;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--accent3);
  margin-bottom: 14px;
  font-style: normal;
}
.tos-header-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 300;
  color: var(--text);
  line-height: 1.08;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
}
.tos-header-sub {
  font-size: 0.9rem;
  color: var(--text-dim);
  margin: 0 0 20px;
}
.tos-header-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.tos-meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  background: var(--glass);
  border: 1px solid var(--gborder);
  border-radius: 99px;
  font-size: 0.7rem;
  color: var(--text-dim);
  letter-spacing: 0.04em;
}
.tos-meta-pill i { color: var(--accent3); font-size: 0.65rem; }

/* ── Layout ── */
.tos-layout {
  display: flex;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 80px 120px;
  gap: 0;
  align-items: flex-start;
  position: relative;
}

/* ── Sidebar ── */
.tos-sidebar {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(139,92,246,0.2) transparent;
  border-right: 1px solid var(--border);
  padding: 32px 24px 32px 0;
}
.tos-sidebar::-webkit-scrollbar { width: 4px; }
.tos-sidebar::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.2); border-radius: 4px; }

.tos-toc-brand {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 2px;
}
.tos-toc-brand span { color: var(--accent3); }
.tos-toc-sub {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(167,139,250,0.5);
  margin-bottom: 20px;
  display: block;
}
.tos-toc-divider { height: 1px; background: var(--border); margin: 0 0 16px; }

.tos-toc-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 7px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  text-decoration: none;
  margin-bottom: 2px;
}
.tos-toc-item:hover { background: var(--glass); }
.tos-toc-item.active {
  background: rgba(139,92,246,0.08);
  border-left: 2px solid var(--accent3);
  padding-left: 8px;
}
.tos-toc-num {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(167,139,250,0.45);
  margin-top: 1px;
  flex-shrink: 0;
  font-family: 'Outfit', sans-serif;
}
.tos-toc-item.active .tos-toc-num { color: var(--accent3); }
.tos-toc-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--text-dim);
  line-height: 1.3;
  font-family: 'Outfit', sans-serif;
}
.tos-toc-item.active .tos-toc-label {
  color: var(--accent3);
  font-weight: 600;
}

/* ── Main content ── */
.tos-main {
  flex: 1;
  padding: 40px 0 40px 56px;
  max-width: 760px;
}

/* ── Section ── */
.tos-section {
  margin-bottom: 64px;
  scroll-margin-top: 90px;
}
.tos-sec-num {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent3);
  margin-bottom: 8px;
  font-family: 'Outfit', sans-serif;
}
.tos-sec-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.65rem;
  font-weight: 400;
  color: var(--text);
  margin: 0 0 20px;
  letter-spacing: -0.01em;
  line-height: 1.2;
}
.tos-sec-divider { height: 1px; background: var(--border); margin: 0 0 24px; }

/* ── Body text ── */
.tos-p {
  font-size: 0.95rem;
  line-height: 1.85;
  color: var(--text-dim);
  margin: 0 0 16px;
}
.tos-p:last-child { margin-bottom: 0; }

/* ── List ── */
.tos-list {
  list-style: none;
  padding: 0; margin: 0 0 16px;
  display: flex; flex-direction: column; gap: 8px;
}
.tos-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.93rem;
  color: var(--text-dim);
  line-height: 1.7;
}
.tos-list li::before {
  content: '✦';
  color: var(--accent3);
  font-size: 0.6rem;
  flex-shrink: 0;
  margin-top: 5px;
}
.tos-list.num li { counter-increment: tos-counter; }
.tos-list.num li::before {
  content: counter(tos-counter) '.';
  color: var(--accent3);
  font-weight: 700;
  font-size: 0.75rem;
  min-width: 20px;
  margin-top: 2px;
  counter-increment: none;
}
.tos-list.num { counter-reset: tos-counter; }

/* ── Step cards ── */
.tos-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.tos-step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 18px;
  background: var(--glass);
  border: 1px solid var(--gborder);
  border-radius: 14px;
  transition: border-color 0.2s;
}
.tos-step:hover { border-color: var(--gborder2); }
.tos-step-num {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: rgba(139,92,246,0.12);
  border: 1px solid rgba(139,92,246,0.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent3);
  flex-shrink: 0;
  font-family: 'Outfit', sans-serif;
}
.tos-step-content { flex: 1; }
.tos-step-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 4px;
  font-family: 'Outfit', sans-serif;
}
.tos-step-desc {
  font-size: 0.82rem;
  color: var(--text-dim);
  line-height: 1.6;
  margin: 0;
}

/* ── Definition table ── */
.tos-def-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  font-family: 'Outfit', sans-serif;
}
.tos-def-table tr { border-bottom: 1px solid var(--border); }
.tos-def-table tr:last-child { border-bottom: none; }
.tos-def-table td { padding: 11px 14px; font-size: 0.88rem; vertical-align: top; }
.tos-def-table td:first-child {
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  width: 180px;
  font-family: 'Courier New', monospace;
  background: rgba(139,92,246,0.05);
  border-radius: 6px;
}
.tos-def-table td:last-child { color: var(--text-dim); line-height: 1.6; }

/* ── Legal reference chip ── */
.tos-legal {
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  background: rgba(139,92,246,0.08);
  border: 1px solid rgba(139,92,246,0.18);
  border-radius: 6px;
  padding: 2px 7px;
  color: var(--accent3);
  white-space: nowrap;
}
.tos-legal-link {
  color: var(--accent3);
  text-decoration: underline dotted;
  text-underline-offset: 3px;
  transition: opacity 0.18s;
  font-size: 0.9rem;
}
.tos-legal-link:hover { opacity: 0.75; }

/* ── Info box ── */
.tos-infobox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 12px;
  margin-bottom: 16px;
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text-dim);
}
.tos-infobox.purple {
  background: rgba(139,92,246,0.07);
  border: 1px solid rgba(139,92,246,0.2);
}
.tos-infobox.yellow {
  background: rgba(251,191,36,0.06);
  border: 1px solid rgba(251,191,36,0.2);
}
.tos-infobox.green {
  background: rgba(74,222,128,0.06);
  border: 1px solid rgba(74,222,128,0.2);
}
.tos-infobox i { flex-shrink: 0; margin-top: 2px; }
.tos-infobox.purple i { color: var(--accent3); }
.tos-infobox.yellow i { color: #fbbf24; }
.tos-infobox.green i { color: #4ade80; }

/* ── Mobile tab bar ── */
.tos-mobile-tabs {
  display: none;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  position: sticky;
  top: 64px;
  z-index: 50;
  gap: 4px;
}
.tos-mobile-tabs::-webkit-scrollbar { display: none; }
.tos-mobile-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 14px;
  white-space: nowrap;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--text-dim);
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.18s, border-color 0.18s;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  text-decoration: none;
  flex-shrink: 0;
}
.tos-mobile-tab.active {
  color: var(--accent3);
  border-bottom-color: var(--accent3);
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .tos-header { padding: 48px 40px 32px; }
  .tos-layout { padding: 0 40px 100px; }
  .tos-sidebar { width: 220px; }
}
@media (max-width: 768px) {
  .tos-header { padding: 36px 20px 24px; }
  .tos-layout { padding: 0 20px 80px; flex-direction: column; }
  .tos-sidebar { display: none !important; }
  .tos-mobile-tabs { display: flex !important; }
  .tos-main { padding: 32px 0 0; max-width: 100%; }
  .tos-def-table td:first-child { width: 130px; font-size: 0.78rem; }
  .tos-section { scroll-margin-top: 130px; }
}
@media (max-width: 480px) {
  .tos-header-title { font-size: 2.2rem; }
  .tos-step { padding: 12px 14px; gap: 12px; }
}
`;

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function Terms() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('pengantar');
  const sectionRefs = useRef({});
  const observerRef = useRef(null);

  /* ── Scrollspy via IntersectionObserver ── */
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // find the first entry that is intersecting
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    // small delay to let DOM settle
    const timer = setTimeout(() => {
      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observerRef.current.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, []);

  /* ── Scroll to section ── */
  const scrollTo = (id, e) => {
    e?.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  /* ─── RENDER ─── */
  return (
    <>
      <style>{CSS}</style>

      <div className="tos-page">

        {/* ══════ PAGE HEADER ══════ */}
        <div className="tos-header">
          <span className="tos-header-label">Syarat &amp; Ketentuan</span>
          <h1 className="tos-header-title">Terms of Service</h1>
          <p className="tos-header-sub">
            Berlaku sejak 1 Juni 2026 · SynnnW Studio
          </p>
          <div className="tos-header-pills">
            <span className="tos-meta-pill">
              <i className="fa-solid fa-calendar-check" />
              Terakhir diperbarui: 1 Juni 2026
            </span>
            <span className="tos-meta-pill">
              <i className="fa-solid fa-location-dot" />
              Berlaku di: Indonesia
            </span>
            <span className="tos-meta-pill">
              <i className="fa-solid fa-file-contract" />
              12 Sections
            </span>
          </div>
        </div>

        {/* ══════ MOBILE HORIZONTAL TABS ══════ */}
        <nav className="tos-mobile-tabs" aria-label="Table of contents">
          {SECTIONS.map(({ id, num, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`tos-mobile-tab${activeId === id ? ' active' : ''}`}
              onClick={e => scrollTo(id, e)}
            >
              <span style={{ opacity: 0.5, fontSize: '0.6rem' }}>{num}</span>
              {label}
            </a>
          ))}
        </nav>

        {/* ══════ LAYOUT ══════ */}
        <div className="tos-layout">

          {/* ─── SIDEBAR TOC ─── */}
          <aside className="tos-sidebar" aria-label="Table of contents">
            <p className="tos-toc-brand">SynnnW<span>ST</span></p>
            <span className="tos-toc-sub">Terms of Service</span>
            <div className="tos-toc-divider" />
            {SECTIONS.map(({ id, num, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`tos-toc-item${activeId === id ? ' active' : ''}`}
                onClick={e => scrollTo(id, e)}
              >
                <span className="tos-toc-num">{num}</span>
                <span className="tos-toc-label">{label}</span>
              </a>
            ))}
          </aside>

          {/* ─── MAIN CONTENT ─── */}
          <main className="tos-main">

            {/* ── 01 PENGANTAR ── */}
            <section id="pengantar" className="tos-section">
              <p className="tos-sec-num">01 / Pengantar</p>
              <h2 className="tos-sec-title">Pengantar</h2>
              <div className="tos-sec-divider" />
              <p className="tos-p">
                SynnnW Studio adalah studio kreatif freelance milik Aldo Leo Saputra,
                berbasis di Jawa Timur, Indonesia. Layanan yang disediakan meliputi desain grafis,
                editing video, live streaming, dan pengembangan website.
              </p>
              <p className="tos-p">
                Syarat dan Ketentuan ini berlaku bagi siapa saja yang menggunakan layanan
                atau mendaftar ke platform <strong style={{ color: 'var(--text)' }}>synnnw.com</strong>.
                Dengan menggunakan layanan kami, kamu dianggap telah membaca, memahami,
                dan menyetujui seluruh ketentuan yang berlaku di sini.
              </p>
              <div className="tos-infobox purple">
                <i className="fa-solid fa-circle-info" />
                <span>
                  Terms ini dapat diperbarui kapan saja. Perubahan signifikan akan
                  dikomunikasikan melalui platform atau WhatsApp. Versi terbaru selalu
                  tersedia di halaman ini.
                </span>
              </div>
            </section>

            {/* ── 02 DEFINISI ── */}
            <section id="definisi" className="tos-section">
              <p className="tos-sec-num">02 / Definisi</p>
              <h2 className="tos-sec-title">Definisi</h2>
              <div className="tos-sec-divider" />
              <p className="tos-p">
                Istilah-istilah berikut digunakan di seluruh dokumen ini:
              </p>
              <table className="tos-def-table">
                <tbody>
                  {[
                    ['"Studio"',     'SynnnW Studio — studio kreatif freelance milik Aldo Leo Saputra.'],
                    ['"Klien"',      'Individu atau organisasi yang memesan layanan dari Studio.'],
                    ['"Pengguna"',   'Siapapun yang mengakses atau menggunakan platform synnnw.com.'],
                    ['"Proyek"',     'Pekerjaan kreatif yang disepakati antara Klien dan Studio.'],
                    ['"Platform"',   'Website synnnw.com beserta fitur-fitur dashboard dan aplikasinya.'],
                    ['"File Final"', 'Hasil akhir proyek yang sudah disetujui Klien dan siap diserahkan.'],
                    ['"Brief"',      'Dokumen atau catatan yang berisi kebutuhan, referensi, dan detail proyek dari Klien.'],
                    ['"DP"',         'Uang muka (Down Payment) — 50% dari total yang dibayarkan sebelum pengerjaan dimulai.'],
                  ].map(([term, def]) => (
                    <tr key={term}>
                      <td>{term}</td>
                      <td>{def}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* ── 03 LAYANAN ── */}
            <section id="layanan" className="tos-section">
              <p className="tos-sec-num">03 / Layanan</p>
              <h2 className="tos-sec-title">Layanan yang Disediakan</h2>
              <div className="tos-sec-divider" />
              <p className="tos-p">
                SynnnW Studio menyediakan layanan kreatif berikut:
              </p>
              <ul className="tos-list">
                <li>
                  <strong>Desain Grafis</strong> — poster, banner, lanyard, logo, thumbnail YouTube, jersey,
                  dan berbagai kebutuhan visual lainnya.
                </li>
                <li>
                  <strong>Editing Video</strong> — tugas sekolah &amp; kampus (individu/kelompok), film pendek,
                  konten kreatif, dan kebutuhan custom.
                </li>
                <li>
                  <strong>Motion Graphic</strong> — animasi logo, intro video, bumper, animasi presentasi.
                  <em style={{ color: 'var(--accent3)', fontSize: '0.8rem', marginLeft: 4 }}>(Coming Soon)</em>
                </li>
                <li>
                  <strong>Live Streaming &amp; Broadcast Design</strong> — siaran langsung event, olahraga,
                  lomba, dan acara resmi. Termasuk desain overlay OBS custom.
                </li>
                <li>
                  <strong>Pengembangan Website</strong> — metode vibe code (AI-assisted) menggunakan
                  React / Next.js. Landing page, portofolio, website bisnis, hingga aplikasi web custom.
                </li>
                <li>
                  <strong>Domain &amp; Hosting</strong> — .com, .id, .co.id, dan ekstensi internasional.
                  Termasuk paket hosting Basic dan Pro.
                </li>
                <li>
                  <strong>Backend &amp; Integrasi</strong> — Firebase setup, Telegram bot notifikasi,
                  WebSocket real-time, QRIS payment gateway.
                </li>
              </ul>
              <p className="tos-p">
                Ketersediaan layanan dapat berubah. Layanan dengan badge{' '}
                <span className="tos-legal">Coming Soon</span> belum tersedia untuk pemesanan reguler.
              </p>
            </section>

            {/* ── 04 HOW TO ORDER ── */}
            <section id="how-to" className="tos-section">
              <p className="tos-sec-num">04 / How to Order</p>
              <h2 className="tos-sec-title">How to Order</h2>
              <div className="tos-sec-divider" />
              <p className="tos-p">
                Proses pemesanan layanan di SynnnW Studio mengikuti alur berikut:
              </p>
              <div className="tos-steps">
                {[
                  {
                    n: 1,
                    title: 'Browse & Pilih Layanan',
                    desc: 'Buka halaman Price List, pilih layanan yang kamu butuhkan, dan tambahkan ke keranjang.'
                  },
                  {
                    n: 2,
                    title: 'Checkout & Kirim Brief',
                    desc: 'Isi form detail proyek — termasuk deskripsi kebutuhan, referensi visual, deadline, dan link Google Drive jika ada. Makin lengkap brief-nya, makin cepat dan tepat hasilnya.'
                  },
                  {
                    n: 3,
                    title: 'Konfirmasi dari Admin',
                    desc: 'Admin akan mengonfirmasi order dan memberikan estimasi waktu pengerjaan dalam maksimal 24 jam via WhatsApp atau dashboard.'
                  },
                  {
                    n: 4,
                    title: 'Bayar DP (Tahap Pemberkasan)',
                    desc: 'Lakukan pembayaran DP 50% dari total via QRIS yang tersedia di dashboard. Pengerjaan dimulai setelah DP diterima.'
                  },
                  {
                    n: 5,
                    title: 'Pengerjaan & Revisi',
                    desc: 'Studio mengerjakan proyek sesuai brief. File-file draft akan diunggah ke dashboard klien. Revisi dilakukan sesuai batas yang tercantum di paket.'
                  },
                  {
                    n: 6,
                    title: 'Bayar Pelunasan & Terima File Final',
                    desc: 'Setelah proyek disetujui, lakukan pelunasan 50% sisanya. Link download File Final akan aktif di dashboard setelah pembayaran dikonfirmasi.'
                  },
                ].map(({ n, title, desc }) => (
                  <div key={n} className="tos-step">
                    <div className="tos-step-num">{n}</div>
                    <div className="tos-step-content">
                      <p className="tos-step-title">{title}</p>
                      <p className="tos-step-desc">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="tos-infobox yellow">
                <i className="fa-solid fa-triangle-exclamation" />
                <span>
                  Jika kamu tidak responsif selama lebih dari 7 hari kerja setelah brief dikirim
                  atau revisi diminta, Studio berhak menjadwalkan ulang atau membatalkan proyek.
                </span>
              </div>
            </section>

            {/* ── 05 PEMBAYARAN ── */}
            <section id="pembayaran" className="tos-section">
              <p className="tos-sec-num">05 / Pembayaran</p>
              <h2 className="tos-sec-title">Ketentuan Pembayaran</h2>
              <div className="tos-sec-divider" />
              <ul className="tos-list">
                <li>
                  Semua pembayaran dilakukan melalui <strong>QRIS</strong> yang tersedia di dashboard klien.
                </li>
                <li>
                  <strong>Down Payment (DP) 50%</strong> wajib dibayarkan sebelum pengerjaan proyek dimulai.
                </li>
                <li>
                  <strong>Pelunasan 50%</strong> dilakukan sebelum File Final diserahkan kepada klien.
                </li>
                <li>
                  Tidak ada refund setelah pengerjaan dimulai, kecuali terdapat kelalaian yang
                  terbukti dari pihak Studio.
                </li>
                <li>
                  Jika cancel sebelum pengerjaan dimulai, DP dikembalikan penuh dalam maksimal 3 hari kerja.
                </li>
                <li>
                  Harga yang tercantum di Price List dapat berubah sewaktu-waktu tanpa pemberitahuan.
                  Harga yang berlaku adalah harga saat order dikonfirmasi.
                </li>
                <li>
                  Untuk klien internasional, lihat{' '}
                  <a href="#international" onClick={e => scrollTo('international', e)} className="tos-legal-link">
                    Section 10 — Klien Internasional
                  </a>
                  .
                </li>
              </ul>
            </section>

            {/* ── 06 REVISI ── */}
            <section id="revisi" className="tos-section">
              <p className="tos-sec-num">06 / Revisi</p>
              <h2 className="tos-sec-title">Kebijakan Revisi</h2>
              <div className="tos-sec-divider" />
              <ul className="tos-list">
                <li>
                  Jumlah revisi yang diperbolehkan tercantum di deskripsi masing-masing paket layanan.
                </li>
                <li>
                  Revisi di luar batas yang ditentukan dikenakan biaya tambahan{' '}
                  <span className="tos-legal">+Rp 25.000 / revisi</span>.
                </li>
                <li>
                  Revisi major — perubahan konsep total, perubahan arah desain yang bertolak belakang
                  dengan brief awal — dianggap sebagai proyek baru dan dikenakan biaya dari awal.
                </li>
                <li>
                  Batas waktu pengajuan revisi adalah <strong>14 hari</strong> setelah file pertama
                  dikirim. Di luar batas waktu ini, proyek dianggap selesai.
                </li>
                <li>
                  Permintaan revisi harus disampaikan melalui kolom brief di dashboard, bukan via WhatsApp
                  atau platform lain, agar tercatat dengan jelas.
                </li>
              </ul>
            </section>

            {/* ── 07 HKI ── */}
            <section id="hki" className="tos-section">
              <p className="tos-sec-num">07 / Hak Kekayaan Intelektual</p>
              <h2 className="tos-sec-title">Hak Kekayaan Intelektual</h2>
              <div className="tos-sec-divider" />
              <ul className="tos-list">
                <li>
                  File Final yang diserahkan boleh digunakan klien sesuai keperluan yang telah
                  disepakati dalam brief.
                </li>
                <li>
                  SynnnW Studio berhak menampilkan karya sebagai bagian dari portofolio, kecuali
                  klien secara eksplisit meminta Non-Disclosure Agreement (NDA) sebelum proyek dimulai.
                </li>
                <li>
                  Klien tidak diperbolehkan menjual ulang, mendistribusikan secara komersial, atau
                  mengklaim karya sebagai milik sendiri tanpa izin tertulis dari Studio.
                </li>
                <li>
                  Aset pihak ketiga (foto stok, font berbayar, musik berlisensi) yang diminta klien
                  untuk digunakan dalam proyek menjadi tanggung jawab lisensi klien sepenuhnya.
                </li>
                <li>
                  Untuk karya film pendek atau video dengan kru, kredit produksi harus dicantumkan
                  sesuai kesepakatan awal.
                </li>
              </ul>
              <p className="tos-p" style={{ fontSize: '0.85rem' }}>
                Referensi:{' '}
                <a href="https://jdih.kemenkumham.go.id" target="_blank" rel="noopener noreferrer" className="tos-legal-link">
                  UU No. 28 Tahun 2014 tentang Hak Cipta
                </a>
              </p>
            </section>

            {/* ── 08 BATASAN TANGGUNG JAWAB ── */}
            <section id="batasan" className="tos-section">
              <p className="tos-sec-num">08 / Batasan</p>
              <h2 className="tos-sec-title">Batasan Tanggung Jawab</h2>
              <div className="tos-sec-divider" />
              <ul className="tos-list">
                <li>
                  Studio tidak bertanggung jawab atas kerugian tidak langsung yang timbul akibat
                  penggunaan atau ketidakmampuan menggunakan hasil karya.
                </li>
                <li>
                  Estimasi waktu pengerjaan bersifat perkiraan dan tidak mengikat secara hukum,
                  kecuali ada perjanjian tertulis tentang deadline.
                </li>
                <li>
                  Studio tidak bertanggung jawab atas hasil akhir yang tidak sesuai ekspektasi
                  jika brief yang diberikan klien tidak lengkap, tidak jelas, atau berubah-ubah
                  selama proses pengerjaan.
                </li>
                <li>
                  Studio tidak bertanggung jawab atas kerusakan file, kehilangan data, atau
                  masalah teknis yang terjadi di sisi klien setelah File Final diserahkan.
                </li>
              </ul>
            </section>

            {/* ── 09 PRIVASI DATA ── */}
            <section id="privasi" className="tos-section">
              <p className="tos-sec-num">09 / Privasi Data</p>
              <h2 className="tos-sec-title">Privasi Data</h2>
              <div className="tos-sec-divider" />
              <p className="tos-p">
                SynnnW Studio berkomitmen melindungi data pribadi pengguna sesuai dengan
                peraturan yang berlaku di Indonesia.
              </p>
              <ul className="tos-list">
                <li>
                  Data yang dikumpulkan (nama, email, nomor telepon) disimpan di Firebase Firestore
                  dan hanya digunakan untuk keperluan operasional layanan.
                </li>
                <li>
                  Data pribadi tidak dijual, dipinjamkan, atau didistribusikan kepada pihak ketiga
                  tanpa persetujuan eksplisit dari pengguna.
                </li>
                <li>
                  Pengguna berhak meminta penghapusan data akun mereka kapan saja dengan menghubungi
                  admin via WhatsApp.
                </li>
                <li>
                  Sistem menggunakan Firebase Authentication dengan enkripsi standar industri.
                  Password tidak pernah disimpan dalam bentuk plain text.
                </li>
              </ul>
              <p className="tos-p" style={{ fontSize: '0.85rem', marginTop: 8 }}>
                Referensi hukum yang berlaku:
              </p>
              <ul className="tos-list" style={{ marginTop: 0 }}>
                <li>
                  <a href="https://jdih.kominfo.go.id" target="_blank" rel="noopener noreferrer" className="tos-legal-link">
                    <span className="tos-legal">UU No. 27 Tahun 2022</span> tentang Pelindungan Data Pribadi (UU PDP)
                  </a>
                </li>
                <li>
                  <a href="https://jdih.kominfo.go.id" target="_blank" rel="noopener noreferrer" className="tos-legal-link">
                    <span className="tos-legal">UU No. 11 Tahun 2008</span> tentang Informasi dan Transaksi Elektronik (UU ITE)
                  </a>
                </li>
                <li>
                  <a href="https://jdih.kemenkumham.go.id" target="_blank" rel="noopener noreferrer" className="tos-legal-link">
                    <span className="tos-legal">UU No. 28 Tahun 2014</span> tentang Hak Cipta
                  </a>
                </li>
              </ul>
            </section>

            {/* ── 10 KLIEN INTERNASIONAL ── */}
            <section id="international" className="tos-section">
              <p className="tos-sec-num">10 / International</p>
              <h2 className="tos-sec-title">Klien Internasional</h2>
              <div className="tos-sec-divider" />
              <div className="tos-infobox green">
                <i className="fa-solid fa-earth-asia" />
                <span>
                  International clients are welcome. Communication in English is fully supported.
                </span>
              </div>
              <ul className="tos-list">
                <li>
                  Harga untuk klien internasional ditampilkan dalam USD pada halaman Price List.
                </li>
                <li>
                  Konversi yang digunakan:{' '}
                  <span className="tos-legal">USD = IDR × 2 ÷ 15.000</span> — intentionally 2× lebih
                  tinggi dari rate pasar untuk klien internasional. Ini bukan error.
                </li>
                <li>
                  Harga USD bersifat estimasi dan dapat berubah sewaktu-waktu tanpa pemberitahuan.
                </li>
                <li>
                  Komunikasi proyek dapat dilakukan dalam Bahasa Inggris atau Bahasa Indonesia.
                </li>
                <li>
                  Pembayaran dapat dilakukan via QRIS atau transfer bank sesuai kesepakatan dengan admin.
                </li>
              </ul>
            </section>

            {/* ── 11 PEMBATALAN ── */}
            <section id="pembatalan" className="tos-section">
              <p className="tos-sec-num">11 / Pembatalan</p>
              <h2 className="tos-sec-title">Pembatalan Layanan</h2>
              <div className="tos-sec-divider" />
              <ul className="tos-list">
                <li>
                  Pembatalan sebelum pengerjaan dimulai: DP dikembalikan penuh dalam
                  maksimal 3 hari kerja.
                </li>
                <li>
                  Pembatalan setelah pengerjaan dimulai: tidak ada refund karena sumber daya
                  dan waktu sudah dialokasikan.
                </li>
                <li>
                  Studio berhak menolak atau membatalkan order jika klien tidak responsif
                  selama lebih dari <strong>7 hari kerja</strong> setelah konfirmasi awal.
                </li>
                <li>
                  Studio berhak menolak order yang bertentangan dengan nilai etika, hukum yang berlaku,
                  atau kebijakan internal Studio tanpa penjelasan lebih lanjut.
                </li>
              </ul>
            </section>

            {/* ── 12 SENGKETA ── */}
            <section id="sengketa" className="tos-section">
              <p className="tos-sec-num">12 / Sengketa</p>
              <h2 className="tos-sec-title">Penyelesaian Sengketa &amp; Perubahan Kebijakan</h2>
              <div className="tos-sec-divider" />
              <ul className="tos-list">
                <li>
                  Setiap sengketa yang timbul akan diselesaikan secara musyawarah mufakat
                  antara pihak Klien dan Studio terlebih dahulu.
                </li>
                <li>
                  Jika tidak tercapai kesepakatan dalam musyawarah, kedua pihak setuju mengacu
                  pada hukum yang berlaku di Indonesia.
                </li>
                <li>
                  Yurisdiksi: <strong>Kabupaten Probolinggo, Jawa Timur, Indonesia</strong>.
                </li>
                <li>
                  Terms of Service ini dapat diperbarui kapan saja. Perubahan signifikan akan
                  dikomunikasikan melalui platform atau WhatsApp kepada klien aktif.
                </li>
                <li>
                  Versi terbaru selalu tersedia di <strong>synnnw.com/terms</strong>.
                  Penggunaan layanan setelah pembaruan dianggap sebagai persetujuan terhadap
                  Terms yang baru.
                </li>
              </ul>

              {/* Contact admin */}
              <div className="tos-infobox purple" style={{ marginTop: 32 }}>
                <i className="fa-solid fa-headset" />
                <div>
                  <p style={{ margin: '0 0 6px', color: 'var(--text)', fontWeight: 600, fontSize: '0.88rem' }}>
                    Ada pertanyaan tentang Terms ini?
                  </p>
                  <p style={{ margin: 0, fontSize: '0.83rem' }}>
                    Hubungi admin via{' '}
                    <a
                      href="https://wa.me/6281252790018"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tos-legal-link"
                    >
                      WhatsApp
                    </a>
                    {' '}atau kunjungi halaman{' '}
                    <Link to="/contact" className="tos-legal-link">Contact</Link>.
                  </p>
                </div>
              </div>

              {/* Bottom nav */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 40 }}>
                <button
                  onClick={() => navigate('/price-list')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 22px',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                    color: '#fff', border: 'none', borderRadius: 99,
                    fontFamily: 'Outfit', fontSize: '0.78rem', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  <i className="fa-solid fa-tag" style={{ fontSize: '0.7rem' }} />
                  Lihat Price List
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 22px',
                    background: 'var(--glass)', border: '1px solid var(--gborder)',
                    color: 'var(--text-dim)', borderRadius: 99,
                    fontFamily: 'Outfit', fontSize: '0.78rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--gborder2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'var(--gborder)'; }}
                >
                  <i className="fa-solid fa-message" style={{ fontSize: '0.7rem' }} />
                  Hubungi Kami
                </button>
              </div>
            </section>

          </main>
        </div>
      </div>
    </>
  );
}
