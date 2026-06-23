import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

export const EnquiryContext = createContext();

export const EnquiryProvider = ({ children }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadEnquiries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setEnquiries(data || []);
    } catch (e) {
      console.error('Failed to load enquiries from Supabase', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Load enquiries on mount
  useEffect(() => {
    loadEnquiries();
  }, []);

  const addEnquiry = async (enquiryData) => {
    setIsProcessing(true);
    try {
      const newEnquiry = {
        id: enquiryData.id || `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        projectId: enquiryData.projectId || '',
        projectTitle: enquiryData.projectTitle || '',
        name: enquiryData.name || '',
        mobile: enquiryData.mobile || '',
        price: enquiryData.price || '',
        status: enquiryData.status || 'new', // Default status is "new" per requirement
        createdAt: enquiryData.createdAt || new Date().toISOString(),
        updatedAt: enquiryData.updatedAt || new Date().toISOString(),
        notes: enquiryData.notes || ''
      };

      const { data, error } = await supabase
        .from('enquiries')
        .insert(newEnquiry)
        .select()
        .single();

      if (error) throw error;
      
      setEnquiries((prev) => [data, ...prev]);
      return data;
    } catch (e) {
      console.error('Failed to add enquiry to Supabase', e);
      throw e;
    } finally {
      setIsProcessing(false);
    }
  };

  const updateEnquiry = async (id, fields) => {
    setIsProcessing(true);
    try {
      const updatePayload = {
        ...fields,
        updatedAt: new Date().toISOString()
      };

      // Remove audit columns that Postgres manages
      delete updatePayload.created_at;
      delete updatePayload.updated_at;

      const { data, error } = await supabase
        .from('enquiries')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEnquiries((prev) => prev.map((e) => (e.id === id ? data : e)));
      return data;
    } catch (e) {
      console.error('Failed to update enquiry in Supabase', e);
      throw e;
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteEnquiry = async (id) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('enquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      console.error('Failed to delete enquiry from Supabase', e);
      throw e;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <EnquiryContext.Provider
      value={{
        enquiries,
        isLoading,
        isProcessing,
        addEnquiry,
        updateEnquiry,
        deleteEnquiry,
        refreshEnquiries: loadEnquiries
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
};
