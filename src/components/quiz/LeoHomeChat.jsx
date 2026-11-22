// src/components/quiz/LeoHomeChat.jsx
// Chat Leo AI di bagian paling atas beranda Quiziz: pengguna bisa langsung bertanya tanpa membuka tombol mengambang.
// - Wajah Leo = maskot Pico yang sudah ada, 2D saja (tidak memuat three.js). thinking hanya saat request benar-benar berjalan.
// - Konteks = katalog matkul dari data nyata (data/quiziz/leoHome.js). Server menganggapnya rujukan, bukan perintah.
// - Chip tautan dibuat dari pesan pengguna sendiri + katalog, tidak pernah dari teks balasan model.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Mascot from '../mascot/Mascot';
import { sendChat } from './leoClient';
import { CATALOG_TEXT, linksFor, matchSubjects } from '../../data/quiziz/leoHome';
import '../../styles/leoHome.css';

const COOLDOWN_SEC = 5;
const PAGE_CONTEXT = { halaman: 'beranda', matkul: '', bab: '' };
const GREETING = 'Halo! Tanya apa saja soal materi dan latihan soal di sini, atau minta aku tunjukin harus mulai dari mana.';
const STARTERS = ['Materi apa saja yang sudah ada?', 'Latsol mana yang bisa dikerjakan?', 'Cara pakai Quiziz gimana?'];

// Renderer markdown terbatas: paragraf, daftar, **tebal**, *miring*, `kode`. Tanpa HTML mentah dan tanpa tautan dari model.
const TOKEN = /(\*\*[^*]+?\*\*|\*[^*\s][^*]*?\*|`[^`]+`)/g;
function inline(text) {
  return String(text).split(TOKEN).filter(Boolean).map((p, i) => {
    if (p.length > 4 && p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.length > 2 && p.startsWith('`') && p.endsWith('`')) return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.length > 2 && p.startsWith('*') && p.endsWith('*')) return <em key={i}>{p.slice(1, -1)}</em>;
    return p;
  });
}
function LeoText({ text }) {
  const blocks = [];
  let list = null;
  String(text).split('\n').forEach((raw) => {
    const line = raw.trim();
    const li = line.match(/^([-*•]|\d+[.)])\s+(.*)$/);
    if (li) {
      const ordered = /\d/.test(li[1]);
      if (!list || list.ordered !== ordered) { list = { ordered, items: [] }; blocks.push(list); }
      list.items.push(li[2]);
    } else {
      list = null;
      if (line) blocks.push({ p: line });
    }
  });
  return blocks.map((b, i) => {
    if (!b.items) return <p key={i}>{inline(b.p)}</p>;
    const items = b.items.map((t, j) => <li key={j}>{inline(t)}</li>);
    return b.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
  });
}

const errorText = (e) => (e.status === 401 ? 'Sesi login kamu habis. Muat ulang halaman lalu login lagi.'
  : e.status === 429 ? `Leo lagi sibuk atau kamu terlalu cepat. Coba lagi ${e.retryAfter ? `dalam ${e.retryAfter} detik` : 'sebentar lagi'}.`
  : e.status === 503 ? 'Leo AI belum aktif di server ini.'
  : 'Leo lagi bermasalah. Coba lagi sebentar.');

export default function LeoHomeChat() {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [cool, setCool] = useState(0);
  const [wave, setWave] = useState(false);
  const listRef = useRef(null);
  const alive = useRef(true);
  const seq = useRef(0);
  const waveTimer = useRef(null);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; clearTimeout(waveTimer.current); };
  }, []);

  useEffect(() => {
    if (cool <= 0) return undefined;
    const t = setTimeout(() => setCool((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cool]);

  // Gulir hanya daftar pesan (bukan halaman), dan hanya setelah percakapan dimulai.
  useEffect(() => {
    const el = listRef.current;
    if (el && msgs.length) el.scrollTop = el.scrollHeight;
  }, [msgs, busy]);

  const send = async (override) => {
    const message = (override ?? text).trim();
    if (!message || busy || cool > 0) return;
    const history = msgs.filter((m) => !m.error && !m.failed).slice(-10).map((m) => ({ role: m.role, text: m.text }));
    while (history.length && history[0].role !== 'user') history.shift();
    const uid = (seq.current += 1);
    setMsgs((p) => [...p, { id: uid, role: 'user', text: message }]);
    setText('');
    setBusy(true);
    try {
      const r = await sendChat({ message, history, pageContext: PAGE_CONTEXT, materiText: CATALOG_TEXT });
      if (!alive.current) return;
      const reply = { id: (seq.current += 1), role: 'model', text: r.reply || 'Jawabannya kosong. Coba tanya dengan cara lain.', links: linksFor(matchSubjects(message)) };
      setMsgs((p) => [...p, reply]);
      setWave(true);
      clearTimeout(waveTimer.current);
      waveTimer.current = setTimeout(() => setWave(false), 1800);
    } catch (e) {
      if (!alive.current) return;
      const err = { id: (seq.current += 1), role: 'model', text: errorText(e), error: true };
      setMsgs((p) => [...p.map((m) => (m.id === uid ? { ...m, failed: true } : m)), err]);
      setText((t) => t || message); // pesan yang gagal dikembalikan ke kotak tulis supaya bisa dikirim ulang
    } finally {
      if (alive.current) { setBusy(false); setCool(COOLDOWN_SEC); }
    }
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
  const mood = busy ? 'thinking' : wave ? 'wave' : 'idle';

  return (
    <section className="qz-leo" aria-labelledby="qz-leo-title">
      <div className="qz-leo-head">
        <Mascot mood={mood} size={64} force2D decorative trackPointer={false} className="qz-leo-pico" />
        <div>
          <h1 id="qz-leo-title" className="qz-leo-title">Mau belajar apa hari ini?</h1>
          <p className="qz-leo-lead">Tanya Leo langsung di sini, atau pilih Materi dan Quiziz di bawah.</p>
        </div>
      </div>

      <div className="qz-leo-list" ref={listRef} role="log" aria-label="Percakapan dengan Leo" tabIndex={0}>
        <div className="qz-leo-turn model"><div className="qz-leo-msg model"><LeoText text={GREETING} /></div></div>
        {msgs.map((m) => (
          <div key={m.id} className={`qz-leo-turn ${m.role === 'user' ? 'user' : 'model'}`}>
            <div className={`qz-leo-msg ${m.role === 'user' ? 'user' : 'model'}${m.error ? ' err' : ''}${m.failed ? ' failed' : ''}`}>
              {m.role === 'user' ? m.text : <LeoText text={m.text} />}
            </div>
            {m.links?.length > 0 && (
              <div className="qz-leo-links">
                {m.links.map((l) => <Link key={l.to} to={l.to} className="qz-leo-chip">{l.label}</Link>)}
              </div>
            )}
          </div>
        ))}
        {busy && <div className="qz-leo-status" role="status">Leo lagi nyiapin jawaban…</div>}
      </div>

      {msgs.length === 0 && (
        <div className="qz-leo-starters">
          {STARTERS.map((s) => <button key={s} type="button" className="qz-leo-chip" onClick={() => send(s)}>{s}</button>)}
        </div>
      )}

      <div className="qz-leo-foot">
        <div className="qz-leo-row">
          <textarea className="qz-leo-input" rows={1} value={text} maxLength={2000} onChange={(e) => setText(e.target.value)} onKeyDown={onKey} placeholder="Tulis pertanyaanmu…" aria-label="Pertanyaan untuk Leo" />
          <button type="button" className="qz-leo-send" onClick={() => send()} disabled={busy || cool > 0 || !text.trim()}>
            {busy ? 'Menjawab…' : cool > 0 ? `Tunggu ${cool}s` : 'Kirim'}
          </button>
        </div>
        <p className="qz-leo-note">Dijawab AI (Gemini), bisa keliru. Pesanmu diproses lewat Google, jadi jangan tulis data pribadi.</p>
      </div>
    </section>
  );
}
