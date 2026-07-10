import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useContacts } from '../hooks/useContacts';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { AdminToolbar } from '../../../shared/components/ui/AdminToolbar';
import { useToast } from '../../../shared/context/ToastContext';
import { trackEvent } from '../../../shared/analytics';

const STATUS_WORKFLOW = ['new', 'in_progress', 'resolved', 'closed'];

const STATUS_LABELS = {
  new: 'New',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
};

const STATUS_COLORS = {
  new: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' },
  in_progress: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' },
  resolved: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'rgba(16, 185, 129, 0.2)' },
  closed: { bg: 'rgba(107, 114, 128, 0.1)', color: '#9ca3af', border: 'rgba(107, 114, 128, 0.2)' }
};

const CATEGORY_OPTIONS = [
  'Project Related Query',
  'Technical Support',
  'General Inquiry',
  'Partnership / Collaboration',
  'Feedback',
  'Complaint',
  'Suggestion',
  'Career / Internship',
  'Other'
];

export const ManageContacts = () => {
  const { contacts, isLoading, isProcessing, updateContact } = useContacts();
  const { showToast } = useToast();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selected contact for detail modal
  const [selectedContact, setSelectedContact] = useState(null);
  
  // Note edit state
  const [internalNote, setInternalNote] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState('');

  // Handle select contact
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setInternalNote(contact.internalNotes || '');
    setUpdatedStatus(contact.status);
    trackEvent('contact_view_admin', { contact_id: contact.id });
  };

  // Handle save updates
  const handleSaveUpdates = async () => {
    if (!selectedContact) return;
    try {
      const updated = await updateContact(selectedContact.id, {
        status: updatedStatus,
        internalNotes: internalNote
      });
      showToast('Contact updated successfully', 'success');
      setSelectedContact(updated);
    } catch (err) {
      showToast('Failed to update contact: ' + err.message, 'error');
    }
  };

  // Filtered contacts list
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // 1. Search Query Match
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        (contact.name || '').toLowerCase().includes(searchLower) ||
        (contact.mobileNumber || '').toLowerCase().includes(searchLower) ||
        (contact.email || '').toLowerCase().includes(searchLower) ||
        (contact.subject || '').toLowerCase().includes(searchLower);

      // 2. Status Match
      const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;

      // 3. Category Match
      const matchesCategory = categoryFilter === 'all' || contact.category === categoryFilter;

      // 4. Date Range Match
      let matchesDate = true;
      if (contact.createdAt) {
        const contactDate = new Date(contact.createdAt);
        contactDate.setHours(0, 0, 0, 0);

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (contactDate < start) matchesDate = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(0, 0, 0, 0);
          if (contactDate > end) matchesDate = false;
        }
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  }, [contacts, search, statusFilter, categoryFilter, startDate, endDate]);

  return (
    <motion.section
      id="manage-contacts-portal"
      className="portal-section page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
    >
      <div className="portal-header">
        <div className="portal-title-area">
          <h2>Manage Contacts</h2>
          <p>Audit, track, and resolve user submissions and collaboration queries</p>
        </div>
      </div>

      <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Main Table/Grid */}
        <Card style={{ background: 'rgba(10, 10, 15, 0.25)', border: '1px solid rgba(255,255,255,0.06)', padding: 0, overflow: 'hidden' }}>
        
        {/* Toolbar / Filters Panel inside the Table Card */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255, 255, 255, 0.01)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
            
            {/* Search bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase' }}>Search</label>
              <Input
                type="text"
                placeholder="Search name, mobile, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{
                  height: '38px',
                  background: 'rgba(15, 15, 25, 0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '0 12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Status filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase' }}>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  height: '38px',
                  background: 'rgba(15, 15, 25, 0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '0 12px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Statuses</option>
                {STATUS_WORKFLOW.map(st => (
                  <option key={st} value={st}>{STATUS_LABELS[st]}</option>
                ))}
              </select>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase' }}>Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  height: '38px',
                  background: 'rgba(15, 15, 25, 0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '0 12px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Categories</option>
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Date range picker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase' }}>From Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-input"
                style={{
                  height: '38px',
                  background: 'rgba(15, 15, 25, 0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '0 12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase' }}>To Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-input"
                style={{
                  height: '38px',
                  background: 'rgba(15, 15, 25, 0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '0 12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted, #6b7280)' }}>
            Loading contact requests...
          </div>
        ) : filteredContacts.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted, #6b7280)' }}>
            No contact submissions found matching the criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}>
                  <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #6b7280)', fontWeight: '700' }}>Name</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #6b7280)', fontWeight: '700' }}>Mobile Number</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #6b7280)', fontWeight: '700' }}>Email</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #6b7280)', fontWeight: '700' }}>Category</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #6b7280)', fontWeight: '700' }}>Subject</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #6b7280)', fontWeight: '700' }}>Status</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #6b7280)', fontWeight: '700' }}>Submitted Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => {
                  const statusColorsStyle = STATUS_COLORS[contact.status] || STATUS_COLORS.new;
                  const dateStr = contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }) : '-';
                  
                  return (
                    <tr 
                      key={contact.id} 
                      onClick={() => handleSelectContact(contact)}
                      style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.04)', 
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      className="admin-table-row"
                    >
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: '#fff', fontWeight: '600' }}>{contact.name}</td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-secondary, #d1d5db)' }}>{contact.mobileNumber}</td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-secondary, #d1d5db)' }}>{contact.email}</td>
                      <td style={{ padding: '16px 20px', fontSize: '12px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#d1d5db', fontSize: '11px' }}>
                          {contact.category}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: '#fff', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {contact.subject}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          textTransform: 'capitalize',
                          background: statusColorsStyle.bg,
                          color: statusColorsStyle.color,
                          border: `1px solid ${statusColorsStyle.border}`
                        }}>
                          {STATUS_LABELS[contact.status]}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-muted, #6b7280)' }}>{dateStr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>

      {/* Details View Drawer / Modal */}
      {selectedContact && (
        <Modal 
          isOpen={selectedContact !== null} 
          onClose={() => setSelectedContact(null)}
          title="Contact Submission Details"
          style={{ maxWidth: '680px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0', textAlign: 'left' }}>
            
            {/* Meta Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px', textAlign: 'left' }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'left' }}>Name</span>
                <span style={{ fontSize: '14px', color: '#fff', fontWeight: '600', textAlign: 'left' }}>{selectedContact.name}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'left' }}>Mobile Number</span>
                <span style={{ fontSize: '14px', color: '#fff', fontWeight: '600', textAlign: 'left' }}>{selectedContact.mobileNumber}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'left' }}>Email Address</span>
                <span style={{ fontSize: '14px', color: '#fff', fontWeight: '600', textAlign: 'left' }}>{selectedContact.email}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'left' }}>Submitted Date</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary, #d1d5db)', textAlign: 'left' }}>
                  {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString('en-IN') : '-'}
                </span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'left' }}>Category</span>
                <span style={{ fontSize: '13px', color: 'var(--accent-violet, #a78bfa)', fontWeight: '600', textAlign: 'left' }}>{selectedContact.category}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'left' }}>Last Updated</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary, #d1d5db)', textAlign: 'left' }}>
                  {selectedContact.updatedAt ? new Date(selectedContact.updatedAt).toLocaleString('en-IN') : '-'}
                </span>
              </div>
            </div>

            {/* Subject */}
            <div style={{ width: '100%', textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '6px', textAlign: 'left' }}>Subject / Title</span>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0, textAlign: 'left', wordBreak: 'break-word' }}>{selectedContact.subject}</h4>
            </div>

            {/* Message Body */}
            <div>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '6px' }}>Message</span>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '13px',
                color: 'var(--text-secondary, #d1d5db)',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedContact.message}
              </div>
            </div>

            {/* RLS / Management fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '10px' }}>
              
              {/* Status workflow */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase' }}>Status Workflow</span>
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                  style={{
                    height: '38px',
                    background: 'rgba(15, 15, 25, 0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '0 12px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {STATUS_WORKFLOW.map(st => (
                    <option key={st} value={st}>{STATUS_LABELS[st]}</option>
                  ))}
                </select>
              </div>

              {/* Assigned To - Future Ready */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase' }}>Assigned To (Future Ready)</span>
                <select
                  disabled
                  value=""
                  style={{
                    height: '38px',
                    background: 'rgba(15, 15, 25, 0.4)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    color: 'var(--text-muted, #6b7280)',
                    borderRadius: '6px',
                    padding: '0 12px',
                    outline: 'none',
                    cursor: 'not-allowed'
                  }}
                >
                  <option value="">Unassigned</option>
                </select>
              </div>

            </div>

            {/* Internal Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase' }}>Internal Notes</span>
              <textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Add private logging notes and tracking history here..."
                style={{
                  minHeight: '80px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '10px 14px',
                  fontSize: '13px',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                className="focus-glow-violet"
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
              <Button 
                variant="secondary" 
                onClick={() => setSelectedContact(null)}
                style={{ height: '36px', fontSize: '13px' }}
              >
                Close
              </Button>
              <Button 
                variant="primary" 
                disabled={isProcessing}
                onClick={handleSaveUpdates}
                style={{ height: '36px', fontSize: '13px' }}
              >
                {isProcessing ? 'Saving...' : 'Save Updates'}
              </Button>
            </div>

          </div>
        </Modal>
      )}

      {/* Embedded Table Style Overrides */}
      <style>{`
        .admin-table-row:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
        .focus-glow-violet:focus {
          border-color: #8b5cf6 !important;
          box-shadow: 0 0 8px rgba(139, 92, 246, 0.15) !important;
        }
      `}</style>

    </motion.section>
  );
};
