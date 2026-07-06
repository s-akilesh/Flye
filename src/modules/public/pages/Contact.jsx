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
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+1');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !message) return;
    setIsSubmitted(true);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setJobTitle('');
    setCompanyName('');
    setMessage('');
  };

  return (
    <>
      <style>{`
        /* Contact Page Redesign Styles */
        .contact-container {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: var(--space-8);
          align-items: start;
          margin-top: var(--space-6);
        }

        .contact-left {
          grid-column: span 6;
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .contact-right {
          grid-column: span 6;
        }

        @media (max-width: 991px) {
          .contact-container {
            grid-template-columns: 1fr;
            gap: var(--space-8);
          }
          .contact-left, .contact-right {
            grid-column: span 12;
          }
        }

        .contact-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.15);
          color: var(--accent-blue, #3b82f6);
          padding: 6px var(--space-3);
          border-radius: 50px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          align-self: flex-start;
        }

        .contact-title-group h1 {
          font-size: 40px;
          font-weight: 800;
          line-height: 1.2;
          margin: var(--space-3) 0 var(--space-4) 0;
          font-family: 'Inter', sans-serif;
        }

        .contact-title-blue {
          color: var(--accent-blue, #3b82f6);
          display: block;
        }

        .contact-title-main {
          color: var(--text-main, #f9fafb);
          display: block;
        }

        .contact-desc {
          font-size: 15px;
          line-height: 1.6;
          color: var(--text-muted, #9ca3af);
          max-width: 480px;
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
          margin-top: var(--space-4);
        }

        @media (max-width: 480px) {
          .contact-info-grid {
            grid-template-columns: 1fr;
          }
        }

        .contact-info-card {
          background: var(--surface-card, rgba(20, 20, 30, 0.75));
          border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.09));
          border-radius: 12px;
          padding: var(--space-4);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          text-decoration: none;
        }

        .contact-info-card:hover {
          border-color: var(--border-active, rgba(255, 255, 255, 0.16));
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .contact-card-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          color: var(--text-main, #f9fafb);
        }

        .contact-card-icon {
          color: var(--accent-blue, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }

        .contact-card-title {
          font-size: 14px;
          font-weight: 600;
        }

        .contact-card-body {
          font-size: 12.5px;
          color: var(--text-muted, #9ca3af);
          line-height: 1.4;
          word-break: break-word;
        }

        /* Form Card Styles */
        .contact-form-card {
          background: var(--surface-card, rgba(20, 20, 30, 0.75));
          border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.09));
          border-top: 6px solid var(--accent-blue, #3b82f6);
          border-radius: 12px;
          padding: var(--space-6);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
        }

        .contact-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }

        .contact-form-full {
          grid-column: span 2;
        }

        @media (max-width: 576px) {
          .contact-form-grid > div {
            grid-column: span 2;
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
          color: var(--text-main, #f9fafb);
        }

        .phone-input-container {
          display: flex;
          align-items: center;
          background: var(--form-bg, rgba(0, 0, 0, 0.3));
          border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.09));
          border-radius: 6px;
          transition: all 0.25s var(--transition-ease);
          overflow: hidden;
        }

        .phone-input-container:hover {
          border-color: var(--border-active, rgba(255, 255, 255, 0.16));
        }

        .phone-input-container:focus-within {
          border-color: var(--accent-primary, #8b5cf6);
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.15);
          background: var(--form-bg-focus, rgba(0, 0, 0, 0.4));
        }

        .phone-prefix-select {
          background: transparent;
          border: none;
          border-right: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.09));
          color: var(--text-main, #f9fafb);
          padding: 10px var(--space-3);
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .phone-prefix-select option {
          background: var(--bg-color, #030305);
          color: var(--text-main, #f9fafb);
        }

        .phone-number-field {
          flex: 1;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 10px 14px;
          color: var(--text-main, #f9fafb);
          font-size: 13px;
          outline: none;
        }

        .contact-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--accent-blue, #3b82f6) 0%, var(--accent-violet, #8b5cf6) 100%) !important;
          border: none !important;
          color: #ffffff !important;
          font-weight: 600 !important;
          padding: 12px var(--space-4) !important;
          height: auto !important;
          border-radius: 50px !important;
          margin-top: var(--space-5);
          cursor: pointer;
          transition: all 0.25s var(--transition-ease);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13.5px;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
        }

        .contact-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
          filter: brightness(1.1);
        }
      `}</style>

      <motion.section
        className="portal-section"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.4 }}
      >
        <div className="portal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Button variant="secondary" className="btn-back" onClick={() => navigate(ROUTES.HOME)} style={{ padding: '8px', minWidth: 'auto' }}>
              <svg viewBox="0 0 24 24">
                <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
              </svg>
            </Button>
            <div className="portal-title-area">
              <h2>Contact Us</h2>
              <p>Get in Touch with FLYEN Labs Engineering Team</p>
            </div>
          </div>
        </div>

        <div className="contact-container">
          {/* Left Column - Contact Info */}
          <div className="contact-left">
            <div className="contact-badge">
              <svg className="contact-card-icon" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.28-5.116-3.573-6.4-6.4l1.293-.97a2.25 2.25 0 0 0 .417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z" />
              </svg>
              Contact Us
            </div>
            
            <div className="contact-title-group">
              <h1>
                <span className="contact-title-blue">Get In Touch</span>
                <span className="contact-title-main">With Our Team</span>
              </h1>
              <p className="contact-desc">
                Fill out the form below and our team will get back to you within 1-2 business days.
              </p>
            </div>

            <div className="contact-info-grid">
              {/* Head Office Card */}
              <div className="contact-info-card">
                <div className="contact-card-header">
                  <div className="contact-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                      <line x1="9" y1="22" x2="9" y2="16" />
                      <line x1="15" y1="22" x2="15" y2="16" />
                      <line x1="9" y1="16" x2="15" y2="16" />
                      <path d="M8 6h.01M16 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
                    </svg>
                  </div>
                  <span className="contact-card-title">Head Office</span>
                </div>
                <div className="contact-card-body">
                  {settings.companyAddress || 'Metrotech Center, NY 11201'}
                </div>
              </div>

              {/* Call Center Card */}
              <a href={`tel:${settings.contactPhone || '+1499549194004'}`} className="contact-info-card">
                <div className="contact-card-header">
                  <div className="contact-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <span className="contact-card-title">Call Center</span>
                </div>
                <div className="contact-card-body">
                  {settings.contactPhone || '+1 4995 4919 4004'}
                </div>
              </a>

              {/* Email Card */}
              <a href={`mailto:${settings.contactEmail || 'hello@moniveo.com'}`} className="contact-info-card">
                <div className="contact-card-header">
                  <div className="contact-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <span className="contact-card-title">Email</span>
                </div>
                <div className="contact-card-body">
                  {settings.contactEmail || 'hello@moniveo.com'}
                </div>
              </a>

              {/* Working Hours Card */}
              <div className="contact-info-card">
                <div className="contact-card-header">
                  <div className="contact-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <span className="contact-card-title">Working Hours</span>
                </div>
                <div className="contact-card-body">
                  Monday - Friday<br />(07 am - 05 pm)
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form Card */}
          <div className="contact-right">
            <div className="contact-form-card">
              <form onSubmit={handleSubmit} className="contact-form-grid">
                
                {/* First & Last Name */}
                <div className="form-group">
                  <label htmlFor="first-name">First Name</label>
                  <Input
                    id="first-name"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last-name">Last Name</label>
                  <Input
                    id="last-name"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="form-input"
                  />
                </div>

                {/* Email & Phone Number */}
                <div className="form-group">
                  <label htmlFor="work-email">Work Email</label>
                  <Input
                    id="work-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter work email"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone-number">Phone Number</label>
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

                {/* Job Title & Company Name */}
                <div className="form-group">
                  <label htmlFor="job-title">Job Title</label>
                  <Input
                    id="job-title"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Enter job title"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company-name">Company Name</label>
                  <Input
                    id="company-name"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                    className="form-input"
                  />
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
                  <button type="submit" className="contact-submit-btn">
                    Submit
                  </button>
                </div>

              </form>
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
