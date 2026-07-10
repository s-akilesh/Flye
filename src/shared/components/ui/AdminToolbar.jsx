import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Input } from './Input';
import { Button } from './Button';

/**
 * AdminToolbar
 * Renders:
 * - A single row containing: [Search Input (flex: 1)] [Filter Button (38px square)] [Sort Button (38px square)]
 * - Clicking filter opens a bottom drawer with filter options.
 * - Clicking sort opens a bottom drawer with sort options.
 * - Uses React Portal to escape parent CSS transform animations.
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
  onApply,
  className = "admin-toolbar-wrapper card-glass",
  style = { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', position: 'relative', zIndex: 100 },
  children,
  desktopActions,
  searchWidth,
  showSearchIcon = false
}) => {
  const [activeDrawer, setActiveDrawer] = useState(null); // 'filter' | 'sort' | null

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply();
    }
    setActiveDrawer(null);
  };

  return (
    <div className={className} style={style}>
      {/* Search Input */}
      <div style={{ flex: searchWidth ? 'none' : 1, width: searchWidth || 'auto', position: 'relative' }}>
        <Input
          type="text"
          id={searchId}
          className="form-input"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          style={{ width: '100%', paddingRight: showSearchIcon ? '36px' : '14px' }}
        />
        {showSearchIcon && (
          <span style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted, #9ca3af)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
        )}
      </div>

      {searchWidth && <div style={{ flex: 1 }} />}

      {/* Filter Button */}
      <Button
        type="button"
        variant="secondary"
        onClick={() => setActiveDrawer('filter')}
        style={{
          width: '38px',
          height: '38px',
          minWidth: '38px',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        {activeFilterCount > 0 && (
          <span className="admin-icon-badge" style={{ position: 'absolute', top: '-4px', right: '-4px' }}>{activeFilterCount}</span>
        )}
      </Button>

      {/* Sort Button */}
      <Button
        type="button"
        variant="secondary"
        onClick={() => setActiveDrawer('sort')}
        style={{
          width: '38px',
          height: '38px',
          minWidth: '38px',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="16" y2="12" />
          <line x1="4" y1="18" x2="12" y2="18" />
        </svg>
      </Button>

      {/* Desktop/Laptop Actions Container */}
      {desktopActions && (
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {desktopActions}
        </div>
      )}

      {/* Bottom Drawer (Rendered via React Portal directly into body) */}
      {activeDrawer !== null && createPortal(
        <>
          <div className="mobile-drawer-backdrop active" onClick={() => setActiveDrawer(null)} />
          <div className="mobile-drawer active">
            <div className="mobile-drawer-header">
              <h3>{activeDrawer === 'filter' ? 'Filters' : 'Sort By'}</h3>
              <button type="button" className="mobile-drawer-close" onClick={() => setActiveDrawer(null)}>
                <span className="material-icons">close</span>
              </button>
            </div>

            {activeDrawer === 'filter' ? (
              <>
                {/* Filters Section */}
                <div className="mobile-drawer-section">
                  {children}
                </div>

                {/* Action Buttons */}
                <div className="mobile-drawer-actions" style={{ marginTop: 'var(--space-4)' }}>
                  <Button variant="secondary" onClick={handleReset} style={{ flex: 1 }}>
                    Reset
                  </Button>
                  <Button variant="primary" onClick={handleApply} style={{ flex: 1 }}>
                    Apply
                  </Button>
                </div>
              </>
            ) : (
              /* Sorting Section */
              <div className="mobile-drawer-section" style={{ padding: '4px 0' }}>
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSortChange({ target: { value: opt.value } });
                      setActiveDrawer(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: sortValue === opt.value ? 'rgba(139, 92, 246, 0.12)' : 'none',
                      border: 'none',
                      borderRadius: '8px',
                      color: sortValue === opt.value ? 'var(--accent-violet)' : 'var(--text-primary)',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: sortValue === opt.value ? '600' : '400',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  >
                    <span>{opt.label}</span>
                    {sortValue === opt.value && (
                      <span className="material-icons" style={{ fontSize: '16px', color: 'var(--accent-violet)' }}>check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>,
        document.body
      )}
    </div>
  );
};
