// src/components/SaranWebsite.jsx
// Form saran & masukan untuk website — dikirim via Telegram

import { useState } from 'react';

const CSS = `
.sw-section {
  padding: 80px 48px;
  background: linear-gradient(180deg, var(--bg3, #0d0d1a) 0%, var(--bg, #07070f) 100%);
}
.sw-inner { max-width: 640px; margin: 0 auto; }
.sw-label {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--accent, #8b7bff);
  margin-bottom: 14px; display: block;
}
.sw-title {
  font-size: clamp(2rem, 5vw, 2.8rem); font-weight: 800;
  line-height: 1.15; margin-bottom: 12px;
  color: var(--text, #e0e0ea);
}
.sw-desc {
  color: var(--text-dim, #8888a0); font-size: 0.95rem;
  line-height: 1.6; margin-bottom: 32px;
}
.sw-form { display: flex; flex-direction: column; gap: 14px; }
.sw-input-row { display: flex; gap: 12px; }
.sw-input {
  width: 100%; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
  padding: 12px 16px; color: var(--text, #e0e0ea);
  font-size: 0.9rem; font-family: inherit; outline: none;
  transition: border-color 0.2s;
}
.sw-input:focus { border-color: rgba(139,123,255,0.5); }
.sw-textarea { min-height: 120px; resize: vertical; }
.sw-btn {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #8b7bff, #6d5df0);
  border: none; border-radius: 12px; padding: 12px 28px;
  color: #fff; font-size: 0.9rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 8px 24px rgba(139,123,255,0.35);
}
.sw-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(139,123,255,0.5); }
.sw-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.sw-success {
  display: flex; align-items: center; gap: 10px;
  background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
  border-radius: 12px; padding: 14px 18px;
  color: #4ade80; font-size: 0.9rem; font-weight: 600;
}
.sw-note { font-size: 0.75rem; color: var(--text-dim, #8888a0); margin-top: 4px; }
@media (max-width: 768px) {
  .sw-section { padding: 60px 24px; }
  .sw-input-row { flex-direction: column; }
}
`;

export default function SaranWebsite() {
  const [name,    setName]    = useState('');
  const [saran,   setSaran]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [err,     setErr]     = useState('');

  const handleSend = async () => {
    if (!saran.trim()) return;
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:    'saran_website',
          name:    name.trim() || 'Anonim',
          message: saran.trim(),
        }),
      });
      const data = await res.json();
      if (data.ok) { setSent(true); setName(''); setSaran(''); }
      else setErr('Gagal kirim: ' + data.error);
    } catch (e) { setErr('Gagal kirim. Coba lagi ya!'); }
    setLoading(false);
  };

  return (
    <>
      <style>{CSS}</style>
      <section className="sw-section" id="sec-saran">
        <div className="sw-inner">
          <span className="sw-label">💬 Feedback</span>
          <h2 className="sw-title">Punya Saran?</h2>
          <p className="sw-desc">
            Ada fitur yang pengen ditambahin? Desain yang perlu diperbaiki?
            Atau sekedar mau kasih semangat? Tulis aja langsung di sini —
            langsung masuk ke Telegram 🚀
          </p>

          {sent ? (
            <div className="sw-success">
              ✅ Saran terkirim! Makasih ya, bakal aku pertimbangin 🙏
            </div>
          ) : (
            <div className="sw-form">
              <div className="sw-input-row">
                <input
                  className="sw-input"
                  type="text"
                  placeholder="Nama kamu (opsional)"
                  value={name}
                  maxLength={50}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <textarea
                className="sw-input sw-textarea"
                placeholder="Tulis saran, masukan, atau kritik kamu di sini... 💡"
                value={saran}
                maxLength={1000}
                onChange={e => setSaran(e.target.value)}
              />
              {err && <div style={{ color: '#f87171', fontSize: '0.82rem' }}>{err}</div>}
              <button className="sw-btn" onClick={handleSend} disabled={loading || !saran.trim()}>
                {loading ? '⏳ Mengirim...' : '📨 Kirim ke Telegram'}
              </button>
              <div className="sw-note">Pesanmu langsung diterima, tidak ada data yang disimpan ke server.</div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
