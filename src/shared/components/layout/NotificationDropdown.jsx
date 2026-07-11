import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/notificationService.js';
import { Button } from '../../../shared/components/ui/Button';
import { createPortal } from 'react-dom';

/**
 * Formats timestamps into dynamic relative time strings
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
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

/**
 * Returns emoji icon corresponding to notification source
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
  const drawerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
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
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        // Only close if click is not inside a settings menu option
        if (!event.target.closest('.settings-menu-trigger')) {
          onClose();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter for only current calendar day (local timezone)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayNotifications = (notifications || []).filter(notif => {
    const notifDate = new Date(notif.created_at || notif.createdAt);
    return notifDate >= today;
  });

  // Calculate unread count specifically for today
  const todayUnreadCount = todayNotifications.filter(n => !n.is_read).length;

  // Filter by active tab
  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return todayNotifications.filter(n => !n.is_read);
      case 'mentions':
        // Filter mock mentions or notifications containing '@' or from specific sources
        return todayNotifications.filter(n => 
          String(n.source).toUpperCase() === 'MENTION' || 
          String(n.title).toLowerCase().includes('@admin') ||
          String(n.message).toLowerCase().includes('@admin')
        );
      case 'all':
      default:
        return todayNotifications;
    }
  };

  const displayList = getFilteredNotifications();

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      onRefresh();
      setShowSettings(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllUnread = async () => {
    try {
      await notificationService.markAllAsUnread();
      onRefresh();
      setShowSettings(false);
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

  const handleActionClick = async (e, notif) => {
    e.stopPropagation(); // Avoid triggering row click
    await handleItemClick(notif);
  };

  // Stylesheet injection for keyframes
  const animationStyles = `
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes fadeInOverlay {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;

  return createPortal(
    <>
      <style>{animationStyles}</style>

      {/* Backdrop overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          animation: 'fadeInOverlay 0.25s ease-out forwards'
        }}
        onClick={onClose}
      />

      {/* Right Drawer Container */}
      <div
        ref={drawerRef}
        className="card-glass"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '440px',
          background: '#0B0B0C',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 40px -10px rgba(0, 0, 0, 0.7)',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Header Block */}
        <div
          style={{
            padding: '24px 24px 16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0, fontFamily: 'Inter' }}>
            Notifications
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Expand / View All Icon Link */}
            <button
              onClick={() => {
                onClose();
                navigate('/admin/notifications');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted, #9ca3af)',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted, #9ca3af)'}
              title="Expand Page"
            >
              <span className="material-icons-outlined" style={{ fontSize: '20px' }}>open_in_full</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted, #9ca3af)',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted, #9ca3af)'}
              title="Close Drawer"
            >
              <span className="material-icons-outlined" style={{ fontSize: '22px' }}>close</span>
            </button>
          </div>
        </div>

        {/* Tab Filters & Settings */}
        <div
          style={{
            padding: '0 24px 16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Tab: All */}
            <button
              onClick={() => setActiveTab('all')}
              style={{
                background: activeTab === 'all' ? 'rgba(255,255,255,0.06)' : 'none',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '12.5px',
                fontWeight: activeTab === 'all' ? '700' : '500',
                color: activeTab === 'all' ? '#fff' : 'var(--text-muted, #9ca3af)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              All
              <span
                style={{
                  background: activeTab === 'all' ? 'var(--accent-violet, #8b5cf6)' : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  lineHeight: 1
                }}
              >
                {todayNotifications.length}
              </span>
            </button>

            {/* Tab: Unread */}
            <button
              onClick={() => setActiveTab('unread')}
              style={{
                background: activeTab === 'unread' ? 'rgba(255,255,255,0.06)' : 'none',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '12.5px',
                fontWeight: activeTab === 'unread' ? '700' : '500',
                color: activeTab === 'unread' ? '#fff' : 'var(--text-muted, #9ca3af)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              Unread
              {todayUnreadCount > 0 && (
                <span
                  style={{
                    background: 'var(--accent-blue, #3b82f6)',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    lineHeight: 1
                  }}
                >
                  {todayUnreadCount}
                </span>
              )}
            </button>

            {/* Tab: Mentions */}
            <button
              onClick={() => setActiveTab('mentions')}
              style={{
                background: activeTab === 'mentions' ? 'rgba(255,255,255,0.06)' : 'none',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '12.5px',
                fontWeight: activeTab === 'mentions' ? '700' : '500',
                color: activeTab === 'mentions' ? '#fff' : 'var(--text-muted, #9ca3af)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Mentions
            </button>
          </div>

          {/* Action Menu (Gear) */}
          <div style={{ position: 'relative' }}>
            <button
              className="settings-menu-trigger"
              onClick={() => setShowSettings(!showSettings)}
              style={{
                background: 'none',
                border: 'none',
                color: showSettings ? '#fff' : 'var(--text-muted, #9ca3af)',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => { if(!showSettings) e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { if(!showSettings) e.currentTarget.style.color = 'var(--text-muted, #9ca3af)'; }}
              title="Notification Settings"
            >
              <span className="material-icons-outlined" style={{ fontSize: '20px' }}>settings</span>
            </button>

            {/* Settings dropdown menu */}
            {showSettings && (
              <div
                className="card-glass"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '160px',
                  background: '#121214',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  zIndex: 10005,
                  padding: '4px 0'
                }}
              >
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: '#fff',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  Mark all as read
                </button>
                <button
                  onClick={handleMarkAllUnread}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: '#fff',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  Mark all as unread
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable list container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px' }}>
          {displayList.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <span className="material-icons-outlined" style={{ fontSize: '48px', color: 'rgba(255,255,255,0.1)' }}>
                notifications_off
              </span>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                  No notifications today
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted, #9ca3af)' }}>
                  There are no updates matching this tab.
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  onClose();
                  navigate('/admin/notifications');
                }}
                style={{ fontSize: '11px', padding: '6px 14px', marginTop: '8px' }}
              >
                View Older Notifications
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {displayList.map((notif) => {
                const isReply = notif.type?.toLowerCase() === 'reply' || notif.message?.toLowerCase().includes('replied') || notif.message?.toLowerCase().includes('message:');
                const isFile = notif.type?.toLowerCase() === 'file' || notif.message?.toLowerCase().includes('file') || notif.message?.toLowerCase().includes('.pdf') || notif.message?.toLowerCase().includes('.zip');
                const relativeTime = getRelativeTime(notif.created_at);

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleItemClick(notif)}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '8px',
                      transition: 'background 0.2s',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Avatar Generation */}
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.source || 'system'}`}
                      alt="avatar"
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        flexShrink: 0
                      }}
                    />

                    {/* Content wrapper */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500', lineHeight: 1.4, wordBreak: 'break-word' }}>
                          <strong style={{ color: '#fff', fontWeight: '700' }}>{notif.source || 'System'}</strong> {notif.title}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #9ca3af)' }}>
                          {relativeTime}
                        </span>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #9ca3af)' }}>•</span>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #9ca3af)', textTransform: 'capitalize' }}>
                          {notif.type || 'Activity'}
                        </span>
                      </div>

                      {/* REPLY BLOCK RENDERING */}
                      {isReply && !isFile && (
                        <div
                          style={{
                            marginTop: '10px',
                            padding: '12px',
                            borderRadius: '6px',
                            background: notif.priority?.toUpperCase() === 'CRITICAL' || notif.priority?.toUpperCase() === 'HIGH'
                              ? 'rgba(139, 92, 246, 0.12)'  // Violet
                              : 'rgba(16, 185, 129, 0.12)', // Emerald green
                            border: `1px solid ${
                              notif.priority?.toUpperCase() === 'CRITICAL' || notif.priority?.toUpperCase() === 'HIGH'
                                ? 'rgba(139, 92, 246, 0.2)'
                                : 'rgba(16, 185, 129, 0.2)'
                            }`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          <span style={{
                            fontSize: '12.5px',
                            color: notif.priority?.toUpperCase() === 'CRITICAL' || notif.priority?.toUpperCase() === 'HIGH'
                              ? '#d8b4fe'
                              : '#a7f3d0',
                            lineHeight: 1.4,
                            flex: 1
                          }}>
                            {notif.message}
                          </span>
                          {notif.action_url && (
                            <button
                              onClick={(e) => handleActionClick(e, notif)}
                              style={{
                                background: '#fff',
                                color: '#000',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 10px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                flexShrink: 0
                              }}
                            >
                              Reply
                            </button>
                          )}
                        </div>
                      )}

                      {/* FILE ATTACHMENT CARD RENDERING */}
                      {isFile && (
                        <div
                          style={{
                            marginTop: '10px',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                            <span className="material-icons-outlined" style={{ fontSize: '18px', color: 'var(--text-muted, #9ca3af)', flexShrink: 0 }}>
                              attachment
                            </span>
                            <span style={{ fontSize: '12.5px', color: '#fff', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {notif.reference_id || 'document.pdf'}
                            </span>
                          </div>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #9ca3af)', flexShrink: 0 }}>
                            2 MB
                          </span>
                        </div>
                      )}

                      {/* STANDARD MESSAGE (if not reply/file) */}
                      {!isReply && !isFile && notif.message && (
                        <p style={{ margin: '8px 0 0 0', fontSize: '12.5px', color: 'var(--text-secondary, #d1d5db)', lineHeight: 1.4 }}>
                          {notif.message}
                        </p>
                      )}
                    </div>

                    {/* Unread indicator dot */}
                    {!notif.is_read && (
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'var(--accent-blue, #3b82f6)',
                          alignSelf: 'center',
                          flexShrink: 0
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};
