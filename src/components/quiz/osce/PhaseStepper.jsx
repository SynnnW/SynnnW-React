// src/components/quiz/osce/PhaseStepper.jsx
export default function PhaseStepper({ phases, activeIdx, onPick, completedSet }) {
  return (
    <div className="osce-stepper-wrap">
      <ol className="osce-stepper" role="list">
        {phases.map((p, i) => {
          const done = completedSet?.has(i);
          const active = i === activeIdx;
          return (
            <li key={p.key} className="osce-stepper-item">
              <button
                type="button"
                className={`osce-stepper-chip${active ? ' is-active' : ''}${done ? ' is-done' : ''}`}
                aria-current={active ? 'step' : undefined}
                onClick={() => onPick(i)}
              >
                {done && !active ? <i className="fa-solid fa-check" aria-hidden="true" /> : i + 1}
              </button>
              <span className="osce-stepper-label">{p.title}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
