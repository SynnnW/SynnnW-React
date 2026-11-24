// src/pages/quiziz/MateriMatkul.jsx — routes: /quiziz/<slug>/materi[/:babId] dan /quiziz/<slug>/praktikum[/:babId]
// Reader materi per bab, data-driven (komponen blok dari MateriKit). URL adalah SUMBER KEBENARAN bab yang dibuka:
// refresh, back/forward, dan tautan yang dibagikan membuka tempat yang benar; `?bab=` (alias lama) dialihkan ke bentuk path.
// Isi bab hanya tampil bila sudah dimuat UNTUK bab yang sedang aktif (lihat useBabLoader), jadi pindah bab cepat tidak pernah
// menampilkan isi bab lama di bawah judul bab baru, dan Leo tidak pernah menerima judul dan isi dari bab yang berbeda.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MATERI } from '../../data/quiziz/materi/registry';
import { getSubject } from '../../data/quiziz/registry';
import { PATHS, babPath, readerBase } from '../../data/quiziz/routes';
import { countWords, readingMinutes } from '../../data/quiziz/reading';
import { useMateriStyles, Blocks, blocksToText } from '../../components/quiz/MateriKit';
import { buildHeadingIds, headingItems } from '../../components/quiz/readerText';
import { useBabLoader, useReadPosition, useReaderPrefs } from '../../components/quiz/useReader';
import { ChapterFooter, ReaderMeta, ReaderTools, Toc } from '../../components/quiz/ReaderParts';
import LeoAIChat from '../../components/quiz/LeoAIChat';
import '../../styles/reader.css';

export default function MateriMatkul({ slug, mode = 'materi' }) {
  useMateriStyles();
  const navigate = useNavigate();
  const { babId } = useParams();
  const [params] = useSearchParams();
  const cfg = MATERI[slug];
  const subject = getSubject(slug);
  const isPrak = mode === 'praktikum';
  const base = readerBase(slug, mode);
  const manifest = useMemo(() => (cfg ? (isPrak ? cfg.praktikum || [] : cfg.manifest) : []), [cfg, isPrak]);
  const flat = useMemo(() => manifest.flatMap((g) => g.babs.filter((b) => !b.segera).map((b) => ({ ...b, category: g.category }))), [manifest]);

  const storeKey = `materi_progress_${slug}_${mode}`;
  const [progress, setProgress] = useState(() => { try { return JSON.parse(localStorage.getItem(storeKey) || '{}'); } catch { return {}; } });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [index, setIndex] = useState(null);    // [{id, label, text}] untuk pencarian
  const [hl, setHl] = useState('');
  const { prefs, canSmaller, canBigger, smaller, bigger, toggleFocus } = useReaderPrefs();

  const entry = useMemo(() => flat.find((b) => b.id === babId) || null, [flat, babId]);
  const activeId = entry ? entry.id : null;
  const { bab, ready, loading, error, retry } = useBabLoader(entry);
  useReadPosition({ slug, mode, babId: activeId, ready: ready && !error });

  const babText = useMemo(() => (bab ? blocksToText(bab.blocks) : ''), [bab]); // konteks Leo AI
  const ids = useMemo(() => (bab ? buildHeadingIds(bab.blocks) : new Map()), [bab]);
  const toc = useMemo(() => headingItems(ids), [ids]);
  const minutes = bab ? readingMinutes(countWords(babText)) : 0;

  const go = useCallback((id) => { setSidebarOpen(false); navigate(babPath(slug, mode, id)); }, [navigate, slug, mode]);
  const setDone = useCallback((id, value) => {
    setProgress((prev) => {
      const next = { ...prev };
      if (value) next[id] = true; else delete next[id];
      try { localStorage.setItem(storeKey, JSON.stringify(next)); } catch { /* abaikan */ }
      return next;
    });
  }, [storeKey]);

  // Pencarian teks biasa: muat semua bab matkul ini sekali, lalu cari di teks polosnya
  useEffect(() => {
    if (term.trim().length < 2 || index) return undefined;
    let alive = true;
    Promise.all(flat.map((b) => b.load().then((m) => ({ id: b.id, label: b.label, text: blocksToText(m.default.blocks) })).catch(() => null)))
      .then((rows) => { if (alive) setIndex(rows.filter(Boolean)); });
    return () => { alive = false; };
  }, [term, index, flat]);

  const results = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (q.length < 2 || !index) return [];
    return index.flatMap((r) => {
      const at = r.text.toLowerCase().indexOf(q);
      if (at < 0) return [];
      const s = Math.max(0, at - 40);
      return [{ id: r.id, label: r.label, snippet: (s > 0 ? '…' : '') + r.text.slice(s, at + 80).replace(/\n/g, ' ') + '…' }];
    }).slice(0, 12);
  }, [term, index]);

  if (!cfg) return <Navigate to={PATHS.berandaMateri} replace />;
  const legacy = params.get('bab');
  if (!babId && legacy && flat.some((b) => b.id === legacy)) return <Navigate to={babPath(slug, mode, legacy)} replace />;
  if (babId && !entry) return <Navigate to={base} replace />;

  const title = isPrak ? `Praktikum ${cfg.title}` : cfg.title;
  const at = flat.findIndex((b) => b.id === activeId);
  const toLink = (b) => b && { to: babPath(slug, mode, b.id), label: b.label };
  const ctx = { matkul: title, bab: bab ? bab.title || entry.label : '', babId: bab ? activeId : '' };

  return (
    <div className={`bim-page${prefs.focus ? ' bim-focus' : ''}`}>
      <div className={`bim-sb-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`bim-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="bim-sb-head">
          <button className="bim-sb-back" onClick={() => navigate(PATHS.berandaMateri)}>← Kembali ke daftar materi</button>
          <div className="bim-sb-title">{title}</div>
          <div className="bim-sb-sub">{cfg.sub}</div>
          <input className="bim-search" type="search" placeholder="Cari di materi ini…" value={term}
            onChange={(e) => { setTerm(e.target.value); if (!e.target.value) setHl(''); }} aria-label="Cari di materi" />
        </div>

        {term.trim().length >= 2 && (
          <div className="bim-search-results">
            {!index && <div className="bim-muted" style={{ padding: '0 1rem' }}>Memuat…</div>}
            {index && results.length === 0 && <div className="bim-muted" style={{ padding: '0 1rem' }}>Tidak ada hasil.</div>}
            {results.map((r) => (
              <button key={r.id} className="bim-search-result-btn" onClick={() => { setHl(term.trim()); go(r.id); }}>
                <strong>{r.label}</strong><br /><span className="bim-muted">{r.snippet}</span>
              </button>
            ))}
          </div>
        )}

        <button className={`bim-sb-dash${!activeId ? ' active' : ''}`} onClick={() => { setSidebarOpen(false); navigate(base); }}>
          <i className="fa-solid fa-house" aria-hidden="true" /> Dashboard
        </button>

        {manifest.map((g) => (
          <div key={g.category}>
            <div className="bim-sb-cat">{g.category}</div>
            {g.babs.map((b) => (
              <button key={b.id} className={`bim-sb-btn${activeId === b.id ? ' active' : ''}${b.segera ? ' soon' : ''}`}
                aria-current={activeId === b.id ? 'page' : undefined} disabled={!!b.segera} onClick={() => go(b.id)}>
                <span>{progress[b.id] && <span className="bim-sb-check">✓</span>}{b.label}</span>
                <span className="bim-sb-tm">{b.segera ? 'Segera' : b.badge}</span>
              </button>
            ))}
          </div>
        ))}

        {!isPrak && (
          <div className="bim-sb-quiz">
            {subject?.latsol
              ? (
                <button className="bim-sb-quizbtn" onClick={() => navigate(subject.latsol.path)}>
                  <i className="fa-solid fa-pencil" aria-hidden="true" /> Latsol {subject.short}
                </button>
              )
              : <p className="bim-muted" style={{ margin: 0, padding: '0 1rem' }}>Latsol mata kuliah ini belum tersedia.</p>}
          </div>
        )}
      </aside>

      <main style={{ flex: 1, padding: '2rem 2rem 6rem', maxWidth: 900, margin: '0 auto', width: '100%', overflowX: 'hidden' }}>
        <div className="bim-mobile-bar">
          <button className="bim-mobile-toggler" onClick={() => setSidebarOpen((o) => !o)}>{entry ? entry.label : 'Menu Materi'}</button>
          <button className="bim-mobile-toggler" onClick={() => navigate(PATHS.berandaMateri)}>← Daftar materi</button>
        </div>

        {!activeId && (
          <>
            <h1 className="bim-h1">{title}</h1>
            <p className="bim-muted" style={{ marginBottom: '1rem' }}>{cfg.sub}</p>
            {cfg.note && !isPrak && <div className="bim-banner"><strong>Catatan:</strong> {cfg.note}</div>}
            <div className="bim-disclaimer" style={{ marginBottom: '1rem' }}>
              Materi ini disusun dengan bantuan AI dari bahan dosen. Gunakan untuk belajar mandiri dan tetap cocokkan dengan materi resmi dari dosen pengampu.
            </div>
            {flat.length === 0 && (
              <div className="bim-card"><p className="bim-body" style={{ margin: 0 }}>
                {isPrak ? 'Modul praktikum untuk matkul ini belum tersedia.' : 'Belum ada bab yang tersedia.'}
              </p></div>
            )}
            {manifest.map((g) => (
              <div key={g.category} style={{ marginBottom: '1.5rem' }}>
                <h2 className="bim-h2" style={{ fontSize: '1.05rem', marginBottom: '.6rem' }}>{g.category}</h2>
                <div className="bim-land-grid">
                  {g.babs.map((b) => (
                    <button key={b.id} className="bim-land-cat-btn" disabled={!!b.segera} onClick={() => go(b.id)}
                      style={b.segera ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}>
                      <div className="bim-land-cat-title">{progress[b.id] ? '✓ ' : ''}{b.label}</div>
                      <div className="bim-land-cat-desc">{b.segera ? 'Segera' : b.badge}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {activeId && (
          <>
            <ReaderTools crumbs={[{ label: subject?.short || title, to: base }, { label: entry.category }]}
              prefs={prefs} canSmaller={canSmaller} canBigger={canBigger} onSmaller={smaller} onBigger={bigger} onFocus={toggleFocus} />
            <div className="bim-card bim-read" style={{ borderTop: '3px solid var(--accent)', '--bim-scale': prefs.font }}>
              <h2 id="bim-title" tabIndex={-1} className="bim-h2" style={{ marginBottom: '1.25rem' }}>{entry.label}</h2>
              {bab && <ReaderMeta source={bab.sumber} minutes={minutes} />}
              {hl && <div className="bim-banner" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span>Menyorot “{hl}”</span><button className="bim-crumb-btn" onClick={() => setHl('')}>Hapus sorotan</button></div>}
              {loading && <p className="bim-muted" role="status">Memuat bab…</p>}
              {error && (
                <p className="bim-body" role="alert">
                  Bab gagal dimuat. Periksa koneksi lalu <button type="button" className="bim-crumb-btn" onClick={retry}>coba lagi</button>.
                </p>
              )}
              {bab && <><Toc items={toc} /><Blocks blocks={bab.blocks} hl={hl} ctx={ctx} ids={ids} /></>}
            </div>
            {bab && (
              <ChapterFooter done={!!progress[activeId]} onDone={() => setDone(activeId, true)} onUndo={() => setDone(activeId, false)}
                prev={toLink(flat[at - 1])} next={toLink(flat[at + 1])} latsol={!isPrak ? subject?.latsol : null} />
            )}
          </>
        )}
      </main>

      <LeoAIChat pageContext={ctx} materiText={babText} />
    </div>
  );
}
