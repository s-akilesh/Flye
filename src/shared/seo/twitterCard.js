export const generateTwitterCard = (params, config, ogMeta) => {
  return {
    twitterTitle: params.twitterTitle || ogMeta.ogTitle || params.title || config.defaultTitle,
    twitterDescription: params.twitterDescription || ogMeta.ogDescription || params.description || config.defaultDescription,
    twitterImage: params.twitterImage || ogMeta.ogImage || config.defaultImage
  };
};
