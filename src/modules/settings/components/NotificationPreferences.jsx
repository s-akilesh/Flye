import React, { useState, useEffect } from 'react';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { useAuth } from '../../auth/context/AuthContext.jsx';
import { userPreferenceService } from '../../../shared/services/userPreferenceService';
import { logger } from '../../../shared/utils/logger';

const NOTIFICATION_CHANNELS = [
  { id: 'email', label: 'Email Notifications', description: 'Receive summary emails, transaction receipts and critical notifications.' },
  { id: 'security', label: 'Security Alerts', description: 'Get instantly notified of account password updates and new logins.' },
  { id: 'contact', label: 'Contact Notifications', description: 'Receive alert updates for form entries and replies.' },
];

export const NotificationPreferences = ({ onBack, hideBreadcrumbs = false, hideCancel = false }) => {
  const { user } = useAuth();
  
  const [prefs, setPrefs] = useState({
    email: true,
    security: true,
    contact: true,
    browser: false,
    push: false,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [initialPrefs, setInitialPrefs] = useState({});

  useEffect(() => {
    const fetchPrefs = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const data = await userPreferenceService.getPreferences(user.id);
        if (data && data.notifications) {
          const map = {
            email: !!data.notifications.email,
            security: !!data.notifications.security,
            contact: !!data.notifications.contact,
            browser: !!data.notifications.browser,
            push: !!data.notifications.push,
          };
          setPrefs(map);
          setInitialPrefs(map);
        }
      } catch (err) {
        logger.error('Failed to fetch preferences:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrefs();
  }, [user]);

  useEffect(() => {
    const dirty = Object.keys(prefs).some(key => prefs[key] !== initialPrefs[key]);
    setIsDirty(dirty);
  }, [prefs, initialPrefs]);

  const handleToggle = (id) => {
    setPrefs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus(null);
    try {
      await userPreferenceService.savePreferences(user.id, {
        notifications: prefs
      });
      setInitialPrefs(prefs);
      setIsDirty(false);
      
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveStatus({
        message: 'Notification Preferences Saved Successfully',
        lastUpdated: `${now}`
      });
    } catch (err) {
      logger.error('Failed to save preferences:', err);
      alert('Failed to save preferences: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsLayout
      title="Notification Settings"
      description="Choose how and when you want to receive alerts and information updates."
      categoryName="Administration"
      isDirty={isDirty}
      isLoading={isLoading}
      onSave={handleSave}
      onCancel={onBack}
      saveStatus={saveStatus}
      hideBreadcrumbs={hideBreadcrumbs}
      hideCancel={hideCancel}
    >
      <SettingsSection title="Preferences List" description="Configure active alerts and future communication channels.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {NOTIFICATION_CHANNELS.map(ch => (
            <div 
              key={ch.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--sys-divider)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '80%' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)' }}>{ch.label}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ch.description}</span>
              </div>
              <div>
                <label className="switch-container" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px' }}>
                  <input
                    type="checkbox"
                    checked={prefs[ch.id]}
                    onChange={() => handleToggle(ch.id)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span 
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: prefs[ch.id] ? 'var(--brand-primary)' : 'var(--input-border)',
                      transition: '.3s',
                      borderRadius: '34px',
                      boxShadow: prefs[ch.id] ? '0 0 10px var(--interaction-focus)' : 'none'
                    }}
                  >
                    <span 
                      style={{
                        position: 'absolute',
                        content: '""',
                        height: '16px',
                        width: '16px',
                        left: '3px',
                        bottom: '3px',
                        backgroundColor: 'var(--txt-inverse)',
                        transition: '.3s',
                        borderRadius: '50%',
                        transform: prefs[ch.id] ? 'translateX(18px)' : 'translateX(0)'
                      }}
                    />
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
};
