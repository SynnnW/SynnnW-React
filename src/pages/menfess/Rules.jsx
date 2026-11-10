// Aturan /26menfess/aturan
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { MfAuthContext } from '@/lib/menfess/useMfAuth';
import { RULES, PROCESS_NOTES } from '@/lib/menfess/rules';
import { PageHeader } from '@/components/menfess/ui/Shell';
import { Badge, Button, Card, Icon } from '@/components/menfess/ui';

export default function Rules() {
  const { user } = useContext(MfAuthContext);
  const loc = useLocation();
  return (
    <div className="mf-narrow mf-stack">
      <PageHeader title="Aturan" />
      <div className="mf-stack">
        {RULES.map(r => (
          <div key={r.id} className="mf-rule">
            <span className="mf-rule-n">{r.id}</span>
            <div><h3>{r.title} {r.suggested && <Badge>Tambahan</Badge>}</h3><p className="mf-muted" style={{ margin: 0 }}>{r.body}</p></div>
          </div>
        ))}
      </div>
      <Card tone="tint">
        <h2>Ketentuan proses</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} className="mf-stack">
          {PROCESS_NOTES.map(n => <li key={n} className="mf-row" style={{ alignItems: 'flex-start' }}><Icon name="check" /><span>{n}</span></li>)}
        </ul>
      </Card>
      <div className="mf-stickycta">
        {user
          ? <Button to="/26menfess/app?tab=kirim" icon="send">Tulis menfess</Button>
          : <Button to="/26menfess/masuk" state={{ from: loc.pathname }} icon="send">Masuk & kirim menfess</Button>}
      </div>
    </div>
  );
}
