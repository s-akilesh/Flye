import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

/**
 * Route Guard Component for securing admin panels.
 * Redirects unauthenticated users directly to `/admin-access`.
 */
export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('flyen_admin_access') === 'true';

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.ADMIN_ACCESS} replace />;
  }

  return children;
};
