import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, formatCurrency } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { ROUTES } from '../../constants/routes';
import { useEnquiries } from '../../../modules/enquiries/hooks/useEnquiries';
import { useAuth } from '../../../modules/auth/context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../../modules/settings/hooks/useSettings';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { settings } = useSettings();
  const { addEnquiry, isProcessing } = useEnquiries();

  const {
    items,
    totalItems,
    subtotal,
    formattedSubtotal,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCart();

  // Checkout / Quote Modal State from Cart
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerPrefix, setCustomerPrefix] = useState('+91');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [checkoutStep, setCheckoutStep] = useState('input'); // 'input' | 'success'

  const handleItemClick = (item) => {
    closeCart();
    if (item.type === 'project' && item.slug) {
      navigate(ROUTES.PROJECT_DETAILS.replace(':slug', item.slug));
    } else if (item.idNum) {
      navigate(ROUTES.PRINTING_DETAILS.replace(':id', item.idNum));
    } else {
      navigate(ROUTES.PRINTING);
    }
  };

  const handleOpenCheckout = () => {
    if (items.length === 0) return;
    setCustomerName(user?.user_metadata?.full_name || user?.name || '');
    setCustomerMobile('');
    setCustomerPrefix('+91');
    setDeliveryAddress('');
    setOrderNotes('');
    setFormErrors({});
    setCheckoutStep('input');
    setIsCheckoutModalOpen(true);
  };

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    const phone = (settings.contactPhone || '+919840049449').replace(/[^\d]/g, '');
    
    const lines = [
      `*New Order Request via Flyen Cart:*`,
      `---------------------------------`,
      ...items.map((item, idx) => `${idx + 1}. *${item.title}* (Qty: ${item.quantity}) - ${formatCurrency((item.numericPrice || 0) * item.quantity)}`),
      `---------------------------------`,
      `*Total Items:* ${totalItems}`,
      `*Estimated Subtotal:* ${formattedSubtotal}`,
      ``,
      `Please confirm the availability, material specs, and delivery timeline. Thank you!`
    ];

    const message = encodeURIComponent(lines.join('\n'));
    const waUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSubmitCartOrder = async (e) => {
    e?.preventDefault?.();
    const errors = {};
    if (!customerName.trim()) errors.name = true;

    const isPhoneValid = customerPrefix === '+91' 
      ? customerMobile.length === 10 
      : (customerMobile.length >= 7 && customerMobile.length <= 15);

    if (!isPhoneValid) errors.mobile = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('Please fill in all mandatory contact fields.', 'error');
      return;
    }

    setFormErrors({});

    const itemsSummary = items.map((i, idx) => 
      `[${idx + 1}] ${i.title} (Qty: ${i.quantity}, Unit: ${i.price || formatCurrency(i.numericPrice)}, Subtotal: ${formatCurrency(i.numericPrice * i.quantity)}, Type: ${i.type})`
    ).join('\n');

    const serializedNotes = [
      `--- CART CHECKOUT ORDER ---`,
      `Total Items: ${totalItems}`,
      `Subtotal: ${formattedSubtotal}`,
      deliveryAddress.trim() ? `Delivery Location / College: ${deliveryAddress.trim()}` : '',
      orderNotes.trim() ? `Customer Instructions: ${orderNotes.trim()}` : '',
      `\nItems in Order:\n${itemsSummary}`
    ].filter(Boolean).join('\n');

    try {
      await addEnquiry({
        name: customerName.trim(),
        mobile: `${customerPrefix}${customerMobile.trim()}`,
        projectId: items[0]?.id || 'CART_ORDER',
        projectTitle: `Cart Order (${totalItems} items: ${items.map(i => i.title).slice(0, 2).join(', ')}${items.length > 2 ? '...' : ''})`,
        price: String(subtotal),
        notes: serializedNotes,
        userId: user?.id || null
      });

      setCheckoutStep('success');
      clearCart();
      showToast('🎉 Your cart order request has been submitted successfully!', 'success');
    } catch (err) {
      console.error('Failed to submit cart order:', err);
      showToast('Failed to submit order. Please try again.', 'error');
    }
  };

  return (
    <>
      {/* Sliding Drawer + Backdrop */}
      <AnimatePresence>
        {isCartOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9990,
              display: 'flex',
              justifyContent: 'flex-end',
              pointerEvents: 'auto'
            }}
          >
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeCart}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
            />

            {/* Slide-over Drawer Surface */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '440px',
                height: '100%',
                background: 'var(--sys-surface)',
                borderLeft: '1px solid var(--sys-border)',
                boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 10,
                overflow: 'hidden'
              }}
            >
              {/* Drawer Header */}
              <div style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--sys-divider)',
                background: 'var(--sys-surface-elevated)',
                backdropFilter: 'blur(16px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(0, 223, 162, 0.12)',
                    color: 'var(--flyen-teal, #00dfa2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span className="material-icons" style={{ fontSize: '20px' }}>shopping_bag</span>
                  </div>
                  <div>
                    <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--txt-primary)' }}>
                      Shopping Cart
                    </h2>
                    <span style={{ fontSize: '11.5px', color: 'var(--txt-muted)' }}>
                      {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCart}
                      title="Empty cart"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--txt-muted)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--txt-muted)'}
                    >
                      <span className="material-icons" style={{ fontSize: '15px' }}>delete_sweep</span>
                      Clear
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={closeCart}
                    aria-label="Close Cart"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--interaction-hover)',
                      border: '1px solid var(--sys-divider)',
                      color: 'var(--txt-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: '18px' }}>close</span>
                  </button>
                </div>
              </div>

              {/* Drawer Body / Items List */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: 'var(--sys-bg)'
              }}>
                {items.length > 0 ? (
                  items.map((item) => (
                    <motion.div
                      key={item.cartItemId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'var(--sys-surface)',
                        border: '1px solid var(--sys-border)',
                        boxShadow: 'var(--shadow-sm)',
                        alignItems: 'center',
                        position: 'relative'
                      }}
                    >
                      {/* Product Thumbnail */}
                      <div
                        onClick={() => handleItemClick(item)}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '8px',
                          background: 'var(--interaction-hover)',
                          border: '1px solid var(--sys-border)',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          cursor: 'pointer'
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span className="material-icons" style={{ fontSize: '28px', color: 'var(--txt-muted)' }}>
                            {item.type === 'project' ? 'memory' : 'view_in_ar'}
                          </span>
                        )}
                      </div>

                      {/* Product Info & Controls */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                          <h3
                            onClick={() => handleItemClick(item)}
                            title={item.title}
                            style={{
                              fontSize: '13.5px',
                              fontWeight: '700',
                              color: 'var(--txt-primary)',
                              margin: '0 0 4px 0',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {item.title}
                          </h3>

                          {/* Delete Item Button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cartItemId)}
                            title="Remove item"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--txt-muted)',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'color 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--txt-muted)'}
                          >
                            <span className="material-icons" style={{ fontSize: '17px' }}>delete_outline</span>
                          </button>
                        </div>

                        {/* Category Tag */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: item.type === 'project' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(0, 223, 162, 0.12)',
                            color: item.type === 'project' ? '#818cf8' : 'var(--flyen-teal, #00dfa2)',
                            letterSpacing: '0.5px'
                          }}>
                            {item.type === 'project' ? 'Project Kit' : '3D Print'}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>
                            {formatCurrency(item.numericPrice)} each
                          </span>
                        </div>

                        {/* Quantity Stepper & Line Total */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: 'var(--sys-surface-elevated)',
                            border: '1px solid var(--sys-border)',
                            borderRadius: '6px',
                            padding: '2px'
                          }}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              style={{
                                width: '24px',
                                height: '24px',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--txt-primary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px'
                              }}
                              title="Decrease quantity"
                            >
                              <span className="material-icons" style={{ fontSize: '14px' }}>remove</span>
                            </button>

                            <span style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              color: 'var(--txt-primary)',
                              minWidth: '24px',
                              textAlign: 'center'
                            }}>
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              style={{
                                width: '24px',
                                height: '24px',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--txt-primary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px'
                              }}
                              title="Increase quantity"
                            >
                              <span className="material-icons" style={{ fontSize: '14px' }}>add</span>
                            </button>
                          </div>

                          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--flyen-teal, #00dfa2)' }}>
                            {formatCurrency((item.numericPrice || 0) * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  /* Empty Cart View */
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '40px 20px'
                  }}>
                    <div style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: 'var(--interaction-hover)',
                      border: '1px dashed var(--sys-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--txt-muted)',
                      marginBottom: '16px'
                    }}>
                      <span className="material-icons" style={{ fontSize: '32px' }}>remove_shopping_cart</span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--txt-primary)', margin: '0 0 6px 0' }}>
                      Your cart is empty
                    </h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--txt-muted)', margin: '0 0 24px 0', maxWidth: '280px', lineHeight: 1.5 }}>
                      Explore our precision 3D printed parts and verified engineering project packages.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '240px' }}>
                      <Button
                        variant="primary"
                        onClick={() => {
                          closeCart();
                          navigate(ROUTES.PRINTING);
                        }}
                        style={{ width: '100%', height: '38px', fontSize: '12.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <span className="material-icons" style={{ fontSize: '16px' }}>view_in_ar</span>
                        Browse 3D Catalog
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() => {
                          closeCart();
                          navigate(ROUTES.PROJECTS);
                        }}
                        style={{ width: '100%', height: '38px', fontSize: '12.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <span className="material-icons" style={{ fontSize: '16px' }}>memory</span>
                        Explore Project Kits
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer (Only when items exist) */}
              {items.length > 0 && (
                <div style={{
                  padding: '20px 24px',
                  borderTop: '1px solid var(--sys-divider)',
                  background: 'var(--sys-surface-elevated)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {/* Price Breakdown */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'var(--txt-secondary)', fontWeight: '600' }}>
                      Estimated Subtotal
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--txt-primary)' }}>
                      {formattedSubtotal}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--txt-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-icons" style={{ fontSize: '13px', color: 'var(--flyen-teal)' }}>verified</span>
                    Pre-tested hardware & dimensional tolerance check included
                  </div>

                  {/* Checkout CTA */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    <Button
                      variant="primary"
                      onClick={handleOpenCheckout}
                      style={{
                        width: '100%',
                        height: '44px',
                        fontSize: '13.5px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>Proceed to Quote / Order</span>
                      <span className="material-icons" style={{ fontSize: '18px' }}>arrow_forward</span>
                    </Button>

                    <button
                      type="button"
                      onClick={handleWhatsAppCheckout}
                      style={{
                        width: '100%',
                        height: '38px',
                        borderRadius: '8px',
                        background: 'rgba(37, 211, 102, 0.12)',
                        border: '1px solid rgba(37, 211, 102, 0.3)',
                        color: '#16a34a',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: '16px' }}>chat</span>
                      <span>Instant WhatsApp Order</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Checkout / Quote Request Modal */}
      <Modal
        isOpen={isCheckoutModalOpen}
        zIndex={10001}
        onClose={() => !isProcessing && setIsCheckoutModalOpen(false)}
        className="modal-content purple"
        style={{ maxWidth: '560px', width: '92%', maxHeight: '88vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        {checkoutStep === 'input' ? (
          <>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px 16px 24px',
              background: 'var(--sys-surface-elevated)',
              borderBottom: '1px solid var(--sys-divider)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--txt-primary)' }}>
                  REQUEST ORDER / QUOTE
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--txt-muted)', margin: '4px 0 0 0' }}>
                  {totalItems} items in your order • Subtotal: {formattedSubtotal}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                disabled={isProcessing}
                style={{ background: 'transparent', border: 'none', color: 'var(--txt-muted)', cursor: 'pointer' }}
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleSubmitCartOrder} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Items Summary Strip */}
              <div style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'var(--interaction-hover)',
                border: '1px solid var(--sys-border)',
                maxHeight: '120px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--txt-primary)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>
                      {item.quantity}x {item.title}
                    </span>
                    <span style={{ color: 'var(--flyen-teal)', fontWeight: '700' }}>
                      {formatCurrency((item.numericPrice || 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Name & Contact Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', textAlign: 'left' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--txt-secondary)', marginBottom: '6px', fontWeight: '700' }}>
                    Your Full Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Akash Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className={formErrors.name ? 'error-state' : ''}
                    style={{ width: '100%', height: '42px', fontSize: '13.5px' }}
                  />
                  {formErrors.name && (
                    <span style={{ fontSize: '11px', color: 'var(--status-error)', marginTop: '4px', display: 'block' }}>Name is required</span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--txt-secondary)', marginBottom: '6px', fontWeight: '700' }}>
                    Mobile Number *
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--input-bg, var(--sys-surface))',
                    border: formErrors.mobile ? '1px solid var(--status-error)' : '1px solid var(--input-border, var(--sys-border))',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    height: '42px',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}>
                    <select
                      value={customerPrefix}
                      onChange={(e) => setCustomerPrefix(e.target.value)}
                      style={{
                        width: '78px',
                        height: '100%',
                        background: 'var(--interaction-hover)',
                        border: 'none',
                        borderRight: '1px solid var(--sys-border)',
                        color: 'var(--txt-primary)',
                        fontSize: '13px',
                        fontWeight: '600',
                        padding: '0 8px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+971">+971</option>
                      <option value="+65">+65</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={customerMobile}
                      onChange={(e) => setCustomerMobile(e.target.value.replace(/[^\d]/g, ''))}
                      maxLength={10}
                      required
                      style={{
                        flex: 1,
                        height: '100%',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--txt-primary)',
                        fontSize: '13.5px',
                        padding: '0 12px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  {formErrors.mobile && (
                    <span style={{ fontSize: '11px', color: 'var(--status-error)', marginTop: '4px', display: 'block' }}>Valid mobile number is required</span>
                  )}
                </div>
              </div>

              {/* Delivery Address / Location */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--txt-secondary)', marginBottom: '6px', fontWeight: '700' }}>
                  Delivery Address / College Campus <span style={{ color: 'var(--txt-muted)', fontWeight: '400' }}>(Optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. SRM IST Kattankulathur, Chennai / Full Address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  style={{ width: '100%', height: '42px', fontSize: '13.5px' }}
                />
              </div>

              {/* Custom Instructions */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--txt-secondary)', marginBottom: '6px', fontWeight: '700' }}>
                  Order Notes / Custom Requirements <span style={{ color: 'var(--txt-muted)', fontWeight: '400' }}>(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="e.g. Need PETG material for drone bracket / urgent delivery before Friday..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  style={{ width: '100%', fontSize: '13px', minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button variant="secondary" type="button" onClick={() => setIsCheckoutModalOpen(false)} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isProcessing} style={{ minWidth: '130px' }}>
                  {isProcessing ? 'Submitting...' : 'Submit Order Request'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          /* Order Submitted Success View */
          <div style={{ padding: '36px 24px', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <span className="material-icons" style={{ fontSize: '32px' }}>check_circle</span>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--txt-primary)', margin: '0 0 8px 0' }}>
              Order Request Submitted!
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--txt-muted)', margin: '0 auto 24px auto', maxWidth: '380px', lineHeight: 1.5 }}>
              Thank you! Our technical engineering mentors will review your component list and contact you on WhatsApp / Phone within 2 hours.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button variant="primary" onClick={() => { setIsCheckoutModalOpen(false); closeCart(); }}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
