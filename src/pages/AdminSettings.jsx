import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../constants/routes';
import { useSettings } from '../hooks/useSettings';
import { SETTINGS_METADATA } from '../constants/settingsMetadata';

// Dynamic lazy imports mapping for bundler-safe code splitting
const COMPONENT_MAPPING = {
  WebsiteBranding: React.lazy(() => import('../components/admin/settings/WebsiteBranding').then(m => ({ default: m.WebsiteBranding }))),
  ContactInfo: React.lazy(() => import('../components/admin/settings/ContactInfo').then(m => ({ default: m.ContactInfo }))),
  FooterSettings: React.lazy(() => import('../components/admin/settings/FooterSettings').then(m => ({ default: m.FooterSettings }))),
  PasswordSettings: React.lazy(() => import('../components/admin/settings/PasswordSettings').then(m => ({ default: m.PasswordSettings }))),
  AccessStats: React.lazy(() => import('../components/admin/settings/AccessStats').then(m => ({ default: m.AccessStats }))),
  EmailRouting: React.lazy(() => import('../components/admin/settings/EmailRouting').then(m => ({ default: m.EmailRouting }))),
  SocialNetworks: React.lazy(() => import('../components/admin/settings/SocialNetworks').then(m => ({ default: m.SocialNetworks }))),
  AdminProfile: React.lazy(() => import('../components/admin/settings/AdminProfile').then(m => ({ default: m.AdminProfile }))),
  SMTPSettings: React.lazy(() => import('../components/admin/settings/SMTPSettings').then(m => ({ default: m.SMTPSettings }))),
  SystemPrefs: React.lazy(() => import('../components/admin/settings/SystemPrefs').then(m => ({ default: m.SystemPrefs }))),
};

export const AdminSettings = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Accordion States (Default first category open)
  const [expandedCategory, setExpandedCategory] = useState('website');

  const activePage = searchParams.get('page');

  // Debounce search query input (150ms) to prevent render lags
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Expand categories containing search results automatically
  const isSearchMode = debouncedQuery.trim() !== '';

  const activeRow = useMemo(() => {
    if (!activePage) return null;
    for (const cat of SETTINGS_METADATA) {
      const found = cat.rows.find(r => r.id === activePage);
      if (found) {
        return { ...found, categoryTitle: cat.title };
      }
    }
    return null;
  }, [activePage]);

  // Filter settings tree based on search query matching Title, Description, and Keywords
  const filteredCategories = useMemo(() => {
    const query = debouncedQuery.toLowerCase().trim();
    if (!query) return SETTINGS_METADATA;

    return SETTINGS_METADATA.map(cat => {
      const matchingRows = cat.rows.filter(row => {
        const titleMatch = row.title.toLowerCase().includes(query);
        const descMatch = row.description.toLowerCase().includes(query);
        const keywordMatch = row.keywords.some(kw => kw.toLowerCase().includes(query));
        return titleMatch || descMatch || keywordMatch;
      });

      return {
        ...cat,
        rows: matchingRows
      };
    }).filter(cat => cat.rows.length > 0);
  }, [debouncedQuery]);

  const handleBack = () => {
    // Preserve the current expanded category state when returning
    setSearchParams({});
  };

  const handleToggleCategory = (catId) => {
    if (isSearchMode) return; // All are forced open during search
    setExpandedCategory(prev => prev === catId ? null : catId);
  };

  const handleNavigateToPage = (rowId) => {
    setSearchParams({ page: rowId });
  };

  // Status computation rendering
  const renderStatusTag = (status) => {
    if (status === 'coming_soon') {
      return <span className="settings-status-tag tag-soon">Coming Soon</span>;
    }
    if (status === 'attention') {
      return (
        <span 
          style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: 'var(--accent-orange, #f97316)', 
            display: 'inline-block',
            boxShadow: '0 0 8px var(--accent-orange, #f97316)',
            marginLeft: '8px'
          }} 
          title="Needs Attention"
        />
      );
    }
    return (
      <span 
        style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          background: 'var(--accent-emerald, #10b981)', 
          display: 'inline-block',
          boxShadow: '0 0 8px var(--accent-emerald, #10b981)',
          marginLeft: '8px'
        }} 
        title="Configured"
      />
    );
  };

  const ActiveFormComponent = activeRow ? COMPONENT_MAPPING[activeRow.component] : null;

  return (
    <motion.section
      id="admin-settings-portal"
      className="portal-section"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      {/* Mobile Sticky Sub-Header */}
      <header className="mobile-learning-header">
        <span className="mobile-learning-title" style={{ fontSize: '14px', fontWeight: '800', color: '#fff', textTransform: 'uppercase' }}>
          {ActiveFormComponent ? activeRow.title : 'Platform Settings'}
        </span>
      </header>

      {ActiveFormComponent ? (
        /* Render Selected Form Screen dynamically */
        <div className="portal-content">
          <Suspense fallback={<div style={{ padding: 'var(--space-5)', color: 'var(--text-muted)', fontSize: '13px' }}>Loading settings page...</div>}>
            <ActiveFormComponent onBack={handleBack} />
          </Suspense>
        </div>
      ) : (
        /* Settings List Landing Page */
        <>
          <div className="portal-header" style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="portal-title-area">
              <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Platform Settings</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Manage credentials, routing rules, configurations and website details.
              </p>
            </div>
          </div>

          <div className="portal-content">
            {/* Global Search Bar (centered) */}
            <div style={{ marginBottom: 'var(--space-5)', display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '640px' }}>
                <input
                  type="text"
                  className="settings-search-bar"
                  placeholder="Search settings (e.g. logo, password, email)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
                <span className="material-icons-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: '18px' }}>
                  search
                </span>
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setDebouncedQuery(''); }}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '12px' }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Accordion Categorized Rows List */}
            {filteredCategories.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {filteredCategories.map((cat) => {
                  const isOpen = isSearchMode || expandedCategory === cat.id;

                  return (
                    <div key={cat.id} className="settings-accordion-section" style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'rgba(255,255,255,0.01)', overflow: 'hidden' }}>
                      
                      {/* Accordion Category Header */}
                      <div
                        className="settings-accordion-header"
                        onClick={() => handleToggleCategory(cat.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 'var(--space-3) var(--space-4)',
                          background: 'rgba(255,255,255,0.015)',
                          cursor: isSearchMode ? 'default' : 'pointer',
                          userSelect: 'none',
                          borderBottom: isOpen ? '1px solid var(--border-subtle)' : 'none',
                          transition: 'background 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className="material-icons-outlined" style={{ fontSize: '18px', color: 'var(--accent-violet)' }}>{cat.icon}</span>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff', letterSpacing: '0.5px' }}>
                            {cat.title}
                          </span>
                        </div>
                        {!isSearchMode && (
                          <span style={{ fontSize: '10px', color: 'var(--text-dim)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                            ▼
                          </span>
                        )}
                      </div>

                      {/* Accordion Children Rows */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div className="settings-list-container">
                              {cat.rows.map((row) => (
                                <div
                                  key={row.id}
                                  className="settings-list-row"
                                  onClick={() => handleNavigateToPage(row.id)}
                                >
                                  <div className="settings-row-left">
                                    <div className="settings-row-info">
                                      <h4>{row.title}</h4>
                                      <p>{row.description}</p>
                                    </div>
                                  </div>
                                  <div className="settings-row-right">
                                    {renderStatusTag(row.status(settings))}
                                    <span className="settings-row-arrow">→</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  );
                })}
              </div>
            ) : (
              /* suggestions-driven empty state */
              <div className="settings-empty-state">
                <div style={{ fontSize: '28px', marginBottom: 'var(--space-3)' }}>🔍</div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  No settings found
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 var(--space-4) 0' }}>
                  We couldn't find any results matching "{debouncedQuery}"
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 'var(--space-3)', width: '100%', maxWidth: '320px', margin: '0 auto' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Try searching for:
                  </span>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
                    {['Website', 'Email', 'Password', 'Social'].map(sug => (
                      <button
                        key={sug}
                        className="sug-chip"
                        onClick={() => setSearchQuery(sug)}
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </motion.section>
  );
};
