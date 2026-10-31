import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth, supabase } from '@/supabaseClient';
import { onAuthStateChanged } from '@/lib/authCompat';

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
  { to: '/quiziz',    label: 'Quiziz',  key: 'quiziz',  dropdownKey: null      },
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
  /* ═══ Navbar editorial — hairline, mono folio, penanda lime ═══ */
  .nv-root {
    position: fixed; top: 0; left: 0; right: 0; z-index: var(--z-nav);
    height: 64px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 var(--gutter);
    background: color-mix(in srgb, var(--bg) 92%, transparent);
    border-bottom: 1px solid var(--border);
    transition: transform var(--dur-route) var(--ease-out), background-color .3s ease, border-color .3s ease;
  }
  .nv-root.nv-hidden { transform: translateY(-110%); }
  .nv-root.nv-scrolled { background: var(--nav-bg); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }

  /* ── Logo ── */
  .nv-logo { position: relative; display: inline-flex; align-items: baseline; gap: 6px; cursor: pointer; flex-shrink: 0; user-select: none; }
  .nv-logo-text { font-family: var(--font-display); font-size: 1.45rem; font-weight: 600; font-style: italic; letter-spacing: -0.02em; color: var(--text); transition: color var(--dur-fast) ease; }
  .nv-logo:hover .nv-logo-text { color: var(--accent-text); }
  .nv-logo-st { font-family: var(--font-mono); font-size: .56rem; letter-spacing: .12em; padding: 1px 5px; background: var(--accent); color: var(--on-accent); border-radius: 2px; align-self: flex-start; margin-top: 3px; pointer-events: none; }

  /* ── Menu tengah: baris tautan dengan folio ── */
  .nv-pill { display: flex; align-items: center; gap: 4px; position: absolute; left: 50%; transform: translateX(-50%); counter-reset: nvn; }
  .nv-item { position: relative; counter-increment: nvn; }
  .nv-link {
    display: flex; align-items: baseline; gap: 7px; padding: 8px 14px; border-radius: var(--r-s);
    font-family: var(--font-mono); font-size: .72rem; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
    color: var(--text-dim); white-space: nowrap; text-decoration: none;
    transition: color var(--dur-fast) ease, background-color var(--dur-fast) ease;
  }
  .nv-link::before { content: counter(nvn, decimal-leading-zero); font-size: .56rem; color: var(--text-faint); transition: color var(--dur-fast) ease; }
  .nv-link:hover { color: var(--text); }
  .nv-link:hover::before { color: var(--accent-text); }
  .nv-link.nv-active { background: var(--accent); color: var(--on-accent); }
  .nv-link.nv-active::before { color: var(--on-accent); opacity: .7; }

  /* ── Dropdown ── */
  .nv-dropdown {
    position: absolute; top: calc(100% + 10px); left: 50%; transform: translateX(-50%); min-width: 220px; padding: 6px;
    background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--r-notch);
    box-shadow: 0 18px 40px -18px var(--shadow); z-index: var(--z-float);
    animation: nv-drop var(--dur-base) var(--ease-out) forwards;
  }
  @keyframes nv-drop { from { opacity: 0; transform: translateX(-50%) translateY(-6px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
  .nv-dropdown-item { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: var(--r-s); font-family: var(--font-mono); font-size: .72rem; letter-spacing: .06em; text-transform: uppercase; color: var(--text-dim); white-space: nowrap; transition: color var(--dur-fast) ease, background-color var(--dur-fast) ease; }
  .nv-dropdown-item:hover { color: var(--text); background: var(--glass2); }
  .nv-dropdown-item i { font-size: .8rem; color: var(--accent-text); }

  .nv-divider { width: 1px; height: 18px; background: var(--border2); margin: 0 6px; flex-shrink: 0; }

  /* ── Tombol ikon & bahasa ── */
  .nv-icon-btn, .nv-lang-btn {
    min-width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
    background: transparent; border: 1px solid var(--border2); color: var(--text); border-radius: 99px;
    font-family: var(--font-mono); font-size: .7rem; font-weight: 600; letter-spacing: .08em; padding: 0 12px;
    transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease, border-color var(--dur-fast) ease;
  }
  .nv-icon-btn { padding: 0; width: 40px; font-size: .9rem; }
  .nv-icon-btn:hover, .nv-lang-btn:hover { background: var(--accent); color: var(--on-accent); border-color: var(--accent); }
  .nv-icon-btn:active, .nv-lang-btn:active { transform: translateY(1px); }

  .nv-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

  /* ── CTA ── */
  .nv-cta, .nv-drawer-cta {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 40px; padding: 0 18px;
    background: var(--accent); color: var(--on-accent); border: 0; border-radius: var(--r-notch); cursor: pointer; white-space: nowrap;
    font-family: var(--font-mono); font-size: .72rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
    transition: transform var(--dur-fast) ease, box-shadow var(--dur-fast) ease;
  }
  .nv-cta:hover, .nv-drawer-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -12px var(--shadow); }
  .nv-cta:active, .nv-drawer-cta:active { transform: translateY(0); }
  .nv-cta i, .nv-drawer-cta i { font-size: .7rem; }
  .nv-makrab, .nv-drawer-makrab {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 40px; padding: 0 16px; cursor: pointer; white-space: nowrap;
    background: transparent; color: var(--text); border: 1px solid var(--border2); border-radius: var(--r-notch);
    font-family: var(--font-mono); font-size: .72rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
    transition: border-color var(--dur-fast) ease, background-color var(--dur-fast) ease;
  }
  .nv-makrab:hover, .nv-drawer-makrab:hover { border-color: var(--text); background: var(--glass2); }
  .nv-makrab i, .nv-drawer-makrab i { font-size: .8rem; color: var(--accent-text); }
  .nv-drawer-makrab { width: 100%; margin-bottom: 10px; min-height: 48px; }

  /* ── Hamburger ── */
  .nv-hamburger { display: none; width: 44px; height: 44px; align-items: center; justify-content: center; cursor: pointer; background: transparent; border: 1px solid var(--border2); color: var(--text); border-radius: var(--r-s); font-size: 1rem; }
  .nv-hamburger:hover { background: var(--glass2); }

  /* ── Drawer mobile: solid, tanpa kaca ── */
  .nv-backdrop { position: fixed; inset: 0; z-index: var(--z-overlay); background: color-mix(in srgb, var(--bg) 70%, #000); opacity: .72; animation: nv-fade var(--dur-base) ease; }
  @keyframes nv-fade { from { opacity: 0; } to { opacity: .72; } }
  .nv-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; width: min(86vw, 380px); z-index: calc(var(--z-overlay) + 1);
    background: var(--bg); border-left: 1px solid var(--border2); box-shadow: -24px 0 50px -30px var(--shadow);
    display: flex; flex-direction: column; padding: 84px 28px 32px; gap: 2px; overflow-y: auto; overflow-x: hidden; counter-reset: nvd;
    animation: nv-slide var(--dur-route) var(--ease-out);
  }
  @keyframes nv-slide { from { transform: translateX(100%); } to { transform: translateX(0); } }
  .nv-drawer-close { position: absolute; top: 14px; right: 16px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: transparent; border: 1px solid var(--border2); border-radius: 99px; color: var(--text); font-size: 1rem; }
  .nv-drawer-close:hover { background: var(--accent); color: var(--on-accent); border-color: var(--accent); }
  .nv-drawer-link {
    display: flex; align-items: baseline; gap: 12px; padding: 8px 0; counter-increment: nvd; border-bottom: 1px solid var(--border);
    font-family: var(--font-display); font-size: clamp(1.8rem, 8vw, 2.4rem); font-weight: 500; line-height: 1.1; letter-spacing: -0.02em; color: var(--text-dim);
    transition: color var(--dur-fast) ease, padding-left var(--dur-base) var(--ease-out);
  }
  .nv-drawer-link::before { content: counter(nvd, decimal-leading-zero); font-family: var(--font-mono); font-size: .66rem; letter-spacing: .08em; color: var(--text-faint); }
  .nv-drawer-link:hover { color: var(--text); padding-left: 6px; }
  .nv-drawer-link.nv-active { color: var(--text); font-style: italic; }
  .nv-drawer-link.nv-active::before { color: var(--accent-text); }
  .nv-drawer-sub { display: flex; align-items: center; gap: 8px; padding: 8px 0 8px 14px; margin: 2px 0 6px; font-family: var(--font-mono); font-size: .72rem; letter-spacing: .06em; text-transform: uppercase; color: var(--text-dim); border-left: 1px solid var(--border2); }
  .nv-drawer-sub:hover { color: var(--text); }
  .nv-drawer-sub i { font-size: .72rem; color: var(--accent-text); }
  .nv-drawer-toggles { margin-top: 26px; display: flex; gap: 10px; flex-wrap: wrap; }
  .nv-drawer-toggle-btn { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 18px; cursor: pointer; background: transparent; color: var(--text); border: 1px solid var(--border2); border-radius: 99px; font-family: var(--font-mono); font-size: .72rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; }
  .nv-drawer-toggle-btn:hover { background: var(--glass2); }
  .nv-drawer-cta { margin-top: 14px; width: 100%; min-height: 52px; }
  .nv-drawer-divider { width: 100%; height: 1px; background: var(--border); margin: 18px 0 12px; }

  @media (max-width: 1024px) { .nv-pill { gap: 0; } .nv-link { padding: 8px 10px; } .nv-link::before { display: none; } }
  @media (max-width: 768px) {
    .nv-pill, .nv-cta, .nv-makrab { display: none !important; }
    .nv-hamburger { display: flex !important; }
  }
  @media (prefers-reduced-motion: reduce) { .nv-root, .nv-drawer, .nv-dropdown { animation: none !important; transition: none !important; } }
`;

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

  /* ── Tombol Makrab: hanya untuk yang sudah login DAN terdaftar di makrab_members ── */
  const [makrabUid, setMakrabUid] = useState(null);
  useEffect(() => {
    if (!user) return undefined;
    let alive = true;
    supabase.from('makrab_members').select('id').limit(1)
      .then(({ data }) => { if (alive && data && data.length > 0) setMakrabUid(user.uid); })
      .catch(() => {});
    return () => { alive = false; };
  }, [user]);
  const showMakrab = !!user && makrabUid === user.uid;

  /* ── Navbar: sembunyi saat scroll turun, muncul saat naik ── */
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const el = document.querySelector('.nv-root');
      if (!el) return;
      const y = window.scrollY;
      el.classList.toggle('nv-scrolled', y > 40);
      el.classList.toggle('nv-hidden', y > last && y > 160);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
    window.__lenis?.[menuOpen ? 'stop' : 'start']?.();
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
                <span className="nv-roll">{link.label}</span>
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
          {showMakrab && (
            <button className="nv-makrab" onClick={() => navigate('/makrab')}>
              <i className="fa-solid fa-people-group" /> Makrab
            </button>
          )}

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

            {showMakrab && (
              <button className="nv-drawer-makrab" onClick={() => { navigate('/makrab'); setMenuOpen(false); }}>
                <i className="fa-solid fa-people-group" /> Makrab 2026
              </button>
            )}

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
