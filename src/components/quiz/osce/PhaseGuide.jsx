// src/components/quiz/osce/PhaseGuide.jsx
import MarkdownLite from './MarkdownLite';

export default function PhaseGuide({ phase, phaseNumber, phaseTotal }) {
  if (!phase) return null;
  return (
    <div className="nm-inset osce-phase-guide">
      <div className="osce-phase-guide-head">
        <b>Fase {phaseNumber} dari {phaseTotal} — {phase.title}</b>
      </div>
      <div className="osce-phase-guide-label">Yang perlu kamu lakukan</div>
      {phase.guide ? <MarkdownLite text={phase.guide} /> : <p className="osce-mode-desc">Tidak ada panduan khusus untuk fase ini.</p>}
      {phase.memorize && phase.memorize.length > 0 && (
        <div className="osce-memorize">
          <span className="osce-memorize-label"><i className="fa-solid fa-brain" aria-hidden="true" /> Hafalkan urutannya</span>
          <ol className="osce-memorize-chips" role="list">
            {phase.memorize.map((m, i) => (
              <li key={i} className="osce-memorize-chip">
                <span className="osce-memorize-num">{i + 1}</span>
                <span>{m}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
