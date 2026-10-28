// src/pages/Pengeluaran.jsx
// Pengeluaran Bulanan — sekarang jadi TAB di Admin Dashboard (bukan halaman terpisah).
// Data langsung ke Supabase:
//   • transaksi → tabel `pengeluaran` (nama=keterangan, jumlah, kategori, data.{date,month})
//   • budget    → tabel `settings`, id `pengeluaran-budget-YYYY-MM`, data.amount
// Dua tabel itu dilindungi RLS is_admin(), jadi cuma akun admin yang bisa baca/tulis.

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabaseClient';

/* ══════════════════════════════════════════════════════
   CATEGORIES
══════════════════════════════════════════════════════ */
const CATS = [
  { v:'makanan',    l:'Makanan',      e:'🍔', c:'#f59e0b', bg:'rgba(245,158,11,0.10)', bd:'rgba(245,158,11,0.28)' },
  { v:'transport',  l:'Transport',    e:'🚗', c:'#3b82f6', bg:'rgba(59,130,246,0.10)', bd:'rgba(59,130,246,0.28)' },
  { v:'belanja',    l:'Belanja',      e:'🛍️', c:'#ec4899', bg:'rgba(236,72,153,0.10)', bd:'rgba(236,72,153,0.28)' },
  { v:'digital',    l:'Digital',      e:'📱', c:'var(--accent)', bg:'color-mix(in srgb, var(--accent) 10%, transparent)', bd:'color-mix(in srgb, var(--accent) 28%, transparent)' },
  { v:'hiburan',    l:'Hiburan',      e:'🎮', c:'#10b981', bg:'rgba(16,185,129,0.10)', bd:'rgba(16,185,129,0.28)' },
  { v:'kesehatan',  l:'Kesehatan',    e:'💊', c:'#ef4444', bg:'rgba(239,68,68,0.10)',  bd:'rgba(239,68,68,0.28)'  },
  { v:'pendidikan', l:'Pendidikan',   e:'📚', c:'#06b6d4', bg:'rgba(6,182,212,0.10)',  bd:'rgba(6,182,212,0.28)'  },
  { v:'lainnya',    l:'Lainnya',      e:'💡', c:'var(--accent)', bg:'rgba(167,139,250,0.10)',bd:'rgba(167,139,250,0.28)'},
];

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
const fmtIDR = (n) => `Rp ${Math.abs(Number(n)||0).toLocaleString('id-ID')}`;
const fmtShort = (n) => {
  const a = Math.abs(Number(n)||0);
  if (a>=1e6) return `Rp ${(a/1e6).toFixed(1)}jt`;
  if (a>=1e3) return `Rp ${(a/1e3).toFixed(0)}rb`;
  return `Rp ${a}`;
};
const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const fullMonthLbl = (ym) => { const [y,m]=ym.split('-'); return `${MONTHS_ID[+m-1]} ${y}`; };
const ymNow = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; };
const shiftYM = (ym, d) => { const [y,m]=ym.split('-').map(Number); const dt=new Date(y,m-1+d,1); return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`; };
const todayISO = () => new Date().toISOString().split('T')[0];
const getCat = (v) => CATS.find(c=>c.v===v) || CATS[7];
const fmtAmountInput = (v) => { const n=String(v||'').replace(/\D/g,''); return n ? Number(n).toLocaleString('id-ID') : ''; };

/* ══════════════════════════════════════════════════════
   CSS  (prefix: pe-)
══════════════════════════════════════════════════════ */
const CSS = `
/* ── Page shell ── */
.pe-page { min-height:100vh; background:var(--bg); padding-top:64px; }
.pe-wrap { max-width:1100px; margin:0 auto; padding:0 5vw 120px; }

/* ── Ambient orbs ── */
.pe-orb { position:fixed; border-radius:50%; pointer-events:none; filter:blur(90px); z-index:0; }
.pe-o1 { width:600px;height:600px; background:radial-gradient(circle,color-mix(in srgb, var(--accent) 7%, transparent) 0%,transparent 65%); top:-200px;left:-100px; }
.pe-o2 { width:400px;height:400px; background:radial-gradient(circle,rgba(167,139,250,0.05) 0%,transparent 65%); bottom:200px;right:-80px; }

/* ── Header ── */
.pe-header { position:relative;z-index:1; padding:48px 0 36px; display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:20px; border-bottom:1px solid var(--border); margin-bottom:28px; }
.pe-eyebrow { font-size:.6rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:var(--text-dim);display:block;margin-bottom:10px; }
.pe-title { font-family:var(--font-display);font-size:clamp(2.2rem,5vw,3.8rem);font-weight:300;line-height:1;color:var(--text);letter-spacing:-.02em; }
.pe-title em { font-style:italic;color:var(--accent3); }
.pe-month-nav { display:flex;align-items:center;gap:8px; }
.pe-month-btn { width:36px;height:36px;border-radius:10px;cursor:pointer;background:var(--glass);border:1px solid var(--gborder);color:var(--text-dim);display:flex;align-items:center;justify-content:center;font-size:.88rem;transition:all .22s; }
.pe-month-btn:hover:not(:disabled) { border-color:var(--gborder2);color:var(--text);background:var(--glass2); }
.pe-month-btn:disabled { opacity:.28;cursor:not-allowed; }
.pe-month-lbl { font-family:var(--font-body);font-size:.82rem;font-weight:600;color:var(--text);padding:0 6px;min-width:140px;text-align:center; }

/* ── Alerts ── */
.pe-alert { position:relative;z-index:1;display:flex;align-items:center;gap:12px;padding:13px 18px;border-radius:14px;margin-bottom:20px;font-family:var(--font-body);font-size:.82rem;font-weight:600;border:1px solid;animation:peSlide .35s ease; }
.pe-alert-warn { background:rgba(251,191,36,.07);border-color:rgba(251,191,36,.3);color:#fbbf24; }
.pe-alert-over { background:rgba(239,68,68,.07);border-color:rgba(239,68,68,.3);color:#f87171; }
.pe-alert i { font-size:1rem;flex-shrink:0; }
@keyframes peSlide { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }

/* ── Notification bar ── */
.pe-notif-bar { position:relative;z-index:1;display:flex;align-items:center;gap:10px;padding:11px 16px;border-radius:12px;background:color-mix(in srgb, var(--accent) 6%, transparent);border:1px solid color-mix(in srgb, var(--accent) 20%, transparent);margin-bottom:18px;cursor:pointer;transition:all .22s; }
.pe-notif-bar:hover { border-color:color-mix(in srgb, var(--accent) 35%, transparent);background:color-mix(in srgb, var(--accent) 10%, transparent); }
.pe-notif-bar i { color:var(--accent3);flex-shrink:0;font-size:.9rem; }
.pe-notif-bar p { font-size:.72rem;color:var(--text-dim);flex:1;margin:0;font-family:var(--font-body); }
.pe-notif-bar span { font-size:.65rem;font-weight:700;color:var(--accent3);letter-spacing:.08em;text-transform:uppercase;flex-shrink:0; }

/* ── Budget card ── */
.pe-budget-card { position:relative;z-index:1;background:var(--glass);border:1px solid var(--gborder2);border-radius:24px;padding:30px 34px;margin-bottom:24px;overflow:hidden; }
.pe-bc-glow { position:absolute;top:-80px;right:-60px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb, var(--accent) 9%, transparent) 0%,transparent 65%);pointer-events:none; }
.pe-bc-line { position:absolute;top:0;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,rgba(167,139,250,.3),transparent);pointer-events:none; }
.pe-bc-top { display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:22px;flex-wrap:wrap; }
.pe-bc-info {}
.pe-bc-lbl { font-size:.6rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--text-dim);display:block;margin-bottom:6px; }
.pe-bc-amount { font-family:var(--font-display);font-size:clamp(1.8rem,4vw,3rem);font-weight:300;color:var(--text);line-height:1; }
.pe-bc-empty-amount { font-family:var(--font-display);font-size:1.6rem;font-weight:300;color:var(--text-dim);line-height:1; }
.pe-set-btn { display:inline-flex;align-items:center;gap:7px;padding:9px 18px;background:var(--glass);border:1px solid var(--gborder);color:var(--text-dim);border-radius:10px;font-family:var(--font-body);font-size:.68rem;font-weight:600;cursor:pointer;transition:all .22s;flex-shrink:0; }
.pe-set-btn:hover { border-color:color-mix(in srgb, var(--accent) 35%, transparent);color:var(--accent3);background:color-mix(in srgb, var(--accent) 6%, transparent); }
.pe-stats-row { display:flex;gap:14px;flex-wrap:wrap;margin-bottom:22px; }
.pe-stat-box { flex:1;min-width:110px;padding:15px 16px;border-radius:14px;background:rgba(255,255,255,.025);border:1px solid var(--border);display:flex;flex-direction:column;gap:4px; }
.pe-stat-lbl { font-size:.58rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--text-dim); }
.pe-stat-val { font-family:var(--font-display);font-size:1.5rem;font-weight:300;color:var(--text);line-height:1; }
.pe-stat-val.good { color:#4ade80; }
.pe-stat-val.warn { color:#fbbf24; }
.pe-stat-val.over { color:#f87171; }
.pe-stat-sub { font-size:.6rem;color:var(--text-dim); }
/* Progress */
.pe-prog-track { height:7px;border-radius:99px;background:rgba(255,255,255,.05);overflow:hidden; }
.pe-prog-fill { height:100%;border-radius:99px;transition:width .6s cubic-bezier(.22,1,.36,1), background .4s ease; }
.pe-prog-fill.good { background:linear-gradient(90deg,#4ade80,#22d3ee); }
.pe-prog-fill.warn { background:linear-gradient(90deg,#fbbf24,#f59e0b); }
.pe-prog-fill.over { background:linear-gradient(90deg,#f87171,#ef4444); }
.pe-prog-meta { display:flex;justify-content:space-between;margin-top:7px;font-size:.65rem;color:var(--text-dim);font-family:var(--font-body); }

/* ── Main grid ── */
.pe-main-grid { position:relative;z-index:1;display:grid;grid-template-columns:1fr 330px;gap:24px;align-items:start; }
.pe-sec-title { font-family:var(--font-body);font-size:.6rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--text-dim);margin-bottom:16px; }

/* Category grid */
.pe-cat-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px; }
.pe-cat-item { padding:16px 18px;border-radius:16px;border:1px solid var(--border);background:var(--glass);transition:all .28s;cursor:default;display:flex;flex-direction:column;gap:4px; }
.pe-cat-item:hover { transform:translateY(-2px);background:var(--glass2); }
.pe-cat-e { font-size:1.5rem;margin-bottom:4px; }
.pe-cat-n { font-size:.68rem;font-weight:600;letter-spacing:.04em;font-family:var(--font-body); }
.pe-cat-a { font-family:var(--font-display);font-size:1.2rem;font-weight:400;color:var(--text); }
.pe-cat-c { font-size:.6rem;color:var(--text-dim); }

/* Empty state */
.pe-empty { padding:48px 24px;text-align:center;background:var(--glass);border:1px solid var(--gborder);border-radius:20px; }
.pe-empty i { font-size:2.5rem;color:var(--text-dim);opacity:.2;display:block;margin-bottom:16px; }
.pe-empty p { font-size:.84rem;color:var(--text-dim);margin-bottom:20px; }

/* Expense list card */
.pe-list-card { background:var(--glass);border:1px solid var(--gborder);border-radius:20px;overflow:hidden; }
.pe-list-head { padding:18px 20px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between; }
.pe-list-head-t { font-family:var(--font-body);font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--text); }
.pe-list-count { font-size:.65rem;color:var(--text-dim);background:var(--glass);border:1px solid var(--border);border-radius:99px;padding:2px 10px; }
.pe-list-items { max-height:400px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--gborder) transparent; }
.pe-exp-item { display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid var(--border);transition:background .18s; }
.pe-exp-item:last-child { border-bottom:none; }
.pe-exp-item:hover { background:rgba(255,255,255,.02); }
.pe-exp-dot { width:34px;height:34px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1rem; }
.pe-exp-info { flex:1;min-width:0; }
.pe-exp-desc { font-size:.8rem;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.pe-exp-meta { font-size:.62rem;color:var(--text-dim);margin-top:2px; }
.pe-exp-amount { font-family:var(--font-display);font-size:1.05rem;font-weight:400;color:var(--text);flex-shrink:0; }
.pe-exp-del { width:26px;height:26px;border-radius:7px;border:1px solid transparent;background:transparent;color:var(--text-dim);cursor:pointer;font-size:.75rem;display:flex;align-items:center;justify-content:center;transition:all .18s;flex-shrink:0;opacity:0; }
.pe-exp-item:hover .pe-exp-del { opacity:1; }
.pe-exp-del:hover { background:rgba(239,68,68,.10);border-color:rgba(239,68,68,.25);color:#f87171; }
.pe-list-empty { padding:40px 20px;text-align:center; }
.pe-list-empty i { font-size:1.8rem;color:var(--text-dim);opacity:.2;display:block;margin-bottom:12px; }
.pe-list-empty p { font-size:.78rem;color:var(--text-dim); }

/* ── FAB ── */
.pe-fab { position:fixed;bottom:28px;right:80px;z-index:8000;display:inline-flex;align-items:center;gap:10px;padding:13px 24px;background:var(--accent-g);color:#fff;border:none;border-radius:99px;font-family:var(--font-body);font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 28px color-mix(in srgb, var(--accent) 45%, transparent);transition:all .28s; }
.pe-fab:hover { transform:translateY(-3px);box-shadow:0 14px 40px color-mix(in srgb, var(--accent) 55%, transparent); }
.pe-fab:active { transform:translateY(0);box-shadow:0 4px 16px color-mix(in srgb, var(--accent) 40%, transparent); }

/* ── Modal ── */
.pe-modal-bd { position:fixed;inset:0;z-index:9200;background:rgba(7,7,26,.8);display:flex;align-items:center;justify-content:center;padding:20px;animation:peFadeIn .25s ease; }
@keyframes peFadeIn { from{opacity:0} to{opacity:1} }
.pe-modal { background:var(--glass2);border:1px solid var(--gborder2);border-radius:24px;padding:36px 32px;max-width:480px;width:100%;position:relative;box-shadow:0 24px 80px rgba(0,0,0,.6);animation:peModalIn .32s cubic-bezier(.22,1,.36,1); }
@keyframes peModalIn { from{opacity:0;transform:translateY(16px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
.pe-modal-close { position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:50%;background:var(--glass);border:1px solid var(--gborder);color:var(--text-dim);cursor:pointer;font-size:.88rem;display:flex;align-items:center;justify-content:center;transition:all .2s; }
.pe-modal-close:hover { background:var(--glass2);color:var(--text); }
.pe-modal-title { font-family:var(--font-display);font-size:2rem;font-weight:300;color:var(--text);margin-bottom:6px; }
.pe-modal-title em { font-style:italic;color:var(--accent3); }
.pe-modal-sub { font-size:.78rem;color:var(--text-dim);margin-bottom:26px; }

/* Form */
.pe-fg { display:flex;flex-direction:column;gap:7px;margin-bottom:16px; }
.pe-fl { font-size:.58rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--text-dim); }
.pe-fl-opt { font-weight:400;text-transform:none;letter-spacing:0;opacity:.7; }
.pe-input { background:rgba(255,255,255,.04);border:1px solid var(--gborder);border-radius:12px;padding:12px 15px;font-family:var(--font-body);font-size:.88rem;color:var(--text);outline:none;width:100%;box-sizing:border-box;transition:border-color .25s, background .25s; }
.pe-input::placeholder { color:var(--text-dim);opacity:.4; }
.pe-input:focus { border-color:color-mix(in srgb, var(--accent) 45%, transparent);background:color-mix(in srgb, var(--accent) 4%, transparent); }
.pe-input-idr { position:relative; }
.pe-input-idr::before { content:'Rp';position:absolute;left:15px;top:50%;transform:translateY(-50%);font-size:.8rem;color:var(--text-dim);pointer-events:none;font-family:var(--font-body); }
.pe-input-idr .pe-input { padding-left:36px; }

/* Category pills */
.pe-pills { display:flex;flex-wrap:wrap;gap:7px; }
.pe-pill { display:flex;align-items:center;gap:5px;padding:6px 13px;border-radius:99px;border:1px solid var(--gborder);background:var(--glass);font-family:var(--font-body);font-size:.68rem;font-weight:600;color:var(--text-dim);cursor:pointer;transition:all .2s; }
.pe-pill:hover { border-color:var(--gborder2);color:var(--text); }
.pe-pill.on { font-weight:700;color:#fff;border-color:transparent; }

/* Submit btn */
.pe-sbtn { width:100%;padding:13px;border:none;border-radius:14px;cursor:pointer;background:var(--accent-g);color:#fff;font-family:var(--font-body);font-size:.8rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;transition:all .3s;margin-top:6px;box-shadow:0 6px 24px color-mix(in srgb, var(--accent) 40%, transparent);display:flex;align-items:center;justify-content:center;gap:8px; }
.pe-sbtn:hover:not(:disabled) { transform:translateY(-1px);box-shadow:0 10px 32px color-mix(in srgb, var(--accent) 50%, transparent); }
.pe-sbtn:disabled { opacity:.55;cursor:not-allowed;transform:none; }

/* Error msg */
.pe-err { font-size:.7rem;color:#f87171;display:flex;align-items:center;gap:6px;margin-bottom:12px;font-family:var(--font-body); }

/* Budget hint */
.pe-bhint { font-size:.68rem;color:var(--text-dim);margin-top:7px;line-height:1.6; }

/* ── Login card ── */
.pe-login-wrap { min-height:calc(100vh - 64px);display:flex;align-items:center;justify-content:center;padding:40px 24px; }
.pe-login-card { position:relative;background:var(--glass);border:1px solid var(--gborder2);border-radius:28px;padding:52px 44px;max-width:400px;width:100%;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,.35); }
.pe-login-icon { font-size:2.6rem;display:block;margin-bottom:18px; }
.pe-login-title { font-family:var(--font-display);font-size:2.2rem;font-weight:300;color:var(--text);margin-bottom:10px; }
.pe-login-title em { font-style:italic;color:var(--accent3); }
.pe-login-sub { font-size:.84rem;color:var(--text-dim);line-height:1.75;margin-bottom:30px; }
.pe-gbtn { width:100%;padding:13px 24px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid var(--gborder2);color:var(--text);font-family:var(--font-body);font-size:.84rem;font-weight:700;cursor:pointer;transition:all .28s;display:flex;align-items:center;justify-content:center;gap:12px;}
.pe-gbtn:hover { border-color:color-mix(in srgb, var(--accent) 40%, transparent);background:color-mix(in srgb, var(--accent) 8%, transparent);color:var(--accent3); }
.pe-gbtn:active { transform:scale(.98); }
.pe-login-note { font-size:.68rem;color:var(--text-dim);margin-top:18px;line-height:1.6; }

/* ── Spinner ── */
.pe-spin { width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.2);border-top-color:#fff;animation:peSpin .7s linear infinite;flex-shrink:0; }
@keyframes peSpin { to{transform:rotate(360deg)} }

/* ── Loading center ── */
.pe-loading { min-height:60vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px; }
.pe-loading p { font-size:.75rem;color:var(--text-dim);letter-spacing:.1em;font-family:var(--font-body); }

/* ── Responsive ── */
@media(max-width:900px) {
  .pe-main-grid { grid-template-columns:1fr; }
  .pe-list-items { max-height:320px; }
}
@media(max-width:640px) {
  .pe-fab { right:20px; bottom:22px; padding:12px 18px; font-size:.72rem; }
  .pe-budget-card { padding:22px 20px; }
  .pe-modal { padding:28px 20px; border-radius:20px; }
  .pe-header { padding:32px 0 24px; }
}
/* ── Embedded di Admin Dashboard ── */
.pe-embed { position:relative; min-width:0; }
.pe-embed .pe-header { padding:0 0 22px; }
.pe-embed .pe-fab { right:24px; }
.pe-loaderr { padding:14px 18px; border-radius:14px; margin-bottom:18px; font-size:.8rem; color:#f87171; background:rgba(239,68,68,.07); border:1px solid rgba(239,68,68,.3); }
@media(max-width:900px){
  .pe-embed .pe-fab { bottom:calc(22px + env(safe-area-inset-bottom,0px)); }
  .pe-stats-row { gap:10px; }
  .pe-stat-box { min-width:0; flex:1 1 calc(50% - 10px); }
  .pe-bc-top .pe-set-btn { width:100%; justify-content:center; }
  .pe-month-lbl { min-width:0; }
  .pe-exp-del { opacity:1; }
}
[data-theme="light"] .pe-input { background:rgba(0,0,0,.03);border-color:rgba(90,90,160,.15); }
[data-theme="light"] .pe-input:focus { background:rgba(124,58,237,.04);border-color:rgba(124,58,237,.35); }
[data-theme="light"] .pe-stat-box { background:rgba(0,0,0,.03);border-color:rgba(90,90,160,.12); }
[data-theme="light"] .pe-exp-item:hover { background:rgba(0,0,0,.015); }
[data-theme="light"] .pe-login-card { background:rgba(255,255,255,.65); }
[data-theme="light"] .pe-modal { background:rgba(255,255,255,.80); }
`;

/* ══════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════ */
export default function Pengeluaran() {
  const [loadErr, setLoadErr] = useState('');

  /* ── Data ── */
  const [expenses, setExpenses]     = useState([]);
  const [budget,   setBudget]       = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  /* ── UI ── */
  const [currentMonth, setCurrentMonth] = useState(ymNow);
  const [showAdd,    setShowAdd]        = useState(false);
  const [showBudget, setShowBudget]     = useState(false);
  const [overNotified, setOverNotified] = useState(false);
  const [notifPerm, setNotifPerm]       = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  /* ── Form: add expense ── */
  const [amount,   setAmount]   = useState('');
  const [category, setCategory] = useState('');
  const [desc,     setDesc]     = useState('');
  const [date,     setDate]     = useState(todayISO);
  const [formErr,  setFormErr]  = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* ── Form: budget ── */
  const [budgetInput,  setBudgetInput]  = useState('');
  const [budgetSaving, setBudgetSaving] = useState(false);

  /* ── Inject CSS ── */
  useEffect(() => {
    const el = document.createElement('style');
    el.id = 'pe-styles';
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.getElementById('pe-styles')?.remove();
  }, []);

  /* ── Load data dari Supabase ── */
  const loadExpenses = useCallback(async () => {
    const { data, error } = await supabase
      .from('pengeluaran')
      .select('id, nama, jumlah, kategori, data, created_at')
      .eq('data->>month', currentMonth)
      .order('created_at', { ascending: false });
    if (error) { console.error('[Pengeluaran] load:', error); setLoadErr(error.message); setExpenses([]); return; }
    setLoadErr('');
    setExpenses((data || []).map(r => ({
      id: r.id,
      amount: Number(r.jumlah) || 0,
      category: r.kategori,
      description: r.nama || '',
      date: r.data?.date || String(r.created_at || '').slice(0, 10),
    })));
  }, [currentMonth]);

  useEffect(() => {
    let alive = true;
    setDataLoading(true);
    (async () => {
      const [, b] = await Promise.all([
        loadExpenses(),
        supabase.from('settings').select('data').eq('id', `pengeluaran-budget-${currentMonth}`).maybeSingle(),
      ]);
      if (!alive) return;
      const val = Number(b?.data?.data?.amount) || 0;
      setBudget(val);
      setBudgetInput(String(val));
      setDataLoading(false);
    })();
    return () => { alive = false; };
  }, [currentMonth, loadExpenses]);

  /* ── Computed ── */
  const totalSpent = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const remaining  = budget - totalSpent;
  const pct        = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
  const isOver     = budget > 0 && totalSpent > budget;
  const isWarn     = !isOver && pct >= 80;
  const status     = isOver ? 'over' : isWarn ? 'warn' : 'good';

  const byCategory = CATS
    .map(cat => ({
      ...cat,
      total: expenses.filter(e => e.v === cat.v || e.category === cat.v).reduce((s, e) => s + (Number(e.amount)||0), 0),
      count: expenses.filter(e => e.v === cat.v || e.category === cat.v).length,
    }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total);

  /* ── Over-budget browser notification ── */
  useEffect(() => {
    if (isOver && !overNotified) {
      setOverNotified(true);
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('⚠️ Budget Terlampaui!', {
          body: `Pengeluaran ${fmtIDR(totalSpent)} melebihi budget ${fmtIDR(budget)} untuk ${fullMonthLbl(currentMonth)}`,
          icon: '/favicon.svg',
        });
      }
    }
    if (!isOver) setOverNotified(false);
  }, [isOver, budget, totalSpent, currentMonth, overNotified]);

  /* ── Handlers ── */
  const handleAddExpense = async () => {
    if (!amount || !category) { setFormErr('Nominal dan kategori wajib diisi.'); return; }
    const num = Number(String(amount).replace(/\D/g, ''));
    if (!num || num <= 0) { setFormErr('Masukkan nominal yang valid.'); return; }
    setFormErr('');
    setSubmitting(true);
    try {
      const d = date || todayISO();
      const month = d.slice(0, 7);
      const { error } = await supabase.from('pengeluaran').insert({
        nama: desc.trim(),
        jumlah: num,
        kategori: category,
        data: { date: d, month },
      });
      if (error) throw error;
      setAmount(''); setCategory(''); setDesc(''); setDate(todayISO());
      setShowAdd(false);
      if (month !== currentMonth) setCurrentMonth(month); else await loadExpenses();
    } catch (err) {
      console.error('[Pengeluaran] Add error:', err);
      setFormErr('Gagal menyimpan: ' + (err.message || 'periksa koneksi dan coba lagi.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Hapus pengeluaran ini?')) return;
    const { error } = await supabase.from('pengeluaran').delete().eq('id', id);
    if (error) { console.error(error); window.alert('Gagal menghapus: ' + error.message); return; }
    setExpenses(list => list.filter(e => e.id !== id));
  }, []);

  const handleBudgetSave = async () => {
    const val = Number(String(budgetInput).replace(/\D/g, ''));
    setBudgetSaving(true);
    try {
      const { error } = await supabase.from('settings').upsert({
        id: `pengeluaran-budget-${currentMonth}`,
        data: { amount: val },
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setBudget(val);
      setShowBudget(false);
    } catch (err) {
      console.error('[Pengeluaran] Budget save error:', err);
      window.alert('Gagal menyimpan budget: ' + (err.message || ''));
    } finally { setBudgetSaving(false); }
  };

  const requestNotif = async () => {
    if (typeof Notification === 'undefined') return;
    const perm = await Notification.requestPermission();
    setNotifPerm(perm);
  };

  const handleMonthChange = (delta) => {
    setCurrentMonth(m => shiftYM(m, delta));
    setOverNotified(false);
    setExpenses([]);
  };

  /* ══ RENDER ══ */
  return (
    <div className="pe-embed">
      <div className="pe-wrap-in">

        {loadErr && (
          <div className="pe-loaderr">
            <i className="fa-solid fa-triangle-exclamation" /> Gagal memuat data: {loadErr}
          </div>
        )}

        {/* ── Header ── */}
        <div className="pe-header">
          <div>
            <span className="pe-eyebrow">
              <i className="fa-solid fa-wallet" style={{ marginRight: 7 }} />
              Keuangan Pribadi
            </span>
            <h2 className="pe-title">Pengeluaran <em>Bulanan</em></h2>
          </div>
          <div className="pe-month-nav">
            <button className="pe-month-btn" onClick={() => handleMonthChange(-1)} title="Bulan sebelumnya">
              <i className="fa-solid fa-chevron-left" />
            </button>
            <span className="pe-month-lbl">{fullMonthLbl(currentMonth)}</span>
            <button className="pe-month-btn" onClick={() => handleMonthChange(1)} disabled={currentMonth >= ymNow()} title="Bulan berikutnya">
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>
        </div>

        {/* ── Notification permission ── */}
        {notifPerm === 'default' && (
          <div className="pe-notif-bar" onClick={requestNotif} role="button" tabIndex={0}>
            <i className="fa-solid fa-bell" />
            <p>Aktifkan notifikasi browser untuk alert otomatis saat budget hampir habis.</p>
            <span>Aktifkan →</span>
          </div>
        )}

        {/* ── Alert banner ── */}
        {isOver && (
          <div className="pe-alert pe-alert-over">
            <i className="fa-solid fa-triangle-exclamation" />
            <span>
              Budget terlampaui! Pengeluaran <strong>{fmtIDR(totalSpent)}</strong> melebihi batas <strong>{fmtIDR(budget)}</strong> sebesar <strong>{fmtIDR(totalSpent - budget)}</strong>.
            </span>
          </div>
        )}
        {isWarn && (
          <div className="pe-alert pe-alert-warn">
            <i className="fa-solid fa-circle-exclamation" />
            <span>
              Pengeluaran sudah mencapai <strong>{Math.round(pct)}%</strong> dari budget. Sisanya hanya <strong>{fmtIDR(remaining)}</strong>.
            </span>
          </div>
        )}

        {/* ── Budget Card ── */}
        <div className="pe-budget-card">
          <div className="pe-bc-glow" /><div className="pe-bc-line" />
          <div className="pe-bc-top">
            <div className="pe-bc-info">
              <span className="pe-bc-lbl">Budget {fullMonthLbl(currentMonth)}</span>
              {budget > 0
                ? <span className="pe-bc-amount">{fmtIDR(budget)}</span>
                : <span className="pe-bc-empty-amount">Belum diatur</span>
              }
            </div>
            <button className="pe-set-btn" onClick={() => { setBudgetInput(String(budget)); setShowBudget(true); }}>
              <i className="fa-solid fa-pen" />
              {budget > 0 ? 'Ubah Budget' : 'Set Budget'}
            </button>
          </div>

          <div className="pe-stats-row">
            <div className="pe-stat-box">
              <span className="pe-stat-lbl">Terpakai</span>
              <span className={`pe-stat-val ${status}`}>{fmtShort(totalSpent)}</span>
              <span className="pe-stat-sub">{expenses.length} transaksi</span>
            </div>
            <div className="pe-stat-box">
              <span className="pe-stat-lbl">Sisa</span>
              <span className={`pe-stat-val ${budget > 0 ? status : ''}`}>
                {budget > 0 ? (isOver ? `−${fmtShort(Math.abs(remaining))}` : fmtShort(remaining)) : '—'}
              </span>
              <span className="pe-stat-sub">{budget > 0 ? `${Math.round(pct)}% terpakai` : 'Set budget dulu'}</span>
            </div>
            <div className="pe-stat-box">
              <span className="pe-stat-lbl">Terbesar</span>
              <span className="pe-stat-val">
                {expenses.length > 0 ? fmtShort(Math.max(...expenses.map(e => e.amount || 0))) : '—'}
              </span>
              <span className="pe-stat-sub">transaksi tertinggi</span>
            </div>
          </div>

          {budget > 0 && (
            <>
              <div className="pe-prog-track">
                <div className={`pe-prog-fill ${status}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="pe-prog-meta">
                <span>{fmtIDR(totalSpent)} digunakan</span>
                <span>dari {fmtIDR(budget)}</span>
              </div>
            </>
          )}
        </div>

        {/* ── Main grid ── */}
        <div className="pe-main-grid">

          {/* LEFT: Category breakdown */}
          <div>
            <p className="pe-sec-title">Kategori Pengeluaran</p>
            {dataLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <div className="pe-spin" style={{ width: 24, height: 24, borderWidth: 2 }} />
              </div>
            ) : byCategory.length > 0 ? (
              <div className="pe-cat-grid">
                {byCategory.map(cat => (
                  <div
                    key={cat.v}
                    className="pe-cat-item"
                    style={{ borderColor: cat.bd, background: cat.bg }}
                  >
                    <span className="pe-cat-e">{cat.e}</span>
                    <span className="pe-cat-n" style={{ color: cat.c }}>{cat.l}</span>
                    <span className="pe-cat-a">{fmtIDR(cat.total)}</span>
                    <span className="pe-cat-c">{cat.count}× transaksi</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pe-empty">
                <i className="fa-solid fa-receipt" />
                <p>Belum ada pengeluaran di bulan ini.</p>
                <button
                  className="pe-sbtn"
                  style={{ maxWidth: 220, margin: '0 auto' }}
                  onClick={() => setShowAdd(true)}
                >
                  <i className="fa-solid fa-plus" /> Tambah Pertama
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Expense list */}
          <div>
            <p className="pe-sec-title">Riwayat Transaksi</p>
            <div className="pe-list-card">
              <div className="pe-list-head">
                <span className="pe-list-head-t">Semua Pengeluaran</span>
                <span className="pe-list-count">{expenses.length}</span>
              </div>
              <div className="pe-list-items">
                {dataLoading ? (
                  <div style={{ padding: 32, display: 'flex', justifyContent: 'center' }}>
                    <div className="pe-spin" style={{ width: 22, height: 22, borderWidth: 2 }} />
                  </div>
                ) : expenses.length === 0 ? (
                  <div className="pe-list-empty">
                    <i className="fa-solid fa-inbox" />
                    <p>Belum ada transaksi</p>
                  </div>
                ) : (
                  expenses.map(exp => {
                    const cat = getCat(exp.category);
                    return (
                      <div key={exp.id} className="pe-exp-item">
                        <div className="pe-exp-dot" style={{ background: cat.bg, border: `1px solid ${cat.bd}` }}>
                          {cat.e}
                        </div>
                        <div className="pe-exp-info">
                          <div className="pe-exp-desc">{exp.description || cat.l}</div>
                          <div className="pe-exp-meta">{cat.l} · {exp.date || ''}</div>
                        </div>
                        <span className="pe-exp-amount">{fmtIDR(exp.amount)}</span>
                        <button className="pe-exp-del" onClick={() => handleDelete(exp.id)} title="Hapus">
                          <i className="fa-solid fa-xmark" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAB ── */}
      <button className="pe-fab" onClick={() => setShowAdd(true)}>
        <i className="fa-solid fa-plus" /> Tambah
      </button>

      {/* ══ MODAL: Add Expense ══ */}
      {showAdd && (
        <div className="pe-modal-bd" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="pe-modal">
            <button className="pe-modal-close" onClick={() => setShowAdd(false)}>
              <i className="fa-solid fa-xmark" />
            </button>
            <h2 className="pe-modal-title">Tambah <em>Pengeluaran</em></h2>
            <p className="pe-modal-sub">Catat pengeluaranmu sekarang.</p>

            {/* Nominal */}
            <div className="pe-fg">
              <label className="pe-fl">Nominal <span style={{ color: 'rgba(239,68,68,.7)' }}>*</span></label>
              <div className="pe-input-idr">
                <input
                  className="pe-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={fmtAmountInput(amount)}
                  onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>
            </div>

            {/* Kategori */}
            <div className="pe-fg">
              <label className="pe-fl">Kategori <span style={{ color: 'rgba(239,68,68,.7)' }}>*</span></label>
              <div className="pe-pills">
                {CATS.map(cat => (
                  <button
                    key={cat.v}
                    type="button"
                    className={`pe-pill ${category === cat.v ? 'on' : ''}`}
                    style={category === cat.v ? { background: cat.c, borderColor: cat.c } : {}}
                    onClick={() => setCategory(cat.v)}
                  >
                    {cat.e} {cat.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Keterangan */}
            <div className="pe-fg">
              <label className="pe-fl">
                Keterangan <span className="pe-fl-opt">— opsional</span>
              </label>
              <input
                className="pe-input"
                type="text"
                placeholder="Makan siang, bensin, tagihan, dll..."
                value={desc}
                onChange={e => setDesc(e.target.value)}
                maxLength={80}
              />
            </div>

            {/* Tanggal */}
            <div className="pe-fg">
              <label className="pe-fl">Tanggal</label>
              <input
                className="pe-input"
                type="date"
                value={date}
                max={todayISO()}
                onChange={e => setDate(e.target.value)}
              />
            </div>

            {formErr && (
              <p className="pe-err">
                <i className="fa-solid fa-triangle-exclamation" /> {formErr}
              </p>
            )}

            <button className="pe-sbtn" onClick={handleAddExpense} disabled={submitting}>
              {submitting
                ? <><span className="pe-spin" /> Menyimpan...</>
                : <><i className="fa-solid fa-plus" /> Simpan Pengeluaran</>
              }
            </button>
          </div>
        </div>
      )}

      {/* ══ MODAL: Set Budget ══ */}
      {showBudget && (
        <div className="pe-modal-bd" onClick={e => e.target === e.currentTarget && setShowBudget(false)}>
          <div className="pe-modal" style={{ maxWidth: 380 }}>
            <button className="pe-modal-close" onClick={() => setShowBudget(false)}>
              <i className="fa-solid fa-xmark" />
            </button>
            <h2 className="pe-modal-title">Set <em>Budget</em></h2>
            <p className="pe-modal-sub">Budget untuk {fullMonthLbl(currentMonth)}.</p>

            <div className="pe-fg">
              <label className="pe-fl">Nominal Budget</label>
              <div className="pe-input-idr">
                <input
                  className="pe-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={fmtAmountInput(budgetInput)}
                  onChange={e => setBudgetInput(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>
              <p className="pe-bhint">
                Kamu akan dapat peringatan saat pengeluaran mencapai 80% dari budget ini.
                Atur ulang budget setiap bulan sesuai kondisimu.
              </p>
            </div>

            <button className="pe-sbtn" onClick={handleBudgetSave} disabled={budgetSaving}>
              {budgetSaving
                ? <><span className="pe-spin" /> Menyimpan...</>
                : <><i className="fa-solid fa-check" /> Simpan Budget</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
