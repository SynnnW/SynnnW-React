import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

/* ── Icon map layanan ── */
const SERVICE_ICONS = {
  web:        'fa-globe',
  video:      'fa-film',
  motion:     'fa-wand-magic-sparkles',
  desain:     'fa-palette',
  fotovideo:  'fa-camera',
  livestream: 'fa-tower-broadcast',
};

const SERVICE_LABELS = {
  web:        'Web Design & Development',
  video:      'Video Editing',
  motion:     'Motion Graphic',
  desain:     'Ilustrasi & Desain Grafis',
  fotovideo:  'Fotografi & Videografi',
  livestream: 'Live Streaming & Broadcast',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData]   = useState(null);
  const [userMeta, setUserMeta]   = useState(null); // from auth
  const [loading, setLoading]     = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/');
        return;
      }
      setUserMeta(user);
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) setUserData(snap.data());
      } catch (_) {}
      setLoading(false);
    });
    return () => unsub();
  }, [navigate]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut(auth);
    navigate('/');
  };

  /* ── Inject CSS ── */
  useEffect(() => {
    const id  = 'dash-styles';
    if (document.getElementById(id)) return;
    const el  = document.createElement('style');
    el.id     = id;
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => { const s = document.getElementById(id); if (s) s.remove(); };
  }, []);

  if (loading) {
    return (
      <div className="dash-loader">
        <div className="dash-spinner" />
        <span>Memuat data projek…</span>
      </div>
    );
  }

  const svcKey   = userData?.service || '';
  const svcIcon  = SERVICE_ICONS[svcKey]  || 'fa-star';
  const svcLabel = SERVICE_LABELS[svcKey] || svcKey?.toUpperCase();

  return (
    <div className="dash-wrap">

      {/* ── Top bar ── */}
      <div className="dash-topbar">
        <div className="dash-logo">
          <span className="dash-logo-dot" />
          SynnnW <span className="dash-logo-tag">Dashboard</span>
        </div>
        <button className="dash-btn-signout" onClick={handleSignOut} disabled={signingOut}>
          {signingOut ? <span className="dash-spinner-sm" /> : <i className="fa-solid fa-right-from-bracket" />}
          {signingOut ? 'Keluar…' : 'Sign Out'}
        </button>
      </div>

      {/* ── Main ── */}
      <div className="dash-main">

        {/* Hero greeting */}
        <div className="dash-hero">
          <div className="dash-avatar">
            {userMeta?.photoURL
              ? <img src={userMeta.photoURL} alt="avatar" className="dash-avatar-img" />
              : <i className="fa-solid fa-user" />}
          </div>
          <div>
            <h1 className="dash-greeting">Halo, {userData?.contactName || userMeta?.displayName || 'Klien'}!</h1>
            <p className="dash-subgreet">Data kuis kamu berhasil direkam dengan aman.</p>
          </div>
        </div>

        {/* Status bar */}
        <div className="dash-status-bar">
          <i className="fa-solid fa-circle-dot dash-status-dot" />
          <span>Status Projek: </span>
          <span className="dash-badge-status">{userData?.status || 'Dalam Review'}</span>
        </div>

        {/* Cards grid */}
        <div className="dash-grid">

          {/* Layanan */}
          <div className="dash-card dash-card-accent">
            <div className="dash-card-icon">
              <i className={`fa-solid ${svcIcon}`} />
            </div>
            <p className="dash-card-label">Layanan Utama</p>
            <p className="dash-card-value">{svcLabel}</p>
          </div>

          {/* Budget */}
          <div className="dash-card">
            <div className="dash-card-icon dash-card-icon-alt">
              <i className="fa-solid fa-coins" />
            </div>
            <p className="dash-card-label">Kisaran Budget</p>
            <p className="dash-card-value dash-card-value-sm">{userData?.budget || '—'}</p>
          </div>

          {/* Deadline */}
          <div className="dash-card">
            <div className="dash-card-icon dash-card-icon-alt">
              <i className="fa-solid fa-clock" />
            </div>
            <p className="dash-card-label">Target Waktu</p>
            <p className="dash-card-value dash-card-value-sm">{userData?.deadline || '—'}</p>
          </div>

          {/* Klien type */}
          <div className="dash-card">
            <div className="dash-card-icon dash-card-icon-alt">
              <i className="fa-solid fa-id-card" />
            </div>
            <p className="dash-card-label">Tipe Klien</p>
            <p className="dash-card-value dash-card-value-sm" style={{ textTransform: 'capitalize' }}>
              {userData?.clientType || '—'}
            </p>
          </div>
        </div>

        {/* Detail ringkasan */}
        <div className="dash-detail-card">
          <div className="dash-detail-header">
            <i className="fa-solid fa-file-lines" />
            <h3>Ringkasan Lengkap Projek</h3>
          </div>
          <div className="dash-detail-rows">
            <Row label="Nama Klien"    value={userData?.contactName} />
            <Row label="Email"         value={userData?.email} />
            <Row label="WhatsApp"      value={userData?.whatsapp ? `+62 ${userData.whatsapp}` : undefined} />
            <Row label="Tipe Klien"    value={userData?.clientType} cap />
            <Row label="Layanan"       value={svcLabel} />
            <Row label="Budget"        value={userData?.budget} />
            <Row label="Deadline"      value={userData?.deadline} />
            <Row label="Referral"      value={userData?.referral} />
            {userData?.story && (
              <div className="dash-row dash-row-full">
                <span className="dash-row-label">Cerita / Catatan</span>
                <p className="dash-row-story">{userData.story}</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Bayar */}
        <button className="dash-btn-pay" onClick={() => navigate('/checkout')}>
          <i className="fa-solid fa-qrcode" />
          Lanjutkan ke Invoice &amp; Bayar QRIS
          <i className="fa-solid fa-arrow-right" />
        </button>

        <p className="dash-footnote">
          Butuh revisi data? Hubungi kami via WhatsApp atau email.
        </p>
      </div>
    </div>
  );
}

/* ── Helper row ── */
function Row({ label, value, cap }) {
  if (!value) return null;
  return (
    <div className="dash-row">
      <span className="dash-row-label">{label}</span>
      <span className="dash-row-value" style={cap ? { textTransform: 'capitalize' } : {}}>
        {value}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STYLES — menggunakan CSS variables tema website
───────────────────────────────────────────────────────────── */
const STYLES = `
/* ── Loader ── */
.dash-loader {
  min-height: 60vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 16px; color: var(--text-dim);
  font-family: 'Outfit', sans-serif; font-size: 0.85rem; letter-spacing: 0.06em;
}
.dash-spinner {
  width: 36px; height: 36px; border-radius: 50%;
  border: 2.5px solid var(--gborder);
  border-top-color: var(--accent);
  animation: dashSpin 0.8s linear infinite;
}
.dash-spinner-sm {
  display: inline-block;
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  animation: dashSpin 0.7s linear infinite;
}
@keyframes dashSpin { to { transform: rotate(360deg); } }

/* ── Layout ── */
.dash-wrap {
  min-height: 100vh;
  background: var(--bg);
  font-family: 'Outfit', sans-serif;
}

/* ── Topbar ── */
.dash-topbar {
  position: sticky; top: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 40px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px);
}
.dash-logo {
  display: flex; align-items: center; gap: 8px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.15rem; font-weight: 600; letter-spacing: 0.05em;
  color: var(--text);
}
.dash-logo-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent);
}
.dash-logo-tag {
  font-family: 'Outfit', sans-serif;
  font-size: 0.68rem; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text-dim);
  padding: 3px 8px; border-radius: 6px;
  background: var(--glass2); border: 1px solid var(--gborder);
}
.dash-btn-signout {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 18px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--text-dim);
  transition: all 0.25s;
}
.dash-btn-signout:hover:not(:disabled) {
  color: var(--text); border-color: var(--gborder2);
}
.dash-btn-signout:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Main content ── */
.dash-main {
  max-width: 720px; margin: 0 auto;
  padding: 48px 24px 80px;
  display: flex; flex-direction: column; gap: 24px;
}

/* ── Hero ── */
.dash-hero {
  display: flex; align-items: center; gap: 20px;
}
.dash-avatar {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--glass2); border: 1px solid var(--gborder);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; color: var(--text-dim);
  flex-shrink: 0; overflow: hidden;
}
.dash-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.dash-greeting {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem; font-weight: 600; color: var(--text);
  margin: 0 0 4px;
}
.dash-subgreet {
  font-size: 0.82rem; color: var(--text-dim); margin: 0;
}

/* ── Status bar ── */
.dash-status-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 18px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 12px;
  font-size: 0.8rem; color: var(--text-dim);
}
.dash-status-dot { color: #10b981; font-size: 0.6rem; }
.dash-badge-status {
  padding: 3px 10px; border-radius: 6px;
  background: rgba(251,191,36,0.1);
  color: #fbbf24;
  font-size: 0.72rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
}

/* ── Cards grid ── */
.dash-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}
.dash-card {
  padding: 20px 22px;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 18px;
  display: flex; flex-direction: column; gap: 10px;
}
.dash-card-accent {
  background: rgba(139,92,246,0.08);
  border-color: rgba(139,92,246,0.25);
}
.dash-card-icon {
  width: 40px; height: 40px; border-radius: 12px;
  background: rgba(139,92,246,0.15);
  border: 1px solid rgba(139,92,246,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; color: var(--accent3);
}
.dash-card-icon-alt {
  background: var(--glass2);
  border-color: var(--gborder);
  color: var(--text-dim);
}
.dash-card-label {
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text-dim);
  margin: 0;
}
.dash-card-value {
  font-size: 1rem; font-weight: 700; color: var(--accent3);
  margin: 0; line-height: 1.3;
}
.dash-card-value-sm { font-size: 0.84rem; color: var(--text); font-weight: 500; }

/* ── Detail card ── */
.dash-detail-card {
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 20px; overflow: hidden;
}
.dash-detail-header {
  display: flex; align-items: center; gap: 10px;
  padding: 18px 22px;
  border-bottom: 1px solid var(--border);
  font-size: 0.82rem; font-weight: 700;
  letter-spacing: 0.06em; color: var(--text);
}
.dash-detail-header i { color: var(--accent3); }
.dash-detail-rows {
  padding: 16px 22px;
  display: flex; flex-direction: column; gap: 2px;
}
.dash-row {
  display: flex; align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  gap: 12px;
}
.dash-row:last-child { border-bottom: none; }
.dash-row-label {
  flex: 0 0 140px;
  font-size: 0.73rem; font-weight: 600;
  letter-spacing: 0.05em; text-transform: uppercase;
  color: var(--text-dim);
  padding-top: 1px;
}
.dash-row-value {
  flex: 1;
  font-size: 0.84rem; color: var(--text);
  line-height: 1.55;
}
.dash-row-full { flex-direction: column; gap: 8px; padding: 12px 0; }
.dash-row-story {
  font-size: 0.82rem; color: var(--text);
  line-height: 1.7; margin: 0;
  padding: 12px 16px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 10px;
}

/* ── CTA button ── */
.dash-btn-pay {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  width: 100%; padding: 18px;
  background: var(--accent); color: #fff;
  border: none; border-radius: 16px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  cursor: pointer; transition: all 0.35s;
  box-shadow: 0 8px 32px rgba(139,92,246,0.35);
}
.dash-btn-pay:hover {
  background: var(--accent2);
  transform: translateY(-2px);
  box-shadow: 0 14px 44px rgba(139,92,246,0.48);
}

/* ── Footnote ── */
.dash-footnote {
  text-align: center;
  font-size: 0.74rem; color: var(--text-dim);
  margin: 0;
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .dash-topbar { padding: 14px 20px; }
  .dash-main { padding: 32px 16px 60px; }
  .dash-greeting { font-size: 1.5rem; }
  .dash-grid { grid-template-columns: 1fr; }
  .dash-row-label { flex: 0 0 110px; }
}
`;
