export const generateCanonicalUrl = (path, config) => {
  const baseUrl = config.siteUrl || 'https://flyen.in';
  if (!path) return baseUrl;
  
  // Clean trailing slash and verify leading slash
  const cleanPath = '/' + path.replace(/^\/|\/$/g, '');
  return `${baseUrl}${cleanPath === '/' ? '' : cleanPath}`;
};
