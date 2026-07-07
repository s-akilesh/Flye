import { seoConfig } from '../config/seoConfig.js';
import { generateCanonicalUrl } from '../builders/canonical.js';

export const projectListingSEO = () => {
  return {
    title: `Project Kits Catalog | ${seoConfig.siteName}`,
    description: 'Explore Flyen\'s catalog of premium engineering project kits, hardware builds, and interactive learning boards.',
    canonicalUrl: generateCanonicalUrl('/projects', seoConfig)
  };
};
