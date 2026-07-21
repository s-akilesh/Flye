import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { Modal } from '../../../shared/components/ui/Modal';
import { ROUTES } from '../../../shared/constants/routes';
import { useToast } from '../../../shared/context/ToastContext';
import { masterDataService } from '../../../shared/services/masterDataService';
import { contactService } from '../../contact/services/contactService';
import { printingInventoryService } from '../../printing-inventory/services/printingInventoryService';
import { useEnquiries } from '../../enquiries/hooks/useEnquiries';

export const PrintingProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  // Gallery active index
  const [activeIndex, setActiveIndex] = useState(0);

  // Master data labels
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);

  // Quote modal state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const { addEnquiry, isProcessing } = useEnquiries();

  const [formErrors, setFormErrors] = useState({});
  const [requestorName, setRequestorName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contactPrefix, setContactPrefix] = useState('+91');
  const [orderStep, setOrderStep] = useState('input'); // 'input' | 'confirmed'
  const [projectStatus, setProjectStatus] = useState('3d Printing');
  const [customProjectTitle, setCustomProjectTitle] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [needDocument, setNeedDocument] = useState('No');
  const [needPresentation, setNeedPresentation] = useState('No');
  const [projectRemarks, setProjectRemarks] = useState('');

  const openQuoteModal = () => {
    setRequestorName('');
    setContactNumber('');
    setContactPrefix('+91');
    setFormErrors({});
    setProjectStatus('3d Printing');
    setCustomProjectTitle(product ? product.name : '');
    setProjectBudget('');
    setSubmissionDate('');
    setNeedDocument('No');
    setNeedPresentation('No');
    setProjectRemarks('');
    setOrderStep('input');
    setIsQuoteModalOpen(true);
  };

  const loadProductData = async () => {
    setIsLoading(true);
    try {
      const data = await printingInventoryService.getProductById(id);
      
      // If product is draft or inactive, redirect to catalog unless user is admin
      // (For this stage, we assume it has select RLS but we follow the visibility rule on public catalog)
      if (data.visibility === 'Draft') {
        showToast("⚠️ This product draft is currently not publicly visible.", "warning");
        navigate(ROUTES.PRINTING);
        return;
      }

      setProduct(data);
      setActiveIndex(0);

      // Load Master Data
      const cats = await masterDataService.getValues('3d_print_category');
      setCategories(cats);

      const mats = await masterDataService.getValues('3d_print_material');
      setMaterials(mats);

      // Load published related products
      const allPub = await printingInventoryService.getPublishedProducts();
      const related = allPub
        .filter(p => p.category === data.category && p.id !== data.id)
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (err) {
      console.error(err);
      showToast("❌ Product not found or unavailable.", "error");
      navigate(ROUTES.PRINTING);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProductData();
  }, [id]);

  const getLabelForValue = (list, val) => {
    const item = list.find(x => x.key === val || x.value === val);
    return item ? item.value : val;
  };

  // Submit quote request
  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      showToast("❌ Please fill in all required fields.", "error");
      return;
    }

    setIsSubmittingQuote(true);
    try {
      const payload = {
        name: clientName.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        message: clientMessage.trim() || `Interested in obtaining a quote for product: ${product.name} (SKU: ${product.sku}).`,
        subject: `Quote Request: ${product.name}`,
        category: '3d_printing'
      };

      await contactService.create(payload);
      showToast("🚀 Quote request submitted successfully! We will contact you soon.", "success");
      
      // Clear fields and close modal
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setClientMessage('');
      setIsQuoteModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to submit quote request. Please try again.", "error");
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          paddingTop: '73px',
          height: 'calc(100vh - 73px)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--sys-bg)',
          overflow: 'hidden'
        }}
      >
        <div
          className="portal-header"
          style={{
            width: 'auto',
            paddingLeft: 'var(--page-padding)',
            paddingRight: 'var(--page-padding)',
            paddingTop: '16px',
            paddingBottom: '16px',
            background: 'var(--sys-page-header-bg)',
            borderBottom: '1px solid var(--sys-divider)',
            marginBottom: 'var(--space-6)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Button variant="secondary" style={{ padding: '8px', minWidth: 'auto', visibility: 'hidden' }}>
              <span className="material-icons" style={{ fontSize: '20px' }}>arrow_back</span>
            </Button>
            <div className="portal-title-area">
              <Skeleton style={{ width: '120px', height: '24px' }} />
            </div>
          </div>
        </div>
        <div style={{ padding: '0 var(--page-padding) var(--page-padding)', display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box', flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <Skeleton style={{ width: '250px', height: '32px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <Skeleton style={{ height: '350px' }} />
            <Skeleton style={{ height: '350px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const activeImage = product.images && product.images.length > 0
    ? product.images[activeIndex]?.image_url
    : '';

  return (
    <>
      <style>{`
        @media (min-width: 992px) {
          #printing-detail-portal {
            height: calc(100vh - 73px) !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
          }
          #printing-detail-portal .portal-header {
            flex-shrink: 0 !important;
            position: sticky !important;
            top: 0px !important;
            margin-bottom: var(--space-6) !important;
          }
          #printing-detail-portal .portal-content {
            flex: 1 !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            min-height: 0 !important;
          }
          .printing-detail-layout-custom {
            display: grid !important;
            grid-template-columns: 4fr 6fr !important;
            gap: 32px !important;
            flex: 1 !important;
            height: 100% !important;
            overflow: hidden !important;
            min-height: 0 !important;
          }
          .printing-detail-column-left-custom {
            display: flex !important;
            flex-direction: column !important;
            gap: 24px !important;
            height: 100% !important;
            overflow-y: auto !important;
          }
          .printing-detail-column-right-custom {
            display: flex !important;
            flex-direction: column !important;
            gap: 24px !important;
            height: 100% !important;
            overflow-y: auto !important;
            padding-right: 8px !important;
          }
        }
        @media (max-width: 991px) {
          .printing-detail-layout-custom {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .printing-detail-column-left-custom,
          .printing-detail-column-right-custom {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
        }
      `}</style>
      <div
        id="printing-detail-portal"
        style={{
          paddingTop: '73px',
          height: 'calc(100vh - 73px)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--sys-bg)',
          overflow: 'hidden'
        }}
      >
        {/* Sticky Header block */}
        <div
          className="portal-header"
          style={{
            width: 'auto',
            marginLeft: '0px',
            marginRight: '0px',
            paddingLeft: 'var(--page-padding)',
            paddingRight: 'var(--page-padding)',
            paddingTop: '16px',
            paddingBottom: '16px',
            position: 'sticky',
            top: '0px',
            zIndex: 90,
            background: 'var(--sys-page-header-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--sys-divider)',
            marginBottom: 'var(--space-6)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Button
              variant="secondary"
              className="btn-back"
              onClick={() => navigate(ROUTES.PRINTING)}
              style={{ padding: '8px', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span className="material-icons" style={{ fontSize: '20px' }}>arrow_back</span>
            </Button>
            <div className="portal-title-area">
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: 'var(--txt-primary)' }}>Product Details</h2>
            </div>
          </div>
        </div>

        {/* Content body wrapper */}
        <div
          className="portal-content"
          style={{
            maxWidth: '100%',
            width: '100%',
            paddingLeft: 'var(--page-padding)',
            paddingRight: 'var(--page-padding)',
            paddingBottom: 'var(--page-padding)',
            boxSizing: 'border-box',
            flex: 1,
            overflowY: 'auto',
            minHeight: 0
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', height: '100%' }}
          >
            <div className="printing-detail-layout-custom">
              {/* Left Column: Image Slider (40% width) */}
              <div className="printing-detail-column-left-custom">
                <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--sys-surface)', border: '1px solid var(--sys-border)', borderRadius: '12px' }}>
                  {activeImage ? (
                    <div style={{ width: '100%', aspectRatio: '1.2', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px', background: 'var(--sys-border)' }}>
                      <img
                        src={activeImage}
                        alt={product.name}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '1.2', background: 'var(--sys-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-icons-outlined" style={{ fontSize: '48px', color: 'var(--txt-muted)' }}>3d_rotation</span>
                    </div>
                  )}

                  {/* Slider Thumbnails */}
                  {product.images && product.images.length > 1 && (
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', width: '100%', marginTop: '16px', paddingBottom: '4px' }}>
                      {product.images.map((img, idx) => (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => setActiveIndex(idx)}
                          style={{
                            padding: 0,
                            border: idx === activeIndex ? '2px solid var(--brand-primary)' : '1px solid var(--sys-border)',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            width: '60px',
                            height: '60px',
                            minWidth: '60px',
                            cursor: 'pointer',
                            background: 'none'
                          }}
                        >
                          <img
                            src={img.image_url}
                            alt={`Thumbnail ${idx}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Right Column: Specification details stacked (60% width) */}
              <div className="printing-detail-column-right-custom">
                {/* Core Info */}
                <Card style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ borderBottom: '1px solid var(--sys-divider)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)' }}>{product.name}</h2>
                      <span style={{ fontSize: '12px', color: 'var(--txt-muted)' }}>SKU: {product.sku}</span>
                    </div>
                    
                    {/* Availability Badge */}
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      background: product.stock_quantity > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: product.stock_quantity > 0 ? 'var(--status-success)' : 'var(--status-danger)',
                      border: product.stock_quantity > 0 ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)'
                    }}>
                      {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Price Details */}
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Price</span>
                    {product.contact_for_price ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--brand-primary)' }}>Price Available on Request</span>
                        <span style={{ fontSize: '12px', color: 'var(--txt-muted)' }}>Contact us for details and customized bulk prototype discounts.</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--txt-primary)' }}>₹{product.price}</span>
                    )}
                  </div>

                  {/* CTA */}
                  <Button
                    variant="primary"
                    onClick={openQuoteModal}
                    style={{ height: '44px', fontWeight: '700', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <span className="material-icons-outlined" style={{ fontSize: '20px' }}>shopping_cart</span>
                    Buy Now
                  </Button>
                </Card>

                {/* Technical Specifications */}
                <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--txt-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--sys-divider)', paddingBottom: '8px' }}>
                    Technical Specifications
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--txt-muted)', display: 'block' }}>Material</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)' }}>{getLabelForValue(materials, product.material)}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--txt-muted)', display: 'block' }}>Color</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)' }}>{product.color || 'Standard'}</span>
                    </div>
                    {product.weight && (
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--txt-muted)', display: 'block' }}>Weight</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)' }}>{product.weight} grams</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--txt-muted)', display: 'block' }}>Dimensions</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)' }}>{product.dimensions}</span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Description */}
                {product.description && (
                  <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Description & utility</span>
                    <p style={{ fontSize: '13px', color: 'var(--txt-secondary)', lineHeight: '1.6', margin: 0 }}>
                      {product.description}
                    </p>
                  </Card>
                )}

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--txt-primary)', margin: 0 }}>Related Products</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                      {relatedProducts.map(rel => (
                        <Card
                          key={rel.id}
                          onClick={() => navigate(ROUTES.PRINTING_DETAILS.replace(':id', rel.id))}
                          style={{ cursor: 'pointer', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--sys-surface)', border: '1px solid var(--sys-border)', borderRadius: '12px', transition: 'transform 0.2s ease' }}
                        >
                          <div style={{ width: '100%', aspectRatio: '1.3', background: 'var(--sys-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {rel.primary_image_url ? (
                              <img src={rel.primary_image_url} alt={rel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span className="material-icons-outlined" style={{ fontSize: '24px', color: 'var(--txt-muted)' }}>3d_rotation</span>
                            )}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '13px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{rel.name}</h4>
                            <span style={{ fontSize: '11px', color: 'var(--brand-primary)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginTop: '2px' }}>
                              {getLabelForValue(materials, rel.material)}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--sys-divider)' }}>
                            {rel.contact_for_price ? (
                              <span style={{ fontSize: '11px', color: 'var(--brand-primary)', fontWeight: '700' }}>Price on request</span>
                            ) : (
                              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--txt-primary)' }}>₹{rel.price}</span>
                            )}
                            <Button variant="secondary" style={{ height: '28px', padding: '0 10px', fontSize: '11px' }}>Details</Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

      {/* Get Quote Modal - Reusing the Unified Enquiry Form */}
      <Modal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        className="modal-content purple"
        style={{ maxWidth: '600px', width: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        {orderStep === 'input' ? (
          <>
            {/* Fixed Header with Glass/Milk Background */}
            <div style={{
              padding: '24px 24px 16px 24px',
              background: 'var(--sys-surface-elevated)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid var(--sys-divider)',
              zIndex: 10,
              flexShrink: 0
            }}>
              <h4 style={{ textAlign: 'left', margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--txt-primary)' }}>REQUEST A QUOTE</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--txt-muted)', textAlign: 'left', margin: '4px 0 0 0' }}>
                Fill in your details below. Our technical team will coordinate with you.
              </p>
            </div>

            {/* Scrollable Middle Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', textAlign: 'left', width: '100%' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Your Name *</label>
                  <Input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={requestorName}
                    onChange={(e) => {
                      setRequestorName(e.target.value);
                      if (formErrors.requestorName) setFormErrors(prev => ({ ...prev, requestorName: false }));
                    }}
                    className={`form-input ${formErrors.requestorName ? 'error-state' : ''}`}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Contact Number *</label>
                  <div className={`phone-input-container ${formErrors.contactNumber ? 'error-state' : ''}`}>
                    <select
                      className="phone-prefix-select"
                      value={contactPrefix}
                      onChange={(e) => {
                        setContactPrefix(e.target.value);
                        const isValid = e.target.value === '+91' ? contactNumber.length === 10 : (contactNumber.length >= 7 && contactNumber.length <= 15);
                        setFormErrors(prev => ({ ...prev, contactNumber: !isValid }));
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        borderRight: '1px solid var(--sys-border)',
                        color: 'var(--txt-primary)',
                        padding: '0 8px',
                        height: '100%',
                        fontSize: '13px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="+1" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+1</option>
                      <option value="+91" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+91</option>
                      <option value="+44" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+44</option>
                      <option value="+61" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+61</option>
                      <option value="+81" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+81</option>
                      <option value="+33" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+33</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={contactNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setContactNumber(val);
                        const isValid = contactPrefix === '+91' ? val.length === 10 : (val.length >= 7 && val.length <= 15);
                        setFormErrors(prev => ({ ...prev, contactNumber: !isValid }));
                      }}
                      style={{
                        flex: 1,
                        height: '100%',
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none',
                        padding: '0 14px',
                        color: 'var(--txt-primary)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                      maxLength={15}
                    />
                  </div>
                  {formErrors.contactNumber && (
                    <span style={{ color: 'var(--status-error)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                      Please enter a valid number
                    </span>
                  )}
                </div>

                <div style={{ display: 'none' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Your Project Status</label>
                  <select
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value)}
                    className="form-select"
                    style={{ height: '38px', background: 'var(--input-bg)', color: 'var(--txt-primary)', border: '1px solid var(--input-border)', borderRadius: '6px', width: '100%' }}
                  >
                    <option value="Not Started yet" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Not Started yet</option>
                    <option value="Have Project idea" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Have Project idea</option>
                    <option value="Need Only Support" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Need Only Support</option>
                    <option value="Choosed Flyen Project" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>Choosed Flyen Project</option>
                    <option value="3d Printing" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>3d Printing</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Project Title</label>
                  <Input
                    type="text"
                    placeholder="e.g. Smart Irrigation System"
                    value={customProjectTitle}
                    onChange={(e) => setCustomProjectTitle(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div style={{ display: projectStatus === '3d Printing' ? 'none' : 'block' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Budget (₹)</label>
                  <Input
                    type="text"
                    placeholder="e.g. 5000"
                    value={projectBudget}
                    onChange={(e) => setProjectBudget(e.target.value.replace(/\D/g, ''))}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Submission Date</label>
                  <Input
                    type="date"
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                    onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                    className="form-input"
                    style={{ colorScheme: 'dark', height: '38px' }}
                  />
                </div>

                <div style={{ display: projectStatus === '3d Printing' ? 'none' : 'block' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Need Document?</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setNeedDocument('Yes')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needDocument === 'Yes' ? 'rgba(139, 92, 246, 0.15)' : 'var(--interaction-hover)',
                        border: needDocument === 'Yes' ? '1px solid var(--brand-primary)' : '1px solid var(--sys-border)',
                        color: needDocument === 'Yes' ? 'var(--brand-primary)' : 'var(--txt-secondary)'
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setNeedDocument('No')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needDocument === 'No' ? 'rgba(239, 68, 68, 0.15)' : 'var(--interaction-hover)',
                        border: needDocument === 'No' ? '1px solid var(--status-error)' : '1px solid var(--sys-border)',
                        color: needDocument === 'No' ? 'var(--status-error)' : 'var(--txt-secondary)'
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div style={{ display: projectStatus === '3d Printing' ? 'none' : 'block' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Need Presentation Support?</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setNeedPresentation('Yes')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needPresentation === 'Yes' ? 'rgba(139, 92, 246, 0.15)' : 'var(--interaction-hover)',
                        border: needPresentation === 'Yes' ? '1px solid var(--brand-primary)' : '1px solid var(--sys-border)',
                        color: needPresentation === 'Yes' ? 'var(--brand-primary)' : 'var(--txt-secondary)'
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setNeedPresentation('No')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needPresentation === 'No' ? 'rgba(239, 68, 68, 0.15)' : 'var(--interaction-hover)',
                        border: needPresentation === 'No' ? '1px solid var(--status-error)' : '1px solid var(--sys-border)',
                        color: needPresentation === 'No' ? 'var(--status-error)' : 'var(--txt-secondary)'
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', marginTop: '4px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', fontWeight: 'bold' }}>Additional Remarks / Requirements</label>
                <textarea
                  placeholder="Specify any exact customization options (e.g. quantity, size, material choice, infill density etc.)"
                  value={projectRemarks}
                  onChange={(e) => setProjectRemarks(e.target.value)}
                  className="form-input"
                  rows={3}
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    color: 'var(--txt-primary)',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* Fixed Footer */}
            <div style={{
              padding: '16px 24px 24px 24px',
              background: 'var(--sys-surface-elevated)',
              borderTop: '1px solid var(--sys-divider)',
              display: 'flex',
              gap: '12px',
              zIndex: 10,
              flexShrink: 0
            }}>
              <Button variant="secondary" onClick={() => setIsQuoteModalOpen(false)} disabled={isProcessing} style={{ flex: 1, height: '42px' }}>
                Cancel
              </Button>
              <Button
                variant="primary"
                style={{ flex: 1, height: '42px' }}
                disabled={isProcessing}
                onClick={async () => {
                  const newErrors = {};
                  if (!requestorName.trim()) newErrors.requestorName = true;
                  
                  const isPhoneValid = contactPrefix === '+91' 
                    ? contactNumber.length === 10 
                    : (contactNumber.length >= 7 && contactNumber.length <= 15);
                    
                  if (!isPhoneValid) newErrors.contactNumber = true;

                  if (Object.keys(newErrors).length > 0) {
                    setFormErrors(newErrors);
                    showToast('Please fill in all mandatory fields correctly.', 'error');
                    return;
                  }

                  setFormErrors({});
                  
                  const serializedNotes = [
                    `Project Status: ${projectStatus}`,
                    `Submission Date: ${submissionDate || 'Not specified'}`,
                    projectRemarks.trim() ? `Remarks: ${projectRemarks}` : ''
                  ].filter(Boolean).join('\n');

                  try {
                    await addEnquiry({
                      name: requestorName,
                      mobile: `${contactPrefix}${contactNumber}`,
                      projectId: product.id || '',
                      projectTitle: customProjectTitle || product.name || '3D Printing Quote Request',
                      price: product.price || '',
                      notes: serializedNotes,
                      userId: null
                    });
                    setOrderStep('confirmed');
                  } catch (err) {
                    showToast("Failed to submit request: " + (err.message || err), "error");
                  }
                }}
              >
                {isProcessing ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </>
        ) : (
          <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="modal-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <span className="material-icons" style={{ fontSize: '32px' }}>check</span>
            </div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800' }}>QUOTE REQUEST CONFIRMED</h4>
            <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: 'var(--txt-muted)' }}>
              Your quote request has been received. We'll reach out to <strong style={{ color: 'var(--brand-accent)' }}>{requestorName}</strong> ({contactNumber}) shortly.
            </p>

            {product && (
              <div className="modal-receipt" style={{ width: '100%', background: 'var(--interaction-hover)', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>
                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--txt-muted)' }}>PRODUCT NAME:</span>
                  <span className="receipt-val" style={{ color: 'var(--txt-primary)', fontWeight: 'bold' }}>{product.name}</span>
                </div>
                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--txt-muted)' }}>CONTACT:</span>
                  <span className="receipt-val" style={{ color: 'var(--txt-primary)', fontWeight: 'bold' }}>{contactNumber}</span>
                </div>
              </div>
            )}

            <Button variant="secondary" onClick={() => setIsQuoteModalOpen(false)} style={{ width: '100%', maxWidth: '200px' }}>
              Close
            </Button>
          </div>
        )}
      </Modal>

        </div>
      </div>
    </>
  );
};
