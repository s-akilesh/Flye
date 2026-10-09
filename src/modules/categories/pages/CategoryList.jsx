import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Modal } from '../../../shared/components/ui/Modal';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { useToast } from '../../../shared/context/ToastContext';
import { masterDataService } from '../../../shared/services/masterDataService';
import { storageService } from '../../../shared/services/storageService';
import { ROUTES } from '../../../shared/constants/routes';

export const CategoryList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | '3d_print_category' | 'project_category' | 'home'

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('3d_print_category');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formShowInHome, setFormShowInHome] = useState(false);
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formDescription, setFormDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategoriesData = async () => {
    setIsLoading(true);
    try {
      const data = await masterDataService.getCategories();
      setCategories(data || []);

      // Load product counts asynchronously
      const counts = {};
      for (const cat of data || []) {
        try {
          const prods = await masterDataService.getCategoryProducts(cat.key, cat.value, cat.type);
          counts[cat.id] = prods.length;
        } catch {
          counts[cat.id] = 0;
        }
      }
      setProductCounts(counts);
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to load categories.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategoriesData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormType('3d_print_category');
    setFormImageUrl('');
    setFormShowInHome(false);
    setFormDisplayOrder((categories.length + 1) * 10);
    setFormDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat, e) => {
    if (e) e.stopPropagation();
    setEditingCategory(cat);
    setFormName(cat.value || '');
    setFormType(cat.type || '3d_print_category');
    setFormImageUrl(cat.image_url || '');
    setFormShowInHome(!!cat.show_in_home);
    setFormDisplayOrder(cat.display_order || 0);
    setFormDescription(cat.description || '');
    setIsModalOpen(true);
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
        showToast('🖼️ Category image uploaded successfully!', 'success');
      } else {
        // Fallback object URL if public bucket url not set
        const previewUrl = URL.createObjectURL(file);
        setFormImageUrl(previewUrl);
        showToast('🖼️ Image selected for category.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to upload image. You can also paste an image URL.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleHomeVisibility = async (cat, e) => {
    if (e) e.stopPropagation();
    const nextVal = !cat.show_in_home;
    try {
      await masterDataService.updateCategory(cat.id, { show_in_home: nextVal });
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, show_in_home: nextVal } : c));
      showToast(nextVal ? '🏠 Category added to Home screen showcase.' : 'Category removed from Home screen.', 'success');
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to update category.', 'error');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Please enter a category name.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (editingCategory) {
        // Update existing
        await masterDataService.updateCategory(editingCategory.id, {
          value: formName,
          type: formType,
          image_url: formImageUrl || '',
          show_in_home: formShowInHome,
          display_order: Number(formDisplayOrder) || 0,
          description: formDescription
        });
        showToast('✅ Category updated successfully!', 'success');
      } else {
        // Create new
        await masterDataService.createCategory({
          type: formType,
          name: formName,
          imageUrl: formImageUrl,
          showInHome: formShowInHome,
          displayOrder: Number(formDisplayOrder) || 0,
          description: formDescription
        });
        showToast('🚀 Category created successfully!', 'success');
      }
      setIsModalOpen(false);
      loadCategoriesData();
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to save category.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await masterDataService.deleteValue(deleteTarget.id);
      showToast('🗑️ Category deleted successfully.', 'success');
      setCategories(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to delete category.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and sort categories by display order
  const filteredCategories = useMemo(() => {
    return categories
      .filter(cat => {
        const matchesQuery = !searchQuery || 
          cat.value.toLowerCase().includes(searchQuery.toLowerCase()) || 
          cat.key.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesType = true;
        if (typeFilter === '3d_print_category') matchesType = cat.type === '3d_print_category';
        else if (typeFilter === 'project_category') matchesType = cat.type === 'project_category';
        else if (typeFilter === 'home') matchesType = !!cat.show_in_home;

        return matchesQuery && matchesType;
      })
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }, [categories, searchQuery, typeFilter]);

  const kpis = useMemo(() => {
    const total = categories.length;
    const printCount = categories.filter(c => c.type === '3d_print_category').length;
    const projCount = categories.filter(c => c.type === 'project_category').length;
    const homeCount = categories.filter(c => c.show_in_home).length;
    return { total, printCount, projCount, homeCount };
  }, [categories]);

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', paddingBottom: '40px' }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        {/* Module Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)' }}>Categories</h1>
            <p style={{ fontSize: '13px', color: 'var(--txt-muted)', margin: '4px 0 0 0' }}>
              Organize products across 3D printing and electronic engineering projects.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleOpenAddModal}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '38px', padding: '0 16px', fontWeight: '600', fontSize: '13px' }}
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>add</span>
            Add Category
          </Button>
        </div>

        {/* Filter and Search Bar */}
        <Card style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--sys-surface)', border: '1px solid var(--sys-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            {/* Theme-Styled Search Bar */}
            <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '420px' }}>
              <span
                className="material-icons-outlined"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--txt-muted)',
                  fontSize: '18px',
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
                placeholder="Search categories by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '38px',
                  paddingRight: searchQuery ? '36px' : '12px',
                  height: '38px',
                  fontSize: '13px',
                  borderRadius: '8px'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--txt-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px'
                  }}
                  title="Clear search"
                >
                  <span className="material-icons" style={{ fontSize: '16px' }}>close</span>
                </button>
              )}
            </div>

            {/* Filter Chips */}
            <div className="admin-chip-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`admin-chip ${typeFilter === 'all' ? 'active' : ''}`}
                style={{ fontSize: '12px', padding: '6px 14px', height: '36px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                All ({kpis.total})
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('3d_print_category')}
                className={`admin-chip ${typeFilter === '3d_print_category' ? 'active' : ''}`}
                style={{ fontSize: '12px', padding: '6px 14px', height: '36px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                3D Printing ({kpis.printCount})
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('project_category')}
                className={`admin-chip ${typeFilter === 'project_category' ? 'active' : ''}`}
                style={{ fontSize: '12px', padding: '6px 14px', height: '36px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Electronic ({kpis.projCount})
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('home')}
                className={`admin-chip ${typeFilter === 'home' ? 'active' : ''}`}
                style={{ fontSize: '12px', padding: '6px 14px', height: '36px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                🏠 Home Featured ({kpis.homeCount})
              </button>
            </div>
          </div>
        </Card>

        {/* Category List as Cards Grid */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} style={{ height: '260px', borderRadius: '12px' }} />
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filteredCategories.map(cat => {
              const is3d = cat.type === '3d_print_category';
              const productCount = productCounts[cat.id] ?? 0;
              const storeRoute = is3d
                ? `${ROUTES.PRINTING}?category=${encodeURIComponent(cat.key || cat.value)}`
                : `${ROUTES.PROJECTS}?category=${encodeURIComponent(cat.value || cat.key)}`;

              return (
                <Card
                  key={cat.id}
                  onClick={() => navigate(`/admin/categories/${cat.id}`)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0,
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Category Image Header */}
                  <div style={{
                    width: '100%',
                    height: '140px',
                    background: 'var(--sys-surface-hover)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.value}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="material-icons-outlined" style={{ fontSize: '40px', color: 'var(--txt-muted)' }}>
                        image
                      </span>
                    )}

                    {/* Category Type Badge */}
                    <span style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      backdropFilter: 'blur(8px)',
                      background: is3d ? 'rgba(56, 189, 248, 0.9)' : 'rgba(168, 85, 247, 0.9)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      zIndex: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                    }}>
                      <span className="material-icons" style={{ fontSize: '13px' }}>
                        {is3d ? 'view_in_ar' : 'memory'}
                      </span>
                      {is3d ? '3D Printing' : 'Project Kit'}
                    </span>

                    {/* Home Showcase Home Icon Badge */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleHomeVisibility(cat, e)}
                      title={cat.show_in_home ? 'Featured on Home Screen (Click to remove)' : 'Not on Home (Click to add)'}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: cat.show_in_home ? 'var(--brand-primary, #6366f1)' : 'rgba(0, 0, 0, 0.65)',
                        border: cat.show_in_home ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        cursor: 'pointer',
                        zIndex: 2,
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(6px)'
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: '18px' }}>
                        home
                      </span>
                    </button>
                  </div>

                  {/* Card Content Details */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: 'var(--txt-primary)' }}>
                        {cat.value}
                      </h3>

                      {cat.description && (
                        <p style={{ fontSize: '12px', color: 'var(--txt-muted)', margin: '6px 0 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {cat.description}
                        </p>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--sys-divider)' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: 'var(--sys-surface-hover)',
                        color: 'var(--txt-secondary)',
                        whiteSpace: 'nowrap'
                      }}>
                        {productCount} {productCount === 1 ? 'Product' : 'Products'}
                      </span>

                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(storeRoute);
                          }}
                          style={{
                            background: 'none',
                            border: '1px solid var(--sys-border)',
                            color: 'var(--txt-secondary)',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11.5px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--brand-primary, #38bdf8)';
                            e.currentTarget.style.borderColor = 'var(--brand-primary, #38bdf8)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--txt-secondary)';
                            e.currentTarget.style.borderColor = 'var(--sys-border)';
                          }}
                          title={`View ${is3d ? '3D Printing' : 'Project Kits'} screen`}
                        >
                          <span className="material-icons" style={{ fontSize: '14px' }}>open_in_new</span>
                          Store
                        </button>
                        <Button
                          variant="secondary"
                          onClick={(e) => handleOpenEditModal(cat, e)}
                          style={{ padding: '4px 8px', height: '28px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <span className="material-icons" style={{ fontSize: '14px' }}>edit</span>
                          Edit
                        </Button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(cat);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--txt-muted)',
                            padding: '4px 6px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.2s ease, background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--status-danger, #ef4444)';
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--txt-muted)';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title="Delete Category"
                        >
                          <span className="material-icons" style={{ fontSize: '16px' }}>delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="marketplace-empty-state active" style={{ padding: '60px 20px', textAlign: 'center', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <span className="material-icons-outlined" style={{ fontSize: '48px', color: 'var(--txt-muted)', marginBottom: '12px' }}>category</span>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: 'var(--txt-primary)' }}>No categories found</h3>
            <p style={{ fontSize: '13px', color: 'var(--txt-muted)', margin: '0 0 20px 0' }}>
              {searchQuery ? 'Try clearing your search query or switching filters.' : 'Get started by creating your first category.'}
            </p>
            <Button variant="outline" onClick={handleOpenAddModal}>
              + Add Category
            </Button>
          </div>
        )}

        {/* Add / Edit Category Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => !isSaving && setIsModalOpen(false)}
          className="modal-content purple"
          style={{ maxWidth: '540px', width: '92%', padding: '24px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--txt-primary)' }}>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
              style={{ background: 'transparent', border: 'none', color: 'var(--txt-muted)', cursor: 'pointer' }}
            >
              <span className="material-icons">close</span>
            </button>
          </div>

          <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'var(--sys-surface-hover)',
              border: '1px solid var(--sys-divider)'
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)' }}>
                  Show in Home Screen
                </div>
                <div style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>
                  Feature this category on the public website home page.
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px', cursor: 'pointer' }}>
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
                  backgroundColor: formShowInHome ? 'var(--brand-primary, #38bdf8)' : '#4b5563',
                  transition: '0.3s',
                  borderRadius: '22px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '16px',
                    width: '16px',
                    left: formShowInHome ? '21px' : '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    transition: '0.3s',
                    borderRadius: '50%'
                  }} />
                </span>
              </label>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSaving || isUploading}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {isSaving ? 'Saving...' : (editingCategory ? 'Save Changes' : 'Create Category')}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!deleteTarget}
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteTarget?.value}"? Products in this category will not be deleted.`}
          confirmText="Delete Category"
          cancelText="Cancel"
          isDestructive={true}
          isLoading={isDeleting}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      </motion.div>
    </div>
  );
};
