// src/components/quiz/TMPicker.jsx
// ─────────────────────────────────────────────────────────────
// Grid 16 kartu TM (Tatap Muka), dipakai di setiap halaman matkul
// (QuizBahasaInggris.jsx, QuizPAI.jsx, dst), sekarang sebagai WIDE
// GLASS CARDS (kartu horizontal panjang, frosted-glass, aksen warna
// per kartu). Kartu yang nomornya ada di `availableTM` bisa diklik
// ("Bisa Dipelajari"); sisanya "Coming Soon".
//
// Tambah TM baru (isi soal/materi baru) = tambah 1 angka ke manifest.js
// matkul terkait, komponen ini tidak perlu diubah.
//
// MILESTONE LABEL (UTS/UAS): defaultnya TM 8 = "UTS" dan TM 16 = "UAS"
// (konvensi lama, dipertahankan untuk matkul yang belum punya info
// pemetaan UAS/UTS-nya sendiri). Matkul yang sudah tahu pemetaan
// aslinya (mis. Bahasa Inggris: TM 1 = UAS) mengirim prop `milestones`
// sendiri untuk MENGGANTIKAN default ini — lihat QuizBahasaInggris.jsx.
// Jangan ubah default ini untuk matkul lain tanpa data yang jelas.
//
// TM INFO (judul & deskripsi singkat): opsional, HANYA diisi untuk TM
// yang datanya benar-benar ada di project (lihat `tmInfo` di
// QuizBahasaInggris.jsx untuk TM 1) — supaya tidak mengarang materi
// buat TM yang belum dibuat.
//
// TOGGLE ADMIN: dari TM yang SUDAH punya konten (ada di `availableTM`),
// admin (login Google dengan email ADMIN_EMAIL) bisa menyalakan/mematikan
// tampilannya ke publik langsung dari sini — tanpa minta AI edit kode.
// Status toggle disimpan live di Firestore (koleksi `quizToggles`,
// 1 dokumen per matkul), jadi berlaku untuk MATERI DAN LATSOL sekaligus.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import useQuizAuth, { quizDb, ADMIN_EMAIL } from './useQuizAuth';
import '../../styles/quizGlass.css';

const DEFAULT_MILESTONES = { 8: 'UTS', 16: 'UAS' };

// Palet aksen warna yang di-cycle per nomor TM — biar "ceria" tapi tetap
// satu sistem desain (semua kartu pakai struktur glass yang sama, cuma
// hue-nya beda). Kartu milestone (UTS/UAS) selalu pakai emas, di luar palet ini.
const ACCENT_CYCLE = ['#8b7bff', '#5eead4', '#38bdf8', '#f472b6', '#34d399', '#a78bfa', '#fb7185', '#22d3ee'];
const MILESTONE_ACCENT = '#fbbf24';

/** Subscribe ke dokumen quizToggles/<subjectSlug>. Field `off`: array nomor TM
 *  yang sudah punya konten tapi sengaja dimatikan admin dari tampilan publik.
 *  Belum ada dokumen = anggap semua TM yang ada kontennya tetap menyala. */
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

export default function TMPicker({
  subjectName,
  subjectSlug,
  availableTM = [],
  onSelectTM,
  milestones = DEFAULT_MILESTONES,
  tmInfo = {},
}) {
  const cards = Array.from({ length: 16 }, (_, i) => i + 1);
  const user = useQuizAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;
  const [off, setOff] = useLiveToggles(subjectSlug);

  const toggleTM = async (tm) => {
    if (!isAdmin || !subjectSlug) return;
    const next = off.includes(tm) ? off.filter(n => n !== tm) : [...off, tm];
    setOff(next); // optimistic — onSnapshot akan menimpa dengan nilai server begitu tersinkron
    try { await setDoc(doc(quizDb, 'quizToggles', subjectSlug), { off: next }, { merge: true }); }
    catch { /* biarkan onSnapshot koreksi state kalau gagal */ }
  };

  return (
    <div className="tmp-root">
      <div className="tmp-head">
        <h1 className="tmp-title">{subjectName}</h1>
        <p className="tmp-source">Materi sesuai PPT Kelas D &amp; Jadwal Kelas D/Ns Leo</p>
      </div>

      {isAdmin && (
        <div className="tmp-admin-bar">
          🛠️ Mode Admin — klik kartu yang sudah punya konten untuk menyalakan/mematikannya ke publik
          (tidak menghapus data, cuma disembunyikan sementara).
        </div>
      )}

      <div className="tmp-list">
        {cards.map((tm) => {
          const hasContent = availableTM.includes(tm);
          const isLive = hasContent && !off.includes(tm);
          const milestone = milestones[tm];
          const info = tmInfo[tm];
          const title = info?.title || null; // tanpa info asli, biar nomor besar + badge yang bicara — nggak mengarang judul
          const accent = milestone ? MILESTONE_ACCENT : ACCENT_CYCLE[(tm - 1) % ACCENT_CYCLE.length];
          const adminClickable = isAdmin && hasContent;
          const clickable = isLive && !isAdmin;

          return (
            <div
              key={tm}
              className={`tmp-card ${isLive ? 'tmp-open' : 'tmp-locked'} ${milestone ? 'tmp-milestone' : ''}`}
              style={{ '--tmp-accent': accent, cursor: clickable || adminClickable ? 'pointer' : 'default' }}
              onClick={clickable ? () => onSelectTM(tm) : adminClickable ? () => toggleTM(tm) : undefined}
              role={(clickable || adminClickable) ? 'button' : undefined}
              tabIndex={(clickable || adminClickable) ? 0 : undefined}
              onKeyDown={(clickable || adminClickable) ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickable ? onSelectTM(tm) : toggleTM(tm); } } : undefined}
              aria-disabled={!isLive && !adminClickable}
            >
              <div className="tmp-num">
                <span className="tmp-num-n">{String(tm).padStart(2, '0')}</span>
              </div>

              <div className="tmp-body">
                <div className="tmp-row">
                  {title && <span className="tmp-label">{title}</span>}
                  {milestone && (
                    <span className="qz-badge qz-badge-milestone">{milestone}</span>
                  )}
                  <span className={`qz-badge ${isLive ? 'qz-badge-open' : 'qz-badge-soon'}`}>
                    {isLive ? 'Bisa Dipelajari' : hasContent ? 'Dimatikan Admin' : 'Coming Soon'}
                  </span>
                </div>
                <p className="tmp-desc">
                  {info?.desc || (hasContent ? 'Materi & latihan soal sudah tersedia.' : 'Materi belum tersedia — menyusul.')}
                </p>
                {adminClickable && (
                  <div className="tmp-admin-hint">{isLive ? 'Klik: matikan' : 'Klik: nyalakan'}</div>
                )}
              </div>

              {clickable && <span className="tmp-chev" aria-hidden="true">→</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
