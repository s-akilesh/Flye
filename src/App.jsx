import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router/AppRouter';
import { SettingsProvider } from './modules/settings/context/SettingsContext';
import { ProjectProvider } from './modules/projects/context/ProjectContext';
import { EnquiryProvider } from './modules/enquiries/context/EnquiryContext';
import { ToastProvider } from './shared/context/ToastContext';
import { AuthProvider } from './modules/auth/context/AuthContext.jsx';
import { ThemeProvider } from './shared/context/ThemeContext.jsx';
import { AnalyticsProvider } from './shared/analytics/index.js';

export default function App() {
  return (
    <BrowserRouter>
      <AnalyticsProvider>
        <ToastProvider>
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
        </ToastProvider>
      </AnalyticsProvider>
    </BrowserRouter>
  );
}


