import { supabase } from './supabaseClient.js';
import { activityLogService } from '../../services/activityLogService.js';

// In-memory cache for page settings
const cache = {};

/**
 * Helper to generate default SEO metadata dynamically from route
 * @param {string} route 
 * @returns {object}
 */
const getDefaultSettings = (route) => {
  const segment = route.split('/').filter(Boolean).pop();
  const cleanName = segment
    ? segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    : 'Home';
  const defaultTitle = `${cleanName} | Flyen`;

  return {
    route,
    page_title: defaultTitle.substring(0, 60),
    meta_description: `Learn more about ${cleanName} on Flyen platform. Guides, source codes, circuit diagrams, and parts list.`,
    keywords: `flyen, ${cleanName.toLowerCase()}, arduino, electronics, engineering`,
    canonical_url: `https://flyen.in${route === '/' ? '' : route}`,
    robots_index: true,
    robots_follow: true,
    og_title: defaultTitle,
    og_description: `Learn more about ${cleanName} on Flyen platform. Guides, source codes, circuit diagrams, and parts list.`,
    og_image: '',
    is_enabled: true,
    created_at: null,
    updated_at: null,
    created_by: null,
    updated_by: null,
    entity_type: route.startsWith('/project/') ? 'project' : 'page',
    entity_id: null
  };
};

export const pageSettingsService = {
  /**
   * Retrieves the page settings for a given route.
   * If not present, returns dynamically generated default values.
   * @param {string} route 
   * @returns {Promise<object>}
   */
  async getPageSettings(route) {
    const cleanRoute = route.split('?')[0]; // strip query params
    if (cache[cleanRoute]) {
      return cache[cleanRoute];
    }

    try {
      const { data, error } = await supabase
        .from('page_settings')
        .select('*')
        .eq('route', cleanRoute)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        cache[cleanRoute] = data;
        return data;
      }

      // Return default metadata if not found in db
      return getDefaultSettings(cleanRoute);
    } catch (err) {
      console.error(`[pageSettingsService] Failed to load settings for route: ${cleanRoute}`, err);
      return getDefaultSettings(cleanRoute);
    }
  },

  /**
   * Saves or updates the page settings in the database.
   * @param {string} route 
   * @param {object} payload 
   * @returns {Promise<object>}
   */
  async savePageSettings(route, payload) {
    const cleanRoute = route.split('?')[0];
    
    // Get current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    const updaterName = user?.email || 'Admin';

    // Check if it already exists to determine if we are creating or updating
    const existing = await this.getPageSettings(cleanRoute);
    const isNew = !existing.created_at;

    const dbPayload = {
      route: cleanRoute,
      entity_type: payload.entity_type || existing.entity_type || 'page',
      entity_id: payload.entity_id || existing.entity_id || null,
      is_enabled: payload.is_enabled !== undefined ? payload.is_enabled : true,
      page_title: payload.page_title || '',
      meta_description: payload.meta_description || '',
      keywords: payload.keywords || '',
      canonical_url: payload.canonical_url || '',
      robots_index: payload.robots_index !== undefined ? payload.robots_index : true,
      robots_follow: payload.robots_follow !== undefined ? payload.robots_follow : true,
      og_title: payload.og_title || '',
      og_description: payload.og_description || '',
      og_image: payload.og_image || '',
      updated_by: updaterName,
      updated_at: new Date().toISOString()
    };

    if (isNew) {
      dbPayload.created_by = updaterName;
      dbPayload.created_at = new Date().toISOString();
    }

    try {
      const { data, error } = await supabase
        .from('page_settings')
        .upsert(dbPayload, { onConflict: 'route' })
        .select()
        .single();

      if (error) throw error;

      // Update local memory cache
      cache[cleanRoute] = data;

      // Log activity actions
      try {
        if (isNew) {
          await activityLogService.seo.created(cleanRoute, dbPayload.entity_type, dbPayload.entity_id);
        } else {
          // Check if status changed
          if (existing.is_enabled !== dbPayload.is_enabled) {
            await activityLogService.seo.statusChanged(cleanRoute, dbPayload.is_enabled, dbPayload.entity_type, dbPayload.entity_id);
          }
          // Log general update
          await activityLogService.seo.updated(cleanRoute, {
            page_title: dbPayload.page_title,
            is_enabled: dbPayload.is_enabled
          }, dbPayload.entity_type, dbPayload.entity_id);
        }
      } catch (logErr) {
        console.error("[pageSettingsService] Failed to log activity:", logErr);
      }

      return data;
    } catch (err) {
      console.error(`[pageSettingsService] Failed to save settings for route: ${cleanRoute}`, err);
      throw err;
    }
  }
};
