import React from 'react';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';

export const SMTPSettings = ({ onBack }) => {
  return (
    <SettingsLayout
      title="SMTP Mail Server"
      description="Configure outbound mail servers, secure SMTP ports, and login credentials."
      categoryName="Communication"
      isDirty={false}
      isLoading={false}
      onSave={() => {}}
      onCancel={onBack}
    >
      <SettingsSection title="SMTP Configuration (Coming Soon)" description="Outbound mail routing.">
        <div style={{ opacity: 0.5, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="calc-row settings-field-row">
            <label className="form-label">SMTP Hostname</label>
            <input type="text" className="form-input" placeholder="smtp.gmail.com" disabled />
          </div>
          <div className="calc-row settings-field-row">
            <label className="form-label">SMTP Port</label>
            <input type="text" className="form-input" placeholder="587" disabled />
          </div>
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
};
