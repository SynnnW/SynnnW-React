import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SERVICES = [
  'Web Design',
  'Video Editing',
  'Ilustrasi',
  'Fotografi',
  'Videografi',
  'Motion Graphic',
];

export default function Contact({ t = {} }) {
  const navigate  = useNavigate();
  const revealEls = useRef([]);

  /* ── Form state ── */
  const [form, setForm]         = useState({ name: '', email: '', subject: '', message: '' });
  const [services, setServices] = useState([]);
  const [errors, setErrors]     = useState({});
  const [status, setStatus]     = useState('idle'); // idle | loading | success | error

  const r = (el) => {
    if (el && !revealEls.current.includes(el)) revealEls.current.push(el);
  };

  /* ── Reveal observer ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    const id = setTimeout(() => {
      revealEls.current.forEach((el) => { if (el) observer.observe(el); });
    }, 50);
    return () => { clearTimeout(id); observer.disconnect(); };
  }, []);

  /* ── Handlers ── */
  const toggleService = (svc) => {
    setServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Nama wajib diisi.';
    if (!form.email.trim())   e.email   = 'Email wajib diisi.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email tidak valid.';
    if (!form.subject.trim()) e.subject = 'Subjek wajib diisi.';
    if (!form.message.trim()) e.message = 'Pesan wajib diisi.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');

    const FORMSPREE_ID = 'xzdwbgrd';
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, services: services.join(', ') }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setForm({ name: '', email: '', subject: '', message: '' });
    setServices([]);
    setErrors({});
    setStatus('idle');
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* ─────────────────────────────────────
     RENDER
  ───────────────────────────────────── */
  return (
    <>
      <style>{CSS}</style>

      <div className="contact-page">

        {/* ══════════════════════════════
            HERO
        ══════════════════════════════ */}
        <div className="contact-hero">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-inner">
            <span ref={r} className="page-label reveal">KONTAK</span>
            <h1 ref={r} className="hero-title reveal rv-d1">
              <span>Mari</span><br />
              <em>Berkolaborasi.</em>
            </h1>
            <p ref={r} className="hero-sub reveal rv-d2">
              Punya proyek yang ingin diwujudkan? Saya siap mendengar dan menciptakan sesuatu yang luar biasa bersama Anda.
            </p>
          </div>
          <div ref={r} className="hero-scroll-hint reveal rv-d3">
            <span>Gulir ke bawah</span>
            <i className="fa-solid fa-arrow-down" />
          </div>
        </div>

        {/* ══════════════════════════════
            MAIN: LEFT + RIGHT
        ══════════════════════════════ */}
        <div className="contact-main">

          {/* ── LEFT: Info ── */}
          <div ref={r} className="contact-left reveal">

            <div className="info-block">
              <h2 className="info-heading">Informasi Kontak</h2>
              <p className="info-desc">
                Respons biasanya dalam 1–2 hari kerja. Untuk urusan mendesak, hubungi via Instagram DM.
              </p>
            </div>

            <div className="info-items">
              <a href="mailto:aldokraksaan@gmail.com" className="info-item">
                <div className="info-icon"><i className="fa-solid fa-envelope" /></div>
                <div className="info-text">
                  <span className="info-label">Email</span>
                  <span className="info-val">aldokraksaan@gmail.com</span>
                </div>
                <i className="fa-solid fa-arrow-up-right info-arrow" />
              </a>

              <a href="https://www.instagram.com/aldosynnn?igsh=MWNhYTdzaWQyOGkwaA==" target="_blank" rel="noopener" className="info-item">
                <div className="info-icon"><i className="fa-brands fa-instagram" /></div>
                <div className="info-text">
                  <span className="info-label">Instagram</span>
                  <span className="info-val">@aldosynnn</span>
                </div>
                <i className="fa-solid fa-arrow-up-right info-arrow" />
              </a>

              <a href="https://github.com/SynnnW" target="_blank" rel="noopener" className="info-item">
                <div className="info-icon"><i className="fa-brands fa-github" /></div>
                <div className="info-text">
                  <span className="info-label">GitHub</span>
                  <span className="info-val">SynnnW</span>
                </div>
                <i className="fa-solid fa-arrow-up-right info-arrow" />
              </a>

              <div className="info-item info-item-static">
                <div className="info-icon"><i className="fa-solid fa-location-dot" /></div>
                <div className="info-text">
                  <span className="info-label">Lokasi</span>
                  <span className="info-val">Jawa Timur, Indonesia</span>
                </div>
              </div>
            </div>

            <div className="avail-badge">
              <span className="avail-dot" />
              <span>Tersedia untuk proyek baru</span>
            </div>

            <div className="services-list">
              <p className="services-heading">Layanan yang ditawarkan</p>
              <div className="svc-chips">
                {SERVICES.map((s) => (
                  <span key={s} className="svc-chip">{s}</span>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT: Form ── */}
          <div ref={r} className="contact-right reveal rv-d1">
            <div className="form-glass">
              <div className="form-glass-glow" />
              <div className="form-glass-top-line" />

              {status === 'success' ? (
                /* ── Success state ── */
                <div className="form-success">
                  <div className="success-icon"><i className="fa-solid fa-circle-check" /></div>
                  <h3 className="success-title">Pesan Terkirim!</h3>
                  <p className="success-desc">
                    Terima kasih telah menghubungi saya. Saya akan membalas dalam 1–2 hari kerja.
                  </p>
                  <button className="btn-reset" onClick={reset}>
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <>
                  <h2 className="form-title">Ceritakan proyek Anda.</h2>
                  <p className="form-sub">Isi formulir di bawah dan saya akan segera menghubungi Anda.</p>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="field-row">
                      <div className="field-group">
                        <label className="field-label" htmlFor="f-name">Nama Lengkap</label>
                        <input
                          className={`field-input${errors.name ? ' error' : ''}`}
                          type="text" id="f-name" placeholder="Aldo Leo Saputra"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          autoComplete="name"
                        />
                        <span className="field-error">{errors.name}</span>
                      </div>
                      <div className="field-group">
                        <label className="field-label" htmlFor="f-email">Alamat Email</label>
                        <input
                          className={`field-input${errors.email ? ' error' : ''}`}
                          type="email" id="f-email" placeholder="email@anda.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          autoComplete="email"
                        />
                        <span className="field-error">{errors.email}</span>
                      </div>
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="f-subject">Subjek</label>
                      <input
                        className={`field-input${errors.subject ? ' error' : ''}`}
                        type="text" id="f-subject" placeholder="Proyek web portofolio"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      />
                      <span className="field-error">{errors.subject}</span>
                    </div>

                    <div className="field-group">
                      <label className="field-label">Layanan yang Dibutuhkan</label>
                      <div className="svc-select-grid">
                        {SERVICES.map((svc) => (
                          <label
                            key={svc}
                            className={`svc-opt${services.includes(svc) ? ' checked' : ''}`}
                            onClick={() => toggleService(svc)}
                          >
                            <span className="svc-opt-box" />
                            <span>{svc}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="f-msg">Pesan</label>
                      <textarea
                        className={`field-input field-textarea${errors.message ? ' error' : ''}`}
                        id="f-msg" placeholder="Halo! Saya ingin membuat..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                      <span className="field-error">{errors.message}</span>
                    </div>

                    {status === 'error' && (
                      <p className="form-err-global">
                        <i className="fa-solid fa-triangle-exclamation" /> Gagal mengirim. Coba lagi atau hubungi via email.
                      </p>
                    )}

                    <button type="submit" className="btn-submit" disabled={status === 'loading'}>
                      {status === 'loading' ? (
                        <><i className="fa-solid fa-circle-notch fa-spin" /> Mengirim...</>
                      ) : (
                        <>Kirim Pesan <i className="fa-solid fa-paper-plane" /></>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Aldo Leo Saputra</span>
          <div className="footer-socials">
            <a href="https://github.com/SynnnW" target="_blank" rel="noopener" className="f-soc-link" aria-label="GitHub">
              <i className="fa-brands fa-github" />
            </a>
            <a href="https://www.instagram.com/aldosynnn?igsh=MWNhYTdzaWQyOGkwaA==" target="_blank" rel="noopener" className="f-soc-link" aria-label="Instagram">
              <i className="fa-brands fa-instagram" />
            </a>
          </div>
          <button className="footer-top-btn" onClick={scrollTop}>
            <i className="fa-solid fa-arrow-up" /> Ke atas
          </button>
        </div>
      </footer>
    </>
  );
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
.rv-d3 { transition-delay:0.36s; }

.contact-page { padding-top: 76px; }

/* Hero */
.contact-hero {
  min-height: 52vh;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 60px 80px 70px;
  position: relative; overflow: hidden;
  border-bottom: 1px solid var(--border);
}
.hero-orb {
  position: absolute; border-radius: 50%;
  pointer-events: none; filter: blur(80px);
}
.orb-1 {
  width: 500px; height: 500px; top: -100px; right: -60px;
  background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
}
.orb-2 {
  width: 350px; height: 350px; bottom: -80px; left: 5%;
  background: radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%);
}
.contact-hero::after {
  content: '';
  position: absolute; bottom: 0; left: 80px; right: 80px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent2), transparent);
  opacity: 0.22;
}
.hero-inner { position: relative; z-index: 1; max-width: 700px; }
.page-label {
  display: block; font-size: 0.62rem; font-weight: 600;
  letter-spacing: 0.32em; text-transform: uppercase;
  color: var(--text-dim); margin-bottom: 14px;
}
.hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.5rem, 9vw, 8.5rem);
  font-weight: 300; line-height: 0.88; margin-bottom: 22px;
}
.hero-title em { font-style: italic; color: var(--text-dim); }
.hero-sub {
  font-size: 0.92rem; color: var(--text-dim);
  max-width: 480px; line-height: 1.80;
}
.hero-scroll-hint {
  position: absolute; bottom: 30px; right: 80px; z-index: 1;
  display: flex; align-items: center; gap: 8px;
  font-size: 0.62rem; font-weight: 600; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--text-dim);
}

/* Main layout */
.contact-main {
  display: grid; grid-template-columns: 1fr 1.5fr;
  gap: 0; min-height: 60vh;
}

/* Left */
.contact-left {
  padding: 60px 50px 80px;
  background: var(--bg2);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column; gap: 44px;
}
.info-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem; font-weight: 600; margin-bottom: 12px;
}
.info-desc { font-size: 0.84rem; color: var(--text-dim); line-height: 1.78; }

.info-items { display: flex; flex-direction: column; gap: 2px; }
.info-item {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 18px; border-radius: 14px;
  border: 1px solid transparent;
  transition: all 0.28s ease; text-decoration: none; color: inherit;
}
.info-item:hover {
  background: var(--glass2); border-color: var(--gborder);
  transform: translateX(4px);
}
.info-item-static:hover { transform: none; cursor: default; }
.info-icon {
  width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
  background: var(--glass); border: 1px solid var(--gborder);
  backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.95rem; color: var(--accent2); transition: all 0.28s;
}
.info-item:hover .info-icon { background: var(--glass3); border-color: var(--accent2); }
.info-text { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.info-label { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim); }
.info-val { font-size: 0.88rem; color: var(--text); }
.info-arrow { font-size: 0.72rem; color: var(--text-dim); opacity: 0; transition: opacity 0.28s; }
.info-item:hover .info-arrow { opacity: 1; }

/* Available badge */
.avail-badge {
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(34,197,94,0.08);
  border: 1px solid rgba(34,197,94,0.22);
  border-radius: 99px; padding: 10px 18px;
  width: fit-content;
  font-size: 0.72rem; font-weight: 600; color: rgba(74,222,128,0.9);
  letter-spacing: 0.05em;
}
[data-theme="light"] .avail-badge {
  background: rgba(34,197,94,0.06);
  color: rgba(22,163,74,0.9);
  border-color: rgba(22,163,74,0.25);
}
.avail-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #4ade80; flex-shrink: 0;
  animation: pulse 2s ease infinite;
}
[data-theme="light"] .avail-dot { background: #16a34a; }
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
  50%       { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
}

.services-heading {
  font-size: 0.62rem; font-weight: 600; letter-spacing: 0.22em;
  text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px;
}
.svc-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.svc-chip {
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 99px; padding: 6px 14px;
  font-size: 0.65rem; font-weight: 600; color: var(--text-dim);
  backdrop-filter: blur(10px); transition: all 0.25s;
}
.svc-chip:hover { border-color: var(--accent3); color: var(--accent3); }

/* Right / Form */
.contact-right { padding: 60px 60px 80px; }

.form-glass {
  background: var(--glass);
  backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
  border: 1px solid var(--gborder);
  border-radius: 28px; padding: 44px 48px;
  position: relative; overflow: hidden;
}
.form-glass-glow {
  position: absolute; top: -80px; right: -80px;
  width: 320px; height: 320px; border-radius: 50%;
  background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%);
  pointer-events: none;
}
.form-glass-top-line {
  position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent);
}
.form-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem; font-weight: 600; margin-bottom: 8px;
  position: relative; z-index: 1;
}
.form-sub {
  font-size: 0.84rem; color: var(--text-dim);
  line-height: 1.7; margin-bottom: 34px;
  position: relative; z-index: 1;
}

form { display: flex; flex-direction: column; gap: 22px; position: relative; z-index: 1; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.field-group { display: flex; flex-direction: column; gap: 8px; }
.field-label {
  font-size: 0.62rem; font-weight: 600; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--text-dim);
}
.field-input {
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 12px; padding: 13px 16px;
  font-family: 'Outfit', sans-serif; font-size: 0.88rem;
  color: var(--text); outline: none;
  transition: border-color 0.28s, background 0.28s;
  backdrop-filter: blur(10px); width: 100%;
}
.field-input::placeholder { color: var(--text-dim); opacity: 0.5; }
.field-input:focus { border-color: var(--accent2); background: var(--glass3); }
.field-input.error { border-color: rgba(239,68,68,0.6); }
.field-error {
  font-size: 0.65rem; color: rgba(239,68,68,0.8); min-height: 16px; display: block;
}
.field-textarea { resize: vertical; min-height: 130px; line-height: 1.65; }

/* Service checkboxes */
.svc-select-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 9px; margin-top: 2px; }
.svc-opt {
  display: flex; align-items: center; gap: 9px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 10px; padding: 10px 13px;
  cursor: pointer; transition: all 0.25s;
  font-size: 0.74rem; color: var(--text-dim);
  user-select: none;
}
.svc-opt:hover { border-color: var(--gborder2); color: var(--text); background: var(--glass3); }
.svc-opt.checked {
  background: rgba(139,92,246,0.12);
  border-color: rgba(139,92,246,0.4);
  color: var(--accent3);
}
.svc-opt-box {
  display: block; flex-shrink: 0;
  width: 14px; height: 14px; border-radius: 4px;
  border: 1px solid var(--border2);
  background: transparent; transition: all 0.22s;
}
.svc-opt.checked .svc-opt-box {
  background: var(--accent); border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.2);
}

/* Global error */
.form-err-global {
  font-size: 0.78rem; color: rgba(239,68,68,0.85);
  background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2);
  border-radius: 10px; padding: 12px 16px;
  display: flex; align-items: center; gap: 9px;
}

/* Submit */
.btn-submit {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%; padding: 16px;
  background: var(--accent); color: #fff;
  border: none; border-radius: 14px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  cursor: pointer; transition: all 0.35s;
  box-shadow: 0 8px 32px rgba(139,92,246,0.35);
  margin-top: 4px; position: relative; z-index: 1;
}
.btn-submit:hover:not(:disabled) {
  background: var(--accent2); transform: translateY(-2px);
  box-shadow: 0 14px 44px rgba(139,92,246,0.48);
}
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* Success */
.form-success {
  text-align: center; padding: 40px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  position: relative; z-index: 1;
}
.success-icon { font-size: 3.2rem; color: #4ade80; }
[data-theme="light"] .success-icon { color: #16a34a; }
.success-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem; font-weight: 600;
}
.success-desc { font-size: 0.88rem; color: var(--text-dim); line-height: 1.78; max-width: 340px; }
.btn-reset {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--glass2); border: 1px solid var(--gborder2);
  border-radius: 99px; padding: 11px 28px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text); cursor: pointer; transition: all 0.3s;
  backdrop-filter: blur(12px); margin-top: 8px;
}
.btn-reset:hover { background: var(--accent); color: #fff; border-color: var(--accent); }

/* Footer */
.site-footer { background: var(--bg2); padding: 26px 80px; border-top: 1px solid var(--border); }
.footer-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; }
.footer-copy { font-size: 0.72rem; color: var(--text-dim); }
.footer-socials { display: flex; gap: 10px; }
.f-soc-link {
  width: 36px; height: 36px; border-radius: 50%;
  border: 1px solid var(--border); background: var(--glass);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-dim); font-size: 0.82rem; transition: all 0.3s; text-decoration: none;
}
.f-soc-link:hover { border-color: var(--accent2); color: var(--accent2); transform: translateY(-2px); }
.footer-top-btn {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.65rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--text-dim); background: none; border: none;
  transition: color 0.3s; cursor: pointer; font-family: 'Outfit', sans-serif;
}
.footer-top-btn:hover { color: var(--text); }

/* Responsive */
@media (max-width: 1024px) {
  .contact-hero { padding: 60px 40px 60px; }
  .contact-main { grid-template-columns: 1fr; }
  .contact-left { padding: 50px 40px; border-right: none; border-bottom: 1px solid var(--border); }
  .contact-right { padding: 50px 40px 70px; }
  .site-footer { padding: 22px 40px; }
}
@media (max-width: 768px) {
  .contact-hero { padding: 50px 24px 52px; min-height: auto; }
  .contact-hero::after { left: 24px; right: 24px; }
  .hero-scroll-hint { right: 24px; }
  .contact-left { padding: 40px 24px; }
  .contact-right { padding: 40px 24px 60px; }
  .form-glass { padding: 30px 22px; border-radius: 20px; }
  .field-row { grid-template-columns: 1fr; }
  .svc-select-grid { grid-template-columns: 1fr 1fr; }
  .site-footer { padding: 20px 24px; }
  .footer-bottom { flex-direction: column; align-items: flex-start; gap: 12px; }
}
`;
