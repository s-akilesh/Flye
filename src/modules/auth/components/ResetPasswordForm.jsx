import React, { useState } from 'react';
import { authService } from '../services/authService.js';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { logger } from '../../../shared/utils/logger.js';

export const ResetPasswordForm = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strengthScore = getPasswordStrength(password);
  const strengthColors = ['#64748b', '#ef4444', '#f97316', '#22c55e', '#a855f7'];
  const strengthLabels = ['Empty', 'Weak', 'Fair', 'Strong', 'Excellent'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      logger.log('[ResetPasswordForm] Updating password...');
      await authService.updatePassword(password);
      logger.log('[ResetPasswordForm] Password updated successfully.');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      logger.error('[ResetPasswordForm] Password update failed:', err);
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Choose New Password</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary, #94a3b8)', margin: 0 }}>
          Create a secure password to protect your account.
        </p>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          color: 'var(--accent-danger, #ef4444)',
          fontSize: '12px',
          lineHeight: '1.5'
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Password</label>
        <input
          type="password"
          className="form-input"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />
        {password && (
          <div style={{ marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted, #94a3b8)', marginBottom: '4px' }}>
              <span>Password Strength</span>
              <span style={{ color: strengthColors[strengthScore], fontWeight: '700' }}>{strengthLabels[strengthScore]}</span>
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '1.5px', overflow: 'hidden' }}>
              <div style={{
                width: `${(strengthScore / 4) * 100}%`,
                height: '100%',
                background: strengthColors[strengthScore],
                transition: 'all 0.3s ease'
              }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm Password</label>
        <input
          type="password"
          className="form-input"
          placeholder="Repeat password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '12px',
          fontWeight: '700',
          fontSize: '13px',
          marginTop: '8px',
          background: 'linear-gradient(135deg, var(--accent-blue, #3b82f6), var(--accent-violet, #8b5cf6))',
          border: 'none',
          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.25)'
        }}
      >
        {isSubmitting ? 'Updating Password...' : 'Reset Password'}
      </Button>
    </form>
  );
};
