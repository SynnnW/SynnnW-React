import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CSS = `
/* ── Page ── */
.tnc-page {
  min-height: 100vh;
  background: var(--bg);
  padding-top: 64px;
  position: relative;
  overflow-x: hidden;
  font-family: 'Outfit', sans-serif;
}

/* ── Orbs ── */
.tnc-orb {
  position: fixed; border-radius: 50%;
  pointer-events: none; filter: blur(110px); z-index: 0;
}
.tnc-orb1 {
  width: 550px; height: 550px;
  background: radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 65%);
  top: -180px; left: -180px;
}
.tnc-orb2 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%);
  bottom: -80px; right: -80px;
}

/* ── Reveal ── */
.tnc-reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.tnc-reveal.visible {
  opacity: 1;
  transform: none;
}
.tnc-d1 { transition-delay: 0.06s; }
.tnc-d2 { transition-delay: 0.12s; }
.tnc-d3 { transition-delay: 0.18s; }
.tnc-d4 { transition-delay: 0.24s; }

/* ── Wrap ── */
.tnc-wrap {
  position: relative; z-index: 1;
  max-width: 860px;
  margin: 0 auto;
  padding: 0 28px 100px;
}

/* ── Hero ── */
.tnc-hero {
  padding: 72px 0 56px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 52px;
}
.tnc-page-label {
  display: inline-block;
  font-size: 0.58rem; font-weight: 700;
  letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--accent3);
  margin-bottom: 20px;
}
.tnc-hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.6rem, 5.5vw, 4.8rem);
  font-weight: 300; line-height: 1.08;
  color: var(--text);
  margin: 0 0 18px;
  letter-spacing: -0.02em;
}
.tnc-hero-title em {
  font-style: italic;
  color: var(--accent3);
}
.tnc-hero-sub {
  font-size: 0.9rem;
  color: var(--text-dim);
  line-height: 1.8;
  max-width: 580px;
  margin: 0 0 28px;
}

/* ── Meta pills ── */
.tnc-meta {
  display: flex; flex-wrap: wrap; gap: 10px;
}
.tnc-meta-pill {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 7px 14px;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 99px;
  font-size: 0.68rem; font-weight: 600;
  color: var(--text-dim); letter-spacing: 0.04em;
}
.tnc-meta-pill i { color: var(--accent3); font-size: 0.62rem; }

/* ── TOC ── */
.tnc-toc {
  background: var(--glass);
  border: 1px solid var(--gborder);
  border-radius: 20px;
  padding: 24px 28px;
  margin-bottom: 48px;
  backdrop-filter: var(--blur);
}
.tnc-toc-label {
  font-size: 0.58rem; font-weight: 700;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--accent3); margin: 0 0 16px;
}
.tnc-toc-list {
  display: flex; flex-direction: column; gap: 6px;
  list-style: none; margin: 0; padding: 0;
}
.tnc-toc-item a {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.78rem; font-weight: 500;
  color: var(--text-dim);
  text-decoration: none;
  padding: 5px 0;
  transition: color 0.2s;
}
.tnc-toc-item a:hover { color: var(--accent3); }
.tnc-toc-num {
  font-size: 0.6rem; font-weight: 700;
  color: var(--accent3); opacity: 0.6;
  min-width: 18px;
}

/* ── Section ── */
.tnc-section {
  margin-bottom: 48px;
  padding-bottom: 48px;
  border-bottom: 1px solid var(--border);
}
.tnc-section:last-of-type {
  border-bottom: none;
}
.tnc-section-head {
  display: flex; align-items: flex-start; gap: 16px;
  margin-bottom: 18px;
}
.tnc-section-num {
  font-size: 0.58rem; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--accent3); opacity: 0.7;
  margin-top: 5px; flex-shrink: 0;
}
.tnc-section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.3rem, 2.2vw, 1.75rem);
  font-weight: 400; color: var(--text);
  margin: 0; letter-spacing: -0.01em;
}
.tnc-section-body {
  font-size: 0.88rem; color: var(--text-dim);
  line-height: 1.85;
  padding-left: 34px;
}
.tnc-section-body p { margin: 0 0 14px; }
.tnc-section-body p:last-child { margin-bottom: 0; }
.tnc-section-body strong { color: var(--text); font-weight: 600; }

/* ── List points ── */
.tnc-points {
  list-style: none; margin: 14px 0 14px; padding: 0;
  display: flex; flex-direction: column; gap: 10px;
}
.tnc-points li {
  display: flex; gap: 10px;
  font-size: 0.85rem; color: var(--text-dim); line-height: 1.7;
}
.tnc-points li::before {
  content: '';
  display: block; flex-shrink: 0;
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--accent3); opacity: 0.6;
  margin-top: 9px;
}

/* ── Highlight box ── */
.tnc-highlight {
  display: flex; gap: 14px;
  padding: 16px 20px;
  background: rgba(139,92,246,0.06);
  border: 1px solid rgba(139,92,246,0.18);
  border-radius: 14px;
  margin: 16px 0;
}
.tnc-highlight i {
  color: var(--accent3); font-size: 0.95rem; margin-top: 2px; flex-shrink: 0;
}
.tnc-highlight p {
  font-size: 0.83rem; color: var(--text-dim);
  line-height: 1.75; margin: 0;
}
.tnc-highlight p strong { color: var(--text); }

/* ── Warning box ── */
.tnc-warn {
  display: flex; gap: 14px;
  padding: 16px 20px;
  background: rgba(251,191,36,0.05);
  border: 1px solid rgba(251,191,36,0.2);
  border-radius: 14px;
  margin: 16px 0;
}
.tnc-warn i {
  color: rgba(251,191,36,0.8); font-size: 0.95rem; margin-top: 2px; flex-shrink: 0;
}
.tnc-warn p {
  font-size: 0.83rem; color: var(--text-dim);
  line-height: 1.75; margin: 0;
}
.tnc-warn p strong { color: var(--text); }

/* ── Footer notice ── */
.tnc-footer-notice {
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 20px; padding: 28px 32px;
  backdrop-filter: var(--blur);
  text-align: center;
  margin-top: 60px;
}
.tnc-footer-notice h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem; font-weight: 400;
  color: var(--text); margin: 0 0 10px;
  letter-spacing: -0.01em;
}
.tnc-footer-notice p {
  font-size: 0.82rem; color: var(--text-dim);
  line-height: 1.75; margin: 0 0 20px;
}
.tnc-footer-notice .tnc-accept-date {
  font-size: 0.66rem; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--accent3); opacity: 0.7;
}

/* ── Back btn ── */
.tnc-btn-back {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 18px;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem; font-weight: 700;
  letter-spacing: 0.06em; color: var(--text-dim);
  text-decoration: none;
  transition: all 0.25s;
  margin-top: 20px;
  display: inline-flex;
}
.tnc-btn-back:hover {
  color: var(--text); border-color: var(--gborder2);
}
.tnc-btn-back i { font-size: 0.65rem; }

/* ── Responsive ── */
@media (max-width: 640px) {
  .tnc-wrap { padding: 0 18px 80px; }
  .tnc-hero { padding: 48px 0 40px; }
  .tnc-section-body { padding-left: 0; }
  .tnc-toc { padding: 18px 20px; }
}
`;

const SECTIONS = [
  {
    id: 'penggunaan',
    num: '01',
    title: 'Syarat Penggunaan',
    content: (
      <>
        <p>
          Layanan SynnnW Studio ditawarkan kepada Anda dengan syarat bahwa Anda menyetujui
          seluruh ketentuan, syarat, dan pemberitahuan yang tercantum dalam dokumen ini,
          berikut ketentuan tambahan yang mungkin berlaku untuk layanan tertentu.
        </p>
        <p>
          Dengan menggunakan layanan ini, Anda dianggap telah membaca, memahami, dan
          menyetujui seluruh Syarat & Ketentuan ini. Jika Anda tidak menyetujuinya,
          harap hentikan penggunaan layanan.
        </p>
      </>
    ),
  },
  {
    id: 'layanan',
    num: '02',
    title: 'Deskripsi Layanan',
    content: (
      <>
        <p>
          SynnnW Studio menyediakan jasa desain kreatif meliputi branding, identitas visual,
          desain logo, dan pekerjaan desain digital lainnya sesuai paket yang dipilih.
        </p>
        <p>
          Setiap deskripsi layanan, portofolio, dan preview yang ditampilkan di situs ini
          dibuat seakurat mungkin. Namun hasil akhir dapat berbeda karena setiap proyek
          dikerjakan secara unik dan personal sesuai brief klien.
        </p>
        <div className="tnc-highlight">
          <i className="fa-solid fa-circle-info" />
          <p>
            Kami selalu berusaha memberikan hasil terbaik sesuai brief yang diberikan.
            Komunikasi yang jelas di awal proyek sangat membantu proses pengerjaan.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'pemesanan',
    num: '03',
    title: 'Proses Pemesanan',
    content: (
      <>
        <p>
          Pemesanan dilakukan melalui formulir yang tersedia setelah login. Anda wajib
          mengisi data dengan benar dan lengkap, termasuk nama, kontak, dan detail brief
          desain yang diinginkan.
        </p>
        <p>Alur pemesanan adalah sebagai berikut:</p>
        <ul className="tnc-points">
          <li>Pilih paket di halaman Price List dan tambahkan ke keranjang.</li>
          <li>Lanjutkan ke halaman Checkout dan lakukan pembayaran DP via QRIS.</li>
          <li>Konfirmasi pembayaran via WhatsApp beserta bukti transfer dan Order ID.</li>
          <li>Pengerjaan dimulai setelah DP dikonfirmasi diterima.</li>
          <li>Pelunasan dilakukan setelah proyek selesai dan disetujui.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'pembayaran',
    num: '04',
    title: 'Pembayaran & DP',
    content: (
      <>
        <p>
          Semua harga yang tercantum di situs ini adalah dalam Rupiah (IDR) dan belum
          termasuk pajak. SynnnW Studio berhak mengubah harga sewaktu-waktu tanpa
          pemberitahuan sebelumnya.
        </p>
        <div className="tnc-warn">
          <i className="fa-solid fa-coins" />
          <p>
            <strong>Sistem DP 50%:</strong> Pembayaran awal sebesar 50% dari total harga
            wajib dibayarkan sebelum pengerjaan dimulai. Sisa 50% dibayarkan setelah
            proyek selesai dan disetujui klien.
          </p>
        </div>
        <p>
          Pembayaran dilakukan melalui QRIS. Bukti pembayaran wajib dikirimkan via
          WhatsApp beserta Order ID yang tertera di halaman checkout. Pesanan yang tidak
          dikonfirmasi dalam <strong>24 jam</strong> dianggap batal.
        </p>
      </>
    ),
  },
  {
    id: 'revisi',
    num: '05',
    title: 'Revisi & Persetujuan',
    content: (
      <>
        <p>
          Jumlah revisi yang tersedia disesuaikan dengan paket yang dipilih. Revisi di luar
          batas yang telah ditentukan dapat dikenakan biaya tambahan yang akan diinformasikan
          sebelumnya.
        </p>
        <ul className="tnc-points">
          <li>Permintaan revisi hanya berlaku selama periode pengerjaan aktif.</li>
          <li>Revisi yang mengubah konsep awal secara signifikan dianggap sebagai proyek baru.</li>
          <li>Klien bertanggung jawab memberikan feedback yang jelas dan spesifik.</li>
          <li>Persetujuan final dari klien diperlukan sebelum file dikirimkan.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'hak-cipta',
    num: '06',
    title: 'Hak Cipta & Kepemilikan',
    content: (
      <>
        <p>
          Setelah pelunasan penuh, hak kepemilikan desain final diserahkan kepada klien.
          SynnnW Studio berhak menampilkan karya tersebut sebagai bagian dari portofolio,
          kecuali klien meminta kerahasiaan secara tertulis.
        </p>
        <p>
          Seluruh konten yang terdapat di situs ini — termasuk teks, desain, logo, dan
          gambar — merupakan milik SynnnW Studio dan dilindungi oleh hukum hak cipta
          yang berlaku di Indonesia.
        </p>
        <div className="tnc-highlight">
          <i className="fa-solid fa-shield-halved" />
          <p>
            Klien menjamin bahwa semua aset, referensi, atau materi yang diberikan sebagai
            brief tidak melanggar hak kekayaan intelektual pihak lain.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'pembatalan',
    num: '07',
    title: 'Pembatalan Pesanan',
    content: (
      <>
        <p>
          Pembatalan pesanan dapat dilakukan sebelum pengerjaan dimulai. Setelah
          pengerjaan dimulai, DP yang telah dibayarkan <strong>tidak dapat dikembalikan</strong>.
        </p>
        <ul className="tnc-points">
          <li>Pembatalan sebelum pengerjaan: DP dikembalikan penuh.</li>
          <li>Pembatalan setelah pengerjaan dimulai: DP tidak dikembalikan.</li>
          <li>Pembatalan wajib dikomunikasikan via WhatsApp resmi.</li>
          <li>SynnnW Studio berhak membatalkan pesanan jika klien tidak responsif selama 7 hari kerja.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'privasi',
    num: '08',
    title: 'Kebijakan Privasi',
    content: (
      <>
        <p>
          Informasi pribadi Anda — termasuk nama, email, dan nomor telepon — hanya
          digunakan untuk keperluan penyelesaian pesanan dan komunikasi proyek.
          Data Anda tidak akan dijual, disewakan, atau dibagikan kepada pihak ketiga
          untuk tujuan komersial.
        </p>
        <p>
          Dengan menggunakan layanan ini, Anda menyetujui pengumpulan dan penggunaan
          informasi sesuai kebijakan ini. SynnnW Studio berkomitmen untuk menjaga
          keamanan data Anda.
        </p>
      </>
    ),
  },
  {
    id: 'pemberitahuan-privasi',
    num: '09',
    title: 'Pemberitahuan Privasi (Privacy Notice)',
    content: (
      <>
        <p>
          <strong>Pemberitahuan Privasi</strong> ("Pemberitahuan Privasi") berikut ini menjelaskan bagaimana 
          Kami, PT SynnnW Studio dan/atau afiliasi nya (selanjutnya disebut "SynnnW" atau "Kami") memperoleh, 
          mengumpulkan, menyimpan, menguasai, menggunakan, mengolah, menganalisa, memperbaiki, melakukan pembaruan, 
          menampilkan, mengumumkan, mentransfer, mengungkapkan dan melindungi Data Pribadi ("Memproses Data Pribadi" 
          atau melakukan "Pemrosesan Data Pribadi") milik klien yang menggunakan Aplikasi dan Layanan Kami untuk 
          menerima dan memproses transaksi dari pelanggannya ("Merchant"), maupun Data Pribadi milik pelanggan 
          sebagaimana dimaksud yang melakukan pembelian barang atau jasa yang ditawarkan oleh Merchant dan memproses 
          pembayaran atas transaksi pembelian barang atau jasa tersebut melalui Layanan Kami ("Pelanggan").
        </p>

        <p>
          Pemberitahuan Privasi ini berlaku untuk Anda, baik sebagai Merchant maupun Pelanggan ("Pengguna" atau 
          "Anda") aplikasi seluler Kami (SynnnW Studio App), situs web (www.synnwstudio.com dan situs-situs 
          turunannya), fitur, layanan, dan produk (secara bersama-sama disebut "Aplikasi") dan layanan-layanan 
          atau produk-produk lainnya yang dari waktu ke waktu disediakan oleh Kami, baik yang digunakan di dalam 
          maupun di luar Aplikasi Kami (Aplikasi beserta layanan atau produk lainnya sebagaimana dimaksud secara 
          bersama-sama disebut "Layanan"), kecuali diatur pada pemberitahuan privasi yang terpisah.
        </p>

        <p>
          Harap baca Pemberitahuan Privasi ini secara menyeluruh untuk memastikan bahwa Anda memahami praktik 
          pelindungan data Kami. Kami ingin membuat ini mudah dimengerti.
        </p>

        <div className="tnc-highlight">
          <i className="fa-solid fa-shield-halved" />
          <p>
            <strong>Pengakuan dan Persetujuan:</strong> Dengan menyetujui Pemberitahuan Privasi, Anda mengakui bahwa 
            Anda telah membaca dan memahami Pemberitahuan Privasi ini serta menyetujui segala ketentuannya.
          </p>
        </div>

        <ul className="tnc-points">
          <li><strong>Persetujuan untuk Pemrosesan Data:</strong> Anda sepakat dan memberikan persetujuan kepada Kami untuk Memproses Data Pribadi Anda sesuai dengan Pemberitahuan Privasi ini.</li>
          <li><strong>Data Pihak Ketiga:</strong> Jika Anda menyediakan kepada Kami Data Pribadi yang berkaitan dengan individu lain (seperti anggota keluarga, teman, atau pekerja), maka Anda menyatakan dan menjamin bahwa Anda telah memperoleh persetujuan dari individu tersebut.</li>
          <li><strong>Penarikan Persetujuan:</strong> Anda dapat menarik persetujuan Anda untuk setiap atau segala Pemrosesan Data Pribadi Anda kapan saja dengan memberikan kepada Kami pemberitahuan yang wajar secara tertulis.</li>
          <li><strong>Konsekuensi Penarikan:</strong> Anda harus memahami bahwa setelah penarikan persetujuan tersebut, Anda mungkin tidak lagi dapat menggunakan Layanan. Penarikan persetujuan Anda dapat mengakibatkan penghentian Layanan, penghapusan akun atau pengakhiran hubungan kontraktual Anda dengan Kami.</li>
        </ul>

        <div className="tnc-warn">
          <i className="fa-solid fa-info" />
          <p>
            Setelah menerima penarikan persetujuan dari Anda, Kami akan menginformasikan Anda tentang konsekuensi 
            yang mungkin terjadi dari penarikan tersebut sehingga Anda dapat memutuskan apakah Anda tetap ingin 
            menarik persetujuan. Kami berkomitmen untuk transparansi dalam semua komunikasi terkait data pribadi Anda.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'batasan',
    num: '10',
    title: 'Batasan Tanggung Jawab',
    content: (
      <>
        <p>
          SynnnW Studio tidak bertanggung jawab atas kerugian tidak langsung yang timbul
          dari penggunaan layanan ini, termasuk namun tidak terbatas pada kehilangan
          pendapatan, kehilangan data, atau gangguan bisnis.
        </p>
        <p>
          Kami tidak menjamin bahwa layanan akan tersedia tanpa gangguan atau bebas
          dari kesalahan. Dalam keadaan tertentu di luar kendali kami (force majeure),
          jadwal pengerjaan dapat mengalami penyesuaian.
        </p>
      </>
    ),
  },
  {
    id: 'hukum',
    num: '11',
    title: 'Hukum yang Berlaku',
    content: (
      <>
        <p>
          Syarat & Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku
          di <strong>Republik Indonesia</strong>. Segala sengketa yang timbul akan
          diselesaikan secara musyawarah terlebih dahulu.
        </p>
        <p>
          Pertanyaan, masukan, atau keluhan terkait layanan dapat disampaikan melalui
          WhatsApp resmi atau email yang tertera di halaman kontak.
        </p>
      </>
    ),
  },
];

export default function Terms() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.textContent = CSS;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    const els = containerRef.current?.querySelectorAll('.tnc-reveal');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const lastUpdated = 'Juni 2026';

  return (
    <div className="tnc-page" ref={containerRef}>
      {/* Orbs */}
      <div className="tnc-orb tnc-orb1" />
      <div className="tnc-orb tnc-orb2" />

      <div className="tnc-wrap">

        {/* ── Hero ── */}
        <div className="tnc-hero">
          <div className="tnc-reveal tnc-d1">
            <span className="tnc-page-label">Legal · SynnnW Studio</span>
          </div>
          <h1 className="tnc-hero-title tnc-reveal tnc-d2">
            Syarat &amp; <em>Ketentuan</em>
          </h1>
          <p className="tnc-hero-sub tnc-reveal tnc-d3">
            Harap baca ketentuan ini sebelum menggunakan layanan kami. Dengan melanjutkan
            pemesanan, Anda dianggap telah membaca dan menyetujui seluruh ketentuan berikut.
          </p>
          <div className="tnc-meta tnc-reveal tnc-d4">
            <span className="tnc-meta-pill">
              <i className="fa-solid fa-calendar-days" />
              Terakhir diperbarui: {lastUpdated}
            </span>
            <span className="tnc-meta-pill">
              <i className="fa-solid fa-gavel" />
              Berlaku di Indonesia
            </span>
            <span className="tnc-meta-pill">
              <i className="fa-solid fa-list-ol" />
              11 Pasal
            </span>
          </div>
        </div>

        {/* ── Table of Contents ── */}
        <div className="tnc-toc tnc-reveal">
          <p className="tnc-toc-label">Daftar Isi</p>
          <ul className="tnc-toc-list">
            {SECTIONS.map((s) => (
              <li key={s.id} className="tnc-toc-item">
                <a href={`#${s.id}`}>
                  <span className="tnc-toc-num">{s.num}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Sections ── */}
        {SECTIONS.map((s, i) => (
          <div
            key={s.id}
            id={s.id}
            className="tnc-section tnc-reveal"
            style={{ transitionDelay: `${0.05 * (i % 5)}s` }}
          >
            <div className="tnc-section-head">
              <span className="tnc-section-num">{s.num}</span>
              <h2 className="tnc-section-title">{s.title}</h2>
            </div>
            <div className="tnc-section-body">{s.content}</div>
          </div>
        ))}

        {/* ── Footer Notice ── */}
        <div className="tnc-footer-notice tnc-reveal">
          <h3>Dengan Memesan, Anda Menyetujui</h3>
          <p>
            Seluruh syarat dan ketentuan di atas berlaku untuk setiap transaksi yang dilakukan
            melalui platform SynnnW Studio. Dokumen ini dapat diperbarui sewaktu-waktu;
            versi terbaru selalu tersedia di halaman ini.
          </p>
          <span className="tnc-accept-date">Berlaku sejak {lastUpdated} · SynnnW Studio</span>
        </div>

        {/* ── Back button ── */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button className="tnc-btn-back tnc-reveal" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left" />
            Kembali
          </button>
        </div>

      </div>
    </div>
  );
}
