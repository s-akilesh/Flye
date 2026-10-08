import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLegalPage } from '../hooks/useLegalPage.js';
import { SupportLayout } from '../components/SupportLayout.jsx';
import { SEO } from '../../../shared/seo/SEO.jsx';
import { PageType } from '../../../shared/seo/constants/pageTypes.js';
import { generateSEO } from '../../../shared/seo/generateSEO.js';
import { trackEvent } from '../../../shared/analytics/analytics.js';
import { sanitizeHtml } from '../../../shared/utils/security.js';
import { ROUTES } from '../../../shared/constants/routes.js';

export const CustomBulkEnquiries = () => {
  const navigate = useNavigate();
  const { pageData, isLoading, fetchPage } = useLegalPage();
  const seoProps = generateSEO(PageType.CONTACT);

  useEffect(() => {
    fetchPage('custom_bulk_enquiries', false);
    trackEvent('custom_bulk_enquiries_viewed');
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
        title="Custom Printing & Bulk Enquiries | Flyen" 
        description="Explore volume manufacturing discounts, institutional project kit procurement, B2B turnkey prototyping, and rapid quotation with Flyen."
      />
      <SupportLayout
        badge="INSTITUTIONAL & VOLUME ORDERS"
        title={pageData?.title || "Custom Printing and Bulk Enquiries"}
        description="Comprehensive volume 3D printing, institutional hardware kit supply, batch manufacturing services, and corporate procurement."
        version={pageData?.version || "1.0.0"}
        lastUpdated={formatDate(pageData?.updated_at)}
      >
        {isLoading ? (
          <div className="flyen-support-loading">Loading bulk enquiry details...</div>
        ) : pageData?.content ? (
          <article 
            className="rich-text-content"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(pageData.content) }}
          />
        ) : (
          <article className="flyen-support-article">
            {/* Section 1 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">1. Educational & Academic Institution Procurement</h2>
              <p>
                Flyen is a trusted hardware partner for engineering institutions, university research labs, robotics clubs, and hackathon teams across India:
              </p>
              <ul className="flyen-support-list">
                <li>
                  <strong>Bulk Student Project Kits:</strong> Pre-flashed microcontrollers, calibrated sensor bundles, and turnkey schematics for capstone batches.
                </li>
                <li>
                  <strong>Classroom & Laboratory Bundles:</strong> Custom-tailored hardware packages matching your exact syllabus with comprehensive teaching documentation.
                </li>
                <li>
                  <strong>Dedicated Academic Pricing:</strong> Special discounted pricing matrices for accredited colleges and registered student innovators.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">2. Batch 3D Manufacturing Farm Capabilities</h2>
              <p>
                Our high-capacity printing farm supports production runs of <strong>10 to 500+ units</strong> with strict quality uniformity:
              </p>
              <div className="flyen-support-table-wrap">
                <table className="flyen-support-table">
                  <thead>
                    <tr>
                      <th>Quantity Tier</th>
                      <th>Expected Lead Time</th>
                      <th>Per-Unit Advantage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>10 – 49 Units</td>
                      <td>3 to 5 Business Days</td>
                      <td>Volume Discount Tier 1</td>
                    </tr>
                    <tr>
                      <td>50 – 199 Units</td>
                      <td>5 to 8 Business Days</td>
                      <td>Volume Discount Tier 2 + Dedicated Print Farm Slot</td>
                    </tr>
                    <tr>
                      <td>200+ Units</td>
                      <td>Custom Batch Schedule</td>
                      <td>Maximum Discount + Golden Sample Validation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3 */}
            <section className="flyen-support-section">
              <h2 className="flyen-support-section-title">3. Turnkey Prototyping & Custom Integration</h2>
              <p>
                Beyond 3D printing, we offer complete turnkey electronic design and manufacturing assistance:
              </p>
              <ul className="flyen-support-list">
                <li>Custom 3D CAD enclosure design tailored to your exact PCB mounting holes.</li>
                <li>Pre-assembly, custom cable harnessing, and terminal soldering.</li>
                <li>Firmware flashing, initial diagnostics testing, and quality batch checklist reports.</li>
              </ul>
            </section>

            {/* Section 4: Callout CTA Box */}
            <div className="flyen-support-cta-box">
              <div className="flyen-support-cta-content">
                <h3 className="flyen-support-cta-title">Ready to Request a Custom or Bulk Quote?</h3>
                <p className="flyen-support-cta-sub">
                  Submit your Bill of Materials (BOM), CAD files, or quantity requirements directly to our engineering desk for a formal quote within 24 hours.
                </p>
              </div>
              <div className="flyen-support-cta-actions">
                <button
                  type="button"
                  className="flyen-btn-teal"
                  onClick={() => navigate(ROUTES.CONTACT)}
                >
                  Submit Bulk Enquiry
                </button>
              </div>
            </div>

          </article>
        )}
      </SupportLayout>
    </>
  );
};
