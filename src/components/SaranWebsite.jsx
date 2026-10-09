// src/components/SaranWebsite.jsx
// Form saran & masukan untuk website — disimpan ke Firestore
//
// Behavior:
//   Admin (aldokraksaan@gmail.com) → melihat semua saran masuk seperti feed, tidak bisa kirim
//   User lain (termasuk anonim)   → form kirim saran, setelah kirim muncul tombol Trakteer

import { useState, useEffect } from 'react';
import {
  getFirestore, collection, addDoc, onSnapshot,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { getApp } from 'firebase/app';

const ADMIN_EMAIL  = 'aldokraksaan@gmail.com';
const TRAKTEER_URL = 'https://trakteer.id/synnnw';

const getDb = () => {
  try { return getFirestore(getApp('quiz')); }
  catch { return getFirestore(); }
};

// ── CSS ────────────────────────────────────────────────────────────────────────
const CSS = `
/* Section wrapper */
.sw-section {
  padding: 48px 4px 8px;
}
.sw-inner { max-width: 640px; margin: 0 auto; }
.sw-label {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--accent, #8b7bff);
  margin-bottom: 10px; display: block;
}
.sw-title {
  font-size: clamp(1.6rem, 4vw, 2.2rem); font-weight: 800;
  line-height: 1.2; margin-bottom: 8px;
  color: var(--text, #e0e0ea);
}
.sw-desc {
  color: var(--text-dim, #8888a0); font-size: 0.88rem;
  line-height: 1.6; margin-bottom: 24px;
}

/* Form */
.sw-form   { display: flex; flex-direction: column; gap: 12px; }
.sw-input  {
  width: 100%; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
  padding: 11px 14px; color: var(--text, #e0e0ea);
  font-size: 0.88rem; font-family: inherit; outline: none;
  transition: border-color 0.2s; box-sizing: border-box;
}
.sw-input:focus { border-color: rgba(139,123,255,0.5); }
.sw-textarea { min-height: 110px; resize: vertical; }
.sw-btn {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #8b7bff, #6d5df0);
  border: none; border-radius: 10px; padding: 11px 24px;
  color: #fff; font-size: 0.88rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 6px 20px rgba(139,123,255,0.3);
}
.sw-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(139,123,255,0.45); }
.sw-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.sw-note { font-size: 0.72rem; color: var(--text-dim, #8888a0); margin-top: 2px; }
.sw-err  { color: #f87171; font-size: 0.8rem; }

/* After-send: Trakteer button */
.sw-trakteer-wrap {
  display: flex; flex-direction: column; align-items: flex-start; gap: 10px;
}
.sw-thanks {
  display: flex; align-items: center; gap: 8px;
  background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.22);
  border-radius: 10px; padding: 12px 16px;
  color: #4ade80; font-size: 0.88rem; font-weight: 600;
}
.sw-trakteer-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3);
  color: #fbbf24; border-radius: 10px; padding: 10px 20px;
  font-size: 0.85rem; font-weight: 700; text-decoration: none;
  cursor: pointer; transition: all 0.2s;
}
.sw-trakteer-btn:hover { background: rgba(251,191,36,0.18); transform: translateY(-1px); }

/* Admin feed */
.sw-admin-feed  { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.sw-saran-item  {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px; padding: 12px 14px;
}
.sw-saran-head  { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
.sw-saran-name  { font-size: 0.78rem; font-weight: 600; color: #c9c9d2; }
.sw-saran-anon  { font-size: 0.68rem; color: rgba(160,160,180,0.5); }
.sw-saran-time  { font-size: 0.68rem; color: rgba(140,140,160,0.5); margin-left: auto; }
.sw-saran-text  { font-size: 0.83rem; color: #e0e0ea; line-height: 1.55; word-break: break-word; }
.sw-empty       { font-size: 0.82rem; color: rgba(140,140,160,0.5); text-align: center; padding: 20px 0; }

@media (max-width: 600px) {
  .sw-section { padding: 36px 4px 8px; }
}
`;

// ── Helper ─────────────────────────────────────────────────────────────────────
function timeAgo(ts) {
  if (!ts) return '';
  const sec = Math.floor((Date.now() - ts.toMillis()) / 1000);
  if (sec < 60)    return 'baru saja';
  if (sec < 3600)  return `${Math.floor(sec / 60)} mnt lalu`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} jam lalu`;
  return `${Math.floor(sec / 86400)} hari lalu`;
}

// ── Admin View: lihat semua saran ─────────────────────────────────────────────
function AdminSaranView() {
  const [items, setItems] = useState([]);
  const db = getDb();

  useEffect(() => {
    const q = query(collection(db, 'websiteSaran'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [db]);

  return (
    <section className="sw-section">
      <style>{CSS}</style>
      <div className="sw-inner">
        <span className="sw-label">📬 Masuk</span>
        <h2 className="sw-title">Saran dari Pengguna</h2>
        <p className="sw-desc">
          {items.length > 0
            ? `${items.length} saran masuk — hanya kamu yang bisa melihat ini.`
            : 'Belum ada saran yang masuk.'}
        </p>

        <div className="sw-admin-feed">
          {items.length === 0 ? (
            <div className="sw-empty">📭 Kosong, belum ada saran masuk.</div>
          ) : (
            items.map(item => (
              <div key={item.id} className="sw-saran-item">
                <div className="sw-saran-head">
                  <span className="sw-saran-name">{item.name || 'Anonim'}</span>
                  {!item.name && <span className="sw-saran-anon">👤 anonim</span>}
                  <span className="sw-saran-time">{timeAgo(item.createdAt)}</span>
                </div>
                <div className="sw-saran-text">{item.message}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

// ── User View: form kirim saran ────────────────────────────────────────────────
function UserSaranForm({ user }) {
  const [name,    setName]    = useState('');
  const [saran,   setSaran]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [err,     setErr]     = useState('');
  const db = getDb();

  const handleSend = async () => {
    if (!saran.trim()) return;
    setLoading(true);
    setErr('');
    try {
      await addDoc(collection(db, 'websiteSaran'), {
        name:      name.trim() || null,
        message:   saran.trim().slice(0, 1000),
        uid:       user?.uid  || null,
        email:     user?.email || null,
        isAnon:    user?.isAnonymous ?? true,
        createdAt: serverTimestamp(),
      });
      setSent(true);
      setName('');
      setSaran('');
    } catch (e) {
      console.error(e);
      setErr('Gagal kirim. Coba lagi ya!');
    }
    setLoading(false);
  };

  return (
    <section className="sw-section">
      <style>{CSS}</style>
      <div className="sw-inner">
        <span className="sw-label">💬 Feedback</span>
        <h2 className="sw-title">Punya Saran?</h2>
        <p className="sw-desc">
          Ada fitur yang pengen ditambahin? Desain yang perlu diperbaiki?
          Atau sekedar mau kasih semangat? Tulis aja langsung di sini —
          langsung diterima oleh admin 🚀
        </p>

        {sent ? (
          <div className="sw-trakteer-wrap">
            <div className="sw-thanks">
              ✅ Saran terkirim! Makasih ya, bakal aku pertimbangin 🙏
            </div>
            <a
              className="sw-trakteer-btn"
              href={TRAKTEER_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              ☕ Trakteer Kami
            </a>
          </div>
        ) : (
          <div className="sw-form">
            <input
              className="sw-input"
              type="text"
              placeholder="Nama kamu (opsional)"
              value={name}
              maxLength={50}
              onChange={e => setName(e.target.value)}
            />
            <textarea
              className="sw-input sw-textarea"
              placeholder="Tulis saran, masukan, atau kritik kamu di sini... 💡"
              value={saran}
              maxLength={1000}
              onChange={e => setSaran(e.target.value)}
            />
            {err && <div className="sw-err">{err}</div>}
            <button
              className="sw-btn"
              onClick={handleSend}
              disabled={loading || !saran.trim()}
            >
              {loading ? '⏳ Mengirim...' : '📨 Kirim Saran'}
            </button>
            <div className="sw-note">
              Pesanmu langsung diterima admin. Tidak ada data yang disimpan ke server publik.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────
export default function SaranWebsite({ user }) {
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Admin: lihat semua saran masuk (tidak bisa kirim)
  if (isAdmin) return <AdminSaranView />;

  // User / anonim: form kirim saran
  return <UserSaranForm user={user} />;
}
