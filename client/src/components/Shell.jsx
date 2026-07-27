import { useEffect, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import NotificationDrawer from './NotificationDrawer.jsx';
import ProfileDrawer from './ProfileDrawer.jsx';
import Modal from './Modal.jsx';
import Home from '../pages/Home.jsx';
import Queue from '../pages/Queue.jsx';
import Favorites from '../pages/Favorites.jsx';
import Inventory from '../pages/Inventory.jsx';
import Statistics from '../pages/Statistics.jsx';
import History from '../pages/History.jsx';
import Maintenance from '../pages/Maintenance.jsx';
import Admin from '../pages/Admin.jsx';

const PAGES = {
  home: Home,
  queue: Queue,
  favorites: Favorites,
  inventory: Inventory,
  statistics: Statistics,
  history: History,
  maintenance: Maintenance,
  admin: Admin
};

export default function Shell() {
  const { page, closeModal, setDrawer } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        closeModal();
        setDrawer(null);
        setSidebarOpen(false);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeModal, setDrawer]);

  const PageComponent = PAGES[page] || Home;

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className={`backdrop${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <main className="main">
        <Topbar onToggleMenu={() => setSidebarOpen((v) => !v)} />
        <div className="page-content">
          <PageComponent />
        </div>
      </main>
      <NotificationDrawer />
      <ProfileDrawer />
      <Modal />
    </div>
  );
}
