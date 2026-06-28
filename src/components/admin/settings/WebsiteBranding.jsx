import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { Input } from '../../ui/Input';

export const WebsiteBranding = ({ onBack }) => {
  const { settings, saveSettings } = useSettings();
  
  const [form, setForm] = useState({
    companyName: settings.companyName || '',
    companyTagline: settings.companyTagline || '',
    websiteLogo: settings.websiteLogo || '',
    websiteFavicon: settings.websiteFavicon || '',
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
        message: 'Website Branding Saved Successfully',
        lastUpdated: `${now}`
      });
    } catch (err) {
      console.error('Failed to save website branding:', err);
      alert('Failed to save settings: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadLogo = () => {
    handleChange('websiteLogo', '/assets/branding/logo-new.svg');
    alert("Image uploading will integrate with Supabase Storage in the next stage.");
  };

  const handleUploadFavicon = () => {
    handleChange('websiteFavicon', '/assets/branding/favicon-new.ico');
    alert("Favicon uploading will integrate with Supabase Storage in the next stage.");
  };

  return (
    <SettingsLayout
      title="Website Branding"
      description="Manage website name, logo, favicon and branding assets shown publicly."
      categoryName="Website"
      isDirty={isDirty}
      isLoading={isLoading}
      onSave={handleSave}
      onCancel={onBack}
      saveStatus={saveStatus}
    >
      <SettingsSection title="Identity & Logo Assets" description="Set up your company details and logo icons.">
        <div className="calc-row settings-field-row">
          <label className="form-label">Website Name</label>
          <Input
            type="text"
            className="form-input"
            placeholder="e.g. Flyen Labs"
            value={form.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
          />
        </div>
        <div className="calc-row settings-field-row">
          <label className="form-label">Website Tagline</label>
          <Input
            type="text"
            className="form-input"
            placeholder="e.g. Build. Learn. Innovate."
            value={form.companyTagline}
            onChange={(e) => handleChange('companyTagline', e.target.value)}
          />
        </div>

        <div className="calc-row settings-field-row">
          <label className="form-label">Website Logo</label>
          <div className="image-upload-wrapper">
            <div className="upload-preview-box">
              {form.websiteLogo ? (
                <div style={{ fontSize: '11px', color: 'var(--accent-violet)', fontWeight: '600' }}>
                  {form.websiteLogo.split('/').pop()}
                </div>
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No Logo</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                type="button"
                className="product-btn"
                onClick={handleUploadLogo}
                style={{ alignSelf: 'flex-start', fontSize: '11px', padding: '6px 12px' }}
              >
                Upload Logo
              </button>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Max size 2MB. SVG or PNG preferred.</span>
            </div>
          </div>
        </div>

        <div className="calc-row settings-field-row">
          <label className="form-label">Website Favicon</label>
          <div className="image-upload-wrapper">
            <div className="upload-preview-box">
              {form.websiteFavicon ? (
                <div style={{ fontSize: '11px', color: 'var(--accent-violet)', fontWeight: '600' }}>
                  {form.websiteFavicon.split('/').pop()}
                </div>
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No Icon</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                type="button"
                className="product-btn"
                onClick={handleUploadFavicon}
                style={{ alignSelf: 'flex-start', fontSize: '11px', padding: '6px 12px' }}
              >
                Upload Favicon
              </button>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Max size 500KB. ICO or PNG only.</span>
            </div>
          </div>
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
};
