import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../../modules/auth/context/AuthContext';
import { userPreferenceService } from '../services/userPreferenceService';
import { logger } from '../utils/logger';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, viewMode, isAdmin } = useAuth();
  
  // User view is strictly locked to light theme
  const isUserView = !isAdmin || viewMode !== 'admin';
  const [adminTheme, setAdminTheme] = useState('dark');

  // Load admin theme preference on mount or when user changes
  useEffect(() => {
    const loadTheme = async () => {
      if (user && isAdmin) {
        try {
          const prefs = await userPreferenceService.getPreferences(user.id);
          if (prefs && prefs.theme) {
            logger.log(`[ThemeContext] Loaded admin theme "${prefs.theme}" for user: ${user.id}`);
            setAdminTheme(prefs.theme);
            return;
          }
        } catch (err) {
          logger.error('[ThemeContext] Failed to load theme prefs from service:', err);
        }
      }
      const savedAdminTheme = localStorage.getItem('flyen_admin_theme') || 'dark';
      setAdminTheme(savedAdminTheme);
    };

    loadTheme();
  }, [user, isAdmin]);

  // Current effective theme: strictly 'light' for user view
  const currentTheme = isUserView ? 'light' : adminTheme;

  // Apply theme to document HTML attribute
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', currentTheme);
      logger.log(`[ThemeContext] Applied data-theme="${currentTheme}" to HTML element (isUserView=${isUserView})`);
    }
  }, [currentTheme, isUserView]);

  const setTheme = async (newTheme) => {
    if (isUserView) {
      // User view is permanently locked to light theme
      return;
    }
    setAdminTheme(newTheme);
    localStorage.setItem('flyen_admin_theme', newTheme);
    if (user && isAdmin) {
      try {
        const prefs = await userPreferenceService.getPreferences(user.id);
        const updatedPrefs = {
          ...prefs,
          theme: newTheme
        };
        await userPreferenceService.savePreferences(user.id, updatedPrefs);
        logger.log(`[ThemeContext] Saved admin theme "${newTheme}" preferences to database`);
      } catch (err) {
        logger.error('[ThemeContext] Failed to save theme prefs to service:', err);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme, isUserView }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
