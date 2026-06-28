import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';
import { useSettings } from '../../hooks/useSettings';
import { useAuth } from '../../context/AuthContext.jsx';
import { Modal } from '../ui/Modal';

export const Header = ({ onToggleDrawer }) => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { user, isAdmin, logout, viewMode, setViewMode } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
      <div className="logo-container" onClick={() => navigate(ROUTES.HOME)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
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
      
      <div className="nav-controls" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {user && isAdmin && (
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
            }}
            className="btn-header header-admin-avatar header-role-switcher"
            id="header-settings-btn"
            style={{ 
              padding: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: 'none', 
              border: 'none', 
              color: viewMode === 'admin' ? 'var(--accent-violet)' : 'var(--text-muted)', 
              cursor: 'pointer' 
            }}
            title={viewMode === 'admin' ? "Switch to User View" : "Switch to Admin View"}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        )}

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => setShowNotifications(true)}
          className="btn-header header-notify-bell"
          style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          title="Notifications"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>

        {/* Hamburger Trigger for Mobile */}
        <button
          type="button"
          onClick={onToggleDrawer}
          className="btn-header mobile-drawer-hamburger"
          style={{ padding: '8px', display: 'none', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          title="Open Menu"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {user && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--accent-crimson, #ef4444)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              marginLeft: 'var(--space-2)'
            }}
          >
            Logout
          </Button>
        )}

        {!user && window.location.pathname !== '/auth' && (
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
        <div className="modal-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-violet)' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
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
        <div className="modal-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-crimson, #ef4444)' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
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
