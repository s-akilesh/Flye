import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { ROUTES } from '../../../shared/constants/routes';

export const ProgressiveAuthModal = ({ isOpen, onClose, onContinueAsGuest, actionName = 'save your bookmarks' }) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    onClose();
    // Navigate to auth page with signup tab active
    navigate(`${ROUTES.STUDENT_AUTH}?tab=signup`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="modal-content purple" style={{ maxWidth: '400px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', color: 'var(--txt-primary)', fontFamily: 'Inter, sans-serif' }}>
        
        {/* Animated Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--interaction-selected)',
          border: '1px solid var(--brand-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          color: 'var(--brand-primary)',
          fontSize: '22px',
          boxShadow: '0 0 24px var(--interaction-selected)'
        }}>
          🔖
        </div>

        {/* Content */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Create a free account to save your progress
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--txt-secondary)', lineHeight: '1.6', margin: 0 }}>
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
              background: 'linear-gradient(135deg, var(--brand-accent), var(--brand-primary))',
              border: 'none',
              boxShadow: '0 4px 16px var(--interaction-focus)'
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
              background: 'var(--interaction-hover)',
              border: '1px solid var(--sys-border)',
              padding: '10px 16px',
              borderRadius: '8px',
              color: 'var(--txt-secondary)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--txt-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--txt-secondary)'}
          >
            Continue as Guest (Without Saving)
          </button>
        </div>
      </div>
    </Modal>
  );
};
