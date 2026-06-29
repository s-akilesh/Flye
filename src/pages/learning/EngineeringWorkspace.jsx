import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LearningRepository } from '../../data/learning';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const EngineeringWorkspace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = !!user;

  const roadmap = useMemo(() => LearningRepository.getRoadmap(), []);

  // Compute overall progress stats based on implemented component statuses
  const progressStats = useMemo(() => {
    const components = LearningRepository.getComponents();
    const completedCount = components.filter(c => c.status === 'completed').length;
    const totalCount = components.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return { completedCount, totalCount, pct };
  }, []);

  const handleComponentClick = (comp, levelIsLocked) => {
    if (levelIsLocked) {
      showToast(`Level ${comp.level || ''} is locked. Log in as admin to unlock this level.`, 'warning');
      return;
    }
    // Navigate directly to the component or fundamental slug
    if (comp.isFundamental) {
      navigate(`/learning/fundamentals/${comp.slug}`);
    } else {
      navigate(`${ROUTES.LEARNING_COMPONENTS}/${comp.slug}`);
    }
  };

  return (
    <div style={{ paddingBottom: 'var(--space-8)' }}>


      {/* Answer Three Questions Callout Banner - 3 Separate Cards */}
      <div className="workspace-info-grid">
        <div className="workspace-info-card violet">
          <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-violet)' }}>
            What am I learning?
          </span>
          <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
            Practical Electronics Engineering, structured as a level-by-level journey from fundamental physics to microcontrollers and advanced AI hardware.
          </p>
        </div>
        
        <div className="workspace-info-card blue">
          <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-blue)' }}>
            Why is it important?
          </span>
          <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
            Understanding individual building blocks conceptually allows you to debug, prototype, and build your own custom hardware systems from scratch.
          </p>
        </div>
        
        <div className="workspace-info-card emerald">
          <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-emerald)' }}>
            What should I learn next?
          </span>
          <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
            Start with <strong>Level 1 — Electrical Basics</strong>. Learn what Voltage and Current are before exploring individual components.
          </p>
        </div>
      </div>

      {/* Progress Dashboard widget */}
      <div 
        className="card-glass" 
        style={{ 
          padding: 'var(--space-4) var(--space-5)', 
          borderRadius: '12px', 
          marginBottom: 'var(--space-6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-4)'
        }}
      >
        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Your Journey Progress
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 0 0', color: '#fff' }}>
            {progressStats.pct}% Core Concepts Mastered
          </h3>
        </div>
        <div style={{ flex: '1', maxWidth: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>{progressStats.completedCount} of {progressStats.totalCount} modules</span>
            <span style={{ color: 'var(--accent-violet)', fontWeight: '700' }}>{progressStats.pct}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progressStats.pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-violet))' }} />
          </div>
        </div>
      </div>

      {/* 2. Timeline Roadmap Layout */}
      <div className="roadmap-timeline" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* Decorative connecting glow line for timeline */}
        <div className="timeline-connector-line" />

        {roadmap.map((lvl) => {
          const isLvl9 = lvl.level === 9;
          const isLocked = !isAdmin && lvl.level >= 3 && lvl.level <= 10;

          return (
            <div 
              key={lvl.level} 
              className="timeline-level-row"
              style={{ 
                opacity: isLocked ? 0.55 : (isLvl9 ? 0.5 : 1)
              }}
            >
              {/* Level Indicator Node */}
              <div 
                className="timeline-level-node"
                style={{ 
                  background: isLocked ? '#0e0f16' : (isLvl9 ? '#06060a' : '#0e0b1c'), 
                  border: `2px solid ${isLocked ? 'rgba(255, 255, 255, 0.1)' : (isLvl9 ? 'var(--border-subtle)' : 'var(--accent-violet)')}`,
                  color: isLocked ? 'var(--text-muted)' : (isLvl9 ? 'var(--text-dim)' : 'var(--text-main)'),
                  boxShadow: (isLocked || isLvl9) ? 'none' : '0 0 15px rgba(139, 92, 246, 0.15)'
                }}
              >
                {isLocked ? (
                  <svg viewBox="0 0 24 24" className="timeline-lock-icon" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ) : (
                  `L${lvl.level}`
                )}
              </div>

              {/* Level Content Card */}
              <div 
                className="card-glass" 
                style={{ 
                  flex: 1, 
                  padding: 'var(--space-5)', 
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)'
                }}
              >
                {/* Level Title, Purpose & Goal */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: isLocked ? 'var(--text-muted)' : '#fff', margin: 0 }}>
                      {lvl.title}
                    </h3>
                    {isLocked && (
                      <span style={{ fontSize: '10px', color: 'var(--accent-violet)', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        LOCKED
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: isLocked ? 'var(--text-dim)' : 'var(--text-secondary)', margin: '6px 0 0 0', lineHeight: '1.4' }}>
                    {lvl.purpose}
                  </p>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '0.5px', color: isLocked ? 'var(--text-muted)' : 'var(--accent-blue)' }}>
                      Goal:
                    </span>
                    <span style={{ fontSize: '12px', color: isLocked ? 'var(--text-dim)' : 'var(--text-muted)' }}>
                      {lvl.learningGoal}
                    </span>
                  </div>
                </div>

                {/* Categories & Components */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 'var(--space-4)' }}>
                  {lvl.categories.map((cat, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: isLocked ? 'var(--text-dim)' : 'var(--text-secondary)' }}>
                        {cat.name}
                      </span>
                      
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {cat.components.map((comp) => (
                          <div
                            key={comp.id}
                            className={`roadmap-badge-chip ${isLocked ? 'locked' : (comp.isImplemented ? 'active' : 'locked')}`}
                            onClick={() => handleComponentClick(comp, isLocked)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              background: isLocked ? 'rgba(255,255,255,0.01)' : (comp.isImplemented ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.005)'),
                              border: `1px solid ${isLocked ? 'rgba(255,255,255,0.02)' : (comp.isImplemented ? 'var(--border-subtle)' : 'rgba(255,255,255,0.03)')}`,
                              cursor: isLocked ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px',
                              minWidth: '140px',
                              maxWidth: '220px',
                              flex: '1 0 140px',
                              transition: 'all 0.2s ease',
                              userSelect: 'none',
                              opacity: isLocked ? 0.6 : 1
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '12px', fontWeight: '700', color: isLocked ? 'var(--text-dim)' : (comp.isImplemented ? 'var(--text-primary)' : 'var(--text-dim)') }}>
                                {comp.name}
                              </span>
                              {!comp.isImplemented && (
                                <span style={{ fontSize: '9px', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.03)', padding: '2px 4px', borderRadius: '4px' }}>
                                  Soon
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {comp.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};
