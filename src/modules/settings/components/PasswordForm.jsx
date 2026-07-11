import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { Input } from '../../../shared/components/ui/Input';
import { useAuth } from '../../auth/context/AuthContext.jsx';
import { supabase } from '../../../shared/services/supabaseClient';

export const PasswordForm = ({ onBack, hideBreadcrumbs = false, hideCancel = false }) => {
  const { settings, saveSettings } = useSettings();
  const { user, isAdmin } = useAuth();

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    const dirty = !!(pwForm.current || pwForm.newPw || pwForm.confirm);
    setIsDirty(dirty);
  }, [pwForm]);

  const handlePasswordChange = async () => {
    setPwError('');
    setPwSuccess('');
    setSaveStatus(null);

    if (!pwForm.current) {
      setPwError('Please enter your current password.');
      return;
    }
    if (!pwForm.newPw || pwForm.newPw.length < 4) {
      setPwError('New password must be at least 4 characters.');
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      setPwError('New password and confirm password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Re-authenticate user to verify their current password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user?.email,
        password: pwForm.current
      });

      if (authError) {
        setPwError('Current password is incorrect.');
        setIsLoading(false);
        return;
      }

      // 2. Update password in Supabase Authentication
      const { error: updateError } = await supabase.auth.updateUser({ password: pwForm.newPw });
      if (updateError) throw updateError;

      // 3. Sync legacy settings password for administrators
      if (isAdmin) {
        const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        await saveSettings({
          ...settings,
          adminPassword: pwForm.newPw,
          lastPasswordChanged: today
        });
      }

      setIsDirty(false);
      setPwForm({ current: '', newPw: '', confirm: '' });
      
      setPwSuccess('✅ Password updated successfully!');
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveStatus({
        message: 'Security password changed successfully',
        lastUpdated: `${now}`
      });
    } catch (err) {
      console.error('Failed to change password:', err);
      setPwError('Failed to change password: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsLayout
      title="Portal Password"
      description="Update portal login credentials. Changing the password updates your authentication session."
      categoryName="Security"
      isDirty={isDirty}
      isLoading={isLoading}
      onSave={handlePasswordChange}
      onCancel={onBack}
      saveStatus={saveStatus}
      hideBreadcrumbs={hideBreadcrumbs}
      hideCancel={hideCancel}
    >
      <SettingsSection title="Change Password" description="Enter your current password and pick a strong new login key.">
        {pwError && (
          <div style={{ fontSize: '12px', color: 'var(--accent-red, #ef4444)', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', padding: '8px 12px', borderRadius: '6px' }}>
            ⚠️ {pwError}
          </div>
        )}
        {pwSuccess && (
          <div style={{ fontSize: '12px', color: 'var(--accent-emerald)', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', padding: '8px 12px', borderRadius: '6px' }}>
            {pwSuccess}
          </div>
        )}

        <div className="calc-row settings-field-row">
          <label className="form-label">Current Password</label>
          <Input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={pwForm.current}
            onChange={(e) => setPwForm(f => ({ ...f, current: e.target.value }))}
            style={{ letterSpacing: pwForm.current ? '3px' : '0' }}
          />
        </div>

        <div className="calc-row settings-field-row">
          <label className="form-label">New Password</label>
          <Input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={pwForm.newPw}
            onChange={(e) => setPwForm(f => ({ ...f, newPw: e.target.value }))}
            style={{ letterSpacing: pwForm.newPw ? '3px' : '0' }}
          />
        </div>

        <div className="calc-row settings-field-row">
          <label className="form-label">Confirm New Password</label>
          <Input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={pwForm.confirm}
            onChange={(e) => setPwForm(f => ({ ...f, confirm: e.target.value }))}
            style={{ letterSpacing: pwForm.confirm ? '3px' : '0' }}
          />
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
};
