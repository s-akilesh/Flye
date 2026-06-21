import React from 'react';
import { AppRouter } from './router/AppRouter';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import { AIProvider } from './context/AIContext';
import { UserProvider } from './context/UserContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProjectProvider } from './context/ProjectContext';
import { EnquiryProvider } from './context/EnquiryContext';

export default function App() {
  return (
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
  );
}
