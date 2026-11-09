// ─── 26Menfess — Hybrid Storage ──────────────────────────────────────────────
// Tulis ke localStorage DAN mirror ke IndexedDB.
// Baca dari localStorage; kalau kosong, coba pulihkan dari IndexedDB.
// Semua dibungkus try/catch (private mode / kuota penuh / ITP Safari).
// Dipakai sebagai custom storage adapter untuk supabase.createClient().

const DB_NAME  = 'synnnw-auth';
const DB_STORE = 'kv';
const DB_VER   = 1;

let _db = null;

function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') { resolve(null); return; }
    try {
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = (e) => {
        try { e.target.result.createObjectStore(DB_STORE); } catch { /* sudah ada */ }
      };
      req.onsuccess  = (e) => { _db = e.target.result; resolve(_db); };
      req.onerror    = ()  => resolve(null);
      req.onblocked  = ()  => resolve(null);
    } catch { resolve(null); }
  });
}

async function idbSet(key, value) {
  try {
    const db = await openDB();
    if (!db) return;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(DB_STORE, 'readwrite');
        tx.objectStore(DB_STORE).put(value, key);
        tx.oncomplete = resolve;
        tx.onerror    = resolve;
      } catch { resolve(); }
    });
  } catch { /* ignore */ }
}

async function idbGet(key) {
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx  = db.transaction(DB_STORE, 'readonly');
        const req = tx.objectStore(DB_STORE).get(key);
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror   = () => resolve(null);
      } catch { resolve(null); }
    });
  } catch { return null; }
}

async function idbRemove(key) {
  try {
    const db = await openDB();
    if (!db) return;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(DB_STORE, 'readwrite');
        tx.objectStore(DB_STORE).delete(key);
        tx.oncomplete = resolve;
        tx.onerror    = resolve;
      } catch { resolve(); }
    });
  } catch { /* ignore */ }
}

// In-memory fallback kalau kedua storage tidak tersedia
const memStore = new Map();

export const hybridStorage = {
  async getItem(key) {
    // 1. Coba localStorage dulu (sinkron, cepat)
    try {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
    } catch { /* private mode */ }

    // 2. Coba IndexedDB (pulihkan kalau LS terhapus ITP)
    const val = await idbGet(key);
    if (val !== null) {
      // Pulihkan ke LS supaya reads berikutnya cepat
      try { localStorage.setItem(key, val); } catch { /* ignore */ }
      return val;
    }

    // 3. Fallback memori
    return memStore.get(key) ?? null;
  },

  async setItem(key, value) {
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
    await idbSet(key, value);
    memStore.set(key, value);
  },

  async removeItem(key) {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
    await idbRemove(key);
    memStore.delete(key);
  },
};
