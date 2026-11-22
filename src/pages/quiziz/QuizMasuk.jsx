// src/pages/quiziz/QuizMasuk.jsx — route: /quiziz/masuk
// Langkah: (1) baca penjelasan sampai habis → centang → Lanjut → (2) login Google → (3) /quiziz/kuesioner
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import QuizShell from '../../components/quiz/QuizShell';
import { signInWithPopup } from '@/lib/authCompat';
import { useQuizSession, fetchOnboardingStatus, safeNext, GATE_ACK_KEY } from '../../components/quiz/quizOnboarding';
import '../../styles/quizGate.css';

export default function QuizMasuk() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const { ready, user } = useQuizSession();

  const [ack, setAck] = useState(() => { try { return sessionStorage.getItem(GATE_ACK_KEY) === '1'; } catch { return false; } });
  const [scrolledEnd, setScrolledEnd] = useState(false);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const boxRef = useRef(null);

  // Sudah login + sudah onboarding → tidak perlu di sini
  useEffect(() => {
    if (!ready || !user) return;
    let alive = true;
    fetchOnboardingStatus(user.uid).then((s) => {
      if (!alive) return;
      if (s === 'done' || s === 'open') navigate(next, { replace: true });
      else if (ack) navigate(`/quiziz/kuesioner?next=${encodeURIComponent(next)}`, { replace: true }); // balik dari OAuth
    });
    return () => { alive = false; };
  }, [ready, user?.uid, ack]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkScroll = useCallback(() => {
    const el = boxRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setScrolledEnd(true);
  }, []);
  useEffect(() => { checkScroll(); window.addEventListener('resize', checkScroll); return () => window.removeEventListener('resize', checkScroll); }, [checkScroll]);

  const goOn = () => {
    try { sessionStorage.setItem(GATE_ACK_KEY, '1'); } catch { /* abaikan */ }
    setAck(true);
    if (user) navigate(`/quiziz/kuesioner?next=${encodeURIComponent(next)}`);
  };

  const login = async () => {
    setBusy(true); setErr('');
    try { await signInWithPopup(); } // redirect ke Google, lalu balik ke halaman ini
    catch { setErr('Gagal membuka login Google. Coba lagi sebentar.'); setBusy(false); }
  };

  const step = !ack ? 1 : 2;
  return (
    <QuizShell maxWidth={760} variant="focus">
      <div className="qg-wrap">
        <div className="qg-head">
          <div className="qg-steps" aria-label="Langkah">
            <span className={`qg-step ${step === 1 ? 'on' : 'done'}`}>1 · Penjelasan</span>
            <span className={`qg-step ${step === 2 ? 'on' : ''}`}>2 · Login</span>
            <span className="qg-step">3 · Kuesioner</span>
          </div>
          <h1>Ada yang berubah di Quiziz</h1>
          <p>Sebelum lanjut, baca sebentar ya — cuma sekali per akun.</p>
        </div>

        {!ack && (
          <>
            <div className="qg-scroll" ref={boxRef} onScroll={checkScroll} tabIndex={0} aria-label="Penjelasan perubahan Quiziz">
              <h2>Kenapa sekarang harus login?</h2>
              <p>Quiziz lagi dalam tahap riset dan pengembangan. Kami nyoba cara baru supaya fitur ini makin pas buat kebutuhan belajar kalian, makanya alur masuknya sedikit berubah: login Google dulu, baca penjelasan ini, lalu isi kuesioner singkat.</p>
              <h2>Apa yang disimpan?</h2>
              <ul>
                <li>Identitas akun Google yang kamu pakai login (supaya status “sudah onboarding” nempel ke akun, bukan ke browser).</li>
                <li>Jawaban kuesioner kamu, dan progres belajar di halaman Materi.</li>
              </ul>
              <p>Data itu dipakai buat memperbaiki Quiziz dan nggak dijual atau dibagikan ke pihak lain.</p>
              <h2>Apa yang baru?</h2>
              <ul>
                <li><b>Materi</b> per mata kuliah, dibagi per bab, lengkap dengan pencarian dan penanda progres.</li>
                <li><b>Leo AI</b>, asisten chat di halaman Materi yang bisa membantu menjelaskan isi bab yang lagi kamu buka.</li>
                <li>Quiziz (latihan soal) tetap bisa dipakai seperti biasa.</li>
              </ul>
              <h2>Soal Leo AI dan privasi</h2>
              <p>Pesan yang kamu kirim ke Leo AI (beserta potongan materi yang lagi dibuka) diproses lewat layanan Gemini milik Google. Jadi jangan menulis data pribadi yang sensitif di kolom chat.</p>
              <h2>Soal keakuratan</h2>
              <p>Materi, soal, dan jawaban Leo AI dibuat dengan bantuan AI dan bisa saja keliru. Pakai sebagai bahan latihan mandiri, dan tetap cocokkan dengan materi resmi dari dosen pengampu.</p>
              <p>Kalau sudah sampai sini, kamu sudah membaca semuanya. Terima kasih sudah sabar!</p>
            </div>
            <p className="qg-hint" aria-live="polite">{scrolledEnd ? '' : 'Gulir penjelasan di atas sampai habis untuk mengaktifkan kotak centang.'}</p>

            <label className={`qg-check${scrolledEnd ? '' : ' disabled'}`}>
              <input type="checkbox" disabled={!scrolledEnd} checked={checked} onChange={(e) => setChecked(e.target.checked)} />
              <span>Saya sudah baca &amp; mengerti</span>
            </label>
            <div className="qg-actions">
              <button className="qg-btn" disabled={!checked} onClick={goOn}>Lanjut</button>
              <button className="qg-btn ghost" onClick={() => navigate('/')}>Kembali ke beranda</button>
            </div>
          </>
        )}

        {ack && (
          <>
            <div className="qg-safe">
              Sesi login ini aman — akun Google kamu cuma dipakai buat nyimpen progres belajar &amp; jawaban kuesioner, dan datamu nggak disebarluaskan ke pihak lain.
            </div>
            <div className="qg-actions">
              <button className="qg-btn" onClick={login} disabled={busy || !ready}>
                <i className="fa-brands fa-google" aria-hidden="true" /> {busy ? 'Membuka Google…' : 'Lanjutkan dengan Google'}
              </button>
              <button className="qg-btn ghost" onClick={() => { try { sessionStorage.removeItem(GATE_ACK_KEY); } catch { /* abaikan */ } setAck(false); }}>Baca ulang</button>
            </div>
            {err && <p className="qg-err" role="alert">{err}</p>}
          </>
        )}
      </div>
    </QuizShell>
  );
}
