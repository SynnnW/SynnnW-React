// src/pages/quiziz/MateriMatkul.jsx — routes: /quiziz/<slug>/materi dan /quiziz/<slug>/praktikum
// Halaman materi per bab, data-driven. Pola tampilan sama dengan MateriBahasaInggris.jsx
// (sidebar bab, pencarian, penanda progres, drawer di mobile), komponennya dari MateriKit.jsx.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { MATERI } from '../../data/quiziz/materi/registry';
import { useMateriStyles, Blocks, Badge, blocksToText } from '../../components/quiz/MateriKit';
import LeoAIChat from '../../components/quiz/LeoAIChat';

export default function MateriMatkul({ slug, mode = 'materi' }) {
  useMateriStyles();
  const navigate = useNavigate();
  const cfg = MATERI[slug];
  const isPrak = mode === 'praktikum';
  const manifest = useMemo(() => (cfg ? (isPrak ? cfg.praktikum || [] : cfg.manifest) : []), [cfg, isPrak]);
  const flat = useMemo(() => manifest.flatMap((g) => g.babs.filter((b) => !b.segera).map((b) => ({ ...b, category: g.category }))), [manifest]);

  const storeKey = `materi_progress_${slug}_${mode}`;
  const [activeId, setActiveId] = useState(null);
  const [bab, setBab] = useState(null);        // modul bab yang sedang dibuka
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState(false);
  const [progress, setProgress] = useState(() => { try { return JSON.parse(localStorage.getItem(storeKey) || '{}'); } catch { return {}; } });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [index, setIndex] = useState(null);    // [{id, label, text}] untuk pencarian
  const [hl, setHl] = useState('');
  const mainRef = useRef(null);
  const babText = useMemo(() => (bab ? blocksToText(bab.blocks) : ''), [bab]); // konteks Leo AI

  const select = useCallback((id) => {
    const entry = flat.find((b) => b.id === id);
    if (!entry) return;
    setActiveId(id); setSidebarOpen(false); setLoading(true); setLoadErr(false);
    entry.load().then((m) => { setBab(m.default); setLoading(false); }).catch(() => { setLoadErr(true); setLoading(false); });
    window.scrollTo(0, 0); mainRef.current?.scrollTo?.(0, 0);
  }, [flat]);

  const markDone = useCallback((id) => {
    setProgress((prev) => {
      const next = { ...prev, [id]: true };
      try { localStorage.setItem(storeKey, JSON.stringify(next)); } catch { /* abaikan */ }
      return next;
    });
  }, [storeKey]);

  // Pencarian teks biasa: muat semua bab matkul ini sekali, lalu cari di teks polosnya
  useEffect(() => {
    if (term.trim().length < 2 || index) return;
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

  if (!cfg) return <Navigate to="/quiziz/materi" replace />;

  const title = isPrak ? `Praktikum ${cfg.title}` : cfg.title;
  const idx = flat.findIndex((b) => b.id === activeId);
  const prev = flat[idx - 1]; const next = flat[idx + 1];
  const ctx = { matkul: title, bab: bab?.title || '', babId: activeId || '' };

  return (
    <div className="bim-page">
      <div className={`bim-sb-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`bim-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="bim-sb-head">
          <button className="bim-sb-back" onClick={() => navigate('/quiziz/materi')}>← Kembali ke daftar materi</button>
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
              <button key={r.id} className="bim-search-result-btn" onClick={() => { setHl(term.trim()); select(r.id); }}>
                <strong>{r.label}</strong><br /><span className="bim-muted">{r.snippet}</span>
              </button>
            ))}
          </div>
        )}

        <button className={`bim-sb-dash${!activeId ? ' active' : ''}`} onClick={() => { setActiveId(null); setBab(null); setSidebarOpen(false); }}>
          <i className="fa-solid fa-house" aria-hidden="true" /> Dashboard
        </button>

        {manifest.map((g) => (
          <div key={g.category}>
            <div className="bim-sb-cat">{g.category}</div>
            {g.babs.map((b) => (
              <button key={b.id} className={`bim-sb-btn${activeId === b.id ? ' active' : ''}${b.segera ? ' soon' : ''}`}
                disabled={!!b.segera} onClick={() => select(b.id)}>
                <span>{progress[b.id] && <span className="bim-sb-check">✓</span>}{b.label}</span>
                <span className="bim-sb-tm">{b.segera ? 'Segera' : b.badge}</span>
              </button>
            ))}
          </div>
        ))}

        {!isPrak && (
          <div className="bim-sb-quiz">
            <button className="bim-sb-quizbtn" onClick={() => navigate(`/quiziz/${slug}`)}>
              <i className="fa-solid fa-pencil" aria-hidden="true" /> Mulai Kuis
            </button>
          </div>
        )}
      </aside>

      <main ref={mainRef} style={{ flex: 1, padding: '2rem 2rem 6rem', maxWidth: 900, margin: '0 auto', width: '100%', overflowX: 'hidden' }}>
        <div className="bim-mobile-bar">
          <button className="bim-mobile-toggler" onClick={() => setSidebarOpen((o) => !o)}>{bab ? bab.title : 'Menu Materi'}</button>
          <button className="bim-mobile-toggler" onClick={() => navigate('/quiziz/materi')}>← Daftar materi</button>
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
                {isPrak ? 'Modul praktikum untuk matkul ini belum tersedia. Menyusul begitu semua modulnya selesai diperiksa.' : 'Belum ada bab yang tersedia.'}
              </p></div>
            )}
            {manifest.map((g) => (
              <div key={g.category} style={{ marginBottom: '1.5rem' }}>
                <h2 className="bim-h2" style={{ fontSize: '1.05rem', marginBottom: '.6rem' }}>{g.category}</h2>
                <div className="bim-land-grid">
                  {g.babs.map((b) => (
                    <button key={b.id} className="bim-land-cat-btn" disabled={!!b.segera} onClick={() => select(b.id)}
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
            <div className="bim-crumb">
              <button className="bim-crumb-btn" onClick={() => { setActiveId(null); setBab(null); }}>← Dashboard</button>
              <span>›</span>
              <span style={{ fontWeight: 600 }}>{flat[idx]?.category}</span>
            </div>
            <div className="bim-card" style={{ borderTop: '3px solid var(--accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: 12, flexWrap: 'wrap' }}>
                <h2 className="bim-h2">{flat[idx]?.label}</h2>
                {progress[activeId]
                  ? <Badge color="var(--ok)">✓ Selesai dibaca</Badge>
                  : <button onClick={() => markDone(activeId)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 2, padding: '2px 12px', fontSize: 11.5, fontWeight: 700, color: 'var(--accent-text)', cursor: 'pointer', fontFamily: 'inherit' }}>Tandai Selesai</button>}
              </div>
              {hl && <div className="bim-banner" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span>Menyorot “{hl}”</span><button className="bim-crumb-btn" onClick={() => setHl('')}>Hapus sorotan</button></div>}
              {loading && <p className="bim-muted" role="status">Memuat bab…</p>}
              {loadErr && <p className="bim-body" role="alert">Bab gagal dimuat. Periksa koneksi lalu coba lagi.</p>}
              {bab && !loading && <Blocks blocks={bab.blocks} hl={hl} ctx={ctx} />}
              {bab && !loading && bab.sumber && <p className="bim-muted" style={{ marginTop: '1.2rem' }}>Sumber bab: {bab.sumber}</p>}
            </div>
            {(prev || next) && (
              <div className="bim-nav-row">
                {prev && <button className="bim-nav-btn bim-nav-prev" onClick={() => select(prev.id)}>← {prev.label}</button>}
                {next && <button className="bim-nav-btn bim-nav-next" style={{ background: 'var(--accent)' }} onClick={() => select(next.id)}>{next.label} →</button>}
              </div>
            )}
          </>
        )}
      </main>

      <LeoAIChat pageContext={ctx} materiText={babText} />
    </div>
  );
}
