import React from 'react';
import { Card } from '../../ui/Card';

export const SettingsSection = ({ title, description, children }) => {
  return (
    <Card className="card-glass settings-group-section" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
          {title}
        </h3>
        {description && (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            {description}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {children}
      </div>
    </Card>
  );
};
