export const analyticsConfig = {
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  isProduction: import.meta.env.PROD,
  debugMode: !import.meta.env.PROD
};
