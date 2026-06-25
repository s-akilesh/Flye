import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import '../../styles/learning.css';

export const LearningLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    {
      path: ROUTES.LEARNING_WORKSPACE,
      label: 'Engineering Workspace',
      icon: (
        <svg className="sidebar-nav-icon" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      )
    },
    {
      path: ROUTES.LEARNING_COMPONENTS,
      label: 'Explore Components',
      icon: (
        <svg className="sidebar-nav-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="12" y1="8" x2="12" y2="16" />
        </svg>
      )
    },
    {
      path: ROUTES.LEARNING_FUNDAMENTALS,
      label: 'Fundamentals',
      icon: (
        <svg className="sidebar-nav-icon" viewBox="0 0 24 24">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    {
      path: '#experiments',
      label: 'Experiments',
      icon: (
        <svg className="sidebar-nav-icon" viewBox="0 0 24 24">
          <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
          <path d="M12 2v10" />
          <path d="M9 12h6" />
          <path d="M12 2L9 6h6z" />
        </svg>
      ),
      disabled: true
    },
    {
      path: '#projects',
      label: 'Projects',
      icon: (
        <svg className="sidebar-nav-icon" viewBox="0 0 24 24">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
      disabled: true
    },
    {
      path: '#bookmarks',
      label: 'Bookmarks',
      icon: (
        <svg className="sidebar-nav-icon" viewBox="0 0 24 24">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
      disabled: true
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Redirect to component library with query parameter
    navigate(`${ROUTES.LEARNING_COMPONENTS}?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="learning-workspace-container">
      {/* Sticky Sidebar Navigation */}
      <aside className="learning-sidebar">
        <div>
          <span className="sidebar-title">Engineering portal</span>
          <ul className="sidebar-nav-list">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              if (item.disabled) {
                return (
                  <li 
                    key={index} 
                    className="sidebar-nav-item" 
                    style={{ opacity: 0.45, cursor: 'not-allowed' }}
                    title={`${item.label} (Coming Soon)`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </li>
                );
              }
              return (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Component Search Widget */}
        <form className="sidebar-search-box" onSubmit={handleSearchSubmit}>
          <svg className="sidebar-search-icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </aside>

      {/* Main Content Area */}
      <main className="learning-workspace-content">
        <Outlet />
      </main>
    </div>
  );
};
