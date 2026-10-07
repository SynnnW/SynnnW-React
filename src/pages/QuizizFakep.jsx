// src/pages/QuizizFakep.jsx
// FITUR: 2 MODE BERBEDA - BELAJAR (200) vs LATSOL (50 SOAL, TIMER 60 MENIT)
// STYLING: AESTHETIC + MODERN + READABLE ✨

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
  onSnapshot, query, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';
import { questions } from '../data/quizQuestions';
import { questions50 } from '../data/quizQuestions50';
import './firebase';

// ==================== KONSTANTA ====================
const QUIZ_TITLE      = 'IBD HOTS';
const MAX_SCORE_200   = 2000;
const MAX_SCORE_50    = 500;
const PINNED_TOP      = { name: 'Ns Leo', score_200: 2000, score_50: 500 };
const QRIS_IMAGE      = '/assets/img/qris.jpg';
const LS_KEY          = 'qz_progress_v4';
const OPTION_LABELS   = ['A', 'B', 'C', 'D', 'E'];

const quizApp  = getApps().find(a => a.name === 'quiz') || initializeApp(getApp().options, 'quiz');
const quizAuth = getAuth(quizApp);
const quizDb   = getFirestore(quizApp);

const formatDur = (sec) => sec == null || sec < 0 ? '--' : `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
const calcScore = (correct, total, max) => Math.round((correct/total)*max);
const isNsLeo = (name) => /ns\W*leo/i.test(name);

// ✨ AESTHETIC CSS - IMPROVED SPACING, TYPOGRAPHY, COLORS
const CSS = `
.qz-root { 
  --qz-bg:#0a0a0e; 
  --qz-surface:rgba(255,255,255,.05); 
  --qz-surface-hover:rgba(255,255,255,.08);
  --qz-border:rgba(255,255,255,.1); 
  --qz-text:#f5f5f7; 
  --qz-text-strong:#ffffff; 
  --qz-text-secondary:#b3b3b8;
  --qz-muted:#8d8d99; 
  --qz-primary:#8b7bff; 
  --qz-primary2:#5eead4; 
  --qz-primary-hover:#9d8dff;
  --qz-success:#34d399; 
  --qz-danger:#fb7185; 
  --qz-warning:#fbbf24;
  --qz-radius:16px;
  
  font-family:'Inter','Segoe UI',system-ui,sans-serif;
  background:var(--qz-bg);
  color:var(--qz-text);
  min-height:100dvh;
  position:relative;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}

.qz-root *, .qz-root *::before, .qz-root *::after { box-sizing:border-box; }

.qz-root::before, .qz-root::after { 
  content:''; position:fixed; z-index:0; pointer-events:none; 
  width:500px; height:500px; border-radius:50%; filter:blur(120px); 
}
.qz-root::before { background:var(--qz-primary); top:-150px; left:-120px; opacity:.12; }
.qz-root::after { background:var(--qz-primary2); bottom:-180px; right:-120px; opacity:.08; }

.qz-wrap { 
  max-width:640px; margin:0 auto; padding:0 20px 120px; position:relative; z-index:1; 
}

/* ═══ HEADER ═══ */
.qz-header { 
  display:flex; align-items:center; gap:14px; 
  padding:20px 0 16px; border-bottom:1px solid var(--qz-border); 
  margin-bottom:24px; position:sticky; top:0; background:var(--qz-bg); z-index:20; 
}
.qz-header-title { 
  flex:1; font-size:1.05rem; font-weight:700; letter-spacing:.5px; 
}
.qz-back-btn { 
  background:none; border:1.5px solid var(--qz-border); 
  color:var(--qz-text-secondary); border-radius:11px; 
  padding:9px 16px; font-size:.9rem; font-weight:600; cursor:pointer; 
  transition:all .25s ease; 
}
.qz-back-btn:hover { 
  color:var(--qz-text); border-color:var(--qz-primary); background:var(--qz-surface-hover);
}

/* ═══ TABS ═══ */
.qz-tabs { 
  display:flex; gap:8px; 
  background:var(--qz-surface); border:1px solid var(--qz-border); 
  border-radius:var(--qz-radius); padding:8px; margin-bottom:28px; 
}
.qz-tab { 
  flex:1; padding:12px 8px; background:none; border:none; border-radius:12px; 
  cursor:pointer; font:600 .95rem 'Inter',system-ui; 
  color:var(--qz-text-secondary); transition:all .25s ease; 
}
.qz-tab:hover { color:var(--qz-text); background:var(--qz-surface-hover); }
.qz-tab.qz-active { 
  color:#fff; 
  background:linear-gradient(135deg,rgba(139,123,255,.2),rgba(94,234,212,.1)); 
  box-shadow:0 0 0 1px rgba(139,123,255,.4), inset 0 1px 2px rgba(255,255,255,.05);
}

/* ═══ CARD ═══ */
.qz-card { 
  background:var(--qz-surface); border:1px solid var(--qz-border); 
  border-radius:var(--qz-radius); backdrop-filter:blur(20px); 
  box-shadow:0 25px 60px rgba(0,0,0,.3); 
  padding:24px;
}

/* ═══ BADGE ═══ */
.qz-badge { 
  display:inline-block; font-size:.75rem; letter-spacing:.25em; 
  color:var(--qz-primary2); border:1px solid var(--qz-border); 
  background:rgba(94,234,212,.05); 
  padding:8px 16px; border-radius:999px; margin-bottom:18px; font-weight:600;
  text-transform:uppercase;
}

/* ═══ HEADINGS ═══ */
.qz-h1 { 
  font-size:clamp(1.8rem,6vw,2.8rem); font-weight:800; line-height:1.15; 
  background:linear-gradient(120deg,#fff 25%,var(--qz-primary) 65%,var(--qz-primary2) 100%); 
  -webkit-background-clip:text; background-clip:text; color:transparent; 
  margin-bottom:12px;
}
.qz-h2 { 
  font-size:1.6rem; font-weight:700; color:var(--qz-text); 
  margin-bottom:16px; letter-spacing:-.3px;
}
.qz-h3 { 
  font-size:1.1rem; font-weight:700; color:var(--qz-text); margin-bottom:12px;
}

/* ═══ TEXT UTILITY ═══ */
.qz-muted { 
  color:var(--qz-text-secondary); line-height:1.7; font-size:.97rem;
}
.qz-subtitle {
  color:var(--qz-muted); font-size:.95rem; line-height:1.6;
}

/* ═══ BUTTON ═══ */
.qz-btn { 
  display:block; width:100%; min-height:52px; padding:14px 18px; 
  border:none; border-radius:13px; cursor:pointer; 
  font:600 .95rem 'Inter',system-ui; transition:all .25s ease; 
  color:#fff; text-align:center; font-weight:700; letter-spacing:.3px;
}
.qz-btn:disabled { opacity:.4; cursor:not-allowed; }
.qz-btn-primary { 
  background:linear-gradient(135deg,#8b7bff,#6d5df0); 
  box-shadow:0 12px 30px rgba(139,123,255,.35); 
}
.qz-btn-primary:not(:disabled):hover { 
  transform:translateY(-3px); box-shadow:0 16px 40px rgba(139,123,255,.5); 
  background:linear-gradient(135deg,#9d8dff,#7d6dff);
}
.qz-btn-secondary { 
  background:var(--qz-surface); border:1.5px solid var(--qz-border); 
  color:var(--qz-text); 
}
.qz-btn-secondary:not(:disabled):hover { 
  background:var(--qz-surface-hover); border-color:var(--qz-primary); 
  transform:translateY(-2px);
}
.qz-btn-success { 
  background:linear-gradient(135deg,#10b981,#34d399); 
  color:#000; box-shadow:0 12px 30px rgba(52,211,153,.3); 
}
.qz-btn-success:not(:disabled):hover { 
  transform:translateY(-3px); box-shadow:0 16px 40px rgba(52,211,153,.45);
}

/* ═══ MODE TABS & CARDS ═══ */
.qz-mode-tabs { 
  display:flex; gap:8px; margin-bottom:20px; 
}
.qz-mode-tab { 
  flex:1; padding:12px 10px; background:var(--qz-surface); 
  border:1.5px solid var(--qz-border); border-radius:12px; 
  cursor:pointer; font-size:.93rem; color:var(--qz-text-secondary); 
  transition:all .25s ease; text-align:center; font-weight:700;
}
.qz-mode-tab:hover { border-color:var(--qz-primary); background:var(--qz-surface-hover); }
.qz-mode-tab.qz-active-tab { 
  background:rgba(139,123,255,.12); border-color:var(--qz-primary); 
  color:var(--qz-primary2); box-shadow:0 0 0 2px rgba(139,123,255,.1);
}
.qz-mode-card { 
  padding:18px 20px; background:var(--qz-surface); 
  border:1.5px solid var(--qz-border); border-radius:13px; 
  cursor:pointer; transition:all .25s ease; text-align:left; margin-bottom:12px;
}
.qz-mode-card:hover { 
  border-color:var(--qz-primary); background:var(--qz-surface-hover); 
  transform:translateY(-2px);
}
.qz-mode-card.qz-selected { 
  border-color:var(--qz-primary); background:rgba(139,123,255,.08); 
  box-shadow:0 0 0 2px rgba(139,123,255,.15);
}
.qz-mode-card h4 { 
  font-size:1rem; color:var(--qz-text); margin-bottom:5px; font-weight:700;
}
.qz-mode-card p { 
  color:var(--qz-text-secondary); font-size:.9rem; line-height:1.6;
}

/* ═══ INPUT & AUTH ═══ */
.qz-input { 
  width:100%; padding:13px 16px; background:rgba(0,0,0,.4); 
  color:var(--qz-text); border:1.5px solid var(--qz-border); 
  border-radius:12px; font:1rem 'Inter',system-ui; 
  transition:all .25s ease; margin-bottom:12px; 
}
.qz-input::placeholder { color:var(--qz-muted); }
.qz-input:focus { 
  outline:none; border-color:var(--qz-primary); 
  box-shadow:0 0 0 3px rgba(139,123,255,.15); 
  background:rgba(0,0,0,.5);
}

/* ═══ USER INFO ═══ */
.qz-user-info { 
  display:flex; align-items:center; gap:12px; 
  padding:14px 16px; background:rgba(139,123,255,.06); 
  border:1px solid rgba(139,123,255,.25); border-radius:12px; 
  margin-bottom:14px;
}
.qz-avatar { 
  width:38px; height:38px; border-radius:50%; overflow:hidden; 
  background:linear-gradient(135deg,var(--qz-primary),var(--qz-primary2)); 
  display:flex; align-items:center; justify-content:center; 
  font-weight:700; font-size:.9rem; color:#fff; flex-shrink:0;
}
.qz-avatar img { width:100%; height:100%; object-fit:cover; }
.qz-user-name { 
  flex:1; font-size:.95rem; color:var(--qz-text); font-weight:600;
}

/* ═══ QUIZ DISPLAY ═══ */
.qz-sticky-bar { 
  position:sticky; top:70px; z-index:15; 
  display:flex; gap:8px; background:rgba(10,10,14,.95); 
  backdrop-filter:blur(15px); padding:12px 0; 
  margin-bottom:16px; border-bottom:1px solid var(--qz-border);
}
.qz-stat-pill { 
  flex:1; text-align:center; padding:10px 6px; 
  background:var(--qz-surface); border:1px solid var(--qz-border); 
  border-radius:11px; font-size:.75rem; color:var(--qz-text-secondary); font-weight:700;
}
.qz-stat-pill span { 
  display:block; font-size:1.15rem; font-weight:700; 
  font-variant-numeric:tabular-nums; line-height:1.2; margin-top:4px;
}
.qz-stat-pill.qz-spTimer span { color:var(--qz-primary2); }
.qz-stat-pill.qz-spOk span { color:var(--qz-success); }
.qz-stat-pill.qz-spWrong span { color:var(--qz-danger); }
.qz-stat-pill.qz-spScore span { 
  background:linear-gradient(120deg,var(--qz-primary),var(--qz-primary2)); 
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.qz-stat-pill.qz-spDanger span { 
  color:var(--qz-danger); animation:qzPulse .8s ease-in-out infinite;
}

/* ═══ PROGRESS ═══ */
.qz-prog-bar { 
  background:rgba(255,255,255,.06); height:6px; 
  border-radius:999px; margin-bottom:14px; overflow:hidden; 
}
.qz-prog-fill { 
  height:100%; background:linear-gradient(90deg,var(--qz-primary),var(--qz-primary2)); 
  border-radius:999px; transition:width .4s cubic-bezier(.34,.1,.68,1); 
  box-shadow:0 0 12px rgba(139,123,255,.6);
}
.qz-q-counter { 
  text-align:right; color:var(--qz-text-secondary); 
  font-size:.88rem; margin-bottom:14px; font-weight:600; font-variant-numeric:tabular-nums;
}

/* ═══ QUESTION & OPTIONS ═══ */
.qz-q-text { 
  background:var(--qz-surface); padding:20px 22px; border-radius:13px; 
  margin-bottom:20px; border:1.5px solid var(--qz-border); 
  border-left:4px solid var(--qz-primary); 
  font-weight:550; line-height:1.75; font-size:.98rem; 
  color:var(--qz-text-strong);
}
.qz-options { 
  display:flex; flex-direction:column; gap:10px; margin-bottom:18px;
}
.qz-option { 
  display:flex; align-items:flex-start; gap:13px; 
  padding:16px 17px; background:var(--qz-surface); 
  border:1.5px solid var(--qz-border); border-radius:13px; 
  cursor:pointer; transition:all .2s ease; 
  line-height:1.6; font-size:.93rem; text-align:left; 
  width:100%; color:var(--qz-text); min-height:55px;
}
.qz-option:not(.qz-locked):hover { 
  border-color:rgba(139,123,255,.5); background:var(--qz-surface-hover); 
  transform:translateX(4px);
}
.qz-option.qz-locked { cursor:default; }
.qz-option-lbl { 
  font-weight:800; color:var(--qz-primary); 
  flex-shrink:0; font-size:.85rem; min-width:20px; margin-top:2px;
}
.qz-option.qz-sel { 
  border-color:var(--qz-primary); 
  background:rgba(139,123,255,.12); 
  box-shadow:0 0 0 2.5px rgba(139,123,255,.12);
}
.qz-option.qz-sel .qz-option-lbl { color:var(--qz-primary2); }
.qz-option.qz-correct { 
  border-color:var(--qz-success); background:rgba(52,211,153,.1);
}
.qz-option.qz-correct .qz-option-lbl { color:var(--qz-success); font-weight:800; }
.qz-option.qz-incorrect { 
  border-color:var(--qz-danger); background:rgba(251,113,133,.1);
}
.qz-option.qz-incorrect .qz-option-lbl { color:var(--qz-danger); font-weight:800; }

/* ═══ FEEDBACK ═══ */
.qz-feedback { 
  margin-top:18px; padding:16px 18px; border-radius:13px; 
  border:1.5px solid var(--qz-border); animation:qzFadeUp .3s ease;
}
.qz-fb-ok { 
  background:rgba(52,211,153,.08); border-color:rgba(52,211,153,.4);
}
.qz-fb-err { 
  background:rgba(251,113,133,.09); border-color:rgba(251,113,133,.4);
}
.qz-feedback h4 { 
  font-size:1.05rem; margin-bottom:6px; color:var(--qz-text-strong); font-weight:700;
}
.qz-fb-ok h4 { color:var(--qz-success); }
.qz-fb-err h4 { color:var(--qz-danger); }
.qz-feedback p { 
  color:var(--qz-text-secondary); font-size:.89rem; 
  line-height:1.7; margin-top:5px;
}
.qz-feedback strong { color:var(--qz-text); font-weight:700; }

/* ═══ NAV BUTTONS ═══ */
.qz-nav-btns { 
  display:flex; gap:11px; margin-top:20px; margin-bottom:20px;
}
.qz-nav-btns .qz-btn { flex:1; }

/* ═══ LEADERBOARD ═══ */
.qz-lb-row { 
  display:flex; align-items:center; gap:11px; 
  padding:14px 14px; border-bottom:1px solid var(--qz-border); 
  transition:background .2s ease;
}
.qz-lb-row:hover { background:var(--qz-surface-hover); }
.qz-lb-row:last-child { border-bottom:none; }
.qz-lb-name { 
  font-size:.9rem; font-weight:700; color:var(--qz-text);
}
.qz-lb-meta {
  font-size:.8rem; color:var(--qz-text-secondary); margin-top:2px;
}
.qz-lb-score { 
  font-weight:800; font-size:1.05rem; 
  background:linear-gradient(120deg,var(--qz-primary),var(--qz-primary2)); 
  -webkit-background-clip:text; background-clip:text; color:transparent;
}

/* ═══ ALERTS & EMPTY ═══ */
.qz-alert { 
  padding:13px 16px; border-radius:12px; font-size:.89rem; 
  margin-bottom:14px; animation:qzFadeUp .25s ease; line-height:1.6; border:1.5px solid;
}
.qz-alert-err { 
  background:rgba(251,113,133,.08); border-color:rgba(251,113,133,.35); 
  color:var(--qz-danger); font-weight:600;
}
.qz-empty { 
  text-align:center; padding:40px 20px; 
  color:var(--qz-text-secondary); font-size:.93rem;
}

/* ═══ BOTTOM SHEET ═══ */
.qz-bs-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:8000; }
.qz-bs-box { 
  position:fixed; bottom:0; left:50%; transform:translateX(-50%); 
  width:100%; max-width:560px; background:#0a0a0e; 
  border:1px solid var(--qz-border); border-radius:20px 20px 0 0; 
  padding:20px 18px 36px; z-index:8001; max-height:70dvh; 
  overflow-y:auto; animation:qzSlideUp .3s ease;
}
.qz-bs-handle {
  width:48px; height:4px; background:var(--qz-border); 
  border-radius:2px; margin:0 auto 16px;
}
.qz-nav-grid { 
  display:grid; grid-template-columns:repeat(auto-fill,minmax(44px,1fr)); 
  gap:8px;
}
.qz-nav-cell { 
  aspect-ratio:1; display:flex; align-items:center; justify-content:center; 
  border-radius:10px; border:1.5px solid var(--qz-border); 
  background:var(--qz-surface); font-weight:800; font-size:.85rem; 
  cursor:pointer; transition:all .2s ease; color:var(--qz-text-secondary);
}
.qz-nav-cell:hover { border-color:var(--qz-primary); color:var(--qz-text); }
.qz-nav-cell.qz-nc-ok { 
  background:rgba(52,211,153,.15); border-color:var(--qz-success); 
  color:var(--qz-success); font-weight:800;
}
.qz-nav-cell.qz-nc-err { 
  background:rgba(251,113,133,.15); border-color:var(--qz-danger); 
  color:var(--qz-danger); font-weight:800;
}
.qz-nav-cell.qz-nc-active { 
  border-color:var(--qz-primary); background:rgba(139,123,255,.18); 
  color:#fff; box-shadow:0 0 0 3px rgba(139,123,255,.2);
}

/* ═══ MODAL ═══ */
.qz-modal-overlay { 
  position:fixed; inset:0; background:rgba(4,4,6,.85); 
  backdrop-filter:blur(12px); display:flex; align-items:flex-end; 
  justify-content:center; z-index:9000;
}
.qz-modal-box { 
  background:#0a0a0e; border:1px solid var(--qz-border); 
  border-radius:24px 24px 0 0; padding:32px 24px 44px; 
  width:100%; max-width:560px; max-height:92dvh; overflow-y:auto; 
  text-align:center; box-shadow:0 0 80px rgba(139,123,255,.2); 
  animation:qzSlideUp .35s cubic-bezier(.34,.1,.68,1);
}
.qz-result-score { 
  font-size:3.5rem; font-weight:800; 
  background:linear-gradient(120deg,var(--qz-primary),var(--qz-primary2)); 
  -webkit-background-clip:text; background-clip:text; color:transparent; 
  line-height:1; margin:8px 0 4px;
}
.qz-result-details { 
  background:var(--qz-surface); border:1px solid var(--qz-border); 
  border-radius:13px; padding:14px 18px; margin:20px 0; text-align:left;
}
.qz-result-row { 
  display:flex; justify-content:space-between; padding:7px 0; 
  color:var(--qz-text-secondary); font-size:.9rem; 
  border-bottom:1px solid rgba(255,255,255,.05);
}
.qz-result-row:last-child { border-bottom:none; }
.qz-result-row span:last-child { font-weight:700; color:var(--qz-text); }

/* ═══ FLOATING BUTTON ═══ */
.qz-nav-toggle { 
  position:fixed; bottom:28px; right:28px; z-index:30; 
  background:linear-gradient(135deg,var(--qz-primary),#6d5df0); 
  color:#fff; border:none; border-radius:14px; 
  padding:13px 19px; font:700 .88rem 'Inter',system-ui; 
  cursor:pointer; box-shadow:0 12px 30px rgba(139,123,255,.4); 
  transition:all .25s ease; letter-spacing:.3px;
}
.qz-nav-toggle:hover { 
  transform:translateY(-4px); box-shadow:0 16px 40px rgba(139,123,255,.5);
}

/* ═══ ANIMATIONS ═══ */
@keyframes qzFadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
@keyframes qzSlideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:none; } }
@keyframes qzPulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
`;

export default function QuizizFakep() {
  const navigate = useNavigate();

  const [quizMode, setQuizMode] = useState('belajar');
  const [tab, setTab] = useState('mulai');
  const [quizUser, setQuizUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [nickname, setNickname] = useState('');
  const [authAlert, setAuthAlert] = useState('');
  const [authErrType, setAuthErrType] = useState('');
  const [checkingResume, setCheckingResume] = useState(true);
  const [savedProgress, setSavedProgress] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checkedSet, setCheckedSet] = useState(new Set());
  const [mode, setMode] = useState('unlimited');
  const [startTime, setStartTime] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalStat, setFinalStat] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [lbTab, setLbTab] = useState('200');
  const [lb200, setLb200] = useState([]);
  const [lb50, setLb50] = useState([]);
  const [lbLoading, setLbLoading] = useState(true);
  const timerRef = useRef(null);
  const finishQuizRef = useRef(null);
  const lbUnsubRef = useRef(null);

  const isLatsol = quizMode === 'latsol';
  const QUESTIONS = isLatsol ? questions50 : questions;
  const TOTAL = QUESTIONS.length;
  const MAX_SCORE = isLatsol ? MAX_SCORE_50 : MAX_SCORE_200;

  useEffect(() => {
    const stored = localStorage.getItem('qz_nickname');
    if (stored) setDisplayName(stored);
    const unsubAuth = onAuthStateChanged(quizAuth, (user) => {
      if (user) setQuizUser(user);
      setCheckingResume(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!quizStarted || !startTime || !deadline) return;
    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((deadline - now) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) finishQuizRef.current?.(true);
    };
    const interval = setInterval(tick, 100);
    tick();
    return () => clearInterval(interval);
  }, [quizStarted, startTime, deadline]);

  useEffect(() => {
    if (tab !== 'ranking') return;
    setLbLoading(true);
    const collName = lbTab === '200' ? 'quiz_leaderboard_200' : 'quiz_leaderboard_50';
    const q = query(collection(quizDb, collName), orderBy('score', 'desc'), limit(50));
    lbUnsubRef.current?.();
    lbUnsubRef.current = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.score - a.score || a.durationSec - b.durationSec);
        if (lbTab === '200') setLb200(rows);
        else setLb50(rows);
        setLbLoading(false);
      },
      () => setLbLoading(false)
    );
    return () => { lbUnsubRef.current?.(); lbUnsubRef.current = null; };
  }, [tab, lbTab]);

  const handleGoogleLogin = async () => {
    setAuthAlert('');
    try {
      await signInWithPopup(quizAuth, new GoogleAuthProvider());
    } catch (err) {
      setAuthAlert(err.message);
      setAuthErrType('err');
    }
  };

  const handleAnonLogin = async () => {
    setAuthAlert('');
    const name = nickname.trim();
    if (name.length < 2 || name.length > 24) {
      setAuthAlert('Nickname 2–24 karakter');
      setAuthErrType('err');
      return;
    }
    if (isNsLeo(name)) {
      setAuthAlert('"Ns Leo" dicadangkan');
      setAuthErrType('err');
      return;
    }
    try {
      await signInAnonymously(quizAuth);
      localStorage.setItem('qz_nickname', name);
      setDisplayName(name);
    } catch (err) {
      setAuthAlert(err.message);
      setAuthErrType('err');
    }
  };

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
      setAnswers({});
      setCheckedSet(new Set());
      setCurrentQ(0);
      setStartTime(now);
      setDeadline(isLatsol ? now + 60 * 60 * 1000 : null);
    }
    setQuizStarted(true);
    setShowResult(false);
    setTab('quiz');
  };

  const finishQuiz = useCallback(
    (timeUp) => {
      clearInterval(timerRef.current);
      const durationSec = Math.round((Date.now() - (startTime || Date.now())) / 1000);
      const finalCorrect = Object.entries(answers).filter(
        ([idx, sel]) => checkedSet.has(Number(idx)) && sel === QUESTIONS[Number(idx)].correct
      ).length;
      const score = calcScore(finalCorrect, TOTAL, MAX_SCORE);
      const stat = { correct: finalCorrect, total: TOTAL, score, durationSec, mode: isLatsol ? 'hard' : mode, quizMode };
      setFinalStat(stat);
      setShowResult(true);
      setQuizStarted(false);
      localStorage.removeItem(LS_KEY);
      setSavedProgress(null);
      saveToLeaderboard(stat);
    },
    [answers, checkedSet, QUESTIONS, TOTAL, MAX_SCORE, mode, isLatsol, quizMode, startTime]
  );

  useEffect(() => {
    finishQuizRef.current = finishQuiz;
  }, [finishQuiz]);

  const saveToLeaderboard = async (stat) => {
    if (!quizUser) return;
    setSaveStatus('saving');
    const name = displayName.slice(0, 24);
    if (isNsLeo(name)) {
      setSaveStatus('');
      return;
    }
    try {
      const collName = stat.quizMode === 'latsol' ? 'quiz_leaderboard_50' : 'quiz_leaderboard_200';
      const ref = doc(quizDb, collName, quizUser.uid);
      const existing = await getDoc(ref);
      const shouldWrite = !existing.exists() || stat.score > existing.data().score || (stat.score === existing.data().score && stat.durationSec < existing.data().durationSec);
      if (!shouldWrite) {
        setSaveStatus('notbest');
        return;
      }
      const payload = {
        uid: quizUser.uid,
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
      await setDoc(ref, payload);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('');
    }
  };

  const selectAnswer = (optIdx) => {
    if ([...checkedSet].includes(currentQ)) return;
    setAnswers(prev => ({ ...prev, [currentQ]: optIdx }));
  };
  const checkAnswer = () => {
    if (answers[currentQ] === undefined) return;
    setCheckedSet(prev => new Set([...prev, currentQ]));
  };
  const goToQ = (idx) => {
    setCurrentQ(idx);
    setShowNav(false);
  };
  const goNext = () => {
    if (currentQ < TOTAL - 1) goToQ(currentQ + 1);
    else finishQuizRef.current?.(false);
  };
  const goPrev = () => {
    if (currentQ > 0) goToQ(currentQ - 1);
  };
  const handleBackBtn = () => {
    if (quizStarted) {
      const ok = window.confirm('Keluar? Progres tersimpan.');
      if (!ok) return;
    }
    navigate('/');
  };
  const handleSignOut = async () => {
    await signOut(quizAuth);
    setDisplayName('');
    setNickname('');
  };
  const restartQuiz = () => {
    setShowResult(false);
    setFinalStat(null);
    setSaveStatus('');
    startQuiz(null);
  };
  const backToMenu = () => {
    setShowResult(false);
    setFinalStat(null);
    setSaveStatus('');
    setQuizStarted(false);
    setTab('mulai');
  };

  const q = QUESTIONS[currentQ];
  const isAnswered = answers[currentQ] !== undefined;
  const isCurrentChecked = checkedSet.has(currentQ);
  const isCorrectAns = isCurrentChecked && answers[currentQ] === q.correct;
  const getOptClass = (i) => {
    let cls = 'qz-option';
    if (isCurrentChecked) {
      if (i === q.correct) cls += ' qz-correct';
      else if (i === answers[currentQ]) cls += ' qz-incorrect';
    }
    if (answers[currentQ] === i) cls += ' qz-sel';
    if (isCurrentChecked) cls += ' qz-locked';
    return cls;
  };

  const correctCount = Object.entries(answers).filter(([idx, sel]) => checkedSet.has(Number(idx)) && sel === QUESTIONS[Number(idx)].correct).length;
  const wrongCount = [...checkedSet].length - correctCount;
  const currentScore = calcScore(correctCount, TOTAL, MAX_SCORE);
  const timerClass = timeLeft && timeLeft < 300 ? (timeLeft < 60 ? 'qz-spDanger' : 'qz-spTimer') : 'qz-spTimer';

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
          {[['mulai', '🏠 Mulai'], ['quiz', '📝 Quiz'], ['ranking', '🏆 Ranking']].map(([id, lbl]) => (
            <button key={id} className={`qz-tab${tab === id ? ' qz-active' : ''}`} onClick={() => setTab(id)}>{lbl}</button>
          ))}
        </div>

        {/* TAB: MULAI */}
        {tab === 'mulai' && (
          <div style={{ animation: 'qzFadeUp .4s ease' }}>
            <div style={{ marginBottom: 24 }}>
              <div className="qz-badge">CBT · KEPERAWATAN</div>
              <h1 className="qz-h1">{QUIZ_TITLE}</h1>
              <p className="qz-muted">{isLatsol ? '50 soal · 60 menit LATSOL' : '200 soal · Unlimited'}</p>
            </div>

            <div className="qz-mode-tabs">
              <button
                className={`qz-mode-tab${quizMode === 'belajar' ? ' qz-active-tab' : ''}`}
                onClick={() => {
                  setQuizMode('belajar');
                  setMode('unlimited');
                  localStorage.removeItem(LS_KEY);
                }}
              >
                📚 BELAJAR (200)
              </button>
              <button
                className={`qz-mode-tab${quizMode === 'latsol' ? ' qz-active-tab' : ''}`}
                onClick={() => {
                  setQuizMode('latsol');
                  localStorage.removeItem(LS_KEY);
                }}
              >
                📋 LATSOL (50) ⏱️
              </button>
            </div>

            {!checkingResume && savedProgress && !quizStarted && savedProgress.quizMode === quizMode && (
              <div style={{ background: 'rgba(139,123,255,.08)', border: '1.5px solid rgba(139,123,255,.3)', borderRadius: 'var(--qz-radius)', padding: '18px', marginBottom: '18px' }}>
                <h4 style={{ color: 'var(--qz-primary)', marginBottom: '8px', fontSize: '1.05rem', fontWeight: 700 }}>📂 Lanjutkan?</h4>
                <p style={{ color: 'var(--qz-text-secondary)', fontSize: '.91rem', marginBottom: '14px', lineHeight: 1.6 }}>Soal {(savedProgress.currentQ || 0) + 1}/{isLatsol ? 50 : 200}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="qz-btn qz-btn-primary" style={{ flex: 1 }} onClick={() => { setSavedProgress(null); startQuiz(savedProgress); }}>▶ Lanjutkan</button>
                  <button className="qz-btn qz-btn-secondary" style={{ flex: 1 }} onClick={() => { localStorage.removeItem(LS_KEY); setSavedProgress(null); }}>Mulai Ulang</button>
                </div>
              </div>
            )}

            {!isLatsol && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {[['unlimited', '🟢 Unlimited', 'Belajar santai tanpa timer'], ['hard', '🔴 Hard (60min)', 'Timer 60 menit simulasi ujian']].map(([id, title, desc]) => (
                  <div key={id} className={`qz-mode-card${mode === id ? ' qz-selected' : ''}`} onClick={() => setMode(id)}>
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
            )}

            {!quizUser ? (
              <div className="qz-card" style={{ marginBottom: '20px', padding: '20px' }}>
                <h3 className="qz-h3" style={{ marginBottom: '14px' }}>Login untuk Leaderboard</h3>
                {authAlert && <div className={`qz-alert qz-alert-${authErrType}`} style={{ marginBottom: '12px' }}>{authAlert}</div>}
                <button className="qz-btn qz-btn-primary" style={{ marginBottom: '10px' }} onClick={handleGoogleLogin}>🔐 Google Login</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0', color: 'var(--qz-text-secondary)', fontSize: '.88rem' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--qz-border)' }} />
                  atau
                  <div style={{ flex: 1, height: '1px', background: 'var(--qz-border)' }} />
                </div>
                <input
                  type="text"
                  className="qz-input"
                  placeholder="Nama / Nickname (2-24 karakter)"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={24}
                />
                <button className="qz-btn qz-btn-secondary" onClick={handleAnonLogin}>👤 Anonim</button>
              </div>
            ) : (
              <div className="qz-user-info">
                <div className="qz-avatar">{quizUser.photoURL ? <img src={quizUser.photoURL} alt={displayName} /> : displayName.slice(0, 2).toUpperCase()}</div>
                <div className="qz-user-name">{displayName || quizUser.email || 'User'}</div>
                <button style={{ background: 'none', border: 'none', color: 'var(--qz-muted)', cursor: 'pointer', fontSize: '.85rem', fontWeight: 700, padding: '4px 8px' }} onClick={handleSignOut}>Logout</button>
              </div>
            )}

            <button className="qz-btn qz-btn-primary" style={{ minHeight: '56px', fontSize: '1rem' }} onClick={() => startQuiz(null)} disabled={!quizUser}>🚀 Mulai Quiz</button>
          </div>
        )}

        {/* TAB: QUIZ */}
        {tab === 'quiz' && quizStarted && (
          <div>
            <div className="qz-sticky-bar">
              {(isLatsol || mode === 'hard') && <div className={`qz-stat-pill ${timerClass}`}><span>{formatDur(timeLeft)}</span>⏱️</div>}
              <div className="qz-stat-pill qz-spOk"><span>{correctCount}</span>✅</div>
              <div className="qz-stat-pill qz-spWrong"><span>{wrongCount}</span>❌</div>
              <div className="qz-stat-pill qz-spScore"><span>{currentScore}</span>⭐</div>
            </div>

            <div className="qz-prog-bar"><div className="qz-prog-fill" style={{ width: `${((currentQ + 1) / TOTAL) * 100}%` }} /></div>
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
                {!isCorrectAns && <p>Jawaban: <strong>{OPTION_LABELS[q.correct]}. {q.options[q.correct]}</strong></p>}
                <p style={{ marginTop: 8 }}>{q.explanation}</p>
              </div>
            )}

            <div className="qz-nav-btns">
              <button className="qz-btn qz-btn-secondary" onClick={goPrev} disabled={currentQ === 0}>← Kembali</button>
              {!isCurrentChecked ? (
                <button className="qz-btn qz-btn-primary" onClick={checkAnswer} disabled={!isAnswered}>Periksa</button>
              ) : (
                <button className="qz-btn qz-btn-success" onClick={goNext}>{currentQ < TOTAL - 1 ? 'Lanjut →' : '🏁 Selesai'}</button>
              )}
            </div>

            <button className="qz-nav-toggle" onClick={() => setShowNav(true)}>📋 {[...checkedSet].length}/{TOTAL}</button>
          </div>
        )}

        {/* TAB: RANKING */}
        {tab === 'ranking' && (
          <div style={{ animation: 'qzFadeUp .4s ease' }}>
            <h2 className="qz-h2">🏆 Leaderboard</h2>

            <div className="qz-mode-tabs">
              <button className={`qz-mode-tab${lbTab === '200' ? ' qz-active-tab' : ''}`} onClick={() => setLbTab('200')}>📚 BELAJAR</button>
              <button className={`qz-mode-tab${lbTab === '50' ? ' qz-active-tab' : ''}`} onClick={() => setLbTab('50')}>📋 LATSOL</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div className="qz-card" style={{ padding: '16px', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--qz-muted)', fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>PESERTA</h4>
                <div style={{ fontSize: '1.9rem', fontWeight: '800', background: 'linear-gradient(120deg,var(--qz-primary),var(--qz-primary2))', backgroundClip: 'text', color: 'transparent' }}>{lbStats.total}</div>
              </div>
              <div className="qz-card" style={{ padding: '16px', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--qz-muted)', fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>RATA-RATA</h4>
                <div style={{ fontSize: '1.9rem', fontWeight: '800', background: 'linear-gradient(120deg,var(--qz-primary),var(--qz-primary2))', backgroundClip: 'text', color: 'transparent' }}>{lbStats.avg || '—'}</div>
              </div>
            </div>

            <div className="qz-card" style={{ padding: '0', overflow: 'hidden' }} data-lenis-prevent>
              <div className="qz-lb-row" style={{ padding: '16px 14px', background: 'linear-gradient(135deg,rgba(253,230,138,.08),rgba(245,158,11,.05))', borderBottom: '2px solid var(--qz-border)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#fde68a,#f59e0b)', color: '#1f1a00', fontWeight: '800', fontSize: '.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👑</div>
                <div className="qz-avatar" style={{ background: 'linear-gradient(135deg,#fde68a,#f59e0b)' }}>NS</div>
                <div style={{ flex: 1 }}>
                  <div className="qz-lb-name">{PINNED_TOP.name}</div>
                  <div className="qz-lb-meta">Skor Sempurna 🎉</div>
                </div>
                <div className="qz-lb-score">{lbTab === '200' ? PINNED_TOP.score_200 : PINNED_TOP.score_50}</div>
              </div>

              {lbLoading && <div className="qz-empty">Memuat leaderboard...</div>}
              {!lbLoading && lbData.length === 0 && <div className="qz-empty">Belum ada peserta. Jadilah yang pertama! 🚀</div>}

              {lbData.map((row, i) => (
                <div key={row.id} className="qz-lb-row">
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--qz-surface)', fontWeight: '800', fontSize: '.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--qz-text-secondary)' }}>{i + 2}</div>
                  <div className="qz-avatar">{row.photoURL ? <img src={row.photoURL} alt={row.name} /> : row.name.slice(0, 2).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div className="qz-lb-name">{row.name}</div>
                    <div className="qz-lb-meta">{formatDur(row.durationSec)} · {row.correct}/{row.total} benar</div>
                  </div>
                  <div className="qz-lb-score">{row.score}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigator */}
      {showNav && createPortal(
        <>
          <div className="qz-bs-overlay" onClick={() => setShowNav(false)} />
          <div className="qz-bs-box" data-lenis-prevent>
            <div className="qz-bs-handle" />
            <h4 style={{ fontFamily: "'Inter',system-ui,sans-serif", color: 'var(--qz-text)', marginBottom: 14, fontSize: '1rem', fontWeight: 700 }}>Navigator Soal — {[...checkedSet].length}/{TOTAL} dijawab</h4>
            <div style={{ display: 'flex', gap: '8px', fontSize: '.8rem', color: 'var(--qz-text-secondary)', marginBottom: '14px', fontWeight: 600 }}>
              <span style={{ color: 'var(--qz-success)' }}>■</span> Benar&nbsp;
              <span style={{ color: 'var(--qz-danger)' }}>■</span> Salah&nbsp;
              <span style={{ color: 'var(--qz-muted)' }}>■</span> Belum
            </div>
            <div className="qz-nav-grid">
              {QUESTIONS.map((_, i) => {
                let cls = 'qz-nav-cell';
                if ([...checkedSet].includes(i)) {
                  if (answers[i] === QUESTIONS[i].correct) cls += ' qz-nc-ok';
                  else cls += ' qz-nc-err';
                }
                if (i === currentQ) cls += ' qz-nc-active';
                return (
                  <button key={i} className={cls} onClick={() => goToQ(i)}>{i + 1}</button>
                );
              })}
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Result Modal */}
      {showResult && finalStat && createPortal(
        <div className="qz-modal-overlay" onClick={() => {}}>
          <div className="qz-modal-box" data-lenis-prevent>
            <div style={{ fontSize: '3rem', marginBottom: 10 }}>
              {finalStat.correct / TOTAL >= 0.8 ? '🎉' : finalStat.correct / TOTAL >= 0.6 ? '💪' : '📖'}
            </div>
            <h2 className="qz-h2" style={{ marginBottom: 6, fontSize: '1.8rem' }}>
              {finalStat.correct / TOTAL >= 0.8 ? 'Luar Biasa!' : finalStat.correct / TOTAL >= 0.6 ? 'Bagus!' : 'Terus Belajar!'}
            </h2>
            <div className="qz-result-score">{finalStat.score}</div>
            <p className="qz-muted" style={{ marginBottom: 18, fontSize: '.95rem' }}>dari {MAX_SCORE} poin maksimal</p>

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
                <span>{formatDur(finalStat.durationSec)}</span>
              </div>
              <div className="qz-result-row">
                <span>Mode</span>
                <span>{finalStat.mode === 'hard' ? '🔴 Hard 60min' : '🟢 Unlimited'}</span>
              </div>
              <div className="qz-result-row">
                <span>Status</span>
                <span>{saveStatus === 'saving' ? '⏳ Menyimpan...' : saveStatus === 'saved' ? '✅ Tersimpan' : saveStatus === 'notbest' ? '📊 Bukan terbaik' : '—'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginTop: '20px' }}>
              <button className="qz-btn qz-btn-secondary" onClick={() => { setShowResult(false); setTab('ranking'); }}>🏆 Lihat Ranking</button>
              <button className="qz-btn qz-btn-primary" onClick={restartQuiz}>🔄 Coba Lagi</button>
              <button className="qz-btn qz-btn-secondary" onClick={backToMenu}>🏠 Kembali ke Menu</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
