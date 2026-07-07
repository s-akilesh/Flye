export const buildMetaTags = (params, config) => {
  const {
    description,
    keywords,
    robots,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    noindex,
    pageType = 'website'
  } = params;

  const meta = [];

  // Description
  const finalDesc = description || config.defaultDescription;
  if (finalDesc) {
    meta.push({ name: 'description', content: finalDesc });
  }

  // Keywords (bare minimum support)
  const finalKeywords = keywords || config.defaultKeywords;
  if (finalKeywords) {
    meta.push({ name: 'keywords', content: finalKeywords });
  }

  // Robots directives (noindex, nofollow)
  const finalRobots = noindex ? 'noindex, nofollow' : (robots || config.robotsDefault);
  if (finalRobots) {
    meta.push({ name: 'robots', content: finalRobots });
  }

  // Open Graph Site Metadata
  meta.push({ property: 'og:site_name', content: config.siteName });
  meta.push({ property: 'og:type', content: pageType });
  
  if (ogTitle) meta.push({ property: 'og:title', content: ogTitle });
  if (ogDescription) meta.push({ property: 'og:description', content: ogDescription });
  if (ogImage) meta.push({ property: 'og:image', content: ogImage });

  // Twitter Cards
  meta.push({ name: 'twitter:card', content: 'summary_large_image' });
  if (config.twitterHandle) {
    meta.push({ name: 'twitter:site', content: config.twitterHandle });
  }
  
  if (twitterTitle) meta.push({ name: 'twitter:title', content: twitterTitle });
  if (twitterDescription) meta.push({ name: 'twitter:description', content: twitterDescription });
  if (twitterImage) meta.push({ name: 'twitter:image', content: twitterImage });

  return meta;
};
