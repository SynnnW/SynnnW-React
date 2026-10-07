// src/pages/QuizizFakep.jsx
// Halaman Quiz CBT Keperawatan — tersembunyi, khusus HP
// Fitur: auth Google/anonim (Firebase instance terpisah), leaderboard Firestore, donasi QRIS

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  getApp, getApps, initializeApp,
} from 'firebase/app';
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  signInAnonymously, onAuthStateChanged, signOut,
} from 'firebase/auth';
import {
  getFirestore, collection, doc, getDoc, setDoc,
  onSnapshot, query, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';
import { questions } from '../data/quizQuestions';
import { questions50 } from '../data/src/data/quizQuestions50';
import './firebase'; // pastikan default app sudah di-init

/* ═══════════════════════════════════════════════
   KONSTANTA — edit sesuai kebutuhan
═══════════════════════════════════════════════ */
const QUIZ_TITLE       = 'Fakep Sepele';
const MAX_SCORE        = 2000;
const HARD_MODE_MINUTES = 100;
const LATSOL_50_MINUTES = 60; // ✅ NEW: LATSOL 50 soal, 60 menit
const PINNED_TOP       = { name: 'Ns Leo', score: 2000 };
const QRIS_IMAGE       = '/assets/img/qris.jpg';
const BLOCK_DESKTOP    = false; // ✅ FIXED: sekarang bisa dibuka di desktop/Windows
const QUIZ_PATH        = '/quiz-latsol';
const LS_KEY           = 'qz_progress_v1';
// ✅ REMOVED: TOTAL akan di-compute dynamic di dalam component

/* ═══════════════════════════════════════════════
   FIREBASE — instance ke-2 khusus quiz
═══════════════════════════════════════════════ */
const quizApp  = getApps().find(a => a.name === 'quiz')
  || initializeApp(getApp().options, 'quiz');
const quizAuth = getAuth(quizApp);
const quizDb   = getFirestore(quizApp);

/* ═══════════════════════════════════════════════
   HELPER
═══════════════════════════════════════════════ */
function formatDuration(sec) {
  if (sec == null || sec < 0) return '--';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ✅ NEW: Helper functions untuk dynamic quiz type
function getQuestions(qType = '200') {
  return qType === '50' ? questions50 : questions;
}

function getTotal(qType = '200') {
  return qType === '50' ? questions50.length : questions.length;
}

function calcScore(correct, qType = '200') {
  const total = getTotal(qType);
  return Math.round((correct / total) * MAX_SCORE);
}

function isNsLeo(name) {
  return /ns\W*leo/i.test(name);
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

/* ═══════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════ */
const CSS = `
/* Semua selector dalam .qz-root — tidak ada global */
.qz-root {
  --qz-bg: #070709;
  --qz-surface: rgba(255,255,255,0.04);
  --qz-surface2: rgba(255,255,255,0.07);
  --qz-border: rgba(255,255,255,0.09);
  --qz-text: #f4f4f6;
  --qz-muted: #8d8d99;
  --qz-primary: #8b7bff;
  --qz-primary2: #5eead4;
  --qz-success: #34d399;
  --qz-danger: #fb7185;
  --qz-warning: #fbbf24;
  --qz-radius: 18px;
  --qz-font: 'Inter', 'Segoe UI', system-ui, sans-serif;
  --qz-font-display: 'Space Grotesk', 'Inter', sans-serif;

  font-family: var(--qz-font);
  background: var(--qz-bg);
  color: var(--qz-text);
  min-height: 100dvh;
  padding: 0;
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

.qz-root *, .qz-root *::before, .qz-root *::after {
  box-sizing: border-box;
}

/* Blur background bola ungu/teal — pindah dari body ke .qz-root */
.qz-root::before, .qz-root::after {
  content: '';
  position: fixed;
  z-index: 0;
  pointer-events: none;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(100px);
}
.qz-root::before {
  background: var(--qz-primary);
  top: -120px;
  left: -100px;
  opacity: 0.18;
}
.qz-root::after {
  background: var(--qz-primary2);
  bottom: -150px;
  right: -100px;
  opacity: 0.11;
}

/* ── Layar desktop blokir ── */
.qz-desktop-block {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
  z-index: 10;
  background: var(--qz-bg);
}
.qz-desktop-block h2 {
  font-family: var(--qz-font-display);
  font-size: 2rem;
  margin-bottom: 12px;
  color: var(--qz-text);
}
.qz-desktop-block p {
  color: var(--qz-muted);
  max-width: 340px;
  margin-bottom: 28px;
  line-height: 1.6;
}

/* ── Wrapper utama ── */
.qz-wrap {
  max-width: 520px;
  margin: 0 auto;
  padding: 0 16px 80px;
  position: relative;
  z-index: 1;
}

/* ── Header ── */
.qz-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 0 12px;
  border-bottom: 1px solid var(--qz-border);
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  background: var(--qz-bg);
  z-index: 20;
}
.qz-header-title {
  flex: 1;
  font-family: var(--qz-font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--qz-text);
}
.qz-back-btn {
  background: none;
  border: 1px solid var(--qz-border);
  color: var(--qz-muted);
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: var(--qz-font);
  transition: all 0.2s;
}
.qz-back-btn:hover {
  color: var(--qz-text);
  border-color: var(--qz-primary);
}

/* ── Tabs ── */
.qz-tabs {
  display: flex;
  gap: 6px;
  background: rgba(0,0,0,0.25);
  border: 1px solid var(--qz-border);
  border-radius: 14px;
  padding: 6px;
  margin-bottom: 20px;
}
.qz-tab {
  flex: 1;
  padding: 11px 6px;
  background: none;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font: 600 0.88rem var(--qz-font);
  color: var(--qz-muted);
  transition: all 0.2s;
}
.qz-tab:hover { color: var(--qz-text); background: var(--qz-surface); }
.qz-tab.qz-active {
  color: #fff;
  background: linear-gradient(135deg, rgba(139,123,255,0.35), rgba(94,234,212,0.15));
  box-shadow: inset 0 0 0 1px rgba(139,123,255,0.4);
}

/* ── Card ── */
.qz-card {
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: var(--qz-radius);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
}
.qz-card-pad { padding: 24px; }

/* ── Typography ── */
.qz-badge {
  display: inline-block;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--qz-primary2);
  border: 1px solid var(--qz-border);
  background: var(--qz-surface);
  padding: 6px 12px;
  border-radius: 999px;
  margin-bottom: 16px;
}
.qz-h1 {
  font-family: var(--qz-font-display);
  font-size: clamp(1.7rem, 6vw, 2.6rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  background: linear-gradient(120deg, #fff 30%, var(--qz-primary) 70%, var(--qz-primary2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 12px;
}
.qz-h2 {
  font-family: var(--qz-font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--qz-text);
  margin-bottom: 12px;
}
.qz-muted { color: var(--qz-muted); line-height: 1.65; font-size: 0.95rem; }

/* ── Buttons ── */
.qz-btn {
  display: block;
  width: 100%;
  min-height: 52px;
  padding: 14px 20px;
  border: 1px solid transparent;
  border-radius: 14px;
  cursor: pointer;
  font: 600 0.95rem var(--qz-font);
  transition: all 0.22s;
  color: #fff;
  text-align: center;
  background: var(--qz-surface2);
}
.qz-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}
.qz-btn-primary {
  background: linear-gradient(135deg, #8b7bff, #6d5df0);
  box-shadow: 0 8px 24px rgba(139,123,255,0.35);
}
.qz-btn-primary:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(139,123,255,0.55);
}
.qz-btn-secondary {
  background: var(--qz-surface2);
  border-color: var(--qz-border);
  color: var(--qz-text);
}
.qz-btn-secondary:not(:disabled):hover {
  background: rgba(255,255,255,0.1);
  transform: translateY(-1px);
}
.qz-btn-success {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: #04130d;
  box-shadow: 0 8px 24px rgba(52,211,153,0.3);
}
.qz-btn-success:not(:disabled):hover { transform: translateY(-2px); }
.qz-btn-sm {
  min-height: 40px;
  padding: 8px 16px;
  font-size: 0.85rem;
  width: auto;
  display: inline-block;
  border-radius: 10px;
}
.qz-btn-inline {
  display: inline-block;
  width: auto;
  min-height: 44px;
}

/* ── Quiz type selector ── */
.qz-type-options { display: flex; gap: 10px; margin-bottom: 20px; }
.qz-type-btn {
  flex: 1;
  padding: 12px 16px;
  background: var(--qz-surface);
  border: 2px solid var(--qz-border);
  border-radius: 12px;
  cursor: pointer;
  font: 600 0.9rem var(--qz-font);
  color: var(--qz-muted);
  transition: all 0.2s;
}
.qz-type-btn:hover { border-color: rgba(139,123,255,0.3); }
.qz-type-btn.qz-active-type {
  border-color: var(--qz-primary);
  background: rgba(139,123,255,0.12);
  color: var(--qz-primary);
}
.qz-type-label { font-size: 0.7rem; color: var(--qz-muted); }

/* ── Mode cards ── */
.qz-mode-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.qz-mode-card {
  padding: 18px;
  background: var(--qz-surface);
  border: 2px solid var(--qz-border);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.qz-mode-card:hover { border-color: rgba(139,123,255,0.5); }
.qz-mode-card.qz-selected {
  border-color: var(--qz-primary);
  background: rgba(139,123,255,0.12);
}
.qz-mode-card h4 {
  font-family: var(--qz-font-display);
  font-size: 1rem;
  color: var(--qz-text);
  margin-bottom: 4px;
}
.qz-mode-card p { color: var(--qz-muted); font-size: 0.85rem; line-height: 1.5; }

/* ── Auth ── */
.qz-auth-section {
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}
.qz-auth-section h4 {
  font-size: 0.88rem;
  color: var(--qz-muted);
  margin-bottom: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.qz-input {
  width: 100%;
  padding: 13px 16px;
  background: rgba(0,0,0,0.35);
  color: var(--qz-text);
  border: 1px solid var(--qz-border);
  border-radius: 12px;
  font: 1rem var(--qz-font);
  transition: all 0.2s;
  margin-bottom: 10px;
}
.qz-input::placeholder { color: #55555f; }
.qz-input:focus {
  outline: none;
  border-color: var(--qz-primary);
  box-shadow: 0 0 0 3px rgba(139,123,255,0.18);
}
.qz-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(139,123,255,0.08);
  border: 1px solid rgba(139,123,255,0.25);
  border-radius: 12px;
  margin-bottom: 12px;
}
.qz-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background: linear-gradient(135deg, var(--qz-primary), var(--qz-primary2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  color: #fff;
  flex-shrink: 0;
}
.qz-user-name {
  flex: 1;
  font-size: 0.95rem;
  color: var(--qz-text);
  font-weight: 600;
}
.qz-divider {
  text-align: center;
  color: var(--qz-muted);
  font-size: 0.8rem;
  margin: 12px 0;
  position: relative;
}
.qz-divider::before, .qz-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 20px);
  height: 1px;
  background: var(--qz-border);
}
.qz-divider::before { left: 0; }
.qz-divider::after { right: 0; }

/* ── Cara penggunaan ── */
.qz-howto {
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 14px;
  padding: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.qz-howto h4 { color: var(--qz-primary2); font-size: 0.95rem; margin-bottom: 8px; }
.qz-howto ol { color: var(--qz-muted); padding-left: 18px; font-size: 0.88rem; line-height: 1.8; }

/* ── Quiz sticky bar ── */
.qz-sticky-bar {
  position: sticky;
  top: 57px;
  z-index: 15;
  display: flex;
  gap: 8px;
  background: rgba(7,7,9,0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 10px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--qz-border);
}
.qz-stat-pill {
  flex: 1;
  text-align: center;
  padding: 8px 4px;
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 10px;
  font-size: 0.75rem;
}
.qz-stat-pill span {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: var(--qz-font-display);
  font-variant-numeric: tabular-nums;
}
.qz-stat-pill.qz-timer span { color: var(--qz-primary2); }
.qz-stat-pill.qz-correct span { color: var(--qz-success); }
.qz-stat-pill.qz-wrong span { color: var(--qz-danger); }
.qz-stat-pill.qz-score span {
  background: linear-gradient(120deg, var(--qz-primary), var(--qz-primary2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.qz-stat-pill.qz-timer-warn span { color: var(--qz-warning); }
.qz-stat-pill.qz-timer-danger span { color: var(--qz-danger); animation: qz-pulse 1s ease-in-out infinite; }

/* ── Progress bar ── */
.qz-progress-bar {
  background: var(--qz-surface2);
  height: 5px;
  border-radius: 999px;
  margin-bottom: 14px;
  overflow: hidden;
}
.qz-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--qz-primary), var(--qz-primary2));
  border-radius: 999px;
  transition: width 0.35s ease;
  box-shadow: 0 0 10px rgba(139,123,255,0.6);
}
.qz-q-counter {
  text-align: right;
  color: var(--qz-muted);
  font-size: 0.85rem;
  margin-bottom: 10px;
  font-variant-numeric: tabular-nums;
}

/* ── Pertanyaan ── */
.qz-q-text {
  background: var(--qz-surface);
  padding: 20px;
  border-radius: 14px;
  margin-bottom: 18px;
  border: 1px solid var(--qz-border);
  border-left: 3px solid var(--qz-primary);
  font-weight: 600;
  line-height: 1.65;
  font-size: 1rem;
  color: #ffffff; /* ✅ FIXED: brighter text untuk better readability */
}

/* ── Opsi ── */
.qz-options { display: flex; flex-direction: column; gap: 9px; }
.qz-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px 16px;
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 13px;
  cursor: pointer;
  transition: all 0.18s;
  line-height: 1.5;
  font-size: 0.93rem;
  text-align: left;
  width: 100%;
  color: var(--qz-text);
  font-family: var(--qz-font);
  min-height: 52px;
}
.qz-option:not(.qz-locked):hover {
  border-color: rgba(139,123,255,0.5);
  background: var(--qz-surface2);
  transform: translateX(3px);
}
.qz-option.qz-locked { cursor: default; }
.qz-option-label {
  font-weight: 700;
  color: var(--qz-muted);
  flex-shrink: 0;
  font-size: 0.85rem;
  margin-top: 1px;
  min-width: 18px;
}
.qz-option.qz-sel { border-color: var(--qz-primary); background: rgba(139,123,255,0.12); box-shadow: 0 0 0 2px rgba(139,123,255,0.1); }
.qz-option.qz-sel .qz-option-label { color: var(--qz-primary); }
.qz-option.qz-correct { border-color: var(--qz-success); background: rgba(52,211,153,0.1); }
.qz-option.qz-correct .qz-option-label { color: var(--qz-success); }
.qz-option.qz-incorrect { border-color: var(--qz-danger); background: rgba(251,113,133,0.1); }
.qz-option.qz-incorrect .qz-option-label { color: var(--qz-danger); }

/* ── Feedback ── */
.qz-feedback {
  margin-top: 16px;
  padding: 16px 18px;
  border-radius: 13px;
  border: 1px solid var(--qz-border);
  animation: qz-fade-up 0.3s ease;
}
.qz-feedback.qz-fb-correct {
  background: rgba(52,211,153,0.08);
  border-color: rgba(52,211,153,0.4);
}
.qz-feedback.qz-fb-incorrect {
  background: rgba(251,113,133,0.08);
  border-color: rgba(251,113,133,0.4);
}
.qz-feedback h4 {
  font-family: var(--qz-font-display);
  font-size: 1.05rem;
  margin-bottom: 6px;
}
.qz-fb-correct h4 { color: var(--qz-success); }
.qz-fb-incorrect h4 { color: var(--qz-danger); }
.qz-feedback p { color: #c9c9d2; font-size: 0.9rem; line-height: 1.6; margin-top: 4px; }

/* ── Nav buttons ── */
.qz-nav-btns {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.qz-nav-btns .qz-btn { flex: 1; }

/* ── Alert inline ── */
.qz-alert {
  padding: 12px 16px;
  border-radius: 11px;
  font-size: 0.9rem;
  margin-bottom: 14px;
  animation: qz-fade-up 0.25s ease;
}
.qz-alert-info {
  background: rgba(94,234,212,0.1);
  border: 1px solid rgba(94,234,212,0.3);
  color: var(--qz-primary2);
}
.qz-alert-warn {
  background: rgba(251,191,36,0.1);
  border: 1px solid rgba(251,191,36,0.3);
  color: var(--qz-warning);
}
.qz-alert-err {
  background: rgba(251,113,133,0.1);
  border: 1px solid rgba(251,113,133,0.3);
  color: var(--qz-danger);
  line-height: 1.5;
}

/* ── Bottom-sheet toggle btn ── */
.qz-nav-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 30;
  background: linear-gradient(135deg, var(--qz-primary), #6d5df0);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 12px 18px;
  font: 600 0.85rem var(--qz-font);
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(139,123,255,0.4);
}

/* ── Ranking ── */
.qz-stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}
.qz-stat-card {
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 14px;
  padding: 16px;
  text-align: center;
}
.qz-stat-card h4 {
  color: var(--qz-muted);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.qz-stat-card .qz-val {
  font-family: var(--qz-font-display);
  font-size: 1.9rem;
  font-weight: 700;
  background: linear-gradient(120deg, var(--qz-primary), var(--qz-primary2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.qz-lb-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-bottom: 1px solid var(--qz-border);
}
.qz-lb-row:last-child { border-bottom: none; }
.qz-lb-row.qz-me { background: rgba(139,123,255,0.08); border-radius: 10px; border: 1px solid rgba(139,123,255,0.2); margin: 2px 0; }
.qz-lb-rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--qz-surface2);
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}
.qz-lb-rank.qz-gold { background: linear-gradient(135deg, #fde68a, #f59e0b); color: #2a1a00; }
.qz-lb-rank.qz-silver { background: linear-gradient(135deg, #f1f5f9, #94a3b8); color: #111827; }
.qz-lb-rank.qz-bronze { background: linear-gradient(135deg, #fdba74, #c2410c); color: #1f0b00; }
.qz-lb-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--qz-primary), var(--qz-primary2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.78rem;
  color: #fff;
  overflow: hidden;
  flex-shrink: 0;
}
.qz-lb-avatar img { width: 100%; height: 100%; object-fit: cover; }
.qz-lb-name { flex: 1; font-size: 0.9rem; font-weight: 600; }
.qz-lb-meta { font-size: 0.72rem; color: var(--qz-muted); margin-top: 2px; }
.qz-lb-score {
  font-family: var(--qz-font-display);
  font-weight: 700;
  font-size: 1rem;
  background: linear-gradient(120deg, var(--qz-primary), var(--qz-primary2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  white-space: nowrap;
}
.qz-badge-mode {
  font-size: 0.68rem;
  padding: 2px 7px;
  border-radius: 999px;
  border: 1px solid var(--qz-border);
  background: var(--qz-surface);
  color: var(--qz-muted);
  flex-shrink: 0;
}
.qz-me-tag {
  font-size: 0.65rem;
  background: var(--qz-primary);
  color: #fff;
  padding: 2px 6px;
  border-radius: 6px;
  margin-left: 4px;
}
.qz-empty { text-align: center; padding: 40px 20px; color: var(--qz-muted); font-size: 0.9rem; }
.qz-loading { text-align: center; padding: 40px 20px; color: var(--qz-muted); animation: qz-pulse 1.2s ease-in-out infinite; }

/* ── Animations ── */
@keyframes qz-fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
}
@keyframes qz-slide-up {
  from { opacity: 0; transform: translateY(40px) scale(0.97); }
  to { opacity: 1; transform: none; }
}
@keyframes qz-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

/* ── Modal overlay (via portal) ── */
.qz-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4,4,6,0.82);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9000;
  padding: 0;
}
.qz-modal-box {
  background: #0f0f14;
  border: 1px solid var(--qz-border);
  border-radius: 24px 24px 0 0;
  padding: 32px 24px 40px;
  width: 100%;
  max-width: 520px;
  max-height: 90dvh;
  overflow-y: auto;
  text-align: center;
  box-shadow: 0 0 60px rgba(139,123,255,0.2);
  animation: qz-slide-up 0.4s ease;
}
@media (prefers-reduced-motion: reduce) {
  .qz-modal-box, .qz-bs-box, .qz-feedback {
    animation: none;
  }
  .qz-progress-fill { transition: none; }
}
.qz-result-score {
  font-family: var(--qz-font-display);
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(120deg, var(--qz-primary), var(--qz-primary2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1;
  margin: 8px 0 4px;
}
.qz-result-details {
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 14px;
  padding: 14px 18px;
  margin: 18px 0;
  text-align: left;
}
.qz-result-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  color: #c9c9d2;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.qz-result-row:last-child { border-bottom: none; }
.qz-result-row span:last-child { font-weight: 600; color: var(--qz-text); }

/* ── Donasi QRIS ── */
.qz-qris-card {
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 16px;
  padding: 18px;
  margin: 16px 0;
  text-align: center;
}
.qz-qris-card h4 { color: var(--qz-text); margin-bottom: 8px; font-family: var(--qz-font-display); font-size: 1rem; }
.qz-qris-card p { color: var(--qz-muted); font-size: 0.85rem; line-height: 1.55; margin-bottom: 14px; }
.qz-qris-img {
  width: 180px;
  max-width: 100%;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s;
  display: block;
  margin: 0 auto 12px;
}
.qz-qris-img:hover { transform: scale(1.03); }

/* ── Bottom-sheet navigator (via portal) ── */
.qz-bs-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 8000;
}
.qz-bs-box {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 520px;
  background: #0f0f14;
  border: 1px solid var(--qz-border);
  border-radius: 20px 20px 0 0;
  padding: 20px 16px 32px;
  z-index: 8001;
  max-height: 65dvh;
  overflow-y: auto;
  animation: qz-slide-up 0.3s ease;
}
.qz-bs-handle {
  width: 40px;
  height: 4px;
  background: var(--qz-border);
  border-radius: 999px;
  margin: 0 auto 16px;
}
.qz-nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
  gap: 8px;
}
.qz-nav-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid var(--qz-border);
  background: var(--qz-surface);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--qz-muted);
}
.qz-nav-cell:hover { border-color: var(--qz-primary); color: var(--qz-text); }
.qz-nav-cell.qz-nc-correct { background: rgba(52,211,153,0.18); border-color: var(--qz-success); color: var(--qz-success); }
.qz-nav-cell.qz-nc-wrong { background: rgba(251,113,133,0.18); border-color: var(--qz-danger); color: var(--qz-danger); }
/* ✅ NEW: soal dipilih tapi belum diperiksa */
.qz-nav-cell.qz-nc-answered { background: rgba(139,123,255,0.12); border-color: rgba(139,123,255,0.4); color: var(--qz-primary); }
.qz-nav-cell.qz-nc-active {
  border-color: var(--qz-primary);
  background: rgba(139,123,255,0.2);
  color: #fff;
  box-shadow: 0 0 0 2px rgba(139,123,255,0.3);
}

/* ── QRIS fullscreen preview (via portal) ── */
.qz-qris-full {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: zoom-out;
  padding: 20px;
}
.qz-qris-full img {
  max-width: 100%;
  max-height: 90dvh;
  border-radius: 16px;
}

/* ── Lanjutkan progres ── */
.qz-resume-card {
  background: rgba(139,123,255,0.08);
  border: 1px solid rgba(139,123,255,0.3);
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 18px;
}
.qz-resume-card h4 { color: var(--qz-primary); margin-bottom: 8px; font-family: var(--qz-font-display); }
.qz-resume-card p { color: var(--qz-muted); font-size: 0.88rem; margin-bottom: 14px; }
.qz-resume-btns { display: flex; gap: 8px; }
.qz-resume-btns .qz-btn { flex: 1; }

/* ════════════════════════════════════════
   ✅ NEW: HALAMAN PILIH PELAJARAN
════════════════════════════════════════ */
.qz-sub-hero {
  text-align: center;
  padding: 48px 0 32px;
}
.qz-sub-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(139,123,255,0.1);
  border: 1px solid rgba(139,123,255,0.3);
  border-radius: 999px;
  padding: 7px 16px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--qz-primary);
  letter-spacing: 0.12em;
  margin-bottom: 22px;
}
.qz-sub-title {
  font-family: var(--qz-font-display);
  font-size: clamp(2rem, 8vw, 2.8rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #f4f4f6 30%, #8b7bff 70%, #5eead4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.qz-sub-desc { color: var(--qz-muted); font-size: 0.95rem; line-height: 1.6; }

.qz-disclaimer {
  background: rgba(251,191,36,0.06);
  border: 1px solid rgba(251,191,36,0.25);
  border-radius: var(--qz-radius);
  padding: 16px 18px;
  margin-bottom: 28px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.qz-disclaimer-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 2px; }
.qz-disclaimer-text h4 { color: var(--qz-warning); font-size: 0.8rem; font-weight: 700; margin-bottom: 6px; font-family: var(--qz-font-display); }
.qz-disclaimer-text p { color: rgba(251,191,36,0.7); font-size: 0.8rem; line-height: 1.6; margin: 0; }

.qz-section-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--qz-muted);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.qz-coming-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 22px 0 14px;
}
.qz-coming-divider span { font-size: 0.72rem; color: var(--qz-muted); font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap; }
.qz-coming-divider::before, .qz-coming-divider::after { content: ''; flex: 1; height: 1px; background: var(--qz-border); }

/* Subject cards */
.qz-subject-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: var(--qz-radius);
  padding: 18px;
  margin-bottom: 10px;
  cursor: default;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}
.qz-subject-card.qz-subj-available {
  border-color: rgba(139,123,255,0.35);
  background: rgba(139,123,255,0.06);
  cursor: pointer;
}
.qz-subject-card.qz-subj-available:hover {
  border-color: rgba(139,123,255,0.6);
  background: rgba(139,123,255,0.11);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(139,123,255,0.2);
}
.qz-subject-card.qz-subj-locked { opacity: 0.5; }
.qz-subj-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  background: rgba(255,255,255,0.05);
}
.qz-subj-info { flex: 1; min-width: 0; }
.qz-subj-name { font-family: var(--qz-font-display); font-weight: 700; font-size: 0.97rem; margin-bottom: 3px; color: var(--qz-text); }
.qz-subj-meta { font-size: 0.78rem; color: var(--qz-muted); }
.qz-subj-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
.qz-badge-avail {
  background: rgba(52,211,153,0.12);
  border: 1px solid rgba(52,211,153,0.4);
  color: var(--qz-success);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
}
.qz-badge-soon {
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  color: var(--qz-muted);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
}
.qz-subj-arrow { color: var(--qz-primary); font-size: 1.1rem; font-weight: 700; }
`;

/* ═══════════════════════════════════════════════
   KOMPONEN UTAMA
═══════════════════════════════════════════════ */
export default function QuizizFakep() {
  const navigate = useNavigate();

  /* ── State utama ── */
  const [screen, setScreen] = useState('subjects'); // ✅ NEW: 'subjects' | 'quiz'
  const [tab, setTab] = useState('mulai'); // 'mulai' | 'quiz' | 'ranking'
  const [mode, setMode] = useState('unlimited'); // 'unlimited' | 'hard'
  const [quizType, setQuizType] = useState('200'); // ✅ NEW: '200' | '50' (soal)
  const [quizUser, setQuizUser] = useState(null); // dari quizAuth
  const [displayName, setDisplayName] = useState('');
  const [nickname, setNickname] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [authAlert, setAuthAlert] = useState('');
  const [authErrType, setAuthErrType] = useState(''); // 'inapp' | 'err'

  /* ── Quiz state ── */
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers]         = useState({}); // { [idx]: selectedIdx }
  const [currentQ, setCurrentQ]       = useState(0);
  // ✅ BUG FIX: checkedSet tracks WHICH questions were explicitly checked
  // Bug lama: 'checked' (single boolean) di-set true di goToQ saat answers[idx]!=null
  // → feedback muncul otomatis saat navigasi ke soal yang sudah dipilih tapi belum diperiksa
  // Bug baru: checkedSet[idx] hanya di-set di checkAnswer(), TIDAK di goToQ()
  const [checkedSet, setCheckedSet]   = useState({}); // { [idx]: true } — hanya saat Periksa Jawaban ditekan

  /* ── Timer ── */
  const [deadline, setDeadline]     = useState(null);
  const [startTime, setStartTime]   = useState(null);
  const [timeLeft, setTimeLeft]     = useState(null); // detik tersisa (display)
  const timerRef = useRef(null);

  /* ── Modal & UI ── */
  const [showResult, setShowResult] = useState(false);
  const [showNav, setShowNav]       = useState(false);
  const [qrisLarge, setQrisLarge]   = useState(false);
  const [qrisError, setQrisError]   = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // '' | 'saving' | 'saved' | 'notbest'
  const [finalStat, setFinalStat]   = useState(null); // { correct, total, score, durationSec, mode }

  /* ── Leaderboard ── */
  const [lb, setLb]         = useState([]);
  const [lbLoading, setLbLoading] = useState(false);
  const [lbError, setLbError]   = useState('');
  const lbUnsubRef = useRef(null);

  /* ── Saved progress ── */
  const [savedProgress, setSavedProgress] = useState(null);
  const [checkingResume, setCheckingResume] = useState(true);

  /* ── Desktop block ── */
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    if (!BLOCK_DESKTOP) return;
    const mq = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* ── Inject Google Fonts ── */
  useEffect(() => {
    const el = document.createElement('link');
    el.rel  = 'stylesheet';
    el.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap';
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  /* ── noindex meta ── */
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name    = 'robots';
    meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  /* ── Auth observer ── */
  useEffect(() => {
    const unsub = onAuthStateChanged(quizAuth, (u) => {
      setQuizUser(u);
      if (u) {
        const name = u.isAnonymous
          ? (u.displayName || localStorage.getItem('qz_nickname') || 'Anonim')
          : (u.displayName || '').slice(0, 24);
        setDisplayName(name);
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  /* ── Cek saved progress ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setSavedProgress(p);
      }
    } catch { /* ignore */ }
    setCheckingResume(false);
  }, []);

  /* ── Autosave progres ── */
  const saveProgress = useCallback((state) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
  }, []);

  const clearProgress = useCallback(() => {
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
  }, []);

  /* ── Timer (deadline-based) ── */
  useEffect(() => {
    if (mode !== 'hard' || !quizStarted || !deadline) return;

    const tick = () => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setTimeLeft(left);
      if (left <= 0) { finishQuiz(true); }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);

    const onVisi = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVisi);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', onVisi);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, quizStarted, deadline]);

  /* ── Autosave saat berubah ── */
  useEffect(() => {
    if (!quizStarted) return;
    saveProgress({ answers, currentQ, mode, deadline, startTime, checkedSet }); // ✅ simpan checkedSet
  }, [answers, currentQ, mode, deadline, startTime, quizStarted, checkedSet, saveProgress]);

  /* ── Leaderboard realtime (saat tab ranking aktif) ── */
  useEffect(() => {
    if (tab !== 'ranking') {
      if (lbUnsubRef.current) { lbUnsubRef.current(); lbUnsubRef.current = null; }
      return;
    }
    setLbLoading(true);
    setLbError('');
    const q = query(
      collection(quizDb, 'quiz_leaderboard'),
      orderBy('score', 'desc'),
      limit(50)
    );
    lbUnsubRef.current = onSnapshot(q,
      (snap) => {
        const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // tie-break: skor sama -> durasi lebih cepat
        rows.sort((a, b) => b.score - a.score || a.durationSec - b.durationSec);
        setLb(rows);
        setLbLoading(false);
      },
      (err) => {
        setLbError('Gagal memuat ranking: ' + err.message);
        setLbLoading(false);
      }
    );
    return () => { if (lbUnsubRef.current) { lbUnsubRef.current(); lbUnsubRef.current = null; } };
  }, [tab]);

  /* ═══════════ COMPUTED ═══════════ */
  // ✅ BUG FIX #2: hanya hitung jawaban yang sudah DIPERIKSA (ada di checkedSet)
  // Bug lama: menghitung semua jawaban yang dipilih → stats bar langsung kasih tau benar/salah
  //           sebelum user pencet "Periksa Jawaban" (jawaban bocor lewat stats bar!)
  const correctCount = useMemo(() => {
    const qs = getQuestions(qType);
    return Object.entries(answers).filter(([idx, sel]) =>
      checkedSet[idx] && sel === qs[Number(idx)].correct
    ).length;
  }, [answers, checkedSet, qType]);

  const wrongCount = useMemo(() => {
    const qs = getQuestions(qType);
    return Object.entries(answers).filter(([idx, sel]) =>
      checkedSet[idx] && sel !== qs[Number(idx)].correct
    ).length;
  }, [answers, checkedSet, qType]);

  const currentScore = useMemo(() => calcScore(correctCount), [correctCount]);

  const timerClass = useMemo(() => {
    if (!timeLeft || mode !== 'hard') return 'qz-timer';
    if (timeLeft < 60) return 'qz-timer qz-timer-danger';
    if (timeLeft < 300) return 'qz-timer qz-timer-warn';
    return 'qz-timer';
  }, [timeLeft, mode]);

  /* ═══════════ HANDLERS ═══════════ */
  const handleGoogleLogin = async () => {
    setAuthAlert('');
    setAuthErrType('');
    // Deteksi in-app browser
    const ua = navigator.userAgent || '';
    if (/Instagram|FBAN|FBAV|Line\/|WhatsApp/i.test(ua)) {
      setAuthAlert('Login Google sering gagal di browser dalam aplikasi (Instagram/WhatsApp/Line). Buka link ini di Chrome atau Safari, atau pilih Main Anonim.');
      setAuthErrType('inapp');
      return;
    }
    try {
      const gp = new GoogleAuthProvider();
      await signInWithPopup(quizAuth, gp);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthAlert('Popup ditutup sebelum selesai. Coba lagi.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthAlert('Popup diblokir browser. Izinkan popup untuk situs ini lalu coba lagi.');
      } else if (err.code === 'auth/network-request-failed') {
        setAuthAlert('Koneksi bermasalah. Cek internet lalu coba lagi.');
      } else {
        setAuthAlert('Login gagal: ' + err.message);
      }
      setAuthErrType('err');
    }
  };

  const handleAnonLogin = async () => {
    setAuthAlert('');
    setAuthErrType('');
    const name = nickname.trim();
    if (name.length < 2 || name.length > 24) {
      setAuthAlert('Nickname harus 2–24 karakter.');
      setAuthErrType('err');
      return;
    }
    if (isNsLeo(name)) {
      setAuthAlert('Nama "Ns Leo" sudah dicadangkan untuk peringkat #1. Pakai nama lain ya 😄');
      setAuthErrType('err');
      return;
    }
    try {
      const cred = await signInAnonymously(quizAuth);
      localStorage.setItem('qz_nickname', name);
      // Update displayName di quizAuth — tidak bisa di-set langsung untuk anonim,
      // simpan di localStorage saja
      setDisplayName(name);
      // Paksa update state
      setQuizUser({ ...cred.user, _nickname: name });
    } catch (err) {
      setAuthAlert('Gagal masuk anonim: ' + err.message);
      setAuthErrType('err');
    }
  };

  const handleSignOut = async () => {
    await signOut(quizAuth);
    setDisplayName('');
    setNickname('');
  };

  const startQuiz = (resumeData) => {
    if (resumeData) {
      setAnswers(resumeData.answers || {});
      setCurrentQ(resumeData.currentQ || 0);
      setMode(resumeData.mode || 'unlimited');
      setDeadline(resumeData.deadline || null);
      setStartTime(resumeData.startTime || Date.now());
      setCheckedSet(resumeData.checkedSet || {}); // ✅ restore checkedSet jika ada
    } else {
      const now = Date.now();
      setAnswers({});
      setCurrentQ(0);
      setCheckedSet({}); // ✅ reset checkedSet
      setStartTime(now);
      if (mode === 'hard') {
        // ✅ NEW: Different timer for 50-soal mode
        const timerMinutes = quizType === '50' ? LATSOL_50_MINUTES : HARD_MODE_MINUTES;
        setDeadline(now + timerMinutes * 60 * 1000);
      } else {
        setDeadline(null);
      }
    }
    setQuizStarted(true);
    setShowResult(false);
    setTab('quiz');
  };

  const finishQuiz = useCallback((timeUp) => {
    clearInterval(timerRef.current);
    const endTime = Date.now();
    const start = startTime || endTime;
    const durationSec = Math.round((endTime - start) / 1000);

    // Hitung final (answers state mungkin stale saat dipanggil dari timer)
    // Gunakan fungsi pure
    // ✅ NEW: Use dynamic questions based on quizType
    const currentQuestions = getQuestions(quizType);
    const finalCorrect = Object.entries(answers).filter(([idx, sel]) =>
      sel === currentQuestions[Number(idx)].correct
    ).length;
    const score = calcScore(finalCorrect, quizType);
    const total = getTotal(quizType);

    const stat = { correct: finalCorrect, total, score, durationSec, mode };
    setFinalStat(stat);
    setShowResult(true);
    setQuizStarted(false);
    clearProgress();
    setSavedProgress(null);

    // Simpan ke Firestore
    saveToLeaderboard(stat);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, mode, startTime, clearProgress, quizType]);

  // Expose finishQuiz ke timer via ref agar selalu fresh
  const finishQuizRef = useRef(finishQuiz);
  useEffect(() => { finishQuizRef.current = finishQuiz; }, [finishQuiz]);

  const saveToLeaderboard = async (stat) => {
    if (!quizUser) return;
    setSaveStatus('saving');
    const uid = quizUser.uid;
    const name = displayName.slice(0, 24);
    if (isNsLeo(name)) { setSaveStatus(''); return; }

    const docRef = doc(quizDb, 'quiz_leaderboard', uid);
    try {
      const existing = await getDoc(docRef);
      const shouldWrite = !existing.exists()
        || stat.score > existing.data().score
        || (stat.score === existing.data().score && stat.durationSec < existing.data().durationSec);

      if (!shouldWrite) { setSaveStatus('notbest'); return; }

      const payload = {
        uid,
        name,
        score: stat.score,
        correct: stat.correct,
        total: stat.total,
        mode: stat.mode,
        durationSec: stat.durationSec,
        isAnonymous: quizUser.isAnonymous ?? true,
        updatedAt: serverTimestamp(),
      };
      if (quizUser.photoURL) payload.photoURL = quizUser.photoURL;

      await setDoc(docRef, payload);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('');
    }
  };

  const selectAnswer = (optIdx) => {
    if (checkedSet[currentQ]) return; // ✅ FIX: cek per soal, bukan satu boolean global
    setAnswers(prev => ({ ...prev, [currentQ]: optIdx }));
  };

  const checkAnswer = () => {
    if (answers[currentQ] == null) return; // belum pilih opsi
    // ✅ FIX: set checkedSet[currentQ] = true — hanya di sini, TIDAK di goToQ
    setCheckedSet(prev => ({ ...prev, [currentQ]: true }));
  };

  const goToQ = (idx) => {
    setCurrentQ(idx);
    // ✅ BUG FIX: HAPUS logika setChecked berdasarkan answers[idx] != null
    // Bug lama: answers[idx]!=null → setChecked(true) → feedback muncul otomatis
    // Sekarang: feedback hanya muncul jika checkedSet[idx] === true (diperiksa eksplisit)
    setShowNav(false);
  };

  const goNext = () => {
    if (currentQ < TOTAL - 1) {
      goToQ(currentQ + 1);
    } else {
      // Soal terakhir — selesai
      finishQuizRef.current(false);
    }
  };

  const goPrev = () => {
    if (currentQ > 0) goToQ(currentQ - 1);
  };

  const handleBackBtn = () => {
    if (quizStarted) {
      const ok = window.confirm('Keluar dari quiz? Progres tersimpan, bisa dilanjutkan nanti.');
      if (!ok) return;
    }
    navigate('/');
  };

  const restartQuiz = () => {
    setShowResult(false);
    setFinalStat(null);
    setSaveStatus('');
    setCheckedSet({}); // ✅ reset per-question check tracking
    startQuiz(null);
  };

  const backToMenu = () => {
    setShowResult(false);
    setFinalStat(null);
    setSaveStatus('');
    setQuizStarted(false);
    setCheckedSet({}); // ✅ reset per-question check tracking
    setTab('mulai');
  };

  // ✅ NEW: back to subject selection
  const backToSubjects = () => {
    backToMenu();
    setScreen('subjects');
  };

  /* ═══════════ COMPUTED untuk tampilan soal ═══════════ */
  // ✅ DYNAMIC TOTAL berdasarkan quiz type
  const TOTAL = getTotal(qType);
  const currentQuestions = getQuestions(qType);
  const q = currentQuestions[currentQ];
  const selectedOpt   = answers[currentQ];
  const isAnswered    = selectedOpt != null;
  const isChecked     = !!checkedSet[currentQ]; // ✅ per-question check status
  const isCorrectAns  = isAnswered && selectedOpt === q.correct;

  const getOptClass = (i) => {
    let cls = 'qz-option';
    if (isChecked) { // ✅ FIX: pakai isChecked (per soal), bukan checked (global)
      cls += ' qz-locked';
      if (i === q.correct) cls += ' qz-correct';
      else if (i === selectedOpt) cls += ' qz-incorrect';
    } else {
      if (i === selectedOpt) cls += ' qz-sel';
    }
    return cls;
  };

  const getNavCellClass = (i) => {
    let cls = 'qz-nav-cell';
    if (i === currentQ) cls += ' qz-nc-active';
    else if (checkedSet[i]) { // ✅ FIX: warnai hanya soal yang sudah diperiksa
      cls += answers[i] === currentQuestions[i].correct ? ' qz-nc-correct' : ' qz-nc-wrong';
    } else if (answers[i] != null) {
      cls += ' qz-nc-answered'; // dipilih tapi belum diperiksa
    }
    return cls;
  };

  /* ═══════════ LEADERBOARD display ═══════════ */
  const lbWithPinned = useMemo(() => {
    const avgScore = lb.length ? Math.round(lb.reduce((s, r) => s + r.score, 0) / lb.length) : 0;
    return { rows: lb, avgScore, total: lb.length };
  }, [lb]);

  /* ═══════════ RENDER ═══════════ */

  // ✅ HALAMAN PILIH PELAJARAN (screen === 'subjects')
  if (screen === 'subjects') {
    return (
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-wrap">
          {/* Hero */}
          <div className="qz-sub-hero">
            <div className="qz-sub-logo">📚 QUIZ KEPERAWATAN</div>
            <h1 className="qz-sub-title">Pilih Mata<br />Pelajaran</h1>
            <p className="qz-sub-desc">Latihan soal HOTS berbasis kisi-kisi dosen</p>
          </div>

          {/* Disclaimer */}
          <div className="qz-disclaimer">
            <div className="qz-disclaimer-icon">⚠️</div>
            <div className="qz-disclaimer-text">
              <h4>DISCLAIMER</h4>
              <p>Pembuatan soal full dengan AI dan contoh soal dari dosen yang sudah diberikan seperti kisi-kisi. Jika ada yang salah, mohon maaf. Semua materi sesuai dengan PPT dosen.</p>
            </div>
          </div>

          {/* Section label */}
          <div className="qz-section-label">Mata Pelajaran</div>

          {/* IBD — TERSEDIA */}
          <div
            className="qz-subject-card qz-subj-available"
            onClick={() => setScreen('quiz')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setScreen('quiz')}
          >
            <div className="qz-subj-icon">🧬</div>
            <div className="qz-subj-info">
              <div className="qz-subj-name">Ilmu Biomedik Dasar</div>
              <div className="qz-subj-meta">IBD · {TOTAL} soal HOTS · Semua TM</div>
            </div>
            <div className="qz-subj-right">
              <span className="qz-badge-avail">✓ Tersedia</span>
              <span className="qz-subj-arrow">→</span>
            </div>
          </div>

          {/* Coming Soon divider */}
          <div className="qz-coming-divider">
            <span>Segera Hadir</span>
          </div>

          {[
            { icon: '📋', name: 'Konsep Dasar Keperawatan', abbr: 'KDK' },
            { icon: '🌍', name: 'Kesehatan Global', abbr: 'KG' },
            { icon: '🌿', name: 'Falsafah & Teori Keperawatan', abbr: 'FTK' },
            { icon: '🇬🇧', name: 'Bahasa Inggris', abbr: 'ENG' },
          ].map(s => (
            <div key={s.abbr} className="qz-subject-card qz-subj-locked">
              <div className="qz-subj-icon">{s.icon}</div>
              <div className="qz-subj-info">
                <div className="qz-subj-name">{s.name}</div>
                <div className="qz-subj-meta">{s.abbr} · Dalam Persiapan</div>
              </div>
              <div className="qz-subj-right">
                <span className="qz-badge-soon">Coming Soon</span>
                <span style={{ fontSize: '1rem' }}>🔒</span>
              </div>
            </div>
          ))}

          <p className="qz-muted" style={{ textAlign: 'center', fontSize: '0.78rem', marginTop: 32, lineHeight: 1.7 }}>
            Quiz ini diperuntukkan untuk latihan mandiri.<br />
            <span style={{ color: 'rgba(139,123,255,0.7)' }}>© SynnnW Quiz Keperawatan</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="qz-root">
      <style>{CSS}</style>

      <div className="qz-wrap">
        {/* Header */}
        <div className="qz-header">
          <button
            className="qz-back-btn"
            onClick={() => {
              if (quizStarted) {
                const ok = window.confirm('Keluar dari quiz? Progres tersimpan, bisa dilanjutkan nanti.');
                if (!ok) return;
              }
              backToSubjects(); // ✅ kembali ke halaman pilih pelajaran
            }}
            aria-label="Kembali ke pilih pelajaran"
          >
            ← Pelajaran
          </button>
          <span className="qz-header-title">IBD · Ilmu Biomedik Dasar</span>
        </div>

        {/* Tabs */}
        <div className="qz-tabs" role="tablist">
          {[['mulai','🏠 Mulai'],['quiz','📝 Quiz'],['ranking','🏆 Ranking']].map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              className={`qz-tab${tab === id ? ' qz-active' : ''}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ══ TAB: MULAI ══ */}
        {tab === 'mulai' && (
          <div role="tabpanel" aria-label="Tab Mulai" style={{ animation: 'qz-fade-up 0.4s ease' }}>
            <div style={{ marginBottom: 20 }}>
              <div className="qz-badge">CBT · KEPERAWATAN</div>
              <h1 className="qz-h1">{QUIZ_TITLE}</h1>
              <p className="qz-muted">{getTotal(quizType)} soal pilihan ganda · IBD HOTS</p>
            </div>

            {/* Resume progres */}
            {!checkingResume && savedProgress && !quizStarted && (
              <div className="qz-resume-card">
                <h4>📂 Lanjutkan Quiz?</h4>
                <p>
                  Kamu punya progres yang belum selesai — soal {(savedProgress.currentQ || 0) + 1} dari {getTotal(quizType)},
                  mode {savedProgress.mode === 'hard' ? 'Hard ⏱️' : 'Unlimited'}.
                </p>
                <div className="qz-resume-btns">
                  <button
                    className="qz-btn qz-btn-primary"
                    onClick={() => { setSavedProgress(null); startQuiz(savedProgress); }}
                  >
                    ▶ Lanjutkan
                  </button>
                  <button
                    className="qz-btn qz-btn-secondary"
                    onClick={() => { clearProgress(); setSavedProgress(null); }}
                  >
                    Mulai Ulang
                  </button>
                </div>
              </div>
            )}

            {/* ✅ NEW: Pilih jenis quiz */}
            <div style={{ marginBottom: 18 }}>
              <h4 style={{ color: 'var(--qz-text)', marginBottom: 10, fontSize: '0.9rem' }}>📋 Pilih Jenis Quiz</h4>
              <div className="qz-type-options">
                <button
                  className={`qz-type-btn${quizType === '200' ? ' qz-active-type' : ''}`}
                  onClick={() => setQuizType('200')}
                >
                  <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>📚</div>
                  <div>200 Soal</div>
                  <div className="qz-type-label">100 menit</div>
                </button>
                <button
                  className={`qz-type-btn${quizType === '50' ? ' qz-active-type' : ''}`}
                  onClick={() => setQuizType('50')}
                >
                  <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>⚡</div>
                  <div>50 Soal</div>
                  <div className="qz-type-label">60 menit</div>
                </button>
              </div>
            </div>

            {/* Pilih mode */}
            <div className="qz-mode-options">
              <div
                className={`qz-mode-card${mode === 'unlimited' ? ' qz-selected' : ''}`}
                onClick={() => setMode('unlimited')}
                role="radio"
                aria-checked={mode === 'unlimited'}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setMode('unlimited')}
              >
                <h4>🟢 Unlimited</h4>
                <p>Tanpa batas waktu. Cocok untuk belajar santai dan memahami materi.</p>
              </div>
              <div
                className={`qz-mode-card${mode === 'hard' ? ' qz-selected' : ''}`}
                onClick={() => setMode('hard')}
                role="radio"
                aria-checked={mode === 'hard'}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setMode('hard')}
              >
                <h4>🔴 {quizType === '50' ? '⚡ LATSOL' : 'IBD SEPELE'}</h4>
                <p>Timer {quizType === '50' ? LATSOL_50_MINUTES : HARD_MODE_MINUTES} menit untuk {getTotal(quizType)} soal. Uji kecepatan dan ketepatan kamu!</p>
              </div>
            </div>

            {/* Auth section */}
            <div className="qz-auth-section">
              <h4>LOGIN UNTUK RANKING</h4>

              {authLoading ? (
                <p className="qz-muted qz-loading">Memuat...</p>
              ) : quizUser ? (
                <>
                  <div className="qz-user-info">
                    {quizUser.photoURL ? (
                      <div className="qz-avatar" style={{ padding: 0 }}>
                        <img src={quizUser.photoURL} alt={displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div className="qz-avatar">{displayName.slice(0, 2).toUpperCase()}</div>
                    )}
                    <span className="qz-user-name">Halo, {displayName} {quizUser.isAnonymous ? '(Anonim)' : ''}</span>
                  </div>
                  {authAlert && (
                    <div className={`qz-alert ${authErrType === 'err' ? 'qz-alert-err' : 'qz-alert-warn'}`}>
                      {authAlert}
                    </div>
                  )}
                  <button
                    className="qz-btn qz-btn-secondary qz-btn-sm"
                    onClick={handleSignOut}
                    style={{ marginBottom: 0 }}
                  >
                    Ganti Akun / Keluar
                  </button>
                </>
              ) : (
                <>
                  {authAlert && (
                    <div className={`qz-alert ${authErrType === 'inapp' ? 'qz-alert-warn' : 'qz-alert-err'}`}>
                      {authAlert}
                    </div>
                  )}
                  <button className="qz-btn qz-btn-secondary" style={{ marginBottom: 10 }} onClick={handleGoogleLogin}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" style={{ width: 18, height: 18, verticalAlign: 'middle', marginRight: 8 }} />
                    Masuk dengan Google
                  </button>
                  <div className="qz-divider">atau</div>
                  <input
                    className="qz-input"
                    type="text"
                    maxLength={24}
                    placeholder="Nickname kamu (2-24 karakter)"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAnonLogin()}
                    aria-label="Nickname untuk main anonim"
                  />
                  <button className="qz-btn qz-btn-secondary" onClick={handleAnonLogin}>
                    👤 Main Anonim
                  </button>
                </>
              )}
            </div>

            {/* Cara penggunaan */}
            <div className="qz-howto">
              <h4>📖 Cara Penggunaan</h4>
              <ol>
                <li>Pilih mode quiz di atas</li>
                <li>Pilih salah satu opsi jawaban</li>
                <li>Klik "Periksa Jawaban" untuk melihat hasil</li>
                <li><strong>Jawaban terkunci</strong> setelah diperiksa — tidak bisa diubah</li>
                <li>Gunakan "← Kembali" atau navigator soal untuk melihat soal lain</li>
                <li>Skor terbaikmu tersimpan di leaderboard</li>
              </ol>
            </div>

            <button
              className="qz-btn qz-btn-primary"
              disabled={!quizUser}
              onClick={() => {
                if (savedProgress) {
                  // Mulai baru (tidak resume) — sudah ada tombol lanjutkan di atas
                  clearProgress();
                  setSavedProgress(null);
                }
                startQuiz(null);
              }}
            >
              {quizUser ? '🚀 Mulai Quiz' : 'Login dulu untuk mulai'}
            </button>
          </div>
        )}

        {/* ══ TAB: QUIZ ══ */}
        {tab === 'quiz' && (
          <div role="tabpanel" aria-label="Tab Quiz">
            {!quizStarted && !showResult ? (
              <div className="qz-empty">
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📝</div>
                <p>Mulai quiz dari tab <strong>Mulai</strong> ya.</p>
              </div>
            ) : showResult ? (
              <div className="qz-empty">
                <p>Quiz selesai! Lihat hasil di popup atau mulai lagi.</p>
              </div>
            ) : (
              <>
                {/* Sticky bar — info singkat */}
                <div className="qz-sticky-bar" aria-label="Statistik quiz">
                  {mode === 'hard' && (
                    <div className={`qz-stat-pill ${timerClass}`} aria-live="polite">
                      <span>{formatDuration(timeLeft)}</span>
                      ⏱️
                    </div>
                  )}
                  <div className="qz-stat-pill qz-correct">
                    <span>{correctCount}</span>
                    ✅
                  </div>
                  <div className="qz-stat-pill qz-wrong">
                    <span>{wrongCount}</span>
                    ❌
                  </div>
                  <div className="qz-stat-pill qz-score">
                    <span>{currentScore}</span>
                    ⭐
                  </div>
                </div>

                {/* Progress */}
                <div className="qz-progress-bar" role="progressbar" aria-valuenow={currentQ + 1} aria-valuemax={TOTAL}>
                  <div
                    className="qz-progress-fill"
                    style={{ width: `${((currentQ + 1) / TOTAL) * 100}%` }}
                  />
                </div>
                <div className="qz-q-counter">Soal {currentQ + 1} / {TOTAL}</div>

                {/* Teks soal */}
                <div className="qz-q-text">{q.text}</div>

                {/* Opsi */}
                <div className="qz-options" role="group" aria-label="Pilihan jawaban">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      className={getOptClass(i)}
                      onClick={() => selectAnswer(i)}
                      aria-pressed={selectedOpt === i}
                      aria-label={`Opsi ${OPTION_LABELS[i]}: ${opt}`}
                    >
                      <span className="qz-option-label">{OPTION_LABELS[i]}</span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>

                {/* Feedback — ✅ FIX: hanya muncul jika isChecked (bukan showFeedback && checked) */}
                {isChecked && (
                  <div className={`qz-feedback ${isCorrectAns ? 'qz-fb-correct' : 'qz-fb-incorrect'}`} aria-live="polite">
                    <h4>{isCorrectAns ? '✅ Jawaban Benar!' : '❌ Jawaban Salah'}</h4>
                    {!isCorrectAns && (
                      <p>Jawaban yang benar: <strong>{OPTION_LABELS[q.correct]}. {q.options[q.correct]}</strong></p>
                    )}
                    <p>{q.explanation}</p>
                  </div>
                )}

                {/* Tombol navigasi */}
                <div className="qz-nav-btns">
                  <button
                    className="qz-btn qz-btn-secondary"
                    onClick={goPrev}
                    disabled={currentQ === 0}
                    aria-label="Soal sebelumnya"
                  >
                    ← Kembali
                  </button>
                  {!isChecked ? ( // ✅ FIX: pakai isChecked per soal
                    <button
                      className="qz-btn qz-btn-primary"
                      onClick={checkAnswer}
                      disabled={!isAnswered}
                      aria-label="Periksa jawaban"
                    >
                      Periksa Jawaban
                    </button>
                  ) : (
                    <button
                      className="qz-btn qz-btn-success"
                      onClick={goNext}
                      aria-label={currentQ < TOTAL - 1 ? 'Soal berikutnya' : 'Selesai quiz'}
                    >
                      {currentQ < TOTAL - 1 ? 'Lanjut →' : '🏁 Selesai'}
                    </button>
                  )}
                </div>

                {/* Toggle navigator soal */}
                <button
                  className="qz-nav-toggle"
                  onClick={() => setShowNav(true)}
                  aria-label="Buka navigator soal"
                >
                  📋 {Object.keys(answers).length}/{TOTAL}
                </button>
              </>
            )}
          </div>
        )}

        {/* ══ TAB: RANKING ══ */}
        {tab === 'ranking' && (
          <div role="tabpanel" aria-label="Tab Ranking" style={{ animation: 'qz-fade-up 0.4s ease' }}>
            <h2 className="qz-h2">🏆 Leaderboard</h2>

            {/* Statistik ringkas */}
            <div className="qz-stats-row">
              <div className="qz-stat-card">
                <h4>PESERTA</h4>
                <div className="qz-val">{lbWithPinned.total}</div>
              </div>
              <div className="qz-stat-card">
                <h4>RATA-RATA SKOR</h4>
                <div className="qz-val">{lbWithPinned.avgScore || '—'}</div>
              </div>
            </div>

            {/* List */}
            <div className="qz-card" data-lenis-prevent>
              {/* Pinned #1 */}
              <div className="qz-lb-row">
                <div className="qz-lb-rank qz-gold">👑</div>
                <div className="qz-lb-avatar" style={{ background: 'linear-gradient(135deg, #fde68a, #f59e0b)' }}>
                  NS
                </div>
                <div style={{ flex: 1 }}>
                  <div className="qz-lb-name">{PINNED_TOP.name}</div>
                  <div className="qz-lb-meta">Skor Sempurna 🎉</div>
                </div>
                <div className="qz-lb-score">{PINNED_TOP.score}</div>
              </div>

              {lbLoading && <div className="qz-loading">Memuat ranking...</div>}
              {lbError && <div className="qz-alert qz-alert-err" style={{ margin: 12 }}>{lbError}</div>}
              {!lbLoading && !lbError && lb.length === 0 && (
                <div className="qz-empty">Belum ada peserta. Jadilah yang pertama! 🚀</div>
              )}

              {lb.map((row, i) => {
                const rank = i + 2; // #1 sudah dipakai Pinned
                const isMe = quizUser && row.uid === quizUser.uid;
                let rankClass = 'qz-lb-rank';
                if (rank === 2) rankClass += ' qz-gold';
                else if (rank === 3) rankClass += ' qz-silver';
                else if (rank === 4) rankClass += ' qz-bronze';

                return (
                  <div key={row.id} className={`qz-lb-row${isMe ? ' qz-me' : ''}`}>
                    <div className={rankClass}>{rank}</div>
                    <div className="qz-lb-avatar">
                      {row.photoURL
                        ? <img src={row.photoURL} alt={row.name} />
                        : row.name.slice(0, 2).toUpperCase()
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="qz-lb-name">
                        {row.name}
                        {isMe && <span className="qz-me-tag">Kamu</span>}
                      </div>
                      <div className="qz-lb-meta">
                        {formatDuration(row.durationSec)} · {row.correct}/{row.total} benar
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <div className="qz-lb-score">{row.score}</div>
                      <span className="qz-badge-mode">{row.mode === 'hard' ? '🔴Sok Iye Kamu' : '🟢 SEPELE MODE'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="qz-muted" style={{ marginTop: 12, fontSize: '0.8rem', textAlign: 'center' }}>
              Hanya 50 peserta teratas yang ditampilkan.
            </p>
          </div>
        )}
      </div>

      {/* ══ PORTALS ══ */}

      {/* Navigator soal — bottom-sheet */}
      {showNav && createPortal(
        <>
          <div className="qz-bs-overlay" onClick={() => setShowNav(false)} aria-hidden="true" />
          <div
            className="qz-bs-box"
            role="dialog"
            aria-label="Navigator soal"
            aria-modal="true"
            data-lenis-prevent
          >
            <div className="qz-bs-handle" />
            <h4 style={{ fontFamily: 'var(--qz-font-display)', color: 'var(--qz-text)', marginBottom: 14, fontSize: '1rem' }}>
              Navigator Soal — {Object.keys(answers).length}/{TOTAL} dijawab
            </h4>
            <div style={{ display: 'flex', gap: 8, fontSize: '0.75rem', color: 'var(--qz-muted)', marginBottom: 12 }}>
              <span style={{ color: 'var(--qz-success)' }}>■</span> Benar&nbsp;
              <span style={{ color: 'var(--qz-danger)' }}>■</span> Salah&nbsp;
              <span style={{ color: 'var(--qz-muted)' }}>■</span> Belum
            </div>
            <div className="qz-nav-grid">
              {getQuestions(qType).map((_, i) => (
                <button
                  key={i}
                  className={getNavCellClass(i)}
                  onClick={() => goToQ(i)}
                  aria-label={`Soal ${i + 1}`}
                >
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
        <div className="qz-modal-overlay" role="dialog" aria-label="Hasil quiz" aria-modal="true">
          <div className="qz-modal-box" data-lenis-prevent>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>
              {finalStat.correct / TOTAL >= 0.8 ? '🎉' : finalStat.correct / TOTAL >= 0.6 ? '💪' : '📖'}
            </div>
            <h2 className="qz-h2" style={{ marginBottom: 4 }}>
              {finalStat.correct / TOTAL >= 0.8 ? 'Luar Biasa!' : finalStat.correct / TOTAL >= 0.6 ? 'Bagus!' : 'Terus Belajar!'}
            </h2>
            <div className="qz-result-score">{finalStat.score}</div>
            <p className="qz-muted" style={{ marginBottom: 16 }}>dari {MAX_SCORE} poin maksimal</p>

            <div className="qz-result-details">
              <div className="qz-result-row">
                <span>Benar</span>
                <span>{finalStat.correct} / {TOTAL}</span>
              </div>
              <div className="qz-result-row">
                <span>Salah</span>
                <span>{TOTAL - finalStat.correct}</span>
              </div>
              <div className="qz-result-row">
                <span>Waktu</span>
                <span>{formatDuration(finalStat.durationSec)}</span>
              </div>
              <div className="qz-result-row">
                <span>Mode</span>
                <span>{finalStat.mode === 'hard' ? '🔴 Sok Iye Kamu Le' : '🟢 Sepele'}</span>
              </div>
              <div className="qz-result-row">
                <span>Status ranking</span>
                <span>
                  {saveStatus === 'saving' && '⏳ Menyimpan...'}
                  {saveStatus === 'saved' && '✅ Tersimpan di ranking'}
                  {saveStatus === 'notbest' && `📊 Skor terbaikmu: ${finalStat.score}`}
                  {saveStatus === '' && '—'}
                </span>
              </div>
            </div>

            {/* Donasi QRIS */}
            {!qrisError && (
              <div className="qz-qris-card">
                <h4>☕ Dukung Quiz Ini</h4>
                <p>Kalau quiz ini bermanfaat buat belajarmu, boleh banget traktir lewat QRIS. Berapa pun sangat berarti 🙏</p>
                <img
                  src={QRIS_IMAGE}
                  alt="QRIS donasi"
                  className="qz-qris-img"
                  onClick={() => setQrisLarge(true)}
                  onError={() => setQrisError(true)}
                />
                <a
                  href={QRIS_IMAGE}
                  download="qris-quiz-keperawatan.jpg"
                  className="qz-btn qz-btn-secondary qz-btn-inline qz-btn-sm"
                >
                  💾 Simpan QRIS
                </a>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              <button
                className="qz-btn qz-btn-secondary"
                onClick={() => { setShowResult(false); setTab('ranking'); }}
              >
                🏆 Lihat Ranking
              </button>
              <button className="qz-btn qz-btn-primary" onClick={restartQuiz}>
                🔄 Coba Lagi
              </button>
              <button className="qz-btn qz-btn-secondary" onClick={backToMenu}>
                🏠 Kembali ke Menu
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* QRIS fullscreen */}
      {qrisLarge && createPortal(
        <div
          className="qz-qris-full"
          onClick={() => setQrisLarge(false)}
          role="dialog"
          aria-label="QRIS diperbesar"
          aria-modal="true"
        >
          <img src={QRIS_IMAGE} alt="QRIS" />
        </div>,
        document.body
      )}
    </div>
  );
}
