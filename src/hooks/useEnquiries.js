import { useContext } from 'react';
import { EnquiryContext } from '../context/EnquiryContext';

/**
 * Custom hook to interact with the enquiries context.
 * Exposes enquiries list and CRUD methods (addEnquiry, updateEnquiry, deleteEnquiry).
 */
export const useEnquiries = () => {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiries must be used within an EnquiryProvider');
  }
  return context;
};
