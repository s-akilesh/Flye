import React, { useState, useEffect, useRef } from 'react';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { Input } from '../../../shared/components/ui/Input';
import { avatarService } from '../../../shared/services/avatarService';
import { logger } from '../../../shared/utils/logger';
import { useAuth } from '../../auth/context/AuthContext.jsx';
import { userService } from '../../auth/services/userService';

export const ProfileForm = ({ onBack, hideBreadcrumbs = false, hideCancel = false }) => {
  const { user, profile, refreshProfile, isAdmin } = useAuth();
  const photoInputRef = useRef(null);

  const [form, setForm] = useState({
    profilePhoto: '',
    profileName: '',
    profileEmail: '',
    profilePhone: '',
    profileDesignation: '',
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Helper to construct initial form values from auth/profile
  const getInitialValues = () => {
    return {
      profilePhoto: profile?.profile_photo || '',
      profileName: profile?.full_name || '',
      profileEmail: user?.email || '',
      profilePhone: profile?.phone || '',
      profileDesignation: profile?.role || '',
    };
  };

  // Populate form fields once auth details are loaded
  useEffect(() => {
    setForm(getInitialValues());
  }, [profile, user]);

  // Handle dirty state comparison against initial profile values
  useEffect(() => {
    const initial = getInitialValues();
    const changed = Object.keys(form).some(key => form[key] !== initial[key]);
    setIsDirty(changed);
  }, [form, profile, user]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus(null);
    try {
      if (user) {
        await userService.updateProfile({
          id: user.id,
          full_name: form.profileName,
          phone: form.profilePhone,
          profile_photo: form.profilePhoto,
          department: form.profileDesignation
        });
        await refreshProfile();
      }

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

    setIsUploadingPhoto(true);
    try {
      const publicUrl = await avatarService.uploadAvatar(user.id, file, isAdmin, form.profilePhoto);
      handleChange('profilePhoto', publicUrl);
    } catch (err) {
      logger.error('Profile photo upload failed:', err);
      alert(err.message || 'Failed to upload profile photo.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <SettingsLayout
      title="Profile Settings"
      description="Update personal account, contact details, and professional designation."
      categoryName="Administration"
      isDirty={isDirty}
      isLoading={isLoading}
      onSave={handleSave}
      onCancel={onBack}
      saveStatus={saveStatus}
      hideBreadcrumbs={hideBreadcrumbs}
      hideCancel={hideCancel}
    >
      <SettingsSection title="User Identity" description="Set up personal representation values.">
        
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
                <span style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>Avatar</span>
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
              <span style={{ fontSize: '10px', color: 'var(--txt-muted)' }}>Max size 5MB. Square ratio PNG, JPG, or WEBP.</span>
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
          <label className="form-label">Email Address (Read-only)</label>
          <Input
            type="email"
            className="form-input"
            value={form.profileEmail}
            readOnly={true}
            style={{ background: 'var(--interaction-disabled)', cursor: 'not-allowed', color: 'var(--txt-muted)' }}
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
          <label className="form-label">User Role (Read-only)</label>
          <Input
            type="text"
            className="form-input"
            value={form.profileDesignation}
            readOnly={true}
            style={{ background: 'var(--interaction-disabled)', cursor: 'not-allowed', color: 'var(--txt-muted)', textTransform: 'capitalize' }}
          />
        </div>

      </SettingsSection>
    </SettingsLayout>
  );
};
