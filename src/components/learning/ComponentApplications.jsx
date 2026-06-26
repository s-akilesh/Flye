import React, { useState } from 'react';

export const ComponentApplications = ({ component }) => {
  const apps = component.applications || [];
  const [activeCardIdx, setActiveCardIdx] = useState(null);

  if (apps.length === 0) return null;

  // Determine the active component family for highlight
  const getHighlightFamily = () => {
    const slug = component.slug.toLowerCase();
    if (slug.includes('capacitor')) return 'capacitor';
    if (slug.includes('resistor')) return 'resistor';
    if (slug.includes('led') || slug.includes('diode')) return 'led-diode';
    return 'none';
  };

  const highlightFamily = getHighlightFamily();

  // Visual SVG Renderers for the 5 standard products
  const productVisuals = {
    'phone-charger': (
      <svg className="product-svg" viewBox="0 0 100 100" stroke="currentColor" strokeWidth="2" fill="none">
        {/* Outer Casing */}
        <rect x="25" y="20" width="50" height="52" rx="6" className="outer-case" />
        <line x1="42" y1="72" x2="42" y2="85" className="outer-case" />
        <line x1="58" y1="72" x2="58" y2="85" className="outer-case" />
        {/* PCB Circuit */}
        <g className="pcb-circuit">
          <rect x="28" y="23" width="44" height="46" rx="2" className="pcb-board" />
          <path d="M 34,42 H 66 M 50,28 V 64" className="pcb-traces" />
          {/* Capacitor */}
          <rect x="42" y="28" width="16" height="10" rx="1" className={`part-cap ${highlightFamily === 'capacitor' ? 'active-highlight' : ''}`} />
          {/* Resistor */}
          <rect x="32" y="46" width="10" height="4" className={`part-res ${highlightFamily === 'resistor' ? 'active-highlight' : ''}`} />
          {/* LED/Diode */}
          <circle cx="50" cy="58" r="4" className={`part-led ${highlightFamily === 'led-diode' ? 'active-highlight' : ''}`} />
        </g>
      </svg>
    ),
    'motherboard': (
      <svg className="product-svg" viewBox="0 0 100 100" stroke="currentColor" strokeWidth="2" fill="none">
        {/* Outer Motherboard Block */}
        <rect x="15" y="15" width="70" height="70" rx="4" className="outer-case" />
        {/* PCB Circuit */}
        <g className="pcb-circuit">
          <rect x="18" y="18" width="64" height="64" rx="2" className="pcb-board" />
          {/* CPU Socket */}
          <rect x="36" y="32" width="28" height="28" rx="2" className="pcb-cpu" />
          {/* Capacitors next to CPU */}
          <circle cx="26" cy="26" r="3.5" className={`part-cap ${highlightFamily === 'capacitor' ? 'active-highlight' : ''}`} />
          <circle cx="26" cy="38" r="3.5" className={`part-cap ${highlightFamily === 'capacitor' ? 'active-highlight' : ''}`} />
          <circle cx="26" cy="50" r="3.5" className={`part-cap ${highlightFamily === 'capacitor' ? 'active-highlight' : ''}`} />
          {/* Resistors */}
          <rect x="70" y="26" width="6" height="3" className={`part-res ${highlightFamily === 'resistor' ? 'active-highlight' : ''}`} />
          <rect x="70" y="34" width="6" height="3" className={`part-res ${highlightFamily === 'resistor' ? 'active-highlight' : ''}`} />
          {/* LEDs */}
          <polygon points="70,48 76,52 70,56" className={`part-led ${highlightFamily === 'led-diode' ? 'active-highlight' : ''}`} />
        </g>
      </svg>
    ),
    'television': (
      <svg className="product-svg" viewBox="0 0 100 100" stroke="currentColor" strokeWidth="2" fill="none">
        {/* TV Outer Frame */}
        <rect x="10" y="22" width="80" height="46" rx="3" className="outer-case" />
        <rect x="46" y="68" width="8" height="10" className="outer-case" />
        <line x1="36" y1="78" x2="64" y2="78" className="outer-case" />
        {/* PCB Circuit */}
        <g className="pcb-circuit">
          <rect x="24" y="28" width="52" height="34" rx="2" className="pcb-board" />
          {/* Components */}
          <rect x="30" y="34" width="12" height="22" rx="1" className={`part-cap ${highlightFamily === 'capacitor' ? 'active-highlight' : ''}`} />
          <rect x="50" y="44" width="12" height="4" className={`part-res ${highlightFamily === 'resistor' ? 'active-highlight' : ''}`} />
          <circle cx="68" cy="38" r="3.5" className={`part-led ${highlightFamily === 'led-diode' ? 'active-highlight' : ''}`} />
        </g>
      </svg>
    ),
    'arduino': (
      <svg className="product-svg" viewBox="0 0 100 100" stroke="currentColor" strokeWidth="2" fill="none">
        {/* Outer Arduino Block */}
        <rect x="15" y="20" width="70" height="60" rx="4" className="outer-case" />
        {/* PCB Circuit */}
        <g className="pcb-circuit">
          <rect x="18" y="23" width="64" height="54" rx="2" className="pcb-board" style={{ fill: 'rgba(5, 150, 105, 0.05)' }} />
          {/* MCU Chip */}
          <rect x="42" y="35" width="28" height="28" rx="1" className="pcb-cpu" />
          {/* Cylinder Capacitors */}
          <circle cx="28" cy="34" r="4" className={`part-cap ${highlightFamily === 'capacitor' ? 'active-highlight' : ''}`} />
          <circle cx="28" cy="46" r="4" className={`part-cap ${highlightFamily === 'capacitor' ? 'active-highlight' : ''}`} />
          {/* Resistor */}
          <rect x="32" y="60" width="12" height="4" className={`part-res ${highlightFamily === 'resistor' ? 'active-highlight' : ''}`} />
          {/* LED */}
          <rect x="74" y="30" width="4" height="4" className={`part-led ${highlightFamily === 'led-diode' ? 'active-highlight' : ''}`} />
        </g>
      </svg>
    ),
    'amplifier': (
      <svg className="product-svg" viewBox="0 0 100 100" stroke="currentColor" strokeWidth="2" fill="none">
        {/* Outer Amp Speaker Box */}
        <rect x="20" y="15" width="60" height="70" rx="6" className="outer-case" />
        <circle cx="50" cy="55" r="16" className="outer-case" />
        {/* PCB Circuit */}
        <g className="pcb-circuit">
          <rect x="24" y="20" width="52" height="60" rx="2" className="pcb-board" />
          {/* Components */}
          <rect x="42" y="26" width="16" height="8" rx="1" className={`part-cap ${highlightFamily === 'capacitor' ? 'active-highlight' : ''}`} />
          <rect x="32" y="44" width="10" height="4" className={`part-res ${highlightFamily === 'resistor' ? 'active-highlight' : ''}`} />
          <polygon points="60,38 66,42 60,46" className={`part-led ${highlightFamily === 'led-diode' ? 'active-highlight' : ''}`} />
        </g>
      </svg>
    )
  };

  return (
    <section className="workspace-card" id="where-you-see-this-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <span style={{ fontSize: '10px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-violet)' }}>
          Real-World Applications
        </span>
        <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
          Where You See This
        </h2>
      </div>

      <div className="product-visual-grid">
        {apps.map((app, idx) => {
          const isSelected = activeCardIdx === idx;
          return (
            <div
              key={idx}
              className={`product-visual-card ${isSelected ? 'active' : ''}`}
              onMouseEnter={() => setActiveCardIdx(idx)}
              onMouseLeave={() => setActiveCardIdx(null)}
              onClick={() => setActiveCardIdx(isSelected ? null : idx)} // Tap support for mobile
            >
              {/* Product Visual Illustration */}
              <div className="product-illustration-wrapper">
                {productVisuals[app.id] || productVisuals['phone-charger']}
              </div>

              {/* Information Overlay */}
              <div className="product-info-overlay">
                <span className="product-overlay-title">{app.role}</span>
                <h4 className="product-overlay-name">{app.role} in {app.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h4>
                <p className="product-overlay-desc">{app.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
