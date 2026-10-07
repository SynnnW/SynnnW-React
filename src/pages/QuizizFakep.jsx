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
import { questions50 } from '../data/quizQuestions50'; // ✅ FIXED: import path dan nama file sudah benar
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

/* ── H2 ── */
.qz-h2 {
  font-family: var(--qz-font-display);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 14px;
  color: var(--qz-text);
}

/* ── Desc ── */
.qz-desc {
  color: var(--qz-muted);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

/* ── Button ── */
.qz-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-family: var(--qz-font);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
}
.qz-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qz-btn-primary {
  background: linear-gradient(135deg, var(--qz-primary), var(--qz-primary2));
  color: #fff;
}
.qz-btn-primary:hover:not(:disabled) {
  box-shadow: 0 8px 20px rgba(139,123,255,0.3);
  transform: translateY(-2px);
}

.qz-btn-secondary {
  background: var(--qz-surface2);
  border: 1px solid var(--qz-border);
  color: var(--qz-text);
}
.qz-btn-secondary:hover:not(:disabled) {
  background: var(--qz-surface);
  border-color: var(--qz-primary);
}

.qz-btn-success {
  background: var(--qz-success);
  color: #000;
}
.qz-btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(52,211,153,0.3);
}

.qz-btn-danger {
  background: var(--qz-danger);
  color: #fff;
}

.qz-btn-inline {
  width: auto;
}

.qz-btn-sm {
  padding: 10px 14px;
  font-size: 0.85rem;
}

/* ── Input ── */
.qz-input {
  width: 100%;
  padding: 14px;
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 12px;
  font-family: var(--qz-font);
  font-size: 0.95rem;
  color: var(--qz-text);
}
.qz-input::placeholder {
  color: var(--qz-muted);
}
.qz-input:focus {
  outline: none;
  border-color: var(--qz-primary);
  box-shadow: 0 0 0 3px rgba(139,123,255,0.1);
}

/* ── Soal card ── */
.qz-question {
  margin-bottom: 24px;
}
.qz-q-text {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.6;
  margin-bottom: 16px;
  color: var(--qz-text);
}
.qz-q-num {
  font-family: var(--qz-font-display);
  font-size: 0.8rem;
  color: var(--qz-muted);
  margin-bottom: 6px;
}

/* ── Options ── */
.qz-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.qz-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: var(--qz-surface);
  border: 2px solid var(--qz-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.qz-option:hover {
  background: var(--qz-surface2);
  border-color: var(--qz-primary);
}
.qz-option.qz-selected {
  background: rgba(139,123,255,0.2);
  border-color: var(--qz-primary);
}
.qz-option.qz-correct {
  background: rgba(52,211,153,0.2);
  border-color: var(--qz-success);
}
.qz-option.qz-incorrect {
  background: rgba(251,113,133,0.2);
  border-color: var(--qz-danger);
}
.qz-option-label {
  min-width: 24px;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--qz-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--qz-muted);
  flex-shrink: 0;
}
.qz-option.qz-selected .qz-option-label {
  background: var(--qz-primary);
  color: #fff;
}
.qz-option.qz-correct .qz-option-label {
  background: var(--qz-success);
  color: #fff;
}
.qz-option.qz-incorrect .qz-option-label {
  background: var(--qz-danger);
  color: #fff;
}
.qz-option-text {
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--qz-text);
}

/* ── Explanation ── */
.qz-explanation {
  padding: 14px;
  background: rgba(139,123,255,0.1);
  border-left: 3px solid var(--qz-primary);
  border-radius: 8px;
  margin-top: 16px;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--qz-text);
}

/* ── Progress bar ── */
.qz-progress {
  width: 100%;
  height: 6px;
  background: var(--qz-surface);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 16px;
}
.qz-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--qz-primary), var(--qz-primary2));
  transition: width 0.3s ease;
}

/* ── Timer ── */
.qz-timer {
  display: inline-block;
  padding: 8px 12px;
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 10px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  font-weight: 600;
}
.qz-timer.qz-danger {
  background: rgba(251,113,133,0.2);
  border-color: var(--qz-danger);
  color: var(--qz-danger);
}

/* ── Bottom fixed action ── */
.qz-bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(180deg, rgba(7,7,9,0), rgba(7,7,9,1));
  display: flex;
  gap: 10px;
  z-index: 15;
}
.qz-bottom-action .qz-btn {
  flex: 1;
}

/* ── Loading ── */
.qz-loading {
  text-align: center;
  padding: 40px 20px;
  color: var(--qz-muted);
}

/* ── Empty ── */
.qz-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--qz-muted);
  font-size: 0.95rem;
}

/* ── Alert ── */
.qz-alert {
  padding: 14px;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-bottom: 16px;
}
.qz-alert-err {
  background: rgba(251,113,133,0.2);
  border: 1px solid var(--qz-danger);
  color: var(--qz-danger);
}

/* ── Leaderboard ── */
.qz-stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}
.qz-stat-card {
  padding: 16px;
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 12px;
  text-align: center;
}
.qz-stat-card h4 {
  font-size: 0.75rem;
  color: var(--qz-muted);
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.qz-val {
  font-family: var(--qz-font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--qz-primary);
}

/* ── Leaderboard Row ── */
.qz-lb-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-bottom: 1px solid var(--qz-border);
  transition: background 0.2s;
}
.qz-lb-row:hover {
  background: rgba(139,123,255,0.05);
}
.qz-lb-row.qz-me {
  background: rgba(139,123,255,0.1);
}

.qz-lb-rank {
  min-width: 32px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border-radius: 8px;
  background: var(--qz-surface);
  color: var(--qz-muted);
  font-size: 0.9rem;
}
.qz-lb-rank.qz-gold {
  background: rgba(253,230,138,0.2);
  color: #fde68a;
}
.qz-lb-rank.qz-silver {
  background: rgba(209,213,219,0.2);
  color: #d1d5db;
}
.qz-lb-rank.qz-bronze {
  background: rgba(253,175,106,0.2);
  color: #fdaf6a;
}

.qz-lb-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--qz-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  color: var(--qz-text);
  overflow: hidden;
  flex-shrink: 0;
}
.qz-lb-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.qz-lb-name {
  font-weight: 600;
  color: var(--qz-text);
  margin-bottom: 2px;
}
.qz-lb-meta {
  font-size: 0.85rem;
  color: var(--qz-muted);
}
.qz-me-tag {
  font-size: 0.75rem;
  background: var(--qz-primary);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 6px;
}

.qz-lb-score {
  font-family: var(--qz-font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--qz-primary);
  text-align: right;
}

.qz-badge-mode {
  font-size: 0.7rem;
  background: var(--qz-surface);
  color: var(--qz-muted);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

/* ── Modal ── */
.qz-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
}
.qz-modal-box {
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: var(--qz-radius);
  padding: 28px;
  max-width: 400px;
  width: 100%;
  max-height: 90dvh;
  overflow-y: auto;
  text-align: center;
}

/* ── Result ── */
.qz-result-score {
  font-family: var(--qz-font-display);
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--qz-primary);
  margin: 12px 0;
}
.qz-result-details {
  margin: 20px 0;
  text-align: left;
}
.qz-result-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--qz-border);
  font-size: 0.95rem;
}
.qz-result-row:last-child {
  border-bottom: none;
}

/* ── QRIS ── */
.qz-qris-card {
  margin-top: 20px;
  padding: 16px;
  background: rgba(94,234,212,0.1);
  border: 1px solid rgba(94,234,212,0.3);
  border-radius: 12px;
  text-align: center;
}
.qz-qris-card h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--qz-text);
  margin-bottom: 8px;
}
.qz-qris-card p {
  font-size: 0.85rem;
  color: var(--qz-muted);
  margin-bottom: 12px;
  line-height: 1.4;
}
.qz-qris-img {
  width: 100%;
  max-width: 200px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  margin-bottom: 12px;
}
.qz-qris-img:hover {
  transform: scale(1.05);
}
.qz-qris-full {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  padding: 20px;
}
.qz-qris-full img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 12px;
}

/* ── Bottom Sheet ── */
.qz-bs-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 45;
}
.qz-bs-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  max-height: 80dvh;
  overflow-y: auto;
  z-index: 46;
}
.qz-bs-handle {
  width: 40px;
  height: 4px;
  background: var(--qz-border);
  border-radius: 2px;
  margin: -8px auto 12px;
}

/* ── Nav grid ── */
.qz-nav-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
.qz-nav-grid button {
  padding: 10px;
  background: var(--qz-surface2);
  border: 1px solid var(--qz-border);
  border-radius: 8px;
  color: var(--qz-text);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.qz-nav-grid button:hover {
  background: var(--qz-surface);
  border-color: var(--qz-primary);
}
.qz-nav-grid button.qz-answered {
  background: rgba(52,211,153,0.2);
  border-color: var(--qz-success);
  color: var(--qz-success);
}
.qz-nav-grid button.qz-wrong {
  background: rgba(251,113,133,0.2);
  border-color: var(--qz-danger);
  color: var(--qz-danger);
}

.qz-nav-toggle {
  position: fixed;
  bottom: 80px;
  right: 16px;
  padding: 12px 16px;
  background: var(--qz-primary);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  z-index: 14;
  transition: all 0.2s;
}
.qz-nav-toggle:hover {
  box-shadow: 0 8px 20px rgba(139,123,255,0.3);
  transform: translateY(-2px);
}

/* ── Muted text ── */
.qz-muted {
  color: var(--qz-muted);
}

/* ── Fade animation ── */
@keyframes qz-fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 480px) {
  .qz-wrap { padding-left: 12px; padding-right: 12px; }
  .qz-h2 { font-size: 1.25rem; }
  .qz-btn { padding: 12px 16px; font-size: 0.9rem; }
  .qz-option { padding: 12px; gap: 10px; }
  .qz-nav-grid { grid-template-columns: repeat(4, 1fr); }
  .qz-modal-box { padding: 20px; }
  .qz-result-score { font-size: 2.5rem; }
}
`;

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
export default function QuizizFakep() {
  const nav = useNavigate();

  /* ── Auth state ── */
  const [quizUser, setQuizUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('home'); // home, quiz, ranking

  /* ── Quiz state ── */
  const [qType, setQType] = useState('200'); // '200' atau '50'
  const TOTAL = useMemo(() => getTotal(qType), [qType]);
  const [mode, setMode] = useState('normal'); // normal / hard
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExpl, setShowExpl] = useState(false);
  const [showNav, setShowNav] = useState(false);

  /* ── Result ── */
  const [showResult, setShowResult] = useState(false);
  const [finalStat, setFinalStat] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  /* ── Leaderboard ── */
  const [lb, setLb] = useState([]);
  const [lbLoading, setLbLoading] = useState(true);
  const [lbError, setLbError] = useState('');

  /* ── Timer ── */
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  /* ── QRIS ── */
  const [qrisError, setQrisError] = useState(false);
  const [qrisLarge, setQrisLarge] = useState(false);

  /* ── Auth listener ── */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(quizAuth, async (user) => {
      if (user) {
        setQuizUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /* ── Leaderboard listener ── */
  useEffect(() => {
    if (tab !== 'ranking') return;
    setLbLoading(true);
    setLbError('');
    const q = query(
      collection(quizDb, 'leaderboard'),
      orderBy('score', 'desc'),
      limit(50)
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setLb(data);
        setLbLoading(false);
      },
      (err) => {
        setLbError(err.message);
        setLbLoading(false);
      }
    );
    return () => unsubscribe();
  }, [tab]);

  /* ── Timer logic ── */
  useEffect(() => {
    if (tab !== 'quiz' || !startTimeRef.current) return;
    const tick = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current) / 1000);
      const maxSec = mode === 'hard' ? HARD_MODE_MINUTES * 60 : LATSOL_50_MINUTES * 60;
      const remaining = Math.max(0, maxSec - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(timerRef.current);
        finishQuiz(elapsed);
      }
    };
    timerRef.current = setInterval(tick, 1000);
    tick();
    return () => clearInterval(timerRef.current);
  }, [tab]);

  const startQuiz = useCallback(
    (m) => {
      if (!quizUser) {
        alert('Silakan login terlebih dahulu');
        return;
      }
      setMode(m);
      setCurrentQ(0);
      setAnswers({});
      setShowExpl(false);
      setShowResult(false);
      startTimeRef.current = Date.now();
      setTimeLeft(m === 'hard' ? HARD_MODE_MINUTES * 60 : LATSOL_50_MINUTES * 60);
      setTab('quiz');
    },
    [quizUser]
  );

  const selectAnswer = (idx) => {
    if (showResult) return;
    setAnswers((prev) => ({ ...prev, [currentQ]: idx }));
  };

  const goNext = () => {
    if (currentQ < TOTAL - 1) {
      setCurrentQ((p) => p + 1);
      setShowExpl(false);
    } else {
      finishQuiz(startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0);
    }
  };

  const goPrev = () => {
    if (currentQ > 0) {
      setCurrentQ((p) => p - 1);
      setShowExpl(false);
    }
  };

  const goToQ = (idx) => {
    setCurrentQ(idx);
    setShowExpl(false);
    setShowNav(false);
  };

  const finishQuiz = useCallback(
    async (duration) => {
      clearInterval(timerRef.current);
      const qs = getQuestions(qType);
      let correct = 0;
      Object.entries(answers).forEach(([qIdx, aIdx]) => {
        if (qs[+qIdx]?.correct === aIdx) correct++;
      });
      const score = calcScore(correct, qType);
      const stat = { correct, total: TOTAL, score, durationSec: duration, mode };
      setFinalStat(stat);
      setShowResult(true);

      if (!quizUser) return;
      try {
        setSaveStatus('saving');
        const docRef = doc(quizDb, 'leaderboard', quizUser.uid);
        const docSnap = await getDoc(docRef);
        const existing = docSnap.data();

        if (!existing || score > (existing.score || 0)) {
          await setDoc(
            docRef,
            {
              uid: quizUser.uid,
              name: quizUser.displayName || 'Anonym',
              email: quizUser.email,
              photoURL: quizUser.photoURL || null,
              score,
              correct,
              total: TOTAL,
              durationSec: duration,
              mode,
              timestamp: serverTimestamp(),
            },
            { merge: true }
          );
          setSaveStatus('saved');
        } else {
          setSaveStatus('notbest');
        }
      } catch (err) {
        console.error('Save error:', err);
        setSaveStatus('');
      }
    },
    [quizUser, qType, TOTAL, mode, answers]
  );

  const restartQuiz = () => {
    setShowResult(false);
    setFinalStat(null);
    setCurrentQ(0);
    setAnswers({});
    setShowExpl(false);
    setSaveStatus('');
    startTimeRef.current = Date.now();
  };

  const backToMenu = () => {
    setTab('home');
    setShowResult(false);
    setFinalStat(null);
  };

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(quizAuth, provider);
      setQuizUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      });
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const loginAnonym = async () => {
    try {
      const result = await signInAnonymously(quizAuth);
      setQuizUser({
        uid: result.user.uid,
        email: null,
        displayName: `Guest ${result.user.uid.slice(0, 6)}`,
        photoURL: null,
      });
    } catch (err) {
      console.error('Anonym error:', err);
    }
  };

  const logout = async () => {
    try {
      await signOut(quizAuth);
      setQuizUser(null);
      setTab('home');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getNavCellClass = (i) => {
    let cls = '';
    if (answers[i] !== undefined) {
      const qs = getQuestions(qType);
      if (qs[i]?.correct === answers[i]) cls = 'qz-answered';
      else cls = 'qz-wrong';
    }
    return cls;
  };

  const lbWithPinned = useMemo(() => {
    const total = lb.length + 1;
    const avgScore =
      lb.length > 0 ? Math.round(lb.reduce((a, r) => a + r.score, PINNED_TOP.score) / total) : PINNED_TOP.score;
    return { total, avgScore };
  }, [lb]);

  if (loading) return <div className="qz-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  if (BLOCK_DESKTOP && typeof window !== 'undefined' && window.innerWidth > 768) {
    return (
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-desktop-block">
          <h2>📱 Mobile Only</h2>
          <p>Quiz ini hanya bisa diakses dari perangkat mobile untuk pengalaman terbaik.</p>
        </div>
      </div>
    );
  }

  const quizQuestions = getQuestions(qType);
  const currentQuestion = quizQuestions[currentQ];
  const currentAnswer = answers[currentQ];
  const isCorrect = currentAnswer !== undefined && currentAnswer === currentQuestion.correct;

  return (
    <div className="qz-root">
      <style>{CSS}</style>

      {tab === 'quiz' && (
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 25 }} className="qz-timer">
          {formatDuration(timeLeft)}
        </div>
      )}

      <div className="qz-wrap">
        {/* ══ TAB: HOME ══ */}
        {tab === 'home' && (
          <div role="tabpanel" aria-label="Tab Home" style={{ animation: 'qz-fade-up 0.4s ease' }}>
            <div style={{ padding: '20px 0' }}>
              <h1 style={{ fontFamily: 'var(--qz-font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
                🧠 {QUIZ_TITLE}
              </h1>
              <p className="qz-desc">Latihan soal UTS IBD 2026. Pilih mode dan mulai!</p>
            </div>

            {!quizUser ? (
              <div className="qz-card" style={{ padding: 20, marginBottom: 20 }}>
                <p className="qz-muted" style={{ marginBottom: 12, textAlign: 'center' }}>
                  Login untuk akses ranking dan riwayat
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button className="qz-btn qz-btn-primary" onClick={login}>
                    🔐 Google
                  </button>
                  <button className="qz-btn qz-btn-secondary" onClick={loginAnonym}>
                    👤 Anonim
                  </button>
                </div>
              </div>
            ) : (
              <div className="qz-card" style={{ padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{quizUser.displayName}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--qz-muted)' }}>{quizUser.email || 'Anonymous'}</div>
                </div>
                <button className="qz-btn qz-btn-secondary qz-btn-sm qz-btn-inline" onClick={logout}>
                  Logout
                </button>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--qz-font-display)', fontSize: '1.1rem', fontWeight: 600, marginBottom: 12 }}>
                Pilih Mode
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  className="qz-btn qz-btn-primary"
                  onClick={() => {
                    setQType('200');
                    startQuiz('normal');
                  }}
                  disabled={!quizUser}
                >
                  🟢 Mode Biasa (200 soal, 100 menit)
                </button>
                <button
                  className="qz-btn qz-btn-primary"
                  onClick={() => {
                    setQType('50');
                    startQuiz('hard');
                  }}
                  disabled={!quizUser}
                >
                  🔴 LATSOL 50 Soal IBD 2026 (60 menit)
                </button>
              </div>
            </div>

            <div className="qz-tabs">
              <button className="qz-tab qz-active" onClick={() => setTab('home')}>
                🏠 Beranda
              </button>
              <button className="qz-tab" onClick={() => setTab('ranking')}>
                🏆 Ranking
              </button>
            </div>
          </div>
        )}

        {/* ══ TAB: QUIZ ══ */}
        {tab === 'quiz' && (
          <div role="tabpanel" aria-label="Tab Quiz" style={{ paddingBottom: 120 }}>
            <div className="qz-header">
              <span className="qz-header-title">
                Soal {currentQ + 1} / {TOTAL}
              </span>
              <button className="qz-back-btn" onClick={backToMenu}>
                ✕ Keluar
              </button>
            </div>

            <div className="qz-progress">
              <div className="qz-progress-bar" style={{ width: `${((currentQ + 1) / TOTAL) * 100}%` }} />
            </div>

            <div className="qz-card" style={{ padding: 20, marginBottom: 20 }}>
              <div className="qz-q-num">Soal No. {currentQ + 1}</div>
              <p className="qz-q-text">{currentQuestion.text}</p>

              {!showResult && (
                <div className="qz-options">
                  {currentQuestion.options.map((opt, i) => (
                    <button
                      key={i}
                      className={`qz-option ${
                        currentAnswer === i
                          ? isCorrect
                            ? 'qz-correct'
                            : 'qz-incorrect'
                          : ''
                      }`}
                      onClick={() => selectAnswer(i)}
                      disabled={showResult}
                    >
                      <span className="qz-option-label">{OPTION_LABELS[i]}</span>
                      <span className="qz-option-text">{opt}</span>
                    </button>
                  ))}
                </div>
              )}

              {showResult && (
                <div className="qz-options">
                  {currentQuestion.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`qz-option ${
                        i === currentQuestion.correct
                          ? 'qz-correct'
                          : currentAnswer === i
                            ? 'qz-incorrect'
                            : ''
                      }`}
                    >
                      <span className="qz-option-label">{OPTION_LABELS[i]}</span>
                      <span className="qz-option-text">{opt}</span>
                    </div>
                  ))}
                </div>
              )}

              {currentAnswer !== undefined && (
                <div style={{ marginTop: 16 }}>
                  <button
                    onClick={() => setShowExpl(!showExpl)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'none',
                      border: '1px solid var(--qz-border)',
                      borderRadius: '8px',
                      color: 'var(--qz-muted)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    {showExpl ? '▼' : '▶'} Pembahasan
                  </button>
                  {showExpl && <div className="qz-explanation">{currentQuestion.explanation}</div>}
                </div>
              )}
            </div>

            {!showResult && (
              <div className="qz-bottom-action">
                <button className="qz-btn qz-btn-secondary" onClick={goPrev} disabled={currentQ === 0}>
                  ← Sebelumnya
                </button>
                {currentAnswer === undefined ? (
                  <button className="qz-btn qz-btn-secondary" disabled>
                    ⏸ Lewati
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
            )}

            {/* Toggle navigator soal */}
            <button
              className="qz-nav-toggle"
              onClick={() => setShowNav(true)}
              aria-label="Buka navigator soal"
            >
              📋 {Object.keys(answers).length}/{TOTAL}
            </button>
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
                const rank = i + 2;
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
                      <span className="qz-badge-mode">{row.mode === 'hard' ? '🔴 Sok Iye' : '🟢 Sepele'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="qz-muted" style={{ marginTop: 12, fontSize: '0.8rem', textAlign: 'center' }}>
              Hanya 50 peserta teratas yang ditampilkan.
            </p>

            <div className="qz-tabs" style={{ marginTop: 20 }}>
              <button className="qz-tab" onClick={() => setTab('home')}>
                🏠 Beranda
              </button>
              <button className="qz-tab qz-active" onClick={() => setTab('ranking')}>
                🏆 Ranking
              </button>
            </div>
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
                <span>{finalStat.mode === 'hard' ? '🔴 Sok Iye' : '🟢 Sepele'}</span>
              </div>
              <div className="qz-result-row">
                <span>Status ranking</span>
                <span>
                  {saveStatus === 'saving' && '⏳ Menyimpan...'}
                  {saveStatus === 'saved' && '✅ Tersimpan'}
                  {saveStatus === 'notbest' && '📊 Bukan skor terbaik'}
                  {saveStatus === '' && '—'}
                </span>
              </div>
            </div>

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
    </div>
  );
}
