// src/components/quiz/QuizNavbar.jsx
// ─────────────────────────────────────────────────────────────
// Navbar khusus bagian Quiziz — dipakai di layar "pemilihan"
// (landing matkul, TM picker, chapter picker, UAS landing), BUKAN
// di layar pengerjaan soal (QuizEngine sudah py sendiri sticky
// header + ambient bg sendiri, jangan ditumpuk supaya tidak
// bentrok/menutupi).
//
// Mengikuti karakter navbar utama SynnnW (pill nav tengah, logo kiri,
// CTA kanan, hamburger+drawer di mobile) tapi pakai token glass
// Quiziz sendiri (lihat styles/quizGlass.css) supaya identitas Quiziz
// (dark canvas, violet+teal, Space Grotesk/Inter) tetap utuh.
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { to: '/quiziz',    label: 'Latsol Mingguan' },
  { to: '/quizizuas', label: 'UAS' },
];

export default function QuizNavbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isActive = (to) => pathname === to;

  return (
    <>
      <nav className="qzn-root" role="navigation" aria-label="Navigasi Quiziz">
        <Link to="/quiziz" className="qzn-logo" aria-label="Kembali ke Quiziz">
          <span className="qzn-logo-mark">✦</span>
          <span className="qzn-logo-text">Synnn<span>W</span> · Quiziz</span>
        </Link>

        <div className="qzn-pill">
          {LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`qzn-link${isActive(l.to) ? ' qzn-active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="qzn-right">
          <a href="/" className="qzn-main-link">
            <i className="fa-solid fa-arrow-left" style={{ fontSize: '0.6rem' }} />
            Website Utama
          </a>
          <button
            className="qzn-hamburger"
            onClick={() => setOpen(true)}
            aria-label="Buka menu navigasi"
            aria-expanded={open}
          >
            <i className="fa-solid fa-bars" />
          </button>
        </div>
      </nav>

      {open && (
        <>
          <div className="qzn-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="qzn-drawer" role="dialog" aria-modal="true" aria-label="Menu navigasi Quiziz">
            <button className="qzn-drawer-close" onClick={() => setOpen(false)} aria-label="Tutup menu">
              <i className="fa-solid fa-xmark" />
            </button>

            {LINKS.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`qzn-drawer-link${isActive(l.to) ? ' qzn-active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}

            <div className="qzn-drawer-divider" />

            <a href="/" className="qzn-drawer-main" onClick={() => setOpen(false)}>
              <i className="fa-solid fa-arrow-left" style={{ fontSize: '0.7rem' }} />
              Website Utama SynnnW
            </a>
          </div>
        </>
      )}
    </>
  );
}
