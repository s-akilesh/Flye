import { seoConfig } from '../config/seoConfig.js';
import { generateCanonicalUrl } from '../builders/canonical.js';

export const homeSEO = () => {
  return {
    title: '', // Leave empty to trigger the root defaultTitle fallback in SEO.jsx
    description: seoConfig.defaultDescription,
    ogTitle: seoConfig.defaultTitle,
    ogDescription: seoConfig.defaultDescription,
    ogImage: seoConfig.defaultImage,
    canonicalUrl: generateCanonicalUrl('/', seoConfig)
  };
};
