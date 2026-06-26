import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { ConfirmDialog } from '../../ui/ConfirmDialog';

export const SettingsLayout = ({
  title,
  description,
  categoryName,
  isDirty = false,
  isLoading = false,
  onSave,
  onCancel,
  saveStatus = null, // { message, lastUpdated }
  children
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const handleNavigateClick = (action) => {
    if (isDirty) {
      setPendingAction(() => action);
      setShowConfirm(true);
    } else {
      action();
    }
  };

  const handleConfirmLeave = () => {
    setShowConfirm(false);
    if (pendingAction) {
      pendingAction();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Breadcrumb Navigation */}
      <div 
        style={{ 
          fontSize: '11px', 
          fontWeight: '700', 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          marginBottom: 'var(--space-2)'
        }}
      >
        <span 
          onClick={() => handleNavigateClick(onCancel)}
          style={{ color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s ease' }}
          className="breadcrumb-link"
        >
          Settings
        </span>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>&gt;</span>
        <span style={{ color: 'var(--accent-violet)' }}>{categoryName}</span>
      </div>

      {/* Page Header */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
          {title}
        </h2>
        {description && (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            {description}
          </p>
        )}
      </div>

      {/* Save Status Banner */}
      {saveStatus && saveStatus.message && (
        <div 
          className="settings-status-banner"
          style={{
            padding: 'var(--space-3) var(--space-4)',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '8px',
            color: 'var(--accent-emerald)',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-2)'
          }}
        >
          <span>{saveStatus.message}</span>
          {saveStatus.lastUpdated && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>
              Last Updated: {saveStatus.lastUpdated}
            </span>
          )}
        </div>
      )}

      {/* Form Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {children}
      </div>

      {/* Actions Bar */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 'var(--space-3)', 
          marginTop: 'var(--space-3)',
          paddingBottom: 'var(--space-6)' 
        }}
      >
        <Button 
          variant="ghost" 
          onClick={() => handleNavigateClick(onCancel)}
          disabled={isLoading}
          style={{ fontSize: '13px', padding: '10px 20px' }}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={onSave}
          disabled={!isDirty || isLoading}
          style={{ 
            fontSize: '13px', 
            padding: '10px 24px',
            opacity: (!isDirty || isLoading) ? 0.5 : 1,
            cursor: (!isDirty || isLoading) ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Saving Changes...' : 'Save Changes'}
        </Button>
      </div>

      {/* Confirm Dialog for Unsaved Changes */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmLeave}
        title="Unsaved Changes"
        message="You have unsaved changes. Do you want to leave this page and discard your changes?"
        confirmLabel="Leave"
        cancelLabel="Cancel"
        isDanger={true}
      />
    </div>
  );
};
