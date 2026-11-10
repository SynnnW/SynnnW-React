// Kontrol gaya kartu bersama: tema, font, warna, rata paragraf, spasi, ukuran.
// Dipakai Composer (client), Studio dan Edit Kartu (admin).
import { useEffect } from 'react';
import { DESIGNS, DESIGN_BG, TEMPLATE_PATH, TEMPLATE_THUMB, TEXT_COLORS, ALIGNS, LINE_SPACES } from '@/lib/menfess/templateConfig';
import { FONTS, ensureAllFonts } from '@/lib/menfess/fonts';
import { Callout, Segmented } from './ui';

const SIZES = [['auto', 'Auto'], ['xs', 'XS'], ['sm', 'S'], ['md', 'M'], ['lg', 'L']].map(([value, label]) => ({ value, label }));
const GLASS = ['pink', 'green', 'picnic'];

export const STYLE_DEFAULTS = { design: 'pink', font: 'nunito', text_color: 'auto', align: 'right', line_space: 'normal', text_size: 'auto' };

/** @param {{value:object, onChange:(key:string,val:string)=>void}} p */
export default function StyleControls({ value, onChange }) {
  useEffect(() => { ensureAllFonts(); }, []); // supaya nama font tampil dengan fontnya sendiri
  const v = { ...STYLE_DEFAULTS, ...value };
  return (
    <div className="mf-stack">
      <div className="mf-stack">
        <span className="mf-label">Tema kartu</span>
        <div className="mf-designs" role="radiogroup" aria-label="Desain kartu">
          {DESIGNS.map(({ id, label }) => (
            <button key={id} type="button" role="radio" aria-checked={v.design === id} className="mf-design" onClick={() => onChange('design', id)}>
              <img src={TEMPLATE_THUMB[id] || TEMPLATE_PATH[id]} alt="" loading="lazy" width="120" height="150" style={{ background: DESIGN_BG[id] || undefined }} /><span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mf-field"><span className="mf-label">Font</span>
        <div className="mf-fontgrid" role="radiogroup" aria-label="Font kartu">
          {FONTS.map(f => (
            <button key={f.id} type="button" role="radio" aria-checked={v.font === f.id} className="mf-fontopt" onClick={() => onChange('font', f.id)}
              style={{ fontFamily: `${f.family}, sans-serif`, fontWeight: f.weight }}>{f.label}</button>
          ))}
        </div>
        <span className="mf-hint">Tips: teks di dalam tanda petik "seperti ini" otomatis jadi miring bergaya tulisan tangan.</span>
      </div>

      <div className="mf-field"><span className="mf-label">Warna teks</span>
        <div className="mf-colorrow" role="radiogroup" aria-label="Warna teks">
          {TEXT_COLORS.map(c => (
            <button key={c.value} type="button" role="radio" aria-checked={v.text_color === c.value} className="mf-coloropt" onClick={() => onChange('text_color', c.value)}>
              <i style={{ background: c.swatch }} aria-hidden="true" />{c.label}
            </button>
          ))}
        </div>
        {v.text_color === 'white' && GLASS.includes(v.design) && <Callout kind="warn" icon="alert">Teks putih kontrasnya rendah di panel kaca tema ini. Cek preview sebelum kirim.</Callout>}
        {v.text_color === 'white' && ['white', 'cream'].includes(v.design) && <Callout kind="warn" icon="alert">Teks putih di latar terang hampir tidak terbaca.</Callout>}
        {v.text_color === 'dark' && v.design === 'black' && <Callout kind="warn" icon="alert">Teks hitam di latar hitam tidak akan terbaca.</Callout>}
      </div>

      <div className="mf-field"><span className="mf-label">Rata paragraf</span><Segmented label="Rata paragraf" value={v.align} onChange={x => onChange('align', x)} options={ALIGNS} /></div>
      <div className="mf-field"><span className="mf-label">Spasi antar baris</span><Segmented label="Spasi baris" value={v.line_space} onChange={x => onChange('line_space', x)} options={LINE_SPACES.map(({ value: val, label }) => ({ value: val, label }))} /></div>
      <div className="mf-field"><span className="mf-label">Ukuran teks</span><Segmented label="Ukuran teks" value={v.text_size} onChange={x => onChange('text_size', x)} options={SIZES} /></div>
    </div>
  );
}
