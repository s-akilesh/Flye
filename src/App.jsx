import React from 'react';
import { AppRouter } from './router/AppRouter';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import { AIProvider } from './context/AIContext';
import { UserProvider } from './context/UserContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProjectProvider } from './context/ProjectContext';

export default function App() {
  return (
    <UserProvider>
      <ProjectProvider>
        <CartProvider>
          <CompareProvider>
            <AIProvider>
              <WishlistProvider>
                <AppRouter />
              </WishlistProvider>
            </AIProvider>
          </CompareProvider>
        </CartProvider>
      </ProjectProvider>
    </UserProvider>
  );
}
