import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';
import { useSettings } from '../../hooks/useSettings';
import { useAuth } from '../../context/AuthContext.jsx';

export const Header = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.ADMIN_LOGIN || '/admin-login');
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <header>
      <div className="logo-container" onClick={() => navigate(ROUTES.HOME)}>
        <svg className="logo-icon" viewBox="0 0 24 24">
          <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
        </svg>
        <span className="logo-text">{settings.companyName.toUpperCase()}</span>
      </div>
      
      <div className="nav-controls" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Link to={user ? ROUTES.ADMIN_DASHBOARD : (ROUTES.ADMIN_LOGIN || '/admin-login')} className="btn-header" id="header-admin-btn">
          Admin
        </Link>
        
        {user && (
          <Link to={ROUTES.ADMIN_SETTINGS} className="btn-header" id="header-settings-btn" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Settings">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </Link>
        )}
        
        <Link to={ROUTES.CONTACT} className="btn-header" id="header-contact-btn">
          Contact
        </Link>

        {user && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleLogout}
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
      </div>
    </header>
  );
};
