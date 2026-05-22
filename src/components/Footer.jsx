import { useEffect, useRef } from 'react';

export default function Footer({ t }) {
  const nameRef = useRef(null);

  useEffect(() => {
    // Set initial position
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

      // Hitung posisi footer relative ke viewport
      const rect = footerEl.getBoundingClientRect();
      const winH = window.innerHeight;

      // progress: 0 saat footer mulai masuk viewport, 1 saat footer keluar atas
      const progress = 1 - (rect.top / winH);
      const clamped = Math.max(0, Math.min(1, progress));

      // Translate dari -260px (kiri) ke +260px (kanan)
      const translateX = -260 + clamped * 520;
      el.style.transform = `translateX(${translateX}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger sekali saat mount
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: 'var(--bg2)',
      borderTop: '1px solid var(--border)',
      overflow: 'hidden',
      paddingTop: '4rem',
    }}>
      {/* Big Parallax Name */}
      <div style={{ overflow: 'hidden', padding: '0 2rem 2rem' }}>
        <h2 ref={nameRef} style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(3rem, 10vw, 9rem)',
          fontWeight: 300,
          color: 'var(--border2)',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.02em',
          willChange: 'transform',
          display: 'inline-block',
        }}>
          Aldo Leo Saputra
        </h2>
      </div>

      {/* Footer Bottom */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap',
        gap: '1rem', padding: '1.5rem 2rem',
        borderTop: '1px solid var(--border)',
      }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          © 2026 Aldo Leo Saputra
        </p>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="https://github.com/SynnnW" target="_blank" rel="noreferrer"
            style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '0.06em', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}>
            GitHub
          </a>
          <a href="https://www.instagram.com/aldosynnn" target="_blank" rel="noreferrer"
            style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '0.06em', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}>
            Instagram
          </a>
        </div>

        <button onClick={scrollToTop} style={{
          background: 'none', border: '1px solid var(--border2)',
          color: 'var(--text-dim)', padding: '6px 16px',
          borderRadius: '4px', fontSize: '0.78rem',
          cursor: 'pointer', letterSpacing: '0.06em',
          transition: 'color 0.2s, border-color 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
        >
          {t.backTop} ↑
        </button>
      </div>
    </footer>
  );
}