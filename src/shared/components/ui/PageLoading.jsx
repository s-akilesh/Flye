import React from 'react';

export const PageLoading = ({ message = 'LOADING PORTAL...' }) => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        gap: '24px',
        background: 'transparent'
      }}
    >
      <div style={{ position: 'relative', width: '56px', height: '56px' }}>
        {/* Outer Glow Ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: 'var(--brand-primary)',
          borderBottomColor: 'var(--brand-accent)',
          animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
          boxShadow: '0 0 15px var(--interaction-selected)'
        }} />
        
        {/* Inner Counter-Rotating Ring */}
        <div style={{
          position: 'absolute',
          inset: '6px',
          borderRadius: '50%',
          border: '2px solid transparent',
          borderLeftColor: 'var(--brand-accent)',
          borderRightColor: 'var(--status-success)',
          animation: 'spin-reverse 1s linear infinite',
          opacity: 0.8
        }} />
      </div>

      <p 
        style={{ 
          color: 'var(--txt-muted)', 
          fontSize: '12px', 
          fontWeight: '600',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          margin: 0,
          animation: 'pulse 1.8s ease-in-out infinite'
        }}
      >
        {message}
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
