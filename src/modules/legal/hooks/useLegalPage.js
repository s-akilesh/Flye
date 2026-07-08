import { useState, useCallback } from 'react';
import { LegalPageService } from '../services/LegalPageService.js';
import { useToast } from '../../../shared/context/ToastContext';

export const useLegalPage = () => {
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  const fetchPage = useCallback(async (pageKey, isAdmin = false) => {
    setIsLoading(true);
    try {
      const data = isAdmin
        ? await LegalPageService.getPage(pageKey)
        : await LegalPageService.getPublishedPage(pageKey);
      setPageData(data);
      return data;
    } catch (err) {
      console.error(`[useLegalPage] Failed to fetch page ${pageKey}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePage = useCallback(async (pageKey, updates) => {
    setIsProcessing(true);
    try {
      const data = await LegalPageService.updatePage(pageKey, updates);
      setPageData(data);
      showToast('Legal page updated successfully!', 'success');
      return data;
    } catch (err) {
      console.error(`[useLegalPage] Failed to update page ${pageKey}:`, err);
      showToast('Failed to save changes. Please try again.', 'error');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [showToast]);

  const togglePublish = useCallback(async (pageKey, publishStatus) => {
    setIsProcessing(true);
    try {
      const data = await LegalPageService.publishPage(pageKey, publishStatus);
      setPageData(data);
      showToast(
        publishStatus ? 'Legal page published successfully!' : 'Legal page unpublished.',
        'success'
      );
      return data;
    } catch (err) {
      console.error(`[useLegalPage] Failed to toggle publish state for ${pageKey}:`, err);
      showToast('Failed to change publish status.', 'error');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [showToast]);

  return {
    pageData,
    isLoading,
    isProcessing,
    fetchPage,
    updatePage,
    togglePublish
  };
};
