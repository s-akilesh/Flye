import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';

export const Header = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('flyen_admin_access') === 'true');

  useEffect(() => {
    const checkAuth = () => {
      setIsAdmin(localStorage.getItem('flyen_admin_access') === 'true');
    };

    window.addEventListener('storage', checkAuth);
    // Also periodically poll locally as standard React router navigation won't trigger storage event within the same tab
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('flyen_admin_access');
    setIsAdmin(false);
    navigate(ROUTES.ADMIN_ACCESS);
  };

  return (
    <header>
      <div className="logo-container" onClick={() => navigate(ROUTES.HOME)}>
        <svg className="logo-icon" viewBox="0 0 24 24">
          <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
        </svg>
        <span className="logo-text">FLYEN</span>
      </div>
      
      <div className="nav-controls" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Link to={isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.ADMIN_ACCESS} className="btn-header" id="header-admin-btn">
          Admin
        </Link>
        
        <Link to={ROUTES.CONTACT} className="btn-header" id="header-contact-btn">
          Contact
        </Link>

        {isAdmin && (
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
