import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
        </div>
        <div className="hero-container">
          <div className="hero-content animate-fade-in">
            <div className="hero-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', fontVariationSettings: "'FILL' 1" }}>stars</span>
              {t('landing.hero_badge')}
            </div>
            <h1 className="hero-title">
              {t('landing.hero_title_1')}<span className="hero-title-accent">{t('landing.hero_title_accent')}</span>{t('landing.hero_title_2')}
            </h1>
            <p className="hero-subtitle">
              {t('landing.hero_subtitle')}
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate('/register')}>{t('landing.hero_btn_signup')}</button>
              <button className="btn-secondary" onClick={() => navigate('/projects')}>{t('landing.hero_btn_explore')}</button>
            </div>
          </div>
          <div className="hero-visual animate-fade-in animate-fade-in-delay-2">
            <div className="hero-image-container glass-card">
              <div className="hero-image-placeholder">
                <span className="material-symbols-outlined" style={{ fontSize: '6rem', color: 'var(--primary)', opacity: 0.3 }}>public</span>
                <div className="hero-image-rings">
                  <div className="ring ring-1"></div>
                  <div className="ring ring-2"></div>
                  <div className="ring ring-3"></div>
                </div>
              </div>
            </div>
            <div className="hero-float-card glass-card animate-fade-in animate-fade-in-delay-3">
              <div className="hero-float-icon">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--on-tertiary-container)' }}>bolt</span>
              </div>
              <span className="hero-float-title">{t('landing.hero_float_title')}</span>
              <p className="hero-float-text">{t('landing.hero_float_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="features" id="features">
        <div className="features-container">
          <div className="features-header animate-fade-in">
            <h2>{t('landing.features_title')}</h2>
            <p>{t('landing.features_subtitle')}</p>
          </div>
          <div className="bento-grid">
            <div className="bento-item bento-main card animate-fade-in animate-fade-in-delay-1">
              <span className="material-symbols-outlined bento-icon" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--primary)' }}>hub</span>
              <h3>{t('landing.bento_1_title')}</h3>
              <p>{t('landing.bento_1_desc')}</p>
              <div className="bento-chips">
                <span className="chip chip-primary">{t('landing.bento_1_badge1')}</span>
                <span className="chip chip-secondary">{t('landing.bento_1_badge2')}</span>
              </div>
            </div>
            <div className="bento-item bento-side orbital-gradient animate-fade-in animate-fade-in-delay-2" style={{ color: 'white' }}>
              <span className="material-symbols-outlined bento-icon" style={{ fontSize: '2.5rem' }}>rocket_launch</span>
              <h3>{t('landing.bento_2_title')}</h3>
              <p style={{ opacity: 0.8 }}>{t('landing.bento_2_desc')}</p>
              <a href="#" className="bento-link">{t('landing.bento_2_link')} <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span></a>
            </div>
            <div className="bento-item bento-small card animate-fade-in animate-fade-in-delay-3" style={{ background: 'var(--surface-container-highest)', textAlign: 'center' }}>
              <div className="bento-small-icon">
                <span className="material-symbols-outlined" style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>groups</span>
              </div>
              <h3>{t('landing.bento_3_title')}</h3>
              <p>{t('landing.bento_3_desc')}</p>
            </div>
            <div className="bento-item bento-wide card animate-fade-in animate-fade-in-delay-4" style={{ background: 'var(--surface)' }}>
              <div className="bento-wide-content">
                <div>
                  <h3>{t('landing.bento_4_title')}</h3>
                  <p>{t('landing.bento_4_desc')}</p>
                </div>
                <div className="bento-wide-icons">
                  <div className="bento-icon-box" style={{ background: '#dbeafe' }}>
                    <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>bar_chart</span>
                  </div>
                  <div className="bento-icon-box" style={{ background: '#ede9fe' }}>
                    <span className="material-symbols-outlined" style={{ color: '#7c3aed' }}>insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="how-container">
          <div className="how-steps animate-fade-in">
            <div className="how-bg-blur"></div>
            <div className="how-step">
              <div className="how-step-number orbital-gradient">1</div>
              <div>
                <h4>{t('landing.how_step1_title')}</h4>
                <p>{t('landing.how_step1_desc')}</p>
              </div>
            </div>
            <div className="how-step">
              <div className="how-step-number how-step-number-outline">2</div>
              <div>
                <h4>{t('landing.how_step2_title')}</h4>
                <p>{t('landing.how_step2_desc')}</p>
              </div>
            </div>
            <div className="how-step">
              <div className="how-step-number how-step-number-outline">3</div>
              <div>
                <h4>{t('landing.how_step3_title')}</h4>
                <p>{t('landing.how_step3_desc')}</p>
              </div>
            </div>
          </div>
          <div className="how-content animate-fade-in animate-fade-in-delay-2">
            <h2>{t('landing.how_content_title_1')}<span style={{ color: 'var(--tertiary)' }}>{t('landing.how_content_title_accent')}</span>{t('landing.how_content_title_2')}</h2>
            <p>{t('landing.how_content_desc')}</p>
            <div className="how-testimonial">
              <p className="how-testimonial-text">"SpaceLink AI cut our recruitment cycle by 60% for the Artemis III payload subsystems. The precision of the matches is unprecedented."</p>
              <div className="how-testimonial-author">
                <div className="how-testimonial-avatar">MT</div>
                <div>
                  <p className="how-testimonial-name">Marcus Thorne</p>
                  <p className="how-testimonial-role">CTO, Orbital Dynamics Corp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-card orbital-gradient">
          <h2>{t('landing.cta_title')}</h2>
          <p>{t('landing.cta_desc')}</p>
          <div className="cta-actions">
            <button className="cta-btn-white" onClick={() => navigate('/register')}>{t('landing.cta_btn_start')}</button>
            <button className="cta-btn-ghost">{t('landing.cta_btn_demo')}</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">SpaceLink AI</span>
            <p>Pioneering the Orbital Economy through intelligent connections and aerospace-focused discovery.</p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-col">
              <h5>PLATFORM</h5>
              <a href="#">AI Matching</a>
              <a href="#">Project Feed</a>
              <a href="#">Companies</a>
            </div>
            <div className="footer-col">
              <h5>COMPANY</h5>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact Support</a>
            </div>
            <div className="footer-col">
              <h5>SOCIAL</h5>
              <div className="footer-social">
                <span className="material-symbols-outlined">hub</span>
                <span className="material-symbols-outlined">satellite_alt</span>
                <span className="material-symbols-outlined">public</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 SpaceLink AI. Pioneering the Orbital Economy.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
