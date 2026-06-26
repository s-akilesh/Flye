import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LearningRepository } from '../../data/learning';

// Import subcomponents
import { ComponentOverview } from '../../components/learning/ComponentOverview';
import { ComponentInside } from '../../components/learning/ComponentInside';
import { ComponentLearningCards } from '../../components/learning/ComponentLearningCards';
import { ComponentApplications } from '../../components/learning/ComponentApplications';
import { ComponentQuickSummary } from '../../components/learning/ComponentQuickSummary';
import { ComponentFutureModules } from '../../components/learning/ComponentFutureModules';

export const ComponentDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Load component data
  const componentData = useMemo(() => {
    return LearningRepository.getComponentBySlug(slug);
  }, [slug]);

  // Load family container
  const family = useMemo(() => {
    return LearningRepository.getFamilyBySlug(slug);
  }, [slug]);

  // Workspace Interactivity States
  const [isExploded, setIsExploded] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState(null);

  // Reset states if slug changes
  useEffect(() => {
    setIsExploded(false);
    setSelectedPartId(null);
  }, [slug]);

  if (!componentData) {
    return (
      <div className="workspace-card" style={{ padding: '64px 32px', textAlign: 'center', opacity: 0.8 }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Component Not Found
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          We couldn't find a learning module for "{slug}". Explore our component library for available topics.
        </p>
        <button 
          className="cta-button" 
          onClick={() => navigate(ROUTES.LEARNING_COMPONENTS)}
        >
          Back to Library
        </button>
      </div>
    );
  }

  const handlePartClick = (partId) => {
    if (selectedPartId === partId) {
      setSelectedPartId(null);
    } else {
      setSelectedPartId(partId);
      // Scroll right-side "Take It Apart Details" section into view
      const detailEl = document.getElementById('take-it-apart-details-section');
      if (detailEl) {
        detailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const selectedPart = componentData.parts?.find(p => p.id === selectedPartId) || null;

  return (
    <div className="component-details-container">
      
      {/* 1. Component Family & Variant Selector (Breadcrumb Selector) */}
      <div className="workspace-family-selector-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <button 
            className="product-btn" 
            onClick={() => navigate(ROUTES.LEARNING_COMPONENTS)}
            style={{ padding: '6px', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Back to Component Library"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12,19 5,12 12,5" />
            </svg>
          </button>
          
          <div className="family-breadcrumbs" style={{ fontSize: '11px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>{componentData.category}</span>
            <span style={{ color: 'var(--border-active)', opacity: 0.5 }}>/</span>
            <span style={{ color: 'var(--accent-violet)' }}>{family ? family.name : componentData.name}</span>
          </div>
        </div>

        {family && family.variants && family.variants.length > 1 && (
          <div className="variant-chips-list" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', flexWrap: 'wrap' }}>
            {family.variants.map((v) => {
              const isActive = v.slug === slug;
              const displayName = v.name
                .replace(' Capacitor', '')
                .replace(' Resistor', '')
                .replace(' Diode', '')
                .replace('Light Emitting Diode', 'LED');
              return (
                <button
                  key={v.slug}
                  className={`variant-chip ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(`${ROUTES.LEARNING_COMPONENTS}/${v.slug}`)}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="component-details-grid">
        
        {/* LEFT COLUMN: Sticky Illustration Panel */}
        <div className="details-left-pane">
          
          {/* Component Image / Take It Apart Illustration */}
          <ComponentInside 
            component={componentData}
            isExploded={isExploded}
            setIsExploded={setIsExploded}
            selectedPartId={selectedPartId}
            onPartClick={handlePartClick}
          />

          {/* Action Buttons Directly Below Image */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {componentData.parts && componentData.parts.length > 0 && (
              <button 
                className={`cta-button ${isExploded ? 'secondary' : ''}`}
                style={{ flex: 1, fontSize: '12px', padding: '10px' }}
                onClick={() => setIsExploded(!isExploded)}
              >
                {isExploded ? 'Assemble Component' : 'Take It Apart'}
              </button>
            )}
            <button 
              className="cta-button secondary"
              style={{ flex: 1, fontSize: '12px', padding: '10px' }}
              onClick={() => {
                const section = document.getElementById('where-you-see-this-section');
                if (section) section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }}
            >
              Working Principle
            </button>
          </div>

          {/* Component Title & Metadata Badge */}
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              {componentData.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)' }}>
                {componentData.category}
              </span>
              <span className={`status-badge ${componentData.status}`}>
                {componentData.status === 'completed' && 'Mastered'}
                {componentData.status === 'continue' && 'Active'}
                {componentData.status === 'new' && 'New'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Scrollable Widgets list */}
        <div className="details-right-pane">
          
          {/* A. Specifications */}
          <ComponentOverview component={componentData} />

          {/* B. Overview Description */}
          <section className="workspace-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '10px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-violet)' }}>
              Overview
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>What is it?</h3>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
              {componentData.description}
            </p>
          </section>

          {/* C. Applications (general uses list) */}
          <section className="workspace-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '10px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-violet)' }}>
              General Applications
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {componentData.applications?.map((app, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    padding: '8px 12px', 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)'
                  }}
                >
                  ⚙️ {app.role || app.product}
                </div>
              ))}
            </div>
          </section>

          {/* D. Take It Apart Details (Specific details of active part selected on left) */}
          <section 
            className="workspace-card" 
            id="take-it-apart-details-section"
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-violet)' }}>
                  Interactive Inspection
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Take It Apart Details</h3>
              </div>
              {selectedPartId && (
                <button 
                  className="product-btn" 
                  onClick={() => setSelectedPartId(null)}
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  Reset View
                </button>
              )}
            </div>

            {selectedPart ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)' }}>🔬 Active Part:</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{selectedPart.name}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  {selectedPart.description}
                </p>
                <div className="learning-cards-grid">
                  {selectedPart.cards?.map((card, idx) => (
                    <div key={idx} className="learning-card">
                      <h4 className="learning-card-question">{card.question}</h4>
                      <p className="learning-card-answer">{card.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '8px', background: 'rgba(255,255,255,0.003)' }}>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
                  Click any labeled part of the component on the left side to inspect its internal materials and secrets.
                </p>
              </div>
            )}
          </section>

          {/* E. Learning Cards (General Q&A, always visible) */}
          <ComponentLearningCards component={componentData} />

          {/* F. Where You See This (Redesigned visual product grid) */}
          <ComponentApplications component={componentData} />

          {/* G. Common Mistakes */}
          {componentData.commonMistakes && componentData.commonMistakes.length > 0 && (
            <section className="workspace-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-red, #ef4444)' }}>
                  Pitfalls & Warnings
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Common Mistakes</h3>
              </div>
              <div className="learning-cards-grid">
                {componentData.commonMistakes.map((mistake, idx) => (
                  <div 
                    key={idx} 
                    className="learning-card" 
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.015)', 
                      borderColor: 'rgba(239, 68, 68, 0.08)' 
                    }}
                  >
                    <h4 className="learning-card-question" style={{ color: 'var(--accent-red, #ef4444)' }}>{mistake.question}</h4>
                    <p className="learning-card-answer">{mistake.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* H. Quick Summary */}
          <ComponentQuickSummary component={componentData} />

          {/* I. Future Modules */}
          <ComponentFutureModules />
        </div>
      </div>
    </div>
  );
};
