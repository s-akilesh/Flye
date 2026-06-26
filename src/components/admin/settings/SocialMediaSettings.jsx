import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { Input } from '../../ui/Input';

export const SocialMediaSettings = ({ onBack }) => {
  const { settings, saveSettings } = useSettings();

  const [form, setForm] = useState({
    facebookUrl: settings.facebookUrl || '',
    instagramUrl: settings.instagramUrl || '',
    linkedinUrl: settings.linkedinUrl || '',
    youtubeUrl: settings.youtubeUrl || '',
    twitterUrl: settings.twitterUrl || '',
    githubUrl: settings.githubUrl || '',
    websiteUrl: settings.websiteUrl || '',
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
      message: 'Social Media configuration saved',
      lastUpdated: `${now}`
    });
  };

  // Helper to render label with dynamic connection status badge
  const renderFieldLabel = (label, value) => {
    const connected = !!value;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span className="form-label" style={{ margin: 0 }}>{label}</span>
        <span 
          className={`social-connection-status ${connected ? 'connected' : 'unconfigured'}`}
          style={{
            fontSize: '9px',
            fontWeight: '750',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: '2px 8px',
            borderRadius: '12px',
            background: connected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${connected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
            color: connected ? 'var(--accent-emerald)' : 'var(--text-muted)'
          }}
        >
          {connected ? '✓ Connected' : 'Not Configured'}
        </span>
      </div>
    );
  };

  return (
    <SettingsLayout
      title="Social Media Links"
      description="Connect your company social media handles and external websites shown publicly."
      categoryName="Social Media"
      isDirty={isDirty}
      isLoading={isLoading}
      onSave={handleSave}
      onCancel={onBack}
      saveStatus={saveStatus}
    >
      <SettingsSection title="Social Networks" description="Provide full URLs starting with https:// for active links.">
        
        <div className="calc-row settings-field-row" style={{ marginBottom: 'var(--space-3)' }}>
          {renderFieldLabel('LinkedIn Profile', form.linkedinUrl)}
          <Input
            type="url"
            className="form-input"
            placeholder="https://linkedin.com/company/yourpage"
            value={form.linkedinUrl}
            onChange={(e) => handleChange('linkedinUrl', e.target.value)}
          />
        </div>

        <div className="calc-row settings-field-row" style={{ marginBottom: 'var(--space-3)' }}>
          {renderFieldLabel('Instagram Handle', form.instagramUrl)}
          <Input
            type="url"
            className="form-input"
            placeholder="https://instagram.com/yourhandle"
            value={form.instagramUrl}
            onChange={(e) => handleChange('instagramUrl', e.target.value)}
          />
        </div>

        <div className="calc-row settings-field-row" style={{ marginBottom: 'var(--space-3)' }}>
          {renderFieldLabel('YouTube Channel', form.youtubeUrl)}
          <Input
            type="url"
            className="form-input"
            placeholder="https://youtube.com/@yourchannel"
            value={form.youtubeUrl}
            onChange={(e) => handleChange('youtubeUrl', e.target.value)}
          />
        </div>

        <div className="calc-row settings-field-row" style={{ marginBottom: 'var(--space-3)' }}>
          {renderFieldLabel('X (Twitter) Profile', form.twitterUrl)}
          <Input
            type="url"
            className="form-input"
            placeholder="https://x.com/yourhandle"
            value={form.twitterUrl}
            onChange={(e) => handleChange('twitterUrl', e.target.value)}
          />
        </div>

        <div className="calc-row settings-field-row" style={{ marginBottom: 'var(--space-3)' }}>
          {renderFieldLabel('Facebook Page', form.facebookUrl)}
          <Input
            type="url"
            className="form-input"
            placeholder="https://facebook.com/yourpage"
            value={form.facebookUrl}
            onChange={(e) => handleChange('facebookUrl', e.target.value)}
          />
        </div>

        <div className="calc-row settings-field-row" style={{ marginBottom: 'var(--space-3)' }}>
          {renderFieldLabel('GitHub Repository', form.githubUrl)}
          <Input
            type="url"
            className="form-input"
            placeholder="https://github.com/yourprofile"
            value={form.githubUrl}
            onChange={(e) => handleChange('githubUrl', e.target.value)}
          />
        </div>

        <div className="calc-row settings-field-row" style={{ marginBottom: 'var(--space-3)' }}>
          {renderFieldLabel('External Website URL', form.websiteUrl)}
          <Input
            type="url"
            className="form-input"
            placeholder="https://yourwebsite.com"
            value={form.websiteUrl}
            onChange={(e) => handleChange('websiteUrl', e.target.value)}
          />
        </div>

      </SettingsSection>
    </SettingsLayout>
  );
};
