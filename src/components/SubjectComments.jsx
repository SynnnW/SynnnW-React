// src/components/SubjectComments.jsx
// Sistem komentar per mata pelajaran — Firebase Firestore
// Bisa dipakai akun Google & Anonim
// Props:
//   subjectKey  : string  — kunci koleksi Firestore (mis. 'general', 'kesglob')
//   user        : object  — quizUser (bisa null)
//   youtubeStyle: bool    — layout YouTube (langsung keliatan, 3 preview, expand)
//   maxPreview  : number  — berapa komentar yang ditampilkan sebelum "Lihat semua" (default 3)

import { useState, useEffect, useRef } from 'react';
import {
  getFirestore, collection, addDoc, onSnapshot,
  query, orderBy, serverTimestamp, deleteDoc, doc,
} from '@/lib/firestoreCompat';
const getDb = () => getFirestore();

const CSS = `
/* ── Shared ── */
.qzc-wrap      { margin-top: 0; }
.qzc-list      { display: flex; flex-direction: column; gap: 10px; }
.qzc-item      { background: rgba(255,255,255,0.045);

                 border: 1px solid rgba(255,255,255,0.09);
                 border-radius: 2px; padding: 11px 14px;
                 box-shadow: 0 6px 18px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05); }
.qzc-header    { display: flex; align-items: center; gap: 7px; margin-bottom: 4px; }
.qzc-name      { font-size: 0.78rem; font-weight: 600; color: #c9c9d2; }
.qzc-anon      { font-size: 0.68rem; color: rgba(160,160,180,0.5); }
.qzc-time      { font-size: 0.68rem; color: rgba(140,140,160,0.5); margin-left: auto; }
.qzc-text      { font-size: 0.83rem; color: #e0e0ea; line-height: 1.55; word-break: break-word; }
.qzc-del       { background: none; border: none; color: rgba(180,80,80,0.5); cursor: pointer;
                 font-size: 0.7rem; padding: 0 4px; transition: color 0.15s; }
.qzc-del:hover { color: rgba(220,80,80,0.85); }
.qzc-empty     { font-size: 0.82rem; color: rgba(140,140,160,0.5); text-align: center;
                 padding: 18px 0; }
.qzc-form      { display: flex; gap: 8px; margin-top: 12px; }
.qzc-input     { flex: 1; background: rgba(255,255,255,0.05);

                 border: 1px solid rgba(255,255,255,0.12);
                 border-radius: 2px; padding: 9px 12px; color: #e0e0ea; font-size: 0.82rem;
                 outline: none; resize: none; font-family: inherit; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; }
.qzc-input::placeholder { color: rgba(160,160,180,0.5); }
.qzc-input:focus { border-color: rgba(139,123,255,0.55); background: rgba(255,255,255,0.08); box-shadow: 0 0 0 3px rgba(139,123,255,0.15); }
.qzc-submit    { background: rgba(139,123,255,0.22);
                 border: 1px solid rgba(139,123,255,0.4);
                 color: #c7bdff; border-radius: 2px; padding: 9px 16px; cursor: pointer;
                 font-size: 0.8rem; font-weight: 700; white-space: nowrap; transition: all 0.2s; }
.qzc-submit:hover:not(:disabled) { background: rgba(139,123,255,0.34); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(139,123,255,0.25); }
.qzc-submit:disabled { opacity: 0.4; cursor: not-allowed; }
.qzc-hint      { font-size: 0.72rem; color: rgba(130,130,150,0.6); margin-top: 5px; }
.qzc-login-note { font-size: 0.75rem; color: rgba(130,130,150,0.6); margin-top: 10px; }

/* ── Toggle mode (quiz tab) ── */
.qzc-toggle       { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 2px; color: rgba(200,200,215,0.8);
                    font-size: 0.78rem; cursor: pointer; padding: 6px 14px;
                    display: flex; align-items: center; gap: 6px; transition: all 0.15s; }
.qzc-toggle:hover { color: #e0e0ea; background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.16); }

/* ── YouTube mode (subjects screen) ── */
.qzc-yt-wrap    { padding: 28px 0 8px; }
.qzc-yt-header  { display: flex; align-items: center; justify-content: space-between;
                  margin-bottom: 16px; }
.qzc-yt-title   { font-size: 0.95rem; font-weight: 700; color: #e0e0ea;
                  display: flex; align-items: center; gap: 8px; }
.qzc-yt-count   { font-size: 0.8rem; font-weight: 400; color: rgba(160,160,180,0.7); }
.qzc-yt-expand  { background: rgba(139,123,255,0.08);
                  border: 1px solid rgba(139,123,255,0.32);
                  color: #b0a4ff; border-radius: 2px; padding: 6px 15px;
                  font-size: 0.75rem; font-weight: 600; cursor: pointer;
                  transition: all 0.2s; white-space: nowrap; }
.qzc-yt-expand:hover { background: rgba(139,123,255,0.18); border-color: rgba(139,123,255,0.55); transform: translateY(-1px); }
.qzc-yt-divider { display: flex; align-items: center; gap: 10px;
                  margin: 12px 0; color: rgba(139,123,255,0.5); font-size: 0.72rem;
                  font-weight: 600; letter-spacing: 0.06em; }
.qzc-yt-divider::before, .qzc-yt-divider::after {
  content: ''; flex: 1; height: 1px; background: rgba(139,123,255,0.18); }
.qzc-yt-form-wrap { margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.07);
                    padding-top: 14px; }
.qzc-yt-form-title { font-size: 0.75rem; font-weight: 600; color: rgba(160,160,180,0.6);
                     text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
`;

function timeAgo(ts) {
  if (!ts) return '';
  const sec = Math.floor((Date.now() - ts.toMillis()) / 1000);
  if (sec < 60)    return 'baru saja';
  if (sec < 3600)  return `${Math.floor(sec / 60)} mnt lalu`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} jam lalu`;
  return `${Math.floor(sec / 86400)} hari lalu`;
}

function CommentItem({ c, user, onDelete }) {
  return (
    <div className="qzc-item">
      <div className="qzc-header">
        <span className="qzc-name">{c.nickname}</span>
        {c.isAnon && <span className="qzc-anon">👤 anonim</span>}
        <span className="qzc-time">{timeAgo(c.createdAt)}</span>
        {user?.uid === c.uid && (
          <button className="qzc-del" onClick={() => onDelete(c.id, c.uid)} title="Hapus">✕</button>
        )}
      </div>
      <div className="qzc-text">{c.text}</div>
    </div>
  );
}

function CommentForm({ user, text, setText, sending, onSend }) {
  if (!user) {
    return <div className="qzc-login-note">🔐 Login dulu untuk ikut berkomentar</div>;
  }
  return (
    <div>
      <div className="qzc-form">
        <textarea
          className="qzc-input"
          rows={2}
          maxLength={300}
          placeholder="Tulis komentar... (maks 300 karakter)"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
          }}
        />
        <button
          className="qzc-submit"
          disabled={!text.trim() || sending}
          onClick={onSend}
        >
          {sending ? '...' : 'Kirim'}
        </button>
      </div>
      <div className="qzc-hint">Enter untuk kirim · Shift+Enter baris baru</div>
    </div>
  );
}

export default function SubjectComments({
  subjectKey,
  user,
  youtubeStyle = false,
  maxPreview   = 3,
}) {
  const [open,      setOpen]     = useState(youtubeStyle); // auto-open untuk yt mode
  const [expanded,  setExpanded] = useState(false);        // "lihat semua" di yt mode
  const [comments,  setComments] = useState([]);
  const [text,      setText]     = useState('');
  const [sending,   setSending]  = useState(false);
  const unsubRef = useRef(null);
  const db = getDb();

  // Subscribe realtime saat section dibuka
  useEffect(() => {
    if (!open) { unsubRef.current?.(); return; }
    const q = query(
      collection(db, `quizComments_${subjectKey}`),
      orderBy('createdAt', 'desc'),
    );
    unsubRef.current = onSnapshot(q, snap => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubRef.current?.();
  }, [open, subjectKey, db]);

  // Pastikan youtube mode selalu subscribe
  useEffect(() => {
    if (youtubeStyle && !open) setOpen(true);
  }, [youtubeStyle, open]);

  const handleSend = async () => {
    if (!text.trim() || !user) return;
    setSending(true);
    try {
      await addDoc(collection(db, `quizComments_${subjectKey}`), {
        uid:       user.uid,
        nickname:  user._nickname || user.displayName || 'Anonim',
        text:      text.trim().slice(0, 300),
        isAnon:    user.isAnonymous,
        createdAt: serverTimestamp(),
      });
      setText('');
    } catch (e) { console.error(e); }
    setSending(false);
  };

  const handleDelete = async (id, uid) => {
    if (!user || user.uid !== uid) return;
    await deleteDoc(doc(db, `quizComments_${subjectKey}`, id));
  };

  // ── YouTube Style ─────────────────────────────────
  if (youtubeStyle) {
    const visible = expanded ? comments : comments.slice(0, maxPreview);
    const hiddenCount = comments.length - maxPreview;

    return (
      <div className="qzc-wrap qzc-yt-wrap" onClick={e => e.stopPropagation()}>
        <style>{CSS}</style>

        {/* Header */}
        <div className="qzc-yt-header">
          <div className="qzc-yt-title">
            💬 Komentar
            <span className="qzc-yt-count">{comments.length}</span>
          </div>
          {!expanded && hiddenCount > 0 && (
            <button className="qzc-yt-expand" onClick={() => setExpanded(true)}>
              Lihat semua {comments.length} ▼
            </button>
          )}
          {expanded && (
            <button className="qzc-yt-expand" onClick={() => setExpanded(false)}>
              Tutup ▲
            </button>
          )}
        </div>

        {/* Comment list */}
        <div className="qzc-list">
          {comments.length === 0 ? (
            <div className="qzc-empty">
              Belum ada komentar. Jadilah yang pertama! 👋
            </div>
          ) : (
            visible.map(c => (
              <CommentItem key={c.id} c={c} user={user} onDelete={handleDelete} />
            ))
          )}
        </div>

        {/* "Lihat semua" di bawah jika masih ada */}
        {!expanded && hiddenCount > 0 && (
          <div className="qzc-yt-divider">
            <button
              className="qzc-yt-expand"
              style={{ margin: '0 auto' }}
              onClick={() => setExpanded(true)}
            >
              ▼ Lihat {hiddenCount} komentar lainnya
            </button>
          </div>
        )}

        {/* Form tulis komentar */}
        <div className="qzc-yt-form-wrap">
          <div className="qzc-yt-form-title">✏️ Tulis Komentar</div>
          <CommentForm
            user={user}
            text={text}
            setText={setText}
            sending={sending}
            onSend={handleSend}
          />
        </div>
      </div>
    );
  }

  // ── Toggle Style (quiz tab) ───────────────────────
  return (
    <div className="qzc-wrap" onClick={e => e.stopPropagation()}>
      <style>{CSS}</style>

      <button className="qzc-toggle" onClick={() => setOpen(o => !o)}>
        💬 {comments.length} komentar {open ? '▲' : '▼'}
      </button>

      {open && (
        <>
          <div className="qzc-list" style={{ marginTop: 10, maxHeight: 220, overflowY: 'auto', scrollbarWidth: 'thin' }}>
            {comments.length === 0
              ? <div className="qzc-empty">Belum ada komentar. Jadilah yang pertama! 👋</div>
              : comments.map(c => (
                <CommentItem key={c.id} c={c} user={user} onDelete={handleDelete} />
              ))
            }
          </div>
          <CommentForm
            user={user}
            text={text}
            setText={setText}
            sending={sending}
            onSend={handleSend}
          />
        </>
      )}
    </div>
  );
}
