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
import { Feedback } from './modules/public/pages/Feedback';
import { PrivacyPolicy } from './modules/legal/pages/PrivacyPolicy';
import { TermsConditions } from './modules/legal/pages/TermsConditions';
import { ShippingDelivery } from './modules/legal/pages/ShippingDelivery';
import { ReturnsCancellations } from './modules/legal/pages/ReturnsCancellations';
import { PersonalisedOrderPolicy } from './modules/legal/pages/PersonalisedOrderPolicy';
import { CustomBulkEnquiries } from './modules/legal/pages/CustomBulkEnquiries';

// Real context providers
import { SettingsProvider } from './modules/settings/context/SettingsContext';
import { ProjectProvider } from './modules/projects/context/ProjectContext';
import { AuthProvider } from './modules/auth/context/AuthContext';
import { ToastProvider } from './shared/context/ToastContext';
import { CartProvider } from './shared/context/CartContext';
import { EnquiryProvider } from './modules/enquiries/context/EnquiryContext';
import { ThemeProvider } from './shared/context/ThemeContext.jsx';
import { MainLayout } from './shared/components/layout/MainLayout';

export function render(url, ssrData = {}) {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <SettingsProvider initialSettings={ssrData.settings}>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <EnquiryProvider>
                <ProjectProvider initialProjects={ssrData.projects}>
                  <ThemeProvider>
                    <MainLayout>
                      <Routes>
                        <Route path={ROUTES.HOME} element={<Home />} />
                        <Route path={ROUTES.PROJECTS} element={<ProjectListing />} />
                        <Route path={ROUTES.PROJECT_DETAILS} element={<ProjectDetails />} />
                        <Route path={ROUTES.PRINTING} element={<PrintingCatalog />} />
                        <Route path={ROUTES.CONTACT} element={<Contact />} />
                        <Route path={ROUTES.FEEDBACK} element={<Feedback />} />
                        <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
                        <Route path={ROUTES.TERMS_CONDITIONS} element={<TermsConditions />} />
                        <Route path={ROUTES.SHIPPING_DELIVERY || '/shipping-and-delivery'} element={<ShippingDelivery />} />
                        <Route path={ROUTES.RETURNS_CANCELLATIONS || '/returns-and-cancellations'} element={<ReturnsCancellations />} />
                        <Route path={ROUTES.PERSONALISED_ORDER_POLICY || '/personalised-order-policy'} element={<PersonalisedOrderPolicy />} />
                        <Route path={ROUTES.CUSTOM_BULK_ENQUIRIES || '/custom-printing-and-bulk-enquiries'} element={<CustomBulkEnquiries />} />
                        <Route path="*" element={<Home />} />
                      </Routes>
                    </MainLayout>
                  </ThemeProvider>
                </ProjectProvider>
              </EnquiryProvider>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </SettingsProvider>
    </StaticRouter>
  );
}
