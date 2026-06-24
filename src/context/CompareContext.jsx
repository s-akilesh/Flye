import React, { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const { showToast } = useToast();

  const addToCompare = (project) => {
    if (compareList.length >= 3) {
      showToast("You can compare a maximum of 3 projects at once.", "warning");
      return;
    }
    if (!compareList.find((p) => p.id === project.id)) {
      setCompareList((prev) => [...prev, project]);
    }
  };

  const removeFromCompare = (projectId) => {
    setCompareList((prev) => prev.filter((p) => p.id !== projectId));
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
