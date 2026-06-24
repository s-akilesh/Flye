import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { AdminToolbar } from '../components/ui/AdminToolbar';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { ROUTES } from '../constants/routes';
import { CATEGORY_LABELS } from '../constants/categories';
import { exportProjectsToExcel, downloadProjectTemplate, parseImportedProjects, generateSlugHelper } from '../utils/excel.js';

export const ManageProjects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { allProjects, isLoading, duplicateProject, deleteProject, updateProject, addProject, refreshProjects } = useProjects();
  const { showToast } = useToast();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('title');

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Deletion Modal State
  const [projectToDelete, setProjectToDelete] = useState(null);
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

  const handleImportProjects = (e) => {
    const file = e.target.files[0];
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
      } catch (err) {
        showToast("❌ Failed to parse Excel file.", "error");
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
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
  const handleDuplicate = async (id) => {
    setIsProcessing(true);
    try {
      const duplicated = await duplicateProject(id);
      showToast(`✅ Project duplicated successfully! Created copy: "${duplicated.title}"`, 'success');
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
    if (categoryFilter !== 'all' && proj.category !== categoryFilter) return false;
    // 3. Difficulty
    if (difficultyFilter !== 'all' && proj.difficulty !== difficultyFilter) return false;
    // 4. Project Level
    if (levelFilter !== 'all' && proj.projectLevel !== levelFilter) return false;
    // 5. Status
    if (statusFilter !== 'all' && proj.status !== statusFilter) return false;

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

  return (
    <motion.section
      className="portal-section page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
    >
      <div className="portal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button variant="secondary" className="btn-back" onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)} style={{ padding: '8px', minWidth: 'auto' }}>
            <svg viewBox="0 0 24 24">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
            </svg>
          </Button>
          <div className="portal-title-area">
            <h2>Project Catalog Management</h2>
            <p>Visual database management panel for Flyen engineering catalog</p>
          </div>
        </div>
        <div className="portal-header-meta" style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            onClick={handleDownloadTemplate}
            disabled={isProcessing}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            📥 Template
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportProjects}
            disabled={isProcessing}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            📤 Export Excel
          </Button>
          <Button
            variant="secondary"
            onClick={triggerFileInput}
            disabled={isProcessing}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            📁 Import Excel
          </Button>
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
            + Add New Kit
          </Button>
        </div>
      </div>

      <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* KPI Cards — 2-column grid */}
        <div className="admin-kpi-grid">
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

        {/* Toolbar: Search + Filter Icon + Sort Icon */}
        <AdminToolbar
          searchId="admin-search"
          searchLabel="Search Projects"
          searchPlaceholder="Title, technology, tags..."
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          activeFilterCount={
            (categoryFilter !== 'all' ? 1 : 0) +
            (levelFilter !== 'all' ? 1 : 0) +
            (statusFilter !== 'all' ? 1 : 0)
          }
          sortValue={sortField}
          onSortChange={(e) => setSortField(e.target.value)}
          sortOptions={[
            { value: 'title', label: 'Title (A–Z)' },
            { value: 'price-low', label: 'Price: Low to High' },
            { value: 'price-high', label: 'Price: High to Low' },
            { value: 'level', label: 'Project Level' },
          ]}
          onReset={() => {
            setSearch('');
            setCategoryFilter('all');
            setLevelFilter('all');
            setStatusFilter('all');
            setSortField('title');
          }}
        >
          {/* Filter panel content */}
          <div className="admin-filter-panel-grid">
            <div className="calc-row">
              <label htmlFor="admin-cat">Category</label>
              <select id="admin-cat" className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="calc-row">
              <label htmlFor="admin-level">Level</label>
              <select id="admin-level" className="form-select" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                <option value="all">All Levels</option>
                <option value="School">School</option>
                <option value="Diploma">Diploma</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>
            <div className="calc-row">
              <label htmlFor="admin-status">Status</label>
              <select id="admin-status" className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="coming-soon">Coming Soon</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </AdminToolbar>

        {/* Tabular Visual Grid */}
        {/* Bulk Actions Banner */}
        {selectedIds.length > 0 && (
          <div className="card-glass" style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--accent-violet)', background: 'rgba(124, 58, 237, 0.05)' }}>
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
                🟢 Activate
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleBulkAction('archive')}
                style={{ padding: '6px 12px', fontSize: '12px' }}
                disabled={isProcessing}
              >
                🔴 Archive
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleBulkAction('delete')}
                style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-crimson, #ef4444)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                disabled={isProcessing}
              >
                🗑 Delete
              </Button>
            </div>
          </div>
        )}

        {/* Tabular Visual Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <h3>Loading database records...</h3>
          </div>
        ) : sortedList.length > 0 ? (
          <div className="card-glass" style={{ overflowX: 'auto', padding: 'var(--space-4)' }}>
            <table style={{ width: '100%', minWidth: 'max-content', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', width: '36px', minWidth: '36px' }}>
                    <input
                      type="checkbox"
                      className="tbl-checkbox"
                      checked={sortedList.length > 0 && selectedIds.length === sortedList.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="tbl-th" style={{ minWidth: '160px', maxWidth: '220px' }}>Project Name</th>
                  <th className="tbl-th" style={{ minWidth: '100px', maxWidth: '140px' }}>Category</th>
                  <th className="tbl-th" style={{ minWidth: '100px', maxWidth: '130px' }}>Level</th>
                  <th className="tbl-th" style={{ minWidth: '110px', maxWidth: '140px' }}>Difficulty</th>
                  <th className="tbl-th" style={{ minWidth: '80px',  maxWidth: '100px' }}>Price</th>
                  <th className="tbl-th" style={{ minWidth: '110px', maxWidth: '140px' }}>Status</th>
                  <th className="tbl-th" style={{ minWidth: '70px',  maxWidth: '90px'  }}>Featured</th>
                  <th className="tbl-th" style={{ minWidth: '110px', maxWidth: '140px' }}>Last Updated</th>
                  <th className="tbl-th" style={{ minWidth: '220px', maxWidth: '240px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedList.map((proj) => {
                  const statusColors = {
                    active: 'var(--accent-emerald)',
                    draft: '#eab308',
                    'coming-soon': 'var(--accent-blue)',
                    archived: 'var(--accent-crimson, #ef4444)'
                  };

                  return (
                    <tr
                      key={proj.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="tbl-td tbl-cb-cell">
                        <input
                          type="checkbox"
                          className="tbl-checkbox"
                          checked={selectedIds.includes(proj.id)}
                          onChange={() => handleSelectOne(proj.id)}
                        />
                      </td>
                      <td className="tbl-td" style={{ minWidth: '160px', maxWidth: '220px' }}>
                        <div className="tbl-line-clamp-1" style={{ fontWeight: '600', color: '#fff', fontSize: '13px' }}>{proj.title}</div>
                        <div className="tbl-line-clamp-1" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>slug: {proj.slug}</div>
                      </td>
                      <td className="tbl-td tbl-truncate" style={{ minWidth: '100px', maxWidth: '140px', textTransform: 'capitalize' }}>
                        {proj.category}
                      </td>
                      <td className="tbl-td tbl-truncate" style={{ minWidth: '100px', maxWidth: '130px' }}>
                        {proj.projectLevel}
                      </td>
                      <td className="tbl-td" style={{ minWidth: '110px', maxWidth: '140px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: proj.difficulty === 'beginner' ? 'var(--accent-emerald)' : proj.difficulty === 'intermediate' ? 'var(--accent-amber)' : 'var(--accent-crimson, #ef4444)',
                              display: 'inline-block'
                            }}
                          />
                          {proj.difficulty.toUpperCase()}
                        </span>
                      </td>
                      <td className="tbl-td tbl-truncate" style={{ minWidth: '80px', maxWidth: '100px', fontWeight: '600', color: 'var(--text-main)' }}>
                        ₹{proj.price}
                      </td>
                      <td className="tbl-td" style={{ minWidth: '110px', maxWidth: '140px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            background: 'rgba(255,255,255,0.02)',
                            border: `1px solid ${statusColors[proj.status] || 'gray'}`,
                            color: statusColors[proj.status] || 'white'
                          }}
                        >
                          <span style={{ fontSize: '10px' }}>
                            {proj.status === 'active' ? '🟢' : proj.status === 'draft' ? '🟡' : proj.status === 'coming-soon' ? '🔵' : '🔴'}
                          </span>
                          {proj.status === 'coming-soon' ? 'COMING SOON' : proj.status}
                        </span>
                      </td>
                      <td className="tbl-td" style={{ minWidth: '70px', maxWidth: '90px' }}>
                        {proj.featured ? (
                          <span style={{ color: 'var(--accent-amber)', fontWeight: '600' }}>★ Yes</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>No</span>
                        )}
                      </td>
                      <td className="tbl-td tbl-truncate" style={{ minWidth: '110px', maxWidth: '140px', color: 'var(--text-muted)' }}>
                        {proj.lastUpdated}
                      </td>
                      <td className="tbl-td" style={{ minWidth: '220px', maxWidth: '240px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 'var(--space-1)' }}>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate(ROUTES.PROJECT_DETAILS.replace(':slug', proj.slug))}
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                          >
                            View
                          </Button>
                          <Button
                            type="button"
                            variant="primary"
                            onClick={() => navigate(ROUTES.ADMIN_EDIT_PROJECT.replace(':slug', proj.slug))}
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleDuplicate(proj.id)}
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            disabled={isProcessing}
                          >
                            Copy
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setProjectToDelete(proj)}
                            style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--accent-crimson, #ef4444)' }}
                            disabled={isProcessing}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card-glass" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <h3>No management records match your filters</h3>
            <p style={{ marginTop: 'var(--space-2)', color: 'var(--text-muted)' }}>
              Try adjusting your search queries or category filters.
            </p>
          </div>
        )}
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
    </motion.section>
  );
};
