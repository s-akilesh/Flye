import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './shared/constants/routes';
import { Home } from './modules/public/pages/Home';
import { ProjectListing } from './modules/projects/pages/ProjectListing';
import { ProjectDetails } from './modules/projects/pages/ProjectDetails';
import { PrintingCatalog } from './modules/public/pages/PrintingCatalog';
import { Contact } from './modules/public/pages/Contact';

// Real context providers
import { SettingsProvider } from './modules/settings/context/SettingsContext';
import { ProjectProvider } from './modules/projects/context/ProjectContext';
import { AuthProvider } from './modules/auth/context/AuthContext';
import { ToastProvider } from './shared/context/ToastContext';
import { EnquiryProvider } from './modules/enquiries/context/EnquiryContext';

export function render(url, ssrData = {}) {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <SettingsProvider initialSettings={ssrData.settings}>
        <AuthProvider>
          <ToastProvider>
            <EnquiryProvider>
              <ProjectProvider initialProjects={ssrData.projects}>
                <Routes>
                  <Route path={ROUTES.HOME} element={<Home />} />
                  <Route path={ROUTES.PROJECTS} element={<ProjectListing />} />
                  <Route path={ROUTES.PROJECT_DETAILS} element={<ProjectDetails />} />
                  <Route path={ROUTES.PRINTING} element={<PrintingCatalog />} />
                  <Route path={ROUTES.CONTACT} element={<Contact />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </ProjectProvider>
            </EnquiryProvider>
          </ToastProvider>
        </AuthProvider>
      </SettingsProvider>
    </StaticRouter>
  );
}
