// src/components/LoadingScreen.jsx
// Branded loading screen — muncul 1.5s, fade out, then unmount

import { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Inject CSS
    const style = document.createElement('style');
    style.id = 'loading-screen-styles';
    style.textContent = `
      .ls-wrapper {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: #070709;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 24px;
        transition: opacity 0.5s ease, visibility 0.5s ease;
      }
      .ls-wrapper.fade-out {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
      }
      .ls-brand {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 2.2rem;
        font-weight: 600;
        letter-spacing: 0.06em;
        color: #ffffff;
        position: relative;
      }
      .ls-brand span {
        color: #8b5cf6;
      }
      .ls-brand sup {
        font-size: 0.5em;
        position: absolute;
        top: -2px;
        right: -14px;
        color: #8b5cf6;
        font-weight: 700;
        letter-spacing: 0.08em;
      }
      .ls-bar-track {
        width: 160px;
        height: 2px;
        background: rgba(139, 92, 246, 0.15);
        border-radius: 99px;
        overflow: hidden;
      }
      .ls-bar-fill {
        height: 100%;
        border-radius: 99px;
        background: linear-gradient(90deg, #8b5cf6, #a78bfa);
        animation: ls-fill 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      @keyframes ls-fill {
        from { width: 0%; }
        to   { width: 100%; }
      }
      .ls-tagline {
        font-family: 'Outfit', sans-serif;
        font-size: 0.72rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.3);
        animation: ls-fade-in 0.6s ease 0.3s forwards;
        opacity: 0;
      }
      @keyframes ls-fade-in {
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Fade out setelah 1.4s
    const fadeTimer = setTimeout(() => setFadeOut(true), 1400);
    // Unmount setelah fade selesai (1.9s total)
    const removeTimer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      const elem = document.getElementById('loading-screen-styles');
      if (elem) elem.remove();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className={`ls-wrapper${fadeOut ? ' fade-out' : ''}`}>
      <div className="ls-brand">
        SynnnW<span>W</span>
        <sup>ST</sup>
      </div>
      <div className="ls-bar-track">
        <div className="ls-bar-fill" />
      </div>
      <p className="ls-tagline">Loading Studio</p>
    </div>
  );
}
