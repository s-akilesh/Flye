import { supabase } from '../../../shared/services/supabaseClient.js';
import { userService } from './userService';
import { logger } from '../../../shared/utils/logger.js';
import { activityLogService } from '../../../services/activityLogService.js';
import { notificationService } from '../../../shared/services/notificationService.js';

// In-memory failed sign-in counter
const failedAttemptsCache = {};

export const authService = {
  /**
   * Registers a new user and automatically creates their profile.
   * @param {string} email - The email address.
   * @param {string} password - The account password.
   * @param {Object} [profileDetails] - Optional initial profile details (full_name, phone, etc.).
   * @returns {Promise<Object>} The authentication signup result.
   */
  async signUp(email, password, profileDetails = {}) {
    if (!email || !password) {
      throw new Error('Email and password are required for registration.');
    }

    try {
      logger.log(`[authService] Initiating signup for: ${email}`);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: profileDetails.full_name || ''
          }
        }
      });

      if (error) throw error;

      logger.log('[authService] Auth account created successfully.');
      return data;
    } catch (err) {
      logger.error('[authService] Signup flow failed:', err);
      throw err;
    }
  },

  /**
   * Authenticates a user with email and password and updates their last login timestamp.
   * @param {string} email - The email address.
   * @param {string} password - The password.
   * @returns {Promise<Object>} The authenticated session details.
   */
  async signIn(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required for login.');
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      logger.log(`[authService] Attempting login for: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) throw error;

      const user = data?.user;
      if (user) {
        logger.log(`[authService] Login successful. Updating last login for ID: ${user.id}`);
        
        // Reset failed login counter on success
        failedAttemptsCache[cleanEmail] = 0;

        // Asynchronously update last login without blocking return
        userService.updateLastLogin(user.id).catch(err => {
          logger.error('[authService] Failed to update last login timestamp:', err);
        });

        // Log successful login activity
        activityLogService.auth.login(email.trim(), true);
      }

      return data;
    } catch (err) {
      logger.error('[authService] Login failed:', err);
      
      // Increment failed login count
      failedAttemptsCache[cleanEmail] = (failedAttemptsCache[cleanEmail] || 0) + 1;
      if (failedAttemptsCache[cleanEmail] >= 3) {
        // Trigger high priority alert
        notificationService.security.failedLogin(cleanEmail).catch(nErr => {
          console.error('[authService] Failed to trigger security notification:', nErr);
        });
        // Reset so we don't spam on every failure
        failedAttemptsCache[cleanEmail] = 0;
      }

      // Log failed login activity
      activityLogService.auth.login(email.trim(), false, err.message);
      throw err;
    }
  },

  /**
   * Logs out the current user, clearing the active session.
   */
  async signOut() {
    try {
      logger.log('[authService] Logging out current session...');
      
      let email = 'Unknown';
      try {
        const user = await this.getCurrentUser();
        if (user?.email) email = user.email;
      } catch (e) {
        // ignore
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Log logout activity
      activityLogService.auth.logout(email);

      return { success: true };
    } catch (err) {
      logger.error('[authService] Logout failed:', err);
      throw err;
    }
  },

  /**
   * Returns the current active Supabase session.
   * @returns {Promise<Object|null>} The active session or null.
   */
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (err) {
      logger.error('[authService] Failed to get current session:', err);
      throw err;
    }
  },

  /**
   * Returns the currently authenticated user.
   * @returns {Promise<Object|null>} The authenticated user object or null.
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (err) {
      logger.error('[authService] Failed to get current user:', err);
      throw err;
    }
  },

  /**
   * Sends a password reset email.
   * @param {string} email - The user's email address.
   * @param {string} [redirectTo] - Optional redirect URL after resetting password.
   */
  async resetPassword(email, redirectTo) {
    if (!email) throw new Error('Email address is required to reset password.');
    try {
      logger.log(`[authService] Sending password reset email to: ${email}`);
      const options = redirectTo ? { redirectTo } : undefined;
      const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), options);
      if (error) throw error;
      return data;
    } catch (err) {
      logger.error('[authService] Password reset request failed:', err);
      throw err;
    }
  },

  /**
   * Allows an authenticated user to update their password.
   * @param {string} newPassword - The new password.
   */
  async updatePassword(newPassword) {
    if (!newPassword) throw new Error('New password is required.');
    try {
      logger.log('[authService] Updating user password...');
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return data;
    } catch (err) {
      logger.error('[authService] Password update failed:', err);
      throw err;
    }
  },

  /**
   * Resends the signup confirmation/verification email.
   * @param {string} email - The user's email address.
   */
  async resendVerificationEmail(email) {
    if (!email) throw new Error('Email address is required to resend verification.');
    try {
      logger.log(`[authService] Resending verification email to: ${email}`);
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim()
      });
      if (error) throw error;
      return data;
    } catch (err) {
      logger.error('[authService] Resending verification email failed:', err);
      throw err;
    }
  },

  /**
   * Refreshes the active authentication session.
   */
  async refreshSession() {
    try {
      logger.log('[authService] Refreshing authentication session...');
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return data;
    } catch (err) {
      logger.error('[authService] Session refresh failed:', err);
      throw err;
    }
  },

  /**
   * Subscribes to auth state changes (login, logout, token refresh).
   * @param {Function} callback - Callback function triggered on state changes.
   * @returns {Object} Subscription object containing the unsubscribe method.
   */
  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  }
};
