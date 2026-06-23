import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ROUTES } from '../constants/routes';
import { useSettings } from '../hooks/useSettings';

export const AdminAccess = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already logged in, redirect to admin panel directly
  useEffect(() => {
    if (localStorage.getItem('flyen_admin_access') === 'true') {
      navigate(ROUTES.ADMIN_DASHBOARD);
    }
  }, [navigate]);

  const handleAccess = (e) => {
    e.preventDefault();
    setError('');

    // Authenticate password
    if (password === settings.adminPassword) {
      localStorage.setItem('flyen_admin_access', 'true');
      // Dispatch storage event manually so the Header component detects it instantly
      window.dispatchEvent(new Event('storage'));
      navigate(ROUTES.ADMIN_DASHBOARD);
    } else {
      setError('Invalid administration access password.');
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
          Admin Portal
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--space-5)' }}>
          Restricted administration access key terminal
        </p>

        <form onSubmit={handleAccess} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="calc-row" style={{ textAlign: 'left' }}>
            <label htmlFor="admin-portal-password">Administration Key</label>
            <Input
              type="password"
              id="admin-portal-password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ textAlign: 'center', letterSpacing: password ? '3px' : '0' }}
            />
          </div>

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

          <Button
            type="submit"
            variant="primary"
            className="btn-submit-calc"
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
          >
            Access Portal
          </Button>
        </form>
      </Card>
    </motion.section>
  );
};
