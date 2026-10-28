import { useEffect, useState } from 'react';
import { MASCOT_EVENT, readMascotHidden, writeMascotHidden } from '../lib/leoMascot';
import './leo-mascot.css';

// Footer control to bring the mascot back (or hide it again).
export default function LeoMascotToggle({ lang = 'id' }) {
  const [hidden, setHidden] = useState(readMascotHidden);
  useEffect(() => {
    const on = () => setHidden(readMascotHidden());
    window.addEventListener(MASCOT_EVENT, on);
    return () => window.removeEventListener(MASCOT_EVENT, on);
  }, []);
  const en = lang === 'en';
  return (
    <button type="button" className="leo-toggle-btn" onClick={() => writeMascotHidden(!hidden)}>
      {hidden ? (en ? 'Show Leo' : 'Tampilkan Leo') : (en ? 'Hide Leo' : 'Sembunyikan Leo')}
    </button>
  );
}
