import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/notificationService.js';

/**
 * Formats timestamps into dynamic relative time strings
 * @param {string|Date} dateString 
 * @returns {string}
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return 'Just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

/**
 * Returns emoji icon corresponding to notification source
 * @param {string} source 
 * @returns {string}
 */
export const getNotificationIcon = (source) => {
  switch (String(source).toUpperCase()) {
    case 'CONTACT':
      return '📩';
    case 'EMAIL':
      return '✉️';
    case 'AUTHENTICATION':
      return '🔒';
    case 'SYSTEM':
      return '⚠️';
    case 'PROJECT':
      return '📦';
    default:
      return '🔔';
  }
};

/**
 * Helper to get priority border color
 */
const getPriorityColor = (priority) => {
  switch (String(priority).toUpperCase()) {
    case 'CRITICAL':
      return '#EF4444'; // Red
    case 'HIGH':
      return '#F59E0B'; // Orange
    case 'MEDIUM':
      return '#3B82F6'; // Blue
    default:
      return 'rgba(255,255,255,0.1)';
  }
};

export const NotificationDropdown = ({ isOpen, onClose, notifications, onRefresh }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [, setTimeTrigger] = useState(0);

  // Set up an interval to refresh relative timestamps every minute
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeTrigger(prev => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Click outside to close handler
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayList = (notifications || []).slice(0, 10);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = async (notif) => {
    try {
      if (!notif.is_read) {
        await notificationService.markAsRead(notif.id);
        onRefresh();
      }
      onClose();
      if (notif.action_url) {
        navigate(notif.action_url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="card-glass"
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        right: 0,
        width: '360px',
        maxHeight: '480px',
        background: '#0B0B0C',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>Notifications</span>
        {displayList.some(n => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-blue)',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: 0
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List Container */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {displayList.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            🔔 No notifications yet.
          </div>
        ) : (
          displayList.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                background: notif.is_read ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                borderLeft: `3px solid ${getPriorityColor(notif.priority)}`,
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={(e) => e.currentTarget.style.background = notif.is_read ? 'transparent' : 'rgba(255, 255, 255, 0.02)'}
            >
              {/* Emoji Icon */}
              <div style={{ fontSize: '20px', lineHeight: '1', marginTop: '2px' }}>
                {getNotificationIcon(notif.source)}
              </div>

              {/* Text Context */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: notif.is_read ? '600' : '800',
                      color: notif.is_read ? 'var(--text-secondary)' : '#fff'
                    }}
                  >
                    {notif.title}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {getRelativeTime(notif.created_at)}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '11px',
                    color: notif.is_read ? 'var(--text-muted)' : 'var(--text-secondary)',
                    margin: 0,
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}
                >
                  {notif.message}
                </p>
              </div>

              {/* Unread dot */}
              {!notif.is_read && (
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent-blue)',
                    marginTop: '6px'
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.01)'
        }}
      >
        <button
          onClick={() => {
            onClose();
            navigate('/admin/notifications');
          }}
          style={{
            width: '100%',
            padding: '10px 0',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          View All Notifications
        </button>
      </div>
    </div>
  );
};
