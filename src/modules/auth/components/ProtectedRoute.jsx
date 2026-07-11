import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../../../shared/constants/routes.js';

export const ProtectedRoute = ({ children, requireAdmin = true }) => {
  const { user, loading, profile, isAdmin, viewMode } = useAuth();

  if (loading) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 'calc(100vh - 160px)',
          gap: 'var(--space-4)',
          background: 'transparent'
        }}
      >
        <svg 
          viewBox="0 0 24 24" 
          style={{
            width: '48px',
            height: '48px',
            animation: 'spin 1s linear infinite',
            stroke: 'var(--accent-violet)',
            fill: 'none',
            strokeWidth: '2',
            strokeLinecap: 'round'
          }}
        >
          <circle cx="12" cy="12" r="10" stroke="rgba(124, 58, 237, 0.15)" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '0.5px' }}>
          VERIFYING SESSION...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.STUDENT_AUTH} replace />;
  }

  if (!profile) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 'calc(100vh - 160px)',
          gap: 'var(--space-4)',
          background: 'transparent'
        }}
      >
        <svg 
          viewBox="0 0 24 24" 
          style={{
            width: '48px',
            height: '48px',
            animation: 'spin 1s linear infinite',
            stroke: 'var(--accent-violet)',
            fill: 'none',
            strokeWidth: '2',
            strokeLinecap: 'round'
          }}
        >
          <circle cx="12" cy="12" r="10" stroke="rgba(124, 58, 237, 0.15)" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '0.5px' }}>
          VERIFYING AUTHORIZATION...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (requireAdmin) {
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }

    if (viewMode !== 'admin') {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};
