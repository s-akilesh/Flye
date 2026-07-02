import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import { useFilters } from '../hooks/useFilters';
import { useSearch } from '../hooks/useSearch';
import { useProjectFilters } from '../hooks/useProjectFilters';
import { AdminToolbar } from '../components/ui/AdminToolbar';
import { CATEGORIES, CATEGORY_LABELS } from '../constants/categories';
import { DIFFICULTIES, DIFFICULTY_LABELS } from '../constants/difficulties';
import { PROJECT_FEATURES, FEATURE_LABELS } from '../constants/projectFeatures';
import { ProjectGrid } from '../components/sections/ProjectGrid';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { ROUTES } from '../constants/routes';
import { useEnquiries } from '../hooks/useEnquiries';
import { useToast } from '../context/ToastContext';

export const ProjectListing = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { addEnquiry, isProcessing } = useEnquiries();
  const { showToast } = useToast();
  const {
    activeCategories,
    activeDifficulties,
    activeFeatures,
    activeProjectLevels,
    toggleCategory,
    toggleDifficulty,
    toggleFeature,
    toggleProjectLevel,
    resetFilters
  } = useFilters();

  const {
    searchQuery,
    setSearchQuery,
    aiFilterResult,
    executeAISearch,
    clearAISearch
  } = useSearch();

  // Sort state
  const [sortBy, setSortBy] = useState('popular');

  // Mobile sidebar overlay state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Cart Order Modal state
  const [orderedProject, setOrderedProject] = useState(null);
  const [requestorName, setRequestorName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [orderStep, setOrderStep] = useState('input'); // 'input' | 'confirmed'

  const handleOpenOrderModal = (proj) => {
    setOrderedProject(proj);
    setRequestorName('');
    setContactNumber('');
    setOrderStep('input');
  };

  // Filter and sort projects using centralized hook
  const filteredList = useProjectFilters(
    projects,
    { activeCategories, activeDifficulties, activeProjectLevels, activeFeatures },
    { searchQuery, aiFilterResult },
    sortBy
  );



  const handleClearAll = () => {
    resetFilters();
    setSearchQuery('');
    clearAISearch();
  };

  return (
    <motion.section
      className="portal-section portal-layout-fixed-height"
      id="kits-portal"
      style={{ paddingTop: '68px', height: 'calc(100vh - 68px)' }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
    >
      <div
        className="portal-header"
        style={{
          width: 'auto',
          marginLeft: 'calc(-1 * var(--page-padding))',
          marginRight: 'calc(-1 * var(--page-padding))',
          paddingLeft: 'var(--page-padding)',
          paddingRight: 'var(--page-padding)',
          paddingTop: '12px',
          paddingBottom: '12px',
          background: 'rgba(10, 10, 18, 0.92)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          marginBottom: '0px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button variant="secondary" className="btn-back" onClick={() => navigate(ROUTES.HOME)} style={{ padding: '8px', minWidth: 'auto' }}>
            <span className="material-icons" style={{ fontSize: '20px' }}>arrow_back</span>
          </Button>
          <div className="portal-title-area">
            <h2>Project Kits</h2>
            <p>Explore robotics, IoT, automation, GPS tracking, Arduino, and educational engineering projects.</p>
          </div>
        </div>
        <div className="portal-header-meta">
          {aiFilterResult && (
            <span
              className="badge-count ai-active"
              onClick={clearAISearch}
            >
              Clear AI Search ✕
            </span>
          )}
        </div>
      </div>

      <AdminToolbar
        className="marketplace-toolbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 100,
          width: 'auto',
          maxWidth: 'none',
          marginLeft: 'calc(-1 * var(--page-padding))',
          marginRight: 'calc(-1 * var(--page-padding))',
          paddingLeft: 'var(--page-padding)',
          paddingRight: 'var(--page-padding)',
          paddingTop: '12px',
          paddingBottom: '12px',
          borderRadius: '0px',
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(10, 10, 18, 0.92)'
        }}
        searchId="marketplace-search"
        searchLabel="Search Projects"
        searchPlaceholder="Search projects, technologies, or keywords..."
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        activeFilterCount={
          (activeCategories.includes('all') ? 0 : activeCategories.length) +
          activeFeatures.length
        }
        sortValue={sortBy}
        onSortChange={(e) => setSortBy(e.target.value)}
        sortOptions={[
          { value: 'popular', label: 'Most Popular' },
          { value: 'newest', label: 'Newest' },
          { value: 'price-low', label: 'Price: Low to High' },
          { value: 'price-high', label: 'Price: High to Low' }
        ]}
        onReset={handleClearAll}
      >
        <div className="admin-filter-panel-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Categories */}
          <div className="calc-row">
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Categories</label>
            <div className="admin-chip-group">
              <button
                type="button"
                onClick={() => toggleCategory('all')}
                className={`admin-chip ${activeCategories.includes('all') ? 'active' : ''}`}
              >
                All
              </button>
              {Object.values(CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`admin-chip ${activeCategories.includes(cat) && !activeCategories.includes('all') ? 'active' : ''}`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Included Features */}
          <div className="calc-row">
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Included Features</label>
            <div className="admin-chip-group">
              <button
                type="button"
                onClick={() => {
                  activeFeatures.forEach(f => toggleFeature(f));
                }}
                className={`admin-chip ${activeFeatures.length === 0 ? 'active' : ''}`}
              >
                All
              </button>
              {Object.values(PROJECT_FEATURES).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFeature(f)}
                  className={`admin-chip ${activeFeatures.includes(f) ? 'active' : ''}`}
                >
                  {FEATURE_LABELS[f]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </AdminToolbar>

      <div className="portal-content-flex marketplace-layout" style={{ maxWidth: '100%', width: '100%', marginTop: '16px' }}>
        <div className="marketplace-main" style={{ width: '100%' }}>
          {filteredList.length > 0 ? (
            <ProjectGrid projects={filteredList} onRequestOrder={handleOpenOrderModal} />
          ) : (
            <div className="marketplace-empty-state active" id="marketplace-empty-state">
              <div className="empty-icon">📂</div>
              <h3>No matching projects found</h3>
              <p>Try refining your query search, checking other filter tags, or browsing the whole database.</p>
              <div className="empty-btn-group">
                <Button variant="primary" className="btn-empty-reset" id="btn-reset-filters" onClick={handleClearAll}>
                  Reset Filters
                </Button>
                <Button variant="secondary" className="btn-empty-browse" id="btn-browse-all" onClick={handleClearAll}>
                  Browse All Projects
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>



      {/* Successful Order Modal */}
      <Modal isOpen={orderedProject !== null} onClose={() => setOrderedProject(null)} className="modal-content purple">
        {orderStep === 'input' ? (
          <>
            <div className="modal-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons" style={{ fontSize: '32px', color: 'var(--accent-purple)' }}>call</span>
            </div>
            <h4>REQUEST PROJECT KIT</h4>
            <p>Enter your details below to confirm your request for <strong>{orderedProject?.title}</strong>.</p>

            <div style={{ margin: 'var(--space-3) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Your Name *</label>
                <Input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={requestorName}
                  onChange={(e) => setRequestorName(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Contact Number *</label>
                <Input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="form-input"
                  maxLength={15}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <Button variant="secondary" onClick={() => setOrderedProject(null)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="modal-btn btn-submit-calc"
                style={{ flex: 1 }}
                disabled={isProcessing}
                onClick={async () => {
                  if (!requestorName.trim()) {
                    showToast('Please enter your name.', 'error');
                    return;
                  }
                  if (!contactNumber.trim() || contactNumber.replace(/\D/g, '').length < 10) {
                    showToast('Please enter a valid 10-digit contact number.', 'error');
                    return;
                  }
                  try {
                    await addEnquiry({
                      name: requestorName,
                      mobile: contactNumber,
                      projectId: orderedProject.id,
                      projectTitle: orderedProject.title,
                      price: orderedProject.price
                    });
                    setOrderStep('confirmed');
                  } catch (err) {
                    showToast("Failed to submit request: " + (err.message || err), "error");
                  }
                }}
              >
                {isProcessing ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons" style={{ fontSize: '32px' }}>check</span>
            </div>
            <h4>KIT REQUEST CONFIRMED</h4>
            <p>Your request has been received. We'll reach out to <strong style={{ color: 'var(--accent-blue)' }}>{requestorName}</strong> ({contactNumber}) shortly.</p>

            {orderedProject && (
              <div className="modal-receipt" id="receipt-meta">
                <div className="receipt-row">
                  <span>PROJECT KIT:</span>
                  <span className="receipt-val">{orderedProject.title}</span>
                </div>
                <div className="receipt-row">
                  <span>CONTACT:</span>
                  <span className="receipt-val">{contactNumber}</span>
                </div>
                <div className="receipt-row" style={{ borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '8px' }}>
                  <span>UNIT COST:</span>
                  <span className="receipt-val" style={{ color: 'var(--accent-violet)', fontWeight: 600 }}>₹{orderedProject.price}</span>
                </div>
              </div>
            )}

            <Button variant="secondary" className="modal-btn" onClick={() => setOrderedProject(null)} style={{ marginTop: 'var(--space-3)' }}>
              Close
            </Button>
          </>
        )}
      </Modal>
    </motion.section>
  );
};
