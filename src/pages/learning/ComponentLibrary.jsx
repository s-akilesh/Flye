import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LearningRepository } from '../../data/learning';

export const ComponentLibrary = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Load static components and categories
  const components = useMemo(() => LearningRepository.getComponents(), []);
  const categories = useMemo(() => ['All', ...LearningRepository.getCategories()], []);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Read search query from URL params if present
  useEffect(() => {
    const urlQuery = searchParams.get('search');
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams]);

  // Perform dynamic filtering
  const filteredComponents = useMemo(() => {
    return components.filter((comp) => {
      const matchesCategory = selectedCategory === 'All' || comp.category === selectedCategory;
      const matchesSearch = 
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [components, selectedCategory, searchQuery]);

  return (
    <div>
      <div className="workspace-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Explore Components</h1>
          <p>Click any component to open the illustration workspace and take it apart.</p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '300px' }}>
          <svg className="sidebar-search-icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Search component library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '32px' }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="product-btn"
              style={{
                background: isActive ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                borderColor: isActive ? 'rgba(139, 92, 246, 0.3)' : 'var(--border-subtle)',
                color: isActive ? 'var(--accent-violet)' : 'var(--text-secondary)'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Components Grid */}
      {filteredComponents.length > 0 ? (
        <div className="component-card-grid">
          {filteredComponents.map((comp) => (
            <div
              key={comp.slug}
              className="workspace-card component-card"
              onClick={() => navigate(`${ROUTES.LEARNING_COMPONENTS}/${comp.slug}`)}
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
              <p className="component-card-desc">{comp.description}</p>
              
              <div className="component-card-footer">
                <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: '600' }}>
                  Explore inside →
                </span>
                <span className={`status-badge ${comp.status}`}>
                  {comp.status === 'completed' && '✓ Completed'}
                  {comp.status === 'continue' && 'Continue →'}
                  {comp.status === 'new' && 'New'}
                </span>
              </div>
            </div>
          ))}
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
