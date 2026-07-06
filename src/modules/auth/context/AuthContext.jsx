import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { logger } from '../../../shared/utils/logger';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewModeState] = useState(() => {
    return localStorage.getItem('flyen_view_mode') || 'user';
  });

  const setViewMode = (mode) => {
    localStorage.setItem('flyen_view_mode', mode);
    setViewModeState(mode);
  };

  /**
   * Helper to load profile data based on the authenticated user.
   */
  const loadProfile = async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }
    try {
      logger.log(`[AuthContext] Fetching profile for user ID: ${currentUser.id}`);
      const userProfile = await userService.getProfileById(currentUser.id);
      setProfile(userProfile);
      
      // Security Guard: If the user is not an admin, force viewMode to 'user'
      const userIsAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin';
      if (!userIsAdmin) {
        localStorage.setItem('flyen_view_mode', 'user');
        setViewModeState('user');
      }
    } catch (err) {
      logger.error('[AuthContext] Failed to load user profile:', err);
      setProfile(null);
    }
  };

  /**
   * Public method to manually trigger profile re-fetch.
   */
  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  useEffect(() => {
    // 1. Get initial session on mount
    const initializeAuth = async () => {
      try {
        logger.log('[AuthContext] Initializing auth session...');
        const activeSession = await authService.getCurrentSession();
        setSession(activeSession);
        const currentUser = activeSession?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await loadProfile(currentUser);
        }
      } catch (err) {
        logger.error('[AuthContext] Error during auth initialization:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen to auth state transitions
    const subscription = authService.onAuthStateChange(async (event, activeSession) => {
      logger.log(`[AuthContext] Auth state changed: ${event}`);
      setSession(activeSession);
      const currentUser = activeSession?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await loadProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      logger.log('[AuthContext] Unsubscribing from auth state listener.');
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Authenticates user and loads their profile.
   */
  const login = async (email, password) => {
    try {
      const data = await authService.signIn(email, password);
      setSession(data.session);
      setUser(data.user);
      if (data.user) {
        await loadProfile(data.user);
      }
      return data;
    } catch (err) {
      logger.error('[AuthContext] Login failed:', err);
      throw err;
    }
  };

  /**
   * Logs out the user and clears all active session states.
   */
  const logout = async () => {
    try {
      await authService.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (err) {
      logger.error('[AuthContext] Logout failed:', err);
      throw err;
    }
  };

  // Derived helper booleans
  const isAuthenticated = !!user;
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  const isUser = profile?.role === 'user';

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        profile,
        session,
        loading, 
        login, 
        logout, 
        refreshProfile,
        viewMode, 
        setViewMode,
        isAuthenticated,
        isAdmin,
        isUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
