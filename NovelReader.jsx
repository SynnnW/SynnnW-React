// src/components/NovelReader.jsx
// ─────────────────────────────────────────────────────────────
// Reader ala "novel di browser" — satu kolom, nyaman dibaca di HP
// maupun laptop, ukuran font bisa diubah, posisi baca terakhir
// diingat otomatis (localStorage) per bab. Dipakai FTK (materi dari
// buku ners), tapi komponennya generik — subjek lain boleh pakai ini
// juga kalau suatu saat materinya berbentuk bacaan panjang.
//
// Dua cara isi konten:
// - `blocks`: array {type:'heading'|'paragraph'|'list', text|items} —
//   dipakai kalau materi sumbernya punya sub-judul (kasus buku FTK).
// - `content`: string/array string polos (paragraf dipisah baris kosong) —
//   cara lama, masih didukung buat materi yang nggak butuh sub-judul.
// `ringkasan`: array string, opsional, ditampilkan sebagai daftar di akhir.
// `questions`: array {num, text, options, correctIndex}, opsional — latihan
//   soal bisa diklik ABCDE. correctIndex null = belum ada kunci jawaban,
//   ditampilkan sebagai latihan refleksi tanpa skor (bukan dikarang).
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import '../styles/quizGlass.css';

const FONT_STEPS = [15, 16.5, 18, 20];

function QuestionBlock({ q }) {
  const [picked, setPicked] = useState(null);
  const hasKey = q.correctIndex !== null && q.correctIndex !== undefined;
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="nvr-q-card">
      <div className="nvr-q-text"><b>{q.num}.</b> {q.text}</div>
      <div className="nvr-q-opts">
        {q.options.map((opt, i) => {
          let state = '';
          if (picked !== null) {
            if (hasKey) {
              if (i === q.correctIndex) state = 'correct';
              else if (i === picked) state = 'wrong';
            } else if (i === picked) {
              state = 'picked';
            }
          }
          return (
            <button
              key={i}
              className={`nvr-q-opt ${state}`}
              onClick={() => setPicked(i)}
              disabled={picked !== null}
            >
              <span className="nvr-q-letter">{letters[i]}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {picked !== null && !hasKey && (
        <p className="nvr-q-note">⏳ Kunci jawaban belum tersedia di buku sumber — ini latihan refleksi, bukan quiz bernilai.</p>
      )}
    </div>
  );
}

export default function NovelReader({
  title, chapterTitle, content, blocks, ringkasan, questions,
  onBack, onPrev, onNext, hasPrev, hasNext, storageKey = 'default',
}) {
  const [fontStep, setFontStep] = useState(() => {
    try {
      const saved = localStorage.getItem('nvr_font_step');
      return saved !== null ? Number(saved) : 1;
    } catch { return 1; }
  });
  const pageRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const paragraphs = !blocks && content
    ? (Array.isArray(content) ? content : String(content).split(/\n\s*\n/).filter(Boolean))
    : null;

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [storageKey]);

  const changeFont = (dir) => {
    setFontStep((s) => {
      const next = Math.min(FONT_STEPS.length - 1, Math.max(0, s + dir));
      try { localStorage.setItem('nvr_font_step', String(next)); } catch { /* localStorage diblokir — ukuran font tetap berubah di state */ }
      return next;
    });
  };

  const hasAnyContent = (blocks && blocks.length > 0) || (paragraphs && paragraphs.length > 0);

  return (
    <div className="nvr-root">
      <div className="nvr-bar">
        <button className="qz-btn qz-btn-ghost qz-btn-sm" onClick={onBack}>← Daftar Bab</button>
        <div className="nvr-chtitle">{chapterTitle}</div>
        <button className="nvr-fontbtn" onClick={() => changeFont(-1)} aria-label="Perkecil huruf">A−</button>
        <button className="nvr-fontbtn" onClick={() => changeFont(1)} aria-label="Perbesar huruf">A+</button>
      </div>
      <div className="nvr-progress"><div className="nvr-progress-fill" style={{ width: `${progress}%` }} /></div>

      <div className="nvr-page" ref={pageRef}>
        <div className="nvr-title">{title}</div>
        <div className="nvr-sub">{chapterTitle}</div>

        <div className="nvr-body" style={{ fontSize: FONT_STEPS[fontStep] }}>
          {hasAnyContent ? (
            blocks ? (
              blocks.map((b, i) => {
                if (b.type === 'heading') return <h3 key={i} className="nvr-heading">{b.text}</h3>;
                if (b.type === 'list') {
                  return (
                    <ol key={i} className="nvr-list">
                      {b.items.map((it, j) => <li key={j}>{it}</li>)}
                    </ol>
                  );
                }
                return <p key={i}>{b.text}</p>;
              })
            ) : (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            )
          ) : (
            <p className="nvr-empty">Konten bab ini belum diisi.</p>
          )}
        </div>

        {ringkasan && ringkasan.length > 0 && (
          <div className="nvr-ringkasan">
            <h3 className="nvr-heading">Ringkasan</h3>
            <ol className="nvr-list">
              {ringkasan.map((r, i) => <li key={i}>{r}</li>)}
            </ol>
          </div>
        )}

        {questions && questions.length > 0 && (
          <div className="nvr-questions">
            <h3 className="nvr-heading">Latihan Soal</h3>
            {questions.map((q) => <QuestionBlock key={q.num} q={q} />)}
          </div>
        )}

        {(onPrev || onNext) && (
          <div className="nvr-nav">
            <button className="qz-btn qz-btn-glass" onClick={onPrev} disabled={!hasPrev}>← Bab Sebelumnya</button>
            <button className="qz-btn qz-btn-glass" onClick={onNext} disabled={!hasNext}>Bab Selanjutnya →</button>
          </div>
        )}
      </div>
    </div>
  );
}
