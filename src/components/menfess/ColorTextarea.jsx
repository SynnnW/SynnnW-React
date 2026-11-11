// Kotak tulis + tombol warna untuk bagian teks yang diblok.
// Penanda [merah]…[/merah] disimpan di isi; kartu menampilkannya sebagai teks berwarna.
import { useRef } from 'react';

const TAGS = [['merah', 'Merah', '#E11D2E'], ['putih', 'Putih', '#ffffff'], ['hitam', 'Hitam', '#1a1a2e']];
const STRIP = /\[\/?(merah|putih|hitam)\]/g;

export default function ColorTextarea({ id, value, onChange, placeholder, autoFocus, onHint }) {
  const ref = useRef(null);
  function apply(tag) {
    const el = ref.current; if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd;
    if (s === e) { if (tag !== null) { onHint?.('Blok dulu teks yang mau diwarnai, lalu pilih warnanya.'); return; } onChange(value.replace(STRIP, '')); return; }
    const sel = value.slice(s, e).replace(STRIP, '');
    const mid = tag ? `[${tag}]${sel}[/${tag}]` : sel;
    onChange(value.slice(0, s) + mid + value.slice(e));
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s, s + mid.length); });
  }
  return (
    <div className="mf-stack">
      <div className="mf-colortools" role="toolbar" aria-label="Warnai bagian teks">
        <span className="mf-xs mf-muted">Warnai teks yang diblok:</span>
        {TAGS.map(([tag, label, sw]) => (
          <button key={tag} type="button" className="mf-coloropt" onMouseDown={ev => ev.preventDefault()} onClick={() => apply(tag)}>
            <i style={{ background: sw }} aria-hidden="true" />{label}
          </button>
        ))}
        <button type="button" className="mf-coloropt" onMouseDown={ev => ev.preventDefault()} onClick={() => apply(null)}>Reset</button>
      </div>
      <textarea ref={ref} id={id} className="mf-textarea" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} />
    </div>
  );
}
