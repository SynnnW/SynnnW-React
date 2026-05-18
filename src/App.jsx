import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTheme, useLang } from './hooks/useApp';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Porto from './pages/Porto';
import Tentang from './pages/Tentang';
import Journal from './pages/Journal';
import JournalKarya1 from './pages/JournalKarya1';
import Contact from './pages/Contact';
import PortoKarya1 from './pages/PortoKarya1';
import PortoKarya2 from './pages/PortoKarya2';
import PortoKarya3 from './pages/PortoKarya3';
import PortoKarya4 from './pages/PortoKarya4';

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
          <Route path="/contact" element={<Contact t={t} />} />
        </Routes>
      </main>
      <Footer t={t} />
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