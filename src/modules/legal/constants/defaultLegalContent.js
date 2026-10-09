/**
 * Default Content and Structured Configurations for Legal and Support Pages.
 * Used for initial seeding, admin editor pre-population, and seamless public fallbacks.
 */
export const DEFAULT_LEGAL_CONFIGS = {
  privacy_policy: {
    page_key: 'privacy_policy',
    title: 'Privacy Policy',
    version: '1.0.0',
    published: true,
    content: `
      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">1. Information We Collect</h2>
        <p>To provide high-quality engineering services, customized hardware builds, and 3D printing orders, we collect the following categories of information:</p>
        <ul class="flyen-support-list">
          <li><strong>Account & Contact Data:</strong> Full name, verified email address, mobile number, and delivery shipping coordinates.</li>
          <li><strong>Technical Order Assets:</strong> 3D CAD models (.STL, .STEP, .OBJ), custom project specifications, and bill of materials (BOM) submitted for quotations.</li>
          <li><strong>Transactional Records:</strong> Payment transaction references, tax invoicing particulars, and order histories (processed through secure RBI-compliant payment gateways).</li>
        </ul>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">2. How We Protect & Use Your Data</h2>
        <p>Your information is used strictly to fulfill manufacturing orders, dispatch shipments, send automated tracking alerts, and provide responsive technical assistance. We never sell or monetize your personal information to marketing brokers.</p>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">3. Proprietary Design Confidentiality</h2>
        <p>All 3D design files and project schematics uploaded to the Flyen platform are treated as confidential intellectual property. Access is restricted exclusively to production engineers executing your order.</p>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">4. Cookies & Session Management</h2>
        <p>We use strictly necessary session cookies to maintain your authenticated login state, cart contents, and theme preferences. You may adjust browser cookie settings at any time.</p>
      </section>
    `.trim()
  },

  terms_conditions: {
    page_key: 'terms_conditions',
    title: 'Terms & Conditions',
    version: '1.0.0',
    published: true,
    content: `
      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">1. Acceptance of Terms</h2>
        <p>By accessing Flyen or placing an order for hardware project kits, standard 3D printed components, or custom manufacturing services, you agree to be bound by these Terms and Conditions.</p>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">2. Product Specifications & Accuracy</h2>
        <p>We strive to display electronic component descriptions, pin diagrams, and 3D print specifications with maximum technical precision. Given the nature of electronic prototyping, slight component batch variations may occur while maintaining identical functional performance.</p>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">3. User Conduct & Prohibited Designs</h2>
        <p>Users agree not to submit 3D models or project requests involving restricted weapons, harmful implements, or designs infringing on third-party patents or copyrights.</p>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">4. Limitation of Liability</h2>
        <p>Flyen provides project kits and prototyping components for educational, experimental, and prototype engineering purposes. Flyen is not liable for indirect or consequential damages arising from improper circuit wiring, reverse voltage application, or user modifications.</p>
      </section>
    `.trim()
  },

  shipping_delivery: {
    page_key: 'shipping_delivery',
    title: 'Shipping and Delivery',
    version: '1.0.0',
    published: true,
    content: `
      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">1. Order Processing & Manufacturing Schedules</h2>
        <p>At Flyen, every product is handled with precision engineering standards. Depending on the product category ordered, processing timelines vary:</p>
        <ul class="flyen-support-list">
          <li><strong>Standard In-Stock Components & Kits:</strong> Dispatched within <strong>24 to 48 business hours</strong> following payment verification.</li>
          <li><strong>Custom 3D Prints & Prototyping:</strong> Require <strong>2 to 4 business days</strong> for slicing review, print farm scheduling, post-curing/support removal, and dimensional tolerance checks.</li>
          <li><strong>Bulk & Academic Hardware Packages:</strong> Lead times are confirmed during quotation and typically range between <strong>3 to 7 business days</strong> depending on batch size.</li>
        </ul>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">2. Shipping Coverage & Courier Partners</h2>
        <p>We deliver to all serviceable pincodes across India. Our primary logistics partners include:</p>
        <div class="flyen-support-couriers-box">
          <span class="flyen-support-courier-tag">Delhivery Express</span>
          <span class="flyen-support-courier-tag">Blue Dart</span>
          <span class="flyen-support-courier-tag">DTDC Surface & Air</span>
          <span class="flyen-support-courier-tag">India Post Speed Post</span>
        </div>
        <p>All consignments are registered with real-time tracking IDs.</p>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">3. Estimated Transit Times</h2>
        <div class="flyen-support-table-wrap">
          <table class="flyen-support-table">
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

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">4. Industrial-Grade Protective Packaging</h2>
        <p>We understand the sensitivity of electronic components and delicate 3D-printed geometries. Every consignment adheres to strict packaging protocols:</p>
        <ul class="flyen-support-list">
          <li><strong>Electrostatic Discharge (ESD) Protection:</strong> All microcontrollers, sensors, and IC boards are sealed in anti-static shielding bags.</li>
          <li><strong>Shock Absorption & Multi-Layer Cushioning:</strong> 3D printed models and fragile assemblies are encapsulated in high-density bubble wrap and corner foam.</li>
          <li><strong>Rigid Outer Cartons:</strong> Heavy-duty corrugated boxes sealed with tamper-evident security tape ensure structural integrity during transit.</li>
        </ul>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">5. Real-Time Tracking & Notifications</h2>
        <p>As soon as your shipment is handed over to the courier partner, an automated confirmation is dispatched via <strong>Email, SMS, and WhatsApp</strong> containing your tracking URL and AWB number.</p>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">6. Damaged or Delayed Shipments</h2>
        <p>While transit disruptions are rare, your order is fully protected:</p>
        <div class="flyen-support-alert-box">
          <strong>Important Notice:</strong> If your package arrives damaged or tampered with, please take clear unboxing photographs or a short video and notify our support team within <strong>48 hours of delivery</strong>. We will immediately expedite a free replacement without delay.
        </div>
      </section>
    `.trim()
  },

  returns_cancellations: {
    page_key: 'returns_cancellations',
    title: 'Returns and Cancellations',
    version: '1.0.0',
    published: true,
    content: `
      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">1. 7-Day Replacement Guarantee</h2>
        <p>We stand firmly behind the quality of our products. A free 1-to-1 replacement is provided within <strong>7 calendar days of delivery</strong> under the following circumstances:</p>
        <ul class="flyen-support-list">
          <li><strong>Dead on Arrival (DOA) / Defective Electronics:</strong> Sensors, microcontrollers, or power modules that fail initial diagnostics under standard operating voltage.</li>
          <li><strong>Missing Kit Components:</strong> Any sensor, jumper wire, or PCB listed in the project schematic manifest that is absent from your delivered parcel.</li>
          <li><strong>Transit Damage:</strong> Mechanical deformities, cracks, or broken connector pins sustained during delivery.</li>
        </ul>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">2. Step-by-Step Replacement Claim Process</h2>
        <ol class="flyen-support-steps-list">
          <li><strong>Submit a Claim:</strong> Contact support at <code>support@flyen.in</code> or message our official WhatsApp support channel with your <strong>Order ID</strong>.</li>
          <li><strong>Provide Diagnostic Media:</strong> Share a brief description alongside clear photographs or a short video demonstrating the defect or broken component.</li>
          <li><strong>Engineering Verification:</strong> Our technical team will review the issue within <strong>24 business hours</strong> and approve a replacement.</li>
          <li><strong>Dispatch:</strong> The replacement unit is dispatched via priority air courier at zero additional cost to you.</li>
        </ol>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">3. Order Cancellation Policy</h2>
        <p>We provide full flexibility prior to physical dispatch:</p>
        <ul class="flyen-support-list">
          <li><strong>Standard In-Stock Products:</strong> You may cancel standard orders anytime <strong>before courier pickup and AWB dispatch</strong> for an immediate 100% full refund.</li>
          <li><strong>Custom 3D Printing & Bespoke Fabrications:</strong> Cancellations are permitted <strong>only prior to machine slicing and print initiation</strong>. Once a 3D printer has commenced running resin or filament for your custom geometry, cancellations cannot be processed.</li>
        </ul>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">4. Non-Returnable & Non-Refundable Items</h2>
        <div class="flyen-support-alert-box">
          The following categories are non-returnable:
          <ul style="margin: 8px 0 0 16px; padding: 0;">
            <li>Custom 3D prints fabricated strictly according to customer-supplied CAD files.</li>
            <li>Digital downloads, circuit schematic files, and downloadable firmware code packages.</li>
            <li>Electronic components that have been subjected to electrical over-voltage, reverse polarity, or physical soldering damage by the user.</li>
          </ul>
        </div>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">5. Refund Processing & Timelines</h2>
        <p>Approved refunds are initiated immediately by our billing desk and credited back to the original payment source (Credit/Debit Card, UPI, or Net Banking) within <strong>5 to 7 business days</strong>.</p>
      </section>
    `.trim()
  },

  personalised_order_policy: {
    page_key: 'personalised_order_policy',
    title: 'Personalised-Order Policy',
    version: '1.0.0',
    published: true,
    content: `
      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">1. CAD File Submissions & Supported Formats</h2>
        <p>To maintain high dimensional accuracy and eliminate slicing errors, we accept the following industrial standard 3D asset formats:</p>
        <ul class="flyen-support-list">
          <li><code>.STL</code> (Standard Triangle Language – Binary or ASCII)</li>
          <li><code>.STEP / .STP</code> (Standard for Exchange of Product Model Data)</li>
          <li><code>.OBJ</code> (Wavefront 3D Object format with mesh topology)</li>
          <li><code>.3MF</code> (3D Manufacturing Format with embedded metadata)</li>
        </ul>
        <p>Prior to queuing, our engineers review overhangs, minimum wall thicknesses (recommended &ge; 1.2mm for FDM, &ge; 0.8mm for SLA), and structural load points.</p>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">2. Dimensional Tolerances & Surface Characteristics</h2>
        <p>Additive manufacturing produces layer-by-layer structures with distinct material physical properties:</p>
        <div class="flyen-support-table-wrap">
          <table class="flyen-support-table">
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
        <p style="font-size: 13px; color: var(--txt-secondary); margin-top: 8px;">
          <em>Note: Minor surface layer lines and support interface marks are characteristic of 3D printing and do not constitute manufacturing defects.</em>
        </p>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">3. Production Initiation & Non-Cancellable Policy</h2>
        <div class="flyen-support-alert-box">
          <strong>Bespoke Manufacturing Clause:</strong> Custom parts are tailored uniquely to your specific geometry, infill density, and material choice. Once your order has progressed to slicing and machine execution, the order is <strong>strictly non-cancellable, non-returnable, and non-refundable</strong>, except in instances of demonstrable dimensional error exceeding our specified tolerances.
        </div>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">4. Intellectual Property & Complete Confidentiality</h2>
        <p>We recognize that your designs, inventions, and research models represent valuable intellectual property:</p>
        <ul class="flyen-support-list">
          <li><strong>100% Customer Ownership:</strong> All uploaded CAD assets, design files, and proprietary project codes remain strictly your property.</li>
          <li><strong>Non-Disclosure Guarantee:</strong> We never share, sell, or distribute your CAD files to third parties. Files are securely archived solely for re-print validation or deleted upon request.</li>
        </ul>
      </section>
    `.trim()
  },

  custom_bulk_enquiries: {
    page_key: 'custom_bulk_enquiries',
    title: 'Custom Printing and Bulk Enquiries',
    version: '1.0.0',
    published: true,
    content: `
      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">1. Educational & Academic Institution Procurement</h2>
        <p>Flyen is a trusted hardware partner for engineering institutions, university research labs, robotics clubs, and hackathon teams across India:</p>
        <ul class="flyen-support-list">
          <li><strong>Bulk Student Project Kits:</strong> Pre-flashed microcontrollers, calibrated sensor bundles, and turnkey schematics for capstone batches.</li>
          <li><strong>Classroom & Laboratory Bundles:</strong> Custom-tailored hardware packages matching your exact syllabus with comprehensive teaching documentation.</li>
          <li><strong>Dedicated Academic Pricing:</strong> Special discounted pricing matrices for accredited colleges and registered student innovators.</li>
        </ul>
      </section>

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">2. Batch 3D Manufacturing Farm Capabilities</h2>
        <p>Our high-capacity printing farm supports production runs of <strong>10 to 500+ units</strong> with strict quality uniformity:</p>
        <div class="flyen-support-table-wrap">
          <table class="flyen-support-table">
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

      <section class="flyen-support-section">
        <h2 class="flyen-support-section-title">3. Turnkey Prototyping & Custom Integration</h2>
        <p>Beyond 3D printing, we offer complete turnkey electronic design and manufacturing assistance:</p>
        <ul class="flyen-support-list">
          <li>Custom 3D CAD enclosure design tailored to your exact PCB mounting holes.</li>
          <li>Pre-assembly, custom cable harnessing, and terminal soldering.</li>
          <li>Firmware flashing, initial diagnostics testing, and quality batch checklist reports.</li>
        </ul>
      </section>

      <div class="flyen-support-cta-box">
        <div class="flyen-support-cta-content">
          <h3 class="flyen-support-cta-title">Ready to Request a Custom or Bulk Quote?</h3>
          <p class="flyen-support-cta-sub">Submit your Bill of Materials (BOM), CAD files, or quantity requirements directly to our engineering desk for a formal quote within 24 hours.</p>
        </div>
        <div class="flyen-support-cta-actions">
          <a href="/contact" class="flyen-btn-teal" style="display: inline-flex; align-items: center; text-decoration: none;">Submit Bulk Enquiry</a>
        </div>
      </div>
    `.trim()
  }
};
