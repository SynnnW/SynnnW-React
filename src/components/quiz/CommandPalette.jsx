// src/components/quiz/CommandPalette.jsx
// Command palette Quiziz (Ctrl/⌘+K, "/", atau tombol cari): satu kotak untuk matkul, bab, aktivitas, halaman, dan "Tanya Leo".
// Pola ARIA combobox + listbox (fokus tetap di input, opsi dipilih lewat aria-activedescendant), fokus terkunci di dialog,
// Escape menutup, fokus dikembalikan ke pemicu, scroll halaman dikunci. Hanya metadata yang diindeks (data/quiziz/search.js).
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { search } from '../../data/quiziz/search';
import { PATHS } from '../../data/quiziz/routes';
import '../../styles/quizPalette.css';

export default function CommandPalette({ onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const closeRef = useRef(null);
  const opener = useRef(typeof document !== 'undefined' ? document.activeElement : null);

  const trimmed = query.trim();
  const groups = useMemo(() => search(query), [query]);
  const found = groups.reduce((n, g) => n + g.items.length, 0);
  const flat = useMemo(() => {
    const items = groups.flatMap((g) => g.items);
    return trimmed ? [...items, { id: 'leo', leo: true, title: `Tanya Leo: ${trimmed}`, where: 'Kirim ke chat Leo di beranda' }] : items;
  }, [groups, trimmed]);
  const current = Math.min(active, Math.max(flat.length - 1, 0));

  useEffect(() => {
    inputRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    const back = opener.current;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
      back?.focus?.();
    };
  }, []);

  useEffect(() => {
    document.getElementById(`qz-pal-opt-${current}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [current, query]);

  const choose = (i) => {
    const it = flat[i];
    if (!it) return;
    onClose();
    if (it.leo) navigate(PATHS.beranda, { state: { ask: trimmed } });
    else navigate(it.to);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
    if (e.key === 'Tab') {
      // Hanya dua kontrol yang bisa difokus (kotak cari dan tombol tutup): fokus berputar di antara keduanya.
      const ring = [inputRef.current, closeRef.current];
      const at = ring.indexOf(document.activeElement);
      const next = e.shiftKey ? (at <= 0 ? ring.length - 1 : at - 1) : (at + 1) % ring.length;
      e.preventDefault();
      ring[next]?.focus();
      return;
    }
    if (e.target !== inputRef.current || e.nativeEvent?.isComposing || !flat.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((current + 1) % flat.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((current - 1 + flat.length) % flat.length); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(flat.length - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(current); }
  };

  const option = (it) => {
    const i = flat.indexOf(it);
    return (
      <div
        key={it.id}
        id={`qz-pal-opt-${i}`}
        role="option"
        aria-selected={i === current}
        className="qz-pal-opt"
        data-leo={it.leo ? 'true' : undefined}
        onMouseDown={(e) => e.preventDefault()}
        onMouseMove={() => setActive(i)}
        onClick={() => choose(i)}
      >
        <span className="qz-pal-opt-title">{it.title}</span>
        <span className="qz-pal-opt-where">{it.where}</span>
      </div>
    );
  };

  return (
    <div className="qz-pal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="qz-pal" role="dialog" aria-modal="true" aria-label="Cari di Quiziz" onKeyDown={onKeyDown}>
        <div className="qz-pal-bar">
          <i className="fa-solid fa-magnifying-glass qz-pal-mag" aria-hidden="true" />
          <input
            ref={inputRef}
            className="qz-pal-input"
            type="text"
            role="combobox"
            aria-label="Cari matkul, bab, atau tanya Leo"
            aria-expanded="true"
            aria-controls="qz-pal-list"
            aria-autocomplete="list"
            aria-activedescendant={flat.length ? `qz-pal-opt-${current}` : undefined}
            autoComplete="off"
            spellCheck={false}
            placeholder="Cari matkul, bab, atau tanya Leo…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
          />
          <button ref={closeRef} type="button" className="qz-pal-close" onClick={onClose} aria-label="Tutup pencarian">Esc</button>
        </div>

        <div id="qz-pal-list" className="qz-pal-list" role="listbox" aria-label="Hasil pencarian">
          {groups.map((g) => (
            <div key={g.id} role="group" aria-labelledby={`qz-pal-g-${g.id}`}>
              <div id={`qz-pal-g-${g.id}`} className="qz-pal-group">{g.label}</div>
              {g.items.map(option)}
            </div>
          ))}
          {trimmed && found === 0 && <p className="qz-pal-empty" role="presentation">Tidak ada matkul, bab, atau halaman yang cocok.</p>}
          {trimmed && (
            <div role="group" aria-label="Leo">
              {option(flat[flat.length - 1])}
            </div>
          )}
        </div>

        <p className="qz-pal-hint" aria-hidden="true">↑ ↓ pilih · Enter buka · Esc tutup</p>
        <p className="qz-pal-sr" role="status">{trimmed ? (found ? `${found} hasil.` : 'Tidak ada hasil. Kamu bisa menanyakannya ke Leo.') : ''}</p>
      </div>
    </div>
  );
}
