import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { enquiryService } from '../../enquiries/services/enquiryService';
import { logger } from '../../../shared/utils/logger';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewModeState] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('flyen_view_mode') || 'user';
    }
    return 'user';
  });

  const setViewMode = useCallback((mode) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('flyen_view_mode', mode);
    }
    setViewModeState(mode);
  }, []);

  /**
  const loadingProfileUserIdRef = React.useRef(null);

  /**
   * Helper to load profile data based on the authenticated user.
   */
  const loadProfile = async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }
    if (loadingProfileUserIdRef.current === currentUser.id) {
      return; // Already fetching profile for this user
    }
    loadingProfileUserIdRef.current = currentUser.id;
    try {
      logger.log(`[AuthContext] Fetching profile for user ID: ${currentUser.id}`);
      const userProfile = await userService.getProfileById(currentUser.id);
      setProfile(userProfile);
      
      // Perform guest enquiries linking using user's phone suffix match
      if (userProfile?.phone) {
        try {
          logger.log(`[AuthContext] Triggering dynamic guest enquiries linking for phone: ${userProfile.phone}`);
          await enquiryService.linkGuestEnquiriesToUser(userProfile.phone, currentUser.id);
        } catch (linkErr) {
          logger.error('[AuthContext] Failed to dynamically link guest enquiries:', linkErr);
        }
      }
      
      // Security Guard: If the user is not an admin, force viewMode to 'user'
      const userIsAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin';
      if (!userIsAdmin) {
        localStorage.setItem('flyen_view_mode', 'user');
        setViewModeState('user');
      }
    } catch (err) {
      logger.error('[AuthContext] Failed to load user profile:', err);
      setProfile(null);
    } finally {
      loadingProfileUserIdRef.current = null;
    }
  };

  /**
   * Public method to manually trigger profile re-fetch.
   */
  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    // Safety timeout to guarantee loading state is released within 2.5s
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 2500);

    // Listen to auth state transitions - Supabase onAuthStateChange automatically fires INITIAL_SESSION on subscribe
    const subscription = authService.onAuthStateChange(async (event, activeSession) => {
      if (!isMounted) return;
      logger.log(`[AuthContext] Auth state changed: ${event}`);
      setSession(activeSession);
      const currentUser = activeSession?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await loadProfile(currentUser);
      } else {
        setProfile(null);
        setViewModeState('user');
      }
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      logger.log('[AuthContext] Unsubscribing from auth state listener.');
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Authenticates user and loads their profile.
   */
  const login = useCallback(async (email, password) => {
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
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (err) {
      logger.error('[AuthContext] Logout failed:', err);
      throw err;
    }
  }, []);

  // Derived helper booleans
  const isAuthenticated = !!user;
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  const isUser = profile?.role === 'user';

  const contextValue = useMemo(() => ({
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
  }), [user, profile, session, loading, login, logout, refreshProfile, viewMode, setViewMode, isAuthenticated, isAdmin, isUser]);

  return (
    <AuthContext.Provider value={contextValue}>
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
