import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { usersAPI } from '../api';
import Sidebar from '../components/Sidebar';
import './Settings.css';

export default function Settings() {
  const { user: currentUser, updateUser } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    website: '',
    orbitExperience: '',
    socialLinks: { linkedin: '', twitter: '', github: '' }
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        location: currentUser.location || '',
        website: currentUser.website || '',
        orbitExperience: currentUser.orbitExperience || '',
        socialLinks: currentUser.socialLinks || { linkedin: '', twitter: '', github: '' }
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.split('_')[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [socialKey]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const res = await usersAPI.update(currentUser._id, formData);
      updateUser(res.data);
      setSuccess(t('settings.success') || 'Ayarlar başarıyla güncellendi.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t('settings.error') || 'Güncelleme hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-with-sidebar">
      <Sidebar />
      <main className="page-content">
        <div className="settings-container animate-fade-in">
          <div className="section-header">
            <h2>{t('sidebar.settings') || 'Ayarlar'}</h2>
            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>settings</span>
          </div>
          
          {success && <div className="toast toast-success">{success}</div>}
          {error && <div className="toast toast-error">{error}</div>}

          <form className="card settings-form" onSubmit={handleSubmit}>
            <div className="settings-grid">
              
              <div className="settings-section">
                <h3>Genel Bilgiler</h3>
                <div className="form-group">
                  <label>İsim Soyisim</label>
                  <input className="input-field" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>E-posta</label>
                  <input type="email" className="input-field" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Yerleşke / Ülke</label>
                  <input className="input-field" name="location" value={formData.location} onChange={handleChange} placeholder="Örn: Ankara, Türkiye" />
                </div>
              </div>

              <div className="settings-section">
                <h3>Kariyer & Uzay Bilişimi</h3>
                <div className="form-group">
                  <label>Yörünge Deneyimi</label>
                  <input className="input-field" name="orbitExperience" value={formData.orbitExperience} onChange={handleChange} placeholder="Örn: 5 Yıl Derin Uzay Sinyal Analizi" />
                </div>
                <div className="form-group">
                  <label>Kişisel Web Sitesi</label>
                  <input className="input-field" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
                </div>
              </div>

              <div className="settings-section full-width">
                <h3>Sosyal Medya</h3>
                <div className="social-inputs-grid">
                  <div className="form-group">
                    <label>LinkedIn</label>
                    <input className="input-field" name="social_linkedin" value={formData.socialLinks.linkedin} onChange={handleChange} placeholder="Profil ID veya Link" />
                  </div>
                  <div className="form-group">
                    <label>GitHub</label>
                    <input className="input-field" name="social_github" value={formData.socialLinks.github} onChange={handleChange} placeholder="Kullanıcı Adı veya Link" />
                  </div>
                  <div className="form-group">
                    <label>Twitter / X</label>
                    <input className="input-field" name="social_twitter" value={formData.socialLinks.twitter} onChange={handleChange} placeholder="Kullanıcı Adı" />
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
