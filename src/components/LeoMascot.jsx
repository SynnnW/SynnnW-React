import { useCallback, useEffect, useRef, useState } from 'react';
import { MASCOT_EVENT, readMascotHidden, writeMascotHidden } from '../lib/leoMascot';
import './leo-mascot.css';

const SLEEP_MS = 120000;
const HELLO_MS = 1200;
const BUBBLE_MS = 2500;
const THROTTLE_MS = 1000;
const GAZE_MS = 100;

export default function LeoMascot({ lang = 'id' }) {
  const [hidden, setHidden] = useState(readMascotHidden);
  const [mood, setMood] = useState('hello'); // eyes | asleep | hello
  const [bubble, setBubble] = useState(false);
  const rootRef = useRef(null);
  const moodRef = useRef('hello');
  const sleepTimer = useRef(0);
  const helloTimer = useRef(0);
  const bubbleTimer = useRef(0);

  const changeMood = useCallback((m) => { moodRef.current = m; setMood(m); }, []);

  // sync with the footer toggle / other tabs
  useEffect(() => {
    const on = () => setHidden(readMascotHidden());
    window.addEventListener(MASCOT_EVENT, on);
    window.addEventListener('storage', on);
    return () => { window.removeEventListener(MASCOT_EVENT, on); window.removeEventListener('storage', on); };
  }, []);

  // greeting on load, then settle
  useEffect(() => {
    helloTimer.current = window.setTimeout(() => changeMood('eyes'), HELLO_MS);
    return () => window.clearTimeout(helloTimer.current);
  }, [changeMood]);

  // idle detection: one passive listener, throttled, resets a single timeout. No rAF.
  useEffect(() => {
    if (hidden) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let last = 0;
    let lastGaze = 0;
    const armSleep = () => {
      window.clearTimeout(sleepTimer.current);
      sleepTimer.current = window.setTimeout(() => changeMood('asleep'), SLEEP_MS);
    };
    const onInput = (e) => {
      const now = Date.now();
      if (!reduced && fine && e.type === 'pointermove' && now - lastGaze >= GAZE_MS && moodRef.current === 'eyes' && rootRef.current) {
        lastGaze = now;
        const r = rootRef.current.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 200) * 3;
        rootRef.current.style.setProperty('--gx', `${((dx / d) * k).toFixed(2)}px`);
        rootRef.current.style.setProperty('--gy', `${((dy / d) * k).toFixed(2)}px`);
      }
      if (now - last < THROTTLE_MS) return;
      last = now;
      if (moodRef.current === 'asleep') {
        changeMood('hello');
        window.clearTimeout(helloTimer.current);
        helloTimer.current = window.setTimeout(() => changeMood('eyes'), HELLO_MS);
      }
      armSleep();
    };
    const opts = { passive: true };
    window.addEventListener('pointermove', onInput, opts);
    window.addEventListener('keydown', onInput, opts);
    window.addEventListener('scroll', onInput, opts);
    armSleep();
    return () => {
      window.removeEventListener('pointermove', onInput, opts);
      window.removeEventListener('keydown', onInput, opts);
      window.removeEventListener('scroll', onInput, opts);
      window.clearTimeout(sleepTimer.current);
    };
  }, [hidden, changeMood]);

  // pause the blink while the tab is hidden
  useEffect(() => {
    const on = () => rootRef.current?.setAttribute('data-vis', document.hidden ? '0' : '1');
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);

  useEffect(() => () => window.clearTimeout(bubbleTimer.current), []);

  const poke = () => {
    setBubble(true);
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(false), BUBBLE_MS);
  };

  if (hidden) return null;
  const en = lang === 'en';
  return (
    <div className="leo-m" ref={rootRef} data-mood={mood} data-vis="1">
      <span className={`leo-m-bubble${bubble ? ' on' : ''}`} role="status">{bubble ? (en ? 'Hi, I am Leo.' : 'Hai, aku Leo.') : ''}</span>
      <button type="button" className="leo-m-body" onClick={poke} aria-label={en ? 'Leo, the site mascot' : 'Leo, maskot situs'}>
        <span className="leo-m-eyes" aria-hidden="true"><i className="leo-m-eye" /><i className="leo-m-eye" /></span>
        <span className="leo-m-z" aria-hidden="true">z</span>
      </button>
      <button type="button" className="leo-m-hide" onClick={() => writeMascotHidden(true)} aria-label={en ? 'Hide Leo' : 'Sembunyikan Leo'}>×</button>
    </div>
  );
}
