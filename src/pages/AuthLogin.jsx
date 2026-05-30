import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const CSS = `
.auth-page { min-height: 100vh; background: var(--bg, #070709); display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; overflow: hidden; font-family: 'Outfit', sans-serif; }
.auth-orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
.auth-o1 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%); top: -100px; left: -100px; }
.auth-o2 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 65%); bottom: -50px; right: -50px; }
.auth-card { background: var(--glass, rgba(255,255,255,0.03)); border: 1px solid var(--gborder, rgba(255,255,255,0.09)); border-radius: 24px; padding: 40px; width: 100%; max-width: 400px; z-index: 1; backdrop-filter: blur(18px); }
.auth-title { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; color: var(--text, #fff); text-align: center; margin: 0 0 8px; }
.auth-sub { font-size: 0.85rem; color: var(--text-dim, #94a3b8); text-align: center; margin-bottom: 24px; line-height: 1.5; }
.auth-form { display: flex; flex-direction: column; gap: 16px; }
.auth-input { background: rgba(255,255,255,0.04); border: 1px solid var(--gborder, rgba(255,255,255,0.09)); border-radius: 12px; padding: 14px 16px; color: var(--text, #fff); font-family: 'Outfit', sans-serif; font-size: 0.9rem; outline: none; transition: all 0.2s; }
.auth-input:focus { border-color: rgba(139,92,246,0.5); background: rgba(139,92,246,0.04); }
.auth-btn { background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); color: #fff; border: none; border-radius: 12px; padding: 14px; font-weight: 700; font-family: 'Outfit', sans-serif; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 12px rgba(139,92,246,0.3); }
.auth-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(139,92,246,0.4); }
.auth-toggle { text-align: center; margin-top: 20px; font-size: 0.8rem; color: var(--text-dim, #94a3b8); }
.auth-toggle span { color: #a78bfa; font-weight: 700; cursor: pointer; }
.auth-err { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; padding: 10px 14px; border-radius: 8px; font-size: 0.8rem; text-align: center; margin-bottom: 16px; }
`;

export default function AuthLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Email Admin
  const ADMIN_EMAIL = "aldokraksaan@gmail.com"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      
      // Lempar sesuai role
      if (email === ADMIN_EMAIL) {
        navigate('/admin-dashboard'); 
      } else {
        navigate('/contact'); // Klien dikembalikan ke Contact untuk lanjut checkout
      }

    } catch (err) {
      setError("Gagal masuk. Pastikan email/password benar atau daftar akun baru.");
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="auth-page">
        <div className="auth-orb auth-o1" />
        <div className="auth-orb auth-o2" />

        <div className="auth-card">
          <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Buat Akun'}</h2>
          <p className="auth-sub">
            {isLogin 
              ? 'Silakan login untuk melanjutkan pesanan atau melihat dashboard proyekmu.' 
              : 'Daftar akun baru untuk mulai order di SynnnW Studio.'}
          </p>

          {error && <div className="auth-err"><i className="fa-solid fa-triangle-exclamation"/> {error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              className="auth-input"
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              className="auth-input"
              placeholder="Password (min. 6 karakter)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button type="submit" className="auth-btn">
              {isLogin ? 'Login Sekarang' : 'Daftar Akun'}
            </button>
          </form>

          <div className="auth-toggle">
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Daftar di sini' : 'Login di sini'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
