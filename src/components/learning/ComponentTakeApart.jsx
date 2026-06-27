import React, { useState } from 'react';
import { ComponentInside } from './ComponentInside';

export const ComponentTakeApart = ({ component }) => {
  const [isExploded, setIsExploded] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState(null);

  const parts = component.parts || [];
  const selectedPart = parts.find(p => p.id === selectedPartId) || null;

  const handlePartClick = (partId) => {
    if (selectedPartId === partId) {
      setSelectedPartId(null);
    } else {
      setSelectedPartId(partId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Stage Header Info */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
          Interactive Anatomy
        </span>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '4px 0 8px 0' }}>
          Take It Apart
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
          Deconstruct the physical anatomy of the {component.name} to inspect its raw materials, chemical coatings, and engineering design.
        </p>
      </div>

      {/* Main Take Apart Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '20px', 
          alignItems: 'start' 
        }}
      >
        {/* Left Side: Illustration Canvas + Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ComponentInside
            component={component}
            isExploded={isExploded}
            setIsExploded={setIsExploded}
            selectedPartId={selectedPartId}
            onPartClick={handlePartClick}
          />
          {parts.length > 0 && (
            <button
              className={`cta-button ${isExploded ? 'secondary' : ''}`}
              style={{ padding: '10px', fontSize: '12.5px' }}
              onClick={() => setIsExploded(!isExploded)}
            >
              {isExploded ? 'Assemble Component' : 'Explode Component Layers'}
            </button>
          )}
        </div>

        {/* Right Side: Part Inspection Details */}
        <div 
          className="workspace-card"
          style={{ 
            margin: 0, 
            minHeight: '320px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            border: '1px solid rgba(255, 255, 255, 0.03)',
            background: 'rgba(255, 255, 255, 0.005)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-blue)' }}>
              🔬 Material Inspector
            </span>
            {selectedPartId && (
              <button 
                className="product-btn" 
                onClick={() => setSelectedPartId(null)}
                style={{ fontSize: '11px', padding: '4px 8px', minWidth: 'auto' }}
              >
                Reset Inspector
              </button>
            )}
          </div>

          {selectedPart ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.2s ease' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active Layer</span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0 4px 0' }}>
                  {selectedPart.name}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  {selectedPart.description}
                </p>
              </div>

              {selectedPart.cards && selectedPart.cards.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                  {selectedPart.cards.map((card, idx) => (
                    <div 
                      key={idx} 
                      className="learning-card" 
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.008)', 
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        padding: '12px',
                        borderRadius: '8px'
                      }}
                    >
                      <h4 
                        className="learning-card-question" 
                        style={{ fontSize: '11px', color: 'var(--accent-violet)', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                      >
                        {card.question}
                      </h4>
                      <p className="learning-card-answer" style={{ fontSize: '12.5px', color: 'var(--text-primary)', margin: 0, lineHeight: '1.4' }}>
                        {card.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div 
              style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '12px',
                textAlign: 'center',
                padding: '24px',
                color: 'var(--text-muted)'
              }}
            >
              <div style={{ fontSize: '24px' }}>💡</div>
              <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.5', maxWidth: '240px' }}>
                Click any part label or layer on the left model to inspect its properties and purpose.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
