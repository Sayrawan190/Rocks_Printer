import { useEffect } from 'react';
import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { Badge, PageHead } from '../components/Shared.jsx';
import TransferForm from '../forms/TransferForm.jsx';

export default function Admin() {
  const { t, me, users, setMe, loadUsers, loadFilaments, loadNotifications, toast, navigate, setDrawer } = useApp();

  useEffect(() => {
    if (!me?.is_admin) navigate('home');
  }, [me, navigate]);

  if (!me?.is_admin) return null;
  const admin = users.find((u) => u.is_admin);

  async function handleExport() {
    try {
      const response = await fetch('/api/admin/export');
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `print-hub-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = async () => {
      try {
        const parsed = JSON.parse(await input.files[0].text());
        if (!window.confirm('Import this backup and replace current data?')) return;
        await api('/api/admin/import', { method: 'POST', body: JSON.stringify(parsed) });
        const { user } = await api('/api/me');
        setMe(user);
        await Promise.all([loadUsers(), loadFilaments(), loadNotifications()]);
        toast('Data imported');
        navigate('home');
      } catch (error) {
        toast(error.message, 'error');
      }
    };
    input.click();
  }

  return (
    <>
      <PageHead title={t('adminTitle')} subtitle={t('adminSubtitle')} />
      <div className="grid three-col">
        <section className="card">
          <div className="section-title"><h3>{t('currentAdmin')}</h3></div>
          <div className="profile-card">
            <div className="large-avatar">{admin?.display_name?.[0]}</div>
            <h3>{admin?.display_name}</h3>
            <Badge value="Admin" />
          </div>
        </section>
        <section className="card">
          <div className="section-title"><h3>{t('transferAdmin')}</h3></div>
          <p className="muted">{t('transferWarning')}</p>
          <TransferForm />
        </section>
        <section className="card">
          <div className="section-title"><h3>{t('dataTools')}</h3></div>
          <div className="stack-form">
            <button className="btn secondary wide" onClick={handleExport}>{t('exportData')}</button>
            <button className="btn secondary wide" onClick={handleImport}>{t('importData')}</button>
          </div>
        </section>
      </div>
      <section className="card" style={{ marginTop: 17 }}>
        <div className="section-title"><h3>{t('quickLinks')}</h3></div>
        <div className="actions">
          <button className="btn secondary" onClick={() => navigate('inventory')}>{t('openInventory')}</button>
          <button className="btn secondary" onClick={() => navigate('history')}>{t('openHistory')}</button>
          <button className="btn secondary" onClick={() => setDrawer('notifications')}>{t('allNotifications')}</button>
        </div>
      </section>
    </>
  );
}
