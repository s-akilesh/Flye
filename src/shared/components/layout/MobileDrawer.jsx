import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LEARNING_NAVIGATION, 
  PROJECTS_NAVIGATION, 
  QUICK_ACTIONS,
  HOMEPAGE_NAVIGATION
} from '../../config/navigation';
import { useAuth } from '../../../modules/auth/context/AuthContext';
import { Button } from '../ui/Button';
import { ROUTES } from '../../constants/routes.js';

// Icon Map helper for Drawer list items
const DrawerIcon = ({ id }) => {
  const color = 'currentColor';
  if (id === 'dashboard') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    );
  }
  if (id === 'workspace') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    );
  }
  if (id === 'roadmap') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }
  if (id === 'electricity') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }
  if (id === 'components' || id === 'kits') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="12" y1="8" x2="12" y2="16" />
      </svg>
    );
  }
  if (id === 'experiments') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
        <path d="M12 2v10" />
        <path d="M9 12h6" />
        <path d="M12 2L9 6h6z" />
      </svg>
    );
  }
  if (id === 'progress') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    );
  }
  if (id === 'bookmarks') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  if (id === 'printing') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    );
  }
  if (id === 'saved') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }
  if (id === 'ai') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 7.54 16.59l.06.06a2 2 0 0 1 0 2.83c-.78.78-2.05.78-2.83 0l-.06-.06A10 10 0 1 1 12 2z" />
      </svg>
    );
  }
  if (id === 'contact') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  if (id === 'settings') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
};

export const MobileDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isAdmin, logout, viewMode, setViewMode } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Manage dynamic "Continue Learning" & "Recently Visited" from LocalStorage
  const [lastLesson, setLastLesson] = useState({
    name: 'Electrical Basics',
    slug: 'electricity',
    progress: 68,
    isFallback: true
  });
  const [recents, setRecents] = useState([
    { title: 'Voltage', path: '/learning/fundamentals/electricity' },
    { title: 'Capacitor', path: '/learning/components/capacitor' },
    { title: 'Resistor', path: '/learning/components/resistor' }
  ]);

  useEffect(() => {
    // Load last lesson
    const savedLast = localStorage.getItem('flyen_last_lesson');
    if (savedLast) {
      try {
        setLastLesson(JSON.parse(savedLast));
      } catch (e) {
        console.error(e);
      }
    }
    // Load recents
    const savedRecents = localStorage.getItem('flyen_recent_history');
    if (savedRecents) {
      try {
        setRecents(JSON.parse(savedRecents).slice(0, 5));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onClose();
    navigate(`/learning/components?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLinkClick = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = async () => {
    onClose();
    try {
      await logout();
      navigate('/admin-login');
    } catch (e) {
      console.error(e);
    }
  };

  // Determine menu mode (Context navigation vs global app navigation)
  const isLearningContext = location.pathname.startsWith('/learning');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay mask */}
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 9998
            }}
          />

          {/* Slide-in Menu Container */}
          <motion.div
            className="drawer-container card-glass"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '80%',
              maxWidth: '360px',
              height: '100%',
              background: 'rgba(10, 10, 15, 0.95)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 9999,
              overflow: 'hidden'
            }}
          >
            {/* Drawer Body Scroll Container */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Header Close button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Menu</span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
              </div>

              {/* Drawer Header Status block */}
              <div className="drawer-user-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-violet))', 
                      display: profile?.avatar_url ? 'none' : 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: '800', 
                      color: '#fff', 
                      fontSize: '14px' 
                    }}>
                      {getInitials(profile?.full_name || user?.email)}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#fff' }}>
                        {profile?.full_name || user?.email || 'Student'}
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--accent-violet)', fontWeight: 'bold' }}>
                        {profile?.role === 'admin' ? 'Flyen Staff' : 'Student'}
                      </span>
                    </div>
                  </div>
                ) : null}

                {/* Switch view mode button inside drawer for admins */}
                {user && isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      const nextMode = viewMode === 'admin' ? 'user' : 'admin';
                      setViewMode(nextMode);
                      onClose(); // Close drawer
                      if (nextMode === 'admin') {
                        navigate(ROUTES.ADMIN_DASHBOARD);
                      } else {
                        navigate('/');
                      }
                    }}
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'rgba(139, 92, 246, 0.12)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      color: 'var(--accent-violet)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 3L21 8L16 13" />
                      <path d="M21 8H9" />
                      <path d="M8 21L3 16L8 11" />
                      <path d="M3 16H15" />
                    </svg>
                    {viewMode === 'admin' ? 'Switch to User View' : 'Switch to Admin View'}
                  </button>
                )}
                
                {/* Micro Progress Bar summary */}
                {!user && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Electrical Basics Progress</span>
                      <span>68%</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '68%', height: '100%', background: 'var(--accent-violet)' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Search functionality removed */}


              {/* Menu Items Render */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {location.pathname.startsWith('/admin') ? (
                  /* Focused Admin Navigation */
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent-violet)', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                      Admin Console
                    </span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <li>
                        <button
                          type="button"
                          onClick={() => handleLinkClick('/admin/dashboard')}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: location.pathname === '/admin/dashboard' ? 'rgba(139,92,246,0.08)' : 'none',
                            border: 'none',
                            color: location.pathname === '/admin/dashboard' ? 'var(--accent-violet)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '12.5px',
                            textAlign: 'left'
                          }}
                        >
                          Dashboard
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => handleLinkClick('/admin/projects')}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: location.pathname.startsWith('/admin/projects') ? 'rgba(139,92,246,0.08)' : 'none',
                            border: 'none',
                            color: location.pathname.startsWith('/admin/projects') ? 'var(--accent-violet)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '12.5px',
                            textAlign: 'left'
                          }}
                        >
                          Manage Projects
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => handleLinkClick('/admin/enquiries')}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: location.pathname === '/admin/enquiries' ? 'rgba(139,92,246,0.08)' : 'none',
                            border: 'none',
                            color: location.pathname === '/admin/enquiries' ? 'var(--accent-violet)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '12.5px',
                            textAlign: 'left'
                          }}
                        >
                          Manage Enquiries
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => handleLinkClick('/admin/settings')}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: location.pathname.startsWith('/admin/settings') ? 'rgba(139,92,246,0.08)' : 'none',
                            border: 'none',
                            color: location.pathname.startsWith('/admin/settings') ? 'var(--accent-violet)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '12.5px',
                            textAlign: 'left'
                          }}
                        >
                          Settings
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : isLearningContext ? (
                  /* Focused Learning Navigation */
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                      Engineering Workspace
                    </span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {LEARNING_NAVIGATION.map((item) => {
                        const isNavActive = location.pathname === item.path;
                        if (item.disabled) return null;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => handleLinkClick(item.path)}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                background: isNavActive ? 'rgba(139,92,246,0.08)' : 'none',
                                border: 'none',
                                color: isNavActive ? 'var(--accent-violet)' : 'var(--text-primary)',
                                cursor: 'pointer',
                                fontSize: '12.5px',
                                textAlign: 'left'
                              }}
                            >
                              {item.label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  /* Simplified Homepage Navigation */
                  <div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {HOMEPAGE_NAVIGATION.map((item) => {
                        const isNavActive = location.pathname === item.path;
                        if (item.id === 'login' && user) return null; // Hide login if user is logged in
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                if (item.path.startsWith('/#')) {
                                  // Scroll to anchor on home page
                                  navigate('/');
                                  setTimeout(() => {
                                    const el = document.getElementById(item.path.substring(2));
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                  }, 100);
                                } else {
                                  navigate(item.path);
                                }
                              }}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                background: isNavActive ? 'rgba(139,92,246,0.08)' : 'none',
                                border: 'none',
                                color: isNavActive ? 'var(--accent-violet)' : 'var(--text-primary)',
                                cursor: 'pointer',
                                fontSize: '12.5px',
                                textAlign: 'left'
                              }}
                            >
                              {item.label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Recently Visited */}
                {!user && recents.length > 0 && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                      Recently Visited
                    </span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {recents.map((item, idx) => (
                        <li key={idx}>
                          <button
                            type="button"
                            onClick={() => handleLinkClick(item.path)}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                              fontSize: '11.5px',
                              textAlign: 'left',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            • {item.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {QUICK_ACTIONS.map((act) => {
                  if (act.requiresAdmin && !user) return null;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => handleLinkClick(act.path || '/contact')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '11px',
                        textAlign: 'left'
                      }}
                    >
                      {act.label}
                    </button>
                  );
                })}
              </div>

              {/* Login / Logout button */}
              {user && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleLogout} 
                  style={{ width: '100%', padding: '6px 0', fontSize: '11px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-crimson)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                >
                  Logout (Admin)
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
