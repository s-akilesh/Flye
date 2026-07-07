export const generateWebsiteSchema = (config) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": config.siteName,
    "url": config.siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${config.siteUrl}/projects?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
};
