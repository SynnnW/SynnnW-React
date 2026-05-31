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
  background: linear-gradient(135deg, #070709 0%, #1a1a2e 100%);
  display: flex;
  position: relative;
  overflow: hidden;
  font-family: 'Outfit', sans-serif;
}

.auth-page::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
  border-radius: 50%;
  top: -100px;
  left: -100px;
  filter: blur(60px);
  pointer-events: none;
}

.auth-page::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
  border-radius: 50%;
  bottom: 50px;
  right: -50px;
  filter: blur(60px);
  pointer-events: none;
}

/* ── Left Sidebar ── */
.auth-sidebar {
  width: 45%;
  background: rgba(15, 15, 25, 0.4);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(139,92,246,0.1);
  padding: 40px 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.auth-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  font-weight: 300;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.01em;
}

.auth-logo i {
  font-size: 1.6rem;
  color: #a78bfa;
}

.auth-sidebar-label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #a78bfa;
  margin-top: 8px;
}

.auth-feed {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.auth-feed-item {
  padding: 16px 14px;
  border-radius: 14px;
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.15);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-feed-item:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.3);
  transform: translateY(-2px);
}

.auth-feed-item-label {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #a78bfa;
}

.auth-feed-item-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-feed-item-title i {
  font-size: 0.85rem;
  color: #a78bfa;
}

.auth-feed-item-desc {
  font-size: 0.75rem;
  color: #94a3b8;
  line-height: 1.5;
}

.auth-feed-item-date {
  font-size: 0.68rem;
  color: #64748b;
}

/* ── Right Container ── */
.auth-right {
  width: 55%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  z-index: 10;
}

/* ── Card ── */
.auth-card {
  background: rgba(30, 30, 50, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  padding: 48px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* ── Typography ── */
.auth-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.4rem;
  color: #ffffff;
  text-align: center;
  margin: 0 0 12px;
  font-weight: 300;
  letter-spacing: -0.02em;
}

.auth-sub {
  font-size: 0.85rem;
  color: #94a3b8;
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.6;
}

/* ── Tabs ── */
.auth-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 32px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.15);
}

.auth-tab {
  flex: 1;
  padding: 12px;
  border: none;
  background: none;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  border-bottom: 3px solid transparent;
  text-align: center;
}

.auth-tab.active {
  color: #a78bfa;
  border-bottom-color: #a78bfa;
}

/* ── Form ── */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-input {
  background: rgba(51, 51, 80, 0.4);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 12px 14px;
  color: #ffffff;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.25s;
  width: 100%;
  box-sizing: border-box;
  backdrop-filter: blur(5px);
}

.auth-input:focus {
  border-color: #a78bfa;
  background: rgba(51, 51, 80, 0.6);
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.15);
}

.auth-input::placeholder {
  color: #64748b;
}

.auth-input-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 6px;
  display: block;
}

.auth-input-helper {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: -10px;
  margin-left: 2px;
}

/* ── Password Warning ── */
.auth-password-warning {
  background: rgba(217, 119, 6, 0.1);
  border: 1px solid rgba(217, 119, 6, 0.3);
  border-radius: 12px;
  padding: 12px 14px;
  margin: 12px 0;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.auth-password-warning i {
  font-size: 0.9rem;
  color: #ea580c;
  margin-top: 2px;
  flex-shrink: 0;
}

.auth-password-warning-text {
  font-size: 0.8rem;
  color: #fde047;
  line-height: 1.5;
}

.auth-password-warning-text strong {
  color: #fbbf24;
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
  accent-color: #a78bfa;
}

.auth-checkbox label {
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.5;
  cursor: pointer;
}

.auth-checkbox a {
  color: #a78bfa;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.auth-checkbox a:hover {
  color: #c4b5fd;
  text-decoration: underline;
}

/* ── Button ── */
.auth-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.auth-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-btn-google {
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #a78bfa;
}

.auth-btn-google:hover:not(:disabled) {
  background: rgba(139, 92, 246, 0.25);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
}

/* ── Alerts ── */
.auth-err {
  background: rgba(220, 38, 38, 0.12);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #fca5a5;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-err::before {
  content: '⚠️';
  flex-shrink: 0;
}

.auth-success {
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #86efac;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-success::before {
  content: '✓';
  flex-shrink: 0;
}

/* ── Divider ── */
.auth-divider {
  text-align: center;
  color: #64748b;
  font-size: 0.8rem;
  margin: 20px 0;
  position: relative;
}

.auth-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(139, 92, 246, 0.1);
  z-index: -1;
}

.auth-divider { background: rgba(30, 30, 50, 0.5); padding: 0 8px; }

/* ── Links ── */
.auth-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  font-size: 0.72rem;
  color: #64748b;
}

.auth-links a {
  color: #a78bfa;
  text-decoration: none;
  transition: all 0.2s;
}

.auth-links a:hover {
  text-decoration: underline;
  color: #c4b5fd;
}

.auth-links-sep {
  width: 1px;
  height: 12px;
  background: rgba(139, 92, 246, 0.2);
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .auth-sidebar {
    width: 40%;
    padding: 32px 24px;
  }
  .auth-right {
    width: 60%;
    padding: 30px;
  }
  .auth-card {
    padding: 40px;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .auth-page {
    flex-direction: column;
  }
  .auth-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(139,92,246,0.1);
    max-height: 220px;
    padding: 24px 20px;
  }
  .auth-right {
    width: 100%;
    padding: 20px;
  }
  .auth-card {
    padding: 32px 24px;
    max-width: 100%;
  }
  .auth-title {
    font-size: 2rem;
  }
  .auth-feed {
    flex-direction: row;
    overflow-x: auto;
    gap: 12px;
    scroll-behavior: smooth;
  }
  .auth-feed-item {
    min-width: 160px;
    flex-shrink: 0;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px 16px;
  }
  .auth-title {
    font-size: 1.6rem;
  }
  .auth-tab {
    font-size: 0.8rem;
    padding: 10px;
  }
  .auth-feed {
    flex-direction: row;
    overflow-x: auto;
    gap: 10px;
  }
  .auth-feed-item {
    min-width: 140px;
    padding: 12px;
    font-size: 0.8rem;
  }
}

/* ── Scrollbar ── */
.auth-sidebar::-webkit-scrollbar {
  width: 6px;
}
.auth-sidebar::-webkit-scrollbar-track {
  background: rgba(139, 92, 246, 0.05);
  border-radius: 10px;
}
.auth-sidebar::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.2);
  border-radius: 10px;
}
.auth-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.4);
}

.auth-feed::-webkit-scrollbar {
  height: 4px;
}
.auth-feed::-webkit-scrollbar-track {
  background: transparent;
}
.auth-feed::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.2);
  border-radius: 10px;
}
`;

// Portfolio/News Feed Data - 5 cards dengan hooks yang menarik
const FEED_ITEMS = [
  {
    id: 1,
    type: 'journal',
    label: 'Journal',
    title: 'Creative Works',
    description: 'Explore our digital art & design collection',
    date: 'Latest',
    icon: 'fa-pen-fancy',
  },
  {
    id: 2,
    type: 'service',
    label: 'Service',
    title: 'Live Stream',
    description: 'Professional event broadcasting & streaming',
    date: 'Available',
    icon: 'fa-video',
  },
  {
    id: 3,
    type: 'portfolio',
    label: 'Portfolio',
    title: 'Video Editing',
    description: 'Cinematic content with motion graphics',
    date: 'Latest',
    icon: 'fa-film',
  },
  {
    id: 4,
    type: 'portfolio',
    label: 'Portfolio',
    title: 'Wedding Design',
    description: 'Digital wedding & pre-wedding packages',
    date: 'Latest',
    icon: 'fa-heart',
  },
  {
    id: 5,
    type: 'contact',
    label: 'Get In Touch',
    title: 'Contact Us',
    description: 'Discuss your project with our team',
    date: 'Ongoing',
    icon: 'fa-envelope',
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
    }
  }, [password, confirmPassword, mode]);

  // Login dengan Email
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email dan password harus diisi.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      setSuccess('Login berhasil! Redirecting...');
      setTimeout(() => {
        navigate('/contact');
      }, 1000);
    } catch (err) {
      console.error('[AuthLogin] Login error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('Email tidak terdaftar.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Password salah.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Email atau password salah.');
      } else {
        setError('Gagal login. Coba lagi nanti.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Register dengan Email
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !phone || !password || !confirmPassword) {
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
          SynnnW
        </div>

        <div className="auth-sidebar-label">Our Latest Works</div>
        <div className="auth-feed">
          {FEED_ITEMS.map((item) => (
            <a key={item.id} href="#" className="auth-feed-item" onClick={(e) => e.preventDefault()} title={item.title}>
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
                <label className="auth-input-label">Email</label>
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
                {loading ? <i className="fa-solid fa-spinner fa-spin" /> : null}
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
                  <strong>Penting:</strong> Jangan gunakan password yang sama dengan password Google Anda
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
                  <div className="auth-input-helper" style={{ color: '#f87171' }}>
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
                {loading ? <i className="fa-solid fa-spinner fa-spin" /> : null}
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
