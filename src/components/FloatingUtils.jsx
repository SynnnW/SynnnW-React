// src/components/FloatingUtils.jsx
import { useState, useEffect } from 'react';

/**
 * FloatingUtils — 2 floating buttons:
 * 1. WhatsApp (left-bottom) — always visible
 * 2. Back to Top (right-bottom) — visible after scroll 400px
 *
 * Hanya muncul di halaman publik (cek isFullscreen di App.jsx)
 * CSS inject via useEffect
 */
export default function FloatingUtils() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    // Inject CSS
    const style = document.createElement('style');
    style.id = 'floating-utils-styles';
    style.textContent = `
      .fu-container {
        position: fixed;
        bottom: 28px;
        z-index: 9000;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      }

      /* WhatsApp — kiri bawah */
      .fu-wa {
        left: 24px;
      }

      /* Back to Top — kanan bawah */
      .fu-top {
        right: 24px;
      }

      /* Button base */
      .fu-btn {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                    opacity 0.25s ease,
                    box-shadow 0.25s ease;
        text-decoration: none;
        font-size: 1.25rem;
        pointer-events: auto;
        flex-shrink: 0;
      }

      .fu-btn:hover {
        transform: translateY(-4px) scale(1.1);
      }

      .fu-btn:active {
        transform: translateY(-2px) scale(1.05);
      }

      /* WhatsApp button */
      .fu-btn.wa-btn {
        background: #25d366;
        color: #fff;
        box-shadow: 0 6px 28px rgba(37, 211, 102, 0.38);
        font-weight: 600;
      }

      .fu-btn.wa-btn:hover {
        box-shadow: 0 8px 36px rgba(37, 211, 102, 0.52);
        background: #20ba5c;
      }

      /* Back to Top button */
      .fu-btn.top-btn {
        background: rgba(139, 92, 246, 0.12);
        border: 1.5px solid rgba(139, 92, 246, 0.32);
        color: #a78bfa;
        box-shadow: 0 4px 16px rgba(139, 92, 246, 0.16);
        opacity: 0;
        transform: translateY(12px) scale(0.8);
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                    box-shadow 0.3s ease;
      }

      .fu-btn.top-btn.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      .fu-btn.top-btn:hover {
        background: rgba(139, 92, 246, 0.18);
        border-color: rgba(139, 92, 246, 0.45);
        box-shadow: 0 6px 24px rgba(139, 92, 246, 0.28);
      }

      /* Tooltip — hover */
      .fu-btn::before {
        content: attr(data-tip);
        position: absolute;
        right: 64px;
        bottom: 50%;
        transform: translateY(50%);
        background: rgba(7, 7, 9, 0.88);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        color: rgba(255, 255, 255, 0.9);
        font-family: 'Outfit', sans-serif;
        font-size: 0.72rem;
        font-weight: 600;
        white-space: nowrap;
        padding: 7px 11px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        letter-spacing: 0.05em;
        z-index: -1;
      }

      .fu-btn:hover::before {
        opacity: 1;
      }

      /* Mobile — smaller buttons, no tooltip */
      @media (max-width: 480px) {
        .fu-container {
          bottom: 20px;
        }

        .fu-wa {
          left: 18px;
        }

        .fu-top {
          right: 18px;
        }

        .fu-btn {
          width: 46px;
          height: 46px;
          font-size: 1rem;
        }

        .fu-btn::before {
          display: none;
        }

        .fu-btn:hover {
          transform: translateY(-3px) scale(1.08);
        }
      }
    `;
    document.head.appendChild(style);

    // Scroll listener untuk show/hide back-to-top
    const handleScroll = () => {
      setShowTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.getElementById('floating-utils-styles')?.remove();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* WhatsApp Button — kiri bawah, selalu visible */}
      <div className="fu-container fu-wa">
        <a
          href="https://wa.me/6281252790018"
          target="_blank"
          rel="noopener noreferrer"
          className="fu-btn wa-btn"
          data-tip="Chat WhatsApp"
          aria-label="Contact via WhatsApp"
          title="Chat WhatsApp"
        >
          <i className="fa-brands fa-whatsapp" />
        </a>
      </div>

      {/* Back to Top Button — kanan bawah, visible after scroll 400px */}
      <div className="fu-container fu-top">
        <button
          className={`fu-btn top-btn${showTop ? ' visible' : ''}`}
          onClick={scrollToTop}
          data-tip="Back to top"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <i className="fa-solid fa-arrow-up" />
        </button>
      </div>
    </>
  );
}
