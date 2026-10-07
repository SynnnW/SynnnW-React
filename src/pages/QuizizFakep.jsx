// src/pages/QuizizFakep.jsx
// 2 Mode: BELAJAR (200 soal) + LATSOL (50 soal, 60 menit)
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  signInAnonymously, onAuthStateChanged, signOut,
} from 'firebase/auth';
import {
  getFirestore, collection, doc, getDoc, setDoc,
  onSnapshot, query, orderBy, limit, serverTimestamp, where,
} from 'firebase/firestore';
import { questions } from '../data/quizQuestions';
import { questions50 } from '../data/quizQuestions50';
import './firebase';

const QUIZ_TITLE        = 'IBD HOTS Keperawatan';
const MAX_SCORE_200     = 2000;
const MAX_SCORE_50      = 500;
const LATSOL_MINUTES    = 60;
const PINNED_TOP        = { name: 'Ns Leo', score_200: 2000, score_50: 500 };
const QRIS_IMAGE        = '/assets/img/qris.jpg';
const LS_KEY            = 'qz_progress_v3';
const OPTION_LABELS     = ['A', 'B', 'C', 'D', 'E'];

const quizApp  = getApps().find(a => a.name === 'quiz') || initializeApp(getApp().options, 'quiz');
const quizAuth = getAuth(quizApp);
const quizDb   = getFirestore(quizApp);

const formatDur = (sec) => {
  if (sec == null || sec < 0) return '--';
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
};
const calcScore = (correct, total, maxScore) => Math.round((correct / total) * maxScore);
const isNsLeo = (name) => /ns\W*leo/i.test(name);

const CSS = `
.qz-root {
  --qz-bg:       #070709;
  --qz-surface:  rgba(255,255,255,0.04);
  --qz-surface2: rgba(255,255,255,0.07);
  --qz-border:   rgba(255,255,255,0.09);
  --qz-text:     #f4f4f6;
  --qz-text-strong: #ffffff;
  --qz-muted:    #8d8d99;
  --qz-primary:  #8b7bff;
  --qz-primary2: #5eead4;
  --qz-success:  #34d399;
  --qz-danger:   #fb7185;
  --qz-warning:  #fbbf24;
  --qz-font:     'Inter','Segoe UI',system-ui,sans-serif;
  --qz-font-d:   'Space Grotesk','Inter',sans-serif;
  font-family: var(--qz-font);
  background:  var(--qz-bg);
  color:       var(--qz-text);
  min-height:  100dvh;
  position:    relative;
  overflow-x:  hidden;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
.qz-root *, .qz-root *::before, .qz-root *::after { box-sizing: border-box; }
.qz-root::before, .qz-root::after {
  content: ''; position: fixed; z-index: 0; pointer-events: none;
  width: 420px; height: 420px; border-radius: 50%; filter: blur(110px);
}
.qz-root::before { background: var(--qz-primary);  top: -130px; left: -110px; opacity: .18; }
.qz-root::after  { background: var(--qz-primary2); bottom: -160px; right: -110px; opacity: .11; }
.qz-wrap {
  max-width: 560px; margin: 0 auto; padding: 0 18px 100px; position: relative; z-index: 1;
}
.qz-header {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 0 12px; border-bottom: 1px solid var(--qz-border);
  margin-bottom: 18px; position: sticky; top: 0;
  background: var(--qz-bg); z-index: 20;
}
.qz-header-title {
  flex: 1; font-family: var(--qz-font-d); font-size: .95rem; font-weight: 700;
}
.qz-back-btn {
  background: none; border: 1px solid var(--qz-border);
  color: var(--qz-muted); border-radius: 10px;
  padding: 7px 13px; font-size: .82rem; cursor: pointer;
  font-family: var(--qz-font); transition: all .2s;
}
.qz-back-btn:hover { color: var(--qz-text); border-color: var(--qz-primary); }
.qz-tabs {
  display: flex; gap: 5px; background: rgba(0,0,0,.25);
  border: 1px solid var(--qz-border); border-radius: 14px; padding: 5px; margin-bottom: 20px;
}
.qz-tab {
  flex: 1; padding: 10px 5px; background: none; border: none; border-radius: 10px;
  cursor: pointer; font: 600 .86rem var(--qz-font); color: var(--qz-muted); transition: all .2s;
}
.qz-tab:hover { color: var(--qz-text); background: var(--qz-surface); }
.qz-tab.qz-active {
  color: #fff; background: linear-gradient(135deg,rgba(139,123,255,.35),rgba(94,234,212,.15));
  box-shadow: inset 0 0 0 1px rgba(139,123,255,.4);
}
.qz-card {
  background: var(--qz-surface); border: 1px solid var(--qz-border);
  border-radius: 18px; backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 20px 50px rgba(0,0,0,.4);
}
.qz-badge {
  display: inline-block; font-size: .68rem; letter-spacing: .22em;
  color: var(--qz-primary2); border: 1px solid var(--qz-border);
  background: var(--qz-surface); padding: 5px 12px;
  border-radius: 999px; margin-bottom: 14px;
}
.qz-h1 {
  font-family: var(--qz-font-d); font-size: clamp(1.6rem,6vw,2.5rem);
  font-weight: 700; line-height: 1.1; letter-spacing: -.03em;
  background: linear-gradient(120deg,#fff 30%,var(--qz-primary) 70%,var(--qz-primary2));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  margin-bottom: 10px;
}
.qz-h2 { font-family: var(--qz-font-d); font-size: 1.4rem; font-weight: 700; color: var(--qz-text); margin-bottom: 12px; }
.qz-muted { color: var(--qz-muted); line-height: 1.65; font-size: .93rem; }
.qz-btn {
  display: block; width: 100%; min-height: 50px; padding: 13px 18px; border: 1px solid transparent;
  border-radius: 13px; cursor: pointer; font: 600 .93rem var(--qz-font);
  transition: all .22s; color: #fff; text-align: center; background: var(--qz-surface2);
}
.qz-btn:disabled { opacity: .42; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
.qz-btn-primary { background: linear-gradient(135deg,#8b7bff,#6d5df0); box-shadow: 0 8px 24px rgba(139,123,255,.35); }
.qz-btn-primary:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(139,123,255,.55); }
.qz-btn-secondary { background: var(--qz-surface2); border-color: var(--qz-border); color: var(--qz-text); }
.qz-btn-secondary:not(:disabled):hover { background: rgba(255,255,255,.1); transform: translateY(-1px); }
.qz-btn-success { background: linear-gradient(135deg,#10b981,#34d399); color: #04130d; box-shadow: 0 8px 24px rgba(52,211,153,.3); }
.qz-btn-success:not(:disabled):hover { transform: translateY(-2px); }
.qz-btn-sm { min-height: 38px; padding: 7px 14px; font-size: .83rem; width: auto; display: inline-block; border-radius: 9px; }
.qz-mode-options { display: flex; flex-direction: column; gap: 9px; margin-bottom: 20px; }
.qz-mode-card {
  padding: 16px 18px; background: var(--qz-surface); border: 2px solid var(--qz-border);
  border-radius: 14px; cursor: pointer; transition: all .18s; text-align: left;
}
.qz-mode-card:hover { border-color: rgba(139,123,255,.5); }
.qz-mode-card.qz-selected { border-color: var(--qz-primary); background: rgba(139,123,255,.1); }
.qz-mode-card h4 { font-family: var(--qz-font-d); font-size: .97rem; color: var(--qz-text); margin-bottom: 3px; }
.qz-mode-card p { color: var(--qz-muted); font-size: .83rem; line-height: 1.5; }
.qz-auth-section { background: var(--qz-surface); border: 1px solid var(--qz-border); border-radius: 14px; padding: 18px; margin-bottom: 18px; }
.qz-auth-section h4 { font-size: .8rem; color: var(--qz-muted); margin-bottom: 12px; letter-spacing: .07em; text-transform: uppercase; }
.qz-input {
  width: 100%; padding: 12px 15px; background: rgba(0,0,0,.35); color: var(--qz-text);
  border: 1px solid var(--qz-border); border-radius: 11px; font: 1rem var(--qz-font); transition: all .2s; margin-bottom: 9px;
}
.qz-input::placeholder { color: #55555f; }
.qz-input:focus { outline: none; border-color: var(--qz-primary); box-shadow: 0 0 0 3px rgba(139,123,255,.17); }
.qz-user-info {
  display: flex; align-items: center; gap: 10px; padding: 11px 13px;
  background: rgba(139,123,255,.07); border: 1px solid rgba(139,123,255,.22);
  border-radius: 11px; margin-bottom: 10px;
}
.qz-avatar {
  width: 34px; height: 34px; border-radius: 50%; overflow: hidden;
  background: linear-gradient(135deg,var(--qz-primary),var(--qz-primary2));
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: .82rem; color: #fff; flex-shrink: 0;
}
.qz-avatar img { width: 100%; height: 100%; object-fit: cover; }
.qz-user-name { flex: 1; font-size: .92rem; color: var(--qz-text); font-weight: 600; }
.qz-divider { text-align: center; color: var(--qz-muted); font-size: .78rem; margin: 10px 0; position: relative; }
.qz-divider::before, .qz-divider::after { content: ''; position: absolute; top: 50%; width: calc(50% - 18px); height: 1px; background: var(--qz-border); }
.qz-divider::before { left: 0; } .qz-divider::after { right: 0; }
.qz-howto { background: var(--qz-surface); border: 1px solid var(--qz-border); border-radius: 13px; padding: 16px; margin: 16px 0; }
.qz-howto h4 { color: var(--qz-primary2); font-size: .92rem; margin-bottom: 7px; }
.qz-howto ol { color: var(--qz-muted); padding-left: 17px; font-size: .86rem; line-height: 1.85; }
.qz-sticky-bar {
  position: sticky; top: 55px; z-index: 15;
  display: flex; gap: 7px; background: rgba(7,7,9,.93);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  padding: 9px 0; margin-bottom: 14px; border-bottom: 1px solid var(--qz-border);
}
.qz-stat-pill {
  flex: 1; text-align: center; padding: 7px 4px;
  background: var(--qz-surface); border: 1px solid var(--qz-border);
  border-radius: 9px; font-size: .72rem; color: var(--qz-muted);
}
.qz-stat-pill span { display: block; font-size: 1.05rem; font-weight: 700; font-family: var(--qz-font-d); font-variant-numeric: tabular-nums; }
.qz-stat-pill.qz-spTimer span { color: var(--qz-primary2); }
.qz-stat-pill.qz-spOk    span { color: var(--qz-success); }
.qz-stat-pill.qz-spWrong span { color: var(--qz-danger); }
.qz-stat-pill.qz-spScore span { background: linear-gradient(120deg,var(--qz-primary),var(--qz-primary2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.qz-stat-pill.qz-spWarn  span { color: var(--qz-warning); }
.qz-stat-pill.qz-spDanger span { color: var(--qz-danger); animation: qzPulse 1s ease-in-out infinite; }
.qz-prog-bar { background: var(--qz-surface2); height: 5px; border-radius: 999px; margin-bottom: 12px; overflow: hidden; }
.qz-prog-fill { height: 100%; background: linear-gradient(90deg,var(--qz-primary),var(--qz-primary2)); border-radius: 999px; transition: width .35s ease; box-shadow: 0 0 10px rgba(139,123,255,.55); }
.qz-q-counter { text-align: right; color: var(--qz-muted); font-size: .83rem; margin-bottom: 10px; font-variant-numeric: tabular-nums; }
.qz-q-text {
  background: var(--qz-surface); padding: 18px 20px; border-radius: 13px; margin-bottom: 16px;
  border: 1px solid var(--qz-border); border-left: 3px solid var(--qz-primary);
  font-weight: 500; line-height: 1.65; font-size: .97rem; color: var(--qz-text-strong);
}
.qz-options { display: flex; flex-direction: column; gap: 8px; }
.qz-option {
  display: flex; align-items: flex-start; gap: 11px;
  padding: 14px 15px; background: var(--qz-surface);
  border: 1px solid var(--qz-border); border-radius: 12px;
  cursor: pointer; transition: all .17s; line-height: 1.55;
  font-size: .91rem; text-align: left; width: 100%;
  color: var(--qz-text-strong); font-family: var(--qz-font); min-height: 50px;
}
.qz-option:not(.qz-locked):hover { border-color: rgba(139,123,255,.45); background: var(--qz-surface2); transform: translateX(3px); }
.qz-option.qz-locked  { cursor: default; }
.qz-option-lbl { font-weight: 700; color: var(--qz-primary); flex-shrink: 0; font-size: .82rem; margin-top: 1px; min-width: 17px; }
.qz-option.qz-sel { border-color: var(--qz-primary); background: rgba(139,123,255,.11); box-shadow: 0 0 0 2px rgba(139,123,255,.09); }
.qz-option.qz-sel .qz-option-lbl { color: var(--qz-primary); }
.qz-option.qz-correct   { border-color: var(--qz-success); background: rgba(52,211,153,.12); }
.qz-option.qz-correct   .qz-option-lbl { color: var(--qz-success); }
.qz-option.qz-incorrect { border-color: var(--qz-danger);  background: rgba(251,113,133,.12); }
.qz-option.qz-incorrect .qz-option-lbl { color: var(--qz-danger); }
.qz-feedback {
  margin-top: 14px; padding: 14px 17px;
  border-radius: 12px; border: 1px solid var(--qz-border);
  animation: qzFadeUp .28s ease;
}
.qz-fb-ok  { background: rgba(52,211,153,.08); border-color: rgba(52,211,153,.38); }
.qz-fb-err { background: rgba(251,113,133,.08); border-color: rgba(251,113,133,.38); }
.qz-feedback h4 { font-family: var(--qz-font-d); font-size: 1.02rem; margin-bottom: 5px; color: var(--qz-text-strong); }
.qz-fb-ok  h4 { color: var(--qz-success); }
.qz-fb-err h4 { color: var(--qz-danger); }
.qz-feedback p { color: #c9c9d2; font-size: .88rem; line-height: 1.6; margin-top: 4px; }
.qz-nav-btns { display: flex; gap: 9px; margin-top: 18px; }
.qz-nav-btns .qz-btn { flex: 1; }
.qz-alert { padding: 11px 15px; border-radius: 10px; font-size: .88rem; margin-bottom: 12px; animation: qzFadeUp .23s ease; line-height: 1.5; }
.qz-alert-info { background: rgba(94,234,212,.09); border: 1px solid rgba(94,234,212,.28); color: var(--qz-primary2); }
.qz-alert-warn { background: rgba(251,191,36,.09); border: 1px solid rgba(251,191,36,.28); color: var(--qz-warning); }
.qz-alert-err  { background: rgba(251,113,133,.09); border: 1px solid rgba(251,113,133,.28); color: var(--qz-danger); }
.qz-nav-toggle {
  position: fixed; bottom: 22px; right: 22px; z-index: 30;
  background: linear-gradient(135deg,var(--qz-primary),#6d5df0);
  color: #fff; border: none; border-radius: 13px;
  padding: 11px 17px; font: 600 .83rem var(--qz-font);
  cursor: pointer; box-shadow: 0 8px 24px rgba(139,123,255,.4);
  transition: transform .2s;
}
.qz-nav-toggle:hover { transform: translateY(-2px); }
.qz-stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-bottom: 18px; }
.qz-stat-card { background: var(--qz-surface); border: 1px solid var(--qz-border); border-radius: 13px; padding: 14px; text-align: center; }
.qz-stat-card h4 { color: var(--qz-muted); font-size: .7rem; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 7px; }
.qz-stat-card .qz-val { font-family: var(--qz-font-d); font-size: 1.8rem; font-weight: 700; background: linear-gradient(120deg,var(--qz-primary),var(--qz-primary2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.qz-lb-row { display: flex; align-items: center; gap: 9px; padding: 11px 12px; border-bottom: 1px solid var(--qz-border); }
.qz-lb-row:last-child { border-bottom: none; }
.qz-lb-row.qz-me { background: rgba(139,123,255,.07); border-radius: 9px; border: 1px solid rgba(139,123,255,.18); margin: 2px 0; }
.qz-lb-rank { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px; background: var(--qz-surface2); font-weight: 700; font-size: .83rem; flex-shrink: 0; }
.qz-lb-rank.qz-gold   { background: linear-gradient(135deg,#fde68a,#f59e0b); color: #2a1a00; }
.qz-lb-rank.qz-silver { background: linear-gradient(135deg,#f1f5f9,#94a3b8); color: #111827; }
.qz-lb-rank.qz-bronze { background: linear-gradient(135deg,#fdba74,#c2410c); color: #1f0b00; }
.qz-lb-avatar { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg,var(--qz-primary),var(--qz-primary2)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: .75rem; color: #fff; flex-shrink: 0; }
.qz-lb-avatar img { width: 100%; height: 100%; object-fit: cover; }
.qz-lb-name { font-size: .88rem; font-weight: 600; }
.qz-lb-meta { font-size: .7rem; color: var(--qz-muted); margin-top: 2px; }
.qz-lb-score { font-family: var(--qz-font-d); font-weight: 700; font-size: .97rem; background: linear-gradient(120deg,var(--qz-primary),var(--qz-primary2)); -webkit-background-clip: text; background-clip: text; color: transparent; white-space: nowrap; }
.qz-badge-mode { font-size: .66rem; padding: 2px 6px; border-radius: 999px; border: 1px solid var(--qz-border); background: var(--qz-surface); color: var(--qz-muted); flex-shrink: 0; }
.qz-me-tag { font-size: .62rem; background: var(--qz-primary); color: #fff; padding: 2px 6px; border-radius: 5px; margin-left: 4px; }
.qz-empty  { text-align: center; padding: 36px 18px; color: var(--qz-muted); font-size: .88rem; }
.qz-loading { text-align: center; padding: 36px 18px; color: var(--qz-muted); animation: qzPulse 1.2s ease-in-out infinite; }
@keyframes qzFadeUp  { from { opacity:0; transform:translateY(11px); } to { opacity:1; transform:none; } }
@keyframes qzSlideUp { from { opacity:0; transform:translateY(36px) scale(.97); } to { opacity:1; transform:none; } }
@keyframes qzPulse   { 0%,100%{opacity:1} 50%{opacity:.5} }
@media (prefers-reduced-motion: reduce) { .qz-modal-box,.qz-bs-box,.qz-feedback { animation: none; } .qz-prog-fill { transition: none; } }
.qz-modal-overlay {
  position: fixed; inset: 0; background: rgba(4,4,6,.83);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  display: flex; align-items: flex-end; justify-content: center;
  z-index: 9000; padding: 0;
}
.qz-modal-box {
  background: #0f0f14; border: 1px solid var(--qz-border);
  border-radius: 22px 22px 0 0; padding: 30px 22px 40px;
  width: 100%; max-width: 560px; max-height: 92dvh;
  overflow-y: auto; text-align: center;
  box-shadow: 0 0 60px rgba(139,123,255,.2); animation: qzSlideUp .38s ease;
}
.qz-result-score {
  font-family: var(--qz-font-d); font-size: 3.2rem; font-weight: 700;
  background: linear-gradient(120deg,var(--qz-primary),var(--qz-primary2));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  line-height: 1; margin: 7px 0 3px;
}
.qz-result-details {
  background: var(--qz-surface); border: 1px solid var(--qz-border);
  border-radius: 13px; padding: 13px 16px; margin: 16px 0; text-align: left;
}
.qz-result-row {
  display: flex; justify-content: space-between; padding: 5px 0;
  color: #c9c9d2; font-size: .88rem; border-bottom: 1px solid rgba(255,255,255,.04);
}
.qz-result-row:last-child { border-bottom: none; }
.qz-result-row span:last-child { font-weight: 600; color: var(--qz-text); }
.qz-qris-card { background: var(--qz-surface); border: 1px solid var(--qz-border); border-radius: 14px; padding: 16px; margin: 14px 0; text-align: center; }
.qz-qris-card h4 { color: var(--qz-text); margin-bottom: 7px; font-family: var(--qz-font-d); font-size: .97rem; }
.qz-qris-card p { color: var(--qz-muted); font-size: .83rem; line-height: 1.55; margin-bottom: 12px; }
.qz-qris-img { width: 170px; max-width: 100%; border-radius: 11px; cursor: zoom-in; transition: transform .2s; display: block; margin: 0 auto 10px; }
.qz-qris-img:hover { transform: scale(1.03); }
.qz-bs-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 8000; }
.qz-bs-box {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 560px; background: #0f0f14; border: 1px solid var(--qz-border);
  border-radius: 18px 18px 0 0; padding: 18px 16px 34px;
  z-index: 8001; max-height: 65dvh; overflow-y: auto;
  animation: qzSlideUp .28s ease;
}
.qz-bs-handle { width: 38px; height: 4px; background: var(--qz-border); border-radius: 999px; margin: 0 auto 14px; }
.qz-nav-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(42px,1fr)); gap: 7px; }
.qz-nav-cell {
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
  border-radius: 9px; border: 1px solid var(--qz-border); background: var(--qz-surface);
  font-weight: 700; font-size: .82rem; cursor: pointer; transition: all .14s; color: var(--qz-muted);
}
.qz-nav-cell:hover { border-color: var(--qz-primary); color: var(--qz-text); }
.qz-nav-cell.qz-nc-ok     { background: rgba(52,211,153,.16); border-color: var(--qz-success); color: var(--qz-success); }
.qz-nav-cell.qz-nc-err    { background: rgba(251,113,133,.16); border-color: var(--qz-danger);  color: var(--qz-danger); }
.qz-nav-cell.qz-nc-sel    { background: rgba(251,191,36,.12);  border-color: var(--qz-warning); color: var(--qz-warning); }
.qz-nav-cell.qz-nc-active {
  border-color: var(--qz-primary); background: rgba(139,123,255,.18);
  color: #fff; box-shadow: 0 0 0 2px rgba(139,123,255,.28);
}
.qz-qris-full {
  position: fixed; inset: 0; background: rgba(0,0,0,.92);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; cursor: zoom-out; padding: 18px;
}
.qz-qris-full img { max-width: 100%; max-height: 90dvh; border-radius: 14px; }
.qz-resume-card { background: rgba(139,123,255,.07); border: 1px solid rgba(139,123,255,.28); border-radius: 13px; padding: 16px; margin-bottom: 16px; }
.qz-resume-card h4 { color: var(--qz-primary); margin-bottom: 7px; font-family: var(--qz-font-d); }
.qz-resume-card p  { color: var(--qz-muted); font-size: .86rem; margin-bottom: 12px; }
.qz-resume-btns { display: flex; gap: 7px; }
.qz-resume-btns .qz-btn { flex: 1; }
.qz-mode-tabs { display: flex; gap: 6px; margin-bottom: 16px; }
.qz-mode-tab { flex: 1; padding: 9px; background: rgba(0,0,0,.2); border: 1px solid var(--qz-border); border-radius: 10px; cursor: pointer; font-size: .83rem; color: var(--qz-muted); transition: all .2s; text-align: center; font-weight: 600; }
.qz-mode-tab:hover { border-color: var(--qz-primary); }
.qz-mode-tab.qz-active-tab { background: rgba(139,123,255,.15); border-color: var(--qz-primary); color: var(--qz-primary2); }
`;

export default function QuizizFakep() {
  const navigate = useNavigate();

  const [tab,  setTab]  = useState('mulai');
  const [quizMode, setQuizMode] = useState('belajar'); // 'belajar' | 'latsol'
  const [mode, setMode] = useState('unlimited');

  const [quizUser,     setQuizUser]     = useState(null);
  const [displayName,  setDisplayName]  = useState('');
  const [nickname,     setNickname]     = useState('');
  const [authLoading,  setAuthLoading]  = useState(true);
  const [authAlert,    setAuthAlert]    = useState('');
  const [authErrType,  setAuthErrType]  = useState('');

  const [quizStarted, setQuizStarted] = useState(false);
  const [answers,     setAnswers]     = useState({});
  const [checkedSet,  setCheckedSet]  = useState(new Set());
  const [currentQ,   setCurrentQ]    = useState(0);

  const [deadline,  setDeadline]  = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft,  setTimeLeft]  = useState(null);
  const timerRef    = useRef(null);

  const [showResult, setShowResult] = useState(false);
  const [showNav,    setShowNav]    = useState(false);
  const [qrisLarge,  setQrisLarge]  = useState(false);
  const [qrisError,  setQrisError]  = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [finalStat,  setFinalStat]  = useState(null);

  const [lb200,        setLb200]        = useState([]);
  const [lb50,         setLb50]         = useState([]);
  const [lbLoading, setLbLoading] = useState(false);
  const [lbError,   setLbError]   = useState('');
  const [lbTab,     setLbTab]     = useState('200');
  const lbUnsubRef  = useRef(null);

  const [savedProgress,   setSavedProgress]   = useState(null);
  const [checkingResume,  setCheckingResume]  = useState(true);

  // ── Selected questions based on mode ──
  const isLatsol = quizMode === 'latsol';
  const QUESTIONS = isLatsol ? questions50 : questions;
  const TOTAL = QUESTIONS.length;
  const MAX_SCORE = isLatsol ? MAX_SCORE_50 : MAX_SCORE_200;
  const TIMER_MIN = isLatsol ? LATSOL_MINUTES : undefined;

  const q               = QUESTIONS[currentQ];
  const selectedOpt     = answers[currentQ];
  const isAnswered      = selectedOpt != null;
  const isCurrentChecked = checkedSet.has(currentQ);
  const isCorrectAns     = isAnswered && selectedOpt === q.correct;

  const correctCount = useMemo(() =>
    Object.entries(answers).filter(([idx, sel]) =>
      checkedSet.has(Number(idx)) && sel === QUESTIONS[Number(idx)].correct
    ).length,
  [answers, checkedSet, QUESTIONS]);

  const wrongCount = useMemo(() =>
    Object.entries(answers).filter(([idx, sel]) =>
      checkedSet.has(Number(idx)) && sel !== QUESTIONS[Number(idx)].correct
    ).length,
  [answers, checkedSet, QUESTIONS]);

  const currentScore = useMemo(() => calcScore(correctCount, TOTAL, MAX_SCORE), [correctCount, TOTAL, MAX_SCORE]);

  const timerClass = useMemo(() => {
    if (!timeLeft || mode !== 'hard') return 'qz-spTimer';
    if (timeLeft < 60)  return 'qz-spDanger';
    if (timeLeft < 300) return 'qz-spWarn';
    return 'qz-spTimer';
  }, [timeLeft, mode]);

  const getOptClass = (i) => {
    let c = 'qz-option';
    if (isCurrentChecked) {
      c += ' qz-locked';
      if (i === q.correct) c += ' qz-correct';
      else if (i === selectedOpt) c += ' qz-incorrect';
    } else {
      if (i === selectedOpt) c += ' qz-sel';
    }
    return c;
  };

  const getNavCellClass = (i) => {
    let c = 'qz-nav-cell';
    if (i === currentQ) return c + ' qz-nc-active';
    if (checkedSet.has(i)) {
      c += answers[i] === QUESTIONS[i].correct ? ' qz-nc-ok' : ' qz-nc-err';
    } else if (answers[i] != null) {
      c += ' qz-nc-sel';
    }
    return c;
  };

  // ── Google Fonts ──
  useEffect(() => {
    const el = Object.assign(document.createElement('link'), {
      rel:  'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap',
    });
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  // ── noindex ──
  useEffect(() => {
    const m = Object.assign(document.createElement('meta'), { name: 'robots', content: 'noindex,nofollow' });
    document.head.appendChild(m);
    return () => m.remove();
  }, []);

  // ── Auth ──
  useEffect(() => {
    const unsub = onAuthStateChanged(quizAuth, (u) => {
      setQuizUser(u);
      if (u) {
        const name = u.isAnonymous
          ? (localStorage.getItem('qz_nickname') || 'Anonim')
          : (u.displayName || '').slice(0, 24);
        setDisplayName(name);
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // ── Resume ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setSavedProgress(JSON.parse(raw));
    } catch { /* ignore */ }
    setCheckingResume(false);
  }, []);

  // ── Timer ──
  const finishQuizRef = useRef(null);
  useEffect(() => {
    const timerMode = isLatsol ? 'hard' : mode;
    if (timerMode !== 'hard' || !quizStarted || !deadline) return;
    const tick = () => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setTimeLeft(left);
      if (left <= 0 && finishQuizRef.current) finishQuizRef.current(true);
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    const onVisi = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', onVisi);
    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', onVisi);
    };
  }, [isLatsol, mode, quizStarted, deadline]);

  // ── Autosave ──
  useEffect(() => {
    if (!quizStarted) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        answers, checkedSet: [...checkedSet], currentQ, mode, quizMode,
        deadline, startTime,
      }));
    } catch { /* ignore */ }
  }, [answers, checkedSet, currentQ, mode, quizMode, deadline, startTime, quizStarted]);

  // ── Leaderboard realtime ──
  useEffect(() => {
    if (tab !== 'ranking') {
      lbUnsubRef.current?.();
      lbUnsubRef.current = null;
      return;
    }
    setLbLoading(true); setLbError('');
    const collName = lbTab === '200' ? 'quiz_leaderboard_200' : 'quiz_leaderboard_50';
    const q2 = query(collection(quizDb, collName), orderBy('score', 'desc'), limit(50));
    lbUnsubRef.current = onSnapshot(q2,
      (snap) => {
        const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        rows.sort((a, b) => b.score - a.score || a.durationSec - b.durationSec);
        if (lbTab === '200') setLb200(rows);
        else setLb50(rows);
        setLbLoading(false);
      },
      (err) => { setLbError('Gagal memuat: ' + err.message); setLbLoading(false); }
    );
    return () => { lbUnsubRef.current?.(); lbUnsubRef.current = null; };
  }, [tab, lbTab]);

  const clearProgress = useCallback(() => {
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
  }, []);

  const handleGoogleLogin = async () => {
    setAuthAlert(''); setAuthErrType('');
    if (/Instagram|FBAN|FBAV|Line\/|WhatsApp/i.test(navigator.userAgent)) {
      setAuthAlert('Login Google sering gagal di in-app browser. Buka di Chrome/Safari atau pilih Main Anonim.');
      setAuthErrType('inapp'); return;
    }
    try { await signInWithPopup(quizAuth, new GoogleAuthProvider());
    } catch (err) {
      const msg = {
        'auth/popup-closed-by-user':    'Popup ditutup. Coba lagi.',
        'auth/popup-blocked':           'Popup diblokir. Izinkan popup untuk situs ini.',
        'auth/network-request-failed':  'Koneksi bermasalah.',
      }[err.code] || 'Login gagal: ' + err.message;
      setAuthAlert(msg); setAuthErrType('err');
    }
  };

  const handleAnonLogin = async () => {
    setAuthAlert(''); setAuthErrType('');
    const name = nickname.trim();
    if (name.length < 2 || name.length > 24) { setAuthAlert('Nickname harus 2–24 karakter.'); setAuthErrType('err'); return; }
    if (isNsLeo(name)) { setAuthAlert('"Ns Leo" dicadangkan untuk #1 😄 Pakai nama lain ya.'); setAuthErrType('err'); return; }
    try {
      await signInAnonymously(quizAuth);
      localStorage.setItem('qz_nickname', name);
      setDisplayName(name);
    } catch (err) { setAuthAlert('Gagal: ' + err.message); setAuthErrType('err'); }
  };

  const handleSignOut = async () => { await signOut(quizAuth); setDisplayName(''); setNickname(''); };

  const startQuiz = (resumeData) => {
    if (resumeData) {
      setAnswers(resumeData.answers || {});
      setCheckedSet(new Set(resumeData.checkedSet || []));
      setCurrentQ(resumeData.currentQ || 0);
      setMode(resumeData.mode || 'unlimited');
      setQuizMode(resumeData.quizMode || 'belajar');
      setDeadline(resumeData.deadline || null);
      setStartTime(resumeData.startTime || Date.now());
    } else {
      const now = Date.now();
      setAnswers({}); setCheckedSet(new Set()); setCurrentQ(0);
      setStartTime(now);
      setDeadline(isLatsol ? now + LATSOL_MINUTES * 60 * 1000 : null);
    }
    setQuizStarted(true); setShowResult(false); setTab('quiz');
  };

  const finishQuiz = useCallback((timeUp) => {
    clearInterval(timerRef.current);
    const durationSec = Math.round((Date.now() - (startTime || Date.now())) / 1000);
    const finalCorrect = Object.entries(answers).filter(([idx, sel]) =>
      checkedSet.has(Number(idx)) && sel === QUESTIONS[Number(idx)].correct
    ).length;
    const score = calcScore(finalCorrect, TOTAL, MAX_SCORE);
    const stat  = { correct: finalCorrect, total: TOTAL, score, durationSec, mode: isLatsol ? 'hard' : mode, quizMode };
    setFinalStat(stat);
    setShowResult(true);
    setQuizStarted(false);
    clearProgress();
    setSavedProgress(null);
    saveToLeaderboard(stat);
  }, [answers, checkedSet, QUESTIONS, TOTAL, MAX_SCORE, mode, isLatsol, quizMode, startTime, clearProgress]);

  useEffect(() => { finishQuizRef.current = finishQuiz; }, [finishQuiz]);

  const saveToLeaderboard = async (stat) => {
    if (!quizUser) return;
    setSaveStatus('saving');
    const name = displayName.slice(0, 24);
    if (isNsLeo(name)) { setSaveStatus(''); return; }
    try {
      const collName = stat.quizMode === 'latsol' ? 'quiz_leaderboard_50' : 'quiz_leaderboard_200';
      const ref = doc(quizDb, collName, quizUser.uid);
      const existing = await getDoc(ref);
      const shouldWrite = !existing.exists()
        || stat.score > existing.data().score
        || (stat.score === existing.data().score && stat.durationSec < existing.data().durationSec);
      if (!shouldWrite) { setSaveStatus('notbest'); return; }
      const payload = {
        uid: quizUser.uid, name, score: stat.score,
        correct: stat.correct, total: stat.total, mode: stat.mode,
        durationSec: stat.durationSec, isAnonymous: quizUser.isAnonymous ?? true,
        updatedAt: serverTimestamp(),
      };
      if (quizUser.photoURL) payload.photoURL = quizUser.photoURL;
      await setDoc(ref, payload);
      setSaveStatus('saved');
    } catch { setSaveStatus(''); }
  };

  const selectAnswer = (optIdx) => {
    if (isCurrentChecked) return;
    setAnswers(prev => ({ ...prev, [currentQ]: optIdx }));
  };

  const checkAnswer = () => {
    if (!isAnswered) return;
    setCheckedSet(prev => new Set([...prev, currentQ]));
  };

  const goToQ = (idx) => { setCurrentQ(idx); setShowNav(false); };

  const goNext = () => {
    if (currentQ < TOTAL - 1) goToQ(currentQ + 1);
    else finishQuizRef.current(false);
  };

  const goPrev = () => { if (currentQ > 0) goToQ(currentQ - 1); };

  const handleBackBtn = () => {
    if (quizStarted) {
      const ok = window.confirm('Keluar dari quiz? Progres tersimpan.');
      if (!ok) return;
    }
    navigate('/');
  };

  const restartQuiz = () => {
    setShowResult(false); setFinalStat(null); setSaveStatus('');
    startQuiz(null);
  };

  const backToMenu = () => {
    setShowResult(false); setFinalStat(null); setSaveStatus('');
    setQuizStarted(false); setTab('mulai');
  };

  const lbData = lbTab === '200' ? lb200 : lb50;
  const lbStats = useMemo(() => ({
    total: lbData.length,
    avg: lbData.length ? Math.round(lbData.reduce((s, r) => s + r.score, 0) / lbData.length) : 0,
  }), [lbData]);

  return (
    <div className="qz-root">
      <style>{CSS}</style>

      <div className="qz-wrap">
        <div className="qz-header">
          <button className="qz-back-btn" onClick={handleBackBtn}>← Keluar</button>
          <span className="qz-header-title">CBT · Keperawatan</span>
        </div>

        <div className="qz-tabs">
          {[['mulai','🏠 Mulai'],['quiz','📝 Quiz'],['ranking','🏆 Ranking']].map(([id, lbl]) => (
            <button key={id} className={`qz-tab${tab === id ? ' qz-active' : ''}`} onClick={() => setTab(id)}>
              {lbl}
            </button>
          ))}
        </div>

        {/* ══ TAB MULAI ══ */}
        {tab === 'mulai' && (
          <div style={{ animation: 'qzFadeUp .4s ease' }}>
            <div style={{ marginBottom: 18 }}>
              <div className="qz-badge">CBT · KEPERAWATAN · IBD HOTS</div>
              <h1 className="qz-h1">{QUIZ_TITLE}</h1>
              <p className="qz-muted">{isLatsol ? '50 soal, 60 menit LATSOL' : '200 soal pilihan ganda Belajar'}</p>
            </div>

            {/* Pilih mode BELAJAR vs LATSOL */}
            <div className="qz-mode-tabs">
              <button
                className={`qz-mode-tab${quizMode === 'belajar' ? ' qz-active-tab' : ''}`}
                onClick={() => { setQuizMode('belajar'); setMode('unlimited'); clearProgress(); }}
              >
                📚 Belajar 200
              </button>
              <button
                className={`qz-mode-tab${quizMode === 'latsol' ? ' qz-active-tab' : ''}`}
                onClick={() => { setQuizMode('latsol'); clearProgress(); }}
              >
                📋 Latsol 50
              </button>
            </div>

            {/* Resume */}
            {!checkingResume && savedProgress && !quizStarted && savedProgress.quizMode === quizMode && (
              <div className="qz-resume-card">
                <h4>📂 Lanjutkan Quiz?</h4>
                <p>Progres soal {(savedProgress.currentQ || 0) + 1}/{isLatsol ? 50 : 200}.</p>
                <div className="qz-resume-btns">
                  <button className="qz-btn qz-btn-primary" onClick={() => { setSavedProgress(null); startQuiz(savedProgress); }}>▶ Lanjutkan</button>
                  <button className="qz-btn qz-btn-secondary" onClick={() => { clearProgress(); setSavedProgress(null); }}>Mulai Ulang</button>
                </div>
              </div>
            )}

            {/* Mode timer (hanya saat BELAJAR) */}
            {!isLatsol && (
              <div className="qz-mode-options">
                {[
                  ['unlimited','🟢 Unlimited','Tanpa batas waktu. Cocok untuk belajar santai.'],
                  ['hard','🔴 Hard Mode','Timer 60 menit. Simulasi ujian.'],
                ].map(([id, title, desc]) => (
                  <div key={id}
                    className={`qz-mode-card${mode === id ? ' qz-selected' : ''}`}
                    onClick={() => setMode(id)}
                    role="radio" aria-checked={mode === id}>
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Auth */}
            <div className="qz-auth-section">
              <h4>LOGIN UNTUK RANKING</h4>
              {authLoading ? (
                <p className="qz-muted qz-loading">Memuat...</p>
              ) : quizUser ? (
                <>
                  <div className="qz-user-info">
                    <div className="qz-avatar">{quizUser.photoURL ? <img src={quizUser.photoURL} alt={displayName} /> : displayName.slice(0,2).toUpperCase()}</div>
                    <span className="qz-user-name">Halo, {displayName}{quizUser.isAnonymous ? ' (Anonim)' : ''}</span>
                  </div>
                  {authAlert && <div className={`qz-alert qz-alert-${authErrType === 'err' ? 'err' : 'warn'}`}>{authAlert}</div>}
                  <button className="qz-btn qz-btn-secondary qz-btn-sm" onClick={handleSignOut}>Ganti Akun</button>
                </>
              ) : (
                <>
                  {authAlert && <div className={`qz-alert qz-alert-${authErrType === 'inapp' ? 'warn' : 'err'}`}>{authAlert}</div>}
                  <button className="qz-btn qz-btn-secondary" style={{ marginBottom: 9 }} onClick={handleGoogleLogin}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" style={{ width:17,height:17,verticalAlign:'middle',marginRight:8 }} />
                    Masuk dengan Google
                  </button>
                  <div className="qz-divider">atau</div>
                  <input className="qz-input" type="text" maxLength={24} placeholder="Nickname (2–24 karakter)"
                    value={nickname} onChange={e => setNickname(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAnonLogin()} />
                  <button className="qz-btn qz-btn-secondary" onClick={handleAnonLogin}>👤 Main Anonim</button>
                </>
              )}
            </div>

            <div className="qz-howto">
              <h4>📖 Cara Penggunaan</h4>
              <ol>
                <li>Pilih mode quiz ({isLatsol ? 'Latsol 50 soal' : 'Belajar 200 soal'})</li>
                <li>Pilih opsi jawaban</li>
                <li>Klik <strong>"Periksa Jawaban"</strong> untuk melihat hasil</li>
                <li><strong>Jawaban terkunci</strong> setelah diperiksa</li>
                <li>Gunakan navigator atau "← Kembali" untuk pindah soal</li>
                <li>Skor terbaik tersimpan di leaderboard</li>
              </ol>
            </div>

            <button className="qz-btn qz-btn-primary" disabled={!quizUser}
              onClick={() => { clearProgress(); setSavedProgress(null); startQuiz(null); }}>
              {quizUser ? (`🚀 Mulai Quiz ${isLatsol ? 'Latsol 50' : 'Belajar 200'}`) : 'Login dulu'}
            </button>
          </div>
        )}

        {/* ══ TAB QUIZ ══ */}
        {tab === 'quiz' && (
          <div>
            {!quizStarted && !showResult ? (
              <div className="qz-empty">
                <div style={{ fontSize:'2.2rem',marginBottom:10 }}>📝</div>
                <p>Mulai quiz dari tab <strong>Mulai</strong> dulu ya.</p>
              </div>
            ) : showResult ? (
              <div className="qz-empty"><p>Quiz selesai! Hasil ada di popup.</p></div>
            ) : (
              <>
                <div className="qz-sticky-bar">
                  {(isLatsol || mode === 'hard') && (
                    <div className={`qz-stat-pill ${timerClass}`} aria-live="polite">
                      <span>{formatDur(timeLeft)}</span>⏱️
                    </div>
                  )}
                  <div className="qz-stat-pill qz-spOk">   <span>{correctCount}</span>✅</div>
                  <div className="qz-stat-pill qz-spWrong"><span>{wrongCount}</span>❌</div>
                  <div className="qz-stat-pill qz-spScore"><span>{currentScore}</span>⭐</div>
                </div>

                <div className="qz-prog-bar">
                  <div className="qz-prog-fill" style={{ width:`${((currentQ+1)/TOTAL)*100}%` }} />
                </div>
                <div className="qz-q-counter">Soal {currentQ + 1} / {TOTAL}</div>

                <div className="qz-q-text">{q.text}</div>

                <div className="qz-options">
                  {q.options.map((opt, i) => (
                    <button key={i} className={getOptClass(i)} onClick={() => selectAnswer(i)}>
                      <span className="qz-option-lbl">{OPTION_LABELS[i]}</span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>

                {isCurrentChecked && (
                  <div className={`qz-feedback ${isCorrectAns ? 'qz-fb-ok' : 'qz-fb-err'}`}>
                    <h4>{isCorrectAns ? '✅ Benar!' : '❌ Salah'}</h4>
                    {!isCorrectAns && <p>Jawaban benar: <strong>{OPTION_LABELS[q.correct]}. {q.options[q.correct]}</strong></p>}
                    <p style={{ marginTop: 8 }}>{q.explanation}</p>
                  </div>
                )}

                <div className="qz-nav-btns">
                  <button className="qz-btn qz-btn-secondary" onClick={goPrev} disabled={currentQ === 0}>← Kembali</button>
                  {!isCurrentChecked ? (
                    <button className="qz-btn qz-btn-primary" onClick={checkAnswer} disabled={!isAnswered}>Periksa</button>
                  ) : (
                    <button className="qz-btn qz-btn-success" onClick={goNext}>
                      {currentQ < TOTAL - 1 ? 'Lanjut →' : '🏁 Selesai'}
                    </button>
                  )}
                </div>

                <button className="qz-nav-toggle" onClick={() => setShowNav(true)}>📋 {[...checkedSet].length}/{TOTAL}</button>
              </>
            )}
          </div>
        )}

        {/* ══ TAB RANKING ══ */}
        {tab === 'ranking' && (
          <div style={{ animation: 'qzFadeUp .4s ease' }}>
            <h2 className="qz-h2">🏆 Leaderboard</h2>

            {/* Mode tabs untuk ranking */}
            <div className="qz-mode-tabs">
              <button className={`qz-mode-tab${lbTab === '200' ? ' qz-active-tab' : ''}`} onClick={() => setLbTab('200')}>
                📚 Belajar 200
              </button>
              <button className={`qz-mode-tab${lbTab === '50' ? ' qz-active-tab' : ''}`} onClick={() => setLbTab('50')}>
                📋 Latsol 50
              </button>
            </div>

            <div className="qz-stats-row">
              <div className="qz-stat-card"><h4>PESERTA</h4><div className="qz-val">{lbStats.total}</div></div>
              <div className="qz-stat-card"><h4>RATA-RATA</h4><div className="qz-val">{lbStats.avg || '—'}</div></div>
            </div>

            <div className="qz-card" data-lenis-prevent>
              {/* Pinned #1 */}
              <div className="qz-lb-row">
                <div className="qz-lb-rank qz-gold">👑</div>
                <div className="qz-lb-avatar" style={{ background:'linear-gradient(135deg,#fde68a,#f59e0b)' }}>NS</div>
                <div style={{ flex:1 }}>
                  <div className="qz-lb-name">{PINNED_TOP.name}</div>
                  <div className="qz-lb-meta">Skor Sempurna 🎉</div>
                </div>
                <div className="qz-lb-score">{lbTab === '200' ? PINNED_TOP.score_200 : PINNED_TOP.score_50}</div>
              </div>

              {lbLoading && <div className="qz-loading">Memuat ranking...</div>}
              {lbError && <div className="qz-alert qz-alert-err" style={{ margin:12 }}>{lbError}</div>}
              {!lbLoading && !lbError && lbData.length === 0 && <div className="qz-empty">Belum ada peserta. Jadilah yang pertama! 🚀</div>}

              {lbData.map((row, i) => {
                const rank = i + 2;
                const isMe = quizUser && row.uid === quizUser.uid;
                let rCls = 'qz-lb-rank';
                if (rank === 2) rCls += ' qz-gold';
                else if (rank === 3) rCls += ' qz-silver';
                else if (rank === 4) rCls += ' qz-bronze';
                return (
                  <div key={row.id} className={`qz-lb-row${isMe ? ' qz-me' : ''}`}>
                    <div className={rCls}>{rank}</div>
                    <div className="qz-lb-avatar">{row.photoURL ? <img src={row.photoURL} alt={row.name} /> : row.name.slice(0,2).toUpperCase()}</div>
                    <div style={{ flex:1 }}>
                      <div className="qz-lb-name">{row.name}{isMe && <span className="qz-me-tag">Kamu</span>}</div>
                      <div className="qz-lb-meta">{formatDur(row.durationSec)} · {row.correct}/{row.total} benar</div>
                    </div>
                    <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:3 }}>
                      <div className="qz-lb-score">{row.score}</div>
                      <span className="qz-badge-mode">{row.mode === 'hard' ? '🔴 Hard' : '🟢 Unlimited'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ══ PORTALS ══ */}

      {/* Navigator */}
      {showNav && createPortal(
        <>
          <div className="qz-bs-overlay" onClick={() => setShowNav(false)} />
          <div className="qz-bs-box" data-lenis-prevent>
            <div className="qz-bs-handle" />
            <h4 style={{ fontFamily:'var(--qz-font-d)',color:'var(--qz-text)',marginBottom:12,fontSize:'.97rem' }}>
              Navigator — {[...checkedSet].length}/{TOTAL} sudah dicek
            </h4>
            <div style={{ display:'flex',gap:10,fontSize:'.72rem',color:'var(--qz-muted)',marginBottom:11 }}>
              <span style={{ color:'var(--qz-success)' }}>■</span> Benar&nbsp;
              <span style={{ color:'var(--qz-danger)' }}>■</span> Salah&nbsp;
              <span style={{ color:'var(--qz-warning)' }}>■</span> Dipilih&nbsp;
              <span>■</span> Belum
            </div>
            <div className="qz-nav-grid">
              {QUESTIONS.map((_, i) => (
                <button key={i} className={getNavCellClass(i)} onClick={() => goToQ(i)}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Modal hasil */}
      {showResult && finalStat && createPortal(
        <div className="qz-modal-overlay">
          <div className="qz-modal-box" data-lenis-prevent>
            <div style={{ fontSize:'2.3rem',marginBottom:7 }}>
              {finalStat.correct/TOTAL >= .8 ? '🎉' : finalStat.correct/TOTAL >= .6 ? '💪' : '📖'}
            </div>
            <h2 className="qz-h2" style={{ marginBottom:3 }}>
              {finalStat.correct/TOTAL >= .8 ? 'Luar Biasa!' : finalStat.correct/TOTAL >= .6 ? 'Bagus!' : 'Terus Belajar!'}
            </h2>
            <div className="qz-result-score">{finalStat.score}</div>
            <p className="qz-muted" style={{ marginBottom:14 }}>dari {MAX_SCORE} poin maksimal</p>

            <div className="qz-result-details">
              {[
                ['Benar',   `${finalStat.correct} / ${TOTAL}`],
                ['Salah',   `${TOTAL - finalStat.correct}`],
                ['Waktu',   formatDur(finalStat.durationSec)],
                ['Mode',    isLatsol ? '🔴 Latsol 60 menit' : (finalStat.mode === 'hard' ? '🔴 Hard Mode' : '🟢 Unlimited')],
                ['Ranking', saveStatus === 'saving'  ? '⏳ Menyimpan...' : saveStatus === 'saved' ? '✅ Tersimpan' : saveStatus === 'notbest' ? '📊 Bukan skor terbaik' : '—'],
              ].map(([label, val]) => (
                <div key={label} className="qz-result-row"><span>{label}</span><span>{val}</span></div>
              ))}
            </div>

            {!qrisError && (
              <div className="qz-qris-card">
                <h4>☕ Dukung Quiz Ini</h4>
                <p>Kalau bermanfaat, boleh traktir lewat QRIS 🙏</p>
                <img src={QRIS_IMAGE} alt="QRIS" className="qz-qris-img"
                  onClick={() => setQrisLarge(true)} onError={() => setQrisError(true)} />
                <a href={QRIS_IMAGE} download="qris-quiz.jpg"
                  className="qz-btn qz-btn-secondary qz-btn-inline qz-btn-sm">
                  💾 Simpan
                </a>
              </div>
            )}

            <div style={{ display:'flex',flexDirection:'column',gap:9,marginTop:14 }}>
              <button className="qz-btn qz-btn-secondary" onClick={() => { setShowResult(false); setTab('ranking'); }}>🏆 Ranking</button>
              <button className="qz-btn qz-btn-primary"   onClick={restartQuiz}>🔄 Coba Lagi</button>
              <button className="qz-btn qz-btn-secondary" onClick={backToMenu}>🏠 Menu</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {qrisLarge && createPortal(
        <div className="qz-qris-full" onClick={() => setQrisLarge(false)}>
          <img src={QRIS_IMAGE} alt="QRIS" />
        </div>,
        document.body
      )}
    </div>
  );
}
