import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { ProjectProgressTracker } from './ProjectProgressTracker';
import { storageService } from '../../../shared/services/storageService';
import { trackEvent } from '../../../shared/analytics/analytics.js';

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
    priority: 'Medium',
    attachments: []
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
    } else if (cleanLine.startsWith('Attachment:')) {
      const parts = cleanLine.replace('Attachment:', '').trim().split('|');
      if (parts.length >= 2) {
        data.attachments.push({ name: parts[0], url: parts[1] });
      } else if (parts[0]) {
        const filename = parts[0].split('/').pop() || 'Document';
        data.attachments.push({ name: filename, url: parts[0] });
      }
    }
  });

  return data;
};

export const ProjectDetailsModal = ({ isOpen, onClose, enquiry, projectInfo }) => {
  const [signedUrls, setSignedUrls] = useState({});
  const [loadingUrls, setLoadingUrls] = useState(false);

  useEffect(() => {
    const loadSignedUrls = async () => {
      if (!enquiry) return;
      setLoadingUrls(true);
      const parsed = parseNotes(enquiry.notes);
      const urls = {};
      for (const att of parsed.attachments) {
        if (att.url && !att.url.startsWith('http') && !att.url.startsWith('https')) {
          try {
            // Generate temporary secure signed URL
            const signed = await storageService.createSignedUrl('project-documents', att.url);
            urls[att.url] = signed;
          } catch (e) {
            console.error('Failed to get signed URL for:', att.url, e);
            urls[att.url] = att.url; // fallback to raw path
          }
        } else {
          urls[att.url] = att.url;
        }
      }
      setSignedUrls(urls);
      setLoadingUrls(false);
    };

    if (isOpen && enquiry) {
      loadSignedUrls();
      trackEvent('project_details_viewed', { 
        enquiry_id: enquiry.id,
        project_title: enquiry.projectTitle 
      });
    }
  }, [isOpen, enquiry]);

  if (!enquiry) return null;

  const parsed = parseNotes(enquiry.notes);
  const formattedDate = enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) : '-';

  const formattedUpdated = enquiry.updatedAt ? new Date(enquiry.updatedAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) : formattedDate;

  const handleDownloadClick = (fileName) => {
    trackEvent('attachment_downloaded', {
      enquiry_id: enquiry.id,
      file_name: fileName
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="modal-content purple" style={{ maxWidth: '800px', width: '90%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-violet)' }}>Project Tracking ID: {enquiry.id}</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '700', color: '#fff' }}>{enquiry.projectTitle || 'Custom Project Development'}</h3>
        </div>
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <span className="material-icons">close</span>
        </button>
      </div>

      <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px', textAlign: 'left' }}>
        {/* Progress Timeline */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>Production Roadmap</h4>
          <ProjectProgressTracker status={enquiry.status} />
        </div>

        <div className="modal-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Left Column: Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '16px' }}>
              <h5 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Enquiry Details</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                  <span style={{ color: 'var(--accent-violet)', fontWeight: 600, textTransform: 'capitalize' }}>{enquiry.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Budget Estimate:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>₹{enquiry.price || parsed.budget || 'TBD'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Submission Date:</span>
                  <span style={{ color: '#fff' }}>{formattedDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Expected Date:</span>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: 500 }}>{parsed.submissionDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Last Updated:</span>
                  <span style={{ color: '#fff' }}>{formattedUpdated}</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '16px' }}>
              <h5 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Academic Support</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Documentation Needed:</span>
                  <span style={{ color: '#fff' }}>{parsed.needDocument}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Presentation Support:</span>
                  <span style={{ color: '#fff' }}>{parsed.needPresentation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Project Context */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '16px', flex: 1 }}>
              <h5 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Specifications & Info</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Department</span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{projectInfo?.category || 'Electronics & Communications'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Core Technology</span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{projectInfo?.technology || 'Microcontrollers / Embedded Systems'}</span>
                </div>
                {enquiry.message && (
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Custom Description</span>
                    <p style={{ color: 'rgba(255,255,255,0.7)', margin: '4px 0 0 0', lineHeight: '1.4' }}>{enquiry.message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery */}
        {(parsed.deliveryPartner !== '-' || parsed.awbNumber !== '-') && (
          <div style={{ background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '8px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="material-icons-outlined" style={{ color: 'var(--accent-blue)', fontSize: '24px' }}>local_shipping</span>
            <div>
              <h5 style={{ fontSize: '13px', color: '#fff', margin: '0 0 4px 0', fontWeight: '600' }}>Shipping Information</h5>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Courier: <strong>{parsed.deliveryPartner}</strong> &bull; Tracking (AWB): <strong style={{ color: 'var(--accent-blue)' }}>{parsed.awbNumber}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Remarks */}
        {parsed.remarks && parsed.remarks !== 'None' && (
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
            <h5 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Engineer Remarks</h5>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>
              {parsed.remarks}
            </p>
          </div>
        )}

        {/* Secure Attachments */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '16px' }}>
          <h5 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Project Deliverables & Documents</h5>
          {parsed.attachments.length === 0 ? (
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No downloadable documents uploaded yet.</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {parsed.attachments.map((att, index) => {
                const downloadUrl = signedUrls[att.url] || att.url;
                return (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="material-icons-outlined" style={{ color: 'var(--accent-violet)', fontSize: '20px' }}>description</span>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>{att.name}</span>
                    </div>
                    {loadingUrls ? (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Securing link...</span>
                    ) : (
                      <a 
                        href={downloadUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={() => handleDownloadClick(att.name)}
                        style={{ textDecoration: 'none' }}
                      >
                        <Button variant="secondary" style={{ padding: '4px 12px', height: '28px', fontSize: '11px' }}>
                          Download
                        </Button>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
        <Button variant="secondary" onClick={onClose} style={{ padding: '8px 24px' }}>
          Close
        </Button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .modal-details-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </Modal>
  );
};
