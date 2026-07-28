import { useApp } from '../AppContext.jsx';

export function Field({ label, name, type = 'text', defaultValue = '', full = false, ...rest }) {
  return (
    <label className={full ? 'full' : ''}>
      <span>{label}</span>
      <input name={name} type={type} defaultValue={defaultValue ?? ''} {...rest} />
    </label>
  );
}

export function TextAreaField({ label, name, defaultValue = '', full = true }) {
  return (
    <label className={full ? 'full' : ''}>
      <span>{label}</span>
      <textarea name={name} defaultValue={defaultValue ?? ''} />
    </label>
  );
}

export function SelectField({ label, name, children, full = false, ...rest }) {
  return (
    <label className={full ? 'full' : ''}>
      <span>{label}</span>
      <select name={name} {...rest}>{children}</select>
    </label>
  );
}

export function FormButtons({ onClose, submitLabel, danger = false }) {
  const { t } = useApp();
  return (
    <div className="form-actions">
      <button className="btn secondary" type="button" onClick={onClose}>{t('close')}</button>
      <button className={`btn ${danger ? 'danger' : 'primary'}`} type="submit">{submitLabel || t('save')}</button>
    </div>
  );
}
