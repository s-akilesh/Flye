import React, { useState, useEffect, useMemo } from 'react';
import { useSettings } from '../../../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';

export const SecuritySettings = ({ onBack }) => {
  const { settings, saveSettings } = useSettings();

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

    if (pwForm.current !== settings.adminPassword) {
      setPwError('Current password is incorrect.');
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
    await new Promise(resolve => setTimeout(resolve, 800));

    // Update settings in state
    const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    saveSettings({
      ...settings,
      adminPassword: pwForm.newPw,
      lastPasswordChanged: today
    });

    setIsLoading(false);
    setIsDirty(false);
    setPwForm({ current: '', newPw: '', confirm: '' });
    
    setPwSuccess('✅ Password updated successfully!');
    setSaveStatus({
      message: 'Security password changed successfully',
      lastUpdated: `${now}`
    });
  };

  // Dynamically compute active session details
  const activeSessionDetails = useMemo(() => {
    const ua = navigator.userAgent;
    let browser = "Browser";
    if (ua.indexOf("Chrome") > -1) browser = "Chrome";
    else if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("Safari") > -1) browser = "Safari";
    else if (ua.indexOf("Edge") > -1) browser = "Edge";

    let os = "OS";
    if (ua.indexOf("Windows") > -1) os = "Windows";
    else if (ua.indexOf("Mac") > -1) os = "macOS";
    else if (ua.indexOf("Linux") > -1) os = "Linux";
    
    return `Current Session (${os} - ${browser})`;
  }, []);

  return (
    <SettingsLayout
      title="Security & Password Settings"
      description="Protect administrative access. Change login credentials and review active session logs."
      categoryName="Security & Password"
      isDirty={isDirty}
      isLoading={isLoading}
      onSave={handlePasswordChange}
      onCancel={onBack}
      saveStatus={saveStatus}
    >
      <SettingsSection title="Change Portal Password" description="Updating your password forces session key validation. Make sure it is at least 4 characters.">
        
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

      {/* Account Information Logs cards */}
      <SettingsSection title="Access Statistics" description="Recent administrative session access and credentials updates.">
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(12, 1fr)', 
            gap: 'var(--space-4, 16px)' 
          }}
        >
          <div 
            style={{ 
              gridColumn: 'span 4',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Last Password Changed
            </span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {settings.lastPasswordChanged || 'Never'}
            </span>
          </div>

          <div 
            style={{ 
              gridColumn: 'span 4',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Last Account Login
            </span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {settings.lastLogin || 'Just now'}
            </span>
          </div>

          <div 
            style={{ 
              gridColumn: 'span 4',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active User Session
            </span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-blue)' }}>
              {activeSessionDetails}
            </span>
          </div>
        </div>
      </SettingsSection>

      {/* Future placeholders */}
      <SettingsSection title="Multi-Factor Authentication" description="Require a secure verification token in addition to your password. (Coming Soon)">
        <div style={{ opacity: 0.5, pointerEvents: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '700', margin: '0 0 2px 0' }}>Two-Factor Authentication (2FA)</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Secure your account using Google Authenticator or SMS codes.</p>
          </div>
          <span style={{ fontSize: '10px', fontWeight: '750', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Disabled</span>
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
};
