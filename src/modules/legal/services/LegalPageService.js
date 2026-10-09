import { supabase } from '../../../shared/services/supabaseClient.js';
import { DEFAULT_LEGAL_CONFIGS } from '../constants/defaultLegalContent.js';

const LOCAL_STORAGE_PREFIX = 'flyen_legal_page_';

export const LegalPageService = {
  /**
   * Retrieves a legal page configuration by its key (admin mode, reads DB, master_data, or local cache).
   * @param {string} pageKey - The unique key identifier (e.g., 'privacy_policy').
   */
  getPage: async (pageKey) => {
    if (!pageKey) throw new Error('Missing pageKey identifier');

    // 1. Try legal_pages table
    try {
      const { data, error } = await supabase
        .from('legal_pages')
        .select('*')
        .eq('page_key', pageKey)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn(`[LegalPageService] legal_pages query bypass for ${pageKey}:`, err?.message || err);
    }

    // 2. Try master_data table (fallback store)
    try {
      const { data: masterRow, error: masterErr } = await supabase
        .from('master_data')
        .select('*')
        .eq('type', 'legal_page')
        .eq('key', pageKey)
        .maybeSingle();

      if (!masterErr && masterRow) {
        const meta = masterRow.metadata || {};
        return {
          id: masterRow.id,
          page_key: pageKey,
          title: meta.title || masterRow.value || DEFAULT_LEGAL_CONFIGS[pageKey]?.title || pageKey,
          content: meta.content !== undefined ? meta.content : (DEFAULT_LEGAL_CONFIGS[pageKey]?.content || ''),
          version: meta.version || '1.0.0',
          published: masterRow.is_active ?? meta.published ?? true,
          updated_at: masterRow.updated_at
        };
      }
    } catch (err) {
      console.warn(`[LegalPageService] master_data query notice for ${pageKey}:`, err?.message || err);
    }

    // 3. Try LocalStorage cached version
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${pageKey}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn(`[LegalPageService] localStorage read notice:`, err);
    }

    // 4. Default fallback
    return DEFAULT_LEGAL_CONFIGS[pageKey] || null;
  },

  /**
   * Updates or inserts title, content, version, and updated timestamp for a page key using multi-tier fallback.
   * @param {string} pageKey - The unique key identifier.
   * @param {Object} updates - Fields to update.
   */
  updatePage: async (pageKey, updates) => {
    if (!pageKey) throw new Error('Missing pageKey identifier');

    const resultData = {
      id: updates.id || `legal-${pageKey}`,
      page_key: pageKey,
      title: updates.title,
      content: updates.content,
      version: updates.version || '1.0.0',
      published: updates.published ?? true,
      updated_at: new Date().toISOString(),
      updated_by: updates.updatedBy || null
    };

    let savedSuccessfully = false;

    // 1. Try saving to legal_pages table
    try {
      const { data, error } = await supabase
        .from('legal_pages')
        .upsert(resultData, { onConflict: 'page_key' })
        .select()
        .single();

      if (!error && data) {
        savedSuccessfully = true;
        Object.assign(resultData, data);
      } else if (error) {
        console.warn('[LegalPageService] legal_pages upsert notice, trying master_data store:', error.message);
      }
    } catch (err) {
      console.warn('[LegalPageService] legal_pages exception, trying master_data store:', err?.message || err);
    }

    // 2. If legal_pages failed (e.g. table not in schema cache), save to master_data table
    if (!savedSuccessfully) {
      try {
        const masterPayload = {
          type: 'legal_page',
          key: pageKey,
          value: updates.title || pageKey,
          description: (updates.content || '').substring(0, 200),
          is_active: updates.published ?? true,
          metadata: {
            id: resultData.id,
            page_key: pageKey,
            title: updates.title,
            content: updates.content,
            version: updates.version || '1.0.0',
            published: updates.published ?? true,
            updated_at: resultData.updated_at
          },
          updated_at: resultData.updated_at
        };

        const { data: masterData, error: masterError } = await supabase
          .from('master_data')
          .upsert(masterPayload, { onConflict: 'type,key' })
          .select()
          .single();

        if (!masterError && masterData) {
          savedSuccessfully = true;
        } else if (masterError) {
          console.warn('[LegalPageService] master_data upsert notice:', masterError.message);
        }
      } catch (err) {
        console.warn('[LegalPageService] master_data exception:', err?.message || err);
      }
    }

    // 3. Always update local storage so changes immediately reflect live
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${pageKey}`, JSON.stringify(resultData));
        savedSuccessfully = true;
      }
    } catch (err) {
      console.warn('[LegalPageService] localStorage write notice:', err);
    }

    return resultData;
  },

  /**
   * Toggles the publishing status of a legal page.
   * @param {string} pageKey - The unique key identifier.
   * @param {boolean} publishedStatus - True to publish, false to unpublish.
   */
  publishPage: async (pageKey, publishedStatus) => {
    return LegalPageService.updatePage(pageKey, { published: publishedStatus });
  },

  /**
   * Public-facing getter to fetch active published page configurations, with multi-tier fallback.
   * @param {string} pageKey - The unique key identifier.
   */
  getPublishedPage: async (pageKey) => {
    if (!pageKey) throw new Error('Missing pageKey identifier');

    // 1. Try legal_pages table
    try {
      const { data, error } = await supabase
        .from('legal_pages')
        .select('*')
        .eq('page_key', pageKey)
        .eq('published', true)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn(`[LegalPageService] Published legal_pages query notice for ${pageKey}:`, err?.message || err);
    }

    // 2. Try master_data table
    try {
      const { data: masterRow, error: masterErr } = await supabase
        .from('master_data')
        .select('*')
        .eq('type', 'legal_page')
        .eq('key', pageKey)
        .eq('is_active', true)
        .maybeSingle();

      if (!masterErr && masterRow) {
        const meta = masterRow.metadata || {};
        return {
          id: masterRow.id,
          page_key: pageKey,
          title: meta.title || masterRow.value || DEFAULT_LEGAL_CONFIGS[pageKey]?.title || pageKey,
          content: meta.content !== undefined ? meta.content : (DEFAULT_LEGAL_CONFIGS[pageKey]?.content || ''),
          version: meta.version || '1.0.0',
          published: true,
          updated_at: masterRow.updated_at
        };
      }
    } catch (err) {
      console.warn(`[LegalPageService] Published master_data query notice for ${pageKey}:`, err?.message || err);
    }

    // 3. Try LocalStorage
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${pageKey}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object' && parsed.published !== false) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn(`[LegalPageService] Published localStorage query notice:`, err);
    }

    // 4. Default configuration fallback
    return DEFAULT_LEGAL_CONFIGS[pageKey] || null;
  }
};
