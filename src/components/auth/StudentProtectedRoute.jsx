import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROUTES } from '../../constants/routes.js';

export const StudentProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 160px)',
        gap: '16px',
        background: 'transparent'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid rgba(255, 255, 255, 0.03)',
          borderTopColor: 'var(--accent-violet, #8b5cf6)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.STUDENT_AUTH} replace />;
  }

  return children;
};
