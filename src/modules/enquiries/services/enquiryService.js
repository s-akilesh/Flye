import { supabase } from '../../../shared/services/supabaseClient.js';
import { mapEnquiryToReact, mapEnquiryToDB } from '../../../shared/utils/mapper.js';

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
    return mapEnquiryToReact(data);
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
    const dbPayload = mapEnquiryToDB(fields);

    const { data, error } = await supabase
      .from('enquiries')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapEnquiryToReact(data);
  },

  /**
   * Deletes an enquiry.
   */
  delete: async (id) => {
    const { error } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;
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

    console.log(`[Architecture] Linking guest enquiries for ${verifiedMobileNumber} to user ${authenticatedUserId}`);
    
    const { data, error } = await supabase
      .from('enquiries')
      .update({ user_id: authenticatedUserId })
      .eq('mobile_number', verifiedMobileNumber)
      .is('user_id', null) // IDEMPOTENCY: Only update guest rows
      .select();

    if (error) {
      console.error('Failed to link guest enquiries:', error);
      throw error;
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
