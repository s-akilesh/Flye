import React, { useState, useMemo } from 'react';
import { LearningRepository } from '../../data/learning';

export const Fundamentals = () => {
  const fundamentals = useMemo(() => LearningRepository.getFundamentals(), []);
  const [selectedConcept, setSelectedConcept] = useState(fundamentals[0]);

  return (
    <div>
      <header className="workspace-page-header">
        <h1>Electrical Basics</h1>
        <p>Master core electrical concepts visually and conceptually before diving into technical terms.</p>
      </header>

      {/* Concept Selector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {fundamentals.map((concept) => {
          const isActive = selectedConcept?.id === concept.id;
          return (
            <div 
              key={concept.id}
              className="workspace-card"
              style={{
                gridColumn: 'span 4',
                cursor: 'pointer',
                borderWidth: '1px',
                borderColor: isActive ? 'var(--accent-violet)' : 'var(--border-subtle)',
                background: isActive ? 'rgba(139, 92, 246, 0.04)' : 'var(--surface-card)',
                boxShadow: isActive ? '0 0 15px rgba(139, 92, 246, 0.1)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
              onClick={() => setSelectedConcept(concept)}
            >
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: isActive ? 'var(--accent-violet)' : 'var(--text-primary)' }}>
                {concept.title}
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                {concept.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Concept Learning Cards Section */}
      {selectedConcept && (
        <section 
          className="workspace-card" 
          style={{ 
            background: 'rgba(255, 255, 255, 0.01)', 
            borderColor: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          <div>
            <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-violet)' }}>
              Deep Dive
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '4px 0 8px 0', color: 'var(--text-primary)' }}>
              {selectedConcept.title}
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              {selectedConcept.description}
            </p>
          </div>

          <div className="learning-cards-grid">
            {selectedConcept.cards.map((card, idx) => (
              <div key={idx} className="learning-card">
                <h4 className="learning-card-question">{card.question}</h4>
                <p className="learning-card-answer">{card.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
