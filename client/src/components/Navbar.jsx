import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifRef = useRef(null);

  const isLanding = location.pathname === '/';
  const navLinks = [
    { path: '/dashboard', label: t('navbar.home') },
    { path: '/matches', label: t('navbar.matches') },
    { path: '/projects', label: t('navbar.projects') },
    { path: '/users', label: t('navbar.companies') },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('en') ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotifClick = (notif) => {
    if (!notif.read) markAsRead(notif._id);
    setShowNotifPanel(false);
    if (notif.type === 'new_message' && notif.data?.senderId) {
      navigate(`/messages?user=${notif.data.senderId}`);
    } else if (notif.type === 'new_match' && notif.data?.userId) {
      navigate(`/users/${notif.data.userId}`);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'new_message': return 'chat';
      case 'new_match': return 'handshake';
      default: return 'notifications';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to={user ? '/dashboard' : '/'} className="navbar-logo">SpaceLink AI</Link>
        <div className="navbar-links">
          {user ? navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          )) : (
            <>
              <a href="#features" className="navbar-link">{t('navbar.features')}</a>
              <a href="#how-it-works" className="navbar-link">{t('navbar.howItWorks')}</a>
            </>
          )}
        </div>
      </div>
      <div className="navbar-right">
        <button 
          onClick={toggleLanguage} 
          className="btn-ghost" 
          style={{ padding: '0.5rem', marginRight: '0.5rem', textTransform: 'uppercase' }}
        >
          {i18n.language.startsWith('en') ? 'TR' : 'EN'}
        </button>

        {user ? (
          <>
            <div className="navbar-search">
              <span className="material-symbols-outlined search-icon">search</span>
              <input type="text" placeholder={t('navbar.search')} />
            </div>
            <div className="navbar-notif-wrapper" ref={notifRef}>
              <button
                className="navbar-icon-btn"
                onClick={() => setShowNotifPanel(!showNotifPanel)}
              >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                  <span className="navbar-notif-badge">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {showNotifPanel && (
                <div className="notif-panel">
                  <div className="notif-panel__header">
                    <span className="notif-panel__title">Notifications</span>
                    {unreadCount > 0 && (
                      <button className="notif-panel__mark-all" onClick={markAllAsRead}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="notif-panel__list">
                    {notifications.length === 0 ? (
                      <div className="notif-panel__empty">
                        <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--outline-variant)' }}>
                          notifications_off
                        </span>
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.slice(0, 15).map((notif) => (
                        <div
                          key={notif._id}
                          className={`notif-item ${!notif.read ? 'notif-item--unread' : ''}`}
                          onClick={() => handleNotifClick(notif)}
                        >
                          <div className={`notif-item__icon notif-item__icon--${notif.type}`}>
                            <span className="material-symbols-outlined">{getNotifIcon(notif.type)}</span>
                          </div>
                          <div className="notif-item__content">
                            <p className="notif-item__title">{notif.title}</p>
                            <p className="notif-item__body">{notif.body}</p>
                          </div>
                          <span className="notif-item__time">{formatTime(notif.createdAt)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <button className="navbar-icon-btn">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="navbar-user" onClick={() => navigate('/profile')}>
              <div className="navbar-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </>
        ) : (
          <div className="navbar-auth-buttons">
            <Link to="/login" className="btn-ghost">{t('navbar.login')}</Link>
            <Link to="/register" className="btn-primary navbar-signup-btn">{t('navbar.signup')}</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
