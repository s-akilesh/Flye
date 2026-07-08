import { supabase } from '../../../shared/services/supabaseClient.js';

export const LegalPageService = {
  /**
   * Retrieves a legal page configuration by its key (admin mode, reads both published and draft).
   * @param {string} pageKey - The unique key identifier (e.g., 'privacy_policy').
   */
  getPage: async (pageKey) => {
    if (!pageKey) throw new Error('Missing pageKey identifier');

    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .eq('page_key', pageKey)
      .maybeSingle();

    if (error) {
      console.error(`[LegalPageService] Error fetching page ${pageKey}:`, error);
      throw error;
    }
    return data;
  },

  /**
   * Updates title, content, version, and updated timestamp for a page key.
   * @param {string} pageKey - The unique key identifier.
   * @param {Object} updates - Fields to update.
   */
  updatePage: async (pageKey, updates) => {
    if (!pageKey) throw new Error('Missing pageKey identifier');

    const dbPayload = {
      title: updates.title,
      content: updates.content,
      version: updates.version || '1.0.0',
      published: updates.published ?? false,
      updated_at: new Date().toISOString(),
      updated_by: updates.updatedBy || null
    };

    // Clean undefined keys
    Object.keys(dbPayload).forEach(key => {
      if (dbPayload[key] === undefined) {
        delete dbPayload[key];
      }
    });

    const { data, error } = await supabase
      .from('legal_pages')
      .update(dbPayload)
      .eq('page_key', pageKey)
      .select()
      .single();

    if (error) {
      console.error(`[LegalPageService] Error updating page ${pageKey}:`, error);
      throw error;
    }
    return data;
  },

  /**
   * Toggles the publishing status of a legal page.
   * @param {string} pageKey - The unique key identifier.
   * @param {boolean} publishedStatus - True to publish, false to unpublish.
   */
  publishPage: async (pageKey, publishedStatus) => {
    if (!pageKey) throw new Error('Missing pageKey identifier');

    const { data, error } = await supabase
      .from('legal_pages')
      .update({
        published: publishedStatus,
        updated_at: new Date().toISOString()
      })
      .eq('page_key', pageKey)
      .select()
      .single();

    if (error) {
      console.error(`[LegalPageService] Error changing publish status on ${pageKey}:`, error);
      throw error;
    }
    return data;
  },

  /**
   * Public-facing getter to fetch only active published page configurations.
   * @param {string} pageKey - The unique key identifier.
   */
  getPublishedPage: async (pageKey) => {
    if (!pageKey) throw new Error('Missing pageKey identifier');

    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .eq('page_key', pageKey)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      console.error(`[LegalPageService] Error fetching published page ${pageKey}:`, error);
      throw error;
    }
    return data;
  }
};
