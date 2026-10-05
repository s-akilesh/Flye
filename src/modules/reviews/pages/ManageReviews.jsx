import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Modal } from '../../../shared/components/ui/Modal';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { useToast } from '../../../shared/context/ToastContext';
import { reviewService, getInitials, getAvatarBg } from '../../../shared/services/reviewService';
import { storageService } from '../../../shared/services/storageService';
import { ROUTES } from '../../../shared/constants/routes';

const RATING_DESCRIPTIONS = {
  5: '⭐⭐⭐⭐⭐ Exceptional Quality & Precision',
  4: '⭐⭐⭐⭐ Very Good Experience',
  3: '⭐⭐⭐ Average / Met Expectations',
  2: '⭐⭐ Needs Improvement',
  1: '⭐ Unsatisfactory'
};

export const ManageReviews = () => {
  const { showToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'home' | 'approved' | 'pending' | '5star' | 'lowstar'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [selectedServices, setSelectedServices] = useState(['3D Printing']);
  const [formComment, setFormComment] = useState('');
  const [formAvatarUrl, setFormAvatarUrl] = useState('');
  const [formStatus, setFormStatus] = useState('approved');
  const [formShowInHome, setFormShowInHome] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadReviewsData = async () => {
    setIsLoading(true);
    try {
      const data = await reviewService.getAll();
      setReviews(data || []);
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to load customer reviews.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviewsData();
  }, []);

  const stats = useMemo(() => {
    return reviewService.calculateStats(reviews);
  }, [reviews]);

  const handleCopyFeedbackLink = () => {
    const feedbackUrl = `${window.location.origin}${ROUTES.FEEDBACK || '/feedback'}`;
    navigator.clipboard.writeText(feedbackUrl);
    showToast('📋 Feedback link copied! Share this with your customers.', 'success');
  };

  const toggleService = (service) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleOpenAddModal = () => {
    setEditingReview(null);
    setFormRating(5);
    setHoverRating(0);
    setFormName('');
    setFormEmail('');
    setSelectedServices(['3D Printing']);
    setFormComment('');
    setFormAvatarUrl('');
    setFormStatus('approved');
    setFormShowInHome(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rev, e) => {
    if (e) e.stopPropagation();
    setEditingReview(rev);
    setFormRating(Number(rev.rating) || 5);
    setHoverRating(0);
    setFormName(rev.name || '');
    setFormEmail(rev.email || '');

    const proj = (rev.project || '').toLowerCase();
    const is3d = proj.includes('3d') || proj.includes('print');
    const isProj = proj.includes('project') || proj.includes('kit') || proj.includes('node') || proj.includes('chassis') || proj.includes('rover') || proj.includes('solar');

    if (is3d && isProj) {
      setSelectedServices(['3D Printing', 'Project']);
    } else if (isProj) {
      setSelectedServices(['Project']);
    } else {
      setSelectedServices(['3D Printing']);
    }

    setFormComment(rev.comment || '');
    setFormAvatarUrl(rev.avatar_url || '');
    setFormStatus(rev.status || 'approved');
    setFormShowInHome(rev.show_in_home !== false);
    setIsModalOpen(true);
  };

  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      showToast('⚠️ Image size exceeds 2MB limit. Please choose an image under 2MB.', 'error');
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP).', 'error');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const uploaded = await storageService.uploadImage('website-assets', 'reviews', file);
      if (uploaded?.publicUrl) {
        setFormAvatarUrl(uploaded.publicUrl);
        showToast('🖼️ Reviewer photo uploaded!', 'success');
      } else {
        const previewUrl = URL.createObjectURL(file);
        setFormAvatarUrl(previewUrl);
        showToast('🖼️ Image attached to review.', 'info');
      }
    } catch (err) {
      console.error(err);
      const previewUrl = URL.createObjectURL(file);
      setFormAvatarUrl(previewUrl);
      showToast('🖼️ Image attached.', 'info');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormAvatarUrl('');
    showToast('Image removed.', 'info');
  };

  const handleToggleHomeVisibility = async (rev, e) => {
    if (e) e.stopPropagation();
    const nextVal = !rev.show_in_home;
    try {
      await reviewService.update(rev.id, { show_in_home: nextVal });
      setReviews(prev => prev.map(r => r.id === rev.id ? { ...r, show_in_home: nextVal } : r));
      showToast(nextVal ? '🏠 Review featured on Home screen slider.' : 'Review removed from Home screen.', 'success');
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to update review visibility.', 'error');
    }
  };

  const handleQuickStatusChange = async (rev, newStatus, e) => {
    if (e) e.stopPropagation();
    try {
      await reviewService.update(rev.id, { status: newStatus });
      setReviews(prev => prev.map(r => r.id === rev.id ? { ...r, status: newStatus } : r));
      showToast(`Review marked as ${newStatus}.`, 'success');
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to update review status.', 'error');
    }
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Please enter customer name.', 'error');
      return;
    }
    if (selectedServices.length === 0) {
      showToast('Please select at least one service: 3D Printing or Project.', 'error');
      return;
    }
    if (!formComment.trim()) {
      showToast('Please enter review comment.', 'error');
      return;
    }

    setIsSaving(true);
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

      const payload = {
        name: formName.trim(),
        email: formEmail.trim() || null,
        role: null,
        institution: null,
        project: projectLabel,
        category: categoryLabel,
        rating: Number(formRating) || 5,
        comment: formComment.trim(),
        avatar_url: formAvatarUrl || '',
        avatar_text: getInitials(formName),
        avatar_bg: getAvatarBg(formName),
        status: formStatus || 'approved',
        show_in_home: formShowInHome
      };

      if (editingReview) {
        await reviewService.update(editingReview.id, payload);
        showToast('✅ Review updated successfully!', 'success');
      } else {
        await reviewService.create(payload);
        showToast('🚀 New review created successfully!', 'success');
      }
      setIsModalOpen(false);
      loadReviewsData();
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to save review.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await reviewService.delete(deleteTarget.id);
      showToast('🗑️ Review deleted successfully.', 'success');
      setReviews(prev => prev.filter(r => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to delete review.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter(rev => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query ||
        rev.name?.toLowerCase().includes(query) ||
        rev.comment?.toLowerCase().includes(query) ||
        rev.project?.toLowerCase().includes(query) ||
        rev.institution?.toLowerCase().includes(query) ||
        rev.role?.toLowerCase().includes(query);

      let matchesStatus = true;
      if (statusFilter === 'home') matchesStatus = !!rev.show_in_home && rev.status === 'approved';
      else if (statusFilter === 'approved') matchesStatus = rev.status === 'approved';
      else if (statusFilter === 'pending') matchesStatus = rev.status === 'pending';
      else if (statusFilter === '5star') matchesStatus = Number(rev.rating) === 5;
      else if (statusFilter === 'lowstar') matchesStatus = Number(rev.rating) < 5;

      return matchesSearch && matchesStatus;
    });
  }, [reviews, searchQuery, statusFilter]);

  return (
    <div className="admin-page-container" style={{ padding: '0 0 40px 0' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        
        {/* Top Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--txt-primary)' }}>
              Customer Reviews & Feedback
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--txt-muted)', margin: 0 }}>
              Collect, moderate, and showcase real maker testimonials across Flyen.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              onClick={handleCopyFeedbackLink}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '40px' }}
              title="Copy shareable link to send to clients on WhatsApp / Email"
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>content_copy</span>
              Copy Feedback Link
            </Button>

            <Button
              variant="primary"
              onClick={handleOpenAddModal}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '40px' }}
            >
              <span className="material-icons" style={{ fontSize: '18px' }}>add</span>
              + Add Review
            </Button>
          </div>
        </div>

        {/* KPI Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <Card style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons" style={{ fontSize: '22px' }}>star</span>
            </div>
            <div>
              <div style={{ fontSize: '11.5px', color: 'var(--txt-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Average Rating</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--txt-primary)' }}>{stats.averageRating} <span style={{ fontSize: '13px', color: '#f59e0b' }}>★</span></div>
            </div>
          </Card>

          <Card style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons" style={{ fontSize: '22px' }}>rate_review</span>
            </div>
            <div>
              <div style={{ fontSize: '11.5px', color: 'var(--txt-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Total Reviews</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--txt-primary)' }}>{stats.total}</div>
            </div>
          </Card>

          <Card style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: 'var(--accent-blue, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons" style={{ fontSize: '22px' }}>home</span>
            </div>
            <div>
              <div style={{ fontSize: '11.5px', color: 'var(--txt-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Home Featured</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--txt-primary)' }}>{stats.homeFeaturedCount}</div>
            </div>
          </Card>

          <Card style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: stats.pendingCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: stats.pendingCount > 0 ? '#ef4444' : '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons" style={{ fontSize: '22px' }}>
                {stats.pendingCount > 0 ? 'pending_actions' : 'check_circle'}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '11.5px', color: 'var(--txt-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Pending Moderation</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: stats.pendingCount > 0 ? '#ef4444' : 'var(--txt-primary)' }}>
                {stats.pendingCount}
              </div>
            </div>
          </Card>
        </div>

        {/* Filter & Search Bar */}
        <Card style={{ padding: '16px 20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            
            {/* Themed Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '240px', maxWidth: '380px' }}>
              <span
                className="material-icons"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--txt-muted)',
                  fontSize: '18px',
                  pointerEvents: 'none'
                }}
              >
                search
              </span>
              <Input
                type="text"
                placeholder="Search reviews by name, project, quote..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{
                  width: '100%',
                  height: '38px',
                  paddingLeft: '38px',
                  paddingRight: searchQuery ? '36px' : '14px',
                  fontSize: '13px'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--txt-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Clear search"
                >
                  <span className="material-icons" style={{ fontSize: '16px' }}>close</span>
                </button>
              )}
            </div>

            {/* Filter Chips */}
            <div className="admin-chip-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`admin-chip ${statusFilter === 'all' ? 'active' : ''}`}
                style={{ fontSize: '12px', padding: '6px 14px', height: '36px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                All ({stats.total})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('home')}
                className={`admin-chip ${statusFilter === 'home' ? 'active' : ''}`}
                style={{ fontSize: '12px', padding: '6px 14px', height: '36px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                🏠 Home Featured ({stats.homeFeaturedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('approved')}
                className={`admin-chip ${statusFilter === 'approved' ? 'active' : ''}`}
                style={{ fontSize: '12px', padding: '6px 14px', height: '36px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                ✅ Approved ({stats.approvedCount})
              </button>
              {stats.pendingCount > 0 && (
                <button
                  type="button"
                  onClick={() => setStatusFilter('pending')}
                  className={`admin-chip ${statusFilter === 'pending' ? 'active' : ''}`}
                  style={{ fontSize: '12px', padding: '6px 14px', height: '36px', display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}
                >
                  ⏳ Pending ({stats.pendingCount})
                </button>
              )}
              <button
                type="button"
                onClick={() => setStatusFilter('5star')}
                className={`admin-chip ${statusFilter === '5star' ? 'active' : ''}`}
                style={{ fontSize: '12px', padding: '6px 14px', height: '36px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                ⭐ 5 Stars ({stats.distribution[5] || 0})
              </button>
            </div>
          </div>
        </Card>

        {/* Reviews Grid List */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} style={{ height: '240px', borderRadius: '12px' }} />
            ))}
          </div>
        ) : filteredReviews.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredReviews.map(rev => {
              const initials = rev.avatar_text || getInitials(rev.name);
              const bg = rev.avatar_bg || getAvatarBg(rev.name);
              const isApproved = rev.status === 'approved';
              const isPending = rev.status === 'pending';
              const formattedDate = rev.created_at
                ? new Date(rev.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : null;

              return (
                <Card
                  key={rev.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px',
                    borderRadius: '12px',
                    justifyContent: 'space-between',
                    gap: '14px',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Header Row: Reviewer Info + Home Toggle */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', minWidth: 0, flex: 1 }}>
                        {/* Avatar */}
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background: rev.avatar_url ? 'transparent' : bg,
                          color: '#ffffff',
                          fontWeight: '800',
                          fontSize: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: '2px solid rgba(255, 255, 255, 0.15)'
                        }}>
                          {rev.avatar_url ? (
                            <img src={rev.avatar_url} alt={rev.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            initials
                          )}
                        </div>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <h3
                            style={{
                              fontSize: '15px',
                              fontWeight: '800',
                              margin: '0 0 4px 0',
                              color: 'var(--txt-primary)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            title={rev.name}
                          >
                            {rev.name}
                          </h3>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              background: isApproved
                                ? 'rgba(16, 185, 129, 0.12)'
                                : isPending
                                ? 'rgba(245, 158, 11, 0.12)'
                                : 'rgba(239, 68, 68, 0.12)',
                              color: isApproved
                                ? '#10b981'
                                : isPending
                                ? '#f59e0b'
                                : '#ef4444'
                            }}>
                              {rev.status || 'approved'}
                            </span>

                            {rev.email && (
                              <span
                                style={{
                                  fontSize: '11px',
                                  color: 'var(--txt-muted)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  maxWidth: '140px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                                title={rev.email}
                              >
                                <span className="material-icons" style={{ fontSize: '12px' }}>mail_outline</span>
                                {rev.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Home Showcase Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleHomeVisibility(rev, e)}
                        title={rev.show_in_home ? 'Featured on Homepage Slider (Click to remove)' : 'Not on Homepage (Click to feature)'}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: rev.show_in_home ? 'var(--brand-primary, #6366f1)' : 'var(--sys-surface-hover)',
                          border: rev.show_in_home ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid var(--sys-divider)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: rev.show_in_home ? '#ffffff' : 'var(--txt-muted)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          flexShrink: 0
                        }}
                      >
                        <span className="material-icons" style={{ fontSize: '17px' }}>home</span>
                      </button>
                    </div>

                    {/* Star Rating + Service Tag */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b' }}>
                        {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                          <span key={i} className="material-icons" style={{ fontSize: '16px' }}>star</span>
                        ))}
                        <span style={{ fontSize: '11.5px', fontWeight: '700', marginLeft: '4px', color: '#f59e0b' }}>
                          {Number(rev.rating || 5).toFixed(1)}
                        </span>
                      </div>

                      {rev.project && (
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 9px',
                          borderRadius: '12px',
                          background: 'rgba(56, 189, 248, 0.1)',
                          color: 'var(--accent-blue, #38bdf8)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          maxWidth: '200px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }} title={rev.project}>
                          <span className="material-icons" style={{ fontSize: '13px' }}>
                            {rev.project.includes('3D') && rev.project.includes('Project')
                              ? 'layers'
                              : rev.project.includes('3D')
                              ? 'view_in_ar'
                              : 'memory'}
                          </span>
                          {rev.project}
                        </span>
                      )}
                    </div>

                    {/* Quote Text */}
                    <p style={{
                      fontSize: '13px',
                      lineHeight: 1.6,
                      color: 'var(--txt-secondary)',
                      margin: 0,
                      fontStyle: 'italic'
                    }}>
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Footer Bar: Date & Actions */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--sys-divider)',
                    marginTop: '6px'
                  }}>
                    {/* Date Tag */}
                    <div>
                      {formattedDate && (
                        <span style={{ fontSize: '11.5px', color: 'var(--txt-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span className="material-icons" style={{ fontSize: '13px' }}>calendar_today</span>
                          {formattedDate}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {isPending && (
                        <Button
                          variant="secondary"
                          onClick={(e) => handleQuickStatusChange(rev, 'approved', e)}
                          style={{ padding: '4px 8px', height: '26px', fontSize: '11px', color: '#10b981' }}
                        >
                          Approve
                        </Button>
                      )}

                      <Button
                        variant="secondary"
                        onClick={(e) => handleOpenEditModal(rev, e)}
                        style={{ padding: '4px 8px', height: '26px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span className="material-icons" style={{ fontSize: '13px' }}>edit</span>
                        Edit
                      </Button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(rev);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--txt-muted)',
                          padding: '4px 6px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color 0.2s ease, background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--status-danger, #ef4444)';
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--txt-muted)';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="Delete Review"
                      >
                        <span className="material-icons" style={{ fontSize: '16px' }}>delete</span>
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="marketplace-empty-state active" style={{ padding: '60px 20px', textAlign: 'center', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <span className="material-icons-outlined" style={{ fontSize: '48px', color: 'var(--txt-muted)', marginBottom: '12px' }}>rate_review</span>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: 'var(--txt-primary)' }}>No reviews found</h3>
            <p style={{ fontSize: '13px', color: 'var(--txt-muted)', margin: '0 0 20px 0' }}>
              {searchQuery ? 'Try clearing your search query or changing filters.' : 'Collect your first review by sharing the feedback link with your clients.'}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button variant="outline" onClick={handleCopyFeedbackLink}>
                📋 Copy Feedback Link
              </Button>
              <Button variant="primary" onClick={handleOpenAddModal}>
                + Add Review Manually
              </Button>
            </div>
          </div>
        )}

        {/* Add / Edit Review Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => !isSaving && setIsModalOpen(false)}
          className="modal-content purple"
          style={{ maxWidth: '620px', width: '92%', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-icons" style={{ color: 'var(--brand-primary)', fontSize: '22px' }}>rate_review</span>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--txt-primary)' }}>
                {editingReview ? 'Edit Customer Review' : 'Add Customer Review'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
              style={{ background: 'transparent', border: 'none', color: 'var(--txt-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <span className="material-icons">close</span>
            </button>
          </div>

          <form onSubmit={handleSaveReview} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* 1. Overall Satisfaction Rating */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              borderRadius: '12px',
              background: 'var(--sys-surface-hover)',
              border: '1px solid var(--sys-divider)',
              textAlign: 'center'
            }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)', marginBottom: '8px' }}>
                Overall Satisfaction Rating *
              </label>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || formRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px',
                        color: active ? '#f59e0b' : 'var(--txt-muted)',
                        transform: active ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s ease, color 0.15s ease'
                      }}
                      title={`${star} Star${star > 1 ? 's' : ''}`}
                    >
                      <span className="material-icons" style={{ fontSize: '28px' }}>
                        {active ? 'star' : 'star_border'}
                      </span>
                    </button>
                  );
                })}
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: '600', color: '#f59e0b' }}>
                {RATING_DESCRIPTIONS[hoverRating || formRating]}
              </span>
            </div>

            {/* 2. Customer Name & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)', marginBottom: '6px' }}>
                  Customer Name *
                </label>
                <Input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Akash Sharma"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  style={{ width: '100%', height: '40px', fontSize: '13px' }}
                />
              </div>

              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)', marginBottom: '6px' }}>
                  Email Address <span style={{ color: 'var(--txt-muted)', fontWeight: '400' }}>(Optional)</span>
                </label>
                <Input
                  type="email"
                  className="form-input"
                  placeholder="e.g. akash@example.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  style={{ width: '100%', height: '40px', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* 3. Product or Service Experienced */}
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '10px'
              }}>
                {/* 3D Printing Option */}
                <div
                  onClick={() => toggleService('3D Printing')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: selectedServices.includes('3D Printing')
                      ? '2px solid var(--brand-primary, #6366f1)'
                      : '1px solid var(--sys-divider)',
                    background: selectedServices.includes('3D Printing')
                      ? 'rgba(99, 102, 241, 0.08)'
                      : 'var(--sys-surface-hover)',
                    boxShadow: selectedServices.includes('3D Printing')
                      ? '0 0 10px rgba(99, 102, 241, 0.2)'
                      : 'none',
                    transition: 'all 0.2s ease',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: selectedServices.includes('3D Printing') ? 'rgba(99, 102, 241, 0.15)' : 'var(--sys-surface)',
                      color: selectedServices.includes('3D Printing') ? 'var(--brand-primary, #6366f1)' : 'var(--txt-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-icons" style={{ fontSize: '18px' }}>view_in_ar</span>
                    </div>
                    <div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: selectedServices.includes('3D Printing') ? 'var(--brand-primary, #6366f1)' : 'var(--txt-primary)'
                      }}>
                        3D Printing
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--txt-muted)' }}>
                        Custom prints & parts
                      </div>
                    </div>
                  </div>

                  <span
                    className="material-icons"
                    style={{
                      fontSize: '20px',
                      color: selectedServices.includes('3D Printing') ? 'var(--brand-primary, #6366f1)' : 'var(--txt-muted)'
                    }}
                  >
                    {selectedServices.includes('3D Printing') ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>

                {/* Project Option */}
                <div
                  onClick={() => toggleService('Project')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: selectedServices.includes('Project')
                      ? '2px solid var(--brand-primary, #6366f1)'
                      : '1px solid var(--sys-divider)',
                    background: selectedServices.includes('Project')
                      ? 'rgba(99, 102, 241, 0.08)'
                      : 'var(--sys-surface-hover)',
                    boxShadow: selectedServices.includes('Project')
                      ? '0 0 10px rgba(99, 102, 241, 0.2)'
                      : 'none',
                    transition: 'all 0.2s ease',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: selectedServices.includes('Project') ? 'rgba(99, 102, 241, 0.15)' : 'var(--sys-surface)',
                      color: selectedServices.includes('Project') ? 'var(--brand-primary, #6366f1)' : 'var(--txt-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-icons" style={{ fontSize: '18px' }}>memory</span>
                    </div>
                    <div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: selectedServices.includes('Project') ? 'var(--brand-primary, #6366f1)' : 'var(--txt-primary)'
                      }}>
                        Project
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--txt-muted)' }}>
                        Hardware & engineering builds
                      </div>
                    </div>
                  </div>

                  <span
                    className="material-icons"
                    style={{
                      fontSize: '20px',
                      color: selectedServices.includes('Project') ? 'var(--brand-primary, #6366f1)' : 'var(--txt-muted)'
                    }}
                  >
                    {selectedServices.includes('Project') ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Detailed Review & Feedback */}
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)', marginBottom: '6px' }}>
                Detailed Review & Feedback *
              </label>
              <textarea
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                rows={3}
                className="form-textarea"
                placeholder="Enter client testimonial text (print precision, schematics, delivery speed, mentor support)..."
                required
                style={{ width: '100%', fontSize: '13px', lineHeight: 1.6, padding: '10px 12px' }}
              />
            </div>

            {/* 5. Image Attachment (Max 1 image, < 2MB) */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)' }}>
                  Attach Image <span style={{ color: 'var(--txt-muted)', fontWeight: '400' }}>(Optional)</span>
                </label>
                <span style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>
                  Max 1 image • Under 2MB
                </span>
              </div>

              {formAvatarUrl ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'var(--sys-surface-hover)',
                  border: '1px solid var(--sys-divider)',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: '#0f172a',
                      flexShrink: 0
                    }}>
                      <img src={formAvatarUrl} alt="Review attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--txt-primary)' }}>
                        Image attached
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--flyen-teal, #10b981)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                        <span className="material-icons" style={{ fontSize: '12px' }}>check_circle</span>
                        Ready to save (&lt; 2MB)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <label style={{
                      cursor: 'pointer',
                      fontSize: '11px',
                      color: 'var(--accent-blue, #38bdf8)',
                      fontWeight: '700',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      background: 'rgba(56, 189, 248, 0.08)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span className="material-icons" style={{ fontSize: '13px' }}>change_circle</span>
                      Change
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        style={{ display: 'none' }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        cursor: 'pointer',
                        fontSize: '11px',
                        color: '#ef4444',
                        fontWeight: '700',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        background: 'rgba(239, 68, 68, 0.08)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: '13px' }}>delete_outline</span>
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 14px',
                  borderRadius: '8px',
                  background: 'var(--sys-surface-hover)',
                  border: '1px dashed var(--sys-border)',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}>
                  <span className="material-icons" style={{ fontSize: '22px', color: 'var(--brand-primary, #6366f1)', marginBottom: '4px' }}>
                    {isUploading ? 'hourglass_top' : 'add_photo_alternate'}
                  </span>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--txt-primary)' }}>
                    {isUploading ? 'Uploading Image...' : 'Click to Attach 1 Image'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--txt-muted)', marginTop: '2px' }}>
                    PNG, JPG, WEBP • Max 2MB
                  </div>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>

            {/* 6. Moderation Status & Feature on Home Screen */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              
              {/* Moderation Status */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)', marginBottom: '6px' }}>
                  Moderation Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="form-select"
                  style={{ width: '100%', height: '40px', fontSize: '13px' }}
                >
                  <option value="approved">Approved (Active)</option>
                  <option value="pending">Pending Moderation</option>
                  <option value="rejected">Rejected (Hidden)</option>
                </select>
              </div>

              {/* Feature on Home Screen Option */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'var(--sys-surface-hover)',
                border: '1px solid var(--sys-divider)'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--txt-primary)' }}>Feature on Home Screen</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--txt-muted)', marginTop: '1px' }}>Show in home slider</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={formShowInHome}
                    onChange={(e) => setFormShowInHome(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: formShowInHome ? 'var(--brand-primary)' : '#4b5563',
                    transition: '0.3s',
                    borderRadius: '22px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      height: '16px',
                      width: '16px',
                      left: formShowInHome ? '21px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: '0.3s',
                      borderRadius: '50%'
                    }} />
                  </span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSaving || isUploading}>
                {isSaving ? 'Saving...' : (editingReview ? 'Update Review' : 'Save Review')}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => !isDeleting && setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Customer Review"
          message={`Are you sure you want to delete the review by "${deleteTarget?.name}"? This action cannot be undone.`}
          confirmLabel="Delete Review"
          isLoading={isDeleting}
        />
      </motion.div>
    </div>
  );
};
