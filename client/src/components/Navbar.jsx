import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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
            <button className="navbar-icon-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
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
