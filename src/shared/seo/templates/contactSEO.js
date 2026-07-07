import { seoConfig } from '../seoConfig';
import { generateCanonicalUrl } from '../canonical';

export const contactSEO = () => {
  return {
    title: `Contact Our Experts | ${seoConfig.siteName}`,
    description: 'Get in touch with the Flyen team for support, product enquiries, and technical consultation.',
    canonicalUrl: generateCanonicalUrl('/contact', seoConfig)
  };
};
