import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';

export const SystemPrefs = ({ onBack }) => {
  const { settings, saveSettings } = useSettings();
  const [form, setForm] = useState({
    maintenanceMode: settings.maintenanceMode || false,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    setIsDirty(form.maintenanceMode !== (settings.maintenanceMode || false));
  }, [form, settings]);

  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      await saveSettings({ ...settings, ...form });
      setIsDirty(false);
      
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveStatus({
        message: 'System preferences updated successfully',
        lastUpdated: now
      });
    } catch (err) {
      console.error('Failed to save system preferences:', err);
      alert('Failed to save settings: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsLayout
      title="System Preferences"
      description="Configure system preferences, maintenance mode, and regional settings."
      categoryName="Administration"
      isDirty={isDirty}
      isLoading={isLoading}
      onSave={handleSave}
      onCancel={onBack}
      saveStatus={saveStatus}
    >
      <SettingsSection title="System Status" description="Toggle public access to the platform.">
        <div className="calc-row settings-field-row">
          <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Maintenance Mode</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={form.maintenanceMode}
              onChange={(e) => setForm({ maintenanceMode: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="maintenanceMode" style={{ fontSize: '13px', color: form.maintenanceMode ? 'var(--accent-crimson)' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer' }}>
              {form.maintenanceMode ? 'Enabled (Site is locked)' : 'Disabled (Site is public)'}
            </label>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px', display: 'block', lineHeight: '1.4' }}>
            When enabled, all non-admin users will see the maintenance cover page.
          </span>
        </div>
      </SettingsSection>

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
