import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function JournalKarya1({ t = {} }) {
  const navigate  = useNavigate();
  const revealEls = useRef([]);
  const [copied, setCopied]  = useState(false);

  const r = (el) => {
    if (el && !revealEls.current.includes(el)) revealEls.current.push(el);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    const id = setTimeout(() => {
      revealEls.current.forEach((el) => { if (el) observer.observe(el); });
    }, 50);
    return () => { clearTimeout(id); observer.disconnect(); };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <style>{CSS}</style>

      <div className="k1-page">

        {/* ── Breadcrumb ── */}
        <div className="k1-breadcrumb-wrap">
          <nav className="k1-breadcrumb">
            <button className="k1-bc-link" onClick={() => navigate('/')}>Home</button>
            <span className="k1-bc-sep">/</span>
            <button className="k1-bc-link" onClick={() => navigate('/journal')}>Journal</button>
            <span className="k1-bc-sep">/</span>
            <span className="k1-bc-cur">FiSS 2024</span>
          </nav>
        </div>

        {/* ── Hero ── */}
        <div className="k1-hero">
          <div className="k1-hero-badge">Article</div>
          <h1 className="k1-hero-title">
            FiSS 2024 : Screening Film Pelajar Pertama di Probolinggo
          </h1>
          <div className="k1-hero-meta">
            <div className="k1-meta-item">
              <span className="k1-meta-label">Author</span>
              <span className="k1-meta-value">Wadilah Callysta Widya Dhana</span>
            </div>
            <div className="k1-meta-item">
              <span className="k1-meta-label">Coordinator</span>
              <span className="k1-meta-value">Aldo Leo Saputra</span>
            </div>
            <div className="k1-meta-item">
              <span className="k1-meta-label">Date</span>
              <span className="k1-meta-value">26 Oktober 2024</span>
            </div>
            <div className="k1-meta-item">
              <span className="k1-meta-label">Location</span>
              <span className="k1-meta-value">Klinik Tjipluk, Kraksaan</span>
            </div>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div className="k1-container">

          {/* ══ ARTICLE BODY ══ */}
          <article className="k1-article-body">

            <p ref={r} className="article-text reveal">
              Probolinggo – FiSS (Film School Screening) bertajuk <em>Ngobrol Tentrem Tentang Film</em> ini sukses digelar oleh Ekstrakurikuler Sinematografi SMAN 1 Kraksaan pada Sabtu (26/10/2024), bertempat di Klinik Tjipluk, Kraksaan, Kabupaten Probolinggo. Acara yang berlangsung mulai pukul 15.00 WIB hingga 21.00 WIB ini bertujuan menciptakan ruang bagi pelajar pegiat film untuk berdiskusi mendalam mengenai film dan bertukar ide kreatif serta menciptakan iklim kolaboratif antar sineas muda Probolinggo.
            </p>

            <figure ref={r} className="article-figure reveal rv-d1">
              <div className="figure-glass-container">
                <ArticleImg src="/assets/img/lapan.jpg" alt="Dokumentasi Kegiatan FiSS 2024 - Sesi Pembukaan" />
              </div>
              <figcaption className="figure-caption">Dokumentasi Kegiatan FiSS 2024 - Sesi Pembukaan</figcaption>
            </figure>

            <p ref={r} className="article-text reveal">
              Kegiatan ini mengundang sepuluh sekolah dari berbagai wilayah di Kabupaten dan Kota Probolinggo, termasuk SMA Negeri 1 Kraksaan, SMA Negeri 1 Gading, SMA Negeri 1 Leces, SMA Negeri 1 Tiris, SMA Negeri 1 Wonomerto, SMA Negeri 1 Sumber, SMA Negeri 1 Lumbang, SMA Negeri 1 Pajarakan, dan SMA Negeri 2 Probolinggo. Para peserta diberi kesempatan untuk mempertontonkan karya film mereka yang telah diproduksi selama ekstrakurikuler.
            </p>

            <figure ref={r} className="article-figure reveal rv-d1">
              <div className="figure-glass-container">
                <ArticleImg src="/assets/img/sembilan.jpg" alt="Para Peserta FiSS 2024 dari Berbagai Sekolah" />
              </div>
              <figcaption className="figure-caption">Para Peserta FiSS 2024 dari Berbagai Sekolah</figcaption>
            </figure>

            <h2 ref={r} className="article-subheading reveal">Pesan dan Inspirasi dari Para Pembicara</h2>

            <p ref={r} className="article-text reveal">
              Acara ini juga menghadirkan pembicara-pembicara inspiratif yang memberikan wawasan mendalam tentang dunia perfilman. Salah satu pembicara utama adalah Bapak Adib, yang berbagi filosofi tentang peran seorang seniman.
            </p>

            <blockquote ref={r} className="glass-blockquote reveal rv-d1">
              <p className="blockquote-text">
                "Sejak kalian memutuskan untuk menjadi seorang sineas muda. Maka sejak saat itu juga kalian adalah seorang seniman. Napas seorang seniman ada pada karya-karyanya. Berhenti berkarya sama halnya berhenti bernapas dan berhenti berkarya sama halnya dengan matinya seorang seniman itu sendiri"
              </p>
              <footer className="blockquote-footer">— Bapak Adib</footer>
            </blockquote>

            <figure ref={r} className="article-figure reveal rv-d1">
              <div className="figure-glass-container">
                <ArticleImg src="/assets/img/Adib.jpg" alt="Sesi Diskusi dan Tanya Jawab dengan Para Pembicara" />
              </div>
              <figcaption className="figure-caption">Sesi Diskusi dan Tanya Jawab dengan Para Pembicara</figcaption>
            </figure>

            <p ref={r} className="article-text reveal">
              Pembicara kedua, Bapak Misbahul, menekankan pentingnya keberlanjutan acara serupa di masa depan dan mengharapkan partisipasi dari sekolah-sekolah lain sebagai penyelenggara.
            </p>

            <blockquote ref={r} className="glass-blockquote reveal rv-d1">
              <p className="blockquote-text">
                "Ini merupakan acara pertama kali diadakan di Probolinggo untuk setingkat pelajar. Saya berharap acara ini dapat berlanjut di tahun-tahun selanjutnya, tidak harus MATURA yang menjadi penyelenggara, bisa dari sekolah-sekolah yang lain juga"
              </p>
              <footer className="blockquote-footer">— Bapak Misbahul</footer>
            </blockquote>

            <figure ref={r} className="article-figure reveal rv-d1">
              <div className="figure-glass-container">
                <ArticleImg src="/assets/img/sepuluh.jpg" alt="Penampilan Film-Film Peserta di FiSS 2024" />
              </div>
              <figcaption className="figure-caption">Penampilan Film-Film Peserta di FiSS 2024</figcaption>
            </figure>

            <h2 ref={r} className="article-subheading reveal">Highlight dan Pencapaian Acara</h2>

            <p ref={r} className="article-text reveal">
              Sepanjang acara berlangsung, antusiasme peserta sangat tinggi. Berbagai film yang ditampilkan mencerminkan kreativitas dan inovasi dari para sineas muda Probolinggo. Mulai dari film dokumenter, eksperimental, hingga film pendek naratif, semuanya menjadi bagian dari kesuksesan FiSS 2024. Diskusi yang terjadi setelah setiap pemutaran film menunjukkan komitmen peserta dalam memberikan feedback konstruktif dan saling belajar dari pengalaman satu sama lain.
            </p>

            <h2 ref={r} className="article-subheading reveal">Video Dokumentasi</h2>

            <div ref={r} className="glass-video-container reveal rv-d1">
              <iframe
                width="100%"
                style={{ aspectRatio: '16/9', borderRadius: '12px', display: 'block' }}
                src="https://www.youtube.com/embed/AsM_KnHh-M4"
                title="FiSS 2024 Video Dokumentasi"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p ref={r} className="article-text reveal">
              Video dokumentasi di atas menampilkan beberapa momen penting dari FiSS 2024, termasuk pembukaan acara, pemutaran film, sesi diskusi, dan testimonial dari para peserta dan pembicara. Dokumentasi ini menjadi memori berharga bagi semua yang terlibat dalam acara ini.
            </p>

            <h2 ref={r} className="article-subheading reveal">Kesimpulan</h2>

            <p ref={r} className="article-text reveal">
              FiSS 2024 telah membuktikan bahwa komunitas sineas muda di Probolinggo memiliki potensi yang luar biasa. Acara ini bukan hanya sekadar ajang pameran karya, tetapi juga menjadi wadah kolaborasi, inspirasi, dan pertumbuhan bersama. Semoga acara seperti ini dapat terus berlanjut dan berkembang di tahun-tahun mendatang, menciptakan ekosistem film yang semakin kuat dan kreatif di wilayah Probolinggo.
            </p>

            <figure ref={r} className="article-figure reveal rv-d1">
              <div className="figure-glass-container">
                <ArticleImg src="/assets/img/sebelas.jpg" alt="Foto Bersama Peserta dan Panitia FiSS 2024" />
              </div>
              <figcaption className="figure-caption">Foto Bersama Peserta dan Panitia FiSS 2024</figcaption>
            </figure>

            {/* Sumber */}
            <div ref={r} className="source-container reveal">
              <a
                href="https://sman1kraksaan.sch.id/fiss-2024-screening-film-pelajar-pertama-di-probolinggo"
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                <i className="fa-solid fa-arrow-up-right" /> {t.jk1ReadOriginal}
              </a>
            </div>

          </article>

          {/* ══ SIDEBAR ══ */}
          <aside ref={r} className="k1-sidebar reveal">

            {/* Widget 1 — Info */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Article Information</h3>
              <div className="widget-body">
                {[
                  { label: 'Author',      val: 'Wadilah Callysta Widya Dhana' },
                  { label: 'Coordinator', val: 'Aldo Leo Saputra' },
                  { label: 'Date',        val: '26 Oktober 2024' },
                  { label: 'Location',    val: 'Klinik Tjipluk, Kraksaan' },
                  { label: 'Category',    val: 'Event Report' },
                ].map(({ label, val }) => (
                  <div key={label} className="info-item">
                    <span className="info-label">{label}</span>
                    <span className="info-value">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 2 — Related Links */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Related Links</h3>
              <ul className="related-links">
                <li><button className="rel-link-btn" onClick={() => navigate('/journal')}>{t.jk1BackJournal}</button></li>
                <li><button className="rel-link-btn" onClick={() => navigate('/porto')}>{t.jk1ViewPortfolio}</button></li>
                <li><button className="rel-link-btn" onClick={() => navigate('/contact')}>Get In Touch</button></li>
              </ul>
            </div>

            {/* Widget 3 — Share */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Share Article</h3>
              <div className="share-buttons">
                {/* Twitter/X */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="share-btn" title="Share on Twitter"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="share-btn" title="Share on LinkedIn"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><path d="M2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
                {/* Copy Link */}
                <button className="share-btn" title="Copy Link" onClick={handleCopy}>
                  {copied
                    ? <i className="fa-solid fa-check" style={{ color: 'var(--accent2)', fontSize: '0.8rem' }} />
                    : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                      </svg>
                  }
                </button>
              </div>
              {copied && <p className="copy-feedback">{t.jk1CopyFeedback}</p>}
            </div>

          </aside>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="k1-footer">
        <div className="k1-footer-inner">
          <div className="k1-footer-col">
            <p className="k1-footer-brand">SynnnW</p>
            <p className="k1-footer-desc">{t.jk1FooterDesc}</p>
          </div>
          <div className="k1-footer-col">
            <h4 className="k1-footer-heading">Quick Links</h4>
            <ul className="k1-footer-links">
              {[[['Home','/'],['Portfolio','/porto'],['Journal','/journal'],[t.navAbout,'/tentang']]].map(([label, path]) => (
                <li key={label}><button className="k1-footer-link-btn" onClick={() => navigate(path)}>{label}</button></li>
              ))}
            </ul>
          </div>
          <div className="k1-footer-col">
            <h4 className="k1-footer-heading">Follow Me</h4>
            <ul className="k1-footer-links">
              <li><a href="https://www.instagram.com/aldosynnn?igsh=MWNhYTdzaWQyOGkwaA==" target="_blank" rel="noopener">Instagram</a></li>
              <li><a href="https://github.com/SynnnW" target="_blank" rel="noopener">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="k1-footer-bottom">
          <span>{t.footerCopy}. All rights reserved.</span>
          <button className="footer-top-btn" onClick={scrollTop}>
            <i className="fa-solid fa-arrow-up" /> {t.portoFooterTop}
          </button>
        </div>
      </footer>
    </>
  );
}

/* ─────────────────────────────────────────
   Sub-component: image with error fallback
───────────────────────────────────────── */
function ArticleImg({ src, alt }) {
  const [err, setErr] = useState(false);
  if (err) return (
    <div className="figure-placeholder">
      <i className="fa-regular fa-image" />
      <span>Foto</span>
    </div>
  );
  return <img className="figure-img" src={src} alt={alt} onError={() => setErr(true)} />;
}

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const CSS = `
/* Reveal */
.reveal { opacity:0; transform:translateY(38px); transition:opacity 0.82s ease, transform 0.82s ease; }
.reveal.visible { opacity:1; transform:translateY(0); }
.rv-d1 { transition-delay:0.12s; }
.rv-d2 { transition-delay:0.24s; }

.k1-page { padding-top: 76px; }

/* Breadcrumb */
.k1-breadcrumb-wrap {
  padding: 24px 80px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
}
.k1-breadcrumb {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.74rem; color: var(--text-dim);
}
.k1-bc-link {
  background: none; border: none; font-family: 'Outfit', sans-serif;
  font-size: 0.74rem; color: var(--text-dim);
  cursor: pointer; padding: 0; transition: color 0.2s;
}
.k1-bc-link:hover { color: var(--accent2); }
.k1-bc-sep { color: var(--text-dim); opacity: 0.5; }
.k1-bc-cur { color: var(--text); font-weight: 600; }

/* Hero */
.k1-hero {
  padding: 60px 80px;
  background: linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%);
  border-bottom: 1px solid var(--border);
}
.k1-hero-badge {
  display: inline-block;
  background: var(--glass2);
  backdrop-filter: blur(14px);
  border: 1px solid var(--gborder2);
  border-radius: 99px; padding: 7px 20px;
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--accent2);
  margin-bottom: 26px;
}
.k1-hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 300; line-height: 1.18;
  margin-bottom: 36px; color: var(--text);
}
.k1-hero-meta {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 20px; max-width: 700px;
}
.k1-meta-item { display: flex; flex-direction: column; gap: 5px; }
.k1-meta-label {
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--text-dim);
}
.k1-meta-value { font-size: 0.85rem; color: var(--text); }

/* Layout */
.k1-container {
  display: grid; grid-template-columns: 1fr 340px;
  gap: 40px; padding: 50px 80px 100px;
  max-width: 1400px; margin: 0 auto;
}

/* Article body */
.k1-article-body { min-width: 0; }
.article-text {
  font-size: 0.95rem; line-height: 1.9;
  color: var(--text-dim); margin-bottom: 24px;
}
.article-text em { font-style: italic; color: var(--text); }
.article-subheading {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem; font-weight: 600;
  color: var(--text); margin: 40px 0 16px;
}

/* Figures */
.article-figure { margin: 32px 0; }
.figure-glass-container {
  border-radius: 16px; overflow: hidden;
  border: 1px solid var(--border); background: var(--bg3);
}
.figure-img {
  width: 100%; height: auto; display: block;
  aspect-ratio: 16/9; object-fit: cover;
  transition: transform 0.45s ease;
  -webkit-user-drag: none;
}
.figure-glass-container:hover .figure-img { transform: scale(1.03); }
.figure-placeholder {
  width: 100%; aspect-ratio: 16/9;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 10px;
  background: linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%);
  color: var(--text-dim); font-size: 0.68rem;
  letter-spacing: 0.15em; text-transform: uppercase;
}
.figure-placeholder i { font-size: 2.2rem; opacity: 0.2; }
.figure-caption {
  font-size: 0.75rem; color: var(--text-dim);
  font-style: italic; text-align: center; margin-top: 10px; letter-spacing: 0.06em;
}

/* Blockquote */
.glass-blockquote {
  background: var(--glass);
  border: 1px solid var(--gborder);
  border-left: 3px solid var(--accent2);
  border-radius: 0 12px 12px 0;
  padding: 24px 28px; margin: 32px 0;
}
.blockquote-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.15rem; font-style: italic;
  line-height: 1.7; color: var(--text); margin-bottom: 12px;
}
.blockquote-footer {
  font-size: 0.75rem; color: var(--accent2); letter-spacing: 0.1em;
}

/* Video */
.glass-video-container {
  border-radius: 16px; overflow: hidden;
  border: 1px solid var(--border);
  padding: 14px;
  background: var(--glass);
  backdrop-filter: var(--blur);
  -webkit-backdrop-filter: var(--blur);
  margin: 32px 0;
}

/* Source link */
.source-container {
  margin-top: 40px; padding-top: 24px;
  border-top: 1px solid var(--border);
}
.source-link {
  display: inline-flex; align-items: center; gap: 9px;
  border: 1px solid var(--accent2); border-radius: 99px;
  padding: 10px 24px; font-size: 0.75rem;
  color: var(--accent2); text-decoration: none;
  transition: all 0.3s; font-family: 'Outfit', sans-serif;
}
.source-link:hover { background: var(--accent2); color: var(--bg); }

/* Sidebar */
.k1-sidebar { position: sticky; top: 84px; height: fit-content; }
.sidebar-widget {
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 16px; padding: 20px 22px;
  margin-bottom: 16px;
  backdrop-filter: var(--blur);
  -webkit-backdrop-filter: var(--blur);
  transition: border-color 0.3s;
}
.sidebar-widget:hover { border-color: rgba(139,92,246,0.28); }
.widget-title {
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--text-dim);
  margin-bottom: 16px; padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}
.widget-body { display: flex; flex-direction: column; }
.info-item {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 9px 0; border-bottom: 1px solid var(--border); gap: 12px;
  font-size: 0.78rem;
}
.info-item:last-child { border-bottom: none; }
.info-label { color: var(--text-dim); flex-shrink: 0; }
.info-value { color: var(--text); text-align: right; }

.related-links { list-style: none; }
.related-links li { border-bottom: 1px solid var(--border); }
.related-links li:last-child { border-bottom: none; }
.rel-link-btn {
  background: none; border: none; width: 100%;
  text-align: left; padding: 10px 0;
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem; color: var(--text-dim);
  cursor: pointer; transition: color 0.2s;
}
.rel-link-btn:hover { color: var(--accent2); }

.share-buttons { display: flex; gap: 10px; }
.share-btn {
  width: 40px; height: 40px; border-radius: 50%;
  border: 1px solid var(--border2); background: var(--glass);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-dim); cursor: pointer;
  transition: all 0.3s; text-decoration: none;
  flex-shrink: 0;
}
.share-btn:hover { border-color: var(--accent2); color: var(--accent2); transform: translateY(-2px); }
.copy-feedback {
  font-size: 0.68rem; color: var(--accent2);
  margin-top: 8px; letter-spacing: 0.1em;
}

/* Footer */
.k1-footer {
  background: var(--bg2);
  padding: 60px 80px 32px;
  border-top: 1px solid var(--border);
}
.k1-footer-inner {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 60px; margin-bottom: 36px;
}
.k1-footer-brand {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem; font-weight: 700; color: var(--text);
  margin-bottom: 8px;
}
.k1-footer-desc { font-size: 0.78rem; color: var(--text-dim); line-height: 1.6; }
.k1-footer-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem; font-weight: 600;
  color: var(--text); margin-bottom: 14px;
}
.k1-footer-links { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.k1-footer-links a,
.k1-footer-link-btn {
  font-size: 0.8rem; color: var(--text-dim);
  background: none; border: none; padding: 0;
  text-decoration: none; font-family: 'Outfit', sans-serif;
  cursor: pointer; transition: color 0.3s; text-align: left;
}
.k1-footer-links a:hover,
.k1-footer-link-btn:hover { color: var(--accent2); }
.k1-footer-bottom {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
  padding-top: 24px; border-top: 1px solid var(--border);
  font-size: 0.72rem; color: var(--text-dim);
}
.footer-top-btn {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.65rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-dim); background: none; border: none;
  cursor: pointer; transition: color 0.3s; font-family: 'Outfit', sans-serif;
}
.footer-top-btn:hover { color: var(--text); }

/* Responsive */
@media (max-width: 1024px) {
  .k1-breadcrumb-wrap { padding: 22px 40px; }
  .k1-hero { padding: 50px 40px; }
  .k1-container { padding: 44px 40px 80px; }
  .k1-footer { padding: 50px 40px 28px; }
}
@media (max-width: 768px) {
  .k1-breadcrumb-wrap { padding: 18px 24px; }
  .k1-hero { padding: 36px 24px; }
  .k1-hero-meta { grid-template-columns: 1fr; gap: 14px; }
  .k1-container { grid-template-columns: 1fr; padding: 32px 24px 70px; }
  .k1-sidebar { position: static; }
  .k1-footer { padding: 40px 24px 24px; }
  .k1-footer-inner { grid-template-columns: 1fr; gap: 28px; }
  .k1-footer-bottom { flex-direction: column; align-items: flex-start; }
}
`;