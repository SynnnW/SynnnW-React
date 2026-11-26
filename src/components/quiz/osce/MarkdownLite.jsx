// src/components/quiz/osce/MarkdownLite.jsx
// Renderer markdown sangat ringan: paragraf, **tebal**, *miring*, `kode inline`,
// daftar (- / *), dan tabel sederhana (| a | b |). Tidak pernah memakai
// dangerouslySetInnerHTML — semua teks jadi children React biasa (auto-escaped).

function renderInline(text, keyPrefix) {
  const tokens = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) tokens.push(text.slice(last, m.index));
    const chunk = m[0];
    if (chunk.startsWith('**')) {
      tokens.push(<strong key={`${keyPrefix}-b${i}`}>{chunk.slice(2, -2)}</strong>);
    } else if (chunk.startsWith('*')) {
      tokens.push(<em key={`${keyPrefix}-i${i}`}>{chunk.slice(1, -1)}</em>);
    } else {
      tokens.push(<code key={`${keyPrefix}-c${i}`}>{chunk.slice(1, -1)}</code>);
    }
    i += 1;
    last = m.index + chunk.length;
  }
  if (last < text.length) tokens.push(text.slice(last));
  return tokens;
}

function isTableBlock(lines) {
  return lines.length >= 2 && lines[0].includes('|') && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[1]);
}

function renderTable(lines, key) {
  const parseRow = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  const header = parseRow(lines[0]);
  const rows = lines.slice(2).map(parseRow);
  return (
    <div className="osce-md-table-wrap" key={key}>
      <table className="osce-md-table">
        <thead>
          <tr>{header.map((h, i) => <th key={i}>{renderInline(h, `${key}-h${i}`)}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>{row.map((c, ci) => <td key={ci}>{renderInline(c, `${key}-${ri}-${ci}`)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderBlock(block, key) {
  const lines = block.split('\n');
  const isList = lines.every((l) => /^\s*[-*]\s+/.test(l.trim()) || l.trim() === '');
  if (isList && lines.some((l) => l.trim())) {
    const items = lines.filter((l) => l.trim()).map((l) => l.trim().replace(/^[-*]\s+/, ''));
    return (
      <ul key={key} className="osce-md-list">
        {items.map((it, i) => <li key={i}>{renderInline(it, `${key}-li${i}`)}</li>)}
      </ul>
    );
  }
  if (isTableBlock(lines)) return renderTable(lines, key);
  return <p key={key}>{renderInline(lines.join(' '), key)}</p>;
}

export default function MarkdownLite({ text, className = '' }) {
  if (!text) return null;
  const blocks = String(text).split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={`osce-md ${className}`.trim()}>
      {blocks.map((b, i) => renderBlock(b, `b${i}`))}
    </div>
  );
}
