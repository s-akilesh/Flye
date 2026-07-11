import { supabase } from './supabaseClient';
import { storageService } from './storageService';
import { logger } from '../utils/logger';

export const avatarService = {
  /**
   * Validates image type and size.
   */
  validateFile(file) {
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!allowedExts.includes(fileExt)) {
      throw new Error(`Invalid profile photo type. Allowed: ${allowedExts.join(', ')}`);
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Profile photo size exceeds 5MB limit.');
    }
    return fileExt;
  },

  /**
   * Generates public storage target path name.
   */
  generateStoragePath(userId, fileExt, isAdmin = false) {
    return `profile-photo-${Date.now()}.${fileExt}`;
  },

  /**
   * Uploads or replaces profile picture in Supabase.
   */
  async uploadAvatar(userId, file, isAdmin = false, oldUrl = null) {
    try {
      const fileExt = this.validateFile(file);
      const folder = isAdmin ? 'admin' : userId;
      const targetName = this.generateStoragePath(userId, fileExt, isAdmin);

      let oldPath = null;
      if (oldUrl) {
        const marker = `/storage/v1/object/public/profiles/`;
        const idx = oldUrl.indexOf(marker);
        if (idx !== -1) {
          oldPath = oldUrl.substring(idx + marker.length);
        }
      }

      const result = await storageService.replaceFile('profiles', folder, file, oldPath, targetName);
      return result.publicUrl;
    } catch (err) {
      logger.error('[avatarService] Failed to upload avatar:', err);
      throw err;
    }
  }
};
