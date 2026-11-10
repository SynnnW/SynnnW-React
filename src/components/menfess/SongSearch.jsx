// ─── SongSearch — pencarian lagu (iTunes API) + mode manual ─────────────────
// Tanpa API key. Debounce 500ms, AbortController, cache memori per sesi.
import { useState, useRef, useCallback } from 'react';
import { Button, Icon, IconButton } from './ui';
import SongPill from './ui/SongPill';
import SongPreviewButton from './SongPreviewButton';

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
      <div className="mf-stack">
        <div className="mf-row">
          <div className="mf-grow"><SongPill song={value} preview={false} /></div>
          <IconButton icon="close" label="Hapus lagu" variant="secondary" onClick={clearSong} />
        </div>
        <SongPreviewButton labeled title={value.song_title} artist={value.song_artist} />
      </div>
    );
  }

  return (
    <div className="mf-stack">
      {!manual ? (
        <>
          <div className="mf-row">
            <input className="mf-input mf-allow" type="search" value={query} onChange={handleQueryChange}
              placeholder="Cari lagu… (min 3 huruf)" aria-label="Cari lagu" autoComplete="off" />
            <Button variant="ghost" size="sm" onClick={() => setManual(true)}>Ketik manual</Button>
          </div>
          {loading && <p className="mf-small mf-muted" role="status">Mencari…</p>}
          {!loading && results.length > 0 && (
            <div className="mf-stack" role="listbox" aria-label="Hasil pencarian lagu">
              {results.map((s, i) => (
                <button key={i} type="button" role="option" className="mf-song" style={{ cursor: 'pointer', textAlign: 'left' }} onClick={() => selectSong(s)}>
                  {s.song_artwork_url ? <img src={s.song_artwork_url} alt="" width="40" height="40" loading="lazy" /> : <span className="mf-song-art"><Icon name="music" size={18} /></span>}
                  <span className="mf-grow"><div className="mf-song-t">{s.song_title}</div><div className="mf-song-a">{s.song_artist}</div></span>
                </button>
              ))}
            </div>
          )}
          {!loading && query.length >= 3 && results.length === 0 && (
            <p className="mf-small mf-muted">Tidak ditemukan. <button type="button" className="mf-btn mf-btn-ghost mf-btn-sm" onClick={() => setManual(true)}>Ketik manual</button></p>
          )}
        </>
      ) : (
        <div className="mf-stack">
          <input className="mf-input mf-allow" type="text" placeholder="Judul lagu *" aria-label="Judul lagu" value={manualForm.song_title}
            onChange={e => setManualForm(f => ({ ...f, song_title: e.target.value }))} />
          <input className="mf-input mf-allow" type="text" placeholder="Artis (opsional)" aria-label="Artis" value={manualForm.song_artist}
            onChange={e => setManualForm(f => ({ ...f, song_artist: e.target.value }))} />
          <input className="mf-input mf-allow" type="url" placeholder="Link Spotify/YouTube/Apple Music (opsional)" aria-label="Link lagu" value={manualForm.song_url}
            onChange={e => { setManualForm(f => ({ ...f, song_url: e.target.value })); setUrlError(''); }} />
          {urlError && <span className="mf-error" role="alert">{urlError}</span>}
          <div className="mf-row">
            <Button onClick={submitManual} disabled={!manualForm.song_title.trim()}>Pakai lagu ini</Button>
            <Button variant="ghost" onClick={() => { setManual(false); setUrlError(''); }}>Batal</Button>
          </div>
        </div>
      )}
    </div>
  );
}
