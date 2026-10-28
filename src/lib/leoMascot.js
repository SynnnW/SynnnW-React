// Single source of truth for the Leo mascot: where it is hidden, and its stored preference.
export const MASCOT_KEY = 'leo.mascot.hidden';
export const MASCOT_EVENT = 'leo-mascot-change';

// Lower-cased path prefixes where the mascot never appears (quiz has its own mascot, private/dashboard pages).
const HIDDEN_PREFIXES = [
  '/quiz', '/makrab', '/admin', '/dashboard', '/login', '/complete-profile', '/checkout', '/print',
];

export const isMascotRouteHidden = (pathname = '') => {
  const p = pathname.toLowerCase();
  return HIDDEN_PREFIXES.some(x => p.startsWith(x)); // '/quiz' also covers /quiziz and /quizizuas
};

export const readMascotHidden = () => {
  try { return localStorage.getItem(MASCOT_KEY) === '1'; } catch { return false; }
};

export const writeMascotHidden = (hidden) => {
  try {
    if (hidden) localStorage.setItem(MASCOT_KEY, '1');
    else localStorage.removeItem(MASCOT_KEY); // only our own key
  } catch { /* storage unavailable */ }
  window.dispatchEvent(new Event(MASCOT_EVENT));
};
