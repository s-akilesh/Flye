import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ROUTES } from '../constants/routes';
import { MainLayout } from '../components/layout/MainLayout';
import { Home } from '../pages/Home';
import { ProjectListing } from '../pages/ProjectListing';
import { ProjectDetails } from '../pages/ProjectDetails';
import { PrintingCatalog } from '../pages/PrintingCatalog';
import { LearningHub } from '../pages/LearningHub';
import { Contact } from '../pages/Contact';
import { ManageProjects } from '../pages/ManageProjects';
import { AddProject } from '../pages/AddProject';
import { EditProject } from '../pages/EditProject';
import { ManageEnquiries } from '../pages/ManageEnquiries';
import { AdminAccess } from '../pages/AdminAccess';
import { AdminDashboard } from '../pages/AdminDashboard';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.PROJECTS} element={<ProjectListing />} />
            <Route path={ROUTES.PROJECT_DETAILS} element={<ProjectDetails />} />
            <Route path={ROUTES.PRINTING} element={<PrintingCatalog />} />
            <Route path={ROUTES.VIDEOS} element={<LearningHub />} />
            <Route path={ROUTES.CONTACT} element={<Contact />} />
            
            {/* Public Admin Entry */}
            <Route path={ROUTES.ADMIN_ACCESS} element={<AdminAccess />} />

            {/* Protected Admin Console Routes */}
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_PROJECTS} element={<ProtectedRoute><ManageProjects /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_ADD_PROJECT} element={<ProtectedRoute><AddProject /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_EDIT_PROJECT} element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_ENQUIRIES} element={<ProtectedRoute><ManageEnquiries /></ProtectedRoute>} />
            
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </MainLayout>
    </BrowserRouter>
  );
};
