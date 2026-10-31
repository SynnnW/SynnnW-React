// src/components/CloudeeBubble.jsx
// Maskot kuis keperawatan — sekarang memakai <Mascot> (Pico, 3D + fallback 2D).
// Logika dipertahankan: bank pesan, deteksi streak benar/salah, peringatan waktu,
// reaksi login, reaksi klik berjenjang, hover, minimize. Yang diganti hanya wujud avatarnya.
// Pesan di bank berisi emoji lama; emoji dibuang saat ditampilkan (ikon = Font Awesome saja).

import { useState, useEffect, useRef, useCallback } from 'react';
import Mascot from './mascot/Mascot';

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
   MOOD per jenis reaksi (kontrak mood: idle|wave|thinking|happy|sad|celebrate)
════════════════════════════════════════════════════════════ */
const MOOD_FOR = {
  correct: 'happy', streak_correct: 'celebrate', wrong: 'sad', streak_wrong: 'sad',
  time_warning: 'thinking', loading: 'thinking', hover: 'wave', idle: 'idle',
  'finished-good': 'celebrate', 'finished-mid': 'happy', 'finished-bad': 'sad',
  'login-google': 'wave', 'login-anon': 'wave',
};

/* CLICK REACTIONS — diklik berurutan makin "parah" */
const CLICK_REACTIONS = [
  { mood: 'thinking', msg: 'Eh, jangan diklik! Fokus!' },
  { mood: 'thinking', msg: 'MASIH diklik juga?!' },
  { mood: 'sad',      msg: 'OKE! KAMU NGAJAK BERANTEM?!' },
  { mood: 'sad',      msg: 'Aku catat ini ya. Aku CATAT.' },
  { mood: 'happy',    msg: 'Hahaha kamu iseng banget' },
  { mood: 'sad',      msg: 'TOLONG! STOP! BANTUU!' },
  { mood: 'sad',      msg: 'Aku udah nyerah... kamu menang' },
  { mood: 'idle',     msg: 'Aku pura-pura tidur deh...' },
  { mood: 'idle',     msg: 'Zzzzzz... (aku mogok diklik)' },
];

const CLOUDEE_CSS = `
  .cloudee-wrap {
    position: fixed; right: 12px; bottom: calc(12px + env(safe-area-inset-bottom)); z-index: var(--z-float);
    display: flex; flex-direction: column; align-items: flex-end; gap: 8px; pointer-events: none;
  }
  .cloudee-wrap > * { pointer-events: auto; }
  .cloudee-bubble {
    position: relative; max-width: min(240px, 70vw); padding: 10px 14px; margin-right: 4px;
    background: var(--nm-bg); color: var(--text); border: 1px solid var(--border2); border-radius: var(--r-m);
    box-shadow: var(--nm-raise-sm); font-size: 13px; line-height: 1.45; font-family: var(--font-body);
    animation: cloudeePop var(--dur-base) var(--ease-out);
  }
  .cloudee-bubble-tail { position: absolute; bottom: -7px; right: 22px; width: 12px; height: 12px; background: var(--nm-bg); border-right: 1px solid var(--border2); border-bottom: 1px solid var(--border2); transform: rotate(45deg); }
  @keyframes cloudeePop { from { opacity: 0; transform: translateY(6px) scale(.97); } to { opacity: 1; transform: none; } }
  .cloudee-avatar { position: relative; cursor: pointer; border: 0; background: none; padding: 0; line-height: 0; border-radius: 50%; transition: width var(--dur-base) ease; }
  .cloudee-avatar:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
  .cloudee-mini-btn {
    position: absolute; top: -6px; left: -6px; width: 28px; height: 28px; display: grid; place-items: center;
    border-radius: 50%; border: 1px solid var(--border2); background: var(--nm-bg); color: var(--text); cursor: pointer;
    box-shadow: var(--nm-raise-sm); font-size: 11px; z-index: 2;
  }
  .cloudee-mini-btn:hover { color: var(--accent-text); }
  .cloudee-particle { position: absolute; border-radius: 2px; pointer-events: none; animation: cloudeeBurst .8s var(--ease-out) forwards; }
  @keyframes cloudeeBurst { from { opacity: 1; transform: translate(0,0) rotate(0); } to { opacity: 0; transform: translate(var(--px), var(--py)) rotate(160deg); } }
  @media (max-width: 520px) { .cloudee-wrap { right: 6px; } }
  @media (prefers-reduced-motion: reduce) { .cloudee-bubble, .cloudee-particle { animation: none !important; } .cloudee-particle { display: none; } }
`;

/* HELPER */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clean = (s) => String(s).replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '').replace(/\s{2,}/g, ' ').trim();
const PARTICLE_COLORS = ['#D7FF3A', '#FF8F7A', '#7CC4F2', '#F2C14E', '#ECE9E0'];

/* KOMPONEN UTAMA */
export default function CloudeeBubble({ quizState = 'idle', timeLeft = null }) {
  const [minimized, setMinimized]   = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [message, setMessage]       = useState('');
  const [mood, setMood]             = useState('idle');
  const [particles, setParticles]   = useState([]);

  const correctStreak   = useRef(0);
  const wrongStreak     = useRef(0);
  const clickCount      = useRef(0);
  const clickResetTimer = useRef(null);
  const bubbleTimer     = useRef(null);
  const moodRef         = useRef('idle');

  // Ganti mood; jika sama dengan sebelumnya, lewati idle sebentar agar reaksi diputar ulang.
  const applyMood = useCallback((next) => {
    if (moodRef.current === next && next !== 'idle') {
      moodRef.current = 'idle'; setMood('idle');
      setTimeout(() => { moodRef.current = next; setMood(next); }, 60);
    } else { moodRef.current = next; setMood(next); }
  }, []);

  const showReaction = useCallback((nextMood, msgsArr, duration = 5000) => {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    applyMood(nextMood);
    setMessage(clean(pick(msgsArr)));
    setShowBubble(true);
    bubbleTimer.current = setTimeout(() => { setShowBubble(false); applyMood('idle'); }, duration);
  }, [applyMood]);

  useEffect(() => () => { clearTimeout(bubbleTimer.current); clearTimeout(clickResetTimer.current); }, []);

  // Peringatan waktu (≤ 5 menit)
  const timeWarnShown = useRef(false);
  useEffect(() => {
    if (timeLeft === null || timeLeft > 300) { timeWarnShown.current = false; return; }
    if (!timeWarnShown.current) {
      timeWarnShown.current = true;
      showReaction(MOOD_FOR.time_warning, MSGS.time_warning, 6000);
    }
  }, [timeLeft, showReaction]);

  // Reaksi terhadap event kuis nyata
  useEffect(() => {
    if (quizState === 'idle') return;
    let key = quizState; let msgsArr; let duration = 5000;

    if (quizState === 'correct') {
      correctStreak.current += 1; wrongStreak.current = 0;
      key = correctStreak.current >= 3 ? 'streak_correct' : 'correct'; msgsArr = MSGS[key];
    } else if (quizState === 'wrong') {
      wrongStreak.current += 1; correctStreak.current = 0;
      key = wrongStreak.current >= 3 ? 'streak_wrong' : 'wrong'; msgsArr = MSGS[key];
    } else if (quizState === 'loading') {
      msgsArr = ['Hmm... soal apa ya...', 'Sebentar ya...']; duration = 3000;
    } else if (['finished-good', 'finished-mid', 'finished-bad'].includes(quizState)) {
      correctStreak.current = 0; wrongStreak.current = 0; msgsArr = MSGS[quizState]; duration = 8000;
    } else if (['login-google', 'login-anon'].includes(quizState)) {
      msgsArr = MSGS[quizState]; duration = 5000;
    } else { return; }

    if (!msgsArr) return;
    showReaction(MOOD_FOR[key] || 'idle', msgsArr, duration);
  }, [quizState, showReaction]);

  const spawnParticles = useCallback(() => {
    const ps = Array.from({ length: 7 }, (_, i) => ({
      id: Date.now() + i, color: pick(PARTICLE_COLORS),
      px: `${(Math.random() - 0.5) * 80}px`, py: `${-(40 + Math.random() * 50)}px`,
      size: 5 + Math.random() * 5, left: 20 + Math.random() * 60, top: 20 + Math.random() * 60,
    }));
    setParticles(ps);
    setTimeout(() => setParticles([]), 800);
  }, []);

  const handleAvatarClick = () => {
    spawnParticles();
    if (clickResetTimer.current) clearTimeout(clickResetTimer.current);
    const reaction = CLICK_REACTIONS[Math.min(clickCount.current, CLICK_REACTIONS.length - 1)];
    clickCount.current += 1;
    showReaction(reaction.mood, [reaction.msg], 3500);
    clickResetTimer.current = setTimeout(() => { clickCount.current = 0; }, 6000);
  };

  const handleMouseEnter = () => {
    if (!showBubble && MSGS.hover) showReaction(MOOD_FOR.hover, MSGS.hover, 2500);
  };

  return (
    <>
      <style>{CLOUDEE_CSS}</style>
      <div className="cloudee-wrap">
        {showBubble && !minimized && (
          <div className="cloudee-bubble" role="status" aria-live="polite">
            {message}
            <div className="cloudee-bubble-tail" />
          </div>
        )}
        <div style={{ position: 'relative' }}>
          <button
            type="button" className="cloudee-mini-btn"
            onClick={() => setMinimized(m => !m)}
            aria-label={minimized ? 'Tampilkan maskot' : 'Sembunyikan maskot'}
            aria-pressed={minimized}
          >
            <i className={minimized ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'} aria-hidden="true" />
          </button>
          <button
            type="button" className="cloudee-avatar"
            onMouseEnter={handleMouseEnter} onClick={handleAvatarClick}
            aria-label="Pico, maskot kuis. Klik untuk menyapa"
          >
            {particles.map(p => (
              <span key={p.id} className="cloudee-particle" style={{ '--px': p.px, '--py': p.py, background: p.color, width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%` }} />
            ))}
            <Mascot mood={mood} size={minimized ? 44 : 104} decorative trackPointer />
          </button>
        </div>
      </div>
    </>
  );
}
