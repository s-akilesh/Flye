import React, { useMemo } from 'react';
import { useSettings } from '../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';

export const AccessStats = ({ onBack }) => {
  const { settings } = useSettings();

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
    
    return `${os} - ${browser}`;
  }, []);

  return (
    <SettingsLayout
      title="Access Statistics"
      description="Review recent administrative sessions, login logs, and key update audits."
      categoryName="Security"
      isDirty={false}
      isLoading={false}
      onSave={() => {}}
      onCancel={onBack}
    >
      <SettingsSection title="System Access Logs" description="Read-only log card metrics reflecting portal logins.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-4)' }}>
          
          <div style={{ gridColumn: 'span 4', padding: '12px 16px', background: 'var(--sys-surface)', border: '1px solid var(--sys-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Last Password Changed
            </span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--txt-primary)' }}>
              {settings.lastPasswordChanged || 'Never'}
            </span>
          </div>

          <div style={{ gridColumn: 'span 4', padding: '12px 16px', background: 'var(--sys-surface)', border: '1px solid var(--sys-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Last Login Timestamp
            </span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--txt-primary)' }}>
              {settings.lastLogin || 'Just now'}
            </span>
          </div>

          <div style={{ gridColumn: 'span 4', padding: '12px 16px', background: 'var(--sys-surface)', border: '1px solid var(--sys-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active User Session
            </span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--brand-accent)' }}>
              {activeSessionDetails}
            </span>
          </div>

        </div>
      </SettingsSection>
    </SettingsLayout>
  );
};
