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
const AdminLayout = React.lazy(() => import('../components/layout/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AuthGateway = React.lazy(() => import('../pages/AuthGateway').then(module => ({ default: module.AuthGateway })));

// Lazy Load Learning Workspace Pages & Layout
const LearningLayout = React.lazy(() => import('../components/layout/LearningLayout').then(module => ({ default: module.LearningLayout })));
const EngineeringWorkspace = React.lazy(() => import('../pages/learning/EngineeringWorkspace').then(module => ({ default: module.EngineeringWorkspace })));
const Fundamentals = React.lazy(() => import('../pages/learning/Fundamentals').then(module => ({ default: module.Fundamentals })));
const ComponentLibrary = React.lazy(() => import('../pages/learning/ComponentLibrary').then(module => ({ default: module.ComponentLibrary })));
const ComponentDetails = React.lazy(() => import('../pages/learning/ComponentDetails').then(module => ({ default: module.ComponentDetails })));
const ComponentBuildChallenge = React.lazy(() => import('../pages/learning/ComponentBuildChallenge').then(module => ({ default: module.ComponentBuildChallenge })));
const FundamentalDetails = React.lazy(() => import('../pages/learning/FundamentalDetails').then(module => ({ default: module.FundamentalDetails })));
const StudentDashboard = React.lazy(() => import('../pages/StudentDashboard').then(module => ({ default: module.StudentDashboard })));
const StudentSettings = React.lazy(() => import('../pages/StudentSettings').then(module => ({ default: module.StudentSettings })));
const StudentProtectedRoute = React.lazy(() => import('../components/auth/StudentProtectedRoute.jsx').then(module => ({ default: module.StudentProtectedRoute })));

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
                  <Route path={ROUTES.CONTACT} element={<Contact />} />
                  <Route path={ROUTES.VIDEOS || '/videos'} element={<LearningHub />} />
                  
                  {/* Learning Workspace Platform */}
                  <Route path={ROUTES.LEARNING} element={<Navigate to={ROUTES.LEARNING_WORKSPACE} replace />} />
                  <Route element={<LearningLayout />}>
                    <Route path={ROUTES.STUDENT_DASHBOARD} element={<React.Suspense fallback={<PageLoading />}><StudentProtectedRoute><StudentDashboard /></StudentProtectedRoute></React.Suspense>} />
                    <Route path={ROUTES.LEARNING_WORKSPACE} element={<EngineeringWorkspace />} />
                    <Route path={ROUTES.LEARNING_FUNDAMENTALS} element={<Fundamentals />} />
                    <Route path={ROUTES.LEARNING_FUNDAMENTAL_DETAILS} element={<FundamentalDetails />} />
                    <Route path={ROUTES.LEARNING_COMPONENTS} element={<ComponentLibrary />} />
                    <Route path={ROUTES.LEARNING_COMPONENT_DETAILS} element={<ComponentDetails />} />
                    <Route path={ROUTES.LEARNING_COMPONENT_BUILD} element={<ComponentBuildChallenge />} />
                  </Route>
                  
                  {/* Redirect Legacy Admin Access to Admin Login */}
                  <Route path={ROUTES.ADMIN_ACCESS} element={<Navigate to={ROUTES.ADMIN_LOGIN || '/admin-login'} replace />} />
                  
                  {/* Admin Login Route */}
                  <Route path={ROUTES.ADMIN_LOGIN || '/admin-login'} element={<AdminLogin />} />

                  {/* Student Auth Gateway */}
                  <Route path={ROUTES.STUDENT_AUTH} element={<AuthGateway />} />

                  {/* Student Settings */}
                  <Route path={ROUTES.STUDENT_SETTINGS} element={<React.Suspense fallback={<PageLoading />}><StudentProtectedRoute><StudentSettings /></StudentProtectedRoute></React.Suspense>} />

                  {/* Protected Admin Console Routes wrapped in AdminLayout */}
                  <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                    <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
                    <Route path={ROUTES.ADMIN_PROJECTS} element={<ManageProjects />} />
                    <Route path={ROUTES.ADMIN_ADD_PROJECT} element={<AddProject />} />
                    <Route path={ROUTES.ADMIN_EDIT_PROJECT} element={<EditProject />} />
                    <Route path={ROUTES.ADMIN_ENQUIRIES} element={<ManageEnquiries />} />
                    <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettings />} />
                  </Route>
                  
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
