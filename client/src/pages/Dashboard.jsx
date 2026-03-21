import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { matchesAPI, recommendationsAPI } from '../api';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [matches, setMatches] = useState({ users: [], projects: [] });
  const [recommendations, setRecommendations] = useState({ projects: [], people: [], companies: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [matchRes, recRes] = await Promise.all([
        matchesAPI.getAll(),
        recommendationsAPI.getAll()
      ]);
      setMatches(matchRes.data);
      setRecommendations(recRes.data);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const topMatches = [...(matches.users || []), ...(matches.projects || [])]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const missionLog = [
    { icon: 'check_circle', color: 'var(--primary)', title: 'Application viewed', desc: 'A project lead reviewed your profile', time: '2H AGO' },
    { icon: 'hub', color: 'var(--tertiary)', title: 'New Match Identified', desc: 'AI detected a synergy with a new project.', time: '5H AGO' },
    { icon: 'chat', color: 'var(--secondary)', title: 'Message Received', desc: 'You have a new message from a team lead.', time: 'YESTERDAY' },
    { icon: 'sync', color: 'var(--outline)', title: 'Profile Updated', desc: 'You added "Radiation Shielding" to your skills.', time: '2D AGO' },
  ];

  return (
    <div className="page-with-sidebar">
      <Sidebar />
      <main className="page-content">
        <div className="dashboard-header animate-fade-in">
          <p className="label-sm label-primary">{t('dashboard.sys_overview')}</p>
          <h1>{t('dashboard.welcome', { name: user?.name?.split(' ')[0] || 'Commander' })}</h1>
        </div>

        <div className="dashboard-grid">
          {/* Suggested Matches */}
          <div className="dashboard-matches animate-fade-in animate-fade-in-delay-1">
            <div className="section-header">
              <h2>{t('dashboard.suggested_matches')}</h2>
              <button className="btn-ghost" onClick={() => navigate('/matches')}>{t('dashboard.view_all')}</button>
            </div>

            {loading ? (
              <div className="loading-placeholder">{t('dashboard.loading_matches')}</div>
            ) : topMatches.length > 0 ? (
              <div className="match-cards-row">
                {topMatches.slice(0, 2).map((match, i) => (
                  <div key={i} className="card dashboard-match-card">
                    <div className="match-card-header">
                      <div className="match-card-avatar orbital-gradient">
                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '1.25rem' }}>
                          {match.type === 'user' ? 'person' : 'rocket_launch'}
                        </span>
                      </div>
                      <span className={`chip ${match.score >= 70 ? 'chip-primary' : 'chip-secondary'}`}>
                        {match.score >= 70 ? 'AI-MATCHED' : 'PENDING'}
                      </span>
                    </div>
                    <h3 className="match-card-name">
                      {match.type === 'user' ? match.user?.name : match.project?.title}
                    </h3>
                    <p className="match-card-desc">
                      {match.type === 'user' ? match.user?.bio?.substring(0, 100) + '...' : match.project?.description?.substring(0, 100) + '...'}
                    </p>
                    <div className="match-card-tags">
                      {(match.type === 'user' ? match.user?.skills : match.project?.requiredSkills)?.slice(0, 2).map((s, j) => (
                        <span key={j} className="chip chip-outline">{s}</span>
                      ))}
                    </div>
                    <button className="btn-secondary match-card-connect"
                      onClick={() => navigate(match.type === 'user' ? `/users/${match.user?._id}` : `/projects/${match.project?._id}`)}>
                      {t('dashboard.btn_connect')}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--on-surface-variant)' }}>{t('dashboard.no_matches_text')}</p>
                <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/profile')}>
                  {t('dashboard.btn_update_profile')}
                </button>
              </div>
            )}

            {/* Premium Match */}
            {topMatches.length > 0 && topMatches[0].score >= 50 && (
              <div className="card premium-match-card animate-fade-in animate-fade-in-delay-2">
                <div className="premium-match-content">
                  <p className="label-sm label-primary">{t('dashboard.premium_match')}</p>
                  <h3>{topMatches[0].type === 'user' ? topMatches[0].user?.name : topMatches[0].project?.title}</h3>
                  <p className="premium-match-desc">{topMatches[0].reason}</p>
                  <div className="premium-match-actions">
                    <button className="btn-primary" onClick={() => navigate(topMatches[0].type === 'user' ? `/users/${topMatches[0].user?._id}` : `/projects/${topMatches[0].project?._id}`)}>
                      {t('dashboard.apply_priority')}
                    </button>
                    <button className="btn-secondary">{t('dashboard.learn_more')}</button>
                  </div>
                </div>
                <div className="premium-match-score">
                  <div className="score-badge-lg orbital-gradient">{topMatches[0].score}%</div>
                </div>
              </div>
            )}
          </div>

          {/* Mission Log */}
          <div className="dashboard-log animate-fade-in animate-fade-in-delay-3">
            <div className="section-header">
              <h2>{t('dashboard.mission_log')}</h2>
              <button className="btn-ghost" style={{ padding: '0.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>more_horiz</span>
              </button>
            </div>
            <div className="mission-log-list">
              {missionLog.map((item, i) => (
                <div key={i} className="log-item">
                  <div className="log-icon" style={{ color: item.color }}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '1.25rem' }}>{item.icon}</span>
                  </div>
                  <div className="log-content">
                    <p className="log-title">{item.title}</p>
                    <p className="log-desc">{item.desc}</p>
                    <p className="log-time">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
              {t('dashboard.download_report')}
            </button>

            {/* Upgrade Card */}
            <div className="upgrade-card orbital-gradient">
              <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'white', opacity: 0.8 }}>star</span>
              <h3>{t('dashboard.upgrade_title')}</h3>
              <p>{t('dashboard.upgrade_desc')}</p>
              <button className="upgrade-btn">{t('dashboard.upgrade_btn')}</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
