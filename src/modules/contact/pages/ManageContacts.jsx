import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContacts } from '../hooks/useContacts';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
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
  new: { bg: 'var(--interaction-hover)', color: 'var(--status-warning)', border: 'var(--sys-border)' },
  in_progress: { bg: 'var(--interaction-hover)', color: 'var(--brand-accent)', border: 'var(--sys-border)' },
  resolved: { bg: 'var(--interaction-selected)', color: 'var(--status-success)', border: 'var(--sys-border)' },
  closed: { bg: 'var(--interaction-hover)', color: 'var(--txt-muted)', border: 'var(--sys-border)' }
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

  // Staged Filter state (for drawer applying/resetting)
  const [stagedStatusFilter, setStagedStatusFilter] = useState('all');
  const [stagedCategoryFilter, setStagedCategoryFilter] = useState('all');
  const [stagedStartDate, setStagedStartDate] = useState('');
  const [stagedEndDate, setStagedEndDate] = useState('');
  const [sortField, setSortField] = useState('date-desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, categoryFilter, startDate, endDate]);

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

  const sortedContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => {
      if (sortField === 'date-desc') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortField === 'date-asc') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortField === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [filteredContacts, sortField]);

  const totalPages = Math.ceil(sortedContacts.length / itemsPerPage);
  const paginatedContacts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedContacts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedContacts, currentPage, itemsPerPage]);

  const handleApplyFilters = () => {
    setStatusFilter(stagedStatusFilter);
    setCategoryFilter(stagedCategoryFilter);
    setStartDate(stagedStartDate);
    setEndDate(stagedEndDate);
  };

  const handleResetFilters = () => {
    setStagedStatusFilter('all');
    setStagedCategoryFilter('all');
    setStagedStartDate('');
    setStagedEndDate('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setStartDate('');
    setEndDate('');
    setSearch('');
  };

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
      </div>      <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Main Table/Grid */}
        <Card style={{ background: 'var(--sys-surface)', border: '1px solid var(--sys-border)', padding: 0, overflow: 'hidden' }}>
        
        <AdminToolbar
          searchId="contact-search"
          searchLabel="Search Contacts"
          searchPlaceholder="Search name, mobile, email..."
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          activeFilterCount={
            (statusFilter !== 'all' ? 1 : 0) +
            (categoryFilter !== 'all' ? 1 : 0) +
            (startDate ? 1 : 0) +
            (endDate ? 1 : 0)
          }
          sortValue={sortField}
          onSortChange={(e) => setSortField(e.target.value)}
          sortOptions={[
            { value: 'date-desc', label: 'Newest First' },
            { value: 'date-asc', label: 'Oldest First' },
            { value: 'name', label: 'Name' },
          ]}
          onReset={handleResetFilters}
          onApply={handleApplyFilters}
          className="admin-toolbar-wrapper"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderBottom: '1px solid var(--sys-border)', position: 'relative', zIndex: 10 }}
        >
          {/* Filter Panel Content */}
          <div className="admin-filter-panel-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="calc-row">
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</label>
              <div className="admin-chip-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setStagedStatusFilter('all')}
                  className={`admin-chip ${stagedStatusFilter === 'all' ? 'active' : ''}`}
                >
                  All
                </button>
                {STATUS_WORKFLOW.map(k => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setStagedStatusFilter(k)}
                    className={`admin-chip ${stagedStatusFilter === k ? 'active' : ''}`}
                  >
                    {STATUS_LABELS[k]}
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-row">
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Category</label>
              <select
                className="form-input"
                value={stagedCategoryFilter}
                onChange={(e) => setStagedCategoryFilter(e.target.value)}
                style={{ width: '100%', padding: '10px 14px' }}
              >
                <option value="all" style={{ background: 'var(--sys-surface-elevated)', color: 'var(--txt-primary)' }}>All Categories</option>
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat} style={{ background: 'var(--sys-surface-elevated)', color: 'var(--txt-primary)' }}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="calc-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>From Date</label>
                <Input
                  type="date"
                  value={stagedStartDate}
                  onChange={(e) => setStagedStartDate(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>To Date</label>
                <Input
                  type="date"
                  value={stagedEndDate}
                  onChange={(e) => setStagedEndDate(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </AdminToolbar>

        {isLoading ? (
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <Skeleton style={{ width: '20px', height: '16px', borderRadius: '4px' }} />
                  <Skeleton style={{ flex: 2, height: '16px', borderRadius: '4px' }} />
                  <Skeleton style={{ flex: 1, height: '16px', borderRadius: '4px' }} />
                  <Skeleton style={{ flex: 1, height: '16px', borderRadius: '4px' }} />
                  <Skeleton style={{ width: '100px', height: '16px', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--txt-muted)' }}>
            No contact submissions found matching the criteria.
          </div>
        ) : (
          <>
            <div className="tbl-scroll-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--sys-divider)', background: 'var(--sys-surface-elevated)' }}>
                  <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--txt-muted)', fontWeight: '700' }}>Name</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--txt-muted)', fontWeight: '700' }}>Mobile Number</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--txt-muted)', fontWeight: '700' }}>Email</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--txt-muted)', fontWeight: '700' }}>Category</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--txt-muted)', fontWeight: '700' }}>Subject</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--txt-muted)', fontWeight: '700' }}>Status</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--txt-muted)', fontWeight: '700' }}>Submitted Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContacts.map((contact) => {
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
                        borderBottom: '1px solid var(--sys-divider)', 
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      className="admin-table-row"
                    >
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--txt-primary)', fontWeight: '600' }}>{contact.name}</td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--txt-secondary)' }}>{contact.mobileNumber}</td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--txt-secondary)' }}>{contact.email}</td>
                      <td style={{ padding: '16px 20px', fontSize: '12px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'var(--interaction-hover)', color: 'var(--txt-secondary)', fontSize: '11px' }}>
                          {contact.category}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--txt-primary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--txt-muted)' }}>{dateStr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--sys-divider)', background: 'var(--sys-surface-elevated)', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--txt-muted)' }}>
                Showing Page {currentPage} of {totalPages || 1} ({filteredContacts.length} contacts found)
              </span>
              <span style={{ fontSize: '12.5px', color: 'var(--txt-muted)' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--txt-muted)' }}>Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="form-input"
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    height: '28px',
                    width: '70px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--sys-border)',
                    borderRadius: '4px',
                    color: 'var(--txt-primary)'
                  }}
                >
                  <option value="10" style={{ background: 'var(--sys-surface-elevated)', color: 'var(--txt-primary)' }}>10</option>
                  <option value="25" style={{ background: 'var(--sys-surface-elevated)', color: 'var(--txt-primary)' }}>25</option>
                  <option value="50" style={{ background: 'var(--sys-surface-elevated)', color: 'var(--txt-primary)' }}>50</option>
                  <option value="100" style={{ background: 'var(--sys-surface-elevated)', color: 'var(--txt-primary)' }}>100</option>
                </select>
              </div>
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  variant="secondary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', borderBottom: '1px solid var(--sys-divider)', paddingBottom: '20px', textAlign: 'left' }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'left' }}>Name</span>
                <span style={{ fontSize: '14px', color: 'var(--txt-primary)', fontWeight: '600', textAlign: 'left' }}>{selectedContact.name}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'left' }}>Mobile Number</span>
                <span style={{ fontSize: '14px', color: 'var(--txt-primary)', fontWeight: '600', textAlign: 'left' }}>{selectedContact.mobileNumber}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'left' }}>Email Address</span>
                <span style={{ fontSize: '14px', color: 'var(--txt-primary)', fontWeight: '600', textAlign: 'left' }}>{selectedContact.email}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'left' }}>Submitted Date</span>
                <span style={{ fontSize: '14px', color: 'var(--txt-secondary)', textAlign: 'left' }}>
                  {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString('en-IN') : '-'}
                </span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'left' }}>Category</span>
                <span style={{ fontSize: '13px', color: 'var(--brand-primary)', fontWeight: '600', textAlign: 'left' }}>{selectedContact.category}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'left' }}>Last Updated</span>
                <span style={{ fontSize: '14px', color: 'var(--txt-secondary)', textAlign: 'left' }}>
                  {selectedContact.updatedAt ? new Date(selectedContact.updatedAt).toLocaleString('en-IN') : '-'}
                </span>
              </div>
            </div>

            {/* Subject */}
            <div style={{ width: '100%', textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase', marginBottom: '6px', textAlign: 'left' }}>Subject / Title</span>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--txt-primary)', margin: 0, textAlign: 'left', wordBreak: 'break-word' }}>{selectedContact.subject}</h4>
            </div>

            {/* Message Body */}
            <div>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Message</span>
              <div style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--sys-border)',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '13px',
                color: 'var(--txt-secondary)',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedContact.message}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '10px' }}>
              
              {/* Status workflow */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Status Workflow</span>
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                  style={{
                    height: '38px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--sys-border)',
                    color: 'var(--txt-primary)',
                    borderRadius: '6px',
                    padding: '0 12px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {STATUS_WORKFLOW.map(st => (
                    <option key={st} value={st} style={{ background: 'var(--sys-surface-elevated)', color: 'var(--txt-primary)' }}>{STATUS_LABELS[st]}</option>
                  ))}
                </select>
              </div>

              {/* Assigned To - Future Ready */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Assigned To (Future Ready)</span>
                <select
                  disabled
                  value=""
                  style={{
                    height: '38px',
                    background: 'var(--interaction-disabled)',
                    border: '1px solid var(--sys-border)',
                    color: 'var(--txt-muted)',
                    borderRadius: '6px',
                    padding: '0 12px',
                    outline: 'none',
                    cursor: 'not-allowed'
                  }}
                >
                  <option value="" style={{ background: 'var(--sys-surface-elevated)', color: 'var(--txt-muted)' }}>Unassigned</option>
                </select>
              </div>

            </div>

            {/* Internal Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>Internal Notes</span>
              <textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Add private logging notes and tracking history here..."
                style={{
                  minHeight: '80px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--sys-border)',
                  borderRadius: '6px',
                  color: 'var(--txt-primary)',
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--sys-divider)', paddingTop: '16px' }}>
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
          background: var(--interaction-hover) !important;
        }
        .focus-glow-violet:focus {
          border-color: var(--brand-primary) !important;
          box-shadow: 0 0 8px var(--interaction-focus) !important;
        }
      `}</style>

    </motion.section>
  );
};
