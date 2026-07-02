import React, { useState, useEffect, useMemo } from 'react';
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
import { useSettings } from '../hooks/useSettings';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ProgressiveAuthModal } from '../components/auth/ProgressiveAuthModal';

// Custom SVG Icons
const DIYIcon = () => (
  <span className="material-icons-outlined" style={{ fontSize: '20px', color: 'var(--accent-blue)', flexShrink: 0 }}>construction</span>
);

const CompleteIcon = () => (
  <span className="material-icons-outlined" style={{ fontSize: '20px', color: 'var(--accent-violet)', flexShrink: 0 }}>workspace_premium</span>
);

const PrintedIcon = () => (
  <span className="material-icons-outlined" style={{ fontSize: '20px', color: 'var(--accent-emerald)', flexShrink: 0 }}>layers</span>
);

const CustomIcon = () => (
  <span className="material-icons-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)', flexShrink: 0 }}>inventory_2</span>
);

const PCBIcon = () => (
  <span className="material-icons-outlined" style={{ fontSize: '14px', color: 'currentColor' }}>developer_board</span>
);

const ChipIcon = () => (
  <span className="material-icons-outlined" style={{ fontSize: '14px', color: 'currentColor' }}>memory</span>
);

const CubeIcon = () => (
  <span className="material-icons-outlined" style={{ fontSize: '14px', color: 'currentColor' }}>view_in_ar</span>
);

const BookIcon = () => (
  <span className="material-icons-outlined" style={{ fontSize: '14px', color: 'currentColor' }}>menu_book</span>
);

const getKitIcon = (id) => {
  if (id === 'diy') return <DIYIcon />;
  if (id === 'ready') return <CompleteIcon />;
  if (id === 'printed') return <PrintedIcon />;
  return <CustomIcon />;
};

const renderVisualDeliverables = (features) => {
  return null;
};

export const ProjectDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProjectBySlug, getRelatedProjects, isLoading } = useProjects();
  const { addEnquiry, isProcessing } = useEnquiries();
  const { settings } = useSettings();
  const { showToast } = useToast();

  const project = getProjectBySlug(slug);
  const { user, viewMode } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showProgressiveAuth, setShowProgressiveAuth] = useState(false);
  const [authAction, setAuthAction] = useState('save your progress');

  const handleBookmarkClick = () => {
    if (!user) {
      setAuthAction('save this project to your bookmarks');
      setShowProgressiveAuth(true);
    } else {
      setIsBookmarked(!isBookmarked);
      showToast(isBookmarked ? 'Project removed from bookmarks.' : 'Project bookmarked successfully!', 'success');
    }
  };

  const handleDownloadClick = () => {
    if (!user) {
      setAuthAction('download project guides and schematics');
      setShowProgressiveAuth(true);
    } else {
      showToast('Downloading project source files...', 'success');
    }
  };

  const handleContinueAsGuest = () => {
    if (authAction.includes('bookmark')) {
      setIsBookmarked(true);
      showToast('Project bookmarked in guest mode (won\'t persist).', 'success');
    } else {
      showToast('Downloading project source files in guest mode...', 'success');
    }
  };

  const projectKits = useMemo(() => {
    if (!project) return [];
    if (project.variants && Array.isArray(project.variants) && project.variants.length > 0) {
      return project.variants.filter(v => v && typeof v === 'object' && v.enabled);
    }
    const base = project.price || 2499;
    return [
      {
        id: "diy",
        enabled: true,
        name: "DIY Learning Kit",
        price: base,
        description: "Assemble the project yourself.",
        bestFor: "Students who want to build and learn.",
        recommended: "best-value",
        difficulty: "Beginner",
        buildTime: "1-2 Hours",
        ageGroup: "14+",
        features: ["Electronic Components", "PCB & Wiring", "3D Printed Parts", "Step-by-step Guide"]
      },
      {
        id: "ready",
        enabled: true,
        name: "Complete Project Kit",
        price: base + 600,
        description: "Fully assembled and tested project.",
        bestFor: "Students who need a ready-made project.",
        recommended: "most-popular",
        difficulty: "Beginner",
        buildTime: "Instant",
        ageGroup: "12+",
        features: ["Fully Assembled", "Tested & Verified", "Ready to Use", "Support included"]
      },
      {
        id: "printed",
        enabled: true,
        name: "3D Printed Parts Pack",
        price: Math.round(base * 0.35) || 999,
        description: "Only 3D printed mechanical parts.",
        bestFor: "Students who already have electronic components.",
        recommended: "none",
        difficulty: "Beginner",
        buildTime: "Assembly Required",
        ageGroup: "12+",
        features: ["Printed Parts Only", "!Electronics Not Included", "!Assembly Required"]
      }
    ].filter(v => v.enabled);
  }, [project]);

  const maxKitPrice = useMemo(() => {
    if (!projectKits || projectKits.length === 0) return 0;
    return Math.max(...projectKits.map(k => Number(k?.price) || 0));
  }, [projectKits]);

  const completeKitPrice = useMemo(() => {
    if (!projectKits || projectKits.length === 0) return 0;
    const comp = projectKits.find(k => k && k.id === 'ready');
    return comp ? Number(comp.price) || 0 : maxKitPrice;
  }, [projectKits, maxKitPrice]);

  const renderSavingsTag = (kit) => {
    return null;
  };

  // Gallery state - removed (using actual thumbnail image now)

  // Modals state
  const [modalType, setModalType] = useState(null); // 'order', 'expert', 'ai'
  const [aiQuery, setAiQuery] = useState('');
  const [targetOrderProject, setTargetOrderProject] = useState(null);
  const [requestorName, setRequestorName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [orderStep, setOrderStep] = useState('input'); // 'input' | 'confirmed'
  const [selectedVariant, setSelectedVariant] = useState(null);

  const openOrderModal = () => {
    const defaultKit = projectKits.find(k => k.recommended && k.recommended !== 'none') || projectKits[0];
    setSelectedVariant(defaultKit || null);
    setTargetOrderProject(project);
    setRequestorName('');
    setContactNumber('');
    setOrderStep('input');
  };

  const openOrderModalForVariant = (kit) => {
    setSelectedVariant(kit);
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
        <Button className="btn-back" id="btn-back-notfound" onClick={() => navigate(viewMode === 'admin' ? ROUTES.ADMIN_PROJECTS : ROUTES.PROJECTS)} style={{ margin: '20px auto' }}>
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
  const currency = project.currency || 'INR';
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
      style={{ paddingTop: '68px' }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Mobile Sticky Header */}
      <header className="mobile-learning-header">
        <button 
          type="button" 
          onClick={() => navigate(viewMode === 'admin' ? ROUTES.ADMIN_PROJECTS : ROUTES.PROJECTS)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-primary)', 
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span className="material-icons" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <span className="mobile-learning-title" style={{ textTransform: 'uppercase' }}>
          {title}
        </span>
        <div style={{ width: '36px' }}></div>
      </header>

      <div
        className="portal-header"
        style={{
          width: 'auto',
          marginLeft: 'calc(-1 * var(--page-padding))',
          marginRight: 'calc(-1 * var(--page-padding))',
          paddingLeft: 'var(--page-padding)',
          paddingRight: 'var(--page-padding)',
          paddingTop: '12px',
          paddingBottom: '12px',
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
          <Button variant="secondary" className="btn-back" id="btn-back-detail" onClick={() => navigate(viewMode === 'admin' ? ROUTES.ADMIN_PROJECTS : ROUTES.PROJECTS)} style={{ padding: '8px', minWidth: 'auto' }}>
            <span className="material-icons" style={{ fontSize: '20px' }}>arrow_back</span>
          </Button>
          <div className="portal-title-area">
            <h2 id="detail-project-name">{title}</h2>
            <p id="detail-project-subtitle">{description}</p>
          </div>
        </div>
      </div>

      <div className="portal-content id-detail-portal-content" style={{ maxWidth: '100%', width: '100%', paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}>
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
                <span className="material-icons-outlined" style={{ fontSize: '48px', color: 'var(--accent-blue)' }}>image</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No image uploaded</span>
              </div>
            </div>


            {/* Choose Your Kit Section */}
            <div id="choose-kit-section" className="detail-section card-glass" style={{ padding: '24px' }}>
              <h3 style={{ color: 'var(--accent-blue)', marginBottom: '4px' }}>Choose Your Kit</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
                Select the hardware and assembly option that best matches your learning goal.
              </p>

              {/* Cards Container Grid */}
              <div className="kits-cards-grid">
                {projectKits.map((kit) => {
                  const isRecommended = kit.recommended && kit.recommended !== 'none';
                  const highlightLabel = kit.recommended === 'best-value' ? '⭐ Best Value' : kit.recommended === 'most-popular' ? '⭐ Most Popular' : '';

                  return (
                    <div
                      key={kit.id}
                      className="card-glass kit-pricing-card"
                      style={{
                        border: isRecommended ? '2px solid var(--accent-violet)' : '1px solid rgba(255, 255, 255, 0.06)',
                        background: isRecommended ? 'rgba(139, 92, 246, 0.02)' : 'rgba(255, 255, 255, 0.005)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '440px'
                      }}
                    >
                      <div>
                        {/* Header badge */}
                        {isRecommended && (
                          <span 
                            style={{ 
                              position: 'absolute', 
                              top: '-12px', 
                              left: '20px', 
                              fontSize: '10px', 
                              fontWeight: '900', 
                              background: 'var(--accent-violet)', 
                              color: '#fff', 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {highlightLabel}
                          </span>
                        )}

                        {/* Title & Icon */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          {getKitIcon(kit.id)}
                          <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0 }}>
                            {kit.name}
                          </h4>
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                          {kit.description}
                        </p>

                        {/* Price */}
                        <div style={{ margin: '12px 0' }}>
                          <span style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>
                            ₹{(Number(kit.price) || 0).toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>
                            {currency}
                          </span>
                          {renderSavingsTag(kit)}
                        </div>

                        {/* Best For block */}
                        {kit.bestFor && (
                          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '6px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                            <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--accent-blue)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                              Best For
                            </span>
                            <span style={{ fontSize: '11.5px', color: 'var(--text-primary)', lineHeight: '1.3' }}>
                              {kit.bestFor}
                            </span>
                          </div>
                        )}

                        {/* Parameters details */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                          {kit.difficulty && (
                            <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                              Difficulty: {kit.difficulty}
                            </span>
                          )}
                          {kit.buildTime && (
                            <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                              Build: {kit.buildTime}
                            </span>
                          )}
                          {kit.ageGroup && (
                            <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                              Age: {kit.ageGroup}
                            </span>
                          )}
                        </div>

                        {/* Visual Summary */}
                        {renderVisualDeliverables(kit.features)}

                        {/* Included Features list */}
                        <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {Array.isArray(kit.features) && kit.features.map((feat, featIdx) => {
                            const isExcluded = feat.startsWith('!') || feat.startsWith('-');
                            const cleanFeat = isExcluded ? feat.substring(1) : feat;
                            return (
                              <li 
                                key={featIdx} 
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'flex-start', 
                                  gap: '8px', 
                                  fontSize: '12px',
                                  color: isExcluded ? 'var(--text-muted)' : 'var(--text-primary)'
                                }}
                              >
                                <span style={{ color: isExcluded ? 'var(--accent-red)' : 'var(--accent-emerald)', fontWeight: 'bold' }}>
                                  {isExcluded ? '✗' : '✓'}
                                </span>
                                <span style={{ textDecoration: isExcluded ? 'line-through' : 'none' }}>
                                  {cleanFeat}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {/* CTA Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
                        <Button
                          type="button"
                          variant={isRecommended ? 'primary' : 'secondary'}
                          className="width-100 btn-submit-calc"
                          onClick={() => openOrderModalForVariant(kit)}
                          style={{ padding: '8px 16px', fontSize: '12px' }}
                        >
                          Request This Kit
                        </Button>
                      </div>
                    </div>
                  );
                })}
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
            <div className="detail-section card-glass ai-detail-card" style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

              <Button
                type="button"
                variant="primary"
                className="width-100 btn-submit-calc"
                id="btn-detail-order-sticky"
                onClick={() => {
                  document.getElementById('choose-kit-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{ marginTop: 'var(--space-3)' }}
              >
                Choose Your Kit
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
              
              <Button
                type="button"
                variant="secondary"
                className="width-100"
                onClick={handleBookmarkClick}
                style={{ marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: isBookmarked ? '1px solid var(--accent-violet, #8b5cf6)' : undefined }}
              >
                <span>{isBookmarked ? '★ Bookmarked' : '☆ Bookmark Project'}</span>
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="width-100"
                onClick={handleDownloadClick}
                style={{ marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <span>📥 Download Resources</span>
              </Button>
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-chip whatsapp width-100 justify-center"
                style={{ marginTop: 'var(--space-2)' }}
              >
                <svg viewBox="0 0 24 24" style={{ fill: 'currentColor', width: '14px', height: '14px' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA bar for Mobile viewports */}
      <div className="mobile-sticky-cta-bar" id="mobile-sticky-cta-bar">
        <div className="mobile-cta-price-box">
          <span className="mobile-price-lbl">Starting From:</span>
          <span className="mobile-price-val" id="mobile-detail-price">
            ₹{(projectKits.length > 0 ? Math.min(...projectKits.map(k => Number(k?.price) || 0)) : price).toLocaleString('en-IN')}
          </span>
        </div>
        <Button
          type="button"
          variant="primary"
          className="btn-submit-calc"
          id="btn-mobile-detail-order"
          onClick={() => {
            document.getElementById('choose-kit-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Choose Your Kit
        </Button>
      </div>

      {/* Modals Container */}

      {/* 2. Expert Consultation Modal */}
      <Modal isOpen={modalType === 'expert'} onClose={() => setModalType(null)}>
        <div className="modal-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-icons" style={{ fontSize: '32px' }}>check</span>
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
              showToast("Query submitted to AI Assistant!", "success");
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
            <div className="modal-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons" style={{ fontSize: '32px', color: 'var(--accent-purple)' }}>call</span>
            </div>
            <h4>REQUEST PROJECT KIT</h4>
            <p>Enter your details below to confirm your request for <strong>{targetOrderProject?.title} ({selectedVariant?.name})</strong>.</p>

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
              <Button variant="secondary" onClick={() => setTargetOrderProject(null)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="modal-btn btn-submit-calc"
                style={{ flex: 1 }}
                disabled={isProcessing}
                onClick={async () => {
                  if (!requestorName.trim()) {
                     showToast('Please enter your name.', 'error');
                     return;
                  }
                  if (!contactNumber.trim() || contactNumber.replace(/\D/g, '').length < 10) {
                     showToast('Please enter a valid 10-digit contact number.', 'error');
                     return;
                  }
                  try {
                    await addEnquiry({
                      name: requestorName,
                      mobile: contactNumber,
                      projectId: targetOrderProject.id,
                      projectTitle: `${targetOrderProject.title} (${selectedVariant?.name || 'Standard'})`,
                      price: selectedVariant ? selectedVariant.price : targetOrderProject.price,
                      notes: `Selected Kit: ${selectedVariant?.name || 'Standard'}`
                    });
                    setOrderStep('confirmed');
                  } catch (err) {
                    showToast("Failed to submit request: " + (err.message || err), "error");
                  }
                }}
              >
                {isProcessing ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons" style={{ fontSize: '32px' }}>check</span>
            </div>
            <h4>KIT REQUEST CONFIRMED</h4>
            <p>Your request has been received. We'll reach out to <strong style={{ color: 'var(--accent-blue)' }}>{requestorName}</strong> ({contactNumber}) shortly.</p>

            {targetOrderProject && (
              <div className="modal-receipt" id="receipt-meta">
                <div className="receipt-row">
                  <span>PROJECT KIT:</span>
                  <span className="receipt-val">{targetOrderProject.title} ({selectedVariant?.name})</span>
                </div>
                <div className="receipt-row">
                  <span>CONTACT:</span>
                  <span className="receipt-val">{contactNumber}</span>
                </div>
                <div className="receipt-row" style={{ borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '8px' }}>
                  <span>UNIT COST:</span>
                  <span className="receipt-val" style={{ color: 'var(--accent-violet)', fontWeight: 600 }}>₹{selectedVariant ? selectedVariant.price : targetOrderProject.price}</span>
                </div>
              </div>
            )}

            <Button variant="secondary" className="modal-btn" onClick={() => setTargetOrderProject(null)} style={{ marginTop: 'var(--space-3)' }}>
              Close
            </Button>
          </>
        )}
      </Modal>

      <ProgressiveAuthModal 
        isOpen={showProgressiveAuth} 
        onClose={() => setShowProgressiveAuth(false)} 
        onContinueAsGuest={handleContinueAsGuest} 
        actionName={authAction} 
      />
    </motion.section>
  );
};
