import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "fa-solid fa-robot",
    name: "AI Assistant Interaktif",
    desc: "Chatbot berbasis Gemini AI yang berperan sebagai si pembuat. Bisa diajak ngobrol bebas, minta petunjuk — tapi tetap tidak akan pernah membocorkan password aslinya.",
  },
  {
    icon: "fa-solid fa-gamepad",
    name: "Login Berbasis Game",
    desc: "Tidak ada username dan password yang diberikan langsung. Penerimanya harus menyelesaikan Flappy Bird dan Game 2048 terlebih dahulu untuk mendapatkan clue-nya.",
  },
  {
    icon: "fa-solid fa-unlock",
    name: "Chapter Unlock Bertahap",
    desc: "Tiga chapter cerita dibuka secara bertahap dengan Telegram stealth tracker yang diam-diam memberi notifikasi ke si pembuat setiap kali chapter dibuka.",
  },
  {
    icon: "fa-solid fa-microchip",
    name: "Integrasi NFC Fisik",
    desc: "Tag NFC disematkan ke dalam baju sungguhan. Saat HP mendekat dan memindainya, secara otomatis membuka halaman kejutan tersembunyi.",
  },
  {
    icon: "fa-solid fa-book-open",
    name: "Pengalaman Bercerita Imersif",
    desc: "Tiga chapter cerita dengan reading progress bar, dark mode toggle, dan bubble chat bergaya WhatsApp. Dilanjutkan dua halaman Instagram Story fullscreen.",
  },
  {
    icon: "fa-solid fa-wand-magic-sparkles",
    name: "Mesin Efek Visual Lengkap",
    desc: "Canvas partikel, confetti, floating emoji, ripple effects, Easter egg tersembunyi, custom cursor dengan percikan api, dan animasi penuh di setiap interaksi.",
  },
];

const TECHS = [
  { icon: "fa-brands fa-html5", name: "HTML5", desc: "Struktur untuk 11 halaman" },
  { icon: "fa-brands fa-css3-alt", name: "CSS3", desc: "Animasi, @keyframes, Neo-Brutalism" },
  { icon: "fa-brands fa-js", name: "Vanilla JS", desc: "ES6+, Game Logic, Particles" },
  { icon: "fa-solid fa-palette", name: "Canvas API", desc: "Partikel, Confetti Engine" },
  { icon: "fa-solid fa-robot", name: "Gemini AI API", desc: "AI Chatbot Berkarakter" },
  { icon: "fa-solid fa-paper-plane", name: "Telegram Bot API", desc: "Stealth Tracker Notifikasi" },
];

const TAGS = [
  "HTML / CSS / JS","Canvas API","Gemini AI","Telegram Bot","NFC Web API",
  "Neo-Brutalism","Flappy Bird","Game 2048","Confetti Effect","Dark Mode",
  "Custom Cursor","Chapter Unlock System",
];

const PROCESSES = [
  {
    num: "01",
    title: "Konsep & Alur Pengalaman",
    desc: "Merancang keseluruhan alur dari kejutan NFC, dua misi game, sistem login, halaman kado, hingga chapter cerita. Menentukan gaya desain Neo-Brutalism dan struktur 11 halaman secara menyeluruh sebelum satu baris kode pun ditulis.",
    dur: "2 hari",
  },
  {
    num: "02",
    title: "Sistem Desain & Visual",
    desc: "Membangun design system Neo-Brutalism dari nol — CSS variables, palet warna 6 aksen, tipografi Poppins, pola border tebal, hard shadow, dan komponen yang konsisten di seluruh halaman.",
    dur: "3 hari",
  },
  {
    num: "03",
    title: "Development & Integrasi",
    desc: "Membangun Flappy Bird dan 2048 dari nol, mengintegrasikan Gemini AI chatbot, sistem login dengan Easter egg, progressive chapter unlock, background music, canvas partikel, confetti, countdown timer, dan Telegram stealth tracker.",
    dur: "7 hari",
  },
  {
    num: "04",
    title: "NFC, Finishing & Deploy",
    desc: "Setup tag NFC fisik ke halaman suprise.html, polish seluruh animasi, dark mode, reading progress bar, custom cursor di igstory, dan deployment ke GitHub Pages agar bisa diakses langsung dari HP penerima.",
    dur: "2 hari",
    last: true,
  },
];

const GALLERY_ITEMS = [
  { src: "/assets/img/satu.png",  alt: "Tampilan Desktop",          caption: "Tampilan Desktop",          cls: "k1-gal-laptop-lg" },
  { src: "/assets/img/tiga.png",  alt: "Login & AI Chatbot",        caption: "Login & AI Chatbot",        cls: "k1-gal-phone" },
  { src: "/assets/img/dua.png",   alt: "Tampilan Mobile",           caption: "Tampilan Mobile",           cls: "k1-gal-phone" },
  { src: "/assets/img/empat.png", alt: "Misi 1 - Game 2048",        caption: "Misi 1 - Game 2048",        cls: "k1-gal-laptop-lg" },
  { src: "/assets/img/lima.png",  alt: "Menu Awal",                 caption: "Menu Awal",                 cls: "k1-gal-laptop-half" },
  { src: "/assets/img/enam.png",  alt: "Kado Utama & Chapter Story",caption: "Kado Utama & Chapter Story",cls: "k1-gal-laptop-half" },
];

/* ─────────────────────────────────────────────
   HOOK: Reveal on scroll
───────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const els = container.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─────────────────────────────────────────────
   IMAGE MODAL
───────────────────────────────────────────── */
function ImageModal({ src, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "k1ModalIn 0.25s ease",
      }}
    >
      {/* overlay */}
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      />
      {/* content */}
      <div style={{ position: "relative", zIndex: 1, padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "20px", right: "20px",
            width: "44px", height: "44px", borderRadius: "50%",
            background: "var(--bg3)", border: "1px solid var(--border2)",
            color: "var(--text)", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", fontSize: "1.2rem",
            transition: "all 0.3s",
            zIndex: 2,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg3)"; e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text)"; }}
        >
          <i className="fa-solid fa-xmark" />
        </button>
        <img
          src={src}
          alt="Preview"
          style={{
            maxWidth: "90%", maxHeight: "90vh", objectFit: "contain",
            borderRadius: "16px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.75)",
            animation: "k1ImgIn 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROCESS ITEM (accordion)
───────────────────────────────────────────── */
function ProcessItem({ item, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`reveal${delay ? ` rv-d${delay}` : ""}`}
      style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "40px", position: "relative" }}
    >
      {/* left */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "4px" }}>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "2.8rem", fontWeight: 300,
            color: open ? "var(--accent2)" : "var(--text-dim)",
            lineHeight: 1, marginBottom: "16px", alignSelf: "center",
            transition: "color 0.3s",
          }}
        >
          {item.num}
        </span>
        {!item.last && (
          <div style={{ width: "1px", flex: 1, minHeight: "40px", background: "linear-gradient(to bottom, var(--border2), transparent)", margin: "0 auto" }} />
        )}
      </div>
      {/* right */}
      <div style={{ padding: "6px 0 50px" }}>
        <button
          onClick={() => setOpen((p) => !p)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", background: "none", border: "none",
            color: "inherit", cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            padding: 0, textAlign: "left",
          }}
        >
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 600 }}>
            {item.title}
          </span>
          <span
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: "var(--accent2)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
              flexShrink: 0, marginLeft: "12px",
            }}
          >
            <i className="fa-solid fa-chevron-down" />
          </span>
        </button>

        <div
          style={{
            overflow: "hidden",
            maxHeight: open ? "400px" : "0",
            opacity: open ? 1 : 0,
            transition: "max-height 0.38s ease, opacity 0.35s ease",
          }}
        >
          <p style={{ fontSize: "0.85rem", lineHeight: 1.88, color: "var(--text-dim)", maxWidth: "520px", margin: "16px 0 0" }}>
            {item.desc}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "0.64rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent2)", marginTop: "12px" }}>
            <i className="fa-regular fa-clock" /> {item.dur}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function PortoKarya1({ t }) {
  const navigate = useNavigate();
  const pageRef = useReveal();
  const [modalSrc, setModalSrc] = useState(null);
  const [imgErrors, setImgErrors] = useState({});

  const handleImgError = useCallback((key) => {
    setImgErrors((p) => ({ ...p, [key]: true }));
  }, []);

  const openModal = useCallback((src) => setModalSrc(src), []);
  const closeModal = useCallback(() => setModalSrc(null), []);

  // scroll-to-top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      {/* ── KEYFRAMES ── */}
      <style>{`
        @keyframes k1ModalIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes k1ImgIn    { from { opacity:0; transform:scale(0.94) } to { opacity:1; transform:scale(1) } }
        @keyframes k1Bounce   { 0%,100% { transform:translateY(0) } 50% { transform:translateY(6px) } }

        .k1-gal-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 18px;
          margin-bottom: 24px;
        }
        .k1-gal-item {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: var(--bg3);
          border: 1px solid var(--border);
          transition: transform 0.4s ease, border-color 0.4s ease;
          cursor: pointer;
        }
        .k1-gal-item:hover {
          transform: translateY(-6px);
          border-color: rgba(139,92,246,0.35);
        }
        .k1-gal-laptop-lg   { grid-column: span 4; aspect-ratio: 16/9; }
        .k1-gal-laptop-half { grid-column: span 3; aspect-ratio: 16/9; }
        .k1-gal-phone       { grid-column: span 2; aspect-ratio: 9/16; }
        .k1-gal-item img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s ease;
          display: block;
        }
        .k1-gal-item:hover img { transform: scale(1.05); }
        .k1-gal-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 14px 18px;
          background: linear-gradient(to top, rgba(7,7,9,0.72) 0%, transparent 100%);
          font-size: 0.62rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.8);
          pointer-events: none;
        }
        .k1-gal-ph {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px;
          background: linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%);
          color: var(--text-dim); font-size: 0.65rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          min-height: 120px;
        }
        .k1-gal-ph i { font-size: 2rem; opacity: 0.18; }

        .k1-feat-card {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 22px; padding: 34px 30px;
          transition: all 0.35s ease;
          position: relative; overflow: hidden;
        }
        .k1-feat-card::before {
          content: '';
          position: absolute; inset: 0; border-radius: 22px;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.09) 0%, transparent 65%);
          pointer-events: none; opacity: 0; transition: opacity 0.35s;
        }
        .k1-feat-card:hover::before { opacity: 1; }
        .k1-feat-card:hover {
          border-color: rgba(139,92,246,0.3);
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.35);
        }

        .k1-tech-item {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 18px; padding: 28px 24px;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 8px;
          transition: all 0.3s ease;
        }
        .k1-tech-item:hover {
          border-color: rgba(139,92,246,0.3);
          background: var(--bg2);
          transform: translateY(-4px);
        }

        .k1-tag {
          background: var(--bg3);
          border: 1px solid var(--border2);
          border-radius: 99px; padding: 7px 16px;
          font-size: 0.62rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-dim);
          transition: all 0.25s;
          cursor: default;
        }
        .k1-tag:hover {
          border-color: var(--accent3);
          color: var(--accent3);
          background: var(--bg2);
        }

        .k1-proj-nav {
          display: flex; align-items: center; gap: 18px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 18px; padding: 22px 28px;
          color: var(--text); transition: all 0.3s ease;
          cursor: pointer; font-family: 'Outfit', sans-serif;
          flex: 1; max-width: 320px;
        }
        .k1-proj-nav:hover {
          border-color: rgba(139,92,246,0.35);
          background: var(--bg2);
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.3);
        }

        .k1-social-btn {
          width: 48px; height: 48px;
          border-radius: 12px;
          border: 1px solid var(--border2);
          background: var(--bg2);
          color: var(--text-dim);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.3s ease;
          font-size: 1.1rem;
        }
        .k1-social-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
          transform: translateY(-3px);
        }

        .k1-cta-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--accent); color: #fff;
          border: none; border-radius: 99px;
          padding: 15px 40px;
          font-size: 0.74rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          transition: all 0.3s ease; cursor: pointer;
          box-shadow: 0 8px 28px rgba(139,92,246,0.35);
          position: relative; z-index: 1;
          font-family: 'Outfit', sans-serif;
        }
        .k1-cta-btn:hover {
          background: var(--accent2);
          transform: scale(1.05);
          box-shadow: 0 14px 40px rgba(139,92,246,0.45);
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .k1-gal-grid { grid-template-columns: repeat(4, 1fr); }
          .k1-gal-laptop-lg   { grid-column: span 3; }
          .k1-gal-laptop-half { grid-column: span 2; }
          .k1-gal-phone       { grid-column: span 1; }
        }
        @media (max-width: 768px) {
          .k1-gal-grid { grid-template-columns: repeat(2, 1fr); }
          .k1-gal-laptop-lg   { grid-column: span 2; aspect-ratio: 16/9; }
          .k1-gal-laptop-half { grid-column: span 1; aspect-ratio: 16/9; }
          .k1-gal-phone       { grid-column: span 1; aspect-ratio: 9/16; }
        }
      `}</style>

      <div ref={pageRef}>

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "flex-end", padding: "0 80px 90px", overflow: "hidden" }}>
          {/* bg */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <img
              src="/assets/img/image.png"
              alt="Project Hero"
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45) saturate(1.1)" }}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(7,7,9,1) 0%, rgba(7,7,9,0.6) 50%, rgba(7,7,9,0.2) 100%), radial-gradient(ellipse 70% 60% at 80% 30%, rgba(139,92,246,0.18) 0%, transparent 65%)",
            }} />
          </div>

          {/* content */}
          <div style={{ position: "relative", zIndex: 2, maxWidth: "780px" }}>
            {/* breadcrumb */}
            <div className="reveal" style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "28px" }}>
              <span
                onClick={() => navigate("/porto")}
                style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", cursor: "pointer", transition: "color 0.25s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent2)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-dim)"}
              >
                Work
              </span>
              <span style={{ color: "var(--text-dim)", fontSize: "0.5rem" }}><i className="fa-solid fa-chevron-right" /></span>
              <span style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent2)" }}>Web Design</span>
            </div>

            {/* badge */}
            <div className="reveal rv-d1" style={{
              display: "inline-block",
              background: "var(--glass2)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
              border: "1px solid var(--gborder2)", borderRadius: "99px",
              padding: "6px 18px", fontSize: "0.6rem", fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--accent3)", marginBottom: "22px",
            }}>
              Web Development &amp; AI Integration
            </div>

            {/* title */}
            <h1 className="reveal rv-d2" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
              fontWeight: 300, lineHeight: 0.9, marginBottom: "24px",
            }}>
              Interactive<br />
              <em style={{ fontStyle: "italic", color: "var(--text-dim)" }}>Birthday Gift</em>
            </h1>

            {/* sub */}
            <p className="reveal rv-d3" style={{ fontSize: "0.92rem", color: "var(--text-dim)", maxWidth: "500px", lineHeight: 1.78, marginBottom: "36px" }}>
              Website kado ulang tahun interaktif — dibangun penuh dengan HTML, CSS, dan JS murni. Menggabungkan game bawaan, AI assistant, integrasi NFC fisik, dan pengalaman bercerita yang imersif dalam satu paket kejutan digital.
            </p>

            {/* meta */}
            <div className="reveal rv-d3" style={{
              display: "flex", alignItems: "center",
              background: "var(--glass)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
              border: "1px solid var(--gborder)", borderRadius: "16px",
              padding: "20px 28px", width: "fit-content",
            }}>
              {[
                { label: "Tahun", val: "2026" },
                { label: "Peran", val: "Developer & Designer" },
                { label: "Durasi", val: "±2 Minggu" },
              ].map((m, i) => (
                <div key={m.label} style={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && <div style={{ width: "1px", height: "38px", background: "var(--border2)", flexShrink: 0, margin: "0 28px" }} />}
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <span style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-dim)" }}>{m.label}</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--text)" }}>{m.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* scroll hint */}
          <div style={{
            position: "absolute", bottom: "38px", right: "80px", zIndex: 2,
            display: "flex", alignItems: "center", gap: "10px",
            fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "var(--text-dim)",
          }}>
            <span>Gulir ke bawah</span>
            <i className="fa-solid fa-arrow-down" style={{ animation: "k1Bounce 1.6s ease-in-out infinite" }} />
          </div>
        </section>

        {/* ══════════════════════════════════════
            OVERVIEW
        ══════════════════════════════════════ */}
        <section style={{ padding: "100px 80px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
            <div className="reveal">
              <span style={{ display: "block", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "16px" }}>
                01 / Gambaran Proyek
              </span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.6rem, 5.5vw, 5.5rem)", fontWeight: 300, lineHeight: 0.9, marginBottom: 0 }}>
                Tentang Proyek <em style={{ fontStyle: "italic", color: "var(--text-dim)" }}>Ini.</em>
              </h2>
            </div>
            <div className="reveal rv-d1" style={{ paddingTop: "10px" }}>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.9, color: "var(--text-dim)" }}>
                Website ini lahir dari satu pertanyaan sederhana: bagaimana kalau kado ulang tahun bisa dimainkan, dirasakan, dan dialami? Dibangun sepenuhnya dengan HTML, CSS, dan JavaScript murni tanpa satu pun framework — proyek ini bukan sekadar halaman web biasa. Ini adalah sebuah perjalanan digital: mulai dari memindai tag NFC pada baju nyata, bermain dua game untuk mendapat kode masuk, ngobrol dengan AI, hingga membuka tiga chapter cerita cinta secara bertahap.
              </p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.9, color: "var(--text-dim)", marginTop: "22px" }}>
                Setiap halaman dari total 11 halaman dirancang dengan sistem desain Neo-Brutalism yang konsisten — border tebal hitam, hard shadow, tipografi Poppins yang bold, dan palet warna aksen yang mencolok. Ada Telegram tracker tersembunyi yang diam-diam memberi tahu si pembuat setiap kali chapter dibuka, animasi canvas partikel, confetti, countdown ulang tahun, dark mode, reading progress bar, format Instagram Story, hingga custom cursor dengan efek percikan api.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            STATS BAR
        ══════════════════════════════════════ */}
        <div className="reveal" style={{
          margin: "0 80px",
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          display: "flex", alignItems: "center", justifyContent: "space-around",
          padding: "40px 60px",
        }}>
          {[
            { num: "11", label: "Halaman" },
            { num: "2",  label: "Game Bawaan" },
            { num: "3",  label: "Chapter Cerita" },
            { num: "∞",  label: "Rasa Sayang" },
          ].map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && <div style={{ width: "1px", height: "50px", background: "var(--border2)", marginRight: "40px" }} />}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3rem", fontWeight: 300, color: "var(--text)", lineHeight: 1 }}>{s.num}</span>
                <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)" }}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════
            GALLERY
        ══════════════════════════════════════ */}
        <section style={{ padding: "100px 80px", borderTop: "1px solid var(--border)" }}>
          <span className="reveal" style={{ display: "block", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "16px" }}>
            02 / Galeri
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.6rem, 5.5vw, 5.5rem)", fontWeight: 300, lineHeight: 0.9, marginBottom: "60px" }}>
            Tampilan <em style={{ fontStyle: "italic", color: "var(--text-dim)" }}>Visual.</em>
          </h2>

          <div className={`k1-gal-grid reveal rv-d2`}>
            {GALLERY_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`k1-gal-item ${item.cls}`}
                onClick={() => !imgErrors[i] && openModal(item.src)}
              >
                {imgErrors[i] ? (
                  <div className="k1-gal-ph">
                    <i className={item.cls.includes("phone") ? "fa-solid fa-mobile-screen" : "fa-solid fa-laptop"} />
                    <span>{item.src.split("/").pop()}</span>
                  </div>
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    onError={() => handleImgError(i)}
                  />
                )}
                <div className="k1-gal-caption">{item.caption}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            FEATURES
        ══════════════════════════════════════ */}
        <section style={{ padding: "100px 80px", borderTop: "1px solid var(--border)" }}>
          <span className="reveal" style={{ display: "block", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "16px" }}>
            03 / Fitur
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.6rem, 5.5vw, 5.5rem)", fontWeight: 300, lineHeight: 0.9, marginBottom: "60px" }}>
            Fitur &amp; <em style={{ fontStyle: "italic", color: "var(--text-dim)" }}>Keunggulan.</em>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {FEATURES.map((f, i) => {
              const delay = i % 3;
              return (
                <div key={i} className={`k1-feat-card reveal${delay ? ` rv-d${delay}` : ""}`}>
                  <div style={{
                    width: "46px", height: "46px", borderRadius: "14px",
                    background: "var(--glass2)", border: "1px solid var(--gborder2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.1rem", color: "var(--accent2)", marginBottom: "20px",
                  }}>
                    <i className={f.icon} />
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 600, marginBottom: "12px", lineHeight: 1.2 }}>
                    {f.name}
                  </h3>
                  <p style={{ fontSize: "0.78rem", lineHeight: 1.82, color: "var(--text-dim)" }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════
            TECH STACK
        ══════════════════════════════════════ */}
        <section style={{ padding: "100px 80px", borderTop: "1px solid var(--border)" }}>
          <span className="reveal" style={{ display: "block", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "16px" }}>
            04 / Teknologi
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.6rem, 5.5vw, 5.5rem)", fontWeight: 300, lineHeight: 0.9, marginBottom: "60px" }}>
            Tech <em style={{ fontStyle: "italic", color: "var(--text-dim)" }}>Stack.</em>
          </h2>

          <div className="reveal rv-d2" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
            {TECHS.map((tech) => (
              <div key={tech.name} className="k1-tech-item">
                <div style={{ fontSize: "2rem", color: "var(--accent2)", marginBottom: "4px" }}><i className={tech.icon} /></div>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em" }}>{tech.name}</span>
                <span style={{ fontSize: "0.62rem", color: "var(--text-dim)", letterSpacing: "0.04em" }}>{tech.desc}</span>
              </div>
            ))}
          </div>

          <div className="reveal rv-d3" style={{ display: "flex", flexWrap: "wrap", gap: "9px" }}>
            {TAGS.map((tag) => (
              <span key={tag} className="k1-tag">{tag}</span>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            PROCESS
        ══════════════════════════════════════ */}
        <section style={{ padding: "100px 80px", borderTop: "1px solid var(--border)" }}>
          <span className="reveal" style={{ display: "block", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "16px" }}>
            05 / Proses
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.6rem, 5.5vw, 5.5rem)", fontWeight: 300, lineHeight: 0.9, marginBottom: "60px" }}>
            Alur <em style={{ fontStyle: "italic", color: "var(--text-dim)" }}>Pengerjaan.</em>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {PROCESSES.map((item, i) => (
              <ProcessItem key={item.num} item={item} delay={i > 0 ? i : 0} />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            PROJECT NAVIGATION
        ══════════════════════════════════════ */}
        <div className="reveal" style={{
          padding: "60px 80px 0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderTop: "1px solid var(--border)", gap: "20px",
        }}>
          <button className="k1-proj-nav" onClick={() => navigate("/porto")}>
            <i className="fa-solid fa-arrow-left" style={{ fontSize: "1rem", color: "var(--text-dim)", flexShrink: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-dim)" }}>Kembali ke Work</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontWeight: 600 }}>Semua Proyek</span>
            </div>
          </button>
          <button className="k1-proj-nav" onClick={() => navigate("/porto/karya2")} style={{ justifyContent: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "right" }}>
              <span style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-dim)" }}>Proyek Berikutnya</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontWeight: 600 }}>Undangan Pernikahan Digital</span>
            </div>
            <i className="fa-solid fa-arrow-right" style={{ fontSize: "1rem", color: "var(--text-dim)", flexShrink: 0 }} />
          </button>
        </div>

        {/* ══════════════════════════════════════
            SOCIAL SHARE
        ══════════════════════════════════════ */}
        <div className="reveal" style={{
          margin: "60px 80px 0",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap",
          paddingTop: "24px", borderTop: "1px solid var(--border)",
        }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)" }}>
            Bagikan Karya Ini
          </span>
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              { icon: "fa-brands fa-twitter", label: "Twitter" },
              { icon: "fa-brands fa-instagram", label: "Instagram" },
              { icon: "fa-brands fa-linkedin", label: "LinkedIn" },
            ].map((s) => (
              <button key={s.label} className="k1-social-btn" aria-label={`Bagikan ke ${s.label}`}>
                <i className={s.icon} />
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            CTA
        ══════════════════════════════════════ */}
        <div className="reveal" style={{ padding: "60px 80px 100px" }}>
          <div style={{
            background: "var(--bg3)", border: "1px solid var(--border)",
            borderRadius: "28px", padding: "70px 80px",
            position: "relative", overflow: "hidden", textAlign: "center",
          }}>
            {/* glow */}
            <div style={{
              position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)",
              width: "400px", height: "200px",
              background: "radial-gradient(ellipse, rgba(139,92,246,0.22) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            {/* top line */}
            <div style={{
              position: "absolute", top: 0, left: "15%", right: "15%", height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)",
            }} />

            <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--accent2)", marginBottom: "16px", position: "relative", zIndex: 1 }}>
              Mau bikin kado digital yang benar-benar tak terlupakan?
            </p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 5vw, 4.5rem)", fontWeight: 300, lineHeight: 1.05, marginBottom: "18px", position: "relative", zIndex: 1 }}>
              Mari wujudkan<br />
              <em style={{ fontStyle: "italic", color: "var(--text-dim)" }}>momen spesialmu.</em>
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-dim)", maxWidth: "420px", margin: "0 auto 36px", lineHeight: 1.78, position: "relative", zIndex: 1 }}>
              Ceritakan ide kamu — biar sebesar atau sekecil apapun. Saya siap mengubahnya menjadi pengalaman yang benar-benar berkesan buat orang yang kamu sayang.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="k1-cta-btn" onClick={() => navigate("/contact")}>
                <span>Mulai Proyek Sekarang</span>
                <i className="fa-solid fa-arrow-up-right" />
              </button>
              <a
                href="https://synnnw.github.io/SynnnW-HBD/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--glass2)', color: 'var(--text)', border: '1px solid var(--gborder2)', borderRadius: '99px', padding: '14px 30px', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', backdropFilter: 'blur(12px)', transition: 'all 0.3s ease' }}
              >
                <i className="fa-solid fa-eye" />
                <span>Lihat Live Demo</span>
              </a>
            </div>
          </div>
        </div>

      </div>{/* /pageRef */}

      {/* ══════════════════════════════════════
          IMAGE MODAL
      ══════════════════════════════════════ */}
      {modalSrc && <ImageModal src={modalSrc} onClose={closeModal} />}
    </>
  );
}