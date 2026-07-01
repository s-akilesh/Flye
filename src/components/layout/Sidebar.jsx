import React from 'react';
import { CATEGORIES, CATEGORY_LABELS } from '../../constants/categories';
import { DIFFICULTIES, DIFFICULTY_LABELS } from '../../constants/difficulties';
import { PROJECT_FEATURES, FEATURE_LABELS } from '../../constants/projectFeatures';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';

export const Sidebar = ({
  isOpen,
  onClose,
  activeCategories,
  toggleCategory,
  activeDifficulties,
  toggleDifficulty,
  activeFeatures,
  toggleFeature,
  activeProjectLevels,
  toggleProjectLevel
}) => {
  return (
    <aside className={`marketplace-sidebar ${isOpen ? 'active' : ''}`} id="marketplace-sidebar">
      {/* Close button for Mobile drawer */}
      <Button
        variant="ghost"
        className="btn-close-sidebar"
        id="btn-close-sidebar"
        onClick={onClose}
      >
        &times;
      </Button>
      
      {/* Category Multi-Select Filters */}
      <div className="filter-group">
        <h4>Categories</h4>
        <div className="filter-chips-multiselect" id="category-chips-container">
          {Object.values(CATEGORIES).map((cat) => (
            <Chip
              key={cat}
              className="chip-filter"
              active={activeCategories.includes(cat)}
              onClick={() => toggleCategory(cat)}
              label={CATEGORY_LABELS[cat]}
            />
          ))}
        </div>
      </div>



      {/* Included Features Checkboxes */}
      <div className="filter-group">
        <h4>Included Features</h4>
        <div className="checkbox-filters-list">
          {Object.values(PROJECT_FEATURES).map((f) => (
            <label key={f} className="checkbox-container">
              <input
                type="checkbox"
                value={f}
                checked={activeFeatures.includes(f)}
                onChange={() => toggleFeature(f)}
              />
              <span className="checkmark"></span>
              {FEATURE_LABELS[f]}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};
