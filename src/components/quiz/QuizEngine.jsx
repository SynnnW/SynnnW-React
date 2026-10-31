// src/components/quiz/QuizEngine.jsx
// ─────────────────────────────────────────────────────────────
// Quiz CBT Keperawatan — engine generik dipakai semua matkul Quiziz
// Mata Pelajaran: Kesehatan Global · Falsafah & Teori Keperawatan
// Auth: Google (persistent Firebase) + Anonim (cache localStorage)
// Leaderboard: Firestore per mapel per tipe soal
// Admin: aldokraksaan@gmail.com — reset ranking kapan saja
// Dibuat dengan bantuan AI: ChatGPT · Claude AI CLI · Gemini CLI 
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  signInAnonymously, onAuthStateChanged, signOut,
  setPersistence, browserLocalPersistence,
} from '@/lib/authCompat';
import {
  getFirestore, collection, doc, getDoc, setDoc,
  onSnapshot, query, orderBy, limit, serverTimestamp,
  getDocs, writeBatch, addDoc, increment,
} from '@/lib/firestoreCompat';
import { questions as allQ100 } from '../../data/100soal';
import { questions as allQ50 } from '../../data/50soal';
import SubjectComments from '../SubjectComments';
import SaranWebsite from '../SaranWebsite';
import CloudeeBubble from '../CloudeeBubble';
import Ico from '../Ico';
import Mascot from '../mascot/Mascot';
import ThemeToggle from '../ThemeToggle';
import QuizizRoom from './QuizizRoom';

/* ════════════════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════════════════ */
const ADMIN_EMAIL       = 'aldokraksaan@gmail.com';
const MAX_SCORE         = 2000;
// Durasi Timed Mode tergantung jumlah soal: 100 soal = 100 menit, 50 soal = 60 menit.
// Kalau TOTAL soal selain dua angka ini, fallback ke 100 menit.
const HARD_MODE_MINUTES_BY_TOTAL = { 100: 100, 50: 60 };
const hardModeMinutesFor = (total) => HARD_MODE_MINUTES_BY_TOTAL[total] ?? 100;
const PINNED_TOP        = { name: 'Mr Leo', score: 10000 };
const QRIS_IMAGE        = '/assets/img/qris.jpg';
const LS_NICK           = 'qz_nickname';

// ── Konfigurasi Mata Pelajaran ──
const SUBJECTS = [
  {
    key: 'kesglob',
    icon: '',
    name: 'Kesehatan Global',
    abbr: 'KesGlob',
    available: true,
    color: 'var(--ok)',
    gradient: 'linear-gradient(135deg,var(--ok),var(--ok))',
    desc: 'Epidemiologi, SDGs, sistem kesehatan dunia & isu kesehatan global',
    materiLabel: 'Link PPT Materi',
    materiUrl: 'https://drive.google.com/drive/folders/1BhECsi2o8spsa_Wbgb9K0p1RJJjUjgKb',
  },
  {
    key: 'ftk',
    icon: '',
    name: 'Falsafah & Teori Keperawatan',
    abbr: 'FTK',
    available: true,
    color: 'var(--accent-text)',
    gradient: 'var(--accent)',
    desc: 'Paradigma keperawatan, teori-teori keperawatan & konsep dasar profesi',
    materiLabel: 'Link Buku Materi',
    materiUrl: 'https://drive.google.com/drive/folders/1eIeKFaEAaFrhJqTpPZsWxoUSq42TmUQx',
  },
  {
    key: 'eng',
    icon: '🇬🇧',
    name: 'Bahasa Inggris',
    abbr: 'ENG',
    available: true,
    color: 'var(--info)',
    gradient: 'linear-gradient(135deg,var(--info),var(--info))',
    desc: 'Medical English & terminologi keperawatan internasional',
    materiLabel: 'Materi Belajar',
    materiUrl: '/quiziz/bahasainggris/materi',
    navigateTo: '/quiziz/bahasainggris/materi',
  },
];

// ── Konfigurasi Tipe Soal ──
const QUIZ_TYPES = [
  {
    key: '100',
    icon: '',
    label: 'Bahan Pembelajaran',
    soalCount: 200,
    desc: '200 soal komprehensif sesuai materi & PPT dosen. Cocok untuk belajar dan memahami konsep secara mendalam.',
    typeClass: 'qz-type-learn',
    badgeBg: 'color-mix(in srgb, var(--accent) 12%, transparent)',
    badgeBorder: 'color-mix(in srgb, var(--accent) 40%, transparent)',
    badgeColor: 'var(--accent-text)',
    badgeLabel: 'BELAJAR',
  },
  {
    key: '50',
    icon: '',
    label: 'Latihan Soal',
    soalCount: 50,
    desc: '50 soal pilihan untuk simulasi ujian. Ukur kemampuanmu dan persiapkan diri sebelum ujian sesungguhnya!',
    typeClass: 'qz-type-practice',
    badgeBg: 'color-mix(in srgb, var(--warn) 12%, transparent)',
    badgeBorder: 'color-mix(in srgb, var(--warn) 40%, transparent)',
    badgeColor: 'var(--warn)',
    badgeLabel: 'LATIHAN',
  },
];

/* ════════════════════════════════════════════════════
   FIREBASE — instance ke-2 khusus quiz
════════════════════════════════════════════════════ */
const quizAuth = getAuth();
const quizDb   = getFirestore();

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

/** Nama koleksi Firestore untuk leaderboard
 *  - Keperawatan: lb_kesglob_p100 / lb_kesglob_l50 / lb_ftk_p100 / lb_ftk_l50
 *  - Bahasa Inggris: setiap tipe soal punya koleksi sendiri
 *    (grammar/vocabulary/reading/semua/uts tidak bisa dicampur rankingnya)
 */
const getLbKey = (subject, type) => {
  if (!subject || !type) return null;
  if (subject === 'eng') return `lb_eng_${type}`; // lb_eng_grammar, lb_eng_vocabulary, dsb.
  return `lb_${subject}_${type === '100' ? 'p100' : 'l50'}`;
};

/** Fisher-Yates shuffle (returns new array) */
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Ambil soal berdasar mata pelajaran + tipe, map correctIndex → correct
 *  Filter by ID range (bukan slice by index) agar KesGlob dan FTK tidak pernah tercampur
 *  100soal.js: KesGlob id 1-100 · FTK id 101-200
 *  50soal.js:  KesGlob id 1-50  · FTK id 51-100
 */
const getQs = (subject, type) => {
  try {
    const mapQ = (q) => ({ ...q, correct: q.correctIndex });
    if (type === '100') {
      const src = Array.isArray(allQ100) ? allQ100 : [];
      if (subject === 'kesglob') {
        return src.filter(q => q.id >= 1 && q.id <= 100).map(mapQ);
      }
      return src.filter(q => q.id >= 101 && q.id <= 200).map(mapQ);
    }
    const src = Array.isArray(allQ50) ? allQ50 : [];
    if (subject === 'kesglob') {
      return src.filter(q => q.id >= 1 && q.id <= 50).map(mapQ);
    }
    return src.filter(q => q.id >= 51 && q.id <= 100).map(mapQ);
  } catch { return []; }
};

// Prefix di-inject dari prop storagePrefix saat komponen mount
// (fungsi ini di-override di dalam komponen — lihat QuizEngine body)
const lsProgKey = (pfx, sub, typ) => `${pfx}_prog_${sub}_${typ}`;
const lsBestKey = (pfx, sub, typ) => `${pfx}_best_${sub}_${typ}`;

const loadBest = (pfx, sub, typ) => {
  try { return JSON.parse(localStorage.getItem(lsBestKey(pfx, sub, typ)) || 'null'); }
  catch { return null; }
};

const updateBest = (pfx, sub, typ, stat) => {
  try {
    const ex = loadBest(pfx, sub, typ);
    if (!ex || stat.score > ex.score ||
        (stat.score === ex.score && stat.durationSec < ex.durationSec)) {
      localStorage.setItem(lsBestKey(pfx, sub, typ), JSON.stringify({
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
  --qz-bg: var(--nm-bg);
  --qz-surface: var(--nm-bg);
  --qz-surface2: color-mix(in srgb, var(--nm-bg) 93%, var(--text));
  --qz-border: var(--border2);
  --qz-text: var(--text);
  --qz-muted: var(--text-dim);
  --qz-primary: var(--accent);
  --qz-primary2: var(--accent-text);
  --qz-success: var(--ok);
  --qz-danger: var(--bad);
  --qz-warning: var(--warn);
  --qz-radius: var(--r-m);
  --qz-font: var(--font-body);
  --qz-font-display: var(--font-body);
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
  border-radius:2px; padding:8px 14px; font-size:0.82rem;
  cursor:pointer; font-family:var(--qz-font); transition:all 0.2s; white-space:nowrap;
}
.qz-back-btn:hover { color:var(--qz-text); border-color:var(--qz-primary); }

/* ── Tabs ── */
.qz-tabs {
  display:flex; gap:6px; background:rgba(0,0,0,0.25);
  border:1px solid var(--qz-border); border-radius:2px; padding:6px; margin-bottom:20px;
}
.qz-tab {
  flex:1; padding:11px 6px; background:none; border:none; border-radius:2px;
  cursor:pointer; font:600 0.88rem var(--qz-font); color:var(--qz-muted); transition:all 0.2s;
}
.qz-tab:hover { color:var(--qz-text); background:var(--qz-surface); }
.qz-tab.qz-active {
  color:var(--on-accent);
  background:var(--accent);
  box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent);
}

/* ── Card ── */
.qz-card {
  background:var(--qz-surface); border:1px solid var(--qz-border);
  border-radius:var(--qz-radius);
box-shadow:0 20px 50px rgba(0,0,0,0.4);
}

/* ── Typography ── */
.qz-badge {
  display:inline-block; font-size:0.7rem; letter-spacing:0.2em;
  color:var(--qz-primary2); border:1px solid var(--qz-border);
  background:var(--qz-surface); padding:6px 12px; border-radius:2px; margin-bottom:16px;
}
.qz-h1 {
  font-family:var(--qz-font-display); font-size:clamp(1.7rem,6vw,2.6rem); font-weight:700;
  line-height:1.1; letter-spacing:-0.03em;
  background:var(--accent);
  -webkit-background-clip:text; background-clip:text; color:transparent; margin-bottom:12px;
}
.qz-h2 { font-family:var(--qz-font-display); font-size:1.5rem; font-weight:700; color:var(--qz-text); margin-bottom:12px; }
.qz-muted { color:var(--qz-muted); line-height:1.65; font-size:0.95rem; }

/* ── Buttons ── */
.qz-btn {
  display:block; width:100%; min-height:52px; padding:14px 20px;
  border:1px solid transparent; border-radius:2px; cursor:pointer;
  font:600 0.95rem var(--qz-font); transition:all 0.22s; color:var(--text);
  text-align:center; background:var(--qz-surface2);
}
.qz-btn:disabled { opacity:0.45; cursor:not-allowed; transform:none!important; box-shadow:none!important; }
.qz-btn-primary { background:var(--accent); box-shadow:0 8px 24px color-mix(in srgb, var(--accent) 35%, transparent); }
.qz-btn-primary:not(:disabled):hover { transform:translateY(-2px); box-shadow:0 12px 32px color-mix(in srgb, var(--accent) 55%, transparent); }
.qz-btn-secondary { background:var(--qz-surface2); border-color:var(--qz-border); color:var(--qz-text); }
.qz-btn-secondary:not(:disabled):hover { background:color-mix(in srgb, var(--nm-bg) 88%, var(--text)); transform:translateY(-1px); }
.qz-btn-success { background:linear-gradient(135deg,var(--ok),var(--ok)); color:var(--on-accent); box-shadow:0 8px 24px color-mix(in srgb, var(--ok) 30%, transparent); }
.qz-btn-success:not(:disabled):hover { transform:translateY(-2px); }
.qz-btn-sm { min-height:40px; padding:8px 16px; font-size:0.85rem; width:auto; display:inline-block; border-radius:2px; }
.qz-btn-inline { display:inline-block; width:auto; min-height:44px; }

/* ── Mode cards ── */
.qz-mode-options { display:flex; flex-direction:column; gap:10px; margin-bottom:24px; }
.qz-mode-card {
  padding:18px; background:var(--qz-surface); border:2px solid var(--qz-border);
  border-radius:2px; cursor:pointer; transition:all 0.2s; text-align:left;
}
.qz-mode-card:hover { border-color:color-mix(in srgb, var(--accent) 50%, transparent); }
.qz-mode-card.qz-selected { border-color:var(--qz-primary); background:color-mix(in srgb, var(--accent) 12%, transparent); }
.qz-mode-card h4 { font-family:var(--qz-font-display); font-size:1rem; color:var(--qz-text); margin-bottom:4px; }
.qz-mode-card p { color:var(--qz-muted); font-size:0.85rem; line-height:1.5; }

/* ── Auth ── */
.qz-auth-section {
  background:var(--qz-surface); border:1px solid var(--qz-border);
  border-radius:2px; padding:20px; margin-bottom:20px;
}
.qz-auth-section h4 { font-size:0.88rem; color:var(--qz-muted); margin-bottom:14px; letter-spacing:0.05em; text-transform:uppercase; }
.qz-input {
  width:100%; padding:13px 16px; background:rgba(0,0,0,0.35); color:var(--qz-text);
  border:1px solid var(--qz-border); border-radius:2px; font:1rem var(--qz-font);
  transition:all 0.2s; margin-bottom:10px;
}
.qz-input::placeholder { color:var(--text-faint); }
.qz-input:focus { outline:none; border-color:var(--qz-primary); box-shadow:0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent); }
.qz-user-info {
  display:flex; align-items:center; gap:10px; padding:12px;
  background:color-mix(in srgb, var(--accent) 8%, transparent); border:1px solid color-mix(in srgb, var(--accent) 25%, transparent);
  border-radius:2px; margin-bottom:12px;
}
.qz-avatar {
  width:36px; height:36px; border-radius:50%; object-fit:cover;
  background:var(--accent);
  display:flex; align-items:center; justify-content:center;
  font-weight:700; font-size:0.85rem; color:var(--on-accent); flex-shrink:0;
}
.qz-user-name { flex:1; font-size:0.95rem; color:var(--qz-text); font-weight:600; }
.qz-admin-tag { font-size:0.65rem; background:var(--qz-danger); color:var(--on-accent); padding:2px 7px; border-radius:5px; margin-left:6px; font-weight:700; }
.qz-divider { text-align:center; color:var(--qz-muted); font-size:0.8rem; margin:12px 0; position:relative; }
.qz-divider::before,.qz-divider::after { content:''; position:absolute; top:50%; width:calc(50% - 20px); height:1px; background:var(--qz-border); }
.qz-divider::before { left:0; }
.qz-divider::after { right:0; }

/* ── How to ── */
.qz-howto { background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:2px; padding:18px; margin-top:20px; margin-bottom:20px; }
.qz-howto h4 { color:var(--qz-primary2); font-size:0.95rem; margin-bottom:8px; }
.qz-howto ol { color:var(--qz-muted); padding-left:18px; font-size:0.88rem; line-height:1.8; }

/* ── Quiz sticky bar ── */
.qz-sticky-bar {
  position:sticky; top:57px; z-index:15; display:flex; gap:8px;
  background:color-mix(in srgb, var(--nm-lo) 92%, transparent);
padding:10px 0;
  margin-bottom:16px; border-bottom:1px solid var(--qz-border);
}
.qz-stat-pill { flex:1; text-align:center; padding:8px 4px; background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:2px; font-size:0.75rem; }
.qz-stat-pill span { display:block; font-size:1.1rem; font-weight:700; font-family:var(--qz-font-display); font-variant-numeric:tabular-nums; }
.qz-stat-pill.qz-timer span { color:var(--qz-primary2); }
.qz-stat-pill.qz-correct span { color:var(--qz-success); }
.qz-stat-pill.qz-wrong span { color:var(--qz-danger); }
.qz-stat-pill.qz-score span { background:var(--accent); -webkit-background-clip:text; background-clip:text; color:transparent; }
.qz-stat-pill.qz-timer-warn span { color:var(--qz-warning); }
.qz-stat-pill.qz-timer-danger span { color:var(--qz-danger); animation:qz-pulse 1s ease-in-out infinite; }
.qz-stat-pill.qz-timer-paused span { color:var(--qz-muted); }
.qz-paused-banner { background:color-mix(in srgb, var(--accent) 10%, transparent); border:1px solid color-mix(in srgb, var(--accent) 30%, transparent); color:var(--qz-primary); border-radius:2px; padding:9px 14px; font-size:0.83rem; font-weight:600; text-align:center; margin-bottom:10px; animation:qz-fade-up 0.3s ease; }

/* ── Progress bar ── */
.qz-progress-bar { background:var(--qz-surface2); height:5px; border-radius:2px; margin-bottom:14px; overflow:hidden; }
.qz-progress-fill { height:100%; background:var(--accent); border-radius:2px; transition:width 0.35s ease; box-shadow:0 0 10px color-mix(in srgb, var(--accent) 60%, transparent); }
.qz-q-counter { text-align:right; color:var(--qz-muted); font-size:0.85rem; margin-bottom:10px; font-variant-numeric:tabular-nums; }

/* ── Question & Options ── */
.qz-passage { background:var(--qz-surface2); border:1px solid var(--qz-border); border-left:3px solid var(--qz-primary2); border-radius:2px; padding:18px 20px; margin-bottom:14px; }
.qz-passage-label { font-size:0.78rem; font-weight:700; color:var(--qz-primary); letter-spacing:0.06em; text-transform:uppercase; margin-bottom:10px; }
.qz-passage-text { font-size:0.91rem; line-height:1.75; color:var(--qz-text); white-space:pre-wrap; }
.qz-q-text { background:var(--qz-surface); padding:20px; border-radius:2px; margin-bottom:18px; border:1px solid var(--qz-border); border-left:3px solid var(--qz-primary); font-weight:500; line-height:1.65; font-size:1rem; }
.qz-options { display:flex; flex-direction:column; gap:9px; }
.qz-option { display:flex; align-items:flex-start; gap:12px; padding:15px 16px; background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:2px; cursor:pointer; transition:all 0.18s; line-height:1.5; font-size:0.93rem; text-align:left; width:100%; color:var(--qz-text); font-family:var(--qz-font); min-height:52px; }
.qz-option:not(.qz-locked):hover { border-color:color-mix(in srgb, var(--accent) 50%, transparent); background:var(--qz-surface2); transform:translateX(3px); }
.qz-option.qz-locked { cursor:default; }
.qz-option-label { font-weight:700; color:var(--qz-muted); flex-shrink:0; font-size:0.85rem; margin-top:1px; min-width:18px; }
.qz-option.qz-sel { border-color:var(--qz-primary); background:color-mix(in srgb, var(--accent) 12%, transparent); box-shadow:0 0 0 2px color-mix(in srgb, var(--accent) 10%, transparent); }
.qz-option.qz-sel .qz-option-label { color:var(--qz-primary); }
.qz-option.qz-correct { border-color:var(--qz-success); background:color-mix(in srgb, var(--ok) 10%, transparent); }
.qz-option.qz-correct .qz-option-label { color:var(--qz-success); }
.qz-option.qz-incorrect { border-color:var(--qz-danger); background:color-mix(in srgb, var(--bad) 10%, transparent); }
.qz-option.qz-incorrect .qz-option-label { color:var(--qz-danger); }

/* ── Feedback ── */
.qz-feedback { margin-top:16px; padding:16px 18px; border-radius:2px; border:1px solid var(--qz-border); animation:qz-fade-up 0.3s ease; }
.qz-feedback.qz-fb-correct { background:color-mix(in srgb, var(--ok) 8%, transparent); border-color:color-mix(in srgb, var(--ok) 40%, transparent); }
.qz-feedback.qz-fb-incorrect { background:color-mix(in srgb, var(--bad) 8%, transparent); border-color:color-mix(in srgb, var(--bad) 40%, transparent); }
.qz-feedback h4 { font-family:var(--qz-font-display); font-size:1.05rem; margin-bottom:6px; }
.qz-fb-correct h4 { color:var(--qz-success); }
.qz-fb-incorrect h4 { color:var(--qz-danger); }
.qz-feedback p { color:var(--text-dim); font-size:0.9rem; line-height:1.6; margin-top:4px; }

/* ── Nav buttons ── */
.qz-nav-btns { display:flex; gap:10px; margin-top:20px; }
.qz-nav-btns .qz-btn { flex:1; }

/* ── Alerts ── */
.qz-alert { padding:12px 16px; border-radius:2px; font-size:0.9rem; margin-bottom:14px; animation:qz-fade-up 0.25s ease; }
.qz-alert-info { background:color-mix(in srgb, var(--accent) 10%, transparent); border:1px solid color-mix(in srgb, var(--accent) 30%, transparent); color:var(--qz-primary2); }
.qz-alert-warn { background:color-mix(in srgb, var(--warn) 10%, transparent); border:1px solid color-mix(in srgb, var(--warn) 30%, transparent); color:var(--qz-warning); }
.qz-alert-err { background:color-mix(in srgb, var(--bad) 10%, transparent); border:1px solid color-mix(in srgb, var(--bad) 30%, transparent); color:var(--qz-danger); line-height:1.5; }

/* ── Nav toggle (floating btn) ── */
.qz-nav-toggle { position:fixed; bottom:20px; right:20px; z-index:30; background:var(--accent); color:var(--on-accent); border:none; border-radius:2px; padding:12px 18px; font:600 0.85rem var(--qz-font); cursor:pointer; box-shadow:0 8px 24px color-mix(in srgb, var(--accent) 40%, transparent); }

/* ── Leaderboard ── */
.qz-stats-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px; }
.qz-stat-card { background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:2px; padding:16px; text-align:center; }
.qz-stat-card h4 { color:var(--qz-muted); font-size:0.72rem; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:8px; }
.qz-stat-card .qz-val { font-family:var(--qz-font-display); font-size:1.9rem; font-weight:700; background:var(--accent); -webkit-background-clip:text; background-clip:text; color:transparent; }
.qz-lb-row { display:flex; align-items:center; gap:10px; padding:12px; border-bottom:1px solid var(--qz-border); }
.qz-lb-row:last-child { border-bottom:none; }
.qz-lb-row.qz-me { background:color-mix(in srgb, var(--accent) 8%, transparent); border-radius:2px; border:1px solid color-mix(in srgb, var(--accent) 20%, transparent); margin:2px 0; }
.qz-lb-rank { display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:2px; background:var(--qz-surface2); font-weight:700; font-size:0.85rem; flex-shrink:0; }
.qz-lb-rank.qz-gold { background:var(--accent); color:#2a1a00; }
.qz-lb-rank.qz-silver { background:linear-gradient(135deg,#f1f5f9,#94a3b8); color:#111827; }
.qz-lb-rank.qz-bronze { background:linear-gradient(135deg,#fdba74,#c2410c); color:#1f0b00; }
.qz-lb-avatar { width:34px; height:34px; border-radius:50%; background:var(--accent); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.78rem; color:var(--on-accent); overflow:hidden; flex-shrink:0; }
.qz-lb-avatar img { width:100%; height:100%; object-fit:cover; }
.qz-lb-name { flex:1; font-size:0.9rem; font-weight:600; }
.qz-lb-meta { font-size:0.72rem; color:var(--qz-muted); margin-top:2px; }
.qz-lb-score { font-family:var(--qz-font-display); font-weight:700; font-size:1rem; background:var(--accent); -webkit-background-clip:text; background-clip:text; color:transparent; white-space:nowrap; }
.qz-badge-mode { font-size:0.68rem; padding:2px 7px; border-radius:2px; border:1px solid var(--qz-border); background:var(--qz-surface); color:var(--qz-muted); flex-shrink:0; }
.qz-me-tag { font-size:0.65rem; background:var(--qz-primary); color:var(--on-accent); padding:2px 6px; border-radius:6px; margin-left:4px; }
.qz-empty { text-align:center; padding:40px 20px; color:var(--qz-muted); font-size:0.9rem; }
.qz-loading { text-align:center; padding:40px 20px; color:var(--qz-muted); animation:qz-pulse 1.2s ease-in-out infinite; }

/* ── Animations ── */
@keyframes qz-fade-up { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
@keyframes qz-slide-up { from { opacity:0; transform:translateY(40px) scale(0.97); } to { opacity:1; transform:none; } }
@keyframes qz-pulse { 0%,100% { opacity:1; } 50% { opacity:0.55; } }

/* ── Modal overlay ── */
.qz-modal-overlay { position:fixed; inset:0; background:color-mix(in srgb, var(--nm-lo) 82%, transparent);display:flex; align-items:flex-end; justify-content:center; z-index:calc(var(--z-modal) + 5); padding:0; }
.qz-modal-box { background:var(--nm-bg); border:1px solid var(--qz-border); border-radius:2px 24px 0 0; padding:32px 24px 40px; width:100%; max-width:520px; max-height:90dvh; overflow-y:auto; text-align:center; box-shadow:0 0 60px color-mix(in srgb, var(--accent) 20%, transparent); animation:qz-slide-up 0.4s ease; }
@media (prefers-reduced-motion:reduce) { .qz-modal-box,.qz-bs-box,.qz-feedback { animation:none; } .qz-progress-fill { transition:none; } }
.qz-result-score { font-family:var(--qz-font-display); font-size:3.5rem; font-weight:700; background:var(--accent); -webkit-background-clip:text; background-clip:text; color:transparent; line-height:1; margin:8px 0 4px; }
.qz-result-details { background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:2px; padding:14px 18px; margin:18px 0; text-align:left; }
.qz-result-row { display:flex; justify-content:space-between; padding:6px 0; color:var(--text-dim); font-size:0.9rem; border-bottom:1px solid var(--border); }
.qz-result-row:last-child { border-bottom:none; }
.qz-result-row span:last-child { font-weight:600; color:var(--qz-text); }

/* ── QRIS ── */
.qz-qris-card { background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:2px; padding:18px; margin:16px 0; text-align:center; }
.qz-qris-card h4 { color:var(--qz-text); margin-bottom:8px; font-family:var(--qz-font-display); font-size:1rem; }
.qz-qris-card p { color:var(--qz-muted); font-size:0.85rem; line-height:1.55; margin-bottom:14px; }
.qz-qris-img { width:180px; max-width:100%; border-radius:2px; cursor:pointer; transition:transform 0.2s; display:block; margin:0 auto 12px; }
.qz-qris-img:hover { transform:scale(1.03); }
.qz-qris-full { position:fixed; inset:0; background:rgba(0,0,0,0.9); display:flex; align-items:center; justify-content:center; z-index:var(--z-overlay); cursor:zoom-out; padding:20px; }
.qz-qris-full img { max-width:100%; max-height:90dvh; border-radius:2px; }

/* ── Bottom-sheet ── */
.qz-bs-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:var(--z-modal); }
.qz-bs-box { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:520px; background:var(--nm-bg); border:1px solid var(--qz-border); border-radius:2px 20px 0 0; padding:20px 16px 32px; z-index:calc(var(--z-modal) + 1); max-height:65dvh; overflow-y:auto; animation:qz-slide-up 0.3s ease; }
.qz-bs-handle { width:40px; height:4px; background:var(--qz-border); border-radius:2px; margin:0 auto 16px; }
.qz-nav-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(44px,1fr)); gap:8px; }
.qz-nav-cell { aspect-ratio:1; display:flex; align-items:center; justify-content:center; border-radius:2px; border:1px solid var(--qz-border); background:var(--qz-surface); font-weight:700; font-size:0.85rem; cursor:pointer; transition:all 0.15s; color:var(--qz-muted); }
.qz-nav-cell:hover { border-color:var(--qz-primary); color:var(--qz-text); }
.qz-nav-cell.qz-nc-correct { background:color-mix(in srgb, var(--ok) 18%, transparent); border-color:var(--qz-success); color:var(--qz-success); }
.qz-nav-cell.qz-nc-wrong { background:color-mix(in srgb, var(--bad) 18%, transparent); border-color:var(--qz-danger); color:var(--qz-danger); }
.qz-nav-cell.qz-nc-answered { background:color-mix(in srgb, var(--accent) 12%, transparent); border-color:color-mix(in srgb, var(--accent) 40%, transparent); color:var(--qz-primary); }
.qz-nav-cell.qz-nc-active { border-color:var(--qz-primary); background:color-mix(in srgb, var(--accent) 20%, transparent); color:var(--on-accent); box-shadow:0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent); }

/* ── Resume card ── */
.qz-resume-card { background:color-mix(in srgb, var(--accent) 8%, transparent); border:1px solid color-mix(in srgb, var(--accent) 30%, transparent); border-radius:2px; padding:18px; margin-bottom:18px; }
.qz-resume-card h4 { color:var(--qz-primary); margin-bottom:8px; font-family:var(--qz-font-display); }
.qz-resume-card p { color:var(--qz-muted); font-size:0.88rem; margin-bottom:14px; }
.qz-resume-btns { display:flex; gap:8px; }
.qz-resume-btns .qz-btn { flex:1; }

/* ════ SUBJECTS SCREEN ════ */
.qz-sub-hero { text-align:center; padding:48px 0 32px; }
.qz-sub-logo { display:inline-flex; align-items:center; gap:8px; background:color-mix(in srgb, var(--accent) 10%, transparent); border:1px solid color-mix(in srgb, var(--accent) 30%, transparent); border-radius:2px; padding:7px 16px; font-size:0.75rem; font-weight:700; color:var(--qz-primary); letter-spacing:0.12em; margin-bottom:22px; }
.qz-sub-title { font-family:var(--qz-font-display); font-size:clamp(2rem,8vw,2.8rem); font-weight:900; line-height:1.1; margin-bottom:12px; background:var(--accent); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.qz-sub-desc { color:var(--qz-muted); font-size:0.95rem; line-height:1.6; }
.qz-disclaimer { background:color-mix(in srgb, var(--warn) 6%, transparent); border:1px solid color-mix(in srgb, var(--warn) 25%, transparent); border-radius:var(--qz-radius); padding:16px 18px; margin-bottom:28px; display:flex; gap:14px; align-items:flex-start; }
.qz-disclaimer-icon { font-size:1.3rem; flex-shrink:0; margin-top:2px; }
.qz-disclaimer-text h4 { color:var(--qz-warning); font-size:0.8rem; font-weight:700; margin-bottom:6px; font-family:var(--qz-font-display); }
.qz-disclaimer-text p { color:color-mix(in srgb, var(--warn) 70%, transparent); font-size:0.8rem; line-height:1.6; margin:0; }
.qz-section-label { font-size:0.72rem; font-weight:700; color:var(--qz-muted); letter-spacing:0.15em; text-transform:uppercase; margin-bottom:12px; }
.qz-coming-divider { display:flex; align-items:center; gap:10px; margin:22px 0 14px; }
.qz-coming-divider span { font-size:0.72rem; color:var(--qz-muted); font-weight:600; letter-spacing:0.12em; text-transform:uppercase; white-space:nowrap; }
.qz-coming-divider::before,.qz-coming-divider::after { content:''; flex:1; height:1px; background:var(--qz-border); }
.qz-subject-card { display:flex; align-items:center; gap:14px; background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:var(--qz-radius); padding:18px; margin-bottom:10px; cursor:default; transition:all 0.2s; position:relative; overflow:hidden; -webkit-tap-highlight-color:transparent; }
.qz-subject-card.qz-subj-available { border-color:color-mix(in srgb, var(--accent) 35%, transparent); background:color-mix(in srgb, var(--accent) 6%, transparent); cursor:pointer; }
.qz-subject-card.qz-subj-available:hover { border-color:color-mix(in srgb, var(--accent) 60%, transparent); background:color-mix(in srgb, var(--accent) 11%, transparent); transform:translateY(-2px); box-shadow:0 8px 30px color-mix(in srgb, var(--accent) 20%, transparent); }
.qz-subject-card.qz-subj-locked { opacity:0.5; }
.qz-subj-icon { width:50px; height:50px; border-radius:2px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; flex-shrink:0; }
.qz-subj-info { flex:1; min-width:0; }
.qz-subj-name { font-family:var(--qz-font-display); font-weight:700; font-size:0.97rem; margin-bottom:3px; color:var(--qz-text); }
.qz-subj-meta { font-size:0.78rem; color:var(--qz-muted); }
.qz-subj-right { display:flex; flex-direction:column; align-items:flex-end; gap:5px; flex-shrink:0; }
.qz-badge-avail { background:color-mix(in srgb, var(--ok) 12%, transparent); border:1px solid color-mix(in srgb, var(--ok) 40%, transparent); color:var(--qz-success); font-size:0.7rem; font-weight:700; padding:3px 10px; border-radius:2px; }
.qz-badge-soon { background:var(--qz-surface); border:1px solid var(--qz-border); color:var(--qz-muted); font-size:0.7rem; font-weight:600; padding:3px 10px; border-radius:2px; }
.qz-subj-arrow { color:var(--qz-primary); font-size:1.1rem; font-weight:700; }

/* ════ QUIZ TYPE SCREEN ════ */
.qz-type-card { display:flex; align-items:flex-start; gap:16px; border:2px solid var(--qz-border); border-radius:var(--qz-radius); padding:20px; margin-bottom:12px; cursor:pointer; transition:all 0.2s; -webkit-tap-highlight-color:transparent; }
.qz-type-learn { border-color:color-mix(in srgb, var(--accent) 35%, transparent); background:color-mix(in srgb, var(--accent) 4%, transparent); }
.qz-type-learn:hover { border-color:color-mix(in srgb, var(--accent) 65%, transparent); background:color-mix(in srgb, var(--accent) 9%, transparent); transform:translateY(-2px); box-shadow:0 8px 30px color-mix(in srgb, var(--accent) 12%, transparent); }
.qz-type-practice { border-color:color-mix(in srgb, var(--warn) 35%, transparent); background:color-mix(in srgb, var(--warn) 4%, transparent); }
.qz-type-practice:hover { border-color:color-mix(in srgb, var(--warn) 65%, transparent); background:color-mix(in srgb, var(--warn) 9%, transparent); transform:translateY(-2px); box-shadow:0 8px 30px color-mix(in srgb, var(--warn) 12%, transparent); }
.qz-type-icon { font-size:2.2rem; flex-shrink:0; margin-top:2px; }
.qz-type-info { flex:1; }
.qz-type-title { font-family:var(--qz-font-display); font-weight:700; font-size:1.05rem; color:var(--qz-text); margin-bottom:6px; }
.qz-type-badge { display:inline-block; font-size:0.68rem; font-weight:700; padding:3px 10px; border-radius:2px; margin-bottom:6px; }
.qz-type-soal { font-size:0.84rem; font-weight:600; margin-bottom:6px; }
.qz-type-desc { color:var(--qz-muted); font-size:0.83rem; line-height:1.55; }

/* ════ ADMIN PANEL ════ */
.qz-admin-panel { background:color-mix(in srgb, var(--bad) 5%, transparent); border:1px solid color-mix(in srgb, var(--bad) 20%, transparent); border-radius:2px; padding:16px; margin-bottom:20px; }
.qz-admin-title { color:var(--qz-danger); font-family:var(--qz-font-display); font-size:0.8rem; font-weight:700; margin-bottom:12px; letter-spacing:0.08em; text-transform:uppercase; display:flex; align-items:center; gap:6px; }
.qz-admin-btns { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:0; }
.qz-btn-danger { background:color-mix(in srgb, var(--bad) 10%, transparent); border:1px solid color-mix(in srgb, var(--bad) 35%, transparent); color:var(--qz-danger); font-size:0.78rem; font-weight:600; min-height:34px; padding:6px 12px; width:auto; display:inline-flex; align-items:center; gap:5px; border-radius:2px; cursor:pointer; transition:all 0.2s; font-family:var(--qz-font); }
.qz-btn-danger:hover:not(:disabled) { background:color-mix(in srgb, var(--bad) 20%, transparent); }
.qz-btn-danger:disabled { opacity:0.45; cursor:not-allowed; }

/* ════ PERSONAL BEST ════ */
.qz-personal-best { background:color-mix(in srgb, var(--accent) 6%, transparent); border:1px solid color-mix(in srgb, var(--accent) 20%, transparent); border-radius:2px; padding:12px 16px; margin-bottom:14px; display:flex; align-items:center; gap:12px; }
.qz-pb-emoji { font-size:1.4rem; flex-shrink:0; }
.qz-pb-body { flex:1; }
.qz-pb-label { font-size:0.72rem; color:var(--qz-muted); text-transform:uppercase; letter-spacing:0.08em; font-weight:700; }
.qz-pb-sub { font-size:0.78rem; color:var(--qz-muted); margin-top:2px; }
.qz-pb-score { font-family:var(--qz-font-display); font-size:1.5rem; font-weight:700; color:var(--qz-primary2); }

/* ════ NEW BEST BANNER ════ */
.qz-new-best { background:linear-gradient(135deg,color-mix(in srgb, var(--ok) 12%, transparent),color-mix(in srgb, var(--accent) 8%, transparent)); border:1px solid color-mix(in srgb, var(--ok) 40%, transparent); border-radius:2px; padding:10px 16px; margin:10px 0; font-size:0.88rem; color:var(--qz-success); font-weight:600; animation:qz-fade-up 0.3s ease; }

/* ════ AI FOOTER + TRAKTEER ════ */
.qz-ai-footer { text-align:center; padding:20px 0 4px; color:color-mix(in srgb, var(--text-dim) 45%, transparent); font-size:0.72rem; line-height:1.9; border-top:1px solid var(--border); margin-top:28px; }
.qz-trakteer-btn { display:inline-flex; align-items:center; gap:6px; background:color-mix(in srgb, var(--warn) 10%, transparent); border:1px solid color-mix(in srgb, var(--warn) 30%, transparent); color:var(--warn); border-radius:2px; padding:8px 18px; font:600 0.82rem var(--qz-font); cursor:pointer; text-decoration:none; transition:all 0.2s; }
.qz-trakteer-btn:hover { background:color-mix(in srgb, var(--warn) 18%, transparent); transform:translateY(-1px); }

/* ════ MATERI LINK ════ */
.qz-materi-link { display:flex; align-items:center; gap:12px; background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:2px; padding:14px 16px; margin-bottom:10px; text-decoration:none; transition:all 0.2s; }
.qz-materi-link:hover { border-color:color-mix(in srgb, var(--accent) 50%, transparent); background:color-mix(in srgb, var(--accent) 7%, transparent); transform:translateX(3px); }

/* ════ QRIS HINT (last question) ════ */
.qz-last-q-hint { margin-top:16px; padding:12px 16px; background:color-mix(in srgb, var(--warn) 6%, transparent); border:1px solid color-mix(in srgb, var(--warn) 20%, transparent); border-radius:2px; text-align:center; animation:qz-fade-up 0.3s ease; }
.qz-last-q-hint p { color:var(--qz-muted); font-size:0.82rem; margin:0 0 8px; }

/* ════ REFLEKSI SOAL ════ */
.qz-refleksi-banner {
  background:linear-gradient(135deg,color-mix(in srgb, var(--bad) 12%, transparent),color-mix(in srgb, var(--warn) 8%, transparent));
  border:1px solid color-mix(in srgb, var(--bad) 40%, transparent); border-radius:var(--qz-radius);
  padding:20px; margin-bottom:20px; animation:qz-fade-up 0.4s ease;
}
.qz-refleksi-banner h3 { font-family:var(--qz-font-display); color:var(--qz-danger); font-size:1.1rem; margin-bottom:8px; }
.qz-refleksi-banner p { color:var(--qz-muted); font-size:0.88rem; line-height:1.6; margin-bottom:14px; }
.qz-refleksi-warning {
  background:color-mix(in srgb, var(--warn) 8%, transparent); border:1px solid color-mix(in srgb, var(--warn) 30%, transparent);
  border-radius:2px; padding:10px 14px; font-size:0.82rem; color:var(--qz-warning);
  margin-bottom:14px; display:flex; align-items:center; gap:8px;
}
.qz-refleksi-mode-badge {
  display:inline-flex; align-items:center; gap:6px;
  background:color-mix(in srgb, var(--bad) 12%, transparent); border:1px solid color-mix(in srgb, var(--bad) 40%, transparent);
  color:var(--qz-danger); font-size:0.72rem; font-weight:700;
  padding:4px 12px; border-radius:2px; letter-spacing:0.1em;
  margin-bottom:16px;
}
.qz-refleksi-header {
  display:flex; align-items:center; gap:10px; margin-bottom:12px;
}
.qz-refleksi-counter {
  font-size:0.78rem; color:var(--qz-muted); margin-left:auto;
}
.qz-refleksi-progress {
  height:3px; background:color-mix(in srgb, var(--bad) 15%, transparent); border-radius:2px; margin-bottom:20px; overflow:hidden;
}
.qz-refleksi-progress-fill {
  height:100%; background:var(--qz-danger); border-radius:2px; transition:width 0.3s ease;
}
/* ══ NEUMORPHISM SUBTLE — lapisan akhir (token mengikuti tema global) ══ */
.qz-root { background: var(--nm-bg); }
.qz-root::before, .qz-root::after { content: none; }
.qz-root .qz-header { background: var(--nm-bg); border-bottom-color: var(--border); box-shadow: 0 10px 18px -16px var(--nm-lo); }
.qz-root .qz-card, .qz-root .qz-mode-card, .qz-root .qz-stat-card, .qz-root .qz-subject-card, .qz-root .qz-type-card,
.qz-root .qz-resume-card, .qz-root .qz-howto, .qz-root .qz-passage, .qz-root .qz-personal-best, .qz-root .qz-qris-card,
.qz-root .qz-admin-panel, .qz-root .qz-auth-section, .qz-root .qz-refleksi-banner, .qz-root .qz-lb-row, .qz-root .qz-disclaimer, .qz-root .qz-alert {
  background: var(--nm-bg); border: 1px solid var(--nm-edge); border-radius: var(--r-m); box-shadow: var(--nm-raise);
}
.qz-root .qz-lb-row { box-shadow: var(--nm-raise-sm); margin-bottom: 10px; }
.qz-root .qz-mode-card, .qz-root .qz-subject-card.qz-subj-available, .qz-root .qz-type-card { cursor: pointer; transition: box-shadow var(--dur-fast) ease, transform var(--dur-fast) ease; }
.qz-root .qz-mode-card:hover, .qz-root .qz-subject-card.qz-subj-available:hover, .qz-root .qz-type-card:hover { transform: translateY(-2px); }
.qz-root .qz-mode-card.qz-selected, .qz-root .qz-mode-card:active, .qz-root .qz-type-card:active { box-shadow: var(--nm-inset); border-color: var(--accent-text); transform: none; }
.qz-root .qz-subject-card.qz-subj-locked, .qz-root .qz-type-card[aria-disabled="true"] { box-shadow: var(--nm-inset-sm); border-style: dashed; opacity: .7; cursor: not-allowed; }
.qz-root .qz-input { background: var(--nm-bg); border: 1px solid var(--border2); box-shadow: var(--nm-inset-sm); border-radius: var(--r-s); min-height: 44px; }
.qz-root .qz-input:focus { border-color: var(--accent-text); outline: 2px solid var(--accent); outline-offset: 2px; }
.qz-root .qz-btn { min-height: 44px; border-radius: 99px; box-shadow: var(--nm-raise-sm); border: 1px solid var(--nm-edge); transition: box-shadow var(--dur-fast) ease, transform var(--dur-fast) ease, background-color var(--dur-fast) ease; }
.qz-root .qz-btn:active:not(:disabled) { box-shadow: var(--nm-inset-sm); transform: translateY(1px); }
.qz-root .qz-btn:disabled { box-shadow: none; border-style: dashed; opacity: .55; cursor: not-allowed; }
.qz-root .qz-btn-primary, .qz-root .qz-btn-success { background: var(--accent); color: var(--on-accent); border-color: color-mix(in srgb, var(--accent) 60%, #000); }
.qz-root .qz-btn-secondary { background: var(--nm-bg); color: var(--text); border-color: var(--border2); }
.qz-root .qz-btn-danger { background: var(--nm-bg); color: var(--bad); border-color: color-mix(in srgb, var(--bad) 55%, transparent); }
.qz-root .qz-tabs { background: var(--nm-bg); box-shadow: var(--nm-inset-sm); border-radius: 99px; padding: 4px; border: 1px solid var(--nm-edge); }
.qz-root .qz-tab { min-height: 40px; border-radius: 99px; }
.qz-root .qz-tab.qz-active { background: var(--nm-bg); color: var(--text); box-shadow: var(--nm-raise-sm); border-bottom: 2px solid var(--accent); }
.qz-root .qz-sticky-bar { background: var(--nm-bg); box-shadow: 0 10px 18px -16px var(--nm-lo); }
.qz-root .qz-stat-pill { background: var(--nm-bg); border: 1px solid var(--nm-edge); box-shadow: var(--nm-inset-sm); border-radius: 99px; min-height: 36px; }
.qz-root .qz-progress-bar { background: var(--nm-bg); box-shadow: var(--nm-inset-sm); border-radius: 99px; border: 1px solid var(--nm-edge); overflow: hidden; }
.qz-root .qz-progress-fill { background: var(--accent); border-radius: 99px; }
.qz-root .qz-refleksi-progress { background: var(--nm-bg); box-shadow: var(--nm-inset-sm); border-radius: 99px; overflow: hidden; }
.qz-root .qz-refleksi-progress-fill { background: var(--accent); }

/* Opsi jawaban: raised → inset saat dipilih; benar/salah memakai ikon + warna (bukan warna saja) */
.qz-root .qz-option { background: var(--nm-bg); border: 1px solid var(--border2); border-radius: var(--r-m); box-shadow: var(--nm-raise-sm); min-height: 52px; position: relative; }
.qz-root .qz-option:not(.qz-locked):hover { transform: translateY(-1px); background: var(--nm-bg); }
.qz-root .qz-option:not(.qz-locked):active { box-shadow: var(--nm-inset-sm); transform: translateY(1px); }
.qz-root .qz-option.qz-sel { box-shadow: var(--nm-inset); border-color: var(--accent-text); }
.qz-root .qz-option-label { background: var(--nm-bg); box-shadow: var(--nm-inset-sm); border: 1px solid var(--nm-edge); color: var(--text); font-family: var(--font-mono); }
.qz-root .qz-option.qz-correct { border-color: var(--ok); box-shadow: var(--nm-inset-sm); }
.qz-root .qz-option.qz-incorrect { border-color: var(--bad); box-shadow: var(--nm-inset-sm); }
.qz-root .qz-option.qz-correct::after, .qz-root .qz-option.qz-incorrect::after {
  font-family: 'Font Awesome 6 Free'; font-weight: 900; margin-left: auto; padding-left: 10px; font-size: 1.05rem; line-height: 1;
}
.qz-root .qz-option.qz-correct::after { content: '\\f058'; color: var(--ok); }
.qz-root .qz-option.qz-incorrect::after { content: '\\f057'; color: var(--bad); }
.qz-root .qz-option.qz-correct .qz-option-label { background: var(--ok); color: var(--on-accent); border-color: var(--ok); box-shadow: none; }
.qz-root .qz-option.qz-incorrect .qz-option-label { background: var(--bad); color: var(--on-accent); border-color: var(--bad); box-shadow: none; }
.qz-root .qz-feedback { box-shadow: var(--nm-inset-sm); border-radius: var(--r-m); }
.qz-root .qz-feedback.qz-fb-correct { border: 1px solid var(--ok); }
.qz-root .qz-feedback.qz-fb-incorrect { border: 1px solid var(--bad); }
.qz-root .qz-fb-correct h4 { color: var(--ok); } .qz-root .qz-fb-incorrect h4 { color: var(--bad); }
.qz-root .qz-nav-cell { background: var(--nm-bg); border: 1px solid var(--nm-edge); box-shadow: var(--nm-raise-sm); min-width: 44px; min-height: 44px; }
.qz-root .qz-nav-cell.qz-nc-active { box-shadow: var(--nm-inset); border-color: var(--accent-text); }
.qz-root .qz-nav-cell.qz-nc-correct { border-color: var(--ok); } .qz-root .qz-nav-cell.qz-nc-wrong { border-color: var(--bad); }
.qz-root .qz-modal-overlay, .qz-root .qz-bs-overlay { background: color-mix(in srgb, var(--nm-lo) 78%, transparent); -webkit-backdrop-filter: none; backdrop-filter: none; }
.qz-modal-overlay, .qz-bs-overlay { background: color-mix(in srgb, var(--nm-lo) 78%, transparent); -webkit-backdrop-filter: none; backdrop-filter: none; z-index: var(--z-modal); }
.qz-modal-box, .qz-bs-box { background: var(--nm-bg); color: var(--text); border: 1px solid var(--border2); border-radius: var(--r-l); box-shadow: var(--nm-raise-lg); max-height: 92dvh; }
.qz-modal-box .qz-result-score { font-family: var(--font-mono); font-variant-numeric: tabular-nums; color: var(--text); letter-spacing: -0.04em; }
.qz-modal-box .qz-result-details { background: var(--nm-bg); box-shadow: var(--nm-inset-sm); border: 1px solid var(--nm-edge); border-radius: var(--r-m); }
.qz-root .qz-lb-rank.qz-gold { color: var(--warn); } .qz-root .qz-lb-rank.qz-silver { color: var(--text-dim); } .qz-root .qz-lb-rank.qz-bronze { color: #B87333; }
.qz-root .qz-stat-pill i, .qz-root .qz-result-row i, .qz-root .qz-section-label i { color: var(--accent-text); }
.qz-root .qz-stat-pill.qz-correct i { color: var(--ok); } .qz-root .qz-stat-pill.qz-wrong i { color: var(--bad); }
.ico-ok { color: var(--ok); } .ico-bad { color: var(--bad); } .ico-gold { color: var(--warn); } .ico-silver { color: var(--text-dim); } .ico-bronze { color: #B87333; }
.qz-root .qz-header .theme-toggle { margin-left: auto; }
@media (prefers-reduced-motion: reduce) { .qz-root *, .qz-root *::before, .qz-root *::after { transition: none !important; animation: none !important; } }

`;

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════ */

/* ── Saran belajar berdasarkan skor ── */
function getSuggestion(pct, subjectName) {
  const n = subjectName || 'materi ini';
  if (pct >= 90) return `Luar biasa! Kamu sangat menguasai ${n}. Pertahankan dan bantu teman-teman ya! `;
  if (pct >= 80) return `Bagus sekali! Sedikit lagi sempurna. Review soal yang salah, kamu siap UKOM! `;
  if (pct >= 70) return `Lumayan! Fokus pada konsep yang masih lemah di ${n}, terutama soal HOTS.`;
  if (pct >= 60) return `Cukup, tapi masih perlu latihan. Ulangi PPT dosen dan baca referensi tambahan.`;
  if (pct >= 40) return `Masih perlu banyak belajar. Prioritas baca materi ${n} dari awal sebelum quiz lagi.`;
  return `Jangan menyerah! Mulai dari baca PPT dosen pelan-pelan, pahami konsep dasar ${n} dulu. Semangat! `;
}

/**
 * QuizEngine — komponen quiz yang bisa dipakai ulang untuk mata pelajaran berbeda.
 *
 * Props:
 *   subjects        {Array}    — konfigurasi daftar mata pelajaran
 *   quizTypes       {Array}    — konfigurasi tipe soal (100/50 dll)
 *   storagePrefix   {string}   — prefix localStorage agar tiap halaman quiz terisolasi
 *   questionGetter  {Function} — fn(subject, type) → Array soal; default = getQs keperawatan
 */
export default function QuizEngine({
  subjects       = SUBJECTS,
  quizTypes      = QUIZ_TYPES,
  storagePrefix  = 'qz',
  questionGetter = getQs,
} = {}) {
  // shorthand agar kode di bawah tidak perlu diubah banyak
  const pfx = storagePrefix;
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

  /* ── Gerbang "Cara Penggunaan" — wajib discroll sampai bawah sekali per perangkat ── */
  const [hasReadRules, setHasReadRules] = useState(() => {
    try { return localStorage.getItem('qz_rules_read_v1') === '1'; } catch { return false; }
  });
  const markRulesRead = () => {
    setHasReadRules(true);
    try { localStorage.setItem('qz_rules_read_v1', '1'); } catch { /* abaikan */ }
  };
  const handleHowtoScroll = (e) => {
    if (hasReadRules) return;
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) markRulesRead();
  };

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
  const [cloudeeState, setCloudeeState] = useState('idle'); // untuk maskot CloudeeBubble
  const [isPaused, setIsPaused]   = useState(false); // timer dijeda saat tab tersembunyi
  const timerRef    = useRef(null);
  const deadlineRef = useRef(null);   // mirror deadline state (bisa dibaca di closure)
  const pauseTimeRef = useRef(null);  // timestamp saat tab disembunyikan

  /* ── Refleksi Soal ── */
  const [refleksiQueue, setRefleksiQueue]     = useState([]); // indeks soal salah yang perlu direfleksi
  const [refleksiActive, setRefleksiActive]   = useState(false); // sedang di mode refleksi
  const [refleksiDone, setRefleksiDone]       = useState({}); // { [origIdx]: 'benar'|'salah' }
  const [refleksiShown, setRefleksiShown]     = useState({}); // checkpoint sudah ditampilkan: { mid: bool, end: bool }
  const [showRefleksiBanner, setShowRefleksiBanner] = useState(false); // banner masuk mode refleksi
  const REFLEKSI_PENALTY = 100; // pengurangan skor per soal refleksi yang salah lagi

  /* ── Modal & UI ── */
  const [showResult, setShowResult] = useState(false);
  const [showNav, setShowNav]       = useState(false);
  const [showMultiplayer, setShowMultiplayer] = useState(false);
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

  /* ── Telegram & Community Stats ── */
  const [tgSent, setTgSent]               = useState(false);
  const [tgLoading, setTgLoading]         = useState(false);
  const [communityStats, setCommunityStats] = useState(null);

  /* ─────── DERIVED ─────── */
  const TOTAL         = activeQuestions.length;
  const lbCollection  = useMemo(() => getLbKey(selectedSubject, selectedType), [selectedSubject, selectedType]);
  const subjectInfo   = useMemo(() => subjects.find(s => s.key === selectedSubject), [subjects, selectedSubject]);
  const typeInfo      = useMemo(() => quizTypes.find(t => t.key === selectedType), [quizTypes, selectedType]);

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
    setPersonalBest(loadBest(pfx, selectedSubject, selectedType));
    try {
      const raw = localStorage.getItem(lsProgKey(pfx, selectedSubject, selectedType));
      setSavedProgress(raw ? JSON.parse(raw) : null);
    } catch { setSavedProgress(null); }
  }, [screen, selectedSubject, selectedType]);

  // Autosave progress (termasuk isPaused agar saat browser ditutup saat jeda, deadline bisa dipulihkan)
  useEffect(() => {
    if (!quizStarted || !selectedSubject || !selectedType) return;
    try {
      localStorage.setItem(
        lsProgKey(pfx, selectedSubject, selectedType),
        JSON.stringify({
          answers, currentQ, mode, deadline, startTime, checkedSet,
          questionIds: activeQuestions.map(q => q.id),
          pausedAt: isPaused ? pauseTimeRef.current : null,
        })
      );
    } catch { /* ignore */ }
  }, [answers, currentQ, mode, deadline, startTime, quizStarted, checkedSet, selectedSubject, selectedType, isPaused]);

  // Sinkronisasi deadlineRef ← deadline state (agar bisa dibaca di dalam closure timer)
  useEffect(() => { deadlineRef.current = deadline; }, [deadline]);

  // Peringatan sebelum menutup/refresh halaman saat quiz aktif
  useEffect(() => {
    if (!quizStarted) return;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      return (e.returnValue = ''); // browser menampilkan dialog konfirmasi bawaan
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [quizStarted]);

  // Timer (hard mode) — dengan pause otomatis saat tab/browser tersembunyi
  useEffect(() => {
    if (mode !== 'hard' || !quizStarted || !deadline) return;

    const tick = () => {
      const d = deadlineRef.current;
      if (!d) return;
      const left = Math.max(0, Math.round((d - Date.now()) / 1000));
      setTimeLeft(left);
      if (left <= 0) finishQuizRef.current(true);
    };

    const startInterval = () => {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(tick, 1000);
    };

    const onVisi = () => {
      if (document.visibilityState === 'hidden') {
        // ── PAUSE: catat waktu mulai dijeda ──
        clearInterval(timerRef.current);
        pauseTimeRef.current = Date.now();
        setIsPaused(true);
      } else {
        // ── RESUME: tambahkan durasi jeda ke deadline ──
        if (pauseTimeRef.current !== null) {
          const elapsed = Date.now() - pauseTimeRef.current;
          const newDl = (deadlineRef.current || 0) + elapsed;
          deadlineRef.current = newDl;
          setDeadline(newDl);          // trigger autosave lewat effect
          pauseTimeRef.current = null;
        }
        setIsPaused(false);
        startInterval();
        tick();
      }
    };

    tick();
    startInterval();
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
      setCloudeeState('login-google'); setTimeout(() => setCloudeeState('idle'), 6000);
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
    if (isNsLeo(name)) { setAuthAlert('Nama "Mr Leo" sudah dicadangkan. Pakai nama lain ya '); setAuthErrType('err'); return; }
    try {
      const cred = await signInAnonymously(quizAuth);
      localStorage.setItem(LS_NICK, name);
      setDisplayName(name);
      setQuizUser({ ...cred.user, _nickname: name });
      setCloudeeState('login-anon'); setTimeout(() => setCloudeeState('idle'), 6000);
    } catch (err) { setAuthAlert('Gagal masuk anonim: ' + err.message); setAuthErrType('err'); }
  };

  const handleSignOut = async () => { await signOut(quizAuth); setDisplayName(''); setNickname(''); };

  /* ─────── SCREEN HANDLERS ─────── */
  const handleSelectSubject = (key) => {
    const subj = subjects.find(s => s.key === key);
    if (subj?.navigateTo) {
      navigate(subj.navigateTo);
      return;
    }
    setSelectedSubject(key);
    setScreen('quiz-type');
  };

  const handleSelectType = (typeKey) => {
    const qs = questionGetter(selectedSubject, typeKey);
    // Cek apakah ada progress tersimpan dengan urutan soal
    let finalQs = null;
    try {
      const raw = localStorage.getItem(lsProgKey(pfx, selectedSubject, typeKey));
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.questionIds && saved.questionIds.length === qs.length) {
          const idMap = Object.fromEntries(qs.map(q => [q.id, q]));
          const restored = saved.questionIds.map(id => idMap[id]).filter(Boolean);
          if (restored.length === qs.length) finalQs = restored; // pulihkan urutan tersimpan
        }
      }
    } catch { /* ignore */ }
    // Jika tidak ada saved order → gunakan urutan asli soal (tidak diacak)
    if (!finalQs) finalQs = qs;
    setSelectedType(typeKey);
    setActiveQuestions(finalQs);
    // Reset semua quiz state
    setQuizStarted(false); setAnswers({}); setCurrentQ(0); setCheckedSet({});
    setShowResult(false); setFinalStat(null); setSaveStatus('');
    setIsNewBest(false); setTab('mulai');
    setScreen('quiz');
  };

  const clearProgress = useCallback(() => {
    if (selectedSubject && selectedType) {
      try { localStorage.removeItem(lsProgKey(pfx, selectedSubject, selectedType)); } catch { /* ignore */ }
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
      // Jika browser ditutup saat timer sedang dijeda, tambahkan waktu yang terlewat ke deadline
      let adj = resumeData.deadline || null;
      if (resumeData.mode === 'hard' && adj && resumeData.pausedAt) {
        const elapsed = Date.now() - resumeData.pausedAt;
        adj = adj + elapsed;
      }
      setAnswers(resumeData.answers || {});
      setCurrentQ(resumeData.currentQ || 0);
      setMode(resumeData.mode || 'unlimited');
      setDeadline(adj);
      setStartTime(resumeData.startTime || Date.now());
      setCheckedSet(resumeData.checkedSet || {});
      setIsPaused(false);
    } else {
      const now = Date.now();
      setAnswers({}); setCurrentQ(0); setCheckedSet({});
      setStartTime(now);
      if (mode === 'hard') setDeadline(now + hardModeMinutesFor(TOTAL) * 60 * 1000);
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
    const baseScore = calcScore(finalCorrect, TOTAL);
    // Hitung penalti refleksi: soal refleksi yang masih salah
    const refleksiPenalty = Object.values(refleksiDone).filter(v => v === 'salah').length * REFLEKSI_PENALTY;
    const score = Math.max(0, baseScore - refleksiPenalty);
    const stat = { correct: finalCorrect, total: TOTAL, score, durationSec, mode, refleksiPenalty };
    setFinalStat(stat);
    setShowResult(true);
    setQuizStarted(false);
    setIsPaused(false);
    pauseTimeRef.current = null;
    setRefleksiActive(false);
    setShowRefleksiBanner(false);
    clearProgress();
    setSavedProgress(null);
    // Personal best
    const newBest = updateBest(pfx, selectedSubject, selectedType, stat);
    setIsNewBest(newBest);
    // Trigger maskot sesuai hasil
    const pctFinal = Math.round((finalCorrect / TOTAL) * 100);
    const finState = pctFinal >= 70 ? 'finished-good' : pctFinal >= 40 ? 'finished-mid' : 'finished-bad';
    setCloudeeState(finState);
    setTimeout(() => setCloudeeState('idle'), 9000);
    if (newBest) setPersonalBest({ ...stat, date: new Date().toLocaleDateString('id-ID') });
    // Kumpulkan soal yang salah (proses di device, upload sekali di akhir)
    const wrongQIds = Object.entries(answers)
      .filter(([idx, sel]) => sel !== activeQuestions[Number(idx)]?.correct)
      .map(([idx]) => activeQuestions[Number(idx)]?.id)
      .filter(id => id != null);
    setCommunityStats(null); // reset dulu
    saveCommunityStats(answers, wrongQIds);
    setTimeout(fetchCommunityStats, 2000); // baca setelah tulis selesai
    saveToLeaderboard(stat);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, mode, startTime, TOTAL, activeQuestions, clearProgress, selectedSubject, selectedType, refleksiDone]);

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

  /* ─────── TELEGRAM ─────── */
  const sendToTelegram = async () => {
    if (!finalStat || tgLoading || tgSent) return;
    setTgLoading(true);
    try {
      const pct  = Math.round((finalStat.correct / TOTAL) * 100);
      const sugg = getSuggestion(pct, subjectInfo?.name);
      const body = {
        nickname:   displayName || 'Anonim',
        subject:    `${subjectInfo?.name} · ${typeInfo?.label}`,
        score:      finalStat.score,
        maxScore:   MAX_SCORE,
        correct:    finalStat.correct,
        total:      TOTAL,
        duration:   formatDuration(finalStat.durationSec),
        mode:       finalStat.mode,
        suggestion: sugg,
      };
      const res  = await fetch('/api/send-telegram', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const data = await res.json();
      if (data.ok) setTgSent(true);
    } catch (e) { console.warn('[TG]', e); }
    setTgLoading(false);
  };

  /* ─────── COMMUNITY WRONG STATS ─────── */
  /** Simpan soal yang salah ke Firestore (satu kali tulis di akhir quiz, ringan) */
  const saveCommunityStats = async (finalAnswers, wrongQIds) => {
    if (!lbCollection) return;
    try {
      const ref    = doc(quizDb, 'qzCommunityWrong', lbCollection);
      const update = { ts: increment(1) }; // ts = total sessions
      // Hitung berapa kali tiap soal dijawab & berapa kali salah
      Object.keys(finalAnswers).forEach(idx => {
        const qId = activeQuestions[Number(idx)]?.id;
        if (qId == null) return;
        update[`tc.q${qId}`] = increment(1); // tc = total count per soal
      });
      wrongQIds.forEach(qId => {
        update[`wc.q${qId}`] = increment(1); // wc = wrong count per soal
      });
      await setDoc(ref, update, { merge: true });
    } catch (e) { console.warn('[CommunityStats]', e); }
  };

  /** Ambil statistik komunitas untuk ditampilkan di hasil */
  const fetchCommunityStats = async () => {
    if (!lbCollection) return;
    try {
      const snap = await getDoc(doc(quizDb, 'qzCommunityWrong', lbCollection));
      if (snap.exists()) setCommunityStats(snap.data());
    } catch { /* silent */ }
  };

  const selectAnswer = (optIdx) => {
    if (checkedSet[currentQ]) return;
    setAnswers(prev => ({ ...prev, [currentQ]: optIdx }));
  };

  const checkAnswer = () => {
    if (answers[currentQ] == null) return;
    setCheckedSet(prev => ({ ...prev, [currentQ]: true }));
    // Trigger maskot
    const isRight = answers[currentQ] === activeQuestions[currentQ]?.correct;
    setCloudeeState(isRight ? 'correct' : 'wrong');
    setTimeout(() => setCloudeeState('idle'), 6000);
  };

  const goToQ = (idx) => { setCurrentQ(idx); setShowNav(false); };
  const goPrev = () => { if (currentQ > 0) goToQ(currentQ - 1); };

  // ── Refleksi: cek apakah harus masuk mode refleksi di checkpoint ──
  const checkRefleksiCheckpoint = useCallback((nextIdx, curAnswers, curCheckedSet) => {
    const mid = Math.floor(TOTAL / 2);
    const endThreshold = Math.floor(TOTAL * 0.90); // 90% soal sudah dijawab

    // Kumpulkan soal yang salah dari soal 0 s/d nextIdx-1
    const wrongIdxs = [];
    for (let i = 0; i < nextIdx; i++) {
      if (curCheckedSet[i] && curAnswers[i] !== activeQuestions[i]?.correct) {
        wrongIdxs.push(i);
      }
    }
    if (wrongIdxs.length === 0) return false;

    // Checkpoint tengah: tepat saat mau masuk soal mid, belum pernah show
    if (nextIdx === mid && !refleksiShown.mid) {
      setRefleksiShown(prev => ({ ...prev, mid: true }));
      setRefleksiQueue(wrongIdxs);
      setRefleksiActive(true);
      setShowRefleksiBanner(true);
      return true;
    }
    // Checkpoint akhir: saat mau masuk soal endThreshold, belum pernah show
    if (nextIdx === endThreshold && !refleksiShown.end) {
      setRefleksiShown(prev => ({ ...prev, end: true }));
      // hanya soal yang belum pernah direfleksi
      // Hanya tampilkan soal yang BELUM benar di refleksi sebelumnya
      // (soal yang sudah benar di pengulangan pertama tidak ditampilkan lagi)
      const newWrong = wrongIdxs.filter(i => refleksiDone[i] !== 'benar');
      if (newWrong.length === 0) return false;
      setRefleksiQueue(newWrong);
      setRefleksiActive(true);
      setShowRefleksiBanner(true);
      return true;
    }
    return false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TOTAL, activeQuestions, refleksiShown, refleksiDone]);

  const goNext = useCallback(() => {
    const nextIdx = currentQ + 1;
    if (nextIdx >= TOTAL) {
      finishQuizRef.current(false);
      return;
    }
    // Cek checkpoint refleksi
    const triggered = checkRefleksiCheckpoint(nextIdx, answers, checkedSet);
    if (!triggered) goToQ(nextIdx);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ, TOTAL, answers, checkedSet, checkRefleksiCheckpoint]);

  const restartQuiz = () => {
    setShowResult(false); setFinalStat(null); setSaveStatus(''); setCheckedSet({}); setIsNewBest(false);
    setIsPaused(false); pauseTimeRef.current = null;
    setRefleksiQueue([]); setRefleksiActive(false); setRefleksiDone({});
    setRefleksiShown({}); setShowRefleksiBanner(false);
    setTgSent(false); setTgLoading(false); setCommunityStats(null);
    startQuiz(null);
  };

  const backToMenu = () => {
    setShowResult(false); setFinalStat(null); setSaveStatus('');
    setQuizStarted(false); setCheckedSet({}); setIsNewBest(false);
    setRefleksiQueue([]); setRefleksiActive(false); setRefleksiDone({});
    setRefleksiShown({}); setShowRefleksiBanner(false);
    setTgSent(false); setTgLoading(false); setCommunityStats(null);
    setTab('mulai');
  };

  /* ─────── ADMIN HANDLER ─────── */
  const handleAdminReset = async (subject, type) => {
    const collName = getLbKey(subject, type);
    if (!collName) return;
    const subj = subjects.find(s => s.key === subject);
    const typ  = quizTypes.find(t => t.key === type);
    if (!window.confirm(`RESET RANKING\n\n${subj?.name} · ${typ?.label} (${typ?.soalCount} Soal)\n\nSemua data ranking akan dihapus permanen!\nLanjutkan?`)) return;
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
      <>
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-wrap">

          {/* Hero */}
          <div className="qz-sub-hero">
            <div className="qz-sub-logo"><i className="fa-solid fa-book" aria-hidden="true" /> QUIZ KEPERAWATAN</div>
            <h1 className="qz-sub-title">Pilih Mata<br />Pelajaran</h1>
            <p className="qz-sub-desc">Latihan soal HOTS berbasis kisi-kisi & PPT dosen</p>
            <button
              onClick={() => setShowMultiplayer(true)}
              style={{
                marginTop: 18,
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg,var(--warn),#ef4444)',
                color: '#fff', border: 'none', borderRadius: 2,
                padding: '10px 22px', fontWeight: 700, fontSize: '0.88rem',
                cursor: 'pointer', boxShadow: '0 6px 20px color-mix(in srgb, var(--bad) 30%, transparent)',
                transition: 'all 0.2s', letterSpacing: '0.03em',
              }}
            >
              <i className="fa-solid fa-bolt" aria-hidden="true" /> Mode VS (Multiplayer)
            </button>
          </div>

          {/* Disclaimer */}
          <div className="qz-disclaimer">
            <div className="qz-disclaimer-icon"><i className="fa-solid fa-triangle-exclamation" aria-hidden="true" /></div>
            <div className="qz-disclaimer-text">
              <h4>DISCLAIMER</h4>
              <p>Soal dibuat penuh dengan bantuan AI (ChatGPT, Claude AI CLI, Gemini CLI) berdasarkan kisi-kisi dan PPT dosen. Jika ada yang kurang tepat, mohon dimaklumi. Tetap belajar dari sumber utama! <i className="fa-solid fa-hand-fist" aria-hidden="true" /></p>
            </div>
          </div>

          {/* Mata Pelajaran Aktif */}
          <div className="qz-section-label"><i className="fa-solid fa-book-open" aria-hidden="true" /> Tersedia Sekarang</div>
          {subjects.filter(s => s.available).map(s => (
            <div
              key={s.key}
              className="qz-subject-card qz-subj-available"
              onClick={() => handleSelectSubject(s.key)}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleSelectSubject(s.key)}
            >
              <div className="qz-subj-icon" style={{ background: s.gradient }}>
                <Ico e={s.icon} />
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
          {subjects.filter(s => !s.available).map(s => (
            <div key={s.key} className="qz-subject-card qz-subj-locked">
              <div className="qz-subj-icon"><Ico e={s.icon} /></div>
              <div className="qz-subj-info">
                <div className="qz-subj-name">{s.name}</div>
                <div className="qz-subj-meta">{s.abbr} · Dalam Persiapan</div>
              </div>
              <div className="qz-subj-right">
                <span className="qz-badge-soon">Coming Soon</span>
                <span style={{ fontSize: '1rem' }}><i className="fa-solid fa-lock" aria-hidden="true" /></span>
              </div>
            </div>
          ))}

          {/* Link Materi */}
          <div className="qz-section-label" style={{ marginTop: 28 }}><i className="fa-solid fa-book" aria-hidden="true" /> Link Materi Belajar</div>
          {subjects.filter(s => s.available && s.materiUrl).map(s =>
            s.materiUrl.startsWith('/') ? (
              <div
                key={s.key}
                onClick={() => navigate(s.materiUrl)}
                className="qz-materi-link"
                style={{ cursor: 'pointer' }}
              >
                <div className="qz-subj-icon" style={{ background: s.gradient, width: 40, height: 40, fontSize: '1.2rem', borderRadius: 2 }}>
                  <Ico e={s.icon} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--qz-text)', marginBottom: 2 }}>{s.abbr}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--qz-muted)' }}>{s.materiLabel}</div>
                </div>
                <span style={{ color: 'var(--qz-primary)', fontSize: '0.82rem', fontWeight: 600 }}>Buka →</span>
              </div>
            ) : (
              <a
                key={s.key}
                href={s.materiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="qz-materi-link"
              >
                <div className="qz-subj-icon" style={{ background: s.gradient, width: 40, height: 40, fontSize: '1.2rem', borderRadius: 2 }}>
                  <Ico e={s.icon} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--qz-text)', marginBottom: 2 }}>{s.abbr}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--qz-muted)' }}>{s.materiLabel}</div>
                </div>
                <span style={{ color: 'var(--qz-primary)', fontSize: '0.82rem', fontWeight: 600 }}>Buka →</span>
              </a>
            )
          )}

          {/* Donasi QRIS */}
          <div className="qz-ai-footer">
            <i className="fa-solid fa-robot" aria-hidden="true" /> Dibuat dengan bantuan AI:<br />
            <strong style={{ color: 'color-mix(in srgb, var(--text-dim) 70%, transparent)' }}>ChatGPT · Claude AI CLI · Gemini CLI</strong>
          </div>

          {/* Komentar umum — YouTube style */}
          <div style={{ marginTop: 28, borderTop: '1px solid color-mix(in srgb, var(--text) 7%, transparent)', paddingTop: 8 }}>
            <SubjectComments
              subjectKey="general"
              user={quizUser}
              youtubeStyle={true}
              maxPreview={3}
            />
          </div>

          {/* Saran Website */}
          <SaranWebsite user={quizUser} />

          {/* QRIS fullscreen (untuk subjects screen) */}
          {qrisLarge && createPortal(
            <div className="qz-qris-full" onClick={() => setQrisLarge(false)} role="dialog" aria-label="QRIS diperbesar" aria-modal="true">
              <img src={QRIS_IMAGE} alt="QRIS" />
            </div>,
            document.body
          )}
        </div>
      </div>

      {/* VS Multiplayer Room */}
      {showMultiplayer && (
        <QuizizRoom user={quizUser} onClose={() => setShowMultiplayer(false)} />
      )}
      </>
    );
  }

  /* ════════════════════════════════════════════════════
     SCREEN 2: PILIH TIPE SOAL
  ════════════════════════════════════════════════════ */
  if (screen === 'quiz-type') {
    const subj = subjects.find(s => s.key === selectedSubject);
    return (
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-wrap">

          {/* Header */}
          <div className="qz-header">
            <button className="qz-back-btn" onClick={() => setScreen('subjects')}>← Mapel</button>
            <div className="qz-header-title">
              <Ico e={subj?.icon} /> {subj?.name}
              <span className="qz-header-sub">{subj?.abbr}</span>
            </div>
            <ThemeToggle label={false} />
          </div>

          {/* Hero */}
          <div className="qz-sub-hero" style={{ padding: '28px 0 20px' }}>
            <div className="qz-sub-logo"><Ico e={subj?.icon} /> {subj?.abbr}</div>
            <h1 className="qz-sub-title">Pilih Tipe<br />Soal</h1>
            <p className="qz-sub-desc">Belajar materi mendalam atau uji kemampuan diri?</p>
          </div>

          {/* Quiz Type Cards — qt.locked (opsional) membuat kartu nonaktif dengan ikon gembok,
              dipakai mis. supaya tipe "Latihan Serius" baru terbuka setelah "Bahan Belajar" selesai */}
          {quizTypes.map(qt => (
            <div
              key={qt.key}
              className={`qz-type-card ${qt.typeClass}`}
              style={qt.locked ? { opacity: 0.5, cursor: 'default' } : undefined}
              onClick={qt.locked ? undefined : () => handleSelectType(qt.key)}
              role="button" tabIndex={qt.locked ? -1 : 0}
              aria-disabled={!!qt.locked}
              onKeyDown={qt.locked ? undefined : (e => e.key === 'Enter' && handleSelectType(qt.key))}
            >
              <div className="qz-type-icon">{qt.locked ? <Ico e="🔒" /> : <Ico e={qt.icon} />}</div>
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
                <div className="qz-type-desc">
                  {qt.locked ? (qt.lockedMsg || 'Selesaikan tipe sebelumnya dulu untuk membuka ini.') : qt.desc}
                </div>
              </div>
              {!qt.locked && (
                <div style={{ alignSelf: 'center', color: 'var(--qz-primary)', fontSize: '1.2rem', marginLeft: 4 }}>→</div>
              )}
            </div>
          ))}

          {/* Info tip */}
          <div style={{ background: 'var(--qz-surface)', border: '1px solid var(--qz-border)', borderRadius: 2, padding: '14px 16px', marginTop: 8 }}>
            <p style={{ color: 'var(--qz-muted)', fontSize: '0.83rem', lineHeight: 1.65, margin: 0 }}>
              <i className="fa-solid fa-lightbulb" aria-hidden="true" /> <strong style={{ color: 'var(--qz-text)' }}>Tips:</strong> Mulai dari <em>Bahan Pembelajaran</em> untuk memahami materi, lalu uji diri dengan <em>Latihan Soal</em>. Ranking tersimpan <em>terpisah</em> untuk masing-masing tipe!
            </p>
          </div>

          {/* Link Materi untuk mapel ini */}
          {subj?.materiUrl && (
            subj.materiUrl.startsWith('/') ? (
              <div
                onClick={() => navigate(subj.materiUrl)}
                className="qz-materi-link"
                style={{ marginTop: 16, cursor: 'pointer' }}
              >
                <div className="qz-subj-icon" style={{ background: subj.gradient, width: 40, height: 40, fontSize: '1.2rem', borderRadius: 2 }}>
                  <Ico e={subj.icon} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--qz-text)', marginBottom: 2 }}>{subj.abbr}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--qz-muted)' }}>{subj.materiLabel}</div>
                </div>
                <span style={{ color: 'var(--qz-primary)', fontSize: '0.82rem', fontWeight: 600 }}>Buka →</span>
              </div>
            ) : (
              <a
                href={subj.materiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="qz-materi-link"
                style={{ marginTop: 16 }}
              >
                <div className="qz-subj-icon" style={{ background: subj.gradient, width: 40, height: 40, fontSize: '1.2rem', borderRadius: 2 }}>
                  <Ico e={subj.icon} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--qz-text)', marginBottom: 2 }}>{subj.abbr}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--qz-muted)' }}>{subj.materiLabel}</div>
                </div>
                <span style={{ color: 'var(--qz-primary)', fontSize: '0.82rem', fontWeight: 600 }}>Buka →</span>
              </a>
            )
          )}

          <div className="qz-ai-footer" style={{ marginTop: 20 }}>
            <i className="fa-solid fa-robot" aria-hidden="true" /> ChatGPT · Claude AI CLI · Gemini CLI
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
            <Ico e={subjectInfo?.icon} /> {subjectInfo?.abbr}
            <span className="qz-header-sub">{typeInfo?.label} · {TOTAL} Soal</span>
          </div>
          <ThemeToggle label={false} />
        </div>

        {/* Tabs */}
        <div className="qz-tabs" role="tablist">
          {[['mulai', 'Mulai'], ['quiz', 'Quiz'], ['ranking', 'Ranking']].map(([id, label]) => (
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
              <Ico e={subjectInfo?.icon} /> {subjectInfo?.abbr?.toUpperCase()} · {typeInfo?.badgeLabel}
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
                <div className="qz-pb-emoji"><i className="fa-solid fa-medal" aria-hidden="true" /></div>
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
                <h4><i className="fa-solid fa-thumbtack" aria-hidden="true" /> Lanjutkan Quiz?</h4>
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
                { key: 'unlimited', label: 'Unlimited', desc: 'Tanpa batas waktu. Cocok untuk belajar santai dan memahami materi.' },
                { key: 'hard',      label: 'Timed Mode', desc: `Timer ${hardModeMinutesFor(TOTAL)} menit untuk ${TOTAL} soal. Uji kecepatan & ketepatan!` },
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
                      {quizUser.isAnonymous ? ' (Anonim)' : ''}
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
                    <i className="fa-solid fa-user" aria-hidden="true" /> Main Anonim
                  </button>
                </>
              )}
            </div>

            {/* Cara penggunaan — wajib discroll sampai bawah sekali, lalu diingat di perangkat ini */}
            <div
              className="qz-howto"
              style={!hasReadRules ? { maxHeight: 190, overflowY: 'auto' } : undefined}
              onScroll={handleHowtoScroll}
            >
              <h4>Cara Penggunaan{!hasReadRules ? ' — scroll sampai bawah untuk lanjut' : ''}</h4>
              <ol>
                <li>Pilih mode quiz (Unlimited / Timed) di atas</li>
                <li>Pilih salah satu opsi jawaban</li>
                <li>Klik <strong>"Periksa Jawaban"</strong> untuk melihat hasil & penjelasan</li>
                <li>Jawaban <strong>terkunci</strong> setelah diperiksa — tidak bisa diubah</li>
                <li>Gunakan tombol navigator soal (<i className="fa-solid fa-clipboard-list" aria-hidden="true" />) untuk loncat ke soal lain</li>
                <li><i className="fa-solid fa-repeat" aria-hidden="true" /> <strong>Refleksi Soal:</strong> di pertengahan &amp; menjelang akhir, soal yang kamu jawab salah akan muncul lagi. Jawab benar = tidak kena penalti. Jawab salah lagi = skor dikurangi {REFLEKSI_PENALTY} poin!</li>
                <li>Skor terbaikmu tersimpan otomatis di leaderboard</li>
                <li>Login Google = data ingatan bertahan permanen <i className="fa-solid fa-cloud" aria-hidden="true" /></li>
                <li>Anonim = data tersimpan di cache browser <i className="fa-solid fa-desktop" aria-hidden="true" /></li>
              </ol>
              {!hasReadRules && (
                <button type="button" className="qz-btn qz-btn-secondary qz-btn-sm" style={{ marginTop: 10 }} onClick={markRulesRead}>
                  Sudah baca semua ✓
                </button>
              )}
            </div>

            <button
              className="qz-btn qz-btn-primary"
              disabled={!quizUser || !hasReadRules}
              onClick={() => { clearProgress(); setSavedProgress(null); startQuiz(null); }}
            >
              {!quizUser ? 'Login dulu untuk mulai' : !hasReadRules ? 'Baca Cara Penggunaan dulu' : 'Mulai Quiz'}
            </button>
          </div>
        )}

        {/* ══ TAB: QUIZ ══ */}
        {tab === 'quiz' && (
          <div role="tabpanel" aria-label="Tab Quiz">
            {!quizStarted && !showResult ? (
              <div className="qz-empty">
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}><i className="fa-solid fa-pen-to-square" aria-hidden="true" /></div>
                <p>Mulai quiz dari tab <strong>Mulai</strong> ya.</p>
              </div>
            ) : showResult ? (
              <div className="qz-empty">
                <p>Quiz selesai! Lihat hasil di popup atau mulai lagi.</p>
              </div>
            ) : showRefleksiBanner ? (
              /* ── REFLEKSI BANNER (checkpoint masuk mode refleksi) ── */
              <div className="qz-refleksi-banner" role="alert" aria-live="assertive">
                <h3><i className="fa-solid fa-repeat" aria-hidden="true" /> Waktu Refleksi Soal!</h3>
                <p>
                  Sebelum lanjut, kamu perlu mengulang <strong>{refleksiQueue.length} soal</strong> yang tadi kamu jawab salah.
                  Ini kesempatan untuk memahami materinya lebih dalam!
                </p>
                <div className="qz-refleksi-warning">
                  <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" /> Jika kamu <strong>masih salah</strong> saat refleksi, skor akan dikurangi <strong>{REFLEKSI_PENALTY} poin</strong> per soal.
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--qz-muted)', marginBottom: 16 }}>
                  Jawab dengan benar untuk lanjut ke soal berikutnya tanpa penalti skor. Kalau salah lagi, soal tetap bisa dilanjutkan tapi skor berkurang.
                </p>
                <button
                  className="qz-btn qz-btn-primary"
                  onClick={() => {
                    setShowRefleksiBanner(false);
                    // Tidak perlu set currentQ karena refleksi punya state sendiri
                  }}
                >
                  <i className="fa-solid fa-repeat" aria-hidden="true" /> Mulai Refleksi ({refleksiQueue.length} Soal)
                </button>
              </div>
            ) : refleksiActive && refleksiQueue.length > 0 ? (
              /* ── MODE REFLEKSI ── */
              (() => {
                const refleksiIdx    = refleksiQueue[0];
                const refleksiQ      = activeQuestions[refleksiIdx];
                const refleksiSelKey = `ref_${refleksiIdx}`;
                const refleksiSel    = answers[refleksiSelKey];
                const refleksiChkKey = `ref_${refleksiIdx}`;
                const refleksiChk    = !!checkedSet[refleksiChkKey];
                const refleksiCorrect = refleksiSel != null && refleksiSel === refleksiQ?.correct;
                const doneCount      = Object.keys(refleksiDone).length;
                const totalInSet     = doneCount + refleksiQueue.length;
                const progress       = totalInSet > 0 ? (doneCount / totalInSet) * 100 : 0;

                const handleRefleksiSelect = (optIdx) => {
                  if (refleksiChk) return;
                  setAnswers(prev => ({ ...prev, [refleksiSelKey]: optIdx }));
                };
                const handleRefleksiCheck = () => {
                  if (refleksiSel == null) return;
                  setCheckedSet(prev => ({ ...prev, [refleksiChkKey]: true }));
                };
                const handleRefleksiNext = () => {
                  // Catat hasil refleksi
                  const hasil = refleksiCorrect ? 'benar' : 'salah';
                  setRefleksiDone(prev => ({ ...prev, [refleksiIdx]: hasil }));
                  const newQueue = refleksiQueue.slice(1);
                  if (newQueue.length === 0) {
                    // Refleksi selesai → lanjutkan quiz dari soal berikutnya
                    setRefleksiActive(false);
                    setRefleksiQueue([]);
                    goToQ(currentQ); // currentQ masih di checkpoint, lanjut ke next
                  } else {
                    setRefleksiQueue(newQueue);
                    // Bersihkan answer+checked untuk soal refleksi berikutnya
                    const nextKey = `ref_${newQueue[0]}`;
                    setAnswers(prev => { const n = { ...prev }; delete n[nextKey]; return n; });
                    setCheckedSet(prev => { const n = { ...prev }; delete n[nextKey]; return n; });
                  }
                };

                return (
                  <>
                    <div className="qz-refleksi-mode-badge"><i className="fa-solid fa-repeat" aria-hidden="true" /> MODE REFLEKSI</div>
                    <div className="qz-refleksi-progress">
                      <div className="qz-refleksi-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="qz-refleksi-header">
                      <span style={{ fontSize: '0.82rem', color: 'var(--qz-danger)', fontWeight: 700 }}>
                        Soal Refleksi {doneCount + 1} dari {doneCount + refleksiQueue.length}
                      </span>
                      <span className="qz-refleksi-counter">
                        Penalti aktif: -{Object.values(refleksiDone).filter(v => v === 'salah').length * REFLEKSI_PENALTY} poin
                      </span>
                    </div>

                    {/* Sticky bar */}
                    <div className="qz-sticky-bar" aria-label="Statistik quiz">
                      {mode === 'hard' && (
                        <div className={`qz-stat-pill ${isPaused ? 'qz-timer qz-timer-paused' : timerClass}`} aria-live="polite">
                          <span>{isPaused ? '⏸' : formatDuration(timeLeft)}</span>
                          {isPaused ? <i className="fa-solid fa-pause" aria-hidden="true" /> : <i className="fa-solid fa-stopwatch" aria-hidden="true" />}
                        </div>
                      )}
                      <div className="qz-stat-pill qz-correct"><span>{correctCount}</span><i className="fa-solid fa-circle-check" aria-hidden="true" /></div>
                      <div className="qz-stat-pill qz-wrong"><span>{wrongCount}</span><i className="fa-solid fa-circle-xmark" aria-hidden="true" /></div>
                      <div className="qz-stat-pill qz-score"><span>{currentScore}</span><i className="fa-solid fa-star" aria-hidden="true" /></div>
                    </div>

                    <div className="qz-q-text">{refleksiQ?.text}</div>

                    <div className="qz-options" role="group" aria-label="Pilihan jawaban refleksi">
                      {refleksiQ?.options.map((opt, i) => {
                        let cls = 'qz-option';
                        if (refleksiChk) {
                          cls += ' qz-locked';
                          if (i === refleksiQ.correct) cls += ' qz-correct';
                          else if (i === refleksiSel) cls += ' qz-incorrect';
                        } else if (i === refleksiSel) cls += ' qz-sel';
                        return (
                          <button
                            key={i}
                            className={cls}
                            onClick={() => handleRefleksiSelect(i)}
                            aria-pressed={refleksiSel === i}
                            aria-label={`Opsi ${OPTION_LABELS[i]}: ${opt}`}
                          >
                            <span className="qz-option-label">{OPTION_LABELS[i]}</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {refleksiChk && (
                      <div className={`qz-feedback ${refleksiCorrect ? 'qz-fb-correct' : 'qz-fb-incorrect'}`} aria-live="polite">
                        <h4>
                          {refleksiCorrect
                            ? 'Benar! Tidak ada penalti.'
                            : `Masih Salah — Skor dikurangi ${REFLEKSI_PENALTY} poin`
                          }
                        </h4>
                        {!refleksiCorrect && (
                          <p>Jawaban yang benar: <strong>{OPTION_LABELS[refleksiQ.correct]}. {refleksiQ?.options[refleksiQ.correct]}</strong></p>
                        )}
                        <p>{refleksiQ?.explanation}</p>
                      </div>
                    )}

                    <div className="qz-nav-btns">
                      <div />
                      {!refleksiChk ? (
                        <button
                          className="qz-btn qz-btn-primary"
                          onClick={handleRefleksiCheck}
                          disabled={refleksiSel == null}
                        >
                          Periksa Jawaban
                        </button>
                      ) : (
                        <button className="qz-btn qz-btn-success" onClick={handleRefleksiNext}>
                          {refleksiQueue.length === 1 ? 'Selesai Refleksi' : 'Soal Refleksi Berikutnya →'}
                        </button>
                      )}
                    </div>
                  </>
                );
              })()
            ) : q ? (
              <>
                {/* Banner timer dijeda */}
                {mode === 'hard' && isPaused && (
                  <div className="qz-paused-banner" aria-live="polite">
                    ⏸ Timer dijeda — kembali ke tab ini untuk melanjutkan
                  </div>
                )}

                {/* Sticky bar */}
                <div className="qz-sticky-bar" aria-label="Statistik quiz">
                  {mode === 'hard' && (
                    <div className={`qz-stat-pill ${isPaused ? 'qz-timer qz-timer-paused' : timerClass}`} aria-live="polite">
                      <span>{isPaused ? '⏸' : formatDuration(timeLeft)}</span>
                      {isPaused ? <i className="fa-solid fa-pause" aria-hidden="true" /> : <i className="fa-solid fa-stopwatch" aria-hidden="true" />}
                    </div>
                  )}
                  <div className="qz-stat-pill qz-correct"><span>{correctCount}</span><i className="fa-solid fa-circle-check" aria-hidden="true" /></div>
                  <div className="qz-stat-pill qz-wrong"><span>{wrongCount}</span><i className="fa-solid fa-circle-xmark" aria-hidden="true" /></div>
                  <div className="qz-stat-pill qz-score"><span>{currentScore}</span><i className="fa-solid fa-star" aria-hidden="true" /></div>
                </div>

                {/* Progress */}
                <div className="qz-progress-bar" role="progressbar" aria-valuenow={currentQ + 1} aria-valuemax={TOTAL}>
                  <div className="qz-progress-fill" style={{ width: `${((currentQ + 1) / TOTAL) * 100}%` }} />
                </div>
                <div className="qz-q-counter">Soal {currentQ + 1} / {TOTAL}</div>

                {/* Teks Bacaan (Reading) */}
                {q.passage && (
                  <div className="qz-passage">
                    <div className="qz-passage-label"><i className="fa-solid fa-book-open" aria-hidden="true" /> Teks Bacaan</div>
                    <div className="qz-passage-text">{q.passage}</div>
                  </div>
                )}

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
                    <h4>{isCorrectAns ? 'Jawaban Benar!' : 'Jawaban Salah'}</h4>
                    {!isCorrectAns && (
                      <p>Jawaban yang benar: <strong>{OPTION_LABELS[q.correct]}. {q.options[q.correct]}</strong></p>
                    )}
                    <p>{q.explanation}</p>
                  </div>
                )}

                {/* QRIS hint di soal terakhir */}
                {currentQ === TOTAL - 1 && isChecked && !qrisError && (
                  <div className="qz-last-q-hint">
                    <p><i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" /> Soal terakhir! Kalau quiz ini membantu belajarmu, boleh traktir ya <i className="fa-solid fa-hands-praying" aria-hidden="true" /></p>
                    <button className="qz-trakteer-btn" style={{ border: 'none', cursor: 'pointer' }} onClick={() => setQrisLarge(true)}>
                      <i className="fa-solid fa-mug-hot" aria-hidden="true" /> Trakteer Kami
                    </button>
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
                      {currentQ < TOTAL - 1 ? 'Lanjut →' : 'Selesai'}
                    </button>
                  )}
                </div>

                {/* Navigator toggle */}
                <button className="qz-nav-toggle" onClick={() => setShowNav(true)} aria-label="Buka navigator soal">
                  <i className="fa-solid fa-clipboard-list" aria-hidden="true" /> {Object.keys(answers).length}/{TOTAL}
                </button>

                {/* Komentar per matkul */}
                <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid color-mix(in srgb, var(--text) 7%, transparent)' }}>
                  <SubjectComments subjectKey={selectedSubject} user={quizUser} />
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* ══ TAB: RANKING ══ */}
        {tab === 'ranking' && (
          <div role="tabpanel" aria-label="Tab Ranking" style={{ animation: 'qz-fade-up 0.4s ease' }}>
            <h2 className="qz-h2"><i className="fa-solid fa-trophy" aria-hidden="true" /> Leaderboard</h2>
            <p style={{ color: 'var(--qz-muted)', fontSize: '0.82rem', marginBottom: 16 }}>
              <Ico e={subjectInfo?.icon} /> {subjectInfo?.name} · {typeInfo?.label} ({TOTAL} Soal)
            </p>

            {/* ── ADMIN PANEL ── */}
            {isAdminUser && (
              <div className="qz-admin-panel">
                <div className="qz-admin-title"><i className="fa-solid fa-wrench" aria-hidden="true" /> Admin Panel — Reset Ranking</div>
                <div className="qz-admin-btns">
                  {subjects.filter(s => s.available).flatMap(subj =>
                    quizTypes.map(qt => (
                      <button
                        key={`${subj.key}_${qt.key}`}
                        className="qz-btn-danger"
                        onClick={() => handleAdminReset(subj.key, qt.key)}
                        disabled={adminStatus === 'resetting'}
                        title={`Reset leaderboard ${subj.name} · ${qt.label}`}
                      >
                        <i className="fa-solid fa-trash" aria-hidden="true" /> {subj.abbr} · {qt.soalCount}s
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
                    {adminStatus === 'done'      && 'Ranking berhasil direset!'}
                    {adminStatus.startsWith('err') && 'Gagal: ' + adminStatus.replace('err:', '')}
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
                <div className="qz-lb-rank qz-gold"><i className="fa-solid fa-crown" aria-hidden="true" /></div>
                <div className="qz-lb-avatar" style={{ background: 'linear-gradient(135deg,#fde68a,var(--warn))' }}>NS</div>
                <div style={{ flex: 1 }}>
                  <div className="qz-lb-name">{PINNED_TOP.name}</div>
                  <div className="qz-lb-meta">Skor Sempurna <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" /></div>
                </div>
                <div className="qz-lb-score">{PINNED_TOP.score}</div>
              </div>

              {lbLoading && <div className="qz-loading">Memuat ranking...</div>}
              {lbError   && <div className="qz-alert qz-alert-err" style={{ margin: 12 }}>{lbError}</div>}
              {!lbLoading && !lbError && lb.length === 0 && (
                <div className="qz-empty">Belum ada peserta. Jadilah yang pertama! <i className="fa-solid fa-rocket" aria-hidden="true" /></div>
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
                      <span className="qz-badge-mode">{row.mode === 'hard' ? 'Timed' : 'Unlimited'}</span>
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
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <Mascot
                size={120}
                mood={finalStat.correct / TOTAL >= 0.8 ? 'celebrate' : finalStat.correct / TOTAL >= 0.6 ? 'happy' : finalStat.correct / TOTAL >= 0.4 ? 'thinking' : 'sad'}
                label={finalStat.correct / TOTAL >= 0.8 ? 'Pico merayakan hasilmu' : finalStat.correct / TOTAL >= 0.6 ? 'Pico senang dengan hasilmu' : 'Pico menyemangatimu untuk terus belajar'}
              />
            </div>
            <h2 className="qz-h2" style={{ marginBottom: 4 }}>
              {finalStat.correct / TOTAL >= 0.8 ? 'Luar Biasa!' : finalStat.correct / TOTAL >= 0.6 ? 'Bagus!' : 'Terus Belajar!'}
            </h2>

            {/* Skor utama */}
            <div className="qz-result-score">{finalStat.score}</div>
            <div className="qz-result-details">
              <div className="qz-result-row"><span><i className="fa-solid fa-circle-check" aria-hidden="true" /> Benar</span><span>{finalStat.correct} / {TOTAL}</span></div>
              <div className="qz-result-row"><span><i className="fa-solid fa-circle-xmark" aria-hidden="true" /> Salah</span><span>{TOTAL - finalStat.correct} soal</span></div>
              {Object.keys(refleksiDone).length > 0 && (
                <div className="qz-result-row" style={{ fontSize: '0.78rem', color: 'var(--qz-muted)', paddingLeft: 14 }}>
                  <span><i className="fa-solid fa-repeat" aria-hidden="true" /> Pengulangan</span>
                  <span>
                    Benar {Object.values(refleksiDone).filter(v => v === 'benar').length} · Salah{' '}
                    {Object.values(refleksiDone).filter(v => v === 'salah').length}
                  </span>
                </div>
              )}
              <div className="qz-result-row"><span><i className="fa-solid fa-stopwatch" aria-hidden="true" /> Durasi</span><span>{formatDuration(finalStat.durationSec)}</span></div>
              <div className="qz-result-row"><span><i className="fa-solid fa-gamepad" aria-hidden="true" /> Mode</span><span>{finalStat.mode === 'hard' ? 'Timed' : 'Unlimited'}</span></div>
              {finalStat.refleksiPenalty > 0 && (
                <div className="qz-result-row"><span><i className="fa-solid fa-repeat" aria-hidden="true" /> Penalti Refleksi</span><span>−{finalStat.refleksiPenalty} poin</span></div>
              )}
            </div>

            {saveStatus === 'saved'    && <div className="qz-alert qz-alert-info"><i className="fa-solid fa-circle-check" aria-hidden="true" /> Skormu berhasil disimpan ke leaderboard!</div>}
            {saveStatus === 'notbest' && <div className="qz-alert qz-alert-warn"><i className="fa-solid fa-triangle-exclamation" aria-hidden="true" /> Skor ini tidak lebih baik dari rekormu sebelumnya.</div>}

            {isNewBest && (
              <div className="qz-new-best">
                <i className="fa-solid fa-medal" aria-hidden="true" /> Rekor baru! Skor tertinggimu untuk {subjectInfo?.abbr} · {typeInfo?.label}
              </div>
            )}

            {/* Saran belajar */}
            {finalStat && (() => {
              const pct  = Math.round((finalStat.correct / TOTAL) * 100);
              const sugg = getSuggestion(pct, subjectInfo?.name);
              return (
                <div style={{ background: 'color-mix(in srgb, var(--accent) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
                  borderRadius: 2, padding: '14px 16px', margin: '16px 0', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#b0a4ff', marginBottom: 6 }}>
                    <i className="fa-solid fa-lightbulb" aria-hidden="true" /> Saran Belajar
                  </div>
                  <div style={{ fontSize: '0.83rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{sugg}</div>
                  <div style={{ marginTop: 12 }}>
                    {!tgSent ? (
                      <button
                        onClick={sendToTelegram}
                        disabled={tgLoading}
                        style={{ background: 'rgba(0,136,204,0.15)', border: '1px solid rgba(0,136,204,0.35)',
                          color: '#5bc8f5', borderRadius: 2, padding: '7px 14px', cursor: 'pointer',
                          fontSize: '0.8rem', fontWeight: 600, opacity: tgLoading ? 0.6 : 1 }}
                      >
                        {tgLoading ? '⏳ Mengirim...' : 'Kirim Hasil ke Telegram'}
                      </button>
                    ) : (
                      <a
                        href="https://trakteer.id/synnnw"
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: 'color-mix(in srgb, var(--warn) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--warn) 35%, transparent)',
                          color: 'var(--warn)', borderRadius: 2, padding: '7px 14px',
                          fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}
                      >
                        <i className="fa-solid fa-mug-hot" aria-hidden="true" /> Support di Trakteer
                      </a>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Donasi QRIS + Trakteer */}
            {!qrisError && (
              <div className="qz-qris-card">
                <h4><i className="fa-solid fa-mug-hot" aria-hidden="true" /> Dukung Quiz Ini</h4>
                <p>Kalau quiz ini bermanfaat buat belajarmu, boleh banget traktir lewat QRIS atau Trakteer. Berapa pun sangat berarti <i className="fa-solid fa-hands-praying" aria-hidden="true" /></p>
                <img
                  src={QRIS_IMAGE}
                  alt="QRIS donasi"
                  className="qz-qris-img"
                  onClick={() => setQrisLarge(true)}
                  onError={() => setQrisError(true)}
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href={QRIS_IMAGE} download="qris-quiz-keperawatan.jpg" className="qz-btn qz-btn-secondary qz-btn-inline qz-btn-sm">
                    <i className="fa-solid fa-floppy-disk" aria-hidden="true" /> Simpan QRIS
                  </a>
                  <button className="qz-trakteer-btn" style={{ border: 'none', cursor: 'pointer' }} onClick={() => setQrisLarge(true)}>
                    <i className="fa-solid fa-mug-hot" aria-hidden="true" /> Trakteer
                  </button>
                </div>
              </div>
            )}

            {/* ── Community Wrong Stats ── */}
            {finalStat && (() => {
              // Soal yang salah di sesi ini
              const myWrongQIds = Object.entries(answers)
                .filter(([idx, sel]) => sel !== activeQuestions[Number(idx)]?.correct)
                .map(([idx]) => activeQuestions[Number(idx)]?.id)
                .filter(id => id != null);
              if (myWrongQIds.length === 0 || !communityStats) return null;
              const totalSessions = communityStats.ts || 1;
              const topWrong = myWrongQIds
                .map(qId => ({
                  qId,
                  pct: Math.round(((communityStats.wc?.[`q${qId}`] || 0) / totalSessions) * 100),
                }))
                .filter(x => x.pct > 0)
                .sort((a, b) => b.pct - a.pct)
                .slice(0, 5);
              if (topWrong.length === 0) return null;
              return (
                <div style={{
                  background: 'color-mix(in srgb, var(--bad) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--bad) 25%, transparent)',
                  borderRadius: 2, padding: '14px 16px', margin: '12px 0', textAlign: 'left',
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--bad)', marginBottom: 10 }}>
                    <i className="fa-solid fa-chart-simple" aria-hidden="true" /> Soal yang Banyak Salah (Kamu & Teman)
                  </div>
                  {topWrong.map(({ qId, pct }) => {
                    const q = activeQuestions.find(x => x.id === qId);
                    return (
                      <div key={qId} style={{
                        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
                        fontSize: '0.8rem', color: 'var(--text-dim)',
                      }}>
                        <div style={{
                          background: pct >= 60 ? 'color-mix(in srgb, var(--bad) 20%, transparent)' : 'color-mix(in srgb, var(--warn) 15%, transparent)',
                          border: `1px solid ${pct >= 60 ? 'color-mix(in srgb, var(--bad) 40%, transparent)' : 'color-mix(in srgb, var(--warn) 30%, transparent)'}`,
                          borderRadius: 6, padding: '2px 8px', flexShrink: 0,
                          fontWeight: 700, color: pct >= 60 ? 'var(--bad)' : 'var(--warn)', fontSize: '0.75rem',
                        }}>
                          {pct}% salah
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {q ? `Soal #${qId}: ${q.text?.slice(0, 60)}…` : `Soal #${qId}`}
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ fontSize: '0.73rem', color: 'color-mix(in srgb, var(--text-dim) 55%, transparent)', marginTop: 8 }}>
                    Berdasarkan {totalSessions} sesi quiz — kamu tidak sendirian! 
                  </div>
                </div>
              );
            })()}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              <button className="qz-btn qz-btn-secondary" onClick={() => { setShowResult(false); setTab('ranking'); }}>
                <i className="fa-solid fa-trophy" aria-hidden="true" /> Lihat Ranking
              </button>
              <button className="qz-btn qz-btn-primary" onClick={restartQuiz}>
                <i className="fa-solid fa-rotate" aria-hidden="true" /> Coba Lagi
              </button>
              <button className="qz-btn qz-btn-secondary" onClick={backToMenu}>
                <i className="fa-solid fa-house" aria-hidden="true" /> Kembali ke Menu
              </button>
            </div>

            {/* AI Disclaimer */}
            <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid color-mix(in srgb, var(--text) 6%, transparent)', color: 'color-mix(in srgb, var(--text-dim) 45%, transparent)', fontSize: '0.7rem', textAlign: 'center', lineHeight: 1.8 }}>
              <i className="fa-solid fa-robot" aria-hidden="true" /> Dibuat dengan bantuan AI: ChatGPT · Claude AI CLI · Gemini CLI
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

      {/* Cloudee — maskot interaktif: muncul di semua screen */}
      <CloudeeBubble quizState={cloudeeState} timeLeft={timeLeft} />
    </div>
  );
}