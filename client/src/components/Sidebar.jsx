import { useApp } from '../AppContext.jsx';

const NAV_ITEMS = [
  { page: 'home', icon: '⌂', key: 'home' },
  { page: 'queue', icon: '☷', key: 'queue' },
  { page: 'favorites', icon: '☆', key: 'favorites' },
  { page: 'inventory', icon: '◉', key: 'inventory' },
  { page: 'statistics', icon: '⌁', key: 'statistics' },
  { page: 'history', icon: '↺', key: 'history' },
  { page: 'maintenance', icon: '⌘', key: 'maintenance' }
];

export default function Sidebar({ open, onNavigate }) {
  const { t, me, page, navigate } = useApp();

  function go(target) {
    navigate(target);
    onNavigate();
  }

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="brand">
        <div className="brand-mark small">3D</div>
        <div>
          <strong>Print Hub</strong>
          <small>{t('printerManager')}</small>
        </div>
      </div>
      <nav className="nav-list" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <button key={item.page} className={page === item.page ? 'active' : ''} onClick={() => go(item.page)}>
            <span>{item.icon}</span>
            <b>{t(item.key)}</b>
          </button>
        ))}
        <button
          className={`admin-nav${me?.is_admin ? '' : ' hidden'}${page === 'admin' ? ' active' : ''}`}
          onClick={() => go('admin')}
        >
          <span>⚙</span>
          <b>{t('adminPanel')}</b>
        </button>
      </nav>
      <div className="sidebar-foot">
        <span className="status-dot" />
        <span>{t('serverConnected')}</span>
      </div>
    </aside>
  );
}
