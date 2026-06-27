import React from 'react';

export const ComponentSpecifications = ({ component }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
        Technical Specifications
      </span>

      <div className="workspace-card" style={{ margin: 0, display: 'flex', gap: '24px', alignItems: 'center' }}>
        {/* Specifications Table */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {component.specs && component.specs.map((spec, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '12.5px', 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.03)', 
                  paddingBottom: '6px' 
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>{spec.label}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '650' }}>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Schematic Symbol Block */}
        {component.symbolSvg && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: '10px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
              Schematic Symbol
            </span>
            <div 
              style={{ 
                width: '90px', 
                height: '90px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--accent-violet)',
                padding: '8px'
              }}
              dangerouslySetInnerHTML={{ __html: component.symbolSvg }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
