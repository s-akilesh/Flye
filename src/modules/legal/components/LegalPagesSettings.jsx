import React, { useState, useEffect } from 'react';
import { useLegalPage } from '../hooks/useLegalPage';
import { SettingsLayout } from '../../settings/components/SettingsLayout';
import { SettingsSection } from '../../settings/components/SettingsSection';
import { Input } from '../../../shared/components/ui/Input';
import { RichTextEditor } from '../../../shared/components/ui/RichTextEditor';
import { sanitizeHtml } from '../../../shared/utils/security.js';


const TAB_CONFIGS = [
  { id: 'privacy_policy', label: 'Privacy Policy' },
  { id: 'terms_conditions', label: 'Terms & Conditions' },
  { id: 'shipping_delivery', label: 'Shipping & Delivery' },
  { id: 'returns_cancellations', label: 'Returns & Cancellations' },
  { id: 'personalised_order_policy', label: 'Personalised-Order' },
  { id: 'custom_bulk_enquiries', label: 'Bulk Enquiries' }
];

export const LegalPagesSettings = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('privacy_policy');
  const { pageData, isLoading, isProcessing, fetchPage, updatePage } = useLegalPage();

  const [form, setForm] = useState({
    title: '',
    version: '1.0.0',
    content: '',
    published: false
  });

  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Load page configuration on tab change
  useEffect(() => {
    fetchPage(activeTab, true).then((data) => {
      const activeConfig = TAB_CONFIGS.find(t => t.id === activeTab);
      if (data) {
        setForm({
          title: data.title || activeConfig?.label || '',
          version: data.version || '1.0.0',
          content: data.content || '',
          published: data.published ?? false
        });
      } else {
        setForm({
          title: activeConfig?.label || '',
          version: '1.0.0',
          content: '',
          published: false
        });
      }
      setIsDirty(false);
      setSaveStatus(null);
    });
  }, [activeTab, fetchPage]);

  // Check if form is dirty
  useEffect(() => {
    if (!pageData) return;
    const changed = 
      form.title !== (pageData.title || '') ||
      form.version !== (pageData.version || '1.0.0') ||
      form.content !== (pageData.content || '') ||
      form.published !== (pageData.published ?? false);
    setIsDirty(changed);
  }, [form, pageData]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
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
        message: 'Legal Page Saved Successfully',
        lastUpdated: `${now}`
      });
    } catch (err) {
      // Custom hook handles showing toast error feedback
    }
  };

  return (
    <SettingsLayout
      title="Legal Pages"
      description="Configure and publish site legal declarations like Privacy Policy and Terms & Conditions."
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

      <SettingsSection title="Document Configuration" description="Set user-facing metadata.">
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
              If enabled, this document version will be publicly accessible.
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

      <SettingsSection title="Document Content" description="Compose rich-text content.">
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
