// src/pages/quiziz/QuizKuesioner.jsx — route: /quiziz/kuesioner
// Kuesioner singkat; jawaban disimpan di Supabase (tabel quiz_onboarding) sekaligus menandai onboarding selesai.
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import QuizShell from '../../components/quiz/QuizShell';
import { useQuizSession, fetchOnboardingStatus, saveOnboarding, safeNext, GATE_ACK_KEY } from '../../components/quiz/quizOnboarding';
import '../../styles/quizGate.css';

const Q1 = [
  ['pas', 'Udah pas, nggak ada masalah'],
  ['meleset', 'Ada beberapa jawaban yang meleset'],
  ['ragu', 'Kurang yakin / nggak terlalu merhatiin'],
];
const Q2 = [
  ['luas', 'Udah luas, hampir semua kebahas'],
  ['lumayan', 'Lumayan, tapi ada bagian yang kelewat'],
  ['sedikit', 'Masih sedikit, banyak yang belum kesentuh'],
];
const Q3 = [
  ['ux', 'Tampilan/UX'], ['materi', 'Materi belum lengkap'], ['soal', 'Soal kurang variatif'],
  ['performa', 'Performa/loading'], ['lainnya', 'Lainnya'],
];

export default function QuizKuesioner() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const { ready, user } = useQuizSession();
  const [q1, setQ1] = useState(''); const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState([]); const [q3text, setQ3text] = useState('');
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');

  useEffect(() => {
    if (!ready || !user) return;
    fetchOnboardingStatus(user.uid).then((s) => { if (s === 'done' || s === 'open') navigate(next, { replace: true }); });
  }, [ready, user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return <div className="qg-loading" role="status">Memeriksa sesi…</div>;
  if (!user) return <Navigate to={`/quiziz/masuk?next=${encodeURIComponent(next)}`} replace />;

  const toggle = (k) => setQ3((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  const valid = q1 && q2 && (q3.length > 0 || q3text.trim().length > 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true); setErr('');
    try {
      await saveOnboarding(user, {
        v: 1,
        jawabanSoal: q1, cakupanMateri: q2, kekurangan: q3, kekuranganDetail: q3text.trim().slice(0, 1000),
      });
      try { sessionStorage.removeItem(GATE_ACK_KEY); } catch { /* abaikan */ }
      navigate(next, { replace: true });
    } catch {
      setErr('Jawabanmu belum tersimpan. Cek koneksi lalu coba kirim lagi.');
      setBusy(false);
    }
  };

  return (
    <QuizShell maxWidth={760}>
      <form className="qg-wrap" onSubmit={submit}>
        <div className="qg-head">
          <div className="qg-steps"><span className="qg-step done">1 · Penjelasan</span><span className="qg-step done">2 · Login</span><span className="qg-step on">3 · Kuesioner</span></div>
          <h1>Tiga pertanyaan singkat</h1>
          <p>Jawabanmu membantu kami memperbaiki Quiziz. Nggak ada jawaban benar atau salah.</p>
        </div>

        <fieldset className="qg-q">
          <legend>Soal-soal Quiziz kemarin, menurutmu gimana dari segi jawabannya?</legend>
          {Q1.map(([k, t]) => (
            <label className="qg-opt" key={k}><input type="radio" name="q1" value={k} checked={q1 === k} onChange={() => setQ1(k)} /> <span>{t}</span></label>
          ))}
        </fieldset>

        <fieldset className="qg-q">
          <legend>Soal kemarin udah nyakup banyak materi atau belum?</legend>
          {Q2.map(([k, t]) => (
            <label className="qg-opt" key={k}><input type="radio" name="q2" value={k} checked={q2 === k} onChange={() => setQ2(k)} /> <span>{t}</span></label>
          ))}
        </fieldset>

        <fieldset className="qg-q">
          <legend>Yang masih kurang dari web ini apa?</legend>
          {Q3.map(([k, t]) => (
            <label className="qg-opt" key={k}><input type="checkbox" checked={q3.includes(k)} onChange={() => toggle(k)} /> <span>{t}</span></label>
          ))}
          <textarea className="qg-text" value={q3text} maxLength={1000} onChange={(e) => setQ3text(e.target.value)} placeholder="Detail tambahan (opsional kalau sudah memilih di atas)" aria-label="Detail tambahan" />
        </fieldset>

        {err && <p className="qg-err" role="alert">{err}</p>}
        <div className="qg-actions">
          <button className="qg-btn" type="submit" disabled={!valid || busy}>{busy ? 'Menyimpan…' : 'Kirim & masuk ke Quiziz'}</button>
        </div>
      </form>
    </QuizShell>
  );
}
