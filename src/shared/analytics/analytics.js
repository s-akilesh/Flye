import { analyticsConfig } from './analyticsConfig.js';

// Holds registered analytics providers/destinations
const providers = [];

/**
 * Registers an analytics provider (e.g., GA4, Meta Pixel)
 * @param {Object} provider - The provider object.
 */
export const registerProvider = (provider) => {
  providers.push(provider);
};

/**
 * Initializes all registered analytics providers
 */
export const initializeAnalytics = () => {
  if (typeof window === 'undefined') return;

  // 1. Google Analytics 4 Provider Setup
  const ga4Provider = {
    name: 'GA4',
    initialize() {
      const { measurementId, isProduction } = analyticsConfig;
      if (!measurementId) {
        console.warn('[Analytics] GA4 measurement ID missing. Skipping initialization.');
        return;
      }

      if (!isProduction) {
        console.log(`[Analytics] (Dev) GA4 Initialized with ID: ${measurementId}`);
        return;
      }

      try {
        // Prevent duplicate script loads
        if (window.dataLayer && window.gtag) return;

        // Load Global Site Tag (gtag.js)
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
          window.dataLayer.push(arguments);
        };
        
        window.gtag('js', new Date());
        // Disable automatic page view tracking in default config to prevent double-page views
        window.gtag('config', measurementId, { send_page_view: false });
        console.log('[Analytics] GA4 script loaded successfully.');
      } catch (err) {
        console.error('[Analytics] Failed to load GA4 script:', err);
      }
    },
    trackEvent(name, params) {
      const { measurementId, isProduction } = analyticsConfig;
      if (!measurementId) return;

      if (!isProduction) {
        console.log(`[Analytics] Event: "${name}"`, params);
        return;
      }

      if (typeof window !== 'undefined' && window.gtag) {
        try {
          window.gtag('event', name, params);
        } catch (e) {
          console.warn('[Analytics] Failed to send gtag event:', e);
        }
      }
    }
  };

  registerProvider(ga4Provider);

  // Initialize all registered providers
  providers.forEach(p => {
    try {
      p.initialize();
    } catch (err) {
      console.error(`[Analytics] Provider "${p.name}" failed to initialize:`, err);
    }
  });
};

/**
 * Dispatches an event to all registered tracking providers
 * @param {string} name - Event name.
 * @param {Object} params - Event properties.
 */
export const trackEvent = (name, params = {}) => {
  providers.forEach(p => {
    try {
      p.trackEvent(name, params);
    } catch (err) {
      console.warn(`[Analytics] Provider "${p.name}" failed to track event "${name}":`, err);
    }
  });
};
