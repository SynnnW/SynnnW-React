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
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  font-family: 'Outfit', sans-serif;
}

/* ── Orbs ── */
.auth-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(110px);
  pointer-events: none;
}
.auth-o1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%);
  top: -150px;
  left: -150px;
}
.auth-o2 {
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 65%);
  bottom: -100px;
  right: -100px;
}

/* ── Card ── */
.auth-card {
  background: var(--glass);
  border: 1px solid var(--gborder);
  border-radius: 28px;
  padding: 48px;
  width: 100%;
  max-width: 420px;
  z-index: 1;
  backdrop-filter: var(--blur);
  -webkit-backdrop-filter: var(--blur);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* ── Typography ── */
.auth-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.4rem;
  color: var(--text);
  text-align: center;
  margin: 0 0 8px;
  font-weight: 400;
}
.auth-sub {
  font-size: 0.86rem;
  color: var(--text-dim);
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.6;
}

/* ── Form ── */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.auth-input {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--gborder);
  border-radius: 14px;
  padding: 14px 16px;
  color: var(--text);
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.25s;
  width: 100%;
  box-sizing: border-box;
}
.auth-input:focus {
  border-color: rgba(139, 92, 246, 0.5);
  background: rgba(139, 92, 246, 0.05);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}
.auth-input::placeholder {
  color: var(--text-dim);
  opacity: 0.7;
}

/* ✅ FIX #6: Pastikan auth-input-error styling */
.auth-input.auth-input-error {
  border-color: rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.05);
}

/* ── Buttons ── */
.auth-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 14px 16px;
  font-weight: 700;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.35);
  width: 100%;
}
.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.45);
}
.auth-btn:active {
  transform: translateY(0px);
}
.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* ✅ FIX #6: Google button center dengan Flexbox */
.auth-btn-google {
  background: var(--glass);
  border: 1px solid var(--gborder);
  color: var(--text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
}
.auth-btn-google:hover {
  background: rgba(139, 92, 246, 0.08);
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}
.auth-btn-google i {
  font-size: 1.1rem;
  flex-shrink: 0;
}

/* ── Divider ── */
.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
  font-size: 0.8rem;
  color: var(--text-dim);
}
.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--gborder);
}

/* ── Error ── */
.auth-err {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #fca5a5;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.8rem;
  line-height: 1.5;
  margin-bottom: 16px;
}

/* ✅ FIX #5: Error message untuk password mismatch */
.auth-input-error-msg {
  color: #fca5a5;
  font-size: 0.75rem;
  margin-top: -10px;
  margin-bottom: 8px;
}

/* ── Success ── */
.auth-success {
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.25);
  color: #86efac;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.8rem;
  line-height: 1.5;
  margin-bottom: 16px;
}

/* ── Toggle ── */
.auth-toggle {
  text-align: center;
  margin-top: 24px;
  font-size: 0.8rem;
  color: var(--text-dim);
  line-height: 1.6;
}
.auth-toggle button {
  background: none;
  border: none;
  color: var(--accent3);
  font-weight: 700;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
  padding: 0;
}
.auth-toggle button:hover {
  color: #a78bfa;
  text-decoration: underline;
}

/* ── Links ── */
.auth-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  font-size: 0.75rem;
  color: var(--text-dim);
}
.auth-links a {
  color: var(--accent3);
  text-decoration: none;
  transition: all 0.2s;
}
.auth-links a:hover {
  text-decoration: underline;
  color: #a78bfa;
}
.auth-links-sep {
  width: 1px;
  height: 12px;
  background: var(--gborder);
  opacity: 0.5;
}

/* ── Loading ── */
.auth-loading {
  opacity: 0.6;
  pointer-events: none;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .auth-card {
    padding: 32px 24px;
  }
  .auth-title {
    font-size: 1.8rem;
  }
}
`;

export default function AuthLogin() {
  const navigate = useNavigate();
  
  // States
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // ✅ FIX #5: Tambah confirm password state
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false); // ✅ FIX #5: Track password mismatch
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

  // ✅ FIX #5: Validasi password match di real-time
  useEffect(() => {
    if (mode === 'register' && confirmPassword) {
      setPasswordMismatch(password !== confirmPassword);
    } else {
      setPasswordMismatch(false);
    }
  }, [password, confirmPassword, mode]);

  // Login dengan Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check jika user udah di Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        // Belum terdaftar - redirect ke register
        setSuccess('Google berhasil terhubung! Silahkan lengkapi data diri Anda.');
        setTimeout(() => {
          navigate('/auth/register-google', { state: { googleUser: user } });
        }, 1500);
        return;
      }

      // Sudah terdaftar - login langsung
      setSuccess('Berhasil login!');
      setTimeout(() => {
        navigate('/contact');
      }, 1000);
    } catch (err) {
      console.error('[AuthLogin] Google login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Popup ditutup. Silahkan coba lagi.');
      } else {
        setError('Gagal login dengan Google. Coba lagi nanti.');
      }
    } finally {
      setLoading(false);
    }
  };

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
      setSuccess('Berhasil login!');
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

  // ✅ FIX #5: Register dengan Email/Password + Validasi Confirm Password
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    
    // ✅ FIX #5: Validasi confirm password
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
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

    setLoading(true);
    setError('');
    try {
      // 1. Buat auth user
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = result.user;

      // 2. Simpan data ke Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        email: email.trim(),
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

  return (
    <div className="auth-page">
      <div className="auth-orb auth-o1" />
      <div className="auth-orb auth-o2" />

      <div className={`auth-card ${loading ? 'auth-loading' : ''}`}>
        <h1 className="auth-title">
          {mode === 'login' ? 'Masuk' : 'Daftar'}
        </h1>
        <p className="auth-sub">
          {mode === 'login'
            ? 'Akses dashboard klien dan kelola proyek Anda di SynnnW'
            : 'Buat akun baru untuk mulai berkolaborasi dengan kami'}
        </p>

        {/* Error Message */}
        {error && <div className="auth-err">{error}</div>}

        {/* Success Message */}
        {success && <div className="auth-success">{success}</div>}

        {/* MODE: LOGIN */}
        {mode === 'login' && (
          <>
            {/* ✅ FIX #6: Google Login Button - Already centered correctly */}
            <button
              className="auth-btn auth-btn-google"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <i className="fa-brands fa-google" />
              Masuk dengan Google
            </button>

            {/* Divider */}
            <div className="auth-divider">Atau</div>

            {/* Email/Password Login */}
            <form className="auth-form" onSubmit={handleEmailLogin}>
              <input
                type="email"
                className="auth-input"
                placeholder="Email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <input
                type="password"
                className="auth-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            {/* Toggle to Register */}
            <div className="auth-toggle">
              Belum punya akun?{' '}
              <button onClick={() => { setMode('register'); setError(''); setSuccess(''); setPasswordMismatch(false); }}>
                Buat Akun
              </button>
            </div>

            {/* Links */}
            <div className="auth-links">
              <a href="/terms">Syarat & Ketentuan</a>
              <div className="auth-links-sep" />
              <a href="/privacy">Privasi</a>
            </div>
          </>
        )}

        {/* MODE: REGISTER */}
        {mode === 'register' && (
          <>
            <form className="auth-form" onSubmit={handleEmailRegister}>
              <input
                type="text"
                className="auth-input"
                placeholder="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              <input
                type="email"
                className="auth-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <input
                type="password"
                className={`auth-input ${passwordMismatch ? 'auth-input-error' : ''}`}
                placeholder="Password (min. 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              {/* ✅ FIX #5: Tambah Confirm Password Field */}
              <input
                type="password"
                className={`auth-input ${passwordMismatch ? 'auth-input-error' : ''}`}
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              {/* ✅ FIX #5: Tampilkan error jika password tidak cocok */}
              {passwordMismatch && (
                <p className="auth-input-error-msg">
                  ❌ Password tidak cocok!
                </p>
              )}
              <button 
                type="submit" 
                className="auth-btn" 
                disabled={loading || passwordMismatch}
              >
                {loading ? 'Membuat Akun...' : 'Buat Akun'}
              </button>
            </form>

            {/* Toggle to Login */}
            <div className="auth-toggle">
              Sudah punya akun?{' '}
              <button onClick={() => { setMode('login'); setError(''); setSuccess(''); setConfirmPassword(''); setPasswordMismatch(false); }}>
                Masuk
              </button>
            </div>

            {/* Links */}
            <div className="auth-links">
              <a href="/terms">Syarat & Ketentuan</a>
              <div className="auth-links-sep" />
              <a href="/privacy">Privasi</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
