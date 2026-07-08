import { seoConfig } from '../config/seoConfig.js';
import { generateCanonicalUrl } from '../builders/canonical.js';

export const termsSEO = () => {
  return {
    title: `Terms & Conditions | ${seoConfig.siteName}`,
    description: 'Read the Terms and Conditions of Flyen covering website usage, learning platforms, and product licensing.',
    canonicalUrl: generateCanonicalUrl('/terms-and-conditions', seoConfig)
  };
};
