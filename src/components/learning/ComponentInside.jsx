import React from 'react';

export const ComponentInside = ({ component, isExploded, setIsExploded, selectedPartId, onPartClick }) => {
  const parts = component.parts || [];

  return (
    <section className="workspace-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div 
        className="illustration-stage" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Toggle Mode indicator overlay */}
        <span 
          style={{ 
            position: 'absolute', 
            top: '16px', 
            right: '16px', 
            fontSize: '10px', 
            color: 'var(--text-tertiary)', 
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            pointerEvents: 'none'
          }}
        >
          Workspace: {isExploded ? 'Exploded View' : 'Assembled View'}
        </span>

        {parts.length > 0 ? (
          <div className="exploded-view-container">
            {/* SVG Connector Lines (render behind labels) */}
            <svg 
              className={`connector-svg ${isExploded ? 'active' : ''}`} 
              style={{ opacity: isExploded ? 1 : 0, transition: 'opacity 0.3s ease' }}
            >
              {parts.map((part) => {
                if (part.connectorY === undefined) return null;
                const isLeft = part.labelSide === 'left';
                const x1 = isLeft ? '30%' : '50%';
                const x2 = isLeft ? '50%' : '70%';
                return (
                  <line 
                    key={part.id}
                    x1={x1} 
                    y1={part.connectorY} 
                    x2={x2} 
                    y2={part.connectorY} 
                    className={`connector-line ${selectedPartId === part.id ? 'selected' : ''}`} 
                  />
                );
              })}
            </svg>

            {/* Dynamic Exploded Layers */}
            {parts.map((part) => {
              if (!part.visual) return null;
              
              const { width, height, borderRadius, background, border, boxShadow, assembledY, explodedY, zIndex, type } = part.visual;
              const yTranslate = isExploded ? explodedY : assembledY;

              return (
                <div 
                  key={part.id}
                  onClick={() => onPartClick(part.id)}
                  className={`exploded-segment ${selectedPartId === part.id ? 'selected' : selectedPartId ? 'dimmed' : ''}`}
                  style={{
                    width,
                    height,
                    borderRadius: borderRadius || '0px',
                    background,
                    border: border || 'none',
                    boxShadow: boxShadow || 'none',
                    transform: `translate(-50%, ${yTranslate}px)`,
                    zIndex: zIndex || 1,
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, filter 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  {/* Predefined custom overlays inside layers */}
                  {type === 'can' && (
                    <div style={{ position: 'absolute', right: '8px', top: 0, width: '10px', height: '100%', background: 'rgba(255, 255, 255, 0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', fontSize: '8px', fontWeight: 'bold', color: '#334155' }}>
                      <span>-</span><span>-</span><span>-</span>
                    </div>
                  )}

                  {type === 'seal' && (
                    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 12px' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#000' }} />
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#000' }} />
                    </div>
                  )}

                  {type === 'leads' && (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      {/* Positive Lead (Longer) */}
                      <div style={{ position: 'absolute', left: '10px', top: 0, width: '3px', height: '70px', background: 'linear-gradient(180deg, #94a3b8, #475569)' }} />
                      {/* Negative Lead (Shorter) */}
                      <div style={{ position: 'absolute', right: '10px', top: 0, width: '3px', height: '52px', background: 'linear-gradient(180deg, #94a3b8, #475569)' }} />
                    </div>
                  )}

                  {type === 'leads_equal' && (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '10px', top: 0, width: '3px', height: '70px', background: 'linear-gradient(180deg, #94a3b8, #475569)' }} />
                      <div style={{ position: 'absolute', right: '10px', top: 0, width: '3px', height: '70px', background: 'linear-gradient(180deg, #94a3b8, #475569)' }} />
                    </div>
                  )}

                  {type === 'leads_axial' && (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      {/* Left Axial Wire */}
                      <div style={{ position: 'absolute', left: '-40px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '3px', background: 'linear-gradient(90deg, #475569, #94a3b8)' }} />
                      {/* Right Axial Wire */}
                      <div style={{ position: 'absolute', right: '-40px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '3px', background: 'linear-gradient(90deg, #94a3b8, #475569)' }} />
                    </div>
                  )}

                  {type === 'leads_potentiometer' && (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      {/* Three legs */}
                      <div style={{ position: 'absolute', left: '8px', top: 0, width: '3px', height: '40px', background: 'linear-gradient(180deg, #94a3b8, #475569)' }} />
                      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, width: '3px', height: '40px', background: 'linear-gradient(180deg, #94a3b8, #475569)' }} />
                      <div style={{ position: 'absolute', right: '8px', top: 0, width: '3px', height: '40px', background: 'linear-gradient(180deg, #94a3b8, #475569)' }} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Part Connector Labels */}
            <div className={`connector-label-wrapper ${isExploded ? 'active' : ''}`}>
              {parts.map((part) => {
                if (part.labelY === undefined) return null;
                const isLeft = part.labelSide === 'left';
                const style = isLeft 
                  ? { left: '8%', top: `${part.labelY}px` } 
                  : { right: '8%', top: `${part.labelY}px` };

                return (
                  <span 
                    key={part.id}
                    onClick={() => onPartClick(part.id)} 
                    className={`connector-label ${selectedPartId === part.id ? 'selected' : ''}`} 
                    style={style}
                  >
                    {part.name}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No interactive illustration layers available for this component.
          </div>
        )}
      </div>
    </section>
  );
};
