import React from 'react';

export const ComponentOverview = ({ component }) => {
  return (
    <section className="workspace-card" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      {/* Spec items list */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>
          Specifications
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {component.specs && component.specs.map((spec, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{spec.label}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '650' }}>{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Symbol Block */}
      {component.symbolSvg && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
            Schematic Symbol
          </span>
          <div 
            style={{ 
              width: '80px', 
              height: '80px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--accent-violet)'
            }}
            dangerouslySetInnerHTML={{ __html: component.symbolSvg }}
          />
        </div>
      )}
    </section>
  );
};
