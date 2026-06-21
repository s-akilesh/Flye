import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header>
      <div className="logo-container" onClick={() => navigate(ROUTES.HOME)}>
        <svg className="logo-icon" viewBox="0 0 24 24">
          <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
        </svg>
        <span className="logo-text">FLYEN</span>
      </div>
      
      <div className="nav-controls">
        <Link to={ROUTES.ADMIN_PROJECTS} className="btn-header" id="header-admin-btn" style={{ marginRight: 'var(--space-2)' }}>
          Manage Kits
        </Link>
        <Link to={ROUTES.CONTACT} className="btn-header" id="header-contact-btn" style={{ marginRight: 'var(--space-2)' }}>
          Contact
        </Link>

      </div>
    </header>
  );
};
