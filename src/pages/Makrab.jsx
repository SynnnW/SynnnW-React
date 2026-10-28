import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/dashboard.css';
import { supabase, auth } from '@/supabaseClient';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from '@/lib/authCompat';

/* ══════════════════════════════════════════════════════════════
   MAKRAB 2026 — koordinasi divisi PDD (1 admin + anggota)
   Halaman privat: tidak ada di navbar, tidak diindeks.
   Peran dari tabel makrab_members (RLS), BUKAN dari users.role.
   SQL: supabase/makrab.sql
══════════════════════════════════════════════════════════════ */

/* ─── TEMA ────────────────────────────────────────────────────
   Semua warna/font/radius/spacing ada di blok :root ini.
   Tema resmi nanti cukup mengganti nilai di sini.            */
const THEME_CSS = `
/* Tokens come from src/styles/dashboard.css (.dash). --mk-* are aliases so existing classes keep working. */
.mk {
  --mk-font: var(--d-font);
  --mk-bg: var(--d-bg);
  --mk-surface: var(--d-surface);
  --mk-surface-2: var(--d-surface-2);
  --mk-line: color-mix(in srgb, var(--d-text) 12%, transparent);
  --mk-ink: var(--d-text);
  --mk-ink-2: var(--d-muted);
  --mk-ink-3: color-mix(in srgb, var(--d-text) 55%, transparent);

  --mk-accent: var(--d-accent);
  --mk-accent-hover: color-mix(in srgb, var(--d-accent) 88%, #fff);
  --mk-accent-ink: var(--d-on-accent);
  --mk-accent-text: var(--d-accent);
  --mk-accent-soft: color-mix(in srgb, var(--d-accent) 10%, var(--d-surface));

  --mk-ok: var(--d-ok);
  --mk-warn: var(--d-warn);
  --mk-bad: var(--d-bad);
  --mk-info: var(--d-info);

  --mk-tile-1: var(--d-surface);
  --mk-tile-2: var(--d-surface);
  --mk-tile-3: var(--d-surface);
  --mk-tile-4: var(--d-surface);

  --mk-toast-bg: var(--d-text);
  --mk-toast-ink: var(--d-bg);
  --mk-overlay: rgba(0, 0, 0, 0.6);
  --mk-shadow: none;

  --mk-radius: 4px;
  --mk-radius-sm: 3px;
  --mk-gap: 16px;
  --mk-tap: 44px;
  --mk-nav-h: 60px;
  --mk-side-w: 260px;
}
/* Light: lime is a fill only, never text/link colour */
.mk[data-theme="light"] {
  --mk-accent-text: #0E0D0B;
  --mk-accent-hover: color-mix(in srgb, var(--d-accent) 80%, #000);
  --mk-accent-soft: color-mix(in srgb, var(--d-accent) 40%, var(--d-surface));
  --mk-ink-3: color-mix(in srgb, var(--d-text) 58%, transparent);
}
`;

const OVERRIDE_CSS = `
.mk { font-size: 14px; }
.mk h1, .mk h2, .mk h3 { font-family: var(--d-font); font-weight: 600; letter-spacing: -0.01em; }
.mk-top h1 { font-size: 1rem; }
.mk-brand b { font-family: var(--d-display); font-weight: 600; }
.mk-side { background: var(--mk-surface); }
.mk-nav-btn { position: relative; min-height: 38px; transition: background-color 0.12s ease-out, color 0.12s ease-out; }
.mk-nav-btn:hover { background: var(--d-hover); color: var(--mk-ink); }
.mk-nav-btn.on { background: var(--d-hover); color: var(--mk-ink); font-weight: 500; }
.mk-nav-btn.on::before { content: ''; position: absolute; left: 0; top: 7px; bottom: 7px; width: 2px; background: var(--mk-accent); }
.mk-nav-btn em, .mk-dot, .mk-check.done span { color: var(--mk-accent-ink); }
.mk-bottom { background: var(--mk-surface); }
.mk-bottom button { transition: color 0.12s ease-out; }
.mk-bottom button.on { color: var(--mk-ink); }
.mk-btn { transition: background-color 0.12s ease-out, border-color 0.12s ease-out, color 0.12s ease-out; }
.mk-btn:hover { background: var(--d-hover); border-color: var(--d-border-strong); }
.mk-btn--primary:hover { background: var(--mk-accent-hover); border-color: var(--mk-accent-hover); }
.mk input:focus-visible, .mk select:focus-visible, .mk textarea:focus-visible { outline: 2px solid var(--mk-accent); outline-offset: 0; }
.mk[data-theme="light"] :focus-visible { outline-color: var(--d-text); }
.mk-row { min-height: 44px; align-items: center; padding: 8px 0; transition: background-color 0.12s ease-out; }
.mk-row:hover { background: var(--d-hover); }
.mk-meta { font-family: var(--d-mono); font-size: 12px; }
.mk-st::before { width: 8px; height: 8px; border-radius: 50%; }
.mk-check span { border-radius: 50%; transition: background-color 0.12s ease-out, border-color 0.12s ease-out; }
.mk-tile { border: 1px solid var(--mk-line); background: var(--mk-surface) !important; min-height: 92px; }
.mk-tile b { font-family: var(--d-mono); font-weight: 500; }
.mk-tile span { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--mk-ink-3); }
.mk-bar, .mk-bar i { border-radius: 1px; }
.mk-money, .mk-exp b { font-family: var(--d-mono); }
.mk-sheet { border: 1px solid var(--d-border-strong); border-radius: 4px 4px 0 0; box-shadow: none; background: var(--mk-surface); animation: mkUp 0.16s ease-out; }
.mk-sheet-h { background: var(--mk-surface); }
.mk-toast { box-shadow: none; animation: mkUp 0.16s ease-out; }
.mk-grip { border-radius: 1px; }
@keyframes mkUp { from { transform: translateY(8px); opacity: 0; } to { transform: none; opacity: 1; } }
@media (min-width: 900px) { .mk-sheet { max-width: 560px; border-radius: 4px; } }
.mk-chipline span, .mk-pill { border-radius: 3px; font-family: var(--d-mono); font-size: 11px; }
.mk-review { border-radius: 0 3px 3px 0; border-left-width: 2px; }
.mk-btn, .mk-nav-btn, .mk-bottom button, .mk-chips button { min-height: 40px; }
@media (prefers-reduced-motion: reduce) { .mk * { transition: none !important; } .mk-sheet, .mk-toast { animation: none; } }
`;

const CSS = `
.mk { font-family: var(--mk-font); background: var(--mk-bg); color: var(--mk-ink); min-height: 100dvh; font-size: 15px; line-height: 1.5; -webkit-text-size-adjust: 100%; }
.mk *, .mk *::before, .mk *::after { box-sizing: border-box; }
.mk :where(button, input, select, textarea) { font: inherit; color: inherit; }
.mk :where(button) { cursor: pointer; }
.mk :where(a) { color: var(--mk-accent-text); }
.mk h1, .mk h2, .mk h3 { font-family: var(--mk-font); margin: 0; font-weight: 500; letter-spacing: -0.015em; }
.mk p { margin: 0; }
.mk :focus-visible { outline: 2px solid var(--mk-accent); outline-offset: 2px; }

/* ── Kerangka ── */
.mk-shell { display: block; }
.mk-side { display: none; }
.mk-top {
  position: sticky; top: 0; z-index: 20; display: flex; align-items: center; gap: 10px;
  padding: calc(10px + env(safe-area-inset-top)) 16px 10px; background: var(--mk-bg); border-bottom: 1px solid var(--mk-line);
}
.mk-top h1 small { font-size: 0.8rem; font-weight: 400; color: var(--mk-ink-3); }
.mk-top h1 { flex: 1; font-size: 1.15rem; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mk-main { padding: 18px 16px calc(var(--mk-nav-h) + 32px + env(safe-area-inset-bottom)); max-width: 900px; margin: 0 auto; }
.mk-bottom {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 30; display: flex; background: var(--mk-surface);
  border-top: 1px solid var(--mk-line); padding-bottom: env(safe-area-inset-bottom);
}
.mk-bottom button {
  position: relative; flex: 1; min-height: var(--mk-nav-h); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
  border: 0; background: none; font-size: 11px; color: var(--mk-ink-3);
}
.mk-bottom button i { font-size: 17px; }
.mk-bottom button.on { color: var(--mk-accent-text); }
.mk-bottom button.on::before { content: ''; position: absolute; top: 0; left: 28%; right: 28%; height: 2px; background: var(--mk-accent); }

@media (min-width: 900px) {
  .mk-top-out { display: none; }
  .mk-shell { display: grid; grid-template-columns: var(--mk-side-w) 1fr; }
  .mk-side {
    display: flex; flex-direction: column; gap: 4px; position: sticky; top: 0; height: 100dvh; padding: 22px 14px;
    border-right: 1px solid var(--mk-line); background: var(--mk-surface-2);
  }
  .mk-bottom { display: none; }
  .mk-top { padding: 14px 32px; }
  .mk-main { padding: 28px 32px 72px; }
}

/* ── Sidebar ── */
.mk-brand { padding: 0 10px 18px; }
.mk-brand b { display: block; font-size: 1.1rem; font-weight: 600; letter-spacing: -0.02em; }
.mk-brand span { font-size: 12px; color: var(--mk-ink-3); }
.mk-nav-btn {
  display: flex; align-items: center; gap: 12px; min-height: var(--mk-tap); padding: 0 12px; border: 0; background: none; text-align: left;
  border-radius: var(--mk-radius-sm); color: var(--mk-ink-2);
}
.mk-nav-btn i { width: 18px; text-align: center; }
.mk-nav-btn:hover { background: rgba(122, 31, 43, 0.06); }
.mk-nav-btn.on { background: var(--mk-accent-soft); color: var(--mk-accent-text); font-weight: 500; }
.mk-nav-btn em { margin-left: auto; font-style: normal; font-size: 12px; min-width: 20px; text-align: center; padding: 1px 6px; border-radius: 99px; background: var(--mk-accent); color: #fff; }
.mk-side-foot { margin-top: auto; padding: 12px 10px 0; border-top: 1px solid var(--mk-line); font-size: 13px; }
.mk-side-foot small { display: block; color: var(--mk-ink-3); overflow: hidden; text-overflow: ellipsis; }

/* ── Tombol & input ── */
.mk-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: var(--mk-tap); padding: 0 18px;
  border-radius: var(--mk-radius-sm); border: 1px solid var(--mk-line); background: var(--mk-surface); font-weight: 500; text-decoration: none; color: var(--mk-ink);
}
.mk-btn:hover { border-color: var(--mk-ink-3); }
.mk-btn--primary { background: var(--mk-accent); border-color: var(--mk-accent); color: var(--mk-accent-ink); }
.mk-btn--primary:hover { background: var(--mk-accent-hover); border-color: var(--mk-accent-hover); }
.mk-btn--danger { color: var(--mk-bad); }
.mk-btn--sm { min-height: 36px; padding: 0 12px; font-size: 13px; }
.mk-btn[disabled] { opacity: 0.45; cursor: not-allowed; }
.mk-icon-btn { position: relative; width: var(--mk-tap); height: var(--mk-tap); border: 0; background: none; border-radius: var(--mk-radius-sm); display: grid; place-items: center; color: var(--mk-ink-2); }
.mk-icon-btn:hover { background: var(--mk-surface-2); }
.mk-dot { position: absolute; top: 8px; right: 8px; min-width: 16px; height: 16px; padding: 0 4px; border-radius: 99px; background: var(--mk-accent); color: #fff; font-size: 10px; display: grid; place-items: center; }
.mk-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.mk-field > label, .mk-label { font-size: 12px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; color: var(--mk-ink-3); }
.mk-input, .mk-select, .mk-textarea {
  width: 100%; min-height: var(--mk-tap); padding: 10px 12px; border: 1px solid var(--mk-line); border-radius: var(--mk-radius-sm); background: var(--mk-surface); font-size: 16px;
}
.mk-textarea { min-height: 88px; resize: vertical; }
.mk-input:focus, .mk-select:focus, .mk-textarea:focus { outline: 2px solid var(--mk-accent); outline-offset: -1px; border-color: transparent; }
.mk-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.mk-hint { font-size: 13px; color: var(--mk-ink-3); }

/* ── Tab garis bawah ── */
.mk-tabs { display: flex; gap: 20px; border-bottom: 1px solid var(--mk-line); margin-bottom: 14px; overflow-x: auto; scrollbar-width: none; }
.mk-tabs::-webkit-scrollbar { display: none; }
.mk-tabs button { flex: 0 0 auto; min-height: var(--mk-tap); border: 0; background: none; color: var(--mk-ink-3); border-bottom: 2px solid transparent; margin-bottom: -1px; }
.mk-tabs button.on { color: var(--mk-ink); border-bottom-color: var(--mk-accent); font-weight: 500; }

/* ── Judul bagian ── */
.mk-sec { margin-top: 28px; }
.mk-sec:first-child { margin-top: 0; }
.mk-sec-h { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 4px; }
.mk-sec-h h2 { font-size: 1.05rem; }
.mk-sec-h small { color: var(--mk-ink-3); font-size: 13px; }
.mk-page-h { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
.mk-page-h h2 { font-size: 1.5rem; }
.mk-empty { padding: 22px 0; color: var(--mk-ink-3); font-size: 14px; }

/* ── Baris tugas ── */
.mk-row { display: flex; gap: 10px; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid var(--mk-line); }
.mk-row.sub { margin-left: 34px; }
.mk-check { flex: 0 0 var(--mk-tap); width: var(--mk-tap); height: var(--mk-tap); margin: -8px 0 -8px -10px; border: 0; background: none; display: grid; place-items: center; }
.mk-check span { width: 22px; height: 22px; border: 1.6px solid var(--mk-ink-3); border-radius: 6px; display: grid; place-items: center; font-size: 12px; color: transparent; transition: background 0.15s, border-color 0.15s; }
.mk-check.done span { background: var(--mk-accent); border-color: var(--mk-accent); color: #fff; }
.mk-row-body { flex: 1; min-width: 0; text-align: left; border: 0; background: none; padding: 0; }
.mk-row-title { display: block; font-weight: 500; overflow-wrap: anywhere; }
.mk-row.is-done .mk-row-title { color: var(--mk-ink-3); text-decoration: line-through; }
.mk-meta { display: flex; flex-wrap: wrap; gap: 4px 12px; margin-top: 3px; font-size: 13px; color: var(--mk-ink-3); }
.mk-meta .lewat { color: var(--mk-bad); font-weight: 500; }
.mk-meta .hari-ini { color: var(--mk-warn); font-weight: 500; }
.mk-st { display: inline-flex; align-items: center; gap: 6px; }
.mk-st::before { content: ''; width: 7px; height: 7px; border-radius: 2px; background: var(--mk-ink-3); }
.mk-st.proses::before { background: var(--mk-warn); }
.mk-st.review::before { background: var(--mk-info); }
.mk-st.selesai::before { background: var(--mk-ok); }
.mk-reorder { display: flex; flex-direction: column; flex: 0 0 auto; }
.mk-reorder button { width: 32px; height: 22px; border: 0; background: none; color: var(--mk-ink-3); font-size: 11px; }
.mk-reorder button:hover { color: var(--mk-ink); }

/* ── Tile ringkasan ── */
.mk-tiles { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.mk-tile { border: 0; border-radius: var(--mk-radius); padding: 14px 16px; min-height: 100px; text-align: left; display: flex; flex-direction: column; justify-content: space-between; }
.mk-tile b { font-size: 2rem; font-weight: 500; line-height: 1; letter-spacing: -0.03em; }
.mk-tile span { font-size: 13px; color: var(--mk-ink-2); }
.mk-tile:nth-child(1) { background: var(--mk-tile-1); } .mk-tile:nth-child(2) { background: var(--mk-tile-2); }
.mk-tile:nth-child(3) { background: var(--mk-tile-3); } .mk-tile:nth-child(4) { background: var(--mk-tile-4); }
@media (min-width: 700px) { .mk-tiles { grid-template-columns: 1.4fr 1fr 1fr 1fr; } }

/* ── Progres ── */
.mk-bar { height: 6px; background: var(--mk-surface-2); border-radius: 3px; overflow: hidden; }
.mk-bar i { display: block; height: 100%; background: var(--mk-accent); border-radius: 3px; }
.mk-prog { display: grid; grid-template-columns: 1fr auto; gap: 6px 12px; padding: 10px 0; border-bottom: 1px solid var(--mk-line); align-items: center; }
.mk-prog .mk-bar { grid-column: 1 / -1; }
.mk-prog button { text-align: left; border: 0; background: none; padding: 0; font-weight: 500; }
.mk-prog span { font-size: 13px; color: var(--mk-ink-3); }

/* ── Kartu link & revisi ── */
.mk-card { background: var(--mk-surface); border: 1px solid var(--mk-line); border-radius: var(--mk-radius); padding: 14px; margin-bottom: 12px; }
.mk-card-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; font-size: 13px; }
.mk-card-h b { font-size: 14px; }
.mk-link { display: block; word-break: break-all; font-weight: 500; padding: 8px 0; }
.mk-review { margin-top: 10px; padding: 10px 12px; border-left: 3px solid var(--mk-accent); background: var(--mk-accent-soft); border-radius: 0 var(--mk-radius-sm) var(--mk-radius-sm) 0; font-size: 14px; }
.mk-review small { display: block; color: var(--mk-ink-3); margin-bottom: 2px; }
.mk-cmt { padding: 10px 0; border-bottom: 1px solid var(--mk-line); }
.mk-cmt small { color: var(--mk-ink-3); }
.mk-cmt p { white-space: pre-wrap; overflow-wrap: anywhere; }

/* ── Sheet / modal ── */
.mk-overlay { position: fixed; inset: 0; z-index: 100; background: var(--mk-overlay); display: flex; align-items: flex-end; justify-content: center; }
.mk-sheet {
  width: 100%; max-height: 94dvh; overflow-y: auto; background: var(--mk-bg); border-radius: 20px 20px 0 0;
  padding: 0 16px calc(24px + env(safe-area-inset-bottom)); box-shadow: var(--mk-shadow); animation: mkUp 0.24s ease-out;
}
.mk-sheet-h { position: sticky; top: 0; z-index: 2; display: flex; align-items: center; gap: 8px; padding: 14px 0 10px; background: var(--mk-bg); border-bottom: 1px solid var(--mk-line); margin-bottom: 14px; }
.mk-sheet-h h2 { flex: 1; font-size: 1.1rem; overflow-wrap: anywhere; }
.mk-grip { width: 38px; height: 4px; border-radius: 2px; background: var(--mk-line); margin: 8px auto 0; }
@keyframes mkUp { from { transform: translateY(40px); opacity: 0.4; } to { transform: none; opacity: 1; } }
@media (min-width: 900px) {
  .mk-overlay { align-items: center; }
  .mk-sheet { max-width: 680px; border-radius: 18px; padding-bottom: 24px; }
  .mk-grip { display: none; }
}

/* ── Toast ── */
.mk-toasts { position: fixed; left: 12px; right: 12px; bottom: calc(var(--mk-nav-h) + 14px + env(safe-area-inset-bottom)); z-index: 200; display: flex; flex-direction: column; gap: 8px; pointer-events: none; align-items: center; }
.mk-toast { pointer-events: auto; max-width: 440px; width: 100%; background: var(--mk-toast-bg); color: var(--mk-toast-ink); border-radius: var(--mk-radius-sm); padding: 12px 14px; font-size: 14px; box-shadow: var(--mk-shadow); animation: mkUp 0.2s ease-out; }
.mk-toast.err { background: var(--mk-bad); }
@media (min-width: 900px) { .mk-toasts { bottom: 20px; left: auto; right: 20px; align-items: flex-end; } }

/* ── Gerbang (login / belum terdaftar) ── */
.mk-gate { min-height: 100dvh; display: grid; place-items: center; padding: 24px 16px; }
.mk-gate-box { width: 100%; max-width: 400px; }
.mk-gate-box h1 { font-size: 1.8rem; margin-bottom: 8px; }
.mk-gate-box p { color: var(--mk-ink-2); margin-bottom: 20px; }
.mk-or { display: flex; align-items: center; gap: 12px; color: var(--mk-ink-3); font-size: 13px; margin: 16px 0; }
.mk-or::before, .mk-or::after { content: ''; flex: 1; height: 1px; background: var(--mk-line); }
.mk-err { color: var(--mk-bad); font-size: 14px; margin-bottom: 12px; }
.mk-viewas { margin-bottom: 14px; padding: 10px 14px; border: 1px dashed var(--mk-accent); border-radius: var(--mk-radius-sm); background: var(--mk-accent-soft); display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 14px; }
.mk-live { width: 8px; height: 8px; border-radius: 50%; background: var(--mk-ink-3); flex: 0 0 auto; }
.mk-live.on { background: var(--mk-ok); }
.mk-chk { display: flex; align-items: center; gap: 10px; min-height: var(--mk-tap); }
.mk-chk input { width: 20px; height: 20px; accent-color: var(--mk-accent); }
.mk-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.mk-chips button { min-height: 36px; padding: 0 12px; border: 1px solid var(--mk-line); background: var(--mk-surface); border-radius: var(--mk-radius-sm); font-size: 13px; }
.mk-notice { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--mk-line); text-align: left; width: 100%; border-left: 0; border-right: 0; border-top: 0; background: none; }
.mk-notice.new { font-weight: 500; }
.mk-notice i { color: var(--mk-accent); margin-top: 4px; width: 16px; text-align: center; }
.mk-notice small { display: block; color: var(--mk-ink-3); font-weight: 400; }
.mk-mem { display: grid; grid-template-columns: 1fr auto; gap: 4px 10px; padding: 12px 0; border-bottom: 1px solid var(--mk-line); align-items: center; }
.mk-mem small { color: var(--mk-ink-3); overflow-wrap: anywhere; }
.mk-mem-actions { display: flex; gap: 6px; flex-wrap: wrap; }
@media (prefers-reduced-motion: reduce) { .mk-sheet, .mk-toast { animation: none; } }
/* ── Divisi, dana, nota ── */
.mk-div { display: block; width: 100%; text-align: left; border: 1px solid var(--mk-line); background: var(--mk-surface); border-radius: var(--mk-radius); padding: 14px; margin-bottom: 10px; }
.mk-div:hover { border-color: var(--mk-ink-3); }
.mk-div h3 { font-size: 1.02rem; display: flex; justify-content: space-between; gap: 10px; align-items: baseline; }
.mk-div small { color: var(--mk-ink-3); font-weight: 400; font-size: 13px; }
.mk-div p { margin-top: 4px; font-size: 13px; color: var(--mk-ink-2); }
.mk-chipline { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.mk-chipline span { font-size: 12px; color: var(--mk-ink-2); border: 1px solid var(--mk-line); border-radius: 6px; padding: 2px 8px; }
.mk-money { font-variant-numeric: tabular-nums; }
.mk-exp { padding: 12px 0; border-bottom: 1px solid var(--mk-line); display: grid; grid-template-columns: 1fr auto; gap: 4px 12px; align-items: start; }
.mk-exp b { font-variant-numeric: tabular-nums; font-weight: 500; text-align: right; }
.mk-exp-actions { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
.mk-warn { color: var(--mk-warn); }
.mk-back { border: 0; background: none; color: var(--mk-accent-text); padding: 0; min-height: 36px; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 8px; }
.mk-pill { font-size: 12px; padding: 2px 8px; border-radius: 6px; background: var(--mk-surface-2); color: var(--mk-ink-2); }
.mk-pill.warn { background: var(--mk-accent-soft); color: var(--mk-warn); }
.mk-mem-edit { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mk-mem-edit .full { grid-column: 1 / -1; }
.mk-file-note { font-size: 13px; color: var(--mk-ink-3); margin-top: 4px; }`;

/* ══════════════════════════════════════════════════════════════
   KONSTANTA & HELPER
══════════════════════════════════════════════════════════════ */
const ADMIN_EMAILS = { 'aldokraksaan@gmail.com': 'Aldo', 'aprilmeijuni1904@gmail.com': 'April' };
const PERAN = { admin: 'Admin', koordinator: 'Koordinator', anggota: 'Anggota' };
const EXP_STATUS = { menunggu: 'Menunggu persetujuan', disetujui: 'Disetujui', ditolak: 'Ditolak' };
const KAT = { kuliah: 'Tugas Kuliah', makrab: 'Tugas Makrab', admin: 'To-do Admin' };
const STATUS = { todo: 'Belum', proses: 'Proses', review: 'Review', selesai: 'Selesai' };
const SUB_STATUS = { menunggu: 'Menunggu review', perlu_revisi: 'Perlu revisi', disetujui: 'Disetujui' };
const REMINDER_OPTS = [
  { key: '60', label: '1 jam sebelum', ms: 60 * 60e3 },
  { key: '180', label: '3 jam sebelum', ms: 3 * 60 * 60e3 },
  { key: '1440', label: '1 hari sebelum', ms: 24 * 60 * 60e3 },
  { key: '2880', label: '2 hari sebelum', ms: 48 * 60 * 60e3 },
];
/* Saran nama matkul semester 1 (dari RPS FKEP UNEJ); bebas diketik lain */
const MATKUL_SARAN = [
  'Bahasa Inggris',
  'Konsep Dasar Keperawatan (KDK)',
  'Komunikasi Dasar Keperawatan (Komdas)',
  'Kesehatan Global',
  'Falsafah & Teori dalam Keperawatan (FTK)',
];
const TABLE_KEY = {
  makrab_members: 'members',
  makrab_tasks: 'tasks',
  makrab_task_assignees: 'assignees',
  makrab_comments: 'comments',
  makrab_submissions: 'submissions',
  makrab_reviews: 'reviews',
  makrab_reminders: 'reminders',
  makrab_divisions: 'divisions',
  makrab_expenses: 'expenses',
};
const EMPTY_DB = { members: [], tasks: [], assignees: [], comments: [], submissions: [], reviews: [], reminders: [], divisions: [], expenses: [] };

const TZ = 'Asia/Jakarta';
const dayFmt = new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short', timeZone: TZ });
const timeFmt = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ });
const dateKey = d => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d);

const fmtDeadline = iso => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${dayFmt.format(d)}, ${timeFmt.format(d).replace(':', '.')}`;
};
const fmtAgo = iso => {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'baru saja';
  if (s < 3600) return `${Math.floor(s / 60)} mnt lalu`;
  if (s < 86400) return `${Math.floor(s / 3600)} jam lalu`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)} hari lalu`;
  return dayFmt.format(new Date(iso));
};
/* 'lewat' | 'hari-ini' | 'minggu-ini' | 'nanti' | null */
const dueState = (t, now = new Date()) => {
  if (!t.deadline || t.status === 'selesai') return null;
  const d = new Date(t.deadline);
  if (d < now) return 'lewat';
  if (dateKey(d) === dateKey(now)) return 'hari-ini';
  if (d - now < 7 * 864e5) return 'minggu-ini';
  return 'nanti';
};
const pad2 = n => String(n).padStart(2, '0');
const toLocalInput = iso => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};
const fromLocalInput = v => (v ? new Date(v).toISOString() : null);
const safeUrl = u => /^https?:\/\//i.test(u || '');
const hostOf = u => { try { return new URL(u).host; } catch { return u; } };
const rp = n => `Rp ${new Intl.NumberFormat('id-ID').format(Math.round(Number(n) || 0))}`;
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ── Kalender: .ics + link Google Calendar ── */
const icsEsc = s => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const icsDate = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
function buildICS(tasks) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Makrab 2026 PDD//ID', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  tasks.filter(t => t.deadline).forEach(t => {
    const start = new Date(t.deadline);
    const end = new Date(start.getTime() + 30 * 60e3);
    lines.push(
      'BEGIN:VEVENT',
      `UID:${t.id}@makrab2026`,
      `DTSTAMP:${icsDate(new Date())}`,
      `DTSTART:${icsDate(start)}`,
      `DTEND:${icsDate(end)}`,
      `SUMMARY:${icsEsc(`[${KAT[t.kategori]}] ${t.judul}`)}`,
      `DESCRIPTION:${icsEsc([t.matkul, t.deskripsi].filter(Boolean).join(' - '))}`,
      'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Deadline 1 jam lagi', 'END:VALARM',
      'END:VEVENT'
    );
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function googleCalUrl(t) {
  const start = new Date(t.deadline);
  const end = new Date(start.getTime() + 30 * 60e3);
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `[${KAT[t.kategori]}] ${t.judul}`,
    dates: `${icsDate(start)}/${icsDate(end)}`,
    details: [t.matkul, t.deskripsi].filter(Boolean).join(' - '),
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

/* ── Notifikasi browser (izin diminta hanya saat user menekan tombol) ── */
const canNotify = () => typeof window !== 'undefined' && 'Notification' in window;
function pushBrowser(title, body) {
  if (!canNotify() || Notification.permission !== 'granted' || !document.hidden) return;
  try { new Notification(title, { body, tag: `${title}|${body}`.slice(0, 60) }); } catch { /* abaikan */ }
}

/* Tugas pribadi seorang anggota (yang ditugaskan padanya + tugas kuliah miliknya), sama dengan aturan RLS */
function visibleForMember(tasks, assignees, member) {
  if (!member) return [];
  const assigned = new Set(assignees.filter(a => a.member_id === member.id).map(a => a.task_id));
  return tasks.filter(t =>
    t.kategori !== 'admin' &&
    (!t.kelas || t.kelas === member.kelas) &&
    ((t.kategori === 'kuliah' && t.dibuat_oleh === member.id) || assigned.has(t.id) || (t.parent_id && assigned.has(t.parent_id)))
  );
}

/* ══════════════════════════════════════════════════════════════
   HOOK: DATA + REALTIME
══════════════════════════════════════════════════════════════ */
const keyOf = (name, row) => (name === 'makrab_task_assignees' ? `${row.task_id}|${row.member_id}` : row.id);

function applyChange(prev, name, payload) {
  const k = TABLE_KEY[name];
  const list = prev[k];
  if (payload.eventType === 'DELETE') {
    const key = keyOf(name, payload.old || {});
    return { ...prev, [k]: list.filter(r => keyOf(name, r) !== key) };
  }
  const row = payload.new;
  const key = keyOf(name, row);
  const i = list.findIndex(r => keyOf(name, r) === key);
  return { ...prev, [k]: i >= 0 ? list.map((r, j) => (j === i ? row : r)) : [...list, row] };
}

function useMakrabData(me, isAdmin, onEvent) {
  const [db, setDb] = useState(EMPTY_DB);
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState(false);
  const [error, setError] = useState('');
  const timer = useRef(null);
  const onEventRef = useRef(onEvent);
  useEffect(() => { onEventRef.current = onEvent; });

  const loadAll = useCallback(async () => {
    const get = async (name, order) => {
      let q = supabase.from(name).select('*');
      if (order) q = q.order(order, { ascending: true });
      const { data, error: e } = await q;
      if (e) throw e;
      return data || [];
    };
    const table = get('makrab_members', 'created_at');
    const roster = isAdmin
      ? table
      : Promise.all([
          supabase.rpc('makrab_roster').then(r => { if (r.error) throw r.error; return r.data || []; }),
          table,
        ]).then(([names, rows]) => {
          const byId = new Map(names.map(n => [n.id, n]));
          rows.forEach(r => byId.set(r.id, { ...byId.get(r.id), ...r }));
          return [...byId.values()];
        });
    const [members, tasks, assignees, comments, submissions, reviews, reminders, divisions, expenses] = await Promise.all([
      roster, get('makrab_tasks', 'urutan'), get('makrab_task_assignees'), get('makrab_comments', 'created_at'),
      get('makrab_submissions', 'created_at'), get('makrab_reviews', 'created_at'), get('makrab_reminders', 'waktu'),
      get('makrab_divisions', 'urutan'), get('makrab_expenses', 'created_at'),
    ]);
    setDb({ members, tasks, assignees, comments, submissions, reviews, reminders, divisions, expenses });
  }, [isAdmin]);

  useEffect(() => {
    if (!me) return undefined;
    let alive = true;
    const first = setTimeout(() => {
      loadAll()
        .then(() => { if (alive) { setReady(true); setError(''); } })
        .catch(e => { if (alive) setError(e?.message || 'Gagal memuat data'); });
    }, 0);

    const refetchSoon = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { loadAll().catch(() => {}); }, 350);
    };
    const ch = supabase.channel(`makrab-live-${me.id}`);
    Object.keys(TABLE_KEY).forEach(name => {
      ch.on('postgres_changes', { event: '*', schema: 'public', table: name }, payload => {
        setDb(prev => applyChange(prev, name, payload));
        // Penugasan mengubah tugas mana yang boleh dilihat → muat ulang
        if (name === 'makrab_task_assignees') refetchSoon();
        onEventRef.current?.(name, payload);
      });
    });
    ch.subscribe(status => { if (alive) setLive(status === 'SUBSCRIBED'); });

    const onVisible = () => { if (document.visibilityState === 'visible') loadAll().catch(() => {}); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      alive = false;
      clearTimeout(first);
      clearTimeout(timer.current);
      document.removeEventListener('visibilitychange', onVisible);
      supabase.removeChannel(ch);
    };
  }, [me, loadAll]);

  const upsertLocal = useCallback((name, row) => {
    setDb(prev => applyChange(prev, name, { eventType: 'UPDATE', new: row }));
  }, []);
  const removeLocal = useCallback((name, oldRow) => {
    setDb(prev => applyChange(prev, name, { eventType: 'DELETE', old: oldRow }));
  }, []);

  return { db, ready, live, error, reload: loadAll, upsertLocal, removeLocal };
}

/* ══════════════════════════════════════════════════════════════
   NOTIFIKASI DI DALAM HALAMAN (diturunkan dari data, jadi tetap
   muncul walau halaman baru dibuka setelah kejadian)
══════════════════════════════════════════════════════════════ */
function buildNotices({ me, canManage, db, nameOf }) {
  const title = id => db.tasks.find(t => t.id === id)?.judul || 'tugas';
  const out = [];
  db.submissions.forEach(s => {
    if (canManage && s.author_id !== me.id) {
      out.push({ id: `s${s.id}`, t: s.created_at, icon: 'link', taskId: s.task_id, text: `${nameOf(s.author_id)} kirim link (Revisi ${s.revisi_ke}): ${title(s.task_id)}` });
    }
  });
  db.comments.forEach(c => {
    if (c.author_id !== me.id) {
      out.push({ id: `c${c.id}`, t: c.created_at, icon: 'comment', taskId: c.task_id, text: `${nameOf(c.author_id)} komentar di ${title(c.task_id)}` });
    }
  });
  {
    db.reviews.forEach(r => {
      const s = db.submissions.find(x => x.id === r.submission_id);
      if (s && s.author_id === me.id) {
        out.push({ id: `r${r.id}`, t: r.created_at, icon: 'pen', taskId: s.task_id, text: `Revisi dari admin: ${title(s.task_id)}` });
      }
    });
    db.assignees.forEach(a => {
      const t = db.tasks.find(x => x.id === a.task_id);
      if (a.member_id === me.id && t && t.dibuat_oleh !== me.id) {
        out.push({ id: `a${a.task_id}`, t: a.created_at, icon: 'inbox', taskId: a.task_id, text: `Tugas baru untukmu: ${t.judul}` });
      }
    });
  }
  db.reminders.forEach(r => {
    if (r.member_id === me.id && r.dikirim) {
      out.push({ id: `m${r.id}`, t: r.waktu, icon: 'bell', taskId: r.task_id, text: `Pengingat: ${title(r.task_id)}` });
    }
  });
  return out.sort((a, b) => new Date(b.t) - new Date(a.t)).slice(0, 40);
}

/* ══════════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════════ */
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((text, type = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t.slice(-2), { id, text, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), type === 'err' ? 6000 : 3800);
  }, []);
  return [toasts, push];
}

const I = ({ n, className = '' }) => <i className={`fa-solid fa-${n} ${className}`} aria-hidden="true" />;

/* ══════════════════════════════════════════════════════════════
   KOMPONEN DASAR
══════════════════════════════════════════════════════════════ */
function Sheet({ title, onClose, actions, children }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div className="mk-overlay" role="dialog" aria-modal="true" aria-label={title} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="mk-sheet">
        <div className="mk-grip" />
        <div className="mk-sheet-h">
          <h2>{title}</h2>
          {actions}
          <button className="mk-icon-btn" onClick={onClose} aria-label="Tutup"><I n="xmark" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TaskRow({ t, ctx, sub = false, reorder = false }) {
  const { db, nameOf, actions, canManage } = ctx;
  const done = t.status === 'selesai';
  const kids = db.tasks.filter(x => x.parent_id === t.id);
  const doneKids = kids.filter(k => k.status === 'selesai').length;
  const ds = dueState(t);
  const people = db.assignees.filter(a => a.task_id === t.id).map(a => nameOf(a.member_id));
  const pending = canManage ? db.submissions.filter(s => s.task_id === t.id && s.status === 'menunggu').length : 0;
  const parentAssigned = !!t.parent_id && db.assignees.some(a => a.task_id === t.parent_id);
  const unassigned = canManage && t.kategori !== 'admin' && people.length === 0 && kids.length === 0 && !parentAssigned;
  return (
    <div className={`mk-row${sub ? ' sub' : ''}${done ? ' is-done' : ''}`}>
      <button className={`mk-check${done ? ' done' : ''}`} onClick={() => actions.toggleDone(t)} aria-pressed={done} aria-label={done ? 'Batalkan selesai' : 'Tandai selesai'}>
        <span><I n="check" /></span>
      </button>
      <button className="mk-row-body" onClick={() => actions.openTask(t.id)}>
        <span className="mk-row-title">{t.judul}</span>
        <span className="mk-meta">
          {ctx.showDivision && t.division_id && <span>{ctx.divisionName(t.division_id)}</span>}
          {t.matkul && <span>{t.matkul}</span>}
          {t.deadline && <span className={ds || ''}>{ds === 'lewat' ? 'Lewat · ' : ''}{fmtDeadline(t.deadline)}</span>}
          {kids.length > 0 && <span>{doneKids}/{kids.length} sub-tugas</span>}
          <span className={`mk-st ${t.status}`}>{STATUS[t.status]}</span>
          {pending > 0 && <span className="hari-ini">{pending} link menunggu review</span>}
          {unassigned && <span className="hari-ini">Belum dibagi</span>}
          {people.length > 0 && <span>{people.join(', ')}</span>}
        </span>
      </button>
      {reorder && (
        <div className="mk-reorder">
          <button onClick={() => actions.moveTask(t, -1)} aria-label="Naikkan"><I n="chevron-up" /></button>
          <button onClick={() => actions.moveTask(t, 1)} aria-label="Turunkan"><I n="chevron-down" /></button>
        </div>
      )}
    </div>
  );
}

/* Daftar tugas; yang sudah selesai dilipat supaya halaman tetap ringkas */
function TaskList({ list, ctx, reorder = false, emptyText = 'Belum ada tugas.' }) {
  const [showDone, setShowDone] = useState(false);
  const open = list.filter(t => t.status !== 'selesai');
  const done = list.filter(t => t.status === 'selesai');
  const kidsOf = id => ctx.db.tasks.filter(x => x.parent_id === id).sort((a, b) => a.urutan - b.urutan);
  const renderTask = (t, isSub) => (
    <div key={t.id}>
      <TaskRow t={t} ctx={ctx} sub={isSub} reorder={reorder} />
      {!isSub && kidsOf(t.id).filter(k => list.some(l => l.id === k.id)).map(k => <TaskRow key={k.id} t={k} ctx={ctx} sub reorder={reorder} />)}
    </div>
  );
  const tops = arr => arr.filter(t => !t.parent_id || !list.some(l => l.id === t.parent_id));
  if (list.length === 0) return <p className="mk-empty">{emptyText}</p>;
  return (
    <div>
      {tops(open).map(t => renderTask(t, false))}
      {open.length === 0 && <p className="mk-empty">Semua beres.</p>}
      {done.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <button className="mk-btn mk-btn--sm" onClick={() => setShowDone(v => !v)}>
            {showDone ? 'Sembunyikan' : 'Tampilkan'} {done.length} yang sudah selesai
          </button>
          {showDone && tops(done).map(t => renderTask(t, false))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   KARTU LINK & REVISI
══════════════════════════════════════════════════════════════ */
function SubmissionCard({ s, ctx }) {
  const { db, nameOf, actions } = ctx;
  const taskOfSub = db.tasks.find(x => x.id === s.task_id);
  const canReview = !!taskOfSub && ctx.canManageTask(taskOfSub);
  const reviews = db.reviews.filter(r => r.submission_id === s.id);
  const [isi, setIsi] = useState('');
  const [busy, setBusy] = useState(false);
  const act = async (status) => {
    setBusy(true);
    const ok = await actions.reviewSubmission(s, { isi: isi.trim(), status });
    setBusy(false);
    if (ok) setIsi('');
  };
  return (
    <div className="mk-card">
      <div className="mk-card-h">
        <b>Revisi {s.revisi_ke}</b>
        <span className={`mk-st ${s.status === 'disetujui' ? 'selesai' : s.status === 'perlu_revisi' ? 'proses' : 'review'}`}>{SUB_STATUS[s.status]}</span>
      </div>
      {safeUrl(s.url)
        ? <a className="mk-link" href={s.url} target="_blank" rel="noopener noreferrer"><I n="link" /> {hostOf(s.url)}</a>
        : <span className="mk-link">{s.url}</span>}
      {s.catatan && <p className="mk-hint" style={{ whiteSpace: 'pre-wrap' }}>{s.catatan}</p>}
      <p className="mk-hint" style={{ marginTop: 6 }}>{nameOf(s.author_id)} · {fmtAgo(s.created_at)}</p>
      {reviews.map(r => (
        <div key={r.id} className="mk-review"><small>Revisi · {fmtAgo(r.created_at)}</small>{r.isi}</div>
      ))}
      {canReview && (
        <div style={{ marginTop: 12 }}>
          <textarea className="mk-textarea" value={isi} onChange={e => setIsi(e.target.value)} placeholder="Tulis revisi atau catatan untuk link ini" maxLength={4000} />
          <div className="mk-chips" style={{ marginTop: 8, marginBottom: 0 }}>
            <button className="mk-btn mk-btn--sm mk-btn--primary" disabled={busy || !isi.trim()} onClick={() => act('perlu_revisi')}>Minta revisi</button>
            <button className="mk-btn mk-btn--sm" disabled={busy} onClick={() => act('disetujui')}>Setujui</button>
            {s.status !== 'menunggu' && <button className="mk-btn mk-btn--sm" disabled={busy} onClick={() => act('menunggu')}>Kembalikan ke menunggu</button>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DETAIL TUGAS
══════════════════════════════════════════════════════════════ */
function TaskDetail({ id, ctx, onClose, onEdit }) {
  const { db, me, nameOf, actions } = ctx;
  const t = db.tasks.find(x => x.id === id);
  const [url, setUrl] = useState('');
  const [catatan, setCatatan] = useState('');
  const [cmt, setCmt] = useState('');
  const [busy, setBusy] = useState(false);

  if (!t) {
    return <Sheet title="Tugas tidak ditemukan" onClose={onClose}><p className="mk-empty">Tugas ini sudah dihapus atau tidak lagi ditugaskan padamu.</p></Sheet>;
  }
  const parent = t.parent_id ? db.tasks.find(x => x.id === t.parent_id) : null;
  const kids = db.tasks.filter(x => x.parent_id === t.id).sort((a, b) => a.urutan - b.urutan);
  const people = db.assignees.filter(a => a.task_id === t.id).map(a => nameOf(a.member_id));
  const mine = t.kategori === 'kuliah' && t.dibuat_oleh === me.id;
  const canEdit = ctx.canManageTask(t) || mine || (t.kategori === 'admin' && t.dibuat_oleh === me.id);
  const subs = db.submissions.filter(s => s.task_id === t.id).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const comments = db.comments.filter(c => c.task_id === t.id).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const myRem = db.reminders.find(r => r.task_id === t.id && r.member_id === me.id && !r.dikirim);
  const remKey = myRem && t.deadline
    ? (REMINDER_OPTS.find(o => Math.abs(new Date(t.deadline) - new Date(myRem.waktu) - o.ms) < 60e3)?.key || '')
    : '';
  const ds = dueState(t);

  const sendLink = async e => {
    e.preventDefault();
    if (!safeUrl(url.trim())) { actions.toast('Link harus diawali http:// atau https://', 'err'); return; }
    setBusy(true);
    const ok = await actions.sendSubmission(t.id, url.trim(), catatan.trim());
    setBusy(false);
    if (ok) { setUrl(''); setCatatan(''); }
  };
  const sendComment = async e => {
    e.preventDefault();
    if (!cmt.trim()) return;
    setBusy(true);
    const ok = await actions.addComment(t.id, cmt.trim());
    setBusy(false);
    if (ok) setCmt('');
  };

  return (
    <Sheet
      title={t.judul}
      onClose={onClose}
      actions={canEdit ? <button className="mk-btn mk-btn--sm" onClick={() => onEdit(t)}>Ubah</button> : null}
    >
      <p className="mk-hint" style={{ marginBottom: 10 }}>
        {KAT[t.kategori]}{parent ? ` · bagian dari ${parent.judul}` : ''}{t.kelas ? ` · Kelas ${t.kelas}` : ''}
      </p>

      <div className="mk-row-2" style={{ marginBottom: 14 }}>
        <div className="mk-field" style={{ marginBottom: 0 }}>
          <label htmlFor="mk-st">Status</label>
          <select id="mk-st" className="mk-select" value={t.status} onChange={e => actions.setStatus(t, e.target.value)}>
            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="mk-field" style={{ marginBottom: 0 }}>
          <label>Deadline</label>
          <div style={{ minHeight: 44, display: 'flex', alignItems: 'center' }} className={ds || ''}>
            {t.deadline ? fmtDeadline(t.deadline) : <span className="mk-hint">Tanpa deadline</span>}
          </div>
        </div>
      </div>

      {t.matkul && <p style={{ marginBottom: 8 }}><span className="mk-label">Matkul</span><br />{t.matkul}</p>}
      {people.length > 0 && <p style={{ marginBottom: 8 }}><span className="mk-label">Ditugaskan ke</span><br />{people.join(', ')}</p>}
      {t.deskripsi && <p style={{ marginBottom: 14, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{t.deskripsi}</p>}

      {/* Kalender & pengingat */}
      <div className="mk-sec">
        <div className="mk-sec-h"><h2>Pengingat</h2></div>
        {t.deadline ? (
          <>
            <div className="mk-field">
              <select className="mk-select" aria-label="Ingatkan saya" value={remKey} onChange={e => actions.setReminder(t, e.target.value)}>
                <option value="">Tidak diingatkan</option>
                {REMINDER_OPTS.map(o => <option key={o.key} value={o.key}>Ingatkan {o.label}</option>)}
              </select>
            </div>
            {myRem && canNotify() && Notification.permission === 'default' && (
              <p className="mk-hint" style={{ marginBottom: 10 }}>
                Mau pengingat muncul sebagai notifikasi browser?{' '}
                <button className="mk-btn mk-btn--sm" onClick={actions.askNotify}>Aktifkan notifikasi</button>
              </p>
            )}
            <div className="mk-chips">
              <a className="mk-btn mk-btn--sm" href={googleCalUrl(t)} target="_blank" rel="noopener noreferrer"><I n="calendar-plus" /> Google Calendar</a>
              <button className="mk-btn mk-btn--sm" onClick={() => downloadText(`${t.judul.slice(0, 40)}.ics`, buildICS([t]))}><I n="download" /> Unduh .ics</button>
            </div>
          </>
        ) : <p className="mk-hint">Pengingat dan kalender aktif setelah tugas punya deadline.</p>}
      </div>

      {/* Sub-tugas */}
      {kids.length > 0 && (
        <div className="mk-sec">
          <div className="mk-sec-h"><h2>Sub-tugas</h2><small>{kids.filter(k => k.status === 'selesai').length}/{kids.length}</small></div>
          <TaskList list={kids} ctx={ctx} />
        </div>
      )}

      {/* Link & revisi */}
      {t.kategori === 'makrab' && (
        <div className="mk-sec">
          <div className="mk-sec-h"><h2>Link & revisi</h2><small>{subs.length} terkirim</small></div>
          {subs.length === 0 && <p className="mk-empty" style={{ padding: '8px 0 14px' }}>Belum ada link yang dikirim.</p>}
          {subs.map(s => <SubmissionCard key={s.id} s={s} ctx={ctx} />)}
          <form onSubmit={sendLink} style={{ marginTop: 12 }}>
            <div className="mk-field">
              <label htmlFor="mk-url">{subs.length ? 'Kirim revisi baru' : 'Kirim link'}</label>
              <input id="mk-url" className="mk-input" type="url" inputMode="url" placeholder="https://drive.google.com/..." value={url} onChange={e => setUrl(e.target.value)} maxLength={2000} required />
            </div>
            <div className="mk-field">
              <input className="mk-input" placeholder="Catatan singkat (opsional)" value={catatan} onChange={e => setCatatan(e.target.value)} maxLength={2000} aria-label="Catatan" />
            </div>
            <button className="mk-btn mk-btn--primary" disabled={busy || !url.trim()}>Kirim link</button>
          </form>
        </div>
      )}

      {/* Komentar */}
      {t.kategori !== 'admin' && (
        <div className="mk-sec">
          <div className="mk-sec-h"><h2>Komentar</h2><small>{comments.length}</small></div>
          {comments.map(c => (
            <div key={c.id} className="mk-cmt">
              <small><b>{nameOf(c.author_id)}</b> · {fmtAgo(c.created_at)}</small>
              <p>{c.isi}</p>
            </div>
          ))}
          <form onSubmit={sendComment} style={{ marginTop: 12 }}>
            <textarea className="mk-textarea" placeholder="Tulis komentar" value={cmt} onChange={e => setCmt(e.target.value)} maxLength={4000} aria-label="Komentar" />
            <button className="mk-btn mk-btn--sm" style={{ marginTop: 8 }} disabled={busy || !cmt.trim()}>Kirim</button>
          </form>
        </div>
      )}

      {canEdit && (
        <div className="mk-sec">
          <button className="mk-btn mk-btn--danger" onClick={() => actions.deleteTask(t, onClose)}><I n="trash" /> Hapus tugas ini</button>
        </div>
      )}
    </Sheet>
  );
}

/* ══════════════════════════════════════════════════════════════
   FORM TUGAS (tambah / ubah)
══════════════════════════════════════════════════════════════ */
function TaskForm({ ctx, initial, defaults, onClose, onSaved }) {
  const { db, isAdmin, me, actions } = ctx;
  const base = initial || defaults || {};
  const isPrivate = initial?.kategori === 'admin';
  const personal = !initial && !!defaults?.personal;
  const manage = !isPrivate && (initial ? ctx.canManageTask(initial) : ctx.canManage && !personal);
  const [kategori, setKategori] = useState(isPrivate ? 'admin' : (manage ? (base.kategori === 'kuliah' ? 'kuliah' : 'makrab') : 'kuliah'));
  const [judul, setJudul] = useState(base.judul || '');
  const [deskripsi, setDeskripsi] = useState(base.deskripsi || '');
  const [matkul, setMatkul] = useState(base.matkul || '');
  const [deadline, setDeadline] = useState(toLocalInput(base.deadline));
  const [kelas, setKelas] = useState(base.kelas || '');
  const [parentId, setParentId] = useState(base.parent_id || '');
  const [divisionId, setDivisionId] = useState(isAdmin ? (base.division_id || '') : (me.division_id || ''));
  const [assignees, setAssignees] = useState(() => new Set(initial ? db.assignees.filter(a => a.task_id === initial.id).map(a => a.member_id) : []));
  const [busy, setBusy] = useState(false);

  const people = db.members.filter(m => (divisionId ? m.division_id === divisionId : true));
  const kelasList = [...new Set(people.map(m => m.kelas).filter(Boolean))].sort();
  const parents = db.tasks.filter(t => !t.parent_id && t.kategori === kategori && t.id !== initial?.id && (t.division_id || '') === (divisionId || ''));
  const toggle = id => setAssignees(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const labelOf = m => `${m.nama}${m.kelas ? ` · ${m.kelas}` : ''}${m.email === null || m.email === undefined ? ' (menunggu email)' : ''}`;

  const submit = async e => {
    e.preventDefault();
    if (!judul.trim()) return;
    setBusy(true);
    const payload = {
      kategori,
      judul: judul.trim(),
      deskripsi: deskripsi.trim() || null,
      matkul: kategori === 'kuliah' ? (matkul.trim() || null) : null,
      deadline: fromLocalInput(deadline),
    };
    if (manage) {
      payload.division_id = isAdmin ? (divisionId || null) : (me.division_id || null);
      payload.parent_id = parentId || null;
      payload.kelas = isAdmin && kategori === 'kuliah' ? (kelas || null) : undefined;
    }
    const ok = await actions.saveTask(payload, initial?.id, manage ? [...assignees].filter(id => people.some(p => p.id === id)) : null);
    setBusy(false);
    if (ok) onSaved(ok);
  };

  return (
    <Sheet title={initial ? 'Ubah tugas' : (personal ? 'Tugas kuliah pribadi' : 'Tugas baru')} onClose={onClose}>
      <form onSubmit={submit}>
        {manage && (
          <div className="mk-row-2">
            <div className="mk-field">
              <label htmlFor="f-kat">Kategori</label>
              <select id="f-kat" className="mk-select" value={kategori} onChange={e => { setKategori(e.target.value); setParentId(''); }}>
                <option value="makrab">Tugas Makrab</option>
                <option value="kuliah">Tugas Kuliah</option>
              </select>
            </div>
            <div className="mk-field">
              <label htmlFor="f-div">Divisi</label>
              {isAdmin ? (
                <select id="f-div" className="mk-select" value={divisionId} onChange={e => { setDivisionId(e.target.value); setParentId(''); setAssignees(new Set()); }}>
                  <option value="">Semua / tanpa divisi</option>
                  {db.divisions.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
                </select>
              ) : (
                <div style={{ minHeight: 44, display: 'flex', alignItems: 'center' }}>{ctx.divisionName(me.division_id)}</div>
              )}
            </div>
          </div>
        )}
        <div className="mk-field">
          <label htmlFor="f-judul">Judul</label>
          <input id="f-judul" className="mk-input" value={judul} onChange={e => setJudul(e.target.value)} maxLength={200} required autoFocus />
        </div>
        {kategori === 'kuliah' && !isPrivate && (
          <div className="mk-field">
            <label htmlFor="f-matkul">Mata kuliah</label>
            <input id="f-matkul" className="mk-input" list="mk-matkul" value={matkul} onChange={e => setMatkul(e.target.value)} maxLength={80} placeholder="mis. Bahasa Inggris" />
            <datalist id="mk-matkul">{MATKUL_SARAN.map(m => <option key={m} value={m} />)}</datalist>
          </div>
        )}
        <div className="mk-field">
          <label htmlFor="f-desc">Deskripsi</label>
          <textarea id="f-desc" className="mk-textarea" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} maxLength={4000} />
        </div>
        <div className="mk-row-2">
          <div className="mk-field">
            <label htmlFor="f-dl">Deadline</label>
            <input id="f-dl" className="mk-input" type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </div>
          {manage && isAdmin && kategori === 'kuliah' && (
            <div className="mk-field">
              <label htmlFor="f-kelas">Khusus kelas</label>
              <select id="f-kelas" className="mk-select" value={kelas} onChange={e => setKelas(e.target.value)}>
                <option value="">Semua kelas</option>
                {[...new Set(db.members.map(m => m.kelas).filter(Boolean))].sort().map(k => <option key={k} value={k}>Kelas {k}</option>)}
              </select>
            </div>
          )}
        </div>
        {manage && (
          <div className="mk-field">
            <label htmlFor="f-parent">Sub-tugas dari</label>
            <select id="f-parent" className="mk-select" value={parentId} onChange={e => setParentId(e.target.value)}>
              <option value="">Bukan sub-tugas</option>
              {parents.map(p => <option key={p.id} value={p.id}>{p.judul}</option>)}
            </select>
          </div>
        )}
        {manage && (
          <div className="mk-field">
            <span className="mk-label">Ditugaskan ke</span>
            {people.length === 0 && <p className="mk-hint">Belum ada anggota di divisi ini.</p>}
            {people.length > 0 && (
              <div className="mk-chips">
                <button type="button" onClick={() => setAssignees(new Set(people.map(p => p.id)))}>Semua</button>
                {kelasList.map(k => (
                  <button key={k} type="button" onClick={() => setAssignees(new Set(people.filter(p => p.kelas === k).map(p => p.id)))}>Kelas {k}</button>
                ))}
                <button type="button" onClick={() => setAssignees(new Set())}>Kosongkan</button>
              </div>
            )}
            {people.map(p => (
              <label key={p.id} className="mk-chk">
                <input type="checkbox" checked={assignees.has(p.id)} onChange={() => toggle(p.id)} />
                <span>{labelOf(p)}</span>
              </label>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button className="mk-btn mk-btn--primary" disabled={busy || !judul.trim()}>{busy ? 'Menyimpan…' : 'Simpan'}</button>
          <button type="button" className="mk-btn" onClick={onClose}>Batal</button>
        </div>
      </form>
    </Sheet>
  );
}

/* ══════════════════════════════════════════════════════════════
   PANEL NOTIFIKASI
══════════════════════════════════════════════════════════════ */
function NotifPanel({ ctx, notices, seen, onClose, onMarkSeen }) {
  const { actions } = ctx;
  const perm = canNotify() ? Notification.permission : 'unsupported';
  const icons = { link: 'link', comment: 'comment', pen: 'pen', inbox: 'inbox', bell: 'bell' };
  return (
    <Sheet title="Notifikasi" onClose={onClose} actions={<button className="mk-btn mk-btn--sm" onClick={onMarkSeen}>Tandai dibaca</button>}>
      {perm === 'default' && (
        <p className="mk-hint" style={{ marginBottom: 14 }}>
          Notifikasi di halaman ini selalu aktif. Kalau mau juga muncul sebagai notifikasi browser saat tab tidak dibuka:{' '}
          <button className="mk-btn mk-btn--sm" onClick={actions.askNotify}>Aktifkan</button>
        </p>
      )}
      {perm === 'denied' && <p className="mk-hint" style={{ marginBottom: 14 }}>Notifikasi browser diblokir. Kamu tetap dapat pemberitahuan di halaman ini.</p>}
      {notices.length === 0 && <p className="mk-empty">Belum ada apa-apa.</p>}
      {notices.map(n => (
        <button key={n.id} className={`mk-notice${new Date(n.t) > new Date(seen) ? ' new' : ''}`} onClick={() => { onClose(); actions.openTask(n.taskId); }}>
          <I n={icons[n.icon] || 'bell'} />
          <span>{n.text}<small>{fmtAgo(n.t)}</small></span>
        </button>
      ))}
    </Sheet>
  );
}

/* ══════════════════════════════════════════════════════════════
   GERBANG: loading, login, belum terdaftar
══════════════════════════════════════════════════════════════ */
function Loading({ text = 'Memuat…' }) {
  return <div className="mk-gate"><p className="mk-hint" role="status">{text}</p></div>;
}

function LoginGate() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async e => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try { await signInWithEmailAndPassword(auth, email.trim(), pw); }
    catch (ex) { setErr(ex?.message === 'Invalid login credentials' ? 'Email atau password salah.' : (ex?.message || 'Gagal masuk.')); }
    setBusy(false);
  };
  const google = async () => {
    setErr('');
    try { await signInWithPopup(); } catch (ex) { setErr(ex?.message || 'Gagal masuk dengan Google.'); }
  };
  return (
    <div className="mk-gate">
      <div className="mk-gate-box">
        <h1>Makrab 2026</h1>
        <p>Halaman koordinasi divisi PDD. Masuk dengan akun yang emailnya sudah didaftarkan koordinator.</p>
        <button className="mk-btn" style={{ width: '100%' }} onClick={google}>Masuk dengan Google</button>
        <div className="mk-or">atau</div>
        <form onSubmit={submit}>
          <div className="mk-field"><label htmlFor="g-email">Email</label>
            <input id="g-email" className="mk-input" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div className="mk-field"><label htmlFor="g-pw">Password</label>
            <input id="g-pw" className="mk-input" type="password" autoComplete="current-password" value={pw} onChange={e => setPw(e.target.value)} required /></div>
          {err && <p className="mk-err" role="alert">{err}</p>}
          <button className="mk-btn mk-btn--primary" style={{ width: '100%' }} disabled={busy}>{busy ? 'Masuk…' : 'Masuk'}</button>
        </form>
        <p className="mk-hint" style={{ marginTop: 16 }}>
          Belum punya akun? <a href="/login" onClick={e => { e.preventDefault(); navigate('/login'); }}>Daftar di halaman login</a>, lalu kembali ke /makrab.
        </p>
      </div>
    </div>
  );
}

function NotRegistered({ user, unverified }) {
  return (
    <div className="mk-gate">
      <div className="mk-gate-box">
        <h1>Kamu belum terdaftar</h1>
        <p>
          Akun <b>{user.email}</b> tidak ada di daftar anggota Makrab PDD.
          {unverified && ' Email akun ini juga belum terverifikasi; cek inbox untuk link verifikasinya.'}
          {' '}Minta koordinator menambahkan emailmu, lalu muat ulang halaman ini.
        </p>
        <button className="mk-btn" onClick={() => signOut()}>Keluar</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAMPILAN ANGGOTA
══════════════════════════════════════════════════════════════ */
function Section({ title, note, children, action }) {
  return (
    <section className="mk-sec">
      <div className="mk-sec-h"><h2>{title}</h2>{action || (note ? <small>{note}</small> : null)}</div>
      {children}
    </section>
  );
}

function openList(tasks) { return tasks.filter(t => t.status !== 'selesai'); }

function MemberHome({ tasks, ctx, go }) {
  const now = new Date();
  const own = tasks.filter(t => t.kategori !== 'admin');
  const lewat = own.filter(t => dueState(t, now) === 'lewat');
  const hari = own.filter(t => dueState(t, now) === 'hari-ini');
  const minggu = own.filter(t => dueState(t, now) === 'minggu-ini');
  const kuliah = openList(own.filter(t => t.kategori === 'kuliah'));
  const makrab = openList(own.filter(t => t.kategori === 'makrab' && !t.parent_id));
  const nothing = lewat.length + hari.length + minggu.length === 0;
  const rows = list => list.map(t => <TaskRow key={t.id} t={t} ctx={ctx} />);
  return (
    <>
      <Section title="Hari ini dan minggu ini">
        {nothing && <p className="mk-empty">Tidak ada deadline dalam 7 hari ke depan.</p>}
        {lewat.length > 0 && <><p className="mk-label" style={{ marginTop: 10, color: 'var(--mk-bad)' }}>Lewat deadline</p>{rows(lewat)}</>}
        {hari.length > 0 && <><p className="mk-label" style={{ marginTop: 10 }}>Hari ini</p>{rows(hari)}</>}
        {minggu.length > 0 && <><p className="mk-label" style={{ marginTop: 10 }}>Minggu ini</p>{rows(minggu)}</>}
      </Section>
      <Section title="Tugas kuliah" note={`${kuliah.length} belum selesai`}
        action={<button className="mk-btn mk-btn--sm" onClick={() => ctx.actions.openForm({ kategori: 'kuliah', personal: true })}><I n="plus" /> Tambah</button>}>
        {kuliah.length === 0 ? <p className="mk-empty">Belum ada tugas kuliah.</p> : rows(kuliah.slice(0, 5))}
        {kuliah.length > 5 && <button className="mk-btn mk-btn--sm" style={{ marginTop: 10 }} onClick={() => go('kuliah')}>Lihat semua ({kuliah.length})</button>}
      </Section>
      <Section title="Tugas makrab" note={`${makrab.length} belum selesai`}>
        {makrab.length === 0 ? <p className="mk-empty">Belum ada tugas makrab untukmu.</p> : rows(makrab.slice(0, 5))}
        {makrab.length > 5 && <button className="mk-btn mk-btn--sm" style={{ marginTop: 10 }} onClick={() => go('makrab')}>Lihat semua ({makrab.length})</button>}
      </Section>
    </>
  );
}

function KuliahView({ tasks, ctx }) {
  const list = tasks.filter(t => t.kategori === 'kuliah');
  const groups = useMemo(() => {
    const m = new Map();
    list.forEach(t => { const k = t.matkul || 'Tanpa mata kuliah'; if (!m.has(k)) m.set(k, []); m.get(k).push(t); });
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], 'id'));
  }, [list]);
  return (
    <>
      <div className="mk-page-h">
        <div><h2>Tugas kuliah</h2><p className="mk-hint">Dikelompokkan per mata kuliah. Matkul tanpa tugas berarti memang belum ada.</p></div>
        <button className="mk-btn mk-btn--primary" onClick={() => ctx.actions.openForm({ kategori: 'kuliah', personal: true })}><I n="plus" /> Tambah tugas</button>
      </div>
      {groups.length === 0 && <p className="mk-empty">Belum ada tugas kuliah. Tambahkan sendiri kalau ada yang belum dimasukkan koordinator.</p>}
      {groups.map(([matkul, items]) => (
        <Section key={matkul} title={matkul} note={`${items.filter(t => t.status === 'selesai').length}/${items.length} selesai`}>
          <TaskList list={items} ctx={ctx} />
        </Section>
      ))}
    </>
  );
}

function MakrabView({ tasks, ctx }) {
  const list = tasks.filter(t => t.kategori === 'makrab');
  return (
    <>
      <div className="mk-page-h"><div><h2>Tugas makrab</h2><p className="mk-hint">Buka tugas untuk komentar dan kirim link hasil kerja.</p></div></div>
      <TaskList list={list} ctx={ctx} emptyText="Belum ada tugas makrab yang dibagikan padamu." />
    </>
  );
}

function AgendaView({ tasks, ctx }) {
  const list = tasks.filter(t => t.kategori !== 'admin' && t.deadline && t.status !== 'selesai')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const days = [];
  list.forEach(t => {
    const k = dateKey(new Date(t.deadline));
    const last = days[days.length - 1];
    if (last && last.k === k) last.items.push(t); else days.push({ k, label: dayFmt.format(new Date(t.deadline)), items: [t] });
  });
  return (
    <>
      <div className="mk-page-h">
        <div><h2>Jadwal deadline</h2><p className="mk-hint">Urut dari yang paling dekat.</p></div>
        <button className="mk-btn" disabled={list.length === 0} onClick={() => downloadText('makrab-deadline.ics', buildICS(list))}><I n="download" /> Ekspor semua (.ics)</button>
      </div>
      {days.length === 0 && <p className="mk-empty">Belum ada tugas yang punya deadline.</p>}
      {days.map(d => (
        <Section key={d.k} title={d.label}>{d.items.map(t => <TaskRow key={t.id} t={t} ctx={ctx} />)}</Section>
      ))}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAMPILAN KELOLA (admin = semua divisi, koordinator = divisinya)
══════════════════════════════════════════════════════════════ */
const leafTasks = tasks => tasks.filter(t => !tasks.some(x => x.parent_id === t.id));

function expenseTotals(expenses, divisionId) {
  const list = expenses.filter(e => e.division_id === divisionId);
  const sum = st => list.filter(e => e.status === st).reduce((n, e) => n + Number(e.jumlah), 0);
  return { approved: sum('disetujui'), pending: sum('menunggu') };
}

function DanaBar({ budget, approved, pending }) {
  const pct = v => (budget > 0 ? Math.min(100, Math.round((v / budget) * 100)) : 0);
  return (
    <div className="mk-bar" aria-hidden="true" style={{ position: 'relative' }}>
      <i style={{ width: `${pct(approved + pending)}%`, background: 'var(--mk-warn)', position: 'absolute', left: 0, opacity: 0.55 }} />
      <i style={{ width: `${pct(approved)}%`, position: 'absolute', left: 0 }} />
    </div>
  );
}

function Overview({ ctx, go, onView, onDivision, scope }) {
  const { db, isAdmin } = ctx;
  const real = db.tasks.filter(t => t.kategori !== 'admin' && (!scope || t.division_id === scope));
  const leaves = leafTasks(real);
  const lewat = leaves.filter(t => dueState(t) === 'lewat');
  const waiting = db.submissions.filter(s => s.status === 'menunggu' && real.some(t => t.id === s.task_id));
  const makrabLeaves = leaves.filter(t => t.kategori === 'makrab');
  const doneM = makrabLeaves.filter(t => t.status === 'selesai').length;
  const assignedIds = new Set(db.assignees.map(a => a.task_id));
  const unassigned = makrabLeaves.filter(t => !assignedIds.has(t.id) && !(t.parent_id && assignedIds.has(t.parent_id)));
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const people = db.members.filter(m => m.division_id === scope && m.id !== ctx.me.id);
  const pendingExpenses = db.expenses.filter(e => e.status === 'menunggu' && (!scope || e.division_id === scope));
  const divs = scope ? db.divisions.filter(d => d.id === scope) : db.divisions;

  return (
    <>
      <div className="mk-page-h"><h2>{scope ? ctx.divisionName(scope) : 'Ringkasan'}</h2></div>
      <div className="mk-tiles">
        <button className="mk-tile" onClick={() => go('review')}><b>{waiting.length}</b><span>link menunggu review</span></button>
        <button className="mk-tile" onClick={() => go('tugas')}><b>{lewat.length}</b><span>lewat deadline</span></button>
        <button className="mk-tile" onClick={() => go('tugas')}><b>{doneM}/{makrabLeaves.length}</b><span>tugas makrab selesai</span></button>
        <button className="mk-tile" onClick={() => go('tugas')}><b>{unassigned.length}</b><span>belum dibagi</span></button>
      </div>

      {isAdmin && pendingExpenses.length > 0 && (
        <p className="mk-viewas" style={{ marginTop: 18 }}>
          <span><b>{pendingExpenses.length}</b> pengeluaran menunggu persetujuanmu.</span>
          <button className="mk-btn mk-btn--sm mk-btn--primary" onClick={() => go('dana')}>Periksa</button>
        </p>
      )}

      {lewat.length > 0 && (
        <Section title="Lewat deadline" note={`${lewat.length} tugas`}>
          {lewat.slice(0, 5).map(t => <TaskRow key={t.id} t={t} ctx={ctx} />)}
        </Section>
      )}

      {!scope && (
        <Section title="Progres per divisi" note="tap untuk membuka">
          {db.divisions.map(d => {
            const ls = leafTasks(db.tasks.filter(t => t.kategori !== 'admin' && t.division_id === d.id));
            const done = ls.filter(t => t.status === 'selesai').length;
            return (
              <div key={d.id} className="mk-prog">
                <button onClick={() => onDivision(d.id)}>{d.nama}</button>
                <span>{done}/{ls.length}</span>
                <div className="mk-bar"><i style={{ width: `${pct(done, ls.length)}%` }} /></div>
              </div>
            );
          })}
        </Section>
      )}

      {scope && (
        <Section title="Progres per anggota" note={isAdmin ? 'tap nama untuk lihat dashboard-nya' : ''}>
          {people.length === 0 && <p className="mk-empty">Belum ada anggota di divisimu.</p>}
          {people.map(p => {
            const mine = leafTasks(visibleForMember(db.tasks, db.assignees, p));
            const done = mine.filter(t => t.status === 'selesai').length;
            return (
              <div key={p.id} className="mk-prog">
                {isAdmin ? <button onClick={() => onView(p.id)}>{p.nama}</button> : <span style={{ color: 'var(--mk-ink)', fontWeight: 500 }}>{p.nama}</span>}
                <span>{done}/{mine.length}</span>
                <div className="mk-bar"><i style={{ width: `${pct(done, mine.length)}%` }} /></div>
              </div>
            );
          })}
        </Section>
      )}

      <Section title="Dana" action={<button className="mk-btn mk-btn--sm" onClick={() => go('dana')}>Buka</button>}>
        {divs.map(d => {
          const t = expenseTotals(db.expenses, d.id);
          return (
            <div key={d.id} className="mk-prog">
              <span style={{ color: 'var(--mk-ink)', fontWeight: 500 }}>{d.nama}</span>
              <span className="mk-money">{rp(t.approved)} / {rp(d.budget)}</span>
              <DanaBar budget={d.budget} approved={t.approved} pending={t.pending} />
            </div>
          );
        })}
      </Section>
    </>
  );
}

function ReviewView({ ctx, scope }) {
  const { db, actions } = ctx;
  const [tab, setTab] = useState('menunggu');
  const inScope = s => { const t = db.tasks.find(x => x.id === s.task_id); return !!t && (!scope || t.division_id === scope); };
  const base = db.submissions.filter(inScope);
  const list = base.filter(s => s.status === tab).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const count = st => base.filter(s => s.status === st).length;
  return (
    <>
      <div className="mk-page-h"><div><h2>Review link</h2><p className="mk-hint">Yang paling lama menunggu ada di atas.</p></div></div>
      <div className="mk-tabs" role="tablist">
        {[['menunggu', 'Menunggu'], ['perlu_revisi', 'Perlu revisi'], ['disetujui', 'Disetujui']].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l} ({count(k)})</button>
        ))}
      </div>
      {list.length === 0 && <p className="mk-empty">{tab === 'menunggu' ? 'Tidak ada link yang menunggu. Antrean bersih.' : 'Kosong.'}</p>}
      {list.map(s => {
        const t = db.tasks.find(x => x.id === s.task_id);
        return (
          <div key={s.id}>
            <button className="mk-btn mk-btn--sm" style={{ marginBottom: 8 }} onClick={() => actions.openTask(s.task_id)}>
              {ctx.isAdmin && t?.division_id ? `${ctx.divisionName(t.division_id)} · ` : ''}{t?.judul || 'Tugas'} <I n="chevron-right" />
            </button>
            <SubmissionCard s={s} ctx={ctx} />
          </div>
        );
      })}
    </>
  );
}

function AdminTasks({ ctx, scope, divFilter, setDivFilter }) {
  const { db, actions, isAdmin } = ctx;
  const [kat, setKat] = useState('all');
  const [orang, setOrang] = useState('');
  const [st, setSt] = useState('');
  const div = scope || divFilter;
  const order = { makrab: 0, kuliah: 1 };
  const list = db.tasks
    .filter(t => t.kategori !== 'admin')
    .filter(t => !div || t.division_id === div)
    .filter(t => kat === 'all' || t.kategori === kat)
    .filter(t => !st || t.status === st)
    .filter(t => !orang || db.assignees.some(a => a.task_id === t.id && a.member_id === orang) || (t.parent_id && db.assignees.some(a => a.task_id === t.parent_id && a.member_id === orang)))
    .sort((a, b) => order[a.kategori] - order[b.kategori] || a.urutan - b.urutan);
  const people = db.members.filter(m => !div || m.division_id === div);
  return (
    <>
      <div className="mk-page-h">
        <h2>Semua tugas</h2>
        <button className="mk-btn mk-btn--primary" onClick={() => actions.openForm({ kategori: kat === 'kuliah' ? 'kuliah' : 'makrab', division_id: div || undefined })}><I n="plus" /> Tambah tugas</button>
      </div>
      {isAdmin && (
        <div className="mk-field">
          <select className="mk-select" aria-label="Filter divisi" value={divFilter} onChange={e => { setDivFilter(e.target.value); setOrang(''); }}>
            <option value="">Semua divisi</option>
            {db.divisions.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
          </select>
        </div>
      )}
      <div className="mk-tabs">
        {[['all', 'Semua'], ['makrab', 'Makrab'], ['kuliah', 'Kuliah']].map(([k, l]) => (
          <button key={k} className={kat === k ? 'on' : ''} onClick={() => setKat(k)}>{l}</button>
        ))}
      </div>
      <div className="mk-row-2" style={{ marginBottom: 8 }}>
        <select className="mk-select" aria-label="Filter orang" value={orang} onChange={e => setOrang(e.target.value)}>
          <option value="">Semua orang</option>
          {people.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
        </select>
        <select className="mk-select" aria-label="Filter status" value={st} onChange={e => setSt(e.target.value)}>
          <option value="">Semua status</option>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <TaskList list={list} ctx={{ ...ctx, showDivision: isAdmin && !div }} reorder emptyText="Tidak ada tugas yang cocok dengan filter." />
    </>
  );
}

function AdminTodo({ ctx }) {
  const { db, actions } = ctx;
  const [text, setText] = useState('');
  const list = db.tasks.filter(t => t.kategori === 'admin').sort((a, b) => a.urutan - b.urutan);
  const add = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    const ok = await actions.saveTask({ kategori: 'admin', judul: text.trim() }, null, null);
    if (ok) setText('');
  };
  return (
    <>
      <div className="mk-page-h"><div><h2>To-do saya</h2><p className="mk-hint">Catatan pribadi. Tidak ada orang lain yang bisa melihat ini, termasuk admin lain.</p></div></div>
      <form onSubmit={add} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input className="mk-input" placeholder="Tambah poin baru" value={text} onChange={e => setText(e.target.value)} maxLength={200} aria-label="Poin baru" />
        <button className="mk-btn mk-btn--primary" disabled={!text.trim()}>Tambah</button>
      </form>
      <TaskList list={list} ctx={ctx} reorder emptyText="Belum ada poin." />
    </>
  );
}

/* ── Divisi & anggota ── */
const peranRank = { admin: 0, koordinator: 1, anggota: 2 };

function DivisionsView({ ctx, onOpen }) {
  const { db } = ctx;
  return (
    <>
      <div className="mk-page-h"><div><h2>Divisi & anggota</h2><p className="mk-hint">Total {db.members.length} orang di struktur. Tap divisi untuk melihat anggota dan memasukkan email mereka.</p></div></div>
      {db.divisions.map(d => {
        const ms = db.members.filter(m => m.division_id === d.id);
        const aktif = ms.filter(m => m.email).length;
        const koord = ms.find(m => m.peran === 'koordinator') || ms.find(m => m.peran === 'admin' && d.jenis === 'sie');
        const pic = db.members.find(m => m.id === d.pic_id);
        const waitingEmail = ms.length - aktif;
        const ls = leafTasks(db.tasks.filter(t => t.kategori !== 'admin' && t.division_id === d.id));
        const tot = expenseTotals(db.expenses, d.id);
        return (
          <button key={d.id} className="mk-div" onClick={() => onOpen(d.id)}>
            <h3>{d.nama}<small>{ms.length}{d.target_anggota ? ` / ${d.target_anggota + (koord ? 1 : 0)}` : ''} orang</small></h3>
            <p>
              {d.jenis === 'sie' ? `Koordinator: ${koord?.nama || '-'}` : 'Badan Pengurus Harian'}
              {pic && d.jenis === 'sie' ? ` · PIC: ${pic.nama}` : ''}
            </p>
            <p>
              {aktif} sudah punya email{waitingEmail > 0 ? <span className="mk-warn"> · {waitingEmail} menunggu email</span> : ''}
              {ls.length > 0 ? ` · tugas ${ls.filter(t => t.status === 'selesai').length}/${ls.length}` : ''}
            </p>
            <p className="mk-money">Dana {rp(tot.approved)} dari {rp(d.budget)}</p>
          </button>
        );
      })}
    </>
  );
}

function MemberRow({ m, ctx, onView }) {
  const { isAdmin, actions, db } = ctx;
  const editable = ctx.canManageMembers(m.division_id) && (isAdmin || m.peran === 'anggota');
  const div = db.divisions.find(d => d.id === m.division_id);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ nama: m.nama, email: m.email || '', kelas: m.kelas || '', jabatan: m.jabatan || '', sub_sie: m.sub_sie || '', peran: m.peran, izin: !!m.izin_anggota, division_id: m.division_id || '' });
  const set = k => e => setF(v => ({ ...v, [k]: e.target.value }));
  const save = async () => {
    const email = f.email.trim().toLowerCase();
    if (email && !isEmail(email)) { actions.toast('Format email belum benar', 'err'); return; }
    if (!f.nama.trim()) return;
    setBusy(true);
    const patch = { nama: f.nama.trim(), email: email || null, kelas: f.kelas.trim() || null, jabatan: f.jabatan.trim() || null, sub_sie: f.sub_sie || null };
    if (isAdmin) { patch.peran = f.peran; patch.izin_anggota = f.peran === 'koordinator' ? f.izin : false; patch.division_id = f.division_id || null; }
    const ok = await actions.updateMember(m.id, patch);
    setBusy(false);
    if (ok) setOpen(false);
  };
  return (
    <div className="mk-mem">
      <div>
        <b>{m.nama}</b>{m.nama_lengkap && m.nama_lengkap !== m.nama ? <small style={{ display: 'block' }}>{m.nama_lengkap}</small> : null}
        <small style={{ display: 'block' }}>
          {PERAN[m.peran]}{m.jabatan ? ` · ${m.jabatan}` : ''}{m.sub_sie ? ` · ${m.sub_sie}` : ''}{m.peran === 'koordinator' && m.izin_anggota ? ' · boleh mengurus anggota' : ''}
        </small>
        <small style={{ display: 'block' }} className={m.email ? '' : 'mk-warn'}>{m.email || 'Menunggu email'}</small>
      </div>
      <div className="mk-mem-actions">
        {editable && <button className="mk-btn mk-btn--sm" onClick={() => setOpen(o => !o)}>{open ? 'Tutup' : (m.email ? 'Ubah' : 'Isi email')}</button>}
        {isAdmin && m.email && m.id !== ctx.me.id && <button className="mk-btn mk-btn--sm" onClick={() => onView(m.id)}>Lihat sebagai</button>}
      </div>
      {open && (
        <div className="mk-mem-edit">
          <div className="mk-field full"><label>Email (akun login)</label><input className="mk-input" type="email" value={f.email} onChange={set('email')} placeholder="kosongkan jika belum ada" /></div>
          <div className="mk-field"><label>Nama panggilan</label><input className="mk-input" value={f.nama} onChange={set('nama')} maxLength={80} /></div>
          <div className="mk-field"><label>Kelas</label><input className="mk-input" value={f.kelas} onChange={set('kelas')} maxLength={20} /></div>
          <div className="mk-field"><label>Jabatan</label><input className="mk-input" value={f.jabatan} onChange={set('jabatan')} maxLength={80} /></div>
          {div && div.sub_sie.length > 0 && (
            <div className="mk-field"><label>Sub sie</label>
              <select className="mk-select" value={f.sub_sie} onChange={set('sub_sie')}><option value="">-</option>{div.sub_sie.map(x => <option key={x} value={x}>{x}</option>)}</select>
            </div>
          )}
          {isAdmin && (
            <>
              <div className="mk-field"><label>Peran</label>
                <select className="mk-select" value={f.peran} onChange={set('peran')}>{Object.entries(PERAN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
              </div>
              <div className="mk-field"><label>Divisi</label>
                <select className="mk-select" value={f.division_id} onChange={set('division_id')}><option value="">-</option>{db.divisions.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}</select>
              </div>
              {f.peran === 'koordinator' && (
                <label className="mk-chk full"><input type="checkbox" checked={f.izin} onChange={e => setF(v => ({ ...v, izin: e.target.checked }))} /><span>Boleh menambah dan mengurus anggota divisinya</span></label>
              )}
            </>
          )}
          <div className="full" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="mk-btn mk-btn--primary" onClick={save} disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan'}</button>
            {(isAdmin || m.peran === 'anggota') && m.id !== ctx.me.id && <button className="mk-btn mk-btn--danger" onClick={() => actions.removeMember(m)}><I n="trash" /> Hapus</button>}
          </div>
        </div>
      )}
    </div>
  );
}

function DivisionDetail({ ctx, division, onBack, go, onView, setDivFilter }) {
  const { db, isAdmin, actions } = ctx;
  const ms = db.members.filter(m => m.division_id === division.id).sort((a, b) => peranRank[a.peran] - peranRank[b.peran] || a.nama.localeCompare(b.nama, 'id'));
  const canAdd = ctx.canManageMembers(division.id);
  const pic = db.members.find(m => m.id === division.pic_id);
  const bph = db.members.filter(m => db.divisions.find(d => d.id === m.division_id)?.jenis === 'bph');
  const ls = leafTasks(db.tasks.filter(t => t.kategori !== 'admin' && t.division_id === division.id));
  const tot = expenseTotals(db.expenses, division.id);
  const [f, setF] = useState({ nama: '', email: '', kelas: '', jabatan: '', sub_sie: '', peran: 'anggota' });
  const [busy, setBusy] = useState(false);
  const set = k => e => setF(v => ({ ...v, [k]: e.target.value }));
  const add = async e => {
    e.preventDefault();
    const email = f.email.trim().toLowerCase();
    if (email && !isEmail(email)) { actions.toast('Format email belum benar', 'err'); return; }
    setBusy(true);
    const ok = await actions.addMember({
      nama: f.nama.trim(), email: email || null, kelas: f.kelas.trim() || null, jabatan: f.jabatan.trim() || null,
      sub_sie: f.sub_sie || null, division_id: division.id, peran: isAdmin ? f.peran : 'anggota',
    });
    setBusy(false);
    if (ok) setF({ nama: '', email: '', kelas: '', jabatan: '', sub_sie: '', peran: 'anggota' });
  };
  return (
    <>
      {isAdmin && <button className="mk-back" onClick={onBack}><I n="chevron-left" /> Semua divisi</button>}
      <div className="mk-page-h"><div><h2>{division.nama}</h2><p className="mk-hint">{ms.length} orang{division.target_anggota ? `, target ${division.target_anggota} anggota + koordinator` : ''}</p></div></div>

      <div className="mk-tiles">
        <button className="mk-tile" onClick={() => { setDivFilter(division.id); go('tugas'); }}><b>{ls.filter(t => t.status === 'selesai').length}/{ls.length}</b><span>tugas selesai</span></button>
        <button className="mk-tile" onClick={() => { setDivFilter(division.id); go('dana'); }}><b className="mk-money" style={{ fontSize: '1.3rem' }}>{rp(tot.approved)}</b><span>terpakai dari {rp(division.budget)}</span></button>
        <button className="mk-tile" onClick={() => go('review')}><b>{db.submissions.filter(s => s.status === 'menunggu' && db.tasks.find(t => t.id === s.task_id)?.division_id === division.id).length}</b><span>link menunggu review</span></button>
        <div className="mk-tile"><b>{ms.filter(m => m.email).length}/{ms.length}</b><span>sudah punya email</span></div>
      </div>

      {division.sub_sie.length > 0 && <div className="mk-chipline">{division.sub_sie.map(x => <span key={x}>{x}</span>)}</div>}

      {isAdmin && division.jenis === 'sie' && (
        <div className="mk-field" style={{ marginTop: 16 }}>
          <label htmlFor="pic">PIC (anggota BPH)</label>
          <select id="pic" className="mk-select" value={division.pic_id || ''} onChange={e => actions.setPic(division.id, e.target.value || null)}>
            <option value="">-</option>{bph.map(m => <option key={m.id} value={m.id}>{m.nama}{m.jabatan ? ` (${m.jabatan})` : ''}</option>)}
          </select>
        </div>
      )}
      {!isAdmin && pic && <p className="mk-hint" style={{ marginTop: 12 }}>PIC: {pic.nama}</p>}

      <Section title="Anggota" note={canAdd ? '' : 'hanya bisa dilihat'}>
        {ms.map(m => <MemberRow key={m.id} m={m} ctx={ctx} onView={onView} />)}
      </Section>

      {canAdd && (
        <Section title="Tambah anggota">
          <form onSubmit={add} className="mk-card">
            <div className="mk-field"><label htmlFor="a-nama">Nama panggilan</label><input id="a-nama" className="mk-input" value={f.nama} onChange={set('nama')} maxLength={80} required /></div>
            <div className="mk-field"><label htmlFor="a-email">Email (boleh dikosongkan dulu)</label><input id="a-email" className="mk-input" type="email" value={f.email} onChange={set('email')} /></div>
            <div className="mk-row-2">
              <div className="mk-field"><label htmlFor="a-kelas">Kelas</label><input id="a-kelas" className="mk-input" value={f.kelas} onChange={set('kelas')} maxLength={20} /></div>
              <div className="mk-field"><label htmlFor="a-jab">Jabatan</label><input id="a-jab" className="mk-input" value={f.jabatan} onChange={set('jabatan')} maxLength={80} /></div>
            </div>
            {division.sub_sie.length > 0 && (
              <div className="mk-field"><label htmlFor="a-sub">Sub sie</label>
                <select id="a-sub" className="mk-select" value={f.sub_sie} onChange={set('sub_sie')}><option value="">-</option>{division.sub_sie.map(x => <option key={x} value={x}>{x}</option>)}</select>
              </div>
            )}
            {isAdmin && (
              <div className="mk-field"><label htmlFor="a-peran">Peran</label>
                <select id="a-peran" className="mk-select" value={f.peran} onChange={set('peran')}>{Object.entries(PERAN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
              </div>
            )}
            <button className="mk-btn mk-btn--primary" disabled={busy || !f.nama.trim()}>Tambah</button>
          </form>
        </Section>
      )}
    </>
  );
}

/* ── Dana & pengeluaran ── */
function BudgetEditor({ d, actions }) {
  const [v, setV] = useState(String(d.budget || ''));
  const num = Number(v.replace(/\D/g, '')) || 0;
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <input className="mk-input" inputMode="numeric" aria-label={`Budget ${d.nama}`} value={v} onChange={e => setV(e.target.value.replace(/\D/g, ''))} placeholder="Budget (Rp)" />
      <button className="mk-btn" disabled={num === Number(d.budget)} onClick={() => actions.setBudget(d.id, num)}>Simpan</button>
    </div>
  );
}

function ExpensesView({ ctx, divFilter, setDivFilter }) {
  const { db, isAdmin, actions, me } = ctx;
  const fixed = isAdmin ? '' : me.division_id;
  const selected = fixed || divFilter;
  const divs = isAdmin ? db.divisions : db.divisions.filter(d => d.id === me.division_id);
  const shown = selected ? divs.filter(d => d.id === selected) : divs;
  const canAdd = !!selected && ctx.canManageDivision(selected);
  const list = db.expenses.filter(e => !selected || e.division_id === selected).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const [f, setF] = useState({ tanggal: new Date().toISOString().slice(0, 10), keterangan: '', jumlah: '' });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [fileKey, setFileKey] = useState(0);
  const jumlah = Number(String(f.jumlah).replace(/\D/g, '')) || 0;
  const submit = async e => {
    e.preventDefault();
    if (!file) { actions.toast('Foto nota wajib diunggah', 'err'); return; }
    setBusy(true);
    const ok = await actions.addExpense({ division_id: selected, tanggal: f.tanggal, keterangan: f.keterangan.trim(), jumlah, file });
    setBusy(false);
    if (ok) { setF(v => ({ ...v, keterangan: '', jumlah: '' })); setFile(null); setFileKey(k => k + 1); }
  };

  return (
    <>
      <div className="mk-page-h"><div><h2>Dana & pengeluaran</h2><p className="mk-hint">Setiap pengeluaran wajib disertai foto nota. Admin yang menyetujui dan mengatur budget.</p></div></div>
      {isAdmin && (
        <div className="mk-field">
          <select className="mk-select" aria-label="Pilih divisi" value={divFilter} onChange={e => setDivFilter(e.target.value)}>
            <option value="">Semua divisi</option>
            {db.divisions.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
          </select>
        </div>
      )}

      {shown.map(d => {
        const t = expenseTotals(db.expenses, d.id);
        const sisa = Number(d.budget) - t.approved;
        return (
          <div key={d.id} className="mk-card">
            <div className="mk-card-h"><b>{d.nama}</b><span className="mk-money">Budget {rp(d.budget)}</span></div>
            <DanaBar budget={Number(d.budget)} approved={t.approved} pending={t.pending} />
            <p className="mk-hint mk-money" style={{ marginTop: 8 }}>
              Terpakai {rp(t.approved)} · menunggu {rp(t.pending)} · <span className={sisa < 0 ? 'mk-warn' : ''}>sisa {rp(sisa)}</span>
            </p>
            {isAdmin && <BudgetEditor key={`${d.id}-${d.budget}`} d={d} actions={actions} />}
          </div>
        );
      })}

      {canAdd && (
        <Section title="Catat pengeluaran">
          <form onSubmit={submit} className="mk-card">
            <div className="mk-row-2">
              <div className="mk-field"><label htmlFor="x-tgl">Tanggal</label><input id="x-tgl" className="mk-input" type="date" value={f.tanggal} onChange={e => setF(v => ({ ...v, tanggal: e.target.value }))} required /></div>
              <div className="mk-field"><label htmlFor="x-jml">Jumlah (Rp)</label><input id="x-jml" className="mk-input" inputMode="numeric" value={f.jumlah} onChange={e => setF(v => ({ ...v, jumlah: e.target.value.replace(/\D/g, '') }))} placeholder="50000" required /></div>
            </div>
            <p className="mk-hint mk-money" style={{ marginTop: -6, marginBottom: 10 }}>{jumlah > 0 ? rp(jumlah) : ''}</p>
            <div className="mk-field"><label htmlFor="x-ket">Untuk apa</label><input id="x-ket" className="mk-input" value={f.keterangan} onChange={e => setF(v => ({ ...v, keterangan: e.target.value }))} maxLength={300} required /></div>
            <div className="mk-field">
              <label htmlFor="x-file">Foto nota (wajib)</label>
              <input key={fileKey} id="x-file" className="mk-input" type="file" accept="image/jpeg,image/png,image/webp,application/pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)} required />
              <p className="mk-file-note">JPG, PNG, atau PDF. Foto dikecilkan otomatis. Maksimal 5 MB.</p>
            </div>
            <button className="mk-btn mk-btn--primary" disabled={busy || !file || !f.keterangan.trim() || jumlah <= 0}>{busy ? 'Mengunggah…' : 'Simpan pengeluaran'}</button>
          </form>
        </Section>
      )}
      {isAdmin && !selected && <p className="mk-hint" style={{ marginTop: 12 }}>Pilih satu divisi di atas untuk mencatat pengeluaran atas namanya.</p>}

      <Section title="Riwayat" note={`${list.length} catatan`}>
        {list.length === 0 && <p className="mk-empty">Belum ada pengeluaran.</p>}
        {list.map(e => {
          const own = e.dibuat_oleh === me.id;
          return (
            <div key={e.id} className="mk-exp">
              <div>
                <span style={{ fontWeight: 500, overflowWrap: 'anywhere' }}>{e.keterangan}</span>
                <p className="mk-hint">
                  {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: TZ }).format(new Date(`${e.tanggal}T12:00:00+07:00`))}
                  {!selected ? ` · ${ctx.divisionName(e.division_id)}` : ''} · {ctx.nameOf(e.dibuat_oleh)}
                </p>
                <p className="mk-hint"><span className={`mk-st ${e.status === 'disetujui' ? 'selesai' : e.status === 'ditolak' ? '' : 'review'}`}>{EXP_STATUS[e.status]}</span></p>
                {e.catatan && <p className="mk-hint">Catatan: {e.catatan}</p>}
              </div>
              <b>{rp(e.jumlah)}</b>
              <div className="mk-exp-actions">
                <button className="mk-btn mk-btn--sm" onClick={() => actions.openNota(e)}><I n="receipt" /> Lihat nota</button>
                {e.nota_drive_url && <a className="mk-btn mk-btn--sm" href={e.nota_drive_url} target="_blank" rel="noopener noreferrer"><I n="folder-open" /> Drive</a>}
                {isAdmin && e.status !== 'disetujui' && <button className="mk-btn mk-btn--sm mk-btn--primary" onClick={() => actions.setExpenseStatus(e, { status: 'disetujui', catatan: null })}>Setujui</button>}
                {isAdmin && e.status !== 'ditolak' && <button className="mk-btn mk-btn--sm" onClick={() => { const c = window.prompt('Alasan ditolak (boleh kosong)'); if (c !== null) actions.setExpenseStatus(e, { status: 'ditolak', catatan: c.trim() || null }); }}>Tolak</button>}
                {(isAdmin || (own && e.status === 'menunggu')) && <button className="mk-btn mk-btn--sm mk-btn--danger" onClick={() => actions.deleteExpense(e)}><I n="trash" /></button>}
              </div>
            </div>
          );
        })}
      </Section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   UPLOAD NOTA: kecilkan foto di browser sebelum diunggah
══════════════════════════════════════════════════════════════ */
const NOTA_MAX = 5 * 1024 * 1024;
async function prepareNota(file) {
  if (file.type === 'application/pdf') {
    if (file.size > NOTA_MAX) throw new Error('PDF terlalu besar (maksimal 5 MB).');
    return { blob: file, type: 'application/pdf', ext: 'pdf' };
  }
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const g = canvas.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
    g.drawImage(bmp, 0, 0, w, h);
    for (const q of [0.85, 0.7, 0.55]) {
      const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', q));
      if (blob && blob.size <= NOTA_MAX) return { blob, type: 'image/jpeg', ext: 'jpg' };
    }
    throw new Error('Foto terlalu besar. Coba foto ulang dengan resolusi lebih kecil.');
  } catch (e) {
    if (e && /terlalu besar/.test(e.message || '')) throw e;
    if (allowed.includes(file.type) && file.size <= NOTA_MAX) {
      return { blob: file, type: file.type, ext: file.type.split('/')[1].replace('jpeg', 'jpg') };
    }
    throw new Error('Format foto tidak didukung. Pakai JPG, PNG, atau PDF.', { cause: e });
  }
}

const friendlyError = e => {
  const m = e?.message || '';
  if (/makrab_members_email_key|duplicate key/.test(m)) return 'Email itu sudah dipakai orang lain.';
  if (/row-level security|permission denied/.test(m)) return 'Kamu tidak punya izin untuk itu.';
  if (/Failed to fetch|NetworkError|Load failed/.test(m)) return 'Koneksi bermasalah. Coba lagi.';
  if (/JSON object requested/.test(m)) return 'Tidak ada yang berubah. Mungkin kamu tidak punya izin, atau datanya sudah dihapus.';
  return m || 'Terjadi kesalahan';
};

/* ══════════════════════════════════════════════════════════════
   WORKSPACE (setelah login & terdaftar)
══════════════════════════════════════════════════════════════ */
const NI = {
  home: { k: 'home', l: 'Beranda', i: 'house' },
  kuliah: { k: 'kuliah', l: 'Kuliah', i: 'graduation-cap' },
  makrab: { k: 'makrab', l: 'Makrab', i: 'people-group' },
  jadwal: { k: 'jadwal', l: 'Jadwal', i: 'calendar-days' },
  todo: { k: 'todo', l: 'To-do', i: 'clipboard-check' },
  dana: { k: 'dana', l: 'Dana', i: 'wallet' },
  ringkasan: { k: 'ringkasan', l: 'Ringkasan', i: 'chart-simple' },
  review: { k: 'review', l: 'Review', i: 'inbox' },
  tugas: { k: 'tugas', l: 'Tugas', i: 'list-check' },
  divisi: { k: 'divisi', l: 'Divisi', i: 'sitemap' },
  anggota: { k: 'anggota', l: 'Anggota', i: 'users' },
};
const NAV_KELOLA_ADMIN = [NI.ringkasan, NI.review, NI.tugas, NI.divisi, NI.dana];
const NAV_KELOLA_KOORD = [NI.ringkasan, NI.review, NI.tugas, NI.anggota, NI.dana];
const NAV_SAYA_MANAGER = [NI.home, NI.kuliah, NI.makrab, NI.jadwal, NI.todo];
const NAV_SAYA_ANGGOTA = [NI.home, NI.kuliah, NI.makrab, NI.jadwal, NI.dana];

function Workspace({ user, me, theme, onTheme }) {
  const isAdmin = !!me.is_admin;
  const isKoord = me.peran === 'koordinator';
  const canManage = isAdmin || isKoord;
  const [toasts, toast] = useToasts();
  const [mode, setMode] = useState(canManage ? 'kelola' : 'saya');
  const [tab, setTab] = useState(canManage ? 'ringkasan' : 'home');
  const [sheet, setSheet] = useState(null);
  const [viewAs, setViewAs] = useState('');
  const [divFilter, setDivFilter] = useState('');
  const [openDiv, setOpenDiv] = useState('');
  const [, setPermTick] = useState(0);
  const dbRef = useRef(EMPTY_DB);

  /* Notifikasi saat data baru masuk lewat realtime */
  const onEvent = useCallback((name, payload) => {
    const row = payload.new;
    const d = dbRef.current;
    const title = id => d.tasks.find(t => t.id === id)?.judul || 'tugas';
    const nm = id => d.members.find(m => m.id === id)?.nama || 'Seseorang';
    let msg = '';
    if (payload.eventType === 'INSERT') {
      if (name === 'makrab_submissions' && canManage && row.author_id !== me.id) msg = `${nm(row.author_id)} kirim link: ${title(row.task_id)}`;
      else if (name === 'makrab_comments' && row.author_id !== me.id) msg = `${nm(row.author_id)} komentar di ${title(row.task_id)}`;
      else if (name === 'makrab_reviews') {
        const sub = d.submissions.find(s => s.id === row.submission_id);
        if (sub && sub.author_id === me.id) msg = 'Ada revisi baru untuk link-mu';
      } else if (name === 'makrab_task_assignees' && row.member_id === me.id) msg = 'Kamu dapat tugas baru';
      else if (name === 'makrab_expenses' && isAdmin && row.dibuat_oleh !== me.id) msg = `Pengeluaran baru menunggu persetujuan: ${row.keterangan}`;
    } else if (payload.eventType === 'UPDATE' && name === 'makrab_expenses' && row.dibuat_oleh === me.id && row.status !== 'menunggu') {
      msg = `Pengeluaranmu ${row.status === 'disetujui' ? 'disetujui' : 'ditolak'}: ${row.keterangan}`;
    }
    if (msg) { toast(msg); pushBrowser('Makrab 2026', msg); }
  }, [canManage, isAdmin, me.id, toast]);

  const { db, ready, live, error, reload, upsertLocal, removeLocal } = useMakrabData(me, isAdmin, onEvent);
  useEffect(() => { dbRef.current = db; });

  const nameOf = useCallback(id => db.members.find(m => m.id === id)?.nama || 'Seseorang', [db.members]);
  const divisionName = useCallback(id => db.divisions.find(d => d.id === id)?.nama || '', [db.divisions]);
  const viewMember = isAdmin && viewAs ? db.members.find(m => m.id === viewAs) : null;
  const sayaMode = !!viewMember || mode === 'saya' || !canManage;
  const subject = viewMember || me;
  const personalTasks = useMemo(() => visibleForMember(db.tasks, db.assignees, subject), [db.tasks, db.assignees, subject]);
  const ctxDb = viewMember ? { ...db, tasks: personalTasks } : db;
  const scope = isAdmin ? '' : (me.division_id || '');

  /* Notifikasi di dalam halaman */
  const seenKey = `makrab:seen:${me.id}`;
  const [seen, setSeen] = useState(() => {
    try {
      const s = localStorage.getItem(seenKey);
      if (s) return s;
      const now = new Date().toISOString();
      localStorage.setItem(seenKey, now);
      return now;
    } catch { return new Date().toISOString(); }
  });
  const notices = useMemo(() => buildNotices({ me, canManage, db, nameOf }), [me, canManage, db, nameOf]);
  const unread = notices.filter(n => new Date(n.t) > new Date(seen)).length;
  const markSeen = () => {
    const now = new Date().toISOString();
    try { localStorage.setItem(seenKey, now); } catch { /* abaikan */ }
    setSeen(now);
  };

  /* Pengingat jatuh tempo: dicek saat halaman terbuka & tiap kali tab difokuskan */
  const fired = useRef(new Set());
  useEffect(() => {
    const check = () => {
      const now = Date.now();
      db.reminders.forEach(r => {
        if (r.member_id !== me.id || r.dikirim || fired.current.has(r.id) || new Date(r.waktu).getTime() > now) return;
        fired.current.add(r.id);
        const t = db.tasks.find(x => x.id === r.task_id);
        toast(`Pengingat: ${t?.judul || 'tugas'}`);
        pushBrowser('Pengingat tugas', t?.judul || '');
        supabase.from('makrab_reminders').update({ dikirim: true }).eq('id', r.id).select().single()
          .then(({ data }) => { if (data) upsertLocal('makrab_reminders', data); });
      });
    };
    check();
    const iv = setInterval(check, 60000);
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', check);
    return () => { clearInterval(iv); window.removeEventListener('focus', check); document.removeEventListener('visibilitychange', check); };
  }, [db.reminders, db.tasks, me.id, toast, upsertLocal]);

  /* ── Aksi data (RLS di database yang menentukan boleh/tidak; UI hanya menyembunyikan) ── */
  const run = async (fn, okMsg) => {
    try { const r = await fn(); if (okMsg) toast(okMsg); return r === undefined ? true : r; }
    catch (e) { toast(friendlyError(e), 'err'); return false; }
  };
  const one = async q => { const { data, error: e } = await q.select().single(); if (e) throw e; return data; };

  const actions = {
    toast,
    openTask: id => setSheet({ type: 'task', id }),
    openForm: defaults => setSheet({ type: 'form', defaults }),
    askNotify: () => { if (canNotify()) Notification.requestPermission().then(() => setPermTick(x => x + 1)); },

    setStatus: (t, status) => run(async () => {
      const row = await one(supabase.from('makrab_tasks').update({ status }).eq('id', t.id));
      upsertLocal('makrab_tasks', row);
    }),
    toggleDone: t => actions.setStatus(t, t.status === 'selesai' ? 'todo' : 'selesai'),

    saveTask: (values, id, assigneeIds) => run(async () => {
      const payload = { ...values };
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
      let row;
      if (id) {
        row = await one(supabase.from('makrab_tasks').update(payload).eq('id', id));
      } else {
        const sibs = db.tasks.filter(x => x.kategori === payload.kategori
          && (x.parent_id || null) === (payload.parent_id || null)
          && (x.division_id || null) === (payload.division_id || null)
          && (payload.kategori !== 'admin' || x.dibuat_oleh === me.id));
        payload.urutan = sibs.reduce((m, x) => Math.max(m, x.urutan), 0) + 1;
        payload.dibuat_oleh = me.id;
        row = await one(supabase.from('makrab_tasks').insert(payload));
      }
      upsertLocal('makrab_tasks', row);
      if (assigneeIds) {
        const cur = db.assignees.filter(a => a.task_id === row.id).map(a => a.member_id);
        const add = assigneeIds.filter(m => !cur.includes(m));
        const del = cur.filter(m => !assigneeIds.includes(m));
        if (del.length) {
          const { error: e } = await supabase.from('makrab_task_assignees').delete().eq('task_id', row.id).in('member_id', del);
          if (e) throw e;
          del.forEach(m => removeLocal('makrab_task_assignees', { task_id: row.id, member_id: m }));
        }
        if (add.length) {
          const { data, error: e } = await supabase.from('makrab_task_assignees').insert(add.map(m => ({ task_id: row.id, member_id: m }))).select();
          if (e) throw e;
          (data || []).forEach(a => upsertLocal('makrab_task_assignees', a));
        }
      } else if (!id && payload.kategori === 'kuliah' && payload.division_id === undefined) {
        const a = await one(supabase.from('makrab_task_assignees').insert({ task_id: row.id, member_id: me.id }));
        upsertLocal('makrab_task_assignees', a);
      }
      toast(id ? 'Tugas disimpan' : 'Tugas ditambahkan');
      return row;
    }),

    deleteTask: async (t, after) => {
      if (!window.confirm(`Hapus "${t.judul}"? Sub-tugas, komentar, dan link-nya ikut terhapus.`)) return false;
      return run(async () => {
        const { error: e } = await supabase.from('makrab_tasks').delete().eq('id', t.id);
        if (e) throw e;
        await reload();
        after?.();
      }, 'Tugas dihapus');
    },

    moveTask: (t, dir) => run(async () => {
      const sibs = db.tasks
        .filter(x => x.kategori === t.kategori && (x.parent_id || null) === (t.parent_id || null)
          && (x.division_id || null) === (t.division_id || null) && (t.kategori !== 'admin' || x.dibuat_oleh === t.dibuat_oleh))
        .sort((a, b) => a.urutan - b.urutan || new Date(a.created_at) - new Date(b.created_at));
      const i = sibs.findIndex(x => x.id === t.id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= sibs.length) return true;
      [sibs[i], sibs[j]] = [sibs[j], sibs[i]];
      const changed = sibs.map((x, n) => ({ x, urutan: n + 1 })).filter(({ x, urutan }) => x.urutan !== urutan);
      const rows = await Promise.all(changed.map(({ x, urutan }) => one(supabase.from('makrab_tasks').update({ urutan }).eq('id', x.id))));
      rows.forEach(r => upsertLocal('makrab_tasks', r));
      return true;
    }),

    addComment: (taskId, isi) => run(async () => {
      const row = await one(supabase.from('makrab_comments').insert({ task_id: taskId, author_id: me.id, isi }));
      upsertLocal('makrab_comments', row);
    }),

    sendSubmission: (taskId, url, catatan) => run(async () => {
      const row = await one(supabase.from('makrab_submissions').insert({ task_id: taskId, author_id: me.id, url, catatan: catatan || null }));
      upsertLocal('makrab_submissions', row);
      await reload();
    }, 'Link terkirim'),

    reviewSubmission: (sub, { isi, status }) => run(async () => {
      if (isi) {
        const r = await one(supabase.from('makrab_reviews').insert({ submission_id: sub.id, isi }));
        upsertLocal('makrab_reviews', r);
      }
      if (status && status !== sub.status) {
        const s = await one(supabase.from('makrab_submissions').update({ status }).eq('id', sub.id));
        upsertLocal('makrab_submissions', s);
      }
      await reload();
    }, 'Tersimpan'),

    setReminder: (t, key) => run(async () => {
      const mine = db.reminders.filter(r => r.task_id === t.id && r.member_id === me.id && !r.dikirim);
      if (mine.length) {
        const { error: e } = await supabase.from('makrab_reminders').delete().eq('task_id', t.id).eq('member_id', me.id).eq('dikirim', false);
        if (e) throw e;
        mine.forEach(r => removeLocal('makrab_reminders', { id: r.id }));
      }
      if (!key) return true;
      const opt = REMINDER_OPTS.find(o => o.key === key);
      const waktu = new Date(new Date(t.deadline).getTime() - opt.ms);
      if (waktu.getTime() <= Date.now()) throw new Error('Waktu pengingat itu sudah lewat. Pilih yang lebih dekat.');
      const row = await one(supabase.from('makrab_reminders').insert({ task_id: t.id, member_id: me.id, waktu: waktu.toISOString() }));
      upsertLocal('makrab_reminders', row);
      return true;
    }, 'Pengingat diatur'),

    /* ── anggota & divisi ── */
    addMember: m => run(async () => {
      const row = await one(supabase.from('makrab_members').insert(m));
      upsertLocal('makrab_members', row);
    }, 'Anggota ditambahkan'),
    updateMember: (id, patch) => run(async () => {
      const row = await one(supabase.from('makrab_members').update(patch).eq('id', id));
      upsertLocal('makrab_members', row);
    }, 'Tersimpan'),
    removeMember: async m => {
      if (!window.confirm(`Hapus ${m.nama} dari struktur? Penugasannya ikut hilang; tugasnya tetap ada.`)) return false;
      return run(async () => {
        const { error: e } = await supabase.from('makrab_members').delete().eq('id', m.id);
        if (e) throw e;
        removeLocal('makrab_members', { id: m.id });
        if (viewAs === m.id) setViewAs('');
        await reload();
      }, 'Anggota dihapus');
    },
    setBudget: (divisionId, budget) => run(async () => {
      const row = await one(supabase.from('makrab_divisions').update({ budget }).eq('id', divisionId));
      upsertLocal('makrab_divisions', row);
    }, 'Budget disimpan'),
    setPic: (divisionId, picId) => run(async () => {
      const row = await one(supabase.from('makrab_divisions').update({ pic_id: picId }).eq('id', divisionId));
      upsertLocal('makrab_divisions', row);
    }, 'PIC disimpan'),

    /* ── pengeluaran & nota ── */
    addExpense: ({ division_id, tanggal, keterangan, jumlah, file }) => run(async () => {
      const prepared = await prepareNota(file);
      const path = `${division_id}/${crypto.randomUUID()}.${prepared.ext}`;
      const up = await supabase.storage.from('makrab-nota').upload(path, prepared.blob, { contentType: prepared.type, upsert: false });
      if (up.error) throw up.error;
      let row;
      try {
        row = await one(supabase.from('makrab_expenses').insert({ division_id, tanggal, keterangan, jumlah, nota_path: path }));
      } catch (e) {
        await supabase.storage.from('makrab-nota').remove([path]);
        throw e;
      }
      upsertLocal('makrab_expenses', row);
      // Salin ke Google Drive (opsional, tidak boleh menggagalkan pencatatan)
      supabase.functions.invoke('makrab-nota-drive', { body: { expense_id: row.id } })
        .then(({ data }) => { if (data?.drive_url) upsertLocal('makrab_expenses', { ...row, nota_drive_url: data.drive_url }); })
        .catch(() => {});
      return row;
    }, 'Pengeluaran tercatat'),
    setExpenseStatus: (exp, { status, catatan }) => run(async () => {
      const row = await one(supabase.from('makrab_expenses').update({ status, catatan }).eq('id', exp.id));
      upsertLocal('makrab_expenses', row);
    }, 'Tersimpan'),
    deleteExpense: async exp => {
      if (!window.confirm(`Hapus catatan "${exp.keterangan}"?`)) return false;
      return run(async () => {
        const { error: e } = await supabase.from('makrab_expenses').delete().eq('id', exp.id);
        if (e) throw e;
        removeLocal('makrab_expenses', { id: exp.id });
        await supabase.storage.from('makrab-nota').remove([exp.nota_path]);
      }, 'Catatan dihapus');
    },
    openNota: async exp => {
      const w = window.open('about:blank', '_blank');
      try {
        const { data, error: e } = await supabase.storage.from('makrab-nota').createSignedUrl(exp.nota_path, 300);
        if (e) throw e;
        if (w) { w.opener = null; w.location.href = data.signedUrl; } else window.location.href = data.signedUrl;
      } catch (e) {
        if (w) w.close();
        toast(friendlyError(e), 'err');
      }
    },
  };

  const ctx = {
    me, isAdmin, isKoord, canManage, db: ctxDb, nameOf, actions, divisionName,
    canManageTask: t => t.kategori !== 'admin' && (isAdmin || (isKoord && !!t.division_id && t.division_id === me.division_id)),
    canManageDivision: id => !!id && (isAdmin || (isKoord && me.division_id === id)),
    canManageMembers: id => !!id && (isAdmin || (isKoord && !!me.izin_anggota && me.division_id === id)),
  };

  /* Navigasi */
  const subjectIsManager = !!viewMember && (viewMember.peran === 'koordinator' || viewMember.peran === 'admin');
  let navItems;
  if (viewMember) navItems = subjectIsManager ? NAV_SAYA_MANAGER.filter(n => n.k !== 'todo') : NAV_SAYA_ANGGOTA;
  else if (!canManage) navItems = NAV_SAYA_ANGGOTA;
  else if (mode === 'saya') navItems = NAV_SAYA_MANAGER;
  else navItems = isAdmin ? NAV_KELOLA_ADMIN : NAV_KELOLA_KOORD;
  const withSwitch = canManage && !viewMember
    ? [...navItems, { k: '__mode', l: mode === 'kelola' ? 'Saya' : 'Kelola', i: 'right-left' }]
    : navItems;

  const waiting = db.submissions.filter(s => s.status === 'menunggu' && (isAdmin || db.tasks.find(t => t.id === s.task_id)?.division_id === me.division_id)).length;
  const go = k => {
    if (k === '__mode') { const next = mode === 'kelola' ? 'saya' : 'kelola'; setMode(next); setTab(next === 'kelola' ? 'ringkasan' : 'home'); }
    else setTab(k);
    window.scrollTo(0, 0);
  };
  const startViewAs = id => { setViewAs(id); setTab('home'); window.scrollTo(0, 0); };
  const stopViewAs = () => { setViewAs(''); setTab(mode === 'kelola' ? 'divisi' : 'home'); };
  const openDivision = id => { setOpenDiv(id); setTab('divisi'); window.scrollTo(0, 0); };
  const closeSheet = () => setSheet(null);

  const renderNav = side => withSwitch.map(n => (
    <button key={n.k} className={`${side ? 'mk-nav-btn' : ''}${tab === n.k ? ' on' : ''}`} onClick={() => go(n.k)} aria-current={tab === n.k ? 'page' : undefined}>
      <I n={n.i} />{side ? <span>{n.l}</span> : n.l}
      {n.k === 'review' && waiting > 0 && (side ? <em>{waiting}</em> : <span className="mk-dot" style={{ top: 6, right: '24%' }}>{waiting}</span>)}
    </button>
  ));

  let view;
  if (!ready && !error) view = <p className="mk-empty" role="status">Memuat data…</p>;
  else if (error) {
    const missing = /relation|does not exist|schema cache|Could not find/i.test(error);
    view = (
      <div className="mk-card">
        <p className="mk-err">{missing ? 'Tabel Makrab belum lengkap di database. Jalankan supabase/makrab.sql, makrab-v2.sql, lalu makrab-v3.sql.' : `Gagal memuat data: ${error}`}</p>
        <button className="mk-btn" onClick={() => reload().catch(() => {})}>Coba lagi</button>
      </div>
    );
  } else if (sayaMode) {
    if (tab === 'kuliah') view = <KuliahView tasks={personalTasks} ctx={ctx} />;
    else if (tab === 'makrab') view = <MakrabView tasks={personalTasks} ctx={ctx} />;
    else if (tab === 'jadwal') view = <AgendaView tasks={personalTasks} ctx={ctx} />;
    else if (tab === 'todo' && !viewMember) view = <AdminTodo ctx={ctx} />;
    else if (tab === 'dana') view = <ExpensesView ctx={ctx} divFilter={divFilter} setDivFilter={setDivFilter} />;
    else view = <MemberHome tasks={personalTasks} ctx={ctx} go={go} />;
  } else if (tab === 'review') view = <ReviewView ctx={ctx} scope={scope} />;
  else if (tab === 'tugas') view = <AdminTasks ctx={ctx} scope={scope} divFilter={divFilter} setDivFilter={setDivFilter} />;
  else if (tab === 'dana') view = <ExpensesView ctx={ctx} divFilter={divFilter} setDivFilter={setDivFilter} />;
  else if (tab === 'divisi' && isAdmin) {
    const d = db.divisions.find(x => x.id === openDiv);
    view = d
      ? <DivisionDetail ctx={ctx} division={d} onBack={() => setOpenDiv('')} go={go} onView={startViewAs} setDivFilter={setDivFilter} />
      : <DivisionsView ctx={ctx} onOpen={setOpenDiv} />;
  } else if (tab === 'anggota' && isKoord) {
    const d = db.divisions.find(x => x.id === me.division_id);
    view = d ? <DivisionDetail ctx={ctx} division={d} onBack={() => {}} go={go} onView={startViewAs} setDivFilter={setDivFilter} /> : <p className="mk-empty">Kamu belum masuk divisi mana pun. Hubungi admin.</p>;
  } else view = <Overview ctx={ctx} go={go} onView={startViewAs} onDivision={openDivision} scope={scope} />;

  const roleLabel = isAdmin ? 'Admin' : isKoord ? `Koordinator${me.division_id ? ` ${divisionName(me.division_id)}` : ''}` : (me.division_id ? divisionName(me.division_id) : 'Anggota');

  return (
    <div className="mk-shell">
      <aside className="mk-side" aria-label="Menu">
        <div className="mk-brand"><b>Makrab 2026</b><span>Kepanitiaan GONGG</span></div>
        {renderNav(true)}
        <div className="mk-side-foot">
          <b>{me.nama}</b>
          <small>{roleLabel} · {user.email}</small>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <button className="mk-btn mk-btn--sm" onClick={() => onTheme(theme === 'dark' ? 'light' : 'dark')}><I n={theme === 'dark' ? 'sun' : 'moon'} /> {theme === 'dark' ? 'Terang' : 'Gelap'}</button>
            <button className="mk-btn mk-btn--sm" onClick={() => signOut()}><I n="right-from-bracket" /> Keluar</button>
          </div>
        </div>
      </aside>

      <div>
        <header className="mk-top">
          <h1>Makrab 2026<small> · {roleLabel}</small></h1>
          <span className={`mk-live${live ? ' on' : ''}`} title={live ? 'Tersambung (live)' : 'Belum tersambung ke update langsung'} role="status" aria-label={live ? 'Live' : 'Offline'} />
          <button className="mk-icon-btn" onClick={() => onTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}>
            <I n={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <button className="mk-icon-btn" onClick={() => setSheet({ type: 'notif' })} aria-label={`Notifikasi, ${unread} belum dibaca`}>
            <I n="bell" />{unread > 0 && <span className="mk-dot">{unread > 9 ? '9+' : unread}</span>}
          </button>
          <button className="mk-icon-btn mk-top-out" onClick={() => signOut()} aria-label="Keluar"><I n="right-from-bracket" /></button>
        </header>
        <main className="mk-main">
          {viewMember && (
            <div className="mk-viewas">
              <span>Melihat dashboard pribadi <b>{viewMember.nama}</b>. Aksi yang kamu lakukan tetap atas namamu.</span>
              <button className="mk-btn mk-btn--sm" onClick={stopViewAs}>Kembali</button>
            </div>
          )}
          {view}
        </main>
      </div>

      <nav className="mk-bottom" aria-label="Menu utama">{renderNav(false)}</nav>

      {sheet?.type === 'task' && (
        <TaskDetail key={sheet.id} id={sheet.id} ctx={{ ...ctx, db }} onClose={closeSheet} onEdit={t => setSheet({ type: 'form', initial: t, back: t.id })} />
      )}
      {sheet?.type === 'form' && (
        <TaskForm
          ctx={{ ...ctx, db }}
          initial={sheet.initial}
          defaults={sheet.defaults}
          onClose={() => (sheet.back ? setSheet({ type: 'task', id: sheet.back }) : closeSheet())}
          onSaved={row => (sheet.initial ? setSheet({ type: 'task', id: row.id }) : closeSheet())}
        />
      )}
      {sheet?.type === 'notif' && (
        <NotifPanel ctx={ctx} notices={notices} seen={seen} onClose={closeSheet} onMarkSeen={markSeen} />
      )}

      <div className="mk-toasts" aria-live="polite">
        {toasts.map(t => <div key={t.id} className={`mk-toast${t.type === 'err' ? ' err' : ''}`}>{t.text}</div>)}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HALAMAN
══════════════════════════════════════════════════════════════ */
function initialTheme() {
  try {
    const t = localStorage.getItem('makrab:theme');
    if (t === 'dark' || t === 'light') return t;
  } catch { /* abaikan */ }
  return 'dark';
}

export default function Makrab() {
  const [phase, setPhase] = useState('loading'); // loading | login | unregistered | error | ready
  const [user, setUser] = useState(null);
  const [me, setMe] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  const [theme, setTheme] = useState(initialTheme);
  const changeTheme = t => { setTheme(t); try { localStorage.setItem('makrab:theme', t); } catch { /* abaikan */ } };

  /* Turn off site-wide effects (custom cursor, Lenis) on this page */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('mk-route');
    try { window.__lenis?.stop(); } catch { /* ignore */ }
    return () => { root.classList.remove('mk-route'); try { window.__lenis?.start(); } catch { /* ignore */ } };
  }, []);

  /* Halaman privat: jangan diindeks */
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Makrab 2026 · GONGG';
    const meta = document.createElement('meta');
    meta.name = 'robots'; meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    return () => { document.title = prevTitle; meta.remove(); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const unsub = onAuthStateChanged(auth, async u => {
      if (cancelled) return;
      if (!u) { setUser(null); setMe(null); setPhase('login'); return; }
      setUser(u);
      setPhase('loading');
      try {
        const { data, error } = await supabase.from('makrab_members').select('*');
        if (error) throw error;
        const email = (u.email || '').toLowerCase();
        let row = (data || []).find(r => r.email === email);
        // Admin tidak boleh terkunci kalau barisnya hilang
        if (!row && ADMIN_EMAILS[email] && u.emailVerified) {
          const ins = await supabase.from('makrab_members').insert({ email, nama: ADMIN_EMAILS[email], peran: 'admin' }).select().single();
          if (ins.error) throw ins.error;
          row = ins.data;
        }
        if (cancelled) return;
        if (!row) { setPhase('unregistered'); return; }
        setMe(row);
        setPhase('ready');
      } catch (e) {
        if (cancelled) return;
        const msg = e?.message || 'Gagal memuat';
        setErrMsg(/relation|does not exist|schema cache|Could not find/i.test(msg)
          ? 'Tabel Makrab belum ada di database. Jalankan supabase/makrab.sql, makrab-v2.sql, lalu makrab-v3.sql di SQL Editor Supabase.'
          : msg);
        setPhase('error');
      }
    });
    return () => { cancelled = true; unsub(); };
  }, []);

  return (
    <div className="mk dash" data-theme={theme}>
      <style>{THEME_CSS + CSS + OVERRIDE_CSS}</style>
      {phase === 'loading' && <Loading />}
      {phase === 'login' && <LoginGate />}
      {phase === 'unregistered' && user && <NotRegistered user={user} unverified={!user.emailVerified} />}
      {phase === 'error' && (
        <div className="mk-gate"><div className="mk-gate-box">
          <h1>Belum bisa dibuka</h1>
          <p>{errMsg}</p>
          <button className="mk-btn" onClick={() => window.location.reload()}>Muat ulang</button>
        </div></div>
      )}
      {phase === 'ready' && me && <Workspace user={user} me={me} theme={theme} onTheme={changeTheme} />}
    </div>
  );
}
