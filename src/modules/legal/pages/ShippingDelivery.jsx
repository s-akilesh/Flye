import React, { useEffect } from 'react';
import { useLegalPage } from '../hooks/useLegalPage.js';
import { SupportLayout } from '../components/SupportLayout.jsx';
import { SEO } from '../../../shared/seo/SEO.jsx';
import { PageType } from '../../../shared/seo/constants/pageTypes.js';
import { generateSEO } from '../../../shared/seo/generateSEO.js';
import { trackEvent } from '../../../shared/analytics/analytics.js';
import { sanitizeHtml } from '../../../shared/utils/security.js';

export const ShippingDelivery = () => {
  const { pageData, isLoading, fetchPage } = useLegalPage();
  const seoProps = generateSEO(PageType.TERMS);

  useEffect(() => {
    fetchPage('shipping_delivery', false);
    trackEvent('shipping_delivery_viewed');
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
        title="Shipping & Delivery Policy | Flyen" 
        description="Learn about Flyen shipping timelines, pan-India courier delivery, protective packaging, and order tracking."
      />
      <SupportLayout
        badge="DISPATCH & LOGISTICS"
        title={pageData?.title || "Shipping and Delivery"}
        description="Complete guidelines regarding order processing times, courier transit schedules, packaging standards, and pan-India shipping."
        version={pageData?.version || "1.2.0"}
        lastUpdated={formatDate(pageData?.updated_at)}
      >
        {isLoading ? (
          <div className="flyen-support-loading">Loading shipping policy details...</div>
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
                <div className="flyen-support-metric-value">24–48 Hrs</div>
                <div className="flyen-support-metric-label">In-Stock Dispatch</div>
              </div>
              <div className="flyen-support-metric-card">
                <div className="flyen-support-metric-value">2–4 Days</div>
                <div className="flyen-support-metric-label">Custom 3D Printing</div>
              </div>
              <div className="flyen-support-metric-card">
                <div className="flyen-support-metric-value">₹999+</div>
                <div className="flyen-support-metric-label">Free Shipping Tier</div>
              </div>
              <div className="flyen-support-metric-card">
                <div className="flyen-support-metric-value">Pan-India</div>
                <div className="flyen-support-metric-label">Express Coverage</div>
              </div>
            </div>

            {/* Section 1 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">1. Order Processing & Manufacturing Schedules</h2>
              <p>
                At Flyen, every product is handled with precision engineering standards. Depending on the product category ordered, processing timelines vary:
              </p>
              <ul className="flyen-support-list">
                <li>
                  <strong>Standard In-Stock Components & Kits:</strong> Dispatched within <strong>24 to 48 business hours</strong> following payment verification.
                </li>
                <li>
                  <strong>Custom 3D Prints & Prototyping:</strong> Require <strong>2 to 4 business days</strong> for slicing review, print farm scheduling, post-curing/support removal, and dimensional tolerance checks.
                </li>
                <li>
                  <strong>Bulk & Academic Hardware Packages:</strong> Lead times are confirmed during quotation and typically range between <strong>3 to 7 business days</strong> depending on batch size.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">2. Shipping Coverage & Courier Partners</h2>
              <p>
                We deliver to all serviceable pincodes across India. Our primary logistics partners include:
              </p>
              <div className="flyen-support-couriers-box">
                <span className="flyen-support-courier-tag">Delhivery Express</span>
                <span className="flyen-support-courier-tag">Blue Dart</span>
                <span className="flyen-support-courier-tag">DTDC Surface & Air</span>
                <span className="flyen-support-courier-tag">India Post Speed Post</span>
              </div>
              <p>
                All consignments are registered with real-time tracking IDs.
              </p>
            </section>

            {/* Section 3 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">3. Estimated Transit Times</h2>
              <div className="flyen-support-table-wrap">
                <table className="flyen-support-table">
                  <thead>
                    <tr>
                      <th>Destination Zone</th>
                      <th>Transit Duration</th>
                      <th>Delivery Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Metro Cities (Bengaluru, Chennai, Mumbai, Delhi, Hyderabad, Kolkata)</td>
                      <td>2 to 3 Business Days</td>
                      <td>Air Express</td>
                    </tr>
                    <tr>
                      <td>Tier 2 & Tier 3 Regional Cities</td>
                      <td>3 to 5 Business Days</td>
                      <td>Priority Express</td>
                    </tr>
                    <tr>
                      <td>Rural Areas, Northeastern States, J&K, Island Regions</td>
                      <td>5 to 8 Business Days</td>
                      <td>Speed Post / Surface</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">4. Industrial-Grade Protective Packaging</h2>
              <p>
                We understand the sensitivity of electronic components and delicate 3D-printed geometries. Every consignment adheres to strict packaging protocols:
              </p>
              <ul className="flyen-support-list">
                <li>
                  <strong>Electrostatic Discharge (ESD) Protection:</strong> All microcontrollers, sensors, and IC boards are sealed in anti-static shielding bags.
                </li>
                <li>
                  <strong>Shock Absorption & Multi-Layer Cushioning:</strong> 3D printed models and fragile assemblies are encapsulated in high-density bubble wrap and corner foam.
                </li>
                <li>
                  <strong>Rigid Outer Cartons:</strong> Heavy-duty corrugated boxes sealed with tamper-evident security tape ensure structural integrity during transit.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">5. Real-Time Tracking & Notifications</h2>
              <p>
                As soon as your shipment is handed over to the courier partner, an automated confirmation is dispatched via <strong>Email, SMS, and WhatsApp</strong> containing your tracking URL and AWB number.
              </p>
            </section>

            {/* Section 6 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">6. Damaged or Delayed Shipments</h2>
              <p>
                While transit disruptions are rare, your order is fully protected:
              </p>
              <div className="flyen-support-alert-box">
                <strong>Important Notice:</strong> If your package arrives damaged or tampered with, please take clear unboxing photographs or a short video and notify our support team within <strong>48 hours of delivery</strong>. We will immediately expedite a free replacement without delay.
              </div>
            </section>

          </article>
        )}
      </SupportLayout>
    </>
  );
};
