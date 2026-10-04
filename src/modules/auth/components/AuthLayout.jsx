import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../../settings/hooks/useSettings.js';

export const AuthLayout = ({ children }) => {
  const { settings } = useSettings();

  return (
    <div
      data-theme="dark"
      className="auth-dark-wrapper"
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#08070d',
        color: '#f9fafb',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Left Pane - Brand Showcase (Hidden on Mobile/Tablet) */}
      <div className="auth-showcase-pane" style={{
        flex: '0 0 45%',
        background: 'radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.12), transparent 50%), radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.08), transparent 50%), #0d0c15',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
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
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
          opacity: 0.5
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
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.35)'
            }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
              </svg>
            </div>
          )}
          <span style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '2px', color: '#f9fafb' }}>
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
              color: '#f9fafb',
              marginBottom: '24px',
              letterSpacing: '-1px'
            }}
          >
            Start your journey in <span style={{
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 32px rgba(56, 189, 248, 0.25)'
            }}>Advanced Electronics</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#94a3b8'
            }}
          >
            Access interactive component layers, progressive electrical engineering fundamentals, and step-by-step DIY hardware projects.
          </motion.p>
        </div>

        {/* Bottom: Footer Info */}
        <div style={{ zIndex: 2, fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
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
        position: 'relative',
        background: '#08070d'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {children}
        </div>
      </div>

      {/* Global CSS overrides for dark theme auth styling */}
      <style>{`
        .auth-dark-wrapper {
          --sys-bg: #08070d !important;
          --sys-surface: #0d0c15 !important;
          --sys-card: rgba(20, 20, 30, 0.6) !important;
          --sys-surface-elevated: #0d0c15 !important;
          --sys-border: rgba(255, 255, 255, 0.09) !important;
          --sys-divider: rgba(255, 255, 255, 0.06) !important;
          --txt-primary: #f9fafb !important;
          --txt-secondary: #94a3b8 !important;
          --txt-muted: #64748b !important;
          --brand-primary: #38bdf8 !important;
          --brand-primary-hover: #7dd3fc !important;
          --interaction-hover: rgba(255, 255, 255, 0.04) !important;
          --interaction-selected: rgba(56, 189, 248, 0.15) !important;
          --form-bg: #12111d !important;
          --input-bg: #12111d !important;
          background-color: #08070d !important;
          color: #f9fafb !important;
        }

        .auth-dark-wrapper .form-input,
        .auth-dark-wrapper input[type="text"],
        .auth-dark-wrapper input[type="email"],
        .auth-dark-wrapper input[type="password"] {
          background: #12111d !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #f9fafb !important;
          border-radius: 8px !important;
          font-size: 13px !important;
          height: 42px !important;
          box-sizing: border-box !important;
          transition: all 0.2s ease !important;
        }

        .auth-dark-wrapper .form-input:focus,
        .auth-dark-wrapper input:focus {
          border-color: #38bdf8 !important;
          background: #161524 !important;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2) !important;
          outline: none !important;
        }

        .auth-dark-wrapper .form-input::placeholder,
        .auth-dark-wrapper input::placeholder {
          color: #64748b !important;
        }

        .auth-dark-wrapper .form-label {
          color: #94a3b8 !important;
          font-size: 11.5px !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }

        .auth-dark-wrapper h1,
        .auth-dark-wrapper h2,
        .auth-dark-wrapper h3,
        .auth-dark-wrapper h4 {
          color: #f9fafb !important;
        }

        .auth-dark-wrapper p {
          color: #94a3b8 !important;
        }

        .auth-dark-wrapper .btn-primary,
        .auth-dark-wrapper button[type="submit"] {
          background: #38bdf8 !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 8px !important;
          font-weight: 700 !important;
          font-size: 13.5px !important;
          height: 42px !important;
          box-shadow: 0 4px 18px rgba(56, 189, 248, 0.35) !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .auth-dark-wrapper .btn-primary:hover,
        .auth-dark-wrapper button[type="submit"]:hover {
          background: #7dd3fc !important;
          color: #ffffff !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 22px rgba(56, 189, 248, 0.5) !important;
        }

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
