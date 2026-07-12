import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import { Button } from '../ui/Button';
import { lazyRoutes } from '../../../router/AppRouter';
import { useSettings } from '../../../modules/settings/hooks/useSettings';
import { useAuth } from '../../../modules/auth/context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Modal } from '../ui/Modal';
import { supabase } from '../../services/supabaseClient.js';
import { notificationService } from '../../services/notificationService.js';
import { NotificationDropdown } from './NotificationDropdown.jsx';

export const Header = ({ onToggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const { user, profile, isAdmin, logout, viewMode, setViewMode, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdminNotifications, setShowAdminNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [notificationsList, setNotificationsList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    if (!user || !isAdmin) return;
    try {
      const list = await notificationService.getNotifications();
      setNotificationsList(list);
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to load notifications in header:", err);
    }
  };

  useEffect(() => {
    if (!user || !isAdmin) return;
    loadNotifications();

    const channel = supabase
      .channel('header-notifications-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

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
      navigate(ROUTES.STUDENT_AUTH);
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <header style={{
      background: 'var(--header-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--header-border)'
    }}>
      <div className="logo-container" onClick={() => navigate((viewMode === 'admin' || location.pathname.startsWith('/admin')) ? ROUTES.ADMIN_DASHBOARD : ROUTES.HOME)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        {settings.websiteLogo ? (
          <img 
            src={settings.websiteLogo} 
            alt={settings.companyName || 'Flyen'} 
            className="logo-img" 
            style={{ height: '28px', width: 'auto', objectFit: 'contain', marginRight: '4px' }} 
          />
        ) : (
          <svg className="logo-icon" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
            <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
          </svg>
        )}
        <span className="logo-text">{(settings.companyName || 'Flyen').toUpperCase()}</span>
      </div>

      {/* Desktop Navigation Links */}
      {(!user || viewMode !== 'admin') && !location.pathname.startsWith('/admin') && (
        <nav className="desktop-nav-menu" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/projects" onMouseEnter={() => lazyRoutes.ProjectListing()} style={{ fontSize: '13px', color: 'var(--header-txt-secondary)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Projects</Link>
          <Link to="/printing" onMouseEnter={() => lazyRoutes.PrintingCatalog()} style={{ fontSize: '13px', color: 'var(--header-txt-secondary)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>3D Printing</Link>
          <Link to="/my-projects" onMouseEnter={() => lazyRoutes.MyProjects()} style={{ fontSize: '13px', color: 'var(--header-txt-secondary)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>My Enquiries</Link>
          <a
            href="/#about"
            onMouseEnter={() => lazyRoutes.Home()}
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection('about');
            }}
            style={{ fontSize: '13px', color: 'var(--header-txt-secondary)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}
          >
            About
          </a>
          <Link to="/contact" onMouseEnter={() => lazyRoutes.Contact()} style={{ fontSize: '13px', color: 'var(--header-txt-secondary)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Contact</Link>
        </nav>
      ) }
      
      <div className="nav-controls" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {/* Notification Bell */}
        {user && isAdmin && viewMode === 'admin' && (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowAdminNotifications(!showAdminNotifications)}
              className="btn-header header-notify-bell"
              style={{
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                color: unreadCount > 0 ? 'var(--accent-blue)' : 'var(--text-muted)',
                cursor: 'pointer',
                position: 'relative'
              }}
              title="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: 'var(--status-danger)',
                    color: 'var(--txt-inverse)',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    fontSize: '9px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'none'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            <NotificationDropdown
              isOpen={showAdminNotifications}
              onClose={() => setShowAdminNotifications(false)}
              notifications={notificationsList}
              onRefresh={loadNotifications}
            />
          </div>
        )}

        {/* Theme Switcher Toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn-header header-theme-toggle"
          style={{
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: 'var(--header-icon)',
            cursor: 'pointer',
            transition: 'color 0.2s',
            marginRight: 'var(--space-1)'
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <span className="material-icons-outlined" style={{ fontSize: '20px' }}>light_mode</span>
          ) : (
            <span className="material-icons-outlined" style={{ fontSize: '20px' }}>dark_mode</span>
          )}
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
          <div ref={dropdownRef} className="header-profile-dropdown-wrapper" style={{ position: 'relative', marginLeft: 'var(--space-1)' }}>
            <button
              type="button"
              onClick={() => setShowProfileDropdown(p => !p)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px 4px 4px',
                background: 'var(--header-interaction-hover)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--header-interaction-active)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--header-interaction-hover)';
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
                    border: '2px solid var(--brand-primary)'
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
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--header-txt-primary)', whiteSpace: 'nowrap', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--header-txt-secondary)', textTransform: 'capitalize' }}>
                  {profile?.role || 'user'}
                </span>
              </div>

              {/* Dropdown Icon */}
              <span className="material-icons" style={{ fontSize: '16px', color: 'var(--header-txt-secondary)', transition: 'transform 0.2s', transform: showProfileDropdown ? 'rotate(180deg)' : 'none' }}>
                expand_more
              </span>
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
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
                  background: 'var(--sys-surface)',
                  border: '1px solid var(--sys-border)',
                  boxShadow: 'var(--shadow-md)',
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
                        color: 'var(--txt-primary)',
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
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--interaction-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <span className="material-icons-outlined" style={{ fontSize: '18px', color: 'var(--accent-violet)' }}>swap_horiz</span>
                      <span>{viewMode === 'admin' ? 'Switch to User' : 'Switch to Admin'}</span>
                    </button>
                  )}

                  {isAdmin && (
                    <div style={{ height: '1px', background: 'var(--sys-divider)', margin: '2px 8px' }} />
                  )}

                   {/* My Enquiries */}
                  {viewMode !== 'admin' && (
                    <button
                      type="button"
                      onClick={() => {
                        navigate(ROUTES.MY_PROJECTS);
                        setShowProfileDropdown(false);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--txt-primary)',
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
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--interaction-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <span className="material-icons-outlined" style={{ fontSize: '18px', color: 'var(--accent-violet)' }}>folder</span>
                      <span>My Enquiries</span>
                    </button>
                  )}

                  {/* Profile */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isAdmin && viewMode === 'admin') {
                        navigate(ROUTES.ADMIN_PROFILE);
                      } else {
                        navigate(ROUTES.MY_PROFILE);
                      }
                      setShowProfileDropdown(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--txt-primary)',
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
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--interaction-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <span className="material-icons-outlined" style={{ fontSize: '18px', color: 'var(--accent-violet)' }}>person</span>
                    <span>My Profile</span>
                  </button>


                  {/* Divider */}
                  <div style={{ height: '1px', background: 'var(--sys-divider)', margin: '2px 8px' }} />

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
                      color: 'var(--status-error)',
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
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <span className="material-icons-outlined" style={{ fontSize: '18px' }}>logout</span>
                    <span>Logout</span>
                  </button>
                </div>
            )}
          </div>
        )}

        {!loading && !user && !location.pathname.startsWith('/admin') && location.pathname !== ROUTES.STUDENT_AUTH && (
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate(ROUTES.STUDENT_AUTH)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: 'linear-gradient(135deg, var(--brand-accent), var(--brand-primary))',
              border: 'none',
              boxShadow: '0 2px 8px var(--interaction-focus)',
              marginLeft: 'var(--space-2)'
            }}
          >
            Sign In
          </Button>
        )}
      </div>

      {/* Notifications Drawer Modal */}
      <Modal isOpen={showNotifications} onClose={() => setShowNotifications(false)} className="modal-content purple" style={{ maxWidth: '400px' }}>
        <div className="modal-icon" style={{ background: 'var(--interaction-selected)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-icons-outlined" style={{ fontSize: '32px' }}>notifications</span>
        </div>
        <h4 style={{ textAlign: 'center', margin: '12px 0 6px 0', fontSize: '16px', fontWeight: '800' }}>NOTIFICATIONS</h4>
        <p style={{ fontSize: '12px', color: 'var(--txt-muted)', textAlign: 'center', margin: '0 0 16px 0' }}>Stay updated on your platform activities</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <div style={{ padding: '10px', background: 'var(--sys-surface)', borderRadius: '6px', border: '1px solid var(--sys-border)' }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>Learning Reminder</span>
            <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'var(--txt-primary)', lineHeight: '1.3' }}>You haven't finished the "Capacitor" module yet. Jump back in!</p>
          </div>
          <div style={{ padding: '10px', background: 'var(--interaction-disabled)', borderRadius: '6px', border: '1px solid var(--sys-divider)', opacity: 0.6 }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Project Enquiries (Coming Soon)</span>
            <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'var(--txt-secondary)' }}>Track the status of your hardware kit requests here.</p>
          </div>
          <div style={{ padding: '10px', background: 'var(--interaction-disabled)', borderRadius: '6px', border: '1px solid var(--sys-divider)', opacity: 0.6 }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Order Updates (Coming Soon)</span>
            <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'var(--txt-secondary)' }}>Live updates for packaging and shipping coordinates.</p>
          </div>
          <div style={{ padding: '10px', background: 'var(--interaction-disabled)', borderRadius: '6px', border: '1px solid var(--sys-divider)', opacity: 0.6 }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Platform Announcements (Coming Soon)</span>
            <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'var(--txt-secondary)' }}>Receive alerts when Level 3 to 10 curricula go live.</p>
          </div>
        </div>

        <Button variant="secondary" className="width-100" onClick={() => setShowNotifications(false)} style={{ marginTop: '20px', padding: '8px 0' }}>
          Dismiss
        </Button>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} className="modal-content purple" style={{ maxWidth: '360px' }}>
        <div className="modal-icon" style={{ background: 'var(--interaction-hover)', color: 'var(--status-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-icons-outlined" style={{ fontSize: '32px' }}>logout</span>
        </div>
        <h4 style={{ textAlign: 'center', margin: '12px 0 6px 0', fontSize: '16px', fontWeight: '800' }}>CONFIRM LOGOUT</h4>
        <p style={{ fontSize: '12.5px', color: 'var(--txt-muted)', textAlign: 'center', margin: '0 0 20px 0' }}>
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
              background: 'var(--status-danger)', 
              color: 'var(--txt-inverse)', 
              border: '1px solid var(--sys-border)' 
            }}
          >
            Logout
          </Button>
        </div>
      </Modal>
      <style>{`
        @media (max-width: 768px) {
          .header-profile-dropdown-wrapper {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
