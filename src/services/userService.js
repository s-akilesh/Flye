import { supabase } from '../lib/supabase';
import { storageService } from './storageService';
import { logger } from '../utils/logger';

/**
 * Validates an email address format.
 */
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates a phone number format (basic check for digits, spaces, and common symbols).
 */
const isValidPhone = (phone) => {
  if (!phone) return true; // Optional field
  const re = /^\+?[0-9\s\-()]{7,20}$/;
  return re.test(phone);
};

export const userService = {
  /**
   * Fetches the profile of the currently authenticated user.
   * @returns {Promise<Object|null>} The profile object, or null if not found.
   */
  async getCurrentUserProfile() {
    try {
      logger.log('[userService] Fetching current user session...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        logger.log('[userService] No authenticated user session found.');
        return null;
      }

      logger.log(`[userService] Authenticated user ID: ${user.id}. Fetching profile...`);
      return await this.getProfileById(user.id);
    } catch (err) {
      logger.error('[userService] Exception in getCurrentUserProfile:', err);
      throw err;
    }
  },

  /**
   * Fetches a profile by its UUID.
   * @param {string} userId - The UUID of the user.
   * @returns {Promise<Object|null>} The profile object, or null if not found.
   */
  async getProfileById(userId) {
    if (!userId) throw new Error('User ID is required to fetch profile.');
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.log(`[userService] Profile not found for ID: ${userId}`);
          return null;
        }
        throw error;
      }

      return data;
    } catch (err) {
      logger.error(`[userService] Failed to fetch profile for ID ${userId}:`, err);
      throw err;
    }
  },

  /**
   * Creates a new profile record. Call immediately after registration.
   * @param {Object} profileData - The profile fields (id, email, full_name, etc.).
   */
  async createProfile(profileData) {
    const { id, email, role, status } = profileData;

    if (!id) throw new Error('Profile creation requires a valid User ID.');
    if (!email) throw new Error('Profile creation requires an email address.');
    if (!isValidEmail(email)) throw new Error('Invalid email address format.');
    if (profileData.phone && !isValidPhone(profileData.phone)) {
      throw new Error('Invalid phone number format.');
    }

    try {
      logger.log(`[userService] Creating profile in database for ID: ${id}...`);
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id,
          email: email.toLowerCase().trim(),
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          institution: profileData.institution || '',
          department: profileData.department || '',
          year_of_study: profileData.year_of_study || '',
          profile_photo: profileData.profile_photo || '',
          role: role || 'student',
          status: status || 'active',
          email_verified: profileData.email_verified || false
        })
        .select()
        .single();

      if (error) throw error;
      logger.log('[userService] Profile created successfully:', data);
      return data;
    } catch (err) {
      logger.error('[userService] Failed to create profile:', err);
      throw err;
    }
  },

  /**
   * Updates an existing user's profile details.
   * @param {Object} profileData - The fields to update (full_name, phone, institution, etc.).
   */
  async updateProfile(profileData) {
    const { id } = profileData;
    if (!id) throw new Error('Profile update requires a valid User ID.');

    if (profileData.phone && !isValidPhone(profileData.phone)) {
      throw new Error('Invalid phone number format.');
    }

    try {
      logger.log(`[userService] Updating profile details for ID: ${id}...`);
      const updatePayload = {
        full_name: profileData.full_name,
        phone: profileData.phone,
        institution: profileData.institution,
        department: profileData.department,
        year_of_study: profileData.year_of_study,
        profile_photo: profileData.profile_photo,
        updated_at: new Date().toISOString()
      };

      // Clean undefined keys
      Object.keys(updatePayload).forEach(key => {
        if (updatePayload[key] === undefined) {
          delete updatePayload[key];
        }
      });

      const { data, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      logger.log('[userService] Profile updated successfully:', data);
      return data;
    } catch (err) {
      logger.error(`[userService] Failed to update profile for ID ${id}:`, err);
      throw err;
    }
  },

  /**
   * Updates the last_login timestamp for a user. Call immediately after successful login.
   * @param {string} userId - The UUID of the user.
   */
  async updateLastLogin(userId) {
    if (!userId) throw new Error('User ID is required to update last login.');
    try {
      logger.log(`[userService] Updating last_login for ID: ${userId}`);
      const { data, error } = await supabase
        .from('profiles')
        .update({
          last_login: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      logger.error(`[userService] Failed to update last login for ID ${userId}:`, err);
      throw err;
    }
  },

  /**
   * Uploads a profile photo to storage and returns its relative storage path.
   * @param {File} file - The photo file object.
   * @param {string} [oldFilePath] - Path of the old photo to delete.
   * @returns {Promise<string>} The uploaded file's storage path.
   */
  async uploadProfilePhoto(file, oldFilePath = null) {
    try {
      logger.log('[userService] Initiating profile photo upload...');
      storageService.validateFile(file, 'image');

      const fileExt = file.name.split('.').pop().toLowerCase();
      const targetName = `profile-photo-${Date.now()}.${fileExt}`;

      // Upload and replace old file if it exists
      const result = await storageService.replaceFile('profiles', 'users', file, oldFilePath, targetName);
      
      logger.log('[userService] Profile photo uploaded successfully. Path:', result.path);
      return result.path;
    } catch (err) {
      logger.error('[userService] Profile photo upload failed:', err);
      throw err;
    }
  },

  /**
   * Deletes a user's profile photo from storage.
   * @param {string} filePath - The storage path of the file.
   */
  async deleteProfilePhoto(filePath) {
    if (!filePath) return;
    try {
      logger.log(`[userService] Deleting profile photo: ${filePath}`);
      const result = await storageService.deleteFile('profiles', filePath);
      return result;
    } catch (err) {
      logger.error(`[userService] Failed to delete profile photo at ${filePath}:`, err);
      throw err;
    }
  }
};
