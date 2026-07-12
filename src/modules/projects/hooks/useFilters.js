import { useState, useCallback } from 'react';

export const useFilters = () => {
  const [activeCategories, setActiveCategories] = useState(['all']);
  const [activeDifficulties, setActiveDifficulties] = useState([]);
  const [activeFeatures, setActiveFeatures] = useState([]);
  const [activeProjectLevels, setActiveProjectLevels] = useState([]);

  const toggleCategory = useCallback((category) => {
    if (category === 'all') {
      setActiveCategories(['all']);
    } else {
      setActiveCategories((prev) => {
        const filtered = prev.filter((c) => c !== 'all');
        if (filtered.includes(category)) {
          const next = filtered.filter((c) => c !== category);
          return next.length === 0 ? ['all'] : next;
        } else {
          return [...filtered, category];
        }
      });
    }
  }, []);

  const toggleDifficulty = useCallback((difficulty) => {
    setActiveDifficulties((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  }, []);

  const toggleFeature = useCallback((feature) => {
    setActiveFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  }, []);

  const toggleProjectLevel = useCallback((level) => {
    setActiveProjectLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  }, []);

  const resetFilters = useCallback(() => {
    setActiveCategories(['all']);
    setActiveDifficulties([]);
    setActiveFeatures([]);
    setActiveProjectLevels([]);
  }, []);

  return {
    activeCategories,
    activeDifficulties,
    activeFeatures,
    activeProjectLevels,
    toggleCategory,
    toggleDifficulty,
    toggleFeature,
    toggleProjectLevel,
    resetFilters
  };
};
