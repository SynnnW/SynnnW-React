import { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';

/* ── Constants ── */
const DRIVE_PREVIEW = 'https://drive.google.com/file/d/12Eo_Q49sBgBhLJ2WbsPHPQ2r8sKqyizn/preview';

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

const ORDER_STEPS = [
  { id: 1, label: 'Pending' },
  { id: 2, label: 'Import & Rough Cut' },
  { id: 3, label: 'Cutting Kasar' },
  { id: 4, label: 'Efek Visual' },
  { id: 5, label: 'Audio / Backsound' },
  { id: 6, label: 'Final Review & Export' },
  { id: 7, label: 'Selesai' },
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

/* ── Price List CTA ── */
.db-pricelist-section {
  margin-top: 48px;
  border-top: 1px solid var(--border);
  padding-top: 48px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 20px;
}
.db-pricelist-label {
  font-size: 0.58rem; font-weight: 800;
  letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--accent3);
  background: rgba(139,92,246,0.08);
  border: 1px solid rgba(139,92,246,0.22);
  padding: 5px 14px; border-radius: 99px;
  display: inline-block;
}
.db-pricelist-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 300; margin: 0 0 4px;
  letter-spacing: -0.02em;
}
.db-pricelist-title em { font-style: italic; color: var(--accent3); }
.db-pricelist-sub { font-size: 0.78rem; color: var(--text-dim); margin: 0 0 8px; }
.db-pricelist-btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 32px;
  background: rgba(139,92,246,0.12);
  border: 1px solid rgba(139,92,246,0.35);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text); text-decoration: none;
  transition: all 0.25s;
}
.db-pricelist-btn:hover {
  background: rgba(139,92,246,0.22);
  border-color: rgba(139,92,246,0.6);
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(139,92,246,0.2);
}

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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const latestOrder = orders[0] || null;
  const currentIndex = latestOrder
    ? ORDER_STEPS.findIndex((step) => step.label === latestOrder.status)
    : -1;
  const doneCount = currentIndex >= 0 ? currentIndex + 1 : 0;
  const pct = currentIndex >= 0
    ? Math.round((doneCount / ORDER_STEPS.length) * 100)
    : 0;

  useEffect(() => {
    let unsubscribeOrders = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeOrders) {
        unsubscribeOrders();
        unsubscribeOrders = null;
      }

      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );

      unsubscribeOrders = onSnapshot(q, (snapshot) => {
        setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      }, (err) => {
        console.error('[Dashboard] Firestore subscription failed', err);
        setError('Gagal memuat data order.');
        setLoading(false);
      });
    });

    return () => {
      if (unsubscribeOrders) unsubscribeOrders();
      unsubscribeAuth();
    };
  }, []);

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
              {loading ? 'Memuat status order...' : latestOrder ? `${doneCount}/${ORDER_STEPS.length} ${latestOrder.status} · ${pct}%` : 'Belum ada order aktif'}
            </div>
          </header>

          {/* ════════ MAIN GRID ════════ */}
          <div className="db-grid">

            {/* ── LEFT ── */}
            <div>

              {/* Video Preview / Order Summary */}
              <div className="db-card">
                <div className="db-card-header">
                  <h2 className="db-card-title">
                    <i className="fa-brands fa-google-drive" /> {latestOrder ? `Order: ${latestOrder.projectName}` : 'Project Dashboard'}
                  </h2>
                </div>
                {loading ? (
                  <div style={{ padding: '40px', color: 'var(--text-dim)', textAlign: 'center' }}>
                    Memuat data order...
                  </div>
                ) : !latestOrder ? (
                  <div style={{ padding: '40px', color: 'var(--text-dim)', textAlign: 'center' }}>
                    <p>Belum ada order aktif untuk akun Anda.</p>
                    <p style={{ margin: '18px 0 0', color: 'var(--text-dim)' }}>
                      Silakan pilih layanan di Price List dan kirim brief untuk memulai.
                    </p>
                    <a href="/price-list" className="db-pricelist-btn" style={{ marginTop: 24 }}>
                      <i className="fa-solid fa-tags" /> Lihat Price List
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="db-video-ratio">
                      <iframe
                        src={DRIVE_PREVIEW}
                        allow="autoplay"
                        allowFullScreen
                        title="Preview Video"
                      />
                    </div>
                    <div style={{ padding: '18px 22px', borderTop: '1px solid var(--border)' }}>
                      <p style={{ margin: 0, color: 'var(--text-dim)' }}>
                        {latestOrder.projectDesc || 'Deskripsi order tidak tersedia.'}
                      </p>
                      <p style={{ margin: '14px 0 0', color: 'var(--text-dim)' }}>
                        <strong>Total Pesanan:</strong> Rp {Number(latestOrder.cartTotal || 0).toLocaleString('id-ID')}
                      </p>
                      <p style={{ margin: '8px 0 0', color: 'var(--text-dim)' }}>
                        <strong>Status saat ini:</strong> {latestOrder.status}
                      </p>
                    </div>
                  </>
                )}
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
                  {ORDER_STEPS.map((step, idx) => {
                    const status = latestOrder
                      ? idx < currentIndex
                        ? 'done'
                        : idx === currentIndex
                          ? 'progress'
                          : 'pending'
                      : 'pending';
                    return (
                      <div key={step.id} className={`db-tl-item ${status}`}>
                        <div className="db-tl-dot-col">
                          <div className={`db-tl-dot ${status}`} />
                          {idx < ORDER_STEPS.length - 1 && <div className="db-tl-line" />}
                        </div>
                        <div className="db-tl-body">
                          <span className="db-tl-name">{step.label}</span>
                          <span className="db-tl-note">
                            {status === 'done'
                              ? 'Selesai'
                              : status === 'progress'
                                ? 'Sedang berjalan'
                                : 'Menunggu tahap berikutnya'}
                          </span>
                        </div>
                        <span className={`db-tl-badge db-badge-${status}`}>
                          {status === 'done' ? 'Done' : status === 'progress' ? 'WIP' : 'Soon'}
                        </span>
                      </div>
                    );
                  })}
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

          {/* ════════ PRICE LIST CTA ════════ */}
          <section className="db-pricelist-section">
            <span className="db-pricelist-label">Pembayaran</span>
            <h2 className="db-pricelist-title">Lihat <em>Price List</em></h2>
            <p className="db-pricelist-sub">Cek detail harga, paket, dan metode pembayaran yang tersedia</p>
            <a href="/price-list" className="db-pricelist-btn">
              <i className="fa-solid fa-tags" />
              Lihat Price List
            </a>
          </section>

        </div>
      </div>
    </>
  );
}
