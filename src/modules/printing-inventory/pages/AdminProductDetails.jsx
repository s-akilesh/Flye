import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { useToast } from '../../../shared/context/ToastContext';
import { ROUTES } from '../../../shared/constants/routes';
import { masterDataService } from '../../../shared/services/masterDataService';
import { printingInventoryService } from '../services/printingInventoryService';

export const AdminProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Gallery active index
  const [activeIndex, setActiveIndex] = useState(0);

  // Master data labels
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);

  // Delete target state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadProductDetails = async () => {
    setIsLoading(true);
    try {
      const data = await printingInventoryService.getProductById(id);
      setProduct(data);
      setActiveIndex(0);

      const cats = await masterDataService.getValues('3d_print_category');
      setCategories(cats);

      const mats = await masterDataService.getValues('3d_print_material');
      setMaterials(mats);
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to load product details.", "error");
      navigate(ROUTES.ADMIN_PRINTING_INVENTORY);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProductDetails();
  }, [id]);

  const getLabelForValue = (list, val) => {
    const item = list.find(x => x.key === val || x.value === val);
    return item ? item.value : val;
  };

  // Toggle Visibility directly
  const handleToggleVisibility = async () => {
    if (!product) return;
    setIsProcessing(true);
    const newVisibility = product.visibility === 'Published' ? 'Draft' : 'Published';
    try {
      await printingInventoryService.updateProduct(product.id, {
        visibility: newVisibility
      }, product.images);
      
      showToast(`🚀 Product visibility set to ${newVisibility}!`, "success");
      setProduct(prev => ({
        ...prev,
        visibility: newVisibility
      }));
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to update visibility.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Duplicate product directly
  const handleDuplicate = async () => {
    if (!product) return;
    setIsProcessing(true);
    try {
      const dup = await printingInventoryService.duplicateProduct(product.id);
      showToast("🚀 Product duplicated successfully as Draft!", "success");
      navigate(ROUTES.ADMIN_PRINTING_INVENTORY_DETAILS.replace(':id', dup.id));
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to duplicate product.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete product handler
  const handleDeleteConfirm = async () => {
    if (!product) return;
    setIsProcessing(true);
    try {
      await printingInventoryService.deleteProduct(product.id);
      showToast("🗑️ Product deleted successfully.", "success");
      navigate(ROUTES.ADMIN_PRINTING_INVENTORY);
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to delete product.", "error");
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 'var(--page-padding)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Skeleton style={{ width: '250px', height: '32px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <Skeleton style={{ height: '300px' }} />
            <Skeleton style={{ height: '300px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const activeImage = product.images && product.images.length > 0
    ? product.images[activeIndex]?.image_url
    : '';

  return (
    <div style={{ padding: 'var(--page-padding)', boxSizing: 'border-box' }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}
      >
        {/* Back and Header Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="secondary" onClick={() => navigate(ROUTES.ADMIN_PRINTING_INVENTORY)} style={{ padding: '8px', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons" style={{ fontSize: '18px' }}>arrow_back</span>
            </Button>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)' }}>Product Details</h1>
              <p style={{ fontSize: '12px', color: 'var(--txt-muted)', margin: '4px 0 0 0' }}>SKU: {product.sku}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              onClick={handleToggleVisibility}
              disabled={isProcessing}
              style={{ height: '38px', padding: '0 16px', fontSize: '13px', fontWeight: '600' }}
            >
              <span className="material-icons" style={{ fontSize: '16px', marginRight: '6px', verticalAlign: 'middle' }}>
                {product.visibility === 'Published' ? 'visibility_off' : 'visibility'}
              </span>
              {product.visibility === 'Published' ? 'Unpublish' : 'Publish'}
            </Button>

            <Button
              variant="secondary"
              onClick={handleDuplicate}
              disabled={isProcessing}
              style={{ height: '38px', padding: '0 16px', fontSize: '13px', fontWeight: '600' }}
            >
              <span className="material-icons" style={{ fontSize: '16px', marginRight: '6px', verticalAlign: 'middle' }}>content_copy</span>
              Duplicate
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.ADMIN_PRINTING_INVENTORY_EDIT.replace(':id', product.id))}
              style={{ height: '38px', padding: '0 16px', fontSize: '13px', fontWeight: '600' }}
            >
              <span className="material-icons" style={{ fontSize: '16px', marginRight: '6px', verticalAlign: 'middle' }}>edit</span>
              Edit
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(true)}
              style={{ height: '38px', padding: '0 16px', fontSize: '13px', fontWeight: '600', color: 'var(--status-danger)' }}
            >
              <span className="material-icons" style={{ fontSize: '16px', marginRight: '6px', verticalAlign: 'middle' }}>delete</span>
              Delete
            </Button>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Left Column: Image Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Card style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {activeImage ? (
                <div style={{ width: '100%', aspectRatio: '1.2', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px', background: 'var(--sys-border)' }}>
                  <img
                    src={activeImage}
                    alt={product.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <div style={{ width: '100%', aspectRatio: '1.2', background: 'var(--sys-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-icons-outlined" style={{ fontSize: '48px', color: 'var(--txt-muted)' }}>image</span>
                </div>
              )}

              {/* Thumbnails list */}
              {product.images && product.images.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', width: '100%', marginTop: '16px', paddingBottom: '4px' }}>
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      style={{
                        padding: 0,
                        border: idx === activeIndex ? '2px solid var(--brand-primary)' : '1px solid var(--sys-border)',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        width: '60px',
                        height: '60px',
                        minWidth: '60px',
                        cursor: 'pointer',
                        background: 'none'
                      }}
                    >
                      <img
                        src={img.image_url}
                        alt={`Thumbnail ${idx}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Publication Status Card */}
            <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Visibility & Status</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  background: product.visibility === 'Published' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(156, 163, 175, 0.15)',
                  color: product.visibility === 'Published' ? 'var(--status-success)' : 'var(--txt-muted)',
                  border: product.visibility === 'Published' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(156, 163, 175, 0.25)'
                }}>
                  {product.visibility}
                </span>

                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  background: product.stock_quantity > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: product.stock_quantity > 0 ? 'var(--status-success)' : 'var(--status-danger)',
                  border: product.stock_quantity > 0 ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)'
                }}>
                  {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </Card>
          </div>

          {/* Right Column: Spec Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Product Meta */}
            <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid var(--sys-divider)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)' }}>{product.name}</h3>
                <span style={{ fontSize: '12px', color: 'var(--txt-muted)' }}>{getLabelForValue(categories, product.category)}</span>
              </div>

              {product.description && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Description</span>
                  <p style={{ fontSize: '13px', color: 'var(--txt-secondary)', lineHeight: '1.6', margin: 0 }}>{product.description}</p>
                </div>
              )}
            </Card>

            {/* Spec Tables */}
            <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--txt-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--sys-divider)', paddingBottom: '8px' }}>
                Technical Specifications
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--txt-muted)', display: 'block' }}>Material</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)' }}>{getLabelForValue(materials, product.material)}</span>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--txt-muted)', display: 'block' }}>Color</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)' }}>{product.color || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--txt-muted)', display: 'block' }}>Weight (g)</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)' }}>{product.weight ? `${product.weight} g` : 'N/A'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--txt-muted)', display: 'block' }}>Dimensions</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)' }}>{product.dimensions || 'N/A'}</span>
                </div>
              </div>
            </Card>

            {/* Inventory & Price */}
            <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--txt-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--sys-divider)', paddingBottom: '8px' }}>
                Pricing & Stock Level
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--txt-muted)', display: 'block' }}>Selling Price</span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--txt-primary)' }}>
                    {product.contact_for_price ? (
                      <span style={{ color: 'var(--brand-primary)', fontSize: '13px' }}>Price On Request</span>
                    ) : (
                      `₹${product.price}`
                    )}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '10px', color: 'var(--txt-muted)', display: 'block' }}>Current Stock</span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: product.stock_quantity <= product.reorder_level ? 'var(--status-warning)' : 'var(--txt-primary)' }}>
                    {product.stock_quantity} units
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '10px', color: 'var(--txt-muted)', display: 'block' }}>Reorder Level</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)' }}>{product.reorder_level} units</span>
                </div>
              </div>
            </Card>

            {/* Audit Logs Trail */}
            <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--txt-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--sys-divider)', paddingBottom: '8px' }}>
                System Audit Information
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: 'var(--txt-muted)', display: 'block', fontSize: '10px' }}>Created By</span>
                  <span style={{ fontWeight: '600', color: 'var(--txt-secondary)' }}>{product.creator?.full_name || 'System / Seed'}</span>
                  <span style={{ color: 'var(--txt-muted)', display: 'block', fontSize: '10px', marginTop: '2px' }}>
                    {product.created_at ? new Date(product.created_at).toLocaleString() : 'N/A'}
                  </span>
                </div>

                <div>
                  <span style={{ color: 'var(--txt-muted)', display: 'block', fontSize: '10px' }}>Last Updated By</span>
                  <span style={{ fontWeight: '600', color: 'var(--txt-secondary)' }}>{product.updater?.full_name || 'System / Seed'}</span>
                  <span style={{ color: 'var(--txt-muted)', display: 'block', fontSize: '10px', marginTop: '2px' }}>
                    {product.updated_at ? new Date(product.updated_at).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action is permanent and cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
