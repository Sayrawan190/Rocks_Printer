import { useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';

export default function ProfileDrawer() {
  const { t, me, toast, showLogin, drawer, setDrawer } = useApp();
  const open = drawer === 'profile';
  const onClose = () => setDrawer(null);
  const [error, setError] = useState('');

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setError('');
    const form = event.target;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      await api('/api/me/password', { method: 'PUT', body: JSON.stringify(data) });
      form.reset();
      toast('Password updated');
    } catch (err) {
      setError(err.message);
      toast(err.message, 'error');
    }
  }

  async function handleLogout() {
    try {
      await api('/api/logout', { method: 'POST' });
    } finally {
      showLogin();
    }
  }

  return (
    <aside className={`drawer${open ? ' open' : ''}`} aria-hidden={!open}>
      <div className="drawer-head">
        <div>
          <p className="eyebrow">{t('account')}</p>
          <h2>{t('settings')}</h2>
        </div>
        <button className="icon-btn drawer-close" type="button" onClick={onClose}>×</button>
      </div>
      <div className="profile-card">
        <div className="large-avatar">{me?.display_name?.[0]?.toUpperCase()}</div>
        <h3>{me?.display_name}</h3>
        <span className="badge">{me?.is_admin ? t('admin') : t('member')}</span>
      </div>
      <form className="stack-form panel-form" onSubmit={handlePasswordSubmit}>
        <h3>{t('changePassword')}</h3>
        <label>
          <span>{t('currentPassword')}</span>
          <input name="currentPassword" type="password" required />
        </label>
        <label>
          <span>{t('newPassword')}</span>
          <input name="newPassword" type="password" minLength={4} required />
        </label>
        <label>
          <span>{t('confirmPassword')}</span>
          <input name="confirmPassword" type="password" minLength={4} required />
        </label>
        <button className="btn secondary wide" type="submit">{t('updatePassword')}</button>
        {error && <p className="form-error" role="alert">{error}</p>}
      </form>
      <button className="btn danger outline wide" type="button" onClick={handleLogout}>{t('logout')}</button>
    </aside>
  );
}
