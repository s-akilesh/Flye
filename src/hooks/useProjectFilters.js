import { useMemo } from 'react';

/**
 * Custom hook to filter and sort electronic project kits.
 * Excludes draft/archived projects, handles category bypass,
 * processes standard search queries, evaluates AI search criteria,
 * and sorts elements.
 */
export const useProjectFilters = (
  projects,
  { activeCategories, activeDifficulties, activeProjectLevels, activeFeatures },
  { searchQuery, aiFilterResult },
  sortBy
) => {
  return useMemo(() => {
    if (!projects) return [];

    // Filter projects that are active or coming-soon (exclude draft and archived)
    let list = projects.filter((p) => p.status === 'active' || p.status === 'coming-soon');

    // 1. Category Filter: Bypassed if activeCategories is empty or contains 'all'
    if (activeCategories && activeCategories.length > 0 && !activeCategories.includes('all')) {
      list = list.filter((p) => activeCategories.includes(p.category));
    }

    // 2. Difficulty Filter
    if (activeDifficulties && activeDifficulties.length > 0) {
      list = list.filter((p) => activeDifficulties.includes(p.difficulty));
    }

    // 3. Project Level Filter
    if (activeProjectLevels && activeProjectLevels.length > 0) {
      list = list.filter((p) => activeProjectLevels.includes(p.projectLevel));
    }

    // 4. Feature Filter (multi-select: project must have AT LEAST ONE of the selected features)
    if (activeFeatures && activeFeatures.length > 0) {
      list = list.filter((p) => p.features && p.features.some((f) => activeFeatures.includes(f)));
    }

    // 5. AI Filter Result or Standard Search Query
    if (aiFilterResult) {
      const { maxPrice, matchedCategories, matchedLevel } = aiFilterResult;
      list = list.filter((p) => {
        if (maxPrice !== null && p.price > maxPrice) {
          return false;
        }
        if (matchedCategories && matchedCategories.length > 0 && !matchedCategories.includes(p.category)) {
          return false;
        }
        if (matchedLevel !== null && p.projectLevel.toLowerCase() !== matchedLevel.toLowerCase()) {
          return false;
        }
        return true;
      });
    } else if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const techMatch = p.technology && p.technology.toLowerCase().includes(q);
        const keywordsMatch = p.searchKeywords && p.searchKeywords.some((kw) => kw.toLowerCase().includes(q));
        return titleMatch || descMatch || techMatch || keywordsMatch;
      });
    }

    // 6. Sorting
    if (sortBy === 'newest') {
      list = [...list].sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === 'price-low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'difficulty') {
      const weights = { beginner: 1, intermediate: 2, advanced: 3 };
      list = [...list].sort((a, b) => {
        const wA = weights[a.difficulty] || 0;
        const wB = weights[b.difficulty] || 0;
        return wA - wB;
      });
    }

    return list;
  }, [
    projects,
    activeCategories,
    activeDifficulties,
    activeProjectLevels,
    activeFeatures,
    searchQuery,
    aiFilterResult,
    sortBy
  ]);
};
