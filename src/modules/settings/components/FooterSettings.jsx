import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { Input } from '../../../shared/components/ui/Input';

export const FooterSettings = ({ onBack }) => {
  const { settings, saveSettings } = useSettings();

  const [form, setForm] = useState({
    footerText: settings.footerText || '',
    copyrightText: settings.copyrightText || '',
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    const changed = Object.keys(form).some(key => form[key] !== (settings[key] || ''));
    setIsDirty(changed);
  }, [form, settings]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      await saveSettings(form);
      setIsDirty(false);

      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveStatus({
        message: 'Footer Settings Saved Successfully',
        lastUpdated: `${now}`
      });
    } catch (err) {
      console.error('Failed to save footer settings:', err);
      alert('Failed to save settings: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsLayout
      title="Footer Settings"
      description="Configure branding texts, copyright details, and terms visible at the bottom of public pages."
      categoryName="Website"
      isDirty={isDirty}
      isLoading={isLoading}
      onSave={handleSave}
      onCancel={onBack}
      saveStatus={saveStatus}
    >
      <SettingsSection title="Footer Branding" description="Set custom tagline and copyrights for layout footers.">
        <div className="calc-row settings-field-row">
          <label className="form-label">Footer Tagline/Text</label>
          <Input
            type="text"
            className="form-input"
            placeholder="e.g. Building next-generation engineers."
            value={form.footerText}
            onChange={(e) => handleChange('footerText', e.target.value)}
          />
        </div>
        <div className="calc-row settings-field-row">
          <label className="form-label">Copyright Notice</label>
          <Input
            type="text"
            className="form-input"
            placeholder="e.g. © 2026 Flyen. All rights reserved."
            value={form.copyrightText}
            onChange={(e) => handleChange('copyrightText', e.target.value)}
          />
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
};
