import React from 'react';

export const ComponentOverview = ({ component }) => {
  const cards = component.defaultCards || [];
  
  // Find card answers or fall back to description/general copy
  const whatAnswer = cards.find(c => c.question.toLowerCase().includes('what is'))?.answer || 
                    component.description || 
                    "A fundamental electronic component used in circuit design.";
                    
  const whyAnswer = cards.find(c => c.question.toLowerCase().includes('why is') || c.question.toLowerCase().includes('needed'))?.answer || 
                   "Essential for maintaining voltage stability, limiting current flow, or filtering signals in electronics.";
                   
  const missingAnswer = cards.find(c => c.question.toLowerCase().includes('removed') || c.question.toLowerCase().includes('fails'))?.answer || 
                       "Without it, signals can become noisy, components might burn out under high current, or microchips may reset due to unstable voltage.";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
        Component Primer
      </span>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* What is it? */}
        <div 
          className="workspace-card" 
          style={{ 
            margin: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            border: '1px solid rgba(139, 92, 246, 0.1)', 
            background: 'rgba(139, 92, 246, 0.005)' 
          }}
        >
          <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-violet)' }}>
            What is it?
          </span>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)', margin: 0 }}>
            {whatAnswer}
          </p>
        </div>

        {/* Why is it used? */}
        <div 
          className="workspace-card" 
          style={{ 
            margin: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            border: '1px solid rgba(59, 130, 246, 0.1)', 
            background: 'rgba(59, 130, 246, 0.005)' 
          }}
        >
          <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-blue)' }}>
            Why is it used?
          </span>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)', margin: 0 }}>
            {whyAnswer}
          </p>
        </div>

        {/* What happens if removed? */}
        <div 
          className="workspace-card" 
          style={{ 
            margin: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            border: '1px solid rgba(239, 68, 68, 0.1)', 
            background: 'rgba(239, 68, 68, 0.005)' 
          }}
        >
          <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-red, #ef4444)' }}>
            What if it's missing?
          </span>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)', margin: 0 }}>
            {missingAnswer}
          </p>
        </div>
      </div>
    </div>
  );
};
