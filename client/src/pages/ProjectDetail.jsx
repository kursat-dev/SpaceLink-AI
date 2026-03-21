import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../api';
import Sidebar from '../components/Sidebar';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => { loadProject(); }, [id]);

  const loadProject = async () => {
    try {
      const res = await projectsAPI.getById(id);
      setProject(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleApply = async () => {
    if (!user) return navigate('/login');
    setApplying(true);
    try {
      await projectsAPI.apply(id, 'I would love to contribute to this project!');
      loadProject();
    } catch (err) { console.error(err); }
    finally { setApplying(false); }
  };

  if (loading) return <div className="page-with-sidebar"><Sidebar /><main className="page-content"><div className="loading-placeholder">{t('projectDetail.loading')}</div></main></div>;
  if (!project) return <div className="page-with-sidebar"><Sidebar /><main className="page-content"><h2>{t('projectDetail.not_found')}</h2></main></div>;

  const hasApplied = project.applicants?.some(a => a.user?._id === user?._id || a.user === user?._id);
  const isOwner = project.owner?._id === user?._id;

  return (
    <div className="page-with-sidebar">
      <Sidebar />
      <main className="page-content">
        {/* Hero */}
        <div className="pd-hero animate-fade-in">
          <div className="pd-hero-badges">
            <span className="chip chip-primary">{t('projectDetail.badge_aimatched')}</span>
            <span className="chip chip-secondary">{t('projectDetail.badge_active')}</span>
          </div>
          <h1>{project.title}</h1>
          <div className="pd-hero-meta">
            {project.duration && (
              <span className="pd-meta-item">
                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>schedule</span>
                {project.duration}
              </span>
            )}
            {project.budget && (
              <span className="pd-meta-item">
                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>payments</span>
                {project.budget}
              </span>
            )}
          </div>
        </div>

        <div className="pd-grid">
          {/* Main Content */}
          <div className="pd-main">
            <div className="card animate-fade-in animate-fade-in-delay-1">
              <h2>{t('projectDetail.mission_title')}</h2>
              <p className="pd-description">{project.description}</p>
              {project.objectives?.length > 0 && (
                <div className="pd-objectives">
                  {project.objectives.map((obj, i) => (
                    <div key={i} className="pd-objective-card">
                      <h4 style={{ color: 'var(--primary)' }}>{obj.title}</h4>
                      <p>{obj.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card animate-fade-in animate-fade-in-delay-2">
              <h2>{t('projectDetail.expertise_title')}</h2>
              <div className="pd-skills-grid">
                {project.requiredSkills?.map((skill, i) => (
                  <div key={i} className="pd-skill-item">
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>verified</span>
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="card animate-fade-in animate-fade-in-delay-3">
              <h2>{t('projectDetail.team_title')}</h2>
              <div className="pd-team-grid">
                {project.teamMembers?.map((tm, i) => (
                  <div key={i} className="pd-team-member" onClick={() => tm.user?._id && navigate(`/users/${tm.user._id}`)}>
                    <div className="pd-team-avatar">{tm.user?.name?.charAt(0) || '?'}</div>
                    <div>
                      <p className="pd-team-name">{tm.user?.name || 'Unknown'}</p>
                      <p className="pd-team-role">{tm.role}</p>
                    </div>
                  </div>
                ))}
                <div className="pd-team-member pd-team-slot">
                  <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'var(--outline)' }}>add_circle</span>
                  <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>{t('projectDetail.team_slot')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="pd-sidebar">
            <div className="card animate-fade-in animate-fade-in-delay-1">
              <h3>{t('projectDetail.sidebar_title')}</h3>
              <p className="pd-sidebar-desc">{t('projectDetail.sidebar_desc')}</p>
              <div className="pd-sidebar-stats">
                <div className="pd-stat"><span className="pd-stat-label">{t('projectDetail.stat_deadline')}</span><span className="pd-stat-value">Oct 12, 2024</span></div>
                <div className="pd-stat"><span className="pd-stat-label">{t('projectDetail.stat_applicants')}</span><span className="pd-stat-value">{t('projectDetail.val_pros', { count: project.applicants?.length || 0 })}</span></div>
                <div className="pd-stat"><span className="pd-stat-label">{t('projectDetail.stat_location')}</span><span className="pd-stat-value">{project.location}</span></div>
              </div>
              {!isOwner && (
                <>
                  <button className="btn-primary pd-apply-btn" onClick={handleApply}
                    disabled={hasApplied || applying}>
                    {hasApplied ? t('projectDetail.btn_applied') : applying ? t('projectDetail.btn_applying') : t('projectDetail.btn_apply')}
                  </button>
                  <button className="btn-secondary pd-save-btn">{t('projectDetail.btn_save')}</button>
                </>
              )}
            </div>

            <div className="card animate-fade-in animate-fade-in-delay-2" style={{ background: 'var(--surface-container-low)' }}>
              <p className="label-xs" style={{ marginBottom: '1rem' }}>{t('projectDetail.params_label')}</p>
              <div className="pd-params">
                <div className="pd-param">
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>satellite_alt</span>
                  <div>
                    <p className="pd-param-title">Deep Space Network</p>
                    <p className="pd-param-desc">Ka-band communication protocols</p>
                  </div>
                </div>
                <div className="pd-param">
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: 'var(--tertiary)' }}>memory</span>
                  <div>
                    <p className="pd-param-title">Quantum Core AI</p>
                    <p className="pd-param-desc">Edge computing for pathfinding</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
