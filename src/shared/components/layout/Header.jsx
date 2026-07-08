import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import { Button } from '../ui/Button';
import { useSettings } from '../../../modules/settings/hooks/useSettings';
import { useAuth } from '../../../modules/auth/context/AuthContext.jsx';
import { Modal } from '../ui/Modal';

export const Header = ({ onToggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const { user, profile, isAdmin, logout, viewMode, setViewMode, loading } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleScrollToSection = (id) => {
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  const handleLogout = async () => {
    try {
      setShowLogoutConfirm(false);
      await logout();
      navigate(ROUTES.ADMIN_LOGIN || '/admin-login');
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <header>
      <div className="logo-container" onClick={() => navigate(viewMode === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.HOME)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        {settings.websiteLogo ? (
          <img 
            src={settings.websiteLogo} 
            alt={settings.companyName || 'Flyen'} 
            className="logo-img" 
            style={{ height: '28px', width: 'auto', objectFit: 'contain', marginRight: '10px' }} 
          />
        ) : (
          <svg className="logo-icon" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
            <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
          </svg>
        )}
        <span className="logo-text">{(settings.companyName || 'Flyen').toUpperCase()}</span>
      </div>

      {/* Desktop Navigation Links */}
      {viewMode !== 'admin' && !location.pathname.startsWith('/admin') && (
        <nav className="desktop-nav-menu" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/projects" style={{ fontSize: '13px', color: 'var(--text-secondary, #9ca3af)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Projects</Link>
          <a
            href="/#about"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection('about');
            }}
            style={{ fontSize: '13px', color: 'var(--text-secondary, #9ca3af)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}
          >
            About
          </a>
          <Link to="/contact" style={{ fontSize: '13px', color: 'var(--text-secondary, #9ca3af)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Contact</Link>
        </nav>
      )}
      
      <div className="nav-controls" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => setShowNotifications(true)}
          className="btn-header header-notify-bell"
          style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          title="Notifications"
        >
          <span className="material-icons" style={{ fontSize: '18px' }}>notifications</span>
        </button>

        {/* Hamburger Trigger for Mobile */}
        <button
          type="button"
          onClick={onToggleDrawer}
          className="btn-header mobile-drawer-hamburger"
          style={{ padding: '8px', display: 'none', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          title="Open Menu"
        >
          <span className="material-icons" style={{ fontSize: '20px' }}>menu</span>
        </button>

        {/* Profile Dropdown */}
        {user && (
          <div style={{ position: 'relative', marginLeft: 'var(--space-1)' }}>
            <button
              type="button"
              onClick={() => setShowProfileDropdown(p => !p)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px 4px 4px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
            >
              {/* Avatar */}
              {profile?.profile_photo || profile?.avatar_url ? (
                <img
                  src={profile.profile_photo || profile.avatar_url}
                  alt="Profile"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid rgba(139, 92, 246, 0.3)'
                  }}
                />
              ) : (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-blue))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#fff',
                  flexShrink: 0
                }}>
                  {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}

              {/* Name + Role */}
              <div className="header-profile-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {profile?.role || 'user'}
                </span>
              </div>

              {/* Dropdown Icon */}
              <span className="material-icons" style={{ fontSize: '16px', color: 'var(--text-muted)', transition: 'transform 0.2s', transform: showProfileDropdown ? 'rotate(180deg)' : 'none' }}>
                expand_more
              </span>
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setShowProfileDropdown(false)} />
                <div
                  className="card-glass header-profile-dropdown"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '180px',
                    zIndex: 1000,
                    padding: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    background: '#0b0a10',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    borderRadius: '8px'
                  }}
                >
                  {/* Switch User Option */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        const nextMode = viewMode === 'admin' ? 'user' : 'admin';
                        setViewMode(nextMode);
                        if (nextMode === 'admin') {
                          navigate(ROUTES.ADMIN_DASHBOARD);
                        } else {
                          navigate('/');
                        }
                        setShowProfileDropdown(false);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        padding: '10px 12px',
                        fontSize: '13px',
                        textAlign: 'left',
                        width: '100%',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <span className="material-icons-outlined" style={{ fontSize: '18px', color: 'var(--accent-violet)' }}>swap_horiz</span>
                      <span>{viewMode === 'admin' ? 'Switch to User' : 'Switch to Admin'}</span>
                    </button>
                  )}

                  {/* Profile Settings Option */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`${ROUTES.ADMIN_SETTINGS}?page=profile`);
                        setShowProfileDropdown(false);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        padding: '10px 12px',
                        fontSize: '13px',
                        textAlign: 'left',
                        width: '100%',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <span className="material-icons-outlined" style={{ fontSize: '18px', color: 'var(--accent-violet)' }}>manage_accounts</span>
                      <span>Profile Settings</span>
                    </button>
                  )}

                  {/* Divider */}
                  {isAdmin && (
                    <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)', margin: '2px 8px' }} />
                  )}

                  {/* Logout Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setShowLogoutConfirm(true);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-crimson, #ef4444)',
                      padding: '10px 12px',
                      fontSize: '13px',
                      textAlign: 'left',
                      width: '100%',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <span className="material-icons-outlined" style={{ fontSize: '18px' }}>logout</span>
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {!loading && !user && !location.pathname.startsWith('/admin') && location.pathname !== '/auth' && (
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate(ROUTES.STUDENT_AUTH)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: 'linear-gradient(135deg, var(--accent-blue, #3b82f6), var(--accent-violet, #8b5cf6))',
              border: 'none',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.2)',
              marginLeft: 'var(--space-2)'
            }}
          >
            Sign In
          </Button>
        )}
      </div>

      {/* Notifications Drawer Modal */}
      <Modal isOpen={showNotifications} onClose={() => setShowNotifications(false)} className="modal-content purple" style={{ maxWidth: '400px' }}>
        <div className="modal-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-icons-outlined" style={{ fontSize: '32px' }}>notifications</span>
        </div>
        <h4 style={{ textAlign: 'center', margin: '12px 0 6px 0', fontSize: '16px', fontWeight: '800' }}>NOTIFICATIONS</h4>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 16px 0' }}>Stay updated on your platform activities</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--accent-violet)', textTransform: 'uppercase' }}>Learning Reminder</span>
            <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'var(--text-primary)', lineHeight: '1.3' }}>You haven't finished the "Capacitor" module yet. Jump back in!</p>
          </div>
          <div style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)', opacity: 0.6 }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Project Enquiries (Coming Soon)</span>
            <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'var(--text-secondary)' }}>Track the status of your hardware kit requests here.</p>
          </div>
          <div style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)', opacity: 0.6 }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order Updates (Coming Soon)</span>
            <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'var(--text-secondary)' }}>Live updates for packaging and shipping coordinates.</p>
          </div>
          <div style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)', opacity: 0.6 }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Platform Announcements (Coming Soon)</span>
            <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'var(--text-secondary)' }}>Receive alerts when Level 3 to 10 curricula go live.</p>
          </div>
        </div>

        <Button variant="secondary" className="width-100" onClick={() => setShowNotifications(false)} style={{ marginTop: '20px', padding: '8px 0' }}>
          Dismiss
        </Button>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} className="modal-content purple" style={{ maxWidth: '360px' }}>
        <div className="modal-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-crimson, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-icons-outlined" style={{ fontSize: '32px' }}>logout</span>
        </div>
        <h4 style={{ textAlign: 'center', margin: '12px 0 6px 0', fontSize: '16px', fontWeight: '800' }}>CONFIRM LOGOUT</h4>
        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 20px 0' }}>
          Are you sure you want to end your administration session?
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" className="width-100" onClick={() => setShowLogoutConfirm(false)} style={{ padding: '8px 0', flex: 1 }}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleLogout} 
            style={{ 
              padding: '8px 0', 
              flex: 1, 
              background: 'var(--accent-crimson, #ef4444)', 
              color: '#fff', 
              border: '1px solid rgba(239, 68, 68, 0.2)' 
            }}
          >
            Logout
          </Button>
        </div>
      </Modal>
    </header>
  );
};
