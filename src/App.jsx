import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useTheme, useLang } from './hooks/useApp';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

/* ── Lazy load semua halaman ── */
const Home         = lazy(() => import('./pages/Home'));
const Porto        = lazy(() => import('./pages/Porto'));
const Tentang      = lazy(() => import('./pages/Tentang'));
const Journal      = lazy(() => import('./pages/Journal'));
const JournalKarya1 = lazy(() => import('./pages/JournalKarya1'));
const Contact      = lazy(() => import('./pages/Contact'));
const PortoKarya1  = lazy(() => import('./pages/PortoKarya1'));
const PortoKarya2  = lazy(() => import('./pages/PortoKarya2'));
const PortoKarya3  = lazy(() => import('./pages/PortoKarya3'));
const PortoKarya4  = lazy(() => import('./pages/PortoKarya4'));
const PreviewLogo  = lazy(() => import('./pages/PreviewLogo'));


/* ── PriceList ── */
const PriceList    = lazy(() => import('./pages/PriceList'));

/* ── Tambahan Lazy Load untuk Halaman Baru Kamu ── */
const CheckoutQRIS = lazy(() => import('./pages/CheckoutQRIS'));

/* ── 404 Page ── */
function NotFound() {
  return (
    <>
      <style>{`
        @keyframes nf-float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-18px) rotate(2deg); }
        }
        @keyframes nf-glitch1 {
          0%,94%,100% { clip-path: inset(0 0 100% 0); transform: none; }
          95% { clip-path: inset(20% 0 60% 0); transform: translate(-4px, 0); }
          97% { clip-path: inset(60% 0 10% 0); transform: translate(4px, 0); }
          99% { clip-path: inset(40% 0 40% 0); transform: translate(-2px, 0); }
        }
        @keyframes nf-glitch2 {
          0%,91%,100% { clip-path: inset(0 0 100% 0); transform: none; }
          92% { clip-path: inset(10% 0 70% 0); transform: translate(5px, 0); color: #8b5cf6; }
          94% { clip-path: inset(70% 0 5%  0); transform: translate(-5px,0); color: #C0392B; }
          96% { clip-path: inset(30% 0 30% 0); transform: translate(3px, 0); color: #D4A017; }
        }
        @keyframes nf-orbit {
          from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
        }
        @keyframes nf-orbit2 {
          from { transform: rotate(180deg) translateX(80px) rotate(-180deg); }
          to   { transform: rotate(540deg) translateX(80px) rotate(-540deg); }
        }
        @keyframes nf-pulse {
          0%,100% { opacity: 0.15; transform: scale(1); }
          50%     { opacity: 0.35; transform: scale(1.08); }
        }
        @keyframes nf-scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes nf-fadein {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nf-wrap {
          position: relative;
          min-height: 80vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          overflow: hidden;
          padding: 60px 24px;
          font-family: 'Outfit', sans-serif;
          background: var(--bg, #070709);
          color: var(--text, #f0ede8);
          text-align: center;
          gap: 0;
        }

        /* scanline */
        .nf-scanline {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          overflow: hidden;
        }
        .nf-scanline::after {
          content: '';
          position: absolute; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(139,92,246,0.3), transparent);
          animation: nf-scanline 4s linear infinite;
        }

        /* grid bg */
        .nf-grid {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }

        /* orb */
        .nf-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
          filter: blur(80px);
          animation: nf-pulse 4s ease-in-out infinite;
        }
        .nf-orb1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 60%);
          top: 50%; left: 50%; transform: translate(-50%,-50%);
          animation-delay: 0s;
        }

        /* orbit dots */
        .nf-orbit-ring {
          position: absolute; width: 280px; height: 280px;
          top: 50%; left: 50%; margin-left: -140px; margin-top: -140px;
          border: 1px dashed rgba(139,92,246,0.15);
          border-radius: 50%; z-index: 1; pointer-events: none;
        }
        .nf-orbit-ring2 {
          width: 200px; height: 200px;
          margin-left: -100px; margin-top: -100px;
          border-color: rgba(212,160,23,0.12);
        }
        .nf-dot {
          position: absolute; width: 8px; height: 8px;
          border-radius: 50%;
          top: 50%; left: 50%; margin: -4px;
          background: var(--accent, #8b5cf6);
          box-shadow: 0 0 12px rgba(139,92,246,0.8);
          animation: nf-orbit 8s linear infinite;
        }
        .nf-dot2 {
          width: 6px; height: 6px; margin: -3px;
          background: #D4A017;
          box-shadow: 0 0 10px rgba(212,160,23,0.8);
          animation: nf-orbit2 5s linear infinite;
        }

        /* 404 number */
        .nf-number-wrap {
          position: relative; z-index: 2;
          animation: nf-float 6s ease-in-out infinite;
          margin-bottom: 8px;
        }
        .nf-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(7rem, 22vw, 16rem);
          font-weight: 700; line-height: 1;
          letter-spacing: -0.04em;
          color: var(--text, #f0ede8);
          position: relative;
          display: block;
          user-select: none;
        }
        .nf-number::before {
          content: '404';
          position: absolute; inset: 0;
          color: var(--accent, #8b5cf6);
          animation: nf-glitch1 7s step-end infinite;
        }
        .nf-number::after {
          content: '404';
          position: absolute; inset: 0;
          animation: nf-glitch2 7s step-end infinite;
        }

        .nf-content {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
          animation: nf-fadein 0.8s ease 0.3s both;
        }
        .nf-label {
          font-size: 0.65rem; font-weight: 800;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--accent, #8b5cf6);
          border: 1px solid rgba(139,92,246,0.3);
          padding: 5px 16px; border-radius: 99px;
          background: rgba(139,92,246,0.07);
        }
        .nf-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.4rem, 4vw, 2.2rem);
          font-weight: 300; color: var(--text-dim, #64605a);
          letter-spacing: 0.02em; margin: 0;
        }
        .nf-sub {
          font-size: 0.84rem; color: var(--text-dim, #64605a);
          line-height: 1.7; max-width: 360px;
        }
        .nf-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 13px 28px;
          background: rgba(139,92,246,0.12);
          border: 1px solid rgba(139,92,246,0.35);
          border-radius: 99px; cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 0.76rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text, #f0ede8);
          text-decoration: none;
          transition: all 0.25s;
          margin-top: 8px;
        }
        .nf-btn:hover {
          background: rgba(139,92,246,0.22);
          border-color: rgba(139,92,246,0.6);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(139,92,246,0.2);
        }
        .nf-divider {
          width: 48px; height: 1px;
          background: linear-gradient(to right, transparent, rgba(139,92,246,0.5), transparent);
          margin: 4px auto;
        }
      `}</style>

      <div className="nf-wrap">
        <div className="nf-scanline" />
        <div className="nf-grid" />
        <div className="nf-orb nf-orb1" />

        <div className="nf-orbit-ring">
          <div className="nf-dot" />
        </div>
        <div className="nf-orbit-ring nf-orbit-ring2">
          <div className="nf-dot nf-dot2" />
        </div>

        <div className="nf-number-wrap">
          <span className="nf-number">404</span>
        </div>

        <div className="nf-content">
          <span className="nf-label">Error · Page Not Found</span>
          <div className="nf-divider" />
          <h1 className="nf-title">Halaman tidak ditemukan</h1>
          <p className="nf-sub">
            Sepertinya URL yang kamu tuju tidak ada atau sudah dipindahkan.
            Balik ke halaman utama yuk!
          </p>
          <a href="/" className="nf-btn">
            <i className="fa-solid fa-arrow-left" />
            Kembali ke Home
          </a>
        </div>
      </div>
    </>
  );
}



export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { lang, t, toggleLang } = useLang();
  return (
    <>
      <ScrollToTop />
      <Navbar t={t} lang={lang} toggleLang={toggleLang} theme={theme} toggleTheme={toggleTheme} />
      <main style={{ paddingTop: '64px' }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home t={t} />} />
            <Route path="/porto" element={<Porto t={t} />} />
            <Route path="/porto/karya1" element={<PortoKarya1 t={t} />} />
            <Route path="/porto/karya2" element={<PortoKarya2 t={t} />} />
            <Route path="/porto/karya3" element={<PortoKarya3 t={t} />} />
            <Route path="/porto/karya4" element={<PortoKarya4 t={t} />} />
            <Route path="/tentang" element={<Tentang t={t} />} />
            <Route path="/journal" element={<Journal t={t} />} />
            <Route path="/journal/karya1" element={<JournalKarya1 t={t} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/price-list" element={<PriceList />} />
            <Route path="/preview-logo" element={<PreviewLogo/>} />
            
            {/* ── Rute Baru untuk Dashboard & Pembayaran Kamu ── */}
            <Route path="/checkout" element={<CheckoutQRIS />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer t={t} />
    </>
  );
}

/* Loader Sederhana saat nunggu Lazy Load selesai */
function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: '0.9rem', letterSpacing: '0.1em', color: '#666'
    }}>
      LOADING...
    </div>
  );
}