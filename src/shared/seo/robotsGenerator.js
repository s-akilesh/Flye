export const generateRobotsTxt = (config) => {
  const siteUrl = config.siteUrl || 'https://flyen.in';
  return `User-agent: *

Allow: /

Disallow: /admin
Disallow: /admin/*
Disallow: /dashboard
Disallow: /settings
Disallow: /login

Sitemap: ${siteUrl}/sitemap.xml
`;
};
