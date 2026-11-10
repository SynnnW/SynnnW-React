// Composer — tulis dulu, preview sticky (desktop) / sheet (HP), action bar tetap terjangkau.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CATEGORIES, SONG_CATEGORIES, RULES_VERSION } from '@/lib/menfess/rules';
import { submitPost } from '@/lib/menfess/api';
import { drawCard, renderCardBlob, cardFilename } from '@/lib/menfess/renderCard';
import { TEMPLATE_PATH } from '@/lib/menfess/templateConfig';
import { saveDraft, loadDraft, clearDraft, detectDoxxing } from './utils';
import SongSearch from './SongSearch';
import RulesGate from './RulesGate';
import { Sheet, ConfirmDialog } from './ui/Sheet';
import { Button, Callout, Chip, ChipGroup, EmptyState, Field, Icon, Segmented } from './ui';
import CardThumb from './ui/CardThumb';
import SongPill from './ui/SongPill';
import { TRAKTEER } from './ui/Shell';
import { useMfToast } from './ui/Toast';

const MAX_BODY = 400;
const MAX_LABEL = 30;
const SIZES = [['auto', 'Auto'], ['xs', 'XS'], ['sm', 'S'], ['md', 'M'], ['lg', 'L']].map(([value, label]) => ({ value, label }));
const COLORS = [{ value: 'dark', label: 'Gelap' }, { value: 'white', label: 'Terang' }];

/** Canvas preview WYSIWYG (drawCard yang sama dengan PNG). */
export function PreviewCanvas({ opts, scale = 0.3, className = 'mf-preview-canvas', label = 'Preview kartu menfess' }) {
  const ref = useRef(null);
  const key = JSON.stringify(opts);
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!ref.current || document.hidden) return;
      try { await document.fonts.load('800 48px Nunito'); await drawCard(ref.current, opts, scale); } catch { /* preview gagal: biarkan kosong */ }
    }, 100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, scale]);
  return <canvas ref={ref} className={className} role="img" aria-label={label} />;
}

function mapError(msg = '', s) {
  if (msg.includes('ditutup') || msg.includes('accepting')) return 'Pengiriman menfess sedang ditutup sementara.';
  if (msg.includes('harian') || msg.includes('daily')) return `Kamu sudah mencapai batas ${s?.daily_limit || 5} menfess dalam 24 jam.`;
  if (msg.includes('Tunggu') || msg.includes('cooldown')) return `Tunggu ${s?.cooldown_seconds || 30} detik sebelum kirim lagi.`;
  if (msg.includes('body') || msg.includes('kosong')) return 'Isi menfess tidak boleh kosong atau lebih dari 400 karakter.';
  return 'Gagal mengirim. Cek koneksi lalu coba lagi.';
}

export default function Composer({ settings, onSent, goHistory }) {
  const loc = useLocation();
  const toast = useMfToast();
  const [d] = useState(() => loadDraft() || {});
  const [body, setBody] = useState(d.body || '');
  const [category, setCategory] = useState(d.category || 'curhat');
  const [to, setTo] = useState(d.to || '');
  const [from, setFrom] = useState(d.from || '');
  const [song, setSong] = useState(d.song && typeof d.song === 'object' ? d.song : null);
  const [design, setDesign] = useState(d.design || 'pink');
  const [textSize, setTextSize] = useState(d.text_size || 'auto');
  const [textColor, setTextColor] = useState(d.text_color || 'dark');
  const [confirm, setConfirm] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(null);
  const [saved, setSaved] = useState(false);

  const len = body.length;
  const over = len > MAX_BODY;
  const empty = !body.trim();
  const doxx = detectDoxxing(body) || detectDoxxing(to) || detectDoxxing(from);
  const counterCls = over ? 'over' : len >= 350 ? 'near' : '';

  const cardOpts = {
    body: body || 'Isi menfessmu akan tampil di sini…', design, text_size: textSize, text_color: textColor, category,
    song_title: song?.song_title || '', song_artist: song?.song_artist || '', song_artwork_url: song?.song_artwork_url || '',
  };

  useEffect(() => {
    saveDraft({ to, from, category, body, design, text_size: textSize, text_color: textColor, song });
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(t);
  }, [to, from, category, body, design, textSize, textColor, song]);

  const download = useCallback(async () => {
    try {
      const blob = await renderCardBlob({ ...cardOpts, body });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = cardFilename('draft', design); a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch { toast.show('Gagal membuat PNG. Coba lagi.', 'error'); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body, design, textSize, textColor, song]);

  async function send() {
    setError(''); setLoading(true);
    try {
      const res = await submitPost({
        to_label: to.trim() || null, from_alias: from.trim() || null, category, body: body.trim(), design,
        text_size: textSize, text_color: textColor,
        song_title: song?.song_title || null, song_artist: song?.song_artist || null, song_artwork_url: song?.song_artwork_url || null,
        song_preview_url: song?.song_preview_url || null, song_url: song?.song_url || null, song_source: song?.song_source || null,
        rules_version: RULES_VERSION,
      });
      const post = { id: res?.id, created_at: res?.created_at, status: 'pending', body: body.trim(), design, text_size: textSize, text_color: textColor,
        category, to_label: to.trim() || null, from_alias: from.trim() || null, ...(song || {}) };
      clearDraft();
      setConfirm(false);
      setSent(post);
      onSent?.(post);
    } catch (e) { setError(mapError(e?.message || '', settings)); setConfirm(false); }
    finally { setLoading(false); }
  }

  function again() {
    setSent(null); setBody(''); setTo(''); setFrom(''); setSong(null); setError('');
  }

  if (settings && settings.accepting === false) {
    return (
      <EmptyState icon="inbox" title="Pengiriman sedang ditutup"
        action={<Button variant="secondary" icon="history" onClick={goHistory}>Lihat riwayatku</Button>}>
        {settings.closed_message || 'Admin menutup pengiriman untuk sementara. Coba lagi nanti ya.'}
      </EmptyState>
    );
  }

  if (sent) {
    return (
      <div className="mf-success mf-narrow">
        <div className="mf-state-ic" style={{ background: 'var(--mf-primary)' }}><Icon name="check" size={28} /></div>
        <h2>Menfess terkirim!</h2>
        <p className="mf-muted">Menunggu review admin. Tidak ada jaminan waktu tayang, pantau statusnya di Riwayat.</p>
        <CardThumb post={sent} scale={0.3} eager className="static" />
        <div className="mf-stack" style={{ width: '100%' }}>
          <Button block icon="history" onClick={goHistory}>Lihat di Riwayat</Button>
          <div className="mf-row-wrap" style={{ justifyContent: 'center' }}>
            <Button variant="secondary" icon="plus" onClick={again}>Kirim lagi</Button>
            <Button variant="secondary" icon="download" onClick={async () => {
              const blob = await renderCardBlob(sent); const u = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = u; a.download = cardFilename(sent.id, sent.design); a.click(); setTimeout(() => URL.revokeObjectURL(u), 5000);
            }}>Unduh PNG</Button>
          </div>
          <a className="mf-small mf-muted" href={TRAKTEER} target="_blank" rel="noopener noreferrer"><Icon name="cup" size={16} /> Traktir cendol buat admin</a>
        </div>
      </div>
    );
  }

  const reason = empty ? 'Tulis isi menfess dulu' : over ? 'Isi melebihi 400 karakter' : '';

  return (
    <RulesGate>
      <div className="mf-compose mf-allow">
        <div className="mf-stack-lg">
          <Field label="Isi menfess" htmlFor="mf-body"
            counter={<span className={`mf-counter ${counterCls}`} aria-live="polite">{len}/{MAX_BODY}</span>}
            hint={saved ? undefined : 'Draft tersimpan otomatis.'}>
            {(id) => <textarea id={id} className="mf-textarea" value={body} onChange={e => setBody(e.target.value)} placeholder="Tulis menfessmu di sini…" autoFocus={typeof window !== 'undefined' && window.innerWidth >= 900} />}
          </Field>
          {saved && <span className="mf-saved" role="status" style={{ marginTop: -16 }}>Draft tersimpan ✓</span>}
          {doxx && (
            <Callout kind="warn" icon="alert">
              Terdeteksi nomor HP/email/@username. Pastikan sudah ada izin. <Link to="/26menfess/aturan" state={{ from: loc.pathname + loc.search }}><b>Lihat aturan No Doxxing</b></Link>
            </Callout>
          )}

          <div className="mf-field">
            <span className="mf-label" id="lbl-cat">Kategori</span>
            <ChipGroup scroll label="Kategori">
              {CATEGORIES.map(c => <Chip key={c.value} selected={category === c.value} onClick={() => setCategory(c.value)}>{c.label}</Chip>)}
            </ChipGroup>
          </div>

          <div className="mf-row" style={{ alignItems: 'flex-start' }}>
            <div className="mf-grow"><Field label="Untuk" htmlFor="mf-to" hint="Inisial penerima (opsional)">
              {(id) => <input id={id} className="mf-input" maxLength={MAX_LABEL} value={to} onChange={e => setTo(e.target.value)} placeholder="mis. A.R." autoComplete="off" />}
            </Field></div>
            <div className="mf-grow"><Field label="Dari" htmlFor="mf-from" hint="Kosong = Anonim">
              {(id) => <input id={id} className="mf-input" maxLength={MAX_LABEL} value={from} onChange={e => setFrom(e.target.value)} placeholder="Anonim" autoComplete="off" />}
            </Field></div>
          </div>

          <details className="mf-card" open={SONG_CATEGORIES.has(category) || !!song}>
            <summary className="mf-row"><Icon name="music" /><b className="mf-grow">Tambahkan lagu</b>{song && <span className="mf-badge">Terpilih</span>}</summary>
            <div style={{ marginTop: 12 }}><SongSearch value={song} onChange={setSong} /></div>
          </details>

          <div className="mf-stack">
            <h3>Gaya kartu</h3>
            <div className="mf-designs" role="radiogroup" aria-label="Desain kartu">
              {['pink', 'green'].map(k => (
                <button key={k} type="button" role="radio" aria-checked={design === k} className="mf-design" onClick={() => setDesign(k)}>
                  <img src={TEMPLATE_PATH[k]} alt="" loading="lazy" width="120" height="150" /><span>{k === 'pink' ? 'Pink' : 'Hijau'}</span>
                </button>
              ))}
            </div>
            <div className="mf-field"><span className="mf-label">Ukuran teks</span><Segmented label="Ukuran teks" value={textSize} onChange={setTextSize} options={SIZES} /></div>
            <div className="mf-field"><span className="mf-label">Warna teks</span><Segmented label="Warna teks" value={textColor} onChange={setTextColor} options={COLORS} />
              {textColor === 'white' && <Callout kind="warn" icon="alert">Teks terang kontrasnya rendah di panel kaca template ini. Cek preview sebelum kirim.</Callout>}
            </div>
          </div>
          {song && <SongPill song={song} />}
          {error && <Callout kind="bad" icon="alert">{error}</Callout>}
        </div>

        <aside className="mf-compose-preview mf-stack mf-hide-sm" aria-label="Preview">
          <PreviewCanvas opts={cardOpts} scale={0.3} />
          <Button variant="secondary" icon="download" block onClick={download} disabled={empty}>Unduh PNG</Button>
        </aside>
      </div>

      <div className="mf-actionspacer" aria-hidden="true" />
      <div className="mf-actionbar">
        <button type="button" className="mf-mini" onClick={() => setPreviewOpen(true)} aria-label="Lihat preview kartu"><PreviewCanvas opts={cardOpts} scale={0.1} className="" label="Mini preview" /></button>
        <div className="mf-grow">
          <div className={`mf-counter ${counterCls}`}>{len}/{MAX_BODY}</div>
          {reason && <div className="mf-xs mf-muted">{reason}</div>}
        </div>
        <Button variant="secondary" className="mf-iconbtn" aria-label="Unduh PNG" onClick={download} disabled={empty} style={{ padding: 0 }}><Icon name="download" /></Button>
        <Button icon="send" disabled={!!reason} loading={loading} onClick={() => setConfirm(true)}>Kirim Menfess</Button>
      </div>

      <Sheet open={previewOpen} onClose={() => setPreviewOpen(false)} title="Preview kartu"
        footer={<Button variant="secondary" icon="download" onClick={download} disabled={empty}>Unduh PNG</Button>}>
        <PreviewCanvas opts={cardOpts} scale={0.4} />
      </Sheet>

      <ConfirmDialog open={confirm} title="Kirim menfess ini?" confirmLabel="Ya, kirim" cancelLabel="Cek lagi" loading={loading} onConfirm={send} onCancel={() => setConfirm(false)}>
        <div className="mf-narrow" style={{ width: 'min(100%,220px)' }}><CardThumb post={{ ...cardOpts, id: 'draft', body }} scale={0.25} eager className="static" /></div>
        <p className="mf-small"><b>{CATEGORIES.find(c => c.value === category)?.label}</b>{to && <> · untuk {to}</>}{from && <> · dari {from}</>}{song && <> · ♪ {song.song_title}</>}</p>
        <ul className="mf-small mf-muted" style={{ margin: 0, paddingLeft: 18 }}>
          <li>Tidak bisa diedit setelah dikirim.</li><li>Dicek admin sebelum tayang.</li><li>Tidak ada jaminan waktu tayang.</li>
        </ul>
      </ConfirmDialog>
    </RulesGate>
  );
}
