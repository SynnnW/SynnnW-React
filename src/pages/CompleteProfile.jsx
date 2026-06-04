import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/* ══════════════════════════════════════════════════════
   COUNTRY CODES
══════════════════════════════════════════════════════ */
const COUNTRY_CODES = [
  { code: '+62', label: '+62 🇮🇩 Indonesia' },
  { code: '+1',  label: '+1  🇺🇸 USA / Canada' },
  { code: '+44', label: '+44 🇬🇧 UK' },
  { code: '+61', label: '+61 🇦🇺 Australia' },
  { code: '+65', label: '+65 🇸🇬 Singapore' },
  { code: '+60', label: '+60 🇲🇾 Malaysia' },
  { code: '+63', label: '+63 🇵🇭 Philippines' },
  { code: '+66', label: '+66 🇹🇭 Thailand' },
  { code: '+84', label: '+84 🇻🇳 Vietnam' },
  { code: '+82', label: '+82 🇰🇷 Korea' },
  { code: '+81', label: '+81 🇯🇵 Japan' },
  { code: '+86', label: '+86 🇨🇳 China' },
  { code: '+91', label: '+91 🇮🇳 India' },
  { code: '+49', label: '+49 🇩🇪 Germany' },
  { code: '+33', label: '+33 🇫🇷 France' },
  { code: '+39', label: '+39 🇮🇹 Italy' },
  { code: '+34', label: '+34 🇪🇸 Spain' },
  { code: '+55', label: '+55 🇧🇷 Brazil' },
  { code: '+52', label: '+52 🇲🇽 Mexico' },
  { code: '+27', label: '+27 🇿🇦 South Africa' },
];

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function CompleteProfile() {
  const navigate = useNavigate();

  /* ── Auth state ── */
  const [user, setUser]             = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* ── Form state ── */
  const [name, setName]                 = useState('');
  const [countryCode, setCountryCode]   = useState('+62');
  const [phoneNumber, setPhoneNumber]   = useState('');
  const [termsChecked, setTermsChecked] = useState(false);

  /* ── UI state ── */
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [photoError, setPhotoError] = useState(false);

  /* ── CSS inject ── */
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'cp-page-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.getElementById('cp-page-styles')?.remove();
  }, []);

  /* ── Auth listener + redirect if already complete ── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login', { replace: true });
        return;
      }

      setUser(currentUser);
      // Pre-fill name dari Google displayName
      setName(currentUser.displayName || '');

      // Cek apakah profil sudah lengkap (phone exists)
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        if (snap.exists() && snap.data()?.phone) {
          navigate('/Dashboard', { replace: true });
          return;
        }
      } catch (e) {
        console.warn('[CompleteProfile] Firestore check failed:', e);
      }

      setAuthLoading(false);
    });
    return () => unsub();
  }, [navigate]);

  /* ── Submit ── */
  const handleSubmit = async () => {
    setError('');

    // Validasi
    if (!name.trim()) {
      setError('Nama tidak boleh kosong.');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Nomor telepon harus diisi.');
      return;
    }
    if (!/^\d{6,15}$/.test(phoneNumber.replace(/\s/g, ''))) {
      setError('Format nomor telepon tidak valid.');
      return;
    }
    if (!termsChecked) {
      setError('Kamu harus menyetujui Terms & Conditions untuk melanjutkan.');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `${countryCode}${phoneNumber.trim().replace(/^0+/, '')}`;

      // 1. Update Firebase Auth displayName
      await updateProfile(auth.currentUser, { displayName: name.trim() });

      // 2. Set Firestore doc (create or overwrite)
      await setDoc(doc(db, 'users', user.uid), {
        name:        name.trim(),
        email:       user.email,
        phone:       fullPhone,
        authMethod:  'google',
        createdAt:   serverTimestamp(),
      });

      // 3. Redirect ke Dashboard
      navigate('/Dashboard', { replace: true });

    } catch (e) {
      console.error('[CompleteProfile] Submit error:', e);
      setError('Gagal menyimpan profil. Silakan coba lagi.');
      setLoading(false);
    }
  };

  /* ── Loading screen ── */
  if (authLoading) {
    return (
      <div className="cp-fullscreen">
        <div className="cp-spinner">
          <i className="fa-solid fa-spinner fa-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="cp-fullscreen">

      {/* ── Background orbs ── */}
      <div className="cp-orb cp-orb-1" />
      <div className="cp-orb cp-orb-2" />

      <div className="cp-card">

        {/* ── Banner ── */}
        <div className="cp-banner">
          <i className="fa-solid fa-circle-info" />
          <span>Lengkapi profil kamu untuk melanjutkan</span>
        </div>

        {/* ── Heading ── */}
        <h1 className="cp-title">
          Satu Langkah Lagi
        </h1>
        <p className="cp-sub">
          Kami butuh beberapa info tambahan sebelum kamu masuk ke dashboard.
        </p>

        {/* ── Google Account Info ── */}
        {user && (
          <div className="cp-google-info">
            <div className="cp-avatar">
              {!photoError && user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  referrerPolicy="no-referrer"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <i className="fa-solid fa-user" />
              )}
            </div>
            <div className="cp-google-meta">
              <span className="cp-google-label">Masuk sebagai</span>
              <span className="cp-google-email">{user.email}</span>
            </div>
            <div className="cp-google-badge">
              <i className="fa-brands fa-google" />
              Google
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="cp-error">
            <i className="fa-solid fa-triangle-exclamation" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Form ── */}
        <div className="cp-form">

          {/* Nama */}
          <div className="cp-field">
            <label className="cp-label">
              Nama Lengkap <span className="cp-required">*</span>
            </label>
            <input
              type="text"
              className="cp-input"
              placeholder="Nama lengkap kamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoComplete="name"
            />
          </div>

          {/* Email (readonly) */}
          <div className="cp-field">
            <label className="cp-label">
              Email
              <span className="cp-readonly-tag">dari Google</span>
            </label>
            <input
              type="email"
              className="cp-input cp-input-readonly"
              value={user?.email || ''}
              readOnly
              tabIndex={-1}
            />
          </div>

          {/* No. Telepon */}
          <div className="cp-field">
            <label className="cp-label">
              Nomor Telepon <span className="cp-required">*</span>
            </label>
            <div className="cp-phone-row">
              <select
                className="cp-select"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                disabled={loading}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <input
                type="tel"
                className="cp-input cp-phone-input"
                placeholder="812 3456 7890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9\s]/g, ''))}
                disabled={loading}
                autoComplete="tel-national"
              />
            </div>
            <span className="cp-hint">
              Pilih kode negara · isi nomor tanpa angka 0 di depan
            </span>
          </div>

          {/* Terms */}
          <div className="cp-terms-row">
            <div
              className={`cp-checkbox${termsChecked ? ' checked' : ''}`}
              onClick={() => !loading && setTermsChecked((v) => !v)}
              role="checkbox"
              aria-checked={termsChecked}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && !loading && setTermsChecked((v) => !v)}
            >
              {termsChecked && <i className="fa-solid fa-check" />}
            </div>
            <p className="cp-terms-text">
              Saya setuju dengan{' '}
              <span
                className="cp-terms-link"
                onClick={() => window.open('/terms', '_blank')}
              >
                Terms & Conditions
              </span>{' '}
              SynnnW Studio
            </p>
          </div>

          {/* Submit */}
          <button
            className="cp-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <span>Simpan &amp; Lanjutkan</span>
                <i className="fa-solid fa-arrow-right" />
              </>
            )}
          </button>

        </div>
        {/* /cp-form */}

        <p className="cp-footer-note">
          Data kamu aman. Hanya digunakan untuk keperluan proyek.
        </p>

      </div>
      {/* /cp-card */}

    </div>
  );
}

/* ══════════════════════════════════════════════════════
   CSS — inject via useEffect, pakai globals.css variables
══════════════════════════════════════════════════════ */
const CSS = `
/* Fullscreen wrapper */
.cp-fullscreen {
  min-height: 100vh;
  background: var(--bg, #070709);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

/* Background orbs */
.cp-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
}
.cp-orb-1 {
  width: 500px; height: 500px;
  top: -150px; right: -80px;
  background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
}
.cp-orb-2 {
  width: 400px; height: 400px;
  bottom: -120px; left: -60px;
  background: radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 70%);
}

/* Spinner (auth loading) */
.cp-spinner {
  font-size: 2rem;
  color: var(--accent, #8b5cf6);
  animation: cpSpin 0.8s linear infinite;
}
@keyframes cpSpin { to { transform: rotate(360deg); } }

/* Card */
.cp-card {
  background: var(--glass, rgba(255,255,255,0.04));
  border: 1px solid var(--gborder, rgba(255,255,255,0.08));
  border-radius: 24px;
  padding: 48px 44px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 24px 80px var(--shadow, rgba(0,0,0,0.6));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: relative;
  z-index: 10;
}

/* Banner */
.cp-banner {
  display: flex;
  align-items: center;
  gap: 9px;
  background: rgba(139,92,246,0.1);
  border: 1px solid rgba(139,92,246,0.22);
  border-radius: 10px;
  padding: 11px 16px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  color: var(--accent3, #a78bfa);
  margin-bottom: 28px;
}
.cp-banner i { flex-shrink: 0; font-size: 0.85rem; }

/* Heading */
.cp-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.4rem;
  font-weight: 300;
  color: var(--text, #f0ede8);
  line-height: 1.1;
  margin-bottom: 10px;
}
.cp-sub {
  font-family: 'Outfit', sans-serif;
  font-size: 0.84rem;
  color: var(--text-dim, #64605a);
  line-height: 1.6;
  margin-bottom: 28px;
}

/* Google info */
.cp-google-info {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--glass2, rgba(255,255,255,0.07));
  border: 1px solid var(--gborder, rgba(255,255,255,0.08));
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 24px;
}
.cp-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--border2, rgba(255,255,255,0.12));
  background: var(--glass, rgba(255,255,255,0.04));
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dim, #64605a);
  font-size: 1rem;
}
.cp-avatar img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}
.cp-google-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.cp-google-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim, #64605a);
}
.cp-google-email {
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem;
  color: var(--text, #f0ede8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cp-google-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-dim, #64605a);
  flex-shrink: 0;
  letter-spacing: 0.04em;
}
.cp-google-badge i { color: #4285F4; }

/* Error */
.cp-error {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(248,113,113,0.09);
  border: 1px solid rgba(248,113,113,0.28);
  border-radius: 10px;
  padding: 12px 15px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem;
  color: #fca5a5;
  margin-bottom: 20px;
  line-height: 1.5;
}
.cp-error i { flex-shrink: 0; margin-top: 2px; }

/* Form */
.cp-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.cp-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.cp-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text, #f0ede8);
  display: flex;
  align-items: center;
  gap: 8px;
}
.cp-required { color: var(--accent3, #a78bfa); }
.cp-readonly-tag {
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--text-dim, #64605a);
  background: var(--glass2, rgba(255,255,255,0.07));
  border: 1px solid var(--gborder, rgba(255,255,255,0.08));
  border-radius: 99px;
  padding: 2px 9px;
}

/* Inputs */
.cp-input {
  background: var(--glass, rgba(255,255,255,0.04));
  border: 1px solid var(--gborder, rgba(255,255,255,0.08));
  border-radius: 10px;
  padding: 13px 16px;
  color: var(--text, #f0ede8);
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  width: 100%;
}
.cp-input::placeholder { color: var(--text-dim, #64605a); }
.cp-input:focus {
  outline: none;
  border-color: var(--accent3, #a78bfa);
  background: var(--glass2, rgba(255,255,255,0.07));
  box-shadow: 0 0 0 3px rgba(139,92,246,0.14);
}
.cp-input:disabled { opacity: 0.55; cursor: not-allowed; }
.cp-input-readonly {
  cursor: default;
  opacity: 0.6;
  border-style: dashed;
}
.cp-input-readonly:focus {
  border-color: var(--gborder, rgba(255,255,255,0.08));
  box-shadow: none;
  background: var(--glass, rgba(255,255,255,0.04));
}

/* Phone row */
.cp-phone-row {
  display: flex;
  gap: 10px;
}
.cp-select {
  width: 130px;
  flex-shrink: 0;
  background: var(--glass, rgba(255,255,255,0.04));
  border: 1px solid var(--gborder, rgba(255,255,255,0.08));
  border-radius: 10px;
  padding: 13px 10px;
  color: var(--text, #f0ede8);
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
  transition: border-color 0.25s, background 0.25s;
  -webkit-appearance: none;
}
.cp-select:focus {
  outline: none;
  border-color: var(--accent3, #a78bfa);
  background: var(--glass2, rgba(255,255,255,0.07));
  box-shadow: 0 0 0 3px rgba(139,92,246,0.14);
}
.cp-select:disabled { opacity: 0.55; cursor: not-allowed; }
.cp-select option { background: #1a1a2e; color: #f0ede8; }
.cp-phone-input { flex: 1; }
.cp-hint {
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem;
  color: var(--text-dim, #64605a);
  letter-spacing: 0.02em;
}

/* Terms */
.cp-terms-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 4px 0;
}
.cp-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1.5px solid var(--gborder2, rgba(255,255,255,0.12));
  background: var(--glass, rgba(255,255,255,0.04));
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1px;
  font-size: 0.65rem;
  color: #fff;
}
.cp-checkbox.checked {
  background: var(--accent, #8b5cf6);
  border-color: var(--accent, #8b5cf6);
}
.cp-checkbox:hover:not(.checked) {
  border-color: var(--accent3, #a78bfa);
}
.cp-terms-text {
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem;
  color: var(--text-dim, #64605a);
  line-height: 1.5;
}
.cp-terms-link {
  color: var(--accent3, #a78bfa);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
}
.cp-terms-link:hover { color: var(--accent2, #a78bfa); }

/* Submit button */
.cp-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, var(--accent, #8b5cf6) 0%, var(--accent2, #7c3aed) 100%);
  border: none;
  border-radius: 12px;
  padding: 15px 20px;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 6px;
  box-shadow: 0 8px 28px rgba(139,92,246,0.3);
}
.cp-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 38px rgba(139,92,246,0.42);
}
.cp-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

/* Footer note */
.cp-footer-note {
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem;
  color: var(--text-dim, #64605a);
  text-align: center;
  margin-top: 22px;
  opacity: 0.7;
  letter-spacing: 0.04em;
}

/* Mobile */
@media (max-width: 520px) {
  .cp-card { padding: 36px 24px; border-radius: 18px; }
  .cp-title { font-size: 2rem; }
  .cp-phone-row { flex-direction: column; }
  .cp-select { width: 100%; }
}
`;
