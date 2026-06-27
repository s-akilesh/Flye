import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEnquiries } from '../hooks/useEnquiries';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { AdminToolbar } from '../components/ui/AdminToolbar';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { ROUTES } from '../constants/routes';
import { exportEnquiriesToExcel } from '../utils/excel.js';

export const ManageEnquiries = () => {
  const navigate = useNavigate();
  const { enquiries, updateEnquiry, deleteEnquiry, isLoading, isProcessing } = useEnquiries();
  const { showToast } = useToast();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortField, setSortField] = useState('date-desc');

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Deletion Modal State
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Export Confirmation State
  const [showExportAllConfirm, setShowExportAllConfirm] = useState(false);
  const [showExportScopeConfirm, setShowExportScopeConfirm] = useState(false);
  const [exportScope, setExportScope] = useState('selected');

  // View Modal State
  const [activeEnquiry, setActiveEnquiry] = useState(null);

  // Edit Modal State
  const [enquiryToEdit, setEnquiryToEdit] = useState(null);
  const [editStatus, setEditStatus] = useState('new');
  const [editNotes, setEditNotes] = useState('');

  const handleExportEnquiries = () => {
    if (selectedIds.length === 0) {
      setShowExportAllConfirm(true);
    } else {
      setExportScope('selected');
      setShowExportScopeConfirm(true);
    }
  };

  // Status Change handlers (inline table dropdown)
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateEnquiry(id, { status: newStatus });
      showToast(`✅ Status updated to: ${statusLabels[newStatus] || newStatus}`, 'success');
    } catch (e) {
      showToast("❌ Failed to update status.", "error");
    }
  };

  // Open Edit modal helper
  const handleOpenEditModal = (enq) => {
    setEnquiryToEdit(enq);
    setEditStatus(enq.status || 'new');
    setEditNotes(enq.notes || '');
  };

  // Save changes inside Edit modal
  const handleSaveEditChanges = async () => {
    if (!enquiryToEdit) return;
    try {
      await updateEnquiry(enquiryToEdit.id, {
        status: editStatus,
        notes: editNotes
      });
      setEnquiryToEdit(null);
      showToast('✅ Enquiry details updated successfully.', 'success');
    } catch (e) {
      showToast("❌ Failed to update enquiry.", "error");
    }
  };

  // Delete Action Handler
  const handleDeleteConfirm = async () => {
    if (!enquiryToDelete) return;
    try {
      await deleteEnquiry(enquiryToDelete.id);
      setSelectedIds((prev) => prev.filter((id) => id !== enquiryToDelete.id));
      setEnquiryToDelete(null);
      showToast('✅ Enquiry deleted successfully.', 'success');
    } catch (e) {
      showToast("❌ Failed to delete enquiry.", "error");
    }
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

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) {
      showToast("⚠️ No enquiries selected.", "info");
      return;
    }

    if (action === 'delete') {
      setShowBulkDeleteConfirm(true);
      return;
    }

    await executeBulkAction(action);
  };

  const executeBulkAction = async (action) => {
    try {
      if (action === 'delete') {
        for (const id of selectedIds) {
          await deleteEnquiry(id);
        }
        showToast("✅ Selected enquiries deleted successfully.", "success");
        setSelectedIds([]);
      } else {
        // status updates
        for (const id of selectedIds) {
          await updateEnquiry(id, { status: action });
        }
        showToast(`✅ Selected enquiries status updated to: ${statusLabels[action] || action}`, "success");
        setSelectedIds([]);
      }
    } catch (e) {
      showToast(action === 'delete' ? "❌ Failed to delete some enquiries." : "❌ Failed to update status for some enquiries.", "error");
    }
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
  const quotedCount = enquiries.filter((e) => e.status === 'quoted').length;
  const completedCount = enquiries.filter((e) => e.status === 'completed').length;
  const rejectedCount = enquiries.filter((e) => e.status === 'rejected').length;

  const statusColors = {
    new: '#eab308',
    contacted: 'var(--accent-blue)',
    quoted: 'var(--accent-violet)',
    completed: 'var(--accent-emerald)',
    rejected: 'var(--accent-crimson, #ef4444)'
  };

  const statusLabels = {
    new: '🟡 New',
    contacted: '🔵 Contacted',
    quoted: '🟣 Quoted',
    completed: '🟢 Completed',
    rejected: '🔴 Rejected'
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
      className="portal-section page-container"
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
        <div className="portal-header-meta">
          <Button
            type="button"
            variant="secondary"
            onClick={handleExportEnquiries}
            style={{ fontSize: '13px', padding: '8px 16px' }}
            disabled={isProcessing}
          >
            📤 Export Excel
          </Button>
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
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#eab308', margin: 'var(--space-2) 0 0 0' }}>{newCount}</h3>
          </Card>
          <Card style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>🔵 Contacted</span>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-blue)', margin: 'var(--space-2) 0 0 0' }}>{contactedCount}</h3>
          </Card>
          <Card style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>🟣 Quoted</span>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-violet)', margin: 'var(--space-2) 0 0 0' }}>{quotedCount}</h3>
          </Card>
          <Card style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>🟢 Completed</span>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-emerald)', margin: 'var(--space-2) 0 0 0' }}>{completedCount}</h3>
          </Card>
          <Card style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>🔴 Rejected</span>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-crimson, #ef4444)', margin: 'var(--space-2) 0 0 0' }}>{rejectedCount}</h3>
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
          onReset={() => {
            setSearch('');
            setStatusFilter('all');
            setDateFilter('all');
            setSortField('date-desc');
          }}
        >
          {/* Filter panel content */}
          <div className="admin-filter-panel-grid">
            <div className="calc-row">
              <label htmlFor="enquiry-status">Status</label>
              <select id="enquiry-status" className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
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
                disabled={isProcessing}
              >
                🟡 Mark New
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleBulkAction('contacted')}
                style={{ padding: '6px 12px', fontSize: '12px' }}
                disabled={isProcessing}
              >
                🔵 Mark Contacted
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleBulkAction('quoted')}
                style={{ padding: '6px 12px', fontSize: '12px' }}
                disabled={isProcessing}
              >
                🟣 Mark Quoted
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleBulkAction('completed')}
                style={{ padding: '6px 12px', fontSize: '12px' }}
                disabled={isProcessing}
              >
                🟢 Mark Completed
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleBulkAction('rejected')}
                style={{ padding: '6px 12px', fontSize: '12px' }}
                disabled={isProcessing}
              >
                🔴 Mark Rejected
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleBulkAction('delete')}
                style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-crimson, #ef4444)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                disabled={isProcessing}
              >
                🗑 Delete
              </Button>
            </div>
          </div>
        )}

        {/* Tabular Visual Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <h3>Loading database records...</h3>
          </div>
        ) : sortedList.length > 0 ? (
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
                      <td className="tbl-td" style={{ width: '36px', minWidth: '36px' }}>
                        <input
                          type="checkbox"
                          className="tbl-checkbox"
                          checked={selectedIds.includes(enq.id)}
                          onChange={() => handleSelectOne(enq.id)}
                        />
                      </td>
                      <td className="tbl-td tbl-truncate" style={{ minWidth: '150px', maxWidth: '210px', fontWeight: '500', color: 'var(--accent-blue)' }}>
                        {enq.projectTitle || 'General Consultation'}
                      </td>
                      <td className="tbl-td tbl-truncate" style={{ minWidth: '110px', maxWidth: '150px', color: '#fff' }}>
                        {enq.name}
                      </td>
                      <td className="tbl-td" style={{ minWidth: '100px', maxWidth: '130px', color: 'var(--text-muted)' }}>
                        {enq.mobile}
                      </td>
                      <td className="tbl-td" style={{ minWidth: '80px',  maxWidth: '100px', color: 'var(--accent-emerald)', fontWeight: '600' }}>
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
                          disabled={isProcessing}
                        >
                          <option value="new" style={{ color: '#000' }}>🟡 New</option>
                          <option value="contacted" style={{ color: '#000' }}>🔵 Contacted</option>
                          <option value="quoted" style={{ color: '#000' }}>🟣 Quoted</option>
                          <option value="completed" style={{ color: '#000' }}>🟢 Completed</option>
                          <option value="rejected" style={{ color: '#000' }}>🔴 Rejected</option>
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
                            disabled={isProcessing}
                          >
                            View
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleOpenEditModal(enq)}
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            disabled={isProcessing}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setEnquiryToDelete(enq)}
                            style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--accent-crimson, #ef4444)' }}
                            disabled={isProcessing}
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
              {activeEnquiry.notes && activeEnquiry.notes.includes('Selected Kit:') && (
                <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                  <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--accent-violet)', fontWeight: 'bold' }}>Requested Kit:</span>
                  <span style={{ gridColumn: 'span 8', fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-violet)' }}>
                    {activeEnquiry.notes.replace('Selected Kit: ', '')}
                  </span>
                </div>
              )}
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
                <option value="quoted">🟣 Quoted</option>
                <option value="completed">🟢 Completed</option>
                <option value="rejected">🔴 Rejected</option>
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
                disabled={isProcessing}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <Button variant="secondary" style={{ flex: 1 }} onClick={() => setEnquiryToEdit(null)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="btn-submit-calc"
            style={{ flex: 1 }}
            onClick={handleSaveEditChanges}
            disabled={isProcessing}
          >
            {isProcessing ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={enquiryToDelete !== null}
        onClose={() => setEnquiryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Enquiry Record"
        message={enquiryToDelete ? `Are you sure you want to permanently delete the enquiry from "${enquiryToDelete.name}"? This operation cannot be undone.` : ''}
        confirmLabel="Delete"
        isDanger={true}
        isLoading={isProcessing}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={() => {
          executeBulkAction('delete');
          setShowBulkDeleteConfirm(false);
        }}
        title="Delete Selected Records"
        message={`Are you sure you want to permanently delete the ${selectedIds.length} selected enquiry/enquiries? This operation cannot be undone.`}
        confirmLabel="Delete"
        isDanger={true}
        isLoading={isProcessing}
      />

      {/* Export All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showExportAllConfirm}
        onClose={() => setShowExportAllConfirm(false)}
        onConfirm={() => {
          exportEnquiriesToExcel(sortedList);
          showToast("✅ Filtered enquiries exported successfully!", "success");
          setShowExportAllConfirm(false);
        }}
        title="Export Filtered Records"
        message="Are you sure you want to export all currently filtered records?"
        confirmLabel="Export"
      />

      {/* Export Scope Choice Dialog */}
      <ConfirmDialog
        isOpen={showExportScopeConfirm}
        onClose={() => setShowExportScopeConfirm(false)}
        onConfirm={() => {
          if (exportScope === 'selected') {
            const selected = sortedList.filter(e => selectedIds.includes(e.id));
            exportEnquiriesToExcel(selected);
            showToast(`✅ Exported ${selected.length} selected enquiry/enquiries!`, "success");
          } else {
            exportEnquiriesToExcel(sortedList);
            showToast("✅ Exported all filtered enquiries!", "success");
          }
          setShowExportScopeConfirm(false);
        }}
        title="Export Enquiries"
        message={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <p style={{ margin: 0 }}>Choose export scope:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="exportScope"
                  value="selected"
                  checked={exportScope === 'selected'}
                  onChange={() => setExportScope('selected')}
                />
                <span>Export selected records ({selectedIds.length})</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="exportScope"
                  value="all"
                  checked={exportScope === 'all'}
                  onChange={() => setExportScope('all')}
                />
                <span>Export all filtered records ({sortedList.length})</span>
              </label>
            </div>
          </div>
        }
        confirmLabel="Continue"
      />
    </motion.section>
  );
};
