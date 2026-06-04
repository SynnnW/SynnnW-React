import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ t }) {
  const nameRef = useRef(null);

  /* ── Parallax scroll effect (dipertahankan dari original) ── */
  useEffect(() => {
    const setInitial = () => {
      if (!nameRef.current) return;
      nameRef.current.style.transform = 'translateX(-260px)';
    };
    setInitial();

    const handleScroll = () => {
      if (!nameRef.current) return;
      const el = nameRef.current;
      const footerEl = el.closest('footer');
      if (!footerEl) return;

      const rect     = footerEl.getBoundingClientRect();
      const winH     = window.innerHeight;
      const progress = 1 - (rect.top / winH);
      const clamped  = Math.max(0, Math.min(1, progress));

      el.style.transform = `translateX(${-260 + clamped * 520}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* ── Shared link style ── */
  const linkStyle = {
    fontSize: '0.8rem',
    color: 'var(--text-dim)',
    letterSpacing: '0.06em',
    textDecoration: 'none',
    transition: 'color 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
  };
  const hoverOn  = e => (e.currentTarget.style.color = 'var(--text)');
  const hoverOff = e => (e.currentTarget.style.color = 'var(--text-dim)');

  return (
    <footer style={{
      background:  'var(--bg2)',
      borderTop:   '1px solid var(--border)',
      overflow:    'hidden',
      paddingTop:  '4rem',
    }}>

      {/* ── Big Parallax Name (dipertahankan) ── */}
      <div style={{ overflow: 'hidden', padding: '0 2rem 2rem' }}>
        <h2
          ref={nameRef}
          style={{
            fontFamily:    'Cormorant Garamond, serif',
            fontSize:      'clamp(3rem, 10vw, 9rem)',
            fontWeight:    300,
            color:         'var(--border2)',
            whiteSpace:    'nowrap',
            letterSpacing: '-0.02em',
            willChange:    'transform',
            display:       'inline-block',
          }}
        >
          Aldo Leo Saputra
        </h2>
      </div>

      {/* ── Quick nav links row ── */}
      <div style={{
        display:       'flex',
        alignItems:    'center',
        gap:           '1.5rem',
        padding:       '1rem 2rem',
        flexWrap:      'wrap',
        borderTop:     '1px solid var(--border)',
      }}>
        {[
          { to: '/',          label: 'Home'      },
          { to: '/works',     label: 'Works'     },
          { to: '/about',     label: 'About'     },
          { to: '/journal',   label: 'Journal'   },
          { to: '/price-list',label: 'Pricing'   },
          { to: '/terms',     label: 'Terms'     },
          { to: '/contact',   label: 'Contact'   },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{
              fontSize:      '0.72rem',
              fontFamily:    'Outfit, sans-serif',
              fontWeight:    500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color:         'var(--text-dim)',
              textDecoration:'none',
              transition:    'color 0.2s',
            }}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* ── Footer Bottom ── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        flexWrap:       'wrap',
        gap:            '1rem',
        padding:        '1.5rem 2rem',
        borderTop:      '1px solid var(--border)',
      }}>

        {/* Copyright — English, 2025–2026 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0 }}>
            © 2025–2026 SynnnW Studio. All rights reserved.
          </p>
        </div>

        {/* Social links */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a
            href="https://github.com/SynnnW"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
          >
            <i className="fa-brands fa-github" style={{ fontSize: '0.85rem' }} />
            GitHub
          </a>

          {/* Instagram — updated URL per Prompt 04 */}
          <a
            href="https://www.instagram.com/aldosynnn?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
          >
            <i className="fa-brands fa-instagram" style={{ fontSize: '0.85rem' }} />
            Instagram
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/6281252790018"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...linkStyle, color: 'rgba(37,211,102,0.6)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#25d366')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(37,211,102,0.6)')}
          >
            <i className="fa-brands fa-whatsapp" style={{ fontSize: '0.85rem' }} />
            WhatsApp
          </a>
        </div>

        {/* Back to top (dipertahankan) */}
        <button
          onClick={scrollToTop}
          style={{
            background:    'none',
            border:        '1px solid var(--border2)',
            color:         'var(--text-dim)',
            padding:       '6px 16px',
            borderRadius:  '4px',
            fontSize:      '0.78rem',
            cursor:        'pointer',
            letterSpacing: '0.06em',
            transition:    'color 0.2s, border-color 0.2s',
            fontFamily:    'Outfit, sans-serif',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color        = 'var(--accent)';
            e.currentTarget.style.borderColor  = 'var(--accent)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color        = 'var(--text-dim)';
            e.currentTarget.style.borderColor  = 'var(--border2)';
          }}
        >
          Back to Top ↑
        </button>
      </div>
    </footer>
  );
}
