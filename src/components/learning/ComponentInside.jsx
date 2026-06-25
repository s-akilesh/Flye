import React from 'react';

export const ComponentInside = ({ component, isExploded, setIsExploded, selectedPartId, onPartClick }) => {
  const isCapacitor = component.slug === 'electrolytic-capacitor';
  const isResistor = component.slug === 'fixed-resistor';
  const isLed = component.slug === 'light-emitting-diode';

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

        {/* ─── CASE 1: Electrolytic Capacitor ────────────────────────────────── */}
        {isCapacitor && (
          <div className="exploded-view-container">
            {/* SVG Connector Lines (render in background behind labels but above body) */}
            <svg className={`connector-svg ${isExploded ? 'active' : ''}`} style={{ opacity: isExploded ? 1 : 0, transition: 'opacity 0.3s ease' }}>
              {/* Can Line */}
              <line x1="50%" y1="90" x2="30%" y2="90" className={`connector-line ${selectedPartId === 'can' ? 'selected' : ''}`} />
              {/* Foil Line */}
              <line x1="50%" y1="150" x2="70%" y2="150" className={`connector-line ${selectedPartId === 'foil' ? 'selected' : ''}`} />
              {/* Oxide Line */}
              <line x1="50%" y1="210" x2="30%" y2="210" className={`connector-line ${selectedPartId === 'oxide' ? 'selected' : ''}`} />
              {/* Electrolyte Line */}
              <line x1="50%" y1="270" x2="70%" y2="270" className={`connector-line ${selectedPartId === 'electrolyte' ? 'selected' : ''}`} />
              {/* Rubber Seal Line */}
              <line x1="50%" y1="330" x2="30%" y2="330" className={`connector-line ${selectedPartId === 'seal' ? 'selected' : ''}`} />
              {/* Leads Line */}
              <line x1="50%" y1="390" x2="70%" y2="390" className={`connector-line ${selectedPartId === 'leads' ? 'selected' : ''}`} />
            </svg>

            {/* Exploded Layers */}
            {/* 1. Aluminum Can (Top Layer) */}
            <div 
              onClick={() => onPartClick('can')}
              className={`exploded-segment ${selectedPartId === 'can' ? 'selected' : selectedPartId ? 'dimmed' : ''}`}
              style={{
                width: '64px',
                height: '70px',
                borderRadius: '8px 8px 0 0',
                background: 'linear-gradient(90deg, #475569 0%, #cbd5e1 50%, #64748b 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderBottom: 'none',
                transform: `translate(-50%, ${isExploded ? '-190px' : '-80px'})`,
                zIndex: 6,
                position: 'absolute',
                left: '50%',
                top: '50%',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'
              }}
            >
              {/* Negative Stripe Marker */}
              <div style={{ position: 'absolute', right: '8px', top: 0, width: '10px', height: '100%', background: 'rgba(255, 255, 255, 0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', fontSize: '8px', fontWeight: 'bold', color: '#334155' }}>
                <span>-</span><span>-</span><span>-</span>
              </div>
            </div>

            {/* 2. Aluminum Foil */}
            <div 
              onClick={() => onPartClick('foil')}
              className={`exploded-segment ${selectedPartId === 'foil' ? 'selected' : selectedPartId ? 'dimmed' : ''}`}
              style={{
                width: '56px',
                height: '40px',
                background: 'repeating-linear-gradient(45deg, #94a3b8, #94a3b8 2px, #64748b 2px, #64748b 4px)',
                border: '1.5px solid rgba(255,255,255,0.1)',
                transform: `translate(-50%, ${isExploded ? '-115px' : '-55px'})`,
                zIndex: 5,
                position: 'absolute',
                left: '50%',
                top: '50%',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'
              }}
            />

            {/* 3. Oxide Layer */}
            <div 
              onClick={() => onPartClick('oxide')}
              className={`exploded-segment ${selectedPartId === 'oxide' ? 'selected' : selectedPartId ? 'dimmed' : ''}`}
              style={{
                width: '58px',
                height: '14px',
                background: 'rgba(139, 92, 246, 0.4)',
                border: '1.5px solid var(--accent-violet)',
                boxShadow: '0 0 10px rgba(139, 92, 246, 0.35)',
                transform: `translate(-50%, ${isExploded ? '-55px' : '-35px'})`,
                zIndex: 4,
                position: 'absolute',
                left: '50%',
                top: '50%',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'
              }}
            />

            {/* 4. Electrolyte Paper */}
            <div 
              onClick={() => onPartClick('electrolyte')}
              className={`exploded-segment ${selectedPartId === 'electrolyte' ? 'selected' : selectedPartId ? 'dimmed' : ''}`}
              style={{
                width: '54px',
                height: '40px',
                background: 'linear-gradient(90deg, #b45309 0%, #f59e0b 50%, #d97706 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
                opacity: 0.9,
                transform: `translate(-50%, ${isExploded ? '5px' : '-15px'})`,
                zIndex: 3,
                position: 'absolute',
                left: '50%',
                top: '50%',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'
              }}
            />

            {/* 5. Rubber Seal */}
            <div 
              onClick={() => onPartClick('seal')}
              className={`exploded-segment ${selectedPartId === 'seal' ? 'selected' : selectedPartId ? 'dimmed' : ''}`}
              style={{
                width: '60px',
                height: '24px',
                borderRadius: '4px',
                background: 'linear-gradient(90deg, #1e293b 0%, #334155 50%, #0f172a 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transform: `translate(-50%, ${isExploded ? '75px' : '10px'})`,
                zIndex: 2,
                position: 'absolute',
                left: '50%',
                top: '50%',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'
              }}
            >
              {/* Small holes for leads */}
              <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 12px' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#000' }} />
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#000' }} />
              </div>
            </div>

            {/* 6. Metal Leads */}
            <div 
              onClick={() => onPartClick('leads')}
              className={`exploded-segment ${selectedPartId === 'leads' ? 'selected' : selectedPartId ? 'dimmed' : ''}`}
              style={{
                width: '40px',
                height: '70px',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, ${isExploded ? '150px' : '45px'})`,
                zIndex: 1,
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'
              }}
            >
              {/* Positive Lead (Longer) */}
              <div style={{ position: 'absolute', left: '10px', top: 0, width: '3px', height: '70px', background: 'linear-gradient(180deg, #94a3b8, #475569)' }} />
              {/* Negative Lead (Shorter) */}
              <div style={{ position: 'absolute', right: '10px', top: 0, width: '3px', height: '52px', background: 'linear-gradient(180deg, #94a3b8, #475569)' }} />
            </div>

            {/* Part Labels */}
            <div className={`connector-label-wrapper ${isExploded ? 'active' : ''}`}>
              <span onClick={() => onPartClick('can')} className={`connector-label ${selectedPartId === 'can' ? 'selected' : ''}`} style={{ left: '10%', top: '78px' }}>Aluminum Can</span>
              <span onClick={() => onPartClick('foil')} className={`connector-label ${selectedPartId === 'foil' ? 'selected' : ''}`} style={{ right: '10%', top: '138px' }}>Aluminum Foil</span>
              <span onClick={() => onPartClick('oxide')} className={`connector-label ${selectedPartId === 'oxide' ? 'selected' : ''}`} style={{ left: '10%', top: '198px' }}>Oxide Layer</span>
              <span onClick={() => onPartClick('electrolyte')} className={`connector-label ${selectedPartId === 'electrolyte' ? 'selected' : ''}`} style={{ right: '10%', top: '258px' }}>Electrolyte</span>
              <span onClick={() => onPartClick('seal')} className={`connector-label ${selectedPartId === 'seal' ? 'selected' : ''}`} style={{ left: '10%', top: '318px' }}>Rubber Seal</span>
              <span onClick={() => onPartClick('leads')} className={`connector-label ${selectedPartId === 'leads' ? 'selected' : ''}`} style={{ right: '10%', top: '378px' }}>Metal Leads</span>
            </div>
          </div>
        )}

        {/* ─── CASE 2: Fixed Resistor ────────────────────────────────────────── */}
        {isResistor && (
          <div className="exploded-view-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <svg viewBox="0 0 200 80" width="220" height="90" stroke="currentColor" strokeWidth="2" fill="none" style={{ color: 'var(--accent-blue)' }}>
              {/* Resistor shell drawing */}
              <path d="M 30,40 L 50,40 C 50,30 60,25 70,25 L 130,25 C 140,25 150,30 150,40 L 170,40" strokeWidth="3" />
              <rect x="70" y="25" width="60" height="30" rx="3" fill="rgba(30, 41, 59, 0.8)" />
              {/* Color stripes */}
              <line x1="82" y1="25" x2="82" y2="55" stroke="#f59e0b" strokeWidth="4" />
              <line x1="95" y1="25" x2="95" y2="55" stroke="#8b5cf6" strokeWidth="4" />
              <line x1="108" y1="25" x2="108" y2="55" stroke="#ef4444" strokeWidth="4" />
              <line x1="120" y1="25" x2="120" y2="55" stroke="#d97706" strokeWidth="4" />
            </svg>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px', fontStyle: 'italic' }}>
              Exploded illustration is not active for Fixed Resistor.
            </p>
          </div>
        )}

        {/* ─── CASE 3: LED ───────────────────────────────────────────────────── */}
        {isLed && (
          <div className="exploded-view-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <svg viewBox="0 0 100 100" width="100" height="100" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ color: 'var(--accent-violet)' }}>
              <path d="M 50,20 C 35,20 35,65 35,65 L 65,65 C 65,65 65,20 50,20 Z" fill="rgba(139, 92, 246, 0.1)" />
              <line x1="42" y1="65" x2="42" y2="90" />
              <line x1="58" y1="65" x2="58" y2="80" />
              <path d="M 40,40 L 48,45 L 48,55 M 60,42 L 52,48 L 52,55" strokeWidth="1.5" />
            </svg>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px', fontStyle: 'italic' }}>
              Exploded illustration is not active for LED.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
