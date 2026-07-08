import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { GlowBackground } from './GlowBackground';
import { BottomNavigation } from './BottomNavigation';
import { MobileDrawer } from './MobileDrawer';

export const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Scroll restoration hook & drawer event listeners
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleToggle = () => toggleDrawer();
    const handleClose = () => closeDrawer();
    
    window.addEventListener('toggle-flyen-drawer', handleToggle);
    window.addEventListener('close-flyen-drawer', handleClose);
    
    return () => {
      window.removeEventListener('toggle-flyen-drawer', handleToggle);
      window.removeEventListener('close-flyen-drawer', handleClose);
    };
  }, []);

  const isLearningPage = location.pathname.startsWith('/learning');
  const isAuthPage = location.pathname === '/auth';

  return (
    <>
      <GlowBackground />
      {!isAuthPage && <Header onToggleDrawer={toggleDrawer} />}
      
      <div className="main-viewport-content" style={{ paddingBottom: isLearningPage ? '0' : undefined }}>
        {children}
      </div>

      {!isLearningPage && !isAuthPage && (
        <BottomNavigation onToggleDrawer={toggleDrawer} isDrawerOpen={isDrawerOpen} />
      )}
      <MobileDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
};
