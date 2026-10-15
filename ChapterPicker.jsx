// src/components/quiz/ChapterPicker.jsx
// ─────────────────────────────────────────────────────────────
// Sama fungsinya seperti TMPicker, tapi untuk FTK yang dibuka per
// JUDUL BAB (dari buku ners), bukan per TM 1-16 — jumlah bab terbuka,
// tidak tetap 16. Dipakai di pages/quiziz/QuizFTK.jsx. Styling pakai
// token glass bersama di styles/quizGlass.css (class `.cp-*`) supaya
// konsisten dengan TMPicker.
//
// TOGGLE ADMIN: sama seperti TMPicker, admin (ADMIN_EMAIL) bisa
// menyalakan/mematikan tiap bab yang sudah punya konten, live lewat
// Firestore (koleksi quizToggles, dokumen "ftk", field `off` berisi id bab).
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import useQuizAuth, { quizDb, ADMIN_EMAIL } from './useQuizAuth';
import '../../styles/quizGlass.css';

function useLiveToggles(subjectSlug) {
  const [off, setOff] = useState([]);
  useEffect(() => {
    if (!subjectSlug) return;
    const unsub = onSnapshot(doc(quizDb, 'quizToggles', subjectSlug), (snap) => {
      setOff(snap.exists() ? (snap.data().off || []) : []);
    }, () => setOff([]));
    return unsub;
  }, [subjectSlug]);
  return [off, setOff];
}

/** chapters: [{ id, title }] — hanya bab yang SUDAH punya konten (data/quiziz/ftk/<id>/). */
export default function ChapterPicker({ subjectName, subjectSlug, chapters = [], onSelectChapter }) {
  const user = useQuizAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;
  const [off, setOff] = useLiveToggles(subjectSlug);

  const toggleChapter = async (id) => {
    if (!isAdmin || !subjectSlug) return;
    const next = off.includes(id) ? off.filter(x => x !== id) : [...off, id];
    setOff(next);
    try { await setDoc(doc(quizDb, 'quizToggles', subjectSlug), { off: next }, { merge: true }); }
    catch { /* onSnapshot akan koreksi kalau gagal */ }
  };

  return (
    <div className="cp-root">
      <div className="cp-head">
        <h1 className="cp-title">{subjectName}</h1>
        <p className="cp-source">Materi sesuai buku &amp; PPT Kelas D — dibuka per bab, bukan per TM</p>
      </div>

      {isAdmin && (
        <div className="cp-admin-bar">
          🛠️ Mode Admin — klik bab untuk menyalakan/mematikannya ke publik.
        </div>
      )}

      {chapters.length === 0 ? (
        <div className="cp-empty">Belum ada bab yang diisi. Upload buku/PPT FTK dulu supaya babnya bisa dibuat.</div>
      ) : (
        <div className="cp-list">
          {chapters.map((c, i) => {
            const isLive = !off.includes(c.id);
            const adminClickable = isAdmin;
            return (
              <div
                key={c.id}
                className={`cp-card ${isLive ? 'cp-open' : 'cp-locked'}`}
                style={adminClickable ? { cursor: 'pointer' } : undefined}
                onClick={isLive && !isAdmin ? () => onSelectChapter(c.id) : adminClickable ? () => toggleChapter(c.id) : undefined}
                role="button"
              >
                <span className="cp-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="cp-label">{c.title}</span>
                <span className={`qz-badge ${isLive ? 'qz-badge-open' : 'qz-badge-soon'}`}>
                  {isAdmin ? (isLive ? 'Nyala — klik matikan' : 'Mati — klik nyalakan') : (isLive ? 'Bisa Dipelajari' : 'Dimatikan Admin')}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
