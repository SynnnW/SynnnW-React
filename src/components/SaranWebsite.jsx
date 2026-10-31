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
} from '@/lib/firestoreCompat';
const ADMIN_EMAIL  = 'aldokraksaan@gmail.com';

const getDb = () => getFirestore();

// ── CSS ────────────────────────────────────────────────────────────────────────
const CSS = `
/* Section wrapper */
.sw-section {
  padding: 48px 4px 8px;
}
.sw-inner { max-width: 640px; margin: 0 auto; }
.sw-label {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--accent, var(--accent-text));
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

/* Form — kartu glass, blur + border + shadow halus (Apple-inspired glassmorphism) */
.sw-form   { display: flex; flex-direction: column; gap: 12px; }
.sw-input  {
  width: 100%; background: var(--nm-bg);

  border: 1px solid var(--border2); border-radius: 2px;
  padding: 12px 15px; color: var(--text, #e0e0ea);
  font-size: 0.88rem; font-family: inherit; outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; box-sizing: border-box;
}
.sw-input::placeholder { color: rgba(160,160,180,0.55); }
.sw-input:focus { border-color: color-mix(in srgb, var(--accent) 55%, transparent); background: color-mix(in srgb, var(--nm-bg) 94%, var(--text)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 16%, transparent); }
.sw-textarea { min-height: 110px; resize: vertical; }
.sw-btn {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 8px;
  background: var(--accent);
  border: 1px solid var(--border2); border-radius: 2px; padding: 11px 24px;
  color: var(--on-accent); font-size: 0.88rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--accent) 32%, transparent), inset 0 1px 0 color-mix(in srgb, var(--text) 18%, transparent);
}
.sw-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 34px color-mix(in srgb, var(--accent) 45%, transparent), inset 0 1px 0 color-mix(in srgb, var(--text) 22%, transparent); }
.sw-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.sw-note { font-size: 0.72rem; color: var(--text-dim, #8888a0); margin-top: 2px; }
.sw-err  { color: var(--bad); font-size: 0.8rem; }

/* After-send: Trakteer button */
.sw-trakteer-wrap {
  display: flex; flex-direction: column; align-items: flex-start; gap: 10px;
}
.sw-thanks {
  display: flex; align-items: center; gap: 8px;
  background: color-mix(in srgb, var(--ok) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--ok) 28%, transparent);
  border-radius: 2px; padding: 13px 16px;
  color: var(--ok); font-size: 0.88rem; font-weight: 600;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25), inset 0 1px 0 color-mix(in srgb, var(--text) 6%, transparent);
}
.sw-trakteer-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: color-mix(in srgb, var(--warn) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--warn) 38%, transparent);
  color: var(--warn); border-radius: 2px; padding: 10px 20px;
  font-size: 0.85rem; font-weight: 700; text-decoration: none;
  cursor: pointer; transition: all 0.2s;
}
.sw-trakteer-btn:hover { background: color-mix(in srgb, var(--warn) 20%, transparent); transform: translateY(-2px); box-shadow: 0 8px 22px color-mix(in srgb, var(--warn) 22%, transparent); }

/* Kartu QRIS (bukan link keluar ke Trakteer asli) */
.sw-qris-card {
  background: var(--nm-bg);

  border: 1px solid var(--border2);
  border-radius: 2px; padding: 20px; text-align: center; width: 100%; max-width: 280px;
  box-shadow: 0 10px 32px rgba(0,0,0,0.35), inset 0 1px 0 color-mix(in srgb, var(--text) 7%, transparent);
}
.sw-qris-card h4 { color: var(--text, #e0e0ea); margin-bottom: 6px; font-size: 0.95rem; }
.sw-qris-card p  { color: var(--text-dim, #8888a0); font-size: 0.8rem; line-height: 1.5; margin-bottom: 12px; }
.sw-qris-img {
  width: 160px; max-width: 100%; border-radius: 2px; cursor: pointer;
  border: 1px solid var(--border2);
  transition: transform 0.2s; display: block; margin: 0 auto 12px;
}
.sw-qris-img:hover { transform: scale(1.03); }
.sw-qris-full {
  position: fixed; inset: 0; background: rgba(5,5,9,0.86);

  display: flex; align-items: center; justify-content: center; z-index: var(--z-overlay); cursor: zoom-out; padding: 20px;
}
.sw-qris-full img { max-width: 100%; max-height: 90dvh; border-radius: 2px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }

/* Admin feed */
.sw-admin-feed  { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.sw-saran-item  {
  background: var(--nm-bg);

  border: 1px solid var(--border2);
  border-radius: 2px; padding: 13px 15px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.22), inset 0 1px 0 color-mix(in srgb, var(--text) 5%, transparent);
}
.sw-saran-head  { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
.sw-saran-name  { font-size: 0.78rem; font-weight: 600; color: var(--text-dim); }
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
        <span className="sw-label"> Masuk</span>
        <h2 className="sw-title">Saran dari Pengguna</h2>
        <p className="sw-desc">
          {items.length > 0
            ? `${items.length} saran masuk — hanya kamu yang bisa melihat ini.`
            : 'Belum ada saran yang masuk.'}
        </p>

        <div className="sw-admin-feed">
          {items.length === 0 ? (
            <div className="sw-empty"> Kosong, belum ada saran masuk.</div>
          ) : (
            items.map(item => (
              <div key={item.id} className="sw-saran-item">
                <div className="sw-saran-head">
                  <span className="sw-saran-name">{item.name || 'Anonim'}</span>
                  {!item.name && <span className="sw-saran-anon"><i className="fa-solid fa-user" aria-hidden="true" /> anonim</span>}
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
  const [name,      setName]      = useState('');
  const [saran,     setSaran]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [err,       setErr]       = useState('');
  const [qrisLarge, setQrisLarge] = useState(false); // modal fullscreen gambar QRIS
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
        <span className="sw-label"><i className="fa-solid fa-comment" aria-hidden="true" /> Feedback</span>
        <h2 className="sw-title">Punya Saran?</h2>
        <p className="sw-desc">
          Ada fitur yang pengen ditambahin? Desain yang perlu diperbaiki?
          Atau sekedar mau kasih semangat? Tulis aja langsung di sini —
          langsung diterima oleh admin 
        </p>

        {sent ? (
          <div className="sw-trakteer-wrap">
            <div className="sw-thanks">
              <i className="fa-solid fa-circle-check" aria-hidden="true" /> Saran terkirim! Makasih ya, bakal aku pertimbangin <i className="fa-solid fa-hands-praying" aria-hidden="true" />
            </div>
            <div className="sw-qris-card">
              <h4><i className="fa-solid fa-mug-hot" aria-hidden="true" /> Mau Traktir?</h4>
              <p>Nggak wajib, tapi kalau mau bantu dukung pengembangan website ini, scan QRIS di bawah ya <i className="fa-solid fa-hands-praying" aria-hidden="true" /></p>
              <img
                src="/assets/img/qris.jpg"
                alt="QRIS donasi"
                className="sw-qris-img"
                onClick={() => setQrisLarge(true)}
              />
              <button type="button" className="sw-trakteer-btn" onClick={() => setQrisLarge(true)}>
                <i className="fa-solid fa-mug-hot" aria-hidden="true" /> Perbesar QRIS
              </button>
            </div>
            {qrisLarge && (
              <div className="sw-qris-full" onClick={() => setQrisLarge(false)} role="dialog" aria-label="QRIS diperbesar" aria-modal="true">
                <img src="/assets/img/qris.jpg" alt="QRIS" />
              </div>
            )}
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
              placeholder="Tulis saran, masukan, atau kritik kamu di sini... "
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
              {loading ? '⏳ Mengirim...' : 'Kirim Saran'}
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