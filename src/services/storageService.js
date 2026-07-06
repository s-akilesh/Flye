import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

/**
 * Helper to clean and generate a unique file name.
 * Replaces non-alphanumeric characters with hyphens, appends a timestamp, and preserves extension.
 */
const generateUniqueName = (originalName) => {
  const lastDot = originalName.lastIndexOf('.');
  const ext = lastDot !== -1 ? originalName.substring(lastDot).toLowerCase() : '';
  const base = lastDot !== -1 ? originalName.substring(0, lastDot) : originalName;
  
  const cleanBase = base
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `${cleanBase}-${Date.now()}${ext}`;
};

export const storageService = {
  /**
   * Safe file validation based on category.
   * @param {File} file - The file object to validate.
   * @param {'image'|'document'|'video'} type - The category of the file.
   */
  validateFile(file, type) {
    if (!file) throw new Error('No file provided for validation.');

    const fileExt = file.name.split('.').pop().toLowerCase();
    
    if (type === 'image') {
      const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (!allowedExts.includes(fileExt)) {
        throw new Error(`Invalid image type. Allowed: ${allowedExts.join(', ')}`);
      }
      if (file.size > maxSize) {
        throw new Error('Image size exceeds the 10MB limit.');
      }
    } else if (type === 'document') {
      const allowedExts = ['pdf', 'zip', 'docx', 'xlsx'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (!allowedExts.includes(fileExt)) {
        throw new Error(`Invalid document type. Allowed: ${allowedExts.join(', ')}`);
      }
      if (file.size > maxSize) {
        throw new Error('Document size exceeds the 50MB limit.');
      }
    } else if (type === 'video') {
      const allowedExts = ['mp4', 'mov'];
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (!allowedExts.includes(fileExt)) {
        throw new Error(`Invalid video type. Allowed: ${allowedExts.join(', ')}`);
      }
      if (file.size > maxSize) {
        throw new Error('Video size exceeds the 500MB limit.');
      }
    }
  },

  /**
   * Generic file upload function.
   * @param {string} bucket - Storage bucket name.
   * @param {string} folder - Folder path inside the bucket (e.g. 'logos', 'profiles/admin').
   * @param {File} file - File object.
   * @param {string} [fileName] - Optional custom file name.
   */
  async uploadFile(bucket, folder, file, fileName) {
    try {
      const cleanFolder = folder.replace(/\/$/, ''); // Remove trailing slash
      const targetName = fileName ? fileName : generateUniqueName(file.name);
      const filePath = `${cleanFolder}/${targetName}`;

      logger.log(`[storageService] Uploading to bucket "${bucket}" at path "${filePath}"...`);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Determine public URL if it is a public bucket
      let publicUrl = '';
      const publicBuckets = ['logos', 'favicons', 'profiles', 'project-images', 'learning-images', 'website-assets', 'component-assets'];
      if (publicBuckets.includes(bucket)) {
        publicUrl = this.getPublicUrl(bucket, filePath);
      }

      return {
        path: data.path,
        publicUrl,
        metadata: {
          size: file.size,
          type: file.type,
          name: targetName
        }
      };
    } catch (err) {
      logger.error(`[storageService] Upload failed in bucket "${bucket}":`, err);
      throw err;
    }
  },

  /**
   * Upload an image with validation.
   * @param {string} bucket - Storage bucket name.
   * @param {string} folder - Folder path.
   * @param {File} file - Image file object.
   * @param {string} [fileName] - Optional custom file name.
   */
  async uploadImage(bucket, folder, file, fileName) {
    this.validateFile(file, 'image');
    return this.uploadFile(bucket, folder, file, fileName);
  },

  /**
   * Replaces an existing file by uploading the new one and deleting the old one.
   * @param {string} bucket - Storage bucket name.
   * @param {string} folder - Folder path.
   * @param {File} file - New file object.
   * @param {string} [oldFilePath] - Path of the old file to delete.
   * @param {string} [fileName] - Optional custom file name.
   */
  async replaceFile(bucket, folder, file, oldFilePath, fileName) {
    try {
      // 1. Upload new file
      const uploadResult = await this.uploadFile(bucket, folder, file, fileName);

      // 2. Delete old file if provided and upload succeeded
      if (oldFilePath) {
        await this.deleteFile(bucket, oldFilePath);
      }

      return uploadResult;
    } catch (err) {
      logger.error('[storageService] Replace file operation failed:', err);
      throw err;
    }
  },

  /**
   * Deletes a file safely from the bucket.
   * @param {string} bucket - Storage bucket name.
   * @param {string} filePath - File path inside the bucket.
   */
  async deleteFile(bucket, filePath) {
    try {
      logger.log(`[storageService] Deleting file "${filePath}" from bucket "${bucket}"...`);
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      logger.error(`[storageService] Safe delete failed for file "${filePath}":`, err);
      // Handled gracefully without blocking caller
      return { success: false, error: err.message };
    }
  },

  /**
   * Gets the public URL for a file in a public bucket.
   * @param {string} bucket - Storage bucket name.
   * @param {string} filePath - File path.
   * @returns {string} Public URL.
   */
  getPublicUrl(bucket, filePath) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data?.publicUrl || '';
  },

  /**
   * Generates a temporary signed URL for private bucket access.
   * @param {string} bucket - Storage bucket name.
   * @param {string} filePath - File path.
   * @param {number} [expiresIn=3600] - Token expiration in seconds.
   * @returns {Promise<string>} Signed download URL.
   */
  async createSignedUrl(bucket, filePath, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn);

      if (error) throw error;
      return data.signedUrl;
    } catch (err) {
      logger.error(`[storageService] Failed to create signed URL for "${filePath}":`, err);
      throw err;
    }
  },

  /**
   * Lists all files inside a directory.
   * @param {string} bucket - Storage bucket name.
   * @param {string} folder - Folder path.
   */
  async listFiles(bucket, folder) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) throw error;
      return data;
    } catch (err) {
      logger.error(`[storageService] Failed to list files in folder "${folder}":`, err);
      throw err;
    }
  }
};
