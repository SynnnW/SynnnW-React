// Pustaka UI 26Menfess — komponen kecil, tanpa inline style statis.
import { useEffect, useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

export { default as Icon } from './Icon';
export { default as Logo } from './Logo';

export function Button({ variant = 'primary', size, block, loading, icon, to, href, children, className = '', disabled, type = 'button', ...rest }) {
  const cls = `mf-btn mf-btn-${variant}${size === 'sm' ? ' mf-btn-sm' : ''}${block ? ' mf-btn-block' : ''} ${className}`;
  const content = <>{loading ? <span className="mf-spin" aria-hidden="true" /> : icon ? <Icon name={icon} size={18} /> : null}{children}</>;
  if (to) return <Link to={to} className={cls} {...rest}>{content}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{content}</a>;
  return <button type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>{content}</button>;
}

export function IconButton({ icon, label, variant = 'ghost', className = '', ...rest }) {
  return <button type="button" className={`mf-btn mf-btn-${variant} mf-iconbtn ${className}`} aria-label={label} title={label} {...rest}><Icon name={icon} /></button>;
}

export function Card({ tone, hero, className = '', as: As = 'div', children, ...rest }) {
  return <As className={`mf-card${tone === 'tint' ? ' mf-card-tint' : ''}${hero ? ' mf-card-hero' : ''} ${className}`} {...rest}>{children}</As>;
}

export function Callout({ kind, icon, children, className = '' }) {
  return <div className={`mf-callout ${kind || ''} ${className}`} role={kind === 'bad' ? 'alert' : undefined}>{icon && <Icon name={icon} />}<div className="mf-grow">{children}</div></div>;
}

export function Chip({ selected, count, dot, children, ...rest }) {
  return (
    <button type="button" className="mf-chip" aria-pressed={!!selected} {...rest}>
      {children}{count != null && <span className="mf-chip-count">{count}</span>}{dot && <span className="mf-dot" aria-label="ada perubahan" />}
    </button>
  );
}
export function ChipGroup({ scroll, label, children }) {
  return <div className={`mf-chips${scroll ? ' scroll' : ''}`} role="group" aria-label={label}>{children}</div>;
}

export function Badge({ className = '', children, icon }) {
  return <span className={`mf-badge ${className}`}>{icon && <Icon name={icon} size={14} />}{children}</span>;
}

export function Field({ label, hint, error, counter, htmlFor, children }) {
  const auto = useId();
  const id = htmlFor || auto;
  return (
    <div className="mf-field">
      {label && <label className="mf-label" htmlFor={id}>{label}</label>}
      {typeof children === 'function' ? children(id) : children}
      <div className="mf-row">
        <div className="mf-grow">{error ? <span className="mf-error" role="alert">{error}</span> : hint ? <span className="mf-hint">{hint}</span> : null}</div>
        {counter}
      </div>
    </div>
  );
}

export function Segmented({ value, onChange, options, label }) {
  return (
    <div className="mf-seg" role="radiogroup" aria-label={label}>
      {options.map(o => (
        <button key={o.value} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

export function Tabs({ tabs, value, onChange, label }) {
  const wrap = useRef(null);
  useEffect(() => {
    const w = wrap.current; const el = w?.querySelector('[aria-selected="true"]');
    if (w && el) w.scrollTo({ left: el.offsetLeft - (w.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
  }, [value]);
  const onKey = (e) => {
    const i = tabs.findIndex(t => t.id === value);
    if (e.key === 'ArrowRight') { e.preventDefault(); onChange(tabs[(i + 1) % tabs.length].id); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); onChange(tabs[(i - 1 + tabs.length) % tabs.length].id); }
  };
  return (
    <div className="mf-tabs" role="tablist" aria-label={label} onKeyDown={onKey} ref={wrap}>
      {tabs.map(t => (
        <button key={t.id} type="button" role="tab" id={`tab-${t.id}`} aria-selected={value === t.id} tabIndex={value === t.id ? 0 : -1}
          className="mf-tab" onClick={() => onChange(t.id)}>
          {t.icon && <Icon name={t.icon} size={18} />}{t.label}{t.count > 0 && <span className="mf-count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ icon = 'inbox', title, children, action }) {
  return <div className="mf-state"><div className="mf-state-ic"><Icon name={icon} /></div><h3>{title}</h3>{children && <p>{children}</p>}{action}</div>;
}
export function ErrorState({ title = 'Gagal memuat', children = 'Periksa koneksi internetmu lalu coba lagi.', onRetry }) {
  return <EmptyState icon="alert" title={title} action={onRetry && <Button variant="secondary" icon="refresh" onClick={onRetry}>Coba lagi</Button>}>{children}</EmptyState>;
}
export function Skeleton({ h = 120, ratio, className = '' }) {
  return <div className={`mf-skeleton ${className}`} style={ratio ? { aspectRatio: ratio } : { height: h }} aria-hidden="true" />;
}

const STATUS = {
  pending:   { icon: 'clock',  label: 'Menunggu' },
  hold:      { icon: 'pause2', label: 'Ditahan' },
  approved:  { icon: 'check',  label: 'Siap tayang' },
  posted:    { icon: 'instagram', label: 'Sudah tayang' },
  rejected:  { icon: 'ban',    label: 'Ditolak' },
  withdrawn: { icon: 'undo',   label: 'Ditarik' },
  removed:   { icon: 'trash',  label: 'Diturunkan' },
};
export const STATUS_LABEL = Object.fromEntries(Object.entries(STATUS).map(([k, v]) => [k, v.label]));
export function StatusBadge({ status }) {
  const s = STATUS[status] || { icon: 'alert', label: status };
  return <span className={`mf-badge mf-badge-${status}`}><Icon name={s.icon} size={14} />{s.label}</span>;
}
