import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ROUTES } from '../constants/routes';
import { MainLayout } from '../components/layout/MainLayout';
import { Home } from '../pages/Home';
import { ProjectListing } from '../pages/ProjectListing';
import { ProjectDetails } from '../pages/ProjectDetails';
import { PrintingCatalog } from '../pages/PrintingCatalog';
import { LearningHub } from '../pages/LearningHub';
import { Contact } from '../pages/Contact';
import { PageLoading } from '../components/ui/PageLoading';

// Lazy Load Admin Pages
const AdminDashboard = React.lazy(() => import('../pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const ManageProjects = React.lazy(() => import('../pages/ManageProjects').then(module => ({ default: module.ManageProjects })));
const AddProject = React.lazy(() => import('../pages/AddProject').then(module => ({ default: module.AddProject })));
const EditProject = React.lazy(() => import('../pages/EditProject').then(module => ({ default: module.EditProject })));
const ManageEnquiries = React.lazy(() => import('../pages/ManageEnquiries').then(module => ({ default: module.ManageEnquiries })));
const AdminSettings = React.lazy(() => import('../pages/AdminSettings').then(module => ({ default: module.AdminSettings })));
const AdminLogin = React.lazy(() => import('../pages/AdminLogin.jsx').then(module => ({ default: module.AdminLogin })));

import { ProtectedRoute } from '../components/auth/ProtectedRoute.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import { MaintenancePage } from '../pages/MaintenancePage';
import { useSettings } from '../hooks/useSettings';

const MaintenanceGate = ({ children }) => {
  const { settings } = useSettings();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (settings.maintenanceMode && !isAdminRoute) {
    return <MaintenancePage />;
  }
  
  return children;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout>
          <MaintenanceGate>
            <AnimatePresence mode="wait">
              <React.Suspense fallback={<PageLoading />}>
                <Routes>
                  <Route path={ROUTES.HOME} element={<Home />} />
                  <Route path={ROUTES.PROJECTS} element={<ProjectListing />} />
                  <Route path={ROUTES.PROJECT_DETAILS} element={<ProjectDetails />} />
                  <Route path={ROUTES.PRINTING} element={<PrintingCatalog />} />
                  <Route path={ROUTES.VIDEOS} element={<LearningHub />} />
                  <Route path={ROUTES.CONTACT} element={<Contact />} />
                  
                  {/* Redirect Legacy Admin Access to Admin Login */}
                  <Route path={ROUTES.ADMIN_ACCESS} element={<Navigate to={ROUTES.ADMIN_LOGIN || '/admin-login'} replace />} />
                  
                  {/* Admin Login Route */}
                  <Route path={ROUTES.ADMIN_LOGIN || '/admin-login'} element={<AdminLogin />} />

                  {/* Protected Admin Console Routes */}
                  <Route path={ROUTES.ADMIN_DASHBOARD} element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path={ROUTES.ADMIN_PROJECTS} element={<ProtectedRoute><ManageProjects /></ProtectedRoute>} />
                  <Route path={ROUTES.ADMIN_ADD_PROJECT} element={<ProtectedRoute><AddProject /></ProtectedRoute>} />
                  <Route path={ROUTES.ADMIN_EDIT_PROJECT} element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
                  <Route path={ROUTES.ADMIN_ENQUIRIES} element={<ProtectedRoute><ManageEnquiries /></ProtectedRoute>} />
                  <Route path={ROUTES.ADMIN_SETTINGS} element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
                  
                  <Route path="*" element={<Home />} />
                </Routes>
              </React.Suspense>
            </AnimatePresence>
          </MaintenanceGate>
        </MainLayout>
      </AuthProvider>
    </BrowserRouter>
  );
};
