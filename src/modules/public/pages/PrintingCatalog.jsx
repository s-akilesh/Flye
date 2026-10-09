import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { ROUTES } from '../../../shared/constants/routes';
import { useToast } from '../../../shared/context/ToastContext';
import { SEO, PageType, generateSEO } from '../../../shared/seo';
import { useAuth } from '../../auth/context/AuthContext.jsx';
import { masterDataService } from '../../../shared/services/masterDataService';
import { printingInventoryService } from '../../printing-inventory/services/printingInventoryService';
import { Card } from '../../../shared/components/ui/Card';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { AdminToolbar } from '../../../shared/components/ui/AdminToolbar';

export const PrintingCatalog = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const { showToast } = useToast();
  const { profile } = useAuth();

  const seoProps = generateSEO(PageType.PRINTING);

  // States for DB Products & Master Data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState(['all']);
  const [appliedCategories, setAppliedCategories] = useState(['all']);
  const [sortBy, setSortBy] = useState('popular');

  // Sync category param from URL
  useEffect(() => {
    if (categoryParam && categoryParam.trim()) {
      const catVal = categoryParam.trim();
      setActiveCategories([catVal]);
      setAppliedCategories([catVal]);
    }
  }, [categoryParam]);

  // Load products and categories from DB / Master Data
  useEffect(() => {
    const loadInventoryData = async () => {
      setIsLoading(true);
      try {
        const pubProducts = await printingInventoryService.getPublishedProducts();
        setProducts(pubProducts);

        const cats = await masterDataService.getValues('3d_print_category');
        setCategories(cats);

        const mats = await masterDataService.getValues('3d_print_material');
        setMaterials(mats);
      } catch (err) {
        console.error(err);
        showToast("❌ Failed to load 3D printing products.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadInventoryData();
  }, []);

  const handleToggleCategory = (cat) => {
    if (cat === 'all') {
      setActiveCategories(['all']);
    } else {
      let nextCats = activeCategories.filter(c => c !== 'all');
      if (nextCats.includes(cat)) {
        nextCats = nextCats.filter(c => c !== cat);
      } else {
        nextCats.push(cat);
      }
      if (nextCats.length === 0) {
        setActiveCategories(['all']);
      } else {
        setActiveCategories(nextCats);
      }
    }
  };

  const handleApplyFilters = () => {
    setAppliedCategories([...activeCategories]);
  };

  const handleClearAll = () => {
    setActiveCategories(['all']);
    setAppliedCategories(['all']);
    setSearchQuery('');
  };

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Client-side Instant Filter
  let filteredCatalog = products.filter(item => {
    const matchesCategory = appliedCategories.includes('all') || 
      appliedCategories.includes(item.category) ||
      (item.category && appliedCategories.some(c => {
        const cClean = c.toLowerCase().replace(/[^a-z0-9]/g, '');
        const itemClean = item.category.toLowerCase().replace(/[^a-z0-9]/g, '');
        return c.toLowerCase() === item.category.toLowerCase() || (cClean && itemClean && (cClean === itemClean || itemClean.includes(cClean) || cClean.includes(itemClean)));
      }));
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.material && item.material.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Client-side Instant Sort
  filteredCatalog = [...filteredCatalog].sort((a, b) => {
    if (sortBy === 'price-low') {
      const priceA = a.contact_for_price ? Infinity : Number(a.price || 0);
      const priceB = b.contact_for_price ? Infinity : Number(b.price || 0);
      return priceA - priceB;
    }
    if (sortBy === 'price-high') {
      const priceA = a.contact_for_price ? -Infinity : Number(a.price || 0);
      const priceB = b.contact_for_price ? -Infinity : Number(b.price || 0);
      return priceB - priceA;
    }
    if (sortBy === 'newest') {
      return new Date(b.created_at || b.updated_at || 0) - new Date(a.created_at || a.updated_at || 0);
    }
    // 'popular' default: by name A-Z
    return a.name.localeCompare(b.name);
  });

  const getLabelForValue = (list, val) => {
    const item = list.find(x => x.key === val || x.value === val);
    return item ? item.value : val;
  };

  const isFiltered = (appliedCategories.length > 0 && !appliedCategories.includes('all')) || searchQuery !== '';

  return (
    <>
      <SEO {...seoProps} page={PageType.PRINTING} />
      <motion.section
        className="portal-section"
        id="printing-portal"
        style={{ paddingTop: '73px', minHeight: 'calc(100vh - 73px)' }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Light Theme Page Header Banner */}
        <div
          className="portal-header"
          style={{
            width: 'auto',
            marginLeft: 'calc(-1 * var(--page-padding))',
            marginRight: 'calc(-1 * var(--page-padding))',
            paddingLeft: 'var(--page-padding)',
            paddingRight: 'var(--page-padding)',
            paddingTop: '16px',
            paddingBottom: '16px',
            background: 'var(--sys-page-header-bg)',
            borderBottom: '1px solid var(--sys-divider)',
            marginBottom: '0px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Button variant="secondary" className="btn-back" onClick={() => navigate(ROUTES.HOME)} style={{ padding: '8px', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons" style={{ fontSize: '20px' }}>arrow_back</span>
            </Button>
            <div className="portal-title-area">
              <h2>3D Printing Catalog</h2>
            </div>
          </div>
        </div>

        {/* 2-Column Marketplace Container: Left Sidebar (Desktop/Mid) + Right Main Grid */}
        <div className="marketplace-layout-container" style={{ padding: '20px 0' }}>
          
          {/* ========================================================================
              LEFT SIDEBAR: FILTER & SORT (Web View - Large and Mid screens >= 768px)
              ======================================================================== */}
          <aside className="marketplace-desktop-sidebar">
            {/* Search Input */}
            <div className="sidebar-filter-group">
              <label className="sidebar-group-title">Search Catalog</label>
              <div style={{ position: 'relative' }}>
                <Input
                  type="text"
                  id="search-printing-desktop"
                  className="form-input"
                  placeholder="Search products, materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', paddingRight: '36px', height: '38px', fontSize: '12.5px' }}
                />
                <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--txt-muted)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                  <span className="material-icons-outlined" style={{ fontSize: '18px' }}>search</span>
                </span>
              </div>
            </div>

            {/* Sort Option */}
            <div className="sidebar-filter-group">
              <label className="sidebar-group-title">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{
                  width: '100%',
                  height: '38px',
                  fontSize: '12.5px',
                  background: 'var(--form-bg)',
                  color: 'var(--txt-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0 10px',
                  cursor: 'pointer'
                }}
              >
                <option value="popular" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Most Popular</option>
                <option value="newest" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Newest</option>
                <option value="price-low" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Price: Low to High</option>
                <option value="price-high" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Price: High to Low</option>
              </select>
            </div>

            {/* Categories Section */}
            <div className="sidebar-filter-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="sidebar-group-title">Categories</label>
                {isFiltered && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--brand-primary)',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="admin-chip-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleToggleCategory('all')}
                  className={`admin-chip ${appliedCategories.includes('all') ? 'active' : ''}`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleToggleCategory(c.value)}
                    className={`admin-chip ${appliedCategories.includes(c.value) && !appliedCategories.includes('all') ? 'active' : ''}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ========================================================================
              RIGHT MAIN: PRODUCT GRID & MOBILE TRIGGER
              ======================================================================== */}
          <main className="marketplace-main">
            
            {/* Mobile Filter & Search Bar (< 768px) */}
            <div className="mobile-filter-bar">
              <Button
                type="button"
                variant="secondary"
                className="btn-back"
                onClick={() => navigate(ROUTES.HOME)}
                style={{
                  height: '38px',
                  width: '38px',
                  minWidth: '38px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px'
                }}
                aria-label="Back to home"
              >
                <span className="material-icons" style={{ fontSize: '20px' }}>arrow_back</span>
              </Button>
              <div style={{ flex: 1, position: 'relative' }}>
                <Input
                  type="text"
                  placeholder="Search 3D catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', height: '38px', fontSize: '13px', paddingRight: '36px' }}
                />
                <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--txt-muted)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                  <span className="material-icons-outlined" style={{ fontSize: '18px' }}>search</span>
                </span>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsMobileFiltersOpen(true)}
                style={{
                  height: '38px',
                  width: '38px',
                  minWidth: '38px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  position: 'relative'
                }}
                aria-label="Filter"
                title="Filter"
              >
                <span className="material-icons-outlined" style={{ fontSize: '20px' }}>tune</span>
                {isFiltered && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--brand-primary, #00dfa2)',
                      boxShadow: '0 0 4px var(--brand-primary, #00dfa2)'
                    }}
                  />
                )}
              </Button>
            </div>

            {/* Results Count Bar */}
            <div className="results-count-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', color: 'var(--txt-secondary)', fontWeight: '500' }}>
                Showing <strong style={{ color: 'var(--txt-primary)' }}>{filteredCatalog.length}</strong> {filteredCatalog.length === 1 ? '3D item' : '3D items'}
              </div>
            </div>

            {/* Catalog Grid */}
            <style>{`
              .catalog-cards {
                display: grid !important;
                grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)) !important;
                gap: 16px !important;
                width: 100% !important;
              }

              .sample-product-card {
                display: flex;
                flex-direction: column;
                border-radius: 14px;
                background: var(--sys-surface, #12121a);
                border: 1px solid var(--sys-border, rgba(255, 255, 255, 0.08));
                overflow: hidden;
                cursor: pointer;
                transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
                position: relative;
                width: 100%;
                box-sizing: border-box;
              }

              .sample-product-card:hover {
                transform: translateY(-3px);
                border-color: rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
              }

              .sample-product-card .card-img-wrap {
                position: relative;
                width: 100%;
                aspect-ratio: 1 / 1;
                background: #14141f;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .sample-product-card .card-img-wrap img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
              }

              .sample-product-card:hover .card-img-wrap img {
                transform: scale(1.04);
              }

              .sample-product-card .card-pill-tag {
                position: absolute;
                top: 8px;
                left: 8px;
                z-index: 2;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(6px);
                -webkit-backdrop-filter: blur(6px);
                color: #ffffff;
                font-size: 9.5px;
                font-weight: 800;
                padding: 3px 7px;
                border-radius: 6px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border: 1px solid rgba(255, 255, 255, 0.15);
              }

              .sample-product-card .card-info-wrap {
                padding: 10px 10px 12px 10px;
                display: flex;
                flex-direction: column;
                flex: 1;
                justifyContent: space-between;
                gap: 4px;
              }

              .sample-product-card .card-title {
                font-size: 13px;
                font-weight: 700;
                margin: 0;
                color: var(--txt-primary, #ffffff);
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.35;
                min-height: 35px;
                max-height: 35px;
              }

              .sample-product-card .card-meta {
                font-size: 11px;
                color: var(--txt-muted, #9ca3af);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .sample-product-card .card-bottom-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 6px;
                margin-top: 6px;
              }

              .sample-product-card .card-price {
                font-size: 13.5px;
                font-weight: 800;
                color: var(--txt-primary, #ffffff);
                white-space: nowrap;
              }

              .sample-product-card .btn-card-plus {
                width: 30px !important;
                height: 30px !important;
                min-width: 30px !important;
                border-radius: 50% !important;
                border: 1.5px solid var(--brand-primary, #38bdf8) !important;
                background: transparent !important;
                color: var(--brand-primary, #38bdf8) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                padding: 0 !important;
                flex-shrink: 0 !important;
                box-shadow: none !important;
                transition: all 0.2s ease !important;
              }

              .sample-product-card .btn-card-plus svg {
                stroke: var(--brand-primary, #38bdf8) !important;
                display: block !important;
              }

              [data-theme='light'] .sample-product-card .btn-card-plus {
                border: 1.5px solid var(--brand-primary, #0284c7) !important;
                background: transparent !important;
                color: var(--brand-primary, #0284c7) !important;
                box-shadow: none !important;
              }

              [data-theme='light'] .sample-product-card .btn-card-plus svg {
                stroke: var(--brand-primary, #0284c7) !important;
              }

              .sample-product-card .btn-card-plus:hover {
                background: var(--brand-primary, #38bdf8) !important;
                border-color: var(--brand-primary, #38bdf8) !important;
                color: #ffffff !important;
                transform: scale(1.08) !important;
              }

              .sample-product-card .btn-card-plus:hover svg {
                stroke: #ffffff !important;
              }

              [data-theme='light'] .sample-product-card .btn-card-plus:hover {
                background: var(--brand-primary, #0284c7) !important;
                border-color: var(--brand-primary, #0284c7) !important;
                color: #ffffff !important;
              }

              [data-theme='light'] .sample-product-card .btn-card-plus:hover svg {
                stroke: #ffffff !important;
              }

              /* Mobile Adjustments (<= 767px) */
              @media (max-width: 767px) {
                .catalog-cards {
                  grid-template-columns: repeat(2, 1fr) !important;
                  gap: 12px !important;
                }
                .sample-product-card {
                  border-radius: 14px !important;
                }
                .sample-product-card .card-info-wrap {
                  padding: 8px 8px 10px 8px !important;
                }
                .sample-product-card .card-title {
                  font-size: 12.5px !important;
                  line-height: 1.35 !important;
                  min-height: 34px !important;
                  max-height: 34px !important;
                }
                .sample-product-card .card-meta {
                  font-size: 10.5px !important;
                }
                .sample-product-card .card-price {
                  font-size: 13px !important;
                }
                .sample-product-card .btn-card-plus {
                  width: 28px !important;
                  height: 28px !important;
                  min-width: 28px !important;
                }
              }
            `}</style>
            {isLoading ? (
              <div className="catalog-cards">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} variant="card" style={{ width: '100%', aspectRatio: '0.85', borderRadius: '14px' }} />
                ))}
              </div>
            ) : filteredCatalog.length > 0 ? (
              <div className="catalog-cards">
                {filteredCatalog.map((item) => {
                  const displayPrice = (Number(item.price) || 0).toLocaleString('en-IN');
                  const badgeText = item.badge === 'best-seller'
                    ? 'BEST SELLER'
                    : item.badge === 'new'
                    ? 'NEW'
                    : item.is_featured
                    ? 'FEATURED'
                    : item.badge
                    ? String(item.badge).toUpperCase()
                    : null;
                  const materialLabel = getLabelForValue(materials, item.material) || item.category || '3D Print';

                  return (
                    <div
                      className="sample-product-card"
                      key={item.id}
                      onClick={() => navigate(ROUTES.PRINTING_DETAILS.replace(':id', item.id))}
                    >
                      {/* Image Box */}
                      <div className="card-img-wrap">
                        {badgeText && (
                          <span className="card-pill-tag">
                            {badgeText}
                          </span>
                        )}

                        {item.primary_image_url ? (
                          <img
                            src={item.primary_image_url}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span className="material-icons-outlined" style={{ fontSize: '32px', color: 'var(--txt-muted)' }}>3d_rotation</span>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="card-info-wrap">
                        {/* Row 1: Title (2 lines) */}
                        <h3 className="card-title" title={item.name}>
                          {item.name}
                        </h3>

                        {/* Row 2: Subtitle / Meta from DB */}
                        <div className="card-meta">
                          {materialLabel}
                        </div>

                        {/* Row 3: Price + Plus Circle Button (Right to price) */}
                        <div className="card-bottom-row">
                          {item.contact_for_price ? (
                            <span style={{ fontSize: '10.5px', color: 'var(--brand-primary)', fontWeight: '700', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                              Price On Request
                            </span>
                          ) : (
                            <span className="card-price">
                              ₹{displayPrice}
                            </span>
                          )}

                          <button
                            type="button"
                            className="btn-card-plus"
                            title="View details & order"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(ROUTES.PRINTING_DETAILS.replace(':id', item.id));
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="marketplace-empty-state active" style={{ marginTop: '16px' }}>
                <span className="material-icons-outlined" style={{ fontSize: '40px', color: 'var(--txt-muted)', marginBottom: '12px' }}>inventory_2</span>
                <h3>No matching 3D products found</h3>
                <p style={{ fontSize: '13px', color: 'var(--txt-muted)', margin: '8px 0 16px 0' }}>Try changing categories or searching for a different keyword.</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button variant="outline" onClick={handleClearAll}>
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter & Sort Drawer Modal */}
        <Modal
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
          className="modal-content purple mobile-filter-modal"
          style={{ maxWidth: '500px', width: '92%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: '20px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Filter & Sort</h3>
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--txt-muted)', cursor: 'pointer' }}
            >
              <span className="material-icons">close</span>
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Sort */}
            <div>
              <label className="sidebar-group-title" style={{ display: 'block', marginBottom: '8px' }}>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: '100%', height: '38px', fontSize: '13px' }}
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Categories */}
            <div>
              <label className="sidebar-group-title" style={{ display: 'block', marginBottom: '8px' }}>Categories</label>
              <div className="admin-chip-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleToggleCategory('all')}
                  className={`admin-chip ${appliedCategories.includes('all') ? 'active' : ''}`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleToggleCategory(c.value)}
                    className={`admin-chip ${appliedCategories.includes(c.value) && !appliedCategories.includes('all') ? 'active' : ''}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--sys-divider)' }}>
            <Button variant="secondary" onClick={handleClearAll} style={{ flex: 1 }}>
              Reset
            </Button>
            <Button variant="primary" onClick={() => setIsMobileFiltersOpen(false)} style={{ flex: 1 }}>
              Apply
            </Button>
          </div>
        </Modal>
      </motion.section>
    </>
  );
};
