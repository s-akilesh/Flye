import { useCompare } from '../context/CompareContext';

export const useCompareProjects = () => {
  const { compareList, addToCompare, removeFromCompare } = useCompare();

  const isComparing = (projectId) => {
    return compareList.some((p) => p.id === projectId);
  };

  const getComparisonMatrix = () => {
    if (compareList.length === 0) return null;
    
    // Scaffolds future layout matrix comparison fields
    return {
      projects: compareList,
      fields: ['price', 'difficulty', 'technology', 'buildTime', 'componentsCount']
    };
  };

  return {
    compareList,
    addToCompare,
    removeFromCompare,
    isComparing,
    getComparisonMatrix
  };
};
