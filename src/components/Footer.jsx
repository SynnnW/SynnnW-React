import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LeoMascotToggle from './LeoMascotToggle';
import { prefersReduced } from '../lib/motion';
import '../styles/chrome.css';

function WibClock() {
  const fmt = () => new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta', hour12: false }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => { const id = setInterval(() => setT(fmt()), 30000); return () => clearInterval(id); }, []);
  return <span className="folio">{t} WIB — Jawa Timur, ID</span>;
}

const NAV = [
  { to: '/', en: 'Home', id: 'Beranda' },
  { to: '/works', en: 'Works', id: 'Karya' },
  { to: '/about', en: 'About', id: 'Tentang' },
  { to: '/journal', en: 'Journal', id: 'Jurnal' },
  { to: '/price-list', en: 'Pricing', id: 'Harga' },
  { to: '/terms', en: 'Terms', id: 'Ketentuan' },
  { to: '/contact', en: 'Contact', id: 'Kontak' },
];

export default function Footer({ lang = 'id' }) {
  const nameRef = useRef(null);
  const isID = lang !== 'en';
  const L = (en, id) => (isID ? id : en);

  /* Parallax nama besar (dipertahankan); dimatikan bila reduced-motion */
  useEffect(() => {
    const el = nameRef.current;
    if (!el || prefersReduced()) return undefined;
    const footerEl = el.closest('footer');
    const update = () => {
      if (!footerEl) return;
      const rect = footerEl.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
      el.style.transform = `translateX(${-12 + p * 12}%)`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' });

  return (
    <footer className="ft">
      <div className="ft-top">
        <WibClock />
        <span className="folio">© 2025–2026 SynnnW Studio</span>
      </div>

      <div className="ft-name-wrap">
        <h2 ref={nameRef} className="ft-name" aria-label="Aldo Leo Saputra">Aldo Leo <em>Saputra</em></h2>
      </div>

      <div className="ft-grid">
        <nav className="ft-col" aria-label={L('Footer navigation', 'Navigasi footer')}>
          <h3>{L('Navigate', 'Jelajahi')}</h3>
          <ul className="ft-list">
            {NAV.map(n => (
              <li key={n.to}><Link className="ft-link" to={n.to}>{isID ? n.id : n.en}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="ft-col">
          <h3>{L('Elsewhere', 'Di tempat lain')}</h3>
          <ul className="ft-list">
            <li><a className="ft-link ft-link--plain" href="https://github.com/SynnnW" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github" aria-hidden="true" />GitHub</a></li>
            <li><a className="ft-link ft-link--plain" href="https://www.instagram.com/aldosynnn?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram" aria-hidden="true" />Instagram</a></li>
            <li><a className="ft-link ft-link--plain" href="https://wa.me/6281252790018" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp" aria-hidden="true" />WhatsApp</a></li>
          </ul>
        </div>

        <div className="ft-col ft-cta">
          <h3>{L('Next project', 'Proyek berikutnya')}</h3>
          <p>{L('Got something to ', 'Punya sesuatu untuk ')}<em>{L('build?', 'dibangun?')}</em></p>
          <Link to="/contact" className="ft-btn">{L('Write a brief', 'Tulis brief')} <i className="fa-solid fa-arrow-up-right" aria-hidden="true" /></Link>
        </div>
      </div>

      <div className="ft-bottom">
        <span>{L('All rights reserved.', 'Seluruh hak cipta dilindungi.')}</span>
        <button type="button" className="ft-top-btn" onClick={scrollToTop}>{L('Back to top', 'Ke atas')} ↑</button>
        <LeoMascotToggle lang={lang} />
      </div>
    </footer>
  );
}
