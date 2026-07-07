import { seoConfig } from '../config/seoConfig.js';
import { generateCanonicalUrl } from '../builders/canonical.js';

export const printingSEO = () => {
  // TODO: In a future sprint, this page should be enhanced to use the "Service" structured data type
  return {
    title: `3D Printing Service | ${seoConfig.siteName}`,
    description: 'Futuristic premium 3D printing and rapid prototyping services on Flyen.',
    canonicalUrl: generateCanonicalUrl('/printing', seoConfig)
  };
};
