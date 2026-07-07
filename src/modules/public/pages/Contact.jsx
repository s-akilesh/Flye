import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { ROUTES } from '../../../shared/constants/routes';
import { useSettings } from '../../settings/hooks/useSettings';
import { SEO, PageType, generateSEO } from '../../../shared/seo';

export const Contact = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  const seoProps = generateSEO(PageType.CONTACT);
  
  const [name, setName] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+91');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setIsSubmitted(true);
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <>
      <SEO {...seoProps} page={PageType.CONTACT} />
      <style>{`
        @keyframes wave {
          0% { transform: rotate(0.0deg) }
          10% { transform: rotate(14.0deg) }
          20% { transform: rotate(-8.0deg) }
          30% { transform: rotate(14.0deg) }
          40% { transform: rotate(-4.0deg) }
          50% { transform: rotate(10.0deg) }
          60% { transform: rotate(0.0deg) }
          100% { transform: rotate(0.0deg) }
        }

        .contact-page-wrapper {
          position: relative;
          width: 100%;
          min-height: calc(100vh - 190px); /* accounting for main layout header/footer */
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-8) 0;
          overflow: visible;
        }

        .contact-header-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: var(--space-7);
          z-index: 2;
        }

        /* Status Pill */
        .contact-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: var(--text-secondary, #9ca3af);
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.3px;
          margin-bottom: var(--space-6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .contact-status-divider {
          width: 1px;
          height: 12px;
          background: rgba(255, 255, 255, 0.15);
        }

        .contact-status-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .contact-status-icon {
          color: #a78bfa;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-title-centered {
          font-family: 'Inter', sans-serif;
          font-size: 40px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: var(--space-3);
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .contact-desc-centered {
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--text-muted, #9ca3af);
          max-width: 520px;
        }

        /* Centered Form Wrapper */
        .contact-form-wrapper-centered {
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
          z-index: 2;
        }

        .contact-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-5);
        }

        .contact-form-full {
          grid-column: span 2;
        }

        @media (max-width: 640px) {
          .contact-form-grid > div {
            grid-column: span 2;
          }
          .contact-title-centered {
            font-size: 32px;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .form-group label {
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-secondary, #9ca3af);
        }

        .phone-input-container {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          transition: all 0.25s var(--transition-ease);
          overflow: hidden;
          height: 38px;
        }

        .phone-input-container:hover {
          border-color: rgba(255, 255, 255, 0.12);
        }

        .phone-input-container:focus-within {
          border-color: #8b5cf6;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.15);
          background: rgba(0, 0, 0, 0.2);
        }

        .phone-prefix-select {
          background: transparent;
          border: none;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          color: var(--text-main, #f9fafb);
          padding: 0 var(--space-3);
          height: 100%;
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .phone-prefix-select option {
          background: #0d0c15;
          color: var(--text-main, #f9fafb);
        }

        .phone-number-field {
          flex: 1;
          height: 100%;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 14px;
          color: var(--text-main, #f9fafb);
          font-size: 13px;
          outline: none;
        }

        /* Customize regular Inputs style for premium translucent look */
        .contact-form-grid .form-input,
        .contact-form-grid .form-textarea {
          background: rgba(255, 255, 255, 0.01) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 6px !important;
          color: #ffffff !important;
          padding: 10px 14px !important;
          font-size: 13px !important;
          transition: all 0.25s var(--transition-ease) !important;
        }

        .contact-form-grid .form-input:hover,
        .contact-form-grid .form-textarea:hover {
          border-color: rgba(255, 255, 255, 0.12) !important;
        }

        .contact-form-grid .form-input:focus,
        .contact-form-grid .form-textarea:focus {
          border-color: #8b5cf6 !important;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.15) !important;
          background: rgba(0, 0, 0, 0.2) !important;
        }

        .contact-form-grid ::placeholder {
          color: rgba(255, 255, 255, 0.25) !important;
        }

        /* Rectangular submit button styling */
        .contact-submit-btn {
          width: 100%;
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
          font-weight: 500 !important;
          padding: 12px var(--space-4) !important;
          height: 42px !important;
          border-radius: 6px !important;
          margin-top: var(--space-3);
          cursor: pointer;
          transition: all 0.25s var(--transition-ease);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        }

        .contact-submit-btn:hover {
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }

        /* Social Divider Footer */
        .contact-social-footer {
          margin-top: 56px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 2;
        }

        .contact-social-line {
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
          margin-bottom: 24px;
        }

        .contact-social-icons {
          display: flex;
          gap: 24px;
        }

        .contact-social-link {
          color: rgba(255, 255, 255, 0.3);
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-social-link:hover {
          color: #ffffff;
        }
      `}</style>

      <motion.section
        className="portal-section"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'relative', overflow: 'hidden' }}
      >

        <div className="contact-page-wrapper">
          <div className="contact-header-center">

            <h1 className="contact-title-centered">
              Lets Have a Chat
              <span style={{ display: 'inline-block', animation: 'wave 2.5s infinite', transformOrigin: '70% 70%' }}>👋</span>
            </h1>
            <p className="contact-desc-centered">
              Questions about our products/services, orders, or just want to say hello? We're here to help
            </p>
          </div>

          {/* Centered Form Wrapper */}
          <div className="contact-form-wrapper-centered">
            <form onSubmit={handleSubmit} className="contact-form-grid">
              
              {/* Name */}
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="form-input"
                />
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label htmlFor="phone-number">Phone number</label>
                <div className="phone-input-container">
                  <select
                    className="phone-prefix-select"
                    value={phonePrefix}
                    onChange={(e) => setPhonePrefix(e.target.value)}
                  >
                    <option value="+1">+1</option>
                    <option value="+91">+91</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+81">+81</option>
                    <option value="+33">+33</option>
                  </select>
                  <input
                    id="phone-number"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="phone-number-field"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="form-group contact-form-full">
                <label htmlFor="contact-msg">Message</label>
                <textarea
                  id="contact-msg"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter message"
                  className="form-textarea"
                  style={{ minHeight: '120px', resize: 'vertical' }}
                />
              </div>

              {/* Submit Button */}
              <div className="contact-form-full">
                <Button type="submit" variant="primary" style={{ width: '100%', height: '42px', marginTop: '12px' }}>
                  Send message
                </Button>
              </div>

            </form>
          </div>

          {/* Bottom Social Icons */}
          <div className="contact-social-footer">
            <div className="contact-social-icons">
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="contact-social-link" title="Twitter / X">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="contact-social-link" title="Instagram">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
              )}
              {settings.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-social-link" title="LinkedIn">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
              {settings.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="contact-social-link" title="YouTube">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.54 12 3.54 12 3.54s-7.53 0-9.388.515A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.46 12 20.46 12 20.46s7.53 0 9.388-.515a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="contact-social-link" title="Facebook">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {settings.githubUrl && (
                <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" className="contact-social-link" title="GitHub">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
              )}
              {settings.websiteUrl && (
                <a href={settings.websiteUrl} target="_blank" rel="noopener noreferrer" className="contact-social-link" title="Website">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <Modal isOpen={isSubmitted} onClose={() => setIsSubmitted(false)}>
          <div className="modal-icon">
            <svg viewBox="0 0 24 24">
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </div>
          <h4>MESSAGE ROUTED</h4>
          <p>Your message has been dispatched successfully. We will reply to your port email.</p>
          <Button variant="secondary" className="modal-btn" onClick={() => setIsSubmitted(false)}>
            Close
          </Button>
        </Modal>
      </motion.section>
    </>
  );
};
