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
const Dashboard   = lazy(() => import('./pages/Dashboard'));
const CheckoutQRIS = lazy(() => import('./pages/CheckoutQRIS'));

/* ── 404 Page ── */
function NotFound() {
  return (
    <div style={{
      minHeight: '80vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '16px',
      fontFamily: "'Cormorant Garamond', serif", textAlign: 'center',
      padding: '40px 24px',
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 300, margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.1rem', letterSpacing: '0.05em', color: '#888' }}>PAGE NOT FOUND</p>
    </div>
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
            
            {/* ── Rute Baru untuk Dashboard & Pembayaran Kamu ── */}
            <Route path="/dashboard" element={<Dashboard />} />
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