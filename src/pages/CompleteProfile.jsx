import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const CSS = `
.complete-profile-page {
  --bg: #070709;
  --bg2: #0d0d0f;
  --text: #ffffff;
  --text-dim: #94a3b8;
  --text-muted: #64748b;
  --accent: #8b5cf6;
  --accent2: #7c3aed;
  --accent3: #a78bfa;
  --glass: rgba(255,255,255,0.03);
  --gborder: rgba(255,255,255,0.08);
  --input-bg: rgba(255,255,255,0.04);
  --input-focus: rgba(255,255,255,0.06);
  --accent-glow: rgba(139,92,246,0.15);
}

.complete-profile-page {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow: hidden;
}

.complete-profile-page::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--accent3), transparent);
  border-radius: 50%;
  top: -150px;
  left: -150px;
  filter: blur(80px);
  opacity: 0.08;
  pointer-events: none;
}

.complete-profile-page::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--accent3), transparent);
  border-radius: 50%;
  bottom: -100px;
  right: -100px;
  filter: blur(80px);
  opacity: 0.05;
  pointer-events: none;
}

.complete-profile-card {
  background: var(--glass);
  border: 1px solid var(--gborder);
  border-radius: 20px;
  padding: 52px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: relative;
  z-index: 10;
}

.complete-profile-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.4rem;
  color: var(--text);
  text-align: center;
  margin: 0 0 12px;
  font-weight: 300;
  letter-spacing: -0.02em;
}

.complete-profile-subtitle {
  font-size: 0.9rem;
  color: var(--text-dim);
  text-align: center;
  margin-bottom: 36px;
  line-height: 1.6;
}

.complete-profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.complete-profile-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.complete-profile-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.complete-profile-input {
  background: var(--input-bg);
  border: 1px solid var(--gborder);
  border-radius: 10px;
  padding: 12px 16px;
  color: var(--text);
  font-size: 0.95rem;
  font-family: 'Outfit', sans-serif;
  transition: all 0.3s;
}

.complete-profile-input::placeholder {
  color: var(--text-muted);
}

.complete-profile-input:focus {
  outline: none;
  background: var(--input-focus);
  border-color: var(--accent3);
  box-shadow: 0 0 0 2px var(--accent-glow);
}

.complete-profile-phone-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.complete-profile-country-select {
  width: 110px;
  flex-shrink: 0;
  background: var(--input-bg);
  border: 1px solid var(--gborder);
  border-radius: 10px;
  padding: 12px;
  color: var(--text);
  font-size: 0.85rem;
  font-family: 'Outfit', sans-serif;
  transition: all 0.3s;
  cursor: pointer;
}

.complete-profile-country-select:focus {
  outline: none;
  background: var(--input-focus);
  border-color: var(--accent3);
  box-shadow: 0 0 0 2px var(--accent-glow);
}

.complete-profile-phone-number {
  flex: 1;
}

.complete-profile-helper {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: -4px;
}

.complete-profile-button {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
  border: none;
  border-radius: 10px;
  padding: 14px 20px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 12px;
}

.complete-profile-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(139, 92, 246, 0.35);
}

.complete-profile-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.complete-profile-button i {
  margin-right: 8px;
}

.complete-profile-error {
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: 10px;
  padding: 12px 16px;
  color: #fca5a5;
  font-size: 0.9rem;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.complete-profile-error i {
  flex-shrink: 0;
  margin-top: 2px;
}

.complete-profile-success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 10px;
  padding: 12px 16px;
  color: #86efac;
  font-size: 0.9rem;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.complete-profile-success i {
  flex-shrink: 0;
  margin-top: 2px;
}

.complete-profile-info {
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 10px;
  padding: 12px 16px;
  color: #93c5fd;
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 24px;
}

.complete-profile-info strong {
  font-weight: 600;
}
`;

const COUNTRY_CODES = [
  { code: '+62', label: '+62 🇮🇩 Indonesia' },
  { code: '+1', label: '+1 🇺🇸 USA' },
  { code: '+44', label: '+44 🇬🇧 UK' },
  { code: '+81', label: '+81 🇯🇵 Japan' },
  { code: '+86', label: '+86 🇨🇳 China' },
  { code: '+91', label: '+91 🇮🇳 India' },
  { code: '+65', label: '+65 🇸🇬 Singapore' },
  { code: '+60', label: '+60 🇲🇾 Malaysia' },
  { code: '+63', label: '+63 🇵🇭 Philippines' },
  { code: '+84', label: '+84 🇻🇳 Vietnam' },
  { code: '+66', label: '+66 🇹🇭 Thailand' },
  { code: '+82', label: '+82 🇰🇷 Korea' },
  { code: '+61', label: '+61 🇦🇺 Australia' },
  { code: '+49', label: '+49 🇩🇪 Germany' },
  { code: '+33', label: '+33 🇫🇷 France' },
  { code: '+39', label: '+39 🇮🇹 Italy' },
  { code: '+34', label: '+34 🇪🇸 Spain' },
  { code: '+55', label: '+55 🇧🇷 Brazil' },
  { code: '+52', label: '+52 🇲🇽 Mexico' },
  { code: '+27', label: '+27 🇿🇦 South Africa' },
];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const styleRef = useRef(null);

  // User data
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  // Form states
  const [phoneCountryCode, setPhoneCountryCode] = useState('+62');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Inject CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    styleRef.current = style;
    return () => {
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
      }
    };
  }, []);

  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Fetch user data from Firestore
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          if (userDoc.data().phone) {
            // Phone already exists, redirect to dashboard
            navigate('/Dashboard');
          }
        }
      } catch (err) {
        console.error('[CompleteProfile] Error fetching user data:', err);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      setError('Nomor telepon harus diisi.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const fullPhone = `${phoneCountryCode}${phoneNumber.trim()}`;

      // Update user data in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        phone: fullPhone,
        profileCompletedAt: new Date(),
      });

      setSuccess('Profil berhasil dilengkapi! Redirecting ke dashboard...');
      setTimeout(() => navigate('/Dashboard'), 1000);
    } catch (err) {
      console.error('[CompleteProfile] Error updating profile:', err);
      setError('Gagal menyimpan profil. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !userData) {
    return (
      <div style={{ minHeight: '100vh', background: '#070709', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="complete-profile-page">
      <div className="complete-profile-card">
        <h1 className="complete-profile-title">Lengkapi Profil</h1>
        <p className="complete-profile-subtitle">
          Kami perlu nomor telepon Anda untuk menghubungi tentang proyek
        </p>

        {error && (
          <div className="complete-profile-error">
            <i className="fa-solid fa-exclamation-circle" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="complete-profile-success">
            <i className="fa-solid fa-check-circle" />
            <span>{success}</span>
          </div>
        )}

        <div className="complete-profile-info">
          <strong>Nama:</strong> {userData.name || 'User'} <br />
          <strong>Email:</strong> {userData.email}
        </div>

        <form className="complete-profile-form" onSubmit={handleSubmit}>
          <div className="complete-profile-field">
            <label className="complete-profile-label">No. Telepon Internasional</label>
            <div className="complete-profile-phone-row">
              <select
                className="complete-profile-country-select"
                value={phoneCountryCode}
                onChange={(e) => setPhoneCountryCode(e.target.value)}
                disabled={loading}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="complete-profile-input complete-profile-phone-number"
                placeholder="812 3456 7890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="complete-profile-helper">
              Pilih kode negara, lalu isi nomor tanpa angka 0 di depan
            </div>
          </div>

          <button type="submit" className="complete-profile-button" disabled={loading}>
            {loading && <i className="fa-solid fa-spinner fa-spin" />}
            {loading ? 'Menyimpan...' : 'Lengkapi Profil'}
          </button>
        </form>
      </div>
    </div>
  );
}
