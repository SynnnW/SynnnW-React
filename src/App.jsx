import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useTheme, useLang } from './hooks/useApp';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Tambahan Firebase Auth
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

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
const Dashboard    = lazy(() => import('./pages/Dashboard'));
const PriceList    = lazy(() => import('./pages/PriceList'));
const CheckoutQRIS = lazy(() => import('./pages/CheckoutQRIS'));

// Lazy load komponen baru kita
const AuthLogin      = lazy(() => import('./pages/AuthLogin'));
const DashboardAdmin = lazy(() => import('./pages/DashboardAdmin'));

/* ── 404 Page (Biarkan Sesuai Kode Aslimu) ── */
function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      <h1>404 - Halaman tidak ditemukan</h1>
    </div>
  );
}

export default function App() {
  // Sistem deteksi login berjalan di level tertinggi aplikasi
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (loadingAuth) return <PageLoader />;

  return (
    <BrowserRouter>
      <Layout user={user} />
    </BrowserRouter>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout({ user }) {
  const { theme, toggleTheme } = useTheme();
  const { lang, t, toggleLang } = useLang();
  
  // Email Admin
  const ADMIN_EMAIL = "aldokraksaan@gmail.com";

  return (
    <>
      <ScrollToTop />
      <Navbar t={t} lang={lang} toggleLang={toggleLang} theme={theme} toggleTheme={toggleTheme} />
      <main style={{ paddingTop: '64px' }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Rute Bebas (Tidak Perlu Login) */}
            <Route path="/" element={<Home t={t} />} />
            <Route path="/porto" element={<Porto t={t} />} />
            <Route path="/porto/karya1" element={<PortoKarya1 t={t} />} />
            <Route path="/porto/karya2" element={<PortoKarya2 t={t} />} />
            <Route path="/porto/karya3" element={<PortoKarya3 t={t} />} />
            <Route path="/porto/karya4" element={<PortoKarya4 t={t} />} />
            <Route path="/tentang" element={<Tentang t={t} />} />
            <Route path="/journal" element={<Journal t={t} />} />
            <Route path="/journal/karya1" element={<JournalKarya1 t={t} />} />
            <Route path="/price-list" element={<PriceList />} />
            <Route path="/preview-logo" element={<PreviewLogo />} />
            
            {/* Halaman Login - Kalau sudah login, lempar menjauh dari halaman ini */}
            <Route 
              path="/login" 
              element={user ? <Navigate to={user.email === ADMIN_EMAIL ? "/admin-dashboard" : "/contact"} /> : <AuthLogin />} 
            />

            {/* RUTE TERPROTEKSI (Wajib Login) */}
            {/* Contact adalah halaman tempat form pemesanan setelah klik Checkout di PriceList */}
            <Route 
              path="/contact" 
              element={user ? <Contact t={t} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/checkout" 
              element={user ? <CheckoutQRIS t={t} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/Dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />

            {/* RUTE KHUSUS ADMIN (Hanya "aldokraksaan@gmail.com" yang bisa masuk) */}
            <Route 
              path="/admin-dashboard" 
              element={user && user.email === ADMIN_EMAIL ? <DashboardAdmin /> : <Navigate to="/login" />} 
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer t={t} />
    </>
  );
}

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', letterSpacing: '0.1em', color: '#666' }}>
      LOADING...
    </div>
  );
}
