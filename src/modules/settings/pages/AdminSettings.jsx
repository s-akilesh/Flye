import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../shared/components/ui/Button';
import { ROUTES } from '../../../shared/constants/routes';
import { useSettings } from '../hooks/useSettings';
import { SETTINGS_METADATA } from '../constants/settingsMetadata';
import { useAuth } from '../../auth/context/AuthContext.jsx';

// Dynamic lazy imports mapping for bundler-safe code splitting
const COMPONENT_MAPPING = {
  WebsiteBranding: React.lazy(() => import('../components/WebsiteBranding').then(m => ({ default: m.WebsiteBranding }))),
  ContactInfo: React.lazy(() => import('../components/ContactInfo').then(m => ({ default: m.ContactInfo }))),
  FooterSettings: React.lazy(() => import('../components/FooterSettings').then(m => ({ default: m.FooterSettings }))),
  PasswordSettings: React.lazy(() => import('../components/PasswordForm').then(m => ({ default: m.PasswordForm }))),
  AccessStats: React.lazy(() => import('../components/AccessStats').then(m => ({ default: m.AccessStats }))),
  EmailRouting: React.lazy(() => import('../components/EmailRouting').then(m => ({ default: m.EmailRouting }))),
  SocialNetworks: React.lazy(() => import('../components/SocialNetworks').then(m => ({ default: m.SocialNetworks }))),
  AdminProfile: React.lazy(() => import('../components/ProfileForm').then(m => ({ default: m.ProfileForm }))),
  SystemPrefs: React.lazy(() => import('../components/SystemPrefs').then(m => ({ default: m.SystemPrefs }))),
  LegalPagesSettings: React.lazy(() => import('../../legal/components/LegalPagesSettings').then(m => ({ default: m.LegalPagesSettings }))),
};

export const AdminSettings = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAuth();

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

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
        if (!isAdmin && found.adminOnly !== false) return null;
        return { ...found, categoryTitle: cat.title };
      }
    }
    return null;
  }, [activePage, isAdmin]);

  // Filter settings tree based on role and search query matching Title, Description, and Keywords
  const filteredCategories = useMemo(() => {
    const query = debouncedQuery.toLowerCase().trim();
    
    const allowedMetadata = SETTINGS_METADATA.map(cat => {
      const allowedRows = cat.rows.filter(row => {
        if (!isAdmin && row.adminOnly !== false) {
          return false;
        }
        return true;
      });
      return {
        ...cat,
        rows: allowedRows
      };
    }).filter(cat => cat.rows.length > 0);

    if (!query) return allowedMetadata;

    return allowedMetadata.map(cat => {
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
  }, [debouncedQuery, isAdmin]);

  const handleBack = () => {
    setSearchParams({});
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
            <div style={{ marginBottom: 'var(--space-5)', display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%' }}>
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

            {/* Categorized Rows List as Separate Clickable Cards */}
            {filteredCategories.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {filteredCategories.map((cat) => (
                  <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    {/* Category Title Heading */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 4px', marginBottom: '4px' }}>
                      <span className="material-icons-outlined" style={{ fontSize: '18px', color: 'var(--accent-violet, #8b5cf6)' }}>{cat.icon}</span>
                      <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', letterSpacing: '0.5px', margin: 0 }}>
                        {cat.title}
                      </h3>
                    </div>

                    {/* Section Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {cat.rows.map((row) => (
                        <div
                          key={row.id}
                          className="settings-clickable-card"
                          onClick={() => handleNavigateToPage(row.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.01)',
                            border: '1px solid var(--border-subtle, rgba(255,255,255,0.06))',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#fff', margin: 0 }}>{row.title}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary, #9ca3af)', margin: 0, lineHeight: '1.4' }}>{row.description}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {renderStatusTag(row.status(settings))}
                            <span style={{ color: 'var(--text-dim, #6b7280)', fontSize: '14px', transition: 'transform 0.2s ease' }} className="card-arrow-icon">→</span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
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
      <style>{`
        .settings-clickable-card:hover {
          background: rgba(255, 255, 255, 0.02) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .settings-clickable-card:hover .card-arrow-icon {
          color: #fff !important;
          transform: translateX(2px);
        }
      `}</style>
    </motion.section>
  );
};
