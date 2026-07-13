import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useEffect } from 'react';
import { Skeleton } from '../../../shared/components/ui/Skeleton';

export const ProjectListing = () => {
  const navigate = useNavigate();
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

  const handleApplyFilters = () => {
    setAppliedCategories([...activeCategories]);
    setAppliedFeatures([...activeFeatures]);
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

  return (
    <>
      <SEO {...seoProps} page={PageType.PROJECT_LISTING} />
      <motion.section
        className="portal-section portal-layout-fixed-height"
        id="kits-portal"
        style={{ paddingTop: '73px', height: 'calc(100vh - 73px)' }}
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
        searchId="search-kits"
        searchPlaceholder="Search Projects.."
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        showSearchIcon={true}
        activeFilterCount={
          (appliedCategories.includes('all') ? 0 : appliedCategories.length) +
          appliedFeatures.length
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
        onApply={handleApplyFilters}
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
              {dbCategories.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleCategory(item.value)}
                  className={`admin-chip ${activeCategories.includes(item.value) && !activeCategories.includes('all') ? 'active' : ''}`}
                >
                  {item.value}
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
        <div className="marketplace-main" style={{ width: '100%', paddingTop: '12px' }}>
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} variant="card" style={{ height: '360px' }} />
              ))}
            </div>
          ) : filteredList.length > 0 ? (
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
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Project Title</label>
                  <Input
                    type="text"
                    placeholder="e.g. Smart Irrigation System"
                    value={projectStatus === 'Choosed Flyen Project' ? (orderedProject?.title || customProjectTitle) : customProjectTitle}
                    onChange={(e) => setCustomProjectTitle(e.target.value)}
                    disabled={projectStatus === 'Choosed Flyen Project' && !!orderedProject}
                    className="form-input"
                  />
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
                        background: needDocument === 'Yes' ? 'var(--brand-primary)' : 'var(--interaction-hover)',
                        border: needDocument === 'Yes' ? '1px solid var(--brand-primary)' : '1px solid var(--sys-border)',
                        color: needDocument === 'Yes' ? 'var(--txt-primary)' : 'var(--txt-secondary)'
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
                        background: needPresentation === 'Yes' ? 'var(--brand-primary)' : 'var(--interaction-hover)',
                        border: needPresentation === 'Yes' ? '1px solid var(--brand-primary)' : '1px solid var(--sys-border)',
                        color: needPresentation === 'Yes' ? 'var(--txt-primary)' : 'var(--txt-secondary)'
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
                className="modal-btn btn-submit-calc"
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
