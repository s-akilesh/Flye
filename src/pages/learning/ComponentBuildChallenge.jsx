import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LearningRepository } from '../../data/learning';
import { useToast } from '../../context/ToastContext';

export const ComponentBuildChallenge = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Load component data
  const componentData = useMemo(() => {
    return LearningRepository.getComponentBySlug(slug);
  }, [slug]);

  const challenge = componentData?.buildChallenge;

  const [activeStep, setActiveStep] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const [imageError, setImageError] = useState(false);
  const [claimed, setClaimed] = useState(() => {
    return localStorage.getItem(`flyen_completed_${slug}`) === 'true';
  });

  // Reset image error on step change
  useEffect(() => {
    setImageError(false);
  }, [activeStep]);

  if (!componentData || !challenge) {
    return (
      <div style={{ paddingBottom: '48px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center', color: '#fff', paddingTop: '40px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Build Challenge Not Found</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>This component does not have a signature build challenge registered.</p>
        <button onClick={() => navigate(`/learning/components/${slug}`)} className="product-btn" style={{ marginTop: '12px' }}>
          Back to Details
        </button>
      </div>
    );
  }

  const isAllChecked = challenge.verificationChecklist.every((_, idx) => checkedItems[idx]);

  const handleClaim = () => {
    if (!isAllChecked || claimed) return;
    setClaimed(true);
    localStorage.setItem(`flyen_completed_${slug}`, 'true');
    
    // Increment local XP
    const currentXp = Number(localStorage.getItem(`flyen_xp_${slug}`) || 0);
    const reward = challenge.xpReward || 50;
    localStorage.setItem(`flyen_xp_${slug}`, String(currentXp + reward));

    showToast(`🏆 Challenge Complete! Unlocked: ${challenge.badge || 'New Badge'} +${reward} XP`, 'success');
    
    // Navigate back to details page after brief delay
    setTimeout(() => {
      navigate(`/learning/components/${slug}`);
    }, 1500);
  };

  // Image source pointing to the project Supabase/S3 bucket structure
  const stepImageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/project-images/build-guides/${slug}/step-${activeStep + 1}.png`;

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Path Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
        <Link to={ROUTES.LEARNING_WORKSPACE} style={{ color: 'inherit', textDecoration: 'none' }} className="btn-prev-hover">
          Engineering Workspace
        </Link>
        <span>/</span>
        <Link to={ROUTES.LEARNING_COMPONENTS} style={{ color: 'inherit', textDecoration: 'none' }} className="btn-prev-hover">
          Component Library
        </Link>
        <span>/</span>
        <Link to={`/learning/components/${slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="btn-prev-hover">
          {componentData.name}
        </Link>
        <span>/</span>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>Lab Guide</span>
      </div>

      {/* 2. Page Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <button 
            onClick={() => navigate(`/learning/components/${slug}`)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              fontSize: '12px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '8px'
            }}
          >
            <span className="material-icons" style={{ fontSize: '14px' }}>arrow_back</span> Back to {componentData.name}
          </button>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#fff', margin: 0 }}>
            🛠️ Practical Challenge: {componentData.name}
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Follow the lab schematics below to assemble a working prototype.
          </p>
        </div>

        {claimed && (
          <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold' }}>
            ✓ Verified & Complete
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        
        {/* Left Side Column: Steps & Instructions (span 7) */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Step Guide Card */}
          <div 
            className="card-glass" 
            style={{ 
              padding: '24px', 
              borderRadius: '12px', 
              border: '1px solid rgba(16, 185, 129, 0.2)',
              background: 'rgba(16, 185, 129, 0.01)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', fontWeight: '850', color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Step-by-Step Guide
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Step {activeStep + 1} of {challenge.wiringSteps.length}
              </span>
            </div>

            {/* Visual Attachment (Dashed mock layout pointer pointing to Supabase S3) */}
            <div style={{ width: '100%', minHeight: '260px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
              {!imageError ? (
                <div style={{ width: '100%', height: '100%', minHeight: '260px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px' }}>
                  <img 
                    src={stepImageUrl} 
                    alt={`Wiring Step ${activeStep + 1}`} 
                    onError={() => setImageError(true)}
                    style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '4px' }}
                  />
                </div>
              ) : (
                <div style={{ width: '100%', minHeight: '260px', border: '1px dashed rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', padding: '24px', textAlign: 'center' }}>
                  <span className="material-icons" style={{ fontSize: '36px', color: 'var(--text-muted)' }}>insert_photo</span>
                  <span style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>Assembly Diagram</span>
                  <span style={{ fontSize: '10px', maxWidth: '300px', lineHeight: '1.4' }}>
                    S3 Bucket: `project-images`<br />
                    Path: `build-guides/{slug}/step-{activeStep + 1}.png`
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '900', color: 'var(--accent-emerald)', flexShrink: 0 }}>
                {activeStep + 1}
              </div>
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontSize: '14px', color: '#fff', margin: '0 0 4px 0', fontWeight: 'bold', lineHeight: '1.5' }}>
                  {challenge.wiringSteps[activeStep]?.text}
                </p>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <strong>Expected Result:</strong> {challenge.wiringSteps[activeStep]?.expectedResult}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '10px' }}>
              <button 
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className="product-btn"
                style={{ padding: '8px 16px', fontSize: '12px', opacity: activeStep === 0 ? 0.4 : 1 }}
              >
                Previous Step
              </button>
              <button 
                onClick={() => setActiveStep(prev => Math.min(challenge.wiringSteps.length - 1, prev + 1))}
                disabled={activeStep === challenge.wiringSteps.length - 1}
                className="product-btn"
                style={{ padding: '8px 16px', fontSize: '12px', opacity: activeStep === challenge.wiringSteps.length - 1 ? 0.4 : 1 }}
              >
                Next Step
              </button>
            </div>
          </div>

          {/* Troubleshooting Checklist Accordions */}
          {challenge.troubleshooting && challenge.troubleshooting.length > 0 && (
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
                🛠️ Troubleshooting Support
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {challenge.troubleshooting.map((trouble, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.01)', 
                      border: '1px solid rgba(239, 68, 68, 0.12)', 
                      padding: '16px', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '8px' 
                    }}
                  >
                    <span style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="material-icons" style={{ fontSize: '16px', color: 'var(--accent-crimson, #ef4444)' }}>error_outline</span>
                      Symptom: {trouble.symptom}
                    </span>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--text-muted)' }}>Possible Causes:</strong> {trouble.causes.join(', ')}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--text-muted)' }}>Action:</strong> {trouble.fixSteps.join(' -> ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side Column: Requirements & Verifications (span 5) */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Metadata Card */}
          <div 
            className="card-glass" 
            style={{ 
              padding: '20px', 
              borderRadius: '12px', 
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              textAlign: 'center'
            }}
          >
            <div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Difficulty</span>
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold', display: 'block', marginTop: '2px' }}>{challenge.difficulty}</span>
            </div>
            <div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Time Limit</span>
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold', display: 'block', marginTop: '2px' }}>⏱️ {challenge.estimatedTime}</span>
            </div>
            <div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>XP Prize</span>
              <span style={{ fontSize: '13px', color: '#fbbf24', fontWeight: 'bold', display: 'block', marginTop: '2px' }}>⭐ +{challenge.xpReward} XP</span>
            </div>
          </div>

          {/* Parts & Tools Card */}
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
            <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📦 Lab Inventory Requirements
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Required Components</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {challenge.requiredComponents.map((part, idx) => (
                    <Link 
                      key={idx} 
                      to={`/learning/components/${part.slug}`}
                      style={{ fontSize: '11px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', textDecoration: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      🔌 {part.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Required Tools</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {challenge.requiredTools.map((tool, idx) => (
                    <span key={idx} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px' }}>
                      🛠️ {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Checklist Card */}
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
            <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ✅ Build Verification Checklist
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {challenge.verificationChecklist.map((item, idx) => (
                <label key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12.5px', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                  <input 
                    type="checkbox"
                    checked={!!checkedItems[idx]}
                    onChange={(e) => setCheckedItems(prev => ({ ...prev, [idx]: e.target.checked }))}
                    style={{ accentColor: 'var(--accent-emerald)', marginTop: '3px' }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reflection questions */}
          {challenge.reflectionQuestions && (
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
              <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📝 Engineering Reflection
              </h3>
              <ol style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {challenge.reflectionQuestions.map((q, idx) => (
                  <li key={idx} style={{ lineHeight: '1.4' }}>{q}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Claim Rewards Panel */}
          <div 
            className="card-glass" 
            style={{ 
              padding: '20px', 
              borderRadius: '12px', 
              border: '1px solid rgba(16, 185, 129, 0.15)',
              background: 'rgba(16, 185, 129, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Check all items on the verification list to submit your prototype and claim your rewards.
            </span>
            <button
              onClick={handleClaim}
              disabled={!isAllChecked || claimed}
              style={{
                width: '100%',
                background: isAllChecked && !claimed ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.04)',
                border: 'none',
                color: isAllChecked && !claimed ? '#fff' : 'var(--text-muted)',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: isAllChecked && !claimed ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span className="material-icons" style={{ fontSize: '18px' }}>workspace_premium</span>
              {claimed ? '✓ Verified & Claimed' : 'Verify & Claim Rewards'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
