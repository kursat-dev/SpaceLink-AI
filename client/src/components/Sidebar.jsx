import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Sidebar.css';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const links = [
    { path: '/profile', icon: 'account_circle', label: t('sidebar.profile') },
    { path: '/matches', icon: 'hub', label: t('sidebar.matches') },
    { path: '/projects', icon: 'rocket_launch', label: t('sidebar.projects') },
    { path: '/users', icon: 'apartment', label: t('sidebar.companies') },
    { path: '/messages', icon: 'chat', label: t('sidebar.messages') },
    { path: '/settings', icon: 'settings', label: t('sidebar.settings') || 'Ayarlar' },
  ];


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand-icon orbital-gradient">
          <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '1.25rem' }}>rocket_launch</span>
        </div>
        <div>
          <p className="sidebar-brand-name">SpaceLink AI</p>
          <p className="sidebar-brand-subtitle">{t('sidebar.dashboard_subtitle')}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined sidebar-link-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="btn-primary sidebar-post-btn" onClick={() => navigate('/projects?create=true')}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>add</span>
          {t('sidebar.postProject')}
        </button>
        <button className="sidebar-link sidebar-help-link" onClick={() => {}}>
          <span className="material-symbols-outlined sidebar-link-icon">help</span>
          <span>{t('sidebar.help')}</span>
        </button>
        <button className="sidebar-link sidebar-logout-link" onClick={handleLogout}>
          <span className="material-symbols-outlined sidebar-link-icon">logout</span>
          <span>{t('sidebar.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
