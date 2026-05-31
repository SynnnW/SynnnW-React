import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection, doc, onSnapshot,
  orderBy, query, where
} from 'firebase/firestore';

const CSS = `
  .db-page {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(135deg, #070709 0%, #1a1a2e 100%);
    color: #fff;
    font-family: 'Outfit', sans-serif;
    overflow: hidden;
  }
  .db-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
  }
  .db-orb1 {
    width: 400px; height: 400px;
    background: rgba(167, 139, 250, 0.4);
    top: -100px; left: -100px;
  }
  .db-orb2 {
    width: 300px; height: 300px;
    background: rgba(59, 130, 246, 0.3);
    bottom: 100px; right: -50px;
  }
  .db-wrap {
    position: relative;
    z-index: 10;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 24px;
  }
  .db-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .db-header-content h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.6rem, 5vw, 2.4rem);
    font-weight: 300;
    margin: 0 0 4px;
  }
  .db-header-content em {
    color: #a78bfa;
    font-style: italic;
  }
  .db-header-sub {
    font-size: 0.85rem;
    color: #94a3b8;
    margin: 0;
  }
  .db-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    color: #a78bfa;
    padding: 6px 12px;
    border-radius: 99px;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .db-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #86efac;
    padding: 10px 16px;
    border-radius: 99px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.06em;
  }
  .db-pulse-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #86efac;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .db-btn-logout {
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #f87171;
    padding: 10px 18px;
    border-radius: 99px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.75rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    flex-shrink: 0;
  }
  .db-btn-logout:hover {
    background: rgba(239, 68, 68, 0.15);
  }
  .db-content {
    display: grid;
    gap: 36px;
  }
  .db-admin-notes {
    background: rgba(139, 92, 246, 0.06);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 14px;
    padding: 16px 18px;
  }
  .db-admin-notes-label {
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #a78bfa;
    margin-bottom: 8px;
    display: block;
  }
  .db-admin-notes p {
    font-size: 0.78rem;
    color: #94a3b8;
    line-height: 1.65;
    margin: 0;
  }
  .db-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .db-two-col {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
  .db-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    padding: 28px;
    backdrop-filter: blur(18px);
  }
  .db-card-title {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 18px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .db-card-title i {
    color: #a78bfa;
  }
  .db-iframe-wrap {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    border-radius: 12px;
    margin-bottom: 20px;
  }
  .db-iframe-wrap iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
  .db-placeholder {
    background: rgba(139, 92, 246, 0.06);
    border: 2px dashed rgba(139, 92, 246, 0.3);
    border-radius: 12px;
    padding: 40px 24px;
    text-align: center;
    margin-bottom: 20px;
  }
  .db-placeholder p {
    margin: 0;
    font-size: 0.85rem;
    color: #94a3b8;
  }
  .db-timeline {
    display: grid;
    gap: 16px;
  }
  .db-timeline-item {
    display: flex;
    gap: 16px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    align-items: flex-start;
  }
  .db-timeline-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 4px;
  }
  .db-timeline-dot.done {
    background: #86efac;
  }
  .db-timeline-dot.progress {
    background: #fbbf24;
    animation: pulse 1.5s ease-in-out infinite;
  }
  .db-timeline-dot.pending {
    background: #94a3b8;
  }
  .db-timeline-content h4 {
    margin: 0 0 4px;
    font-size: 0.88rem;
    font-weight: 600;
  }
  .db-timeline-content p {
    margin: 0;
    font-size: 0.78rem;
    color: #94a3b8;
  }
  .db-issues {
    display: grid;
    gap: 12px;
  }
  .db-issue-item {
    background: rgba(239, 68, 68, 0.05);
    border-left: 3px solid rgba(239, 68, 68, 0.3);
    border-radius: 6px;
    padding: 14px 16px;
  }
  .db-issue-time {
    font-size: 0.7rem;
    color: #f87171;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 4px;
    display: block;
  }
  .db-issue-title {
    font-size: 0.88rem;
    font-weight: 600;
    margin: 0 0 6px;
    color: #fff;
  }
  .db-issue-desc {
    font-size: 0.78rem;
    color: #94a3b8;
    margin: 0;
    line-height: 1.5;
  }
  .db-questions {
    display: grid;
    gap: 12px;
  }
  .db-question-item {
    background: rgba(139, 92, 246, 0.05);
    border-left: 3px solid rgba(139, 92, 246, 0.3);
    border-radius: 6px;
    padding: 14px 16px;
  }
  .db-question-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #a78bfa;
    margin-bottom: 6px;
  }
  .db-question-emoji {
    font-size: 1rem;
  }
  .db-question-text {
    font-size: 0.85rem;
    color: #fff;
    line-height: 1.6;
    margin: 0;
  }
  .db-ls-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
    padding: 60px 24px;
  }
  .db-ls-icon-ring {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.2rem;
    color: #a78bfa;
  }
  .db-ls-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 300;
    margin: 0;
  }
  .db-ls-title em {
    font-style: italic;
    color: #a78bfa;
  }
  .db-ls-desc {
    font-size: 0.88rem;
    color: #94a3b8;
    line-height: 1.8;
    max-width: 480px;
    margin: 0;
  }
  .db-wa-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    background: rgba(37, 211, 102, 0.1);
    border: 1px solid rgba(37, 211, 102, 0.3);
    border-radius: 99px;
    color: #4ade80;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.25s;
  }
  .db-wa-btn:hover {
    background: rgba(37, 211, 102, 0.18);
    transform: translateY(-2px);
  }
  .db-progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 99px;
    overflow: hidden;
    margin-bottom: 12px;
  }
  .db-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #a78bfa, #3b82f6);
    border-radius: 99px;
    transition: width 0.3s ease;
  }
  .db-empty {
    text-align: center;
    padding: 60px 24px;
    color: #94a3b8;
  }
  .db-empty h3 {
    font-size: 1.3rem;
    margin: 0 0 12px;
    color: #fff;
  }
  .db-empty p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [dashContent, setDashContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubOrder = null;
    let unsubContent = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (unsubOrder) { unsubOrder(); unsubOrder = null; }
      if (unsubContent) { unsubContent(); unsubContent = null; }

      if (!user) { setLoading(false); return; }

      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );

      unsubOrder = onSnapshot(q, (snap) => {
        if (snap.empty) { setOrder(null); setLoading(false); return; }
        const latestOrder = { id: snap.docs[0].id, ...snap.docs[0].data() };
        setOrder(latestOrder);

        if (unsubContent) unsubContent();
        unsubContent = onSnapshot(doc(db, 'dashboardContent', latestOrder.id), (docSnap) => {
          setDashContent(docSnap.exists() ? docSnap.data() : null);
          setLoading(false);
        }, () => {
          setDashContent(null);
          setLoading(false);
        });
      });
    });

    return () => {
      if (unsubOrder) unsubOrder();
      if (unsubContent) unsubContent();
      unsubAuth();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
        LOADING...
      </div>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="db-page">
        <div className="db-orb db-orb1" />
        <div className="db-orb db-orb2" />
        <div className="db-wrap">
          {/* Header */}
          <div className="db-header">
            <div className="db-header-content">
              <div className="db-chip">Project Dashboard</div>
              <h2>{order?.projectName || 'Unnamed Project'}</h2>
              <p className="db-header-sub">{order?.projectDesc || 'No description'}</p>
            </div>
            <button className="db-btn-logout" onClick={handleLogout}>
              <i className="fa-solid fa-sign-out-alt" /> Logout
            </button>
          </div>

          {/* Status Pill */}
          <div style={{ marginBottom: 32 }}>
            <div className="db-status-pill">
              <div className="db-pulse-dot" />
              {order?.status || 'Pending'}
            </div>
          </div>

          {/* Konten Berdasarkan Service Category */}
          {!order ? (
            <div className="db-empty">
              <h3>Belum ada order aktif</h3>
              <p>Kembali ke price list untuk membuat order baru</p>
            </div>
          ) : order.serviceCategory === 'livestream' ? (
            <DashboardLivestream order={order} dashContent={dashContent} />
          ) : order.serviceCategory === 'website' || order.serviceCategory === 'domain' ? (
            <DashboardWebsite order={order} dashContent={dashContent} />
          ) : (
            <DashboardVideo order={order} dashContent={dashContent} />
          )}
        </div>
      </div>
    </>
  );
}

function DashboardVideo({ order, dashContent }) {
  const ORDER_STEPS_DEFAULT = [
    'Pending', 'Import & Rough Cut', 'Cutting Kasar',
    'Efek Visual', 'Audio / Backsound', 'Final Review & Export', 'Selesai'
  ];

  const getTimelineStatus = () => {
    if (dashContent?.timeline && dashContent.timeline.length > 0) {
      return dashContent.timeline;
    }
    return ORDER_STEPS_DEFAULT.map((step, idx) => {
      let status = 'pending';
      const currentStepIdx = ORDER_STEPS_DEFAULT.indexOf(order.status);
      if (idx < currentStepIdx) status = 'done';
      else if (idx === currentStepIdx) status = 'progress';
      return { id: idx, label: step, status, note: '' };
    });
  };

  const timeline = getTimelineStatus();

  return (
    <div className="db-content">
      <div className="db-two-col">
        {/* Kolom Kiri */}
        <div>
          <div className="db-card">
            <h3 className="db-card-title">
              <i className="fa-brands fa-google-drive" /> Video Preview
            </h3>
            {dashContent?.driveUrl ? (
              <div className="db-iframe-wrap">
                <iframe src={dashContent.driveUrl} allow="autoplay" allowFullScreen />
              </div>
            ) : (
              <div className="db-placeholder">
                <p>🎬 Preview akan tersedia setelah admin upload file</p>
              </div>
            )}
            {order.projectDesc && (
              <>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 12 }}>{order.projectDesc}</p>
                <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>Total: Rp {order.cartTotal?.toLocaleString('id-ID') || '0'}</p>
              </>
            )}
          </div>

          <div className="db-card" style={{ marginTop: 24 }}>
            <h3 className="db-card-title">
              <i className="fa-solid fa-triangle-exclamation" /> Catatan Masalah Footage
            </h3>
            {dashContent?.issues && dashContent.issues.length > 0 ? (
              <div className="db-issues">
                {dashContent.issues.map((issue, idx) => (
                  <div key={idx} className="db-issue-item">
                    <span className="db-issue-time">{issue.time}</span>
                    <h4 className="db-issue-title">{issue.title}</h4>
                    <p className="db-issue-desc">{issue.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Belum ada catatan dari admin.</p>
            )}
          </div>
        </div>

        {/* Kolom Kanan */}
        <div>
          <div className="db-card">
            <h3 className="db-card-title">
              <i className="fa-solid fa-list-check" /> Progress Timeline
            </h3>
            <div className="db-timeline">
              {timeline.map((step, idx) => (
                <div key={idx} className="db-timeline-item">
                  <div className={`db-timeline-dot ${step.status}`} />
                  <div className="db-timeline-content">
                    <h4>{step.label}</h4>
                    {step.note && <p>{step.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="db-card" style={{ marginTop: 24 }}>
            <h3 className="db-card-title">
              <i className="fa-solid fa-comments" /> Pertanyaan untuk Klien
            </h3>
            {dashContent?.questions && dashContent.questions.length > 0 ? (
              <div className="db-questions">
                {dashContent.questions.map((q, idx) => (
                  <div key={idx} className="db-question-item">
                    <div className="db-question-tag">
                      <span className="db-question-emoji">{q.emoji}</span>
                      {q.tag}
                    </div>
                    <p className="db-question-text">{q.q}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Belum ada pertanyaan dari admin.</p>
            )}
          </div>

          {dashContent?.adminNotes && (
            <div className="db-admin-notes" style={{ marginTop: 24 }}>
              <span className="db-admin-notes-label">Catatan Admin</span>
              <p>{dashContent.adminNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardLivestream({ order, dashContent }) {
  const waLink = `https://wa.me/62895381517808?text=Halo SynnnW, saya sudah order Paket Live Stream. Order ID: ${order.id}`;

  return (
    <div className="db-content">
      <div className="db-ls-center">
        <div className="db-ls-icon-ring">
          <i className="fa-solid fa-tower-broadcast" />
        </div>
        <h2 className="db-ls-title">
          Konfirmasi Order <em>Live Stream</em>
        </h2>
        <p className="db-ls-desc">
          Order live stream kamu sudah kami terima! Tim SynnnW akan menghubungi kamu dalam 24 jam untuk mendiskusikan detail teknis, jadwal, dan persiapan.
        </p>
        <div className="db-status-pill">
          <div className="db-pulse-dot" />
          {order.status || 'Pending'}
        </div>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="db-wa-btn">
          <i className="fa-brands fa-whatsapp" /> Chat WhatsApp
        </a>
        <p style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: 400, margin: '0 auto' }}>
          Pastikan kamu telah mengisi brief di form sebelumnya.
        </p>
        {dashContent?.adminNotes && (
          <div className="db-admin-notes" style={{ maxWidth: 480 }}>
            <span className="db-admin-notes-label">Catatan Admin</span>
            <p>{dashContent.adminNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardWebsite({ order, dashContent }) {
  const STATUS_OPTIONS = ['Pending', 'Diskusi Requirement', 'Desain Mockup', 'Development', 'Review & Revisi', 'Selesai'];
  const currentIdx = STATUS_OPTIONS.indexOf(order.status);
  const progressPercent = currentIdx >= 0 ? ((currentIdx + 1) / STATUS_OPTIONS.length) * 100 : 0;

  const waLink = `https://wa.me/62895381517808?text=Halo SynnnW, saya sudah order Paket Website/Domain. Order ID: ${order.id}`;

  return (
    <div className="db-content">
      <div className="db-two-col">
        <div>
          <div className="db-card">
            <h3 className="db-card-title">
              <i className="fa-solid fa-globe" /> Ringkasan Order Website
            </h3>
            <p style={{ marginBottom: 16, fontSize: '0.9rem', color: '#fff' }}>
              <strong>{order.projectName}</strong>
            </p>
            <p style={{ marginBottom: 12, fontSize: '0.85rem', color: '#94a3b8' }}>
              {order.projectDesc}
            </p>
            {order.serviceNames && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Layanan
                </p>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#94a3b8', fontSize: '0.85rem' }}>
                  {order.serviceNames.map((name, idx) => (
                    <li key={idx}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
            <p style={{ fontSize: '0.8rem', color: '#666' }}>
              Total: Rp {order.cartTotal?.toLocaleString('id-ID') || '0'}
            </p>
          </div>
        </div>

        <div>
          <div className="db-card">
            <h3 className="db-card-title">
              <i className="fa-solid fa-chart-line" /> Progress
            </h3>
            <div className="db-progress-bar">
              <div className="db-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 20px', textAlign: 'center' }}>
              {order.status || 'Pending'}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#fff', marginBottom: 20, lineHeight: 1.6 }}>
              Kami akan menghubungi kamu via WhatsApp untuk diskusi lebih lanjut tentang kebutuhan project kamu.
            </p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="db-wa-btn" style={{ width: '100%', justifyContent: 'center' }}>
              <i className="fa-brands fa-whatsapp" /> Chat WhatsApp
            </a>
          </div>

          {dashContent?.adminNotes && (
            <div className="db-admin-notes" style={{ marginTop: 24 }}>
              <span className="db-admin-notes-label">Catatan Admin</span>
              <p>{dashContent.adminNotes}</p>
            </div>
          )}

          {dashContent?.driveUrl && (
            <div style={{ marginTop: 24 }}>
              <a
                href={dashContent.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="db-wa-btn"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <i className="fa-solid fa-eye" /> Lihat Preview / Mockup
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
