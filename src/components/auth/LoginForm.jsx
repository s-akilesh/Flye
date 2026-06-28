import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { logger } from '../../utils/logger';

export const LoginForm = ({ onForgotPassword }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      logger.log('[LoginForm] Login success.');
    } catch (err) {
      logger.error('[LoginForm] Login failed:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
        <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label className="form-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Password</label>
        <input
          type="password"
          className="form-input"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
          <button
            type="button"
            onClick={onForgotPassword}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-violet, #8b5cf6)',
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
          background: 'linear-gradient(135deg, var(--accent-blue, #3b82f6), var(--accent-violet, #8b5cf6))',
          border: 'none',
          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.25)'
        }}
      >
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};
