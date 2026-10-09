// src/components/CloudeeBubble.jsx
// Cloudee — maskot interaktif quiz keperawatan
// Fitur: 23 animasi + 28 ekspresi, streak detection, click reactions,
//        login reactions, time warning, speech bubble lucu,
//        cursor eye-tracking (desktop), floating animation, efek 3D

import { useState, useEffect, useRef, useCallback } from 'react';
import { createAvatar } from '@bible-strong/avatar-react';
import '@bible-strong/avatar-react/styles.css';

/* ════════════════════════════════════════════════════════════
   BANK PESAN
════════════════════════════════════════════════════════════ */
const MSGS = {
  idle: [
    'Yuk semangat! Kamu bisa 💪',
    'Fokus ya, jangan asal pencet 😤',
    'Aku pantau dari sini loh 👀',
    'Gas! Calon Ners terbaik 🌟',
    'Santai dulu... tapi jangan kelamaan! ⏳',
    'Kamu pasti bisa kok! 🎯',
    'Hai! Sudah siap belajar? 📚',
    'Ingat, teliti sebelum jawab! 🔍',
  ],
  correct: [
    'Nahhh, gitu dong! 🎉',
    'Mantap jiwa! 🔥',
    'Yoi! Jawabanmu benar 🔥',
    'Benar! Aku bangga dikit.',
    'Nah, otaknya mulai panas nih.',
    'Wih, ternyata bisa juga 😭',
    'Cakep! Lanjut.',
    'BENAR! Jangan sampai lengah.',
    'Nah gini dong, jangan bikin aku khawatir.',
    'Satu poin buat kamu 😎',
    'Mantap! Akhirnya benar juga 😭',
    'Nah ini baru namanya niat belajar.',
    'YESSS! Itu dia! 🎊',
    'Ini baru calon perawat hebat 💉',
    'Benar banget! High five! ✋',
  ],
  wrong: [
    'Lah, kok bisa salah 😭',
    'Waduh… hampir… tapi salah 😭',
    'Aduh, dikit lagi benar loh!',
    'Eits, bukan itu jawabannya wkwk.',
    'Hmm… kayaknya kurang teliti deh.',
    'Kok malah pilih itu 😭',
    'Salahh! Coba mikir lagi.',
    'Nah loh… ketipu soal sendiri wkwk.',
    'Belum rezeki benar 😭',
    'Bentar… ini serius salah 😭',
    'Yah, padahal gampang loh 😭',
    'Kamu tadi bacanya nggak sampai habis ya? 😭',
    'Jawabanmu menarik. Salah, tapi menarik.',
    'Secara teknis… kamu baru saja melakukan kesalahan.',
    'Aku ingin membela kamu, tapi jawabannya memang salah.',
    'Soal segini kok salah 😭',
    'Ini bukan jebakan, kamu aja yang masuk sendiri.',
    'Soalnya gampang, yang susah mungkin fokusmu 😭',
    'Jangan bilang tadi asal pencet…',
    'Waduh, karakterku aja tahu jawabannya.',
    'Coba baca soalnya dulu, jangan langsung pencet.',
    'Kamu yakin? Aku kasih kesempatan terakhir buat menyesal. (tapi udah terlambat 😭)',
    'Hmm... sepertinya perlu belajar lagi nih 📖',
    'Jangan nyerah! Masih banyak soal 💪',
  ],
  streak_correct: [
    'Wih, lagi gacor nih orang.',
    'Buset, streak-nya jalan terus 🔥',
    'Jangan sombong dulu, soal susah belum keluar.',
    'Oke… kamu mulai bahaya.',
    'Waduh, otaknya sedang bekerja maksimal.',
    'Kok makin jago sih 😭',
    'Nah, terusin! Jangan putus streak.',
    'Aku mulai curiga kamu belajar diam-diam.',
    'Gacor terus, bosku.',
    '3 benar berturut-turut? Hmm menarik…',
    'Ini namanya LEGEND mode! 🏆',
    'Auto passing nih kayaknya 😏',
    'UNSTOPPABLE! 🚀',
  ],
  streak_wrong: [
    'Bro… kita perlu ngobrol.',
    'Kamu baik-baik aja kan? 😭',
    'Ini udah bukan kebetulan lagi.',
    'Salah lagi… 😭',
    'Aku mulai ikut sedih.',
    '3 kali salah? Ya ampun.',
    'Kayaknya kita balik belajar dari awal deh.',
    'Tenang, hidup masih panjang.',
    'Jangan menyerah, tapi tolong jangan salah lagi 😭',
    'Aku nggak marah… cuma kecewa dikit.',
    'Tarik napas dulu! Bismillah 🙏',
    'Pelan-pelan aja, yang penting teliti 🐢',
  ],
  time_warning: [
    'WOI, waktunya tipis! ⏰',
    'AYO CEPAT! ⏰',
    'Jangan bengonggg 😭',
    'Waktunya jalan terus loh!',
    'Pilih dulu, mikir belakangan 😭',
    'KOK MASIH MIKIR 😭',
    'Jawab sekarang atau menyesal!',
    '5 menit lagi! GAS! 🔥',
    'BURU-BURU! Waktu hampir habis! 🚨',
    'DEADLINE APPROACHING!! 💀',
  ],
  'finished-good': [
    'Gila, kamu jago juga.',
    'Hasil yang sangat tidak mengecewakan 🔥',
    'Mantap! Layak dapat tepuk tangan.',
    'Nah, ini baru hasil belajar.',
    'Keren sih, nggak bisa bohong.',
    'WOAAAH! Keren banget! 🏆',
    'Ini dia calon perawat terbaik! 🌟',
    'Hasilnya bagus! Aku ikut seneng 🥳',
  ],
  'finished-mid': [
    'Lumayan… tapi masih bisa lebih.',
    'Nggak jelek, tapi jangan puas dulu.',
    'Sudah bagus, tinggal sedikit lagi.',
    'Masih aman. Tinggal latihan lagi.',
    'Boleh bangga, tapi jangan terlalu cepat 😭',
    'Progress yang bagus! Terusin ya 📈',
    'Hampir sempurna! Next time pasti lebih baik 💪',
  ],
  'finished-bad': [
    'Kita anggap ini latihan pemanasan ya 😭',
    'Hmm… hasilnya agak memprihatinkan.',
    'Nggak apa-apa, yang penting sudah mencoba.',
    'Kayaknya kita perlu belajar lagi.',
    'Hari ini bukan harimu 😭',
    'Jangan sedih, kesempatan balas dendam masih ada.',
    'Rome wasn\'t built in a day! Semangat! 🔥',
    'Coba lagi ya! Aku percaya kamu bisa lebih baik 💕',
  ],
  'login-google': [
    'Wah keren pakai Google! 🔥',
    'Ooh, login Google! Data kamu aman tersimpan 😎',
    'Siap calon Ners! Langsung gas 💪',
    'Google login? Profesional banget wkwk.',
    'Selamat datang! Siap belajar bareng? 🎉',
    'Hai! Aku Cloudee, maskotmu! 👋',
  ],
  'login-anon': [
    'Anonim? Mau misterius ya? 😭',
    'Hmm, anonim nih… nilai-nya nggak kesimpen permanen loh 👀',
    'Main anonim? Bebas sih, asal belajar beneran 😭',
    'Ah oke anonim. Nggak apa-apa, semangat tetap harus ada!',
    'Mode incognito! Oke deh, aku jaga rahasiamu 🤫',
  ],
  hover: [
    'Eh, ngintip ya? 👀',
    'Hei! Mau apa? 😄',
    'Hai! Aku di sini loh! 👋',
    'Jangan galau, fokus! 🎯',
    'Psst... butuh bantuan? 🤫',
  ],
};

/* ════════════════════════════════════════════════════════════
   DISPLAY (animasi / ekspresi) PER STATE
════════════════════════════════════════════════════════════ */
const DISPLAYS = {
  idle: [
    { kind: 'animation',  key: 'idle' },
    { kind: 'animation',  key: 'listening' },
    { kind: 'expression', key: 'neutral' },
    { kind: 'expression', key: 'small-attentive' },
    { kind: 'expression', key: 'attentive-left' },
    { kind: 'expression', key: 'gentle-downward-gaze' },
    { kind: 'animation',  key: 'curious' },
    { kind: 'expression', key: 'curious-left' },
    { kind: 'expression', key: 'upward-side-glance' },
  ],
  correct: [
    { kind: 'animation',  key: 'celebrate' },
    { kind: 'animation',  key: 'happy' },
    { kind: 'animation',  key: 'excited' },
    { kind: 'animation',  key: 'proud' },
    { kind: 'animation',  key: 'laughing' },
    { kind: 'expression', key: 'joyful-wide' },
    { kind: 'expression', key: 'joyful-down-right' },
    { kind: 'expression', key: 'asymmetric-up-left' },
    { kind: 'expression', key: 'playful-right' },
  ],
  wrong: [
    { kind: 'animation',  key: 'sad' },
    { kind: 'animation',  key: 'surprised' },
    { kind: 'animation',  key: 'confused' },
    { kind: 'expression', key: 'uneasy-left' },
    { kind: 'expression', key: 'wide-downward-gaze' },
    { kind: 'expression', key: 'asymmetric-down-right' },
    { kind: 'expression', key: 'downward-gaze' },
    { kind: 'expression', key: 'wide-down-left' },
    { kind: 'expression', key: 'surprised-left' },
    { kind: 'expression', key: 'skeptical-right' },
  ],
  streak_correct: [
    { kind: 'animation',  key: 'excited' },
    { kind: 'animation',  key: 'celebrate' },
    { kind: 'animation',  key: 'laughing' },
    { kind: 'expression', key: 'joyful-wide' },
    { kind: 'expression', key: 'playful-right' },
    { kind: 'expression', key: 'far-right-glance' },
  ],
  streak_wrong: [
    { kind: 'animation',  key: 'sad' },
    { kind: 'animation',  key: 'drowsy' },
    { kind: 'animation',  key: 'bored' },
    { kind: 'expression', key: 'downward-gaze' },
    { kind: 'expression', key: 'sleepy-squint' },
    { kind: 'expression', key: 'drowsy-closed' },
    { kind: 'expression', key: 'eyes-closed' },
  ],
  time_warning: [
    { kind: 'animation',  key: 'scared' },
    { kind: 'animation',  key: 'surprised' },
    { kind: 'expression', key: 'surprised-wide-left' },
    { kind: 'expression', key: 'surprised-left' },
    { kind: 'expression', key: 'uneasy-left' },
  ],
  loading: [
    { kind: 'animation',  key: 'thinking' },
    { kind: 'animation',  key: 'searching' },
    { kind: 'expression', key: 'curious-left' },
    { kind: 'expression', key: 'upward-side-glance' },
    { kind: 'expression', key: 'small-attentive' },
  ],
  'finished-good': [
    { kind: 'animation',  key: 'celebrate' },
    { kind: 'animation',  key: 'proud' },
    { kind: 'animation',  key: 'excited' },
    { kind: 'expression', key: 'joyful-wide' },
    { kind: 'expression', key: 'joyful-down-right' },
  ],
  'finished-mid': [
    { kind: 'animation',  key: 'happy' },
    { kind: 'animation',  key: 'idle' },
    { kind: 'expression', key: 'gentle-downward-gaze' },
    { kind: 'expression', key: 'small-attentive' },
    { kind: 'expression', key: 'attentive-left' },
  ],
  'finished-bad': [
    { kind: 'animation',  key: 'sad' },
    { kind: 'animation',  key: 'drowsy' },
    { kind: 'expression', key: 'downward-gaze' },
    { kind: 'expression', key: 'uneasy-left' },
    { kind: 'expression', key: 'sleepy-squint' },
  ],
  'login-google': [
    { kind: 'animation',  key: 'excited' },
    { kind: 'animation',  key: 'celebrate' },
    { kind: 'animation',  key: 'happy' },
    { kind: 'expression', key: 'joyful-wide' },
    { kind: 'expression', key: 'joyful-down-right' },
  ],
  'login-anon': [
    { kind: 'animation',  key: 'suspicious' },
    { kind: 'animation',  key: 'curious' },
    { kind: 'animation',  key: 'confused' },
    { kind: 'expression', key: 'suspicious-right' },
    { kind: 'expression', key: 'skeptical-right' },
    { kind: 'expression', key: 'skeptical-left' },
    { kind: 'expression', key: 'far-right-glance' },
  ],
  hover: [
    { kind: 'animation',  key: 'playful' },
    { kind: 'animation',  key: 'happy' },
    { kind: 'expression', key: 'playful-right' },
    { kind: 'expression', key: 'joyful-wide' },
    { kind: 'expression', key: 'asymmetric-up-left' },
  ],
};

/* ════════════════════════════════════════════════════════════
   CLICK REACTIONS — diklik berurutan makin parah wkwk
════════════════════════════════════════════════════════════ */
const CLICK_REACTIONS = [
  { display: { kind: 'animation',  key: 'angry' },        msg: 'Dncok! 😤' },
  { display: { kind: 'expression', key: 'angry-brows' },  msg: 'MASIH diklik juga?! 😤' },
  { display: { kind: 'expression', key: 'angry-right' },  msg: 'Fokus DEKKK!!' },
  { display: { kind: 'expression', key: 'angry-left' },   msg: 'TM DPN MAJU KM DEK!!.' },
  { display: { kind: 'animation',  key: 'playful' },      msg: 'HOOOO SI ANYG 😭' },
  { display: { kind: 'animation',  key: 'scared' },       msg: 'Titut Capek ' },
  { display: { kind: 'animation',  key: 'sad' },          msg: 'Emm Iya² aku nyerah 😭' },
  { display: { kind: 'expression', key: 'drowsy-closed' },msg: 'Titut Sebel' },
  { display: { kind: 'animation',  key: 'sleeping' },     msg: 'Iwak Tempe' },
];

/* ════════════════════════════════════════════════════════════
   CSS GLOBAL — floating, 3D, glow, pop
════════════════════════════════════════════════════════════ */
const CLOUDEE_CSS = `
  @keyframes cloudeeFloat {
    0%  { transform: translateY(0px)   rotate(0deg); }
    20% { transform: translateY(-7px)  rotate(1.2deg); }
    40% { transform: translateY(-4px)  rotate(-0.5deg); }
    60% { transform: translateY(-9px)  rotate(0.8deg); }
    80% { transform: translateY(-3px)  rotate(-1deg); }
    100%{ transform: translateY(0px)   rotate(0deg); }
  }
  @keyframes cloudeePop {
    0%  { opacity:0; transform: scale(0.7) translateY(8px); }
    70% { opacity:1; transform: scale(1.06) translateY(-2px); }
    100%{ opacity:1; transform: scale(1) translateY(0); }
  }
  @keyframes cloudeeGlow {
    0%,100% { box-shadow: 0 0 18px rgba(139,123,255,0.35), 0 6px 24px rgba(0,0,0,0.4); }
    50%      { box-shadow: 0 0 32px rgba(139,123,255,0.6),  0 8px 30px rgba(0,0,0,0.45); }
  }
  @keyframes cloudeeParticle {
    0%   { opacity:1; transform: scale(1) translate(0,0); }
    100% { opacity:0; transform: scale(0.2) translate(var(--px),var(--py)); }
  }
  @keyframes bubbleBounce {
    0%  { transform: scale(1); }
    30% { transform: scale(1.04); }
    60% { transform: scale(0.97); }
    100%{ transform: scale(1); }
  }
  .cloudee-wrap {
    position: fixed;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    user-select: none;
  }
  .cloudee-avatar-float {
    animation: cloudeeFloat 5s ease-in-out infinite;
  }
  .cloudee-avatar-float.paused {
    animation-play-state: paused;
  }
  .cloudee-3d-wrap {
    perspective: 220px;
    transition: all 0.3s ease;
  }
  .cloudee-avatar-inner {
    transform-style: preserve-3d;
    transition: transform 0.15s ease-out;
    border-radius: 50%;
    animation: cloudeeGlow 3s ease-in-out infinite;
  }
  .cloudee-avatar-inner.no-3d {
    animation: none;
    box-shadow: none;
  }
  .cloudee-bubble {
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(8px);
    color: #1a1a2e;
    border-radius: 12px 12px 4px 12px;
    padding: 9px 13px;
    max-width: 175px;
    font-size: 11.5px;
    font-weight: 600;
    line-height: 1.55;
    box-shadow: 0 4px 24px rgba(0,0,0,0.28);
    animation: cloudeePop 0.28s ease;
    text-align: center;
    pointer-events: none;
    position: relative;
    animation: cloudeePop 0.28s ease, bubbleBounce 0.6s ease 0.28s;
  }
  .cloudee-bubble-tail {
    position: absolute;
    bottom: -7px;
    right: 14px;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-top: 7px solid rgba(255,255,255,0.96);
  }
  .cloudee-mini-btn {
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 99px;
    padding: 2px 7px;
    cursor: pointer;
    font-size: 9px;
    color: rgba(255,255,255,0.65);
    line-height: 1;
    transition: all 0.2s;
  }
  .cloudee-mini-btn:hover {
    background: rgba(255,255,255,0.22);
    color: #fff;
  }
  .cloudee-particle {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    pointer-events: none;
    animation: cloudeeParticle 0.7s ease-out forwards;
  }
  /* Mobile: sembunyikan efek 3D tilt, tetap floating */
  @media (hover: none) {
    .cloudee-avatar-inner {
      transform: none !important;
    }
  }
`;

/* ════════════════════════════════════════════════════════════
   HELPER
════════════════════════════════════════════════════════════ */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  (navigator.maxTouchPoints > 0 || 'ontouchstart' in window);

const PARTICLE_COLORS = ['#8b7bff','#5eead4','#fbbf24','#f472b6','#34d399','#60a5fa'];

/* ════════════════════════════════════════════════════════════
   KOMPONEN UTAMA
════════════════════════════════════════════════════════════ */
export default function CloudeeBubble({ quizState = 'idle', timeLeft = null }) {
  const avatarRef       = useRef(null);
  const containerRef    = useRef(null);
  const innerRef        = useRef(null);
  const [loaded, setLoaded]           = useState(false);
  const [minimized, setMinimized]     = useState(false);
  const [showBubble, setShowBubble]   = useState(false);
  const [message, setMessage]         = useState('');
  const [display, setDisplay]         = useState({ kind: 'animation', key: 'idle' });
  const [tilt, setTilt]               = useState({ x: 0, y: 0 }); // 3D tilt
  const [particles, setParticles]     = useState([]);              // click particles
  const [isHovered, setIsHovered]     = useState(false);

  const correctStreak   = useRef(0);
  const wrongStreak     = useRef(0);
  const clickCount      = useRef(0);
  const clickResetTimer = useRef(null);
  const bubbleTimer     = useRef(null);
  const idleTimer       = useRef(null);
  const timeWarnShown   = useRef(false);
  const mousePosRef     = useRef({ x: 0, y: 0 });
  const rafRef          = useRef(null);
  const isTouch         = useRef(isTouchDevice());

  // ── Load avatar JSON dari public/ ──────────────────────
  useEffect(() => {
    if (avatarRef.current) return;
    fetch('/cloudee.avatar.json')
      .then(r => r.json())
      .then(def => { avatarRef.current = createAvatar(def); setLoaded(true); })
      .catch(err => console.warn('[Cloudee] gagal load:', err));
  }, []);

  // ── Cursor tracking (desktop only) ─────────────────────
  useEffect(() => {
    if (isTouch.current) return;
    const handleMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const updateTilt = () => {
      if (!containerRef.current || minimized) { rafRef.current = requestAnimationFrame(updateTilt); return; }
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = mousePosRef.current.x - cx;
      const dy = mousePosRef.current.y - cy;
      // Clamp tilt ke max ±14 derajat
      const maxAngle = 14;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const tx = Math.max(-maxAngle, Math.min(maxAngle, (dx / vw)  * 28));
      const ty = Math.max(-maxAngle, Math.min(maxAngle, (dy / vh) * 28));
      setTilt({ x: tx, y: ty });
      rafRef.current = requestAnimationFrame(updateTilt);
    };
    rafRef.current = requestAnimationFrame(updateTilt);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [minimized]);

  // ── Helper: tampilkan reaksi ────────────────────────────
  const showReaction = useCallback((displaysArr, msgsArr, duration = 5000) => {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    setDisplay(pick(displaysArr));
    setMessage(pick(msgsArr));
    setShowBubble(true);
    bubbleTimer.current = setTimeout(() => {
      setShowBubble(false);
      setDisplay({ kind: 'animation', key: 'idle' });
    }, duration);
  }, []);

  // ── Idle wandering: ganti ekspresi random setiap 10–16 detik ──
  useEffect(() => {
    const scheduleIdle = () => {
      const delay = 10000 + Math.random() * 6000;
      idleTimer.current = setTimeout(() => {
        if (!showBubble) {
          const d = pick(DISPLAYS.idle);
          setDisplay(d);
        }
        scheduleIdle();
      }, delay);
    };
    scheduleIdle();
    return () => clearTimeout(idleTimer.current);
  }, [showBubble]);

  // ── Reaksi time warning ─────────────────────────────────
  useEffect(() => {
    if (timeLeft === null || timeLeft > 300) {
      timeWarnShown.current = false;
      return;
    }
    if (!timeWarnShown.current) {
      timeWarnShown.current = true;
      showReaction(DISPLAYS.time_warning, MSGS.time_warning, 6000);
    }
  }, [timeLeft, showReaction]);

  // ── Reaksi quizState ────────────────────────────────────
  useEffect(() => {
    if (quizState === 'idle') return;
    let displaysArr, msgsArr, duration = 5000;

    if (quizState === 'correct') {
      correctStreak.current += 1;
      wrongStreak.current    = 0;
      if (correctStreak.current >= 3) {
        displaysArr = DISPLAYS.streak_correct; msgsArr = MSGS.streak_correct;
      } else {
        displaysArr = DISPLAYS.correct; msgsArr = MSGS.correct;
      }
    } else if (quizState === 'wrong') {
      wrongStreak.current   += 1;
      correctStreak.current  = 0;
      if (wrongStreak.current >= 3) {
        displaysArr = DISPLAYS.streak_wrong; msgsArr = MSGS.streak_wrong;
      } else {
        displaysArr = DISPLAYS.wrong; msgsArr = MSGS.wrong;
      }
    } else if (quizState === 'loading') {
      displaysArr = DISPLAYS.loading;
      msgsArr     = ['Hmm... soal apa ya... 🤔', 'Loading... 🔍', 'Sebentar ya... ⏳'];
      duration    = 3000;
    } else if (['finished-good','finished-mid','finished-bad'].includes(quizState)) {
      correctStreak.current = 0;
      wrongStreak.current   = 0;
      displaysArr = DISPLAYS[quizState];
      msgsArr     = MSGS[quizState];
      duration    = 8000;
    } else if (['login-google','login-anon'].includes(quizState)) {
      displaysArr = DISPLAYS[quizState]; msgsArr = MSGS[quizState]; duration = 5000;
    } else { return; }

    showReaction(displaysArr, msgsArr, duration);
  }, [quizState, showReaction]);

  // ── Spawn particles ─────────────────────────────────────
  const spawnParticles = useCallback(() => {
    const ps = Array.from({ length: 7 }, (_, i) => ({
      id: Date.now() + i,
      color: pick(PARTICLE_COLORS),
      px: `${(Math.random() - 0.5) * 80}px`,
      py: `${-(40 + Math.random() * 50)}px`,
      size: 5 + Math.random() * 6,
      left: 20 + Math.random() * 60,
      top:  20 + Math.random() * 60,
    }));
    setParticles(ps);
    setTimeout(() => setParticles([]), 800);
  }, []);

  // ── Handle klik avatar ──────────────────────────────────
  const handleAvatarClick = () => {
    spawnParticles();
    if (clickResetTimer.current) clearTimeout(clickResetTimer.current);
    const idx      = Math.min(clickCount.current, CLICK_REACTIONS.length - 1);
    const reaction = CLICK_REACTIONS[idx];
    clickCount.current += 1;
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    setDisplay(reaction.display);
    setMessage(reaction.msg);
    setShowBubble(true);
    bubbleTimer.current = setTimeout(() => {
      setShowBubble(false);
      setDisplay({ kind: 'animation', key: 'idle' });
    }, 3500);
    clickResetTimer.current = setTimeout(() => { clickCount.current = 0; }, 6000);
  };

  // ── Handle hover ────────────────────────────────────────
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!showBubble) {
      setDisplay(pick(DISPLAYS.hover));
      setMessage(pick(MSGS.hover));
      setShowBubble(true);
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      bubbleTimer.current = setTimeout(() => {
        setShowBubble(false);
        setDisplay({ kind: 'animation', key: 'idle' });
      }, 2500);
    }
  };
  const handleMouseLeave = () => setIsHovered(false);

  if (!loaded || !avatarRef.current) return null;
  const Av     = avatarRef.current;
  const avProps = display.kind === 'animation'
    ? { animation: display.key }
    : { expression: display.key };

  // Tilt 3D berdasarkan kursor (disabled saat minimized atau touch device)
  const tiltStyle = (!minimized && !isTouch.current)
    ? { transform: `perspective(220px) rotateY(${tilt.x * 0.6}deg) rotateX(${-tilt.y * 0.4}deg)` }
    : {};

  const avatarSize = minimized ? '36px' : '64px';

  return (
    <>
      <style>{CLOUDEE_CSS}</style>

      <div className="cloudee-wrap" ref={containerRef}>

        {/* Speech bubble */}
        {showBubble && !minimized && (
          <div className="cloudee-bubble">
            {message}
            <div className="cloudee-bubble-tail" />
          </div>
        )}

        {/* Avatar + particles + float + 3D */}
        <div
          className={`cloudee-avatar-float${minimized ? ' paused' : ''}`}
          style={{ position: 'relative', cursor: 'pointer' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleAvatarClick}
          title="Klik aku!"
        >
          {/* Particles on click */}
          {particles.map(p => (
            <div
              key={p.id}
              className="cloudee-particle"
              style={{
                '--px': p.px, '--py': p.py,
                background: p.color,
                width: p.size, height: p.size,
                left: `${p.left}%`, top: `${p.top}%`,
              }}
            />
          ))}

          {/* 3D inner wrap */}
          <div
            ref={innerRef}
            className={`cloudee-avatar-inner${minimized ? ' no-3d' : ''}`}
            style={{
              width: avatarSize,
              height: avatarSize,
              transition: 'width 0.3s ease, height 0.3s ease',
              overflow: 'hidden',
              ...tiltStyle,
            }}
          >
            <Av {...avProps} size="100%" ariaLabel="Cloudee maskot" />
          </div>

          {/* Hover glow ring */}
          {isHovered && !minimized && (
            <div style={{
              position: 'absolute', inset: -4,
              borderRadius: '50%',
              border: '2px solid rgba(139,123,255,0.6)',
              boxShadow: '0 0 16px rgba(139,123,255,0.4)',
              pointerEvents: 'none',
              animation: 'cloudeeGlow 1.5s ease-in-out infinite',
            }} />
          )}
        </div>

        {/* Tombol minimize */}
        <button
          className="cloudee-mini-btn"
          onClick={() => setMinimized(m => !m)}
          title={minimized ? 'Tampilkan Cloudee' : 'Sembunyikan'}
        >
          {minimized ? '▲' : '▼'}
        </button>
      </div>
    </>
  );
}
