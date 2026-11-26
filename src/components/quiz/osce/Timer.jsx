// src/components/quiz/osce/Timer.jsx
import { useEffect, useState } from 'react';
import { formatTimer } from './timerFormat';

/** @param {{ startedAt: string|number|Date }} props - sumber kebenaran waktu adalah startedAt, bukan state lokal */
export default function Timer({ startedAt }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const startMs = startedAt ? new Date(startedAt).getTime() : now;
  const elapsed = (now - startMs) / 1000;

  return (
    <span className="osce-timer" aria-live="off">
      <i className="fa-solid fa-stopwatch" aria-hidden="true" />
      <span className="osce-timer-value">{formatTimer(elapsed)}</span>
    </span>
  );
}
