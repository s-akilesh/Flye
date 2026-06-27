import React, { useState, useEffect } from 'react';

export const ComponentApplications = ({ component }) => {
  const apps = component.applications || [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFailMode, setIsFailMode] = useState(false);

  // Reset fail mode when switching applications
  useEffect(() => {
    setIsFailMode(false);
  }, [activeIdx]);

  if (apps.length === 0) return null;

  const selectedApp = apps[activeIdx] || apps[0];
  const appRole = (selectedApp.role || '').toLowerCase();
  const componentSlug = (component.slug || '').toLowerCase();

  // Helper to determine active highlights
  const getHighlightFamily = () => {
    if (componentSlug.includes('capacitor')) return 'capacitor';
    if (componentSlug.includes('resistor')) return 'resistor';
    if (componentSlug.includes('led') || componentSlug.includes('diode')) return 'led-diode';
    return 'none';
  };

  const highlightFamily = getHighlightFamily();



  // Render Interactive Circuit Simulation
  const renderCircuitSimulation = () => {
    // 1. LED PROTECTION (Resistor App)
    if (appRole.includes('led protection') || selectedApp.id === 'arduino' && componentSlug.includes('resistor')) {
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          {/* Battery source */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '24px' }}>🔋</div>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>9V Battery</span>
          </div>

          {/* Connection wires & Resistor */}
          <div style={{ position: 'relative', width: '120px', height: '2px', background: 'rgba(255,255,255,0.1)' }}>
            {!isFailMode ? (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '-10px', 
                  left: '30%', 
                  width: '32px', 
                  height: '20px', 
                  background: 'linear-gradient(90deg, #d8b4fe, #a855f7)',
                  borderRadius: '4px',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: '#fff'
                }}
              >
                1kΩ
              </div>
            ) : (
              <div style={{ position: 'absolute', top: '-1px', left: '10%', right: '10%', height: '3px', background: 'var(--accent-red)', boxShadow: '0 0 8px var(--accent-red)' }} />
            )}

            {/* Moving electrons */}
            <div 
              style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isFailMode ? 'var(--accent-red)' : 'var(--accent-violet)',
                boxShadow: isFailMode ? '0 0 8px var(--accent-red)' : '0 0 6px var(--accent-violet)',
                animation: isFailMode ? 'flowElectronFast 0.4s infinite linear' : 'flowElectronNormal 1.5s infinite linear'
              }}
            />
          </div>

          {/* LED Output */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            {!isFailMode ? (
              <>
                <div style={{ fontSize: '26px', filter: 'drop-shadow(0 0 8px var(--accent-emerald))', animation: 'pulseGlow 2s infinite ease-in-out' }}>🟢</div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--accent-emerald)' }}>Safe Glow ✓</span>
              </>
            ) : (
              <>
                <div style={{ fontSize: '26px', animation: 'explodeFlash 0.3s infinite alternate' }}>💥</div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--accent-red)' }}>BURNED OUT! ⚠️</span>
              </>
            )}
          </div>
        </div>
      );
    }

    // 2. PULL-UP RESISTOR (Resistor App)
    if (appRole.includes('pull-up') || selectedApp.id === 'phone-charger' && componentSlug.includes('resistor')) {
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          {/* VCC / High Rail */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>VCC (5V)</div>
            <div style={{ fontSize: '20px' }}>⚡</div>
          </div>

          {/* Pull-Up Path */}
          <div style={{ position: 'relative', width: '140px', height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <path d="M 0,10 H 15 V 30 H 125" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
              <path d="M 70,30 V 55" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
            </svg>

            {/* Resistor position */}
            {!isFailMode ? (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  left: '5px', 
                  width: '20px', 
                  height: '20px', 
                  background: 'linear-gradient(90deg, #93c5fd, #3b82f6)',
                  borderRadius: '3px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                10k
              </div>
            ) : (
              <div style={{ position: 'absolute', top: '20px', left: '15px', transform: 'translate(-50%, -50%)', fontSize: '12px' }}>❌</div>
            )}

            {/* Switch representation */}
            <div style={{ position: 'absolute', bottom: '0px', left: '70px', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '16px' }}>🔘</div>
              <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>Switch (Open)</span>
            </div>
          </div>

          {/* Microcontroller Signal Readout */}
          <div className="workspace-card" style={{ padding: '8px 12px', margin: 0, border: '1px solid var(--border-subtle)', background: 'rgba(3,3,5,0.8)', textAlign: 'center', minWidth: '100px' }}>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>MCU Pin Reading</span>
            {!isFailMode ? (
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-blue)', marginTop: '4px', animation: 'pulseGlow 2s infinite ease-in-out' }}>
                🟢 HIGH (5V)
              </div>
            ) : (
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-red)', marginTop: '4px', animation: 'floatingSignal 0.5s infinite linear' }}>
                ❓ FLOATING (?V)
              </div>
            )}
          </div>
        </div>
      );
    }

    // 3. VOLTAGE DIVIDER (Resistor App)
    if (appRole.includes('divider') || selectedApp.id === 'amplifier' && componentSlug.includes('resistor')) {
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          {/* High Voltage source */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-red)' }}>10V INPUT</div>
            <div style={{ fontSize: '20px' }}>🔌</div>
          </div>

          {/* Divider Network */}
          <div style={{ position: 'relative', width: '110px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <line x1="10" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            </svg>
            {!isFailMode ? (
              <div style={{ display: 'flex', gap: '8px', zIndex: 2 }}>
                <div style={{ padding: '4px 6px', background: 'var(--accent-violet)', borderRadius: '3px', fontSize: '9px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' }}>R1</div>
                <div style={{ padding: '4px 6px', background: 'var(--accent-violet)', borderRadius: '3px', fontSize: '9px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' }}>R2</div>
              </div>
            ) : (
              <div style={{ color: 'var(--accent-red)', fontWeight: 'bold', zIndex: 2 }}>
                ⚠️ R2 MISSING
              </div>
            )}
          </div>

          {/* Sensitive Chip Pin */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ fontSize: '22px' }}>📟</div>
            {!isFailMode ? (
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(52,211,153,0.1)', color: 'var(--accent-emerald)', border: '1px solid rgba(52,211,153,0.2)', fontWeight: 'bold' }}>
                Safe (5V) ✓
              </span>
            ) : (
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', border: '1px solid rgba(239,68,68,0.2)', fontWeight: 'bold', animation: 'explodeFlash 0.3s infinite alternate' }}>
                OVERVOLTAGE! 💥
              </span>
            )}
          </div>
        </div>
      );
    }

    // 4. POWER SMOOTHING (Capacitor App)
    if (appRole.includes('smoothing') || selectedApp.id === 'phone-charger' && componentSlug.includes('capacitor')) {
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          {/* Jagged Input wave */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Input AC Ripple</span>
            <svg width="60" height="30" stroke="var(--accent-red)" strokeWidth="2" fill="none">
              <path d="M 0,15 L 10,5 L 20,25 L 30,5 L 40,25 L 50,5 L 60,15" />
            </svg>
          </div>

          {/* Filtering capacitor */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            {!isFailMode ? (
              <>
                <div style={{ fontSize: '22px', animation: 'pulseGlow 2s infinite ease-in-out' }}>🔋</div>
                <span style={{ fontSize: '9px', color: 'var(--accent-violet)', fontWeight: 'bold' }}>Capacitor Connected</span>
              </>
            ) : (
              <>
                <div style={{ fontSize: '22px', opacity: 0.2 }}>🔋</div>
                <span style={{ fontSize: '9px', color: 'var(--accent-red)', fontWeight: 'bold' }}>FILTER REMOVED</span>
              </>
            )}
          </div>

          {/* Smooth Output DC */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Output Voltage</span>
            {!isFailMode ? (
              <svg width="60" height="30" stroke="var(--accent-emerald)" strokeWidth="2.5" fill="none">
                <line x1="0" y1="15" x2="60" y2="15" />
              </svg>
            ) : (
              <svg width="60" height="30" stroke="var(--accent-red)" strokeWidth="2" fill="none" style={{ animation: 'floatingSignal 0.5s infinite linear' }}>
                <path d="M 0,15 L 10,5 L 20,25 L 30,5 L 40,25 L 50,5 L 60,15" />
              </svg>
            )}
          </div>
        </div>
      );
    }

    // Default general placeholder animation if no specific matches
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <div style={{ fontSize: '32px', animation: isFailMode ? 'floatingSignal 0.5s infinite ease-in-out' : 'pulseGlow 2s infinite ease-in-out' }}>
          {isFailMode ? '⚠️' : '⚡'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: isFailMode ? 'var(--accent-red)' : 'var(--accent-violet)' }}>
            Circuit: {isFailMode ? 'Unprotected / Failed State' : 'Normal / Protected State'}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            {isFailMode ? 'Component is missing or broken. System experiences errors.' : 'Component operates correctly. Circuits run safely.'}
          </span>
        </div>
      </div>
    );
  };

  const appTitleClean = selectedApp.title || selectedApp.role || 'Application';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
          Real-World Applications
        </span>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '4px 0 8px 0' }}>
          Where You See This
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
          Explore where the {component.name} is used in everyday devices. Click a product to review its role and fail-states.
        </p>
      </div>

      {/* Main Grid: Products list on left, detailed review on right */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px', 
          alignItems: 'start' 
        }}
      >
        {/* Left Side: Product grid buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          {apps.map((app, idx) => {
            const isSelected = idx === activeIdx;
            const displayName = app.title || app.role || app.id;
            return (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--accent-violet)' : 'rgba(255, 255, 255, 0.04)',
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(3, 3, 5, 0.4) 100%)' 
                    : 'rgba(255,255,255,0.005)',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 200ms ease',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  justifyContent: 'space-between',
                  textAlign: 'left'
                }}
                className="app-grid-btn"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {displayName}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: isSelected ? 'var(--accent-violet)' : 'var(--text-muted)' }}>
                  {isSelected ? 'Active ➔' : 'Inspect'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Fail-State Analyzer panel */}
        <div 
          className="workspace-card"
          style={{ 
            margin: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            border: '1px solid rgba(255,255,255,0.03)',
            background: 'rgba(255,255,255,0.005)'
          }}
        >
          {/* Header Title & Selector */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-blue)' }}>
                🔍 Fail-State Analyzer
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '2px 0 0 0' }}>
                {appTitleClean}
              </h3>
            </div>

            {/* Mode switch toggle buttons */}
            <div style={{ display: 'flex', background: 'rgba(3,3,5,0.6)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '3px' }}>
              <button
                onClick={() => setIsFailMode(false)}
                style={{
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  background: !isFailMode ? 'var(--accent-emerald)' : 'transparent',
                  color: !isFailMode ? '#fff' : 'var(--text-muted)'
                }}
              >
                Normal
              </button>
              <button
                onClick={() => setIsFailMode(true)}
                style={{
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  background: isFailMode ? 'var(--accent-red)' : 'transparent',
                  color: isFailMode ? '#fff' : 'var(--text-muted)'
                }}
              >
                Failure
              </button>
            </div>
          </div>

          {/* Interactive Circuit Simulation Window */}
          <div 
            style={{ 
              height: '110px', 
              background: 'rgba(3, 3, 5, 0.7)', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            {renderCircuitSimulation()}
          </div>

          {/* Text descriptions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Why Here */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div 
                style={{ 
                  background: 'rgba(52, 211, 153, 0.1)', 
                  color: 'var(--accent-emerald)', 
                  borderRadius: '6px', 
                  padding: '6px', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                🛡️
              </div>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-emerald)' }}>
                  Why it is here
                </span>
                <p style={{ fontSize: '12.5px', color: 'var(--text-primary)', margin: '2px 0 0 0', lineHeight: '1.4' }}>
                  {selectedApp.whyHere || selectedApp.desc || "Performs stabilization or signal control essential to the core functionality of the device."}
                </p>
              </div>
            </div>

            {/* What happens if it fails */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div 
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  color: 'var(--accent-red, #ef4444)', 
                  borderRadius: '6px', 
                  padding: '6px', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                ⚠️
              </div>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-red, #ef4444)' }}>
                  What happens if it fails
                </span>
                <p style={{ fontSize: '12.5px', color: 'var(--text-primary)', margin: '2px 0 0 0', lineHeight: '1.4' }}>
                  {selectedApp.whatIfFails || "The circuit board will experience instability, low efficiency, or total shutdown due to voltage surges or noise leakage."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS animations */}
      <style>{`
        @keyframes flowElectronNormal {
          0% { left: 5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 95%; opacity: 0; }
        }
        @keyframes flowElectronFast {
          0% { left: 5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 95%; opacity: 0; }
        }
        @keyframes pulseGlow {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; filter: drop-shadow(0 0 8px currentColor); }
          100% { transform: scale(1); opacity: 0.8; }
        }
        @keyframes explodeFlash {
          0% { transform: scale(1); opacity: 0.6; filter: drop-shadow(0 0 4px var(--accent-red)); }
          100% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 12px var(--accent-red)); }
        }
        @keyframes floatingSignal {
          0% { transform: translateY(0); }
          25% { transform: translateY(-2px) translateX(1px); }
          50% { transform: translateY(2px) translateX(-1px); }
          75% { transform: translateY(-1px) translateX(-2px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
