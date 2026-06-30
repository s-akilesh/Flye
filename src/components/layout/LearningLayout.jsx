import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LearningRepository } from '../../data/learning';
import '../../styles/learning.css';

export const LearningLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Manage body class and CSS variable for header stretching/shrinking
  useEffect(() => {
    const updateSidebarWidth = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        document.documentElement.style.setProperty('--learning-sidebar-width', '0px');
      } else {
        const width = isCollapsed ? '72px' : '240px';
        document.documentElement.style.setProperty('--learning-sidebar-width', width);
      }
    };

    updateSidebarWidth();
    document.body.classList.add('in-learning-portal');

    window.addEventListener('resize', updateSidebarWidth);

    return () => {
      document.documentElement.style.setProperty('--learning-sidebar-width', '0px');
      document.body.classList.remove('in-learning-portal');
      window.removeEventListener('resize', updateSidebarWidth);
    };
  }, [isCollapsed]);

  const getActiveTitle = () => {
    const path = location.pathname;
    if (path === ROUTES.STUDENT_DASHBOARD) return 'Dashboard';
    if (path === ROUTES.LEARNING_WORKSPACE) return 'Workspace';
    if (path === ROUTES.LEARNING_COMPONENTS) return 'Components Library';
    if (path === ROUTES.LEARNING_FUNDAMENTALS) return 'Electrical Basics';
    
    const parts = path.split('/');
    const slug = parts[parts.length - 1];
    
    if (path.includes('/components/')) {
      const comp = LearningRepository.getComponents().find(c => c.slug === slug);
      return comp ? comp.name : 'Component Details';
    }
    if (path.includes('/fundamentals/')) {
      const roadmap = LearningRepository.getRoadmap();
      for (const lvl of roadmap) {
        for (const cat of lvl.categories) {
          const comp = cat.components.find(c => c.slug === slug);
          if (comp) return comp.name;
        }
      }
      return 'Fundamental Details';
    }
    return 'Learning';
  };

  const navItems = [
    {
      id: 'dashboard',
      path: ROUTES.STUDENT_DASHBOARD,
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      id: 'workspace',
      path: ROUTES.LEARNING_WORKSPACE,
      label: 'Engineering Workspace',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="15" x2="23" y2="15" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="15" x2="4" y2="15" />
        </svg>
      )
    },
    {
      id: 'components',
      path: ROUTES.LEARNING_COMPONENTS,
      label: 'Explore Components',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="12" y1="8" x2="12" y2="16" />
        </svg>
      )
    },
    {
      id: 'electricity',
      path: ROUTES.LEARNING_FUNDAMENTALS,
      label: 'Electrical Basics',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    },
    {
      id: 'experiments',
      path: '#experiments',
      label: 'Experiments',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
          <path d="M12 2v10" />
          <path d="M9 12h6" />
          <path d="M12 2L9 6h6z" />
        </svg>
      ),
      disabled: true
    },
    {
      id: 'projects',
      path: '#projects',
      label: 'Projects',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
      disabled: true
    },
    {
      id: 'bookmarks',
      path: '#bookmarks',
      label: 'Bookmarks',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
      disabled: true
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`${ROUTES.LEARNING_COMPONENTS}?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="learning-workspace-container">
      {/* Mobile Sticky Learning Header */}
      <header className="mobile-learning-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            type="button" 
            onClick={() => {
              const mainHubPaths = [
                ROUTES.LEARNING_WORKSPACE,
                ROUTES.LEARNING_FUNDAMENTALS,
                ROUTES.LEARNING_COMPONENTS
              ];
              if (mainHubPaths.includes(location.pathname)) {
                navigate('/');
              } else {
                navigate(ROUTES.LEARNING_WORKSPACE);
              }
            }} 
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
            title="Go Back"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <span className="mobile-learning-title" style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>
            {getActiveTitle()}
          </span>
        </div>
      </header>

      {/* Sticky Sidebar Navigation - styled exactly like the Admin Panel sidebar */}
      <aside className={`learning-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Top Section: Header & Navigation Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header & Collapse Trigger */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: isCollapsed ? 'center' : 'space-between',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            minHeight: '22px'
          }}>
            {!isCollapsed && (
              <span style={{ 
                fontSize: '11px', 
                fontWeight: '800', 
                textTransform: 'uppercase', 
                color: 'var(--accent-violet, #8b5cf6)', 
                letterSpacing: '1px' 
              }}>
                Engineering portal
              </span>
            )}
            <button 
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--text-muted, #64748b)', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '4px',
                borderRadius: '4px',
                transition: 'background 0.2s'
              }}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                <polyline points="11 17 6 12 11 7" />
                <polyline points="18 17 13 12 18 7" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path || (item.id === 'components' && location.pathname.startsWith('/learning/components/')) || (item.id === 'electricity' && location.pathname.startsWith('/learning/fundamentals/'));
                
                if (item.disabled) {
                  return (
                    <li 
                      key={index} 
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        gap: isCollapsed ? '0' : '12px',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        color: 'var(--text-secondary, #9ca3af)',
                        fontSize: '13px',
                        fontWeight: '500',
                        opacity: 0.45, 
                        cursor: 'not-allowed',
                        whiteSpace: 'nowrap'
                      }}
                      title={`${item.label} (Coming Soon)`}
                    >
                      {item.icon}
                      {!isCollapsed && <span>{item.label}</span>}
                    </li>
                  );
                }
                
                return (
                  <li key={index}>
                    <Link 
                      to={item.path} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        gap: isCollapsed ? '0' : '12px',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        color: isActive ? 'var(--accent-violet, #8b5cf6)' : 'var(--text-secondary, #9ca3af)',
                        background: isActive ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                        border: isActive ? '1px solid rgba(139, 92, 246, 0.15)' : '1px solid transparent',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: isActive ? '700' : '500',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                      title={isCollapsed ? item.label : undefined}
                      className="learning-nav-item"
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

        {/* Bottom Section: Back Link */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Back to Home Link */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: isCollapsed ? '0' : '12px',
              padding: '10px 12px',
              borderRadius: '6px',
              color: 'var(--text-muted, #64748b)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              border: '1px solid transparent',
              transition: 'all 0.2s'
            }}
            title={isCollapsed ? 'Back to Home' : undefined}
            className="learning-nav-item-back"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {!isCollapsed && <span>Back to Home</span>}
          </Link>
        </div>
      </aside>

      {/* Main Panel Viewport */}
      <main className="learning-main-content">
        <Outlet />
      </main>

      <style>{`
        @media (min-width: 769px) {
          .learning-sidebar {
            width: var(--learning-sidebar-width, 240px) !important;
            background: rgba(10, 10, 15, 0.96) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            height: 100vh !important;
            z-index: 100 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            padding: 24px 16px !important;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease !important;
          }
          
          .learning-sidebar.collapsed {
            padding: 24px 12px !important;
          }

          .learning-main-content {
            flex: 1;
            margin-left: var(--learning-sidebar-width, 240px) !important;
            padding: 40px var(--page-padding) !important;
            transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
        }

        .learning-nav-item:hover {
          background: rgba(255, 255, 255, 0.02) !important;
          color: #fff !important;
        }
        .learning-nav-item-back:hover {
          background: rgba(255, 255, 255, 0.02) !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};
