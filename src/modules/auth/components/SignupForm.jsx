import React, { useState } from 'react';
import { authService } from '../services/authService.js';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { logger } from '../../../shared/utils/logger.js';

export const SignupForm = ({ onSignupSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      logger.log('[SignupForm] Registering user:', email);
      const authResult = await authService.signUp(email, password, {
        full_name: fullName.trim()
      });
      logger.log('[SignupForm] Signup request complete. Result:', authResult);
      if (onSignupSuccess) {
        onSignupSuccess(email);
      }
    } catch (err) {
      logger.error('[SignupForm] Registration failed:', err);
      let message = 'Failed to create account. Please try again.';
      if (err) {
        if (typeof err === 'string') {
          message = err;
        } else if (err.message && typeof err.message === 'string' && err.message !== '{}') {
          message = err.message;
        } else if (err.error_description && typeof err.error_description === 'string') {
          message = err.error_description;
        } else if (typeof err === 'object') {
          try {
            const str = JSON.stringify(err);
            if (str !== '{}') {
              message = str;
            }
          } catch (e) {
            // ignore
          }
        }
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
        <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
        <input
          type="email"
          className="form-input"
          placeholder="Enter your mail id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-input"
            style={{ paddingRight: '40px' }}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--txt-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            <span className="material-icons-outlined" style={{ fontSize: '18px' }}>
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
        
        {/* Password Strength Indicator */}
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
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};
