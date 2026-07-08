import React, { createContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeAnalytics, trackEvent } from './analytics.js';

export const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const location = useLocation();

  // 1. Initialize Analytics on client startup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeAnalytics();
    }
  }, []);

  // 2. Track page views when pathname changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track standard page view event in GA4
    trackEvent('page_view', {
      page_path: location.pathname + location.search,
      page_title: document.title,
      page_location: window.location.href
    });
  }, [location.pathname, location.search]);

  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
