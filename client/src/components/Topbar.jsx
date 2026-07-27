import { useApp } from '../AppContext.jsx';

const PAGE_META = {
  home: ['dashboard', 'dashboardSubtitle'],
  queue: ['queue', 'queueSubtitle'],
  favorites: ['favorites', 'favoriteSubtitle'],
  inventory: ['inventory', 'inventorySubtitle'],
  statistics: ['statistics', 'statisticsSubtitle'],
  history: ['history', 'historySubtitle'],
  maintenance: ['maintenance', 'maintenanceSubtitle'],
  admin: ['adminPanel', 'adminSubtitle']
};

export default function Topbar({ onToggleMenu }) {
  const { t, me, page, language, setLanguage, theme, setTheme, notifications, setDrawer } = useApp();
  const [titleKey, subtitleKey] = PAGE_META[page] || PAGE_META.home;
  const unread = notifications.filter((n) => !n.is_read && n.user_id === me?.id).length;

  return (
    <header className="topbar">
      <button className="icon-btn menu-button" type="button" aria-label="Menu" onClick={onToggleMenu}>☰</button>
      <div>
        <p className="eyebrow">{subtitleKey ? t(subtitleKey).toUpperCase() : 'PRINT HUB'}</p>
        <h1>{t(titleKey)}</h1>
      </div>
      <div className="top-actions">
        <button className="pill-btn" type="button" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en', true)}>
          {language === 'ar' ? 'EN' : 'AR'}
        </button>
        <button className="icon-btn" type="button" aria-label="Theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <button className="icon-btn notification-button" type="button" aria-label="Notifications" onClick={() => setDrawer('notifications')}>
          ♢<span className={`count${unread ? '' : ' hidden'}`}>{unread}</span>
        </button>
        <button className="profile-chip" type="button" onClick={() => setDrawer('profile')}>
          <span>{me?.display_name?.[0]?.toUpperCase()}</span>
          <span>
            <b>{me?.display_name}</b>
            <small>{me?.is_admin ? t('admin') : t('member')}</small>
          </span>
        </button>
      </div>
    </header>
  );
}
