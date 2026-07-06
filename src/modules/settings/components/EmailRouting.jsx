import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { Input } from '../../../shared/components/ui/Input';

export const EmailRouting = ({ onBack }) => {
  const { settings, saveSettings } = useSettings();

  const [form, setForm] = useState({
    contactEmail: settings.contactEmail || '',
    notificationEmail: settings.notificationEmail || '',
    replyToEmail: settings.replyToEmail || '',
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
        message: 'Email & Contact routes saved successfully',
        lastUpdated: `${now}`
      });
    } catch (err) {
      console.error('Failed to save email routing:', err);
      alert('Failed to save settings: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsLayout
      title="Email Routing"
      description="Configure public contact destinations, notifications, and reply fallback addresses."
      categoryName="Communication"
      isDirty={isDirty}
      isLoading={isLoading}
      onSave={handleSave}
      onCancel={onBack}
      saveStatus={saveStatus}
    >
      <SettingsSection title="Email Routing Channels" description="Route notifications and inquiries to correct admin dropboxes.">
        <div className="calc-row settings-field-row">
          <label className="form-label">Contact Inquiry Destination</label>
          <Input
            type="email"
            className="form-input"
            placeholder="e.g. hello@flyenlabs.com"
            value={form.contactEmail}
            onChange={(e) => handleChange('contactEmail', e.target.value)}
          />
        </div>

        <div className="calc-row settings-field-row">
          <label className="form-label">System Notification Email</label>
          <Input
            type="email"
            className="form-input"
            placeholder="e.g. system@flyenlabs.com"
            value={form.notificationEmail}
            onChange={(e) => handleChange('notificationEmail', e.target.value)}
          />
        </div>

        <div className="calc-row settings-field-row">
          <label className="form-label">Default Reply-To Address</label>
          <Input
            type="email"
            className="form-input"
            placeholder="e.g. support@flyenlabs.com"
            value={form.replyToEmail}
            onChange={(e) => handleChange('replyToEmail', e.target.value)}
          />
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
};
