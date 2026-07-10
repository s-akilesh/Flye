import { supabase } from '../services/supabaseClient.js';

let cache = {};

/**
 * Helper to normalize string values: trim and collapse multiple spaces.
 * @param {string} val
 * @returns {string}
 */
export const normalizeValue = (val) => {
  if (!val) return '';
  return val.trim().replace(/\s+/g, ' ');
};

/**
 * Helper to generate a stable, lowercase, alphanumeric slug key.
 * @param {string} value
 * @returns {string}
 */
export const generateKey = (value) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const REFERENCE_MAPPING = {
  'project_category': { table: 'projects', column: 'category' },
  'technology': { table: 'projects', column: 'technology' },
  'department': { table: 'projects', column: 'department' }
};

export const masterDataService = {
  normalizeValue,
  generateKey,

  /**
   * Fetch active master data records of a specific type.
   * Caches results in-memory.
   * @param {string} type
   * @returns {Promise<Array>}
   */
  async getValues(type) {
    if (cache[type]) {
      return cache[type];
    }

    const { data, error } = await supabase
      .from('master_data')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('value', { ascending: true });

    if (error) {
      console.error(`[masterDataService] Failed to load active values for type ${type}:`, error);
      throw error;
    }

    cache[type] = data || [];
    return cache[type];
  },

  /**
   * Asserts that a type/value pair exists in master_data.
   * Reactivates if matching row is inactive.
   * @param {string} type
   * @param {string} value
   */
  async ensureValueExists(type, value) {
    if (!value) return;
    const cleanValue = normalizeValue(value);
    const cleanKey = generateKey(cleanValue);

    // 1. Search by (type, key)
    const { data, error } = await supabase
      .from('master_data')
      .select('*')
      .eq('type', type)
      .eq('key', cleanKey);

    if (error) {
      console.error(`[masterDataService] Error checking value for type ${type}, key ${cleanKey}:`, error);
      throw error;
    }

    if (data && data.length > 0) {
      const existing = data[0];
      // 2. Reactivate if inactive
      if (!existing.is_active) {
        const { error: updateError } = await supabase
          .from('master_data')
          .update({ is_active: true, value: cleanValue, updated_at: new Date().toISOString() })
          .eq('id', existing.id);

        if (updateError) {
          console.error(`[masterDataService] Error reactivating value ${cleanValue}:`, updateError);
          throw updateError;
        }
      }
    } else {
      // 3. Insert new active value
      const { error: insertError } = await supabase
        .from('master_data')
        .insert({
          type,
          key: cleanKey,
          value: cleanValue,
          is_active: true
        });

      if (insertError) {
        console.error(`[masterDataService] Error inserting new value ${cleanValue}:`, insertError);
        throw insertError;
      }
    }

    // Clear cache
    delete cache[type];
  },

  /**
   * Soft-deactivates (is_active = false) a master data value if it is no longer
   * referenced in referencing tables configured in REFERENCE_MAPPING.
   * @param {string} type
   * @param {string} value
   */
  async syncUsageStatus(type, value) {
    if (!value) return;
    const cleanValue = normalizeValue(value);
    const cleanKey = generateKey(cleanValue);

    const ref = REFERENCE_MAPPING[type];
    if (!ref) return;

    // Fetch all records for the referencing table to check usage accurately
    const { data, error } = await supabase
      .from(ref.table)
      .select(`id, ${ref.column}`);

    if (error) {
      console.error(`[masterDataService] Error checking references in ${ref.table}:`, error);
      throw error;
    }

    // Evaluate references using split mapping for comma-separated legacy support
    const isStillUsed = (data || []).some(row => {
      const val = row[ref.column];
      if (!val) return false;
      return val.split(',').map(item => generateKey(item)).includes(cleanKey);
    });

    if (!isStillUsed) {
      // Soft delete: is_active = false
      const { error: updateError } = await supabase
        .from('master_data')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('type', type)
        .eq('key', cleanKey);

      if (updateError) {
        console.error(`[masterDataService] Error soft-deactivating value ${cleanValue}:`, updateError);
        throw updateError;
      }
    }

    // Clear cache
    delete cache[type];
  },

  /**
   * Physically deletes a record by ID.
   * @param {string} id
   */
  async deleteValue(id) {
    const { data } = await supabase
      .from('master_data')
      .select('type')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('master_data')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (data?.type) {
      delete cache[data.type];
    }
  },

  /**
   * Invalidate cache for a specific type.
   * @param {string} type
   */
  refresh(type) {
    delete cache[type];
  }
};
