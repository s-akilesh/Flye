export const generateOgMeta = (params, config) => {
  return {
    ogTitle: params.ogTitle || params.title || config.defaultTitle,
    ogDescription: params.ogDescription || params.description || config.defaultDescription,
    ogImage: params.ogImage || config.defaultImage
  };
};
