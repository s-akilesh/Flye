import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LearningRepository } from '../../data/learning';

// Import subcomponents
import { ComponentHero } from '../../components/learning/ComponentHero';
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

  // Workspace Interactivity States
  const [isExploded, setIsExploded] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState(null);

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
      setSelectedPartId(null); // Clear selection if clicked again
    } else {
      setSelectedPartId(partId);
      // Auto-scroll content cards area into view for better UX if needed
      const cardsEl = document.getElementById('learning-cards-section');
      if (cardsEl) {
        cardsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  return (
    <div>
      {/* Back to Library Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button 
          className="product-btn" 
          onClick={() => navigate(ROUTES.LEARNING_COMPONENTS)}
          style={{ padding: '8px', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12,19 5,12 12,5" />
          </svg>
        </button>
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Back to Library
        </span>
      </div>

      <div className="component-details-grid">
        {/* Left Interactive Illustration Column */}
        <div className="details-left-pane">
          <ComponentInside 
            component={componentData}
            isExploded={isExploded}
            setIsExploded={setIsExploded}
            selectedPartId={selectedPartId}
            onPartClick={handlePartClick}
          />
          <ComponentOverview component={componentData} />
        </div>

        {/* Right Content Column */}
        <div className="details-right-pane">
          <ComponentHero 
            component={componentData} 
            isExploded={isExploded}
            setIsExploded={setIsExploded}
          />
          
          <div id="learning-cards-section">
            <ComponentLearningCards 
              component={componentData} 
              selectedPartId={selectedPartId} 
              onClearSelection={() => setSelectedPartId(null)}
            />
          </div>

          <ComponentApplications component={componentData} />
          
          <ComponentQuickSummary component={componentData} />
          
          <ComponentFutureModules />
        </div>
      </div>
    </div>
  );
};
