import React, { useEffect } from 'react';
import { useLegalPage } from '../hooks/useLegalPage.js';
import { SupportLayout } from '../components/SupportLayout.jsx';
import { SEO } from '../../../shared/seo/SEO.jsx';
import { PageType } from '../../../shared/seo/constants/pageTypes.js';
import { generateSEO } from '../../../shared/seo/generateSEO.js';
import { trackEvent } from '../../../shared/analytics/analytics.js';
import { sanitizeHtml } from '../../../shared/utils/security.js';

export const TermsConditions = () => {
  const { pageData, isLoading, fetchPage } = useLegalPage();
  const seoProps = generateSEO(PageType.TERMS);

  useEffect(() => {
    fetchPage('terms_conditions', false);
    trackEvent('terms_conditions_viewed');
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
      <SEO {...seoProps} page={PageType.TERMS} />
      <SupportLayout
        badge="TERMS OF SERVICE"
        title={pageData?.title || "Terms and Conditions"}
        description="Standard legal terms, platform usage rules, intellectual property guidelines, warranties, and service agreements."
        version={pageData?.version || "1.0.0"}
        lastUpdated={formatDate(pageData?.updated_at)}
      >
        {isLoading ? (
          <div className="flyen-support-loading">Loading terms details...</div>
        ) : pageData?.content ? (
          <article 
            className="rich-text-content"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(pageData.content) }}
          />
        ) : (
          <article className="flyen-support-article">
            {/* Section 1 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">1. Acceptance of Terms</h2>
              <p>
                By accessing Flyen or placing an order for hardware project kits, standard 3D printed components, or custom manufacturing services, you agree to be bound by these Terms and Conditions.
              </p>
            </section>

            {/* Section 2 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">2. Product Specifications & Accuracy</h2>
              <p>
                We strive to display electronic component descriptions, pin diagrams, and 3D print specifications with maximum technical precision. Given the nature of electronic prototyping, slight component batch variations may occur while maintaining identical functional performance.
              </p>
            </section>

            {/* Section 3 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">3. User Conduct & Prohibited Designs</h2>
              <p>
                Users agree not to submit 3D models or project requests involving restricted weapons, harmful implements, or designs infringing on third-party patents or copyrights.
              </p>
            </section>

            {/* Section 4 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">4. Limitation of Liability</h2>
              <p>
                Flyen provides project kits and prototyping components for educational, experimental, and prototype engineering purposes. Flyen is not liable for indirect or consequential damages arising from improper circuit wiring, reverse voltage application, or user modifications.
              </p>
            </section>

          </article>
        )}
      </SupportLayout>
    </>
  );
};
