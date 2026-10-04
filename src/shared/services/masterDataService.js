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
   * Caches results in-memory unless forceRefresh is true.
   * @param {string} type
   * @param {boolean} [forceRefresh=false]
   * @returns {Promise<Array>}
   */
  async getValues(type, forceRefresh = false) {
    if (!forceRefresh && cache[type]) {
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
   * Clears cache for a specific type or all types.
   * @param {string} [type]
   */
  clearCache(type) {
    if (type) {
      delete cache[type];
    } else {
      cache = {};
    }
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
  },

  /**
   * Serializes array of values into sorted, unique comma-separated string
   * @param {Array<string>} values 
   * @returns {string}
   */
  serializeMultiSelect(values) {
    if (!Array.isArray(values)) return '';
    const uniqueSorted = Array.from(new Set(
      values
        .map(v => normalizeValue(v))
        .filter(Boolean)
    )).sort((a, b) => a.localeCompare(b));
    return uniqueSorted.join(', ');
  },

  /**
   * Parses comma-separated string into unique, sorted array of values
   * @param {string|Array<string>} value 
   * @returns {Array<string>}
   */
  parseMultiSelect(value) {
    if (!value) return [];
    if (Array.isArray(value)) {
      return Array.from(new Set(
        value
          .map(v => normalizeValue(v))
          .filter(Boolean)
      )).sort((a, b) => a.localeCompare(b));
    }
    const values = String(value)
      .split(',')
      .map(v => normalizeValue(v))
      .filter(Boolean);
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
  },

  // ==========================================================================
  // CATEGORY MANAGEMENT EXTENSIONS
  // ==========================================================================

  /**
   * Retrieves all categories across 3D printing and electronic projects.
   * @param {'3d_print_category' | 'project_category' | null} typeFilter
   * @returns {Promise<Array>}
   */
  async getCategories(typeFilter = null) {
    try {
      let query = supabase
        .from('master_data')
        .select('*');

      if (typeFilter) {
        query = query.eq('type', typeFilter);
      } else {
        query = query.in('type', ['3d_print_category', 'project_category']);
      }

      const { data, error } = await query
        .order('display_order', { ascending: true })
        .order('value', { ascending: true });

      if (error) {
        console.error('[masterDataService] Failed to load categories:', error);
        throw error;
      }

      const categories = (data || []).map(cat => ({
        ...cat,
        image_url: cat.image_url || this.getDefaultCategoryImage(cat.type, cat.key, cat.value),
        show_in_home: !!cat.show_in_home
      }));

      return categories;
    } catch (err) {
      console.error('[masterDataService] getCategories error:', err);
      throw err;
    }
  },

  /**
   * Returns default visual thumbnail for a category if configured, or empty string.
   */
  getDefaultCategoryImage(type, key = '', value = '') {
    const k = (key || value || '').toLowerCase();
    if (k.includes('robot')) return '/cat_robotics.jpg';
    if (k.includes('iot')) return '/cat_iot.jpg';
    if (k.includes('decor')) return '/cat_decor.jpg';
    if (k.includes('house') || k.includes('home')) return '/cat_household.jpg';
    if (k.includes('part') || k.includes('hardware') || k.includes('enclosure')) return '/cat_parts.jpg';
    if (k.includes('gift') || k.includes('craft')) return '/cat_gifts.jpg';
    return '';
  },

  /**
   * Retrieves single category by ID or key.
   */
  async getCategoryById(idOrKey) {
    let query = supabase
      .from('master_data')
      .select('*');

    // Check if UUID or Key
    if (String(idOrKey).includes('-') && idOrKey.length === 36) {
      query = query.eq('id', idOrKey);
    } else {
      query = query.eq('key', idOrKey);
    }

    const { data, error } = await query.single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('[masterDataService] Failed to load category details:', error);
      throw error;
    }

    return {
      ...data,
      image_url: data.image_url || this.getDefaultCategoryImage(data.type, data.key, data.value),
      show_in_home: !!data.show_in_home
    };
  },

  /**
   * Creates a new category in master_data.
   */
  async createCategory({ type, name, key, imageUrl, showInHome = false, displayOrder = 0, description = '' }) {
    if (!name || !name.trim()) throw new Error('Category name is required.');
    if (!type) throw new Error('Category type is required.');

    const cleanValue = normalizeValue(name);
    const cleanKey = key ? generateKey(key) : generateKey(cleanValue);

    const payload = {
      type,
      key: cleanKey,
      value: cleanValue,
      image_url: imageUrl || this.getDefaultCategoryImage(type, cleanKey, cleanValue),
      show_in_home: !!showInHome,
      display_order: Number(displayOrder) || 0,
      description: description || '',
      is_active: true
    };

    const { data, error } = await supabase
      .from('master_data')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[masterDataService] Failed to create category:', error);
      throw error;
    }

    delete cache[type];
    return data;
  },

  /**
   * Updates an existing category in master_data.
   */
  async updateCategory(id, fields) {
    if (!id) throw new Error('Category ID is required.');

    const updatePayload = {
      ...fields,
      updated_at: new Date().toISOString()
    };

    if (fields.value) {
      updatePayload.value = normalizeValue(fields.value);
    }

    const { data, error } = await supabase
      .from('master_data')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[masterDataService] Failed to update category:', error);
      throw error;
    }

    if (data?.type) {
      delete cache[data.type];
    }
    return data;
  },

  /**
   * Fetches all products associated with a specific category.
   * Works for both 3D printing products and Electronic project kits.
   * @param {string} categoryKey
   * @param {string} categoryValue
   * @param {'3d_print_category' | 'project_category'} categoryType
   * @returns {Promise<Array>}
   */
  async getCategoryProducts(categoryKey, categoryValue = '', categoryType = '3d_print_category') {
    try {
      if (categoryType === '3d_print_category') {
        // Query 3D print products
        const { data, error } = await supabase
          .from('3d_print_products')
          .select('*')
          .or(`category.eq.${categoryKey},category.eq.${categoryValue},category.ilike.%${categoryValue}%`);

        if (error) {
          console.error('[masterDataService] Failed to load 3D products for category:', error);
          throw error;
        }

        const products = data || [];
        if (products.length > 0) {
          const productIds = products.map(p => p.id);
          const { data: images } = await supabase
            .from('3d_print_product_images')
            .select('*')
            .in('product_id', productIds);

          if (images) {
            products.forEach(p => {
              const pImgs = images.filter(img => img.product_id === p.id);
              const primary = pImgs.find(i => i.is_primary) || pImgs[0];
              p.primary_image_url = primary?.image_url || '';
            });
          }
        }

        return products.map(p => ({
          id: p.id,
          title: p.name,
          sku: p.sku,
          price: p.price,
          contactForPrice: !!p.contact_for_price,
          status: p.status,
          visibility: p.visibility,
          stockQuantity: p.stock_quantity,
          image: p.primary_image_url || '',
          type: '3d_print',
          createdAt: p.created_at,
          editUrl: `/admin/printing-inventory/edit/${p.id}`,
          publicUrl: `/printing/product/${p.id}`
        }));
      } else {
        // Query electronic projects
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .or(`category.eq.${categoryKey},category.eq.${categoryValue},category.ilike.%${categoryValue}%`);

        if (error) {
          console.error('[masterDataService] Failed to load electronic projects for category:', error);
          throw error;
        }

        return (data || []).map(p => {
          let img = '';
          if (p.images) {
            if (typeof p.images === 'string') img = p.images;
            else if (Array.isArray(p.images) && p.images.length > 0) img = p.images[0]?.url || p.images[0] || '';
            else if (p.images.main) img = p.images.main;
          }
          return {
            id: p.id,
            title: p.title,
            slug: p.slug,
            price: p.price,
            status: p.status,
            visibility: p.status === 'active' ? 'Published' : 'Draft',
            stockQuantity: p.stock_status === 'instock' ? 'In Stock' : 'Out of Stock',
            image: img,
            type: 'project',
            createdAt: p.created_at,
            editUrl: `/admin/projects/edit/${p.slug}`,
            publicUrl: `/project/${p.slug}`
          };
        });
      }
    } catch (err) {
      console.error('[masterDataService] getCategoryProducts error:', err);
      return [];
    }
  },

  /**
   * Adds or registers a new homepage showcase asset in master_data.
   */
  async addHomepageAsset({ key, value, description = '', display_order = 10 }) {
    delete cache['homepage_assets'];
    const { data, error } = await supabase
      .from('master_data')
      .upsert({
        type: 'homepage_assets',
        key: key || `showcase_${Date.now()}`,
        value,
        description,
        display_order,
        is_active: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'type,key' })
      .select()
      .single();

    if (error) {
      console.error('[masterDataService] Failed to add homepage asset:', error);
      throw error;
    }
    return data;
  },

  /**
   * Deletes a homepage asset from master_data.
   */
  async deleteHomepageAsset(id) {
    delete cache['homepage_assets'];
    const { error } = await supabase
      .from('master_data')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[masterDataService] Failed to delete homepage asset:', error);
      throw error;
    }
    return true;
  },

  /**
   * Toggles active state of a homepage asset in master_data.
   */
  async toggleHomepageAsset(id, is_active) {
    delete cache['homepage_assets'];
    const { data, error } = await supabase
      .from('master_data')
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[masterDataService] Failed to toggle homepage asset:', error);
      throw error;
    }
    return data;
  }
};
