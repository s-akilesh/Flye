import { supabase } from '../shared/services/supabaseClient.js';
import { logger } from '../shared/utils/logger.js';

// Front-End Enums & Constants to avoid string typos
export const ACTIVITY_MODULES = {
  AUTH: 'Authentication',
  PROJECTS: 'Projects',
  ENQUIRIES: 'Enquiries',
  SETTINGS: 'Settings',
  USERS: 'Users',
  STORAGE: 'Storage'
};

export const ACTIVITY_ACTIONS = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  CREATED: 'Created',
  UPDATED: 'Updated',
  DELETED: 'Deleted',
  STATUS_CHANGED: 'Status Changed'
};

export const ACTIVITY_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  WARNING: 'WARNING',
  INFO: 'INFO'
};

export const ACTIVITY_SEVERITY = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL'
};

export const ACTIVITY_SOURCES = {
  WEB: 'WEB',
  SYSTEM: 'SYSTEM',
  API: 'API',
  CRON: 'CRON',
  EDGE_FUNCTION: 'EDGE_FUNCTION'
};

export const activityLogService = {
  /**
   * Main RPC invocation logger
   */
  async logActivity({ module, action, description, status, severity, source = ACTIVITY_SOURCES.WEB, entityType = null, entityId = null, metadata = {} }) {
    try {
      let userAgentStr = null;
      if (typeof window !== 'undefined') {
        userAgentStr = window.navigator.userAgent;
      }

      const { error } = await supabase.rpc('log_activity_secure', {
        p_module: module,
        p_action: action,
        p_description: description,
        p_status: status.toUpperCase(),
        p_severity: severity.toUpperCase(),
        p_source: source.toUpperCase(),
        p_entity_type: entityType,
        p_entity_id: entityId ? String(entityId) : null,
        p_metadata: metadata,
        p_user_agent: userAgentStr,
        p_session_id: null
      });

      if (error) throw error;
    } catch (err) {
      logger.error('[activityLogService] Failed to insert log:', err);
    }
  },

  /* Grouped Semantic Helpers */

  auth: {
    async login(email, success = true, errorMsg = '') {
      await activityLogService.logActivity({
        module: ACTIVITY_MODULES.AUTH,
        action: ACTIVITY_ACTIONS.LOGIN,
        description: success ? `User logged in: ${email}` : `Failed login attempt for: ${email}. Reason: ${errorMsg}`,
        status: success ? ACTIVITY_STATUS.SUCCESS : ACTIVITY_STATUS.FAILED,
        severity: success ? ACTIVITY_SEVERITY.SUCCESS : ACTIVITY_SEVERITY.ERROR,
        metadata: { email, error: errorMsg }
      });
    },

    async logout(email) {
      await activityLogService.logActivity({
        module: ACTIVITY_MODULES.AUTH,
        action: ACTIVITY_ACTIONS.LOGOUT,
        description: `User logged out: ${email}`,
        status: ACTIVITY_STATUS.SUCCESS,
        severity: ACTIVITY_SEVERITY.SUCCESS,
        metadata: { email }
      });
    }
  },

  projects: {
    async created(project) {
      await activityLogService.logActivity({
        module: ACTIVITY_MODULES.PROJECTS,
        action: ACTIVITY_ACTIONS.CREATED,
        description: `Created project: "${project.title}"`,
        status: ACTIVITY_STATUS.SUCCESS,
        severity: ACTIVITY_SEVERITY.SUCCESS,
        entityType: 'Project',
        entityId: project.id,
        metadata: { title: project.title }
      });
    },

    async updated(project, changes = {}) {
      await activityLogService.logActivity({
        module: ACTIVITY_MODULES.PROJECTS,
        action: ACTIVITY_ACTIONS.UPDATED,
        description: `Updated project: "${project.title}"`,
        status: ACTIVITY_STATUS.SUCCESS,
        severity: ACTIVITY_SEVERITY.SUCCESS,
        entityType: 'Project',
        entityId: project.id,
        metadata: { title: project.title, changes }
      });
    },

    async deleted(projectId, projectTitle) {
      await activityLogService.logActivity({
        module: ACTIVITY_MODULES.PROJECTS,
        action: ACTIVITY_ACTIONS.DELETED,
        description: `Deleted project: "${projectTitle}"`,
        status: ACTIVITY_STATUS.SUCCESS,
        severity: ACTIVITY_SEVERITY.WARNING,
        entityType: 'Project',
        entityId: projectId,
        metadata: { title: projectTitle }
      });
    }
  },

  enquiries: {
    async created(enquiry) {
      await activityLogService.logActivity({
        module: ACTIVITY_MODULES.ENQUIRIES,
        action: ACTIVITY_ACTIONS.CREATED,
        description: `New enquiry submitted by "${enquiry.requestorName || 'Customer'}"`,
        status: ACTIVITY_STATUS.SUCCESS,
        severity: ACTIVITY_SEVERITY.SUCCESS,
        entityType: 'Enquiry',
        entityId: enquiry.id,
        metadata: { requestor: enquiry.requestorName, project: enquiry.projectTitle }
      });
    },

    async statusChanged(enquiry, oldStatus, newStatus) {
      await activityLogService.logActivity({
        module: ACTIVITY_MODULES.ENQUIRIES,
        action: ACTIVITY_ACTIONS.STATUS_CHANGED,
        description: `Enquiry status changed from "${oldStatus}" to "${newStatus}"`,
        status: ACTIVITY_STATUS.SUCCESS,
        severity: ACTIVITY_SEVERITY.INFO,
        entityType: 'Enquiry',
        entityId: enquiry.id,
        metadata: { oldStatus, newStatus }
      });
    },

    async deleted(enquiryId, requestor) {
      await activityLogService.logActivity({
        module: ACTIVITY_MODULES.ENQUIRIES,
        action: ACTIVITY_ACTIONS.DELETED,
        description: `Deleted enquiry from "${requestor}"`,
        status: ACTIVITY_STATUS.SUCCESS,
        severity: ACTIVITY_SEVERITY.WARNING,
        entityType: 'Enquiry',
        entityId: enquiryId
      });
    }
  },

  settings: {
    async updated(section, changes = {}) {
      await activityLogService.logActivity({
        module: ACTIVITY_MODULES.SETTINGS,
        action: ACTIVITY_ACTIONS.UPDATED,
        description: `Updated settings section: "${section}"`,
        status: ACTIVITY_STATUS.SUCCESS,
        severity: ACTIVITY_SEVERITY.INFO,
        metadata: { section, changes }
      });
    }
  },

  seo: {
    async created(route, entityType = null, entityId = null) {
      await activityLogService.logActivity({
        module: 'Page Settings',
        action: 'SEO Created',
        description: `Created SEO settings for route: "${route}"`,
        status: ACTIVITY_STATUS.SUCCESS,
        severity: ACTIVITY_SEVERITY.INFO,
        entityType,
        entityId,
        metadata: { route }
      });
    },
    async updated(route, changes = {}, entityType = null, entityId = null) {
      await activityLogService.logActivity({
        module: 'Page Settings',
        action: 'SEO Updated',
        description: `Updated SEO settings for route: "${route}"`,
        status: ACTIVITY_STATUS.SUCCESS,
        severity: ACTIVITY_SEVERITY.INFO,
        entityType,
        entityId,
        metadata: { route, changes }
      });
    },
    async statusChanged(route, enabled, entityType = null, entityId = null) {
      await activityLogService.logActivity({
        module: 'Page Settings',
        action: enabled ? 'SEO Enabled' : 'SEO Disabled',
        description: `${enabled ? 'Enabled' : 'Disabled'} SEO settings for route: "${route}"`,
        status: ACTIVITY_STATUS.SUCCESS,
        severity: ACTIVITY_SEVERITY.INFO,
        entityType,
        entityId,
        metadata: { route, enabled }
      });
    }
  },

  /* Retrieve Logs and Trigger Purge via RPC */

  async getLogs({ page = 1, limit = 50, module, status, severity, startDate, endDate, search }) {
    try {
      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          profiles:user_id ( full_name )
        `, { count: 'exact' });

      if (module && module !== 'all') query = query.eq('module', module);
      if (status && status !== 'all') query = query.eq('status', status);
      if (severity && severity !== 'all') query = query.eq('severity', severity);
      if (startDate) query = query.gte('created_at', new Date(startDate).toISOString());
      
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query = query.lte('created_at', end.toISOString());
      }
      
      if (search) {
        query = query.or(`description.ilike.%${search}%,module.ilike.%${search}%,action.ilike.%${search}%`);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        logger.warn('[activityLogService] Relational logs query failed (likely missing FK constraint). Falling back to direct query:', error);
        
        let fallbackQuery = supabase
          .from('activity_logs')
          .select('*', { count: 'exact' });

        if (module && module !== 'all') fallbackQuery = fallbackQuery.eq('module', module);
        if (status && status !== 'all') fallbackQuery = fallbackQuery.eq('status', status);
        if (severity && severity !== 'all') fallbackQuery = fallbackQuery.eq('severity', severity);
        if (startDate) fallbackQuery = fallbackQuery.gte('created_at', new Date(startDate).toISOString());
        
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          fallbackQuery = fallbackQuery.lte('created_at', end.toISOString());
        }
        
        if (search) {
          fallbackQuery = fallbackQuery.or(`description.ilike.%${search}%,module.ilike.%${search}%,action.ilike.%${search}%`);
        }

        const fallbackResult = await fallbackQuery
          .order('created_at', { ascending: false })
          .range(from, to);

        if (fallbackResult.error) throw fallbackResult.error;
        data = fallbackResult.data || [];
        count = fallbackResult.count || 0;
      }

      return { logs: data || [], total: count || 0, page, limit };
    } catch (err) {
      logger.error('[activityLogService] Failed to fetch logs:', err);
      throw err;
    }
  },

  async cleanOldLogs(retentionDays) {
    try {
      const days = parseInt(retentionDays);
      if (isNaN(days)) return { count: 0 };
      
      const { data, error } = await supabase.rpc('clean_activity_logs', {
        p_retention_days: days
      });

      if (error) throw error;
      return { count: data || 0 };
    } catch (err) {
      logger.error('[activityLogService] Failed to clean logs:', err);
      throw err;
    }
  },

  async getStats() {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [totalRes, todayRes, failedRes] = await Promise.all([
        supabase.from('activity_logs').select('id', { count: 'exact', head: true }),
        supabase.from('activity_logs').select('id', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()),
        supabase.from('activity_logs').select('id', { count: 'exact', head: true }).eq('status', 'FAILED')
      ]);

      const { data: uniqueUsers, error: userError } = await supabase
        .from('activity_logs')
        .select('user_id')
        .not('user_id', 'is', null);

      const uniqueUserIds = new Set((uniqueUsers || []).map(x => x.user_id));

      return {
        total: totalRes?.count || 0,
        today: todayRes?.count || 0,
        failed: failedRes?.count || 0,
        activeUsersCount: uniqueUserIds.size
      };
    } catch (err) {
      logger.error('[activityLogService] Failed to retrieve stats:', err);
      return { total: 0, today: 0, failed: 0, activeUsersCount: 0 };
    }
  }
};
