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

export const ProjectListing = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
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
      <div className="portal-header" style={{ maxWidth: '100%', width: '100%', paddingLeft: '40px', paddingRight: '40px', marginBottom: 'var(--space-4)' }}>
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

      <div className="portal-content-flex marketplace-layout" style={{ maxWidth: '100%', width: '100%', paddingLeft: '40px', paddingRight: '40px' }}>
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
            <ProjectGrid projects={filteredList} onRequestOrder={setOrderedProject} />
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
        <div className="modal-icon">
          <svg viewBox="0 0 24 24">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
        <h4 id="receipt-title">KIT ORDER ROUTED</h4>
        <p>Your request has been logged successfully. Summary receipt details below.</p>

        {orderedProject && (
          <div className="modal-receipt" id="receipt-meta">
            <div className="receipt-row">
              <span>PROJECT KIT:</span>
              <span className="receipt-val">{orderedProject.title}</span>
            </div>
            <div className="receipt-row">
              <span>TECH STACK:</span>
              <span className="receipt-val">{orderedProject.technology}</span>
            </div>
            <div className="receipt-row">
              <span>LEVEL:</span>
              <span className="receipt-val">{orderedProject.projectLevel} ({orderedProject.difficulty.toUpperCase()})</span>
            </div>
            <div className="receipt-row" style={{ borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '8px' }}>
              <span>UNIT COST:</span>
              <span className="receipt-val" style={{ color: 'var(--accent-violet)', fontWeight: 600 }}>
                ₹{orderedProject.price}
              </span>
            </div>
          </div>
        )}

        <Button variant="secondary" className="modal-btn" onClick={() => setOrderedProject(null)}>
          Close
        </Button>
      </Modal>
    </motion.section>
  );
};
