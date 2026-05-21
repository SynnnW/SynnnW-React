import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

/* ─────────────────────────────────────────────────────────────
   DATA CONFIG
───────────────────────────────────────────────────────────── */

const CLIENT_TYPES = [
  { value: 'individu',     label: 'Pribadi / Individu',                icon: 'fa-user' },
  { value: 'bisnis',       label: 'Bisnis / Brand / UMKM',             icon: 'fa-briefcase' },
  { value: 'organisasi',   label: 'Sekolah / Kampus / Komunitas',       icon: 'fa-building-columns' },
  { value: 'pasangan',     label: 'Pasangan (Wedding)',                 icon: 'fa-heart' },
  { value: 'kreator',      label: 'Kreator Konten / Influencer',        icon: 'fa-video' },
];

const SERVICES = [
  { value: 'web',        label: 'Web Design & Development', icon: 'fa-globe',        desc: 'Website, landing page, undangan digital' },
  { value: 'video',      label: 'Video Editing',            icon: 'fa-film',         desc: 'Editing, color grading, montase' },
  { value: 'motion',     label: 'Motion Graphic',           icon: 'fa-wand-magic-sparkles', desc: 'Animasi, intro, overlay streaming' },
  { value: 'desain',     label: 'Ilustrasi & Desain Grafis',icon: 'fa-palette',      desc: 'Poster, logo, thumbnail, cetak' },
  { value: 'fotovideo',  label: 'Fotografi & Videografi',   icon: 'fa-camera',       desc: 'Sesi foto/video, dokumentasi event' },
  { value: 'livestream', label: 'Live Streaming & Broadcast',icon: 'fa-tower-broadcast', desc: 'Siaran langsung, overlay, scoreboard' },
];

const BUDGET_OPTIONS = [
  'Di bawah Rp 300.000',
  'Rp 300.000 – Rp 750.000',
  'Rp 750.000 – Rp 2.000.000',
  'Rp 2.000.000 – Rp 5.000.000',
  'Di atas Rp 5.000.000',
  'Fleksibel / ingin diskusi dulu',
];

const DEADLINE_OPTIONS = [
  'Sangat mendesak (< 3 hari)',
  '1 minggu',
  '2–4 minggu',
  'Lebih dari sebulan / santai',
];

const REFERRAL_OPTIONS = [
  'Instagram',
  'Rekomendasi teman / kenalan',
  'GitHub / website langsung',
  'Lainnya',
];

/* Branch-specific questions per service */
const BRANCH_QUESTIONS = {
  web: {
    q1: {
      label: 'Jenis website yang dibutuhkan',
      options: [
        'Website portofolio personal',
        'Undangan pernikahan digital',
        'Landing page / profil bisnis',
        'Lainnya',
      ],
    },
    q2: {
      label: 'Status domain & hosting',
      options: [
        'Belum sama sekali — butuh saran',
        'Sudah punya, tinggal pasang',
        'Belum, tapi mau ngurusin sendiri',
      ],
    },
    q3: {
      label: 'Fitur khusus yang diinginkan',
      multi: true,
      options: [
        'Form RSVP / kontak tamu',
        'Integrasi musik / audio',
        'Animasi / interaktif',
        'Galeri foto/video',
        'Integrasi bot / notifikasi',
        'Tidak tahu, serahkan ke kamu',
      ],
    },
    q4: { label: 'Referensi desain (link, screenshot, atau deskripsi)', type: 'textarea' },
  },
  video: {
    q1: {
      label: 'Jenis konten video',
      options: [
        'Film pendek / dokumenter',
        'Video promosi / iklan',
        'Konten media sosial (Reels, TikTok, YouTube)',
        'Video event / dokumentasi acara',
        'Company profile / profil lembaga',
      ],
    },
    q2: {
      label: 'Status footage/materi video',
      options: [
        'Sudah ada, tinggal diedit',
        'Belum — butuh shooting juga',
        'Sebagian ada, sebagian perlu tambahan',
      ],
    },
    q3: {
      label: 'Target platform tayang',
      multi: true,
      options: [
        'YouTube',
        'Instagram / TikTok',
        'Presentasi / internal',
        'Ditayangkan di event/layar',
      ],
    },
    q4: { label: 'Perkiraan durasi video akhir yang diinginkan', type: 'text', placeholder: 'Contoh: 2–3 menit' },
  },
  motion: {
    q1: {
      label: 'Jenis motion graphic',
      options: [
        'Intro / outro YouTube / video',
        'Animasi teks / lower third',
        'Infografis bergerak',
        'Overlay live streaming',
        'Animasi logo / bumper',
      ],
    },
    q2: {
      label: 'Format output yang dibutuhkan',
      options: [
        'Dengan background (MP4)',
        'Transparan / overlay (WebM / MOV alpha)',
        'Keduanya',
      ],
    },
    q3: { label: 'Referensi gaya visual', type: 'textarea', placeholder: 'Minimalis, dinamis, elegan, futuristik...' },
  },
  desain: {
    q1: {
      label: 'Jenis desain',
      options: [
        'Poster (promosi, event, edukasi)',
        'Thumbnail YouTube / konten sosmed',
        'Logo & identitas brand',
        'Infografis / presentasi visual',
        'Desain cetak (spanduk, brosur, dll)',
      ],
    },
    q2: {
      label: 'Format output yang dibutuhkan',
      options: [
        'Digital saja (PNG, JPG)',
        'Siap cetak (resolusi tinggi / PDF)',
        'Keduanya',
      ],
    },
    q3: { label: 'Referensi warna, gaya, atau brand guideline', type: 'textarea', placeholder: 'Ceritakan atau tempel link referensi...' },
  },
  fotovideo: {
    q1: {
      label: 'Jenis sesi',
      options: [
        'Foto portrait / personal branding',
        'Dokumentasi event / acara',
        'Video sinematik pernikahan / wisuda',
        'Konten produk / komersial',
      ],
    },
    q2: { label: 'Lokasi pengambilan gambar', type: 'text', placeholder: 'Kota / kabupaten...' },
    q3: {
      label: 'Post-processing / editing',
      options: [
        'Ya, butuh editing juga',
        'Tidak, hanya pengambilan gambar',
        'Belum tahu, diskusikan dulu',
      ],
    },
    q4: { label: 'Tanggal yang sudah ditargetkan (opsional)', type: 'text', placeholder: 'Contoh: Agustus 2025' },
  },
  livestream: {
    q1: {
      label: 'Jenis event',
      options: [
        'Event olahraga (pertandingan, kompetisi)',
        'Acara sekolah / kampus / wisuda',
        'Seminar / webinar',
        'Pernikahan / acara keluarga',
        'Lainnya',
      ],
    },
    q2: { label: 'Lokasi event', type: 'text', placeholder: 'Kota / kabupaten...' },
    q3: { label: 'Perkiraan durasi siaran', type: 'text', placeholder: 'Contoh: 4 jam' },
    q4: {
      label: 'Butuh desain grafis siaran?',
      options: [
        'Ya, butuh paket lengkap (overlay, lower third, dll)',
        'Tidak, sudah ada desainnya',
        'Belum tahu',
      ],
    },
  },
};

const TOTAL_STEPS = 5;

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function Contact({ t = {} }) {
  const navigate   = useNavigate();
  const revealEls  = useRef([]);
  const formRef    = useRef(null);

  /* ── Step state ── */
  const [step, setStep]       = useState(1);
  const [animDir, setAnimDir] = useState('forward'); // 'forward' | 'back'
  const [visible, setVisible] = useState(true);

  /* ── Form data ── */
  const [data, setData] = useState({
    // Step 1
    name: '', email: '', whatsapp: '', clientType: '',
    // Step 2
    service: '',
    // Step 3 (branch)
    branch: {},
    // Step 4
    budget: '', deadline: '',
    // Step 5
    story: '', referral: '',
  });

  const [errors, setErrors]   = useState({});
  const [authStatus, setAuthStatus] = useState('idle'); // idle | loading | success | error
  const [authError, setAuthError]   = useState('');

  /* ── Pre-form gate state ── */
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [preData, setPreData] = useState({ nama: '', hp: '', email: '', kebutuhan: '', hari: 7 });
  const [preErrors, setPreErrors] = useState({});
  const [preSaving, setPreSaving] = useState(false);
  const [preSaveError, setPreSaveError] = useState('');
  const [tempDocId, setTempDocId] = useState(null);

  const setP = (k, v) => setPreData((prev) => ({ ...prev, [k]: v }));

  const validatePre = () => {
    const e = {};
    if (!preData.nama.trim())       e.nama      = 'Nama wajib diisi.';
    if (!preData.hp.trim())         e.hp        = 'Nomor HP wajib diisi.';
    if (!preData.email.trim())      e.email     = 'Email wajib diisi.';
    else if (!/\S+@\S+\.\S+/.test(preData.email)) e.email = 'Format email tidak valid.';
    if (!preData.kebutuhan.trim())  e.kebutuhan = 'Ceritakan kebutuhanmu singkat.';
    return e;
  };

  const handlePreLanjut = async () => {
    const e = validatePre();
    if (Object.keys(e).length) { setPreErrors(e); return; }
    setPreSaveError('');
    setPreSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'inquiries'), {
        nama:       preData.nama,
        hp:         preData.hp,
        email:      preData.email,
        kebutuhan:  preData.kebutuhan,
        hari:       preData.hari,
        status:     'pre_inquiry',
        createdAt:  serverTimestamp(),
      });
      setTempDocId(docRef.id);
      setShowQuestionnaire(true);
      setTimeout(() => {
        if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error(err);
      setPreSaveError('Gagal menyimpan data. Coba lagi.');
    } finally {
      setPreSaving(false);
    }
  };

  /* ── Reveal observer ── */
  const r = (el) => { if (el && !revealEls.current.includes(el)) revealEls.current.push(el); };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    const id = setTimeout(() => { revealEls.current.forEach((el) => { if (el) obs.observe(el); }); }, 50);
    return () => { clearTimeout(id); obs.disconnect(); };
  }, []);

  /* ── Animate step transition ── */
  const goToStep = (next, dir = 'forward') => {
    setAnimDir(dir);
    setVisible(false);
    setTimeout(() => {
      setStep(next);
      setErrors({});
      setVisible(true);
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 280);
  };

  /* ── Field helpers ── */
  const set = (key, val) => setData((prev) => ({ ...prev, [key]: val }));
  const setBranch = (key, val) => setData((prev) => ({ ...prev, branch: { ...prev.branch, [key]: val } }));
  const toggleBranchMulti = (key, val) => {
    setData((prev) => {
      const cur = prev.branch[key] || [];
      const next = cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val];
      return { ...prev, branch: { ...prev.branch, [key]: next } };
    });
  };

  /* ── Validation per step ── */
  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!data.name.trim())      e.name      = 'Nama wajib diisi.';
      if (!data.email.trim())     e.email     = 'Email wajib diisi.';
      else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Format email tidak valid.';
      if (!data.whatsapp.trim())  e.whatsapp  = 'Nomor WhatsApp wajib diisi.';
      if (!data.clientType)       e.clientType= 'Pilih salah satu.';
    }
    if (step === 2) {
      if (!data.service) e.service = 'Pilih layanan terlebih dahulu.';
    }
    if (step === 4) {
      if (!data.budget)   e.budget   = 'Pilih kisaran budget.';
      if (!data.deadline) e.deadline = 'Pilih target deadline.';
    }
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    goToStep(step + 1, 'forward');
  };

  const handleBack = () => goToStep(step - 1, 'back');

  /* ── Final submit: Google Sign-In → Firestore ── */
  const handleSubmit = async () => {
    setAuthStatus('loading');
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      const result   = await signInWithPopup(auth, provider);
      const user     = result.user;

      const payload = {
        uid:        user.uid,
        displayName:user.displayName,
        email:      user.email,
        photoURL:   user.photoURL,
        // Form data
        contactName:  data.name,
        contactEmail: data.email,
        whatsapp:     data.whatsapp,
        clientType:   data.clientType,
        service:      data.service,
        branch:       data.branch,
        budget:       data.budget,
        deadline:     data.deadline,
        story:        data.story,
        referral:     data.referral,
        status:       'pending_review',
        createdAt:    serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), payload, { merge: true });

      setAuthStatus('success');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      console.error(err);
      setAuthError(err.message || 'Terjadi kesalahan saat login. Coba lagi.');
      setAuthStatus('error');
    }
  };

  /* ── Step label ── */
  const STEP_LABELS = ['Perkenalan', 'Layanan', 'Detail', 'Anggaran', 'Cerita'];

  /* ─── BRANCH QUESTIONS RENDERER ─── */
  const branchData = BRANCH_QUESTIONS[data.service] || {};

  const renderBranchField = (key, q) => {
    if (!q) return null;

    if (q.type === 'textarea') {
      return (
        <div key={key} className="cq-field-group">
          <label className="cq-field-label">{q.label}</label>
          <textarea
            className="cq-field-input cq-field-textarea"
            placeholder={q.placeholder || ''}
            value={data.branch[key] || ''}
            onChange={(e) => setBranch(key, e.target.value)}
          />
        </div>
      );
    }

    if (q.type === 'text') {
      return (
        <div key={key} className="cq-field-group">
          <label className="cq-field-label">{q.label}</label>
          <input
            type="text"
            className="cq-field-input"
            placeholder={q.placeholder || ''}
            value={data.branch[key] || ''}
            onChange={(e) => setBranch(key, e.target.value)}
          />
        </div>
      );
    }

    if (q.multi) {
      const selected = data.branch[key] || [];
      return (
        <div key={key} className="cq-field-group">
          <label className="cq-field-label">{q.label} <span className="cq-multi-hint">(bisa pilih beberapa)</span></label>
          <div className="cq-pill-grid">
            {q.options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`cq-pill ${selected.includes(opt) ? 'cq-pill-active' : ''}`}
                onClick={() => toggleBranchMulti(key, opt)}
              >
                {selected.includes(opt) && <i className="fa-solid fa-check" style={{ fontSize: '0.6rem' }} />}
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    /* Single select */
    return (
      <div key={key} className="cq-field-group">
        <label className="cq-field-label">{q.label}</label>
        <div className="cq-pill-grid">
          {q.options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`cq-pill ${data.branch[key] === opt ? 'cq-pill-active' : ''}`}
              onClick={() => setBranch(key, opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{CSS}</style>

      <div className="cq-page">

        {/* ══════════════════════════════ HERO ══════════════════════════════ */}
        <div className="cq-hero">
          <div className="cq-hero-orb cq-orb-1" />
          <div className="cq-hero-orb cq-orb-2" />
          <div className="cq-hero-orb cq-orb-3" />
          <div className="cq-hero-inner">
            <span ref={r} className="cq-page-label reveal">MULAI PROYEK</span>
            <h1 ref={r} className="cq-hero-title reveal rv-d1">
              <span>Ceritakan</span><br />
              <em>Proyekmu.</em>
            </h1>
            <p ref={r} className="cq-hero-sub reveal rv-d2">
              Jawab beberapa pertanyaan singkat, aku akan pahami kebutuhanmu dan siapkan solusi terbaik.
            </p>
          </div>
          <div ref={r} className="cq-scroll-hint reveal rv-d3">
            <span>Mulai di sini</span>
            <i className="fa-solid fa-arrow-down" />
          </div>
        </div>

        {/* ══════════════════════════════ PRE-FORM GATE ══════════════════════════════ */}
        {!showQuestionnaire && (
          <div className="cq-pregate">
            <div className="cq-pregate-inner">
              <div className="cq-pregate-head">
                <span className="cq-step-badge">SEBELUM LANJUT</span>
                <h2 className="cq-step-title">Isi dulu <em>info singkat kamu.</em></h2>
                <p className="cq-step-desc">Biar aku bisa langsung tahu siapa kamu dan apa yang kamu butuhkan — tanpa perlu login dulu.</p>
              </div>

              <div className="cq-fields">
                <div className="cq-field-row">
                  <div className="cq-field-group">
                    <label className="cq-field-label">Nama *</label>
                    <input
                      type="text"
                      className={`cq-field-input ${preErrors.nama ? 'cq-field-error' : ''}`}
                      placeholder="Nama kamu"
                      value={preData.nama}
                      onChange={(e) => setP('nama', e.target.value)}
                    />
                    {preErrors.nama && <span className="cq-err-msg">{preErrors.nama}</span>}
                  </div>
                  <div className="cq-field-group">
                    <label className="cq-field-label">Nomor HP / WhatsApp *</label>
                    <div className="cq-input-prefix-wrap">
                      <span className="cq-input-prefix">+62</span>
                      <input
                        type="tel"
                        className={`cq-field-input cq-field-prefixed ${preErrors.hp ? 'cq-field-error' : ''}`}
                        placeholder="812-3456-7890"
                        value={preData.hp}
                        onChange={(e) => setP('hp', e.target.value)}
                      />
                    </div>
                    {preErrors.hp && <span className="cq-err-msg">{preErrors.hp}</span>}
                  </div>
                </div>

                <div className="cq-field-group">
                  <label className="cq-field-label">Email *</label>
                  <input
                    type="email"
                    className={`cq-field-input ${preErrors.email ? 'cq-field-error' : ''}`}
                    placeholder="nama@email.com"
                    value={preData.email}
                    onChange={(e) => setP('email', e.target.value)}
                  />
                  {preErrors.email && <span className="cq-err-msg">{preErrors.email}</span>}
                </div>

                <div className="cq-field-group">
                  <label className="cq-field-label">Kebutuhan kamu apa? * <span className="cq-multi-hint">(singkat aja)</span></label>
                  <textarea
                    className={`cq-field-input cq-field-textarea ${preErrors.kebutuhan ? 'cq-field-error' : ''}`}
                    placeholder="Contoh: mau bikin website portofolio, atau edit video tugas sekolah, atau desain poster lomba..."
                    value={preData.kebutuhan}
                    onChange={(e) => setP('kebutuhan', e.target.value)}
                  />
                  {preErrors.kebutuhan && <span className="cq-err-msg">{preErrors.kebutuhan}</span>}
                </div>

                <div className="cq-field-group">
                  <label className="cq-field-label">
                    Butuh selesai dalam berapa hari?
                    <span className="cq-slider-val">{preData.hari} hari</span>
                  </label>
                  <div className="cq-slider-wrap">
                    <span className="cq-slider-tick">1</span>
                    <input
                      type="range"
                      min="1" max="60" step="1"
                      className="cq-slider"
                      value={preData.hari}
                      onChange={(e) => setP('hari', Number(e.target.value))}
                    />
                    <span className="cq-slider-tick">60</span>
                  </div>
                  <div className="cq-slider-labels">
                    <span className={preData.hari <= 3 ? 'cq-sl-active' : ''}>🔥 Mendesak</span>
                    <span className={preData.hari > 3 && preData.hari <= 14 ? 'cq-sl-active' : ''}>⚡ Normal</span>
                    <span className={preData.hari > 14 && preData.hari <= 30 ? 'cq-sl-active' : ''}>🌿 Santai</span>
                    <span className={preData.hari > 30 ? 'cq-sl-active' : ''}>☁️ Fleksibel</span>
                  </div>
                </div>

                {preSaveError && (
                  <div className="cq-global-err" style={{ marginBottom: 16 }}>
                    <i className="fa-solid fa-triangle-exclamation" /> {preSaveError}
                  </div>
                )}
                <button
                  type="button"
                  className="cq-btn-pregate"
                  onClick={handlePreLanjut}
                  disabled={preSaving}
                >
                  {preSaving ? <span className="cq-spinner" /> : <i className="fa-solid fa-arrow-right" />}
                  <span>{preSaving ? 'Menyimpan...' : 'Lanjut ke proses pengerjaan'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════ QUESTIONNAIRE ══════════════════════════════ */}
        {showQuestionnaire ? (
          <div className="cq-body" ref={formRef}>

          {/* LEFT: sticky info */}
          <div ref={r} className="cq-left reveal">
            <div className="cq-steps-track">
              {STEP_LABELS.map((lbl, i) => {
                const idx  = i + 1;
                const done = step > idx;
                const active = step === idx;
                return (
                  <div key={idx} className={`cq-step-item ${active ? 'cq-step-active' : ''} ${done ? 'cq-step-done' : ''}`}>
                    <div className="cq-step-dot">
                      {done
                        ? <i className="fa-solid fa-check" style={{ fontSize: '0.62rem' }} />
                        : <span>{idx}</span>
                      }
                    </div>
                    <div className="cq-step-info">
                      <span className="cq-step-num">Step {idx}</span>
                      <span className="cq-step-name">{lbl}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cq-left-hint">
              <i className="fa-solid fa-lock" style={{ fontSize: '0.75rem', color: 'var(--accent3)' }} />
              <span>Data kamu aman &amp; hanya digunakan untuk memproses projekmu.</span>
            </div>

            <div className="cq-avail-badge">
              <span className="cq-avail-dot" />
              <span>Tersedia untuk proyek baru</span>
            </div>
          </div>

          {/* RIGHT: form card */}
          <div ref={r} className="cq-right reveal rv-d1">
            <div className="cq-card">
              <div className="cq-card-glow" />
              <div className="cq-card-line" />

              {/* Progress bar */}
              <div className="cq-progress-bar-wrap">
                <div className="cq-progress-bar" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
              </div>

              {/* Step counter */}
              <div className="cq-step-counter">
                <span className="cq-step-current">{step}</span>
                <span className="cq-step-sep"> / </span>
                <span className="cq-step-total">{TOTAL_STEPS}</span>
              </div>

              {/* ── Animated step content ── */}
              <div className={`cq-step-body ${visible ? (animDir === 'forward' ? 'cq-enter-right' : 'cq-enter-left') : 'cq-exit'}`}>

                {/* ════════ STEP 1 — Perkenalan ════════ */}
                {step === 1 && (
                  <div className="cq-step-content">
                    <div className="cq-step-head">
                      <span className="cq-step-badge">01 — PERKENALAN</span>
                      <h2 className="cq-step-title">Siapa kamu <em>dan dari mana?</em></h2>
                      <p className="cq-step-desc">Mari kita mulai dengan perkenalan singkat.</p>
                    </div>

                    <div className="cq-fields">
                      <div className="cq-field-row">
                        <div className="cq-field-group">
                          <label className="cq-field-label">Nama Lengkap *</label>
                          <input
                            type="text"
                            className={`cq-field-input ${errors.name ? 'cq-field-error' : ''}`}
                            placeholder="Contoh: Budi Santoso"
                            value={data.name}
                            onChange={(e) => set('name', e.target.value)}
                          />
                          {errors.name && <span className="cq-err-msg">{errors.name}</span>}
                        </div>
                        <div className="cq-field-group">
                          <label className="cq-field-label">Alamat Email Aktif *</label>
                          <input
                            type="email"
                            className={`cq-field-input ${errors.email ? 'cq-field-error' : ''}`}
                            placeholder="nama@email.com"
                            value={data.email}
                            onChange={(e) => set('email', e.target.value)}
                          />
                          {errors.email && <span className="cq-err-msg">{errors.email}</span>}
                        </div>
                      </div>

                      <div className="cq-field-group">
                        <label className="cq-field-label">Nomor WhatsApp *</label>
                        <div className="cq-input-prefix-wrap">
                          <span className="cq-input-prefix">+62</span>
                          <input
                            type="tel"
                            className={`cq-field-input cq-field-prefixed ${errors.whatsapp ? 'cq-field-error' : ''}`}
                            placeholder="812-3456-7890"
                            value={data.whatsapp}
                            onChange={(e) => set('whatsapp', e.target.value)}
                          />
                        </div>
                        {errors.whatsapp && <span className="cq-err-msg">{errors.whatsapp}</span>}
                      </div>

                      <div className="cq-field-group">
                        <label className="cq-field-label">Kamu mewakili siapa? *</label>
                        {errors.clientType && <span className="cq-err-msg" style={{ marginBottom: 6 }}>{errors.clientType}</span>}
                        <div className="cq-type-grid">
                          {CLIENT_TYPES.map((ct) => (
                            <button
                              key={ct.value}
                              type="button"
                              className={`cq-type-card ${data.clientType === ct.value ? 'cq-type-active' : ''}`}
                              onClick={() => set('clientType', ct.value)}
                            >
                              <i className={`fa-solid ${ct.icon}`} />
                              <span>{ct.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ════════ STEP 2 — Pilih Layanan ════════ */}
                {step === 2 && (
                  <div className="cq-step-content">
                    <div className="cq-step-head">
                      <span className="cq-step-badge">02 — LAYANAN</span>
                      <h2 className="cq-step-title">Apa yang paling <em>kamu butuhkan?</em></h2>
                      <p className="cq-step-desc">Pilih satu layanan utama — pertanyaan selanjutnya akan menyesuaikan.</p>
                    </div>

                    {errors.service && <div className="cq-global-err"><i className="fa-solid fa-triangle-exclamation" />{errors.service}</div>}

                    <div className="cq-service-grid">
                      {SERVICES.map((svc) => (
                        <button
                          key={svc.value}
                          type="button"
                          className={`cq-service-card ${data.service === svc.value ? 'cq-service-active' : ''}`}
                          onClick={() => { set('service', svc.value); set('branch', {}); }}
                        >
                          <div className="cq-svc-icon-wrap">
                            <i className={`fa-solid ${svc.icon}`} />
                          </div>
                          <div className="cq-svc-info">
                            <span className="cq-svc-name">{svc.label}</span>
                            <span className="cq-svc-desc">{svc.desc}</span>
                          </div>
                          {data.service === svc.value && (
                            <div className="cq-svc-check"><i className="fa-solid fa-check" /></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ════════ STEP 3 — Detail (branching) ════════ */}
                {step === 3 && (
                  <div className="cq-step-content">
                    <div className="cq-step-head">
                      <span className="cq-step-badge">03 — DETAIL</span>
                      <h2 className="cq-step-title">Ceritakan lebih <em>spesifik.</em></h2>
                      <p className="cq-step-desc">
                        Detail ini membantu aku mempersiapkan solusi yang tepat untuk proyekmu.
                      </p>
                    </div>

                    <div className="cq-fields">
                      {Object.entries(branchData).map(([key, q]) => renderBranchField(key, q))}

                      {/* Fallback jika tidak ada service dipilih */}
                      {!data.service && (
                        <div className="cq-global-err">
                          <i className="fa-solid fa-triangle-exclamation" />
                          Kamu belum memilih layanan. Kembali ke Step 2.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ════════ STEP 4 — Budget & Timeline ════════ */}
                {step === 4 && (
                  <div className="cq-step-content">
                    <div className="cq-step-head">
                      <span className="cq-step-badge">04 — ANGGARAN</span>
                      <h2 className="cq-step-title">Budget & <em>Timeline.</em></h2>
                      <p className="cq-step-desc">Biar aku bisa kasih solusi yang paling pas untukmu.</p>
                    </div>

                    <div className="cq-fields">
                      <div className="cq-field-group">
                        <label className="cq-field-label">Perkiraan budget yang disiapkan *</label>
                        {errors.budget && <span className="cq-err-msg">{errors.budget}</span>}
                        <div className="cq-budget-grid">
                          {BUDGET_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`cq-budget-card ${data.budget === opt ? 'cq-budget-active' : ''}`}
                              onClick={() => set('budget', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="cq-field-group">
                        <label className="cq-field-label">Target deadline *</label>
                        {errors.deadline && <span className="cq-err-msg">{errors.deadline}</span>}
                        <div className="cq-deadline-grid">
                          {DEADLINE_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`cq-pill ${data.deadline === opt ? 'cq-pill-active' : ''}`}
                              onClick={() => set('deadline', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ════════ STEP 5 — Story & Submit ════════ */}
                {step === 5 && (
                  <div className="cq-step-content">
                    <div className="cq-step-head">
                      <span className="cq-step-badge">05 — CERITA</span>
                      <h2 className="cq-step-title">Hampir selesai — <em>ceritakan!</em></h2>
                      <p className="cq-step-desc">Bagian bebas. Makin detail, makin baik hasilnya.</p>
                    </div>

                    <div className="cq-fields">
                      <div className="cq-field-group">
                        <label className="cq-field-label">Ceritakan proyekmu secara bebas</label>
                        <textarea
                          className="cq-field-input cq-field-textarea cq-field-textarea-lg"
                          placeholder="Visi, konteks, hal unik yang perlu aku ketahui, referensi yang kamu suka, dll..."
                          value={data.story}
                          onChange={(e) => set('story', e.target.value)}
                        />
                      </div>

                      <div className="cq-field-group">
                        <label className="cq-field-label">Dari mana kamu tahu tentang SynnnW?</label>
                        <div className="cq-pill-grid">
                          {REFERRAL_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`cq-pill ${data.referral === opt ? 'cq-pill-active' : ''}`}
                              onClick={() => set('referral', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Google Sign-In CTA */}
                      <div className="cq-submit-wrap">
                        <div className="cq-submit-note">
                          <i className="fa-brands fa-google" />
                          <p>
                            Kamu akan login dengan Google untuk mengamankan data proyekmu dan memudahkan komunikasi selanjutnya.
                          </p>
                        </div>

                        {authError && (
                          <div className="cq-global-err">
                            <i className="fa-solid fa-triangle-exclamation" />
                            {authError}
                          </div>
                        )}

                        <button
                          type="button"
                          className="cq-btn-google"
                          onClick={handleSubmit}
                          disabled={authStatus === 'loading' || authStatus === 'success'}
                        >
                          {authStatus === 'loading' && (
                            <span className="cq-spinner" />
                          )}
                          {authStatus === 'success' && (
                            <i className="fa-solid fa-check" />
                          )}
                          {authStatus === 'idle' || authStatus === 'error' ? (
                            <i className="fa-brands fa-google" />
                          ) : null}
                          <span>
                            {authStatus === 'loading' ? 'Menyimpan...'
                              : authStatus === 'success' ? 'Berhasil! Mengarahkan...'
                              : 'Selesai & Login dengan Google'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>{/* end cq-step-body */}

              {/* ── Navigation buttons ── */}
              <div className="cq-nav">
                {step > 1 && (
                  <button type="button" className="cq-btn-back" onClick={handleBack}>
                    <i className="fa-solid fa-arrow-left" />
                    Kembali
                  </button>
                )}
                {step < TOTAL_STEPS && (
                  <button type="button" className="cq-btn-next" onClick={handleNext}>
                    Lanjut
                    <i className="fa-solid fa-arrow-right" />
                  </button>
                )}
              </div>

            </div>{/* end cq-card */}
          </div>{/* end cq-right */}
        </div>
        ) : null}
      </div>{/* end cq-page */}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   CSS
───────────────────────────────────────────────────────────── */
const CSS = `
/* ── Reveal ── */
.reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.65s ease, transform 0.65s ease; }
.reveal.visible { opacity: 1; transform: none; }
.rv-d1 { transition-delay: 0.1s; }
.rv-d2 { transition-delay: 0.2s; }
.rv-d3 { transition-delay: 0.3s; }

/* ── Page ── */
.cq-page {
  min-height: 100vh;
  background: var(--bg);
  padding-top: 64px;
}

/* ── Hero ── */
.cq-hero {
  position: relative;
  min-height: 56vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 80px 70px;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}
.cq-hero::after {
  content: '';
  position: absolute;
  bottom: 0; left: 80px; right: 80px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
  pointer-events: none;
}
.cq-hero-orb {
  position: absolute; border-radius: 50%;
  pointer-events: none; filter: blur(80px);
}
.cq-orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%);
  top: -120px; left: -100px;
}
.cq-orb-2 {
  width: 360px; height: 360px;
  background: radial-gradient(circle, rgba(167,139,250,0.09) 0%, transparent 65%);
  bottom: -80px; right: 10%;
}
.cq-orb-3 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%);
  top: 40%; left: 40%;
}
.cq-hero-inner { position: relative; z-index: 1; max-width: 640px; }
.cq-page-label {
  display: inline-block;
  font-size: 0.62rem; font-weight: 700; letter-spacing: 0.28em;
  text-transform: uppercase; color: var(--accent3);
  margin-bottom: 20px;
}
.cq-hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 300; line-height: 1.08;
  color: var(--text); margin: 0 0 20px;
  letter-spacing: -0.02em;
}
.cq-hero-title em { font-style: italic; color: var(--accent3); }
.cq-hero-sub {
  font-size: 1rem; color: var(--text-dim);
  line-height: 1.75; max-width: 480px; margin: 0;
}
.cq-scroll-hint {
  position: absolute; bottom: 28px; right: 80px;
  display: flex; align-items: center; gap: 10px;
  font-size: 0.66rem; font-weight: 600; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--text-dim);
}
.cq-scroll-hint i { animation: bounceDown 1.8s ease-in-out infinite; }
@keyframes bounceDown {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(5px); }
}

/* ── Body layout ── */
.cq-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: 100vh;
  border-bottom: 1px solid var(--border);
}

/* ── LEFT ── */
.cq-left {
  padding: 56px 36px;
  border-right: 1px solid var(--border);
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  overflow-y: auto;
  scrollbar-width: thin;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.cq-steps-track {
  display: flex; flex-direction: column; gap: 4px;
}
.cq-step-item {
  display: flex; align-items: center; gap: 14px;
  padding: 10px 14px; border-radius: 12px;
  transition: background 0.25s;
  opacity: 0.45;
}
.cq-step-item.cq-step-active,
.cq-step-item.cq-step-done { opacity: 1; }
.cq-step-item.cq-step-active { background: var(--glass); }

.cq-step-dot {
  width: 30px; height: 30px; flex-shrink: 0;
  border-radius: 50%; border: 1.5px solid var(--border2);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.66rem; font-weight: 700;
  color: var(--text-dim); background: var(--bg);
  transition: all 0.3s;
}
.cq-step-item.cq-step-active .cq-step-dot {
  border-color: var(--accent3);
  color: var(--accent3);
  background: rgba(139,92,246,0.08);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
}
.cq-step-item.cq-step-done .cq-step-dot {
  border-color: #4ade80;
  color: #4ade80;
  background: rgba(74,222,128,0.08);
}
.cq-step-info { display: flex; flex-direction: column; gap: 2px; }
.cq-step-num  { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-dim); }
.cq-step-name { font-size: 0.82rem; font-weight: 500; color: var(--text); }

.cq-left-hint {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 0.72rem; color: var(--text-dim); line-height: 1.6;
  padding: 14px; border: 1px solid var(--gborder);
  border-radius: 12px; background: var(--glass);
}
.cq-avail-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(74,222,128,0.06); border: 1px solid rgba(74,222,128,0.18);
  border-radius: 99px; padding: 8px 14px;
  width: fit-content;
  font-size: 0.72rem; font-weight: 600; color: rgba(74,222,128,0.9);
  letter-spacing: 0.05em;
}
[data-theme="light"] .cq-avail-badge {
  background: rgba(34,197,94,0.06); color: rgba(22,163,74,0.9);
  border-color: rgba(22,163,74,0.25);
}
.cq-avail-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #4ade80; flex-shrink: 0;
  animation: cqPulse 2s ease infinite;
}
@keyframes cqPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
  50%       { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
}

/* ── RIGHT ── */
.cq-right { padding: 56px 60px 80px; }

/* ── Card ── */
.cq-card {
  background: var(--glass);
  backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
  border: 1px solid var(--gborder);
  border-radius: 28px;
  padding: 0;
  position: relative; overflow: hidden;
  max-width: 680px; margin: 0 auto;
}
.cq-card-glow {
  position: absolute; top: -100px; right: -100px;
  width: 380px; height: 380px; border-radius: 50%;
  background: radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 65%);
  pointer-events: none;
}
.cq-card-line {
  position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(167,139,250,0.45), transparent);
}

/* ── Progress bar ── */
.cq-progress-bar-wrap {
  height: 3px;
  background: var(--glass2);
  border-radius: 99px 99px 0 0;
  overflow: hidden;
}
.cq-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent3));
  transition: width 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 99px;
}

/* ── Step counter ── */
.cq-step-counter {
  padding: 18px 36px 0;
  font-size: 0.62rem; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--text-dim);
}
.cq-step-current { color: var(--accent3); }

/* ── Step body animation ── */
.cq-step-body {
  padding: 28px 36px 0;
}
@keyframes enterRight {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes enterLeft {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes exitAnim {
  from { opacity: 1; }
  to   { opacity: 0; }
}
.cq-enter-right { animation: enterRight 0.3s ease forwards; }
.cq-enter-left  { animation: enterLeft  0.3s ease forwards; }
.cq-exit        { animation: exitAnim   0.25s ease forwards; }

/* ── Step head ── */
.cq-step-head { margin-bottom: 28px; }
.cq-step-badge {
  display: inline-block;
  font-size: 0.58rem; font-weight: 700; letter-spacing: 0.24em;
  text-transform: uppercase; color: var(--accent3);
  margin-bottom: 12px;
}
.cq-step-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 400; line-height: 1.15;
  color: var(--text); margin: 0 0 10px;
  letter-spacing: -0.01em;
}
.cq-step-title em { font-style: italic; color: var(--accent3); }
.cq-step-desc {
  font-size: 0.84rem; color: var(--text-dim);
  line-height: 1.7; margin: 0;
}

/* ── Fields ── */
.cq-fields { display: flex; flex-direction: column; gap: 22px; }
.cq-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.cq-field-group { display: flex; flex-direction: column; gap: 8px; }
.cq-field-label {
  font-size: 0.62rem; font-weight: 600; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--text-dim);
}
.cq-multi-hint { font-weight: 400; opacity: 0.7; text-transform: none; letter-spacing: 0; }
.cq-field-input {
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 12px; padding: 13px 16px;
  font-family: 'Outfit', sans-serif; font-size: 0.88rem;
  color: var(--text); outline: none;
  transition: border-color 0.28s, background 0.28s;
  backdrop-filter: blur(10px); width: 100%;
  box-sizing: border-box;
}
.cq-field-input::placeholder { color: var(--text-dim); opacity: 0.5; }
.cq-field-input:focus { border-color: var(--accent2); background: var(--glass3); }
.cq-field-error { border-color: rgba(239,68,68,0.6) !important; }
.cq-err-msg {
  font-size: 0.65rem; color: rgba(239,68,68,0.85);
  display: block; min-height: 16px;
}
.cq-field-textarea {
  resize: vertical; min-height: 110px; line-height: 1.65;
}
.cq-field-textarea-lg { min-height: 160px; }

/* Prefix input */
.cq-input-prefix-wrap { display: flex; position: relative; }
.cq-input-prefix {
  display: flex; align-items: center;
  padding: 0 14px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-right: none;
  border-radius: 12px 0 0 12px;
  font-size: 0.84rem; color: var(--text-dim);
  white-space: nowrap; flex-shrink: 0;
}
.cq-field-prefixed { border-radius: 0 12px 12px 0 !important; }

/* ── Client type grid ── */
.cq-type-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px;
}
.cq-type-card {
  display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
  padding: 14px 14px 12px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 14px; cursor: pointer; text-align: left;
  font-family: 'Outfit', sans-serif;
  font-size: 0.73rem; color: var(--text-dim);
  transition: all 0.25s; line-height: 1.4;
}
.cq-type-card i { font-size: 1.1rem; color: var(--text-dim); transition: color 0.25s; }
.cq-type-card:hover { border-color: var(--gborder2); color: var(--text); background: var(--glass3); }
.cq-type-active {
  background: rgba(139,92,246,0.1) !important;
  border-color: rgba(139,92,246,0.4) !important;
  color: var(--accent3) !important;
}
.cq-type-active i { color: var(--accent3) !important; }

/* ── Service grid ── */
.cq-service-grid {
  display: flex; flex-direction: column; gap: 10px;
}
.cq-service-card {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 18px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 16px; cursor: pointer; text-align: left;
  font-family: 'Outfit', sans-serif;
  transition: all 0.25s; position: relative;
}
.cq-service-card:hover { border-color: var(--gborder2); background: var(--glass3); }
.cq-service-active {
  background: rgba(139,92,246,0.1) !important;
  border-color: rgba(139,92,246,0.4) !important;
}
.cq-svc-icon-wrap {
  width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
  background: var(--glass); border: 1px solid var(--gborder);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; color: var(--text-dim);
  transition: all 0.25s;
}
.cq-service-active .cq-svc-icon-wrap {
  background: rgba(139,92,246,0.15);
  border-color: rgba(139,92,246,0.35);
  color: var(--accent3);
}
.cq-svc-info { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.cq-svc-name { font-size: 0.88rem; font-weight: 600; color: var(--text); }
.cq-svc-desc { font-size: 0.72rem; color: var(--text-dim); }
.cq-service-active .cq-svc-name { color: var(--accent3); }
.cq-svc-check {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.6rem; flex-shrink: 0;
}

/* ── Pills ── */
.cq-pill-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.cq-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 16px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem; color: var(--text-dim);
  transition: all 0.22s;
}
.cq-pill:hover { border-color: var(--gborder2); color: var(--text); }
.cq-pill-active {
  background: rgba(139,92,246,0.12) !important;
  border-color: rgba(139,92,246,0.4) !important;
  color: var(--accent3) !important;
}

/* ── Budget grid ── */
.cq-budget-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.cq-budget-card {
  padding: 12px 14px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 12px; cursor: pointer; text-align: left;
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem; color: var(--text-dim);
  transition: all 0.22s; line-height: 1.4;
}
.cq-budget-card:hover { border-color: var(--gborder2); color: var(--text); }
.cq-budget-active {
  background: rgba(139,92,246,0.12) !important;
  border-color: rgba(139,92,246,0.4) !important;
  color: var(--accent3) !important;
}
.cq-deadline-grid { display: flex; flex-wrap: wrap; gap: 8px; }

/* ── Global error ── */
.cq-global-err {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.78rem; color: rgba(239,68,68,0.85);
  background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2);
  border-radius: 12px; padding: 12px 16px;
  margin-bottom: 8px;
}

/* ── Submit ── */
.cq-submit-wrap { display: flex; flex-direction: column; gap: 14px; margin-top: 8px; }
.cq-submit-note {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 16px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 14px;
}
.cq-submit-note i { font-size: 1.1rem; color: var(--accent3); flex-shrink: 0; margin-top: 2px; }
.cq-submit-note p { font-size: 0.78rem; color: var(--text-dim); line-height: 1.65; margin: 0; }

.cq-btn-google {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%; padding: 17px;
  background: var(--accent); color: #fff;
  border: none; border-radius: 14px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  cursor: pointer; transition: all 0.35s;
  box-shadow: 0 8px 32px rgba(139,92,246,0.35);
}
.cq-btn-google:hover:not(:disabled) {
  background: var(--accent2); transform: translateY(-2px);
  box-shadow: 0 14px 44px rgba(139,92,246,0.48);
}
.cq-btn-google:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

/* Spinner */
.cq-spinner {
  display: inline-block;
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  animation: cqSpin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes cqSpin { to { transform: rotate(360deg); } }

/* ── Navigation ── */
.cq-nav {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 24px 36px 32px;
  margin-top: 8px;
  border-top: 1px solid var(--border);
}
.cq-btn-back {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 22px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-dim); transition: all 0.25s;
}
.cq-btn-back:hover { color: var(--text); border-color: var(--gborder2); }

.cq-btn-next {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 28px;
  background: var(--text); color: var(--bg);
  border: none; border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  transition: all 0.3s;
  margin-left: auto;
}
.cq-btn-next:hover {
  background: var(--accent); color: #fff;
  box-shadow: 0 8px 28px rgba(139,92,246,0.35);
  transform: translateY(-1px);
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .cq-hero { padding: 60px 40px 60px; }
  .cq-body { grid-template-columns: 1fr; }
  .cq-left {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding: 36px 40px;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 20px;
  }
  .cq-steps-track { flex-direction: row; flex-wrap: wrap; gap: 4px; }
  .cq-right { padding: 40px 40px 70px; }
}
@media (max-width: 768px) {
  .cq-hero { padding: 50px 24px 52px; min-height: auto; }
  .cq-scroll-hint { right: 24px; }
  .cq-left { padding: 28px 24px; }
  .cq-right { padding: 32px 18px 60px; }
  .cq-card { border-radius: 20px; }
  .cq-step-body { padding: 22px 22px 0; }
  .cq-nav { padding: 20px 22px 26px; }
  .cq-field-row { grid-template-columns: 1fr; }
  .cq-type-grid { grid-template-columns: 1fr 1fr; }
  .cq-budget-grid { grid-template-columns: 1fr; }
  .cq-step-counter { padding: 16px 22px 0; }
}
/* ── Pre-gate section ── */
.cq-pregate {
  display: flex;
  justify-content: center;
  padding: 72px 24px 100px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}
.cq-pregate-inner {
  width: 100%;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.cq-pregate-head { margin-bottom: 4px; }

.cq-btn-pregate {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  width: 100%; padding: 17px;
  background: var(--text); color: var(--bg);
  border: none; border-radius: 14px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.84rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  transition: all 0.35s; margin-top: 8px;
}
.cq-btn-pregate:hover:not(:disabled) {
  background: var(--accent); color: #fff;
  box-shadow: 0 8px 32px rgba(139,92,246,0.38);
  transform: translateY(-2px);
}
.cq-btn-pregate:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Slider ── */
.cq-slider-wrap {
  display: flex; align-items: center; gap: 12px;
  margin-top: 6px;
}
.cq-slider-tick {
  font-size: 0.66rem; color: var(--text-dim); font-weight: 600;
  flex-shrink: 0; width: 22px; text-align: center;
}
.cq-slider {
  -webkit-appearance: none; appearance: none;
  flex: 1; height: 4px; border-radius: 99px;
  background: var(--glass2); outline: none; cursor: pointer;
  border: 1px solid var(--gborder);
}
.cq-slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--accent); cursor: pointer;
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.25);
  transition: box-shadow 0.2s;
}
.cq-slider::-webkit-slider-thumb:hover { box-shadow: 0 0 0 5px rgba(139,92,246,0.3); }
.cq-slider::-moz-range-thumb {
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--accent); cursor: pointer;
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.25);
}
.cq-slider-val {
  margin-left: 10px;
  font-size: 0.78rem; font-weight: 700; color: var(--accent3);
  background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25);
  border-radius: 99px; padding: 2px 10px;
}
.cq-slider-labels {
  display: flex; justify-content: space-between;
  margin-top: 10px; padding: 0 2px;
}
.cq-slider-labels span {
  font-size: 0.65rem; color: var(--text-dim); font-weight: 500;
  transition: color 0.25s;
}
.cq-slider-labels .cq-sl-active { color: var(--accent3); font-weight: 700; }

@media (max-width: 768px) {
  .cq-pregate { padding: 48px 18px 80px; }
}
`;
