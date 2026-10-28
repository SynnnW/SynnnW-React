// src/components/NovelReader.jsx
// ─────────────────────────────────────────────────────────────
// Reader ala "novel di browser" — satu kolom, nyaman dibaca di HP
// maupun laptop, ukuran font bisa diubah, posisi baca terakhir
// diingat otomatis (localStorage) per bab. Dipakai FTK (materi dari
// buku ners), tapi komponennya generik — subjek lain boleh pakai ini
// juga kalau suatu saat materinya berbentuk bacaan panjang.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';

const CSS = `
.nvr-root { max-width: 640px; margin: 0 auto; font-family: 'Inter','Segoe UI',system-ui,sans-serif; color: #f4f4f6; }
.nvr-bar { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 10px;
  background: rgba(7,7,9,0.92);padding: 10px 4px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.nvr-back { background: none; border: 1px solid rgba(255,255,255,0.15); color: #8d8d99; border-radius: 10px;
  padding: 7px 12px; cursor: pointer; font-size: 12.5px; white-space: nowrap; }
.nvr-chtitle { flex: 1; font-weight: 700; font-size: 13.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nvr-fontbtn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #c9c9d2;
  border-radius: 8px; width: 28px; height: 28px; cursor: pointer; font-size: 13px; line-height: 1; }
.nvr-progress { height: 3px; background: rgba(255,255,255,0.08); }
.nvr-progress-fill { height: 100%; background: linear-gradient(90deg,#8b7bff,#5eead4); transition: width 0.15s; }
.nvr-page { padding: 28px 18px 72px; }
.nvr-title { font-family: 'Space Grotesk','Inter',sans-serif; font-size: clamp(1.3rem,5vw,1.7rem); font-weight: 800; margin-bottom: 4px; }
.nvr-sub { color: #8d8d99; font-size: 0.82rem; margin-bottom: 24px; }
.nvr-body p { line-height: 1.9; margin-bottom: 1.1em; color: #e3e3e9; }
.nvr-nav { display: flex; gap: 10px; margin-top: 32px; }
.nvr-nav button { flex: 1; background: rgba(139,123,255,0.08); border: 1px solid rgba(139,123,255,0.3); color: #b0a4ff;
  border-radius: 12px; padding: 12px; cursor: pointer; font-size: 13px; font-weight: 600; }
.nvr-nav button:disabled { opacity: 0.35; cursor: default; }
`;

const FONT_STEPS = [15, 16.5, 18, 20];

/**
 * content: string (paragraf dipisah baris kosong) ATAU array of string (1 elemen = 1 paragraf)
 * storageKey: dipakai untuk mengingat ukuran font & posisi scroll per bab
 */
export default function NovelReader({ title, chapterTitle, content, onBack, onPrev, onNext, hasPrev, hasNext, storageKey = 'default' }) {
  const [fontStep, setFontStep] = useState(1);
  const pageRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const paragraphs = Array.isArray(content)
    ? content
    : String(content || '').split(/\n\s*\n/).filter(Boolean);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nvr_font_step');
      if (saved !== null) setFontStep(Number(saved));
    } catch {}
  }, []);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
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
      try { localStorage.setItem('nvr_font_step', String(next)); } catch {}
      return next;
    });
  };

  return (
    <div className="nvr-root">
      <style>{CSS}</style>
      <div className="nvr-bar">
        <button className="nvr-back" onClick={onBack}>← Daftar Bab</button>
        <div className="nvr-chtitle">{chapterTitle}</div>
        <button className="nvr-fontbtn" onClick={() => changeFont(-1)} aria-label="Perkecil huruf">A−</button>
        <button className="nvr-fontbtn" onClick={() => changeFont(1)} aria-label="Perbesar huruf">A+</button>
      </div>
      <div className="nvr-progress"><div className="nvr-progress-fill" style={{ width: `${progress}%` }} /></div>

      <div className="nvr-page" ref={pageRef}>
        <div className="nvr-title">{title}</div>
        <div className="nvr-sub">{chapterTitle}</div>
        <div className="nvr-body" style={{ fontSize: FONT_STEPS[fontStep] }}>
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p style={{ color: '#8d8d99', fontStyle: 'italic' }}>
              Konten bab ini belum diisi.
            </p>
          )}
        </div>

        {(onPrev || onNext) && (
          <div className="nvr-nav">
            <button onClick={onPrev} disabled={!hasPrev}>← Bab Sebelumnya</button>
            <button onClick={onNext} disabled={!hasNext}>Bab Selanjutnya →</button>
          </div>
        )}
      </div>
    </div>
  );
}
