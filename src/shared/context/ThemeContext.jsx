import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../../modules/auth/context/AuthContext';
import { userPreferenceService } from '../services/userPreferenceService';
import { logger } from '../utils/logger';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setThemeState] = useState('dark');

  // Load theme preference on mount or when user changes
  useEffect(() => {
    const loadTheme = async () => {
      if (user) {
        try {
          const prefs = await userPreferenceService.getPreferences(user.id);
          if (prefs && prefs.theme) {
            logger.log(`[ThemeContext] Loaded theme "${prefs.theme}" for user: ${user.id}`);
            setThemeState(prefs.theme);
            return;
          }
        } catch (err) {
          logger.error('[ThemeContext] Failed to load theme prefs from service:', err);
        }
      }
      // Guest or fallback theme
      const guestTheme = localStorage.getItem('flyen_theme') || 'dark';
      setThemeState(guestTheme);
    };

    loadTheme();
  }, [user]);

  // Apply theme to document HTML attribute
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      logger.log(`[ThemeContext] Applied data-theme="${theme}" to HTML element`);
    }
  }, [theme]);

  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('flyen_theme', newTheme);
    if (user) {
      try {
        const prefs = await userPreferenceService.getPreferences(user.id);
        const updatedPrefs = {
          ...prefs,
          theme: newTheme
        };
        await userPreferenceService.savePreferences(user.id, updatedPrefs);
        logger.log(`[ThemeContext] Saved theme "${newTheme}" preferences to database`);
      } catch (err) {
        logger.error('[ThemeContext] Failed to save theme prefs to service:', err);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
