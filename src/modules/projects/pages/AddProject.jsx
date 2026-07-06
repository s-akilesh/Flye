import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import { useToast } from '../../../shared/context/ToastContext';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { RichTextEditor } from '../../../shared/components/ui/RichTextEditor';
import { ROUTES } from '../../../shared/constants/routes';
import { CATEGORY_LABELS } from '../constants/categories';
import { storageService } from '../../../shared/services/storageService';

export const AddProject = () => {
  const navigate = useNavigate();
  const { allProjects, addProject } = useProjects();
  const { showToast } = useToast();

  // Basic Info State
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');

  // Classification State
  const [categories, setCategories] = useState(['automation']);
  const [technology, setTechnology] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pricing & Status State
  const [variants, setVariants] = useState([
    {
      id: "diy",
      enabled: true,
      name: "DIY Learning Kit",
      price: 2499,
      description: "Assemble the project yourself.",
      recommended: "best-value",
      features: ["Electronic Components", "PCB & Wiring", "3D Printed Parts", "Step-by-step Guide"]
    },
    {
      id: "ready",
      enabled: true,
      name: "Complete Project Kit",
      price: 3099,
      description: "Fully assembled and tested project.",
      recommended: "most-popular",
      features: ["Fully Assembled", "Tested & Verified", "Ready to Use", "Support included"]
    },
    {
      id: "printed",
      enabled: true,
      name: "3D Printed Parts Pack",
      price: 999,
      description: "Only 3D printed mechanical parts.",
      recommended: "none",
      features: ["Printed Parts Only", "!Electronics Not Included", "!Assembly Required"]
    }
  ]);
  const [currency, setCurrency] = useState('INR');
  const [status, setStatus] = useState('active');
  const [featured, setFeatured] = useState(false);
  const [badge, setBadge] = useState('');
  
  const updateKitField = (idx, field, value) => {
    setVariants(prev => {
      const copy = [...prev];
      if (field === 'recommended' && value !== 'none') {
        // Clear recommendation on all other kits
        copy.forEach((k, i) => {
          k.recommended = (i === idx) ? value : 'none';
        });
      } else {
        copy[idx] = { ...copy[idx], [field]: value };
      }
      return copy;
    });
  };

  const handleAddCustomKit = () => {
    const newId = 'kit-' + Math.random().toString(36).substring(2, 7);
    setVariants(prev => [
      ...prev,
      {
        id: newId,
        enabled: true,
        name: "Custom Kit",
        price: 0,
        description: "",
        recommended: "none",
        features: []
      }
    ]);
  };

  const handleDeleteKit = (idx) => {
    setVariants(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddFeature = (kitIdx, value) => {
    if (!value.trim()) return;
    setVariants(prev => {
      const copy = [...prev];
      const currentFeatures = copy[kitIdx].features || [];
      copy[kitIdx] = {
        ...copy[kitIdx],
        features: [...currentFeatures, value.trim()]
      };
      return copy;
    });
  };

  const handleRemoveFeature = (kitIdx, featIdx) => {
    setVariants(prev => {
      const copy = [...prev];
      const currentFeatures = copy[kitIdx].features || [];
      copy[kitIdx] = {
        ...copy[kitIdx],
        features: currentFeatures.filter((_, i) => i !== featIdx)
      };
      return copy;
    });
  };

  // Media State
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const handleThumbnailUpload = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image is too large! Maximum allowed size is 5MB.', 'error');
      return;
    }
    setThumbnailFile(file);
    // Convert to Base64 so it persists across page reloads in localStorage
    const reader = new FileReader();
    reader.onload = (e) => setThumbnailPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Dynamic Resources State (array of { name, type, size, status })
  const [resourcesList, setResourcesList] = useState([
    { name: '', type: 'pdf', size: '', status: 'available' }
  ]);

  // Search Keywords State (comma-separated string)
  const [keywords, setKeywords] = useState('');

  // Section scroll state
  const [activeSection, setActiveSection] = useState('sec-basic');

  // Auto-generate Slug helper (client-side preview only, ProjectRepository enforces uniqueness)
  useEffect(() => {
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generated);
  }, [title]);

  // Observer for active scroll section highlighting
  useEffect(() => {
    const sections = [
      'sec-basic',
      'sec-pricing',
      'sec-resources',
      'sec-keywords'
    ];

    const observerOptions = {
      root: document.querySelector('.portal-form-scrollable'),
      rootMargin: '-10px 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Auto-scroll horizontal active tab stepper on mobile
  useEffect(() => {
    const activeTab = document.querySelector('.portal-form-navigation .nav-sec-btn.active');
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeSection]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dynamic Resource List handlers
  const handleAddResource = () => {
    setResourcesList([...resourcesList, { name: '', type: 'pdf', size: '', status: 'available', url: '', source: 'upload' }]);
  };

  const handleRemoveResource = (index) => {
    const nextList = resourcesList.filter((_, idx) => idx !== index);
    setResourcesList(nextList.length === 0 ? [{ name: '', type: 'pdf', size: '', status: 'available', url: '', source: 'upload' }] : nextList);
  };

  const handleResourceChange = (index, field, value) => {
    const nextList = [...resourcesList];
    nextList[index] = { ...nextList[index], [field]: value };
    setResourcesList(nextList);
  };

  const handleResourceSourceChange = (index, source) => {
    const nextList = [...resourcesList];
    nextList[index] = {
      ...nextList[index],
      source,
      url: '',
      size: source === 'url' ? 'Link' : '',
      type: source === 'url' ? 'url' : 'pdf'
    };
    setResourcesList(nextList);
  };

  const handleFileChange = (index, file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("File is too large! Maximum allowed size is 5MB.", "error");
      return;
    }

    let sizeStr = '';
    if (file.size < 1024 * 1024) {
      sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
    } else {
      sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    const nameParts = file.name.split('.');
    const ext = nameParts.length > 1 ? nameParts.pop().toLowerCase() : 'bin';

    const nextList = [...resourcesList];
    nextList[index] = {
      ...nextList[index],
      name: file.name,
      size: sizeStr,
      type: ext,
      url: URL.createObjectURL(file)
    };
    setResourcesList(nextList);
  };

  const handleLinkChange = (index, urlValue) => {
    let ext = 'link';
    const parts = urlValue.split('.');
    if (parts.length > 1) {
      ext = parts.pop().toLowerCase().split('?')[0].split('#')[0];
      if (ext.length > 4) ext = 'link';
    }

    const nextList = [...resourcesList];
    const currentRes = nextList[index];
    
    let newName = currentRes.name;
    if (!newName && urlValue.trim() !== '') {
      try {
        const urlObj = new URL(urlValue);
        const pathname = urlObj.pathname;
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length > 0) {
          newName = segments[segments.length - 1];
        }
      } catch (e) {
        const segments = urlValue.split('/').filter(Boolean);
        if (segments.length > 0) {
          newName = segments[segments.length - 1];
        }
      }
    }

    nextList[index] = {
      ...currentRes,
      url: urlValue,
      name: newName,
      type: ext,
      size: 'Link'
    };
    setResourcesList(nextList);
  };

  // Parameterized Save Project flow
  const handleSaveProject = async (targetStatus) => {
    if (!title.trim() || !description.trim()) {
      showToast("Please fill in the required fields (Title, Short Description).", "error");
      return;
    }

    let finalThumbnailUrl = thumbnailPreview || 'src/assets/projects/smart-home/main.svg';
    if (thumbnailFile) {
      try {
        const uploadResult = await storageService.uploadImage('project-images', 'catalog', thumbnailFile);
        finalThumbnailUrl = uploadResult.publicUrl;
      } catch (err) {
        showToast('Failed to upload project image: ' + (err.message || err), 'error');
        setIsSaving(false);
        return;
      }
    }

    // Clean Dynamic Resources
    const finalResources = resourcesList
       .map((r) => ({
        name: r.name.trim(),
        type: r.type,
        size: r.size.trim() || 'Link',
        status: r.status,
        url: r.url || '',
        source: r.source || 'upload'
      }))
      .filter((r) => r.name !== '');

    // Clean Keywords
    const finalKeywords = keywords
      .split(',')
      .map((kw) => kw.trim().toLowerCase())
      .filter((kw) => kw !== '');

    const finalKits = variants.map(v => {
      const { difficulty, buildTime, ageGroup, bestFor, ...rest } = v;
      return {
        ...rest,
        price: Number(v.price) || 0
      };
    });

    const enabledKits = finalKits.filter(v => v.enabled);
    const lowestPrice = enabledKits.length > 0
      ? Math.min(...enabledKits.map(v => v.price))
      : 0;

    // Map fields to the repository model schema
    const projectPayload = {
      title: title.trim(),
      description: description.trim(),
      fullDescription: fullDescription.trim(),
      price: lowestPrice,
      currency,
      projectLevel: 'Engineering',
      difficulty: 'intermediate',
      technology: technology.trim() || 'Arduino',
      category: categories.join(', '),
      buildTime: '4-6 Hours',
      features: ['hardware', 'code', 'circuit', 'docs', 'support'],
      badge: badge.trim(),
      searchKeywords: finalKeywords,
      variants: finalKits,
      images: {
        main: finalThumbnailUrl,
        schematic: '',
        circuit: ''
      },
      videoUrl: '',
      resources: finalResources,
      components: [],
      specifications: {
        controller: technology.trim() || 'Arduino Uno',
        sensors: 'Standard sensor configuration',
        communication: categories.includes('iot') ? 'Wi-Fi' : categories.includes('gps-gsm') ? 'GSM' : 'None',
        operatingVoltage: '5V DC',
        programmingLanguage: 'C++'
      },
      relatedProjects: [],
      stockStatus: 'in-stock',
      featured,
      status: targetStatus,
      howItWorks: 'This system reads sensor/input coordinates and communicates commands to actuator outputs.',
      applications: [
        'Educational physical setups for lab research',
        'Custom prototyping designs for innovator kits',
        'Academic engineering project implementations'
      ],
      benefits: [
        'Ready-to-assemble structured components',
        'Validated wiring diagrams and code bases',
        '24/7 technical query troubleshooting support'
      ],
      estimatedDelivery: '3-5 Business Days',
      whatsappNumber: '919876543210'
    };

    try {
      await addProject(projectPayload);
      navigate(ROUTES.ADMIN_PROJECTS, {
        state: {
          toastMessage: `✅ Project kit successfully saved as ${targetStatus}!`,
          toastType: 'success'
        }
      });
    } catch (err) {
      showToast("Error creating project kit: " + (err.message || err), "error");
      setIsSaving(false);
    }
  };

  return (
    <motion.section
      className="portal-section portal-layout-fixed-height page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
    >
      {/* Mobile Sticky Sub-Header */}
      <header className="mobile-learning-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            type="button" 
            onClick={() => navigate(ROUTES.ADMIN_PROJECTS)} 
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: '4px',
              margin: 0
            }}
          >
            <span className="material-icons" style={{ fontSize: '20px' }}>arrow_back</span>
          </button>
          <span className="mobile-learning-title" style={{ fontSize: '14px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
            Create Kit
          </span>
        </div>
        
        {/* Mobile Save Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button 
            variant="primary" 
            onClick={() => handleSaveProject('active')} 
            disabled={isSaving}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isSaving ? '...' : 'Save'}
          </Button>
        </div>
      </header>

      {/* Header with Relocated Actions */}
      <div className="portal-header desktop-only-header" style={{ maxWidth: '100%', width: '100%', paddingLeft: '0px', paddingRight: '0px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button variant="secondary" className="btn-back" onClick={() => navigate(ROUTES.ADMIN_PROJECTS)} style={{ padding: '8px', minWidth: 'auto' }}>
            <span className="material-icons" style={{ fontSize: '20px' }}>arrow_back</span>
          </Button>
          <div className="portal-title-area">
            <h2>Create New Engineering Kit</h2>
            <p>Scaffold a project module and publish it to the catalog</p>
          </div>
        </div>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button variant="ghost" onClick={() => navigate(ROUTES.ADMIN_PROJECTS)} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => handleSaveProject('draft')} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button variant="primary" onClick={() => handleSaveProject('active')} className="btn-submit-calc" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </div>

      <div className="portal-content-flex" style={{ maxWidth: '100%', width: '100%', paddingLeft: '0px', paddingRight: '0px' }}>
        {/* Left Sticky Section Navigation */}
        <div className="portal-form-navigation">
          <button
            type="button"
            className={`nav-sec-btn ${activeSection === 'sec-basic' ? 'active' : ''}`}
            onClick={() => scrollToSection('sec-basic')}
          >
            <span className="material-icons-outlined" style={{ fontSize: '18px' }}>assignment</span>
            Basic Information
          </button>

          <button
            type="button"
            className={`nav-sec-btn ${activeSection === 'sec-pricing' ? 'active' : ''}`}
            onClick={() => scrollToSection('sec-pricing')}
          >
            <span className="material-icons-outlined" style={{ fontSize: '18px' }}>sell</span>
            Pricing & Status
          </button>
          <button
            type="button"
            className={`nav-sec-btn ${activeSection === 'sec-resources' ? 'active' : ''}`}
            onClick={() => scrollToSection('sec-resources')}
          >
            <span className="material-icons-outlined" style={{ fontSize: '18px' }}>file_download</span>
            Resources
          </button>
          <button
            type="button"
            className={`nav-sec-btn ${activeSection === 'sec-keywords' ? 'active' : ''}`}
            onClick={() => scrollToSection('sec-keywords')}
          >
            <span className="material-icons-outlined" style={{ fontSize: '18px' }}>search</span>
            Search Keywords
          </button>
        </div>

        {/* Center Scrollable Form Area */}
        <form className="terminal-form portal-form-scrollable" onSubmit={(e) => e.preventDefault()}>
          
          {/* Section 1: Basic Information */}
          <div id="sec-basic" className="card-glass" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--accent-blue)' }}>Basic Information</h3>

            {/* Thumbnail Image Upload */}
            <div className="calc-row" style={{ marginBottom: 'var(--space-4)' }}>
              <label>Project Thumbnail Image</label>
              <div
                onClick={() => document.getElementById('thumb-upload-input').click()}
                style={{
                  border: thumbnailPreview ? '2px solid var(--accent-blue)' : '2px dashed rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  padding: thumbnailPreview ? '0' : '24px 16px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: thumbnailPreview ? 'transparent' : 'rgba(255,255,255,0.02)',
                  overflow: 'hidden',
                  minHeight: thumbnailPreview ? '160px' : 'auto',
                  position: 'relative',
                  transition: 'border-color 0.2s'
                }}
              >
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block', borderRadius: '6px' }}
                  />
                ) : (
                  <>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>🖼️</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Click to upload project thumbnail</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Any image format · Max 5MB · Used as card thumbnail</div>
                  </>
                )}
                {thumbnailPreview && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); document.getElementById('thumb-upload-input').click(); }}
                      style={{ background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setThumbnailFile(null); setThumbnailPreview(''); }}
                      style={{ background: 'rgba(239,68,68,0.7)', border: 'none', color: '#fff', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <input
                id="thumb-upload-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleThumbnailUpload(e.target.files[0])}
              />
            </div>

            <div className="calc-row" style={{ marginBottom: 'var(--space-3)' }}>
              <label htmlFor="proj-title">Project Title *</label>
              <Input
                type="text"
                id="proj-title"
                className="form-input"
                required
                placeholder="e.g. Smart Irrigation System"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid-12" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <div style={{ gridColumn: 'span 6' }} className="calc-row">
                <label>Categories *</label>
                <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="form-input"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      cursor: 'pointer',
                      width: '100%',
                      height: '38px',
                      paddingTop: 0,
                      paddingBottom: 0
                    }}
                  >
                    <span style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '90%',
                      color: categories.length > 0 ? '#fff' : 'var(--text-muted)',
                      fontSize: '13px'
                    }}>
                      {categories.length > 0 
                        ? categories.map(c => CATEGORY_LABELS[c] || c).join(', ') 
                        : 'Select Categories'}
                    </span>
                    <span style={{
                      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      display: 'inline-block',
                      fontSize: '10px',
                      color: 'var(--text-muted)'
                    }}>
                      ▼
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div
                      className="card-glass"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        maxHeight: '240px',
                        overflowY: 'auto',
                        padding: '8px 0',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        background: '#141416',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                        const isSelected = categories.includes(key);
                        return (
                          <label
                            key={key}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 12px',
                              cursor: 'pointer',
                              transition: 'background 0.15s',
                              userSelect: 'none',
                              margin: 0
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              style={{
                                width: '15px',
                                height: '15px',
                                accentColor: 'var(--accent-violet)',
                                cursor: 'pointer',
                                margin: 0
                              }}
                              onChange={() => {
                                setCategories(prev => {
                                  if (prev.includes(key)) {
                                    if (prev.length === 1) return prev;
                                    return prev.filter(c => c !== key);
                                  } else {
                                    return [...prev, key];
                                  }
                                });
                              }}
                            />
                            <span style={{ fontSize: '13px', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                              {label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ gridColumn: 'span 6' }} className="calc-row">
                <label htmlFor="proj-tech">Primary Microcontroller / Chipset</label>
                <Input
                  type="text"
                  id="proj-tech"
                  className="form-input"
                  placeholder="e.g. Arduino Uno R3, ESP32"
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                />
              </div>
            </div>

            <div className="calc-row" style={{ marginBottom: 'var(--space-3)' }}>
              <label>URL Slug (Auto Generated)</label>
              <Input
                type="text"
                className="form-input"
                readOnly
                style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}
                value={slug}
              />
            </div>

            <div className="calc-row" style={{ marginBottom: 'var(--space-3)' }}>
              <label htmlFor="proj-desc">Short Description (Card Summary) *</label>
              <textarea
                id="proj-desc"
                className="form-textarea"
                required
                placeholder="A brief overview of the project shown on the marketplace cards..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="calc-row">
              <label>Full Description (Detailed Blueprint)</label>
              <RichTextEditor
                value={fullDescription}
                onChange={setFullDescription}
                placeholder="Operational details, wiring schematics instruction, components requirements, working principles..."
              />
            </div>
          </div>

          {/* Section 3: Pricing & Status */}
          <div id="sec-pricing" className="card-glass" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--accent-blue)' }}>Pricing & Status</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>Available Kits Configuration</span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                  onClick={handleAddCustomKit}
                >
                  Add Custom Kit
                </button>
              </div>

              {variants.map((kit, kitIdx) => {
                return (
                  <div 
                    key={kit.id} 
                    className="card-glass" 
                    style={{ 
                      padding: '16px', 
                      border: '1px solid rgba(255, 255, 255, 0.05)', 
                      background: kit.enabled ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.002)',
                      opacity: kit.enabled ? 1 : 0.6,
                      borderRadius: '8px'
                    }}
                  >
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                          type="checkbox" 
                          checked={kit.enabled} 
                          onChange={(e) => updateKitField(kitIdx, 'enabled', e.target.checked)} 
                        />
                        <input 
                          type="text" 
                          value={kit.name} 
                          placeholder="Kit Name"
                          className="form-input" 
                          style={{ fontWeight: '800', fontSize: '13px', padding: '4px 8px', width: '200px' }}
                          onChange={(e) => updateKitField(kitIdx, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          className="btn"
                          style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', fontSize: '11px', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                          onClick={() => handleDeleteKit(kitIdx)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Editor Fields Grid */}
                    {kit.enabled && (
                      <div className="grid-12" style={{ gap: '12px' }}>
                        {/* Price */}
                        <div style={{ gridColumn: 'span 12' }} className="calc-row">
                          <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Price (₹) *</label>
                          <input 
                            type="number" 
                            value={kit.price} 
                            className="form-input" 
                            onChange={(e) => updateKitField(kitIdx, 'price', Number(e.target.value))}
                          />
                        </div>

                        {/* Interactive Features List Manager */}
                        <div style={{ gridColumn: 'span 12' }} className="calc-row">
                          <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Kit Included Deliverables (Features)</label>
                          
                          {/* List of current features */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                            {Array.isArray(kit.features) && kit.features.map((feat, featIdx) => {
                              const isExcluded = feat.startsWith('!') || feat.startsWith('-');
                              const cleanFeat = isExcluded ? feat.substring(1) : feat;
                              return (
                                <span 
                                  key={featIdx} 
                                  style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '6px', 
                                    fontSize: '11px', 
                                    padding: '4px 8px', 
                                    borderRadius: '4px',
                                    background: isExcluded ? 'rgba(239, 68, 68, 0.08)' : 'rgba(52, 211, 153, 0.08)',
                                    border: `1px solid ${isExcluded ? 'rgba(239, 68, 68, 0.15)' : 'rgba(52, 211, 153, 0.15)'}`,
                                    color: isExcluded ? 'var(--accent-red)' : 'var(--accent-emerald)'
                                  }}
                                >
                                  {isExcluded ? '✗' : '✓'} {cleanFeat}
                                  <button
                                    type="button"
                                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '0 2px', fontWeight: 'bold' }}
                                    onClick={() => handleRemoveFeature(kitIdx, featIdx)}
                                  >
                                    &times;
                                  </button>
                                </span>
                              );
                            })}
                          </div>

                          {/* Input to add a new feature tag */}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input 
                              type="text" 
                              placeholder="Type a deliverable. Start with '!' or '-' to show as Excluded (e.g. !Assembly)"
                              className="form-input" 
                              id={`new-feat-input-${kitIdx}`}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddFeature(kitIdx, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '11px', whiteSpace: 'nowrap' }}
                              onClick={() => {
                                const input = document.getElementById(`new-feat-input-${kitIdx}`);
                                if (input && input.value.trim()) {
                                  handleAddFeature(kitIdx, input.value);
                                  input.value = '';
                                }
                              }}
                            >
                              Add Feature
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid-12" style={{ gap: 'var(--space-3)' }}>
              <div style={{ gridColumn: 'span 12' }} className="calc-row">
                <label htmlFor="proj-curr">Currency</label>
                <select
                  id="proj-curr"
                  className="form-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>

            <div className="grid-12" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
              <div style={{ gridColumn: 'span 6' }} className="calc-row">
                <label htmlFor="proj-status">Status</label>
                <select
                  id="proj-status"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="coming-soon">Coming Soon</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 6' }} className="calc-row">
                <label htmlFor="proj-badge">Market Badge</label>
                <select
                  id="proj-badge"
                  className="form-select"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                >
                  <option value="">None</option>
                  <option value="best-seller">Best Seller</option>
                  <option value="popular">Popular</option>
                  <option value="new">New Release</option>
                  <option value="student">Student Project</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginTop: 'var(--space-4)' }}>
              <input
                type="checkbox"
                id="proj-featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="proj-featured" style={{ cursor: 'pointer', margin: 0, fontWeight: '500' }}>
                Promote to Homepage Featured list
              </label>
            </div>
          </div>

          {/* Section 6: Resources */}
          <div id="sec-resources" className="card-glass" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <h3 style={{ color: 'var(--accent-blue)' }}>Resource Files</h3>
              <Button type="button" variant="secondary" onClick={handleAddResource} style={{ padding: '4px 10px', fontSize: '12px' }}>
                Add resource
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {resourcesList.map((res, idx) => {
                const isUpload = res.source !== 'url';
                return (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '4px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveResource(idx)}
                      style={{ position: 'absolute', top: '4px', right: '4px', padding: '2px 6px', color: 'var(--accent-crimson, #ef4444)', fontSize: '12px' }}
                    >
                      ✕
                    </Button>
                    
                    {/* Source selection */}
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: '4px' }}>
                      <button
                        type="button"
                        className={`filter-tab ${isUpload ? 'active' : ''}`}
                        onClick={() => handleResourceSourceChange(idx, 'upload')}
                        style={{ padding: '2px 8px', fontSize: '11px', height: '22px' }}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        className={`filter-tab ${!isUpload ? 'active' : ''}`}
                        onClick={() => handleResourceSourceChange(idx, 'url')}
                        style={{ padding: '2px 8px', fontSize: '11px', height: '22px' }}
                      >
                        Paste Link
                      </button>
                    </div>

                    <div className="calc-row">
                      <label style={{ fontSize: '10px' }}>Resource Name *</label>
                      <Input
                        type="text"
                        placeholder="e.g. Solar_Tracker_Assembly_Guide"
                        className="form-input"
                        required
                        value={res.name}
                        onChange={(e) => handleResourceChange(idx, 'name', e.target.value)}
                        style={{ padding: '4px 8px', fontSize: '11px', height: '28px' }}
                      />
                    </div>

                    {isUpload ? (
                      <div className="calc-row">
                        <label style={{ fontSize: '10px' }}>Upload File (Max 5MB)</label>
                        <input
                          type="file"
                          className="form-file-input"
                          onChange={(e) => handleFileChange(idx, e.target.files[0])}
                        />
                        {res.size && (
                          <div style={{ fontSize: '10px', color: 'var(--accent-emerald)', marginTop: '4px' }}>
                            Parsed: {res.type?.toUpperCase()} &bull; {res.size}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="calc-row">
                        <label style={{ fontSize: '10px' }}>Download Link / URL *</label>
                        <Input
                          type="text"
                          placeholder="e.g. https://example.com/files/schematic.pdf"
                          className="form-input"
                          value={res.url || ''}
                          onChange={(e) => handleLinkChange(idx, e.target.value)}
                          style={{ padding: '4px 8px', fontSize: '11px', height: '28px' }}
                        />
                        {res.url && res.size && (
                          <div style={{ fontSize: '10px', color: 'var(--accent-emerald)', marginTop: '4px' }}>
                            Parsed: {res.type?.toUpperCase()} &bull; {res.size}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="calc-row">
                      <label style={{ fontSize: '10px' }}>Availability</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[
                          { value: 'available', label: 'Available' },
                          { value: 'coming-soon', label: 'Coming Soon' }
                        ].map((opt) => {
                          const isSelected = res.status === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleResourceChange(idx, 'status', opt.value)}
                              className={`admin-chip ${isSelected ? 'active' : ''}`}
                              style={{
                                flex: 1,
                                padding: '6px 12px',
                                fontSize: '11px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: isSelected ? 'var(--accent-violet)' : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${isSelected ? 'var(--accent-violet)' : 'rgba(255,255,255,0.06)'}`,
                                color: isSelected ? '#fff' : 'var(--text-secondary)',
                                textAlign: 'center'
                              }}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 7: Search Keywords */}
          <div id="sec-keywords" className="card-glass" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--accent-blue)' }}>Search Keywords</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
              Enter keywords separated by commas (helps precision searches & AI Finder).
            </p>
            <div className="calc-row">
              <Input
                type="text"
                className="form-input"
                placeholder="e.g. solar, energy, servo, automatic"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </div>

          </form>
      </div>


    </motion.section>
  );
};
