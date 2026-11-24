// src/components/quiz/MateriKit.jsx
// Komponen reusable untuk halaman Materi (dipakai Komdas, IBD, Kesglob, KDK, FTK + halaman Praktikum).
// Tampilan SAMA dengan MateriBahasaInggris.jsx: class `bim-*` dan CSS-nya disalin utuh dari file itu
// (MateriBahasaInggris.jsx sengaja tidak diubah supaya halaman yang sudah live tidak berisiko).
//
// Konten bab = data (blok), bukan JSX tulisan tangan. Format blok:
//   {t:'h', x}  {t:'p', x}  {t:'ul'|'ol', items:[]}  {t:'table', head:[], rows:[[]]}
//   {t:'box', v:'tip'|'warn'|'ex', x}  {t:'img', src, alt, cap}  {t:'acc', title, open?, blocks:[]}
//   {t:'quiz', id, q, opts:[], ans:<index>, exp?:string}
// Teks inline boleh memakai **tebal**, *miring*, `kode`.
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react';
import { explainQuestion } from './leoClient';

export const MATERI_CSS = `
/* ─── Layout ─── */
.bim-page {
  display: flex; min-height: 100dvh;
  background: var(--bg, var(--nm-bg));
  font-family: var(--font-body), 'Segoe UI', system-ui, sans-serif;
  color: var(--text, var(--text));
  -webkit-font-smoothing: antialiased;
}
.bim-sidebar {
  width: 264px; min-width: 240px; flex-shrink: 0;
  background: var(--nm-bg);

  border-right: 1px solid var(--border);
  box-shadow: inset -1px 0 0 color-mix(in srgb, var(--text) 3%, transparent);
  display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100dvh; overflow-y: auto;
}
.bim-main {
  flex: 1; padding: 2rem 2rem 6rem;
  max-width: 900px; margin: 0 auto; width: 100%;
  overflow-x: hidden;
}

/* ─── Sidebar inner ─── */
.bim-sb-head {
  padding: 1.1rem 1.1rem 0.9rem;
  border-bottom: 1px solid var(--border);
}
.bim-sb-back {
  background: none; border: none; cursor: pointer;
  color: var(--text-dim, var(--text-faint)); font-size: 12px; padding: 0;
  font-family: inherit; display: flex; align-items: center; gap: 4px;
  transition: color .2s;
}
.bim-sb-back:hover { color: var(--text, var(--text)); }
.bim-sb-title {
  font-family: var(--font-display), Georgia, serif;
  font-size: 15px; font-weight: 700; margin-top: 6px;
  color: var(--text, var(--text)); letter-spacing: .01em;
}
.bim-sb-sub { font-size: 10px; color: var(--text-dim, var(--text-faint)); margin-top: 2px; }

.bim-sb-dash {
  width: 100%; background: none; border: none; cursor: pointer;
  padding: .6rem 1.1rem; text-align: left; font-size: 13px;
  font-family: inherit; font-weight: 600; color: var(--text-dim, var(--text-faint));
  transition: color .2s, background .2s;
}
.bim-sb-dash.active, .bim-sb-dash:hover { color: var(--accent, var(--accent)); background: color-mix(in srgb, var(--accent) 8%, transparent); }

.bim-sb-cat {
  padding: .75rem 1.1rem .25rem;
  font-size: 10px; font-weight: 800; letter-spacing: 1px;
  border-top: 1px solid var(--border);
  margin-top: 4px; display: flex; align-items: center; gap: 5px;
}
.bim-sb-btn {
  width: 100%; background: none; border: none; border-left: 3px solid transparent;
  padding: .45rem 1.1rem; text-align: left; cursor: pointer;
  font-size: 12.5px; font-family: inherit;
  color: var(--text-dim, var(--text-faint));
  display: flex; justify-content: space-between; align-items: center;
  transition: all .2s;
}
.bim-sb-btn:hover { background: var(--nm-bg); color: var(--text, var(--text)); }
.bim-sb-btn.active { color: var(--accent, var(--accent)); font-weight: 700; background: color-mix(in srgb, var(--accent) 8%, transparent); }
.bim-sb-tm { font-size: 10px; color: var(--text-dim, var(--text-faint)); flex-shrink: 0; }
.bim-sb-check { color: var(--ok); margin-right: 4px; }
.bim-sb-quiz {
  padding: .9rem 1.1rem; margin-top: auto;
  border-top: 1px solid var(--border);
}
.bim-sb-quizbtn {
  width: 100%; background: var(--accent);
  color: var(--on-accent); border: 1px solid var(--border2); border-radius: 2px; padding: .68rem;
  cursor: pointer; font-weight: 700; font-size: 13px; font-family: inherit;
  transition: transform .2s, box-shadow .2s;
  box-shadow: none;
}
.bim-sb-quizbtn:hover { transform: translateY(-1px); box-shadow: none; }

/* ─── Mobile toggle ─── */
.bim-mobile-bar {
  display: none; align-items: center; justify-content: space-between;
  margin-bottom: 1.25rem;
}
.bim-mobile-toggler {
  background: color-mix(in srgb, var(--nm-bg) 94%, var(--text));
  border: 1px solid var(--border2);
  border-radius: 2px; padding: .5rem .9rem; cursor: pointer;
  font-size: 13px; color: var(--text, var(--text)); font-family: inherit;
  font-weight: 600; transition: all .2s;
  box-shadow: 0 4px 14px rgba(0,0,0,0.2);
}
.bim-mobile-toggler:hover { background: color-mix(in srgb, var(--nm-bg) 88%, var(--text)); transform: translateY(-1px); }
.bim-sb-overlay {
  display: none; position: fixed; inset: 0; background: rgba(0,0,0,.6);
  z-index: var(--z-float);
}
@media (max-width: 768px) {
  .bim-mobile-bar { display: flex; }
  .bim-sidebar {
    position: fixed; left: 0; top: 0; z-index: var(--z-float);
    transform: translateX(-100%); transition: transform .3s cubic-bezier(.22,1,.36,1);
    box-shadow: 8px 0 32px rgba(0,0,0,.6);
  }
  .bim-sidebar.open { transform: translateX(0); }
  .bim-sb-overlay.open { display: block; }
  .bim-main { padding: 1.25rem 1rem 5rem; }
}

/* ─── Cards ─── */
.bim-card {
  background: var(--nm-bg);

  border: 1px solid var(--border);
  border-radius: 2px; padding: 1.5rem; margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25), inset 0 1px 0 color-mix(in srgb, var(--text) 5%, transparent);
}
.bim-card-accent { border-top: 2px solid var(--accent, var(--accent)); }

/* ─── Breadcrumb ─── */
.bim-crumb {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: var(--text-dim, var(--text-faint));
  margin-bottom: .5rem;
}
.bim-crumb-btn {
  background: none; border: none; cursor: pointer; padding: 0;
  font-size: 12px; font-family: inherit; color: var(--text-dim, var(--text-faint));
  transition: color .2s;
}
.bim-crumb-btn:hover { color: var(--text, var(--text)); }

/* ─── Content typography ─── */
.bim-h1 {
  font-family: var(--font-display), Georgia, serif;
  font-size: clamp(1.6rem, 4vw, 2.1rem); font-weight: 700;
  margin: 0 0 .4rem;
  background: var(--accent);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.bim-h2 {
  font-family: var(--font-display), Georgia, serif;
  font-size: 1.35rem; font-weight: 700; margin: 0; color: var(--text, var(--text));
}
.bim-h3 { font-size: .95rem; font-weight: 700; color: var(--text, var(--text)); margin: 0 0 .35rem; }
.bim-muted { color: var(--text-dim, var(--text-faint)); font-size: .85rem; }
.bim-body { font-size: 14px; line-height: 1.75; color: var(--text, var(--text)); }

/* ─── Badges ─── */
.bim-badge {
  display: inline-block; padding: 2px 10px; border-radius: 2px;
  font-size: 11px; font-weight: 700; letter-spacing: .5px;
}

/* ─── Accordion ─── */
.bim-acc { border: 1px solid var(--border); border-radius: 2px; overflow: hidden; margin-bottom: .6rem; }
.bim-acc-btn {
  width: 100%; background: var(--nm-bg); border: none; padding: .85rem 1rem;
  text-align: left; cursor: pointer; font-weight: 600; font-size: 13.5px;
  display: flex; justify-content: space-between; align-items: center;
  color: var(--text, var(--text)); font-family: inherit; transition: background .2s;
}
.bim-acc-btn:hover { background: color-mix(in srgb, var(--nm-bg) 94%, var(--text)); }
.bim-acc-btn .bim-chevron { color: var(--text-dim, var(--text-faint)); transition: transform .25s; font-size: 11px; }
.bim-acc-btn .bim-chevron.open { transform: rotate(180deg); }
.bim-acc-body { padding: 1rem; border-top: 1px solid var(--border); background: var(--nm-bg); }

/* ─── Boxes ─── */
.bim-example {
  background: color-mix(in srgb, var(--accent) 7%, transparent); border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  border-radius: 2px; padding: .75rem 1rem; margin-top: .5rem; font-size: 13.5px;
}
.bim-example-label { font-size: 10.5px; font-weight: 700; color: var(--accent-text); margin-bottom: 4px; text-transform: uppercase; letter-spacing: .5px; }
.bim-warning {
  background: color-mix(in srgb, var(--warn) 7%, transparent); border: 1px solid color-mix(in srgb, var(--warn) 25%, transparent);
  border-radius: 2px; padding: .75rem 1rem; margin-top: .5rem; font-size: 13.5px;
}
.bim-warning-label { font-size: 10.5px; font-weight: 700; color: var(--warn); margin-bottom: 4px; text-transform: uppercase; letter-spacing: .5px; }
.bim-tip {
  background: color-mix(in srgb, var(--ok) 7%, transparent); border: 1px solid color-mix(in srgb, var(--ok) 20%, transparent);
  border-radius: 2px; padding: .65rem 1rem; margin-top: .5rem; font-size: 13.5px;
}
.bim-rule {
  border-radius: 2px; padding: 1rem; margin-bottom: .65rem;
}

/* ─── Table ─── */
.bim-table-wrap { overflow-x: auto; margin-bottom: 1.25rem; border-radius: 2px; border: 1px solid var(--border); }
.bim-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.bim-th {
  background: color-mix(in srgb, var(--nm-bg) 94%, var(--text)); padding: 9px 12px; text-align: left;
  font-weight: 700; font-size: 11px; letter-spacing: .5px;
  color: var(--text-dim, var(--text-faint)); text-transform: uppercase;
  border-bottom: 1px solid var(--border);
}
.bim-td { padding: 9px 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
.bim-tr:last-child .bim-td { border-bottom: none; }

/* ─── Sample Question ─── */
.bim-q-wrap { border: 1px solid var(--border); border-radius: 2px; padding: 1rem; margin-bottom: .75rem; background: var(--nm-bg); }
.bim-q-passage { background: color-mix(in srgb, var(--nm-bg) 94%, var(--text)); border-radius: 2px; padding: .75rem 1rem; font-size: 13px; line-height: 1.7; margin-bottom: .75rem; white-space: pre-line; }
.bim-q-text { font-weight: 600; margin-bottom: .65rem; font-size: 14px; line-height: 1.55; }
.bim-q-opts { display: flex; flex-direction: column; gap: 6px; }
.bim-q-opt {
  padding: .55rem .85rem; border-radius: 2px;
  border: 1.5px solid var(--border2);
  background: var(--nm-bg); color: var(--text, var(--text));
  font-size: 13.5px; text-align: left; cursor: pointer;
  display: flex; gap: 8px; align-items: flex-start;
  font-family: inherit; transition: all .15s;
}
.bim-q-opt:hover:not(.locked) { background: color-mix(in srgb, var(--accent) 12%, transparent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); }
.bim-q-opt.selected { background: color-mix(in srgb, var(--accent) 14%, transparent); border-color: color-mix(in srgb, var(--accent) 55%, transparent); }
.bim-q-opt.correct { background: color-mix(in srgb, var(--ok) 12%, transparent); border-color: color-mix(in srgb, var(--ok) 45%, transparent); color: var(--ok); }
.bim-q-opt.wrong   { background: color-mix(in srgb, var(--bad) 10%, transparent);  border-color: color-mix(in srgb, var(--bad) 40%, transparent);  color: var(--bad); }
.bim-q-opt.locked  { cursor: default; }
.bim-q-actions { display: flex; gap: 8px; margin-top: .75rem; flex-wrap: wrap; }
.bim-q-check {
  background: var(--accent, var(--accent)); color: var(--on-accent); border: none; border-radius: 2px;
  padding: .45rem 1.2rem; cursor: pointer; font-size: 13px; font-weight: 600;
  font-family: inherit; transition: opacity .2s;
}
.bim-q-check:disabled { opacity: .4; cursor: not-allowed; }
.bim-q-check:not(:disabled):hover { opacity: .85; }
.bim-q-retry {
  background: color-mix(in srgb, var(--nm-bg) 94%, var(--text)); color: var(--text-dim, var(--text-faint));
  border: 1px solid var(--border2); border-radius: 2px;
  padding: .45rem 1rem; cursor: pointer; font-size: 13px; font-family: inherit;
  transition: background .2s;
}
.bim-q-retry:hover { background: color-mix(in srgb, var(--nm-bg) 88%, var(--text)); }
.bim-q-explanation {
  flex: 1; background: color-mix(in srgb, var(--accent) 7%, transparent); border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  border-radius: 2px; padding: .5rem 1rem; font-size: 13px; line-height: 1.55; color: var(--accent-text);
  min-width: 0;
}

/* ─── Input / Search ─── */
.bim-search {
  width: 100%; padding: .65rem 1rem; border-radius: 2px;
  border: 1px solid var(--border2); outline: none;
  background: color-mix(in srgb, var(--nm-bg) 94%, var(--text)); color: var(--text, var(--text));
  font-size: 14px; font-family: inherit; margin-bottom: .85rem;
  box-sizing: border-box; transition: border-color .2s;
}
.bim-search:focus { border-color: color-mix(in srgb, var(--accent) 50%, transparent); }
.bim-search::placeholder { color: var(--text-dim, var(--text-faint)); }

/* ─── Vocab card ─── */
.bim-vocab-card {
  background: var(--nm-bg); border: 1px solid var(--border);
  border-radius: 2px; padding: .9rem 1.1rem;
}
.bim-vocab-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; }
.bim-vocab-word { font-size: 15px; font-weight: 700; color: var(--text, var(--text)); }
.bim-vocab-arti { font-size: 11.5px; color: var(--text-dim, var(--text-faint)); background: color-mix(in srgb, var(--nm-bg) 94%, var(--text)); padding: 2px 8px; border-radius: 2px; }
.bim-vocab-ex { font-size: 13px; color: var(--text-dim, var(--text-faint)); font-style: italic; line-height: 1.6; }

/* ─── Step badges ─── */
.bim-step-row { display: flex; gap: .75rem; margin-bottom: .55rem; align-items: flex-start; }
.bim-step-badge { padding: 2px 10px; border-radius: 2px; font-size: 11.5px; font-weight: 700; white-space: nowrap; margin-top: 2px; flex-shrink: 0; }

/* ─── Landing ─── */
.bim-land-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: 1rem; }
.bim-land-cat { border-radius: 2px; padding: 1.25rem; background: var(--nm-bg); border: 1px solid var(--border); transition: border-color .2s, transform .2s; }
.bim-land-cat:hover { transform: translateY(-2px); }
.bim-land-cat-icon { font-size: 22px; margin-bottom: 4px; }
.bim-land-cat-title { font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; margin-bottom: 4px; }
.bim-land-cat-desc { font-size: 12.5px; color: var(--text-dim, var(--text-faint)); margin-bottom: 1rem; line-height: 1.55; }
.bim-land-cat-btn {
  width: 100%; border: none; border-radius: 2px; padding: .55rem;
  cursor: pointer; font-weight: 700; font-size: 13px; font-family: inherit;
  transition: opacity .2s;
}
.bim-land-cat-btn:hover { opacity: .85; }
.bim-search-results { background: var(--nm-bg); border: 1px solid var(--border); border-radius: 2px; margin-bottom: 1rem; overflow: hidden; }
.bim-search-result-btn { width: 100%; background: none; border: none; padding: .6rem 1rem; text-align: left; cursor: pointer; font-size: 13.5px; color: var(--text, var(--text)); display: flex; gap: 8px; align-items: center; font-family: inherit; transition: background .2s; }
.bim-search-result-btn:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }

/* ─── Nav buttons (prev/next) ─── */
.bim-nav-row { display: flex; gap: .75rem; margin-top: .5rem; }
.bim-nav-btn {
  flex: 1; border-radius: 2px; padding: .7rem; cursor: pointer;
  font-size: 13px; font-weight: 600; font-family: inherit; transition: opacity .2s;
}
.bim-nav-btn:hover { opacity: .82; }
.bim-nav-prev { background: color-mix(in srgb, var(--nm-bg) 94%, var(--text)); color: var(--text, var(--text)); border: 1px solid var(--border2); }
.bim-nav-next { color: var(--text); border: none; }

/* ─── Disclaimer ─── */
.bim-disclaimer {
  background: color-mix(in srgb, var(--warn) 7%, transparent); border: 1px solid color-mix(in srgb, var(--warn) 30%, transparent);
  border-radius: 2px; padding: .75rem 1rem; margin-bottom: 1.25rem;
  font-size: 13px; display: flex; gap: .5rem; align-items: flex-start;
  line-height: 1.55; color: #b45309;
}
[data-theme="light"] .bim-disclaimer { color: #92400e; }

/* ─── Gerund columns (dark-safe) ─── */
.bim-ger-col {
  border-radius: 2px; padding: 1rem;
  background: var(--nm-bg); border: 1px solid var(--border);
}
.bim-ger-list { font-size: 13px; line-height: 1.85; margin: 0; padding-left: 1.1rem; }

/* ─── Mono cell ─── */
.bim-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 12px; background: var(--nm-bg); padding: 1px 5px; border-radius: 4px; }

/* ─── Tambahan MateriKit (data-driven) ─── */
.bim-mark { background: color-mix(in srgb, var(--warn) 30%, transparent); color: inherit; padding: 0 2px; border-radius: 2px; }
.bim-fig { margin: 0 0 1rem; }
.bim-fig img { max-width: 100%; height: auto; border: 1px solid var(--border); border-radius: 2px; display: block; }
.bim-fig figcaption { font-size: .78rem; color: var(--text-dim, var(--text-faint)); margin-top: .3rem; }
.bim-banner { border: 1px solid color-mix(in srgb, var(--accent) 28%, var(--border)); background: color-mix(in srgb, var(--accent) 6%, transparent); border-radius: 2px; padding: .75rem 1rem; font-size: 13px; line-height: 1.6; margin-bottom: 1rem; }
.bim-sb-btn.soon { opacity: .5; cursor: not-allowed; }
.bim-sb-grp { padding: .7rem 1rem .25rem; font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-dim, var(--text-faint)); }
.bim-q-ai { margin-top: .6rem; }
.bim-q-ai button { background: none; border: 1px solid var(--border); border-radius: 2px; padding: 5px 12px; font: inherit; font-size: 12.5px; font-weight: 700; cursor: pointer; color: var(--accent-text); }
.bim-q-ai button:disabled { opacity: .5; cursor: wait; }
.bim-soon-note { font-size: 12px; color: var(--text-dim, var(--text-faint)); }
`;

/** Suntik CSS halaman materi (id sama dengan MateriBahasaInggris; keduanya tak pernah tampil bersamaan). */
export function useMateriStyles() {
  useEffect(() => {
    const el = document.createElement('style');
    el.id = 'bim-page-styles';
    el.textContent = MATERI_CSS;
    document.head.appendChild(el);
    return () => document.getElementById('bim-page-styles')?.remove();
  }, []);
}

export function Badge({ children, color = 'var(--accent)' }) {
  return (
    <span className="bim-badge" style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, color, border: `1px solid color-mix(in srgb, ${color} 30%, transparent)` }}>
      {children}
    </span>
  );
}

export function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bim-acc">
      <button className="bim-acc-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{title}</span>
        <span className={`bim-chevron${open ? ' open' : ''}`}>▼</span>
      </button>
      {open && <div className="bim-acc-body">{children}</div>}
    </div>
  );
}
export const ExampleBox = ({ label = 'Contoh', children }) => (<div className="bim-example"><div className="bim-example-label">{label}</div>{children}</div>);
export const WarningBox = ({ label = 'Perhatian', children }) => (<div className="bim-warning"><div className="bim-warning-label">{label}</div>{children}</div>);
export const TipBox = ({ children }) => (<div className="bim-tip">{children}</div>);

/* ───────── teks inline: **tebal**, *miring*, `kode`, + sorot hasil pencarian ───────── */
const TOKEN = /(\*\*[^*]+?\*\*|\*[^*\s][^*]*?\*|`[^`]+`)/g;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function withMark(str, hl) {
  if (!hl) return str;
  const parts = str.split(new RegExp(`(${escapeRe(hl)})`, 'gi'));
  return parts.map((p, i) => (i % 2 ? <mark key={i} className="bim-mark">{p}</mark> : p));
}
export function Inline({ text, hl }) {
  const parts = String(text ?? '').split(TOKEN).filter((x) => x !== '');
  return parts.map((p, i) => {
    if (p.length > 4 && p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{withMark(p.slice(2, -2), hl)}</strong>;
    if (p.length > 2 && p.startsWith('`') && p.endsWith('`')) return <code key={i} className="bim-mono">{p.slice(1, -1)}</code>;
    if (p.length > 2 && p.startsWith('*') && p.endsWith('*')) return <em key={i}>{withMark(p.slice(1, -1), hl)}</em>;
    return <span key={i}>{withMark(p, hl)}</span>;
  });
}

/** Teks polos satu bab (dipakai pencarian & sebagai konteks Leo AI) */
export function blocksToText(blocks = []) {
  const strip = (s) => String(s ?? '').replace(/\*\*|`/g, '').replace(/(^|\s)\*(\S)/g, '$1$2').replace(/(\S)\*(\s|$)/g, '$1$2');
  const out = [];
  for (const b of blocks) {
    if (b.t === 'h' || b.t === 'p' || b.t === 'box') out.push(strip(b.x));
    else if (b.t === 'ul' || b.t === 'ol') b.items.forEach((it, i) => out.push((b.t === 'ol' ? `${i + 1}. ` : '- ') + strip(it)));
    else if (b.t === 'table') { out.push(b.head.map(strip).join(' | ')); b.rows.forEach((r) => out.push(r.map(strip).join(' | '))); }
    else if (b.t === 'acc') { out.push(strip(b.title)); out.push(blocksToText(b.blocks)); }
    else if (b.t === 'quiz') out.push(`Soal: ${strip(b.q)}`);
  }
  return out.join('\n');
}

/* ───────── latihan soal: klik jawaban → langsung benar/salah + penjelasan ───────── */
export function LatihanSoal({ q, num, ctx }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [aiExp, setAiExp] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiErr, setAiErr] = useState('');
  const reset = () => { setSelected(null); setChecked(false); };

  const askLeo = async () => {
    setAiBusy(true); setAiErr('');
    try {
      const r = await explainQuestion({ questionId: q.id, question: q.q, options: q.opts, correctIndex: q.ans, pageContext: ctx });
      setAiExp(r.explanation || '');
    } catch (e) {
      setAiErr(e?.status === 429 ? 'Leo AI lagi sibuk. Coba lagi sebentar.' : 'Penjelasan belum bisa dimuat. Coba lagi nanti.');
    } finally { setAiBusy(false); }
  };

  return (
    <div className="bim-q-wrap">
      <div className="bim-q-text"><Badge>Latihan {num}</Badge> <Inline text={q.q} /></div>
      <div className="bim-q-opts">
        {q.opts.map((opt, i) => {
          let cls = 'bim-q-opt';
          if (checked) { cls += ' locked'; if (i === q.ans) cls += ' correct'; else if (i === selected) cls += ' wrong'; }
          else if (selected === i) cls += ' selected';
          return (
            <button key={i} className={cls} onClick={() => !checked && setSelected(i)}>
              <strong>{String.fromCharCode(65 + i)}.</strong> <Inline text={opt} />
              {checked && i === q.ans && <span style={{ marginLeft: 'auto' }}><i className="fa-solid fa-circle-check" aria-hidden="true" /></span>}
              {checked && i === selected && i !== q.ans && <span style={{ marginLeft: 'auto' }}><i className="fa-solid fa-circle-xmark" aria-hidden="true" /></span>}
            </button>
          );
        })}
      </div>
      <div className="bim-q-actions">
        {!checked ? (
          <button className="bim-q-check" disabled={selected === null} onClick={() => selected !== null && setChecked(true)}>Cek Jawaban</button>
        ) : (
          <>
            <button className="bim-q-retry" onClick={reset}>Coba Lagi</button>
            {q.exp ? (
              <div className="bim-q-explanation"><strong>Penjelasan:</strong> <Inline text={q.exp} /></div>
            ) : aiExp ? (
              <div className="bim-q-explanation"><strong>Penjelasan Leo AI:</strong> {aiExp}<div className="bim-soon-note">Dibuat AI, bisa keliru. Cocokkan dengan materi.</div></div>
            ) : (
              <div className="bim-q-ai">
                <button onClick={askLeo} disabled={aiBusy}>{aiBusy ? 'Leo AI lagi menjelaskan…' : 'Minta penjelasan ke Leo AI'}</button>
                {aiErr && <div className="bim-soon-note" role="alert">{aiErr}</div>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ───────── renderer blok ───────── */
export function Blocks({ blocks = [], hl = '', ctx, ids }) {
  let quizNo = 0;
  return blocks.map((b, i) => {
    switch (b.t) {
      case 'h': return <h3 key={i} id={ids?.get(b)} className="bim-h3" style={{ margin: '1.25rem 0 .4rem' }}><Inline text={b.x} hl={hl} /></h3>;
      case 'p': return <p key={i} className="bim-body" style={{ margin: '0 0 .8rem' }}><Inline text={b.x} hl={hl} /></p>;
      case 'ul':
      case 'ol': {
        const Tag = b.t;
        return (
          <Tag key={i} className="bim-body" style={{ margin: '0 0 .9rem', paddingLeft: '1.3rem' }}>
            {b.items.map((it, j) => <li key={j} style={{ marginBottom: 4 }}><Inline text={it} hl={hl} /></li>)}
          </Tag>
        );
      }
      case 'table':
        return (
          <div key={i} className="bim-table-wrap">
            <table className="bim-table">
              <thead><tr>{b.head.map((h, j) => <th key={j} className="bim-th"><Inline text={h} hl={hl} /></th>)}</tr></thead>
              <tbody>{b.rows.map((r, j) => <tr key={j} className="bim-tr">{r.map((c, k) => <td key={k} className="bim-td"><Inline text={c} hl={hl} /></td>)}</tr>)}</tbody>
            </table>
          </div>
        );
      case 'box': {
        const inner = <Inline text={b.x} hl={hl} />;
        if (b.v === 'warn') return <WarningBox key={i}>{inner}</WarningBox>;
        if (b.v === 'ex') return <ExampleBox key={i} label="Catatan">{inner}</ExampleBox>;
        return <TipBox key={i}>{inner}</TipBox>;
      }
      case 'img':
        return (
          <figure key={i} className="bim-fig">
            <img src={b.src} alt={b.alt || ''} loading="lazy" />
            {b.cap && <figcaption>{b.cap}</figcaption>}
          </figure>
        );
      case 'acc':
        return <Accordion key={i} title={b.title} defaultOpen={!!b.open}><Blocks blocks={b.blocks} hl={hl} ctx={ctx} /></Accordion>;
      case 'quiz': quizNo += 1; return <LatihanSoal key={b.id || i} q={b} num={quizNo} ctx={ctx} />;
      default: return null;
    }
  });
}
