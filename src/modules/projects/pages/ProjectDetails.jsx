import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import { RelatedProjects } from '../components/RelatedProjects';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { ROUTES } from '../../../shared/constants/routes';
import { useEnquiries } from '../../enquiries/hooks/useEnquiries';
import { useSettings } from '../../settings/hooks/useSettings';
import { useToast } from '../../../shared/context/ToastContext';
import { useAuth } from '../../auth/context/AuthContext';
import { ProgressiveAuthModal } from '../../auth/components/ProgressiveAuthModal';
import { SEO, PageType, generateSEO } from '../../../shared/seo';
import { eventTracker } from '../../../shared/analytics/index.js';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { sanitizeHtml } from '../../../shared/utils/security.js';


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
  <span className="material-icons-outlined" style={{ fontSize: '20px', color: 'var(--accent-amber, #f59e0b)', flexShrink: 0 }}>extension</span>
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
  const [formErrors, setFormErrors] = useState({});

  const seoProps = generateSEO(PageType.PROJECT, project);

  // Analytics: Track project view
  useEffect(() => {
    if (project) {
      eventTracker.trackProjectView(project);
    }
  }, [project]);

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
  const [contactPrefix, setContactPrefix] = useState('+91');
  const [orderStep, setOrderStep] = useState('input'); // 'input' | 'confirmed'
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [projectStatus, setProjectStatus] = useState('Choosed Flyen Project');
  const [customProjectTitle, setCustomProjectTitle] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [needDocument, setNeedDocument] = useState('No');
  const [needPresentation, setNeedPresentation] = useState('No');
  const [projectRemarks, setProjectRemarks] = useState('');

  const openOrderModal = () => {
    eventTracker.trackFilterApplied('view_pricing', 'general_order_modal');
    const defaultKit = projectKits.find(k => k.recommended && k.recommended !== 'none') || projectKits[0];
    setSelectedVariant(defaultKit || null);
    setTargetOrderProject(project);
    setRequestorName('');
    setContactNumber('');
    setContactPrefix('+91');
    setFormErrors({});
    setProjectStatus('Choosed Flyen Project');
    setCustomProjectTitle(project ? project.title : '');
    setProjectBudget(defaultKit ? String(defaultKit.price) : (project ? String(project.price) : ''));
    setSubmissionDate('');
    setNeedDocument('No');
    setNeedPresentation('No');
    setProjectRemarks('');
    setOrderStep('input');
  };

  const openOrderModalForVariant = (kit) => {
    eventTracker.trackFilterApplied('view_pricing', kit?.name || 'variant');
    setSelectedVariant(kit);
    setTargetOrderProject(project);
    setRequestorName('');
    setContactNumber('');
    setContactPrefix('+91');
    setFormErrors({});
    setProjectStatus('Choosed Flyen Project');
    setCustomProjectTitle(project ? project.title : '');
    setProjectBudget(kit ? String(kit.price) : (project ? String(project.price) : ''));
    setSubmissionDate('');
    setNeedDocument('No');
    setNeedPresentation('No');
    setProjectRemarks('');
    setOrderStep('input');
  };

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="portal-content" style={{ maxWidth: '100%', width: '100%', paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)', paddingTop: '120px' }}>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ flex: '1.2', minWidth: '300px' }}>
            <Skeleton style={{ height: '320px', borderRadius: '12px', marginBottom: '24px' }} />
            <Skeleton variant="text" className="title" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" style={{ width: '80%' }} />
          </div>
          <div style={{ flex: '0.8', minWidth: '250px' }}>
            <Skeleton style={{ height: '200px', borderRadius: '12px', marginBottom: '24px' }} />
            <Skeleton style={{ height: '240px', borderRadius: '12px' }} />
          </div>
        </div>
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

  return (
    <>
      <SEO {...seoProps} page={PageType.PROJECT} data={project} />
      <motion.section
        className="portal-section"
        id="detail-portal"
        style={{ paddingTop: '73px' }}
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
          paddingTop: '16px',
          paddingBottom: '16px',
          position: 'sticky',
          top: '73px',
          zIndex: 90,
          background: 'var(--sys-page-header-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--sys-divider)',
          marginBottom: 'var(--space-6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button variant="secondary" className="btn-back" id="btn-back-detail" onClick={() => navigate(viewMode === 'admin' ? ROUTES.ADMIN_PROJECTS : ROUTES.PROJECTS)} style={{ padding: '8px', minWidth: 'auto' }}>
            <span className="material-icons" style={{ fontSize: '20px' }}>arrow_back</span>
          </Button>
          <div className="portal-title-area">
            <h2 id="detail-project-name">Project Details</h2>
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
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    height: 'auto',
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
                  aspectRatio: '16/9',
                  height: 'auto',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '12px',
                  borderRadius: '12px'
                }}
              >
                <span className="material-icons-outlined" style={{ fontSize: '48px', color: 'var(--accent-blue)' }}>image</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No image uploaded</span>
              </div>
            </div>


            {/* Choose Your Kit Section */}
            <div id="choose-kit-section" className="detail-section card-glass" style={{ padding: '24px' }}>

              {/* Cards Container Grid */}
              <div className="kits-cards-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                {projectKits.map((kit) => {
                  return (
                    <div
                      key={kit.id}
                      className="card-glass kit-pricing-card"
                      style={{
                        border: '1px solid var(--sys-border)',
                        background: 'var(--sys-surface)',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '24px',
                        width: '100%',
                        boxSizing: 'border-box',
                        flexWrap: 'wrap'
                      }}
                    >
                      {/* Left Part: Title, Description, Price, Features */}
                      <div style={{ flex: '1', minWidth: '280px' }}>
                        {/* Title */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--txt-primary)', margin: 0 }}>
                            {kit.name}
                          </h4>
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: '13px', color: 'var(--txt-secondary)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                          {kit.description}
                        </p>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'baseline', margin: '12px 0' }}>
                          <span style={{ fontSize: '26px', fontWeight: '900', color: 'var(--txt-primary)' }}>
                            ₹{(Number(kit.price) || 0).toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--txt-muted)', marginLeft: '4px' }}>
                            {currency}
                          </span>
                        </div>

                        {/* Included Features list */}
                        <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0 0', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px 24px' }}>
                          {Array.isArray(kit.features) && kit.features.map((feat, featIdx) => {
                            const isExcluded = feat.startsWith('!') || feat.startsWith('-');
                            const cleanFeat = isExcluded ? feat.substring(1) : feat;
                            return (
                              <li 
                                key={featIdx} 
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '6px', 
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

                      {/* Right Part: Buy Now Button */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: '150px' }}>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => openOrderModalForVariant(kit)}
                          style={{ padding: '10px 24px', fontSize: '13px', fontWeight: '700', borderRadius: '8px' }}
                        >
                          Buy Now
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
                <h3 style={{ color: 'var(--accent-blue)', marginBottom: 'var(--space-3)' }}>Project Overview</h3>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(fullDescription) }} />
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
            {resources.length > 0 && (
              <div className="card-glass" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                <div className="resources-download-list">
                  {resources.map((r, idx) => {
                    if (!r) return null;
                    const size = r.size || 'Link';
                    const type = r.type || 'url';
                    const name = r.name || 'Resource File';
                    return (
                      <div key={idx} className="resource-row-node">
                        {r.url ? (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={name}
                            onClick={() => eventTracker.trackDownload(name, type)}
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
                            <span className="resource-badge available" style={{ cursor: 'pointer' }}>DOWNLOAD</span>
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
                            <span className="resource-badge locked">COMING SOON</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Technical Diagrams & Schematic Files */}
            {(project.images?.schematic || project.images?.circuit) && (
              <div className="detail-section card-glass">
                <h3 style={{ color: 'var(--accent-blue)', marginBottom: 'var(--space-4)' }}>Technical Diagrams & Files</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {project.images?.schematic && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--interaction-hover)', borderRadius: '6px', border: '1px solid var(--sys-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>📐</span>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--txt-primary)' }}>Schematic Diagram</div>
                          <div style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>Vector schematic drawing file</div>
                        </div>
                      </div>
                      <a 
                        href={project.images.schematic} 
                        download={`Schematic_${project.slug}.svg`} 
                        onClick={() => eventTracker.trackDownload(`Schematic_${project.slug}.svg`, 'svg')}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--interaction-hover)', borderRadius: '6px', border: '1px solid var(--sys-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>🔌</span>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--txt-primary)' }}>Circuit Diagram</div>
                          <div style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>Wiring and connections drawing file</div>
                        </div>
                      </div>
                      <a 
                        href={project.images.circuit} 
                        download={`Circuit_${project.slug}.svg`} 
                        onClick={() => eventTracker.trackDownload(`Circuit_${project.slug}.svg`, 'svg')}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', background: 'var(--interaction-hover)', borderRadius: '8px', border: '1px solid var(--sys-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🎥</span>
                    <div>
                      <div 
                        title={`${title} Video Tutorial Guide`}
                        style={{ fontSize: '14px', fontWeight: '600', color: 'var(--txt-primary)' }}
                      >
                        {(() => {
                          const vTitle = `${title} Video Tutorial Guide`;
                          return vTitle.length > 35 ? vTitle.substring(0, 32) + '...' : vTitle;
                        })()}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>Step-by-step build and debugging guide</div>
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

              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary width-100"
                style={{ marginTop: '8px', gap: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span className="material-icons-outlined" style={{ fontSize: '16px' }}>chat</span>
                Contact Us
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
      <Modal isOpen={targetOrderProject !== null} onClose={() => setTargetOrderProject(null)} className="modal-content purple" style={{ maxWidth: '600px', width: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        {orderStep === 'input' ? (
          <>
            {/* Fixed Header with Glass/Milk Background */}
            <div style={{
              padding: '24px 24px 16px 24px',
              background: 'var(--sys-surface-elevated)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid var(--sys-divider)',
              zIndex: 10,
              flexShrink: 0
            }}>
              <h4 style={{ textAlign: 'left', margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--txt-primary)' }}>PROJECT ENQUIRY</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--txt-muted)', textAlign: 'left', margin: '4px 0 0 0' }}>
                Fill in your details below. Our engineering expert will coordinate with you.
              </p>
            </div>

            {/* Scrollable Middle Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', textAlign: 'left', width: '100%' }}>
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
                      onChange={(e) => {
                        setContactPrefix(e.target.value);
                        const isValid = e.target.value === '+91' ? contactNumber.length === 10 : (contactNumber.length >= 7 && contactNumber.length <= 15);
                        setFormErrors(prev => ({ ...prev, contactNumber: !isValid }));
                      }}
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
                      <option value="+1" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+1</option>
                      <option value="+91" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+91</option>
                      <option value="+44" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+44</option>
                      <option value="+61" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+61</option>
                      <option value="+81" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+81</option>
                      <option value="+33" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+33</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={contactNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setContactNumber(val);
                        const isValid = contactPrefix === '+91' ? val.length === 10 : (val.length >= 7 && val.length <= 15);
                        setFormErrors(prev => ({ ...prev, contactNumber: !isValid }));
                      }}
                      style={{
                        flex: 1,
                        height: '100%',
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none',
                        padding: '0 14px',
                        color: 'var(--txt-primary)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                      maxLength={15}
                    />
                  </div>
                  {formErrors.contactNumber && (
                    <span style={{ color: 'var(--status-error)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                      Please enter a valid number
                    </span>
                  )}
                </div>

                <div style={{ display: 'none' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Your Project Status</label>
                  <select
                    value={projectStatus}
                    onChange={(e) => {
                      setProjectStatus(e.target.value);
                      if (e.target.value !== 'Choosed Flyen Project') {
                        setTargetOrderProject(null);
                      }
                    }}
                    className="form-select"
                    style={{ height: '38px', background: 'var(--input-bg)', color: 'var(--txt-primary)', border: '1px solid var(--input-border)', borderRadius: '6px', width: '100%' }}
                  >
                    <option value="Not Started yet" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Not Started yet</option>
                    <option value="Have Project idea" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Have Project idea</option>
                    <option value="Need Only Support" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Need Only Support</option>
                    <option value="Choosed Flyen Project" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Choosed Flyen Project</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Project Title</label>
                  <Input
                    type="text"
                    placeholder="e.g. Smart Irrigation System"
                    value={projectStatus === 'Choosed Flyen Project' ? (`${targetOrderProject?.title || ''}${selectedVariant ? ` (${selectedVariant.name})` : ''}` || customProjectTitle) : customProjectTitle}
                    onChange={(e) => setCustomProjectTitle(e.target.value)}
                    disabled={projectStatus === 'Choosed Flyen Project' && !!targetOrderProject}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Budget (₹)</label>
                  <Input
                    type="text"
                    placeholder="e.g. 5000"
                    value={projectBudget}
                    onChange={(e) => setProjectBudget(e.target.value.replace(/\D/g, ''))}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Submission Date</label>
                  <Input
                    type="date"
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                    onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                    className="form-input"
                    style={{ colorScheme: 'dark', height: '38px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Need Document?</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setNeedDocument('Yes')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needDocument === 'Yes' ? 'var(--brand-primary)' : 'var(--interaction-hover)',
                        border: needDocument === 'Yes' ? '1px solid var(--brand-primary)' : '1px solid var(--sys-border)',
                        color: needDocument === 'Yes' ? 'var(--txt-primary)' : 'var(--txt-secondary)'
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setNeedDocument('No')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needDocument === 'No' ? 'rgba(239, 68, 68, 0.15)' : 'var(--interaction-hover)',
                        border: needDocument === 'No' ? '1px solid var(--status-error)' : '1px solid var(--sys-border)',
                        color: needDocument === 'No' ? 'var(--status-error)' : 'var(--txt-secondary)'
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Need Presentation Support?</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setNeedPresentation('Yes')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needPresentation === 'Yes' ? 'var(--brand-primary)' : 'var(--interaction-hover)',
                        border: needPresentation === 'Yes' ? '1px solid var(--brand-primary)' : '1px solid var(--sys-border)',
                        color: needPresentation === 'Yes' ? 'var(--txt-primary)' : 'var(--txt-secondary)'
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setNeedPresentation('No')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needPresentation === 'No' ? 'rgba(239, 68, 68, 0.15)' : 'var(--interaction-hover)',
                        border: needPresentation === 'No' ? '1px solid var(--status-error)' : '1px solid var(--sys-border)',
                        color: needPresentation === 'No' ? 'var(--status-error)' : 'var(--txt-secondary)'
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', marginTop: '4px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Describe your project or any remark (optional)</label>
                <textarea
                  value={projectRemarks}
                  onChange={(e) => setProjectRemarks(e.target.value)}
                  placeholder="Specify any custom requirements, hardware needs, or comments..."
                  className="form-textarea"
                  style={{ width: '100%', minHeight: '80px', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '6px', color: 'var(--txt-primary)', padding: '10px', fontSize: '12.5px' }}
                />
              </div>
            </div>

            {/* Fixed Footer with Glass/Milk Background */}
            <div style={{
              padding: '16px 24px 20px 24px',
              background: 'var(--sys-surface-elevated)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderTop: '1px solid var(--sys-divider)',
              display: 'flex',
              gap: '12px',
              width: '100%',
              boxSizing: 'border-box',
              flexShrink: 0
            }}>
              <Button variant="secondary" onClick={() => setTargetOrderProject(null)} disabled={isProcessing} style={{ flex: 1, height: '42px' }}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="modal-btn btn-submit-calc"
                style={{ flex: 1, height: '42px' }}
                disabled={isProcessing}
                onClick={async () => {
                  const newErrors = {};
                  if (!requestorName.trim()) newErrors.requestorName = true;
                  
                  const isPhoneValid = contactPrefix === '+91' 
                    ? contactNumber.length === 10 
                    : (contactNumber.length >= 7 && contactNumber.length <= 15);
                    
                  if (!isPhoneValid) newErrors.contactNumber = true;

                  if (Object.keys(newErrors).length > 0) {
                    setFormErrors(newErrors);
                    showToast('Please fill in all mandatory fields correctly.', 'error');
                    return;
                  }

                  setFormErrors({});
                  
                  const titleToUse = projectStatus === 'Choosed Flyen Project' 
                    ? `${targetOrderProject?.title || ''}${selectedVariant ? ` (${selectedVariant.name})` : ''}` 
                    : customProjectTitle;
                  
                  // Serialize all details cleanly into notes
                  const serializedNotes = [
                    `Project Status: ${projectStatus}`,
                    `Budget: ${projectBudget ? `₹${projectBudget}` : 'Not specified'}`,
                    `Submission Date: ${submissionDate || 'Not specified'}`,
                    `Need Document: ${needDocument}`,
                    `Need Presentation Support: ${needPresentation}`,
                    projectRemarks.trim() ? `Remarks: ${projectRemarks}` : ''
                  ].filter(Boolean).join('\n');

                  try {
                    await addEnquiry({
                      name: requestorName,
                      mobile: `${contactPrefix}${contactNumber}`,
                      projectId: targetOrderProject?.id || '',
                      projectTitle: titleToUse || 'Custom Project Enquiry',
                      price: projectBudget || (selectedVariant ? selectedVariant.price : targetOrderProject?.price) || '',
                      notes: serializedNotes,
                      userId: user?.id || null
                    });
                    setOrderStep('confirmed');
                  } catch (err) {
                    showToast("Failed to submit request: " + (err.message || err), "error");
                  }
                }}
              >
                {isProcessing ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </>
        ) : (
          <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="modal-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <span className="material-icons" style={{ fontSize: '32px' }}>check</span>
            </div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800' }}>KIT REQUEST CONFIRMED</h4>
            <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: 'var(--txt-muted)' }}>
              Your request has been received. We'll reach out to <strong style={{ color: 'var(--brand-accent)' }}>{requestorName}</strong> ({contactNumber}) shortly.
            </p>

            {targetOrderProject && (
              <div className="modal-receipt" id="receipt-meta" style={{ width: '100%', background: 'var(--interaction-hover)', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>
                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--txt-muted)' }}>PROJECT KIT:</span>
                  <span className="receipt-val" style={{ color: 'var(--txt-primary)', fontWeight: 'bold' }}>{targetOrderProject.title} {selectedVariant ? `(${selectedVariant.name})` : ''}</span>
                </div>
                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--txt-muted)' }}>CONTACT:</span>
                  <span className="receipt-val" style={{ color: 'var(--txt-primary)', fontWeight: 'bold' }}>{contactNumber}</span>
                </div>
                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--sys-divider)', paddingTop: '8px', marginTop: '8px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--txt-muted)' }}>UNIT COST:</span>
                  <span className="receipt-val" style={{ color: 'var(--brand-primary)', fontWeight: 'bold' }}>₹{projectBudget || (selectedVariant ? selectedVariant.price : targetOrderProject.price)}</span>
                </div>
              </div>
            )}

            <Button variant="secondary" className="modal-btn" onClick={() => setTargetOrderProject(null)} style={{ width: '100%', maxWidth: '200px' }}>
              Close
            </Button>
          </div>
        )}
      </Modal>

    </motion.section>
      <ProgressiveAuthModal 
        isOpen={showProgressiveAuth} 
        onClose={() => setShowProgressiveAuth(false)} 
        onContinueAsGuest={handleContinueAsGuest} 
        actionName={authAction} 
      />
    </>
  );
};
