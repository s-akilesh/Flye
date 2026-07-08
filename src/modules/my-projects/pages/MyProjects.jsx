import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/context/AuthContext';
import { useProjects } from '../../projects/hooks/useProjects';
import { enquiryService } from '../../enquiries/services/enquiryService';
import { Button } from '../../../shared/components/ui/Button';
import { Card } from '../../../shared/components/ui/Card';
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

  // 1. Guest Redirect View
  if (!loading && !user) {
    return (
      <div 
        style={{ 
          minHeight: '70vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: 'var(--page-padding)',
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
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(10, 10, 15, 0.8)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
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
            color: 'var(--accent-violet, #8b5cf6)'
          }}>
            <span className="material-icons-outlined" style={{ fontSize: '32px' }}>lock</span>
          </div>
          <h3 style={{ fontSize: '22px', color: '#fff', margin: '0 0 12px 0', fontWeight: '700' }}>Sign In Required</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary, #9ca3af)', lineHeight: '1.6', margin: '0 0 32px 0' }}>
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
          padding: 'var(--page-padding)',
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
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(10, 10, 15, 0.8)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            color: 'var(--text-muted, #6b7280)'
          }}>
            <span className="material-icons-outlined" style={{ fontSize: '32px' }}>folder_off</span>
          </div>
          <h3 style={{ fontSize: '22px', color: '#fff', margin: '0 0 12px 0', fontWeight: '700' }}>No Projects Yet</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary, #9ca3af)', lineHeight: '1.6', margin: '0 0 32px 0' }}>
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
      
      <section className="portal-section" style={{ padding: 'var(--page-padding) 0', minHeight: '80vh', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          
          <div className="portal-header" style={{ marginBottom: '32px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>My Enquiries</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary, #9ca3af)', margin: 0 }}>Visual logs and tracker for your submitted custom fabrication leads</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {enquiries.map((enq) => {
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
              }) : createdDate;

              // Support Requested text
              const supportRequested = [
                parsed.needDocument === 'Yes' ? 'Docs' : '',
                parsed.needPresentation === 'Yes' ? 'PPT' : ''
              ].filter(Boolean).join(', ') || 'None';

              return (
                <Card 
                  key={enq.id} 
                  className="project-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '24px',
                    minHeight: '240px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    textAlign: 'left'
                  }}
                >
                  <div>
                    {/* Status Badge & ID */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-muted, #6b7280)' }}>
                        ID: {enq.id}
                      </span>
                      <span 
                        style={{ 
                          fontSize: '11px', 
                          fontWeight: '600', 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          background: statusStyling.bg, 
                          color: statusStyling.text,
                          border: `1px solid ${statusStyling.text}25`
                        }}
                      >
                        {getStatusLabel(enq.status)}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                      {enq.projectTitle || 'Custom Fabrication Enquiry'}
                    </h4>

                    {/* Properties */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '12px', color: 'var(--text-secondary, #9ca3af)', marginBottom: '16px' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted, #6b7280)' }}>Category:</span><br />
                        <span style={{ color: '#fff', fontWeight: 500 }}>{relatedProject?.category || 'Custom Lead'}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted, #6b7280)' }}>Budget:</span><br />
                        <span style={{ color: '#fff', fontWeight: 500 }}>₹{enq.price || parsed.budget || 'TBD'}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted, #6b7280)' }}>Submitted:</span><br />
                        <span style={{ color: '#fff' }}>{createdDate}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted, #6b7280)' }}>Expected Date:</span><br />
                        <span style={{ color: 'var(--accent-blue, #60a5fa)', fontWeight: 500 }}>{parsed.submissionDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Last Updated */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '16px', marginTop: '8px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted, #6b7280)' }}>
                      Updated: {updatedDate}
                    </span>
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
        </div>
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
