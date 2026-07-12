import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { enquiryService } from '../services/enquiryService.js';
import { eventTracker } from '../../../shared/analytics/index.js';
import { useAuth } from '../../auth/context/AuthContext.jsx';

export const EnquiryContext = createContext();

export const EnquiryProvider = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadEnquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await enquiryService.getAll();
      setEnquiries(data);
    } catch (e) {
      console.error('Failed to load enquiries from Supabase', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load enquiries only when user is authenticated and is admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadEnquiries();
    } else {
      setEnquiries([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, isAdmin, loadEnquiries]);

  const addEnquiry = useCallback(async (enquiryData) => {
    setIsProcessing(true);
    try {
      const reactEnquiry = enquiryData.userId
        ? await enquiryService.create(enquiryData)
        : await enquiryService.createGuestEnquiry(enquiryData);
      setEnquiries((prev) => [reactEnquiry, ...prev]);

      // Track successful submission events
      if (enquiryData.projectName) {
        eventTracker.trackProjectEnquiry({ title: enquiryData.projectName }, enquiryData.projectStatus);
      } else {
        eventTracker.trackContactSubmission('form');
      }

      return reactEnquiry;
    } catch (e) {
      console.error('Failed to add enquiry to Supabase', e);
      throw e;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const updateEnquiry = useCallback(async (id, fields) => {
    setIsProcessing(true);
    try {
      const reactEnquiry = await enquiryService.update(id, fields);
      setEnquiries((prev) => prev.map((e) => (e.id === id ? reactEnquiry : e)));
      return reactEnquiry;
    } catch (e) {
      console.error('Failed to update enquiry in Supabase', e);
      throw e;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const deleteEnquiry = useCallback(async (id) => {
    setIsProcessing(true);
    try {
      await enquiryService.delete(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      console.error('Failed to delete enquiry from Supabase', e);
      throw e;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const contextValue = useMemo(() => ({
    enquiries,
    isLoading,
    isProcessing,
    addEnquiry,
    updateEnquiry,
    deleteEnquiry,
    refreshEnquiries: loadEnquiries
  }), [enquiries, isLoading, isProcessing, addEnquiry, updateEnquiry, deleteEnquiry, loadEnquiries]);

  return (
    <EnquiryContext.Provider value={contextValue}>
      {children}
    </EnquiryContext.Provider>
  );
};

