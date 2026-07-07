export const generateBreadcrumbSchema = (breadcrumbs, config) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": crumb.name,
      "item": crumb.url.startsWith('http') ? crumb.url : `${config.siteUrl}${crumb.url}`
    }))
  };
};
