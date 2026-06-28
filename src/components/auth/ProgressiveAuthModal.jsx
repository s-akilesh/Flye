import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ROUTES } from '../../constants/routes';

export const ProgressiveAuthModal = ({ isOpen, onClose, onContinueAsGuest, actionName = 'save your bookmarks' }) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    onClose();
    // Navigate to auth page with signup tab active
    navigate(`${ROUTES.STUDENT_AUTH}?tab=signup`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="modal-content purple" style={{ maxWidth: '400px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
        
        {/* Animated Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          color: 'var(--accent-violet, #8b5cf6)',
          fontSize: '22px',
          boxShadow: '0 0 24px rgba(139, 92, 246, 0.15)'
        }}>
          🔖
        </div>

        {/* Content */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Create a free account to save your progress
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary, #94a3b8)', lineHeight: '1.6', margin: 0 }}>
            Sign up to permanently {actionName}, track your learning streaks, and earn verified certificates.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button
            type="button"
            variant="primary"
            onClick={handleSignUp}
            style={{
              width: '100%',
              padding: '12px',
              fontWeight: '700',
              fontSize: '13px',
              background: 'linear-gradient(135deg, var(--accent-blue, #3b82f6), var(--accent-violet, #8b5cf6))',
              border: 'none',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.25)'
            }}
          >
            Create Free Account
          </Button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onContinueAsGuest) {
                onContinueAsGuest();
              }
            }}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '10px 16px',
              borderRadius: '8px',
              color: 'var(--text-secondary, #94a3b8)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#fff'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary, #94a3b8)'}
          >
            Continue as Guest (Without Saving)
          </button>
        </div>
      </div>
    </Modal>
  );
};
