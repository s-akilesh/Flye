import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { ContactChips } from '../components/sections/ContactChips';
import { ROUTES } from '../constants/routes';

export const Contact = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
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

      <div className="portal-content printing-grid">
        <div className="product-catalog card-glass" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: 'var(--space-3)', margin: 0 }}>Contact Details</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Reach out to us directly for hardware inquiries, technical course integrations, or custom prototyping services.</p>
          
          <ContactChips />
        </div>

        <div className="service-calculator card-glass" style={{ padding: 'var(--space-4)' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: 'var(--space-3)', marginBottom: 'var(--space-5)', margin: 0 }}>Send Message</h3>
          <form className="terminal-form" onSubmit={handleSubmit}>
            <div className="calc-row" style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="contact-name">Name</label>
              <Input
                type="text"
                id="contact-name"
                className="form-input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Akilesh"
              />
            </div>
            <div className="calc-row" style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="contact-email">Email</label>
              <Input
                type="email"
                id="contact-email"
                className="form-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. port@domain.com"
              />
            </div>
            <div className="calc-row" style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="contact-msg">Message</label>
              <textarea
                id="contact-msg"
                className="form-textarea"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                style={{ minHeight: '120px' }}
              />
            </div>
            <Button type="submit" variant="primary" className="btn-submit-calc">
              Send Message
            </Button>
          </form>
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
  );
};
