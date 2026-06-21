import React from 'react';
import { Dropdown } from '../ui/Dropdown';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const SearchPanel = ({
  searchQuery,
  setSearchQuery,
  onOpenMobileFilters,
  onOpenAIFinder,
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
          <svg viewBox="0 0 24 24" width="16" height="16">
            <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2" />
            <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" stroke-width="2" />
            <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" stroke-width="2" />
          </svg>
          Filters
        </Button>

        {/* AI Finder Toggle Button */}
        <Button className="btn-ai-toggle" id="btn-ai-toggle" onClick={onOpenAIFinder}>
          ✨ AI Finder
        </Button>

        {/* Sorting selector */}
        <Dropdown
          options={sortOptions}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        />
      </div>
    </div>
  );
};
