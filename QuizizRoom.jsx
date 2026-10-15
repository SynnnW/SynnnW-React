// Cara pakai di QuizEngine / halaman manapun:
//   import MultiplayerRoom from '../components/quiz/MultiplayerRoom';
//   <MultiplayerRoom user={quizUser} onClose={() => setShowMP(false)} />
//
// Firestore schema  →  quizRooms/{roomCode}:
//   { roomCode, hostId, hostName, hostPhoto, maxPlayers,
//     status: 'waiting'|'playing'|'finished',
//     subject, questionCount, questionIds[],
//     players[{uid,name,photo}],
//     scores:{uid:{score,correct,total,avgTime,name,photo}},
//     createdAt, startedAt }

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getFirestore, doc, setDoc, getDoc, updateDoc,
  arrayUnion, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { getApp as getDefaultApp, getApps, initializeApp } from 'firebase/app';
import { questions as allQ100 } from '../../data/100soal';
import { grammarQuestions }    from '../../data/bi-grammar';
import { vocabularyQuestions } from '../../data/bi-vocabulary';
import { readingQuestions }    from '../../data/bi-reading';

/* ════════════════════════════════════════════════
   FIREBASE
════════════════════════════════════════════════ */
const getDb = () => {
  try {
    const apps = getApps();
    const quizApp = apps.find(a => a.name === 'quiz') || initializeApp(getDefaultApp().options, 'quiz');
    return getFirestore(quizApp);
  } catch { return getFirestore(); }
};

/* ════════════════════════════════════════════════
   CONSTANTS & CONFIG
════════════════════════════════════════════════ */
const COL = 'quizRooms';
const QTIME_DEFAULT = 20; // detik per soal

const SUBJECTS = [
  { key: 'kesglob', label: '🌍 Kesehatan Global',              color: '#10b981', desc: 'Epidemiologi, SDGs & sistem kesehatan dunia' },
  { key: 'ftk',    label: '🌿 Falsafah & Teori Keperawatan',   color: '#8b7bff', desc: 'Paradigma & teori-teori keperawatan' },
  { key: 'eng',    label: '🇬🇧 Bahasa Inggris',               color: '#3b82f6', desc: 'Grammar, Vocabulary & Reading — Keperawatan UNEJ' },
];
const QCOUNTS    = [10, 15, 20, 30];
const MAX_OPTS   = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const QTIME_OPTS = [15, 20, 30, 45];
const MEDALS     = ['🥇', '🥈', '🥉'];

/* ════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════ */
const genCode = () => {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => c[Math.floor(Math.random() * c.length)]).join('');
};

const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Ambil soal dari allQ100 berdasarkan subject + count, kembalikan array {id, text, options, correct} */
const pickQuestions = (subject, count) => {
  const mapQ = q => ({ id: q.id, text: q.text, options: q.options, correct: q.correctIndex });
  let pool;
  if (subject === 'kesglob') {
    pool = allQ100.filter(q => q.id >= 1 && q.id <= 100).map(mapQ);
    return shuffle(pool).slice(0, Math.min(count, pool.length));
  } else if (subject === 'ftk') {
    pool = allQ100.filter(q => q.id >= 101 && q.id <= 200).map(mapQ);
    return shuffle(pool).slice(0, Math.min(count, pool.length));
  } else {
    // eng — grammar + vocabulary di-shuffle, reading TIDAK di-shuffle (dijaga per passage group)
    // Beri ID konsisten: grammar 1-50, vocab 51-100, reading 101-150
    const GRAMMAR_COUNT  = grammarQuestions.length;     // 50
    const VOCAB_COUNT    = vocabularyQuestions.length;  // 50
    const TOTAL_NON_READ = GRAMMAR_COUNT + VOCAB_COUNT; // 100
    const grammarPool  = grammarQuestions.map((q, i) => ({
      id: i + 1,
      text: q.text, options: q.options, correct: q.correctIndex, passage: null,
    }));
    const vocabPool = vocabularyQuestions.map((q, i) => ({
      id: GRAMMAR_COUNT + i + 1,
      text: q.text, options: q.options, correct: q.correctIndex, passage: null,
    }));
    // Reading: pertahankan urutan dalam satu passage (group), tapi acak urutan antar group
    const readingGroupMap = {};
    readingQuestions.forEach((q, i) => {
      const key = q.passage; // gunakan teks passage sebagai kunci grup
      if (!readingGroupMap[key]) readingGroupMap[key] = [];
      readingGroupMap[key].push({
        id: TOTAL_NON_READ + i + 1,
        text: q.text, options: q.options, correct: q.correctIndex, passage: q.passage,
      });
    });
    // Acak urutan passage group, tapi pertahankan urutan soal dalam tiap group
    const readingPool = shuffle(Object.values(readingGroupMap)).flat();

    // Alokasi proporsional: 1/3 grammar, 1/3 vocab, 1/3 reading
    const readCount  = Math.round(count / 3);
    const nonRdCount = count - readCount;
    const gramCount  = Math.floor(nonRdCount / 2);
    const vocCount   = nonRdCount - gramCount;

    const shuffledGrammar = shuffle(grammarPool);
    const shuffledVocab   = shuffle(vocabPool);

    return [
      ...shuffledGrammar.slice(0, Math.min(gramCount, grammarPool.length)),
      ...shuffledVocab.slice(0, Math.min(vocCount, vocabPool.length)),
      ...readingPool.slice(0, Math.min(readCount, readingPool.length)),
    ].slice(0, count);
  }
};

/** Rekonstruksi soal dari array questionIds */
const getQsByIds = (subject, ids) => {
  const mapQ = q => ({ id: q.id, text: q.text, options: q.options, correct: q.correctIndex });
  let pool;
  if (subject === 'kesglob') {
    pool = allQ100.filter(q => q.id >= 1 && q.id <= 100).map(mapQ);
  } else if (subject === 'ftk') {
    pool = allQ100.filter(q => q.id >= 101 && q.id <= 200).map(mapQ);
  } else {
    // Bangun pool dengan ID yang sama persis seperti pickQuestions
    const GRAMMAR_COUNT  = grammarQuestions.length;
    const VOCAB_COUNT    = vocabularyQuestions.length;
    const TOTAL_NON_READ = GRAMMAR_COUNT + VOCAB_COUNT;
    const grammarPool = grammarQuestions.map((q, i) => ({
      id: i + 1,
      text: q.text, options: q.options, correct: q.correctIndex, passage: null,
    }));
    const vocabPool = vocabularyQuestions.map((q, i) => ({
      id: GRAMMAR_COUNT + i + 1,
      text: q.text, options: q.options, correct: q.correctIndex, passage: null,
    }));
    const readingPool = readingQuestions.map((q, i) => ({
      id: TOTAL_NON_READ + i + 1,
      text: q.text, options: q.options, correct: q.correctIndex, passage: q.passage,
    }));
    pool = [...grammarPool, ...vocabPool, ...readingPool];
  }
  return ids.map(id => pool.find(q => q.id === id)).filter(Boolean);
};

const calcScore = (correct, total, timesArr) => {
  if (!total) return 0;
  const base = Math.round((correct / total) * 2000);
  const avgTime = timesArr.length ? timesArr.reduce((a, b) => a + b, 0) / timesArr.length : QTIME_DEFAULT;
  const speedBonus = Math.round(Math.max(0, 500 - avgTime * 15));
  return base + speedBonus;
};

const fmtTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/* ════════════════════════════════════════════════
   CSS
════════════════════════════════════════════════ */
const CSS = `
.mp-overlay {
  position: fixed; inset: 0; z-index: 10000;
  background: linear-gradient(180deg, #0a0a1a 0%, #070714 60%, #0d0519 100%);
  display: flex; align-items: flex-start; justify-content: center;
  overflow-y: auto; padding: 20px 16px 40px;
  overflow: hidden;
}
/* ── CLOUDS ── */
@keyframes floatCloud1 {
  0%   { transform: translateX(-120px); opacity: 0; }
  5%   { opacity: 0.18; }
  95%  { opacity: 0.12; }
  100% { transform: translateX(calc(100vw + 120px)); opacity: 0; }
}
@keyframes floatCloud2 {
  0%   { transform: translateX(calc(100vw + 120px)); opacity: 0; }
  5%   { opacity: 0.14; }
  95%  { opacity: 0.08; }
  100% { transform: translateX(-120px); opacity: 0; }
}
.mp-cloud {
  position: fixed; pointer-events: none; z-index: 10001;
  will-change: transform;
}
.mp-cloud-1 { top: 8%;  animation: floatCloud1 28s linear infinite; }
.mp-cloud-2 { top: 20%; animation: floatCloud2 36s linear infinite 4s; }
.mp-cloud-3 { top: 35%; animation: floatCloud1 22s linear infinite 12s; }
.mp-cloud-4 { top: 55%; animation: floatCloud2 32s linear infinite 8s; }
.mp-cloud-5 { top: 72%; animation: floatCloud1 40s linear infinite 2s; }
.mp-cloud-6 { top: 88%; animation: floatCloud2 26s linear infinite 18s; }
.mp-overlay-scroll {
  width: 100%; display: flex; align-items: flex-start; justify-content: center;
  overflow-y: auto; padding: 20px 16px 40px; min-height: 100%;
  position: relative; z-index: 10002;
}
.mp-card {
  width: 100%; max-width: 560px;
  background: #0e0e1f; border: 1px solid rgba(139,123,255,0.2);
  border-radius: 20px; padding: 28px 24px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6);
  position: relative; margin: auto;
}
.mp-close {
  position: absolute; top: 14px; right: 14px;
  background: rgba(255,255,255,0.08); border: none; border-radius: 50%;
  width: 32px; height: 32px; cursor: pointer; color: #aaa;
  font-size: 1rem; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.mp-close:hover { background: rgba(255,80,80,0.2); color: #f87171; }
.mp-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(139,123,255,0.12); border: 1px solid rgba(139,123,255,0.3);
  border-radius: 20px; padding: 4px 12px; font-size: 0.72rem;
  font-weight: 700; color: #b0a4ff; letter-spacing: 0.1em; margin-bottom: 14px;
}
.mp-title {
  font-size: clamp(1.4rem, 4vw, 1.9rem); font-weight: 800;
  color: #e0e0ea; margin-bottom: 6px; line-height: 1.2;
}
.mp-subtitle { font-size: 0.85rem; color: #8888a0; margin-bottom: 24px; }
.mp-btn {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%; padding: 14px; border-radius: 12px;
  font-size: 0.95rem; font-weight: 700; cursor: pointer;
  border: none; transition: all 0.2s;
}
.mp-btn-primary {
  background: linear-gradient(135deg,#8b7bff,#6d5df0);
  color: #fff; box-shadow: 0 6px 20px rgba(139,123,255,0.3);
}
.mp-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(139,123,255,0.45); }
.mp-btn-secondary {
  background: rgba(255,255,255,0.06); color: #c0c0d0;
  border: 1px solid rgba(255,255,255,0.12);
}
.mp-btn-secondary:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
.mp-btn-danger {
  background: rgba(239,68,68,0.12); color: #f87171;
  border: 1px solid rgba(239,68,68,0.3);
}
.mp-btn-danger:hover:not(:disabled) { background: rgba(239,68,68,0.22); }
.mp-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.mp-divider {
  display: flex; align-items: center; gap: 12px; margin: 20px 0;
  color: rgba(140,140,160,0.5); font-size: 0.78rem;
}
.mp-divider::before,.mp-divider::after {
  content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08);
}
.mp-label {
  font-size: 0.75rem; font-weight: 700; color: #8888a0;
  text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; display: block;
}
.mp-input {
  width: 100%; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
  padding: 11px 14px; color: #e0e0ea; font-size: 0.9rem;
  font-family: inherit; outline: none; box-sizing: border-box;
  transition: border-color 0.2s;
}
.mp-input:focus { border-color: rgba(139,123,255,0.55); }
.mp-input-code {
  text-align: center; font-size: 1.8rem; font-weight: 800;
  letter-spacing: 0.3em; text-transform: uppercase;
}
.mp-select {
  width: 100%; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
  padding: 11px 14px; color: #e0e0ea; font-size: 0.88rem;
  font-family: inherit; outline: none; cursor: pointer; box-sizing: border-box;
}
.mp-select option { background: #1a1a2e; }
.mp-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.mp-subject-card {
  padding: 14px; border-radius: 12px; cursor: pointer;
  border: 2px solid rgba(255,255,255,0.08); transition: all 0.2s;
  background: rgba(255,255,255,0.03);
}
.mp-subject-card:hover { background: rgba(255,255,255,0.06); }
.mp-subject-card.selected { border-color: rgba(139,123,255,0.6); background: rgba(139,123,255,0.1); }
.mp-subject-label { font-size: 0.88rem; font-weight: 700; color: #e0e0ea; margin-bottom: 3px; }
.mp-subject-desc  { font-size: 0.72rem; color: #8888a0; line-height: 1.4; }
/* Room code display */
.mp-room-code {
  text-align: center; font-size: 2.8rem; font-weight: 900;
  letter-spacing: 0.35em; color: #8b7bff;
  background: rgba(139,123,255,0.08); border: 2px dashed rgba(139,123,255,0.35);
  border-radius: 14px; padding: 18px; margin: 16px 0;
  font-family: monospace;
}
.mp-room-hint { text-align: center; font-size: 0.78rem; color: #8888a0; margin-bottom: 20px; }
/* Lobby */
.mp-players { display: flex; flex-direction: column; gap: 8px; margin: 16px 0; }
.mp-player-row {
  display: flex; align-items: center; gap: 12px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px; padding: 10px 13px;
}
.mp-player-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(139,123,255,0.25); display: flex; align-items: center;
  justify-content: center; font-size: 1rem; flex-shrink: 0; overflow: hidden;
}
.mp-player-avatar img { width: 100%; height: 100%; object-fit: cover; }
.mp-player-name  { font-size: 0.88rem; font-weight: 600; color: #e0e0ea; flex: 1; }
.mp-player-badge { font-size: 0.68rem; color: #b0a4ff; background: rgba(139,123,255,0.15); padding: 2px 8px; border-radius: 20px; }
.mp-slot-empty {
  display: flex; align-items: center; gap: 12px;
  background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.08);
  border-radius: 10px; padding: 10px 13px; color: rgba(140,140,160,0.4); font-size: 0.82rem;
}
.mp-slot-dot { width: 36px; height: 36px; border-radius: 50%; border: 2px dashed rgba(255,255,255,0.1); flex-shrink: 0; }
.mp-status-bar {
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(255,255,255,0.04); border-radius: 10px; padding: 12px 16px;
  margin-bottom: 16px;
}
.mp-status-label { font-size: 0.82rem; color: #8888a0; }
.mp-status-value { font-size: 0.88rem; font-weight: 700; color: #b0a4ff; }
/* Quiz */
.mp-quiz-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px; padding-bottom: 14px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.mp-q-counter { font-size: 0.78rem; color: #8888a0; }
.mp-timer {
  font-size: 1.1rem; font-weight: 800; color: #10b981;
  background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3);
  border-radius: 8px; padding: 4px 12px;
  transition: all 0.5s;
}
.mp-timer.warn   { color: #fbbf24; background: rgba(251,191,36,0.1); border-color: rgba(251,191,36,0.3); }
.mp-timer.danger { color: #f87171; background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); }
.mp-progress-bar {
  height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px; margin-bottom: 18px; overflow: hidden;
}
.mp-progress-fill {
  height: 100%; background: linear-gradient(90deg,#8b7bff,#5eead4);
  border-radius: 2px; transition: width 1s linear;
}
.mp-q-text {
  font-size: 0.92rem; color: #e0e0ea; line-height: 1.65;
  margin-bottom: 18px; white-space: pre-wrap;
}
.mp-options { display: flex; flex-direction: column; gap: 9px; }
.mp-option {
  padding: 12px 15px; border-radius: 10px; cursor: pointer;
  border: 1.5px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04); color: #d0d0e0; font-size: 0.86rem;
  text-align: left; transition: all 0.2s; font-family: inherit;
}
.mp-option:hover:not(.locked) { background: rgba(139,123,255,0.12); border-color: rgba(139,123,255,0.4); }
.mp-option.selected { background: rgba(139,123,255,0.15); border-color: rgba(139,123,255,0.6); color: #e0e0ea; }
.mp-option.correct  { background: rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.5); color: #34d399; }
.mp-option.wrong    { background: rgba(239,68,68,0.1);   border-color: rgba(239,68,68,0.4);  color: #f87171; }
.mp-option.locked   { cursor: not-allowed; }
.mp-feedback {
  margin-top: 14px; padding: 10px 14px; border-radius: 10px;
  font-size: 0.85rem; font-weight: 600;
  display: flex; align-items: center; gap: 8px;
}
.mp-feedback.correct { background: rgba(16,185,129,0.1); color: #34d399; border: 1px solid rgba(16,185,129,0.25); }
.mp-feedback.wrong   { background: rgba(239,68,68,0.08); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
.mp-next-btn {
  margin-top: 14px; display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 11px; background: rgba(139,123,255,0.2);
  border: 1px solid rgba(139,123,255,0.4); border-radius: 10px;
  color: #b0a4ff; font-size: 0.88rem; font-weight: 700; cursor: pointer;
  font-family: inherit; transition: all 0.2s;
}
.mp-next-btn:hover { background: rgba(139,123,255,0.3); }
/* Waiting & Results */
.mp-waiting { text-align: center; padding: 24px 0; }
.mp-spin {
  width: 48px; height: 48px; border: 3px solid rgba(139,123,255,0.2);
  border-top-color: #8b7bff; border-radius: 50%;
  animation: mpSpin 1s linear infinite; margin: 0 auto 16px;
}
.mp-leaderboard { display: flex; flex-direction: column; gap: 8px; margin: 16px 0; }
.mp-lb-row {
  display: flex; align-items: center; gap: 12px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px; padding: 12px 14px;
}
.mp-lb-row.me { background: rgba(139,123,255,0.1); border-color: rgba(139,123,255,0.35); }
.mp-lb-rank   { font-size: 1.3rem; width: 32px; text-align: center; flex-shrink: 0; }
.mp-lb-info   { flex: 1; }
.mp-lb-name   { font-size: 0.88rem; font-weight: 600; color: #e0e0ea; }
.mp-lb-detail { font-size: 0.72rem; color: #8888a0; margin-top: 2px; }
.mp-lb-score  { font-size: 1.05rem; font-weight: 800; color: #b0a4ff; }
/* Error */
.mp-error {
  background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
  border-radius: 10px; padding: 10px 14px; color: #f87171;
  font-size: 0.83rem; margin: 10px 0;
}
.mp-warn-box {
  background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.3);
  border-radius: 14px; padding: 20px; text-align: center;
}
.mp-warn-icon { font-size: 2.5rem; margin-bottom: 12px; }
.mp-warn-title { font-size: 1rem; font-weight: 700; color: #fbbf24; margin-bottom: 8px; }
.mp-warn-text  { font-size: 0.85rem; color: #a0906a; line-height: 1.6; }
/* Stack buttons */
.mp-stack { display: flex; flex-direction: column; gap: 10px; }
/* Animations */
@keyframes mpSpin { to { transform: rotate(360deg); } }
@keyframes mpFadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.mp-card { animation: mpFadeUp 0.3s ease; }
/* Chip row */
.mp-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 0; }
.mp-chip {
  padding: 7px 14px; border-radius: 20px; cursor: pointer; font-size: 0.82rem; font-weight: 600;
  border: 1.5px solid rgba(255,255,255,0.1); color: #a0a0c0; background: rgba(255,255,255,0.04);
  transition: all 0.15s;
}
.mp-chip.active { background: rgba(139,123,255,0.2); border-color: rgba(139,123,255,0.55); color: #c0b4ff; }
/* Section spacing */
.mp-section { margin-bottom: 20px; }
/* Passage teks untuk soal Reading */
.mp-passage {
  background: rgba(94,234,212,0.06); border: 1px solid rgba(94,234,212,0.18);
  border-radius: 10px; padding: 14px; margin-bottom: 14px;
  max-height: 200px; overflow-y: auto;
}
.mp-passage::-webkit-scrollbar { width: 4px; }
.mp-passage::-webkit-scrollbar-thumb { background: rgba(94,234,212,0.3); border-radius: 2px; }
.mp-passage-label {
  font-size: 0.68rem; font-weight: 800; color: #5eead4;
  text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px;
}
.mp-passage-text {
  font-size: 0.82rem; color: #c8c8dc; line-height: 1.7; white-space: pre-wrap;
}
/* QRIS */
.mp-qris-box {
  margin-top: 20px; padding: 16px; text-align: center;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
}
.mp-qris-title { font-size: 0.88rem; font-weight: 700; color: #e0e0ea; margin-bottom: 4px; }
.mp-qris-sub   { font-size: 0.75rem; color: #8888a0; margin-bottom: 12px; }
.mp-qris-img   {
  width: 180px; height: 180px; object-fit: contain;
  border-radius: 10px; border: 2px solid rgba(255,255,255,0.1);
}
@media (max-width: 500px) {
  .mp-card { padding: 20px 16px; }
  .mp-room-code { font-size: 2rem; letter-spacing: 0.25em; }
  .mp-grid2 { grid-template-columns: 1fr; }
}
`;

/* ════════════════════════════════════════════════
   SUB-COMPONENTS
════════════════════════════════════════════════ */
function PlayerRow({ player, isHost, rank }) {
  return (
    <div className="mp-player-row">
      <div className="mp-player-avatar">
        {player.photo
          ? <img src={player.photo} alt={player.name} referrerPolicy="no-referrer" />
          : <span>{player.name?.[0]?.toUpperCase() ?? '?'}</span>}
      </div>
      <span className="mp-player-name">{player.name || 'Pemain'}</span>
      {isHost && <span className="mp-player-badge">👑 Host</span>}
    </div>
  );
}

function TimerBar({ timeLeft, timeMax }) {
  const pct = Math.max(0, (timeLeft / timeMax) * 100);
  const cls = timeLeft <= 5 ? 'danger' : timeLeft <= 10 ? 'warn' : '';
  return (
    <>
      <div className="mp-progress-bar">
        <div className="mp-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className={`mp-timer ${cls}`}>⏱ {timeLeft}s</div>
    </>
  );
}

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════
   CLOUD DECORATIONS
════════════════════════════════════════════════ */
const CloudSVG = ({ width = 160 }) => (
  <svg width={width} height={Math.round(width * 0.55)} viewBox="0 0 200 110" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="100" cy="78" rx="95" ry="36" fill="rgba(139,123,255,0.22)" />
    <ellipse cx="62"  cy="60" rx="52" ry="34" fill="rgba(94,234,212,0.16)" />
    <ellipse cx="132" cy="62" rx="50" ry="30" fill="rgba(139,123,255,0.18)" />
    <ellipse cx="100" cy="50" rx="42" ry="28" fill="rgba(160,140,255,0.2)" />
    <ellipse cx="78"  cy="44" rx="28" ry="22" fill="rgba(94,234,212,0.12)" />
  </svg>
);

const FloatingClouds = () => (
  <>
    <div className="mp-cloud mp-cloud-1"><CloudSVG width={210} /></div>
    <div className="mp-cloud mp-cloud-2"><CloudSVG width={160} /></div>
    <div className="mp-cloud mp-cloud-3"><CloudSVG width={250} /></div>
    <div className="mp-cloud mp-cloud-4"><CloudSVG width={185} /></div>
    <div className="mp-cloud mp-cloud-5"><CloudSVG width={230} /></div>
    <div className="mp-cloud mp-cloud-6"><CloudSVG width={145} /></div>
  </>
);

export default function MultiplayerRoom({ user, onClose }) {
  const db = getDb();

  /* ─ Screen management ─ */
  const [screen, setScreen] = useState('home');
  // home | creating | joining | lobby | quiz | waiting | results

  /* ─ Room state ─ */
  const [roomCode,  setRoomCode]  = useState('');
  const [roomData,  setRoomData]  = useState(null);
  const [isHost,    setIsHost]    = useState(false);

  /* ─ Create form ─ */
  const [fSubject,    setFSubject]    = useState('kesglob');
  const [fQCount,     setFQCount]     = useState(20);
  const [fMaxPlayers, setFMaxPlayers] = useState(4);
  const [fQTime,      setFQTime]      = useState(20);

  /* ─ Join form ─ */
  const [joinInput, setJoinInput] = useState('');

  /* ─ UI state ─ */
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  /* ─ Quiz state (local only, no Firestore writes during play) ─ */
  const [questions,   setQuestions]   = useState([]);
  const [currentQ,    setCurrentQ]    = useState(0);
  const [selected,    setSelected]    = useState(null);
  const [checked,     setChecked]     = useState(false);
  const [timeLeft,    setTimeLeft]    = useState(0);
  const [qStartTime,  setQStartTime]  = useState(0); // ms timestamp when question started
  const [answers,     setAnswers]     = useState([]); // [{correct: bool, time: sec}]

  /* ─ Results ─ */
  const [leaderboard, setLeaderboard] = useState([]);
  const [submitted,   setSubmitted]   = useState(false);
  const [myScore,     setMyScore]     = useState(null); // skor lokal setelah submit

  /* ─ Refs ─ */
  const unsubRef      = useRef(null);
  const timerRef      = useRef(null);
  const screenRef     = useRef(screen); // selalu mengikuti nilai screen terbaru
  const submittedRef  = useRef(false);  // guard double-submit

  // Sinkronkan screenRef setiap kali screen berubah
  useEffect(() => { screenRef.current = screen; }, [screen]);

  /* ─── Cleanup on unmount ─────────────────── */
  useEffect(() => {
    return () => {
      unsubRef.current?.();
      clearInterval(timerRef.current);
      // Kalau bukan host dan masih di lobby/quiz, hapus diri dari players
      if (roomCode && user && screenRef.current !== 'results') {
        removePlayer();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode]);

  /* ─── Lobby: refresh otomatis setiap 5 detik sebagai fallback ─── */
  useEffect(() => {
    if (screen !== 'lobby' || !roomCode) return;
    const pollId = setInterval(async () => {
      try {
        const snap = await getDoc(doc(db, COL, roomCode));
        if (!snap.exists()) return;
        const data = { id: snap.id, ...snap.data() };
        setRoomData(data);
        if (data.status === 'playing') {
          clearInterval(pollId);
          startLocalQuiz(data);
        }
      } catch { /* silent */ }
    }, 5000);
    return () => clearInterval(pollId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, roomCode]);

  /* ─── Remove self from players ─────────────── */
  const removePlayer = useCallback(async () => {
    if (!roomCode || !user) return;
    try {
      const ref = doc(db, COL, roomCode);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const data = snap.data();
      const newPlayers = (data.players || []).filter(p => p.uid !== user.uid);
      await updateDoc(ref, { players: newPlayers });
    } catch { /* silent */ }
  }, [db, roomCode, user]);

  /* ─── onSnapshot: Lobby ──────────────────── */
  const subscribeRoom = useCallback((code) => {
    unsubRef.current?.();
    const ref = doc(db, COL, code);
    unsubRef.current = onSnapshot(ref, snap => {
      if (!snap.exists()) { setError('Room sudah ditutup.'); setScreen('home'); return; }
      const data = { id: snap.id, ...snap.data() };
      setRoomData(data);
      // startLocalQuiz sendiri yang guard layar (quiz/waiting/results → skip)
      if (data.status === 'playing') {
        startLocalQuiz(data);
      }
      // Kalau semua sudah submit → tampilkan results
      if (data.status === 'finished') {
        const lb = buildLeaderboard(data);
        setLeaderboard(lb);
        setScreen('results');
        unsubRef.current?.();
      }
    }, err => { console.warn('[MP] snapshot error:', err); });
  }, [db]); // screen dihapus dari deps — gunakan screenRef.current

  /* ─── Build leaderboard from scores map ─────── */
  const buildLeaderboard = (data) => {
    const scores = data.scores || {};
    return Object.entries(scores)
      .map(([uid, s]) => ({ uid, ...s }))
      .sort((a, b) => {
        const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
        if (scoreDiff !== 0) return scoreDiff;
        // Tiebreaker: waktu rata-rata lebih cepat = lebih tinggi
        return (a.avgTime ?? 999) - (b.avgTime ?? 999);
      });
  };

  /* ─── Create Room ─────────────────────────── */
  const handleCreate = async () => {
    setLoading(true); setError('');
    try {
      const code = genCode();
      const payload = {
        roomCode:      code,
        hostId:        user.uid,
        hostName:      user.displayName || 'Host',
        hostPhoto:     user.photoURL    || null,
        maxPlayers:    fMaxPlayers,
        status:        'waiting',
        subject:       fSubject,
        questionCount: fQCount,
        questionTime:  fQTime,
        questionIds:   null,
        players: [{
          uid:   user.uid,
          name:  user.displayName || 'Host',
          photo: user.photoURL    || null,
        }],
        scores:    {},
        createdAt: serverTimestamp(),
        startedAt: null,
      };
      await setDoc(doc(db, COL, code), payload);
      setRoomCode(code);
      setIsHost(true);
      setRoomData(payload);
      subscribeRoom(code);
      setScreen('lobby');
    } catch (e) { setError('Gagal membuat room: ' + e.message); }
    setLoading(false);
  };

  /* ─── Join Room ─────────────────────────────── */
  const handleJoin = async () => {
    const code = joinInput.trim().toUpperCase();
    if (code.length !== 6) { setError('Kode room harus 6 karakter.'); return; }
    setLoading(true); setError('');
    try {
      const ref  = doc(db, COL, code);
      const snap = await getDoc(ref);
      if (!snap.exists()) { setError('Room tidak ditemukan. Cek kode lagi.'); setLoading(false); return; }
      const data = snap.data();
      if (data.status !== 'waiting') { setError('Permainan sudah dimulai atau selesai.'); setLoading(false); return; }
      if ((data.players || []).length >= data.maxPlayers) { setError(`Room sudah penuh (${data.maxPlayers}/${data.maxPlayers}).`); setLoading(false); return; }
      if ((data.players || []).some(p => p.uid === user.uid)) {
        // sudah join sebelumnya
      } else {
        await updateDoc(ref, {
          players: arrayUnion({
            uid:   user.uid,
            name:  user.displayName || 'Pemain',
            photo: user.photoURL    || null,
          }),
        });
      }
      setRoomCode(code);
      setIsHost(false);
      subscribeRoom(code);
      setScreen('lobby');
    } catch (e) { setError('Gagal bergabung: ' + e.message); }
    setLoading(false);
  };

  /* ─── Start Quiz (host only) ─────────────── */
  const handleStartQuiz = async () => {
    if (!isHost || !roomData) return;
    setLoading(true); setError('');
    try {
      const qs  = pickQuestions(roomData.subject, roomData.questionCount);
      const ids = qs.map(q => q.id);
      await updateDoc(doc(db, COL, roomCode), {
        status:      'playing',
        questionIds: ids,
        startedAt:   serverTimestamp(),
      });
      // onSnapshot akan trigger startLocalQuiz untuk semua pemain
    } catch (e) { setError('Gagal mulai: ' + e.message); }
    setLoading(false);
  };

  /* ─── Start local quiz (called from snapshot) ─ */
  const startLocalQuiz = useCallback((data) => {
    // Guard: jangan mulai ulang kalau sudah di quiz / waiting / results
    if (['quiz', 'waiting', 'results'].includes(screenRef.current)) return;
    unsubRef.current?.(); // stop lobby listener
    submittedRef.current = false; // reset guard submit
    const qs = getQsByIds(data.subject, data.questionIds || []);
    if (!qs.length) return; // soal belum siap, abaikan
    setQuestions(qs);
    setCurrentQ(0);
    setSelected(null);
    setChecked(false);
    setAnswers([]);
    setTimeLeft(data.questionTime || QTIME_DEFAULT);
    setQStartTime(Date.now());
    setScreen('quiz');
  }, []);

  /* ─── Per-question timer ─────────────────── */
  useEffect(() => {
    if (screen !== 'quiz') return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // Auto-advance: kalau belum jawab, anggap salah
          if (!checked) handleAutoAdvance();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ, screen]);

  const handleAutoAdvance = useCallback(() => {
    const timeTaken = roomData?.questionTime || QTIME_DEFAULT;
    const newAnswers = [...answers, { correct: false, time: timeTaken }];
    setAnswers(newAnswers);
    setChecked(true);
    setTimeout(() => goNextQ(newAnswers), 1000);
  }, [answers, roomData, currentQ, questions.length]); // eslint-disable-line

  /* ─── Select answer ─────────────────────── */
  const handleSelect = (idx) => {
    if (checked) return;
    setSelected(idx);
  };

  /* ─── Check / confirm answer ──────────────── */
  const handleCheck = useCallback(() => {
    if (selected == null || checked) return;
    clearInterval(timerRef.current);
    const q = questions[currentQ];
    const isCorrect = selected === q.correct;
    const timeTaken = Math.round((Date.now() - qStartTime) / 1000);
    const newAnswers = [...answers, { correct: isCorrect, time: Math.min(timeTaken, roomData?.questionTime || QTIME_DEFAULT) }];
    setAnswers(newAnswers);
    setChecked(true);
  }, [selected, checked, questions, currentQ, qStartTime, answers, roomData]);

  /* ─── Go to next question ─────────────────── */
  const goNextQ = useCallback((latestAnswers) => {
    const ans = latestAnswers ?? answers;
    if (currentQ + 1 >= questions.length) {
      // Quiz selesai — submit
      submitScore(ans);
      return;
    }
    const nextQ = currentQ + 1;
    setCurrentQ(nextQ);
    setSelected(null);
    setChecked(false);
    setTimeLeft(roomData?.questionTime || QTIME_DEFAULT);
    setQStartTime(Date.now());
  }, [currentQ, questions.length, answers, roomData]); // eslint-disable-line

  /* ─── Submit score (ONE write per player) ─── */
  const submitScore = useCallback(async (ans) => {
    // Guard: cegah double-submit (ranking bug)
    if (submittedRef.current) return;
    submittedRef.current = true;

    const correct = ans.filter(a => a.correct).length;
    const total   = ans.length;
    const times   = ans.map(a => a.time);
    const score   = calcScore(correct, total, times);
    const avgTime = times.length ? Math.round(times.reduce((a,b)=>a+b,0) / times.length) : 0;
    setMyScore({ score, correct, total, avgTime });
    setSubmitted(true);
    setScreen('waiting');
    try {
      const payload = { score, correct, total, avgTime, name: user.displayName || 'Pemain', photo: user.photoURL || null };
      await updateDoc(doc(db, COL, roomCode), {
        [`scores.${user.uid}`]: payload,
      });
      // Cek apakah semua pemain sudah submit → update status finished
      // Retry sekali untuk tangani race condition submit simultan
      let freshData = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        const freshSnap = await getDoc(doc(db, COL, roomCode));
        if (!freshSnap.exists()) break;
        freshData = freshSnap.data();
        const submittedCount = Object.keys(freshData.scores || {}).length;
        const playerCount    = (freshData.players || []).length;
        if (submittedCount >= playerCount) {
          await updateDoc(doc(db, COL, roomCode), { status: 'finished' });
          break;
        }
        if (attempt === 0) await new Promise(r => setTimeout(r, 800));
      }
      // Subscribe untuk dapat notifikasi saat semua selesai
      subscribeResults();
    } catch (e) { console.error('[MP] submit error:', e); }
  }, [db, roomCode, user]); // eslint-disable-line

  /* ─── Subscribe results (brief, unsubscribe when done) ─ */
  const subscribeResults = useCallback(() => {
    unsubRef.current?.();
    const ref = doc(db, COL, roomCode);
    unsubRef.current = onSnapshot(ref, snap => {
      if (!snap.exists()) return;
      const data = snap.data();
      if (data.status === 'finished') {
        setLeaderboard(buildLeaderboard(data));
        setScreen('results');
        unsubRef.current?.();
      }
    });
  }, [db, roomCode]);

  /* ─── Close / leave ──────────────────────── */
  const handleClose = async () => {
    unsubRef.current?.();
    clearInterval(timerRef.current);
    if (isHost && roomCode && screen !== 'results') {
      try {
        await updateDoc(doc(db, COL, roomCode), { status: 'finished' });
      } catch { /* ignore */ }
    } else if (!isHost && roomCode && screen === 'lobby') {
      await removePlayer();
    }
    onClose?.();
  };

  /* ─── Guard: Google only ─────────────────── */
  if (!user || user.isAnonymous) {
    return (
      <div className="mp-overlay">
        <style>{CSS}</style>
        <FloatingClouds />
        <div className="mp-card" style={{ marginTop: '10vh' }}>
          <button className="mp-close" onClick={onClose}>✕</button>
          <div className="mp-warn-box">
            <div className="mp-warn-icon">🔐</div>
            <div className="mp-warn-title">Akun Google Diperlukan</div>
            <div className="mp-warn-text">
              Fitur Kuis Multiplayer hanya tersedia untuk pengguna yang login
              menggunakan <strong>Akun Google</strong>. Login anonim tidak diperbolehkan.
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="mp-btn mp-btn-secondary" onClick={onClose} style={{ maxWidth: 200, margin: '0 auto' }}>
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════
     RENDER PER SCREEN
  ════════════════════════════════════════════ */

  // ── HOME ──────────────────────────────────
  if (screen === 'home') return (
    <div className="mp-overlay">
      <style>{CSS}</style>
      <div className="mp-card">
        <button className="mp-close" onClick={handleClose}>✕</button>
        <div className="mp-badge">🎮 MULTIPLAYER</div>
        <div className="mp-title">Kuis Bareng</div>
        <div className="mp-subtitle">
          Tantang teman satu kelas — 1v1 hingga 10 pemain secara real-time!
        </div>
        {error && <div className="mp-error">{error}</div>}
        <div className="mp-stack">
          <button className="mp-btn mp-btn-primary" onClick={() => { setError(''); setScreen('creating'); }}>
            ➕ Buat Room Baru
          </button>
          <button className="mp-btn mp-btn-secondary" onClick={() => { setError(''); setScreen('joining'); }}>
            🚪 Gabung Room
          </button>
        </div>
        <div style={{ marginTop: 20, padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: '0.78rem', color: '#8888a0', lineHeight: 1.7 }}>
          <strong style={{ color: '#c0c0d0' }}>Cara main:</strong><br />
          1. Host buat room & bagikan kode 6 huruf ke teman<br />
          2. Teman masukkan kode → masuk lobby<br />
          3. Host klik Mulai → semua kerjakan soal yang sama<br />
          4. Skor dihitung berdasarkan kebenaran & kecepatan jawab 🏆
        </div>
      </div>
    </div>
  );

  // ── CREATING ──────────────────────────────
  if (screen === 'creating') return (
    <div className="mp-overlay">
      <style>{CSS}</style>
      <div className="mp-card">
        <button className="mp-close" onClick={() => setScreen('home')}>✕</button>
        <div className="mp-badge">➕ BUAT ROOM</div>
        <div className="mp-title">Setup Room</div>
        <div className="mp-subtitle">Konfigurasi kuis sebelum mulai</div>
        {error && <div className="mp-error">{error}</div>}

        {/* Pilih Materi */}
        <div className="mp-section">
          <span className="mp-label">📚 Materi</span>
          <div className="mp-grid2">
            {SUBJECTS.map(s => (
              <div
                key={s.key}
                className={`mp-subject-card${fSubject === s.key ? ' selected' : ''}`}
                onClick={() => setFSubject(s.key)}
              >
                <div className="mp-subject-label">{s.label}</div>
                <div className="mp-subject-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Jumlah Soal */}
        <div className="mp-section">
          <span className="mp-label">📝 Jumlah Soal</span>
          <div className="mp-chips">
            {QCOUNTS.map(n => (
              <button key={n} className={`mp-chip${fQCount === n ? ' active' : ''}`} onClick={() => setFQCount(n)}>
                {n} soal
              </button>
            ))}
          </div>
        </div>

        {/* Waktu Per Soal */}
        <div className="mp-section">
          <span className="mp-label">⏱ Waktu per Soal</span>
          <div className="mp-chips">
            {QTIME_OPTS.map(t => (
              <button key={t} className={`mp-chip${fQTime === t ? ' active' : ''}`} onClick={() => setFQTime(t)}>
                {t}s
              </button>
            ))}
          </div>
        </div>

        {/* Maks Pemain */}
        <div className="mp-section">
          <span className="mp-label">👥 Maks Pemain</span>
          <div className="mp-chips">
            {MAX_OPTS.map(n => (
              <button key={n} className={`mp-chip${fMaxPlayers === n ? ' active' : ''}`} onClick={() => setFMaxPlayers(n)}>
                {n === 2 ? '1v1' : `${n} org`}
              </button>
            ))}
          </div>
        </div>

        <div className="mp-stack">
          <button className="mp-btn mp-btn-primary" onClick={handleCreate} disabled={loading}>
            {loading ? '⏳ Membuat...' : '🚀 Buat Room'}
          </button>
          <button className="mp-btn mp-btn-secondary" onClick={() => setScreen('home')} disabled={loading}>
            ← Kembali
          </button>
        </div>
      </div>
    </div>
  );

  // ── JOINING ──────────────────────────────
  if (screen === 'joining') return (
    <div className="mp-overlay">
      <style>{CSS}</style>
      <div className="mp-card">
        <button className="mp-close" onClick={() => setScreen('home')}>✕</button>
        <div className="mp-badge">🚪 GABUNG ROOM</div>
        <div className="mp-title">Masukkan Kode</div>
        <div className="mp-subtitle">Minta kode 6 huruf dari host</div>
        {error && <div className="mp-error">{error}</div>}

        <div className="mp-section">
          <input
            className="mp-input mp-input-code"
            maxLength={6}
            placeholder="• • • • • •"
            value={joinInput}
            onChange={e => setJoinInput(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            autoFocus
          />
        </div>

        <div className="mp-stack">
          <button className="mp-btn mp-btn-primary" onClick={handleJoin} disabled={loading || joinInput.length < 6}>
            {loading ? '⏳ Mencari room...' : '✔ Bergabung'}
          </button>
          <button className="mp-btn mp-btn-secondary" onClick={() => setScreen('home')} disabled={loading}>
            ← Kembali
          </button>
        </div>
      </div>
    </div>
  );

  // ── LOBBY ──────────────────────────────────
  if (screen === 'lobby') {
    const players   = roomData?.players || [];
    const maxP      = roomData?.maxPlayers || 2;
    const canStart  = isHost && players.length >= 2;
    const subjectLabel = SUBJECTS.find(s => s.key === roomData?.subject)?.label || roomData?.subject;

    return (
      <div className="mp-overlay">
        <style>{CSS}</style>
        <FloatingClouds />
        <div className="mp-card">
          <button className="mp-close" onClick={handleClose}>✕</button>
          <div className="mp-badge">🏠 LOBBY</div>

          {isHost ? (
            <>
              <div className="mp-title">Room Siap!</div>
              <div className="mp-subtitle">Bagikan kode ini ke temanmu 👇</div>
              <div className="mp-room-code">{roomCode}</div>
              <div className="mp-room-hint">Kode berlaku selama room aktif</div>
            </>
          ) : (
            <>
              <div className="mp-title">Menunggu Host</div>
              <div className="mp-subtitle">Host akan memulai kuis sebentar lagi...</div>
            </>
          )}

          {/* Status bar */}
          <div className="mp-status-bar">
            <div>
              <div className="mp-status-label">Pemain</div>
              <div className="mp-status-value">{players.length} / {maxP}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mp-status-label">Materi</div>
              <div className="mp-status-value" style={{ fontSize: '0.78rem' }}>{subjectLabel}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mp-status-label">Soal</div>
              <div className="mp-status-value">{roomData?.questionCount} × {roomData?.questionTime}s</div>
            </div>
          </div>

          {error && <div className="mp-error">{error}</div>}

          {/* Player list */}
          <div className="mp-players">
            {players.map((p, i) => (
              <PlayerRow key={p.uid} player={p} isHost={p.uid === roomData?.hostId} rank={i} />
            ))}
            {/* Empty slots */}
            {Array.from({ length: Math.max(0, Math.min(maxP, 6) - players.length) }).map((_, i) => (
              <div key={i} className="mp-slot-empty">
                <div className="mp-slot-dot" />
                Menunggu pemain...
              </div>
            ))}
            {maxP > 6 && players.length < maxP && (
              <div style={{ fontSize: '0.75rem', color: '#8888a0', textAlign: 'center', padding: '8px' }}>
                +{maxP - Math.min(players.length, 6)} slot tersisa
              </div>
            )}
          </div>

          <div className="mp-stack">
            {isHost ? (
              <button
                className="mp-btn mp-btn-primary"
                onClick={handleStartQuiz}
                disabled={!canStart || loading}
              >
                {loading ? '⏳ Memulai...' : canStart ? '▶ Mulai Kuis!' : `Minimal 2 pemain (${players.length}/${maxP})`}
              </button>
            ) : (
              <div style={{ textAlign: 'center', color: '#8888a0', fontSize: '0.83rem', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                ⏳ Menunggu host memulai kuis...
              </div>
            )}
            <button className="mp-btn mp-btn-danger" onClick={handleClose}>
              🚪 Keluar Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ ──────────────────────────────────
  if (screen === 'quiz') {
    const q    = questions[currentQ];
    const qMax = questions.length;
    const qTime = roomData?.questionTime || QTIME_DEFAULT;

    if (!q) return null;

    const isCheckedState = checked;
    const isCorrectAns   = isCheckedState && selected === q.correct;
    const isWrongAns     = isCheckedState && selected !== q.correct && selected != null;

    return (
      <div className="mp-overlay">
        <style>{CSS}</style>
        <FloatingClouds />
        <div className="mp-card">
          {/* Header */}
          <div className="mp-quiz-header">
            <div className="mp-q-counter">
              Soal {currentQ + 1} / {qMax} &nbsp;·&nbsp;
              {answers.filter(a => a.correct).length} benar
            </div>
            <div className={`mp-timer ${timeLeft <= 5 ? 'danger' : timeLeft <= 10 ? 'warn' : ''}`}>
              ⏱ {timeLeft}s
            </div>
          </div>

          {/* Progress bar */}
          <div className="mp-progress-bar">
            <div className="mp-progress-fill" style={{ width: `${(timeLeft / qTime) * 100}%` }} />
          </div>

          {/* Passage teks (khusus soal Reading) */}
          {q.passage && (
            <div className="mp-passage">
              <div className="mp-passage-label">📖 Bacaan</div>
              <div className="mp-passage-text">{q.passage}</div>
            </div>
          )}

          {/* Question */}
          <div className="mp-q-text">{q.text}</div>

          {/* Options */}
          <div className="mp-options">
            {q.options.map((opt, i) => {
              let cls = 'mp-option';
              if (isCheckedState) {
                cls += ' locked';
                if (i === q.correct)                    cls += ' correct';
                else if (i === selected && i !== q.correct) cls += ' wrong';
              } else if (i === selected) {
                cls += ' selected';
              }
              return (
                <button key={i} className={cls} onClick={() => handleSelect(i)}>
                  <span style={{ opacity: 0.5, marginRight: 8 }}>{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isCheckedState && (
            <div className={`mp-feedback ${isCorrectAns ? 'correct' : 'wrong'}`}>
              {isCorrectAns ? '✅ Benar!' : selected == null ? '⏰ Waktu habis!' : '❌ Salah!'}
              {!isCorrectAns && selected !== q.correct && (
                <span style={{ fontSize: '0.78rem', opacity: 0.8 }}>
                  &nbsp;Jawaban: {String.fromCharCode(65 + q.correct)}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          {!isCheckedState ? (
            <button
              className="mp-next-btn"
              onClick={handleCheck}
              disabled={selected == null}
              style={{ opacity: selected == null ? 0.4 : 1 }}
            >
              ✔ Kunci Jawaban
            </button>
          ) : (
            <button className="mp-next-btn" onClick={() => goNextQ()}>
              {currentQ + 1 >= qMax ? '📊 Lihat Hasil' : 'Soal Berikutnya →'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── WAITING ───────────────────────────────
  if (screen === 'waiting') return (
    <div className="mp-overlay">
      <style>{CSS}</style>
      <div className="mp-card" style={{ textAlign: 'center' }}>
        <div className="mp-badge" style={{ justifyContent: 'center', margin: '0 auto 16px' }}>
          ✅ SELESAI
        </div>
        <div className="mp-title">Kuis Selesai!</div>
        <div className="mp-subtitle">Menunggu pemain lain menyelesaikan soal...</div>

        {myScore && (
          <div style={{ background: 'rgba(139,123,255,0.1)', border: '1px solid rgba(139,123,255,0.3)', borderRadius: 14, padding: '20px', margin: '20px 0' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#b0a4ff' }}>{myScore.score.toLocaleString()}</div>
            <div style={{ fontSize: '0.82rem', color: '#8888a0', marginTop: 6 }}>
              {myScore.correct} / {myScore.total} benar &nbsp;·&nbsp; rata-rata {myScore.avgTime}s
            </div>
          </div>
        )}

        <div className="mp-waiting">
          <div className="mp-spin" />
          <div style={{ fontSize: '0.82rem', color: '#8888a0' }}>
            Leaderboard muncul saat semua pemain selesai...
          </div>
        </div>
      </div>
    </div>
  );

  // ── RESULTS ───────────────────────────────
  if (screen === 'results') {
    const myRank = leaderboard.findIndex(p => p.uid === user?.uid);
    return (
      <div className="mp-overlay">
        <style>{CSS}</style>
        <FloatingClouds />
        <div className="mp-card">
          <div className="mp-badge">🏆 HASIL AKHIR</div>
          <div className="mp-title" style={{ textAlign: 'center' }}>
            {myRank === 0 ? '🎉 Kamu Menang!' : myRank === 1 ? '🥈 Runner Up!' : myRank === 2 ? '🥉 Posisi 3!' : 'Leaderboard'}
          </div>
          <div className="mp-subtitle" style={{ textAlign: 'center' }}>
            Materi: {SUBJECTS.find(s => s.key === roomData?.subject)?.label}
          </div>

          <div className="mp-leaderboard">
            {leaderboard.map((p, i) => (
              <div key={p.uid} className={`mp-lb-row${p.uid === user?.uid ? ' me' : ''}`}>
                <div className="mp-lb-rank">{MEDALS[i] || `#${i + 1}`}</div>
                <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', background: 'rgba(139,123,255,0.2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                  {p.photo
                    ? <img src={p.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                    : p.name?.[0]?.toUpperCase()}
                </div>
                <div className="mp-lb-info">
                  <div className="mp-lb-name">{p.name}{p.uid === user?.uid ? ' (Kamu)' : ''}</div>
                  <div className="mp-lb-detail">{p.correct}/{p.total} benar · rata-rata {p.avgTime}s</div>
                </div>
                <div className="mp-lb-score">{p.score?.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: '0.75rem', color: '#8888a0', lineHeight: 1.6 }}>
            💡 Skor = (Benar/Total × 2000) + Bonus Kecepatan (max +500)
          </div>

          {/* QRIS */}
          <div className="mp-qris-box">
            <div className="mp-qris-title">☕ Dukung pengembangan kuis ini</div>
            <div className="mp-qris-sub">Scan QRIS untuk donasi — semua nominal diterima!</div>
            <img
              src="/assets/img/qris.jpg"
              alt="QRIS Donasi"
              className="mp-qris-img"
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

          <div className="mp-stack" style={{ marginTop: 20 }}>
            <button className="mp-btn mp-btn-primary" onClick={() => {
              submittedRef.current = false;
              setScreen('home'); setRoomCode(''); setRoomData(null);
              setIsHost(false); setLeaderboard([]); setSubmitted(false);
              setAnswers([]); setQuestions([]);
            }}>
              🔄 Main Lagi
            </button>
            <button className="mp-btn mp-btn-secondary" onClick={handleClose}>
              ✕ Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}