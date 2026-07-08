import { seoConfig } from '../config/seoConfig.js';
import { generateCanonicalUrl } from '../builders/canonical.js';

export const privacySEO = () => {
  return {
    title: `Privacy Policy | ${seoConfig.siteName}`,
    description: 'Read the Privacy Policy of Flyen to understand how we collect, use, and protect your personal information.',
    canonicalUrl: generateCanonicalUrl('/privacy-policy', seoConfig)
  };
};
