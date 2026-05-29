import { useState, useEffect } from 'react';

/* ── Constants ── */
const DRIVE_PREVIEW = 'https://drive.google.com/file/d/12Eo_Q49sBgBhLJ2WbsPHPQ2r8sKqyizn/preview';
const DRIVE_VIEW    = 'https://drive.google.com/file/d/12Eo_Q49sBgBhLJ2WbsPHPQ2r8sKqyizn/view';

const WA_DRAFT = `Permisi, Kak 🙏

Berikut link preview video yang sudah melalui proses cutting:
🔗 https://drive.google.com/file/d/12Eo_Q49sBgBhLJ2WbsPHPQ2r8sKqyizn/view

📌 *Durasi & Cutting*
Durasi video saat ini masih lebih dari 10 menit. Bagian review sebenarnya masih bisa dipotong lebih lanjut, tetapi silakan Kakak cek dulu hasil cutting yang sekarang.

✨ *Progress Efek Visual*
Efek di bagian awal sudah ditambahkan untuk Subjek 1, sedangkan Subjek 2 belum. Untuk penambahan objek PNG dan grafis lainnya akan menyusul di tahap berikutnya.

⚠️ *Catatan Footage Wawancara*
Ada footage wawancara yang kualitas visualnya kurang optimal di menit *3:28* dan *7:12*. Jika memungkinkan, mohon di-upload ulang menggunakan file video versi aslinya, Kak.

🎵 *Backsound*
Untuk backsound, apakah ada request lagu khusus? Atau kalau Kakak sudah cocok dengan yang sekarang, tidak masalah.

📝 *Penempatan NIM*
Untuk konsep NIM, sebaiknya ditaruh di bagian depan atau belakang? Dan desainnya mau dibuat seperti apa — apakah cukup dijadikan thumbnail saja?

🎬 *BTS*
Untuk footage BTS, rencananya mau diletakkan di bagian mana, Kak?

Terima kasih atas kepercayaannya 🙏`;

/* ── Data ── */
const TIMELINE = [
  { id: 1, label: 'Import & Rough Cut',        status: 'done',     note: 'Selesai' },
  { id: 2, label: 'Cutting Kasar',              status: 'done',     note: 'Durasi masih >10 menit, bisa dipotong lagi' },
  { id: 3, label: 'Efek Visual — Subjek 1',    status: 'done',     note: 'Efek bagian awal selesai' },
  { id: 4, label: 'Efek Visual — Subjek 2',    status: 'progress', note: 'Sedang dikerjakan' },
  { id: 5, label: 'Objek PNG & Grafis',         status: 'pending',  note: 'Menyusul tahap berikutnya' },
  { id: 6, label: 'Penempatan NIM',             status: 'pending',  note: 'Menunggu konfirmasi klien' },
  { id: 7, label: 'Audio / Backsound',          status: 'pending',  note: 'Menunggu request klien' },
  { id: 8, label: 'BTS Integration',            status: 'pending',  note: 'Menunggu arahan klien' },
  { id: 9, label: 'Final Review & Export',      status: 'pending',  note: 'Tahap akhir' },
];

const ISSUES = [
  {
    time: '3:28',
    severity: 'warn',
    title: 'Footage Wawancara Kurang Optimal',
    desc: 'Kualitas visual footage wawancara di timestamp ini terlihat kurang bagus. Diperlukan file video asli untuk hasil yang lebih baik.',
  },
  {
    time: '7:12',
    severity: 'warn',
    title: 'Footage Wawancara Bermasalah',
    desc: 'Footage wawancara di titik ini juga memiliki kualitas visual yang kurang. Mohon upload ulang file video versi original.',
  },
];

const QUESTIONS = [
  { id: 1, emoji: '✂️', tag: 'Cutting',  q: 'Apakah hasil cutting sudah sesuai? Ada bagian yang perlu dipotong lebih lanjut?' },
  { id: 2, emoji: '🎵', tag: 'Backsound', q: 'Ada request lagu/backsound khusus, atau lagu yang sekarang sudah cocok?' },
  { id: 3, emoji: '📝', tag: 'NIM',       q: 'NIM ditaruh di depan atau belakang? Desain thumbnail atau seperti apa?' },
  { id: 4, emoji: '🎬', tag: 'BTS',       q: 'Footage BTS mau diletakkan di bagian mana?' },
  { id: 5, emoji: '📁', tag: 'Footage',   q: 'Bisakah upload ulang footage asli untuk menit 3:28 dan 7:12?' },
];

/* ── CSS ── */
const CSS = `
.db-page {
  min-height: 100vh;
  background: var(--bg);
  position: relative;
  overflow-x: hidden;
  font-family: 'Outfit', sans-serif;
  color: var(--text);
}
.db-orb {
  position: fixed; border-radius: 50%;
  pointer-events: none; filter: blur(120px); z-index: 0;
}
.db-orb1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%);
  top: -200px; left: -200px;
}
.db-orb2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(212,160,23,0.06) 0%, transparent 65%);
  bottom: -100px; right: -100px;
}

/* ── Wrap ── */
.db-wrap {
  position: relative; z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 32px 80px;
}

/* ── Header ── */
.db-header {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 24px;
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}
.db-header-meta {
  display: flex; flex-direction: column; gap: 6px;
}
.db-label-chip {
  font-size: 0.58rem; font-weight: 800;
  letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--accent3);
  background: rgba(139,92,246,0.08);
  border: 1px solid rgba(139,92,246,0.22);
  padding: 5px 14px; border-radius: 99px;
  width: fit-content;
}
.db-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 300; line-height: 1.1;
  margin: 8px 0 4px;
  letter-spacing: -0.02em;
}
.db-title em { font-style: italic; color: var(--accent3); }
.db-subtitle {
  font-size: 0.8rem; color: var(--text-dim);
  margin: 0; letter-spacing: 0.04em;
}
.db-status-pill {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 20px;
  background: rgba(74,222,128,0.06);
  border: 1px solid rgba(74,222,128,0.22);
  border-radius: 99px;
  font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(74,222,128,0.9);
  white-space: nowrap;
  flex-shrink: 0;
}
.db-pulse-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(74,222,128,0.9);
  box-shadow: 0 0 0 0 rgba(74,222,128,0.4);
  animation: dbPulse 2s ease infinite;
  flex-shrink: 0;
}
@keyframes dbPulse {
  0%   { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
  70%  { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
  100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
}

/* ── Two-column grid ── */
.db-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 28px;
  align-items: start;
}

/* ── Cards / Widgets ── */
.db-card {
  background: var(--glass);
  border: 1px solid var(--gborder);
  border-radius: 20px;
  backdrop-filter: var(--blur);
  overflow: hidden;
  margin-bottom: 24px;
}
.db-card:last-child { margin-bottom: 0; }

.db-card-header {
  display: flex; align-items: center;
  justify-content: space-between; gap: 12px;
  padding: 18px 22px;
  border-bottom: 1px solid var(--border);
}
.db-card-title {
  font-size: 0.68rem; font-weight: 800;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-dim);
  display: flex; align-items: center; gap: 8px;
  margin: 0;
}
.db-card-title i { color: var(--accent3); font-size: 0.75rem; }

/* ── Video Preview ── */
.db-video-ratio {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  background: #0a0a0f;
  border-radius: 0;
  overflow: hidden;
}
.db-video-ratio iframe {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  border: none;
}
.db-drive-link {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 22px;
  font-size: 0.72rem; font-weight: 600;
  color: var(--text-dim);
  text-decoration: none;
  border-top: 1px solid var(--border);
  transition: color 0.2s, background 0.2s;
}
.db-drive-link:hover {
  color: var(--text);
  background: rgba(139,92,246,0.05);
}
.db-drive-link i:last-child { margin-left: auto; font-size: 0.6rem; opacity: 0.6; }
.db-drive-link .db-drive-icon {
  width: 28px; height: 28px; border-radius: 8px;
  background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent3); font-size: 0.75rem; flex-shrink: 0;
}

/* ── Issues ── */
.db-issue {
  display: flex; gap: 14px;
  padding: 16px 22px;
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
}
.db-issue:last-child { border-bottom: none; }
.db-issue:hover { background: rgba(255,255,255,0.02); }
.db-issue-ts {
  display: flex; align-items: center; justify-content: center;
  min-width: 52px; height: 28px;
  font-family: monospace; font-size: 0.78rem; font-weight: 700;
  color: rgba(251,191,36,0.9);
  background: rgba(251,191,36,0.08);
  border: 1px solid rgba(251,191,36,0.2);
  border-radius: 6px; flex-shrink: 0;
  margin-top: 2px;
}
.db-issue-body {}
.db-issue-title {
  font-size: 0.78rem; font-weight: 700;
  color: var(--text); margin: 0 0 4px;
}
.db-issue-desc {
  font-size: 0.72rem; color: var(--text-dim);
  line-height: 1.6; margin: 0;
}

/* ── WA Draft ── */
.db-wa-wrap { padding: 18px 22px; }
.db-wa-bubble {
  background: rgba(37,211,102,0.04);
  border: 1px solid rgba(37,211,102,0.15);
  border-radius: 14px; border-top-left-radius: 3px;
  padding: 18px 20px;
  position: relative;
}
.db-wa-text {
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem; color: var(--text);
  line-height: 1.8; margin: 0;
  white-space: pre-wrap; word-break: break-word;
}
.db-btn-copy {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 18px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.66rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-dim); transition: all 0.22s;
}
.db-btn-copy:hover { color: var(--text); border-color: var(--gborder2); }
.db-btn-copy.copied { color: rgba(74,222,128,0.9); border-color: rgba(74,222,128,0.3); }
.db-wa-actions {
  display: flex; align-items: center; gap: 10px;
  margin-top: 14px;
}
.db-btn-wa {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 18px;
  background: rgba(37,211,102,0.1);
  border: 1px solid rgba(37,211,102,0.25);
  border-radius: 99px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.66rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: rgba(37,211,102,0.9);
  text-decoration: none; transition: all 0.22s;
}
.db-btn-wa:hover {
  background: rgba(37,211,102,0.18);
  border-color: rgba(37,211,102,0.4);
}

/* ── Sidebar widgets ── */
.db-widget {
  background: var(--glass);
  border: 1px solid var(--gborder);
  border-radius: 20px;
  backdrop-filter: var(--blur);
  overflow: hidden;
  margin-bottom: 20px;
}
.db-widget:last-child { margin-bottom: 0; }
.db-widget-head {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
}
.db-widget-title {
  font-size: 0.62rem; font-weight: 800;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--text-dim); margin: 0;
  display: flex; align-items: center; gap: 7px;
}
.db-widget-title i { color: var(--accent3); }

/* ── Timeline ── */
.db-timeline { padding: 8px 0; }
.db-tl-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 10px 18px;
  position: relative;
  transition: background 0.18s;
}
.db-tl-item:hover { background: rgba(255,255,255,0.02); }
.db-tl-dot-col {
  display: flex; flex-direction: column;
  align-items: center; flex-shrink: 0;
  width: 16px;
  margin-top: 2px;
}
.db-tl-dot {
  width: 10px; height: 10px;
  border-radius: 50%; flex-shrink: 0;
}
.db-tl-dot.done     { background: rgba(74,222,128,0.9); box-shadow: 0 0 6px rgba(74,222,128,0.4); }
.db-tl-dot.progress { background: var(--accent3); box-shadow: 0 0 6px rgba(139,92,246,0.5); animation: dbTlPulse 1.8s ease infinite; }
.db-tl-dot.pending  { background: transparent; border: 2px solid rgba(255,255,255,0.15); }
@keyframes dbTlPulse {
  0%,100% { box-shadow: 0 0 4px rgba(139,92,246,0.4); }
  50%     { box-shadow: 0 0 10px rgba(139,92,246,0.7); }
}
.db-tl-line {
  width: 1px; flex: 1;
  min-height: 18px;
  background: rgba(255,255,255,0.07);
  margin: 3px 0;
}
.db-tl-body { flex: 1; min-width: 0; }
.db-tl-name {
  font-size: 0.75rem; font-weight: 600;
  color: var(--text); display: block;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.db-tl-item.done .db-tl-name  { color: rgba(74,222,128,0.9); }
.db-tl-item.pending .db-tl-name { color: var(--text-dim); font-weight: 400; }
.db-tl-note {
  font-size: 0.64rem; color: var(--text-dim);
  display: block; margin-top: 1px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.db-tl-badge {
  font-size: 0.58rem; font-weight: 800;
  letter-spacing: 0.08em; padding: 2px 8px;
  border-radius: 99px; flex-shrink: 0;
  white-space: nowrap; margin-top: 2px;
}
.db-badge-done     { background: rgba(74,222,128,0.1); color: rgba(74,222,128,0.9); border: 1px solid rgba(74,222,128,0.2); }
.db-badge-progress { background: rgba(139,92,246,0.1); color: var(--accent3); border: 1px solid rgba(139,92,246,0.2); }
.db-badge-pending  { background: transparent; color: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.08); }

/* ── Questions ── */
.db-q-item {
  display: flex; gap: 12px;
  padding: 12px 18px;
  border-top: 1px solid var(--border);
  transition: background 0.18s;
}
.db-q-item:first-child { border-top: none; }
.db-q-item:hover { background: rgba(255,255,255,0.02); }
.db-q-emoji {
  font-size: 1.1rem; flex-shrink: 0; margin-top: 2px;
  width: 28px; text-align: center;
}
.db-q-tag {
  font-size: 0.56rem; font-weight: 800;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--accent3);
  background: rgba(139,92,246,0.08);
  border: 1px solid rgba(139,92,246,0.18);
  padding: 2px 8px; border-radius: 99px;
  display: inline-block; margin-bottom: 4px;
}
.db-q-text {
  font-size: 0.72rem; color: var(--text-dim);
  line-height: 1.55; margin: 0;
}

/* ── QRIS Section ── */
.db-qris-section {
  margin-top: 48px;
  border-top: 1px solid var(--border);
  padding-top: 48px;
}
.db-qris-head {
  margin-bottom: 28px;
}
.db-qris-label {
  font-size: 0.58rem; font-weight: 800;
  letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--accent3);
  background: rgba(139,92,246,0.08);
  border: 1px solid rgba(139,92,246,0.22);
  padding: 5px 14px; border-radius: 99px;
  display: inline-block; margin-bottom: 10px;
}
.db-qris-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 300; margin: 0 0 4px;
  letter-spacing: -0.02em;
}
.db-qris-title em { font-style: italic; color: var(--accent3); }
.db-qris-sub { font-size: 0.78rem; color: var(--text-dim); margin: 0; }

.db-qris-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.db-qris-card {
  background: var(--glass);
  border: 1px solid var(--gborder);
  border-radius: 22px;
  backdrop-filter: var(--blur);
  overflow: hidden;
}
.db-qris-card-head {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
}
.db-qr-brand {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.72rem; font-weight: 800;
  letter-spacing: 0.18em; color: var(--accent3);
}
.db-qr-name {
  font-size: 0.68rem; font-weight: 600; color: var(--text-dim);
}
.db-qr-body { padding: 28px 24px; text-align: center; }
.db-qr-box {
  width: 160px; height: 160px;
  margin: 0 auto 16px;
  background: #fff; border-radius: 14px;
  padding: 10px;
  display: flex; align-items: center; justify-content: center;
}
.db-qr-box svg { width: 100%; height: 100%; }
.db-qr-hint {
  font-size: 0.7rem; color: var(--text-dim);
  margin: 0 0 4px; font-weight: 600;
}
.db-qr-apps { font-size: 0.62rem; color: var(--text-dim); margin: 0; }

.db-info-card {
  background: var(--glass);
  border: 1px solid var(--gborder);
  border-radius: 22px;
  backdrop-filter: var(--blur);
  padding: 24px;
  display: flex; flex-direction: column; gap: 18px;
}
.db-info-row {
  display: flex; flex-direction: column; gap: 4px;
}
.db-info-lbl {
  font-size: 0.58rem; font-weight: 800;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-dim);
}
.db-info-val {
  font-family: monospace; font-size: 0.9rem; font-weight: 700;
  color: var(--accent3);
}
.db-wa-btn-full {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 20px;
  background: rgba(37,211,102,0.08);
  border: 1px solid rgba(37,211,102,0.25);
  border-radius: 14px;
  text-decoration: none; transition: all 0.22s;
  cursor: pointer;
}
.db-wa-btn-full:hover {
  background: rgba(37,211,102,0.14);
  border-color: rgba(37,211,102,0.4);
  transform: translateY(-1px);
}
.db-wa-ico {
  width: 38px; height: 38px; border-radius: 10px;
  background: rgba(37,211,102,0.12);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; color: rgba(37,211,102,0.9); flex-shrink: 0;
}
.db-wa-btn-title {
  font-size: 0.78rem; font-weight: 700;
  color: rgba(37,211,102,0.9); display: block;
}
.db-wa-btn-sub {
  font-size: 0.65rem; color: var(--text-dim); display: block;
}
.db-info-note {
  font-size: 0.66rem; color: var(--text-dim);
  line-height: 1.6; margin: 0;
  padding: 12px 14px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 10px;
}
.db-info-note i { color: var(--accent3); margin-right: 6px; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .db-grid { grid-template-columns: 1fr; }
  .db-qris-grid { grid-template-columns: 1fr; }
  .db-header { flex-direction: column; align-items: flex-start; }
  .db-wrap { padding: 32px 20px 60px; }
}
`;

/* ── Helpers ── */
function encodeWA(msg) {
  return 'https://wa.me/62895381517808?text=' + encodeURIComponent(msg);
}

/* ============================================================
   COMPONENT
   ============================================================ */
export default function Dashboard() {
  const [copied, setCopied]       = useState(false);
  const [copiedWA, setCopiedWA]   = useState(false);
  const [orderId]                  = useState(() => {
    const ts  = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
    return `SW-${ts}-${rnd}`;
  });

  const handleCopyWA = () => {
    navigator.clipboard.writeText(WA_DRAFT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(orderId).then(() => {
      setCopiedWA(true);
      setTimeout(() => setCopiedWA(false), 2000);
    });
  };

  const doneCount = TIMELINE.filter(t => t.status === 'done').length;
  const pct = Math.round((doneCount / TIMELINE.length) * 100);

  return (
    <>
      <style>{CSS}</style>
      <div className="db-page">
        {/* Orbs */}
        <div className="db-orb db-orb1" />
        <div className="db-orb db-orb2" />

        <div className="db-wrap">

          {/* ════════ HEADER ════════ */}
          <header className="db-header">
            <div className="db-header-meta">
              <span className="db-label-chip">Project Dashboard</span>
              <h1 className="db-title">Video Editing <em>Progress</em></h1>
              <p className="db-subtitle">Preview hasil cutting · Feedback & revisi · Pembayaran</p>
            </div>
            <div className="db-status-pill">
              <span className="db-pulse-dot" />
              {doneCount}/{TIMELINE.length} Selesai · {pct}%
            </div>
          </header>

          {/* ════════ MAIN GRID ════════ */}
          <div className="db-grid">

            {/* ── LEFT ── */}
            <div>

              {/* Video Preview */}
              <div className="db-card">
                <div className="db-card-header">
                  <h2 className="db-card-title">
                    <i className="fa-brands fa-google-drive" /> Preview Video — Cutting Kasar
                  </h2>
                </div>
                <div className="db-video-ratio">
                  <iframe
                    src={DRIVE_PREVIEW}
                    allow="autoplay"
                    allowFullScreen
                    title="Preview Video"
                  />
                </div>
                <a href={DRIVE_VIEW} target="_blank" rel="noopener noreferrer" className="db-drive-link">
                  <span className="db-drive-icon"><i className="fa-brands fa-google-drive" /></span>
                  Buka di Google Drive — akses penuh
                  <i className="fa-solid fa-arrow-up-right" />
                </a>
              </div>

              {/* Issues */}
              <div className="db-card">
                <div className="db-card-header">
                  <h2 className="db-card-title">
                    <i className="fa-solid fa-triangle-exclamation" /> Catatan Masalah Footage
                  </h2>
                  <span style={{
                    fontSize:'0.6rem', fontWeight:800, letterSpacing:'0.12em',
                    color:'rgba(251,191,36,0.85)',
                    background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)',
                    padding:'3px 10px', borderRadius:'99px'
                  }}>
                    {ISSUES.length} ITEM
                  </span>
                </div>
                {ISSUES.map((iss, i) => (
                  <div key={i} className="db-issue">
                    <div className="db-issue-ts">{iss.time}</div>
                    <div className="db-issue-body">
                      <p className="db-issue-title">{iss.title}</p>
                      <p className="db-issue-desc">{iss.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* WA Draft */}
              <div className="db-card">
                <div className="db-card-header">
                  <h2 className="db-card-title">
                    <i className="fa-brands fa-whatsapp" /> Draft Pesan WhatsApp
                  </h2>
                  <button
                    className={`db-btn-copy ${copied ? 'copied' : ''}`}
                    onClick={handleCopyWA}
                  >
                    <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`} />
                    {copied ? 'Tersalin!' : 'Salin Draft'}
                  </button>
                </div>
                <div className="db-wa-wrap">
                  <div className="db-wa-bubble">
                    <pre className="db-wa-text">{WA_DRAFT}</pre>
                  </div>
                  <div className="db-wa-actions">
                    <button
                      className={`db-btn-copy ${copied ? 'copied' : ''}`}
                      onClick={handleCopyWA}
                    >
                      <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`} />
                      {copied ? 'Tersalin!' : 'Salin Semua'}
                    </button>
                    <a
                      href={encodeWA(WA_DRAFT)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="db-btn-wa"
                    >
                      <i className="fa-brands fa-whatsapp" />
                      Kirim via WA
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* ── SIDEBAR ── */}
            <aside>

              {/* Progress Timeline */}
              <div className="db-widget">
                <div className="db-widget-head">
                  <h3 className="db-widget-title">
                    <i className="fa-solid fa-list-check" /> Progress Timeline
                  </h3>
                </div>
                <div className="db-timeline">
                  {TIMELINE.map((item, idx) => (
                    <div key={item.id} className={`db-tl-item ${item.status}`}>
                      <div className="db-tl-dot-col">
                        <div className={`db-tl-dot ${item.status}`} />
                        {idx < TIMELINE.length - 1 && <div className="db-tl-line" />}
                      </div>
                      <div className="db-tl-body">
                        <span className="db-tl-name">{item.label}</span>
                        <span className="db-tl-note">{item.note}</span>
                      </div>
                      <span className={`db-tl-badge db-badge-${item.status}`}>
                        {item.status === 'done' ? 'Done' : item.status === 'progress' ? 'WIP' : 'Soon'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions */}
              <div className="db-widget">
                <div className="db-widget-head">
                  <h3 className="db-widget-title">
                    <i className="fa-solid fa-circle-question" /> Pertanyaan untuk Klien
                  </h3>
                </div>
                {QUESTIONS.map(q => (
                  <div key={q.id} className="db-q-item">
                    <span className="db-q-emoji">{q.emoji}</span>
                    <div>
                      <span className="db-q-tag">{q.tag}</span>
                      <p className="db-q-text">{q.q}</p>
                    </div>
                  </div>
                ))}
              </div>

            </aside>
          </div>

          {/* ════════ QRIS SECTION ════════ */}
          <section className="db-qris-section">
            <div className="db-qris-head">
              <span className="db-qris-label">Pembayaran</span>
              <h2 className="db-qris-title">Metode Pembayaran <em>QRIS</em></h2>
              <p className="db-qris-sub">Scan QR di bawah · atau konfirmasi via WhatsApp</p>
            </div>

            <div className="db-qris-grid">

              {/* QR Card */}
              <div className="db-qris-card">
                <div className="db-qris-card-head">
                  <div className="db-qr-brand">
                    <i className="fa-solid fa-qrcode" /> QRIS
                  </div>
                  <span className="db-qr-name">SynnnW Studio</span>
                </div>
                <div className="db-qr-body">
                  <div className="db-qr-box">
                    {/* Mock QR — ganti dengan <img src="qris-kamu.png" /> */}
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <rect x="10" y="10" width="55" height="55" rx="6" fill="none" stroke="#1e1b4b" strokeWidth="5"/>
                      <rect x="20" y="20" width="35" height="35" rx="3" fill="#1e1b4b"/>
                      <rect x="135" y="10" width="55" height="55" rx="6" fill="none" stroke="#1e1b4b" strokeWidth="5"/>
                      <rect x="145" y="20" width="35" height="35" rx="3" fill="#1e1b4b"/>
                      <rect x="10" y="135" width="55" height="55" rx="6" fill="none" stroke="#1e1b4b" strokeWidth="5"/>
                      <rect x="20" y="145" width="35" height="35" rx="3" fill="#1e1b4b"/>
                      {[75,85,95,105,115,125].map((x,i) =>
                        [10,20,30,40,50,60,70,80,90].map((y,j) =>
                          (i+j)%3!==0 ? <rect key={`a-${i}-${j}`} x={x} y={y} width="8" height="8" fill="#1e1b4b" rx="1"/> : null
                        )
                      )}
                      {[10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180].map((x,i) =>
                        [75,85,95,105,115,125,135,145,155,165,175,185].map((y,j) =>
                          (i*3+j*7)%5!==0 ? <rect key={`b-${i}-${j}`} x={x} y={y} width="8" height="8" fill="#1e1b4b" rx="1"/> : null
                        )
                      )}
                      <rect x="82" y="82" width="36" height="36" rx="8" fill="#8b5cf6"/>
                      <text x="100" y="105" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">S</text>
                    </svg>
                  </div>
                  <p className="db-qr-hint">Scan dengan m-banking atau dompet digital</p>
                  <p className="db-qr-apps">GoPay · OVO · Dana · Shopeepay · BCA · dll</p>
                </div>
              </div>

              {/* Info + WA */}
              <div className="db-info-card">
                <div className="db-info-row">
                  <span className="db-info-lbl">Order ID</span>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <span className="db-info-val">{orderId}</span>
                    <button
                      onClick={handleCopyId}
                      style={{
                        background:'var(--glass2)', border:'1px solid var(--gborder)',
                        borderRadius:'6px', padding:'3px 9px', cursor:'pointer',
                        fontSize:'0.6rem', fontWeight:700, color:'var(--text-dim)',
                        fontFamily:'Outfit,sans-serif', transition:'all 0.2s',
                      }}
                    >
                      {copiedWA ? '✓' : 'Salin'}
                    </button>
                  </div>
                  <span style={{ fontSize:'0.62rem', color:'var(--text-dim)', lineHeight:1.5 }}>
                    Sertakan ID ini saat konfirmasi pembayaran.
                  </span>
                </div>

                <div className="db-info-row">
                  <span className="db-info-lbl">Sistem Pembayaran</span>
                  <span style={{ fontSize:'0.76rem', color:'var(--text)', fontWeight:600 }}>DP 50% di awal · Sisa setelah project selesai</span>
                </div>

                <a
                  href={encodeWA(`Halo kak, saya mau konfirmasi pembayaran.\nOrder ID: ${orderId}\n\nSudah transfer DP via QRIS.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="db-wa-btn-full"
                >
                  <div className="db-wa-ico">
                    <i className="fa-brands fa-whatsapp" />
                  </div>
                  <div>
                    <span className="db-wa-btn-title">Konfirmasi Pembayaran</span>
                    <span className="db-wa-btn-sub">Kirim bukti transfer via WhatsApp</span>
                  </div>
                  <i className="fa-solid fa-arrow-up-right" style={{ marginLeft:'auto', fontSize:'0.65rem', color:'var(--text-dim)' }} />
                </a>

                <p className="db-info-note">
                  <i className="fa-solid fa-circle-info" />
                  Setelah scan QR dan transfer, screenshot bukti bayar dan kirim ke WhatsApp. Project dimulai setelah DP diterima.
                </p>
              </div>

            </div>
          </section>

        </div>
      </div>
    </>
  );
}