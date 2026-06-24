import React from 'react';

export const PageLoading = ({ message = 'LOADING SECURE PORTAL...' }) => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 'calc(100vh - 160px)',
        gap: '16px',
        background: 'transparent',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <div style={{ position: 'relative', width: '56px', height: '56px' }}>
        {/* Outer pulse glow */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid var(--accent-violet)',
            opacity: 0.15,
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />
        {/* Spinner SVG */}
        <svg 
          viewBox="0 0 24 24" 
          style={{
            width: '100%',
            height: '100%',
            animation: 'spin 1s linear infinite',
            stroke: 'var(--accent-violet)',
            fill: 'none',
            strokeWidth: '2.5',
            strokeLinecap: 'round',
            position: 'relative',
            zIndex: 1
          }}
        >
          <circle cx="12" cy="12" r="10" stroke="rgba(139, 92, 246, 0.1)" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      </div>

      <p 
        style={{ 
          color: 'var(--text-muted)', 
          fontSize: '12px', 
          fontWeight: '600',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          margin: 0,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      >
        {message}
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
};
