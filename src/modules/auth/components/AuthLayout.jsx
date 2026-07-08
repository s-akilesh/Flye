import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../../settings/hooks/useSettings.js';

export const AuthLayout = ({ children }) => {
  const { settings } = useSettings();

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-primary, #0a0a0c)',
      color: 'var(--text-primary, #f3f4f6)',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Left Pane - Brand Showcase (Hidden on Mobile/Tablet) */}
      <div className="auth-showcase-pane" style={{
        flex: '0 0 45%',
        background: 'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15), transparent), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.12), transparent), var(--bg-secondary, #111115)',
        borderRight: '1px solid var(--border-color, rgba(255, 255, 255, 0.05))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 48px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Futuristic Grid Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none'
        }} />

        {/* Top: Branding Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
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

        {/* Middle: Premium Copy with Glowing Highlights */}
        <div style={{ zIndex: 2, maxWidth: '440px' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: '36px',
              fontWeight: '800',
              lineHeight: '1.2',
              color: '#fff',
              marginBottom: '24px',
              letterSpacing: '-1px'
            }}
          >
            Start your journey in <span style={{
              background: 'linear-gradient(135deg, var(--accent-blue, #3b82f6), var(--accent-violet, #8b5cf6))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 32px rgba(139, 92, 246, 0.2)'
            }}>Advanced Electronics</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: '15px',
              lineHeight: '1.6',
              color: 'var(--text-secondary, #94a3b8)'
            }}
          >
            Access interactive component layers, progressive electrical engineering fundamentals, and step-by-step DIY hardware projects.
          </motion.p>
        </div>

        {/* Bottom: Footer Info */}
        <div style={{ zIndex: 2, fontSize: '11px', color: 'var(--text-dim, #64748b)', display: 'flex', justifyContent: 'space-between' }}>
          <span>© {new Date().getFullYear()} Flyen Labs.</span>
          <span>Version 1.1.0</span>
        </div>
      </div>

      {/* Right Pane - Interactive Form Container */}
      <div className="auth-form-pane" style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {children}
        </div>
      </div>

      {/* Global CSS overrides for responsive layout styling */}
      <style>{`
        @media (max-width: 991px) {
          .auth-showcase-pane {
            display: none !important;
          }
          .auth-form-pane {
            flex: 1 1 100% !important;
            padding: 48px 20px !important;
          }
        }
      `}</style>
    </div>
  );
};
