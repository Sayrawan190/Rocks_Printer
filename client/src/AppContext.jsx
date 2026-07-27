import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api, setUnauthorizedHandler } from './api.js';
import { words } from './i18n.js';

const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [booted, setBooted] = useState(false);
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [filaments, setFilaments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [language, setLanguageState] = useState(localStorage.getItem('printHubLanguage') || 'en');
  const [theme, setTheme] = useState(localStorage.getItem('printHubTheme') || 'light');
  const [page, setPageState] = useState(localStorage.getItem('printHubPage') || 'home');
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const meRef = useRef(me);
  meRef.current = me;

  const t = useCallback((key) => words[language]?.[key] || words.en[key] || key, [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('printHubTheme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('printHubLanguage', language);
  }, [language]);

  const toast = useCallback((message, kind = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, message, kind }]);
    setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 3800);
  }, []);

  const setLanguage = useCallback((lang, save = false) => {
    setLanguageState(lang);
    if (save && meRef.current) api('/api/me/language', { method: 'PUT', body: JSON.stringify({ language: lang }) }).catch(() => {});
  }, []);

  const navigate = useCallback((nextPage) => {
    setPageState((current) => {
      const target = nextPage === 'admin' && !meRef.current?.is_admin ? 'home' : nextPage;
      localStorage.setItem('printHubPage', target);
      return target;
    });
  }, []);

  const loadUsers = useCallback(async () => setUsers(await api('/api/users')), []);
  const loadFilaments = useCallback(async () => setFilaments(await api('/api/filaments')), []);
  const loadNotifications = useCallback(async () => {
    if (!meRef.current) return;
    setNotifications(await api('/api/notifications'));
  }, []);

  const openModal = useCallback((title, body, eyebrow = 'PRINT HUB') => setModal({ title, body, eyebrow }), []);
  const closeModal = useCallback(() => setModal(null), []);

  const showLogin = useCallback(() => setMe(null), []);

  useEffect(() => {
    setUnauthorizedHandler(() => showLogin());
    (async () => {
      try {
        const { user } = await api('/api/me');
        setMe(user);
      } catch {
        setMe(null);
      } finally {
        setBooted(true);
      }
    })();
  }, [showLogin]);

  useEffect(() => {
    if (!me) return;
    setLanguage(me.language || language);
    (async () => {
      await Promise.all([loadUsers(), loadFilaments(), loadNotifications()]);
      navigate(localStorage.getItem('printHubPage') || 'home');
    })();
    const id = setInterval(loadNotifications, 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.id]);

  const value = useMemo(() => ({
    booted, me, setMe, showLogin,
    users, loadUsers,
    filaments, loadFilaments,
    notifications, loadNotifications,
    language, setLanguage,
    theme, setTheme,
    page, navigate,
    t, toast, toasts,
    modal, openModal, closeModal,
    drawer, setDrawer
  }), [booted, me, showLogin, users, loadUsers, filaments, loadFilaments, notifications, loadNotifications, language, setLanguage, theme, page, navigate, t, toast, toasts, modal, openModal, closeModal, drawer]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
