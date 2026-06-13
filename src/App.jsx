import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTheme, useLang } from './hooks/useApp';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import PageTransition from './components/PageTransition';
import CustomCursor from './components/CustomCursor';
import FloatingUtils from './components/FloatingUtils';

import { auth, db } from './pages/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

/* ── Lazy load — halaman yang sudah ada & dipertahankan ── */
const Home          = lazy(() => import('./pages/Home'));
const Journal       = lazy(() => import('./pages/Journal'));
const JournalKarya1 = lazy(() => import('./pages/JournalKarya1'));
const Contact       = lazy(() => import('./pages/Contact'));
const Terms         = lazy(() => import('./pages/Terms'));
const PriceList     = lazy(() => import('./pages/PriceList'));
const CheckoutQRIS  = lazy(() => import('./pages/CheckoutQRIS'));
const AuthLogin     = lazy(() => import('./pages/AuthLogin'));
const PreviewLogo   = lazy(() => import('./pages/PreviewLogo')); // utility, dipertahankan

/* ── Lazy load — renamed imports ── */
const Works           = lazy(() => import('./pages/Works'));               // was Porto
const WorkDetail1     = lazy(() => import('./pages/WorkDetail1'));         // was PortoKarya1
const WorkDetail2     = lazy(() => import('./pages/WorkDetail2'));         // was PortoKarya2
const WorkDetail3     = lazy(() => import('./pages/WorkDetail3'));         // was PortoKarya3
const WorkDetail4     = lazy(() => import('./pages/WorkDetail4'));         // was PortoKarya4
const About           = lazy(() => import('./pages/About'));               // was Tentang
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));    // was Dashboard
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard'));     // was DashboardAdmin
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'));

/* ── Lazy load — WorkDetail5–20 (semua file baru) ── */
const WorkDetail5  = lazy(() => import('./pages/WorkDetail5'));
const WorkDetail6  = lazy(() => import('./pages/WorkDetail6'));
const WorkDetail7  = lazy(() => import('./pages/WorkDetail7'));
const WorkDetail8  = lazy(() => import('./pages/WorkDetail8'));
const WorkDetail9  = lazy(() => import('./pages/WorkDetail9'));
const WorkDetail10 = lazy(() => import('./pages/WorkDetail10'));
const WorkDetail11 = lazy(() => import('./pages/WorkDetail11'));
const WorkDetail12 = lazy(() => import('./pages/WorkDetail12'));
const WorkDetail13 = lazy(() => import('./pages/WorkDetail13'));
const WorkDetail14 = lazy(() => import('./pages/WorkDetail14'));
const WorkDetail15 = lazy(() => import('./pages/WorkDetail15'));
const WorkDetail16 = lazy(() => import('./pages/WorkDetail16'));
const WorkDetail17 = lazy(() => import('./pages/WorkDetail17'));
const WorkDetail18 = lazy(() => import('./pages/WorkDetail18'));
const WorkDetail19 = lazy(() => import('./pages/WorkDetail19'));
const WorkDetail20 = lazy(() => import('./pages/WorkDetail20'));
const WorkDetail21 = lazy(() => import('./pages/WorkDetail21')); // editing-praktikum-biologi-2026
const WorkDetail22 = lazy(() => import('./pages/WorkDetail22')); // mindova-poster-2026
const WorkDetail23 = lazy(() => import('./pages/WorkDetail23')); // poster-fomo-2026
const WorkDetail24 = lazy(() => import('./pages/WorkDetail24')); // poster-waktu-untuk-diri-2026
const WorkDetail25 = lazy(() => import('./pages/WorkDetail25')); // lanyard-kelas-2026
const WorkDetail26 = lazy(() => import('./pages/WorkDetail26')); // lanyard-genesis-2026
const WorkDetail27 = lazy(() => import('./pages/WorkDetail27')); // lanyard-ekstrakurikuler-2026

/* ── 404 — lazy (file dibuat sebagai NotFound.jsx) ── */
const NotFound = lazy(() => import('./pages/NotFound'));

/* ══════════════════════════════════════════════════════
   ROOT APP — auth state di level tertinggi
══════════════════════════════════════════════════════ */
export default function App() {
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
    <>
      <CustomCursor />
      <FloatingUtils />
      <LoadingScreen />
      <BrowserRouter>
        <Layout user={user} />
      </BrowserRouter>
    </>
  );
}

/* ══════════════════════════════════════════════════════
   SCROLL TO TOP — reset scroll setiap pindah halaman
══════════════════════════════════════════════════════ */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* ══════════════════════════════════════════════════════
   LAYOUT — theme, lang, navbar, footer, routes
══════════════════════════════════════════════════════ */
function Layout({ user }) {
  const { theme, toggleTheme } = useTheme();
  const { lang, t, toggleLang } = useLang();
  const location = useLocation();
  const { pathname } = location;

  const ADMIN_EMAIL = 'aldokraksaan@gmail.com';

  /* ── Cek kelengkapan profil user (phone di Firestore) ── */
  const [userProfileComplete, setUserProfileComplete] = useState(true);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      if (!snap.exists() || !snap.data()?.phone) {
        setUserProfileComplete(false);
      } else {
        setUserProfileComplete(true);
      }
    }).catch(() => {
      // Jika gagal baca Firestore, anggap lengkap agar tidak loop redirect
      setUserProfileComplete(true);
    });
  }, [user]);

  /* ── Halaman fullscreen: tidak pakai Navbar & Footer ── */
  const isFullscreen = [
    '/Dashboard',
    '/admin-dashboard',
    '/login',
    '/complete-profile',
  ].includes(pathname);

  return (
    <>
      <ScrollToTop />

      {!isFullscreen && (
        <Navbar
          t={t}
          lang={lang}
          toggleLang={toggleLang}
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
        />
      )}

      <main style={{ paddingTop: isFullscreen ? '0' : '64px' }}>
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Routes location={location} key={location.pathname}>

                {/* ── PUBLIC PAGES ── */}
                <Route path="/"               element={<Home t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/about"          element={<About t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/price-list"     element={<PriceList t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/terms"          element={<Terms t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/contact"        element={<Contact t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/journal"        element={<Journal t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/journal/karya1" element={<JournalKarya1 t={t} lang={lang} toggleLang={toggleLang} />} />

                {/* ── UTILITY (dipertahankan dari versi lama) ── */}
                <Route path="/preview-logo"   element={<PreviewLogo t={t} lang={lang} toggleLang={toggleLang} />} />

                {/* ── WORKS GALLERY ── */}
                <Route path="/works" element={<Works t={t} lang={lang} toggleLang={toggleLang} />} />

                {/* ── WORK DETAILS (renamed dari /porto/*) ── */}
                <Route path="/works/birthday-gift"     element={<WorkDetail1 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/wedding-invite"    element={<WorkDetail2 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/video-collection"  element={<WorkDetail3 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/livestream-perbasi" element={<WorkDetail4 t={t} lang={lang} toggleLang={toggleLang} />} />

                {/* ── WORK DETAILS NEW (WorkDetail5–20) ── */}
                <Route path="/works/sarka-2023"                     element={<WorkDetail5 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/pramu-rasa-2023"                element={<WorkDetail6 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/ruang-kepala-2024"              element={<WorkDetail7 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/rantai-2024"                    element={<WorkDetail8 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/luka-menjadi-lukisan-2024"      element={<WorkDetail9 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/jalan-tengah-2024"              element={<WorkDetail10 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/sma-awards-sinematografi-2024"  element={<WorkDetail11 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/teaser-alterio-mpls-2024"       element={<WorkDetail12 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/guru-kita-yang-jahat-2025"      element={<WorkDetail13 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/suara-sumbang-angin-utara-2025" element={<WorkDetail14 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/video-profil-uswatun-2025"      element={<WorkDetail15 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/video-profil-iwan-2025"         element={<WorkDetail16 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/senam-indonesia-hebat-2025"     element={<WorkDetail17 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/duta-pelajar-putri-2024"        element={<WorkDetail18 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/parlemen-remaja-faza-2025"      element={<WorkDetail19 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/video-kreatif-antikorupsi-2025" element={<WorkDetail20 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/editing-praktikum-biologi-2026"  element={<WorkDetail21 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/mindova-poster-2026"             element={<WorkDetail22 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/poster-fomo-2026"                element={<WorkDetail23 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/poster-waktu-untuk-diri-2026"    element={<WorkDetail24 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/lanyard-kelas-2026"              element={<WorkDetail25 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/lanyard-genesis-2026"            element={<WorkDetail26 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/lanyard-ekstrakurikuler-2026"    element={<WorkDetail27 t={t} lang={lang} toggleLang={toggleLang} />} />

                {/* ── LEGACY REDIRECTS (porto/* → works/*) ── */}
                <Route path="/porto"        element={<Navigate to="/works" replace />} />
                <Route path="/tentang"      element={<Navigate to="/about" replace />} />
                <Route path="/porto/karya1" element={<Navigate to="/works/birthday-gift" replace />} />
                <Route path="/porto/karya2" element={<Navigate to="/works/wedding-invite" replace />} />
                <Route path="/porto/karya3" element={<Navigate to="/works/video-collection" replace />} />
                <Route path="/porto/karya4" element={<Navigate to="/works/livestream-perbasi" replace />} />

                {/* ── AUTH & PROTECTED ── */}
                <Route path="/login" element={<AuthLogin />} />

                <Route
                  path="/complete-profile"
                  element={
                    user ? <CompleteProfile /> : <Navigate to="/login" replace />
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    user ? <CheckoutQRIS /> : <Navigate to="/login" replace />
                  }
                />

                {/* ── CLIENT DASHBOARD ── */}
                <Route
                  path="/Dashboard"
                  element={
                    user
                      ? (!userProfileComplete
                          ? <Navigate to="/complete-profile" replace />
                          : <ClientDashboard />)
                      : <Navigate to="/login" replace />
                  }
                />

                {/* ── ADMIN DASHBOARD ── */}
                <Route
                  path="/admin-dashboard"
                  element={
                    user && user.email === ADMIN_EMAIL
                      ? <AdminDashboard />
                      : <Navigate to="/login" replace />
                  }
                />

                {/* ── 404 NOT FOUND — selalu paling bawah ── */}
                <Route path="*" element={<NotFound />} />

              </Routes>
            </PageTransition>
          </Suspense>
        </AnimatePresence>
      </main>

      {!isFullscreen && <Footer t={t} />}
    </>
  );
}

/* ══════════════════════════════════════════════════════
   PAGE LOADER — fallback saat lazy load
══════════════════════════════════════════════════════ */
function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.9rem',
      letterSpacing: '0.1em',
      color: '#666',
    }}>
      LOADING...
    </div>
  );
}
