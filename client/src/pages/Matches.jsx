import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { matchesAPI } from '../api';
import Sidebar from '../components/Sidebar';
import './Matches.css';

export default function Matches() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [matches, setMatches] = useState({ users: [], projects: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadMatches(); }, []);

  const loadMatches = async () => {
    try {
      const res = await matchesAPI.getAll();
      setMatches(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const allMatches = [
    ...(matches.users || []).map(m => ({ ...m, matchType: 'user' })),
    ...(matches.projects || []).map(m => ({ ...m, matchType: 'project' }))
  ]
    .filter(m => filter === 'all' || (filter === 'users' && m.matchType === 'user') || (filter === 'projects' && m.matchType === 'project'))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="page-with-sidebar">
      <Sidebar />
      <main className="page-content">
        <div className="matches-header animate-fade-in">
          <p className="label-sm label-primary">{t('matches.engine_label')}</p>
          <h1>{t('matches.title')}</h1>
          <p className="matches-subtitle">{t('matches.subtitle')}</p>
          <div className="matches-filters">
            <span className="label-xs">{t('matches.active_filters')}</span>
            {['all', 'users', 'projects'].map(f => (
              <button key={f} className={`chip ${filter === f ? 'chip-primary' : 'chip-outline'}`}
                onClick={() => setFilter(f)}>
                {f === 'all' ? t('matches.filter_all') : f === 'users' ? t('matches.filter_people') : t('matches.filter_projects')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-placeholder">{t('matches.loading')}</div>
        ) : allMatches.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--outline)', marginBottom: '1rem' }}>hub</span>
            <h3>{t('matches.no_matches')}</h3>
            <p style={{ color: 'var(--on-surface-variant)', marginTop: '0.5rem' }}>{t('matches.no_matches_desc')}</p>
            <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/profile')}>{t('matches.btn_update_prof')}</button>
          </div>
        ) : (
          <>
            <div className="matches-grid">
              {allMatches.map((match, i) => {
                const name = match.matchType === 'user' ? match.user?.name : match.project?.title;
                const subtitle = match.matchType === 'user' ? match.user?.title : match.project?.location;
                const skills = match.matchType === 'user' ? match.user?.skills : match.project?.requiredSkills;
                const id = match.matchType === 'user' ? match.user?._id : match.project?._id;

                return (
                  <div key={i} className="card match-detail-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="match-detail-top">
                      <div className="match-detail-avatar">
                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '1.5rem' }}>
                          {match.matchType === 'user' ? 'person' : 'rocket_launch'}
                        </span>
                      </div>
                      <div className="match-detail-info">
                        <h3>{name}</h3>
                        <p>{subtitle}</p>
                      </div>
                      <div className="score-badge">{match.score}%</div>
                    </div>
                    <div className="match-detail-tags">
                      {match.score >= 70 && <span className="chip chip-primary">AI-MATCHED</span>}
                      {skills?.slice(0, 2).map((s, j) => (
                        <span key={j} className="chip chip-outline">{s}</span>
                      ))}
                    </div>
                    {match.breakdown && (
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', padding: '0.5rem', background: 'var(--surface-variant)', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--primary)' }}>code</span>
                          {match.breakdown.skills}%
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--tertiary)' }}>favorite</span>
                          {match.breakdown.interests}%
                        </div>
                        {match.matchType === 'user' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--secondary)' }}>work</span>
                            {match.breakdown.experience}%
                          </div>
                        )}
                      </div>
                    )}
                    <div className="match-why-card">
                      <div className="match-why-header">
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--tertiary)' }}>auto_awesome</span>
                        <span className="label-xs">{t('matches.why_match')}</span>
                      </div>
                      <p>{match.reason}</p>
                    </div>
                    <button className="btn-secondary match-detail-btn"
                      onClick={() => navigate(match.matchType === 'user' ? `/users/${id}` : `/projects/${id}`)}>
                      {match.matchType === 'user' ? t('matches.btn_connect_user') : t('matches.btn_view_project')}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Section */}
            <div className="matches-bottom animate-fade-in">
              <div className="card matches-chart-card">
                <div className="matches-chart-header">
                  <div>
                    <h3>{t('matches.chart_title')}</h3>
                    <p>{t('matches.chart_desc')}</p>
                  </div>
                  <span className="label-sm" style={{ color: '#22c55e' }}>+12% ACCURACY</span>
                </div>
                <div className="matches-chart-bars">
                  {[45, 55, 65, 82].map((h, i) => (
                    <div key={i} className="chart-bar-col">
                      <div className="chart-bar" style={{ height: `${h}%`, background: i === 3 ? 'var(--primary)' : 'var(--secondary-container)', animationDelay: `${i * 0.15}s` }}></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-elevated matches-refine-card orbital-gradient" style={{ color: 'white' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2rem', opacity: 0.8 }}>settings</span>
                <h3>{t('matches.refine_title')}</h3>
                <p>{t('matches.refine_desc')}</p>
                <button className="upgrade-btn" onClick={() => navigate('/profile')}>{t('matches.refine_btn')}</button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
