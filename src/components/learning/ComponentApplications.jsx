import React, { useState, useEffect } from 'react';

export const ComponentApplications = ({ component }) => {
  const apps = component.applications || [];
  const [activeApp, setActiveApp] = useState(apps[0] || null);

  // Sync active app if component changes
  useEffect(() => {
    if (apps.length > 0) {
      setActiveApp(apps[0]);
    } else {
      setActiveApp(null);
    }
  }, [component, apps]);

  if (apps.length === 0) return null;

  return (
    <section 
      className="workspace-card" 
      id="product-applications-section"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <div>
        <span style={{ fontSize: '10px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
          Real-World context
        </span>
        <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
          Where You See This
        </h2>
      </div>

      <div className="product-context-widget">
        {/* Product buttons list */}
        <div className="product-selector-row">
          {apps.map((app, idx) => (
            <button
              key={idx}
              className={`product-btn ${activeApp?.product === app.product ? 'active' : ''}`}
              onClick={() => setActiveApp(app)}
            >
              {app.product}
            </button>
          ))}
        </div>

        {/* Selected Product Role Explanation */}
        {activeApp && (
          <div className="product-display-card">
            <span className="product-role-tag">{activeApp.role}</span>
            <p className="product-desc-text">{activeApp.desc}</p>
          </div>
        )}
      </div>
    </section>
  );
};
