import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4500) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toasts }}>
      {children}
      {/* Toast Overlay Container */}
      <div 
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          pointerEvents: 'none',
          maxWidth: '380px',
          width: 'calc(100% - 48px)'
        }}
      >
        {toasts.map((toast) => {
          const config = {
            success: { bg: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', text: 'var(--accent-emerald, #10b981)', icon: 'check_circle' },
            error: { bg: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', text: '#ef4444', icon: 'error' },
            warning: { bg: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', text: '#f59e0b', icon: 'warning' },
            info: { bg: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)', text: 'var(--accent-violet, #8b5cf6)', icon: 'info' }
          };
          const c = config[toast.type] || config.info;

          return (
            <div
              key={toast.id}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(14, 14, 22, 0.98)',
                backdropFilter: 'blur(16px)',
                border: c.border,
                color: c.text,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                fontSize: '13px',
                fontWeight: '500',
                pointerEvents: 'auto',
                animation: 'toastIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            >
              <span className="material-icons" style={{ fontSize: '18px', color: c.text }}>{c.icon}</span>
              <span style={{ flex: 1, color: '#f3f4f6' }}>{toast.message}</span>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim, #6b7280)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none'
                }}
              >
                <span className="material-icons" style={{ fontSize: '16px' }}>close</span>
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
