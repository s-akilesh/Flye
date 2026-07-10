import { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { pageSettingsService } from '../services/pageSettingsService.js';
import { metadataManager } from './metadataManager.js';
import { ROUTES } from '../constants/routes.js';
import { routeMetadata } from './routeMetadata.js';
import { PageType } from './constants/pageTypes.js';
import { generateSEO } from './generateSEO.js';
import { supabase } from '../services/supabaseClient.js';

export const getRouteConfig = (pathname) => {
  if (routeMetadata[pathname]) {
    return routeMetadata[pathname];
  }
  for (const pattern of Object.keys(routeMetadata)) {
    const match = matchPath({ path: pattern, end: true }, pathname);
    if (match) {
      return {
        ...routeMetadata[pattern],
        params: match.params
      };
    }
  }
  return null;
};

export const usePageMetadata = () => {
  const location = useLocation();

  useEffect(() => {
    let active = true;

    const loadAndApplySEO = async () => {
      const pathname = location.pathname;
      const routeConfig = getRouteConfig(pathname);
      const pageType = routeConfig?.pageType || 'website';

      // 1. Fetch dynamic project data if applicable
      let projectData = null;
      if (pageType === PageType.PROJECT && routeConfig?.params?.slug) {
        try {
          const { data } = await supabase
            .from('projects')
            .select('*')
            .eq('slug', routeConfig.params.slug)
            .maybeSingle();
          projectData = data;
        } catch (err) {
          console.error("Failed to load project details for SEO:", err);
        }
      }

      if (!active) return;

      try {
        // 2. Fetch page settings from database
        const dbSettings = await pageSettingsService.getPageSettings(pathname);

        if (!active) return;

        // Priority 1: Use database values if they exist (are saved) and are enabled
        if (dbSettings && dbSettings.created_at && dbSettings.is_enabled) {
          metadataManager.updateMetadata({
            title: dbSettings.page_title,
            description: dbSettings.meta_description,
            keywords: dbSettings.keywords,
            canonicalUrl: dbSettings.canonical_url,
            robots: `${dbSettings.robots_index ? 'index' : 'noindex'}, ${dbSettings.robots_follow ? 'follow' : 'nofollow'}`,
            ogTitle: dbSettings.og_title,
            ogDescription: dbSettings.og_description,
            ogImage: dbSettings.og_image,
            pageType: pageType === PageType.PROJECT ? 'article' : 'website',
            page: pageType,
            data: projectData,
            route: pathname
          });
          return;
        }
      } catch (err) {
        console.error("Failed to load database SEO settings, falling back to static templates:", err);
      }

      // Priority 2 / Fallback behavior: Generate from static templates
      const fallbackSEO = generateSEO(pageType, projectData);
      metadataManager.updateMetadata({
        title: fallbackSEO.title,
        description: fallbackSEO.description,
        keywords: fallbackSEO.keywords,
        canonicalUrl: fallbackSEO.canonicalUrl,
        robots: fallbackSEO.robots,
        ogTitle: fallbackSEO.ogTitle,
        ogDescription: fallbackSEO.ogDescription,
        ogImage: fallbackSEO.ogImage,
        pageType: pageType === PageType.PROJECT ? 'article' : 'website',
        page: pageType,
        data: projectData,
        route: pathname
      });
    };

    loadAndApplySEO();

    return () => {
      active = false;
    };
  }, [location.pathname]);
};
