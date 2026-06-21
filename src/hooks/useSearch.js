import { useState } from 'react';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiFilterResult, setAiFilterResult] = useState(null);

  const parseAISearch = (prompt) => {
    prompt = prompt.toLowerCase();
    let maxPrice = null;
    
    // Extract numbers near currency or "under", "less than"
    const priceMatches = prompt.match(/(?:under|less than|below|\$|rs\.?|₹)\s*(\d+)/i) || prompt.match(/(\d+)\s*(?:dollars|usd|rs|rupees|inr|under)/i);
    if (priceMatches && priceMatches[1]) {
      maxPrice = parseFloat(priceMatches[1]);
    } else {
      const numMatches = prompt.match(/\b\d+\b/);
      if (numMatches) {
        maxPrice = parseFloat(numMatches[0]);
      }
    }

    // Keyword mapping for categories
    const keywords = {
      arduino: ['arduino', 'uno', 'nano'],
      robotics: ['robot', 'robotics', 'car', 'rover', 'claw', 'servo', 'motor'],
      iot: ['iot', 'internet of things', 'wifi', 'esp32', 'esp8266', 'nodemcu', 'cloud', 'sensor', 'weather', 'greenhouse'],
      'gps-gsm': ['gps', 'gsm', 'tracking', 'sim800l', 'neo-6m', 'sms', 'cellular'],
      automation: ['automation', 'automated', 'smart', 'pump', 'irrigation', 'lock', 'servo', 'control', 'home']
    };

    let matchedCategories = [];
    for (const [cat, words] of Object.entries(keywords)) {
      if (words.some(word => prompt.includes(word))) {
        matchedCategories.push(cat);
      }
    }

    // Match for projectLevel options
    let matchedLevel = null;
    if (prompt.includes('school')) {
      matchedLevel = 'School';
    } else if (prompt.includes('diploma')) {
      matchedLevel = 'Diploma';
    } else if (prompt.includes('engineering') || prompt.includes('college')) {
      matchedLevel = 'Engineering';
    }

    return { maxPrice, matchedCategories, matchedLevel };
  };

  const executeAISearch = (prompt) => {
    const result = parseAISearch(prompt);
    setAiFilterResult(result);
  };

  const clearAISearch = () => {
    setAiFilterResult(null);
  };

  return {
    searchQuery,
    setSearchQuery,
    aiFilterResult,
    executeAISearch,
    clearAISearch
  };
};
