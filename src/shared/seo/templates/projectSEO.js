import { seoConfig } from '../seoConfig';
import { generateCanonicalUrl } from '../canonical';

export const projectSEO = (project) => {
  if (!project) {
    return {
      title: `Project Details | ${seoConfig.siteName}`,
      description: 'Futuristic technical engineering project kit details.',
      canonicalUrl: generateCanonicalUrl('/projects', seoConfig)
    };
  }
  const title = `${project.title} | ${seoConfig.siteName}`;
  const description = project.description || 'Learn and build with this engineering project kit.';
  const canonicalUrl = generateCanonicalUrl(`/project/${project.slug}`, seoConfig);
  return {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: project.image || seoConfig.defaultImage,
    canonicalUrl
  };
};
