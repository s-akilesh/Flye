import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import { useFilters } from '../hooks/useFilters';
import { useSearch } from '../hooks/useSearch';
import { useProjectFilters } from '../hooks/useProjectFilters';
import { AdminToolbar } from '../../../shared/components/ui/AdminToolbar';
import { CATEGORIES, CATEGORY_LABELS } from '../constants/categories';
import { masterDataService } from '../../../shared/services/masterDataService';
import { DIFFICULTIES, DIFFICULTY_LABELS } from '../constants/difficulties';
import { PROJECT_FEATURES, FEATURE_LABELS } from '../constants/projectFeatures';
import { ProjectGrid } from '../components/ProjectGrid';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { ROUTES } from '../../../shared/constants/routes';
import { useEnquiries } from '../../enquiries/hooks/useEnquiries';
import { useAuth } from '../../auth/context/AuthContext';
import { useToast } from '../../../shared/context/ToastContext';
import { SEO, PageType, generateSEO } from '../../../shared/seo';
import { eventTracker } from '../../../shared/analytics/index.js';
import { Skeleton } from '../../../shared/components/ui/Skeleton';

export const ProjectListing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const { projects, isLoading } = useProjects();
  const { addEnquiry, isProcessing } = useEnquiries();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await masterDataService.getValues('project_category');
        setDbCategories(cats);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  const seoProps = generateSEO(PageType.PROJECT_LISTING);
  const {
    activeCategories,
    setActiveCategories,
    activeDifficulties,
    activeFeatures,
    activeProjectLevels,
    toggleCategory,
    toggleDifficulty,
    toggleFeature,
    toggleProjectLevel,
    resetFilters
  } = useFilters();

  // Sync category param from URL
  useEffect(() => {
    if (categoryParam && categoryParam.trim()) {
      setActiveCategories([categoryParam.trim()]);
    }
  }, [categoryParam, setActiveCategories]);

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
  const [contactPrefix, setContactPrefix] = useState('+91');
  const [formErrors, setFormErrors] = useState({});
  const [orderStep, setOrderStep] = useState('input'); // 'input' | 'confirmed'
  const [projectStatus, setProjectStatus] = useState('Choosed Flyen Project');
  const [customProjectTitle, setCustomProjectTitle] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [needDocument, setNeedDocument] = useState('No');
  const [needPresentation, setNeedPresentation] = useState('No');
  const [projectRemarks, setProjectRemarks] = useState('');

  // Analytics: Track search queries (debounced)
  useEffect(() => {
    if (!searchQuery) return;
    const timer = setTimeout(() => {
      eventTracker.trackSearch(searchQuery);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Analytics: Track filter application changes
  useEffect(() => {
    if (activeCategories.length > 0 && !activeCategories.includes('all')) {
      eventTracker.trackFilterApplied('categories', activeCategories.join(','));
    }
  }, [activeCategories]);

  useEffect(() => {
    if (activeFeatures.length > 0) {
      eventTracker.trackFilterApplied('features', activeFeatures.join(','));
    }
  }, [activeFeatures]);

  const handleOpenOrderModal = (proj) => {
    setOrderedProject(proj);
    setRequestorName('');
    setContactNumber('');
    setContactPrefix('+91');
    setFormErrors({});
    setProjectStatus('Choosed Flyen Project');
    setCustomProjectTitle(proj ? proj.title : '');
    setProjectBudget(proj ? String(proj.price) : '');
    setSubmissionDate('');
    setNeedDocument('No');
    setNeedPresentation('No');
    setProjectRemarks('');
    setOrderStep('input');
  };

  const [appliedCategories, setAppliedCategories] = useState(['all']);
  const [appliedFeatures, setAppliedFeatures] = useState([]);

  const handleCategoryToggle = (cat) => {
    toggleCategory(cat);
    if (cat === 'all') {
      setAppliedCategories(['all']);
    } else {
      let next = appliedCategories.filter(c => c !== 'all');
      if (next.includes(cat)) {
        next = next.filter(c => c !== cat);
      } else {
        next.push(cat);
      }
      if (next.length === 0) next = ['all'];
      setAppliedCategories(next);
    }
  };

  const handleFeatureToggle = (feat) => {
    toggleFeature(feat);
    if (appliedFeatures.includes(feat)) {
      setAppliedFeatures(appliedFeatures.filter(f => f !== feat));
    } else {
      setAppliedFeatures([...appliedFeatures, feat]);
    }
  };

  // Filter and sort projects using centralized hook
  const filteredList = useProjectFilters(
    projects,
    { 
      activeCategories: appliedCategories, 
      activeDifficulties: [], 
      activeProjectLevels: [], 
      activeFeatures: appliedFeatures 
    },
    { searchQuery, aiFilterResult },
    sortBy
  );

  const handleClearAll = () => {
    resetFilters();
    setAppliedCategories(['all']);
    setAppliedFeatures([]);
    setSearchQuery('');
    clearAISearch();
  };

  const isFiltered = (appliedCategories.length > 0 && !appliedCategories.includes('all')) || appliedFeatures.length > 0 || searchQuery !== '';

  return (
    <>
      <SEO {...seoProps} page={PageType.PROJECT_LISTING} />
      <motion.section
        className="portal-section"
        id="kits-portal"
        style={{ paddingTop: '73px', minHeight: 'calc(100vh - 73px)' }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
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
            <Button variant="secondary" className="btn-back" onClick={() => navigate(ROUTES.HOME)} style={{ padding: '8px', minWidth: 'auto' }}>
              <span className="material-icons" style={{ fontSize: '20px' }}>arrow_back</span>
            </Button>
            <div className="portal-title-area">
              <h2>Project Kits</h2>
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

        {/* 2-Column Marketplace Container: Left Sidebar (Desktop/Mid) + Right Main Grid */}
        <div className="marketplace-layout-container" style={{ padding: '20px 0' }}>
          
          {/* ========================================================================
              LEFT SIDEBAR: FILTER & SORT (Web View - Large and Mid screens >= 768px)
              ======================================================================== */}
          <aside className="marketplace-desktop-sidebar">
            {/* Search Input */}
            <div className="sidebar-filter-group">
              <label className="sidebar-group-title">Search Projects</label>
              <div style={{ position: 'relative' }}>
                <Input
                  type="text"
                  id="search-kits-desktop"
                  className="form-input"
                  placeholder="Search by title, topic..."
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
                <option value="newest" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Newest Releases</option>
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
                    Reset All
                  </button>
                )}
              </div>
              <div className="admin-chip-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleCategoryToggle('all')}
                  className={`admin-chip ${appliedCategories.includes('all') ? 'active' : ''}`}
                >
                  All
                </button>
                {dbCategories.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleCategoryToggle(item.value)}
                    className={`admin-chip ${appliedCategories.includes(item.value) && !appliedCategories.includes('all') ? 'active' : ''}`}
                  >
                    {item.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Included Features Section */}
            <div className="sidebar-filter-group">
              <label className="sidebar-group-title">Included Features</label>
              <div className="admin-chip-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAppliedFeatures([]);
                  }}
                  className={`admin-chip ${appliedFeatures.length === 0 ? 'active' : ''}`}
                >
                  All
                </button>
                {Object.values(PROJECT_FEATURES).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => handleFeatureToggle(f)}
                    className={`admin-chip ${appliedFeatures.includes(f) ? 'active' : ''}`}
                  >
                    {FEATURE_LABELS[f]}
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
                  placeholder="Search projects..."
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
                Showing <strong style={{ color: 'var(--txt-primary)' }}>{filteredList.length}</strong> {filteredList.length === 1 ? 'project kit' : 'project kits'}
              </div>
              {aiFilterResult && (
                <span
                  className="badge-count ai-active"
                  onClick={clearAISearch}
                  style={{ cursor: 'pointer' }}
                >
                  Clear AI Search ✕
                </span>
              )}
            </div>

            {/* Grid / Skeletons / Empty */}
            {isLoading ? (
              <div className="project-marketplace-grid" style={{ width: '100%' }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} variant="card" style={{ height: '320px', borderRadius: '12px' }} />
                ))}
              </div>
            ) : filteredList.length > 0 ? (
              <ProjectGrid projects={filteredList} onRequestOrder={handleOpenOrderModal} />
            ) : (
              <div className="marketplace-empty-state active" id="marketplace-empty-state">
                <div className="empty-icon">📂</div>
                <h3>No matching projects found</h3>
                <p>Try refining your query search, checking other filter tags, or browsing the whole database.</p>
                <div className="empty-btn-group" style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                  <Button variant="secondary" id="btn-reset-filters" onClick={handleClearAll}>
                    Reset Filters
                  </Button>
                  <Button variant="secondary" id="btn-browse-all" onClick={handleClearAll}>
                    Browse All Projects
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
                <option value="newest">Newest Releases</option>
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
                  onClick={() => handleCategoryToggle('all')}
                  className={`admin-chip ${appliedCategories.includes('all') ? 'active' : ''}`}
                >
                  All
                </button>
                {dbCategories.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleCategoryToggle(item.value)}
                    className={`admin-chip ${appliedCategories.includes(item.value) && !appliedCategories.includes('all') ? 'active' : ''}`}
                  >
                    {item.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="sidebar-group-title" style={{ display: 'block', marginBottom: '8px' }}>Included Features</label>
              <div className="admin-chip-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setAppliedFeatures([])}
                  className={`admin-chip ${appliedFeatures.length === 0 ? 'active' : ''}`}
                >
                  All
                </button>
                {Object.values(PROJECT_FEATURES).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => handleFeatureToggle(f)}
                    className={`admin-chip ${appliedFeatures.includes(f) ? 'active' : ''}`}
                  >
                    {FEATURE_LABELS[f]}
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



      {/* Successful Order Modal */}
      <Modal isOpen={orderedProject !== null} onClose={() => setOrderedProject(null)} className="modal-content purple" style={{ maxWidth: '600px', width: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        {orderStep === 'input' ? (
          <>
            {/* Fixed Header with Glass/Milk Background */}
            <div style={{
              padding: '24px 24px 16px 24px',
              background: 'var(--sys-surface-elevated)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid var(--sys-divider)',
              zIndex: 10,
              flexShrink: 0
            }}>
              <h4 style={{ textAlign: 'left', margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--txt-primary)' }}>PROJECT ENQUIRY</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--txt-muted)', textAlign: 'left', margin: '4px 0 0 0' }}>
                Fill in your details below. Our engineering expert will coordinate with you.
              </p>
            </div>

            {/* Scrollable Middle Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', textAlign: 'left', width: '100%' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Your Name *</label>
                  <Input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={requestorName}
                    onChange={(e) => {
                      setRequestorName(e.target.value);
                      if (formErrors.requestorName) setFormErrors(prev => ({ ...prev, requestorName: false }));
                    }}
                    className={`form-input ${formErrors.requestorName ? 'error-state' : ''}`}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Contact Number *</label>
                  <div className={`phone-input-container ${formErrors.contactNumber ? 'error-state' : ''}`}>
                    <select
                      className="phone-prefix-select"
                      value={contactPrefix}
                      onChange={(e) => {
                        setContactPrefix(e.target.value);
                        const isValid = e.target.value === '+91' ? contactNumber.length === 10 : (contactNumber.length >= 7 && contactNumber.length <= 15);
                        setFormErrors(prev => ({ ...prev, contactNumber: !isValid }));
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        borderRight: '1px solid var(--sys-border)',
                        color: 'var(--txt-primary)',
                        padding: '0 8px',
                        height: '100%',
                        fontSize: '13px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="+1" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+1</option>
                      <option value="+91" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+91</option>
                      <option value="+44" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+44</option>
                      <option value="+61" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+61</option>
                      <option value="+81" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+81</option>
                      <option value="+33" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+33</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={contactNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setContactNumber(val);
                        const isValid = contactPrefix === '+91' ? val.length === 10 : (val.length >= 7 && val.length <= 15);
                        setFormErrors(prev => ({ ...prev, contactNumber: !isValid }));
                      }}
                      style={{
                        flex: 1,
                        height: '100%',
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none',
                        padding: '0 14px',
                        color: 'var(--txt-primary)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                      maxLength={15}
                    />
                  </div>
                  {formErrors.contactNumber && (
                    <span style={{ color: 'var(--status-error)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                      Please enter a valid number
                    </span>
                  )}
                </div>

                <div style={{ display: 'none' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Your Project Status</label>
                  <select
                    value={projectStatus}
                    onChange={(e) => {
                      setProjectStatus(e.target.value);
                      if (e.target.value !== 'Choosed Flyen Project') {
                        setOrderedProject(null);
                      }
                    }}
                    className="form-select"
                    style={{ height: '38px', background: 'var(--input-bg)', color: 'var(--txt-primary)', border: '1px solid var(--input-border)', borderRadius: '6px', width: '100%' }}
                  >
                    <option value="Not Started yet" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Not Started yet</option>
                    <option value="Have Project idea" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Have Project idea</option>
                    <option value="Need Only Support" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Need Only Support</option>
                    <option value="Choosed Flyen Project" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Choosed Flyen Project</option>
                    <option value="3d Printing" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>3d Printing</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Budget (₹)</label>
                  <Input
                    type="text"
                    placeholder="e.g. 5000"
                    value={projectBudget}
                    onChange={(e) => setProjectBudget(e.target.value.replace(/\D/g, ''))}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Submission Date</label>
                  <Input
                    type="date"
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                    onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                    className="form-input"
                    style={{ colorScheme: 'dark', height: '38px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Need Document?</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setNeedDocument('Yes')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needDocument === 'Yes' ? 'rgba(139, 92, 246, 0.15)' : 'var(--interaction-hover)',
                        border: needDocument === 'Yes' ? '1px solid var(--brand-primary)' : '1px solid var(--sys-border)',
                        color: needDocument === 'Yes' ? 'var(--brand-primary)' : 'var(--txt-secondary)'
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setNeedDocument('No')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needDocument === 'No' ? 'rgba(239, 68, 68, 0.15)' : 'var(--interaction-hover)',
                        border: needDocument === 'No' ? '1px solid var(--status-error)' : '1px solid var(--sys-border)',
                        color: needDocument === 'No' ? 'var(--status-error)' : 'var(--txt-secondary)'
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Need Presentation Support?</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setNeedPresentation('Yes')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needPresentation === 'Yes' ? 'rgba(139, 92, 246, 0.15)' : 'var(--interaction-hover)',
                        border: needPresentation === 'Yes' ? '1px solid var(--brand-primary)' : '1px solid var(--sys-border)',
                        color: needPresentation === 'Yes' ? 'var(--brand-primary)' : 'var(--txt-secondary)'
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setNeedPresentation('No')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needPresentation === 'No' ? 'rgba(239, 68, 68, 0.15)' : 'var(--interaction-hover)',
                        border: needPresentation === 'No' ? '1px solid var(--status-error)' : '1px solid var(--sys-border)',
                        color: needPresentation === 'No' ? 'var(--status-error)' : 'var(--txt-secondary)'
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', marginTop: '4px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Describe your project or any remark (optional)</label>
                <textarea
                  value={projectRemarks}
                  onChange={(e) => setProjectRemarks(e.target.value)}
                  placeholder="Specify any custom requirements, hardware needs, or comments..."
                  className="form-textarea"
                  style={{ width: '100%', minHeight: '80px', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '6px', color: 'var(--txt-primary)', padding: '10px', fontSize: '12.5px' }}
                />
              </div>
            </div>

            {/* Fixed Footer with Glass/Milk Background */}
            <div style={{
              padding: '16px 24px 20px 24px',
              background: 'var(--sys-surface-elevated)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderTop: '1px solid var(--sys-divider)',
              display: 'flex',
              gap: '12px',
              width: '100%',
              boxSizing: 'border-box',
              flexShrink: 0
            }}>
              <Button variant="secondary" onClick={() => setOrderedProject(null)} disabled={isProcessing} style={{ flex: 1, height: '42px' }}>
                Cancel
              </Button>
              <Button
                variant="primary"
                style={{ flex: 1, height: '42px' }}
                disabled={isProcessing}
                onClick={async () => {
                  const newErrors = {};
                  if (!requestorName.trim()) newErrors.requestorName = true;
                  
                  const isPhoneValid = contactPrefix === '+91' 
                    ? contactNumber.length === 10 
                    : (contactNumber.length >= 7 && contactNumber.length <= 15);
                    
                  if (!isPhoneValid) newErrors.contactNumber = true;

                  if (Object.keys(newErrors).length > 0) {
                    setFormErrors(newErrors);
                    showToast('Please fill in all mandatory fields correctly.', 'error');
                    return;
                  }

                  setFormErrors({});
                  
                  const titleToUse = projectStatus === 'Choosed Flyen Project' ? (orderedProject?.title || customProjectTitle) : customProjectTitle;
                  
                  // Serialize all details cleanly into notes
                  const serializedNotes = [
                    `Project Status: ${projectStatus}`,
                    `Budget: ${projectBudget ? `₹${projectBudget}` : 'Not specified'}`,
                    `Submission Date: ${submissionDate || 'Not specified'}`,
                    `Need Document: ${needDocument}`,
                    `Need Presentation Support: ${needPresentation}`,
                    projectRemarks.trim() ? `Remarks: ${projectRemarks}` : ''
                  ].filter(Boolean).join('\n');

                  try {
                    await addEnquiry({
                      name: requestorName,
                      mobile: `${contactPrefix}${contactNumber}`,
                      projectId: orderedProject?.id || '',
                      projectTitle: titleToUse || 'Custom Project Enquiry',
                      price: projectBudget || orderedProject?.price || '',
                      notes: serializedNotes,
                      userId: user?.id || null
                    });
                    setOrderStep('confirmed');
                  } catch (err) {
                    showToast("Failed to submit request: " + (err.message || err), "error");
                  }
                }}
              >
                {isProcessing ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </>
        ) : (
          <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="modal-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <span className="material-icons" style={{ fontSize: '32px' }}>check</span>
            </div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800' }}>KIT REQUEST CONFIRMED</h4>
            <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: 'var(--txt-muted)' }}>
              Your request has been received. We'll reach out to <strong style={{ color: 'var(--brand-accent)' }}>{requestorName}</strong> ({contactNumber}) shortly.
            </p>

            {orderedProject && (
              <div className="modal-receipt" id="receipt-meta" style={{ width: '100%', background: 'var(--interaction-hover)', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>
                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--txt-muted)' }}>PROJECT KIT:</span>
                  <span className="receipt-val" style={{ color: 'var(--txt-primary)', fontWeight: 'bold' }}>{orderedProject.title}</span>
                </div>
                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--txt-muted)' }}>CONTACT:</span>
                  <span className="receipt-val" style={{ color: 'var(--txt-primary)', fontWeight: 'bold' }}>{contactNumber}</span>
                </div>
                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--sys-divider)', paddingTop: '8px', marginTop: '8px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--txt-muted)' }}>UNIT COST:</span>
                  <span className="receipt-val" style={{ color: 'var(--brand-primary)', fontWeight: 'bold' }}>₹{projectBudget || orderedProject.price}</span>
                </div>
              </div>
            )}

            <Button variant="secondary" className="modal-btn" onClick={() => setOrderedProject(null)} style={{ width: '100%', maxWidth: '200px' }}>
              Close
            </Button>
          </div>
        )}
      </Modal>
    </motion.section>
    </>
  );
};
