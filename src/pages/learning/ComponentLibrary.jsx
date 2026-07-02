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

  // Read search query from URL params if present
  useEffect(() => {
    const urlQuery = searchParams.get('search');
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams]);

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

      {/* Answer Three Questions Callout Banner - 3 Separate Cards */}
      <div className="workspace-info-grid">
        <div className="workspace-info-card violet">
          <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-violet)' }}>
            What am I learning?
          </span>
          <p style={{ fontSize: '11.5px', color: 'var(--text-primary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
            Independent electronic components. Every component is treated as its own complete topic with targeted learning goals.
          </p>
        </div>
        
        <div className="workspace-info-card blue">
          <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-blue)' }}>
            Why is it important?
          </span>
          <p style={{ fontSize: '11.5px', color: 'var(--text-primary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
            Students search, track, and complete lessons for each component individually. Achievements, XP points, and quizzes are tracked per component.
          </p>
        </div>
        
        <div className="workspace-info-card emerald">
          <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-emerald)' }}>
            What should I learn next?
          </span>
          <p style={{ fontSize: '11.5px', color: 'var(--text-primary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
            Select any component card (such as <strong>LDR</strong> or <strong>Thermistor</strong>) to inspect its layers, take its quiz, and complete the build challenge.
          </p>
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
