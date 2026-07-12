import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation Required',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="modal-content purple" style={{ maxWidth: '400px' }}>
      <div style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
        <div 
          style={{ 
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: `2px solid ${isDanger ? 'var(--status-danger)' : 'var(--brand-primary)'}`,
            color: isDanger ? 'var(--status-danger)' : 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0 auto var(--space-4) auto'
          }}
        >
          {isDanger ? '!' : '?'}
        </div>
        <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--txt-primary)', marginBottom: 'var(--space-2)' }}>
          {title}
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--txt-muted)', margin: 'var(--space-3) 0 var(--space-5) 0', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <Button variant="secondary" onClick={onClose} disabled={isLoading} style={{ flex: 1 }}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            style={{ 
              flex: 1, 
              background: isDanger ? 'var(--status-danger)' : 'var(--brand-primary)', 
              borderColor: isDanger ? 'var(--status-danger)' : 'var(--brand-primary)',
              color: 'var(--txt-inverse)'
            }}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
