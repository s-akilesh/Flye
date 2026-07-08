import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ROUTES } from '../shared/constants/routes';
import { MainLayout } from '../shared/components/layout/MainLayout';
import { Home } from '../modules/public/pages/Home';
import { ProjectListing } from '../modules/projects/pages/ProjectListing';
import { ProjectDetails } from '../modules/projects/pages/ProjectDetails';
import { PrintingCatalog } from '../modules/public/pages/PrintingCatalog';
import { LearningHub } from '../modules/public/pages/LearningHub';
import { Contact } from '../modules/public/pages/Contact';
import { PageLoading } from '../shared/components/ui/PageLoading';

// Lazy Load Admin Pages
const AdminDashboard = React.lazy(() => import('../modules/dashboard/pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const ManageProjects = React.lazy(() => import('../modules/projects/pages/ManageProjects').then(module => ({ default: module.ManageProjects })));
const AddProject = React.lazy(() => import('../modules/projects/pages/AddProject').then(module => ({ default: module.AddProject })));
const EditProject = React.lazy(() => import('../modules/projects/pages/EditProject').then(module => ({ default: module.EditProject })));
const ManageEnquiries = React.lazy(() => import('../modules/enquiries/pages/ManageEnquiries').then(module => ({ default: module.ManageEnquiries })));
const AdminSettings = React.lazy(() => import('../modules/settings/pages/AdminSettings').then(module => ({ default: module.AdminSettings })));

const AuthGateway = React.lazy(() => import('../modules/auth/pages/AuthGateway.jsx').then(module => ({ default: module.AuthGateway })));
const AdminLayout = React.lazy(() => import('../shared/components/layout/AdminLayout').then(module => ({ default: module.AdminLayout })));
const PrivacyPolicy = React.lazy(() => import('../modules/legal/pages/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const TermsConditions = React.lazy(() => import('../modules/legal/pages/TermsConditions').then(module => ({ default: module.TermsConditions })));




import { AnalyticsProvider } from '../shared/analytics/index.js';
import { ProtectedRoute } from '../modules/auth/components/ProtectedRoute.jsx';
import { AuthProvider } from '../modules/auth/context/AuthContext.jsx';
import { MaintenancePage } from '../modules/public/pages/MaintenancePage';
import { useSettings } from '../modules/settings/hooks/useSettings';

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
      <AnalyticsProvider>
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
                  <Route path={ROUTES.CONTACT} element={<Contact />} />
                  <Route path={ROUTES.VIDEOS || '/videos'} element={<LearningHub />} />
                  <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
                  <Route path={ROUTES.TERMS_CONDITIONS} element={<TermsConditions />} />
                  
                  {/* Redirect Learning Workspace & Student Auth to Home */}
                  <Route path="/learning/*" element={<Navigate to={ROUTES.HOME} replace />} />
                  <Route path="/dashboard" element={<Navigate to={ROUTES.HOME} replace />} />
                  <Route path="/settings" element={<Navigate to={ROUTES.HOME} replace />} />
                  <Route path={ROUTES.STUDENT_AUTH} element={<React.Suspense fallback={<PageLoading />}><AuthGateway /></React.Suspense>} />

                  {/* Redirect Legacy Admin Access to Auth Gateway */}
                  <Route path={ROUTES.ADMIN_ACCESS} element={<Navigate to={ROUTES.STUDENT_AUTH} replace />} />

                  {/* Protected Admin Console Routes wrapped in AdminLayout */}
                  <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                    <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
                    <Route path={ROUTES.ADMIN_PROJECTS} element={<ManageProjects />} />
                    <Route path={ROUTES.ADMIN_ADD_PROJECT} element={<AddProject />} />
                    <Route path={ROUTES.ADMIN_EDIT_PROJECT} element={<EditProject />} />
                    <Route path={ROUTES.ADMIN_ENQUIRIES} element={<ManageEnquiries />} />
                    <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettings />} />
                    <Route path="/admin/components/*" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
                  </Route>
                  
                  <Route path="*" element={<Home />} />
                </Routes>
              </React.Suspense>
            </AnimatePresence>
          </MaintenanceGate>
        </MainLayout>
      </AuthProvider>
      </AnalyticsProvider>
    </BrowserRouter>
  );
};
