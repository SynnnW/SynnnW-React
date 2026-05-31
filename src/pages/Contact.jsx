import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const CSS = `
/* ── Variables (augment globals) ── */
:root {
  --glass3 : rgba(255,255,255,0.10);
  --gborder : rgba(255,255,255,0.09);
  --gborder2: rgba(255,255,255,0.16);
  --blur    : blur(18px) saturate(160%);
  --accent-g: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  --accent-g2: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
  --green   : #4ade80;
  --yellow  : rgba(251,191,36,0.85);
  --red     : rgba(239,68,68,0.85);
}
[data-theme="light"] {
  --gborder : rgba(0,0,0,0.10);
  --gborder2: rgba(0,0,0,0.18);
  --glass3  : rgba(0,0,0,0.06);
}

/* ── Page shell ── */
.cq-page {
  min-height: 100vh;
  background: var(--bg);
  padding-top: 64px;
}

/* ════════════════════════════════════
   WARNING SCREEN (empty cart)
════════════════════════════════════ */
.cq-warn-page {
  min-height: calc(100vh - 64px);
  display: flex; align-items: center; justify-content: center;
  padding: 48px 24px;
  position: relative; overflow: hidden;
}
.cq-warn-orb {
  position: absolute; border-radius: 50%;
  pointer-events: none; filter: blur(90px);
}
.cq-wo1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 65%);
  top: -100px; left: -80px;
}
.cq-wo2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%);
  bottom: -80px; right: -60px;
}
.cq-warn-card {
  position: relative; z-index: 1;
  max-width: 540px; width: 100%;
  background: var(--glass);
  backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
  border: 1px solid var(--gborder);
  border-radius: 28px;
  padding: 56px 48px;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 0;
}
.cq-warn-icon-ring {
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(251,191,36,0.08);
  border: 1px solid rgba(251,191,36,0.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem; color: var(--yellow);
  margin-bottom: 24px;
  box-shadow: 0 0 40px rgba(251,191,36,0.12);
}
.cq-warn-eyebrow {
  font-size: 0.58rem; font-weight: 700; letter-spacing: 0.28em;
  text-transform: uppercase; color: var(--yellow);
  margin-bottom: 14px; display: block;
}
.cq-warn-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400; line-height: 1.1;
  color: var(--text); margin-bottom: 20px;
}
.cq-warn-title em { font-style: italic; color: var(--yellow); }
.cq-warn-sub {
  font-size: 0.88rem; color: var(--text-dim); line-height: 1.75;
  margin-bottom: 32px; max-width: 420px;
}
.cq-warn-cta {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 32px;
  background: var(--accent-g); color: #fff;
  border-radius: 99px; font-family: 'Outfit', sans-serif;
  font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 8px 28px rgba(139,92,246,0.4);
  margin-bottom: 24px;
}
.cq-warn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(139,92,246,0.5);
}
.cq-warn-hint {
  display: flex; align-items: flex-start; gap: 8px;
  font-size: 0.72rem; color: var(--text-dim); line-height: 1.65;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 12px; padding: 12px 16px; text-align: left;
}
.cq-warn-hint i { color: var(--accent3); flex-shrink: 0; margin-top: 1px; }
@media (max-width: 600px) {
  .cq-warn-card { padding: 40px 28px; border-radius: 22px; }
}
`;

/* ─────────────────────────────────────────────────────────────
   CONSTANTS & HELPER FUNCTIONS
───────────────────────────────────────────────────────────── */

/**
 * ✅ FIX #1: Definisikan CLIENT_TYPES sebagai factory function
 * Ini akan dipanggil di component dengan parameter t (translations)
 */
const getClientTypes = (t) => [
  { value: 'individu',   label: t.cqClientIndividu   || 'Pribadi / Individu',        icon: 'fa-user',             desc: t.cqClientIndividuDesc   || 'Proyek personal, portofolio, dll.' },
  { value: 'bisnis',     label: t.cqClientBisnis      || 'Bisnis / Brand / UMKM',     icon: 'fa-briefcase',         desc: t.cqClientBisnisDesc      || 'Branding, konten, pemasaran' },
  { value: 'organisasi', label: t.cqClientOrg         || 'Sekolah / Kampus / Komunitas', icon: 'fa-building-columns', desc: t.cqClientOrgDesc         || 'Event, tugas, kegiatan institusi' },
  { value: 'pasangan',   label: t.cqClientPasangan    || 'Pasangan (Wedding)',         icon: 'fa-heart',             desc: t.cqClientPasanganDesc    || 'Dokumentasi & undangan digital' },
  { value: 'kreator',    label: t.cqClientKreator     || 'Kreator Konten / Influencer', icon: 'fa-video',            desc: t.cqClientKreatorDesc     || 'YouTube, TikTok, Reels, streaming' },
];

const TOTAL_STEPS = 5;
const WA_NUMBER   = '628XXXXXXXXXX'; // ← Ganti dengan nomor WA kamu

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */

export default function Contact({ t = {} }) {
  // ✅ FIX #1: Buat CLIENT_TYPES di level component menggunakan getClientTypes
  const CLIENT_TYPES = getClientTypes(t);

  /* ── Cart ── */
  const [cartData,   setCartData]   = useState(null);
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('selectedServices');
      if (raw) setCartData(JSON.parse(raw));
    } catch (_) {/* corrupt data — biarkan null */}
    setCartLoaded(true);
  }, []);

  /* ── Step & animation ── */
  const [step,    setStep]    = useState(1);
  const [animDir, setAnimDir] = useState('forward');
  const [visible, setVisible] = useState(true);

  /* ── Form fields ── */
  const [clientType,     setClientType]     = useState('');
  const [creativeSlider, setCreativeSlider] = useState(50);
  const [projectName,    setProjectName]    = useState('');
  const [projectDesc,    setProjectDesc]    = useState('');

  /* ── Errors ── */
  const [errors, setErrors] = useState({});

  /* ── Firebase submit ── */
  const [submitting,   setSubmitting]   = useState(false);
  const [submitError,  setSubmitError]  = useState('');
  const [generatedId,  setGeneratedId]  = useState('');
  const navigate = useNavigate();

  const formRef = useRef(null);

  /* ── Safe cart helpers with optional chaining ── */
  const cartItems = cartData?.items ?? [];
  const cartTotal = cartData?.total ?? 0;

  /* ─────── STEP NAVIGATION ─────── */
  const goToStep = (next, dir = 'forward') => {
    setAnimDir(dir);
    setVisible(false);
    setTimeout(() => {
      setStep(next);
      setErrors({});
      setVisible(true);
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 280);
  };

  const handleNext = () => {
    const e = {};
    if (step === 1 && !clientType)         e.clientType  = 'Pilih salah satu tipe klien.';
    if (step === 4 && !projectName.trim()) e.projectName = 'Nama proyek wajib diisi.';
    if (Object.keys(e).length) { setErrors(e); return; }
    goToStep(step + 1, 'forward');
  };

  const handleBack = () => goToStep(step - 1, 'back');

  /* ─────── FIREBASE SUBMIT (try-catch-finally) ─────── */
  /**
   * ✅ FIX #2: Tambah e.preventDefault() di awal
   * ✅ FIX #3: Improve console logging untuk debugging
   * ✅ FIX #4: Pastikan e parameter tersedia
   */
  const handleSubmitData = async (e) => {
    // ✅ FIX #2: Add e.preventDefault() di baris pertama
    if (e) {
      e.preventDefault();
    }

    if (!auth.currentUser) {
      setSubmitError('Harap login terlebih dahulu sebelum mengirim brief.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    
    try {
      const payload = {
        userId:             auth.currentUser.uid,
        userEmail:          auth.currentUser.email, // ✅ Tambah untuk tracking
        clientType,
        creativePreference: creativeSlider,
        creativeLabel:      sliderLabel(creativeSlider),
        projectName:        projectName.trim(),
        projectDesc:        projectDesc.trim(),
        selectedItems:      cartItems,
        cartTotal,
        // ✅ Tentukan serviceCategory berdasarkan item pertama
        serviceCategory: (() => {
          if (!cartItems || cartItems.length === 0) return 'general';
          const firstId = cartItems[0]?.id ?? '';
          if (firstId.startsWith('ve') || firstId.startsWith('m'))  return 'video';
          if (firstId.startsWith('dg'))                              return 'design';
          if (firstId.startsWith('ls'))                              return 'livestream';
          if (firstId.startsWith('p') || firstId.startsWith('w'))   return 'website';
          if (firstId.startsWith('d') || firstId.startsWith('h'))   return 'domain';
          return 'general';
        })(),
        serviceNames: cartItems.map(i => i?.name ?? '').filter(Boolean),
        status:             'Pending',
        timestamp:          serverTimestamp(), // ✅ Server timestamp untuk akurasi
      };

      console.log('[Contact] 📤 Submitting payload:', payload);

      // ✅ FIX #5: Wrap dalam try-catch dengan verbose logging
      const docRef = await addDoc(collection(db, 'orders'), payload);
      
      console.log('✅ [Contact] Order berhasil disimpan!');
      console.log(`   📋 Document ID: ${docRef.id}`);
      console.log(`   👤 User ID: ${auth.currentUser.uid}`);
      console.log(`   📦 Service Category: ${payload.serviceCategory}`);
      
      setGeneratedId(docRef.id);
      
      // ✅ Navigate ke Dashboard sesuai README_OVERVIEW.md flow
      setTimeout(() => {
        navigate('/Dashboard');
      }, 500);

    } catch (err) {
      console.error('❌ [Contact] Firebase error saat upload order:');
      console.error(`   Error Code: ${err.code || 'UNKNOWN'}`);
      console.error(`   Error Message: ${err.message}`);
      console.error(`   Full Error:`, err);

      // ✅ Tentukan pesan error yang lebih spesifik
      let errorMsg = 'Gagal menyimpan data. Periksa koneksi dan coba lagi.';
      
      if (err.code === 'permission-denied') {
        errorMsg = 'Anda tidak memiliki izin untuk menyimpan order. Hubungi admin.';
      } else if (err.code === 'unavailable') {
        errorMsg = 'Firestore sedang tidak tersedia. Coba lagi dalam beberapa saat.';
      } else if (err.message?.includes('network')) {
        errorMsg = 'Masalah koneksi jaringan. Periksa internet Anda.';
      }

      setSubmitError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ─────── SLIDER LABEL HELPER ─────── */
  const sliderLabel = (val) => {
    if (val < 30)  return 'Minimalis & Bersih';
    if (val < 60)  return 'Seimbang & Fleksibel';
    if (val < 85)  return 'Dinamis & Berkarakter';
    return 'Kompleks & Ekspresif';
  };

  /* ─────── WA MESSAGE ─────── */
  const buildWAMessage = () => {
    const itemLines = cartItems?.length
      ? cartItems.map(i =>
          `  • ${i?.name ?? 'Item'} ×${i?.qty ?? 1} — Rp ${((i?.price ?? 0) * (i?.qty ?? 1)).toLocaleString('id-ID')}`
        ).join('\n')
      : '  (tidak ada item dari Price List)';

    const clientLabel = CLIENT_TYPES.find(c => c.value === clientType)?.label ?? clientType;

    const msg = [
      '🎨 *BRIEF & ORDER BARU — SynnnW*',
      '━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      `📋 *ORDER ID:* \`${generatedId}\``,
      '',
      '👤 *TIPE KLIEN*',
      `  • ${clientLabel}`,
      '',
      '🎨 *PREFERENSI KREATIF*',
      `  • Skala ${creativeSlider}/100 — ${sliderLabel(creativeSlider)}`,
      '',
      '📁 *DETAIL PROYEK*',
      `  • Nama Proyek : ${projectName}`,
      `  • Deskripsi   : ${projectDesc || '—'}`,
      '',
      '🛒 *ITEM YANG DIPESAN*',
      itemLines,
      '',
      `💰 *TOTAL TAGIHAN : Rp ${cartTotal.toLocaleString('id-ID')}*`,
      `   DP 50% yang harus ditransfer: *Rp ${Math.ceil(cartTotal / 2).toLocaleString('id-ID')}*`,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Halo kak, saya ingin konfirmasi pembayaran untuk order di atas! 🙏',
    ].join('\n');

    return encodeURIComponent(msg);
  };

  /* ═══════════════════════════════════════════════════════════
     GUARD: KERANJANG KOSONG
  ══════════════════════════════════════════════════════════ */
  if (cartLoaded && cartItems.length === 0) {
    return (
      <>
        <style>{CSS}</style>
        <div className="cq-page">
          <div className="cq-warn-page">
            <div className="cq-warn-orb cq-wo1" />
            <div className="cq-warn-orb cq-wo2" />
            <div className="cq-warn-card">
              <div className="cq-warn-icon-ring">
                <i className="fa-solid fa-cart-shopping" />
              </div>
              <span className="cq-warn-eyebrow">{t.cqWarnTitle}</span>
              <h2 className="cq-warn-title">{t.cqWarnCartEmpty}</h2>
              <p className="cq-warn-sub">
                Kamu belum memilih layanan apapun. Kunjungi halaman <strong>Price List</strong> terlebih dahulu, pilih paket yang kamu butuhkan, lalu kembali ke sini untuk melanjutkan proses pesanan.
              </p>
              <a href="/price-list" className="cq-warn-cta">
                <i className="fa-solid fa-arrow-left" />
                <span>{t.cqWarnGoPriceList}</span>
              </a>
              <p className="cq-warn-hint">
                <i className="fa-solid fa-circle-info" />
                Setelah memilih layanan, tekan tombol <strong>&#34;Order&#34;</strong> atau <strong>&#34;Pesan&#34;</strong> untuk membuka halaman ini dengan keranjang terisi.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Render halaman utama Contact form
  // [NOTE: Bagian JSX form tetap sama seperti file original, hanya handleSubmitData yang sudah diperbaiki]
  
  return (
    <>
      <style>{CSS}</style>
      <div className="cq-page">
        {/* Gunakan component struktur original Contact.jsx di bawah sini */}
        {/* Form sudah ada di file original, perubahan hanya di handleSubmitData dan CLIENT_TYPES */}
        <p style={{textAlign: 'center', color: 'white', padding: '40px'}}>
          ⚠️ CATATAN: Gunakan file Contact.jsx original Anda, tapi ganti:
          <br />
          1. Tambah di atas component: <code>const CLIENT_TYPES = getClientTypes(t);</code>
          <br />
          2. Fungsi handleSubmitData: Ganti dengan versi yang sudah diperbaiki di atas
          <br />
          3. Di button onClick: Tambah reference ke handleSubmitData yang sudah diperbaiki
        </p>
      </div>
    </>
  );
}
