import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import { RelatedProjects } from '../components/sections/RelatedProjects';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { ROUTES } from '../constants/routes';
import { useEnquiries } from '../hooks/useEnquiries';

export const ProjectDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProjectBySlug, getRelatedProjects, isLoading } = useProjects();
  const { addEnquiry } = useEnquiries();

  const project = getProjectBySlug(slug);

  // Gallery state - removed (using actual thumbnail image now)

  // Modals state
  const [modalType, setModalType] = useState(null); // 'order', 'expert', 'ai'
  const [aiQuery, setAiQuery] = useState('');
  const [targetOrderProject, setTargetOrderProject] = useState(null);
  const [requestorName, setRequestorName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [orderStep, setOrderStep] = useState('input'); // 'input' | 'confirmed'

  const openOrderModal = () => {
    setTargetOrderProject(project);
    setRequestorName('');
    setContactNumber('');
    setOrderStep('input');
  };

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="portal-section" style={{ textAlign: 'center', paddingTop: '160px' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>Loading project specifications...</h2>
      </div>
    );
  }

  if (!project || project.status === 'draft' || project.status === 'archived') {
    return (
      <div className="portal-section" style={{ textAlign: 'center', paddingTop: '160px' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Project not found</h2>
        <Button className="btn-back" id="btn-back-notfound" onClick={() => navigate(ROUTES.PROJECTS)} style={{ margin: '20px auto' }}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const related = getRelatedProjects(project);

  const handleAISearchTrigger = () => {
    setModalType('ai');
    setAiQuery(`I need help building: ${project.title}`);
  };

  // Safe variables mapping
  const title = project.title || 'Engineering Kit';
  const description = project.description || 'No description available.';
  const fullDescription = project.fullDescription || '';
  const price = project.price || 0;
  const difficulty = project.difficulty || 'intermediate';
  const buildTime = project.buildTime || 'N/A';
  const technology = project.technology || 'Arduino';
  const projectLevel = project.projectLevel || 'Engineering';
  const category = project.category || 'general';
  const badge = project.badge || '';
  const specifications = project.specifications || {};
  const components = project.components || [];
  const resources = project.resources || [];
  const reviews = project.reviews || [];

  return (
    <motion.section
      className="portal-section"
      id="detail-portal"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="portal-header"
        style={{
          maxWidth: '100%',
          width: '100%',
          paddingLeft: '40px',
          paddingRight: '40px',
          position: 'sticky',
          top: '68px',
          zIndex: 90,
          background: 'rgba(10, 10, 18, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          marginBottom: 'var(--space-6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button variant="secondary" className="btn-back" id="btn-back-detail" onClick={() => navigate(ROUTES.PROJECTS)} style={{ padding: '8px', minWidth: 'auto' }}>
            <svg viewBox="0 0 24 24">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
            </svg>
          </Button>
          <div className="portal-title-area">
            <h2 id="detail-project-name">{title}</h2>
            <p id="detail-project-subtitle">{description}</p>
          </div>
        </div>
      </div>

      <div className="portal-content id-detail-portal-content" style={{ maxWidth: '100%', width: '100%', paddingLeft: '40px', paddingRight: '40px' }}>
        <div className="detail-page-layout">
          {/* Left Column */}
          <div className="detail-left-column">
            {/* Project Thumbnail Image */}
            <div className="detail-gallery-card card-glass" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
              {project.images?.main ? (
                <img
                  src={project.images.main}
                  alt={title}
                  style={{
                    width: '100%',
                    height: '280px',
                    objectFit: 'cover',
                    display: 'block',
                    borderRadius: '12px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              {/* Fallback placeholder when no image */}
              <div
                style={{
                  display: project.images?.main ? 'none' : 'flex',
                  width: '100%',
                  height: '280px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px'
                }}
              >
                <svg viewBox="0 0 24 24" style={{ width: '48px', height: '48px', fill: 'none', stroke: 'var(--accent-blue)', strokeWidth: 1 }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No image uploaded</span>
              </div>
            </div>


            {/* Full Description */}
            {fullDescription && (
              <div className="detail-section card-glass rich-text-content">
                <h3 style={{ color: 'var(--accent-blue)', marginBottom: 'var(--space-3)' }}>Detailed Project Blueprint</h3>
                <div dangerouslySetInnerHTML={{ __html: fullDescription }} />
              </div>
            )}

            {/* Component Chips List */}
            {components.length > 0 && (
              <div className="detail-section card-glass">
                <h3 style={{ color: 'var(--accent-blue)', marginBottom: 'var(--space-4)' }}>Hardware System Components Included</h3>
                <div className="components-chips-list">
                  {components.map((c, idx) => (
                    <span key={idx} className="component-chip-node">
                      ⚡ {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Downloadable resources */}
            <div className="detail-section card-glass">
              <h3 style={{ color: 'var(--accent-blue)', marginBottom: 'var(--space-4)' }}>Downloadable Project Resources</h3>
              <div className="resources-download-list">
                {resources.length > 0 ? (
                  resources.map((r, idx) => {
                    if (!r) return null;
                    const size = r.size || 'Link';
                    const type = r.type || 'url';
                    const name = r.name || 'Resource File';
                    const status = r.status || 'available';
                    return (
                      <div key={idx} className="resource-row-node">
                        {r.url ? (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={name}
                            style={{ display: 'flex', justifyContent: 'space-between', width: '100%', textDecoration: 'none', color: 'inherit', alignItems: 'center' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="file-icon">💾</span>
                              <div>
                                <div className="file-name" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>{name}</div>
                                <span className="file-meta">
                                  {type.toUpperCase()} &bull; {size}
                                </span>
                              </div>
                            </div>
                            <span className={`resource-badge ${status}`}>{status.toUpperCase()}</span>
                          </a>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="file-icon">📄</span>
                              <div>
                                <div className="file-name">{name}</div>
                                <span className="file-meta">
                                  {type.toUpperCase()} &bull; {size}
                                </span>
                              </div>
                            </div>
                            <span className={`resource-badge ${status}`}>{status.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No downloadable files currently catalogued for this kit.</p>
                )}
              </div>
            </div>

            {/* Technical Diagrams & Schematic Files */}
            {(project.images?.schematic || project.images?.circuit) && (
              <div className="detail-section card-glass">
                <h3 style={{ color: 'var(--accent-blue)', marginBottom: 'var(--space-4)' }}>Technical Diagrams & Files</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {project.images?.schematic && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'rgba(255,255,255,0.01)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>📐</span>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Schematic Diagram</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Vector schematic drawing file</div>
                        </div>
                      </div>
                      <a 
                        href={project.images.schematic} 
                        download={`Schematic_${project.slug}.svg`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: '6px 16px', fontSize: '12px', textDecoration: 'none' }}
                      >
                        Download
                      </a>
                    </div>
                  )}
                  {project.images?.circuit && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'rgba(255,255,255,0.01)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>🔌</span>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Circuit Diagram</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Wiring and connections drawing file</div>
                        </div>
                      </div>
                      <a 
                        href={project.images.circuit} 
                        download={`Circuit_${project.slug}.svg`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: '6px 16px', fontSize: '12px', textDecoration: 'none' }}
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Video Tutorial Card */}
            {project.videoUrl && !project.videoUrl.includes('placeholder') && (
              <div className="detail-section card-glass">
                <h3 style={{ color: 'var(--accent-blue)', marginBottom: 'var(--space-4)' }}>Video Tutorial</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🎥</span>
                    <div>
                      <div 
                        title={`${title} Video Tutorial Guide`}
                        style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}
                      >
                        {(() => {
                          const vTitle = `${title} Video Tutorial Guide`;
                          return vTitle.length > 35 ? vTitle.substring(0, 32) + '...' : vTitle;
                        })()}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Step-by-step build and debugging guide</div>
                    </div>
                  </div>
                  <a 
                    href={project.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-submit-calc"
                    style={{ padding: '8px 20px', fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap' }}
                  >
                    Watch Tutorial
                  </a>
                </div>
              </div>
            )}


            {/* AI support */}
            <div className="detail-section card-glass ai-detail-card" style={{ padding: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <span className="ai-sparkle">✨</span>
                <div className="ai-title-desc">
                  <h5 style={{ color: '#fff', fontSize: '14.5px', marginBottom: '4px' }}>Need Help With This Project?</h5>
                  <p style={{ margin: 0, fontSize: '12px' }}>Ask queries about wiring node inputs, firmware code debugging, or custom component layouts.</p>
                </div>
              </div>
              <Button type="button" variant="primary" id="btn-detail-ai-ask" onClick={handleAISearchTrigger} style={{ whiteSpace: 'nowrap' }}>
                Ask Flyen AI
              </Button>
            </div>

            {/* Customer reviews */}
            <div className="detail-section card-glass">
              <h3 style={{ color: 'var(--accent-blue)', marginBottom: 'var(--space-4)' }}>Customer Reviews & Feedback</h3>
              <div className="reviews-container">
                {reviews.length > 0 ? (
                  reviews.map((rev, idx) => {
                    if (!rev) return null;
                    const rating = typeof rev.rating === 'number' && !isNaN(rev.rating) ? rev.rating : 5;
                    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
                    return (
                      <div key={idx} className="review-card-node">
                        <div className="review-header">
                          <span className="review-stars">{stars}</span>
                          <span className="reviewer-name">{rev.name || 'Anonymous'}</span>
                        </div>
                        <p className="review-text">"{rev.comment || 'No feedback provided.'}"</p>
                        <span className="reviewer-meta">
                          {rev.institution || 'Independent Builder'} &bull; Verified Builder
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No reviews logged for this kit yet. Be the first to build and review!</p>
                )}
              </div>
            </div>

            {/* Related project kits */}
            {/* Related project kits */}
            <RelatedProjects
              relatedProjects={related}
              onRequestOrder={(proj) => {
                setTargetOrderProject(proj);
                setRequestorName('');
                setContactNumber('');
                setOrderStep('input');
              }}
            />
          </div>

          {/* Right Column Sticky Panel */}
          <div className="detail-right-column">
            <div className="sticky-detail-panel card-glass">
              <Badge badgeType={badge} />
              <h2>{title}</h2>
              <p className="detail-hero-desc">{description}</p>

              <div className="detail-meta-list">
                <div className="detail-meta-item">
                  <span className="lbl">Difficulty:</span>
                  <span className={`val diff-${difficulty}`}>{difficulty.toUpperCase()}</span>
                </div>
                <div className="detail-meta-item">
                  <span className="lbl">Build Time:</span>
                  <span className="val">{buildTime}</span>
                </div>
                <div className="detail-meta-item">
                  <span className="lbl">Primary Controller:</span>
                  <span className="val">{specifications.controller || technology}</span>
                </div>
                <div className="detail-meta-item">
                  <span className="lbl">Project Level:</span>
                  <span className="val" style={{ color: 'var(--accent-amber)' }}>{projectLevel}</span>
                </div>
                <div className="detail-meta-item">
                  <span className="lbl">Category:</span>
                  <span className="val">{category.toUpperCase()}</span>
                </div>
              </div>

              <div className="detail-price-box">
                <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="price-val">₹{price}</span>
                  <span className="availability-badge">
                    {project.stockStatus === 'out-of-stock' ? '⚠ Out of Stock' : '✓ In Stock'}
                  </span>
                </div>
                <p className="delivery-time" style={{ margin: 0 }}>
                  Estimated Delivery: {project.estimatedDelivery || '3-5 Business Days'}
                </p>
              </div>

              <Button
                type="button"
                variant="primary"
                className="width-100 btn-submit-calc"
                id="btn-detail-order"
                onClick={openOrderModal}
                style={{ marginTop: 'var(--space-2)' }}
              >
                Request Project Kit
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="width-100 btn-terminal-submit"
                id="btn-detail-expert"
                onClick={() => setModalType('expert')}
              >
                Contact Expert
              </Button>
              <a
                href={`https://wa.me/${project.whatsappNumber || '1234567890'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-chip whatsapp width-100 justify-center"
                style={{ marginTop: 'var(--space-2)' }}
              >
                <svg viewBox="0 0 24 24" style={{ fill: 'currentColor', width: '14px', height: '14px' }}>
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.467 0 9.911-4.441 9.913-9.913.002-2.651-1.02-5.143-2.878-7.001C16.444 1.83 13.955.808 11.312.808c-5.474 0-9.915 4.444-9.917 9.916-.002 1.554.43 3.076 1.25 4.43l-.973 3.548 3.642-.956-.268-.152zm11.31-7.142c-.3-.149-1.776-.876-2.052-.976-.275-.1-.476-.149-.675.15-.199.299-.773.976-.949 1.176-.175.199-.35.224-.65.075-.3-.15-1.265-.466-2.41-1.487-.89-.794-1.775-1.665-2.074-.175-.299-.019-.461.13-.61.135-.133.3-.349.45-.523.15-.174.2-.299.3-.499.1-.199.05-.374-.025-.523-.075-.149-.675-1.627-.925-2.226-.243-.584-.488-.507-.674-.517-.175-.01-.375-.01-.575-.01-.2 0-.526.075-.801.374-.275.299-1.05.1023-1.05 2.5 0 2.396 1.747 4.708 1.986 5.032.25.324 3.441 5.253 8.337 7.371 1.164.502 2.074.802 2.784 1.026 1.169.372 2.235.319 3.077.193.938-.14 1.776-.723 2.027-1.396.25-.674.25-1.246.175-1.396-.075-.149-.275-.249-.575-.398z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA bar for Mobile viewports */}
      <div className="mobile-sticky-cta-bar" id="mobile-sticky-cta-bar" style={{ display: 'flex' }}>
        <div className="mobile-cta-price-box">
          <span className="mobile-price-lbl">Unit Cost:</span>
          <span className="mobile-price-val" id="mobile-detail-price">
            ₹{price}
          </span>
        </div>
        <Button
          type="button"
          variant="primary"
          className="btn-submit-calc"
          id="btn-mobile-detail-order"
          onClick={openOrderModal}
        >
          Request Kit
        </Button>
      </div>

      {/* Modals Container */}

      {/* 2. Expert Consultation Modal */}
      <Modal isOpen={modalType === 'expert'} onClose={() => setModalType(null)}>
        <div className="modal-icon">
          <svg viewBox="0 0 24 24">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
        <h4>EXPERT LINK ACTIVE</h4>
        <p>Your request has been logged successfully. Summary receipt details below.</p>

        <div className="modal-receipt">
          <div className="receipt-row">
            <span>PROJECT FOCUS:</span>
            <span className="receipt-val">{title}</span>
          </div>
          <div className="receipt-row">
            <span>CONSULTANT:</span>
            <span className="receipt-val">Flyen Labs Expert</span>
          </div>
          <div className="receipt-row" style={{ borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '8px' }}>
            <span>STATUS:</span>
            <span className="receipt-val" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>
              SMS TRIGGERED
            </span>
          </div>
        </div>

        <Button variant="secondary" className="modal-btn" onClick={() => setModalType(null)}>
          Close
        </Button>
      </Modal>

      {/* 3. AI Query Modal */}
      <Modal isOpen={modalType === 'ai'} onClose={() => setModalType(null)} className="ai-modal-content">
        <div className="compare-modal-header">
          <h4>✨ AI Assistant</h4>
          <Button
            variant="ghost"
            className="btn-close-ai"
            onClick={() => setModalType(null)}
          >
            &times;
          </Button>
        </div>
        <p style={{ textAlign: 'left', marginBottom: 'var(--space-5)' }}>
          Describe what you need help with regarding the <strong>{title}</strong>:
        </p>
        <div className="ai-input-row">
          <Input
            type="text"
            placeholder="Wiring nodes, code compilation queries..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="form-input"
          />
          <Button
            type="button"
            variant="none"
            className="btn-ai-submit"
            onClick={() => {
              alert("Query submitted to AI Assistant!");
              setModalType(null);
            }}
          >
            Ask
          </Button>
        </div>
      </Modal>

      {/* Unified Request Kit Modal */}
      <Modal isOpen={targetOrderProject !== null} onClose={() => setTargetOrderProject(null)} className="modal-content purple">
        {orderStep === 'input' ? (
          <>
            <div className="modal-icon">
              <svg viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </div>
            <h4>REQUEST PROJECT KIT</h4>
            <p>Enter your details below to confirm your request for <strong>{targetOrderProject?.title}</strong>.</p>

            <div style={{ margin: 'var(--space-3) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Your Name *</label>
                <Input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={requestorName}
                  onChange={(e) => setRequestorName(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Contact Number *</label>
                <Input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="form-input"
                  maxLength={15}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <Button variant="secondary" className="modal-btn" style={{ flex: 1 }} onClick={() => setTargetOrderProject(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="modal-btn btn-submit-calc"
                style={{ flex: 1 }}
                onClick={() => {
                  if (!requestorName.trim()) {
                    alert('Please enter your name.');
                    return;
                  }
                  if (!contactNumber.trim() || contactNumber.replace(/\D/g, '').length < 10) {
                    alert('Please enter a valid 10-digit contact number.');
                    return;
                  }
                  addEnquiry({
                    name: requestorName,
                    mobile: contactNumber,
                    projectId: targetOrderProject.id,
                    projectTitle: targetOrderProject.title,
                    price: targetOrderProject.price
                  });
                  setOrderStep('confirmed');
                }}
              >
                Submit
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--accent-emerald)' }}>
              <svg viewBox="0 0 24 24">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <h4>KIT REQUEST CONFIRMED</h4>
            <p>Your request has been received. We'll reach out to <strong style={{ color: 'var(--accent-blue)' }}>{requestorName}</strong> ({contactNumber}) shortly.</p>

            {targetOrderProject && (
              <div className="modal-receipt" id="receipt-meta">
                <div className="receipt-row">
                  <span>PROJECT KIT:</span>
                  <span className="receipt-val">{targetOrderProject.title}</span>
                </div>
                <div className="receipt-row">
                  <span>CONTACT:</span>
                  <span className="receipt-val">{contactNumber}</span>
                </div>
                <div className="receipt-row" style={{ borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '8px' }}>
                  <span>UNIT COST:</span>
                  <span className="receipt-val" style={{ color: 'var(--accent-violet)', fontWeight: 600 }}>₹{targetOrderProject.price}</span>
                </div>
              </div>
            )}

            <Button variant="secondary" className="modal-btn" onClick={() => setTargetOrderProject(null)} style={{ marginTop: 'var(--space-3)' }}>
              Close
            </Button>
          </>
        )}
      </Modal>
    </motion.section>
  );
};
