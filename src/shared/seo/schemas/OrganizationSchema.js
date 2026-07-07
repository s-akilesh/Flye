export const generateOrganizationSchema = (config) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": config.siteName,
    "url": config.siteUrl,
    "logo": config.logo || config.defaultImage,
    "description": config.defaultDescription,
    "contactPoint": {
      "@type": "ContactPoint",
      "email": config.contactEmail || "support@flyen.in",
      "contactType": "customer service"
    },
    "sameAs": [
      config.facebookPage || "",
      config.linkedinPage || "",
      config.twitterHandle ? `https://twitter.com/${config.twitterHandle.replace('@', '')}` : ""
    ].filter(Boolean)
  };
};
