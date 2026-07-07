export const generateProductSchema = (project, config) => {
  if (!project) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": project.title,
    "description": project.description || 'Futuristic engineering project kit.',
    "image": project.image || config.defaultImage,
    "category": project.category || 'Engineering',
    "brand": {
      "@type": "Brand",
      "name": config.siteName
    },
    "url": `${config.siteUrl}/project/${project.slug}`,
    "offers": {
      "@type": "Offer",
      "url": `${config.siteUrl}/project/${project.slug}`,
      "priceCurrency": "INR",
      "price": project.price || "0",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": config.siteName
      }
    }
  };
};
