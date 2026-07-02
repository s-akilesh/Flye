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
  AiLearningAssistant, 
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

      {/* 5. Flagship Interactive Component Explorer ⭐ */}
      <ComponentExplorer component={componentData} />

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

      {/* 8. Internal Structure */}
      {componentData.internalStructure && (
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
            🔬 Internal Physical Anatomy
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
            {componentData.internalStructure.description}
          </p>
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

      {/* 13. Arduino Examples */}
      {componentData.arduinoExamples && (
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
            💻 Arduino Programming Code
          </h3>
          {componentData.arduinoExamples.map((ex, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{ex.title}</span>
              <pre 
                style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255,255,255,0.06)', 
                  overflowX: 'auto',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#a7f3d0'
                }}
              >
                <code>{ex.code.trim()}</code>
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* 14. Wiring Example & Simulation */}
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
          🔌 Wiring Connections & Simulation
        </h3>
        
        {componentData.wiringExamples?.map((ex, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
              {ex.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {ex.connections.map((conn, cIdx) => (
                <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.02)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{conn.from}</span>
                  <span style={{ color: 'var(--accent-violet)' }}>➔</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{conn.to}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 15. Downloads */}
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
          📥 Available Datasheets & Resources
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {componentData.downloads?.map((res, idx) => (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                background: 'rgba(255,255,255,0.01)', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.03)' 
              }}
            >
              <div>
                <span style={{ fontSize: '12.5px', color: '#fff', fontWeight: 'bold', display: 'block' }}>{res.type}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>{res.filename} ({res.size})</span>
              </div>
              <button 
                onClick={() => alert(`Downloading: ${res.filename}`)}
                className="product-btn" 
                style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span className="material-icons" style={{ fontSize: '14px' }}>download</span> Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 16. AI Learning Assistant Panel */}
      <AiLearningAssistant component={componentData} />

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

      {/* 19. Related Lessons & Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Related Lessons */}
        <div 
          className="card-glass" 
          style={{ 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <h4 style={{ fontSize: '13px', fontWeight: '850', color: '#fff', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>
            📚 Related Lessons
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {componentData.relatedLessons?.map((lessonSlug, idx) => (
              <Link 
                key={idx} 
                to={`/learning/fundamentals/${lessonSlug}`}
                style={{ fontSize: '12.5px', color: 'var(--accent-violet)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span className="material-icons" style={{ fontSize: '13px' }}>auto_stories</span>
                {lessonSlug.replace(/-/g, ' ')}
              </Link>
            )) || <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>None suggested</span>}
          </div>
        </div>

        {/* Related Projects */}
        <div 
          className="card-glass" 
          style={{ 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <h4 style={{ fontSize: '13px', fontWeight: '850', color: '#fff', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>
            🚀 Related Projects Kits
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {componentData.relatedProjects?.map((projectSlug, idx) => (
              <Link 
                key={idx} 
                to={`/projects`} // Route to project listing
                style={{ fontSize: '12.5px', color: 'var(--accent-violet)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span className="material-icons" style={{ fontSize: '13px' }}>construction</span>
                {projectSlug.replace(/-/g, ' ')}
              </Link>
            )) || <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>None suggested</span>}
          </div>
        </div>
      </div>

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
