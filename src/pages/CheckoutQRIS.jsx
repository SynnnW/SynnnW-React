import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CSS = `
/* ── Page ── */
.ck-page {
  min-height: 100vh;
  background: var(--bg);
  padding-top: 64px;
  position: relative;
  overflow-x: hidden;
  font-family: 'Outfit', sans-serif;
}
.ck-orb {
  position: fixed; border-radius: 50%;
  pointer-events: none; filter: blur(100px); z-index: 0;
}
.ck-orb1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%);
  top: -200px; left: -200px;
}
.ck-orb2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%);
  bottom: -100px; right: -100px;
}

/* ── Layout ── */
.ck-wrap {
  position: relative; z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1100px;
  margin: 0 auto;
  min-height: calc(100vh - 64px);
  gap: 0;
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
}

/* ════════ LEFT ════════ */
.ck-left {
  padding: 56px 48px 80px;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.ck-left-head {
  display: flex; align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.ck-step-label {
  font-size: 0.58rem; font-weight: 700; letter-spacing: 0.28em;
  color: var(--accent3);
}
.ck-left-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 300; line-height: 1.1;
  color: var(--text); margin: 0;
  letter-spacing: -0.02em;
}
.ck-left-title em { font-style: italic; color: var(--accent3); }

/* Summary card */
.ck-summary-card {
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 20px; overflow: hidden;
  backdrop-filter: var(--blur);
}
.ck-summary-items {
  display: flex; flex-direction: column;
  padding: 6px 0;
}
.ck-summary-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
}
.ck-summary-item:last-child { border-bottom: none; }
.ck-sum-icon {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; color: var(--accent3);
}
.ck-sum-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.ck-sum-name { font-size: 0.82rem; font-weight: 600; color: var(--text); }
.ck-sum-unit { font-size: 0.68rem; color: var(--text-dim); }
.ck-sum-price { font-size: 0.9rem; font-weight: 700; color: var(--text); white-space: nowrap; }

.ck-sum-divider { height: 1px; background: var(--border); }

.ck-sum-total {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 20px;
  font-size: 0.75rem; font-weight: 600;
  color: var(--text-dim); letter-spacing: 0.08em;
  text-transform: uppercase;
}
.ck-sum-total-num {
  font-size: 1.3rem; font-weight: 700; color: var(--text);
  letter-spacing: 0; text-transform: none;
}

/* DP box */
.ck-dp-box {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 20px 18px;
  background: rgba(251,191,36,0.04);
  border-top: 1px solid rgba(251,191,36,0.15);
}
.ck-dp-box > i { color: rgba(251,191,36,0.8); font-size: 1rem; margin-top: 2px; flex-shrink: 0; }
.ck-dp-title { font-size: 0.78rem; font-weight: 700; color: rgba(251,191,36,0.9); margin: 0 0 4px; }
.ck-dp-sub { font-size: 0.72rem; color: var(--text-dim); margin: 0; line-height: 1.6; }
.ck-dp-sub strong { color: var(--text); }

/* Order ID */
.ck-orderid-box {
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 16px; padding: 16px 20px;
  display: flex; flex-direction: column; gap: 8px;
}
.ck-orderid-label {
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--text-dim);
}
.ck-orderid-row { display: flex; align-items: center; gap: 10px; }
.ck-orderid-code {
  flex: 1; font-family: monospace;
  font-size: 0.95rem; font-weight: 700;
  color: var(--accent3);
  background: rgba(139,92,246,0.08);
  padding: 4px 10px; border-radius: 7px;
  letter-spacing: 0.04em;
}
.ck-btn-copy {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.68rem; font-weight: 700;
  color: var(--text-dim); transition: all 0.25s;
}
.ck-btn-copy:hover { color: var(--text); border-color: var(--gborder2); }
.ck-orderid-note {
  font-size: 0.66rem; color: var(--text-dim);
  margin: 0; line-height: 1.55;
}

.ck-empty-cart {
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; padding: 40px 20px; text-align: center;
  color: var(--text-dim);
}
.ck-empty-cart i { font-size: 2.5rem; opacity: 0.3; }
.ck-empty-cart p { font-size: 0.85rem; margin: 0; }

/* ════════ RIGHT ════════ */
.ck-right {
  padding: 56px 48px 80px;
  display: flex; flex-direction: column; gap: 22px;
}

/* Countdown */
.ck-countdown-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px;
  background: rgba(74,222,128,0.06); border: 1px solid rgba(74,222,128,0.2);
  border-radius: 99px; width: fit-content;
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em;
  color: rgba(74,222,128,0.9);
  font-variant-numeric: tabular-nums;
}
.ck-countdown-bar i { font-size: 0.65rem; animation: ckPulse 1.6s ease infinite; }
@keyframes ckPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.ck-expired {
  background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.2);
  color: rgba(239,68,68,0.85);
}
.ck-expired i { animation: none; }

/* QRIS Card */
.ck-qris-card {
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 24px; overflow: hidden;
  backdrop-filter: var(--blur);
}
.ck-qris-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 22px;
  border-bottom: 1px solid var(--border);
}
.ck-qris-brand {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.78rem; font-weight: 800;
  letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent3);
}
.ck-qris-brand i { font-size: 1rem; }
.ck-qris-name {
  font-size: 0.72rem; color: var(--text-dim); font-weight: 600;
  letter-spacing: 0.06em;
}

.ck-qr-wrap { position: relative; }
.ck-qr-box {
  background: #ffffff;
  padding: 24px 24px 16px;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.ck-qr-svg { width: 190px; height: 190px; }
.ck-qr-hint {
  font-size: 0.68rem; color: #475569;
  text-align: center; margin: 0; line-height: 1.5;
}
.ck-qr-apps {
  font-size: 0.6rem; color: #94a3b8;
  letter-spacing: 0.04em; margin: 0; text-align: center;
}
.ck-qr-expired-overlay {
  position: absolute; inset: 0; z-index: 5;
  background: rgba(15,23,42,0.82);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px;
  font-size: 0.85rem; font-weight: 700; color: var(--text-dim);
}
.ck-qr-expired-overlay i { font-size: 1.8rem; color: #f59e0b; }

.ck-amount-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 22px 16px;
  border-top: 1px solid var(--border);
}
.ck-amount-row > div:first-child {
  display: flex; flex-direction: column; gap: 3px;
}
.ck-amount-label {
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--text-dim);
}
.ck-amount-num {
  display: block;
  font-size: 1.25rem; font-weight: 700; color: var(--text);
}
.ck-amount-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px;
  background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25);
  border-radius: 99px;
  font-size: 0.66rem; font-weight: 800; letter-spacing: 0.12em;
  color: #f59e0b;
}
.ck-pulse-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #f59e0b; flex-shrink: 0;
  animation: ckPulse 1.2s ease infinite;
}

/* Or divider */
.ck-or-divider {
  display: flex; align-items: center; gap: 14px;
}
.ck-or-divider span {
  flex: 1; height: 1px; background: var(--border);
}
.ck-or-divider p {
  font-size: 0.66rem; color: var(--text-dim); font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  white-space: nowrap; margin: 0;
}

/* WhatsApp button */
.ck-btn-wa {
  display: flex; align-items: center; gap: 16px;
  padding: 18px 22px;
  background: rgba(37,211,102,0.1); border: 1px solid rgba(37,211,102,0.3);
  border-radius: 18px; cursor: pointer;
  text-decoration: none;
  transition: all 0.3s;
  position: relative; overflow: hidden;
}
.ck-btn-wa::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(37,211,102,0.08), transparent);
  opacity: 0; transition: opacity 0.3s;
}
.ck-btn-wa:hover { border-color: rgba(37,211,102,0.55); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(37,211,102,0.15); }
.ck-btn-wa:hover::before { opacity: 1; }
.ck-btn-wa > i:first-child {
  font-size: 2rem; color: #25d366; flex-shrink: 0;
  filter: drop-shadow(0 0 12px rgba(37,211,102,0.4));
}
.ck-btn-wa > div {
  flex: 1; display: flex; flex-direction: column; gap: 3px;
}
.ck-btn-wa-title {
  font-size: 0.9rem; font-weight: 700; color: var(--text); letter-spacing: 0.02em;
}
.ck-btn-wa-sub {
  font-size: 0.7rem; color: var(--text-dim);
}
.ck-btn-wa-arrow {
  font-size: 0.75rem; color: rgba(37,211,102,0.7); flex-shrink: 0;
}

.ck-wa-note {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 16px;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 12px;
  font-size: 0.7rem; color: var(--text-dim); line-height: 1.65;
}
.ck-wa-note i { color: var(--accent3); font-size: 0.72rem; margin-top: 1px; flex-shrink: 0; }

/* Steps */
.ck-steps {
  display: flex; flex-direction: column; gap: 0;
  padding-top: 4px;
  border-top: 1px solid var(--border);
}
.ck-step-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}
.ck-step-item:last-child { border-bottom: none; }
.ck-step-num {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.62rem; font-weight: 800; color: var(--accent3);
  margin-top: 6px;
}
.ck-step-ico {
  width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
  background: var(--glass2); border: 1px solid var(--gborder);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem; color: var(--text-dim);
  margin-top: 2px;
}
.ck-step-title { font-size: 0.8rem; font-weight: 700; color: var(--text); margin: 0 0 3px; }
.ck-step-desc  { font-size: 0.7rem; color: var(--text-dim); margin: 0; line-height: 1.55; }

/* Back button */
.ck-btn-back {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text-dim);
  transition: all 0.25s;
}
.ck-btn-back:hover { color: var(--text); border-color: var(--gborder2); }

/* ── Responsive ── */
@media (max-width: 900px) {
  .ck-wrap { grid-template-columns: 1fr; }
  .ck-left { border-right: none; border-bottom: 1px solid var(--border); padding: 48px 32px; }
  .ck-right { padding: 40px 32px 80px; }
}
@media (max-width: 600px) {
  .ck-left, .ck-right { padding: 36px 20px 60px; }
  .ck-qr-svg { width: 160px; height: 160px; }
}
`;


/* ─────────────────────────────────────────────────────────────
   Buat Order ID sekali saja
───────────────────────────────────────────────────────────── */
function makeOrderId() {
  return 'SYN-' + Math.floor(100000 + Math.random() * 900000);
}

export default function CheckoutQRIS() {
  const navigate        = useNavigate();
  const [orderId]       = useState(makeOrderId);
  const [cartData, setCartData]   = useState(null);   // { items, total }
  const [waData, setWaData]       = useState(null);   // { msg, number }
  const [copied, setCopied]       = useState(false);
  const [countdown, setCountdown] = useState(15 * 60);
  const timerRef = useRef(null);

  /* ── Baca data dari localStorage ── */
  useEffect(() => {
    try {
      const cart = localStorage.getItem('selectedServices');
      if (cart) setCartData(JSON.parse(cart));

      const wa = localStorage.getItem('checkoutWAMsg');
      if (wa) setWaData(JSON.parse(wa));
    } catch (e) {
      console.error('Gagal baca localStorage:', e);
    }
  }, []);

  /* ── Countdown timer ── */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const mins = String(Math.floor(countdown / 60)).padStart(2, '0');
  const secs = String(countdown % 60).padStart(2, '0');
  const isExpired = countdown === 0;

  /* ── Format Rupiah ── */
  const formatRp = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

  /* ── Build WA URL ── */
  const waUrl = waData
    ? `https://wa.me/${waData.number}?text=${encodeURIComponent(waData.msg)}`
    : `https://wa.me/6281252790018?text=${encodeURIComponent('Halo kak, saya ingin konfirmasi order dari website SynnnW 🙏')}`;

  /* ── Copy orderId ── */
  const handleCopy = () => {
    navigator.clipboard.writeText(orderId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="ck-page">

        {/* ── Orbs ── */}
        <div className="ck-orb ck-orb1" /><div className="ck-orb ck-orb2" />

        <div className="ck-wrap">

          {/* ════════════════════ LEFT — ORDER SUMMARY ════════════════════ */}
          <div className="ck-left">

            {/* Header */}
            <div className="ck-left-head">
              <button className="ck-btn-back" onClick={() => navigate('/price-list')}>
                <i className="fa-solid fa-arrow-left" />
                <span>Price List</span>
              </button>
              <span className="ck-step-label">CHECKOUT</span>
            </div>

            <h2 className="ck-left-title">
              Ringkasan <em>Pesanan</em>
            </h2>

            {/* Order Summary */}
            {cartData && cartData.items && cartData.items.length > 0 ? (
              <div className="ck-summary-card">
                <div className="ck-summary-items">
                  {cartData.items.map((item) => (
                    <div key={item.id} className="ck-summary-item">
                      <div className="ck-sum-icon"><i className="fa-solid fa-layer-group" /></div>
                      <div className="ck-sum-info">
                        <span className="ck-sum-name">{item.name}</span>
                        <span className="ck-sum-unit">{item.unit} · ×{item.qty}</span>
                      </div>
                      <span className="ck-sum-price">{formatRp(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="ck-sum-divider" />

                <div className="ck-sum-total">
                  <span>Total Keseluruhan</span>
                  <span className="ck-sum-total-num">{formatRp(cartData.total)}</span>
                </div>

                <div className="ck-dp-box">
                  <i className="fa-solid fa-coins" />
                  <div>
                    <p className="ck-dp-title">Sistem Pembayaran DP 50%</p>
                    <p className="ck-dp-sub">
                      Bayar <strong>{formatRp(cartData.total / 2)}</strong> sebagai DP sekarang.
                      Sisa <strong>{formatRp(cartData.total / 2)}</strong> setelah project selesai.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="ck-empty-cart">
                <i className="fa-solid fa-bag-shopping" />
                <p>Tidak ada item pesanan.</p>
                <button className="ck-btn-back" onClick={() => navigate('/price-list')}>
                  Kembali ke Price List
                </button>
              </div>
            )}

            {/* Order ID */}
            <div className="ck-orderid-box">
              <span className="ck-orderid-label">ID Pesanan</span>
              <div className="ck-orderid-row">
                <code className="ck-orderid-code">{orderId}</code>
                <button className="ck-btn-copy" onClick={handleCopy}>
                  <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`} />
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <p className="ck-orderid-note">
                Sertakan ID ini saat konfirmasi pembayaran via WhatsApp.
              </p>
            </div>

          </div>

          {/* ════════════════════ RIGHT — QRIS + WA ════════════════════ */}
          <div className="ck-right">

            {/* Countdown */}
            <div className={`ck-countdown-bar ${isExpired ? 'ck-expired' : ''}`}>
              <i className={`fa-solid ${isExpired ? 'fa-clock' : 'fa-circle-dot'}`} />
              {isExpired
                ? 'Sesi habis — refresh halaman jika masih ingin membayar'
                : `Sesi aktif selama ${mins}:${secs}`}
            </div>

            {/* QRIS Card */}
            <div className="ck-qris-card">
              <div className="ck-qris-header">
                <div className="ck-qris-brand">
                  <i className="fa-solid fa-qrcode" />
                  <span>QRIS</span>
                </div>
                <span className="ck-qris-name">SynnnW Studio</span>
              </div>

              {/* QR Code area */}
              <div className="ck-qr-wrap">
                {isExpired && (
                  <div className="ck-qr-expired-overlay">
                    <i className="fa-solid fa-rotate" />
                    <span>QR Kedaluwarsa</span>
                  </div>
                )}
                {/* ── Mock QR SVG — ganti dengan <img src="qris-kamu.png"> ── */}
                <div className="ck-qr-box">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="ck-qr-svg">
                    <rect x="10" y="10" width="55" height="55" rx="6" fill="none" stroke="#1e1b4b" strokeWidth="5"/>
                    <rect x="20" y="20" width="35" height="35" rx="3" fill="#1e1b4b"/>
                    <rect x="135" y="10" width="55" height="55" rx="6" fill="none" stroke="#1e1b4b" strokeWidth="5"/>
                    <rect x="145" y="20" width="35" height="35" rx="3" fill="#1e1b4b"/>
                    <rect x="10" y="135" width="55" height="55" rx="6" fill="none" stroke="#1e1b4b" strokeWidth="5"/>
                    <rect x="20" y="145" width="35" height="35" rx="3" fill="#1e1b4b"/>
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
                    <rect x="82" y="82" width="36" height="36" rx="8" fill="#8b5cf6"/>
                    <text x="100" y="105" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">S</text>
                  </svg>
                  <p className="ck-qr-hint">Scan dengan m-banking atau dompet digital</p>
                  <p className="ck-qr-apps">GoPay · OVO · Dana · BRIVA · M-Banking</p>
                </div>
              </div>

              {/* Amount to pay */}
              {cartData?.total > 0 && (
                <div className="ck-amount-row">
                  <div>
                    <span className="ck-amount-label">Nominal DP (50%)</span>
                    <span className="ck-amount-num">{formatRp(cartData.total / 2)}</span>
                  </div>
                  <div className="ck-amount-badge">
                    <span className="ck-pulse-dot" />
                    Menunggu
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="ck-or-divider">
              <span />
              <p>atau konfirmasi dulu via</p>
              <span />
            </div>

            {/* WhatsApp CTA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ck-btn-wa"
            >
              <i className="fa-brands fa-whatsapp" />
              <div>
                <span className="ck-btn-wa-title">Hubungi Saya via WhatsApp</span>
                <span className="ck-btn-wa-sub">Konfirmasi order · Diskusi · Tanya harga</span>
              </div>
              <i className="fa-solid fa-arrow-up-right ck-btn-wa-arrow" />
            </a>

            <div className="ck-wa-note">
              <i className="fa-solid fa-circle-info" />
              <span>
                Klik tombol di atas untuk membuka WhatsApp dengan detail pesananmu yang sudah terisi otomatis.
                Pembayaran QRIS dapat dilakukan sebelum atau sesudah konfirmasi.
              </span>
            </div>

            {/* Steps */}
            <div className="ck-steps">
              {[
                ['fa-comments', 'Konfirmasi via WhatsApp', 'Klik tombol di atas — detail pesanan sudah terisi otomatis'],
                ['fa-qrcode', 'Scan & Bayar QRIS', `Transfer DP 50%${cartData?.total ? ' (' + formatRp(cartData.total / 2) + ')' : ''} via m-banking atau dompet digital`],
                ['fa-image', 'Kirim Bukti Bayar', 'Screenshot konfirmasi pembayaran ke nomor WhatsApp yang sama'],
                ['fa-rocket', 'Project Dimulai', 'Setelah DP diterima, pengerjaan langsung dimulai sesuai brief'],
              ].map(([icon, title, desc], i) => (
                <div key={i} className="ck-step-item">
                  <div className="ck-step-num">{i + 1}</div>
                  <div className="ck-step-ico"><i className={`fa-solid ${icon}`} /></div>
                  <div>
                    <p className="ck-step-title">{title}</p>
                    <p className="ck-step-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
