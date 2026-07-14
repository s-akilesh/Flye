import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { AdminToolbar } from '../../../shared/components/ui/AdminToolbar';
import { Table } from '../../../shared/components/ui/Table';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { useToast } from '../../../shared/context/ToastContext';
import { ROUTES } from '../../../shared/constants/routes';
import { masterDataService } from '../../../shared/services/masterDataService';
import { printingInventoryService } from '../services/printingInventoryService';

export const ProductList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Master Data Dropdowns
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);

  // Confirm delete dialog states
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Load master data values and database products
  const loadData = async () => {
    setIsLoading(true);
    try {
      const dbProducts = await printingInventoryService.getProducts();
      setProducts(dbProducts);

      const cats = await masterDataService.getValues('3d_print_category');
      setCategories(cats);

      const mats = await masterDataService.getValues('3d_print_material');
      setMaterials(mats);
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to load inventory data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync page to 1 on filter trigger
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, materialFilter, stockFilter, sortField]);

  // Compute KPI values
  const kpiData = useMemo(() => {
    return {
      total: products.length,
      published: products.filter(p => p.visibility === 'Published').length,
      draft: products.filter(p => p.visibility === 'Draft').length,
      outOfStock: products.filter(p => p.stock_quantity <= 0).length
    };
  }, [products]);

  // Handle Search and Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(search.toLowerCase())) ||
        (item.material && item.material.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesMaterial = materialFilter === 'all' || item.material === materialFilter;
      
      let matchesStock = true;
      if (stockFilter === 'in_stock') {
        matchesStock = item.stock_quantity > 0;
      } else if (stockFilter === 'out_of_stock') {
        matchesStock = item.stock_quantity <= 0;
      } else if (stockFilter === 'low_stock') {
        matchesStock = item.stock_quantity > 0 && item.stock_quantity <= (item.reorder_level || 5);
      }

      return matchesSearch && matchesCategory && matchesMaterial && matchesStock;
    });
  }, [products, search, categoryFilter, materialFilter, stockFilter]);

  // Handle Sorting logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    list.sort((a, b) => {
      if (sortField === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortField === 'sku') {
        return a.sku.localeCompare(b.sku);
      }
      if (sortField === 'price') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortField === 'stock') {
        return (a.stock_quantity || 0) - (b.stock_quantity || 0);
      }
      if (sortField === 'updated') {
        return new Date(b.updated_at) - new Date(a.updated_at);
      }
      return 0;
    });
    return list;
  }, [filteredProducts, sortField]);

  // Paginated chunk
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));

  // Duplication Handler
  const handleDuplicate = async (id) => {
    setIsProcessing(true);
    try {
      await printingInventoryService.duplicateProduct(id);
      showToast("🚀 Product duplicated successfully as Draft!", "success");
      // Reload lists
      const dbProducts = await printingInventoryService.getProducts();
      setProducts(dbProducts);
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to duplicate product.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Deletion Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsProcessing(true);
    try {
      await printingInventoryService.deleteProduct(deleteTargetId);
      showToast("🗑️ Product deleted successfully.", "success");
      setProducts(prev => prev.filter(p => p.id !== deleteTargetId));
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to delete product.", "error");
    } finally {
      setIsProcessing(false);
      setDeleteTargetId(null);
    }
  };

  const getLabelForValue = (list, val) => {
    const item = list.find(x => x.key === val || x.value === val);
    return item ? item.value : val;
  };

  return (
    <div style={{ padding: 'var(--page-padding)', boxSizing: 'border-box' }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        {/* Module Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)' }}>3D Print Inventory</h1>
            <p style={{ fontSize: '13px', color: 'var(--txt-muted)', margin: '4px 0 0 0' }}>Master catalogue of 3D printing inventory and specifications.</p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.ADMIN_PRINTING_INVENTORY_ADD)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '38px', padding: '0 16px', fontWeight: '600', fontSize: '13px' }}
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>add</span>
            Add Product
          </Button>
        </div>

        {/* Dynamic Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Total Products</span>
            <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--txt-primary)' }}>
              {isLoading ? <Skeleton style={{ width: '40px', height: '28px' }} /> : kpiData.total}
            </span>
          </Card>
          <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Published Products</span>
            <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--brand-primary)' }}>
              {isLoading ? <Skeleton style={{ width: '40px', height: '28px' }} /> : kpiData.published}
            </span>
          </Card>
          <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Draft Products</span>
            <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--txt-secondary)' }}>
              {isLoading ? <Skeleton style={{ width: '40px', height: '28px' }} /> : kpiData.draft}
            </span>
          </Card>
          <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Out of Stock</span>
            <span style={{ fontSize: '28px', fontWeight: '800', color: kpiData.outOfStock > 0 ? 'var(--status-danger)' : 'var(--status-success)' }}>
              {isLoading ? <Skeleton style={{ width: '40px', height: '28px' }} /> : kpiData.outOfStock}
            </span>
          </Card>
        </div>

        {/* Data Table with Inner Toolbar */}
        <Card style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 0, padding: 0 }}>
          {/* Toolbar */}
          <AdminToolbar
            searchId="print-search"
            searchPlaceholder="Search by Name, SKU, Category, Material..."
            searchValue={search}
            onSearchChange={(e) => setSearch(e.target.value)}
            showSearchIcon
            sortValue={sortField}
            onSortChange={(e) => setSortField(e.target.value)}
            sortOptions={[
              { value: 'name', label: 'Product Name' },
              { value: 'sku', label: 'SKU' },
              { value: 'price', label: 'Price' },
              { value: 'stock', label: 'Stock Quantity' },
              { value: 'updated', label: 'Last Updated' }
            ]}
            activeFilterCount={(categoryFilter !== 'all' ? 1 : 0) + (materialFilter !== 'all' ? 1 : 0) + (stockFilter !== 'all' ? 1 : 0)}
            onReset={() => {
              setCategoryFilter('all');
              setMaterialFilter('all');
              setStockFilter('all');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', borderBottom: '1px solid var(--sys-divider)', position: 'relative', zIndex: 100 }}
          >
            {/* Drawer Custom Filter Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Category</label>
                <select
                  className="form-input"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.key} value={c.value}>{c.value}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Material</label>
                <select
                  className="form-input"
                  value={materialFilter}
                  onChange={(e) => setMaterialFilter(e.target.value)}
                >
                  <option value="all">All Materials</option>
                  {materials.map(m => (
                    <option key={m.key} value={m.value}>{m.value}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase' }}>Stock Status</label>
                <select
                  className="form-input"
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                >
                  <option value="all">All Levels</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </AdminToolbar>

          {(isLoading || sortedProducts.length > 0) && (
            <Table
            headers={[
              { label: 'Image', style: { width: '80px' } },
              'Product SKU',
              'Product Name',
              'Category',
              'Material',
              'Stock',
              'Price',
              'Visibility',
              'Last Updated',
              { label: 'Actions', style: { width: '120px', textAlign: 'right' } }
            ]}
            data={paginatedProducts}
            isLoading={isLoading}
            emptyMessage="No products found matching the criteria."
            minWidth="1000px"
            renderRow={(prod) => (
              <tr>
                {/* Image */}
                <td style={{ width: '80px' }}>
                  {prod.primary_image_url ? (
                    <img
                      src={prod.primary_image_url}
                      alt={prod.name}
                      style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', background: 'var(--sys-border)' }}
                    />
                  ) : (
                    <div style={{ width: '44px', height: '44px', borderRadius: '6px', background: 'var(--sys-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-icons-outlined" style={{ fontSize: '18px', color: 'var(--txt-muted)' }}>image</span>
                    </div>
                  )}
                </td>

                {/* SKU */}
                <td style={{ color: 'var(--txt-primary)' }}>
                  {prod.sku}
                </td>

                {/* Name */}
                <td style={{ color: 'var(--txt-primary)' }}>
                  {prod.name}
                </td>

                {/* Category */}
                <td style={{ fontSize: '12px', color: 'var(--txt-secondary)' }}>
                  {getLabelForValue(categories, prod.category)}
                </td>

                {/* Material */}
                <td style={{ fontSize: '12px', color: 'var(--txt-secondary)' }}>
                  {getLabelForValue(materials, prod.material)}
                </td>

                {/* Stock */}
                <td style={{ fontSize: '12px' }}>
                  <span style={{
                    color: prod.stock_quantity <= 0 
                      ? 'var(--status-danger)' 
                      : prod.stock_quantity <= (prod.reorder_level || 5) 
                        ? 'var(--status-warning)' 
                        : 'var(--status-success)'
                  }}>
                    {prod.stock_quantity} units
                  </span>
                </td>

                {/* Price */}
                <td style={{ color: 'var(--txt-primary)' }}>
                  {prod.contact_for_price ? (
                    <span style={{ fontSize: '11px', color: 'var(--brand-primary)', fontWeight: '700', textTransform: 'uppercase' }}>Contact</span>
                  ) : (
                    `₹${prod.price}`
                  )}
                </td>

                {/* Visibility */}
                <td>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    background: prod.visibility === 'Published' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(156, 163, 175, 0.15)',
                    color: prod.visibility === 'Published' ? 'var(--status-success)' : 'var(--txt-muted)',
                    border: prod.visibility === 'Published' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(156, 163, 175, 0.25)'
                  }}>
                    {prod.visibility}
                  </span>
                </td>

                {/* Last Updated */}
                <td style={{ fontSize: '12px', color: 'var(--txt-muted)' }}>
                  {new Date(prod.updated_at).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <Button
                      variant="ghost"
                      style={{ width: '32px', height: '32px', padding: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(ROUTES.ADMIN_PRINTING_INVENTORY_DETAILS.replace(':id', prod.id));
                      }}
                      title="View details"
                    >
                      <span className="material-icons-outlined" style={{ fontSize: '16px' }}>visibility</span>
                    </Button>
                    <Button
                      variant="ghost"
                      style={{ width: '32px', height: '32px', padding: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(ROUTES.ADMIN_PRINTING_INVENTORY_EDIT.replace(':id', prod.id));
                      }}
                      title="Edit product"
                    >
                      <span className="material-icons-outlined" style={{ fontSize: '16px' }}>edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      style={{ width: '32px', height: '32px', padding: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(prod.id);
                      }}
                      disabled={isProcessing}
                      title="Duplicate product"
                    >
                      <span className="material-icons-outlined" style={{ fontSize: '16px' }}>content_copy</span>
                    </Button>
                    <Button
                      variant="ghost"
                      style={{ width: '32px', height: '32px', padding: 0, color: 'var(--status-danger)' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTargetId(prod.id);
                      }}
                      disabled={isProcessing}
                      title="Delete product"
                    >
                      <span className="material-icons-outlined" style={{ fontSize: '16px' }}>delete</span>
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          />
        )}

          {!isLoading && sortedProducts.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--sys-divider)', background: 'var(--sys-surface-elevated)', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted, #9ca3af)' }}>
                  Showing Page {currentPage} of {totalPages || 1} ({sortedProducts.length} products found)
                </span>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted, #9ca3af)' }}>|</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted, #9ca3af)' }}>Rows per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="form-input"
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      height: '28px',
                      width: '70px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '4px',
                      color: '#fff'
                    }}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="secondary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}

          {!isLoading && sortedProducts.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--sys-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-icons-outlined" style={{ fontSize: '32px', color: 'var(--txt-muted)' }}>inventory_2</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)' }}>No Products Found</h3>
                <p style={{ fontSize: '12px', color: 'var(--txt-muted)', margin: '4px 0 0 0' }}>Try adjusting your search terms or filter configurations.</p>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('all');
                  setMaterialFilter('all');
                  setStockFilter('all');
                }}
                style={{ height: '36px', padding: '0 16px', fontSize: '12px' }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action is permanent and cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
