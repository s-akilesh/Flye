import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';

export const RoleSwitcher = () => {
  const { user, viewMode, setViewMode } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleToggle = () => {
    const nextMode = viewMode === 'admin' ? 'student' : 'admin';
    setViewMode(nextMode);
    
    if (nextMode === 'admin') {
      navigate(ROUTES.ADMIN_DASHBOARD);
    } else {
      navigate('/');
    }
  };

  return (
    <div 
      className="role-switcher-widget"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 99999,
        background: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--accent-violet)',
        padding: '8px 14px',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, padding: 0 }}>
          Viewing As
        </span>
        <span style={{ fontSize: '12px', fontWeight: '800', color: viewMode === 'admin' ? 'var(--accent-violet)' : 'var(--accent-blue)', margin: 0, padding: 0 }}>
          {viewMode === 'admin' ? '🛠️ Admin Mode' : '🎓 Student Mode'}
        </span>
      </div>
      <button
        type="button"
        onClick={handleToggle}
        style={{
          background: viewMode === 'admin' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(139, 92, 246, 0.15)',
          border: `1px solid ${viewMode === 'admin' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
          color: viewMode === 'admin' ? 'var(--accent-blue)' : 'var(--accent-violet)',
          padding: '6px 12px',
          borderRadius: '16px',
          fontSize: '11px',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
      >
        {viewMode === 'admin' ? 'View Student' : 'View Admin'}
      </button>
    </div>
  );
};
