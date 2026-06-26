import React, { useMemo, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../constants/routes';
import { useSettings } from '../hooks/useSettings';

// Lazy load settings form subcomponents for performance optimization
const WebsiteSettings = React.lazy(() => import('../components/admin/settings/WebsiteSettings').then(m => ({ default: m.WebsiteSettings })));
const SocialMediaSettings = React.lazy(() => import('../components/admin/settings/SocialMediaSettings').then(m => ({ default: m.SocialMediaSettings })));
const ContactEmailSettings = React.lazy(() => import('../components/admin/settings/ContactEmailSettings').then(m => ({ default: m.ContactEmailSettings })));
const SecuritySettings = React.lazy(() => import('../components/admin/settings/SecuritySettings').then(m => ({ default: m.SecuritySettings })));
const ProfileSettings = React.lazy(() => import('../components/admin/settings/ProfileSettings').then(m => ({ default: m.ProfileSettings })));

export const AdminSettings = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category');

  // Metadata configuration forSettings categories (Order prioritized by daily usage frequency)
  const SETTING_CATEGORIES = useMemo(() => [
    {
      id: 'website',
      icon: '🌐',
      title: 'Website Settings',
      description: 'Configure website branding, logos, tags, and contact details.',
      status: (settings.companyName && settings.contactEmail && settings.websiteLogo) ? 'configured' : 'attention',
      component: WebsiteSettings
    },
    {
      id: 'social',
      icon: '📱',
      title: 'Social Media',
      description: 'Manage handle URLs and connection states for Facebook, Instagram, etc.',
      status: (settings.facebookUrl || settings.instagramUrl || settings.linkedinUrl || settings.youtubeUrl || settings.twitterUrl || settings.githubUrl || settings.websiteUrl) ? 'configured' : 'attention',
      component: SocialMediaSettings
    },
    {
      id: 'email',
      icon: '📧',
      title: 'Contact & Email',
      description: 'Routing for contact inquiries, automated alerts, and SMTP configs.',
      status: (settings.contactEmail || settings.notificationEmail || settings.replyToEmail) ? 'configured' : 'attention',
      component: ContactEmailSettings
    },
    {
      id: 'security',
      icon: '🔐',
      title: 'Security & Password',
      description: 'Change admin portal password and review device/session logs.',
      status: settings.adminPassword ? 'configured' : 'attention',
      component: SecuritySettings
    },
    {
      id: 'profile',
      icon: '👤',
      title: 'Profile Settings',
      description: 'Update full name, designation, contact info, and profile avatar.',
      status: (settings.profileName && settings.profileEmail) ? 'configured' : 'attention',
      component: ProfileSettings
    },
    {
      id: 'notifications',
      icon: '🔔',
      title: 'Notifications',
      description: 'Preferences for alerts, push integrations, and automated reports.',
      status: 'coming_soon'
    },
    {
      id: 'users',
      icon: '👥',
      title: 'User Management',
      description: 'Add administrative roles, edit permissions, and track audit logs.',
      status: 'coming_soon'
    },
    {
      id: 'billing',
      icon: '💳',
      title: 'Subscription & Billing',
      description: 'Check subscription status, view invoices, and upgrade features.',
      status: 'coming_soon'
    }
  ], [settings]);

  const activeItem = useMemo(() => {
    return SETTING_CATEGORIES.find(c => c.id === activeCategory) || null;
  }, [activeCategory, SETTING_CATEGORIES]);

  const ActiveFormComponent = activeItem?.component || null;

  const handleBack = () => {
    setSearchParams({});
  };

  return (
    <motion.section
      className="portal-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
    >
      {/* Main Settings Header (Only shows on Settings Hub Landing page) */}
      {!ActiveFormComponent && (
        <div className="portal-header" style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Button
              variant="secondary"
              className="btn-back"
              onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
              style={{ padding: '8px', minWidth: 'auto' }}
            >
              <svg viewBox="0 0 24 24">
                <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
              </svg>
            </Button>
            <div className="portal-title-area">
              <h2>Platform Settings</h2>
              <p>Centralized configuration hub for the Flyen platform</p>
            </div>
          </div>
        </div>
      )}

      {/* Content Rendering Block */}
      <div className="portal-content">
        {ActiveFormComponent ? (
          <Suspense fallback={<div style={{ padding: 'var(--space-5)', color: 'var(--text-muted)', fontSize: '13px' }}>Loading form...</div>}>
            <ActiveFormComponent onBack={handleBack} />
          </Suspense>
        ) : (
          /* Settings Hub Grid of Category Cards */
          <div className="settings-hub-grid">
            {SETTING_CATEGORIES.map((item) => {
              const isComingSoon = item.status === 'coming_soon';
              return (
                <div
                  key={item.id}
                  className={`settings-hub-card ${isComingSoon ? 'disabled' : ''}`}
                  onClick={() => {
                    if (isComingSoon) {
                      alert(`${item.title} settings will be available in a future update!`);
                    } else {
                      setSearchParams({ category: item.id });
                    }
                  }}
                >
                  {isComingSoon && <span className="settings-card-badge">Soon</span>}
                  
                  <div className="settings-card-icon">
                    {item.icon}
                  </div>

                  <div className="settings-card-title-row">
                    <h3 className="settings-card-title">{item.title}</h3>
                    {!isComingSoon && <span className="settings-card-arrow">→</span>}
                  </div>

                  <p className="settings-card-desc">{item.description}</p>

                  {!isComingSoon && (
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span 
                        style={{
                          fontSize: '10px',
                          fontWeight: '750',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          color: item.status === 'configured' ? 'var(--accent-emerald)' : 'var(--accent-amber, #f59e0b)'
                        }}
                      >
                        {item.status === 'configured' ? '✅ Configured' : '⚠ Needs Attention'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
};
