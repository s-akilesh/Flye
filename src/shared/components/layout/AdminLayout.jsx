import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { SEO } from '../../seo';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Handle body class and CSS variable for header stretching/shrinking
  useEffect(() => {
    const updateSidebarWidth = () => {
      const isMobile = window.innerWidth <= 991;
      if (isMobile) {
        document.documentElement.style.setProperty('--admin-sidebar-width', '0px');
      } else {
        const width = isCollapsed ? '72px' : '240px';
        document.documentElement.style.setProperty('--admin-sidebar-width', width);
      }
    };

    updateSidebarWidth();
    document.body.classList.add('in-admin-panel');

    window.addEventListener('resize', updateSidebarWidth);

    return () => {
      document.documentElement.style.setProperty('--admin-sidebar-width', '0px');
      document.body.classList.remove('in-admin-panel');
      window.removeEventListener('resize', updateSidebarWidth);
    };
  }, [isCollapsed]);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: ROUTES.ADMIN_DASHBOARD,
      icon: (
        <span className="material-icons-outlined" style={{ fontSize: '18px' }}>dashboard</span>
      )
    },
    {
      id: 'projects',
      label: 'Manage Projects',
      path: ROUTES.ADMIN_PROJECTS,
      icon: (
        <span className="material-icons-outlined" style={{ fontSize: '18px' }}>inventory_2</span>
      )
    },
    {
      id: 'enquiries',
      label: 'Manage Enquiries',
      path: ROUTES.ADMIN_ENQUIRIES,
      icon: (
        <span className="material-icons-outlined" style={{ fontSize: '18px' }}>chat_bubble_outline</span>
      )
    },
    {
      id: 'contacts',
      label: 'Contacts',
      path: ROUTES.ADMIN_CONTACTS,
      icon: (
        <span className="material-icons-outlined" style={{ fontSize: '18px' }}>email</span>
      )
    },
    {
      id: 'activity-logs',
      label: 'Activity Logs',
      path: ROUTES.ADMIN_ACTIVITY_LOGS,
      icon: (
        <span className="material-icons-outlined" style={{ fontSize: '18px' }}>list_alt</span>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      path: ROUTES.ADMIN_SETTINGS,
      icon: (
        <span className="material-icons-outlined" style={{ fontSize: '18px' }}>settings</span>
      )
    }
  ];

  return (
    <div className="admin-layout-container">
      <SEO noindex={true} />
      {/* Collapsible Sidebar */}
      <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Logo / Branding */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {!isCollapsed && (
              <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-violet)', letterSpacing: '1px' }}>
                Admin Panel
              </span>
            )}
            <button 
              type="button"
              className="sidebar-collapse-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span className="material-icons" style={{ fontSize: '16px', transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>keyboard_double_arrow_left</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.id === 'projects' && (location.pathname === ROUTES.ADMIN_ADD_PROJECT || location.pathname.startsWith('/admin/projects/edit/')));
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      className={`admin-nav-item ${isActive ? 'active' : ''}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        gap: isCollapsed ? '0' : '12px',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        color: isActive ? 'var(--accent-violet)' : 'var(--text-secondary)',
                        background: isActive ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                        border: isActive ? '1px solid rgba(139, 92, 246, 0.15)' : '1px solid transparent',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: isActive ? '700' : '500',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                      title={isCollapsed ? item.label : undefined}
                    >
                      {item.icon}
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>


      </aside>

      {/* Main Panel Viewport */}
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};
