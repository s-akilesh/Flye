import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { Input } from '../../../shared/components/ui/Input';
import { storageService } from '../../../shared/services/storageService';
import { logger } from '../../../shared/utils/logger';

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
  const [isUploadingSlider, setIsUploadingSlider] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const sliderInputRef = useRef(null);

  // S3 Storage Files State (direct from website-assets/landingscreen-slider)
  const [s3Files, setS3Files] = useState([]);
  const [isLoadingS3, setIsLoadingS3] = useState(false);

  const loadS3Files = async () => {
    setIsLoadingS3(true);
    try {
      const files = await storageService.listFiles('website-assets', 'landingscreen-slider');
      const validFiles = (files || []).filter(f => 
        f.name && 
        !f.name.startsWith('.') &&
        /\.(jpe?g|png|webp|svg|gif|avif)$/i.test(f.name)
      );
      setS3Files(validFiles);
    } catch (e) {
      logger.error('Failed to list files from S3 landingscreen-slider:', e);
    } finally {
      setIsLoadingS3(false);
    }
  };

  useEffect(() => {
    loadS3Files();
  }, []);

  const handleUploadSliderImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExts = ['png', 'jpg', 'jpeg', 'webp', 'svg'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!allowedExts.includes(fileExt)) {
      alert(`Invalid image type. Allowed: ${allowedExts.join(', ')}`);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size exceeds 10MB limit.');
      return;
    }

    setIsUploadingSlider(true);
    try {
      await storageService.uploadFile('website-assets', 'landingscreen-slider', file, file.name);
      await loadS3Files();
      alert(`Successfully uploaded "${file.name}" to Landing Screen Slider!`);
    } catch (err) {
      logger.error('Failed to upload slider image:', err);
      alert('Failed to upload image: ' + (err.message || 'Unknown error'));
    } finally {
      setIsUploadingSlider(false);
      if (sliderInputRef.current) sliderInputRef.current.value = '';
    }
  };

  const handleDeleteS3File = async (fileName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${fileName}" from S3 storage? It will immediately disappear from the landing screen slider.`)) {
      return;
    }
    try {
      const res = await storageService.deleteFile('website-assets', `landingscreen-slider/${fileName}`);
      if (!res.success && res.error) {
        throw new Error(res.error);
      }
      await loadS3Files();
      alert(`Deleted "${fileName}" from S3 storage.`);
    } catch (err) {
      logger.error('Failed to delete S3 file:', err);
      alert('Failed to delete from S3: ' + (err.message || 'Unknown error'));
    }
  };

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
      const oldPath = extractPathFromUrl(form.websiteLogo, 'website-assets') || extractPathFromUrl(form.websiteLogo, 'logos');
      const targetName = `website-logo-${Date.now()}.${fileExt}`;
      const result = await storageService.replaceFile('website-assets', 'logos', file, oldPath, targetName);
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
      const oldPath = extractPathFromUrl(form.websiteFavicon, 'website-assets') || extractPathFromUrl(form.websiteFavicon, 'favicons');
      const targetName = `favicon-${Date.now()}.${fileExt}`;
      const result = await storageService.replaceFile('website-assets', 'favicons', file, oldPath, targetName);
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
                <span style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>No Logo</span>
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
              <span style={{ fontSize: '10px', color: 'var(--txt-muted)' }}>Max size 5MB. SVG, PNG, JPG, or WEBP.</span>
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
                <span style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>No Icon</span>
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
              <span style={{ fontSize: '10px', color: 'var(--txt-muted)' }}>Max size 1MB. ICO, PNG, or SVG only.</span>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection 
        title="Landing Screen Slider Images (S3 Storage)" 
        description="Live view of images stored in the S3 bucket folder website-assets/landingscreen-slider. Any image in this folder is automatically shown on the landing page slider in real-time."
      >
        {/* Header Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', background: 'var(--sys-surface)', border: '1px solid var(--sys-border)', padding: '4px 10px', borderRadius: '20px', color: 'var(--txt-secondary)' }}>
              Live S3 Images: <strong>{s3Files.length}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              type="file" 
              ref={sliderInputRef} 
              style={{ display: 'none' }} 
              onChange={handleUploadSliderImage}
              accept=".png,.jpg,.jpeg,.webp,.svg"
            />
            <button
              type="button"
              className="product-btn"
              onClick={() => sliderInputRef.current?.click()}
              disabled={isUploadingSlider}
              style={{ fontSize: '11px', padding: '6px 12px', background: 'var(--flyen-teal, #00dfa2)', color: '#090d16', fontWeight: '700' }}
            >
              {isUploadingSlider ? 'Uploading to S3...' : '➕ Upload New Image'}
            </button>
            <button
              type="button"
              className="product-btn"
              onClick={loadS3Files}
              disabled={isLoadingS3}
              style={{ fontSize: '11px', padding: '6px 12px' }}
            >
              {isLoadingS3 ? 'Refreshing...' : '🔄 Refresh S3 Images'}
            </button>
          </div>
        </div>

        {/* S3 Storage Files Grid */}
        {isLoadingS3 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--txt-muted)' }}>Loading files from S3 storage...</div>
        ) : s3Files.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', background: 'var(--sys-surface)', borderRadius: '8px', border: '1px solid var(--sys-border)', color: 'var(--txt-muted)', fontSize: '13px' }}>
            No images found in S3 storage folder <code>website-assets/landingscreen-slider</code>. Place images directly inside this bucket folder to display them automatically on the homepage landing slider.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
            {s3Files.map((file, idx) => {
              const rawUrl = storageService.getPublicUrl('website-assets', `landingscreen-slider/${file.name}`);
              const version = file.updated_at ? new Date(file.updated_at).getTime() : Date.now();
              const publicUrl = rawUrl ? `${rawUrl}?v=${version}` : '';
              const sizeKb = file.metadata?.size 
                ? (file.metadata.size / 1024).toFixed(0) + ' KB' 
                : (file.size ? (file.size / 1024).toFixed(0) + ' KB' : 'Image');
              
              const displayName = file.name
                .replace(/\.[^/.]+$/, '')
                .replace(/^slider-[\d]+-/, '')
                .replace(/[_-]+/g, ' ');

              return (
                <div 
                  key={file.id || file.name || idx}
                  style={{
                    background: 'var(--sys-surface)',
                    border: '1px solid var(--sys-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ height: '140px', background: '#000', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={publicUrl} 
                      alt={file.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span 
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: 'rgba(0, 223, 162, 0.9)',
                        color: '#090d16',
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      LIVE ON LANDING
                    </span>
                  </div>

                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <div 
                      title={file.name}
                      style={{ fontWeight: '600', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {displayName || file.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--txt-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <code>{file.name}</code>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--txt-muted)' }}>
                      Size: {sizeKb}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--sys-border)' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteS3File(file.name)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '11px',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px 0',
                          fontWeight: '500'
                        }}
                      >
                        Delete from S3
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SettingsSection>
    </SettingsLayout>
  );
};
