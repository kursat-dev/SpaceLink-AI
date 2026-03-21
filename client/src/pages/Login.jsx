import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
      </div>
      <div className="auth-card glass-card animate-fade-in">
        <div className="auth-header">
          <Link to="/" className="auth-logo">SpaceLink AI</Link>
          <h1>{t('auth.login_title')}</h1>
          <p>{t('auth.login_subtitle')}</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>{t('auth.email')}</label>
            <input
              type="email"
              className="input-field"
              placeholder="your@orbital.email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label>{t('auth.password')}</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? t('auth.login_loading') : t('auth.login_btn')}
          </button>
        </form>
        <p className="auth-switch">
          {t('auth.login_switch')} <Link to="/register">{t('auth.login_switch_link')}</Link>
        </p>
        <div className="auth-demo-hint">
          <p>{t('auth.demo_hint')}: <code>elias@orbital.tech</code> / <code>password123</code></p>
        </div>
      </div>
    </div>
  );
}
