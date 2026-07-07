export const generateLocalBusinessSchema = (config) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": config.siteName,
    "image": config.logo || config.defaultImage,
    "url": config.siteUrl,
    "telephone": "+919876543210",
    "email": config.contactEmail || "support@flyen.in",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    },
    "areaServed": "India",
    "priceRange": "$$"
  };
};
