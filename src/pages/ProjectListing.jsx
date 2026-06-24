import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import { useFilters } from '../hooks/useFilters';
import { useSearch } from '../hooks/useSearch';
import { useProjectFilters } from '../hooks/useProjectFilters';
import { Sidebar } from '../components/layout/Sidebar';
import { SearchPanel } from '../components/layout/SearchPanel';
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

  // AI Finder state
  const [isAIFinderOpen, setIsAIFinderOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

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

  // Event Handlers
  const handleAIFind = () => {
    if (aiPrompt.trim() === '') return;
    executeAISearch(aiPrompt);
    setIsAIFinderOpen(false);
  };

  const handleClearAll = () => {
    resetFilters();
    setSearchQuery('');
    clearAISearch();
    setAiPrompt('');
  };

  return (
    <motion.section
      className="portal-section portal-layout-fixed-height"
      id="kits-portal"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="portal-header" style={{ maxWidth: '100%', width: '100%', paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button variant="secondary" className="btn-back" onClick={() => navigate(ROUTES.HOME)} style={{ padding: '8px', minWidth: 'auto' }}>
            <svg viewBox="0 0 24 24">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
            </svg>
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
          <span className="badge-count" id="project-count-badge">
            {filteredList.length} Projects Found
          </span>
        </div>
      </div>

      <div className="portal-content-flex marketplace-layout" style={{ maxWidth: '100%', width: '100%', paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}>
        <Sidebar
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
          activeCategories={activeCategories}
          toggleCategory={toggleCategory}
          activeDifficulties={activeDifficulties}
          toggleDifficulty={toggleDifficulty}
          activeFeatures={activeFeatures}
          toggleFeature={toggleFeature}
          activeProjectLevels={activeProjectLevels}
          toggleProjectLevel={toggleProjectLevel}
        />

        <div className="marketplace-main">
          <SearchPanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            onOpenAIFinder={() => setIsAIFinderOpen(true)}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

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

      {/* AI Search Popup Modal */}
      <Modal isOpen={isAIFinderOpen} onClose={() => setIsAIFinderOpen(false)} className="ai-modal-content" id="ai-modal">
        <div className="compare-modal-header">
          <h4>✨ AI Project Finder</h4>
          <Button
            variant="ghost"
            className="btn-close-ai"
            id="btn-close-ai"
            onClick={() => setIsAIFinderOpen(false)}
          >
            &times;
          </Button>
        </div>
        <p style={{ textAlign: 'left', marginBottom: 'var(--space-5)' }}>
          Describe what you need in plain words (e.g., <em>"I need an Arduino project under 3000"</em> or <em>"Robotics kit for Diploma level"</em>) to query the engineering labs database.
        </p>
        <div className="ai-input-row">
          <Input
            type="text"
            id="ai-search-prompt"
            placeholder="Describe your project requirement..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAIFind()}
            className="form-input"
          />
          <Button
            type="button"
            variant="none"
            className="btn-ai-submit"
            onClick={handleAIFind}
          >
            Find
          </Button>
        </div>
      </Modal>

      {/* Successful Order Modal */}
      <Modal isOpen={orderedProject !== null} onClose={() => setOrderedProject(null)} className="modal-content purple">
        {orderStep === 'input' ? (
          <>
            <div className="modal-icon">
              <svg viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
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
            <div className="modal-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--accent-emerald)' }}>
              <svg viewBox="0 0 24 24">
                <polyline points="20,6 9,17 4,12" />
              </svg>
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
