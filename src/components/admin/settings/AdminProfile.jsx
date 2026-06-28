import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { Input } from '../../ui/Input';

export const AdminProfile = ({ onBack }) => {
  const { settings, saveSettings } = useSettings();

  const [form, setForm] = useState({
    profilePhoto: settings.profilePhoto || '',
    profileName: settings.profileName || '',
    profileEmail: settings.profileEmail || '',
    profilePhone: settings.profilePhone || '',
    profileDesignation: settings.profileDesignation || '',
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
        message: 'Profile Settings Saved Successfully',
        lastUpdated: `${now}`
      });
    } catch (err) {
      console.error('Failed to save profile settings:', err);
      alert('Failed to save settings: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadPhoto = () => {
    handleChange('profilePhoto', '/assets/profiles/admin-photo.jpg');
    alert("Profile photo uploading will integrate with Supabase Storage in the next stage.");
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
            <div className="upload-preview-box" style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden' }}>
              {form.profilePhoto ? (
                <div style={{ fontSize: '11px', color: 'var(--accent-violet)', fontWeight: '600' }}>
                  Photo
                </div>
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avatar</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                type="button"
                className="product-btn"
                onClick={handleUploadPhoto}
                style={{ alignSelf: 'flex-start', fontSize: '11px', padding: '6px 12px' }}
              >
                Upload Photo
              </button>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Max size 1MB. Square ratio PNG/JPG.</span>
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
            type="tel"
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
