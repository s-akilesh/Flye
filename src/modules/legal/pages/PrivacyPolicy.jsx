import React, { useEffect } from 'react';
import { useLegalPage } from '../hooks/useLegalPage.js';
import { SEO } from '../../../shared/seo/SEO.jsx';
import { PageType } from '../../../shared/seo/constants/pageTypes.js';
import { generateSEO } from '../../../shared/seo/generateSEO.js';
import { trackEvent } from '../../../shared/analytics/analytics.js';
import { sanitizeHtml } from '../../../shared/utils/security.js';


export const PrivacyPolicy = () => {
  const { pageData, isLoading, fetchPage } = useLegalPage();
  const seoProps = generateSEO(PageType.PRIVACY);

  useEffect(() => {
    fetchPage('privacy_policy', false);
    trackEvent('privacy_policy_viewed');
  }, [fetchPage]);

  // Format updated timestamp
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEO {...seoProps} page={PageType.PRIVACY} />
      <div 
        className="legal-page-wrapper"
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: 'var(--space-8) var(--page-padding)',
          color: 'var(--txt-primary)',
          textAlign: 'left',
          minHeight: '60vh'
        }}
      >
        {isLoading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading document details...
          </div>
        ) : pageData ? (
          <article>
            {/* Header / Versioning details */}
            <div 
              style={{ 
                borderBottom: '1px solid var(--sys-divider)', 
                paddingBottom: '16px', 
                marginBottom: '32px' 
              }}
            >
              <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 12px 0' }}>
                {pageData.title || 'Privacy Policy'}
              </h1>
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  fontSize: '12px', 
                  color: 'var(--text-muted, #6b7280)' 
                }}
              >
                <span>Version {pageData.version || '1.0.0'}</span>
                <span>•</span>
                <span>Last Updated: {formatDate(pageData.updated_at)}</span>
              </div>
            </div>

            {/* Content body */}
            <div 
              className="rich-text-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(pageData.content) }}
              style={{
                lineHeight: '1.7',
                fontSize: '14.5px',
                color: 'var(--text-secondary, #e5e7eb)'
              }}
            />
          </article>
        ) : (
          <div 
            style={{ 
              padding: '60px var(--space-4)', 
              textAlign: 'center', 
              background: 'rgba(255, 255, 255, 0.01)', 
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px'
            }}
          >
            <span className="material-icons-outlined" style={{ fontSize: '48px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              gavel
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Privacy Policy is under review</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              The Privacy Policy page is currently being updated. Please check back later.
            </p>
          </div>
        )}
      </div>
    </>
  );
};
