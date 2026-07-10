import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { useToast } from '../../../shared/context/ToastContext';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { Button } from '../../../shared/components/ui/Button';
import { activityLogService } from '../../../services/activityLogService';

export const SystemPrefs = ({ onBack }) => {
  const { showToast } = useToast();
  const { settings, saveSettings } = useSettings();
  const [form, setForm] = useState({
    maintenanceMode: settings.maintenanceMode || false,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Log pruning states
  const [retentionDays, setRetentionDays] = useState('180');
  const [isPruneConfirmOpen, setIsPruneConfirmOpen] = useState(false);
  const [isPruning, setIsPruning] = useState(false);

  const handlePruneLogs = async () => {
    setIsPruning(true);
    try {
      const res = await activityLogService.cleanOldLogs(retentionDays);
      showToast(`Logs cleanup finished successfully. Purged ${res.count} old rows.`, 'success');
      setIsPruneConfirmOpen(false);
    } catch (err) {
      showToast(err.message || 'Log cleanup operation failed.', 'error');
    } finally {
      setIsPruning(false);
    }
  };

  useEffect(() => {
    setIsDirty(form.maintenanceMode !== (settings.maintenanceMode || false));
  }, [form, settings]);

  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      await saveSettings({ ...settings, ...form });
      setIsDirty(false);
      
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveStatus({
        message: 'System preferences updated successfully',
        lastUpdated: now
      });
    } catch (err) {
      console.error('Failed to save system preferences:', err);
      alert('Failed to save settings: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsLayout
      title="System Preferences"
      description="Configure system preferences, maintenance mode, and regional settings."
      categoryName="Administration"
      isDirty={isDirty}
      isLoading={isLoading}
      onSave={handleSave}
      onCancel={onBack}
      saveStatus={saveStatus}
    >
      <SettingsSection title="System Status" description="Toggle public access to the platform.">
        <div className="calc-row settings-field-row">
          <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Maintenance Mode</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={form.maintenanceMode}
              onChange={(e) => setForm({ maintenanceMode: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="maintenanceMode" style={{ fontSize: '13px', color: form.maintenanceMode ? 'var(--accent-crimson)' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer' }}>
              {form.maintenanceMode ? 'Enabled (Site is locked)' : 'Disabled (Site is public)'}
            </label>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px', display: 'block', lineHeight: '1.4' }}>
            When enabled, all non-admin users will see the maintenance cover page.
          </span>
        </div>
      </SettingsSection>

      <SettingsSection title="Log Retention Policy" description="Manage database capacity and automatic cleanup durations.">
        <div className="calc-row settings-field-row">
          <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Prune Activity Logs</label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
              style={{
                height: '38px',
                background: 'rgba(15, 15, 25, 0.8)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff',
                borderRadius: '6px',
                padding: '0 12px',
                outline: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                width: '140px'
              }}
            >
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
              <option value="180">180 Days</option>
              <option value="365">365 Days</option>
            </select>
            <Button
              variant="secondary"
              onClick={() => setIsPruneConfirmOpen(true)}
              style={{
                height: '38px',
                fontSize: '13px',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: 'var(--accent-crimson, #ef4444)',
                background: 'rgba(239, 68, 68, 0.05)'
              }}
            >
              Delete Old Logs
            </Button>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px', display: 'block', lineHeight: '1.4' }}>
            Permanently deletes all events older than the selected threshold. This action is irreversible.
          </span>
        </div>
      </SettingsSection>

      <SettingsSection title="Locales & Timezones" description="Regional workspace defaults.">
        <div style={{ opacity: 0.5, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="calc-row settings-field-row">
            <label className="form-label">Preferred Time Zone</label>
            <select className="form-select" disabled defaultValue="UTC+5:30">
              <option value="UTC+5:30">Kolkata, Chennai (UTC+5:30)</option>
            </select>
          </div>
        </div>
      </SettingsSection>

      <ConfirmDialog
        isOpen={isPruneConfirmOpen}
        onClose={() => setIsPruneConfirmOpen(false)}
        onConfirm={handlePruneLogs}
        title="Confirm Log Pruning"
        message={`Are you sure you want to permanently delete all activity logs older than ${retentionDays} days? This operation is irreversible.`}
        confirmLabel="Prune Logs"
        isDanger={true}
        isLoading={isPruning}
      />
    </SettingsLayout>
  );
};
