import { supabase } from '../../../shared/services/supabaseClient.js';
import { mapContactToReact, mapContactToDB } from '../../../shared/utils/mapper.js';

export const contactService = {
  /**
   * Retrieves all contact requests ordered by creation date descending.
   */
  getAll: async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapContactToReact);
  },

  /**
   * Creates a new contact request.
   */
  create: async (contactData) => {
    const newContact = {
      ...contactData,
      id: contactData.id || `contact-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: contactData.status || 'new'
    };

    const dbPayload = mapContactToDB(newContact);

    const { data, error } = await supabase
      .from('contacts')
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw error;
    return mapContactToReact(data);
  },

  /**
   * Updates fields of an existing contact request (e.g. status, internal notes).
   */
  update: async (id, fields) => {
    const dbPayload = mapContactToDB(fields);
    
    // Explicitly add updated_at field
    dbPayload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('contacts')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapContactToReact(data);
  },

  /**
   * Deletes a contact request.
   */
  delete: async (id) => {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
