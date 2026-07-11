import { supabase } from './supabaseClient.js';
import { activityLogService } from '../../services/activityLogService.js';

// In-memory cache for unread notification count
let cachedUnreadCount = null;
let cachedNotifications = null;

export const notificationService = {
  /**
   * Clears local in-memory caches
   */
  clearCache() {
    cachedUnreadCount = null;
    cachedNotifications = null;
  },

  /**
   * Creates a notification securely using the Supabase SECURITY DEFINER RPC.
   * Also automatically logs a successful activity entry.
   * @param {Object} data 
   * @returns {Promise<string>} The new notification ID.
   */
  async createNotification(data) {
    try {
      const { data: notificationId, error } = await supabase.rpc('create_notification_secure', {
        p_title: data.title,
        p_message: data.message,
        p_type: data.type,
        p_priority: data.priority,
        p_source: data.source,
        p_action_url: data.action_url || null,
        p_reference_type: data.reference_type || null,
        p_reference_id: data.reference_id ? String(data.reference_id) : null
      });

      if (error) throw error;

      // Invalidate caches
      this.clearCache();

      // Automatically write to Activity Log
      try {
        await activityLogService.logActivity({
          module: 'Notifications',
          action: 'Notification Created',
          description: `Notification created: "${data.title}"`,
          status: 'SUCCESS',
          severity: 'INFO',
          entityType: 'notification',
          entityId: notificationId
        });
      } catch (logErr) {
        console.error('[notificationService] Failed to write activity log:', logErr);
      }

      return notificationId;
    } catch (err) {
      console.error('[notificationService] Failed to create notification:', err);
      throw err;
    }
  },

  /**
   * Retrieves notifications list. Supporting simple filters.
   * @param {Object} [filters] 
   * @returns {Promise<Array>}
   */
  async getNotifications(filters = {}) {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.is_read !== undefined) {
        query = query.eq('is_read', filters.is_read);
      }
      if (filters.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,message.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (!filters.is_read && !filters.priority && !filters.search) {
        cachedNotifications = data;
      }

      return data || [];
    } catch (err) {
      console.error('[notificationService] Failed to fetch notifications:', err);
      return [];
    }
  },

  /**
   * Retrieves the unread notification count.
   * Uses cached count if available.
   * @returns {Promise<number>}
   */
  async getUnreadCount() {
    if (cachedUnreadCount !== null) {
      return cachedUnreadCount;
    }

    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      if (error) throw error;

      cachedUnreadCount = count || 0;
      return cachedUnreadCount;
    } catch (err) {
      console.error('[notificationService] Failed to get unread count:', err);
      return 0;
    }
  },

  /**
   * Marks a notification as read.
   * @param {string} id 
   * @returns {Promise<void>}
   */
  async markAsRead(id) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      this.clearCache();
    } catch (err) {
      console.error(`[notificationService] Failed to mark notification ${id} as read:`, err);
      throw err;
    }
  },

  /**
   * Marks all notifications as read.
   * @returns {Promise<void>}
   */
  async markAllAsRead() {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) throw error;
      this.clearCache();
    } catch (err) {
      console.error('[notificationService] Failed to mark all as read:', err);
      throw err;
    }
  },

  /**
   * Marks all notifications as unread.
   * @returns {Promise<void>}
   */
  async markAllAsUnread() {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: false });

      if (error) throw error;
      this.clearCache();
    } catch (err) {
      console.error('[notificationService] Failed to mark all as unread:', err);
      throw err;
    }
  },

  /**
   * Deletes a notification by id.
   * @param {string} id 
   * @returns {Promise<void>}
   */
  async deleteNotification(id) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      this.clearCache();
    } catch (err) {
      console.error(`[notificationService] Failed to delete notification ${id}:`, err);
      throw err;
    }
  },

  /**
   * Cleans notifications older than 90 days.
   * @returns {Promise<void>}
   */
  async clearOldNotifications() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .lt('created_at', cutoffDate.toISOString());

      if (error) throw error;
      this.clearCache();
    } catch (err) {
      console.error('[notificationService] Failed to purge old notifications:', err);
      throw err;
    }
  },

  /* Grouped Semantic Helpers for modules */

  contact: {
    async newEnquiry(enquiryId, customerName) {
      return notificationService.createNotification({
        title: 'New Contact Enquiry',
        message: `${customerName} submitted a new enquiry.`,
        type: 'CONTACT_ENQUIRY',
        priority: 'HIGH',
        source: 'CONTACT',
        reference_type: 'enquiry',
        reference_id: enquiryId,
        action_url: '/admin/enquiries'
      });
    }
  },

  email: {
    async deliveryFailed(recipientEmail, errorDetail = '') {
      const detailMsg = errorDetail ? ` (${errorDetail})` : '';
      return notificationService.createNotification({
        title: 'Email Delivery Failed',
        message: `User confirmation email to ${recipientEmail} failed to deliver${detailMsg}.`,
        type: 'SYSTEM',
        priority: 'CRITICAL',
        source: 'EMAIL',
        action_url: '/admin/settings/email'
      });
    }
  },

  security: {
    async failedLogin(email) {
      return notificationService.createNotification({
        title: 'Security Alert',
        message: `Multiple failed login attempts detected for ${email}.`,
        type: 'AUTHENTICATION',
        priority: 'HIGH',
        source: 'AUTHENTICATION',
        action_url: '/admin/activity-logs'
      });
    }
  },

  system: {
    async error(title, message) {
      return notificationService.createNotification({
        title,
        message,
        type: 'SYSTEM',
        priority: 'CRITICAL',
        source: 'SYSTEM',
        action_url: '/admin/activity-logs'
      });
    }
  },

  project: {
    async pendingApproval(projectId, projectTitle) {
      return notificationService.createNotification({
        title: 'Project Pending Approval',
        message: `Project "${projectTitle}" requires engineering review.`,
        type: 'PROJECT',
        priority: 'MEDIUM',
        source: 'PROJECT',
        reference_type: 'project',
        reference_id: projectId,
        action_url: '/admin/projects'
      });
    }
  }
};
