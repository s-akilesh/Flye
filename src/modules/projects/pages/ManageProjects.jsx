import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { AdminToolbar } from '../../../shared/components/ui/AdminToolbar';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { useToast } from '../../../shared/context/ToastContext';
import { ROUTES } from '../../../shared/constants/routes';
import { CATEGORY_LABELS } from '../constants/categories';
import { masterDataService } from '../../../shared/services/masterDataService';
import { exportProjectsToExcel, downloadProjectTemplate, parseImportedProjects, generateSlugHelper } from '../../../shared/utils/excel.js';

export const ManageProjects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { allProjects, isLoading, duplicateProject, deleteProject, updateProject, addProject, refreshProjects } = useProjects();
  const { showToast } = useToast();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [departmentFilters, setDepartmentFilters] = useState([]);
  const [statusFilters, setStatusFilters] = useState([]);
  const [sortField, setSortField] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilters, difficultyFilter, departmentFilters, statusFilters, sortField]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Staging filters states
  const [stagedCategoryFilters, setStagedCategoryFilters] = useState([]);
  const [stagedDifficultyFilter, setStagedDifficultyFilter] = useState('all');
  const [stagedDepartmentFilters, setStagedDepartmentFilters] = useState([]);
  const [stagedStatusFilters, setStagedStatusFilters] = useState([]);

  const [dbCategories, setDbCategories] = useState([]);
  const [dbDepartments, setDbDepartments] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await masterDataService.getValues('project_category');
        setDbCategories(cats);
        const depts = await masterDataService.getValues('department');
        setDbDepartments(depts);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenuId(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleMenuToggle = (e, projId) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === projId ? null : projId));
  };

  const toggleCategoryFilter = (cat) => {
    if (cat === 'all') {
      setStagedCategoryFilters([]);
    } else {
      setStagedCategoryFilters((prev) =>
        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
      );
    }
  };

  const toggleDepartmentFilter = (dept) => {
    if (dept === 'all') {
      setStagedDepartmentFilters([]);
    } else {
      setStagedDepartmentFilters((prev) =>
        prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
      );
    }
  };

  const toggleStatusFilter = (st) => {
    if (st === 'all') {
      setStagedStatusFilters([]);
    } else {
      setStagedStatusFilters((prev) =>
        prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
      );
    }
  };

  const handleApplyFilters = () => {
    setCategoryFilters([...stagedCategoryFilters]);
    setDifficultyFilter(stagedDifficultyFilter);
    setDepartmentFilters([...stagedDepartmentFilters]);
    setStatusFilters([...stagedStatusFilters]);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategoryFilters([]);
    setDifficultyFilter('all');
    setDepartmentFilters([]);
    setStatusFilters([]);
    setStagedCategoryFilters([]);
    setStagedDifficultyFilter('all');
    setStagedDepartmentFilters([]);
    setStatusFilters([]);
    setSortField('title');
  };

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Deletion Modal State
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectToClone, setProjectToClone] = useState(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Export Confirmation State
  const [showExportAllConfirm, setShowExportAllConfirm] = useState(false);
  const [showExportScopeConfirm, setShowExportScopeConfirm] = useState(false);
  const [exportScope, setExportScope] = useState('selected');

  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);

  // Excel Import & Export States
  const fileInputRef = useRef(null);
  const [importPreview, setImportPreview] = useState(null);
  const [showImportUploadModal, setShowImportUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleExportProjects = () => {
    if (selectedIds.length === 0) {
      setShowExportAllConfirm(true);
    } else {
      setExportScope('selected');
      setShowExportScopeConfirm(true);
    }
  };

  const handleDownloadTemplate = () => {
    downloadProjectTemplate();
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processImportFile = (file) => {
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const XLSX = await import('xlsx');
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (workbook.SheetNames.length === 0) {
          showToast("❌ Excel workbook is empty.", "error");
          setIsProcessing(false);
          return;
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Safety limit check
        if (jsonData.length > 100) {
          showToast("❌ Maximum upload limit exceeded. Please limit your file to 100 rows.", "error");
          setIsProcessing(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        if (jsonData.length === 0) {
          showToast("❌ No rows found in the spreadsheet.", "error");
          setIsProcessing(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        const normalizedRows = parseImportedProjects(jsonData);

        const validRows = [];
        const invalidRows = [];
        const errors = [];

        normalizedRows.forEach((row) => {
          const rowErrors = [];

          if (!row.title || row.title.trim() === '') {
            rowErrors.push("Missing Title");
          }
          if (!row.description || row.description.trim() === '') {
            rowErrors.push("Missing Description");
          }

          // Validate slug uniqueness
          const computedSlug = row.slug || (row.title ? generateSlugHelper(row.title) : '');
          
          if (computedSlug) {
            const slugExistsInDB = allProjects.some((p) => p.slug === computedSlug);
            const slugExistsInBatch = validRows.some((vr) => vr.slug === computedSlug);

            if (slugExistsInDB) {
              rowErrors.push(`Duplicate slug '${computedSlug}' (already exists in database)`);
            } else if (slugExistsInBatch) {
              rowErrors.push(`Duplicate slug '${computedSlug}' (exists elsewhere in import file)`);
            }
          } else {
            rowErrors.push("Unable to generate valid slug from title");
          }

          if (rowErrors.length > 0) {
            invalidRows.push({ ...row, errors: rowErrors });
            errors.push(`Row ${row.rowIndex}: ${rowErrors.join(', ')}`);
          } else {
            validRows.push({ ...row, slug: computedSlug });
          }
        });

        setImportPreview({
          total: jsonData.length,
          valid: validRows,
          invalid: invalidRows,
          errors
        });
        setShowImportUploadModal(false);
      } catch (err) {
        showToast("❌ Failed to parse Excel file.", "error");
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportProjects = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImportFile(file);
    }
  };

  const handleConfirmImport = async () => {
    if (!importPreview || importPreview.valid.length === 0) return;

    setIsProcessing(true);
    let successCount = 0;
    let failCount = 0;
    const finalErrors = [...importPreview.errors];

    for (const row of importPreview.valid) {
      const payload = {
        title: row.title,
        description: row.description,
        fullDescription: row.fullDescription || '',
        price: row.price,
        currency: row.currency,
        projectLevel: row.projectLevel,
        difficulty: row.difficulty,
        technology: row.technology,
        category: row.category,
        buildTime: row.buildTime,
        features: row.features,
        badge: row.badge,
        searchKeywords: row.searchKeywords,
        images: {
          main: 'src/assets/projects/smart-home/main.svg',
          schematic: 'src/assets/projects/smart-home/schematic.svg',
          circuit: 'src/assets/projects/smart-home/circuit.svg'
        },
        videoUrl: row.videoUrl || '',
        resources: row.resources,
        components: row.components,
        specifications: row.specifications,
        relatedProjects: [],
        stockStatus: row.stockStatus,
        featured: row.featured,
        status: row.status,
        howItWorks: row.howItWorks,
        applications: row.applications,
        benefits: row.benefits,
        estimatedDelivery: row.estimatedDelivery,
        whatsappNumber: row.whatsappNumber,
        slug: row.slug
      };

      try {
        await addProject(payload);
        successCount++;
      } catch (err) {
        failCount++;
        finalErrors.push(`Row ${row.rowIndex}: Database save failed (${err.message || err})`);
      }
    }

    showToast(`✅ Successfully imported ${successCount} projects!${failCount > 0 ? ` ${failCount} failed.` : ''}`, successCount > 0 ? 'success' : 'error');
    
    if (refreshProjects) await refreshProjects();

    setImportPreview(null);
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCancelImport = () => {
    setImportPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Consume redirect toast messages from react-router-dom state
  useEffect(() => {
    if (location.state?.toastMessage) {
      showToast(location.state.toastMessage, location.state.toastType || 'success');
      window.history.replaceState({}, document.title);
    }
  }, [location, showToast]);

  // Duplicate Action Handler
  const handleCloneConfirm = async () => {
    if (!projectToClone) return;
    setIsProcessing(true);
    try {
      const duplicated = await duplicateProject(projectToClone.id);
      showToast(`✅ Project duplicated successfully! Created copy: "${duplicated.title}"`, 'success');
      setProjectToClone(null);
    } catch (e) {
      showToast("❌ Failed to duplicate project.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete Action Handler
  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setIsProcessing(true);
    try {
      await deleteProject(projectToDelete.id);
      setSelectedIds((prev) => prev.filter((id) => id !== projectToDelete.id));
      showToast(`✅ Project "${projectToDelete.title}" deleted successfully!`, 'success');
      setProjectToDelete(null);
    } catch (e) {
      showToast("❌ Failed to delete project.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(sortedList.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) {
      showToast("⚠️ No projects selected.", "info");
      return;
    }

    if (action === 'delete') {
      setShowBulkDeleteConfirm(true);
      return;
    }

    await executeBulkAction(action);
  };

  const executeBulkAction = async (action) => {
    setIsProcessing(true);
    try {
      if (action === 'delete') {
        for (const id of selectedIds) {
          await deleteProject(id);
        }
        showToast("✅ Selected projects deleted successfully.", "success");
      } else if (action === 'activate') {
        for (const id of selectedIds) {
          await updateProject(id, { status: 'active' });
        }
        showToast("✅ Selected projects activated successfully.", "success");
      } else if (action === 'archive') {
        for (const id of selectedIds) {
          await updateProject(id, { status: 'archived' });
        }
        showToast("✅ Selected projects archived successfully.", "success");
      } else if (action === 'draft') {
        for (const id of selectedIds) {
          await updateProject(id, { status: 'draft' });
        }
        showToast("✅ Selected projects set to Draft successfully.", "success");
      } else if (action === 'coming-soon') {
        for (const id of selectedIds) {
          await updateProject(id, { status: 'coming-soon' });
        }
        showToast("✅ Selected projects set to Coming Soon successfully.", "success");
      }
      setSelectedIds([]);
    } catch (e) {
      showToast(`❌ Failed to perform bulk action: ${action}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter & Sort Logic
  const filteredList = allProjects.filter((proj) => {
    // 1. Search Query
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const matchesTitle = proj.title.toLowerCase().includes(q);
      const matchesTech = proj.technology && proj.technology.toLowerCase().includes(q);
      const matchesKeywords = proj.searchKeywords && proj.searchKeywords.some((kw) => kw.toLowerCase().includes(q));
      if (!matchesTitle && !matchesTech && !matchesKeywords) return false;
    }
    // 2. Category
    if (categoryFilters.length > 0) {
      if (!proj.category) return false;
      const projCats = proj.category.split(',').map(c => c.trim().toLowerCase());
      const filterKeys = categoryFilters.map(f => f.trim().toLowerCase());
      const hasMatch = projCats.some(c => filterKeys.includes(c));
      if (!hasMatch) return false;
    }
    // 3. Difficulty
    if (difficultyFilter !== 'all' && proj.difficulty !== difficultyFilter) return false;
    // 4. Department
    if (departmentFilters.length > 0) {
      if (!proj.department) return false;
      const projDepts = proj.department.split(',').map(d => d.trim().toLowerCase());
      const filterKeys = departmentFilters.map(d => d.trim().toLowerCase());
      const hasMatch = projDepts.some(d => filterKeys.includes(d));
      if (!hasMatch) return false;
    }
    // 5. Status
    if (statusFilters.length > 0 && !statusFilters.includes(proj.status)) return false;

    return true;
  });

  // Sorting
  const sortedList = [...filteredList].sort((a, b) => {
    if (sortField === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortField === 'price-low') {
      return a.price - b.price;
    } else if (sortField === 'price-high') {
      return b.price - a.price;
    } else if (sortField === 'level') {
      return a.projectLevel.localeCompare(b.projectLevel);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedList.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedList.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedList, currentPage, itemsPerPage]);

  return (
    <motion.section
      id="manage-projects-portal"
      className="portal-section page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden' }}
    >
      {/* Mobile Sticky Sub-Header */}
      <header className="mobile-learning-header">
        <span className="mobile-learning-title" style={{ fontSize: '14px', fontWeight: '800', color: '#fff', textTransform: 'uppercase' }}>
          Manage Projects
        </span>
        
        {/* Mobile Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Add Button */}
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.ADMIN_ADD_PROJECT)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span className="material-icons" style={{ fontSize: '16px' }}>add</span>
            Add
          </Button>

          {/* 3-Dot Menu Trigger */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(p => !p)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <span className="material-icons" style={{ fontSize: '18px' }}>more_vert</span>
            </button>

            {mobileMenuOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setMobileMenuOpen(false)} />
                <div 
                  className="card-glass"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '150px',
                    zIndex: 1000,
                    padding: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => { setShowImportUploadModal(true); setMobileMenuOpen(false); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      padding: '8px 12px',
                      fontSize: '13px',
                      textAlign: 'left',
                      width: '100%',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                  >
                    <span className="material-icons-outlined" style={{ fontSize: '16px' }}>download</span>
                    Import
                  </button>
                  <button
                    type="button"
                    onClick={() => { handleExportProjects(); setMobileMenuOpen(false); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      padding: '8px 12px',
                      fontSize: '13px',
                      textAlign: 'left',
                      width: '100%',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                  >
                    <span className="material-icons-outlined" style={{ fontSize: '16px' }}>upload</span>
                    Export
                  </button>

                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="portal-header">
        <div className="portal-title-area">
          <h2>Manage Projects</h2>
          <p>Visual database management panel for Flyen engineering catalog</p>
        </div>
        <div className="portal-header-meta" style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx, .xls"
            onChange={handleImportProjects}
            style={{ display: 'none' }}
          />
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.ADMIN_ADD_PROJECT)}
            id="btn-admin-add-kit"
            disabled={isProcessing}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            Add Project
          </Button>
        </div>
      </div>

      <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', flex: 1, minHeight: 0 }}>
        {/* KPI Cards — 2-column grid */}
        <div className="admin-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <Card style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Projects</span>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-blue)', margin: 'var(--space-2) 0 0 0' }}>{allProjects.length}</h3>
          </Card>
          <Card style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Projects</span>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-emerald)', margin: 'var(--space-2) 0 0 0' }}>{allProjects.filter(p => p.status === 'active').length}</h3>
          </Card>
          <Card style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Draft Projects</span>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-violet)', margin: 'var(--space-2) 0 0 0' }}>{allProjects.filter(p => p.status === 'draft').length}</h3>
          </Card>
          <Card style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Featured Projects</span>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-amber)', margin: 'var(--space-2) 0 0 0' }}>{allProjects.filter(p => p.featured).length}</h3>
          </Card>
        </div>

        {/* Tabular Visual Grid Container Card */}
        <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 0, overflow: 'hidden', flex: 1, minHeight: 0, background: 'rgba(10, 10, 15, 0.25)' }}>
          {/* Toolbar: Search + Filter Icon + Sort Icon */}
          <AdminToolbar
            searchId="admin-search"
            searchLabel="Search Projects"
            searchPlaceholder="Title, technology, tags..."
            searchValue={search}
            onSearchChange={(e) => setSearch(e.target.value)}
            activeFilterCount={
              categoryFilters.length +
              (difficultyFilter !== 'all' ? 1 : 0) +
              departmentFilters.length +
              statusFilters.length
            }
            sortValue={sortField}
            onSortChange={(e) => setSortField(e.target.value)}
            sortOptions={[
              { value: 'title', label: 'Title (A–Z)' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'level', label: 'Project Level' },
            ]}
            onReset={handleResetFilters}
            onApply={handleApplyFilters}
            className="admin-toolbar-wrapper"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', position: 'relative', zIndex: 100 }}
            desktopActions={
              <>

                <Button
                  variant="secondary"
                  onClick={handleExportProjects}
                  disabled={isProcessing}
                  style={{ fontSize: '12px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0 12px' }}
                >
                  <span className="material-icons-outlined" style={{ fontSize: '16px' }}>upload</span> Export
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowImportUploadModal(true)}
                  disabled={isProcessing}
                  style={{ fontSize: '12px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0 12px' }}
                >
                  <span className="material-icons-outlined" style={{ fontSize: '16px' }}>download</span> Import
                </Button>
              </>
            }
          >
            {/* Filter panel content */}
            <div className="admin-filter-panel-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="calc-row">
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Categories</label>
                <div className="admin-chip-group">
                  <button
                    type="button"
                    onClick={() => toggleCategoryFilter('all')}
                    className={`admin-chip ${stagedCategoryFilters.length === 0 ? 'active' : ''}`}
                  >
                    All
                  </button>
                  {dbCategories.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleCategoryFilter(item.value)}
                      className={`admin-chip ${stagedCategoryFilters.includes(item.value) ? 'active' : ''}`}
                    >
                      {item.value}
                    </button>
                  ))}
                </div>
              </div>
              <div className="calc-row">
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Departments</label>
                <div className="admin-chip-group">
                  <button
                    type="button"
                    onClick={() => toggleDepartmentFilter('all')}
                    className={`admin-chip ${stagedDepartmentFilters.length === 0 ? 'active' : ''}`}
                  >
                    All
                  </button>
                  {dbDepartments.map((dept) => (
                    <button
                      key={dept.key}
                      type="button"
                      onClick={() => toggleDepartmentFilter(dept.value)}
                      className={`admin-chip ${stagedDepartmentFilters.includes(dept.value) ? 'active' : ''}`}
                    >
                      {dept.value}
                    </button>
                  ))}
                </div>
              </div>
              <div className="calc-row">
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</label>
                <div className="admin-chip-group">
                  <button
                    type="button"
                    onClick={() => toggleStatusFilter('all')}
                    className={`admin-chip ${stagedStatusFilters.length === 0 ? 'active' : ''}`}
                  >
                    All
                  </button>
                  {[['active', 'Active'], ['draft', 'Draft'], ['coming-soon', 'Coming Soon'], ['archived', 'Archived']].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleStatusFilter(key)}
                      className={`admin-chip ${stagedStatusFilters.includes(key) ? 'active' : ''}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </AdminToolbar>

          {/* Bulk Actions Banner */}
          {selectedIds.length > 0 && (
            <div style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--accent-violet)', background: 'rgba(124, 58, 237, 0.05)' }}>
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>
                Selected <strong style={{ color: 'var(--accent-violet)' }}>{selectedIds.length}</strong> project(s)
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleBulkAction('activate')}
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  disabled={isProcessing}
                >
                  Activate
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleBulkAction('draft')}
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  disabled={isProcessing}
                >
                  Draft
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleBulkAction('coming-soon')}
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  disabled={isProcessing}
                >
                  Coming Soon
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleBulkAction('archive')}
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  disabled={isProcessing}
                >
                  Archive
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleBulkAction('delete')}
                  style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-crimson, #ef4444)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                  disabled={isProcessing}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Conditional Table or Empty State rendering */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <h3>Loading database records...</h3>
            </div>
          ) : sortedList.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto', overflowY: 'auto', padding: 'var(--space-4)', flex: 1, minHeight: 0 }}>
              <table style={{ width: '100%', minWidth: 'max-content', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: 'var(--space-3) var(--space-2)', width: '36px', minWidth: '36px' }}>
                      <input
                        type="checkbox"
                        checked={sortedList.length > 0 && selectedIds.length === sortedList.length}
                        onChange={handleSelectAll}
                        style={{ cursor: 'pointer' }}
                      />
                    </th>
                    <th style={{ padding: 'var(--space-3) var(--space-3)', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '220px' }}>
                      Project Name
                    </th>
                    <th style={{ padding: 'var(--space-3) var(--space-3)', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '110px' }}>
                      Pricing
                    </th>
                    <th style={{ padding: 'var(--space-3) var(--space-3)', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '100px' }}>
                      Status
                    </th>
                    <th style={{ padding: 'var(--space-3) var(--space-3)', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '110px' }}>
                      Updated At
                    </th>
                    <th style={{ padding: 'var(--space-3) var(--space-3)', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '220px', textAlign: 'right' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProjects.map((proj) => {
                    const isSelected = selectedIds.includes(proj.id);
                    const mainPrice = proj.variants && proj.variants.length > 0
                      ? Math.min(...proj.variants.filter(v => v.enabled).map(v => v.price))
                      : proj.price;

                    return (
                      <tr 
                        key={proj.id} 
                        style={{ 
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          background: isSelected ? 'rgba(139, 92, 246, 0.04)' : 'transparent',
                          transition: 'background 0.2s ease'
                        }}
                        className="table-row-hover"
                      >
                        <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(proj.id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                        <td className="tbl-td" style={{ minWidth: '220px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff', display: 'block' }} className="tbl-line-clamp-1">
                              {proj.title}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }} className="tbl-line-clamp-1">
                              {proj.technology || 'Arduino'}
                            </span>
                          </div>
                        </td>

                        <td className="tbl-td" style={{ minWidth: '110px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-emerald, #10b981)' }}>
                            {proj.currency === 'INR' ? '₹' : '$'}{mainPrice}
                          </span>
                          {proj.variants && proj.variants.length > 1 && (
                            <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>
                              {proj.variants.length} options
                            </span>
                          )}
                        </td>
                        <td className="tbl-td" style={{ minWidth: '100px' }}>
                          {proj.status === 'active' ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-emerald, #10b981)', textTransform: 'uppercase' }}>
                              Active
                            </span>
                          ) : proj.status === 'draft' ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                              Draft
                            </span>
                          ) : proj.status === 'coming-soon' ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '12px', background: 'rgba(234,179,8,0.1)', color: '#eab308', textTransform: 'uppercase' }}>
                              Soon
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: 'var(--accent-crimson, #ef4444)', textTransform: 'uppercase' }}>
                              Archived
                            </span>
                          )}
                        </td>
                        <td className="tbl-td tbl-truncate" style={{ minWidth: '110px', maxWidth: '140px', color: 'var(--text-muted)' }}>
                          {proj.lastUpdated}
                        </td>
                        <td className="tbl-td" style={{ minWidth: '220px', maxWidth: '240px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => navigate(ROUTES.PROJECT_DETAILS.replace(':slug', proj.slug))}
                              style={{ width: '36px', height: '36px', minWidth: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="View Project"
                            >
                              <span className="material-icons-outlined" style={{ fontSize: '16px' }}>visibility</span>
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => navigate(ROUTES.ADMIN_EDIT_PROJECT.replace(':slug', proj.slug))}
                              style={{ width: '36px', height: '36px', minWidth: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Edit Project"
                            >
                              <span className="material-icons-outlined" style={{ fontSize: '16px' }}>edit</span>
                            </Button>
                            {/* 3-dot dropdown menu */}
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={(e) => handleMenuToggle(e, proj.id)}
                                style={{ width: '36px', height: '36px', minWidth: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="More Actions"
                                disabled={isProcessing}
                              >
                                <span className="material-icons-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                              </Button>
                              {activeMenuId === proj.id && (
                                <div
                                  className="admin-icon-panel"
                                  style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 4px)',
                                    right: 0,
                                    minWidth: '130px',
                                    padding: 'var(--space-1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px',
                                    background: '#0b0a10',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    zIndex: 100
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    className="admin-sort-option"
                                    onClick={() => {
                                      setProjectToClone(proj);
                                      setActiveMenuId(null);
                                    }}
                                    style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: 'none', background: 'none', color: '#fff', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                                  >
                                    <span className="material-icons-outlined" style={{ fontSize: '16px', color: 'var(--accent-blue)' }}>content_copy</span>
                                    <span>Clone</span>
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-sort-option"
                                    onClick={() => {
                                      setProjectToDelete(proj);
                                      setActiveMenuId(null);
                                    }}
                                    style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: 'none', background: 'none', color: '#ef4444', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                                  >
                                    <span className="material-icons-outlined" style={{ fontSize: '16px', color: '#ef4444' }}>delete</span>
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255, 255, 255, 0.01)', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted, #9ca3af)' }}>
                  Showing Page {currentPage} of {totalPages || 1} ({sortedList.length} projects found)
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
          </>
        ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <h3>No management records match your filters</h3>
              <p style={{ marginTop: 'var(--space-2)', color: 'var(--text-muted)' }}>
                Try adjusting your search queries or category filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={projectToDelete !== null}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project Kit"
        message={projectToDelete ? `Are you sure you want to permanently delete "${projectToDelete.title}"? This operation cannot be undone.` : ''}
        confirmLabel="Delete"
        isDanger={true}
        isLoading={isProcessing}
      />

      {/* Clone Confirmation Dialog */}
      <ConfirmDialog
        isOpen={projectToClone !== null}
        onClose={() => setProjectToClone(null)}
        onConfirm={handleCloneConfirm}
        title="Clone Project Kit"
        message={projectToClone ? `Are you sure you want to duplicate "${projectToClone.title}"?` : ''}
        confirmLabel="Clone"
        isLoading={isProcessing}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={() => {
          executeBulkAction('delete');
          setShowBulkDeleteConfirm(false);
        }}
        title="Delete Selected Records"
        message={`Are you sure you want to permanently delete the ${selectedIds.length} selected project(s)? This operation cannot be undone.`}
        confirmLabel="Delete"
        isDanger={true}
        isLoading={isProcessing}
      />

      {/* Export All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showExportAllConfirm}
        onClose={() => setShowExportAllConfirm(false)}
        onConfirm={() => {
          exportProjectsToExcel(allProjects);
          showToast("✅ All projects exported successfully!", "success");
          setShowExportAllConfirm(false);
        }}
        title="Export All Records"
        message="Are you sure you want to export all records?"
        confirmLabel="Export"
      />

      {/* Export Scope Choice Dialog */}
      <ConfirmDialog
        isOpen={showExportScopeConfirm}
        onClose={() => setShowExportScopeConfirm(false)}
        onConfirm={() => {
          if (exportScope === 'selected') {
            const selected = allProjects.filter(p => selectedIds.includes(p.id));
            exportProjectsToExcel(selected);
            showToast(`✅ Exported ${selected.length} selected project(s)!`, "success");
          } else {
            exportProjectsToExcel(allProjects);
            showToast("✅ Exported all projects!", "success");
          }
          setShowExportScopeConfirm(false);
        }}
        title="Export Projects"
        message={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <p style={{ margin: 0 }}>Choose export scope:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="exportScope"
                  value="selected"
                  checked={exportScope === 'selected'}
                  onChange={() => setExportScope('selected')}
                />
                <span>Export selected records ({selectedIds.length})</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="exportScope"
                  value="all"
                  checked={exportScope === 'all'}
                  onChange={() => setExportScope('all')}
                />
                <span>Export all records ({allProjects.length})</span>
              </label>
            </div>
          </div>
        }
        confirmLabel="Continue"
      />

      {/* Import Preview Modal */}
      {importPreview && (
        <Modal isOpen={importPreview !== null} onClose={handleCancelImport} style={{ maxWidth: '600px' }}>
          <div style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: 'var(--space-4)', color: 'var(--accent-violet)' }}>
              📊 Excel Import Preview
            </h3>
            
            <div 
              className="card-glass" 
              style={{ 
                padding: 'var(--space-4)', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: 'var(--space-3)', 
                textAlign: 'center', 
                marginBottom: 'var(--space-5)' 
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Total Rows</span>
                <strong style={{ fontSize: '20px', color: '#fff' }}>{importPreview.total}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Valid Rows</span>
                <strong style={{ fontSize: '20px', color: 'var(--accent-emerald)' }}>{importPreview.valid.length}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Invalid Rows</span>
                <strong style={{ fontSize: '20px', color: importPreview.invalid.length > 0 ? 'var(--accent-crimson, #ef4444)' : 'var(--text-muted)' }}>
                  {importPreview.invalid.length}
                </strong>
              </div>
            </div>

            {/* Validation Errors Console */}
            {importPreview.errors && importPreview.errors.length > 0 && (
              <div 
                style={{ 
                  textAlign: 'left', 
                  maxHeight: '180px', 
                  overflowY: 'auto', 
                  background: 'rgba(239, 68, 68, 0.04)', 
                  border: '1px solid rgba(239, 68, 68, 0.15)', 
                  borderRadius: '6px', 
                  padding: 'var(--space-3)', 
                  marginBottom: 'var(--space-5)' 
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-crimson, #ef4444)', display: 'block', marginBottom: 'var(--space-2)' }}>
                  Validation Errors Encountered:
                </span>
                <ul style={{ fontSize: '11px', color: 'var(--text-muted)', listStyle: 'disc', paddingLeft: 'var(--space-4)', margin: 0 }}>
                  {importPreview.errors.map((err, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {importPreview.valid.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 'var(--space-5)' }}>
                No valid rows found to import. Please correct the validation errors in your spreadsheet and try again.
              </p>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 'var(--space-5)' }}>
                Click **Confirm Import** to save the {importPreview.valid.length} valid project kit(s) to the database. Invalid rows will be skipped.
              </p>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button 
                variant="secondary" 
                onClick={handleCancelImport} 
                style={{ flex: 1 }}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                className="btn-submit-calc"
                onClick={handleConfirmImport} 
                style={{ flex: 1 }}
                disabled={isProcessing || importPreview.valid.length === 0}
              >
                {isProcessing ? 'Importing...' : `Confirm Import (${importPreview.valid.length})`}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Import File Upload Modal */}
      <Modal 
        isOpen={showImportUploadModal} 
        onClose={() => setShowImportUploadModal(false)} 
        style={{ maxWidth: '500px' }}
      >
        <div style={{ textAlign: 'left', padding: 'var(--space-2)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: 'var(--space-2)', color: 'var(--accent-violet)' }}>
            Import Projects
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
            Upload spreadsheet templates to add project kits in bulk.
          </p>

          {/* Section 1: Download import template */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Section 1: Download Import Template
            </span>
            <div 
              onClick={handleDownloadTemplate}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'var(--accent-violet)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                background: 'rgba(124, 58, 237, 0.1)',
                color: 'var(--accent-violet)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span className="material-icons-outlined" style={{ fontSize: '20px' }}>description</span>
              </div>
              <div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff', display: 'block' }}>
                  Download the import template
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Use this template file to format your project kit records correctly.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Drop your file or select your file */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Section 2: Upload Data File
            </span>
            <div
              onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  processImportFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={triggerFileInput}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 16px',
                borderRadius: '8px',
                background: dragActive ? 'rgba(124, 58, 237, 0.05)' : 'rgba(0, 0, 0, 0.15)',
                border: `2px dashed ${dragActive ? 'var(--accent-violet)' : 'rgba(255, 255, 255, 0.1)'}`,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'background 0.2s, border-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!dragActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!dragActive) {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              <span className="material-icons-outlined" style={{ fontSize: '36px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                cloud_upload
              </span>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#fff', display: 'block', marginBottom: '4px' }}>
                Drop your file or select your file
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Supports Excel (.xlsx, .xls) files up to 100 rows
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="secondary" onClick={() => setShowImportUploadModal(false)} style={{ width: '100px' }}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </motion.section>
  );
};
