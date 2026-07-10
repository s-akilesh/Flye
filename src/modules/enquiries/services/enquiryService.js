import { supabase } from '../../../shared/services/supabaseClient.js';
import { mapEnquiryToReact, mapEnquiryToDB } from '../../../shared/utils/mapper.js';
import { activityLogService, ACTIVITY_MODULES, ACTIVITY_ACTIONS, ACTIVITY_STATUS, ACTIVITY_SEVERITY } from '../../../services/activityLogService.js';
import { notificationService } from '../../../shared/services/notificationService.js';

export const enquiryService = {
  /**
   * Retrieves all enquiries ordered by creation date descending.
   */
  getAll: async () => {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapEnquiryToReact);
  },

  /**
   * Creates a standard project enquiry.
   * Can be guest (user_id = null) or authenticated in the future.
   */
  create: async (enquiryData) => {
    const newEnquiry = {
      ...enquiryData,
      id: enquiryData.id || `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: enquiryData.status || 'new',
      // Explicitly set default user_id mapping
      userId: enquiryData.userId || null
    };

    const dbPayload = mapEnquiryToDB(newEnquiry);

    // If userId was provided, append it to dbPayload before sending to Supabase.
    // (This allows future authorized account actions to send user_id while guest flow keeps it NULL).
    if (newEnquiry.userId) {
      dbPayload.user_id = newEnquiry.userId;
    }

    const { data, error } = await supabase
      .from('enquiries')
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw error;
    const result = mapEnquiryToReact(data);
    activityLogService.enquiries.created(result);
    
    // Create new contact enquiry notification
    notificationService.contact.newEnquiry(result.id, result.customerName).catch((err) => {
      console.error('[enquiryService] Failed to create contact notification:', err);
    });

    return result;
  },

  /**
   * Specifically handles frictionless guest enquiries.
   * Explicitly sets userId/user_id to null as guest status.
   */
  createGuestEnquiry: async (enquiryData) => {
    return enquiryService.create({
      ...enquiryData,
      userId: null
    });
  },

  /**
   * Updates an existing enquiry's fields.
   */
  update: async (id, fields) => {
    let oldStatus = null;
    let currentEnquiry = null;
    if (fields.status) {
      try {
        const { data: currentData } = await supabase.from('enquiries').select('*').eq('id', id).single();
        if (currentData) {
          currentEnquiry = mapEnquiryToReact(currentData);
          oldStatus = currentEnquiry.status;
        }
      } catch (e) {
        // ignore
      }
    }

    const dbPayload = mapEnquiryToDB(fields);

    const { data, error } = await supabase
      .from('enquiries')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    const updated = mapEnquiryToReact(data);

    if (fields.status && oldStatus && oldStatus !== fields.status) {
      activityLogService.enquiries.statusChanged(updated, oldStatus, fields.status);
    } else {
      activityLogService.logActivity({
        module: ACTIVITY_MODULES.ENQUIRIES,
        action: ACTIVITY_ACTIONS.UPDATED,
        description: `Updated enquiry details for "${updated.requestorName}"`,
        status: ACTIVITY_STATUS.SUCCESS,
        severity: ACTIVITY_SEVERITY.INFO,
        entityType: 'Enquiry',
        entityId: id,
        metadata: { requestor: updated.requestorName, fieldsChanged: Object.keys(fields) }
      });
    }

    return updated;
  },

  /**
   * Deletes an enquiry.
   */
  delete: async (id) => {
    let requestor = 'Unknown';
    try {
      const { data: currentData } = await supabase.from('enquiries').select('requestor_name').eq('id', id).single();
      if (currentData?.requestor_name) requestor = currentData.requestor_name;
    } catch (e) {
      // ignore
    }

    const { error } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    activityLogService.enquiries.deleted(id, requestor);
    return true;
  },

  /**
   * FUTURE LINKING ARCHITECTURE - IDEMPOTENT PROCESS
   * After a successful OTP verification on a mobile number,
   * updates all enquiries under that verified mobile number to associate them with the user's UUID.
   * 
   * Idempotency Constraints:
   * - Only updates rows where user_id IS NULL.
   * - Never overwrites an already verified user_id.
   * 
   * TODO: Integrate OTP verification callback inside the future authentication pipeline.
   * Calling this method will execute the correlation transaction.
   */
  linkGuestEnquiriesToUser: async (verifiedMobileNumber, authenticatedUserId) => {
    if (!verifiedMobileNumber || !authenticatedUserId) {
      throw new Error('Missing verified mobile number or authenticated user ID');
    }

    // Clean formatting and extract last 10 digits for robust matching
    const cleanUserPhone = String(verifiedMobileNumber).replace(/\D/g, '');
    if (cleanUserPhone.length < 10) return [];
    const userSuffix = cleanUserPhone.slice(-10);

    console.log(`[enquiryService] Linking guest enquiries suffix ${userSuffix} to user ${authenticatedUserId}`);
    
    // 1. Fetch all guest enquiries (user_id is null)
    const { data: guestEnquiries, error: fetchError } = await supabase
      .from('enquiries')
      .select('id, mobile_number')
      .is('user_id', null);

    if (fetchError) {
      console.error('[enquiryService] Failed to fetch guest enquiries for linking:', fetchError);
      throw fetchError;
    }
    if (!guestEnquiries || guestEnquiries.length === 0) return [];

    // 2. Filter matching rows by matching the 10-digit suffix of mobile numbers
    const matchingIds = guestEnquiries
      .filter(enq => {
        const cleanEnqPhone = String(enq.mobile_number || '').replace(/\D/g, '');
        if (cleanEnqPhone.length < 10) return false;
        return cleanEnqPhone.slice(-10) === userSuffix;
      })
      .map(enq => enq.id);

    if (matchingIds.length === 0) return [];

    // 3. Update all matched rows in a single batch
    const { data, error: updateError } = await supabase
      .from('enquiries')
      .update({ user_id: authenticatedUserId })
      .in('id', matchingIds)
      .select();

    if (updateError) {
      console.error('[enquiryService] Failed to update linked guest enquiries:', updateError);
      throw updateError;
    }

    return (data || []).map(mapEnquiryToReact);
  },

  /**
   * FUTURE USER DASHBOARD PREPARATION - SECURED USER READS
   * Retrieves all project enquiries associated with the authenticated user's ID.
   * 
   * Security Constraints:
   * - Must always filter by the authenticated user's ID (which will match auth.uid()).
   * - Never expose enquiries based on a client-supplied mobile number.
   * 
   * TODO: Implement UI views and page listing calling this function on the front-end.
   */
  getUserEnquiries: async (authenticatedUserId) => {
    if (!authenticatedUserId) return [];

    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .eq('user_id', authenticatedUserId) // SECURED: always filter by auth user_id
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Failed to get enquiries for user ${authenticatedUserId}:`, error);
      throw error;
    }

    return (data || []).map(mapEnquiryToReact);
  }
};
