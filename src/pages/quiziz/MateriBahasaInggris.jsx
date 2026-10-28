import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { topics as NAV_ITEMS, readingExamples } from '../../data/quiziz/bahasaInggris/tm01/materi';

/* ──────────────────────────────────────────────────────────
   NAVIGASI TOPIK
   Daftar kategori & topik sekarang data (lihat import di atas),
   bukan ditulis inline di sini — supaya bisa dipakai ulang &
   gampang diaudit lepas dari komponen tampilannya.
────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────
   CSS INJECTED — tema mengikuti SynnnW Studio
────────────────────────────────────────────────────────── */
const BIM_CSS = `
/* ─── Layout ─── */
.bim-page {
  display: flex; min-height: 100dvh;
  background: var(--bg, #0E0D0B);
  font-family: var(--font-body), 'Segoe UI', system-ui, sans-serif;
  color: var(--text, #f0ede8);
  -webkit-font-smoothing: antialiased;
}
.bim-sidebar {
  width: 264px; min-width: 240px; flex-shrink: 0;
  background: rgba(255,255,255,0.03);

  border-right: 1px solid rgba(255,255,255,0.08);
  box-shadow: inset -1px 0 0 rgba(255,255,255,0.03);
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
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.bim-sb-back {
  background: none; border: none; cursor: pointer;
  color: var(--text-dim, #64605a); font-size: 12px; padding: 0;
  font-family: inherit; display: flex; align-items: center; gap: 4px;
  transition: color .2s;
}
.bim-sb-back:hover { color: var(--text, #f0ede8); }
.bim-sb-title {
  font-family: var(--font-display), Georgia, serif;
  font-size: 15px; font-weight: 700; margin-top: 6px;
  color: var(--text, #f0ede8); letter-spacing: .01em;
}
.bim-sb-sub { font-size: 10px; color: var(--text-dim, #64605a); margin-top: 2px; }

.bim-sb-dash {
  width: 100%; background: none; border: none; cursor: pointer;
  padding: .6rem 1.1rem; text-align: left; font-size: 13px;
  font-family: inherit; font-weight: 600; color: var(--text-dim, #64605a);
  transition: color .2s, background .2s;
}
.bim-sb-dash.active, .bim-sb-dash:hover { color: var(--accent, var(--accent)); background: color-mix(in srgb, var(--accent) 8%, transparent); }

.bim-sb-cat {
  padding: .75rem 1.1rem .25rem;
  font-size: 10px; font-weight: 800; letter-spacing: 1px;
  border-top: 1px solid rgba(255,255,255,0.05);
  margin-top: 4px; display: flex; align-items: center; gap: 5px;
}
.bim-sb-btn {
  width: 100%; background: none; border: none; border-left: 3px solid transparent;
  padding: .45rem 1.1rem; text-align: left; cursor: pointer;
  font-size: 12.5px; font-family: inherit;
  color: var(--text-dim, #64605a);
  display: flex; justify-content: space-between; align-items: center;
  transition: all .2s;
}
.bim-sb-btn:hover { background: rgba(255,255,255,0.04); color: var(--text, #f0ede8); }
.bim-sb-btn.active { color: var(--accent, var(--accent)); font-weight: 700; background: color-mix(in srgb, var(--accent) 8%, transparent); }
.bim-sb-tm { font-size: 10px; color: var(--text-dim, #64605a); flex-shrink: 0; }
.bim-sb-check { color: #34d399; margin-right: 4px; }
.bim-sb-quiz {
  padding: .9rem 1.1rem; margin-top: auto;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.bim-sb-quizbtn {
  width: 100%; background: var(--accent);
  color: #fff; border: 1px solid rgba(255,255,255,0.16); border-radius: 2px; padding: .68rem;
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
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 2px; padding: .5rem .9rem; cursor: pointer;
  font-size: 13px; color: var(--text, #f0ede8); font-family: inherit;
  font-weight: 600; transition: all .2s;
  box-shadow: 0 4px 14px rgba(0,0,0,0.2);
}
.bim-mobile-toggler:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }
.bim-sb-overlay {
  display: none; position: fixed; inset: 0; background: rgba(0,0,0,.6);
  z-index: 999;
}
@media (max-width: 768px) {
  .bim-mobile-bar { display: flex; }
  .bim-sidebar {
    position: fixed; left: 0; top: 0; z-index: 1000;
    transform: translateX(-100%); transition: transform .3s cubic-bezier(.22,1,.36,1);
    box-shadow: 8px 0 32px rgba(0,0,0,.6);
  }
  .bim-sidebar.open { transform: translateX(0); }
  .bim-sb-overlay.open { display: block; }
  .bim-main { padding: 1.25rem 1rem 5rem; }
}

/* ─── Cards ─── */
.bim-card {
  background: rgba(255,255,255,0.04);

  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 2px; padding: 1.5rem; margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05);
}
.bim-card-accent { border-top: 2px solid var(--accent, var(--accent)); }

/* ─── Breadcrumb ─── */
.bim-crumb {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: var(--text-dim, #64605a);
  margin-bottom: .5rem;
}
.bim-crumb-btn {
  background: none; border: none; cursor: pointer; padding: 0;
  font-size: 12px; font-family: inherit; color: var(--text-dim, #64605a);
  transition: color .2s;
}
.bim-crumb-btn:hover { color: var(--text, #f0ede8); }

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
  font-size: 1.35rem; font-weight: 700; margin: 0; color: var(--text, #f0ede8);
}
.bim-h3 { font-size: .95rem; font-weight: 700; color: var(--text, #f0ede8); margin: 0 0 .35rem; }
.bim-muted { color: var(--text-dim, #64605a); font-size: .85rem; }
.bim-body { font-size: 14px; line-height: 1.75; color: var(--text, #f0ede8); }

/* ─── Badges ─── */
.bim-badge {
  display: inline-block; padding: 2px 10px; border-radius: 2px;
  font-size: 11px; font-weight: 700; letter-spacing: .5px;
}

/* ─── Accordion ─── */
.bim-acc { border: 1px solid rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; margin-bottom: .6rem; }
.bim-acc-btn {
  width: 100%; background: rgba(255,255,255,0.04); border: none; padding: .85rem 1rem;
  text-align: left; cursor: pointer; font-weight: 600; font-size: 13.5px;
  display: flex; justify-content: space-between; align-items: center;
  color: var(--text, #f0ede8); font-family: inherit; transition: background .2s;
}
.bim-acc-btn:hover { background: rgba(255,255,255,0.07); }
.bim-acc-btn .bim-chevron { color: var(--text-dim, #64605a); transition: transform .25s; font-size: 11px; }
.bim-acc-btn .bim-chevron.open { transform: rotate(180deg); }
.bim-acc-body { padding: 1rem; border-top: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); }

/* ─── Boxes ─── */
.bim-example {
  background: rgba(94,234,212,.07); border: 1px solid rgba(94,234,212,.2);
  border-radius: 2px; padding: .75rem 1rem; margin-top: .5rem; font-size: 13.5px;
}
.bim-example-label { font-size: 10.5px; font-weight: 700; color: #5eead4; margin-bottom: 4px; text-transform: uppercase; letter-spacing: .5px; }
.bim-warning {
  background: rgba(251,191,36,.07); border: 1px solid rgba(251,191,36,.25);
  border-radius: 2px; padding: .75rem 1rem; margin-top: .5rem; font-size: 13.5px;
}
.bim-warning-label { font-size: 10.5px; font-weight: 700; color: #fbbf24; margin-bottom: 4px; text-transform: uppercase; letter-spacing: .5px; }
.bim-tip {
  background: rgba(52,211,153,.07); border: 1px solid rgba(52,211,153,.2);
  border-radius: 2px; padding: .65rem 1rem; margin-top: .5rem; font-size: 13.5px;
}
.bim-rule {
  border-radius: 2px; padding: 1rem; margin-bottom: .65rem;
}

/* ─── Table ─── */
.bim-table-wrap { overflow-x: auto; margin-bottom: 1.25rem; border-radius: 2px; border: 1px solid rgba(255,255,255,0.07); }
.bim-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.bim-th {
  background: rgba(255,255,255,0.06); padding: 9px 12px; text-align: left;
  font-weight: 700; font-size: 11px; letter-spacing: .5px;
  color: var(--text-dim, #64605a); text-transform: uppercase;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.bim-td { padding: 9px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top; }
.bim-tr:last-child .bim-td { border-bottom: none; }

/* ─── Sample Question ─── */
.bim-q-wrap { border: 1px solid rgba(255,255,255,0.07); border-radius: 2px; padding: 1rem; margin-bottom: .75rem; background: rgba(255,255,255,0.03); }
.bim-q-passage { background: rgba(255,255,255,0.05); border-radius: 2px; padding: .75rem 1rem; font-size: 13px; line-height: 1.7; margin-bottom: .75rem; white-space: pre-line; }
.bim-q-text { font-weight: 600; margin-bottom: .65rem; font-size: 14px; line-height: 1.55; }
.bim-q-opts { display: flex; flex-direction: column; gap: 6px; }
.bim-q-opt {
  padding: .55rem .85rem; border-radius: 2px;
  border: 1.5px solid rgba(255,255,255,0.09);
  background: rgba(255,255,255,0.04); color: var(--text, #f0ede8);
  font-size: 13.5px; text-align: left; cursor: pointer;
  display: flex; gap: 8px; align-items: flex-start;
  font-family: inherit; transition: all .15s;
}
.bim-q-opt:hover:not(.locked) { background: color-mix(in srgb, var(--accent) 12%, transparent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); }
.bim-q-opt.selected { background: color-mix(in srgb, var(--accent) 14%, transparent); border-color: color-mix(in srgb, var(--accent) 55%, transparent); }
.bim-q-opt.correct { background: rgba(52,211,153,.12); border-color: rgba(52,211,153,.45); color: #34d399; }
.bim-q-opt.wrong   { background: rgba(251,113,133,.1);  border-color: rgba(251,113,133,.4);  color: #fb7185; }
.bim-q-opt.locked  { cursor: default; }
.bim-q-actions { display: flex; gap: 8px; margin-top: .75rem; flex-wrap: wrap; }
.bim-q-check {
  background: var(--accent, var(--accent)); color: #fff; border: none; border-radius: 2px;
  padding: .45rem 1.2rem; cursor: pointer; font-size: 13px; font-weight: 600;
  font-family: inherit; transition: opacity .2s;
}
.bim-q-check:disabled { opacity: .4; cursor: not-allowed; }
.bim-q-check:not(:disabled):hover { opacity: .85; }
.bim-q-retry {
  background: rgba(255,255,255,0.06); color: var(--text-dim, #64605a);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;
  padding: .45rem 1rem; cursor: pointer; font-size: 13px; font-family: inherit;
  transition: background .2s;
}
.bim-q-retry:hover { background: rgba(255,255,255,0.1); }
.bim-q-explanation {
  flex: 1; background: rgba(94,234,212,.07); border: 1px solid rgba(94,234,212,.2);
  border-radius: 2px; padding: .5rem 1rem; font-size: 13px; line-height: 1.55; color: #5eead4;
  min-width: 0;
}

/* ─── Input / Search ─── */
.bim-search {
  width: 100%; padding: .65rem 1rem; border-radius: 2px;
  border: 1px solid rgba(255,255,255,0.09); outline: none;
  background: rgba(255,255,255,0.05); color: var(--text, #f0ede8);
  font-size: 14px; font-family: inherit; margin-bottom: .85rem;
  box-sizing: border-box; transition: border-color .2s;
}
.bim-search:focus { border-color: color-mix(in srgb, var(--accent) 50%, transparent); }
.bim-search::placeholder { color: var(--text-dim, #64605a); }

/* ─── Vocab card ─── */
.bim-vocab-card {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 2px; padding: .9rem 1.1rem;
}
.bim-vocab-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; }
.bim-vocab-word { font-size: 15px; font-weight: 700; color: var(--text, #f0ede8); }
.bim-vocab-arti { font-size: 11.5px; color: var(--text-dim, #64605a); background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 2px; }
.bim-vocab-ex { font-size: 13px; color: var(--text-dim, #64605a); font-style: italic; line-height: 1.6; }

/* ─── Step badges ─── */
.bim-step-row { display: flex; gap: .75rem; margin-bottom: .55rem; align-items: flex-start; }
.bim-step-badge { padding: 2px 10px; border-radius: 2px; font-size: 11.5px; font-weight: 700; white-space: nowrap; margin-top: 2px; flex-shrink: 0; }

/* ─── Landing ─── */
.bim-land-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: 1rem; }
.bim-land-cat { border-radius: 2px; padding: 1.25rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); transition: border-color .2s, transform .2s; }
.bim-land-cat:hover { transform: translateY(-2px); }
.bim-land-cat-icon { font-size: 22px; margin-bottom: 4px; }
.bim-land-cat-title { font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; margin-bottom: 4px; }
.bim-land-cat-desc { font-size: 12.5px; color: var(--text-dim, #64605a); margin-bottom: 1rem; line-height: 1.55; }
.bim-land-cat-btn {
  width: 100%; border: none; border-radius: 2px; padding: .55rem;
  cursor: pointer; font-weight: 700; font-size: 13px; font-family: inherit;
  transition: opacity .2s;
}
.bim-land-cat-btn:hover { opacity: .85; }
.bim-search-results { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 2px; margin-bottom: 1rem; overflow: hidden; }
.bim-search-result-btn { width: 100%; background: none; border: none; padding: .6rem 1rem; text-align: left; cursor: pointer; font-size: 13.5px; color: var(--text, #f0ede8); display: flex; gap: 8px; align-items: center; font-family: inherit; transition: background .2s; }
.bim-search-result-btn:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }

/* ─── Nav buttons (prev/next) ─── */
.bim-nav-row { display: flex; gap: .75rem; margin-top: .5rem; }
.bim-nav-btn {
  flex: 1; border-radius: 2px; padding: .7rem; cursor: pointer;
  font-size: 13px; font-weight: 600; font-family: inherit; transition: opacity .2s;
}
.bim-nav-btn:hover { opacity: .82; }
.bim-nav-prev { background: rgba(255,255,255,0.06); color: var(--text, #f0ede8); border: 1px solid rgba(255,255,255,0.1); }
.bim-nav-next { color: #fff; border: none; }

/* ─── Disclaimer ─── */
.bim-disclaimer {
  background: rgba(251,191,36,.07); border: 1px solid rgba(251,191,36,.3);
  border-radius: 2px; padding: .75rem 1rem; margin-bottom: 1.25rem;
  font-size: 13px; display: flex; gap: .5rem; align-items: flex-start;
  line-height: 1.55; color: #b45309;
}
[data-theme="light"] .bim-disclaimer { color: #92400e; }

/* ─── Gerund columns (dark-safe) ─── */
.bim-ger-col {
  border-radius: 2px; padding: 1rem;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
}
.bim-ger-list { font-size: 13px; line-height: 1.85; margin: 0; padding-left: 1.1rem; }

/* ─── Mono cell ─── */
.bim-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 12px; background: rgba(255,255,255,0.04); padding: 1px 5px; border-radius: 4px; }
`;

/* ──────────────────────────────────────────────────────────
   REUSABLE MICRO-COMPONENTS
────────────────────────────────────────────────────────── */
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bim-acc">
      <button className="bim-acc-btn" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <span className={`bim-chevron${open ? ' open' : ''}`}>▼</span>
      </button>
      {open && <div className="bim-acc-body">{children}</div>}
    </div>
  );
}

function ExampleBox({ label, children }) {
  return (
    <div className="bim-example">
      {label && <div className="bim-example-label">{label}</div>}
      {children}
    </div>
  );
}

function WarningBox({ label, children }) {
  return (
    <div className="bim-warning">
      {label && <div className="bim-warning-label">⚠️ {label}</div>}
      {children}
    </div>
  );
}

function TipBox({ children }) {
  return <div className="bim-tip"><span style={{ fontWeight: 700, color: '#34d399' }}>💡 </span>{children}</div>;
}

function RuleCard({ title, color, children }) {
  return (
    <div className="bim-rule" style={{ border: `2px solid ${color}30`, borderLeft: `4px solid ${color}`, background: `${color}0d` }}>
      <div style={{ fontWeight: 700, color, marginBottom: 6, fontSize: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function Badge({ children, color }) {
  return (
    <span className="bim-badge" style={{ background: color + '22', color, border: `1px solid ${color}44` }}>
      {children}
    </span>
  );
}

function SampleQuestion({ num, question, options, correctIdx, explanation, passage }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const reset = () => { setSelected(null); setChecked(false); };

  return (
    <div className="bim-q-wrap">
      {passage && <div className="bim-q-passage">{passage}</div>}
      <div className="bim-q-text">
        <Badge color="var(--accent)">Contoh {num}</Badge>{' '}
        {question}
      </div>
      <div className="bim-q-opts">
        {options.map((opt, i) => {
          let cls = 'bim-q-opt';
          if (checked) {
            cls += ' locked';
            if (i === correctIdx) cls += ' correct';
            else if (i === selected) cls += ' wrong';
          } else if (selected === i) cls += ' selected';
          return (
            <button key={i} className={cls} onClick={() => !checked && setSelected(i)}>
              <strong>{String.fromCharCode(65 + i)}.</strong> {opt}
              {checked && i === correctIdx && <span style={{ marginLeft: 'auto' }}>✅</span>}
              {checked && i === selected && i !== correctIdx && <span style={{ marginLeft: 'auto' }}>❌</span>}
            </button>
          );
        })}
      </div>
      <div className="bim-q-actions">
        {!checked ? (
          <button className="bim-q-check" disabled={selected === null} onClick={() => selected !== null && setChecked(true)}>
            Cek Jawaban
          </button>
        ) : (
          <>
            <button className="bim-q-retry" onClick={reset}>Coba Lagi</button>
            <div className="bim-q-explanation"><strong>Penjelasan:</strong> {explanation}</div>
          </>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   KONTEN MATERI — GRAMMAR
────────────────────────────────────────────────────────── */
function TopicTenses() {
  return (
    <div>
      <p className="bim-body" style={{ marginBottom: '1rem' }}>
        Tenses menggambarkan <strong>waktu terjadinya suatu aksi atau keadaan</strong>.
        Memahami tenses bukan sekadar menghafal rumus, tapi mengerti <em>kapan</em> dan <em>mengapa</em>
        suatu bentuk kata kerja digunakan.
      </p>
      <div className="bim-table-wrap">
        <table className="bim-table">
          <thead>
            <tr>
              {['Tense','Fungsi','Signal Words','Formula','Contoh'].map(h => (
                <th key={h} className="bim-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Simple Present','Kebiasaan, fakta umum, prosedur rutin','usually, every day, often','S + V1 / V1+s/es','The nurse checks vitals every morning.'],
              ['Present Continuous','Aktivitas sedang berlangsung / rencana dekat','now, currently, at the moment','S + am/is/are + V-ing','She is checking the patient now.'],
              ['Present Perfect','Pengalaman tanpa waktu spesifik; relevan kini','already, yet, just, ever, since, for','S + have/has + V3','She has worked here since 2020.'],
              ['Present Perfect Cont.','Aksi mulai masa lalu, masih berlangsung','since, for, how long','S + have/has + been + V-ing','He has been waiting for an hour.'],
              ['Simple Past','Kejadian selesai pada waktu spesifik lampau','yesterday, last week, ago, in 2020','S + V2','She visited the clinic yesterday.'],
              ['Past Continuous','Aksi sedang berlangsung di titik masa lalu','while, when, at that time','S + was/were + V-ing','The nurse was monitoring the patient when the doctor arrived.'],
              ['Past Perfect','Aksi selesai sebelum aksi lain di masa lalu','before, after, by the time, already','S + had + V3','The patient had already eaten before the doctor arrived.'],
              ['Simple Future','Keputusan spontan, prediksi, fakta masa depan','tomorrow, next week, soon','S + will + V1','The new regulation will take effect next month.'],
              ['Future Continuous','Aksi berlangsung di titik tertentu masa depan','this time tomorrow, at 5 p.m. next week','S + will be + V-ing','We will be presenting our research this time next week.'],
              ['Future Perfect','Aksi selesai sebelum titik tertentu masa depan','by next year, by the time, by 2030','S + will have + V3','By 2030, hospitals will have automated most tasks.'],
            ].map(([t,f,sw,fm,ex]) => (
              <tr key={t} className="bim-tr">
                <td className="bim-td" style={{ fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}>{t}</td>
                <td className="bim-td">{f}</td>
                <td className="bim-td bim-muted" style={{ fontSize: 12 }}>{sw}</td>
                <td className="bim-td bim-mono">{fm}</td>
                <td className="bim-td" style={{ fontStyle: 'italic', color: '#8a857e', fontSize: 12 }}>{ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <WarningBox label="JANGAN TERTUKAR: Simple Past vs Present Perfect">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginTop: '.5rem' }}>
          <div>
            <strong style={{ color: '#fb7185' }}>Simple Past</strong><br />
            <em>"She visited the clinic yesterday."</em><br />
            <span style={{ fontSize: 12 }}>→ "yesterday" = waktu lampau spesifik, sudah selesai sepenuhnya.</span>
          </div>
          <div>
            <strong style={{ color: '#34d399' }}>Present Perfect</strong><br />
            <em>"She has visited the clinic several times this month."</em><br />
            <span style={{ fontSize: 12 }}>→ "this month" = periode masih berlangsung; pengalaman relevan.</span>
          </div>
        </div>
        <TipBox>Signal word bukan penentu mutlak — makna kalimat tetap harus diperhatikan.</TipBox>
      </WarningBox>
      <div style={{ marginTop: '1.25rem' }}>
        <div className="bim-h3" style={{ marginBottom: '.5rem' }}>Contoh Soal Demonstrasi</div>
        <SampleQuestion num={1}
          question='She ______ as a community health volunteer since she was a second-year student.'
          options={['worked','is working','works','has worked']}
          correctIdx={3}
          explanation={"'Since + waktu spesifik di masa lalu' → Present Perfect. Aksi dimulai masa lalu dan berlanjut sekarang: 'has worked'."}
        />
        <SampleQuestion num={2}
          question='Last semester, our research team ______ a community health survey in three rural villages.'
          options={['conducted','has conducted','conducts','is conducting']}
          correctIdx={0}
          explanation={"Ada penanda waktu 'last semester' (masa lalu spesifik) → Simple Past: 'conducted'."}
        />
      </div>
    </div>
  );
}

function TopicVerbForms() {
  const [filter, setFilter] = useState('all');
  const verbs = [
    { v1:'be (am/is/are)', v2:'was/were', v3:'been', ving:'being', v5:'is/are', cat:'irregular', ex:'She is a nurse. / She was tired.' },
    { v1:'check', v2:'checked', v3:'checked', ving:'checking', v5:'checks', cat:'regular', ex:'The nurse checks vitals. / The lab checked the result.' },
    { v1:'give', v2:'gave', v3:'given', ving:'giving', v5:'gives', cat:'irregular', ex:'The doctor gave instructions. / The medication has been given.' },
    { v1:'take', v2:'took', v3:'taken', ving:'taking', v5:'takes', cat:'irregular', ex:'Please take your medicine. / The nurse is taking vitals.' },
    { v1:'write', v2:'wrote', v3:'written', ving:'writing', v5:'writes', cat:'irregular', ex:'She has written the report. / She was writing notes.' },
    { v1:'monitor', v2:'monitored', v3:'monitored', ving:'monitoring', v5:'monitors', cat:'regular', ex:'The device monitors heart rate.' },
    { v1:'administer', v2:'administered', v3:'administered', ving:'administering', v5:'administers', cat:'regular', ex:'The nurse administers medication correctly.' },
    { v1:'do', v2:'did', v3:'done', ving:'doing', v5:'does', cat:'irregular', ex:'What does the nurse do? / She has done her duty.' },
    { v1:'go', v2:'went', v3:'gone', ving:'going', v5:'goes', cat:'irregular', ex:'She went to the clinic. / She has gone home.' },
    { v1:'report', v2:'reported', v3:'reported', ving:'reporting', v5:'reports', cat:'regular', ex:'She should have reported the symptom earlier.' },
  ];
  const filtered = filter === 'all' ? verbs : verbs.filter(v => v.cat === filter);
  return (
    <div>
      <p className="bim-body" style={{ marginBottom: '1rem' }}>
        Setiap kata kerja bahasa Inggris memiliki lima bentuk. Memahami <em>kapan</em> masing-masing
        dipakai jauh lebih penting daripada sekadar menghafal perubahannya.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: '.75rem' }}>
        {['all','regular','irregular'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ background: filter === f ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
              color: filter === f ? '#fff' : '#8a857e',
              border: 'none', borderRadius: 2, padding: '.4rem 1rem',
              cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
            {f === 'all' ? 'Semua' : f === 'regular' ? 'Regular' : 'Irregular'}
          </button>
        ))}
      </div>
      <div className="bim-table-wrap">
        <table className="bim-table">
          <thead>
            <tr>
              {['V1 (Dasar)','V2 (Past)','V3 (Past Part.)','V-ing / V4','V5 (3rd Sing.)','Contoh'].map(h => (
                <th key={h} className="bim-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.v1} className="bim-tr">
                <td className="bim-td" style={{ fontWeight: 700 }}>{v.v1}</td>
                <td className="bim-td">{v.v2}</td>
                <td className="bim-td">{v.v3}</td>
                <td className="bim-td">{v.ving}</td>
                <td className="bim-td">{v.v5}</td>
                <td className="bim-td" style={{ fontSize: 12, color: '#8a857e' }}>{v.ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ExampleBox label="Kapan masing-masing dipakai?">
        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: 13.5, lineHeight: 1.85 }}>
          <li><strong>V1</strong> — Simple Present, setelah modal (must, can, will…), infinitive (to + V1)</li>
          <li><strong>V2</strong> — Simple Past</li>
          <li><strong>V3</strong> — Setelah have/has/had (Perfect), setelah be (Passive)</li>
          <li><strong>V-ing</strong> — Continuous tense, setelah preposisi, sebagai gerund</li>
          <li><strong>V5</strong> — Simple Present dengan subjek orang ketiga tunggal (he, she, it)</li>
        </ul>
      </ExampleBox>
    </div>
  );
}

function TopicModal() {
  const pairs = [
    { pair: 'Can vs Could', items: [
      { modal: 'Can', use: 'Kemampuan atau izin saat ini', ex: 'She can speak English fluently.' },
      { modal: 'Could', use: 'Kemampuan masa lalu, permintaan lebih sopan, kemungkinan', ex: 'Could you help me with this form?' },
    ], note: 'Could lebih sopan daripada can dalam permintaan.' },
    { pair: 'May vs Might', items: [
      { modal: 'May', use: 'Kemungkinan atau izin formal', ex: 'The patient may be discharged tomorrow.' },
      { modal: 'Might', use: 'Kemungkinan dengan nuansa lebih tentatif', ex: 'The results might take two more days.' },
    ], note: 'Perbedaan tingkat kepastian bergantung pada konteks, bukan persentase tetap.' },
    { pair: 'Must vs Have to', items: [
      { modal: 'Must', use: 'Keharusan kuat dari diri sendiri, atau kesimpulan logis', ex: 'You must wash your hands before every procedure.' },
      { modal: 'Have to', use: 'Keharusan dari aturan atau keadaan luar', ex: 'Nurses have to wear an ID badge at all times.' },
    ], note: 'Dalam percakapan sehari-hari, keduanya sering dipertukarkan.' },
    { pair: 'Should vs Ought to', items: [
      { modal: 'Should', use: 'Saran, rekomendasi, harapan', ex: 'You should rest more to recover faster.' },
      { modal: 'Ought to', use: 'Kewajiban moral, lebih formal dari should', ex: 'Nurses ought to maintain patient confidentiality.' },
    ], note: 'Should lebih umum; ought to terdengar lebih formal.' },
    { pair: 'Will vs Would vs Shall', items: [
      { modal: 'Will', use: 'Keputusan spontan, prediksi, janji', ex: 'I will call the doctor immediately.' },
      { modal: 'Would', use: 'Kondisional, permintaan sopan, kebiasaan masa lalu', ex: 'Would you mind waiting outside?' },
      { modal: 'Shall', use: 'Tawaran / saran formal (terutama dengan I/we)', ex: 'Shall I call the head nurse for you?' },
    ], note: 'Would digunakan dalam Second Conditional (If... would...).' },
  ];
  return (
    <div>
      {pairs.map(p => (
        <Accordion key={p.pair} title={p.pair}>
          <div style={{ display: 'grid', gap: '.65rem' }}>
            {p.items.map(item => (
              <RuleCard key={item.modal} title={item.modal} color="var(--accent)">
                <p style={{ margin: '0 0 .4rem', fontSize: 13.5 }}><strong>Penggunaan:</strong> {item.use}</p>
                <ExampleBox><em>{item.ex}</em></ExampleBox>
              </RuleCard>
            ))}
          </div>
          <TipBox>{p.note}</TipBox>
        </Accordion>
      ))}
      <Accordion title="Modal + have + V3 (untuk masa lalu)">
        <div className="bim-table-wrap">
          <table className="bim-table">
            <thead><tr>
              {['Pola','Makna','Contoh'].map(h => <th key={h} className="bim-th">{h}</th>)}
            </tr></thead>
            <tbody>
              {[
                ['should have + V3','Seharusnya dilakukan tapi tidak','She should have reported the symptom earlier.'],
                ['must have + V3','Dugaan kuat tentang masa lalu','He must have forgotten to take his medicine.'],
                ['could have + V3','Mungkin terjadi tapi tidak','With early treatment, it could have been prevented.'],
                ['would have + V3','Akan terjadi dalam kondisi berbeda','If they had arrived earlier, it would have been controlled.'],
              ].map(([p,m,e]) => (
                <tr key={p} className="bim-tr">
                  <td className="bim-td bim-mono" style={{ fontWeight: 700, color: 'var(--accent)' }}>{p}</td>
                  <td className="bim-td">{m}</td>
                  <td className="bim-td" style={{ fontStyle: 'italic' }}>{e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Accordion>
      <div style={{ marginTop: '1rem' }}>
        <div className="bim-h3" style={{ marginBottom: '.5rem' }}>Contoh Soal</div>
        <SampleQuestion num={1}
          question='He ______ have forgotten to take his medicine; that would explain his symptoms today.'
          options={['must','should','can','will']}
          correctIdx={0}
          explanation={"'Must have + V3' → dugaan kuat tentang sesuatu yang terjadi di masa lalu."}
        />
      </div>
    </div>
  );
}

function TopicSVA() {
  const rules = [
    { title: '1. Frasa tambahan di antara S dan V', ex: 'The nurse, along with her colleagues, is on duty.', note: '"Along with her colleagues" bukan subjek utama. Kata kerja tetap mengikuti "The nurse" (tunggal).' },
    { title: '2. Relative clause mengikuti kata benda yang diterangkan', ex: 'Nurses who work in rural areas often face challenges.', note: '"who work" mengikuti "Nurses" (jamak), bukan subjek utama.' },
    { title: '3. Each, every, everyone, someone, anyone, nobody → tunggal', ex: 'Each patient is responsible for following the medication schedule.', note: '"Each" selalu dianggap tunggal meskipun merujuk banyak orang.' },
    { title: '4. "The number of" vs "A number of"', ex: 'The number of cases has increased.\nA number of patients have arrived.', note: '"The number of" = jumlahnya (tunggal). "A number of" = beberapa (jamak).' },
    { title: '5. Neither…nor / Either…or → ikuti subjek terdekat', ex: 'Neither the doctor nor the nurses are aware of the policy.', note: 'Kata kerja mengikuti subjek paling dekat: "the nurses" (jamak) → "are".' },
    { title: '6. Uncountable nouns → tunggal', ex: 'The information about the allergy is critical.', note: '"Information", "equipment", "furniture", "news" → uncountable → selalu tunggal.' },
    { title: '7. Subjek gabungan dengan "and" → jamak', ex: 'The doctor and the nurse are in the ward.', note: 'Pengecualian: jika dipahami satu kesatuan, bisa tunggal ("bread and butter is a staple").' },
    { title: '8. There is / There are', ex: 'There is a patient waiting.\nThere are five patients waiting.', note: '"Is" untuk subjek tunggal, "are" untuk subjek jamak.' },
  ];
  return (
    <div>
      {rules.map((r, i) => (
        <Accordion key={i} title={r.title} defaultOpen={i === 0}>
          <ExampleBox label="Contoh kalimat"><em style={{ whiteSpace: 'pre-line' }}>{r.ex}</em></ExampleBox>
          <p style={{ fontSize: 13.5, marginTop: '.5rem', lineHeight: 1.65 }}>📌 {r.note}</p>
        </Accordion>
      ))}
    </div>
  );
}

function TopicConditional() {
  return (
    <div>
      <div className="bim-table-wrap">
        <table className="bim-table">
          <thead>
            <tr>{['Tipe','If-Clause','Main Clause','Kegunaan','Contoh'].map(h => <th key={h} className="bim-th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              ['Zero','Present Simple','Present Simple','Fakta umum, hukum alam, SOP medis','If temperature rises above 38°C, it indicates fever.'],
              ['First','Present Simple','will + V1','Kemungkinan nyata di masa depan','If a nurse notices unusual symptoms, she will inform the doctor.'],
              ['Second','Past Simple','would + V1','Pengandaian tidak nyata sekarang/masa depan','If the government invested more, healthcare would improve.'],
              ['Third','Past Perfect','would have + V3','Pengandaian masa lalu (sudah tidak bisa diubah)','If the team had arrived earlier, the outbreak would have been controlled.'],
              ['Mixed','Past Perfect (if)','would + V1 (main)','Pengandaian masa lalu berdampak pada masa kini','If she had completed her training, she would be a qualified nurse now.'],
            ].map(([t,i,m,k,e]) => (
              <tr key={t} className="bim-tr">
                <td className="bim-td" style={{ fontWeight: 700, color: 'var(--accent)', whiteSpace: 'nowrap' }}>{t}</td>
                <td className="bim-td bim-mono">{i}</td>
                <td className="bim-td bim-mono">{m}</td>
                <td className="bim-td">{k}</td>
                <td className="bim-td" style={{ fontStyle: 'italic', fontSize: 12 }}>{e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <RuleCard title='"If I were" — Pengandaian Formal' color="var(--accent)">
        <ExampleBox><em>If I were the head nurse, I would change the shift schedule.</em></ExampleBox>
        <p style={{ fontSize: 13, marginTop: '.5rem' }}>
          "Were" lazim digunakan untuk semua subjek dalam pengandaian formal (Second Conditional),
          termasuk I/he/she/it. Bentuk ini dianggap baku dalam bahasa tulis formal.
        </p>
      </RuleCard>
      <WarningBox label="Kesalahan Umum First Conditional">
        <p style={{ margin: 0, fontSize: 13 }}>
          ❌ <em>"If a nurse will notice unusual symptoms, she will inform the doctor."</em><br />
          ✅ <em>"If a nurse notices unusual symptoms, she will inform the doctor."</em><br /><br />
          Pada if-clause First Conditional, gunakan Present Simple — bukan "will" — meskipun artinya masa depan.
        </p>
      </WarningBox>
      <div style={{ marginTop: '1rem' }}>
        <div className="bim-h3" style={{ marginBottom: '.5rem' }}>Contoh Soal</div>
        <SampleQuestion num={1}
          question='The patient would not have developed complications if she ______ her medication regularly.'
          options={['took','had taken','takes','would take']}
          correctIdx={1}
          explanation={"Main clause 'would not have developed' → Third Conditional. If-clause harus Past Perfect: 'had taken'."}
        />
      </div>
    </div>
  );
}

function TopicPassive() {
  return (
    <div>
      <ExampleBox label="Cara mengubah ke Passive Voice">
        <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: 13.5, lineHeight: 1.9 }}>
          <li>Objek kalimat aktif → menjadi subjek baru.</li>
          <li>Pilih bentuk <strong>"be"</strong> sesuai tense dan subjek baru.</li>
          <li>Gunakan <strong>V3</strong> (kata kerja bentuk ketiga).</li>
          <li>Tambahkan <strong>"by + pelaku"</strong> hanya jika pelaku perlu disebutkan.</li>
        </ol>
        <div style={{ marginTop: '.5rem', fontSize: 13.5 }}>
          <strong>Active:</strong> <em>The nurse measures the patient's temperature.</em><br />
          <strong>Passive:</strong> <em>The patient's temperature is measured by the nurse.</em>
        </div>
      </ExampleBox>
      <div className="bim-table-wrap" style={{ marginTop: '1rem' }}>
        <table className="bim-table">
          <thead>
            <tr>{['Tense / Pola','Formula Passive','Contoh Passive'].map(h => <th key={h} className="bim-th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              ['Simple Present','am/is/are + V3','The wound is cleaned twice a day.'],
              ['Present Continuous','am/is/are + being + V3','The patient is being monitored now.'],
              ['Present Perfect','have/has + been + V3','The results have been sent to the doctor.'],
              ['Simple Past','was/were + V3','The results were explained to the patient yesterday.'],
              ['Past Continuous','was/were + being + V3','The patient was being treated when the doctor arrived.'],
              ['Past Perfect','had + been + V3','The medication had been administered before the visit.'],
              ['Simple Future','will + be + V3','New regulations will be implemented next month.'],
              ['Future Perfect','will + have + been + V3','The report will have been submitted by Friday.'],
              ['Modal + be + V3','modal + be + V3','Patient confidentiality must be protected at all times.'],
              ['Modal + have been + V3','modal + have + been + V3','The symptom should have been reported earlier.'],
            ].map(([t,f,e]) => (
              <tr key={t} className="bim-tr">
                <td className="bim-td" style={{ fontWeight: 600, color: '#5eead4' }}>{t}</td>
                <td className="bim-td bim-mono" style={{ color: 'var(--accent)' }}>{f}</td>
                <td className="bim-td" style={{ fontStyle: 'italic', fontSize: 13 }}>{e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TopicGerund() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '.75rem', marginBottom: '1rem' }}>
        <div className="bim-ger-col" style={{ borderTop: '3px solid var(--accent)' }}>
          <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>Verb + Gerund (V-ing)</div>
          <ul className="bim-ger-list">{['avoid','finish','enjoy','suggest','recommend','consider','practice','keep','mind','miss'].map(v => <li key={v}>{v}</li>)}</ul>
          <ExampleBox><em>The nurse suggested reviewing the notes.</em></ExampleBox>
        </div>
        <div className="bim-ger-col" style={{ borderTop: '3px solid #10b981' }}>
          <div style={{ fontWeight: 700, color: '#34d399', marginBottom: 8 }}>Verb + Infinitive (to + V1)</div>
          <ul className="bim-ger-list">{['want','need','hope','decide','plan','agree','expect','refuse','manage','fail'].map(v => <li key={v}>{v}</li>)}</ul>
          <ExampleBox><em>She decided to continue her studies.</em></ExampleBox>
        </div>
        <div className="bim-ger-col" style={{ borderTop: '3px solid #fbbf24' }}>
          <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: 8 }}>Bisa Keduanya</div>
          <ul className="bim-ger-list">{['like','love','start','begin','continue','prefer'].map(v => <li key={v}>{v}</li>)}</ul>
          <ExampleBox><em>She likes reading / to read medical journals.</em></ExampleBox>
        </div>
      </div>
      <WarningBox label="Kata Kerja yang BERUBAH MAKNA">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginTop: '.5rem', fontSize: 13.5 }}>
          <div>
            <strong>stop + V-ing</strong> → berhenti melakukan sesuatu<br />
            <em>"He stopped smoking."</em><br />
            <strong>stop + to-inf</strong> → berhenti untuk melakukan lain<br />
            <em>"He stopped to smoke."</em>
          </div>
          <div>
            <strong>remember + V-ing</strong> → ingat pernah melakukan<br />
            <em>"I remember giving the medication."</em><br />
            <strong>remember + to-inf</strong> → ingat untuk melakukan<br />
            <em>"Please remember to give the medication."</em>
          </div>
        </div>
      </WarningBox>
    </div>
  );
}

function TopicRelative() {
  return (
    <div>
      <div className="bim-table-wrap">
        <table className="bim-table">
          <thead>
            <tr>{['Pronoun','Merujuk ke','Fungsi dalam Clause','Contoh'].map(h => <th key={h} className="bim-th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              ['who','Orang','Subjek','Nurses who work in rural areas face unique challenges.'],
              ['whom','Orang','Objek','The researcher whom the university chose leads the project.'],
              ['which','Benda / Hewan','Subjek / Objek','AI systems, which analyze patient data, help predict risks.'],
              ['that','Orang / Benda','Subjek / Objek (restrictive only)','The device that monitors heart rate is widely used.'],
              ['whose','Orang / Benda','Kepemilikan','A patient whose chart is incomplete must be flagged.'],
              ['where','Tempat','Keterangan tempat','The village where the clinic was built lacks clean water.'],
              ['when','Waktu','Keterangan waktu','There was a time when telemedicine was not available here.'],
            ].map(([p,r,f,e]) => (
              <tr key={p} className="bim-tr">
                <td className="bim-td" style={{ fontWeight: 700, color: 'var(--accent)' }}>{p}</td>
                <td className="bim-td">{r}</td><td className="bim-td">{f}</td>
                <td className="bim-td" style={{ fontStyle: 'italic', fontSize: 12 }}>{e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <WarningBox label="Restrictive vs Non-Restrictive Clause">
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7 }}>
          <strong>Restrictive</strong> (tanpa koma): informasi penting yang membatasi makna.<br />
          <em>"The nurse who works nights is very experienced."</em><br /><br />
          <strong>Non-restrictive</strong> (dengan koma): informasi tambahan, bisa dihilangkan.<br />
          <em>"Dr. Sari, who specializes in community health, visited the village."</em><br /><br />
          ⚠️ "That" <strong>tidak digunakan</strong> dalam non-restrictive clause (yang diapit koma).
        </p>
      </WarningBox>
    </div>
  );
}

function TopicSubjunctive() {
  return (
    <div>
      <p className="bim-body" style={{ marginBottom: '1rem' }}>
        Subjunctive Mood digunakan setelah kata kerja atau ekspresi yang menyatakan
        <strong> tuntutan, saran, keharusan, atau kepentingan</strong>. Kata kerja setelah "that"
        menggunakan bentuk dasar (V1) tanpa -s, meskipun subjeknya he/she/it.
      </p>
      <ExampleBox label="Pola Umum: V/phrase + that + S + V1 (base form)">
        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: 13.5, lineHeight: 1.9 }}>
          <li>The doctor <strong>insisted that</strong> the patient <strong>rest</strong> for two more days.</li>
          <li>Hospital policy <strong>requires that</strong> every staff member <strong>wear</strong> an ID badge.</li>
          <li>The supervisor <strong>recommended that</strong> she <strong>submit</strong> the report earlier.</li>
          <li>It is <strong>essential that</strong> the data <strong>be</strong> verified before publication.</li>
        </ul>
      </ExampleBox>
      <WarningBox label="Jangan Tambahkan -s">
        <p style={{ margin: 0, fontSize: 13 }}>
          ❌ <em>"The doctor insisted that the patient rests."</em><br />
          ✅ <em>"The doctor insisted that the patient rest."</em><br />
          Meskipun "the patient" orang ketiga tunggal, dalam Subjunctive tidak ada -s.
        </p>
      </WarningBox>
    </div>
  );
}

function TopicComparative() {
  return (
    <div>
      <div style={{ display: 'grid', gap: '.65rem' }}>
        {[
          { pattern: 'The more…, the more/less…', desc: 'Semakin…, semakin…', ex: 'The more technology develops, the more accessible healthcare becomes.' },
          { pattern: 'As…as / Not as…as', desc: 'Sama seperti / Tidak sama dengan', ex: 'Rural clinics are not as well-equipped as city hospitals.' },
          { pattern: 'Less…than', desc: 'Kurang dari / Lebih sedikit', ex: 'Elderly patients are less familiar with digital health apps than younger patients.' },
          { pattern: 'Comparative + and + comparative', desc: 'Semakin lama semakin…', ex: 'AI systems are becoming more and more advanced each year.' },
        ].map(item => (
          <RuleCard key={item.pattern} title={item.pattern} color="#0891b2">
            <p style={{ margin: '0 0 .4rem', fontSize: 13.5 }}><strong>Makna:</strong> {item.desc}</p>
            <ExampleBox><em>{item.ex}</em></ExampleBox>
          </RuleCard>
        ))}
      </div>
    </div>
  );
}

function TopicPreposition() {
  const [search, setSearch] = useState('');
  const items = [
    { expr: 'depend on', arti: 'bergantung pada', ex: 'The program depends on collecting accurate data.' },
    { expr: 'be aware of', arti: 'sadar akan', ex: 'Nurses must be aware of the risks of pesticide exposure.' },
    { expr: 'be responsible for', arti: 'bertanggung jawab atas', ex: 'Each team member is responsible for their own patients.' },
    { expr: 'be interested in', arti: 'tertarik pada', ex: 'She has always been interested in community health.' },
    { expr: 'consist of', arti: 'terdiri dari', ex: 'The team consists of nurses, doctors, and health workers.' },
    { expr: 'result in', arti: 'mengakibatkan', ex: 'Poor sanitation can result in disease outbreaks.' },
    { expr: 'be used to + V-ing', arti: 'sudah terbiasa dengan', ex: 'She is used to working long shifts.' },
    { expr: 'used to + V1', arti: 'dulu biasa melakukan (sekarang tidak)', ex: 'He used to work at the city hospital before moving to the village.' },
    { expr: 'because of + noun phrase', arti: 'karena (kata benda)', ex: 'Because of the storm, the clinic closed early.' },
    { expr: 'due to + noun phrase', arti: 'disebabkan oleh', ex: 'Due to limited funding, the program was scaled down.' },
    { expr: 'despite / in spite of + noun/V-ing', arti: 'meskipun', ex: 'Despite having a busy schedule, she still volunteers.' },
    { expr: 'although / even though + clause', arti: 'meskipun (diikuti klausa lengkap)', ex: 'Although she has a busy schedule, she still volunteers.' },
  ];
  const filtered = search ? items.filter(i =>
    i.expr.toLowerCase().includes(search.toLowerCase()) || i.arti.toLowerCase().includes(search.toLowerCase())
  ) : items;
  return (
    <div>
      <input className="bim-search" placeholder="Cari ekspresi atau arti..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="bim-table-wrap">
        <table className="bim-table">
          <thead><tr>{['Ekspresi','Arti','Contoh Kalimat'].map(h => <th key={h} className="bim-th">{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.expr} className="bim-tr">
                <td className="bim-td bim-mono" style={{ fontWeight: 700, color: 'var(--accent)' }}>{item.expr}</td>
                <td className="bim-td" style={{ color: '#8a857e' }}>{item.arti}</td>
                <td className="bim-td" style={{ fontStyle: 'italic', fontSize: 13 }}>{item.ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <WarningBox label="Bedakan Polanya">
        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: 13.5, lineHeight: 1.9 }}>
          <li><strong>because of</strong> + noun phrase → <em>Because of the storm, the clinic closed early.</em></li>
          <li><strong>although / even though</strong> + klausa (S+V) → <em>Although it rained, they continued.</em></li>
          <li><strong>despite / in spite of</strong> + noun/V-ing → <em>Despite heavy rain, they continued.</em></li>
          <li><strong>be used to + V-ing</strong> (terbiasa) ≠ <strong>used to + V1</strong> (dulu biasa)</li>
        </ul>
      </WarningBox>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   KONTEN MATERI — VOCABULARY
────────────────────────────────────────────────────────── */
function TopicVocab({ category }) {
  const data = {
    'vocab-campus': [
      { word: 'Major', arti: 'Jurusan / bidang studi utama', ex: 'I chose nursing as my major because I want to work in healthcare.' },
      { word: 'Association', arti: 'Asosiasi / organisasi', ex: 'She joined the Nursing Student Association to develop leadership skills.' },
      { word: 'Volunteer', arti: 'Relawan', ex: 'Many students decide to be a volunteer in rural health programs.' },
      { word: 'Academic advisor', arti: 'Dosen pembimbing akademik', ex: 'My academic advisor helped me choose the right courses.' },
      { word: 'Scholarship', arti: 'Beasiswa', ex: 'She received a scholarship for her outstanding academic performance.' },
      { word: 'Orientation', arti: 'Program orientasi / pengenalan', ex: 'The new students felt nervous during the campus orientation.' },
      { word: 'Freshman', arti: 'Mahasiswa tingkat pertama', ex: 'As a freshman, she had to adjust to a new environment.' },
      { word: 'Achievement', arti: 'Prestasi / pencapaian', ex: 'Her achievement in the debate competition was impressive.' },
      { word: 'Collaboration', arti: 'Kerja sama / kolaborasi', ex: 'Collaboration between students improved the project outcome significantly.' },
    ],
    'vocab-tech': [
      { word: 'Telemedicine', arti: 'Layanan kesehatan jarak jauh', ex: 'Telemedicine allows doctors to consult patients remotely.' },
      { word: 'Wearable device', arti: 'Perangkat yang dikenakan di tubuh', ex: 'A smartwatch is a wearable device that tracks heart rate.' },
      { word: 'Digital etiquette', arti: 'Etika dalam komunikasi digital', ex: 'Social media users should follow proper digital etiquette.' },
      { word: 'Misinformation', arti: 'Informasi yang salah / menyesatkan', ex: 'The spread of misinformation on social media confuses people.' },
      { word: 'Data privacy', arti: 'Privasi / kerahasiaan data', ex: 'Hospitals must protect patient data privacy strictly.' },
      { word: 'Algorithm', arti: 'Algoritma (urutan langkah logis)', ex: 'AI algorithms help predict which patients are at higher risk.' },
      { word: 'Cybersecurity', arti: 'Keamanan siber', ex: 'Keeping personal information safe online is part of good cybersecurity practice.' },
      { word: 'Automate', arti: 'Mengotomatiskan', ex: 'Hospitals will automate routine administrative tasks using AI.' },
    ],
    'vocab-env': [
      { word: 'Pollution', arti: 'Pencemaran / polusi', ex: 'Throwing plastic waste into rivers causes serious pollution.' },
      { word: 'Eco-friendly', arti: 'Ramah lingkungan', ex: 'Using tote bags is one simple eco-friendly habit.' },
      { word: 'Renewable energy', arti: 'Energi terbarukan', ex: 'Solar panels are an example of renewable energy.' },
      { word: 'Climate change', arti: 'Perubahan iklim', ex: 'Long-term changes in average temperatures are called climate change.' },
      { word: 'Biodegradable', arti: 'Dapat terurai secara alami', ex: 'Paper bags are biodegradable; plastic bags are not.' },
      { word: 'Carbon footprint', arti: 'Jejak karbon (emisi CO₂)', ex: 'Driving less reduces your carbon footprint significantly.' },
      { word: 'Deforestation', arti: 'Penggundulan hutan', ex: 'Deforestation has reduced habitats for wildlife in rural areas.' },
      { word: 'Greenhouse gas', arti: 'Gas rumah kaca', ex: 'Carbon dioxide is a greenhouse gas that traps heat in the atmosphere.' },
      { word: 'Recycle', arti: 'Mendaur ulang', ex: 'Students are encouraged to reduce, reuse, and recycle on campus.' },
    ],
    'vocab-nursing': [
      { word: 'Vital signs', arti: 'Tanda-tanda vital', ex: "The nurse measured the patient's vital signs every two hours." },
      { word: 'Prescription', arti: 'Resep dokter', ex: 'The doctor gave a prescription so she could buy the medicine.' },
      { word: 'Malnutrition', arti: 'Kekurangan gizi', ex: 'Children in rural areas may suffer from malnutrition.' },
      { word: 'Chronic disease', arti: 'Penyakit kronis / jangka panjang', ex: 'Diabetes and hypertension are examples of chronic diseases.' },
      { word: 'Screening', arti: 'Skrining / pemeriksaan awal', ex: 'Regular screening helps detect early signs of illness.' },
      { word: 'Referral', arti: 'Rujukan medis', ex: 'Complex cases need a referral to a bigger hospital.' },
      { word: 'Vulnerable population', arti: 'Kelompok rentan', ex: 'Elderly people living alone are considered a vulnerable population.' },
      { word: 'Preventive care', arti: 'Perawatan pencegahan', ex: 'Hand sanitizer and masks are tools for preventive care.' },
      { word: 'Outbreak', arti: 'Wabah / peningkatan kasus mendadak', ex: 'A sudden increase in cases is called an outbreak.' },
      { word: 'Administer medication', arti: 'Memberikan obat', ex: 'Nurses must correctly administer medication to avoid errors.' },
      { word: 'Community health worker', arti: 'Kader kesehatan masyarakat', ex: 'A community health worker helps villagers access medical services.' },
      { word: 'Pesticide exposure', arti: 'Paparan pestisida', ex: 'Farmers face health risks from pesticide exposure over time.' },
    ],
  };
  const [search, setSearch] = useState('');
  const words = data[category] || [];
  const filtered = search ? words.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase()) || w.arti.toLowerCase().includes(search.toLowerCase())
  ) : words;
  return (
    <div>
      <input className="bim-search" placeholder="Cari kata atau arti..." value={search} onChange={e => setSearch(e.target.value)} />
      <div style={{ display: 'grid', gap: '.65rem' }}>
        {filtered.map(item => (
          <div key={item.word} className="bim-vocab-card">
            <div className="bim-vocab-row">
              <span className="bim-vocab-word">{item.word}</span>
              <span className="bim-vocab-arti">{item.arti}</span>
            </div>
            <div className="bim-vocab-ex"><em>"{item.ex}"</em></div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#8a857e', padding: '2rem' }}>
            Kata tidak ditemukan — coba kata kunci lain.
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   KONTEN MATERI — READING
────────────────────────────────────────────────────────── */
function TopicReadingShort() {
  return (
    <div>
      <p className="bim-body" style={{ marginBottom: '1rem' }}>
        Short text biasanya 1–3 paragraf. Strategi efektif: <strong>baca pertanyaan dulu</strong>,
        lalu cari jawabannya di teks.
      </p>
      {[
        { step: '1. Identifikasi tipe soal', desc: 'Main idea, detail, vocabulary in context, atau inference.' },
        { step: '2. Baca pertanyaan dulu', desc: 'Sebelum membaca teks agar tahu apa yang dicari.' },
        { step: '3. Cari kata kunci', desc: 'Temukan kata atau frasa dari soal di dalam teks.' },
        { step: '4. Eliminasi pilihan salah', desc: 'Singkirkan opsi yang tidak relevan atau bertentangan dengan teks.' },
      ].map(s => (
        <div key={s.step} className="bim-step-row">
          <span className="bim-step-badge" style={{ background: 'color-mix(in srgb, var(--accent) 13%, transparent)', color: 'var(--accent)', border: '1px solid color-mix(in srgb, var(--accent) 27%, transparent)' }}>{s.step}</span>
          <span style={{ fontSize: 13.5, lineHeight: 1.6 }}>{s.desc}</span>
        </div>
      ))}
    </div>
  );
}

function TopicReadingLong() {
  return (
    <div>
      {[
        { step: '1. Baca judul & skim', desc: 'Baca judul dan lihat sekilas setiap paragraf untuk gambaran umum.' },
        { step: '2. Baca pertanyaan dulu', desc: 'Periksa semua pertanyaan sebelum membaca teks secara penuh.' },
        { step: '3. Scanning untuk detail', desc: 'Gunakan kata kunci dari soal untuk menemukan info spesifik.' },
        { step: '4. Vocabulary in context', desc: 'Gunakan kalimat sebelum dan sesudah kata untuk memahami artinya.' },
        { step: '5. Inference dari teks', desc: 'Kesimpulan harus didukung isi teks, bukan asumsi dari luar.' },
      ].map(s => (
        <div key={s.step} className="bim-step-row">
          <span className="bim-step-badge" style={{ background: 'color-mix(in srgb, var(--accent) 13%, transparent)', color: 'var(--accent)', border: '1px solid color-mix(in srgb, var(--accent) 27%, transparent)' }}>{s.step}</span>
          <span style={{ fontSize: 13.5, lineHeight: 1.6 }}>{s.desc}</span>
        </div>
      ))}
    </div>
  );
}

function TopicReadingDina() {
  const passage = `Nurse Dina is a community health nurse assigned to a remote village in East Java. Every week, she travels several hours to reach the village where she conducts health checks, distributes vitamins, and educates locals about hygiene and disease prevention. Unlike nurses in city hospitals, Dina must often make quick decisions without immediate access to medical equipment or specialists.

One of Dina's biggest challenges is persuading elderly residents to seek treatment when they show symptoms of chronic illness. Many of them distrust modern medicine and prefer traditional remedies. Dina approaches this by building trust slowly — she listens carefully, respects their beliefs, and explains the benefits of medical treatment in simple terms they can understand.

Dina also faces the issue of limited medical supplies. Sometimes, essential medications are unavailable in the village, and patients must travel to the city for treatment. To address this, she keeps a basic first aid kit and maintains close communication with the district health office to ensure timely supply deliveries.

Despite the many challenges, Dina finds her work deeply meaningful. She believes that every person in every corner of the country deserves access to quality healthcare, and her dedication reflects the values of compassion, perseverance, and equity that define modern nursing.`;

  const questions = [
    {
      type: 'MAIN IDEA', tujuan: 'Menemukan gagasan utama seluruh teks.',
      question: "What is the main idea of this passage?",
      options: ['The challenges of supplying medicines to rural areas',"Nurse Dina's work and challenges as a community health nurse in a remote village",'How elderly patients should use traditional remedies','The history of nursing in East Java'],
      correctIdx: 1,
      explanation: "Keseluruhan teks berfokus pada pekerjaan Dina sebagai perawat komunitas di desa terpencil, termasuk tantangan dan nilai-nilainya.",
    },
    {
      type: 'DETAIL', tujuan: 'Menemukan informasi yang disebutkan secara langsung.',
      question: "According to paragraph 2, how does Dina approach elderly patients who distrust modern medicine?",
      options: ['She forces them to take medication immediately','She ignores their traditional beliefs','She builds trust slowly by listening, respecting their beliefs, and explaining benefits simply','She asks the district doctor to visit them'],
      correctIdx: 2,
      explanation: "Paragraf 2 menyebutkan Dina membangun kepercayaan perlahan-lahan dengan mendengarkan, menghormati keyakinan, dan menjelaskan manfaat pengobatan dengan bahasa sederhana.",
    },
    {
      type: 'VOCABULARY IN CONTEXT', tujuan: 'Menentukan makna kata berdasarkan konteksnya.',
      question: 'The word "perseverance" in the last paragraph is closest in meaning to ______.',
      options: ['giving up easily','continued effort despite difficulties','perfect planning','financial success'],
      correctIdx: 1,
      explanation: '"Perseverance" artinya ketekunan/keteguhan — terus berusaha meskipun menghadapi banyak kesulitan.',
    },
    {
      type: 'INFERENCE', tujuan: 'Menyimpulkan informasi yang tidak dinyatakan langsung tapi didukung teks.',
      question: "What can be inferred about Dina's approach to nursing?",
      options: ['She thinks technology is the most important tool for nurses','She only cares about completing her administrative duties','She values human connection and cultural sensitivity as much as medical knowledge','She plans to move to a city hospital soon'],
      correctIdx: 2,
      explanation: "Dari cara Dina mendengarkan, menghormati keyakinan, dan menjelaskan dengan bahasa sederhana, dapat disimpulkan ia menghargai hubungan manusiawi dan kepekaan budaya.",
    },
  ];

  return (
    <div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', lineHeight: 1.8, fontSize: 14, whiteSpace: 'pre-line' }}>
        <div style={{ fontWeight: 700, color: '#8a857e', marginBottom: '.75rem', fontSize: 11, letterSpacing: .5, textTransform: 'uppercase' }}>
          TEKS BACAAN — Nurse Dina (Long Text)
        </div>
        {passage}
      </div>
      <div className="bim-h3" style={{ marginBottom: '.65rem' }}>Contoh Soal & Analisis (klik untuk cek jawaban)</div>
      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: '.5rem' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: .5 }}>
            {q.type} — <span style={{ color: '#8a857e', fontWeight: 400 }}>{q.tujuan}</span>
          </div>
          <SampleQuestion num={i + 1} question={q.question} options={q.options} correctIdx={q.correctIdx} explanation={q.explanation} />
        </div>
      ))}
    </div>
  );
}

function TopicReadingPractice() {
  // readingExamples (50 soal, dari bi-reading.js lama) dikelompokkan per teks
  // bacaan supaya tiap passage cuma ditampilkan sekali, lalu soal-soalnya
  // dibungkus Accordion per kelompok.
  const groups = [];
  for (const q of readingExamples) {
    let g = groups.find(g => g.passage === q.passage);
    if (!g) { g = { passage: q.passage, items: [] }; groups.push(g); }
    g.items.push(q);
  }

  return (
    <div>
      <p className="bim-body" style={{ marginBottom: '1rem' }}>
        {readingExamples.length} contoh soal reading dari {groups.length} teks bacaan — buat latihan
        mandiri, bukan quiz bernilai (nilai & ranking tetap lewat menu Quiz).
      </p>
      {groups.map((g, gi) => (
        <Accordion key={gi} title={`Teks ${gi + 1} — ${g.items.length} soal`}>
          <div className="bim-q-passage" style={{ marginBottom: '0.75rem' }}>{g.passage}</div>
          {g.items.map((q, i) => (
            <SampleQuestion
              key={q.id}
              num={i + 1}
              question={q.text}
              options={q.options}
              correctIdx={q.correctIndex}
              explanation={q.explanation}
            />
          ))}
        </Accordion>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   ROUTER
────────────────────────────────────────────────────────── */
const TOPIC_COMPONENTS = {
  tenses:       { label: 'Tenses',                          Component: TopicTenses },
  verbforms:    { label: 'Verb Forms V1–V5',                Component: TopicVerbForms },
  modal:        { label: 'Modal Verbs',                     Component: TopicModal },
  sva:          { label: 'Subject-Verb Agreement',          Component: TopicSVA },
  conditional:  { label: 'Conditional Sentences',           Component: TopicConditional },
  passive:      { label: 'Passive Voice',                   Component: TopicPassive },
  gerund:       { label: 'Gerund vs Infinitive',            Component: TopicGerund },
  relative:     { label: 'Relative Pronouns',               Component: TopicRelative },
  subjunctive:  { label: 'Subjunctive Mood',                Component: TopicSubjunctive },
  comparative:  { label: 'Comparative Structures',          Component: TopicComparative },
  preposition:  { label: 'Prepositions & Fixed Expressions',Component: TopicPreposition },
  'vocab-campus':  { label: 'Campus Life',                     Component: () => <TopicVocab category="vocab-campus" /> },
  'vocab-tech':    { label: 'Technology & Digital World',      Component: () => <TopicVocab category="vocab-tech" /> },
  'vocab-env':     { label: 'Environment & Sustainable Living',Component: () => <TopicVocab category="vocab-env" /> },
  'vocab-nursing': { label: 'Nursing / Agronursing',           Component: () => <TopicVocab category="vocab-nursing" /> },
  'reading-short': { label: 'Short Text Strategy',             Component: TopicReadingShort },
  'reading-long':  { label: 'Long Text Strategy',              Component: TopicReadingLong },
  'reading-dina':  { label: 'Contoh Long Text & Analisis',     Component: TopicReadingDina },
  'reading-practice': { label: 'Latihan Membaca (50 Contoh Soal)', Component: TopicReadingPractice },
};

/* ──────────────────────────────────────────────────────────
   LANDING DASHBOARD
────────────────────────────────────────────────────────── */
function LandingDashboard({ onSelectTopic, progress, navigate }) {
  const [search, setSearch] = useState('');
  const allTopics = NAV_ITEMS.flatMap(n => n.topics);
  const results = search.length >= 2 ? allTopics.filter(t => t.label.toLowerCase().includes(search.toLowerCase())) : [];

  return (
    <div>
      <div className="bim-disclaimer">
        <span style={{ fontSize: 16 }}>🤖</span>
        <span>
          <strong>Disclaimer AI:</strong> Materi ini disusun dengan bantuan Claude.ai dan ChatGPT
          berdasarkan materi TM 1–7 Semester 1 Angkatan 2026 (Kelas A · B · C · D).
          Gunakan sebagai panduan belajar — tetap verifikasi dengan catatan dan materi resmi dari dosenmu.
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '.4rem' }}>
        <span style={{ fontSize: 28 }}>🇬🇧</span>
        <h1 className="bim-h1">Materi Bahasa Inggris</h1>
      </div>
      <p className="bim-muted" style={{ marginBottom: '1.5rem' }}>
        Pahami konsepnya, kenali polanya, dan pelajari alasan di balik setiap jawaban.
      </p>

      <input className="bim-search" placeholder="Cari materi, istilah, atau contoh kalimat..." value={search} onChange={e => setSearch(e.target.value)} />

      {results.length > 0 && (
        <div className="bim-search-results">
          {results.map(t => (
            <button key={t.id} className="bim-search-result-btn" onClick={() => onSelectTopic(t.id)}>
              🔍 {t.label} <Badge color="#64748b">{t.tm}</Badge>
            </button>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/quiziz/bahasainggris')}
          style={{ flex: 1, minWidth: 180, background: 'linear-gradient(135deg,var(--accent),var(--accent))',
            color: '#fff', border: 'none', borderRadius: 2, padding: '.85rem 1.2rem',
            cursor: 'pointer', fontWeight: 800, fontSize: 15, display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'inherit', boxShadow: 'none' }}>
          ✏️ Langsung ke Kuis
        </button>
        <button onClick={() => onSelectTopic('tenses')}
          style={{ flex: 1, minWidth: 180, background: 'rgba(255,255,255,0.05)',
            color: 'var(--text, #f0ede8)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2, padding: '.85rem 1.2rem',
            cursor: 'pointer', fontWeight: 700, fontSize: 15, display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
          📚 Mulai dari Grammar
        </button>
      </div>

      {/* Category cards */}
      <div className="bim-land-grid">
        {NAV_ITEMS.map(n => {
          const done = n.topics.filter(t => progress[t.id]).length;
          return (
            <div key={n.category} className="bim-land-cat" style={{ borderTop: `3px solid ${n.color}` }}>
              <div className="bim-land-cat-icon">{n.icon}</div>
              <div className="bim-land-cat-title" style={{ color: n.color }}>{n.category}</div>
              <p className="bim-land-cat-desc">
                {n.category === 'GRAMMAR' && 'Pelajari aturan dan pola kalimat bahasa Inggris.'}
                {n.category === 'VOCABULARY' && 'Perluas kosakata melalui arti dan contoh penggunaan.'}
                {n.category === 'READING' && 'Belajar menemukan ide pokok, informasi detail, dan kesimpulan dari teks.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.65rem' }}>
                <span style={{ fontSize: 12, color: '#8a857e' }}>{done}/{n.topics.length} topik selesai</span>
                <Badge color={n.color}>{done}/{n.topics.length}</Badge>
              </div>
              <button className="bim-land-cat-btn" onClick={() => onSelectTopic(n.topics[0].id)}
                style={{ background: n.color, color: '#fff' }}>
                Mulai Belajar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────────────────────── */
export default function BahasaInggrisMateri() {
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState(null);
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bi_materi_progress') || '{}'); }
    catch { return {}; }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef(null);

  // Inject CSS
  useEffect(() => {
    const el = document.createElement('style');
    el.id = 'bim-page-styles';
    el.textContent = BIM_CSS;
    document.head.appendChild(el);
    return () => document.getElementById('bim-page-styles')?.remove();
  }, []);

  const selectTopic = useCallback((id) => {
    setActiveTopic(id);
    setSidebarOpen(false);
    setProgress(prev => {
      const next = { ...prev, [id]: true };
      try { localStorage.setItem('bi_materi_progress', JSON.stringify(next)); } catch {}
      return next;
    });
    if (mainRef.current) mainRef.current.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, []);

  const topicInfo     = activeTopic ? TOPIC_COMPONENTS[activeTopic] : null;
  const TopicComponent= topicInfo?.Component;
  const currentCat   = NAV_ITEMS.find(n => n.topics.some(t => t.id === activeTopic));
  const catColor     = currentCat?.color || 'var(--accent)';

  // Prev / next navigation
  const allFlat = NAV_ITEMS.flatMap(n => n.topics);
  const topicIdx = allFlat.findIndex(t => t.id === activeTopic);
  const prevTopic = allFlat[topicIdx - 1];
  const nextTopic = allFlat[topicIdx + 1];

  return (
    <div className="bim-page">
      {/* Overlay (mobile) */}
      <div
        className={`bim-sb-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── SIDEBAR ── */}
      <aside className={`bim-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="bim-sb-head">
          <button className="bim-sb-back" onClick={() => navigate(-1)}>← Kembali</button>
          <div className="bim-sb-title">Materi Bahasa Inggris</div>
          <div className="bim-sb-sub">TM 1–7 · Angkatan 2026</div>
        </div>

        <button
          className={`bim-sb-dash${!activeTopic ? ' active' : ''}`}
          onClick={() => { setActiveTopic(null); setSidebarOpen(false); }}
        >
          🏠 Dashboard
        </button>

        {NAV_ITEMS.map(n => (
          <div key={n.category}>
            <div className="bim-sb-cat" style={{ color: n.color }}>
              {n.icon} {n.category}
            </div>
            {n.topics.map(t => (
              <button
                key={t.id}
                className={`bim-sb-btn${activeTopic === t.id ? ' active' : ''}`}
                style={activeTopic === t.id ? { borderLeftColor: n.color } : {}}
                onClick={() => selectTopic(t.id)}
              >
                <span>
                  {progress[t.id] && <span className="bim-sb-check">✓</span>}
                  {t.label}
                </span>
                <span className="bim-sb-tm">{t.tm}</span>
              </button>
            ))}
          </div>
        ))}

        <div className="bim-sb-quiz">
          <button className="bim-sb-quizbtn" onClick={() => navigate('/quiziz/bahasainggris')}>
            ✏️ Mulai Kuis
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main ref={mainRef} style={{ flex: 1, padding: '2rem 2rem 6rem', maxWidth: 900, margin: '0 auto', width: '100%', overflowX: 'hidden' }}>
        {/* Mobile bar */}
        <div className="bim-mobile-bar">
          <button className="bim-mobile-toggler" onClick={() => setSidebarOpen(o => !o)}>
            ☰ {activeTopic ? topicInfo?.label : 'Menu Materi'}
          </button>
          <button className="bim-mobile-toggler" onClick={() => navigate('/quiziz/bahasainggris')}>
            ✏️ Kuis
          </button>
        </div>

        {/* LANDING */}
        {!activeTopic && (
          <LandingDashboard onSelectTopic={selectTopic} progress={progress} navigate={navigate} />
        )}

        {/* TOPIC CONTENT */}
        {activeTopic && topicInfo && (
          <>
            {/* Breadcrumb */}
            <div className="bim-crumb">
              <button className="bim-crumb-btn" onClick={() => setActiveTopic(null)}>← Dashboard</button>
              <span>›</span>
              <span style={{ color: catColor, fontWeight: 600 }}>{currentCat?.category}</span>
            </div>

            {/* Content card */}
            <div className="bim-card" style={{ borderTop: `3px solid ${catColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: 12, flexWrap: 'wrap' }}>
                <h2 className="bim-h2">{topicInfo.label}</h2>
                {progress[activeTopic]
                  ? <Badge color="#34d399">✓ Selesai dibaca</Badge>
                  : <button onClick={() => selectTopic(activeTopic)}
                      style={{ background: 'none', border: `1px solid ${catColor}44`, borderRadius: 2,
                        padding: '2px 12px', fontSize: 11.5, fontWeight: 700, color: catColor,
                        cursor: 'pointer', fontFamily: 'inherit' }}>
                      Tandai Selesai
                    </button>
                }
              </div>
              <TopicComponent />
            </div>

            {/* Prev / Next */}
            {(prevTopic || nextTopic) && (
              <div className="bim-nav-row">
                {prevTopic && (
                  <button className="bim-nav-btn bim-nav-prev" onClick={() => selectTopic(prevTopic.id)}>
                    ← {prevTopic.label}
                  </button>
                )}
                {nextTopic && (
                  <button className="bim-nav-btn bim-nav-next" style={{ background: catColor }} onClick={() => selectTopic(nextTopic.id)}>
                    {nextTopic.label} →
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}