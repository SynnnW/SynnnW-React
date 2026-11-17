// src/components/quiz/LeoAIChat.jsx
// Widget chat mengambang "Leo AI" untuk halaman Materi.
// (Sengaja bernama eksplisit: tidak ada hubungannya dengan LeoMascot / LeoNotch.)
// - Konteks halaman (matkul/bab) + isi bab yang sedang dibuka dikirim ke server sebagai grounding, bukan scraping DOM.
// - Cooldown 5 detik dihitung SETELAH balasan penuh diterima; server juga membatasi laju.
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { sendChat } from './leoClient';
import { Inline } from './MateriKit';
import '../../styles/leoAI.css';

const COOLDOWN_SEC = 5;
const WELCOME = 'Halo, aku Leo AI. Tanya apa saja soal bab yang lagi kamu buka, nanti kujawab berdasarkan materinya.';

export default function LeoAIChat({ pageContext, materiText }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [cool, setCool] = useState(0);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (cool <= 0) return undefined;
    const t = setTimeout(() => setCool((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cool]);

  useEffect(() => { listRef.current?.scrollTo?.({ top: listRef.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' }); }, [msgs, busy, open, reduce]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async () => {
    const message = text.trim();
    if (!message || busy || cool > 0) return;
    const history = msgs.filter((m) => !m.error).slice(-10).map((m) => ({ role: m.role, text: m.text }));
    setMsgs((p) => [...p, { role: 'user', text: message }]);
    setText(''); setBusy(true);
    try {
      const r = await sendChat({ message, history, pageContext, materiText });
      setMsgs((p) => [...p, { role: 'model', text: r.reply || 'Maaf, jawabannya kosong. Coba tanya dengan cara lain.' }]);
    } catch (e) {
      const m = e.status === 401 ? 'Sesi login kamu habis. Muat ulang halaman lalu login lagi.'
        : e.status === 429 ? `Leo AI lagi sibuk atau kamu terlalu cepat. Coba lagi ${e.retryAfter ? `dalam ${e.retryAfter} detik` : 'sebentar lagi'}.`
        : e.status === 503 ? 'Leo AI belum aktif di server ini.'
        : 'Leo AI lagi bermasalah. Coba lagi sebentar.';
      setMsgs((p) => [...p, { role: 'model', text: m, error: true }]);
    } finally {
      setBusy(false); setCool(COOLDOWN_SEC);
    }
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
  const disabled = busy || cool > 0 || !text.trim();
  const anim = reduce ? {} : { initial: { opacity: 0, y: 14, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 10, scale: 0.97 }, transition: { duration: 0.18 } };

  return (
    <>
      <button className="leo-fab" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Tutup Leo AI' : 'Buka Leo AI'} aria-expanded={open}>
        <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" /> Leo AI
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="leo-panel" role="dialog" aria-label="Leo AI" {...anim}>
            <div className="leo-head">
              <div><b>Leo AI</b><small>{pageContext?.bab ? `Bab: ${pageContext.bab}` : (pageContext?.matkul || 'Asisten belajar')}</small></div>
              <button className="leo-x" onClick={() => setOpen(false)} aria-label="Tutup">✕</button>
            </div>
            <div className="leo-list" ref={listRef} aria-live="polite">
              <div className="leo-msg model">{WELCOME}</div>
              {msgs.map((m, i) => (
                <div key={i} className={`leo-msg ${m.role === 'user' ? 'user' : 'model'}${m.error ? ' err' : ''}`}>
                  {m.role === 'user' ? m.text : <Inline text={m.text} />}
                </div>
              ))}
              {busy && <div className="leo-typing">Leo AI lagi mengetik…</div>}
            </div>
            <div className="leo-foot">
              <div className="leo-row">
                <textarea ref={inputRef} className="leo-input" rows={1} value={text} maxLength={2000} onChange={(e) => setText(e.target.value)} onKeyDown={onKey} placeholder="Tulis pertanyaanmu…" aria-label="Pesan untuk Leo AI" />
                <button className="leo-send" onClick={send} disabled={disabled}>{cool > 0 ? `Tunggu ${cool}s` : 'Kirim'}</button>
              </div>
              <div className="leo-note">Dijawab oleh AI (Gemini), bisa keliru. Pesanmu diproses lewat Google, jadi jangan tulis data pribadi.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
