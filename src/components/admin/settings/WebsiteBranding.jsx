import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { Input } from '../../ui/Input';
import { storageService } from '../../../services/storageService';
import { logger } from '../../../utils/logger';

const extractPathFromUrl = (url, bucket) => {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    return url.substring(idx + marker.length);
  }
  return null;
};

export const WebsiteBranding = ({ onBack }) => {
  const { settings, saveSettings } = useSettings();
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);
  
  const [form, setForm] = useState({
    companyName: settings.companyName || '',
    companyTagline: settings.companyTagline || '',
    websiteLogo: settings.websiteLogo || '',
    websiteFavicon: settings.websiteFavicon || '',
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
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
      logger.error('Failed to save website branding:', err);
      alert('Failed to save settings: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate Logo: png, jpg, jpeg, webp, svg, <= 5MB
    const allowedExts = ['png', 'jpg', 'jpeg', 'webp', 'svg'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!allowedExts.includes(fileExt)) {
      alert(`Invalid logo image type. Allowed: ${allowedExts.join(', ')}`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Logo size exceeds 5MB limit.');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const oldPath = extractPathFromUrl(form.websiteLogo, 'logos');
      const targetName = `website-logo-${Date.now()}.${fileExt}`;
      const result = await storageService.replaceFile('logos', 'website', file, oldPath, targetName);
      handleChange('websiteLogo', result.publicUrl);
    } catch (err) {
      logger.error('Logo upload failed:', err);
      alert('Failed to upload logo: ' + (err.message || 'Unknown error'));
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleFaviconChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate Favicon: ico, png, svg, <= 1MB
    const allowedExts = ['ico', 'png', 'svg'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!allowedExts.includes(fileExt)) {
      alert(`Invalid favicon type. Allowed: ${allowedExts.join(', ')}`);
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      alert('Favicon size exceeds 1MB limit.');
      return;
    }

    setIsUploadingFavicon(true);
    try {
      const oldPath = extractPathFromUrl(form.websiteFavicon, 'favicons');
      const targetName = `favicon-${Date.now()}.${fileExt}`;
      const result = await storageService.replaceFile('favicons', 'website', file, oldPath, targetName);
      handleChange('websiteFavicon', result.publicUrl);
    } catch (err) {
      logger.error('Favicon upload failed:', err);
      alert('Failed to upload favicon: ' + (err.message || 'Unknown error'));
    } finally {
      setIsUploadingFavicon(false);
    }
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
                <img 
                  src={form.websiteLogo} 
                  alt="Logo Preview" 
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
                />
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No Logo</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <input 
                type="file" 
                ref={logoInputRef} 
                style={{ display: 'none' }} 
                onChange={handleLogoChange}
                accept=".png,.jpg,.jpeg,.webp,.svg"
              />
              <button
                type="button"
                className="product-btn"
                onClick={() => logoInputRef.current?.click()}
                disabled={isUploadingLogo}
                style={{ alignSelf: 'flex-start', fontSize: '11px', padding: '6px 12px' }}
              >
                {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
              </button>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Max size 5MB. SVG, PNG, JPG, or WEBP.</span>
            </div>
          </div>
        </div>

        <div className="calc-row settings-field-row">
          <label className="form-label">Website Favicon</label>
          <div className="image-upload-wrapper">
            <div className="upload-preview-box">
              {form.websiteFavicon ? (
                <img 
                  src={form.websiteFavicon} 
                  alt="Favicon Preview" 
                  style={{ maxHeight: '24px', maxWidth: '24px', objectFit: 'contain' }} 
                />
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No Icon</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <input 
                type="file" 
                ref={faviconInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFaviconChange}
                accept=".ico,.png,.svg"
              />
              <button
                type="button"
                className="product-btn"
                onClick={() => faviconInputRef.current?.click()}
                disabled={isUploadingFavicon}
                style={{ alignSelf: 'flex-start', fontSize: '11px', padding: '6px 12px' }}
              >
                {isUploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
              </button>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Max size 1MB. ICO, PNG, or SVG only.</span>
            </div>
          </div>
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
};
