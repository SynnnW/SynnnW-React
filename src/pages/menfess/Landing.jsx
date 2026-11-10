// Landing /26menfess — terbuka untuk semua (login maupun belum).
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MfAuthContext } from '@/lib/menfess/useMfAuth';
import { fetchPublicSettings } from '@/lib/menfess/api';
import { WELCOME_TITLE, WELCOME_TEXT, WHAT_IS_TEXT, RULES } from '@/lib/menfess/rules';
import { usePublicFeed, FeedGrid, FeedStates, PostSheet } from '@/components/menfess/FeedBits';
import { Button, Card, Icon, Callout } from '@/components/menfess/ui';
import CardThumb from '@/components/menfess/ui/CardThumb';
import { IG } from '@/components/menfess/ui/Shell';

const SAMPLES = [
  { id: 'ex-a', design: 'pink',  body: 'Makasih ya udah jadi tempat cerita paling aman minggu ini 🫶🏻', category: 'curhat' },
  { id: 'ex-b', design: 'green', body: 'Request lagu buat yang lagi capek tapi tetap semangat!', category: 'request_lagu' },
  { id: 'ex-c', design: 'pink',  body: 'Suarakan, tanpa nama.', category: 'info' },
];
const STEPS = [
  ['Masuk', 'Google atau anonim.'],
  ['Tulis & pilih desain', 'Pink atau Hijau.'],
  ['Admin meninjau', 'Dicek sebelum tayang.'],
  ['Tayang di Instagram', 'Pantau di Riwayat.'],
];
const RULE_ICON = ['ban', 'alert', 'lock'];

export default function Landing() {
  const { user } = useContext(MfAuthContext);
  const loc = useLocation();
  const feed = usePublicFeed(6);
  const [settings, setSettings] = useState(null);
  const [open, setOpen] = useState(null);
  const [full, setFull] = useState(false);
  const [hideAnn, setHideAnn] = useState(() => { try { return sessionStorage.getItem('mf:ann') === '1'; } catch { return false; } });
  useEffect(() => { fetchPublicSettings().then(setSettings).catch(() => {}); }, []);

  const paras = WELCOME_TEXT.split('\n\n');
  const hero = feed.items.length >= 3 ? feed.items.slice(0, 3) : SAMPLES;
  const closed = settings && settings.accepting === false;

  return (
    <div className="mf-stack-lg">
      {settings?.announcement && !hideAnn && (
        <div className="mf-announce" style={{ margin: 'calc(var(--mf-s-4) * -1) calc(var(--mf-s-4) * -1) 0' }}>
          <div><Icon name="bell" /><span className="mf-grow">{settings.announcement}</span>
            <button type="button" className="mf-btn mf-btn-ghost mf-iconbtn" aria-label="Tutup pengumuman"
              onClick={() => { setHideAnn(true); try { sessionStorage.setItem('mf:ann', '1'); } catch { /* abaikan */ } }}><Icon name="close" /></button></div>
        </div>
      )}

      <section className="mf-hero">
        <div className="mf-stack">
          <h1>Suarakan, tanpa nama.</h1>
          <p className="mf-muted">Ruang menfess anonim untuk mahasiswa FKEP 2026. Tulis, kami review, lalu tayang di Instagram.</p>
          {closed && <Callout kind="warn" icon="alert"><b>Pengiriman ditutup sementara.</b> {settings.closed_message}</Callout>}
          <div className="mf-row-wrap">
            {user
              ? <><Button to="/26menfess/app?tab=kirim" icon="send">Tulis menfess</Button><Button to="/26menfess/app?tab=riwayat" variant="secondary" icon="history">Riwayatku</Button></>
              : <><Button to="/26menfess/masuk" state={{ from: loc.pathname }} icon="send">Masuk & kirim menfess</Button><Button href={IG} target="_blank" rel="noopener noreferrer" variant="secondary" icon="instagram">@secretmenfess.26</Button></>}
          </div>
        </div>
        <div className="mf-hero-cards" aria-hidden="true">
          {['a', 'b', 'c'].map((k, i) => <CardThumb key={k} post={hero[i]} eager className={`${k} static`} />)}
        </div>
      </section>

      <section aria-labelledby="cara">
        <div className="mf-section-title"><h2 id="cara">Cara kerja</h2></div>
        <ol className="mf-steps" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {STEPS.map(([t, d], i) => (
            <li key={t} className="mf-step"><span className="mf-step-n">{i + 1}</span><div><b>{t}</b><div className="mf-small mf-muted">{d}</div></div></li>
          ))}
        </ol>
      </section>

      <Card tone="tint" className="mf-stack">
        <h2>{WELCOME_TITLE}</h2>
        <p>{paras[0]}</p>
        {full && <p>{paras.slice(1).join('\n\n')}</p>}
        <p className="mf-muted">{WHAT_IS_TEXT}</p>
        <div><Button variant="ghost" size="sm" onClick={() => setFull(f => !f)} aria-expanded={full}>{full ? 'Sembunyikan' : 'Baca selengkapnya'}</Button></div>
      </Card>

      <section aria-labelledby="atr">
        <div className="mf-section-title"><h2 id="atr">Aturan utama</h2><Link to="/26menfess/aturan" state={{ from: loc.pathname }} className="mf-small"><b>Aturan lengkap →</b></Link></div>
        <div className="mf-rules3">
          {RULES.filter(r => !r.suggested).map((r, i) => (
            <Card key={r.id} className="mf-rule-mini"><Icon name={RULE_ICON[i] || 'rules'} /><div><b>{r.title}</b><div className="mf-small mf-muted mf-clamp2">{r.body}</div></div></Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="fd">
        <div className="mf-section-title"><h2 id="fd">Sudah tayang</h2><Link to="/26menfess/feed" className="mf-small"><b>Lihat semua →</b></Link></div>
        <FeedStates loading={feed.loading} error={feed.error} empty={!feed.items.length} reload={feed.reload} />
        {feed.items.length > 0 && <FeedGrid items={feed.items} limit={6} onOpen={setOpen} />}
      </section>
      <PostSheet post={open} onClose={() => setOpen(null)} />
    </div>
  );
}
