import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEnquiries } from '../hooks/useEnquiries';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { AdminToolbar } from '../components/ui/AdminToolbar';
import { ROUTES } from '../constants/routes';

export const ManageEnquiries = () => {
  const navigate = useNavigate();
  const { enquiries, updateEnquiry, deleteEnquiry } = useEnquiries();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortField, setSortField] = useState('date-desc');

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Deletion Modal State
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);

  // View Modal State
  const [activeEnquiry, setActiveEnquiry] = useState(null);

  // Edit Modal State
  const [enquiryToEdit, setEnquiryToEdit] = useState(null);
  const [editStatus, setEditStatus] = useState('new');
  const [editNotes, setEditNotes] = useState('');

  // Status Change handlers (inline table dropdown)
  const handleStatusChange = (id, newStatus) => {
    updateEnquiry(id, { status: newStatus });
  };

  // Open Edit modal helper
  const handleOpenEditModal = (enq) => {
    setEnquiryToEdit(enq);
    setEditStatus(enq.status || 'new');
    setEditNotes(enq.notes || '');
  };

  // Save changes inside Edit modal
  const handleSaveEditChanges = () => {
    if (!enquiryToEdit) return;
    updateEnquiry(enquiryToEdit.id, {
      status: editStatus,
      notes: editNotes
    });
    setEnquiryToEdit(null);
    alert('Enquiry details updated successfully.');
  };

  // Delete Action Handler
  const handleDeleteConfirm = () => {
    if (!enquiryToDelete) return;
    deleteEnquiry(enquiryToDelete.id);
    setSelectedIds((prev) => prev.filter((id) => id !== enquiryToDelete.id));
    setEnquiryToDelete(null);
  };

  // Bulk selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(sortedList.map((enq) => enq.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedIds.length === 0) {
      alert("No enquiries selected.");
      return;
    }

    if (action === 'delete') {
      const confirmDelete = window.confirm(`Are you sure you want to permanently delete the ${selectedIds.length} selected enquiry/enquiries?`);
      if (!confirmDelete) return;

      selectedIds.forEach((id) => {
        deleteEnquiry(id);
      });
      alert("Selected enquiries deleted successfully.");
    } else {
      // status updates
      selectedIds.forEach((id) => {
        updateEnquiry(id, { status: action });
      });
      alert(`Selected enquiries status updated to: ${action}`);
    }
    setSelectedIds([]);
  };

  // Filter Logic
  const filteredList = enquiries.filter((enq) => {
    // 1. Search Query (Project Name, Customer Name, Mobile Number)
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const matchesName = enq.name?.toLowerCase().includes(q);
      const matchesMobile = enq.mobile?.toLowerCase().includes(q);
      const matchesTitle = enq.projectTitle?.toLowerCase().includes(q);
      if (!matchesName && !matchesMobile && !matchesTitle) return false;
    }

    // 2. Status Filter
    if (statusFilter !== 'all' && enq.status !== statusFilter) return false;

    // 3. Date Filter (Today, Last 7 Days, Last 30 Days)
    if (dateFilter !== 'all') {
      const enqDate = new Date(enq.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === 'today') {
        if (enqDate < today) return false;
      } else if (dateFilter === '7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        if (enqDate < sevenDaysAgo) return false;
      } else if (dateFilter === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        if (enqDate < thirtyDaysAgo) return false;
      }
    }

    return true;
  });

  // Sorting
  const sortedList = [...filteredList].sort((a, b) => {
    if (sortField === 'date-desc') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortField === 'date-asc') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortField === 'name') {
      return (a.name || '').localeCompare(b.name || '');
    } else if (sortField === 'title') {
      return (a.projectTitle || '').localeCompare(b.projectTitle || '');
    }
    return 0;
  });

  // Compile KPI Counts
  const totalEnquiries = enquiries.length;
  const newCount = enquiries.filter((e) => e.status === 'new' || !e.status).length;
  const contactedCount = enquiries.filter((e) => e.status === 'contacted').length;
  const qualifiedCount = enquiries.filter((e) => e.status === 'qualified').length;
  const closedCount = enquiries.filter((e) => e.status === 'closed').length;

  const statusColors = {
    new: '#eab308',
    contacted: 'var(--accent-blue)',
    qualified: 'var(--accent-violet)',
    closed: 'var(--accent-emerald)'
  };

  const statusLabels = {
    new: '🟡 New',
    contacted: '🔵 Contacted',
    qualified: '🟣 Qualified',
    closed: '🟢 Closed'
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return 'N/A';
    return new Date(isoStr).toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <motion.section
      className="portal-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
    >
      <div className="portal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button variant="secondary" className="btn-back" onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)} style={{ padding: '8px', minWidth: 'auto' }}>
            <svg viewBox="0 0 24 24">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
            </svg>
          </Button>
          <div className="portal-title-area">
            <h2>Manage Enquiries</h2>
            <p>Visual log of customer requests for project kit fabrications</p>
          </div>
        </div>
      </div>

      <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* KPI Cards — 2-column grid */}
        <div className="admin-kpi-grid">
          <Card style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Enquiries</span>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', margin: 'var(--space-2) 0 0 0' }}>{totalEnquiries}</h3>
          </Card>
          <Card style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>🟡 New Enquiries</span>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-warning)', margin: 'var(--space-2) 0 0 0' }}>{newCount}</h3>
          </Card>
          <Card style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>🔵 Contacted</span>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-blue)', margin: 'var(--space-2) 0 0 0' }}>{contactedCount}</h3>
          </Card>
          <Card style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>🟣 Qualified</span>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-violet)', margin: 'var(--space-2) 0 0 0' }}>{qualifiedCount}</h3>
          </Card>
          <Card style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>🟢 Closed</span>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-emerald)', margin: 'var(--space-2) 0 0 0' }}>{closedCount}</h3>
          </Card>
        </div>

        {/* Toolbar: Search + Filter Icon + Sort Icon */}
        <AdminToolbar
          searchId="enquiry-search"
          searchLabel="Search Enquiries"
          searchPlaceholder="Search by title, customer name, mobile..."
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          activeFilterCount={
            (statusFilter !== 'all' ? 1 : 0) +
            (dateFilter !== 'all' ? 1 : 0)
          }
          sortValue={sortField}
          onSortChange={(e) => setSortField(e.target.value)}
          sortOptions={[
            { value: 'date-desc', label: 'Newest First' },
            { value: 'date-asc', label: 'Oldest First' },
            { value: 'name', label: 'Customer Name' },
            { value: 'title', label: 'Project Title' },
          ]}
        >
          {/* Filter panel content */}
          <div className="admin-filter-panel-grid">
            <div className="calc-row">
              <label htmlFor="enquiry-status">Status</label>
              <select id="enquiry-status" className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="calc-row">
              <label htmlFor="enquiry-date">Date Range</label>
              <select id="enquiry-date" className="form-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>
          </div>
        </AdminToolbar>

        {/* Bulk Actions Banner */}
        {selectedIds.length > 0 && (
          <div className="card-glass" style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--accent-violet)', background: 'rgba(124, 58, 237, 0.05)' }}>
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>
              Selected <strong style={{ color: 'var(--accent-violet)' }}>{selectedIds.length}</strong> enquiry/enquiries
            </span>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleBulkAction('new')}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                🟡 Mark New
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleBulkAction('contacted')}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                🔵 Mark Contacted
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleBulkAction('qualified')}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                🟣 Mark Qualified
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleBulkAction('closed')}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                🟢 Mark Closed
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleBulkAction('delete')}
                style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-crimson, #ef4444)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
              >
                🗑 Delete
              </Button>
            </div>
          </div>
        )}

        {/* Tabular Visual Grid */}
        {sortedList.length > 0 ? (
          <div className="card-glass" style={{ overflowX: 'auto', padding: 'var(--space-4)' }}>
            <table style={{ width: '100%', minWidth: 'max-content', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', width: '36px', minWidth: '36px' }}>
                    <input
                      type="checkbox"
                      className="tbl-checkbox"
                      checked={sortedList.length > 0 && selectedIds.length === sortedList.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="tbl-th" style={{ minWidth: '150px', maxWidth: '210px' }}>Project</th>
                  <th className="tbl-th" style={{ minWidth: '110px', maxWidth: '150px' }}>Customer Name</th>
                  <th className="tbl-th" style={{ minWidth: '100px', maxWidth: '130px' }}>Mobile</th>
                  <th className="tbl-th" style={{ minWidth: '80px',  maxWidth: '100px' }}>Price</th>
                  <th className="tbl-th" style={{ minWidth: '140px', maxWidth: '160px' }}>Status</th>
                  <th className="tbl-th" style={{ minWidth: '130px', maxWidth: '160px' }}>Created Date</th>
                  <th className="tbl-th" style={{ minWidth: '130px', maxWidth: '160px' }}>Updated Date</th>
                  <th className="tbl-th" style={{ minWidth: '170px', maxWidth: '190px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedList.map((enq) => {
                  return (
                    <tr
                      key={enq.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="tbl-td tbl-cb-cell">
                        <input
                          type="checkbox"
                          className="tbl-checkbox"
                          checked={selectedIds.includes(enq.id)}
                          onChange={() => handleSelectOne(enq.id)}
                        />
                      </td>
                      <td className="tbl-td tbl-truncate" style={{ minWidth: '150px', maxWidth: '210px', fontWeight: '600', color: '#fff' }}>
                        {enq.projectTitle}
                      </td>
                      <td className="tbl-td tbl-truncate" style={{ minWidth: '110px', maxWidth: '150px' }}>
                        {enq.name}
                      </td>
                      <td className="tbl-td tbl-truncate" style={{ minWidth: '100px', maxWidth: '130px' }}>
                        {enq.mobile}
                      </td>
                      <td className="tbl-td tbl-truncate" style={{ minWidth: '80px', maxWidth: '100px', fontWeight: '600', color: 'var(--text-main)' }}>
                        {enq.price ? `₹${enq.price}` : '-'}
                      </td>
                      <td className="tbl-td" style={{ minWidth: '140px', maxWidth: '160px' }}>
                        <select
                          className="form-select"
                          style={{
                            padding: '4px 10px',
                            height: 'auto',
                            fontSize: '12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderColor: statusColors[enq.status] || 'rgba(255, 255, 255, 0.08)',
                            color: statusColors[enq.status] || 'white',
                            fontWeight: '600',
                            width: '135px'
                          }}
                          value={enq.status || 'new'}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        >
                          <option value="new" style={{ color: '#000' }}>🟡 New</option>
                          <option value="contacted" style={{ color: '#000' }}>🔵 Contacted</option>
                          <option value="qualified" style={{ color: '#000' }}>🟣 Qualified</option>
                          <option value="closed" style={{ color: '#000' }}>🟢 Closed</option>
                        </select>
                      </td>
                      <td className="tbl-td tbl-truncate" style={{ minWidth: '130px', maxWidth: '160px', color: 'var(--text-muted)' }}>
                        {formatDate(enq.createdAt)}
                      </td>
                      <td className="tbl-td tbl-truncate" style={{ minWidth: '130px', maxWidth: '160px', color: 'var(--text-muted)' }}>
                        {formatDate(enq.updatedAt)}
                      </td>
                      <td className="tbl-td" style={{ minWidth: '170px', maxWidth: '190px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 'var(--space-1)' }}>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setActiveEnquiry(enq)}
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                          >
                            View
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleOpenEditModal(enq)}
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setEnquiryToDelete(enq)}
                            style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--accent-crimson, #ef4444)' }}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card-glass" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <h3>No enquiries match your criteria</h3>
            <p style={{ marginTop: 'var(--space-2)', color: 'var(--text-muted)' }}>
              Try adjusting your search query, status, or date range filters.
            </p>
          </div>
        )}
      </div>

      {/* Enquiry Details - READ ONLY VIEW Modal */}
      <Modal isOpen={activeEnquiry !== null} onClose={() => setActiveEnquiry(null)} className="modal-content purple" style={{ maxWidth: '600px' }}>
        <h4>ENQUIRY LEAD DETAILS</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: 'var(--space-4)' }}>
          Detailed metadata overview (Read Only)
        </p>

        {activeEnquiry && (
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Metadata Rows */}
            <div className="card-glass" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--text-muted)' }}>Project Title:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '13px', fontWeight: '600', color: '#fff' }}>{activeEnquiry.projectTitle}</span>
              </div>
              <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--text-muted)' }}>Project Price:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>{activeEnquiry.price ? `₹${activeEnquiry.price}` : '-'}</span>
              </div>
              <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--text-muted)' }}>Customer Name:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '13px', color: '#fff' }}>{activeEnquiry.name}</span>
              </div>
              <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--text-muted)' }}>Mobile Number:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '13px', color: 'var(--accent-blue)' }}>{activeEnquiry.mobile}</span>
              </div>
              <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '13px', fontWeight: '600', color: statusColors[activeEnquiry.status] || 'white' }}>
                  {statusLabels[activeEnquiry.status] || activeEnquiry.status}
                </span>
              </div>
              <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--text-muted)' }}>Created Date:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(activeEnquiry.createdAt)}</span>
              </div>
              <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--text-muted)' }}>Updated Date:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(activeEnquiry.updatedAt)}</span>
              </div>
              <div className="grid-12" style={{ gap: 'var(--space-2)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 'var(--space-3)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--text-muted)' }}>Internal Notes:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '13px', color: '#fff', whiteSpace: 'pre-wrap' }}>
                  {activeEnquiry.notes || <em style={{ color: 'var(--text-muted)' }}>No notes added</em>}
                </span>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-5)' }}>
          <Button variant="secondary" onClick={() => setActiveEnquiry(null)} style={{ width: '150px' }}>
            Close
          </Button>
        </div>
      </Modal>

      {/* Enquiry Details - EDIT VIEW Modal */}
      <Modal isOpen={enquiryToEdit !== null} onClose={() => setEnquiryToEdit(null)} className="modal-content purple" style={{ maxWidth: '600px' }}>
        <h4>EDIT ENQUIRY</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: 'var(--space-4)' }}>
          Update status or modify internal notes
        </p>

        {enquiryToEdit && (
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Editable Status */}
            <div className="calc-row">
              <label htmlFor="modal-status">Status</label>
              <select
                id="modal-status"
                className="form-select"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="new">🟡 New</option>
                <option value="contacted">🔵 Contacted</option>
                <option value="qualified">🟣 Qualified</option>
                <option value="closed">🟢 Closed</option>
              </select>
            </div>

            {/* Editable Notes */}
            <div className="calc-row">
              <label htmlFor="modal-notes">Internal Notes</label>
              <textarea
                id="modal-notes"
                className="form-input"
                style={{ height: '120px', resize: 'vertical', padding: '10px', fontSize: '13px', color: '#fff', background: 'rgba(255,255,255,0.01)' }}
                placeholder="Log customer updates, callback summaries..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <Button variant="secondary" style={{ flex: 1 }} onClick={() => setEnquiryToEdit(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="btn-submit-calc"
            style={{ flex: 1 }}
            onClick={handleSaveEditChanges}
          >
            Save Changes
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={enquiryToDelete !== null} onClose={() => setEnquiryToDelete(null)}>
        <div className="modal-icon" style={{ borderColor: 'var(--accent-crimson, #ef4444)', color: 'var(--accent-crimson, #ef4444)' }}>
          ⚠️
        </div>
        <h4>DELETE ENQUIRY RECORD</h4>
        <p style={{ margin: 'var(--space-3) 0' }}>
          Are you sure you want to permanently delete the enquiry from <strong>{enquiryToDelete?.name}</strong>?
          This operation deletes it from local storage and cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-4)' }}>
          <Button
            variant="ghost"
            onClick={handleDeleteConfirm}
            style={{ background: 'var(--accent-crimson, #ef4444)', color: 'white' }}
          >
            Confirm Delete
          </Button>
          <Button variant="secondary" onClick={() => setEnquiryToDelete(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </motion.section>
  );
};
