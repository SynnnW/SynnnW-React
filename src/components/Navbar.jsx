import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ t, lang, toggleLang, theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: t.navHome },
    { to: '/porto', label: t.navWork },
    { to: '/tentang', label: t.navAbout },
    { to: '/journal', label: t.navJournal },
    { to: '/contact', label: t.navContact },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem', height: '64px',
      }}>

        {/* ── Logo kiri ── */}
        <Link to="/" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.25rem', fontWeight: 700,
          letterSpacing: '0.04em', color: 'var(--text)',
          textDecoration: 'none', flexShrink: 0,
        }}>
          SynnnW<span style={{ color: 'var(--accent)', fontSize: '1.4rem', lineHeight: 1 }}>*</span>
        </Link>

        {/* ── Center pill nav (desktop) ── */}
        <div className="nav-center-pill" style={{
          display: 'flex', alignItems: 'center', gap: '2px',
          background: 'var(--glass2)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid var(--gborder)',
          borderRadius: '99px', padding: '5px 7px',
          position: 'absolute', left: '50%',
          transform: 'translateX(-50%)',
        }}>
          {links.map(link => (
            <Link key={link.to} to={link.to} style={{
              fontSize: '0.64rem', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: isActive(link.to) ? 'var(--bg)' : 'var(--text-dim)',
              padding: '7px 14px', borderRadius: '99px',
              background: isActive(link.to) ? 'var(--text)' : 'transparent',
              transition: 'all 0.22s ease',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { if (!isActive(link.to)) e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { if (!isActive(link.to)) e.currentTarget.style.color = 'var(--text-dim)'; }}
            >
              {link.label}
            </Link>
          ))}

          {/* Divider */}
          <div style={{ width: '1px', height: '18px', background: 'var(--border2)', margin: '0 4px', flexShrink: 0 }} />

          {/* Theme toggle — gear/sun/moon */}
          <button onClick={toggleTheme} style={{
            background: 'none', border: 'none',
            color: 'var(--text-dim)', width: '32px', height: '32px',
            borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.88rem', transition: 'all 0.22s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
            aria-label="Ganti tema"
          >
            {theme === 'dark'
              ? <i className="fa-solid fa-sun" />
              : <i className="fa-solid fa-moon" />}
          </button>

          {/* Lang toggle */}
          <button onClick={toggleLang} style={{
            background: 'none', border: 'none',
            color: 'var(--text-dim)', cursor: 'pointer',
            fontSize: '0.6rem', fontWeight: 700,
            letterSpacing: '0.1em', padding: '6px 9px',
            borderRadius: '99px', transition: 'all 0.22s',
            fontFamily: 'Outfit, sans-serif',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            {lang === 'id' ? 'EN' : 'ID'}
          </button>
        </div>

        {/* ── Kanan: CTA + Hamburger ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <Link to="/contact" className="nav-cta" style={{
            background: 'var(--text)', color: 'var(--bg)',
            padding: '9px 22px', borderRadius: '99px',
            fontSize: '0.64rem', letterSpacing: '0.12em',
            fontWeight: 700, textTransform: 'uppercase',
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'all 0.3s ease', display: 'inline-flex',
            alignItems: 'center', gap: '8px',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--text)'; e.currentTarget.style.color = 'var(--bg)'; }}
          >
            {t.bookNow}
            <i className="fa-solid fa-arrow-up-right" style={{ fontSize: '0.6rem' }} />
          </Link>

          {/* Hamburger mobile */}
          <button onClick={() => setMenuOpen(true)} className="nav-hamburger" style={{
            display: 'none', background: 'var(--glass2)',
            border: '1px solid var(--gborder)', color: 'var(--text)',
            width: '38px', height: '38px', borderRadius: '10px',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '0.95rem',
          }}>
            <i className="fa-solid fa-bars" />
          </button>
        </div>
      </nav>

      {/* ── Mobile overlay menu ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'var(--bg)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '4px',
        }}>
          <button onClick={() => setMenuOpen(false)} style={{
            position: 'absolute', top: '22px', right: '22px',
            background: 'var(--glass2)', border: '1px solid var(--gborder)',
            width: '42px', height: '42px', borderRadius: '50%',
            color: 'var(--text)', fontSize: '1.1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <i className="fa-solid fa-xmark" />
          </button>

          {links.map(link => (
            <Link key={link.to} to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '2.7rem', fontWeight: 300,
                color: isActive(link.to) ? 'var(--text)' : 'var(--text-dim)',
                textDecoration: 'none', padding: '6px 30px',
                transition: 'color 0.2s',
              }}>
              {link.label}
            </Link>
          ))}

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button onClick={toggleLang} style={{
              background: 'var(--glass2)', border: '1px solid var(--gborder)',
              color: 'var(--text-dim)', padding: '8px 18px',
              borderRadius: '99px', fontSize: '0.72rem',
              fontWeight: 700, cursor: 'pointer', letterSpacing: '0.1em',
            }}>
              {lang === 'id' ? 'EN' : 'ID'}
            </button>
            <button onClick={toggleTheme} style={{
              background: 'var(--glass2)', border: '1px solid var(--gborder)',
              color: 'var(--text-dim)', padding: '8px 18px',
              borderRadius: '99px', cursor: 'pointer', fontSize: '0.9rem',
            }}>
              {theme === 'dark' ? <i className="fa-solid fa-sun" /> : <i className="fa-solid fa-moon" />}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-center-pill { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}