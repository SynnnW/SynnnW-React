// src/pages/NotFound.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .nf-wrap {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--bg, #070709);
        gap: 16px;
        text-align: center;
        padding: 24px;
      }
      .nf-code {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(5rem, 20vw, 10rem);
        font-weight: 700;
        line-height: 1;
        background: linear-gradient(135deg, #8b5cf6, #a78bfa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .nf-title {
        font-family: 'Outfit', sans-serif;
        font-size: 1.1rem;
        color: rgba(255,255,255,0.5);
        letter-spacing: 0.15em;
        text-transform: uppercase;
      }
      .nf-sub {
        font-family: 'Outfit', sans-serif;
        font-size: 0.9rem;
        color: rgba(255,255,255,0.3);
        max-width: 320px;
        line-height: 1.6;
      }
      .nf-btn {
        margin-top: 8px;
        padding: 12px 28px;
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        color: #fff;
        border: none;
        border-radius: 99px;
        font-family: 'Outfit', sans-serif;
        font-size: 0.85rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      .nf-btn:hover { opacity: 0.85; }

      /* Light mode support */
      [data-theme="light"] .nf-title { color: rgba(28,25,23,0.45); }
      [data-theme="light"] .nf-sub   { color: rgba(28,25,23,0.35); }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div className="nf-wrap">
      <div className="nf-code">404</div>
      <div className="nf-title">Page Not Found</div>
      <p className="nf-sub">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button className="nf-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );
}
