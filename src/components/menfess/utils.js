// ─── 26Menfess — Utilities ──────────────────────────────────────────────────

/** Format waktu relatif sederhana (tanpa library). */
export function formatRelative(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)      return 'baru saja';
  if (diff < 3600)    return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400)   return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800)  return `${Math.floor(diff / 86400)} hari lalu`;
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Simpan path terakhir yang valid di 26Menfess. */
const LAST_KEY = 'mf:last';
export function saveLastPath(path) {
  if (!path.startsWith('/26menfess')) return;
  // Jangan simpan path login/aturan
  if (path === '/26menfess/masuk' || path === '/26menfess/aturan') return;
  try { localStorage.setItem(LAST_KEY, path); } catch { /* ignore */ }
}
export function getLastPath() {
  try { return localStorage.getItem(LAST_KEY) || '/26menfess/app'; } catch { return '/26menfess/app'; }
}

/** Validasi `?next=` supaya tidak bisa open redirect. */
export function safeNext(search) {
  try {
    const p = new URLSearchParams(search).get('next');
    if (!p) return '/26menfess/app';
    return p.startsWith('/26menfess') ? p : '/26menfess/app';
  } catch { return '/26menfess/app'; }
}

/** Deteksi in-app browser. */
export function isInAppBrowser() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Instagram|FBAN|FBAV|Line\/|TikTok|musical_ly/i.test(ua);
}

/** Draft composer. */
const DRAFT_KEY = 'mf:draft';
export function saveDraft(d) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch { /* ignore */ }
}
export function loadDraft() {
  try { const r = localStorage.getItem(DRAFT_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
export function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
}

/** Versi aturan yang sudah disetujui user. */
const RULES_KEY = 'mf:rules';
export function getAcceptedRulesVersion() {
  try { return parseInt(localStorage.getItem(RULES_KEY) || '0', 10); } catch { return 0; }
}
export function setAcceptedRulesVersion(v) {
  try { localStorage.setItem(RULES_KEY, String(v)); } catch { /* ignore */ }
}

/** Tema menfess. */
const THEME_KEY = 'mf:theme';
export function getMfTheme() {
  try { return localStorage.getItem(THEME_KEY) || 'pink'; } catch { return 'pink'; }
}
export function setMfTheme(t) {
  try { localStorage.setItem(THEME_KEY, t); } catch { /* ignore */ }
}

/** Status terakhir yang dilihat (untuk titik notifikasi). */
const SEEN_KEY = 'mf:seen';
export function getSeenStatuses() {
  try { const r = localStorage.getItem(SEEN_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
export function markStatusesSeen(posts) {
  const map = {};
  posts.forEach(p => { map[p.id] = p.status; });
  try { localStorage.setItem(SEEN_KEY, JSON.stringify(map)); } catch { /* ignore */ }
}
export function countUnseen(posts) {
  const seen = getSeenStatuses();
  return posts.filter(p => seen[p.id] && seen[p.id] !== p.status).length;
}

/** Pola deteksi data pribadi di body. */
const DOXX_RE = /(\+?62|0)8\d{8,12}|[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}|@[a-zA-Z0-9_.]{3,}/;
export function detectDoxxing(text) {
  return DOXX_RE.test(text);
}
