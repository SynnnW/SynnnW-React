import { lazy, Suspense, useEffect, useState } from 'react';
import { isMascotRouteHidden, readMascotHidden, MASCOT_EVENT } from '../lib/leoMascot';

const LeoMascot = lazy(() => import('./LeoMascot'));

/* Loads the mascot chunk only after idle, on wide screens, off hidden routes and when not dismissed. */
export default function MascotMount({ pathname, lang }) {
  const [idle, setIdle] = useState(false);
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 700px)').matches);
  const [dismissed, setDismissed] = useState(readMascotHidden);
  useEffect(() => {
    const go = () => setIdle(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(go, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(go, 1500);
    return () => clearTimeout(id);
  }, []);
  useEffect(() => {
    const m = window.matchMedia('(min-width: 700px)');
    const onMq = () => setWide(m.matches);
    const onPref = () => setDismissed(readMascotHidden());
    m.addEventListener('change', onMq);
    window.addEventListener(MASCOT_EVENT, onPref);
    return () => { m.removeEventListener('change', onMq); window.removeEventListener(MASCOT_EVENT, onPref); };
  }, []);
  if (!idle || !wide || dismissed || isMascotRouteHidden(pathname)) return null;
  return <Suspense fallback={null}><LeoMascot lang={lang} /></Suspense>;
}
