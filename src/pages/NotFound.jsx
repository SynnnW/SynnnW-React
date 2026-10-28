// src/pages/NotFound.jsx — satu momen "wow": 404 raksasa + marquee + tombol magnetic
import { useNavigate } from 'react-router-dom';
import LineReveal from '../components/LineReveal';
import Marquee from '../components/Marquee';
import Magnetic from '../components/Magnetic';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--bg)', color: 'var(--text)', padding: 'var(--gutter)', paddingTop: '6rem' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-meta)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
        (404) — Page not found
      </span>
      <div>
        <LineReveal as="h1" text="404" style={{ fontSize: 'clamp(8rem, 34vw, 30rem)', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 0.8 }} />
        <p style={{ marginTop: '2rem', maxWidth: '36ch', color: 'var(--text-dim)' }}>
          Halaman yang kamu cari tidak ada atau sudah dipindah. / The page you’re looking for doesn’t exist or has moved.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <Magnetic>
            <button onClick={() => navigate('/')} style={{ height: 56, padding: '0 32px', background: 'var(--accent)', color: 'var(--on-accent)', border: 0, borderRadius: 0, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem', cursor: 'pointer' }}>
              ← Kembali ke beranda
            </button>
          </Magnetic>
        </div>
      </div>
      <div style={{ margin: '0 calc(var(--gutter) * -1)' }}><Marquee text="404 — LOST — NOT FOUND — SYNNNW — " /></div>
    </div>
  );
}
