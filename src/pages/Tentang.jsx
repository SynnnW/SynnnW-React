import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ============================================================
   DATA
   ============================================================ */

const ACCORDION_ITEMS = [
  {
    id: "acc1",
    num: "01",
    icon: "fa-solid fa-code",
    title: "Web Developer",
    titleKey: "acc1t",
    bodyKey: "acc1p",
    bodyDefault:
      "Saya mengkhususkan diri dalam desain React kelas atas dan arsitektur responsif yang bersih untuk identitas digital premium. Dari portofolio hingga web pernikahan kustom, saya fokus pada perpaduan keunggulan visual dengan kejelasan fungsional. Setiap antarmuka yang saya bangun dirancang untuk memberikan pengalaman yang terasa premium, intuitif, dan berkesan.",
    skills: [
      "React / Next.js",
      "HTML / CSS / JS",
      "Animasi GSAP",
      "TypeScript",
      "Glassmorphism UI",
      "Arsitektur UX",
      "Responsive Design",
      "CSS Variables",
    ],
  },
  {
    id: "acc2",
    num: "02",
    icon: "fa-solid fa-film",
    title: "Video Editing & Motion Graphic",
    titleKey: "acc2t",
    bodyKey: "acc2p",
    bodyDefault:
      "Dari film pendek sekolah hingga konten promosi profesional. Dengan pemahaman mendalam tentang narasi visual dan ritme editing, setiap karya dirancang menyampaikan pesan dengan kuat dan estetis. Saya menggarap proyek video dari konsep awal hingga color grading akhir, memastikan setiap detik footage bercerita secara maksimal.",
    skills: [
      "DaVinci Resolve",
      "Adobe Premiere",
      "After Effects",
      "CapCut",
      "Color Grading",
      "Motion Graphics",
      "Audio Mixing",
      "Visual Storytelling",
    ],
  },
  {
    id: "acc3",
    num: "03",
    icon: "fa-solid fa-pen-nib",
    title: "Ilustrator & Desainer Grafis",
    titleKey: "acc3t",
    bodyKey: "acc3p",
    bodyDefault:
      "Solusi visual yang kuat untuk kebutuhan edukatif dan kreatif Anda — dari poster impactful, thumbnail YouTube yang memikat, hingga berbagai kebutuhan grafis lainnya. Setiap elemen visual saya rancang dengan mempertimbangkan dampak visual, hierarki informasi, dan konsistensi identitas brand.",
    skills: [
      "Adobe Illustrator",
      "Adobe Photoshop",
      "Canva",
      "Poster Design",
      "Thumbnail Design",
      "Brand Identity",
      "Typography",
      "Layout Design",
    ],
  },
  {
    id: "acc4",
    num: "04",
    icon: "fa-solid fa-camera",
    title: "Videografer & Fotografer",
    titleKey: "acc4t",
    bodyKey: "acc4p",
    bodyDefault:
      "Menggarap proyek visual dengan standar profesional — dari perencanaan konsep, teknik pengambilan gambar yang cermat, hingga hasil akhir yang memukau secara sinematik. Saya mengkombinasikan mata artistik yang terlatih dengan pengetahuan teknis kamera untuk menghasilkan karya yang berbicara sendiri.",
    skills: [
      "Portrait Photography",
      "Sinematografi",
      "Color Grading",
      "Komposisi Visual",
      "Golden Hour Shooting",
      "Post-Processing",
      "Lighting Techniques",
      "4K Videography",
    ],
  },
  {
    id: 'acc5',
    num: '05',
    icon: 'fa-solid fa-tower-broadcast',
    title: 'Live Stream & Desain Siaran',
    titleKey: 'acc5t',
    bodyKey: 'acc5p',
    bodyDefault: 'Merancang dan mengoperasikan sistem live streaming profesional menggunakan OBS Studio, vMix, dan vDeck — dengan overlay kustom, transisi scene, dan kontrol via tablet/website. Berpengalaman dalam produksi live streaming untuk event olahraga, sekolah, dan promosi dengan kualitas broadcast profesional.',
    skills: [
      'OBS Studio',
      'vMix',
      'vDeck / StreamDeck',
      'Overlay Design',
      'Scene Transition',
      'Tablet Controller',
      'Live Graphics',
      'Broadcast Layout',
    ],
  },
];

const SERVICES = [
  {
    num: "01",
    icon: "fa-solid fa-globe",
    titleKey: "svc1t",
    titleDefault: "Situs Web Portofolio",
    descKey: "svc1d",
    descDefault:
      "Menciptakan identitas digital premium untuk para kreatif, profesional, dan eksekutif yang membutuhkan kehadiran online canggih yang mencerminkan merek unik mereka.",
    tags: ["React", "HTML/CSS/JS", "UX Design"],
  },
  {
    num: "02",
    icon: "fa-solid fa-heart",
    titleKey: "svc2t",
    titleDefault: "Situs Web Pernikahan",
    descKey: "svc2d",
    descDefault:
      "Merancang undangan digital yang elegan dan personal — mengabadikan momen paling berharga dalam hidup Anda dengan keindahan visual yang tak terlupakan.",
    tags: ["Elegan", "Kustom", "Bilingual"],
  },
  {
    num: "03",
    icon: "fa-solid fa-clapperboard",
    titleKey: "svc3t",
    titleDefault: "Video Editing & Motion",
    descKey: "svc3d",
    descDefault:
      "Mengolah footage mentah menjadi narasi visual yang kuat — dari film pendek, vlog, hingga konten promosi dengan sentuhan motion graphic profesional.",
    tags: ["DaVinci Resolve", "After Effects", "4K"],
  },
  {
    num: "04",
    icon: "fa-solid fa-paintbrush",
    titleKey: "svc4t",
    titleDefault: "Ilustrasi & Desain Poster",
    descKey: "svc4d",
    descDefault:
      "Mewujudkan ide Anda menjadi karya visual yang berbicara — poster edukatif, thumbnail, dan grafis kreatif untuk platform digital maupun cetak.",
    tags: ["Illustrator", "Photoshop", "Canva"],
  },
  {
    num: "05",
    icon: "fa-solid fa-camera-retro",
    titleKey: "svc5t",
    titleDefault: "Videografer & Fotografer",
    descKey: "svc5d",
    descDefault:
      "Mengabadikan setiap momen penting dengan presisi artistik — dari foto portrait profesional hingga produksi video sinematik berkualitas tinggi.",
    tags: ["Portrait", "Sinematik", "Color Grade"],
  },
];

const TOOLS = [
  {
    catIcon: "fa-solid fa-code",
    catLabel: "Web Development",
    catKey: "toolCat1",
    items: [
      { icon: "fa-brands fa-html5", cls: "t-ti-html", label: "HTML5" },
      { icon: "fa-brands fa-css3-alt", cls: "t-ti-css", label: "CSS3" },
      { icon: "fa-brands fa-js", cls: "t-ti-js", label: "JavaScript" },
      { icon: "fa-brands fa-react", cls: "t-ti-react", label: "React" },
      { icon: "fa-solid fa-n", cls: "t-ti-next", label: "Next.js" },
      { icon: "fa-brands fa-git-alt", cls: "t-ti-git", label: "Git" },
    ],
  },
  {
    catIcon: "fa-solid fa-video",
    catLabel: "Video & Motion",
    catKey: "toolCat2",
    items: [
      { icon: "fa-solid fa-circle-play", cls: "t-ti-dav", label: "DaVinci Resolve" },
      { icon: "fa-solid fa-film", cls: "t-ti-ae", label: "After Effects" },
      { icon: "fa-brands fa-adobe", cls: "t-ti-pr", label: "Adobe Premiere" },
      { icon: "fa-solid fa-scissors", cls: "t-ti-cc", label: "CapCut" },
    ],
  },
  {
    catIcon: "fa-solid fa-palette",
    catLabel: "Design & Illustration",
    catKey: "toolCat3",
    items: [
      { icon: "fa-brands fa-adobe", cls: "t-ti-ai", label: "Adobe Illustrator" },
      { icon: "fa-brands fa-adobe", cls: "t-ti-ps", label: "Photoshop" },
      { icon: "fa-brands fa-canva", cls: "t-ti-canva", label: "Canva" },
      { icon: "fa-solid fa-pen-ruler", cls: "t-ti-fig", label: "Figma" },
    ],
  },
];

const CERTIF_ITEMS = [
  {
    src: "/assets/img/NOT ORDINARY.jpg",
    filename: "NOT_ORDINARY.jpg",
    caption: "NOT AN ORDINARY TEENAGE 2025",
    desc: "Peserta — Kegiatan NOT 2025, Universitas Jember · Tema: Strong Mind, Bright Future",
    cls: "tc-gal-half",
  },
  {
    src: "/assets/img/SERTTIF FLS2N.jpg",
    filename: "SERTTIF_FLS2N.jpg",
    caption: "Juara 2 Film Pendek FLS2N 2024",
    desc: "Juara 2 Tingkat Kabupaten Probolinggo — Festival Lomba Seni Siswa Nasional (FLS2N) · SMAN 1 Kraksaan",
    cls: "tc-gal-half",
  },
  {
    src: "/assets/img/SERTIF OSIS.jpg",
    filename: "SERTIF_OSIS.jpg",
    caption: "Anggota Sekbid Jurnalistik OSIS 2023–2024",
    desc: "Anggota Sekbid Jurnalistik — OSIS & MPK SMAN 1 Kraksaan · Periode 2023–2024",
    cls: "tc-gal-third",
  },
  {
    src: "/assets/img/film pendek nasional.jpg",
    filename: "film_pendek_nasional.jpg",
    caption: "Juara I Festival Film Cendana 2025",
    desc: "Juara I Nasional — Festival Film Cendana 2025 · SMAS Cendana Mandau, Bengkalis, Riau",
    cls: "tc-gal-third",
  },
  {
    src: "/assets/img/MEDSPIN.jpg",
    filename: "MEDSPIN.jpg",
    caption: "Participant Public Poster MEDSPIN 2025",
    desc: "Peserta Public Poster — Medical Science and Application Competition (MEDSPIN) · Universitas Airlangga · Sep–Okt 2025",
    cls: "tc-gal-third",
  },
];

/* ============================================================
   ACCORDION ITEM
   ============================================================ */
function AccordionItem({ item, isOpen, onToggle, t }) {
  const title = (t && t[item.titleKey]) || item.title;
  const body = (t && t[item.bodyKey]) || item.bodyDefault;

  return (
    <div className={`t-acc-item${isOpen ? " open" : ""}`}>
      <div className="t-acc-hdr" onClick={onToggle} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onToggle()}>
        <div className="t-acc-hdr-left">
          <span className="t-acc-num">{item.num}</span>
          <span className="t-acc-icon-wrap">
            <i className={item.icon}></i>
          </span>
          <span className="t-acc-title">{title}</span>
        </div>
        <span className="t-acc-toggle">
          <i className="fa-solid fa-plus"></i>
        </span>
      </div>
      <div className="t-acc-body">
        <div className="t-acc-body-inner">
          <p>{body}</p>
          <div className="t-acc-skills">
            {item.skills.map((sk, i) => (
              <span key={i} className="t-skill-tag">{sk}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   IMAGE MODAL (same as PortoKarya1)
   ============================================================ */
function CertifModal({ src, filename, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", animation:"tcModalIn 0.25s ease" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.9)", backdropFilter:"blur(12px)" }} />
      <div style={{ position:"relative", zIndex:1, padding:"20px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", width:"100%", height:"100%" }}>
        <button onClick={onClose}
          style={{ position:"absolute", top:"20px", right:"20px", width:"44px", height:"44px", borderRadius:"50%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:"1.2rem", transition:"all 0.3s", zIndex:2 }}
          onMouseEnter={(e) => { e.currentTarget.style.background="rgba(139,92,246,0.7)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background="rgba(255,255,255,0.08)"; }}>
          <i className="fa-solid fa-xmark" />
        </button>
        <img src={src} alt={filename}
          style={{ maxWidth:"88%", maxHeight:"82vh", objectFit:"contain", borderRadius:"16px", boxShadow:"0 25px 80px rgba(0,0,0,0.8)", animation:"tcImgIn 0.3s ease" }} loading="lazy" />
        <div style={{ marginTop:"16px", fontSize:"0.66rem", fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)" }}>
          {filename}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE COMPONENT
   ============================================================ */
export default function Tentang({ t }) {
  const navigate = useNavigate();
  const [openAcc, setOpenAcc] = useState("acc1");
  const [imgError, setImgError] = useState(false);
  const [certModal, setCertModal] = useState(null); // { src, filename }
  const [certErrors, setCertErrors] = useState({});

  /* ── Reveal on scroll ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: "0px 0px -20px 0px" }
    );
    // delay agar semua elemen sudah di-render React
    const timer = setTimeout(() => {
      const items = document.querySelectorAll(".reveal");
      items.forEach((el) => observer.observe(el));
    }, 100);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, []);

  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleAccToggle = (id) => {
    setOpenAcc((prev) => (prev === id ? null : id));
  };

  /* ── i18n helper ── */
  const tx = (key, fallback) => (t && t[key]) || fallback;

  return (
    <>
      <style>{`
        /* ============================================================
           TENTANG PAGE — EMBEDDED STYLES
           ============================================================ */

        /* PAGE HEADER */
        .t-page-header {
          min-height: 52vh;
          display: flex;
          align-items: flex-end;
          padding: 130px 80px 70px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }
        .t-page-header-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 65% at 90% 15%, rgba(139,92,246,0.1) 0%, transparent 65%),
            radial-gradient(ellipse 40% 50% at 10% 80%, rgba(139,92,246,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        .t-page-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 80px;
          right: 80px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent2), transparent);
          opacity: 0.22;
        }
        .t-page-header-content { position: relative; z-index: 1; }
        .page-label {
          display: block;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--text-dim);
          margin-bottom: 14px;
        }
        .t-page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.5rem, 9vw, 9rem);
          font-weight: 300;
          line-height: 0.88;
          margin-bottom: 20px;
        }
        .t-page-title em { font-style: italic; color: var(--text-dim); }
        .t-page-sub {
          font-size: 0.9rem;
          color: var(--text-dim);
          max-width: 440px;
          line-height: 1.78;
        }

        /* SECTION BASE */
        .t-section {
          padding: 100px 80px;
          border-top: 1px solid var(--border);
        }
        .t-sec-label {
          display: block;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--text-dim);
          margin-bottom: 16px;
        }
        .t-sec-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.6rem, 5.5vw, 5.5rem);
          font-weight: 300;
          line-height: 0.9;
          margin-bottom: 60px;
        }
        .t-sec-title em { font-style: italic; color: var(--text-dim); }

        /* INTRO */
        .t-intro { padding-top: 80px; }
        .t-intro-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 80px;
          align-items: start;
        }

        /* PHOTO */
        .t-photo-col { position: relative; }
        .t-photo-wrap {
          position: sticky;
          top: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .t-photo-glow {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(139,92,246,0.28) 0%, transparent 70%);
          pointer-events: none;
          filter: blur(30px);
          animation: tentangPhotoGlow 4s ease-in-out infinite alternate;
        }
        @keyframes tentangPhotoGlow {
          from { opacity: 0.6; transform: translateX(-50%) scale(0.9); }
          to   { opacity: 1;   transform: translateX(-50%) scale(1.1); }
        }
        .t-photo-glass {
          width: 100%;
          aspect-ratio: 3/4;
          border-radius: 28px;
          overflow: hidden;
          background: var(--glass2);
          border: 1px solid var(--gborder2);
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
          position: relative;
          z-index: 1;
          box-shadow: 0 30px 80px var(--shadow), 0 0 0 1px rgba(139,92,246,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .t-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .t-photo-glass:hover .t-photo-img { transform: scale(1.04); }
        .t-photo-initials {
          font-family: 'Cormorant Garamond', serif;
          font-size: 6rem;
          font-weight: 300;
          color: var(--text-dim);
          opacity: 0.4;
        }
        .t-photo-badge {
          display: flex;
          align-items: center;
          gap: 9px;
          background: var(--glass2);
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
          border: 1px solid var(--gborder2);
          border-radius: 99px;
          padding: 10px 20px;
          font-size: 0.66rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text);
          position: relative;
          z-index: 1;
        }
        .t-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34,197,94,0.7);
          flex-shrink: 0;
          animation: tentangPulse 2s ease-in-out infinite;
        }
        @keyframes tentangPulse {
          0%, 100% { box-shadow: 0 0 6px rgba(34,197,94,0.5); }
          50%       { box-shadow: 0 0 14px rgba(34,197,94,0.9); }
        }
        .t-social-float {
          display: flex;
          gap: 10px;
          position: relative;
          z-index: 1;
        }
        .t-soc-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--glass2);
          border: 1px solid var(--gborder);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          font-size: 0.9rem;
          transition: all 0.3s;
          text-decoration: none;
        }
        .t-soc-btn:hover {
          border-color: var(--accent2);
          color: var(--accent2);
          background: var(--glass3);
          transform: translateY(-3px);
        }

        /* INTRO TEXT */
        .t-intro-text-col { padding-top: 6px; }
        .t-intro-text-col .t-sec-title { margin-bottom: 28px; }
        .t-intro-lead {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.45rem;
          font-weight: 400;
          font-style: italic;
          color: var(--text);
          line-height: 1.5;
          margin-bottom: 22px;
        }
        .t-intro-body {
          font-size: 0.9rem;
          line-height: 1.92;
          color: var(--text-dim);
          margin-bottom: 18px;
        }
        .t-intro-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 30px 0 34px;
        }
        .t-info-item {
          background: var(--glass);
          border: 1px solid var(--gborder);
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: border-color 0.3s, background 0.3s;
        }
        .t-info-item:hover { border-color: var(--gborder2); background: var(--glass2); }
        .t-info-label {
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--text-dim);
        }
        .t-info-val {
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text);
        }
        .t-status-open { color: #22c55e; }
        .t-btn-contact {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--text);
          color: var(--bg);
          border: none;
          border-radius: 99px;
          padding: 14px 32px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          transition: all 0.35s ease;
          cursor: pointer;
        }
        .t-btn-contact:hover { background: var(--accent); color: #fff; transform: scale(1.04); }

        /* NUMBERS BAR */
        .t-numbers-bar {
          margin: 0 80px;
          background: var(--glass);
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
          border: 1px solid var(--gborder);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 44px 60px;
        }
        .t-num-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .t-num-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.2rem;
          font-weight: 300;
          color: var(--text);
          line-height: 1;
        }
        .t-num-label {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-dim);
        }
        .t-num-line { width: 1px; height: 52px; background: var(--border2); }

        /* ACCORDION */
        .t-acc-list {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          border-radius: 22px;
          overflow: hidden;
        }
        .t-acc-item {
          border-bottom: 1px solid var(--border);
          background: var(--glass);
          transition: background 0.3s;
        }
        .t-acc-item:last-child { border-bottom: none; }
        .t-acc-item.open { background: var(--glass2); }
        .t-acc-hdr {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 26px 34px;
          cursor: pointer;
          transition: background 0.25s;
          user-select: none;
        }
        .t-acc-hdr:hover { background: var(--glass2); }
        .t-acc-hdr-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .t-acc-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-weight: 300;
          color: var(--text-dim);
          min-width: 28px;
        }
        .t-acc-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: var(--glass2);
          border: 1px solid var(--gborder2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.88rem;
          color: var(--accent2);
          transition: all 0.3s;
        }
        .t-acc-item.open .t-acc-icon-wrap {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
        }
        .t-acc-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 600;
        }
        .t-acc-toggle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--glass3);
          border: 1px solid var(--gborder2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          color: var(--text-dim);
          flex-shrink: 0;
          transition: all 0.35s ease;
        }
        .t-acc-item.open .t-acc-toggle {
          transform: rotate(45deg);
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }
        .t-acc-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.42s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .t-acc-item.open .t-acc-body { grid-template-rows: 1fr; }
        .t-acc-body-inner {
          overflow: hidden;
          padding: 0 34px 0 80px;
        }
        .t-acc-item.open .t-acc-body-inner { padding-bottom: 30px; }
        .t-acc-body-inner p {
          font-size: 0.86rem;
          line-height: 1.9;
          color: var(--text-dim);
          margin-bottom: 20px;
        }
        .t-acc-skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .t-skill-tag {
          background: var(--glass);
          border: 1px solid var(--gborder2);
          border-radius: 99px;
          padding: 5px 14px;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-dim);
          backdrop-filter: blur(10px);
          transition: all 0.28s;
        }
        .t-skill-tag:hover { border-color: var(--accent3); color: var(--accent3); }

        /* SERVICES GRID */
        .t-svc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .t-svc-card {
          background: var(--glass);
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
          border: 1px solid var(--gborder);
          border-radius: 22px;
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
          transition: all 0.42s ease;
        }
        .t-svc-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 22px;
          background: radial-gradient(ellipse 80% 55% at 50% 0%, rgba(139,92,246,0.07) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }
        .t-svc-card:hover::before { opacity: 1; }
        .t-svc-card:hover {
          border-color: rgba(139, 92, 246, 0.32);
          transform: translateY(-6px);
          box-shadow: 0 24px 60px var(--shadow);
        }
        .t-svc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .t-svc-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 300;
          color: var(--text-dim);
        }
        .t-svc-icon {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          background: var(--glass2);
          border: 1px solid var(--gborder2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: var(--accent2);
          transition: all 0.3s;
        }
        .t-svc-card:hover .t-svc-icon {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }
        .t-svc-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 12px;
          line-height: 1.25;
        }
        .t-svc-desc {
          font-size: 0.78rem;
          line-height: 1.82;
          color: var(--text-dim);
          margin-bottom: 20px;
        }
        .t-svc-tags { display: flex; flex-wrap: wrap; gap: 7px; }
        .t-svc-tags span {
          background: var(--glass);
          border: 1px solid var(--gborder);
          border-radius: 99px;
          padding: 4px 12px;
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-dim);
        }

        /* TOOLS */
        .t-tools-cats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .t-tool-cat {
          background: var(--glass);
          border: 1px solid var(--gborder);
          border-radius: 22px;
          padding: 32px 28px;
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
        }
        .t-tool-cat-hdr {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent2);
        }
        .t-tool-cat-hdr i { font-size: 0.9rem; }
        .t-tool-list { display: flex; flex-direction: column; gap: 11px; }
        .t-tool-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 11px;
          background: var(--glass2);
          border: 1px solid var(--gborder);
          font-size: 0.78rem;
          font-weight: 500;
          transition: all 0.28s ease;
        }
        .t-tool-item:hover {
          border-color: var(--gborder2);
          background: var(--glass3);
          transform: translateX(4px);
        }
        .t-tool-item i { font-size: 1rem; width: 18px; text-align: center; }
        .t-ti-html  { color: #e44d26; }
        .t-ti-css   { color: #264de4; }
        .t-ti-js    { color: #f7df1e; }
        .t-ti-react { color: #61dbfb; }
        .t-ti-next  { color: var(--text); }
        .t-ti-git   { color: #f1502f; }
        .t-ti-dav   { color: #c8d8e8; }
        .t-ti-ae    { color: #9999ff; }
        .t-ti-pr    { color: #9999ff; }
        .t-ti-cc    { color: #00f2ea; }
        .t-ti-ai    { color: #ff9a00; }
        .t-ti-ps    { color: #31a8ff; }
        .t-ti-canva { color: #00c4cc; }
        .t-ti-fig   { color: var(--accent2); }
        .t-ti-obs    { color: #a0bfff; }
        .t-ti-vmix   { color: #ffb347; }
        .t-ti-vdeck  { color: #7ed6df; }
        .t-ti-overlay { color: var(--accent3); }

        /* PHILOSOPHY */
        .t-philosophy {
          border-top: 1px solid var(--border);
          padding: 100px 80px;
        }
        .t-philosophy-glass {
          background: var(--glass);
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
          border: 1px solid var(--gborder);
          border-radius: 28px;
          position: relative;
          overflow: hidden;
        }
        .t-philo-glow {
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          height: 260px;
          background: radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .t-philosophy-glass::after {
          content: '';
          position: absolute;
          top: 0;
          left: 15%;
          right: 15%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.45), transparent);
        }
        .t-philo-inner {
          position: relative;
          z-index: 1;
          padding: 70px 100px;
          text-align: center;
        }
        .t-philo-label {
          display: inline-block;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent2);
          margin-bottom: 28px;
        }
        .t-philo-quote {
          position: relative;
          padding: 0 40px;
          margin-bottom: 44px;
        }
        .t-quote-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 5rem;
          line-height: 0.5;
          color: var(--accent);
          opacity: 0.35;
          display: block;
          font-style: italic;
        }
        .t-qm-close { text-align: right; }
        .t-philo-quote p {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 2.5vw, 2rem);
          font-weight: 400;
          font-style: italic;
          line-height: 1.65;
          color: var(--text);
          max-width: 680px;
          margin: 0 auto;
        }
        .t-philo-sig {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .t-philo-sig-line { width: 40px; height: 1px; background: var(--border2); }
        .t-philo-name {
          font-family: 'Dancing Script', cursive;
          font-size: 1.4rem;
          color: var(--text);
        }
        .t-philo-aka {
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent2);
        }

        /* CTA */
        .t-cta-section { padding: 0 80px 100px; }
        .t-cta-glass {
          background: var(--glass);
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
          border: 1px solid var(--gborder);
          border-radius: 28px;
          padding: 70px 80px;
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .t-cta-glow {
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 420px;
          height: 220px;
          background: radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .t-cta-glass::after {
          content: '';
          position: absolute;
          top: 0;
          left: 15%;
          right: 15%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent);
        }
        .t-cta-eyebrow {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent2);
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .t-cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 5vw, 4.2rem);
          font-weight: 300;
          line-height: 1.05;
          margin-bottom: 18px;
          position: relative;
          z-index: 1;
        }
        .t-cta-title em { font-style: italic; color: var(--text-dim); }
        .t-cta-desc {
          font-size: 0.88rem;
          color: var(--text-dim);
          max-width: 480px;
          margin: 0 auto 36px;
          line-height: 1.82;
          position: relative;
          z-index: 1;
        }
        .t-cta-btns {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }
        .btn-cta-main {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 99px;
          padding: 15px 38px;
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: all 0.35s ease;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(139,92,246,0.38);
        }
        .btn-cta-main:hover { background: var(--accent2); transform: scale(1.06); box-shadow: 0 14px 44px rgba(139,92,246,0.48); }
        .btn-cta-sec {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--glass2);
          color: var(--text);
          border: 1px solid var(--gborder2);
          border-radius: 99px;
          padding: 15px 32px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: all 0.35s ease;
          cursor: pointer;
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
        }
        .btn-cta-sec:hover { border-color: var(--accent2); color: var(--accent2); transform: scale(1.04); }

        /* SIMPLE FOOTER */
        .t-site-footer {
          background: var(--bg2);
          padding: 28px 80px;
          border-top: 1px solid var(--border);
        }
        .t-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }
        .t-footer-copy { font-size: 0.72rem; color: var(--text-dim); }
        .t-footer-socials { display: flex; gap: 10px; }
        .t-f-soc-link {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--glass);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          font-size: 0.82rem;
          transition: all 0.3s;
          text-decoration: none;
        }
        .t-f-soc-link:hover { border-color: var(--accent2); color: var(--accent2); transform: translateY(-2px); }
        .t-footer-top-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-dim);
          background: none;
          border: none;
          transition: color 0.3s;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
        }
        .t-footer-top-btn:hover { color: var(--text); }

        /* CERTIF GALLERY */
        @keyframes tcModalIn { from{opacity:0}to{opacity:1} }
        @keyframes tcImgIn   { from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)} }

        .tc-gal-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 18px;
        }
        .tc-gal-item {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: var(--bg3);
          border: 1px solid var(--border);
          transition: transform 0.4s ease, border-color 0.4s ease;
          cursor: pointer;
        }
        .tc-gal-item:hover { transform: translateY(-6px); border-color: rgba(139,92,246,0.38); }
        .tc-gal-half  { grid-column: span 3; aspect-ratio: 4/3; }
        .tc-gal-third { grid-column: span 2; aspect-ratio: 4/3; }
        .tc-gal-item img { width:100%; height:100%; object-fit:cover; transition:transform 0.6s ease; display:block; }
        .tc-gal-item:hover img { transform: scale(1.05); }
        .tc-gal-caption {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 14px 18px;
          background: linear-gradient(to top, rgba(7,7,9,0.82) 0%, transparent 100%);
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          pointer-events: none;
        }
        .tc-gal-filename {
          position: absolute;
          top: 12px; left: 14px;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.65);
          pointer-events: none;
          font-family: 'Outfit', monospace;
        }
        .tc-gal-ph {
          width:100%; height:100%;
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px;
          background: linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%);
          color: var(--text-dim);
          font-size: 0.62rem; letter-spacing:0.18em; text-transform:uppercase;
          min-height: 180px;
        }
        .tc-gal-ph i { font-size:2rem; opacity:0.18; }
        .tc-gal-zoom {
          position: absolute;
          top: 12px; right: 14px;
          width: 34px; height: 34px;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.7);
          font-size: 0.72rem;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .tc-gal-item:hover .tc-gal-zoom { opacity: 1; }

        @media (max-width: 1200px) {
          .tc-gal-grid { grid-template-columns: repeat(4,1fr); }
          .tc-gal-half  { grid-column: span 2; }
          .tc-gal-third { grid-column: span 2; }
        }
        @media (max-width: 768px) {
          .tc-gal-grid { grid-template-columns: repeat(2,1fr); }
          .tc-gal-half  { grid-column: span 2; }
          .tc-gal-third { grid-column: span 1; }
        }

        /* RESPONSIVE */
        @media (max-width: 1200px) {
          .t-intro-grid { grid-template-columns: 320px 1fr; gap: 60px; }
          .t-svc-grid { grid-template-columns: repeat(2, 1fr); }
          .t-tools-cats { grid-template-columns: repeat(2, 1fr); }
          .t-svc-grid-6 { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 1024px) {
          .t-page-header { padding: 120px 40px 60px; }
          .t-page-header::after { left: 40px; right: 40px; }
          .t-section { padding: 80px 40px; }
          .t-numbers-bar { margin: 0 40px; padding: 34px 40px; }
          .t-philosophy { padding: 80px 40px; }
          .t-philo-inner { padding: 55px 60px; }
          .t-cta-section { padding: 0 40px 80px; }
          .t-site-footer { padding: 24px 40px; }
          .t-intro-grid { grid-template-columns: 1fr; gap: 50px; }
          .t-photo-wrap { position: static; flex-direction: row; align-items: center; }
          .t-photo-glass { width: 240px; flex-shrink: 0; aspect-ratio: 3/4; }
          .t-photo-glow { display: none; }
        }
        @media (max-width: 768px) {
          .t-page-header { padding: 110px 24px 55px; }
          .t-page-header::after { left: 24px; right: 24px; }
          .t-section { padding: 60px 24px; }
          .t-numbers-bar { margin: 0 24px; padding: 28px 20px; flex-wrap: wrap; gap: 24px; }
          .t-num-line { display: none; }
          .t-intro-grid { grid-template-columns: 1fr; }
          .t-photo-wrap { flex-direction: column; }
          .t-photo-glass { width: 100%; max-width: 320px; }
          .t-intro-info-grid { grid-template-columns: 1fr; }
          .t-acc-hdr { padding: 20px 22px; }
          .t-acc-body-inner { padding: 0 22px; }
          .t-acc-item.open .t-acc-body-inner { padding-bottom: 24px; }
          .t-svc-grid { grid-template-columns: 1fr; }
          .t-tools-cats { grid-template-columns: 1fr; }
          .t-philosophy { padding: 60px 24px; }
          .t-philo-inner { padding: 40px 28px; }
          .t-philo-quote { padding: 0; }
          .t-cta-section { padding: 0 24px 70px; }
          .t-cta-glass { padding: 44px 28px; }
          .t-site-footer { padding: 22px 24px; }
          .t-footer-bottom { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <div className="t-page-header">
        <div className="t-page-header-bg"></div>
        <div className="t-page-header-content">
          <span className="page-label reveal">{tx("pageLabel", "TENTANG SAYA")}</span>
          <h1 className="t-page-title reveal rv-d1">
            <em>{tx("pageTitle", "Aldo ")}</em>
            {tx("pageTitleB", "Leo Saputra.")}
          </h1>
          <p className="t-page-sub reveal rv-d2">
            {tx("pageSub", "Kreator digital multidisiplin dari Jawa Timur, Indonesia.")}
          </p>
        </div>
      </div>

      {/* ── INTRO SECTION ── */}
      <section className="t-section t-intro">
        <div className="t-intro-grid">
          {/* PHOTO */}
          <div className="t-photo-col reveal">
            <div className="t-photo-wrap">
              <div className="t-photo-glow"></div>
              <div className="t-photo-glass">
                {imgError ? (
                  <div className="t-photo-initials">AL</div>
                ) : (
                  <img
                    src="/assets/img/bg1.jpg"
                    alt="Aldo Leo Saputra"
                    className="t-photo-img"
                    onError={() => setImgError(true)}
                  />
                )}
              </div>
              <div className="t-photo-badge">
                <span className="t-badge-dot"></span>
                <span>{tx("badgeAvail", "Tersedia untuk proyek baru")}</span>
              </div>
              <div className="t-social-float">
                <a
                  href="https://github.com/SynnnW"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-soc-btn"
                  aria-label="GitHub"
                >
                  <i className="fa-brands fa-github"></i>
                </a>
                <a
                  href="https://www.instagram.com/aldosynnn?igsh=MWNhYTdzaWQyOGkwaA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-soc-btn"
                  aria-label="Instagram"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>

          {/* TEXT */}
          <div className="t-intro-text-col">
            <div className="reveal">
              <span className="t-sec-label">{tx("label01t", "01 / Perkenalan")}</span>
              <h2 className="t-sec-title">
                {tx("introTitle", "Siapakah ")}<em>{tx("introEm", "Saya?")}</em>
              </h2>
            </div>
            <div className="reveal rv-d1">
              <p className="t-intro-lead">
                {tx("introLead", "Kreator digital multidisiplin yang berfokus pada karya yang bermakna dan berdampak nyata.")}
              </p>
              <p className="t-intro-body">
                {tx("introBody1", "Saya adalah Aldo Leo Saputra — seorang kreator digital yang berbasis di Jawa Timur, Indonesia. Dengan pengalaman yang mencakup pengembangan web premium, produksi video, ilustrasi, dan fotografi, saya percaya bahwa setiap proyek adalah sebuah cerita yang menunggu untuk diceritakan dengan cara yang paling kuat.")}
              </p>
              <p className="t-intro-body">
                {tx("introBody2", "Filosofi saya sederhana: mengerjakan proyekmu seolah itu milikku. Ini bukan sekadar slogan — ini adalah standar dedikasi yang saya bawa ke setiap piksel, setiap frame, dan setiap baris kode yang saya hasilkan.")}
              </p>
            </div>
            <div className="t-intro-info-grid reveal rv-d2">
              <div className="t-info-item">
                <span className="t-info-label">{tx("infoBase", "Berbasis di")}</span>
                <span className="t-info-val">Probolinggo, Jawa Timur</span>
              </div>
              <div className="t-info-item">
                <span className="t-info-label">{tx("infoLang", "Bahasa")}</span>
                <span className="t-info-val">Indonesia, English</span>
              </div>
              <div className="t-info-item">
                <span className="t-info-label">{tx("infoFocus", "Fokus")}</span>
                <span className="t-info-val">{tx("infoFocusVal", "Web & Visual Creative")}</span>
              </div>
              <div className="t-info-item">
                <span className="t-info-label">{tx("infoStatus", "Status")}</span>
                <span className="t-info-val t-status-open">
                  {tx("infoStatusVal", "Terbuka untuk kolaborasi")}
                </span>
              </div>
            </div>
            <div className="reveal rv-d3">
              <button className="t-btn-contact" onClick={() => goTo("/contact")}>
                <span>{tx("contactMe", "Hubungi Saya")}</span>
                <i className="fa-solid fa-arrow-up-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── NUMBERS BAR ── */}
      <div className="t-numbers-bar reveal">
        <div className="t-num-item">
          <span className="t-num-val">3+</span>
          <span className="t-num-label">{tx("num1", "Tahun Berkarya")}</span>
        </div>
        <div className="t-num-line"></div>
        <div className="t-num-item">
          <span className="t-num-val">20+</span>
          <span className="t-num-label">{tx("num2", "Proyek Selesai")}</span>
        </div>
        <div className="t-num-line"></div>
        <div className="t-num-item">
          <span className="t-num-val">4</span>
          <span className="t-num-label">{tx("num3", "Disiplin Ilmu")}</span>
        </div>
        <div className="t-num-line"></div>
        <div className="t-num-item">
          <span className="t-num-val">100%</span>
          <span className="t-num-label">{tx("num4", "Dedikasi")}</span>
        </div>
      </div>

      {/* ── CERTIF GALLERY ── */}
      <section className="t-section">
        <span className="t-sec-label reveal">{tx("certLabel", "02 / Sertifikasi & Pencapaian")}</span>
        <h2 className="t-sec-title reveal rv-d1">
          {tx("certTitle", "Bukti ")}<em>{tx("certEm", "Perjalanan.")}</em>
        </h2>
        <div className="tc-gal-grid reveal rv-d2">
          {CERTIF_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`tc-gal-item ${item.cls}`}
              onClick={() => !certErrors[i] && setCertModal({ src: item.src, filename: item.filename })}
              title={item.desc}
            >
              {certErrors[i] ? (
                <div className="tc-gal-ph">
                  <i className="fa-solid fa-file-certificate" />
                  <span>{item.filename}</span>
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  onError={() => setCertErrors((p) => ({ ...p, [i]: true }))}
                />
              )}
              <div className="tc-gal-filename">{item.filename}</div>
              <div className="tc-gal-caption">{item.caption}</div>
              <div className="tc-gal-zoom"><i className="fa-solid fa-magnifying-glass" /></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERTISE / ACCORDION ── */}
      <section className="t-section t-expertise">
        <span className="t-sec-label reveal">{tx("label02t", "03 / Keahlian")}</span>
        <h2 className="t-sec-title reveal rv-d1">
          {tx("expTitle", "Apa yang ")}<em>{tx("expEm", "Saya Kuasai.")}</em>
        </h2>
        <div className="t-acc-list">
          {ACCORDION_ITEMS.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openAcc === item.id}
              onToggle={() => handleAccToggle(item.id)}
              t={t}
            />
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="t-section t-services">
        <span className="t-sec-label reveal">{tx("label03t", "04 / Layanan")}</span>
        <h2 className="t-sec-title reveal rv-d1">
          {tx("svcTitle", "Yang Bisa Saya ")}<em>{tx("svcEm", "Kerjakan.")}</em>
        </h2>
        <div className="t-svc-grid">
          {SERVICES.map((svc, i) => (
            <div
              key={svc.num}
              className={`t-svc-card reveal${i % 3 === 1 ? " rv-d1" : i % 3 === 2 ? " rv-d2" : ""}`}
            >
              <div className="t-svc-header">
                <div className="t-svc-num">{svc.num}</div>
                <div className="t-svc-icon">
                  <i className={svc.icon}></i>
                </div>
              </div>
              <h3 className="t-svc-title">{tx(svc.titleKey, svc.titleDefault)}</h3>
              <p className="t-svc-desc">{tx(svc.descKey, svc.descDefault)}</p>
              <div className="t-svc-tags">
                {svc.tags.map((tag, j) => (
                  <span key={j}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section className="t-section t-tools">
        <span className="t-sec-label reveal">{tx("label04t", "05 / Peralatan")}</span>
        <h2 className="t-sec-title reveal rv-d1">
          {tx("toolTitle", "Senjata ")}<em>{tx("toolEm", "Andalan.")}</em>
        </h2>
        <div className="t-tools-cats reveal rv-d2">
          {TOOLS.map((cat) => (
            <div key={cat.catKey} className="t-tool-cat">
              <div className="t-tool-cat-hdr">
                <i className={cat.catIcon}></i>
                <span>{tx(cat.catKey, cat.catLabel)}</span>
              </div>
              <div className="t-tool-list">
                {cat.items.map((item, i) => (
                  <div key={i} className="t-tool-item">
                    <i className={`${item.icon} ${item.cls}`}></i>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="t-philosophy">
        <div className="t-philosophy-glass reveal">
          <div className="t-philo-glow"></div>
          <div className="t-philo-inner">
            <span className="t-philo-label">{tx("philoLabel", "Filosofi")}</span>
            <blockquote className="t-philo-quote">
              <span className="t-quote-mark">"</span>
              <p>
                {tx(
                  "philoQuote",
                  "Mengerjakan proyekmu seolah itu milikku — karena saya percaya bahwa standar terbaik lahir dari rasa memiliki yang sesungguhnya terhadap setiap karya yang kita hasilkan."
                )}
              </p>
              <span className="t-quote-mark t-qm-close">"</span>
            </blockquote>
            <div className="t-philo-sig">
              <div className="t-philo-sig-line"></div>
              <span className="t-philo-name">Aldo Leo Saputra</span>
              <span className="t-philo-aka">{tx("philoAka", "aka SynnnW")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="t-cta-section reveal">
        <div className="t-cta-glass">
          <div className="t-cta-glow"></div>
          <p className="t-cta-eyebrow">{tx("ctaEyebrow", "Punya proyek yang ingin dikerjakan?")}</p>
          <h3 className="t-cta-title">
            {tx("ctaTitle", "Mari berkolaborasi")}
            <br />
            <em>{tx("ctaTitleEm", "dan ciptakan sesuatu.")}</em>
          </h3>
          <p className="t-cta-desc">
            {tx(
              "ctaDesc",
              "Ceritakan visi Anda kepada saya. Bersama, kita akan mengubahnya menjadi kenyataan yang luar biasa — satu piksel, satu frame, satu baris kode pada satu waktu."
            )}
          </p>
          <div className="t-cta-btns">
            <button className="btn-cta-main" onClick={() => goTo("/contact")}>
              <span>{tx("ctaBtn", "Mulai Proyek Sekarang")}</span>
              <i className="fa-solid fa-arrow-up-right"></i>
            </button>
            <button className="btn-cta-sec" onClick={() => goTo("/porto")}>
              <span>{tx("ctaBtnSec", "Lihat Portofolio")}</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="t-site-footer">
        <div className="t-footer-bottom">
          <span className="t-footer-copy">© 2026 Aldo Leo Saputra</span>
          <div className="t-footer-socials">
            <a
              href="https://github.com/SynnnW"
              target="_blank"
              rel="noopener noreferrer"
              className="t-f-soc-link"
              aria-label="GitHub"
            >
              <i className="fa-brands fa-github"></i>
            </a>
            <a
              href="https://www.instagram.com/aldosynnn?igsh=MWNhYTdzaWQyOGkwaA=="
              target="_blank"
              rel="noopener noreferrer"
              className="t-f-soc-link"
              aria-label="Instagram"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
          <button className="t-footer-top-btn" onClick={scrollTop}>
            <i className="fa-solid fa-arrow-up"></i>
            <span>{tx("backTop", "Ke atas")}</span>
          </button>
        </div>
      </footer>

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