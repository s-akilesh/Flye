import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const ComponentVariants = ({ family, currentSlug }) => {
  const navigate = useNavigate();

  if (!family || !family.variants || family.variants.length <= 1) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
        Component Variants
      </span>
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          background: 'rgba(255, 255, 255, 0.01)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: '12px', 
          padding: '12px' 
        }}
      >
        {family.variants.map((v) => {
          const isActive = v.slug === currentSlug;
          const nameClean = v.name
            .replace(' Capacitor', '')
            .replace(' Resistor', '')
            .replace(' Diode', '')
            .replace('Light Emitting Diode', 'LED');

          return (
            <button
              key={v.slug}
              onClick={() => navigate(`${ROUTES.LEARNING_COMPONENTS}/${v.slug}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isActive ? 'var(--accent-violet)' : 'rgba(255, 255, 255, 0.05)',
                background: isActive 
                  ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.08) 0%, rgba(3, 3, 5, 0.2) 100%)' 
                  : 'rgba(255, 255, 255, 0.015)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 200ms ease'
              }}
              className="variant-row-btn"
            >
              {/* Left Side: Name and indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span 
                  style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: isActive ? 'var(--accent-violet)' : 'transparent',
                    border: !isActive ? '1px solid var(--text-muted)' : 'none'
                  }} 
                />
                <span style={{ fontSize: '13.5px', fontWeight: '750', color: isActive ? '#fff' : 'var(--text-secondary)' }}>
                  {nameClean}
                </span>
              </div>

              {/* Right Side: Inline specs list */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  fontSize: '11px', 
                  color: isActive ? 'var(--text-secondary)' : 'var(--text-muted)' 
                }}
              >
                <span>{v.typicalValue || 'N/A'}</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.1)' }}>|</span>
                <span>{v.polarity || 'Non-polarized'}</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.1)' }}>|</span>
                <span 
                  style={{ 
                    color: v.difficulty === 'Intermediate' 
                      ? 'var(--accent-blue)' 
                      : 'var(--accent-emerald)',
                    fontWeight: '600'
                  }}
                >
                  {v.difficulty || 'Beginner'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
