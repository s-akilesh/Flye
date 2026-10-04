import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { useToast } from '../../../shared/context/ToastContext';
import { reviewService, getInitials, getAvatarBg } from '../../../shared/services/reviewService';
import { storageService } from '../../../shared/services/storageService';
import { ROUTES } from '../../../shared/constants/routes';
import { SEO } from '../../../shared/seo';

const RATING_DESCRIPTIONS = {
  5: '⭐⭐⭐⭐⭐ Exceptional Quality & Precision',
  4: '⭐⭐⭐⭐ Very Good Experience',
  3: '⭐⭐⭐ Average / Met Expectations',
  2: '⭐⭐ Needs Improvement',
  1: '⭐ Unsatisfactory'
};

export const Feedback = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedServices, setSelectedServices] = useState(['3D Printing']);
  const [comment, setComment] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const previewInitials = getInitials(name || 'Flyen Maker');
  const previewBg = getAvatarBg(name || 'Flyen Maker');

  const toggleService = (service) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploaded = await storageService.uploadImage('website-assets', 'reviews', file);
      if (uploaded?.publicUrl) {
        setAvatarUrl(uploaded.publicUrl);
        showToast('🖼️ Photo uploaded successfully!', 'success');
      } else {
        const previewUrl = URL.createObjectURL(file);
        setAvatarUrl(previewUrl);
        showToast('🖼️ Photo attached to review.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to upload image file.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your name.', 'error');
      return;
    }
    if (selectedServices.length === 0) {
      showToast('Please select at least one service: 3D Printing or Project.', 'error');
      return;
    }
    if (!comment.trim()) {
      showToast('Please enter your review comments.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const is3d = selectedServices.includes('3D Printing');
      const isProj = selectedServices.includes('Project');

      let projectLabel = '3D Printing';
      let categoryLabel = '3D Printing';

      if (is3d && isProj) {
        projectLabel = '3D Printing & Project';
        categoryLabel = '3D Printing & Electronics Kit';
      } else if (isProj) {
        projectLabel = 'Project';
        categoryLabel = 'Electronics Kit';
      } else {
        projectLabel = '3D Printing';
        categoryLabel = '3D Printing';
      }

      await reviewService.create({
        name: name.trim(),
        email: email.trim() || null,
        role: '',
        institution: '',
        project: projectLabel,
        category: categoryLabel,
        rating,
        comment: comment.trim(),
        avatar_url: avatarUrl || '',
        avatar_text: previewInitials,
        avatar_bg: previewBg,
        status: 'approved',
        show_in_home: true
      });

      setIsSubmitted(true);
      showToast('✅ Thank you! Your review has been received.', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to submit review. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="flyen-page-container" 
      style={{ 
        paddingTop: '108px', 
        paddingBottom: '80px', 
        paddingLeft: '20px', 
        paddingRight: '20px', 
        minHeight: 'calc(100vh - 120px)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start' 
      }}
    >
      <SEO
        title="Share Your Feedback | Flyen"
        description="Share your customer feedback and review for Flyen 3D printing and engineering project kits."
      />

      <div style={{ maxWidth: '680px', width: '100%', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="feedback-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header Box */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  color: 'var(--brand-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '14px'
                }}>
                  <span className="material-icons" style={{ fontSize: '15px' }}>rate_review</span>
                  Maker Community Feedback
                </div>
                <h1 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 10px 0', color: 'var(--txt-primary)' }}>
                  Share Your Experience
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--txt-muted)', margin: 0, lineHeight: 1.6 }}>
                  Tell us about your project, print precision, or engineering experience with Flyen. Your review empowers future makers!
                </p>
              </div>

              {/* Form Card */}
              <Card style={{ padding: '32px 28px', borderRadius: '16px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  
                  {/* Rating Selector */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    borderRadius: '12px',
                    background: 'var(--sys-surface-hover)',
                    border: '1px solid var(--sys-divider)',
                    textAlign: 'center'
                  }}>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-secondary)', marginBottom: '10px' }}>
                      Overall Satisfaction Rating *
                    </label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = (hoverRating || rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px',
                              color: active ? '#f59e0b' : 'var(--txt-muted)',
                              transform: active ? 'scale(1.15)' : 'scale(1)',
                              transition: 'transform 0.15s ease, color 0.15s ease'
                            }}
                            title={`${star} Star${star > 1 ? 's' : ''}`}
                          >
                            <span className="material-icons" style={{ fontSize: '32px' }}>
                              {active ? 'star' : 'star_border'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#f59e0b' }}>
                      {RATING_DESCRIPTIONS[hoverRating || rating]}
                    </span>
                  </div>

                  {/* Name & Email Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div style={{ textAlign: 'left' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)', marginBottom: '8px' }}>
                        Your Full Name *
                      </label>
                      <Input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Akash Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: '100%', height: '42px' }}
                      />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)', marginBottom: '8px' }}>
                        Email Address <span style={{ color: 'var(--txt-muted)', fontWeight: '400' }}>(Optional)</span>
                      </label>
                      <Input
                        type="email"
                        className="form-input"
                        placeholder="e.g. akash@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', height: '42px' }}
                      />
                    </div>
                  </div>

                  {/* Service / Experience Selection Cards */}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)' }}>
                        Product or Service Experienced *
                      </label>
                      <span style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>
                        (Select one or both)
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '12px'
                    }}>
                      {/* Card 1: 3D Printing */}
                      <div
                        onClick={() => toggleService('3D Printing')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 16px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          border: selectedServices.includes('3D Printing')
                            ? '2px solid var(--brand-primary, #6366f1)'
                            : '1px solid var(--sys-divider)',
                          background: selectedServices.includes('3D Printing')
                            ? 'rgba(99, 102, 241, 0.08)'
                            : 'var(--sys-surface-hover)',
                          boxShadow: selectedServices.includes('3D Printing')
                            ? '0 0 12px rgba(99, 102, 241, 0.2)'
                            : 'none',
                          transition: 'all 0.2s ease',
                          userSelect: 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            background: selectedServices.includes('3D Printing') ? 'rgba(99, 102, 241, 0.15)' : 'var(--sys-surface)',
                            color: selectedServices.includes('3D Printing') ? 'var(--brand-primary, #6366f1)' : 'var(--txt-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <span className="material-icons" style={{ fontSize: '20px' }}>view_in_ar</span>
                          </div>
                          <div>
                            <div style={{
                              fontSize: '13.5px',
                              fontWeight: '700',
                              color: selectedServices.includes('3D Printing') ? 'var(--brand-primary, #6366f1)' : 'var(--txt-primary)'
                            }}>
                              3D Printing
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--txt-muted)', marginTop: '2px' }}>
                              Custom prints & functional parts
                            </div>
                          </div>
                        </div>

                        <span
                          className="material-icons"
                          style={{
                            fontSize: '22px',
                            color: selectedServices.includes('3D Printing') ? 'var(--brand-primary, #6366f1)' : 'var(--txt-muted)',
                            transition: 'color 0.2s ease'
                          }}
                        >
                          {selectedServices.includes('3D Printing') ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                      </div>

                      {/* Card 2: Project */}
                      <div
                        onClick={() => toggleService('Project')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 16px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          border: selectedServices.includes('Project')
                            ? '2px solid var(--brand-primary, #6366f1)'
                            : '1px solid var(--sys-divider)',
                          background: selectedServices.includes('Project')
                            ? 'rgba(99, 102, 241, 0.08)'
                            : 'var(--sys-surface-hover)',
                          boxShadow: selectedServices.includes('Project')
                            ? '0 0 12px rgba(99, 102, 241, 0.2)'
                            : 'none',
                          transition: 'all 0.2s ease',
                          userSelect: 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            background: selectedServices.includes('Project') ? 'rgba(99, 102, 241, 0.15)' : 'var(--sys-surface)',
                            color: selectedServices.includes('Project') ? 'var(--brand-primary, #6366f1)' : 'var(--txt-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <span className="material-icons" style={{ fontSize: '20px' }}>memory</span>
                          </div>
                          <div>
                            <div style={{
                              fontSize: '13.5px',
                              fontWeight: '700',
                              color: selectedServices.includes('Project') ? 'var(--brand-primary, #6366f1)' : 'var(--txt-primary)'
                            }}>
                              Project
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--txt-muted)', marginTop: '2px' }}>
                              Hardware kits & engineering builds
                            </div>
                          </div>
                        </div>

                        <span
                          className="material-icons"
                          style={{
                            fontSize: '22px',
                            color: selectedServices.includes('Project') ? 'var(--brand-primary, #6366f1)' : 'var(--txt-muted)',
                            transition: 'color 0.2s ease'
                          }}
                        >
                          {selectedServices.includes('Project') ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Comments */}
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)', marginBottom: '8px' }}>
                      Your Detailed Review & Feedback *
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="form-textarea"
                      placeholder="Share your experience: print precision, tolerances, project schematics, delivery speed, mentor support..."
                      required
                      style={{ width: '100%', fontSize: '13px', lineHeight: 1.6, padding: '12px 14px' }}
                    />
                  </div>

                  {/* Photo & Avatar Customization */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    background: 'var(--sys-surface-hover)',
                    border: '1px solid var(--sys-divider)'
                  }}>
                    {/* Visual Avatar Preview */}
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: avatarUrl ? 'transparent' : previewBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '16px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        previewInitials
                      )}
                    </div>

                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--txt-primary)' }}>
                        Reviewer Profile Badge
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--txt-muted)', marginTop: '2px' }}>
                        Auto-generated initials badge or upload your photo.
                      </div>
                    </div>

                    <label style={{
                      cursor: isUploading ? 'not-allowed' : 'pointer',
                      fontSize: '11.5px',
                      color: 'var(--accent-blue, #38bdf8)',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--accent-blue, #38bdf8)',
                      background: 'rgba(56, 189, 248, 0.08)'
                    }}>
                      <span className="material-icons" style={{ fontSize: '15px' }}>upload</span>
                      {isUploading ? 'Uploading...' : (avatarUrl ? 'Change Photo' : 'Attach Photo')}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={isUploading}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  {/* Submit Action */}
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    style={{ width: '100%', height: '46px', fontSize: '14px', fontWeight: '800', marginTop: '8px' }}
                  >
                    {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
                  </Button>
                </form>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="feedback-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card style={{ padding: '48px 32px', textAlign: 'center', borderRadius: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <span className="material-icons" style={{ fontSize: '36px' }}>check_circle</span>
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 10px 0', color: 'var(--txt-primary)' }}>
                  Thank You for Your Feedback!
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--txt-muted)', margin: '0 auto 24px auto', maxWidth: '460px', lineHeight: 1.6 }}>
                  Your review has been successfully submitted and helps us build the highest quality engineering solutions for makers across India.
                </p>

                <div style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'var(--sys-surface-hover)',
                  border: '1px solid var(--sys-divider)',
                  marginBottom: '28px',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: avatarUrl ? 'transparent' : previewBg,
                        color: '#ffffff',
                        fontWeight: '800',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          previewInitials
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--txt-primary)' }}>{name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b' }}>
                          {[...Array(rating)].map((_, i) => (
                            <span key={i} className="material-icons" style={{ fontSize: '15px' }}>star</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedServices.length > 0 && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--brand-primary)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span className="material-icons" style={{ fontSize: '13px' }}>
                          {selectedServices.includes('3D Printing') && selectedServices.includes('Project')
                            ? 'layers'
                            : selectedServices.includes('3D Printing')
                            ? 'view_in_ar'
                            : 'memory'}
                        </span>
                        {selectedServices.join(' & ')}
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--txt-secondary)', margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
                    "{comment}"
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button variant="secondary" onClick={() => navigate(ROUTES.HOME)}>
                    Back to Home
                  </Button>
                  <Button variant="primary" onClick={() => navigate(ROUTES.PRINTING)}>
                    Explore 3D Printing
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
