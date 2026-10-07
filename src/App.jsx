import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router/AppRouter';
import { SettingsProvider } from './modules/settings/context/SettingsContext';
import { ProjectProvider } from './modules/projects/context/ProjectContext';
import { EnquiryProvider } from './modules/enquiries/context/EnquiryContext';
import { ToastProvider } from './shared/context/ToastContext';
import { CartProvider } from './shared/context/CartContext';
import { AuthProvider } from './modules/auth/context/AuthContext.jsx';
import { ThemeProvider } from './shared/context/ThemeContext.jsx';
import { AnalyticsProvider } from './shared/analytics/index.js';
import { ErrorBoundary } from './shared/components/ui/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AnalyticsProvider>
          <ToastProvider>
            <CartProvider>
              <AuthProvider>
                <SettingsProvider>
                  <ThemeProvider>
                    <ProjectProvider>
                      <EnquiryProvider>
                        <AppRouter />
                      </EnquiryProvider>
                    </ProjectProvider>
                  </ThemeProvider>
                </SettingsProvider>
              </AuthProvider>
            </CartProvider>
          </ToastProvider>
        </AnalyticsProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}


