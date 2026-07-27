import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { fmtDate } from '../i18n.js';
import { Empty } from './Shared.jsx';

export default function NotificationDrawer() {
  const { t, me, language, notifications, loadNotifications, toast, drawer, setDrawer } = useApp();
  const open = drawer === 'notifications';
  const onClose = () => setDrawer(null);

  async function markAllRead() {
    try {
      await api('/api/notifications/read-all', { method: 'PUT' });
      await loadNotifications();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  async function markRead(id) {
    try {
      await api(`/api/notifications/${id}/read`, { method: 'PUT' });
      await loadNotifications();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  return (
    <aside className={`drawer${open ? ' open' : ''}`} aria-hidden={!open}>
      <div className="drawer-head">
        <div>
          <p className="eyebrow">{t('updates')}</p>
          <h2>{t('notifications')}</h2>
        </div>
        <button className="icon-btn drawer-close" type="button" onClick={onClose}>×</button>
      </div>
      <button className="text-btn" onClick={markAllRead}>{t('markAllRead')}</button>
      <div className="notification-list">
        {notifications.length ? notifications.map((n) => (
          <article key={n.id} className={`notification ${n.is_read ? '' : 'unread'}`} onClick={() => markRead(n.id)}>
            <h4>{n.title} {n.recipient_name && me?.is_admin ? <small>→ {n.recipient_name}</small> : null}</h4>
            <p>{n.message}</p>
            <time>{fmtDate(n.created_at, language, true)}</time>
          </article>
        )) : <Empty title={t('notifications')} />}
      </div>
    </aside>
  );
}
