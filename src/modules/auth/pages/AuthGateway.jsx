import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';
import { SignupForm } from '../components/SignupForm';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { authService } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../../../shared/constants/routes.js';
import { logger } from '../../../shared/utils/logger.js';
import { useSettings } from '../../settings/hooks/useSettings.js';

export const AuthGateway = () => {
  const { settings } = useSettings();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup' | 'verification' | 'forgot-password' | 'reset-password'
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendStatus, setResendStatus] = useState(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect') || '/';
      logger.log(`[AuthGateway] User is already authenticated. Redirecting to ${redirectTo}...`);
      navigate(redirectTo);
    }
  }, [user, loading, navigate]);

  // Check URL parameters for recovery state on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isRecovery = params.get('type') === 'recovery' || window.location.hash.includes('type=recovery');
    if (isRecovery) {
      logger.log('[AuthGateway] Recovery parameters detected in URL. Navigating to reset-password.');
      setActiveTab('reset-password');
    }
  }, []);

  const handleSignupSuccess = (email) => {
    setRegisteredEmail(email);
    setActiveTab('verification');
  };

  const handleResendVerification = async () => {
    if (!registeredEmail) return;
    setResendStatus('sending');
    try {
      logger.log('[AuthGateway] Resending verification email to:', registeredEmail);
      await authService.resendVerificationEmail(registeredEmail);
      setResendStatus('success');
      setTimeout(() => setResendStatus(null), 5000);
    } catch (err) {
      logger.error('[AuthGateway] Failed to resend verification email:', err);
      setResendStatus('error');
    }
  };

  const handlePasswordResetSuccess = () => {
    alert('Password updated successfully! Redirecting you to the home page...');
    navigate(ROUTES.HOME);
  };

  const handleContinueAsGuest = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <AuthLayout>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '420px', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'verification' && (
            /* Email Verification Staging View */
            <motion.div
              key="verification"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                color: 'var(--accent-violet, #8b5cf6)',
                boxShadow: '0 0 24px rgba(139, 92, 246, 0.15)'
              }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>

              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: '#fff' }}>Verify your Email</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary, #94a3b8)', lineHeight: '1.6', margin: 0 }}>
                  We've sent a verification link to <strong style={{ color: '#fff' }}>{registeredEmail}</strong>. Please check your inbox and verify your account.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                <button
                  onClick={handleResendVerification}
                  disabled={resendStatus === 'sending'}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {resendStatus === 'sending' ? 'Sending...' : resendStatus === 'success' ? '✓ Resent Successfully' : resendStatus === 'error' ? '✕ Failed to Resend' : 'Resend Email'}
                </button>
                
                <button
                  onClick={() => setActiveTab('signup')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim, #64748b)',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Back to Sign Up
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'forgot-password' && (
            /* Forgot Password Form */
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ForgotPasswordForm onBackToLogin={() => setActiveTab('login')} />
            </motion.div>
          )}

          {activeTab === 'reset-password' && (
            /* Reset Password Form */
            <motion.div
              key="reset-password"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ResetPasswordForm onSuccess={handlePasswordResetSuccess} />
            </motion.div>
          )}

          {(activeTab === 'login' || activeTab === 'signup') && (
            /* Unified Sign-In / Sign-Up Form */
            <motion.div
              key="auth-forms"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Mobile Logo & Brand Name */}
              <div className="auth-mobile-logo" style={{ display: 'none', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
                {settings.websiteLogo ? (
                  <img 
                    src={settings.websiteLogo} 
                    alt="Logo" 
                    style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
                  />
                ) : (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, var(--accent-blue, #3b82f6), var(--accent-violet, #8b5cf6))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 16px rgba(139, 92, 246, 0.4)'
                  }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                    </svg>
                  </div>
                )}
                <span style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '2px', color: '#fff' }}>
                  {settings.websiteName || 'FLYEN'}
                </span>
              </div>

              {/* Heading */}
              <div className="auth-welcome-header" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                  {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary, #94a3b8)', margin: 0 }}>
                  {activeTab === 'login' ? 'Sign in to access your learning portal' : 'Get started with a free account'}
                </p>
              </div>

              {/* Sliding Tab Selectors */}
              <div style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '4px',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: activeTab === 'login' ? 'rgba(255, 255, 255, 0.05)' : 'none',
                    border: 'none',
                    color: activeTab === 'login' ? '#fff' : 'var(--text-dim, #64748b)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: activeTab === 'signup' ? 'rgba(255, 255, 255, 0.05)' : 'none',
                    border: 'none',
                    color: activeTab === 'signup' ? '#fff' : 'var(--text-dim, #64748b)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Sign Up
                </button>
              </div>

              {/* Form Render */}
              <div style={{ minHeight: '240px' }}>
                {activeTab === 'login' ? (
                  <LoginForm onForgotPassword={() => setActiveTab('forgot-password')} />
                ) : (
                  <SignupForm onSignupSuccess={handleSignupSuccess} />
                )}
              </div>

              {/* Guest / Cancel Bypass */}
              <div style={{
                textAlign: 'center',
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.04)'
              }}>
                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim, #64748b)',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#fff'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-dim, #64748b)'}
                >
                  Continue as Guest →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .auth-mobile-logo {
            display: flex !important;
          }
          .auth-welcome-header {
            text-align: center !important;
          }
        }
      `}</style>
    </AuthLayout>
  );
};
