// RulesGate — sheet persetujuan aturan (bukan modal buntu): ada Kembali & link aturan lengkap.
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RULES, RULES_VERSION, PROCESS_NOTES } from '@/lib/menfess/rules';
import { getAcceptedRulesVersion, setAcceptedRulesVersion } from './utils';
import { Sheet } from './ui/Sheet';
import { Button, Icon } from './ui';

export default function RulesGate({ children }) {
  const [ok, setOk] = useState(() => getAcceptedRulesVersion() >= RULES_VERSION);
  const [checked, setChecked] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  if (ok) return children;

  const accept = () => { setAcceptedRulesVersion(RULES_VERSION); setOk(true); };
  const back = () => nav('/26menfess/app?tab=riwayat', { replace: true });
  return (
    <>
      <Sheet open onClose={back} title="Aturan 26Menfess"
        footer={<>
          <Button variant="secondary" onClick={back}>Kembali</Button>
          <Button onClick={accept} disabled={!checked}>Setuju & lanjut</Button>
        </>}>
        <div className="mf-stack">
          <p className="mf-muted">Baca singkat dulu sebelum menulis menfess.</p>
          {RULES.filter(r => !r.suggested).map(r => (
            <details key={r.id} className="mf-card" open={r.id === 1}>
              <summary><b>{r.id}. {r.title}</b></summary>
              <p className="mf-small mf-muted" style={{ margin: '8px 0 0' }}>{r.body}</p>
            </details>
          ))}
          <details className="mf-card">
            <summary><b>Ketentuan proses</b></summary>
            <ul className="mf-small mf-muted">{PROCESS_NOTES.map(n => <li key={n}>{n}</li>)}</ul>
          </details>
          <Link to="/26menfess/aturan" state={{ from: loc.pathname + loc.search }} className="mf-small"><b>Baca aturan lengkap →</b></Link>
          <label className="mf-switch">
            <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />
            <span>Aku paham dan setuju pada aturan di atas.</span>
          </label>
        </div>
      </Sheet>
      <div className="mf-state"><div className="mf-state-ic"><Icon name="rules" /></div><p>Setujui aturan untuk mulai menulis.</p></div>
    </>
  );
}
