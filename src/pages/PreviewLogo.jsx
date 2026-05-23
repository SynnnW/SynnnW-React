import { useEffect, useRef, useState } from 'react';

/* ══════════════════════════════════════════════════════════════
   GANTI NILAI INI SESUAI KARYA KAMU
══════════════════════════════════════════════════════════════ */
const CONFIG = {
  logoName:      'HARJAKASI 208',
  tagline:       'Agustus Main ke Situbondo',
  authorName:    'Aldo Leo Saputra',       // nama lengkap kamu
  authorDistrict:'Kec. Situbondo',          // kecamatan/desa/kota kamu
  instagramHandle:'@aldosynnn',
  driveLink:     'https://drive.google.com/your-link-here', // GANTI LINK DRIVE KAMU
  previewImg:    '/assets/img/logo-harjakasi.png',           // GANTI PATH LOGO KAMU

  /* Palet warna logo — sesuaikan dengan warna logo kamu */
  colors: [
    { name: 'Merah Berani',    hex: '#C0392B', desc: 'Semangat perjuangan dan keberanian rakyat Situbondo' },
    { name: 'Emas Kejayaan',   hex: '#D4A017', desc: 'Kemakmuran dan keagungan budaya lokal' },
    { name: 'Biru Samudra',    hex: '#1A4E8A', desc: 'Pesisir Situbondo, laut dan cakrawala masa depan' },
    { name: 'Hijau Lestari',   hex: '#2E7D32', desc: 'Alam dan kearifan lokal yang terjaga' },
    { name: 'Krem Linen',      hex: '#F5F0E8', desc: 'Latar bersih, keterbacaan maksimal di semua media' },
  ],

  /* Filosofi — sesuaikan */
  philosophy: [
    {
      icon: '🏛️',
      title: 'Identitas Lokal',
      body: 'Elemen visual terinspirasi dari Pantai Pasir Putih, Candi Gapura Wringinanom, dan motif batik khas Situbondo — menyatu dalam satu simbol yang kuat.',
    },
    {
      icon: '🔢',
      title: 'Angka 208',
      body: 'Tiga digit angka dirancang membentuk komposisi dinamis yang merepresentasikan keberlanjutan sejarah 208 tahun Kabupaten Situbondo yang terus berkembang.',
    },
    {
      icon: '✨',
      title: 'Semangat Kemajuan',
      body: 'Garis-garis geometris yang memancar ke atas melambangkan masyarakat Situbondo yang progresif, kreatif, dan siap naik kelas menuju masa depan lebih cerah.',
    },
    {
      icon: '🤝',
      title: 'Kebersamaan',
      body: 'Bentuk yang memeluk dari kiri dan kanan mencerminkan kebersamaan lintas suku, agama, dan budaya yang menjadi kekuatan utama kabupaten ini.',
    },
  ],

  /* Mockup labels */
  mockups: [
    { label: 'Spanduk & Baliho',   icon: 'fa-rectangle-ad',   bg: '#1a1a2e' },
    { label: 'Media Sosial',        icon: 'fa-square',         bg: '#0f3460' },
    { label: 'Kaos / Merchandise',  icon: 'fa-shirt',          bg: '#533483' },
    { label: 'Kop Surat Resmi',     icon: 'fa-file-lines',     bg: '#F5F0E8' },
    { label: 'Stiker & Pin',        icon: 'fa-certificate',    bg: '#2E7D32' },
    { label: 'Layar Digital',       icon: 'fa-display',        bg: '#C0392B' },
  ],
};

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
export default function PreviewLogo() {
  const revealRefs = useRef([]);
  const [copied, setCopied]       = useState(null);
  const [activeMock, setActiveMock] = useState(0);

  /* Reveal on scroll */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('pv-visible')),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const reveal = (delay = 0) => {
    const el = (node) => { if (node) revealRefs.current.push(node); };
    return { ref: el, className: 'pv-reveal', style: { animationDelay: `${delay}ms` } };
  };

  const copyColor = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="pv-page">

        {/* ── Orbs ─────────────────────────────────────── */}
        <div className="pv-orb pv-orb1" />
        <div className="pv-orb pv-orb2" />
        <div className="pv-orb pv-orb3" />

        {/* ══════════ 1. HERO ══════════ */}
        <section className="pv-hero">
          <div className="pv-hero-inner">

            <div className="pv-hero-meta" {...reveal(0)}>
              <span className="pv-badge">
                <i className="fa-solid fa-trophy" /> LOMBA LOGO HARJAKASI KE-208
              </span>
              <span className="pv-badge pv-badge-date">
                <i className="fa-solid fa-calendar" /> 22 Mei – 22 Juni 2026
              </span>
            </div>

            <h1 className="pv-hero-title" {...reveal(100)}>
              <em>{CONFIG.tagline}</em>
              <span>{CONFIG.logoName}</span>
            </h1>

            <p className="pv-hero-sub" {...reveal(200)}>
              Karya desain oleh <strong>{CONFIG.authorName}</strong> — {CONFIG.authorDistrict}<br />
              Dokumentasi brand resmi untuk keperluan penilaian dan publikasi.
            </p>

            <div className="pv-hero-actions" {...reveal(300)}>
              <a
                href={CONFIG.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="pv-btn-download"
              >
                <i className="fa-solid fa-cloud-arrow-down" />
                <span>
                  <strong>Download File AI / PNG</strong>
                  <em>Adobe Illustrator · PNG 300 dpi</em>
                </span>
                <i className="fa-solid fa-arrow-up-right pv-btn-arrow" />
              </a>

              <a
                href={`https://instagram.com/${CONFIG.instagramHandle.replace('@','')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pv-btn-ig"
              >
                <i className="fa-brands fa-instagram" />
                <span>{CONFIG.instagramHandle}</span>
              </a>
            </div>

            {/* Hashtags */}
            <div className="pv-hashtags" {...reveal(400)}>
              {['#LombaLogoHarjakasi208','#SitubondoNaikKelas','#AgustusMainKeSitubondo'].map(h => (
                <span key={h} className="pv-hashtag">{h}</span>
              ))}
            </div>
          </div>

          {/* Logo preview */}
          <div className="pv-hero-logo" {...reveal(150)}>
            <div className="pv-logo-frame">
              <div className="pv-logo-ring pv-ring1" />
              <div className="pv-logo-ring pv-ring2" />
              <div className="pv-logo-placeholder">
                {/* Ganti <div> ini dengan <img src={CONFIG.previewImg} alt="Logo HARJAKASI 208" /> */}
                <div className="pv-logo-mock-svg">
                  <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="rg1" cx="50%" cy="50%" r="50%">
                        <stop offset="0%"   stopColor="#D4A017" stopOpacity="0.9"/>
                        <stop offset="100%" stopColor="#C0392B" stopOpacity="0.7"/>
                      </radialGradient>
                      <radialGradient id="rg2" cx="30%" cy="70%" r="60%">
                        <stop offset="0%"   stopColor="#1A4E8A" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.4"/>
                      </radialGradient>
                    </defs>
                    {/* Outer circle */}
                    <circle cx="150" cy="150" r="138" fill="none" stroke="url(#rg1)" strokeWidth="2.5" opacity="0.6"/>
                    {/* Inner shapes */}
                    <polygon points="150,40 220,100 200,185 150,215 100,185 80,100"
                      fill="none" stroke="#D4A017" strokeWidth="2" opacity="0.8"/>
                    <text x="150" y="148" textAnchor="middle"
                      fontFamily="'Cormorant Garamond',serif" fontSize="62" fontWeight="700"
                      fill="url(#rg1)" letterSpacing="-2">208</text>
                    <text x="150" y="182" textAnchor="middle"
                      fontFamily="'Outfit',sans-serif" fontSize="13" fontWeight="700"
                      fill="#D4A017" letterSpacing="6" opacity="0.85">HARJAKASI</text>
                    <text x="150" y="200" textAnchor="middle"
                      fontFamily="'Outfit',sans-serif" fontSize="7.5" fontWeight="400"
                      fill="#aaa" letterSpacing="3">KABUPATEN SITUBONDO</text>
                    {/* Decorative stars */}
                    {[0,60,120,180,240,300].map((a,i) => {
                      const r2 = 125;
                      const rad = (a - 90) * Math.PI / 180;
                      return <circle key={i} cx={150 + r2*Math.cos(rad)} cy={150 + r2*Math.sin(rad)}
                        r="3" fill="#D4A017" opacity="0.6" />;
                    })}
                  </svg>
                  <p className="pv-logo-swap-hint">
                    <i className="fa-solid fa-circle-info" />
                    Ganti SVG ini dengan foto logo kamu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 2. STATISTIK KARYA ══════════ */}
        <section className="pv-stats-band">
          {[
            { num: '208',    label: 'Tahun Sejarah',     icon: 'fa-landmark' },
            { num: '300dpi', label: 'Resolusi Desain',   icon: 'fa-expand' },
            { num: '5',      label: 'Elemen Filosofi',   icon: 'fa-layer-group' },
            { num: 'AI/PNG', label: 'Format File',        icon: 'fa-file-export' },
            { num: '6+',     label: 'Variasi Mockup',    icon: 'fa-images' },
          ].map((s, i) => (
            <div key={i} className="pv-stat-item" {...reveal(i * 80)}>
              <i className={`fa-solid ${s.icon} pv-stat-icon`} />
              <span className="pv-stat-num">{s.num}</span>
              <span className="pv-stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* ══════════ 3. FILOSOFI & KONSEP ══════════ */}
        <section className="pv-section">
          <div className="pv-section-inner">
            <div className="pv-section-header" {...reveal()}>
              <span className="pv-section-eyebrow">
                <i className="fa-solid fa-lightbulb" /> FILOSOFI & KONSEP
              </span>
              <h2 className="pv-section-title">Makna di Balik<br /><em>Setiap Garis</em></h2>
              <p className="pv-section-sub">
                Setiap elemen visual dirancang bukan sekadar estetika —
                melainkan perwujudan nilai, sejarah, dan semangat Situbondo.
              </p>
            </div>

            <div className="pv-philosophy-grid">
              {CONFIG.philosophy.map((p, i) => (
                <div key={i} className="pv-phil-card" {...reveal(i * 100)}>
                  <span className="pv-phil-icon">{p.icon}</span>
                  <h3 className="pv-phil-title">{p.title}</h3>
                  <p className="pv-phil-body">{p.body}</p>
                  <div className="pv-phil-num">{String(i + 1).padStart(2, '0')}</div>
                </div>
              ))}
            </div>

            {/* Extended philosophy prose */}
            <div className="pv-phil-prose" {...reveal()}>
              <div className="pv-prose-quote">
                <i className="fa-solid fa-quote-left pv-quote-icon" />
                <blockquote>
                  Logo ini lahir dari kecintaan terhadap Situbondo — bukan hanya sebagai
                  simbol seremonial, melainkan sebagai cermin identitas kolektif 208 tahun
                  perjalanan kabupaten yang kaya budaya, tangguh dalam sejarah, dan
                  penuh optimisme menghadapi masa depan.
                </blockquote>
                <cite>— {CONFIG.authorName}</cite>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 4. PALET WARNA ══════════ */}
        <section className="pv-section pv-section-alt">
          <div className="pv-section-inner">
            <div className="pv-section-header" {...reveal()}>
              <span className="pv-section-eyebrow">
                <i className="fa-solid fa-palette" /> PALET WARNA
              </span>
              <h2 className="pv-section-title">Bahasa Warna<br /><em>yang Bermakna</em></h2>
            </div>

            <div className="pv-color-grid">
              {CONFIG.colors.map((col, i) => (
                <div key={i} className="pv-color-card" {...reveal(i * 70)}
                  onClick={() => copyColor(col.hex)}
                  title="Klik untuk salin kode warna"
                >
                  <div className="pv-color-swatch" style={{ background: col.hex }}>
                    <span className="pv-color-copy-hint">
                      {copied === col.hex ? <><i className="fa-solid fa-check" /> Tersalin!</> : <><i className="fa-regular fa-copy" /> Salin</>}
                    </span>
                  </div>
                  <div className="pv-color-info">
                    <span className="pv-color-name">{col.name}</span>
                    <code className="pv-color-hex">{col.hex}</code>
                    <p className="pv-color-desc">{col.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ 5. VARIASI LOGO ══════════ */}
        <section className="pv-section">
          <div className="pv-section-inner">
            <div className="pv-section-header" {...reveal()}>
              <span className="pv-section-eyebrow">
                <i className="fa-solid fa-clone" /> VARIASI LOGO
              </span>
              <h2 className="pv-section-title">Adaptif di Semua<br /><em>Situasi</em></h2>
              <p className="pv-section-sub">
                Logo dirancang agar tetap kuat dan terbaca di berbagai latar belakang —
                gelap, terang, berwarna, maupun monokrom.
              </p>
            </div>

            <div className="pv-variants-grid">
              {[
                { bg: '#0a0a0f',  label: 'Latar Gelap',      txt: '#fff' },
                { bg: '#F5F0E8',  label: 'Latar Terang',     txt: '#1a1916' },
                { bg: '#1A4E8A',  label: 'Latar Biru',       txt: '#fff' },
                { bg: '#C0392B',  label: 'Latar Merah',      txt: '#fff' },
                { bg: '#D4A017',  label: 'Latar Emas',       txt: '#1a1916' },
                { bg: '#2E7D32',  label: 'Latar Hijau',      txt: '#fff' },
              ].map((v, i) => (
                <div key={i} className="pv-variant-card" {...reveal(i * 60)}>
                  <div className="pv-variant-preview" style={{ background: v.bg }}>
                    <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" className="pv-variant-svg">
                      <circle cx="80" cy="50" r="44" fill="none" stroke={v.txt} strokeWidth="1" opacity="0.4"/>
                      <text x="80" y="56" textAnchor="middle"
                        fontFamily="'Cormorant Garamond',serif" fontSize="28" fontWeight="700"
                        fill={v.txt} opacity="0.9">208</text>
                      <text x="80" y="70" textAnchor="middle"
                        fontFamily="'Outfit',sans-serif" fontSize="5.5" fontWeight="700"
                        fill={v.txt} opacity="0.7" letterSpacing="3">HARJAKASI</text>
                    </svg>
                  </div>
                  <span className="pv-variant-label" style={{ color: 'var(--pv-text-dim)' }}>{v.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ 6. MOCKUP APLIKASI ══════════ */}
        <section className="pv-section pv-section-alt">
          <div className="pv-section-inner">
            <div className="pv-section-header" {...reveal()}>
              <span className="pv-section-eyebrow">
                <i className="fa-solid fa-layer-group" /> MOCKUP APLIKASI
              </span>
              <h2 className="pv-section-title">Logo di Dunia<br /><em>Nyata</em></h2>
              <p className="pv-section-sub">
                Tampilan logo saat diaplikasikan pada berbagai media — cetak, digital, dan merchandise.
              </p>
            </div>

            {/* Tab selector */}
            <div className="pv-mock-tabs" {...reveal()}>
              {CONFIG.mockups.map((m, i) => (
                <button key={i}
                  className={`pv-mock-tab${activeMock === i ? ' active' : ''}`}
                  onClick={() => setActiveMock(i)}
                >
                  <i className={`fa-solid ${m.icon}`} />
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Mockup display */}
            <div className="pv-mock-display" {...reveal()}>
              <div className="pv-mock-canvas" style={{ background: CONFIG.mockups[activeMock].bg }}>
                <MockupPreview index={activeMock} bg={CONFIG.mockups[activeMock].bg} />
                <div className="pv-mock-label-badge">
                  <i className={`fa-solid ${CONFIG.mockups[activeMock].icon}`} />
                  {CONFIG.mockups[activeMock].label}
                </div>
              </div>
              <div className="pv-mock-note">
                <i className="fa-solid fa-circle-info" />
                <span>
                  Mockup di atas menggunakan placeholder SVG. Setelah logo kamu jadi,
                  ganti SVG dengan <code>&lt;img src=&#123;CONFIG.previewImg&#125; /&gt;</code>
                  agar tampil nyata di semua mockup.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 7. KETENTUAN TEKNIS ══════════ */}
        <section className="pv-section">
          <div className="pv-section-inner">
            <div className="pv-section-header" {...reveal()}>
              <span className="pv-section-eyebrow">
                <i className="fa-solid fa-ruler-combined" /> SPESIFIKASI TEKNIS
              </span>
              <h2 className="pv-section-title">Standar File<br /><em>& Format</em></h2>
            </div>

            <div className="pv-spec-grid">
              {[
                { icon: 'fa-expand-arrows-alt', title: 'Resolusi', val: '3000 × 3000 px', sub: 'Minimal 300 dpi' },
                { icon: 'fa-file-image',        title: 'Format Kirim', val: 'JPG / PNG',   sub: 'Resolusi tinggi' },
                { icon: 'fa-file-code',         title: 'File Master', val: 'AI · CDR · EPS · SVG · PDF', sub: 'Wajib bila menang' },
                { icon: 'fa-ban',               title: 'Larangan',    val: 'No Watermark', sub: 'No AI generatif' },
                { icon: 'fa-crop-simple',       title: 'Rasio Unggah',val: '1:1 atau 4:5', sub: 'Disarankan Instagram' },
                { icon: 'fa-lock-open',         title: 'Akun IG',     val: 'Wajib Publik', sub: 'Selama masa lomba' },
              ].map((s, i) => (
                <div key={i} className="pv-spec-card" {...reveal(i * 70)}>
                  <i className={`fa-solid ${s.icon} pv-spec-icon`} />
                  <div>
                    <p className="pv-spec-title">{s.title}</p>
                    <p className="pv-spec-val">{s.val}</p>
                    <p className="pv-spec-sub">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ 8. HADIAH ══════════ */}
        <section className="pv-section pv-section-alt">
          <div className="pv-section-inner">
            <div className="pv-section-header" {...reveal()}>
              <span className="pv-section-eyebrow">
                <i className="fa-solid fa-gift" /> HADIAH PEMENANG
              </span>
              <h2 className="pv-section-title">Penghargaan<br /><em>yang Menanti</em></h2>
            </div>

            <div className="pv-prize-row">
              <div className="pv-prize-main" {...reveal()}>
                <div className="pv-prize-crown">
                  <i className="fa-solid fa-crown" />
                </div>
                <p className="pv-prize-type">Juara Utama</p>
                <p className="pv-prize-amount">Rp 4.000.000</p>
                <p className="pv-prize-note">1 Pemenang Utama</p>
              </div>

              <div className="pv-prize-others">
                {[
                  { icon: 'fa-medal',     label: '3 Karya Terbaik Juri', val: '@Rp 500.000', count: '3 karya' },
                  { icon: 'fa-heart',     label: 'Karya Terfavorit',     val: 'Rp 500.000',  count: 'Like terbanyak' },
                  { icon: 'fa-ticket',    label: '10 Karya Terbaik',     val: 'Voucher @Rp 100.000', count: '10 karya' },
                ].map((p, i) => (
                  <div key={i} className="pv-prize-card" {...reveal(i * 100)}>
                    <i className={`fa-solid ${p.icon} pv-prize-card-icon`} />
                    <div>
                      <p className="pv-prize-card-label">{p.label}</p>
                      <p className="pv-prize-card-val">{p.val}</p>
                      <p className="pv-prize-card-count">{p.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 9. KRITERIA PENILAIAN ══════════ */}
        <section className="pv-section">
          <div className="pv-section-inner">
            <div className="pv-section-header" {...reveal()}>
              <span className="pv-section-eyebrow">
                <i className="fa-solid fa-star-half-stroke" /> KRITERIA PENILAIAN
              </span>
              <h2 className="pv-section-title">Bagaimana Karya<br /><em>Dinilai</em></h2>
            </div>

            <div className="pv-criteria-list">
              {[
                ['Orisinalitas & Kreativitas',       'Karya sepenuhnya orisinal — bukan AI, bukan tiruan'],
                ['Kesesuaian Tema',                   'Mencerminkan semangat HUT ke-208 Kabupaten Situbondo'],
                ['Makna & Filosofi Logo',             'Setiap elemen memiliki cerita dan alasan yang kuat'],
                ['Estetika Visual & Kekuatan Identitas','Tampak profesional, memorable, dan unik'],
                ['Kemudahan Aplikasi di Berbagai Media','Berfungsi di cetak, digital, dan merchandise'],
                ['Karya Terfavorit (Like/Share/Comment)','Ditentukan oleh engagement postingan Instagram peserta'],
              ].map(([title, desc], i) => (
                <div key={i} className="pv-criteria-item" {...reveal(i * 60)}>
                  <span className="pv-criteria-num">{String(i + 1).padStart(2,'0')}</span>
                  <div className="pv-criteria-bar" style={{ width: `${100 - i * 8}%` }} />
                  <div className="pv-criteria-text">
                    <p className="pv-criteria-title">{title}</p>
                    <p className="pv-criteria-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ 10. DOWNLOAD CTA ══════════ */}
        <section className="pv-cta-section">
          <div className="pv-cta-inner">
            <div className="pv-cta-orb" />
            <span className="pv-section-eyebrow" style={{ marginBottom: 16 }} {...reveal()}>
              <i className="fa-solid fa-cloud-arrow-down" /> FILE RESMI KARYA
            </span>
            <h2 className="pv-cta-title" {...reveal(100)}>
              Unduh File<br /><em>Lengkap di Sini</em>
            </h2>
            <p className="pv-cta-sub" {...reveal(200)}>
              Tersedia file Adobe Illustrator (.ai), PNG 300 dpi, dan PDF vektor.
              Semua format sesuai ketentuan teknis lomba.
            </p>
            <div className="pv-cta-actions" {...reveal(300)}>
              <a href={CONFIG.driveLink} target="_blank" rel="noopener noreferrer"
                className="pv-cta-btn-primary">
                <i className="fa-brands fa-google-drive" />
                <span>
                  <strong>Buka Google Drive</strong>
                  <em>AI · PNG · PDF · SVG</em>
                </span>
                <i className="fa-solid fa-arrow-up-right" />
              </a>
            </div>

            <div className="pv-cta-files">
              {[
                { icon: 'fa-file-ai',    label: 'logo-harjakasi-208.ai',  size: 'Adobe Illustrator' },
                { icon: 'fa-file-image', label: 'logo-harjakasi-208.png', size: 'PNG 3000×3000 · 300dpi' },
                { icon: 'fa-file-pdf',   label: 'logo-harjakasi-208.pdf', size: 'PDF Vektor' },
                { icon: 'fa-file-code',  label: 'logo-harjakasi-208.svg', size: 'SVG Scalable' },
              ].map((file, i) => (
                <div key={i} className="pv-file-chip" {...reveal(i * 50)}>
                  <i className={`fa-solid ${file.icon}`} />
                  <span className="pv-file-name">{file.label}</span>
                  <span className="pv-file-size">{file.size}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ FOOTER ══════════ */}
        <footer className="pv-footer">
          <div className="pv-footer-inner">
            <div className="pv-footer-brand">
              <span className="pv-footer-logo">SynnnW<span>*</span></span>
              <p>Karya untuk Situbondo.</p>
            </div>
            <div className="pv-footer-meta">
              <p>Desainer: <strong>{CONFIG.authorName}</strong></p>
              <p>{CONFIG.instagramHandle} · {CONFIG.authorDistrict}</p>
              <p>Lomba Logo HARJAKASI ke-208 · Kabupaten Situbondo · 2026</p>
            </div>
            <div className="pv-footer-tags">
              {['#LombaLogoHarjakasi208','#SitubondoNaikKelas','#AgustusMainKeSitubondo'].map(h=>(
                <span key={h} className="pv-hashtag">{h}</span>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

/* ── Mockup sub-component ────────────────────────────────── */
function MockupPreview({ index, bg }) {
  const isLight = ['#F5F0E8','#ffffff'].includes(bg.toLowerCase());
  const tc = isLight ? '#1a1916' : '#ffffff';

  const mockups = [
    /* 0 Spanduk */
    <svg key={0} viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:560}}>
      <rect x="10" y="10" width="580" height="180" rx="6" fill="none" stroke={tc} strokeWidth="1.5" opacity="0.3"/>
      <text x="300" y="72" textAnchor="middle" fontFamily="'Cormorant Garamond',serif"
        fontSize="22" fill={tc} opacity="0.5" letterSpacing="8">SELAMAT</text>
      <text x="300" y="108" textAnchor="middle" fontFamily="'Cormorant Garamond',serif"
        fontSize="36" fontWeight="700" fill="#D4A017" letterSpacing="-1">HARI JADI KE-208</text>
      <text x="300" y="136" textAnchor="middle" fontFamily="'Outfit',sans-serif"
        fontSize="14" fill={tc} opacity="0.6" letterSpacing="6">KABUPATEN SITUBONDO</text>
      <circle cx="80" cy="100" r="45" fill="none" stroke="#D4A017" strokeWidth="1.5" opacity="0.7"/>
      <text x="80" y="106" textAnchor="middle" fontFamily="'Cormorant Garamond',serif"
        fontSize="22" fontWeight="700" fill="#D4A017">208</text>
      <circle cx="520" cy="100" r="45" fill="none" stroke="#D4A017" strokeWidth="1.5" opacity="0.7"/>
      <text x="520" y="106" textAnchor="middle" fontFamily="'Cormorant Garamond',serif"
        fontSize="22" fontWeight="700" fill="#D4A017">208</text>
    </svg>,

    /* 1 Social media square */
    <svg key={1} viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style={{width:260,height:260}}>
      <rect x="0" y="0" width="300" height="300" rx="16" fill={bg} opacity="0.3"/>
      <circle cx="150" cy="130" r="80" fill="none" stroke="#D4A017" strokeWidth="1.5" opacity="0.6"/>
      <text x="150" y="138" textAnchor="middle" fontFamily="'Cormorant Garamond',serif"
        fontSize="52" fontWeight="700" fill={tc}>208</text>
      <text x="150" y="162" textAnchor="middle" fontFamily="'Outfit',sans-serif"
        fontSize="9" fontWeight="700" fill="#D4A017" letterSpacing="5">HARJAKASI</text>
      <text x="150" y="240" textAnchor="middle" fontFamily="'Outfit',sans-serif"
        fontSize="8" fill={tc} opacity="0.5" letterSpacing="3">#AgustusMainKeSitubondo</text>
    </svg>,

    /* 2 Kaos */
    <svg key={2} viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" style={{width:260,height:280}}>
      <path d="M90,30 L60,80 L100,90 L100,280 L200,280 L200,90 L240,80 L210,30 L175,50 Q150,30 125,50 Z"
        fill="none" stroke={tc} strokeWidth="2" opacity="0.4"/>
      <circle cx="150" cy="170" r="52" fill="none" stroke="#D4A017" strokeWidth="1.5" opacity="0.8"/>
      <text x="150" y="178" textAnchor="middle" fontFamily="'Cormorant Garamond',serif"
        fontSize="34" fontWeight="700" fill={tc}>208</text>
      <text x="150" y="198" textAnchor="middle" fontFamily="'Outfit',sans-serif"
        fontSize="7" fontWeight="700" fill="#D4A017" letterSpacing="4">HARJAKASI</text>
    </svg>,

    /* 3 Kop surat */
    <svg key={3} viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:400}}>
      <rect x="10" y="10" width="380" height="260" rx="4" fill={isLight?'#fff':'#f5f0e8'} opacity="0.08"/>
      <line x1="10" y1="68" x2="390" y2="68" stroke="#D4A017" strokeWidth="2"/>
      <circle cx="50" cy="38" r="24" fill="none" stroke="#D4A017" strokeWidth="1.5"/>
      <text x="50" y="44" textAnchor="middle" fontFamily="'Cormorant Garamond',serif"
        fontSize="16" fontWeight="700" fill={isLight?'#1a1916':tc}>208</text>
      <text x="125" y="33" fontFamily="'Cormorant Garamond',serif"
        fontSize="13" fontWeight="700" fill={isLight?'#1a1916':tc}>PEMERINTAH KABUPATEN SITUBONDO</text>
      <text x="125" y="50" fontFamily="'Outfit',sans-serif"
        fontSize="8" fill={isLight?'#555':tc} opacity="0.6">HARJAKASI KE-208 · 2026</text>
      {[90,108,126,144,162,180].map((y,i)=>(
        <rect key={i} x="28" y={y} width={280-i*20} height="5" rx="2"
          fill={isLight?'#555':tc} opacity="0.15"/>
      ))}
    </svg>,

    /* 4 Stiker */
    <svg key={4} viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style={{width:240,height:240}}>
      <circle cx="150" cy="150" r="130" fill="none" stroke={tc} strokeWidth="2" opacity="0.3"
        strokeDasharray="8 4"/>
      <circle cx="150" cy="150" r="110" fill={bg} stroke="#D4A017" strokeWidth="2.5" opacity="0.9"/>
      <text x="150" y="145" textAnchor="middle" fontFamily="'Cormorant Garamond',serif"
        fontSize="58" fontWeight="700" fill={tc}>208</text>
      <text x="150" y="172" textAnchor="middle" fontFamily="'Outfit',sans-serif"
        fontSize="10" fontWeight="800" fill="#D4A017" letterSpacing="6">HARJAKASI</text>
      <text x="150" y="190" textAnchor="middle" fontFamily="'Outfit',sans-serif"
        fontSize="7" fill={tc} opacity="0.5" letterSpacing="3">SITUBONDO · 2026</text>
    </svg>,

    /* 5 Layar Digital */
    <svg key={5} viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:460}}>
      <rect x="10" y="10" width="480" height="280" rx="12" fill="none" stroke={tc} strokeWidth="2" opacity="0.25"/>
      <rect x="10" y="10" width="480" height="28" rx="12" fill={tc} opacity="0.08"/>
      <circle cx="28" cy="24" r="5" fill="#ff5f57" opacity="0.8"/>
      <circle cx="44" cy="24" r="5" fill="#febc2e" opacity="0.8"/>
      <circle cx="60" cy="24" r="5" fill="#28c840" opacity="0.8"/>
      <text x="250" y="160" textAnchor="middle" fontFamily="'Cormorant Garamond',serif"
        fontSize="60" fontWeight="700" fill={tc} opacity="0.9">208</text>
      <text x="250" y="192" textAnchor="middle" fontFamily="'Outfit',sans-serif"
        fontSize="11" fontWeight="700" fill="#D4A017" letterSpacing="8">HARJAKASI</text>
      <text x="250" y="212" textAnchor="middle" fontFamily="'Outfit',sans-serif"
        fontSize="7" fill={tc} opacity="0.4" letterSpacing="4">KABUPATEN SITUBONDO</text>
    </svg>,
  ];

  return <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',height:'100%'}}>
    {mockups[index] || mockups[0]}
  </div>;
}

/* ══════════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,700&family=Outfit:wght@300;400;500;600;700;800&display=swap');

/* ── tokens ── */
.pv-page {
  --pv-bg:      var(--bg, #0a0a0f);
  --pv-bg2:     var(--bg2, #111118);
  --pv-text:    var(--text, #f0ede8);
  --pv-text-dim:var(--text-dim, #64605a);
  --pv-accent:  var(--accent, #8b5cf6);
  --pv-gold:    #D4A017;
  --pv-red:     #C0392B;
  --pv-blue:    #1A4E8A;
  --pv-border:  var(--border, rgba(255,255,255,0.07));
  --pv-glass:   var(--glass, rgba(255,255,255,0.04));
  --pv-shadow:  var(--shadow, rgba(0,0,0,0.7));

  font-family: 'Outfit', sans-serif;
  background: var(--pv-bg);
  color: var(--pv-text);
  overflow-x: hidden;
  position: relative;
}

/* ── reveal ── */
.pv-reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.pv-reveal.pv-visible {
  opacity: 1;
  transform: none;
}

/* ── orbs ── */
.pv-orb {
  position: fixed; border-radius: 50%;
  pointer-events: none; z-index: 0;
  filter: blur(110px);
}
.pv-orb1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(212,160,23,0.08) 0%, transparent 65%);
  top: -200px; left: -200px;
}
.pv-orb2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(192,57,43,0.07) 0%, transparent 65%);
  top: 40vh; right: -150px;
}
.pv-orb3 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(26,78,138,0.09) 0%, transparent 65%);
  bottom: 20vh; left: 10%;
}

/* ══ HERO ══ */
.pv-hero {
  position: relative; z-index: 1;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 60px;
  padding: 120px 80px 100px;
  max-width: 1280px;
  margin: 0 auto;
}
.pv-hero-inner { display: flex; flex-direction: column; gap: 24px; }
.pv-hero-meta  { display: flex; flex-wrap: wrap; gap: 10px; }

.pv-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 6px 14px;
  background: var(--pv-glass);
  border: 1px solid var(--pv-border);
  border-radius: 99px;
  font-size: 0.62rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--pv-text-dim);
}
.pv-badge-date i { color: var(--pv-gold); }

.pv-hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300; line-height: 1.02;
  letter-spacing: -0.02em;
  margin: 0;
}
.pv-hero-title em {
  display: block;
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  color: var(--pv-gold);
  font-style: italic;
  letter-spacing: 0.01em;
  margin-bottom: 4px;
}
.pv-hero-title span {
  display: block;
  font-size: clamp(3.5rem, 8vw, 7rem);
  font-weight: 700;
  color: var(--pv-text);
}

.pv-hero-sub {
  font-size: 0.92rem; color: var(--pv-text-dim); line-height: 1.7;
}
.pv-hero-sub strong { color: var(--pv-text); }

.pv-hero-actions { display: flex; flex-wrap: wrap; gap: 14px; }

.pv-btn-download {
  display: inline-flex; align-items: center; gap: 14px;
  padding: 14px 22px;
  background: linear-gradient(135deg, rgba(212,160,23,0.18) 0%, rgba(212,160,23,0.08) 100%);
  border: 1px solid rgba(212,160,23,0.4);
  border-radius: 14px; text-decoration: none;
  transition: all 0.3s;
  position: relative; overflow: hidden;
}
.pv-btn-download::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(212,160,23,0.1), transparent);
  opacity: 0; transition: opacity 0.3s;
}
.pv-btn-download:hover { border-color: rgba(212,160,23,0.65); transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(212,160,23,0.18); }
.pv-btn-download:hover::before { opacity: 1; }
.pv-btn-download > i:first-child { font-size: 1.4rem; color: var(--pv-gold); flex-shrink: 0; }
.pv-btn-download span { display: flex; flex-direction: column; gap: 1px; }
.pv-btn-download span strong { font-size: 0.82rem; font-weight: 700; color: var(--pv-text); }
.pv-btn-download span em { font-size: 0.66rem; color: var(--pv-text-dim); font-style: normal; }
.pv-btn-arrow { font-size: 0.72rem; color: var(--pv-gold); opacity: 0.7; }

.pv-btn-ig {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 20px;
  background: var(--pv-glass);
  border: 1px solid var(--pv-border);
  border-radius: 14px; text-decoration: none;
  font-size: 0.82rem; font-weight: 600; color: var(--pv-text-dim);
  transition: all 0.3s;
}
.pv-btn-ig:hover { color: var(--pv-text); border-color: var(--pv-border); background: rgba(255,255,255,0.07); }
.pv-btn-ig i { font-size: 1.1rem; }

.pv-hashtags { display: flex; flex-wrap: wrap; gap: 8px; }
.pv-hashtag {
  font-size: 0.62rem; font-weight: 700; letter-spacing: 0.05em;
  color: var(--pv-accent); background: rgba(139,92,246,0.08);
  border: 1px solid rgba(139,92,246,0.2); border-radius: 99px;
  padding: 4px 12px;
}

/* Logo frame */
.pv-hero-logo {
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.pv-logo-frame {
  position: relative; width: 380px; height: 380px;
  display: flex; align-items: center; justify-content: center;
}
.pv-logo-ring {
  position: absolute; border-radius: 50%;
  border: 1px solid rgba(212,160,23,0.2);
  animation: pvSpin 20s linear infinite;
}
.pv-ring1 { width: 360px; height: 360px; }
.pv-ring2 { width: 300px; height: 300px; animation-duration: 15s; animation-direction: reverse;
  border-style: dashed; border-color: rgba(212,160,23,0.12); }
@keyframes pvSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.pv-logo-placeholder {
  width: 280px; height: 280px; border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, rgba(212,160,23,0.15) 0%, rgba(26,78,138,0.1) 50%, transparent 70%);
  border: 1px solid rgba(212,160,23,0.25);
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; overflow: hidden;
}
.pv-logo-mock-svg {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  width: 100%;
}
.pv-logo-mock-svg svg { width: 220px; height: 220px; }
.pv-logo-swap-hint {
  font-size: 0.56rem; color: var(--pv-text-dim);
  display: flex; align-items: center; gap: 4px;
  text-align: center; padding: 0 8px; line-height: 1.4;
}

/* ══ STATS BAND ══ */
.pv-stats-band {
  position: relative; z-index: 1;
  display: flex; flex-wrap: wrap; justify-content: center; gap: 0;
  border-top: 1px solid var(--pv-border);
  border-bottom: 1px solid var(--pv-border);
}
.pv-stat-item {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 28px 40px;
  border-right: 1px solid var(--pv-border);
  flex: 1; min-width: 140px;
}
.pv-stat-item:last-child { border-right: none; }
.pv-stat-icon { font-size: 1rem; color: var(--pv-gold); opacity: 0.7; }
.pv-stat-num  { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: var(--pv-text); }
.pv-stat-label{ font-size: 0.62rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--pv-text-dim); text-align: center; }

/* ══ SECTIONS ══ */
.pv-section { position: relative; z-index: 1; padding: 100px 0; }
.pv-section-alt { background: rgba(255,255,255,0.02); }
.pv-section-inner { max-width: 1100px; margin: 0 auto; padding: 0 80px; }

.pv-section-header {
  max-width: 640px;
  margin-bottom: 60px;
  display: flex; flex-direction: column; gap: 12px;
}
.pv-section-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 0.62rem; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--pv-gold);
}
.pv-section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 300; line-height: 1.08;
  color: var(--pv-text); margin: 0;
  letter-spacing: -0.02em;
}
.pv-section-title em { font-style: italic; color: var(--pv-gold); }
.pv-section-sub { font-size: 0.88rem; color: var(--pv-text-dim); line-height: 1.75; max-width: 520px; }

/* ══ PHILOSOPHY ══ */
.pv-philosophy-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
  margin-bottom: 40px;
}
.pv-phil-card {
  position: relative;
  background: var(--pv-glass);
  border: 1px solid var(--pv-border);
  border-radius: 20px; padding: 28px;
  overflow: hidden;
  transition: all 0.3s;
}
.pv-phil-card:hover { border-color: rgba(212,160,23,0.25); transform: translateY(-3px); }
.pv-phil-icon { font-size: 2rem; display: block; margin-bottom: 14px; }
.pv-phil-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem; font-weight: 600;
  color: var(--pv-text); margin-bottom: 10px;
}
.pv-phil-body { font-size: 0.82rem; color: var(--pv-text-dim); line-height: 1.75; }
.pv-phil-num {
  position: absolute; bottom: 20px; right: 24px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 3.5rem; font-weight: 700;
  color: var(--pv-gold); opacity: 0.07; line-height: 1;
  user-select: none;
}

.pv-phil-prose { margin-top: 16px; }
.pv-prose-quote {
  background: linear-gradient(135deg, rgba(212,160,23,0.06) 0%, rgba(26,78,138,0.04) 100%);
  border: 1px solid rgba(212,160,23,0.15);
  border-left: 3px solid var(--pv-gold);
  border-radius: 0 16px 16px 0; padding: 28px 32px;
  position: relative;
}
.pv-quote-icon {
  font-size: 1.4rem; color: var(--pv-gold); opacity: 0.35;
  display: block; margin-bottom: 12px;
}
blockquote {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.15rem; font-weight: 300; font-style: italic;
  color: var(--pv-text); line-height: 1.75; margin: 0 0 14px;
}
cite { font-size: 0.75rem; color: var(--pv-gold); font-style: normal; font-weight: 600; }

/* ══ COLOR PALETTE ══ */
.pv-color-grid {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px;
}
.pv-color-card {
  cursor: pointer;
  border-radius: 16px; overflow: hidden;
  border: 1px solid var(--pv-border);
  transition: all 0.3s;
}
.pv-color-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.15); }
.pv-color-swatch {
  height: 120px; position: relative;
  display: flex; align-items: flex-end; justify-content: flex-end;
  padding: 10px;
}
.pv-color-copy-hint {
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em;
  color: rgba(255,255,255,0.8);
  background: rgba(0,0,0,0.35);
  border-radius: 99px; padding: 4px 10px;
  backdrop-filter: blur(6px);
  opacity: 0; transition: opacity 0.2s;
  display: flex; align-items: center; gap: 4px;
}
.pv-color-card:hover .pv-color-copy-hint { opacity: 1; }
.pv-color-info { padding: 14px 16px; background: var(--pv-glass); }
.pv-color-name { font-size: 0.78rem; font-weight: 700; color: var(--pv-text); display: block; margin-bottom: 3px; }
.pv-color-hex  { font-family: monospace; font-size: 0.7rem; color: var(--pv-gold); display: block; margin-bottom: 6px; }
.pv-color-desc { font-size: 0.66rem; color: var(--pv-text-dim); line-height: 1.55; }

/* ══ VARIANTS ══ */
.pv-variants-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}
.pv-variant-card { display: flex; flex-direction: column; gap: 10px; }
.pv-variant-preview {
  border-radius: 16px; overflow: hidden; height: 160px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--pv-border);
  transition: transform 0.3s;
}
.pv-variant-card:hover .pv-variant-preview { transform: scale(1.02); }
.pv-variant-svg { width: 80%; height: auto; }
.pv-variant-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em; text-align: center; }

/* ══ MOCKUP TABS ══ */
.pv-mock-tabs {
  display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;
}
.pv-mock-tab {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px;
  background: var(--pv-glass); border: 1px solid var(--pv-border);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em;
  color: var(--pv-text-dim); transition: all 0.22s;
}
.pv-mock-tab:hover { color: var(--pv-text); border-color: rgba(255,255,255,0.15); }
.pv-mock-tab.active {
  background: rgba(212,160,23,0.12);
  border-color: rgba(212,160,23,0.4);
  color: var(--pv-gold);
}

.pv-mock-display { border-radius: 20px; overflow: hidden; border: 1px solid var(--pv-border); }
.pv-mock-canvas {
  min-height: 320px; display: flex;
  align-items: center; justify-content: center;
  padding: 40px; position: relative;
  transition: background 0.4s;
}
.pv-mock-label-badge {
  position: absolute; top: 16px; left: 16px;
  display: inline-flex; align-items: center; gap: 7px;
  padding: 6px 14px;
  background: rgba(0,0,0,0.45); border-radius: 99px;
  font-size: 0.62rem; font-weight: 700;
  letter-spacing: 0.1em; color: rgba(255,255,255,0.8);
  backdrop-filter: blur(8px);
}
.pv-mock-note {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 14px 20px;
  background: rgba(255,255,255,0.03);
  border-top: 1px solid var(--pv-border);
  font-size: 0.7rem; color: var(--pv-text-dim); line-height: 1.6;
}
.pv-mock-note i { color: var(--pv-gold); flex-shrink: 0; margin-top: 1px; }
.pv-mock-note code {
  font-family: monospace; font-size: 0.72rem;
  background: rgba(212,160,23,0.1); color: var(--pv-gold);
  padding: 1px 6px; border-radius: 4px;
}

/* ══ SPECS ══ */
.pv-spec-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}
.pv-spec-card {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 20px 22px;
  background: var(--pv-glass); border: 1px solid var(--pv-border);
  border-radius: 16px; transition: all 0.3s;
}
.pv-spec-card:hover { border-color: rgba(212,160,23,0.2); }
.pv-spec-icon { font-size: 1.2rem; color: var(--pv-gold); flex-shrink: 0; margin-top: 3px; }
.pv-spec-title { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--pv-text-dim); margin-bottom: 4px; }
.pv-spec-val   { font-size: 0.88rem; font-weight: 700; color: var(--pv-text); margin-bottom: 2px; }
.pv-spec-sub   { font-size: 0.68rem; color: var(--pv-text-dim); }

/* ══ PRIZE ══ */
.pv-prize-row { display: grid; grid-template-columns: auto 1fr; gap: 32px; align-items: start; }
.pv-prize-main {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 36px 48px;
  background: linear-gradient(135deg, rgba(212,160,23,0.12) 0%, rgba(212,160,23,0.04) 100%);
  border: 1px solid rgba(212,160,23,0.35);
  border-radius: 24px;
  position: relative; overflow: hidden;
  min-width: 240px;
}
.pv-prize-main::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at top, rgba(212,160,23,0.15) 0%, transparent 70%);
}
.pv-prize-crown { font-size: 2.8rem; margin-bottom: 8px; }
.pv-prize-type { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--pv-gold); }
.pv-prize-amount {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.4rem; font-weight: 700; color: var(--pv-text);
  line-height: 1; position: relative; z-index: 1;
}
.pv-prize-note { font-size: 0.68rem; color: var(--pv-text-dim); }

.pv-prize-others { display: flex; flex-direction: column; gap: 16px; }
.pv-prize-card {
  display: flex; align-items: center; gap: 18px;
  padding: 20px 24px;
  background: var(--pv-glass); border: 1px solid var(--pv-border);
  border-radius: 16px; transition: all 0.3s;
}
.pv-prize-card:hover { border-color: rgba(212,160,23,0.2); }
.pv-prize-card-icon { font-size: 1.4rem; color: var(--pv-gold); flex-shrink: 0; }
.pv-prize-card-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.06em;
  color: var(--pv-text-dim); margin-bottom: 2px; }
.pv-prize-card-val { font-size: 1.1rem; font-weight: 700; color: var(--pv-text); }
.pv-prize-card-count { font-size: 0.62rem; color: var(--pv-gold); margin-top: 2px; }

/* ══ CRITERIA ══ */
.pv-criteria-list { display: flex; flex-direction: column; gap: 2px; }
.pv-criteria-item {
  display: flex; align-items: center; gap: 20px;
  padding: 18px 24px;
  border-radius: 12px; position: relative;
  border: 1px solid transparent;
  transition: all 0.3s;
}
.pv-criteria-item:hover {
  background: var(--pv-glass);
  border-color: var(--pv-border);
}
.pv-criteria-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem; font-weight: 700;
  color: var(--pv-gold); opacity: 0.5; flex-shrink: 0; width: 36px;
}
.pv-criteria-bar {
  height: 2px; background: linear-gradient(to right, rgba(212,160,23,0.5), transparent);
  border-radius: 99px; flex-shrink: 0;
  max-width: 120px;
}
.pv-criteria-text { flex: 1; }
.pv-criteria-title { font-size: 0.88rem; font-weight: 700; color: var(--pv-text); margin-bottom: 3px; }
.pv-criteria-desc  { font-size: 0.72rem; color: var(--pv-text-dim); }

/* ══ CTA SECTION ══ */
.pv-cta-section {
  position: relative; z-index: 1;
  padding: 120px 0;
  text-align: center;
  overflow: hidden;
  border-top: 1px solid var(--pv-border);
}
.pv-cta-inner { max-width: 700px; margin: 0 auto; padding: 0 40px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
.pv-cta-orb {
  position: absolute; inset: 0; z-index: -1;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,160,23,0.1) 0%, transparent 65%);
  pointer-events: none;
}
.pv-cta-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 7vw, 5.5rem);
  font-weight: 300; line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--pv-text); margin: 0;
}
.pv-cta-title em { font-style: italic; color: var(--pv-gold); }
.pv-cta-sub { font-size: 0.92rem; color: var(--pv-text-dim); line-height: 1.7; max-width: 480px; }

.pv-cta-btn-primary {
  display: inline-flex; align-items: center; gap: 16px;
  padding: 18px 32px;
  background: linear-gradient(135deg, rgba(212,160,23,0.2) 0%, rgba(192,57,43,0.12) 100%);
  border: 1px solid rgba(212,160,23,0.5);
  border-radius: 16px; text-decoration: none;
  transition: all 0.3s;
}
.pv-cta-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 50px rgba(212,160,23,0.2); }
.pv-cta-btn-primary > i:first-child { font-size: 1.6rem; color: var(--pv-gold); }
.pv-cta-btn-primary span { display: flex; flex-direction: column; gap: 2px; text-align: left; }
.pv-cta-btn-primary span strong { font-size: 0.9rem; font-weight: 700; color: var(--pv-text); }
.pv-cta-btn-primary span em { font-size: 0.68rem; color: var(--pv-text-dim); font-style: normal; }
.pv-cta-btn-primary > i:last-child { font-size: 0.8rem; color: var(--pv-gold); opacity: 0.7; }

.pv-cta-files { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 8px; }
.pv-file-chip {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px;
  background: var(--pv-glass); border: 1px solid var(--pv-border);
  border-radius: 99px;
}
.pv-file-chip i { color: var(--pv-gold); font-size: 0.8rem; }
.pv-file-name { font-family: monospace; font-size: 0.68rem; color: var(--pv-text); }
.pv-file-size { font-size: 0.6rem; color: var(--pv-text-dim); padding-left: 4px; border-left: 1px solid var(--pv-border); }

/* ══ FOOTER ══ */
.pv-footer {
  position: relative; z-index: 1;
  border-top: 1px solid var(--pv-border);
  padding: 40px 80px;
}
.pv-footer-inner {
  max-width: 1100px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 24px;
}
.pv-footer-brand { display: flex; flex-direction: column; gap: 4px; }
.pv-footer-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem; font-weight: 700; color: var(--pv-text);
}
.pv-footer-logo span { color: var(--pv-accent); }
.pv-footer-brand p { font-size: 0.72rem; color: var(--pv-text-dim); }
.pv-footer-meta { display: flex; flex-direction: column; gap: 3px; text-align: center; }
.pv-footer-meta p { font-size: 0.7rem; color: var(--pv-text-dim); }
.pv-footer-meta strong { color: var(--pv-text); }
.pv-footer-tags { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; }

/* ══ RESPONSIVE ══ */
@media (max-width: 960px) {
  .pv-hero { grid-template-columns: 1fr; padding: 100px 40px 60px; gap: 48px; }
  .pv-hero-logo { order: -1; }
  .pv-logo-frame { width: 280px; height: 280px; }
  .pv-ring1 { width: 260px; height: 260px; }
  .pv-ring2 { width: 210px; height: 210px; }
  .pv-logo-placeholder { width: 200px; height: 200px; }
  .pv-section-inner { padding: 0 40px; }
  .pv-color-grid { grid-template-columns: repeat(3, 1fr); }
  .pv-variants-grid { grid-template-columns: repeat(2, 1fr); }
  .pv-prize-row { grid-template-columns: 1fr; }
  .pv-footer { padding: 40px; }
  .pv-footer-inner { flex-direction: column; align-items: flex-start; }
  .pv-footer-tags { justify-content: flex-start; }
}
@media (max-width: 640px) {
  .pv-hero { padding: 90px 24px 60px; }
  .pv-section-inner { padding: 0 24px; }
  .pv-hero-title span { font-size: 3rem; }
  .pv-philosophy-grid { grid-template-columns: 1fr; }
  .pv-color-grid { grid-template-columns: repeat(2, 1fr); }
  .pv-variants-grid { grid-template-columns: 1fr; }
  .pv-spec-grid { grid-template-columns: 1fr; }
  .pv-stat-item { padding: 20px; min-width: 100px; }
  .pv-prize-main { padding: 28px 32px; min-width: unset; width: 100%; }
  .pv-footer { padding: 32px 24px; }
}
`;