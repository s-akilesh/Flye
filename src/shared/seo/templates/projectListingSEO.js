import { seoConfig } from '../seoConfig';
import { generateCanonicalUrl } from '../canonical';

export const projectListingSEO = () => {
  return {
    title: `Project Kits Catalog | ${seoConfig.siteName}`,
    description: 'Explore Flyen\'s catalog of premium engineering project kits, hardware builds, and interactive learning boards.',
    canonicalUrl: generateCanonicalUrl('/projects', seoConfig)
  };
};
