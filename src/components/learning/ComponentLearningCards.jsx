import React, { useMemo } from 'react';

export const ComponentLearningCards = ({ component, selectedPartId, onClearSelection }) => {
  // Find selected part info
  const selectedPart = useMemo(() => {
    if (!selectedPartId || !component.parts) return null;
    return component.parts.find(p => p.id === selectedPartId);
  }, [component, selectedPartId]);

  // Determine which cards to display
  const activeCards = useMemo(() => {
    if (selectedPart && selectedPart.cards) {
      return selectedPart.cards;
    }
    return component.defaultCards || [];
  }, [component, selectedPart]);

  return (
    <section className="workspace-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header with quick context filter info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
            Concept Cards
          </span>
          <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
            {selectedPart ? `Inside the Component: ${selectedPart.name}` : 'Core Fundamentals'}
          </h2>
        </div>

        {/* Clear selection link */}
        {selectedPart && (
          <button 
            onClick={onClearSelection}
            className="product-btn"
            style={{ 
              fontSize: '11px', 
              padding: '6px 10px', 
              background: 'rgba(239, 68, 68, 0.08)',
              borderColor: 'rgba(239, 68, 68, 0.2)',
              color: 'var(--color-danger, #ef4444)'
            }}
          >
            Reset filter ✕
          </button>
        )}
      </div>

      {/* Cards List */}
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
          No learning cards available for this part.
        </div>
      )}
    </section>
  );
};
