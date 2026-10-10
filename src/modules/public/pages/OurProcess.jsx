import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { storageService } from '../../../shared/services/storageService';
import { useEnquiries } from '../../enquiries/hooks/useEnquiries';
import { useAuth } from '../../auth/context/AuthContext';
import { useToast } from '../../../shared/context/ToastContext';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';

/**
 * Reusable image component with graceful S3 fallback handling.
 */
const ProcessStepImage = ({ src, alt, stepNum, serviceType }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`flyen-process-img-wrap ${serviceType === 'printing' ? 'printing-glow' : 'electronics-glow'}`}>
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`flyen-process-img ${isLoaded ? 'loaded' : 'loading'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      ) : null}

      {/* Fallback Graphic if Image is Missing/Fails */}
      {(hasError || !src) && (
        <div className="flyen-process-fallback-graphic">
          <div className="flyen-fallback-grid" />
          <div className="flyen-fallback-icon-wrap">
            <span className="material-icons-outlined">
              {serviceType === 'printing' ? 'view_in_ar' : 'memory'}
            </span>
          </div>
          <span className="flyen-fallback-step-label">Step {stepNum}</span>
          <span className="flyen-fallback-desc">{alt}</span>
        </div>
      )}

      {/* Subtle corner tech border accents */}
      <span className="flyen-tech-corner top-left" />
      <span className="flyen-tech-corner top-right" />
      <span className="flyen-tech-corner bottom-left" />
      <span className="flyen-tech-corner bottom-right" />
    </div>
  );
};

export const OurProcess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addEnquiry } = useEnquiries();
  const { showToast } = useToast();

  // Modal State for Custom Print / Project Quote
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState('Custom 3D Printing Quote');
  const [modalStep, setModalStep] = useState('input'); // 'input' | 'confirmed'
  const [requestorName, setRequestorName] = useState('');
  const [contactPrefix, setContactPrefix] = useState('+91');
  const [contactNumber, setContactNumber] = useState('');
  const [projectRemarks, setProjectRemarks] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // S3 Image Assets (Dedicated our-process/ storage)
  const heroBgUrl = useMemo(() => {
    return storageService.getPublicUrl('website-assets', 'our-process/hero.jpg');
  }, []);

  const electronicsSteps = useMemo(() => [
    {
      num: '01',
      title: 'Understand Your Needs',
      desc: 'We learn about your requirements, budget, and goals to find the right solution.',
      tags: ['Requirement Scope', 'Target Budget', 'Technical Feasibility'],
      image: storageService.getPublicUrl('website-assets', 'our-process/project/step-1.jpg'),
      highlight: 'Clear Scope & Timeline'
    },
    {
      num: '02',
      title: 'Research & Plan',
      desc: 'We research suitable options, suggest the best approach, and refine the plan based on your feedback.',
      tags: ['Component Sourcing', 'Circuit Schematics', 'Architecture Review'],
      image: storageService.getPublicUrl('website-assets', 'our-process/project/step-2.jpg'),
      highlight: 'Pre-Tested Schematics'
    },
    {
      num: '03',
      title: 'Build & Keep You Updated',
      desc: 'We develop your project and share regular progress updates.',
      tags: ['Hardware Assembly', 'Embedded Firmware', 'Milestone Updates'],
      image: storageService.getPublicUrl('website-assets', 'our-process/project/step-3.jpg'),
      highlight: 'Real-Time Photos & Updates'
    },
    {
      num: '04',
      title: 'Test & Explain',
      desc: 'We test the completed project, share a demonstration video, and explain how it works.',
      tags: ['Stress & Bench Testing', 'Video Demonstration', 'Source Code & Documentation'],
      image: storageService.getPublicUrl('website-assets', 'our-process/project/step-4.jpg'),
      highlight: 'Verified Working Video'
    },
    {
      num: '05',
      title: 'Delivered & Supported',
      desc: 'We securely pack and deliver your project to your doorstep, with support when you need it.',
      tags: ['Shock-Proof Packaging', 'Doorstep Courier Tracking', 'Post-Delivery Support'],
      image: storageService.getPublicUrl('website-assets', 'our-process/project/step-5.jpg'),
      highlight: 'Ongoing Technical Guidance'
    }
  ], []);

  const printingSteps = useMemo(() => [
    {
      num: '01',
      title: 'Share Your Requirements',
      desc: 'Tell us what you need. We\'ll contact you to confirm the details and make the process simple.',
      tags: ['3D Model / Rough Idea', 'Scale & Dimensions', 'Material Consultation'],
      image: storageService.getPublicUrl('website-assets', 'our-process/3d-print/step-1.jpg'),
      highlight: 'Rapid Initial Review'
    },
    {
      num: '02',
      title: 'Design & Confirm',
      desc: 'We prepare or refine the design and confirm the requirements before printing.',
      tags: ['CAD File Slicing', 'Wall Thickness & Infill', 'Customer Approval'],
      image: storageService.getPublicUrl('website-assets', 'our-process/3d-print/step-2.jpg'),
      highlight: 'Design Optimization'
    },
    {
      num: '03',
      title: 'Print Your Product',
      desc: 'Once approved, we print your item using suitable materials and settings.',
      tags: ['FDM / SLA Precision', 'PLA, PETG, ABS, Resin', 'Layer Height Tuning'],
      image: storageService.getPublicUrl('website-assets', 'our-process/3d-print/step-3.jpg'),
      highlight: 'Precision Additive Manufacturing'
    },
    {
      num: '04',
      title: 'Quality Check',
      desc: 'We inspect the finished print to ensure it meets the agreed requirements.',
      tags: ['Dimensional Tolerances', 'Surface Finishing', 'Post-Curing & Deburring'],
      image: storageService.getPublicUrl('website-assets', 'our-process/3d-print/step-4.jpg'),
      highlight: '100% Quality Inspection'
    },
    {
      num: '05',
      title: 'Packed & Delivered',
      desc: 'We securely pack your product and deliver it straight to your doorstep.',
      tags: ['Cushioned Packaging', 'Express Courier Tracking', 'Safe Doorstep Delivery'],
      image: storageService.getPublicUrl('website-assets', 'our-process/3d-print/step-5.jpg'),
      highlight: 'Damage-Free Delivery'
    }
  ], []);

  const handleOpenQuoteModal = (context = 'Custom 3D Printing Quote') => {
    setModalContext(context);
    setModalStep('input');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!requestorName.trim()) newErrors.requestorName = true;
    
    const isPhoneValid = contactPrefix === '+91'
      ? contactNumber.trim().length === 10
      : (contactNumber.trim().length >= 7 && contactNumber.trim().length <= 15);
      
    if (!isPhoneValid) newErrors.contactNumber = true;

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      showToast('Please fill in all mandatory fields correctly.', 'error');
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      await addEnquiry({
        name: requestorName.trim(),
        mobile: `${contactPrefix}${contactNumber.trim()}`,
        projectTitle: modalContext,
        notes: `Service: ${modalContext}\nRemarks: ${projectRemarks.trim() || 'No additional notes'}`,
        userId: user?.id || null
      });
      setModalStep('confirmed');
      showToast('Your quote request has been received! Our team will contact you shortly.', 'success');
    } catch (err) {
      console.error('Failed to submit process quote enquiry:', err);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = window.innerWidth <= 768 ? 56 : 74;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flyen-process-page-root">
      {/* ========================================================================
          1. HERO SECTION
          ======================================================================== */}
      <section className="flyen-process-hero">
        <div 
          className="flyen-process-hero-bg"
          style={{ backgroundImage: `url(${heroBgUrl})` }}
        />
        <div className="flyen-process-hero-overlay" />
        
        <div className="flyen-section-container flyen-process-hero-container">
          <div className="flyen-process-hero-content">
            <span className="flyen-hero-tag">MADE WITH PURPOSE</span>
            
            <h1 className="flyen-process-hero-title">
              Our Process, From Start to Finish.
            </h1>
            
            <p className="flyen-process-hero-desc">
              Every great result starts with understanding what you need. From research and design to quality checks and doorstep delivery, we keep you informed at every step.
            </p>

            {/* Jump Navigation Pills */}
            <div className="flyen-process-jump-nav">
              <button 
                type="button" 
                className="flyen-jump-pill"
                onClick={() => scrollToSection('electronics-process')}
              >
                <span className="material-icons-outlined">memory</span>
                <span>Electronics Projects</span>
              </button>

              <button 
                type="button" 
                className="flyen-jump-pill"
                onClick={() => scrollToSection('printing-process')}
              >
                <span className="material-icons-outlined">view_in_ar</span>
                <span>Custom 3D Printing</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="flyen-process-scroll-hint"
          onClick={() => scrollToSection('electronics-process')}
          role="button"
          tabIndex={0}
          aria-label="Scroll to electronics process section"
        >
          <span className="flyen-scroll-hint-text">Explore Step by Step</span>
          <span className="material-icons-outlined flyen-scroll-hint-icon">keyboard_arrow_down</span>
        </div>
      </section>

      {/* ========================================================================
          2. ELECTRONICS PROJECTS PROCESS SECTION
          ======================================================================== */}
      <section className="flyen-process-section electronics-section" id="electronics-process">
        <div className="flyen-section-container">
          <div className="flyen-process-section-header">
            <div className="flyen-process-badge electronics-badge">
              <span className="material-icons-outlined">precision_manufacturing</span>
              <span>Hardware & Embedded Engineering</span>
            </div>
            
            <h2 className="flyen-process-section-title">
              From Your Requirements to a Working Project
            </h2>
            
            <p className="flyen-process-section-desc">
              Discover how we take your requirements, plan the right solution, and deliver a tested project with guidance and support.
            </p>
          </div>

          {/* Timeline / Alternating Step Grid */}
          <div className="flyen-timeline-wrap">
            <div className="flyen-timeline-spine" />

            <div className="flyen-steps-list">
              {electronicsSteps.map((step, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <div 
                    key={step.num}
                    className={`flyen-step-row ${isEven ? 'even-row' : 'odd-row'}`}
                  >
                    {/* Step Milestone Node */}
                    <div className="flyen-step-node">
                      <span className="flyen-step-node-num">{step.num}</span>
                    </div>

                    {/* Content Column */}
                    <div className="flyen-step-content-col">
                      <div className="flyen-step-card">
                        <div className="flyen-step-badge-row">
                          <span className="flyen-step-tag-pill">Step {step.num}</span>
                          <span className="flyen-step-highlight">{step.highlight}</span>
                        </div>

                        <h3 className="flyen-step-title">{step.title}</h3>
                        <p className="flyen-step-desc">{step.desc}</p>

                        <div className="flyen-step-tags">
                          {step.tags.map((tag) => (
                            <span key={tag} className="flyen-step-spec-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Image Column */}
                    <div className="flyen-step-visual-col">
                      <ProcessStepImage
                        src={step.image}
                        alt={`${step.title} - Flyen Electronics Project Process`}
                        stepNum={step.num}
                        serviceType="electronics"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          3. CUSTOM 3D PRINTING PROCESS SECTION
          ======================================================================== */}
      <section className="flyen-process-section printing-section" id="printing-process">
        <div className="flyen-section-container">
          <div className="flyen-process-section-header">
            <div className="flyen-process-badge printing-badge">
              <span className="material-icons-outlined">layers</span>
              <span>Rapid Prototyping & Additive Manufacturing</span>
            </div>
            
            <h2 className="flyen-process-section-title">
              From Your Request to Your Doorstep
            </h2>
            
            <p className="flyen-process-section-desc">
              Every custom print begins with understanding your needs and ends with a finished product checked for quality.
            </p>
          </div>

          {/* Timeline / Alternating Step Grid for 3D Printing */}
          <div className="flyen-timeline-wrap">
            <div className="flyen-timeline-spine printing-spine" />

            <div className="flyen-steps-list">
              {printingSteps.map((step, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <div 
                    key={step.num}
                    className={`flyen-step-row printing-step-row ${isEven ? 'even-row' : 'odd-row'}`}
                  >
                    {/* Step Milestone Node */}
                    <div className="flyen-step-node printing-node">
                      <span className="flyen-step-node-num">{step.num}</span>
                    </div>

                    {/* Content Column */}
                    <div className="flyen-step-content-col">
                      <div className="flyen-step-card printing-card">
                        <div className="flyen-step-badge-row">
                          <span className="flyen-step-tag-pill printing-pill">Step {step.num}</span>
                          <span className="flyen-step-highlight printing-highlight">{step.highlight}</span>
                        </div>

                        <h3 className="flyen-step-title">{step.title}</h3>
                        <p className="flyen-step-desc">{step.desc}</p>

                        <div className="flyen-step-tags">
                          {step.tags.map((tag) => (
                            <span key={tag} className="flyen-step-spec-tag printing-spec-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Image Column */}
                    <div className="flyen-step-visual-col">
                      <ProcessStepImage
                        src={step.image}
                        alt={`${step.title} - Flyen Custom 3D Printing Process`}
                        stepNum={step.num}
                        serviceType="printing"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          4. CLOSING CALL TO ACTION
          ======================================================================== */}
      <section className="flyen-process-cta-section">
        <div className="flyen-section-container">
          <div className="flyen-process-cta-box">
            <div className="flyen-process-cta-glow" />

            <span className="flyen-hero-tag">NEXT STEPS</span>
            <h2 className="flyen-process-cta-title">Ready to Get Started?</h2>
            
            <p className="flyen-process-cta-desc">
              Whether you need an electronics project or a custom 3D print, we're here to help you find the right solution.
            </p>

            <div className="flyen-process-cta-actions">
              <button
                type="button"
                className="flyen-btn-teal"
                onClick={() => navigate(ROUTES.PROJECTS)}
              >
                Find Your Project
              </button>

              <button
                type="button"
                className="flyen-btn-outline"
                onClick={() => handleOpenQuoteModal('Custom 3D Printing Quote')}
              >
                Request a Custom Print
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          5. REQUEST A QUOTE MODAL
          ======================================================================== */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        className="modal-content purple"
        style={{ maxWidth: '580px', width: '92%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        {modalStep === 'input' ? (
          <>
            <div style={{
              padding: '24px 24px 16px 24px',
              background: 'var(--sys-surface-elevated)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid var(--sys-divider)',
              zIndex: 10,
              flexShrink: 0
            }}>
              <h4 style={{ textAlign: 'left', margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--txt-primary)' }}>
                {modalContext.toUpperCase()}
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--txt-muted)', textAlign: 'left', margin: '4px 0 0 0' }}>
                Fill in your details below. Our team will coordinate with you.
              </p>
            </div>

            <form onSubmit={handleModalSubmit} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Your Name *</label>
                <Input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={requestorName}
                  onChange={(e) => {
                    setRequestorName(e.target.value);
                    if (formErrors.requestorName) setFormErrors(prev => ({ ...prev, requestorName: false }));
                  }}
                  className={`form-input ${formErrors.requestorName ? 'error-state' : ''}`}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Contact Number *</label>
                <div className={`phone-input-container ${formErrors.contactNumber ? 'error-state' : ''}`}>
                  <select
                    className="phone-prefix-select"
                    value={contactPrefix}
                    onChange={(e) => setContactPrefix(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderRight: '1px solid var(--sys-border)',
                      color: 'var(--txt-primary)',
                      padding: '0 8px',
                      height: '100%',
                      fontSize: '13px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="+91">+91 (IN)</option>
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+971">+971 (UAE)</option>
                  </select>
                  <Input
                    type="tel"
                    placeholder="10-digit number"
                    value={contactNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 15);
                      setContactNumber(val);
                      if (formErrors.contactNumber) setFormErrors(prev => ({ ...prev, contactNumber: false }));
                    }}
                    className="phone-number-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Tell us what you need</label>
                <textarea
                  placeholder="Describe your 3D print or electronics requirements, dimensions, or budget..."
                  rows={3}
                  value={projectRemarks}
                  onChange={(e) => setProjectRemarks(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--sys-border)',
                    background: 'var(--sys-surface)',
                    color: 'var(--txt-primary)',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="flyen-btn-outline"
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flyen-btn-teal"
                  disabled={isSubmitting}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div style={{ padding: '36px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(0, 223, 162, 0.15)',
              border: '2px solid var(--flyen-teal, #00dfa2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--flyen-teal, #00dfa2)'
            }}>
              <span className="material-icons-outlined" style={{ fontSize: '32px' }}>done</span>
            </div>

            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--txt-primary)' }}>
              Request Received!
            </h3>

            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--txt-muted)', maxWidth: '420px', lineHeight: 1.5 }}>
              Thank you for reaching out. Our engineering team has received your enquiry and will reach out to you directly via WhatsApp or phone.
            </p>

            <button
              type="button"
              className="flyen-btn-teal"
              onClick={() => setIsModalOpen(false)}
              style={{ marginTop: '12px', padding: '10px 28px', borderRadius: '8px', cursor: 'pointer' }}
            >
              Done
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
