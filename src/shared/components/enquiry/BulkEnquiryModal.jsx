import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useEnquiries } from '../../../modules/enquiries/hooks/useEnquiries';
import { useAuth } from '../../../modules/auth/context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { eventTracker } from '../../analytics';

const ENQUIRY_CATEGORIES = [
  'Custom 3D Printing & Prototyping',
  'Bulk Student Project Kits',
  'Custom Electronics & IoT Hardware',
  'Corporate & Institutional Orders'
];

export const BulkEnquiryModal = ({ isOpen, onClose, defaultCategory }) => {
  const { addEnquiry, isProcessing } = useEnquiries();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [contactPrefix, setContactPrefix] = useState('+91');
  const [contactNumber, setContactNumber] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [category, setCategory] = useState(defaultCategory || ENQUIRY_CATEGORIES[0]);
  const [quantity, setQuantity] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetForm = () => {
    setCustomerName(user?.name || '');
    setContactPrefix('+91');
    setContactNumber(user?.phone || '');
    setEmail(user?.email || '');
    setCategory(defaultCategory || ENQUIRY_CATEGORIES[0]);
    setQuantity('');
    setEstimatedBudget('');
    setTargetDate('');
    setSpecifications('');
    setFormErrors({});
    setIsSubmitted(false);
  };

  const handleClose = () => {
    if (isProcessing) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const newErrors = {};

    if (!customerName.trim()) newErrors.customerName = true;

    const isPhoneValid = contactPrefix === '+91'
      ? contactNumber.replace(/\D/g, '').length === 10
      : (contactNumber.replace(/\D/g, '').length >= 7 && contactNumber.replace(/\D/g, '').length <= 15);

    if (!isPhoneValid) newErrors.contactNumber = true;
    if (!specifications.trim()) newErrors.specifications = true;

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      showToast('Please fill in the required fields (*)', 'error');
      return;
    }

    setFormErrors({});

    const formattedMobile = `${contactPrefix}${contactNumber.replace(/\D/g, '')}`;

    const notesSummary = [
      `Enquiry Type: ${category}`,
      quantity.trim() ? `Batch Quantity: ${quantity.trim()}` : '',
      estimatedBudget.trim() ? `Estimated Budget: ₹${estimatedBudget.trim()}` : '',
      targetDate ? `Target Delivery Date: ${targetDate}` : '',
      email.trim() ? `Email: ${email.trim()}` : '',
      `Specifications & Notes:\n${specifications.trim()}`
    ].filter(Boolean).join('\n');

    try {
      await addEnquiry({
        name: customerName.trim(),
        mobile: formattedMobile,
        email: email.trim(),
        projectTitle: `${category} (Bulk / Custom)`,
        price: estimatedBudget ? estimatedBudget.replace(/\D/g, '') : '',
        notes: notesSummary,
        status: 'Pending',
        userId: user?.id || null
      });

      eventTracker.trackContactSubmission('bulk_enquiry_modal');
      setIsSubmitted(true);
      showToast('Enquiry submitted successfully! Our team will contact you soon.', 'success');
    } catch (err) {
      console.error('[BulkEnquiryModal] Error submitting enquiry:', err);
      showToast('Failed to submit enquiry. Please try again.', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="modal-content purple"
      style={{
        maxWidth: '560px',
        width: '92%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden'
      }}
    >
      {!isSubmitted ? (
        <>
          {/* Header */}
          <div
            style={{
              padding: '20px 24px 16px 24px',
              background: 'var(--sys-surface-elevated, #1a202c)',
              borderBottom: '1px solid var(--sys-divider, rgba(255, 255, 255, 0.1))',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-icons" style={{ color: 'var(--flyen-teal, #00dfa2)', fontSize: '20px' }}>
                  inventory_2
                </span>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--txt-primary, #ffffff)', letterSpacing: '0.5px' }}>
                  BULK ENQUIRY & CUSTOM PRODUCTS
                </h4>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--txt-muted, #94a3b8)', margin: '4px 0 0 0' }}>
                Get volume pricing, institutional quotes, or custom 3D printing fabrication
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isProcessing}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--txt-muted, #94a3b8)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <span className="material-icons" style={{ fontSize: '20px' }}>close</span>
            </button>
          </div>

          {/* Form Content */}
          <form
            onSubmit={handleSubmit}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Category Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--txt-secondary, #cbd5e1)', marginBottom: '8px', fontWeight: '700' }}>
                What are you looking for? *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {ENQUIRY_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: '600',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: category === cat ? 'rgba(0, 223, 162, 0.12)' : 'var(--interaction-hover, rgba(255, 255, 255, 0.04))',
                      border: category === cat ? '1px solid var(--flyen-teal, #00dfa2)' : '1px solid var(--sys-border, rgba(255, 255, 255, 0.08))',
                      color: category === cat ? 'var(--flyen-teal, #00dfa2)' : 'var(--txt-secondary, #cbd5e1)'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Contact Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--txt-secondary, #cbd5e1)', marginBottom: '6px', fontWeight: '700' }}>
                  Your Full Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    borderColor: formErrors.customerName ? 'var(--status-error, #ef4444)' : undefined
                  }}
                />
                {formErrors.customerName && (
                  <span style={{ fontSize: '10.5px', color: '#ef4444', marginTop: '2px', display: 'block' }}>
                    Full name is required
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--txt-secondary, #cbd5e1)', marginBottom: '6px', fontWeight: '700' }}>
                  Mobile Number (WhatsApp) *
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <select
                    value={contactPrefix}
                    onChange={(e) => setContactPrefix(e.target.value)}
                    className="form-select"
                    style={{ width: '75px', height: '38px', fontSize: '12.5px', padding: '0 6px' }}
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+971">+971</option>
                    <option value="+65">+65</option>
                  </select>
                  <Input
                    type="tel"
                    placeholder="10-digit number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ''))}
                    maxLength={15}
                    style={{
                      flex: 1,
                      height: '38px',
                      borderColor: formErrors.contactNumber ? 'var(--status-error, #ef4444)' : undefined
                    }}
                  />
                </div>
                {formErrors.contactNumber && (
                  <span style={{ fontSize: '10.5px', color: '#ef4444', marginTop: '2px', display: 'block' }}>
                    Valid contact number is required
                  </span>
                )}
              </div>
            </div>

            {/* Email & Quantity Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--txt-secondary, #cbd5e1)', marginBottom: '6px', fontWeight: '700' }}>
                  Email Address <span style={{ color: 'var(--txt-muted, #94a3b8)', fontWeight: '400' }}>(Optional)</span>
                </label>
                <Input
                  type="email"
                  placeholder="name@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', height: '38px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--txt-secondary, #cbd5e1)', marginBottom: '6px', fontWeight: '700' }}>
                  Estimated Quantity / Batch Size <span style={{ color: 'var(--txt-muted, #94a3b8)', fontWeight: '400' }}>(Optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 25 units / 1 prototype"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{ width: '100%', height: '38px' }}
                />
              </div>
            </div>

            {/* Budget & Target Date Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--txt-secondary, #cbd5e1)', marginBottom: '6px', fontWeight: '700' }}>
                  Target Budget (₹) <span style={{ color: 'var(--txt-muted, #94a3b8)', fontWeight: '400' }}>(Optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 15000"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value.replace(/\D/g, ''))}
                  style={{ width: '100%', height: '38px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--txt-secondary, #cbd5e1)', marginBottom: '6px', fontWeight: '700' }}>
                  Required By Date <span style={{ color: 'var(--txt-muted, #94a3b8)', fontWeight: '400' }}>(Optional)</span>
                </label>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                  style={{ width: '100%', height: '38px', colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Requirements & Remarks */}
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--txt-secondary, #cbd5e1)', marginBottom: '6px', fontWeight: '700' }}>
                Project Specifications & Requirements *
              </label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Describe your design, 3D printing material/infill, electronics components required, dimensions, CAD / Google Drive links..."
                value={specifications}
                onChange={(e) => setSpecifications(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  background: 'var(--input-bg, #0d1117)',
                  border: formErrors.specifications ? '1px solid var(--status-error, #ef4444)' : '1px solid var(--input-border, rgba(255, 255, 255, 0.12))',
                  borderRadius: '6px',
                  color: 'var(--txt-primary, #ffffff)',
                  padding: '10px 12px',
                  fontSize: '12.5px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
              {formErrors.specifications && (
                <span style={{ fontSize: '10.5px', color: '#ef4444', marginTop: '2px', display: 'block' }}>
                  Please describe your project requirements
                </span>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <Button variant="secondary" type="button" onClick={handleClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isProcessing} style={{ minWidth: '150px' }}>
                {isProcessing ? 'Submitting...' : 'Submit Enquiry'}
              </Button>
            </div>
          </form>
        </>
      ) : (
        /* Confirmation State */
        <div style={{ padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(0, 223, 162, 0.15)',
              color: 'var(--flyen-teal, #00dfa2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              border: '1px solid rgba(0, 223, 162, 0.3)'
            }}
          >
            <span className="material-icons" style={{ fontSize: '36px' }}>check_circle</span>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--txt-primary, #ffffff)', margin: '0 0 8px 0' }}>
            ENQUIRY RECEIVED
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--txt-muted, #94a3b8)', margin: '0 0 20px 0', maxWidth: '380px', lineHeight: 1.5 }}>
            Thank you <strong style={{ color: 'var(--txt-primary, #ffffff)' }}>{customerName}</strong>. Our engineering mentors will review your technical requirements and contact you via WhatsApp / Phone shortly.
          </p>

          <div
            style={{
              width: '100%',
              background: 'var(--interaction-hover, rgba(255, 255, 255, 0.04))',
              border: '1px solid var(--sys-border, rgba(255, 255, 255, 0.08))',
              borderRadius: '8px',
              padding: '14px 16px',
              marginBottom: '24px',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--txt-muted, #94a3b8)' }}>Category:</span>
              <span style={{ color: 'var(--txt-primary, #ffffff)', fontWeight: '600' }}>{category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--txt-muted, #94a3b8)' }}>Contact Number:</span>
              <span style={{ color: 'var(--txt-primary, #ffffff)', fontWeight: '600' }}>{contactPrefix} {contactNumber}</span>
            </div>
            {quantity && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--txt-muted, #94a3b8)' }}>Batch Size:</span>
                <span style={{ color: 'var(--txt-primary, #ffffff)', fontWeight: '600' }}>{quantity}</span>
              </div>
            )}
            {estimatedBudget && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--txt-muted, #94a3b8)' }}>Target Budget:</span>
                <span style={{ color: 'var(--flyen-teal, #00dfa2)', fontWeight: '700' }}>₹{estimatedBudget}</span>
              </div>
            )}
          </div>

          <Button variant="primary" onClick={handleClose} style={{ minWidth: '140px' }}>
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
};
