import { useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';

export default function Login() {
  const { t, language, setLanguage, setMe } = useApp();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const form = event.target;
    const fd = new FormData(form);
    try {
      const result = await api('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          username: fd.get('username'),
          password: fd.get('password'),
          rememberMe: fd.has('rememberMe')
        })
      });
      form.reset();
      setMe(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-shell">
      <section className="login-card">
        <div className="brand-mark">3D</div>
        <p className="eyebrow">PRINT HUB</p>
        <h1>{t('welcome')}</h1>
        <p className="muted">{t('loginSubtitle')}</p>
        <form className="stack-form" onSubmit={handleSubmit}>
          <label>
            <span>{t('username')}</span>
            <select name="username" required defaultValue="Abdullah">
              <option value="Abdullah">Abdullah</option>
              <option value="Basil">Basil</option>
              <option value="Saleh">Saleh</option>
              <option value="Rocks">Rocks</option>
            </select>
          </label>
          <label>
            <span>{t('password')}</span>
            <input name="password" type="password" autoComplete="current-password" placeholder="1234" required />
          </label>
          <label className="check-row">
            <input name="rememberMe" type="checkbox" /> <span>{t('rememberMe')}</span>
          </label>
          <button className="btn primary wide" type="submit" disabled={submitting}>{t('login')}</button>
          <p className="form-error" role="alert">{error}</p>
        </form>
        <button className="text-btn" type="button" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
          {language === 'ar' ? 'English' : 'العربية'}
        </button>
      </section>
    </div>
  );
}
