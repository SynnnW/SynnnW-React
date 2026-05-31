import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, db } from './firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const CSS = `
/* ── Page ── */
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  display: flex;
  position: relative;
  overflow: hidden;
  font-family: 'Outfit', sans-serif;
}

/* ── Left Sidebar ── */
.auth-sidebar {
  width: 40%;
  background: white;
  border-right: 1px solid #e0e7ff;
  padding: 32px 28px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.auth-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-logo i {
  font-size: 1.8rem;
  color: #6366f1;
}

.auth-sidebar-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #6366f1;
  margin-bottom: 16px;
  margin-top: 24px;
}

.auth-feed {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.auth-feed-item {
  padding: 14px 12px;
  border-radius: 12px;
  background: #f8f9fa;
  border-left: 3px solid #6366f1;
  cursor: pointer;
  transition: all 0.25s;
  text-decoration: none;
  display: block;
}

.auth-feed-item:hover {
  background: #f0f3ff;
  transform: translateX(4px);
}

.auth-feed-item-label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6366f1;
  margin-bottom: 4px;
}

.auth-feed-item-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
  line-height: 1.4;
}

.auth-feed-item-desc {
  font-size: 0.75rem;
  color: #718096;
  line-height: 1.4;
}

.auth-feed-item-date {
  font-size: 0.70rem;
  color: #a0aec0;
  margin-top: 6px;
}

/* ── Right Container ── */
.auth-right {
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

/* ── Card ── */
.auth-card {
  background: white;
  border: 1px solid #e0e7ff;
  border-radius: 16px;
  padding: 48px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* ── Typography ── */
.auth-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.2rem;
  color: #1a202c;
  text-align: center;
  margin: 0 0 8px;
  font-weight: 400;
}

.auth-sub {
  font-size: 0.85rem;
  color: #718096;
  text-align: center;
  margin-bottom: 28px;
  line-height: 1.6;
}

/* ── Tabs ── */
.auth-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 32px;
  border-bottom: 1px solid #e2e8f0;
}

.auth-tab {
  flex: 1;
  padding: 12px;
  border: none;
  background: none;
  color: #718096;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
  text-align: center;
}

.auth-tab.active {
  color: #6366f1;
  border-bottom-color: #6366f1;
}

/* ── Form ── */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.auth-input {
  background: #f7fafc;
  border: 1px solid #cbd5e0;
  border-radius: 10px;
  padding: 12px 14px;
  color: #1a202c;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.auth-input:focus {
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.auth-input::placeholder {
  color: #a0aec0;
}

.auth-input-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #4a5568;
  margin-bottom: 4px;
  display: block;
}

.auth-input-helper {
  font-size: 0.75rem;
  color: #718096;
  margin-top: -10px;
  margin-left: 2px;
}

/* ── Password Warning ── */
.auth-password-warning {
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 10px;
  padding: 12px 14px;
  margin: 12px 0;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.auth-password-warning i {
  font-size: 0.9rem;
  color: #d97706;
  margin-top: 2px;
  flex-shrink: 0;
}

.auth-password-warning-text {
  font-size: 0.8rem;
  color: #92400e;
  line-height: 1.5;
}

.auth-password-warning-text strong {
  color: #78350f;
  font-weight: 600;
}

/* ── Checkbox ── */
.auth-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 16px 0;
}

.auth-checkbox input {
  margin-top: 3px;
  cursor: pointer;
}

.auth-checkbox label {
  font-size: 0.8rem;
  color: #718096;
  line-height: 1.5;
  cursor: pointer;
}

.auth-checkbox a {
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.auth-checkbox a:hover {
  color: #4f46e5;
  text-decoration: underline;
}

/* ── Button ── */
.auth-btn {
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.auth-btn:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-btn-google {
  background: white;
  color: #1a202c;
  border: 1px solid #cbd5e0;
  margin-top: 8px;
}

.auth-btn-google:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #6366f1;
}

/* ── Divider ── */
.auth-divider {
  text-align: center;
  color: #a0aec0;
  font-size: 0.8rem;
  margin: 20px 0;
  position: relative;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background: #e2e8f0;
}

.auth-divider::before {
  left: 0;
}

.auth-divider::after {
  right: 0;
}

/* ── Toggle ── */
.auth-toggle {
  text-align: center;
  margin-top: 20px;
  font-size: 0.8rem;
  color: #718096;
  line-height: 1.6;
}

.auth-toggle button {
  background: none;
  border: none;
  color: #6366f1;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
  padding: 0;
  text-decoration: none;
}

.auth-toggle button:hover {
  color: #4f46e5;
  text-decoration: underline;
}

/* ── Error/Success ── */
.auth-err {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.8rem;
  line-height: 1.5;
  margin-bottom: 16px;
}

.auth-success {
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.25);
  color: #22c55e;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.8rem;
  line-height: 1.5;
  margin-bottom: 16px;
}

/* ── Links ── */
.auth-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  font-size: 0.72rem;
  color: #718096;
}

.auth-links a {
  color: #6366f1;
  text-decoration: none;
  transition: all 0.2s;
}

.auth-links a:hover {
  text-decoration: underline;
  color: #4f46e5;
}

.auth-links-sep {
  width: 1px;
  height: 12px;
  background: #cbd5e0;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .auth-sidebar {
    width: 35%;
    padding: 24px 20px;
  }
  .auth-right {
    width: 65%;
    padding: 30px;
  }
  .auth-card {
    padding: 36px;
    max-width: 460px;
  }
}

@media (max-width: 768px) {
  .auth-page {
    flex-direction: column;
  }
  .auth-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e7ff;
    max-height: 200px;
  }
  .auth-right {
    width: 100%;
  }
  .auth-card {
    padding: 32px 24px;
    margin: 20px;
    max-width: 100%;
  }
  .auth-title {
    font-size: 1.8rem;
  }
  .auth-feed {
    flex-direction: row;
    overflow-x: auto;
  }
  .auth-feed-item {
    min-width: 180px;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px 16px;
  }
  .auth-title {
    font-size: 1.5rem;
  }
  .auth-feed {
    flex-direction: row;
    overflow-x: auto;
    gap: 12px;
  }
  .auth-feed-item {
    min-width: 140px;
  }
}

/* ── Scrollbar ── */
.auth-sidebar::-webkit-scrollbar {
  width: 6px;
}
.auth-sidebar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}
.auth-sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}
.auth-sidebar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
`;

// Portfolio/News Feed Data
const FEED_ITEMS = [
  {
    id: 1,
    type: 'portfolio',
    label: 'Portfolio',
    title: 'Video Editing',
    description: 'Professional editing dengan motion graphics',
    date: 'Latest',
    icon: 'fa-film',
  },
  {
    id: 2,
    type: 'portfolio',
    label: 'Portfolio',
    title: 'Web Design',
    description: 'Modern & responsive website design',
    date: 'Latest',
    icon: 'fa-globe',
  },
  {
    id: 3,
    type: 'service',
    label: 'Service',
    title: 'Live Stream',
    description: 'Event streaming & broadcast production',
    date: 'Available',
    icon: 'fa-video',
  },
  {
    id: 4,
    type: 'portfolio',
    label: 'Portfolio',
    title: 'Design',
    description: 'Graphic & UI/UX design solutions',
    date: 'Latest',
    icon: 'fa-palette',
  },
  {
    id: 5,
    type: 'portfolio',
    label: 'Portfolio',
    title: 'Digital Wedding',
    description: 'Pre-wedding & wedding cinematography',
    date: 'Latest',
    icon: 'fa-heart',
  },
];

export default function AuthLogin() {
  const navigate = useNavigate();
  
  // States
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const styleRef = useRef(null);

  // Inject CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    styleRef.current = style;
    return () => document.head.removeChild(style);
  }, []);

  // Check if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/contact');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Password mismatch validation
  useEffect(() => {
    if (mode === 'register' && confirmPassword) {
      setPasswordMismatch(password !== confirmPassword);
    } else {
      setPasswordMismatch(false);
    }
  }, [password, confirmPassword, mode]);

  // Login dengan Email/Password
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Email dan password tidak boleh kosong.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      setSuccess('Berhasil login! Redirecting...');
      setTimeout(() => {
        navigate('/contact');
      }, 1000);
    } catch (err) {
      console.error('[AuthLogin] Email login error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('Email tidak terdaftar. Silahkan buat akun terlebih dahulu.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Password salah. Coba lagi.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Email atau password tidak valid.');
      } else {
        setError('Gagal login. Coba lagi nanti.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Register dengan Email/Password
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Semua field harus diisi.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    if (!agreeTerms) {
      setError('Anda harus setuju dengan Kebijakan Privasi.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = result.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        authMethod: 'email',
        createdAt: new Date(),
      });

      setSuccess('Akun berhasil dibuat! Redirecting...');
      setTimeout(() => {
        navigate('/contact');
      }, 1500);
    } catch (err) {
      console.error('[AuthLogin] Register error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silahkan login atau gunakan email lain.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol.');
      } else {
        setError('Gagal membuat akun. Coba lagi nanti.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Register dengan Google
  const handleGoogleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        setSuccess('Akun sudah terdaftar! Redirecting...');
        setTimeout(() => {
          navigate('/contact');
        }, 1000);
        return;
      }

      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || 'Google User',
        email: user.email,
        photoURL: user.photoURL || null,
        authMethod: 'google',
        createdAt: new Date(),
      });

      setSuccess('Akun berhasil dibuat! Silahkan lengkapi profile Anda.');
      setTimeout(() => {
        navigate('/contact');
      }, 1500);
    } catch (err) {
      console.error('[AuthLogin] Google register error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Popup ditutup. Silahkan coba lagi.');
      } else {
        setError('Gagal daftar dengan Google. Coba lagi nanti.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── LEFT SIDEBAR: Portfolio Feed ── */}
      <div className="auth-sidebar">
        <div className="auth-logo">
          <i className="fa-solid fa-sparkles" />
          SynnnW Studio
        </div>

        <div className="auth-sidebar-label">Our Works & Services</div>
        <div className="auth-feed">
          {FEED_ITEMS.map((item) => (
            <a key={item.id} href="#" className="auth-feed-item" onClick={(e) => e.preventDefault()}>
              <div className="auth-feed-item-label">{item.label}</div>
              <div className="auth-feed-item-title">
                <i className={`fa-solid ${item.icon}`} /> {item.title}
              </div>
              <div className="auth-feed-item-desc">{item.description}</div>
              <div className="auth-feed-item-date">{item.date}</div>
            </a>
          ))}
        </div>
      </div>

      {/* ── RIGHT CONTAINER: Login/Register Form ── */}
      <div className="auth-right">
        <div className="auth-card">
          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login');
                setError('');
                setSuccess('');
              }}
            >
              Masuk
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setMode('register');
                setError('');
                setSuccess('');
              }}
            >
              Daftar
            </button>
          </div>

          <h1 className="auth-title">
            {mode === 'login' ? 'Masuk' : 'Buat Akun'}
          </h1>
          <p className="auth-sub">
            {mode === 'login'
              ? 'Akses dashboard dan kelola proyek Anda'
              : 'Bergabunglah dengan kami untuk memulai'}
          </p>

          {error && <div className="auth-err">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          {/* ── LOGIN MODE ── */}
          {mode === 'login' && (
            <form className="auth-form" onSubmit={handleEmailLogin}>
              <div>
                <label className="auth-input-label">Email atau No. Telepon</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="auth-input-label">Password</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>
          )}

          {/* ── REGISTER MODE ── */}
          {mode === 'register' && (
            <form className="auth-form" onSubmit={handleEmailRegister}>
              <div>
                <label className="auth-input-label">Nama Lengkap</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="auth-input-label">Email</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="auth-input-label">No. Telepon</label>
                <input
                  type="tel"
                  className="auth-input"
                  placeholder="+62 821 2345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="auth-input-label">Password</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <div className="auth-input-helper">Min. 8 karakter, gunakan huruf, angka, dan simbol</div>
              </div>

              {/* Password Security Warning */}
              <div className="auth-password-warning">
                <i className="fa-solid fa-triangle-exclamation" />
                <div className="auth-password-warning-text">
                  <strong>⚠️ Penting:</strong> Jangan gunakan password yang sama dengan password Google Anda. Gunakan password yang berbeda demi kenyamanan dan privasi Anda.
                </div>
              </div>

              <div>
                <label className="auth-input-label">Konfirmasi Password</label>
                <input
                  type="password"
                  className={`auth-input ${passwordMismatch ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                {passwordMismatch && (
                  <div className="auth-input-helper" style={{ color: '#dc2626' }}>
                    ❌ Password tidak cocok
                  </div>
                )}
              </div>

              {/* Privacy Agreement */}
              <div className="auth-checkbox">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="terms">
                  Dengan mendaftar, saya menyetujui{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer">
                    Kebijakan Privasi
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="auth-btn"
                disabled={loading || passwordMismatch || !agreeTerms}
              >
                {loading ? 'Membuat Akun...' : 'Daftar'}
              </button>

              {/* Google Alternative */}
              <div className="auth-divider">atau</div>
              <button
                type="button"
                className="auth-btn auth-btn-google"
                onClick={handleGoogleRegister}
                disabled={loading}
              >
                <i className="fa-brands fa-google" />
                Daftar dengan Google
              </button>
            </form>
          )}

          {/* Links */}
          <div className="auth-links">
            <a href="/terms">Syarat & Ketentuan</a>
            <div className="auth-links-sep" />
            <a href="/terms">Privasi</a>
          </div>
        </div>
      </div>
    </div>
  );
}
