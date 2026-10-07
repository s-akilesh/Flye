import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { GlowBackground } from './GlowBackground';
import { BottomNavigation } from './BottomNavigation';
import { MobileDrawer } from './MobileDrawer';
import { PageSettingsButton } from './PageSettingsButton';
import { PageSettingsDrawer } from './PageSettingsDrawer';
import { CartDrawer } from '../cart/CartDrawer';
import { GlobalSearchModal } from '../search/GlobalSearchModal';
import { usePageMetadata } from '../../seo/usePageMetadata.js';

export const MainLayout = ({ children }) => {
  usePageMetadata();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  // Scroll restoration hook & drawer / search event listeners
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleToggle = () => toggleDrawer();
    const handleClose = () => closeDrawer();
    const handleOpenSearch = () => openSearch();
    const handleCloseSearch = () => closeSearch();

    const handleGlobalKeyDown = (e) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      // '/' when not in input/textarea
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    
    window.addEventListener('toggle-flyen-drawer', handleToggle);
    window.addEventListener('close-flyen-drawer', handleClose);
    window.addEventListener('open-flyen-search', handleOpenSearch);
    window.addEventListener('close-flyen-search', handleCloseSearch);
    window.addEventListener('keydown', handleGlobalKeyDown);
    
    return () => {
      window.removeEventListener('toggle-flyen-drawer', handleToggle);
      window.removeEventListener('close-flyen-drawer', handleClose);
      window.removeEventListener('open-flyen-search', handleOpenSearch);
      window.removeEventListener('close-flyen-search', handleCloseSearch);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const isLearningPage = location.pathname.startsWith('/learning');
  const isAuthPage = location.pathname === '/auth';

  return (
    <>
      <GlowBackground />
      {!isAuthPage && <Header onToggleDrawer={toggleDrawer} onOpenSearch={openSearch} />}
      
      <div className="main-viewport-content" style={{ paddingBottom: isLearningPage ? '0' : undefined }}>
        {children}
      </div>

      {!isLearningPage && !isAuthPage && (
        <BottomNavigation onToggleDrawer={toggleDrawer} isDrawerOpen={isDrawerOpen} />
      )}
      <MobileDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
      
      <CartDrawer />
      <GlobalSearchModal isOpen={isSearchOpen} onClose={closeSearch} />

      <PageSettingsButton onClick={() => setIsSettingsOpen(true)} />
      <PageSettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};
