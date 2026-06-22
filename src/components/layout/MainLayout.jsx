import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { GlowBackground } from './GlowBackground';
import { ROUTES } from '../../constants/routes';

export const MainLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === ROUTES.HOME;

  return (
    <>
      <GlowBackground />
      <Header />
      
      {children}
    </>
  );
};
