// src/hooks/useToast.js
import { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '../components/Toast';

const ToastContext = createContext(null);

/**
 * ToastProvider — wrap App dengan ini di main.jsx
 * Provides addToast function via useToast() hook
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /**
   * addToast(message, type = 'info', duration = 3500)
   * type: 'success' | 'error' | 'warning' | 'info'
   */
  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    // Auto remove setelah duration + animation time
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration + 400);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * Hook untuk pakai toast notification
 * const toast = useToast();
 * toast('Message', 'success');
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx.addToast;
}
