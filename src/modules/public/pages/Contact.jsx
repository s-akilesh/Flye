import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { ROUTES } from '../../../shared/constants/routes';
import { useSettings } from '../../settings/hooks/useSettings';

export const Contact = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  
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
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
              </a>
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
