import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RichTextEditor } from '../components/ui/RichTextEditor';
import { ROUTES } from '../constants/routes';
import { CATEGORY_LABELS } from '../constants/categories';

export const AddProject = () => {
  const navigate = useNavigate();
  const { allProjects, addProject } = useProjects();

  // Basic Info State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');

  // Classification State
  const [category, setCategory] = useState('automation');
  const [projectLevel, setProjectLevel] = useState('Engineering');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [buildTime, setBuildTime] = useState('6-8 Hours');
  const [technology, setTechnology] = useState('');

  // Pricing & Status State
  const [price, setPrice] = useState(2499);
  const [currency, setCurrency] = useState('INR');
  const [status, setStatus] = useState('active');
  const [featured, setFeatured] = useState(false);
  const [badge, setBadge] = useState('');

  // Media State
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [schematicUrl, setSchematicUrl] = useState('');
  const [circuitUrl, setCircuitUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleThumbnailUpload = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large! Maximum allowed size is 5MB.');
      return;
    }
    setThumbnailFile(file);
    // Convert to Base64 so it persists across page reloads in localStorage
    const reader = new FileReader();
    reader.onload = (e) => setThumbnailPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Dynamic Components State (array of strings)
  const [componentsList, setComponentsList] = useState(['']);

  // Dynamic Resources State (array of { name, type, size, status })
  const [resourcesList, setResourcesList] = useState([
    { name: '', type: 'pdf', size: '', status: 'available' }
  ]);

  // Search Keywords State (comma-separated string)
  const [keywords, setKeywords] = useState('');

  // Related Projects State (array of project IDs)
  const [relatedProjects, setRelatedProjects] = useState([]);

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
      'sec-classification',
      'sec-pricing',
      'sec-media',
      'sec-components',
      'sec-resources',
      'sec-keywords',
      'sec-related'
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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dynamic Component List handlers
  const handleAddComponent = () => {
    setComponentsList([...componentsList, '']);
  };

  const handleRemoveComponent = (index) => {
    const nextList = componentsList.filter((_, idx) => idx !== index);
    setComponentsList(nextList.length === 0 ? [''] : nextList);
  };

  const handleComponentChange = (index, value) => {
    const nextList = [...componentsList];
    nextList[index] = value;
    setComponentsList(nextList);
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
      alert("File is too large! Maximum allowed size is 5MB.");
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

  // Related project checkbox toggle
  const handleToggleRelated = (id) => {
    setRelatedProjects((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Parameterized Save Project flow
  const handleSaveProject = async (targetStatus) => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in the required fields (Title, Short Description).");
      return;
    }

    // Clean Dynamic Components
    const finalComponents = componentsList.map((c) => c.trim()).filter((c) => c !== '');
    
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

    // Map fields to the repository model schema
    const projectPayload = {
      title: title.trim(),
      description: description.trim(),
      fullDescription: fullDescription.trim(),
      price: Number(price),
      currency,
      projectLevel,
      difficulty,
      technology: technology.trim() || 'Arduino',
      category,
      buildTime: buildTime.trim() || '4-6 Hours',
      features: ['hardware', 'code', 'circuit', 'docs', 'support'],
      badge: badge.trim(),
      searchKeywords: finalKeywords,
      images: {
        main: thumbnailPreview || 'src/assets/projects/smart-home/main.svg',
        schematic: schematicUrl.trim() || 'src/assets/projects/smart-home/schematic.svg',
        circuit: circuitUrl.trim() || 'src/assets/projects/smart-home/circuit.svg'
      },
      videoUrl: videoUrl.trim() || 'https://www.youtube.com/embed/placeholder',
      resources: finalResources,
      components: finalComponents,
      specifications: {
        controller: technology.trim() || 'Arduino Uno',
        sensors: 'Standard sensor configuration',
        communication: category === 'iot' ? 'Wi-Fi' : category === 'gps-gsm' ? 'GSM' : 'None',
        operatingVoltage: '5V DC',
        programmingLanguage: 'C++'
      },
      relatedProjects,
      stockStatus: 'in-stock',
      featured,
      status: targetStatus
    };

    try {
      await addProject(projectPayload);
      alert(`Project kit successfully saved as ${targetStatus}!`);
      navigate(ROUTES.ADMIN_PROJECTS);
    } catch (err) {
      alert("Error creating project kit.");
    }
  };

  return (
    <motion.section
      className="portal-section portal-layout-fixed-height"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with Relocated Actions */}
      <div className="portal-header" style={{ maxWidth: '100%', width: '100%', paddingLeft: '40px', paddingRight: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button variant="secondary" className="btn-back" onClick={() => navigate(ROUTES.ADMIN_PROJECTS)} style={{ padding: '8px', minWidth: 'auto' }}>
            <svg viewBox="0 0 24 24">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
            </svg>
          </Button>
          <div className="portal-title-area">
            <h2>Create New Engineering Kit</h2>
            <p>Scaffold a project module and publish it to the catalog</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button variant="ghost" onClick={() => navigate(ROUTES.ADMIN_PROJECTS)}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => handleSaveProject('draft')}>
            Save as Draft
          </Button>
          <Button variant="primary" onClick={() => handleSaveProject('active')} className="btn-submit-calc">
            Save Project
          </Button>
        </div>
      </div>

      <div className="portal-content-flex" style={{ maxWidth: '100%', width: '100%', paddingLeft: '40px', paddingRight: '40px' }}>
        {/* Left Sticky Section Navigation */}
        <div className="portal-form-navigation">
          <button
            type="button"
            className={`nav-sec-btn ${activeSection === 'sec-basic' ? 'active' : ''}`}
            onClick={() => scrollToSection('sec-basic')}
          >
            📝 Basic Information
          </button>
          <button
            type="button"
            className={`nav-sec-btn ${activeSection === 'sec-classification' ? 'active' : ''}`}
            onClick={() => scrollToSection('sec-classification')}
          >
            🏷️ Classification
          </button>
          <button
            type="button"
            className={`nav-sec-btn ${activeSection === 'sec-pricing' ? 'active' : ''}`}
            onClick={() => scrollToSection('sec-pricing')}
          >
            💰 Pricing & Status
          </button>
          <button
            type="button"
            className={`nav-sec-btn ${activeSection === 'sec-media' ? 'active' : ''}`}
            onClick={() => scrollToSection('sec-media')}
          >
            🖼️ Media
          </button>
          <button
            type="button"
            className={`nav-sec-btn ${activeSection === 'sec-components' ? 'active' : ''}`}
            onClick={() => scrollToSection('sec-components')}
          >
            ⚡ Components
          </button>
          <button
            type="button"
            className={`nav-sec-btn ${activeSection === 'sec-resources' ? 'active' : ''}`}
            onClick={() => scrollToSection('sec-resources')}
          >
            📄 Resources
          </button>
          <button
            type="button"
            className={`nav-sec-btn ${activeSection === 'sec-keywords' ? 'active' : ''}`}
            onClick={() => scrollToSection('sec-keywords')}
          >
            🔍 Search Keywords
          </button>
          <button
            type="button"
            className={`nav-sec-btn ${activeSection === 'sec-related' ? 'active' : ''}`}
            onClick={() => scrollToSection('sec-related')}
          >
            🔗 Related Projects
          </button>
        </div>

        {/* Center Scrollable Form Area */}
        <form className="terminal-form portal-form-scrollable" onSubmit={(e) => e.preventDefault()}>
          
          {/* Section 1: Basic Information */}
          <div id="sec-basic" className="card-glass" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--accent-blue)' }}>1. Basic Information</h3>

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

          {/* Section 2: Classification */}
          <div id="sec-classification" className="card-glass" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--accent-blue)' }}>2. Classification</h3>
            <div className="grid-12" style={{ gap: 'var(--space-3)' }}>
              <div style={{ gridColumn: 'span 4' }} className="calc-row">
                <label htmlFor="proj-cat">Category</label>
                <select
                  id="proj-cat"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: 'span 4' }} className="calc-row">
                <label htmlFor="proj-level">Project Level</label>
                <select
                  id="proj-level"
                  className="form-select"
                  value={projectLevel}
                  onChange={(e) => setProjectLevel(e.target.value)}
                >
                  <option value="School">School Projects</option>
                  <option value="Diploma">Diploma Projects</option>
                  <option value="Engineering">Engineering Projects</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 4' }} className="calc-row">
                <label htmlFor="proj-diff">Difficulty</label>
                <select
                  id="proj-diff"
                  className="form-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid-12" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
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
              <div style={{ gridColumn: 'span 6' }} className="calc-row">
                <label htmlFor="proj-time">Estimated Build Time</label>
                <Input
                  type="text"
                  id="proj-time"
                  className="form-input"
                  placeholder="e.g. 5-7 Hours"
                  value={buildTime}
                  onChange={(e) => setBuildTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pricing & Status */}
          <div id="sec-pricing" className="card-glass" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--accent-blue)' }}>3. Pricing & Status</h3>
            
            <div className="grid-12" style={{ gap: 'var(--space-3)' }}>
              <div style={{ gridColumn: 'span 8' }} className="calc-row">
                <label htmlFor="proj-price">Kit Cost *</label>
                <Input
                  type="number"
                  id="proj-price"
                  className="form-input"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div style={{ gridColumn: 'span 4' }} className="calc-row">
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

          {/* Section 4: Media */}
          <div id="sec-media" className="card-glass" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--accent-blue)' }}>4. Media Assets</h3>

            <div className="calc-row" style={{ marginBottom: 'var(--space-3)' }}>
              <label htmlFor="proj-schematic">Schematic Graphic Link (URL)</label>
              <Input
                type="url"
                id="proj-schematic"
                className="form-input"
                placeholder="e.g. https://example.com/assets/schematic.svg"
                value={schematicUrl}
                onChange={(e) => setSchematicUrl(e.target.value)}
              />
            </div>

            <div className="calc-row" style={{ marginBottom: 'var(--space-3)' }}>
              <label htmlFor="proj-circuit">Circuit Board Diagram Link (URL)</label>
              <Input
                type="url"
                id="proj-circuit"
                className="form-input"
                placeholder="e.g. https://example.com/assets/circuit.svg"
                value={circuitUrl}
                onChange={(e) => setCircuitUrl(e.target.value)}
              />
            </div>

            <div className="calc-row">
              <label htmlFor="proj-video">Video Guide URL (YouTube embed link)</label>
              <Input
                type="url"
                id="proj-video"
                className="form-input"
                placeholder="e.g. https://www.youtube.com/embed/XXXXXX"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Section 5: Components */}
          <div id="sec-components" className="card-glass" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <h3 style={{ color: 'var(--accent-blue)' }}>5. Hardware Components</h3>
              <Button type="button" variant="secondary" onClick={handleAddComponent} style={{ padding: '4px 10px', fontSize: '12px' }}>
                + Add row
              </Button>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
              List the hardware modules, chips, and wires included in this prototyped kit.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {componentsList.map((comp, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: '20px' }}>#{idx+1}</span>
                  <Input
                    type="text"
                    className="form-input"
                    placeholder="e.g. HC-SR501 PIR sensor"
                    value={comp}
                    onChange={(e) => handleComponentChange(idx, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveComponent(idx)}
                    style={{ padding: '8px', color: 'var(--accent-crimson, #ef4444)' }}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Resources */}
          <div id="sec-resources" className="card-glass" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <h3 style={{ color: 'var(--accent-blue)' }}>6. Resource Files</h3>
              <Button type="button" variant="secondary" onClick={handleAddResource} style={{ padding: '4px 10px', fontSize: '12px' }}>
                + Add resource
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
                          onChange={(e) => handleFileChange(idx, e.target.files[0])}
                          style={{
                            display: 'block',
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px dashed rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            padding: '6px',
                            cursor: 'pointer',
                            width: '100%'
                          }}
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
                      <select
                        className="form-select"
                        value={res.status}
                        onChange={(e) => handleResourceChange(idx, 'status', e.target.value)}
                        style={{ padding: '2px 4px', fontSize: '11px', height: '26px' }}
                      >
                        <option value="available">Available</option>
                        <option value="coming-soon">Coming Soon</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 7: Search Keywords */}
          <div id="sec-keywords" className="card-glass" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--accent-blue)' }}>7. Search Keywords</h3>
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

          {/* Section 8: Related Projects */}
          <div id="sec-related" className="card-glass" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
            <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--accent-blue)' }}>8. Related kits recommendation</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
              Select other kits to suggest in the details footer.
            </p>
            <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', padding: '6px', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '4px', background: 'rgba(0,0,0,0.1)' }}>
              {allProjects.map((p) => (
                <label key={p.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={relatedProjects.includes(p.id)}
                    onChange={() => handleToggleRelated(p.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  {p.title}
                </label>
              ))}
            </div>
          </div>
        </form>
      </div>
    </motion.section>
  );
};
