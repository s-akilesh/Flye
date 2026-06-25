import React from 'react';

export const ComponentQuickSummary = ({ component }) => {
  const summaryItems = component.quickSummary || [];

  if (summaryItems.length === 0) return null;

  return (
    <section className="workspace-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <span style={{ fontSize: '10px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
          Revision Guide
        </span>
        <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
          Quick Summary
        </h2>
      </div>

      <div className="summary-checklist">
        {summaryItems.map((item, idx) => (
          <div key={idx} className="summary-check-item">
            <span className="summary-check-icon">✓</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
