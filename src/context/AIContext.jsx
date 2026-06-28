import React, { createContext, useContext, useState } from 'react';
import { logger } from '../utils/logger';

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [isAIActive, setIsAIActive] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const triggerAISearch = (query) => {
    setIsAIActive(true);
    // Future expansion point for backend AI API calls
    logger.log("AI Search Triggered: ", query);
  };

  return (
    <AIContext.Provider value={{ isAIActive, setIsAIActive, aiResponse, triggerAISearch }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
