import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Auth.css';

const ROLES = ['Engineer', 'Startup', 'Company', 'Investor'];
const SKILL_SUGGESTIONS = [
  'AI/Machine Learning', 'Satellite Systems', 'Orbital Mechanics', 'Propulsion',
  'Robotics & Kinematics', 'Embedded Systems', 'RF Engineering', 'Data Analytics',
  'Cloud Computing', 'Software Architecture', 'Systems Engineering', 'Mission Planning',
  'Thermal Management', 'Avionics', 'Signal Processing', 'GIS',
];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'Engineer',
    title: '', bio: '', skills: [], interests: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] });
    }
    setSkillInput('');
  };

  const addInterest = (interest) => {
    const i = interest.trim();
    if (i && !form.interests.includes(i)) {
      setForm({ ...form, interests: [...form.interests, i] });
    }
    setInterestInput('');
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
      </div>
      <div className="auth-card auth-card-wide glass-card animate-fade-in">
        <div className="auth-header">
          <Link to="/" className="auth-logo">SpaceLink AI</Link>
          <h1>{t('auth.reg_title')}</h1>
          <p>{step === 1 ? t('auth.reg_step_acc') : t('auth.reg_step_prof')}</p>
        </div>
        {error && <div className="auth-error">{error}</div>}

        {step === 1 ? (
          <div className="auth-form">
            <div className="auth-field">
              <label>{t('auth.reg_name')}</label>
              <input type="text" className="input-field" placeholder="Dr. Jane Doe"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="auth-field">
              <label>{t('auth.email')}</label>
              <input type="email" className="input-field" placeholder="jane@orbital.tech"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="auth-field">
              <label>{t('auth.password')}</label>
              <input type="password" className="input-field" placeholder="Min. 6 characters"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="auth-field">
              <label>{t('auth.reg_role')}</label>
              <div className="role-selector">
                {ROLES.map(r => (
                  <button key={r} type="button"
                    className={`role-btn ${form.role === r ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, role: r })}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                      {r === 'Engineer' ? 'engineering' : r === 'Startup' ? 'rocket_launch' : r === 'Company' ? 'apartment' : 'account_balance'}
                    </span>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" className="btn-primary auth-submit"
              disabled={!form.name || !form.email || !form.password}
              onClick={() => setStep(2)}>
              {t('auth.reg_btn_next')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label>{t('auth.reg_title_pos')}</label>
              <input type="text" className="input-field" placeholder="Senior Systems Architect"
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="auth-field">
              <label>{t('auth.reg_bio')}</label>
              <textarea className="input-field" rows={3} placeholder="Tell us about your orbital journey..."
                value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
            <div className="auth-field">
              <label>{t('auth.reg_skills')}</label>
              <div className="tag-input-container">
                <div className="tags-display">
                  {form.skills.map((s, i) => (
                    <span key={i} className="chip chip-secondary">
                      {s}
                      <button type="button" onClick={() => setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) })}
                        className="chip-remove">×</button>
                    </span>
                  ))}
                </div>
                <input type="text" className="input-field" placeholder="Type a skill and press Enter"
                  value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }} />
                <div className="tag-suggestions">
                  {SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).slice(0, 6).map(s => (
                    <button key={s} type="button" className="chip chip-outline" onClick={() => addSkill(s)}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="auth-field">
              <label>{t('auth.reg_interests')}</label>
              <div className="tag-input-container">
                <div className="tags-display">
                  {form.interests.map((s, i) => (
                    <span key={i} className="chip chip-primary">
                      {s}
                      <button type="button" onClick={() => setForm({ ...form, interests: form.interests.filter((_, idx) => idx !== i) })}
                        className="chip-remove">×</button>
                    </span>
                  ))}
                </div>
                <input type="text" className="input-field" placeholder="Type an interest and press Enter"
                  value={interestInput} onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addInterest(interestInput); } }} />
              </div>
            </div>
            <div className="auth-actions-row">
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>{t('auth.reg_btn_back')}</button>
              <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                {loading ? t('auth.reg_loading') : t('auth.reg_btn_submit')}
              </button>
            </div>
          </form>
        )}

        <p className="auth-switch">
          {t('auth.reg_switch')} <Link to="/login">{t('auth.reg_switch_link')}</Link>
        </p>
      </div>
    </div>
  );
}
