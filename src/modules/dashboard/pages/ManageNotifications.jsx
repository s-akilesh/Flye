import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { useToast } from '../../../shared/context/ToastContext';
import { notificationService } from '../../../shared/services/notificationService.js';
import { getNotificationIcon, getRelativeTime } from '../../../shared/components/layout/NotificationDropdown.jsx';
import { supabase } from '../../../shared/services/supabaseClient.js';

export const ManageNotifications = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Notification lists state
  const [notifications, setNotifications] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all'); // 'all' | 'unread' | 'read'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Confirmations
  const [notifToDelete, setNotifToDelete] = useState(null);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const [showMarkAllConfirm, setShowMarkAllConfirm] = useState(false);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const list = await notificationService.getNotifications();
      setNotifications(list);
    } catch (err) {
      showToast("Failed to retrieve notifications.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Supabase Realtime listener to update the page instantly
    const channel = supabase
      .channel('manage-notifications-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Client-side search and filtering
  useEffect(() => {
    let result = [...notifications];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query)
      );
    }

    if (priorityFilter !== 'all') {
      result = result.filter((n) => n.priority === priorityFilter);
    }

    if (readFilter !== 'all') {
      const targetRead = readFilter === 'read';
      result = result.filter((n) => n.is_read === targetRead);
    }

    setFilteredList(result);
    setCurrentPage(1); // reset to first page
  }, [notifications, search, priorityFilter, readFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredList.slice(startIndex, startIndex + itemsPerPage);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      loadNotifications();
      showToast("Notification marked as read.", "success");
    } catch (err) {
      showToast("Failed to update notification.", "error");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setShowMarkAllConfirm(false);
      loadNotifications();
      showToast("All notifications marked as read.", "success");
    } catch (err) {
      showToast("Failed to update notifications.", "error");
    }
  };

  const handleDelete = async () => {
    if (!notifToDelete) return;
    try {
      await notificationService.deleteNotification(notifToDelete.id);
      setNotifToDelete(null);
      loadNotifications();
      showToast("Notification deleted.", "success");
    } catch (err) {
      showToast("Failed to delete notification.", "error");
    }
  };

  const handlePurgeOld = async () => {
    try {
      await notificationService.clearOldNotifications();
      setShowPurgeConfirm(false);
      loadNotifications();
      showToast("Cleaned notifications older than 90 days.", "success");
    } catch (err) {
      showToast("Failed to clear notifications.", "error");
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority.toUpperCase()) {
      case 'CRITICAL':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--status-error)' };
      case 'HIGH':
        return { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--status-warning)' };
      case 'MEDIUM':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--brand-accent)' };
      default:
        return { bg: 'rgba(156, 163, 175, 0.1)', text: 'var(--txt-muted)' };
    }
  };

  return (
    <motion.section
      id="manage-notifications-portal"
      className="portal-section page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
    >
      {/* Title Header */}
      <div className="portal-header">
        <div className="portal-title-area">
          <h2 style={{ color: 'var(--txt-primary)' }}>System Notifications</h2>
          <p style={{ color: 'var(--txt-secondary)' }}>Action items and alerts requiring administrator intervention</p>
        </div>
        <div className="portal-header-meta" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {notifications.some(n => !n.is_read) && (
            <Button
              variant="secondary"
              onClick={() => setShowMarkAllConfirm(true)}
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              Mark All Read
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => setShowPurgeConfirm(true)}
            style={{ fontSize: '12px', padding: '8px 16px', color: 'var(--status-error)' }}
          >
            Clear Old (&gt;90 Days)
          </Button>
        </div>
      </div>

      <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1, minHeight: 0 }}>
        {/* Main List */}
        <Card style={{ overflow: 'hidden', border: '1px solid var(--sys-border)', background: 'var(--sys-surface)', display: 'flex', flexDirection: 'column' }}>
          {/* Filter / Search panel inside the card */}
          <div style={{ padding: '20px', borderBottom: '1px solid var(--sys-divider)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ flex: 2, minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Search notifications..."
                className="form-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 14px' }}
              />
            </div>

            {/* Priority */}
            <div style={{ flex: 1, minWidth: '150px' }}>
              <select
                className="form-input"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{ width: '100%', padding: '10px 14px' }}
              >
                <option value="all" style={{ color: 'var(--txt-primary)', background: 'var(--sys-surface)' }}>All Priorities</option>
                <option value="LOW" style={{ color: 'var(--txt-primary)', background: 'var(--sys-surface)' }}>Low</option>
                <option value="MEDIUM" style={{ color: 'var(--txt-primary)', background: 'var(--sys-surface)' }}>Medium</option>
                <option value="HIGH" style={{ color: 'var(--txt-primary)', background: 'var(--sys-surface)' }}>High</option>
                <option value="CRITICAL" style={{ color: 'var(--txt-primary)', background: 'var(--sys-surface)' }}>Critical</option>
              </select>
            </div>

            {/* Read / Unread Status */}
            <div style={{ flex: 1, minWidth: '150px' }}>
              <select
                className="form-input"
                value={readFilter}
                onChange={(e) => setReadFilter(e.target.value)}
                style={{ width: '100%', padding: '10px 14px' }}
              >
                <option value="all" style={{ color: 'var(--txt-primary)', background: 'var(--sys-surface)' }}>All Statuses</option>
                <option value="unread" style={{ color: 'var(--txt-primary)', background: 'var(--sys-surface)' }}>Unread Only</option>
                <option value="read" style={{ color: 'var(--txt-primary)', background: 'var(--sys-surface)' }}>Read Only</option>
              </select>
            </div>
          </div>

          {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--txt-muted)' }}>
            Loading alerts...
          </div>
        ) : pageItems.length === 0 ? (
          <div style={{ padding: '64px 32px', textAlign: 'center', color: 'var(--txt-muted)', fontSize: '14px' }}>
            🎉 Zero notifications match the criteria.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {pageItems.map((item) => {
              const priorityStyle = getPriorityBadgeColor(item.priority);
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--sys-divider)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '24px',
                    background: item.is_read ? 'transparent' : 'var(--interaction-selected)',
                    transition: 'background 0.2s',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flex: 1 }}>
                    {/* Icon */}
                    <div style={{ fontSize: '24px', marginTop: '2px', lineHeight: '1' }}>
                      {getNotificationIcon(item.source)}
                    </div>

                    {/* Context info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: item.is_read ? 'var(--txt-secondary)' : 'var(--txt-primary)' }}>
                          {item.title}
                        </span>
                        
                        {/* Priority Badge */}
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: priorityStyle.bg,
                            color: priorityStyle.text,
                            textTransform: 'uppercase'
                          }}
                        >
                          {item.priority}
                        </span>

                        {/* Unread Tag */}
                        {!item.is_read && (
                          <span style={{ fontSize: '9px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,112,243,0.1)', color: 'var(--brand-accent)' }}>
                            UNREAD
                          </span>
                        )}
                      </div>
                      
                      <p style={{ fontSize: '13px', color: item.is_read ? 'var(--txt-muted)' : 'var(--txt-secondary)', margin: 0, lineHeight: '1.5' }}>
                        {item.message}
                      </p>
                      
                      <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--txt-muted)', marginTop: '8px' }}>
                        <span>Source: <span style={{ color: 'var(--txt-secondary)' }}>{item.source}</span></span>
                        <span>•</span>
                        <span>Date: <span style={{ color: 'var(--txt-secondary)' }}>{new Date(item.created_at).toLocaleString('en-IN')}</span></span>
                        <span>•</span>
                        <span>{getRelativeTime(item.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {!item.is_read && (
                      <button
                        onClick={() => handleMarkRead(item.id)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                      >
                        Mark Read
                      </button>
                    )}
                    {item.action_url && (
                      <button
                        onClick={() => navigate(item.action_url)}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                      >
                        Take Action
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setNotifToDelete(item)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--status-error)',
                        cursor: 'pointer',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Delete notification"
                    >
                      <span className="material-icons-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Pagination controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--txt-muted)' }}>
            Rows per page:
          </span>
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
              border: '1px solid var(--input-border)',
              borderRadius: '4px',
              color: 'var(--txt-primary)'
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`btn ${p === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Next
            </button>
          </div>
        )}
      </div>
      </div>

      {/* Delete Confirmation Modal */}
      {notifToDelete && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Notification"
          message="Are you sure you want to permanently delete this notification?"
          onConfirm={handleDelete}
          onCancel={() => setNotifToDelete(null)}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}

      {/* Purge Confirmation Modal */}
      {showPurgeConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Clear Old Notifications"
          message="Are you sure you want to purge all notifications older than 90 days?"
          onConfirm={handlePurgeOld}
          onCancel={() => setShowPurgeConfirm(false)}
          confirmText="Clear"
          cancelText="Cancel"
          type="danger"
        />
      )}

      {/* Mark All Read Confirmation Modal */}
      {showMarkAllConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Mark All Read"
          message="Are you sure you want to mark all unread notifications as read?"
          onConfirm={handleMarkAllRead}
          onCancel={() => setShowMarkAllConfirm(false)}
          confirmText="Mark Read"
          cancelText="Cancel"
        />
      )}
    </motion.section>
  );
};
