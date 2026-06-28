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

export const AdminProfile = ({ onBack }) => {
  const { settings, saveSettings } = useSettings();
  const photoInputRef = useRef(null);

  const [form, setForm] = useState({
    profilePhoto: settings.profilePhoto || '',
    profileName: settings.profileName || '',
    profileEmail: settings.profileEmail || '',
    profilePhone: settings.profilePhone || '',
    profileDesignation: settings.profileDesignation || '',
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
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
        message: 'Profile Settings Saved Successfully',
        lastUpdated: `${now}`
      });
    } catch (err) {
      logger.error('Failed to save profile settings:', err);
      alert('Failed to save settings: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate Profile Photo: jpg, jpeg, png, webp, <= 5MB
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!allowedExts.includes(fileExt)) {
      alert(`Invalid profile photo type. Allowed: ${allowedExts.join(', ')}`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Profile photo size exceeds 5MB limit.');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const oldPath = extractPathFromUrl(form.profilePhoto, 'profiles');
      const targetName = `profile-photo-${Date.now()}.${fileExt}`;
      const result = await storageService.replaceFile('profiles', 'admin', file, oldPath, targetName);
      handleChange('profilePhoto', result.publicUrl);
    } catch (err) {
      logger.error('Profile photo upload failed:', err);
      alert('Failed to upload profile photo: ' + (err.message || 'Unknown error'));
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <SettingsLayout
      title="Profile Settings"
      description="Update personal administrator accounts, contact details and professional designation."
      categoryName="Administration"
      isDirty={isDirty}
      isLoading={isLoading}
      onSave={handleSave}
      onCancel={onBack}
      saveStatus={saveStatus}
    >
      <SettingsSection title="Administrator Identity" description="Set up personal representation values.">
        
        <div className="calc-row settings-field-row">
          <label className="form-label">Profile Photo</label>
          <div className="image-upload-wrapper">
            <div className="upload-preview-box" style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {form.profilePhoto ? (
                <img 
                  src={form.profilePhoto} 
                  alt="Profile Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avatar</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <input 
                type="file" 
                ref={photoInputRef} 
                style={{ display: 'none' }} 
                onChange={handlePhotoChange}
                accept=".jpg,.jpeg,.png,.webp"
              />
              <button
                type="button"
                className="product-btn"
                onClick={() => photoInputRef.current?.click()}
                disabled={isUploadingPhoto}
                style={{ alignSelf: 'flex-start', fontSize: '11px', padding: '6px 12px' }}
              >
                {isUploadingPhoto ? 'Uploading...' : 'Upload Photo'}
              </button>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Max size 5MB. Square ratio PNG, JPG, or WEBP.</span>
            </div>
          </div>
        </div>

        <div className="calc-row settings-field-row">
          <label className="form-label">Full Name</label>
          <Input
            type="text"
            className="form-input"
            placeholder="e.g. Akilesh"
            value={form.profileName}
            onChange={(e) => handleChange('profileName', e.target.value)}
          />
        </div>

        <div className="calc-row settings-field-row">
          <label className="form-label">Email Address</label>
          <Input
            type="email"
            className="form-input"
            placeholder="e.g. admin@flyenlabs.com"
            value={form.profileEmail}
            onChange={(e) => handleChange('profileEmail', e.target.value)}
          />
        </div>

        <div className="calc-row settings-field-row">
          <label className="form-label">Phone Number</label>
          <Input
            type="text"
            className="form-input"
            placeholder="e.g. +91 9876543210"
            value={form.profilePhone}
            onChange={(e) => handleChange('profilePhone', e.target.value)}
          />
        </div>

        <div className="calc-row settings-field-row">
          <label className="form-label">Designation / Role</label>
          <Input
            type="text"
            className="form-input"
            placeholder="e.g. Chief Administrator"
            value={form.profileDesignation}
            onChange={(e) => handleChange('profileDesignation', e.target.value)}
          />
        </div>

      </SettingsSection>
    </SettingsLayout>
  );
};
