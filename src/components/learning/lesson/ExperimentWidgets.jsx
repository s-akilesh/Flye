import React, { useState, useEffect, useRef } from 'react';

export const ExperimentWidget = ({ slug }) => {
  const [val, setVal] = useState(5);
  const [val2, setVal2] = useState(5);
  const [activeTab, setActiveTab] = useState('copper');
  const [state1, setState1] = useState(true);
  const [state2, setState2] = useState(true);
  const [state3, setState3] = useState(true);
  const [sparking, setSparking] = useState(false);
  const [gfciState, setGfciState] = useState('safe');
  
  // Animation frame loop for continuous movement
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let anim;
    const run = () => {
      setTick(t => (t + 1) % 360);
      anim = requestAnimationFrame(run);
    };
    anim = requestAnimationFrame(run);
    return () => cancelAnimationFrame(anim);
  }, []);

  const renderWidget = () => {
    switch (slug) {
      case 'what-is-engineering':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="admin-chip active" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => setVal(v => v === 5 ? 15 : 5)}>
                ⚙️ {val === 5 ? 'Speed Up Gears' : 'Normal Speed'}
              </button>
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: `rotate(${tick * (val === 15 ? 3 : 1)}deg)`, transition: 'transform 0.1s linear' }}>
                <circle cx="50" cy="50" r="30" fill="none" stroke="var(--accent-violet)" strokeWidth="6" strokeDasharray="6,4" />
                <circle cx="50" cy="50" r="10" fill="none" stroke="#fff" strokeWidth="3" />
              </svg>
              <svg width="60" height="60" viewBox="0 0 100 100" style={{ marginLeft: '-15px', marginTop: '40px', transform: `rotate(${-tick * (val === 15 ? 3 : 1) * 1.6}deg)`, transition: 'transform 0.1s linear' }}>
                <circle cx="50" cy="50" r="30" fill="none" stroke="var(--accent-blue)" strokeWidth="6" strokeDasharray="6,4" />
              </svg>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
              Engineers design gears to transmit mechanical force efficiently.
            </span>
          </div>
        );

      case 'what-is-electrical-engineering':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="admin-chip active" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => setState1(!state1)}>
                💡 {state1 ? 'Turn Generator OFF' : 'Turn Generator ON'}
              </button>
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px dashed var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: state1 ? 'electricityPulse 1.5s infinite linear' : 'none', transform: state1 ? `rotate(${tick * 2}deg)` : 'none' }}>
                  🧲
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Magnet Spinner</span>
              </div>
              <div style={{ fontSize: '24px', opacity: state1 ? 0.6 + Math.sin(tick * 0.1) * 0.4 : 0.1, color: '#fbbf24', transition: 'opacity 0.2s' }}>
                ⚡ ➔ 💡
              </div>
            </div>
          </div>
        );

      case 'why-learn-electronics':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button className={`admin-chip ${state1 ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setState1(!state1)}>
                🏡 Front Light
              </button>
              <button className={`admin-chip ${state2 ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setState2(!state2)}>
                🚨 Siren Alarm
              </button>
            </div>
            <div style={{ height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ fontSize: '48px', opacity: state1 ? 1 : 0.3, transition: 'opacity 0.2s' }}>🏠</div>
              <div style={{ position: 'absolute', top: '24px', left: '44%', fontSize: '14px', visibility: state1 ? 'visible' : 'hidden' }}>🟡</div>
              <div style={{ position: 'absolute', top: '16px', right: '35%', fontSize: '14px', visibility: state2 ? 'visible' : 'hidden', animation: 'electricityJiggle 0.15s infinite' }}>🚨</div>
            </div>
          </div>
        );

      case 'what-is-electricity':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Push Force (Voltage): {val}</label>
              <input type="range" min="0" max="10" value={val} onChange={(e) => setVal(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: '85%', height: '30px', background: 'rgba(251, 146, 60, 0.15)', border: '2px solid rgb(251, 146, 60)', borderRadius: '15px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', overflow: 'hidden' }}>
                {Array.from({ length: 6 }).map((_, idx) => {
                  const offset = (idx * 40 + tick * val * 0.4) % 240;
                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        background: 'var(--accent-blue)', 
                        border: '1px solid #fff', 
                        position: 'absolute', 
                        left: `${offset}px`,
                        boxShadow: '0 0 8px var(--accent-blue)' 
                      }} 
                    />
                  );
                })}
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} style={{ fontSize: '10px', opacity: 0.25, color: '#fff' }}>⚛️</div>
                ))}
              </div>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
              Apply a push force to watch electrons jump atom-to-atom down the copper wire!
            </span>
          </div>
        );

      case 'electric-charge':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button className={`admin-chip ${activeTab === 'copper' ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setActiveTab('copper')}>
                Opposite Charges (+ and -)
              </button>
              <button className={`admin-chip ${activeTab === 'rubber' ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setActiveTab('rubber')}>
                Like Charges (+ and +)
              </button>
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', overflow: 'hidden', position: 'relative' }}>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: 'var(--accent-crimson, #ef4444)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#fff', 
                  fontWeight: 'bold',
                  boxShadow: '0 0 15px rgba(239,68,68,0.4)',
                  position: 'absolute',
                  left: '30%'
                }}
              >
                +
              </div>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: activeTab === 'copper' ? 'var(--accent-blue)' : 'var(--accent-crimson, #ef4444)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#fff', 
                  fontWeight: 'bold',
                  boxShadow: activeTab === 'copper' ? '0 0 15px rgba(59,130,246,0.4)' : '0 0 15px rgba(239,68,68,0.4)',
                  position: 'absolute',
                  right: '30%',
                  transform: activeTab === 'copper' 
                    ? `translateX(${Math.sin(tick * 0.1) * 6}px)` 
                    : `translateX(${40 + Math.sin(tick * 0.1) * -4}px)`,
                  transition: 'transform 0.1s linear'
                }}
              >
                {activeTab === 'copper' ? '-' : '+'}
              </div>
              <span style={{ fontSize: '20px', color: '#fff', opacity: 0.6 }}>
                {activeTab === 'copper' ? '▶ ◀' : '◀ ▶'}
              </span>
            </div>
          </div>
        );

      case 'conductors-vs-insulators':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button className={`admin-chip ${activeTab === 'copper' ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setActiveTab('copper')}>
                Copper Conductor
              </button>
              <button className={`admin-chip ${activeTab === 'rubber' ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setActiveTab('rubber')}>
                Rubber Insulator
              </button>
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Material</span>
                <div style={{ width: '80px', height: '24px', background: activeTab === 'copper' ? '#d97706' : '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>
                  {activeTab === 'copper' ? 'Copper' : 'Rubber'}
                </div>
              </div>
              <div style={{ fontSize: '32px', filter: activeTab === 'copper' ? 'drop-shadow(0 0 15px #fbbf24)' : 'none', opacity: activeTab === 'copper' ? 1 : 0.2, transition: 'opacity 0.2s' }}>
                💡
              </div>
            </div>
          </div>
        );

      case 'voltage':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Water Tank Height (Voltage): {val}m</label>
              <input type="range" min="1" max="10" value={val} onChange={(e) => setVal(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', position: 'relative' }}>
              {/* Tank */}
              <div style={{ width: '60px', height: '50px', background: 'rgba(59, 130, 246, 0.2)', border: '2px solid var(--accent-blue)', position: 'absolute', bottom: `${20 + val * 8}px`, left: '30%', display: 'flex', alignItems: 'flex-end', borderRadius: '4px' }}>
                <div style={{ width: '100%', height: '70%', background: 'var(--accent-blue)', opacity: 0.6 }} />
              </div>
              {/* Pipe */}
              <div style={{ width: '8px', height: `${val * 8}px`, background: 'var(--accent-blue)', position: 'absolute', bottom: '20px', left: '38%' }} />
              {/* Stream */}
              <div style={{ width: `${val * 18}px`, height: '4px', background: 'var(--accent-blue)', position: 'absolute', bottom: '20px', left: '39%', borderRadius: '2px', opacity: 0.8 }} />
            </div>
          </div>
        );

      case 'current':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Flow Rate (Current): {val} Amps</label>
              <input type="range" min="1" max="15" value={val} onChange={(e) => setVal(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: '80%', height: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
                {Array.from({ length: 12 }).map((_, idx) => {
                  const offset = (idx * 30 + tick * val * 0.8) % 240;
                  return (
                    <div key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald)', position: 'absolute', top: '2px', left: `${offset}px` }} />
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'resistance':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Nozzle Constriction (Resistance): {val} Ohms</label>
              <input type="range" min="1" max="10" value={val} onChange={(e) => setVal(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
              {/* Hose Pipe */}
              <div style={{ width: '80%', height: '36px', background: 'rgba(139, 92, 246, 0.1)', border: '2px solid var(--accent-violet)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Constriction blocks */}
                <div style={{ width: '20px', height: `${val * 1.5}px`, background: 'var(--accent-violet)', position: 'absolute', top: 0 }} />
                <div style={{ width: '20px', height: `${val * 1.5}px`, background: 'var(--accent-violet)', position: 'absolute', bottom: 0 }} />
                {/* Slowing electrons */}
                {Array.from({ length: 6 }).map((_, idx) => {
                  const speed = 11 - val;
                  const offset = (idx * 40 + tick * speed * 0.4) % 200;
                  return (
                    <div key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff', position: 'absolute', left: `${offset}px` }} />
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'power':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Voltage push: {val}</label>
                <input type="range" min="1" max="10" value={val} onChange={(e) => setVal(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Current flow: {val2}</label>
                <input type="range" min="1" max="10" value={val2} onChange={(e) => setVal2(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Water Wheel (Work)</span>
                <svg width="60" height="60" viewBox="0 0 100 100" style={{ transform: `rotate(${tick * val * val2 * 0.1}deg)`, transition: 'transform 0.1s linear', marginTop: '6px' }}>
                  <circle cx="50" cy="50" r="30" fill="none" stroke="var(--accent-blue)" strokeWidth="4" />
                  <line x1="50" y1="20" x2="50" y2="80" stroke="var(--accent-blue)" strokeWidth="3" />
                  <line x1="20" y1="50" x2="80" y2="50" stroke="var(--accent-blue)" strokeWidth="3" />
                </svg>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Power Output</span>
                <p style={{ fontSize: '20px', fontWeight: '800', color: '#fbbf24', margin: '4px 0 0 0' }}>{val * val2} Watts</p>
              </div>
            </div>
          </div>
        );

      case 'energy':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Charging Current: {val} A</label>
              <input type="range" min="1" max="10" value={val} onChange={(e) => setVal(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', gap: '24px' }}>
              <div style={{ width: '60px', height: '100px', border: '3px solid #fff', borderRadius: '6px', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '2px' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '18px', width: '18px', height: '8px', background: '#fff', borderRadius: '2px' }} />
                <div style={{ width: '100%', height: `${Math.min(100, (tick * val * 0.15) % 100)}%`, background: 'var(--accent-emerald)', borderRadius: '2px', transition: 'height 0.1s linear' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Accumulated Energy</span>
                <p style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '4px 0 0 0' }}>{Math.round(tick * val * 0.05)} Wh</p>
              </div>
            </div>
          </div>
        );

      case 'ohms-law':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Voltage (V): {val}V</label>
                <input type="range" min="1" max="24" value={val} onChange={(e) => setVal(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Resistance (R): {val2 * 10}Ω</label>
                <input type="range" min="1" max="20" value={val2} onChange={(e) => setVal2(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', gap: '24px' }}>
              <div style={{ width: '100px', height: '100px', border: '3px solid var(--accent-violet)', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>V = I × R</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Ohm's Triangle</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Calculated Current</span>
                <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent-emerald)', margin: '4px 0 0 0' }}>
                  {(val / (val2 * 10)).toFixed(2)} Amps
                </p>
              </div>
            </div>
          </div>
        );

      case 'ac-dc':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button className={`admin-chip ${activeTab === 'dc' ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setActiveTab('dc')}>
                DC (Direct Current)
              </button>
              <button className={`admin-chip ${activeTab === 'ac' ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setActiveTab('ac')}>
                AC (Alternating Current)
              </button>
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
              {activeTab === 'dc' ? (
                <div style={{ width: '80%', height: '2px', background: 'var(--accent-emerald)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-10px', left: '10px', fontSize: '9px', color: 'var(--accent-emerald)', fontWeight: 'bold' }}>Steady +5V</div>
                </div>
              ) : (
                <svg width="240" height="100" viewBox="0 0 240 100" style={{ overflow: 'visible' }}>
                  <path 
                    d={Array.from({ length: 48 }).map((_, i) => {
                      const x = i * 5;
                      const y = 50 + Math.sin((i * 15 + tick * 4) * Math.PI / 180) * 30;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')} 
                    fill="none" 
                    stroke="var(--accent-blue)" 
                    strokeWidth="3" 
                  />
                  <line x1="0" y1="50" x2="240" y2="50" stroke="rgba(255,255,255,0.1)" strokeDasharray="4,4" />
                </svg>
              )}
            </div>
          </div>
        );

      case 'series-circuit':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button className="admin-chip active" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setState1(!state1)}>
                💡 {state1 ? 'Unscrew Bulb A' : 'Screw In Bulb A'}
              </button>
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', gap: '24px' }}>
              <div style={{ fontSize: '32px', filter: state1 ? 'drop-shadow(0 0 15px #fbbf24)' : 'none', opacity: state1 ? 1 : 0.2 }}>💡</div>
              <div style={{ color: '#fff', fontSize: '16px' }}>───</div>
              <div style={{ fontSize: '32px', filter: state1 ? 'drop-shadow(0 0 15px #fbbf24)' : 'none', opacity: state1 ? 1 : 0.2 }}>💡</div>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
              In series, disconnecting one bulb breaks the single path and turns both OFF!
            </span>
          </div>
        );

      case 'parallel-circuit':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button className="admin-chip active" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setState1(!state1)}>
                💡 {state1 ? 'Unscrew Bulb A' : 'Screw In Bulb A'}
              </button>
            </div>
            <div style={{ height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '48px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Branch A</span>
                  <div style={{ fontSize: '32px', filter: state1 ? 'drop-shadow(0 0 15px #fbbf24)' : 'none', opacity: state1 ? 1 : 0.2 }}>💡</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Branch B</span>
                  <div style={{ fontSize: '32px', filter: 'drop-shadow(0 0 15px #fbbf24)', opacity: 1 }}>💡</div>
                </div>
              </div>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
              In parallel, unscrewing Bulb A keeps Bulb B glowing normally!
            </span>
          </div>
        );

      case 'open-circuit':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button className="admin-chip active" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setState1(!state1)}>
                🎛️ {state1 ? 'Open Switch' : 'Close Switch'}
              </button>
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', gap: '20px' }}>
              <div style={{ fontSize: '20px', color: '#fff' }}>🔋</div>
              <div style={{ position: 'relative', width: '60px', height: '2px', background: '#fff' }}>
                {/* Switch lever */}
                <div style={{ position: 'absolute', left: '10px', bottom: 0, width: '40px', height: '2px', background: '#fff', transform: state1 ? 'none' : 'rotate(-45deg)', transformOrigin: 'left bottom', transition: 'transform 0.2s' }} />
              </div>
              <div style={{ fontSize: '32px', filter: state1 ? 'drop-shadow(0 0 15px #fbbf24)' : 'none', opacity: state1 ? 1 : 0.2 }}>💡</div>
            </div>
          </div>
        );

      case 'short-circuit':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button className="admin-chip active" style={{ padding: '6px 12px', fontSize: '11px', background: 'var(--accent-crimson, #ef4444)' }} onClick={() => setSparking(!sparking)}>
                ⚠️ {sparking ? 'Disconnect Bypass Wires' : 'Connect Bypass Wires'}
              </button>
            </div>
            <div style={{ height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <div style={{ fontSize: '24px', animation: sparking ? 'electricityJiggle 0.1s infinite' : 'none' }}>🔋 Battery</div>
                <div style={{ fontSize: '24px', opacity: sparking ? 0.2 : 1 }}>💡 Bulb</div>
              </div>
              {sparking && (
                <div style={{ position: 'absolute', top: '15px', left: '20px', right: '20px', border: '2px dashed var(--accent-crimson, #ef4444)', height: '80px', borderRadius: '6px', zIndex: 1, pointerEvents: 'none', animation: 'electricityPulse 0.5s infinite' }}>
                  <span style={{ position: 'absolute', left: '50%', top: '35%', fontSize: '24px' }}>💥</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'electrical-safety':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button className="admin-chip active" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setGfciState(g => g === 'safe' ? 'leak' : 'safe')}>
                🛡️ {gfciState === 'safe' ? 'Simulate Earth Leak' : 'Reset GFCI Breaker'}
              </button>
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>GFCI Indicator</span>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: gfciState === 'safe' ? 'var(--accent-emerald)' : 'var(--accent-crimson, #ef4444)', margin: '4px 0' }} />
              </div>
              <div style={{ fontSize: '32px', opacity: gfciState === 'safe' ? 1 : 0.1 }}>
                🔌 Live Power
              </div>
            </div>
          </div>
        );

      case 'final-assessment':
        return (
          <div style={{ height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px dashed var(--accent-violet)', overflow: 'hidden' }}>
            <div style={{ fontSize: '48px', filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.4))' }}>🎓</div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#fff', marginTop: '8px' }}>Level 1 Final Assessment Ready</span>
          </div>
        );

      default:
        return (
          <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Interactive simulator loading...</span>
          </div>
        );
    }
  };

  return (
    <div 
      className="card-glass" 
      style={{ 
        padding: '20px', 
        border: '1px solid var(--border-subtle)', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        borderRadius: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>🧪</span>
        <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '0.5px' }}>
          Interactive Lab & Visualization
        </span>
      </div>
      {renderWidget()}
    </div>
  );
};
