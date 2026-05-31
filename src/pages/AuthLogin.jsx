import { useState, useEffect, useRef, memo } from 'react';
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
  background: var(--bg);
  display: flex;
  position: relative;
  overflow: hidden;
  font-family: 'Outfit', sans-serif;
  padding-top: 64px;
}

.auth-page::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--accent-rgb), transparent);
  border-radius: 50%;
  top: -150px;
  left: -150px;
  filter: blur(80px);
  opacity: 0.08;
  pointer-events: none;
}

.auth-page::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--accent-rgb), transparent);
  border-radius: 50%;
  bottom: -100px;
  right: -100px;
  filter: blur(80px);
  opacity: 0.05;
  pointer-events: none;
}

/* ── Left Sidebar ── */
.auth-sidebar {
  width: 45%;
  background: var(--bg2);
  border-right: 1px solid var(--border);
  padding: 40px 28px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.auth-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 300;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.01em;
}

.auth-logo i {
  font-size: 2rem;
  color: var(--accent3);
}

.auth-sidebar-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent3);
  margin-bottom: 4px;
}

.auth-feed {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.auth-feed-item {
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 14px;
  overflow: hidden;
}

.auth-feed-item:hover {
  transform: translateY(-3px);
}

.auth-feed-item-img {
  width: 100%;
  height: 180px;
  background: var(--glass);
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--gborder);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-feed-item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}

.auth-feed-item:hover .auth-feed-item-img img {
  transform: scale(1.05);
}

.auth-feed-item-img::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.auth-feed-item:hover .auth-feed-item-img::after {
  opacity: 1;
}

.auth-feed-item-label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent3);
}

.auth-feed-item-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.4;
}

.auth-feed-item-title i {
  font-size: 0.95rem;
  color: var(--accent3);
  flex-shrink: 0;
}

.auth-feed-item-desc {
  font-size: 0.78rem;
  color: var(--text-dim);
  line-height: 1.5;
}

.auth-feed-item-date {
  font-size: 0.7rem;
  color: var(--text-muted);
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
  overflow-y: auto;
}

/* ── Card ── */
.auth-card {
  background: var(--glass);
  border: 1px solid var(--gborder);
  border-radius: 20px;
  padding: 52px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: var(--blur);
  -webkit-backdrop-filter: var(--blur);
}

/* ── Typography ── */
.auth-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.8rem;
  color: var(--text);
  text-align: center;
  margin: 0 0 12px;
  font-weight: 300;
  letter-spacing: -0.02em;
}

.auth-sub {
  font-size: 0.9rem;
  color: var(--text-dim);
  text-align: center;
  margin-bottom: 36px;
  line-height: 1.6;
}

/* ── Tabs ── */
.auth-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--gborder);
}

.auth-tab {
  flex: 1;
  padding: 14px;
  border: none;
  background: none;
  color: var(--text-dim);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  border-bottom: 3px solid transparent;
  text-align: center;
}

.auth-tab.active {
  color: var(--accent3);
  border-bottom-color: var(--accent3);
}

/* ── Form ── */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-input {
  background: var(--input-bg);
  border: 1px solid var(--border-focus);
  border-radius: 12px;
  padding: 14px 16px;
  color: var(--text);
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s;
  width: 100%;
  box-sizing: border-box;
}

.auth-input:focus {
  border-color: var(--accent3);
  background: var(--input-focus);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.auth-input::placeholder {
  color: var(--text-muted);
}

.auth-input-label {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 8px;
  display: block;
}

.auth-input-helper {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: -12px;
  margin-left: 2px;
}

/* ── Password Warning ── */
.auth-password-warning {
  background: rgba(217, 119, 6, 0.1);
  border: 1px solid rgba(217, 119, 6, 0.3);
  border-radius: 12px;
  padding: 14px 16px;
  margin: 12px 0;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.auth-password-warning i {
  font-size: 0.95rem;
  color: #ea580c;
  margin-top: 2px;
  flex-shrink: 0;
}

.auth-password-warning-text {
  font-size: 0.82rem;
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
  margin: 18px 0;
}

.auth-checkbox input {
  margin-top: 4px;
  cursor: pointer;
  accent-color: var(--accent3);
  width: 18px;
  height: 18px;
}

.auth-checkbox label {
  font-size: 0.85rem;
  color: var(--text-dim);
  line-height: 1.5;
  cursor: pointer;
}

.auth-checkbox a {
  color: var(--accent3);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.auth-checkbox a:hover {
  color: var(--accent2);
  text-decoration: underline;
}

/* ── Button ── */
.auth-btn {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 0.95rem;
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
  transform: translateY(-1px);
  box-shadow: 0 8px 24px var(--accent-shadow);
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-btn-google {
  background: var(--glass);
  border: 1px solid var(--gborder);
  color: var(--accent3);
}

.auth-btn-google:hover:not(:disabled) {
  background: var(--glass2);
  border-color: var(--gborder2);
}

/* ── Alerts ── */
.auth-err {
  background: rgba(220, 38, 38, 0.12);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #fca5a5;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 0.88rem;
  margin-bottom: 18px;
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
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 0.88rem;
  margin-bottom: 18px;
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
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 24px 0;
  position: relative;
}

.auth-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gborder);
  z-index: -1;
}

.auth-divider {
  background: var(--glass);
  padding: 0 8px;
}

/* ── Links ── */
.auth-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.auth-links a {
  color: var(--accent3);
  text-decoration: none;
  transition: all 0.2s;
}

.auth-links a:hover {
  text-decoration: underline;
  color: var(--accent2);
}

.auth-links-sep {
  width: 1px;
  height: 12px;
  background: var(--gborder);
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .auth-sidebar {
    width: 40%;
    padding: 32px 20px;
  }
  .auth-right {
    width: 60%;
    padding: 24px;
  }
  .auth-card {
    padding: 40px;
  }
  .auth-feed-item-img {
    height: 160px;
  }
  .auth-title {
    font-size: 2.4rem;
  }
}

@media (max-width: 768px) {
  .auth-page {
    flex-direction: column;
    padding-top: 60px;
  }
  .auth-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border);
    max-height: 260px;
    padding: 24px 20px;
  }
  .auth-right {
    width: 100%;
    padding: 16px;
  }
  .auth-card {
    padding: 32px 24px;
  }
  .auth-title {
    font-size: 2rem;
  }
  .auth-feed {
    flex-direction: row;
    overflow-x: auto;
    gap: 14px;
    scroll-behavior: smooth;
    padding-bottom: 8px;
  }
  .auth-feed-item {
    min-width: 150px;
    flex-shrink: 0;
  }
  .auth-feed-item-img {
    height: 140px;
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
    font-size: 0.85rem;
    padding: 12px;
  }
  .auth-feed-item {
    min-width: 130px;
  }
  .auth-feed-item-img {
    height: 120px;
  }
  .auth-feed-item-title {
    font-size: 0.88rem;
  }
  .auth-feed-item-desc {
    font-size: 0.7rem;
  }
  .auth-input {
    padding: 12px 12px;
    font-size: 0.9rem;
  }
}

/* ── Scrollbar ── */
.auth-sidebar::-webkit-scrollbar {
  width: 6px;
}
.auth-sidebar::-webkit-scrollbar-track {
  background: var(--bg);
}
.auth-sidebar::-webkit-scrollbar-thumb {
  background: var(--gborder);
  border-radius: 10px;
}
.auth-sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--gborder2);
}

.auth-feed::-webkit-scrollbar {
  height: 4px;
}
.auth-feed::-webkit-scrollbar-track {
  background: transparent;
}
.auth-feed::-webkit-scrollbar-thumb {
  background: var(--gborder);
  border-radius: 10px;
}
`;

// ═════════════════════════════════════════════════════════════
// FEED ITEMS - CORRECT ROUTES & IMAGES
// ═════════════════════════════════════════════════════════════
const FEED_ITEMS = [
  {
    id: 1,
    type: 'journal',
    label: 'Journal',
    title: 'Creative Works',
    description: 'Explore our digital art & design',
    icon: 'fa-pen-fancy',
    image: '/assets/img/1.png',
    link: '/journal/karya1',
  },
  {
    id: 2,
    type: 'service',
    label: 'Service',
    title: 'Live Stream',
    description: 'Professional event broadcasting',
    icon: 'fa-video',
    image: '/assets/img/livestream.png',
    link: '/porto',
  },
  {
    id: 3,
    type: 'portfolio',
    label: 'Portfolio',
    title: 'Video Editing',
    description: 'Cinematic content & effects',
    icon: 'fa-film',
    image: '/assets/img/2.png',
    link: '/porto/karya2',
  },
  {
    id: 4,
    type: 'portfolio',
    label: 'Portfolio',
    title: 'Wedding Design',
    description: 'Digital wedding packages',
    icon: 'fa-heart',
    image: '/assets/img/3.png',
    link: '/porto/karya4',
  },
  {
    id: 5,
    type: 'contact',
    label: 'Get In Touch',
    title: 'Contact Us',
    description: 'Discuss your project',
    icon: 'fa-envelope',
    image: '/assets/img/4.png',
    link: '/contact',
  },
];

// ═════════════════════════════════════════════════════════════
// MEMOIZED CARD COMPONENT
// ═════════════════════════════════════════════════════════════
const FeedCard = memo(({ item, navigate }) => {
  const handleClick = (e) => {
    e.preventDefault();
    navigate(item.link);
  };

  return (
    <button
      className="auth-feed-item"
      onClick={handleClick}
      title={item.title}
      type="button"
      style={{ cursor: 'pointer' }}
    >
      <div className="auth-feed-item-img">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div className="auth-feed-item-label">{item.label}</div>
      <div className="auth-feed-item-title">
        <i className={`fa-solid ${item.icon}`} /> {item.title}
      </div>
      <div className="auth-feed-item-desc">{item.description}</div>
    </button>
  );
});

FeedCard.displayName = 'FeedCard';

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
    return () => {
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
      }
    };
  }, []);

  // Check if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/Dashboard');
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
        navigate('/Dashboard');
      }, 800);
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
        navigate('/Dashboard');
      }, 1000);
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
          navigate('/Dashboard');
        }, 800);
        return;
      }

      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || 'Google User',
        email: user.email,
        photoURL: user.photoURL || null,
        authMethod: 'google',
        createdAt: new Date(),
      });

      setSuccess('Akun berhasil dibuat!');
      setTimeout(() => {
        navigate('/Dashboard');
      }, 1000);
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
            <FeedCard
              key={item.id}
              item={item}
              navigate={navigate}
            />
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
                />
                <div className="auth-input-helper">Min. 8 karakter, gunakan huruf, angka, dan simbol</div>
              </div>

              {/* Password Security Warning */}
              <div className="auth-password-warning">
                <i className="fa-solid fa-triangle-exclamation" />
                <div className="auth-password-warning-text">
                  <strong>Penting:</strong> Jangan gunakan password sama dengan Google Anda
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
                  required
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
                  required
                />
                <label htmlFor="terms">
                  Saya menyetujui{' '}
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
