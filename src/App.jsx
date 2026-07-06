import React from 'react';
import { AppRouter } from './router/AppRouter';
import { SettingsProvider } from './modules/settings/context/SettingsContext';
import { ProjectProvider } from './modules/projects/context/ProjectContext';
import { EnquiryProvider } from './modules/enquiries/context/EnquiryContext';
import { ToastProvider } from './shared/context/ToastContext';

export default function App() {
  return (
    <ToastProvider>
      <SettingsProvider>
        <ProjectProvider>
          <EnquiryProvider>
            <AppRouter />
          </EnquiryProvider>
        </ProjectProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}


