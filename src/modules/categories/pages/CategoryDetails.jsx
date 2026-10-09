import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Modal } from '../../../shared/components/ui/Modal';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { useToast } from '../../../shared/context/ToastContext';
import { masterDataService } from '../../../shared/services/masterDataService';
import { storageService } from '../../../shared/services/storageService';
import { ROUTES } from '../../../shared/constants/routes';

export const CategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('3d_print_category');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formShowInHome, setFormShowInHome] = useState(false);
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formDescription, setFormDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const cat = await masterDataService.getCategoryById(id);
      if (!cat) {
        showToast('Category not found.', 'error');
        navigate(ROUTES.ADMIN_CATEGORIES);
        return;
      }
      setCategory(cat);

      // Load products in this category
      const prods = await masterDataService.getCategoryProducts(cat.key, cat.value, cat.type);
      setProducts(prods || []);
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to load category details.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleOpenEdit = () => {
    if (!category) return;
    setFormName(category.value || '');
    setFormType(category.type || '3d_print_category');
    setFormImageUrl(category.image_url || '');
    setFormShowInHome(!!category.show_in_home);
    setFormDisplayOrder(category.display_order || 0);
    setFormDescription(category.description || '');
    setIsEditModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_IMAGE_SIZE = 600 * 1024; // 600KB
    if (file.size > MAX_IMAGE_SIZE) {
      showToast('⚠️ Image size exceeds 600KB limit. Please choose an image under 600KB.', 'error');
      if (e.target) e.target.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const uploaded = await storageService.uploadImage('website-assets', 'categories', file);
      if (uploaded?.publicUrl) {
        setFormImageUrl(uploaded.publicUrl);
        showToast('🖼️ Category image uploaded!', 'success');
      } else {
        const previewUrl = URL.createObjectURL(file);
        setFormImageUrl(previewUrl);
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to upload image.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Please enter category name.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await masterDataService.updateCategory(category.id, {
        value: formName,
        type: formType,
        image_url: formImageUrl || '',
        show_in_home: formShowInHome,
        display_order: Number(formDisplayOrder) || 0,
        description: formDescription
      });
      showToast('✅ Category updated successfully!', 'success');
      setIsEditModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to update category.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(p => {
    if (!searchQuery) return true;
    return p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const is3d = category?.type === '3d_print_category';

  if (isLoading) {
    return (
      <div style={{ width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
        <Skeleton style={{ height: '180px', borderRadius: '12px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[1, 2, 3, 4].map(i => <Skeleton key={i} style={{ height: '80px', borderRadius: '8px' }} />)}
        </div>
        <Skeleton style={{ height: '350px', borderRadius: '12px' }} />
      </div>
    );
  }

  if (!category) return null;

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', paddingBottom: '40px' }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        {/* Category Hero Banner */}
        <Card style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--sys-divider)' }}>
          <div style={{
            position: 'relative',
            minHeight: '160px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
            display: 'flex',
            alignItems: 'center',
            padding: '24px 32px',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            {/* Category Image Thumbnail */}
            <div style={{
              width: '120px',
              height: '90px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'var(--sys-surface-hover)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.value}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <span className="material-icons-outlined" style={{ fontSize: '36px', color: 'var(--txt-muted)' }}>
                  image
                </span>
              )}
            </div>

            {/* Category Info Header */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <Button
                  variant="secondary"
                  onClick={() => navigate(ROUTES.ADMIN_CATEGORIES)}
                  style={{ padding: '4px 8px', height: '26px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span className="material-icons" style={{ fontSize: '14px' }}>arrow_back</span>
                  All Categories
                </Button>

                {/* Category Type Badge */}
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: is3d ? 'rgba(56, 189, 248, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                  color: is3d ? 'var(--accent-blue, #38bdf8)' : '#c084fc',
                  border: is3d ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(168, 85, 247, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span className="material-icons" style={{ fontSize: '12px' }}>{is3d ? 'view_in_ar' : 'memory'}</span>
                  {is3d ? '3D Printing Category' : 'Project Kit Category'}
                </span>

                {category.show_in_home && (
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span className="material-icons" style={{ fontSize: '12px' }}>home</span>
                    Featured on Home
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 6px 0', color: '#ffffff' }}>
                {category.value}
              </h1>

              {category.description && (
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, maxWidth: '600px' }}>
                  {category.description}
                </p>
              )}
            </div>

            {/* Banner Actions */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  const storeRoute = is3d
                    ? `${ROUTES.PRINTING}?category=${encodeURIComponent(category.key || category.value)}`
                    : `${ROUTES.PROJECTS}?category=${encodeURIComponent(category.value || category.key)}`;
                  navigate(storeRoute);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '36px', fontSize: '12.5px' }}
              >
                <span className="material-icons" style={{ fontSize: '16px' }}>open_in_new</span>
                View in {is3d ? '3D Catalog' : 'Projects'}
              </Button>

              <Button
                variant="secondary"
                onClick={handleOpenEdit}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '36px', fontSize: '12.5px' }}
              >
                <span className="material-icons" style={{ fontSize: '16px' }}>edit</span>
                Edit Category
              </Button>

              <Button
                variant="primary"
                onClick={() => {
                  if (is3d) {
                    navigate(ROUTES.ADMIN_PRINTING_INVENTORY_ADD);
                  } else {
                    navigate(ROUTES.ADMIN_ADD_PROJECT);
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '36px', fontSize: '12.5px' }}
              >
                <span className="material-icons" style={{ fontSize: '16px' }}>add</span>
                Add Product
              </Button>
            </div>
          </div>
        </Card>

        {/* Category Stats Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <Card style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Total Products</span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--txt-primary)' }}>{products.length}</span>
          </Card>

          <Card style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Category Type</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: is3d ? 'var(--brand-primary)' : '#a855f7', marginTop: '4px' }}>
              {is3d ? '3D Printing' : 'Electronic Project'}
            </span>
          </Card>

          <Card style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Home Visibility</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: category.show_in_home ? '#10b981' : 'var(--txt-muted)', marginTop: '4px' }}>
              {category.show_in_home ? '🏠 Displayed on Home' : 'Not on Home'}
            </span>
          </Card>

          <Card style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Slug / Key</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--txt-secondary)', fontFamily: 'monospace', marginTop: '4px' }}>
              {category.key}
            </span>
          </Card>
        </div>

        {/* Products in this Category Section */}
        <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)' }}>
                Products in "{category.value}" ({products.length})
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--txt-muted)', margin: '2px 0 0 0' }}>
                All catalogue items currently tagged under this category.
              </p>
            </div>

            {products.length > 0 && (
              <div style={{ position: 'relative', width: '260px' }}>
                <span
                  className="material-icons-outlined"
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--txt-muted)',
                    fontSize: '16px',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  search
                </span>
                <Input
                  type="text"
                  className="form-input"
                  placeholder="Filter products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '32px',
                    paddingRight: searchQuery ? '28px' : '10px',
                    height: '34px',
                    fontSize: '12px',
                    borderRadius: '6px'
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--txt-muted)',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Clear filter"
                  >
                    <span className="material-icons" style={{ fontSize: '14px' }}>close</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Product Items Grid */}
          {filteredProducts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {filteredProducts.map(prod => (
                <div
                  key={prod.id}
                  style={{
                    borderRadius: '10px',
                    border: '1px solid var(--sys-divider)',
                    background: 'var(--sys-surface)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Product Thumbnail */}
                  <div style={{ width: '100%', height: '140px', background: 'var(--sys-surface-hover)', position: 'relative' }}>
                    <img
                      src={prod.image}
                      alt={prod.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = is3d
                          ? storageService.getPublicUrl('website-assets', 'products-banner/product_showcase_bg.jpg')
                          : storageService.getPublicUrl('website-assets', 'products-banner/project_kits_bg.jpg');
                      }}
                    />
                    <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: prod.status === 'active' ? '#10b981' : '#64748b',
                        color: '#ffffff'
                      }}>
                        {prod.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                      <h4 style={{ fontSize: '13.5px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--txt-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {prod.title}
                      </h4>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--brand-primary)' }}>
                        {prod.contactForPrice ? 'Price On Request' : (prod.price ? `₹${prod.price}` : 'Price On Request')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--sys-divider)' }}>
                      <Button
                        variant="secondary"
                        onClick={() => navigate(prod.editUrl)}
                        style={{ flex: 1, height: '30px', fontSize: '11.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <span className="material-icons" style={{ fontSize: '14px' }}>edit</span>
                        Edit
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => navigate(prod.publicUrl)}
                        style={{ flex: 1, height: '30px', fontSize: '11.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <span className="material-icons" style={{ fontSize: '14px' }}>visibility</span>
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--txt-muted)' }}>
              <span className="material-icons-outlined" style={{ fontSize: '42px', marginBottom: '8px', display: 'block' }}>inventory_2</span>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 6px 0', color: 'var(--txt-primary)' }}>
                No products found in this category
              </h3>
              <p style={{ fontSize: '12.5px', margin: '0 0 16px 0' }}>
                Add your first product to this category or assign existing catalogue items.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  if (is3d) {
                    navigate(ROUTES.ADMIN_PRINTING_INVENTORY_ADD);
                  } else {
                    navigate(ROUTES.ADMIN_ADD_PROJECT);
                  }
                }}
              >
                + Add New Product
              </Button>
            </div>
          )}
        </Card>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => !isSaving && setIsEditModalOpen(false)}
          className="modal-content purple"
          style={{ maxWidth: '540px', width: '92%', padding: '24px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--txt-primary)' }}>
              Edit Category
            </h3>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSaving}
              style={{ background: 'transparent', border: 'none', color: 'var(--txt-muted)', cursor: 'pointer' }}
            >
              <span className="material-icons">close</span>
            </button>
          </div>

          <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Category Belongs To (Destination Screen) */}
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)', marginBottom: '8px' }}>
                Category Belongs To *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {/* Option 1: Project Kits */}
                <div
                  onClick={() => setFormType('project_category')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: formType === 'project_category' ? '2px solid var(--brand-primary, #38bdf8)' : '1px solid var(--sys-border)',
                    background: formType === 'project_category' ? 'rgba(56, 189, 248, 0.12)' : 'var(--sys-surface-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '6px',
                    background: formType === 'project_category' ? 'var(--brand-primary, #38bdf8)' : 'var(--sys-surface)',
                    color: formType === 'project_category' ? '#ffffff' : 'var(--txt-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span className="material-icons" style={{ fontSize: '18px' }}>memory</span>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: formType === 'project_category' ? 'var(--txt-primary)' : 'var(--txt-secondary)' }}>
                      Project Kits
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--txt-muted)', marginTop: '2px' }}>
                      Navigates to /projects
                    </div>
                  </div>
                </div>

                {/* Option 2: 3D Printing */}
                <div
                  onClick={() => setFormType('3d_print_category')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: formType === '3d_print_category' ? '2px solid var(--brand-primary, #38bdf8)' : '1px solid var(--sys-border)',
                    background: formType === '3d_print_category' ? 'rgba(56, 189, 248, 0.12)' : 'var(--sys-surface-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '6px',
                    background: formType === '3d_print_category' ? 'var(--brand-primary, #38bdf8)' : 'var(--sys-surface)',
                    color: formType === '3d_print_category' ? '#ffffff' : 'var(--txt-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span className="material-icons" style={{ fontSize: '18px' }}>view_in_ar</span>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: formType === '3d_print_category' ? 'var(--txt-primary)' : 'var(--txt-secondary)' }}>
                      3D Printing
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--txt-muted)', marginTop: '2px' }}>
                      Navigates to /printing
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Name */}
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)', marginBottom: '8px' }}>
                Category Name *
              </label>
              <Input
                type="text"
                className="form-input"
                placeholder="e.g. Robotics, Home Decor, IoT..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                style={{ width: '100%', height: '40px', fontSize: '13px' }}
              />
            </div>

            {/* Category Image */}
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)', marginBottom: '8px' }}>
                Category Image
              </label>
              
              <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--sys-surface-hover)',
                border: '1px solid var(--sys-divider)'
              }}>
                {/* Image Preview Box */}
                <div style={{
                  width: '90px',
                  height: '68px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: 'var(--sys-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--sys-divider)',
                  flexShrink: 0
                }}>
                  {formImageUrl ? (
                    <img
                      src={formImageUrl}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={() => {
                        setFormImageUrl('');
                      }}
                    />
                  ) : (
                    <span className="material-icons-outlined" style={{ fontSize: '28px', color: 'var(--txt-muted)' }}>image</span>
                  )}
                </div>

                {/* Upload Button Action */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                  <label style={{
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    color: 'var(--accent-blue, #38bdf8)',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid var(--accent-blue, #38bdf8)',
                    background: 'rgba(56, 189, 248, 0.08)',
                    width: 'fit-content'
                  }}>
                    <span className="material-icons" style={{ fontSize: '16px' }}>upload</span>
                    {isUploading ? 'Uploading...' : (formImageUrl ? 'Change Image' : 'Upload Image')}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>
                    Supports JPG, PNG, WEBP (Max 600KB)
                  </span>
                </div>
              </div>
            </div>

            {/* Show in Home Screen Option */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: '8px',
              background: 'var(--sys-surface-hover)',
              border: '1px solid var(--sys-divider)'
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)' }}>Show in Home Screen</div>
                <div style={{ fontSize: '11px', color: 'var(--txt-muted)', marginTop: '2px' }}>Feature this category on the public website home page.</div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '42px', height: '24px', cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={formShowInHome}
                  onChange={(e) => setFormShowInHome(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: formShowInHome ? 'var(--brand-primary)' : '#4b5563',
                  transition: '0.3s',
                  borderRadius: '24px'
                }}>
                  <span style={{
                    position: 'absolute',
                    height: '18px',
                    width: '18px',
                    left: formShowInHome ? '21px' : '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    transition: '0.3s',
                    borderRadius: '50%'
                  }} />
                </span>
              </label>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSaving || isUploading}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      </motion.div>
    </div>
  );
};
