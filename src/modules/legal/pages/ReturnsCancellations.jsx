import React, { useEffect } from 'react';
import { useLegalPage } from '../hooks/useLegalPage.js';
import { SupportLayout } from '../components/SupportLayout.jsx';
import { SEO } from '../../../shared/seo/SEO.jsx';
import { PageType } from '../../../shared/seo/constants/pageTypes.js';
import { generateSEO } from '../../../shared/seo/generateSEO.js';
import { trackEvent } from '../../../shared/analytics/analytics.js';
import { sanitizeHtml } from '../../../shared/utils/security.js';

export const ReturnsCancellations = () => {
  const { pageData, isLoading, fetchPage } = useLegalPage();
  const seoProps = generateSEO(PageType.TERMS);

  useEffect(() => {
    fetchPage('returns_cancellations', false);
    trackEvent('returns_cancellations_viewed');
  }, [fetchPage]);

  const formatDate = (isoString) => {
    if (!isoString) return 'October 2026';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEO 
        {...seoProps} 
        title={`${pageData?.title || 'Returns and Cancellations'} | Flyen`}
      />
      <SupportLayout
        title={pageData?.title || "Returns and Cancellations"}
        version={pageData?.version || "1.0.0"}
        lastUpdated={formatDate(pageData?.updated_at)}
      >
        {isLoading ? (
          <div className="flyen-support-loading">Loading policy details...</div>
        ) : pageData?.content ? (
          <article 
            className="rich-text-content"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(pageData.content) }}
          />
        ) : (
          <div className="flyen-support-loading">No content currently available.</div>
        )}
      </SupportLayout>
    </>
  );
};
