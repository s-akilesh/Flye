import React from 'react';

export const ComponentLearningCards = ({ component }) => {
  const activeCards = component.defaultCards || [];

  return (
    <section className="workspace-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <span style={{ fontSize: '10px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-violet)' }}>
          Learning Cards
        </span>
        <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
          Core Q&A
        </h2>
      </div>

      {activeCards.length > 0 ? (
        <div className="learning-cards-grid">
          {activeCards.map((card, idx) => (
            <div key={idx} className="learning-card">
              <h4 className="learning-card-question">{card.question}</h4>
              <p className="learning-card-answer">{card.answer}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
          No learning cards available for this component.
        </div>
      )}
    </section>
  );
};
