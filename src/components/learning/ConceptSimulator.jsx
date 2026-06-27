import React, { useState, useEffect, useRef } from 'react';

export const ConceptSimulator = ({ config }) => {
  if (!config) return null;

  // Local state for sliders/inputs
  const [val1, setVal1] = useState(config.defaultValue ?? 0);
  const [val2, setVal2] = useState(1); // Used for dual slider config (e.g. Power, Energy)
  const [isBroken, setIsBroken] = useState(false);
  const [isAcmode, setIsAcmode] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);

  // Reset states when config changes
  useEffect(() => {
    setVal1(config.defaultValue ?? 0);
    setVal2(1);
    setIsBroken(false);
    setIsAcmode(false);
    setSwitchOn(true);
  }, [config.type]);

  // Determine what type of simulation to render
  const renderSimulationMedia = () => {
    switch (config.type) {
      case 'electricity': {
        const speed = val1 > 0 ? 10 - val1 * 0.8 : 0;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '16px' }}>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100px', background: 'rgba(3,3,5,0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              {/* Copper Wire Pipe */}
              <rect x="30" y="35" width="240" height="30" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
              
              {/* Charges/Marbles inside */}
              {[...Array(12)].map((_, i) => {
                const startX = 40 + i * 20;
                return (
                  <circle
                    key={i}
                    cx={startX}
                    cy="50"
                    r="8"
                    fill="var(--accent-blue)"
                    style={{
                      animation: val1 > 0 
                        ? `electricityFlow ${speed}s infinite linear` 
                        : 'electricityJiggle 1.5s infinite ease-in-out',
                      animationDelay: `${i * 0.1}s`,
                      filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))'
                    }}
                  />
                );
              })}
              
              {/* Pushing Hand (conceptual indicator on left) */}
              <text x="5" y="55" style={{ fontSize: '20px', animation: val1 > 0 ? 'pushHand 0.8s infinite ease' : 'none' }}>
                👉
              </text>
            </svg>
            <style>{`
              @keyframes electricityFlow {
                0% { transform: translateX(0); }
                100% { transform: translateX(20px); }
              }
              @keyframes electricityJiggle {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(1px, -1px); }
                50% { transform: translate(-1px, 1px); }
                75% { transform: translate(1px, 1px); }
              }
              @keyframes pushHand {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(4px); }
              }
            `}</style>
          </div>
        );
      }

      case 'voltage': {
        const height = val1; // 0 to 24
        const tankWaterY = 70 - (height * 1.8);
        const sprayLength = height > 0 ? 40 + height * 5 : 0;
        const sprayCurveY = height > 0 ? 55 + height * 0.8 : 55;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100px', background: 'rgba(3,3,5,0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              {/* Water Tower Structure */}
              <line x1="45" y1="40" x2="35" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="55" y1="40" x2="65" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="38" y1="65" x2="62" y2="65" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              
              {/* Water Tank */}
              <rect x="35" y="20" width="30" height="30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              
              {/* Water in Tank */}
              {height > 0 && (
                <rect x="37" y={tankWaterY} width="26" height={50 - tankWaterY} fill="#60a5fa" opacity="0.8" />
              )}
              
              {/* Pipe Out */}
              <path d="M 50,50 V 55 H 100" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
              
              {/* Water Spraying Out */}
              {height > 0 && (
                <path 
                  d={`M 100,55 Q 100+${sprayLength / 2},53 100+${sprayLength},${sprayCurveY}`} 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth={2 + height * 0.08}
                  strokeDasharray="4 2"
                  style={{ animation: 'waterSpray 0.5s infinite linear' }}
                />
              )}
              
              {/* Ground line */}
              <line x1="10" y1="85" x2="290" y2="85" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
            </svg>
            <style>{`
              @keyframes waterSpray {
                0% { stroke-dashoffset: 0; }
                100% { stroke-dashoffset: -12; }
              }
            `}</style>
          </div>
        );
      }

      case 'current': {
        const flow = val1; // 0 to 5
        const dashSpeed = flow > 0 ? `${5 / flow}s` : '0s';
        const spinSpeed = flow > 0 ? `${3 / flow}s` : '0s';
        const glowOpacity = flow / 5;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100px', background: 'rgba(3,3,5,0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              {/* Wire Hose */}
              <rect x="20" y="40" width="180" height="20" rx="2" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              
              {/* Current flow paths */}
              {flow > 0 && (
                <path 
                  d="M 20,50 H 200" 
                  fill="none" 
                  stroke="#60a5fa" 
                  strokeWidth="8" 
                  strokeDasharray="10 15"
                  style={{ animation: `currentDashes ${dashSpeed} infinite linear` }}
                />
              )}
              
              {/* Water Wheel / Turbine */}
              <g transform="translate(230, 50)" style={{ animation: flow > 0 ? `spinWheel ${spinSpeed} infinite linear` : 'none', transformOrigin: 'center' }}>
                <circle cx="0" cy="0" r="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <line x1="0" y1="-16" x2="0" y2="16" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                <line x1="-16" y1="0" x2="16" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                <line x1="-11" y1="-11" x2="11" y2="11" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                <line x1="-11" y1="11" x2="11" y2="-11" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              </g>

              {/* Connected bulb */}
              <circle cx="280" cy="30" r="10" fill={flow > 0 ? `rgba(251, 191, 36, ${0.3 + glowOpacity * 0.7})` : 'rgba(255,255,255,0.03)'} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              {flow > 0 && (
                <circle cx="280" cy="30" r="10" fill="none" stroke="#fbbf24" strokeWidth="2" style={{ filter: `drop-shadow(0 0 ${flow * 3}px #fbbf24)` }} />
              )}
              <path d="M 280,40 V 55" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <line x1="270" y1="55" x2="290" y2="55" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            </svg>
            <style>{`
              @keyframes currentDashes {
                0% { stroke-dashoffset: 0; }
                100% { stroke-dashoffset: -25; }
              }
              @keyframes spinWheel {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        );
      }

      case 'resistance': {
        const squeeze = val1; // 1 to 100
        const gapHeight = 30 - (squeeze * 0.26); // Gap gets narrower
        const hotColor = `rgb(${100 + squeeze * 1.55}, ${110 - squeeze * 0.5}, ${110 - squeeze})`; // Redder as squeeze increases
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100px', background: 'rgba(3,3,5,0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              {/* Flow Tube */}
              <path d="M 20,35 H 120 L 140,40 H 160 L 180,35 H 280" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
              <path d="M 20,65 H 120 L 140,60 H 160 L 180,65 H 280" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
              
              {/* Squeeze Mechanism Blocks */}
              <rect x="135" y="10" width="30" height={25 + (squeeze * 0.08)} fill={hotColor} rx="2" style={{ transition: 'all 0.1s ease' }} />
              <rect x="135" y={90 - (25 + (squeeze * 0.08))} width="30" height={25 + (squeeze * 0.08)} fill={hotColor} rx="2" style={{ transition: 'all 0.1s ease' }} />
              
              {/* Flow particles */}
              {[...Array(6)].map((_, i) => {
                const delay = i * 0.3;
                return (
                  <circle
                    key={i}
                    cx="0"
                    cy="50"
                    r="4"
                    fill="var(--accent-blue)"
                    style={{
                      animation: `resFlow 2s infinite linear`,
                      animationDelay: `${delay}s`,
                    }}
                  />
                );
              })}
            </svg>
            <style>{`
              @keyframes resFlow {
                0% { cx: 20px; }
                40% { cx: 135px; opacity: 1; }
                50% { cx: 165px; transform: scale(0.6); opacity: 0.8; }
                100% { cx: 280px; }
              }
            `}</style>
          </div>
        );
      }

      case 'power': {
        // val1 is Voltage slider (1 to 12)
        // val2 is Current slider (1 to 5)
        const power = val1 * val2;
        const speed = power > 0 ? `${15 / power}s` : '0s';
        const boxHeight = 75 - (power * 0.35); // Block lifts higher as power increases
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100px', background: 'rgba(3,3,5,0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              {/* Water Wheel */}
              <g transform="translate(60, 50)" style={{ animation: power > 0 ? `spinWheel ${speed} infinite linear` : 'none', transformOrigin: 'center' }}>
                <circle cx="0" cy="0" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <line x1="-20" y1="0" x2="20" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                <line x1="0" y1="-20" x2="0" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              </g>

              {/* Rope pulley system */}
              <line x1="60" y1="50" x2="230" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="230" cy="20" r="6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <line x1="236" y1="20" x2="236" y2={boxHeight} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              
              {/* Heavy block being lifted */}
              <rect x="221" y={boxHeight} width="30" height="20" rx="2" fill="var(--accent-violet)" stroke="rgba(255,255,255,0.2)" />
              <text x="228" y={boxHeight + 13} style={{ fontSize: '9px', fontWeight: 'bold', fill: '#fff' }}>KG</text>

              {/* Power readout text overlay */}
              <rect x="110" y="70" width="80" height="22" rx="4" fill="rgba(3,3,5,0.8)" stroke="rgba(255,255,255,0.1)" />
              <text x="116" y="84" style={{ fontSize: '11px', fontWeight: 'bold', fill: power > 50 ? 'var(--accent-red)' : 'var(--accent-emerald)' }}>
                Power: {power}W
              </text>
            </svg>

            {/* Power Dual Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>Voltage (Push)</span>
                  <span>{val1}V</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="12" 
                  value={val1} 
                  onChange={(e) => setVal1(parseInt(e.target.value))} 
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>Current (Flow)</span>
                  <span>{val2}A</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={val2} 
                  onChange={(e) => setVal2(parseInt(e.target.value))} 
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        );
      }

      case 'energy': {
        // val1 is Power (1W to 10W)
        // val2 is Time (1h to 24h)
        const energyValue = val1 * val2;
        const bucketWaterY = 85 - (energyValue * 0.2); // Fills up to 85 max
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100px', background: 'rgba(3,3,5,0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              {/* Pipe feeding water */}
              <path d="M 20,20 H 130 V 30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              
              {/* Flow stream depending on power (Watts) */}
              <line x1="130" y1="30" x2="130" y2="85" stroke="#60a5fa" strokeWidth={val1 * 0.4} strokeDasharray="5 3" style={{ animation: 'waterSpray 0.5s infinite linear' }} />
              
              {/* Bucket */}
              <path d="M 110,50 L 115,85 H 145 L 150,50" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              
              {/* Accumulated water level in bucket */}
              <path d={`M 115,85 L ${115 - (85 - bucketWaterY) * 0.14},${bucketWaterY} H ${145 + (85 - bucketWaterY) * 0.14} L 145,85 Z`} fill="#3b82f6" opacity="0.85" style={{ transition: 'all 0.2s ease' }} />

              {/* Energy meter */}
              <rect x="180" y="30" width="100" height="40" rx="6" fill="rgba(3,3,5,0.9)" stroke="rgba(255,255,255,0.1)" />
              <text x="190" y="48" style={{ fontSize: '9px', fill: 'var(--text-muted)' }}>ENERGY CONSUMED</text>
              <text x="190" y="64" style={{ fontSize: '13px', fontWeight: 'bold', fill: 'var(--accent-blue)' }}>{energyValue} Wh</text>
            </svg>

            {/* Energy Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>Power (Watts)</span>
                  <span>{val1}W</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={val1} 
                  onChange={(e) => setVal1(parseInt(e.target.value))} 
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>Time Run (Hours)</span>
                  <span>{val2}h</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="24" 
                  value={val2} 
                  onChange={(e) => setVal2(parseInt(e.target.value))} 
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        );
      }

      case 'acdc': {
        const isAC = isAcmode;
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100px', background: 'rgba(3,3,5,0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              {/* Conductor Line */}
              <line x1="20" y1="30" x2="280" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="6" strokeLinecap="round" />
              
              {/* Charges inside */}
              {[...Array(9)].map((_, i) => {
                const cx = 35 + i * 28;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy="30"
                    r="5"
                    fill="var(--accent-blue)"
                    style={{
                      animation: isAC 
                        ? 'acVibrate 1.2s infinite ease-in-out' 
                        : 'dcConveyor 2s infinite linear',
                      filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))'
                    }}
                  />
                );
              })}

              {/* Scope Grid Screen */}
              <rect x="80" y="55" width="140" height="35" rx="4" fill="rgba(3,3,5,0.85)" stroke="rgba(255,255,255,0.08)" />
              <line x1="80" y1="72" x2="220" y2="72" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 2" />
              
              {/* Oscilloscope Waveform */}
              {isAC ? (
                <path 
                  d="M 80,72 Q 97.5,58 115,72 T 150,72 T 185,72 T 220,72" 
                  fill="none" 
                  stroke="var(--accent-emerald)" 
                  strokeWidth="2" 
                  style={{ animation: 'scrollWave 1.5s infinite linear' }}
                />
              ) : (
                <line x1="80" y1="62" x2="220" y2="62" stroke="var(--accent-blue)" strokeWidth="2" />
              )}
            </svg>

            {/* AC/DC Selection Mode Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button 
                onClick={() => setIsAcmode(false)} 
                className="app-grid-btn"
                style={{ 
                  flex: 1, 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  fontSize: '11px',
                  fontWeight: '800',
                  background: !isAC ? 'rgba(59, 130, 246, 0.15)' : 'rgba(3,3,5,0.3)',
                  borderColor: !isAC ? 'var(--accent-blue)' : 'var(--border-subtle)',
                  color: !isAC ? 'var(--accent-blue)' : 'var(--text-muted)'
                }}
              >
                Direct Current (DC)
              </button>
              <button 
                onClick={() => setIsAcmode(true)} 
                className="app-grid-btn"
                style={{ 
                  flex: 1, 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  fontSize: '11px',
                  fontWeight: '800',
                  background: isAC ? 'rgba(52, 211, 153, 0.15)' : 'rgba(3,3,5,0.3)',
                  borderColor: isAC ? 'var(--accent-emerald)' : 'var(--border-subtle)',
                  color: isAC ? 'var(--accent-emerald)' : 'var(--text-muted)'
                }}
              >
                Alternating Current (AC)
              </button>
            </div>
            <style>{`
              @keyframes dcConveyor {
                0% { transform: translateX(0); }
                100% { transform: translateX(28px); }
              }
              @keyframes acVibrate {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(12px); }
              }
              @keyframes scrollWave {
                0% { stroke-dasharray: 100; stroke-dashoffset: 100; }
                100% { stroke-dasharray: 100; stroke-dashoffset: 0; }
              }
            `}</style>
          </div>
        );
      }

      case 'series': {
        const canFlow = switchOn && !isBroken;
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100px', background: 'rgba(3,3,5,0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              {/* Battery source */}
              <rect x="25" y="35" width="20" height="30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <text x="31" y="54" style={{ fontSize: '14px', fill: '#fff', fontWeight: 'bold' }}>9V</text>
              
              {/* Connecting lines */}
              <path d="M 45,50 H 90" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
              <path d="M 120,50 H 160" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
              <path d="M 190,50 H 220 V 80 H 35 V 65" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
              
              {/* Switch */}
              <g transform="translate(240, 50)" style={{ cursor: 'pointer' }} onClick={() => setSwitchOn(!switchOn)}>
                <circle cx="0" cy="0" r="10" fill={switchOn ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)'} stroke={switchOn ? 'var(--accent-emerald)' : 'var(--accent-red)'} strokeWidth="1.5" />
                <text x="-5" y="4" style={{ fontSize: '10px' }}>{switchOn ? 'ON' : 'OFF'}</text>
              </g>
              <line x1="220" y1="50" x2="230" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="250" y1="50" x2="280" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="280" y1="50" x2="280" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="280" y1="80" x2="220" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

              {/* Bulb 1 */}
              <g transform="translate(105, 50)">
                <circle cx="0" cy="0" r="12" fill={canFlow ? 'rgba(251, 191, 36, 0.8)' : 'rgba(255,255,255,0.03)'} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <text x="-4" y="4" style={{ fontSize: '12px' }}>{isBroken ? '❌' : '💡'}</text>
                <text x="-16" y="24" style={{ fontSize: '8px', fill: 'var(--text-muted)' }}>Bulb 1</text>
              </g>

              {/* Bulb 2 */}
              <g transform="translate(175, 50)">
                <circle cx="0" cy="0" r="12" fill={canFlow ? 'rgba(251, 191, 36, 0.8)' : 'rgba(255,255,255,0.03)'} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <text x="-4" y="4" style={{ fontSize: '12px' }}>💡</text>
                <text x="-16" y="24" style={{ fontSize: '8px', fill: 'var(--text-muted)' }}>Bulb 2</text>
              </g>

              {/* Electron current dots flowing */}
              {canFlow && (
                <>
                  <circle cx="65" cy="50" r="2.5" fill="var(--accent-blue)"><animate attributeName="cx" from="45" to="90" dur="1s" repeatCount="indefinite"/></circle>
                  <circle cx="140" cy="50" r="2.5" fill="var(--accent-blue)"><animate attributeName="cx" from="120" to="160" dur="1s" repeatCount="indefinite"/></circle>
                </>
              )}
            </svg>

            {/* Toggle break bulb */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setIsBroken(!isBroken)} 
                className="cta-button"
                style={{ 
                  background: isBroken ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
                  borderColor: isBroken ? 'var(--accent-emerald)' : 'var(--accent-red)',
                  color: isBroken ? 'var(--accent-emerald)' : 'var(--accent-red)',
                  padding: '6px 12px',
                  fontSize: '10px'
                }}
              >
                {isBroken ? 'Repair Bulb 1 (Connect Loop)' : 'Break Bulb 1 (Open Circuit)'}
              </button>
            </div>
          </div>
        );
      }

      case 'parallel': {
        const branch1Flow = switchOn && !isBroken;
        const branch2Flow = switchOn;
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100px', background: 'rgba(3,3,5,0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              {/* Battery Source */}
              <rect x="25" y="35" width="20" height="30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <text x="31" y="54" style={{ fontSize: '14px', fill: '#fff', fontWeight: 'bold' }}>9V</text>

              {/* Main Line In */}
              <path d="M 45,50 H 80" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
              
              {/* Parallel branches splitting */}
              <path d="M 80,30 V 70" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
              
              {/* Branch 1 */}
              <path d="M 80,30 H 120" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
              <path d="M 150,30 H 190" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
              
              {/* Branch 2 */}
              <path d="M 80,70 H 120" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
              <path d="M 150,70 H 190" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />

              {/* Rejoining paths */}
              <path d="M 190,30 V 70" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
              <path d="M 190,50 H 220 V 80 H 35 V 65" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
              
              {/* Switch */}
              <g transform="translate(240, 50)" style={{ cursor: 'pointer' }} onClick={() => setSwitchOn(!switchOn)}>
                <circle cx="0" cy="0" r="10" fill={switchOn ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)'} stroke={switchOn ? 'var(--accent-emerald)' : 'var(--accent-red)'} strokeWidth="1.5" />
                <text x="-5" y="4" style={{ fontSize: '10px' }}>{switchOn ? 'ON' : 'OFF'}</text>
              </g>
              <line x1="220" y1="50" x2="230" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="250" y1="50" x2="280" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="280" y1="50" x2="280" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="280" y1="80" x2="220" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

              {/* Bulb 1 on Branch 1 */}
              <g transform="translate(135, 30)">
                <circle cx="0" cy="0" r="12" fill={branch1Flow ? 'rgba(251, 191, 36, 0.8)' : 'rgba(255,255,255,0.03)'} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <text x="-4" y="4" style={{ fontSize: '12px' }}>{isBroken ? '❌' : '💡'}</text>
                <text x="-16" y="-18" style={{ fontSize: '8px', fill: 'var(--text-muted)' }}>Bulb 1</text>
              </g>

              {/* Bulb 2 on Branch 2 */}
              <g transform="translate(135, 70)">
                <circle cx="0" cy="0" r="12" fill={branch2Flow ? 'rgba(251, 191, 36, 0.8)' : 'rgba(255,255,255,0.03)'} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <text x="-4" y="4" style={{ fontSize: '12px' }}>💡</text>
                <text x="-16" y="24" style={{ fontSize: '8px', fill: 'var(--text-muted)' }}>Bulb 2</text>
              </g>

              {/* Flow arrows */}
              {branch1Flow && (
                <circle cx="100" cy="30" r="2" fill="var(--accent-blue)"><animate attributeName="cx" from="80" to="120" dur="0.8s" repeatCount="indefinite"/></circle>
              )}
              {branch2Flow && (
                <circle cx="100" cy="70" r="2" fill="var(--accent-blue)"><animate attributeName="cx" from="80" to="120" dur="0.8s" repeatCount="indefinite"/></circle>
              )}
            </svg>

            {/* Toggle break bulb */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setIsBroken(!isBroken)} 
                className="cta-button"
                style={{ 
                  background: isBroken ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
                  borderColor: isBroken ? 'var(--accent-emerald)' : 'var(--accent-red)',
                  color: isBroken ? 'var(--accent-emerald)' : 'var(--accent-red)',
                  padding: '6px 12px',
                  fontSize: '10px'
                }}
              >
                {isBroken ? 'Repair Bulb 1 (Reconnect Branch)' : 'Break Bulb 1 (Open Branch)'}
              </button>
            </div>
          </div>
        );
      }

      default:
        return <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Simulation details unavailable.</div>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px', alignItems: 'center' }}>
      {/* Simulation Screen Wrapper */}
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '460px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '16px', 
          background: 'rgba(255,255,255,0.003)', 
          borderRadius: '10px', 
          border: '1px solid rgba(255,255,255,0.02)' 
        }}
      >
        {renderSimulationMedia()}
      </div>

      {/* Slider Control (Only if NOT series/parallel/acdc/power/energy which have specialized overrides) */}
      {!['series', 'parallel', 'acdc', 'power', 'energy'].includes(config.type) && (
        <div style={{ width: '100%', maxWidth: '320px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span>{config.label || 'Adjust'}</span>
            <span style={{ fontWeight: 'bold', color: 'var(--accent-violet)' }}>{val1}</span>
          </div>
          <input 
            type="range" 
            min={config.min ?? 0} 
            max={config.max ?? 10} 
            value={val1} 
            onChange={(e) => setVal1(parseFloat(e.target.value))} 
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
      )}
    </div>
  );
};
