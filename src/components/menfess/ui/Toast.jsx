import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const Ctx = createContext(null);
export function useMfToast() { return useContext(Ctx) || { show: () => {} }; }

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const timers = useRef(new Map());
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id)); timers.current.delete(id);
    setItems(p => p.filter(t => t.id !== id));
  }, []);

  const show = useCallback((msg, kind = 'info', ms = 3500) => {
    const id = ++idRef.current;
    setItems(p => [...p.slice(-2), { id, msg, kind }]);
    timers.current.set(id, setTimeout(() => dismiss(id), ms));
    return id;
  }, [dismiss]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);

  return (
    <Ctx.Provider value={{ show, dismiss }}>
      {children}
      <div className="mf-toasts" aria-live="polite" role="status">
        {items.map(t => <div key={t.id} className={`mf-toast ${t.kind}`}>{t.msg}</div>)}
      </div>
    </Ctx.Provider>
  );
}
