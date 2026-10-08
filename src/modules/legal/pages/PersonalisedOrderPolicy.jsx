import React, { useEffect } from 'react';
import { useLegalPage } from '../hooks/useLegalPage.js';
import { SupportLayout } from '../components/SupportLayout.jsx';
import { SEO } from '../../../shared/seo/SEO.jsx';
import { PageType } from '../../../shared/seo/constants/pageTypes.js';
import { generateSEO } from '../../../shared/seo/generateSEO.js';
import { trackEvent } from '../../../shared/analytics/analytics.js';
import { sanitizeHtml } from '../../../shared/utils/security.js';

export const PersonalisedOrderPolicy = () => {
  const { pageData, isLoading, fetchPage } = useLegalPage();
  const seoProps = generateSEO(PageType.TERMS);

  useEffect(() => {
    fetchPage('personalised_order_policy', false);
    trackEvent('personalised_order_policy_viewed');
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
        title="Personalised-Order Policy | Flyen" 
        description="Guidelines on custom 3D printing tolerances, CAD submissions, intellectual property confidentiality, and non-cancellable bespoke manufacturing."
      />
      <SupportLayout
        badge="BESPOKE FABRICATION"
        title={pageData?.title || "Personalised-Order Policy"}
        description="Essential standards and technical specifications governing custom 3D printing, bespoke hardware builds, CAD submissions, and IP protection."
        version={pageData?.version || "1.0.0"}
        lastUpdated={formatDate(pageData?.updated_at)}
      >
        {isLoading ? (
          <div className="flyen-support-loading">Loading bespoke policy details...</div>
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
                <div className="flyen-support-metric-value">±0.1 mm</div>
                <div className="flyen-support-metric-label">Precision Tolerance</div>
              </div>
              <div className="flyen-support-metric-card">
                <div className="flyen-support-metric-value">100% NDA</div>
                <div className="flyen-support-metric-label">IP Confidentiality</div>
              </div>
              <div className="flyen-support-metric-card">
                <div className="flyen-support-metric-value">6+ Materials</div>
                <div className="flyen-support-metric-label">PLA, PETG, Resin, TPU</div>
              </div>
              <div className="flyen-support-metric-card">
                <div className="flyen-support-metric-value">Pre-Flight</div>
                <div className="flyen-support-metric-label">Slicing & Wall Check</div>
              </div>
            </div>

            {/* Section 1 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">1. CAD File Submissions & Supported Formats</h2>
              <p>
                To maintain high dimensional accuracy and eliminate slicing errors, we accept the following industrial standard 3D asset formats:
              </p>
              <ul className="flyen-support-list">
                <li><code>.STL</code> (Standard Triangle Language – Binary or ASCII)</li>
                <li><code>.STEP / .STP</code> (Standard for Exchange of Product Model Data)</li>
                <li><code>.OBJ</code> (Wavefront 3D Object format with mesh topology)</li>
                <li><code>.3MF</code> (3D Manufacturing Format with embedded metadata)</li>
              </ul>
              <p>
                Prior to queuing, our engineers review overhangs, minimum wall thicknesses (recommended &ge; 1.2mm for FDM, &ge; 0.8mm for SLA), and structural load points.
              </p>
            </section>

            {/* Section 2 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">2. Dimensional Tolerances & Surface Characteristics</h2>
              <p>
                Additive manufacturing produces layer-by-layer structures with distinct material physical properties:
              </p>
              <div className="flyen-support-table-wrap">
                <table className="flyen-support-table">
                  <thead>
                    <tr>
                      <th>Technology</th>
                      <th>Standard Tolerance</th>
                      <th>Typical Layer Resolution</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>FDM (Fused Deposition Modeling)</td>
                      <td>±0.15 mm to ±0.2 mm</td>
                      <td>0.12 mm – 0.28 mm</td>
                    </tr>
                    <tr>
                      <td>SLA / DLP (Resin Photopolymer)</td>
                      <td>±0.05 mm to ±0.1 mm</td>
                      <td>0.025 mm – 0.05 mm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--txt-secondary)', marginTop: '8px' }}>
                <em>Note: Minor surface layer lines and support interface marks are characteristic of 3D printing and do not constitute manufacturing defects.</em>
              </p>
            </section>

            {/* Section 3 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">3. Production Initiation & Non-Cancellable Policy</h2>
              <div className="flyen-support-alert-box">
                <strong>Bespoke Manufacturing Clause:</strong> Custom parts are tailored uniquely to your specific geometry, infill density, and material choice. Once your order has progressed to slicing and machine execution, the order is <strong>strictly non-cancellable, non-returnable, and non-refundable</strong>, except in instances of demonstrable dimensional error exceeding our specified tolerances.
              </div>
            </section>

            {/* Section 4 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">4. Intellectual Property & Complete Confidentiality</h2>
              <p>
                We recognize that your designs, inventions, and research models represent valuable intellectual property:
              </p>
              <ul className="flyen-support-list">
                <li>
                  <strong>100% Customer Ownership:</strong> All uploaded CAD assets, design files, and proprietary project codes remain strictly your property.
                </li>
                <li>
                  <strong>Non-Disclosure Guarantee:</strong> We never share, sell, or distribute your CAD files to third parties. Files are securely archived solely for re-print validation or deleted upon request.
                </li>
              </ul>
            </section>

          </article>
        )}
      </SupportLayout>
    </>
  );
};
