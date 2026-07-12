import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext.jsx';
import { ProfileForm } from '../../settings/components/ProfileForm.jsx';
import { PasswordForm } from '../../settings/components/PasswordForm.jsx';
import { NotificationPreferences } from '../../settings/components/NotificationPreferences.jsx';
import { ActivitySummary } from '../../settings/components/ActivitySummary.jsx';
import { AppearanceSettings } from '../components/AppearanceSettings.jsx';
import { Button } from '../../../shared/components/ui/Button';
import { ROUTES } from '../../../shared/constants/routes';
import { SEO } from '../../../shared/seo/SEO.jsx';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.STUDENT_AUTH);
    }
  }, [user]);

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId }, { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: 'person', component: ProfileForm },
    { id: 'password', label: 'Security & Password', icon: 'lock', component: PasswordForm },
    { id: 'notifications', label: 'Notification Settings', icon: 'notifications', component: NotificationPreferences },
    { id: 'appearance', label: 'Appearance', icon: 'palette', component: AppearanceSettings },
    // Future placeholders
    { id: 'language', label: 'Language & Locale', icon: 'translate', isPlaceholder: true, placeholderName: 'Language Settings' },
    { id: 'sessions', label: 'Active Sessions', icon: 'devices', isPlaceholder: true, placeholderName: 'Session Management' },
    { id: 'privacy', label: 'Privacy & Security', icon: 'shield', isPlaceholder: true, placeholderName: 'Privacy Configurations' },
  ];

  const activeTabObj = tabs.find(t => t.id === activeTab) || tabs[0];
  const ActiveComponent = activeTabObj.component;

  return (
    <>
      <SEO 
        title="My Account - Flyen"
        description="Manage your account profile, credentials, and notification settings."
        meta={[{ name: 'robots', content: 'noindex,nofollow' }]}
      />
      <section 
        className="portal-section" 
        style={{ 
          paddingTop: isAdminRoute ? '0' : '73px', 
          paddingBottom: '80px', 
          minHeight: isAdminRoute ? 'auto' : '80vh', 
          boxSizing: 'border-box' 
        }}
      >
        {/* Dynamic Adapting Breadcrumbs */}
        <div style={{
          fontSize: '11px', 
          fontWeight: '700', 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          paddingLeft: 'var(--page-padding)',
          paddingRight: 'var(--page-padding)',
          paddingTop: '16px',
          marginBottom: 'var(--space-2)'
        }}>
          {isAdminRoute ? (
            <>
              <span onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)} style={{ color: 'var(--txt-muted)', cursor: 'pointer' }}>Admin</span>
              <span style={{ color: 'var(--sys-border)' }}>&gt;</span>
              <span onClick={() => navigate(ROUTES.ADMIN_SETTINGS)} style={{ color: 'var(--txt-muted)', cursor: 'pointer' }}>Settings</span>
              <span style={{ color: 'var(--sys-border)' }}>&gt;</span>
              <span style={{ color: 'var(--brand-primary)' }}>My Profile</span>
            </>
          ) : (
            <>
              <span onClick={() => navigate(ROUTES.HOME)} style={{ color: 'var(--txt-muted)', cursor: 'pointer' }}>Home</span>
              <span style={{ color: 'var(--sys-border)' }}>&gt;</span>
              <span style={{ color: 'var(--brand-primary)' }}>My Account</span>
            </>
          )}
        </div>

        {/* Sub-Header */}
        <div
          className="portal-header"
          style={{
            paddingTop: '16px',
            paddingBottom: '16px',
            background: 'var(--sys-bg)',
            borderBottom: '1px solid var(--sys-divider)',
            marginBottom: '32px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}>
            <Button variant="secondary" onClick={() => navigate(-1)} style={{ padding: '8px', minWidth: 'auto' }}>
              <span className="material-icons" style={{ fontSize: '20px' }}>arrow_back</span>
            </Button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)' }}>My Account</h1>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--txt-secondary)' }}>Manage your identity and preferences.</p>
            </div>
          </div>
        </div>

        {/* Profile Content Area */}
        <div style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }} className="profile-grid">
            
            {/* Left Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* User Identity Box */}
              <div 
                className="card-glass"
                style={{
                  padding: '24px',
                  borderRadius: '12px',
                  background: 'var(--sys-surface)',
                  border: '1px solid var(--sys-border)',
                  textAlign: 'center'
                }}
              >
                <div style={{ 
                   width: '72px', 
                   height: '72px', 
                   borderRadius: '50%', 
                   background: 'var(--interaction-selected)', 
                   border: '1.5px solid var(--brand-primary)',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   margin: '0 auto 16px auto',
                   overflow: 'hidden'
                }}>
                  {profile?.profile_photo ? (
                    <img src={profile.profile_photo} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '24px', color: 'var(--brand-primary)', fontWeight: '700' }}>
                      {getInitials(profile?.full_name || user?.email)}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--txt-primary)', margin: '0 0 4px 0' }}>
                  {profile?.full_name || 'Anonymous User'}
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'capitalize', margin: 0 }}>
                  {profile?.role || 'User'}
                </p>
              </div>

              {/* Navigation Menu */}
              <div 
                className="card-glass"
                style={{
                  padding: '8px',
                  borderRadius: '12px',
                  background: 'var(--sys-surface)',
                  border: '1px solid var(--sys-border)'
                }}
              >
                {tabs.map(tab => {
                  const isActive = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '12px 16px',
                        background: isActive ? 'var(--interaction-selected)' : 'transparent',
                        color: isActive ? 'var(--txt-primary)' : 'var(--txt-secondary)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: isActive ? '700' : '500',
                        transition: 'all 0.2s ease',
                        marginBottom: '4px'
                      }}
                      className="tab-button"
                    >
                      <span className="material-icons-outlined" style={{ fontSize: '18px', color: isActive ? 'var(--brand-primary)' : 'var(--txt-muted)' }}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Pane (Active Component) */}
            <div style={{ minHeight: '400px' }}>
              {activeTabObj.isPlaceholder ? (
                /* Future Tab Placeholder View */
                <div 
                  className="card-glass"
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%', 
                    minHeight: '400px', 
                    padding: '32px',
                    borderRadius: '12px',
                    background: 'var(--sys-surface)',
                    border: '1px solid var(--sys-border)',
                    textAlign: 'center', 
                    gap: '16px' 
                  }}
                >
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    background: 'var(--interaction-hover)', 
                    border: '1px solid var(--sys-border)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--txt-muted)'
                  }}>
                    <span className="material-icons-outlined" style={{ fontSize: '28px' }}>
                      {activeTabObj.icon}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--txt-primary)', margin: '0 0 6px 0' }}>
                      {activeTabObj.placeholderName}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--txt-secondary)', maxWidth: '280px', margin: 0, lineHeight: '1.5' }}>
                      This section is planned for a future update. Keep an eye out for system feature releases!
                    </p>
                  </div>
                </div>
              ) : (
                <ActiveComponent hideBreadcrumbs={true} hideCancel={true} />
              )}
            </div>

          </div>
        </div>
        <style>{`
          @media (max-width: 991px) {
            .profile-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </>
  );
};
export default ProfilePage;
