import React, { useState } from 'react';

export const ComponentRelatedComponents = ({ component }) => {
  const chain = component.relationshipChain || [];
  const connections = component.relatedConnections || [];
  const [activeConnectionIdx, setActiveConnectionIdx] = useState(null);

  if (chain.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
            Circuit Context
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '4px 0 8px 0' }}>
            Component Relationships
          </h2>
        </div>
        <div className="workspace-card" style={{ margin: 0, textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
          No relationships chain mapped for this component yet.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
          Circuit Context
        </span>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '4px 0 8px 0' }}>
          Component Relationships
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
          Electronic components rarely work alone. See how this device integrates with its peers in a standard circuit chain. Click the links below the chain to inspect relations.
        </p>
      </div>

      {/* Horizontal Flow Chain Map */}
      <div 
        className="workspace-card"
        style={{ 
          margin: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          overflowX: 'auto', 
          padding: '24px',
          background: 'rgba(3, 3, 5, 0.4)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          gap: '8px'
        }}
      >
        {chain.map((item, idx) => {
          const isCurrent = item.toLowerCase().includes(component.name.replace(' Capacitor', '').replace(' Resistor', '').toLowerCase());
          
          return (
            <React.Fragment key={idx}>
              {/* Item Card */}
              <div 
                style={{ 
                  padding: '10px 16px', 
                  borderRadius: '8px', 
                  border: '1.5px solid', 
                  borderColor: isCurrent ? 'var(--accent-violet)' : 'rgba(255,255,255,0.06)',
                  background: isCurrent ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255,255,255,0.02)',
                  fontSize: '12.5px',
                  fontWeight: '750',
                  color: isCurrent ? '#fff' : 'var(--text-secondary)',
                  textAlign: 'center',
                  boxShadow: isCurrent ? '0 0 12px rgba(139, 92, 246, 0.15)' : 'none',
                  minWidth: '90px'
                }}
              >
                {item}
              </div>

              {/* Arrow Connection */}
              {idx < chain.length - 1 && (
                <div 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: 'var(--text-tertiary)',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    padding: '0 4px'
                  }}
                >
                  ➔
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Connection details list */}
      {connections.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
            Connection Interactions
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {connections.map((conn, idx) => {
              const isSelected = idx === activeConnectionIdx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveConnectionIdx(isSelected ? null : idx)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--accent-blue)' : 'rgba(255,255,255,0.04)',
                    background: isSelected ? 'rgba(59, 130, 246, 0.03)' : 'rgba(255,255,255,0.005)',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: '750', color: 'var(--text-primary)' }}>
                      {conn.from} ➔ {conn.to}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {isSelected ? 'Collapse ▴' : 'Expand ▾'}
                    </span>
                  </div>
                  <p 
                    style={{ 
                      fontSize: '12px', 
                      color: 'var(--text-secondary)', 
                      margin: 0, 
                      lineHeight: '1.4',
                      maxHeight: isSelected ? '200px' : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 200ms ease',
                      marginTop: isSelected ? '4px' : '0px'
                    }}
                  >
                    {conn.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
