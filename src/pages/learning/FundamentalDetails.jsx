import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LearningRepository } from '../../data/learning';
import { ConceptSimulator } from '../../components/learning/ConceptSimulator';

const STAGES = [
  { id: 'imagine', label: '💡 Imagine', num: 1 },
  { id: 'try', label: '🧪 Try', num: 2 },
  { id: 'understand', label: '🧠 Understand', num: 3 },
  { id: 'real-world', label: '🌍 See Around You', num: 4 },
  { id: 'continue', label: '🚀 Continue', num: 5 }
];

export const FundamentalDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [revealChallenge, setRevealChallenge] = useState(false);

  // Load lesson data
  const lesson = useMemo(() => {
    return LearningRepository.getFundamentalBySlug(slug);
  }, [slug]);

  // Resolve roadmap info for breadcrumbs
  const roadmapInfo = useMemo(() => {
    return LearningRepository.getRoadmapComponent(slug);
  }, [slug]);

  const activeStageId = searchParams.get('stage') || 'imagine';
  const activeStage = useMemo(() => {
    return STAGES.find(s => s.id === activeStageId) || STAGES[0];
  }, [activeStageId]);

  const setStage = (id) => {
    setSearchParams({ stage: id });
  };

  // Reset stage to imagine when slug changes and save to navigation history
  useEffect(() => {
    if (lesson) {
      setStage('imagine');
      setRevealChallenge(false);

      // Save continue learning metadata
      localStorage.setItem('flyen_last_lesson', JSON.stringify({
        name: lesson.name,
        slug: lesson.slug,
        progress: 50, // mock progress
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
      recentsList = recentsList.filter(item => item.path !== `/learning/fundamentals/${lesson.slug}`);
      recentsList.unshift({
        title: lesson.name,
        path: `/learning/fundamentals/${lesson.slug}`
      });
      localStorage.setItem('flyen_recent_history', JSON.stringify(recentsList.slice(0, 5)));
    }
  }, [slug, lesson]);

  if (!lesson) {
    return (
      <div style={{ paddingBottom: 'var(--space-8)', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#fff' }}>Lesson not found</h2>
        <button className="cta-button" onClick={() => navigate(ROUTES.LEARNING_WORKSPACE)}>
          Return to Workspace
        </button>
      </div>
    );
  }

  const handleNextClick = () => {
    if (activeStage.num < 5) {
      const next = STAGES.find(s => s.num === activeStage.num + 1);
      if (next) {
        setStage(next.id);
        window.scrollTo(0, 0);
      }
    } else {
      // Stage 5 complete - go to next lesson or components
      if (lesson.nextSlug === 'resistor') {
        navigate(`${ROUTES.LEARNING_COMPONENTS}/resistor`);
      } else {
        navigate(`/learning/fundamentals/${lesson.nextSlug}`);
      }
    }
  };

  const renderStageContent = () => {
    switch (activeStage.id) {
      case 'imagine':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="workspace-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.005)' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-violet)', letterSpacing: '1px' }}>
                Pedagogical Analogy
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '8px 0' }}>
                {lesson.analogy.title}
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                {lesson.analogy.description}
              </p>

              <div 
                style={{ 
                  marginTop: '24px', 
                  padding: '16px', 
                  background: 'rgba(139, 92, 246, 0.04)', 
                  border: '1px solid rgba(139, 92, 246, 0.15)', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '24px' }}>💡</div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-violet)' }}>
                    Electricity behaves the same way
                  </span>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                    In electrical circuits, this exact concept is defined as <strong style={{ color: 'var(--accent-violet)', fontSize: '14.5px' }}>{lesson.name}</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'try':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="workspace-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.005)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '1px' }}>
                  Interactive Simulator
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '4px 0' }}>
                  {lesson.explore.title}
                </h2>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  {lesson.explore.description}
                </p>
              </div>

              <ConceptSimulator config={lesson.simulatorConfig} />
            </div>
          </div>
        );

      case 'understand':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-emerald)', letterSpacing: '1px' }}>
                Core Physics
              </span>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '4px 0' }}>
                {lesson.name} Explained
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
              {lesson.understand.questions.map((item, idx) => (
                <div 
                  key={idx} 
                  className="workspace-card" 
                  style={{ 
                    gridColumn: 'span 6', 
                    padding: '16px 20px', 
                    background: 'rgba(255,255,255,0.005)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '6px' 
                  }}
                >
                  <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-emerald)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {item.q}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: '1.4' }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'real-world':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Real World Applications */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '1px' }}>
                Real World Examples
              </span>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '4px 0' }}>
                Where You See {lesson.name}
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
              {lesson.applications.map((app, idx) => (
                <div 
                  key={idx} 
                  className="workspace-card" 
                  style={{ 
                    gridColumn: 'span 6', 
                    padding: '16px 20px', 
                    background: 'rgba(255,255,255,0.005)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '4px' 
                  }}
                >
                  <span style={{ fontSize: '9px', fontWeight: '750', textTransform: 'uppercase', color: 'var(--accent-blue)' }}>
                    {app.value}
                  </span>
                  <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', margin: '2px 0 6px 0' }}>
                    {app.title}
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                    {app.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Real Life Challenge Dropdown Card */}
            <div 
              className="workspace-card" 
              style={{ 
                padding: '20px', 
                background: 'rgba(59, 130, 246, 0.02)', 
                border: '1px solid rgba(59, 130, 246, 0.15)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '20px' }}>🌍</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-blue)' }}>
                    {lesson.challenge.title}
                  </span>
                  <p style={{ fontSize: '13.5px', fontWeight: '700', color: '#fff', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                    {lesson.challenge.question}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setRevealChallenge(!revealChallenge)} 
                className="cta-button"
                style={{ 
                  alignSelf: 'flex-start', 
                  padding: '6px 12px', 
                  fontSize: '11px',
                  background: revealChallenge ? 'rgba(255,255,255,0.06)' : 'var(--accent-blue)',
                  borderColor: revealChallenge ? 'rgba(255,255,255,0.1)' : 'var(--accent-blue)',
                  color: '#fff'
                }}
              >
                {revealChallenge ? 'Hide Answer' : 'Reveal Answer'}
              </button>

              {revealChallenge && (
                <div 
                  style={{ 
                    paddingTop: '12px', 
                    borderTop: '1px solid rgba(59, 130, 246, 0.1)', 
                    fontSize: '13px', 
                    color: 'var(--text-primary)', 
                    lineHeight: '1.5',
                    animation: 'electricityJiggle 0.2s ease'
                  }}
                >
                  {lesson.challenge.answer}
                </div>
              )}
            </div>
          </div>
        );

      case 'continue':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="workspace-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.005)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-violet)', letterSpacing: '1px' }}>
                  Lesson Summary
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '4px 0' }}>
                  Key Concept Checklist
                </h2>
              </div>

              {/* Summary cheat sheet key value row */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px', 
                  background: 'rgba(3,3,5,0.5)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '8px', 
                  padding: '16px' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Physical Concept</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Electrical Term (Analogy)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#fff', fontWeight: '800' }}>{lesson.name}</span>
                  <span style={{ fontSize: '13px', color: 'var(--accent-violet)', fontWeight: '800' }}>
                    {lesson.symbol} ({lesson.unit})
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#fff' }}>Analogy Link</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {lesson.id === 'electricity' ? 'Marbles pushing' : 
                     lesson.id === 'voltage' ? 'Water Pressure / Height' : 
                     lesson.id === 'current' ? 'Water Flow Rate' : 
                     lesson.id === 'resistance' ? 'Hose constriction' : 
                     lesson.id === 'power' ? 'Water Wheel spin speed' : 
                     lesson.id === 'energy' ? 'Accumulated Water Bucket' : 
                     lesson.id === 'ac-dc' ? 'Conveyor Belt vs Hand Saw' : 
                     lesson.id === 'series-circuit' ? 'Single trail line' : 
                     'Parallel toll lanes'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '750', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Specifications
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {lesson.specs.map((sp, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{sp.label}</span>
                      <p style={{ fontSize: '12.5px', color: '#fff', margin: '2px 0 0 0', fontWeight: 'bold' }}>{sp.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="component-details-container" style={{ paddingBottom: 'var(--space-8)', maxWidth: '1000px', margin: '0 auto' }}>
      


      {/* 2. Milestone stage indicator tracker */}
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
            {lesson.name}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px' }}>➔</span>
          <span style={{ fontSize: '13px', fontWeight: '750', color: 'var(--accent-violet)' }}>
            Stage {activeStage.num} of 5: {activeStage.label.substring(2)}
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
      <div className="stage-content-wrapper" style={{ minHeight: '320px' }}>
        {renderStageContent()}
      </div>

      {/* 4. Bottom Controls */}
      <div className="stage-navigation-footer">
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
          ← Back
        </button>

        <button
          className="cta-button"
          onClick={handleNextClick}
          style={{ 
            padding: '8px 16px',
            fontSize: '12px'
          }}
        >
          {activeStage.num < 5 
            ? `Next: ${STAGES.find(s => s.num === activeStage.num + 1).label.substring(2)} →` 
            : lesson.nextSlug === 'resistor' 
              ? 'Start Learning Components: Resistor ➔' 
              : 'Continue to Next Lesson ➔'
          }
        </button>
      </div>

    </div>
  );
};
