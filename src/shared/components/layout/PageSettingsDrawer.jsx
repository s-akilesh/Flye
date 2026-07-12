import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { pageSettingsService } from '../../services/pageSettingsService.js';
import { useToast } from '../../context/ToastContext';

export const PageSettingsDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { showToast } = useToast();
  const cleanRoute = location.pathname;

  // Tabs: 'seo' or 'og'
  const [activeTab, setActiveTab] = useState('seo');

  // Database settings state
  const [originalData, setOriginalData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Form Field States
  const [pageTitle, setPageTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [entityType, setEntityType] = useState('page');
  const [entityId, setEntityId] = useState('');

  // Status & Confirmation Modal States
  const [saveStatus, setSaveStatus] = useState(''); // 'saving' | 'success' | 'failed' | ''
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // Load page settings on mount or when route / drawer visibility changes
  const loadSettings = async () => {
    try {
      const data = await pageSettingsService.getPageSettings(cleanRoute);
      setOriginalData(data);
      
      setPageTitle(data.page_title || '');
      setMetaDescription(data.meta_description || '');
      setKeywords(data.keywords || '');
      setCanonicalUrl(data.canonical_url || '');
      setRobotsIndex(data.robots_index !== undefined ? data.robots_index : true);
      setRobotsFollow(data.robots_follow !== undefined ? data.robots_follow : true);
      setOgTitle(data.og_title || '');
      setOgDescription(data.og_description || '');
      setOgImage(data.og_image || '');
      setIsEnabled(data.is_enabled !== undefined ? data.is_enabled : true);
      setEntityType(data.entity_type || 'page');
      setEntityId(data.entity_id || '');
      setIsDirty(false);
    } catch (err) {
      console.error("Failed to load page settings", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen, cleanRoute]);

  // Check if any state is dirty compared to original data
  useEffect(() => {
    if (!originalData) return;

    const dirty = 
      pageTitle !== (originalData.page_title || '') ||
      metaDescription !== (originalData.meta_description || '') ||
      keywords !== (originalData.keywords || '') ||
      canonicalUrl !== (originalData.canonical_url || '') ||
      robotsIndex !== (originalData.robots_index !== undefined ? originalData.robots_index : true) ||
      robotsFollow !== (originalData.robots_follow !== undefined ? originalData.robots_follow : true) ||
      ogTitle !== (originalData.og_title || '') ||
      ogDescription !== (originalData.og_description || '') ||
      ogImage !== (originalData.og_image || '') ||
      isEnabled !== (originalData.is_enabled !== undefined ? originalData.is_enabled : true);

    setIsDirty(dirty);
  }, [
    pageTitle, metaDescription, keywords, canonicalUrl, 
    robotsIndex, robotsFollow, ogTitle, ogDescription, 
    ogImage, isEnabled, originalData
  ]);

  // Save changes callback
  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const payload = {
        page_title: pageTitle,
        meta_description: metaDescription,
        keywords,
        canonical_url: canonicalUrl,
        robots_index: robotsIndex,
        robots_follow: robotsFollow,
        og_title: ogTitle,
        og_description: ogDescription,
        og_image: ogImage,
        is_enabled: isEnabled,
        entity_type: entityType,
        entity_id: entityId
      };

      const updated = await pageSettingsService.savePageSettings(cleanRoute, payload);
      setOriginalData(updated);
      setIsDirty(false);
      setSaveStatus('success');
      showToast("Page SEO settings saved successfully!", "success");
      
      // Clear status indicator after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus('failed');
      showToast("Failed to save page settings.", "error");
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Close drawer checks for dirty changes
  const handleRequestClose = () => {
    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  // Discard changes and close
  const handleDiscardAndClose = () => {
    setIsDirty(false);
    setShowConfirmClose(false);
    onClose();
  };

  // Generate SEO health validation messages
  const getSeoHealth = () => {
    const issues = [];
    
    // Page Title validations
    if (!pageTitle.trim()) {
      issues.push({ text: 'Title Missing', type: 'error' });
    } else if (pageTitle.length > 60) {
      issues.push({ text: `Title Too Long (${pageTitle.length}/60)`, type: 'warning' });
    } else {
      issues.push({ text: 'Title length OK', type: 'success' });
    }

    // Meta Description validations
    if (!metaDescription.trim()) {
      issues.push({ text: 'Description Missing', type: 'error' });
    } else if (metaDescription.length > 160) {
      issues.push({ text: `Description Too Long (${metaDescription.length}/160)`, type: 'warning' });
    } else {
      issues.push({ text: 'Description length OK', type: 'success' });
    }

    // Open Graph validations
    if (!ogImage.trim()) {
      issues.push({ text: 'Missing OG Image', type: 'warning' });
    } else {
      issues.push({ text: 'OG Image configured', type: 'success' });
    }

    // Canonical validations
    if (!canonicalUrl.trim()) {
      issues.push({ text: 'Missing Canonical URL', type: 'warning' });
    } else {
      issues.push({ text: 'Canonical URL OK', type: 'success' });
    }

    return issues;
  };

  if (!isOpen) return null;

  const healthChecks = getSeoHealth();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleRequestClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--sys-overlay)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Drawer Body */}
      <div
        className="card-glass"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '450px',
          maxWidth: '100%',
          height: '100vh',
          zIndex: 9999,
          background: 'var(--sidebar-bg)',
          borderLeft: '1px solid var(--sys-border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--sys-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--txt-primary)', margin: 0 }}>Page Settings</h2>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', wordBreak: 'break-all' }}>
              Route: <span style={{ color: 'var(--accent-blue)', fontFamily: 'monospace' }}>{cleanRoute}</span>
            </div>
          </div>
          <button
            onClick={handleRequestClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Info & Status row */}
        <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--interaction-hover)', borderBottom: '1px solid var(--sys-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: 'var(--txt-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
              />
              SEO System Enabled
            </label>
          </div>
          
          {/* Save Status Indicators */}
          <div style={{ fontSize: '12px', fontWeight: '600' }}>
            {saveStatus === 'saving' && <span style={{ color: 'var(--brand-primary)' }}>Saving...</span>}
            {saveStatus === 'success' && <span style={{ color: 'var(--status-success)' }}>Saved Successfully</span>}
            {saveStatus === 'failed' && <span style={{ color: 'var(--status-danger)' }}>Failed to Save</span>}
          </div>
        </div>

        {/* Extensible Tabs Header */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--sys-divider)' }}>
          <button
            onClick={() => setActiveTab('seo')}
            style={{
              flex: 1,
              padding: '12px 0',
              background: activeTab === 'seo' ? 'var(--interaction-selected)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'seo' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              color: activeTab === 'seo' ? 'var(--txt-primary)' : 'var(--txt-muted)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '700',
              transition: 'all 0.2s'
            }}
          >
            SEO
          </button>
          <button
            onClick={() => setActiveTab('og')}
            style={{
              flex: 1,
              padding: '12px 0',
              background: activeTab === 'og' ? 'var(--interaction-selected)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'og' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              color: activeTab === 'og' ? 'var(--txt-primary)' : 'var(--txt-muted)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '700',
              transition: 'all 0.2s'
            }}
          >
            Open Graph
          </button>
        </div>

        {/* Scrollable Settings Workspace */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {activeTab === 'seo' && (
            <>
              {/* Page Title */}
              <div className="calc-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label htmlFor="seo-title" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--txt-secondary)' }}>Page Title *</label>
                  <span style={{ fontSize: '11px', color: pageTitle.length > 60 ? 'var(--status-danger)' : 'var(--txt-muted)' }}>
                    {pageTitle.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  id="seo-title"
                  className="form-input"
                  placeholder="Flyen | Projects & Solutions"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value.substring(0, 80))}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Meta Description */}
              <div className="calc-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label htmlFor="seo-desc" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--txt-secondary)' }}>Meta Description *</label>
                  <span style={{ fontSize: '11px', color: metaDescription.length > 160 ? 'var(--status-danger)' : 'var(--txt-muted)' }}>
                    {metaDescription.length}/160
                  </span>
                </div>
                <textarea
                  id="seo-desc"
                  className="form-input"
                  placeholder="Explain page contents..."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value.substring(0, 250))}
                  rows={3}
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              {/* Keywords */}
              <div className="calc-row">
                <label htmlFor="seo-keywords" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Keywords (comma separated)</label>
                <input
                  type="text"
                  id="seo-keywords"
                  className="form-input"
                  placeholder="arduino, iot, projects"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Canonical URL */}
              <div className="calc-row">
                <label htmlFor="seo-canonical" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Canonical URL</label>
                <input
                  type="text"
                  id="seo-canonical"
                  className="form-input"
                  placeholder="https://flyen.in/projects"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Robots Checkboxes */}
              <div style={{ display: 'flex', gap: '24px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={robotsIndex}
                    onChange={(e) => setRobotsIndex(e.target.checked)}
                  />
                  Index (Search Engines visible)
                </label>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={robotsFollow}
                    onChange={(e) => setRobotsFollow(e.target.checked)}
                  />
                  Follow (crawl links)
                </label>
              </div>
            </>
          )}

          {activeTab === 'og' && (
            <>
              {/* OG Title */}
              <div className="calc-row">
                <label htmlFor="og-title" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>OG Title</label>
                <input
                  type="text"
                  id="og-title"
                  className="form-input"
                  placeholder="Flyen - Robotics Lab"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              {/* OG Description */}
              <div className="calc-row">
                <label htmlFor="og-desc" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>OG Description</label>
                <textarea
                  id="og-desc"
                  className="form-input"
                  placeholder="Social preview description..."
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  rows={3}
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              {/* OG Image */}
              <div className="calc-row">
                <label htmlFor="og-image" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>OG Image URL</label>
                <input
                  type="text"
                  id="og-image"
                  className="form-input"
                  placeholder="https://flyen.in/images/seo-banner.jpg"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Twitter card */}
              <div className="calc-row">
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Twitter Card Type</label>
                <select className="form-input" style={{ width: '100%' }} disabled>
                  <option>summary_large_image</option>
                </select>
              </div>

              {/* Social Image Preview */}
              {ogImage.trim() && (
                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Social Image Preview:</span>
                  <div
                    style={{
                      width: '100%',
                      height: '160px',
                      borderRadius: '6px',
                      background: `url(${ogImage}) center/cover no-repeat`,
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  />
                </div>
              )}
            </>
          )}

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--sys-divider)', margin: '10px 0' }} />

          {/* Google Search Mock Preview */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)', marginBottom: '8px' }}>Google Search Preview</h3>
            <div
              className="card-glass"
              style={{
                padding: '12px',
                borderRadius: '6px',
                background: 'var(--sys-bg)',
                border: '1px solid var(--sys-border)',
                fontFamily: 'arial, sans-serif'
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--txt-muted)', marginBottom: '2px', wordBreak: 'break-all' }}>
                {canonicalUrl || `https://flyen.in${cleanRoute}`}
              </div>
              <div style={{ fontSize: '18px', color: 'var(--brand-accent)', fontWeight: '400', cursor: 'pointer', marginBottom: '4px', textDecoration: 'underline' }}>
                {pageTitle || 'Untitled Page'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--txt-secondary)', lineHeight: '1.4' }}>
                {metaDescription || 'Add description to display google search snippet description...'}
              </div>
            </div>
          </div>

          {/* Validation/Health Checks */}
          <div style={{ marginTop: '5px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)', marginBottom: '8px' }}>SEO Health Validation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {healthChecks.map((check, idx) => {
                const color = 
                  check.type === 'error' ? 'var(--status-danger)' : 
                  check.type === 'warning' ? 'var(--status-warning)' : 'var(--status-success)';
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                    <span style={{ color: 'var(--txt-secondary)' }}>{check.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Read-Only Page Info Footer */}
          {originalData && originalData.created_at && (
            <div style={{ background: 'var(--interaction-hover)', padding: '10px', borderRadius: '6px', border: '1px solid var(--sys-border)', marginTop: '10px' }}>
              <h4 style={{ fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Page Audit Log</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '11px', color: 'var(--txt-secondary)' }}>
                <div>Created: <span style={{ color: 'var(--txt-primary)' }}>{new Date(originalData.created_at).toLocaleDateString('en-IN')}</span></div>
                <div>Updated: <span style={{ color: 'var(--txt-primary)' }}>{new Date(originalData.updated_at).toLocaleDateString('en-IN')}</span></div>
                <div>Created By: <span style={{ color: 'var(--txt-primary)' }}>{originalData.created_by || 'System'}</span></div>
                <div>Updated By: <span style={{ color: 'var(--txt-primary)' }}>{originalData.updated_by || 'System'}</span></div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--sys-divider)', display: 'flex', gap: '12px', background: 'var(--sys-surface)' }}>
          <button
            onClick={handleRequestClose}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || saveStatus === 'saving'}
            className="btn btn-primary"
            style={{ flex: 2, opacity: !isDirty ? 0.5 : 1, cursor: !isDirty ? 'not-allowed' : 'pointer' }}
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Unsaved Changes */}
      {showConfirmClose && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            background: 'var(--sys-overlay)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <div
            className="card-glass"
            style={{
              width: '400px',
              maxWidth: '90%',
              background: 'var(--sys-surface)',
              border: '1px solid var(--sys-border)',
              padding: '24px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--txt-primary)', marginBottom: '12px' }}>Unsaved Changes</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
              You have unsaved SEO edits. What would you like to do before closing?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={async () => {
                  await handleSave();
                  setShowConfirmClose(false);
                  onClose();
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px' }}
              >
                Save Changes
              </button>
              <button
                onClick={handleDiscardAndClose}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '10px', color: 'var(--status-error)' }}
              >
                Discard Changes
              </button>
              <button
                onClick={() => setShowConfirmClose(false)}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '10px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
