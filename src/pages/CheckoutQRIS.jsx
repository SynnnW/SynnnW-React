import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

/* ── Buat order ID sekali saja ── */
function makeOrderId() {
  return 'SYN-' + Math.floor(100000 + Math.random() * 900000);
}

export default function CheckoutQRIS() {
  const navigate   = useNavigate();
  const [orderId]  = useState(makeOrderId);
  const [status, setStatus]     = useState('pending');
  const [amount]                = useState('Rp 150.000');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [simLoading, setSimLoading] = useState(false);
  const [countdown, setCountdown]   = useState(15 * 60); // 15 menit dummy
  const timerRef = useRef(null);

  /* ── Auth check + Firestore init ── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) { navigate('/'); return; }
      setUserInfo(user);
      setLoading(false);

      // Simpan transaksi awal
      const txRef = doc(db, 'transactions', orderId);
      setDoc(txRef, {
        orderId,
        uid:    user.uid,
        email:  user.email,
        status: 'pending',
        amount,
        createdAt: new Date().toISOString(),
      });

      // Real-time listener
      const unsubSnap = onSnapshot(txRef, (snap) => {
        if (!snap.exists()) return;
        const d = snap.data();
        setStatus(d.status);
        if (d.status === 'settlement' || d.status === 'success') {
          clearInterval(timerRef.current);
          navigate('/dashboard');
        }
      });

      return () => unsubSnap();
    });
    return () => unsub();
  }, [orderId, navigate, amount]);

  /* ── Countdown timer ── */
  useEffect(() => {
    if (status !== 'pending') return;
    timerRef.current = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [status]);

  /* ── Inject CSS ── */
  useEffect(() => {
    const id = 'qris-styles';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => { const s = document.getElementById(id); if (s) s.remove(); };
  }, []);

  /* ── Simulasi bayar (ganti status di Firestore) ── */
  const handleSimulate = async () => {
    setSimLoading(true);
    try {
      await setDoc(doc(db, 'transactions', orderId), { status: 'settlement' }, { merge: true });
    } catch (_) {
      setSimLoading(false);
    }
  };

  /* Format countdown mm:ss */
  const mins = String(Math.floor(countdown / 60)).padStart(2, '0');
  const secs = String(countdown % 60).padStart(2, '0');

  if (loading) {
    return (
      <div className="qr-loader">
        <div className="qr-spinner" />
        <span>Menyiapkan QRIS…</span>
      </div>
    );
  }

  const isPending    = status === 'pending';
  const isSuccess    = status === 'settlement' || status === 'success';
  const isExpired    = countdown === 0 && isPending;

  return (
    <div className="qr-wrap">
      <div className="qr-card">

        {/* ── Header ── */}
        <div className="qr-header">
          <button className="qr-btn-back" onClick={() => navigate('/dashboard')}>
            <i className="fa-solid fa-arrow-left" /> Kembali
          </button>
          <div className="qr-header-title">
            <i className="fa-solid fa-qrcode" />
            Pembayaran QRIS
          </div>
          <div style={{ width: 80 }} /> {/* spacer */}
        </div>

        {/* ── Body ── */}
        <div className="qr-body">

          {/* Info Pemesan */}
          <div className="qr-info-strip">
            <div className="qr-info-item">
              <span className="qr-info-label">Pembayar</span>
              <span className="qr-info-val">{userInfo?.displayName || 'Klien'}</span>
            </div>
            <div className="qr-info-sep" />
            <div className="qr-info-item">
              <span className="qr-info-label">Total</span>
              <span className="qr-info-val qr-info-amount">{amount}</span>
            </div>
            <div className="qr-info-sep" />
            <div className="qr-info-item">
              <span className="qr-info-label">ID Transaksi</span>
              <code className="qr-info-code">{orderId}</code>
            </div>
          </div>

          {/* QR Box */}
          <div className="qr-box-wrap">
            {isSuccess && (
              <div className="qr-success-overlay">
                <i className="fa-solid fa-circle-check" />
                <span>Pembayaran Diterima!</span>
              </div>
            )}
            {isExpired && (
              <div className="qr-expired-overlay">
                <i className="fa-solid fa-clock" />
                <span>QR Kedaluwarsa</span>
              </div>
            )}
            <div className="qr-box">
              {/* ── Mock QRIS SVG ── */}
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="qr-svg">
                {/* Corner squares */}
                <rect x="10" y="10" width="55" height="55" rx="6" fill="none" stroke="#1e1b4b" strokeWidth="5"/>
                <rect x="20" y="20" width="35" height="35" rx="3" fill="#1e1b4b"/>
                <rect x="135" y="10" width="55" height="55" rx="6" fill="none" stroke="#1e1b4b" strokeWidth="5"/>
                <rect x="145" y="20" width="35" height="35" rx="3" fill="#1e1b4b"/>
                <rect x="10" y="135" width="55" height="55" rx="6" fill="none" stroke="#1e1b4b" strokeWidth="5"/>
                <rect x="20" y="145" width="35" height="35" rx="3" fill="#1e1b4b"/>
                {/* Data modules (mock) */}
                {[75,85,95,105,115,125].map((x,i) =>
                  [10,20,30,40,50,60,70,80,90].map((y,j) =>
                    (i+j)%3!==0 ? <rect key={`${i}-${j}`} x={x} y={y} width="8" height="8" fill="#1e1b4b" rx="1"/> : null
                  )
                )}
                {[10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180].map((x,i) =>
                  [75,85,95,105,115,125,135,145,155,165,175,185].map((y,j) =>
                    (i*3+j*7)%5!==0 ? <rect key={`d-${i}-${j}`} x={x} y={y} width="8" height="8" fill="#1e1b4b" rx="1"/> : null
                  )
                )}
                {/* Center logo placeholder */}
                <rect x="82" y="82" width="36" height="36" rx="8" fill="#8b5cf6"/>
                <text x="100" y="105" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">S</text>
              </svg>
              <p className="qr-scan-hint">Scan dengan aplikasi mobile banking / dompet digital</p>
            </div>
          </div>

          {/* Status + Countdown */}
          <div className="qr-status-row">
            <div className={`qr-badge ${isPending ? 'qr-badge-pending' : 'qr-badge-success'}`}>
              <span className={`qr-badge-dot ${isPending ? 'qr-dot-pulse' : ''}`} />
              {isPending ? 'MENUNGGU PEMBAYARAN' : 'LUNAS'}
            </div>
            {isPending && !isExpired && (
              <div className="qr-countdown">
                <i className="fa-regular fa-clock" />
                Berlaku {mins}:{secs}
              </div>
            )}
          </div>

          {/* Simulator box */}
          {isPending && (
            <div className="qr-sim-box">
              <div className="qr-sim-header">
                <i className="fa-solid fa-flask" /> Sandbox Simulator
              </div>
              <p className="qr-sim-desc">
                Tekan tombol di bawah untuk mensimulasikan callback Midtrans Webhook.
                Status di Firestore akan diperbarui secara real-time.
              </p>
              <button
                className="qr-btn-sim"
                onClick={handleSimulate}
                disabled={simLoading || isExpired}
              >
                {simLoading
                  ? <><span className="qr-spinner-sm" /> Memproses…</>
                  : <><i className="fa-solid fa-bolt" /> Simulasikan Bayar Sukses</>}
              </button>
            </div>
          )}

          {/* Instruction steps */}
          <div className="qr-steps">
            {[
              ['fa-mobile-screen-button', 'Buka aplikasi', 'Mobile banking atau dompet digital (GoPay, OVO, Dana, dll.)'],
              ['fa-camera', 'Scan QR Code', 'Arahkan kamera ke kode QRIS di atas'],
              ['fa-check-double', 'Konfirmasi pembayaran', `Periksa nominal ${amount}, lalu konfirmasi`],
              ['fa-bell', 'Notifikasi otomatis', 'Halaman ini akan otomatis update setelah pembayaran diterima'],
            ].map(([icon, title, desc], i) => (
              <div key={i} className="qr-step-item">
                <div className="qr-step-num">{i + 1}</div>
                <div className="qr-step-ico"><i className={`fa-solid ${icon}`} /></div>
                <div>
                  <p className="qr-step-title">{title}</p>
                  <p className="qr-step-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STYLES — CSS variables tema website
───────────────────────────────────────────────────────────── */
const STYLES = `
.qr-loader {
  min-height: 60vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 16px; color: var(--text-dim);
  font-family: 'Outfit', sans-serif; font-size: 0.85rem; letter-spacing: 0.06em;
}
.qr-spinner {
  width: 36px; height: 36px; border-radius: 50%;
  border: 2.5px solid var(--gborder);
  border-top-color: var(--accent);
  animation: qrSpin 0.8s linear infinite;
}
.qr-spinner-sm {
  display: inline-block;
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  animation: qrSpin 0.7s linear infinite;
}
@keyframes qrSpin { to { transform: rotate(360deg); } }

.qr-wrap {
  min-height: 100vh;
  display: flex; align-items: flex-start; justify-content: center;
  padding: 40px 16px 80px;
  background: var(--bg);
  font-family: 'Outfit', sans-serif;
}

.qr-card {
  width: 100%; max-width: 520px;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 24px; overflow: hidden;
}

/* ── Header ── */
.qr-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid var(--border);
}
.qr-btn-back {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--text-dim);
  transition: all 0.25s;
}
.qr-btn-back:hover { color: var(--text); border-color: var(--gborder2); }
.qr-header-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.82rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text);
}
.qr-header-title i { color: var(--accent3); }

/* ── Body ── */
.qr-body {
  padding: 28px 24px;
  display: flex; flex-direction: column; gap: 22px;
}

/* ── Info strip ── */
.qr-info-strip {
  display: flex; align-items: center;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 14px; padding: 14px 20px;
  gap: 0;
}
.qr-info-item {
  flex: 1; display: flex; flex-direction: column; gap: 3px;
}
.qr-info-label {
  font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text-dim);
}
.qr-info-val { font-size: 0.82rem; color: var(--text); font-weight: 500; }
.qr-info-amount { color: var(--accent3); font-weight: 700; font-size: 0.92rem; }
.qr-info-code {
  font-size: 0.72rem; color: var(--accent3);
  background: rgba(139,92,246,0.1);
  padding: 2px 7px; border-radius: 5px;
  font-family: monospace;
}
.qr-info-sep {
  width: 1px; height: 36px; background: var(--border);
  margin: 0 16px; flex-shrink: 0;
}

/* ── QR Box ── */
.qr-box-wrap { position: relative; }
.qr-box {
  background: #fff;
  border-radius: 20px; padding: 24px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  border: 1px solid var(--gborder);
}
.qr-svg { width: 200px; height: 200px; }
.qr-scan-hint {
  font-size: 0.7rem; color: #64748b;
  text-align: center; margin: 0; line-height: 1.5;
}
.qr-success-overlay, .qr-expired-overlay {
  position: absolute; inset: 0; z-index: 5;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; border-radius: 20px;
  font-size: 0.9rem; font-weight: 700; letter-spacing: 0.06em;
}
.qr-success-overlay {
  background: rgba(16,185,129,0.92);
  color: #fff;
}
.qr-success-overlay i { font-size: 2.5rem; }
.qr-expired-overlay {
  background: rgba(15,23,42,0.85);
  color: var(--text-dim);
}
.qr-expired-overlay i { font-size: 2rem; color: #f59e0b; }

/* ── Status row ── */
.qr-status-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; flex-wrap: wrap;
}
.qr-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px; border-radius: 99px;
  font-size: 0.68rem; font-weight: 800; letter-spacing: 0.12em;
}
.qr-badge-pending {
  background: rgba(245,158,11,0.1); color: #f59e0b;
  border: 1px solid rgba(245,158,11,0.25);
}
.qr-badge-success {
  background: rgba(16,185,129,0.1); color: #10b981;
  border: 1px solid rgba(16,185,129,0.25);
}
.qr-badge-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
  background: currentColor;
}
.qr-dot-pulse { animation: qrPulse 1.4s ease-in-out infinite; }
@keyframes qrPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
}
.qr-countdown {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.78rem; color: var(--text-dim);
  font-variant-numeric: tabular-nums;
}

/* ── Simulator ── */
.qr-sim-box {
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 16px; padding: 18px 20px;
  display: flex; flex-direction: column; gap: 10px;
}
.qr-sim-header {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text-dim);
  display: flex; align-items: center; gap: 7px;
}
.qr-sim-header i { color: #f59e0b; }
.qr-sim-desc {
  font-size: 0.76rem; color: var(--text-dim);
  line-height: 1.65; margin: 0;
}
.qr-btn-sim {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 12px;
  background: #10b981; color: #fff;
  border: none; border-radius: 10px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em;
  transition: all 0.25s;
}
.qr-btn-sim:hover:not(:disabled) { background: #059669; transform: translateY(-1px); }
.qr-btn-sim:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Steps ── */
.qr-steps {
  display: flex; flex-direction: column; gap: 2px;
  border-top: 1px solid var(--border);
  padding-top: 20px;
}
.qr-step-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 10px 0;
}
.qr-step-num {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  background: var(--glass2); border: 1px solid var(--gborder);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem; font-weight: 800; color: var(--text-dim);
  margin-top: 2px;
}
.qr-step-ico {
  width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
  background: rgba(139,92,246,0.08);
  border: 1px solid rgba(139,92,246,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem; color: var(--accent3);
}
.qr-step-title {
  font-size: 0.8rem; font-weight: 700; color: var(--text);
  margin: 0 0 2px;
}
.qr-step-desc {
  font-size: 0.72rem; color: var(--text-dim);
  margin: 0; line-height: 1.55;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .qr-wrap { padding: 20px 12px 60px; }
  .qr-card { border-radius: 20px; }
  .qr-body { padding: 20px 16px; }
  .qr-info-strip { flex-direction: column; gap: 12px; }
  .qr-info-sep { width: 100%; height: 1px; margin: 0; }
}
`;
