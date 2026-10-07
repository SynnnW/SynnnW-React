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

// ═══ KONSTANTA ═══
const QUIZ_TITLE = 'Latihan Soal';
const ADMIN_EMAIL = 'aldokraksaan@gmail.com';
const MODE_CONFIG = {
  '100-sepele': { name: 'Sepele Mode', count: 100, timeLimit: 100 * 60, maxScore: 1000 },
  '100-hard': { name: 'nopal Sepele Mode', count: 100, timeLimit: 100 * 60, maxScore: 1000 },
  '40-unlimited': { name: 'Unlimited Quiz', count: 40, timeLimit: 45 * 60, maxScore: 400 },
};
const QRIS_IMAGE = '/assets/img/qris.jpg';
const LS_KEY = 'qz_v5';
const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

// Medal emojis untuk ranking
const MEDALS = ['🥇', '🥈', '🥉', '⭐', '✨'];

const quizApp = getApps().find(a => a.name === 'quiz') || initializeApp(getApp().options, 'quiz');
const quizAuth = getAuth(quizApp);
const quizDb = getFirestore(quizApp);

// ═══ UTILITY ═══
const fmt = (sec) => sec == null || sec < 0 ? '--' : `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
const score = (c, t, m) => Math.round((c / t) * m);
const isAdmin = (email) => email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

const CSS = `
.qz-root { 
  --qz-bg:#050509; --qz-surface:rgba(255,255,255,.06); 
  --qz-border:rgba(255,255,255,.12); --qz-text:#ffffff; 
  --qz-text-secondary:#e0e0e0; --qz-primary:#a78bfa; --qz-primary2:#5eead4; 
  --qz-success:#10b981; --qz-danger:#ef4444; --qz-radius:16px;
  font-family:'Inter',system-ui,sans-serif; background:var(--qz-bg); 
  color:var(--qz-text); min-height:100dvh; overflow-x:hidden;
}

.qz-root::before, .qz-root::after { 
  content:''; position:fixed; z-index:0; pointer-events:none; 
  width:500px; height:500px; border-radius:50%; filter:blur(120px); 
}
.qz-root::before { background:var(--qz-primary); top:-150px; left:-120px; opacity:.15; }
.qz-root::after { background:var(--qz-primary2); bottom:-180px; right:-120px; opacity:.1; }

.qz-wrap { max-width:640px; margin:0 auto; padding:0 20px 120px; position:relative; z-index:1; }

.qz-header { display:flex; align-items:center; gap:14px; padding:20px 0 16px; 
  border-bottom:1px solid var(--qz-border); margin-bottom:24px; position:sticky; top:0; 
  background:rgba(5,5,9,.9); backdrop-filter:blur(10px); z-index:20; }

.qz-title { flex:1; font-size:1.05rem; font-weight:700; color:var(--qz-text); }
.qz-back { background:none; border:1.5px solid var(--qz-border); color:var(--qz-text); 
  padding:9px 16px; border-radius:11px; cursor:pointer; transition:all .25s; font-weight:600; }
.qz-back:hover { color:var(--qz-primary); border-color:var(--qz-primary); }

.qz-card { background:var(--qz-surface); border:1px solid var(--qz-border); 
  border-radius:var(--qz-radius); padding:24px; margin-bottom:20px; backdrop-filter:blur(10px); }

.qz-h1 { font-size:clamp(1.8rem,6vw,2.8rem); font-weight:800; 
  background:linear-gradient(120deg,#fff 25%,var(--qz-primary) 100%); 
  -webkit-background-clip:text; background-clip:text; color:transparent; margin-bottom:12px; }

.qz-h2 { font-size:1.6rem; font-weight:700; margin-bottom:20px; color:var(--qz-text); }

.qz-modes { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.qz-mode-btn { padding:20px; background:var(--qz-surface); border:1.5px solid var(--qz-border); 
  border-radius:12px; cursor:pointer; transition:all .25s; text-align:center; color:var(--qz-text); }
.qz-mode-btn:hover { border-color:var(--qz-primary); background:rgba(167,139,250,.08); }
.qz-mode-btn .label { font-size:.9rem; font-weight:700; display:block; margin-bottom:8px; color:var(--qz-text); }
.qz-mode-btn .desc { font-size:.8rem; color:var(--qz-text-secondary); }

.qz-btn { width:100%; padding:14px; border:none; border-radius:12px; cursor:pointer; 
  font:600 .95rem 'Inter',system-ui; transition:all .25s; margin-top:12px; }
.qz-btn-primary { background:linear-gradient(135deg,#a78bfa,#7c5cdb); color:#fff; }
.qz-btn-primary:not(:disabled):hover { transform:translateY(-2px); box-shadow:0 12px 30px rgba(167,139,250,.4); }
.qz-btn-secondary { background:var(--qz-surface); border:1.5px solid var(--qz-border); color:var(--qz-text); }
.qz-btn-secondary:hover { border-color:var(--qz-primary); background:rgba(167,139,250,.05); }

.qz-sticky-bar { position:fixed; top:80px; right:20px; display:flex; gap:8px; z-index:19; }
.qz-stat { background:var(--qz-surface); border:1px solid var(--qz-border); 
  padding:8px 12px; border-radius:8px; font-size:.85rem; font-weight:700; color:var(--qz-text); backdrop-filter:blur(10px); }
.qz-stat-timer.danger { color:#ef4444; }

.qz-q-text { font-size:1.1rem; font-weight:600; margin:24px 0 16px; line-height:1.6; color:var(--qz-text); }
.qz-options { display:flex; flex-direction:column; gap:10px; }
.qz-option { width:100%; padding:14px 16px; background:var(--qz-surface); border:1.5px solid var(--qz-border); 
  border-radius:10px; text-align:left; cursor:pointer; transition:all .25s; color:var(--qz-text); }
.qz-option:hover { border-color:var(--qz-primary); background:rgba(167,139,250,.08); }
.qz-option.selected { border-color:var(--qz-primary); background:rgba(167,139,250,.15); }
.qz-option.correct { border-color:#10b981; background:rgba(16,185,129,.12); }
.qz-option.wrong { border-color:#ef4444; background:rgba(239,68,68,.12); }

.qz-feedback { padding:14px; border-radius:10px; margin-top:16px; font-size:.9rem; }
.qz-feedback.ok { background:rgba(16,185,129,.12); border:1px solid #10b981; color:#10b981; }
.qz-feedback.err { background:rgba(239,68,68,.12); border:1px solid #ef4444; color:#ef4444; }

.qz-prog-bar { width:100%; height:6px; background:var(--qz-border); border-radius:999px; 
  overflow:hidden; margin:20px 0; }
.qz-prog-fill { height:100%; background:linear-gradient(90deg,#a78bfa,#5eead4); transition:width .3s; }

.qz-nav-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(36px,1fr)); gap:6px; }
.qz-nav-cell { padding:8px; background:var(--qz-surface); border:1px solid var(--qz-border); 
  border-radius:6px; cursor:pointer; font-size:.75rem; font-weight:600; transition:all .2s; color:var(--qz-text); }
.qz-nav-cell.ok { background:#10b981; color:#fff; border-color:#10b981; }
.qz-nav-cell.err { background:#ef4444; color:#fff; border-color:#ef4444; }

/* RANKING STYLES - IMPROVED */
.qz-lb-container { display:flex; gap:12px; margin-bottom:20px; overflow-x:auto; padding-bottom:8px; }
.qz-lb-top-3 { flex:0 0 auto; width:calc(50% - 6px); }
.qz-lb-top-card { background:var(--qz-surface); border:1px solid var(--qz-border); border-radius:12px; padding:16px; text-align:center; }
.qz-lb-top-card.gold { background:linear-gradient(135deg,rgba(253,230,138,.12),rgba(245,158,11,.08)); border-color:rgba(245,158,11,.3); }
.qz-lb-top-card.silver { background:linear-gradient(135deg,rgba(229,231,235,.08),rgba(191,193,201,.06)); border-color:rgba(191,193,201,.2); }
.qz-lb-top-card.bronze { background:linear-gradient(135deg,rgba(228,127,86,.1),rgba(196,97,60,.06)); border-color:rgba(196,97,60,.25); }

.qz-lb-medal { font-size:2rem; margin-bottom:8px; }
.qz-lb-top-name { font-weight:700; font-size:.95rem; margin-bottom:4px; color:var(--qz-text); }
.qz-lb-top-score { font-size:1.5rem; font-weight:800; background:linear-gradient(135deg,var(--qz-primary),var(--qz-primary2)); -webkit-background-clip:text; background-clip:text; color:transparent; }
.qz-lb-top-meta { font-size:.75rem; color:var(--qz-text-secondary); margin-top:4px; }

.qz-lb-row { display:flex; align-items:center; gap:12px; padding:16px 14px; 
  border-bottom:1px solid var(--qz-border); transition:all .2s; }
.qz-lb-row:hover { background:rgba(167,139,250,.04); }
.qz-lb-rank { width:40px; height:40px; display:flex; align-items:center; justify-content:center; 
  background:var(--qz-surface); border-radius:8px; font-weight:800; font-size:.95rem; color:var(--qz-primary); }
.qz-lb-avatar { width:48px; height:48px; border-radius:10px; background:linear-gradient(135deg,var(--qz-primary),var(--qz-primary2)); 
  display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:.9rem; }
.qz-lb-info { flex:1; }
.qz-lb-name { font-weight:700; margin-bottom:4px; color:var(--qz-text); }
.qz-lb-meta { font-size:.8rem; color:var(--qz-text-secondary); }
.qz-lb-score { font-size:1.3rem; font-weight:800; color:var(--qz-primary); min-width:60px; text-align:right; }
.qz-lb-delete { background:none; border:none; color:#ef4444; cursor:pointer; font-size:1.1rem; transition:all .2s; padding:4px; }
.qz-lb-delete:hover { transform:scale(1.2); }

.qz-result { text-align:center; }
.qz-result-emoji { font-size:3rem; margin-bottom:16px; }
.qz-result-score { font-size:2.4rem; font-weight:800; background:linear-gradient(135deg,var(--qz-primary),var(--qz-primary2)); -webkit-background-clip:text; background-clip:text; color:transparent; margin:16px 0; }
.qz-result-details { background:var(--qz-surface); border:1px solid var(--qz-border); 
  border-radius:12px; padding:16px; margin:20px 0; }
.qz-result-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--qz-border); color:var(--qz-text); }
.qz-result-row:last-child { border-bottom:none; }

.qz-qris-section { background:linear-gradient(135deg,rgba(167,139,250,.08),rgba(94,234,212,.05)); border:1px solid var(--qz-border); border-radius:12px; padding:20px; margin:20px 0; text-align:center; }
.qz-qris-title { font-weight:700; font-size:.95rem; color:var(--qz-text); margin-bottom:12px; }
.qz-qris img { max-width:220px; border-radius:8px; border:2px solid var(--qz-border); }
.qz-qris-text { font-size:.8rem; color:var(--qz-text-secondary); margin-top:12px; }
.qz-motivation { text-align:center; color:var(--qz-text-secondary); font-size:.95rem; margin:16px 0; font-style:italic; }

.qz-modal { position:fixed; inset:0; background:rgba(0,0,0,.85); backdrop-filter:blur(4px); display:flex; 
  align-items:center; justify-content:center; z-index:999; }
.qz-modal-box { background:var(--qz-bg); border:1px solid var(--qz-border); 
  border-radius:var(--qz-radius); padding:24px; max-width:500px; margin:20px; max-height:80vh; overflow-y:auto; }

.qz-empty { text-align:center; padding:40px 20px; color:var(--qz-text-secondary); }

@keyframes qzFade { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
.qz-animate { animation:qzFade .4s ease; }

@media (max-width:640px) {
  .qz-modes { grid-template-columns:1fr; }
  .qz-sticky-bar { top:auto; bottom:100px; right:10px; flex-direction:column; }
  .qz-lb-container { margin-left:-20px; margin-right:-20px; padding-left:20px; padding-right:20px; }
}
`;

export default function Quizziz() {
  const nav = useNavigate();
  const [page, setPage] = useState('menu');
  const [mode, setMode] = useState(null);
  const [user, setUser] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalStat, setFinalStat] = useState(null);
  const [lbTab, setLbTab] = useState('100');
  const [lbData, setLbData] = useState([]);
  const [lbLoading, setLbLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);

  // Determine questions based on mode
  const QUESTIONS = useMemo(() => {
    if (mode === '100-sepele' || mode === '100-hard') {
      return questions100.slice(0, 100);
    } else if (mode === '40-unlimited') {
      return questions40.slice(0, 40);
    }
    return [];
  }, [mode]);

  const modeConfig = mode ? MODE_CONFIG[mode] : null;
  const TOTAL = QUESTIONS.length;
  const MAX_SCORE = modeConfig?.maxScore || 0;

  const currentScore = useMemo(() => {
    let c = 0;
    checked.forEach(i => {
      if (answers[i] === QUESTIONS[i]?.correct) c++;
    });
    return score(c, checked.size, MAX_SCORE);
  }, [answers, checked, QUESTIONS, MAX_SCORE]);

  // Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(quizAuth, (u) => {
      if (u) setUser(u);
    });
    return unsubscribe;
  }, []);

  // Timer
  useEffect(() => {
    if (page !== 'quiz' || !modeConfig) return;
    const initial = parseInt(localStorage.getItem(`${LS_KEY}_time`) || modeConfig.timeLimit);
    setTimeLeft(initial);
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0) {
          setShowResult(true);
          return 0;
        }
        localStorage.setItem(`${LS_KEY}_time`, t - 1);
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [page, modeConfig]);

  // Leaderboard
  useEffect(() => {
    if (page !== 'ranking' || !mode) return;
    setLbLoading(true);
    const col = mode.includes('100') ? 'leaderboard100' : 'leaderboard40';
    const q = query(collection(quizDb, col), orderBy('score', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snap) => {
      setLbData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLbLoading(false);
    });
    return unsubscribe;
  }, [page, mode]);

  const handleModeSelect = (m) => {
    if (!user) {
      signInAnonymously(quizAuth).catch(console.error);
      return;
    }
    setMode(m);
    setPage('quiz');
    setAnswers({});
    setChecked(new Set());
    localStorage.setItem(`${LS_KEY}_time`, MODE_CONFIG[m].timeLimit);
  };

  const selectAnswer = (idx) => {
    if (checked.has(currentQ)) return;
    setAnswers({ ...answers, [currentQ]: idx });
  };

  const checkAnswer = () => {
    if (answers[currentQ] == null) return;
    const newChecked = new Set(checked);
    newChecked.add(currentQ);
    setChecked(newChecked);
  };

  const goNext = () => {
    if (currentQ < TOTAL - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const c = [...checked].filter(i => answers[i] === QUESTIONS[i].correct).length;
      const s = score(c, TOTAL, MAX_SCORE);
      const duration = MODE_CONFIG[mode].timeLimit - timeLeft;
      setFinalStat({ correct: c, total: TOTAL, score: s, duration });
      setShowResult(true);
      saveScore(user.displayName || 'Anon', c, TOTAL, s, duration);
    }
  };

  const goPrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const goToQ = (idx) => {
    setCurrentQ(idx);
    setShowNav(false);
  };

  const saveScore = async (name, correct, total, s, dur) => {
    if (!user || !mode) return;
    try {
      setSaveStatus('saving');
      const col = mode.includes('100') ? 'leaderboard100' : 'leaderboard40';
      const docRef = doc(quizDb, col, user.uid);
      const newScore = score(correct, total, MAX_SCORE);
      const existing = (await getDoc(docRef)).data();
      if (existing && existing.score >= newScore) {
        setSaveStatus('notbest');
        return;
      }
      await setDoc(docRef, {
        uid: user.uid,
        name: name,
        email: user.email,
        photoURL: user.photoURL,
        score: newScore,
        correct,
        total,
        durationSec: dur,
        timestamp: serverTimestamp(),
      }, { merge: true });
      setSaveStatus('saved');
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('error');
    }
  };

  const deleteScore = async (id) => {
    if (!isAdmin(user?.email)) return;
    if (!confirm('Yakin hapus entry ini? 🗑️')) return;
    try {
      const col = lbTab === '100' ? 'leaderboard100' : 'leaderboard40';
      await deleteDoc(doc(quizDb, col, id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const restartQuiz = () => {
    setCurrentQ(0);
    setAnswers({});
    setChecked(new Set());
    setShowResult(false);
    setFinalStat(null);
    localStorage.setItem(`${LS_KEY}_time`, MODE_CONFIG[mode].timeLimit);
    setPage('quiz');
  };

  const backToMenu = () => {
    setCurrentQ(0);
    setAnswers({});
    setChecked(new Set());
    setShowResult(false);
    setFinalStat(null);
    setMode(null);
    setPage('menu');
  };

  if (!user) {
    return (
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-wrap">
          <div className="qz-card" style={{ textAlign: 'center', marginTop: '60px' }}>
            <h1 className="qz-h1">{QUIZ_TITLE}</h1>
            <p style={{ color: 'var(--qz-text-secondary)', marginBottom: '20px' }}>Silakan login untuk mulai belajar</p>
            <button className="qz-btn qz-btn-primary" onClick={() => signInWithPopup(quizAuth, new GoogleAuthProvider()).catch(console.error)}>
              🔐 Login dengan Google
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--qz-text-secondary)', fontSize: '.9rem' }}>
            <p>💪 Belajar Bersama | Raih Ranking Terbaik</p>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'menu') {
    return (
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '20px' }}>
            <h1 className="qz-h1">{QUIZ_TITLE}</h1>
            <button className="qz-back" onClick={() => signOut(quizAuth)}>Logout</button>
          </div>
          
          {/* QRIS Section */}
          <div className="qz-qris-section">
            <div className="qz-qris-title">☕ Support Quiz Development</div>
            <img src={QRIS_IMAGE} alt="QRIS Payment" style={{ maxWidth: '150px', borderRadius: '8px' }} />
            <div className="qz-qris-text">Bantu kami tambah soal & fitur baru 💪</div>
          </div>

          <div className="qz-card">
            <h2 className="qz-h2">Pilih Mode Latihan</h2>
            <div className="qz-modes">
              <div className="qz-mode-btn" onClick={() => handleModeSelect('100-sepele')}>
                <span className="label">📚 Sepele Mode</span>
                <span className="desc">100 soal • 100 min</span>
              </div>
              <div className="qz-mode-btn" onClick={() => handleModeSelect('100-hard')}>
                <span className="label">🔴 Hard Mode</span>
                <span className="desc">100 soal • 100 min</span>
              </div>
              <div className="qz-mode-btn" onClick={() => handleModeSelect('40-unlimited')}>
                <span className="label">⚡ Express Mode</span>
                <span className="desc">40 soal • 45 min</span>
              </div>
            </div>
          </div>

          <div className="qz-card">
            <button className="qz-btn qz-btn-primary" onClick={() => { setMode('100-sepele'); setPage('ranking'); }} style={{ marginTop: 0 }}>
              🏆 Lihat Ranking
            </button>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--qz-text-secondary)', marginTop: '40px', fontSize: '.85rem', marginBottom: '40px' }}>
            <p>Hallo <strong>{user.displayName || 'Learner'}</strong> 👋</p>
            <p style={{ marginTop: '8px' }}>✨ Raih skor tertinggi dan buktikan kemampuanmu!</p>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'quiz' && QUESTIONS.length > 0) {
    const q = QUESTIONS[currentQ];
    const isAnswered = answers[currentQ] != null;
    const isChecked = checked.has(currentQ);
    const isCorrect = isChecked && answers[currentQ] === q.correct;
    const progress = ((currentQ + 1) / TOTAL) * 100;

    return (
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-wrap">
          <div className="qz-header">
            <button className="qz-back" onClick={backToMenu}>←</button>
            <span className="qz-title">{currentQ + 1} / {TOTAL}</span>
          </div>

          <div className="qz-sticky-bar">
            <div className="qz-stat">⏱️ {fmt(timeLeft)}</div>
            <div className="qz-stat">✓ {checked.size}</div>
            <div className="qz-stat" style={{ color: 'var(--qz-primary)' }}>⭐ {currentScore}</div>
          </div>

          <div className="qz-prog-bar">
            <div className="qz-prog-fill" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="qz-card">
            <div style={{ fontSize: '.85rem', color: 'var(--qz-text-secondary)', marginBottom: '12px' }}>
              Pertanyaan {currentQ + 1}
            </div>
            <div className="qz-q-text">{q.text}</div>

            <div className="qz-options">
              {q.options.map((opt, i) => {
                let cls = 'qz-option';
                if (isAnswered && i === answers[currentQ]) cls += ' selected';
                if (isChecked) {
                  if (i === q.correct) cls += ' correct';
                  else if (i === answers[currentQ] && answers[currentQ] !== q.correct) cls += ' wrong';
                }
                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => !isChecked && selectAnswer(i)}
                    disabled={isChecked}
                  >
                    <strong>{OPTION_LABELS[i]}.</strong> {opt}
                  </button>
                );
              })}
            </div>

            {isChecked && (
              <div className={`qz-feedback ${isCorrect ? 'ok' : 'err'}`}>
                {isCorrect ? '✅ Benar! Bagus sekali.' : '❌ Salah. Lihat penjelasan:'} <br />
                <small style={{ marginTop: '8px', display: 'block' }}>{q.explanation}</small>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="qz-btn qz-btn-secondary" onClick={goPrev} style={{ flex: 1 }}>← Sebelumnya</button>
              {!isChecked && (
                <button className="qz-btn qz-btn-primary" onClick={checkAnswer} style={{ flex: 1 }} disabled={!isAnswered}>
                  ✓ Cek
                </button>
              )}
              {isChecked && (
                <button className="qz-btn qz-btn-primary" onClick={goNext} style={{ flex: 1 }}>
                  {currentQ === TOTAL - 1 ? '🏁 Selesai' : 'Selanjutnya →'}
                </button>
              )}
            </div>

            <button 
              className="qz-btn qz-btn-secondary"
              onClick={() => setShowNav(true)}
              style={{ marginTop: '8px', background: 'rgba(167,139,250,.08)' }}
            >
              🧭 Navigator Soal
            </button>
          </div>
        </div>

        {/* Navigator */}
        {showNav && createPortal(
          <div className="qz-modal" onClick={() => setShowNav(false)}>
            <div className="qz-modal-box">
              <h3 style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: '700', color: 'var(--qz-text)' }}>Navigator Soal</h3>
              <div style={{ fontSize: '.85rem', color: 'var(--qz-text-secondary)', marginBottom: '14px' }}>
                <span style={{ color: '#10b981' }}>■</span> Benar &nbsp;
                <span style={{ color: '#ef4444' }}>■</span> Salah &nbsp;
                <span style={{ color: 'var(--qz-text-secondary)' }}>■</span> Belum
              </div>
              <div className="qz-nav-grid">
                {QUESTIONS.map((_, i) => {
                  let cls = 'qz-nav-cell';
                  if (checked.has(i)) {
                    if (answers[i] === QUESTIONS[i].correct) cls += ' ok';
                    else cls += ' err';
                  }
                  return (
                    <button key={i} className={cls} onClick={() => goToQ(i)} style={{ opacity: i === currentQ ? 1 : 0.7 }}>
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }

  if (page === 'ranking') {
    return (
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-wrap">
          <div className="qz-header">
            <button className="qz-back" onClick={() => setPage('menu')}>←</button>
            <span className="qz-title">🏆 Leaderboard</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {['100', '40'].map(m => (
              <button key={m} onClick={() => setLbTab(m)} style={{
                flex: 1, padding: '10px', background: lbTab === m ? 'linear-gradient(135deg,#a78bfa,#7c5cdb)' : 'var(--qz-surface)',
                border: '1px solid var(--qz-border)', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: '600'
              }}>
                {m === '100' ? '📚 100 Soal' : '⚡ 40 Soal'}
              </button>
            ))}
          </div>

          <div className="qz-card">
            {/* Top 3 Podium */}
            {lbData.slice(0, 3).length > 0 && (
              <div className="qz-lb-container">
                {/* Gold - 1st Place */}
                {lbData[0] && (
                  <div className="qz-lb-top-3 qz-lb-top-card gold">
                    <div className="qz-lb-medal">🥇</div>
                    <div className="qz-lb-top-name">{lbData[0].name}</div>
                    <div className="qz-lb-top-score">{lbData[0].score}</div>
                    <div className="qz-lb-top-meta">{lbData[0].correct}/{lbData[0].total} ✓</div>
                  </div>
                )}
                
                {/* Silver - 2nd Place */}
                {lbData[1] && (
                  <div className="qz-lb-top-3 qz-lb-top-card silver">
                    <div className="qz-lb-medal">🥈</div>
                    <div className="qz-lb-top-name">{lbData[1].name}</div>
                    <div className="qz-lb-top-score">{lbData[1].score}</div>
                    <div className="qz-lb-top-meta">{lbData[1].correct}/{lbData[1].total} ✓</div>
                  </div>
                )}
              </div>
            )}

            {/* Rest of Rankings */}
            {lbLoading && <div className="qz-empty">Memuat ranking...</div>}
            {!lbLoading && lbData.length === 0 && <div className="qz-empty">Belum ada peserta 🚀</div>}

            {lbData.slice(2).map((row, i) => (
              <div key={row.id} className="qz-lb-row">
                <div className="qz-lb-rank">#{i + 3}</div>
                <div className="qz-lb-avatar">
                  {row.photoURL ? (
                    <img src={row.photoURL} alt="" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                  ) : (
                    row.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="qz-lb-info">
                  <div className="qz-lb-name">{row.name}</div>
                  <div className="qz-lb-meta">{row.correct}/{row.total} benar</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="qz-lb-score">{row.score}</div>
                  {isAdmin(user?.email) && (
                    <button onClick={() => deleteScore(row.id)} className="qz-lb-delete" title="Hapus entry">🗑️</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="qz-card">
            <button className="qz-btn qz-btn-primary" onClick={() => setPage('menu')} style={{ marginTop: 0 }}>
              🎯 Kembali ke Menu
            </button>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--qz-text-secondary)', marginTop: '40px', fontSize: '.85rem', marginBottom: '40px' }}>
            <p>🎊 Terus belajar dan raih posisi teratas!</p>
          </div>
        </div>
      </div>
    );
  }

  if (showResult && finalStat) {
    return (
      <div className="qz-root">
        <style>{CSS}</style>
        <div className="qz-wrap">
          <div className="qz-card qz-result qz-animate">
            <div className="qz-result-emoji">
              {finalStat.correct / TOTAL >= 0.8 ? '🎉' : finalStat.correct / TOTAL >= 0.6 ? '💪' : '📖'}
            </div>
            <h2 className="qz-h2">
              {finalStat.correct / TOTAL >= 0.8 ? 'Luar Biasa! 🌟' : finalStat.correct / TOTAL >= 0.6 ? 'Bagus! 💪' : 'Terus Belajar! 📚'}
            </h2>
            <div className="qz-result-score">{finalStat.score}</div>
            <p style={{ color: 'var(--qz-text-secondary)', fontSize: '.9rem', marginBottom: '20px' }}>dari {MAX_SCORE} poin</p>

            <div className="qz-result-details">
              <div className="qz-result-row">
                <span>✓ Benar</span>
                <span><strong>{finalStat.correct} / {TOTAL}</strong></span>
              </div>
              <div className="qz-result-row">
                <span>✗ Salah</span>
                <span><strong>{TOTAL - finalStat.correct}</strong></span>
              </div>
              <div className="qz-result-row">
                <span>📊 Akurasi</span>
                <span><strong>{Math.round((finalStat.correct / TOTAL) * 100)}%</strong></span>
              </div>
              <div className="qz-result-row">
                <span>💾 Status</span>
                <span>{saveStatus === 'saving' ? '⏳ Menyimpan...' : saveStatus === 'saved' ? '✅ Tersimpan' : saveStatus === 'notbest' ? '📊 Bukan terbaik' : '—'}</span>
              </div>
            </div>

            <div className="qz-motivation">
              💡 Terima kasih sudah belajar! Jangan lupa istirahat & minum air putih 💧
            </div>

            {/* QRIS & Donation */}
            <div className="qz-qris-section">
              <div className="qz-qris-title">☕ Bantu Kami Berkembang</div>
              <img src={QRIS_IMAGE} alt="QRIS" />
              <div className="qz-qris-text">Support = Soal & Fitur Lebih Banyak 🎯</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
              <button className="qz-btn qz-btn-primary" onClick={() => { setShowResult(false); setPage('ranking'); }}>🏆 Lihat Ranking</button>
              <button className="qz-btn qz-btn-secondary" onClick={restartQuiz}>🔄 Coba Lagi</button>
              <button className="qz-btn qz-btn-secondary" onClick={backToMenu}>🏠 Kembali Menu</button>
            </div>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--qz-text-secondary)', marginTop: '40px', fontSize: '.85rem', marginBottom: '40px' }}>
            <p>✨ Semangat terus belajar! Kamu bisa!</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
