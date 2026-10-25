import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Reveal, Arrow } from '../components/BentoKit';
import { waLink } from '../lib/bento';

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
/* ══════ TERMS — gaya bento (pakai kit .bn dari bento.css) ══════ */
.tos-page.bn { padding-top: 112px; }
.tos-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.tos-meta-pill { display: inline-flex; align-items: center; gap: 7px; padding: 6px 13px; border-radius: 99px; font-size: 0.72rem; color: var(--text-dim); background: var(--glass2); border: 1px solid var(--border2); }
.tos-meta-pill i { color: var(--accent2); font-size: 0.68rem; }
.tos-hot-btn { color: #fff; border-color: rgba(255,255,255,0.55); align-self: flex-start; }
.tos-hot-btn:hover { background: rgba(255,255,255,0.18); border-color: #fff; }

/* ── Layout: sidebar + konten ── */
.tos-layout { display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: var(--bn-gap); align-items: start; }
.tos-sidebar { position: sticky; top: 88px; padding: 22px 14px; max-height: calc(100vh - 110px); overflow-y: auto; scrollbar-width: thin; }
.tos-toc-brand { font-size: 1.05rem; font-weight: 500; padding: 0 10px; }
.tos-toc-brand span { color: var(--accent2); }
.tos-toc-sub { display: block; padding: 2px 10px 14px; font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim); }
.tos-toc-item { display: flex; gap: 10px; align-items: baseline; padding: 9px 10px; border-radius: 12px; text-decoration: none; transition: background 0.2s; }
.tos-toc-item:hover { background: var(--glass2); }
.tos-toc-item.active { background: var(--accent); }
.tos-toc-num { font-size: 0.62rem; letter-spacing: 0.1em; color: var(--text-dim); }
.tos-toc-label { font-size: 0.82rem; color: var(--text-dim); line-height: 1.3; }
.tos-toc-item.active .tos-toc-num, .tos-toc-item.active .tos-toc-label { color: #fff; }

/* ── Tab mobile (chip scroll horizontal) ── */
.tos-mobile-tabs { display: none; position: sticky; top: 68px; z-index: 40; margin: 0 calc(var(--bn-pad) * -1); padding: 8px var(--bn-pad); background: var(--nav-bg); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); overflow-x: auto; gap: 8px; scrollbar-width: none; }
.tos-mobile-tabs::-webkit-scrollbar { display: none; }
.tos-mobile-tab { flex: 0 0 auto; display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 99px; font-size: 0.76rem; text-decoration: none; color: var(--text-dim); border: 1px solid var(--border2); background: var(--glass); }
.tos-mobile-tab.active { background: var(--accent); border-color: var(--accent); color: #fff; }

/* ── Konten: tiap section = kartu bento ── */
.tos-main { display: flex; flex-direction: column; gap: var(--bn-gap); min-width: 0; }
.tos-section { scroll-margin-top: 130px; padding: clamp(22px, 3.4vw, 40px); }
.tos-sec-num { font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent2); margin: 0 0 8px; }
.tos-sec-title { font-size: clamp(1.4rem, 3vw, 2rem); line-height: 1.12; margin: 0 0 18px; }
.tos-sec-divider { display: none; }
.tos-p { font-size: 0.95rem; line-height: 1.8; color: var(--text-dim); margin: 0 0 14px; }
.tos-p:last-child { margin-bottom: 0; }
.tos-p strong, .tos-list strong { color: var(--text); font-weight: 600; }
.tos-list { list-style: none; padding: 0; margin: 0 0 14px; display: flex; flex-direction: column; gap: 10px; }
.tos-list li { display: flex; gap: 12px; font-size: 0.93rem; line-height: 1.7; color: var(--text-dim); min-width: 0; overflow-wrap: anywhere; }
.tos-list li::before { content: ''; flex: 0 0 7px; height: 7px; margin-top: 10px; border-radius: 50%; background: var(--accent2); }

/* Langkah-langkah */
.tos-steps { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 16px; }
.tos-step { display: flex; gap: 14px; padding: 16px; border-radius: 20px; background: var(--glass2); border: 1px solid var(--border2); }
.tos-step-num { flex: 0 0 34px; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-size: 0.82rem; font-weight: 600; color: #fff; background: var(--accent); }
.tos-step-title { font-size: 0.92rem; font-weight: 600; margin: 0 0 4px; }
.tos-step-desc { font-size: 0.82rem; line-height: 1.6; color: var(--text-dim); margin: 0; }

/* Definisi: grid kartu kecil (bukan tabel, biar nggak melebar di HP) */
.tos-def-table, .tos-def-table tbody { display: block; width: 100%; }
.tos-def-table tbody { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.tos-def-table tr { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; border-radius: 18px; background: var(--glass2); border: 1px solid var(--border2); }
.tos-def-table td { display: block; padding: 0; font-size: 0.86rem; line-height: 1.6; color: var(--text-dim); }
.tos-def-table td:first-child { font-size: 0.78rem; font-weight: 600; letter-spacing: 0.06em; color: var(--accent2); }

.tos-legal { display: inline-block; padding: 2px 9px; border-radius: 99px; font-size: 0.78rem; color: var(--accent2); background: var(--glass2); border: 1px solid var(--border2); max-width: 100%; overflow-wrap: anywhere; }
.tos-legal-link { color: var(--accent2); text-decoration: underline dotted; text-underline-offset: 3px; overflow-wrap: anywhere; }

.tos-infobox { display: flex; gap: 12px; padding: 14px 18px; border-radius: 20px; margin-bottom: 16px; font-size: 0.88rem; line-height: 1.65; color: var(--text-dim); }
.tos-infobox i { flex: 0 0 auto; margin-top: 3px; }
.tos-infobox.purple { background: rgba(139,92,246,0.09); border: 1px solid rgba(139,92,246,0.25); } .tos-infobox.purple i { color: var(--accent2); }
.tos-infobox.yellow { background: rgba(251,191,36,0.07); border: 1px solid rgba(251,191,36,0.25); } .tos-infobox.yellow i { color: #fbbf24; }
.tos-infobox.green { background: rgba(74,222,128,0.07); border: 1px solid rgba(74,222,128,0.25); } .tos-infobox.green i { color: #4ade80; }
.tos-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }

/* ── Responsive ── */
@media (max-width: 1000px) {
  .tos-layout { grid-template-columns: minmax(0, 1fr); }
  .tos-sidebar { display: none !important; }
  .tos-mobile-tabs { display: flex !important; }
}
@media (max-width: 640px) {
  .tos-page.bn { padding-top: 96px; }
  .tos-mobile-tabs { top: 60px; }
  .tos-steps, .tos-def-table tbody { grid-template-columns: minmax(0, 1fr); }
  .tos-section { scroll-margin-top: 120px; }
  .tos-cta .bn-btn { width: 100%; }
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

      <div className="tos-page bn">

        {/* ══════ HERO (bento) ══════ */}
        <div className="bn-wrap">
        <div className="bn-grid">
          <Reveal className="bn-card bn-hello bn-span-4">
            <span className="bn-kicker">Syarat &amp; Ketentuan</span>
            <h1 className="bn-title">Terms of <span>Service</span></h1>
            <p className="bn-lead">Aturan main yang jelas antara kamu dan SynnnW Studio — dari order, pembayaran, revisi, sampai hak cipta.</p>
            <div className="tos-pills">
              <span className="tos-meta-pill"><i className="fa-solid fa-calendar-check" /> Diperbarui 1 Juni 2026</span>
              <span className="tos-meta-pill"><i className="fa-solid fa-location-dot" /> Berlaku di Indonesia</span>
            </div>
          </Reveal>
          <Reveal className="bn-card bn-hot bn-span-2" delay={0.08}>
            <span className="bn-kicker" style={{ color: 'rgba(255,255,255,.85)' }}>Sections</span>
            <div>
              <div className="bn-big">12</div>
              <small>poin ketentuan</small>
            </div>
            <button className="bn-btn tos-hot-btn" onClick={() => navigate('/price-list')}>Lihat Price List <Arrow /></button>
          </Reveal>
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
          <aside className="tos-sidebar bn-card" aria-label="Table of contents">
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
            <section id="pengantar" className="tos-section bn-card">
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
            <section id="definisi" className="tos-section bn-card">
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
            <section id="layanan" className="tos-section bn-card">
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
            <section id="how-to" className="tos-section bn-card">
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
            <section id="pembayaran" className="tos-section bn-card">
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
            <section id="revisi" className="tos-section bn-card">
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
            <section id="hki" className="tos-section bn-card">
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
            <section id="batasan" className="tos-section bn-card">
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
            <section id="privasi" className="tos-section bn-card">
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
            <section id="international" className="tos-section bn-card">
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
            <section id="pembatalan" className="tos-section bn-card">
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
            <section id="sengketa" className="tos-section bn-card">
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
              <div className="tos-cta">
                <button className="bn-btn bn-btn--solid" onClick={() => navigate('/price-list')}>
                  Lihat Price List <Arrow />
                </button>
                <a className="bn-btn" href={waLink('Halo, saya mau tanya soal Terms of Service SynnnW Studio')} target="_blank" rel="noopener noreferrer">
                  Hubungi Kami <Arrow />
                </a>
              </div>
            </section>

          </main>
        </div>
        </div>
      </div>
    </>
  );
}
