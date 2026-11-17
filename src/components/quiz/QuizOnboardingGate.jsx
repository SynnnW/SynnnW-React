// src/components/quiz/QuizOnboardingGate.jsx
// Route guard untuk semua halaman Quiziz (/quiziz/* dan /quizizuas), dipasang sebagai layout route di App.jsx.
// Lolos kalau: (1) sudah login DAN (2) sudah pernah menyelesaikan onboarding (login + penjelasan + kuesioner).
// Selain itu diarahkan ke /quiziz/masuk, dengan ?next= supaya setelah selesai balik ke halaman tujuan.
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useQuizSession, fetchOnboardingStatus } from './quizOnboarding';

export default function QuizOnboardingGate() {
  const { pathname, search } = useLocation();
  const { ready, user } = useQuizSession();
  const [res, setRes] = useState({ uid: null, value: null }); // hasil cek terakhir, dikunci ke uid

  useEffect(() => {
    if (!ready || !user) return undefined;
    let alive = true;
    fetchOnboardingStatus(user.uid).then((s) => { if (alive) setRes({ uid: user.uid, value: s }); });
    return () => { alive = false; };
  }, [ready, user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  // null = masih memeriksa · 'done' | 'todo' | 'open'
  let status = null;
  if (ready) status = !user ? 'todo' : (res.uid === user.uid ? res.value : null);

  if (status === null) return <div className="qg-loading" role="status">Memeriksa sesi…</div>;
  if (status === 'todo') {
    const next = encodeURIComponent(pathname + search);
    return <Navigate to={`/quiziz/masuk?next=${next}`} replace />;
  }
  return <Outlet />; // 'done' atau 'open' (fail-open)
}
