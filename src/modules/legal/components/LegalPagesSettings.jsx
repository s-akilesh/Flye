import React, { useState, useEffect } from 'react';
import { useLegalPage } from '../hooks/useLegalPage';
import { SettingsLayout } from '../../settings/components/SettingsLayout';
import { SettingsSection } from '../../settings/components/SettingsSection';
import { Input } from '../../../shared/components/ui/Input';
import { RichTextEditor } from '../../../shared/components/ui/RichTextEditor';

// Native browser-based HTML Sanitizer for XSS prevention
const sanitizeHtml = (html) => {
  if (typeof window === 'undefined') return html;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // 1. Remove script tags
    const scripts = doc.querySelectorAll('script');
    scripts.forEach(s => s.remove());
    
    // 2. Clean event handlers and javascript: URIs
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      const attrs = Array.from(el.attributes);
      attrs.forEach(attr => {
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
        if (attr.name === 'href' || attr.name === 'src') {
          const val = attr.value.trim().toLowerCase();
          if (val.startsWith('javascript:')) {
            el.setAttribute(attr.name, '#');
          }
        }
      });
    });
    
    return doc.body.innerHTML;
  } catch (err) {
    console.error('[XSS Sanitizer] Failed to sanitize HTML:', err);
    return html;
  }
};

export const LegalPagesSettings = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('privacy_policy'); // 'privacy_policy' | 'terms_conditions'
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
      if (data) {
        setForm({
          title: data.title || '',
          version: data.version || '1.0.0',
          content: data.content || '',
          published: data.published ?? false
        });
      } else {
        setForm({
          title: activeTab === 'privacy_policy' ? 'Privacy Policy' : 'Terms & Conditions',
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
      <SettingsSection title="Select Legal Document" description="Toggle between Privacy Policy and Terms & Conditions.">
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <button
            type="button"
            className="product-btn"
            onClick={() => setActiveTab('privacy_policy')}
            style={{
              flex: 1,
              background: activeTab === 'privacy_policy' ? 'var(--accent-violet, #8b5cf6)' : 'rgba(255, 255, 255, 0.02)',
              border: activeTab === 'privacy_policy' ? '1px solid var(--accent-violet, #8b5cf6)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.25s'
            }}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            className="product-btn"
            onClick={() => setActiveTab('terms_conditions')}
            style={{
              flex: 1,
              background: activeTab === 'terms_conditions' ? 'var(--accent-violet, #8b5cf6)' : 'rgba(255, 255, 255, 0.02)',
              border: activeTab === 'terms_conditions' ? '1px solid var(--accent-violet, #8b5cf6)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.25s'
            }}
          >
            Terms & Conditions
          </button>
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
