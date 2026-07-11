import { supabase } from './supabaseClient';
import { logger } from '../utils/logger';

const FALLBACK_KEY = 'flyen_user_prefs_';

export const userPreferenceService = {
  /**
   * Retrieves user preferences from Supabase with localStorage backup.
   * Auto-initializes defaults if not present.
   */
  async getPreferences(userId) {
    if (!userId) return null;
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        // Fallback to LocalStorage if user_preferences table is not deployed
        if (error.message && (error.message.includes('relation') || error.message.includes('does not exist') || error.code === 'PGRST116')) {
          logger.warn('[userPreferenceService] user_preferences table not found. Falling back to LocalStorage.');
          return this.getFallbackPrefs(userId);
        }
        throw error;
      }

      if (!data) {
        // Auto-initialization flow
        logger.log(`[userPreferenceService] Initializing default preferences for user: ${userId}`);
        return await this.savePreferences(userId, {
          notifications: { email: true, security: true, contact: true, browser: false, push: false },
          theme: 'dark',
          language: 'en',
          timezone: 'UTC'
        });
      }

      return data;
    } catch (err) {
      logger.error('[userPreferenceService] Failed to load preferences, using LocalStorage fallback:', err);
      return this.getFallbackPrefs(userId);
    }
  },

  /**
   * Updates user preferences in Supabase with localStorage backup.
   */
  async savePreferences(userId, prefs) {
    if (!userId) return null;
    try {
      const payload = {
        user_id: userId,
        notifications: prefs.notifications,
        theme: prefs.theme || 'dark',
        language: prefs.language || 'en',
        timezone: prefs.timezone || 'UTC',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_preferences')
        .upsert(payload)
        .select()
        .single();

      if (error) {
        if (error.message && (error.message.includes('relation') || error.message.includes('does not exist'))) {
          logger.warn('[userPreferenceService] user_preferences table not found during save. Saving to LocalStorage.');
          this.saveFallbackPrefs(userId, payload);
          return payload;
        }
        throw error;
      }

      return data;
    } catch (err) {
      logger.error('[userPreferenceService] Failed to save preferences, saving to LocalStorage fallback:', err);
      this.saveFallbackPrefs(userId, prefs);
      return { user_id: userId, ...prefs };
    }
  },

  getFallbackPrefs(userId) {
    const saved = localStorage.getItem(`${FALLBACK_KEY}${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      user_id: userId,
      notifications: { email: true, security: true, contact: true, browser: false, push: false },
      theme: 'dark',
      language: 'en',
      timezone: 'UTC'
    };
  },

  saveFallbackPrefs(userId, prefs) {
    localStorage.setItem(`${FALLBACK_KEY}${userId}`, JSON.stringify(prefs));
  }
};
