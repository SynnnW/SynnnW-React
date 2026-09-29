import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../pages/firebase';
import { onAuthStateChanged } from 'firebase/auth';

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const ADMIN_EMAIL = 'aldokraksaan@gmail.com';

const NAV_LINKS = [
  { to: '/',          label: 'Home',    key: 'home',    dropdownKey: 'home'    },
  { to: '/works',     label: 'Work',    key: 'work',    dropdownKey: null      },
  { to: '/about',     label: 'About',   key: 'about',   dropdownKey: 'about'   },
  { to: '/journal',   label: 'Journal', key: 'journal', dropdownKey: null      },
  { to: '/price-list', label: 'Price', key: 'price', dropdownKey: null       },
];

const DROPDOWN_ITEMS = {
  home: [
    { label: 'Terms & Conditions', to: '/terms', external: false },
  ],
  about: [
    {
      label: 'Instagram',
      to: 'https://www.instagram.com/aldosynnn?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      icon: 'fa-brands fa-instagram',
      external: true,
    },
  ],
};

/* ─────────────────────────────────────────
   NAV STYLES — injected once via <style>
   (all CSS variables from globals.css)
───────────────────────────────────────── */
const NAV_CSS = `
  /* ── Root bar — Glassmorphic ── */
  .nv-root {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 999;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2.5rem;
    background: var(--nav-bg);
    backdrop-filter: var(--blur-md);
    -webkit-backdrop-filter: var(--blur-md);
    border-bottom: 1px solid var(--gborder);
    box-shadow: 0 4px 30px rgba(0,0,0,0.25),
                0 1px 0 var(--gborder);
  }

  /* ── Logo ── */
  .nv-logo {
    position: relative; display: inline-flex; align-items: center;
    cursor: pointer; flex-shrink: 0; padding-right: 14px; user-select: none;
  }
  .nv-logo-text {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.25rem; font-weight: 700; letter-spacing: 0.04em;
    color: var(--text); transition: color 0.2s;
  }
  .nv-logo:hover .nv-logo-text { color: var(--accent3); }
  .nv-logo-st {
    position: absolute; font-size: 0.52rem; top: -4px; right: -6px;
    color: var(--accent); font-weight: 700; letter-spacing: 0.05em;
    font-family: 'Outfit', sans-serif; line-height: 1; pointer-events: none;
  }

  /* ── Center pill — Glass + Neu ── */
  .nv-pill {
    display: flex; align-items: center; gap: 2px;
    background: var(--glass2);
    backdrop-filter: var(--blur-md);
    -webkit-backdrop-filter: var(--blur-md);
    border: 1px solid var(--gborder2);
    border-radius: 99px;
    padding: 5px 7px;
    position: absolute; left: 50%; transform: translateX(-50%);
    box-shadow: var(--neu-raised),
                inset 0 1px 0 rgba(255,255,255,0.07);
  }

  /* ── Nav item ── */
  .nv-item { position: relative; }

  /* ── Nav link ── */
  .nv-link {
    display: block; font-size: 0.64rem; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-dim); padding: 7px 14px; border-radius: 99px;
    background: transparent; transition: color 0.22s, background 0.22s, box-shadow 0.22s;
    text-decoration: none; white-space: nowrap; font-family: 'Outfit', sans-serif;
  }
  .nv-link:hover {
    color: var(--text);
    background: var(--glass);
  }
  .nv-link.nv-active {
    color: var(--bg);
    background: var(--text);
    box-shadow: var(--neu-flat);
  }
  .nv-link.nv-active:hover { color: var(--bg); }

  /* ── Dropdown panel — Glassmorphic ── */
  .nv-dropdown {
    position: absolute; top: calc(100% + 12px); left: 50%;
    transform: translateX(-50%);
    background: var(--glass2);
    backdrop-filter: var(--blur-lg);
    -webkit-backdrop-filter: var(--blur-lg);
    border: 1px solid var(--gborder-accent);
    border-radius: 18px; padding: 8px 0; min-width: 200px;
    box-shadow: var(--neu-raised), 0 20px 60px var(--shadow);
    z-index: 1000; animation: nv-drop 0.18s cubic-bezier(0.22,1,0.36,1) forwards;
    pointer-events: auto;
  }
  @keyframes nv-drop {
    from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  .nv-dropdown-item {
    display: flex; align-items: center; gap: 8px; padding: 10px 18px;
    font-family: 'Outfit', sans-serif; font-size: 0.75rem; font-weight: 500;
    letter-spacing: 0.04em; color: var(--text-dim);
    text-decoration: none; transition: color 0.18s, background 0.18s; white-space: nowrap;
  }
  .nv-dropdown-item:hover { color: var(--text); background: var(--glass); }
  .nv-dropdown-item i { font-size: 0.7rem; color: var(--accent3); }

  /* ── Divider ── */
  .nv-divider {
    width: 1px; height: 18px; background: var(--border2);
    margin: 0 4px; flex-shrink: 0;
  }

  /* ── Icon buttons ── */
  .nv-icon-btn {
    background: var(--glass); border: 1px solid var(--gborder);
    color: var(--text-dim); width: 32px; height: 32px; border-radius: 50%;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 0.88rem; transition: all 0.22s;
    box-shadow: var(--neu-flat);
  }
  .nv-icon-btn:hover {
    color: var(--text); border-color: var(--gborder-accent);
    box-shadow: var(--neu-raised);
    background: var(--glass2);
  }
  .nv-icon-btn:active { box-shadow: var(--neu-press); }

  /* ── Lang button ── */
  .nv-lang-btn {
    background: var(--glass); border: 1px solid var(--gborder);
    color: var(--text-dim); cursor: pointer;
    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em;
    padding: 6px 10px; border-radius: 99px; transition: all 0.22s;
    font-family: 'Outfit', sans-serif;
    box-shadow: var(--neu-flat);
  }
  .nv-lang-btn:hover {
    color: var(--text); border-color: var(--gborder-accent);
    box-shadow: var(--neu-raised); background: var(--glass2);
  }

  /* ── Right section ── */
  .nv-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

  /* ── CTA button — Neu-Glass hybrid ── */
  .nv-cta {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 20px;
    background: var(--accent-g);
    color: #fff; border: none; border-radius: 99px;
    font-family: 'Outfit', sans-serif; font-size: 0.64rem;
    font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; white-space: nowrap;
    box-shadow: 0 4px 20px var(--accent-glow), var(--neu-flat);
    transition: all 0.25s;
  }
  .nv-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px var(--accent-glow), var(--neu-raised);
  }
  .nv-cta:active {
    transform: translateY(0);
    box-shadow: var(--neu-press);
  }
  .nv-cta i { font-size: 0.58rem; }

  /* ── Hamburger ── */
  .nv-hamburger {
    display: none;
    background: var(--glass2); border: 1px solid var(--gborder);
    color: var(--text); width: 38px; height: 38px; border-radius: 12px;
    align-items: center; justify-content: center;
    cursor: pointer; font-size: 0.95rem; transition: all 0.2s;
    box-shadow: var(--neu-raised);
  }
  .nv-hamburger:hover { background: var(--glass3); box-shadow: var(--neu-raised); }
  .nv-hamburger:active { box-shadow: var(--neu-press); }

  /* ── Mobile backdrop ── */
  .nv-backdrop {
    position: fixed; inset: 0; z-index: 9998;
    background: rgba(7,7,26,0.55);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    animation: nv-fade 0.25s ease;
  }
  @keyframes nv-fade { from { opacity: 0; } to { opacity: 1; } }

  /* ── Mobile drawer — Glassmorphic ── */
  .nv-drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: 67%; max-width: 340px; min-width: 260px; z-index: 9999;
    background: var(--glass2);
    backdrop-filter: var(--blur-lg); -webkit-backdrop-filter: var(--blur-lg);
    border-left: 1px solid var(--gborder2);
    box-shadow: -12px 0 40px var(--shadow);
    display: flex; flex-direction: column;
    padding: 80px 28px 36px; gap: 2px;
    overflow-y: auto; overflow-x: hidden;
    animation: nv-slide 0.3s cubic-bezier(0.22,1,0.36,1);
  }
  @keyframes nv-slide { from { transform: translateX(100%); } to { transform: translateX(0); } }

  .nv-drawer-close {
    position: absolute; top: 20px; right: 20px;
    background: var(--glass2); border: 1px solid var(--gborder);
    color: var(--text); width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 1rem; transition: all 0.2s;
    box-shadow: var(--neu-raised);
  }
  .nv-drawer-close:hover { background: var(--glass3); color: var(--accent3); }
  .nv-drawer-close:active { box-shadow: var(--neu-press); }

  .nv-drawer-link {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.9rem; font-weight: 400; color: var(--text-dim);
    text-decoration: none; padding: 5px 0; display: block;
    transition: color 0.2s; line-height: 1.2;
  }
  .nv-drawer-link:hover, .nv-drawer-link.nv-active { color: var(--text); }

  .nv-drawer-sub {
    font-family: 'Outfit', sans-serif; font-size: 0.74rem; font-weight: 500;
    color: var(--accent3); text-decoration: none;
    padding: 4px 0 4px 14px; display: flex; align-items: center; gap: 6px;
    border-left: 2px solid rgba(139,92,246,0.35); margin: 2px 0 6px;
    transition: color 0.2s;
  }
  .nv-drawer-sub:hover { color: var(--text); }
  .nv-drawer-sub i { font-size: 0.65rem; }

  .nv-drawer-toggles { margin-top: 28px; display: flex; gap: 10px; flex-wrap: wrap; }
  .nv-drawer-toggle-btn {
    background: var(--glass2); border: 1px solid var(--gborder);
    color: var(--text-dim); padding: 9px 18px; border-radius: 99px;
    font-size: 0.72rem; font-weight: 700; cursor: pointer;
    font-family: 'Outfit', sans-serif; transition: all 0.2s;
    display: flex; align-items: center; gap: 6px;
    box-shadow: var(--neu-raised);
  }
  .nv-drawer-toggle-btn:hover { color: var(--text); background: var(--glass3); }
  .nv-drawer-toggle-btn:active { box-shadow: var(--neu-press); }

  .nv-drawer-cta {
    margin-top: 16px; display: flex; align-items: center;
    justify-content: center; gap: 8px; padding: 14px 20px;
    background: var(--accent-g); color: #fff; border: none; border-radius: 99px;
    font-family: 'Outfit', sans-serif; font-size: 0.75rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;
    transition: all 0.25s; width: 100%;
    box-shadow: 0 6px 24px var(--accent-glow);
  }
  .nv-drawer-cta:hover { opacity: 0.88; transform: translateY(-1px); }
  .nv-drawer-cta:active { transform: translateY(0); }
  .nv-drawer-cta i { font-size: 0.65rem; }

  .nv-drawer-divider { width: 100%; height: 1px; background: var(--border); margin: 16px 0 12px; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .nv-pill      { display: none !important; }
    .nv-cta       { display: none !important; }
    .nv-hamburger { display: flex !important; }
    .nv-root      { padding: 0 1.5rem; }
  }
  @media (max-width: 480px) {
    .nv-drawer { width: 80%; }
    .nv-root   { padding: 0 1.2rem; }
  }
`;

/* ─────────────────────────────────────────
   MAIN COMPONENT/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function Navbar({ t, lang, toggleLang, theme, toggleTheme }) {
  const [user, setUser]               = useState(null);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location  = useLocation();
  const navigate  = useNavigate();
  const dropdownTimer = useRef(null);

  /* ── Auth listener ── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  /* ── Close drawer + dropdown on route change ── */
  useEffect(() => {
    setMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  /* ── Escape key closes drawer ── */
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ── Lock body scroll while drawer is open ── */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* ── Helpers ── */
  const isActive = useCallback((path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  /* ── CTA label & destination (auth-aware) ── */
  const ctaLabel = !user
    ? (lang === 'id' ? 'Mulai Proyek' : 'Start a Project')
    : user.email === ADMIN_EMAIL
      ? 'Admin Panel'
      : 'Dashboard';

  const ctaPath = !user
    ? '/login'
    : user.email === ADMIN_EMAIL
      ? '/admin-dashboard'
      : '/Dashboard';

  /* ── Dropdown handlers (with small grace delay so cursor can travel) ── */
  const openDropdown  = (key) => {
    clearTimeout(dropdownTimer.current);
    setActiveDropdown(key);
  };
  const closeDropdown = () => {
    dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };
  const stayOpen      = () => clearTimeout(dropdownTimer.current);

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <>
      {/* CSS — injected once, scoped to .nv-* classes — no dark bar risk */}
      <style>{NAV_CSS}</style>

      {/* ══════════════════════════════════════
          NAV BAR
          position: fixed — no wrapper div that could cause a dark bar
      ═══════════════════════════════════════ */}
      <nav className="nv-root" role="navigation" aria-label="Main navigation">

        {/* ── Logo (left) ── */}
        <div
          className="nv-logo"
          onClick={() => navigate('/')}
          role="link"
          tabIndex={0}
          aria-label="SynnnW Studio — Home"
          onKeyDown={e => e.key === 'Enter' && navigate('/')}
        >
          <span className="nv-logo-text">SynnnW</span>
          <span className="nv-logo-st" aria-hidden="true">ST</span>
        </div>

        {/* ── Center pill (desktop) ── */}
        <div className="nv-pill" role="menubar">
          {NAV_LINKS.map(link => (
            <div
              key={link.key}
              className="nv-item"
              role="none"
              onMouseEnter={() => link.dropdownKey ? openDropdown(link.dropdownKey) : setActiveDropdown(null)}
              onMouseLeave={closeDropdown}
            >
              <Link
                to={link.to}
                className={`nv-link${isActive(link.to) ? ' nv-active' : ''}`}
                role="menuitem"
                aria-haspopup={!!link.dropdownKey}
                aria-expanded={activeDropdown === link.dropdownKey}
              >
                {link.label}
              </Link>

              {/* Dropdown */}
              {link.dropdownKey && activeDropdown === link.dropdownKey && (
                <div
                  className="nv-dropdown"
                  role="menu"
                  onMouseEnter={stayOpen}
                  onMouseLeave={closeDropdown}
                >
                  {DROPDOWN_ITEMS[link.dropdownKey].map(item =>
                    item.external ? (
                      <a
                        key={item.label}
                        href={item.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nv-dropdown-item"
                        role="menuitem"
                      >
                        <i className="fa-brands fa-instagram" />
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="nv-dropdown-item"
                        role="menuitem"
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Keuangan — hanya muncul saat login */}
          {user && (
            <>
              <div className="nv-divider" aria-hidden="true" />
              <Link
                to="/pengeluaran"
                className={`nv-link${isActive('/pengeluaran') ? ' nv-active' : ''}`}
                role="menuitem"
                title="Pengeluaran Pribadi"
              >
                💰
              </Link>
            </>
          )}

          {/* Divider */}
          <div className="nv-divider" aria-hidden="true" />

          {/* Theme toggle */}
          <button
            className="nv-icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark'
              ? <i className="fa-solid fa-sun" />
              : <i className="fa-solid fa-moon" />}
          </button>

          {/* Lang toggle */}
          <button
            className="nv-lang-btn"
            onClick={toggleLang}
            aria-label={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
          >
            {lang === 'id' ? 'EN' : 'ID'}
          </button>
        </div>

        {/* ── Right section: CTA + Hamburger ── */}
        <div className="nv-right">
          {/* CTA — auth-aware */}
          <button
            className="nv-cta"
            onClick={() => navigate(ctaPath)}
            aria-label={ctaLabel}
          >
            {ctaLabel}
            <i className="fa-solid fa-arrow-up-right" />
          </button>

          {/* Hamburger (mobile only) */}
          <button
            className="nv-hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <i className="fa-solid fa-bars" />
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          MOBILE DRAWER
          - Backdrop: 33% left (semi-transparent, click to close)
          - Drawer: 67% right (slide-in from right)
      ═══════════════════════════════════════ */}
      {menuOpen && (
        <>
          {/* Backdrop — covers the left 33% */}
          <div
            className="nv-backdrop"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div
            className="nv-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Close button */}
            <button
              className="nv-drawer-close"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            {/* Nav links + inline sub-items */}
            {NAV_LINKS.map(link => (
              <div key={link.key}>
                <Link
                  to={link.to}
                  className={`nv-drawer-link${isActive(link.to) ? ' nv-active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>

                {/* Dropdown items shown inline under parent */}
                {link.dropdownKey && DROPDOWN_ITEMS[link.dropdownKey].map(item =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nv-drawer-sub"
                    >
                      <i className="fa-brands fa-instagram" />
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="nv-drawer-sub"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            ))}

            {/* Keuangan — hanya saat login */}
            {user && (
              <Link
                to="/pengeluaran"
                className={`nv-drawer-link${isActive('/pengeluaran') ? ' nv-active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Keuangan
              </Link>
            )}

            {/* Divider */}
            <div className="nv-drawer-divider" aria-hidden="true" />

            {/* Toggles */}
            <div className="nv-drawer-toggles">
              <button
                className="nv-drawer-toggle-btn"
                onClick={toggleLang}
                aria-label={lang === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
              >
                {lang === 'id' ? 'EN' : 'ID'}
              </button>
              <button
                className="nv-drawer-toggle-btn"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              >
                {theme === 'dark'
                  ? <><i className="fa-solid fa-sun" /> Light</>
                  : <><i className="fa-solid fa-moon" /> Dark</>}
              </button>
            </div>

            {/* CTA button in drawer */}
            <button
              className="nv-drawer-cta"
              onClick={() => { navigate(ctaPath); setMenuOpen(false); }}
            >
              {ctaLabel}
              <i className="fa-solid fa-arrow-up-right" />
            </button>
          </div>
        </>
      )}
    </>
  );
}
