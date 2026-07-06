import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LearningRepository } from '../../data/learning';

export const ComponentLibrary = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Load individual components
  const components = useMemo(() => LearningRepository.getComponents(), []);
  
  // Get all unique categories for tabs
  const categories = useMemo(() => {
    const cats = new Set();
    components.forEach(c => {
      if (c.category) cats.add(c.category);
    });
    return ['All', ...Array.from(cats)];
  }, [components]);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Read search/category query from URL params if present
  useEffect(() => {
    const urlQuery = searchParams.get('search');
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
    const catQuery = searchParams.get('category');
    if (catQuery) {
      const found = categories.find(c => c.toLowerCase() === catQuery.toLowerCase());
      if (found) {
        setSelectedCategory(found);
      } else {
        if (catQuery.toLowerCase().includes('semiconductor') || catQuery.toLowerCase().includes('semiconductors')) {
          const match = categories.find(c => c.toLowerCase().includes('semiconductor') || c.toLowerCase().includes('semiconductors'));
          if (match) setSelectedCategory(match);
        } else if (catQuery.toLowerCase().includes('passive')) {
          const match = categories.find(c => c.toLowerCase().includes('passive'));
          if (match) setSelectedCategory(match);
        } else if (catQuery.toLowerCase().includes('sensor') || catQuery.toLowerCase().includes('sensors')) {
          const match = categories.find(c => c.toLowerCase().includes('sensor') || c.toLowerCase().includes('sensors'));
          if (match) setSelectedCategory(match);
        } else if (catQuery.toLowerCase() === 'boards' || catQuery.toLowerCase().includes('board')) {
          const match = categories.find(c => c.toLowerCase().includes('board') || c.toLowerCase() === 'boards');
          if (match) setSelectedCategory(match);
        }
      }
    }
  }, [searchParams, categories]);

  // Perform dynamic filtering of components
  const filteredComponents = useMemo(() => {
    return components.filter((comp) => {
      const matchesCategory = selectedCategory === 'All' || comp.category === selectedCategory;
      
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      return matchesCategory && (
        comp.name.toLowerCase().includes(query) ||
        (comp.description || '').toLowerCase().includes(query) ||
        comp.category.toLowerCase().includes(query)
      );
    });
  }, [components, selectedCategory, searchQuery]);

  return (
    <div>
      <div className="workspace-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Explore Components</h1>
          <p>Explore basic electrical components, inspect their internal anatomy, and build practical circuits.</p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '300px' }}>
          <svg className="sidebar-search-icon" viewBox="0 0 24 24" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', fill: 'currentColor' }}>
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Search component library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '34px', width: '100%' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '24px' }} />

      {/* Components Grid */}
      {filteredComponents.length > 0 ? (
        <div className="component-card-grid">
          {filteredComponents.map((comp) => {
            return (
              <div
                key={comp.slug}
                className="workspace-card component-card"
                onClick={() => navigate(`${ROUTES.LEARNING_COMPONENTS}/${comp.slug}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="component-card-header">
                  <span className="component-card-category">{comp.category}</span>
                  {comp.symbolSvg && (
                    <div 
                      className="component-card-symbol"
                      dangerouslySetInnerHTML={{ __html: comp.symbolSvg }}
                    />
                  )}
                </div>
                <h3 className="component-card-title">{comp.name}</h3>
                <p className="component-card-desc">
                  {comp.description || 'Explore internal anatomy, exploded view layers, schematic specifications, quiz assessments, and build guides.'}
                </p>
                
                <div className="component-card-footer">
                  <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: '600' }}>
                    Start Learning Component →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="workspace-card" style={{ padding: '64px 32px', textAlign: 'center', opacity: 0.8 }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No Components Found
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            We couldn't find any components matching "{searchQuery}". Try clearing search or selecting another category.
          </p>
          <button 
            className="product-btn" 
            style={{ marginTop: '16px' }}
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
