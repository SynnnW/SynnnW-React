// src/components/CloudeeBubble.jsx
// Cloudee — maskot interaktif quiz keperawatan
// Fitur: 23 animasi + 28 ekspresi, streak detection, click reactions,
//        login reactions, time warning, speech bubble lucu

import { useState, useEffect, useRef } from 'react';
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
  ],
  correct: [
    'Masih Soal Sepele ini!',
    'Goks😘',
    'Uhhhh Istimewa kamu',
    'Benar! Aku bangga dikit.',
    'Nah, otaknya mulai panas nih.',
    'Bah, ternyata bisa juga 😭',
    'Istimewa',
    'Njayyy',
    'Nah gini dong, jangan bikin aku khawatir.',
    'Satu poin buat kamu 😎',
    'Mantap! Akhirnya benar juga 😭',
    'Nah ini baru namanya niat belajar.',
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
  ],
  'finished-good': [
    'Gila, kamu jago juga.',
    'Hasil yang sangat tidak mengecewakan 🔥',
    'Mantap! Layak dapat tepuk tangan.',
    'Nah, ini baru hasil belajar.',
    'Keren sih, nggak bisa bohong.',
  ],
  'finished-mid': [
    'Lumayan… tapi masih bisa lebih.',
    'Nggak jelek, tapi jangan puas dulu.',
    'Sudah bagus, tinggal sedikit lagi.',
    'Masih aman. Tinggal latihan lagi.',
    'Boleh bangga, tapi jangan terlalu cepat 😭',
  ],
  'finished-bad': [
    'Kita anggap ini latihan pemanasan ya 😭',
    'Hmm… hasilnya agak memprihatinkan.',
    'Nggak apa-apa, yang penting sudah mencoba.',
    'Kayaknya kita perlu belajar lagi.',
    'Hari ini bukan harimu 😭',
    'Jangan sedih, kesempatan balas dendam masih ada.',
  ],
  'login-google': [
    'Wah keren pakai Google! 🔥',
    'Ooh, login Google! Data kamu aman tersimpan 😎',
    'Siap calon Ners! Langsung gas 💪',
    'Google login? Profesional banget wkwk.',
  ],
  'login-anon': [
    'Anonim? Mau misterius ya? 😭',
    'Hmm, anonim nih… nilai-nya nggak kesimpen permanen loh 👀',
    'Main anonim? Bebas sih, asal belajar beneran 😭',
    'Ah oke anonim. Nggak apa-apa, semangat tetap harus ada!',
  ],
};

/* ════════════════════════════════════════════════════════════
   DISPLAY (animasi / ekspresi) PER STATE
   kind: 'animation' | 'expression'
════════════════════════════════════════════════════════════ */
const DISPLAYS = {
  idle: [
    { kind: 'animation',  key: 'idle' },
    { kind: 'animation',  key: 'listening' },
    { kind: 'expression', key: 'neutral' },
    { kind: 'expression', key: 'small-attentive' },
    { kind: 'expression', key: 'attentive-left' },
    { kind: 'expression', key: 'gentle-downward-gaze' },
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
};

/* ════════════════════════════════════════════════════════════
   CLICK REACTIONS — diklik berurutan makin parah wkwk
════════════════════════════════════════════════════════════ */
const CLICK_REACTIONS = [
  { display: { kind: 'animation',  key: 'angry' },        msg: "Dancok! 😤' },
  { display: { kind: 'expression', key: 'angry-brows' },  msg: 'MASIH diklik juga?! 😤' },
  { display: { kind: 'expression', key: 'angry-right' },  msg: 'Fokus DEKKK!!' },
  { display: { kind: 'expression', key: 'angry-left' },   msg: 'TM DPN MAJU KM DEK!!.' },
  { display: { kind: 'animation',  key: 'playful' },      msg: 'HOOOO SI ANYG 😭' },
  { display: { kind: 'animation',  key: 'scared' },       msg: 'Oooooo Gitu km ' },
  { display: { kind: 'animation',  key: 'sad' },          msg: 'Emm Iya² aku nyerah 😭' },
  { display: { kind: 'expression', key: 'drowsy-closed' },msg: 'Aku pura-pura tidur deh...' },
  { display: { kind: 'animation',  key: 'sleeping' },     msg: 'Iwa Tempk' },
];

/* ════════════════════════════════════════════════════════════
   HELPER
════════════════════════════════════════════════════════════ */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ════════════════════════════════════════════════════════════
   KOMPONEN UTAMA
════════════════════════════════════════════════════════════ */
export default function CloudeeBubble({ quizState = 'idle', timeLeft = null }) {
  const avatarRef     = useRef(null);
  const [loaded, setLoaded]           = useState(false);
  const [minimized, setMinimized]     = useState(false);
  const [showBubble, setShowBubble]   = useState(false);
  const [message, setMessage]         = useState('');
  const [display, setDisplay]         = useState({ kind: 'animation', key: 'idle' });

  // Streak counters
  const correctStreak  = useRef(0);
  const wrongStreak    = useRef(0);

  // Click counter
  const clickCount     = useRef(0);
  const clickResetTimer = useRef(null);

  // Timers
  const bubbleTimer    = useRef(null);
  const timeWarnShown  = useRef(false);

  // ── Load avatar JSON dari public/ ──
  useEffect(() => {
    if (avatarRef.current) return;
    fetch('/cloudee.avatar.json')
      .then(r => r.json())
      .then(def => { avatarRef.current = createAvatar(def); setLoaded(true); })
      .catch(err => console.warn('[Cloudee] gagal load:', err));
  }, []);

  // ── Helper: tampilkan reaksi ──
  const showReaction = (displaysArr, msgsArr, duration = 5000) => {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    setDisplay(pick(displaysArr));
    setMessage(pick(msgsArr));
    setShowBubble(true);
    bubbleTimer.current = setTimeout(() => {
      setShowBubble(false);
      setDisplay({ kind: 'animation', key: 'idle' });
    }, duration);
  };

  // ── Reaksi time warning (hard mode) ──
  useEffect(() => {
    if (timeLeft === null || timeLeft > 300) {
      timeWarnShown.current = false;
      return;
    }
    if (!timeWarnShown.current) {
      timeWarnShown.current = true;
      showReaction(DISPLAYS.time_warning, MSGS.time_warning, 6000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // ── Reaksi quizState ──
  useEffect(() => {
    if (quizState === 'idle') return;

    let displaysArr, msgsArr, duration = 5000;

    if (quizState === 'correct') {
      correctStreak.current += 1;
      wrongStreak.current    = 0;
      if (correctStreak.current >= 3) {
        displaysArr = DISPLAYS.streak_correct;
        msgsArr     = MSGS.streak_correct;
      } else {
        displaysArr = DISPLAYS.correct;
        msgsArr     = MSGS.correct;
      }

    } else if (quizState === 'wrong') {
      wrongStreak.current   += 1;
      correctStreak.current  = 0;
      if (wrongStreak.current >= 3) {
        displaysArr = DISPLAYS.streak_wrong;
        msgsArr     = MSGS.streak_wrong;
      } else {
        displaysArr = DISPLAYS.wrong;
        msgsArr     = MSGS.wrong;
      }

    } else if (quizState === 'loading') {
      displaysArr = DISPLAYS.loading;
      msgsArr     = ['Hmm... soal apa ya... 🤔', 'Loading...', 'Sebentar ya...'];
      duration    = 3000;

    } else if (quizState === 'finished-good' || quizState === 'finished-mid' || quizState === 'finished-bad') {
      // Reset streak saat quiz selesai
      correctStreak.current = 0;
      wrongStreak.current   = 0;
      displaysArr = DISPLAYS[quizState];
      msgsArr     = MSGS[quizState];
      duration    = 8000; // lebih lama di akhir

    } else if (quizState === 'login-google' || quizState === 'login-anon') {
      displaysArr = DISPLAYS[quizState];
      msgsArr     = MSGS[quizState];
      duration    = 5000;

    } else {
      return;
    }

    showReaction(displaysArr, msgsArr, duration);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState]);

  // ── Handle klik avatar ──
  const handleAvatarClick = () => {
    if (clickResetTimer.current) clearTimeout(clickResetTimer.current);

    const idx     = Math.min(clickCount.current, CLICK_REACTIONS.length - 1);
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

    // Reset click counter 6 detik setelah terakhir klik
    clickResetTimer.current = setTimeout(() => { clickCount.current = 0; }, 6000);
  };

  // ── Jangan render kalau avatar belum load ──
  if (!loaded || !avatarRef.current) return null;
  const Av = avatarRef.current;
  const avProps = display.kind === 'animation'
    ? { animation: display.key }
    : { expression: display.key };

  return (
    <div style={{
      position: 'fixed',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '6px',
      userSelect: 'none',
    }}>

      {/* Speech bubble */}
      {showBubble && !minimized && (
        <div style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(8px)',
          color: '#1a1a2e',
          borderRadius: '12px 12px 4px 12px',
          padding: '8px 11px',
          maxWidth: '170px',
          fontSize: '11.5px',
          fontWeight: '600',
          lineHeight: '1.55',
          boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
          animation: 'cdpop 0.25s ease',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          {message}
          {/* Ekor bubble */}
          <div style={{
            position: 'absolute',
            bottom: '-7px',
            right: '14px',
            width: 0,
            height: 0,
            borderLeft: '7px solid transparent',
            borderTop: '7px solid rgba(255,255,255,0.96)',
          }} />
        </div>
      )}

      {/* Avatar */}
      <div
        onClick={handleAvatarClick}
        title="Klik aku!"
        style={{
          width: minimized ? '38px' : '62px',
          height: minimized ? '38px' : '62px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.38))',
        }}
      >
        <Av {...avProps} size="100%" ariaLabel="Cloudee mascot" />
      </div>

      {/* Tombol minimize kecil */}
      <button
        onClick={() => setMinimized(m => !m)}
        title={minimized ? 'Tampilkan Cloudee' : 'Sembunyikan'}
        style={{
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '99px',
          padding: '2px 7px',
          cursor: 'pointer',
          fontSize: '9px',
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 1,
        }}
      >
        {minimized ? '▲' : '▼'}
      </button>

      <style>{`
        @keyframes cdpop {
          from { opacity: 0; transform: translateY(5px) scale(0.93); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
}
