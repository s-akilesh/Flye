import React from 'react';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';

export const SystemPrefs = ({ onBack }) => {
  return (
    <SettingsLayout
      title="System Preferences"
      description="Configure admin dashboard timezones, languages, and regional settings."
      categoryName="Administration"
      isDirty={false}
      isLoading={false}
      onSave={() => {}}
      onCancel={onBack}
    >
      <SettingsSection title="Locales & Timezones (Coming Soon)" description="Regional workspace defaults.">
        <div style={{ opacity: 0.5, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="calc-row settings-field-row">
            <label className="form-label">Preferred Time Zone</label>
            <select className="form-select" disabled defaultValue="UTC+5:30">
              <option value="UTC+5:30">Kolkata, Chennai (UTC+5:30)</option>
            </select>
          </div>
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
};
