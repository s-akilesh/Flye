import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Client-side Instant Filter
  let filteredCatalog = products.filter(item => {
    const matchesCategory = appliedCategories.includes('all') || appliedCategories.includes(item.category);
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

  return (
    <>
      <SEO {...seoProps} page={PageType.PRINTING} />
      <style>{`
        #printing-portal .portal-header {
          margin-bottom: 0px !important;
        }
      `}</style>
      <motion.section
        className="portal-section portal-layout-fixed-height"
        id="printing-portal"
        style={{ paddingTop: '73px', height: 'calc(100vh - 73px)' }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
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
              <p>Explore premium fabricated prototypes and parts.</p>
            </div>
          </div>
        </div>

        <AdminToolbar
          className="marketplace-toolbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 100,
            background: 'var(--sys-surface)',
            borderBottom: '1px solid var(--sys-divider)',
            padding: '12px var(--page-padding)',
            width: 'auto',
            marginLeft: 'calc(-1 * var(--page-padding))',
            marginRight: 'calc(-1 * var(--page-padding))',
            borderRadius: 0,
            position: 'sticky',
            top: '80px'
          }}
          searchId="search-printing"
          searchPlaceholder="Search 3D printing catalog.."
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          showSearchIcon={true}
          activeFilterCount={appliedCategories.includes('all') ? 0 : appliedCategories.length}
          sortValue={sortBy}
          onSortChange={(e) => setSortBy(e.target.value)}
          sortOptions={[
            { value: 'popular', label: 'Most Popular' },
            { value: 'newest', label: 'Newest' },
            { value: 'price-low', label: 'Price: Low to High' },
            { value: 'price-high', label: 'Price: High to Low' }
          ]}
          onReset={handleClearAll}
          onApply={handleApplyFilters}
        >
          <div className="admin-filter-panel-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Categories */}
            <div className="calc-row">
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Categories</label>
              <div className="admin-chip-group">
                <button
                  type="button"
                  onClick={() => handleToggleCategory('all')}
                  className={`admin-chip ${activeCategories.includes('all') ? 'active' : ''}`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleToggleCategory(c.value)}
                    className={`admin-chip ${activeCategories.includes(c.value) && !activeCategories.includes('all') ? 'active' : ''}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </AdminToolbar>

        <div className="portal-content-flex marketplace-layout" style={{ maxWidth: '100%', width: '100%', marginTop: '16px' }}>
          <div className="marketplace-main" style={{ width: '100%', paddingTop: '12px' }}>

            {/* Catalog Grid */}
            {isLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Skeleton style={{ width: '100%', aspectRatio: '1.2', borderRadius: '8px' }} />
                    <Skeleton style={{ width: '80%', height: '16px' }} />
                    <Skeleton style={{ width: '50%', height: '12px' }} />
                  </Card>
                ))}
              </div>
            ) : filteredCatalog.length > 0 ? (
              <div className="catalog-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                {filteredCatalog.map((item) => (
                  <div
                    className="product-card"
                    key={item.id}
                    onClick={() => navigate(ROUTES.PRINTING_DETAILS.replace(':id', item.id))}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', border: '1px solid var(--sys-border)', borderRadius: '12px', background: 'var(--sys-surface)', overflow: 'hidden', transition: 'all 0.2s ease', position: 'relative' }}
                  >
                    {/* Image */}
                    <div className="product-img" style={{ width: '100%', height: '120px', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                      {item.primary_image_url ? (
                        <img
                          src={item.primary_image_url}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span className="material-icons-outlined" style={{ fontSize: '32px', color: 'var(--txt-muted)' }}>3d_rotation</span>
                      )}
                      
                      {/* Heart Favorite Overlay */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.8)',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#1f2937',
                          zIndex: 2,
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <span className="material-icons-outlined" style={{ fontSize: '16px' }}>favorite_border</span>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="product-details" style={{ padding: '16px 12px 12px 12px', display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
                      
                      <h4 style={{ fontSize: '13.5px', fontWeight: '500', margin: 0, color: 'var(--txt-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px', lineHeight: '1.4' }}>
                        {item.name}
                      </h4>

                      {/* Material & Stock Status info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--txt-muted)' }}>
                        <span>{getLabelForValue(materials, item.material) || 'PLA'}</span>
                        <span>•</span>
                        <span style={{
                          fontWeight: '600',
                          color: item.stock_quantity > 0 ? 'var(--status-success)' : 'var(--status-danger)'
                        }}>
                          {item.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      {/* Pricing block */}
                      <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
                        {item.contact_for_price ? (
                          <span style={{ fontSize: '13px', color: 'var(--brand-primary)', fontWeight: '600', textTransform: 'uppercase' }}>
                            Price On Request
                          </span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--txt-primary)' }}>
                              ₹{item.price}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--txt-muted)', textDecoration: 'line-through' }}>
                              ₹{Math.round(item.price * 1.4)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Full-width View Details button */}
                      <Button
                        type="button"
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(ROUTES.PRINTING_DETAILS.replace(':id', item.id));
                        }}
                        style={{ width: '100%', height: '34px', fontSize: '11.5px', fontWeight: '600', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <span className="material-icons-outlined" style={{ fontSize: '15px' }}>shopping_cart</span>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: '12px' }}>
                <span className="material-icons-outlined" style={{ fontSize: '40px', color: 'var(--txt-muted)' }}>inventory_2</span>
                <p style={{ fontSize: '13px', color: 'var(--txt-muted)', margin: 0 }}>No published products match your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </>
  );
};
