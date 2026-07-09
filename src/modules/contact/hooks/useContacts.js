import { useState, useEffect, useCallback } from 'react';
import { contactService } from '../services/contactService';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      console.error('[useContacts] Failed to fetch contacts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const addContact = useCallback(async (contactData) => {
    setIsProcessing(true);
    try {
      const newContact = await contactService.create(contactData);
      setContacts(prev => [newContact, ...prev]);
      return newContact;
    } catch (err) {
      console.error('[useContacts] Failed to add contact:', err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const updateContact = useCallback(async (id, fields) => {
    setIsProcessing(true);
    try {
      const updatedContact = await contactService.update(id, fields);
      setContacts(prev => prev.map(c => c.id === id ? updatedContact : c));
      return updatedContact;
    } catch (err) {
      console.error('[useContacts] Failed to update contact:', err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const deleteContact = useCallback(async (id) => {
    setIsProcessing(true);
    try {
      await contactService.delete(id);
      setContacts(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      console.error('[useContacts] Failed to delete contact:', err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    contacts,
    isLoading,
    isProcessing,
    refreshContacts: fetchContacts,
    addContact,
    updateContact,
    deleteContact
  };
};
