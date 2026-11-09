// ─── SongSearch — pencarian lagu (iTunes API) + mode manual ─────────────────
// Tanpa API key. Debounce 500ms, AbortController, cache memori per sesi.
import { useState, useRef, useCallback } from 'react';

const MEMO_CACHE = new Map(); // cache per sesi di memori

const ALLOWED_DOMAINS = [
  'open.spotify.com','spotify.link','youtu.be','youtube.com',
  'music.youtube.com','music.apple.com',
];
function validateSongUrl(url) {
  if (!url) return true;
  try {
    const h = new URL(url).hostname.replace('www.','');
    return ALLOWED_DOMAINS.some(d => h === d || h.endsWith('.'+d));
  } catch { return false; }
}

/**
 * @param {{ value: object|null, onChange: (song|null)=>void }} props
 * value shape: { song_title, song_artist, song_artwork_url, song_preview_url, song_url, song_source }
 */
export default function SongSearch({ value, onChange }) {
  const [query,    setQuery]    = useState('');
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [manual,   setManual]   = useState(false);
  const [urlError, setUrlError] = useState('');
  const [manualForm, setManualForm] = useState({
    song_title: '', song_artist: '', song_url: '',
  });
  const abortRef = useRef(null);

  const search = useCallback(async (q) => {
    if (q.length < 3) { setResults([]); return; }
    if (MEMO_CACHE.has(q)) { setResults(MEMO_CACHE.get(q)); return; }
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=6&country=ID`,
        { signal: abortRef.current.signal }
      );
      const data = await res.json();
      const items = (data.results || []).map(t => ({
        song_title:       t.trackName,
        song_artist:      t.artistName,
        song_artwork_url: (t.artworkUrl100 || '').replace('100x100', '300x300'),
        song_preview_url: t.previewUrl || null,
        song_url:         t.trackViewUrl || null,
        song_source:      'itunes',
      }));
      MEMO_CACHE.set(q, items);
      setResults(items);
    } catch (e) {
      if (e.name !== 'AbortError') setResults([]);
    } finally { setLoading(false); }
  }, []);

  // Debounce
  const timerRef = useRef(null);
  function handleQueryChange(e) {
    const q = e.target.value;
    setQuery(q);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(q), 500);
  }

  function selectSong(song) {
    onChange(song);
    setResults([]);
    setQuery('');
  }

  function clearSong() { onChange(null); }

  function submitManual() {
    const { song_title, song_artist, song_url } = manualForm;
    if (!song_title.trim()) return;
    if (song_url && !validateSongUrl(song_url)) { setUrlError('URL tidak valid. Pakai Spotify, YouTube, atau Apple Music.'); return; }
    setUrlError('');
    onChange({
      song_title:       song_title.trim(),
      song_artist:      song_artist.trim() || null,
      song_artwork_url: null,
      song_preview_url: null,
      song_url:         song_url.trim() || null,
      song_source:      'manual',
    });
    setManual(false);
    setManualForm({ song_title: '', song_artist: '', song_url: '' });
  }

  if (value?.song_title) {
    return (
      <div style={{ display:'flex',alignItems:'center',gap:10,background:'var(--mf-soft)',borderRadius:'var(--mf-radius-sm)',padding:'8px 12px',border:'2px solid var(--mf-ink)' }}>
        {value.song_artwork_url && (
          <img src={value.song_artwork_url} alt="" width={40} height={40}
            style={{ borderRadius:6,flexShrink:0 }} loading="lazy" />
        )}
        <div style={{ flex:1,minWidth:0 }}>
          <p style={{ margin:0,fontWeight:700,fontSize:'.88rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
            ♪ {value.song_title}
          </p>
          {value.song_artist && (
            <p style={{ margin:0,fontSize:'.78rem',opacity:.7,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
              {value.song_artist}
            </p>
          )}
        </div>
        <button className="mf-btn mf-btn-ghost" style={{ padding:'4px 8px',fontSize:'.8rem',flexShrink:0 }} onClick={clearSong}>
          ✕ Hapus
        </button>
      </div>
    );
  }

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
      {!manual ? (
        <>
          <div style={{ display:'flex',gap:8 }}>
            <input
              className="mf-input mf-allow"
              type="search"
              value={query}
              onChange={handleQueryChange}
              placeholder="🔍 Cari lagu… (min 3 huruf)"
              style={{ flex:1 }}
            />
            <button className="mf-btn mf-btn-ghost" style={{ flexShrink:0,fontSize:'.8rem' }} onClick={() => setManual(true)}>
              Ketik manual
            </button>
          </div>

          {loading && <p style={{ fontSize:'.8rem',opacity:.6 }}>Mencari…</p>}

          {!loading && results.length > 0 && (
            <div style={{ display:'flex',flexDirection:'column',gap:4,maxHeight:260,overflowY:'auto',border:'2px solid var(--mf-ink)',borderRadius:'var(--mf-radius-sm)',background:'white' }}>
              {results.map((s, i) => (
                <button key={i} className="mf-btn mf-btn-ghost"
                  style={{ justifyContent:'flex-start',gap:10,padding:'8px 12px',borderRadius:0,borderBottom:'1px solid var(--mf-soft)' }}
                  onClick={() => selectSong(s)}>
                  {s.song_artwork_url && (
                    <img src={s.song_artwork_url} alt="" width={36} height={36}
                      style={{ borderRadius:4,flexShrink:0 }} loading="lazy" />
                  )}
                  <div style={{ textAlign:'left',minWidth:0 }}>
                    <p style={{ margin:0,fontWeight:700,fontSize:'.85rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                      {s.song_title}
                    </p>
                    <p style={{ margin:0,fontSize:'.75rem',opacity:.7 }}>{s.song_artist}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && query.length >= 3 && results.length === 0 && (
            <p style={{ fontSize:'.8rem',opacity:.6 }}>
              Tidak ditemukan. <button className="mf-btn mf-btn-ghost" style={{ padding:'2px 6px',fontSize:'.8rem' }} onClick={() => setManual(true)}>Ketik manual →</button>
            </p>
          )}
        </>
      ) : (
        <div style={{ display:'flex',flexDirection:'column',gap:8,background:'var(--mf-tint)',borderRadius:'var(--mf-radius-sm)',padding:12,border:'2px solid var(--mf-ink)' }}>
          <input className="mf-input mf-allow" type="text" placeholder="Judul lagu *"
            value={manualForm.song_title}
            onChange={e => setManualForm(f => ({ ...f, song_title: e.target.value }))} />
          <input className="mf-input mf-allow" type="text" placeholder="Artis (opsional)"
            value={manualForm.song_artist}
            onChange={e => setManualForm(f => ({ ...f, song_artist: e.target.value }))} />
          <input className="mf-input mf-allow" type="url" placeholder="Link Spotify/YouTube/Apple Music (opsional)"
            value={manualForm.song_url}
            onChange={e => { setManualForm(f => ({ ...f, song_url: e.target.value })); setUrlError(''); }} />
          {urlError && <p style={{ color:'var(--mf-brick)',fontSize:'.8rem',margin:0 }}>{urlError}</p>}
          <div style={{ display:'flex',gap:8 }}>
            <button className="mf-btn mf-btn-primary" style={{ flex:1 }} onClick={submitManual}
              disabled={!manualForm.song_title.trim()}>Pakai lagu ini</button>
            <button className="mf-btn mf-btn-ghost" onClick={() => { setManual(false); setUrlError(''); }}>Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}
