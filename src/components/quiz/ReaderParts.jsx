// src/components/quiz/ReaderParts.jsx
// Bagian reader yang dipakai bersama: toolbar (lokasi, ukuran teks, mode fokus), meta bab, daftar isi, dan footer bab.
// Daftar isi hanya muncul bila ada heading nyata (>= 3); "selesai dibaca" tidak berarti "menguasai materi".
import { Link } from 'react-router-dom';
import { PATHS } from '../../data/quiziz/routes';

export function ReaderTools({ crumbs, prefs, canSmaller, canBigger, onSmaller, onBigger, onFocus }) {
  return (
    <div className="bim-tools">
      <nav className="bim-crumbs" aria-label="Lokasi">
        <Link to={PATHS.beranda}>Quiziz</Link>
        {crumbs.map((c) => (
          <span key={c.label} className="bim-crumbs-item">
            <span aria-hidden="true">›</span>
            {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
          </span>
        ))}
      </nav>
      <div className="bim-tools-btns" role="group" aria-label="Pengaturan baca">
        <button type="button" className="bim-tool" onClick={onSmaller} disabled={!canSmaller} aria-label="Perkecil teks">A−</button>
        <button type="button" className="bim-tool" onClick={onBigger} disabled={!canBigger} aria-label="Perbesar teks">A+</button>
        <button type="button" className="bim-tool bim-tool-wide" onClick={onFocus} aria-pressed={prefs.focus}>Fokus</button>
      </div>
    </div>
  );
}

export function ReaderMeta({ source, minutes }) {
  if (!source && !minutes) return null;
  return <p className="bim-meta">{[source && `Sumber: ${source}`, minutes ? `±${minutes} mnt baca` : null].filter(Boolean).join(' · ')}</p>;
}

export function Toc({ items }) {
  if (items.length < 3) return null;
  return (
    <nav className="bim-toc" aria-label="Di bab ini">
      <p className="bim-toc-title">Di bab ini</p>
      <ol>{items.map((h) => <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>)}</ol>
    </nav>
  );
}

/** Footer bab: tandai selesai (dengan batalkan), bab sebelumnya/berikutnya, dan CTA latsol yang benar-benar tersedia. */
export function ChapterFooter({ done, onDone, onUndo, prev, next, latsol, accent }) {
  return (
    <div className="bim-foot">
      <div className="bim-foot-done">
        {done ? (
          <>
            <span className="bim-foot-ok">✓ Selesai dibaca</span>
            <button type="button" className="bim-foot-link" onClick={onUndo}>Batalkan</button>
          </>
        ) : (
          <button type="button" className="bim-foot-btn" onClick={onDone}>Tandai selesai</button>
        )}
      </div>
      {(prev || next) && (
        <div className="bim-nav-row">
          {prev && <Link className="bim-nav-btn bim-nav-prev" to={prev.to}>← {prev.label}</Link>}
          {next && <Link className="bim-nav-btn bim-nav-next" style={{ background: accent || 'var(--accent)' }} to={next.to}>{next.label} →</Link>}
        </div>
      )}
      {latsol && <Link className="bim-foot-cta" to={latsol.path}>Latsol mata kuliah ini · {latsol.label}</Link>}
    </div>
  );
}
