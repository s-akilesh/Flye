import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { Input } from '../../ui/Input';

export const ContactEmailSettings = ({ onBack }) => {
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
    await new Promise(resolve => setTimeout(resolve, 800));
    saveSettings(form);
    setIsLoading(false);
    setIsDirty(false);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSaveStatus({
      message: 'Email & Contact routes saved',
      lastUpdated: `${now}`
    });
  };

  return (
    <SettingsLayout
      title="Contact & Email Routing"
      description="Configure public contact email destinations, automated system alerts, and fallback reply routing."
      categoryName="Contact & Email"
      isDirty={isDirty}
      isLoading={isLoading}
      onSave={handleSave}
      onCancel={onBack}
      saveStatus={saveStatus}
    >
      <SettingsSection title="Email Channels" description="Route inbound and outbound messages to appropriate administrators.">
        
        <div className="calc-row settings-field-row">
          <label className="form-label">Contact Inquiry Email</label>
          <Input
            type="email"
            className="form-input"
            placeholder="e.g. hello@flyenlabs.com"
            value={form.contactEmail}
            onChange={(e) => handleChange('contactEmail', e.target.value)}
          />
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Where all public contact form inquiries will be sent.
          </p>
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
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Receives notifications for critical alerts, new users, or security logs.
          </p>
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
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Fallback reply-to headers when clients reply directly to automated platform emails.
          </p>
        </div>

      </SettingsSection>

      {/* SMTP configuration section placeholder */}
      <SettingsSection title="SMTP Configuration" description="Configure outbound mail servers and authentication details. (Coming Soon)">
        <div style={{ opacity: 0.5, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="calc-row settings-field-row">
            <label className="form-label">SMTP Hostname</label>
            <Input type="text" className="form-input" placeholder="smtp.gmail.com" disabled />
          </div>
          <div className="calc-row settings-field-row">
            <label className="form-label">SMTP Port</label>
            <Input type="text" className="form-input" placeholder="587" disabled />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <div className="calc-row settings-field-row" style={{ flex: 1 }}>
              <label className="form-label">SMTP User</label>
              <Input type="text" className="form-input" placeholder="smtp-user" disabled />
            </div>
            <div className="calc-row settings-field-row" style={{ flex: 1 }}>
              <label className="form-label">SMTP Password</label>
              <Input type="password" className="form-input" placeholder="••••••••" disabled />
            </div>
          </div>
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
};
