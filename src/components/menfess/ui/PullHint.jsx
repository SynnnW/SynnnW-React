import { THRESHOLD } from '@/components/makrab/usePullToRefresh';
import Icon from './Icon';

const LABEL = { pulling: 'Tarik untuk menyegarkan', ready: 'Lepaskan untuk menyegarkan', loading: 'Menyegarkan…', done: 'Diperbarui' };

/** Indikator pull-to-refresh bergaya 26Menfess (fixed, tidak mendorong layout). */
export default function PullHint({ pull, phase }) {
  if (phase === 'idle' && pull === 0) return null;
  return (
    <div className="mf-ptr" style={{ transform: `translate(-50%, ${Math.max(0, pull - 40)}px)`, opacity: Math.min(1, pull / THRESHOLD) }} role="status" aria-live="polite">
      {phase === 'loading' ? <span className="mf-spin" aria-hidden="true" /> : <Icon name={phase === 'done' ? 'check' : 'download'} size={16} />}
      <span>{LABEL[phase]}</span>
    </div>
  );
}
