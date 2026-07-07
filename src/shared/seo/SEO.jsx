import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoConfig } from './seoConfig';
import { buildMetaTags } from './metaBuilder';
import { generateCanonicalUrl } from './canonical';
import { generateOgMeta } from './ogGenerator';
import { generateTwitterCard } from './twitterCard';

export const SEO = (props) => {
  const location = useLocation();

  const {
    title,
    description,
    keywords,
    canonicalUrl,
    robots,
    pageType = 'website',
    noindex = false
  } = props;

  // Enforce noindex automatically for all routes under /admin
  const isAdminPath = location.pathname.startsWith('/admin') || noindex;

  useEffect(() => {
    // 1. Resolve Document Title with fallback
    const resolvedTitle = title 
      ? `${title} | ${seoConfig.siteName}` 
      : seoConfig.defaultTitle;
    document.title = resolvedTitle;

    // 2. Generate Canonical URL
    const resolvedCanonical = canonicalUrl || generateCanonicalUrl(location.pathname, seoConfig);
    
    // 3. Compile Open Graph & Twitter fallbacks
    const ogMeta = generateOgMeta(props, seoConfig);
    const twitterMeta = generateTwitterCard(props, seoConfig, ogMeta);

    // 4. Generate meta tag payload
    const metaTags = buildMetaTags({
      description,
      keywords,
      robots,
      pageType,
      noindex: isAdminPath,
      ...ogMeta,
      ...twitterMeta
    }, seoConfig);

    // DOM Helper: Set or insert a meta tag by name or property
    const updateMetaTag = (name, property, content) => {
      let el;
      if (name) {
        el = document.querySelector(`meta[name="${name}"]`);
        if (!el && content) {
          el = document.createElement('meta');
          el.setAttribute('name', name);
          document.head.appendChild(el);
        }
      } else if (property) {
        el = document.querySelector(`meta[property="${property}"]`);
        if (!el && content) {
          el = document.createElement('meta');
          el.setAttribute('property', property);
          document.head.appendChild(el);
        }
      }
      if (el) {
        if (content) {
          el.setAttribute('content', content);
        } else {
          el.remove();
        }
      }
    };

    // DOM Helper: Set or insert link rel=canonical
    const updateCanonicalLink = (url) => {
      let el = document.querySelector('link[rel="canonical"]');
      if (!el && url) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
      }
      if (el) {
        if (url) {
          el.setAttribute('href', url);
        } else {
          el.remove();
        }
      }
    };

    // Apply all computed meta tags
    metaTags.forEach(tag => {
      updateMetaTag(tag.name, tag.property, tag.content);
    });

    // Handle canonical tag routing
    if (isAdminPath) {
      updateCanonicalLink(null); // Clean up canonical elements in admin/noindex routes
    } else {
      updateCanonicalLink(resolvedCanonical);
    }
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    robots,
    pageType,
    isAdminPath,
    location.pathname,
    props
  ]);

  return null;
};
