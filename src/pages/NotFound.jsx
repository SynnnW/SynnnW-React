// src/pages/NotFound.jsx — 404 editorial: angka serif raksasa bergaris stabilo + maskot Pico (sedih)
import { Link, useNavigate } from 'react-router-dom';
import Mascot from '../components/mascot/Mascot';
import '../styles/chrome.css';

export default function NotFound({ lang = 'id' }) {
  const navigate = useNavigate();
  const id = lang !== 'en';
  const L = (en, idn) => (id ? idn : en);
  return (
    <section className="nf" aria-labelledby="nf-title">
      <div className="nf-meta">
        <span className="folio">(404) — {L('Page not found', 'Halaman tidak ditemukan')}</span>
        <span className="folio">SynnnW Studio</span>
      </div>

      <div className="nf-mascot"><Mascot mood="sad" size="100%" label={L('Pico looks sad: page not found', 'Pico tampak sedih: halaman tidak ditemukan')} /></div>

      <div className="nf-body">
        <div className="nf-num" aria-hidden="true"><span className="mark">404</span></div>
        <div className="nf-copy">
          <h1 id="nf-title">{L('This page took a ', 'Halaman ini sedang ')}<em>{L('wrong turn.', 'tersesat.')}</em></h1>
          <p>{L('The page you’re looking for doesn’t exist or has moved. Try the works index or head back home.', 'Halaman yang kamu cari tidak ada atau sudah dipindah. Coba lihat daftar karya atau kembali ke beranda.')}</p>
          <div className="nf-actions">
            <button type="button" className="pb pb--solid" onClick={() => navigate('/')}><i className="fa-solid fa-arrow-left" aria-hidden="true" />{L('Back home', 'Ke beranda')}</button>
            <Link to="/works" className="pb">{L('See works', 'Lihat karya')}</Link>
          </div>
        </div>
      </div>

      <div className="nf-foot"><span className="folio">{L('Tip: check the address for typos.', 'Tips: periksa kembali alamatnya.')}</span></div>
    </section>
  );
}
