// Indikator pull-to-refresh (logikanya di usePullToRefresh.js).
import { THRESHOLD } from './usePullToRefresh';

const LABEL = { pulling: 'Tarik untuk menyegarkan', ready: 'Lepaskan untuk menyegarkan', loading: 'Menyegarkan…', done: 'Diperbarui' };

export function PullIndicator({ pull, phase }) {
  if (phase === 'idle' && pull === 0) return null;
  return (
    <div className={`mk-ptr ${phase}`} style={{ transform: `translate(-50%, ${pull - 56}px)`, opacity: Math.min(1, pull / THRESHOLD) }} role="status" aria-live="polite">
      {phase === 'loading' ? <span className="mk-spin on" aria-hidden="true" />
        : phase === 'done' ? <i className="fa-solid fa-check" aria-hidden="true" />
        : <i className={`fa-solid fa-arrow-down mk-ptr-arrow${phase === 'ready' ? ' flip' : ''}`} aria-hidden="true" />}
      <span>{LABEL[phase]}</span>
    </div>
  );
}
