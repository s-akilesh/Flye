import React, { useState, useRef, useEffect } from 'react';
import { Input } from './Input';

/**
 * AdminToolbar
 * Renders: [Search Input] [Filter Icon (with badge + collapsible panel)] [Sort Icon]
 *
 * Props:
 *  searchId, searchLabel, searchPlaceholder, searchValue, onSearchChange
 *  activeFilterCount  — number of active filters (shows badge on icon)
 *  sortValue, onSortChange, sortOptions  — [{value, label}]
 *  children  — content rendered inside the filter panel dropdown
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
  children,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
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

  return (
    <div className="admin-toolbar-wrapper card-glass">
      {/* Search */}
      <div className="admin-toolbar-search calc-row">
        <label htmlFor={searchId}>{searchLabel}</label>
        <div className="admin-toolbar-search-row">
          <Input
            type="text"
            id={searchId}
            className="form-input"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
          />

          {/* Filter Icon Button */}
          <div className="admin-icon-btn-wrap" ref={filterRef}>
            <button
              type="button"
              className={`admin-icon-btn${filterOpen ? ' active' : ''}`}
              onClick={() => { setFilterOpen((p) => !p); setSortOpen(false); }}
              title="Filters"
              aria-label="Toggle filters"
            >
              {/* Funnel icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              {activeFilterCount > 0 && (
                <span className="admin-icon-badge">{activeFilterCount}</span>
              )}
            </button>

            {/* Filter Panel Dropdown */}
            {filterOpen && (
              <div className="admin-icon-panel admin-filter-panel">
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

          {/* Sort Icon Button */}
          <div className="admin-icon-btn-wrap" ref={sortRef}>
            <button
              type="button"
              className={`admin-icon-btn${sortOpen ? ' active' : ''}`}
              onClick={() => { setSortOpen((p) => !p); setFilterOpen(false); }}
              title="Sort"
              aria-label="Toggle sort"
            >
              {/* Sort icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>

            {/* Sort Panel Dropdown */}
            {sortOpen && (
              <div className="admin-icon-panel admin-sort-panel">
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
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
