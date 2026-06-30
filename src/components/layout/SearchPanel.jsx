import React from 'react';
import { Dropdown } from '../ui/Dropdown';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const SearchPanel = ({
  searchQuery,
  setSearchQuery,
  onOpenMobileFilters,
  sortBy,
  setSortBy
}) => {
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'difficulty', label: 'Difficulty' }
  ];

  return (
    <div className="marketplace-toolbar">
      <div className="search-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" />
        </svg>
        <Input
          type="text"
          id="marketplace-search-input"
          placeholder="Search projects, technologies, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="toolbar-actions">
        {/* Mobile Filter Toggle Button */}
        <Button className="btn-mobile-filters" id="btn-mobile-filters" onClick={onOpenMobileFilters}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <span className="btn-filter-text">Filters</span>
        </Button>

        {/* Sorting selector */}
        <div className="sort-wrapper">
          <svg className="sort-icon-svg" viewBox="0 0 24 24">
            <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
          </svg>
          <Dropdown
            options={sortOptions}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
