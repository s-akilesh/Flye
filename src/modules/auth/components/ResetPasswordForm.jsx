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
  const strengthColors = ['var(--txt-muted)', 'var(--status-danger)', 'var(--status-warning)', 'var(--status-success)', 'var(--brand-accent)'];
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
        <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--txt-primary)', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Choose New Password</h3>
        <p style={{ fontSize: '13px', color: 'var(--txt-secondary)', margin: 0 }}>
          Create a secure password to protect your account.
        </p>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          background: 'var(--interaction-hover)',
          border: '1px solid var(--status-danger)',
          borderRadius: '8px',
          color: 'var(--status-danger)',
          fontSize: '12px',
          lineHeight: '1.5'
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Password</label>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--txt-muted)', marginBottom: '4px' }}>
              <span>Password Strength</span>
              <span style={{ color: strengthColors[strengthScore], fontWeight: '700' }}>{strengthLabels[strengthScore]}</span>
            </div>
            <div style={{ height: '3px', background: 'var(--sys-border)', borderRadius: '1.5px', overflow: 'hidden' }}>
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
        <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm Password</label>
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
          background: 'linear-gradient(135deg, var(--brand-accent), var(--brand-primary))',
          border: 'none',
          boxShadow: '0 4px 16px var(--interaction-focus)'
        }}
      >
        {isSubmitting ? 'Updating Password...' : 'Reset Password'}
      </Button>
    </form>
  );
};
