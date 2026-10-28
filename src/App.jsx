import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTheme, useLang } from './hooks/useApp';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import PageTransition from './components/PageTransition';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import FloatingUtils from './components/FloatingUtils';
import { isMascotRouteHidden, readMascotHidden, MASCOT_EVENT } from './lib/leoMascot';

import { auth, db, supabase } from '@/supabaseClient';
import { onAuthStateChanged } from '@/lib/authCompat';
import { doc, getDoc } from '@/lib/firestoreCompat';

/* ── Lazy load — halaman yang sudah ada & dipertahankan ── */
const Home          = lazy(() => import('./pages/Home'));
const Journal       = lazy(() => import('./pages/Journal'));
const JournalKarya1 = lazy(() => import('./pages/JournalKarya1'));
const Contact       = lazy(() => import('./pages/Contact'));
const Terms         = lazy(() => import('./pages/Terms'));
const PriceList     = lazy(() => import('./pages/PriceList'));
const CheckoutQRIS  = lazy(() => import('./pages/CheckoutQRIS'));
const AuthLogin     = lazy(() => import('./pages/AuthLogin'));
const PreviewLogo   = lazy(() => import('./pages/PreviewLogo'));

/* ── Lazy load — renamed imports ── */
const Works           = lazy(() => import('./pages/Works'));
const WorkDetail1     = lazy(() => import('./pages/WorkDetail1'));
const WorkDetail2     = lazy(() => import('./pages/WorkDetail2'));
const WorkDetail3     = lazy(() => import('./pages/WorkDetail3'));
const WorkDetail4     = lazy(() => import('./pages/WorkDetail4'));
const About           = lazy(() => import('./pages/About'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard'));
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'));

/* ── Lazy load — WorkDetail5–28 ── */
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
const WorkDetail21 = lazy(() => import('./pages/WorkDetail21'));
const WorkDetail22 = lazy(() => import('./pages/WorkDetail22'));
const WorkDetail23 = lazy(() => import('./pages/WorkDetail23'));
const WorkDetail24 = lazy(() => import('./pages/WorkDetail24'));
const WorkDetail25 = lazy(() => import('./pages/WorkDetail25'));
const WorkDetail26 = lazy(() => import('./pages/WorkDetail26'));
const WorkDetail27 = lazy(() => import('./pages/WorkDetail27'));
const WorkDetail28 = lazy(() => import('./pages/WorkDetail28'));

/* ── 404 & Pengeluaran ── */
const NotFound    = lazy(() => import('./pages/NotFound'));

/* ── Makrab 2026 (privat, tidak ada di navbar) ── */
const Makrab      = lazy(() => import('./pages/Makrab'));

/* ── Quiz pages — fullscreen, tidak ada di navbar ──
 *  Untuk menambah quiz baru:
 *  1. Buat file di src/pages/ (contoh: FarmakologiQuiz.jsx)
 *  2. Import lazy di bawah ini
 *  3. Tambah path ke QUIZ_PATHS
 *  4. Tambah <Route> di bagian QUIZ PAGES
 * ─────────────────────────────────────────────────── */
const Quiziz              = lazy(() => import('./pages/quiziz/Quiziz'));
const QuizizUAS            = lazy(() => import('./pages/quiziz/QuizizUAS'));
const QuizBahasaInggris    = lazy(() => import('./pages/quiziz/QuizBahasaInggris'));
const MateriBahasaInggris  = lazy(() => import('./pages/quiziz/MateriBahasaInggris'));
const QuizFTK               = lazy(() => import('./pages/quiziz/QuizFTK'));
const QuizPAI                = lazy(() => import('./pages/quiziz/QuizPAI'));
const QuizKDK                = lazy(() => import('./pages/quiziz/QuizKDK'));
const QuizPancasila          = lazy(() => import('./pages/quiziz/QuizPancasila'));
const QuizKesglob            = lazy(() => import('./pages/quiziz/QuizKesglob'));
const QuizIBD                = lazy(() => import('./pages/quiziz/QuizIBD'));
const QuizKomdas             = lazy(() => import('./pages/quiziz/QuizKomdas'));
// const FarmakologiQuiz = lazy(() => import('./pages/FarmakologiQuiz')); // ← contoh tambah baru

const LeoMascot = lazy(() => import('./components/LeoMascot'));

/* Loads the mascot chunk only after idle, on wide screens, off hidden routes and when not dismissed. */
function MascotMount({ pathname, lang }) {
  const [idle, setIdle] = useState(false);
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 700px)').matches);
  const [dismissed, setDismissed] = useState(readMascotHidden);
  useEffect(() => {
    const go = () => setIdle(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(go, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(go, 1500);
    return () => clearTimeout(id);
  }, []);
  useEffect(() => {
    const m = window.matchMedia('(min-width: 700px)');
    const onMq = () => setWide(m.matches);
    const onPref = () => setDismissed(readMascotHidden());
    m.addEventListener('change', onMq);
    window.addEventListener(MASCOT_EVENT, onPref);
    return () => { m.removeEventListener('change', onMq); window.removeEventListener(MASCOT_EVENT, onPref); };
  }, []);
  if (!idle || !wide || dismissed || isMascotRouteHidden(pathname)) return null;
  return <Suspense fallback={null}><LeoMascot lang={lang} /></Suspense>;
}

/** Semua path quiz: dipakai untuk isFullscreen & hide FloatingUtils */
const QUIZ_PATHS = [
  '/quiziz',
  '/quizizuas',
  '/quiziz/bahasainggris',
  '/quiziz/bahasainggris/materi',
  '/quiziz/ftk',
  '/quiziz/pai',
  '/quiziz/kdk',
  '/quiziz/pancasila',
  '/quiziz/kesglob',
  '/quiziz/ibd',
  '/quiziz/komdas',
  // '/quiz-farmakologi', // ← tambahkan di sini juga
];

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

  return (
    <>
      <CustomCursor />
      <Preloader />
      {loadingAuth && <LoadingScreen />}
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
    if (!user) return undefined;
    let alive = true;
    getDoc(doc(db, 'users', user.uid)).then(async snap => {
      if (!alive) return;
      if (snap.exists() && snap.data()?.phone) { setUserProfileComplete(true); return; }
      // Anggota Makrab (login Google dll.) tidak dipaksa mengisi profil klien
      let member = false;
      try {
        const { data } = await supabase.from('makrab_members').select('id').limit(1);
        member = !!(data && data.length);
      } catch { /* abaikan: dianggap bukan anggota */ }
      if (alive) setUserProfileComplete(member);
    }).catch(() => {
      if (alive) setUserProfileComplete(true);
    });
    // CompleteProfile memberi tahu App setelah profil tersimpan, supaya tidak mental balik ke /complete-profile
    const onDone = () => setUserProfileComplete(true);
    window.addEventListener('synw:profile-complete', onDone);
    return () => { alive = false; window.removeEventListener('synw:profile-complete', onDone); };
  }, [user]);

  /* ── Halaman fullscreen: tidak pakai Navbar & Footer ── */
  const isFullscreen = [
    '/Dashboard',
    '/admin-dashboard',
    '/login',
    '/complete-profile',
    '/makrab',
    ...QUIZ_PATHS,
  ].includes(pathname);

  /* ── Halaman quiz: sembunyikan FloatingUtils ── */
  const isQuizPage = QUIZ_PATHS.includes(pathname) || pathname === '/makrab';

  return (
    <>
      <ScrollToTop />

      {/* FloatingUtils disembunyikan di semua halaman quiz */}
      {!isQuizPage && <FloatingUtils />}
      <MascotMount pathname={pathname} lang={lang} />

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

                {/* ── PENGELUARAN PRIBADI ── */}
                <Route path="/pengeluaran" element={<Navigate to="/admin-dashboard?tab=pengeluaran" replace />} />

                {/* ── UTILITY ── */}
                <Route path="/preview-logo" element={<PreviewLogo t={t} lang={lang} toggleLang={toggleLang} />} />

                {/* ── WORKS GALLERY ── */}
                <Route path="/works" element={<Works t={t} lang={lang} toggleLang={toggleLang} />} />

                {/* ── WORK DETAILS ── */}
                <Route path="/works/birthday-gift"              element={<WorkDetail1  t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/wedding-invite"             element={<WorkDetail2  t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/video-collection"           element={<WorkDetail3  t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/livestream-perbasi"         element={<WorkDetail4  t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/sarka-2023"                 element={<WorkDetail5  t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/pramu-rasa-2023"            element={<WorkDetail6  t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/ruang-kepala-2024"          element={<WorkDetail7  t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/rantai-2024"                element={<WorkDetail8  t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/luka-menjadi-lukisan-2024"  element={<WorkDetail9  t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/jalan-tengah-2024"          element={<WorkDetail10 t={t} lang={lang} toggleLang={toggleLang} />} />
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
                <Route path="/works/editing-praktikum-biologi-2026" element={<WorkDetail21 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/mindova-poster-2026"            element={<WorkDetail22 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/poster-fomo-2026"               element={<WorkDetail23 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/poster-waktu-untuk-diri-2026"   element={<WorkDetail24 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/lanyard-kelas-2026"             element={<WorkDetail25 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/lanyard-genesis-2026"           element={<WorkDetail26 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/lanyard-ekstrakurikuler-2026"   element={<WorkDetail27 t={t} lang={lang} toggleLang={toggleLang} />} />
                <Route path="/works/leo-notch-windows"              element={<WorkDetail28 t={t} lang={lang} toggleLang={toggleLang} />} />

                {/* ── LEGACY REDIRECTS ── */}
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
                  element={user ? <CompleteProfile /> : <Navigate to="/login" replace />}
                />

                <Route
                  path="/checkout"
                  element={user ? <CheckoutQRIS /> : <Navigate to="/login" replace />}
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

                {/* ══════════════════════════════════════════
                    QUIZ PAGES — fullscreen, tidak di navbar
                    Untuk tambah quiz baru: ikuti pola di sini
                ══════════════════════════════════════════ */}
                <Route path="/quiziz"                      element={<Quiziz />} />
                <Route path="/quizizuas"                    element={<QuizizUAS />} />
                <Route path="/quiziz/bahasainggris"         element={<QuizBahasaInggris />} />
                <Route path="/quiziz/bahasainggris/materi"  element={<MateriBahasaInggris />} />
                <Route path="/quiziz/ftk"                   element={<QuizFTK />} />
                <Route path="/quiziz/pai"                   element={<QuizPAI />} />
                <Route path="/quiziz/kdk"                   element={<QuizKDK />} />
                <Route path="/quiziz/pancasila"             element={<QuizPancasila />} />
                <Route path="/quiziz/kesglob"                element={<QuizKesglob />} />
                <Route path="/quiziz/ibd"                    element={<QuizIBD />} />
                <Route path="/quiziz/komdas"                 element={<QuizKomdas />} />
                {/* <Route path="/quiz-farmakologi" element={<FarmakologiQuiz />} /> */}

                {/* ── MAKRAB 2026 — privat; akses dicek di dalam halaman (RLS) ── */}
                <Route path="/makrab" element={<Makrab />} />

                {/* ── 404 — selalu paling bawah ── */}
                <Route path="*" element={<NotFound />} />

              </Routes>
            </PageTransition>
          </Suspense>
        </AnimatePresence>
      </main>

      {!isFullscreen && <Footer t={t} lang={lang} />}
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