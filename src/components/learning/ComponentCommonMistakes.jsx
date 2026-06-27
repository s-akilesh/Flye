import React from 'react';

export const ComponentCommonMistakes = ({ component }) => {
  const mistakes = component.commonMistakes || [];

  if (mistakes.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-red, #ef4444)' }}>
          Pitfalls & Warnings
        </span>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '4px 0 8px 0' }}>
          Common Mistakes
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
          Watch out for these common engineering slip-ups to prevent circuit failures or burning out components.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {mistakes.map((mistake, idx) => (
          <div 
            key={idx} 
            className="learning-card" 
            style={{ 
              background: 'rgba(239, 68, 68, 0.01)', 
              borderColor: 'rgba(239, 68, 68, 0.08)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <h4 className="learning-card-question" style={{ color: 'var(--accent-red, #ef4444)', fontSize: '13.5px', fontWeight: '750', margin: 0 }}>
              ⚠️ {mistake.question}
            </h4>
            <p className="learning-card-answer" style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              {mistake.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
