import React, { useState } from 'react';

export const ComponentWorkingPrinciple = ({ component }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = component.workingSteps || [
    { title: 'Input state', desc: 'Current enters the component through the input lead.' },
    { title: 'Processing', desc: 'The component acts on the current according to its physical properties.' },
    { title: 'Output state', desc: 'The modified current exits to flow through the rest of the circuit.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
          Core Physics
        </span>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '4px 0 8px 0' }}>
          Working Principle
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
          Understand how the {component.name} operates dynamically within a circuit. Click through each phase to observe the physical electron actions.
        </p>
      </div>

      {/* Step Selector Tab Bar */}
      <div 
        style={{ 
          display: 'flex', 
          background: 'rgba(255, 255, 255, 0.01)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: '8px', 
          padding: '4px',
          gap: '4px'
        }}
      >
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                background: isActive ? 'var(--accent-violet)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
            >
              {idx + 1}. {step.title}
            </button>
          );
        })}
      </div>

      {/* Visual Animation + Explanation Card */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px', 
          alignItems: 'center' 
        }}
      >
        {/* Animated representation */}
        <div 
          className="workspace-card"
          style={{ 
            margin: 0, 
            height: '180px', 
            background: 'rgba(3, 3, 5, 0.6)', 
            border: '1px solid var(--border-subtle)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Simple Vector Simulator */}
          <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* Battery Source */}
            <div style={{ position: 'absolute', left: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: activeStep === 2 ? 0.3 : 1 }}>
              <div style={{ fontSize: '20px' }}>🔋</div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Source</span>
            </div>

            {/* Circuit wires */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <line x1="20%" y1="50%" x2="42%" y2="50%" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="58%" y1="50%" x2="80%" y2="50%" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            {/* Capacitor body representation */}
            <div 
              style={{ 
                position: 'absolute', 
                left: '42%', 
                width: '56px', 
                height: '70px', 
                borderLeft: '4px solid var(--accent-blue)', 
                borderRight: '4px solid var(--accent-red)',
                background: 'rgba(255, 255, 255, 0.01)',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 8px',
                boxSizing: 'border-box'
              }}
            >
              {/* Positive Charges */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', color: 'var(--accent-blue)', fontSize: '10px', fontWeight: 'bold' }}>
                <span style={{ opacity: activeStep > 0 ? 1 : 0.1 }}>+</span>
                <span style={{ opacity: activeStep > 0 ? 1 : 0.1 }}>+</span>
                <span style={{ opacity: activeStep > 0 ? 1 : 0.1 }}>+</span>
              </div>
              
              {/* Negative Charges */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', color: 'var(--accent-red)', fontSize: '12px', fontWeight: 'bold' }}>
                <span style={{ opacity: activeStep > 0 ? 1 : 0.1 }}>-</span>
                <span style={{ opacity: activeStep > 0 ? 1 : 0.1 }}>-</span>
                <span style={{ opacity: activeStep > 0 ? 1 : 0.1 }}>-</span>
              </div>
            </div>

            {/* Load / LED */}
            <div style={{ position: 'absolute', right: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div 
                style={{ 
                  fontSize: '20px', 
                  filter: activeStep === 2 ? 'drop-shadow(0 0 10px var(--accent-emerald))' : 'none',
                  opacity: activeStep === 2 ? 1 : 0.3,
                  transition: 'all 0.3s ease'
                }}
              >
                💡
              </div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Load (LED)</span>
            </div>

            {/* Step specific electron flow animations */}
            {activeStep === 0 && (
              <div 
                style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-red)',
                  boxShadow: '0 0 8px var(--accent-red)',
                  left: '20%',
                  top: '48%',
                  animation: 'flowRight 1.5s infinite linear'
                }}
              />
            )}

            {activeStep === 1 && (
              <div 
                style={{
                  position: 'absolute',
                  width: '32px',
                  height: '48px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1.5px solid var(--accent-violet)',
                  boxShadow: '0 0 12px rgba(139, 92, 246, 0.4)',
                  borderRadius: '4px',
                  left: '46%',
                  animation: 'pulseGlow 2s infinite ease-in-out'
                }}
              />
            )}

            {activeStep === 2 && (
              <div 
                style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-red)',
                  boxShadow: '0 0 8px var(--accent-red)',
                  left: '58%',
                  top: '48%',
                  animation: 'flowRightOut 1.5s infinite linear'
                }}
              />
            )}
          </div>
        </div>

        {/* Written Explanation */}
        <div className="workspace-card" style={{ margin: 0, minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-violet)' }}>
            Phase {activeStep + 1}: {steps[activeStep].title}
          </span>
          <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', margin: 0, lineHeight: '1.6' }}>
            {steps[activeStep].desc}
          </p>
        </div>
      </div>

      {/* CSS Animations style block */}
      <style>{`
        @keyframes flowRight {
          0% { left: 20%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 45%; opacity: 0; }
        }
        @keyframes flowRightOut {
          0% { left: 53%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { right: 18%; left: 78%; opacity: 0; }
        }
        @keyframes pulseGlow {
          0% { transform: scale(0.98); opacity: 0.5; }
          50% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(0.98); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
