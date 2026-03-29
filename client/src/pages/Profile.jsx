import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../api';
import Sidebar from '../components/Sidebar';
import './Profile.css';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  // Helpers for nested fields
  const addExperience = () => {
    const newExp = { title: '', company: '', description: '', startYear: 2024, current: true };
    setEditForm({ ...editForm, experience: [newExp, ...(editForm.experience || [])] });
  };

  const removeExperience = (index) => {
    const newList = [...editForm.experience];
    newList.splice(index, 1);
    setEditForm({ ...editForm, experience: newList });
  };

  const updateExperience = (index, field, value) => {
    const newList = [...editForm.experience];
    newList[index] = { ...newList[index], [field]: value };
    setEditForm({ ...editForm, experience: newList });
  };

  const addLanguage = () => {
    const newLang = { name: '', level: 'Native' };
    setEditForm({ ...editForm, languages: [...(editForm.languages || []), newLang] });
  };

  const removeLanguage = (index) => {
    const newList = [...editForm.languages];
    newList.splice(index, 1);
    setEditForm({ ...editForm, languages: newList });
  };

  const updateLanguage = (index, field, value) => {
    const newList = [...editForm.languages];
    newList[index] = { ...newList[index], [field]: value };
    setEditForm({ ...editForm, languages: newList });
  };

  const isOwnProfile = !id || id === currentUser?._id;
  const profileId = id || currentUser?._id;

  useEffect(() => {
    if (profileId) loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    try {
      const res = await usersAPI.getById(profileId);
      setProfile(res.data);
      setEditForm(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      const res = await usersAPI.update(profileId, {
        name: editForm.name,
        title: editForm.title,
        bio: editForm.bio,
        skills: editForm.skills,
        interests: editForm.interests,
        location: editForm.location,
        website: editForm.website,
        experienceLevel: editForm.experienceLevel,
        orbitExperience: editForm.orbitExperience,
        socialLinks: editForm.socialLinks,
        languages: editForm.languages,
        experience: editForm.experience
      });
      setProfile(res.data);
      if (isOwnProfile) updateUser(res.data);
      setEditing(false);
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="page-with-sidebar"><Sidebar /><main className="page-content"><div className="loading-placeholder">{t('profile.loading')}</div></main></div>;
  if (!profile) return <div className="page-with-sidebar"><Sidebar /><main className="page-content"><h2>{t('profile.not_found')}</h2></main></div>;

  return (
    <div className="page-with-sidebar">
      <Sidebar />
      <main className="page-content">
        <div className="profile-grid">
          {/* Profile Header */}
          <div className="card profile-header-card animate-fade-in">
            <div className="profile-header-top">
              <div className="profile-avatar-lg orbital-gradient">
                <span style={{ color: 'white', fontSize: '2.5rem', fontFamily: 'var(--font-headline)', fontWeight: 700 }}>
                  {profile.name?.charAt(0)}
                </span>
                {profile.isAvailable && <div className="profile-status-dot"></div>}
              </div>
              <div className="profile-header-info">
                {editing ? (
                  <input className="input-field" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                ) : (
                  <h1>{profile.name}</h1>
                )}
                {editing ? (
                  <>
                    <input className="input-field" value={editForm.title || ''} placeholder="Your title"
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                    <select className="input-field" style={{ marginTop: '0.5rem' }} value={editForm.experienceLevel || 'Mid-Level'}
                      onChange={(e) => setEditForm({ ...editForm, experienceLevel: e.target.value })}>
                      <option value="Junior">Junior</option>
                      <option value="Mid-Level">Mid-Level</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </>
                ) : (
                  <p className="profile-title-text">{profile.title}</p>
                )}
                {editing ? (
                   <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center' }}>
                     <span className="material-symbols-outlined" style={{ fontSize: '1rem', marginRight: '0.5rem' }}>public</span>
                     <input className="input-field" value={editForm.orbitExperience || ''} placeholder="Orbit Experience"
                       onChange={(e) => setEditForm({ ...editForm, orbitExperience: e.target.value })} />
                   </div>
                ) : profile.orbitExperience && (
                  <p className="profile-title-text" style={{marginTop: '0.25rem', color: 'var(--primary)', fontWeight: 500}}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'text-bottom', marginRight: '0.25rem' }}>public</span>
                    Yörünge Deneyimi: {profile.orbitExperience}
                  </p>
                )}
                <div className="profile-badges">
                  {profile.isAvailable && <span className="chip chip-outline">{t('profile.badge_available')}</span>}
                  {profile.isVerified && <span className="chip chip-secondary">{t('profile.badge_verified')}</span>}
                </div>
              </div>
            </div>
            {editing ? (
              <textarea className="input-field" rows={3} value={editForm.bio || ''}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} />
            ) : (
              <p className="profile-bio">{profile.bio}</p>
            )}
            <div className="profile-contact">
              <span className="profile-contact-item">
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>location_on</span>
                {editing ? <input className="input-field" style={{ padding: '0.5rem' }} value={editForm.location || ''} placeholder="Location"
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} /> : profile.location}
              </span>

              <span className="profile-contact-item">
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>public</span>
                {editing ? <input className="input-field" style={{ padding: '0.5rem' }} value={editForm.website || ''} placeholder="Website"
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })} /> : profile.website}
              </span>

              <span className="profile-contact-item">
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>mail</span>
                {profile.email}
              </span>

              <span className="profile-contact-item">
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>work</span>
                {editing ? <input className="input-field" style={{ padding: '0.5rem' }} 
                  value={editForm.socialLinks?.linkedin || ''} placeholder="LinkedIn"
                  onChange={(e) => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, linkedin: e.target.value } })} /> 
                  : (profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin.startsWith('http') ? profile.socialLinks.linkedin : `https://${profile.socialLinks.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>)}
              </span>

              <span className="profile-contact-item">
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>code</span>
                {editing ? <input className="input-field" style={{ padding: '0.5rem' }} 
                  value={editForm.socialLinks?.github || ''} placeholder="GitHub"
                  onChange={(e) => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, github: e.target.value } })} /> 
                  : (profile.socialLinks?.github && <a href={profile.socialLinks.github.startsWith('http') ? profile.socialLinks.github : `https://${profile.socialLinks.github}`} target="_blank" rel="noreferrer">GitHub</a>)}
              </span>

              <span className="profile-contact-item">
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>tag</span>
                {editing ? <input className="input-field" style={{ padding: '0.5rem' }} 
                  value={editForm.socialLinks?.twitter || ''} placeholder="Twitter / X"
                  onChange={(e) => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, twitter: e.target.value } })} /> 
                  : (profile.socialLinks?.twitter && <a href={profile.socialLinks.twitter.startsWith('http') ? profile.socialLinks.twitter : `https://${profile.socialLinks.twitter}`} target="_blank" rel="noreferrer">Twitter / X</a>)}
              </span>
            </div>
            {isOwnProfile && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                {editing ? (
                  <>
                    <button className="btn-primary" onClick={handleSave}>{t('profile.btn_save')}</button>
                    <button className="btn-secondary" onClick={() => { setEditing(false); setEditForm(profile); }}>{t('profile.btn_cancel')}</button>
                  </>
                ) : (
                  <button className="btn-secondary" onClick={() => setEditing(true)}>{t('profile.btn_edit')}</button>
                )}
              </div>
            )}
            {!isOwnProfile && currentUser && (
              <button className="btn-primary" style={{ marginTop: '1rem' }}
                onClick={() => navigate(`/messages?user=${profile._id}`)}>
                {t('profile.btn_msg')}
              </button>
            )}
          </div>

          {/* Synergy Score */}
          <div className="card profile-synergy-card orbital-gradient animate-fade-in animate-fade-in-delay-1">
            <p className="label-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('profile.synergy_label')}</p>
            <div className="synergy-score">94%</div>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', textAlign: 'center' }}>
              {t('profile.synergy_desc')}
            </p>
            <button className="upgrade-btn" style={{ alignSelf: 'center' }}>{t('profile.btn_analysis')}</button>
          </div>

          <div className="card animate-fade-in animate-fade-in-delay-2">
            <div className="section-header" style={{ marginBottom: '1rem' }}>
              <h2>{t('profile.expertise_title')}</h2>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>verified</span>
            </div>
            
            {/* Skills Part */}
            <p className="label-xs" style={{ marginBottom: '0.5rem' }}>Skills</p>
            <div className="profile-skills-list" style={{ marginBottom: '1.5rem' }}>
              {(editing ? editForm.skills : profile.skills)?.map((skill, i) => (
                <span key={i} className="chip chip-secondary" style={{ cursor: editing ? 'pointer' : 'default' }}
                  onClick={() => editing && setEditForm({ ...editForm, skills: editForm.skills.filter((_, idx) => idx !== i) })}>
                  {skill} {editing && '×'}
                </span>
              ))}
              {editing && (
                <input className="input-field" style={{ padding: '0.375rem 0.75rem', width: '12rem' }}
                  placeholder="Add skill + Enter" value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const s = skillInput.trim();
                      if (s && !(editForm.skills || []).includes(s)) setEditForm({ ...editForm, skills: [...(editForm.skills || []), s] });
                      setSkillInput('');
                    }
                  }} />
              )}
            </div>

            {/* Interests Part */}
            <p className="label-xs" style={{ marginBottom: '0.5rem' }}>Interests</p>
            <div className="profile-skills-list">
              {(editing ? editForm.interests : profile.interests)?.map((interest, i) => (
                <span key={i} className="chip chip-outline" style={{ cursor: editing ? 'pointer' : 'default' }}
                  onClick={() => editing && setEditForm({ ...editForm, interests: editForm.interests.filter((_, idx) => idx !== i) })}>
                  {interest} {editing && '×'}
                </span>
              ))}
              {editing && (
                <input className="input-field" style={{ padding: '0.375rem 0.75rem', width: '12rem' }}
                  placeholder="Add interest + Enter" value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const s = interestInput.trim();
                      if (s && !(editForm.interests || []).includes(s)) setEditForm({ ...editForm, interests: [...(editForm.interests || []), s] });
                      setInterestInput('');
                    }
                  }} />
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="card animate-fade-in animate-fade-in-delay-3">
            <div className="section-header" style={{ marginBottom: '1rem' }}>
              <h2>{t('profile.experience_title')}</h2>
              {editing && <button className="btn-ghost" onClick={addExperience}><span className="material-symbols-outlined">add</span></button>}
            </div>
            <div className="profile-experience-list">
              {(editing ? editForm.experience : profile.experience)?.length > 0 ? (
                (editing ? editForm.experience : profile.experience).map((exp, i) => (
                  <div key={i} className="experience-item" style={{ position: 'relative' }}>
                    {editing && (
                      <button className="btn-ghost" style={{ position: 'absolute', right: 0, top: 0, color: 'var(--error)' }} 
                        onClick={() => removeExperience(i)}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    )}
                    <div className="experience-icon">
                      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>
                        {i === 0 ? 'rocket_launch' : i === 1 ? 'construction' : 'science'}
                      </span>
                    </div>
                    <div className="experience-content">
                      {editing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <input className="input-field" value={exp.title || ''} placeholder="Job Title"
                            onChange={(e) => updateExperience(i, 'title', e.target.value)} />
                          <input className="input-field" value={exp.company || ''} placeholder="Company"
                            onChange={(e) => updateExperience(i, 'company', e.target.value)} />
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <input className="input-field" type="number" value={exp.startYear || ''} placeholder="Start Year"
                              onChange={(e) => updateExperience(i, 'startYear', e.target.value)} />
                            <input className="input-field" type="number" value={exp.endYear || ''} placeholder="End Year"
                              disabled={exp.current}
                              onChange={(e) => updateExperience(i, 'endYear', e.target.value)} />
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                              <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(i, 'current', e.target.checked)} />
                              Current
                            </label>
                          </div>
                          <textarea className="input-field" value={exp.description || ''} placeholder="Description"
                            onChange={(e) => updateExperience(i, 'description', e.target.value)} />
                        </div>
                      ) : (
                        <>
                          <div className="experience-header">
                            <h4>{exp.title} — {exp.company}</h4>
                            <span className="experience-dates">{exp.startYear} - {exp.current ? 'Present' : exp.endYear}</span>
                          </div>
                          <p>{exp.description}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--on-surface-variant)' }}>{t('profile.no_exp')}</p>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="card animate-fade-in animate-fade-in-delay-4">
            <div className="section-header" style={{ marginBottom: '1rem' }}>
              <h2>{t('profile.lang_title')}</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: 'var(--outline)' }}>translate</span>
                {editing && <button className="btn-ghost" onClick={addLanguage}><span className="material-symbols-outlined">add</span></button>}
              </div>
            </div>
            <div className="profile-languages">
              {(editing ? editForm.languages : profile.languages)?.map((lang, i) => (
                <div key={i} className="language-item" style={{ marginBottom: editing ? '1rem' : '0.5rem' }}>
                  {editing ? (
                    <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                      <input className="input-field" value={lang.name || ''} placeholder="Language"
                        onChange={(e) => updateLanguage(i, 'name', e.target.value)} />
                      <input className="input-field" value={lang.level || ''} placeholder="Level (e.g. Native)"
                        onChange={(e) => updateLanguage(i, 'level', e.target.value)} />
                      <button className="btn-ghost" style={{ color: 'var(--error)' }} onClick={() => removeLanguage(i)}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="language-name">{lang.name}</span>
                      <span className="chip chip-outline">{lang.level}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
