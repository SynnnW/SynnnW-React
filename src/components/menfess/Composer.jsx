// ─── Composer — form kirim menfess dengan preview canvas WYSIWYG ─────────────
import { useState, useEffect, useRef, useCallback } from 'react';
import { CATEGORIES, SONG_CATEGORIES, RULES_VERSION } from '@/lib/menfess/rules';
import { submitPost } from '@/lib/menfess/api';
import { drawCard, renderCardBlob, cardFilename } from '@/lib/menfess/renderCard';
import { saveDraft, loadDraft, clearDraft, detectDoxxing } from './utils';
import SongSearch from './SongSearch';
import RulesGate  from './RulesGate';

const MAX_BODY  = 400;
const MAX_LABEL = 30;

export default function Composer({ settings, onSent, initialDraft = null }) {
  const draft = initialDraft || loadDraft() || {};

  const [to,         setTo]         = useState(draft.to         || '');
  const [from,       setFrom]       = useState(draft.from       || '');
  const [category,   setCategory]   = useState(draft.category   || 'curhat');
  const [body,       setBody]       = useState(draft.body       || '');
  const [design,     setDesign]     = useState(draft.design     || 'pink');
  const [textSize,   setTextSize]   = useState(draft.text_size  || 'auto');
  const [textColor,  setTextColor]  = useState(draft.text_color || 'dark');
  const [song,       setSong]       = useState(draft.song       || null);
  const [loading,    setLoading]    = useState(false);
  const [confirm,    setConfirm]    = useState(false);
  const [error,      setError]      = useState('');
  const canvasRef = useRef(null);
  const drawTimer = useRef(null);

  const bodyOver  = body.length > MAX_BODY;
  const doxxWarn  = detectDoxxing(body) || detectDoxxing(to) || detectDoxxing(from);

  // Auto-save draft
  useEffect(() => {
    saveDraft({ to, from, category, body, design, text_size: textSize, text_color: textColor, song });
  }, [to, from, category, body, design, textSize, textColor, song]);

  // Preview canvas WYSIWYG — debounce 100ms, kunci colorScheme=light
  const redraw = useCallback(() => {
    clearTimeout(drawTimer.current);
    drawTimer.current = setTimeout(async () => {
      if (!canvasRef.current || document.hidden) return;
      await document.fonts.load('800 48px Nunito');
      await drawCard(canvasRef.current, {
        body:             body || '(preview)',
        to_label:         to,
        from_alias:       from,
        category,
        design,
        text_size:        textSize,
        text_color:       textColor,
        song_title:       song?.song_title || '',
        song_artist:      song?.song_artist || '',
        song_artwork_url: song?.song_artwork_url || '',
      }, 0.25); // 300×375
    }, 100);
  }, [body, to, from, category, design, textSize, textColor, song]);

  useEffect(() => { redraw(); }, [redraw]);

  async function handleDownload() {
    try {
      await document.fonts.load('800 48px Nunito');
      const blob = await renderCardBlob({
        body, to_label: to, from_alias: from, category, design,
        text_size: textSize, text_color: textColor,
        song_title: song?.song_title, song_artist: song?.song_artist,
        song_artwork_url: song?.song_artwork_url,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = cardFilename('preview', design); a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) { setError('Gagal unduh: ' + e.message); }
  }

  async function handleSend() {
    setError('');
    setLoading(true);
    try {
      await submitPost({
        to_label:         to.trim()   || null,
        from_alias:       from.trim() || null,
        category,
        body:             body.trim(),
        design,
        text_size:        textSize,
        text_color:       textColor,
        song_title:       song?.song_title  || null,
        song_artist:      song?.song_artist || null,
        song_artwork_url: song?.song_artwork_url || null,
        song_preview_url: song?.song_preview_url || null,
        song_url:         song?.song_url || null,
        song_source:      song?.song_source || null,
        rules_version:    RULES_VERSION,
      });
      clearDraft();
      setConfirm(false);
      onSent?.();
    } catch (e) {
      const msg = e?.message || '';
      if (msg.includes('accepting'))    setError('Pengiriman menfess sedang ditutup sementara.');
      else if (msg.includes('daily'))   setError(`Kamu sudah mencapai batas ${settings?.daily_limit || 5} menfess hari ini.`);
      else if (msg.includes('cooldown'))setError(`Tunggu ${settings?.cooldown_seconds || 30} detik sebelum kirim lagi.`);
      else if (msg.includes('body'))    setError('Isi menfess tidak boleh kosong atau > 400 karakter.');
      else setError('Gagal mengirim. Coba lagi.');
    } finally { setLoading(false); }
  }

  if (settings && !settings.accepting) {
    return (
      <div className="mf-card" style={{ textAlign:'center',padding:32 }}>
        <p style={{ fontSize:'1.5rem' }}>📪</p>
        <p><strong>Pengiriman menfess sedang ditutup.</strong></p>
        {settings.closed_message && <p style={{ opacity:.7 }}>{settings.closed_message}</p>}
      </div>
    );
  }

  return (
    <RulesGate>
      <div className="mf-allow" style={{ display:'flex',flexDirection:'column',gap:20 }}>
        {/* Honeypot */}
        <input type="text" name="website" style={{ display:'none' }} tabIndex={-1} aria-hidden="true" />

        {/* Preview canvas — dikunci colorScheme=light agar tidak terpengaruh dark mode HP */}
        <div style={{ position:'relative' }}>
          <canvas
            ref={canvasRef}
            style={{ width:'100%',aspectRatio:'4/5',display:'block',borderRadius:'var(--mf-radius)',
              border:'2px solid var(--mf-ink)',boxShadow:'var(--mf-shadow)',colorScheme:'light' }}
            aria-label="Preview kartu menfess"
          />
        </div>

        {/* Kontrol desain */}
        <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
          {['pink','green'].map(d => (
            <button key={d} type="button"
              className={`mf-btn ${design === d ? 'mf-btn-primary' : 'mf-btn-secondary'}`}
              style={{ flex:1 }} onClick={() => setDesign(d)}>
              {d === 'pink' ? '🌸 Pink' : '🌿 Hijau'}
            </button>
          ))}
        </div>

        {/* Ukuran teks */}
        <div>
          <span className="mf-label">Ukuran Teks</span>
          <div style={{ display:'flex',gap:6 }}>
            {[['auto','Auto'],['xs','XS'],['sm','S'],['md','M'],['lg','L']].map(([v,l]) => (
              <button key={v} type="button"
                className={`mf-btn ${textSize === v ? 'mf-btn-primary' : 'mf-btn-secondary'}`}
                style={{ flex:1,padding:'8px 4px',fontSize:'.8rem' }}
                onClick={() => setTextSize(v)}>{l}</button>
            ))}
          </div>
        </div>

        {/* Warna teks */}
        <div>
          <span className="mf-label">Warna Teks</span>
          <div style={{ display:'flex',gap:8 }}>
            <button type="button"
              className={`mf-btn ${textColor === 'dark' ? 'mf-btn-primary' : 'mf-btn-secondary'}`}
              style={{ flex:1 }} onClick={() => setTextColor('dark')}>⬛ Gelap</button>
            <button type="button"
              className={`mf-btn ${textColor === 'white' ? 'mf-btn-primary' : 'mf-btn-secondary'}`}
              style={{ flex:1 }} onClick={() => setTextColor('white')}>
              ⬜ Terang
              <span style={{ fontSize:'.72rem',opacity:.7,display:'block',lineHeight:1 }}>kontras rendah di panel abu</span>
            </button>
          </div>
        </div>

        {/* Untuk */}
        <div>
          <label className="mf-label" htmlFor="mf-to">Untuk (inisial, opsional)</label>
          <input id="mf-to" className="mf-input" type="text" maxLength={MAX_LABEL}
            value={to} onChange={e => setTo(e.target.value)} placeholder="mis. A.R." />
        </div>

        {/* Dari */}
        <div>
          <label className="mf-label" htmlFor="mf-from">Dari (alias, opsional)</label>
          <input id="mf-from" className="mf-input" type="text" maxLength={MAX_LABEL}
            value={from} onChange={e => setFrom(e.target.value)} placeholder="Biarkan kosong = 'Anonim'" />
        </div>

        {/* Kategori */}
        <div>
          <span className="mf-label">Kategori</span>
          <div className="mf-chips" role="group" aria-label="Pilih kategori">
            {CATEGORIES.map(c => (
              <button key={c.value} type="button"
                className={`mf-chip ${category === c.value ? 'selected' : ''}`}
                onClick={() => setCategory(c.value)} aria-pressed={category === c.value}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lagu — terbuka otomatis untuk songfess/request */}
        <details open={SONG_CATEGORIES.has(category)} style={{ border:'2px solid var(--mf-ink)',borderRadius:'var(--mf-radius-sm)',padding:12 }}>
          <summary style={{ fontWeight:700,cursor:'pointer',listStyle:'none',display:'flex',alignItems:'center',gap:6 }}>
            ♪ Tambahkan lagu (opsional)
            {song && <span style={{ background:'var(--mf-primary)',borderRadius:'var(--mf-radius-pill)',padding:'2px 8px',fontSize:'.75rem' }}>Terpilih</span>}
          </summary>
          <div style={{ marginTop:12 }}>
            <SongSearch value={song} onChange={setSong} />
          </div>
        </details>

        {/* Isi */}
        <div>
          <label className="mf-label" htmlFor="mf-body">
            Isi menfess <span style={{ color:'var(--mf-brick)' }}>*</span>
          </label>
          <textarea id="mf-body" className="mf-textarea" value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Tulis menfessmu di sini…" rows={5} />
          <p className={`mf-counter ${bodyOver ? 'over' : body.length > 350 ? 'over' : ''}`} aria-live="polite">
            {body.length}/{MAX_BODY}
          </p>
        </div>

        {/* Peringatan doxxing */}
        {doxxWarn && (
          <div className="mf-warn-banner" role="alert">
            ⚠️ Terdeteksi data pribadi (nomor HP/email/@username). Pastikan sudah ada izin.
          </div>
        )}

        {/* Error */}
        {error && <p style={{ color:'var(--mf-brick)',fontWeight:700 }} role="alert">{error}</p>}

        {/* Tombol unduh + kirim */}
        <div style={{ display:'grid',gridTemplateColumns:'1fr 2fr',gap:10 }}>
          <button type="button" className="mf-btn mf-btn-secondary"
            onClick={handleDownload} disabled={!body.trim()}>
            📥 Unduh PNG
          </button>

          {!confirm ? (
            <button type="button" className="mf-btn mf-btn-primary"
              onClick={() => setConfirm(true)}
              disabled={!body.trim() || bodyOver || loading}>
              Kirim Menfess 📢
            </button>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:8,gridColumn:'1/-1' }}>
              <div className="mf-card" style={{ background:'var(--mf-soft)',padding:12 }}>
                <p style={{ marginBottom:10,fontSize:'.9rem' }}>
                  <strong>Yakin kirim?</strong> Menfess tidak bisa diedit setelah dikirim.
                </p>
                <div style={{ display:'flex',gap:8 }}>
                  <button type="button" className="mf-btn mf-btn-primary"
                    onClick={handleSend} disabled={loading} style={{ flex:1 }}>
                    {loading ? 'Mengirim…' : 'Ya, kirim!'}
                  </button>
                  <button type="button" className="mf-btn mf-btn-secondary"
                    onClick={() => setConfirm(false)} style={{ flex:1 }}>
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RulesGate>
  );
}
