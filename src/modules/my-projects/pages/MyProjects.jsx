import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/context/AuthContext';
import { useProjects } from '../../projects/hooks/useProjects';
import { enquiryService } from '../../enquiries/services/enquiryService';
import { Button } from '../../../shared/components/ui/Button';
import { Card } from '../../../shared/components/ui/Card';
import { Input } from '../../../shared/components/ui/Input';
import { ROUTES } from '../../../shared/constants/routes';
import { ProjectDetailsModal } from '../components/ProjectDetailsModal';
import { trackEvent } from '../../../shared/analytics/analytics.js';
import { SEO, PageType } from '../../../shared/seo';

const parseNotes = (notes) => {
  const data = {
    projectStatus: '-',
    budget: '-',
    submissionDate: '-',
    needDocument: '-',
    needPresentation: '-',
    remarks: '',
    deliveryPartner: '-',
    awbNumber: '-',
    priority: 'Medium'
  };

  if (!notes) return data;

  const lines = notes.split('\n');
  lines.forEach(line => {
    const cleanLine = line.trim();
    if (cleanLine.startsWith('Project Status:')) {
      data.projectStatus = cleanLine.replace('Project Status:', '').trim();
    } else if (cleanLine.startsWith('Budget:')) {
      data.budget = cleanLine.replace('Budget:', '').trim();
    } else if (cleanLine.startsWith('Submission Date:')) {
      data.submissionDate = cleanLine.replace('Submission Date:', '').trim();
    } else if (cleanLine.startsWith('Need Document:')) {
      data.needDocument = cleanLine.replace('Need Document:', '').trim();
    } else if (cleanLine.startsWith('Need Presentation Support:')) {
      data.needPresentation = cleanLine.replace('Need Presentation Support:', '').trim();
    } else if (cleanLine.startsWith('Delivery Partner:')) {
      data.deliveryPartner = cleanLine.replace('Delivery Partner:', '').trim();
    } else if (cleanLine.startsWith('AWB Number:')) {
      data.awbNumber = cleanLine.replace('AWB Number:', '').trim();
    } else if (cleanLine.startsWith('Remarks:')) {
      data.remarks = cleanLine.replace('Remarks:', '').trim();
    } else if (cleanLine.startsWith('Priority:')) {
      data.priority = cleanLine.replace('Priority:', '').trim();
    }
  });

  return data;
};

const getStatusColor = (status) => {
  const colors = {
    new: 'rgba(245, 158, 11, 0.15)',        // Amber
    contacted: 'rgba(59, 130, 246, 0.15)',  // Blue
    discussed: 'rgba(139, 92, 246, 0.15)',  // Violet
    quoted: 'rgba(6, 182, 212, 0.15)',     // Cyan
    confirmed: 'rgba(16, 185, 129, 0.15)',  // Emerald
    building: 'rgba(99, 102, 241, 0.15)',   // Indigo
    testing: 'rgba(236, 72, 153, 0.15)',    // Pink
    ready: 'rgba(20, 184, 166, 0.15)',      // Teal
    completed: 'rgba(34, 197, 94, 0.15)',   // Green
    cancelled: 'rgba(239, 68, 68, 0.15)'    // Crimson
  };
  const textColors = {
    new: '#f59e0b',
    contacted: '#3b82f6',
    discussed: '#8b5cf6',
    quoted: '#06b6d4',
    confirmed: '#10b981',
    building: '#6366f1',
    testing: '#ec4899',
    ready: '#14b8a6',
    completed: '#22c55e',
    cancelled: '#ef4444'
  };
  return {
    bg: colors[status] || 'rgba(255, 255, 255, 0.05)',
    text: textColors[status] || '#fff'
  };
};

const getStatusLabel = (status) => {
  const labels = {
    new: 'Submitted',
    contacted: 'Under Review',
    discussed: 'Under Review',
    quoted: 'Quotation Shared',
    confirmed: 'Confirmed',
    building: 'Project In Progress',
    testing: 'Testing',
    ready: 'Ready for Delivery',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };
  return labels[status] || status;
};

export const MyProjects = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { allProjects } = useProjects();
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Search and Date Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | '7days' | '30days' | '90days' | 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Track page view event
    trackEvent('my_projects_viewed');
  }, []);

  useEffect(() => {
    const fetchUserEnquiries = async () => {
      if (!user) return;
      try {
        setEnquiriesLoading(true);
        const data = await enquiryService.getUserEnquiries(user.id);
        setEnquiries(data);
      } catch (err) {
        console.error('Failed to load user enquiries:', err);
      } finally {
        setEnquiriesLoading(false);
      }
    };

    if (!loading && user) {
      fetchUserEnquiries();
    }
  }, [user, loading]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enq) => {
      // 1. Search Query
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const titleMatch = enq.projectTitle?.toLowerCase().includes(query);
        const idMatch = String(enq.id || '').toLowerCase().includes(query);
        const statusMatch = getStatusLabel(enq.status).toLowerCase().includes(query);
        const priceMatch = String(enq.price || '').toLowerCase().includes(query);
        const notesMatch = enq.notes?.toLowerCase().includes(query);
        if (!titleMatch && !idMatch && !statusMatch && !priceMatch && !notesMatch) {
          return false;
        }
      }

      // 2. Date Filter
      if (dateFilter !== 'all' && enq.createdAt) {
        const enqDate = new Date(enq.createdAt);
        const now = new Date();

        if (dateFilter === '7days') {
          const past7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (enqDate < past7) return false;
        } else if (dateFilter === '30days') {
          const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (enqDate < past30) return false;
        } else if (dateFilter === '90days') {
          const past90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          if (enqDate < past90) return false;
        } else if (dateFilter === 'custom') {
          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (enqDate < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (enqDate > end) return false;
          }
        }
      }

      return true;
    });
  }, [enquiries, searchQuery, dateFilter, startDate, endDate]);

  // 1. Guest Redirect View
  if (!loading && !user) {
    return (
      <div 
        style={{ 
          minHeight: '70vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '120px var(--page-padding) var(--page-padding) var(--page-padding)',
          boxSizing: 'border-box'
        }}
      >
        <div 
          style={{ 
            maxWidth: '480px', 
            width: '100%', 
            textAlign: 'center'
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            color: 'var(--brand-primary)'
          }}>
            <span className="material-icons-outlined" style={{ fontSize: '32px' }}>lock</span>
          </div>
          <h3 style={{ fontSize: '22px', color: 'var(--txt-primary)', margin: '0 0 12px 0', fontWeight: '700' }}>Sign In Required</h3>
          <p style={{ fontSize: '14px', color: 'var(--txt-secondary)', lineHeight: '1.6', margin: '0 0 32px 0' }}>
            Please sign in to view your submitted project enquiries and track their progress.
          </p>
          <Button 
            variant="primary" 
            onClick={() => navigate(`${ROUTES.STUDENT_AUTH}?redirect=${encodeURIComponent(ROUTES.MY_PROJECTS)}`)} 
            style={{ width: '100%', padding: '12px', fontWeight: '600' }}
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // 2. Loading State
  if (loading || (user && enquiriesLoading)) {
    return (
      <div style={{ padding: 'var(--page-padding)', minHeight: '80vh', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="portal-header" style={{ marginBottom: '32px' }}>
            <div style={{ width: '180px', height: '28px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '8px' }} className="skeleton-pulse"></div>
            <div style={{ width: '280px', height: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} className="skeleton-pulse"></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className="card-glass skeleton-pulse" 
                style={{ 
                  height: '240px', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              ></div>
            ))}
          </div>
        </div>
        <style>{`
          .skeleton-pulse {
            animation: pulse 1.5s infinite ease-in-out;
          }
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.3; }
            100% { opacity: 0.6; }
          }
        `}</style>
      </div>
    );
  }

  // 3. Empty State
  if (enquiries.length === 0) {
    return (
      <div 
        style={{ 
          minHeight: '75vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '120px var(--page-padding) var(--page-padding) var(--page-padding)',
          boxSizing: 'border-box'
        }}
      >
        <div 
          className="card-glass" 
          style={{ 
            maxWidth: '480px', 
            width: '100%', 
            padding: '48px 40px', 
            textAlign: 'center',
            borderRadius: '16px',
            border: '1px solid var(--sys-border)',
            background: 'var(--sys-surface)',
            boxShadow: '0 20px 40px var(--interaction-focus)'
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--interaction-hover)',
            border: '1px solid var(--sys-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            color: 'var(--txt-muted)'
          }}>
            <span className="material-icons-outlined" style={{ fontSize: '32px' }}>folder_off</span>
          </div>
          <h3 style={{ fontSize: '22px', color: 'var(--txt-primary)', margin: '0 0 12px 0', fontWeight: '700' }}>No Projects Yet</h3>
          <p style={{ fontSize: '14px', color: 'var(--txt-secondary)', lineHeight: '1.6', margin: '0 0 32px 0' }}>
            You haven't submitted any project enquiries yet. Explore our engineering project catalog.
          </p>
          <Button 
            variant="primary" 
            onClick={() => navigate(ROUTES.PROJECTS)} 
            style={{ width: '100%', padding: '12px', fontWeight: '600' }}
          >
            Explore Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="My Enquiries - Flyen"
        description="Track your submitted engineering projects and fabrication timeline progress."
        meta={[{ name: 'robots', content: 'noindex,nofollow' }]}
      />
      <style>{`
        @media (max-width: 768px) {
          .portal-section-my-enquiries {
            padding-top: 8px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-bottom: 80px !important;
          }
          .portal-section-my-enquiries .portal-header {
            margin-left: -16px !important;
            margin-right: -16px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-top: 8px !important;
            padding-bottom: 12px !important;
            margin-bottom: 16px !important;
          }
          .portal-section-my-enquiries .portal-title-area h2 {
            font-size: 18px !important;
            margin: 0 !important;
            font-weight: 700 !important;
          }
          .portal-section-my-enquiries .portal-title-area p {
            display: none !important;
          }
          .portal-section-my-enquiries .btn-back {
            width: 34px !important;
            height: 34px !important;
            min-width: 34px !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 8px !important;
          }
          .portal-section-my-enquiries .card-glass,
          .portal-section-my-enquiries .project-summary-card {
            padding: 16px !important;
          }
        }
      `}</style>
      
      <section className="portal-section portal-section-my-enquiries" style={{ paddingTop: '73px', paddingBottom: '80px', minHeight: '80vh', boxSizing: 'border-box' }}>
        <div
          className="portal-header"
          style={{
            width: 'auto',
            marginLeft: 'calc(-1 * var(--page-padding))',
            marginRight: 'calc(-1 * var(--page-padding))',
            paddingLeft: 'var(--page-padding)',
            paddingRight: 'var(--page-padding)',
            paddingTop: '16px',
            paddingBottom: '16px',
            background: '#ffffff',
            borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
            marginBottom: '32px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Button
              variant="secondary"
              className="btn-back"
              onClick={() => navigate(ROUTES.HOME)}
              style={{
                padding: '8px',
                minWidth: 'auto',
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid rgba(15, 23, 42, 0.12)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <span className="material-icons" style={{ fontSize: '20px' }}>arrow_back</span>
            </Button>
            <div className="portal-title-area">
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>My Enquiries</h2>
              <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>Visual logs and tracker for your submitted custom fabrication leads</p>
            </div>
          </div>
        </div>

        {/* Search & Date Filter Bar */}
        <Card style={{ padding: '16px 20px', marginBottom: '24px', borderRadius: '12px', border: '1px solid var(--sys-border)', background: 'var(--sys-surface)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              
              {/* Live Search Input */}
              <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
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
                  placeholder="Search by project title, ID, status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{
                    width: '100%',
                    height: '40px',
                    paddingLeft: '38px',
                    paddingRight: searchQuery ? '36px' : '14px',
                    fontSize: '13px',
                    background: 'var(--input-bg)',
                    borderRadius: '8px'
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

              {/* Date Filter & Clear Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* When Custom Date Range is selected, show From & To date pickers to the LEFT of the dropdown */}
                {dateFilter === 'custom' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)' }}>From:</span>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="form-input"
                        style={{
                          height: '40px',
                          padding: '0 10px',
                          fontSize: '12.5px',
                          borderRadius: '8px',
                          border: '1px solid var(--sys-border)',
                          background: 'var(--input-bg)',
                          color: 'var(--txt-primary)',
                          width: '140px'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--txt-secondary)' }}>To:</span>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="form-input"
                        style={{
                          height: '40px',
                          padding: '0 10px',
                          fontSize: '12.5px',
                          borderRadius: '8px',
                          border: '1px solid var(--sys-border)',
                          background: 'var(--input-bg)',
                          color: 'var(--txt-primary)',
                          width: '140px'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Styled Date Filter Dropdown */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span
                    className="material-icons"
                    style={{
                      position: 'absolute',
                      left: '12px',
                      color: 'var(--txt-muted)',
                      fontSize: '18px',
                      pointerEvents: 'none',
                      zIndex: 1
                    }}
                  >
                    calendar_today
                  </span>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="form-select"
                    style={{
                      height: '40px',
                      paddingLeft: '38px',
                      paddingRight: '32px',
                      fontSize: '13px',
                      fontWeight: '600',
                      borderRadius: '8px',
                      border: '1px solid var(--sys-border)',
                      background: 'var(--input-bg)',
                      color: 'var(--txt-primary)',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      minWidth: '160px'
                    }}
                  >
                    <option value="all">All Dates</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 3 Months</option>
                    <option value="custom">Custom Date Range</option>
                  </select>
                  <span
                    className="material-icons"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      color: 'var(--txt-muted)',
                      fontSize: '18px',
                      pointerEvents: 'none'
                    }}
                  >
                    expand_more
                  </span>
                </div>

                {(searchQuery || dateFilter !== 'all' || startDate || endDate) && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearchQuery('');
                      setDateFilter('all');
                      setStartDate('');
                      setEndDate('');
                    }}
                    style={{
                      height: '40px',
                      padding: '0 14px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      borderRadius: '8px'
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: '15px' }}>filter_alt_off</span>
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {filteredEnquiries.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {filteredEnquiries.map((enq) => {
              const parsed = parseNotes(enq.notes);
              const relatedProject = allProjects.find(p => p.id === enq.projectId);
              const statusStyling = getStatusColor(enq.status);
              
              const createdDate = enq.createdAt ? new Date(enq.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : '-';

              const updatedDate = enq.updatedAt ? new Date(enq.updatedAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : '-';

              return (
                <Card 
                  key={enq.id}
                  className="project-summary-card card-glass"
                  style={{
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid var(--sys-border)',
                    background: 'var(--sys-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '220px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'default'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--txt-muted)', fontFamily: 'monospace' }}>ID: {enq.id}</span>
                      <span 
                        style={{ 
                          fontSize: '11px', 
                          fontWeight: '700', 
                          padding: '4px 10px', 
                          borderRadius: '20px',
                          textTransform: 'capitalize',
                          background: statusStyling.bg,
                          color: statusStyling.text,
                          border: `1px solid ${statusStyling.text}25`
                        }}
                      >
                        {getStatusLabel(enq.status)}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--txt-primary)', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                      {enq.projectTitle || 'Custom Fabrication Enquiry'}
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px', marginBottom: '20px' }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Category:</span>
                        <span style={{ fontSize: '13px', color: 'var(--txt-secondary)', fontWeight: '600' }}>
                          {relatedProject?.category || 'Custom Lead'}
                        </span>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Budget:</span>
                        <span style={{ fontSize: '13px', color: 'var(--txt-secondary)', fontWeight: '600' }}>
                          {enq.price ? `₹${enq.price}` : 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Submitted:</span>
                        <span style={{ fontSize: '13px', color: 'var(--txt-secondary)' }}>{createdDate}</span>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Expected Date:</span>
                        <span style={{ fontSize: '13px', color: parsed.submissionDate !== '-' ? 'var(--txt-secondary)' : 'var(--txt-muted)' }}>
                          {parsed.submissionDate || '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--sys-divider)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>Updated: {updatedDate}</span>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => setSelectedEnquiry(enq)}
                      style={{ padding: '6px 16px', fontSize: '12px', height: '32px' }}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="marketplace-empty-state active" style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--sys-surface)', borderRadius: '16px', border: '1px solid var(--sys-border)' }}>
            <span className="material-icons-outlined" style={{ fontSize: '48px', color: 'var(--txt-muted)', marginBottom: '12px' }}>search_off</span>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: 'var(--txt-primary)' }}>No matching enquiries</h3>
            <p style={{ fontSize: '13px', color: 'var(--txt-muted)', margin: '0 0 20px 0' }}>
              No project enquiries match your current search query or date filter.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery('');
                setDateFilter('all');
                setStartDate('');
                setEndDate('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
        </section>

      {/* Details View Modal */}
      {selectedEnquiry && (
        <ProjectDetailsModal
          isOpen={selectedEnquiry !== null}
          onClose={() => setSelectedEnquiry(null)}
          enquiry={selectedEnquiry}
          projectInfo={allProjects.find(p => p.id === selectedEnquiry.projectId)}
        />
      )}
    </>
  );
};
