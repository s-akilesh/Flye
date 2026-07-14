import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { logger } from '../../../shared/utils/logger.js';

export const LoginForm = ({ onForgotPassword }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      logger.log('[LoginForm] Attempting sign-in for:', email);
      await login(email, password);
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect') || '/';
      logger.log(`[LoginForm] Login success. Redirecting to ${redirectTo}...`);
      navigate(redirectTo);
    } catch (err) {
      logger.error('[LoginForm] Login failed:', err);
      let message = 'Invalid email or password. Please try again.';
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
        <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--txt-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Password</label>
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
          <button
            type="button"
            onClick={onForgotPassword}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brand-primary)',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: 0
            }}
          >
            Forgot Password?
          </button>
        </div>
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
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};
