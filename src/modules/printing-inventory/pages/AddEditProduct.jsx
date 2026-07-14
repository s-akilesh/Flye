import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { useToast } from '../../../shared/context/ToastContext';
import { ROUTES } from '../../../shared/constants/routes';
import { masterDataService } from '../../../shared/services/masterDataService';
import { storageService } from '../../../shared/services/storageService';
import { printingInventoryService } from '../services/printingInventoryService';
import { MasterDataMultiSelect } from '../../../shared/components/ui/MasterDataMultiSelect';

export const AddEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  
  const isEditMode = !!id;

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [stockQuantity, setStockQuantity] = useState(0);
  const [reorderLevel, setReorderLevel] = useState(5);
  const [price, setPrice] = useState(0);
  const [contactForPrice, setContactForPrice] = useState(false);
  const [visibility, setVisibility] = useState('Draft'); // 'Published' | 'Draft'

  // Image list state: array of { id, image_url, is_primary, file }
  const [images, setImages] = useState([]);
  
  // Loading & Action states
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [isSkuReadOnly, setIsSkuReadOnly] = useState(true);

  // Master Data dropdown values
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);

  // Load master data and existing data if editing
  useEffect(() => {
    const loadInitData = async () => {
      try {
        // Load categories and materials
        const cats = await masterDataService.getValues('3d_print_category');
        setCategories(cats);
        // Let categories start empty in Add Mode to show placeholder
        if (isEditMode) {
          // Will be populated by existing product
        }

        const mats = await masterDataService.getValues('3d_print_material');
        setMaterials(mats);
        if (mats.length > 0) setMaterial(mats[0].value);

        // Load existing product if in Edit Mode
        if (isEditMode) {
          const product = await printingInventoryService.getProductById(id);
          setName(product.name || '');
          setSku(product.sku || '');
          setCategory(product.category || '');
          setDescription(product.description || '');
          setMaterial(product.material || '');
          setColor(product.color || '');
          setWeight(product.weight ? String(product.weight) : '');
          setDimensions(product.dimensions || '');
          setStockQuantity(product.stock_quantity || 0);
          setReorderLevel(product.reorder_level || 5);
          setPrice(product.price || 0);
          setContactForPrice(!!product.contact_for_price);
          setVisibility(product.visibility || 'Draft');
          
          if (product.images) {
            setImages(product.images.map(img => ({
              id: img.id,
              image_url: img.image_url,
              is_primary: !!img.is_primary,
              file: null
            })));
          }
        } else {
          // Auto generate next SKU in Add Mode
          const generatedSku = await printingInventoryService.generateNextSKU();
          setSku(generatedSku);
        }
      } catch (err) {
        console.error(err);
        showToast("❌ Failed to load form data.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitData();
  }, [id, isEditMode]);

  // SKU Regeneration handler
  const handleRegenerateSku = async () => {
    try {
      const nextSku = await printingInventoryService.generateNextSKU();
      setSku(nextSku);
      showToast("🚀 SKU regenerated successfully.", "success");
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to generate SKU.", "error");
    }
  };

  // Image Upload handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      addFilesToList(files);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      addFilesToList(files);
    }
  };

  const addFilesToList = (files) => {
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop().toLowerCase();
      
      if (!validExtensions.includes(ext)) {
        showToast(`❌ Invalid file type: ${file.name}. Only images allowed.`, "error");
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        showToast(`❌ ${file.name} exceeds 10MB limit.`, "error");
        continue;
      }

      const tempUrl = URL.createObjectURL(file);
      newImages.push({
        id: `temp-${Date.now()}-${Math.random()}`,
        image_url: tempUrl,
        is_primary: images.length === 0 && newImages.length === 0, // default first image as primary
        file: file
      });
    }

    setImages(prev => {
      const merged = [...prev, ...newImages];
      // Verify at least one primary image exists
      const hasPrimary = merged.some(img => img.is_primary);
      if (!hasPrimary && merged.length > 0) {
        merged[0].is_primary = true;
      }
      return merged;
    });
  };

  const handleRemoveImage = (imgId) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== imgId);
      // If we removed the primary image, pick a new one
      const wasPrimary = prev.find(img => img.id === imgId)?.is_primary;
      if (wasPrimary && updated.length > 0) {
        updated[0].is_primary = true;
      }
      return updated;
    });
  };

  const handleSetPrimary = (imgId) => {
    setImages(prev =>
      prev.map(img => ({
        ...img,
        is_primary: img.id === imgId
      }))
    );
  };

  // Submit Handler
  const handleSave = async (e, forcedVisibility = null) => {
    if (e) e.preventDefault();

    // Validations
    if (!name.trim()) {
      showToast("❌ Product Name is required.", "error");
      return;
    }
    if (!sku.trim()) {
      showToast("❌ Product SKU is required.", "error");
      return;
    }
    if (stockQuantity < 0) {
      showToast("❌ Stock Quantity must be a positive integer.", "error");
      return;
    }
    if (reorderLevel < 0) {
      showToast("❌ Reorder level must be a positive integer.", "error");
      return;
    }
    if (!contactForPrice && price <= 0) {
      showToast("❌ Price must be greater than zero.", "error");
      return;
    }
    if (weight && isNaN(Number(weight))) {
      showToast("❌ Weight must be a positive number.", "error");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Upload new image files first
      const finalImagesList = [];

      for (const img of images) {
        if (img.file) {
          // Upload to Supabase Storage
          const uploadResult = await storageService.uploadImage(
            'project-images',
            '3d-print-inventory',
            img.file
          );
          finalImagesList.push({
            image_url: uploadResult.publicUrl,
            is_primary: img.is_primary
          });
        } else {
          // Keep existing image URL
          finalImagesList.push({
            image_url: img.image_url,
            is_primary: img.is_primary
          });
        }
      }

      // 2. Prepare payload
      const payload = {
        sku: sku.trim(),
        name: name.trim(),
        description: description.trim(),
        category,
        material,
        color: color.trim() || null,
        weight: weight ? Number(weight) : null,
        dimensions: dimensions.trim() || null,
        stock_quantity: Number(stockQuantity),
        reorder_level: Number(reorderLevel),
        price: Number(price),
        contact_for_price: contactForPrice,
        visibility: forcedVisibility || visibility
      };

      // 3. Save to database
      if (isEditMode) {
        await printingInventoryService.updateProduct(id, payload, finalImagesList);
        showToast("🚀 Product updated successfully!", "success");
      } else {
        await printingInventoryService.createProduct(payload, finalImagesList);
        showToast("🚀 Product created successfully!", "success");
      }

      navigate(ROUTES.ADMIN_PRINTING_INVENTORY);
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to save product. Check database connection.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 'var(--page-padding)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Skeleton style={{ width: '250px', height: '32px', borderRadius: '6px' }} />
          <Card style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <Skeleton style={{ height: '48px' }} />
              <Skeleton style={{ height: '48px' }} />
              <Skeleton style={{ height: '100px', gridColumn: 'span 2' }} />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0px', boxSizing: 'border-box', overflowY: 'auto', height: '100%' }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', margin: '0px' }}
      >
        {/* Back and Title Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--sys-divider)', paddingBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="secondary" onClick={() => navigate(ROUTES.ADMIN_PRINTING_INVENTORY)} style={{ padding: '8px', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons" style={{ fontSize: '18px' }}>arrow_back</span>
            </Button>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)' }}>
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--txt-muted)', margin: '4px 0 0 0' }}>
                Fill in the details to publish or draft a 3D printing inventory catalogue item.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(ROUTES.ADMIN_PRINTING_INVENTORY)}
              disabled={isSaving}
              style={{ height: '38px', padding: '0 16px', fontWeight: '600' }}
            >
              Cancel
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={(e) => handleSave(e, 'Draft')}
              disabled={isSaving}
              style={{ height: '38px', padding: '0 16px', fontWeight: '600' }}
            >
              Save as Draft
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={(e) => handleSave(e, 'Published')}
              disabled={isSaving}
              style={{ height: '38px', padding: '0 20px', fontWeight: '600' }}
            >
              {isSaving ? 'Saving...' : (isEditMode ? 'Save Product' : 'Save Product')}
            </Button>
          </div>
        </div>

        <form onSubmit={(e) => handleSave(e)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section 1: Product Images */}
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)', borderBottom: '1px solid var(--sys-divider)', paddingBottom: '12px' }}>
              Product Images
            </h2>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: '2px dashed var(--sys-border)',
                borderRadius: '8px',
                padding: '32px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(139, 92, 246, 0.02)',
                transition: 'border 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => document.getElementById('image-upload-input').click()}
            >
              <span className="material-icons-outlined" style={{ fontSize: '36px', color: 'var(--brand-primary)' }}>cloud_upload</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)' }}>Drag and drop images here, or click to browse</span>
              <span style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>Supports JPG, PNG, WEBP, SVG (Max 10MB per image)</span>
              
              <input
                id="image-upload-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={isSaving}
              />
            </div>

            {/* Gallery Previews */}
            {images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px', marginTop: '8px' }}>
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    style={{
                      position: 'relative',
                      border: img.is_primary ? '2px solid var(--brand-primary)' : '1px solid var(--sys-border)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: 'var(--sys-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      aspectRatio: '1',
                      boxShadow: img.is_primary ? '0 0 10px rgba(139, 92, 246, 0.2)' : 'none'
                    }}
                  >
                    <img
                      src={img.image_url}
                      alt={`Preview ${index}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    {/* Primary Badge or Setter */}
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(img.id)}
                      style={{
                        position: 'absolute',
                        left: '6px',
                        top: '6px',
                        background: img.is_primary ? 'var(--brand-primary)' : 'rgba(0,0,0,0.5)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        fontSize: '9px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                      title={img.is_primary ? "Primary Image" : "Set as Primary thumbnail"}
                      disabled={isSaving}
                    >
                      <span className="material-icons" style={{ fontSize: '10px' }}>{img.is_primary ? 'star' : 'star_border'}</span>
                      {img.is_primary ? 'Primary' : 'Set Primary'}
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      style={{
                        position: 'absolute',
                        right: '6px',
                        top: '6px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      title="Remove image"
                      disabled={isSaving}
                    >
                      <span className="material-icons" style={{ fontSize: '14px' }}>close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Section 2: Inventory & Pricing */}
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)', borderBottom: '1px solid var(--sys-divider)', paddingBottom: '12px' }}>
              Inventory & Pricing
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {/* Stock Quantity */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Stock Quantity *</label>
                <Input
                  type="number"
                  className="form-input"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  required
                  disabled={isSaving}
                />
              </div>

              {/* Reorder Level */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Reorder Level *</label>
                <Input
                  type="number"
                  className="form-input"
                  value={reorderLevel}
                  onChange={(e) => setReorderLevel(e.target.value)}
                  required
                  disabled={isSaving}
                />
              </div>

              {/* Selling Price */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Selling Price (₹)</label>
                <Input
                  type="number"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={contactForPrice || isSaving}
                  style={{ background: contactForPrice ? 'var(--sys-border)' : 'var(--sys-surface)' }}
                  required={!contactForPrice}
                />
              </div>

              {/* Contact for Price Toggle */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Price Mode</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', userSelect: 'none', height: '40px' }}>
                  <input
                    type="checkbox"
                    checked={contactForPrice}
                    onChange={(e) => {
                      setContactForPrice(e.target.checked);
                      if (e.target.checked) setPrice(0);
                    }}
                    disabled={isSaving}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>Contact for Price</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Section 3: Basic Information */}
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)', borderBottom: '1px solid var(--sys-divider)', paddingBottom: '12px' }}>
              Basic Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Product Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Product Name *</label>
                <Input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Mechanical Gear Prototype"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSaving}
                />
              </div>

              {/* SKU */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Product SKU *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    type="text"
                    className="form-input"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    readOnly={isSkuReadOnly}
                    style={{ flex: 1, background: isSkuReadOnly ? 'var(--sys-border)' : 'var(--sys-surface)' }}
                    required
                    disabled={isSaving}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsSkuReadOnly(!isSkuReadOnly)}
                    style={{ minWidth: '40px', padding: 0 }}
                    title={isSkuReadOnly ? "Unlock manual editing" : "Lock SKU"}
                  >
                    <span className="material-icons" style={{ fontSize: '18px' }}>{isSkuReadOnly ? 'lock' : 'lock_open'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleRegenerateSku}
                    style={{ minWidth: '40px', padding: 0 }}
                    title="Regenerate next SKU automatically"
                    disabled={isSaving}
                  >
                    <span className="material-icons" style={{ fontSize: '18px' }}>refresh</span>
                  </Button>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Category */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Categories *</label>
                <MasterDataMultiSelect
                  type="3d_print_category"
                  selectedValues={category ? [category] : []}
                  onChange={(vals) => setCategory(vals.length > 0 ? vals[vals.length - 1] : '')}
                  placeholder="Select Categories"
                  allowAdd={true}
                  required={true}
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Description</label>
              <textarea
                className="form-input"
                placeholder="Describe the product specifications, utility, and printing quality..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
                disabled={isSaving}
              />
            </div>
          </Card>


          {/* Section 5: Printing Specifications */}
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)', borderBottom: '1px solid var(--sys-divider)', paddingBottom: '12px' }}>
              Printing Specifications
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {/* Material */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Material *</label>
                <select
                  className="form-input"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  required
                  disabled={isSaving}
                >
                  {materials.map(m => (
                    <option key={m.key} value={m.value}>{m.value}</option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Color</label>
                <Input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Jet Black, Pure White"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              {/* Weight */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Weight (grams)</label>
                <Input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 150"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              {/* Dimensions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Dimensions (L x W x H mm)</label>
                <Input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 100 x 50 x 80 mm"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>
          </Card>

        </form>
      </motion.div>
    </div>
  );
};
