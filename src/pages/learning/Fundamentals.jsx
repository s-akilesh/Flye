import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LearningRepository } from '../../data/learning';

export const Fundamentals = () => {
  const navigate = useNavigate();
  const fundamentals = useMemo(() => LearningRepository.getFundamentals(), []);

  return (
    <div style={{ paddingBottom: 'var(--space-8)' }}>
      {/* Page Header */}
      <div className="workspace-page-header" style={{ marginBottom: '32px' }}>
        <h1>Electrical Basics</h1>
        <p>Master core electrical concepts visually using everyday analogies before exploring components.</p>
      </div>

      {/* Grid of 9 Lessons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
        {fundamentals.map((concept, idx) => {
          return (
            <div 
              key={concept.id}
              className="workspace-card app-grid-btn"
              style={{
                gridColumn: 'span 4',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                background: 'rgba(255,255,255,0.005)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                minHeight: '160px',
                transition: 'all 200ms ease'
              }}
              onClick={() => navigate(`/learning/fundamentals/${concept.slug}`)}
            >
              <div>
                {/* Number indicator */}
                <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-violet)', letterSpacing: '0.5px' }}>
                  Lesson {idx + 1}
                </span>

                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '4px 0 8px 0', color: '#fff' }}>
                  {concept.name}
                </h3>
                
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                  {concept.description}
                </p>
              </div>

              {/* Card Footer badges */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '2px 6px', borderRadius: '4px' }}>
                  ⏱️ {concept.learningTime}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '2px 6px', borderRadius: '4px' }}>
                  {concept.difficulty}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
