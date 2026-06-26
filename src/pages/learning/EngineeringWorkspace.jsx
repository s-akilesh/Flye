import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LearningRepository } from '../../data/learning';

export const EngineeringWorkspace = () => {
  const navigate = useNavigate();
  const components = useMemo(() => LearningRepository.getComponents(), []);

  // Filter components with active/continue status
  const continueComponent = useMemo(() => {
    return components.find(c => c.status === 'continue') || components[0];
  }, [components]);

  const recentlyExplored = useMemo(() => {
    return components.filter(c => c.status === 'completed' || c.status === 'continue');
  }, [components]);

  return (
    <div>
      <div className="workspace-page-header">
        <h1>Engineering Workspace</h1>
        <p>Interactive playground to explore and master practical electronics.</p>
      </div>

      <div className="workspace-dashboard-grid">
        {/* Left Column (Main Focus) */}
        <div className="dashboard-hero-section">
          {/* Continue Learning Widget */}
          {continueComponent && (
            <section 
              className="workspace-card continue-learning-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`${ROUTES.LEARNING_COMPONENTS}/${continueComponent.slug}`)}
            >
              <div className="continue-learning-info">
                <span className="continue-learning-tag">Continue learning</span>
                <h3 className="continue-learning-title">{continueComponent.name}</h3>
                <p className="continue-learning-desc">
                  {continueComponent.description} Learn how to take it apart, analyze its internal structure, and see where it is used in real products.
                </p>
              </div>
              <button className="cta-button">
                Resume Exploration →
              </button>
            </section>
          )}

          {/* Recently Explored */}
          <section>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Recently Explored
            </h2>
            <div className="recently-explored-row">
              {recentlyExplored.map((comp) => (
                <div 
                  key={comp.slug} 
                  className="workspace-card"
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer' }}
                  onClick={() => navigate(`${ROUTES.LEARNING_COMPONENTS}/${comp.slug}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)' }}>{comp.category}</span>
                    <span className={`status-badge ${comp.status}`}>
                      {comp.status === 'completed' ? '✓ Mastered' : 'Active'}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>{comp.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    Open Workspace →
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Categories */}
          <section>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Quick Categories
            </h2>
            <div className="recently-explored-row">
              <div 
                className="workspace-card"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px' }}
                onClick={() => navigate(ROUTES.LEARNING_COMPONENTS)}
              >
                <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>Passives</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Resistors, Capacitors, Inductors</p>
              </div>
              <div 
                className="workspace-card"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px' }}
                onClick={() => navigate(ROUTES.LEARNING_COMPONENTS)}
              >
                <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>Semiconductors</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Diodes, Transistors, MOSFETs</p>
              </div>
              <div 
                className="workspace-card"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px' }}
                onClick={() => navigate(ROUTES.LEARNING_COMPONENTS)}
              >
                <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>Integrated Circuits</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Timer ICs, Microcontrollers</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (Sidebar Widgets) */}
        <div className="dashboard-sidebar-section">
          {/* Today's Challenge */}
          <section className="workspace-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(59, 130, 246, 0.02)', borderColor: 'rgba(59, 130, 246, 0.12)' }}>
            <span style={{ fontStyle: 'normal', fontWeight: '700', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-blue)' }}>
              Daily Lab Challenge
            </span>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Identify the Ripple</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                Which internal part of the electrolytic capacitor is grown chemically to act as the dielectric insulator?
              </p>
            </div>
            <button 
              className="cta-button secondary" 
              style={{ alignSelf: 'flex-start', fontSize: '11px', padding: '8px 12px' }}
              onClick={() => navigate(`${ROUTES.LEARNING_COMPONENTS}/electrolytic-capacitor`)}
            >
              Solve Challenge
            </button>
          </section>

          {/* Bookmarks (Placeholder) */}
          <section className="workspace-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: 0.8 }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Pinned Bookmarks
            </h3>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0 }}>
              No pinned items yet. Pin component cards or learning summary guides to access them quickly here.
            </p>
          </section>

          {/* Learning Progress Stats */}
          <section className="workspace-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Learning progress
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Passives</span>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: '750' }}>66%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '66%', height: '100%', background: 'var(--accent-blue)' }} />
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Semiconductors</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '750' }}>0%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '0%', height: '100%', background: 'var(--accent-violet)' }} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
