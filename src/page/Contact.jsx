// src/pages/Contact.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ADMIN_EMAIL = 'aldokraksaan@gmail.com';

export default function Contact({ t = {} }) {
  const navigate = useNavigate();
  const [lang, setLang] = useState('id');

  // ── Auth guard: Contact dinonaktifkan untuk admin & client yang sudah login ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return; // guest — boleh akses
      if (user.email === ADMIN_EMAIL) {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/Dashboard', { replace: true });
      }
    });
    return () => unsub();
  }, [navigate]);

  const isEn = lang === 'en';

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'contact-page-styles';
    style.textContent = `
/* ── Base ── */
.contact-page {
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%);
  min-height: 100vh;
  color: var(--text);
  font-family: 'Outfit', sans-serif;
  padding-bottom: 80px;
}

/* ── Reveal animation ── */
.contact-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.contact-reveal.visible { opacity: 1; transform: translateY(0); }
.rv-d1 { transition-delay: 0.1s; }
.rv-d2 { transition-delay: 0.2s; }
.rv-d3 { transition-delay: 0.3s; }

/* ── Hero ── */
.contact-hero {
  min-height: 65vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 140px 80px 80px;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}

.contact-hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 55% 55% at 85% 15%, rgba(99,102,241,0.12) 0%, transparent 60%),
    radial-gradient(ellipse 35% 45% at 10% 85%, rgba(139,92,246,0.08) 0%, transparent 60%);
}

.contact-hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, var(--bg) 100%);
}

.contact-label {
  font-size: 0.6rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.contact-label span {
  color: var(--accent2);
}

.contact-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(4rem, 10vw, 9rem);
  font-weight: 300;
  line-height: 0.88;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
  letter-spacing: -0.02em;
}

.contact-sub {
  font-size: 1.08rem;
  line-height: 1.8;
  color: var(--text-dim);
  margin-bottom: 0;
  max-width: 600px;
  position: relative;
  z-index: 1;
}

/* ── Contact Cards Section ── */
.contact-cards-section {
  padding: 100px 80px;
  border-top: 1px solid var(--border);
}

.contact-cards-label {
  display: block;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
}

.contact-cards-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.4rem, 5vw, 4.8rem);
  font-weight: 300;
  line-height: 0.92;
  margin-bottom: 60px;
}

.contact-cards-title em {
  font-style: italic;
  color: var(--text-dim);
}

.contact-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 24px;
  margin-bottom: 60px;
}

.contact-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 32px 28px;
  background: var(--glass);
  border: 1px solid var(--border);
  border-radius: 20px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.contact-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: transparent;
  transition: background 0.3s ease;
  pointer-events: none;
}

.contact-card:hover::before {
  background: linear-gradient(135deg, rgba(139,92,246,0.04) 0%, transparent 60%);
}

.contact-card:hover {
  transform: translateY(-6px);
  border-color: rgba(139,92,246,0.3);
}

/* WhatsApp card — slightly larger */
.contact-card--wa {
  grid-column: span 1;
  grid-row: span 2;
  padding: 44px 32px;
  border-color: rgba(37,211,102,0.3);
}

.contact-card--wa:hover {
  background: rgba(37,211,102,0.06);
  border-color: rgba(37,211,102,0.5);
}

.contact-card-icon {
  font-size: 2.4rem;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.contact-card--wa .contact-card-icon {
  font-size: 3.2rem;
  color: #25d366;
}

.contact-card--ig .contact-card-icon {
  background: linear-gradient(135deg, #f97316, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-card-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  font-weight: 600;
  position: relative;
  z-index: 2;
}

.contact-card-sub {
  font-size: 0.82rem;
  color: var(--text-dim);
  line-height: 1.6;
  position: relative;
  z-index: 2;
}

/* ── Availability Badge ── */
.contact-avail-section {
  padding: 80px;
  border-top: 1px solid var(--border);
  text-align: center;
}

.contact-avail-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: rgba(74,222,128,0.07);
  border: 1px solid rgba(74,222,128,0.25);
  border-radius: 99px;
  padding: 16px 28px;
  margin-bottom: 20px;
}

.contact-avail-dot {
  width: 10px;
  height: 10px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse-dot 2s ease infinite;
  flex-shrink: 0;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.6; transform: scale(1.2); }
}

.contact-avail-text {
  font-family: 'Outfit', sans-serif;
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4ade80;
}

.contact-avail-sub {
  font-size: 0.92rem;
  color: var(--text-dim);
  line-height: 1.8;
}

/* ── Quick Links ── */
.contact-links-section {
  padding: 80px;
  border-top: 1px solid var(--border);
}

.contact-links-label {
  display: block;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
}

.contact-links-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.4rem, 5vw, 4.8rem);
  font-weight: 300;
  line-height: 0.92;
  margin-bottom: 48px;
}

.contact-links-title em {
  font-style: italic;
  color: var(--text-dim);
}

.contact-links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.contact-link-btn {
  padding: 20px 24px;
  background: var(--glass2);
  border: 1px solid var(--border);
  border-radius: 16px;
  text-decoration: none;
  color: var(--text);
  font-family: 'Outfit', sans-serif;
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.contact-link-btn:hover {
  background: var(--glass);
  border-color: var(--accent2);
  color: var(--accent2);
  transform: translateY(-3px);
}

/* ── Sinematura Footer ── */
.contact-smt-footer {
  padding: 48px 80px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.contact-smt-text {
  font-size: 0.72rem;
  color: var(--text-dim);
  opacity: 0.45;
  transition: opacity 0.25s;
}

.contact-smt-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #e1306c;
  font-size: 0.9rem;
  transition: opacity 0.25s;
  text-decoration: none;
}

.contact-smt-footer:hover .contact-smt-text,
.contact-smt-footer:hover .contact-smt-link {
  opacity: 0.8;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .contact-hero { padding: 130px 40px 60px; }
  .contact-cards-section { padding: 80px 40px; }
  .contact-grid { grid-template-columns: 1fr 1fr; }
  .contact-card--wa { grid-column: span 1; grid-row: span 1; }
  .contact-links-section { padding: 65px 40px; }
  .contact-links-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .contact-hero { padding: 110px 24px 50px; }
  .contact-heading { font-size: clamp(2.8rem, 10vw, 4.5rem); }
  .contact-cards-section { padding: 60px 24px; }
  .contact-grid { grid-template-columns: 1fr; gap: 16px; }
  .contact-avail-section { padding: 60px 24px; }
  .contact-links-section { padding: 60px 24px; }
  .contact-links-grid { grid-template-columns: 1fr; }
  .contact-smt-footer { padding: 40px 24px; flex-direction: column; gap: 12px; }
}

@media (max-width: 480px) {
  .contact-hero { padding: 100px 16px 40px; }
  .contact-cards-section { padding: 48px 16px; }
  .contact-card { padding: 24px 20px; }
  .contact-heading { font-size: clamp(2.2rem, 8vw, 3.5rem); }
  .contact-label { font-size: 0.55rem; }
  .contact-sub { font-size: 0.95rem; }
}
`;
    document.head.appendChild(style);

    // Reveal observer
    const els = document.querySelectorAll('.contact-reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const timer = setTimeout(() => {
      els.forEach((el) => obs.observe(el));
    }, 60);

    window.scrollTo(0, 0);

    return () => {
      clearTimeout(timer);
      obs.disconnect();
      document.getElementById('contact-page-styles')?.remove();
    };
  }, []);

  return (
    <PageTransition>
      <div className="contact-page">

        {/* ══ HERO ══ */}
        <section className="contact-hero">
          <div className="contact-hero-bg" />

          <div className="contact-label contact-reveal">
            Let's <span>Work Together</span>
          </div>

          <h1 className="contact-heading contact-reveal rv-d1">
            Contact
          </h1>

          <p className="contact-sub contact-reveal rv-d2">
            {isEn ? 'Got a project? Let\'s talk.' : 'Ada project yang mau digarap bareng? Langsung aja.'}
          </p>
        </section>

        {/* ══ CONTACT CARDS ══ */}
        <section className="contact-cards-section">
          <span className="contact-cards-label contact-reveal">01 / Get in Touch</span>
          <h2 className="contact-cards-title contact-reveal rv-d1">
            Reach Out <em>Now.</em>
          </h2>

          <div className="contact-grid contact-reveal rv-d2">
            {/* WhatsApp — larger */}
            <a
              href="https://wa.me/6281252790018"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card contact-card--wa"
            >
              <span className="contact-card-icon">
                <i className="fa-brands fa-whatsapp" />
              </span>
              <span className="contact-card-label">WhatsApp</span>
              <span className="contact-card-sub">
                {isEn ? 'Fastest response — usually < 1 hour' : 'Paling cepet responnya'}
              </span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/aldosynnn?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card contact-card--ig"
            >
              <span className="contact-card-icon">
                <i className="fa-brands fa-instagram" />
              </span>
              <span className="contact-card-label">Instagram</span>
              <span className="contact-card-sub">@aldosynnn — DMs open</span>
            </a>

            {/* Email */}
            <a
              href="mailto:aldosynnn@gmail.com"
              className="contact-card"
            >
              <span className="contact-card-icon">
                <i className="fa-regular fa-envelope" />
              </span>
              <span className="contact-card-label">Email</span>
              <span className="contact-card-sub">aldosynnn@gmail.com</span>
            </a>
          </div>
        </section>

        {/* ══ AVAILABILITY ══ */}
        <section className="contact-avail-section contact-reveal rv-d1">
          <div className="contact-avail-badge">
            <span className="contact-avail-dot" />
            <span className="contact-avail-text">Open for Projects</span>
          </div>
          <p className="contact-avail-sub">
            {isEn
              ? 'Currently accepting new client orders — response within 24 hours.'
              : 'Lagi buka orderan — balas dalam 24 jam.'}
          </p>
        </section>

        {/* ══ QUICK LINKS ══ */}
        <section className="contact-links-section">
          <span className="contact-cards-label contact-reveal">02 / Explore</span>
          <h2 className="contact-links-title contact-reveal rv-d1">
            More <em>Info.</em>
          </h2>

          <div className="contact-links-grid contact-reveal rv-d2">
            <button className="contact-link-btn" onClick={() => navigate('/works')}>
              <span>View Works</span>
              <i className="fa-solid fa-arrow-right" />
            </button>
            <button className="contact-link-btn" onClick={() => navigate('/price-list')}>
              <span>See Price List</span>
              <i className="fa-solid fa-arrow-right" />
            </button>
            <button className="contact-link-btn" onClick={() => navigate('/terms')}>
              <span>Read Terms</span>
              <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </section>

        {/* ══ SINEMATURA FOOTER ══ */}
        <footer className="contact-smt-footer">
          <span className="contact-smt-text">Also part of</span>
          <a
            href="https://www.instagram.com/sine_matura?igsh=MWQ1MXptNHp6cm0xNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="contact-smt-link"
            title="Sinematura — SMAN 1 Kraksaan's film community"
          >
            <i className="fa-brands fa-instagram" />
          </a>
          <span className="contact-smt-text">Sinematura</span>
        </footer>

      </div>
    </PageTransition>
  );
}