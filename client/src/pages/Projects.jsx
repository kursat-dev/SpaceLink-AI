import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { projectsAPI } from '../api';
import Sidebar from '../components/Sidebar';
import './Projects.css';

export default function Projects() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(searchParams.get('create') === 'true');
  const [newProject, setNewProject] = useState({
    title: '', description: '', requiredSkills: [], budget: '', duration: '', location: 'Remote'
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const res = await projectsAPI.getAll();
      setProjects(res.data.projects);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await projectsAPI.create(newProject);
      setShowCreate(false);
      setNewProject({ title: '', description: '', requiredSkills: [], budget: '', duration: '', location: 'Remote' });
      loadProjects();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="page-with-sidebar">
      <Sidebar />
      <main className="page-content">
        <div className="projects-header animate-fade-in">
          <div>
            <p className="label-sm label-primary">{t('projects.directory_label')}</p>
            <h1>{t('projects.title')}</h1>
          </div>
          {user && (
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>add</span>
              {t('projects.btn_post')}
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-placeholder">{t('projects.loading')}</div>
        ) : (
          <div className="projects-grid">
            {projects.map((project, i) => (
              <div key={project._id} className="card project-card animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}
                onClick={() => navigate(`/projects/${project._id}`)}>
                <div className="project-card-top">
                  <div className="project-card-badges">
                    {project.status === 'active' && <span className="chip chip-primary">{t('projects.badge_active')}</span>}
                  </div>
                </div>
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.description?.substring(0, 120)}...</p>
                <div className="project-card-meta">
                  {project.duration && (
                    <span className="project-meta-item">
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>schedule</span>
                      {project.duration}
                    </span>
                  )}
                  {project.budget && (
                    <span className="project-meta-item">
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>payments</span>
                      {project.budget}
                    </span>
                  )}
                </div>
                <div className="project-card-skills">
                  {project.requiredSkills?.slice(0, 3).map((s, j) => (
                    <span key={j} className="chip chip-outline">{s}</span>
                  ))}
                  {project.requiredSkills?.length > 3 && (
                    <span className="chip chip-outline">+{project.requiredSkills.length - 3}</span>
                  )}
                </div>
                <div className="project-card-footer">
                  <div className="project-card-owner">
                    <div className="project-owner-avatar">
                      {project.owner?.name?.charAt(0)}
                    </div>
                    <span className="project-owner-name">{project.owner?.name}</span>
                  </div>
                  <span className="project-card-location">{project.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        {showCreate && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}>
            <div className="modal-content">
              <h2 style={{ fontFamily: 'var(--font-headline)', marginBottom: '1.5rem' }}>{t('projects.create_modal_title')}</h2>
              <form onSubmit={handleCreate} className="create-project-form">
                <div className="auth-field">
                  <label>{t('projects.modal_title')}</label>
                  <input className="input-field" placeholder="e.g., Next-Gen Lunar Rover" value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} required />
                </div>
                <div className="auth-field">
                  <label>{t('projects.modal_desc')}</label>
                  <textarea className="input-field" rows={4} placeholder="Describe the mission objectives..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} required />
                </div>
                <div className="auth-field">
                  <label>{t('projects.modal_skills')}</label>
                  <div className="tags-display">
                    {newProject.requiredSkills.map((s, i) => (
                      <span key={i} className="chip chip-secondary">
                        {s}
                        <button type="button" className="chip-remove"
                          onClick={() => setNewProject({ ...newProject, requiredSkills: newProject.requiredSkills.filter((_, idx) => idx !== i) })}>×</button>
                      </span>
                    ))}
                  </div>
                  <input className="input-field" placeholder="Add skill and press Enter" value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const s = skillInput.trim();
                        if (s && !newProject.requiredSkills.includes(s)) {
                          setNewProject({ ...newProject, requiredSkills: [...newProject.requiredSkills, s] });
                        }
                        setSkillInput('');
                      }
                    }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="auth-field">
                    <label>{t('projects.modal_budget')}</label>
                    <input className="input-field" placeholder="$100k - $500k" value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })} />
                  </div>
                  <div className="auth-field">
                    <label>{t('projects.modal_duration')}</label>
                    <input className="input-field" placeholder="6 Months" value={newProject.duration}
                      onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })} />
                  </div>
                </div>
                <div className="auth-field">
                  <label>{t('projects.modal_location')}</label>
                  <input className="input-field" placeholder="Remote / Hybrid" value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })} />
                </div>
                <div className="auth-actions-row">
                  <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)}>{t('projects.btn_cancel')}</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>{t('projects.btn_launch')}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
