import React, { useState, useEffect } from 'react';
import { useLegalPage } from '../hooks/useLegalPage';
import { SettingsLayout } from '../../settings/components/SettingsLayout';
import { SettingsSection } from '../../settings/components/SettingsSection';
import { Input } from '../../../shared/components/ui/Input';
import { RichTextEditor } from '../../../shared/components/ui/RichTextEditor';
import { sanitizeHtml } from '../../../shared/utils/security.js';
import { DEFAULT_LEGAL_CONFIGS } from '../constants/defaultLegalContent.js';

const TAB_CONFIGS = [
  { id: 'privacy_policy', label: 'Privacy Policy', path: '/privacy-policy' },
  { id: 'terms_conditions', label: 'Terms & Conditions', path: '/terms-and-conditions' },
  { id: 'shipping_delivery', label: 'Shipping & Delivery', path: '/shipping-and-delivery' },
  { id: 'returns_cancellations', label: 'Returns & Cancellations', path: '/returns-and-cancellations' },
  { id: 'personalised_order_policy', label: 'Personalised-Order', path: '/personalised-order-policy' },
  { id: 'custom_bulk_enquiries', label: 'Bulk Enquiries', path: '/custom-printing-and-bulk-enquiries' }
];

export const LegalPagesSettings = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('privacy_policy');
  const { pageData, isLoading, isProcessing, fetchPage, updatePage } = useLegalPage();

  const [form, setForm] = useState({
    title: '',
    version: '1.0.0',
    content: '',
    published: true
  });

  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const activeConfig = TAB_CONFIGS.find(t => t.id === activeTab) || TAB_CONFIGS[0];

  // Load page configuration on tab change
  useEffect(() => {
    fetchPage(activeTab, true).then((data) => {
      const defaultConfig = DEFAULT_LEGAL_CONFIGS[activeTab] || {};
      if (data) {
        setForm({
          title: data.title || defaultConfig.title || activeConfig.label || '',
          version: data.version || defaultConfig.version || '1.0.0',
          content: data.content || defaultConfig.content || '',
          published: data.published ?? true
        });
      } else {
        setForm({
          title: defaultConfig.title || activeConfig.label || '',
          version: defaultConfig.version || '1.0.0',
          content: defaultConfig.content || '',
          published: defaultConfig.published ?? true
        });
      }
      setIsDirty(false);
      setSaveStatus(null);
    });
  }, [activeTab, fetchPage]);

  // Check if form is dirty
  useEffect(() => {
    if (!pageData) return;
    const defaultConfig = DEFAULT_LEGAL_CONFIGS[activeTab] || {};
    const origTitle = pageData.title || defaultConfig.title || '';
    const origVersion = pageData.version || defaultConfig.version || '1.0.0';
    const origContent = pageData.content || defaultConfig.content || '';
    const origPublished = pageData.published ?? true;

    const changed = 
      form.title !== origTitle ||
      form.version !== origVersion ||
      form.content !== origContent ||
      form.published !== origPublished;
    setIsDirty(changed);
  }, [form, pageData, activeTab]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleResetToDefault = () => {
    const defaultConfig = DEFAULT_LEGAL_CONFIGS[activeTab];
    if (defaultConfig) {
      setForm({
        title: defaultConfig.title,
        version: defaultConfig.version,
        content: defaultConfig.content,
        published: true
      });
      setIsDirty(true);
    }
  };

  const handleSave = async () => {
    setSaveStatus(null);
    try {
      const sanitizedContent = sanitizeHtml(form.content);
      
      const payload = {
        title: form.title,
        version: form.version,
        content: sanitizedContent,
        published: form.published
      };

      await updatePage(activeTab, payload);
      setIsDirty(false);
      
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveStatus({
        message: `${activeConfig.label} Saved Successfully`,
        lastUpdated: `${now}`
      });
    } catch (err) {
      // Custom hook handles showing toast error feedback
    }
  };

  return (
    <SettingsLayout
      title="Legal & Support Pages"
      description="Configure, compose and publish site legal declarations, warranties, and support policy documents."
      categoryName="Website"
      isDirty={isDirty}
      isLoading={isProcessing || isLoading}
      onSave={handleSave}
      onCancel={onBack}
      saveStatus={saveStatus}
    >
      <SettingsSection title="Select Legal / Support Document" description="Toggle between site policies and customer support agreements.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '16px' }}>
          {TAB_CONFIGS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className="product-btn"
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'var(--accent-violet, #8b5cf6)' : 'rgba(255, 255, 255, 0.02)',
                border: activeTab === tab.id ? '1px solid var(--accent-violet, #8b5cf6)' : '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                padding: '10px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '12px',
                textAlign: 'center',
                transition: 'all 0.25s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              title={tab.label}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Document Configuration" description="Set user-facing metadata and live publication status.">
        <div className="calc-row settings-field-row">
          <label className="form-label">Document Title</label>
          <Input
            type="text"
            className="form-input"
            placeholder="e.g. Privacy Policy"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
        <div className="calc-row settings-field-row">
          <label className="form-label">Version Number</label>
          <Input
            type="text"
            className="form-input"
            placeholder="e.g. 1.0.0"
            value={form.version}
            onChange={(e) => handleChange('version', e.target.value)}
          />
        </div>
        <div className="calc-row settings-field-row" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <div>
            <label className="form-label" style={{ marginBottom: 0 }}>Publish Status</label>
            <span style={{ fontSize: '11px', color: 'var(--text-muted, #6b7280)', display: 'block', marginTop: '2px' }}>
              When enabled, this document version will be publicly accessible on the frontend.
            </span>
          </div>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => handleChange('published', e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--accent-violet, #8b5cf6)' }}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Document Content" description="Compose rich-text content for the customer-facing screen.">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <a
              href={activeConfig.path}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '12px',
                color: 'var(--brand-primary, #00dfa2)',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Preview Live Screen: {activeConfig.path}</span>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
          <button
            type="button"
            onClick={handleResetToDefault}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'var(--txt-secondary, #94a3b8)',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Load default structured template content"
          >
            Reset to Standard Template
          </button>
        </div>
        <div style={{ marginTop: '8px' }}>
          <RichTextEditor
            value={form.content}
            onChange={(val) => handleChange('content', val)}
            placeholder="Compose legal document..."
          />
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
};

