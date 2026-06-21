import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { ROUTES } from '../constants/routes';
import { CATEGORY_LABELS } from '../constants/categories';

export const ManageProjects = () => {
  const navigate = useNavigate();
  const { allProjects, isLoading, duplicateProject, deleteProject } = useProjects();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('title');

  // Deletion Modal State
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Duplicate Action Handler
  const handleDuplicate = async (id) => {
    try {
      const duplicated = await duplicateProject(id);
      alert(`Project duplicated successfully! Created copy: "${duplicated.title}"`);
    } catch (e) {
      alert("Failed to duplicate project.");
    }
  };

  // Delete Action Handler
  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    } catch (e) {
      alert("Failed to delete project.");
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
          <Button variant="secondary" className="btn-back" onClick={() => navigate(ROUTES.HOME)} style={{ padding: '8px', minWidth: 'auto' }}>
            <svg viewBox="0 0 24 24">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
            </svg>
          </Button>
          <div className="portal-title-area">
            <h2>Project Master Data Table</h2>
            <p>Visual database management panel for Flyen engineering kits</p>
          </div>
        </div>
        <div className="portal-header-meta">
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.ADMIN_ADD_PROJECT)}
            id="btn-admin-add-kit"
          >
            + Add New Kit
          </Button>
        </div>
      </div>

      <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* Toolbar & Filters */}
        <div className="card-glass" style={{ padding: 'var(--space-4)' }}>
          <div className="grid-12" style={{ gap: 'var(--space-4)', alignItems: 'end' }}>
            {/* Search */}
            <div style={{ gridColumn: 'span 4' }} className="calc-row">
              <label htmlFor="admin-search">Search Projects</label>
              <Input
                type="text"
                id="admin-search"
                className="form-input"
                placeholder="Title, technology, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div style={{ gridColumn: 'span 2' }} className="calc-row">
              <label htmlFor="admin-cat">Category</label>
              <select
                id="admin-cat"
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div style={{ gridColumn: 'span 2' }} className="calc-row">
              <label htmlFor="admin-level">Level</label>
              <select
                id="admin-level"
                className="form-select"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="School">School</option>
                <option value="Diploma">Diploma</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ gridColumn: 'span 2' }} className="calc-row">
              <label htmlFor="admin-status">Status</label>
              <select
                id="admin-status"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="coming-soon">Coming Soon</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Sort Selection */}
            <div style={{ gridColumn: 'span 2' }} className="calc-row">
              <label htmlFor="admin-sort">Sort By</label>
              <select
                id="admin-sort"
                className="form-select"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="title">Title</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="level">Project Level</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabular Visual Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <h3>Loading database records...</h3>
          </div>
        ) : sortedList.length > 0 ? (
          <div className="card-glass" style={{ overflowX: 'auto', padding: 'var(--space-4)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--accent-blue)' }}>Project Name</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--accent-blue)' }}>Category</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--accent-blue)' }}>Project Level</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--accent-blue)' }}>Difficulty</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--accent-blue)' }}>Price</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--accent-blue)' }}>Status</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--accent-blue)' }}>Featured</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--accent-blue)' }}>Last Updated</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--accent-blue)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedList.map((proj) => {
                  const statusColors = {
                    active: 'var(--accent-emerald)',
                    draft: 'var(--accent-violet)',
                    'coming-soon': 'var(--accent-amber)',
                    archived: 'var(--accent-crimson, #ef4444)'
                  };

                  return (
                    <tr
                      key={proj.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                        <div style={{ fontWeight: '600', color: '#fff', fontSize: '13px' }}>{proj.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>slug: {proj.slug}</div>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px', textTransform: 'capitalize' }}>
                        {proj.category}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px' }}>
                        {proj.projectLevel}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px' }}>
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
                      <td style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                        ₹{proj.price}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            background: 'rgba(255,255,255,0.02)',
                            border: `1px solid ${statusColors[proj.status] || 'gray'}`,
                            color: statusColors[proj.status] || 'white'
                          }}
                        >
                          {proj.status}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px' }}>
                        {proj.featured ? (
                          <span style={{ color: 'var(--accent-amber)', fontWeight: '600' }}>★ Yes</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>No</span>
                        )}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)', fontSize: '13px', color: 'var(--text-muted)' }}>
                        {proj.lastUpdated}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)', textAlign: 'right' }}>
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
                          >
                            Copy
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setProjectToDelete(proj)}
                            style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--accent-crimson, #ef4444)' }}
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
      <Modal isOpen={projectToDelete !== null} onClose={() => setProjectToDelete(null)}>
        <div className="modal-icon" style={{ borderColor: 'var(--accent-crimson, #ef4444)', color: 'var(--accent-crimson, #ef4444)' }}>
          ⚠️
        </div>
        <h4>DELETE PROJECT KIT</h4>
        <p style={{ margin: 'var(--space-3) 0' }}>
          Are you sure you want to permanently delete <strong>{projectToDelete?.title}</strong>?
          This operation deletes it from local storage and cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-4)' }}>
          <Button
            variant="ghost"
            onClick={handleDeleteConfirm}
            style={{ background: 'var(--accent-crimson, #ef4444)', color: 'white' }}
          >
            Confirm Delete
          </Button>
          <Button variant="secondary" onClick={() => setProjectToDelete(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </motion.section>
  );
};
