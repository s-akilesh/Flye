import React, { useEffect } from 'react';
import { supabase } from './lib/supabase';
import { AppRouter } from './router/AppRouter';
import { SettingsProvider } from './context/SettingsContext';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import { AIProvider } from './context/AIContext';
import { UserProvider } from './context/UserContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProjectProvider } from './context/ProjectContext';
import { EnquiryProvider } from './context/EnquiryContext';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <ToastProvider>
      <SettingsProvider>
        <UserProvider>
          <ProjectProvider>
            <EnquiryProvider>
              <CartProvider>
                <CompareProvider>
                  <AIProvider>
                    <WishlistProvider>
                      <AppRouter />
                    </WishlistProvider>
                  </AIProvider>
                </CompareProvider>
              </CartProvider>
            </EnquiryProvider>
          </ProjectProvider>
        </UserProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}

