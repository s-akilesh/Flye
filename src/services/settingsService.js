import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

export const settingsService = {
  /**
   * Fetches the singleton settings row from the database.
   * @returns {Promise<Object>} The settings row.
   */
  async getSettings() {
    try {
      logger.log('[settingsService] Fetching settings from Supabase...');
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error) {
        logger.error('[settingsService] Fetch Error:', error);
        throw error;
      }
      
      logger.log('[settingsService] Fetch Response:', data);
      return data;
    } catch (err) {
      logger.error('Failed to fetch settings from Supabase:', err);
      throw err;
    }
  },

  /**
   * Updates the existing singleton settings row. Throws an error if the row is missing.
   * @param {Object} settingsData - The snake_case settings columns to update.
   * @returns {Promise<Object>} The updated row.
   */
  async updateSettings(settingsData) {
    logger.log('[settingsService] Update Request Payload:', settingsData);
    try {
      // Fetch the singleton row to get its ID
      const { data: existing, error: fetchError } = await supabase
        .from('settings')
        .select('id')
        .single();

      logger.log('[Settings] Existing Settings Row:', existing);

      if (fetchError || !existing) {
        logger.error('[settingsService] Fetching ID for update failed or row is missing:', fetchError);
        throw new Error('Platform settings record is missing in the database. Please ensure the initial settings row exists.');
      }

      const rowId = existing.id;
      logger.log(`[settingsService] Updating existing row with ID: ${rowId}`);

      const { data, error } = await supabase
        .from('settings')
        .update({
          ...settingsData,
          updated_at: new Date().toISOString()
        })
        .eq('id', rowId)
        .select()
        .single();
      
      if (error) {
        logger.error('[settingsService] Supabase Update Error:', error);
        throw error;
      }

      logger.log('[settingsService] Update Success Response:', data);
      return data;
    } catch (err) {
      logger.error('[settingsService] Exception in updateSettings:', err);
      throw err;
    }
  }
};
