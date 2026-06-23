import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../context/AuthContext';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // If session already exists, redirect to dashboard immediately
  useEffect(() => {
    if (user) {
      navigate(ROUTES.ADMIN_DASHBOARD);
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      setSuccess('Access granted. Authenticating portal session...');
      setTimeout(() => {
        navigate(ROUTES.ADMIN_DASHBOARD);
      }, 1000);
    } catch (err) {
      setError(err?.message || 'Invalid administrator email or password.');
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      className="portal-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 160px)',
        padding: 'var(--space-4)'
      }}
    >
      <Card
        className="card-glass"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: 'var(--space-6)',
          textAlign: 'center'
        }}
      >
        {/* Flyen Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-3)' }}>
          <svg
            className="logo-icon animate-glow"
            viewBox="0 0 24 24"
            style={{
              width: '56px',
              height: '56px',
              fill: 'none',
              stroke: 'var(--accent-violet)',
              strokeWidth: '1.5'
            }}
          >
            <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
          </svg>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: 'var(--space-1)' }}>
          Admin Login
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--space-5)' }}>
          Restricted secure administration authentication portal
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Email field */}
          <div className="calc-row" style={{ textAlign: 'left' }}>
            <label htmlFor="admin-email">Administrator Email</label>
            <Input
              type="email"
              id="admin-email"
              className="form-input"
              placeholder="admin@flyen.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              style={{ padding: 'var(--space-2) var(--space-3)' }}
            />
          </div>

          {/* Password field */}
          <div className="calc-row" style={{ textAlign: 'left' }}>
            <label htmlFor="admin-password">Secure Password</label>
            <Input
              type="password"
              id="admin-password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
              style={{ padding: 'var(--space-2) var(--space-3)' }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                fontSize: '12px',
                color: 'var(--accent-crimson, #ef4444)',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: '6px',
                textAlign: 'left'
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div
              style={{
                fontSize: '12px',
                color: 'var(--accent-emerald)',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: '6px',
                textAlign: 'left'
              }}
            >
              ✅ {success}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="btn-submit-calc"
            disabled={isSubmitting}
            style={{ 
              width: '100%', 
              marginTop: 'var(--space-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)'
            }}
          >
            {isSubmitting ? (
              <>
                <svg 
                  viewBox="0 0 24 24" 
                  style={{
                    width: '16px',
                    height: '16px',
                    animation: 'spin 1s linear infinite',
                    stroke: 'currentColor',
                    fill: 'none',
                    strokeWidth: '3',
                    strokeLinecap: 'round'
                  }}
                >
                  <circle cx="12" cy="12" r="10" stroke="rgba(255, 255, 255, 0.25)" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Authenticating...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </Card>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.section>
  );
};
