import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEnquiries } from '../hooks/useEnquiries';
import { useProjects } from '../../projects/hooks/useProjects';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { AdminToolbar } from '../../../shared/components/ui/AdminToolbar';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { useToast } from '../../../shared/context/ToastContext';
import { ROUTES } from '../../../shared/constants/routes';
import { exportEnquiriesToExcel } from '../../../shared/utils/excel.js';

const statusKeys = [
  'new',
  'contacted',
  'discussed',
  'quoted',
  'confirmed',
  'building',
  'testing',
  'ready',
  'completed',
  'cancelled'
];

const statusColors = {
  new: '#f59e0b',       // Amber
  contacted: '#3b82f6', // Blue
  discussed: '#8b5cf6', // Violet
  quoted: '#06b6d4',    // Cyan
  confirmed: '#10b981', // Emerald
  building: '#6366f1',  // Indigo
  testing: '#ec4899',   // Pink
  ready: '#14b8a6',     // Teal
  completed: '#22c55e', // Green
  cancelled: '#ef4444'   // Crimson
};

const statusLabels = {
  new: 'New',
  contacted: 'Contacted',
  discussed: 'Requirement Discussed',
  quoted: 'Quotation Sent',
  confirmed: 'Confirmed',
  building: 'Building',
  testing: 'Testing',
  ready: 'Ready for Delivery',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

const statusIcons = {
  new: 'fiber_new',
  contacted: 'phone_in_talk',
  discussed: 'forum',
  quoted: 'request_quote',
  confirmed: 'check_circle_outline',
  building: 'construction',
  testing: 'science',
  ready: 'local_shipping',
  completed: 'school',
  cancelled: 'cancel'
};

export const ManageEnquiries = () => {
  const navigate = useNavigate();
  const { enquiries, addEnquiry, updateEnquiry, deleteEnquiry, isLoading, isProcessing } = useEnquiries();
  const { allProjects } = useProjects();
  const { showToast } = useToast();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilters, setStatusFilters] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [sortField, setSortField] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilters, dateFilter, sortField]);

  // Staging filters states
  const [stagedStatusFilters, setStagedStatusFilters] = useState([]);
  const [stagedDateFilter, setStagedDateFilter] = useState('all');

  // View switch state
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('kanban-view-pref') || 'kanban';
  });

  const handleToggleView = (mode) => {
    setViewMode(mode);
    localStorage.setItem('kanban-view-pref', mode);
  };

  const toggleStatusFilter = (st) => {
    if (st === 'all') {
      setStagedStatusFilters([]);
    } else {
      setStagedStatusFilters((prev) =>
        prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
      );
    }
  };

  const handleApplyFilters = () => {
    setStatusFilters([...stagedStatusFilters]);
    setDateFilter(stagedDateFilter);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilters([]);
    setDateFilter('all');
    setStagedStatusFilters([]);
    setStagedDateFilter('all');
    setSortField('date-desc');
  };

  // Drag & Drop States
  const [draggedOverCol, setDraggedOverCol] = useState(null);
  const [draggedEnquiryId, setDraggedEnquiryId] = useState(null);

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
  const [editName, setEditName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editProjectTitle, setEditProjectTitle] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editSubmissionDate, setEditSubmissionDate] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editNeedDoc, setEditNeedDoc] = useState('No');
  const [editNeedPPT, setEditNeedPPT] = useState('No');
  const [editRemarks, setEditRemarks] = useState('');
  const [editDeliveryPartner, setEditDeliveryPartner] = useState('');
  const [editAwbNumber, setEditAwbNumber] = useState('');

  // 3-dot dropdown menu state
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Shipping Modal states
  const [shippingEnquiry, setShippingEnquiry] = useState(null);
  const [deliveryPartner, setDeliveryPartner] = useState('');
  const [awbNumber, setAwbNumber] = useState('');

  // Form states for Add Enquiry Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formProjectId, setFormProjectId] = useState('');
  const [formBudget, setFormBudget] = useState('');
  const [formSubmissionDate, setFormSubmissionDate] = useState('');
  const [formProjectStatus, setFormProjectStatus] = useState('Not Started yet');
  const [formNeedDoc, setFormNeedDoc] = useState('No');
  const [formNeedPPT, setFormNeedPPT] = useState('No');
  const [formRemarks, setFormRemarks] = useState('');

  // Submit Handler for Add Enquiry
  const handleAddEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!formName || !formMobile) {
      showToast('Name and mobile number are required.', 'error');
      return;
    }

    // Resolve project title if a project ID is selected
    let resolvedProjectTitle = 'Custom Kit Fabrication';
    if (formProjectId) {
      const selectedProj = allProjects.find((p) => String(p.id) === String(formProjectId));
      if (selectedProj) {
        resolvedProjectTitle = selectedProj.title;
      } else {
        // Otherwise, it might be custom text entered
        resolvedProjectTitle = formProjectId;
      }
    }

    // Construct metadata notes string
    const notesLines = [
      `Project Status: ${formProjectStatus}`,
      `Budget: ₹${formBudget || 'TBD'}`,
      `Submission Date: ${formSubmissionDate || ''}`,
      `Need Document: ${formNeedDoc}`,
      `Need Presentation Support: ${formNeedPPT}`,
      `Remarks: ${formRemarks || ''}`
    ];
    const notesPayload = notesLines.join('\n');

    const payload = {
      customerName: formName,
      mobileNumber: formMobile,
      projectTitle: resolvedProjectTitle,
      price: formBudget ? parseFloat(formBudget) : null,
      status: 'new',
      notes: notesPayload
    };

    try {
      await addEnquiry(payload);
      showToast('Lead enquiry created successfully!', 'success');
      
      // Reset form
      setFormName('');
      setFormMobile('');
      setFormProjectId('');
      setFormBudget('');
      setFormSubmissionDate('');
      setFormProjectStatus('Not Started yet');
      setFormNeedDoc('No');
      setFormNeedPPT('No');
      setFormRemarks('');
      
      setIsAddModalOpen(false);
    } catch (err) {
      showToast('Failed to create new enquiry lead', 'error');
      console.error('Failed to create new enquiry lead', err);
    }
  };

  const handleExportEnquiries = () => {
    if (selectedIds.length === 0) {
      setShowExportAllConfirm(true);
    } else {
      setExportScope('selected');
      setShowExportScopeConfirm(true);
    }
  };

  // Status Change handlers
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

    const parsed = parseNotes(enq.notes);

    setEditName(enq.customerName || '');
    setEditMobile(enq.mobileNumber || '');
    setEditEmail(enq.email || '');
    setEditProjectTitle(enq.projectTitle || '');

    const rawBudget = parsed.budget && parsed.budget !== '-' ? parsed.budget : String(enq.price || '');
    setEditBudget(rawBudget.replace(/[^\d.]/g, ''));

    setEditSubmissionDate(parsed.submissionDate && parsed.submissionDate !== '-' ? parsed.submissionDate : '');
    setEditPriority(parsed.priority && parsed.priority !== '-' ? parsed.priority : 'Medium');
    setEditNeedDoc(parsed.needDocument === 'Yes' ? 'Yes' : 'No');
    setEditNeedPPT(parsed.needPresentation === 'Yes' ? 'Yes' : 'No');
    setEditRemarks(parsed.remarks && parsed.remarks !== '-' ? parsed.remarks : '');
    setEditDeliveryPartner(parsed.deliveryPartner && parsed.deliveryPartner !== '-' ? parsed.deliveryPartner : '');
    setEditAwbNumber(parsed.awbNumber && parsed.awbNumber !== '-' ? parsed.awbNumber : '');
  };

  // Save changes inside Edit modal
  const handleSaveEditChanges = async (e) => {
    if (e) e.preventDefault();
    if (!enquiryToEdit) return;

    if (!editName || !editMobile) {
      showToast('Name and mobile number are required.', 'error');
      return;
    }

    try {
      const parsedCurrent = parseNotes(enquiryToEdit.notes);
      const notesLines = [
        `Project Status: ${parsedCurrent.projectStatus || 'In Progress'}`,
        `Priority: ${editPriority}`,
        `Budget: ₹${editBudget || 'TBD'}`,
        `Submission Date: ${editSubmissionDate || '-'}`,
        `Need Document: ${editNeedDoc}`,
        `Need Presentation Support: ${editNeedPPT}`,
        `Delivery Partner: ${editDeliveryPartner || '-'}`,
        `AWB Number: ${editAwbNumber || '-'}`,
        `Remarks: ${editRemarks || 'None'}`
      ];
      const notesPayload = notesLines.join('\n');

      await updateEnquiry(enquiryToEdit.id, {
        customerName: editName,
        mobileNumber: editMobile,
        email: editEmail,
        projectTitle: editProjectTitle,
        price: editBudget ? parseFloat(editBudget) : null,
        status: editStatus,
        notes: notesPayload
      });

      setEnquiryToEdit(null);
      showToast('✅ Enquiry details updated successfully.', 'success');
    } catch (err) {
      console.error(err);
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

  // Click outside listener for 3-dot action menus
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenuId(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleMenuToggle = (e, enqId) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === enqId ? null : enqId));
  };

  const handleOpenShippedModal = (enq) => {
    const parsed = parseNotes(enq.notes);
    setShippingEnquiry(enq);
    setDeliveryPartner(parsed.deliveryPartner && parsed.deliveryPartner !== '-' ? parsed.deliveryPartner : '');
    setAwbNumber(parsed.awbNumber && parsed.awbNumber !== '-' ? parsed.awbNumber : '');
  };

  const handleSaveShipping = async (e) => {
    e.preventDefault();
    if (!shippingEnquiry) return;
    try {
      const parsed = parseNotes(shippingEnquiry.notes);
      const notesLines = [
        `Project Status: ${parsed.projectStatus || 'In Progress'}`,
        `Budget: ${parsed.budget || '0'}`,
        `Submission Date: ${parsed.submissionDate || '-'}`,
        `Need Document: ${parsed.needDocument || 'No'}`,
        `Need Presentation Support: ${parsed.needPresentation || 'No'}`,
        `Delivery Partner: ${deliveryPartner || '-'}`,
        `AWB Number: ${awbNumber || '-'}`,
        `Remarks: ${parsed.remarks || 'None'}`
      ];
      await updateEnquiry(shippingEnquiry.id, {
        notes: notesLines.join('\n'),
        status: 'completed'
      });
      setShippingEnquiry(null);
      setDeliveryPartner('');
      setAwbNumber('');
      showToast('📦 Shipping details saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to save shipping details', 'error');
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

  // Format date helper
  const formatDate = (isoStr) => {
    if (!isoStr) return 'N/A';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short'
      });
    } catch (e) {
      return isoStr;
    }
  };

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

  // Filter Logic
  const filteredList = useMemo(() => {
    return enquiries.filter((enq) => {
      // 1. Search Query
      if (search.trim() !== '') {
        const q = search.toLowerCase();
        const matchesName = enq.customerName?.toLowerCase().includes(q);
        const matchesMobile = enq.mobileNumber?.toLowerCase().includes(q);
        const matchesTitle = enq.projectTitle?.toLowerCase().includes(q);
        if (!matchesName && !matchesMobile && !matchesTitle) return false;
      }

      // 2. Status Filter
      const enqStatus = enq.status || 'new';
      if (statusFilters.length > 0 && !statusFilters.includes(enqStatus)) return false;

      // 3. Date Filter
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
  }, [enquiries, search, statusFilters, dateFilter]);

  // Sorting
  const sortedList = useMemo(() => {
    return [...filteredList].sort((a, b) => {
      if (sortField === 'date-desc') {
        return new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at);
      } else if (sortField === 'date-asc') {
        return new Date(a.createdAt || a.created_at) - new Date(b.createdAt || b.created_at);
      } else if (sortField === 'name') {
        return (a.customerName || '').localeCompare(b.customerName || '');
      } else if (sortField === 'title') {
        return (a.projectTitle || '').localeCompare(b.projectTitle || '');
      }
      return 0;
    });
  }, [filteredList, sortField]);

  const totalPages = Math.ceil(sortedList.length / itemsPerPage);
  const paginatedEnquiries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedList.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedList, currentPage, itemsPerPage]);

  // Drag & Drop Handlers
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedEnquiryId(id);
  };

  const handleDragEnd = () => {
    setDraggedEnquiryId(null);
    setDraggedOverCol(null);
  };

  const handleDragOver = (e, statusKey) => {
    e.preventDefault();
    if (draggedOverCol !== statusKey) {
      setDraggedOverCol(statusKey);
    }
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedEnquiryId;
    setDraggedOverCol(null);
    setDraggedEnquiryId(null);

    if (!id) return;

    const enq = enquiries.find(x => x.id === id);
    if (!enq || enq.status === targetStatus) return;

    try {
      await updateEnquiry(id, { status: targetStatus });
      showToast(`Moved ${enq.customerName || 'Enquiry'} -> ${statusLabels[targetStatus]}`, 'success');
    } catch (err) {
      showToast("❌ Failed to update status.", "error");
    }
  };

  // Compile KPI Counts
  const kpis = useMemo(() => {
    const total = enquiries.length;
    const counts = {};
    statusKeys.forEach(k => {
      counts[k] = enquiries.filter(e => (e.status || 'new') === k).length;
    });
    return { total, ...counts };
  }, [enquiries]);

  // Card items rendering for Kanban Columns
  const renderKanbanCard = (enq) => {
    const parsed = parseNotes(enq.notes);
    
    // Priority math
    const priority = parsed.priority || 'Medium';

    const priorityColors = {
      High: { text: 'var(--status-error)', bg: 'rgba(239, 68, 68, 0.15)', border: 'var(--status-error)' },
      Medium: { text: 'var(--status-warning)', bg: 'rgba(245, 158, 11, 0.15)', border: 'var(--status-warning)' },
      Low: { text: 'var(--txt-muted)', bg: 'var(--interaction-hover)', border: 'var(--sys-border)' }
    };
    const pStyle = priorityColors[priority];

    const isDragging = draggedEnquiryId === enq.id;

    return (
      <div
        key={enq.id}
        draggable={!isProcessing}
        onDragStart={(e) => handleDragStart(e, enq.id)}
        onDragEnd={handleDragEnd}
        style={{
          background: 'var(--sys-surface)',
          border: '1px solid var(--sys-border)',
          borderRadius: '8px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          cursor: 'grab',
          opacity: isDragging ? 0.4 : 1,
          transition: 'transform 0.15s, opacity 0.15s',
          outline: 'none'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-primary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--sys-border)'; }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <h5 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)', lineHeight: '1.3' }}>
            {enq.customerName}
          </h5>
          <span style={{
            fontSize: '9.5px',
            fontWeight: '700',
            padding: '1px 6px',
            borderRadius: '10px',
            color: pStyle.text,
            background: pStyle.bg,
            border: `1px solid ${pStyle.border}`
          }}>
            {priority}
          </span>
        </div>

        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
          {enq.projectTitle || 'General Consultation'}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>Budget: <strong style={{ color: 'var(--accent-violet)' }}>{parsed.budget !== '-' ? parsed.budget : `₹${enq.price || '0'}`}</strong></span>
          {parsed.submissionDate !== '-' && (
            <span>Due: {parsed.submissionDate}</span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--sys-divider)', paddingTop: '6px', marginTop: '2px' }}>
          <span style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>{enq.mobileNumber}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <a
              href={`tel:${enq.mobileNumber}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                background: 'var(--interaction-hover)',
                border: '1px solid var(--sys-border)',
                color: 'var(--txt-secondary)'
              }}
              title="Call Student"
            >
              <span className="material-icons-outlined" style={{ fontSize: '13px' }}>phone</span>
            </a>
            <a
              href={`https://wa.me/${String(enq.mobileNumber).replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid var(--status-success)',
                color: 'var(--status-success)'
              }}
              title="WhatsApp Message"
            >
              <span className="material-icons" style={{ fontSize: '13px' }}>chat</span>
            </a>
            <button
              onClick={() => setActiveEnquiry(enq)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                background: 'var(--interaction-hover)',
                border: '1px solid var(--sys-border)',
                color: 'var(--txt-primary)',
                cursor: 'pointer'
              }}
              title="View Details"
            >
              <span className="material-icons-outlined" style={{ fontSize: '13px' }}>visibility</span>
            </button>
            <button
              onClick={() => handleOpenEditModal(enq)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                background: 'var(--interaction-hover)',
                border: '1px solid var(--sys-border)',
                color: 'var(--txt-primary)',
                cursor: 'pointer'
              }}
              title="Edit Enquiry"
            >
              <span className="material-icons-outlined" style={{ fontSize: '13px' }}>edit</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.section
      id="manage-enquiries-portal"
      className="portal-section page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
    >
      {/* Mobile Sticky Sub-Header */}
      <header className="mobile-learning-header">
        <span className="mobile-learning-title" style={{ fontSize: '14px', fontWeight: '800', color: 'var(--txt-primary)', textTransform: 'uppercase' }}>
          Manage Enquiries
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            style={{
              padding: '6px 10px',
              fontSize: '12px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px'
            }}
          >
            Add
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportEnquiries}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              borderRadius: '6px',
              background: 'var(--interaction-hover)',
              border: '1px solid var(--sys-border)',
              color: 'var(--txt-primary)'
            }}
          >
            <span className="material-icons-outlined" style={{ fontSize: '16px' }}>upload</span>
            Export
          </Button>
        </div>
      </header>

      <div className="portal-header">
        <div className="portal-title-area">
          <h2>Manage Enquiries</h2>
          <p>Visual log of customer requests for project kit fabrications</p>
        </div>
        <div className="portal-header-meta" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            id="btn-admin-add-enquiry"
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            Add Enquiry
          </Button>
        </div>
      </div>

      <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* KPI Cards */}
        <div className="admin-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
          <Card style={{ padding: '12px' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Leads</span>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--txt-primary)', margin: '4px 0 0 0' }}>{kpis.total}</h3>
          </Card>
          <Card style={{ padding: '12px' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New</span>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: statusColors.new, margin: '4px 0 0 0' }}>{kpis.new}</h3>
          </Card>
          <Card style={{ padding: '12px' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contacted</span>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: statusColors.contacted, margin: '4px 0 0 0' }}>{kpis.contacted}</h3>
          </Card>
          <Card style={{ padding: '12px' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quoted</span>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: statusColors.quoted, margin: '4px 0 0 0' }}>{kpis.quoted}</h3>
          </Card>
          <Card style={{ padding: '12px' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirmed</span>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: statusColors.confirmed, margin: '4px 0 0 0' }}>{kpis.confirmed}</h3>
          </Card>
          <Card style={{ padding: '12px' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completed</span>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: statusColors.completed, margin: '4px 0 0 0' }}>{kpis.completed}</h3>
          </Card>
        </div>

        {/* Tabular Visual Grid Container Card */}
        <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 0, overflow: 'hidden', minHeight: 'calc(100vh - 280px)', marginBottom: '20px', background: 'var(--sys-surface)' }}>
          {/* Toolbar: Search + Filter Icon + Sort Icon */}
          <AdminToolbar
            searchId="enquiry-search"
            searchLabel="Search Enquiries"
            searchPlaceholder="Search by title, customer name, mobile..."
            searchValue={search}
            onSearchChange={(e) => setSearch(e.target.value)}
            activeFilterCount={
              statusFilters.length +
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
            onReset={handleResetFilters}
            onApply={handleApplyFilters}
            className="admin-toolbar-wrapper"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderBottom: '1px solid var(--sys-border)', position: 'relative', zIndex: 10 }}
            desktopActions={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Switcher Toggle */}
                <div style={{
                  display: 'inline-flex',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--sys-border)',
                  borderRadius: '8px',
                  padding: '3px',
                  gap: '2px',
                  alignItems: 'center'
                }}>
                  <button
                    type="button"
                    onClick={() => handleToggleView('kanban')}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: 'none',
                      background: viewMode === 'kanban' ? 'var(--brand-primary)' : 'transparent',
                      color: viewMode === 'kanban' ? 'var(--txt-primary)' : 'var(--txt-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    title="Kanban View"
                  >
                    <span className="material-icons-outlined" style={{ fontSize: '16px' }}>dashboard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleView('table')}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: 'none',
                      background: viewMode === 'table' ? 'var(--brand-primary)' : 'transparent',
                      color: viewMode === 'table' ? 'var(--txt-primary)' : 'var(--txt-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    title="Table View"
                  >
                    <span className="material-icons-outlined" style={{ fontSize: '16px' }}>list</span>
                  </button>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleExportEnquiries}
                  disabled={isProcessing}
                  style={{ fontSize: '12px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0 12px' }}
                >
                  <span className="material-icons-outlined" style={{ fontSize: '16px' }}>upload</span> Export
                </Button>
              </div>
            }
          >
            {/* Filter panel content */}
            <div className="admin-filter-panel-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="calc-row">
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</label>
                <div className="admin-chip-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => toggleStatusFilter('all')}
                    className={`admin-chip ${stagedStatusFilters.length === 0 ? 'active' : ''}`}
                  >
                    All
                  </button>
                  {statusKeys.map(k => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => toggleStatusFilter(k)}
                      className={`admin-chip ${stagedStatusFilters.includes(k) ? 'active' : ''}`}
                    >
                      {statusLabels[k]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="calc-row">
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Date Submitted</label>
                <div className="admin-chip-group">
                  {[
                    { key: 'all', label: 'All Time' },
                    { key: 'today', label: 'Today' },
                    { key: '7days', label: 'Last 7 Days' },
                    { key: '30days', label: 'Last 30 Days' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setStagedDateFilter(opt.key)}
                      className={`admin-chip ${stagedDateFilter === opt.key ? 'active' : ''}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </AdminToolbar>

          {/* Bulk Actions Banner */}
          {selectedIds.length > 0 && viewMode === 'table' && (
            <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--brand-primary)', background: 'var(--interaction-selected)' }}>
              <span style={{ fontSize: '12px', color: 'var(--txt-primary)', fontWeight: '500' }}>
                Selected <strong style={{ color: 'var(--brand-primary)' }}>{selectedIds.length}</strong> enquiry/enquiries
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkAction(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="form-select"
                  style={{ padding: '4px 10px', fontSize: '12px', width: '160px', height: '30px' }}
                >
                  <option value="">-- Apply Status --</option>
                  {statusKeys.map(k => (
                    <option key={k} value={k}>Mark {statusLabels[k]}</option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleBulkAction('delete')}
                  style={{ padding: '0 10px', fontSize: '12px', height: '30px', background: 'var(--interaction-hover)', color: 'var(--status-error)', border: '1px solid var(--sys-border)' }}
                  disabled={isProcessing}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          )}

          {/* Render Views */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div className="loading-spinner" style={{ border: '4px solid var(--sys-border)', borderTop: '4px solid var(--brand-primary)', borderRadius: '50%', width: '32px', height: '32px', animation: 'spin 1s linear infinite', margin: '0 auto var(--space-4) auto' }} />
              <h3>Loading records...</h3>
            </div>
          ) : viewMode === 'kanban' ? (
            /* KANBAN BOARD VIEW */
            <div
              className="kanban-board"
              style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                padding: '16px',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                flexGrow: 1
              }}
            >
              {statusKeys.map((statusKey) => {
                const columnCards = sortedList.filter((e) => (e.status || 'new') === statusKey);
                const isOver = draggedOverCol === statusKey;

                return (
                  <div
                    key={statusKey}
                    onDragOver={(e) => handleDragOver(e, statusKey)}
                    onDrop={(e) => handleDrop(e, statusKey)}
                    style={{
                      width: '280px',
                      flexShrink: 0,
                      scrollSnapAlign: 'start',
                      display: 'flex',
                      flexDirection: 'column',
                      background: isOver ? 'var(--interaction-selected)' : 'var(--sys-surface-elevated)',
                      border: isOver 
                        ? `1.5px dashed ${statusColors[statusKey]}` 
                        : '1.5px solid var(--sys-border)',
                      borderRadius: '10px',
                      padding: '12px 10px',
                      transition: 'background 0.2s, border 0.2s',
                      flexGrow: 1,
                      minHeight: '460px'
                    }}
                  >
                    {/* Column Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--sys-divider)', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="material-icons-outlined" style={{ fontSize: '16px', color: statusColors[statusKey] }}>
                          {statusIcons[statusKey]}
                        </span>
                        <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--txt-primary)' }}>
                          {statusLabels[statusKey]}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--txt-muted)',
                        background: 'var(--interaction-hover)',
                        padding: '2px 6px',
                        borderRadius: '10px'
                      }}>
                        {columnCards.length}
                      </span>
                    </div>

                    {/* Cards Container */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        overflowY: 'auto',
                        flexGrow: 1,
                        paddingRight: '2px'
                      }}
                    >
                      {columnCards.length > 0 ? (
                        columnCards.map(renderKanbanCard)
                      ) : (
                        <div style={{ textAlign: 'center', padding: '24px 0', fontSize: '11.5px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          No enquiries found in this stage.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TABLE VIEW */
            sortedList.length > 0 ? (
              <>
                <div className="tbl-scroll-wrap" style={{ padding: '12px' }}>
                <table style={{ width: '100%', minWidth: 'max-content', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--sys-divider)', background: 'var(--sys-surface-elevated)' }}>
                      <th style={{ padding: '10px 8px', width: '36px', minWidth: '36px' }}>
                        <input
                          type="checkbox"
                          checked={sortedList.length > 0 && selectedIds.length === sortedList.length}
                          onChange={handleSelectAll}
                          style={{ cursor: 'pointer' }}
                        />
                      </th>
                      <th style={{ padding: '10px 10px', color: 'var(--txt-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '150px' }}>Project Title</th>
                      <th style={{ padding: '10px 10px', color: 'var(--txt-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '110px' }}>Customer Name</th>
                      <th style={{ padding: '10px 10px', color: 'var(--txt-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '100px' }}>Mobile</th>
                      <th style={{ padding: '10px 10px', color: 'var(--txt-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '130px' }}>Project Status</th>
                      <th style={{ padding: '10px 10px', color: 'var(--txt-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '90px' }}>Priority</th>
                      <th style={{ padding: '10px 10px', color: 'var(--txt-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '100px' }}>Budget</th>
                      <th style={{ padding: '10px 10px', color: 'var(--txt-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '110px' }}>Submission</th>
                      <th style={{ padding: '10px 10px', color: 'var(--txt-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '140px' }}>Lead Status</th>
                      <th style={{ padding: '10px 10px', color: 'var(--txt-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '130px' }}>Submitted Date</th>
                      <th style={{ padding: '10px 10px', color: 'var(--txt-secondary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '170px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEnquiries.map((enq) => {
                      const isSelected = selectedIds.includes(enq.id);
                      const parsed = parseNotes(enq.notes);

                      // Priority calculation
                      const priority = parsed.priority || 'Medium';

                      const priorityBadgeColors = {
                        High: { text: 'var(--status-error)', bg: 'rgba(239, 68, 68, 0.15)', border: 'var(--status-error)' },
                        Medium: { text: 'var(--status-warning)', bg: 'rgba(245, 158, 11, 0.15)', border: 'var(--status-warning)' },
                        Low: { text: 'var(--txt-muted)', bg: 'var(--interaction-hover)', border: 'var(--sys-border)' }
                      };
                      const pBadge = priorityBadgeColors[priority];

                      return (
                        <tr 
                          key={enq.id} 
                          style={{ 
                            borderBottom: '1px solid var(--sys-divider)',
                            background: isSelected ? 'var(--interaction-selected)' : 'transparent',
                            transition: 'background 0.2s ease'
                          }}
                          className="table-row-hover"
                        >
                          <td style={{ padding: '10px 8px' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectOne(enq.id)}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>
                          <td className="tbl-td tbl-truncate" style={{ minWidth: '150px', maxWidth: '210px', fontWeight: '600', color: 'var(--brand-accent)' }}>
                            {enq.projectTitle || 'General Consultation'}
                          </td>
                          <td className="tbl-td tbl-truncate" style={{ minWidth: '110px', maxWidth: '150px', color: 'var(--txt-primary)' }}>
                            {enq.customerName}
                          </td>
                          <td className="tbl-td" style={{ minWidth: '100px', maxWidth: '130px', color: 'var(--txt-muted)' }}>
                            {enq.mobileNumber}
                          </td>
                          <td className="tbl-td" style={{ minWidth: '130px', maxWidth: '150px', color: 'var(--txt-secondary)' }}>
                            {parsed.projectStatus}
                          </td>
                          <td className="tbl-td" style={{ minWidth: '90px', maxWidth: '110px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '10.5px',
                              fontWeight: '700',
                              color: pBadge.text,
                              background: pBadge.bg,
                              border: `1px solid ${pBadge.border}`
                            }}>
                              {priority}
                            </span>
                          </td>
                          <td className="tbl-td" style={{ minWidth: '100px', maxWidth: '120px', color: 'var(--brand-primary)', fontWeight: '600' }}>
                            {parsed.budget !== '-' ? parsed.budget : `₹${enq.price || '0'}`}
                          </td>
                          <td className="tbl-td" style={{ minWidth: '110px', maxWidth: '130px', color: 'var(--txt-muted)' }}>
                            {parsed.submissionDate}
                          </td>
                          <td className="tbl-td" style={{ minWidth: '140px', maxWidth: '160px' }}>
                            <select
                              className="form-select"
                              style={{
                                padding: '4px 20px 4px 8px',
                                height: 'auto',
                                fontSize: '11.5px',
                                background: 'var(--input-bg)',
                                borderColor: statusColors[enq.status || 'new'],
                                color: statusColors[enq.status || 'new'],
                                fontWeight: '600',
                                width: '135px',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(statusColors[enq.status || 'new'])}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 4px center',
                                backgroundSize: '12px',
                                cursor: 'pointer'
                              }}
                              value={enq.status || 'new'}
                              onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                              disabled={isProcessing}
                            >
                              {statusKeys.map(k => (
                                <option key={k} value={k} style={{ background: 'var(--sys-surface-elevated)', color: 'var(--txt-primary)' }}>{statusLabels[k]}</option>
                              ))}
                            </select>
                          </td>
                          <td className="tbl-td tbl-truncate" style={{ minWidth: '130px', maxWidth: '160px', color: 'var(--txt-muted)' }}>
                            {formatDate(enq.createdAt)}
                          </td>
                          <td className="tbl-td" style={{ minWidth: '160px', maxWidth: '180px', textAlign: 'right' }}>
                             <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                               <Button
                                 type="button"
                                 variant="ghost"
                                 onClick={() => setActiveEnquiry(enq)}
                                 style={{ width: '36px', height: '36px', minWidth: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                 title="View Details"
                                 disabled={isProcessing}
                               >
                                 <span className="material-icons-outlined" style={{ fontSize: '16px' }}>visibility</span>
                               </Button>
                               <Button
                                 type="button"
                                 variant="secondary"
                                 onClick={() => handleOpenEditModal(enq)}
                                 style={{ width: '36px', height: '36px', minWidth: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                 title="Edit Enquiry"
                                 disabled={isProcessing}
                               >
                                 <span className="material-icons-outlined" style={{ fontSize: '16px' }}>edit</span>
                               </Button>

                               {/* 3-dot dropdown menu */}
                               <div style={{ position: 'relative', display: 'inline-block' }}>
                                 <Button
                                   type="button"
                                   variant="ghost"
                                   onClick={(e) => handleMenuToggle(e, enq.id)}
                                   style={{ width: '36px', height: '36px', minWidth: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                   title="More Actions"
                                   disabled={isProcessing}
                                 >
                                   <span className="material-icons-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                                 </Button>
                                 {activeMenuId === enq.id && (
                                   <div
                                     className="admin-icon-panel"
                                     style={{
                                       top: 'calc(100% + 4px)',
                                       right: 0,
                                       minWidth: '150px',
                                       padding: 'var(--space-1)',
                                       display: 'flex',
                                       flexDirection: 'column',
                                       gap: '2px',
                                       background: 'var(--sys-surface-elevated)',
                                       border: '1px solid var(--sys-border)'
                                     }}
                                     onClick={(e) => e.stopPropagation()}
                                   >
                                     <button
                                       type="button"
                                       className="admin-sort-option"
                                       onClick={() => {
                                         handleOpenShippedModal(enq);
                                         setActiveMenuId(null);
                                       }}
                                     >
                                       <span className="material-icons-outlined" style={{ fontSize: '16px', color: 'var(--brand-accent)' }}>local_shipping</span>
                                       <span>Shipped</span>
                                     </button>
                                     <button
                                       type="button"
                                       className="admin-sort-option"
                                       onClick={() => {
                                         setEnquiryToDelete(enq);
                                         setActiveMenuId(null);
                                       }}
                                       style={{ color: 'var(--status-error)' }}
                                     >
                                       <span className="material-icons-outlined" style={{ fontSize: '16px', color: 'var(--status-error)' }}>delete</span>
                                       <span>Delete</span>
                                     </button>
                                   </div>
                                 )}
                               </div>
                             </div>
                           </td>
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
                    Showing Page {currentPage} of {totalPages || 1} ({sortedList.length} enquiries found)
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
          ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>No enquiries match your criteria</h3>
                <p style={{ marginTop: 'var(--space-2)', color: 'var(--txt-muted)', marginBottom: 0 }}>
                  Try adjusting your search query, status, or date range filters.
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Enquiry Details - READ ONLY VIEW Modal */}
      <Modal isOpen={activeEnquiry !== null} onClose={() => setActiveEnquiry(null)} className="modal-content purple" style={{ maxWidth: '600px' }}>
        <h4>ENQUIRY LEAD DETAILS</h4>
        <p style={{ color: 'var(--txt-muted)', fontSize: '12px', marginBottom: 'var(--space-4)' }}>
          Detailed metadata overview (Read Only)
        </p>

        {activeEnquiry && (
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="card-glass" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Project Title:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '13px', fontWeight: '600', color: 'var(--txt-primary)' }}>{activeEnquiry.projectTitle}</span>
              </div>
              <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Project Price:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '13px', fontWeight: '600', color: 'var(--txt-primary)' }}>{activeEnquiry.price ? `₹${activeEnquiry.price}` : '-'}</span>
              </div>
              <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Customer Name:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '13px', color: 'var(--txt-primary)' }}>{activeEnquiry.customerName}</span>
              </div>
              <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Mobile Number:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '13px', color: 'var(--brand-accent)' }}>{activeEnquiry.mobileNumber}</span>
              </div>
              <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Status:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '13px', fontWeight: '600', color: statusColors[activeEnquiry.status] || 'var(--txt-primary)' }}>
                  {statusLabels[activeEnquiry.status] || activeEnquiry.status}
                </span>
              </div>
              <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Created Date:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '12px', color: 'var(--txt-muted)' }}>{formatDate(activeEnquiry.createdAt)}</span>
              </div>
              <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Updated Date:</span>
                <span style={{ gridColumn: 'span 8', fontSize: '12px', color: 'var(--txt-muted)' }}>{formatDate(activeEnquiry.updatedAt)}</span>
              </div>
              {activeEnquiry.notes && !activeEnquiry.notes.includes('Project Status:') ? (
                <div className="grid-12" style={{ gap: 'var(--space-2)', borderTop: '1px solid var(--sys-divider)', paddingTop: 'var(--space-3)' }}>
                  <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Internal Notes:</span>
                  <span style={{ gridColumn: 'span 8', fontSize: '13px', color: 'var(--txt-primary)', whiteSpace: 'pre-wrap' }}>
                    {activeEnquiry.notes}
                  </span>
                </div>
              ) : (
                (() => {
                  const pNotes = parseNotes(activeEnquiry.notes);
                  return (
                    <>
                      <div className="grid-12" style={{ gap: 'var(--space-2)', borderTop: '1px solid var(--sys-divider)', paddingTop: 'var(--space-3)' }}>
                        <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Project Status:</span>
                        <span style={{ gridColumn: 'span 8', fontSize: '13px', color: 'var(--txt-primary)' }}>{pNotes.projectStatus}</span>
                      </div>
                      <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                        <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Budget:</span>
                        <span style={{ gridColumn: 'span 8', fontSize: '13px', color: 'var(--brand-primary)', fontWeight: 'bold' }}>{pNotes.budget}</span>
                      </div>
                      <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                        <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Submission Date:</span>
                        <span style={{ gridColumn: 'span 8', fontSize: '13px', color: 'var(--txt-primary)' }}>{pNotes.submissionDate}</span>
                      </div>
                      <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                        <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Document Needed:</span>
                        <span style={{ gridColumn: 'span 8', fontSize: '13px', color: 'var(--txt-primary)' }}>{pNotes.needDocument}</span>
                      </div>
                      <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                        <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Presentation Support:</span>
                        <span style={{ gridColumn: 'span 8', fontSize: '13px', color: 'var(--txt-primary)' }}>{pNotes.needPresentation}</span>
                      </div>
                      {pNotes.deliveryPartner && pNotes.deliveryPartner !== '-' && (
                        <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                          <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Delivery Partner:</span>
                          <span style={{ gridColumn: 'span 8', fontSize: '13px', color: 'var(--brand-accent)', fontWeight: '600' }}>{pNotes.deliveryPartner}</span>
                        </div>
                      )}
                      {pNotes.awbNumber && pNotes.awbNumber !== '-' && (
                        <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
                          <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>AWB / Tracking ID:</span>
                          <span style={{ gridColumn: 'span 8', fontSize: '13px', color: 'var(--status-success)', fontWeight: '800' }}>{pNotes.awbNumber}</span>
                        </div>
                      )}
                      <div className="grid-12" style={{ gap: 'var(--space-2)', borderTop: '1px solid var(--sys-divider)', paddingTop: 'var(--space-3)' }}>
                        <span style={{ gridColumn: 'span 4', fontSize: '12px', color: 'var(--txt-muted)' }}>Remarks:</span>
                        <span style={{ gridColumn: 'span 8', fontSize: '13px', color: 'var(--txt-primary)', whiteSpace: 'pre-wrap' }}>
                          {pNotes.remarks || <em style={{ color: 'var(--txt-muted)' }}>None</em>}
                        </span>
                      </div>
                    </>
                  );
                })()
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <a
                href={`tel:${activeEnquiry.mobileNumber}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 0',
                  borderRadius: '6px',
                  background: 'var(--interaction-hover)',
                  border: '1px solid var(--sys-border)',
                  color: 'var(--txt-primary)',
                  textDecoration: 'none',
                  fontSize: '12.5px',
                  fontWeight: '600'
                }}
              >
                <span className="material-icons" style={{ fontSize: '16px' }}>phone</span>
                Call Student
              </a>
              <Button variant="secondary" onClick={() => setActiveEnquiry(null)} style={{ flex: 1 }}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Enquiry Details - EDIT VIEW Modal */}
      <Modal isOpen={enquiryToEdit !== null} onClose={() => setEnquiryToEdit(null)} className="modal-content purple" style={{ maxWidth: '600px' }}>
        <h4>EDIT ENQUIRY</h4>
        <p style={{ color: 'var(--txt-muted)', fontSize: '12px', marginBottom: '16px' }}>
          Update customer details, status, or notes
        </p>

        {enquiryToEdit && (
          <form onSubmit={handleSaveEditChanges} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="calc-row">
                <label htmlFor="edit-name">Student Name *</label>
                <input
                  id="edit-name"
                  type="text"
                  className="form-input"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Student Name"
                  disabled={isProcessing}
                />
              </div>
              <div className="calc-row">
                <label htmlFor="edit-mobile">Mobile Number *</label>
                <input
                  id="edit-mobile"
                  type="tel"
                  className="form-input"
                  required
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  placeholder="Mobile Number"
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
              <div className="calc-row">
                <label htmlFor="edit-email">Email Address</label>
                <input
                  id="edit-email"
                  type="email"
                  className="form-input"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="E.g. student@gmail.com"
                  disabled={isProcessing}
                />
              </div>
              <div className="calc-row">
                <label htmlFor="edit-budget">Budget (₹)</label>
                <input
                  id="edit-budget"
                  type="text"
                  className="form-input"
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  placeholder="Budget"
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
              <div className="calc-row">
                <label htmlFor="edit-project-title">Enquired Project</label>
                <input
                  id="edit-project-title"
                  type="text"
                  className="form-input"
                  value={editProjectTitle}
                  onChange={(e) => setEditProjectTitle(e.target.value)}
                  placeholder="Project Title"
                  disabled={isProcessing}
                />
              </div>
              <div className="calc-row">
                <label htmlFor="edit-status">Lead Status</label>
                <select
                  id="edit-status"
                  className="form-select"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  disabled={isProcessing}
                  style={{
                    color: statusColors[editStatus] || 'var(--txt-primary)',
                    borderColor: statusColors[editStatus] || 'var(--sys-border)'
                  }}
                >
                  {statusKeys.map(k => (
                    <option key={k} value={k} style={{ background: 'var(--sys-surface-elevated)', color: 'var(--txt-primary)' }}>{statusLabels[k]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="calc-row">
                <label htmlFor="edit-subdate">Submission Deadline</label>
                <input
                  id="edit-subdate"
                  type="date"
                  className="form-input"
                  value={editSubmissionDate}
                  onChange={(e) => setEditSubmissionDate(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
              <div className="calc-row">
                <label htmlFor="edit-priority">Priority</label>
                <select
                  id="edit-priority"
                  className="form-select"
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  disabled={isProcessing}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="calc-row">
                <label htmlFor="edit-needdoc">Need Document?</label>
                <select
                  id="edit-needdoc"
                  className="form-select"
                  value={editNeedDoc}
                  onChange={(e) => setEditNeedDoc(e.target.value)}
                  disabled={isProcessing}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div className="calc-row">
                <label htmlFor="edit-needppt">Need Presentation Support?</label>
                <select
                  id="edit-needppt"
                  className="form-select"
                  value={editNeedPPT}
                  onChange={(e) => setEditNeedPPT(e.target.value)}
                  disabled={isProcessing}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="calc-row">
                <label htmlFor="edit-partner">Delivery Partner</label>
                <input
                  id="edit-partner"
                  type="text"
                  className="form-input"
                  value={editDeliveryPartner}
                  onChange={(e) => setEditDeliveryPartner(e.target.value)}
                  placeholder="E.g. DTDC, Delhivery"
                  disabled={isProcessing}
                />
              </div>
              <div className="calc-row">
                <label htmlFor="edit-awb">AWB / Tracking Number</label>
                <input
                  id="edit-awb"
                  type="text"
                  className="form-input"
                  value={editAwbNumber}
                  onChange={(e) => setEditAwbNumber(e.target.value)}
                  placeholder="E.g. AWB1234567"
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div className="calc-row">
              <label htmlFor="edit-remarks">Internal Remarks / Notes</label>
              <textarea
                id="edit-remarks"
                className="form-input"
                style={{ height: '70px', resize: 'vertical' }}
                placeholder="Remarks, student requirements, updates..."
                value={editRemarks}
                onChange={(e) => setEditRemarks(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: '10px' }}>
              <Button type="button" variant="secondary" style={{ flex: 1 }} onClick={() => setEnquiryToEdit(null)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="btn-submit-calc"
                style={{ flex: 1 }}
                disabled={isProcessing}
              >
                {isProcessing ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={enquiryToDelete !== null}
        onClose={() => setEnquiryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Enquiry Record"
        message={enquiryToDelete ? `Are you sure you want to permanently delete the enquiry from "${enquiryToDelete.customerName}"? This operation cannot be undone.` : ''}
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

      {/* NEW LEAD / ADD ENQUIRY MODAL */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} className="modal-content purple" style={{ maxWidth: '600px' }}>
        <h4>ADD NEW LEAD ENQUIRY</h4>
        <p style={{ color: 'var(--txt-muted)', fontSize: '12px', marginBottom: '16px' }}>Create customer lead file directly in active database</p>

        <form onSubmit={handleAddEnquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="calc-row">
              <label htmlFor="form-name">Student Name *</label>
              <input
                id="form-name"
                type="text"
                className="form-input"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Akash Kumar"
              />
            </div>
            <div className="calc-row">
              <label htmlFor="form-mobile">Mobile Number *</label>
              <input
                id="form-mobile"
                type="tel"
                className="form-input"
                required
                value={formMobile}
                onChange={(e) => setFormMobile(e.target.value)}
                placeholder="9876543210"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div className="calc-row">
              <label htmlFor="form-project">Enquired Project</label>
              <select
                id="form-project"
                className="form-select"
                value={formProjectId}
                onChange={(e) => setFormProjectId(e.target.value)}
              >
                <option value="">-- Custom / Select Project --</option>
                {allProjects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div className="calc-row">
              <label htmlFor="form-budget">Budget (₹)</label>
              <input
                id="form-budget"
                type="text"
                className="form-input"
                value={formBudget}
                onChange={(e) => setFormBudget(e.target.value)}
                placeholder="6500"
              />
            </div>
          </div>

          {/* Custom text option if they choose Custom */}
          {formProjectId === '' && (
            <div className="calc-row">
              <label htmlFor="form-custom-project">Custom Project Title</label>
              <input
                id="form-custom-project"
                type="text"
                className="form-input"
                placeholder="Enter custom project title..."
                onChange={(e) => setFormProjectId(e.target.value)}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="calc-row">
              <label htmlFor="form-subdate">Submission Deadline</label>
              <input
                id="form-subdate"
                type="date"
                className="form-input"
                value={formSubmissionDate}
                onChange={(e) => setFormSubmissionDate(e.target.value)}
              />
            </div>

            <div className="calc-row">
              <label htmlFor="form-projstatus">Project Status</label>
              <select
                id="form-projstatus"
                className="form-select"
                value={formProjectStatus}
                onChange={(e) => setFormProjectStatus(e.target.value)}
              >
                <option value="Not Started yet">Not Started yet</option>
                <option value="Have Project idea">Have Project idea</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="calc-row">
              <label htmlFor="form-needdoc">Need Document?</label>
              <select
                id="form-needdoc"
                className="form-select"
                value={formNeedDoc}
                onChange={(e) => setFormNeedDoc(e.target.value)}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div className="calc-row">
              <label htmlFor="form-needppt">Need Presentation Support?</label>
              <select
                id="form-needppt"
                className="form-select"
                value={formNeedPPT}
                onChange={(e) => setFormNeedPPT(e.target.value)}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>

          <div className="calc-row">
            <label htmlFor="form-remarks">Internal Remarks / Notes</label>
            <textarea
              id="form-remarks"
              className="form-input"
              style={{ height: '70px', resize: 'vertical' }}
              placeholder="E.g. Student prefers assembled kit, needs help with Arduino code..."
              value={formRemarks}
              onChange={(e) => setFormRemarks(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              style={{ flex: 1, padding: '10px 0' }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              style={{ flex: 1, padding: '10px 0' }}
              disabled={isProcessing}
            >
              {isProcessing ? 'Saving Lead...' : 'Save Lead'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Shipped/Tracking Info Modal */}
      <Modal 
        isOpen={shippingEnquiry !== null} 
        onClose={() => setShippingEnquiry(null)} 
        className="modal-content purple" 
        style={{ maxWidth: '480px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <span className="material-icons-outlined" style={{ color: 'var(--brand-accent)', fontSize: '24px' }}>local_shipping</span>
          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>SHIPMENT DETAILS</h4>
        </div>

        <form onSubmit={handleSaveShipping} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="calc-row">
            <label htmlFor="ship-partner" style={{ fontSize: '11px', color: 'var(--txt-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px', display: 'block', textAlign: 'left' }}>
              Delivery Partner Name
            </label>
            <input
              id="ship-partner"
              type="text"
              className="form-input"
              style={{ textAlign: 'left' }}
              value={deliveryPartner}
              onChange={(e) => setDeliveryPartner(e.target.value)}
              placeholder="E.g. DTDC, Delhivery, Speed Post, FedEx..."
              required
            />
          </div>

          <div className="calc-row">
            <label htmlFor="ship-awb" style={{ fontSize: '11px', color: 'var(--txt-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px', display: 'block', textAlign: 'left' }}>
              AWB / Tracking Number
            </label>
            <input
              id="ship-awb"
              type="text"
              className="form-input"
              style={{ textAlign: 'left' }}
              value={awbNumber}
              onChange={(e) => setAwbNumber(e.target.value)}
              placeholder="E.g. AWB729381023, 123456789..."
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setShippingEnquiry(null)}
              style={{ flex: 1, padding: '10px 0' }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              style={{ flex: 1, padding: '10px 0' }}
              disabled={isProcessing}
            >
              {isProcessing ? 'Saving Details...' : 'Save & Mark Shipped'}
            </Button>
          </div>
        </form>
      </Modal>

    </motion.section>
  );
};
