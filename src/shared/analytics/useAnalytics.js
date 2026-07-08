import { useContext } from 'react';
import { AnalyticsContext } from './AnalyticsProvider.jsx';
import { eventTracker } from './eventTracker.js';
import { trackEvent } from './analytics.js';

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    console.warn('[Analytics] useAnalytics was called outside of an AnalyticsProvider.');
  }
  return {
    trackEvent,
    ...eventTracker
  };
};
