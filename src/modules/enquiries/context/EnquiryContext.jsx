import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../../../shared/services/supabaseClient.js';
import { mapEnquiryToReact, mapEnquiryToDB } from '../../../shared/utils/mapper.js';

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
      setEnquiries((data || []).map(mapEnquiryToReact));
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
        ...enquiryData,
        id: enquiryData.id || `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: enquiryData.status || 'new'
      };

      const dbPayload = mapEnquiryToDB(newEnquiry);

      const { data, error } = await supabase
        .from('enquiries')
        .insert(dbPayload)
        .select()
        .single();

      if (error) throw error;
      
      const reactEnquiry = mapEnquiryToReact(data);
      setEnquiries((prev) => [reactEnquiry, ...prev]);
      return reactEnquiry;
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
      const dbPayload = mapEnquiryToDB(fields);

      const { data, error } = await supabase
        .from('enquiries')
        .update(dbPayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const reactEnquiry = mapEnquiryToReact(data);
      setEnquiries((prev) => prev.map((e) => (e.id === id ? reactEnquiry : e)));
      return reactEnquiry;
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

