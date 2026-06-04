// src/components/Toast.jsx
import { useEffect, useState } from 'react';

/**
 * Toast configuration per type
 * bg: background color dengan opacity
 * border: border color
 * icon: Unicode icon karakter
 * color: text color untuk icon
 */
const TYPE_CONFIG = {
  success: {
    bg: 'rgba(74, 222, 128, 0.1)',
    border: 'rgba(74, 222, 128, 0.35)',
    icon: '✓',
    color: '#4ade80',
  },
  error: {
    bg: 'rgba(248, 113, 113, 0.1)',
    border: 'rgba(248, 113, 113, 0.35)',
    icon: '✕',
    color: '#f87171',
  },
  warning: {
    bg: 'rgba(251, 191, 36, 0.1)',
    border: 'rgba(251, 191, 36, 0.35)',
    icon: '⚠',
    color: '#fbbf24',
  },
  info: {
    bg: 'rgba(139, 92, 246, 0.1)',
    border: 'rgba(139, 92, 246, 0.35)',
    icon: 'ℹ',
    color: '#a78bfa',
  },
};

/**
 * ToastItem — single notification
 * Auto-animates in, then out sesuai duration
 */
function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const cfg = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;

  useEffect(() => {
    // Trigger enter animation dengan next frame
    requestAnimationFrame(() => setVisible(true));

    // Trigger exit animation sebelum duration habis (300ms sebelumnya)
    const exitTimer = setTimeout(() => setExiting(true), toast.duration - 300);

    // Remove dari DOM setelah animasi keluar selesai
    const removeTimer = setTimeout(() => onRemove(toast.id), toast.duration + 400);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, toast.duration, onRemove]);

  const handleClick = () => {
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 400);
  };

  return (
    <div
      onClick={handleClick}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '14px 16px',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: '14px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        cursor: 'pointer',
        userSelect: 'none',

        // Animation
        transform:
          visible && !exiting
            ? 'translateX(0) scale(1)'
            : 'translateX(calc(100% + 24px)) scale(0.95)',
        opacity: visible && !exiting ? 1 : 0,
        transition:
          'transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease, visibility 0.35s ease',

        maxWidth: '320px',
        minWidth: '240px',
        boxShadow:
          visible && !exiting
            ? `0 10px 40px ${cfg.color}22`
            : `0 4px 12px rgba(0,0,0,0.2)`,
      }}
    >
      {/* Icon */}
      <span
        style={{
          color: cfg.color,
          fontWeight: 700,
          flexShrink: 0,
          fontSize: '1rem',
          lineHeight: 1.2,
          marginTop: '2px',
        }}
      >
        {cfg.icon}
      </span>

      {/* Message */}
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '0.85rem',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.88)',
          lineHeight: '1.5',
          flex: 1,
          wordBreak: 'break-word',
        }}
      >
        {toast.message}
      </span>
    </div>
  );
}

/**
 * ToastContainer — render all toasts (max 5 stacked)
 * Posisi: fixed bottom-right
 */
export function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99990,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
        maxWidth: 'calc(100vw - 48px)',
      }}
    >
      {/* Show max 5 toasts, newest at bottom */}
      {toasts.slice(-5).map((t) => (
        <div
          key={t.id}
          style={{
            pointerEvents: 'auto',
            animation: 'none',
          }}
        >
          <ToastItem toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
