import React, { useState, useRef, useEffect } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useToast } from '../../context/ToastContext';

/**
 * AdminToolbar
 * Renders:
 * - Desktop: [Search Input] [Filter Button] [Sort Button] [AI Button]
 * - Mobile (<768px):
 *   Row 1: Search Input (Full Width)
 *   Row 2: Filter Button | Sort Button | AI Button
 *
 * Mobile Behavior:
 * - Filter and Sort open a Bottom Drawer / Bottom Sheet.
 */
export const AdminToolbar = ({
  searchId,
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  activeFilterCount = 0,
  sortValue,
  onSortChange,
  sortOptions = [],
  onReset,
  onAIClick,
  children,
}) => {
  const isMobile = useMediaQuery('(max-width: 767.98px)');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { showToast } = useToast();
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  // Close panels when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const activeSortLabel = sortOptions.find((o) => o.value === sortValue)?.label || 'Sort';

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  // Render Mobile Layout
  if (isMobile) {
    return (
      <div className="admin-toolbar-wrapper card-glass" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-4)' }}>
        {/* Row 1: Search (Full Width) */}
        <div style={{ width: '100%' }}>
          <Input
            type="text"
            id={searchId}
            className="form-input"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
            style={{ width: '100%' }}
          />
        </div>

        {/* Row 2: Filter | Sort | AI */}
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button
            variant="secondary"
            onClick={() => setDrawerOpen(true)}
            style={{ flex: 1, position: 'relative' }}
          >
            <span className="material-icons" style={{ fontSize: '18px', marginRight: 'var(--space-2)' }}>filter_list</span>
            Filter
            {activeFilterCount > 0 && (
              <span className="admin-icon-badge" style={{ position: 'absolute', top: '-4px', right: '-4px' }}>{activeFilterCount}</span>
            )}
          </Button>

          <Button
            variant="secondary"
            onClick={() => setDrawerOpen(true)}
            style={{ flex: 1 }}
          >
            <span className="material-icons" style={{ fontSize: '18px', marginRight: 'var(--space-2)' }}>sort</span>
            Sort
          </Button>

          <Button
            variant="secondary"
            onClick={onAIClick || (() => showToast("AI Assistant is not configured.", "warning"))}
            style={{ flex: 1, color: 'var(--accent-violet, #8b5cf6)', borderColor: 'rgba(139, 92, 246, 0.2)' }}
          >
            <span className="material-icons" style={{ fontSize: '18px', marginRight: 'var(--space-2)' }}>auto_awesome</span>
            AI
          </Button>
        </div>

        {/* Mobile Bottom Drawer */}
        {drawerOpen && (
          <>
            <div className="mobile-drawer-backdrop active" onClick={() => setDrawerOpen(false)} />
            <div className="mobile-drawer active">
              <div className="mobile-drawer-header">
                <h3>Filters & Sorting</h3>
                <button type="button" className="mobile-drawer-close" onClick={() => setDrawerOpen(false)}>
                  <span className="material-icons">close</span>
                </button>
              </div>

              {/* Filters Section */}
              <div className="mobile-drawer-section">
                {children}
              </div>

              {/* Sort Section */}
              <div className="mobile-drawer-section">
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>Sort By</label>
                <select
                  className="form-select"
                  value={sortValue}
                  onChange={(e) => {
                    onSortChange(e);
                  }}
                  style={{ width: '100%' }}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="mobile-drawer-actions">
                <Button variant="secondary" onClick={handleReset} style={{ flex: 1 }}>
                  Reset
                </Button>
                <Button variant="primary" onClick={() => setDrawerOpen(false)} style={{ flex: 1 }}>
                  Apply
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Render Desktop Layout (Search | Filter | Sort | AI)
  return (
    <div className="admin-toolbar-wrapper card-glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-4)', position: 'relative', zIndex: 100 }}>
      {/* Search Input (Left side) */}
      <div style={{ flex: 1, maxWidth: '400px' }}>
        <Input
          type="text"
          id={searchId}
          className="form-input"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
        />
      </div>

      {/* Action Buttons (Right side: Filter | Sort | AI) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Filter Dropdown */}
        <div className="admin-icon-btn-wrap" ref={filterRef} style={{ position: 'relative' }}>
          <Button
            variant={filterOpen ? 'primary' : 'secondary'}
            onClick={() => { setFilterOpen((p) => !p); setSortOpen(false); }}
            style={{ position: 'relative' }}
          >
            <span className="material-icons" style={{ fontSize: '18px', marginRight: 'var(--space-2)' }}>filter_list</span>
            Filter
            {activeFilterCount > 0 && (
              <span className="admin-icon-badge" style={{ position: 'absolute', top: '-4px', right: '-4px' }}>{activeFilterCount}</span>
            )}
          </Button>

          {filterOpen && (
            <div className="admin-icon-panel admin-filter-panel" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', zIndex: 1000 }}>
              <div className="admin-filter-panel-header">
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span style={{ fontSize: '11px', color: 'var(--accent-violet)' }}>
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              {children}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="admin-icon-btn-wrap" ref={sortRef} style={{ position: 'relative' }}>
          <Button
            variant={sortOpen ? 'primary' : 'secondary'}
            onClick={() => { setSortOpen((p) => !p); setFilterOpen(false); }}
          >
            <span className="material-icons" style={{ fontSize: '18px', marginRight: 'var(--space-2)' }}>sort</span>
            {activeSortLabel}
          </Button>

          {sortOpen && (
            <div className="admin-icon-panel admin-sort-panel" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', zIndex: 1000 }}>
              <div className="admin-filter-panel-header">
                <span>Sort By</span>
              </div>
              <div className="admin-sort-options">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`admin-sort-option${sortValue === opt.value ? ' selected' : ''}`}
                    onClick={() => {
                      onSortChange({ target: { value: opt.value } });
                      setSortOpen(false);
                    }}
                  >
                    {sortValue === opt.value && (
                      <span className="material-icons" style={{ fontSize: '14px', marginRight: 'var(--space-2)' }}>check</span>
                    )}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Action Button */}
        <Button
          variant="secondary"
          onClick={onAIClick || (() => showToast("AI Assistant is not configured.", "warning"))}
          style={{ color: 'var(--accent-violet, #8b5cf6)', borderColor: 'rgba(139, 92, 246, 0.2)' }}
        >
          <span className="material-icons" style={{ fontSize: '18px', marginRight: 'var(--space-2)' }}>auto_awesome</span>
          AI Insights
        </Button>
      </div>
    </div>
  );
};
