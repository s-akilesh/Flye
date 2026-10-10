import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ROUTES } from '../shared/constants/routes';
import { MainLayout } from '../shared/components/layout/MainLayout';
import { PageLoading } from '../shared/components/ui/PageLoading';
import { ProtectedRoute } from '../modules/auth/components/ProtectedRoute.jsx';
import { MaintenancePage } from '../modules/public/pages/MaintenancePage';
import { useSettings } from '../modules/settings/hooks/useSettings';
import { Home } from '../modules/public/pages/Home';

import { lazyRoutes } from './lazyRoutes';
export { lazyRoutes };

// Lazy Load Public Pages
const ProjectListing = React.lazy(lazyRoutes.ProjectListing);
const ProjectDetails = React.lazy(lazyRoutes.ProjectDetails);
const PrintingCatalog = React.lazy(lazyRoutes.PrintingCatalog);
const LearningHub = React.lazy(lazyRoutes.LearningHub);
const Contact = React.lazy(lazyRoutes.Contact);
const Feedback = React.lazy(lazyRoutes.Feedback);
const OurProcess = React.lazy(lazyRoutes.OurProcess);

// Lazy Load Admin Pages
const AdminDashboard = React.lazy(() => import('../modules/dashboard/pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const ManageProjects = React.lazy(() => import('../modules/projects/pages/ManageProjects').then(module => ({ default: module.ManageProjects })));
const AddProject = React.lazy(() => import('../modules/projects/pages/AddProject').then(module => ({ default: module.AddProject })));
const EditProject = React.lazy(() => import('../modules/projects/pages/EditProject').then(module => ({ default: module.EditProject })));
const ManageEnquiries = React.lazy(() => import('../modules/enquiries/pages/ManageEnquiries').then(module => ({ default: module.ManageEnquiries })));
const ManageReviews = React.lazy(() => import('../modules/reviews/pages/ManageReviews').then(module => ({ default: module.ManageReviews })));
const AdminSettings = React.lazy(() => import('../modules/settings/pages/AdminSettings').then(module => ({ default: module.AdminSettings })));
const ManageContacts = React.lazy(() => import('../modules/contact/pages/ManageContacts').then(module => ({ default: module.ManageContacts })));
const ActivityLogs = React.lazy(() => import('../modules/dashboard/pages/ActivityLogs').then(module => ({ default: module.ActivityLogs })));
const ManageNotifications = React.lazy(() => import('../modules/dashboard/pages/ManageNotifications').then(module => ({ default: module.ManageNotifications })));

const AuthGateway = React.lazy(() => import('../modules/auth/pages/AuthGateway.jsx').then(module => ({ default: module.AuthGateway })));
const AdminLayout = React.lazy(() => import('../shared/components/layout/AdminLayout').then(module => ({ default: module.AdminLayout })));
const PrivacyPolicy = React.lazy(() => import('../modules/legal/pages/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const TermsConditions = React.lazy(() => import('../modules/legal/pages/TermsConditions').then(module => ({ default: module.TermsConditions })));
const ShippingDelivery = React.lazy(() => import('../modules/legal/pages/ShippingDelivery').then(module => ({ default: module.ShippingDelivery })));
const ReturnsCancellations = React.lazy(() => import('../modules/legal/pages/ReturnsCancellations').then(module => ({ default: module.ReturnsCancellations })));
const PersonalisedOrderPolicy = React.lazy(() => import('../modules/legal/pages/PersonalisedOrderPolicy').then(module => ({ default: module.PersonalisedOrderPolicy })));
const CustomBulkEnquiries = React.lazy(() => import('../modules/legal/pages/CustomBulkEnquiries').then(module => ({ default: module.CustomBulkEnquiries })));
const MyProjects = React.lazy(lazyRoutes.MyProjects);
const ProfilePage = React.lazy(() => import('../modules/profile/pages/ProfilePage').then(module => ({ default: module.ProfilePage })));

// 3D Print Inventory Lazy Pages
const PrintingProductDetails = React.lazy(() => import('../modules/public/pages/PrintingProductDetails').then(module => ({ default: module.PrintingProductDetails })));
const ProductList = React.lazy(() => import('../modules/printing-inventory/pages/ProductList').then(module => ({ default: module.ProductList })));
const AddEditProduct = React.lazy(() => import('../modules/printing-inventory/pages/AddEditProduct').then(module => ({ default: module.AddEditProduct })));
const AdminProductDetails = React.lazy(() => import('../modules/printing-inventory/pages/AdminProductDetails').then(module => ({ default: module.AdminProductDetails })));

// Category Management Lazy Pages
const CategoryList = React.lazy(() => import('../modules/categories/pages/CategoryList').then(module => ({ default: module.CategoryList })));
const CategoryDetails = React.lazy(() => import('../modules/categories/pages/CategoryDetails').then(module => ({ default: module.CategoryDetails })));

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
    <MainLayout>
      <MaintenanceGate>
      <AnimatePresence mode="wait">
        <React.Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.PROJECTS} element={<ProjectListing />} />
            <Route path={ROUTES.PROJECT_DETAILS} element={<ProjectDetails />} />
            <Route path={ROUTES.PRINTING} element={<PrintingCatalog />} />
            <Route path={ROUTES.PRINTING_DETAILS} element={<PrintingProductDetails />} />
            <Route path={ROUTES.CONTACT} element={<Contact />} />
            <Route path={ROUTES.FEEDBACK} element={<Feedback />} />
            <Route path="/review" element={<Feedback />} />
            <Route path="/reviews" element={<Feedback />} />
            <Route path={ROUTES.VIDEOS || '/videos'} element={<LearningHub />} />
            <Route path={ROUTES.SHIPPING_DELIVERY || '/shipping-and-delivery'} element={<ShippingDelivery />} />
            <Route path={ROUTES.RETURNS_CANCELLATIONS || '/returns-and-cancellations'} element={<ReturnsCancellations />} />
            <Route path={ROUTES.PERSONALISED_ORDER_POLICY || '/personalised-order-policy'} element={<PersonalisedOrderPolicy />} />
            <Route path={ROUTES.CUSTOM_BULK_ENQUIRIES || '/custom-printing-and-bulk-enquiries'} element={<CustomBulkEnquiries />} />
            <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
            <Route path={ROUTES.TERMS_CONDITIONS} element={<TermsConditions />} />
            <Route path={ROUTES.OUR_PROCESS} element={<OurProcess />} />
            <Route path="/process" element={<Navigate to={ROUTES.OUR_PROCESS} replace />} />
            <Route path={ROUTES.MY_PROJECTS} element={<MyProjects />} />
            <Route path={ROUTES.MY_PROFILE} element={<ProtectedRoute requireAdmin={false}><ProfilePage /></ProtectedRoute>} />
            
            {/* Redirect Learning Workspace & Student Auth to Home */}
            <Route path="/learning/*" element={<Navigate to={ROUTES.HOME} replace />} />
            <Route path="/dashboard" element={<Navigate to={ROUTES.HOME} replace />} />
            <Route path="/settings" element={<Navigate to={ROUTES.MY_PROFILE} replace />} />
            <Route path={ROUTES.STUDENT_AUTH} element={<React.Suspense fallback={<PageLoading />}><AuthGateway /></React.Suspense>} />

            {/* Redirect Legacy Admin Access to Auth Gateway */}
            <Route path={ROUTES.ADMIN_ACCESS} element={<Navigate to={ROUTES.STUDENT_AUTH} replace />} />

            {/* Protected Admin Console Routes wrapped in AdminLayout */}
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
              <Route path={ROUTES.ADMIN_PROJECTS} element={<ManageProjects />} />
              <Route path={ROUTES.ADMIN_ADD_PROJECT} element={<AddProject />} />
              <Route path={ROUTES.ADMIN_EDIT_PROJECT} element={<EditProject />} />
              
              {/* 3D Print Inventory Admin routes */}
              <Route path={ROUTES.ADMIN_PRINTING_INVENTORY} element={<ProductList />} />
              <Route path={ROUTES.ADMIN_PRINTING_INVENTORY_ADD} element={<AddEditProduct />} />
              <Route path={ROUTES.ADMIN_PRINTING_INVENTORY_EDIT} element={<AddEditProduct />} />
              <Route path={ROUTES.ADMIN_PRINTING_INVENTORY_DETAILS} element={<AdminProductDetails />} />

              {/* Category Management Admin routes */}
              <Route path={ROUTES.ADMIN_CATEGORIES} element={<CategoryList />} />
              <Route path={ROUTES.ADMIN_CATEGORY_DETAILS} element={<CategoryDetails />} />

              <Route path={ROUTES.ADMIN_ENQUIRIES} element={<ManageEnquiries />} />
              <Route path={ROUTES.ADMIN_REVIEWS} element={<ManageReviews />} />
              <Route path="/admin/feedback" element={<ManageReviews />} />
              <Route path={ROUTES.ADMIN_CONTACTS} element={<ManageContacts />} />
              <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettings />} />
              <Route path={ROUTES.ADMIN_PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.ADMIN_ACTIVITY_LOGS} element={<ActivityLogs />} />
              <Route path={ROUTES.ADMIN_NOTIFICATIONS} element={<ManageNotifications />} />
              <Route path="/admin/components/*" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
            </Route>
            
            <Route path="*" element={<Home />} />
          </Routes>
        </React.Suspense>
      </AnimatePresence>
    </MaintenanceGate>
  </MainLayout>
  );
};
