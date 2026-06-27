import React from 'react';

export const ComponentHero = ({ component, onPrerequisiteClick }) => {
  const mission = component.mission || "Master the fundamentals of this component and its applications.";
  const prerequisites = component.prerequisites || [];
  const outcomes = component.learningOutcomes || [];

  // Helper to format prerequisite IDs to readable text
  const formatPrereq = (id) => {
    return id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Today's Mission Banner */}
      <div 
        className="card-glass" 
        style={{ 
          padding: '20px', 
          borderRadius: '12px', 
          border: '1px solid rgba(139, 92, 246, 0.25)', 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(3, 3, 5, 0.4) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div 
            style={{ 
              background: 'rgba(139, 92, 246, 0.15)', 
              color: 'var(--accent-violet)', 
              borderRadius: '8px', 
              padding: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0
            }}
          >
            🎯
          </div>
          <div>
            <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-violet)' }}>
              Today's Mission
            </span>
            <p style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-primary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
              {mission}
            </p>
          </div>
        </div>
      </div>

      {/* Prerequisites & Outcomes Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Prerequisites */}
        <div className="workspace-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: 0 }}>
          <h3 style={{ fontSize: '11px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', margin: 0 }}>
            Prerequisites
          </h3>
          {prerequisites.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {prerequisites.map((prereq, index) => (
                <button
                  key={index}
                  className="product-btn"
                  onClick={() => onPrerequisiteClick && onPrerequisiteClick(prereq)}
                  style={{ 
                    fontSize: '12px', 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>🔗</span> {formatPrereq(prereq)}
                </button>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
              None. Suitable for absolute beginners!
            </p>
          )}
        </div>

        {/* Outcomes Checklist */}
        <div className="workspace-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: 0 }}>
          <h3 style={{ fontSize: '11px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', margin: 0 }}>
            Learning Outcomes
          </h3>
          {outcomes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {outcomes.map((outcome, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-emerald)', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{outcome}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
              Build core electronics understanding and circuit diagnostics.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
