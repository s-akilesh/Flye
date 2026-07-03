import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

// 1. BeforeYouStartCard
export const BeforeYouStartCard = ({ component }) => (
  <div 
    className="card-glass" 
    style={{ 
      padding: '24px', 
      borderRadius: '12px', 
      border: '1px solid rgba(255, 255, 255, 0.06)',
      background: 'rgba(255, 255, 255, 0.005)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        📋 Before You Start
      </h3>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ {component.estimatedTime || '10 min'} read</span>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '4px' }}>
      <div>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Prerequisites</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {component.prerequisites?.map((prereq, idx) => (
            <span key={idx} style={{ fontSize: '11px', background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.15)', color: 'var(--accent-violet)', padding: '2px 8px', borderRadius: '4px' }}>
              ✓ {prereq}
            </span>
          )) || <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>None</span>}
        </div>
      </div>

      <div>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Learning Objectives</span>
        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {component.learningObjectives?.map((obj, idx) => (
            <li key={idx}>{obj}</li>
          )) || <li>Understand component usage in circuit loops.</li>}
        </ul>
      </div>

      {component.safetyNotes && component.safetyNotes.length > 0 && (
        <div>
          <span style={{ fontSize: '10px', color: 'var(--accent-crimson, #ef4444)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>⚠️ Safety Warning</span>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
            {component.safetyNotes[0]}
          </p>
        </div>
      )}
    </div>
  </div>
);

// 2. ProgressCard
export const ProgressCard = ({ component, isCompleted, xpEarned, hasPassedQuiz, nextComponentSlug }) => {
  const navigate = useNavigate();
  return (
    <div 
      className="card-glass" 
      style={{ 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '9px', fontWeight: '850', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {component.category}
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', margin: '4px 0 0 0', letterSpacing: '-0.4px' }}>
            {component.name}
          </h3>
        </div>
        <span style={{ fontSize: '11px', background: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)', color: isCompleted ? 'var(--accent-emerald)' : '#fbbf24', border: '1px solid currentColor', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
          {isCompleted ? '✓ Completed' : 'In Progress'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>XP Earned</span>
          <span style={{ fontSize: '15px', color: '#fbbf24', fontWeight: '800', display: 'block', marginTop: '4px' }}>
            ⭐ {xpEarned} XP
          </span>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Quiz Challenge</span>
          <span style={{ fontSize: '15px', color: hasPassedQuiz ? 'var(--accent-emerald)' : 'var(--text-secondary)', fontWeight: '800', display: 'block', marginTop: '4px' }}>
            {hasPassedQuiz ? '✓ Passed' : 'Not Started'}
          </span>
        </div>
      </div>

      {nextComponentSlug && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Next Recommended Component:</span>
          <button 
            onClick={() => navigate(`/learning/components/${nextComponentSlug}`)}
            style={{ background: 'transparent', border: 'none', color: 'var(--accent-violet)', fontSize: '11.5px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {nextComponentSlug.replace('-', ' ')} <span className="material-icons" style={{ fontSize: '12px' }}>arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
};

// 3. ComponentExplorer
export const ComponentExplorer = ({ component }) => {
  const [activeMode, setActiveMode] = useState('overview');
  const [selectedPart, setSelectedPart] = useState(null);
  const [currentPulse, setCurrentPulse] = useState(0);
  const [wiringConnected, setWiringConnected] = useState({});

  // Reset selected part when view mode changes
  useEffect(() => {
    setSelectedPart(null);
  }, [activeMode]);

  return (
    <div 
      className="card-glass" 
      style={{ 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      {/* View Mode Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
        {[
          { id: 'overview', label: 'Overview', icon: 'visibility' },
          { id: 'exploded', label: 'Exploded View', icon: 'layers' },
          { id: 'pinout', label: 'Pin Explorer', icon: 'pin' },
          { id: 'circuit', label: 'Circuit Wiring', icon: 'settings_ethernet' }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeMode === mode.id ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.02)',
              border: activeMode === mode.id ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255,255,255,0.04)',
              color: activeMode === mode.id ? 'var(--accent-violet)' : 'var(--text-secondary)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <span className="material-icons" style={{ fontSize: '14px' }}>{mode.icon}</span>
            {mode.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', minHeight: '460px', alignItems: 'center' }}>
        {/* Interactive Explorer Visual Canvas (Full Width column span 12) */}
        <div style={{ gridColumn: 'span 12', height: '100%', minHeight: '460px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', position: 'relative', overflow: 'hidden', padding: '20px' }}>
          
          {/* Mode 1 & 2: Assembled Overview & Exploded Separation Layout */}
          {(activeMode === 'overview' || activeMode === 'exploded') && (
            <div 
              style={{ 
                position: 'relative', 
                width: '100%',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {component.parts?.map((part, idx) => {
                const isSelected = selectedPart?.id === part.id;
                const labelSide = part.labelSide || (idx % 2 === 0 ? 'left' : 'right');
                const partWidth = parseInt(part.visual.width) || 80;
                
                const isInternal = ['film', 'foil', 'oxide', 'electrolyte', 'chip', 'frame'].includes(part.id);
                
                let assembledY = part.visual.assembledY;
                if (activeMode === 'overview') {
                  const slug = (component.slug || '').toLowerCase();
                  if (slug.includes('resistor')) {
                    assembledY = 0;
                  } else if (slug.includes('capacitor')) {
                    if (part.id === 'can') assembledY = -15;
                    else if (part.id === 'seal') assembledY = 26;
                    else if (part.id === 'leads') assembledY = 68;
                  } else if (slug.includes('diode') || slug.includes('led')) {
                    if (part.id === 'dome') assembledY = -20;
                    else if (part.id === 'leads') assembledY = 45;
                  }
                }

                return (
                  <motion.div 
                    layout
                    key={`row-${part.id}`} 
                    animate={{ 
                      y: activeMode === 'exploded' ? part.visual.explodedY : assembledY,
                      opacity: (activeMode === 'overview' && isInternal) ? 0 : 1
                    }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      position: 'absolute',
                      outline: 'none',
                      zIndex: part.visual.zIndex || 1,
                      minHeight: part.visual.height,
                      pointerEvents: (activeMode === 'overview' && isInternal) ? 'none' : 'auto'
                    }}
                  >
                    {/* Left Side Label Block */}
                    {labelSide === 'left' && (
                      <div 
                        style={{ 
                          position: 'absolute',
                          right: `calc(50% + ${(partWidth / 2) + 70}px)`,
                          width: '150px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'flex-end',
                          opacity: activeMode === 'exploded' ? 1 : 0,
                          transition: 'opacity 0.4s ease',
                          pointerEvents: activeMode === 'exploded' ? 'auto' : 'none'
                        }}
                      >
                        <span 
                          style={{ 
                            fontSize: '10px', 
                            fontWeight: '800', 
                            color: '#fff', 
                            background: 'rgba(255,255,255,0.03)', 
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {part.name}
                        </span>
                      </div>
                    )}

                    {/* Left Side Connector line (Dashed Line) */}
                    {labelSide === 'left' && (
                      <div 
                        style={{
                          position: 'absolute',
                          right: `calc(50% + ${(partWidth / 2) + 12}px)`,
                          width: '46px',
                          borderBottom: '1.5px dashed rgba(255, 255, 255, 0.15)',
                          opacity: activeMode === 'exploded' ? 1 : 0,
                          transition: 'opacity 0.4s ease'
                        }}
                      />
                    )}

                    {/* Central Component Layer Box */}
                    <motion.div 
                      onClick={() => activeMode === 'exploded' && setSelectedPart(part)}
                      whileHover={activeMode === 'exploded' ? { scale: 1.05 } : {}}
                      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                      style={{
                        width: part.visual.width,
                        height: part.visual.height,
                        background: part.visual.background,
                        borderRadius: part.visual.borderRadius || '0px',
                        border: activeMode === 'exploded' && isSelected ? '2px solid var(--accent-violet)' : (part.visual.border || '1px solid rgba(255,255,255,0.05)'),
                        boxShadow: activeMode === 'exploded' && isSelected ? '0 0 15px var(--accent-violet)' : (part.visual.boxShadow || 'none'),
                        cursor: activeMode === 'exploded' ? 'pointer' : 'default',
                        zIndex: part.visual.zIndex,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        flexShrink: 0
                      }}
                    />

                    {/* Right Side Connector line (Dashed Line) */}
                    {labelSide === 'right' && (
                      <div 
                        style={{
                          position: 'absolute',
                          left: `calc(50% + ${(partWidth / 2) + 12}px)`,
                          width: '46px',
                          borderBottom: '1.5px dashed rgba(255, 255, 255, 0.15)',
                          opacity: activeMode === 'exploded' ? 1 : 0,
                          transition: 'opacity 0.4s ease'
                        }}
                      />
                    )}

                    {/* Right Side Label Block */}
                    {labelSide === 'right' && (
                      <div 
                        style={{ 
                          position: 'absolute',
                          left: `calc(50% + ${(partWidth / 2) + 70}px)`,
                          width: '150px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'flex-start',
                          opacity: activeMode === 'exploded' ? 1 : 0,
                          transition: 'opacity 0.4s ease',
                          pointerEvents: activeMode === 'exploded' ? 'auto' : 'none'
                        }}
                      >
                        <span 
                          style={{ 
                            fontSize: '10px', 
                            fontWeight: '800', 
                            color: '#fff', 
                            background: 'rgba(255,255,255,0.03)', 
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {part.name}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}



          {/* Mode 5: Pinout diagram explorer */}
          {activeMode === 'pinout' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                {component.pinout?.pins.map((pin, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedPart({ name: pin.name, description: pin.description, details: pin })}
                    style={{
                      padding: '12px 18px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      minWidth: '100px'
                    }}
                  >
                    <span style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold', display: 'block' }}>{pin.name}</span>
                    <span style={{ fontSize: '10px', color: 'var(--accent-violet)', textTransform: 'uppercase', marginTop: '4px', display: 'block' }}>
                      {pin.direction}
                    </span>
                  </motion.div>
                ))}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Click a pin terminal box to view full pin parameters.</span>
            </div>
          )}

          {/* Mode 6: Circuit Connection */}
          {activeMode === 'circuit' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', alignItems: 'center' }}>
              <div 
                className="card-glass" 
                style={{ 
                  width: '90%', 
                  height: '180px', 
                  border: '1px dashed rgba(255,255,255,0.06)', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', gap: '48px', alignItems: 'center', zIndex: 2 }}>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px' }}>
                    Arduino Pin 13
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '6px', border: '1px solid rgba(139, 92, 246, 0.15)', fontSize: '12px', color: 'var(--accent-violet)', fontWeight: 'bold' }}>
                    {component.name}
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px' }}>
                    GND Pin
                  </div>
                </div>
                
                {/* SVG connection lines mapping */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  {wiringConnected.left && (
                    <line x1="25%" y1="50%" x2="45%" y2="50%" stroke="var(--accent-emerald)" strokeWidth="3" strokeDasharray="5,5" />
                  )}
                  {wiringConnected.right && (
                    <line x1="55%" y1="50%" x2="75%" y2="50%" stroke="var(--accent-emerald)" strokeWidth="3" strokeDasharray="5,5" />
                  )}
                </svg>
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={!!wiringConnected.left}
                    onChange={(e) => setWiringConnected(prev => ({ ...prev, left: e.target.checked }))}
                    style={{ accentColor: 'var(--accent-violet)' }}
                  />
                  Connect Input
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={!!wiringConnected.right}
                    onChange={(e) => setWiringConnected(prev => ({ ...prev, right: e.target.checked }))}
                    style={{ accentColor: 'var(--accent-violet)' }}
                  />
                  Connect Ground
                </label>
              </div>
            </div>
          )}

          {/* AR/3D future ready overlay */}
          <div style={{ position: 'absolute', right: '12px', bottom: '12px', display: 'flex', gap: '6px' }}>
            <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
              🔍 AR Ready
            </span>
            <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
              📦 3D View Ready
            </span>
          </div>

          {/* Floating Anatomy Overlay Information Card */}
          <AnimatePresence>
            {selectedPart && (activeMode === 'exploded' || activeMode === 'pinout') && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  background: 'rgba(10, 10, 18, 0.95)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-violet)', margin: 0 }}>
                    {selectedPart.name}
                  </h4>
                  <button 
                    onClick={() => setSelectedPart(null)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    <span className="material-icons" style={{ fontSize: '16px' }}>close</span>
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                  {selectedPart.description}
                </p>
                {selectedPart.cards?.map((card, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '6px 8px', borderRadius: '4px', fontSize: '11px', marginTop: '2px' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>{card.question}</span>
                    <span style={{ color: '#fff', marginLeft: '4px' }}>{card.answer}</span>
                  </div>
                ))}
                {selectedPart.details && (
                  <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
                    <span>Voltage: <strong style={{ color: '#fff' }}>{selectedPart.details.voltage}</strong></span>
                    <span>Type: <strong style={{ color: '#fff' }}>{selectedPart.details.direction}</strong></span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// 4. ComponentComparison
export const ComponentComparison = ({ comparisonList }) => (
  <div 
    className="card-glass" 
    style={{ 
      padding: '24px', 
      borderRadius: '12px', 
      border: '1px solid rgba(255, 255, 255, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}
  >
    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      🔄 Alternative Component Comparisons
    </h3>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
      {comparisonList.map((comp, idx) => (
        <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-violet)', margin: '0 0 8px 0' }}>{comp.name}</h4>
          
          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Pros / Advantages</span>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', color: 'var(--text-secondary)' }}>
                {comp.pros.map((pro, pIdx) => <li key={pIdx}>{pro}</li>)}
              </ul>
            </div>
            <div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Cons / Limitations</span>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', color: 'var(--text-secondary)' }}>
                {comp.cons.map((con, cIdx) => <li key={cIdx}>{con}</li>)}
              </ul>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Ideal For</span>
              <span style={{ color: '#fff', fontSize: '11.5px', marginTop: '2px', display: 'block' }}>{comp.idealFor}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 5. AiLearningAssistant
export const AiLearningAssistant = ({ component }) => {
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: `Hi! I'm your Flyen AI Tutor. Ask me anything about ${component.name}! You can try one of the suggested prompts below.` }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputValue('');
    
    // Simulate smart context response
    setTimeout(() => {
      let reply = `Here is more info on ${component.name}: It is a ${component.category} component designed to operate under typical limits (e.g. ${component.typicalValue || 'standard parameters'}).`;
      if (text.includes(' Arduino')) {
        reply = `Arduino tip for ${component.name}: Always double check standard GPIO declarations and use matching signal bounds in void setup().`;
      } else if (text.includes('Mistakes')) {
        reply = `Common error with ${component.name}: ${component.commonMistakes?.[0]?.question || 'overvoltage'} - ${component.commonMistakes?.[0]?.answer || 'check limits'}`;
      }
      setMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    }, 800);
  };

  return (
    <div 
      className="card-glass" 
      style={{ 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        🤖 AI Learning Assistant
      </h3>

      <div style={{ height: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? 'var(--accent-violet)' : 'rgba(255,255,255,0.04)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              maxWidth: '80%',
              fontSize: '12.5px',
              lineHeight: '1.4'
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Suggested Prompts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {component.aiSuggestedQuestions?.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            style={{
              fontSize: '11px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              color: 'var(--text-secondary)',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            className="btn-prev-hover"
          >
            {q}
          </button>
        )) || (
          <>
            <button onClick={() => handleSend('Explain in Simple English')} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Explain in Simple English</button>
            <button onClick={() => handleSend('Show Arduino Example')} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Show Arduino Example</button>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a custom question..."
          style={{
            flexGrow: 1,
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '6px',
            color: '#fff',
            padding: '8px 12px',
            fontSize: '13px'
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
        />
        <button 
          onClick={() => handleSend(inputValue)}
          style={{ background: 'var(--accent-violet)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

// 6. BuildItYourselfCard
export const BuildItYourselfCard = ({ challenge, slug }) => {
  const [claimed, setClaimed] = useState(() => {
    return localStorage.getItem(`flyen_completed_${slug}`) === 'true';
  });

  // Keep state synced on route changes
  useEffect(() => {
    setClaimed(localStorage.getItem(`flyen_completed_${slug}`) === 'true');
  }, [slug]);

  if (!challenge) return null;

  return (
    <div 
      className="card-glass" 
      style={{ 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px solid rgba(16, 185, 129, 0.15)',
        background: 'rgba(16, 185, 129, 0.01)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '9px', fontWeight: '850', color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            ⭐ Signature Practical Challenge
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', margin: '4px 0 0 0' }}>
            Build It Yourself
          </h3>
        </div>
        {claimed && (
          <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
            ✓ Challenge Completed
          </span>
        )}
      </div>

      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
        {challenge.objective}
      </p>

      {/* Metadata panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px' }}>
        <div>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Difficulty</span>
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold', display: 'block', marginTop: '2px' }}>{challenge.difficulty}</span>
        </div>
        <div>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Time Estimate</span>
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold', display: 'block', marginTop: '2px' }}>⏱️ {challenge.estimatedTime}</span>
        </div>
        <div>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Reward</span>
          <span style={{ fontSize: '13px', color: '#fbbf24', fontWeight: 'bold', display: 'block', marginTop: '2px' }}>⭐ +{challenge.xpReward} XP</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <Link 
          to={`/learning/components/${slug}/build`}
          className="product-btn"
          style={{ 
            background: 'var(--accent-emerald)', 
            border: 'none', 
            color: '#fff', 
            textDecoration: 'none',
            padding: '10px 24px', 
            borderRadius: '6px', 
            fontWeight: 'bold', 
            fontSize: '13px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px' 
          }}
        >
          {claimed ? 'Launch Lab Guide' : 'Start Build Challenge'} <span className="material-icons" style={{ fontSize: '16px' }}>arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};
