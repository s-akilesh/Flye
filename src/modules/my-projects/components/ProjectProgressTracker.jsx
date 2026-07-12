import React from 'react';

const STEPS = [
  { label: 'Submitted', key: 'new' },
  { label: 'Under Review', key: 'review' },
  { label: 'Quotation Shared', key: 'quoted' },
  { label: 'Confirmed', key: 'confirmed' },
  { label: 'Project In Progress', key: 'building' },
  { label: 'Testing', key: 'testing' },
  { label: 'Ready for Delivery', key: 'ready' },
  { label: 'Delivered', key: 'delivered' },
  { label: 'Completed', key: 'completed' }
];

const getStatusIndex = (dbStatus) => {
  switch (dbStatus) {
    case 'new': return 0;
    case 'contacted':
    case 'discussed': return 1;
    case 'quoted': return 2;
    case 'confirmed': return 3;
    case 'building': return 4;
    case 'testing': return 5;
    case 'ready': return 6;
    case 'completed': return 8; // Both Delivered (7) and Completed (8) are complete
    default: return 0;
  }
};

export const ProjectProgressTracker = ({ status }) => {
  const isCancelled = status === 'cancelled';
  const currentIndex = isCancelled ? -1 : getStatusIndex(status);

  if (isCancelled) {
    return (
      <div style={{
        padding: '16px',
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '8px',
        color: 'var(--accent-crimson, #ef4444)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '16px 0'
      }}>
        <span className="material-icons-outlined">cancel</span>
        <div style={{ textAlign: 'left' }}>
          <strong style={{ display: 'block', fontSize: '14px' }}>Project Cancelled</strong>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            This project enquiry has been cancelled. Please contact support if you have questions.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-tracker-container" style={{ margin: '24px 0' }}>
      {/* Desktop Horizontal Tracker */}
      <div className="desktop-tracker" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', width: '100%', padding: '0 8px' }}>
        {/* Progress Line Background */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '20px',
          right: '20px',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.08)',
          zIndex: 1
        }} />

        {/* Progress Line Fill */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '20px',
          width: `calc(${(currentIndex / (STEPS.length - 1)) * 100}% - 40px)`,
          height: '2px',
          background: 'var(--accent-violet, #8b5cf6)',
          boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)',
          zIndex: 2,
          transition: 'width 0.4s ease'
        }} />

        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div 
              key={step.label} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                zIndex: 3, 
                flex: 1 
              }}
            >
              {/* Circle node */}
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDone 
                    ? 'var(--accent-violet, #8b5cf6)' 
                    : isCurrent 
                      ? '#0b0a10' 
                      : 'rgba(255, 255, 255, 0.04)',
                  border: isCurrent 
                    ? '2px solid var(--accent-violet, #8b5cf6)' 
                    : isDone
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isCurrent 
                    ? '0 0 15px var(--interaction-focus)' 
                    : 'none',
                  color: isDone || isCurrent ? 'var(--txt-primary)' : 'var(--txt-muted)',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
              >
                {isDone ? (
                  <span className="material-icons" style={{ fontSize: '16px' }}>check</span>
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Label */}
              <span 
                style={{ 
                  marginTop: '8px', 
                  fontSize: '11px', 
                  fontWeight: isCurrent ? '600' : '500', 
                  color: isCurrent 
                    ? 'var(--txt-primary)' 
                    : isDone 
                      ? 'var(--txt-secondary)' 
                      : 'var(--txt-muted)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Tracker */}
      <div className="mobile-tracker" style={{ display: 'none', flexDirection: 'column', gap: '16px', padding: '0 8px' }}>
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          
          return (
            <div 
              key={step.label} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                opacity: isDone || isCurrent ? 1 : 0.4
              }}
            >
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDone 
                    ? 'var(--brand-primary)' 
                    : isCurrent 
                      ? 'var(--sys-bg)' 
                      : 'var(--input-bg)',
                  border: isCurrent 
                    ? '2px solid var(--brand-primary)' 
                    : '1px solid var(--sys-border)',
                  color: 'var(--txt-primary)',
                  fontSize: '12px'
                }}
              >
                {isDone ? (
                  <span className="material-icons" style={{ fontSize: '14px' }}>check</span>
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span style={{ fontSize: '13px', fontWeight: isCurrent ? '600' : '500', color: isCurrent ? 'var(--txt-primary)' : 'var(--txt-secondary)' }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Styled display classes for toggle */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-tracker { display: none !important; }
          .mobile-tracker { display: flex !important; }
        }
      `}</style>
    </div>
  );
};
