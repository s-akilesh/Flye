import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const ComponentNextLearning = ({ component }) => {
  const navigate = useNavigate();
  const miniProject = component.miniProject;
  const next = component.nextLearning;

  const handleNextClick = () => {
    if (next && next.slug) {
      navigate(`${ROUTES.LEARNING_COMPONENTS}/${next.slug}`);
      window.scrollTo(0, 0);
    } else {
      navigate(ROUTES.LEARNING_WORKSPACE);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Build Stage Header */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
          Practical Lab
        </span>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '4px 0 8px 0' }}>
          Ready to Build?
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
          Apply what you've learned by building a real circuit. Check out the experiment kit list and wrap up your lesson.
        </p>
      </div>

      {/* Grid: Mini Project + Ask AI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        {/* Build Something (Mini Project) */}
        {miniProject ? (
          <div className="workspace-card" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-violet)' }}>
              🛠️ Recommended Lab Project
            </span>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: '0 0 4px 0' }}>
                {miniProject.title}
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                {miniProject.desc}
              </p>
            </div>
            
            {/* Required Components chips */}
            {miniProject.components && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {miniProject.components.map((comp, idx) => (
                  <span 
                    key={idx}
                    style={{
                      fontSize: '11px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {comp}
                  </span>
                ))}
              </div>
            )}

            <button 
              className="cta-button secondary" 
              style={{ padding: '8px 12px', fontSize: '12px', width: 'fit-content', marginTop: '4px' }}
              onClick={() => alert("Hardware Kit Ordering & Breadboard view are available in the Flyen Store.")}
            >
              Order Lab Kit 📦
            </button>
          </div>
        ) : (
          <div className="workspace-card" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '20px' }}>🔧</div>
            <p style={{ fontSize: '12px', margin: 0 }}>No lab project associated with this variant yet.</p>
          </div>
        )}

        {/* Ask Flyen AI (Disabled Placeholder) */}
        <div className="workspace-card" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-blue)' }}>
            🤖 Ask Flyen AI
          </span>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
            Have questions about voltage calculations, polarities, or circuit physics? Ask the AI Assistant.
          </p>

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <input 
              type="text" 
              placeholder="Why is this capacitor polarized?"
              disabled
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                background: 'rgba(3, 3, 5, 0.8)',
                color: 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'not-allowed'
              }}
            />
            <button 
              disabled 
              className="product-btn" 
              style={{ padding: '8px 12px', fontSize: '11px', cursor: 'not-allowed', opacity: 0.5, minWidth: 'auto' }}
            >
              Ask
            </button>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
            AI Assistant integration coming in Flyen V2.
          </span>
        </div>
      </div>

      {/* Lesson Complete Celebration Panel */}
      <div 
        className="card-glass" 
        style={{ 
          padding: '28px', 
          borderRadius: '12px', 
          border: '1.5px solid rgba(52, 211, 153, 0.25)', 
          background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.06) 0%, rgba(3, 3, 5, 0.6) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'center',
          marginTop: '12px'
        }}
      >
        <div style={{ fontSize: '40px', animation: 'bounce 2s infinite' }}>🎉</div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '850', color: '#fff', margin: '0 0 6px 0' }}>
            Lesson Complete!
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, maxWidth: '440px', lineHeight: '1.5' }}>
            You have mastered the physical anatomy, core working steps, fail-states, and relationships of the {component.name}!
          </p>
        </div>

        <button 
          className="cta-button" 
          style={{ 
            background: 'var(--accent-emerald)', 
            borderColor: 'var(--accent-emerald)',
            boxShadow: '0 0 16px rgba(52, 211, 153, 0.2)',
            padding: '10px 24px',
            fontSize: '13.5px'
          }}
          onClick={handleNextClick}
        >
          {next ? `Go to Next Lesson: ${next.name} →` : 'Return to Journey Roadmap'}
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};
