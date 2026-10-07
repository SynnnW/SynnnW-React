// src/pages/QuizizFakep.jsx
// Quiz Keperawatan — santai, friendly, lengkap tanpa potong
// Fitur: auth Google/anonim (Firebase instance terpisah), leaderboard Firestore, donasi QRIS

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
  onSnapshot, query, orderBy, limit, serverTimestamp, deleteDoc,
} from 'firebase/firestore';
import { questions as questions100 } from '../data/quizQuestions';
import { questions50 as questions40 } from '../data/quizQuestions50';
import './firebase';

/* ═══════════════════════════════════════════════
   KONSTANTA — edit sesuai kebutuhan
═══════════════════════════════════════════════ */
const QUIZ_TITLE = 'Latihan Soal';
const ADMIN_EMAIL = 'aldokraksaan@gmail.com';
const MODE_CONFIG = {
  '100-sepele': { name: 'Sepele Mode', count: 100, timeLimit: 100 * 60, maxScore: 1000 },
  '100-hard': { name: 'Sok Iye Kamu', count: 100, timeLimit: 100 * 60, maxScore: 1000 },
  '40-unlimited': { name: 'Unlimited Quiz', count: 40, timeLimit: 45 * 60, maxScore: 400 },
};
const QRIS_IMAGE = '/assets/img/qris.jpg';
const LS_KEY = 'qz_v5';
const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];
const PINNED_TOP = { name: 'Ns Leo', score: 1000 };

const quizApp = getApps().find(a => a.name === 'quiz') || initializeApp(getApp().options, 'quiz');
const quizAuth = getAuth(quizApp);
const quizDb = getFirestore(quizApp);

/* ═══════════════════════════════════════════════
   HELPER
═══════════════════════════════════════════════ */
const fmt = (sec) => sec == null || sec < 0 ? '--' : `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
const score = (c, t, m) => Math.round((c / t) * m);
const isAdmin = (email) => email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

/* ═══════════════════════════════════════════════
   CSS — SANTAI & FRIENDLY STYLING
═══════════════════════════════════════════════ */
const CSS = `
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

/* Blur background */
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

/* Wrapper utama */
.qz-wrap {
  max-width: 520px;
  margin: 0 auto;
  padding: 0 16px 80px;
  position: relative;
  z-index: 1;
}

/* Header */
.qz-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 0 12px;
  border-bottom: 1px solid var(--qz-border);
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  background: rgba(7,7,9,.95);
  backdrop-filter: blur(10px);
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

/* Tabs */
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
.qz-tab:hover { 
  color: var(--qz-text); 
  background: var(--qz-surface);
}
.qz-tab.qz-active {
  color: #fff;
  background: linear-gradient(135deg, rgba(139,123,255,0.35), rgba(94,234,212,0.15));
  box-shadow: inset 0 0 0 1px rgba(139,123,255,0.4);
}

/* Card */
.qz-card {
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: var(--qz-radius);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
}
.qz-card-pad { padding: 24px; }

/* Badge */
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

/* Typography */
.qz-h1 {
  font-family: var(--qz-font-display);
  font-size: clamp(1.8rem, 6vw, 2.8rem);
  font-weight: 800;
  background: linear-gradient(120deg, #fff 25%, var(--qz-primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 12px;
}
.qz-h2 {
  font-family: var(--qz-font-display);
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--qz-text);
}

/* Mode buttons */
.qz-modes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}
.qz-mode-btn {
  padding: 20px;
  background: var(--qz-surface);
  border: 1.5px solid var(--qz-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s;
  text-align: center;
  color: var(--qz-text);
}
.qz-mode-btn:hover {
  border-color: var(--qz-primary);
  background: rgba(139,123,255,0.08);
}
.qz-mode-btn .label {
  font-size: 0.9rem;
  font-weight: 700;
  display: block;
  margin-bottom: 8px;
  color: var(--qz-text);
}
.qz-mode-btn .desc {
  font-size: 0.8rem;
  color: var(--qz-muted);
}

/* Buttons */
.qz-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font: 600 0.95rem var(--qz-font);
  transition: all 0.25s;
  margin-top: 12px;
}
.qz-btn-primary {
  background: linear-gradient(135deg, #8b7bff, #7c5cdb);
  color: #fff;
}
.qz-btn-primary:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(139,123,255,0.4);
}
.qz-btn-secondary {
  background: var(--qz-surface);
  border: 1.5px solid var(--qz-border);
  color: var(--qz-text);
}
.qz-btn-secondary:hover {
  border-color: var(--qz-primary);
  background: rgba(139,123,255,0.05);
}
.qz-btn-success {
  background: linear-gradient(135deg, #34d399, #2dd4bf);
  color: #fff;
}
.qz-btn-success:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(52,211,153,0.3);
}

/* Soal */
.qz-q-text {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 24px 0 16px;
  line-height: 1.6;
  color: var(--qz-text);
}
.qz-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.qz-option {
  width: 100%;
  padding: 14px 16px;
  background: var(--qz-surface);
  border: 1.5px solid var(--qz-border);
  border-radius: 10px;
  text-align: left;
  cursor: pointer;
  transition: all 0.25s;
  color: var(--qz-text);
}
.qz-option:hover {
  border-color: var(--qz-primary);
  background: rgba(139,123,255,0.08);
}
.qz-option.selected {
  border-color: var(--qz-primary);
  background: rgba(139,123,255,0.15);
}
.qz-option.correct {
  border-color: #34d399;
  background: rgba(52,211,153,0.12);
}
.qz-option.wrong {
  border-color: #fb7185;
  background: rgba(251,113,133,0.12);
}

/* Feedback */
.qz-feedback {
  padding: 14px;
  border-radius: 10px;
  margin-top: 16px;
  font-size: 0.9rem;
}
.qz-feedback.ok {
  background: rgba(52,211,153,0.12);
  border: 1px solid #34d399;
  color: #34d399;
}
.qz-feedback.err {
  background: rgba(251,113,133,0.12);
  border: 1px solid #fb7185;
  color: #fb7185;
}

/* Progress bar */
.qz-prog-bar {
  width: 100%;
  height: 6px;
  background: var(--qz-border);
  border-radius: 999px;
  overflow: hidden;
  margin: 20px 0;
}
.qz-prog-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b7bff, #5eead4);
  transition: width 0.3s;
}

/* Navigator grid */
.qz-nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(36px, 1fr));
  gap: 6px;
  max-height: 300px;
  overflow-y: auto;
}
.qz-nav-cell {
  padding: 8px;
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
  color: var(--qz-text);
}
.qz-nav-cell.ok {
  background: #34d399;
  color: #fff;
  border-color: #34d399;
}
.qz-nav-cell.err {
  background: #fb7185;
  color: #fff;
  border-color: #fb7185;
}

/* Leaderboard */
.qz-stat-card {
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}
.qz-stat-card h4 {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--qz-muted);
  margin: 0 0 8px;
  text-transform: uppercase;
}
.qz-val {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--qz-primary), var(--qz-primary2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.qz-stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

/* Leaderboard rows */
.qz-lb-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 14px;
  border-bottom: 1px solid var(--qz-border);
  transition: all 0.2s;
}
.qz-lb-row:hover {
  background: rgba(139,123,255,0.04);
}
.qz-lb-row.qz-me {
  background: rgba(94,234,212,0.08);
  border-left: 3px solid var(--qz-primary2);
  padding-left: 11px;
}

.qz-lb-rank {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--qz-surface);
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--qz-primary);
}
.qz-lb-rank.qz-gold { color: #fbbf24; }
.qz-lb-rank.qz-silver { color: #a1a1a9; }
.qz-lb-rank.qz-bronze { color: #d97706; }

.qz-lb-avatar {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--qz-primary), var(--qz-primary2));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  overflow: hidden;
  flex-shrink: 0;
}
.qz-lb-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.qz-lb-info {
  flex: 1;
}
.qz-lb-name {
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--qz-text);
  display: flex;
  align-items: center;
  gap: 8px;
}
.qz-me-tag {
  font-size: 0.7rem;
  padding: 4px 8px;
  background: rgba(94,234,212,0.2);
  border: 1px solid var(--qz-primary2);
  border-radius: 4px;
  color: var(--qz-primary2);
}
.qz-lb-meta {
  font-size: 0.8rem;
  color: var(--qz-muted);
}
.qz-lb-score {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--qz-primary);
  min-width: 60px;
  text-align: right;
}
.qz-badge-mode {
  font-size: 0.7rem;
  padding: 4px 8px;
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 4px;
  color: var(--qz-muted);
}

/* Result screen */
.qz-result-score {
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--qz-primary), var(--qz-primary2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 4px;
}
.qz-result-details {
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 12px;
  padding: 16px;
  margin: 20px 0;
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
.qz-result-row span:last-child {
  font-weight: 700;
  color: var(--qz-primary2);
}

/* QRIS section */
.qz-qris-card {
  background: linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05));
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  margin: 20px 0;
}
.qz-qris-card h4 {
  font-family: var(--qz-font-display);
  color: var(--qz-text);
  margin-bottom: 8px;
}
.qz-qris-card p {
  color: var(--qz-muted);
  font-size: 0.9rem;
  margin-bottom: 12px;
  line-height: 1.5;
}
.qz-qris-img {
  width: 100%;
  max-width: 200px;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}
.qz-qris-img:hover {
  transform: scale(1.05);
}

/* Bottom sheet */
.qz-bs-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 30;
  animation: qz-fade-in 0.3s ease;
}
.qz-bs-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 31;
  padding: 16px;
  animation: qz-slide-up 0.3s ease;
}
.qz-bs-handle {
  width: 40px;
  height: 4px;
  background: var(--qz-border);
  border-radius: 2px;
  margin: 0 auto 16px;
}

/* Modal */
.qz-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
  animation: qz-fade-in 0.3s ease;
}
.qz-modal-box {
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: var(--qz-radius);
  padding: 28px 24px;
  max-width: 400px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  animation: qz-scale-in 0.3s ease;
}
.qz-modal-box > * + * {
  margin-top: 16px;
}

/* QRIS fullscreen */
.qz-qris-full {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  cursor: pointer;
  animation: qz-fade-in 0.3s ease;
  padding: 20px;
}
.qz-qris-full img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 12px;
}

/* Loading & Empty states */
.qz-loading,
.qz-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--qz-muted);
}
.qz-loading {
  font-size: 0.9rem;
}
.qz-empty {
  font-size: 1rem;
}

/* Alert */
.qz-alert {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
}
.qz-alert-err {
  background: rgba(251,113,133,0.12);
  border: 1px solid #fb7185;
  color: #fb7185;
}

/* Navigation toggle */
.qz-nav-toggle {
  width: 100%;
  padding: 12px;
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  border-radius: 10px;
  color: var(--qz-text);
  font-family: var(--qz-font);
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s;
  font-weight: 600;
}
.qz-nav-toggle:hover {
  border-color: var(--qz-primary);
  background: rgba(139,123,255,0.08);
}

/* Animations */
@keyframes qz-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes qz-fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes qz-slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@keyframes qz-scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.qz-muted {
  color: var(--qz-muted);
}

/* Sticky bar */
.qz-sticky-bar {
  position: fixed;
  top: 80px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 19;
}
.qz-stat {
  background: var(--qz-surface);
  border: 1px solid var(--qz-border);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--qz-text);
  backdrop-filter: blur(10px);
}
.qz-stat-timer.danger {
  color: #fb7185;
}
`;

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
export default function QuizizFakep() {
  const navigate = useNavigate();

  // STATE
  const [page, setPage] = useState('menu');
  const [tab, setTab] = useState('quiz');
  const [mode, setMode] = useState('100-sepele');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [finalStat, setFinalStat] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [quizUser, setQuizUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [showNav, setShowNav] = useState(false);
  const [lb, setLb] = useState([]);
  const [lbLoading, setLbLoading] = useState(false);
  const [lbError, setLbError] = useState('');
  const [qrisError, setQrisError] = useState(false);
  const [qrisLarge, setQrisLarge] = useState(false);

  const modeConf = MODE_CONFIG[mode];
  const TOTAL = modeConf.count;
  const MAX_SCORE = modeConf.maxScore;
  const QUESTIONS = mode.includes('40') ? questions40 : questions100;

  // AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(quizAuth, (u) => {
      setQuizUser(u);
    });
    return unsub;
  }, []);

  // QUIZ TIMER
  useEffect(() => {
    if (page !== 'quiz' || !startTime) return;
    const intv = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, modeConf.timeLimit - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) {
        finishQuiz();
      }
    }, 100);
    return () => clearInterval(intv);
  }, [page, startTime, modeConf.timeLimit]);

  // LEADERBOARD LISTENER
  useEffect(() => {
    if (tab !== 'ranking') return;
    setLbLoading(true);
    const q = query(
      collection(quizDb, 'scores'),
      orderBy('score', 'desc'),
      limit(50)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setLb(data);
      setLbLoading(false);
    }, (err) => {
      setLbError(err.message);
      setLbLoading(false);
    });
    return unsub;
  }, [tab]);

  // FUNCTIONS
  const startQuiz = () => {
    setPage('quiz');
    setCurrentQ(0);
    setAnswers({});
    setUserAnswers({});
    setRevealed({});
    setShowResult(false);
    setStartTime(Date.now());
    setTimeLeft(modeConf.timeLimit);
  };

  const selectOption = (idx) => {
    if (revealed[currentQ]) return;
    setUserAnswers({
      ...userAnswers,
      [currentQ]: idx,
    });
  };

  const checkAnswer = () => {
    const correct = userAnswers[currentQ] === QUESTIONS[currentQ].correct;
    setAnswers({
      ...answers,
      [currentQ]: correct,
    });
    setRevealed({
      ...revealed,
      [currentQ]: true,
    });
  };

  const goNext = () => {
    if (currentQ < TOTAL - 1) {
      setCurrentQ(currentQ + 1);
      setRevealed({});
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const correct = Object.values(answers).filter((v) => v).length;
    const durationSec = Math.floor((Date.now() - startTime) / 1000);
    const s = score(correct, TOTAL, MAX_SCORE);
    setFinalStat({
      correct,
      total: TOTAL,
      score: s,
      durationSec,
      mode: mode.split('-')[1],
    });
    setShowResult(true);

    // Save to Firestore
    if (quizUser) {
      setSaveStatus('saving');
      const userDocRef = doc(quizDb, 'scores', quizUser.uid);
      getDoc(userDocRef)
        .then((docSnap) => {
          const isBest = !docSnap.exists() || s > docSnap.data().score;
          if (isBest) {
            return setDoc(userDocRef, {
              uid: quizUser.uid,
              name: quizUser.displayName || 'Anonim',
              photoURL: quizUser.photoURL || null,
              email: quizUser.email || '',
              score: s,
              correct,
              total: TOTAL,
              durationSec,
              mode: mode.split('-')[1],
              timestamp: serverTimestamp(),
            });
          } else {
            setSaveStatus('notbest');
          }
        })
        .then(() => {
          setSaveStatus('saved');
        })
        .catch((err) => {
          console.error('Save error:', err);
          setSaveStatus('');
        });
    }
  };

  const restartQuiz = () => {
    startQuiz();
  };

  const backToMenu = () => {
    setPage('menu');
    setTab('quiz');
  };

  const goToQ = (idx) => {
    setCurrentQ(idx);
    setShowNav(false);
  };

  const getNavCellClass = (idx) => {
    let cls = 'qz-nav-cell';
    if (answers[idx] === true) cls += ' ok';
    else if (answers[idx] === false) cls += ' err';
    return cls;
  };

  const loginGoogle = async () => {
    try {
      await signInWithPopup(quizAuth, new GoogleAuthProvider());
    } catch (err) {
      console.error(err);
    }
  };

  const loginAnon = async () => {
    try {
      await signInAnonymously(quizAuth);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(quizAuth);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteScore = async (id) => {
    if (!window.confirm('Hapus entry ini?')) return;
    try {
      await deleteDoc(doc(quizDb, 'scores', id));
    } catch (err) {
      console.error(err);
    }
  };

  const lbWithPinned = useMemo(() => {
    const data = [PINNED_TOP, ...lb];
    const avg = lb.length
      ? Math.round(lb.reduce((a, b) => a + b.score, 0) / lb.length)
      : '—';
    return {
      data,
      total: lb.length + 1,
      avgScore: avg,
    };
  }, [lb]);

  // RENDER
  if (!quizUser) {
    return (
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-wrap">
          <div className="qz-card qz-card-pad" style={{ marginTop: '80px', textAlign: 'center' }}>
            <h1 className="qz-h1">📚 Quiz</h1>
            <p style={{ color: 'var(--qz-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
              Yuk login dulu biar skor kamu tersimpan di ranking! 🏆
            </p>
            <button className="qz-btn qz-btn-primary" onClick={loginGoogle}>
              🔐 Login Google
            </button>
            <button className="qz-btn qz-btn-secondary" onClick={loginAnon}>
              ⚡ Lanjut Anonim
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MENU
  if (page === 'menu') {
    return (
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-wrap">
          <div className="qz-header">
            <span className="qz-header-title">🎯 {QUIZ_TITLE}</span>
            {quizUser.email && (
              <button className="qz-back-btn" onClick={logout}>
                🚪 Keluar
              </button>
            )}
          </div>

          <div className="qz-card qz-card-pad" style={{ marginBottom: '20px' }}>
            <h1 className="qz-h1">Pilih Mode</h1>
            <p style={{ color: 'var(--qz-muted)', marginBottom: '24px' }}>
              {quizUser.displayName || 'Sobat'}, siap belajar? 💪
            </p>

            <div className="qz-modes">
              {Object.entries(MODE_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  className="qz-mode-btn"
                  onClick={() => {
                    setMode(key);
                    startQuiz();
                  }}
                >
                  <div className="label">{cfg.name}</div>
                  <div className="desc">{cfg.count} soal</div>
                </button>
              ))}
            </div>
          </div>

          <div className="qz-card qz-card-pad">
            <h2 className="qz-h2">🏆 Ranking</h2>
            <button
              className="qz-btn qz-btn-primary"
              onClick={() => setTab('ranking')}
              style={{ marginTop: 0 }}
            >
              Lihat Leaderboard
            </button>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--qz-muted)', marginTop: '40px', fontSize: '0.85rem' }}>
            <p>✨ Semangat! Kamu bisa jadi juara! 🚀</p>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ
  if (page === 'quiz') {
    const q = QUESTIONS[currentQ];
    const answered = userAnswers[currentQ] !== undefined;
    const isRevealed = revealed[currentQ];
    const progressPct = ((currentQ + 1) / TOTAL) * 100;

    return (
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-wrap">
          <div className="qz-header">
            <button className="qz-back-btn" onClick={() => setPage('menu')}>
              ← Menu
            </button>
            <span className="qz-header-title">
              {currentQ + 1} / {TOTAL}
            </span>
          </div>

          {timeLeft !== null && (
            <div className={`qz-stat ${timeLeft < 300 ? 'qz-stat-timer danger' : ''}`}>
              ⏱️ {fmt(timeLeft)}
            </div>
          )}

          <div className="qz-prog-bar">
            <div className="qz-prog-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="qz-card qz-card-pad">
            <div className="qz-q-text">{q.question}</div>

            <div className="qz-options">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  className={`qz-option ${
                    userAnswers[currentQ] === i ? 'selected' : ''
                  } ${isRevealed && i === q.correct ? 'correct' : ''}
                  ${isRevealed && userAnswers[currentQ] === i && i !== q.correct ? 'wrong' : ''}`}
                  onClick={() => selectOption(i)}
                  disabled={isRevealed}
                >
                  <strong>{OPTION_LABELS[i]}.</strong> {opt}
                </button>
              ))}
            </div>

            {isRevealed && (
              <div className={`qz-feedback ${answers[currentQ] ? 'ok' : 'err'}`}>
                {answers[currentQ]
                  ? '✅ Benar! Mantap!'
                  : `❌ Salah. Jawaban yang benar adalah ${OPTION_LABELS[q.correct]}`}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {!isRevealed ? (
                <button
                  className="qz-btn qz-btn-primary"
                  onClick={checkAnswer}
                  disabled={!answered}
                >
                  Periksa Jawaban
                </button>
              ) : (
                <button className="qz-btn qz-btn-success" onClick={goNext}>
                  {currentQ < TOTAL - 1 ? 'Lanjut →' : '🏁 Selesai'}
                </button>
              )}
            </div>

            <button
              className="qz-nav-toggle"
              onClick={() => setShowNav(true)}
              aria-label="Buka navigator soal"
            >
              📋 {Object.keys(answers).length}/{TOTAL}
            </button>
          </div>
        </div>

        {/* Navigator bottom sheet */}
        {showNav &&
          createPortal(
            <>
              <div className="qz-bs-overlay" onClick={() => setShowNav(false)} />
              <div className="qz-bs-box" role="dialog" aria-label="Navigator soal">
                <div className="qz-bs-handle" />
                <h4 style={{ fontFamily: 'var(--qz-font-display)', color: 'var(--qz-text)', marginBottom: '14px', fontSize: '1rem' }}>
                  Navigator Soal — {Object.keys(answers).length}/{TOTAL}
                </h4>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--qz-muted)', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--qz-success)' }}>■</span> Benar&nbsp;
                  <span style={{ color: 'var(--qz-danger)' }}>■</span> Salah&nbsp;
                  <span style={{ color: 'var(--qz-muted)' }}>■</span> Belum
                </div>
                <div className="qz-nav-grid">
                  {QUESTIONS.map((_, i) => (
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
      </div>
    );
  }

  // RANKING
  if (tab === 'ranking') {
    return (
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-wrap">
          <div className="qz-header">
            <button className="qz-back-btn" onClick={() => setTab('quiz')}>
              ← Kembali
            </button>
            <span className="qz-header-title">🏆 Leaderboard</span>
          </div>

          <div className="qz-stats-row">
            <div className="qz-stat-card">
              <h4>PESERTA</h4>
              <div className="qz-val">{lbWithPinned.total}</div>
            </div>
            <div className="qz-stat-card">
              <h4>RATA-RATA</h4>
              <div className="qz-val">{lbWithPinned.avgScore}</div>
            </div>
          </div>

          <div className="qz-card">
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
            {lbError && <div className="qz-alert qz-alert-err" style={{ margin: '12px' }}>{lbError}</div>}
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
                    {row.photoURL ? (
                      <img src={row.photoURL} alt={row.name} />
                    ) : (
                      row.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="qz-lb-name">
                      {row.name}
                      {isMe && <span className="qz-me-tag">Kamu</span>}
                    </div>
                    <div className="qz-lb-meta">
                      {fmt(row.durationSec)} · {row.correct}/{row.total} benar
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <div className="qz-lb-score">{row.score}</div>
                    {isAdmin(quizUser?.email) && (
                      <button
                        onClick={() => deleteScore(row.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fb7185',
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          transition: 'all 0.2s',
                          padding: '4px',
                        }}
                        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.2)')}
                        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', color: 'var(--qz-muted)', marginTop: '24px', fontSize: '0.85rem' }}>
            <p>Hanya 50 peserta teratas yang ditampilkan</p>
          </div>

          <button className="qz-btn qz-btn-primary" onClick={() => setTab('quiz')}>
            🎯 Mulai Quiz
          </button>
        </div>
      </div>
    );
  }

  // RESULT
  if (showResult && finalStat) {
    return (
      <div className="qz-root">
        <style>{CSS}</style>
        {createPortal(
          <div className="qz-modal-overlay" role="dialog" aria-label="Hasil quiz" aria-modal="true">
            <div className="qz-modal-box">
              <div style={{ fontSize: '2.5rem', marginBottom: '8px', textAlign: 'center' }}>
                {finalStat.correct / TOTAL >= 0.8 ? '🎉' : finalStat.correct / TOTAL >= 0.6 ? '💪' : '📖'}
              </div>
              <h2 className="qz-h2" style={{ textAlign: 'center', marginBottom: '4px' }}>
                {finalStat.correct / TOTAL >= 0.8 ? 'Luar Biasa!' : finalStat.correct / TOTAL >= 0.6 ? 'Bagus!' : 'Terus Belajar!'}
              </h2>
              <div className="qz-result-score" style={{ textAlign: 'center' }}>
                {finalStat.score}
              </div>
              <p className="qz-muted" style={{ marginBottom: '16px', textAlign: 'center' }}>
                dari {MAX_SCORE} poin maksimal
              </p>

              <div className="qz-result-details">
                <div className="qz-result-row">
                  <span>✓ Benar</span>
                  <span>{finalStat.correct} / {TOTAL}</span>
                </div>
                <div className="qz-result-row">
                  <span>✗ Salah</span>
                  <span>{TOTAL - finalStat.correct}</span>
                </div>
                <div className="qz-result-row">
                  <span>⏱️ Waktu</span>
                  <span>{fmt(finalStat.durationSec)}</span>
                </div>
                <div className="qz-result-row">
                  <span>📊 Status</span>
                  <span>
                    {saveStatus === 'saving' && '⏳ Menyimpan...'}
                    {saveStatus === 'saved' && '✅ Tersimpan'}
                    {saveStatus === 'notbest' && `📌 Skor terbaik: ${finalStat.score}`}
                  </span>
                </div>
              </div>

              {!qrisError && (
                <div className="qz-qris-card">
                  <h4>☕ Dukung Quiz Ini</h4>
                  <p>Kalau bermanfaat, boleh traktir lewat QRIS. Berapa pun sangat berarti 🙏</p>
                  <img
                    src={QRIS_IMAGE}
                    alt="QRIS donasi"
                    className="qz-qris-img"
                    onClick={() => setQrisLarge(true)}
                    onError={() => setQrisError(true)}
                  />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                <button
                  className="qz-btn qz-btn-secondary"
                  onClick={() => {
                    setShowResult(false);
                    setTab('ranking');
                  }}
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

        {qrisLarge &&
          createPortal(
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

  return null;
}
