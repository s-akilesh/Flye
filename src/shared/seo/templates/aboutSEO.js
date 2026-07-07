import { seoConfig } from '../config/seoConfig.js';
import { generateCanonicalUrl } from '../builders/canonical.js';

export const aboutSEO = () => {
  return {
    title: `About Us | ${seoConfig.siteName}`,
    description: 'Learn more about Flyen, our vision, and our engineering workspaces and kits.',
    canonicalUrl: generateCanonicalUrl('/about', seoConfig)
  };
};
