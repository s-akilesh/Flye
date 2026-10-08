import React, { useEffect } from 'react';
import { useLegalPage } from '../hooks/useLegalPage.js';
import { SupportLayout } from '../components/SupportLayout.jsx';
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
      <SEO {...seoProps} page={PageType.PRIVACY} />
      <SupportLayout
        badge="DATA PRIVACY & SECURITY"
        title={pageData?.title || "Privacy Policy"}
        description="Our commitment to safeguarding your personal data, payment confidentiality, CAD file intellectual property, and communication records."
        version={pageData?.version || "1.0.0"}
        lastUpdated={formatDate(pageData?.updated_at)}
      >
        {isLoading ? (
          <div className="flyen-support-loading">Loading privacy policy details...</div>
        ) : pageData?.content ? (
          <article 
            className="rich-text-content"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(pageData.content) }}
          />
        ) : (
          <article className="flyen-support-article">
            
            {/* Highlight Metric Cards */}
            <div className="flyen-support-highlights-grid">
              <div className="flyen-support-metric-card">
                <div className="flyen-support-metric-value">256-Bit</div>
                <div className="flyen-support-metric-label">SSL Data Encryption</div>
              </div>
              <div className="flyen-support-metric-card">
                <div className="flyen-support-metric-value">Zero Sale</div>
                <div className="flyen-support-metric-label">No Third-Party Ads</div>
              </div>
              <div className="flyen-support-metric-card">
                <div className="flyen-support-metric-value">100% Secure</div>
                <div className="flyen-support-metric-label">PCI-DSS Payments</div>
              </div>
              <div className="flyen-support-metric-card">
                <div className="flyen-support-metric-value">Full Control</div>
                <div className="flyen-support-metric-label">Account Data Access</div>
              </div>
            </div>

            {/* Section 1 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">1. Information We Collect</h2>
              <p>
                To provide high-quality engineering services, customized hardware builds, and 3D printing orders, we collect the following categories of information:
              </p>
              <ul className="flyen-support-list">
                <li>
                  <strong>Account & Contact Data:</strong> Full name, verified email address, mobile number, and delivery shipping coordinates.
                </li>
                <li>
                  <strong>Technical Order Assets:</strong> 3D CAD models (.STL, .STEP, .OBJ), custom project specifications, and bill of materials (BOM) submitted for quotations.
                </li>
                <li>
                  <strong>Transactional Records:</strong> Payment transaction references, tax invoicing particulars, and order histories (processed through secure RBI-compliant payment gateways).
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">2. How We Protect & Use Your Data</h2>
              <p>
                Your information is used strictly to fulfill manufacturing orders, dispatch shipments, send automated tracking alerts, and provide responsive technical assistance. We never sell or monetize your personal information to marketing brokers.
              </p>
            </section>

            {/* Section 3 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">3. Proprietary Design Confidentiality</h2>
              <p>
                All 3D design files and project schematics uploaded to the Flyen platform are treated as confidential intellectual property. Access is restricted exclusively to production engineers executing your order.
              </p>
            </section>

            {/* Section 4 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">4. Cookies & Session Management</h2>
              <p>
                We use strictly necessary session cookies to maintain your authenticated login state, cart contents, and theme preferences. You may adjust browser cookie settings at any time.
              </p>
            </section>

          </article>
        )}
      </SupportLayout>
    </>
  );
};
