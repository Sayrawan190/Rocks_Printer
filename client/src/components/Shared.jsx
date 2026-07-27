import { useState } from 'react';
import { useApp } from '../AppContext.jsx';

export function Badge({ value }) {
  const { t } = useApp();
  const cls = String(value).toLowerCase().replaceAll(' ', '-');
  return <span className={`badge ${cls}`}>{t(String(value).toLowerCase()) || value}</span>;
}

export function Empty({ title, text = '' }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      {text}
    </div>
  );
}

export function ImageThumb({ url }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) return <span className="thumb placeholder">3D</span>;
  return <img className="thumb" src={url} alt="" onError={() => setFailed(true)} />;
}

export function Loader() {
  return <div className="loader" />;
}

export function StatCard({ label, value, note = '', icon = '•' }) {
  return (
    <article className="card stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <i className="stat-icon">{icon}</i>
      </div>
      <strong className="stat-value">{value}</strong>
      <small className="stat-note">{note}</small>
    </article>
  );
}

export function PageHead({ title, subtitle, action = null }) {
  return (
    <div className="page-head">
      <div>
        <h2>{title}</h2>
        <p className="muted">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function SummaryRow({ label, value }) {
  return (
    <div className="item-meta">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function FilterSelect({ id, value, onChange, list, allLabel, labelFor = (v) => v }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{allLabel}</option>
      {list.map((v) => (
        <option key={v} value={v}>{labelFor(v)}</option>
      ))}
    </select>
  );
}
