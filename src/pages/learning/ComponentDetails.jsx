import React, { useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LearningRepository } from '../../data/learning';

// Import reusable layout and styling engine subcomponents
import { 
  BeforeYouStartCard, 
  ProgressCard, 
  ComponentExplorer, 
  ComponentComparison, 
  BuildItYourselfCard 
} from '../../components/learning/ComponentLearningEngine';

export const ComponentDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Load component data (V3 schema)
  const componentData = useMemo(() => {
    return LearningRepository.getComponentBySlug(slug);
  }, [slug]);

  // Load family container
  const family = useMemo(() => {
    return LearningRepository.getFamilyBySlug(slug);
  }, [slug]);

  // Track page interaction state
  const [earnedXp, setEarnedXp] = useState(() => {
    const saved = localStorage.getItem(`flyen_xp_${slug}`);
    return saved ? Number(saved) : 0;
  });
  const [completed, setCompleted] = useState(() => {
    return localStorage.getItem(`flyen_completed_${slug}`) === 'true';
  });
  const [quizScore, setQuizScore] = useState(() => {
    const saved = localStorage.getItem(`flyen_quiz_score_${slug}`);
    return saved ? Number(saved) : null;
  });
  const [activeAnswers, setActiveAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [compareSlug, setCompareSlug] = useState('');

  // Auto-select first comparison option when component changes
  useEffect(() => {
    const list = componentData?.comparisonBoards || componentData?.comparisonSensors || [];
    if (list.length > 0) {
      setCompareSlug(list[0]);
    } else {
      setCompareSlug('');
    }
  }, [componentData]);

  const compareBoardData = useMemo(() => {
    return compareSlug ? LearningRepository.getComponentBySlug(compareSlug) : null;
  }, [compareSlug]);

  // Sync recent history on visit
  useEffect(() => {
    if (componentData) {
      localStorage.setItem('flyen_last_lesson', JSON.stringify({
        name: componentData.name,
        slug: slug,
        progress: completed ? 100 : 50,
        isFallback: false
      }));

      const savedRecents = localStorage.getItem('flyen_recent_history');
      let recentsList = [];
      if (savedRecents) {
        try { recentsList = JSON.parse(savedRecents); } catch (e) {}
      }
      recentsList = recentsList.filter(item => item.path !== `/learning/components/${slug}`);
      recentsList.unshift({
        title: componentData.name,
        path: `/learning/components/${slug}`
      });
      localStorage.setItem('flyen_recent_history', JSON.stringify(recentsList.slice(0, 5)));
    }
  }, [slug, componentData, completed]);

  // Handle quiz answer
  const handleAnswerSelect = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setActiveAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuiz = () => {
    if (!componentData.quiz) return;
    let score = 0;
    componentData.quiz.forEach((q, idx) => {
      if (activeAnswers[idx] === q.answer) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    localStorage.setItem(`flyen_quiz_score_${slug}`, score);

    // Reward XP for passing quiz (e.g. >= 50% score)
    const passed = score >= componentData.quiz.length / 2;
    if (passed && !completed) {
      const reward = componentData.xpReward || 50;
      const newXp = earnedXp + reward;
      setEarnedXp(newXp);
      localStorage.setItem(`flyen_xp_${slug}`, newXp);
    }
  };

  const handleBuildSuccess = (xpReward) => {
    setCompleted(true);
    localStorage.setItem(`flyen_completed_${slug}`, 'true');
    const newXp = earnedXp + xpReward;
    setEarnedXp(newXp);
    localStorage.setItem(`flyen_xp_${slug}`, newXp);
  };

  // Safe checks for variants list
  const nextVariant = useMemo(() => {
    if (!family || !family.variants) return null;
    const currentIdx = family.variants.findIndex(v => v.slug === slug);
    if (currentIdx !== -1 && currentIdx < family.variants.length - 1) {
      return family.variants[currentIdx + 1];
    }
    return null;
  }, [family, slug]);

  if (!componentData) {
    const roadmapComp = LearningRepository.getRoadmapComponent(slug);
    return (
      <div style={{ paddingBottom: '48px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="workspace-card" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', border: '1px dashed var(--border-subtle)', background: 'rgba(255,255,255,0.005)' }}>
          <div style={{ fontSize: '40px' }}>⏳</div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>
            {roadmapComp ? roadmapComp.name : slug} Workspace Coming Soon
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '500px', margin: 0, lineHeight: '1.5' }}>
            This learning module is currently under active development. We will integrate detailed exploded models, interactive test loops, and simulations shortly.
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

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Learning Path Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
        <Link to={ROUTES.LEARNING_WORKSPACE} style={{ color: 'inherit', textDecoration: 'none' }} className="btn-prev-hover">
          Engineering Workspace
        </Link>
        <span>/</span>
        <Link to={ROUTES.LEARNING_COMPONENTS} style={{ color: 'inherit', textDecoration: 'none' }} className="btn-prev-hover">
          Component Library
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>{componentData.category}</span>
        <span>/</span>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>{componentData.name}</span>
      </div>

      {/* 2. Progress Overview Header */}
      <ProgressCard 
        component={componentData} 
        isCompleted={completed}
        xpEarned={earnedXp}
        hasPassedQuiz={quizScore !== null}
        nextComponentSlug={nextVariant?.slug}
      />

      {/* 3. Before You Start Card */}
      <BeforeYouStartCard component={componentData} />

      {/* Highlighted Sensor Specifications */}
      {(componentData.measures || componentData.outputType || componentData.operatingVoltage) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {componentData.measures && (
            <div className="card-glass" style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Measures</span>
              <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>{componentData.measures}</span>
            </div>
          )}
          {componentData.outputType && (
            <div className="card-glass" style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.15)', background: 'rgba(139, 92, 246, 0.01)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '9px', color: 'var(--accent-violet)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>Output Type</span>
              <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--accent-violet)' }}>{componentData.outputType}</span>
            </div>
          )}
          {componentData.operatingVoltage && (
            <div className="card-glass" style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Operating Voltage</span>
              <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--accent-emerald)' }}>{componentData.operatingVoltage}</span>
            </div>
          )}
          {(componentData.logicLevel || componentData.powerConsumption) && (
            <div className="card-glass" style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Logic Level & Power</span>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
                {componentData.logicLevel && <span>{componentData.logicLevel}</span>}
                {componentData.logicLevel && componentData.powerConsumption && <span> / </span>}
                {componentData.powerConsumption && <span style={{ color: 'var(--text-secondary)' }}>{componentData.powerConsumption}</span>}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 5. Flagship Interactive Component Explorer ⭐ */}
      <ComponentExplorer component={componentData} />

      {/* 4. Overview Section */}
      <div 
        className="card-glass" 
        style={{ 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            📖 Overview & Operation
          </h3>
          {componentData && (
            <div style={{ display: 'flex', gap: '6px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  background: 'rgba(139, 92, 246, 0.1)',
                  color: 'var(--accent-violet)'
                }}
              >
                {componentData.name}
              </span>
            </div>
          )}
        </div>
        
        {/* Quick Information Section (only renders if componentData.overview exists) */}
        {componentData.overview && (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: '16px', 
              background: 'rgba(255, 255, 255, 0.01)', 
              border: '1px solid rgba(255, 255, 255, 0.04)',
              padding: '16px', 
              borderRadius: '8px', 
              marginBottom: '4px' 
            }}
          >
            <div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Display Type
              </span>
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold' }}>
                {componentData.overview.displayType}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Controller IC
              </span>
              <span style={{ fontSize: '13px', color: 'var(--accent-violet, #8b5cf6)', fontWeight: 'bold' }}>
                {componentData.overview.controllerIC}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Communication Interface
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {componentData.overview.communicationInterface?.map((inf) => (
                  <span 
                    key={inf} 
                    style={{ 
                      fontSize: '10px', 
                      background: 'rgba(59, 130, 246, 0.1)', 
                      border: '1px solid rgba(59, 130, 246, 0.2)', 
                      color: 'var(--accent-blue, #3b82f6)', 
                      padding: '2px 6px', 
                      borderRadius: '4px' 
                    }}
                  >
                    {inf}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Can Display
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {componentData.overview.displayCapabilities?.map((cap) => (
                  <span 
                    key={cap} 
                    style={{ 
                      fontSize: '10px', 
                      background: 'rgba(16, 185, 129, 0.1)', 
                      border: '1px solid rgba(16, 185, 129, 0.2)', 
                      color: 'var(--accent-emerald, #10b981)', 
                      padding: '2px 6px', 
                      borderRadius: '4px' 
                    }}
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Operating Voltage
              </span>
              <span style={{ fontSize: '13px', color: '#fbbf24', fontWeight: 'bold' }}>
                {componentData.overview.operatingVoltage}
              </span>
            </div>
          </div>
        )}
        
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
          {componentData.description}
        </p>

        {/* Dynamic specs grid table */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '8px' }}>
          {componentData.specs?.map((spec, idx) => (
            <div key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>{spec.label}</span>
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold', display: 'block', marginTop: '2px' }}>{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buying Guide & When to Use Grid */}
      {componentData.buyingGuide && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Buying Guide Card */}
          <div 
            className="card-glass" 
            style={{ 
              padding: '24px', 
              borderRadius: '12px', 
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🛒 Beginner Buying Guide
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              <div>
                <strong style={{ color: '#fff' }}>Suitability:</strong>{' '}
                <span style={{ color: 'var(--accent-violet)', fontWeight: 'bold' }}>
                  {'★'.repeat(Math.round(componentData.buyingGuide.beginnerRating)) + '☆'.repeat(5 - Math.round(componentData.buyingGuide.beginnerRating))}
                </span>
                <span style={{ marginLeft: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>Beginner Rating</span>
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Approx. Price Range:</strong>{' '}
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 'bold' }}>{componentData.buyingGuide.priceRange}</span>
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Market Availability:</strong> {componentData.buyingGuide.availability}
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Recommended Accessories:</strong>
                <ul style={{ margin: '6px 0 0 0', paddingLeft: '16px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {componentData.buyingGuide.recommendedAccessories.map((acc, idx) => (
                    <li key={idx}>{acc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* When Should I Use This Board? */}
          <div 
            className="card-glass" 
            style={{ 
              padding: '24px', 
              borderRadius: '12px', 
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🎯 Application Matchmaker
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Perfect For</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {componentData.bestFor?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span className="material-icons" style={{ fontSize: '13px', color: 'var(--accent-emerald)' }}>check</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--accent-crimson, #ef4444)', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Not Ideal For</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {componentData.notRecommendedFor?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span className="material-icons" style={{ fontSize: '13px', color: 'var(--accent-crimson, #ef4444)' }}>close</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* 6. Working Principle */}
      {componentData.workingPrinciple && (
        <div 
          className="card-glass" 
          style={{ 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ⚡ Working Principle
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--accent-violet)', textTransform: 'uppercase', fontWeight: 'bold' }}>What is it?</span>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                  {componentData.workingPrinciple.whatIsIt}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--accent-violet)', textTransform: 'uppercase', fontWeight: 'bold' }}>Why is it needed?</span>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                  {componentData.workingPrinciple.whyNeeded}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--accent-violet)', textTransform: 'uppercase', fontWeight: 'bold' }}>How it works?</span>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                  {componentData.workingPrinciple.howItWorks}
                </p>
              </div>
            </div>
            
            {/* Visual SVG diagram column */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '16px' }}>
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: componentData.workingPrinciple.svgDiagram || componentData.symbolSvg || '' 
                }} 
                style={{ color: 'var(--accent-violet)' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. Pin Configuration & Circuit Symbol */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Pin Configuration */}
        <div 
          className="card-glass" 
          style={{ 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            📌 Pin Configuration
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {componentData.pinout?.pins.map((pin, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                <div>
                  <span style={{ fontSize: '12.5px', color: '#fff', fontWeight: 'bold' }}>{pin.name}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>{pin.description}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                    {pin.direction}
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>{pin.voltage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schematic Circuit Symbol */}
        <div 
          className="card-glass" 
          style={{ 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            📐 Circuit Symbol
          </h3>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div 
              style={{ padding: '16px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', color: 'var(--accent-violet)', flexShrink: 0 }}
              dangerouslySetInnerHTML={{ __html: componentData.circuitSymbol?.svg || componentData.symbolSvg || '' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              <div><strong style={{ color: '#fff' }}>Meaning:</strong> {componentData.circuitSymbol?.meaning}</div>
              <div><strong style={{ color: '#fff' }}>Usage Rule:</strong> {componentData.circuitSymbol?.usage}</div>
            </div>
          </div>
        </div>
      </div>


      {/* Component Comparison Selector & Table */}
      {(componentData.comparisonBoards || componentData.comparisonSensors) && compareBoardData && (
        <div 
          className="card-glass" 
          style={{ 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🔄 Interactive {componentData.comparisonSensors ? 'Sensor' : 'Board'} Comparison
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Compare with:</span>
              <select 
                value={compareSlug}
                onChange={(e) => setCompareSlug(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  outline: 'none'
                }}
              >
                {(componentData.comparisonBoards || componentData.comparisonSensors).map((slugOption) => {
                  const optData = LearningRepository.getComponentBySlug(slugOption);
                  return (
                    <option key={slugOption} value={slugOption}>
                      {optData ? optData.name : slugOption}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)', width: '30%', fontSize: '11px', textTransform: 'uppercase' }}>Feature</th>
                  <th style={{ padding: '12px 8px', color: 'var(--accent-violet)', fontWeight: 'bold' }}>{componentData.name}</th>
                  <th style={{ padding: '12px 8px', color: '#60a5fa', fontWeight: 'bold' }}>{compareBoardData.name}</th>
                </tr>
              </thead>
              <tbody>
                {(!!componentData.comparisonSensors ? [
                  { label: "Sensor Type", key: "sensorType" },
                  { label: "Operating Voltage", key: "operatingVoltage" },
                  { label: "Measurement Range", key: "measurementRange" },
                  { label: "Accuracy", key: "accuracy" },
                  { label: "Interface", key: "interface" },
                  { label: "Response Time", key: "responseTime" },
                  { label: "Typical Price Range", key: "typicalPrice" },
                  { label: "Best Use Cases", key: "bestUseCases" }
                ] : [
                  { label: "CPU", key: "cpu" },
                  { label: "Clock Speed", key: "clockSpeed" },
                  { label: "RAM", key: "ram" },
                  { label: "Flash Memory", key: "flash" },
                  { label: "GPIO Count", key: "gpioCount" },
                  { label: "Analog Pins", key: "analogPins" },
                  { label: "PWM Support", key: "pwmSupport" },
                  { label: "Wi-Fi", key: "wifi" },
                  { label: "Bluetooth", key: "bluetooth" },
                  { label: "USB Interface", key: "usbInterface" },
                  { label: "Operating Voltage", key: "operatingVoltage" },
                  { label: "Programming Environment", key: "programmingEnv" },
                  { label: "Typical Price Range", key: "typicalPrice" },
                  { label: "Best Use Case", key: "bestUseCases" }
                ]).map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '10px 8px', color: 'var(--text-muted)', fontWeight: '600' }}>{row.label}</td>
                    <td style={{ padding: '10px 8px', color: '#fff' }}>
                      {componentData.comparisonSpecs?.[row.key] || "N/A"}
                    </td>
                    <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>
                      {compareBoardData.comparisonSpecs?.[row.key] || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}



      {/* Compatible Boards & Common Projects Grid */}
      {(componentData.compatibleBoards || componentData.commonProjects) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Compatible Boards Card */}
          {componentData.compatibleBoards && (
            <div 
              className="card-glass" 
              style={{ 
                padding: '24px', 
                borderRadius: '12px', 
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                💻 Board Compatibility Ratings
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {componentData.compatibleBoards.map((item, idx) => {
                  const board = LearningRepository.getComponentBySlug(item.boardSlug);
                  if (!board) return null;
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                      <Link to={`/learning/components/${item.boardSlug}`} style={{ fontSize: '13px', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
                        {board.name}
                      </Link>
                      <span style={{ color: 'var(--accent-violet)', fontSize: '12.5px', fontWeight: 'bold' }}>
                        {'★'.repeat(item.rating) + '☆'.repeat(5 - item.rating)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Common Projects Card */}
          {componentData.commonProjects && (
            <div 
              className="card-glass" 
              style={{ 
                padding: '24px', 
                borderRadius: '12px', 
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🚀 Common Projects
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {componentData.commonProjects.map((project, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span className="material-icons" style={{ fontSize: '14px', color: 'var(--accent-violet)' }}>build</span>
                    {project}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 9. Advantages & Limitations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Advantages */}
        <div 
          className="card-glass" 
          style={{ 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(16, 185, 129, 0.15)',
            background: 'rgba(16, 185, 129, 0.005)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <h4 style={{ fontSize: '13px', fontWeight: '850', color: 'var(--accent-emerald)', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>
            ✓ Key Advantages
          </h4>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {componentData.advantages?.map((adv, idx) => <li key={idx}>{adv}</li>)}
          </ul>
        </div>

        {/* Limitations */}
        <div 
          className="card-glass" 
          style={{ 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(239, 68, 68, 0.15)',
            background: 'rgba(239, 68, 68, 0.005)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <h4 style={{ fontSize: '13px', fontWeight: '850', color: 'var(--accent-crimson, #ef4444)', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>
            ✕ Practical Limitations
          </h4>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {componentData.limitations?.map((lim, idx) => <li key={idx}>{lim}</li>)}
          </ul>
        </div>
      </div>

      {/* 10. Engineering Checklist & Safety Guardrails */}
      <div 
        className="card-glass" 
        style={{ 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🛡️ Engineering Checklist & Guardrails
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Pre-Wiring Check</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {componentData.engineeringChecklist?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <span className="material-icons" style={{ fontSize: '14px', color: 'var(--accent-emerald)' }}>check_circle_outline</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {componentData.safetyNotes && (
            <div>
              <span style={{ fontSize: '10px', color: 'var(--accent-crimson, #ef4444)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Safety Rules</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {componentData.safetyNotes.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    <span className="material-icons" style={{ fontSize: '14px', color: 'var(--accent-crimson)', marginTop: '2px' }}>error_outline</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 11. Common Mistakes & Engineering Tips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Common Mistakes */}
        <div 
          className="card-glass" 
          style={{ 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <h4 style={{ fontSize: '13px', fontWeight: '850', color: '#fff', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>
            ⚠️ Common Failure Modes
          </h4>
          {componentData.commonMistakes?.map((mistake, idx) => (
            <div key={idx} style={{ background: 'rgba(239, 68, 68, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.08)' }}>
              <span style={{ fontSize: '12.5px', color: '#fff', fontWeight: 'bold', display: 'block' }}>{mistake.question}</span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px', lineHeight: '1.4' }}>{mistake.answer}</span>
            </div>
          ))}
        </div>

        {/* Engineering Tips */}
        <div 
          className="card-glass" 
          style={{ 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(139, 92, 246, 0.15)',
            background: 'rgba(139, 92, 246, 0.01)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <h4 style={{ fontSize: '13px', fontWeight: '850', color: 'var(--accent-violet)', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>
            💡 Pro Engineering Tips
          </h4>
          {componentData.engineeringTips?.map((tip, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              <span className="material-icons" style={{ fontSize: '15px', color: 'var(--accent-violet)', marginTop: '2px' }}>lightbulb</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 12. Component Comparisons */}
      {componentData.comparisonComponents && (
        <ComponentComparison comparisonList={componentData.comparisonComponents} />
      )}



      {/* 17. Quick Quiz Challenge */}
      {componentData.quiz && (
        <div 
          className="card-glass" 
          style={{ 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🧠 Conceptual Quiz Challenge
            </h3>
            {quizScore !== null && (
              <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: 'bold' }}>
                Score: {quizScore} / {componentData.quiz.length}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {componentData.quiz.map((q, qIdx) => {
              const selectedOpt = activeAnswers[qIdx];
              return (
                <div key={qIdx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '13.5px', color: '#fff', fontWeight: 'bold' }}>
                    {qIdx + 1}. {q.question}
                  </span>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedOpt === oIdx;
                      const isCorrect = q.answer === oIdx;
                      
                      let bg = 'rgba(255, 255, 255, 0.02)';
                      let border = '1px solid rgba(255, 255, 255, 0.04)';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          bg = 'rgba(16, 185, 129, 0.1)';
                          border = '1px solid rgba(16, 185, 129, 0.3)';
                        } else if (isSelected) {
                          bg = 'rgba(239, 68, 68, 0.1)';
                          border = '1px solid rgba(239, 68, 68, 0.3)';
                        }
                      } else if (isSelected) {
                        bg = 'rgba(139, 92, 246, 0.1)';
                        border = '1px solid rgba(139, 92, 246, 0.3)';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleAnswerSelect(qIdx, oIdx)}
                          style={{
                            background: bg,
                            border: border,
                            color: isSelected || (quizSubmitted && isCorrect) ? '#fff' : 'var(--text-secondary)',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            textAlign: 'left',
                            fontSize: '12.5px',
                            cursor: quizSubmitted ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)', fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      <strong style={{ color: 'var(--accent-violet)' }}>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted && (
            <button 
              onClick={submitQuiz}
              disabled={Object.keys(activeAnswers).length < componentData.quiz.length}
              style={{
                alignSelf: 'flex-end',
                background: Object.keys(activeAnswers).length === componentData.quiz.length ? 'var(--accent-violet)' : 'rgba(255,255,255,0.04)',
                border: 'none',
                color: Object.keys(activeAnswers).length === componentData.quiz.length ? '#fff' : 'var(--text-muted)',
                padding: '8px 20px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '12.5px',
                cursor: Object.keys(activeAnswers).length === componentData.quiz.length ? 'pointer' : 'not-allowed'
              }}
            >
              Submit Answers
            </button>
          )}
        </div>
      )}

      {/* 18. Build It Yourself Challenge Panel ⭐ */}
      {componentData.buildChallenge && (
        <BuildItYourselfCard 
          challenge={componentData.buildChallenge}
          slug={slug}
        />
      )}
      {/* 20. Continue Learning Navigation Footer */}
      {nextVariant && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
          <button 
            onClick={() => {
              navigate(`/learning/components/${nextVariant.slug}`);
              window.scrollTo(0, 0);
            }}
            className="cta-button"
            style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            Continue Learning: {nextVariant.name}
            <span className="material-icons">arrow_forward</span>
          </button>
        </div>
      )}

    </div>
  );
};
