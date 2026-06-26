import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { Input } from '../../ui/Input';

export const WebsiteSettings = ({ onBack }) => {
  const { settings, saveSettings } = useSettings();
  
  // Local form state
  const [form, setForm] = useState({
    companyName: settings.companyName || '',
    companyTagline: settings.companyTagline || '',
    contactEmail: settings.contactEmail || '',
    contactPhone: settings.contactPhone || '',
    whatsappNumber: settings.whatsappNumber || '',
    companyAddress: settings.companyAddress || '',
    websiteLogo: settings.websiteLogo || '',
    websiteFavicon: settings.websiteFavicon || '',
    footerText: settings.footerText || '',
    copyrightText: settings.copyrightText || '',
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Check if form is dirty
  useEffect(() => {
    const changed = Object.keys(form).some(key => form[key] !== (settings[key] || ''));
    setIsDirty(changed);
  }, [form, settings]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API saving
    await new Promise(resolve => setTimeout(resolve, 800));
    saveSettings(form);
    setIsLoading(false);
    setIsDirty(false);
    
    // Get current formatted time
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSaveStatus({
      message: 'Settings Saved Successfully',
      lastUpdated: `${now}`
    });
  };

  // Mock upload handlers
  const handleUploadLogo = () => {
    // For now we set a mock file path, but the UI is upload-ready
    handleChange('websiteLogo', '/assets/branding/logo-new.svg');
    alert("Image uploading will integrate with Supabase Storage in the next stage.");
  };

  const handleUploadFavicon = () => {
    handleChange('websiteFavicon', '/assets/branding/favicon-new.ico');
    alert("Favicon uploading will integrate with Supabase Storage in the next stage.");
  };

  return (
    <SettingsLayout
      title="Website Settings"
      description="Configure website branding, logos, tags, and footer info shown publicly."
      categoryName="Website Settings"
      isDirty={isDirty}
      isLoading={isLoading}
      onSave={handleSave}
      onCancel={onBack}
      saveStatus={saveStatus}
    >
      {/* Group 1: Branding */}
      <SettingsSection title="Branding" description="Manage your website branding, title, tagline, and icons.">
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

        {/* Upload-Ready Logo Field */}
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

        {/* Upload-Ready Favicon Field */}
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

      {/* Group 2: Contact Information */}
      <SettingsSection title="Contact Information" description="Business details displayed in the contact pages and headers.">
        <div className="calc-row settings-field-row">
          <label className="form-label">Contact Email</label>
          <Input
            type="email"
            className="form-input"
            placeholder="e.g. contact@flyenlabs.com"
            value={form.contactEmail}
            onChange={(e) => handleChange('contactEmail', e.target.value)}
          />
        </div>
        <div className="calc-row settings-field-row">
          <label className="form-label">Phone Number</label>
          <Input
            type="tel"
            className="form-input"
            placeholder="e.g. +91 9876543210"
            value={form.contactPhone}
            onChange={(e) => handleChange('contactPhone', e.target.value)}
          />
        </div>
        <div className="calc-row settings-field-row">
          <label className="form-label">WhatsApp Number</label>
          <Input
            type="tel"
            className="form-input"
            placeholder="e.g. 919876543210 (include country code, no + or spaces)"
            value={form.whatsappNumber}
            onChange={(e) => handleChange('whatsappNumber', e.target.value)}
          />
        </div>
        <div className="calc-row settings-field-row">
          <label className="form-label">Address</label>
          <Input
            type="text"
            className="form-input"
            placeholder="e.g. Sector 7 Tech Hub, Bangalore"
            value={form.companyAddress}
            onChange={(e) => handleChange('companyAddress', e.target.value)}
          />
        </div>
      </SettingsSection>

      {/* Group 3: Footer */}
      <SettingsSection title="Footer" description="Branding and copyright details shown at the bottom of the pages.">
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

      {/* Group 4: Future placeholder */}
      <SettingsSection title="Search Engine Optimization (SEO) & Analytics" description="Advanced metadata configuration. (Coming Soon)">
        <div style={{ opacity: 0.5, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="calc-row settings-field-row">
            <label className="form-label">Google Analytics ID</label>
            <Input type="text" className="form-input" placeholder="G-XXXXXXXXXX" disabled />
          </div>
          <div className="calc-row settings-field-row">
            <label className="form-label">SEO Meta Description</label>
            <Input type="text" className="form-input" placeholder="Enter site meta description..." disabled />
          </div>
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
};
