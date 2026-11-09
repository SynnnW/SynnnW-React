// ─── 26Menfess — SWR Cache ───────────────────────────────────────────────────
// Simpan hasil fetch ke localStorage dengan TTL.
// Semua key berawalan 'mf:' supaya tidak bentrok.

const PREFIX = 'mf:cache:';

/** TTL default per jenis data (ms). */
export const TTL = {
  feed:    5  * 60 * 1000,  // 5 menit
  history: 60 * 1000,       // 60 detik
  admin:   30 * 1000,       // 30 detik
};

/** Maks item di cache feed publik. */
const MAX_FEED_ITEMS = 24;

function ls() {
  try { return localStorage; } catch { return null; }
}

export function cacheSet(key, data, ttlMs) {
  const store = ls();
  if (!store) return;
  try {
    // Batasi ukuran feed
    const payload = JSON.stringify({ data, exp: Date.now() + ttlMs });
    store.setItem(PREFIX + key, payload);
  } catch (e) {
    // Kuota penuh → bersihkan cache lama
    clearOldEntries();
    try { store.setItem(PREFIX + key, JSON.stringify({ data, exp: Date.now() + ttlMs })); } catch { /* ignore */ }
  }
}

export function cacheGet(key) {
  const store = ls();
  if (!store) return null;
  try {
    const raw = store.getItem(PREFIX + key);
    if (!raw) return null;
    const { data, exp } = JSON.parse(raw);
    if (Date.now() > exp) { store.removeItem(PREFIX + key); return null; }
    return data;
  } catch { return null; }
}

export function cacheInvalidate(key) {
  const store = ls();
  if (!store) return;
  try { store.removeItem(PREFIX + key); } catch { /* ignore */ }
}

/** Hapus semua cache 26Menfess. */
export function cacheClear() {
  const store = ls();
  if (!store) return;
  try {
    Object.keys(store)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => store.removeItem(k));
  } catch { /* ignore */ }
}

function clearOldEntries() {
  const store = ls();
  if (!store) return;
  try {
    const now = Date.now();
    Object.keys(store)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => {
        try {
          const { exp } = JSON.parse(store.getItem(k) || '{}');
          if (exp && now > exp) store.removeItem(k);
        } catch { store.removeItem(k); }
      });
  } catch { /* ignore */ }
}

/** Batas ukuran feed agar cache tidak membengkak. */
export function limitFeedCache(items) {
  if (!Array.isArray(items)) return items;
  return items.slice(0, MAX_FEED_ITEMS);
}
