import { supabase } from '../lib/supabase';
import { storageService } from './storageService';
import { logger } from '../utils/logger';

export const componentAssetService = {
  /**
   * Fetch all assets linked to a component slug.
   * @param {string} slug - Component slug.
   */
  async getComponentAssets(slug) {
    try {
      const { data, error } = await supabase
        .from('component_assets')
        .select('*')
        .eq('component_slug', slug)
        .order('asset_type', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      logger.error(`[componentAssetService] Failed to get assets for slug "${slug}":`, err);
      throw err;
    }
  },

  /**
   * Upload an asset to Supabase Storage and register/update its database entry.
   * Path: component-assets/{category}/{slug}/{asset_type}-{timestamp}.svg (or other extension)
   * @param {string} slug - Component slug.
   * @param {string} category - Component category (e.g. 'passive', 'boards', 'sensors').
   * @param {File} file - The file to upload.
   * @param {'component'|'pinout'|'exploded'|'thumbnail'} assetType - Supported asset types.
   */
  async uploadComponentAsset(slug, category, file, assetType) {
    try {
      const cleanCategory = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const folder = `${cleanCategory}/${cleanSlug}`;

      // Get existing asset to know if we need to delete the old file or increment the version
      const { data: existingAsset, error: fetchError } = await supabase
        .from('component_assets')
        .select('*')
        .eq('component_slug', slug)
        .eq('asset_type', assetType)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const fileExt = file.name.split('.').pop().toLowerCase();
      // Generate clean filename
      const targetName = `${assetType}-${Date.now()}.${fileExt}`;

      // 1. Upload to Supabase Storage
      let uploadResult;
      if (existingAsset?.storage_path) {
        // Upload new and delete old
        uploadResult = await storageService.replaceFile(
          'component-assets',
          folder,
          file,
          existingAsset.storage_path,
          targetName
        );
      } else {
        // Simple upload
        uploadResult = await storageService.uploadFile(
          'component-assets',
          folder,
          file,
          targetName
        );
      }

      const nextVersion = existingAsset ? existingAsset.version + 1 : 1;

      // 2. Upsert record in database
      const { data: upsertData, error: upsertError } = await supabase
        .from('component_assets')
        .upsert({
          id: existingAsset?.id || undefined,
          component_slug: slug,
          asset_type: assetType,
          storage_path: uploadResult.path,
          version: nextVersion,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id || null
        }, {
          onConflict: 'component_slug,asset_type'
        })
        .select()
        .single();

      if (upsertError) throw upsertError;

      return {
        asset: upsertData,
        publicUrl: uploadResult.publicUrl
      };
    } catch (err) {
      logger.error(`[componentAssetService] Failed to upload asset type "${assetType}" for slug "${slug}":`, err);
      throw err;
    }
  },

  /**
   * Delete a component asset from storage and database.
   * @param {string} slug - Component slug.
   * @param {string} assetType - Asset type.
   */
  async deleteComponentAsset(slug, assetType) {
    try {
      const { data: asset, error: fetchError } = await supabase
        .from('component_assets')
        .select('*')
        .eq('component_slug', slug)
        .eq('asset_type', assetType)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!asset) return { success: true };

      // 1. Delete from storage
      await storageService.deleteFile('component-assets', asset.storage_path);

      // 2. Delete from database
      const { error: dbError } = await supabase
        .from('component_assets')
        .delete()
        .eq('id', asset.id);

      if (dbError) throw dbError;

      return { success: true };
    } catch (err) {
      logger.error(`[componentAssetService] Failed to delete asset type "${assetType}" for slug "${slug}":`, err);
      throw err;
    }
  },

  /**
   * Parse SVG file content client-side to extract layer groups with IDs.
   * Looks for <g id="group_name"> and returns array of layer objects.
   * @param {string} svgContent - Raw SVG text content.
   */
  parseSvgLayers(svgContent) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const groups = doc.querySelectorAll('g[id]');
      const layers = [];

      groups.forEach((g) => {
        const id = g.getAttribute('id');
        // Filter out system or generic layout ids if needed
        if (id && !['viewport', 'grid', 'background', 'root', 'canvas'].includes(id.toLowerCase())) {
          layers.push({
            id,
            name: id
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
          });
        }
      });

      return layers;
    } catch (err) {
      logger.error('[componentAssetService] Failed to parse SVG layers:', err);
      return [];
    }
  },

  /**
   * Fetch interactive parts for a component slug.
   * @param {string} slug - Component slug.
   */
  async getComponentParts(slug) {
    try {
      const { data, error } = await supabase
        .from('component_parts')
        .select('*')
        .eq('component_slug', slug)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      logger.error(`[componentAssetService] Failed to get parts for slug "${slug}":`, err);
      throw err;
    }
  },

  /**
   * Save (upsert) interactive parts/layers for a component slug.
   * @param {string} slug - Component slug.
   * @param {Array} parts - Array of part objects to upsert.
   */
  async saveComponentParts(slug, parts) {
    try {
      if (!parts || parts.length === 0) return [];

      const partsData = parts.map((p, index) => ({
        id: p.id || undefined,
        component_slug: slug,
        svg_layer_id: p.svg_layer_id,
        display_name: p.display_name,
        part_type: p.part_type || null,
        description: p.description || '',
        linked_component_slug: p.linked_component_slug || null,
        sort_order: typeof p.sort_order === 'number' ? p.sort_order : index,
        is_enabled: p.is_enabled !== false,
        visual_config: p.visual_config || {}
      }));

      const { data, error } = await supabase
        .from('component_parts')
        .upsert(partsData, {
          onConflict: 'component_slug,svg_layer_id'
        })
        .select();

      if (error) throw error;
      return data;
    } catch (err) {
      logger.error(`[componentAssetService] Failed to save parts for slug "${slug}":`, err);
      throw err;
    }
  },

  /**
   * Delete an interactive part.
   * @param {string} partId - Unique part UUID.
   */
  async deleteComponentPart(partId) {
    try {
      const { error } = await supabase
        .from('component_parts')
        .delete()
        .eq('id', partId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      logger.error(`[componentAssetService] Failed to delete part ID "${partId}":`, err);
      throw err;
    }
  },

  /**
   * Fetch build video info for a component slug.
   */
  async getBuildVideo(slug) {
    try {
      const { data, error } = await supabase
        .from('component_build_videos')
        .select('*')
        .eq('component_slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data || null;
    } catch (err) {
      logger.error(`[componentAssetService] Failed to get build video for slug "${slug}":`, err);
      throw err;
    }
  },

  /**
   * Save (upsert) build video info for a component slug.
   */
  async saveBuildVideo(slug, url, title) {
    try {
      const { data, error } = await supabase
        .from('component_build_videos')
        .upsert({
          component_slug: slug,
          video_url: url,
          video_title: title,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'component_slug'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      logger.error(`[componentAssetService] Failed to save build video for slug "${slug}":`, err);
      throw err;
    }
  },

  /**
   * Delete build video info.
   */
  async deleteBuildVideo(slug) {
    try {
      const { error } = await supabase
        .from('component_build_videos')
        .delete()
        .eq('component_slug', slug);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      logger.error(`[componentAssetService] Failed to delete build video for slug "${slug}":`, err);
      throw err;
    }
  }
};
