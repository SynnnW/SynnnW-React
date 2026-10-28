import useNotchDemo, { STATES } from './useNotchDemo';
import './leo.css';

const LABELS = {
  idle:  ['Idle', 'Diam'],
  music: ['Music', 'Musik'],
  pomo:  ['Focus', 'Focus'],
  water: ['Water', 'Water'],
  todo:  ['To-do', 'To-do'],
  shelf: ['Shelf', 'Shelf'],
};
const BAR_MS = [900, 1150, 1000, 1300, 1050];

export default function LeoNotch({ lang = 'id' }) {
  const { rootRef, state, active, select, onEnter, onLeave } = useNotchDemo();
  const en = lang === 'en';
  const L = (k) => LABELS[k][en ? 0 : 1];

  return (
    <div className="leo-demo" ref={rootRef} data-active={active ? '1' : '0'} role="group" aria-label="Demo notch Leo">
      <div className="leo-laptop" aria-hidden="true">
        <div className="leo-lid">
          <div className="leo-bezel">
            <div className="leo-screen">
              <div className="leo-wall" />
              <div className="leo-holder">
                <div className="leo-notch" data-s={state} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                  <div className="leo-clip">
                    <div className="leo-ly l-idle">
                      <span className="leo-eye" /><span className="leo-eye" />
                    </div>
                    <div className="leo-ly l-music">
                      <span className="leo-art" />
                      <span className="leo-tx"><b>Midnight Drive</b><i>Demo Track</i></span>
                      <span className="leo-viz">
                        {BAR_MS.map((ms, i) => <u key={i} style={{ animationDuration: `${ms}ms` }} />)}
                      </span>
                    </div>
                    <div className="leo-ly l-pomo">
                      <span className="leo-tx"><i>Focus</i><b className="leo-mono">18:42</b></span>
                      <span className="leo-bar"><u style={{ transform: 'scaleX(0.4)' }} /></span>
                    </div>
                    <div className="leo-ly l-water">
                      <span className="leo-tx"><i>Water</i><b className="leo-mono">1.2 / 2.0 L</b></span>
                      <span className="leo-bar"><u style={{ transform: 'scaleX(0.6)' }} /></span>
                    </div>
                    <div className="leo-ly l-todo">
                      <ul>
                        <li className="done"><s /> {en ? 'Send report' : 'Kirim laporan'}</li>
                        <li><s /> {en ? 'Review designs' : 'Cek desain'}</li>
                        <li><s /> {en ? 'Study at 19:00' : 'Belajar jam 19:00'}</li>
                      </ul>
                    </div>
                    <div className="leo-ly l-shelf">
                      <span className="leo-drop">{en ? 'Drop files here' : 'Taruh file di sini'}</span>
                      <span className="leo-chip">poster.pdf</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="leo-base" />
      </div>

      <div className="leo-ctrl">
        {STATES.map(s => (
          <button key={s} type="button" aria-pressed={state === s} onClick={() => select(s)}>{L(s)}</button>
        ))}
      </div>
    </div>
  );
}
