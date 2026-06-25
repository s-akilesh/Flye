import React from 'react';

export const ComponentHero = ({ component, isExploded, setIsExploded }) => {
  return (
    <section className="workspace-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-violet, #8b5cf6)' }}>
            {component.category}
          </span>
          <span className={`status-badge ${component.status}`}>
            {component.status === 'completed' && '✓ Completed'}
            {component.status === 'continue' && 'Continue →'}
            {component.status === 'new' && 'New'}
          </span>
        </div>
        
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 12px 0', color: 'var(--text-primary)' }}>
          {component.name}
        </h1>
        
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
          {component.description}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {/* Toggle Take It Apart Mode */}
        {component.parts && component.parts.length > 0 && (
          <button 
            className={`cta-button ${isExploded ? 'secondary' : ''}`}
            onClick={() => setIsExploded(!isExploded)}
          >
            {isExploded ? 'Assemble Component' : 'Take It Apart'}
          </button>
        )}
        
        <button 
          className="cta-button secondary"
          onClick={() => {
            const workingPrincipleEl = document.getElementById('product-applications-section');
            if (workingPrincipleEl) {
              workingPrincipleEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }}
        >
          Working Principle
        </button>
      </div>
    </section>
  );
};
