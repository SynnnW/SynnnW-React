// src/pages/QuizizFakep.jsx
// ─────────────────────────────────────────────────────────────
// Quiz CBT Keperawatan
// Mata Pelajaran: Kesehatan Global · Falsafah & Teori Keperawatan
// Auth: Google (persistent Firebase) + Anonim (cache localStorage)
// Leaderboard: Firestore per mapel per tipe soal
// Admin: aldokraksaan@gmail.com — reset ranking kapan saja
// Dibuat dengan bantuan AI: ChatGPT · Claude AI CLI · Gemini CLI 🤖
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  signInAnonymously, onAuthStateChanged, signOut,
  setPersistence, browserLocalPersistence,
} from 'firebase/auth';
import {
  getFirestore, collection, doc, getDoc, setDoc,
  onSnapshot, query, orderBy, limit, serverTimestamp,
  getDocs, writeBatch,
} from 'firebase/firestore';
import { questions as allQ100 } from '../data/100soal';
import { questions as allQ50 } from '../data/50soal';
import './firebase'; // pastikan default Firebase app sudah init

/* ════════════════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════════════════ */
const ADMIN_EMAIL       = 'aldokraksaan@gmail.com';
const MAX_SCORE         = 2000;
const HARD_MODE_MINUTES = 100;
const PINNED_TOP        = { name: 'Ns Leo', score: 2000 };
const QRIS_IMAGE        = '/assets/img/qris.jpg';
const TRAKTEER_URL      = 'https://trakteer.id/aldokraksaan'; // sesuaikan URL trakteer
const LS_NICK           = 'qz_nickname';

// ── Konfigurasi Mata Pelajaran ──
const SUBJECTS = [
  {
    key: 'kesglob',
    icon: '🌍',
    name: 'Kesehatan Global',
    abbr: 'KesGlob',
    available: true,
    color: '#10b981',
    gradient: 'linear-gradient(135deg,#10b981,#34d399)',
    desc: 'Epidemiologi, SDGs, sistem kesehatan dunia & isu kesehatan global',
  },
  {
    key: 'ftk',
    icon: '🌿',
    name: 'Falsafah & Teori Keperawatan',
    abbr: 'FTK',
    available: true,
    color: '#8b7bff',
    gradient: 'linear-gradient(135deg,#8b7bff,#5eead4)',
    desc: 'Paradigma keperawatan, teori-teori keperawatan & konsep dasar profesi',
  },
  {
    key: 'eng',
    icon: '🇬🇧',
    name: 'Bahasa Inggris',
    abbr: 'ENG',
    available: false,
    color: '#6b7280',
    gradient: 'linear-gradient(135deg,#6b7280,#9ca3af)',
    desc: 'Medical English & terminologi keperawatan internasional',
  },
];

// ── Konfigurasi Tipe Soal ──
const QUIZ_TYPES = [
  {
    key: '100',
    icon: '📚',
    label: 'Bahan Pembelajaran',
    soalCount: 100,
    desc: '100 soal komprehensif sesuai materi & PPT dosen. Cocok untuk belajar dan memahami konsep secara mendalam.',
    typeClass: 'qz-type-learn',
    badgeBg: 'rgba(94,234,212,0.12)',
    badgeBorder: 'rgba(94,234,212,0.4)',
    badgeColor: '#5eead4',
    badgeLabel: '📖 BELAJAR',
  },
  {
    key: '50',
    icon: '✏️',
    label: 'Latihan Soal',
    soalCount: 50,
    desc: '50 soal pilihan untuk simulasi ujian. Ukur kemampuanmu dan persiapkan diri sebelum ujian sesungguhnya!',
    typeClass: 'qz-type-practice',
    badgeBg: 'rgba(251,191,36,0.12)',
    badgeBorder: 'rgba(251,191,36,0.4)',
    badgeColor: '#fbbf24',
    badgeLabel: '⏱️ LATIHAN',
  },
];

/* ════════════════════════════════════════════════════
   FIREBASE — instance ke-2 khusus quiz
════════════════════════════════════════════════════ */
const quizApp  = getApps().find(a => a.name === 'quiz')
  || initializeApp(getApp().options, 'quiz');
const quizAuth = getAuth(quizApp);
const quizDb   = getFirestore(quizApp);

// Ingatan sesi bertahan setelah refresh untuk Google & Anonymous
setPersistence(quizAuth, browserLocalPersistence).catch(() => {});

/* ════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════ */
const formatDuration = (sec) => {
  if (sec == null || sec < 0) return '--';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const calcScore = (correct, total) =>
  total ? Math.round((correct / total) * MAX_SCORE) : 0;

const isNsLeo = (name) => /ns\W*leo/i.test(name);

const checkIsAdmin = (user) =>
  !!(user && !user.isAnonymous && user.email === ADMIN_EMAIL);

/** Nama koleksi Firestore untuk leaderboard */
const getLbKey = (subject, type) =>
  subject && type ? `lb_${subject}_${type === '100' ? 'p100' : 'l50'}` : null;

/** Ambil soal berdasar mata pelajaran + tipe */
const getQs = (subject, type) => {
  try {
    if (type === '100') {
      const src = Array.isArray(allQ100) ? allQ100 : [];
      // KesGlob: index 0-99 · FTK: index 100-199
      const off = subject === 'kesglob' ? 0 : 100;
      return src.slice(off, off + 100);
    }
    const src = Array.isArray(allQ50) ? allQ50 : [];
    // KesGlob: index 0-49 · FTK: index 50-99
    const off = subject === 'kesglob' ? 0 : 50;
    return src.slice(off, off + 50);
  } catch { return []; }
};

const lsProgKey = (sub, typ) => `qz_prog_${sub}_${typ}`;
const lsBestKey = (sub, typ) => `qz_best_${sub}_${typ}`;

const loadBest = (sub, typ) => {
  try { return JSON.parse(localStorage.getItem(lsBestKey(sub, typ)) || 'null'); }
  catch { return null; }
};

const updateBest = (sub, typ, stat) => {
  try {
    const ex = loadBest(sub, typ);
    if (!ex || stat.score > ex.score ||
        (stat.score === ex.score && stat.durationSec < ex.durationSec)) {
      localStorage.setItem(lsBestKey(sub, typ), JSON.stringify({
        score: stat.score,
        correct: stat.correct,
        total: stat.total,
        durationSec: stat.durationSec,
        mode: stat.mode,
        date: new Date().toLocaleDateString('id-ID'),
      }));
      return true;
    }
    return false;
  } catch { return false; }
};

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

/* ════════════════════════════════════════════════════
   CSS
════════════════════════════════════════════════════ */
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
  --qz-font: 'Inter','Segoe UI',system-ui,sans-serif;
  --qz-font-display: 'Space Grotesk','Inter',sans-serif;
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
.qz-root *,.qz-root *::before,.qz-root *::after { box-sizing: border-box; }

.qz-root::before,.qz-root::after {
  content:''; position:fixed; z-index:0; pointer-events:none;
  width:400px; height:400px; border-radius:50%; filter:blur(100px);
}
.qz-root::before { background:var(--qz-primary); top:-120px; left:-100px; opacity:0.18; }
.qz-root::after  { background:var(--qz-primary2); bottom:-150px; right:-100px; opacity:0.11; }

.qz-wrap { max-width:520px; margin:0 auto; padding:0 16px 80px; position:relative; z-index:1; }

/* ── Header ── */
.qz-header {
  display:flex; align-items:center; gap:10px;
  padding:16px 0 12px; border-bottom:1px solid var(--qz-border);
  margin-bottom:20px; position:sticky; top:0;
  background:var(--qz-bg); z-index:20;
}
.qz-header-title {
  flex:1; font-family:var(--qz-font-display);
  font-size:0.97rem; font-weight:700; color:var(--qz-text);
  display:flex; flex-direction:column; gap:1px;
}
.qz-header-sub { font-size:0.7rem; color:var(--qz-muted); font-weight:400; }
.qz-back-btn {
  background:none; border:1px solid var(--qz-border); color:var(--qz-muted);
  border-radius:10px; padding:8px 14px; font-size:0.82rem;
  cursor:pointer; font-family:var(--qz-font); transition:all 0.2s; white-space:nowrap;
}
.qz-back-btn:hover { color:var(--qz-text); border-color:var(--qz-primary); }

/* ── Tabs ── */
.qz-tabs {
  display:flex; gap:6px; background:rgba(0,0,0,0.25);
  border:1px solid var(--qz-border); border-radius:14px; padding:6px; margin-bottom:20px;
}
.qz-tab {
  flex:1; padding:11px 6px; background:none; border:none; border-radius:10px;
  cursor:pointer; font:600 0.88rem var(--qz-font); color:var(--qz-muted); transition:all 0.2s;
}
.qz-tab:hover { color:var(--qz-text); background:var(--qz-surface); }
.qz-tab.qz-active {
  color:#fff;
  background:linear-gradient(135deg,rgba(139,123,255,0.35),rgba(94,234,212,0.15));
  box-shadow:inset 0 0 0 1px rgba(139,123,255,0.4);
}

/* ── Card ── */
.qz-card {
  background:var(--qz-surface); border:1px solid var(--qz-border);
  border-radius:var(--qz-radius); backdrop-filter:blur(18px);
  -webkit-backdrop-filter:blur(18px); box-shadow:0 20px 50px rgba(0,0,0,0.4);
}

/* ── Typography ── */
.qz-badge {
  display:inline-block; font-size:0.7rem; letter-spacing:0.2em;
  color:var(--qz-primary2); border:1px solid var(--qz-border);
  background:var(--qz-surface); padding:6px 12px; border-radius:999px; margin-bottom:16px;
}
.qz-h1 {
  font-family:var(--qz-font-display); font-size:clamp(1.7rem,6vw,2.6rem); font-weight:700;
  line-height:1.1; letter-spacing:-0.03em;
  background:linear-gradient(120deg,#fff 30%,var(--qz-primary) 70%,var(--qz-primary2));
  -webkit-background-clip:text; background-clip:text; color:transparent; margin-bottom:12px;
}
.qz-h2 { font-family:var(--qz-font-display); font-size:1.5rem; font-weight:700; color:var(--qz-text); margin-bottom:12px; }
.qz-muted { color:var(--qz-muted); line-height:1.65; font-size:0.95rem; }

/* ── Buttons ── */
.qz-btn {
  display:block; width:100%; min-height:52px; padding:14px 20px;
  border:1px solid transparent; border-radius:14px; cursor:pointer;
  font:600 0.95rem var(--qz-font); transition:all 0.22s; color:#fff;
  text-align:center; background:var(--qz-surface2);
}
.qz-btn:disabled { opacity:0.45; cursor:not-allowed; transform:none!important; box-shadow:none!important; }
.qz-btn-primary { background:linear-gradient(135deg,#8b7bff,#6d5df0); box-shadow:0 8px 24px rgba(139,123,255,0.35); }
.qz-btn-primary:not(:disabled):hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(139,123,255,0.55); }
.qz-btn-secondary { background:var(--qz-surface2); border-color:var(--qz-border); color:var(--qz-text); }
.qz-btn-secondary:not(:disabled):hover { background:rgba(255,255,255,0.1); transform:translateY(-1px); }
.qz-btn-success { background:linear-gradient(135deg,#10b981,#34d399); color:#04130d; box-shadow:0 8px 24px rgba(52,211,153,0.3); }
.qz-btn-success:not(:disabled):hover { transform:translateY(-2px); }
.qz-btn-sm { min-height:40px; padding:8px 16px; font-size:0.85rem; width:auto; display:inline-block; border-radius:10px; }
.qz-btn-inline { display:inline-block; width:auto; min-height:44px; }

/* ── Mode cards ── */
.qz-mode-options { display:flex; flex-direction:column; gap:10px; margin-bottom:24px; }
.qz-mode-card {
  padding:18px; background:var(--qz-surface); border:2px solid var(--qz-border);
  border-radius:16px; cursor:pointer; transition:all 0.2s; text-align:left;
}
.qz-mode-card:hover { border-color:rgba(139,123,255,0.5); }
.qz-mode-card.qz-selected { border-color:var(--qz-primary); background:rgba(139,123,255,0.12); }
.qz-mode-card h4 { font-family:var(--qz-font-display); font-size:1rem; color:var(--qz-text); margin-bottom:4px; }
.qz-mode-card p { color:var(--qz-muted); font-size:0.85rem; line-height:1.5; }

/* ── Auth ── */
.qz-auth-section {
  background:var(--qz-surface); border:1px solid var(--qz-border);
  border-radius:16px; padding:20px; margin-bottom:20px;
}
.qz-auth-section h4 { font-size:0.88rem; color:var(--qz-muted); margin-bottom:14px; letter-spacing:0.05em; text-transform:uppercase; }
.qz-input {
  width:100%; padding:13px 16px; background:rgba(0,0,0,0.35); color:var(--qz-text);
  border:1px solid var(--qz-border); border-radius:12px; font:1rem var(--qz-font);
  transition:all 0.2s; margin-bottom:10px;
}
.qz-input::placeholder { color:#55555f; }
.qz-input:focus { outline:none; border-color:var(--qz-primary); box-shadow:0 0 0 3px rgba(139,123,255,0.18); }
.qz-user-info {
  display:flex; align-items:center; gap:10px; padding:12px;
  background:rgba(139,123,255,0.08); border:1px solid rgba(139,123,255,0.25);
  border-radius:12px; margin-bottom:12px;
}
.qz-avatar {
  width:36px; height:36px; border-radius:50%; object-fit:cover;
  background:linear-gradient(135deg,var(--qz-primary),var(--qz-primary2));
  display:flex; align-items:center; justify-content:center;
  font-weight:700; font-size:0.85rem; color:#fff; flex-shrink:0;
}
.qz-user-name { flex:1; font-size:0.95rem; color:var(--qz-text); font-weight:600; }
.qz-admin-tag { font-size:0.65rem; background:var(--qz-danger); color:#fff; padding:2px 7px; border-radius:5px; margin-left:6px; font-weight:700; }
.qz-divider { text-align:center; color:var(--qz-muted); font-size:0.8rem; margin:12px 0; position:relative; }
.qz-divider::before,.qz-divider::after { content:''; position:absolute; top:50%; width:calc(50% - 20px); height:1px; background:var(--qz-border); }
.qz-divider::before { left:0; }
.qz-divider::after { right:0; }

/* ── How to ── */
.qz-howto { background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:14px; padding:18px; margin-top:20px; margin-bottom:20px; }
.qz-howto h4 { color:var(--qz-primary2); font-size:0.95rem; margin-bottom:8px; }
.qz-howto ol { color:var(--qz-muted); padding-left:18px; font-size:0.88rem; line-height:1.8; }

/* ── Quiz sticky bar ── */
.qz-sticky-bar {
  position:sticky; top:57px; z-index:15; display:flex; gap:8px;
  background:rgba(7,7,9,0.92); backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px); padding:10px 0;
  margin-bottom:16px; border-bottom:1px solid var(--qz-border);
}
.qz-stat-pill { flex:1; text-align:center; padding:8px 4px; background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:10px; font-size:0.75rem; }
.qz-stat-pill span { display:block; font-size:1.1rem; font-weight:700; font-family:var(--qz-font-display); font-variant-numeric:tabular-nums; }
.qz-stat-pill.qz-timer span { color:var(--qz-primary2); }
.qz-stat-pill.qz-correct span { color:var(--qz-success); }
.qz-stat-pill.qz-wrong span { color:var(--qz-danger); }
.qz-stat-pill.qz-score span { background:linear-gradient(120deg,var(--qz-primary),var(--qz-primary2)); -webkit-background-clip:text; background-clip:text; color:transparent; }
.qz-stat-pill.qz-timer-warn span { color:var(--qz-warning); }
.qz-stat-pill.qz-timer-danger span { color:var(--qz-danger); animation:qz-pulse 1s ease-in-out infinite; }

/* ── Progress bar ── */
.qz-progress-bar { background:var(--qz-surface2); height:5px; border-radius:999px; margin-bottom:14px; overflow:hidden; }
.qz-progress-fill { height:100%; background:linear-gradient(90deg,var(--qz-primary),var(--qz-primary2)); border-radius:999px; transition:width 0.35s ease; box-shadow:0 0 10px rgba(139,123,255,0.6); }
.qz-q-counter { text-align:right; color:var(--qz-muted); font-size:0.85rem; margin-bottom:10px; font-variant-numeric:tabular-nums; }

/* ── Question & Options ── */
.qz-q-text { background:var(--qz-surface); padding:20px; border-radius:14px; margin-bottom:18px; border:1px solid var(--qz-border); border-left:3px solid var(--qz-primary); font-weight:500; line-height:1.65; font-size:1rem; }
.qz-options { display:flex; flex-direction:column; gap:9px; }
.qz-option { display:flex; align-items:flex-start; gap:12px; padding:15px 16px; background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:13px; cursor:pointer; transition:all 0.18s; line-height:1.5; font-size:0.93rem; text-align:left; width:100%; color:var(--qz-text); font-family:var(--qz-font); min-height:52px; }
.qz-option:not(.qz-locked):hover { border-color:rgba(139,123,255,0.5); background:var(--qz-surface2); transform:translateX(3px); }
.qz-option.qz-locked { cursor:default; }
.qz-option-label { font-weight:700; color:var(--qz-muted); flex-shrink:0; font-size:0.85rem; margin-top:1px; min-width:18px; }
.qz-option.qz-sel { border-color:var(--qz-primary); background:rgba(139,123,255,0.12); box-shadow:0 0 0 2px rgba(139,123,255,0.1); }
.qz-option.qz-sel .qz-option-label { color:var(--qz-primary); }
.qz-option.qz-correct { border-color:var(--qz-success); background:rgba(52,211,153,0.1); }
.qz-option.qz-correct .qz-option-label { color:var(--qz-success); }
.qz-option.qz-incorrect { border-color:var(--qz-danger); background:rgba(251,113,133,0.1); }
.qz-option.qz-incorrect .qz-option-label { color:var(--qz-danger); }

/* ── Feedback ── */
.qz-feedback { margin-top:16px; padding:16px 18px; border-radius:13px; border:1px solid var(--qz-border); animation:qz-fade-up 0.3s ease; }
.qz-feedback.qz-fb-correct { background:rgba(52,211,153,0.08); border-color:rgba(52,211,153,0.4); }
.qz-feedback.qz-fb-incorrect { background:rgba(251,113,133,0.08); border-color:rgba(251,113,133,0.4); }
.qz-feedback h4 { font-family:var(--qz-font-display); font-size:1.05rem; margin-bottom:6px; }
.qz-fb-correct h4 { color:var(--qz-success); }
.qz-fb-incorrect h4 { color:var(--qz-danger); }
.qz-feedback p { color:#c9c9d2; font-size:0.9rem; line-height:1.6; margin-top:4px; }

/* ── Nav buttons ── */
.qz-nav-btns { display:flex; gap:10px; margin-top:20px; }
.qz-nav-btns .qz-btn { flex:1; }

/* ── Alerts ── */
.qz-alert { padding:12px 16px; border-radius:11px; font-size:0.9rem; margin-bottom:14px; animation:qz-fade-up 0.25s ease; }
.qz-alert-info { background:rgba(94,234,212,0.1); border:1px solid rgba(94,234,212,0.3); color:var(--qz-primary2); }
.qz-alert-warn { background:rgba(251,191,36,0.1); border:1px solid rgba(251,191,36,0.3); color:var(--qz-warning); }
.qz-alert-err { background:rgba(251,113,133,0.1); border:1px solid rgba(251,113,133,0.3); color:var(--qz-danger); line-height:1.5; }

/* ── Nav toggle (floating btn) ── */
.qz-nav-toggle { position:fixed; bottom:20px; right:20px; z-index:30; background:linear-gradient(135deg,var(--qz-primary),#6d5df0); color:#fff; border:none; border-radius:14px; padding:12px 18px; font:600 0.85rem var(--qz-font); cursor:pointer; box-shadow:0 8px 24px rgba(139,123,255,0.4); }

/* ── Leaderboard ── */
.qz-stats-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px; }
.qz-stat-card { background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:14px; padding:16px; text-align:center; }
.qz-stat-card h4 { color:var(--qz-muted); font-size:0.72rem; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:8px; }
.qz-stat-card .qz-val { font-family:var(--qz-font-display); font-size:1.9rem; font-weight:700; background:linear-gradient(120deg,var(--qz-primary),var(--qz-primary2)); -webkit-background-clip:text; background-clip:text; color:transparent; }
.qz-lb-row { display:flex; align-items:center; gap:10px; padding:12px; border-bottom:1px solid var(--qz-border); }
.qz-lb-row:last-child { border-bottom:none; }
.qz-lb-row.qz-me { background:rgba(139,123,255,0.08); border-radius:10px; border:1px solid rgba(139,123,255,0.2); margin:2px 0; }
.qz-lb-rank { display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:8px; background:var(--qz-surface2); font-weight:700; font-size:0.85rem; flex-shrink:0; }
.qz-lb-rank.qz-gold { background:linear-gradient(135deg,#fde68a,#f59e0b); color:#2a1a00; }
.qz-lb-rank.qz-silver { background:linear-gradient(135deg,#f1f5f9,#94a3b8); color:#111827; }
.qz-lb-rank.qz-bronze { background:linear-gradient(135deg,#fdba74,#c2410c); color:#1f0b00; }
.qz-lb-avatar { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,var(--qz-primary),var(--qz-primary2)); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.78rem; color:#fff; overflow:hidden; flex-shrink:0; }
.qz-lb-avatar img { width:100%; height:100%; object-fit:cover; }
.qz-lb-name { flex:1; font-size:0.9rem; font-weight:600; }
.qz-lb-meta { font-size:0.72rem; color:var(--qz-muted); margin-top:2px; }
.qz-lb-score { font-family:var(--qz-font-display); font-weight:700; font-size:1rem; background:linear-gradient(120deg,var(--qz-primary),var(--qz-primary2)); -webkit-background-clip:text; background-clip:text; color:transparent; white-space:nowrap; }
.qz-badge-mode { font-size:0.68rem; padding:2px 7px; border-radius:999px; border:1px solid var(--qz-border); background:var(--qz-surface); color:var(--qz-muted); flex-shrink:0; }
.qz-me-tag { font-size:0.65rem; background:var(--qz-primary); color:#fff; padding:2px 6px; border-radius:6px; margin-left:4px; }
.qz-empty { text-align:center; padding:40px 20px; color:var(--qz-muted); font-size:0.9rem; }
.qz-loading { text-align:center; padding:40px 20px; color:var(--qz-muted); animation:qz-pulse 1.2s ease-in-out infinite; }

/* ── Animations ── */
@keyframes qz-fade-up { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
@keyframes qz-slide-up { from { opacity:0; transform:translateY(40px) scale(0.97); } to { opacity:1; transform:none; } }
@keyframes qz-pulse { 0%,100% { opacity:1; } 50% { opacity:0.55; } }

/* ── Modal overlay ── */
.qz-modal-overlay { position:fixed; inset:0; background:rgba(4,4,6,0.82); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); display:flex; align-items:flex-end; justify-content:center; z-index:9000; padding:0; }
.qz-modal-box { background:#0f0f14; border:1px solid var(--qz-border); border-radius:24px 24px 0 0; padding:32px 24px 40px; width:100%; max-width:520px; max-height:90dvh; overflow-y:auto; text-align:center; box-shadow:0 0 60px rgba(139,123,255,0.2); animation:qz-slide-up 0.4s ease; }
@media (prefers-reduced-motion:reduce) { .qz-modal-box,.qz-bs-box,.qz-feedback { animation:none; } .qz-progress-fill { transition:none; } }
.qz-result-score { font-family:var(--qz-font-display); font-size:3.5rem; font-weight:700; background:linear-gradient(120deg,var(--qz-primary),var(--qz-primary2)); -webkit-background-clip:text; background-clip:text; color:transparent; line-height:1; margin:8px 0 4px; }
.qz-result-details { background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:14px; padding:14px 18px; margin:18px 0; text-align:left; }
.qz-result-row { display:flex; justify-content:space-between; padding:6px 0; color:#c9c9d2; font-size:0.9rem; border-bottom:1px solid rgba(255,255,255,0.05); }
.qz-result-row:last-child { border-bottom:none; }
.qz-result-row span:last-child { font-weight:600; color:var(--qz-text); }

/* ── QRIS ── */
.qz-qris-card { background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:16px; padding:18px; margin:16px 0; text-align:center; }
.qz-qris-card h4 { color:var(--qz-text); margin-bottom:8px; font-family:var(--qz-font-display); font-size:1rem; }
.qz-qris-card p { color:var(--qz-muted); font-size:0.85rem; line-height:1.55; margin-bottom:14px; }
.qz-qris-img { width:180px; max-width:100%; border-radius:12px; cursor:pointer; transition:transform 0.2s; display:block; margin:0 auto 12px; }
.qz-qris-img:hover { transform:scale(1.03); }
.qz-qris-full { position:fixed; inset:0; background:rgba(0,0,0,0.9); display:flex; align-items:center; justify-content:center; z-index:9999; cursor:zoom-out; padding:20px; }
.qz-qris-full img { max-width:100%; max-height:90dvh; border-radius:16px; }

/* ── Bottom-sheet ── */
.qz-bs-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:8000; }
.qz-bs-box { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:520px; background:#0f0f14; border:1px solid var(--qz-border); border-radius:20px 20px 0 0; padding:20px 16px 32px; z-index:8001; max-height:65dvh; overflow-y:auto; animation:qz-slide-up 0.3s ease; }
.qz-bs-handle { width:40px; height:4px; background:var(--qz-border); border-radius:999px; margin:0 auto 16px; }
.qz-nav-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(44px,1fr)); gap:8px; }
.qz-nav-cell { aspect-ratio:1; display:flex; align-items:center; justify-content:center; border-radius:10px; border:1px solid var(--qz-border); background:var(--qz-surface); font-weight:700; font-size:0.85rem; cursor:pointer; transition:all 0.15s; color:var(--qz-muted); }
.qz-nav-cell:hover { border-color:var(--qz-primary); color:var(--qz-text); }
.qz-nav-cell.qz-nc-correct { background:rgba(52,211,153,0.18); border-color:var(--qz-success); color:var(--qz-success); }
.qz-nav-cell.qz-nc-wrong { background:rgba(251,113,133,0.18); border-color:var(--qz-danger); color:var(--qz-danger); }
.qz-nav-cell.qz-nc-answered { background:rgba(139,123,255,0.12); border-color:rgba(139,123,255,0.4); color:var(--qz-primary); }
.qz-nav-cell.qz-nc-active { border-color:var(--qz-primary); background:rgba(139,123,255,0.2); color:#fff; box-shadow:0 0 0 2px rgba(139,123,255,0.3); }

/* ── Resume card ── */
.qz-resume-card { background:rgba(139,123,255,0.08); border:1px solid rgba(139,123,255,0.3); border-radius:14px; padding:18px; margin-bottom:18px; }
.qz-resume-card h4 { color:var(--qz-primary); margin-bottom:8px; font-family:var(--qz-font-display); }
.qz-resume-card p { color:var(--qz-muted); font-size:0.88rem; margin-bottom:14px; }
.qz-resume-btns { display:flex; gap:8px; }
.qz-resume-btns .qz-btn { flex:1; }

/* ════ SUBJECTS SCREEN ════ */
.qz-sub-hero { text-align:center; padding:48px 0 32px; }
.qz-sub-logo { display:inline-flex; align-items:center; gap:8px; background:rgba(139,123,255,0.1); border:1px solid rgba(139,123,255,0.3); border-radius:999px; padding:7px 16px; font-size:0.75rem; font-weight:700; color:var(--qz-primary); letter-spacing:0.12em; margin-bottom:22px; }
.qz-sub-title { font-family:var(--qz-font-display); font-size:clamp(2rem,8vw,2.8rem); font-weight:900; line-height:1.1; margin-bottom:12px; background:linear-gradient(135deg,#f4f4f6 30%,#8b7bff 70%,#5eead4 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.qz-sub-desc { color:var(--qz-muted); font-size:0.95rem; line-height:1.6; }
.qz-disclaimer { background:rgba(251,191,36,0.06); border:1px solid rgba(251,191,36,0.25); border-radius:var(--qz-radius); padding:16px 18px; margin-bottom:28px; display:flex; gap:14px; align-items:flex-start; }
.qz-disclaimer-icon { font-size:1.3rem; flex-shrink:0; margin-top:2px; }
.qz-disclaimer-text h4 { color:var(--qz-warning); font-size:0.8rem; font-weight:700; margin-bottom:6px; font-family:var(--qz-font-display); }
.qz-disclaimer-text p { color:rgba(251,191,36,0.7); font-size:0.8rem; line-height:1.6; margin:0; }
.qz-section-label { font-size:0.72rem; font-weight:700; color:var(--qz-muted); letter-spacing:0.15em; text-transform:uppercase; margin-bottom:12px; }
.qz-coming-divider { display:flex; align-items:center; gap:10px; margin:22px 0 14px; }
.qz-coming-divider span { font-size:0.72rem; color:var(--qz-muted); font-weight:600; letter-spacing:0.12em; text-transform:uppercase; white-space:nowrap; }
.qz-coming-divider::before,.qz-coming-divider::after { content:''; flex:1; height:1px; background:var(--qz-border); }
.qz-subject-card { display:flex; align-items:center; gap:14px; background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:var(--qz-radius); padding:18px; margin-bottom:10px; cursor:default; transition:all 0.2s; position:relative; overflow:hidden; -webkit-tap-highlight-color:transparent; }
.qz-subject-card.qz-subj-available { border-color:rgba(139,123,255,0.35); background:rgba(139,123,255,0.06); cursor:pointer; }
.qz-subject-card.qz-subj-available:hover { border-color:rgba(139,123,255,0.6); background:rgba(139,123,255,0.11); transform:translateY(-2px); box-shadow:0 8px 30px rgba(139,123,255,0.2); }
.qz-subject-card.qz-subj-locked { opacity:0.5; }
.qz-subj-icon { width:50px; height:50px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; flex-shrink:0; }
.qz-subj-info { flex:1; min-width:0; }
.qz-subj-name { font-family:var(--qz-font-display); font-weight:700; font-size:0.97rem; margin-bottom:3px; color:var(--qz-text); }
.qz-subj-meta { font-size:0.78rem; color:var(--qz-muted); }
.qz-subj-right { display:flex; flex-direction:column; align-items:flex-end; gap:5px; flex-shrink:0; }
.qz-badge-avail { background:rgba(52,211,153,0.12); border:1px solid rgba(52,211,153,0.4); color:var(--qz-success); font-size:0.7rem; font-weight:700; padding:3px 10px; border-radius:999px; }
.qz-badge-soon { background:var(--qz-surface); border:1px solid var(--qz-border); color:var(--qz-muted); font-size:0.7rem; font-weight:600; padding:3px 10px; border-radius:999px; }
.qz-subj-arrow { color:var(--qz-primary); font-size:1.1rem; font-weight:700; }

/* ════ QUIZ TYPE SCREEN ════ */
.qz-type-card { display:flex; align-items:flex-start; gap:16px; border:2px solid var(--qz-border); border-radius:var(--qz-radius); padding:20px; margin-bottom:12px; cursor:pointer; transition:all 0.2s; -webkit-tap-highlight-color:transparent; }
.qz-type-learn { border-color:rgba(94,234,212,0.35); background:rgba(94,234,212,0.04); }
.qz-type-learn:hover { border-color:rgba(94,234,212,0.65); background:rgba(94,234,212,0.09); transform:translateY(-2px); box-shadow:0 8px 30px rgba(94,234,212,0.12); }
.qz-type-practice { border-color:rgba(251,191,36,0.35); background:rgba(251,191,36,0.04); }
.qz-type-practice:hover { border-color:rgba(251,191,36,0.65); background:rgba(251,191,36,0.09); transform:translateY(-2px); box-shadow:0 8px 30px rgba(251,191,36,0.12); }
.qz-type-icon { font-size:2.2rem; flex-shrink:0; margin-top:2px; }
.qz-type-info { flex:1; }
.qz-type-title { font-family:var(--qz-font-display); font-weight:700; font-size:1.05rem; color:var(--qz-text); margin-bottom:6px; }
.qz-type-badge { display:inline-block; font-size:0.68rem; font-weight:700; padding:3px 10px; border-radius:999px; margin-bottom:6px; }
.qz-type-soal { font-size:0.84rem; font-weight:600; margin-bottom:6px; }
.qz-type-desc { color:var(--qz-muted); font-size:0.83rem; line-height:1.55; }

/* ════ ADMIN PANEL ════ */
.qz-admin-panel { background:rgba(251,113,133,0.05); border:1px solid rgba(251,113,133,0.2); border-radius:14px; padding:16px; margin-bottom:20px; }
.qz-admin-title { color:var(--qz-danger); font-family:var(--qz-font-display); font-size:0.8rem; font-weight:700; margin-bottom:12px; letter-spacing:0.08em; text-transform:uppercase; display:flex; align-items:center; gap:6px; }
.qz-admin-btns { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:0; }
.qz-btn-danger { background:rgba(251,113,133,0.1); border:1px solid rgba(251,113,133,0.35); color:var(--qz-danger); font-size:0.78rem; font-weight:600; min-height:34px; padding:6px 12px; width:auto; display:inline-flex; align-items:center; gap:5px; border-radius:10px; cursor:pointer; transition:all 0.2s; font-family:var(--qz-font); }
.qz-btn-danger:hover:not(:disabled) { background:rgba(251,113,133,0.2); }
.qz-btn-danger:disabled { opacity:0.45; cursor:not-allowed; }

/* ════ PERSONAL BEST ════ */
.qz-personal-best { background:rgba(94,234,212,0.06); border:1px solid rgba(94,234,212,0.2); border-radius:12px; padding:12px 16px; margin-bottom:14px; display:flex; align-items:center; gap:12px; }
.qz-pb-emoji { font-size:1.4rem; flex-shrink:0; }
.qz-pb-body { flex:1; }
.qz-pb-label { font-size:0.72rem; color:var(--qz-muted); text-transform:uppercase; letter-spacing:0.08em; font-weight:700; }
.qz-pb-sub { font-size:0.78rem; color:var(--qz-muted); margin-top:2px; }
.qz-pb-score { font-family:var(--qz-font-display); font-size:1.5rem; font-weight:700; color:var(--qz-primary2); }

/* ════ NEW BEST BANNER ════ */
.qz-new-best { background:linear-gradient(135deg,rgba(52,211,153,0.12),rgba(94,234,212,0.08)); border:1px solid rgba(52,211,153,0.4); border-radius:12px; padding:10px 16px; margin:10px 0; font-size:0.88rem; color:var(--qz-success); font-weight:600; animation:qz-fade-up 0.3s ease; }

/* ════ AI FOOTER + TRAKTEER ════ */
.qz-ai-footer { text-align:center; padding:20px 0 4px; color:rgba(141,141,153,0.45); font-size:0.72rem; line-height:1.9; border-top:1px solid rgba(255,255,255,0.04); margin-top:28px; }
.qz-trakteer-btn { display:inline-flex; align-items:center; gap:6px; background:rgba(251,191,36,0.1); border:1px solid rgba(251,191,36,0.3); color:#fbbf24; border-radius:10px; padding:8px 18px; font:600 0.82rem var(--qz-font); cursor:pointer; text-decoration:none; transition:all 0.2s; }
.qz-trakteer-btn:hover { background:rgba(251,191,36,0.18); transform:translateY(-1px); }

/* ════ QRIS HINT (last question) ════ */
.qz-last-q-hint { margin-top:16px; padding:12px 16px; background:rgba(251,191,36,0.06); border:1px solid rgba(251,191,36,0.2); border-radius:12px; text-align:center; animation:qz-fade-up 0.3s ease; }
.qz-last-q-hint p { color:var(--qz-muted); font-size:0.82rem; margin:0 0 8px; }
`;

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════ */
export default function QuizizFakep() {
  const navigate = useNavigate();

  /* ── Screen state ── */
  const [screen, setScreen]                   = useState('subjects'); // 'subjects' | 'quiz-type' | 'quiz'
  const [selectedSubject, setSelectedSubject] = useState(null);       // 'kesglob' | 'ftk'
  const [selectedType, setSelectedType]       = useState(null);       // '100' | '50'
  const [activeQuestions, setActiveQuestions] = useState([]);

  /* ── Auth ── */
  const [quizUser, setQuizUser]       = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [nickname, setNickname]       = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [authAlert, setAuthAlert]     = useState('');
  const [authErrType, setAuthErrType] = useState('');
  const [isAdminUser, setIsAdminUser] = useState(false);

  /* ── Quiz ── */
  const [tab, setTab]               = useState('mulai');
  const [mode, setMode]             = useState('unlimited');
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers]         = useState({});
  const [currentQ, setCurrentQ]       = useState(0);
  const [checkedSet, setCheckedSet]   = useState({}); // { [idx]: true } hanya setelah "Periksa"

  /* ── Timer ── */
  const [deadline, setDeadline]   = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft]   = useState(null);
  const timerRef = useRef(null);

  /* ── Modal & UI ── */
  const [showResult, setShowResult] = useState(false);
  const [showNav, setShowNav]       = useState(false);
  const [qrisLarge, setQrisLarge]   = useState(false);
  const [qrisError, setQrisError]   = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [finalStat, setFinalStat]   = useState(null);
  const [isNewBest, setIsNewBest]   = useState(false);
  const [personalBest, setPersonalBest] = useState(null);

  /* ── Leaderboard ── */
  const [lb, setLb]               = useState([]);
  const [lbLoading, setLbLoading] = useState(false);
  const [lbError, setLbError]     = useState('');
  const lbUnsubRef = useRef(null);

  /* ── Progress ── */
  const [savedProgress, setSavedProgress] = useState(null);

  /* ── Admin ── */
  const [adminStatus, setAdminStatus] = useState(''); // '' | 'resetting' | 'done' | 'err:...'

  /* ─────── DERIVED ─────── */
  const TOTAL         = activeQuestions.length;
  const lbCollection  = useMemo(() => getLbKey(selectedSubject, selectedType), [selectedSubject, selectedType]);
  const subjectInfo   = useMemo(() => SUBJECTS.find(s => s.key === selectedSubject), [selectedSubject]);
  const typeInfo      = useMemo(() => QUIZ_TYPES.find(t => t.key === selectedType), [selectedType]);

  /* ─────── EFFECTS ─────── */

  // Google Fonts
  useEffect(() => {
    const el = document.createElement('link');
    el.rel  = 'stylesheet';
    el.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap';
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  // noindex
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots'; meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  // Auth observer — setPersistence sudah dipanggil di module level
  useEffect(() => {
    const unsub = onAuthStateChanged(quizAuth, (u) => {
      setQuizUser(u);
      if (u) {
        const name = u.isAnonymous
          ? (u.displayName || localStorage.getItem(LS_NICK) || 'Anonim')
          : (u.displayName || '').slice(0, 24);
        setDisplayName(name);
        setIsAdminUser(checkIsAdmin(u));
      } else {
        setIsAdminUser(false);
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Load personal best + saved progress saat masuk quiz screen
  useEffect(() => {
    if (screen !== 'quiz' || !selectedSubject || !selectedType) return;
    setPersonalBest(loadBest(selectedSubject, selectedType));
    try {
      const raw = localStorage.getItem(lsProgKey(selectedSubject, selectedType));
      setSavedProgress(raw ? JSON.parse(raw) : null);
    } catch { setSavedProgress(null); }
  }, [screen, selectedSubject, selectedType]);

  // Autosave progress
  useEffect(() => {
    if (!quizStarted || !selectedSubject || !selectedType) return;
    try {
      localStorage.setItem(
        lsProgKey(selectedSubject, selectedType),
        JSON.stringify({ answers, currentQ, mode, deadline, startTime, checkedSet })
      );
    } catch { /* ignore */ }
  }, [answers, currentQ, mode, deadline, startTime, quizStarted, checkedSet, selectedSubject, selectedType]);

  // Timer (hard mode)
  useEffect(() => {
    if (mode !== 'hard' || !quizStarted || !deadline) return;
    const tick = () => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setTimeLeft(left);
      if (left <= 0) finishQuizRef.current(true);
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    const onVisi = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', onVisi);
    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', onVisi);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, quizStarted, deadline]);

  // Leaderboard realtime
  useEffect(() => {
    if (tab !== 'ranking' || !lbCollection) {
      if (lbUnsubRef.current) { lbUnsubRef.current(); lbUnsubRef.current = null; }
      return;
    }
    setLbLoading(true); setLbError('');
    const q = query(collection(quizDb, lbCollection), orderBy('score', 'desc'), limit(50));
    lbUnsubRef.current = onSnapshot(q, (snap) => {
      const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      rows.sort((a, b) => b.score - a.score || a.durationSec - b.durationSec);
      setLb(rows);
      setLbLoading(false);
    }, (err) => { setLbError('Gagal memuat ranking: ' + err.message); setLbLoading(false); });
    return () => { if (lbUnsubRef.current) { lbUnsubRef.current(); lbUnsubRef.current = null; } };
  }, [tab, lbCollection]);

  /* ─────── COMPUTED ─────── */
  const correctCount = useMemo(() =>
    Object.entries(answers).filter(([idx, sel]) =>
      checkedSet[idx] && sel === activeQuestions[Number(idx)]?.correct
    ).length,
  [answers, checkedSet, activeQuestions]);

  const wrongCount = useMemo(() =>
    Object.entries(answers).filter(([idx, sel]) =>
      checkedSet[idx] && sel !== activeQuestions[Number(idx)]?.correct
    ).length,
  [answers, checkedSet, activeQuestions]);

  const currentScore = useMemo(() => calcScore(correctCount, TOTAL), [correctCount, TOTAL]);

  const timerClass = useMemo(() => {
    if (!timeLeft || mode !== 'hard') return 'qz-timer';
    if (timeLeft < 60)  return 'qz-timer qz-timer-danger';
    if (timeLeft < 300) return 'qz-timer qz-timer-warn';
    return 'qz-timer';
  }, [timeLeft, mode]);

  const lbStats = useMemo(() => {
    const avg = lb.length ? Math.round(lb.reduce((s, r) => s + r.score, 0) / lb.length) : 0;
    return { total: lb.length, avgScore: avg };
  }, [lb]);

  /* ─────── AUTH HANDLERS ─────── */
  const handleGoogleLogin = async () => {
    setAuthAlert(''); setAuthErrType('');
    const ua = navigator.userAgent || '';
    if (/Instagram|FBAN|FBAV|Line\/|WhatsApp/i.test(ua)) {
      setAuthAlert('Login Google sering gagal di browser dalam aplikasi (Instagram/WhatsApp/Line). Buka di Chrome atau Safari, atau pilih Main Anonim.');
      setAuthErrType('inapp'); return;
    }
    try {
      await signInWithPopup(quizAuth, new GoogleAuthProvider());
    } catch (err) {
      const msgs = {
        'auth/popup-closed-by-user': 'Popup ditutup sebelum selesai. Coba lagi.',
        'auth/popup-blocked':        'Popup diblokir browser. Izinkan popup lalu coba lagi.',
        'auth/network-request-failed': 'Koneksi bermasalah. Cek internet lalu coba lagi.',
      };
      setAuthAlert(msgs[err.code] || 'Login gagal: ' + err.message);
      setAuthErrType('err');
    }
  };

  const handleAnonLogin = async () => {
    setAuthAlert(''); setAuthErrType('');
    const name = nickname.trim();
    if (name.length < 2 || name.length > 24) { setAuthAlert('Nickname harus 2–24 karakter.'); setAuthErrType('err'); return; }
    if (isNsLeo(name)) { setAuthAlert('Nama "Ns Leo" sudah dicadangkan. Pakai nama lain ya 😄'); setAuthErrType('err'); return; }
    try {
      const cred = await signInAnonymously(quizAuth);
      localStorage.setItem(LS_NICK, name);
      setDisplayName(name);
      setQuizUser({ ...cred.user, _nickname: name });
    } catch (err) { setAuthAlert('Gagal masuk anonim: ' + err.message); setAuthErrType('err'); }
  };

  const handleSignOut = async () => { await signOut(quizAuth); setDisplayName(''); setNickname(''); };

  /* ─────── SCREEN HANDLERS ─────── */
  const handleSelectSubject = (key) => { setSelectedSubject(key); setScreen('quiz-type'); };

  const handleSelectType = (typeKey) => {
    const qs = getQs(selectedSubject, typeKey);
    setSelectedType(typeKey);
    setActiveQuestions(qs);
    // Reset semua quiz state
    setQuizStarted(false); setAnswers({}); setCurrentQ(0); setCheckedSet({});
    setShowResult(false); setFinalStat(null); setSaveStatus('');
    setIsNewBest(false); setTab('mulai');
    setScreen('quiz');
  };

  const clearProgress = useCallback(() => {
    if (selectedSubject && selectedType) {
      try { localStorage.removeItem(lsProgKey(selectedSubject, selectedType)); } catch { /* ignore */ }
    }
  }, [selectedSubject, selectedType]);

  const backToQuizType = useCallback(() => {
    if (quizStarted) {
      if (!window.confirm('Keluar dari quiz? Progres tersimpan, bisa dilanjutkan nanti.')) return;
    }
    setQuizStarted(false); setTab('mulai');
    setShowResult(false); setFinalStat(null);
    setAnswers({}); setCurrentQ(0); setCheckedSet({}); setIsNewBest(false);
    setSelectedType(null); setActiveQuestions([]);
    setScreen('quiz-type');
  }, [quizStarted]);

  const backToSubjects = useCallback(() => {
    if (quizStarted) {
      if (!window.confirm('Keluar dari quiz? Progres tersimpan, bisa dilanjutkan nanti.')) return;
    }
    setQuizStarted(false); setTab('mulai');
    setShowResult(false); setFinalStat(null);
    setAnswers({}); setCurrentQ(0); setCheckedSet({}); setIsNewBest(false);
    setSelectedSubject(null); setSelectedType(null); setActiveQuestions([]);
    setScreen('subjects');
  }, [quizStarted]);

  /* ─────── QUIZ HANDLERS ─────── */
  const startQuiz = (resumeData) => {
    if (resumeData) {
      setAnswers(resumeData.answers || {});
      setCurrentQ(resumeData.currentQ || 0);
      setMode(resumeData.mode || 'unlimited');
      setDeadline(resumeData.deadline || null);
      setStartTime(resumeData.startTime || Date.now());
      setCheckedSet(resumeData.checkedSet || {});
    } else {
      const now = Date.now();
      setAnswers({}); setCurrentQ(0); setCheckedSet({});
      setStartTime(now);
      if (mode === 'hard') setDeadline(now + HARD_MODE_MINUTES * 60 * 1000);
      else setDeadline(null);
    }
    setQuizStarted(true);
    setShowResult(false);
    setTab('quiz');
  };

  const finishQuiz = useCallback((timeUp) => {
    clearInterval(timerRef.current);
    const endTime = Date.now();
    const durationSec = Math.round((endTime - (startTime || endTime)) / 1000);
    // Hitung final — semua jawaban dianggap selesai saat finish
    const finalCorrect = Object.entries(answers).filter(([idx, sel]) =>
      sel === activeQuestions[Number(idx)]?.correct
    ).length;
    const score = calcScore(finalCorrect, TOTAL);
    const stat = { correct: finalCorrect, total: TOTAL, score, durationSec, mode };
    setFinalStat(stat);
    setShowResult(true);
    setQuizStarted(false);
    clearProgress();
    setSavedProgress(null);
    // Personal best
    const newBest = updateBest(selectedSubject, selectedType, stat);
    setIsNewBest(newBest);
    if (newBest) setPersonalBest({ ...stat, date: new Date().toLocaleDateString('id-ID') });
    saveToLeaderboard(stat);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, mode, startTime, TOTAL, activeQuestions, clearProgress, selectedSubject, selectedType]);

  const finishQuizRef = useRef(finishQuiz);
  useEffect(() => { finishQuizRef.current = finishQuiz; }, [finishQuiz]);

  const saveToLeaderboard = async (stat) => {
    if (!quizUser || !lbCollection) return;
    setSaveStatus('saving');
    const uid = quizUser.uid;
    const name = displayName.slice(0, 24);
    if (isNsLeo(name)) { setSaveStatus(''); return; }
    const docRef = doc(quizDb, lbCollection, uid);
    try {
      const existing = await getDoc(docRef);
      const shouldWrite = !existing.exists()
        || stat.score > existing.data().score
        || (stat.score === existing.data().score && stat.durationSec < existing.data().durationSec);
      if (!shouldWrite) { setSaveStatus('notbest'); return; }
      const payload = {
        uid, name,
        score: stat.score, correct: stat.correct, total: stat.total,
        mode: stat.mode, durationSec: stat.durationSec,
        subject: selectedSubject, quizType: selectedType,
        isAnonymous: quizUser.isAnonymous ?? true,
        updatedAt: serverTimestamp(),
      };
      if (quizUser.photoURL) payload.photoURL = quizUser.photoURL;
      await setDoc(docRef, payload);
      setSaveStatus('saved');
    } catch { setSaveStatus(''); }
  };

  const selectAnswer = (optIdx) => {
    if (checkedSet[currentQ]) return;
    setAnswers(prev => ({ ...prev, [currentQ]: optIdx }));
  };

  const checkAnswer = () => {
    if (answers[currentQ] == null) return;
    setCheckedSet(prev => ({ ...prev, [currentQ]: true }));
  };

  const goToQ = (idx) => { setCurrentQ(idx); setShowNav(false); };
  const goNext = () => { currentQ < TOTAL - 1 ? goToQ(currentQ + 1) : finishQuizRef.current(false); };
  const goPrev = () => { if (currentQ > 0) goToQ(currentQ - 1); };

  const restartQuiz = () => {
    setShowResult(false); setFinalStat(null); setSaveStatus(''); setCheckedSet({}); setIsNewBest(false);
    startQuiz(null);
  };

  const backToMenu = () => {
    setShowResult(false); setFinalStat(null); setSaveStatus('');
    setQuizStarted(false); setCheckedSet({}); setIsNewBest(false);
    setTab('mulai');
  };

  /* ─────── ADMIN HANDLER ─────── */
  const handleAdminReset = async (subject, type) => {
    const collName = getLbKey(subject, type);
    if (!collName) return;
    const subj = SUBJECTS.find(s => s.key === subject);
    const typ  = QUIZ_TYPES.find(t => t.key === type);
    if (!window.confirm(`⚠️ RESET RANKING\n\n${subj?.name} · ${typ?.label} (${typ?.soalCount} Soal)\n\nSemua data ranking akan dihapus permanen!\nLanjutkan?`)) return;
    setAdminStatus('resetting');
    try {
      const snap = await getDocs(collection(quizDb, collName));
      if (!snap.empty) {
        let batch = writeBatch(quizDb);
        let cnt = 0;
        for (const d of snap.docs) {
          batch.delete(d.ref); cnt++;
          if (cnt % 500 === 0) { await batch.commit(); batch = writeBatch(quizDb); }
        }
        if (cnt % 500 !== 0) await batch.commit();
      }
      setAdminStatus('done');
      setTimeout(() => setAdminStatus(''), 3500);
    } catch (err) { setAdminStatus('err:' + err.message); }
  };

  /* ─────── COMPUTED: CURRENT QUESTION ─────── */
  const q            = activeQuestions[currentQ] || null;
  const selectedOpt  = answers[currentQ];
  const isAnswered   = selectedOpt != null;
  const isChecked    = !!checkedSet[currentQ];
  const isCorrectAns = isAnswered && q != null && selectedOpt === q.correct;

  const getOptClass = (i) => {
    let cls = 'qz-option';
    if (isChecked) {
      cls += ' qz-locked';
      if (i === q?.correct) cls += ' qz-correct';
      else if (i === selectedOpt) cls += ' qz-incorrect';
    } else if (i === selectedOpt) cls += ' qz-sel';
    return cls;
  };

  const getNavCellClass = (i) => {
    let cls = 'qz-nav-cell';
    if (i === currentQ) return cls + ' qz-nc-active';
    if (checkedSet[i]) return cls + (answers[i] === activeQuestions[i]?.correct ? ' qz-nc-correct' : ' qz-nc-wrong');
    if (answers[i] != null) return cls + ' qz-nc-answered';
    return cls;
  };

  /* ════════════════════════════════════════════════════
     SCREEN 1: PILIH MATA PELAJARAN
  ════════════════════════════════════════════════════ */
  if (screen === 'subjects') {
    return (
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-wrap">

          {/* Hero */}
          <div className="qz-sub-hero">
            <div className="qz-sub-logo">📚 QUIZ KEPERAWATAN</div>
            <h1 className="qz-sub-title">Pilih Mata<br />Pelajaran</h1>
            <p className="qz-sub-desc">Latihan soal HOTS berbasis kisi-kisi & PPT dosen</p>
          </div>

          {/* Disclaimer */}
          <div className="qz-disclaimer">
            <div className="qz-disclaimer-icon">⚠️</div>
            <div className="qz-disclaimer-text">
              <h4>DISCLAIMER</h4>
              <p>Soal dibuat penuh dengan bantuan AI (ChatGPT, Claude AI CLI, Gemini CLI) berdasarkan kisi-kisi dan PPT dosen. Jika ada yang kurang tepat, mohon dimaklumi. Tetap belajar dari sumber utama! 💪</p>
            </div>
          </div>

          {/* Mata Pelajaran Aktif */}
          <div className="qz-section-label">📖 Tersedia Sekarang</div>
          {SUBJECTS.filter(s => s.available).map(s => (
            <div
              key={s.key}
              className="qz-subject-card qz-subj-available"
              onClick={() => handleSelectSubject(s.key)}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleSelectSubject(s.key)}
            >
              <div className="qz-subj-icon" style={{ background: s.gradient }}>
                {s.icon}
              </div>
              <div className="qz-subj-info">
                <div className="qz-subj-name">{s.name}</div>
                <div className="qz-subj-meta">{s.abbr} · 100 soal belajar + 50 soal latihan</div>
                <div className="qz-subj-meta" style={{ marginTop: 3, opacity: 0.8 }}>{s.desc}</div>
              </div>
              <div className="qz-subj-right">
                <span className="qz-badge-avail">✓ Aktif</span>
                <span className="qz-subj-arrow">→</span>
              </div>
            </div>
          ))}

          {/* Coming Soon */}
          <div className="qz-coming-divider"><span>Segera Hadir</span></div>
          {SUBJECTS.filter(s => !s.available).map(s => (
            <div key={s.key} className="qz-subject-card qz-subj-locked">
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

          {/* AI Footer + Trakteer */}
          <div className="qz-ai-footer">
            🤖 Dibuat dengan bantuan AI:<br />
            <strong style={{ color: 'rgba(141,141,153,0.7)' }}>ChatGPT · Claude AI CLI · Gemini CLI</strong><br /><br />
            ☕ Kalau quiz ini membantu belajarmu, boleh traktir ya!<br />
            <a
              href={TRAKTEER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="qz-trakteer-btn"
              style={{ marginTop: 10, display: 'inline-flex' }}
            >
              ☕ Trakteer Kami
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════
     SCREEN 2: PILIH TIPE SOAL
  ════════════════════════════════════════════════════ */
  if (screen === 'quiz-type') {
    const subj = SUBJECTS.find(s => s.key === selectedSubject);
    return (
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-wrap">

          {/* Header */}
          <div className="qz-header">
            <button className="qz-back-btn" onClick={() => setScreen('subjects')}>← Mapel</button>
            <div className="qz-header-title">
              {subj?.icon} {subj?.name}
              <span className="qz-header-sub">{subj?.abbr}</span>
            </div>
          </div>

          {/* Hero */}
          <div className="qz-sub-hero" style={{ padding: '28px 0 20px' }}>
            <div className="qz-sub-logo">{subj?.icon} {subj?.abbr}</div>
            <h1 className="qz-sub-title">Pilih Tipe<br />Soal</h1>
            <p className="qz-sub-desc">Belajar materi mendalam atau uji kemampuan diri?</p>
          </div>

          {/* Quiz Type Cards */}
          {QUIZ_TYPES.map(qt => (
            <div
              key={qt.key}
              className={`qz-type-card ${qt.typeClass}`}
              onClick={() => handleSelectType(qt.key)}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleSelectType(qt.key)}
            >
              <div className="qz-type-icon">{qt.icon}</div>
              <div className="qz-type-info">
                <div className="qz-type-title">{qt.label}</div>
                <div
                  className="qz-type-badge"
                  style={{ background: qt.badgeBg, color: qt.badgeColor, border: `1px solid ${qt.badgeBorder}` }}
                >
                  {qt.badgeLabel}
                </div>
                <div className="qz-type-soal" style={{ color: qt.badgeColor }}>
                  {qt.soalCount} Soal
                </div>
                <div className="qz-type-desc">{qt.desc}</div>
              </div>
              <div style={{ alignSelf: 'center', color: 'var(--qz-primary)', fontSize: '1.2rem', marginLeft: 4 }}>→</div>
            </div>
          ))}

          {/* Info tip */}
          <div style={{ background: 'var(--qz-surface)', border: '1px solid var(--qz-border)', borderRadius: 12, padding: '14px 16px', marginTop: 8 }}>
            <p style={{ color: 'var(--qz-muted)', fontSize: '0.83rem', lineHeight: 1.65, margin: 0 }}>
              💡 <strong style={{ color: 'var(--qz-text)' }}>Tips:</strong> Mulai dari <em>Bahan Pembelajaran</em> untuk memahami materi, lalu uji diri dengan <em>Latihan Soal</em>. Ranking tersimpan <em>terpisah</em> untuk masing-masing tipe!
            </p>
          </div>

          <div className="qz-ai-footer" style={{ marginTop: 20 }}>
            🤖 ChatGPT · Claude AI CLI · Gemini CLI
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════
     SCREEN 3: QUIZ (Tabs: Mulai | Quiz | Ranking)
  ════════════════════════════════════════════════════ */
  return (
    <div className="qz-root">
      <style>{CSS}</style>
      <div className="qz-wrap">

        {/* Header */}
        <div className="qz-header">
          <button className="qz-back-btn" onClick={backToQuizType} aria-label="Kembali ke pilih tipe soal">
            ← Tipe Soal
          </button>
          <div className="qz-header-title">
            {subjectInfo?.icon} {subjectInfo?.abbr}
            <span className="qz-header-sub">{typeInfo?.label} · {TOTAL} Soal</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="qz-tabs" role="tablist">
          {[['mulai', '🏠 Mulai'], ['quiz', '📝 Quiz'], ['ranking', '🏆 Ranking']].map(([id, label]) => (
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
            <div className="qz-badge">
              {subjectInfo?.icon} {subjectInfo?.abbr?.toUpperCase()} · {typeInfo?.badgeLabel}
            </div>
            <h1 className="qz-h1">{TOTAL} Soal<br />Siap Untukmu</h1>
            <p className="qz-muted" style={{ marginBottom: 24 }}>
              {typeInfo?.key === '100'
                ? 'Bahan pembelajaran lengkap sesuai PPT dosen. Jawab, periksa, dan pahami setiap soal.'
                : 'Latihan soal pilihan untuk simulasi ujian. Tunjukkan kemampuan terbaikmu!'
              }
            </p>

            {/* Personal Best */}
            {personalBest && (
              <div className="qz-personal-best">
                <div className="qz-pb-emoji">🏅</div>
                <div className="qz-pb-body">
                  <div className="qz-pb-label">Rekor Terbaikmu</div>
                  <div className="qz-pb-sub">
                    {personalBest.correct}/{personalBest.total} benar · {formatDuration(personalBest.durationSec)}
                    {personalBest.date ? ` · ${personalBest.date}` : ''}
                  </div>
                </div>
                <div className="qz-pb-score">{personalBest.score}</div>
              </div>
            )}

            {/* Saved Progress */}
            {savedProgress && !quizStarted && (
              <div className="qz-resume-card">
                <h4>📌 Lanjutkan Quiz?</h4>
                <p>
                  Ada quiz yang belum selesai — soal ke-{(savedProgress.currentQ || 0) + 1} dari {TOTAL},
                  {' '}{Object.keys(savedProgress.answers || {}).length} soal sudah dijawab.
                </p>
                <div className="qz-resume-btns">
                  <button
                    className="qz-btn qz-btn-primary"
                    onClick={() => { const p = savedProgress; setSavedProgress(null); startQuiz(p); }}
                  >
                    ▶ Lanjutkan
                  </button>
                  <button
                    className="qz-btn qz-btn-secondary"
                    onClick={() => { clearProgress(); setSavedProgress(null); }}
                  >
                    ✕ Hapus
                  </button>
                </div>
              </div>
            )}

            {/* Mode */}
            <div className="qz-mode-options">
              {[
                { key: 'unlimited', label: '🟢 Unlimited', desc: 'Tanpa batas waktu. Cocok untuk belajar santai dan memahami materi.' },
                { key: 'hard',      label: '🔴 Timed Mode', desc: `Timer ${HARD_MODE_MINUTES} menit untuk ${TOTAL} soal. Uji kecepatan & ketepatan!` },
              ].map(m => (
                <div
                  key={m.key}
                  className={`qz-mode-card${mode === m.key ? ' qz-selected' : ''}`}
                  onClick={() => setMode(m.key)}
                  role="radio" aria-checked={mode === m.key} tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setMode(m.key)}
                >
                  <h4>{m.label}</h4>
                  <p>{m.desc}</p>
                </div>
              ))}
            </div>

            {/* Auth */}
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
                    <span className="qz-user-name">
                      Halo, {displayName}
                      {quizUser.isAnonymous ? ' (Anonim 🎭)' : ''}
                      {isAdminUser && <span className="qz-admin-tag">ADMIN</span>}
                    </span>
                  </div>
                  {authAlert && (
                    <div className={`qz-alert ${authErrType === 'err' ? 'qz-alert-err' : 'qz-alert-warn'}`}>{authAlert}</div>
                  )}
                  <button className="qz-btn qz-btn-secondary qz-btn-sm" onClick={handleSignOut} style={{ marginBottom: 0 }}>
                    Ganti Akun / Keluar
                  </button>
                </>
              ) : (
                <>
                  {authAlert && (
                    <div className={`qz-alert ${authErrType === 'inapp' ? 'qz-alert-warn' : 'qz-alert-err'}`}>{authAlert}</div>
                  )}
                  <button className="qz-btn qz-btn-secondary" style={{ marginBottom: 10 }} onClick={handleGoogleLogin}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" style={{ width: 18, height: 18, verticalAlign: 'middle', marginRight: 8 }} />
                    Masuk dengan Google
                  </button>
                  <div className="qz-divider">atau</div>
                  <input
                    className="qz-input"
                    type="text" maxLength={24}
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
                <li>Pilih mode quiz (Unlimited / Timed) di atas</li>
                <li>Pilih salah satu opsi jawaban</li>
                <li>Klik <strong>"Periksa Jawaban"</strong> untuk melihat hasil & penjelasan</li>
                <li>Jawaban <strong>terkunci</strong> setelah diperiksa — tidak bisa diubah</li>
                <li>Gunakan tombol navigator soal (📋) untuk loncat ke soal lain</li>
                <li>Skor terbaikmu tersimpan otomatis di leaderboard</li>
                <li>Login Google = data ingatan bertahan permanen ☁️</li>
                <li>Anonim = data tersimpan di cache browser 🖥️</li>
              </ol>
            </div>

            <button
              className="qz-btn qz-btn-primary"
              disabled={!quizUser}
              onClick={() => { clearProgress(); setSavedProgress(null); startQuiz(null); }}
            >
              {quizUser ? '🚀 Mulai Quiz' : '🔐 Login dulu untuk mulai'}
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
            ) : q ? (
              <>
                {/* Sticky bar */}
                <div className="qz-sticky-bar" aria-label="Statistik quiz">
                  {mode === 'hard' && (
                    <div className={`qz-stat-pill ${timerClass}`} aria-live="polite">
                      <span>{formatDuration(timeLeft)}</span>⏱️
                    </div>
                  )}
                  <div className="qz-stat-pill qz-correct"><span>{correctCount}</span>✅</div>
                  <div className="qz-stat-pill qz-wrong"><span>{wrongCount}</span>❌</div>
                  <div className="qz-stat-pill qz-score"><span>{currentScore}</span>⭐</div>
                </div>

                {/* Progress */}
                <div className="qz-progress-bar" role="progressbar" aria-valuenow={currentQ + 1} aria-valuemax={TOTAL}>
                  <div className="qz-progress-fill" style={{ width: `${((currentQ + 1) / TOTAL) * 100}%` }} />
                </div>
                <div className="qz-q-counter">Soal {currentQ + 1} / {TOTAL}</div>

                {/* Soal */}
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

                {/* Feedback */}
                {isChecked && (
                  <div className={`qz-feedback ${isCorrectAns ? 'qz-fb-correct' : 'qz-fb-incorrect'}`} aria-live="polite">
                    <h4>{isCorrectAns ? '✅ Jawaban Benar!' : '❌ Jawaban Salah'}</h4>
                    {!isCorrectAns && (
                      <p>Jawaban yang benar: <strong>{OPTION_LABELS[q.correct]}. {q.options[q.correct]}</strong></p>
                    )}
                    <p>{q.explanation}</p>
                  </div>
                )}

                {/* QRIS hint di soal terakhir */}
                {currentQ === TOTAL - 1 && isChecked && !qrisError && (
                  <div className="qz-last-q-hint">
                    <p>🎉 Soal terakhir! Kalau quiz ini membantu belajarmu, boleh traktir ya 🙏</p>
                    <a href={TRAKTEER_URL} target="_blank" rel="noopener noreferrer" className="qz-trakteer-btn">
                      ☕ Trakteer Kami
                    </a>
                  </div>
                )}

                {/* Nav buttons */}
                <div className="qz-nav-btns">
                  <button className="qz-btn qz-btn-secondary" onClick={goPrev} disabled={currentQ === 0} aria-label="Soal sebelumnya">
                    ← Kembali
                  </button>
                  {!isChecked ? (
                    <button className="qz-btn qz-btn-primary" onClick={checkAnswer} disabled={!isAnswered} aria-label="Periksa jawaban">
                      Periksa Jawaban
                    </button>
                  ) : (
                    <button className="qz-btn qz-btn-success" onClick={goNext} aria-label={currentQ < TOTAL - 1 ? 'Soal berikutnya' : 'Selesai quiz'}>
                      {currentQ < TOTAL - 1 ? 'Lanjut →' : '🏁 Selesai'}
                    </button>
                  )}
                </div>

                {/* Navigator toggle */}
                <button className="qz-nav-toggle" onClick={() => setShowNav(true)} aria-label="Buka navigator soal">
                  📋 {Object.keys(answers).length}/{TOTAL}
                </button>
              </>
            ) : null}
          </div>
        )}

        {/* ══ TAB: RANKING ══ */}
        {tab === 'ranking' && (
          <div role="tabpanel" aria-label="Tab Ranking" style={{ animation: 'qz-fade-up 0.4s ease' }}>
            <h2 className="qz-h2">🏆 Leaderboard</h2>
            <p style={{ color: 'var(--qz-muted)', fontSize: '0.82rem', marginBottom: 16 }}>
              {subjectInfo?.icon} {subjectInfo?.name} · {typeInfo?.label} ({TOTAL} Soal)
            </p>

            {/* ── ADMIN PANEL ── */}
            {isAdminUser && (
              <div className="qz-admin-panel">
                <div className="qz-admin-title">🔧 Admin Panel — Reset Ranking</div>
                <div className="qz-admin-btns">
                  {SUBJECTS.filter(s => s.available).flatMap(subj =>
                    QUIZ_TYPES.map(qt => (
                      <button
                        key={`${subj.key}_${qt.key}`}
                        className="qz-btn-danger"
                        onClick={() => handleAdminReset(subj.key, qt.key)}
                        disabled={adminStatus === 'resetting'}
                        title={`Reset leaderboard ${subj.name} · ${qt.label}`}
                      >
                        🗑️ {subj.abbr} · {qt.soalCount}s
                        {subj.key === selectedSubject && qt.key === selectedType ? ' ✓' : ''}
                      </button>
                    ))
                  )}
                </div>
                {adminStatus && (
                  <div
                    className={`qz-alert ${adminStatus === 'resetting' ? 'qz-alert-warn' : adminStatus === 'done' ? 'qz-alert-info' : 'qz-alert-err'}`}
                    style={{ marginTop: 10, marginBottom: 0 }}
                  >
                    {adminStatus === 'resetting' && '⏳ Menghapus data ranking...'}
                    {adminStatus === 'done'      && '✅ Ranking berhasil direset!'}
                    {adminStatus.startsWith('err') && '❌ Gagal: ' + adminStatus.replace('err:', '')}
                  </div>
                )}
              </div>
            )}

            {/* Statistik */}
            <div className="qz-stats-row">
              <div className="qz-stat-card">
                <h4>PESERTA</h4>
                <div className="qz-val">{lbStats.total}</div>
              </div>
              <div className="qz-stat-card">
                <h4>RATA-RATA SKOR</h4>
                <div className="qz-val">{lbStats.avgScore || '—'}</div>
              </div>
            </div>

            {/* List */}
            <div className="qz-card" data-lenis-prevent>
              {/* Pinned #1 */}
              <div className="qz-lb-row">
                <div className="qz-lb-rank qz-gold">👑</div>
                <div className="qz-lb-avatar" style={{ background: 'linear-gradient(135deg,#fde68a,#f59e0b)' }}>NS</div>
                <div style={{ flex: 1 }}>
                  <div className="qz-lb-name">{PINNED_TOP.name}</div>
                  <div className="qz-lb-meta">Skor Sempurna 🎉</div>
                </div>
                <div className="qz-lb-score">{PINNED_TOP.score}</div>
              </div>

              {lbLoading && <div className="qz-loading">Memuat ranking...</div>}
              {lbError   && <div className="qz-alert qz-alert-err" style={{ margin: 12 }}>{lbError}</div>}
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
                      {row.photoURL ? <img src={row.photoURL} alt={row.name} /> : row.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="qz-lb-name">
                        {row.name}
                        {isMe && <span className="qz-me-tag">Kamu</span>}
                      </div>
                      <div className="qz-lb-meta">{formatDuration(row.durationSec)} · {row.correct}/{row.total} benar</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <div className="qz-lb-score">{row.score}</div>
                      <span className="qz-badge-mode">{row.mode === 'hard' ? '🔴 Timed' : '🟢 Unlimited'}</span>
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

      {/* ══════ PORTALS ══════ */}

      {/* Navigator soal (bottom-sheet) */}
      {showNav && createPortal(
        <>
          <div className="qz-bs-overlay" onClick={() => setShowNav(false)} aria-hidden="true" />
          <div className="qz-bs-box" role="dialog" aria-label="Navigator soal" aria-modal="true" data-lenis-prevent>
            <div className="qz-bs-handle" />
            <h4 style={{ fontFamily: 'var(--qz-font-display)', color: 'var(--qz-text)', marginBottom: 14, fontSize: '1rem' }}>
              Navigator Soal — {Object.keys(answers).length}/{TOTAL} dijawab
            </h4>
            <div style={{ display: 'flex', gap: 8, fontSize: '0.75rem', color: 'var(--qz-muted)', marginBottom: 12 }}>
              <span style={{ color: 'var(--qz-success)' }}>■</span> Benar&nbsp;
              <span style={{ color: 'var(--qz-danger)' }}>■</span> Salah&nbsp;
              <span style={{ color: 'var(--qz-primary)' }}>■</span> Dipilih&nbsp;
              <span style={{ color: 'var(--qz-muted)' }}>■</span> Belum
            </div>
            <div className="qz-nav-grid">
              {activeQuestions.map((_, i) => (
                <button key={i} className={getNavCellClass(i)} onClick={() => goToQ(i)} aria-label={`Soal ${i + 1}`}>
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

            {isNewBest && (
              <div className="qz-new-best">
                🏅 Rekor baru! Skor tertinggimu untuk {subjectInfo?.abbr} · {typeInfo?.label}
              </div>
            )}

            <div className="qz-result-score">{finalStat.score}</div>
            <p className="qz-muted" style={{ marginBottom: 16 }}>dari {MAX_SCORE} poin maksimal</p>

            <div className="qz-result-details">
              <div className="qz-result-row"><span>Mata Pelajaran</span><span>{subjectInfo?.icon} {subjectInfo?.abbr}</span></div>
              <div className="qz-result-row"><span>Tipe Soal</span><span>{typeInfo?.label}</span></div>
              <div className="qz-result-row"><span>Benar</span><span>{finalStat.correct} / {TOTAL}</span></div>
              <div className="qz-result-row"><span>Salah</span><span>{TOTAL - finalStat.correct}</span></div>
              <div className="qz-result-row"><span>Waktu</span><span>{formatDuration(finalStat.durationSec)}</span></div>
              <div className="qz-result-row"><span>Mode</span><span>{finalStat.mode === 'hard' ? '🔴 Timed Mode' : '🟢 Unlimited'}</span></div>
              <div className="qz-result-row">
                <span>Status ranking</span>
                <span>
                  {saveStatus === 'saving'  && '⏳ Menyimpan...'}
                  {saveStatus === 'saved'   && '✅ Tersimpan di ranking'}
                  {saveStatus === 'notbest' && `📊 Skor terbaikmu: ${finalStat.score}`}
                  {saveStatus === ''        && '—'}
                </span>
              </div>
            </div>

            {/* Donasi QRIS + Trakteer */}
            {!qrisError && (
              <div className="qz-qris-card">
                <h4>☕ Dukung Quiz Ini</h4>
                <p>Kalau quiz ini bermanfaat buat belajarmu, boleh banget traktir lewat QRIS atau Trakteer. Berapa pun sangat berarti 🙏</p>
                <img
                  src={QRIS_IMAGE}
                  alt="QRIS donasi"
                  className="qz-qris-img"
                  onClick={() => setQrisLarge(true)}
                  onError={() => setQrisError(true)}
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href={QRIS_IMAGE} download="qris-quiz-keperawatan.jpg" className="qz-btn qz-btn-secondary qz-btn-inline qz-btn-sm">
                    💾 Simpan QRIS
                  </a>
                  <a href={TRAKTEER_URL} target="_blank" rel="noopener noreferrer" className="qz-trakteer-btn">
                    ☕ Trakteer
                  </a>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              <button className="qz-btn qz-btn-secondary" onClick={() => { setShowResult(false); setTab('ranking'); }}>
                🏆 Lihat Ranking
              </button>
              <button className="qz-btn qz-btn-primary" onClick={restartQuiz}>
                🔄 Coba Lagi
              </button>
              <button className="qz-btn qz-btn-secondary" onClick={backToMenu}>
                🏠 Kembali ke Menu
              </button>
            </div>

            {/* AI Disclaimer */}
            <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(141,141,153,0.45)', fontSize: '0.7rem', textAlign: 'center', lineHeight: 1.8 }}>
              🤖 Dibuat dengan bantuan AI: ChatGPT · Claude AI CLI · Gemini CLI
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* QRIS fullscreen */}
      {qrisLarge && createPortal(
        <div className="qz-qris-full" onClick={() => setQrisLarge(false)} role="dialog" aria-label="QRIS diperbesar" aria-modal="true">
          <img src={QRIS_IMAGE} alt="QRIS" />
        </div>,
        document.body
      )}
    </div>
  );
}
