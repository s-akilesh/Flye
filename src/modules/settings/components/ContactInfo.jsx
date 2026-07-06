import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { Input } from '../../../shared/components/ui/Input';

export const ContactInfo = ({ onBack }) => {
  const { settings, saveSettings } = useSettings();

  const [form, setForm] = useState({
    contactEmail: settings.contactEmail || '',
    contactPhone: settings.contactPhone || '',
    whatsappNumber: settings.whatsappNumber || '',
    companyAddress: settings.companyAddress || '',
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
        message: 'Contact Info Saved Successfully',
        lastUpdated: `${now}`
      });
    } catch (err) {
      console.error('Failed to save contact info:', err);
      alert('Failed to save settings: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsLayout
      title="Contact Information"
      description="Configure phone numbers, email channels, WhatsApp support and physical business addresses."
      categoryName="Website"
      isDirty={isDirty}
      isLoading={isLoading}
      onSave={handleSave}
      onCancel={onBack}
      saveStatus={saveStatus}
    >
      <SettingsSection title="Contact Details" description="Configure channels customers use to reach you.">
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
          <label className="form-label">Business Address</label>
          <Input
            type="text"
            className="form-input"
            placeholder="e.g. Sector 7 Tech Hub, Bangalore"
            value={form.companyAddress}
            onChange={(e) => handleChange('companyAddress', e.target.value)}
          />
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
};
