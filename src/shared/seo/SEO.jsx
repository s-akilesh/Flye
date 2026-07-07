import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoConfig } from './config/seoConfig';
import { buildMetaTags } from './builders/metaBuilder';
import { generateCanonicalUrl } from './builders/canonical';
import { generateOgMeta } from './builders/ogGenerator';
import { generateTwitterCard } from './builders/twitterCard';
import { generateOrganizationSchema } from './schemas/OrganizationSchema';
import { generateWebsiteSchema } from './schemas/WebsiteSchema';
import { generateProductSchema } from './schemas/ProductSchema';
import { generateBreadcrumbSchema } from './schemas/BreadcrumbSchema';
import { generateLocalBusinessSchema } from './schemas/LocalBusinessSchema';
import { PageType } from './constants/pageTypes';

export const SEO = (props) => {
  const location = useLocation();

  const {
    title,
    description,
    keywords,
    canonicalUrl,
    robots,
    pageType = 'website',
    noindex = false,
    page,
    data
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
      updateCanonicalLink(null);
    } else {
      updateCanonicalLink(resolvedCanonical);
    }

    // 5. Inject Structured JSON-LD Structured Data
    const updateJsonLd = (schemaId, jsonContent) => {
      let el = document.getElementById(schemaId);
      if (jsonContent) {
        if (!el) {
          el = document.createElement('script');
          el.setAttribute('type', 'application/ld+json');
          el.setAttribute('id', schemaId);
          document.head.appendChild(el);
        }
        el.textContent = JSON.stringify(jsonContent);
      } else if (el) {
        el.remove();
      }
    };

    // Home schemas
    if (page === PageType.HOME) {
      updateJsonLd('schema-org', generateOrganizationSchema(seoConfig));
      updateJsonLd('schema-website', generateWebsiteSchema(seoConfig));
    } else {
      updateJsonLd('schema-org', null);
      updateJsonLd('schema-website', null);
    }

    // Contact schemas
    if (page === PageType.CONTACT) {
      updateJsonLd('schema-localbusiness', generateLocalBusinessSchema(seoConfig));
    } else {
      updateJsonLd('schema-localbusiness', null);
    }

    // Project Product schemas
    if (page === PageType.PROJECT && data) {
      updateJsonLd('schema-product', generateProductSchema(data, seoConfig));
    } else {
      updateJsonLd('schema-product', null);
    }

    // Dynamic Breadcrumbs
    const breadcrumbs = [{ name: 'Home', url: '/' }];
    if (location.pathname !== '/') {
      const paths = location.pathname.split('/').filter(Boolean);
      if (paths[0] === 'projects') {
        breadcrumbs.push({ name: 'Projects', url: '/projects' });
      } else if (paths[0] === 'project' && paths[1]) {
        breadcrumbs.push({ name: 'Projects', url: '/projects' });
        breadcrumbs.push({ name: title || data?.title || 'Project Details', url: location.pathname });
      } else if (paths[0] === 'contact') {
        breadcrumbs.push({ name: 'Contact', url: '/contact' });
      } else if (paths[0] === 'printing') {
        breadcrumbs.push({ name: '3D Printing', url: '/printing' });
      } else {
        const label = paths[0].charAt(0).toUpperCase() + paths[0].slice(1);
        breadcrumbs.push({ name: label, url: location.pathname });
      }
    }

    if (!isAdminPath && breadcrumbs.length > 1) {
      updateJsonLd('schema-breadcrumbs', generateBreadcrumbSchema(breadcrumbs, seoConfig));
    } else {
      updateJsonLd('schema-breadcrumbs', null);
    }

    // Cleanup function when component unmounts
    return () => {
      ['schema-org', 'schema-website', 'schema-localbusiness', 'schema-product', 'schema-breadcrumbs'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    robots,
    pageType,
    isAdminPath,
    location.pathname,
    page,
    data,
    props
  ]);

  return null;
};
