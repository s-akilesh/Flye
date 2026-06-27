import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BOTTOM_NAVIGATION, LEARNING_NAVIGATION } from '../../config/navigation';
import { useAuth } from '../../context/AuthContext';

// Icons mapping helper
const BottomNavIcon = ({ id, isActive }) => {
  const activeColor = 'var(--accent-violet)';
  const inactiveColor = 'var(--text-muted)';
  const strokeColor = isActive ? activeColor : inactiveColor;

  if (id === 'home') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  if (id === 'workspace') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    );
  }
  if (id === 'projects') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    );
  }
  if (id === 'enquiries') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  if (id === 'dashboard') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    );
  }
  if (id === 'settings') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
};

export const BottomNavigation = ({ onToggleDrawer, isDrawerOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showWorkspaceDrawer, setShowWorkspaceDrawer] = useState(false);

  const isAdminContext = location.pathname.startsWith('/admin');

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin' },
    { id: 'projects', label: 'Projects', path: '/admin/projects' },
    { id: 'enquiries', label: 'Enquiries', path: '/admin/enquiries' },
    { id: 'settings', label: 'Settings', path: '/admin/settings' }
  ];

  const menuItems = isAdminContext ? adminNavItems : BOTTOM_NAVIGATION;

  const handleItemClick = (item) => {
    if (item.id === 'workspace') {
      setShowWorkspaceDrawer(prev => !prev);
    } else if (item.action === 'toggleDrawer') {
      onToggleDrawer();
    } else {
      setShowWorkspaceDrawer(false);
      navigate(item.path);
    }
  };

  // 1. Render Workspace Quick Selector Drawer (overlay above footer menu)
  const learningWorkspaceItems = [
    { label: 'Dashboard', path: '/learning/workspace' },
    { label: 'Component Library', path: '/learning/components' },
    { label: 'Electronic Basics', path: '/learning/fundamentals' },
    { label: 'Learning Roadmap', path: '/learning/roadmap' }
  ];

  return (
    <>
      {showWorkspaceDrawer && !isAdminContext && (
        <div 
          className="workspace-selector-drawer"
          style={{
            position: 'fixed',
            bottom: '64px', // height of bottom navigation
            left: 0,
            right: 0,
            background: 'rgba(10, 10, 15, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid var(--accent-violet)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            padding: '16px var(--space-4)',
            zIndex: 999,
            boxShadow: '0 -10px 25px rgba(139, 92, 246, 0.15)',
            animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-violet)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Select Workspace Section
            </span>
            <button 
              onClick={() => setShowWorkspaceDrawer(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px' }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {learningWorkspaceItems.map((subItem) => {
              const isSubActive = location.pathname === subItem.path;
              return (
                <button
                  key={subItem.path}
                  type="button"
                  onClick={() => {
                    setShowWorkspaceDrawer(false);
                    navigate(subItem.path);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isSubActive ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSubActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                    color: isSubActive ? 'var(--accent-violet)' : '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isSubActive ? 'var(--accent-violet)' : 'var(--text-muted)' }} />
                  {subItem.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <nav className="mobile-bottom-nav" style={{ zIndex: 1000 }}>
        {menuItems.map((item) => {
          // Evaluate active status
          let isActive = false;
          if (item.id === 'workspace') {
            isActive = showWorkspaceDrawer;
          } else if (item.action === 'toggleDrawer') {
            isActive = isDrawerOpen;
          } else {
            const targetPath = item.path || (item.guestPath && !user ? item.guestPath : item.adminPath);
            if (targetPath === '/' || targetPath === '/admin') {
              isActive = location.pathname === targetPath;
            } else {
              isActive = location.pathname.startsWith(targetPath);
            }
          }

          return (
            <button
              key={item.id}
              type="button"
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleItemClick(item)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                padding: '6px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                flex: 1,
                cursor: 'pointer',
                color: isActive ? 'var(--accent-violet)' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              <div className="bottom-nav-icon-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BottomNavIcon id={item.id} isActive={isActive} />
              </div>
              <span className="bottom-nav-label" style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.2px' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
