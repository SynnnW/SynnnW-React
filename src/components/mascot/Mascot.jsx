// <Mascot> — maskot "Pico" yang dapat dipakai ulang di seluruh situs.
//   <Mascot mood="happy" size={160} />
// Mood: idle | wave | thinking | happy | sad | celebrate
// Perilaku:
//  • Tampil sebagai sprite SVG 2D dulu; scene 3D (three.js) dimuat lazy hanya bila terlihat & WebGL ada.
//  • Model dapat diganti: taruh file valid di /public/mascot/mascot.glb (lihat public/mascot/README.md).
//  • Render dijeda saat tab tersembunyi / maskot di luar viewport. DPR dibatasi 1.5.
//  • WebGL gagal / context hilang / hemat data → tetap tampil sebagai sprite 2D.
//  • prefers-reduced-motion: pose statis, tanpa loop, tanpa konfeti.
import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import MascotSprite from './MascotSprite';
import { normalizeMood } from './moods';
import { canUseWebGL } from '../../lib/mascotModel';
import './mascot.css';

const Mascot3D = lazy(() => import('./Mascot3D'));
let failedGlobal = false; // sekali gagal, jangan coba lagi pada sesi ini

class Boundary extends Component {
  state = { bad: false };
  static getDerivedStateFromError() { return { bad: true }; }
  componentDidCatch() { failedGlobal = true; this.props.onFail?.(); }
  render() { return this.state.bad ? null : this.props.children; }
}

const reducedQuery = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = () => typeof navigator !== 'undefined' && navigator.connection?.saveData === true;

export default function Mascot({
  mood = 'idle', size = 160, className = '', label = 'Pico, maskot Synnnw', decorative = false,
  trackPointer = true, force2D = false, style, onClick,
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => typeof document === 'undefined' || document.visibilityState === 'visible');
  const [want3D, setWant3D] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(failedGlobal);
  const [reduced, setReduced] = useState(reducedQuery);
  const m = normalizeMood(mood);

  useEffect(() => {
    const el = ref.current; if (!el || !('IntersectionObserver' in window)) { setInView(true); return undefined; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '120px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMq = () => setReduced(mq.matches);
    mq.addEventListener('change', onMq);
    return () => { document.removeEventListener('visibilitychange', onVis); mq.removeEventListener('change', onMq); };
  }, []);

  // Mulai memuat 3D hanya saat pertama kali terlihat (dan perangkat mampu)
  useEffect(() => {
    if (want3D || !inView || force2D || failed || saveData() || !canUseWebGL()) return undefined;
    const cb = window.requestIdleCallback ? window.requestIdleCallback(() => setWant3D(true), { timeout: 800 }) : setTimeout(() => setWant3D(true), 200);
    return () => { if (window.cancelIdleCallback && window.requestIdleCallback) window.cancelIdleCallback(cb); else clearTimeout(cb); };
  }, [inView, force2D, failed, want3D]);

  const active = inView && tabVisible;
  const use3D = want3D && !failed && !force2D;
  const px = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      ref={ref}
      className={`mascot${ready && use3D ? ' is-3d-ready' : ''} ${className}`.trim()}
      style={{ width: px, ...style }}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
      data-mood={m}
      onClick={onClick}
    >
      <MascotSprite mood={m} paused={!active} />
      {use3D && (
        <div className={`mascot-3d${ready ? ' is-ready' : ''}`} aria-hidden="true">
          <Boundary onFail={() => setFailed(true)}>
            <Suspense fallback={null}>
              <Mascot3D
                mood={m} active={active} reduced={reduced} trackPointer={trackPointer}
                onReady={() => setReady(true)}
                onFail={() => { failedGlobal = true; setFailed(true); setReady(false); }}
              />
            </Suspense>
          </Boundary>
        </div>
      )}
    </div>
  );
}
