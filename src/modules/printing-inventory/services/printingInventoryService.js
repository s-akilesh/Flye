import { supabase } from '../../../shared/services/supabaseClient.js';
import { logger } from '../../../shared/utils/logger.js';

export const printingInventoryService = {
  /**
   * Retrieves all products with audit creator/updater profile information.
   */
  getProducts: async () => {
    logger.log('[printingInventoryService] Fetching all products...');
    const { data, error } = await supabase
      .from('3d_print_products')
      .select(`
        *,
        creator:profiles!created_by(full_name, email),
        updater:profiles!updated_by(full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('[printingInventoryService] Error fetching products:', error);
      throw error;
    }

    // Load primary image for each product
    const products = data || [];
    if (products.length > 0) {
      const productIds = products.map(p => p.id);
      const { data: images, error: imgError } = await supabase
        .from('3d_print_product_images')
        .select('*')
        .in('product_id', productIds);

      if (!imgError && images) {
        products.forEach(p => {
          const pImages = images.filter(img => img.product_id === p.id);
          const primaryImg = pImages.find(img => img.is_primary) || pImages[0] || null;
          p.primary_image_url = primaryImg ? primaryImg.image_url : '';
          p.images = pImages;
        });
      }
    }

    return products;
  },

  /**
   * Retrieves published products for public website integration.
   */
  getPublishedProducts: async () => {
    logger.log('[printingInventoryService] Fetching published products...');
    const { data, error } = await supabase
      .from('3d_print_products')
      .select('*')
      .eq('visibility', 'Published')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('[printingInventoryService] Error fetching published products:', error);
      throw error;
    }

    // Load primary image for each published product
    const products = data || [];
    if (products.length > 0) {
      const productIds = products.map(p => p.id);
      const { data: images, error: imgError } = await supabase
        .from('3d_print_product_images')
        .select('*')
        .in('product_id', productIds);

      if (!imgError && images) {
        products.forEach(p => {
          const pImages = images.filter(img => img.product_id === p.id);
          const primaryImg = pImages.find(img => img.is_primary) || pImages[0] || null;
          p.primary_image_url = primaryImg ? primaryImg.image_url : '';
          p.images = pImages;
        });
      }
    }

    return products;
  },

  /**
   * Retrieves a single product by ID, including its gallery and audit info.
   */
  getProductById: async (id) => {
    logger.log('[printingInventoryService] Fetching product by ID:', id);
    const { data, error } = await supabase
      .from('3d_print_products')
      .select(`
        *,
        creator:profiles!created_by(full_name, email),
        updater:profiles!updated_by(full_name, email),
        images:3d_print_product_images(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      logger.error('[printingInventoryService] Error fetching product details:', error);
      throw error;
    }

    if (data && data.images) {
      // Sort images by display_order
      data.images.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      const primaryImg = data.images.find(img => img.is_primary) || data.images[0] || null;
      data.primary_image_url = primaryImg ? primaryImg.image_url : '';
    }

    return data;
  },

  /**
   * Generates the next sequential unique SKU. Format: FLY-3DP-0001, FLY-3DP-0002, etc.
   */
  generateNextSKU: async () => {
    logger.log('[printingInventoryService] Generating next SKU...');
    const { data, error } = await supabase
      .from('3d_print_products')
      .select('sku')
      .like('sku', 'FLY-3DP-%')
      .order('sku', { ascending: false })
      .limit(1);

    if (error) {
      logger.error('[printingInventoryService] Error generating SKU:', error);
      throw error;
    }

    if (data && data.length > 0) {
      const highestSku = data[0].sku;
      const match = highestSku.match(/FLY-3DP-(\d+)/);
      if (match) {
        const nextNum = parseInt(match[1], 10) + 1;
        return `FLY-3DP-${String(nextNum).padStart(4, '0')}`;
      }
    }

    return 'FLY-3DP-0001';
  },

  /**
   * Creates a new product and inserts its gallery images.
   */
  createProduct: async (productData, imageList = []) => {
    logger.log('[printingInventoryService] Creating product:', productData.name);

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;

    const { data, error } = await supabase
      .from('3d_print_products')
      .insert({
        ...productData,
        created_by: userId,
        updated_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      logger.error('[printingInventoryService] Error creating product:', error);
      throw error;
    }

    if (imageList && imageList.length > 0) {
      const imagesToInsert = imageList.map((img, index) => ({
        product_id: data.id,
        image_url: img.image_url,
        is_primary: img.is_primary || false,
        display_order: index
      }));

      const { error: imgError } = await supabase
        .from('3d_print_product_images')
        .insert(imagesToInsert);

      if (imgError) {
        logger.error('[printingInventoryService] Error inserting product images:', imgError);
        throw imgError;
      }
    }

    return data;
  },

  /**
   * Updates an existing product and synchronizes its gallery images.
   */
  updateProduct: async (id, productData, imageList = []) => {
    logger.log('[printingInventoryService] Updating product:', id);

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;

    const { data, error } = await supabase
      .from('3d_print_products')
      .update({
        ...productData,
        updated_by: userId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('[printingInventoryService] Error updating product:', error);
      throw error;
    }

    // Synchronize images: delete current ones and re-insert new list
    const { error: deleteError } = await supabase
      .from('3d_print_product_images')
      .delete()
      .eq('product_id', id);

    if (deleteError) {
      logger.error('[printingInventoryService] Error clearing product images:', deleteError);
      throw deleteError;
    }

    if (imageList && imageList.length > 0) {
      const imagesToInsert = imageList.map((img, index) => ({
        product_id: id,
        image_url: img.image_url,
        is_primary: img.is_primary || false,
        display_order: index
      }));

      const { error: imgError } = await supabase
        .from('3d_print_product_images')
        .insert(imagesToInsert);

      if (imgError) {
        logger.error('[printingInventoryService] Error re-inserting product images:', imgError);
        throw imgError;
      }
    }

    return data;
  },

  /**
   * Deletes a product (cascade deletes associated images).
   */
  deleteProduct: async (id) => {
    logger.log('[printingInventoryService] Deleting product:', id);
    const { error } = await supabase
      .from('3d_print_products')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('[printingInventoryService] Error deleting product:', error);
      throw error;
    }

    return true;
  },

  /**
   * Duplicates an existing product with a fresh SKU, set to Draft visibility.
   */
  duplicateProduct: async (id) => {
    logger.log('[printingInventoryService] Duplicating product:', id);
    
    // 1. Fetch current details
    const product = await printingInventoryService.getProductById(id);
    if (!product) throw new Error('Product not found for duplication.');

    // 2. Generate a new SKU
    const newSku = await printingInventoryService.generateNextSKU();

    // 3. Create the duplicate as draft
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;

    const { data: newProduct, error: insertError } = await supabase
      .from('3d_print_products')
      .insert({
        sku: newSku,
        name: `Copy of ${product.name}`,
        description: product.description,
        category: product.category,
        material: product.material,
        color: product.color,
        weight: product.weight,
        dimensions: product.dimensions,
        stock_quantity: product.stock_quantity,
        reorder_level: product.reorder_level,
        price: product.price,
        contact_for_price: product.contact_for_price,
        status: 'active',
        visibility: 'Draft',
        created_by: userId,
        updated_by: userId,
        metadata: product.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      logger.error('[printingInventoryService] Error inserting duplicated product:', insertError);
      throw insertError;
    }

    // 4. Duplicate associated image references
    if (product.images && product.images.length > 0) {
      const dupImages = product.images.map(img => ({
        product_id: newProduct.id,
        image_url: img.image_url,
        is_primary: img.is_primary,
        display_order: img.display_order
      }));

      const { error: imgError } = await supabase
        .from('3d_print_product_images')
        .insert(dupImages);

      if (imgError) {
        logger.error('[printingInventoryService] Error inserting duplicated images:', imgError);
        throw imgError;
      }
    }

    return newProduct;
  }
};
