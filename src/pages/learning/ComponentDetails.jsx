import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LearningRepository } from '../../data/learning';

// Import subcomponents
import { ComponentHero } from '../../components/learning/ComponentHero';
import { ComponentVariants } from '../../components/learning/ComponentVariants';
import { ComponentOverview } from '../../components/learning/ComponentOverview';
import { ComponentSpecifications } from '../../components/learning/ComponentSpecifications';
import { ComponentTakeApart } from '../../components/learning/ComponentTakeApart';
import { ComponentWorkingPrinciple } from '../../components/learning/ComponentWorkingPrinciple';
import { ComponentApplications } from '../../components/learning/ComponentApplications';
import { ComponentCommonMistakes } from '../../components/learning/ComponentCommonMistakes';
import { ComponentRelatedComponents } from '../../components/learning/ComponentRelatedComponents';
import { ComponentNextLearning } from '../../components/learning/ComponentNextLearning';

const STAGES = [
  { id: 'learn', label: '① Learn', num: 1 },
  { id: 'explore', label: '② Explore', num: 2 },
  { id: 'understand', label: '③ Understand', num: 3 },
  { id: 'real-world', label: '④ Real World', num: 4 },
  { id: 'build', label: '⑤ Build', num: 5 }
];

export const ComponentDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Load component data
  const componentData = useMemo(() => {
    return LearningRepository.getComponentBySlug(slug);
  }, [slug]);

  // Load family container
  const family = useMemo(() => {
    return LearningRepository.getFamilyBySlug(slug);
  }, [slug]);

  // Resolve roadmap breadcrumbs info
  const roadmapInfo = useMemo(() => {
    const lookupId = family ? family.id : slug;
    return LearningRepository.getRoadmapComponent(lookupId);
  }, [family, slug]);

  // Resolve active stage
  const activeStageId = searchParams.get('stage') || 'learn';
  const activeStage = useMemo(() => {
    return STAGES.find(s => s.id === activeStageId) || STAGES[0];
  }, [activeStageId]);

  const setStage = (id) => {
    setSearchParams({ stage: id });
  };

  // Reset stage to learn when slug changes and save history
  useEffect(() => {
    setStage('learn');
    
    const roadmapComp = LearningRepository.getRoadmapComponent(slug);
    const activeName = componentData ? componentData.name : (roadmapComp ? roadmapComp.name : slug);
    if (activeName) {
      // Save last lesson
      localStorage.setItem('flyen_last_lesson', JSON.stringify({
        name: activeName,
        slug: slug,
        progress: 75, // mock progress
        isFallback: false
      }));

      // Add to recently visited
      const savedRecents = localStorage.getItem('flyen_recent_history');
      let recentsList = [];
      if (savedRecents) {
        try {
          recentsList = JSON.parse(savedRecents);
        } catch (e) {}
      }
      recentsList = recentsList.filter(item => item.path !== `/learning/components/${slug}`);
      recentsList.unshift({
        title: activeName,
        path: `/learning/components/${slug}`
      });
      localStorage.setItem('flyen_recent_history', JSON.stringify(recentsList.slice(0, 5)));
    }
  }, [slug, componentData]);

  // Placeholder screen if component does not exist in active database (Coming Soon)
  if (!componentData) {
    const roadmapComp = LearningRepository.getRoadmapComponent(slug);
    
    return (
      <div style={{ paddingBottom: 'var(--space-8)', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-4)' }}>
          <button 
            className="product-btn" 
            onClick={() => navigate(ROUTES.LEARNING_WORKSPACE)}
            style={{ padding: '6px', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Back to Workspace"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12,19 5,12 12,5" />
            </svg>
          </button>
          
          <div className="family-breadcrumbs" style={{ fontSize: '11px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {/* Home Link */}
            <span style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }} onClick={() => navigate('/')} title="Home">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>&gt;</span>

            {/* Workspace Link */}
            <span style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }} onClick={() => navigate(ROUTES.LEARNING_WORKSPACE)} title="Workspace">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span className="desktop-breadcrumb-text">Workspace</span>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>&gt;</span>

            {/* Components Link */}
            <span style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }} onClick={() => navigate(ROUTES.LEARNING_COMPONENTS)} title="Components">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="12" y1="8" x2="12" y2="16" />
              </svg>
              <span className="desktop-breadcrumb-text">Components</span>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>&gt;</span>

            {roadmapComp && (
              <>
                <span className="desktop-breadcrumb-item" style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => navigate(ROUTES.LEARNING_WORKSPACE)}>
                  {roadmapComp.levelTitle}
                </span>
                <span className="desktop-breadcrumb-item" style={{ color: 'rgba(255,255,255,0.15)' }}>&gt;</span>
                <span className="desktop-breadcrumb-item" style={{ color: 'var(--text-muted)' }}>
                  {roadmapComp.categoryName}
                </span>
                <span className="desktop-breadcrumb-item" style={{ color: 'rgba(255,255,255,0.15)' }}>&gt;</span>
              </>
            )}
            <span style={{ color: 'var(--accent-violet)', fontWeight: '800' }}>{roadmapComp ? roadmapComp.name : slug}</span>
          </div>
        </div>

        {/* Informative placeholder workspace card */}
        <div className="workspace-card" style={{ padding: '48px var(--space-6)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', border: '1px dashed var(--border-subtle)', background: 'rgba(255,255,255,0.005)' }}>
          <div style={{ fontSize: '40px' }}>⏳</div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>
            {roadmapComp ? roadmapComp.name : slug} Workspace Coming Soon
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '500px', margin: 0, lineHeight: '1.5' }}>
            {roadmapComp ? roadmapComp.description : ''} This learning workspace module is currently under active development. In the next stage, we will integrate interactive vector illustration sheets, dynamic parts inspection, and complete lab tests.
          </p>

          <button 
            className="cta-button" 
            style={{ marginTop: '16px' }}
            onClick={() => navigate(ROUTES.LEARNING_WORKSPACE)}
          >
            Return to Learning Journey
          </button>
        </div>
      </div>
    );
  }

  const renderStageContent = () => {
    switch (activeStage.id) {
      case 'learn':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ComponentHero component={componentData} onPrerequisiteClick={(prereq) => alert(`Prerequisite: ${prereq}`)} />
            <ComponentVariants family={family} currentSlug={slug} />
            <ComponentOverview component={componentData} />
            <ComponentSpecifications component={componentData} />
          </div>
        );
      case 'explore':
        return <ComponentTakeApart component={componentData} />;
      case 'understand':
        return <ComponentWorkingPrinciple component={componentData} />;
      case 'real-world':
        return <ComponentApplications component={componentData} />;
      case 'build':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ComponentCommonMistakes component={componentData} />
            <ComponentRelatedComponents component={componentData} />
            <ComponentNextLearning component={componentData} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="component-details-container" style={{ paddingBottom: 'var(--space-8)', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* 1. Breadcrumbs Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <button 
          className="product-btn" 
          onClick={() => navigate(ROUTES.LEARNING_WORKSPACE)}
          style={{ padding: '6px', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Back to Workspace"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12,19 5,12 12,5" />
          </svg>
        </button>
        
        <div className="family-breadcrumbs" style={{ fontSize: '11px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Home Link */}
          <span style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }} onClick={() => navigate('/')} title="Home">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>&gt;</span>

          {/* Workspace Link */}
          <span style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }} onClick={() => navigate(ROUTES.LEARNING_WORKSPACE)} title="Workspace">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span className="desktop-breadcrumb-text">Workspace</span>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>&gt;</span>

          {/* Components Link */}
          <span style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }} onClick={() => navigate(ROUTES.LEARNING_COMPONENTS)} title="Components">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="12" y1="8" x2="12" y2="16" />
            </svg>
            <span className="desktop-breadcrumb-text">Components</span>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>&gt;</span>

          {roadmapInfo && (
            <>
              <span className="desktop-breadcrumb-item" style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => navigate(ROUTES.LEARNING_WORKSPACE)}>
                {roadmapInfo.levelTitle}
              </span>
              <span className="desktop-breadcrumb-item" style={{ color: 'rgba(255,255,255,0.15)' }}>&gt;</span>
              <span className="desktop-breadcrumb-item" style={{ color: 'var(--text-muted)' }}>
                {roadmapInfo.categoryName}
              </span>
              <span className="desktop-breadcrumb-item" style={{ color: 'rgba(255,255,255,0.15)' }}>&gt;</span>
            </>
          )}
          <span 
            className="desktop-breadcrumb-item"
            style={{ color: 'var(--text-muted)', cursor: family ? 'pointer' : 'default' }}
            onClick={() => family && navigate(`${ROUTES.LEARNING_COMPONENTS}/${family.id}`)}
          >
            {family ? family.name : componentData.name}
          </span>
          <span className="desktop-breadcrumb-item" style={{ color: 'rgba(255,255,255,0.15)' }}>&gt;</span>
          <span style={{ color: 'var(--accent-violet)', fontWeight: '800' }}>{componentData.name}</span>
        </div>
      </div>

      {/* 2. Journey Milestone Tracker (Duolingo Style Progress Header) */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          background: 'rgba(255,255,255,0.01)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: '12px', 
          padding: '16px 24px', 
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: '850', color: '#fff', letterSpacing: '-0.3px' }}>
            {componentData.name}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px' }}>➔</span>
          <span style={{ fontSize: '13px', fontWeight: '750', color: 'var(--accent-violet)' }}>
            Stage {activeStage.num} of 5: {activeStage.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>
        </div>

        {/* Milestone Indicator circles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {STAGES.map((s, idx) => {
            const isCompleted = s.num < activeStage.num;
            const isCurrent = s.id === activeStage.id;
            return (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => setStage(s.id)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor: isCurrent 
                      ? 'var(--accent-violet)' 
                      : isCompleted 
                        ? 'var(--accent-emerald)' 
                        : 'rgba(255, 255, 255, 0.08)',
                    background: isCurrent 
                      ? 'rgba(139, 92, 246, 0.15)' 
                      : isCompleted 
                        ? 'rgba(16, 185, 129, 0.1)' 
                        : 'rgba(255, 255, 255, 0.01)',
                    color: isCurrent 
                      ? 'var(--accent-violet)' 
                      : isCompleted 
                        ? 'var(--accent-emerald)' 
                        : 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 200ms ease'
                  }}
                  title={s.label}
                >
                  {isCompleted ? '✓' : s.num}
                </button>
                {idx < STAGES.length - 1 && (
                  <div 
                    style={{ 
                      width: '20px', 
                      height: '2px', 
                      background: isCompleted ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.08)',
                      opacity: 0.6
                    }} 
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 3. Stage Content Area */}
      <div className="stage-content-wrapper" style={{ minHeight: '380px' }}>
        {renderStageContent()}
      </div>

      {/* 4. Bottom Stage Navigation Controls */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <button
          className="product-btn"
          disabled={activeStage.num === 1}
          onClick={() => {
            const prev = STAGES.find(s => s.num === activeStage.num - 1);
            if (prev) {
              setStage(prev.id);
              window.scrollTo(0, 0);
            }
          }}
          style={{ 
            opacity: activeStage.num === 1 ? 0.3 : 1, 
            cursor: activeStage.num === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          ← Previous Stage
        </button>

        <button
          className="cta-button"
          disabled={activeStage.num === 5}
          onClick={() => {
            const next = STAGES.find(s => s.num === activeStage.num + 1);
            if (next) {
              setStage(next.id);
              window.scrollTo(0, 0);
            }
          }}
          style={{ 
            opacity: activeStage.num === 5 ? 0.3 : 1, 
            cursor: activeStage.num === 5 ? 'not-allowed' : 'pointer',
            padding: '8px 16px',
            fontSize: '12px'
          }}
        >
          {activeStage.num < 5 
            ? `Next Stage: ${STAGES.find(s => s.num === activeStage.num + 1).id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} →` 
            : 'Lesson Completed'
          }
        </button>
      </div>

    </div>
  );
};
