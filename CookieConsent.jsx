// src/components/CookieConsent.jsx
// Indonesian Personal Data Protection Law (UU PDP No. 27/2022) compliance
// Bottom fixed bar with slide animation + localStorage persistence

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieConsent({ lang = 'id' }) {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setTimeout(() => setShow(true), 500);
      setTimeout(() => setVisible(true), 600);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({ accepted: true, timestamp: new Date().toISOString() }));
    setVisible(false);
    setTimeout(() => setShow(false), 300);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({ accepted: false, timestamp: new Date().toISOString() }));
    setVisible(false);
    setTimeout(() => setShow(false), 300);
  };

  if (!show) return null;

  const texts = {
    en: {
      message: 'We use cookies and store data to improve your experience and comply with Indonesian Personal Data Protection Law (UU PDP No. 27/2022). By continuing, you agree to our use of data.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      accept: 'Accept',
      decline: 'Decline',
    },
    id: {
      message: 'Kami menggunakan cookie dan menyimpan data untuk meningkatkan pengalaman kamu sesuai UU Pelindungan Data Pribadi No. 27/2022. Dengan melanjutkan, kamu menyetujui penggunaan data ini.',
      privacy: 'Kebijakan Privasi',
      terms: 'Syarat & Ketentuan',
      accept: 'Terima',
      decline: 'Tolak',
    },
  };

  const t = texts[lang] || texts.id;

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(120%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(120%); opacity: 0; }
        }

        .cc-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9500;
          background: rgba(7, 7, 9, 0.96);
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(20px);
          padding: 20px 32px;
          animation: ${visible ? 'slideUp' : 'slideDown'} 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .cc-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .cc-text {
          flex: 1;
          font-size: 0.9rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.75);
        }

        .cc-links {
          display: inline;
        }

        .cc-link {
          color: #a78bfa;
          text-decoration: none;
          border-bottom: 1px solid rgba(167, 139, 250, 0.3);
          transition: all 0.2s;
        }

        .cc-link:hover {
          color: #c4b5fd;
          border-bottom-color: rgba(196, 181, 253, 0.6);
        }

        .cc-buttons {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }

        .cc-btn {
          padding: 10px 24px;
          border-radius: 99px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s;
          border: none;
          white-space: nowrap;
        }

        .cc-btn-accept {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: #fff;
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
        }

        .cc-btn-accept:hover {
          background: linear-gradient(135deg, #9f66ff, #8d51ff);
          transform: translateY(-2px);
        }

        .cc-btn-decline {
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .cc-btn-decline:hover {
          color: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .cc-banner {
            padding: 16px 20px;
          }

          .cc-content {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .cc-text {
            font-size: 0.85rem;
          }

          .cc-buttons {
            width: 100%;
            justify-content: stretch;
          }

          .cc-btn {
            flex: 1;
          }
        }
      `}</style>

      {show && (
        <div className="cc-banner">
          <div className="cc-content">
            <div className="cc-text">
              {t.message}
              {' '}
              <Link to="/terms#privacy" className="cc-link">{t.privacy}</Link>
              {' / '}
              <Link to="/terms" className="cc-link">{t.terms}</Link>
            </div>
            <div className="cc-buttons">
              <button className="cc-btn cc-btn-accept" onClick={handleAccept}>
                {t.accept}
              </button>
              <button className="cc-btn cc-btn-decline" onClick={handleDecline}>
                {t.decline}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}