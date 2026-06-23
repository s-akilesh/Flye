import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { AdminToolbar } from '../components/ui/AdminToolbar';
import { ROUTES } from '../constants/routes';
import { CATEGORY_LABELS } from '../constants/categories';

const Toast = ({ message, type }) => {
  if (!message) return null;
  const colors = {
    success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', text: 'var(--accent-emerald)' },
    error: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', text: 'var(--accent-crimson, #ef4444)' },
    info: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', text: 'var(--accent-violet)' },
  };
  const c = colors[type] || colors.info;
  return (
    <div style={{
      padding: 'var(--space-3) var(--space-4)', borderRadius: '8px',
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontSize: '13px', fontWeight: '600', marginBottom: 'var(--space-4)'
    }}>
      {message}
    </div>
  );
};

export const ManageProjects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { allProjects, isLoading, duplicateProject, deleteProject, updateProject } = useProjects();

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

  // Toast & Processing States
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isProcessing, setIsProcessing] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  // Consume redirect toast messages from react-router-dom state
  useEffect(() => {
    if (location.state?.toastMessage) {
      showToast(location.state.toastMessage, location.state.toastType || 'success');
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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
      const confirmDelete = window.confirm(`Are you sure you want to permanently delete the ${selectedIds.length} selected project(s)?`);
      if (!confirmDelete) return;
    }

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
      className="portal-section"
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
        <div className="portal-header-meta">
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.ADMIN_ADD_PROJECT)}
            id="btn-admin-add-kit"
            disabled={isProcessing}
          >
            + Add New Kit
          </Button>
        </div>
      </div>

      <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Toast message={toast.message} type={toast.type} />
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={projectToDelete !== null} onClose={() => !isProcessing && setProjectToDelete(null)}>
        <div className="modal-icon" style={{ borderColor: 'var(--accent-crimson, #ef4444)', color: 'var(--accent-crimson, #ef4444)' }}>
          ⚠️
        </div>
        <h4>DELETE PROJECT KIT</h4>
        <p style={{ margin: 'var(--space-3) 0' }}>
          Are you sure you want to permanently delete <strong>{projectToDelete?.title}</strong>?
          This operation deletes it from the database and cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-4)' }}>
          <Button
            variant="ghost"
            onClick={handleDeleteConfirm}
            style={{ background: 'var(--accent-crimson, #ef4444)', color: 'white' }}
            disabled={isProcessing}
          >
            {isProcessing ? 'Deleting...' : 'Confirm Delete'}
          </Button>
          <Button variant="secondary" onClick={() => setProjectToDelete(null)} disabled={isProcessing}>
            Cancel
          </Button>
        </div>
      </Modal>
    </motion.section>
  );
};
