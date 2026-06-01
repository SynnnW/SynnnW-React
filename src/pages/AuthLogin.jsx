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
/* ── CSS Variables ── */
.auth-page {
  --bg: #070709;
  --bg2: #0d0d0f;
  --text: #ffffff;
  --text-dim: #94a3b8;
  --text-muted: #64748b;
  --accent: #8b5cf6;
  --accent2: #7c3aed;
  --accent3: #a78bfa;
  --glass: rgba(255,255,255,0.03);
  --glass2: rgba(255,255,255,0.06);
  --gborder: rgba(255,255,255,0.08);
  --gborder2: rgba(255,255,255,0.15);
  --border: rgba(255,255,255,0.07);
  --border-focus: rgba(139,92,246,0.3);
  --input-bg: rgba(255,255,255,0.04);
  --input-focus: rgba(255,255,255,0.06);
  --accent-glow: rgba(139,92,246,0.15);
  --accent-shadow: rgba(139,92,246,0.35);
  --accent-rgb: #a78bfa;
  --blur: blur(20px);
}

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
  gap: 16px;
  flex: 1;
}

/* ── Feed Item: HORIZONTAL / ARTICLE STYLE ── */
.auth-feed-item {
  padding: 10px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 14px;
  overflow: hidden;
  width: 100%;
  text-align: left;
}

.auth-feed-item:hover {
  transform: translateX(4px);
}

/* Left image: fixed 120x90 */
.auth-feed-item-img {
  width: 120px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--gborder);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

/* PNG images: transparent bg + contain */
.auth-feed-item-img.is-png img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transition: transform 0.3s;
}

/* Livestream / non-PNG: cover */
.auth-feed-item-img.is-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}

.auth-feed-item:hover .auth-feed-item-img img {
  transform: scale(1.05);
}

/* Right text block */
.auth-feed-item-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.auth-feed-item-label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent3);
}

.auth-feed-item-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.4;
}

.auth-feed-item-title i {
  font-size: 0.85rem;
  color: var(--accent3);
  flex-shrink: 0;
}

.auth-feed-item-desc {
  font-size: 0.76rem;
  color: var(--text-dim);
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  margin-top: 6px;
  margin-left: 2px;
}

/* ── Phone Row ── */
.auth-phone-row {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.auth-phone-select {
  background: var(--input-bg);
  border: 1px solid var(--border-focus);
  border-radius: 12px;
  padding: 14px 10px;
  color: var(--text);
  font-family: 'Outfit', sans-serif;
  font-size: 0.88rem;
  outline: none;
  transition: all 0.25s;
  width: 130px;
  flex-shrink: 0;
  cursor: pointer;
  box-sizing: border-box;
}

.auth-phone-select:focus {
  border-color: var(--accent3);
  background: var(--input-focus);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.auth-phone-select option {
  background: #0d0d0f;
  color: #fff;
}

.auth-phone-number {
  flex: 1;
}

/* ── Google Banner ── */
.auth-google-banner {
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.84rem;
  color: var(--accent3);
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.5;
}

.auth-google-banner i {
  flex-shrink: 0;
  font-size: 1rem;
}

/* ── Password Warning ── */
.auth-password-warning {
  background: rgba(217, 119, 6, 0.1);
  border: 1px solid rgba(217, 119, 6, 0.3);
  border-radius: 12px;
  padding: 14px 16px;
  margin: 0;
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
  margin: 0;
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
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.35);
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

/* ── Switch Mode Text ── */
.auth-switch-text {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-dim);
  margin-top: 16px;
}

.auth-switch-btn {
  color: var(--accent3);
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0;
  transition: color 0.2s;
}

.auth-switch-btn:hover {
  color: var(--accent2);
  text-decoration: underline;
}

/* ── Divider ── */
.auth-divider {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 8px 0;
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
  z-index: 0;
}

.auth-divider span {
  position: relative;
  z-index: 1;
  background: var(--bg);
  padding: 0 10px;
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
    max-height: 240px;
    padding: 20px 16px;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .auth-feed {
    flex-direction: row;
    gap: 14px;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding-bottom: 8px;
  }
  .auth-feed-item {
    min-width: 200px;
    flex-shrink: 0;
    flex-direction: column;
    padding: 0;
  }
  .auth-feed-item-img {
    width: 100%;
    height: 110px;
  }
  .auth-feed-item-img.is-png img,
  .auth-feed-item-img.is-cover img {
    object-fit: cover;
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
  .auth-input {
    padding: 12px 12px;
    font-size: 0.9rem;
  }
  .auth-phone-select {
    width: 110px;
    font-size: 0.8rem;
    padding: 12px 8px;
  }
}

/* ── Scrollbar ── */
.auth-sidebar::-webkit-scrollbar {
  width: 6px;
  height: 4px;
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
// FEED ITEMS - HORIZONTAL ARTICLE STYLE
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
    isPng: true,
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
    isPng: false, // cover style
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
    isPng: true,
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
    isPng: true,
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
    isPng: true,
    link: '/contact',
  },
];

// ═════════════════════════════════════════════════════════════
// COUNTRY CODES
// ═════════════════════════════════════════════════════════════
const COUNTRY_CODES = [
  { code: '+62', label: '+62 🇮🇩 Indonesia' },
  { code: '+1',  label: '+1 🇺🇸 USA' },
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

// ═════════════════════════════════════════════════════════════
// reCAPTCHA ENTERPRISE HELPER
// ═════════════════════════════════════════════════════════════
const RECAPTCHA_SITE_KEY = '6LcWrQYtAAAAAFOC6B2rXfmO6z1OjAX32fwaRjH0';

const executeRecaptcha = async (action) => {
  try {
    if (!window.grecaptcha?.enterprise) return null;
    await new Promise(resolve => window.grecaptcha.enterprise.ready(resolve));
    const token = await window.grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, { action });
    console.log(`[reCAPTCHA] action=${action} token=`, token);
    return token;
  } catch (err) {
    console.warn('[reCAPTCHA] failed:', err);
    return null;
  }
};

// ═════════════════════════════════════════════════════════════
// MEMOIZED FEED CARD — HORIZONTAL ARTICLE STYLE
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
    >
      {/* Image: left side */}
      <div className={`auth-feed-item-img ${item.isPng ? 'is-png' : 'is-cover'}`}>
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Text: right side */}
      <div className="auth-feed-item-text">
        <div className="auth-feed-item-label">{item.label}</div>
        <div className="auth-feed-item-title">
          <i className={`fa-solid ${item.icon}`} /> {item.title}
        </div>
        <div className="auth-feed-item-desc">{item.description}</div>
      </div>
    </button>
  );
});

FeedCard.displayName = 'FeedCard';

// ═════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════
export default function AuthLogin() {
  const navigate = useNavigate();

  // Mode & loading
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Phone: split into country code + number
  const [phoneCountryCode, setPhoneCountryCode] = useState('+62');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Google register state
  const [googleUser, setGoogleUser] = useState(null);

  // Feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/Dashboard');
    });
    return () => unsubscribe();
  }, [navigate]);

  // Password mismatch validation
  useEffect(() => {
    if (mode === 'register' && confirmPassword) {
      setPasswordMismatch(password !== confirmPassword);
    }
  }, [password, confirmPassword, mode]);

  // ── Switch mode helper ──
  const switchMode = (m) => {
    setMode(m);
    setError('');
    setSuccess('');
  };

  // ── LOGIN ──
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan password harus diisi.');
      return;
    }

    setLoading(true);
    setError('');

    // reCAPTCHA Enterprise
    await executeRecaptcha('LOGIN');

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      setSuccess('Login berhasil! Redirecting...');
      setTimeout(() => navigate('/Dashboard'), 800);
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

  // ── REGISTER (Email atau Google) ──
  const handleEmailRegister = async (e) => {
    e.preventDefault();

    // Validasi field
    if (!name) { setError('Nama harus diisi.'); return; }
    if (!googleUser && !email) { setError('Email harus diisi.'); return; }
    if (!phoneNumber) { setError('Nomor telepon harus diisi.'); return; }
    if (!googleUser && (!password || !confirmPassword)) {
      setError('Password harus diisi.');
      return;
    }
    if (!googleUser && password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (!googleUser && password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (!agreeTerms) {
      setError('Anda harus setuju dengan Kebijakan Privasi.');
      return;
    }

    setLoading(true);
    setError('');

    const fullPhone = `${phoneCountryCode}${phoneNumber.trim()}`;

    try {
      if (googleUser) {
        // ── Register via Google (uid sudah ada) ──
        await setDoc(doc(db, 'users', googleUser.uid), {
          name: name.trim(),
          email: googleUser.email,
          phone: fullPhone,
          photoURL: googleUser.photoURL || null,
          authMethod: 'google',
          createdAt: new Date(),
        });
        setSuccess('Akun berhasil dibuat!');
        setTimeout(() => navigate('/Dashboard'), 1000);
      } else {
        // ── Register via Email ──
        await executeRecaptcha('REGISTER');

        const result = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password.trim()
        );
        const user = result.user;

        await setDoc(doc(db, 'users', user.uid), {
          name: name.trim(),
          email: email.trim(),
          phone: fullPhone,
          authMethod: 'email',
          createdAt: new Date(),
        });

        setSuccess('Akun berhasil dibuat! Redirecting...');
        setTimeout(() => navigate('/Dashboard'), 1000);
      }
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

  // ── GOOGLE LOGIN / REGISTER ──
  const handleGoogleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Cek apakah user sudah ada di Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        // User lama → langsung ke Dashboard
        setSuccess('Akun sudah terdaftar! Redirecting...');
        setTimeout(() => navigate('/Dashboard'), 800);
      } else {
        // User baru → redirect ke mode register, pre-fill data
        setGoogleUser(user);
        setName(user.displayName || '');
        setEmail(user.email || '');
        setMode('register');
        setSuccess('');
        setError('');
      }
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

  // ═════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════
  return (
    <div className="auth-page">

      {/* ── LEFT SIDEBAR: Portfolio Feed (Horizontal) ── */}
      <div className="auth-sidebar">
        <div className="auth-logo">
          <i className="fa-solid fa-sparkles" />
          SynnnW
        </div>

        <div className="auth-sidebar-label">Our Latest Works</div>
        <div className="auth-feed">
          {FEED_ITEMS.map((item) => (
            <FeedCard key={item.id} item={item} navigate={navigate} />
          ))}
        </div>
      </div>

      {/* ── RIGHT CONTAINER: Form ── */}
      <div className="auth-right">
        <div className="auth-card">

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Masuk
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setGoogleUser(null); switchMode('register'); }}
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

          {/* ══════════════════════════════════════
              LOGIN MODE
          ══════════════════════════════════════ */}
          {mode === 'login' && (
            <>
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
                  {loading && <i className="fa-solid fa-spinner fa-spin" />}
                  {loading ? 'Memproses...' : 'Masuk'}
                </button>
              </form>

              {/* Switch to register */}
              <p className="auth-switch-text">
                Belum punya akun?{' '}
                <button
                  className="auth-switch-btn"
                  onClick={() => { setGoogleUser(null); switchMode('register'); }}
                >
                  Daftar di sini →
                </button>
              </p>

              <div className="auth-divider"><span>atau</span></div>

              <button
                type="button"
                className="auth-btn auth-btn-google"
                onClick={handleGoogleRegister}
                disabled={loading}
              >
                <i className="fa-brands fa-google" />
                Masuk dengan Google
              </button>
            </>
          )}

          {/* ══════════════════════════════════════
              REGISTER MODE
          ══════════════════════════════════════ */}
          {mode === 'register' && (
            <>
              {/* Google banner jika register via Google */}
              {googleUser && (
                <div className="auth-google-banner">
                  <i className="fa-brands fa-google" />
                  <span>
                    Mendaftar dengan Google — email:{' '}
                    <strong>{googleUser.email}</strong>
                    <br />
                    <small style={{ opacity: 0.8 }}>
                      Akun Google kamu ditemukan! Lengkapi data berikut untuk mendaftar.
                    </small>
                  </span>
                </div>
              )}

              <form className="auth-form" onSubmit={handleEmailRegister}>
                {/* Nama */}
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

                {/* Email — sembunyikan jika via Google */}
                {!googleUser && (
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
                )}

                {/* Nomor Telepon Internasional */}
                <div>
                  <label className="auth-input-label">No. Telepon</label>
                  <div className="auth-phone-row">
                    <select
                      className="auth-phone-select"
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
                      className="auth-input auth-phone-number"
                      placeholder="812 3456 7890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="auth-input-helper">
                    Pilih kode negara, lalu isi nomor tanpa angka 0 di depan
                  </div>
                </div>

                {/* Password & Konfirmasi — sembunyikan jika via Google */}
                {!googleUser && (
                  <>
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
                      <div className="auth-input-helper">
                        Min. 6 karakter, gunakan huruf, angka, dan simbol
                      </div>
                    </div>

                    <div className="auth-password-warning">
                      <i className="fa-solid fa-triangle-exclamation" />
                      <div className="auth-password-warning-text">
                        <strong>Penting:</strong> Jangan gunakan password sama dengan akun Google Anda
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
                  </>
                )}

                {/* Terms */}
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
                  disabled={loading || (!googleUser && (passwordMismatch || !agreeTerms)) || (googleUser && !agreeTerms)}
                >
                  {loading && <i className="fa-solid fa-spinner fa-spin" />}
                  {loading ? 'Membuat Akun...' : 'Daftar'}
                </button>
              </form>

              {/* Switch to login */}
              <p className="auth-switch-text">
                Sudah punya akun?{' '}
                <button
                  className="auth-switch-btn"
                  onClick={() => { setGoogleUser(null); switchMode('login'); }}
                >
                  Masuk di sini →
                </button>
              </p>

              {/* Google register — hanya tampil jika bukan via Google */}
              {!googleUser && (
                <>
                  <div className="auth-divider"><span>atau</span></div>
                  <button
                    type="button"
                    className="auth-btn auth-btn-google"
                    onClick={handleGoogleRegister}
                    disabled={loading}
                  >
                    <i className="fa-brands fa-google" />
                    Daftar dengan Google
                  </button>
                </>
              )}
            </>
          )}

          {/* Footer links */}
          <div className="auth-links">
            <a href="/terms">Syarat &amp; Ketentuan</a>
            <div className="auth-links-sep" />
            <a href="/terms">Privasi</a>
          </div>

        </div>
      </div>
    </div>
  );
}
