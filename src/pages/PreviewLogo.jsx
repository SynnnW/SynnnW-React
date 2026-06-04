import { useState, useEffect, useRef } from 'react';

/* ══════════════════════════════════════════════════════════════
   GANTI NILAI INI SESUAI KARYA KAMU
══════════════════════════════════════════════════════════════ */
const CONFIG = {
  logoName:        'HARJAKASI 208',
  tagline:         'Agustus Main ke Situbondo',
  authorName:      '',                          // ← dikosongkan
  authorDistrict:  'Kec. Situbondo',
  instagramHandle: '',                          // ← dikosongkan
  driveLink:       'https://drive.google.com/your-link-here',

  colors: [
    { name: 'Merah Berani',  hex: '#C0392B', desc: 'Semangat perjuangan dan keberanian rakyat Situbondo' },
    { name: 'Emas Kejayaan', hex: '#D4A017', desc: 'Kemakmuran dan keagungan budaya lokal' },
    { name: 'Biru Samudra',  hex: '#1A4E8A', desc: 'Pesisir Situbondo, laut dan cakrawala masa depan' },
    { name: 'Hijau Lestari', hex: '#2E7D32', desc: 'Alam dan kearifan lokal yang terjaga' },
    { name: 'Krem Linen',    hex: '#F5F0E8', desc: 'Latar bersih, keterbacaan maksimal di semua media' },
  ],

  philosophy: [
    { icon: '🏛️', title: 'Identitas Lokal',    body: 'Elemen visual terinspirasi dari Pantai Pasir Putih, Candi Gapura Wringinanom, dan motif batik khas Situbondo — menyatu dalam satu simbol yang kuat.' },
    { icon: '🔢', title: 'Angka 208',           body: 'Tiga digit angka dirancang membentuk komposisi dinamis yang merepresentasikan keberlanjutan sejarah 208 tahun Kabupaten Situbondo yang terus berkembang.' },
    { icon: '✨', title: 'Semangat Kemajuan',   body: 'Garis-garis geometris yang memancar ke atas melambangkan masyarakat Situbondo yang progresif, kreatif, dan siap naik kelas menuju masa depan lebih cerah.' },
    { icon: '🤝', title: 'Kebersamaan',         body: 'Bentuk yang memeluk dari kiri dan kanan mencerminkan kebersamaan lintas suku, agama, dan budaya yang menjadi kekuatan utama kabupaten ini.' },
  ],

  mockups: [
    { label: 'Spanduk & Baliho',   icon: 'fa-rectangle-ad',  bg: '#1a1a2e' },
    { label: 'Media Sosial',        icon: 'fa-square',         bg: '#0f3460' },
    { label: 'Kaos / Merchandise',  icon: 'fa-shirt',          bg: '#533483' },
    { label: 'Kop Surat Resmi',     icon: 'fa-file-lines',     bg: '#F5F0E8' },
    { label: 'Stiker & Pin',        icon: 'fa-certificate',    bg: '#2E7D32' },
    { label: 'Layar Digital',       icon: 'fa-display',        bg: '#C0392B' },
  ],

  process: [
    { num: '01', title: 'Riset & Konsep Awal',                desc: 'Mempelajari sejarah dan identitas Kabupaten Situbondo selama 208 tahun — Pantai Pasir Putih, Candi Gapura Wringinanom, motif batik lokal. Menentukan arah visual, makna simbol, dan palet warna sebelum membuka Adobe Illustrator.', dur: '1–2 hari' },
    { num: '02', title: 'Sketsa & Eksplorasi Bentuk',         desc: 'Membuat sketsa manual puluhan konsep sebelum dipilih satu arah terkuat. Eksplorasi bagaimana angka "208" bisa membentuk komposisi dinamis sekaligus bermakna — tanpa kehilangan keterbacaan.', dur: '2–3 hari' },
    { num: '03', title: 'Digitalisasi di Adobe Illustrator',  desc: 'Membangun logo secara vektor penuh di Adobe Illustrator — grid presisi, anchor point bersih, komposisi tipografi, dan eksplorasi palet warna yang tepat sesuai identitas Situbondo. File AI master siap export ke semua format.', dur: '3–4 hari' },
    { num: '04', title: 'Variasi & Uji Adaptif',              desc: 'Menguji logo di berbagai latar belakang (gelap, terang, berwarna) dan berbagai media — spanduk, media sosial, kaos, stiker, kop surat, layar digital. Memastikan keterbacaan dan daya visual tetap kuat di semua situasi.', dur: '1–2 hari', last: true },
  ],

  specs: [
    { icon: 'fa-expand-arrows-alt',   title: 'Resolusi',      val: '3000 × 3000 px',      sub: 'Minimal 300 dpi' },
    { icon: 'fa-file-image',          title: 'Format Kirim',  val: 'JPG / PNG',            sub: 'Resolusi tinggi' },
    { icon: 'fa-file-code',           title: 'File Master',   val: 'AI · EPS · SVG · PDF', sub: 'Wajib bila menang' },
    { icon: 'fa-ban',                 title: 'Larangan',      val: 'No Watermark',         sub: 'No AI generatif' },
    { icon: 'fa-crop-simple',         title: 'Rasio Unggah',  val: '1:1 atau 4:5',         sub: 'Disarankan Instagram' },
    { icon: 'fa-wand-magic-sparkles', title: 'Dibuat Dengan', val: 'Adobe Illustrator',    sub: 'Karya manual 100%' },
  ],
};

/* ══════════════════════════════════════════════════════════════
   REVEAL HOOK
══════════════════════════════════════════════════════════════ */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const els = container.querySelectorAll('.pl-reveal');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('pl-visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ══════════════════════════════════════════════════════════════
   STEMPEL COMPONENT
══════════════════════════════════════════════════════════════ */
function Stempel() {
  return (
    <div style={{
      position: 'absolute', top: -22, right: -22, zIndex: 10,
      transform: 'rotate(18deg)', pointerEvents: 'none', filter: 'drop-shadow(0 2px 8px rgba(192,57,43,0.3))',
    }}>
      <svg viewBox="0 0 200 200" width="138" height="138" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="pl-stamp-arc-top"
            d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
        </defs>
        {/* Texture ring outer */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="#C0392B" strokeWidth="1.5" opacity="0.3" strokeDasharray="3 5"/>
        {/* Main ring */}
        <circle cx="100" cy="100" r="88" fill="none" stroke="#C0392B" strokeWidth="2.8" opacity="0.9"/>
        {/* Inner ring */}
        <circle cx="100" cy="100" r="79" fill="none" stroke="#C0392B" strokeWidth="0.8" opacity="0.45"/>
        {/* Arc text */}
        <text fontFamily="'Outfit',sans-serif" fontSize="9" fontWeight="800"
          letterSpacing="2.5" fill="#C0392B" opacity="0.92">
          <textPath href="#pl-stamp-arc-top" startOffset="2%">
            · DALAM PENGERJAAN · HARJAKASI 208 ·
          </textPath>
        </text>
        {/* Center content */}
        <text x="100" y="90" textAnchor="middle"
          fontFamily="'Cormorant Garamond',serif" fontSize="13" fontWeight="700"
          fill="#C0392B" opacity="0.9" letterSpacing="1">SEGERA</text>
        <line x1="68" y1="98" x2="132" y2="98" stroke="#C0392B" strokeWidth="1" opacity="0.35"/>
        <text x="100" y="115" textAnchor="middle"
          fontFamily="'Cormorant Garamond',serif" fontSize="13" fontWeight="700"
          fill="#C0392B" opacity="0.9" letterSpacing="1">HADIR</text>
        {/* 5-point star dots */}
        {[0, 72, 144, 216, 288].map((a, i) => {
          const rad = (a - 90) * Math.PI / 180;
          return <circle key={i} cx={100 + 68 * Math.cos(rad)} cy={100 + 68 * Math.sin(rad)} r="2.8" fill="#C0392B" opacity="0.55"/>;
        })}
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LOGO SVG PLACEHOLDER
══════════════════════════════════════════════════════════════ */
function LogoSVG({ size = 230 }) {
  return (
    <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
      <defs>
        <radialGradient id="plRg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#D4A017" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#C0392B" stopOpacity="0.7"/>
        </radialGradient>
        <radialGradient id="plRg2" cx="30%" cy="70%" r="60%">
          <stop offset="0%"   stopColor="#1A4E8A" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.4"/>
        </radialGradient>
      </defs>
      <circle cx="150" cy="150" r="138" fill="none" stroke="url(#plRg1)" strokeWidth="2.5" opacity="0.6"/>
      <polygon points="150,40 220,100 200,185 150,215 100,185 80,100"
        fill="none" stroke="#D4A017" strokeWidth="2" opacity="0.8"/>
      <text x="150" y="148" textAnchor="middle"
        fontFamily="'Cormorant Garamond',serif" fontSize="62" fontWeight="700"
        fill="url(#plRg1)" letterSpacing="-2">208</text>
      <text x="150" y="182" textAnchor="middle"
        fontFamily="'Outfit',sans-serif" fontSize="13" fontWeight="700"
        fill="#D4A017" letterSpacing="6" opacity="0.85">HARJAKASI</text>
      <text x="150" y="200" textAnchor="middle"
        fontFamily="'Outfit',sans-serif" fontSize="7.5" fontWeight="400"
        fill="#aaa" letterSpacing="3">KABUPATEN SITUBONDO</text>
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const rad = (a - 90) * Math.PI / 180;
        return <circle key={i} cx={150 + 125 * Math.cos(rad)} cy={150 + 125 * Math.sin(rad)} r="3" fill="#D4A017" opacity="0.6"/>;
      })}
      <text x="150" y="243" textAnchor="middle"
        fontFamily="'Outfit',sans-serif" fontSize="6" fill="#666" letterSpacing="2">
        ↑ Ganti dengan foto logo kamu
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   PROSES ACCORDION ITEM
══════════════════════════════════════════════════════════════ */
function ProcessItem({ item, delay = 0 }) {
  const [open, setOpen] = useState(false);
  const cls = `pl-reveal${delay ? ` pl-d${Math.min(delay, 3)}` : ''}`;
  return (
    <div className={cls} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '36px', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px' }}>
        <span style={{
          fontFamily: "'Cormorant Garamond',serif", fontSize: '2.6rem', fontWeight: 300,
          lineHeight: 1, marginBottom: '16px', alignSelf: 'center',
          color: open ? '#D4A017' : '#64605a', transition: 'color 0.3s',
        }}>{item.num}</span>
        {!item.last && (
          <div style={{ width: '1px', flex: 1, minHeight: '40px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.07), transparent)', margin: '0 auto' }}/>
        )}
      </div>
      <div style={{ padding: '4px 0 44px' }}>
        <button
          onClick={() => setOpen(p => !p)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left', fontFamily: "'Outfit',sans-serif" }}
        >
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', fontWeight: 600 }}>{item.title}</span>
          <span style={{ color: '#D4A017', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s', flexShrink: 0, marginLeft: '12px' }}>
            <i className="fa-solid fa-chevron-down"/>
          </span>
        </button>
        <div style={{ overflow: 'hidden', maxHeight: open ? '300px' : '0', opacity: open ? 1 : 0, transition: 'max-height 0.38s ease, opacity 0.35s ease' }}>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.88, color: '#64605a', maxWidth: '520px', margin: '16px 0 0' }}>{item.desc}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.64rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4A017', marginTop: '12px' }}>
            <i className="fa-regular fa-clock"/> {item.dur}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MOCKUP PREVIEW
══════════════════════════════════════════════════════════════ */
function MockupPreview({ index, bg }) {
  const isLight = ['#f5f0e8', '#ffffff'].includes(bg.toLowerCase());
  const tc = isLight ? '#1a1916' : '#ffffff';

  const items = [
    /* 0 Spanduk & Baliho */
    <svg key={0} viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 560 }}>
      <rect x="10" y="10" width="580" height="180" rx="6" fill="none" stroke={tc} strokeWidth="1.5" opacity="0.3"/>
      <text x="300" y="72" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="22" fill={tc} opacity="0.5" letterSpacing="8">SELAMAT</text>
      <text x="300" y="110" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="38" fontWeight="700" fill="#D4A017" letterSpacing="-1">HARI JADI KE-208</text>
      <text x="300" y="138" textAnchor="middle" fontFamily="'Outfit',sans-serif" fontSize="14" fill={tc} opacity="0.6" letterSpacing="6">KABUPATEN SITUBONDO</text>
      <circle cx="78" cy="100" r="44" fill="none" stroke="#D4A017" strokeWidth="1.5" opacity="0.7"/>
      <text x="78" y="107" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="22" fontWeight="700" fill="#D4A017">208</text>
      <circle cx="522" cy="100" r="44" fill="none" stroke="#D4A017" strokeWidth="1.5" opacity="0.7"/>
      <text x="522" y="107" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="22" fontWeight="700" fill="#D4A017">208</text>
    </svg>,

    /* 1 Media Sosial */
    <svg key={1} viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style={{ width: 260, height: 260 }}>
      <rect x="0" y="0" width="300" height="300" rx="20" fill={bg} opacity="0.4"/>
      <circle cx="150" cy="128" r="80" fill="none" stroke="#D4A017" strokeWidth="1.5" opacity="0.6"/>
      <text x="150" y="136" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="52" fontWeight="700" fill={tc}>208</text>
      <text x="150" y="162" textAnchor="middle" fontFamily="'Outfit',sans-serif" fontSize="9" fontWeight="700" fill="#D4A017" letterSpacing="5">HARJAKASI</text>
      <text x="150" y="240" textAnchor="middle" fontFamily="'Outfit',sans-serif" fontSize="8" fill={tc} opacity="0.5" letterSpacing="3">#AgustusMainKeSitubondo</text>
    </svg>,

    /* 2 Kaos */
    <svg key={2} viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" style={{ width: 260, height: 280 }}>
      <path d="M90,30 L60,80 L100,90 L100,280 L200,280 L200,90 L240,80 L210,30 L175,50 Q150,30 125,50 Z" fill="none" stroke={tc} strokeWidth="2" opacity="0.4"/>
      <circle cx="150" cy="170" r="52" fill="none" stroke="#D4A017" strokeWidth="1.5" opacity="0.8"/>
      <text x="150" y="178" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="34" fontWeight="700" fill={tc}>208</text>
      <text x="150" y="199" textAnchor="middle" fontFamily="'Outfit',sans-serif" fontSize="7" fontWeight="700" fill="#D4A017" letterSpacing="4">HARJAKASI</text>
    </svg>,

    /* 3 Kop Surat */
    <svg key={3} viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 400 }}>
      <rect x="10" y="10" width="380" height="260" rx="4" fill={isLight ? '#fff' : '#f5f0e8'} opacity="0.08"/>
      <line x1="10" y1="68" x2="390" y2="68" stroke="#D4A017" strokeWidth="2"/>
      <circle cx="50" cy="38" r="24" fill="none" stroke="#D4A017" strokeWidth="1.5"/>
      <text x="50" y="44" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="16" fontWeight="700" fill={isLight ? '#1a1916' : tc}>208</text>
      <text x="125" y="33" fontFamily="'Cormorant Garamond',serif" fontSize="12" fontWeight="700" fill={isLight ? '#1a1916' : tc}>PEMERINTAH KABUPATEN SITUBONDO</text>
      <text x="125" y="50" fontFamily="'Outfit',sans-serif" fontSize="8" fill={isLight ? '#555' : tc} opacity="0.6">HARJAKASI KE-208 · 2026</text>
      {[90, 108, 126, 144, 162, 180].map((y, i) => (
        <rect key={i} x="28" y={y} width={280 - i * 20} height="5" rx="2" fill={isLight ? '#555' : tc} opacity="0.15"/>
      ))}
    </svg>,

    /* 4 Stiker & Pin */
    <svg key={4} viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style={{ width: 240, height: 240 }}>
      <circle cx="150" cy="150" r="130" fill="none" stroke={tc} strokeWidth="2" opacity="0.3" strokeDasharray="8 4"/>
      <circle cx="150" cy="150" r="110" fill={bg} stroke="#D4A017" strokeWidth="2.5" opacity="0.9"/>
      <text x="150" y="145" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="58" fontWeight="700" fill={tc}>208</text>
      <text x="150" y="172" textAnchor="middle" fontFamily="'Outfit',sans-serif" fontSize="10" fontWeight="800" fill="#D4A017" letterSpacing="6">HARJAKASI</text>
      <text x="150" y="190" textAnchor="middle" fontFamily="'Outfit',sans-serif" fontSize="7" fill={tc} opacity="0.5" letterSpacing="3">SITUBONDO · 2026</text>
    </svg>,

    /* 5 Layar Digital */
    <svg key={5} viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 460 }}>
      <rect x="10" y="10" width="480" height="280" rx="12" fill="none" stroke={tc} strokeWidth="2" opacity="0.25"/>
      <rect x="10" y="10" width="480" height="28" rx="12" fill={tc} opacity="0.08"/>
      <circle cx="28" cy="24" r="5" fill="#ff5f57" opacity="0.8"/>
      <circle cx="44" cy="24" r="5" fill="#febc2e" opacity="0.8"/>
      <circle cx="60" cy="24" r="5" fill="#28c840" opacity="0.8"/>
      <text x="250" y="160" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="60" fontWeight="700" fill={tc} opacity="0.9">208</text>
      <text x="250" y="192" textAnchor="middle" fontFamily="'Outfit',sans-serif" fontSize="11" fontWeight="700" fill="#D4A017" letterSpacing="8">HARJAKASI</text>
      <text x="250" y="213" textAnchor="middle" fontFamily="'Outfit',sans-serif" fontSize="7" fill={tc} opacity="0.4" letterSpacing="4">KABUPATEN SITUBONDO</text>
    </svg>,
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      {items[index] || items[0]}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function PreviewLogo() {
  const pageRef    = useReveal();
  const [copied, setCopied]       = useState(null);
  const [activeMock, setActiveMock] = useState(0);

  const copyColor = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="pl-page" ref={pageRef}>

        {/* ════════════ HERO ════════════ */}
        <section className="pl-hero">
          <div className="pl-hero-content">
            <div className="pl-reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <span className="pl-badge"><i className="fa-solid fa-trophy"/> LOMBA LOGO HARJAKASI KE-208</span>
              <span className="pl-badge pl-badge-gold"><i className="fa-solid fa-calendar"/> 22 Mei – 22 Juni 2026</span>
            </div>

            <h1 className="pl-reveal pl-d1 pl-hero-title">
              <em>{CONFIG.tagline}</em>
              <span>{CONFIG.logoName}</span>
            </h1>

            <p className="pl-reveal pl-d2 pl-hero-sub">
              {CONFIG.authorDistrict} — Dokumentasi brand resmi untuk keperluan penilaian dan publikasi.
              <br/>Logo masih dalam pengerjaan, web ini dibangun lebih awal sebagai ruang presentasi.
            </p>

            <div className="pl-reveal pl-d3" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['#LombaLogoHarjakasi208', '#SitubondoNaikKelas', '#AgustusMainKeSitubondo'].map(h => (
                <span key={h} className="pl-hashtag">{h}</span>
              ))}
            </div>
          </div>

          {/* Logo visual */}
          <div className="pl-reveal pl-d1 pl-hero-visual">
            <div className="pl-logo-frame">
              <div className="pl-ring1"/>
              <div className="pl-ring2"/>
              <div className="pl-logo-circle">
                <LogoSVG size={230}/>
                <Stempel/>
              </div>
            </div>
          </div>

          <div className="pl-scroll-hint">
            <span>Scroll down</span>
            <i className="fa-solid fa-arrow-down" style={{ animation: 'plBounce 1.6s ease-in-out infinite' }}/>
          </div>
        </section>

        {/* ════════════ STATS BAR ════════════ */}
        <div className="pl-reveal pl-stats-bar">
          {[
            { num: '208',  label: 'Tahun Sejarah',     icon: 'fa-landmark' },
            { num: '5',    label: 'Warna Identitas',   icon: 'fa-palette' },
            { num: '4',    label: 'Elemen Filosofi',   icon: 'fa-layer-group' },
            { num: '6',    label: 'Variasi Mockup',    icon: 'fa-images' },
            { num: 'AI',   label: 'Adobe Illustrator', icon: 'fa-vector-square' },
          ].map((s, i, arr) => (
            <div key={i} className="pl-stat-item" style={{ borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <i className={`fa-solid ${s.icon} pl-stat-icon`}/>
              <span className="pl-stat-num">{s.num}</span>
              <span className="pl-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ════════════ 01 / OVERVIEW ════════════ */}
        <section className="pl-section">
          <div className="pl-section-inner">
            <div className="pl-overview-grid">
              <div className="pl-reveal">
                <span className="pl-eyebrow">01 / Tentang Karya</span>
                <h2 className="pl-h2">
                  Sebuah Logo<br/><em>yang Bermakna.</em>
                </h2>
              </div>
              <div className="pl-reveal pl-d1 pl-overview-body">
                <p>Logo Harjakasi ke-208 ini dirancang sebagai simbol identitas yang merayakan 208 tahun perjalanan Kabupaten Situbondo — bukan sekadar estetika, melainkan cermin dari nilai, sejarah, dan semangat yang hidup di tengah masyarakatnya.</p>
                <p>Dibuat sepenuhnya secara manual di Adobe Illustrator — setiap titik, garis, dan warna dipilih dengan pertimbangan mendalam. Web ini hadir lebih awal sebagai ruang presentasi, sementara logo terus disempurnakan.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════ 02 / FILOSOFI ════════════ */}
        <section className="pl-section pl-section-alt">
          <div className="pl-section-inner">
            <span className="pl-reveal pl-eyebrow">02 / Filosofi &amp; Konsep</span>
            <h2 className="pl-reveal pl-d1 pl-h2" style={{ marginBottom: '60px' }}>
              Makna di Balik<br/><em>Setiap Garis.</em>
            </h2>
            <div className="pl-phil-grid">
              {CONFIG.philosophy.map((p, i) => (
                <div key={i} className={`pl-reveal${i % 2 ? ' pl-d1' : ''} pl-feat-card`}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '14px' }}>{p.icon}</span>
                  <h3 className="pl-card-title">{p.title}</h3>
                  <p className="pl-card-body">{p.body}</p>
                  <div className="pl-card-num">{String(i + 1).padStart(2, '0')}</div>
                </div>
              ))}
            </div>
            {/* Quote */}
            <div className="pl-reveal pl-quote-block">
              <i className="fa-solid fa-quote-left pl-quote-icon"/>
              <blockquote>
                Logo ini lahir dari kecintaan terhadap Situbondo — bukan hanya sebagai simbol seremonial,
                melainkan sebagai cermin identitas kolektif 208 tahun perjalanan kabupaten yang kaya budaya,
                tangguh dalam sejarah, dan penuh optimisme menghadapi masa depan.
              </blockquote>
            </div>
          </div>
        </section>

        {/* ════════════ 03 / PALET WARNA ════════════ */}
        <section className="pl-section">
          <div className="pl-section-inner">
            <span className="pl-reveal pl-eyebrow">03 / Palet Warna</span>
            <h2 className="pl-reveal pl-d1 pl-h2" style={{ marginBottom: '60px' }}>
              Bahasa Warna<br/><em>yang Bermakna.</em>
            </h2>
            <div className="pl-color-grid">
              {CONFIG.colors.map((col, i) => (
                <div key={i} className="pl-reveal pl-color-card"
                  onClick={() => copyColor(col.hex)} title="Klik untuk salin kode warna">
                  <div className="pl-color-swatch" style={{ background: col.hex }}>
                    <span className="pl-copy-hint">
                      {copied === col.hex
                        ? <><i className="fa-solid fa-check"/> Tersalin!</>
                        : <><i className="fa-regular fa-copy"/> Salin</>}
                    </span>
                  </div>
                  <div className="pl-color-info">
                    <span className="pl-color-name">{col.name}</span>
                    <code className="pl-color-hex">{col.hex}</code>
                    <p className="pl-color-desc">{col.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ 04 / VARIASI LOGO ════════════ */}
        <section className="pl-section pl-section-alt">
          <div className="pl-section-inner">
            <span className="pl-reveal pl-eyebrow">04 / Variasi Logo</span>
            <h2 className="pl-reveal pl-d1 pl-h2">
              Adaptif di Semua<br/><em>Situasi.</em>
            </h2>
            <p className="pl-reveal pl-d2 pl-section-sub">
              Logo dirancang agar tetap kuat dan terbaca di berbagai latar belakang — gelap, terang, berwarna, maupun monokrom.
            </p>
            <div className="pl-variant-grid">
              {[
                { bg: '#0a0a0f', label: 'Latar Gelap',  txt: '#fff'    },
                { bg: '#F5F0E8', label: 'Latar Terang', txt: '#1a1916' },
                { bg: '#1A4E8A', label: 'Latar Biru',   txt: '#fff'    },
                { bg: '#C0392B', label: 'Latar Merah',  txt: '#fff'    },
                { bg: '#D4A017', label: 'Latar Emas',   txt: '#1a1916' },
                { bg: '#2E7D32', label: 'Latar Hijau',  txt: '#fff'    },
              ].map((v, i) => (
                <div key={i} className="pl-reveal pl-variant-card">
                  <div className="pl-variant-preview" style={{ background: v.bg }}>
                    <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '80%', height: 'auto' }}>
                      <circle cx="80" cy="50" r="44" fill="none" stroke={v.txt} strokeWidth="1" opacity="0.4"/>
                      <text x="80" y="56" textAnchor="middle"
                        fontFamily="'Cormorant Garamond',serif" fontSize="28" fontWeight="700"
                        fill={v.txt} opacity="0.9">208</text>
                      <text x="80" y="70" textAnchor="middle"
                        fontFamily="'Outfit',sans-serif" fontSize="5.5" fontWeight="700"
                        fill={v.txt} opacity="0.7" letterSpacing="3">HARJAKASI</text>
                    </svg>
                  </div>
                  <span className="pl-variant-label">{v.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ 05 / MOCKUP ════════════ */}
        <section className="pl-section">
          <div className="pl-section-inner">
            <span className="pl-reveal pl-eyebrow">05 / Mockup Aplikasi</span>
            <h2 className="pl-reveal pl-d1 pl-h2">
              Logo di Dunia<br/><em>Nyata.</em>
            </h2>
            <p className="pl-reveal pl-d2 pl-section-sub">
              Tampilan logo saat diaplikasikan pada berbagai media — cetak, digital, dan merchandise.
            </p>
            {/* Tabs */}
            <div className="pl-reveal pl-mock-tabs">
              {CONFIG.mockups.map((m, i) => (
                <button key={i} onClick={() => setActiveMock(i)}
                  className={`pl-mock-tab${activeMock === i ? ' active' : ''}`}>
                  <i className={`fa-solid ${m.icon}`}/>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
            {/* Canvas */}
            <div className="pl-reveal pl-mock-display">
              <div className="pl-mock-canvas" style={{ background: CONFIG.mockups[activeMock].bg }}>
                <MockupPreview index={activeMock} bg={CONFIG.mockups[activeMock].bg}/>
                <div className="pl-mock-label">
                  <i className={`fa-solid ${CONFIG.mockups[activeMock].icon}`}/>
                  {CONFIG.mockups[activeMock].label}
                </div>
              </div>
              <div className="pl-mock-note">
                <i className="fa-solid fa-circle-info" style={{ color: '#D4A017', flexShrink: 0, marginTop: '1px' }}/>
                <span>Mockup menggunakan placeholder SVG. Setelah logo selesai, ganti dengan{' '}
                  <code className="pl-inline-code">{'<img src={logoFile} />'}</code> agar tampil nyata.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════ 06 / PROSES ════════════ */}
        <section className="pl-section pl-section-alt">
          <div className="pl-section-inner">
            <span className="pl-reveal pl-eyebrow">06 / Proses Pengerjaan</span>
            <h2 className="pl-reveal pl-d1 pl-h2" style={{ marginBottom: '60px' }}>
              Development<br/><em>Process.</em>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {CONFIG.process.map((item, i) => (
                <ProcessItem key={item.num} item={item} delay={i}/>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ 07 / SPESIFIKASI ════════════ */}
        <section className="pl-section">
          <div className="pl-section-inner">
            <span className="pl-reveal pl-eyebrow">07 / Spesifikasi Teknis</span>
            <h2 className="pl-reveal pl-d1 pl-h2" style={{ marginBottom: '60px' }}>
              Standar File<br/><em>&amp; Format.</em>
            </h2>
            <div className="pl-spec-grid">
              {CONFIG.specs.map((s, i) => (
                <div key={i} className={`pl-reveal${i % 3 ? ` pl-d${i % 3}` : ''} pl-spec-card`}>
                  <i className={`fa-solid ${s.icon} pl-spec-icon`}/>
                  <div>
                    <p className="pl-spec-title">{s.title}</p>
                    <p className="pl-spec-val">{s.val}</p>
                    <p className="pl-spec-sub">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ CTA / DOWNLOAD ════════════ */}
        <section className="pl-section" style={{ paddingTop: 0 }}>
          <div className="pl-section-inner">
            <div className="pl-cta-box">
              <div className="pl-cta-glow"/>
              <div className="pl-cta-line"/>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D4A017', display: 'block', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                FILE RESMI KARYA
              </span>
              <h3 className="pl-reveal pl-cta-title">
                Unduh File<br/><em>Lengkap di Sini.</em>
              </h3>
              <p className="pl-reveal pl-d1 pl-cta-sub">
                Tersedia file Adobe Illustrator (.ai), PNG 300 dpi, dan PDF vektor. Semua format sesuai ketentuan teknis lomba.
              </p>
              <div className="pl-reveal pl-d2" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                <a href={CONFIG.driveLink} target="_blank" rel="noopener noreferrer" className="pl-cta-btn">
                  <i className="fa-brands fa-google-drive"/>
                  <span>Buka Google Drive</span>
                  <i className="fa-solid fa-arrow-up-right" style={{ fontSize: '0.8rem' }}/>
                </a>
              </div>
              <div className="pl-reveal pl-d3 pl-file-chips">
                {[
                  { icon: 'fa-file-code',  name: 'logo-harjakasi-208.ai',  size: 'Adobe Illustrator' },
                  { icon: 'fa-file-image', name: 'logo-harjakasi-208.png', size: 'PNG 3000×3000' },
                  { icon: 'fa-file-pdf',   name: 'logo-harjakasi-208.pdf', size: 'PDF Vektor' },
                  { icon: 'fa-file-code',  name: 'logo-harjakasi-208.svg', size: 'SVG Scalable' },
                ].map((f, i) => (
                  <div key={i} className="pl-file-chip">
                    <i className={`fa-solid ${f.icon}`}/>
                    <span className="pl-file-name">{f.name}</span>
                    <span className="pl-file-size">{f.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════ FOOTER ════════════ */}
        <footer className="pl-footer">
          <div className="pl-footer-inner">
            <div>
              <span className="pl-footer-logo">SynnnW<span>*</span></span>
              <p className="pl-footer-caption">Karya untuk Situbondo.</p>
            </div>
            <div className="pl-footer-meta">
              {CONFIG.authorName && <p>Desainer: <strong>{CONFIG.authorName}</strong></p>}
              <p>Lomba Logo HARJAKASI ke-208 · Kabupaten Situbondo · 2026</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end' }}>
              {['#LombaLogoHarjakasi208', '#SitubondoNaikKelas'].map(h => (
                <span key={h} className="pl-hashtag">{h}</span>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,700&family=Outfit:wght@300;400;500;600;700;800&display=swap');

/* ── base ── */
.pl-page {
  --pl-bg:       var(--bg,      #070709);
  --pl-bg2:      var(--bg2,     #0d0d10);
  --pl-bg3:      var(--bg3,     #141416);
  --pl-text:     var(--text,    #f0ede8);
  --pl-dim:      var(--text-dim,#64605a);
  --pl-gold:     #D4A017;
  --pl-red:      #C0392B;
  --pl-border:   var(--border,  rgba(255,255,255,0.07));
  --pl-glass:    var(--glass,   rgba(255,255,255,0.04));

  font-family: 'Outfit', sans-serif;
  background:  var(--pl-bg);
  color:       var(--pl-text);
  overflow-x:  hidden;
}

/* ── reveal ── */
.pl-reveal { opacity:0; transform:translateY(26px); transition:opacity 0.7s ease, transform 0.7s ease; }
.pl-reveal.pl-visible { opacity:1; transform:none; }
.pl-d1 { transition-delay:0.12s; }
.pl-d2 { transition-delay:0.22s; }
.pl-d3 { transition-delay:0.32s; }

/* ── keyframes ── */
@keyframes plSpin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes plBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }

/* ── rings ── */
.pl-ring1, .pl-ring2 {
  position:absolute; border-radius:50%;
  border:1px solid rgba(212,160,23,0.2);
  animation:plSpin 20s linear infinite;
}
.pl-ring1 { width:360px; height:360px; }
.pl-ring2 { width:300px; height:300px; animation-duration:15s; animation-direction:reverse; border-style:dashed; border-color:rgba(212,160,23,0.12); }

/* ── hero ── */
.pl-hero {
  position:relative; z-index:1; min-height:100vh;
  display:grid; grid-template-columns:1fr 1fr;
  align-items:center; gap:60px;
  padding:120px 80px 100px;
  max-width:1280px; margin:0 auto;
}
.pl-hero-content { display:flex; flex-direction:column; gap:24px; }
.pl-hero-visual  { display:flex; align-items:center; justify-content:center; }
.pl-hero-title {
  font-family:'Cormorant Garamond',serif;
  font-weight:300; line-height:1.02;
  letter-spacing:-0.02em; margin:0;
}
.pl-hero-title em {
  display:block; font-size:clamp(1.4rem,3vw,2.2rem);
  color:var(--pl-gold); font-style:italic; margin-bottom:4px;
}
.pl-hero-title span {
  display:block; font-size:clamp(3.5rem,8vw,7rem);
  font-weight:700; color:var(--pl-text);
}
.pl-hero-sub { font-size:0.92rem; color:var(--pl-dim); line-height:1.7; margin:0; }
.pl-scroll-hint {
  position:absolute; bottom:38px; right:80px;
  display:flex; align-items:center; gap:10px;
  font-size:0.58rem; font-weight:600; letter-spacing:0.22em; text-transform:uppercase; color:var(--pl-dim);
}

/* ── logo frame ── */
.pl-logo-frame {
  position:relative; width:380px; height:380px;
  display:flex; align-items:center; justify-content:center;
}
.pl-logo-circle {
  width:280px; height:280px; border-radius:50%;
  background:radial-gradient(circle at 35% 35%, rgba(212,160,23,0.15) 0%, rgba(26,78,138,0.1) 50%, transparent 70%);
  border:1px solid rgba(212,160,23,0.25);
  display:flex; align-items:center; justify-content:center;
  flex-direction:column; position:relative; overflow:visible;
}

/* ── badges ── */
.pl-badge {
  display:inline-flex; align-items:center; gap:7px; padding:6px 14px;
  background:var(--pl-glass); border:1px solid var(--pl-border);
  border-radius:99px; font-size:0.62rem; font-weight:700;
  letter-spacing:0.12em; text-transform:uppercase; color:var(--pl-dim);
}
.pl-badge-gold i { color:var(--pl-gold); }
.pl-hashtag {
  font-size:0.62rem; font-weight:700; letter-spacing:0.05em; color:var(--pl-gold);
  background:rgba(212,160,23,0.08); border:1px solid rgba(212,160,23,0.2);
  border-radius:99px; padding:4px 12px;
}

/* ── stats bar ── */
.pl-stats-bar {
  display:flex; flex-wrap:wrap; justify-content:center;
  border-top:1px solid var(--pl-border); border-bottom:1px solid var(--pl-border);
  background:rgba(255,255,255,0.02);
}
.pl-stat-item {
  display:flex; flex-direction:column; align-items:center; gap:6px;
  padding:32px 40px; flex:1; min-width:130px;
}
.pl-stat-icon  { font-size:1rem; color:var(--pl-gold); opacity:0.7; }
.pl-stat-num   { font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:700; color:var(--pl-text); }
.pl-stat-label { font-size:0.62rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--pl-dim); text-align:center; }

/* ── sections ── */
.pl-section { padding:100px 80px; border-top:1px solid var(--pl-border); }
.pl-section-alt { background:rgba(255,255,255,0.02); }
.pl-section-inner { max-width:1120px; margin:0 auto; }

/* ── eyebrow / headings ── */
.pl-eyebrow {
  display:block; font-size:0.62rem; font-weight:600; letter-spacing:0.32em;
  text-transform:uppercase; color:var(--pl-dim); margin-bottom:16px;
}
.pl-h2 {
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(2.6rem,5.5vw,5.5rem);
  font-weight:300; line-height:0.9; margin:0;
}
.pl-h2 em { font-style:italic; color:var(--pl-dim); }
.pl-section-sub { font-size:0.88rem; color:var(--pl-dim); line-height:1.75; max-width:520px; margin:16px 0 60px; }

/* ── overview ── */
.pl-overview-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:start; }
.pl-overview-body p { font-size:0.92rem; line-height:1.9; color:var(--pl-dim); margin:0 0 22px; }
.pl-overview-body p:last-child { margin-bottom:0; }

/* ── philosophy cards ── */
.pl-phil-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; margin-bottom:40px; }
.pl-feat-card {
  background:var(--pl-glass); border:1px solid var(--pl-border);
  border-radius:20px; padding:28px; position:relative; overflow:hidden; transition:all 0.3s;
}
.pl-feat-card:hover { border-color:rgba(212,160,23,0.25); transform:translateY(-3px); }
.pl-card-title { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:600; color:var(--pl-text); margin:0 0 10px; }
.pl-card-body  { font-size:0.82rem; color:var(--pl-dim); line-height:1.75; margin:0; }
.pl-card-num   { position:absolute; bottom:20px; right:24px; font-family:'Cormorant Garamond',serif; font-size:3.5rem; font-weight:700; color:var(--pl-gold); opacity:0.07; line-height:1; user-select:none; }

/* ── quote ── */
.pl-quote-block {
  background:linear-gradient(135deg, rgba(212,160,23,0.06), rgba(26,78,138,0.04));
  border:1px solid rgba(212,160,23,0.15); border-left:3px solid var(--pl-gold);
  border-radius:0 16px 16px 0; padding:28px 32px; margin-top:16px;
}
.pl-quote-icon { font-size:1.4rem; color:var(--pl-gold); opacity:0.35; display:block; margin-bottom:12px; }
.pl-quote-block blockquote {
  font-family:'Cormorant Garamond',serif; font-size:1.15rem; font-weight:300; font-style:italic;
  color:var(--pl-text); line-height:1.75; margin:0;
}

/* ── color grid ── */
.pl-color-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; }
.pl-color-card { cursor:pointer; border-radius:16px; overflow:hidden; border:1px solid var(--pl-border); transition:all 0.3s; }
.pl-color-card:hover { transform:translateY(-4px); border-color:rgba(255,255,255,0.15); }
.pl-color-card:hover .pl-copy-hint { opacity:1 !important; }
.pl-color-swatch { height:120px; position:relative; display:flex; align-items:flex-end; justify-content:flex-end; padding:10px; }
.pl-copy-hint {
  font-size:0.6rem; font-weight:700; letter-spacing:0.1em; color:rgba(255,255,255,0.9);
  background:rgba(0,0,0,0.38); border-radius:99px; padding:4px 10px;
  backdrop-filter:blur(6px); opacity:0; transition:opacity 0.2s;
  display:flex; align-items:center; gap:4px;
}
.pl-color-info { padding:14px 16px; background:var(--pl-glass); }
.pl-color-name { font-size:0.78rem; font-weight:700; color:var(--pl-text); display:block; margin-bottom:3px; }
.pl-color-hex  { font-family:monospace; font-size:0.7rem; color:var(--pl-gold); display:block; margin-bottom:6px; }
.pl-color-desc { font-size:0.66rem; color:var(--pl-dim); line-height:1.55; margin:0; }

/* ── variant grid ── */
.pl-variant-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:60px; }
.pl-variant-preview {
  border-radius:16px; overflow:hidden; height:160px;
  display:flex; align-items:center; justify-content:center;
  border:1px solid var(--pl-border); transition:transform 0.3s;
}
.pl-variant-card:hover .pl-variant-preview { transform:scale(1.02); }
.pl-variant-label { font-size:0.72rem; font-weight:600; letter-spacing:0.06em; text-align:center; color:var(--pl-dim); display:block; margin-top:10px; }

/* ── mockup tabs ── */
.pl-mock-tabs { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px; }
.pl-mock-tab {
  display:inline-flex; align-items:center; gap:8px; padding:10px 18px;
  background:var(--pl-glass); border:1px solid var(--pl-border);
  border-radius:99px; cursor:pointer; font-family:'Outfit',sans-serif;
  font-size:0.68rem; font-weight:700; letter-spacing:0.08em; color:var(--pl-dim); transition:all 0.22s;
}
.pl-mock-tab:hover { color:var(--pl-text); border-color:rgba(255,255,255,0.15); }
.pl-mock-tab.active { background:rgba(212,160,23,0.12); border-color:rgba(212,160,23,0.4); color:var(--pl-gold); }
.pl-mock-display { border-radius:20px; overflow:hidden; border:1px solid var(--pl-border); }
.pl-mock-canvas  { min-height:320px; display:flex; align-items:center; justify-content:center; padding:40px; position:relative; transition:background 0.4s; }
.pl-mock-label   { position:absolute; top:16px; left:16px; display:inline-flex; align-items:center; gap:7px; padding:6px 14px; background:rgba(0,0,0,0.45); border-radius:99px; font-size:0.62rem; font-weight:700; letter-spacing:0.1em; color:rgba(255,255,255,0.85); backdrop-filter:blur(8px); }
.pl-mock-note    { display:flex; align-items:flex-start; gap:10px; padding:14px 20px; background:rgba(255,255,255,0.02); border-top:1px solid var(--pl-border); font-size:0.7rem; color:var(--pl-dim); line-height:1.6; }
.pl-inline-code  { font-family:monospace; font-size:0.72rem; background:rgba(212,160,23,0.1); color:var(--pl-gold); padding:1px 6px; border-radius:4px; }

/* ── spec grid ── */
.pl-spec-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.pl-spec-card  { display:flex; align-items:flex-start; gap:16px; padding:20px 22px; background:var(--pl-glass); border:1px solid var(--pl-border); border-radius:16px; transition:all 0.3s; }
.pl-spec-card:hover { border-color:rgba(212,160,23,0.2); }
.pl-spec-icon  { font-size:1.2rem; color:var(--pl-gold); flex-shrink:0; margin-top:3px; }
.pl-spec-title { font-size:0.62rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--pl-dim); margin:0 0 4px; }
.pl-spec-val   { font-size:0.88rem; font-weight:700; color:var(--pl-text); margin:0 0 2px; }
.pl-spec-sub   { font-size:0.68rem; color:var(--pl-dim); margin:0; }

/* ── cta ── */
.pl-cta-box {
  background:var(--pl-glass); border:1px solid var(--pl-border);
  border-radius:28px; padding:70px 80px; position:relative; overflow:hidden; text-align:center;
}
.pl-cta-glow {
  position:absolute; top:-60px; left:50%; transform:translateX(-50%);
  width:400px; height:200px;
  background:radial-gradient(ellipse, rgba(212,160,23,0.18) 0%, transparent 70%);
  pointer-events:none;
}
.pl-cta-line {
  position:absolute; top:0; left:15%; right:15%; height:1px;
  background:linear-gradient(90deg, transparent, rgba(212,160,23,0.5), transparent);
}
.pl-cta-title {
  font-family:'Cormorant Garamond',serif; font-size:clamp(2.2rem,5vw,4.5rem);
  font-weight:300; line-height:1.05; margin:0 0 18px; color:var(--pl-text);
  position:relative; z-index:1;
}
.pl-cta-title em { font-style:italic; color:var(--pl-dim); }
.pl-cta-sub { font-size:0.88rem; color:var(--pl-dim); max-width:420px; margin:0 auto 36px; line-height:1.78; position:relative; z-index:1; }
.pl-cta-btn {
  display:inline-flex; align-items:center; gap:12px; padding:16px 34px;
  background:linear-gradient(135deg, rgba(212,160,23,0.2), rgba(192,57,43,0.12));
  border:1px solid rgba(212,160,23,0.5); border-radius:99px; text-decoration:none;
  color:var(--pl-text); font-family:'Outfit',sans-serif; font-size:0.74rem; font-weight:700;
  letter-spacing:0.15em; text-transform:uppercase; transition:all 0.3s; position:relative; z-index:1;
}
.pl-cta-btn:hover { transform:translateY(-3px); box-shadow:0 16px 50px rgba(212,160,23,0.22); border-color:rgba(212,160,23,0.8); }
.pl-file-chips { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-top:24px; }
.pl-file-chip  { display:inline-flex; align-items:center; gap:8px; padding:8px 16px; background:var(--pl-glass); border:1px solid var(--pl-border); border-radius:99px; }
.pl-file-chip i { color:var(--pl-gold); font-size:0.8rem; }
.pl-file-name  { font-family:monospace; font-size:0.68rem; color:var(--pl-text); }
.pl-file-size  { font-size:0.6rem; color:var(--pl-dim); padding-left:4px; border-left:1px solid var(--pl-border); }

/* ── footer ── */
.pl-footer { border-top:1px solid var(--pl-border); padding:40px 80px; }
.pl-footer-inner { max-width:1120px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:24px; }
.pl-footer-logo  { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:700; color:var(--pl-text); }
.pl-footer-logo span { color:var(--pl-gold); }
.pl-footer-caption { font-size:0.72rem; color:var(--pl-dim); margin:4px 0 0; }
.pl-footer-meta { display:flex; flex-direction:column; gap:3px; text-align:center; }
.pl-footer-meta p { font-size:0.7rem; color:var(--pl-dim); margin:0; }
.pl-footer-meta strong { color:var(--pl-text); }

/* ══ RESPONSIVE ══ */
@media (max-width:960px) {
  .pl-hero          { grid-template-columns:1fr; padding:100px 40px 60px; gap:48px; }
  .pl-hero-visual   { order:-1; }
  .pl-ring1         { width:280px; height:280px; }
  .pl-ring2         { width:230px; height:230px; }
  .pl-logo-circle   { width:220px; height:220px; }
  .pl-logo-frame    { width:300px; height:300px; }
  .pl-scroll-hint   { display:none; }
  .pl-section       { padding:80px 40px; }
  .pl-overview-grid { grid-template-columns:1fr; gap:36px; }
  .pl-color-grid    { grid-template-columns:repeat(3,1fr); }
  .pl-variant-grid  { grid-template-columns:repeat(2,1fr); }
  .pl-footer        { padding:40px; }
  .pl-footer-inner  { flex-direction:column; align-items:flex-start; }
}
@media (max-width:640px) {
  .pl-hero          { padding:80px 24px 60px; gap:40px; }
  .pl-section       { padding:70px 24px; }
  .pl-cta-box       { padding:48px 28px; }
  .pl-hero-title span { font-size:3rem; }
  .pl-phil-grid     { grid-template-columns:1fr; }
  .pl-color-grid    { grid-template-columns:repeat(2,1fr); }
  .pl-variant-grid  { grid-template-columns:1fr; }
  .pl-spec-grid     { grid-template-columns:1fr; }
  .pl-stat-item     { padding:20px 16px; min-width:100px; }
  .pl-footer        { padding:32px 24px; }
  .pl-ring1         { width:240px; height:240px; }
  .pl-ring2         { width:190px; height:190px; }
  .pl-logo-frame    { width:260px; height:260px; }
  .pl-logo-circle   { width:190px; height:190px; }
}
`;