export const generateSitemapXml = (config, projects = []) => {
  const siteUrl = config.siteUrl || 'https://flyen.in';
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Helper to add URL node
  const addUrl = (loc, priority, freq) => {
    xml += '  <url>\n';
    xml += `    <loc>${siteUrl}${loc}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${freq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += '  </url>\n';
  };

  // 1. Static Pages
  addUrl('/', '1.0', 'daily');
  addUrl('/projects', '0.9', 'weekly');
  addUrl('/contact', '0.7', 'monthly');
  addUrl('/printing', '0.7', 'monthly');
  addUrl('/about', '0.5', 'monthly');
  addUrl('/departments', '0.5', 'monthly');
  addUrl('/privacy-policy', '0.3', 'yearly');
  addUrl('/terms-and-conditions', '0.3', 'yearly');

  // 2. Dynamic Projects Slugs
  projects.forEach((proj) => {
    if (proj.slug) {
      addUrl(`/project/${proj.slug}`, '0.8', 'weekly');
    }
  });

  xml += '</urlset>\n';
  return xml;
};
