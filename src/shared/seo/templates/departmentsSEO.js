import { seoConfig } from '../config/seoConfig.js';
import { generateCanonicalUrl } from '../builders/canonical.js';

export const departmentsSEO = () => {
  return {
    title: `Departments & Labs | ${seoConfig.siteName}`,
    description: 'Explore the various engineering departments, electronics labs, and automation divisions at Flyen.',
    canonicalUrl: generateCanonicalUrl('/departments', seoConfig)
  };
};
