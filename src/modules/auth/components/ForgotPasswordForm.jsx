import React, { useState } from 'react';
import { authService } from '../services/authService.js';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { logger } from '../../../shared/utils/logger.js';

export const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      logger.log('[ForgotPasswordForm] Sending password reset request for:', email);
      // Redirect back to the auth page with a recovery indicator
      const redirectTo = `${window.location.origin}/auth?type=recovery`;
      await authService.resetPassword(email, redirectTo);
      setSuccess(true);
      logger.log('[ForgotPasswordForm] Password reset email sent.');
    } catch (err) {
      logger.error('[ForgotPasswordForm] Failed to send reset email:', err);
      setError(err.message || 'Failed to send password reset email. Please verify the email address.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--interaction-selected)',
          border: '1px solid var(--status-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          color: 'var(--status-success)',
          boxShadow: '0 0 24px var(--interaction-selected)'
        }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--txt-primary)' }}>Check your email</h3>
          <p style={{ fontSize: '13px', color: 'var(--txt-secondary)', lineHeight: '1.6', margin: 0 }}>
            We've sent a password reset link to <strong style={{ color: 'var(--txt-primary)' }}>{email}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToLogin}
          style={{
            marginTop: '12px',
            background: 'none',
            border: 'none',
            color: 'var(--brand-primary)',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          ← Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--txt-primary)', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Reset Password</h3>
        <p style={{ fontSize: '13px', color: 'var(--txt-secondary)', margin: 0 }}>
          Enter your email address and we'll send you a link to reset your password.
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
        <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
        <input
          type="email"
          className="form-input"
          placeholder="name@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
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
          {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
        </Button>

        <button
          type="button"
          onClick={onBackToLogin}
          disabled={isSubmitting}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--txt-muted)',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '8px 0'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
