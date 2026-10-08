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
        title="Returns & Cancellations Policy | Flyen" 
        description="Comprehensive details on Flyen 7-day replacement guarantee, order cancellations, defective hardware claims, and refund processing."
      />
      <SupportLayout
        badge="CUSTOMER ASSURANCE"
        title={pageData?.title || "Returns and Cancellations"}
        description="Clear policies regarding product replacements, cancellation windows, non-returnable items, and refund processing schedules."
        version={pageData?.version || "1.1.0"}
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
          <article className="flyen-support-article">
            {/* Section 1 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">1. 7-Day Replacement Guarantee</h2>
              <p>
                We stand firmly behind the quality of our products. A free 1-to-1 replacement is provided within <strong>7 calendar days of delivery</strong> under the following circumstances:
              </p>
              <ul className="flyen-support-list">
                <li>
                  <strong>Dead on Arrival (DOA) / Defective Electronics:</strong> Sensors, microcontrollers, or power modules that fail initial diagnostics under standard operating voltage.
                </li>
                <li>
                  <strong>Missing Kit Components:</strong> Any sensor, jumper wire, or PCB listed in the project schematic manifest that is absent from your delivered parcel.
                </li>
                <li>
                  <strong>Transit Damage:</strong> Mechanical deformities, cracks, or broken connector pins sustained during delivery.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">2. Step-by-Step Replacement Claim Process</h2>
              <ol className="flyen-support-steps-list">
                <li>
                  <strong>Submit a Claim:</strong> Contact support at <code>support@flyen.in</code> or message our official WhatsApp support channel with your <strong>Order ID</strong>.
                </li>
                <li>
                  <strong>Provide Diagnostic Media:</strong> Share a brief description alongside clear photographs or a short video demonstrating the defect or broken component.
                </li>
                <li>
                  <strong>Engineering Verification:</strong> Our technical team will review the issue within <strong>24 business hours</strong> and approve a replacement.
                </li>
                <li>
                  <strong>Dispatch:</strong> The replacement unit is dispatched via priority air courier at zero additional cost to you.
                </li>
              </ol>
            </section>

            {/* Section 3 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">3. Order Cancellation Policy</h2>
              <p>
                We provide full flexibility prior to physical dispatch:
              </p>
              <ul className="flyen-support-list">
                <li>
                  <strong>Standard In-Stock Products:</strong> You may cancel standard orders anytime <strong>before courier pickup and AWB dispatch</strong> for an immediate 100% full refund.
                </li>
                <li>
                  <strong>Custom 3D Printing & Bespoke Fabrications:</strong> Cancellations are permitted <strong>only prior to machine slicing and print initiation</strong>. Once a 3D printer has commenced running resin or filament for your custom geometry, cancellations cannot be processed.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">4. Non-Returnable & Non-Refundable Items</h2>
              <div className="flyen-support-alert-box">
                The following categories are non-returnable:
                <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                  <li>Custom 3D prints fabricated strictly according to customer-supplied CAD files.</li>
                  <li>Digital downloads, circuit schematic files, and downloadable firmware code packages.</li>
                  <li>Electronic components that have been subjected to electrical over-voltage, reverse polarity, or physical soldering damage by the user.</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">5. Refund Processing & Timelines</h2>
              <p>
                Approved refunds are initiated immediately by our billing desk and credited back to the original payment source (Credit/Debit Card, UPI, or Net Banking) within <strong>5 to 7 business days</strong>.
              </p>
            </section>

          </article>
        )}
      </SupportLayout>
    </>
  );
};
