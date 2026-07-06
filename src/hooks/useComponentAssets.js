import { useState, useCallback } from 'react';
import { componentAssetService } from '../services/componentAssetService';
import { useToast } from '../context/ToastContext';

export const useComponentAssets = () => {
  const [assets, setAssets] = useState([]);
  const [parts, setParts] = useState([]);
  const [buildVideo, setBuildVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchAssetsAndParts = useCallback(async (slug) => {
    setIsLoading(true);
    setError(null);
    try {
      const [assetsData, partsData, videoData] = await Promise.all([
        componentAssetService.getComponentAssets(slug),
        componentAssetService.getComponentParts(slug),
        componentAssetService.getBuildVideo(slug)
      ]);
      setAssets(assetsData);
      setParts(partsData);
      setBuildVideo(videoData);
    } catch (err) {
      console.error('[useComponentAssets] Load error:', err);
      setError(err);
      showToast(`Failed to load component assets or interactive parts: ${err.message || err}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const uploadAsset = useCallback(async (slug, category, file, assetType) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await componentAssetService.uploadComponentAsset(slug, category, file, assetType);
      showToast(`${assetType.charAt(0).toUpperCase() + assetType.slice(1)} asset uploaded successfully!`, 'success');
      
      // Refresh assets
      const updatedAssets = await componentAssetService.getComponentAssets(slug);
      setAssets(updatedAssets);
      return result;
    } catch (err) {
      console.error('[useComponentAssets] Upload error:', err);
      setError(err);
      showToast(`Failed to upload ${assetType} asset: ${err.message || err}`, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const deleteAsset = useCallback(async (slug, assetType) => {
    setIsLoading(true);
    setError(null);
    try {
      await componentAssetService.deleteComponentAsset(slug, assetType);
      showToast(`${assetType.charAt(0).toUpperCase() + assetType.slice(1)} asset deleted successfully.`, 'success');
      
      // Refresh assets
      const updatedAssets = await componentAssetService.getComponentAssets(slug);
      setAssets(updatedAssets);
    } catch (err) {
      setError(err);
      showToast(`Failed to delete ${assetType} asset.`, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const saveParts = useCallback(async (slug, partsList) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await componentAssetService.saveComponentParts(slug, partsList);
      showToast('Interactive parts layout saved successfully!', 'success');
      
      // Refresh parts
      const updatedParts = await componentAssetService.getComponentParts(slug);
      setParts(updatedParts);
      return result;
    } catch (err) {
      setError(err);
      showToast('Failed to save interactive parts.', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const deletePart = useCallback(async (partId, slug) => {
    setIsLoading(true);
    setError(null);
    try {
      await componentAssetService.deleteComponentPart(partId);
      showToast('Interactive part deleted successfully.', 'success');
      
      // Refresh parts
      const updatedParts = await componentAssetService.getComponentParts(slug);
      setParts(updatedParts);
    } catch (err) {
      setError(err);
      showToast('Failed to delete interactive part.', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const saveBuildVideoInfo = useCallback(async (slug, url, title) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await componentAssetService.saveBuildVideo(slug, url, title);
      showToast('Build video guide saved successfully!', 'success');
      setBuildVideo(result);
      return result;
    } catch (err) {
      setError(err);
      showToast('Failed to save build video guide.', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const deleteBuildVideoInfo = useCallback(async (slug) => {
    setIsLoading(true);
    setError(null);
    try {
      await componentAssetService.deleteBuildVideo(slug);
      showToast('Build video guide removed.', 'success');
      setBuildVideo(null);
    } catch (err) {
      setError(err);
      showToast('Failed to remove build video guide.', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  return {
    assets,
    parts,
    buildVideo,
    isLoading,
    error,
    fetchAssetsAndParts,
    uploadAsset,
    deleteAsset,
    saveParts,
    deletePart,
    saveBuildVideoInfo,
    deleteBuildVideoInfo
  };
};
